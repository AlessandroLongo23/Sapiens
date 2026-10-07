# I vettori

Il programma della media, nella lezione [Massimo, minimo e media di una sequenza](/materiale/scuola-superiore/informatica/l-iterazione/massimo-minimo-e-media-di-una-sequenza), leggeva i voti uno alla volta e di ognuno teneva solo quello che serviva: la somma e il conto. Prova a chiedergli quanti voti stanno sopra la media: la media si conosce solo dopo l'ultimo voto, e a quel punto i voti non ci sono più. Servono tutti in memoria, e cinque variabili `voto1`, `voto2`, fino a `voto5` non risolvono il problema, perché un ciclo non ha modo di passare da un nome all'altro. Lo strumento adatto è il vettore.

## Tante variabili con un nome solo

Un **vettore** è una fila di variabili dello stesso tipo che hanno un solo nome e si distinguono per un numero. Ogni variabile della fila è un **elemento**; il numero che la individua è il suo **indice**; il numero degli elementi è la **dimensione** del vettore. In C++ un vettore si chiama array, in Python lista.

Gli indici partono da $0$, non da $1$: l'elemento di indice $0$ è il primo, quello di indice $1$ il secondo. Per usare un elemento si scrive il nome del vettore e l'indice tra parentesi quadre, e `voti[2]` si legge "voti di due". Nella figura il vettore `voti` contiene i cinque voti di una materia: sposta l'indice `i` con i bottoni, o tocca una cella, e leggi quanto vale `voti[i]`; poi porta `i` oltre l'ultimo voto.

```interattivo
% nome: inf-vettore-indice-elemento
% alt: Il vettore voti con cinque celle in fila, che contengono 7, 5, 8, 6 e 10, e sotto ogni cella il suo indice, da 0 a 4. Una freccia con il nome i indica una cella, e due riquadri mostrano il valore di i e quello di voti[i]. Due bottoni spostano i di un posto, un terzo aumenta di 1 l'elemento indicato. Dopo l'ultima cella ce n'è una tratteggiata con un punto di domanda e l'indice 5: portando lì i, la figura dice che voti[5] non esiste perché gli indici vanno da 0 a 4
```

Con cinque elementi gli indici vanno da $0$ a $4$, e in generale un vettore di dimensione $n$ ha gli indici da $0$ a $n - 1$: la dimensione non è un indice. Un elemento si usa come una variabile qualunque: si stampa, entra in un'espressione, riceve un valore con un assegnamento, e gli altri elementi restano come sono (nella figura `voti[i] = voti[i] + 1` cambia una cella sola). Il programma crea il vettore con i suoi cinque valori, ne legge due e ne cambia uno.

```codice python
voti = [7, 5, 8, 6, 10]
print("Primo voto:", voti[0])
print("Ultimo voto:", voti[4])
voti[1] = 6
print("Secondo voto, corretto:", voti[1])
print("Quanti voti:", len(voti))
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int main() {
    int voti[N] = {7, 5, 8, 6, 10};
    cout << "Primo voto: " << voti[0] << endl;
    cout << "Ultimo voto: " << voti[4] << endl;
    voti[1] = 6;
    cout << "Secondo voto, corretto: " << voti[1] << endl;
    cout << "Quanti voti: " << N << endl;
    return 0;
}
```

```ad-note
Che cosa cambia tra Python e C++
In C++ si dichiarano il tipo degli elementi e la dimensione, `int voti[N]`, e la dimensione non cambia più: per questo sta in una costante `N`, scritta una volta sola in cima al programma. I valori iniziali vanno tra parentesi graffe. In Python la lista si scrive tra parentesi quadre, non ha un tipo dichiarato, e la sua dimensione si chiede con `len(voti)`.
```

