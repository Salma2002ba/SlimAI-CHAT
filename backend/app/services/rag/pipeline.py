"""RAG orchestration: cache, context formatting, retrieval-only answers."""

from __future__ import annotations

from pathlib import Path

from app.core.config import Settings
from app.services.rag.ingest import _default_knowledge_dir, load_markdown_chunks
from app.services.rag.retrieve import retrieve_top_k
from app.services.rag.types import TextChunk

_chunk_cache: list[TextChunk] | None = None
_cache_key: tuple[str, int, int] | None = None


def reset_chunk_cache() -> None:
    global _chunk_cache, _cache_key
    _chunk_cache = None
    _cache_key = None


def _knowledge_path(settings: Settings) -> Path:
    raw = (settings.rag_knowledge_dir or "").strip()
    if raw:
        return Path(raw)
    return _default_knowledge_dir()


def warm_rag_cache(settings: Settings) -> list[TextChunk]:
    global _chunk_cache, _cache_key
    key = (
        str(_knowledge_path(settings).resolve()),
        settings.rag_chunk_size,
        settings.rag_chunk_overlap,
    )
    if _chunk_cache is not None and _cache_key == key:
        return _chunk_cache
    _chunk_cache = load_markdown_chunks(
        _knowledge_path(settings),
        chunk_size=settings.rag_chunk_size,
        chunk_overlap=settings.rag_chunk_overlap,
    )
    _cache_key = key
    return _chunk_cache


def get_rag_context_for_query(query: str, settings: Settings) -> tuple[str, list[tuple[float, TextChunk]]]:
    if not settings.rag_enabled:
        return "", []
    chunks = warm_rag_cache(settings)
    if not chunks:
        return "", []
    hits = retrieve_top_k(query, chunks, settings.rag_top_k)
    if not hits:
        return "", []
    blocks = []
    for score, ch in hits:
        blocks.append(f"[{ch.chunk_id} | score={score:.3f}]\n{ch.text}")
    return "\n\n---\n\n".join(blocks), hits


def format_rag_only_markdown(
    query: str,
    language: str,
    settings: Settings,
) -> str:
    """Knowledge-only mode: no LLM — shows retrieval + excerpts (demo / offline)."""
    ctx, hits = get_rag_context_for_query(query, settings)
    if language == "fr":
        header = "### Mode RAG (retrieval seul — pas d’appel LLM)\n\n"
        intro = f"**Requête :** {query}\n\n"
        if not hits:
            return header + intro + "_Aucun chunk chargé. Vérifie `knowledge/` et `RAG_KNOWLEDGE_DIR`._"
        body = "**Extraits les plus pertinents (BM25 lexical) :**\n\n" + (
            ctx if ctx else ""
        )
        footer = (
            "\n\n---\n_Pour synthétiser ces passages avec un LLM, utilise `CHAT_PROVIDER=gemini` ou `auto` avec clé._"
        )
        return header + intro + body + footer

    header = "### RAG mode (retrieval only — no LLM call)\n\n"
    intro = f"**Query:** {query}\n\n"
    if not hits:
        return header + intro + "_No chunks loaded. Check `knowledge/` and `RAG_KNOWLEDGE_DIR`._"
    body = "**Top lexical (BM25-style) excerpts:**\n\n" + (ctx if ctx else "")
    footer = "\n\n---\n_To synthesize with an LLM, use `CHAT_PROVIDER=gemini` or `auto` with API key._"
    return header + intro + body + footer
