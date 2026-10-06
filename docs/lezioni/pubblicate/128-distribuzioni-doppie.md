# Distribuzioni doppie

A $50$ studenti di una scuola si fanno due domande: abiti in centro o in periferia? Come vieni a scuola? Ogni studente dà due risposte, e quello che interessa è come si combinano: chi abita in periferia prende l'autobus più spesso di chi abita in centro? Per rispondere serve una tabella che conti le coppie di risposte, e bisogna saperla leggere in tre modi: casella per casella, sui totali, e una riga o una colonna alla volta.

## Due caratteri sulle stesse unità

Nella lezione [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici) su ogni unità statistica si osservava un solo carattere, e i dati si raccoglievano in una tabella di frequenza. Qui su ogni unità si osservano due caratteri, che chiamiamo $X$ e $Y$: ogni unità fornisce una coppia, formata da una modalità di $X$ e da una modalità di $Y$. Nel nostro caso $X$ è il posto in cui lo studente abita, con le modalità "centro" e "periferia", e $Y$ è il mezzo con cui viene a scuola, con le modalità "a piedi", "autobus" e "motorino": uno studente può dare la coppia (periferia, autobus).

L'insieme delle coppie osservate, ognuna con il numero di volte in cui compare, si chiama **distribuzione doppia**, o distribuzione congiunta, dei due caratteri. I due caratteri possono essere tutti e due qualitativi, come qui, tutti e due quantitativi (ore di studio e voto), oppure uno qualitativo e uno quantitativo.

## La tabella a doppia entrata

Una distribuzione doppia si scrive in una **tabella a doppia entrata**: una riga per ogni modalità di $X$, una colonna per ogni modalità di $Y$. Nella casella dove si incrociano una riga e una colonna si scrive il numero di unità che hanno insieme quella modalità di $X$ e quella modalità di $Y$: è la **frequenza congiunta** della coppia. Per i $50$ studenti:

| | a piedi | autobus | motorino | totale |
|---|---|---|---|---|
| centro | $15$ | $9$ | $6$ | $30$ |
| periferia | $1$ | $13$ | $6$ | $20$ |
| totale | $16$ | $22$ | $12$ | $50$ |

Il $13$ dice che $13$ studenti abitano in periferia e vengono in autobus; il $15$ che $15$ studenti abitano in centro e vengono a piedi. Ogni studente è contato in una casella sola, quindi la somma delle sei frequenze congiunte è il numero totale delle unità, che indichiamo con $n$: qui $n = 50$.

L'ultima colonna e l'ultima riga contengono i totali: $30$ è la somma della riga "centro", $22$ la somma della colonna "autobus". La casella in basso a destra è $n$.

