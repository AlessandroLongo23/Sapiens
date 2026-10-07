# Confrontare gli algoritmi contando le operazioni

Per la classifica di un torneo con venti squadre qualunque ordinamento va bene: il risultato arriva prima che tu abbia tolto il dito dal tasto. Un negozio online che ordina per prezzo un milione di prodotti non può scegliere a caso, perché tra un algoritmo e l'altro passa la differenza tra un istante e più di un'ora. Per scegliere tra algoritmi che risolvono lo stesso problema serve una misura del lavoro che fanno, e la misura più utile è il numero di operazioni.

## Contare, non cronometrare

Il tempo misurato con il cronometro dipende dal computer, dal linguaggio e da che cos'altro sta facendo la macchina in quel momento: lo stesso programma, eseguito due volte, dà due tempi diversi. Il numero di confronti e di scambi dipende solo dall'algoritmo e dai dati, ed è lo stesso su qualunque computer. Per contarli si aggiunge al programma un [contatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori), che aumenta di $1$ a ogni confronto tra due elementi.

Qui sotto c'è l'[ordinamento a bolle](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-a-bolle) con la bandierina, in cui `ordina` restituisce il numero di confronti fatti. Il programma la prova su tre vettori con gli stessi sei valori: già in ordine, rovesciato, e in un ordine qualunque.

```codice python
def ordina(v):
    n = len(v)
    confronti = 0
    i = 0
    scambiato = True
    while i < n - 1 and scambiato:
        scambiato = False
        for j in range(n - 1 - i):
            confronti = confronti + 1
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp
                scambiato = True
        i = i + 1
    return confronti

print("in ordine:", ordina([12, 13, 14, 15, 17, 19]))
print("rovesciato:", ordina([19, 17, 15, 14, 13, 12]))
print("a caso:", ordina([15, 12, 19, 13, 17, 14]))
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 6;

int ordina(int v[], int n) {
    int confronti = 0;
    int i = 0;
    bool scambiato = true;
    while (i < n - 1 && scambiato) {
        scambiato = false;
        for (int j = 0; j < n - 1 - i; j++) {
            confronti = confronti + 1;
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
                scambiato = true;
            }
        }
        i = i + 1;
    }
    return confronti;
}

int main() {
    int a[N] = {12, 13, 14, 15, 17, 19};
    int b[N] = {19, 17, 15, 14, 13, 12};
    int c[N] = {15, 12, 19, 13, 17, 14};
    cout << "in ordine: " << ordina(a, N) << endl;
    cout << "rovesciato: " << ordina(b, N) << endl;
    cout << "a caso: " << ordina(c, N) << endl;
    return 0;
}
```

Escono $5$, $15$ e $14$. Lo stesso algoritmo, con gli stessi sei valori, fa un lavoro diverso secondo l'ordine in cui li trova: il vettore già in ordine è il suo caso migliore, quello rovesciato il suo caso peggiore, le due parole che conosci dalla [ricerca sequenziale](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/la-ricerca-sequenziale). Un confronto onesto tra algoritmi li guarda tutti e due, e guarda anche un caso qualunque. Aggiungi un secondo contatore per gli scambi e fallo scrivere dentro la funzione, prima del `return`: troverai $0$, $15$ e $7$.

```ad-warning
Il contatore nel posto sbagliato
Il contatore dei confronti va aumentato prima della selezione, non dentro: `confronti = confronti + 1` scritto dopo l'`if`, rientrato come lo scambio, conta solo i confronti finiti con uno scambio, cioè conta gli scambi. Con il vettore in ordine uscirebbe $0$, come se l'algoritmo non avesse guardato niente.
```

## I tre ordinamenti sullo stesso vettore

La figura fa partire i tre ordinamenti insieme sullo stesso vettore: a ogni passo ciascuno fa un confronto, e chi ne ha bisogno di meno finisce prima. Quale dei tre fa meno confronti, e quale sposta meno elementi? Le bolle corrono con la bandierina. Scegli $12$ elementi e prova i tre vettori di partenza, andando ogni volta fino in fondo con "Esegui".

