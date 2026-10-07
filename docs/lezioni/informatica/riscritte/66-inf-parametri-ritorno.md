# Parametri e valore di ritorno

Nel torneo di calcetto della scuola una vittoria vale $3$ punti e un pareggio $1$. Il programma della classifica fa questo conto per ogni squadra e poi ne usa il risultato: lo scrive, lo confronta con quello di un'altra squadra, lo somma per avere i punti di un girone. Una funzione come la `linea` della [lezione precedente](/materiale/scuola-superiore/informatica/le-funzioni/definire-e-chiamare-una-funzione), che scrive qualcosa e finisce lì, non è sufficiente. Serve una funzione che riceve le vittorie e i pareggi e consegna il totale a chi l'ha chiamata: i dati in entrata sono i parametri, il risultato in uscita è il valore di ritorno.

## Parametri e argomenti

Un **parametro** è una variabile dichiarata tra le parentesi della definizione, che riceve il suo valore a ogni chiamata. Il valore scritto tra le parentesi della chiamata è un **argomento**. Nella definizione di `linea(n)` il parametro è `n`; nella chiamata `linea(5)` l'argomento è $5$. Quando i dati sono più di uno, parametri e argomenti si separano con le virgole. La funzione `scheda` ne riceve due, le partite vinte e i pareggi, e scrive la scheda di una squadra.

```codice python
def scheda(vinte, pareggi):
    print("Vittorie:", vinte)
    print("Pareggi:", pareggi)
    print("Punti:", 3 * vinte + pareggi)

scheda(4, 2)
scheda(2, 4)
```

```codice cpp
#include <iostream>
using namespace std;

void scheda(int vinte, int pareggi) {
    cout << "Vittorie: " << vinte << endl;
    cout << "Pareggi: " << pareggi << endl;
    cout << "Punti: " << 3 * vinte + pareggi << endl;
}

int main() {
    scheda(4, 2);
    scheda(2, 4);
    return 0;
}
```

Le due chiamate hanno gli stessi numeri e danno schede diverse, con $14$ punti la prima e $10$ la seconda. Gli argomenti vengono copiati nei parametri secondo il posto che occupano: il primo argomento nel primo parametro, il secondo nel secondo. Un argomento non deve essere per forza un numero scritto a mano: può essere una variabile o un'espressione, che viene calcolata prima della chiamata. Aggiungi in fondo `v = 5` (in C++ `int v = 5;`) e la chiamata `scheda(v, v - 2)`: prevedi i punti, poi esegui.

```ad-note
I parametri nei due linguaggi
In C++ ogni parametro ha il suo tipo, ripetuto per ciascuno: `int vinte, int pareggi`. Scrivere `int vinte, pareggi`, come nella dichiarazione di due variabili, è un errore. In Python i parametri sono solo nomi.
```

```ad-warning
Gli argomenti nell'ordine sbagliato
Se la squadra ha vinto $4$ partite e ne ha pareggiate $2$, la chiamata `scheda(2, 4)` non dà nessun errore: scrive una scheda sbagliata, con $10$ punti al posto di $14$. Il programma non sa che cosa significano i numeri, guarda solo in che ordine arrivano. Prima di scrivere una chiamata rileggi l'ordine dei parametri nella definizione.
```

```ad-warning
Un argomento in meno o in più
La chiamata deve avere tanti argomenti quanti sono i parametri. Con `scheda(4)` Python si ferma con `TypeError: scheda() missing 1 required positional argument: 'pareggi'`; il C++ non compila il programma, e l'errore dice che nessuna funzione `scheda` accetta quella chiamata.
```

## Restituire un valore con return

La funzione `scheda` scrive i punti sullo schermo, e lì restano: il programma non li può sommare a quelli di un'altra squadra, né confrontare. Perché il risultato torni a chi ha chiamato, la funzione lo deve **restituire** con l'istruzione `return` seguita dal valore, che si chiama **valore di ritorno**. Una funzione di questo tipo somiglia a una [funzione della matematica](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione): riceve dei valori e ne fa corrispondere uno.