```tikz
% nome: tabella-doppia-entrata-congiunte-marginali
% alt: La tabella a doppia entrata di 50 studenti, con le righe centro e periferia e le colonne a piedi, autobus e motorino: le sei caselle interne (15, 9, 6 e 1, 13, 6) sono le frequenze congiunte, la colonna dei totali di riga (30 e 20) è la distribuzione marginale di X, la riga dei totali di colonna (16, 22 e 12) è la distribuzione marginale di Y, e in basso a destra c'è il totale 50
% svg: tabella-doppia-entrata-congiunte-marginali-c193b2ca.svg 280x174
\begin{tikzpicture}[x=1cm, y=1cm]
\fill[blue!15] (1.9,-2.1) rectangle (5.95,-0.7);
\fill[orange!25] (5.95,-2.1) rectangle (7.3,-0.7);
\fill[teal!25] (1.9,-2.8) rectangle (5.95,-2.1);
\draw[gray] (0,0) -- (7.3,0);
\draw[gray] (0,-0.7) -- (7.3,-0.7);
\draw[gray] (0,-1.4) -- (7.3,-1.4);
\draw[gray] (0,-2.1) -- (7.3,-2.1);
\draw[gray] (0,-2.8) -- (7.3,-2.8);
\draw[gray] (0,0) -- (0,-2.8);
\draw[gray] (1.9,0) -- (1.9,-2.8);
\draw[gray] (3.25,0) -- (3.25,-2.8);
\draw[gray] (4.6,0) -- (4.6,-2.8);
\draw[gray] (5.95,0) -- (5.95,-2.8);
\draw[gray] (7.3,0) -- (7.3,-2.8);
\node at (2.575,-0.35) {\footnotesize a piedi};
\node at (3.925,-0.35) {\footnotesize autobus};
\node at (5.275,-0.35) {\footnotesize motorino};
\node at (6.625,-0.35) {\footnotesize totale};
\node at (0.95,-1.05) {\footnotesize centro};
\node at (2.575,-1.05) {\footnotesize $15$};
\node at (3.925,-1.05) {\footnotesize $9$};
\node at (5.275,-1.05) {\footnotesize $6$};
\node at (6.625,-1.05) {\footnotesize $30$};
\node at (0.95,-1.75) {\footnotesize periferia};
\node at (2.575,-1.75) {\footnotesize $1$};
\node at (3.925,-1.75) {\footnotesize $13$};
\node at (5.275,-1.75) {\footnotesize $6$};
\node at (6.625,-1.75) {\footnotesize $20$};
\node at (0.95,-2.45) {\footnotesize totale};
\node at (2.575,-2.45) {\footnotesize $16$};
\node at (3.925,-2.45) {\footnotesize $22$};
\node at (5.275,-2.45) {\footnotesize $12$};
\node at (6.625,-2.45) {\footnotesize $50$};
\filldraw[fill=blue!15, draw=gray] (0.1,-3.39) rectangle (0.5,-3.11);
\node[right] at (0.55,-3.25) {\footnotesize frequenze congiunte};
\filldraw[fill=orange!25, draw=gray] (0.1,-3.89) rectangle (0.5,-3.61);
\node[right] at (0.55,-3.75) {\footnotesize distribuzione marginale di $X$ (dove abita)};
\filldraw[fill=teal!25, draw=gray] (0.1,-4.39) rectangle (0.5,-4.11);
\node[right] at (0.55,-4.25) {\footnotesize distribuzione marginale di $Y$ (mezzo)};
\end{tikzpicture}
```

```ad-example
Esempio 1: dall'elenco alla tabella
A $12$ ragazzi si chiede se abitano in un appartamento (A) o in una casa con giardino (C), e se hanno un cane (sì o no). Le risposte, nell'ordine in cui sono arrivate, sono:

(A, no), (A, sì), (C, sì), (A, no), (C, sì), (A, no), (C, no), (A, sì), (C, sì), (A, no), (A, no), (C, sì).

Costruisci la tabella a doppia entrata.

Le coppie possibili sono quattro. Scorri l'elenco e conta quante volte compare ognuna: (A, sì) compare $2$ volte, (A, no) $5$ volte, (C, sì) $4$ volte, (C, no) $1$ volta.

| | cane sì | cane no | totale |
|---|---|---|---|
| appartamento | $2$ | $5$ | $7$ |
| casa con giardino | $4$ | $1$ | $5$ |
| totale | $6$ | $6$ | $12$ |

Controllo: $2 + 5 + 4 + 1 = 12$, il numero dei ragazzi.
```

```ad-note
I nomi che trovi sui libri
Molti libri chiamano la tabella a doppia entrata tabella di contingenza quando i due caratteri sono qualitativi, e tabella di correlazione quando sono tutti e due quantitativi. Si costruiscono e si leggono allo stesso modo.
```

## Le distribuzioni marginali

I totali di riga dicono quanti studenti abitano in centro e quanti in periferia, senza guardare il mezzo: $30$ e $20$. Sono la distribuzione di frequenza del solo carattere $X$. Allo stesso modo i totali di colonna, $16$, $22$ e $12$, sono la distribuzione del solo carattere $Y$. Queste due distribuzioni si chiamano **distribuzioni marginali**, perché si leggono ai margini della tabella:

