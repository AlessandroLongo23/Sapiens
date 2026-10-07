# Definire e chiamare una funzione

Il programma che stampa la classifica del torneo di calcetto della scuola separa le sue parti con una riga di trattini, una sotto il titolo e una sotto le squadre. La stessa istruzione è scritta in due punti: il giorno in cui vuoi la riga più lunga, o fatta di asterischi, la devi correggere in tutti e due. Con un'istruzione sola è una seccatura; quando il pezzo ripetuto è lungo dieci righe e compare in cinque punti, prima o poi una delle copie resta diversa dalle altre.

Una **funzione** è un pezzo di programma con un nome: lo scrivi una volta sola, e lo fai eseguire tutte le volte che serve scrivendo il suo nome. Il testo di una canzone fa lo stesso con il ritornello, che è stampato per intero una volta, mentre dopo ogni strofa c'è scritto solo "ritornello".

## Definire una funzione e chiamarla

Con una funzione si fanno due cose distinte. **Definire** la funzione vuol dire scriverla: le dai un nome e scrivi le istruzioni che la compongono, il **corpo** della funzione. **Chiamare** la funzione vuol dire farla eseguire, e si fa scrivendo il nome seguito da una coppia di parentesi tonde, `linea()`.

Nel programma della classifica la funzione `linea` ha un corpo di una sola istruzione, che scrive i trattini, e viene chiamata due volte.

```codice python
def linea():
    print("------------")

print("Classifica")
linea()
print("1. Tigri 12")
print("2. Lupi 9")
linea()
print("Fine")
```

```codice cpp
#include <iostream>
using namespace std;

void linea() {
    cout << "------------" << endl;
}

int main() {
    cout << "Classifica" << endl;
    linea();
    cout << "1. Tigri 12" << endl;
    cout << "2. Lupi 9" << endl;
    linea();
    cout << "Fine" << endl;
    return 0;
}
```

Esegui il programma: i trattini compaiono due volte, anche se l'istruzione che li scrive c'è una volta sola. Cambia i trattini in asterischi dentro il corpo ed esegui di nuovo: con una sola correzione cambiano tutte e due le righe. Poi aggiungi una terza chiamata in fondo, dopo la parola Fine.

```ad-note
La definizione nei due linguaggi
In Python la definizione comincia con `def`, poi il nome, le parentesi e i due punti; il corpo è rientrato di quattro spazi, come quello di un ciclo, e finisce dove finisce il rientro. In C++ comincia con `void`, che vuol dire "non restituisce niente" (di che cosa una funzione possa restituire parla la [lezione successiva](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno)), e il corpo sta tra le parentesi graffe. In C++ una funzione la scrivi dal primo programma: `main` è la funzione da cui l'esecuzione comincia, e le tue si definiscono fuori da `main`, prima.
```

Il nome di una funzione segue le regole dei nomi delle variabili: lettere minuscole, niente spazi e niente accenti. Sceglilo in modo che dica che cosa fa la funzione, come `linea`, `titolo` o `saluta`, perché chi legge la chiamata deve capire che cosa succede senza andare a cercare il corpo.

```ad-warning
La funzione definita e mai chiamata
Definire una funzione non la esegue. Cancella le due chiamate ed esegui: il programma scrive il titolo, le squadre e la parola Fine, nessun trattino, e non segnala errori. La definizione dice che cosa fare quando la funzione verrà chiamata; se nessuno la chiama, il corpo non viene mai eseguito.
```

## Il flusso salta alla funzione e torna

Finora le istruzioni di un programma venivano eseguite dall'alto verso il basso, con le selezioni che ne saltano alcune e i cicli che tornano indietro. Con una funzione l'ordine in cui le righe sono scritte e l'ordine in cui vengono eseguite non coincidono più. Resta da capire qual è il secondo, e da quale riga riprende il programma quando la funzione ha finito.

```interattivo
% nome: inf-definire-funzione-passi
% alt: Il programma della classifica con la funzione linea, eseguito un passo alla volta in Python o in C++: la riga in esecuzione è accesa, accanto ci sono i riquadri del programma principale e della funzione, uno in esecuzione e l'altro in attesa, e quello che il programma ha scritto sullo schermo. A ogni chiamata di linea la riga accesa salta al corpo della funzione, poi torna alla riga dopo la chiamata; il corpo viene eseguito due volte e alla fine sullo schermo ci sono sei righe.
```

