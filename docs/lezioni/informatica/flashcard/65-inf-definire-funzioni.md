# Flashcard: Definire e chiamare una funzione

## funzione-definizione
Che cos'è una funzione in un programma?
---
Un pezzo di programma con un nome, scritto una volta sola ed eseguito ogni volta che viene chiamato.

## definire-chiamare
Che differenza c'è tra definire una funzione e chiamarla?
---
Definirla è scriverla, con il nome e il corpo; chiamarla è farla eseguire, scrivendo il nome seguito dalle parentesi.

## corpo
Che cos'è il corpo di una funzione?
---
L'insieme delle istruzioni che la compongono: in Python le righe rientrate sotto `def`, in C++ quelle tra le graffe.

## riconosci-chiamata
Quale di queste due righe Python è una chiamata: `def saluta():` oppure `saluta()`?
---
`saluta()`. La riga con `def` è l'inizio della definizione.

## void
Che cosa dice la parola `void` in `void linea() {`?
---
Che la funzione `linea` non restituisce niente.

## main
In un programma C++, che cos'è `main`?
---
La funzione da cui comincia l'esecuzione. Le altre funzioni si definiscono fuori da `main`, prima.

## mai-chiamata
Un programma definisce la funzione `linea`, che scrive dei trattini, e non la chiama mai. Quanti trattini scrive?
---
Nessuno, e senza errori: la definizione non esegue il corpo.

## due-chiamate
Il corpo di `saluta` scrive `Ciao`. Il programma chiama `saluta()` tre volte. Quante volte compare `Ciao`?
---
Tre: il corpo è scritto una volta ma viene eseguito a ogni chiamata.

## dove-torna
Quando il corpo di una funzione è finito, da dove riprende il programma?
---
Dall'istruzione che segue la chiamata da cui era partito.

## ordine-uscita
Il corpo di `linea` scrive `---`. Il programma scrive `A`, chiama `linea()`, scrive `B`. Che cosa compare sullo schermo?
---
`A`, poi `---`, poi `B`.

## chiamata-nel-ciclo
La chiamata `linea()` è nel corpo di un ciclo che fa $5$ giri, e ce n'è un'altra prima del ciclo. Quante volte viene eseguita `linea`?
---
Sei volte: una prima del ciclo e una per ogni giro.

## senza-parentesi
In Python, che cosa fa la riga `linea` scritta senza parentesi?
---
Niente: il nome da solo indica la funzione, ma non la chiama.

## prima-della-definizione
In Python una chiamata di `linea` è scritta sopra la sua definizione. Che cosa succede?
---
Il programma si ferma alla chiamata con `NameError`: il nome `linea` non è ancora definito.

## prototipo
In un programma C++ c'è la riga `void linea();` sopra `main`. Che cos'è?
---
Un prototipo: avvisa che la funzione esiste e che sarà definita più avanti.

## funzioni-pronte
Vero o falso: prima di questa lezione non avevi mai chiamato una funzione.
---
Falso. `print`, `input` e `pow` sono funzioni, definite da altri, che chiamavi già.

## parametro
Nella definizione `def linea(n):`, che cos'è `n`?
---
Un parametro: una variabile che riceve il suo valore al momento della chiamata.

## parametro-valore
Con la definizione `def linea(n):`, quanto vale `n` durante la chiamata `linea(8)`?
---
$8$.
