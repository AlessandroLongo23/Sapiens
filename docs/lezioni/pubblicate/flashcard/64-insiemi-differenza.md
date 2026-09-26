# Flashcard: Differenza e complementare

## differenza-definizione
Che cos'è la differenza $A \setminus B$?
---
L'insieme degli elementi che appartengono ad $A$ e non appartengono a $B$.

## differenza-calcolo
Quanto vale $\{1, 2, 3, 4, 5\} \setminus \{4, 5, 6, 7\}$?
---
$\{1, 2, 3\}$: da $A$ si tolgono $4$ e $5$, che stanno anche in $B$.

## differenza-non-commutativa
Vero o falso: $A \setminus B = B \setminus A$ per qualunque coppia di insiemi.
---
Falso. Per esempio $\{1, 2, 3, 4, 5\} \setminus \{4, 5, 6, 7\} = \{1, 2, 3\}$, mentre $\{4, 5, 6, 7\} \setminus \{1, 2, 3, 4, 5\} = \{6, 7\}$.

## differenza-elementi-secondo
Quanto vale $\{1, 2\} \setminus \{2, 3\}$?
---
$\{1\}$. Il $3$ sta nel secondo insieme e non nel primo, quindi non entra nella differenza.

## differenza-pari-multipli-quattro
Quali numeri naturali sono pari ma non multipli di $4$?
---
$\{2, 6, 10, 14, \dots\}$.

## differenza-se-stesso
Quanto vale $A \setminus A$?
---
$\emptyset$, l'insieme vuoto: non il numero $0$ e neppure $\{0\}$.

## differenza-disgiunti
Se $A$ e $B$ sono disgiunti, quanto vale $A \setminus B$?
---
$A$: nessun elemento di $A$ sta in $B$, quindi non si toglie niente.

## differenza-vuota-inclusione
Completa: $A \setminus B = \emptyset$ se e solo se $\dots$
---
$A \subseteq B$.

## cardinalita-differenza
Completa: $|A \setminus B| = \dots$
---
$|A| - |A \cap B|$.

## cardinalita-differenza-errore
$14$ studenti suonano, $9$ cantano nel coro e $5$ fanno entrambe le cose. Quanti suonano ma non cantano?
---
$9$, perché $14 - 5 = 9$. Il conto $14 - 9$ è sbagliato: non tutti quelli del coro suonano.

## complementare-definizione
Che cos'è il complementare $\overline{A}$ rispetto all'universo $U$?
---
L'insieme degli elementi di $U$ che non appartengono ad $A$, cioè $U \setminus A$.

## complementare-calcolo
Con $U = \{1, 2, \dots, 10\}$, qual è il complementare dei numeri pari?
---
$\{1, 3, 5, 7, 9\}$.

## complementare-dipende-universo
Vero o falso: in $\mathbb{Q}$ il complementare dell'insieme dei numeri pari è l'insieme dei numeri dispari.
---
Falso. Contiene anche le frazioni come $\frac{1}{2}$, che non sono né pari né dispari.

## complementare-rispetto-insieme
Se $B \subseteq A$, come si scrive con una differenza il complementare $\complement_A B$?
---
$A \setminus B$.

## complementare-unione
Completa: $A \cup \overline{A} = \dots$
---
$U$: ogni elemento dell'universo sta in $A$ o fuori da $A$.

## doppio-complementare
Quanto vale $\overline{\overline{A}}$?
---
$A$.

## differenza-intersezione-complementare
Scrivi $A \setminus B$ come intersezione.
---
$A \cap \overline{B}$.

## de-morgan-intersezione
Completa la legge di De Morgan: $\overline{A \cap B} = \dots$
---
$\overline{A} \cup \overline{B}$.

## de-morgan-errore
Vero o falso: $\overline{A \cup B} = \overline{A} \cup \overline{B}$.
---
Falso. $\overline{A \cup B} = \overline{A} \cap \overline{B}$: passando al complementare l'unione diventa intersezione.

## nessuno-sport
In una classe di $30$, $25$ fanno almeno uno sport tra calcio e nuoto. Quanti non ne fanno nessuno?
---
$5$: sono il complementare dell'unione, $30 - 25 = 5$.
