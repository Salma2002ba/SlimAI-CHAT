## SlimAI backend (FastAPI)

Minimal API with PostgreSQL via SQLAlchemy. Tables are created on startup (`create_all`); no migrations for now.

### Layout

- `app/main.py` — FastAPI app, CORS, lifespan (creates tables)
- `app/api/routes/` — HTTP routers (`/health`, `/db-health`, `/api/messages`)
- `app/models/` — SQLAlchemy models
- `app/schemas/` — Pydantic request/response types
- `app/db/` — engine, sessions
- `app/core/config.py` — `DATABASE_URL`, `CORS_ORIGINS`

### Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | yes | e.g. `postgresql://…` from Railway Postgres (reference variable) or local Docker |
| `CORS_ORIGINS` | no | Origins allowed by CORS: comma list and/or JSON array, e.g. `https://a.com,https://b.com` or `["https://a.com","https://b.com"]` (quotes optional per item) |

Railway and similar hosts set `PORT`; the Docker image runs Uvicorn on `${PORT:-8000}`.

**Railway:** add a variable reference `DATABASE_URL` from your Postgres service on the API service. If Railway only injected `PGHOST` / `PGUSER` / `PGPASSWORD` / `PGDATABASE`, the app builds a URL from those automatically (with `sslmode=require` when Railway env is detected).

### Local (without Docker)

From `backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
set DATABASE_URL=postgresql://slimai_user:slimai_password@localhost:5432/slimai
uvicorn app.main:app --reload --port 8000
```

With Postgres from repo root: `docker compose up -d postgres`, then point `DATABASE_URL` at `localhost:5432`.

### Docker Compose

From repo root (with `.env` copied from `.env.example` and values filled in):

```bash
docker compose up --build backend postgres
```

Check: `GET http://localhost:8000/health`, `GET http://localhost:8000/db-health`, `GET http://localhost:8000/api/messages`.

### Tests

```bash
cd backend
pip install -r requirements.txt
pytest
```

Uses in-memory SQLite unless `DATABASE_URL` is already set.
