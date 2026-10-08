# Leggere e scrivere un file di testo

Un gioco che ricorda il tuo record anche dopo che lo hai chiuso, una rubrica che domani ha ancora i numeri di oggi: sono programmi che non tengono i dati solo nelle variabili. Le variabili stanno nella [memoria centrale](/materiale/scuola-superiore/informatica/l-architettura-del-computer/memoria-centrale-e-memorie-di-massa), che si svuota quando il programma finisce; quello che deve restare va scritto in un file, sulla memoria di massa, dove lo ritrova la prossima esecuzione, oppure un altro programma. Che un file ha un nome e sta in una cartella lo sai dalla lezione sul [file system](/materiale/scuola-superiore/informatica/il-sistema-operativo/il-file-system-file-cartelle-e-percorsi): qui lo usi da un programma.

Un **file di testo** è una sequenza di caratteri divisa in righe, e ogni riga finisce con un carattere che non si vede, l'a capo. Con un file si fanno sempre tre mosse, in quest'ordine: lo **apri**, dicendo il nome e che cosa vuoi farne; leggi oppure scrivi; lo **chiudi**.

## Leggere un file riga per riga

Accanto al programma qui sotto c'è il file `iscritti.txt`, con gli iscritti a un torneo di scacchi, uno per riga: lo trovi nella seconda linguetta. Il programma lo apre in lettura e ripete la stessa istruzione per ogni riga, dalla prima all'ultima; finite le righe, il ciclo termina da solo.

```codice python
with open("iscritti.txt") as file:
    for riga in file:
        print(riga.strip())
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream file("iscritti.txt");
    string riga;
    while (getline(file, riga)) {
        cout << riga << endl;
    }
    file.close();
    return 0;
}
```

```codice iscritti.txt
Anna Rossi
Luca Bianchi
Sara Verdi
```

```ad-note
Aprire, leggere e chiudere nei due linguaggi
In Python `open("iscritti.txt")` apre il file, e `with` lo chiude da solo quando finisce il blocco rientrato; `for riga in file` dà al ciclo una riga per giro. In C++ serve `#include <fstream>`: una variabile di tipo `ifstream` è un file aperto in lettura, `getline(file, riga)` legge una riga e vale falso quando non ce ne sono più, `file.close()` chiude il file.
```

Scrivi un quarto nome in fondo a `iscritti.txt` ed esegui di nuovo: il programma è lo stesso, eppure stampa una riga in più, perché i dati stanno fuori dal programma. Poi, in Python, togli `.strip()`: tra un nome e l'altro compare una riga vuota. La riga letta porta con sé il suo a capo, e `print` ne aggiunge un altro; `strip()` toglie spazi e a capo dall'inizio e dalla fine di un testo. In C++ è `getline` a scartare l'a capo.

## I numeri in un file sono testo

Il file `voti.txt` contiene quattro voti: 8, 10, 6 e 7. Per il programma quelle righe sono testi: `10` è fatto dei due caratteri `1` e `0`, uno dopo l'altro, come vuole la [codifica dei caratteri](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode). La figura mostra il file un carattere per casella, con l'a capo disegnato come ↵. Vai avanti un passo alla volta fino alla seconda riga: guarda che cosa finisce in `riga`, che cosa in `voto`, e da quale casella riparte la lettura al giro successivo.

```interattivo
% nome: inf-file-lettura-righe
% alt: Il file voti.txt disegnato come una fila di nove caselle, una per carattere: 8, a capo, 1, 0, a capo, 6, a capo, 7, a capo. Un segnaposto sotto le caselle indica il punto da cui riparte la lettura. A ogni passo il programma legge i caratteri fino al prossimo a capo: la variabile riga prende il testo letto (prima 8, poi 10, poi 6, poi 7), la variabile voto il numero corrispondente e la variabile somma cresce da 0 a 8, 18, 24 e 31. Quando il segnaposto è in fondo al file il ciclo finisce e la media è 31 diviso 4, cioè 7,75. I bottoni Esegui, Indietro, Avanti e Ricomincia fanno scorrere i passi
```

Un file si legge in ordine, dall'inizio alla fine. Un segnaposto ricorda fin dove sei arrivato: ogni lettura riparte da lì e si ferma al primo a capo, quindi non devi dire quale riga vuoi, è sempre la prossima. Il testo letto diventa un numero solo con una conversione, e quando il segnaposto è in fondo al file non c'è più niente da leggere: il ciclo finisce.

```codice python
somma = 0
quanti = 0
with open("voti.txt") as file:
    for riga in file:
        voto = int(riga)
        somma = somma + voto
        quanti = quanti + 1
