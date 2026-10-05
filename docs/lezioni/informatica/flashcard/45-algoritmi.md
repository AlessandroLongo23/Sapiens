# Flashcard: Il concetto di algoritmo

## algoritmo-definizione
Che cos'è un algoritmo?
---
Un elenco finito di passi precisi che, eseguiti nell'ordine, risolvono un problema.

## esecutore
Chi è l'esecutore di un algoritmo?
---
Chi esegue i passi: una persona oppure una macchina. Deve saper fare ogni passo, non capire perché l'algoritmo funziona.

## dati-ingresso-uscita
Nell'algoritmo che calcola la media di due voti, quali sono i dati di ingresso e quali i dati di uscita?
---
I due voti sono i dati di ingresso, la media è il dato di uscita.

## proprieta-elenco
Quali sono le cinque proprietà di un algoritmo?
---
Finito, non ambiguo, eseguibile, deterministico, generale.

## proprieta-finito
"Conta a voce alta senza fermarti mai". Quale proprietà manca?
---
Non è finito: l'esecuzione non termina.

## proprieta-non-ambiguo
"Aggiungi un po' di sale". Quale proprietà manca a questo passo?
---
È ambiguo: due esecutori lo capiscono in modi diversi.

## proprieta-deterministico
Che cosa vuol dire che un algoritmo è deterministico?
---
Che con gli stessi dati di ingresso dà sempre gli stessi risultati.

## proprieta-generale
"La media di 7 e 8 è 7,5" è un algoritmo?
---
No. È un risultato: non dice che cosa fare con altri due numeri, quindi non è generale.

## ricetta-algoritmo
Vero o falso: ogni ricetta di cucina è un algoritmo.
---
Falso. Passi come "sale quanto basta" sono ambigui.

## media-esecuzione
Leggi $a$, leggi $b$, calcola $(a + b) : 2$, scrivi il risultato. Che cosa scrive con 6 e 9?
---
7,5.

## ordine-dei-passi
Leggi $n$; metti $n \cdot 8$ in $t$; scrivi $t$; aggiungi 2 a $t$. Con $n = 3$ che cosa scrive, 24 o 26?
---
24. Il passo che scrive viene prima di quello che aggiunge 2.

## euclide-un-giro
Nell'algoritmo di Euclide con le sottrazioni, $a = 30$ e $b = 18$. Quanto valgono dopo un giro?
---
$a = 12$ e $b = 18$: si toglie il minore dal maggiore.

## euclide-fine
Nell'algoritmo di Euclide con le sottrazioni, quando finisce la ripetizione?
---
Quando $a$ e $b$ sono uguali: quel valore è il MCD.

## euclide-risultato
Che cosa scrive l'algoritmo di Euclide con 48 e 18?
---
6, il massimo comune divisore.

## euclide-zero
Perché l'algoritmo di Euclide con le sottrazioni non va bene con $a = 5$ e $b = 0$?
---
Perché toglie zero da 5 per sempre e non termina: vale solo per interi positivi.

## addizioni-ripetute
$p$ parte da 0. Finché $b > 0$: aggiungi $a$ a $p$ e togli 1 a $b$. Alla fine scrivi $p$. Che cosa scrive con $a = 4$ e $b = 3$?
---
12: somma 4 per tre volte, cioè calcola $4 \cdot 3$.

## programma-definizione
Che cos'è un programma?
---
Un algoritmo scritto in un linguaggio di programmazione, che il computer sa eseguire.

## algoritmo-o-programma
Vero o falso: lo stesso algoritmo si può scrivere in linguaggi di programmazione diversi.
---
Vero. L'algoritmo è l'idea, e ogni programma è una delle sue scritture.
