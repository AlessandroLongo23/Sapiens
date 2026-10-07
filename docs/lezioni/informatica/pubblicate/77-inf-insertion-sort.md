# L'ordinamento per inserimento

Quando peschi le carte una alla volta e le tieni in mano in ordine, a ogni carta nuova non rimescoli tutto: scorri quelle che hai già, partendo da destra, finché trovi il suo posto, e la infili lì. L'**ordinamento per inserimento** (in inglese insertion sort) ordina un vettore allo stesso modo: prende gli elementi uno alla volta e inserisce ciascuno al posto giusto tra quelli che lo precedono, che sono già in ordine tra loro. A differenza dell'[ordinamento per selezione](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-per-selezione) e dell'[ordinamento a bolle](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-a-bolle), non scambia mai due elementi: li sposta.

## Fare posto alla carta nuova

Hai in mano il $5$, l'$8$ e il $9$, in ordine, e peschi un $3$. Lo confronti con la carta più a destra, il $9$: è più grande, quindi il $9$ scivola di un posto a destra. Lo stesso succede con l'$8$ e con il $5$. Arrivato all'inizio della mano, il $3$ entra nel posto rimasto libero. Se la carta pescata fosse un $7$, il $9$ e l'$8$ si sposterebbero, ma il $5$ no: appena trovi una carta che non è più grande ti fermi, e il $7$ entra subito dopo di lei.

In un vettore succede la stessa cosa, elemento per elemento. Il primo, da solo, è già una fila in ordine. Dal secondo in poi ogni elemento viene tolto dal suo posto e tenuto da parte; quelli più grandi alla sua sinistra fanno uno **spostamento** ciascuno, cioè passano nella cella alla loro destra; l'elemento tenuto da parte entra nella cella rimasta libera. Dopo l'inserimento dell'elemento di indice $i$, i primi $i + 1$ elementi sono in ordine tra loro. Non sono ancora al posto definitivo, perché un elemento più piccolo può arrivare dopo e spostarli tutti.

Le carte pescate sono, nell'ordine, $8$, $5$, $9$, $3$, $7$ e $4$. Per ogni carta, quanti confronti servono prima di fermarsi e quanti elementi si spostano? Nella figura l'elemento tenuto da parte è sollevato sopra il posto libero, `i` è il suo indice di partenza e `j` l'indice dell'elemento con cui è appena stato confrontato. Esegui un passo alla volta l'inserimento del $3$ e poi quello del $7$: il primo arriva fino all'inizio del vettore, il secondo si ferma prima.

```interattivo
% nome: inf-insertion-sort-carte
% alt: Il vettore delle sei carte 8, 5, 9, 3, 7, 4 in sei celle con gli indici da 0 a 5. A ogni giro l'elemento di indice i viene sollevato sopra la fila e lascia un posto libero; viene confrontato con gli elementi alla sua sinistra, da destra verso sinistra, e quelli più grandi si spostano di un posto a destra finché se ne trova uno che non è più grande o si arriva all'inizio; allora l'elemento scende nel posto libero. Le celle già in ordine tra loro sono verdi. Sotto ci sono la frase che racconta il passo e i contatori di confronti e spostamenti; un campo permette di cambiare i valori
```

Il $3$ chiede tre confronti e fa spostare tre carte, perché è più piccolo di tutte. Anche il $7$ chiede tre confronti, ma ne sposta solo due: il terzo confronto, con il $5$, è quello che lo ferma. Per tutte e sei le carte servono $13$ confronti e $10$ spostamenti.

## Il programma

Nella funzione `ordina` il ciclo esterno prende gli elementi dal secondo all'ultimo, con `i` da $1$ a $n - 1$. Per prima cosa copia l'elemento nella variabile `x`: è il modo di tenerlo da parte, perché il primo spostamento scriverà sopra `v[i]`. Poi `j` parte dall'elemento subito a sinistra e torna indietro: finché `v[j]` è più grande di `x`, lo copia in `v[j + 1]`. Il posto libero è sempre la cella di indice `j + 1`, ed è lì che alla fine entra `x`.

```codice python
def stampa(v):
    for x in v:
        print(x, end=" ")
    print()

def ordina(v):
    n = len(v)
    for i in range(1, n):
        x = v[i]
        j = i - 1
        while j >= 0 and v[j] > x:
            v[j + 1] = v[j]
            j = j - 1
        v[j + 1] = x

carte = [8, 5, 9, 3, 7, 4]
ordina(carte)
stampa(carte)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

void stampa(int v[], int n) {
    for (int i = 0; i < n; i++) {
        cout << v[i] << " ";
    }
    cout << endl;
}

void ordina(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int x = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > x) {
            v[j + 1] = v[j];
            j = j - 1;
        }
        v[j + 1] = x;
    }
}

int main() {
    int carte[N] = {8, 5, 9, 3, 7, 4};
    ordina(carte, N);
    stampa(carte, N);
    return 0;
}
```

