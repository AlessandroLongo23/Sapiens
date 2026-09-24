---
stato: in sviluppo
release: beta
aggiornato: 2026-09-24
tag: [prodotto, studenti]
---
# Zaino

Quaderni e note personali dello studente, con formule, collegati alle lezioni.

## Stato attuale
- Pagine `src/app/(site)/zaino` (quaderni), `zaino/[quaderno]` (note), `zaino/nota/[id]` (editor TipTap con formule).
- API in `src/app/api/zaino/*`: creazione, modifica, riordino con trascinamento, ricerca testuale (`cerca`), nota legata a una lezione (`lezione`).
- Tabelle `notebooks` e `notes` con RLS; ricerca con `tsvector`; `lesson_path` e `lesson_title` per il collegamento alla lezione.
- Piano Free: 1 quaderno e 5 note (`src/lib/zaino/config.ts`). Piani a pagamento: illimitati.
- Il 23 settembre 2026 c'è lavoro non ancora committato su ricerca, riordino, spostamento delle note e note dalla lezione.
- Dal 24 settembre 2026 nella modalità Semplice la nota è un foglio largo 792 px, ridimensionato con `zoom` per stare nello schermo; sotto il 95% compare "Ingrandisci", che lo mostra a grandezza piena con scorrimento orizzontale (`src/components/zaino/SimpleEditor.tsx`). Sul foglio si attaccano gli [[Adesivi]].

## Obiettivo
Il quaderno digitale dello studente, integrato con [[Diario e calendario]] e con le [[Lezioni]]: dalla lezione si prende una nota, dalla nota si torna alla lezione.

Nella modalità Semplice la nota è un foglio a larghezza fissa, uguale su ogni schermo, su cui si attaccano gli [[Adesivi]]. Vedi [[2026-09-24 Le note sono fogli a larghezza fissa]].

## Domande aperte
- Gli [[Adesivi]] guadagnati si attaccano sulle copertine dei quaderni (vedi [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]): dove si mettono e se coprono il colore.
- Condivisione di quaderni tra compagni o con il tutor?
- Foto degli appunti cartacei dentro una nota (vedi [[Foto e soluzione]])?
