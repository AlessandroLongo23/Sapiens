# Operazioni tra insiemi

Generatore: `insiemi-operazioni` (`src/lib/exercises/v2/generators/insiemi-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/insiemi_operazioni.py`. Lezione collegata:
"Proprietà delle operazioni tra insiemi" (`docs/lezioni/riscritte/03-insiemi-operazioni.md`), che
tratta tutte le operazioni. L'unione ha un generatore suo (`insiemi-unione`); qui compare dentro le
espressioni e i problemi.

Convenzioni della lezione: $A \cap B$, $A \setminus B$ (si legge "A meno B"), $\overline{A}$ per il
complementare rispetto all'universo $U$, $A \times B$ con le coppie tra parentesi tonde. Livelli
1-3 e 5 con risposta `set`, livello 4 a scelta multipla (o `number` per il conteggio delle coppie),
livello 6 `number`; tutti hanno una variante a scelta multipla con quattro opzioni.

## Rappresentazione

- Livelli 1 e 2: `params.A`, `params.B`, `params.case` (`in comune`, `disgiunti`, `incluso`); al
  livello 2 `params.asked` (`A-B` o `B-A`).
- Livello 3: `params.U` = $\{1, \dots, n\}$, `params.A`, a volte `params.B`, `params.asked`.
- Livello 4: `params.variant` (`coppie` o `quante`); per le coppie `params.P` (numeri),
  `params.Q` (lettere), `params.asked` (`PxQ` o `QxP`); ogni opzione ha in `values` le coppie come
  `"1:a"`, e come `"~1:a"` quando la coppia è scritta per errore con le graffe.
- Livello 5: `params.expr`, l'albero dell'espressione (`set`, `bin` con `cup`, `cap`, `minus`,
  `comp` per il complementare), e `params.sets`. Il verificatore valuta l'albero, lo riscrive in
  LaTeX e lo confronta con il problema.
- Livello 6: come il livello 6 di `insiemi-unione`: `variant`, `context`, `total`, `a`, `b`,
  `both`, `none`.

## Livello 1: intersezione

$A$ e $B$ elencati con numeri da 1 a 12, con 1-3 elementi in comune (circa 85%) oppure disgiunti
(circa 15%, risposta $\emptyset$).

Esempi: $\{6, 7, 12\} \cap \{4, 8, 12\} = \{12\}$; $\{5, 7, 10, 12\} \cap \{5, 10, 11, 12\} = \{5, 10, 12\}$.

## Livello 2: differenza

Si chiede $A \setminus B$ o $B \setminus A$, metà e metà, perché l'ordine conta. Casi: elementi in
comune (circa 75%), disgiunti (circa 12%, non si toglie niente), $A \subset B$ (circa 13%, e
allora $A \setminus B = \emptyset$).

Esempi: $A = \{1, 2, 7, 11\}$, $B = \{1, 2, 3, 4, 7\}$: $B \setminus A = \{3, 4\}$. $A = \{1, 2, 3,
7, 9, 11\}$, $B = \{2, 3, 4, 7\}$: $A \setminus B = \{1, 9, 11\}$.

## Livello 3: complementare

$U = \{1, \dots, n\}$ con $n$ da 8 a 12 scritto per esteso, $A$ con almeno 2 elementi e almeno 3 in
meno di $U$. Circa 30 volte su 100 il problema dà anche $B$ e chiede $\overline{B}$, perché lo
studente guardi l'insieme giusto.

Esempi: $U = \{1, \dots, 9\}$, $A = \{1, 2, 4, 5, 8\}$: $\overline{A} = \{3, 6, 7, 9\}$.

## Livello 4: prodotto cartesiano

Circa 70%: $P$ di 2-3 numeri, $Q$ di 2-3 lettere, al massimo 6 coppie; si chiede $P \times Q$ o
$Q \times P$ a scelta multipla. Circa 30%: "quanti elementi ha $A \times B$" con $|A|$ da 2 a 5 e
$|B|$ da 2 a 6 (risposta $|A| \cdot |B|$).

Esempi: $P = \{1, 2\}$, $Q = \{a, b, g\}$: $P \times Q = \{(1, a), (1, b), (1, g), (2, a), (2, b),
(2, g)\}$. $|A| = 4$, $|B| = 3$: $|A \times B| = 12$.

## Livello 5: espressioni e leggi di De Morgan

Otto modelli, come negli esempi 6-8 della lezione: $(A \setminus B) \setminus C$,
$A \setminus (B \setminus C)$, $A \cap (B \cup C)$, $A \cup (B \cap C)$, $(A \cup B) \setminus C$
con tre insiemi di 3-4 numeri da 1 a 8; $\overline{A \cup B}$, $\overline{A \cap B}$,
$\overline{A} \cap B$ con $U = \{1, \dots, 8\}$ (come nella lezione) e $A \cup B \ne U$. Vincoli:
risultato non vuoto; l'errore principale del modello (la parentesi spostata, De Morgan applicato
male) dà un insieme diverso dalla risposta. I passaggi calcolano prima la parentesi o quello che
sta sotto la linea del complementare.