print("Media:", somma / quanti)
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ifstream file("voti.txt");
    string riga;
    double somma = 0;
    int quanti = 0;
    while (getline(file, riga)) {
        int voto = stoi(riga);
        somma = somma + voto;
        quanti = quanti + 1;
    }
    file.close();
    cout << "Media: " << somma / quanti << endl;
    return 0;
}
```

```codice voti.txt
8
10
6
7
```

```ad-note
La conversione da testo a numero
In Python è `int(riga)`, la stessa che usi con `input()`: l'a capo in fondo alla riga non le dà fastidio. In C++ `stoi(riga)` trasforma una `string` in un `int` (per un numero con la virgola c'è `stod`). In C++ puoi anche leggere il numero direttamente, con `file >> voto` al posto di `getline`: è la stessa scrittura di `cin >> voto`, perché da un file si legge come dalla tastiera.
```

Lo schema è quello di [massimo, minimo e media](/materiale/scuola-superiore/informatica/l-iterazione/massimo-minimo-e-media-di-una-sequenza), con una differenza comoda: non serve sapere prima quanti sono i dati, né un valore di fine, perché la sequenza finisce dove finisce il file. Aggiungi una riga con un 9 a `voti.txt` e controlla che la media diventi 8.

```ad-warning
Sommare le righe senza convertirle
In Python `somma = somma + riga` ferma il programma con un `TypeError`, perché somma un numero e un testo. Se poi `somma` parte da `""`, il `+` attacca i testi uno all'altro, a capo compresi, e ottieni di nuovo le quattro righe del file, che non sono la somma di niente. In C++ `somma + riga` non viene nemmeno compilato.
```

## Scrivere in un file

Per scrivere si apre il file in scrittura. Se il file non esiste viene creato; se esiste viene svuotato, e si riparte da zero. Il programma chiede un numero e scrive la sua tabellina in `tabellina.txt`, che ha già una riga di appunti. Eseguilo due volte, prima con 7 e poi con 9, e ogni volta riapri la linguetta del file per guardare che cosa contiene.

```codice python
n = int(input("Quale tabellina? "))
with open("tabellina.txt", "w") as file:
    for i in range(1, 11):
        file.write(str(n * i) + "\n")
```

```codice cpp
#include <fstream>
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Quale tabellina? ";
    cin >> n;
    ofstream file("tabellina.txt");
    for (int i = 1; i <= 10; i++) {
        file << n * i << endl;
    }
    file.close();
    return 0;
}
```

```codice tabellina.txt
Tabelline da ripassare: 7, 8 e 9
```

```ad-note
Scrivere nei due linguaggi
In Python il secondo argomento di `open` è il modo: `"w"` (write) per scrivere, mentre senza niente il file si apre in lettura. `file.write` vuole un testo, quindi il numero passa da `str`, e non va a capo da solo: l'a capo è `"\n"`. In C++ un `ofstream` è un file aperto in scrittura, e ci scrivi con `<<` ed `endl` come su `cout`.
```

```ad-warning
Aprire in scrittura cancella quello che c'era
Il file viene svuotato nel momento in cui lo apri, prima ancora di scriverci qualcosa: la riga di appunti sparisce alla prima esecuzione, e dopo la seconda in `tabellina.txt` c'è solo la tabellina del 9. Se sbagli nome in lettura te ne accorgi subito; se in scrittura usi per errore il nome del file dei dati, lo perdi senza nessun avviso.
```

## Aggiungere in fondo a un file

Un registro, un diario, l'elenco dei punteggi crescono una riga alla volta. Per tenere quello che c'è e scrivere in fondo, il file si apre in **accodamento** (in inglese append). Il programma aggiunge un iscritto al torneo, poi riapre il file in lettura e lo stampa.

```codice python
nome = input("Chi si iscrive? ")
with open("iscritti.txt", "a") as file:
    file.write(nome + "\n")
with open("iscritti.txt") as file:
    for riga in file:
        print(riga.strip())
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome;
    cout << "Chi si iscrive? ";
    getline(cin, nome);
    ofstream file("iscritti.txt", ios::app);
    file << nome << endl;
    file.close();
    ifstream letto("iscritti.txt");
    string riga;
    while (getline(letto, riga)) {
        cout << riga << endl;
    }
    letto.close();
    return 0;
}
```

```codice iscritti.txt
Anna Rossi
Luca Bianchi
Sara Verdi
```

In Python il modo è `"a"`, in C++ si aggiunge `ios::app` dopo il nome. Esegui due volte con lo stesso nome: compare due volte, perché ogni esecuzione parte dal file come lo ha lasciato la precedente. Il tasto "Ripristina" rimette il file di partenza.

```ad-warning
Rileggere un file prima di averlo chiuso
Quello che scrivi passa da una memoria di appoggio e arriva di sicuro nel file solo quando lo chiudi. Se lo riapri in lettura mentre è ancora aperto in scrittura, rischi di non trovare le ultime righe. In Python il secondo `with` comincia senza rientro, fuori dal primo; in C++ `file.close()` viene prima del secondo `ifstream`.
```

## Se il file non c'è

Aprire in lettura un file che non esiste è l'errore più comune: un nome scritto male, un file in un'altra cartella. I due linguaggi reagiscono in modo diverso, e in tutti e due il programma può accorgersene e dirlo. Esegui il programma con `iscritti.txt`, poi con `iscriti.txt`.

```codice python
nome = input("Quale file apro? ")
try:
    with open(nome) as file:
        print("Prima riga:", file.readline().strip())
