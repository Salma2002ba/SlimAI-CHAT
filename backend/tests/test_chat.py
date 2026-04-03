from fastapi.testclient import TestClient

from app.main import app


def test_chat_mock_mode_without_gemini(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("CHAT_PROVIDER", "mock")
    from app.core import config as config_module

    config_module.get_settings.cache_clear()
    try:
        with TestClient(app) as client:
            r = client.post(
                "/api/chat",
                json={
                    "language": "fr",
                    "messages": [{"role": "user", "text": "hello"}],
                },
            )
        assert r.status_code == 200
        body = r.json()
        assert "text" in body
        assert "Mode démo" in body["text"] or "démo" in body["text"].lower()
    finally:
        monkeypatch.delenv("CHAT_PROVIDER", raising=False)
        config_module.get_settings.cache_clear()


def test_chat_auto_without_key_uses_mock(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("CHAT_PROVIDER", "auto")
    from app.core import config as config_module

    config_module.get_settings.cache_clear()
    try:
        with TestClient(app) as client:
            r = client.post(
                "/api/chat",
                json={
                    "language": "en",
                    "messages": [{"role": "user", "text": "hi"}],
                },
            )
        assert r.status_code == 200
        assert "Demo mode" in r.json()["text"] or "demo" in r.json()["text"].lower()
    finally:
        config_module.get_settings.cache_clear()


def test_chat_gemini_forced_without_key_returns_503(monkeypatch) -> None:
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("CHAT_PROVIDER", "gemini")
    from app.core import config as config_module

    config_module.get_settings.cache_clear()
    try:
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
    finally:
        monkeypatch.delenv("CHAT_PROVIDER", raising=False)
        config_module.get_settings.cache_clear()
