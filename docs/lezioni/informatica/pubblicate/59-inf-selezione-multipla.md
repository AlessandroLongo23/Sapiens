# Selezioni annidate e a più vie

Una temperatura può essere sopra lo zero, sotto lo zero o a zero gradi esatti; un voto è insufficiente, sufficiente, buono oppure ottimo; il distributore delle merende ha un tasto per ogni prodotto. [La selezione a due vie](/materiale/scuola-superiore/informatica/la-selezione/la-selezione-a-due-vie) divide la strada in due, e qui i casi sono tre o più: servono più selezioni, messe una dentro l'altra oppure una in fila all'altra.

## Una selezione dentro un'altra

Nel blocco di una selezione può stare qualunque istruzione, anche un'altra selezione. Due selezioni così, una nel blocco dell'altra, si dicono **annidate**. Un termometro deve dire se la temperatura, letta in gradi interi, è sopra lo zero, sotto lo zero o proprio zero. La prima domanda è "è maggiore di zero?". Se la risposta è no restano due casi, e a separarli pensa una seconda selezione, che sta nel ramo del no della prima.

```diagramma
% nome: diagramma-flusso-termometro-annidata
% alt: Diagramma di flusso con due selezioni annidate: dopo l'inizio si legge gradi; un primo rombo chiede se gradi è maggiore di 0 e il suo ramo sì porta a scrivere "sopra"; nel ramo no c'è un secondo rombo che chiede se gradi è minore di 0, con il ramo sì che porta a scrivere "sotto" e il ramo no a scrivere "zero"; tutti i rami si riuniscono alla fine
% ingresso: -4
leggi gradi
se gradi > 0
    scrivi "sopra"
altrimenti
    se gradi < 0
        scrivi "sotto"
    altrimenti
        scrivi "zero"
```

Esegui il diagramma con $-4$: si accendono tutti e due i rombi. Con $5$ si accende solo il primo, perché il secondo sta su un ramo che non viene percorso. Ogni rombo divide una strada in due: per tre strade ne servono due, per quattro tre.

```codice python
gradi = int(input("Temperatura: "))
if gradi > 0:
    print("sopra")
else:
    if gradi < 0:
        print("sotto")
    else:
        print("zero")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int gradi;
    cout << "Temperatura: ";
    cin >> gradi;
    if (gradi > 0) {
        cout << "sopra" << endl;
    } else {
        if (gradi < 0) {
            cout << "sotto" << endl;
        } else {
            cout << "zero" << endl;
        }
    }
    return 0;
}
```

La selezione interna è scritta un livello più a destra, perché fa parte del blocco dell'`else`: in Python il rientro passa da quattro a otto spazi, in C++ le sue graffe stanno dentro quelle dell'`else`. Lo stesso disegno si fa nel foglio di calcolo con una funzione `SE` dentro l'altra.

Una selezione si può annidare anche nel ramo del sì. In quel caso la seconda domanda viene fatta solo a chi ha risposto sì alla prima, e se non ci sono rami `else` il risultato è lo stesso di una condizione sola con `and`, uno degli [operatori logici](/materiale/scuola-superiore/informatica/la-selezione/gli-operatori-logici).

```ad-warning
A quale if appartiene un else
In Python un `else` appartiene all'`if` che sta sulla sua stessa colonna: spostarlo di quattro spazi lo attacca a un'altra selezione, e il programma parte lo stesso ma fa altro. In C++ decidono le graffe; se le togli, un `else` si attacca all'`if` più vicino sopra di lui, comunque tu abbia rientrato le righe. Nelle selezioni annidate le graffe si mettono sempre.
```

## Più strade in fila: `elif` e `else if`

Il registro elettronico trasforma un voto in un giudizio: ottimo da $9$ in su, buono da $7$, sufficiente da $6$, insufficiente sotto il $6$. Le strade sono quattro e i rombi tre, ognuno nel ramo del no di quello prima. Scritto con le selezioni annidate, come il termometro, il programma avrebbe tre livelli di rientro: a ogni caso in più scivola di un passo verso destra, e nel diagramma i rombi scendono in diagonale. Eseguilo con $7$: il primo rombo risponde no, il secondo sì, e il terzo non si accende. Il diagramma è più largo del suo riquadro: scorrilo verso destra per vedere il terzo rombo.

