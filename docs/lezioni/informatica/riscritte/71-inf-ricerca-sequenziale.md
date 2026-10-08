# La ricerca sequenziale

Alla corsa campestre della scuola i giudici segnano i numeri di pettorale nell'ordine in cui i concorrenti tagliano il traguardo: $12$, $7$, $25$, $3$, $18$, $9$, $31$, $14$. Tu avevi il $18$ e vuoi sapere se sei nell'elenco e a che posto sei arrivato. L'elenco è un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori), e la domanda è la più comune che si fa a un vettore: questo valore c'è, e dove?

## Guardare gli elementi uno dopo l'altro

I pettorali non sono in ordine di numero, quindi il $18$ può stare in qualunque posto e non c'è modo di saltarne qualcuno. La **ricerca sequenziale** fa quello che faresti tu con il dito sull'elenco: parte dal primo elemento e confronta ogni elemento con il valore cercato, uno dopo l'altro, finché lo trova o finché l'elenco finisce. Si chiama anche ricerca lineare.

La prima versione risponde solo "c'è" o "non c'è". La risposta sta in una variabile booleana, `trovato`, che parte da falso perché all'inizio non hai ancora visto niente; un ciclo scorre il vettore, e se un elemento è uguale al valore cercato `trovato` diventa vero. La risposta si legge dopo il ciclo.

```codice python
arrivi = [12, 7, 25, 3, 18, 9, 31, 14]
x = int(input("Pettorale da cercare: "))
trovato = False
for i in range(len(arrivi)):
    if arrivi[i] == x:
        trovato = True
if trovato:
    print("Il", x, "è arrivato")
else:
    print("Il", x, "non è arrivato")
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 8;

int main() {
    int arrivi[N] = {12, 7, 25, 3, 18, 9, 31, 14};
    int x;
    cout << "Pettorale da cercare: ";
    cin >> x;
    bool trovato = false;
    for (int i = 0; i < N; i++) {
        if (arrivi[i] == x) {
            trovato = true;
        }
    }
    if (trovato) {
        cout << "Il " << x << " è arrivato" << endl;
    } else {
        cout << "Il " << x << " non è arrivato" << endl;
    }
    return 0;
}
```

Esegui con $18$ e poi con $20$, un pettorale che non ha finito la gara.

```ad-warning
L'else che cancella la risposta
Viene spontaneo completare la selezione dentro il ciclo con un `else` che rimette `trovato` a falso. Provalo e cerca il $18$: il programma dice che non è arrivato. Dopo il $18$ il ciclo incontra il $9$, che è diverso, e l'`else` cancella quello che aveva trovato: così la risposta dipende solo dall'ultimo elemento. Un elemento diverso non dice niente, e `trovato` non va toccata.
```

## Dire in che posto si trova

Per sapere anche dove sta il valore, al posto del vero o falso si tiene da parte un indice. La variabile `posizione` parte da $-1$, un numero che non è l'indice di nessun elemento e che quindi vuol dire "non trovato"; quando il confronto riesce, `posizione` prende il valore di `i`. Dopo il ciclo, se vale ancora $-1$ il valore non c'è; altrimenti è l'indice dell'elemento, e nella classifica il posto è `posizione + 1`, perché gli indici partono da $0$.

Con il ciclo `for` di prima, però, il programma continua a confrontare anche dopo aver trovato quello che cercava. È lavoro inutile, e se il valore compare due volte `posizione` finisce sull'ultima. Per fermarsi serve un [ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while) con due condizioni unite dall'[operatore logico](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici) "e", che è `and` in Python e `&&` in C++: si va avanti finché ci sono ancora elementi e il valore non è stato trovato.

Nella figura la ricerca cerca il $18$. Premi "Esegui" e leggi quanti confronti ha fatto quando si ferma; poi scegli "Va avanti" e ripeti. Infine scrivi un altro $18$ al posto del $31$ nel campo dei valori, e guarda quanto vale `posizione` alla fine nelle due versioni.

```interattivo
% nome: inf-ricerca-sequenziale-posizione
% alt: Il vettore arrivi con otto celle, 12, 7, 25, 3, 18, 9, 31 e 14, e gli indici da 0 a 7; sopra, il valore cercato, 18. A ogni passo la freccia i indica l'elemento confrontato: quelli diversi diventano tratteggiati, quello uguale verde. Due contatori mostrano i confronti fatti e la variabile posizione, che parte da -1. Nella versione che si ferma la ricerca finisce all'indice 4 dopo 5 confronti; nella versione che va avanti guarda tutti gli otto elementi. Lo studente può cambiare i valori e il numero da cercare
```

