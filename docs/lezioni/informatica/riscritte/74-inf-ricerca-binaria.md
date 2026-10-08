# La ricerca binaria

Nella palestra della scuola gli armadietti sono numerati, e il custode tiene l'elenco di quelli occupati in ordine crescente. Per sapere se l'armadietto $21$ è libero potresti scorrere l'elenco dal primo numero all'ultimo, come fa la [ricerca sequenziale](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/la-ricerca-sequenziale). L'elenco però è ordinato, e questo permette di fare molto meglio: è quello che fai quando cerchi una parola nel dizionario e lo apri a metà, senza partire dalla prima pagina.

## Guardare al centro e scartare metà

L'elenco è il [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori) `armadietti`, con otto elementi in ordine crescente: $3$, $8$, $12$, $17$, $21$, $26$, $34$, $40$. Guarda l'elemento al centro, quello di indice $3$, che vale $17$. Il $21$ è più grande di $17$ e, siccome il vettore è ordinato, tutto quello che sta a sinistra del $17$ è ancora più piccolo: con un solo confronto hai scartato quattro elementi, e il $21$ può stare solo tra gli indici $4$ e $7$. Lì ripeti la stessa mossa: guardi il centro di quello che resta e scarti la metà in cui il valore non può stare.

La **ricerca binaria** è questo procedimento: si confronta il valore cercato con l'elemento centrale della parte di vettore ancora da esaminare e, se non è lui, si continua solo nella metà in cui può trovarsi. Per ricordare qual è la parte ancora da esaminare servono due indici, `sinistra` e `destra`, che ne segnano il primo e l'ultimo elemento; l'indice dell'elemento centrale è `centro`. La ricerca finisce quando l'elemento centrale è quello cercato, oppure quando non resta più niente da esaminare.

Quanti elementi deve guardare la ricerca binaria per trovare il $21$ tra gli otto numeri? E quanti per accorgersi che il $30$ non c'è? Nella figura esegui un passo alla volta, e a ogni passo guarda dove sono `sinistra`, `destra` e `centro` e quali celle diventano tratteggiate. Poi scrivi $30$ nel campo "Cerca" e ripeti.

```interattivo
% nome: inf-ricerca-binaria-armadietti
% alt: Il vettore ordinato degli armadietti occupati, 3, 8, 12, 17, 21, 26, 34, 40, in otto celle con gli indici da 0 a 7, e sopra il valore cercato, 21. A ogni passo i nomi sinistra e destra indicano il primo e l'ultimo elemento della parte ancora da esaminare e il nome centro quello che viene confrontato: prima l'indice 3, che vale 17, poi l'indice 5, che vale 26, poi l'indice 4, che vale 21 e diventa verde. Le celle scartate diventano tratteggiate. Sotto ci sono la frase che racconta il passo, il contatore dei confronti, che arriva a 3, e i campi per cambiare i valori e il numero da cercare
```

In tutti e due i casi i confronti sono tre. Per il $21$ la ricerca guarda il $17$, poi il $26$, poi il $21$. Per il $30$ guarda il $17$, il $26$ e il $34$, e a quel punto `sinistra` ha superato `destra`: tra i due indici non c'è più nessun elemento, quindi il $30$ nel vettore non c'è.

## Il programma

Come quella della ricerca sequenziale, la funzione `cerca` riceve il vettore `v`, che qui deve essere ordinato, e il valore `x`, e [restituisce](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno) l'indice a cui si trova `x`, oppure $-1$ se non c'è: gli indici partono da $0$, quindi $-1$ non si confonde con una posizione. All'inizio la parte da esaminare è tutto il vettore, con `sinistra` che vale $0$ e `destra` che vale l'ultimo indice. Il [ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while) continua finché `sinistra <= destra`, cioè finché resta almeno un elemento. `centro` è la media dei due indici, senza la parte dopo la virgola: con $0$ e $7$ la somma è $7$ e la divisione intera per $2$ dà $3$.

