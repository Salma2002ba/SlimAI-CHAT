"""Load markdown corpus and split into overlapping character windows."""

from __future__ import annotations

import logging
from pathlib import Path

from app.services.rag.types import TextChunk

logger = logging.getLogger(__name__)


def _default_knowledge_dir() -> Path:
    # backend/knowledge next to package root (app/ -> parent -> parent = backend/)
    return Path(__file__).resolve().parent.parent.parent.parent / "knowledge"


def load_markdown_chunks(
    knowledge_dir: Path,
    *,
    chunk_size: int,
    chunk_overlap: int,
) -> list[TextChunk]:
    if not knowledge_dir.is_dir():
        logger.warning("RAG knowledge dir missing: %s", knowledge_dir)
        return []

    chunks: list[TextChunk] = []
    for path in sorted(knowledge_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        source = path.name
        chunks.extend(_chunk_file(text, source=source, chunk_size=chunk_size, overlap=chunk_overlap))
    logger.info("RAG loaded %s chunks from %s", len(chunks), knowledge_dir)
    return chunks


def _chunk_file(text: str, *, source: str, chunk_size: int, overlap: int) -> list[TextChunk]:
    text = text.strip()
    if not text:
        return []

    overlap = min(overlap, max(chunk_size - 1, 0))
    out: list[TextChunk] = []
    start = 0
    idx = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        piece = text[start:end].strip()
        if piece:
            out.append(TextChunk(chunk_id=f"{source}#{idx}", source=source, text=piece))
            idx += 1
        if end >= len(text):
            break
        start = max(end - overlap, start + 1)
    return out
