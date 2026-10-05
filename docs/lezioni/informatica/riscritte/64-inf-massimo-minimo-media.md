# Massimo, minimo e media di una sequenza

Il registro elettronico ti mostra il voto più alto, il più basso e la media di una materia; un'app del meteo fa lo stesso con le temperature della settimana. Un programma calcola questi tre numeri leggendo i dati uno alla volta, senza conservarli: gli bastano poche variabili che riassumono quello che ha visto fino a quel momento. Una **sequenza** è proprio questo, una fila di dati dello stesso tipo che arrivano uno dopo l'altro.

## Il massimo è il più grande visto finora

Per trovare il più alto in una fila di persone che ti passano davanti una alla volta, tieni a mente il più alto che hai visto e lo confronti con chi arriva: se il nuovo arrivato lo supera, da quel momento ricordi lui. Il programma fa così con la variabile `massimo`. Quando ha letto un solo dato, il più grande visto finora è quel dato: per questo `massimo` parte dal primo valore della sequenza, e il ciclo si occupa degli altri.

Il programma legge quante temperature sono state misurate, poi le temperature in gradi, e scrive la più alta. La prima viene letta prima del ciclo, che quindi comincia dalla seconda e fa $n - 1$ giri; il numero $n$ deve essere almeno $1$.

```diagramma
% nome: diagramma-flusso-massimo-di-n-valori
% alt: Diagramma di flusso: dopo l'inizio si legge n, poi si legge gradi e massimo prende il valore di gradi; i prende 2; un rombo chiede se i è minore o uguale a n; il ramo sì scende a leggi gradi e a un secondo rombo che chiede se gradi è maggiore di massimo, con il ramo sì che porta a massimo prende gradi; poi i prende i più 1 e una freccia risale sopra il primo rombo; il ramo no del primo rombo scende a scrivi massimo e alla fine
% ingresso: 4, -3, -7, -1, -5
leggi n
leggi gradi
massimo = gradi
i = 2
finché i <= n
    leggi gradi
    se gradi > massimo
        massimo = gradi
    i = i + 1
scrivi massimo
```

Esegui il diagramma con "Passo". I valori proposti sono quattro temperature di una settimana d'inverno, $-3$, $-7$, $-1$ e $-5$: nella tabella delle variabili `gradi` cambia a ogni lettura, `massimo` solo quando il secondo rombo risponde sì. È quello che dice la tabella di traccia.

| Dato letto | `gradi` | `gradi > massimo` | `massimo` dopo |
|---|---|---|---|
| primo, prima del ciclo | $-3$ | nessun confronto | $-3$ |
| secondo | $-7$ | $-7 > -3$ è falso | $-3$ |
| terzo | $-1$ | $-1 > -3$ è vero | $-1$ |
| quarto | $-5$ | $-5 > -1$ è falso | $-1$ |

```codice python
n = int(input("Quante temperature? "))
gradi = int(input("Gradi: "))
massimo = gradi
for i in range(2, n + 1):
    gradi = int(input("Gradi: "))
    if gradi > massimo:
        massimo = gradi
print("Temperatura massima:", massimo)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n, gradi;
    cout << "Quante temperature? ";
    cin >> n;
    cout << "Gradi: ";
    cin >> gradi;
    int massimo = gradi;
    for (int i = 2; i <= n; i++) {
        cout << "Gradi: ";
        cin >> gradi;
        if (gradi > massimo) {
            massimo = gradi;
        }
    }
    cout << "Temperatura massima: " << massimo << endl;
    return 0;
}
```

```ad-warning
Partire da 0 al posto del primo dato
Viene spontaneo scrivere `massimo = 0`, come per un [contatore o un accumulatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori). Provalo con le quattro temperature di prima: nessuna supera $0$, `massimo` non cambia mai e il programma scrive $0$, una temperatura che nessuno ha misurato. Lo zero funziona solo quando almeno un dato è positivo, e tu i dati non li conosci in anticipo. Il primo dato funziona sempre, perché è un valore della sequenza.
```

## Il minimo si trova allo stesso modo