```codice python
def cerca(v, x):
    sinistra = 0
    destra = len(v) - 1
    while sinistra <= destra:
        centro = (sinistra + destra) // 2
        if v[centro] == x:
            return centro
        elif v[centro] < x:
            sinistra = centro + 1
        else:
            destra = centro - 1
    return -1

armadietti = [3, 8, 12, 17, 21, 26, 34, 40]
x = int(input("Quale armadietto? "))
posizione = cerca(armadietti, x)
if posizione == -1:
    print("L'armadietto", x, "è libero")
else:
    print("Occupato: è all'indice", posizione)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 8;

int cerca(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    while (sinistra <= destra) {
        centro = (sinistra + destra) / 2;
        if (v[centro] == x) {
            return centro;
        } else if (v[centro] < x) {
            sinistra = centro + 1;
        } else {
            destra = centro - 1;
        }
    }
    return -1;
}

int main() {
    int armadietti[N] = {3, 8, 12, 17, 21, 26, 34, 40};
    int x;
    cout << "Quale armadietto? ";
    cin >> x;
    int posizione = cerca(armadietti, N, x);
    if (posizione == -1) {
        cout << "L'armadietto " << x << " è libero" << endl;
    } else {
        cout << "Occupato: è all'indice " << posizione << endl;
    }
    return 0;
}
```

```ad-note
Che cosa cambia tra Python e C++
In Python la divisione intera si scrive `//`; in C++ la divisione `/` tra due `int` butta già via la parte dopo la virgola. In C++ la funzione riceve la dimensione del vettore in un parametro, `n`, mentre in Python la chiede con `len(v)`.
```

Esegui il programma con $21$: la tabella segue le variabili un giro alla volta, e sono gli stessi passi della figura.

| Giro | `sinistra` | `destra` | `centro` | `v[centro]` | Che cosa succede |
|---|---|---|---|---|---|
| 1 | $0$ | $7$ | $3$ | $17$ | $17 < 21$: `sinistra` diventa $4$ |
| 2 | $4$ | $7$ | $5$ | $26$ | $26 > 21$: `destra` diventa $4$ |
| 3 | $4$ | $4$ | $4$ | $21$ | trovato: la funzione restituisce $4$ |

Prova poi con $30$, che non c'è, e con $3$ e $40$, il primo e l'ultimo elemento. Per vedere la tabella mentre il programma gira, aggiungi nel ciclo, subito dopo il calcolo di `centro`, la stampa di `sinistra`, `destra` e `centro`.

```ad-warning
Il centro non si riguarda
Dopo il confronto l'elemento centrale è già stato escluso, quindi la nuova parte comincia da `centro + 1` oppure finisce a `centro - 1`. Se scrivi `sinistra = centro`, senza il `+ 1`, e cerchi il $30$, la ricerca arriva ad avere `sinistra` e `destra` uguali a $5$ e lì resta: `centro` vale ancora $5$, `sinistra` non cambia più e il ciclo non finisce.
```

```ad-warning
Il ciclo che si ferma un giro prima
Con `while sinistra < destra`, senza l'uguale, la ricerca del $21$ restituisce $-1$. Al terzo giro della tabella `sinistra` e `destra` valgono tutti e due $4$: resta un elemento da guardare, ed è proprio il $21$, ma la condizione è falsa e il ciclo non lo guarda.
```

## Perché il vettore deve essere ordinato

Scartare mezzo vettore dopo un solo confronto è lecito perché nel vettore ordinato tutto quello che sta a sinistra di un elemento è più piccolo di lui, e tutto quello che sta a destra è più grande. Vale per i numeri e per qualunque dato che si possa mettere in ordine, come i cognomi di una rubrica, che sono [stringhe](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/le-stringhe). Se l'ordine manca, la ricerca scarta anche la metà in cui il valore si trova. Sostituisci nel programma il vettore con gli stessi numeri in disordine, $17$, $3$, $40$, $8$, $26$, $12$, $34$, $21$, e cerca il $21$: il programma guarda l'$8$, il $12$ e il $34$, poi dichiara l'armadietto libero, mentre il $21$ è l'ultimo elemento.

```ad-warning
Nessuno controlla che il vettore sia ordinato
La funzione `cerca` non si accorge se il vettore è in disordine: non dà errori, restituisce una risposta sbagliata. Tocca a chi la chiama passarle un vettore ordinato in ordine crescente.
```

## Quanti confronti servono

Ogni confronto che non trova il valore lascia da esaminare al massimo la metà degli elementi di prima. Parti da un vettore di $1000$ elementi e dimezza, buttando via il resto: dopo il primo confronto ne restano al massimo $500$, poi $250$, $125$, $62$, $31$, $15$, $7$, $3$ e infine $1$, che viene guardato con il decimo confronto. Alla ricerca binaria servono quindi al massimo $10$ confronti, dove alla sequenziale ne possono servire $1000$.

Il programma lo verifica. Riempie un vettore con i primi `n` numeri pari, che sono già in ordine, e cerca un valore più grande di tutti: è il caso peggiore, perché la ricerca va avanti finché non resta più niente. La funzione è quella di prima, con un contatore al posto dell'indice restituito.

```codice python
def confronti(v, x):
    sinistra = 0
    destra = len(v) - 1
    quanti = 0
    while sinistra <= destra:
        centro = (sinistra + destra) // 2
        quanti = quanti + 1
        if v[centro] == x:
            return quanti
        elif v[centro] < x:
            sinistra = centro + 1
        else:
            destra = centro - 1
    return quanti

