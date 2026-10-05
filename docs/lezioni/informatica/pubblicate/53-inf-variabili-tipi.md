# Variabili, assegnamento e tipi di dato

Un videogioco ricorda il tuo punteggio per tutta la partita e lo aggiorna ogni volta che raccogli una moneta. Per ricordare un valore, e per cambiarlo quando serve, un programma usa una variabile: è il primo strumento di chi programma, e tutto quello che viene dopo (le scelte, i cicli) lavora sulle variabili.

## Un nome per un posto in memoria

Mentre un programma è in esecuzione, i suoi dati stanno nella memoria centrale (ne parla la lezione [Memoria centrale e memorie di massa](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa)). Una **variabile** è un posto della memoria a cui il programma dà un nome e in cui tiene un valore. Puoi pensarla come una scatola con un'etichetta: l'etichetta è il nome, quello che c'è dentro è il valore, e nella scatola sta un solo valore alla volta.

Il nome serve a ritrovare il valore: dove il programma scrive `punti`, il computer va a prendere quello che in quel momento c'è nella variabile `punti`. Il valore può cambiare durante l'esecuzione, ed è per questo che si chiama variabile; il nome resta lo stesso.

## L'assegnamento mette un valore nella variabile

L'istruzione che mette un valore in una variabile è l'**assegnamento**, e si scrive con il segno `=`: a sinistra il nome della variabile, a destra il valore. Il computer la esegue sempre in due tempi: prima calcola quello che c'è a destra, poi mette il risultato nella variabile di sinistra, dove prende il posto del valore che c'era prima.

Il programma qui sotto tiene il conto dei punti di Giulia: parte da 10, ne aggiunge 5 e poi raddoppia.

```codice python
nome = "Giulia"
punti = 10
punti = punti + 5
punti = punti * 2
print(nome, "ha", punti, "punti")
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome = "Giulia";
    int punti = 10;
    punti = punti + 5;
    punti = punti * 2;
    cout << nome << " ha " << punti << " punti" << endl;
    return 0;
}
```

```ad-note
In C++ il tipo si dichiara, in Python no
In C++ una variabile va dichiarata prima di usarla, scrivendo davanti al nome il tipo di valore che conterrà: `int punti` è una variabile per numeri interi, `string nome` una per un testo. Il tipo si scrive una volta sola, e da lì in poi quella variabile accetta solo valori di quel tipo. In Python la dichiarazione non c'è: la variabile nasce al primo assegnamento e il tipo è quello del valore che riceve. In C++, inoltre, ogni istruzione finisce con il punto e virgola.
```

In matematica $x = x + 1$ è un'uguaglianza che nessun numero rende vera. In un programma `punti = punti + 5` è un ordine: prendi il valore di `punti`, aggiungi 5, rimetti il risultato in `punti`. Per seguire un programma a mano si usa una **tabella di traccia**, che ha una riga per ogni istruzione eseguita e dice quanto valgono le variabili dopo quella istruzione.

| Istruzione | Conto a destra dell'uguale | `punti` dopo |
|---|---|---|
| `punti = 10` | $10$ | $10$ |
| `punti = punti + 5` | $10 + 5$ | $15$ |
| `punti = punti * 2` | $15 \cdot 2$ | $30$ |

Esegui il programma e controlla che scriva 30. Poi scambia tra loro la terza e la quarta istruzione: prima di eseguire rifai la tabella a mano, e dovresti trovare 25, perché l'ordine delle istruzioni conta.

```ad-warning
L'assegnamento va da destra a sinistra
La variabile che riceve il valore sta sempre a sinistra. Scrivere `10 = punti` è un errore, perché 10 non è un posto in cui mettere qualcosa; e `a = b` non è lo stesso di `b = a`: nel primo caso cambia `a`, nel secondo cambia `b`.
```

```ad-warning
Una variabile usata prima di averle dato un valore
Se cancelli l'istruzione `punti = 10`, il programma arriva a `punti + 5` senza sapere quanto vale `punti`. Python si ferma con l'errore `name 'punti' is not defined`. In C++ la variabile dichiarata con `int punti;` esiste ma contiene un valore qualunque, rimasto in quel posto della memoria: il programma va avanti e scrive un numero senza senso.
```

## Come scegliere i nomi

Le regole sono le stesse nei due linguaggi, e chi non le rispetta ottiene un errore:

- un nome è fatto di lettere, cifre e del trattino basso `_`, senza spazi;
- non comincia con una cifra: `voto1` va bene, `1voto` no;
- maiuscole e minuscole sono lettere diverse: `punti`, `Punti` e `PUNTI` sono tre variabili;
- non può essere una parola del linguaggio, come `if`, `while` o `int`.

