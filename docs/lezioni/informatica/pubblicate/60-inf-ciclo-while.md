# Il ciclo while

Chi lava i piatti non decide prima quante volte ripeterà il gesto: finché nel lavandino c'è un piatto, ne prende uno e lo lava, e quando il lavandino è vuoto smette. Un programma ripete le istruzioni allo stesso modo, con il ciclo `while` (in inglese "finché", "mentre"): una condizione, e un blocco di istruzioni che si ripete finché la condizione è vera.

## Ripetere finché una condizione è vera

Un **ciclo** è un blocco di istruzioni che il programma esegue più volte di seguito; ogni esecuzione del blocco è un giro, e ripetere si dice anche **iterare**. Il ciclo `while` ha due parti: la **condizione**, che è una domanda con risposta vero o falso, e il **corpo**, cioè le istruzioni da ripetere. Il computer controlla la condizione: se è vera esegue il corpo e poi torna a controllarla, se è falsa salta il corpo e prosegue con l'istruzione che viene dopo il ciclo.

Il programma qui sotto fa un conto alla rovescia. La variabile `i` parte da $5$; finché è maggiore di $0$ il programma la stampa e poi la diminuisce di $1$.

```diagramma
% nome: diagramma-flusso-conto-alla-rovescia
% alt: Diagramma di flusso di un ciclo: dopo l'inizio, i prende il valore 5; un rombo chiede se i è maggiore di zero; il ramo sì scende a scrivi i e poi a i prende i meno 1, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no esce a destra e scende a scrivi "Via!" e alla fine
i = 5
finché i > 0
    scrivi i
    i = i - 1
scrivi "Via!"
```

Nel diagramma di flusso il ciclo si riconosce dalla freccia che risale: dopo l'ultima istruzione del corpo si torna sopra il rombo, e la condizione viene controllata di nuovo. Dal rombo si esce una volta sola, dal ramo "no". Premi "Esegui" e conta quante volte si accende il rombo: sei, cinque con risposta sì e una con risposta no. Nel codice accanto si accende ogni volta la riga del `while`.

```codice python
i = 5
while i > 0:
    print(i)
    i = i - 1
print("Via!")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int i = 5;
    while (i > 0) {
        cout << i << endl;
        i = i - 1;
    }
    cout << "Via!" << endl;
    return 0;
}
```

```ad-note
Che cosa cambia tra i due linguaggi
In Python la condizione è seguita dai due punti, e il corpo è fatto dalle righe rientrate di quattro spazi: la prima riga non rientrata è fuori dal ciclo. In C++ la condizione sta tra parentesi tonde e il corpo tra parentesi graffe; il rientro non è obbligatorio, ma si mette lo stesso perché fa vedere a colpo d'occhio che cosa si ripete.
```

Esegui il programma, poi cambia il $5$ in $10$: i giri diventano dieci, senza aggiungere una riga. Prova anche a rientrare di quattro spazi `print("Via!")` in Python, o a spostare quella riga dentro le graffe in C++: "Via!" entra nel corpo e viene scritto a ogni giro.

## Seguire il ciclo a mano

Per capire che cosa fa un ciclo conviene eseguirlo sulla carta, con una **tabella di traccia**: una riga per ogni controllo della condizione, e accanto i valori delle variabili. Questa è la traccia del conto alla rovescia quando `i` parte da $3$.

| Controllo | Valore di `i` | `i > 0` | Che cosa viene scritto | `i` dopo il giro |
|---|---|---|---|---|
| primo | $3$ | vero | $3$ | $2$ |
| secondo | $2$ | vero | $2$ | $1$ |
| terzo | $1$ | vero | $1$ | $0$ |
| quarto | $0$ | falso | niente: si esce e si scrive "Via!" | |

I giri sono tre, i controlli quattro: la condizione viene controllata una volta in più del numero dei giri, perché serve un ultimo controllo, quello che dà falso, per uscire.

## La variabile che fa finire il ciclo

Il conto alla rovescia finisce perché nel corpo c'è `i = i - 1`: a ogni giro `i` cala, e prima o poi la condizione `i > 0` diventa falsa. In ogni ciclo `while` il corpo deve cambiare almeno una delle variabili che compaiono nella condizione, e cambiarla nella direzione che porta la condizione a diventare falsa.

```ad-warning
Il ciclo che non finisce mai
Se dimentichi `i = i - 1`, `i` resta $5$ per sempre, la condizione è sempre vera e il programma stampa $5$ senza fermarsi: è un ciclo infinito. Succede lo stesso se la variabile cambia nella direzione sbagliata, per esempio con `i = i + 1`. Provalo: cancella quella riga dal programma qui sopra ed eseguilo. L'editor ferma il programma da solo, dopo 10 secondi o quando ha stampato troppo testo, e ti avvisa.
```

Il caso opposto è il ciclo che non parte. Il `while` controlla la condizione prima del primo giro: se è falsa subito, il corpo non viene eseguito nemmeno una volta. Metti `i = 0` nella prima riga del conto alla rovescia: il programma scrive solo "Via!". Non è un errore, anzi spesso è proprio il comportamento giusto, ma se ti aspettavi dei giri e non ne vedi nessuno, la prima cosa da controllare è il valore delle variabili all'ingresso del ciclo.

```ad-warning
Il verso del confronto
Scrivere `i < 0` al posto di `i > 0` dà un ciclo che non parte mai, perché $5 < 0$ è falso. Leggi la condizione ad alta voce con "finché": "finché `i` è maggiore di zero, ripeti".
```

