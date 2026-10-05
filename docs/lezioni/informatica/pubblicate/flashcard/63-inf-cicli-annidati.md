# Flashcard: Cicli annidati

## annidati
Quando due cicli si dicono annidati?
---
Quando uno sta nel corpo dell'altro: quello che contiene è il ciclo esterno, quello contenuto il ciclo interno.

## ordine-giri
Che cosa fa il ciclo interno a ogni giro del ciclo esterno?
---
Viene eseguito tutto, dal primo all'ultimo dei suoi giri; solo dopo comincia il giro esterno successivo.

## contatore-veloce
Con `i` contatore esterno e `j` contatore interno, quale dei due cambia più in fretta?
---
`j`: fa tutti i suoi valori per ogni valore di `i`, come i minuti rispetto alle ore.

## due-per-tre
Il ciclo esterno fa $2$ giri, quello interno $3$, e il corpo interno scrive `i` e `j`. Quante righe vengono scritte?
---
$6$, cioè $2 \cdot 3$.

## ordine-stampa
`i` va da $1$ a $2$ e, dentro, `j` va da $1$ a $3$; il corpo interno scrive `i` e `j`. Che cosa viene scritto subito dopo `1 3`?
---
`2 1`: finito il ciclo interno, `i` aumenta e `j` riparte da $1$.

## m-per-n
Il ciclo esterno fa $m$ giri e quello interno $n$ a ogni giro esterno. Quante volte viene eseguito il corpo interno?
---
$m \cdot n$ volte: i giri si moltiplicano.

## tavola-giri
Nel programma della tavola pitagorica, da $1$ a $10$ per righe e colonne, quante volte viene eseguito il corpo interno?
---
$100$ volte, cioè $10 \cdot 10$.

## tavola-casella
Nel programma della tavola pitagorica, che cosa scrive il corpo interno?
---
Il prodotto `i * j` dei due contatori, seguito da uno spazio.

## traccia-colonne
Com'è fatta la tabella di traccia di due cicli annidati?
---
Ha una colonna per ogni contatore e una riga per ogni giro del ciclo interno.

## senza-a-capo
Come si scrive un asterisco senza andare a capo, in Python e in C++?
---
`print("*", end="")` in Python; `cout << "*";` in C++, senza `endl`.

## dove-a-capo
In un disegno di righe e colonne, dove si scrive l'istruzione che va a capo?
---
Dopo il ciclo interno ma dentro quello esterno: si esegue una volta per riga.

## a-capo-interno
Che cosa succede al rettangolo di asterischi se l'a capo finisce dentro il corpo interno?
---
Ogni asterisco va su una riga sua.

## rettangolo
Un rettangolo di asterischi ha $3$ righe e $8$ colonne. Quanti asterischi scrive il programma?
---
$24$, cioè $3 \cdot 8$.

## triangolo-arrivo
Nel triangolo di asterischi, fino a quale valore arriva il contatore interno `j`?
---
Fino al valore di `i`, il contatore esterno: la riga `i` ha `i` asterischi.

## triangolo-conto
Quanti asterischi ha in tutto un triangolo alto $4$?
---
$10$, cioè $1 + 2 + 3 + 4$: quando il ciclo interno dipende da quello esterno i giri si sommano riga per riga.

## j-riparte
Scrivendo due cicli annidati con il `while`, dove va l'istruzione `j = 1`?
---
Dentro il ciclo esterno, prima di quello interno: così `j` riparte a ogni giro esterno.

## stesso-nome
Perché i due contatori di due cicli annidati devono avere nomi diversi?
---
Perché nel corpo interno un nome solo indicherebbe il contatore interno, e quello esterno non si potrebbe più usare.
