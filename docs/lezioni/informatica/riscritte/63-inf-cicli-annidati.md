# Cicli annidati

In un orologio digitale i minuti vanno da $00$ a $59$ e poi ricominciano, e solo quando hanno finito il loro giro l'ora aumenta di uno: per ogni ora, sessanta minuti. Un programma ottiene lo stesso effetto mettendo un ciclo dentro il corpo di un altro. Serve tutte le volte che i dati hanno due dimensioni: le righe e le colonne di una tabella, le file e i posti di un cinema, i giorni e le ore di un orario.

## Un ciclo dentro un altro

Due cicli sono **annidati** quando uno sta nel corpo dell'altro. Quello che contiene si chiama ciclo esterno, quello contenuto ciclo interno. A ogni giro del ciclo esterno, il ciclo interno viene eseguito tutto, dal primo all'ultimo dei suoi giri, e solo dopo comincia il giro esterno successivo.

Una sala ha $2$ file di $3$ posti. Il programma elenca tutti i posti: il ciclo esterno scorre le file con il contatore `i`, quello interno scorre i posti della fila con il contatore `j`, e il corpo interno scrive i due numeri.

```diagramma
% nome: diagramma-flusso-due-cicli-annidati
% alt: Diagramma di flusso con due cicli annidati: dopo l'inizio, i prende 1; un rombo chiede se i è minore o uguale a 2; il ramo sì scende a j prende 1 e a un secondo rombo che chiede se j è minore o uguale a 3; il ramo sì del secondo rombo scende a scrivi i, j e a j prende j più 1, da cui una freccia risale sopra il secondo rombo; il ramo no del secondo rombo scende a i prende i più 1, da cui una freccia risale sopra il primo rombo; il ramo no del primo rombo scende alla fine
i = 1
finché i <= 2
    j = 1
    finché j <= 3
        scrivi i, j
        j = j + 1
    i = i + 1
```

Esegui il diagramma con "Passo" fino in fondo e guarda la tabella delle variabili: `j` sale da $1$ a $4$ mentre `i` resta ferma a $1$; poi `i` diventa $2$, `j` torna a $1$ e risale. Le frecce che risalgono sono due, una per ciclo, e quella del ciclo interno viene percorsa tre volte per ogni giro di quello esterno.

Nei due linguaggi i cicli sono due [`for`](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for), e il rientro fa vedere quale sta dentro l'altro.

```codice python
for i in range(1, 3):
    for j in range(1, 4):
        print(i, j)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 2; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i << " " << j << endl;
        }
    }
    return 0;
}
```

La tabella di traccia di due cicli annidati ha una colonna per ogni contatore e una riga per ogni giro del ciclo interno.

| Giro del corpo interno | `i` | `j` | Che cosa viene scritto |
|---|---|---|---|
| primo | $1$ | $1$ | `1 1` |
| secondo | $1$ | $2$ | `1 2` |
| terzo | $1$ | $3$ | `1 3` |
| quarto | $2$ | $1$ | `2 1` |
| quinto | $2$ | $2$ | `2 2` |
| sesto | $2$ | $3$ | `2 3` |

Il contatore interno è quello che cambia più in fretta, come i minuti dell'orologio. Tra la terza riga e la quarta `j` arriva a $4$, la condizione del ciclo interno diventa falsa, `i` passa a $2$ e il ciclo interno ricomincia da capo, con `j` di nuovo a $1$.

```ad-warning
Il contatore interno riparte a ogni giro esterno
Nel diagramma il blocco che dà a `j` il valore $1$ sta dentro il ciclo esterno, prima del ciclo interno. Se scrivi i due cicli con il `while` e metti `j = 1` in cima al programma, accanto a `i = 1`, il ciclo interno gira solo durante il primo giro esterno: dopo, `j` vale già $4$ e la sua condizione è falsa. Con il `for` la partenza del contatore è scritta nella riga del ciclo e questo errore non si può fare.
```

```ad-warning
Due contatori, due nomi
Se chiami `i` anche il contatore interno, nel corpo interno il nome `i` indica quello e il numero della fila non si può più usare: il programma dei posti scriverebbe due volte il numero del posto, e mai quello della fila.
```

## Quante volte gira il corpo interno

Nella sala i posti scritti sono $6$, cioè $2 \cdot 3$. Vale in generale: se il ciclo esterno fa $m$ giri e quello interno ne fa $n$ a ogni giro esterno, il corpo interno viene eseguito $m \cdot n$ volte. I giri si moltiplicano, non si sommano, ed è per questo che i cicli annidati fanno lavorare molto il computer: due cicli da mille giri, uno dentro l'altro, eseguono il corpo un milione di volte.

La tavola pitagorica ha dieci righe e dieci colonne, e nella casella della riga `i` e della colonna `j` c'è il prodotto $i \cdot j$. Il corpo interno scrive un prodotto e viene eseguito $10 \cdot 10 = 100$ volte; alla fine di ogni riga, fuori dal ciclo interno ma dentro quello esterno, il programma va a capo.

```codice python
for i in range(1, 11):
    for j in range(1, 11):
        print(i * j, end=" ")
    print()
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 10; i++) {
        for (int j = 1; j <= 10; j++) {
            cout << i * j << " ";
        }
        cout << endl;
    }
    return 0;
}
```

```ad-note
Scrivere senza andare a capo
In Python `print` va a capo dopo ogni scrittura. Con `end=" "` dopo il valore mette uno spazio al posto dell'a capo, con `end=""` non mette niente, e `print()` senza niente tra le parentesi scrive solo l'a capo. In C++ è il contrario: `cout` resta sulla stessa riga finché non gli mandi `endl`.
```

