"""Export normalized SAR/optical embeddings and retrieval metrics from a trained artifact."""
import argparse, json
from pathlib import Path
import numpy as np, torch
from torch.utils.data import DataLoader
from train import DualEncoder, PairedTiles, evaluate

def main():
    parser=argparse.ArgumentParser();parser.add_argument("--data",type=Path,required=True);parser.add_argument("--model",type=Path,required=True);parser.add_argument("--output",type=Path,default=Path("artifacts/embeddings.npz"));args=parser.parse_args()
    checkpoint=torch.load(args.model,map_location="cpu",weights_only=True);model=DualEncoder(checkpoint["embedding_dim"]);model.load_state_dict(checkpoint["state_dict"]);model.eval();dataset=PairedTiles(args.data);loader=DataLoader(dataset,batch_size=32)
    sar_vectors=[];optical_vectors=[]
    with torch.inference_mode():
        for sar,optical in loader:
            left,right=model(sar,optical);sar_vectors.append(left.numpy());optical_vectors.append(right.numpy())
    args.output.parent.mkdir(parents=True,exist_ok=True);np.savez_compressed(args.output,sar=np.concatenate(sar_vectors),optical=np.concatenate(optical_vectors));metrics=evaluate(model,loader,torch.device("cpu"));args.output.with_suffix(".metrics.json").write_text(json.dumps(metrics,indent=2))
if __name__=="__main__":main()
