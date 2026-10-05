# Flashcard: Il ciclo for

## contatore
Che cos'è il contatore di un ciclo?
---
La variabile che parte da un valore, cambia della stessa quantità a ogni giro e fa finire il ciclo quando supera il valore di arrivo.

## tre-parti
Quali tre cose del contatore scrive in una riga sola il ciclo `for`?
---
La partenza, l'arrivo e il passo.

## quando-for
Quando si usa il `for` e quando il `while`?
---
Il `for` quando il numero dei giri è noto nel momento in cui il ciclo comincia; il `while` quando dipende da quello che succede nel corpo.

## range-uno-sei
Quali valori prende `i` con `range(1, 6)`?
---
$1, 2, 3, 4, 5$: l'arrivo è escluso.

## range-n
Quali valori prende `i` con `range(4)`, e quanti giri sono?
---
$0, 1, 2, 3$: quattro giri.

## range-passo
Quali valori prende `i` con `range(0, 11, 2)`?
---
$0, 2, 4, 6, 8, 10$: il terzo numero è il passo.

## range-indietro
Come si scrive in Python il `range` che dà $5, 4, 3, 2, 1$?
---
`range(5, 0, -1)`: partenza $5$, arrivo $0$ escluso, passo $-1$.

## cpp-tre-parti
In `for (int i = 1; i <= 5; i++)` che cosa sono le tre parti tra le parentesi?
---
`int i = 1` è la partenza, `i <= 5` la condizione per fare un altro giro, `i++` il passo.

## i-piu-piu
Che cosa vogliono dire `i++`, `i--` e `i += 2`?
---
`i = i + 1`, `i = i - 1` e `i = i + 2`.

## giri-cpp
Quanti giri fa `for (int i = 0; i < 5; i++)`?
---
Cinque: `i` vale $0, 1, 2, 3, 4$.

## da-uno-a-n
Come si scrive il `for` che fa prendere al contatore i valori da $1$ a $n$ compreso, nei due linguaggi?
---
`for i in range(1, n + 1):` in Python, `for (int i = 1; i <= n; i++)` in C++.

## giro-in-meno
Per sommare i numeri da $1$ a $4$ scrivi `range(1, 4)`. Che somma ottieni?
---
$6$ al posto di $10$: `range(1, 4)` si ferma a $3$ e manca l'ultimo giro.

## quando-passo
In un ciclo `for`, quando viene eseguito il passo?
---
Dopo l'ultima istruzione del corpo e prima del nuovo controllo della condizione.

## somma-traccia
`s` parte da $0$ e per `i` da $1$ a $4$ il ciclo esegue `s = s + i`. Quali valori prende `s`?
---
$1$, $3$, $6$, $10$.

## zero-giri
Il ciclo va da $1$ a $n$ e $n$ vale $0$. Quanti giri fa?
---
Nessuno: la partenza supera già l'arrivo.

## punto-e-virgola
Che cosa succede in C++ se scrivi un punto e virgola subito dopo `for (int i = 1; i <= 5; i++)`?
---
Il ciclo finisce a quel punto e virgola e gira a vuoto; il blocco tra le graffe resta fuori dal ciclo, dove `i` non esiste più, e il compilatore segnala un errore.

## indietro-condizione
In C++ un ciclo conta all'indietro da $5$ a $1$. Qual è la condizione per fare un altro giro?
---
`i > 0`: quando il contatore scende, il verso della condizione si rovescia.

## stesso-diagramma
Vero o falso: un ciclo `for` e il `while` che fa lo stesso lavoro hanno diagrammi di flusso diversi.
---
Falso. Il computer fa gli stessi passi nello stesso ordine: cambia solo il modo di scriverli.