Esegui il programma, poi cambia i due $11$ in Python, o i due $10$ in C++, per avere la tavola fino a $12$. Su uno schermo largo puoi allineare le colonne mettendo `"\t"`, il carattere di tabulazione, al posto dello spazio tra le virgolette.

```ad-warning
L'a capo nel ciclo sbagliato
L'istruzione che va a capo appartiene al ciclo esterno: si esegue una volta per riga. Se la rientri fino a farla entrare nel corpo interno, ogni numero finisce su una riga sua; se la togli, i cento numeri stanno tutti su una riga sola. In Python è il rientro a decidere a quale ciclo appartiene una riga, in C++ sono le parentesi graffe.
```

## Disegni di asterischi

I disegni fatti di caratteri sono il modo più rapido per vedere che cosa fanno due cicli annidati: il ciclo esterno conta le righe del disegno, quello interno i caratteri di ogni riga. Il programma legge quante righe e quante colonne deve avere un rettangolo e lo disegna con gli asterischi.

```codice python
righe = int(input("Righe: "))
colonne = int(input("Colonne: "))
for i in range(1, righe + 1):
    for j in range(1, colonne + 1):
        print("*", end="")
    print()
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int righe, colonne;
    cout << "Righe: ";
    cin >> righe;
    cout << "Colonne: ";
    cin >> colonne;
    for (int i = 1; i <= righe; i++) {
        for (int j = 1; j <= colonne; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
```

Con $3$ righe e $8$ colonne gli asterischi sono $24$. Nel rettangolo tutte le righe sono lunghe uguali, perché il numero dei giri interni non dipende da `i`.

In un triangolo la riga $1$ ha un asterisco, la riga $2$ ne ha due, la riga `i` ne ha `i`. Il ciclo interno allora non arriva a un numero fisso, ma al valore che il contatore esterno ha in quel momento.

```codice python
n = int(input("Altezza: "))
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print("*", end="")
    print()
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Altezza: ";
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
```

Con altezza $4$ il disegno è questo, e sotto c'è il diagramma dello stesso programma con l'altezza $3$ e i due contatori scritti al posto dell'asterisco.

```
*
**
***
****
```

```diagramma
% nome: diagramma-flusso-ciclo-interno-che-dipende-da-i
% alt: Diagramma di flusso con due cicli annidati: i parte da 1 e il ciclo esterno continua finché i è minore o uguale a 3; a ogni giro j riparte da 1 e il ciclo interno continua finché j è minore o uguale a i, scrivendo i e j e aumentando j di 1; finito il ciclo interno i aumenta di 1
i = 1
finché i <= 3
    j = 1
    finché j <= i
        scrivi i, j
        j = j + 1
    i = i + 1
```

Prima di eseguirlo prova a dire quante righe scriverà. Quando il ciclo interno dipende da quello esterno i giri non si moltiplicano: si sommano, riga per riga. Qui sono $1 + 2 + 3 = 6$, e nel triangolo alto $4$ gli asterischi sono $1 + 2 + 3 + 4 = 10$.

## Prova tu

Il programma legge un numero intero $n$. Scrivi i due cicli che disegnano un triangolo rovesciato: la prima riga ha $n$ asterischi, la seconda $n - 1$, l'ultima uno solo. Decidi tu se far scendere il contatore esterno o cambiare l'arrivo di quello interno.

```codice python
n = int(input())
# scrivi qui i due cicli
%% soluzione
n = int(input())
for i in range(n, 0, -1):
    for j in range(1, i + 1):
        print("*", end="")
    print()
%% prova
3
%% stampa
***
**
*
%% prova
1
%% stampa
*
%% prova
5
%% stampa
*****
****
***
**
*
%% prova
0
%% stampa
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // scrivi qui i due cicli

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = n; i > 0; i--) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }

    return 0;
}
```

Nel secondo esercizio il corpo interno contiene una selezione. Il programma legge il numero delle righe e quello delle colonne e deve disegnare solo la cornice del rettangolo: un asterisco nelle caselle del bordo, uno spazio in quelle interne. Una casella è sul bordo quando `i` vale $1$ oppure `righe`, o quando `j` vale $1$ oppure `colonne`: per unire le quattro condizioni ti servono gli [operatori logici](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici).

```codice python
righe = int(input())
colonne = int(input())
for i in range(1, righe + 1):
    for j in range(1, colonne + 1):
        # scrivi qui la selezione: "*" sul bordo, " " dentro
        print("*", end="")
    print()
%% soluzione
righe = int(input())
colonne = int(input())
for i in range(1, righe + 1):
    for j in range(1, colonne + 1):
        if i == 1 or i == righe or j == 1 or j == colonne:
            print("*", end="")
        else:
            print(" ", end="")
    print()
%% prova
3
4
%% stampa
****
*  *
****
%% prova
4
6
%% stampa
******
*    *
*    *
******
%% prova
1
5
%% stampa
*****
%% prova
4
2
%% stampa
**
**
**
**
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int righe, colonne;
    cin >> righe;
    cin >> colonne;
    for (int i = 1; i <= righe; i++) {
        for (int j = 1; j <= colonne; j++) {
            // scrivi qui la selezione: "*" sul bordo, " " dentro
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int righe, colonne;
    cin >> righe;
    cin >> colonne;
    for (int i = 1; i <= righe; i++) {
        for (int j = 1; j <= colonne; j++) {
            if (i == 1 || i == righe || j == 1 || j == colonne) {
                cout << "*";
            } else {
                cout << " ";
            }
        }
        cout << endl;
    }
    return 0;
}
```