n = 1000
v = []
for i in range(n):
    v.append(2 * i)
print(n, "elementi:", confronti(v, 2 * n), "confronti")
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 1000;

int confronti(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    int quanti = 0;
    while (sinistra <= destra) {
        centro = (sinistra + destra) / 2;
        quanti = quanti + 1;
        if (v[centro] == x) {
            return quanti;
        } else if (v[centro] < x) {
            sinistra = centro + 1;
        } else {
            destra = centro - 1;
        }
    }
    return quanti;
}

int main() {
    int v[N];
    for (int i = 0; i < N; i++) {
        v[i] = 2 * i;
    }
    cout << N << " elementi: " << confronti(v, N, 2 * N) << " confronti" << endl;
    return 0;
}
```

Con $1000$ elementi i confronti sono $10$. Raddoppia il numero degli elementi: con $2000$ diventano $11$, con $4000$ diventano $12$. Ogni volta che il vettore raddoppia serve un solo confronto in più, perché il primo confronto riporta al vettore di prima.

| Elementi | Ricerca sequenziale, al massimo | Ricerca binaria, al massimo |
|---|---|---|
| $8$ | $8$ | $4$ |
| $100$ | $100$ | $7$ |
| $1000$ | $1000$ | $10$ |
| $1\,000\,000$ | $1\,000\,000$ | $20$ |

Il numero di volte che si può dimezzare $n$ prima di arrivare a $1$ ha un nome in matematica: è il logaritmo in base $2$ di $n$, che trovi nella lezione [Logaritmi e loro proprietà](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta). Per questo si dice che i confronti della ricerca binaria crescono come il logaritmo del numero degli elementi, mentre quelli della ricerca sequenziale crescono come il numero degli elementi.

La tabella parla del caso peggiore. Che cosa succede valore per valore? Nella figura le due ricerche lavorano sullo stesso vettore di dodici armadietti, un confronto a testa per passo, con i due contatori uno accanto all'altro. Cerca il $59$, che è il penultimo, e guarda chi finisce prima; poi cerca il $3$, che è il primo, e il $30$, che non c'è.

```interattivo
% nome: inf-ricerca-binaria-sequenziale
% alt: Due file di dodici celle con lo stesso vettore ordinato, 3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63, e sopra il valore cercato, 59. Nella fila in alto la ricerca sequenziale guarda un elemento dopo l'altro, indicato da i; nella fila in basso la ricerca binaria guarda ogni volta il centro della parte rimasta, e le celle scartate diventano tratteggiate. Sotto ci sono la frase che racconta il passo e due contatori dei confronti uno accanto all'altro: la binaria trova il 59 al terzo confronto e aspetta, la sequenziale ci arriva all'undicesimo. I campi in basso cambiano i valori e il numero da cercare
```

Per il $59$ servono $11$ confronti alla ricerca sequenziale e $3$ alla binaria. Con il $3$ vince la sequenziale, che lo trova al primo confronto mentre la binaria ne fa $3$: succede solo quando il valore è tra i primi elementi. Per il $30$, che non c'è, la sequenziale deve guardare tutti i dodici elementi e la binaria si ferma dopo $3$; con dodici elementi non ne guarda mai più di $4$.

Questo vantaggio ha un prezzo: il vettore deve essere ordinato, e ordinarlo costa lavoro. Come si fa lo vedi a partire dalla prossima lezione, [L'ordinamento per selezione](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-per-selezione); il confronto tra tutti questi algoritmi è nella lezione [Confrontare gli algoritmi contando le operazioni](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/confrontare-gli-algoritmi-contando-le-operazioni).

## Prova tu

Il vettore `armadietti` contiene i numeri di dodici armadietti occupati, in ordine crescente. Il programma legge un numero e scrive l'indice a cui si trova nel vettore, oppure $-1$ se non c'è. L'inizio e la fine della funzione `cerca` ci sono già: scrivi il ciclo della ricerca binaria.

```codice python
def cerca(v, x):
    sinistra = 0
    destra = len(v) - 1
    # scrivi qui il ciclo
    return -1

