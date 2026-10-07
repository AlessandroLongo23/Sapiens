# Variabili locali e globali

In un programma con più funzioni capita presto che due di loro usino lo stesso nome: una `totale` per i punti di una squadra, un'altra `totale` per i punti di tutta la stagione. Il programma funziona lo stesso, perché ogni funzione ha le sue variabili e non vede quelle delle altre. Sapere dove esiste una variabile, e per quanto tempo, ti dice dove la puoi usare e chi la può cambiare.

## Una variabile locale esiste solo nella sua funzione

Una **variabile locale** è una variabile creata dentro una funzione: si può usare solo lì, dal punto in cui nasce fino alla fine della funzione. Anche i parametri sono variabili locali, che ricevono il loro valore dagli argomenti della chiamata, come hai visto in [Parametri e valore di ritorno](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno). La parte del programma in cui un nome si può usare è la **visibilità** di quella variabile.

In un torneo di calcetto tra classi una vittoria vale $3$ punti e un pareggio $1$. La funzione `punti` calcola i punti di una squadra, e ha tre variabili locali: i parametri `vinte` e `pareggi`, e `totale`.

```codice python
def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi
    return totale

classifica = punti(4, 1)
print("Punti:", classifica)
```

```codice cpp
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
    return totale;
}

int main() {
    int classifica = punti(4, 1);
    cout << "Punti: " << classifica << endl;
    return 0;
}
```

Il programma principale, cioè le istruzioni che stanno fuori dalle funzioni (in C++ quelle di `main`), riceve da `punti` solo il valore di ritorno, $13$, e lo mette in `classifica`. Aggiungi in fondo al programma principale un'istruzione che scrive `totale` ed esegui: il programma non arriva alla fine, perché fuori da `punti` quel nome non esiste.

```ad-note
L'errore nei due linguaggi
Python esegue il programma fino alla riga sbagliata: scrive `Punti: 13` e poi si ferma con `NameError: name 'totale' is not defined`. Il C++ controlla i nomi prima di partire: il compilatore segnala che `totale` non è dichiarata, e il programma non viene eseguito.
```

```ad-warning
Il risultato non esce da solo dalla funzione
Calcolare un valore in una variabile locale e poi cercarlo da fuori con lo stesso nome è l'errore più frequente di chi comincia a scrivere funzioni. Dalla funzione esce solo il valore che `return` restituisce, e chi chiama lo deve raccogliere in una sua variabile.
```

## Una variabile locale nasce con la chiamata e sparisce al ritorno

Il **tempo di vita** di una variabile è l'intervallo dell'esecuzione in cui la variabile esiste. Quello di una variabile locale coincide con una chiamata: la variabile nasce quando la funzione viene chiamata e sparisce quando la funzione finisce. A ogni chiamata nascono variabili nuove, che della chiamata precedente non ricordano niente.

Per tenere il conto delle funzioni in corso il computer usa la **pila delle chiamate**: un riquadro per ogni funzione chiamata e non ancora finita, uno sopra l'altro. In fondo sta il programma principale. Ogni chiamata appoggia sopra un riquadro con i parametri e le variabili locali della funzione, e il ritorno lo toglie con tutto quello che contiene.

Il programma qui sotto somma i punti che una squadra ha fatto all'andata ($4$ vittorie e $1$ pareggio) e al ritorno ($2$ vittorie e $3$ pareggi). Il nome `totale` compare due volte: nel programma principale è il totale della stagione, dentro `punti` è il totale di un girone.

```codice python
def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi
    return totale

totale = 0
totale = totale + punti(4, 1)
totale = totale + punti(2, 3)
print(totale)
```

```codice cpp
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
    return totale;
}

int main() {
    int totale = 0;
    totale = totale + punti(4, 1);
    totale = totale + punti(2, 3);
    cout << totale << endl;
    return 0;
}
```

Mentre `punti` calcola i punti dell'andata, quante variabili `totale` ci sono, e quanto valgono? La figura esegue questo programma una riga alla volta e mostra la pila. Vai avanti fino al passo in cui `punti` ha calcolato il suo `totale` e confronta i due riquadri; poi prosegui fino alla seconda chiamata, e guarda con quali valori rinasce il riquadro di `punti`.