| dove abita | centro | periferia |
|---|---|---|
| studenti | $30$ | $20$ |

| mezzo | a piedi | autobus | motorino |
|---|---|---|---|
| studenti | $16$ | $22$ | $12$ |

Ognuna è una normale tabella di frequenza, e si tratta come nelle lezioni del primo anno: si calcolano le frequenze relative e percentuali, si disegna un grafico, si trova la moda. Per esempio viene a scuola in autobus $\dfrac{22}{50} = 44\%$ degli studenti.

```ad-tip
Il controllo dei totali
La somma dei totali di riga e la somma dei totali di colonna devono dare tutte e due $n$: qui $30 + 20 = 50$ e $16 + 22 + 12 = 50$. Se non tornano, c'è un errore in una somma.
```

Dalla tabella a doppia entrata si ricavano le due distribuzioni marginali, ma non si può fare il cammino inverso. Questa seconda tabella ha gli stessi totali della prima e frequenze congiunte diverse:

| | a piedi | autobus | motorino | totale |
|---|---|---|---|---|
| centro | $10$ | $13$ | $7$ | $30$ |
| periferia | $6$ | $9$ | $5$ | $20$ |
| totale | $16$ | $22$ | $12$ | $50$ |

Le distribuzioni marginali descrivono i due caratteri uno alla volta; come si combinano lo dicono solo le frequenze congiunte.

### Le frequenze relative congiunte

Dividendo una frequenza congiunta per $n$ si ottiene la frequenza relativa congiunta, cioè la parte di tutte le unità che ha quella coppia di modalità. Gli studenti che abitano in periferia e vengono in autobus sono

$$\frac{13}{50} = 0{,}26 = 26\%$$

di tutti gli studenti intervistati. La somma delle frequenze relative congiunte di tutte le caselle è $1$, cioè $100\%$.

## Le distribuzioni condizionate

Per sapere se abitare in periferia cambia il modo di andare a scuola bisogna guardare un gruppo alla volta. Prendi solo i $20$ studenti della periferia, cioè solo la seconda riga: $1$ va a piedi, $13$ in autobus, $6$ in motorino. Questa è la **distribuzione condizionata** di $Y$ rispetto alla modalità "periferia" di $X$: la distribuzione del carattere $Y$ tra le sole unità che hanno quella modalità di $X$. Si scrive $Y \mid X = \text{periferia}$, e la barra verticale si legge "dato che" o "condizionato a".

Ogni riga della tabella è una distribuzione condizionata di $Y$, e ogni colonna è una distribuzione condizionata di $X$. Siccome i gruppi hanno numerosità diverse ($30$ e $20$), per confrontarli servono le frequenze relative, e il totale per cui dividere è quello del gruppo, non $n$:

$$\frac{1}{20} = 5\% \qquad \frac{13}{20} = 65\% \qquad \frac{6}{20} = 30\%$$

Facendo lo stesso con la riga "centro", dove il totale è $30$, e con la riga dei totali, dove è $50$, si ottiene questa tabella:

| | a piedi | autobus | motorino | totale |
|---|---|---|---|---|
| $Y \mid X = \text{centro}$ | $50\%$ | $30\%$ | $20\%$ | $100\%$ |
| $Y \mid X = \text{periferia}$ | $5\%$ | $65\%$ | $30\%$ | $100\%$ |
| tutti gli studenti | $32\%$ | $44\%$ | $24\%$ | $100\%$ |

Adesso la risposta alla domanda iniziale si legge subito: in autobus viene il $65\%$ di chi abita in periferia e il $30\%$ di chi abita in centro. L'ultima riga è la distribuzione marginale di $Y$ in percentuale.

