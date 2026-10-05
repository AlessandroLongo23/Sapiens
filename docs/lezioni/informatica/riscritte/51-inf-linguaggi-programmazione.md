# Linguaggi, compilatori e interpreti

Quando apri un gioco sul telefono, la CPU esegue milioni di istruzioni fatte solo di bit, e nessuno le ha scritte a mano una per una. Chi ha fatto il gioco ha scritto un testo in un linguaggio di programmazione, con parole e simboli che una persona riesce a leggere, e un altro programma lo ha tradotto nelle istruzioni della CPU. Questa lezione racconta la traduzione: da che cosa si parte, dove si arriva, e i due modi di farla.

## Il linguaggio della macchina

Una CPU sa eseguire poche istruzioni elementari (copia un dato, somma due numeri, salta a un'altra istruzione), e l'insieme di queste istruzioni è il suo **linguaggio macchina**: lo hai visto in miniatura nella lezione [La CPU e il ciclo di esecuzione delle istruzioni](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-cpu-e-il-ciclo-di-esecuzione-delle-istruzioni). In memoria ogni istruzione è una sequenza di bit, e ogni famiglia di CPU ha le sue: il linguaggio macchina di un portatile non è quello di un telefono.

Scrivere un programma così è possibile, ma è lento e pieno di trappole. Per sommare due prezzi servono tre o quattro istruzioni, bisogna sapere in quale cella di memoria sta ogni dato, e un bit sbagliato su centinaia cambia l'istruzione in un'altra. Per di più il lavoro vale per una sola famiglia di CPU: su un'altra si riscrive da capo. Un linguaggio fatto così, che ricalca quello che la macchina sa fare, si dice di **basso livello**.

## I linguaggi ad alto livello

Un **linguaggio ad alto livello** è un linguaggio di programmazione pensato per chi scrive e non per la macchina: usa parole prese dall'inglese (`print`, `if`, `while`), i segni della matematica e nomi scelti da te, e non chiede di sapere com'è fatta la CPU. Il conto dei due prezzi diventa una riga, `totale = quaderno + penna`, che si legge quasi come una frase.

Il testo di un programma scritto in un linguaggio ad alto livello si chiama **codice sorgente**, o sorgente: è un file di testo, che puoi aprire, leggere e correggere. Ogni linguaggio ha le sue regole di scrittura, la **sintassi**, e sono regole rigide: una persona capisce una frase anche con una virgola fuori posto, un computer no. Degli errori di scrittura, e di come si trovano, parla la lezione [Errori e debug](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/errori-e-debug).

I linguaggi ad alto livello sono molti (Python, C++, Java, JavaScript sono alcuni dei più usati) e ognuno è nato per un tipo di lavoro, ma tutti hanno lo stesso limite: la CPU non li capisce. Tra il sorgente e la CPU serve un traduttore, che è a sua volta un programma, e ne esistono di due tipi.

## Il compilatore traduce tutto prima

Un **compilatore** è un programma che legge tutto il codice sorgente e lo traduce in linguaggio macchina, una volta per tutte. Il risultato è un **programma eseguibile**: un file che la CPU esegue direttamente, senza più bisogno del sorgente né del compilatore. È il lavoro di chi traduce un romanzo: lo traduce tutto, una volta, e da quel momento i lettori leggono la traduzione senza sapere niente dell'originale.

Le app che scarichi sul telefono sono programmi eseguibili: chi le ha scritte le ha compilate per il tuo tipo di telefono, e a te arriva solo la traduzione. Per questo la stessa app ha una versione per ogni sistema, e quella fatta per un tipo di telefono non parte su un altro.

Prima di tradurre, il compilatore controlla che tutto il sorgente rispetti le regole del linguaggio. Se trova un errore, anche uno solo e anche nell'ultima riga, non produce l'eseguibile: il programma non parte nemmeno.

## L'interprete traduce mentre esegue

Un **interprete** è un programma che legge il codice sorgente un'istruzione alla volta: la traduce, la fa eseguire subito, poi passa alla successiva. Non produce nessun file da conservare, e la traduzione si rifà a ogni esecuzione. È il lavoro dell'interprete a una conferenza, che traduce una frase appena è stata detta: quando la conferenza finisce non resta un testo tradotto, e per riascoltarla serve di nuovo lui.

```tikz
% nome: compilatore-e-interprete
% alt: Due colonne a confronto. A sinistra, la compilazione: il codice sorgente entra nel compilatore, che produce un programma eseguibile in linguaggio macchina, e l'eseguibile va alla CPU. A destra, l'interpretazione: il codice sorgente entra nell'interprete, che traduce ed esegue un'istruzione alla volta mandandola alla CPU, senza produrre nessun file
\begin{tikzpicture}
\tikzset{
  dato/.style={draw, thick, rounded corners=3pt, minimum width=3.1cm, minimum height=0.85cm, align=center, font=\small, fill=blue!12},
  traduttore/.style={draw, thick, minimum width=3.1cm, minimum height=0.85cm, align=center, font=\small, fill=orange!25},
  cpu/.style={draw, thick, rounded corners=3pt, minimum width=3.1cm, minimum height=0.85cm, align=center, font=\small, fill=green!15}
}
\node[font=\small\bfseries] at (0,1) {Compilazione};
\node[font=\small\bfseries] at (4.6,1) {Interpretazione};
\node[dato] (s1) at (0,0) {codice sorgente};
\node[traduttore] (c) at (0,-1.6) {compilatore};
\node[dato] (e) at (0,-3.2) {programma eseguibile\\(linguaggio macchina)};
\node[cpu] (cpu1) at (0,-4.8) {CPU};
\draw[-{Stealth}, thick] (s1) -- (c);
\draw[-{Stealth}, thick] (c) -- (e);
\draw[-{Stealth}, thick] (e) -- (cpu1);
\node[dato] (s2) at (4.6,0) {codice sorgente};
\node[traduttore, minimum height=2.45cm] (i) at (4.6,-2.4) {interprete\\[2pt]traduce ed esegue\\un'istruzione\\alla volta};
\node[cpu] (cpu2) at (4.6,-4.8) {CPU};
\draw[-{Stealth}, thick] (s2) -- (i);
\draw[-{Stealth}, thick] (i) -- (cpu2);
\end{tikzpicture}
```

Nessuno dei due modi è migliore in assoluto: ognuno paga qualcosa.

| | Con il compilatore | Con l'interprete |
|---|---|---|
| Quando avviene la traduzione | prima dell'esecuzione, una volta sola | durante l'esecuzione, ogni volta |
| Che cosa resta | un programma eseguibile | niente: resta solo il sorgente |
| Che cosa serve per eseguire | l'eseguibile fatto per quel tipo di computer | il sorgente e un interprete per quel computer |
| Un nome scritto male | viene segnalato prima di partire, e il programma non parte | viene scoperto quando l'esecuzione arriva a quella riga |
| Velocità di esecuzione | di solito maggiore, perché la traduzione è già fatta | di solito minore, perché si traduce mentre si esegue |

Con l'interprete si prova più in fretta: scrivi due righe, le esegui, guardi che cosa succede, correggi. Con il compilatore ogni modifica chiede una nuova traduzione, ma l'eseguibile che ne esce è veloce e si può dare a chi non ha né il sorgente né il compilatore.

```ad-note
Molti linguaggi stanno a metà
La divisione non è sempre così netta. Alcuni linguaggi vengono prima tradotti in una forma intermedia, più semplice del sorgente ma non ancora linguaggio macchina, e poi quella forma viene interpretata: lo fa Java, e lo fa anche Python dietro le quinte. Per ragionare restano utili i due modelli puri.
```

## Python e C++, i due linguaggi di queste lezioni

Da qui in avanti ogni programma delle lezioni è scritto in due linguaggi, e scegli tu quale guardare con la linguetta sopra l'editor: la scelta vale per tutta la pagina e per le pagine successive.

Python è un linguaggio interpretato. Si scrive con poche righe e pochi simboli, e per questo è uno dei linguaggi con cui si comincia più spesso. C++ è un linguaggio compilato. Chiede di scrivere di più e di dichiarare ogni cosa prima di usarla, ma fa vedere meglio che cosa succede nella memoria, e i suoi programmi sono tra i più veloci. I libri di scuola usano l'uno o l'altro, e il tuo insegnante ne ha scelto uno: segui quello, e ogni tanto guarda anche l'altra linguetta, perché le idee (la variabile, la scelta, il ciclo) sono le stesse e cambia solo il modo di scriverle.

Il programma qui sotto scrive tre righe sullo schermo, e nella seconda fa un conto. Premi "Esegui", poi cambia linguetta ed eseguilo di nuovo: quello che esce è identico.

```codice python
print("Inizio")
print("7 per 8 fa", 7 * 8)
print("Fine")
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Inizio" << endl;
    cout << "7 per 8 fa " << 7 * 8 << endl;
    cout << "Fine" << endl;
    return 0;
}
```

Non ti serve ancora capire ogni riga: le spiega la lezione [Il primo programma: input e output](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/il-primo-programma-input-e-output). Guarda soltanto che le tre istruzioni di Python si ritrovano, nello stesso ordine, dentro le parentesi graffe del C++. Con il C++, mentre aspetti, in alto accanto al tasto "Esegui" compare per un momento la scritta "Compilo…": è il compilatore al lavoro, che in questa pagina gira dentro il tuo browser come l'interprete di Python.

Ora rompi il programma, per vedere la differenza tra i due traduttori. Nell'ultima istruzione scrivi male il nome del comando che stampa: `prin` al posto di `print` in Python, `cot` al posto di `cout` in C++. Poi esegui.

- In Python escono le prime due righe, e solo dopo arriva un messaggio di errore che indica la riga 3: l'interprete ha eseguito le istruzioni una alla volta e si è fermato alla prima che non ha capito.
- In C++ non esce nessuna delle tre righe, ma solo il messaggio di errore: il compilatore ha letto tutto il sorgente prima di cominciare, ha trovato un nome che non conosce e non ha prodotto l'eseguibile.

```ad-warning
Il sorgente non è il programma che gira
Con un linguaggio compilato, dopo aver corretto il sorgente bisogna compilare di nuovo: l'eseguibile di prima è la traduzione del testo di prima e non cambia da solo. Nell'editor di queste pagine "Esegui" fa tutte e due le cose, ma con gli strumenti che userai a scuola possono essere due comandi distinti, e dimenticare il primo vuol dire provare ancora il programma vecchio.
```

```ad-warning
Il computer non capisce il sorgente
Né Python né C++ sono lingue che la CPU conosce. Su un computer dove non è installato un interprete di Python, un file di Python resta un file di testo; e un sorgente C++ senza compilatore non si può eseguire in nessun modo.
```