```interattivo
% nome: inf-visibilita-pila
% alt: Il programma che somma i punti dell'andata e del ritorno, eseguito una riga alla volta in Python o in C++, accanto alla pila delle chiamate. In fondo c'è il riquadro del programma principale con la sua variabile totale; a ogni chiamata di punti compare sopra un riquadro con i parametri vinte e pareggi e con un'altra variabile totale, che al ritorno sparisce. Alla prima chiamata il totale di punti vale 13 mentre quello del programma principale vale 0; alla seconda chiamata il riquadro rinasce con 2, 3 e 9, e alla fine il totale del programma principale vale 22
```

Le variabili `totale` sono due. Durante la prima chiamata quella del programma principale vale ancora $0$ e quella di `punti` vale $13$: hanno lo stesso nome, ma stanno in due riquadri diversi e sono due variabili diverse. Al ritorno il riquadro di `punti` sparisce, e del $13$ resta solo la copia che `return` ha restituito. Alla seconda chiamata nasce un riquadro nuovo, in cui `totale` vale $9$ e del $13$ di prima non c'è traccia. Alla fine il programma scrive $22$, il valore dell'unica `totale` rimasta.

Che due funzioni possano usare lo stesso nome senza disturbarsi è un vantaggio: scrivi una funzione senza sapere quali nomi usa il resto del programma, e usi una funzione scritta da altri conoscendo solo che cosa riceve e che cosa restituisce.

```ad-warning
Una variabile locale non ricorda la chiamata precedente
Un contatore creato dentro una funzione (`quanti = 0` come prima istruzione) riparte da $0$ a ogni chiamata: non può contare quante volte la funzione è stata chiamata, né sommare valori arrivati in chiamate diverse. Il conto lo tiene chi chiama, in una sua variabile, aggiornandola con il valore di ritorno.
```

## Una variabile globale si vede da tutto il programma

Una **variabile globale** è una variabile creata fuori da ogni funzione. Nasce quando l'esecuzione arriva alla sua riga, vive fino alla fine del programma e si può usare in tutte le funzioni che la seguono. Nel programma qui sotto i punti di una vittoria stanno nella globale `per_vittoria`, che `punti` legge senza averla ricevuta come parametro.

```codice python
per_vittoria = 3

def punti(vinte, pareggi):
    return per_vittoria * vinte + pareggi

print(punti(4, 1))
per_vittoria = 2
print(punti(4, 1))
```

```codice cpp
#include <iostream>
using namespace std;

int per_vittoria = 3;

int punti(int vinte, int pareggi) {
    return per_vittoria * vinte + pareggi;
}

int main() {
    cout << punti(4, 1) << endl;
    per_vittoria = 2;
    cout << punti(4, 1) << endl;
    return 0;
}
```

Esegui: il programma scrive $13$ e poi $9$. La chiamata è la stessa, `punti(4, 1)`, ma il risultato cambia, perché tra una chiamata e l'altra qualcuno ha cambiato una variabile che `punti` usa e che non è tra i suoi parametri.

```ad-note
Dove stanno le globali e come si modificano
In C++ è globale una variabile dichiarata fuori da tutte le funzioni, di solito in cima al programma; quelle dichiarate in `main` sono locali di `main`, e le altre funzioni non le vedono. Una funzione assegna un valore a una globale come a qualunque altra variabile. In Python è globale ogni variabile creata fuori dalle funzioni, quindi tutte quelle del programma principale. Una funzione le può leggere, ma un assegnamento dentro una funzione crea sempre una variabile locale: è quello che succede a `totale` nel programma della stagione. Per cambiare la globale la funzione lo deve dichiarare, con la riga `global per_vittoria` prima dell'assegnamento.
```

```ad-warning
Una locale con il nome di una globale la nasconde
Se dentro una funzione crei una variabile che si chiama come una globale (in C++ dichiarandola, in Python assegnandole un valore senza `global`), in quella funzione il nome indica la locale. La globale resta com'era e nessun messaggio ti avvisa. In Python c'è un caso in cui l'errore si vede: una funzione che fa `per_vittoria = per_vittoria + 1` senza `global` si ferma con `UnboundLocalError`, perché legge una locale che non ha ancora un valore.
```

## Perché le variabili globali si evitano