```interattivo
% nome: inf-gara-ordinamenti
% alt: Tre corsie una sotto l'altra, per l'ordinamento per selezione, a bolle e per inserimento, ciascuna con lo stesso vettore in una fila di celle e con i suoi contatori di confronti e di scambi o spostamenti. A ogni passo ogni algoritmo fa un confronto; chi finisce ha le celle verdi e un segno di spunta accanto al nome. In alto si sceglie il vettore di partenza, in ordine, rovesciato o a caso, e il numero di elementi, 3, 6 o 12; un bottone mescola di nuovo
```

Con $12$ elementi i contatori alla fine sono questi. In ogni casella il primo numero sono i confronti, il secondo gli scambi, che per l'inserimento sono spostamenti; nella riga "a caso" c'è il primo vettore che la figura propone.

| Partenza | Selezione | Bolle | Inserimento |
|---|---|---|---|
| in ordine | $66\ \text{e}\ 0$ | $11\ \text{e}\ 0$ | $11\ \text{e}\ 0$ |
| rovesciato | $66\ \text{e}\ 6$ | $66\ \text{e}\ 66$ | $66\ \text{e}\ 66$ |
| a caso | $66\ \text{e}\ 7$ | $63\ \text{e}\ 35$ | $43\ \text{e}\ 35$ |

L'[ordinamento per selezione](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-per-selezione) fa sempre gli stessi confronti, $\frac{12 \cdot 11}{2} = 66$, anche quando non c'è niente da ordinare; in cambio scambia pochissimo, mai più di $n - 1$ volte. Bolle e [inserimento](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/l-ordinamento-per-inserimento) si accorgono subito di un vettore in ordine, e sul vettore a caso l'inserimento è quello che confronta meno. Tutti e due però muovono molti elementi, e sempre lo stesso numero di volte: ogni scambio delle bolle e ogni spostamento dell'inserimento rimette a posto una coppia di elementi che era nell'ordine sbagliato. Un vincitore assoluto non c'è. Nel caso peggiore, poi, i confronti sono $66$ per tutti e tre: è su quel numero che si ragiona quando i dati crescono.

## Le due ricerche

Per le ricerche la gara è più breve. Su un vettore ordinato di $12$ elementi, quanti confronti servono per trovare l'ultimo? E per scoprire che un valore non c'è?

```interattivo
% nome: inf-gara-ricerche
% alt: Due corsie una sotto l'altra, per la ricerca sequenziale e per la ricerca binaria, ciascuna con lo stesso vettore ordinato in una fila di celle e con il contatore dei confronti. A ogni passo ognuna guarda un elemento: la sequenziale il successivo da sinistra, la binaria quello al centro della parte rimasta, scartando l'altra metà. In alto si sceglie se cercare il primo elemento, quello centrale, l'ultimo o un valore assente, e se gli elementi sono 6 o 12
```

La ricerca sequenziale ne fa $12$ in tutti e due i casi, uno per elemento. La [ricerca binaria](/materiale/scuola-superiore/informatica/ricerca-e-ordinamento/la-ricerca-binaria) ne fa $4$, perché a ogni confronto scarta metà di quello che resta: da $12$ elementi a $6$, a $3$, a $1$. Passa a $6$ elementi: la sequenziale scende a $6$ confronti, la binaria a $3$. Dimezzando i dati una ha dimezzato il lavoro, l'altra ha risparmiato un solo confronto. Solo cercando il primo elemento la sequenziale vince, con un confronto solo.

## Quando i dati raddoppiano

Dodici elementi non mettono in difficoltà nessuno. La domanda che conta è come cresce il numero di operazioni quando crescono i dati, e per rispondere si fa un esperimento: si raddoppia $n$ più volte e si guarda che cosa succede al conto, nel caso peggiore. Il programma lo fa per un ordinamento e per la ricerca binaria. `confronti_ordinamento` costruisce un vettore rovesciato di $n$ elementi, lo ordina con le bolle e conta. `confronti_binaria` conta quante volte $n$ si può dimezzare prima di restare senza elementi: sono i confronti della ricerca binaria quando il valore non c'è.

