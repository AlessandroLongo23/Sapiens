# File di dati in formato CSV

Il registro dei voti sta in un foglio di calcolo, la classifica del torneo in un'app, e il programma che hai scritto tu legge solo [file di testo](/materiale/scuola-superiore/informatica/i-file/leggere-e-scrivere-un-file-di-testo). Perché i tre si passino i dati serve un modo di scrivere una tabella che tutti sappiano leggere. Il più diffuso è il più povero: un file di testo con una riga per ogni riga della tabella.

## Una tabella scritta come testo

Un file **CSV** (comma-separated values, valori separati da virgole) contiene una [tabella di dati](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/ordinare-filtrare-e-riassumere-i-dati): ogni riga del file è una riga della tabella, e dentro la riga i valori delle celle sono scritti uno dopo l'altro, divisi da un carattere scelto apposta. Ogni valore è un **campo**, il carattere che li divide è il **separatore**, di solito la virgola. La prima riga è quasi sempre la **riga di intestazione**: i suoi campi non sono dati, sono i nomi delle colonne.

```tikz
% nome: struttura-file-csv
% alt: Le quattro righe di un file CSV disegnate una sotto l'altra, con ogni campo in un riquadro e una virgola tra un riquadro e il successivo. La prima riga, con i campi nome, materia e voto, è indicata come riga di intestazione; le tre righe sotto, Anna matematica 8, Luca fisica 6 e Sara storia 7, sono indicate come dati, un voto per riga. Una freccia indica un riquadro con la scritta campo, un'altra indica una virgola con la scritta separatore
\begin{tikzpicture}
\tikzset{
  campo/.style={draw, thick, fill=blue!10, minimum height=0.55cm, inner xsep=3pt, font=\small\ttfamily},
  testa/.style={draw, thick, fill=orange!25, minimum height=0.55cm, inner xsep=3pt, font=\small\ttfamily},
  sep/.style={font=\ttfamily\bfseries, text=red}}
\node[testa, minimum width=1.2cm] at (0,0) {nome};
\node[sep] at (0.85,-0.08) {,};
\node[testa, minimum width=2.2cm] at (2.2,0) {materia};
\node[sep] at (3.55,-0.08) {,};
\node[testa, minimum width=1.0cm] at (4.3,0) {voto};
\node[campo, minimum width=1.2cm] at (0,-0.8) {Anna};
\node[sep] at (0.85,-0.88) {,};
\node[campo, minimum width=2.2cm] at (2.2,-0.8) {matematica};
\node[sep] at (3.55,-0.88) {,};
\node[campo, minimum width=1.0cm] at (4.3,-0.8) {8};
\node[campo, minimum width=1.2cm] at (0,-1.6) {Luca};
\node[sep] at (0.85,-1.68) {,};
\node[campo, minimum width=2.2cm] at (2.2,-1.6) {fisica};
\node[sep] at (3.55,-1.68) {,};
\node[campo, minimum width=1.0cm] at (4.3,-1.6) {6};
\node[campo, minimum width=1.2cm] at (0,-2.4) {Sara};
\node[sep] at (0.85,-2.48) {,};
\node[campo, minimum width=2.2cm] at (2.2,-2.4) {storia};
\node[sep] at (3.55,-2.48) {,};
\node[campo, minimum width=1.0cm] at (4.3,-2.4) {7};
\node[anchor=west, font=\small, align=left] at (5.0,0) {riga di\\intestazione};
\draw[thick] (5.1,-0.55) -- (5.25,-0.55) -- (5.25,-2.65) -- (5.1,-2.65);
\node[anchor=west, font=\small, align=left] at (5.3,-1.6) {i dati:\\un voto\\per riga};
\node[font=\small] (c) at (2.2,-3.5) {campo};
\draw[->, thick] (c) -- (2.2,-2.75);
\node[font=\small] (s) at (0.2,-3.5) {separatore};
\draw[->, thick, red] (s) -- (0.82,-2.72);
\end{tikzpicture}
```