Una funzione che usa solo parametri e variabili locali si capisce leggendo le sue righe: quello che le serve arriva dagli argomenti e quello che produce esce con `return`. Una funzione che legge o cambia una globale dipende da qualcosa che sta altrove. Per sapere che cosa restituirà `punti(4, 1)` nel programma di prima devi cercare in tutto il programma chi ha toccato `per_vittoria` e quando, e in un programma di trecento righe con dieci funzioni la ricerca è lunga. Per lo stesso motivo la funzione non si può copiare in un altro programma senza portarsi dietro la globale.

La regola è passare a una funzione quello che le serve come parametro e farsi restituire il risultato. Nel programma di prima sposta `per_vittoria` tra i parametri, cioè definisci `punti(vinte, pareggi, per_vittoria)` e chiamala con `punti(4, 1, 3)` e `punti(4, 1, 2)`: i risultati sono ancora $13$ e $9$, ma ora la differenza si legge nelle due chiamate.

Fa eccezione un valore che non cambia mai durante l'esecuzione, come i $3$ punti di una vittoria nel calcetto: una costante globale non crea sorprese, perché nessuno la modifica, e dà un nome a un numero che altrimenti comparirebbe sparso nel programma. Per distinguerla la si scrive in maiuscolo, `PER_VITTORIA = 3`, e in C++ la si dichiara con `const`, che vieta di modificarla: `const int PER_VITTORIA = 3;`.

## Prova tu

Il programma legge le vittorie e i pareggi di una squadra, uno per riga, e deve scrivere i suoi punti. Così com'è non funziona, perché il programma principale cerca una variabile che è locale di `punti`. Correggilo lasciando il calcolo dentro la funzione.

```codice python
def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi

vinte = int(input())
pareggi = int(input())
punti(vinte, pareggi)
print(totale)
%% soluzione
def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi
    return totale

vinte = int(input())
pareggi = int(input())
classifica = punti(vinte, pareggi)
print(classifica)
%% prova
4
1
%% stampa
13
%% prova
0
5
%% stampa
5
%% prova
7
0
%% stampa
21
```

```codice cpp
#include <iostream>
using namespace std;

void punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
}

int main() {
    int vinte, pareggi;
    cin >> vinte;
    cin >> pareggi;
    punti(vinte, pareggi);
    cout << totale << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
    return totale;
}

int main() {
    int vinte, pareggi;
    cin >> vinte;
    cin >> pareggi;
    int classifica = punti(vinte, pareggi);
    cout << classifica << endl;
    return 0;
}
```

Nel secondo esercizio il programma legge un numero $n$ e poi $n$ voti, e deve scrivere quanti voti sono sufficienti, cioè almeno $6$. Scrive invece sempre $0$ oppure $1$: la `quanti` di `registra` è locale e riparte da $0$ a ogni chiamata, e il programma principale butta via il conto che aveva. Correggi il programma principale in modo che sia la sua `quanti` a tenere il conto, senza usare variabili globali dentro `registra`.

```codice python
def registra(voto):
    quanti = 0
    if voto >= 6:
        quanti = quanti + 1
    return quanti

n = int(input())
quanti = 0
for i in range(1, n + 1):
    voto = int(input())
    quanti = registra(voto)
print(quanti)
%% soluzione
def registra(voto):
    quanti = 0
    if voto >= 6:
        quanti = quanti + 1
    return quanti

n = int(input())
quanti = 0
for i in range(1, n + 1):
    voto = int(input())
    quanti = quanti + registra(voto)
print(quanti)
%% prova
4
7
5
8
6
%% stampa
3
%% prova
3
4
5
3
%% stampa
0
%% prova
5
6
4
9
10
2
%% stampa
3
```

```codice cpp
#include <iostream>
using namespace std;

int registra(int voto) {
    int quanti = 0;
    if (voto >= 6) {
        quanti = quanti + 1;
    }
    return quanti;
}

int main() {
    int n;
    cin >> n;
    int quanti = 0;
    for (int i = 1; i <= n; i++) {
        int voto;
        cin >> voto;
        quanti = registra(voto);
    }
    cout << quanti << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int registra(int voto) {
    int quanti = 0;
    if (voto >= 6) {
        quanti = quanti + 1;
    }
    return quanti;
}

int main() {
    int n;
    cin >> n;
    int quanti = 0;
    for (int i = 1; i <= n; i++) {
        int voto;
        cin >> voto;
        quanti = quanti + registra(voto);
    }
    cout << quanti << endl;
    return 0;
}
```
