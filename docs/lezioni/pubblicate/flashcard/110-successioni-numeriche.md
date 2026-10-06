# Flashcard: Successioni numeriche

## successione-definizione
Che cos'è una successione numerica?
---
Una funzione che a ogni numero naturale $n \geq 1$ associa un numero reale $a_n$.

## indice-significato
Nel termine $a_7$, che cosa indica il numero $7$?
---
L'indice, cioè il posto: $a_7$ è il settimo termine della successione.

## termine-generale-definizione
Che cos'è il termine generale di una successione?
---
L'espressione di $a_n$ in funzione dell'indice $n$.

## termine-generale-calcolo
Quanto vale $a_4$ nella successione $a_n = n^2 - 3n$?
---
$4$, perché $16 - 12 = 4$.

## termine-successivo-errore
Vero o falso: $a_{n+1}$ e $a_n + 1$ sono la stessa cosa.
---
Falso. $a_{n+1}$ è il termine di posto $n + 1$; $a_n + 1$ è il termine di posto $n$ aumentato di $1$.

## numero-termine-della-successione
Il numero $15$ è un termine della successione $a_n = 2n$?
---
No: da $2n = 15$ viene $n = \dfrac{15}{2}$, che non è un numero naturale.

## meno-uno-alla-n
Quanto vale $(-1)^n$ quando $n$ è pari? E quando è dispari?
---
$1$ per $n$ pari, $-1$ per $n$ dispari.

## ricorsione-definizione
Che cosa serve per definire una successione per ricorsione?
---
Il primo termine e una legge di ricorrenza, che dà ogni termine a partire dal precedente.

## ricorsione-calcolo
Quanto vale $a_3$ se $a_1 = 3$ e $a_{n+1} = 2a_n - 1$?
---
$9$: $a_2 = 2 \cdot 3 - 1 = 5$ e $a_3 = 2 \cdot 5 - 1 = 9$.

## ricorsione-primo-termine
Vero o falso: la legge $a_{n+1} = 2a_n - 1$ da sola individua una successione.
---
Falso. Serve anche il primo termine: con $a_1 = 3$ si ottiene $3, 5, 9, \dots$, con $a_1 = 1$ si ottiene $1, 1, 1, \dots$

## fibonacci-primi-termini
Quali sono i primi sei termini della successione di Fibonacci?
---
$1, 1, 2, 3, 5, 8$: ogni termine è la somma dei due precedenti.

## grafico-punti-isolati
Vero o falso: nel grafico di una successione i punti si uniscono con una linea.
---
Falso. Il grafico è fatto dei punti isolati $(n, a_n)$, perché tra un indice e il successivo non ci sono altri indici.

## crescente-definizione
Quando una successione è crescente?
---
Quando $a_{n+1} > a_n$ per ogni $n$.

## monotonia-metodo
Di quale espressione si studia il segno per stabilire se una successione è monotona?
---
Della differenza $a_{n+1} - a_n$, per ogni $n \geq 1$.

## monotona-segni-alterni
La successione $a_n = (-1)^n$ è monotona?
---
No: i suoi termini sono $-1, 1, -1, 1, \dots$, e salgono e scendono a ogni passo.

## limitata-superiormente-definizione
Quando una successione è limitata superiormente?
---
Quando esiste un numero $M$ tale che $a_n \leq M$ per ogni $n$.

## limitata-n-quadro
La successione $a_n = n^2$ è limitata?
---
No. È limitata inferiormente, perché $a_n \geq 1$, ma non superiormente.

## limitata-due-meno-uno-su-n
Tra quali numeri sono compresi tutti i termini di $a_n = 2 - \dfrac{1}{n}$?
---
Tra $1$ e $2$: $1 \leq a_n < 2$ per ogni $n$.
