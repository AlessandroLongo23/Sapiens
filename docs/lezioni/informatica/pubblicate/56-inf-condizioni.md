# Condizioni e operatori di confronto

Il registro elettronico scrive in rosso i voti sotto il $6$, un videogioco ti vende la spada solo se hai abbastanza monete, la biglietteria di un concerto controlla che tu abbia almeno $18$ anni. Dietro ognuno di questi comportamenti c'è un confronto tra due valori, a cui si risponde sì oppure no. Prima di insegnare a un programma a scegliere bisogna saper scrivere la domanda, e sapere che cosa risponde il computer.

## Una condizione vale vero o falso

Un'espressione come `3 + 4` ha un valore, $7$, che il computer calcola (ne parla la lezione [Operatori ed espressioni](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/operatori-ed-espressioni)). Anche `3 < 4` è un'espressione e anche lei ha un valore, che però non è un numero: è vero. Una **condizione** è un'espressione il cui valore è vero oppure falso. Quale dei due dipende dai valori che le variabili hanno in quel momento: con `voto` che vale $7$ la condizione `voto >= 6` è vera, con `voto` che vale $4$ la stessa condizione è falsa.

Il programma qui sotto calcola tre condizioni sullo stesso voto e scrive il valore di ognuna.

```codice python
voto = 7
print(voto >= 6)
print(voto == 10)
print(voto != 7)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int voto = 7;
    cout << (voto >= 6) << endl;
    cout << (voto == 10) << endl;
    cout << (voto != 7) << endl;
    return 0;
}
```

Le risposte sono vero, falso, falso. Cambia il $7$ in $10$ e decidi quali delle tre risposte cambiano, poi esegui per controllare.

```ad-note
Come i due linguaggi scrivono vero e falso
Python scrive `True` e `False`. Il C++ scrive `1` per vero e `0` per falso; se prima delle altre scritte aggiungi la riga `cout << boolalpha;`, scrive `true` e `false`. In C++, inoltre, una condizione dentro `cout` va tra parentesi: `cout << voto >= 6` non compila, perché `<<` viene eseguito prima di `>=`.
```

## I sei operatori di confronto

Gli **operatori di confronto** mettono a confronto due valori e danno vero o falso. Sono sei, e si scrivono allo stesso modo in Python e in C++.

| Operatore | Si legge | Una condizione vera | Una condizione falsa |
|---|---|---|---|
| `==` | uguale a | `5 == 5` | `5 == 3` |
| `!=` | diverso da | `5 != 3` | `5 != 5` |
| `<` | minore di | `3 < 5` | `5 < 5` |
| `<=` | minore o uguale a | `5 <= 5` | `6 <= 5` |
| `>` | maggiore di | `5 > 3` | `3 > 5` |
| `>=` | maggiore o uguale a | `5 >= 5` | `3 >= 5` |

I simboli $\leq$, $\geq$ e $\neq$ della matematica non stanno sulla tastiera, e per questo tre operatori si scrivono con due caratteri. Tra `<` e `<=` la differenza si vede solo sul valore di confine: `5 < 5` è falsa, `5 <= 5` è vera. Quando traduci una frase in una condizione cerca le parole che decidono il confine: "almeno $18$ anni" è `eta >= 18`, "più di $18$ anni" è `eta > 18`, "al massimo $10$" è `voto <= 10`.

```ad-warning
L'uguale va per secondo
`=<` e `=>` non esistono: l'operatore si scrive nell'ordine in cui si legge, "minore o uguale", quindi `<=`. Nel foglio di calcolo "diverso" si scrive `<>`; in Python e in C++ si scrive `!=`, e `<>` è un errore.
```

Nei [diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso) una condizione sta dentro un rombo, il blocco da cui escono due frecce, una per il sì e una per il no.

```diagramma
% nome: diagramma-flusso-condizione-maggiorenne
% alt: Diagramma di flusso con una condizione: dopo l'inizio si legge eta; un rombo chiede se eta è maggiore o uguale a 18; il ramo sì porta a scrivere "maggiorenne", il ramo no a scrivere "minorenne"; i due rami si riuniscono alla fine
% ingresso: 18
% codice: no
leggi eta
se eta >= 18
    scrivi "maggiorenne"
altrimenti
    scrivi "minorenne"
```

Esegui il diagramma un blocco alla volta con $18$, poi con $17$ e con $30$. Arrivato al rombo, la frase accanto riscrive la condizione con il numero al posto del nome e dice se è vera o falsa: è lo stesso calcolo che in un programma fa `eta >= 18`. Come si scrivono i due rami in Python e in C++ è l'argomento della prossima lezione, [La selezione a due vie](/materiale/scuola-superiore/informatica/la-selezione/la-selezione-a-due-vie).