```ad-note
Che cosa cambia tra i due linguaggi
Il ciclo interno è un `while` perché non si sa in anticipo quanti elementi si sposteranno. Le sue due condizioni sono legate da `and` in Python e da `&&` in C++, come nella lezione su [Gli operatori logici](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici). Per il resto vale quello che hai visto negli altri ordinamenti: `len(v)` in Python, la dimensione come secondo parametro in C++.
```

Esegui il programma: scrive `3 4 5 7 8 9`. Poi cambia `v[j] > x` in `v[j] < x`: le carte escono dalla più alta alla più bassa.

```ad-warning
L'elemento non copiato va perso
Senza la variabile `x`, cioè confrontando con `v[i]` e scrivendo alla fine `v[j + 1] = v[i]`, il primo spostamento copia `v[i - 1]` sopra `v[i]` e il valore da inserire non c'è più. Con le prime due carte, $8$ e $5$, il vettore diventa $8$, $8$: il $5$ è sparito e l'$8$ compare due volte. Se alla fine nel vettore trovi dei doppioni, controlla di aver copiato l'elemento prima di spostare gli altri.
```

```ad-warning
Prima l'indice, poi l'elemento
Quando `x` è più piccolo di tutti gli elementi alla sua sinistra, `j` arriva a $-1$. Con `j >= 0` scritta per prima il ciclo si ferma lì, perché se la prima condizione è falsa la seconda non viene nemmeno controllata. Con le due condizioni scambiate il programma guarda `v[-1]` prima di accorgersi che `j` è uscito dal vettore: in C++ è una lettura fuori dal vettore, in Python `v[-1]` è l'ultimo elemento della lista e l'errore resta nascosto.
```

## La traccia sulle sei carte

Segui l'inserimento del $3$ riga per riga. `i` vale $3$, `x` prende il $3$ e `j` parte da $2$. Il confronto `v[2] > x` è $9 > 3$, vero: il $9$ viene copiato in `v[3]` e `j` scende a $1$. Lo stesso succede con l'$8$ e con il $5$, finché `j` vale $-1$ e il ciclo si ferma: `x` entra in `v[0]`. La tabella ha una riga per ogni elemento inserito.

| Elemento inserito | Confronti | Spostamenti | Vettore dopo l'inserimento |
|---|---|---|---|
| $5$ | $1$ | $1$ | $5,\ 8,\ 9,\ 3,\ 7,\ 4$ |
| $9$ | $1$ | $0$ | $5,\ 8,\ 9,\ 3,\ 7,\ 4$ |
| $3$ | $3$ | $3$ | $3,\ 5,\ 8,\ 9,\ 7,\ 4$ |
| $7$ | $3$ | $2$ | $3,\ 5,\ 7,\ 8,\ 9,\ 4$ |
| $4$ | $5$ | $4$ | $3,\ 4,\ 5,\ 7,\ 8,\ 9$ |

In ogni riga i confronti sono quanti gli spostamenti, oppure uno in più: quello in più è il confronto con l'elemento che non è più grande, e che ferma la ricerca del posto. Manca quando si arriva all'inizio del vettore, come per il $5$ e per il $3$. Per ritrovare l'ultima colonna nel programma, aggiungi una chiamata a `stampa` come ultima istruzione del ciclo esterno, dopo `v[j + 1] = x`: escono cinque righe, una per inserimento.

## Quanti confronti e quanti spostamenti

Questa volta anche i confronti dipendono dall'ordine di partenza. Se il vettore è già in ordine, ogni elemento viene confrontato una sola volta con il suo vicino di sinistra, che non è più grande, e resta dov'è: $n - 1$ confronti e nessuno spostamento. Se il vettore è rovesciato, ogni elemento è più piccolo di tutti quelli che ha a sinistra e li fa spostare tutti: il secondo ne sposta uno, il terzo due, l'ultimo $n - 1$, per un totale di

$$1 + 2 + \dots + (n - 1) = \frac{n(n - 1)}{2}$$

confronti e altrettanti spostamenti, cioè $15$ con sei elementi. Le sei carte dell'esempio, con $13$ confronti e $10$ spostamenti, sono vicine al caso peggiore. Scrivi nel campo della figura prima $3$, $4$, $5$, $7$, $8$, $9$ e poi $9$, $8$, $7$, $5$, $4$, $3$, e leggi i contatori alla fine: $5$ e $0$ nel primo caso, $15$ e $15$ nel secondo.