Fermandosi, la ricerca trova il $18$ all'indice $4$ dopo $5$ confronti; andando avanti ne fa $8$, uno per elemento, e arriva alla stessa risposta. Con due $18$ le risposte cambiano: la versione che si ferma dà l'indice del primo, $4$, l'altra quello dell'ultimo, $6$.

```codice python
arrivi = [12, 7, 25, 3, 18, 9, 31, 14]
x = int(input("Pettorale da cercare: "))
posizione = -1
i = 0
while i < len(arrivi) and posizione == -1:
    if arrivi[i] == x:
        posizione = i
    i = i + 1
if posizione == -1:
    print("Il", x, "non è arrivato")
else:
    print("Il", x, "è arrivato al posto", posizione + 1)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 8;

int main() {
    int arrivi[N] = {12, 7, 25, 3, 18, 9, 31, 14};
    int x;
    cout << "Pettorale da cercare: ";
    cin >> x;
    int posizione = -1;
    int i = 0;
    while (i < N && posizione == -1) {
        if (arrivi[i] == x) {
            posizione = i;
        }
        i = i + 1;
    }
    if (posizione == -1) {
        cout << "Il " << x << " non è arrivato" << endl;
    } else {
        cout << "Il " << x << " è arrivato al posto " << posizione + 1 << endl;
    }
    return 0;
}
```

```ad-warning
Il ciclo che non controlla la fine del vettore
Chi pensa solo al caso in cui il valore c'è scrive un ciclo che va avanti "finché l'elemento è diverso", con la sola condizione `arrivi[i] != x`. Funziona con il $18$; con il $20$, che non c'è, `i` supera l'ultimo indice e il programma [esce dal vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori). La condizione `i < N` serve proprio per il valore che non c'è.
```

## La ricerca come funzione

Cercare un valore serve in tanti programmi, quindi conviene scriverlo una volta come [funzione](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno): riceve il vettore e il valore, restituisce l'indice oppure $-1$. In una funzione fermarsi è più facile, perché `return` chiude la funzione nel momento in cui viene eseguito: appena il confronto riesce si restituisce `i`, e il resto del vettore non viene guardato. Se il ciclo arriva in fondo, nessun elemento era uguale, e dopo il ciclo si restituisce $-1$.

```codice python
def cerca(v, x):
    for i in range(len(v)):
        if v[i] == x:
            return i
    return -1

arrivi = [12, 7, 25, 3, 18, 9, 31, 14]
print(cerca(arrivi, 18))
print(cerca(arrivi, 20))
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 8;

int cerca(int v[], int n, int x) {
    for (int i = 0; i < n; i++) {
        if (v[i] == x) {
            return i;
        }
    }
    return -1;
}

int main() {
    int arrivi[N] = {12, 7, 25, 3, 18, 9, 31, 14};
    cout << cerca(arrivi, N, 18) << endl;
    cout << cerca(arrivi, N, 20) << endl;
    return 0;
}
```

Il programma scrive $4$ e $-1$.

```ad-warning
Rispondere "non c'è" troppo presto
L'errore più frequente è mettere `return -1` in un `else` dentro il ciclo. Al primo giro l'elemento di indice $0$ è diverso dal valore, l'`else` restituisce $-1$ e la funzione finisce dopo un solo confronto: trova il valore solo quando è il primo. Che un valore non c'è si può dire soltanto dopo aver guardato tutti gli elementi, quindi `return -1` sta dopo il ciclo, fuori dal suo corpo.
```

Una domanda diversa è quante volte compare un valore, per esempio quanti $6$ ci sono tra i voti di una classe. Qui non ci si può fermare al primo: vanno guardati tutti gli elementi, con un [contatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori) che aumenta a ogni confronto riuscito. È il primo esercizio di "Prova tu".

## Quanti confronti servono

Il lavoro di una ricerca si misura contando i confronti tra un elemento e il valore cercato, e il loro numero dipende da dove sta il valore. Nella figura tocca la cella in cui vuoi mettere il valore cercato, oppure scegli "Il valore non c'è", e leggi il numero dei confronti; poi cambia il numero degli elementi.

```interattivo
% nome: inf-ricerca-sequenziale-casi
% alt: Un vettore di otto celle con gli indici da 0 a 7. Lo studente tocca la cella dove sta il valore cercato: le celle che la precedono diventano tratteggiate, perché sono state confrontate e sono diverse, quella toccata diventa verde e le successive restano bianche, non guardate. Tre contatori mostrano i confronti fatti, il caso migliore, che è sempre 1, e il caso peggiore, uguale al numero degli elementi. Un bottone dice che il valore non c'è, e allora tutte le celle sono tratteggiate; altri due bottoni cambiano il numero degli elementi da 2 a 12
```