## Quando non sai quanti giri servono

Nel conto alla rovescia il numero dei giri si legge nel programma. Il `while` serve soprattutto quando quel numero non si conosce in partenza, perché dipende dai conti o da quello che scrive chi usa il programma.

Una pallina cade da $200$ centimetri e a ogni rimbalzo risale a metà dell'altezza precedente. Il programma conta i rimbalzi che superano i $10$ centimetri: finché l'altezza `h` resta sopra la soglia, la dimezza e aggiunge $1$ a `rimbalzi`.

```codice python
h = 200
rimbalzi = 0
while h > 10:
    h = h // 2
    rimbalzi = rimbalzi + 1
    print("Rimbalzo", rimbalzi, "altezza", h)
print("Rimbalzi contati:", rimbalzi)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int h = 200;
    int rimbalzi = 0;
    while (h > 10) {
        h = h / 2;
        rimbalzi = rimbalzi + 1;
        cout << "Rimbalzo " << rimbalzi << " altezza " << h << endl;
    }
    cout << "Rimbalzi contati: " << rimbalzi << endl;
    return 0;
}
```

```ad-note
La divisione intera
Le altezze sono numeri interi di centimetri, quindi la metà di $25$ è $12$ e il resto si butta. In Python la divisione intera si scrive `//`; in C++ la divisione `/` tra due variabili `int` è già intera.
```

I giri sono cinque, e le altezze $100$, $50$, $25$, $12$, $6$: l'ultimo giro parte da $12$, che supera la soglia, e porta `h` a $6$. Cambia l'altezza di partenza in $1000$ o la soglia in $1$ e prova a indovinare il numero dei giri prima di eseguire.

Il secondo caso è leggere dei dati finché ne arriva uno speciale, che fa da segnale di fine. Il programma somma i numeri che scrivi, uno alla volta, e si ferma quando scrivi $0$. Per leggere un numero intero e metterlo in `n` si scrive `n = int(input())` in Python e `cin >> n;` in C++.

```diagramma
% nome: diagramma-flusso-somma-fino-a-zero
% alt: Diagramma di flusso: dopo l'inizio, s prende il valore 0 e si legge n; un rombo chiede se n è diverso da zero; il ramo sì scende a s prende s più n e poi a leggi n, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no esce a destra e scende a scrivi s e alla fine
% ingresso: 4, 7, 0
s = 0
leggi n
finché n != 0
    s = s + n
    leggi n
scrivi s
```

```codice python
s = 0
n = int(input("Numero (0 per finire): "))
while n != 0:
    s = s + n
    n = int(input("Numero (0 per finire): "))
print("Somma:", s)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int s = 0;
    int n;
    cout << "Numero (0 per finire): ";
    cin >> n;
    while (n != 0) {
        s = s + n;
        cout << "Numero (0 per finire): ";
        cin >> n;
    }
    cout << "Somma: " << s << endl;
    return 0;
}
```

Nel diagramma i numeri proposti sono $4$, $7$ e $0$: eseguilo con "Passo" e guarda `s` crescere nella tabella a ogni giro.

La lettura compare due volte, e tutte e due servono. La prima, fuori dal ciclo, dà a `n` un valore prima che la condizione venga controllata; la seconda, in fondo al corpo, è l'istruzione che cambia `n` e che quindi può far finire il ciclo. Esegui il programma con $4$, $7$, $-2$, $0$: la somma è $9$. Poi scrivi $0$ come primo numero: il ciclo non parte e la somma resta $0$.

```ad-warning
La variabile usata prima di averle dato un valore
Senza la prima lettura, la condizione `n != 0` userebbe una variabile che non ha ancora un valore. Python si ferma con l'errore `NameError`; in C++ il programma parte lo stesso, con dentro `n` un numero qualunque, e si comporta in modo imprevedibile.
```

## Prova tu

Il primo esercizio rovescia il conto alla rovescia. Il programma legge un numero intero $n$: scrivi il ciclo che stampa i numeri da $1$ a $n$, uno per riga. Se $n$ è $0$ non deve stampare niente.

```codice python
n = int(input())
i = 1
# scrivi qui il ciclo
%% soluzione
n = int(input())
i = 1
while i <= n:
    print(i)
    i = i + 1
%% prova
3
%% stampa
1
2
3
%% prova
1
%% stampa
1
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
    int i = 1;
    // scrivi qui il ciclo

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int i = 1;
    while (i <= n) {
        cout << i << endl;
        i = i + 1;
    }

    return 0;
}
```

Nel secondo esercizio il numero dei giri non è noto in partenza. Il programma legge un numero intero $n$ maggiore di $0$ e deve stampare quante cifre ha: $7$ ne ha una, $2026$ ne ha quattro. Togliere l'ultima cifra a un numero vuol dire dividerlo per $10$ con la divisione intera ($2026$ diventa $202$): ripeti finché $n$ è maggiore di $0$, e conta i giri in `cifre`.

```codice python
n = int(input())
cifre = 0
# scrivi qui il ciclo

print(cifre)
%% soluzione
n = int(input())
cifre = 0
while n > 0:
    n = n // 10
    cifre = cifre + 1

print(cifre)
%% prova
7
%% stampa
1
%% prova
42
%% stampa
2
%% prova
2026
%% stampa
4
%% prova
1000000
%% stampa
7
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int cifre = 0;
    // scrivi qui il ciclo

    cout << cifre << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int cifre = 0;
    while (n > 0) {
        n = n / 10;
        cifre = cifre + 1;
    }

    cout << cifre << endl;
    return 0;
}
```
