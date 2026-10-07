# Scomporre un problema: la progettazione top-down

Alla fine dell'anno il coordinatore di una classe ha davanti i voti di ogni studente e deve scrivere l'esito di ciascuno: ammesso, giudizio sospeso, non ammesso. Un programma che lo fa al posto suo deve leggere i voti controllando che siano validi, contare le insufficienze, decidere l'esito, scrivere una riga per studente e alla fine dire quanti sono gli ammessi. Scritto tutto di seguito diventa un ciclo dentro un altro ciclo con tre selezioni in mezzo, difficile da scrivere giusto e ancora più difficile da correggere. Con le funzioni c'è un'altra strada: dividere il problema in pezzi e risolverne uno alla volta.

## Dal problema ai sottoproblemi

La **progettazione top-down**, cioè dall'alto verso il basso, parte dal problema intero e lo divide in pochi **sottoproblemi**, più piccoli, ognuno dei quali fa una cosa sola. Un sottoproblema ancora troppo grande si divide a sua volta. Ci si ferma quando ogni pezzo si scrive in poche righe con quello che sai già: una lettura, un ciclo con un contatore, una selezione.

Nella scuola dell'esempio i voti sono interi da $1$ a $10$, e l'esito dipende dal numero di insufficienze, cioè di voti sotto il $6$: con nessuna lo studente è ammesso, da una a tre ha il giudizio sospeso, con più di tre non è ammesso. Il programma chiede quanti sono gli studenti e quante le materie, poi legge i voti di uno studente alla volta.

Per ogni studente le cose da fare sono due: contare le sue insufficienze e scrivere la sua riga. Il conto degli ammessi è un contatore, e resta al programma principale: dentro una funzione sarebbe una [variabile locale](/materiale/scuola-superiore/informatica/le-funzioni/variabili-locali-e-globali), che ripartirebbe da zero a ogni chiamata. Nessuno dei due pezzi è ancora minimo. Per contare le insufficienze bisogna leggere i voti, e ogni voto va richiesto finché non è valido; per scrivere la riga bisogna prima decidere l'esito. Il disegno di questa divisione è l'**albero della scomposizione**: in cima il problema, sotto ogni problema i sottoproblemi in cui è stato diviso.

Fin dove conviene scendere? Nella figura l'albero si apre un livello alla volta. Vai avanti fino al passo 4 e, per ogni riquadro che compare, chiediti se lo sapresti scrivere in poche righe; i passi successivi servono più avanti.

```interattivo
% nome: inf-top-down-albero
% alt: L'albero della scomposizione del programma degli esiti, che si apre un passo alla volta. In cima il problema, scrivere gli esiti della classe. Al primo livello due sottoproblemi: contare le insufficienze di uno studente e scrivere la riga di uno studente. Al secondo livello, sotto il primo, leggere un voto valido e, sotto il secondo, decidere l'esito. Poi ogni riquadro riceve il nome della sua funzione: il programma principale (main in C++), insufficienze, stampa_riga, leggi_voto, esito. Negli ultimi passi i riquadri cambiano colore nell'ordine in cui le funzioni si scrivono: prima il programma principale con le due funzioni del primo livello ancora vuote, poi una funzione alla volta dall'alto verso il basso
```

La scomposizione si ferma al secondo livello. Leggere un voto valido è una lettura con un ciclo `while` che la ripete; decidere l'esito è una selezione a tre vie. Dividerli ancora non li renderebbe più facili da scrivere.

```ad-warning
Un sottoproblema che fa due cose
Se per dire che cosa fa un pezzo ti serve una "e" ("legge i voti e decide l'esito"), i pezzi sono due. Tenerli insieme costa caro alla prima modifica: per cambiare la regola dell'esito dovresti mettere le mani anche sulla lettura, che funzionava.
```

## Una funzione per sottoproblema

Ogni sottoproblema diventa una [funzione](/materiale/scuola-superiore/informatica/le-funzioni/definire-e-chiamare-una-funzione), con un nome che dice che cosa fa. Prima di scriverne il corpo si decide che cosa riceve e che cosa restituisce, cioè i suoi [parametri e il suo valore di ritorno](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno), perché è l'unica cosa che le altre funzioni devono sapere di lei.

| Sottoproblema | Funzione | Riceve | Restituisce |
|---|---|---|---|
| Leggere un voto valido | `leggi_voto()` | niente | il voto, da $1$ a $10$ |
| Contare le insufficienze di uno studente | `insufficienze(materie)` | il numero delle materie | quanti voti sono sotto il $6$ |
| Decidere l'esito | `esito(quante)` | il numero di insufficienze | il testo dell'esito |
| Scrivere la riga di uno studente | `stampa_riga(numero, quante)` | il numero dello studente e le sue insufficienze | niente: scrive |

Nella figura, al passo 5, ogni riquadro dell'albero prende il nome della sua funzione, e un ramo dell'albero diventa una chiamata: `insufficienze` chiama `leggi_voto`, `stampa_riga` chiama `esito`.

## Prima il programma principale, con le funzioni ancora vuote

