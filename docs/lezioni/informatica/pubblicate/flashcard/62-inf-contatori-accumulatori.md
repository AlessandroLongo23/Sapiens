# Flashcard: Contatori e accumulatori

## contatore
Che cos'è un contatore?
---
Una variabile che parte da $0$ e aumenta di $1$ ogni volta che succede una certa cosa.

## accumulatore
Che cos'è un accumulatore?
---
Una variabile a cui ogni giro aggiunge un valore nuovo, e che alla fine contiene il totale.

## differenza
Qual è la differenza tra un contatore e un accumulatore di una somma?
---
Il contatore aumenta sempre di $1$; l'accumulatore aumenta del dato di quel giro.

## contare-con-condizione
Dove sta l'aumento di un contatore che deve contare solo i voti sufficienti?
---
Dentro una selezione, nel corpo del ciclo: aumenta solo nei giri in cui il voto è almeno $6$.

## conta-sufficienti
Il contatore dei voti sufficienti riceve $7$, $5$, $8$, $4$. Quanto vale alla fine?
---
$2$: sono sufficienti il $7$ e l'$8$.

## riconosci-contatore
In un ciclo c'è l'istruzione `pari = pari + 1`. Contatore o accumulatore?
---
Contatore: aumenta di $1$ ogni volta.

## riconosci-accumulatore
In un ciclo c'è l'istruzione `totale = totale + punti`. Contatore o accumulatore?
---
Accumulatore: aumenta del dato letto in quel giro.

## totale-traccia
`totale` parte da $0$ e riceve $120$, $80$, $200$. Quali valori prende?
---
$120$, $200$, $400$.

## forma-breve
Che cosa vuol dire `totale += punti`?
---
`totale = totale + punti`, in Python e in C++.

## inizializzare
Che cosa vuol dire inizializzare una variabile?
---
Darle il primo valore.

## partenza-somma-prodotto
Da quale valore parte l'accumulatore di una somma? E quello di un prodotto?
---
Da $0$ la somma, da $1$ il prodotto: sono i valori che non cambiano il risultato.

## prodotto-da-zero
Il programma del fattoriale parte con `fattoriale = 0`. Che cosa scrive con $5$?
---
$0$: zero moltiplicato per qualunque numero fa zero, a ogni giro.

## fattoriale
Quanto vale $4!$?
---
$24$, cioè $1 \cdot 2 \cdot 3 \cdot 4$.

## fattoriale-zero
Il programma del fattoriale, con `fattoriale = 1` prima del ciclo, riceve $0$. Che cosa scrive?
---
$1$: il ciclo non fa nessun giro e resta il valore di partenza, che è proprio $0!$.

## azzerato-nel-ciclo
Che cosa succede se `sufficienti = 0` sta dentro il corpo del ciclo?
---
Il conto ricomincia a ogni giro: alla fine vale $0$ oppure $1$, secondo l'ultimo voto.

## dove-partenza
Dove si scrivono il valore di partenza, l'aggiornamento e la stampa di un contatore?
---
Il valore di partenza prima del ciclo, l'aggiornamento dentro il corpo, la stampa dopo il ciclo.

## int-troppo-grande
In C++, che cosa succede quando un conto tra `int` supera $2\,147\,483\,647$?
---
Il programma scrive un numero sbagliato senza avvisare: un `int` occupa $32$ bit e non contiene numeri più grandi.

## tredici-fattoriale
Vero o falso: il programma del fattoriale con $13$ dà lo stesso risultato in Python e in C++ con `int`.
---
Falso. Python scrive $6227020800$; in C++ il numero non sta in un `int` ed esce un valore sbagliato.
