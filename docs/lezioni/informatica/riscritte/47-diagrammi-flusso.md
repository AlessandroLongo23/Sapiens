# I diagrammi di flusso

Le istruzioni per montare un mobile sono quasi tutte disegni: un pezzo, una freccia, il pezzo dopo. Un **diagramma di flusso** (in inglese flow chart) fa lo stesso con un algoritmo, cioè con un elenco finito di passi precisi che risolve un problema: ogni passo è un blocco, e le frecce dicono in che ordine i passi si eseguono. Si disegna prima di scrivere il programma, perché sul disegno si vede subito dove l'algoritmo prende una decisione e dove torna indietro, e correggere un errore costa un colpo di gomma.

## Quattro blocchi e le frecce

Ogni blocco ha una forma, e la forma dice che tipo di passo è prima ancora di leggere che cosa c'è scritto dentro.

| Blocco | Forma | Che cosa c'è dentro |
|---|---|---|
| inizio e fine | ovale | la parola "inizio" oppure "fine" |
| ingresso e uscita | parallelogramma | un dato da leggere ("leggi $n$") o da scrivere ("scrivi $n$") |
| istruzione | rettangolo | un calcolo, con il nome a cui va il risultato ("$a \leftarrow b \cdot h$") |
| condizione | rombo | una domanda a cui si risponde sì oppure no ("$n > 0$?") |

```tikz
% nome: diagramma-flusso-quattro-blocchi
% alt: I quattro blocchi di un diagramma di flusso con il loro nome: l'ovale per inizio e fine, il parallelogramma per ingresso e uscita, il rettangolo per un'istruzione, il rombo per una condizione
% svg: diagramma-flusso-quattro-blocchi-124fb90f.svg 294x146
\begin{tikzpicture}
\tikzset{
  estremo/.style={draw, thick, rounded corners=9pt, minimum width=2.2cm, minimum height=0.65cm, fill=green!15, font=\small},
  azione/.style={draw, thick, minimum width=2.8cm, minimum height=0.7cm, align=center, fill=blue!12, font=\small},
  testo/.style={font=\small, align=center}
}
\newcommand{\dati}[3]{\draw[thick, fill=orange!20] (#1-1.35,#2-0.35) -- (#1+1.65,#2-0.35) -- (#1+1.35,#2+0.35) -- (#1-1.65,#2+0.35) -- cycle; \node[testo] at (#1,#2) {#3};}
\newcommand{\scelta}[3]{\draw[thick, fill=yellow!25] (#1-1.6,#2) -- (#1,#2+0.6) -- (#1+1.6,#2) -- (#1,#2-0.6) -- cycle; \node[testo] at (#1,#2) {#3};}
\node[estremo] at (0,0) {inizio};
\node[testo] at (0,-0.8) {inizio e fine};
\dati{4.6}{0}{leggi $n$}
\node[testo] at (4.6,-0.8) {ingresso e uscita};
\node[azione] at (0,-2.2) {$a \leftarrow b \cdot h$};
\node[testo] at (0,-3.2) {istruzione};
\scelta{4.6}{-2.2}{$n > 0$?}
\node[testo] at (4.6,-3.2) {condizione};
\end{tikzpicture}
```

Le lettere dentro i blocchi sono **variabili**: nomi a cui corrisponde un valore, come scatole con un'etichetta. "Leggi $n$" vuol dire che chi usa il programma scrive un valore, e quel valore finisce nella scatola $n$; "scrivi $n$" mostra sullo schermo il valore che c'è in $n$. La scrittura $a \leftarrow b \cdot h$ si legge "calcola $b \cdot h$ e metti il risultato in $a$".

Le **frecce** collegano i blocchi e si percorrono in un verso solo. Le regole sono poche: un diagramma ha un solo inizio; da un ovale di fine non esce niente; da un parallelogramma e da un rettangolo esce una sola freccia; da un rombo ne escono due, una con scritto "sì" e una con scritto "no".

```ad-warning
Un rombo con una sola uscita non è una condizione
Se dal rombo esce una freccia sola, o se sulle due frecce manca "sì" e "no", chi legge non sa dove andare quando la risposta è l'altra. Controlla ogni rombo: due frecce, due etichette.
```