```diagramma
% nome: diagramma-flusso-giudizio-tre-rombi
% alt: Diagramma di flusso con tre selezioni annidate: si legge voto; un primo rombo chiede se voto è maggiore o uguale a 9 e il ramo sì scrive "ottimo"; nel ramo no un secondo rombo chiede se voto è maggiore o uguale a 7 e il ramo sì scrive "buono"; nel suo ramo no un terzo rombo chiede se voto è maggiore o uguale a 6, con il ramo sì che scrive "sufficiente" e il ramo no che scrive "insufficiente"
% ingresso: 7
leggi voto
se voto >= 9
    scrivi "ottimo"
altrimenti
    se voto >= 7
        scrivi "buono"
    altrimenti
        se voto >= 6
            scrivi "sufficiente"
        altrimenti
            scrivi "insufficiente"
```

Quando la selezione interna sta sempre nel ramo dell'`else`, come qui, i due linguaggi hanno una scrittura che tiene tutte le condizioni sulla stessa colonna: `elif` in Python, `else if` in C++. È la **selezione a più vie**.

```codice python
voto = int(input("Voto: "))
if voto >= 9:
    print("ottimo")
elif voto >= 7:
    print("buono")
elif voto >= 6:
    print("sufficiente")
else:
    print("insufficiente")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int voto;
    cout << "Voto: ";
    cin >> voto;
    if (voto >= 9) {
        cout << "ottimo" << endl;
    } else if (voto >= 7) {
        cout << "buono" << endl;
    } else if (voto >= 6) {
        cout << "sufficiente" << endl;
    } else {
        cout << "insufficiente" << endl;
    }
    return 0;
}
```

Le condizioni vengono controllate dall'alto in basso. Alla prima che risulta vera il programma esegue il suo blocco e salta tutto il resto, senza nemmeno guardare le condizioni che seguono; se nessuna è vera esegue il blocco dell'`else` finale, che è uno solo, sta in fondo e si può anche non mettere. Le righe con `elif`, che è l'abbreviazione di "else if", possono essere quante servono. In ogni caso viene eseguito un blocco solo.

## L'ordine delle condizioni

Con il voto $9$ sono vere tutte e tre le condizioni, `voto >= 9`, `voto >= 7` e `voto >= 6`, e conta solo la prima che il programma incontra. Per questo la seconda riga, pur dicendo `voto >= 7`, in pratica vale "da $7$ a $8$": i voti dal $9$ in su sono già usciti dalla riga prima. Questo è il percorso del voto $7$.

| Condizione | Con `voto` uguale a $7$ | Che cosa succede |
|---|---|---|
| `voto >= 9` | falsa | si passa alla condizione dopo |
| `voto >= 7` | vera | scrive "buono" e salta il resto |
| `voto >= 6` | non viene controllata | |

Se scambi l'ordine e metti `voto >= 6` per prima, quella condizione prende tutti i voti dal $6$ in su, e nessuno arriva più a "buono" e a "ottimo". Con le soglie si procede in ordine: dalla più alta alla più bassa con `>=`, dalla più bassa alla più alta con `<`. Provalo: sposta in cima il caso del sufficiente ed esegui con $9$.

```ad-warning
Tanti if al posto di elif
Se scrivi `if` in tutte le righe, le selezioni diventano separate e vengono controllate tutte: con il voto $9$ il programma scrive "ottimo", poi "buono", poi "sufficiente". Con `elif` e `else if` la catena si ferma alla prima condizione vera.
```

## Scegliere in base a un valore: `switch` e `match`

Capita che tutte le condizioni confrontino la stessa variabile con dei valori fissi: la scelta è $1$, la scelta è $2$, la scelta è $3$. Per questo caso il C++ ha la struttura `switch` e Python ha `match`: si scrive la variabile una volta sola e poi un `case` per ogni valore.

```codice python
scelta = int(input("Scelta (1, 2 o 3): "))
match scelta:
    case 1:
        print("acqua")
    case 2:
        print("succo")
    case 3:
        print("cioccolata")
    case _:
        print("scelta non valida")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int scelta;
    cout << "Scelta (1, 2 o 3): ";
    cin >> scelta;
    switch (scelta) {
        case 1:
            cout << "acqua" << endl;
            break;
        case 2:
            cout << "succo" << endl;
            break;
        case 3:
            cout << "cioccolata" << endl;
            break;
        default:
            cout << "scelta non valida" << endl;
    }
    return 0;
}
```