Premi "Avanti" fino alla prima chiamata e guarda quale riga si accende subito dopo; continua fino alla seconda chiamata, e guarda da dove riparte il programma quando il corpo è finito.

A ogni chiamata succedono le stesse quattro cose. Il programma si ferma alla riga della chiamata; il flusso salta alla prima istruzione del corpo; il corpo viene eseguito fino in fondo; il flusso torna indietro e riprende dall'istruzione che segue la chiamata. La riga dei trattini viene eseguita due volte, e la seconda volta il flusso torna dopo la seconda chiamata, non dopo la prima: il programma ricorda da dove è partito. I due riquadri della figura dicono la stessa cosa: mentre `linea` è in esecuzione, chi l'ha chiamata è in attesa.

Per essere chiamata, una funzione deve essere già stata definita. Python esegue il programma dall'alto: quando incontra `def` impara il nome della funzione, e una chiamata scritta più in alto userebbe un nome che non conosce ancora. Il compilatore del C++ legge il file nello stesso verso, e quando arriva a una chiamata dentro `main` deve aver già incontrato la definizione.

```ad-warning
La chiamata prima della definizione
In Python sposta le due righe della definizione in fondo al programma: il titolo viene scritto, poi alla prima chiamata il programma si ferma con l'errore `NameError: name 'linea' is not defined`. In C++ sposta la definizione sotto `main`: il programma non viene nemmeno compilato, e l'errore dice che `linea` è un nome non dichiarato.
```

```ad-note
I prototipi del C++
In molti programmi C++ troverai, sopra `main`, una riga come `void linea();`, senza corpo e con il punto e virgola alla fine. È un prototipo: avvisa il compilatore che una funzione con quel nome esiste e che la sua definizione arriverà più avanti, anche sotto `main`. In queste lezioni le funzioni sono sempre definite prima di `main`, e il prototipo non serve.
```

```ad-warning
La chiamata senza parentesi
Le parentesi fanno parte della chiamata anche quando dentro non c'è niente. Togli le parentesi alla prima chiamata, lasciando `linea` in Python e `linea;` in C++: il programma parte, ma la prima riga di trattini non compare. Il nome da solo indica la funzione e non la fa eseguire.
```

## Un nome per ogni pezzo del programma

Il corpo di una funzione può contenere tutte le istruzioni che conosci, e un programma può definire tutte le funzioni che servono. Una chiamata, poi, è un'istruzione come le altre: può stare nel corpo di un ciclo o in un ramo di una selezione. Nel programma che segue le funzioni sono due, e `linea` è chiamata una volta da sola e tre volte dentro un [ciclo `for`](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for).

```codice python
def titolo():
    print("TORNEO DI CALCETTO")
    print("Classifica finale")

def linea():
    print("------------------")

titolo()
linea()
for i in range(1, 4):
    print("Posto numero", i)
    linea()
```

```codice cpp
#include <iostream>
using namespace std;

void titolo() {
    cout << "TORNEO DI CALCETTO" << endl;
    cout << "Classifica finale" << endl;
}

void linea() {
    cout << "------------------" << endl;
}

int main() {
    titolo();
    linea();
    for (int i = 1; i < 4; i++) {
        cout << "Posto numero " << i << endl;
        linea();
    }
    return 0;
}
```

Leggi solo la parte sotto le definizioni: un titolo, una linea, poi per tre volte un posto e una linea. Hai capito che cosa scrive il programma prima di aver letto un solo corpo, perché ogni pezzo ha un nome che lo dice. È il secondo motivo per usare le funzioni, e conta quanto il primo: un programma lungo, diviso in funzioni, si legge, si prova e si corregge un pezzo alla volta. Esegui e conta le linee, che sono quattro; poi cambia il $4$ del ciclo in $6$ e prevedi quante saranno prima di eseguire di nuovo.

## Le funzioni che usavi già

Le chiamate le scrivi dal [primo programma](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/il-primo-programma-input-e-output). In Python `print("Ciao")` e `input()` sono chiamate di funzioni, e si riconoscono dal nome seguito dalle parentesi; lo sono anche `int(...)` e `range(...)`. In C++ lo sono `pow(2, 10)`, che calcola una [potenza](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/operatori-ed-espressioni), e `sqrt(16)`, che calcola una radice quadrata. Queste funzioni le ha definite qualcun altro: fanno parte del linguaggio o delle sue librerie, e tu le chiami senza aver mai visto il loro corpo. Per usarle devi sapere tre cose: il nome, che cosa fanno e che cosa mettere tra le parentesi.

