# Passaggio dei parametri per valore e per riferimento

Per mettere in ordine due numeri, o due squadre in una classifica, serve un'operazione piccola: scambiare il contenuto di due variabili. Sembra il lavoro adatto a una funzione, `scambia(a, b)`. Scritta nel modo più naturale, però, la funzione viene eseguita senza errori e le due variabili restano com'erano. Il motivo sta nel modo in cui i valori degli argomenti arrivano ai parametri.

## Il parametro lavora su una copia: il passaggio per valore

Per scambiare due variabili ne serve una terza, d'appoggio: `temp` conserva il valore della prima mentre la seconda lo sovrascrive. La funzione `scambia` fa questo con i suoi parametri `x` e `y`, e il programma principale la chiama con le sue variabili `a` e `b`.

```codice python
def scambia(x, y):
    temp = x
    x = y
    y = temp

a = 3
b = 8
scambia(a, b)
print(a, b)
```

```codice cpp
#include <iostream>
using namespace std;

void scambia(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3;
    int b = 8;
    scambia(a, b);
    cout << a << " " << b << endl;
    return 0;
}
```

Esegui: il programma scrive `3 8` in tutti e due i linguaggi. La lezione [Variabili locali e globali](/materiale/scuola-superiore/informatica/le-funzioni/variabili-locali-e-globali) ha già la spiegazione: i parametri sono variabili locali della funzione. Alla chiamata `x` e `y` partono con i valori di `a` e `b`, ma da quel momento sono altre variabili, e un assegnamento a `x` cambia `x` e nient'altro: i parametri ricevono i valori degli argomenti, come diceva la lezione sui [parametri](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno). Questo modo di consegnare gli argomenti si chiama **passaggio per valore**: alla funzione arriva il valore, non la variabile di chi chiama.

Se dentro `scambia` lo scambio avviene davvero, dove finisce? Nella figura lascia scelto «Tentativo» e vai avanti un passo alla volta, tenendo d'occhio il riquadro di `scambia` e quello del programma principale.

```interattivo
% nome: inf-passaggio-parametri-pila
% alt: Tre programmi eseguiti una riga alla volta accanto alla pila delle chiamate, in Python o in C++. Nel primo, il tentativo, scambia riceve due numeri per valore: nel suo riquadro x e y si scambiano, nel programma principale a e b restano 3 e 8, e al ritorno il riquadro sparisce. Nel secondo, lo scambio riuscito, in C++ x e y sono riferimenti, disegnati tratteggiati come altri nomi di a e b, e ogni assegnamento cambia anche a e b; in Python la funzione restituisce i due valori in ordine inverso e il programma principale li assegna ad a e b. Nel terzo programma la funzione recupera riceve un vettore: il parametro voti è un altro nome del vettore pagella, e cambiando il primo elemento da 5 a 6 cambia anche pagella
```

Lo scambio avviene nel riquadro di `scambia`: all'ultimo passo prima del ritorno `x` vale $8$ e `y` vale $3$. Poi la funzione finisce, il riquadro sparisce con `x`, `y` e `temp`, e nel programma principale `a` e `b` non sono mai state toccate.

Il passaggio per valore è una protezione. Una funzione che riceve un valore lo può usare e trasformare come vuole, e chi la chiama è sicuro che le sue variabili restino intatte: per questo è il modo normale di passare i parametri, quello che hai usato finora.

## Lo scambio che funziona

Perché la funzione agisca sulle variabili di chi la chiama, i due linguaggi offrono strade diverse. Il C++ ha un secondo modo di passare un parametro; Python non lo ha, e ottiene lo stesso risultato con il valore di ritorno.

```codice python
def scambia(x, y):
    return y, x

a = 3
b = 8
a, b = scambia(a, b)
print(a, b)
```

```codice cpp
#include <iostream>
using namespace std;

void scambia(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3;
    int b = 8;
    scambia(a, b);
    cout << a << " " << b << endl;
    return 0;
}
```

