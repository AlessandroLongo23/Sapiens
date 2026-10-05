# Contatori e accumulatori

Il tornello all'ingresso di uno stadio fa scattare un numero a ogni persona che passa, e la cassa del supermercato aggiunge al totale il prezzo di ogni prodotto che scorre sul lettore. Sono i due lavori che un ciclo fa più spesso sui dati: contare quanti sono e sommarli. In un programma ognuno dei due si fa con una variabile, che ha un valore prima del ciclo e viene aggiornata a ogni giro.

## Il contatore conta quante volte succede una cosa

Nel [ciclo for](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for) hai chiamato contatore la variabile `i` che tiene il conto dei giri. L'idea è più larga: un **contatore** è una variabile che parte da $0$ e aumenta di $1$ ogni volta che succede una certa cosa. Se la cosa è "è passato un giro" conta i giri; se è "il dato appena letto supera una soglia" conta solo i dati che la superano, e allora l'aumento sta dentro una [selezione](/materiale/scuola-superiore/informatica/la-selezione/la-selezione-a-due-vie).

Il programma legge quanti voti ha preso una classe in una verifica, poi i voti uno alla volta, e conta quelli sufficienti. I contatori sono due: `i` conta i giri e fa finire il ciclo, `sufficienti` aumenta solo nei giri in cui il voto è almeno $6$.

```diagramma
% nome: diagramma-flusso-contare-voti-sufficienti
% alt: Diagramma di flusso: dopo l'inizio si legge n, sufficienti prende 0 e i prende 1; un rombo chiede se i è minore o uguale a n; il ramo sì scende a leggi voto e a un secondo rombo che chiede se voto è maggiore o uguale a 6, con il ramo sì che porta a sufficienti prende sufficienti più 1; poi i prende i più 1 e una freccia risale sopra il primo rombo; il ramo no del primo rombo scende a scrivi sufficienti e alla fine
% ingresso: 4, 7, 5, 8, 4
leggi n
sufficienti = 0
i = 1
finché i <= n
    leggi voto
    se voto >= 6
        sufficienti = sufficienti + 1
    i = i + 1
scrivi sufficienti
```

Esegui il diagramma con "Passo": i valori proposti sono $4$ voti, cioè $7$, $5$, $8$ e $4$. Nella tabella delle variabili `i` cambia a ogni giro, `sufficienti` solo quando il secondo rombo risponde sì. La tabella di traccia, con una riga per giro, dice la stessa cosa.

| Giro | `voto` | `voto >= 6` | `sufficienti` dopo il giro |
|---|---|---|---|
| primo | $7$ | vero | $1$ |
| secondo | $5$ | falso | $1$ |
| terzo | $8$ | vero | $2$ |
| quarto | $4$ | falso | $2$ |

Nel programma il ciclo è un `for`, che gestisce `i` in una riga sola; il diagramma lo mostra con i tre passi separati, come nella lezione sul `for`.

```codice python
n = int(input("Quanti voti? "))
sufficienti = 0
for i in range(1, n + 1):
    voto = int(input("Voto: "))
    if voto >= 6:
        sufficienti = sufficienti + 1
print("Voti sufficienti:", sufficienti)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Quanti voti? ";
    cin >> n;
    int sufficienti = 0;
    for (int i = 1; i <= n; i++) {
        int voto;
        cout << "Voto: ";
        cin >> voto;
        if (voto >= 6) {
            sufficienti = sufficienti + 1;
        }
    }
    cout << "Voti sufficienti: " << sufficienti << endl;
    return 0;
}
```

Esegui il programma con gli stessi cinque numeri, poi cambia la condizione per contare i voti sotto il $5$. La variabile `voto` contiene un solo valore alla volta: ogni lettura cancella il voto precedente, e alla fine del ciclo dei voti resta solo quello che il contatore ha registrato.

```ad-warning
Il contatore azzerato dentro il ciclo
Se sposti `sufficienti = 0` dentro il corpo, il conto ricomincia da capo a ogni giro e alla fine vale $0$ oppure $1$, secondo l'ultimo voto. Il valore di partenza si dà una volta sola, prima del ciclo.
```