Il programma confronta il valore di `scelta` con quello di ogni `case` e va a eseguire le istruzioni del primo che trova uguale. Se nessuno è uguale esegue l'ultimo caso, che fa da `else`: si scrive `default` in C++ e `case _` in Python.

```ad-warning
In C++ ogni caso finisce con break
`break` fa uscire dallo `switch`. Se lo dimentichi il programma non si ferma alla fine del caso e prosegue con le istruzioni dei casi successivi: togli il primo `break` e scegli $1$, e vedrai uscire "acqua" e subito dopo "succo". In Python `break` non serve: dopo un caso il `match` è finito.
```

```ad-note
Che cosa non si può fare
Lo `switch` del C++ confronta solo numeri interi e singoli caratteri, e solo per vedere se sono uguali: un caso come `voto >= 6` non si può scrivere, e nemmeno un testo tra virgolette. Per le soglie resta `else if`. Il `match` di Python accetta anche i testi, ma c'è solo nelle versioni recenti del linguaggio: in quelle più vecchie lo stesso programma si scrive con `elif`.
```

## Prova tu

Comincia dal diagramma. Deve leggere due numeri `a` e `b` e scrivere "primo" se il maggiore è `a`, "secondo" se è `b`, "pari" se sono lo stesso numero. Il primo rombo c'è già: premi "Modifica", trascina una seconda selezione nel ramo del no e metti uno "scrivi" in ognuno dei suoi rami. Poi premi "Prova il diagramma" ed eseguilo con $8$ e $3$, con $2$ e $9$, con $5$ e $5$.

```diagramma
% nome: diagramma-flusso-da-completare-confronto
% alt: Diagramma di flusso da completare: si leggono a e b, un rombo chiede se a è maggiore di b, il ramo sì scrive "primo" e il ramo no è ancora vuoto
% ingresso: 5, 5
% modifica: sì
leggi a
leggi b
se a > b
    scrivi "primo"
altrimenti
```

Il primo programma calcola il prezzo del biglietto di un museo: gratis sotto i $6$ anni, $5$ euro da $6$ a $17$ anni, $10$ euro da $18$ a $64$, $7$ euro da $65$ in su. Legge l'età e deve stampare il prezzo; quello di partenza fa pagare $10$ euro a tutti.

```codice python
eta = int(input())
prezzo = 10
# scrivi qui la selezione a più vie
print(prezzo)
%% soluzione
eta = int(input())
if eta < 6:
    prezzo = 0
elif eta < 18:
    prezzo = 5
elif eta < 65:
    prezzo = 10
else:
    prezzo = 7
print(prezzo)
%% prova
4
%% stampa
0
%% prova
6
%% stampa
5
%% prova
17
%% stampa
5
%% prova
18
%% stampa
10
%% prova
65
%% stampa
7
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int eta;
    cin >> eta;
    int prezzo = 10;
    // scrivi qui la selezione a più vie
    cout << prezzo << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int eta;
    cin >> eta;
    int prezzo;
    if (eta < 6) {
        prezzo = 0;
    } else if (eta < 18) {
        prezzo = 5;
    } else if (eta < 65) {
        prezzo = 10;
    } else {
        prezzo = 7;
    }
    cout << prezzo << endl;
    return 0;
}
```

Il secondo programma legge le lunghezze dei tre lati di un triangolo, tre numeri interi, e deve stampare "equilatero" se sono tutte uguali, "isoscele" se sono uguali solo due, "scaleno" se sono tutte diverse. Qui l'ordine delle condizioni conta, e servono gli operatori logici.

```codice python
a = int(input())
b = int(input())
c = int(input())
# scrivi qui la selezione a più vie
print("scaleno")
%% soluzione
a = int(input())
b = int(input())
c = int(input())
if a == b and b == c:
    print("equilatero")
elif a == b or b == c or a == c:
    print("isoscele")
else:
    print("scaleno")
%% prova
5
5
5
%% stampa
equilatero
%% prova
5
5
3
%% stampa
isoscele
%% prova
3
4
5
%% stampa
scaleno
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    // scrivi qui la selezione a più vie
    cout << "scaleno" << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;
    if (a == b && b == c) {
        cout << "equilatero" << endl;
    } else if (a == b || b == c || a == c) {
        cout << "isoscele" << endl;
    } else {
        cout << "scaleno" << endl;
    }
    return 0;
}
```

Con la selezione il programma sceglie che cosa fare una volta sola. Per ripetere le stesse istruzioni più volte serve l'altra struttura, il ciclo, che comincia con [Il ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while).
