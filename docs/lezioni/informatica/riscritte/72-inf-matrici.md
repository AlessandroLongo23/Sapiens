# Le matrici

Il registro di una classe non è una fila di voti: è una tabella, con una riga per ogni studente e una colonna per ogni verifica. Con un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori) per studente servirebbero tanti vettori quanti sono gli studenti, ognuno con il suo nome, e nessun ciclo potrebbe passare dall'uno all'altro. Una matrice tiene tutta la tabella sotto un nome solo, e due cicli la percorrono per righe o per colonne.

## Una tabella con due indici

Una **matrice** è una tabella di elementi dello stesso tipo, disposti in righe e colonne. Per indicare un elemento servono due indici: il primo dice la **riga**, il secondo la **colonna**, e tutti e due partono da $0$, come l'indice di un vettore. Se la matrice si chiama `m`, l'elemento della riga `i` e della colonna `j` si scrive `m[i][j]`.

Tre studenti hanno fatto quattro verifiche. La matrice `voti` ha $3$ righe e $4$ colonne, quindi $3 \cdot 4 = 12$ elementi. Nella figura tocca un voto e leggi i suoi due indici; poi cerca `voti[1][2]` e `voti[2][1]`, e l'elemento in basso a destra.

```interattivo
% nome: inf-matrice-indici
% alt: La matrice voti con tre righe e quattro colonne: nella riga 0 i voti 7, 8, 6 e 9, nella riga 1 i voti 5, 6, 7 e 6, nella riga 2 i voti 8, 9, 9 e 10. Gli indici delle righe, da 0 a 2, sono scritti a sinistra e quelli delle colonne, da 0 a 3, in alto. Toccando un voto si accendono la sua riga e la sua colonna, il nome i si sposta accanto all'indice della riga e il nome j sopra quello della colonna, e tre riquadri mostrano i, j e l'elemento voti[i][j]: per esempio i uguale a 1, j uguale a 2 e voti[1][2] uguale a 7
```

`voti[1][2]` vale $7$ ed è il voto dello studente $1$ nella verifica $2$; `voti[2][1]` vale $9$, perché scambiando i due indici si arriva a un altro elemento. L'elemento in basso a destra è `voti[2][3]`: con $3$ righe gli indici di riga vanno da $0$ a $2$, con $4$ colonne quelli di colonna da $0$ a $3$. Il programma crea la matrice, legge un elemento e ne corregge un altro.

```codice python
voti = [
    [7, 8, 6, 9],
    [5, 6, 7, 6],
    [8, 9, 9, 10]
]
R = len(voti)
C = len(voti[0])
print("Righe e colonne:", R, C)
print("Studente 1, verifica 2:", voti[1][2])
voti[1][0] = 6
print("Dopo la correzione:", voti[1][0])
```

```codice cpp
#include <iostream>
using namespace std;

const int R = 3;
const int C = 4;

int main() {
    int voti[R][C] = {
        {7, 8, 6, 9},
        {5, 6, 7, 6},
        {8, 9, 9, 10}
    };
    cout << "Righe e colonne: " << R << " " << C << endl;
    cout << "Studente 1, verifica 2: " << voti[1][2] << endl;
    voti[1][0] = 6;
    cout << "Dopo la correzione: " << voti[1][0] << endl;
    return 0;
}
```

```ad-note
Che cosa cambia tra Python e C++
In C++ si dichiarano il tipo degli elementi e le due dimensioni, prima le righe e poi le colonne: `int voti[R][C]`, con `R` e `C` costanti scritte in cima al programma. In Python una matrice è una lista di liste: `voti[1]` è l'intera riga $1$, cioè la lista `[5, 6, 7, 6]`, e `voti[1][2]` è il suo elemento di indice $2$. Per questo `len(voti)` dà il numero delle righe e `len(voti[0])`, la lunghezza di una riga, il numero delle colonne.
```

```ad-warning
Gli indici scambiati e l'indice che esce dalla matrice
`voti[3][1]` non esiste, perché le righe sono tre e l'ultima ha indice $2$: di solito è `voti[1][3]` scritto con gli indici al contrario. Python si ferma con `IndexError`, come per un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori). Il C++ non controlla e stampa un numero che non è un voto; con `voti[0][4]`, che esce dalla riga $0$ di un solo posto, stampa $5$, il primo voto della riga dopo, e l'errore non si vede.
```

## La somma di ogni riga con due cicli annidati

Un vettore si scorre con un ciclo. Una matrice ne chiede due, uno dentro l'altro, come i [cicli annidati](/materiale/scuola-superiore/informatica/l-iterazione/cicli-annidati) che disegnavano i rettangoli di asterischi: il ciclo esterno sceglie la riga con l'indice `i`, quello interno la percorre da sinistra a destra con l'indice `j`, e il corpo interno lavora su `voti[i][j]`. Il corpo viene eseguito una volta per elemento, cioè $R \cdot C$ volte.

