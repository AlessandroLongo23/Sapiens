# L'ordinamento per selezione

Sei studenti hanno corso la finale della corsa campestre, e l'insegnante ha segnato i loro tempi in minuti nell'ordine in cui li ha letti dal cronometro: $15$, $12$, $19$, $13$, $17$, $14$. Per fare la classifica li vuole dal più basso al più alto. **Ordinare** un vettore vuol dire spostare i suoi elementi finché sono in ordine crescente; un vettore ordinato si legge come una classifica e si può esplorare con la [ricerca binaria](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/la-ricerca-binaria). I modi per ordinare sono tanti: questo è il primo, e ha una sola idea.

## Il più piccolo al primo posto

Metti sei carte scoperte in fila sul tavolo. Scorri tutta la fila, trovi la carta più bassa e la scambi di posto con la prima: adesso la prima carta è quella giusta, e non la tocchi più. Poi cerchi la più bassa tra le cinque che restano e la scambi con la seconda; poi la più bassa tra le ultime quattro, che va al terzo posto. Dopo cinque giri le prime cinque carte sono al loro posto, e la sesta, che è la più alta, lo è di conseguenza.

L'**ordinamento per selezione** (in inglese selection sort) fa lo stesso con un vettore: a ogni giro sceglie il più piccolo tra gli elementi non ancora sistemati e lo scambia con il primo di loro. Servono tre indici. `i` è il posto da riempire in questo giro, e gli elementi alla sua sinistra sono già sistemati; `j` scorre gli elementi alla destra di `i`; `imin` è l'indice del più piccolo trovato finora, cioè una posizione e non un valore.

Quanti confronti e quanti scambi servono per ordinare i sei tempi? Nella figura esegui un passo alla volta fino al primo scambio e guarda `imin`: parte dallo stesso posto di `i`, e si sposta ogni volta che `j` incontra un elemento più piccolo. Poi vai avanti fino alla fine, tenendo d'occhio i due contatori.

```interattivo
% nome: inf-selection-sort-imin
% alt: Il vettore dei sei tempi 15, 12, 19, 13, 17, 14 in sei celle con gli indici da 0 a 5. Sopra le celle i nomi i e j indicano il posto da riempire e l'elemento che viene confrontato, sotto il nome imin indica il più piccolo trovato finora, colorato di arancione. Alla fine di ogni giro l'elemento di indice imin viene scambiato con quello di indice i, che diventa verde, al suo posto; se i due indici sono uguali non c'è scambio. Sotto ci sono la frase che racconta il passo, i contatori di confronti e scambi, che arrivano a 15 e 3, e un campo per cambiare i valori
```

Servono $15$ confronti e $3$ scambi. I primi tre giri portano al loro posto il $12$, il $13$ e il $14$ con uno scambio ciascuno; negli ultimi due il più piccolo è già dove deve stare, `imin` resta uguale a `i` e non si scambia niente.

## Scambiare due elementi

Lo **scambio** è la mossa che mette ciascuno di due elementi al posto dell'altro: è lo scambio di due variabili che hai visto nella lezione sul [passaggio dei parametri](/materiale/scuola-superiore/informatica/le-funzioni/passaggio-dei-parametri-per-valore-e-per-riferimento), fatto su due elementi di un vettore. Con le carte usi due mani; in un programma ogni assegnamento cancella il valore che c'era prima, quindi serve una terza variabile, `temp`, che tiene da parte il primo valore mentre il suo posto viene occupato dal secondo. Il programma scambia i primi due tempi.

```codice python
tempi = [15, 12, 19, 13, 17, 14]
temp = tempi[0]
tempi[0] = tempi[1]
tempi[1] = temp
print(tempi[0], tempi[1])
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

int main() {
    int tempi[N] = {15, 12, 19, 13, 17, 14};
    int temp = tempi[0];
    tempi[0] = tempi[1];
    tempi[1] = temp;
    cout << tempi[0] << " " << tempi[1] << endl;
    return 0;
}
```

```ad-warning
Lo scambio senza la terza variabile
Cancella la riga con `temp` e scrivi le due assegnazioni che vengono in mente per prime, `tempi[0] = tempi[1]` e poi `tempi[1] = tempi[0]`. Il programma scrive `12 12`: la prima assegnazione ha cancellato il $15$, e la seconda copia indietro il $12$ appena scritto. Un valore è andato perso e l'altro compare due volte.
```

```ad-note
Lo scambio in una riga, solo in Python
Python sa scambiare due elementi con una sola istruzione: `tempi[0], tempi[1] = tempi[1], tempi[0]`. In queste lezioni lo scambio è scritto con `temp`, che funziona allo stesso modo in tutti e due i linguaggi.
```

