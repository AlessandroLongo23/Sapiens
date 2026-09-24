---
stato: in sviluppo
aggiornato: 2026-09-24
tag: [tecnica]
---
# Schema dati

## Stato attuale
Migrazioni in `supabase/migrations/`:
- `tutors`, vista `tutors_public`, `tutor_requests` (marketplace, 6 settembre 2026).
- `notebooks`, `notes` con ricerca `tsvector` e collegamento alla lezione (Zaino, 7-8 settembre 2026).
- `notes.paper` jsonb (24 settembre 2026, migrazione `20260924210000_note_paper.sql`, applicata lo stesso giorno al progetto `godqhjgwmlzfnymzhqdq`): la carta della nota, `{ kind, color, spacing, text }`; un oggetto vuoto è la carta di prima. Si scrive con `PUT /api/zaino/note/[id]/carta`, senza toccare `version`. Gli adesivi in `note_stickers.stickers` hanno ora il campo facoltativo `page`.
- `exercise_attempts`, i tentativi degli esercizi (24 settembre 2026): migrazione `20260924200000_exercise_attempts.sql`, applicata lo stesso giorno al progetto `godqhjgwmlzfnymzhqdq`. Colonne come nella proposta qui sotto, con un vincolo che tiene insieme `answer`, `correct` e `answered_at`. RLS attiva con la sola lettura delle proprie righe; scrive il server con la chiave di servizio.

Fuori dalle migrazioni: `content_nodes`, l'albero dei contenuti, usato dal codice ma creato a mano. Il piano dell'utente sta in `app_metadata` di Supabase Auth.

## Tentativi degli esercizi (24 settembre 2026, applicata)
Una riga per ogni esercizio mostrato a uno studente, scritta dal server quando lo mostra e completata alla risposta. Vedi [[2026-09-24 Ogni tentativo salva l'esercizio intero]].

Tabella `exercise_attempts`, colonne proposte:
- `id` uuid; `user_id` verso `auth.users`, con cancellazione a cascata (serve per la cancellazione dei dati, vedi [[GDPR e minori]]).
- `lesson_path` (la lezione in `content_nodes`), `generator_id`, `level`, `seed`.
- `exercise` jsonb: il `Sample` intero, con la variante a scelta multipla se mostrata così.
- `mode`: scelta multipla o risposta aperta.
- `shown_at`, `answered_at`, `answer` jsonb (indice scelto o testo scritto), `correct`, `active_ms` (tempo attivo misurato nel browser).
- `build`: il commit del deploy (`VERCEL_GIT_COMMIT_SHA`), per ritrovare i tentativi fatti con un generatore difettoso.

Lo studente legge solo le sue righe (RLS); scrive solo il server, così nessuno può segnarsi giusto un esercizio da solo. Indici su (`user_id`, `shown_at`) e su (`user_id`, `generator_id`, `answered_at`) per le sole righe risposte, che servono a calcolare il livello.

## Da progettare
- Diario e calendario (vedi [[Diario e calendario]]).
- Banca statica degli esercizi e registro dei generatori (vedi [[Pipeline esercizi]]).
- `legal_acceptances` (vedi [[GDPR e minori]]).
- Relazione genitore-figlio (vedi [[Area genitori]]).

## Domande aperte
- Portare `content_nodes` dentro le migrazioni, per poter ricreare il database da zero.