Se il valore è all'indice $k$, i confronti sono $k + 1$. I casi che contano sono tre.

- Il **caso migliore** è il valore al primo posto: un confronto, qualunque sia la dimensione del vettore.
- Il **caso peggiore** è il valore all'ultimo posto, oppure assente: con $n$ elementi servono $n$ confronti.
- Il **caso medio** vale quando il valore c'è e può stare in ogni posto con la stessa probabilità: è la media dei confronti di tutti i posti. Con otto elementi è $\dfrac{1 + 2 + \dots + 8}{8} = \dfrac{36}{8} = 4{,}5$, e in generale $\dfrac{n + 1}{2}$, circa la metà degli elementi.

| Elementi | Caso migliore | Caso medio | Caso peggiore |
|---|---|---|---|
| $8$ | $1$ | $4{,}5$ | $8$ |
| $1000$ | $1$ | $500{,}5$ | $1000$ |
| $1\,000\,000$ | $1$ | $500\,000{,}5$ | $1\,000\,000$ |

Se gli elementi raddoppiano, raddoppiano anche i confronti del caso peggiore e, quasi, quelli del caso medio. Per un vettore qualunque non si può fare di meglio; se invece gli elementi sono in ordine, la [ricerca binaria](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/la-ricerca-binaria) trova un valore tra un milione con una ventina di confronti.

## Prova tu

Il programma legge sei voti interi, uno per riga, e poi un settimo numero, il voto da cercare. Scrivi quante volte quel voto compare tra i sei. Il voto da cercare arriva per ultimo, quindi i sei voti vanno messi in un vettore.

```codice python
voti = []
for i in range(6):
    voti.append(int(input()))
x = int(input())
# scrivi qui il conteggio e la stampa
%% soluzione
voti = []
for i in range(6):
    voti.append(int(input()))
x = int(input())
volte = 0
for i in range(len(voti)):
    if voti[i] == x:
        volte = volte + 1
print(volte)
%% prova
6
8
6
5
7
6
6
%% stampa
3
%% prova
7
7
4
9
8
5
10
%% stampa
0
%% prova
5
8
6
7
9
8
8
%% stampa
2
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

int main() {
    int voti[N];
    for (int i = 0; i < N; i++) {
        cin >> voti[i];
    }
    int x;
    cin >> x;
    // scrivi qui il conteggio e la stampa
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 6;

int main() {
    int voti[N];
    for (int i = 0; i < N; i++) {
        cin >> voti[i];
    }
    int x;
    cin >> x;
    int volte = 0;
    for (int i = 0; i < N; i++) {
        if (voti[i] == x) {
            volte = volte + 1;
        }
    }
    cout << volte << endl;
    return 0;
}
```

Nel secondo esercizio cerchi il primo elemento che rispetta una condizione, al posto di un valore preciso. Il programma legge sei voti e scrive l'indice del primo voto insufficiente, cioè minore di $6$, oppure $-1$ se sono tutti sufficienti. La lettura e la stampa ci sono già: completa la funzione `insufficiente`, che si ferma al primo voto insufficiente che incontra.

```codice python
def insufficiente(v):
    # scrivi qui la ricerca
    return -1

voti = []
for i in range(6):
    voti.append(int(input()))
print(insufficiente(voti))
%% soluzione
def insufficiente(v):
    for i in range(len(v)):
        if v[i] < 6:
            return i
    return -1

voti = []
for i in range(6):
    voti.append(int(input()))
print(insufficiente(voti))
%% prova
7
8
5
6
4
9
%% stampa
2
%% prova
6
7
8
6
9
10
%% stampa
-1
%% prova
3
8
7
6
6
5
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

int insufficiente(int v[], int n) {
    // scrivi qui la ricerca
    return -1;
}

int main() {
    int voti[N];
    for (int i = 0; i < N; i++) {
        cin >> voti[i];
    }
    cout << insufficiente(voti, N) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 6;

int insufficiente(int v[], int n) {
    for (int i = 0; i < n; i++) {
        if (v[i] < 6) {
            return i;
        }
    }
    return -1;
}

int main() {
    int voti[N];
    for (int i = 0; i < N; i++) {
        cin >> voti[i];
    }
    cout << insufficiente(voti, N) << endl;
    return 0;
}
```