Esempi: $A = \{1, 3, 6, 8\}$, $B = \{1, 2, 5, 8\}$, $C = \{2, 3, 6, 8\}$:
$A \setminus (B \setminus C) = A \setminus \{1, 5\} = \{3, 6, 8\}$. $U = \{1, \dots, 8\}$,
$A = \{2, 5, 6\}$, $B = \{1, 2, 6\}$: $\overline{A \cap B} = \overline{\{2, 6\}} = \{1, 3, 4, 5, 7, 8\}$.

## Livello 6: problemi con il diagramma

Come l'esempio 9 della lezione, in quattro contesti (calcio e nuoto, francese e tedesco, fumetti e
serie TV, yoga e pesi): totale, i due gruppi e chi fa tutte e due le cose; almeno 2 in comune e
almeno 1 fuori da entrambi. Domande: solo il primo (circa 30%), solo il secondo (circa 20%), uno
solo dei due (circa 25%), nessuno dei due (circa 25%). La risposta non è mai uno dei numeri scritti
nel testo. I passaggi riempiono il diagramma partendo dalla zona comune.

Esempi: "In una classe di 25 studenti, 14 giocano a calcio, 11 fanno nuoto e 6 fanno tutti e due gli
sport. Quanti studenti giocano solo a calcio?" 8.

## Variante a scelta multipla

Insiemi: per l'intersezione l'unione e le due differenze; per la differenza l'altra differenza,
l'intersezione (gli elementi tolti), l'altro insieme; per il complementare $A$ stesso, $U$, il
complementare dell'altro insieme, il complementare senza l'ultimo elemento di $U$; per le
espressioni i risultati degli errori del modello (parentesi spostata, $\overline{A} \cup
\overline{B}$ al posto di $\overline{A} \cap \overline{B}$, complementare dimenticato). Se non
bastano, la risposta con un elemento in meno o con un elemento in più preso dagli insiemi dati.

Prodotto cartesiano: $Q \times P$ al posto di $P \times Q$ (l'ordine nelle coppie), le coppie
scritte con le graffe (errore frequente della lezione), le coppie "in fila" $(1, a), (2, b)$, solo le
coppie del primo elemento. Conteggio: $|A| + |B|$, poi ±1.

Problemi: il numero del gruppo senza togliere la parte comune, la parte comune tolta due volte,
la risposta a un'altra domanda (solo il secondo al posto del primo, almeno uno al posto di uno
solo); poi ±1, ±2.

## Righe sul telefono

Ogni risposta sta in un pulsante di 252 px, a 16 px. Al livello 4 sei coppie su una riga sono larghe
294-337 px: più di quattro coppie vanno su due righe con `\begin{gathered}`, tre per riga, con le graffe
grandi ($\Big\{(1, a), (1, c), (1, g),$ e sotto $(4, a), (4, c), (4, g)\Big\}$); vale anche per
l'errore scritto con le graffe. Nella soluzione e nei passaggi le coppie restano su una riga. Nella
variante a scelta multipla degli altri livelli un insieme elencato più largo del pulsante va su due
righe allo stesso modo, e allora tutte le opzioni con almeno 4 elementi (succede al livello 3 con
$U = \{1, \dots, 12\}$). Il verificatore ricostruisce le righe e boccia una riga persa.

Misura (`scripts/exercises/width.mts`, 26 settembre 2026): opzioni del livello 4 al massimo 228 px
(prima 337, 175 su 600 oltre); livello 3 al massimo 224 px.

## Esercizi da evitare

- Espressioni con risultato vuoto o in cui la parentesi spostata non cambia niente.
- Più di 6 coppie da scrivere nelle opzioni.
- Problemi con la risposta già scritta nel testo.

## Domande per la revisione

- Il livello 5 usa sempre le parentesi; la lezione dice che non c'è un ordine di precedenza
  condiviso: va bene non chiedere mai espressioni senza parentesi?
- Nel prodotto cartesiano il distrattore con le coppie tra graffe è chiaro, o confonde più del
  necessario?