```codice python
def confronti_ordinamento(n):
    v = []
    for k in range(n):
        v.append(n - k)
    confronti = 0
    for i in range(n - 1):
        for j in range(n - 1 - i):
            confronti = confronti + 1
            if v[j] > v[j + 1]:
                temp = v[j]
                v[j] = v[j + 1]
                v[j + 1] = temp
    return confronti

def confronti_binaria(n):
    confronti = 0
    while n > 0:
        confronti = confronti + 1
        n = n // 2
    return confronti

n = 100
while n <= 1600:
    print(n, confronti_binaria(n), confronti_ordinamento(n))
    n = n * 2
```

```codice cpp
#include <iostream>
using namespace std;

const int MAX = 1600;

int confronti_ordinamento(int n) {
    int v[MAX];
    for (int k = 0; k < n; k++) {
        v[k] = n - k;
    }
    int confronti = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            confronti = confronti + 1;
            if (v[j] > v[j + 1]) {
                int temp = v[j];
                v[j] = v[j + 1];
                v[j + 1] = temp;
            }
        }
    }
    return confronti;
}

int confronti_binaria(int n) {
    int confronti = 0;
    while (n > 0) {
        confronti = confronti + 1;
        n = n / 2;
    }
    return confronti;
}

int main() {
    int n = 100;
    while (n <= MAX) {
        cout << n << " " << confronti_binaria(n) << " " << confronti_ordinamento(n) << endl;
        n = n * 2;
    }
    return 0;
}
```

Le righe che escono hanno $n$, i confronti della ricerca binaria e quelli dell'ordinamento. Nella tabella c'è in più la ricerca sequenziale, che nel caso peggiore fa $n$ confronti.

| $n$ | Sequenziale | Binaria | Ordinamento |
|---|---|---|---|
| $100$ | $100$ | $7$ | $4950$ |
| $200$ | $200$ | $8$ | $19\,900$ |
| $400$ | $400$ | $9$ | $79\,800$ |
| $800$ | $800$ | $10$ | $319\,600$ |
| $1600$ | $1600$ | $11$ | $1\,279\,200$ |

Leggi la tabella dall'alto in basso, una colonna alla volta. A ogni raddoppio di $n$ la ricerca sequenziale raddoppia: si dice che **cresce come $n$**. La ricerca binaria aumenta di $1$: **cresce come $\log_2 n$**, il [logaritmo](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta) in base $2$ di $n$, cioè il numero di volte che bisogna dimezzare $n$ per arrivare a $1$. L'ordinamento diventa ogni volta circa il quadruplo, come fa un quadrato quando il lato raddoppia: **cresce come $n^2$**. Non vuol dire che i confronti siano proprio $n^2$: sono $\frac{n(n - 1)}{2}$, poco meno di metà di $n^2$, ma è il quadrato a decidere come aumentano. Vale per tutti e tre gli ordinamenti che conosci, che nel caso peggiore fanno lo stesso numero di confronti.

Nel grafico le tre crescite stanno sullo stesso piano, con $n$ sull'asse orizzontale e i confronti su quello verticale.

```grafico
% nome: crescita-confronti-quadrato-lineare-logaritmo
% alt: Tre curve sullo stesso piano per n da 0 a 36: la parabola y = n(n-1)/2 dei confronti di un ordinamento sale sempre più ripida fino a quasi 500, la retta y = n della ricerca sequenziale sale piano, la curva y = log in base 2 di n della ricerca binaria resta quasi sdraiata sull'asse. Un cursore sceglie n, una retta verticale tratteggiata lo segna sul piano e sotto sono scritti i tre valori
curva: y=\frac{x\left(x-1\right)}{2} | arancione
curva: y=x | blu
curva: y=\log_2\left(x\right) | verde
curva: x=n | tratteggiata | grigio
cursore: n = 8 da 1 a 32 passo 1
finestra: x da -3 a 36, y da -40 a 520
forma: 3:2
assi: n, quanti
valore: \text{ordinamento} = \frac{n\left(n-1\right)}{2}
valore: \text{sequenziale} = n
valore: \text{binaria} = \log_2\left(n\right)
domanda: Porta $n$ da $8$ a $16$ e poi a $32$: quale dei tre valori raddoppia, quale diventa circa il quadruplo e quale aumenta di $1$?
```

Da $8$ a $16$ a $32$ elementi la retta passa da $8$ a $16$ a $32$, il logaritmo da $3$ a $4$ a $5$, la parabola da $28$ a $120$ a $496$. Nella scala in cui si vede tutta la parabola, le altre due curve restano schiacciate sull'asse.

