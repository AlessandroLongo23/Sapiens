# Flashcard: Passaggio dei parametri per valore e per riferimento

## valore-definizione
Che cosa arriva alla funzione con il passaggio per valore?
---
Il valore dell'argomento, non la variabile di chi chiama: il parametro è una variabile locale che parte con quel valore.

## scambio-per-valore
`scambia(x, y)` scambia i suoi due parametri con una variabile `temp`. Il programma principale ha `a = 3` e `b = 8`, chiama `scambia(a, b)` e scrive `a` e `b`. Che cosa scrive?
---
`3 8`: lo scambio avviene tra `x` e `y`, che spariscono al ritorno.

## temp
Perché per scambiare due variabili ne serve una terza?
---
Perché dopo `x = y` il vecchio valore di `x` sarebbe perso: `temp` lo conserva.

## valore-protezione
Perché il passaggio per valore è il modo normale di passare i parametri?
---
Perché protegge chi chiama: la funzione può trasformare il valore ricevuto senza toccare le variabili di chi l'ha chiamata.

## riferimento-definizione
In C++, che cos'è un parametro dichiarato con `&`?
---
Un riferimento: un altro nome della variabile passata come argomento, non una variabile nuova.

## riferimento-effetto
In C++ `void azzera(int &n)` fa `n = 0;`. Il programma principale ha `int a = 5;` e chiama `azzera(a);`. Quanto vale `a` dopo?
---
$0$: `n` è un altro nome di `a`, quindi l'assegnamento scrive in `a`.

## e-commerciale-dimenticata
In C++ una funzione deve raddoppiare la variabile di chi chiama, ma il parametro è `int n` senza `&`. Che cosa succede?
---
Il programma compila e viene eseguito, ma la variabile di chi chiama non cambia. Nessun messaggio lo segnala.

## riferimento-argomento
In C++ `scambia` ha i parametri per riferimento. Perché `scambia(3, 8)` non compila?
---
Perché l'argomento di un riferimento deve essere una variabile: un numero non è un posto in cui scrivere.

## due-valori-python
In Python `scambia(x, y)` contiene solo `return y, x`. Come si scrive la chiamata che scambia `a` e `b`?
---
`a, b = scambia(a, b)`: il primo valore restituito va in `a`, il secondo in `b`.

## chi-scambia-python
Nel programma Python con `a, b = scambia(a, b)`, chi modifica `a` e `b`: la funzione o il programma principale?
---
Il programma principale, con l'assegnamento. La funzione restituisce soltanto i due valori.

## piu-risultati
Una funzione deve consegnare due risultati. Come si fa in C++ e come in Python?
---
In C++ con due parametri per riferimento; in Python con `return` seguito da due valori.

## python-nomi
In Python, che cosa succede al parametro quando una funzione viene chiamata?
---
Il nome del parametro viene attaccato allo stesso valore dell'argomento, senza copiarlo.

## python-assegnamento
In Python, dentro una funzione, `x = y` cambia l'argomento con cui è stata chiamata?
---
No: stacca il nome `x` e lo attacca a un altro valore. L'argomento resta dov'era.

## lista-modificata
In Python `recupera(voti)` fa `voti[0] = 6`. Il programma ha `pagella = [5, 7, 8]`, chiama `recupera(pagella)` e scrive `pagella[0]`. Che cosa scrive?
---
$6$: `voti` e `pagella` sono due nomi della stessa lista.

## lista-riassegnata
In Python `recupera(voti)` fa `voti = [6, 7, 8]`. Il programma ha `pagella = [5, 7, 8]`, chiama `recupera(pagella)` e scrive `pagella[0]`. Che cosa scrive?
---
$5$: l'assegnamento attacca il nome `voti` a una lista nuova, e quella di chi chiama non cambia.

## vettore-cpp
In C++ una funzione riceve un vettore con il parametro `int voti[]`, senza `&`, e fa `voti[0] = 6;`. Il vettore di chi chiama cambia?
---
Sì: un vettore passato a una funzione non viene copiato, anche senza la `&`.

## quale-strada
Vuoi che una funzione calcoli un risultato senza toccare le tue variabili. Come lo ricevi?
---
Con `return`, in tutti e due i linguaggi, mettendo il valore restituito in una tua variabile.

## return-preferibile
Perché, quando si può scegliere, `a = raddoppia(a)` è preferibile a una funzione con un parametro per riferimento chiamata con `raddoppia(a)`?
---
Perché la riga della chiamata mostra che `a` cambia; con il riferimento non si vede.
