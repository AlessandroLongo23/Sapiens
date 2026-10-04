# La selezione a due vie

Alla cassa di un negozio il conto non si calcola sempre allo stesso modo: chi ha speso almeno $50$ euro ha uno sconto, gli altri pagano il prezzo pieno. Un programma fatto solo di istruzioni in fila le esegue tutte, ogni volta, nello stesso ordine, e una regola così non la sa scrivere. Gli serve la **selezione**, la struttura con cui il programma sceglie quali istruzioni eseguire guardando i dati che ha davanti.

## La condizione è una domanda con risposta sì o no

Ogni selezione parte da una **condizione**: un'espressione che, con i valori di quel momento, è vera oppure falsa. "La spesa è almeno $50$?" è una condizione, perché la risposta è sì o no; "quanto hai speso?" non lo è.

Le condizioni di questa lezione sono confronti tra due valori, e i sei operatori di confronto si scrivono allo stesso modo in Python e in C++: `==` (uguale), `!=` (diverso), `<`, `>`, `<=` (minore o uguale), `>=` (maggiore o uguale). Con `voto` che vale $7$, la condizione `voto >= 6` è vera e `voto == 10` è falsa.

```ad-warning
Un solo = non confronta
`=` è l'assegnamento, che mette un valore in una variabile; il confronto è `==`, con due segni. In Python `if voto = 10:` è un errore e il programma non parte. In C++ `if (voto = 10)` viene accettato, e fa una cosa diversa da quella che volevi: mette $10$ in `voto` e considera la condizione vera, qualunque voto fosse stato letto.
```

## La selezione a una via: `if`

Il negozio dell'inizio toglie $10$ euro a chi ne spende almeno $50$. Il programma legge la spesa, si chiede se è almeno $50$ e, solo quando la risposta è sì, avvisa dello sconto e lo toglie; poi, in tutti e due i casi, scrive quanto si paga. Questa è la **selezione a una via**: se la condizione è vera il programma esegue alcune istruzioni in più, se è falsa le salta e prosegue.

Nel diagramma di flusso la condizione sta nel rombo, da cui escono due frecce, una per il sì e una per il no. Qui il ramo del no non contiene niente e scende dritto al punto in cui i due rami si riuniscono.

```tikz
% nome: diagramma-flusso-sconto-una-via
% alt: Diagramma di flusso della selezione a una via: dopo l'inizio si legge la spesa; un rombo chiede se la spesa è maggiore o uguale a 50; il ramo sì porta a scrivere "sconto di 10 euro" e a togliere 10 dalla spesa; il ramo no scende dritto; i due rami si riuniscono prima di scrivere la spesa e della fine
\begin{tikzpicture}
\tikzset{
  estremo/.style={draw, thick, rounded corners=9pt, minimum width=2.2cm, minimum height=0.65cm, fill=green!15, font=\small},
  azione/.style={draw, thick, minimum width=2.8cm, minimum height=0.7cm, align=center, fill=blue!12, font=\small},
  testo/.style={font=\small, align=center},
  freccia/.style={-{Stealth}, thick}
}
\newcommand{\dati}[3]{\draw[thick, fill=orange!20] (#1-1.35,#2-0.35) -- (#1+1.65,#2-0.35) -- (#1+1.35,#2+0.35) -- (#1-1.65,#2+0.35) -- cycle; \node[testo] at (#1,#2) {#3};}
\newcommand{\scelta}[3]{\draw[thick, fill=yellow!25] (#1-1.6,#2) -- (#1,#2+0.6) -- (#1+1.6,#2) -- (#1,#2-0.6) -- cycle; \node[testo] at (#1,#2) {#3};}
\node[estremo] (inizio) at (0,0) {inizio};
\dati{0}{-1.2}{leggi $\mathit{spesa}$}
\scelta{0}{-2.6}{$\mathit{spesa} \geq 50$?}
\draw[thick, fill=orange!20] (2.05,-4.35) -- (6.05,-4.35) -- (5.75,-3.65) -- (1.75,-3.65) -- cycle; \node[testo] at (3.9,-4.0) {scrivi ``sconto di 10 euro''};
\node[azione] (togli) at (3.9,-5.2) {$\mathit{spesa} \leftarrow \mathit{spesa} - 10$};
\dati{0}{-7.0}{scrivi $\mathit{spesa}$}
\node[estremo] (fine) at (0,-8.2) {fine};
\draw[freccia] (inizio) -- (0,-0.85);
\draw[freccia] (0,-1.55) -- (0,-2.0);
\draw[freccia] (1.6,-2.6) -| node[pos=0.25, above, font=\footnotesize] {sì} (3.9,-3.65);
\draw[freccia] (3.9,-4.35) -- (togli.north);
\draw[freccia] (togli.south) |- (0,-6.1);
\draw[freccia] (0,-3.2) -- node[pos=0.12, right, font=\footnotesize] {no} (0,-6.65);
\draw[freccia] (0,-7.35) -- (fine.north);
\end{tikzpicture}
```

