# Gli operatori logici

Su una giostra del luna park sali solo se sei alto almeno $120$ centimetri e hai compiuto $8$ anni; al cinema paga il biglietto ridotto chi ha meno di $14$ anni oppure ne ha almeno $65$. Sono regole fatte di due condizioni, tenute insieme da una "e" o da una "o". Con gli [operatori di confronto](/materiale/scuola-superiore/informatica/la-selezione/condizioni-e-operatori-di-confronto) se ne scrive una alla volta: per unirle servono gli operatori logici.

## Tre operatori che lavorano su vero e falso

Gli **operatori logici** prendono valori booleani, cioè condizioni, e danno un valore booleano. Sono tre, e li hai già usati nel foglio di calcolo come funzioni `E`, `O` e `NON` (lezione [Condizioni e funzioni logiche](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/condizioni-e-funzioni-logiche)). Python li scrive con le parole inglesi, il C++ con dei simboli.

| Operatore | In Python | In C++ | Nei diagrammi | Il risultato è vero quando |
|---|---|---|---|---|
| e | `and` | `&&` | E | sono vere tutte e due le condizioni |
| o | `or` | `\|\|` | O | è vera almeno una delle due |
| non | `not` | `!` | NON | la condizione è falsa |

## `and`: devono essere vere tutte e due

La regola della giostra chiede due cose insieme, e chi ne rispetta una sola resta a terra. La condizione è `altezza >= 120 and eta >= 8`: è vera solo quando sono veri tutti e due i confronti.

```diagramma
% nome: diagramma-flusso-giostra-and
% alt: Diagramma di flusso: dopo l'inizio si leggono altezza ed eta; un rombo chiede se altezza è maggiore o uguale a 120 E eta è maggiore o uguale a 8; il ramo sì porta a scrivere "puoi salire", il ramo no a scrivere "resti a terra"; i due rami si riuniscono alla fine
% ingresso: 130, 7
leggi altezza
leggi eta
se altezza >= 120 E eta >= 8
    scrivi "puoi salire"
altrimenti
    scrivi "resti a terra"
```

```codice python
altezza = int(input("Altezza in centimetri: "))
eta = int(input("Età: "))

if altezza >= 120 and eta >= 8:
    print("puoi salire")
else:
    print("resti a terra")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int altezza, eta;
    cout << "Altezza in centimetri: ";
    cin >> altezza;
    cout << "Età: ";
    cin >> eta;

    if (altezza >= 120 && eta >= 8) {
        cout << "puoi salire" << endl;
    } else {
        cout << "resti a terra" << endl;
    }
    return 0;
}
```

Esegui il diagramma con $130$ e $7$: al rombo la frase accanto riscrive la condizione con i due numeri, e dice che è falsa perché il secondo confronto lo è. I casi da provare sono quattro: $130$ e $9$, $130$ e $7$, $110$ e $9$, $110$ e $7$. Solo il primo porta sulla giostra.

## `or`: basta che ne sia vera una

Al cinema il ridotto spetta ai più giovani e ai più anziani, e per averlo basta rientrare in uno dei due gruppi. La condizione `eta < 14 or eta >= 65` è vera quando è vero almeno uno dei due confronti, ed è falsa solo quando sono falsi tutti e due.

```codice python
eta = int(input("Età: "))

if eta < 14 or eta >= 65:
    print("biglietto ridotto")
else:
    print("biglietto intero")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int eta;
    cout << "Età: ";
    cin >> eta;

    if (eta < 14 || eta >= 65) {
        cout << "biglietto ridotto" << endl;
    } else {
        cout << "biglietto intero" << endl;
    }
    return 0;
}
```

Provalo con $10$, con $70$ e con $30$, poi con i due valori di confine, $14$ e $65$. In italiano "o" spesso esclude ("pizza o gelato": uno dei due); `or` invece è vero anche quando le due condizioni sono vere insieme. Qui non può succedere, ma in `voto >= 6 or presenze >= 20` sì.

```ad-warning
Ogni lato deve essere una condizione completa
A voce si dice "il giorno è 6 o 7", ma `giorno == 6 or 7` non è la stessa cosa: a destra dell'`or` c'è solo il numero $7$, che i due linguaggi trattano come vero, e la condizione risulta vera per qualunque giorno, senza nessun errore. La variabile si ripete: `giorno == 6 or giorno == 7`.
```

## `not`: il contrario

