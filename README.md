# SEN12MS Cross-Modal Retrieval

A research application for learned cross-modal retrieval between Sentinel-1 SAR and Sentinel-2 optical imagery. Phase 0 provides the public mission shell and health endpoint; model scores will only be published after reproducible evaluation.

## Current scope

- Responsive earth-observation mission interface
- `GET /api/health` with a non-cached server timestamp
- Clear separation between planned learned retrieval and shipped behavior

Requires Node.js 22+. Run `npm install`, then `npm run dev`. See `.env.example` for future integrations.