```ad-warning
L'indice che esce dal vettore
In un vettore di dimensione $5$ l'elemento `voti[5]` non esiste, perché l'ultimo è `voti[4]`. Aggiungi al programma una riga che stampa `voti[5]`: Python si ferma con l'errore `IndexError: list index out of range`. Il C++ non controlla l'indice mentre il programma gira: legge quello che trova in memoria dopo il vettore e stampa un numero che con i voti non c'entra. Con l'indice scritto come numero molti compilatori se ne accorgono e scrivono un avviso (`warning`), ma il programma parte lo stesso; quando l'indice è una variabile, come in un ciclo, non c'è nemmeno l'avviso. Scrivere in `voti[5]` è peggio, perché può rovinare un'altra variabile. In Python fai attenzione anche agli indici negativi, che non danno errore: `voti[-1]` è l'ultimo elemento.
```

## Scorrere un vettore con un ciclo

L'indice può essere una variabile, ed è questo che rende utile il vettore: se `i` vale $3$, `voti[i]` è `voti[3]`. Un [ciclo for](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for) che fa passare `i` da $0$ a $n - 1$ visita tutti gli elementi, uno per giro, qualunque sia la dimensione. Quello che il corpo fa con `voti[i]` lo conosci già: lo aggiunge a un [accumulatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori) per avere la somma, lo confronta con il massimo trovato finora, lo conta se rispetta una condizione.

Nella figura il ciclo calcola la somma dei voti. Esegui un passo alla volta e guarda che cosa cambia a ogni giro: `i`, la cella a cui punta, la variabile `somma`. Poi scegli "Massimo", e infine cambia la condizione del ciclo in `i <= 5` e vai fino all'ultimo passo.

```interattivo
% nome: inf-vettore-scorri-passi
% alt: Il vettore voti con le celle 7, 5, 8, 6 e 10 e gli indici da 0 a 4, percorso da un ciclo un passo alla volta. Una freccia con il nome i indica la cella del giro in corso, le celle già guardate diventano verdi, e accanto due riquadri mostrano i e la variabile somma, che passa da 0 a 7, 12, 20, 26 e 36. Scegliendo Massimo la variabile parte dal primo elemento, 7, e diventa 8 e poi 10. Con la condizione i minore o uguale a 5 il ciclo fa un giro in più e finisce su una cella tratteggiata fuori dal vettore, con un punto di domanda
```

A ogni giro cambia `i`, e con `i` cambia l'elemento su cui il corpo lavora; la somma cresce di un elemento alla volta, da $0$ a $36$. Il massimo parte dal primo elemento, come nella lezione sul massimo di una sequenza, e per questo il suo ciclo comincia dall'indice $1$. Con la condizione `i < 5` l'ultimo giro ha `i` uguale a $4$; con `i <= 5` il ciclo fa un giro in più, con `i` uguale a $5$, e chiede un elemento che non c'è.

```ad-warning
Il giro di troppo e il primo elemento saltato
La condizione del ciclo è `i < N`, con il minore stretto, e `i` parte da $0$. Chi conta da $1$ per abitudine scrive `i <= N`, e l'ultimo giro esce dal vettore: in C++ il risultato può perfino sembrare giusto, se in quel punto della memoria c'è uno zero. Oppure fa partire `i` da $1$, e allora il primo elemento non viene mai guardato, senza che nessun errore lo segnali.
```

Il programma risponde alla domanda dell'inizio. Il primo ciclo somma i voti e dopo il ciclo la divisione dà la media; il secondo ciclo scorre di nuovo lo stesso vettore e conta i voti che la superano. Sono due passate sugli stessi dati, e senza un vettore la seconda non si poteva fare.

```codice python
voti = [7, 5, 8, 6, 10]
somma = 0
for i in range(len(voti)):
    somma = somma + voti[i]
media = somma / len(voti)
print("Media:", media)
sopra = 0
for i in range(len(voti)):
    if voti[i] > media:
        sopra = sopra + 1
print("Voti sopra la media:", sopra)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int main() {
    int voti[N] = {7, 5, 8, 6, 10};
    double somma = 0;
    for (int i = 0; i < N; i++) {
        somma = somma + voti[i];
    }
    double media = somma / N;
    cout << "Media: " << media << endl;
    int sopra = 0;
    for (int i = 0; i < N; i++) {
        if (voti[i] > media) {
            sopra = sopra + 1;
        }
    }
    cout << "Voti sopra la media: " << sopra << endl;
    return 0;
}
```

