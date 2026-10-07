# Flashcard: I vettori

## vettore-definizione
Che cos'è un vettore?
---
Una fila di variabili dello stesso tipo che hanno un solo nome e si distinguono per un numero, l'indice.

## indice-primo
Qual è l'indice del primo elemento di un vettore?
---
$0$: gli indici partono da zero.

## indice-ultimo
Un vettore ha dimensione $8$. Qual è l'indice del suo ultimo elemento?
---
$7$: gli indici vanno da $0$ a $n - 1$.

## dimensione-da-indici
Gli indici di un vettore vanno da $0$ a $11$. Qual è la sua dimensione?
---
$12$.

## leggere-elemento
`voti` contiene $7$, $5$, $8$, $6$, $10$. Quanto vale `voti[2]`?
---
$8$: è il terzo elemento, perché l'indice $0$ è il primo.

## scrivere-elemento
`voti` contiene $7$, $5$, $8$. Che cosa contiene dopo `voti[1] = 6`?
---
$7$, $6$, $8$: cambia solo l'elemento di indice $1$.

## espressione-con-elementi
`v` contiene $4$, $9$, $2$. Quanto vale `v[0] + v[2]`?
---
$6$, cioè $4 + 2$.

## nomi-nei-linguaggi
Come si chiama un vettore in C++? E in Python?
---
Array in C++, lista in Python.

## dimensione-python-cpp
Come si conosce la dimensione del vettore `voti` in Python? E in C++?
---
In Python con `len(voti)`; in C++ è la costante `N` con cui l'array è stato dichiarato.

## indice-fuori
`voti` ha dimensione $5$. Che cosa succede leggendo `voti[5]` in Python? E in C++?
---
Python si ferma con `IndexError`; il C++ legge un valore qualunque dalla memoria, senza avvisare.

## indice-negativo-python
In Python `voti` contiene $7$, $5$, $8$. Quanto vale `voti[-1]`?
---
$8$: in Python l'indice $-1$ è l'ultimo elemento, e non dà errore.

## ciclo-condizione
Qual è la condizione del ciclo `for` che scorre un vettore di dimensione `N` partendo da `i = 0`?
---
`i < N`. Con `i <= N` l'ultimo giro chiede `voti[N]`, che non esiste.

## ciclo-da-uno
Un ciclo scorre il vettore con `i` che parte da $1$ e somma gli elementi. Che cosa sbaglia?
---
Salta il primo elemento, quello di indice $0$, e nessun errore lo segnala.

## somma-traccia
`v` contiene $3$, $1$, $4$ e `s` parte da $0$. Il ciclo fa `s = s + v[i]` per ogni indice: quali valori prende `s`?
---
$3$, $4$, $8$.

## massimo-partenza
Per cercare il massimo di un vettore, da quale valore parte `massimo` e da quale indice parte il ciclo?
---
`massimo` parte da `v[0]` e il ciclo dall'indice $1$.

## append
In Python `voti = []`. Come si aggiunge il voto $7$ alla lista?
---
Con `voti.append(7)`. `voti[0] = 7` darebbe errore, perché l'elemento di indice $0$ non c'è ancora.

## array-non-assegnato
In C++, che cosa contiene un elemento di `int voti[5];` prima che gli venga assegnato un valore?
---
Un valore qualunque, quello che si trovava in memoria.

## parametro-cpp
Perché in C++ una funzione che riceve un vettore ha anche il parametro `int n`?
---
Perché dal parametro `int v[]` la funzione non può sapere quanti elementi ha il vettore: la dimensione le va passata.

## funzione-modifica
Una funzione riceve il vettore `voti` e fa `v[0] = 10`. Dopo la chiamata, quanto vale `voti[0]` nel programma che l'ha chiamata?
---
$10$: la funzione lavora sul vettore di chi la chiama, non su una copia.
