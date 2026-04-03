from fastapi import APIRouter, Query

from app.core.config import get_settings
from app.schemas.rag import RagChunkPublic, RagSearchResponse, RagStatsResponse
from app.services.rag.ingest import _default_knowledge_dir
from app.services.rag.pipeline import warm_rag_cache
from app.services.rag.retrieve import retrieve_top_k

router = APIRouter()


def _knowledge_dir_display() -> str:
    s = get_settings()
    raw = (s.rag_knowledge_dir or "").strip()
    return raw if raw else str(_default_knowledge_dir().resolve())


@router.get("/stats", response_model=RagStatsResponse)
def rag_stats() -> RagStatsResponse:
    settings = get_settings()
    chunks = warm_rag_cache(settings)
    sources = sorted({c.source for c in chunks})
    return RagStatsResponse(
        rag_enabled=settings.rag_enabled,
        knowledge_dir=_knowledge_dir_display(),
        chunk_count=len(chunks),
        sources=sources,
    )


@router.get("/search", response_model=RagSearchResponse)
def rag_search(
    q: str = Query(..., min_length=1, max_length=2000),
    limit: int = Query(5, ge=1, le=20),
) -> RagSearchResponse:
    settings = get_settings()
    all_chunks = warm_rag_cache(settings)
    if not settings.rag_enabled:
        return RagSearchResponse(query=q, total_chunks=len(all_chunks), results=[])

    hits = retrieve_top_k(q, all_chunks, limit)
    results = [
        RagChunkPublic(
            chunk_id=c.chunk_id,
            source=c.source,
            score=round(s, 4),
            text_preview=c.text[:400] + ("…" if len(c.text) > 400 else ""),
        )
        for s, c in hits
    ]
    return RagSearchResponse(query=q, total_chunks=len(all_chunks), results=results)
