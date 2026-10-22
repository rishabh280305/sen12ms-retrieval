# SEN12MS Cross-Modal Retrieval

A research application for cross-modal retrieval between Sentinel-1 SAR and Sentinel-2 optical imagery. The live app persists query configurations and computes cosine rankings, paired Recall@K, and mean reciprocal rank from submitted embeddings. It never labels diagnostic vectors as trained-model output.

## Verified capabilities

- Authenticated saved-search history in an isolated Neon schema
- Validated server-side embedding evaluator with unit tests
- CPU/GPU-aware PyTorch dual-encoder training entrypoint with symmetric contrastive loss
- Reproducible artifact export and metrics generation from user-supplied SEN12MS arrays
- Live catalog backed by the official holdout manifest, paired-modality filename derivation, persistent annotations, and CSV metadata export
- Checksum-pinned manual GitHub Actions training workflow plus learned embedding export and exact cosine Top-K retrieval scripts
- Official dataset provenance and spatial hold-out guidance
- Cloud CI and a production Playwright flow

Actual trained embeddings and published performance remain intentionally unpublished until a lawful subset URL is supplied to the cloud workflow and that run's artifacts are retained. See [dataset provenance](docs/DATASET.md), [architecture](docs/ARCHITECTURE.md), [API](docs/API.md), and [deployment](docs/DEPLOYMENT.md).

Commands: `npm run dev`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, and `npm run seed`.
