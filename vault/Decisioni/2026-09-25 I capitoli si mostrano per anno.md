---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, contenuti, design]
---
# I capitoli si mostrano per anno

## Decisione
Nella pagina di una materia i capitoli sono divisi per anno scolastico, dalla prima alla quinta, e si vede un anno alla volta: le linguette degli anni stanno sulla riga del titolo "Capitoli" e si parte dalla prima. La numerazione dei capitoli resta continua. Per ora vale per la matematica delle superiori; le materie senza anno restano una lista unica.

## Perché
Alessandro, il 25 settembre 2026: 39 capitoli in una lista sola sono troppi per trovare quello giusto. L'anno è il modo in cui lo studente cerca ("sono in terza"). Biennio e triennio lasciavano due blocchi da 20 e 19 capitoli; gli ambiti (algebra, geometria, funzioni) spezzano l'ordine della classe, su cui si reggono le lezioni.

## Conseguenze
- Colonna `content_nodes.school_year` (1-5), migrazione `20260926120000_chapter_school_year.sql`, applicata il 25 settembre 2026 al progetto `godqhjgwmlzfnymzhqdq`: 12, 8, 5, 6 e 8 capitoli, dagli anni di `docs/lezioni/albero.md`.
- Componenti `ChapterYears` e `YearTabs`. Tutti gli anni sono nell'HTML, quelli non scelti nascosti, così i motori di ricerca leggono tutti i capitoli. L'anno scelto sta nell'indirizzo (`#anno-3`), e un link può aprirlo. Le linguette si usano anche con le frecce della tastiera.
- Stesso giorno, prima versione scartata: tutti gli anni uno sotto l'altro con le linguette ferme in alto durante lo scorrimento. Alessandro ha chiesto le linguette sulla riga del titolo e un anno alla volta.
- Gli anni seguono i libri più diffusi, non le Indicazioni nazionali, che dividono solo in bienni e quinto anno: la pagina lo dice. Vedi [[Programma ministeriale]].
- Il percorso nella nota di diario della matematica ha ora le cinque tappe degli anni.
- Fatto il 26 settembre 2026: gli anni ai capitoli di chimica, fisica e informatica delle superiori e delle tre materie delle medie (tre linguette). Vedi [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]].

## Collegamenti
- [[Lezioni]], [[Programma ministeriale]], [[Schema dati]]