## Come si legge

Leggere un diagramma vuol dire eseguirlo a mano, facendo quello che farebbe il computer.

1. Parti dall'ovale "inizio" e segui la freccia.
2. Esegui il blocco a cui arrivi, uno solo alla volta, e segna su un foglio il valore delle variabili che cambiano.
3. Se il blocco è un rombo, rispondi alla domanda con i valori che hai sul foglio e prendi la freccia della tua risposta.
4. Continua finché arrivi all'ovale "fine".

I blocchi si possono combinare in tre soli modi, che si chiamano strutture: la sequenza, la selezione e la ripetizione. Ognuna ha un disegno che si riconosce a colpo d'occhio.

## La sequenza

Nella **sequenza** i blocchi sono uno sotto l'altro e si eseguono tutti, una volta, dall'alto in basso. Il diagramma qui sotto calcola l'area di un rettangolo: legge la base $b$ e l'altezza $h$, calcola l'area $a$ e la scrive.

```diagramma
% nome: diagramma-flusso-sequenza-area
% alt: Diagramma di flusso in sequenza: inizio, leggi b, leggi h, un rettangolo con a che prende b per h, scrivi a, fine; i blocchi sono uno sotto l'altro, collegati da frecce verso il basso
% ingresso: 4, 3
leggi b
leggi h
a = b * h
scrivi a
```

Qui sotto c'è lo stesso algoritmo scritto come programma. Non devi ancora saper scrivere il codice: ti serve solo riconoscere, riga per riga, i blocchi del diagramma. Eseguilo, e quando te lo chiede scrivi una base e un'altezza.

```codice python
b = int(input("Base: "))
h = int(input("Altezza: "))
a = b * h
print(a)
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int b, h, a;
    cout << "Base: ";
    cin >> b;
    cout << "Altezza: ";
    cin >> h;
    a = b * h;
    cout << a << endl;
    return 0;
}
```

I due parallelogrammi "leggi" sono le righe che chiedono un numero, il rettangolo è la riga `a = b * h`, il parallelogramma "scrivi" è l'ultima riga che stampa. Prova a cambiare il calcolo in `a = 2 * (b + h)`: il programma scrive il perimetro, e nel diagramma cambierebbe solo il contenuto del rettangolo.

```ad-note
Che cosa cambia tra i due linguaggi
In C++ il programma sta tra `int main() {` e `return 0; }`, che fanno da "inizio" e "fine"; la riga `int b, h, a;` prepara le tre variabili e ogni istruzione finisce con il punto e virgola. In Python l'inizio è la prima riga e la fine è l'ultima.
```

```ad-warning
La freccia del rettangolo non è un uguale
Nei programmi la freccia $\leftarrow$ si scrive `=`, ma il significato resta quello della freccia: prima si calcola quello che sta a destra, poi il risultato va nella variabile a sinistra. Per questo $n \leftarrow n - 1$ ha senso (togli uno a $n$), mentre come uguaglianza non sarebbe mai vera.
```

## La selezione

Nella **selezione** un rombo divide la strada in due rami, e a ogni esecuzione se ne percorre uno solo. Al cinema chi ha meno di 14 anni paga il biglietto ridotto: il diagramma legge l'età $e$ e sceglie che cosa scrivere. Dopo i due rami le frecce si riuniscono, e da lì in poi la strada è di nuovo una.

```diagramma
% nome: diagramma-flusso-selezione-biglietto
% alt: Diagramma di flusso con una selezione: dopo l'inizio si legge e; un rombo chiede se e è minore di 14; il ramo sì, a sinistra, porta a scrivere "ridotto", il ramo no, a destra, a scrivere "intero"; i due rami si riuniscono alla fine
% ingresso: 12
leggi e
se e < 14
    scrivi "ridotto"
altrimenti
    scrivi "intero"
```

Nel programma il rombo diventa la riga che comincia con `if` ("se"), il ramo "sì" è quello che viene subito dopo, il ramo "no" quello dopo `else` ("altrimenti").