Un file CSV si apre con qualunque editor di testo, e anche con un foglio di calcolo, che mette ogni campo in una cella. Nella direzione opposta il foglio di calcolo sa salvare una tabella in questo formato, ma nel file finiscono solo i valori che vedi nelle celle: le [formule](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/celle-valori-e-formule), i colori, i grafici e la larghezza delle colonne non ci sono più.

## Dividere una riga nei suoi campi

Per un programma una riga appena letta è un testo solo, `Anna,matematica,8`. Prima di usarla va tagliata dove ci sono i separatori. Nella figura scegli il file e il carattere a cui tagliare, poi vai avanti un passo alla volta: guarda in quale colonna finisce ogni campo, e che cosa succede a `voti.csv` se il programma taglia al punto e virgola.

```interattivo
% nome: inf-csv-campi
% alt: In alto le quattro righe del file voti.csv: nome,materia,voto poi Anna,matematica,8 poi Luca,fisica,6 poi Sara,storia,7. A ogni passo una riga viene letta come un testo solo, poi tagliata a ogni virgola: i tre campi compaiono numerati 0, 1 e 2 e finiscono nelle tre colonne di una tabella che si riempie, con la prima riga che dà i nomi delle colonne. Due scelte cambiano il file (voti.csv, con le virgole, oppure medie.csv, con i punti e virgola e numeri come 8,5) e il carattere a cui il programma taglia: con il carattere sbagliato ogni riga resta in un campo solo, oppure la virgola di 8,5 viene presa per un separatore e la riga ha un campo in più
```

Il taglio produce un [vettore](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/i-vettori) di testi, e la posizione dice che cos'è ciascuno: in questo file il campo 0 è il nome, il campo 1 la materia, il campo 2 il voto. Con il separatore sbagliato non c'è niente da tagliare, e tutta la riga resta nel campo 0. Il programma legge `voti.csv`, salta l'intestazione e usa due campi di ogni riga.

```codice python
with open("voti.csv") as file:
    file.readline()
    for riga in file:
        campi = riga.strip().split(",")
        print(campi[0], "ha preso", campi[2])
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream file("voti.csv");
    string riga, nome, materia, voto;
    getline(file, riga);
    while (getline(file, nome, ',')) {
        getline(file, materia, ',');
        getline(file, voto);
        cout << nome << " ha preso " << voto << endl;
    }
    file.close();
    return 0;
}
```

```codice voti.csv
nome,materia,voto
Anna,matematica,8
Luca,fisica,6
Sara,storia,7
```

```ad-note
Tagliare nei due linguaggi
In Python `split(",")` è un metodo delle [stringhe](/materiale/scuola-superiore/informatica/vettori-matrici-e-stringhe/le-stringhe): restituisce la lista dei pezzi, e prima `strip()` toglie l'a capo, che altrimenti resterebbe attaccato all'ultimo campo. In C++ `getline` con un terzo argomento legge fino a quel carattere e lo scarta: due letture fino alla virgola e una fino all'a capo danno i tre campi, uno per variabile. La prima lettura, quella dell'intestazione, serve solo a passare oltre.
```

Cancella la riga che salta l'intestazione ed esegui: la prima frase stampata è "nome ha preso voto". Poi cambia il separatore del programma in `;`, lasciando il file com'è: in Python `campi` ha un solo elemento e `campi[2]` ferma il programma con un `IndexError`, in C++ la prima lettura non trova nessun punto e virgola e si porta via tutto il file.

```ad-warning
L'intestazione trattata come un dato
Se non la salti, la prima riga entra nei conti come le altre: viene stampata, contata, e alla prima conversione in numero il testo `voto` ferma il programma. L'intestazione si legge una volta, prima del ciclo, e non si usa.
```

## Calcolare su una colonna

