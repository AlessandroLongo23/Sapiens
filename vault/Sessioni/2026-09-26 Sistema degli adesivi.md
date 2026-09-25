---
aggiornato: 2026-09-26
tag: [sessione]
---
# Sistema degli adesivi

Sessione del 25-26 settembre 2026: prima le copertine con gli adesivi sulle pagine del materiale, poi un brainstorming su come si producono e si organizzano gli adesivi.

## Cosa si è fatto
- Copertine: la fascia a quadretti in cima a ogni pagina indice del materiale (biblioteca, livelli, materie, capitoli) è una copertina dove lo studente attacca adesivi col gesto delle note. Ogni pagina ha la sua, salvata nella tabella `cover_stickers` con la chiave del percorso. Parte con due adesivi predefiniti, visibili anche ai visitatori. L'icona grande a destra è sparita da queste pagine. Dettagli in [[Adesivi]].
- Il percorso in cima alle pagine indice è diventato un'etichetta in monospazio che finisce con l'occhiello: prima percorso e occhiello si ripetevano.
- Claude ora lavora sul database di produzione da solo con `scripts/db.mjs`, consentito nei permessi del progetto (scritto nel `CLAUDE.md`).

- Dopo la discussione: guida di stile `stickers/STILE.md`, pipeline `npm run stickers` con foglio di prova, gli 8 adesivi convertiti in file e il primo lotto di 10 adesivi di capitolo. Dettagli in [[Adesivi]].

## Decisioni prese
- [[2026-09-26 Gli adesivi li crea Sapiens, gli studenti poi solo da modelli]]
- [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]]
- [[2026-09-26 Pacchetti di adesivi per capitolo, materia, studio e stagione]]
- Confermato: nella beta tutti gli adesivi sono liberi, i premi arrivano dopo ([[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]).

## Informazioni nuove
- Gli 8 adesivi di oggi non vengono da un generatore di immagini: sono funzioni che scrivono SVG, scritte a mano da Claude il 24 settembre per il prototipo.
- Il progetto Supabase non tiene la storia delle migrazioni: finora sono state applicate a mano.
- Il connettore Supabase di claude.ai non vede il progetto (rifiuta anche le letture).
- Nella tabella c'erano due copertine vere (Matematica svuotata, Chimica con 2 adesivi), spostate sulla chiave corretta.

## Domande aperte
- Perché non aspettare Dario per lo stile degli adesivi.
- Quanti adesivi per materia e per stagione.
- Aggiornare [[Schema dati]] con `cover_stickers` e [[2026-09-24 Linguaggio visivo del quaderno a quadretti]] con il nuovo percorso (erano in modifica in un'altra sessione).

## Prossimo argomento
La guida di stile degli adesivi e il catalogo in file SVG, se Alessandro vuole partire subito; altrimenti il deploy di tutto il lavoro non pubblicato, come proposto nella sessione precedente.
