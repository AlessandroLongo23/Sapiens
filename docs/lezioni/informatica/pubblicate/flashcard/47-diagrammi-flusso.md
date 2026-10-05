# Flashcard: I diagrammi di flusso

## diagramma-definizione
Che cos'è un diagramma di flusso?
---
Il disegno di un algoritmo: ogni passo è un blocco, e le frecce dicono in che ordine i passi si eseguono.

## forma-ovale
Che cosa c'è dentro un blocco ovale?
---
La parola "inizio" oppure la parola "fine".

## forma-parallelogramma
Quale forma ha il blocco "leggi $n$"?
---
Il parallelogramma, che è il blocco di ingresso e uscita: lo stesso di "scrivi $n$".

## forma-rettangolo
Che tipo di passo sta in un rettangolo?
---
Un'istruzione, cioè un calcolo con il nome a cui va il risultato, come $a \leftarrow b \cdot h$.

## forma-rombo
Quante frecce escono da un rombo, e che cosa c'è scritto sopra?
---
Due, una con "sì" e una con "no".

## freccia-assegnamento
Come si legge $a \leftarrow b \cdot h$?
---
Calcola $b \cdot h$ e metti il risultato in $a$.

## freccia-non-uguale
Che cosa fa $n \leftarrow n - 1$ quando $n$ vale 5?
---
Mette 4 in $n$: prima si calcola $5 - 1$, poi il risultato va in $n$.

## frecce-uscita-fine
Vero o falso: da un ovale di fine può uscire una freccia.
---
Falso. Dall'ovale di fine non esce niente.

## leggere-rombo
Eseguendo un diagramma a mano, che cosa fai quando arrivi a un rombo?
---
Rispondo alla domanda con i valori che ho sul foglio e prendo la freccia della mia risposta.

## sequenza-area
Leggi $b$, leggi $h$, $a \leftarrow b \cdot h$, scrivi $a$. Che cosa scrive con 4 e 3?
---
12.

## selezione-riconoscere
Come si riconosce una selezione in un diagramma?
---
Da un rombo con due rami che poi si riuniscono: a ogni esecuzione se ne percorre uno solo.

## selezione-confine
Leggi $e$; se $e < 14$ scrivi "ridotto", altrimenti scrivi "intero". Che cosa scrive con 14?
---
"intero": $14 < 14$ è falsa, quindi si prende il ramo "no".

## selezione-ramo-vuoto
Leggi $p$; se $p > 50$ allora $p \leftarrow p - 10$; scrivi $p$. Che cosa scrive con 50?
---
50: la risposta a "$50 > 50$?" è no, e il ramo "no" è vuoto.

## ripetizione-riconoscere
Come si riconosce una ripetizione in un diagramma?
---
Da una freccia che torna indietro a un rombo già attraversato.

## conto-rovescia-uscita
Leggi $n$; finché $n > 0$: scrivi $n$, poi $n \leftarrow n - 1$; alla fine scrivi "via!". Che cosa scrive con 3?
---
3, 2, 1, via!

## conto-rovescia-rombo
Nello stesso conto alla rovescia con $n = 3$, quante volte viene attraversato il rombo?
---
Quattro: tre volte con risposta sì e una con risposta no.

## ciclo-zero-giri
Nel conto alla rovescia, che cosa succede con $n = 0$?
---
Il rombo risponde subito no, il giro non si esegue nemmeno una volta e viene scritto solo "via!".

## ciclo-infinito
Che cosa succede al conto alla rovescia se togli il blocco $n \leftarrow n - 1$?
---
Non finisce: $n$ non cambia, la risposta a "$n > 0$?" resta sì e il diagramma scrive sempre lo stesso numero.

## somma-uno-n
$s \leftarrow 0$, $i \leftarrow 1$; finché $i \leq n$: $s \leftarrow s + i$, $i \leftarrow i + 1$; scrivi $s$. Che cosa scrive con $n = 4$?
---
10, la somma dei numeri da 1 a 4.

## rombo-nel-programma
In un programma, in quale parola si traduce un rombo con una freccia che torna indietro?
---
`while`, che vuol dire "finché". Un rombo con due rami che si riuniscono diventa `if` ed `else`.