Calcolare su una colonna vuol dire prendere, riga dopo riga, il campo che sta sempre nella stessa posizione. Un campo letto è un testo anche quando contiene cifre, quindi per fare i conti va convertito. Il programma calcola la media della colonna dei voti, con un accumulatore e un contatore.

```codice python
somma = 0
quanti = 0
with open("voti.csv") as file:
    file.readline()
    for riga in file:
        campi = riga.strip().split(",")
        somma = somma + int(campi[2])
        quanti = quanti + 1
print("Media:", somma / quanti)
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream file("voti.csv");
    string riga, nome, materia, voto;
    double somma = 0;
    int quanti = 0;
    getline(file, riga);
    while (getline(file, nome, ',')) {
        getline(file, materia, ',');
        getline(file, voto);
        somma = somma + stoi(voto);
        quanti = quanti + 1;
    }
    file.close();
    cout << "Media: " << somma / quanti << endl;
    return 0;
}
```

```codice voti.csv
nome,materia,voto
Anna,matematica,8
Luca,fisica,6
Sara,storia,7
Anna,fisica,9
Luca,matematica,4
```

La media dei cinque voti è 6.8. Per avere la media dei soli voti di Anna, somma e conta dentro una selezione che guarda un altro campo della stessa riga: `if campi[0] == "Anna":` in Python, `if (nome == "Anna")` in C++. Deve uscire 8.5.

```ad-warning
La virgola dentro un dato
Se una media è scritta all'italiana, `7,5`, la riga `Sara,storia,7,5` ha quattro campi e il voto diventa 7. Per questo i programmi in italiano salvano spesso i file CSV con il punto e virgola come separatore, `Sara;storia;7,5`, e lo stesso file aperto con la virgola come separatore finisce tutto in una colonna. Prima di leggere un file CSV, aprilo e guarda quale separatore usa.
```

## Scrivere un file CSV

Scrivere è il lavoro opposto: i campi di ogni riga si attaccano con il separatore in mezzo e l'a capo in fondo, e la prima riga scritta è l'intestazione. Il programma legge `torneo.csv`, calcola i punti di ogni squadra (3 per ogni vittoria, 1 per ogni pareggio) e scrive `classifica.csv`, che dopo l'esecuzione trovi tra le linguette.

```codice python
with open("torneo.csv") as ingresso:
    with open("classifica.csv", "w") as uscita:
        ingresso.readline()
        uscita.write("squadra,punti\n")
        for riga in ingresso:
            campi = riga.strip().split(",")
            punti = 3 * int(campi[1]) + int(campi[2])
            uscita.write(campi[0] + "," + str(punti) + "\n")
print("Ho scritto classifica.csv")
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream ingresso("torneo.csv");
    ofstream uscita("classifica.csv");
    string riga, squadra, vinte, pareggiate;
    getline(ingresso, riga);
    uscita << "squadra,punti" << endl;
    while (getline(ingresso, squadra, ',')) {
        getline(ingresso, vinte, ',');
        getline(ingresso, pareggiate);
        int punti = 3 * stoi(vinte) + stoi(pareggiate);
        uscita << squadra << "," << punti << endl;
    }
    ingresso.close();
    uscita.close();
    cout << "Ho scritto classifica.csv" << endl;
    return 0;
}
```

```codice torneo.csv
squadra,vinte,pareggiate
Leoni,3,1
Falchi,2,2
Orsi,1,0
```

Il file scritto è un CSV come gli altri: un foglio di calcolo lo apre, e un altro programma lo legge con il ciclo di prima. Togli `"\n"` (in C++ `endl`) dalla scrittura della riga ed esegui di nuovo: tutti i campi finiscono su una riga sola, e nessuno saprebbe più dove comincia una squadra.

```ad-note
Quando un campo contiene il separatore
Un campo come `Rossi, Anna` ha la virgola dentro. La convenzione è scriverlo tra virgolette doppie, `"Rossi, Anna",8`, e chi legge non deve tagliare tra le virgolette. Un taglio fatto con `split` non lo sa: per i file che vengono da altri programmi Python ha il modulo `csv`, che conosce queste regole.
```

