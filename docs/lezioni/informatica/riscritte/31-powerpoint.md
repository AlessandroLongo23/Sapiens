# Progettare una presentazione

Una presentazione è un discorso fatto a voce davanti a un pubblico, accompagnato da una serie di schermate, le slide (in italiano diapositive), che si preparano con un programma di presentazione (per esempio PowerPoint, LibreOffice Impress o Presentazioni Google). Le slide aiutano chi ascolta a seguire; il discorso lo fai tu. Per questo una buona presentazione si decide prima di aprire il programma: si parte dallo scopo, si fanno i conti con il tempo, si scrive una scaletta, e solo alla fine si pensa ai colori.

## Lo scopo, in una frase

Lo **scopo** di una presentazione è quello che il pubblico deve sapere, o voler fare, quando hai finito. Si scrive in una frase sola, con un soggetto e un verbo, e si mette davanti a tutto il lavoro: ogni slide che non serve a quella frase si toglie.

L'argomento non è lo scopo. "La plastica" è un argomento: su di esso si possono dire mille cose, e non indica quali scegliere. "Con le borracce la nostra classe ha dimezzato le bottigliette buttate" è uno scopo: dice che cosa deve restare in testa a chi ascolta.

```ad-example
Esempio 1: argomento o scopo
Quattro inizi per la stessa presentazione di scienze. Quale dice lo scopo?

1. "I vulcani."
2. "Tutto quello che ho trovato sui vulcani."
3. "Voglio prendere un bel voto."
4. "I vulcani italiani sono sorvegliati giorno e notte, e vi spiego come."

La frase 1 è l'argomento. La 2 promette un elenco senza una direzione. La 3 parla di chi presenta, non di chi ascolta. La 4 è lo scopo: alla fine il pubblico deve sapere che i vulcani italiani sono sorvegliati e in che modo.
```

## A chi parli

La stessa ricerca si racconta in modi diversi a pubblici diversi, perché cambia quello che sanno già e quello che interessa loro. Prima di scrivere la scaletta rispondi a tre domande: chi ascolta, che cosa sa già dell'argomento, che cosa vuole sapere da te.

Ai compagni di classe, che hanno seguito le stesse lezioni, non serve ripetere le definizioni del libro; serve quello che hai scoperto tu. Ai genitori in visita alla scuola le definizioni servono, dette con parole comuni. Alla professoressa che interroga interessa vedere che hai capito i passaggi, più delle curiosità.

## Il tempo e il numero di slide

Il tempo è un dato del problema: un'interrogazione dura dieci minuti, un intervento all'assemblea cinque. Dal tempo viene il numero di slide. Una regola pratica: per ogni slide servono da uno a due minuti, perché il pubblico deve guardarla, ascoltarti e capire. Chi prepara trenta slide per dieci minuti finirà per saltarne metà.

Il numero di slide si calcola così:

1. parti dal tempo che ti è stato dato;
2. togli il tempo da lasciare alle domande, se sono previste;
3. dividi il tempo che resta per i minuti che dedichi a ogni slide;
4. se il risultato non è intero, arrotonda per difetto: una slide in più non ci sta.

```ad-example
Esempio 2: dieci minuti, due minuti a slide
Chiara ha $10$ minuti e non sono previste domande. Dedica $2$ minuti a ogni slide. Quante slide prepara?

$10 : 2 = 5$ slide.
```

```ad-example
Esempio 3: il tempo per le domande
Davide ha $15$ minuti, di cui $3$ vanno lasciati alle domande. Parla un minuto e mezzo per ogni slide. Quante slide prepara?

Per parlare restano $15 - 3 = 12$ minuti. Un minuto e mezzo sono $1{,}5$ minuti: $12 : 1{,}5 = 8$ slide.
```

```ad-example
Esempio 4: una divisione con il resto
Elena ha $20$ minuti, di cui $5$ per le domande, e dedica $2$ minuti a ogni slide. Quante slide prepara?

Restano $20 - 5 = 15$ minuti, e $15 : 2 = 7{,}5$. Mezza slide non esiste e l'ottava non ci sta: Elena prepara $7$ slide, e le resta un minuto di margine.
```

```ad-warning
Dividere il tempo intero
Se ci sono le domande, il tempo per parlare è più corto di quello assegnato. Chi nell'esempio 4 calcola $20 : 2 = 10$ slide arriva alla settima quando il tempo per parlare è finito.
```

## Un'idea per slide

Ogni slide dice una cosa sola, e il suo titolo dice quale. Chi guarda una slide con tre idee non sa da dove cominciare a leggere e smette di ascoltare; con una sola idea, guarda, capisce e torna a te.

Un titolo come "Cause, effetti e soluzioni" annuncia tre idee: sono tre slide. E un titolo fatto di una sola parola, come "Dati", non dice niente: meglio una frase breve che contenga già la conclusione, come "In un mese le bottigliette sono dimezzate".

```ad-example
Esempio 5: una slide da dividere
Nella scaletta di Tommaso c'è la slide "Che cosa mangiano le api e perché stanno diminuendo". Va bene?

No: contiene due idee, l'alimentazione delle api e il loro calo. Diventano due slide, ognuna con il suo titolo: "Che cosa mangiano le api" e "Perché le api stanno diminuendo". Il numero di slide cresce di uno, e va ricontrollato con il tempo.
```

