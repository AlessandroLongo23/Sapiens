# Flashcard: Addizione e moltiplicazione in binario

## uno-piu-uno
Quanto fa $1 + 1$ in binario?
---
$10_2$: si scrive $0$ e si riporta $1$.

## uno-piu-uno-piu-uno
Quanto fa $1 + 1 + 1$ in binario?
---
$11_2$: si scrive $1$ e si riporta $1$.

## riporto-definizione
Che cos'è il riporto?
---
L'$1$ che passa alla colonna di sinistra quando la somma di una colonna è $2$ o $3$.

## colonna-di-partenza
Da quale colonna si comincia un'addizione in colonna?
---
Da quella di destra, cioè dai bit meno significativi.

## somma-semplice
Calcola $101_2 + 10_2$.
---
$111_2$: nessuna colonna ha due $1$, quindi non ci sono riporti. In base dieci $5 + 2 = 7$.

## somma-con-riporto
Calcola $11_2 + 1_2$.
---
$100_2$: il riporto passa per due colonne. In base dieci $3 + 1 = 4$.

## somma-uguali
Calcola $101_2 + 101_2$.
---
$1010_2$: sommare un numero a se stesso lo raddoppia, cioè aggiunge uno zero a destra.

## due-non-esiste
Vero o falso: in binario $1 + 1 = 2$.
---
Falso. In base due la cifra $2$ non esiste: il risultato si scrive $10_2$.

## massimo-otto-bit
Qual è il numero più grande che sta in $8$ bit senza segno?
---
$255$, cioè $1111\,1111_2$.

## traboccamento-definizione
Che cos'è il traboccamento (overflow)?
---
Quello che succede quando il risultato non sta nei bit disponibili: il riporto dell'ultima colonna si perde e resta un numero sbagliato.

## traboccamento-riconoscere
Come si riconosce il traboccamento in un'addizione senza segno?
---
Dall'ultima colonna a sinistra esce un riporto.

## traboccamento-esempio
Un byte contiene $255$ e gli si somma $1$. Che cosa contiene alla fine?
---
$0$: la somma è $1\,0000\,0000_2$, e negli otto bit restano solo gli zeri.

## riporto-non-traboccamento
Vero o falso: ogni volta che c'è un riporto c'è un traboccamento.
---
Falso. I riporti tra le colonne sono normali; il traboccamento c'è solo se il riporto esce dall'ultima colonna.

## moltiplicare-per-bit
Quanto fa un numero binario moltiplicato per il bit $1$? E per il bit $0$?
---
Il numero stesso; zero.

## moltiplicare-per-due
Che cosa succede a un numero binario moltiplicato per $10_2$?
---
Le cifre scorrono di un posto a sinistra e a destra entra uno $0$: il numero raddoppia.

## scorrimento-esempio
Calcola $101_2 \cdot 100_2$.
---
$1\,0100_2$: $100_2$ è $2^2$, quindi si aggiungono due zeri. In base dieci $5 \cdot 4 = 20$.

## moltiplicazione-regola
Come si moltiplicano due numeri binari in colonna?
---
Per ogni bit $1$ del moltiplicatore si scrive una copia del moltiplicando spostata a sinistra quanto la posizione del bit, e poi si sommano le copie.

## moltiplicazione-esempio
Calcola $11_2 \cdot 11_2$.
---
$1001_2$: $11_2 + 110_2$. In base dieci $3 \cdot 3 = 9$.

## bit-del-prodotto
Quanti bit può avere al massimo il prodotto di due numeri di $4$ bit?
---
$8$: il prodotto di un numero di $n$ bit per uno di $m$ bit ha al massimo $n + m$ bit.