Nel programma la prima riga legge un numero intero dalla tastiera e lo mette nella variabile `spesa`, l'ultima scrive il risultato; in mezzo c'è la selezione, che comincia con la parola `if` ("se") seguita dalla condizione.

```codice python
spesa = int(input("Spesa in euro: "))

if spesa >= 50:
    print("Sconto di 10 euro")
    spesa = spesa - 10

print("Paghi", spesa, "euro")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int spesa;
    cout << "Spesa in euro: ";
    cin >> spesa;

    if (spesa >= 50) {
        cout << "Sconto di 10 euro" << endl;
        spesa = spesa - 10;
    }

    cout << "Paghi " << spesa << " euro" << endl;
    return 0;
}
```

Eseguilo con $80$: compare l'avviso e paghi $70$ euro. Con $30$ l'avviso non compare e paghi $30$. Prima di provare con $50$ decidi tu che cosa uscirà, poi cambia `>=` in `>` e riprova con lo stesso numero: è sul valore di confine che i due operatori si comportano in modo diverso.

## Il blocco: le istruzioni che dipendono dalla condizione

Le istruzioni che il programma esegue solo quando la condizione è vera formano un **blocco**. Nel programma dello sconto il blocco ha due istruzioni, l'avviso e la sottrazione, mentre la riga che scrive quanto si paga ne è fuori e viene eseguita sempre. I due linguaggi segnano il confine del blocco in modo diverso.

In Python la riga dell'`if` finisce con i due punti e il blocco è fatto dalle righe successive scritte più a destra, tutte con lo stesso rientro di quattro spazi. La prima riga che torna a sinistra è già fuori dal blocco.

```ad-warning
Python: i due punti e il rientro
Senza i due punti in fondo alla riga dell'`if`, o senza il rientro nella riga che segue, il programma non parte e l'errore indica la riga. Più insidioso è il rientro dimenticato su una riga sola: se `spesa = spesa - 10` torna a sinistra, il programma parte, ma quella riga è uscita dal blocco e toglie $10$ euro anche a chi ne ha spesi $30$.
```

In C++ la condizione va tra parentesi tonde e il blocco è racchiuso tra parentesi graffe. Il rientro non conta per il compilatore, ma si scrive lo stesso, perché a chi legge fa vedere subito dove comincia e dove finisce il blocco.

```ad-warning
C++: il punto e virgola e le graffe
Dopo la condizione non va il punto e virgola: `if (spesa >= 50);` chiude la selezione su quella riga, e il blocco che segue viene eseguito sempre. Senza le graffe, invece, dalla condizione dipende solo la prima istruzione: l'avviso comparirebbe quando deve, ma i $10$ euro verrebbero tolti a tutti. In nessuno dei due casi il compilatore si ferma.
```

Prova a fare apposta uno di questi errori nel programma dello sconto e a eseguirlo con $30$: riconoscere il risultato sbagliato adesso ti farà risparmiare tempo quando l'errore capiterà senza volerlo.

## La selezione a due vie: `if ... else`

Spesso c'è qualcosa da fare anche quando la risposta è no. Un esame è superato se il voto è almeno $6$, e il programma deve dire "promosso" in un caso e "bocciato" nell'altro. Nella **selezione a due vie** i blocchi sono due: il primo viene eseguito se la condizione è vera, il secondo, introdotto dalla parola `else` ("altrimenti"), se è falsa. Il programma percorre sempre uno dei due, mai tutti e due e mai nessuno.

Nel diagramma i due rami del rombo hanno ciascuno il proprio blocco e si riuniscono prima della fine.

```tikz
% nome: diagramma-flusso-promosso-due-vie
% alt: Diagramma di flusso della selezione a due vie: dopo l'inizio si legge il voto; un rombo chiede se il voto è maggiore o uguale a 6; il ramo sì porta a scrivere "promosso", il ramo no a scrivere "bocciato"; i due rami si riuniscono alla fine
\begin{tikzpicture}
\tikzset{
  estremo/.style={draw, thick, rounded corners=9pt, minimum width=2.2cm, minimum height=0.65cm, fill=green!15, font=\small},
  testo/.style={font=\small, align=center},
  freccia/.style={-{Stealth}, thick}
}
\newcommand{\dati}[3]{\draw[thick, fill=orange!20] (#1-1.35,#2-0.35) -- (#1+1.65,#2-0.35) -- (#1+1.35,#2+0.35) -- (#1-1.65,#2+0.35) -- cycle; \node[testo] at (#1,#2) {#3};}
\newcommand{\scelta}[3]{\draw[thick, fill=yellow!25] (#1-1.6,#2) -- (#1,#2+0.6) -- (#1+1.6,#2) -- (#1,#2-0.6) -- cycle; \node[testo] at (#1,#2) {#3};}
\node[estremo] (inizio) at (0,0) {inizio};
\dati{0}{-1.2}{leggi $\mathit{voto}$}
\scelta{0}{-2.6}{$\mathit{voto} \geq 6$?}
\dati{-2.7}{-4.0}{scrivi ``promosso''}
\dati{2.7}{-4.0}{scrivi ``bocciato''}
\node[estremo] (fine) at (0,-5.3) {fine};
\draw[freccia] (inizio) -- (0,-0.85);
\draw[freccia] (0,-1.55) -- (0,-2.0);
\draw[freccia] (-1.6,-2.6) -| node[pos=0.25, above, font=\footnotesize] {sì} (-2.7,-3.65);
\draw[freccia] (1.6,-2.6) -| node[pos=0.25, above, font=\footnotesize] {no} (2.7,-3.65);
\draw[freccia] (-2.7,-4.35) |- (fine.west);
\draw[freccia] (2.7,-4.35) |- (fine.east);
\end{tikzpicture}
```