## Il programma

I giri sono un ciclo, e dentro ogni giro c'è il ciclo che cerca il più piccolo: due [cicli annidati](/materiale/scuola-superiore/informatica/l-iterazione/cicli-annidati). Nella funzione `ordina` il ciclo esterno fa passare `i` da $0$ a $n - 2$, perché l'ultimo elemento va a posto da solo. Il ciclo interno è la ricerca del minimo che conosci dalla lezione [Massimo, minimo e media di una sequenza](/materiale/scuola-superiore/informatica/l-iterazione/massimo-minimo-e-media-di-una-sequenza), con una differenza: ricorda dove si trova il minimo, non quanto vale, perché per lo scambio serve la posizione. Finito il ciclo interno, se `imin` è diverso da `i` i due elementi si scambiano. La funzione `stampa` scrive il vettore su una riga.

```codice python
def stampa(v):
    for x in v:
        print(x, end=" ")
    print()

def ordina(v):
    n = len(v)
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            if v[j] < v[imin]:
                imin = j
        if imin != i:
            temp = v[i]
            v[i] = v[imin]
            v[imin] = temp

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
        int imin = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[imin]) {
                imin = j;
            }
        }
        if (imin != i) {
            int temp = v[i];
            v[i] = v[imin];
            v[imin] = temp;
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
Che cosa cambia tra Python e C++
In Python la funzione chiede la dimensione al vettore con `len(v)`, in C++ la riceve nel parametro `n`. In tutti e due `ordina` non restituisce niente: lavora sul vettore che riceve, e chi l'ha chiamata lo ritrova ordinato, come hai visto nella lezione [I vettori](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori).
```

Esegui il programma: scrive `12 13 14 15 17 19`. Poi cambia `<` in `>` nel confronto: `imin` diventa l'indice del più grande e i tempi escono dal più alto al più basso.

```ad-warning
Il confronto va fatto con il minimo trovato finora
Nel ciclo interno il confronto è `v[j] < v[imin]`. Se scrivi `v[j] < v[i]`, ogni elemento più piccolo di `v[i]` prende il posto del precedente in `imin`, anche quando è più grande di lui, e alla fine `imin` indica l'ultimo, non il più piccolo. Con i sei tempi il primo giro porta al primo posto il $14$ e non il $12$, e il programma scrive `14 12 15 13 17 19`.
```

## La traccia sui sei tempi

Segui il primo giro riga per riga. `i` vale $0$ e `imin` parte da $0$. Con `j` uguale a $1$ il confronto è $12 < 15$, vero: `imin` diventa $1$. Poi `j` passa da $2$ a $5$ e incontra $19$, $13$, $17$ e $14$: nessuno è minore di $12$, e `imin` resta $1$. All'uscita dal ciclo interno `imin` è diverso da `i`, quindi `v[0]` e `v[1]` si scambiano. La tabella ha una riga per ogni giro.

| Giro | `i` | `imin` alla fine | Scambio | Vettore dopo il giro |
|---|---|---|---|---|
| 1 | $0$ | $1$ | $15$ e $12$ | $12,\ 15,\ 19,\ 13,\ 17,\ 14$ |
| 2 | $1$ | $3$ | $15$ e $13$ | $12,\ 13,\ 19,\ 15,\ 17,\ 14$ |
| 3 | $2$ | $5$ | $19$ e $14$ | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |
| 4 | $3$ | $3$ | nessuno | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |
| 5 | $4$ | $4$ | nessuno | $12,\ 13,\ 14,\ 15,\ 17,\ 19$ |

Per ritrovare la tabella nel programma, aggiungi una chiamata a `stampa` come ultima istruzione del ciclo esterno, allineata con `if imin != i`: escono cinque righe, una per giro.

## Quanti confronti e quanti scambi

I confronti non dipendono dai valori. Nel primo giro `j` passa su $n - 1$ elementi, nel secondo su $n - 2$, nell'ultimo su uno solo: con sei elementi sono $5 + 4 + 3 + 2 + 1 = 15$. Con $n$ elementi la somma parte da $n - 1$ e scende fino a $1$, e vale

$$\frac{n(n - 1)}{2}$$

Gli scambi sono al massimo uno per giro, quindi mai più di $n - 1$: è il punto di forza di questo ordinamento. I sei tempi ne hanno chiesti $3$. Che cosa succede con un vettore già in ordine? Scrivi nel campo della figura $12$, $13$, $14$, $15$, $17$, $19$ e guarda i contatori alla fine: nessuno scambio, ma ancora $15$ confronti, perché l'algoritmo cerca il minimo in ogni giro anche quando è già al suo posto. Scrivi poi i tempi al contrario, $19$, $17$, $15$, $14$, $13$ e $12$: i confronti sono sempre $15$ e gli scambi solo $3$, perché ogni scambio sistema due elementi insieme.