## Quando un algoritmo non regge

Porta il conto a un milione di elementi. La ricerca binaria fa al massimo $20$ confronti, perché $2^{20}$ supera di poco il milione. La ricerca sequenziale ne fa un milione. Un ordinamento che cresce come $n^2$ ne fa circa

$$\frac{1\,000\,000 \cdot 999\,999}{2} \approx 500\,000\,000\,000$$

cioè cinquecento miliardi. Su un computer che esegue cento milioni di confronti al secondo, la ricerca sequenziale impiega un centesimo di secondo, l'ordinamento $5000$ secondi: quasi un'ora e mezza.

Un algoritmo **non regge** quando il lavoro cresce molto più in fretta dei dati. Con una crescita come $n^2$, dieci volte i dati sono cento volte il lavoro; e un computer dieci volte più veloce non risolve, perché nello stesso tempo ordina solo il triplo degli elementi, dato che $3^2 = 9$ è già quasi $10$. I tre ordinamenti di questo capitolo vanno bene fino a qualche migliaio di elementi. Per i milioni servono algoritmi che crescono molto meno di $n^2$: esistono, e ne incontrerai uno al quarto anno.

Lo stesso conto spiega quando conviene ordinare un vettore solo per poterci cercare dentro. Con $1000$ elementi l'ordinamento costa circa $500\,000$ confronti, una volta sola; poi ogni ricerca ne costa al massimo $10$ al posto di $1000$. Dopo qualche centinaio di ricerche la spesa è ripagata, e da lì in poi è tutto guadagno.

## Prova tu

Il programma legge un numero intero $n$ e deve scrivere quanti confronti fa l'ordinamento per selezione su un vettore di $n$ elementi. Non usare la formula e non ordinare niente: tieni i due cicli dell'algoritmo, con `i` e `j`, e nel corpo lascia solo il contatore.

```codice python
n = int(input())
confronti = 0
# scrivi qui i due cicli

print(confronti)
%% soluzione
n = int(input())
confronti = 0
for i in range(n - 1):
    for j in range(i + 1, n):
        confronti = confronti + 1

print(confronti)
%% prova
6
%% stampa
15
%% prova
12
%% stampa
66
%% prova
1
%% stampa
0
%% prova
100
%% stampa
4950
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int confronti = 0;
    // scrivi qui i due cicli

    cout << confronti << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int confronti = 0;
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            confronti = confronti + 1;
        }
    }

    cout << confronti << endl;
    return 0;
}
```

Il conto non ha avuto bisogno dei valori: per la selezione i confronti dipendono solo da $n$. Nel secondo esercizio il programma legge $n$, il numero di elementi di un vettore ordinato, e un numero $k$ di ricerche da fare, tutte nel caso peggiore. Deve scrivere due righe: i confronti che servono in tutto con la ricerca sequenziale, e quelli che servono con la ricerca binaria. Per la binaria scrivi una funzione che conta i dimezzamenti.

```codice python
# scrivi qui la funzione confronti_binaria(n)

n = int(input())
k = int(input())
# scrivi qui le due stampe
%% soluzione
def confronti_binaria(n):
    confronti = 0
    while n > 0:
        confronti = confronti + 1
        n = n // 2
    return confronti

n = int(input())
k = int(input())
print(k * n)
print(k * confronti_binaria(n))
%% prova
12
1
%% stampa
12
4
%% prova
1000
500
%% stampa
500000
5000
%% prova
1
3
%% stampa
3
3
%% prova
1000000
10
%% stampa
10000000
200
```

```codice cpp
#include <iostream>
using namespace std;

// scrivi qui la funzione confronti_binaria(n)

int main() {
    int n, k;
    cin >> n >> k;
    // scrivi qui le due stampe
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int confronti_binaria(int n) {
    int confronti = 0;
    while (n > 0) {
        confronti = confronti + 1;
        n = n / 2;
    }
    return confronti;
}

int main() {
    int n, k;
    cin >> n >> k;
    cout << k * n << endl;
    cout << k * confronti_binaria(n) << endl;
    return 0;
}
```