## Il tipo booleano

Vero e falso sono valori, come $7$ o `"Giulia"`, e hanno un tipo tutto loro: il tipo **booleano**, che nei due linguaggi si chiama `bool` e che hai già trovato tra i tipi di base nella lezione [Variabili, assegnamento e tipi di dato](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/variabili-assegnamento-e-tipi-di-dato). Ha due soli valori, che si scrivono `True` e `False` in Python, con l'iniziale maiuscola, e `true` e `false` in C++, tutto in minuscolo.

Il valore di una condizione si può quindi mettere in una variabile, per usarlo più avanti senza rifare il confronto. A una variabile booleana si dà di solito il nome di una domanda a cui si risponde sì o no: `maggiorenne`, `promosso`, `trovato`.

```diagramma
% nome: diagramma-flusso-variabile-booleana
% alt: Diagramma di flusso in sequenza: dopo l'inizio si legge eta, poi un rettangolo assegna a maggiorenne il valore della condizione eta maggiore o uguale a 18, poi si scrive maggiorenne e si arriva alla fine
% ingresso: 16
leggi eta
maggiorenne = eta >= 18
scrivi maggiorenne
```

```codice python
eta = int(input("Età: "))
maggiorenne = eta >= 18
print(maggiorenne)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int eta;
    cout << "Età: ";
    cin >> eta;
    bool maggiorenne = eta >= 18;
    cout << maggiorenne << endl;
    return 0;
}
```

Esegui il diagramma con $16$ e guarda la tabella delle variabili: dopo il rettangolo `maggiorenne` vale falso. Nel rettangolo, come nella riga del programma che gli corrisponde, le operazioni sono due: prima si calcola il confronto che sta a destra, poi il suo valore va nella variabile di sinistra.

## Un solo `=` assegna, due confrontano

In matematica il segno $=$ fa due mestieri, e nei programmi li fanno due segni diversi. `a = b` è un assegnamento: copia in `a` il valore di `b`, e dopo `a` è cambiata. `a == b` è un confronto: chiede se i due valori sono uguali, risponde vero o falso e non cambia niente. Nella riga `uguali = a == b` ci sono tutti e due: il confronto `a == b` dà un valore booleano, e l'assegnamento lo mette nella variabile `uguali`.

```ad-warning
Scrivere = dove serve ==
In Python `print(a = b)` è un errore e il programma si ferma. In C++ `cout << (a = b)` viene accettato, ed è peggio: copia `b` in `a` e scrive quel valore, senza confrontare niente.
```

## Numeri con la virgola: niente `==`

Sulla carta $0{,}1 + 0{,}2 = 0{,}3$. Il programma chiede al computer se è d'accordo.

```codice python
a = 0.1 + 0.2
print(a == 0.3)
print(a)
print(abs(a - 0.3) < 0.000001)
```

```codice cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a = 0.1 + 0.2;
    cout << (a == 0.3) << endl;
    cout << a << endl;
    cout << (fabs(a - 0.3) < 0.000001) << endl;
    return 0;
}
```

La prima risposta è falso. I numeri con la virgola stanno in memoria in binario, con un numero finito di cifre, e $0{,}1$ in base due di cifre ne ha infinite (lo hai visto in [Numeri reali in virgola mobile](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-reali-in-virgola-mobile)): quello che il computer conserva è un valore vicinissimo a $0{,}1$, non proprio $0{,}1$. La somma si porta dietro questi piccoli errori, e `==`, che pretende due valori identici, dà falso.

Per questo due numeri con la virgola non si confrontano con `==`: si chiede se la loro distanza, cioè il valore assoluto della differenza, è più piccola di una soglia scelta da te, qui un milionesimo. È il confronto della terza riga, che dà vero. Con `<` e `>` il problema si presenta solo quando i due numeri sono quasi uguali.