```codice python
e = int(input("Età: "))
if e < 14:
    print("ridotto")
else:
    print("intero")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int e;
    cout << "Età: ";
    cin >> e;
    if (e < 14) {
        cout << "ridotto" << endl;
    } else {
        cout << "intero" << endl;
    }
    return 0;
}
```

Eseguilo tre volte, con 10, con 30 e con 14. Con 14 la risposta alla domanda "$e < 14$?" è no, quindi esce "intero": i valori sul confine sono quelli da provare sempre, sul diagramma prima ancora che nel programma. Un ramo può anche essere vuoto, quando in un caso non c'è niente da fare: ne trovi uno nel primo esercizio in fondo.

## La ripetizione

Nella **ripetizione**, che si chiama anche ciclo, una freccia torna indietro a un rombo già attraversato, e i blocchi compresi nel giro si eseguono più volte. Il diagramma di un conto alla rovescia legge $n$ e, finché $n$ è maggiore di zero, lo scrive e gli toglie uno; quando la risposta diventa no, esce dal giro e scrive "via!".

```diagramma
% nome: diagramma-flusso-ripetizione-conto-rovescia
% alt: Diagramma di flusso con una ripetizione: dopo l'inizio si legge n; un rombo chiede se n è maggiore di zero; il ramo sì scende a scrivi n e poi a n che prende n meno 1, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no passa sul lato destro e scende a scrivi "via!" e alla fine
% ingresso: 3
leggi n
finché n > 0
    scrivi n
    n = n - 1
scrivi "via!"
```

Per capire un ciclo conviene seguirlo a mano, con una tabella che ha una riga per ogni blocco eseguito. Con $n = 3$:

| Passo | Blocco | Valore di $n$ | Sullo schermo |
|---|---|---|---|
| 1 | leggi $n$ | $3$ | |
| 2 | $n > 0$? sì | $3$ | |
| 3 | scrivi $n$ | $3$ | 3 |
| 4 | $n \leftarrow n - 1$ | $2$ | |
| 5 | $n > 0$? sì | $2$ | |
| 6 | scrivi $n$ | $2$ | 2 |
| 7 | $n \leftarrow n - 1$ | $1$ | |
| 8 | $n > 0$? sì | $1$ | |
| 9 | scrivi $n$ | $1$ | 1 |
| 10 | $n \leftarrow n - 1$ | $0$ | |
| 11 | $n > 0$? no | $0$ | |
| 12 | scrivi "via!" | $0$ | via! |

Il rombo è stato attraversato quattro volte, tre con risposta sì e una con risposta no. Nel programma il rombo con la freccia che torna indietro diventa la riga `while` ("finché"), e i blocchi del giro sono le righe che la seguono.

```codice python
n = int(input("Da quanto parto? "))
while n > 0:
    print(n)
    n = n - 1
print("via!")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Da quanto parto? ";
    cin >> n;
    while (n > 0) {
        cout << n << endl;
        n = n - 1;
    }
    cout << "via!" << endl;
    return 0;
}
```

Eseguilo con 3 e confronta l'uscita con l'ultima colonna della tabella. Poi cambia `n - 1` in `n - 2` e, prima di eseguirlo con 7, scrivi su un foglio che cosa ti aspetti: il diagramma è lo stesso, con un rettangolo diverso. Con 0 il rombo risponde subito no e il giro non si esegue nemmeno una volta.

```ad-warning
Il ciclo che non finisce
Dentro il giro deve esserci un blocco che cambia la variabile della condizione. Senza il rettangolo $n \leftarrow n - 1$ la risposta a "$n > 0$?" resterebbe sì per sempre, e il diagramma scriverebbe 3, 3, 3 senza arrivare mai alla fine. Quando disegni un ciclo, chiediti a ogni giro che cosa fa avvicinare il no.
```

## Dal diagramma al programma

Un diagramma si traduce un blocco alla volta, nell'ordine in cui le frecce lo attraversano. Ogni forma ha la sua riga.