`not` si mette davanti a una condizione e la rovescia: se era vera diventa falsa, se era falsa diventa vera. Con una variabile booleana `promosso`, la condizione `not promosso` è vera per chi non è promosso. Davanti a un confronto si usano le parentesi, `not (eta >= 18)`, ma spesso è più chiaro scrivere il confronto opposto, `eta < 18`.

| Confronto | Il suo contrario |
|---|---|
| `a == b` | `a != b` |
| `a < b` | `a >= b` |
| `a > b` | `a <= b` |

```ad-warning
Il contrario di minore non è maggiore
Chi non ha meno di $18$ anni può averne esattamente $18$: il contrario di `eta < 18` è `eta >= 18`, non `eta > 18`. Quando rovesci un confronto, controlla da che parte finisce il valore di confine.
```

## Le tabelle di verità

Una **tabella di verità** elenca tutte le combinazioni di vero e falso delle condizioni di partenza e, per ognuna, il risultato dell'operatore. Con due condizioni A e B le combinazioni sono quattro.

| A | B | A `and` B | A `or` B | `not` A |
|---|---|---|---|---|
| vero | vero | vero | vero | falso |
| vero | falso | falso | vero | falso |
| falso | vero | falso | vero | vero |
| falso | falso | falso | falso | vero |

Nella colonna di `and` c'è un solo vero, in quella di `or` un solo falso. Le quattro righe sono le quattro prove che hai fatto con la giostra.

## Chi viene prima: la precedenza

Quando in una condizione ci sono più operatori, il computer segue un ordine fisso, come fa con la moltiplicazione e l'addizione. I confronti si calcolano prima di `and` e di `or`; tra i tre operatori logici viene prima `not`, poi `and`, per ultimo `or`. La condizione `a or b and c` viene quindi letta come `a or (b and c)`.

Un museo fa entrare gratis chi ha meno di $18$ anni, oppure chi è socio e viene di lunedì. Scritta nell'ordine della frase, `eta < 18 or socio and lunedi`, la condizione dice proprio questo, perché l'`and` si calcola per primo. Se la regola fosse "minorenni o soci, ma solo di lunedì", servirebbero le parentesi: `(eta < 18 or socio) and lunedi`. Per un ragazzo di $15$ anni che arriva di martedì la prima è vera e la seconda è falsa.

```ad-tip
Con and e or insieme, metti le parentesi
Anche dove non servono, le parentesi dicono a chi legge quale gruppo hai in mente, e ti evitano di ricordare l'ordine.
```

```ad-note
In C++ il punto esclamativo viene prima dei confronti
In Python `not eta >= 18` nega tutto il confronto. In C++ `!eta >= 18` nega soltanto `eta`, e poi confronta con $18$ il vero o falso che ha ottenuto: il risultato è sempre falso. Con le parentesi, `not (eta >= 18)` e `!(eta >= 18)`, i due linguaggi fanno la stessa cosa.
```

## Gli intervalli

In matematica "il voto è compreso tra $1$ e $10$" si scrive $1 \leq v \leq 10$. In un programma sono due confronti uniti da `and`: `1 <= voto and voto <= 10`, cioè "almeno $1$ e al massimo $10$". Per dire che il voto è fuori dall'intervallo si usa `or`: `voto < 1 or voto > 10`, cioè "troppo basso oppure troppo alto".

```ad-warning
In C++ la scrittura 1 <= voto <= 10 non è un intervallo
Python accetta `1 <= voto <= 10` e la legge come la matematica. In C++ la stessa riga vuol dire un'altra cosa: prima calcola `1 <= voto`, che è vero o falso, cioè $1$ o $0$, poi confronta quel numero con $10$, e il risultato è vero per qualunque voto, anche $25$. Il compilatore di questa pagina se ne accorge e si rifiuta di compilare; altri compilatori la accettano, e il programma sbaglia senza avvisare. In C++ si scrive `1 <= voto && voto <= 10`.
```

## Negare una condizione composta

Sulla giostra sale chi ha l'altezza e l'età. Resta a terra chi non ha l'altezza, oppure non ha l'età: negando, la "e" è diventata una "o". Le **leggi di De Morgan** dicono che succede sempre così.

- Il contrario di "A e B" è "non A, oppure non B".
- Il contrario di "A o B" è "non A, e non B".

