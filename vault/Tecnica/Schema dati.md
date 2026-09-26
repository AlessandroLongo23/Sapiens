---
stato: in sviluppo
aggiornato: 2026-09-25
tag: [tecnica]
---
# Schema dati

## Stato attuale
Migrazioni in `supabase/migrations/`:
- `tutors`, vista `tutors_public`, `tutor_requests` (marketplace, 6 settembre 2026).
- `notebooks`, `notes` con ricerca `tsvector` e collegamento alla lezione (Zaino, 7-8 settembre 2026).
- `notes.paper` jsonb (24 settembre 2026, migrazione `20260924210000_note_paper.sql`, applicata lo stesso giorno al progetto `godqhjgwmlzfnymzhqdq`): la carta della nota, `{ kind, color, spacing, text }`; un oggetto vuoto è la carta di prima. Si scrive con `PUT /api/zaino/note/[id]/carta`, senza toccare `version`. Gli adesivi in `note_stickers.stickers` hanno ora il campo facoltativo `page`.
- `exercise_attempts`, i tentativi degli esercizi (24 settembre 2026): migrazione `20260924200000_exercise_attempts.sql`, applicata lo stesso giorno al progetto `godqhjgwmlzfnymzhqdq`. Colonne come nella proposta qui sotto, con un vincolo che tiene insieme `answer`, `correct` e `answered_at`. RLS attiva con la sola lettura delle proprie righe; scrive il server con la chiave di servizio.

- `exercise_sessions`, le prove degli esercizi (25 settembre 2026): migrazione `20260925150000_exercise_sessions.sql`, applicata lo stesso giorno al progetto `godqhjgwmlzfnymzhqdq` con l'API di gestione di Supabase. Una riga per prova: `kind` (`level` o `jump`), `level` (il livello della prova, o quello che la prova di salto apre), `plan` (il livello di ogni domanda, in ordine). Il risultato si legge dai tentativi. In `exercise_attempts` due colonne nuove, `session_id` e `position`, unici in coppia: la stessa domanda chiesta due volte è la stessa riga. RLS come per i tentativi. Vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]].

Fuori dalle migrazioni: `content_nodes`, l'albero dei contenuti, usato dal codice ma creato a mano. Le colonne aggiunte dopo sono nelle migrazioni: `flashcards` e `school_year` (25 settembre 2026, `20260926120000_chapter_school_year.sql`, applicata lo stesso giorno: l'anno scolastico da 1 a 5 in cui si studia un capitolo, per ora solo per la matematica delle superiori; vedi [[2026-09-25 I capitoli si mostrano per anno]]). Il piano dell'utente sta in `app_metadata` di Supabase Auth.

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