except FileNotFoundError:
    print("Il file", nome, "non esiste")
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string nome, riga;
    cout << "Quale file apro? ";
    cin >> nome;
    ifstream file(nome);
    if (!file) {
        cout << "Il file " << nome << " non esiste" << endl;
    } else {
        getline(file, riga);
        cout << "Prima riga: " << riga << endl;
        file.close();
    }
    return 0;
}
```

```codice iscritti.txt
Anna Rossi
```

In Python l'apertura fallita ferma il programma con l'errore `FileNotFoundError`. Le parole `try` ed `except` servono a non fermarsi: le istruzioni sotto `try` vengono provate, e se il file non c'è si passa a quelle sotto `except`. `readline()` legge una riga sola, la prossima.

```ad-warning
In C++ un file che non si apre non dà nessun errore
Il programma prosegue con un file da cui non si legge niente: `getline` vale subito falso, il ciclo non fa nemmeno un giro e non esce nessun messaggio. Nel primo programma della lezione cambia il nome in `iscriti.txt` ed esegui: non stampa nulla. Per questo dopo l'apertura si chiede `if (!file)`, che è vero quando l'apertura non è riuscita.
```

## Prova tu

Il file `passi.txt` contiene i passi che hai fatto in quattro giorni, uno per riga. Completa il programma: deve stampare quanti giorni hanno almeno 8000 passi.

```codice python
giorni = 0
with open("passi.txt") as file:
    # scrivi qui il ciclo che legge le righe
    pass
print(giorni)
%% soluzione
giorni = 0
with open("passi.txt") as file:
    for riga in file:
        passi = int(riga)
        if passi >= 8000:
            giorni = giorni + 1
print(giorni)
%% prova
%% stampa
2
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int giorni = 0;
    ifstream file("passi.txt");
    string riga;
    // scrivi qui il ciclo che legge le righe
    file.close();
    cout << giorni << endl;
    return 0;
}
%% soluzione
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int giorni = 0;
    ifstream file("passi.txt");
    string riga;
    while (getline(file, riga)) {
        int passi = stoi(riga);
        if (passi >= 8000) {
            giorni = giorni + 1;
        }
    }
    file.close();
    cout << giorni << endl;
    return 0;
}
```

```codice passi.txt
7200
10450
8000
3100
```

Nel secondo esercizio i file aperti sono due, uno in lettura e uno in scrittura. Il programma legge dalla tastiera una soglia; deve scrivere in `scelti.txt` solo i voti di `voti.txt` maggiori o uguali alla soglia, uno per riga e nello stesso ordine, e alla fine stampare quanti ne ha scritti. "Verifica" controlla sia il numero stampato sia il contenuto di `scelti.txt`.

```codice python
soglia = int(input())
quanti = 0
with open("voti.txt") as ingresso:
    with open("scelti.txt", "w") as uscita:
        # scrivi qui il ciclo
        pass
print(quanti)
%% soluzione
soglia = int(input())
quanti = 0
with open("voti.txt") as ingresso:
    with open("scelti.txt", "w") as uscita:
        for riga in ingresso:
            voto = int(riga)
            if voto >= soglia:
                uscita.write(str(voto) + "\n")
                quanti = quanti + 1
print(quanti)
%% prova
6
%% stampa
2
%% file scelti.txt
8
10
%% prova
9
%% stampa
1
%% file scelti.txt
10
```

```codice cpp
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int soglia, quanti = 0;
    cin >> soglia;
    ifstream ingresso("voti.txt");
    ofstream uscita("scelti.txt");
    string riga;
    // scrivi qui il ciclo
    ingresso.close();
    uscita.close();
    cout << quanti << endl;
    return 0;
}
%% soluzione
#include <fstream>
#include <iostream>
#include <string>
using namespace std;

int main() {
    int soglia, quanti = 0;
    cin >> soglia;
    ifstream ingresso("voti.txt");
    ofstream uscita("scelti.txt");
    string riga;
    while (getline(ingresso, riga)) {
        int voto = stoi(riga);
        if (voto >= soglia) {
            uscita << voto << endl;
            quanti = quanti + 1;
        }
    }
    ingresso.close();
    uscita.close();
    cout << quanti << endl;
    return 0;
}
```

```codice voti.txt
8
5
10
```
