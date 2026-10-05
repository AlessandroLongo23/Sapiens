# Il ciclo for

"Fai dieci flessioni" e "corri finché sei stanco" sono due ripetizioni diverse: nella prima il numero dei giri si sa prima di cominciare, nella seconda no. Per la seconda c'è il ciclo `while`. Per la prima i linguaggi hanno una scrittura più corta, il ciclo `for`, che tiene il conto dei giri da solo.

## Un ciclo che conta

Il ciclo `while` ripete un blocco di istruzioni, il corpo, finché una condizione è vera. Per stampare i numeri da $1$ a $5$ con un `while` serve una variabile che conta i giri, e bisogna occuparsene in tre punti diversi del programma: darle il valore di partenza prima del ciclo, confrontarla con il valore di arrivo nella condizione, aumentarla in fondo al corpo.

```codice python
i = 1
while i <= 5:
    print(i)
    i = i + 1
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int i = 1;
    while (i <= 5) {
        cout << i << endl;
        i = i + 1;
    }
    return 0;
}
```

La variabile `i` è il **contatore** del ciclo: parte da un valore, cambia della stessa quantità a ogni giro, e il ciclo finisce quando supera il valore di arrivo. Partenza, arrivo e passo sono tre righe lontane tra loro, e dimenticarne una è facile: senza `i = i + 1` il ciclo non finisce più.

Il ciclo `for` mette le tre cose in una riga sola. Questo programma fa esattamente quello che fa il precedente.

```codice python
for i in range(1, 6):
    print(i)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }
    return 0;
}
```

```ad-note
Che cosa cambia tra i due linguaggi
In Python `range(1, 6)` elenca i valori che `i` prende, da $1$ compreso a $6$ escluso, e il corpo è fatto dalle righe rientrate sotto i due punti. In C++ le tre parti stanno tra le parentesi, separate dal punto e virgola: `int i = 1` è la partenza, `i <= 5` è la condizione per fare un altro giro, `i++` è il passo, e vuol dire `i = i + 1`. Il corpo sta tra le graffe.
```

I due programmi hanno lo stesso diagramma di flusso, perché il computer fa gli stessi passi nello stesso ordine: cambia solo il modo di scriverli.

```diagramma
% nome: diagramma-flusso-contare-da-uno-a-cinque
% alt: Diagramma di flusso di un ciclo con contatore: dopo l'inizio, i prende il valore 1; un rombo chiede se i è minore o uguale a 5; il ramo sì scende a scrivi i e poi a i prende i più 1, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no esce a destra e scende alla fine
i = 1
finché i <= 5
    scrivi i
    i = i + 1
```

Nel `for` il passo non si vede dentro il corpo, ma viene eseguito lo stesso, dopo l'ultima istruzione del corpo e prima del nuovo controllo. Cambia il $6$ in $11$ in Python, o il $5$ in $10$ in C++, e i giri diventano dieci.

```ad-warning
I segni che si dimenticano
In Python la riga del `for` finisce con i due punti, e il corpo va rientrato: senza rientro il programma non parte. In C++ le tre parti dentro le parentesi si separano con il punto e virgola, non con la virgola, e dopo la parentesi chiusa il punto e virgola non va: con `for (int i = 1; i <= 5; i++);` il ciclo finisce a quel punto e virgola e gira cinque volte a vuoto, mentre il blocco tra le graffe resta fuori dal ciclo, dove `i` non esiste più, e il compilatore segnala un errore.
```

## I valori del contatore

In Python `range` si scrive in tre modi, secondo quanti numeri metti tra le parentesi. In tutti e tre il valore di arrivo è escluso: il contatore si ferma un passo prima.

| Python | C++ | Valori di `i` | Giri |
|---|---|---|---|
| `range(5)` | `for (int i = 0; i < 5; i++)` | $0, 1, 2, 3, 4$ | $5$ |
| `range(1, 6)` | `for (int i = 1; i < 6; i++)` | $1, 2, 3, 4, 5$ | $5$ |
| `range(0, 11, 2)` | `for (int i = 0; i < 11; i += 2)` | $0, 2, 4, 6, 8, 10$ | $6$ |
| `range(5, 0, -1)` | `for (int i = 5; i > 0; i--)` | $5, 4, 3, 2, 1$ | $5$ |

Con un numero solo, `range(n)` conta da $0$ a $n - 1$: i giri sono $n$, ed è il modo più usato per dire "ripeti $n$ volte". Con due numeri il primo è la partenza. Il terzo numero è il passo: $2$ per andare di due in due, $-1$ per contare all'indietro. In C++ il passo si scrive nella terza parte: `i += 2` vuol dire `i = i + 2`, e `i--` vuol dire `i = i - 1`.

Quando si conta all'indietro cambia anche il verso della condizione, perché il contatore scende: si fanno giri finché `i` è maggiore dell'arrivo. Il conto alla rovescia, che con il `while` occupava quattro righe, diventa così.

```codice python
for i in range(5, 0, -1):
    print(i)
print("Via!")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 5; i > 0; i--) {
        cout << i << endl;
    }
    cout << "Via!" << endl;
    return 0;
}
```

Prova a far partire il conto da $10$, poi a scendere di due in due. Poi scrivi un passo positivo lasciando il resto com'è, `range(5, 0, 1)` oppure `i++`: in Python il ciclo non fa nessun giro, perché salendo da $5$ non si arriva a $0$; in C++ la condizione `i > 0` resta vera e il ciclo va avanti finché l'editor non lo ferma.

