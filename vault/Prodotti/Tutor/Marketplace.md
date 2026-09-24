---
stato: in sviluppo
release: v2
aggiornato: 2026-09-23
tag: [prodotto, tutor]
---
# Marketplace

Il posto dove uno studente, o il genitore, trova un tutor e ottiene il suo contatto. Il modello economico è in [[Pay-per-lead]]; la ricerca completa sul mercato italiano è in [[MARKETPLACE]] (6 settembre 2026).

## Stato attuale
Costruito e coperto dai test Playwright (`tests/e2e/tutoring.spec.ts`, `tutor-side.spec.ts`), senza pagamenti:
- Lato studente: `/ripetizioni` (elenco, ricerca, filtri), `/ripetizioni/[slug]` (profilo con richiesta), `/richieste` (le proprie richieste; contatti del tutor dopo l'accettazione), il blocco "Chiedi aiuto a un tutor" in fondo a ogni lezione con materia e livello già scelti.
- Lato tutor: `/ripetizioni/diventa-tutor`, `/profile-editor`, `/dashboard`, `/leads` (accetta o rifiuta; contatti dopo l'accettazione).
- Staff: `/admin/tutors` (pubblica, sospende, badge verificato).
- Tabelle `tutors`, vista `tutors_public`, `tutor_requests` con scadenza a 48 ore. Codice in `src/lib/server/tutoring*.ts`, API in `/api/tutoring/*`.
- I tutor presenti sono di prova (`scripts/seed-tutors.mjs`).

Mancano: i pagamenti, la verifica del telefono con OTP, i termini per i tutor, un job di scadenza programmato.

## Obiettivo
Lancio con la [[Release v2 Tutor]]. Il contatto nasce nel contesto: lo studente bloccato su una lezione chiede aiuto, e il tutor riceve materia, livello, città e gli argomenti su cui lo studente sbaglia. Nessun concorrente può copiarlo senza una biblioteca e gli esercizi.

## Dettagli
- Un contatto va a un solo tutor. Al massimo tre richieste aperte per studente; il tutor vede se lo studente ne ha altre.
- Per i minori il contatto parte dall'account del genitore e condivide il canale del genitore.
- Si presenta come "facilitazione del contatto", mai come selezione o collocamento di tutor (vedi [[Tutela del consumatore]]).

## Domande aperte
- Come si popola il lato offerta prima del lancio? Servono tutor reali in ogni città, o si parte dalle lezioni online?
- Recensioni dei tutor: chi può scriverle, visto che le lezioni non passano da Sapiens?