Anche la scrittura va dall'alto verso il basso. Si comincia dal programma principale, scritto come se le funzioni del primo livello ci fossero già. Perché si possa eseguire, quelle funzioni devono esistere: le si scrive vuote, con il nome e i parametri giusti e un corpo provvisorio che restituisce un valore fisso.

```codice python
def insufficienze(materie):
    return 0

def stampa_riga(numero, quante):
    print("Studente", numero)

studenti = int(input("Quanti studenti? "))
materie = int(input("Quante materie? "))
ammessi = 0
for numero in range(1, studenti + 1):
    quante = insufficienze(materie)
    stampa_riga(numero, quante)
    if quante == 0:
        ammessi = ammessi + 1
print("Ammessi:", ammessi, "su", studenti)
```

```codice cpp
#include <iostream>
using namespace std;

int insufficienze(int materie) {
    return 0;
}

void stampa_riga(int numero, int quante) {
    cout << "Studente " << numero << endl;
}

int main() {
    int studenti, materie;
    cout << "Quanti studenti? ";
    cin >> studenti;
    cout << "Quante materie? ";
    cin >> materie;
    int ammessi = 0;
    for (int numero = 1; numero <= studenti; numero++) {
        int quante = insufficienze(materie);
        stampa_riga(numero, quante);
        if (quante == 0) {
            ammessi = ammessi + 1;
        }
    }
    cout << "Ammessi: " << ammessi << " su " << studenti << endl;
    return 0;
}
```

Esegui con $2$ studenti e $3$ materie: il programma scrive `Studente 1`, `Studente 2` e `Ammessi: 2 su 2`. I risultati sono finti, ma hai già controllato la parte che tiene insieme tutto il resto: il ciclo fa un giro per studente, le chiamate hanno gli argomenti giusti, il contatore conta. Cambia il valore restituito da `insufficienze` in $2$ ed esegui di nuovo: gli ammessi devono diventare $0$.

```ad-note
Una funzione vuota nei due linguaggi
In Python il corpo di una funzione non può mancare: quando non c'è ancora niente da scrivere ci si mette `pass`, l'istruzione che non fa nulla. In C++ una funzione `void` può avere le graffe vuote, mentre una funzione con un valore di ritorno deve avere un `return` del tipo dichiarato, anche solo `return 0;`.
```

```ad-warning
Partire dai dettagli
Chi comincia da `leggi_voto` perché è la più facile scrive funzioni senza sapere ancora chi le chiamerà e con quali argomenti, e spesso scopre alla fine che non si incastrano. Partendo dal programma principale, ogni funzione nasce già con i parametri che servono a chi la usa.
```

## Riempire una funzione alla volta

Ora si scende lungo l'albero. Si riempie una funzione, si esegue il programma, e solo quando funziona si passa alla successiva; se la funzione ne chiama un'altra che non c'è ancora, anche quella nasce vuota. Nella figura i passi dal 6 in poi mostrano l'ordine: a ogni passo il programma si può eseguire, e un errore si trova nell'unica funzione appena scritta. Questo è il programma completo.

```codice python
def leggi_voto():
    voto = int(input("Voto: "))
    while voto < 1 or voto > 10:
        voto = int(input("Da 1 a 10: "))
    return voto

def insufficienze(materie):
    quante = 0
    for i in range(1, materie + 1):
        if leggi_voto() < 6:
            quante = quante + 1
    return quante

def esito(quante):
    if quante == 0:
        return "ammesso"
    elif quante <= 3:
        return "giudizio sospeso"
    else:
        return "non ammesso"

def stampa_riga(numero, quante):
    print("Studente", numero, esito(quante))

studenti = int(input("Quanti studenti? "))
materie = int(input("Quante materie? "))
ammessi = 0
for numero in range(1, studenti + 1):
    quante = insufficienze(materie)
    stampa_riga(numero, quante)
    if quante == 0:
        ammessi = ammessi + 1
print("Ammessi:", ammessi, "su", studenti)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int leggi_voto() {
    int voto;
    cout << "Voto: ";
    cin >> voto;
    while (voto < 1 || voto > 10) {
        cout << "Da 1 a 10: ";
        cin >> voto;
    }
    return voto;
}

int insufficienze(int materie) {
    int quante = 0;
    for (int i = 1; i <= materie; i++) {
        if (leggi_voto() < 6) {
            quante = quante + 1;
        }
    }
    return quante;
}

string esito(int quante) {
    if (quante == 0) {
        return "ammesso";
    } else if (quante <= 3) {
        return "giudizio sospeso";
    } else {
        return "non ammesso";
    }
}

void stampa_riga(int numero, int quante) {
    cout << "Studente " << numero << " " << esito(quante) << endl;
}

int main() {
    int studenti, materie;
    cout << "Quanti studenti? ";
    cin >> studenti;
    cout << "Quante materie? ";
    cin >> materie;
    int ammessi = 0;
    for (int numero = 1; numero <= studenti; numero++) {
        int quante = insufficienze(materie);
        stampa_riga(numero, quante);
        if (quante == 0) {
            ammessi = ammessi + 1;
        }
    }
    cout << "Ammessi: " << ammessi << " su " << studenti << endl;
    return 0;
}
```

