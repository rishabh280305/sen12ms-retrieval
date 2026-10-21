# Architecture

The deployed Next.js service owns authentication, saved experiment metadata, and bounded evaluation requests. Zod limits evaluation to 64 paired vectors with 256 dimensions, preventing unbounded serverless work. The evaluator normalizes vectors, performs exhaustive cosine ranking, and calculates Recall@K and MRR without claiming how vectors were produced.

`ml/train.py` is the offline training boundary. It reads aligned two-channel SAR and thirteen-channel optical NPZ arrays, trains separate convolutional encoders with symmetric contrastive loss, evaluates a held-out split, and emits both a state dict and calculated metrics. Full training is deliberately excluded from Vercel request handlers.
