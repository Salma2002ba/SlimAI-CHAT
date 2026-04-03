# FAQ SlimAI

## Qu’est-ce que le retrieval augmenté (RAG) ?

Le RAG combine **recherche** dans des documents internes et **génération** par un LLM. Au lieu de répondre uniquement avec les paramètres du modèle, on injecte des passages pertinents du corpus pour réduire les hallucinations et ancrer les réponses dans des sources traçables.

## Pourquoi du retrieval lexical et pas des embeddings ?

Les embeddings (vecteurs) donnent souvent de meilleurs rappels sémantiques, mais ajoutent dépendances, coût API et complexité ops. SlimAI utilise un **retrieval lexical** explicite : idéal pour une démo claire en entretien (chunking, scoring, top-k) ; la passerelle vers embeddings + pgvector est une évolution naturelle.

## Comment éviter de dépasser le quota Gemini ?

Utiliser `CHAT_PROVIDER=mock` pour une démo sans appel API, ou `GEMINI_FALLBACK_MOCK_ON_429=true` pour une dégradation gracieuse. Les quotas gratuits sont documentés par Google (rate limits, fuseau Pacifique pour reset journalier).

## Où sont stockées les conversations persistées ?

Les messages peuvent être exposés via `/api/messages` (PostgreSQL). L’historique détaillé du chat UI reste principalement côté client ; une évolution serait de synchroniser les tours avec la base.