```ad-warning
Il contatore senza valore di partenza
Senza `sufficienti = 0`, la prima volta che il programma calcola `sufficienti + 1` la variabile non ha ancora un valore. Python si ferma con un errore; in C++, con `int sufficienti;`, il conto parte da un numero qualunque e il risultato è sbagliato senza nessun avviso.
```

## L'accumulatore raccoglie un totale

Un **accumulatore** è una variabile a cui ogni giro aggiunge un valore nuovo, e che alla fine contiene il totale. La differenza dal contatore sta in quello che si aggiunge: il contatore aumenta sempre di $1$, l'accumulatore aumenta del dato di quel giro. La variabile `s` che sommava i numeri da $1$ a $n$ nella lezione sul `for`, e i numeri letti fino allo zero nel [ciclo while](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-while), era un accumulatore.

Qui il totale è quello dei punti fatti in una serie di partite di un videogioco: il programma legge quante sono le partite, poi i punti di ognuna, e li aggiunge a `totale`.

```codice python
n = int(input("Quante partite? "))
totale = 0
for i in range(1, n + 1):
    punti = int(input("Punti: "))
    totale = totale + punti
print("Punti in tutto:", totale)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Quante partite? ";
    cin >> n;
    int totale = 0;
    for (int i = 1; i <= n; i++) {
        int punti;
        cout << "Punti: ";
        cin >> punti;
        totale = totale + punti;
    }
    cout << "Punti in tutto: " << totale << endl;
    return 0;
}
```

Con $3$ partite da $120$, $80$ e $200$ punti, `totale` vale $0$, poi $120$, $200$ e $400$. L'istruzione `totale = totale + punti` si legge da destra: prendi il totale di adesso, aggiungi i punti appena letti, rimetti il risultato in `totale`. Nei due linguaggi si può scrivere anche `totale += punti`, che fa la stessa cosa.

Contatore e accumulatore possono lavorare su una parte sola dei dati. Metti l'aggiornamento di `totale` sotto la condizione `punti >= 100`: il programma somma solo le partite da almeno cento punti, e con i dati di prima scrive $320$.

## Il prodotto parte da 1

Un accumulatore può raccogliere un prodotto invece di una somma. Il fattoriale di un numero $n$, che si scrive $n!$, è il prodotto di tutti i numeri interi da $1$ a $n$: per esempio $5! = 1 \cdot 2 \cdot 3 \cdot 4 \cdot 5 = 120$. Il programma moltiplica `fattoriale` per il contatore a ogni giro.

```codice python
n = int(input("Numero: "))
fattoriale = 1
for i in range(1, n + 1):
    fattoriale = fattoriale * i
print("Fattoriale:", fattoriale)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Numero: ";
    cin >> n;
    int fattoriale = 1;
    for (int i = 1; i <= n; i++) {
        fattoriale = fattoriale * i;
    }
    cout << "Fattoriale: " << fattoriale << endl;
    return 0;
}
```

Con $5$ i valori di `fattoriale` sono $1$, $2$, $6$, $24$, $120$. Con $0$ il ciclo non fa nessun giro e il programma scrive $1$, che è proprio il valore che la matematica dà a $0!$.

```ad-warning
Il prodotto che parte da 0
Chi ha appena scritto una somma mette $0$ anche qui, per abitudine. Ma $0$ moltiplicato per qualunque numero fa $0$: il prodotto resta $0$ a ogni giro e il programma scrive $0$ per ogni $n$. Provalo, cambiando `fattoriale = 1` in `fattoriale = 0`.
```

```ad-note
I numeri grandi in Python e in C++
Il fattoriale cresce in fretta. Esegui il programma con $12$ e poi con $13$. In Python escono $479001600$ e $6227020800$, perché un intero di Python può avere quante cifre servono. In C++ con $12$ esce lo stesso numero, con $13$ esce $1932053504$, che è sbagliato: una variabile `int` occupa $32$ bit e non contiene numeri più grandi di $2\,147\,483\,647$ (il perché è nella lezione [Numeri interi con segno e complemento a due](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/numeri-interi-con-segno-e-complemento-a-due)). Il programma non avvisa: scrive un numero senza senso, e con $17$ perfino un numero negativo. Dichiarando `long long fattoriale = 1;`, che occupa $64$ bit, il risultato è giusto fino a $20!$ e torna sbagliato da $21!$.
```