```ad-note
Che cosa scrivono i due linguaggi
La seconda riga in Python scrive `0.30000000000000004` e fa vedere l'errore; il C++ scrive `0.3`, perché `cout` arrotonda a sei cifre, ma in memoria il valore è lo stesso e il confronto dà falso anche lì. Il valore assoluto si chiama `abs` in Python e `fabs` in C++, dove chiede la riga `#include <cmath>`.
```

## Confrontare due testi

Tra due testi `==` dà vero solo se hanno gli stessi caratteri nello stesso ordine. Maiuscole e minuscole sono caratteri diversi, quindi `"Anna" == "anna"` è falsa, e conta anche uno spazio in più in fondo.

Con `<` e `>` i testi si confrontano come le parole nel dizionario, un carattere alla volta a partire dal primo: `"cane" < "casa"` è vera, perché le prime due lettere sono uguali e alla terza la n viene prima della s. L'ordine dei caratteri però è quello dei loro codici, che conosci da [La codifica dei caratteri: ASCII e Unicode](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode): tutte le maiuscole vengono prima di tutte le minuscole, e così `"Zebra" < "ape"` è vera. Per lo stesso motivo `"10" < "9"` è vera, perché tra testi si guarda il primo carattere e la cifra 1 viene prima della cifra 9, mentre tra numeri `10 < 9` è falsa.

```codice python
parola = input("Parola d'ordine: ")
print(parola == "sesamo")
print(parola < "sesamo")
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string parola;
    cout << "Parola d'ordine: ";
    cin >> parola;
    cout << (parola == "sesamo") << endl;
    cout << (parola < "sesamo") << endl;
    return 0;
}
```

Eseguilo con "sesamo", con "Sesamo" e con "zucca", e prima di ogni prova decidi che cosa scriveranno le due righe.

```ad-warning
Un numero e un testo non sono mai uguali
In Python quello che arriva da `input()` è un testo. Con `eta = input()` la condizione `eta == 18` è falsa anche se hai scritto 18, perché confronta il testo `"18"` con il numero $18$: serve `eta = int(input())`. In C++ un confronto tra una variabile `int` e un testo tra virgolette non compila.
```

```ad-note
In C++ serve una variabile string
In C++ `==` e `<` guardano i caratteri quando almeno uno dei due testi è una variabile di tipo `string`, come `parola`. Tra due testi scritti tutti e due tra virgolette, come in `"ape" < "zebra"`, il C++ non confronta le lettere e il risultato non vuol dire niente.
```

## Prova tu

In questi esercizi l'ultima riga del programma scrive $1$ quando la variabile booleana è vera e $0$ quando è falsa, nello stesso modo nei due linguaggi (in Python `int(...)` trasforma `True` in $1$ e `False` in $0$): non va toccata.

Il primo programma legge due numeri interi, i punti della tua partita e il record da battere. La variabile `nuovo_record` deve essere vera quando i punti superano il record; pareggiarlo non conta. Nel programma di partenza è sempre falsa: scrivi la condizione al posto giusto.

```codice python
punti = int(input())
record = int(input())
# scrivi la condizione al posto di False
nuovo_record = False

print(int(nuovo_record))
%% soluzione
punti = int(input())
record = int(input())
nuovo_record = punti > record

print(int(nuovo_record))
%% prova
120
100
%% stampa
1
%% prova
80
100
%% stampa
0
%% prova
100
100
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int punti, record;
    cin >> punti >> record;
    // scrivi la condizione al posto di false
    bool nuovo_record = false;

    cout << nuovo_record << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int punti, record;
    cin >> punti >> record;
    bool nuovo_record = punti > record;

    cout << nuovo_record << endl;
    return 0;
}
```

Il secondo programma controlla uno scontrino: legge tre numeri con la virgola, cioè due prezzi e il totale stampato, e mette in `giusto` il valore vero quando la somma dei due prezzi è uguale al totale. Quello di partenza usa `==` e con $0{,}1$, $0{,}2$ e $0{,}3$ risponde che lo scontrino è sbagliato. Correggi la condizione: i due valori vanno considerati uguali quando la loro distanza è minore di un millesimo, `0.001`.

```codice python
a = float(input())
b = float(input())
totale = float(input())
giusto = a + b == totale

print(int(giusto))
%% soluzione
a = float(input())
b = float(input())
totale = float(input())
giusto = abs(a + b - totale) < 0.001

print(int(giusto))
%% prova
0.1
0.2
0.3
%% stampa
1
%% prova
1.5
2.25
3.75
%% stampa
1
%% prova
2.5
2.5
5.1
%% stampa
0
%% prova
0.7
0.1
0.8
%% stampa
1
```

```codice cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, totale;
    cin >> a >> b >> totale;
    bool giusto = a + b == totale;

    cout << giusto << endl;
    return 0;
}
%% soluzione
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double a, b, totale;
    cin >> a >> b >> totale;
    bool giusto = fabs(a + b - totale) < 0.001;

    cout << giusto << endl;
    return 0;
}
```

Una condizione da sola confronta due valori. Per chiedere due cose insieme, come "almeno $6$ e al massimo $10$", le condizioni si uniscono con [gli operatori logici](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici).
