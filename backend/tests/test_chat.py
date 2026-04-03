from fastapi.testclient import TestClient

from app.main import app


def test_chat_returns_503_when_gemini_not_configured(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    from app.core import config as config_module

    config_module.get_settings.cache_clear()

    with TestClient(app) as client:
        r = client.post(
            "/api/chat",
            json={
                "language": "fr",
                "messages": [{"role": "user", "text": "hello"}],
            },
        )
    assert r.status_code == 503
    assert "GEMINI" in r.json()["detail"].upper()

    config_module.get_settings.cache_clear()
