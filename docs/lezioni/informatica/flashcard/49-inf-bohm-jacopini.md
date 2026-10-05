# Flashcard: Sequenza, selezione, iterazione e teorema di Böhm-Jacopini

## struttura-di-controllo
Che cos'è una struttura di controllo?
---
Un modo di stabilire in che ordine vengono eseguite le istruzioni di un algoritmo.

## tre-strutture
Quali sono le tre strutture di controllo?
---
Sequenza, selezione e iterazione.

## sequenza-definizione
Che cosa fa la sequenza?
---
Esegue le istruzioni una dopo l'altra, tutte, una volta.

## iterazione-altri-nomi
Con quali altri due nomi si indica l'iterazione?
---
Ripetizione e ciclo.

## selezione-o-iterazione
Selezione e iterazione cominciano tutte e due con una condizione. Che cosa le distingue?
---
Dove si va dopo: nella selezione si prosegue in avanti, nell'iterazione si torna alla condizione.

## se-o-finche
Devi chiedere un numero di nuovo ogni volta che è negativo. Serve `se` oppure `finché`?
---
`finché`: la richiesta deve potersi ripetere più volte, e un `se` la esegue al massimo una volta.

## un-ingresso-una-uscita
Quale proprietà hanno in comune le tre strutture?
---
In ognuna si entra da un punto solo e si esce da un punto solo, quindi vista da fuori si comporta come una sola istruzione.

## annidamento-definizione
Che cos'è l'annidamento?
---
Mettere una struttura dentro un'altra: per esempio una selezione dentro il giro di un'iterazione.

## annidamento-rientro
Nello pseudocodice, da che cosa si vede che una selezione è annidata in un'iterazione?
---
Dal rientro: il `se` è rientrato sotto il `finché`, e le sue istruzioni sono rientrate ancora di più.

## voti-sufficienti
Per ogni voto letto: `se voto ≥ 6`, aggiungi 1 a `sufficienti`. Con i voti 7, 5, 8 quanto vale `sufficienti` alla fine?
---
2: il 5 non passa la condizione.

## multipli-di-tre
Per $i$ da 1 a 7: se `i mod 3 = 0` scrivi "bum", altrimenti scrivi $i$. Che cosa esce?
---
1, 2, bum, 4, 5, bum, 7.

## controlli-iterazione
Un'iterazione fa 7 giri. Quante volte viene controllata la sua condizione?
---
Otto: sette volte è vera e l'ottava è falsa.

## salto-definizione
Che cos'è un salto?
---
Un'istruzione del tipo "vai al passo 5", che porta l'esecuzione in un altro punto dell'algoritmo.

## teorema-enunciato
Che cosa dice il teorema di Böhm-Jacopini?
---
Che qualunque algoritmo descritto da un diagramma di flusso si può riscrivere come un algoritmo equivalente che usa solo sequenza, selezione e iterazione.

## equivalente
Quando due algoritmi sono equivalenti?
---
Quando, con gli stessi dati di ingresso, danno gli stessi risultati.

## teorema-piu-corta
Vero o falso: per il teorema, l'algoritmo riscritto senza salti è sempre più corto dell'originale.
---
Falso. Il teorema garantisce che la riscrittura esiste; può servire ripetere un'istruzione o aggiungere una variabile.

## teorema-tre-istruzioni
Vero o falso: il teorema dice che ogni algoritmo si scrive con tre istruzioni.
---
Falso. Parla di tre modi di combinare le istruzioni, non del loro numero.

## teorema-tutte-e-tre
Vero o falso: ogni algoritmo deve usare tutte e tre le strutture.
---
Falso. La media di due voti è una sola sequenza.

## programmazione-strutturata
Che cos'è la programmazione strutturata?
---
Il modo di scrivere algoritmi e programmi usando solo le tre strutture, una dopo l'altra o una dentro l'altra, senza salti.

## salto-condizione-contraria
Un algoritmo con i salti dice "se $n$ è uguale a 0, esci". Qual è la condizione del `finché` che lo sostituisce?
---
`n ≠ 0`: il salto dice quando si esce, `finché` vuole sapere quando si resta nel giro.
