---
aggiornato: 2026-09-26
tag: [sessione, contenuti]
---
# Alberi di fisica, informatica e medie

Sessione del 26 settembre 2026. Alessandro ha chiesto di organizzare per anno, secondo i programmi ministeriali, fisica e informatica delle superiori e le materie delle medie, lasciando fuori l'università.

## Cosa si è deciso
- Liceo scientifico per le superiori (informatica delle scienze applicate); alle medie matematica, Scienze intera e Tecnologia intera. Vedi [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], con le scelte di dettaglio (Python, doppioni tra scienze e tecnologia, dimensioni).

## Cosa si è fatto
- Cinque ricerche in parallelo, una per materia, sul modello di `docs/lezioni/chimica/`: Indicazioni nazionali (DM 211/2010 per i licei, DM 254/2012 e DM 221/2025 per il primo ciclo), bozza MIM dei licei del 22 aprile 2026, indici di libri e programmazioni di scuole. Fonti lette e cose da verificare sono nei `programma.md` di ogni materia.
- Alberi applicati al database: 41 capitoli e 219 lezioni di fisica, 36 e 171 di informatica, 33 e 150 di matematica delle medie, 39 e 187 di scienze, 29 e 135 di tecnologia. Controllato sul localhost: ogni materia mostra le linguette degli anni e tutti i capitoli, le lezioni si aprono.
- `tree.mts`: livello e creazione della materia; accetta una lezione assorbita dentro un capitolo assorbito; legge a pagine.
- Trovato un limite che avrebbe rotto il sito: le query su `content_nodes` restituiscono al massimo 1.000 righe e la tabella ora ne ha 1.509. Corretti il sito (`src/lib/server/content.ts`), `tree.mts` e `scripts/chimica/pubblica.mts`. Il sito in produzione ha il codice vecchio e per qualche minuto ha mostrato 4 capitoli di matematica su 39 (i nodi oltre la posizione 3 cadevano fuori). Rimedio senza deploy: `max_rows` di PostgREST portato da 1.000 a 10.000 dall'API di gestione di Supabase; l'API anonima ora restituisce tutte le 1.509 righe.

## Informazioni nuove
- Nuove Indicazioni del primo ciclo in vigore: DM 221/2025, Gazzetta del 27 gennaio 2026, dalle prime del 2026/27; seconde e terze sul DM 254/2012 fino al 2028/29. La programmazione (variabili, strutture di controllo) sta negli obiettivi di matematica, ma l'informatica è "prevalentemente affidata" al docente di tecnologia.
- La bozza dei licei del 22 aprile 2026 per le scienze applicate aggiunge l'intelligenza artificiale e chiede un linguaggio testuale già nel biennio.

## Domande aperte
- Il deploy porta in produzione la lettura a pagine; con `max_rows` a 10.000 non è più urgente, ma la tabella ci arriverà con i contenuti dell'università.
- Testi delle pagine delle materie in `src/lib/content/subject-copy.ts`, in modifica in un'altra sessione.
- Le lezioni di educazione sessuale di scienze vanno rilette prima della pubblicazione; il disegno tecnico di tecnologia chiede figure costruite passo per passo.
- Quando entrano le medie e da quale materia si comincia a scrivere.
- Prerequisiti delle nuove materie, da scrivere nei lotti.