## Un dato tra le parentesi

Tra le parentesi di `print` metti quello che vuoi scrivere: è un dato che passi alla funzione, e la funzione lo usa. Anche le tue funzioni possono riceverne. La `linea` della classifica scrive sempre dodici trattini; per avere una riga lunga quanto vuoi, la definizione dichiara tra le parentesi un **parametro**, cioè una variabile che riceve il suo valore al momento della chiamata.

```codice python
def linea(n):
    for i in range(n):
        print("-", end="")
    print()

linea(5)
linea(12)
linea(20)
```

```codice cpp
#include <iostream>
using namespace std;

void linea(int n) {
    for (int i = 0; i < n; i++) {
        cout << "-";
    }
    cout << endl;
}

int main() {
    linea(5);
    linea(12);
    linea(20);
    return 0;
}
```

Alla chiamata `linea(5)` il parametro `n` vale $5$ e il corpo scrive cinque trattini, [senza andare a capo](/materiale/scuola-superiore/informatica/l-iterazione/cicli-annidati) fino all'ultimo; alla chiamata `linea(20)` lo stesso corpo ne scrive venti. Una definizione sola fa il lavoro di tre funzioni diverse. In C++ il parametro si dichiara con il suo tipo, `int n`. Aggiungi la chiamata `linea(3 * 10)` e poi `linea(0)`, e prima di eseguire prevedi che cosa scrivono. Come si passano più dati, e come una funzione fa avere un risultato a chi l'ha chiamata, lo spiega la lezione [Parametri e valore di ritorno](/materiale/scuola-superiore/informatica/le-funzioni/parametri-e-valore-di-ritorno).

## Prova tu

Il programma stampa la scaletta di un concerto: legge il numero $n$ delle canzoni e per ognuna scrive `Canzone` con il suo numero, e dopo ogni canzone il pubblico applaude. Il programma principale è già scritto e chiama la funzione `applauso`, che non esiste ancora. Definiscila tu: deve scrivere due righe, `Clap clap clap` e `Bravi!`.

```codice python
# definisci qui la funzione applauso

n = int(input())
for i in range(1, n + 1):
    print("Canzone", i)
    applauso()
%% soluzione
def applauso():
    print("Clap clap clap")
    print("Bravi!")

n = int(input())
for i in range(1, n + 1):
    print("Canzone", i)
    applauso()
%% prova
2
%% stampa
Canzone 1
Clap clap clap
Bravi!
Canzone 2
Clap clap clap
Bravi!
%% prova
1
%% stampa
Canzone 1
Clap clap clap
Bravi!
```

```codice cpp
#include <iostream>
using namespace std;

// definisci qui la funzione applauso

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << "Canzone " << i << endl;
        applauso();
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

void applauso() {
    cout << "Clap clap clap" << endl;
    cout << "Bravi!" << endl;
}

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cout << "Canzone " << i << endl;
        applauso();
    }
    return 0;
}
```

Nel secondo esercizio scrivi sia le definizioni sia le chiamate. Il programma legge un numero intero $n$ e disegna una scatola: il bordo di sopra, $n$ righe con i due lati, il bordo di sotto. Definisci la funzione `bordo`, che scrive `+------+`, e la funzione `lati`, che scrive `|      |` con sei spazi in mezzo; poi chiamale nel programma principale, `lati` dentro un ciclo. Con $n = 0$ la scatola è fatta dei soli due bordi.

```codice python
# definisci qui le funzioni bordo e lati

n = int(input())
# scrivi qui le chiamate
%% soluzione
def bordo():
    print("+------+")

def lati():
    print("|      |")

n = int(input())
bordo()
for i in range(n):
    lati()
bordo()
%% prova
2
%% stampa
+------+
|      |
|      |
+------+
%% prova
0
%% stampa
+------+
+------+
%% prova
4
%% stampa
+------+
|      |
|      |
|      |
|      |
+------+
```

```codice cpp
#include <iostream>
using namespace std;

// definisci qui le funzioni bordo e lati

int main() {
    int n;
    cin >> n;
    // scrivi qui le chiamate

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

void bordo() {
    cout << "+------+" << endl;
}

void lati() {
    cout << "|      |" << endl;
}

int main() {
    int n;
    cin >> n;
    bordo();
    for (int i = 0; i < n; i++) {
        lati();
    }
    bordo();

    return 0;
}
```
