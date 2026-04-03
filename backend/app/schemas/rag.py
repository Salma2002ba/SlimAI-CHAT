from pydantic import BaseModel, Field


class RagChunkPublic(BaseModel):
    chunk_id: str
    source: str
    score: float
    text_preview: str = Field(..., description="Truncated chunk text for API responses")


class RagSearchResponse(BaseModel):
    query: str
    total_chunks: int
    results: list[RagChunkPublic]


class RagStatsResponse(BaseModel):
    rag_enabled: bool
    knowledge_dir: str
    chunk_count: int
    sources: list[str]