Per negare una condizione composta si nega quindi ogni pezzo e si scambia `and` con `or`. Il voto valido è `1 <= voto and voto <= 10`; negando i due confronti e cambiando l'operatore si ottiene `voto < 1 or voto > 10`, che è la condizione "fuori dall'intervallo" scritta poco fa. Il programma calcola le due forme, e le ultime due righe che scrive sono sempre uguali.

```codice python
voto = int(input("Voto: "))
valido = 1 <= voto and voto <= 10

print(valido)
print(not valido)
print(voto < 1 or voto > 10)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int voto;
    cout << "Voto: ";
    cin >> voto;
    bool valido = 1 <= voto && voto <= 10;

    cout << valido << endl;
    cout << !valido << endl;
    cout << (voto < 1 || voto > 10) << endl;
    return 0;
}
```

Provalo con $7$, con $0$, con $11$ e con i confini $1$ e $10$ (il C++ scrive $1$ per vero e $0$ per falso).

```ad-warning
Negare i pezzi e dimenticare di cambiare l'operatore
`voto < 1 and voto > 10` sembra la negazione del voto valido, ma non è mai vera: nessun numero è insieme minore di $1$ e maggiore di $10$. Sostituiscila nell'ultima riga del programma e guarda che cosa scrive con $0$.
```

## Prova tu

Il diagramma legge il numero di un giorno della settimana, da $1$ per il lunedì a $7$ per la domenica, e scrive "fine settimana" per il sabato e la domenica, "feriale" per gli altri. Eseguilo con $6$ e con $3$, poi scrivi il programma che fa la stessa cosa: quello di partenza risponde sempre "feriale".

```diagramma
% nome: diagramma-flusso-fine-settimana
% alt: Diagramma di flusso: dopo l'inizio si legge giorno; un rombo chiede se giorno è uguale a 6 O giorno è uguale a 7; il ramo sì porta a scrivere "fine settimana", il ramo no a scrivere "feriale"; i due rami si riuniscono alla fine
% ingresso: 6
% codice: no
leggi giorno
se giorno == 6 O giorno == 7
    scrivi "fine settimana"
altrimenti
    scrivi "feriale"
```

```codice python
giorno = int(input())
# scrivi qui la selezione
print("feriale")
%% soluzione
giorno = int(input())
if giorno == 6 or giorno == 7:
    print("fine settimana")
else:
    print("feriale")
%% prova
6
%% stampa
fine settimana
%% prova
7
%% stampa
fine settimana
%% prova
1
%% stampa
feriale
%% prova
5
%% stampa
feriale
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int giorno;
    cin >> giorno;
    // scrivi qui la selezione
    cout << "feriale" << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int giorno;
    cin >> giorno;
    if (giorno == 6 || giorno == 7) {
        cout << "fine settimana" << endl;
    } else {
        cout << "feriale" << endl;
    }
    return 0;
}
```

Nel secondo esercizio servono tutti e tre gli operatori, o due di loro e un confronto rovesciato. Un anno è bisestile se è divisibile per $4$ ma non per $100$, oppure se è divisibile per $400$: il $2024$ lo è, il $1900$ no, il $2000$ sì. Un numero è divisibile per $4$ quando il resto della divisione, `anno % 4`, è $0$. Il programma di partenza guarda solo la divisibilità per $4$ e sbaglia con il $1900$: completa la condizione.

```codice python
anno = int(input())
if anno % 4 == 0:
    print("bisestile")
else:
    print("non bisestile")
%% soluzione
anno = int(input())
if (anno % 4 == 0 and anno % 100 != 0) or anno % 400 == 0:
    print("bisestile")
else:
    print("non bisestile")
%% prova
2024
%% stampa
bisestile
%% prova
2023
%% stampa
non bisestile
%% prova
1900
%% stampa
non bisestile
%% prova
2000
%% stampa
bisestile
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int anno;
    cin >> anno;
    if (anno % 4 == 0) {
        cout << "bisestile" << endl;
    } else {
        cout << "non bisestile" << endl;
    }
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int anno;
    cin >> anno;
    if ((anno % 4 == 0 && anno % 100 != 0) || anno % 400 == 0) {
        cout << "bisestile" << endl;
    } else {
        cout << "non bisestile" << endl;
    }
    return 0;
}
```

Con gli operatori logici una selezione sceglie tra due strade guardando più condizioni insieme. Quando le strade sono tre o più servono le [selezioni annidate e a più vie](/materiale/scuola-superiore/informatica/la-selezione/selezioni-annidate-e-a-piu-vie).
