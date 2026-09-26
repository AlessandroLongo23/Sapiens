# Flashcard: Quantificatori

## enunciato-aperto-definizione
Che cos'è un enunciato aperto?
---
Una frase con una variabile che diventa una proposizione, vera o falsa, quando alla variabile si sostituisce un elemento dell'universo.

## enunciato-aperto-proposizione
Vero o falso: "$x > 3$" è una proposizione.
---
Falso. È un enunciato aperto: diventa vero o falso solo sostituendo un numero a $x$ o usando un quantificatore.

## insieme-verita-definizione
Che cos'è l'insieme di verità $V_p$ di un enunciato aperto $p(x)$?
---
L'insieme degli elementi dell'universo che rendono vero $p(x)$: $V_p = \{x \in U \mid p(x)\}$.

## insieme-verita-divisori
Con $U = \{1, 2, \dots, 10\}$, qual è l'insieme di verità di "$x$ è un divisore di 12"?
---
$\{1, 2, 3, 4, 6\}$.

## per-ogni-simbolo
Come si legge $\forall$?
---
"Per ogni".

## esiste-simbolo
Come si legge $\exists$?
---
"Esiste".

## controesempio-definizione
Che cos'è un controesempio a $\forall x \in U,\ p(x)$?
---
Un elemento di $U$ per cui $p(x)$ è falso. Ne basta uno per dire che la proposizione è falsa.

## controesempio-zero
Vero o falso: $\forall x \in \mathbb{N},\ 2x > x$.
---
Falso: con $x = 0$ si ha $0 > 0$, che è falso.

## esempi-non-bastano
Vero o falso: se $p(x)$ vale per $x = 0, 1, \dots, 39$, allora vale per ogni $x \in \mathbb{N}$.
---
Falso. $n^2 + n + 41$ è primo da $0$ a $39$, ma per $n = 40$ vale $41 \cdot 41$.

## esiste-almeno-uno
Vero o falso: $\exists x \in \mathbb{Z} : x^2 = 4$ è falsa, perché le soluzioni sono due.
---
Falso: è vera. "Esiste" vuol dire almeno uno.

## esiste-uno-solo
Come si legge $\exists!$?
---
"Esiste uno e un solo".

## universo-naturali-interi
In quale dei due universi, $\mathbb{N}$ o $\mathbb{Z}$, è vera $\exists x : x + 3 = 1$?
---
In $\mathbb{Z}$, con $x = -2$. In $\mathbb{N}$ è falsa.

## nessuno-simbolo
Come si scrive in simboli "nessun numero naturale è negativo"?
---
$\forall x \in \mathbb{N},\ x \ge 0$: "nessuno" è un "per ogni" con la negazione.

## negazione-per-ogni
Completa: $\neg\big(\forall x \in U,\ p(x)\big)$ equivale a $\dots$
---
$\exists x \in U : \neg p(x)$.

## negazione-esiste
Completa: $\neg\big(\exists x \in U : p(x)\big)$ equivale a $\dots$
---
$\forall x \in U,\ \neg p(x)$.

## negazione-tutti-studenti
Qual è la negazione di "tutti gli studenti hanno studiato"?
---
"Almeno uno studente non ha studiato". Non "nessuno studente ha studiato".

## negazione-disuguaglianza
Qual è la negazione di $\forall x \in \mathbb{Z},\ x^2 > 0$?
---
$\exists x \in \mathbb{Z} : x^2 \le 0$: il contrario di $>$ è $\le$.

## per-ogni-insiemi
Completa: $\forall x \in U,\ p(x)$ è vera se e solo se $V_p = \dots$
---
$U$: nessun elemento dell'universo resta fuori dall'insieme di verità.

## esiste-insiemi
Completa: $\exists x \in U : p(x)$ è vera se e solo se $V_p \dots$
---
$V_p \ne \emptyset$: l'insieme di verità ha almeno un elemento.

## ordine-quantificatori
Vero o falso: $\exists y \in \mathbb{N} : \forall x \in \mathbb{N},\ y > x$.
---
Falso: nessun naturale è più grande di tutti, perché non è più grande di sé stesso.
