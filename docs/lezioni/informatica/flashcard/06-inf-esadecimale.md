# Flashcard: Il sistema esadecimale

## esadecimale-definizione
Che cos'è il sistema esadecimale?
---
Il sistema posizionale in base sedici, con le cifre da $0$ a $9$ e le lettere da A a F.

## cifra-a
Quanto vale la cifra esadecimale A?
---
$10$.

## cifra-f
Quanto vale la cifra esadecimale F, e come si scrive in binario?
---
$15$, cioè $1111$.

## cifra-dodici
Quale cifra esadecimale vale $12$?
---
C.

## pesi-esadecimali
Quali sono i pesi delle prime tre posizioni in base sedici, da destra?
---
$1$, $16$, $256$.

## dieci-in-base-sedici
Quanto vale $10_{16}$ in base dieci?
---
$16$. In ogni base la scrittura $10$ indica la base stessa.

## converti-2f
Quanto vale $\text{2F}_{16}$ in base dieci?
---
$47$: $2 \cdot 16 + 15$.

## converti-ff
Quanto vale $\text{FF}_{16}$ in base dieci?
---
$255$: $15 \cdot 16 + 15$. È il valore più grande di un byte.

## divisioni-per-sedici
Come si converte un numero da decimale a esadecimale?
---
Con le divisioni successive per $16$: i resti, letti dal basso, sono le cifre, e i resti da $10$ a $15$ diventano le lettere da A a F.

## resto-maggiore-di-nove
Dividendo per $16$ esce il resto $13$. Che cosa si scrive?
---
La cifra D. Un resto è sempre una cifra sola.

## quattro-bit
Perché una cifra esadecimale corrisponde a quattro bit?
---
Perché $16 = 2^4$: quattro bit hanno sedici combinazioni, tante quante le cifre esadecimali.

## gruppi-da-destra
Da quale parte si formano i gruppi di quattro bit per passare all'esadecimale?
---
Da destra; se il gruppo di sinistra è incompleto si aggiungono zeri a sinistra.

## converti-binario
Scrivi $1011\,0110_2$ in esadecimale.
---
$\text{B6}_{16}$: $1011$ è B, $0110$ è $6$.

## converti-a5
Scrivi $\text{A5}_{16}$ in binario.
---
$1010\,0101_2$: A è $1010$, $5$ è $0101$.

## quattro-bit-sempre
Vero o falso: passando da esadecimale a binario la cifra $5$ in mezzo al numero si scrive $101$.
---
Falso. Ogni cifra diventa sempre quattro bit: $0101$.

## byte-due-cifre
Con quante cifre esadecimali si scrive un byte?
---
Con due, da $00$ a $\text{FF}$.

## ottale-definizione
Quante cifre ha il sistema ottale, e a quanti bit corrisponde ognuna?
---
Otto cifre, da $0$ a $7$; ognuna corrisponde a tre bit, perché $8 = 2^3$.

## converti-ottale
Quanto vale $17_8$ in base dieci?
---
$15$: $1 \cdot 8 + 7$.

## colore-struttura
Che cosa indicano le sei cifre di un colore come `#FF8000`?
---
A coppie, le intensità di rosso, verde e blu, ognuna da $00$ a $\text{FF}$, cioè da $0$ a $255$.

## colore-nero-bianco
Che colori sono `#000000` e `#FFFFFF`?
---
Nero e bianco: tre luci spente, tre luci al massimo.
