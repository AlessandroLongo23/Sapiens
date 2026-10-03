---
stato: presa
aggiornato: 2026-10-03
tag: [decisione, strumenti, lezioni, matematica]
---
# Il piano di una lezione dichiara cosa è permesso

## Decisione
Alessandro, 3 ottobre 2026: quando il plotter sta dentro una lezione, quello che lo studente può fare dipende dal punto della lezione. O ci sono solo i cursori, senza un campo in cui scrivere (la parabola con $a$, $b$, $c$), oppure un insieme di strumenti scelto per quell'argomento.

Il piano di una lezione dichiara quindi un elenco di permessi, come proposto in [[Geometria analitica nel plotter]] ("Modi nelle lezioni"): gli strumenti della barra per nome, se si possono aggiungere righe scritte e di che tipo, quali righe di partenza sono bloccate, se il piano si sposta. I tre modi proposti all'inizio (`funzioni`, `geometria`, `tutto`) restano come elenchi già pronti.

## Perché
Tre modi fissi non bastano: la lezione sulla distanza punto-retta vuole tre strumenti, non tutta la geometria.

## Conseguenze
- Il blocco `grafico` delle lezioni (`src/lib/grafico/blocco.ts`) oggi conosce formule fissate, cursori e scelta tra opzioni. Va esteso con gli strumenti permessi. Non ancora fatto.
- Lo strumento sotto `/strumenti` resta tutto aperto.

## Collegamenti
- [[Geometria analitica nel plotter]], [[Piano cartesiano nelle lezioni]], [[Grafico di funzioni]]
- [[2026-10-02 Nelle lezioni la figura resta e il piano la sostituisce con Prova tu]]
