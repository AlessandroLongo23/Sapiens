# Flashcard: Numeri interi con segno e complemento a due

## modulo-e-segno-definizione
Come si scrive un numero intero in modulo e segno?
---
Il bit più significativo è il segno ($0$ positivo, $1$ negativo) e gli altri bit sono il modulo in binario.

## modulo-e-segno-leggere
Quale numero rappresenta $1000\,0011$ in modulo e segno?
---
$-3$. L'MSB a $1$ dice che è negativo, gli altri bit valgono $3$.

## modulo-e-segno-intervallo
Quali numeri si scrivono con 8 bit in modulo e segno?
---
Da $-127$ a $+127$: un bit va al segno e ne restano 7 per il modulo.

## modulo-e-segno-due-zeri
Vero o falso: in modulo e segno lo zero si scrive in un modo solo.
---
Falso. $0000\,0000$ e $1000\,0000$ sono $+0$ e $-0$.

## modulo-e-segno-somma
Perché i calcolatori non usano il modulo e segno per i numeri interi?
---
Perché lo zero ha due scritture e l'addizione binaria tra un positivo e un negativo dà un risultato sbagliato.

## complemento-a-due-peso-msb
In complemento a due su 8 bit, quanto pesa il bit più significativo?
---
$-128$. Gli altri pesi sono quelli del binario: $64$, $32$, $16$, $8$, $4$, $2$, $1$.

## complemento-a-due-segno
In complemento a due, che cosa dice un MSB a $1$?
---
Che il numero è negativo: gli altri pesi insieme non arrivano a compensare il peso negativo dell'MSB.

## complemento-a-due-tutti-uno
Quanto vale $1111\,1111$ in complemento a due?
---
$-1$. Infatti $-128 + 127 = -1$.

## complemento-a-due-procedimento
Quali sono i tre passi per scrivere $-x$ in complemento a due su 8 bit?
---
Scrivi $x$ in binario su 8 bit, inverti tutti i bit, somma $1$.

## complemento-a-due-dimenticare-uno
Hai scritto $5$ su 8 bit e hai invertito i bit: $1111\,1010$. È $-5$?
---
No, è $-6$. Manca il passo finale: sommando $1$ si ottiene $1111\,1011$, che è $-5$.

## opposto
Come si trova l'opposto di un numero scritto in complemento a due?
---
Si invertono tutti i bit e si somma $1$. Vale sia da positivo a negativo sia da negativo a positivo.

## intervallo-otto-bit
Quali numeri si scrivono con 8 bit in complemento a due?
---
Da $-128$ a $127$.

## intervallo-n-bit
Completa: con $n$ bit in complemento a due si scrivono i numeri da ... a ...
---
Da $-2^{n-1}$ a $2^{n-1} - 1$.

## intervallo-quattro-bit
Qual è il numero più grande che si scrive con 4 bit in complemento a due?
---
$7$, cioè $2^3 - 1$. La sequenza è $0111$.

## meno-128-opposto
Quale numero su 8 bit in complemento a due non ha l'opposto?
---
$-128$: il suo opposto sarebbe $+128$, ma l'intervallo si ferma a $127$.

## somma-riporto
Nella somma di due numeri in complemento a due, che cosa si fa del riporto che esce dall'ultimo bit a sinistra?
---
Si scarta: il risultato sono gli 8 bit che restano.

## traboccamento-definizione
Che cos'è il traboccamento (overflow)?
---
Il risultato vero di una somma esce dall'intervallo dei numeri che i bit possono contenere, e nei bit resta un numero sbagliato.

## traboccamento-segni
Due numeri positivi sommati su 8 bit danno un risultato con l'MSB a $1$. Che cosa è successo?
---
Un traboccamento: due positivi non possono dare un negativo.

## traboccamento-segni-diversi
Vero o falso: sommando un numero positivo e uno negativo può esserci traboccamento.
---
Falso. Il risultato sta tra i due addendi, quindi resta nell'intervallo.

## traboccamento-conto
Su 8 bit in complemento a due, che numero dà $127 + 1$?
---
$-128$: dopo $0111\,1111$ viene $1000\,0000$.