```tikz
% nome: funzione-argomenti-valore-di-ritorno
% alt: Una scatola con il nome punti: da sinistra entrano due frecce, con i valori 4 e 2 e i nomi dei parametri vinte e pareggi; da destra esce una freccia con il valore 14, il valore di ritorno
\begin{tikzpicture}
\draw[thick, rounded corners=4pt, fill=orange!18] (0,-0.9) rectangle (3.4,0.9);
\node[font=\small\ttfamily] at (1.7,0.3) {punti};
\node[font=\footnotesize] at (1.7,-0.3) {$3 \cdot 4 + 2$};
\draw[thick, ->] (-2.2,0.45) -- (0,0.45) node[midway, above, font=\small] {$4$} node[midway, below, font=\footnotesize\ttfamily] {vinte};
\draw[thick, ->] (-2.2,-0.55) -- (0,-0.55) node[midway, above, font=\small] {$2$} node[midway, below, font=\footnotesize\ttfamily] {pareggi};
\draw[thick, ->] (3.4,0) -- (6.4,0) node[midway, above, font=\small] {$14$};
\node[font=\footnotesize, align=center] at (-1.1,1.25) {argomenti};
\node[font=\footnotesize, align=center] at (4.9,-0.4) {valore di ritorno};
\end{tikzpicture}
```

Il programma che segue calcola i punti di una squadra con $4$ vittorie e $2$ pareggi. Prima di eseguirlo, chiediti quale argomento finisce in quale parametro, e dove va a finire il valore dopo `return`.

```codice python
def punti(vinte, pareggi):
    return 3 * vinte + pareggi

v = 4
p = 2
t = punti(v, p)
print("Punti:", t)
```

```codice cpp
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    return 3 * vinte + pareggi;
}

int main() {
    int v = 4;
    int p = 2;
    int t = punti(v, p);
    cout << "Punti: " << t << endl;
    return 0;
}
```

```interattivo
% nome: inf-parametri-ritorno-passi
% alt: Il programma con la funzione punti eseguito un passo alla volta, in Python o in C++, con i riquadri delle variabili: alla chiamata punti(v, p) si apre il riquadro della funzione, il valore 4 di v entra nel parametro vinte e il valore 2 di p nel parametro pareggi; return calcola 14, il riquadro della funzione sparisce e 14 finisce nella variabile t del programma principale, che scrive Punti: 14. Un comando cambia la chiamata in punti(p, v): allora vinte riceve 2, pareggi riceve 4 e il risultato è 10.
```

Vai avanti un passo alla volta fino alla chiamata e guarda con quali valori nascono `vinte` e `pareggi`; poi continua fino a `return` e guarda dove ricompare il $14$. Alla fine scegli la chiamata `punti(p, v)` e ripeti.

La chiamata `punti(v, p)` copia il valore di `v` in `vinte` e il valore di `p` in `pareggi`: i nomi sono diversi e non importa, conta il posto. L'istruzione `return` fa due cose insieme: calcola il valore, e chiude la funzione, i cui parametri spariscono. Il valore restituito prende il posto della chiamata, come se la riga fosse `t = 14`. Con `punti(p, v)` il valore di `p` finisce in `vinte`: la funzione conta i pareggi come vittorie e restituisce $10$.

```ad-note
Il tipo del valore di ritorno
In C++ la definizione comincia con il tipo del valore restituito: `int punti(...)` restituisce un intero, `double media(...)` un numero con la virgola. La parola `void`, che hai usato finora, sta al posto del tipo quando la funzione non restituisce niente. In Python non si dichiara nulla: una funzione restituisce quello che scrivi dopo `return`.
```

Poiché `return` chiude la funzione, un'istruzione scritta sotto, nello stesso blocco, non viene mai eseguita. Una funzione può invece avere più `return` nei rami di una selezione: a ogni chiamata ne viene eseguito uno solo, quello del ramo percorso.

## Il risultato dentro un'espressione

