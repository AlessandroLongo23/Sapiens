# La CPU e il ciclo di esecuzione delle istruzioni

La CPU sa fare poche cose, tutte piccole: copiare un numero, sommarne due, confrontarli. Un videogioco o un'app di messaggi nascono dal fatto che la CPU ripete queste piccole operazioni, una dopo l'altra, milioni o miliardi di volte al secondo, seguendo sempre lo stesso ciclo in tre fasi. Nella [macchina di von Neumann](/materiale/scuola-superiore/informatica/l-architettura-del-computer/la-macchina-di-von-neumann) la CPU è il blocco che esegue le istruzioni: qui la apriamo per vedere come lo fa.

## Le parti della CPU

Dentro la CPU ci sono tre tipi di componenti.

- L'**unità di controllo** dirige il lavoro: va a prendere l'istruzione, capisce che cosa chiede e manda i comandi alle altre parti perché venga eseguita. Non fa calcoli.
- L'**unità aritmetico-logica (ALU)**, dall'inglese Arithmetic Logic Unit, fa i calcoli e i confronti: somma, sottrae, stabilisce se un numero è maggiore di un altro.
- I **registri** sono piccolissime memorie interne alla CPU, ognuna capace di contenere un solo valore. Sono le memorie più veloci di tutto il computer, perché la CPU le ha a portata di mano.

I registri che servono per seguire un programma sono tre:

- il **contatore di programma (PC)**, dall'inglese Program Counter, contiene l'indirizzo della prossima istruzione da prelevare;
- il **registro istruzioni (IR)**, dall'inglese Instruction Register, contiene l'istruzione che la CPU sta eseguendo;
- l'**accumulatore (ACC)** contiene il numero su cui la CPU sta lavorando: i dati entrano qui, e qui la ALU lascia il risultato dei calcoli.

```tikz
% nome: cpu-parti-registri
% alt: Schema della CPU: un riquadro grande con dentro, a sinistra, l'unità di controllo e la ALU una sopra l'altra e, a destra, i tre registri in colonna, contatore di programma PC, registro istruzioni IR e accumulatore ACC
\begin{tikzpicture}
\tikzset{parte/.style={draw, thick, rounded corners=2pt, minimum width=2.5cm, minimum height=0.95cm, align=center, font=\small, fill=blue!12},
reg/.style={draw, thick, minimum width=2.7cm, minimum height=0.6cm, font=\small, fill=orange!22}}
\draw[thick, rounded corners=4pt] (-1.65,-2.0) rectangle (5.35,1.45);
\node[font=\small, anchor=west] at (-1.5,1.12) {CPU};
\node[parte] (uc) at (0,0.3) {unità di\\controllo};
\node[parte] (alu) at (0,-1.05) {ALU};
\node[reg] (pc) at (3.6,0.35) {PC};
\node[reg] (ir) at (3.6,-0.35) {IR};
\node[reg] (acc) at (3.6,-1.05) {ACC};
\node[font=\footnotesize] at (3.6,-1.65) {registri};
\draw[{Stealth}-{Stealth}, thick] (uc.east) -- (2.25,0.3);
\draw[{Stealth}-{Stealth}, thick] (alu.east) -- (2.25,-1.05);
\draw[-{Stealth}, thick] (uc.south) -- (alu.north);
\end{tikzpicture}
```

## Un linguaggio macchina in miniatura

Le istruzioni che una CPU sa eseguire formano il suo **linguaggio macchina**. Nei computer veri ogni istruzione è una sequenza di bit, e ogni famiglia di CPU ha le sue. Per seguire che cosa succede usiamo un linguaggio inventato per questa lezione, con cinque istruzioni scritte a parole: nessuna CPU vera lo usa, ma funziona come quelli veri.

La memoria centrale è una fila di celle numerate: il numero di una cella è il suo **indirizzo**. Quasi ogni istruzione ha due parti, il nome dell'operazione e l'indirizzo della cella su cui lavora.

| Istruzione | Che cosa fa |
|---|---|
| `CARICA n` | copia nell'accumulatore il contenuto della cella $n$ |
| `SOMMA n` | somma all'accumulatore il contenuto della cella $n$ |
| `SOTTRAI n` | sottrae dall'accumulatore il contenuto della cella $n$ |
| `SALVA n` | copia nella cella $n$ il contenuto dell'accumulatore |
| `FERMA` | ferma il programma |

Per esempio `SOMMA 11` non somma il numero $11$: somma il numero che si trova nella cella di indirizzo $11$.

```ad-warning
Copiare non è spostare
`CARICA 10` copia nell'accumulatore il contenuto della cella $10$, che resta com'era. Allo stesso modo `SALVA 12` copia l'accumulatore nella cella $12$ e l'accumulatore non si azzera: dopo l'istruzione lo stesso numero si trova in tutti e due i posti.
```

