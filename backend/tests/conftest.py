import os

# Must run before any `app` import so `app.db.session` picks up test DB settings.
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
