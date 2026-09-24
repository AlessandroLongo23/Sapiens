# Flashcard: MCD e MCM in ℕ

## mcd-definizione
Che cos'è il massimo comune divisore di due numeri?
---
Il più grande numero che li divide tutti e due.

## mcd-divisori-elenco
Quanto vale $\text{MCD}(12, 20)$? Trovalo elencando i divisori.
---
$4$: i divisori comuni di $12$ e $20$ sono $1, 2, 4$.

## mcd-regola
Per il MCD con la scomposizione, quali fattori prendi e con quale esponente?
---
Solo i fattori comuni a tutti i numeri, ciascuno con l'esponente più piccolo.

## mcm-regola
Per il MCM con la scomposizione, quali fattori prendi e con quale esponente?
---
Tutti i fattori, comuni e non comuni, ciascuno una volta sola con l'esponente più grande.

## mcd-conto
Quanto vale $\text{MCD}(24, 36)$?
---
$12$: $24 = 2^3 \cdot 3$ e $36 = 2^2 \cdot 3^2$, e i fattori comuni con l'esponente più piccolo danno $2^2 \cdot 3$.

## mcm-conto
Quanto vale $\text{MCM}(4, 6)$?
---
$12$: $4 = 2^2$ e $6 = 2 \cdot 3$, e tutti i fattori con l'esponente più grande danno $2^2 \cdot 3$.

## mcm-definizione
Che cos'è il minimo comune multiplo di due numeri?
---
Il più piccolo numero diverso da zero che è multiplo di tutti e due.

## euclide-passo
Se $a = b \cdot q + r$ è la divisione con resto, $\text{MCD}(a, b)$ è uguale a quale altro MCD?
---
$\text{MCD}(b, r)$. È il passo su cui si basa l'algoritmo di Euclide.

## mcd-per-mcm
Completa, per due numeri $a$ e $b$ diversi da zero: $\text{MCD}(a, b) \cdot \text{MCM}(a, b) = \dots$
---
$a \cdot b$. La formula vale solo per due numeri.

## mcm-dalla-formula
Sapendo che $\text{MCD}(12, 18) = 6$, quanto vale $\text{MCM}(12, 18)$?
---
$36$: $12 \cdot 18 : 6 = 216 : 6 = 36$.

## primi-tra-loro-definizione
Quando due numeri sono primi tra loro?
---
Quando il loro MCD è $1$, cioè non hanno divisori comuni oltre a $1$.

## mcm-primi-tra-loro
Quanto vale $\text{MCM}(7, 9)$?
---
$63$: $7$ e $9$ sono primi tra loro, quindi il MCM è il prodotto.

## primi-tra-loro-composti
Vero o falso: $8$ e $15$ non sono primi tra loro, perché nessuno dei due è primo.
---
Falso. $\text{MCD}(8, 15) = 1$, quindi sono primi tra loro anche se sono entrambi composti.

## problema-corde
Devi tagliare due corde lunghe $24$ m e $36$ m in pezzi tutti uguali, i più lunghi possibile, senza avanzi. Ti serve il MCD o il MCM?
---
Il MCD: cerchi la misura più grande che sta un numero intero di volte in entrambe le lunghezze.

## problema-autobus
Due autobus partono insieme: uno passa ogni $12$ minuti, l'altro ogni $18$. Ti serve il MCD o il MCM per sapere quando ripassano insieme?
---
Il MCM: cerchi il primo momento in cui due fenomeni ripetuti si ritrovano, dopo $\text{MCM}(12, 18) = 36$ minuti.