Poi ci sono le abitudini, che il computer non controlla ma che rendono un programma leggibile. Il nome dice che cosa contiene la variabile: `prezzo` e `quantita` si capiscono, `p` e `q` no. Quando servono due parole si uniscono con il trattino basso, come in `prezzo_totale`. Le lettere accentate si evitano, perché non tutti i linguaggi le accettano: `quantita`, non `quantità`.

## I tipi di dato

Il **tipo** di un valore dice che genere di dato è e quali operazioni si possono fare con lui. I tipi di base sono quattro.

| Tipo | Esempi di valori | In Python | In C++ |
|---|---|---|---|
| numero intero | `15`, `-3`, `0` | `int` | `int` |
| numero con la virgola | `2.5`, `-0.75` | `float` | `double` |
| testo (stringa) | `"Giulia"`, `"3"` | `str` | `string` |
| booleano | vero oppure falso | `bool`, con `True` e `False` | `bool`, con `true` e `false` |

Nei programmi la virgola dei decimali è un punto, come nei paesi di lingua inglese: `2.5`, non `2,5`. Un testo si scrive tra virgolette, e si chiama **stringa** perché è una fila di caratteri; un valore booleano può essere solo vero o falso, e servirà per le condizioni.

Il tipo conta perché lo stesso segno fa cose diverse su tipi diversi. Tra due numeri `+` è l'addizione; tra due stringhe le attacca una dopo l'altra. E `"3"`, con le virgolette, è un testo di un carattere, non il numero tre.

```codice python
a = 3
b = 4
print(a + b)

s = "3"
t = "4"
print(s + t)

print(7 / 2)
print(7 // 2)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int a = 3, b = 4;
    cout << a + b << endl;

    string s = "3", t = "4";
    cout << s + t << endl;

    cout << 7 / 2 << endl;
    cout << 7.0 / 2 << endl;
    return 0;
}
```

Le prime due righe scritte sono 7 e 34: la somma di due numeri e due testi messi in fila. Prova a sommare un numero e un testo, con `a + s`: i due linguaggi rifiutano l'operazione, perché non c'è un modo sensato di farla.