```tikz
% nome: distribuzioni-condizionate-mezzo-barre
% alt: Tre barre orizzontali della stessa lunghezza, divise in tre parti secondo il mezzo usato per venire a scuola: tra chi abita in centro il 50% va a piedi, il 30% in autobus e il 20% in motorino; tra chi abita in periferia il 5% va a piedi, il 65% in autobus e il 30% in motorino; su tutti i 50 studenti il 32% va a piedi, il 44% in autobus e il 24% in motorino
% svg: distribuzioni-condizionate-mezzo-barre-d7deff1f.svg 284x128
\begin{tikzpicture}[x=1cm, y=1cm]
\node[left] at (-0.1,0) {\footnotesize centro};
\filldraw[fill=blue!30, draw=gray] (0,-0.3) rectangle (3,0.3);
\node at (1.5,0) {\footnotesize $50\%$};
\filldraw[fill=orange!35, draw=gray] (3,-0.3) rectangle (4.8,0.3);
\node at (3.9,0) {\footnotesize $30\%$};
\filldraw[fill=teal!30, draw=gray] (4.8,-0.3) rectangle (6,0.3);
\node at (5.4,0) {\footnotesize $20\%$};
\node[left] at (-0.1,-0.95) {\footnotesize periferia};
\filldraw[fill=blue!30, draw=gray] (0,-1.25) rectangle (0.3,-0.65);
\filldraw[fill=orange!35, draw=gray] (0.3,-1.25) rectangle (4.2,-0.65);
\node at (2.25,-0.95) {\footnotesize $65\%$};
\filldraw[fill=teal!30, draw=gray] (4.2,-1.25) rectangle (6,-0.65);
\node at (5.1,-0.95) {\footnotesize $30\%$};
\node[left] at (-0.1,-1.9) {\footnotesize tutti};
\filldraw[fill=blue!30, draw=gray] (0,-2.2) rectangle (1.92,-1.6);
\node at (0.96,-1.9) {\footnotesize $32\%$};
\filldraw[fill=orange!35, draw=gray] (1.92,-2.2) rectangle (4.56,-1.6);
\node at (3.24,-1.9) {\footnotesize $44\%$};
\filldraw[fill=teal!30, draw=gray] (4.56,-2.2) rectangle (6,-1.6);
\node at (5.28,-1.9) {\footnotesize $24\%$};
\filldraw[fill=blue!30, draw=gray] (0,-2.89) rectangle (0.4,-2.61);
\node[right] at (0.4,-2.75) {\footnotesize a piedi};
\filldraw[fill=orange!35, draw=gray] (1.9,-2.89) rectangle (2.3,-2.61);
\node[right] at (2.3,-2.75) {\footnotesize autobus};
\filldraw[fill=teal!30, draw=gray] (3.8,-2.89) rectangle (4.2,-2.61);
\node[right] at (4.2,-2.75) {\footnotesize motorino};
\end{tikzpicture}
```

Le distribuzioni condizionate di $X$ si leggono invece sulle colonne. Tra i $22$ studenti che vengono in autobus, quelli della periferia sono $\dfrac{13}{22} \approx 59{,}1\%$ e quelli del centro $\dfrac{9}{22} \approx 40{,}9\%$: è la distribuzione $X \mid Y = \text{autobus}$.

```ad-warning
Una casella, tre percentuali
Il $13$ della tabella dà tre percentuali diverse: il $26\%$ di tutti gli studenti abita in periferia e viene in autobus ($13 : 50$); il $65\%$ di chi abita in periferia viene in autobus ($13 : 20$); il $59{,}1\%$ di chi viene in autobus abita in periferia ($13 : 22$). Prima di dividere chiediti di quale gruppo parla la domanda: il totale di quel gruppo è il denominatore.
```