Uno spostamento costa meno di uno scambio: è un solo assegnamento, mentre lo scambio con `temp` ne chiede tre. E quando i dati sono quasi in ordine il lavoro è poco: per aggiungere un voto a un elenco già ordinato si fa un solo inserimento, senza toccare gli elementi più piccoli. Il confronto con gli altri due ordinamenti, a parità di vettore, è nella lezione [Confrontare gli algoritmi contando le operazioni](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/confrontare-gli-algoritmi-contando-le-operazioni).

## Prova tu

Il programma legge un numero intero $n$ e poi $n$ numeri interi, uno per riga, li ordina dal più piccolo al più grande e li scrive uno per riga. Nella funzione `ordina` manca il ciclo che fa posto a `x`: scrivilo tu.

```codice python
def ordina(v):
    n = len(v)
    for i in range(1, n):
        x = v[i]
        j = i - 1
        # scrivi qui il ciclo che sposta a destra gli elementi più grandi di x

        v[j + 1] = x

n = int(input())
carte = []
for i in range(n):
    carte.append(int(input()))
ordina(carte)
for c in carte:
    print(c)
%% soluzione
def ordina(v):
    n = len(v)
    for i in range(1, n):
        x = v[i]
        j = i - 1
        while j >= 0 and v[j] > x:
            v[j + 1] = v[j]
            j = j - 1

        v[j + 1] = x

n = int(input())
carte = []
for i in range(n):
    carte.append(int(input()))
ordina(carte)
for c in carte:
    print(c)
%% prova
6
8
5
9
3
7
4
%% stampa
3
4
5
7
8
9
%% prova
4
2
6
6
1
%% stampa
1
2
6
6
%% prova
3
10
20
30
%% stampa
10
20
30
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int x = v[i];
        int j = i - 1;
        // scrivi qui il ciclo che sposta a destra gli elementi più grandi di x

        v[j + 1] = x;
    }
}

int main() {
    int carte[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> carte[i];
    }
    ordina(carte, n);
    for (int i = 0; i < n; i++) {
        cout << carte[i] << endl;
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int x = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > x) {
            v[j + 1] = v[j];
            j = j - 1;
        }

        v[j + 1] = x;
    }
}

int main() {
    int carte[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> carte[i];
    }
    ordina(carte, n);
    for (int i = 0; i < n; i++) {
        cout << carte[i] << endl;
    }
    return 0;
}
```

Nel secondo esercizio il vettore è già in ordine e arriva un solo elemento nuovo. Il programma legge $n$, poi $n$ punteggi in ordine crescente, poi un punteggio `nuovo`. Scrivi la funzione `inserisci`, che mette il punteggio nuovo al posto giusto spostando a destra quelli più grandi, senza riordinare tutto il vettore. Il programma scrive poi gli $n + 1$ punteggi, uno per riga.

```codice python
def inserisci(v, x):
    v.append(x)
    # ora v ha un posto in più, in fondo: scrivi qui il resto

n = int(input())
punti = []
for i in range(n):
    punti.append(int(input()))
nuovo = int(input())
inserisci(punti, nuovo)
for p in punti:
    print(p)
%% soluzione
def inserisci(v, x):
    v.append(x)
    j = len(v) - 2
    while j >= 0 and v[j] > x:
        v[j + 1] = v[j]
        j = j - 1
    v[j + 1] = x

n = int(input())
punti = []
for i in range(n):
    punti.append(int(input()))
nuovo = int(input())
inserisci(punti, nuovo)
for p in punti:
    print(p)
%% prova
4
12
15
20
31
18
%% stampa
12
15
18
20
31
%% prova
3
5
7
9
2
%% stampa
2
5
7
9
%% prova
3
5
7
9
40
%% stampa
5
7
9
40
%% prova
0
6
%% stampa
6
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

// v ha n elementi in ordine e almeno un posto libero in fondo
void inserisci(int v[], int n, int x) {
    // scrivi qui
}

int main() {
    int punti[MAX];
    int n, nuovo;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> punti[i];
    }
    cin >> nuovo;
    inserisci(punti, n, nuovo);
    for (int i = 0; i < n + 1; i++) {
        cout << punti[i] << endl;
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

// v ha n elementi in ordine e almeno un posto libero in fondo
void inserisci(int v[], int n, int x) {
    int j = n - 1;
    while (j >= 0 && v[j] > x) {
        v[j + 1] = v[j];
        j = j - 1;
    }
    v[j + 1] = x;
}

int main() {
    int punti[MAX];
    int n, nuovo;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> punti[i];
    }
    cin >> nuovo;
    inserisci(punti, n, nuovo);
    for (int i = 0; i < n + 1; i++) {
        cout << punti[i] << endl;
    }
    return 0;
}
```
