---
stato: in sviluppo
release: beta
aggiornato: 2026-09-26
tag: [prodotto]
---
# Ricerca

La ricerca del sito: lo studente scrive un titolo o una domanda ("non ho capito le equazioni di secondo grado") e arriva alla lezione, o direttamente al paragrafo che risponde.

## Stato attuale
Rifatta il 26 settembre 2026, nel codice e non ancora pubblicata.

- Si apre dal campo nell'header (con l'indicazione ⌘K / Ctrl K) o con la scorciatoia. L'overlay è una pagina del quaderno: la domanda si scrive in serif su una riga, la penna rossa la sottolinea mentre si apre, i quadretti stanno in alto. Apertura e chiusura animate (`search-in`, `search-out` in `globals.css`).
- Risultati raggruppati: i propri appunti, materie e capitoli (come etichette colorate per materia), lezioni (con l'adesivo della materia), paragrafi dentro le lezioni (con il simbolo § e l'estratto). Le parole trovate sono passate con l'evidenziatore. Frecce per scegliere, Invio per aprire.
- Se la ricerca è una domanda (comincia con "come", "cosa", "non ho capito", finisce con "?"), il paragrafo migliore va in cima come scheda su carta a quadretti: "La risposta è qui".
- Un paragrafo apre la lezione con l'ancora (`#minimo-comune-multiplo`): la pagina scorre al titolo e ci passa sopra un evidenziatore disegnato a mano (bordi irregolari, tre tratti diversi, `.marker-hand` in `globals.css`), che poi sbiadisce. Lo stesso tratto evidenzia le parole trovate nei risultati.
- Senza testo, l'overlay propone quattro ricerche di esempio.
- Il ranking gira nel browser (`src/lib/search/rank.ts`, `text.ts`): minuscole e accenti ignorati, radice delle parole (equazione ed equazioni sono la stessa parola), errori di una o due lettere perdonati, l'ultima parola vale anche a metà, le parole di una domanda ("non ho capito", "come si calcola") scartate, abbreviazioni scritte per esteso (mcm, mcd). Circa 5-10 ms per battuta sulle 44 lezioni di oggi.
- L'indice dei paragrafi è `GET /api/search` (`src/lib/server/search-index.ts`, `src/lib/search/sections.ts`): 357 sezioni `##` e `###`, con estratto e parole, 75 KB compressi, in cache 5 minuti. Il testo intero delle lezioni resta sul server.
- Tolta la vista a griglia: una ricerca si legge in ordine di pertinenza, e la griglia lo nascondeva.
- Ricerca per significato (embedding), nel codice ma non ancora attiva. Ogni sezione ha un vettore di `text-embedding-3-small` nella tabella `search_sections` (migrazione `20260926180000_search_sections.sql`, applicata in produzione il 26 settembre, oggi vuota), con indice HNSW e la funzione `match_search_sections`. L'overlay chiama `/api/search/semantic` dopo una pausa, solo per domande, frasi di tre parole o ricerche con pochi risultati, e fonde le due classifiche (reciprocal rank fusion, `fuse` in `rank.ts`). Senza risposta dall'endpoint la ricerca resta quella per parole.
- Gli embedding si calcolano con `scripts/search/embed.mts` dopo ogni pubblicazione: solo le sezioni cambiate. Costo stimato per le 356 sezioni di oggi: circa 117.000 token, meno di un centesimo (prezzo da verificare).
- Test: `scripts/search/eval.mts` su 35 domande scritte come le farebbe uno studente (`scripts/search/domande.json`). Il 26 settembre, con le sole parole, il paragrafo giusto è primo nel 34% dei casi e tra i primi tre nel 54%. Il confronto con gli embedding manca: il conto OpenAI ha il credito esaurito.
- Corretto lo stesso giorno: i titoli con una formula avevano un'ancora fatta con un segnaposto interno (`mathplaceholder31end`), per cui l'indice laterale della lezione non ci saltava. Ora la pagina usa la formula, come l'indice (`restore` in `markdown.ts`): 357 ancore su 357 corrispondono.

## Obiettivo
Capire la domanda anche quando non contiene le parole del titolo ("perché il delta negativo non ha soluzioni") e portare al paragrafo giusto. Vedi le domande aperte.

## Dettagli
- Le ancore sono quelle dell'indice della lezione (`slugifyHeading` in `src/lib/content/markdown.ts`): un titolo di sezione cambiato cambia il link.
- Un paragrafo compare solo se la domanda tocca il suo titolo; il testo del paragrafo conta come sostegno, altrimenti ogni lezione con la parola "equazione" riempirebbe l'elenco.

## Domande aperte
- Per attivare la ricerca per significato servono credito sul conto OpenAI (il 26 settembre è esaurito, e per lo stesso motivo Sapiens AI in produzione non risponde) e, prima del lancio, la chiave del progetto UE (`OPENAI_BASE_URL=https://eu.api.openai.com/v1`), come vuole [[2026-09-23 OpenAI con dati nell'UE per la beta]]. La chiave in `.env` locale è un segnaposto.
- Soglia di similarità (`SEMANTIC_FLOOR`, oggi 0,35): da tarare sul test appena ci sono gli embedding.
- Jev come riordino dei primi risultati o per smistare le intenzioni (lezione, esercizi, Sapiens AI, tutor), da valutare sul test.
- Registrare le ricerche senza risultati, per sapere quali lezioni mancano e quali parole usano gli studenti. Serve una base legale, vedi [[GDPR e minori]].

## Collegamenti
- Attori: [[Studente]]
- Release: [[Release Beta]]
- Prodotti: [[Lezioni]], [[Zaino]], [[Sapiens AI]]
- Decisioni: [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
