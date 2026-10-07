# L'ordinamento a bolle

I tempi dei sei finalisti della corsa campestre sono ancora nell'ordine in cui l'insegnante li ha letti dal cronometro, e per la classifica vanno messi dal più basso al più alto. L'**ordinamento a bolle** (in inglese bubble sort) mette in ordine un vettore con una sola mossa, ripetuta tante volte: guardare due elementi vicini e scambiarli se sono nell'ordine sbagliato. Lo scambio è quello con la variabile `temp` che hai visto nell'[ordinamento per selezione](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-per-selezione); qui cambia chi viene scambiato con chi.

## Confrontare i vicini, un giro dopo l'altro

Pensa a sei compagni in fila per la foto di classe, da sistemare dal più basso al più alto. Parti da sinistra e guardi i primi due: se quello a sinistra è più alto, si scambiano di posto. Poi guardi il secondo e il terzo, poi il terzo e il quarto, fino agli ultimi due. Questa passata su tutta la fila, coppia per coppia, è un **giro**.

Alla fine del primo giro il più alto di tutti è all'ultimo posto: da quando entra in un confronto è sempre lui quello che deve stare a destra, e avanza di un posto alla volta fino in fondo. Il secondo giro porta il secondo più alto al penultimo posto, e così via. Per questo ogni giro si ferma un posto prima del precedente, e con $n$ elementi i giri sono al massimo $n - 1$: quando $n - 1$ elementi sono al loro posto, lo è anche quello che resta. Gli elementi grandi salgono verso il fondo del vettore come le bolle in un bicchiere di acqua frizzante, e il nome dell'algoritmo viene da lì.

I tempi della gara, in minuti, sono gli stessi della lezione sulla selezione: $15$, $12$, $19$, $13$, $17$ e $14$. Quanti confronti e quanti scambi servono per ordinarli? Nella figura esegui il primo giro un passo alla volta: `j` e `j+1` sono gli indici dei due vicini confrontati. Tieni d'occhio il $19$, che dal terzo confronto in poi viene scambiato ogni volta, e guarda dove si trova alla fine del giro.

```interattivo
% nome: inf-bubble-sort-giri
% alt: Il vettore dei sei tempi 15, 12, 19, 13, 17, 14 in sei celle con gli indici da 0 a 5. A ogni passo due celle vicine, indicate da j e j+1, vengono confrontate e scambiate se quella di sinistra è più grande; alla fine di ogni giro l'elemento più grande rimasto diventa verde, al suo posto. Sotto ci sono la frase che racconta il passo e i contatori di confronti e scambi. Una scelta in alto passa dalla versione con tutti i giri a quella con la bandierina, che si ferma al primo giro senza scambi; un campo permette di cambiare i valori
```

Servono $15$ confronti e $7$ scambi; sugli stessi tempi la selezione faceva $15$ confronti e $3$ scambi. Nel primo giro il $19$ ha fatto tre scambi di fila ed è arrivato all'ultimo posto, dove resta fino alla fine.

## Il programma

I giri sono un ciclo, e dentro ogni giro c'è il ciclo che scorre le coppie: due [cicli annidati](/materiale/scuola-superiore/informatica/l-iterazione/cicli-annidati). Nella funzione `ordina` il ciclo esterno conta i giri con `i`, da $0$ a $n - 2$. Il ciclo interno scorre le coppie con `j` e confronta `v[j]` con `v[j + 1]`: nel giro `i` gli ultimi `i` elementi sono già al loro posto, quindi `j` va da $0$ a $n - 2 - i$. La funzione `stampa` scrive il vettore su una riga.

```codice python
def stampa(v):
    for x in v:
        print(x, end=" ")
    print()

def ordina(v):
    n = len(v)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp

tempi = [15, 12, 19, 13, 17, 14]
ordina(tempi)
stampa(tempi)
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
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
            }
        }
    }
}

int main() {
    int tempi[N] = {15, 12, 19, 13, 17, 14};
    ordina(tempi, N);
    stampa(tempi, N);
    return 0;
}
```

```ad-note
Che cosa cambia tra i due linguaggi
In Python la funzione chiede la dimensione al vettore con `len(v)`, in C++ la riceve come secondo parametro. In tutti e due `ordina` non restituisce niente: lavora sul vettore che riceve, e chi l'ha chiamata lo ritrova ordinato, come hai visto nella lezione su [I vettori](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori).
```