Il programma principale è identico a quello di prima: riempire le funzioni non lo ha toccato. Esegui con $2$ studenti e $3$ materie, dando al primo i voti $7$, $6$, $8$ e al secondo $5$, $11$, $4$, $7$: l'$11$ viene rifiutato e richiesto, e il programma scrive `Studente 1 ammesso`, `Studente 2 giudizio sospeso` e `Ammessi: 1 su 2`.

Il guadagno si vede quando il problema cambia. Se la scuola decide che il giudizio sospeso vale fino a due insufficienze, la modifica sta in una riga di `esito`, e niente altro va riletto. Prova: con i voti $5$, $4$, $5$ lo studente deve passare da giudizio sospeso a non ammesso.

```ad-warning
Scrivere tutto e provare alla fine
Cinque funzioni scritte di fila e mai eseguite contengono quasi sempre più di un errore, e quando il programma finalmente parte non sai in quale cercare. Una funzione alla volta, con un'esecuzione dopo ciascuna, l'errore è sempre nelle ultime righe scritte.
```

## Prova tu

Un cinema fa pagare $5$ euro a chi ha meno di $12$ anni, $6$ euro a chi ne ha più di $65$ e $9$ euro a tutti gli altri. Il programma legge quante persone ci sono in un gruppo e poi l'età di ciascuna, una per riga, e scrive quanto paga il gruppo. Il programma principale è scritto, e la funzione `prezzo` è ancora vuota: riempila.

```codice python
def prezzo(eta):
    # funzione ancora vuota: scrivi qui
    return 0

persone = int(input())
totale = 0
for i in range(1, persone + 1):
    totale = totale + prezzo(int(input()))
print(totale)
%% soluzione
def prezzo(eta):
    if eta < 12:
        return 5
    elif eta > 65:
        return 6
    else:
        return 9

persone = int(input())
totale = 0
for i in range(1, persone + 1):
    totale = totale + prezzo(int(input()))
print(totale)
%% prova
3
10
40
70
%% stampa
20
%% prova
4
12
65
11
66
%% stampa
29
```

```codice cpp
#include <iostream>
using namespace std;

int prezzo(int eta) {
    // funzione ancora vuota: scrivi qui
    return 0;
}

int main() {
    int persone, eta;
    cin >> persone;
    int totale = 0;
    for (int i = 1; i <= persone; i++) {
        cin >> eta;
        totale = totale + prezzo(eta);
    }
    cout << totale << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int prezzo(int eta) {
    if (eta < 12) {
        return 5;
    } else if (eta > 65) {
        return 6;
    } else {
        return 9;
    }
}

int main() {
    int persone, eta;
    cin >> persone;
    int totale = 0;
    for (int i = 1; i <= persone; i++) {
        cin >> eta;
        totale = totale + prezzo(eta);
    }
    cout << totale << endl;
    return 0;
}
```

Nel secondo esercizio la scomposizione è tua. A una gara di corsa ogni atleta fa due prove, e conta il tempo migliore, cioè il più basso; si qualifica chi ha il tempo migliore sotto i $60$ secondi. Il programma legge il numero degli atleti e poi, per ciascuno, i due tempi in secondi, uno per riga. Per ogni atleta scrive il suo tempo migliore, e alla fine quanti atleti si sono qualificati. Disegna prima l'albero su un foglio, poi scrivi una funzione per sottoproblema: `migliore(a, b)`, che restituisce il più basso dei due tempi, e `qualificato(tempo)`, che restituisce vero o falso.

```codice python
atleti = int(input())
# scrivi qui le funzioni (sopra) e il programma principale
%% soluzione
def migliore(a, b):
    if a < b:
        return a
    return b

def qualificato(tempo):
    return tempo < 60

atleti = int(input())
quanti = 0
for i in range(1, atleti + 1):
    tempo = migliore(int(input()), int(input()))
    print(tempo)
    if qualificato(tempo):
        quanti = quanti + 1
print(quanti)
%% prova
3
62
58
70
61
59
60
%% stampa
58
61
59
2
%% prova
1
60
75
%% stampa
60
0
```

```codice cpp
#include <iostream>
using namespace std;

// scrivi qui le funzioni

int main() {
    int atleti;
    cin >> atleti;
    // scrivi qui il programma principale
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int migliore(int a, int b) {
    if (a < b) {
        return a;
    }
    return b;
}

bool qualificato(int tempo) {
    return tempo < 60;
}

int main() {
    int atleti;
    cin >> atleti;
    int quanti = 0;
    for (int i = 1; i <= atleti; i++) {
        int a, b;
        cin >> a;
        cin >> b;
        int tempo = migliore(a, b);
        cout << tempo << endl;
        if (qualificato(tempo)) {
            quanti = quanti + 1;
        }
    }
    cout << quanti << endl;
    return 0;
}
```
