"""CPU-feasible two-encoder SEN12MS training entrypoint.

Input is a user-created NPZ containing aligned arrays named ``sar`` (N, 2, H, W)
and ``optical`` (N, 13, H, W). No dataset or metric is bundled or fabricated.
"""

from __future__ import annotations

import argparse
import json
import random
from pathlib import Path

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, Dataset, random_split


class PairedTiles(Dataset):
    def __init__(self, path: Path) -> None:
        data = np.load(path, mmap_mode="r")
        self.sar = data["sar"]
        self.optical = data["optical"]
        if len(self.sar) != len(self.optical) or self.sar.ndim != 4 or self.optical.ndim != 4:
            raise ValueError("Expected aligned 4D sar and optical arrays")
        if self.sar.shape[1] != 2 or self.optical.shape[1] != 13:
            raise ValueError("Expected 2 SAR channels and 13 optical channels")

    def __len__(self) -> int:
        return len(self.sar)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        sar = torch.from_numpy(np.asarray(self.sar[index], dtype=np.float32))
        optical = torch.from_numpy(np.asarray(self.optical[index], dtype=np.float32))
        return sar, optical


class Encoder(nn.Module):
    def __init__(self, channels: int, embedding_dim: int) -> None:
        super().__init__()
        self.network = nn.Sequential(
            nn.Conv2d(channels, 32, 3, stride=2, padding=1), nn.BatchNorm2d(32), nn.GELU(),
            nn.Conv2d(32, 64, 3, stride=2, padding=1), nn.BatchNorm2d(64), nn.GELU(),
            nn.Conv2d(64, 128, 3, stride=2, padding=1), nn.GELU(),
            nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(128, embedding_dim),
        )

    def forward(self, value: torch.Tensor) -> torch.Tensor:
        return nn.functional.normalize(self.network(value), dim=1)


class DualEncoder(nn.Module):
    def __init__(self, embedding_dim: int) -> None:
        super().__init__()
        self.sar = Encoder(2, embedding_dim)
        self.optical = Encoder(13, embedding_dim)

    def forward(self, sar: torch.Tensor, optical: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        return self.sar(sar), self.optical(optical)


def contrastive_loss(sar: torch.Tensor, optical: torch.Tensor, temperature: float) -> torch.Tensor:
    logits = sar @ optical.T / temperature
    labels = torch.arange(len(sar), device=sar.device)
    return (nn.functional.cross_entropy(logits, labels) + nn.functional.cross_entropy(logits.T, labels)) / 2


@torch.inference_mode()
def evaluate(model: DualEncoder, loader: DataLoader, device: torch.device) -> dict[str, float]:
    model.eval()
    sar_vectors, optical_vectors = [], []
    for sar, optical in loader:
        left, right = model(sar.to(device), optical.to(device))
        sar_vectors.append(left.cpu())
        optical_vectors.append(right.cpu())
    sar = torch.cat(sar_vectors)
    optical = torch.cat(optical_vectors)
    ranking = (sar @ optical.T).argsort(dim=1, descending=True)
    targets = torch.arange(len(sar)).unsqueeze(1)
    ranks = (ranking == targets).nonzero()[:, 1] + 1
    return {"recall_at_1": float((ranks <= 1).float().mean()), "recall_at_5": float((ranks <= 5).float().mean()), "mrr": float((1 / ranks.float()).mean()), "pairs": len(sar)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("artifacts"))
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--embedding-dim", type=int, default=64)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    random.seed(args.seed); np.random.seed(args.seed); torch.manual_seed(args.seed)
    dataset = PairedTiles(args.data)
    validation_size = max(1, round(len(dataset) * 0.2))
    train_data, validation_data = random_split(dataset, [len(dataset) - validation_size, validation_size], generator=torch.Generator().manual_seed(args.seed))
    train_loader = DataLoader(train_data, batch_size=args.batch_size, shuffle=True)
    validation_loader = DataLoader(validation_data, batch_size=args.batch_size)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DualEncoder(args.embedding_dim).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=1e-4)
    for _ in range(args.epochs):
        model.train()
        for sar, optical in train_loader:
            optimizer.zero_grad(set_to_none=True)
            left, right = model(sar.to(device), optical.to(device))
            loss = contrastive_loss(left, right, 0.07)
            loss.backward(); optimizer.step()
    metrics = evaluate(model, validation_loader, device)
    args.output.mkdir(parents=True, exist_ok=True)
    torch.save({"state_dict": model.state_dict(), "embedding_dim": args.embedding_dim, "seed": args.seed}, args.output / "dual_encoder.pt")
    (args.output / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