Per il **minimo**, il valore più piccolo della sequenza, cambia solo il verso del confronto: il dato nuovo prende il posto di `minimo` quando è più piccolo. Nel programma qui sopra cambia `>` in `<` e il nome della variabile, ed eseguilo con gli stessi dati: deve uscire $-7$. Con il minimo l'errore dello zero è ancora più frequente, perché si vede con i dati più comuni: se `minimo` parte da $0$ e i dati sono voti, tutti positivi, nessuno è più piccolo di $0$ e il risultato è sempre $0$.

## Quando non sai quanti sono i dati

Finora la sequenza aveva una lunghezza nota: prima arriva il numero $n$, poi $n$ dati. L'altro modo, che hai incontrato nel [ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while), è chiudere la sequenza con un **valore di fine**: un valore che non può essere un dato e che significa "ho finito". Per i voti va bene lo $0$, che nessuno prende; per le temperature no, perché $0$ gradi è una temperatura vera.

Il programma legge dei voti chiusi da uno $0$ e scrive il più basso. Lo schema è quello di prima: il primo voto si legge prima del ciclo e dà a `minimo` il valore di partenza.

```codice python
voto = int(input("Voto (0 per finire): "))
minimo = voto
while voto != 0:
    if voto < minimo:
        minimo = voto
    voto = int(input("Voto (0 per finire): "))
print("Voto più basso:", minimo)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int voto;
    cout << "Voto (0 per finire): ";
    cin >> voto;
    int minimo = voto;
    while (voto != 0) {
        if (voto < minimo) {
            minimo = voto;
        }
        cout << "Voto (0 per finire): ";
        cin >> voto;
    }
    cout << "Voto più basso: " << minimo << endl;
    return 0;
}
```

Esegui con $6$, $8$, $5$, $7$, $0$: esce $5$. La lettura sta in fondo al corpo, così il valore appena letto passa dal controllo della condizione prima di essere confrontato: quando arriva lo $0$ il ciclo finisce e lo $0$ non entra nei confronti.

```ad-warning
Il valore di fine non è un dato
Se sposti la lettura in cima al corpo, prima della selezione, lo $0$ che chiude la sequenza viene confrontato come un voto qualunque e diventa il minimo. Il valore di fine serve solo a fermare il ciclo: non si confronta, non si conta e non si somma.
```

Massimo e minimo si possono cercare nello stesso ciclo, con due variabili e due selezioni una dopo l'altra. Aggiungi al programma la variabile `massimo`: parte anche lei dal primo voto, e la sua selezione sta accanto a quella del minimo, senza `else`, perché sono due domande separate e un voto può non essere né il nuovo massimo né il nuovo minimo. Con i voti di prima deve uscire $8$.

## La media: una somma e un conto

La media di una sequenza di numeri è la loro somma divisa per quanti sono, come nella lezione di matematica [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda). Servono quindi un accumulatore per la somma e un contatore per il numero dei dati, tutti e due aggiornati nello stesso giro. La divisione si fa una volta sola, dopo il ciclo.

```codice python
somma = 0
quanti = 0
voto = int(input("Voto (0 per finire): "))
while voto != 0:
    somma = somma + voto
    quanti = quanti + 1
    voto = int(input("Voto (0 per finire): "))
if quanti > 0:
    print("Media:", somma / quanti)
else:
    print("Nessun voto")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    double somma = 0;
    int quanti = 0;
    int voto;
    cout << "Voto (0 per finire): ";
    cin >> voto;
    while (voto != 0) {
        somma = somma + voto;
        quanti = quanti + 1;
        cout << "Voto (0 per finire): ";
        cin >> voto;
    }
    if (quanti > 0) {
        cout << "Media: " << somma / quanti << endl;
    } else {
        cout << "Nessun voto" << endl;
    }
    return 0;
}
```

```ad-note
La divisione della media in Python e in C++
Con i voti $7$ e $8$ la somma è $15$ e la media $7{,}5$. In Python `/` dà sempre un numero con la virgola: `15 / 2` fa `7.5`. In C++ la divisione tra due `int` butta via i decimali, e `15 / 2` fa `7`: per questo nel programma C++ la somma è dichiarata `double`, e la divisione tra un `double` e un `int` tiene i decimali. Cambia `double somma` in `int somma` ed esegui di nuovo: la media diventa $7$, senza nessun avviso. Cambia anche il modo di scrivere una media intera: con $6$ e $8$ Python scrive `7.0`, il C++ scrive `7`.
```

