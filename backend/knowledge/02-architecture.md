# Architecture technique

## Stack

| Couche | Technologies |
|--------|----------------|
| Frontend | React 19, TypeScript, Vite, Tailwind, GitHub Pages |
| Backend | Python 3.12, FastAPI, Uvicorn, Pydantic Settings |
| Données | PostgreSQL (SQLAlchemy 2), tables créées au `lifespan` |
| LLM | Google Gemini via API REST (`generativelanguage.googleapis.com`) |
| RAG | Fichiers Markdown dans `knowledge/`, chunking glissant, scoring lexical |

## Flux RAG (augmentation)

1. **Ingestion** : chargement des `.md` au démarrage (cache en mémoire).
2. **Chunking** : fenêtres de caractères avec chevauchement (overlap) pour préserver le contexte.
3. **Retrieval** : requête = dernier message utilisateur ; score = recouvrement lexical normalisé (approche type sparse retrieval / proxy BM25).
4. **Augmentation** : les extraits sont concaténés dans le bloc *contexte documentaire* du prompt système envoyé à Gemini.
5. **Génération** : le modèle produit une réponse en s’appuyant sur le contexte quand c’est pertinent.

## Sécurité

La clé `GEMINI_API_KEY` ne transite jamais dans le bundle frontend ; seul le backend appelle l’API Google.