```codice python
voto = int(input("Voto: "))

if voto >= 6:
    print("promosso")
else:
    print("bocciato")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int voto;
    cout << "Voto: ";
    cin >> voto;

    if (voto >= 6) {
        cout << "promosso" << endl;
    } else {
        cout << "bocciato" << endl;
    }
    return 0;
}
```

In Python `else` si scrive allineato all'`if`, seguito dai due punti, e il suo blocco è rientrato come l'altro; in C++ sta tra la graffa che chiude il primo blocco e quella che apre il secondo. Esegui il programma con $8$, con $4$ e con $6$. Poi aggiungi una seconda istruzione al blocco dell'`else`, per esempio la scritta "ripassa e riprova", e controlla che compaia solo con i voti insufficienti. È la stessa scelta che nel foglio di calcolo fa la funzione `SE`, che hai incontrato in [Condizioni e funzioni logiche](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/condizioni-e-funzioni-logiche): una condizione, che cosa scrivere se è vera, che cosa scrivere se è falsa.

```ad-warning
L'else non ha una condizione
Dopo `else` non si scrive niente: `else voto < 6` è un errore in tutti e due i linguaggi. Non serve, perché all'`else` arrivano tutti i casi in cui la condizione dell'`if` è falsa, e solo quelli.
```

## Pari o dispari

Un numero intero è pari quando il resto della sua divisione per $2$ è $0$. Il resto si calcola con l'operatore `%`, per cui `7 % 2` vale $1$ e `10 % 2` vale $0$; la condizione "il resto è uguale a zero" richiede il confronto con `==`.

```codice python
n = int(input("Numero: "))

if n % 2 == 0:
    print(n, "è pari")
else:
    print(n, "è dispari")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Numero: ";
    cin >> n;

    if (n % 2 == 0) {
        cout << n << " è pari" << endl;
    } else {
        cout << n << " è dispari" << endl;
    }
    return 0;
}
```

Provalo con $0$ e con un numero negativo come $-7$. Poi cambia il $2$ in $3$ e correggi le due scritte, in modo che il programma dica se il numero è un multiplo di $3$ oppure no.

## Prova tu

Il primo esercizio chiede una selezione a due vie. Il programma legge due numeri interi `a` e `b`, uno per riga, e deve stampare il maggiore dei due; se sono uguali, stampa quel valore. Il programma di partenza stampa sempre `a`.

```codice python
a = int(input())
b = int(input())
# scrivi qui la selezione
print(a)
%% soluzione
a = int(input())
b = int(input())
if a > b:
    print(a)
else:
    print(b)
%% prova
3
7
%% stampa
7
%% prova
9
2
%% stampa
9
%% prova
5
5
%% stampa
5
%% prova
-4
-1
%% stampa
-1
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    // scrivi qui la selezione
    cout << a << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    if (a > b) {
        cout << a << endl;
    } else {
        cout << b << endl;
    }
    return 0;
}
```

Nel secondo esercizio decidi tu se serve una via o ne servono due. Un negozio online spedisce gratis gli ordini di almeno $30$ euro e aggiunge $5$ euro di spedizione a quelli più piccoli. Il programma legge la spesa, un numero intero, e deve stampare il totale da pagare; quello di partenza dimentica la spedizione.

```codice python
spesa = int(input())
# scrivi qui la selezione

print(spesa)
%% soluzione
spesa = int(input())
if spesa < 30:
    spesa = spesa + 5

print(spesa)
%% prova
20
%% stampa
25
%% prova
30
%% stampa
30
%% prova
29
%% stampa
34
%% prova
100
%% stampa
100
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int spesa;
    cin >> spesa;
    // scrivi qui la selezione

    cout << spesa << endl;
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int spesa;
    cin >> spesa;
    if (spesa < 30) {
        spesa = spesa + 5;
    }

    cout << spesa << endl;
    return 0;
}
```

Una condizione sola e due strade non coprono tutto: per chiedere due cose insieme ("almeno $6$ e non più di $10$") servono gli operatori logici, e per scegliere tra tre o più casi le selezioni annidate e a più vie, che hanno ciascuna la propria lezione in questo capitolo.