## Il ciclo prelievo, decodifica, esecuzione

Per ogni istruzione la CPU compie sempre le stesse tre fasi, che insieme formano il **ciclo di esecuzione**:

1. Prelievo (in inglese fetch): l'unità di controllo legge nel contatore di programma l'indirizzo dell'istruzione, la copia dalla memoria centrale nel registro istruzioni e aumenta di $1$ il contatore di programma.
2. Decodifica (decode): l'unità di controllo esamina l'istruzione che è nel registro istruzioni e riconosce l'operazione e l'indirizzo.
3. Esecuzione (execute): l'unità di controllo comanda le parti che servono. Se c'è un calcolo lo fa la ALU, e il risultato va nell'accumulatore.

Finita l'esecuzione il ciclo ricomincia dal prelievo, e siccome il contatore di programma è già aumentato, l'istruzione prelevata è quella della cella successiva.

```tikz
% nome: ciclo-prelievo-decodifica-esecuzione
% alt: Il ciclo di esecuzione disegnato come tre riquadri disposti a triangolo e collegati da frecce in senso orario: prelievo, con la scritta l'istruzione va nel registro istruzioni e il contatore di programma aumenta di uno; decodifica; esecuzione; dall'esecuzione una freccia torna al prelievo
\begin{tikzpicture}
\tikzset{fase/.style={draw, thick, fill=blue!12, rounded corners=3pt, minimum width=2.3cm, minimum height=0.75cm, font=\small}}
\node[fase] (p) at (0,1.5) {1. prelievo};
\node[fase] (d) at (2.6,0) {2. decodifica};
\node[fase, fill=orange!25] (e) at (-2.6,0) {3. esecuzione};
\draw[-{Stealth}, thick] (p.east) -| (d.north);
\draw[-{Stealth}, thick] (d.south) -- ++(0,-0.55) -| (e.south);
\draw[-{Stealth}, thick] (e.north) |- (p.west);
\node[font=\footnotesize] at (0,2.2) {IR riceve l'istruzione, PC aumenta di 1};
\end{tikzpicture}
```

```ad-warning
Il contatore di programma guarda avanti
Durante l'esecuzione di un'istruzione il contatore di programma non contiene il suo indirizzo, ma quello dell'istruzione dopo: è stato aumentato già nella fase di prelievo. Se la CPU sta eseguendo l'istruzione della cella $2$, nel contatore di programma c'è $3$.
```

```ad-example
Esempio 1: sommare due numeri
La memoria contiene il programma nelle celle da $0$ a $3$ e i dati nelle celle da $10$ a $12$. Il contatore di programma parte da $0$. Che cosa succede?

| Cella | Contenuto |
|---|---|
| 0 | `CARICA 10` |
| 1 | `SOMMA 11` |
| 2 | `SALVA 12` |
| 3 | `FERMA` |
| 10 | 7 |
| 11 | 5 |
| 12 | 0 |

Primo ciclo. Prelievo: il contatore di programma contiene $0$, quindi nel registro istruzioni entra `CARICA 10` e il contatore passa a $1$. Decodifica: l'operazione è "carica", l'indirizzo è $10$. Esecuzione: il contenuto della cella $10$, cioè $7$, viene copiato nell'accumulatore.

Gli altri cicli vanno allo stesso modo. Lo stato della CPU alla fine di ogni ciclo è questo:

| Ciclo | Registro istruzioni | Contatore di programma | Accumulatore | Cella 12 |
|---|---|---|---|---|
| 1 | `CARICA 10` | 1 | 7 | 0 |
| 2 | `SOMMA 11` | 2 | 12 | 0 |
| 3 | `SALVA 12` | 3 | 12 | 12 |
| 4 | `FERMA` | 4 | 12 | 12 |

Nel secondo ciclo la ALU calcola $7 + 5 = 12$. Alla fine la cella $12$ contiene la somma, e le celle $10$ e $11$ non sono cambiate.
```

```ad-example
Esempio 2: una somma e una sottrazione
Il programma parte dalla cella $0$. Quale numero c'è nell'accumulatore quando si ferma?

| Cella | Contenuto |
|---|---|
| 0 | `CARICA 20` |
| 1 | `SOMMA 21` |
| 2 | `SOTTRAI 22` |
| 3 | `SALVA 23` |
| 4 | `FERMA` |
| 20 | 18 |
| 21 | 15 |
| 22 | 8 |
| 23 | 0 |

Si segue l'accumulatore un'istruzione alla volta. Dopo `CARICA 20` contiene $18$. Dopo `SOMMA 21` contiene $18 + 15 = 33$. Dopo `SOTTRAI 22` contiene $33 - 8 = 25$. `SALVA 23` copia $25$ nella cella $23$ e lascia l'accumulatore com'è.

Quando il programma si ferma l'accumulatore contiene $25$.
```

