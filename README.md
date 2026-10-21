# SEN12MS Cross-Modal Retrieval

A research application for cross-modal retrieval between Sentinel-1 SAR and Sentinel-2 optical imagery. The live app persists query configurations and computes cosine rankings, paired Recall@K, and mean reciprocal rank from submitted embeddings. It never labels diagnostic vectors as trained-model output.

## Verified capabilities

- Authenticated saved-search history in an isolated Neon schema
- Validated server-side embedding evaluator with unit tests
- CPU/GPU-aware PyTorch dual-encoder training entrypoint with symmetric contrastive loss
- Reproducible artifact export and metrics generation from user-supplied SEN12MS arrays
- Official dataset provenance and spatial hold-out guidance
- Cloud CI and a production Playwright flow

Actual trained embeddings and published performance remain pending a lawful dataset download and a recorded training run. See [dataset provenance](docs/DATASET.md), [architecture](docs/ARCHITECTURE.md), [API](docs/API.md), and [deployment](docs/DEPLOYMENT.md).

Commands: `npm run dev`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, and `npm run seed`.