armadietti = [3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63]
x = int(input())
print(cerca(armadietti, x))
%% soluzione
def cerca(v, x):
    sinistra = 0
    destra = len(v) - 1
    while sinistra <= destra:
        centro = (sinistra + destra) // 2
        if v[centro] == x:
            return centro
        elif v[centro] < x:
            sinistra = centro + 1
        else:
            destra = centro - 1
    return -1

armadietti = [3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63]
x = int(input())
print(cerca(armadietti, x))
%% prova
21
%% stampa
4
%% prova
3
%% stampa
0
%% prova
63
%% stampa
11
%% prova
30
%% stampa
-1
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 12;

int cerca(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    // scrivi qui il ciclo
    return -1;
}

int main() {
    int armadietti[N] = {3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63};
    int x;
    cin >> x;
    cout << cerca(armadietti, N, x) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 12;

int cerca(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    while (sinistra <= destra) {
        centro = (sinistra + destra) / 2;
        if (v[centro] == x) {
            return centro;
        } else if (v[centro] < x) {
            sinistra = centro + 1;
        } else {
            destra = centro - 1;
        }
    }
    return -1;
}

int main() {
    int armadietti[N] = {3, 8, 12, 17, 21, 26, 34, 40, 47, 52, 59, 63};
    int x;
    cin >> x;
    cout << cerca(armadietti, N, x) << endl;
    return 0;
}
```

Nel secondo esercizio l'ordine è al contrario. La classifica di un torneo ha i punti di dieci giocatori in ordine decrescente, dal primo all'ultimo. Il programma legge un punteggio e scrive l'indice a cui si trova nel vettore, oppure $-1$ se nessuno ha quei punti. Scrivi tutta la funzione `cerca`: in un vettore decrescente, quando l'elemento centrale è più piccolo del valore cercato, la metà da tenere è l'altra.

```codice python
def cerca(v, x):
    # scrivi qui la ricerca binaria in un vettore decrescente
    return -1

punti = [98, 91, 87, 80, 74, 66, 59, 51, 45, 38]
x = int(input())
print(cerca(punti, x))
%% soluzione
def cerca(v, x):
    sinistra = 0
    destra = len(v) - 1
    while sinistra <= destra:
        centro = (sinistra + destra) // 2
        if v[centro] == x:
            return centro
        elif v[centro] > x:
            sinistra = centro + 1
        else:
            destra = centro - 1
    return -1

punti = [98, 91, 87, 80, 74, 66, 59, 51, 45, 38]
x = int(input())
print(cerca(punti, x))
%% prova
87
%% stampa
2
%% prova
38
%% stampa
9
%% prova
60
%% stampa
-1
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 10;

int cerca(int v[], int n, int x) {
    // scrivi qui la ricerca binaria in un vettore decrescente
    return -1;
}

int main() {
    int punti[N] = {98, 91, 87, 80, 74, 66, 59, 51, 45, 38};
    int x;
    cin >> x;
    cout << cerca(punti, N, x) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 10;

int cerca(int v[], int n, int x) {
    int sinistra = 0;
    int destra = n - 1;
    int centro;
    while (sinistra <= destra) {
        centro = (sinistra + destra) / 2;
        if (v[centro] == x) {
            return centro;
        } else if (v[centro] > x) {
            sinistra = centro + 1;
        } else {
            destra = centro - 1;
        }
    }
    return -1;
}

int main() {
    int punti[N] = {98, 91, 87, 80, 74, 66, 59, 51, 45, 38};
    int x;
    cin >> x;
    cout << cerca(punti, N, x) << endl;
    return 0;
}
```