```ad-note
La divisione nei due linguaggi
In C++ la divisione tra due interi dà un intero e butta via la parte dopo la virgola: `7 / 2` fa 3. Per avere 3.5 almeno uno dei due numeri deve essere con la virgola, come in `7.0 / 2`. In Python `/` dà sempre il risultato con la virgola, 3.5, e la divisione intera ha un segno suo, `//`.
```

```ad-warning
In C++ la media di due interi perde i decimali
Con `int a = 7, b = 2;` l'istruzione `double media = (a + b) / 2;` mette in `media` il valore 4, non 4.5: il conto a destra è tra interi e si fa prima dell'assegnamento, quando i decimali sono già persi. Si corregge dividendo per `2.0`.
```

## Leggere un valore e convertirlo

Un programma utile lavora su dati che arrivano da chi lo usa. Quello che si scrive sulla tastiera è sempre una fila di caratteri, cioè un testo: per farci dei conti bisogna convertirlo in un numero. Il programma legge il prezzo di un quaderno e quanti quaderni compri, calcola il totale e lo scrive: tre passi uno dopo l'altro, cioè una sequenza.

```tikz
% nome: diagramma-flusso-totale-quaderni
% alt: Diagramma di flusso in sequenza: dopo l'inizio si legge prezzo, poi si legge quantita, poi un rettangolo assegna a totale il prodotto di prezzo per quantita, poi si scrive totale e si arriva alla fine
% svg: diagramma-flusso-totale-quaderni-327a6755.svg 147x256
\begin{tikzpicture}
\tikzset{
  estremo/.style={draw, thick, rounded corners=9pt, minimum width=2.2cm, minimum height=0.65cm, fill=green!15, font=\small},
  azione/.style={draw, thick, minimum width=2.8cm, minimum height=0.7cm, align=center, fill=blue!12, font=\small},
  testo/.style={font=\small, align=center},
  freccia/.style={-{Stealth}, thick}
}
% ingresso o uscita: parallelogramma largo 3 e alto 0.7, centrato in (x,y)
\newcommand{\dati}[3]{\draw[thick, fill=orange!20] (#1-1.35,#2-0.35) -- (#1+1.65,#2-0.35) -- (#1+1.35,#2+0.35) -- (#1-1.65,#2+0.35) -- cycle; \node[testo] at (#1,#2) {#3};}
\node[estremo] (inizio) at (0,0) {inizio};
\dati{0}{-1.2}{leggi \textit{prezzo}}
\dati{0}{-2.4}{leggi \textit{quantita}}
\node[azione] (calcolo) at (0,-3.6) {$\textit{totale} \leftarrow \textit{prezzo} \cdot \textit{quantita}$};
\dati{0}{-4.8}{scrivi \textit{totale}}
\node[estremo] (fine) at (0,-6.0) {fine};
\draw[freccia] (inizio) -- (0,-0.85);
\draw[freccia] (0,-1.55) -- (0,-2.05);
\draw[freccia] (0,-2.75) -- (calcolo.north);
\draw[freccia] (calcolo.south) -- (0,-4.45);
\draw[freccia] (0,-5.15) -- (fine);
\end{tikzpicture}
```

```codice python
prezzo = float(input("Prezzo di un quaderno: "))
quantita = int(input("Quanti quaderni: "))
totale = prezzo * quantita
print("Totale:", totale, "euro")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    double prezzo;
    int quantita;
    cout << "Prezzo di un quaderno: ";
    cin >> prezzo;
    cout << "Quanti quaderni: ";
    cin >> quantita;
    double totale = prezzo * quantita;
    cout << "Totale: " << totale << " euro" << endl;
    return 0;
}
```

```ad-note
Chi fa la conversione
In Python `input()` restituisce sempre una stringa, e la conversione la chiedi tu: `int(...)` trasforma il testo in un numero intero, `float(...)` in un numero con la virgola. In C++ la fa `cin >>`, che guarda il tipo dichiarato della variabile in cui deve mettere il valore: per questo `prezzo` e `quantita` sono dichiarate prima di leggere.
```

Esegui il programma con 1.5 e 3: il totale è 4.5. Poi scrivi il prezzo con la virgola, 1,5: Python si ferma con un errore, perché `1,5` non è un numero scritto come lui se lo aspetta; il C++ legge 1, si blocca sulla virgola e scrive un totale sbagliato.

```ad-warning
In Python, un numero letto senza conversione resta un testo
Con `quantita = input()` e la risposta 3, la variabile contiene la stringa `"3"`. Allora `quantita + 1` dà un errore, e `quantita + quantita` dà `"33"`, non 6.
```

## Scambiare due variabili

Scambiare i valori di due variabili `a` e `b` sembra un lavoro da due istruzioni, `a = b` e poi `b = a`. La tabella di traccia, con 3 in `a` e 8 in `b`, mostra che non funziona: la prima istruzione cancella il 3, e da lì nessuno lo può più recuperare.

| Istruzione | `a` | `b` |
|---|---|---|
| valori iniziali | $3$ | $8$ |
| `a = b` | $8$ | $8$ |
| `b = a` | $8$ | $8$ |

È lo stesso problema di chi vuole scambiare il contenuto di due bicchieri pieni: serve un terzo bicchiere, vuoto. Nel programma il terzo bicchiere è una variabile in più, qui chiamata `temp`, che mette da parte il valore di `a` prima che venga cancellato.

| Istruzione | `a` | `b` | `temp` |
|---|---|---|---|
| valori iniziali | $3$ | $8$ | |
| `temp = a` | $3$ | $8$ | $3$ |
| `a = b` | $8$ | $8$ | $3$ |
| `b = temp` | $8$ | $3$ | $3$ |

## Prova tu

Il primo programma legge due numeri interi: i punti che hai e il bonus dell'ultima partita. Aggiungi il bonus ai punti, in modo che il programma scriva il nuovo punteggio.

```codice python
punti = int(input())
bonus = int(input())
# scrivi qui l'assegnamento

print(punti)
%% soluzione
punti = int(input())
bonus = int(input())
punti = punti + bonus

print(punti)
%% prova
10
5
%% stampa
15
%% prova
0
7
%% stampa
7
%% prova
8
-3
%% stampa
5
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int punti, bonus;
    cin >> punti;
    cin >> bonus;
    // scrivi qui l'assegnamento

    cout << punti << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int punti, bonus;
    cin >> punti;
    cin >> bonus;
    punti = punti + bonus;

    cout << punti << endl;
    return 0;
}
```

Il secondo programma legge due numeri interi in `a` e in `b` e li scrive uno per riga. Scambia i valori delle due variabili con le tre istruzioni della tabella, in modo che il programma scriva prima il secondo numero letto e poi il primo. Le due istruzioni che scrivono non vanno toccate.

```codice python
a = int(input())
b = int(input())
# scrivi qui lo scambio

print(a)
print(b)
%% soluzione
a = int(input())
b = int(input())
temp = a
a = b
b = temp

print(a)
print(b)
%% prova
3
8
%% stampa
8
3
%% prova
-2
10
%% stampa
10
-2
%% prova
5
5
%% stampa
5
5
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a;
    cin >> b;
    // scrivi qui lo scambio

    cout << a << endl;
    cout << b << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a;
    cin >> b;
    int temp = a;
    a = b;
    b = temp;

    cout << a << endl;
    cout << b << endl;
    return 0;
}
```