Il totale di uno studente è la somma di una riga. Per ogni riga serve un [accumulatore](/materiale/scuola-superiore/informatica/l-iterazione/contatori-e-accumulatori): parte da $0$, il ciclo interno gli aggiunge i quattro voti, e quando il ciclo interno è finito la somma di quella riga è pronta. Prima di eseguire la figura prova a dire in che ordine vengono visitati i dodici voti e quante volte `somma` torna a $0$. Poi esegui un passo alla volta fino alla fine della riga $0$, guardando `i`, `j` e `somma`; toccando un voto salti al passo in cui viene aggiunto.

```interattivo
% nome: inf-matrice-somme
% alt: La matrice voti di tre righe e quattro colonne percorsa da due cicli annidati, un passo alla volta. Una scelta in alto decide se sommare per righe o per colonne. Per righe l'indice i resta fermo su una riga mentre j scorre le quattro colonne: l'elemento appena aggiunto è arancione, quelli già sommati hanno il bordo scuro, le righe finite sono verdi. Tre riquadri mostrano i, j e somma, che nella riga 0 passa da 0 a 7, 15, 21 e 30 e poi riparte da 0; un quarto riquadro raccoglie le somme scritte, 30, 24 e 36. Per colonne è j a restare fermo mentre i scende lungo le tre righe, e le somme scritte sono 20, 23, 22 e 25
```

I voti vengono visitati una riga alla volta, da sinistra a destra: `j` corre da $0$ a $3$ mentre `i` resta fermo, e solo dopo `i` avanza. La variabile `somma` torna a $0$ tre volte, una all'inizio di ogni riga, e le somme scritte sono $30$, $24$ e $36$. Nel programma l'azzeramento e la stampa stanno dentro il ciclo esterno e fuori da quello interno: una volta per riga. In C++ `somma` è dichiarata `double` perché la media abbia i decimali, come nella lezione sulla [media di una sequenza](/materiale/scuola-superiore/informatica/l-iterazione/massimo-minimo-e-media-di-una-sequenza).

```codice python
voti = [
    [7, 8, 6, 9],
    [5, 6, 7, 6],
    [8, 9, 9, 10]
]
R = len(voti)
C = len(voti[0])
for i in range(R):
    somma = 0
    for j in range(C):
        somma = somma + voti[i][j]
    print("Studente", i, "totale", somma, "media", somma / C)
```

```codice cpp
#include <iostream>
using namespace std;

const int R = 3;
const int C = 4;

int main() {
    int voti[R][C] = {
        {7, 8, 6, 9},
        {5, 6, 7, 6},
        {8, 9, 9, 10}
    };
    for (int i = 0; i < R; i++) {
        double somma = 0;
        for (int j = 0; j < C; j++) {
            somma = somma + voti[i][j];
        }
        cout << "Studente " << i << " totale " << somma << " media " << somma / C << endl;
    }
    return 0;
}
```

```ad-warning
La somma azzerata nel posto sbagliato
Sposta `somma = 0` sopra il ciclo esterno ed esegui: i totali diventano $30$, $54$ e $90$, perché ogni studente si porta dietro i voti di quelli prima di lui. Se invece l'azzeramento finisce dentro il ciclo interno, `somma` riparte a ogni voto e alla fine contiene solo l'ultimo della riga: $9$, $6$ e $10$.
```

Rimetti l'azzeramento al suo posto e aggiungi una quarta riga con i voti di un altro studente: in Python i cicli la trovano da soli, in C++ devi portare `R` a $4$.

## Sommare per colonne

La media di una verifica riguarda una colonna: gli stessi dodici voti, raggruppati in un altro modo. Nella figura scegli "Per colonne" e guarda quale dei due indici resta fermo. Adesso è `j`: il ciclo esterno sceglie la colonna, quello interno scende lungo le righe con `i`, e le somme sono $20$, $23$, $22$ e $25$. I due cicli si scambiano di posto, ma l'elemento si scrive ancora `voti[i][j]`, perché la riga viene sempre prima della colonna.

```
per ogni colonna j, da 0 a C - 1:
    somma = 0
    per ogni riga i, da 0 a R - 1:
        somma = somma + voti[i][j]
    scrivi somma
```

Modifica il programma dei totali perché scriva la somma e la media di ogni verifica: scambia le due righe dei cicli, e dividi per `R`, che è il numero dei voti di una colonna.

```ad-warning
Scambiare i cicli e anche gli indici
Chi scambia i cicli e scrive anche `voti[j][i]` fa due scambi che si annullano: il programma torna a sommare per righe, e in una matrice che non è quadrata esce dalla tabella. Si scambiano solo i cicli.
```

## La diagonale di una matrice quadrata

Una matrice è **quadrata** quando ha tante righe quante colonne, come il campo del tris, che è $3 \times 3$. In una matrice quadrata di $N$ righe la **diagonale principale** va dall'angolo in alto a sinistra a quello in basso a destra, ed è fatta degli elementi con i due indici uguali: `m[0][0]`, `m[1][1]`, `m[2][2]`. Per percorrerla serve un ciclo solo, con l'elemento `m[i][i]`.

