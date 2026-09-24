# Confronto tra frazioni

Generatore: `numeri-razionali-confronto-frazioni`
(`src/lib/exercises/v2/generators/numeri-razionali-confronto-frazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/numeri_razionali_confronto_frazioni.py`. Lezione collegata: "Confronto
tra frazioni" (`docs/lezioni/riscritte/10-numeri-razionali-confronto-frazioni.md`).

Lo studente riconosce una frazione equivalente, sceglie la maggiore o la minore tra quattro
frazioni, mette in ordine quattro frazioni. Tutte le risposte sono di tipo `choice` con quattro
opzioni: il confronto tra due sole frazioni (`<`, `>`, `=`) ne avrebbe tre, per questo i livelli
2-5 chiedono la maggiore o la minore di quattro frazioni. Così le opzioni sbagliate sono proprio le
frazioni che sceglie chi usa la regola sbagliata (il numeratore più grande, il denominatore più
grande, il valore assoluto per le negative).

## Rappresentazione

`params.fractions` è l'elenco delle frazioni mostrate, nell'ordine del testo, come stringhe `"n/d"`
con il segno al numeratore e `d > 0`. `params.ask` vale `maggiore` o `minore` (livelli 2-5),
`params.case` descrive il caso. Il testo è l'elenco delle frazioni separate da `,\quad`.

## Regole comuni

- Denominatori sempre positivi, segno davanti alla frazione (`-\frac{3}{4}`), come nella lezione.
- Frazioni mostrate ridotte ai minimi termini e mai intere (livelli 2-6); nessuna coppia di frazioni
  uguali nello stesso esercizio.
- Nei passaggi il denominatore comune è il MCM, scritto `\text{MCM}(…)`, al massimo 120.

## Livello 1: frazioni equivalenti

Una frazione positiva ridotta `a/b` con `b` da 2 a 10 (a volte impropria); la risposta giusta è
`\frac{ka}{kb}` con `k` da 2 a 6 e `kb ≤ 60`, mostrata non ridotta. Si controlla con il prodotto in
croce. Le opzioni sbagliate non sono equivalenti e non valgono un numero intero.

Esempi: `\frac{2}{3}`, risposta `\frac{10}{15}`; `\frac{4}{7}`, risposta `\frac{8}{14}`.

## Livello 2: stesso denominatore

Quattro frazioni con lo stesso denominatore (da 3 a 13) e numeratori diversi, fino al doppio del
denominatore. Circa 6 su 10 positive, 2 su 10 tutte negative, 2 su 10 con segni misti (la lezione
mostra `-\frac{5}{7} < -\frac{3}{7}`). Si chiede la maggiore o la minore, metà e metà.

Esempi: maggiore tra `\frac{3}{8}, \frac{7}{8}, \frac{9}{8}, \frac{11}{8}` è `\frac{11}{8}`;
minore tra `-\frac{8}{7}, -\frac{4}{7}, -\frac{12}{7}, -\frac{10}{7}` è `-\frac{12}{7}`.

## Livello 3: stesso numeratore

Quattro frazioni positive con lo stesso numeratore (da 1 a 9) e denominatori diversi da 2 a 15. È
maggiore quella con il denominatore minore.

Esempi: maggiore tra `\frac{3}{10}, \frac{3}{4}, \frac{3}{2}, \frac{3}{11}` è `\frac{3}{2}`;
minore tra `\frac{5}{9}, \frac{5}{13}, \frac{5}{3}, \frac{5}{8}` è `\frac{5}{13}`.

## Livello 4: denominatore comune

Quattro frazioni positive con numeratori tutti diversi e denominatori tutti diversi (da 2 a 12),
valori fino a circa 1,6. La frazione con il numeratore più grande non è la maggiore (e, se si chiede
la minore, quella con il numeratore più piccolo non è la minore): confrontare solo i numeratori dà
la risposta sbagliata. I passaggi usano il MCM.

Esempi: maggiore tra `\frac{3}{2}, \frac{4}{5}, \frac{1}{3}, \frac{9}{10}` è `\frac{3}{2}`
(MCM 30); minore tra `\frac{13}{10}, \frac{6}{5}, \frac{3}{2}, \frac{5}{4}` è `\frac{6}{5}`.

## Livello 5: frazioni negative

Come il livello 4, ma metà degli esercizi ha quattro frazioni negative (si chiede la maggiore o la
minore) e metà ha due o tre negative insieme a positive (si chiede la minore, così la risposta sta
tra le negative). Nei passaggi il segno va al numeratore, come nella lezione.

Esempi: minore tra `-\frac{7}{8}, \frac{2}{5}, -\frac{13}{10}, \frac{1}{4}` è `-\frac{13}{10}`;
maggiore tra quattro negative: quella più vicina a zero.

## Livello 6: ordinare più frazioni

Quattro frazioni, due o tre negative, denominatori da 2 a 10 tutti diversi, MCM al massimo 120; si
chiede l'ordine crescente. Le positive sono scelte in modo che ordinarle per numeratore dia un
ordine sbagliato.

Esempio: `-\frac{1}{3}, \frac{5}{6}, -\frac{7}{8}, \frac{3}{2}` diventa
`-\frac{7}{8} < -\frac{1}{3} < \frac{5}{6} < \frac{3}{2}`.

## Da evitare

- Frazioni non ridotte o intere tra quelle da confrontare; due frazioni uguali.
- Livello 4 in cui basta guardare i numeratori.
- MCM enormi (oltre 120).

## Variante a scelta multipla

È la risposta stessa. Livello 1: la stessa quantità sommata al numeratore e al denominatore
(`\frac{a+k}{b+k}`), solo il numeratore moltiplicato, numeratore e denominatore moltiplicati per
numeri diversi, il denominatore aumentato di `k`, numeratore e denominatore scambiati. Livelli 2-5:
le altre tre frazioni del testo. Livello 6: le negative ordinate come se fossero positive, tutto
ordinato per numeratore, i due errori insieme, l'ordine decrescente.

## Domande per la revisione

- Va bene sostituire il classico `\frac{a}{b} \ \square \ \frac{c}{d}` (tre opzioni) con "la maggiore
  tra quattro"? Se la pagina accetta tre opzioni, si può aggiungere un livello con il confronto tra
  due frazioni.
- Il livello 1 (frazioni equivalenti) è giusto qui o appartiene alla lezione sulle frazioni?