Esegui il programma: scrive `12 13 14 15 17 19`. Poi cambia `>` in `<` nel confronto: i tempi escono dal più alto al più basso.

```ad-warning
L'ultimo confronto esce dal vettore
Il ciclo interno guarda `v[j]` e `v[j + 1]`, quindi `j` si deve fermare un posto prima dell'ultimo elemento. Se scrivi `range(n)` in Python, o `j < n` in C++, all'ultimo passaggio `j + 1` vale $n$ e l'elemento `v[n]` non esiste. Python si ferma con l'errore `IndexError: list index out of range`. Il C++ non avvisa: legge quello che trova in memoria dopo il vettore, e se quel valore è piccolo lo porta dentro con uno scambio.
```

## La traccia sui sei tempi

Segui il primo giro riga per riga. `i` vale $0$, quindi `j` va da $0$ a $4$. Con `j` uguale a $0$ il confronto è $15 > 12$, vero: i due si scambiano. Con `j` uguale a $1$ è $15 > 19$, falso, e non succede niente. Poi il $19$ incontra il $13$, il $17$ e il $14$, e ogni volta li scavalca. La tabella ha una riga per ogni giro.

| Giro | Vettore alla fine del giro | Confronti | Scambi |
|---|---|---|---|
| 1 | $12,\ 15,\ 13,\ 17,\ 14,\ 19$ | $5$ | $4$ |
| 2 | $12,\ 13,\ 15,\ 14,\ 17,\ 19$ | $4$ | $2$ |
| 3 | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ | $3$ | $1$ |
| 4 | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ | $2$ | $0$ |
| 5 | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ | $1$ | $0$ |

Per ritrovare la tabella nel programma, aggiungi una chiamata a `stampa` come ultima istruzione del ciclo esterno, dopo il ciclo interno e allineata con lui: escono cinque righe, una per giro. Dopo il terzo giro il vettore è già in ordine, ma l'algoritmo non lo sa e fa anche gli altri due: ci torniamo tra poco.

## Quanti confronti e quanti scambi

I confronti non dipendono dai valori. Il primo giro confronta $n - 1$ coppie, il secondo $n - 2$, l'ultimo una sola: con sei elementi sono $5 + 4 + 3 + 2 + 1 = 15$, e in generale

$$(n - 1) + \dots + 1 = \frac{n(n - 1)}{2}$$

Gli scambi invece dipendono dall'ordine di partenza. Un vettore già in ordine non ne chiede nessuno. Un vettore rovesciato, dal più grande al più piccolo, ne chiede uno a ogni confronto: $15$ scambi per sei elementi. I sei tempi della gara stanno in mezzo, con $7$. Riscrivi nel campo della figura i tempi al contrario, $19$, $17$, $15$, $14$, $13$, $12$, e controlla i due contatori alla fine.

## Fermarsi quando è già in ordine: la bandierina

Nella tabella gli ultimi due giri non scambiano niente. Un giro senza scambi dice una cosa precisa: ogni elemento è minore o uguale al suo vicino di destra, quindi il vettore è in ordine e i giri che restano sono inutili. Per accorgersene il programma usa una **bandierina** (in inglese flag), cioè una variabile booleana che ricorda se una cosa è successa. Qui si chiama `scambiato`: all'inizio di ogni giro vale falso, e diventa vera al primo scambio. Il ciclo esterno diventa un `while` con due condizioni legate da un [operatore logico](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici): si fa un altro giro solo se ne restano da fare e se nell'ultimo c'è stato almeno uno scambio.

I tempi di un'altra batteria sono $12$, $15$, $13$, $14$, $17$ e $19$, quasi in ordine. Questa versione di `ordina` alla fine scrive quanti giri ha fatto: prima di eseguirla, prova a dire il numero.

```codice python
def ordina(v):
    n = len(v)
    i = 0
    scambiato = True
    while i < n - 1 and scambiato:
        scambiato = False
        for j in range(n - 1 - i):
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp
                scambiato = True
        i = i + 1
    print("giri fatti:", i)

tempi = [12, 15, 13, 14, 17, 19]
ordina(tempi)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

void ordina(int v[], int n) {
    int i = 0;
    bool scambiato = true;
    while (i < n - 1 && scambiato) {
        scambiato = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
                scambiato = true;
            }
        }
        i = i + 1;
    }
    cout << "giri fatti: " << i << endl;
}

int main() {
    int tempi[N] = {12, 15, 13, 14, 17, 19};
    ordina(tempi, N);
    return 0;
}
```