```ad-example
Esempio 3: una cella che cambia durante il programma
Il programma parte dalla cella $0$. Quale numero c'è nella cella $12$ alla fine?

| Cella | Contenuto |
|---|---|
| 0 | `CARICA 10` |
| 1 | `SOMMA 11` |
| 2 | `SALVA 10` |
| 3 | `SOMMA 10` |
| 4 | `SALVA 12` |
| 5 | `FERMA` |
| 10 | 4 |
| 11 | 6 |
| 12 | 0 |

Dopo `CARICA 10` l'accumulatore contiene $4$, dopo `SOMMA 11` contiene $4 + 6 = 10$. `SALVA 10` scrive $10$ nella cella $10$, al posto del $4$. Per questo `SOMMA 10`, che viene dopo, somma $10$ e non $4$: l'accumulatore passa a $10 + 10 = 20$, e `SALVA 12` scrive $20$ nella cella $12$.

Chi usa il valore che la cella $10$ aveva all'inizio trova $10 + 4 = 14$, che è sbagliato: ogni istruzione legge la memoria com'è in quel momento.
```

## Il clock e la frequenza

Le fasi del ciclo non partono quando capita: le scandisce il **clock**, un segnale che si ripete a intervalli regolari, come il battito di un metronomo. A ogni impulso del clock la CPU fa un passo avanti. La **frequenza** del clock è il numero di impulsi in un secondo e si misura in hertz ($\text{Hz}$), con i multipli

$$1\,\text{kHz} = 1000\,\text{Hz} \qquad 1\,\text{MHz} = 1\,000\,000\,\text{Hz} \qquad 1\,\text{GHz} = 1\,000\,000\,000\,\text{Hz}$$

Un'istruzione richiede di solito più di un impulso. Se si conosce quanti ne servono, il numero di istruzioni eseguite in un secondo è

$$\text{istruzioni al secondo} = \frac{\text{frequenza del clock}}{\text{impulsi per istruzione}}$$

```ad-example
Esempio 4: quante istruzioni al secondo
Una CPU ha un clock di $2\,\text{MHz}$ e impiega $4$ impulsi di clock per ogni istruzione. Quante istruzioni esegue in un secondo? E quanto tempo impiega per eseguirne $3\,000\,000$?

1. Si scrive la frequenza in hertz: $2\,\text{MHz} = 2\,000\,000\,\text{Hz}$, cioè $2\,000\,000$ impulsi al secondo.
2. Si divide per gli impulsi di un'istruzione: $2\,000\,000 : 4 = 500\,000$ istruzioni al secondo.
3. Per $3\,000\,000$ istruzioni servono $3\,000\,000 : 500\,000 = 6$ secondi.
```

```ad-warning
La frequenza da sola non dice quale CPU è più veloce
Due CPU con lo stesso clock possono eseguire un numero diverso di istruzioni al secondo, se una ha bisogno di meno impulsi per istruzione, e le istruzioni di una possono fare più lavoro di quelle dell'altra. La frequenza serve a confrontare due CPU dello stesso tipo, non due CPU qualsiasi.
```

## I core

Unità di controllo, ALU e registri formano insieme un **core**, cioè una unità che esegue da sola il ciclo di esecuzione. Le CPU dei computer e dei telefoni di oggi contengono più core nello stesso componente: ogni core esegue le istruzioni di un programma diverso, o di una parte diversa dello stesso programma, nello stesso momento. È per questo che puoi ascoltare musica mentre scarichi un file e scrivi un messaggio.

```ad-example
Esempio 5: una CPU con quattro core
Una CPU ha $4$ core, e ogni core esegue $500\,000$ istruzioni al secondo. Quante istruzioni può eseguire al massimo la CPU in $3$ secondi?

In un secondo i quattro core insieme eseguono $4 \cdot 500\,000 = 2\,000\,000$ istruzioni. In $3$ secondi sono $3 \cdot 2\,000\,000 = 6\,000\,000$ istruzioni.

È un massimo: si raggiunge solo se c'è lavoro per tutti e quattro i core. Un programma scritto per essere eseguito un'istruzione dopo l'altra usa un core solo, e con quattro core non va quattro volte più veloce.
```

Chi decide quale programma va su quale core è il sistema operativo, come spiega la lezione [Processi, thread e multitasking](/materiale/scuola-superiore/informatica/il-sistema-operativo/processi-thread-e-multitasking).