La media è $7{,}2$ e i voti che la superano sono due. Cambia i voti e aggiungine un sesto: in Python non devi toccare altro, perché `len(voti)` segue la lista; in C++ devi portare `N` a $6$, e i due cicli si adeguano da soli perché usano la costante.

```ad-note
In Python si può scorrere anche senza indice
Quando l'indice non serve, Python permette di prendere direttamente gli elementi: `for voto in voti:` dà a `voto`, un giro dopo l'altro, il valore di ogni elemento. Con l'indice però puoi anche modificare l'elemento, sapere in che posto si trova e scrivere lo stesso ciclo nei due linguaggi: in queste lezioni si usa l'indice.
```

## Riempire un vettore con i dati letti

Di solito i valori non sono scritti nel programma: arrivano dalla tastiera. In C++ il vettore si dichiara senza valori e un ciclo legge un elemento per giro, direttamente in `voti[i]`. In Python si parte da una lista vuota, `[]`, e ogni valore letto si aggiunge in fondo con `append`, che allunga la lista di un elemento. Il programma legge cinque voti e scrive il più alto.

```codice python
voti = []
for i in range(5):
    voto = int(input("Voto: "))
    voti.append(voto)
massimo = voti[0]
for i in range(1, len(voti)):
    if voti[i] > massimo:
        massimo = voti[i]
print("Voto più alto:", massimo)
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int main() {
    int voti[N];
    for (int i = 0; i < N; i++) {
        cout << "Voto: ";
        cin >> voti[i];
    }
    int massimo = voti[0];
    for (int i = 1; i < N; i++) {
        if (voti[i] > massimo) {
            massimo = voti[i];
        }
    }
    cout << "Voto più alto: " << massimo << endl;
    return 0;
}
```

```ad-warning
Usare un elemento che non ha ancora un valore
In Python una lista vuota non ha elementi: `voti[0] = 7` subito dopo `voti = []` dà `IndexError`, perché l'elemento di indice $0$ non c'è ancora e va aggiunto con `append`. In C++ gli elementi di `int voti[N]` esistono subito, ma finché non li assegni contengono valori qualunque: se li sommi prima di averli letti ottieni un numero che non significa niente.
```

```ad-note
In C++ esiste anche vector
La libreria del C++ ha un tipo, `vector`, che come la lista di Python può crescere mentre il programma gira: `vector<int> voti;` crea un vettore vuoto e `voti.push_back(7);` gli aggiunge un elemento. In queste lezioni si usano gli array, che hanno la dimensione fissata.
```

## Un vettore come parametro di una funzione

Una funzione può ricevere un vettore come [parametro](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno). In Python si passa la lista, e la funzione ne chiede la dimensione con `len`. In C++ il parametro si scrive `int v[]`, con le quadre vuote, e dentro la funzione non c'è modo di sapere quanti elementi ha: la dimensione va passata in un secondo parametro, `int n`.

```codice python
def somma(v):
    s = 0
    for i in range(len(v)):
        s = s + v[i]
    return s

def aumenta(v):
    for i in range(len(v)):
        if v[i] < 10:
            v[i] = v[i] + 1

voti = [7, 5, 8, 6, 10]
print("Somma:", somma(voti))
aumenta(voti)
print("Somma dopo l'aumento:", somma(voti))
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int somma(int v[], int n) {
    int s = 0;
    for (int i = 0; i < n; i++) {
        s = s + v[i];
    }
    return s;
}

void aumenta(int v[], int n) {
    for (int i = 0; i < n; i++) {
        if (v[i] < 10) {
            v[i] = v[i] + 1;
        }
    }
}

int main() {
    int voti[N] = {7, 5, 8, 6, 10};
    cout << "Somma: " << somma(voti, N) << endl;
    aumenta(voti, N);
    cout << "Somma dopo l'aumento: " << somma(voti, N) << endl;
    return 0;
}
```

