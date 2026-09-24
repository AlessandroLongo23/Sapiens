# Flashcard: Unione insiemistica

## unione-definizione
Che cos'è l'unione di due insiemi $A$ e $B$?
---
L'insieme degli elementi che appartengono ad $A$, a $B$ o a entrambi.

## unione-simbolo
Come si legge $A \cup B$?
---
"$A$ unione $B$".

## oppure-inclusivo
Vero o falso: un elemento che sta sia in $A$ sia in $B$ non fa parte di $A \cup B$.
---
Falso. Nell'unione "oppure" ha il senso inclusivo, quindi anche gli elementi comuni fanno parte dell'unione.

## vel-simbolo
Con quale simbolo si indica in logica l'"oppure" inclusivo, il vel latino?
---
$\vee$.

## unione-calcolo
Quanto vale $\{1, 2, 3\} \cup \{3, 4, 5\}$?
---
$\{1, 2, 3, 4, 5\}$: il $3$ si scrive una volta sola.

## unione-disgiunti
Quanto vale $\{1, 3, 5\} \cup \{2, 4\}$?
---
$\{1, 2, 3, 4, 5\}$: i due insiemi sono disgiunti.

## unione-pari-multipli-tre
Tra i numeri da 1 a 10, quali sono pari oppure multipli di 3?
---
$\{2, 3, 4, 6, 8, 9, 10\}$, compreso il $6$, che è l'uno e l'altro.

## unione-venn
In un diagramma di Eulero-Venn con due cerchi $A$ e $B$ che si sovrappongono, quale zona è $A \cup B$?
---
Tutta la zona coperta dai due cerchi, compresa la parte comune.

## idempotenza
Quanto vale $A \cup A$?
---
$A$: è la proprietà di idempotenza.

## elemento-neutro
Qual è l'elemento neutro dell'unione?
---
L'insieme vuoto: $A \cup \emptyset = A$.

## unione-universo
Quanto vale $A \cup U$, se $U$ è l'insieme universo?
---
$U$: $A$ è contenuto in $U$ e non gli aggiunge niente.

## associativa
Completa la proprietà associativa: $(A \cup B) \cup C = \dots$
---
$A \cup (B \cup C)$.

## unione-tre-insiemi
Quanto vale $\{1, 2\} \cup \{2, 3\} \cup \{3, 4\}$?
---
$\{1, 2, 3, 4\}$.

## inclusione-unione
Se $A \subseteq B$, quanto vale $A \cup B$?
---
$B$: gli elementi di $A$ stanno già in $B$.

## roma-amore
Quanto vale l'unione tra l'insieme delle lettere di "roma" e quello delle lettere di "amore"?
---
$\{a, e, m, o, r\}$, cioè l'insieme delle lettere di "amore", che contiene l'altro.

## formula-cardinalita
Completa: $|A \cup B| = \dots$
---
$|A| + |B| - |A \cap B|$: gli elementi comuni si tolgono una volta perché la somma li conta due volte.

## cardinalita-disgiunti
Se $A$ e $B$ sono disgiunti, quanto vale $|A \cup B|$?
---
$|A| + |B|$, perché $A \cap B = \emptyset$.

## cardinalita-calcolo
Se $|A| = 5$, $|B| = 3$ e $|A \cap B| = 1$, quanto vale $|A \cup B|$?
---
$7$, perché $5 + 3 - 1 = 7$.

## cardinalita-errore
In una classe 15 studenti giocano a calcio, 12 a pallavolo e 5 fanno entrambi gli sport. Quanti fanno almeno uno dei due sport?
---
22, perché $15 + 12 - 5 = 22$. La somma $15 + 12 = 27$ conta due volte i 5 che fanno entrambi.

## intervalli-unione
Quanto vale $[0, 2) \cup (1, 5]$?
---
$[0, 5]$: insieme coprono tutti i numeri da $0$ a $5$, estremi compresi.
