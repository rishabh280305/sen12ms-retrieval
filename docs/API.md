# API

| Method | Route | Authentication | Behavior |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Service health |
| GET/POST/DELETE | `/api/auth/demo` | Public/cookie | Manage the signed demo session |
| GET/POST | `/api/searches` | Demo session | Read or persist search metadata |
| POST | `/api/retrieval/evaluate` | Demo session | Rank submitted SAR→optical embeddings and calculate metrics |
| GET | `/api/catalog` | Demo session | Query identifiers from the official SEN12MS holdout manifest |
| GET/POST | `/api/annotations` | Demo session | Read or upsert owner-filtered tile-review annotations |

Evaluation input must contain equal-sized paired arrays. Matching indices are treated as the relevant pairs. The response explicitly states that submitted vectors are not necessarily learned embeddings.

The catalog response includes its source URL, the official dataset download page, and `imageryBundled: false`. Filenames are paired by the naming convention documented by the dataset authors; the service does not infer thumbnails or coordinates.