I giri sono due. Il primo fa due scambi e mette tutto in ordine; il secondo non scambia niente, `scambiato` resta falso e il `while` si ferma. I confronti sono $5 + 4 = 9$ al posto di $15$. All'inizio `scambiato` vale vero solo per far partire il primo giro.

Quanto si risparmia dipende dal vettore. Nella figura scegli "Con la bandierina" e prova tre casi. Con i sei tempi della gara si salta solo l'ultimo giro, un confronto su $15$. Con un vettore già in ordine il primo giro non scambia niente e finisce lì, con $n - 1$ confronti. Con un vettore rovesciato ogni giro scambia, e la bandierina non fa risparmiare niente.

```ad-warning
La bandierina che non torna giù
`scambiato = False` deve essere la prima istruzione di ogni giro. Se la dimentichi, la bandierina resta alzata dall'inizio alla fine e il programma fa sempre tutti i giri. Il vettore esce ordinato lo stesso, e per questo l'errore non si vede dal risultato: lo vedi solo contando i giri, come fa il programma qui sopra.
```

Come si comporta l'ordinamento a bolle accanto agli altri, quando gli elementi diventano migliaia, è l'argomento della lezione [Confrontare gli algoritmi contando le operazioni](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/confrontare-gli-algoritmi-contando-le-operazioni).

## Prova tu

Il programma legge un numero intero $n$ e poi $n$ tempi interi, uno per riga, li ordina dal più basso al più alto e li scrive uno per riga. Nella funzione `ordina` i due cicli ci sono già: scrivi il confronto tra i due vicini e lo scambio.

```codice python
def ordina(v):
    n = len(v)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            # scrivi qui il confronto e lo scambio
            pass

n = int(input())
tempi = []
for i in range(n):
    tempi.append(int(input()))
ordina(tempi)
for x in tempi:
    print(x)
%% soluzione
def ordina(v):
    n = len(v)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp

n = int(input())
tempi = []
for i in range(n):
    tempi.append(int(input()))
ordina(tempi)
for x in tempi:
    print(x)
%% prova
6
15
12
19
13
17
14
%% stampa
12
13
14
15
17
19
%% prova
4
9
7
7
3
%% stampa
3
7
7
9
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            // scrivi qui il confronto e lo scambio
        }
    }
}

int main() {
    int tempi[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> tempi[i];
    }
    ordina(tempi, n);
    for (int i = 0; i < n; i++) {
        cout << tempi[i] << endl;
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
            }
        }
    }
}

int main() {
    int tempi[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> tempi[i];
    }
    ordina(tempi, n);
    for (int i = 0; i < n; i++) {
        cout << tempi[i] << endl;
    }
    return 0;
}
```

Nel secondo esercizio la funzione la scrivi tutta tu, e conta. Il programma legge $n$ e poi $n$ punteggi interi: la funzione `ordina` li mette in ordine crescente con l'ordinamento a bolle e restituisce il numero di scambi che ha fatto, che il programma scrive. Con un vettore già in ordine deve uscire $0$.

```codice python
# scrivi qui la funzione ordina, che restituisce il numero di scambi

n = int(input())
punti = []
for i in range(n):
    punti.append(int(input()))
print(ordina(punti))
%% soluzione
def ordina(v):
    n = len(v)
    scambi = 0
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp
                scambi = scambi + 1
    return scambi

n = int(input())
punti = []
for i in range(n):
    punti.append(int(input()))
print(ordina(punti))
%% prova
6
15
12
19
13
17
14
%% stampa
7
%% prova
4
3
5
8
9
%% stampa
0
%% prova
4
9
8
5
3
%% stampa
6
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

// scrivi qui la funzione ordina, che restituisce il numero di scambi

int main() {
    int punti[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> punti[i];
    }
    cout << ordina(punti, n) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

int ordina(int v[], int n) {
    int scambi = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
                scambi = scambi + 1;
            }
        }
    }
    return scambi;
}

int main() {
    int punti[MAX];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> punti[i];
    }
    cout << ordina(punti, n) << endl;
    return 0;
}
```