```ad-warning
Un giro in più o in meno
È l'errore più comune con i cicli. `range(1, 5)` si ferma a $4$, non a $5$: per arrivare a $n$ compreso si scrive `range(1, n + 1)`. In C++ lo stesso sbaglio è `i < n` al posto di `i <= n`, o il contrario. Per controllare, chiediti qual è il primo valore del contatore e qual è l'ultimo, e conta i giri su un caso piccolo: da $1$ a $3$ devono essere tre.
```

## Un numero di giri deciso mentre il programma gira

"Noto in partenza" non vuol dire scritto nel programma: il numero dei giri deve essere noto quando il ciclo comincia. Questo programma legge $n$ e somma i numeri da $1$ a $n$: a ogni giro aggiunge a `s` il valore del contatore.

```diagramma
% nome: diagramma-flusso-somma-da-uno-a-n
% alt: Diagramma di flusso: dopo l'inizio si legge n, poi s prende il valore 0 e i prende il valore 1; un rombo chiede se i è minore o uguale a n; il ramo sì scende a s prende s più i e poi a i prende i più 1, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no esce a destra e scende a scrivi s e alla fine
% ingresso: 4
leggi n
s = 0
i = 1
finché i <= n
    s = s + i
    i = i + 1
scrivi s
```

```codice python
n = int(input("Fino a quale numero? "))
s = 0
for i in range(1, n + 1):
    s = s + i
print("Somma:", s)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Fino a quale numero? ";
    cin >> n;
    int s = 0;
    for (int i = 1; i <= n; i++) {
        s = s + i;
    }
    cout << "Somma: " << s << endl;
    return 0;
}
```

Questa è la tabella di traccia con $n = 4$: una riga per giro, con il valore del contatore e quello di `s` prima e dopo.

| Giro | `i` | `s` prima | `s` dopo |
|---|---|---|---|
| primo | $1$ | $0$ | $1$ |
| secondo | $2$ | $1$ | $3$ |
| terzo | $3$ | $3$ | $6$ |
| quarto | $4$ | $6$ | $10$ |

Dopo il quarto giro il contatore vale $5$, la condizione $i \leq n$ è falsa e il programma scrive $10$. Esegui con $100$, e poi con $0$: il ciclo non fa nessun giro e la somma resta $0$. Se togli il `+ 1` da `range(1, n + 1)`, o scrivi `i < n` in C++, con $4$ ottieni $6$: manca l'ultimo giro.

## Quando for e quando while

Tutto quello che fa un `for` si può scrivere con un `while`, come hai visto all'inizio. La scelta dipende da che cosa sai quando il ciclo comincia.

| | `for` | `while` |
|---|---|---|
| Numero dei giri | noto quando il ciclo comincia | dipende da quello che succede nel corpo |
| Che cosa scrivi | partenza, arrivo e passo del contatore | la condizione per continuare |
| Esempi | stampare una tabellina, sommare i numeri da $1$ a $n$, ripetere $n$ volte | leggere finché arriva uno $0$, dimezzare finché si resta sopra una soglia |

Se riesci a dire "per ogni valore da qui a lì", usa il `for`: il contatore è gestito in una riga e non puoi dimenticare di aggiornarlo. Se la frase che ti viene è "finché succede questo", usa il `while`.

```ad-tip
Il nome del contatore
Per abitudine il contatore si chiama `i`, e quando ne servono altri `j` e `k`. Se il suo valore ha un significato preciso, un nome che lo dice si legge meglio: `giorno`, `riga`.
```

## Prova tu

Il programma legge un numero intero $n$: scrivi il ciclo che stampa la tabellina di $n$, cioè i dieci prodotti $n \cdot 1$, $n \cdot 2$, fino a $n \cdot 10$, uno per riga. Si stampa solo il prodotto.

```codice python
n = int(input())
# scrivi qui il ciclo
%% soluzione
n = int(input())
for i in range(1, 11):
    print(n * i)
%% prova
7
%% stampa
7
14
21
28
35
42
49
56
63
70
%% prova
1
%% stampa
1
2
3
4
5
6
7
8
9
10
%% prova
12
%% stampa
12
24
36
48
60
72
84
96
108
120
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // scrivi qui il ciclo

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 10; i++) {
        cout << n * i << endl;
    }

    return 0;
}
```

Nel secondo esercizio servono il passo e l'attenzione all'ultimo valore. Il programma legge un numero intero $n$ e deve stampare la somma dei numeri dispari da $1$ a $n$, con $n$ compreso quando è dispari: con $7$ la somma è $1 + 3 + 5 + 7 = 16$, e con $8$ è ancora $16$.

```codice python
n = int(input())
s = 0
# scrivi qui il ciclo

print(s)
%% soluzione
n = int(input())
s = 0
for i in range(1, n + 1, 2):
    s = s + i

print(s)
%% prova
7
%% stampa
16
%% prova
8
%% stampa
16
%% prova
1
%% stampa
1
%% prova
0
%% stampa
0
%% prova
99
%% stampa
2500
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int s = 0;
    // scrivi qui il ciclo

    cout << s << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int s = 0;
    for (int i = 1; i <= n; i += 2) {
        s = s + i;
    }

    cout << s << endl;
    return 0;
}
```