| Nel diagramma | In Python | In C++ |
|---|---|---|
| leggi $n$ | `n = int(input())` | `cin >> n;` |
| scrivi $n$ | `print(n)` | `cout << n << endl;` |
| $a \leftarrow b \cdot h$ | `a = b * h` | `a = b * h;` |
| rombo con due rami che si riuniscono | `if` ed `else` | `if` ed `else` |
| rombo con una freccia che torna indietro | `while` | `while` |

Resta da dire al computer quali righe stanno dentro un ramo o dentro un giro, cosa che nel diagramma si vede dalle frecce. Python lo capisce dal rientro, cioè dagli spazi all'inizio della riga; C++ dalle parentesi graffe.

```ad-warning
Una riga rientrata per sbaglio finisce dentro il giro
Nel conto alla rovescia in Python la riga `print("via!")` comincia a margine, perché nel diagramma sta dopo l'uscita dal ciclo. Se la rientri come le due righe sopra, entra nel giro e "via!" esce a ogni numero. In C++ succede lo stesso se la scrivi prima della graffa che chiude il `while`.
```

## Prova tu

In ogni esercizio il diagramma è completo e il programma no: manca il pezzo indicato dal commento. Trova nel diagramma i blocchi che nel programma non ci sono, scrivili prendendo a modello i programmi della lezione e premi "Verifica".

### Lo sconto

Un negozio toglie 10 euro ai prezzi sopra i 50 euro, e lascia gli altri come sono. Qui il ramo "no" è vuoto: la freccia scavalca il rettangolo. Nel programma, quindi, c'è un `if` senza `else`. Mancano il rombo e il rettangolo.

```diagramma
% nome: diagramma-flusso-selezione-sconto
% alt: Diagramma di flusso con una selezione a un solo ramo: dopo l'inizio si legge p; un rombo chiede se p è maggiore di 50; il ramo sì scende a un rettangolo con p che prende p meno 10; il ramo no passa a destra del rettangolo senza blocchi e si riunisce sotto; poi scrivi p e fine
% ingresso: 80
leggi p
se p > 50
    p = p - 10
scrivi p
```

```codice python
p = int(input())
# scrivi qui il rombo e il rettangolo

print(p)
%% soluzione
p = int(input())
if p > 50:
    p = p - 10

print(p)
%% prova
80
%% stampa
70
%% prova
20
%% stampa
20
%% prova
50
%% stampa
50
%% prova
51
%% stampa
41
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int p;
    cin >> p;
    // scrivi qui il rombo e il rettangolo

    cout << p << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int p;
    cin >> p;
    if (p > 50) {
        p = p - 10;
    }

    cout << p << endl;
    return 0;
}
```

### La somma dei numeri da 1 a n

Il diagramma somma i numeri da $1$ a $n$: $s$ è la somma, che parte da $0$, e $i$ è il numero da aggiungere, che parte da $1$ e cresce di uno a ogni giro. Prima di scrivere, seguilo a mano con $n = 4$: deve uscire $10$. Nel programma manca tutto il ciclo, cioè il rombo e i due rettangoli del giro.

```diagramma
% nome: diagramma-flusso-ripetizione-somma
% alt: Diagramma di flusso con una ripetizione: dopo l'inizio si legge n, poi s prende 0 e i prende 1; un rombo chiede se i è minore o uguale a n; il ramo sì scende a s che prende s più i e poi a i che prende i più 1, da cui una freccia risale sul lato sinistro fino a sopra il rombo; il ramo no passa sul lato destro e scende a scrivi s e alla fine
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
n = int(input())
s = 0
i = 1
# scrivi qui il ciclo

print(s)
%% soluzione
n = int(input())
s = 0
i = 1
while i <= n:
    s = s + i
    i = i + 1

print(s)
%% prova
4
%% stampa
10
%% prova
1
%% stampa
1
%% prova
100
%% stampa
5050
%% prova
0
%% stampa
0
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n, s, i;
    cin >> n;
    s = 0;
    i = 1;
    // scrivi qui il ciclo

    cout << s << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int n, s, i;
    cin >> n;
    s = 0;
    i = 1;
    while (i <= n) {
        s = s + i;
        i = i + 1;
    }

    cout << s << endl;
    return 0;
}
```