Una chiamata che restituisce un valore si può scrivere dovunque si possa scrivere quel valore: a destra di un assegnamento, tra le cose da stampare, dentro un conto, in una condizione.

```codice python
def punti(vinte, pareggi):
    return 3 * vinte + pareggi

tigri = punti(4, 2)
print("Tigri:", tigri)
print("Lupi:", punti(3, 3))
print("Totale:", tigri + punti(3, 3))
if tigri > punti(3, 3):
    print("Prime le Tigri")
else:
    print("Primi i Lupi")
```

```codice cpp
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    return 3 * vinte + pareggi;
}

int main() {
    int tigri = punti(4, 2);
    cout << "Tigri: " << tigri << endl;
    cout << "Lupi: " << punti(3, 3) << endl;
    cout << "Totale: " << tigri + punti(3, 3) << endl;
    if (tigri > punti(3, 3)) {
        cout << "Prime le Tigri" << endl;
    } else {
        cout << "Primi i Lupi" << endl;
    }
    return 0;
}
```

Le Tigri hanno $14$ punti e i Lupi $12$: il totale è $26$ e le Tigri sono prime. Dai ai Lupi una vittoria in più, cambiando in tutte e tre le chiamate `punti(3, 3)` in `punti(4, 3)`, e prevedi le quattro righe prima di eseguire.

## Stampare non è restituire

Finché guardi lo schermo, `scheda` e `punti` sembrano fare lo stesso lavoro. La differenza sta in quello che resta al programma dopo la chiamata.

| | Una funzione che stampa | Una funzione che restituisce |
|---|---|---|
| Che cosa fa del risultato | lo scrive sullo schermo | lo consegna a chi l'ha chiamata |
| Come si chiama | da sola su una riga: `scheda(4, 2)` | dentro un'espressione: `t = punti(4, 2)` |
| Che cosa resta al programma | niente | un valore da usare ancora |
| In C++ comincia con | `void` | il tipo del valore, per esempio `int` |

Di solito conviene la seconda: una funzione che restituisce il risultato lascia decidere a chi la chiama che cosa farne, e stamparlo è solo una delle possibilità.

```ad-warning
print al posto di return
Nel programma delle due squadre sostituisci il `return` con una stampa del risultato. In Python il conto compare sullo schermo a ogni chiamata, ma la funzione non restituisce più niente: una funzione senza `return` restituisce il valore speciale `None`, che vuol dire "nessun valore", `tigri` vale `None` e la somma del totale ferma il programma con un `TypeError`. In C++ una funzione definita con il tipo `int` deve arrivare a un `return`: se manca, il compilatore lo segnala, e il valore che arriva a chi ha chiamato non è definito.
```

```ad-warning
Il valore restituito e lasciato cadere
Scrivi `punti(4, 2)` da sola su una riga: la funzione viene eseguita, calcola $14$ e lo restituisce, ma nessuno lo raccoglie e sullo schermo non compare niente. Un valore restituito va messo in una variabile o usato subito in un'espressione.
```

## Una funzione che ne chiama un'altra

Il corpo di una funzione può chiamare un'altra funzione. Al torneo passa il turno chi ha almeno $10$ punti: la funzione `qualificata` chiama `punti` per fare il conto, e mentre `punti` lavora è lei ad aspettare, come aspetta il programma principale. Il valore che restituisce è il risultato di un confronto, quindi è [vero oppure falso](/materiale/scuola-superiore/informatica/la-selezione/condizioni-e-operatori-di-confronto).

```codice python
def punti(vinte, pareggi):
    return 3 * vinte + pareggi

def qualificata(vinte, pareggi):
    return punti(vinte, pareggi) >= 10

v = int(input("Vittorie: "))
p = int(input("Pareggi: "))
if qualificata(v, p):
    print("Qualificata con", punti(v, p), "punti")
else:
    print("Eliminata")
```