Senza la selezione finale, una sequenza vuota porta a dividere per zero. Se il primo valore scritto è lo $0$, il ciclo non fa nessun giro, `quanti` resta $0$ e la media sarebbe $0 : 0$, che non esiste. Togli la selezione e prova: Python si ferma con l'errore `ZeroDivisionError`; il programma C++ scrive `nan`, che sta per "not a number", cioè "non è un numero", e con una divisione tra interi si ferma con un errore.

```ad-warning
La media calcolata dentro il ciclo
La divisione va dopo il ciclo, quando somma e conto sono completi. Chi la mette nel corpo fa un conto inutile a ogni giro; chi prova a correggere la media a ogni dato con `media = (media + voto) / 2` ottiene un numero sbagliato appena i dati sono più di due: con $6$, $6$ e $9$ la media è $7$, quel conto dà $7{,}5$.
```

Con la lunghezza nota o con il valore di fine, il programma tiene in memoria un dato alla volta, e di quelli già passati restano solo il massimo, il minimo, la somma e il conto. Quando i dati servono ancora dopo averli letti, per esempio per dire quanti voti stanno sopra la media, bisogna conservarli tutti: lo farai con i vettori, al terzo anno.

## Prova tu

Il programma legge un numero intero $n$, almeno $1$, e poi $n$ temperature intere, una per riga. Scrivi le istruzioni che trovano la temperatura minima. Le temperature possono essere tutte positive o tutte negative.

```codice python
n = int(input())
gradi = int(input())
# scrivi qui il valore di partenza di minimo e il ciclo

print(minimo)
%% soluzione
n = int(input())
gradi = int(input())
minimo = gradi
for i in range(2, n + 1):
    gradi = int(input())
    if gradi < minimo:
        minimo = gradi

print(minimo)
%% prova
4
12
9
15
11
%% stampa
9
%% prova
3
-4
-10
-2
%% stampa
-10
%% prova
5
3
0
-1
8
-1
%% stampa
-1
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n, gradi;
    cin >> n;
    cin >> gradi;
    // scrivi qui il valore di partenza di minimo e il ciclo

    cout << minimo << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n, gradi;
    cin >> n;
    cin >> gradi;
    int minimo = gradi;
    for (int i = 2; i <= n; i++) {
        cin >> gradi;
        if (gradi < minimo) {
            minimo = gradi;
        }
    }

    cout << minimo << endl;
    return 0;
}
```

Nel secondo esercizio la media riguarda solo una parte dei dati. Il programma legge un numero intero $n$ e poi $n$ voti interi: deve stampare la media dei soli voti sufficienti, cioè almeno $6$, oppure la frase `nessun voto sufficiente` quando non ce ne sono. Il numero per cui dividere non è $n$: ti serve un contatore.

```codice python
n = int(input())
somma = 0
quanti = 0
# scrivi qui il ciclo e la stampa
%% soluzione
n = int(input())
somma = 0
quanti = 0
for i in range(1, n + 1):
    voto = int(input())
    if voto >= 6:
        somma = somma + voto
        quanti = quanti + 1
if quanti > 0:
    print(somma / quanti)
else:
    print("nessun voto sufficiente")
%% prova
4
7
5
8
4
%% stampa
7.5
%% prova
3
4
5
3
%% stampa
nessun voto sufficiente
%% prova
5
6
7
9
2
7
%% stampa
7.25
%% prova
0
%% stampa
nessun voto sufficiente
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    double somma = 0;
    int quanti = 0;
    // scrivi qui il ciclo e la stampa

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    double somma = 0;
    int quanti = 0;
    for (int i = 1; i <= n; i++) {
        int voto;
        cin >> voto;
        if (voto >= 6) {
            somma = somma + voto;
            quanti = quanti + 1;
        }
    }
    if (quanti > 0) {
        cout << somma / quanti << endl;
    } else {
        cout << "nessun voto sufficiente" << endl;
    }

    return 0;
}
```
