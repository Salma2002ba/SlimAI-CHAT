## SlimAI Monorepo

Monorepo structure prepared for a real-world SlimAI project:

- `frontend/` : Vite + React app (existing Gemini-generated UI, moved here)
- `backend/` : future Python/FastAPI backend
- `data/` : datasets, corpora, configuration data
- `docs/` : technical documentation, architecture, ADRs
- `scripts/` : utility scripts (maintenance, tooling, migrations)
- `.github/workflows/` : CI/CD pipelines (CI + GitHub Pages deployment)

### Frontend

See `frontend/README.md` for how to run the SlimAI web app locally.

### Backend (future)

Reserved for a Python/FastAPI backend, with its own dependencies and tooling.

### Dev, CI & Docker

- GitHub Actions CI validates the frontend build and Docker image.
- GitHub Pages workflow deploys the built frontend from `frontend/`.
- A minimal `Dockerfile` and `docker-compose.yml` are provided to containerize the frontend and prepare for future services.

