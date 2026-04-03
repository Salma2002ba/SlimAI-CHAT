## SlimAI Backend (placeholder)

This directory is reserved for the future SlimAI backend (e.g. Python/FastAPI) that will connect to PostgreSQL.

### Proposed structure

When implementing the backend, a recommended layout is:

- `app/`
  - `main.py` (FastAPI application entrypoint)
  - `api/` (route definitions / routers)
  - `services/` (business logic, orchestrating LLM/RAG and data access)
  - `models/` (Pydantic schemas, domain models)
  - `db/`
    - `session.py` (database session / engine setup using `DATABASE_URL`)
    - `repositories/` (DB access layer)
  - `llm/` (integration points for LLM / RAG)
- `tests/`
- `pyproject.toml` (FastAPI, uvicorn, SQL toolkit/ORM, etc.)
- `Dockerfile` (backend image, exposing port 8000)

The backend will be attached to PostgreSQL via the `DATABASE_URL` environment variable defined at the repo root (`.env` / `.env.example`), and the `backend` service in `docker-compose.yml` will share the same network as `postgres`.

