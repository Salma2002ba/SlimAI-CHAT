# SlimAI — produit

SlimAI est un assistant conversationnel full-stack : interface React (Vite), API FastAPI sur Railway, persistance PostgreSQL, et couche **RAG** (Retrieval-Augmented Generation) sur une base documentaire versionnée.

## Fonctionnalités clés

- Chat multi-tours avec historique côté client.
- **Provider LLM abstrait** : modes `auto`, `mock`, `gemini`, `rag` (recherche documentaire sans LLM).
- **RAG** : découpage en chunks, retrieval lexical (BM25-like simplifié), injection du contexte dans le prompt système Gemini.
- Dégradation contrôlée : quota Gemini (429) → option de fallback mock (`GEMINI_FALLBACK_MOCK_ON_429`).

## Public cible

Développeurs et équipes produit qui veulent une base chatbot déployable (GitHub Pages + API) avec patterns d’architecture expliquables en entretien.
