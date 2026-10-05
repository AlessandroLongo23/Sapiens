# Flashcard: Massimo, minimo e media di una sequenza

## sequenza
Che cos'è una sequenza di dati?
---
Una fila di dati dello stesso tipo che arrivano uno dopo l'altro.

## idea-massimo
Che cosa contiene la variabile `massimo` mentre il ciclo sta girando?
---
Il valore più grande tra quelli letti fino a quel momento.

## partenza-massimo
Da quale valore parte `massimo`?
---
Dal primo dato della sequenza, letto prima del ciclo.

## confronto-massimo
Quale confronto decide se il dato `gradi` appena letto diventa il nuovo massimo?
---
`gradi > massimo`: se è vero, `massimo` prende il valore di `gradi`.

## massimo-traccia
Le temperature sono $-3$, $-7$, $-1$, $-5$. Quali valori prende `massimo`?
---
$-3$ con il primo dato, poi $-1$ quando arriva il terzo.

## massimo-da-zero
`massimo` parte da $0$ e le temperature sono $-3$, $-7$, $-1$. Che cosa scrive il programma?
---
$0$, un valore che non è nella sequenza: nessun dato lo supera.

## minimo-da-zero
`minimo` parte da $0$ e i dati sono i voti $6$, $8$, $5$. Che cosa scrive il programma?
---
$0$: nessun voto è più piccolo di zero.

## minimo-confronto
Che cosa cambia nel programma del massimo per trovare il minimo?
---
Il verso del confronto: il dato nuovo prende il posto di `minimo` quando è più piccolo.

## giri-lunghezza-nota
I dati sono $n$ e il primo viene letto prima del ciclo. Quanti giri fa il ciclo che cerca il massimo?
---
$n - 1$: comincia dal secondo dato.

## valore-di-fine
Che cos'è un valore di fine?
---
Un valore che non può essere un dato e che, quando arriva, chiude la sequenza.

## fine-temperature
Perché lo $0$ va bene come valore di fine per i voti ma non per le temperature?
---
Perché nessuno prende $0$ come voto, mentre $0$ gradi è una temperatura vera.

## lettura-in-fondo
Con il valore di fine, perché la lettura sta in fondo al corpo del ciclo?
---
Così il valore appena letto passa dal controllo della condizione prima di essere usato: il valore di fine ferma il ciclo e non entra nei conti.

## media-variabili
Quali due variabili servono per calcolare la media di una sequenza chiusa da un valore di fine?
---
Un accumulatore per la somma e un contatore per il numero dei dati.

## media-conto
I voti letti sono $6$, $6$ e $9$. Quanto valgono la somma, il contatore e la media?
---
$21$, $3$ e $7$.

## media-dove
Dove si scrive la divisione che calcola la media?
---
Dopo il ciclo, una volta sola, quando la somma e il conto sono completi.

## divisione-interi
In C++ `somma` e `quanti` sono due `int` e valgono $15$ e $2$. Quanto fa `somma / quanti`? E in Python?
---
In C++ fa `7`, perché la divisione tra interi butta via i decimali; in Python fa `7.5`.

## somma-double
Come si ottiene in C++ una media con i decimali?
---
Dichiarando la somma `double`: la divisione tra un `double` e un `int` tiene i decimali.

## nessun-dato
Che cosa succede alla media se la sequenza è vuota e il programma divide lo stesso?
---
Divide per zero: Python si ferma con l'errore `ZeroDivisionError`, il C++ scrive `nan` o si ferma con un errore. Prima di dividere si controlla che il contatore sia maggiore di $0$.
