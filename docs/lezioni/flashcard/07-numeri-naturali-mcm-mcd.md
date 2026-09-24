# Flashcard: MCD e MCM in ℕ

## divisore-definizione
Quando un naturale $b \neq 0$ è un divisore di $a$?
---
Quando la divisione $a : b$ ha resto $0$, cioè quando esiste un naturale $q$ tale che $a = b \cdot q$.

## multipli-infiniti
Vero o falso: i multipli di $7$ sono finiti.
---
Falso. Sono infiniti: $0, 7, 14, 21, \dots$ Sono i divisori di un numero a essere finiti.

## primo-definizione
Quando un numero naturale è primo?
---
Quando è maggiore di $1$ e ha esattamente due divisori, $1$ e sé stesso.

## uno-non-primo
Vero o falso: $1$ è un numero primo.
---
Falso. Ha un solo divisore, sé stesso.

## criterio-3
Quando un numero è divisibile per $3$?
---
Quando la somma delle sue cifre è divisibile per $3$.

## criterio-4-conto
$5316$ è divisibile per $4$?
---
Sì: le ultime due cifre formano $16$, che è divisibile per $4$.

## criterio-9-conto
$4527$ è divisibile per $9$?
---
Sì: la somma delle cifre è $4 + 5 + 2 + 7 = 18$, multiplo di $9$.

## criterio-11-conto
$2574$ è divisibile per $11$?
---
Sì. Da destra, le cifre di posto dispari danno $4 + 5 = 9$, quelle di posto pari $7 + 2 = 9$, e $9 - 9 = 0$.

## teorema-fondamentale
Come si chiama il teorema per cui ogni numero maggiore di $1$ si scompone in fattori primi in un solo modo, a meno dell'ordine?
---
Il teorema fondamentale dell'aritmetica.

## scomposizione-72
Scomponi $72$ in fattori primi.
---
$72 = 2^3 \cdot 3^2$.

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

## primi-tra-loro-composti
Vero o falso: $8$ e $15$ non sono primi tra loro, perché nessuno dei due è primo.
---
Falso. $\text{MCD}(8, 15) = 1$, quindi sono primi tra loro anche se sono entrambi composti.

## problema-corde
Devi tagliare due corde lunghe $24$ m e $36$ m in pezzi tutti uguali, i più lunghi possibile, senza avanzi. Ti serve il MCD o il MCM?
---
Il MCD: cerchi la misura più grande che sta un numero intero di volte in entrambe le lunghezze.