Il programma tiene il campo del tris in una matrice di testi e controlla se la X ha fatto tris sulla diagonale principale, contando le X che ci trova.

```codice python
campo = [
    ["X", "O", "O"],
    ["X", "O", "X"],
    ["O", "X", "X"]
]
N = len(campo)
conta = 0
for i in range(N):
    if campo[i][i] == "X":
        conta = conta + 1
if conta == N:
    print("Tris sulla diagonale")
else:
    print("Nessun tris: i segni giusti sono", conta)
```

```codice cpp
#include <iostream>
#include <string>
using namespace std;

const int N = 3;

int main() {
    string campo[N][N] = {
        {"X", "O", "O"},
        {"X", "O", "X"},
        {"O", "X", "X"}
    };
    int conta = 0;
    for (int i = 0; i < N; i++) {
        if (campo[i][i] == "X") {
            conta = conta + 1;
        }
    }
    if (conta == N) {
        cout << "Tris sulla diagonale" << endl;
    } else {
        cout << "Nessun tris: i segni giusti sono " << conta << endl;
    }
    return 0;
}
```

Sulla diagonale principale ci sono X, O e X, e il programma conta due segni giusti su tre. L'altra diagonale, quella **secondaria**, scende dall'angolo in alto a destra: i suoi elementi sono `campo[0][2]`, `campo[1][1]` e `campo[2][0]`, e in ognuno i due indici hanno somma $N - 1$, quindi l'elemento della riga `i` è `campo[i][N - 1 - i]`. Cambia l'indice di colonna e cerca la O al posto della X: il tris c'è.

## Prova tu

Negli esercizi la matrice si riempie con numeri letti da tastiera, uno per riga, e la lettura c'è già. Usa gli stessi due cicli della stampa: in C++ ogni numero va direttamente in `m[i][j]`; in Python si costruisce una riga alla volta con `append`, come per un vettore, e poi si aggiunge la riga alla matrice.

Il programma legge i punti di $2$ squadre in $3$ partite, una riga della matrice per squadra. Scrivi i due cicli che stampano il totale dei punti di ogni partita, cioè la somma di ogni colonna, uno per riga.

```codice python
R = 2
C = 3
m = []
for i in range(R):
    riga = []
    for j in range(C):
        riga.append(int(input()))
    m.append(riga)
# scrivi qui i due cicli: una somma per colonna
%% soluzione
R = 2
C = 3
m = []
for i in range(R):
    riga = []
    for j in range(C):
        riga.append(int(input()))
    m.append(riga)
for j in range(C):
    somma = 0
    for i in range(R):
        somma = somma + m[i][j]
    print(somma)
%% prova
3
1
0
1
1
3
%% stampa
4
2
3
%% prova
10
20
30
1
2
3
%% stampa
11
22
33
```

```codice cpp
#include <iostream>
using namespace std;

const int R = 2;
const int C = 3;

int main() {
    int m[R][C];
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            cin >> m[i][j];
        }
    }
    // scrivi qui i due cicli: una somma per colonna

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int R = 2;
const int C = 3;

int main() {
    int m[R][C];
    for (int i = 0; i < R; i++) {
        for (int j = 0; j < C; j++) {
            cin >> m[i][j];
        }
    }
    for (int j = 0; j < C; j++) {
        int somma = 0;
        for (int i = 0; i < R; i++) {
            somma = somma + m[i][j];
        }
        cout << somma << endl;
    }

    return 0;
}
```

Nel secondo esercizio la matrice è quadrata, $3 \times 3$. Il programma deve scrivere su una riga la somma della diagonale principale e sulla riga dopo la somma della diagonale secondaria. Serve un ciclo solo, con due accumulatori.

```codice python
N = 3
m = []
for i in range(N):
    riga = []
    for j in range(N):
        riga.append(int(input()))
    m.append(riga)
# scrivi qui il ciclo e le due stampe
%% soluzione
N = 3
m = []
for i in range(N):
    riga = []
    for j in range(N):
        riga.append(int(input()))
    m.append(riga)
principale = 0
secondaria = 0
for i in range(N):
    principale = principale + m[i][i]
    secondaria = secondaria + m[i][N - 1 - i]
print(principale)
print(secondaria)
%% prova
1
2
3
4
5
6
7
8
9
%% stampa
15
15
%% prova
1
0
0
0
1
0
8
0
1
%% stampa
3
9
%% prova
0
7
4
-2
0
6
3
9
0
%% stampa
0
7
```

```codice cpp
#include <iostream>
using namespace std;

const int N = 3;

int main() {
    int m[N][N];
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            cin >> m[i][j];
        }
    }
    // scrivi qui il ciclo e le due stampe

    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

const int N = 3;

int main() {
    int m[N][N];
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            cin >> m[i][j];
        }
    }
    int principale = 0;
    int secondaria = 0;
    for (int i = 0; i < N; i++) {
        principale = principale + m[i][i];
        secondaria = secondaria + m[i][N - 1 - i];
    }
    cout << principale << endl;
    cout << secondaria << endl;

    return 0;
}
```