```ad-example
Esempio 2: tre domande, tre denominatori
Dopo una verifica un'insegnante segna, per i suoi $40$ studenti, se avevano fatto gli esercizi assegnati per casa e se hanno preso la sufficienza.

| | sufficiente | insufficiente | totale |
|---|---|---|---|
| esercizi fatti | $20$ | $4$ | $24$ |
| esercizi non fatti | $6$ | $10$ | $16$ |
| totale | $26$ | $14$ | $40$ |

Calcola: la percentuale di studenti che hanno fatto gli esercizi e hanno preso la sufficienza; la percentuale di sufficienti tra chi ha fatto gli esercizi; la percentuale di chi ha fatto gli esercizi tra i sufficienti.

La prima domanda parla di tutti gli studenti, quindi è una frequenza relativa congiunta:

$$\frac{20}{40} = 50\%$$

La seconda parla solo di chi ha fatto gli esercizi, la prima riga, che ha totale $24$:

$$\frac{20}{24} \approx 83{,}3\%$$

La terza parla solo dei sufficienti, la prima colonna, che ha totale $26$:

$$\frac{20}{26} \approx 76{,}9\%$$

Il numeratore è sempre $20$; cambia il gruppo di cui si parla. Per confronto, tra chi non ha fatto gli esercizi i sufficienti sono $\dfrac{6}{16} = 37{,}5\%$.
```

### Le medie condizionate

Quando il carattere $Y$ è quantitativo, di ogni distribuzione condizionata si può calcolare la media, con la formula della media da una tabella di frequenze che trovi in [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda). La media di $Y$ calcolata sulle sole unità che hanno una certa modalità di $X$ si chiama **media condizionata**.

```ad-example
Esempio 3: il voto medio secondo le ore di studio
Per $30$ studenti si conoscono le ore di studio al giorno ($X$) e il voto nell'ultima verifica ($Y$).

| | voto $5$ | voto $6$ | voto $7$ | voto $8$ | totale |
|---|---|---|---|---|---|
| $1$ ora | $4$ | $4$ | $2$ | $0$ | $10$ |
| $2$ ore | $2$ | $4$ | $4$ | $2$ | $12$ |
| $3$ ore | $0$ | $1$ | $4$ | $3$ | $8$ |
| totale | $6$ | $9$ | $10$ | $5$ | $30$ |

Calcola il voto medio di ogni gruppo e il voto medio di tutti.

Per chi studia $1$ ora si usa solo la prima riga, e si divide per il suo totale, $10$:

$$
\begin{aligned}
\bar{y}_1 &= \frac{5 \cdot 4 + 6 \cdot 4 + 7 \cdot 2 + 8 \cdot 0}{10} \\
&= \frac{58}{10} = 5{,}8
\end{aligned}
$$

Allo stesso modo per le altre due righe:

$$
\begin{gathered}
\bar{y}_2 = \frac{10 + 24 + 28 + 16}{12} = \frac{78}{12} = 6{,}5 \\
\bar{y}_3 = \frac{0 + 6 + 28 + 24}{8} = \frac{58}{8} = 7{,}25
\end{gathered}
$$

Il voto medio di tutti si calcola sulla distribuzione marginale di $Y$, l'ultima riga:

$$
\begin{aligned}
\bar{y} &= \frac{5 \cdot 6 + 6 \cdot 9 + 7 \cdot 10 + 8 \cdot 5}{30} \\
&= \frac{194}{30} \approx 6{,}47
\end{aligned}
$$

Le medie condizionate crescono con le ore di studio: $5{,}8$, poi $6{,}5$, poi $7{,}25$. La media generale non è la media semplice di questi tre numeri, perché i gruppi hanno numerosità diverse: è la loro media ponderata, con i totali di riga come pesi, e infatti $58 + 78 + 58 = 194$.
```

## Caratteri indipendenti

Nella tabella dei $50$ studenti le due distribuzioni condizionate di $Y$ sono molto diverse: sapere dove abita uno studente aiuta a prevedere come viene a scuola. Può succedere il contrario, cioè che il mezzo si distribuisca allo stesso modo in centro e in periferia: in quel caso sapere dove abita uno studente non dice niente sul mezzo che usa.

Due caratteri $X$ e $Y$ sono **indipendenti** se le distribuzioni condizionate di $Y$ rispetto a tutte le modalità di $X$ hanno le stesse frequenze relative. Se non lo sono, si dicono dipendenti, o connessi.

