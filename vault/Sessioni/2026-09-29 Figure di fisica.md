---
aggiornato: 2026-09-29
tag: [sessione, fisica, contenuti, tecnica]
---
# Figure di fisica

Sessione del 29 settembre 2026, aperta con `/sparring` prima del primo lotto di fisica. Alessandro ha fatto notare che la fisica, più della matematica, si spiega con le figure: vettori, piano inclinato, moti, forze, campi elettrici e magnetici. Servono più figure e più figure interattive, e gli esercizi hanno quasi sempre un sistema disegnato. La domanda: TikZ basta, o serve un altro pacchetto?

## Cosa si è deciso
- [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]: TikZ per le figure statiche; il kit delle lezioni, con un modulo di fisica, per le interattive; niente motore fisico; negli esercizi una scena descritta nei dati e disegnata dal kit; grafici statici in TikZ, come quelli di matematica, finché non c'è il piano cartesiano del kit. Il numero di figure si decide lezione per lezione.
- [[2026-09-29 La fisica si pubblica gratis accanto alla beta]]: lotto per lotto, come la chimica.

## Informazioni nuove
- node-tikzjax, il motore delle nostre figure, contiene `circuitikz`, `pgfplots`, `arrows.meta`, `decorations.markings` e `patterns` (verificato nell'archivio dei file TeX del pacchetto, 29 settembre 2026). Provando si è visto che i riempimenti `pattern=` non arrivano nell'SVG: il tratteggio si fa a trattini.
- Gli esercizi oggi portano solo figure precompilate nel bucket (`FigureRef` in `src/lib/exercises/v2/types.ts`), come le molecole della chimica.
- Un blocco `interattivo` viene pubblicato come una cornice vuota (`src/lib/utils/interactive.ts`): per sostituire un grafico statico con uno interattivo senza perderlo per Google, l'SVG deve restare nella cornice.

## Domande aperte
- La convenzione dei colori per grandezza, in [[Domande per Andrea]].
- La lista d'attesa sulla home, rimasta aperta da [[2026-09-29 Legale e fiscale prima del marketing]].

## Prossimo argomento
Il primo lotto di fisica: i capitoli del primo anno sulle grandezze e la misura, i grafici e i vettori e le forze, con il modulo di fisica del kit e il campo della scena negli esercizi.