Ora il programma scrive `8 3`. Nella figura scegli «Scambio» e guarda che cosa c'è nel riquadro di `scambia` nel linguaggio che stai usando.

In C++ il programma è quello di prima con due caratteri in più: la `&` davanti al nome di ogni parametro. Un parametro dichiarato con `&` è un **riferimento**: non è una variabile nuova, è un altro nome per la variabile passata come argomento. Durante la chiamata `x` è `a` e `y` è `b`, quindi ogni assegnamento a `x` scrive in `a`. Questo è il **passaggio per riferimento**: alla funzione arriva la variabile, non una copia del suo valore.

In Python la funzione non tocca `a` e `b`. Restituisce due valori, scritti dopo `return` con una virgola in mezzo, e il programma principale li raccoglie con un assegnamento che ha due nomi a sinistra: il primo valore va in `a`, il secondo in `b`. Lo scambio lo fa chi chiama, alla luce del sole, nella riga `a, b = scambia(a, b)`.

```ad-warning
La & dimenticata
In C++ una funzione che deve modificare i suoi argomenti e ha i parametri senza `&` compila, viene eseguita e non modifica niente: è il primo programma di questa lezione. Nessun messaggio lo segnala. Quando una variabile non cambia dopo una chiamata che doveva cambiarla, guarda per prima cosa l'intestazione della funzione.
```

```ad-warning
A un riferimento serve una variabile
L'argomento di un parametro per riferimento deve essere una variabile, perché il parametro diventa un altro suo nome. La chiamata `scambia(3, 8)` non compila, e nemmeno `scambia(a, b + 1)`: un numero o il risultato di un'espressione non sono posti in cui si possa scrivere.
```

Il passaggio per riferimento serve anche quando una funzione ha più di un risultato da consegnare, dato che `return` in C++ ne restituisce uno solo: i risultati vanno in variabili di chi chiama, passate per riferimento. Lo userai nel secondo esercizio in fondo.

## In Python conta se il valore si può modificare

Python non fa scegliere tra valore e riferimento, perché tratta le variabili in un altro modo. Una variabile è un nome attaccato a un valore, e alla chiamata il nome del parametro viene attaccato allo stesso valore dell'argomento, senza copiarlo. Un assegnamento al parametro, come `x = y`, stacca il nome e lo attacca a un altro valore: l'argomento resta dov'era. Ecco perché il primo `scambia` non funziona nemmeno in Python.

La differenza si vede con i valori che si possono modificare senza sostituirli. Un numero o un testo non si modificano: `n = n + 1` attacca `n` a un numero nuovo. Una lista invece, cioè una fila di valori tra parentesi quadre, si può cambiare un elemento alla volta, e resta la stessa lista. Se una funzione riceve una lista e ne cambia un elemento, chi l'ha chiamata vede il cambiamento, perché parametro e argomento sono due nomi della stessa lista.

Nel programma qui sotto `pagella` contiene tre voti. Il primo, quello con indice $0$, è un $5$; dopo l'esame di recupero la funzione `recupera` lo porta a $6$.

```codice python
def recupera(voti):
    voti[0] = 6

pagella = [5, 7, 8]
recupera(pagella)
print(pagella[0])
```

```codice cpp
#include <iostream>
using namespace std;

void recupera(int voti[]) {
    voti[0] = 6;
}

int main() {
    int pagella[3] = {5, 7, 8};
    recupera(pagella);
    cout << pagella[0] << endl;
    return 0;
}
```

Il programma scrive $6$: la funzione ha modificato la variabile di chi l'ha chiamata, senza `return` e, in C++, senza `&`. Nella figura scegli «Vettore» per vedere i due nomi dello stesso vettore.

```ad-note
I vettori in C++ fanno eccezione
In C++ un vettore passato a una funzione non viene copiato, anche se il parametro non ha la `&`: la funzione lavora sul vettore di chi la chiama, come succede in Python con una lista. Vettori e liste hanno la loro lezione, [I vettori](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori), che riprende questo punto.
```