Per dirlo con una formula servono dei nomi. Chiamiamo $f_{ij}$ la frequenza congiunta della casella che sta nella riga $i$ e nella colonna $j$, $r_i$ il totale della riga $i$ e $c_j$ il totale della colonna $j$. Se i caratteri sono indipendenti, la frequenza relativa della colonna $j$ è la stessa in tutte le righe: chiamiamola $p$. Allora in ogni riga

$$f_{ij} = p \cdot r_i$$

Sommando queste uguaglianze su tutte le righe, a sinistra si ottiene il totale della colonna, $c_j$, e a destra $p$ moltiplicato per la somma dei totali di riga, che è $n$. Quindi $c_j = p \cdot n$, cioè $p = \dfrac{c_j}{n}$: la frequenza relativa comune a tutte le righe è quella della distribuzione marginale. Sostituendo:

$$f_{ij} = \frac{r_i \cdot c_j}{n}$$

Vale anche il contrario: se ogni frequenza congiunta è uguale a $\dfrac{r_i \cdot c_j}{n}$, dividendo per $r_i$ si trova $\dfrac{c_j}{n}$ in tutte le righe, e i caratteri sono indipendenti. Quindi $X$ e $Y$ sono indipendenti quando in ogni casella la frequenza congiunta è il prodotto del totale della sua riga per il totale della sua colonna, diviso per $n$.

La formula tratta righe e colonne allo stesso modo. Per questo non c'è bisogno di dire quale carattere è indipendente dall'altro: se le distribuzioni condizionate di $Y$ sono tutte uguali, lo sono anche quelle di $X$.

### Frequenze teoriche e contingenze

I numeri $\dfrac{r_i \cdot c_j}{n}$ si chiamano **frequenze teoriche** di indipendenza: sono le frequenze congiunte che la tabella avrebbe, con gli stessi totali, se i due caratteri fossero indipendenti. Per controllare l'indipendenza:

1. Calcola i totali di riga, i totali di colonna e $n$.
2. Per ogni casella calcola la frequenza teorica: totale di riga per totale di colonna, diviso $n$.
3. Confronta ogni frequenza teorica con la frequenza congiunta osservata. Se sono uguali in tutte le caselle, i caratteri sono indipendenti; se anche in una sola casella sono diverse, sono dipendenti.

La differenza tra la frequenza osservata e la frequenza teorica di una casella si chiama **contingenza**:

$$\text{contingenza} = f_{ij} - \frac{r_i \cdot c_j}{n}$$

Una contingenza positiva dice che quella coppia di modalità compare più spesso di quanto succederebbe con caratteri indipendenti, una negativa che compare meno spesso. Con caratteri indipendenti le contingenze sono tutte zero.

```ad-warning
Le frequenze teoriche possono avere la virgola
Una frequenza teorica come $9{,}6$ non è un conteggio di persone: è un valore di confronto, e non va arrotondata a $10$. Se la arrotondi, i totali della tabella teorica non tornano più.
```

