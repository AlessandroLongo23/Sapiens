# Flashcard: Conversioni tra binario e decimale

## potenze-di-due
Quali sono le potenze di due da $2^0$ a $2^8$?
---
$1$, $2$, $4$, $8$, $16$, $32$, $64$, $128$, $256$.

## due-alla-dieci
Quanto vale $2^{10}$?
---
$1024$.

## msb-lsb
Che cosa sono l'MSB e l'LSB di un numero binario?
---
L'MSB è il bit più significativo, quello più a sinistra e di peso maggiore; l'LSB è il meno significativo, quello più a destra, di peso $1$.

## binario-decimale-regola
Come si trova il valore in base dieci di un numero binario?
---
Si sommano i pesi dei bit che valgono $1$; i pesi, da destra, sono $1$, $2$, $4$, $8$ e così via.

## converti-1011
Quanto vale $1011_2$?
---
$11$: $8 + 2 + 1$.

## converti-1100
Quanto vale $1100_2$?
---
$12$: $8 + 4$.

## primo-peso
Vero o falso: il peso del bit più a destra è $2$.
---
Falso. È $2^0 = 1$: partendo da $2$ si trova il doppio del numero.

## pari-dispari
Come si vede se un numero binario è pari o dispari?
---
Dall'ultimo bit a destra: $0$ pari, $1$ dispari.

## tutti-uno
Quanto vale $1111\,1111_2$?
---
$255$, cioè $2^8 - 1$: $n$ bit tutti a $1$ valgono $2^n - 1$.

## divisioni-regola
Nel metodo delle divisioni successive, quando ci si ferma?
---
Quando il quoziente diventa $0$: l'ultima divisione è $1 : 2$, con quoziente $0$ e resto $1$.

## divisioni-lettura
In che ordine si leggono i resti delle divisioni successive?
---
Dal basso verso l'alto: l'ultimo resto trovato è l'MSB, il primo è l'LSB.

## converti-13
Scrivi $13$ in binario.
---
$1101_2$: $13 = 8 + 4 + 1$.

## converti-10
Scrivi $10$ in binario.
---
$1010_2$: $10 = 8 + 2$.

## potenze-metodo
Nel metodo delle potenze di due, da quale potenza si parte?
---
Dalla più grande potenza di due che non supera il numero: il suo bit è l'MSB.

## zeri-saltati
$200 = 128 + 64 + 8$. Perché non si scrive $111_2$?
---
Perché ogni potenza che non compare vale un bit $0$: il numero è $1100\,1000_2$.

## numeri-con-n-bit
Quanti numeri si scrivono con $8$ bit, e qual è il più grande?
---
$2^8 = 256$ numeri, da $0$ a $255$.

## bit-necessari
Quanti bit servono per scrivere $200$?
---
$8$: $200$ è minore di $2^8 = 256$ ma non di $2^7 = 128$.

## bit-256
Vero o falso: $256$ si scrive con $8$ bit.
---
Falso. $256 = 1\,0000\,0000_2$ ha $9$ bit: con $8$ bit si arriva a $255$.

## zeri-a-sinistra
Vero o falso: $0000\,1101_2$ e $1101_2$ sono lo stesso numero.
---
Vero. Gli zeri a sinistra non cambiano il valore.