```ad-warning
Assegnare il parametro non modifica la lista
In Python `voti[0] = 6` modifica la lista ricevuta; `voti = [6, 7, 8]` no: è un assegnamento al parametro, che stacca il nome `voti` dalla lista di chi chiama e lo attacca a una lista nuova. Prova a sostituire la riga dentro `recupera`: il programma scrive $5$.
```

## Quale strada scegliere

La domanda da farsi è che cosa deve restare a chi chiama quando la funzione ha finito.

| Che cosa vuoi dalla funzione | In C++ | In Python |
|---|---|---|
| Usa un valore e lascia intatta la tua variabile | parametro per valore | un numero o un testo come argomento |
| Calcola un risultato | `return` | `return` |
| Cambia una tua variabile | parametro per riferimento, con `&` | restituisce il valore nuovo, e tu lo riassegni |
| Consegna due risultati | due parametri per riferimento | `return` con due valori |
| Modifica gli elementi di un vettore | il vettore come argomento | la lista come argomento |

Quando le due strade sono entrambe possibili, quella con `return` è preferibile: la riga della chiamata mostra che cosa cambia, `a = raddoppia(a)`, mentre con un riferimento la chiamata `raddoppia(a)` non lo dice.

## Prova tu

Il programma legge due numeri interi `a` e `b`, uno per riga, e li deve scrivere in ordine crescente. Scrivi la funzione `ordina`, che scambia i due valori solo quando il primo è maggiore del secondo. Il programma principale c'è già e non va cambiato: in C++ la funzione riceve i parametri per riferimento, in Python restituisce i due valori nell'ordine giusto.

```codice python
# scrivi qui la funzione ordina

a = int(input())
b = int(input())
a, b = ordina(a, b)
print(a, b)
%% soluzione
def ordina(x, y):
    if x > y:
        return y, x
    return x, y

a = int(input())
b = int(input())
a, b = ordina(a, b)
print(a, b)
%% prova
8
3
%% stampa
3 8
%% prova
2
9
%% stampa
2 9
%% prova
5
5
%% stampa
5 5
%% prova
-1
-4
%% stampa
-4 -1
```

```codice cpp
#include <iostream>
using namespace std;

// scrivi qui la funzione ordina

int main() {
    int a, b;
    cin >> a;
    cin >> b;
    ordina(a, b);
    cout << a << " " << b << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

void ordina(int &x, int &y) {
    if (x > y) {
        int temp = x;
        x = y;
        y = temp;
    }
}

int main() {
    int a, b;
    cin >> a;
    cin >> b;
    ordina(a, b);
    cout << a << " " << b << endl;
    return 0;
}
```

Nel secondo esercizio la funzione ha due risultati. Il programma legge la durata di un film in minuti e la deve scrivere in ore e minuti: con $135$ scrive `2 15`. Scrivi la funzione `converti`, che ricava le ore con il quoziente della divisione per $60$ e i minuti rimasti con il resto. In C++ i due risultati finiscono in `ore` e `minuti`, passate per riferimento; in Python la funzione li restituisce tutti e due.

```codice python
# scrivi qui la funzione converti

durata = int(input())
ore, minuti = converti(durata)
print(ore, minuti)
%% soluzione
def converti(durata):
    return durata // 60, durata % 60

durata = int(input())
ore, minuti = converti(durata)
print(ore, minuti)
%% prova
135
%% stampa
2 15
%% prova
59
%% stampa
0 59
%% prova
120
%% stampa
2 0
%% prova
200
%% stampa
3 20
```

```codice cpp
#include <iostream>
using namespace std;

// scrivi qui la funzione converti

int main() {
    int durata, ore, minuti;
    cin >> durata;
    converti(durata, ore, minuti);
    cout << ore << " " << minuti << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

void converti(int durata, int &ore, int &minuti) {
    ore = durata / 60;
    minuti = durata % 60;
}

int main() {
    int durata, ore, minuti;
    cin >> durata;
    converti(durata, ore, minuti);
    cout << ore << " " << minuti << endl;
    return 0;
}
```