## Prova tu

Il file `spese.csv` ha due colonne, la voce di spesa e gli euro spesi. Completa il programma: deve stampare il totale degli euro e, sulla riga dopo, quante spese superano i 10 euro.

```codice python
totale = 0
grandi = 0
with open("spese.csv") as file:
    file.readline()
    # scrivi qui il ciclo
print(totale)
print(grandi)
%% soluzione
totale = 0
grandi = 0
with open("spese.csv") as file:
    file.readline()
    for riga in file:
        campi = riga.strip().split(",")
        euro = int(campi[1])
        totale = totale + euro
        if euro > 10:
            grandi = grandi + 1
print(totale)
print(grandi)
%% prova
%% stampa
58
2
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int totale = 0, grandi = 0;
    ifstream file("spese.csv");
    string riga, voce, euro;
    getline(file, riga);
    // scrivi qui il ciclo
    file.close();
    cout << totale << endl;
    cout << grandi << endl;
    return 0;
}
%% soluzione
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int totale = 0, grandi = 0;
    ifstream file("spese.csv");
    string riga, voce, euro;
    getline(file, riga);
    while (getline(file, voce, ',')) {
        getline(file, euro);
        totale = totale + stoi(euro);
        if (stoi(euro) > 10) {
            grandi = grandi + 1;
        }
    }
    file.close();
    cout << totale << endl;
    cout << grandi << endl;
    return 0;
}
```

```codice spese.csv
voce,euro
pizza,12
quaderni,6
cinema,9
regalo,25
gelato,6
```

Nel secondo esercizio scrivi un file CSV. Il file `verifiche.csv` ha per ogni studente il voto dello scritto e quello dell'orale. Il programma legge dalla tastiera una soglia e deve scrivere `ammessi.csv`, con l'intestazione `nome,totale` e una riga per ogni studente la cui somma dei due voti è almeno la soglia. "Verifica" controlla il contenuto di `ammessi.csv`.

```codice python
soglia = int(input())
with open("verifiche.csv") as ingresso:
    with open("ammessi.csv", "w") as uscita:
        ingresso.readline()
        # scrivi qui l'intestazione e il ciclo
        pass
%% soluzione
soglia = int(input())
with open("verifiche.csv") as ingresso:
    with open("ammessi.csv", "w") as uscita:
        ingresso.readline()
        uscita.write("nome,totale\n")
        for riga in ingresso:
            campi = riga.strip().split(",")
            totale = int(campi[1]) + int(campi[2])
            if totale >= soglia:
                uscita.write(campi[0] + "," + str(totale) + "\n")
%% prova
12
%% file ammessi.csv
nome,totale
Anna,15
Sara,12
Marco,13
%% prova
14
%% file ammessi.csv
nome,totale
Anna,15
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int soglia;
    cin >> soglia;
    ifstream ingresso("verifiche.csv");
    ofstream uscita("ammessi.csv");
    string riga, nome, scritto, orale;
    getline(ingresso, riga);
    // scrivi qui l'intestazione e il ciclo
    ingresso.close();
    uscita.close();
    return 0;
}
%% soluzione
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int soglia;
    cin >> soglia;
    ifstream ingresso("verifiche.csv");
    ofstream uscita("ammessi.csv");
    string riga, nome, scritto, orale;
    getline(ingresso, riga);
    uscita << "nome,totale" << endl;
    while (getline(ingresso, nome, ',')) {
        getline(ingresso, scritto, ',');
        getline(ingresso, orale);
        int totale = stoi(scritto) + stoi(orale);
        if (totale >= soglia) {
            uscita << nome << "," << totale << endl;
        }
    }
    ingresso.close();
    uscita.close();
    return 0;
}
```

```codice verifiche.csv
nome,scritto,orale
Anna,8,7
Luca,5,6
Sara,6,6
Marco,7,6
```
