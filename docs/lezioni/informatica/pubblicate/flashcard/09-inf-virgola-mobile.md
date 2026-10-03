# Flashcard: Numeri reali in virgola mobile

## pesi-dopo-la-virgola
In base due, quanto pesano le prime tre cifre dopo la virgola?
---
$\frac{1}{2}$, $\frac{1}{4}$ e $\frac{1}{8}$: ogni cifra pesa la metà della precedente.

## leggere-zero-virgola-uno
Quanto vale $0{,}1_2$ in base dieci?
---
$0{,}5$. La prima cifra dopo la virgola pesa $\frac{1}{2}$.

## leggere-uno-virgola-undici
Quanto vale $1{,}11_2$ in base dieci?
---
$1{,}75$, cioè $1 + \frac{1}{2} + \frac{1}{4}$.

## errore-cifre-come-intero
Vero o falso: $101{,}011_2$ vale $5{,}3$ perché $011_2 = 3$.
---
Falso. Le cifre dopo la virgola pesano $\frac{1}{2}$, $\frac{1}{4}$, $\frac{1}{8}$: il numero vale $5{,}375$.

## procedimento-moltiplicazioni
Come si trovano le cifre binarie della parte dopo la virgola di un numero decimale?
---
Si moltiplica per $2$ più volte: ogni volta la parte intera del risultato è una cifra, e si continua con la parte dopo la virgola.

## scrivere-zero-settantacinque
Come si scrive $0{,}75$ in base due?
---
$0{,}11_2$, perché $0{,}75 = \frac{1}{2} + \frac{1}{4}$.

## zero-virgola-uno-non-esatto
Perché $0{,}1$ non si può scrivere in modo esatto in base due?
---
Perché in base due ha infinite cifre dopo la virgola, che si ripetono: $0{,}0001\,1001\,1001\ldots_2$.

## regola-denominatore
Quali numeri hanno un numero finito di cifre binarie dopo la virgola?
---
Quelli che, scritti come frazione ridotta ai minimi termini, hanno per denominatore una potenza di $2$.

## esatto-o-no
Quale dei due è esatto in base due: $0{,}2$ oppure $0{,}25$?
---
$0{,}25$, che è $\frac{1}{4}$. Invece $0{,}2 = \frac{1}{5}$ ha infinite cifre binarie.

## forma-normalizzata
Che cos'è la forma normalizzata di un numero binario in notazione scientifica?
---
Quella con una sola cifra prima della virgola, che è $1$, moltiplicata per una potenza di $2$.

## tre-parti
Quali sono le tre parti di un numero in virgola mobile?
---
Il segno, la mantissa e l'esponente.

## normalizzare-grande
Completa: $1101{,}01_2 = 1{,}10101_2 \cdot 2^{\ldots}$
---
$2^3$. La virgola si sposta di tre posti verso sinistra.

## normalizzare-piccolo
Completa: $0{,}01_2 = 1_2 \cdot 2^{\ldots}$
---
$2^{-2}$. La virgola si sposta di due posti verso destra, quindi l'esponente è negativo.

## perche-mobile
Perché si chiama virgola mobile?
---
Perché la virgola non ha un posto fisso tra i bit: la sua posizione è data dall'esponente.

## ieee-campi-32
Come sono divisi i 32 bit di un numero in virgola mobile nello standard IEEE 754?
---
1 bit per il segno, 8 per l'esponente, 23 per la mantissa.

## ieee-campi-64
Quanti bit ha la mantissa nel formato a 64 bit?
---
52 bit, con 11 bit di esponente e 1 di segno.

## ieee-esponente
Nel formato a 32 bit, che numero si scrive nel campo dell'esponente se l'esponente vero è $2$?
---
$129$, cioè $2 + 127$.

## ieee-uno-non-scritto
Perché nel campo della mantissa non si scrive l'$1$ prima della virgola?
---
Perché nella forma normalizzata in base due c'è sempre: non scriverlo fa risparmiare un bit.

## arrotondamento-somma
Vero o falso: a 64 bit, in virgola mobile, $0{,}1 + 0{,}2$ dà proprio $0{,}3$.
---
Falso. Dà $0{,}30000000000000004$, perché $0{,}1$ e $0{,}2$ sono memorizzati arrotondati.

## confronto
Come si controlla se due risultati in virgola mobile sono "uguali"?
---
Si guarda se la loro differenza è abbastanza piccola, perché gli arrotondamenti possono renderli diversi nelle ultime cifre.