## Apertura, sviluppo, chiusura

Una presentazione ha tre parti, come un tema.

L'**apertura** dice chi sei, di che cosa parli e perché a chi ascolta dovrebbe interessare. Sono la slide del titolo e, se serve, una slide che pone il problema.

Lo **sviluppo** è il corpo del discorso: pochi punti, di solito tre o quattro, ognuno con le sue slide, in un ordine che il pubblico possa seguire (dal problema alla soluzione, dal prima al dopo, dal generale al particolare).

La **chiusura** ripete lo scopo con le parole più chiare che hai, perché è quello che il pubblico ricorderà, e lascia spazio alle domande. Qui stanno anche le fonti.

```tikz
% nome: scaletta-apertura-sviluppo-chiusura
% alt: La scaletta di una presentazione di dieci minuti in sei righe numerate. La prima, Meno plastica in 1B, è l'apertura e dura un minuto. Le quattro centrali, Quante bottigliette buttiamo, Da dove arrivano, La prova delle borracce, Che cosa è cambiato in un mese, sono lo sviluppo e durano otto minuti. L'ultima, Che cosa chiediamo alla scuola, è la chiusura e dura un minuto
\begin{tikzpicture}
\tikzset{s/.style={draw, thick, rounded corners=2pt, minimum width=5.6cm, minimum height=0.55cm, font=\small, anchor=west, text width=5.3cm, inner sep=2pt}}
\node[s, fill=orange!25] at (0,0) {1\quad Meno plastica in 1B};
\node[s, fill=blue!10] at (0,-0.7) {2\quad Quante bottigliette buttiamo};
\node[s, fill=blue!10] at (0,-1.4) {3\quad Da dove arrivano};
\node[s, fill=blue!10] at (0,-2.1) {4\quad La prova delle borracce};
\node[s, fill=blue!10] at (0,-2.8) {5\quad Che cosa è cambiato in un mese};
\node[s, fill=green!18] at (0,-3.5) {6\quad Che cosa chiediamo alla scuola};
\draw[thick] (5.95,0.27) -- (6.1,0.27) -- (6.1,-0.27) -- (5.95,-0.27);
\draw[thick] (5.95,-0.43) -- (6.1,-0.43) -- (6.1,-3.07) -- (5.95,-3.07);
\draw[thick] (5.95,-3.23) -- (6.1,-3.23) -- (6.1,-3.77) -- (5.95,-3.77);
\node[anchor=west, font=\small, align=left] at (6.25,0) {apertura\\{\footnotesize 1 minuto}};
\node[anchor=west, font=\small, align=left] at (6.25,-1.75) {sviluppo\\{\footnotesize 8 minuti}};
\node[anchor=west, font=\small, align=left] at (6.25,-3.5) {chiusura\\{\footnotesize 1 minuto}};
\end{tikzpicture}
```

```ad-example
Esempio 6: il tempo di ogni parte
Irene ha $12$ minuti: ne dedica $2$ all'apertura e $1$ alla chiusura. Lo sviluppo ha $3$ punti, a cui vuole dare lo stesso tempo. Quanti minuti ha per ogni punto?

Per lo sviluppo restano $12 - 2 - 1 = 9$ minuti, cioè $9 : 3 = 3$ minuti per punto.
```

```ad-warning
Finire senza chiusura
Una presentazione che si ferma sull'ultimo dato, o su una slide con scritto solo "Grazie", lascia al pubblico il compito di capire dove volevi arrivare. L'ultima cosa che dici è quella che resta: deve essere lo scopo.
```

## La scaletta prima della grafica

La **scaletta** è l'elenco dei titoli delle slide, nell'ordine in cui le mostrerai. Si scrive su un foglio, oppure nella vista del programma che mostra la presentazione come un elenco di titoli, senza colori e senza immagini.

Una scaletta si controlla leggendo solo i titoli, uno dopo l'altro: se raccontano il discorso dall'inizio alla fine, regge; se a un certo punto non si capisce come si passa da un titolo al successivo, manca una slide o l'ordine è sbagliato. A questo punto spostare, togliere e aggiungere costa pochi secondi, perché non c'è ancora niente da impaginare.

```ad-example
Esempio 7: mettere in ordine una scaletta
Matteo ha scritto quattro titoli alla rinfusa: A "Che cosa possiamo fare noi", B "L'acqua in bottiglia: quanto costa davvero", C "Un litro dal rubinetto costa meno di un centesimo", D "Il confronto con un litro in bottiglia". In che ordine vanno?

B è il titolo della presentazione: apre. C e D sono lo sviluppo: prima il dato sull'acqua del rubinetto, poi il confronto, che senza quel dato non si capisce. A dice che cosa fare, cioè lo scopo: chiude. L'ordine è B, C, D, A.
```

```ad-warning
Cominciare dalla grafica
Chi apre il programma e passa la prima mezz'ora a scegliere sfondo e caratteri si ritrova con una bella slide del titolo e nessuna idea di che cosa dire dopo. L'aspetto si sceglie quando la scaletta regge, e di come si fa parla la lezione [Slide efficaci: testo, immagini e grafici](/materiale/scuola-superiore/informatica/documenti-di-testo-e-presentazioni/slide-efficaci-testo-immagini-e-grafici).
```
