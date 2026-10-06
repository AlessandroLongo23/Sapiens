# Flashcard: Principio di induzione

## induzione-a-cosa-serve
A che cosa serve il principio di induzione?
---
A dimostrare che un enunciato $P(n)$ è vero per tutti i numeri naturali da un certo valore in poi.

## base-definizione
Che cos'è la base dell'induzione?
---
La verifica che l'enunciato è vero per il primo valore di $n$, di solito $P(1)$.

## passo-induttivo-definizione
Che cosa si dimostra nel passo induttivo?
---
L'implicazione $P(k) \Rightarrow P(k + 1)$, per ogni $k$ dal primo valore in poi.

## ipotesi-induttiva-definizione
Che cos'è l'ipotesi induttiva?
---
$P(k)$, cioè l'enunciato con $k$ al posto di $n$, supposto vero nel passo induttivo.

## verifiche-non-dimostrano
Vero o falso: se una proprietà è vera per $n$ da $1$ a $100$, allora è vera per ogni $n$.
---
Falso. Può fallire per $n = 101$: un numero finito di verifiche non è una dimostrazione.

## controesempio-eulero
Per quale $n$ il numero $n^2 + n + 41$ smette di essere primo, dopo esserlo stato da $1$ a $39$?
---
Per $n = 40$: vale $41 \cdot 41 = 1681$.

## domino-base
Nella fila di tessere del domino, a che cosa corrisponde la base dell'induzione?
---
Alla caduta della prima tessera.

## passo-senza-base
Vero o falso: se il passo induttivo riesce, l'enunciato è vero per ogni $n$.
---
Falso. Serve anche la base: per "$n^2 + n$ è dispari" il passo induttivo riesce, ma l'enunciato è falso già per $n = 1$.

## tesi-somma-primo-membro
Per $1 + 2 + \dots + n = \dfrac{n(n + 1)}{2}$, qual è il primo membro di $P(k + 1)$?
---
$1 + 2 + \dots + k + (k + 1)$: si aggiunge il termine di posto $k + 1$.

## tesi-somma-secondo-membro
Per $1 + 2 + \dots + n = \dfrac{n(n + 1)}{2}$, qual è il secondo membro di $P(k + 1)$?
---
$\dfrac{(k + 1)(k + 2)}{2}$.

## dispari-di-posto-k-piu-uno
Il numero dispari di posto $n$ è $2n - 1$. Qual è quello di posto $k + 1$?
---
$2k + 1$, perché $2(k + 1) - 1 = 2k + 1$.

## somma-dei-quadrati-formula
Quanto vale $1^2 + 2^2 + \dots + n^2$?
---
$\dfrac{n(n + 1)(2n + 1)}{6}$.

## base-diversa-da-uno
Da quale valore di $n$ è vera la disuguaglianza $2^n > 2n + 1$?
---
Da $n = 3$: per $n = 1$ e $n = 2$ è falsa, e $2^3 = 8 > 7$.

## divisibilita-passo-induttivo
In una dimostrazione di divisibilità, come si riscrive l'espressione con $k + 1$?
---
Come somma dell'espressione con $k$, divisibile per l'ipotesi induttiva, e di un multiplo evidente del divisore.

## ricorsione-passo-induttivo
Che cosa lega $a_k$ ad $a_{k+1}$ nel passo induttivo per una successione definita per ricorsione?
---
La legge di ricorrenza.

## bernoulli-enunciato
Che cosa dice la disuguaglianza di Bernoulli?
---
$(1 + x)^n \geq 1 + nx$ per ogni $n \geq 1$, se $x > -1$.

## induzione-non-scopre
Vero o falso: l'induzione serve a trovare una formula che non si conosce.
---
Falso. Serve a dimostrare una formula già nota o ipotizzata.