```codice cpp
#include <iostream>
using namespace std;

int punti(int vinte, int pareggi) {
    return 3 * vinte + pareggi;
}

bool qualificata(int vinte, int pareggi) {
    return punti(vinte, pareggi) >= 10;
}

int main() {
    int v, p;
    cout << "Vittorie: ";
    cin >> v;
    cout << "Pareggi: ";
    cin >> p;
    if (qualificata(v, p)) {
        cout << "Qualificata con " << punti(v, p) << " punti" << endl;
    } else {
        cout << "Eliminata" << endl;
    }
    return 0;
}
```

Esegui con $3$ vittorie e $1$ pareggio, che fanno $10$ punti, e poi con $2$ e $3$, che ne fanno $9$. Una funzione che restituisce vero o falso si usa direttamente come condizione di una selezione o di un ciclo, e conviene darle un nome che si legga come un'affermazione: `qualificata`, `pari`, `sufficiente`. In C++ il suo tipo è `bool`. La regola dei $10$ punti è scritta in un posto solo: se il torneo la cambia, correggi una riga, e ogni parte del programma che chiama `qualificata` si adegua.

I parametri di `qualificata` e quelli di `punti` hanno gli stessi nomi, ma sono variabili diverse, ognuna dentro la sua funzione: se ne occupa la lezione [Variabili locali e globali](/materiale/scuola-superiore/informatica/le-funzioni/variabili-locali-e-globali).

## Prova tu

Il programma legge la base e l'altezza di un rettangolo, due numeri interi, e ne scrive il perimetro. La lettura e la stampa sono già scritte e chiamano la funzione `perimetro`, che manca: definiscila tu, con due parametri, in modo che restituisca il perimetro senza stampare niente.

```codice python
# definisci qui la funzione perimetro

base = int(input())
altezza = int(input())
print(perimetro(base, altezza))
%% soluzione
def perimetro(base, altezza):
    return 2 * (base + altezza)

base = int(input())
altezza = int(input())
print(perimetro(base, altezza))
%% prova
5
3
%% stampa
16
%% prova
10
10
%% stampa
40
%% prova
2
9
%% stampa
22
```

```codice cpp
#include <iostream>
using namespace std;

// definisci qui la funzione perimetro

int main() {
    int base, altezza;
    cin >> base;
    cin >> altezza;
    cout << perimetro(base, altezza) << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int perimetro(int base, int altezza) {
    return 2 * (base + altezza);
}

int main() {
    int base, altezza;
    cin >> base;
    cin >> altezza;
    cout << perimetro(base, altezza) << endl;
    return 0;
}
```

Nel secondo esercizio il valore restituito da una chiamata diventa l'argomento di un'altra. Il programma legge tre numeri interi e scrive il più grande. Definisci la funzione `maggiore`, che riceve due numeri e restituisce il più grande dei due, con un `return` in ogni ramo di una selezione; poi scrivi la stampa usando due chiamate di `maggiore`. I numeri possono essere negativi o uguali tra loro.

```codice python
# definisci qui la funzione maggiore

a = int(input())
b = int(input())
c = int(input())
# scrivi qui la stampa del più grande dei tre
%% soluzione
def maggiore(x, y):
    if x > y:
        return x
    else:
        return y

a = int(input())
b = int(input())
c = int(input())
print(maggiore(maggiore(a, b), c))
%% prova
3
9
5
%% stampa
9
%% prova
8
2
1
%% stampa
8
%% prova
4
4
7
%% stampa
7
%% prova
-3
-8
-5
%% stampa
-3
```

```codice cpp
#include <iostream>
using namespace std;

// definisci qui la funzione maggiore

int main() {
    int a, b, c;
    cin >> a;
    cin >> b;
    cin >> c;
    // scrivi qui la stampa del più grande dei tre

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int maggiore(int x, int y) {
    if (x > y) {
        return x;
    } else {
        return y;
    }
}

int main() {
    int a, b, c;
    cin >> a;
    cin >> b;
    cin >> c;
    cout << maggiore(maggiore(a, b), c) << endl;

    return 0;
}
```