```ad-example
Esempio 4: due caratteri indipendenti
Due classi votano la meta della gita: mare, montagna o lago.

| | mare | montagna | lago | totale |
|---|---|---|---|---|
| 3A | $8$ | $4$ | $8$ | $20$ |
| 3B | $12$ | $6$ | $12$ | $30$ |
| totale | $20$ | $10$ | $20$ | $50$ |

La classe e la meta scelta sono indipendenti?

Calcola le sei frequenze teoriche:

$$
\begin{gathered}
\frac{20 \cdot 20}{50} = 8 \qquad \frac{20 \cdot 10}{50} = 4 \qquad \frac{20 \cdot 20}{50} = 8 \\
\frac{30 \cdot 20}{50} = 12 \qquad \frac{30 \cdot 10}{50} = 6 \qquad \frac{30 \cdot 20}{50} = 12
\end{gathered}
$$

Sono uguali alle frequenze osservate in tutte le caselle: i due caratteri sono indipendenti. Lo stesso si vede dalle distribuzioni condizionate: nella 3A le percentuali sono $\dfrac{8}{20} = 40\%$, $\dfrac{4}{20} = 20\%$ e $40\%$, nella 3B $\dfrac{12}{30} = 40\%$, $\dfrac{6}{30} = 20\%$ e $40\%$. Le due classi votano allo stesso modo, anche se hanno un numero diverso di studenti.

```tikz
% nome: caratteri-indipendenti-barre-uguali
% alt: Tre barre orizzontali divise allo stesso modo: nella terza A, nella terza B e su tutti gli studenti il 40% sceglie il mare, il 20% la montagna e il 40% il lago
% svg: caratteri-indipendenti-barre-uguali-db99c7b6.svg 266x128
\begin{tikzpicture}[x=1cm, y=1cm]
\node[left] at (-0.1,0) {\footnotesize 3A};
\filldraw[fill=blue!30, draw=gray] (0,-0.3) rectangle (2.4,0.3);
\node at (1.2,0) {\footnotesize $40\%$};
\filldraw[fill=orange!35, draw=gray] (2.4,-0.3) rectangle (3.6,0.3);
\node at (3,0) {\footnotesize $20\%$};
\filldraw[fill=teal!30, draw=gray] (3.6,-0.3) rectangle (6,0.3);
\node at (4.8,0) {\footnotesize $40\%$};
\node[left] at (-0.1,-0.95) {\footnotesize 3B};
\filldraw[fill=blue!30, draw=gray] (0,-1.25) rectangle (2.4,-0.65);
\node at (1.2,-0.95) {\footnotesize $40\%$};
\filldraw[fill=orange!35, draw=gray] (2.4,-1.25) rectangle (3.6,-0.65);
\node at (3,-0.95) {\footnotesize $20\%$};
\filldraw[fill=teal!30, draw=gray] (3.6,-1.25) rectangle (6,-0.65);
\node at (4.8,-0.95) {\footnotesize $40\%$};
\node[left] at (-0.1,-1.9) {\footnotesize tutti};
\filldraw[fill=blue!30, draw=gray] (0,-2.2) rectangle (2.4,-1.6);
\node at (1.2,-1.9) {\footnotesize $40\%$};
\filldraw[fill=orange!35, draw=gray] (2.4,-2.2) rectangle (3.6,-1.6);
\node at (3,-1.9) {\footnotesize $20\%$};
\filldraw[fill=teal!30, draw=gray] (3.6,-2.2) rectangle (6,-1.6);
\node at (4.8,-1.9) {\footnotesize $40\%$};
\filldraw[fill=blue!30, draw=gray] (0,-2.89) rectangle (0.4,-2.61);
\node[right] at (0.4,-2.75) {\footnotesize mare};
\filldraw[fill=orange!35, draw=gray] (1.6,-2.89) rectangle (2,-2.61);
\node[right] at (2,-2.75) {\footnotesize montagna};
\filldraw[fill=teal!30, draw=gray] (3.8,-2.89) rectangle (4.2,-2.61);
\node[right] at (4.2,-2.75) {\footnotesize lago};
\end{tikzpicture}
```
```