La seconda somma è $40$ e non $36$: `aumenta` ha alzato di un punto i quattro voti sotto il $10$ proprio nel vettore `voti` del programma, non in una copia. Succede in tutti e due i linguaggi, a differenza di quello che accade con un numero, come hai visto nella lezione sul [passaggio dei parametri](/materiale/scuola-superiore/informatica/le-funzioni/passaggio-dei-parametri-per-valore-e-per-riferimento): dentro la funzione `v` è un altro nome dello stesso vettore. Una funzione che il vettore lo legge soltanto, come `somma`, lo lascia com'è; una che lo modifica va chiamata sapendo che i dati di chi chiama cambiano.

Trovare un valore dentro un vettore, e dire in che posto si trova, è l'argomento della prossima lezione, [La ricerca sequenziale](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/la-ricerca-sequenziale).

## Prova tu

Il programma legge cinque numeri interi, uno per riga, e deve scriverli in ordine inverso, dall'ultimo letto al primo, uno per riga. Mettili in un vettore mentre li leggi, poi scorri il vettore all'indietro: l'indice parte da $4$ e scende fino a $0$.

```codice python
numeri = []
# scrivi qui la lettura dei cinque numeri
# scrivi qui il ciclo che li stampa al contrario
%% soluzione
numeri = []
for i in range(5):
    numeri.append(int(input()))
for i in range(4, -1, -1):
    print(numeri[i])
%% prova
3
8
1
9
4
%% stampa
4
9
1
8
3
%% prova
-2
0
7
7
15
%% stampa
15
7
7
0
-2
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int main() {
    int numeri[N];
    // scrivi qui la lettura dei cinque numeri
    // scrivi qui il ciclo che li stampa al contrario
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 5;

int main() {
    int numeri[N];
    for (int i = 0; i < N; i++) {
        cin >> numeri[i];
    }
    for (int i = N - 1; i >= 0; i--) {
        cout << numeri[i] << endl;
    }
    return 0;
}
```

Nel secondo esercizio il vettore passa a una funzione. Il programma legge le temperature di cinque giorni e scrive l'escursione termica, cioè la differenza tra la temperatura più alta e la più bassa. La lettura e la stampa ci sono già: completa la funzione `escursione`, che cerca il massimo e il minimo del vettore nello stesso ciclo e restituisce la loro differenza. Le temperature possono essere negative.

```codice python
def escursione(v):
    # scrivi qui: massimo e minimo partono da v[0]
    return 0

gradi = []
for i in range(5):
    gradi.append(int(input()))
print(escursione(gradi))
%% soluzione
def escursione(v):
    massimo = v[0]
    minimo = v[0]
    for i in range(1, len(v)):
        if v[i] > massimo:
            massimo = v[i]
        if v[i] < minimo:
            minimo = v[i]
    return massimo - minimo

gradi = []
for i in range(5):
    gradi.append(int(input()))
print(escursione(gradi))
%% prova
12
9
15
11
8
%% stampa
7
%% prova
-4
-10
-2
-7
-3
%% stampa
8
%% prova
21
13
-1
18
16
%% stampa
22
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 5;

int escursione(int v[], int n) {
    // scrivi qui: massimo e minimo partono da v[0]
    return 0;
}

int main() {
    int gradi[N];
    for (int i = 0; i < N; i++) {
        cin >> gradi[i];
    }
    cout << escursione(gradi, N) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 5;

int escursione(int v[], int n) {
    int massimo = v[0];
    int minimo = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] > massimo) {
            massimo = v[i];
        }
        if (v[i] < minimo) {
            minimo = v[i];
        }
    }
    return massimo - minimo;
}

int main() {
    int gradi[N];
    for (int i = 0; i < N; i++) {
        cin >> gradi[i];
    }
    cout << escursione(gradi, N) << endl;
    return 0;
}
```
