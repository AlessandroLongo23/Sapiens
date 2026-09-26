# Flashcard: Intersezione insiemistica

## intersezione-definizione
Che cos'è l'intersezione di due insiemi $A$ e $B$?
---
L'insieme degli elementi che appartengono sia ad $A$ sia a $B$.

## intersezione-simbolo
Come si legge $A \cap B$?
---
"$A$ intersezione $B$".

## congiunzione-simbolo
Con quale simbolo si indica in logica la "e" della definizione di intersezione?
---
$\wedge$, la congiunzione.

## intersezione-calcolo
Quanto vale $\{1, 2, 3, 4, 5\} \cap \{2, 4, 6, 8\}$?
---
$\{2, 4\}$: sono gli unici elementi che stanno in tutti e due gli insiemi.

## intersezione-venn
In un diagramma di Eulero-Venn con due cerchi $A$ e $B$ che si sovrappongono, quale zona è $A \cap B$?
---
La zona in cui i due cerchi si sovrappongono.

## disgiunti-definizione
Come si chiamano due insiemi $A$ e $B$ tali che $A \cap B = \emptyset$?
---
Disgiunti: non hanno elementi in comune.

## intersezione-vuota-scrittura
Vero o falso: $\{1, 3, 5\} \cap \{2, 4\} = \{0\}$.
---
Falso. L'intersezione è $\emptyset$; $\{0\}$ ha un elemento, il numero zero.

## multipli-4-6
Quali numeri naturali sono nell'intersezione tra i multipli di $4$ e i multipli di $6$?
---
I multipli di $12$, il MCM tra $4$ e $6$; non i multipli di $24$, perché il $12$ è già multiplo di tutti e due.

## divisori-12-18
Quanto vale l'intersezione tra l'insieme dei divisori di $12$ e quello dei divisori di $18$?
---
$\{1, 2, 3, 6\}$: i divisori di $6$, il MCD tra $12$ e $18$.

## condizioni-estremi
Quanto vale $\{x \in \mathbb{N} \mid x \le 9\} \cap \{x \in \mathbb{N} \mid x \ge 6\}$?
---
$\{6, 7, 8, 9\}$: gli estremi $6$ e $9$ rispettano tutte e due le condizioni.

## idempotenza
Quanto vale $A \cap A$?
---
$A$: è la proprietà di idempotenza.

## intersezione-vuoto
Quanto vale $A \cap \emptyset$?
---
$\emptyset$: l'insieme vuoto non ha elementi da mettere in comune.

## elemento-neutro
Qual è l'elemento neutro dell'intersezione?
---
L'insieme universo: $A \cap U = A$.

## inclusione-intersezione
Se $A \subseteq B$, quanto vale $A \cap B$?
---
$A$: tutti gli elementi di $A$ stanno anche in $B$.

## intersezione-sottoinsieme
Vero o falso: $A \cap B \subseteq A$ per qualunque coppia di insiemi $A$ e $B$.
---
Vero. Ogni elemento di $A \cap B$ sta anche in $A$.

## tre-insiemi-calcolo
Quanto vale $\{1, 2, 3, 4, 5, 6\} \cap \{2, 4, 6, 8\} \cap \{3, 6, 9\}$?
---
$\{6\}$: è l'unico numero che sta in tutti e tre gli insiemi.

## tre-insiemi-coppie
Vero o falso: se $A \cap B$, $B \cap C$ e $A \cap C$ non sono vuoti, allora neanche $A \cap B \cap C$ è vuoto.
---
Falso. Con $\{1, 2\}$, $\{2, 3\}$ e $\{1, 3\}$ ogni coppia ha un elemento comune, ma nessun numero sta in tutti e tre.

## formula-cardinalita
Completa: $|A \cap B| = |A| + |B| - \dots$
---
$|A \cup B|$: è la formula dell'unione con $|A \cap B|$ ricavato.

## cardinalita-calcolo
Se $|A| = 18$, $|B| = 16$ e $|A \cup B| = 26$, quanto vale $|A \cap B|$?
---
$8$, perché $18 + 16 - 26 = 8$.

## cardinalita-massimo
Se $|A| = 22$ e $|B| = 17$, quanti elementi può avere al massimo $A \cap B$?
---
$17$: l'intersezione è contenuta in $B$, e ne ha $17$ quando $B \subseteq A$.