```ad-example
Esempio 5: frequenze teoriche e contingenze
Per la tabella dei $50$ studenti (dove abitano e come vengono a scuola) calcola le frequenze teoriche e le contingenze.

I totali di riga sono $30$ e $20$, quelli di colonna $16$, $22$ e $12$, e $n = 50$. Per la casella (centro, a piedi) la frequenza teorica è

$$\frac{30 \cdot 16}{50} = 9{,}6$$

e allo stesso modo per le altre:

| frequenze teoriche | a piedi | autobus | motorino | totale |
|---|---|---|---|---|
| centro | $9{,}6$ | $13{,}2$ | $7{,}2$ | $30$ |
| periferia | $6{,}4$ | $8{,}8$ | $4{,}8$ | $20$ |
| totale | $16$ | $22$ | $12$ | $50$ |

I totali sono gli stessi della tabella osservata. Le contingenze sono le differenze tra le frequenze osservate e quelle teoriche, per esempio $15 - 9{,}6 = 5{,}4$:

| contingenze | a piedi | autobus | motorino |
|---|---|---|---|
| centro | $5{,}4$ | $-4{,}2$ | $-1{,}2$ |
| periferia | $-5{,}4$ | $4{,}2$ | $1{,}2$ |

Le contingenze non sono zero, quindi i due caratteri sono dipendenti. Chi abita in centro va a piedi più spesso di quanto succederebbe con caratteri indipendenti ($+5{,}4$), chi abita in periferia prende più spesso l'autobus ($+4{,}2$).
```

```ad-tip
Le contingenze si compensano
In ogni riga e in ogni colonna la somma delle contingenze è zero, perché la tabella osservata e quella teorica hanno gli stessi totali: nell'esempio 5, $5{,}4 - 4{,}2 - 1{,}2 = 0$ e $5{,}4 - 5{,}4 = 0$. Se una somma non viene zero, c'è un errore in una frequenza teorica.
```

```ad-example
Esempio 6: completare una tabella
In una scuola $60$ studenti si iscrivono al torneo d'istituto. Completa la tabella e stabilisci se la scelta dello sport è indipendente dall'essere al biennio o al triennio.

| | pallavolo | basket | nuoto | totale |
|---|---|---|---|---|
| biennio | $12$ | ? | $9$ | $28$ |
| triennio | ? | $18$ | ? | ? |
| totale | $20$ | ? | $15$ | $60$ |

Ogni totale è la somma della sua riga o della sua colonna, quindi una casella che manca si trova per differenza. Nella riga del biennio: $28 - 12 - 9 = 7$. Nella colonna della pallavolo: $20 - 12 = 8$. Nella colonna del nuoto: $15 - 9 = 6$. Il totale del triennio è $60 - 28 = 32$, e il totale del basket è $7 + 18 = 25$.

| | pallavolo | basket | nuoto | totale |
|---|---|---|---|---|
| biennio | $12$ | $7$ | $9$ | $28$ |
| triennio | $8$ | $18$ | $6$ | $32$ |
| totale | $20$ | $25$ | $15$ | $60$ |

Controllo: $8 + 18 + 6 = 32$ e $20 + 25 + 15 = 60$.

Per l'indipendenza calcola la frequenza teorica della prima casella:

$$\frac{28 \cdot 20}{60} \approx 9{,}33$$

La frequenza osservata è $12$, diversa da $9{,}33$: una casella è sufficiente per dire che i due caratteri sono dipendenti.
```

```ad-warning
Dipendenti non vuol dire che uno causa l'altro
Nell'esempio 2 chi ha fatto gli esercizi ha preso più spesso la sufficienza, e i due caratteri sono dipendenti. La tabella però non dice perché: può darsi che gli esercizi aiutino, ma anche che chi è già bravo in matematica faccia più volentieri gli esercizi. La dipendenza statistica descrive i dati, non spiega la causa.
```

```ad-note
Con i dati veri l'indipendenza esatta è rara
Nei dati raccolti davvero le frequenze osservate non sono quasi mai uguali a quelle teoriche in tutte le caselle. Interessa allora sapere se le contingenze sono grandi o piccole, cioè quanto la tabella è lontana dall'indipendenza: per misurarlo esiste un indice, il chi quadrato, che questa lezione non tratta.
```

## Che cosa viene dopo

Quando i due caratteri sono quantitativi, come le ore di studio e il voto dell'esempio 3, si può chiedere anche se al crescere di uno l'altro cresce o diminuisce, e di quanto. Gli strumenti per rispondere sono nella lezione [Regressione e correlazione](/materiale/scuola-superiore/matematica/statistica-bivariata/regressione-e-correlazione).