Come si comporta l'ordinamento per selezione accanto agli altri, quando gli elementi diventano migliaia, è l'argomento della lezione [Confrontare gli algoritmi contando le operazioni](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/confrontare-gli-algoritmi-contando-le-operazioni).

## Prova tu

Il programma legge un numero intero $n$ e poi $n$ tempi interi, uno per riga, e deve fare solo il primo giro dell'ordinamento: trovare l'indice del tempo più basso e scambiare quel tempo con il primo. Poi scrive il vettore su una riga. Lettura e stampa ci sono già. In C++ il vettore è dichiarato con `MAX` posti, più di quelli che servono, perché la dimensione va fissata prima di sapere quanti tempi arriveranno: il programma ne usa solo i primi $n$.

```codice python
n = int(input())
tempi = []
for k in range(n):
    tempi.append(int(input()))
# scrivi qui la ricerca di imin e lo scambio

for x in tempi:
    print(x, end=" ")
print()
%% soluzione
n = int(input())
tempi = []
for k in range(n):
    tempi.append(int(input()))
imin = 0
for j in range(1, n):
    if tempi[j] < tempi[imin]:
        imin = j
temp = tempi[0]
tempi[0] = tempi[imin]
tempi[imin] = temp

for x in tempi:
    print(x, end=" ")
print()
%% prova
5
15
12
19
13
17
%% stampa
12 15 19 13 17
%% prova
4
9
7
8
3
%% stampa
3 7 8 9
%% prova
3
5
6
8
%% stampa
5 6 8
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

int main() {
    int tempi[MAX];
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        cin >> tempi[k];
    }
    // scrivi qui la ricerca di imin e lo scambio

    for (int k = 0; k < n; k++) {
        cout << tempi[k] << " ";
    }
    cout << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

int main() {
    int tempi[MAX];
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        cin >> tempi[k];
    }
    int imin = 0;
    for (int j = 1; j < n; j++) {
        if (tempi[j] < tempi[imin]) {
            imin = j;
        }
    }
    int temp = tempi[0];
    tempi[0] = tempi[imin];
    tempi[imin] = temp;

    for (int k = 0; k < n; k++) {
        cout << tempi[k] << " ";
    }
    cout << endl;
    return 0;
}
```

Nel secondo esercizio la classifica è quella di un torneo, dove vince chi ha più punti. Il programma legge un numero intero $n$ e poi $n$ punteggi interi, uno per riga, e li scrive su una riga dal più alto al più basso. Scrivi tutta la funzione `ordina`: a ogni giro al posto `i` va il più grande degli elementi che restano.

```codice python
def ordina(v):
    n = len(v)
    # scrivi qui i due cicli e lo scambio

n = int(input())
punti = []
for k in range(n):
    punti.append(int(input()))
ordina(punti)
for x in punti:
    print(x, end=" ")
print()
%% soluzione
def ordina(v):
    n = len(v)
    for i in range(n - 1):
        imax = i
        for j in range(i + 1, n):
            if v[j] > v[imax]:
                imax = j
        if imax != i:
            temp = v[i]
            v[i] = v[imax]
            v[imax] = temp

n = int(input())
punti = []
for k in range(n):
    punti.append(int(input()))
ordina(punti)
for x in punti:
    print(x, end=" ")
print()
%% prova
5
15
12
19
13
17
%% stampa
19 17 15 13 12
%% prova
4
3
7
7
9
%% stampa
9 7 7 3
%% prova
1
20
%% stampa
20
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    // scrivi qui i due cicli e lo scambio
}

int main() {
    int punti[MAX];
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        cin >> punti[k];
    }
    ordina(punti, n);
    for (int k = 0; k < n; k++) {
        cout << punti[k] << " ";
    }
    cout << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int MAX = 100;

void ordina(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int imax = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] > v[imax]) {
                imax = j;
            }
        }
        if (imax != i) {
            int temp = v[i];
            v[i] = v[imax];
            v[imax] = temp;
        }
    }
}

int main() {
    int punti[MAX];
    int n;
    cin >> n;
    for (int k = 0; k < n; k++) {
        cin >> punti[k];
    }
    ordina(punti, n);
    for (int k = 0; k < n; k++) {
        cout << punti[k] << " ";
    }
    cout << endl;
    return 0;
}
```
