# Flashcard: MCD e MCM di polinomi

## divisibile-definizione
Quando un polinomio $A$ è divisibile per un polinomio $B$ non nullo?
---
Quando esiste un polinomio $Q$ tale che $A = B \cdot Q$, cioè quando la divisione di $A$ per $B$ ha resto zero.

## mcd-definizione
Che cos'è il MCD di due o più polinomi?
---
Il polinomio di grado più alto tra quelli che li dividono tutti.

## mcm-definizione
Che cos'è il MCM di due o più polinomi?
---
Il polinomio di grado più basso tra quelli che sono multipli di tutti.

## primo-passo
Qual è il primo passo per calcolare MCD e MCM di polinomi?
---
Scomporre ogni polinomio in fattori irriducibili.

## mcd-fattori
Quali fattori entrano nel MCD, e con quale esponente?
---
Solo i fattori comuni a tutti i polinomi, ognuno con l'esponente minore.

## mcm-fattori
Quali fattori entrano nel MCM, e con quale esponente?
---
Tutti, comuni e non comuni, ognuno una volta sola con l'esponente maggiore.

## fattore-numerico-interi
Se i fattori numerici sono tutti interi, qual è il fattore numerico del MCM?
---
Il MCM dei loro valori assoluti.

## fattore-numerico-frazioni
Se almeno un fattore numerico è una frazione, qual è il fattore numerico del MCD e del MCM?
---
$1$, per tutti e due.

## primi-tra-loro
Quando due polinomi si dicono primi tra loro?
---
Quando non hanno fattori comuni, a parte i numeri. Il loro MCD è solo un numero, per esempio $1$.

## termini-non-fattori
Qual è il MCD di $x^2 - 9$ e $x^2 + x - 2$?
---
$1$. Il termine $x^2$ non è un fattore: scomposti, i due polinomi non hanno fattori comuni.

## opposti-riscrittura
Come si scrive $3 - x$ usando il fattore $x - 3$?
---
$3 - x = -(x - 3)$.

## opposti-quadrato
Vero o falso: $(3 - x)^2 = (x - 3)^2$.
---
Vero. Con esponente pari il segno sparisce, perché $(-1)^2 = 1$.

## opposti-cubo
Vero o falso: $(3 - x)^3 = (x - 3)^3$.
---
Falso. $(3 - x)^3 = -(x - 3)^3$: con esponente dispari il segno resta.

## somma-non-opposto
Vero o falso: $3 + x$ e $x + 3$ sono fattori opposti.
---
Falso. Sono lo stesso fattore scritto in un altro ordine, perché l'addizione è commutativa.

## mcd-opposti-conto
Qual è il MCD di $x - 3$ e $9 - x^2$?
---
$x - 3$. Infatti $9 - x^2 = -(x - 3)(x + 3)$.

## mcd-conto
Qual è il MCD di $6x^2 + 6x$ e $4x^2 - 4$?
---
$2(x + 1)$. Infatti $6x^2 + 6x = 6x(x + 1)$ e $4x^2 - 4 = 4(x - 1)(x + 1)$.

## mcm-conto
Qual è il MCM di $x(x - 2)^2$ e $x^2(x - 2)$?
---
$x^2(x - 2)^2$.

## mcd-esponenti-conto
Qual è il MCD di $x(x - 2)^2$ e $x^2(x - 2)$?
---
$x(x - 2)$.

## falso-quadrato
Il falso quadrato $x^2 + 2x + 4$ è uguale a $(x + 2)^2$?
---
No. $(x + 2)^2 = x^2 + 4x + 4$; il falso quadrato non si scompone e nel MCM entra intero.

## controllo-prodotto
Vero o falso: per due polinomi con fattori numerici interi, MCD per MCM è uguale al prodotto dei due polinomi, a meno del segno.
---
Vero. Per ogni fattore il minimo più il massimo dei due esponenti è uguale alla loro somma.