## Il valore di partenza giusto

Dare il primo valore a una variabile si dice **inizializzarla**. Per contatori e accumulatori il valore giusto è quello che non cambia il risultato: prima di aver contato qualcosa il conto è $0$; aggiungere a $0$ il primo dato dà il primo dato; moltiplicare $1$ per il primo dato dà il primo dato.

| Variabile | Parte da | A ogni giro | Alla fine contiene |
|---|---|---|---|
| contatore | $0$ | aumenta di $1$, se la condizione è vera | quante volte è successa la cosa |
| accumulatore di una somma | $0$ | aumenta del dato | la somma dei dati |
| accumulatore di un prodotto | $1$ | viene moltiplicato per il dato | il prodotto dei dati |

In tutti e tre i casi il valore di partenza sta prima del ciclo, l'aggiornamento dentro il corpo e la stampa dopo il ciclo. Se sposti la stampa dentro il corpo, il programma scrive un risultato parziale a ogni giro: è un buon modo per controllare un ciclo che dà un totale sbagliato.

## Prova tu

Costruisci il diagramma di un programma che legge un numero $n$, poi $n$ numeri uno alla volta, e scrive quanti di questi sono negativi. Ti servono due contatori, uno per i giri e uno per i numeri negativi, e una selezione dentro il ciclo. Quando hai finito premi "Prova il diagramma": con i valori proposti ($4$ numeri: $3$, $-2$, $-7$, $5$) deve uscire $2$.

```diagramma
% nome: diagramma-flusso-da-costruire-contare-negativi
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere n, poi n numeri, e scrivere quanti sono negativi
% modifica: sì
% ingresso: 4, 3, -2, -7, 5
```

Il programma legge un numero intero $n$ e poi $n$ numeri interi, uno per riga. Scrivi il ciclo che conta quanti sono pari. Un numero è pari quando il resto della divisione per $2$, che si scrive `x % 2`, è uguale a $0$.

```codice python
n = int(input())
pari = 0
# scrivi qui il ciclo

print(pari)
%% soluzione
n = int(input())
pari = 0
for i in range(1, n + 1):
    x = int(input())
    if x % 2 == 0:
        pari = pari + 1

print(pari)
%% prova
4
3
8
10
7
%% stampa
2
%% prova
3
1
5
-9
%% stampa
0
%% prova
5
0
-4
6
11
2
%% stampa
4
%% prova
0
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int pari = 0;
    // scrivi qui il ciclo

    cout << pari << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int pari = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) {
            pari = pari + 1;
        }
    }

    cout << pari << endl;
    return 0;
}
```

Nel secondo esercizio l'accumulatore raccoglie un prodotto. Il programma legge due numeri interi, la base $a$ e l'esponente $n$ (mai negativo), e deve stampare la potenza $a^n$, calcolata moltiplicando per $a$ tante volte quante dice l'esponente. Ricorda che $a^0 = 1$. Devi scegliere tu il valore di partenza di `potenza`.

```codice python
a = int(input())
n = int(input())
# scrivi qui il valore di partenza di potenza e il ciclo

print(potenza)
%% soluzione
a = int(input())
n = int(input())
potenza = 1
for i in range(1, n + 1):
    potenza = potenza * a

print(potenza)
%% prova
2
10
%% stampa
1024
%% prova
3
4
%% stampa
81
%% prova
7
0
%% stampa
1
%% prova
-2
5
%% stampa
-32
%% prova
10
9
%% stampa
1000000000
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, n;
    cin >> a;
    cin >> n;
    // scrivi qui il valore di partenza di potenza e il ciclo

    cout << potenza << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int a, n;
    cin >> a;
    cin >> n;
    int potenza = 1;
    for (int i = 1; i <= n; i++) {
        potenza = potenza * a;
    }

    cout << potenza << endl;
    return 0;
}
```
