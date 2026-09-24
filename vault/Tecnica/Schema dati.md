---
stato: in sviluppo
aggiornato: 2026-09-23
tag: [tecnica]
---
# Schema dati

## Stato attuale
Migrazioni in `supabase/migrations/`:
- `tutors`, vista `tutors_public`, `tutor_requests` (marketplace, 6 settembre 2026).
- `notebooks`, `notes` con ricerca `tsvector` e collegamento alla lezione (Zaino, 7-8 settembre 2026).

Fuori dalle migrazioni: `content_nodes`, l'albero dei contenuti, usato dal codice ma creato a mano. Il piano dell'utente sta in `app_metadata` di Supabase Auth.

## Da progettare
- Progressi degli esercizi (vedi [[Esercizi]]).
- Diario e calendario (vedi [[Diario e calendario]]).
- Banca statica degli esercizi e registro dei generatori (vedi [[Pipeline esercizi]]).
- `legal_acceptances` (vedi [[GDPR e minori]]).
- Relazione genitore-figlio (vedi [[Area genitori]]).

## Domande aperte
- Portare `content_nodes` dentro le migrazioni, per poter ricreare il database da zero.
