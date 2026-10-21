# API

| Method | Route | Authentication | Behavior |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Service health |
| GET/POST/DELETE | `/api/auth/demo` | Public/cookie | Manage the signed demo session |
| GET/POST | `/api/searches` | Demo session | Read or persist search metadata |
| POST | `/api/retrieval/evaluate` | Demo session | Rank submitted SAR→optical embeddings and calculate metrics |

Evaluation input must contain equal-sized paired arrays. Matching indices are treated as the relevant pairs. The response explicitly states that submitted vectors are not necessarily learned embeddings.
