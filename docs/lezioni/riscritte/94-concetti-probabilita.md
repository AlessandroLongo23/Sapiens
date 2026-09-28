# Eventi e probabilità

Lanciando un dado non puoi sapere quale numero uscirà, ma puoi dire quanto è probabile che esca un numero pari: le facce sono sei, tutte con la stessa possibilità di uscire, e tre sono pari. La probabilità dell'uscita di un numero pari è quindi $\dfrac{3}{6} = \dfrac{1}{2}$. La probabilità è un numero tra $0$ e $1$ che misura quanto ci si può aspettare che un fatto incerto accada: vale $0$ per quello che non può succedere, $1$ per quello che succede di sicuro.

Per seguire questa lezione ti servono gli insiemi con le loro operazioni, [unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica), [intersezione](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica) e [complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare), e le [frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali).

## Esperimento aleatorio e spazio campionario

Un **esperimento aleatorio** è un esperimento di cui si conoscono tutti i risultati possibili, ma non si può prevedere quale si otterrà. Lanciare una moneta, lanciare un dado, estrarre una pallina da un'urna senza guardare, pescare una carta da un mazzo mescolato sono esperimenti aleatori. Ogni risultato possibile si chiama **esito**.

Lo **spazio campionario** è l'insieme di tutti gli esiti dell'esperimento, e si indica con la lettera greca $\Omega$ (omega). Per la moneta, scrivendo $T$ per testa e $C$ per croce, e per il dado:

$$
\begin{gathered}
\Omega = \{T, C\} \\
\Omega = \{1, 2, 3, 4, 5, 6\}
\end{gathered}
$$

Quando l'esperimento è fatto di due parti, un esito dice come va ciascuna delle due. Lanciando due monete, una da un euro e una da due euro, l'esito $TC$ vuol dire testa con la prima e croce con la seconda, e $CT$ è un esito diverso:

$$\Omega = \{TT, TC, CT, CC\}$$

Lanciando due dadi, uno rosso e uno blu, un esito è una coppia ordinata $(a, b)$: $a$ è il numero del primo dado, $b$ quello del secondo. Lo spazio campionario è il [prodotto cartesiano](/materiale/scuola-superiore/matematica/insiemi-e-logica/prodotto-cartesiano) $\{1, \dots, 6\} \times \{1, \dots, 6\}$, che ha $6 \cdot 6 = 36$ elementi: $(1, 1)$, $(1, 2)$, fino a $(6, 6)$. La coppia $(2, 5)$ e la coppia $(5, 2)$ sono esiti diversi. I $36$ esiti si scrivono in una tabella: la riga è il numero del primo dado, la colonna quello del secondo, e nella casella c'è la somma dei due numeri.

```tikz
% nome: due-dadi-tabella-somme
% alt: Tabella sei per sei dei lanci di due dadi: in ogni casella la somma dei due numeri; sono colorate le sei caselle con somma 7, sulla diagonale che va dal basso a sinistra all'alto a destra
% svg: due-dadi-tabella-somme-1b8d1ae2.svg 166x165
\begin{tikzpicture}
\fill[blue!20] (2.75,-0.55) rectangle (3.30,0.00);
\fill[blue!20] (2.20,-1.10) rectangle (2.75,-0.55);
\fill[blue!20] (1.65,-1.65) rectangle (2.20,-1.10);
\fill[blue!20] (1.10,-2.20) rectangle (1.65,-1.65);
\fill[blue!20] (0.55,-2.75) rectangle (1.10,-2.20);
\fill[blue!20] (0.00,-3.30) rectangle (0.55,-2.75);
\draw[black!60] (0.00,0) -- (0.00,-3.30);
\draw[black!60] (0,0.00) -- (3.30,0.00);
\draw[black!60] (0.55,0) -- (0.55,-3.30);
\draw[black!60] (0,-0.55) -- (3.30,-0.55);
\draw[black!60] (1.10,0) -- (1.10,-3.30);
\draw[black!60] (0,-1.10) -- (3.30,-1.10);
\draw[black!60] (1.65,0) -- (1.65,-3.30);
\draw[black!60] (0,-1.65) -- (3.30,-1.65);
\draw[black!60] (2.20,0) -- (2.20,-3.30);
\draw[black!60] (0,-2.20) -- (3.30,-2.20);
\draw[black!60] (2.75,0) -- (2.75,-3.30);
\draw[black!60] (0,-2.75) -- (3.30,-2.75);
\draw[black!60] (3.30,0) -- (3.30,-3.30);
\draw[black!60] (0,-3.30) -- (3.30,-3.30);
\node at (0.275,0.275) {\small $1$};
\node at (-0.275,-0.275) {\small $1$};
\node at (0.825,0.275) {\small $2$};
\node at (-0.275,-0.825) {\small $2$};
\node at (1.375,0.275) {\small $3$};
\node at (-0.275,-1.375) {\small $3$};
\node at (1.925,0.275) {\small $4$};
\node at (-0.275,-1.925) {\small $4$};
\node at (2.475,0.275) {\small $5$};
\node at (-0.275,-2.475) {\small $5$};
\node at (3.025,0.275) {\small $6$};
\node at (-0.275,-3.025) {\small $6$};
\node at (0.275,-0.275) {\footnotesize $2$};
\node at (0.825,-0.275) {\footnotesize $3$};
\node at (1.375,-0.275) {\footnotesize $4$};
\node at (1.925,-0.275) {\footnotesize $5$};
\node at (2.475,-0.275) {\footnotesize $6$};
\node at (3.025,-0.275) {\footnotesize $7$};
\node at (0.275,-0.825) {\footnotesize $3$};
\node at (0.825,-0.825) {\footnotesize $4$};
\node at (1.375,-0.825) {\footnotesize $5$};
\node at (1.925,-0.825) {\footnotesize $6$};
\node at (2.475,-0.825) {\footnotesize $7$};
\node at (3.025,-0.825) {\footnotesize $8$};
\node at (0.275,-1.375) {\footnotesize $4$};
\node at (0.825,-1.375) {\footnotesize $5$};
\node at (1.375,-1.375) {\footnotesize $6$};
\node at (1.925,-1.375) {\footnotesize $7$};
\node at (2.475,-1.375) {\footnotesize $8$};
\node at (3.025,-1.375) {\footnotesize $9$};
\node at (0.275,-1.925) {\footnotesize $5$};
\node at (0.825,-1.925) {\footnotesize $6$};
\node at (1.375,-1.925) {\footnotesize $7$};
\node at (1.925,-1.925) {\footnotesize $8$};
\node at (2.475,-1.925) {\footnotesize $9$};
\node at (3.025,-1.925) {\footnotesize $10$};
\node at (0.275,-2.475) {\footnotesize $6$};
\node at (0.825,-2.475) {\footnotesize $7$};
\node at (1.375,-2.475) {\footnotesize $8$};
\node at (1.925,-2.475) {\footnotesize $9$};
\node at (2.475,-2.475) {\footnotesize $10$};
\node at (3.025,-2.475) {\footnotesize $11$};
\node at (0.275,-3.025) {\footnotesize $7$};
\node at (0.825,-3.025) {\footnotesize $8$};
\node at (1.375,-3.025) {\footnotesize $9$};
\node at (1.925,-3.025) {\footnotesize $10$};
\node at (2.475,-3.025) {\footnotesize $11$};
\node at (3.025,-3.025) {\footnotesize $12$};
\node at (1.650,0.743) {\small secondo dado};
\node[rotate=90] at (-0.743,-1.650) {\small primo dado};
\end{tikzpicture}
```

```ad-note
Il mazzo di 40 carte
Negli esempi si usa il mazzo di $40$ carte napoletane (le piacentine e le siciliane sono uguali per i conti). Ha quattro semi, coppe, denari, bastoni e spade, e per ogni seme dieci carte: l'asso, che vale $1$, le carte dal $2$ al $7$ e tre figure, il fante ($8$), il cavallo ($9$) e il re ($10$). In tutto ci sono quindi $4$ assi, $4$ re, $10$ carte di ogni seme e $3 \cdot 4 = 12$ figure.
```

## Eventi

Un **evento** è un sottoinsieme dello spazio campionario. Di solito si descrive con una frase ("esce un numero pari") e si scrive come insieme, elencando gli esiti per cui la frase è vera:

$$E = \{2, 4, 6\}$$

Fatto l'esperimento, l'evento $E$ si verifica se l'esito ottenuto appartiene a $E$: se esce $4$, l'evento "esce un numero pari" si è verificato; se esce $3$, no.

Alcuni eventi hanno un nome.

- Un **evento elementare** contiene un solo esito: "esce $5$", cioè $\{5\}$.
- L'**evento certo** è $\Omega$, che si verifica sempre: "esce un numero minore di $7$".
- L'**evento impossibile** è l'insieme vuoto $\emptyset$, che non si verifica mai: "esce $7$".

```ad-example
Esempio 1: eventi con due monete
Si lanciano due monete, con $\Omega = \{TT, TC, CT, CC\}$.

- "Esce almeno una testa" è l'evento $\{TT, TC, CT\}$.
- "Escono due facce uguali" è l'evento $\{TT, CC\}$.
- "Escono due croci" è l'evento elementare $\{CC\}$.
- "Escono tre teste" è l'evento impossibile $\emptyset$: le monete sono due.
```

## Operazioni tra eventi

Gli eventi sono insiemi, quindi si combinano con le operazioni tra insiemi. Ogni operazione corrisponde a una parola della frase che descrive l'evento.

- L'**unione** $A \cup B$, detta anche **somma logica**, è l'evento "$A$ o $B$": si verifica quando si verifica almeno uno dei due eventi, anche tutti e due.
- L'**intersezione** $A \cap B$, detta anche **prodotto logico**, è l'evento "$A$ e $B$": si verifica quando si verificano tutti e due.
- L'**evento contrario** di $A$ è il complementare $\overline{A}$ rispetto a $\Omega$, cioè l'evento "non $A$": si verifica quando $A$ non si verifica.

Nel lancio di un dado prendiamo gli eventi $A$ = "esce un numero pari" e $B$ = "esce un numero maggiore di $3$":

$$
\begin{gathered}
A = \{2, 4, 6\} \\
B = \{4, 5, 6\}
\end{gathered}
$$

Nel diagramma di Eulero-Venn il rettangolo è lo spazio campionario e ogni esito sta nella zona degli eventi a cui appartiene:

```tikz
% nome: eventi-dado-diagramma-venn
% alt: Diagramma di Eulero-Venn del lancio di un dado: nel rettangolo omega ci sono i numeri da 1 a 6; il cerchio A dei numeri pari contiene 2, 4 e 6, il cerchio B dei numeri maggiori di 3 contiene 4, 5 e 6; 4 e 6 stanno nella zona comune, 1 e 3 fuori dai due cerchi
% svg: eventi-dado-diagramma-venn-4f2e51e9.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$\Omega$};
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\node at (-1.7,0) {$2$};
\node at (0,0.35) {$4$};
\node at (0,-0.35) {$6$};
\node at (1.7,0) {$5$};
\node at (-2.55,-1.55) {$1$};
\node at (2.55,-1.55) {$3$};
\end{tikzpicture}
```

Leggendo il diagramma:

$$
\begin{gathered}
A \cup B = \{2, 4, 5, 6\} \\
A \cap B = \{4, 6\} \\
\overline{A} = \{1, 3, 5\}
\end{gathered}
$$

L'evento contrario di "esce un numero pari" è "esce un numero dispari". Un evento e il suo contrario non hanno esiti in comune, e insieme li contengono tutti: $A \cap \overline{A} = \emptyset$ e $A \cup \overline{A} = \Omega$.

### Eventi incompatibili

Due eventi sono **incompatibili** se non possono verificarsi insieme, cioè se non hanno esiti in comune:

$$A \cap B = \emptyset$$

Come insiemi, sono [disgiunti](/materiale/scuola-superiore/matematica/insiemi-e-logica/intersezione-insiemistica). Due eventi che hanno almeno un esito in comune si dicono **compatibili**. Nel lancio di un dado, "esce $1$" ed "esce un numero pari" sono incompatibili; "esce un numero pari" ed "esce un numero maggiore di $3$" sono compatibili, perché con $4$ o con $6$ si verificano tutti e due.

```ad-warning
Incompatibili in un esperimento, compatibili in un altro
"Esce $6$" ed "esce $1$" sono incompatibili lanciando un dado solo. Lanciando due dadi, "il primo dado dà $6$" e "il secondo dado dà $1$" sono compatibili: l'esito $(6, 1)$ li realizza tutti e due. Prima di dire se due eventi sono incompatibili, scrivi lo spazio campionario e cerca un esito comune.
```

## La definizione classica di probabilità

Gli esiti di un esperimento sono **equiprobabili** quando ognuno ha la stessa possibilità di verificarsi degli altri. Lo sono le facce di una moneta o di un dado non truccati, le carte di un mazzo ben mescolato, le palline di un'urna quando sono tutte uguali al tatto e si estraggono senza guardare.

Se gli esiti sono equiprobabili, la **probabilità** di un evento $E$ è il rapporto tra il numero dei casi favorevoli, cioè gli esiti che appartengono a $E$, e il numero dei casi possibili, cioè tutti gli esiti di $\Omega$:

$$p(E) = \dfrac{\text{casi favorevoli}}{\text{casi possibili}}$$

Con il numero di elementi di un insieme, come in [Differenza e complementare](/materiale/scuola-superiore/matematica/insiemi-e-logica/differenza-e-complementare), la stessa formula si scrive

$$p(E) = \dfrac{|E|}{|\Omega|}$$

La probabilità di un evento elementare, con $n$ esiti equiprobabili, è $\dfrac{1}{n}$: per ogni faccia del dado, $\dfrac{1}{6}$.

I casi favorevoli sono al massimo tutti quelli possibili e al minimo nessuno, quindi la probabilità sta sempre tra $0$ e $1$:

$$0 \leq p(E) \leq 1$$

L'evento impossibile ha zero casi favorevoli, e $p(\emptyset) = 0$; l'evento certo li ha tutti, e $p(\Omega) = 1$. La probabilità si può scrivere come frazione, come numero decimale o come percentuale: $\dfrac{1}{4} = 0{,}25 = 25\%$, con i conti di [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

```ad-warning
Una probabilità maggiore di 1
Se trovi $p(E) = \dfrac{7}{6}$ o una probabilità negativa, hai sbagliato un conteggio: i casi favorevoli non possono essere più di quelli possibili.
```

Per contare gli esiti, in questa lezione, si elencano tutti. Conviene elencarli con un ordine fisso, come nella tabella dei due dadi, così non se ne perde nessuno e nessuno viene contato due volte.

```ad-example
Esempio 2: il lancio di un dado
Si lancia un dado non truccato: i casi possibili sono $6$, tutti equiprobabili.

- "Esce un numero pari": casi favorevoli $2$, $4$, $6$, quindi $p = \dfrac{3}{6} = \dfrac{1}{2}$.
- "Esce un multiplo di $3$": casi favorevoli $3$ e $6$, quindi $p = \dfrac{2}{6} = \dfrac{1}{3}$.
- "Esce un numero minore di $7$": è l'evento certo, $p = 1$.
- "Esce $7$": è l'evento impossibile, $p = 0$.
```

```ad-example
Esempio 3: due monete
Si lanciano due monete non truccate: $\Omega = \{TT, TC, CT, CC\}$, con quattro esiti equiprobabili.

"Escono una testa e una croce" ha i casi favorevoli $TC$ e $CT$:
$$p = \dfrac{2}{4} = \dfrac{1}{2}$$
"Esce almeno una testa" ha i casi favorevoli $TT$, $TC$ e $CT$:
$$p = \dfrac{3}{4}$$
```

```ad-warning
Esiti che non sono equiprobabili
Con due monete si potrebbe dire che i risultati sono tre, "due teste", "due croci", "una testa e una croce", e concludere che ognuno ha probabilità $\dfrac{1}{3}$. È sbagliato: "una testa e una croce" si ottiene in due modi, $TC$ e $CT$, e ha probabilità $\dfrac{1}{2}$, il doppio di "due teste". La formula dei casi favorevoli si usa solo con esiti equiprobabili. Lo stesso vale per la somma di due dadi: le somme possibili sono $11$, da $2$ a $12$, ma non sono equiprobabili, e $\dfrac{1}{11}$ non è la probabilità di nessuna di esse.
```

```ad-example
Esempio 4: la somma di due dadi
Si lanciano due dadi non truccati. Gli esiti equiprobabili sono le $36$ coppie della tabella.

"La somma è $7$" ha sei casi favorevoli, le caselle colorate nella tabella: $(1, 6)$, $(2, 5)$, $(3, 4)$, $(4, 3)$, $(5, 2)$, $(6, 1)$. Quindi
$$p = \dfrac{6}{36} = \dfrac{1}{6}$$
"La somma è $4$" ha tre casi favorevoli, $(1, 3)$, $(2, 2)$, $(3, 1)$:
$$p = \dfrac{3}{36} = \dfrac{1}{12}$$
"La somma è $12$" ha solo il caso $(6, 6)$, quindi $p = \dfrac{1}{36}$. Il $7$ è la somma più probabile: nella tabella è quella che compare più volte.
```

```ad-example
Esempio 5: un'urna di palline colorate
Un'urna contiene $3$ palline rosse, $5$ blu e $2$ verdi, tutte uguali al tatto, e se ne estrae una senza guardare.

Gli esiti equiprobabili sono le $10$ palline, non i $3$ colori: per contarle immagina di numerarle da $1$ a $10$. La probabilità di estrarre una pallina rossa è
$$p = \dfrac{3}{10} = 0{,}3$$
La probabilità di estrarre una pallina che non è blu ha $3 + 2 = 5$ casi favorevoli:
$$p = \dfrac{5}{10} = \dfrac{1}{2}$$
Dire "i colori sono tre, quindi la probabilità del rosso è $\dfrac{1}{3}$" è lo stesso errore delle due monete: i colori non sono equiprobabili, perché le palline blu sono di più.
```

```ad-example
Esempio 6: una carta dal mazzo
Si pesca una carta da un mazzo di $40$ carte napoletane ben mescolato: i casi possibili sono $40$.

- "Esce un asso": $4$ casi favorevoli, $p = \dfrac{4}{40} = \dfrac{1}{10}$.
- "Esce una carta di denari": $10$ casi favorevoli, $p = \dfrac{10}{40} = \dfrac{1}{4}$.
- "Esce una figura": $12$ casi favorevoli, $p = \dfrac{12}{40} = \dfrac{3}{10}$.
- "Esce il re di spade": $1$ caso favorevole, $p = \dfrac{1}{40}$.
```

```ad-example
Esempio 7: tre monete
Si lanciano tre monete. Per elencare gli esiti senza perderne nessuno si fissa la prima moneta e si scrivono tutti i modi di completare con le altre due:
$$
\begin{gathered}
TTT, \ TTC, \ TCT, \ TCC \\
CTT, \ CTC, \ CCT, \ CCC
\end{gathered}
$$
Gli esiti sono $8$, equiprobabili. "Escono esattamente due teste" ha i casi favorevoli $TTC$, $TCT$, $CTT$:
$$p = \dfrac{3}{8}$$
```

## La definizione frequentista

Molti esperimenti non hanno esiti equiprobabili: una puntina da disegno lanciata sul tavolo può cadere con la punta in su o su un fianco, ma non c'è motivo di pensare che le due posizioni abbiano la stessa possibilità. La probabilità di un evento così si stima ripetendo l'esperimento molte volte, sempre nelle stesse condizioni, e contando quante volte l'evento si verifica.

Se su $N$ prove l'evento $E$ si verifica $f_a$ volte, la sua frequenza relativa è, come in [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici),

$$f_r = \dfrac{f_a}{N}$$

Anche la frequenza relativa sta tra $0$ e $1$. Per la **definizione frequentista**, la probabilità di un evento è la frequenza relativa con cui si verifica in un numero grande di prove, fatte tutte nelle stesse condizioni. È una stima: con un'altra serie di prove si ottiene un numero un po' diverso.

```ad-example
Esempio 8: lampadine difettose
Una ditta controlla $500$ lampadine prese dalla produzione di un giorno e ne trova $12$ difettose. La frequenza relativa è
$$f_r = \dfrac{12}{500} = 0{,}024$$
e la probabilità che una lampadina di quella produzione sia difettosa si stima in $0{,}024$, cioè il $2{,}4\%$.
```

Quando un esperimento si può studiare con tutte e due le definizioni, i due numeri vanno d'accordo. In una simulazione al computer di $10\,000$ lanci di una moneta, le teste contate dopo $10$, $100$, $1000$ e $10\,000$ lanci sono state queste:

| Lanci $N$ | Teste $f_a$ | $f_r$ |
|---|---|---|
| $10$ | $3$ | $0{,}3$ |
| $100$ | $41$ | $0{,}41$ |
| $1000$ | $496$ | $0{,}496$ |
| $10\,000$ | $5038$ | $0{,}5038$ |

Il grafico mostra la frequenza relativa di testa nei primi $1000$ lanci della stessa simulazione:

```tikz
% nome: frequenza-relativa-testa-lanci-moneta
% alt: Grafico della frequenza relativa di testa in 1000 lanci simulati di una moneta: nei primi lanci la linea sale e scende molto, poi oscilla sempre meno vicino alla retta tratteggiata di altezza 0,5
% svg: frequenza-relativa-testa-lanci-moneta-4fb901e2.svg 270x173
\begin{tikzpicture}
\draw[black!70, ->] (0,0) -- (5.40,0) node[right] {\small lanci};
\draw[black!70, ->] (0,0) -- (0,3.40) node[above] {$f_r$};
\draw[black!50, dashed] (0,1.50) -- (5.00,1.50);
\draw[black!70] (-0.08,1.50) -- (0.08,1.50) node[pos=0, left] {\small $0{,}5$};
\draw[black!70] (-0.08,3.00) -- (0.08,3.00) node[pos=0, left] {\small $1$};
\draw[black!70] (2.50,-0.08) -- (2.50,0.08) node[pos=0, below] {\small $500$};
\draw[black!70] (5.00,-0.08) -- (5.00,0.08) node[pos=0, below] {\small $1000$};
\node[below left] at (0,0) {\small $0$};
\draw[blue!70!black, thick] plot coordinates {(0.005,0.000) (0.010,0.000) (0.015,1.000) (0.020,1.500) (0.025,1.200) (0.030,1.000) (0.035,0.857) (0.040,1.125) (0.045,1.000) (0.050,0.900) (0.055,0.818) (0.060,1.000) (0.065,1.154) (0.070,1.286) (0.075,1.200) (0.080,1.125) (0.085,1.059) (0.090,1.000) (0.095,1.105) (0.100,1.200) (0.105,1.286) (0.110,1.364) (0.115,1.435) (0.120,1.500) (0.125,1.560) (0.130,1.500) (0.135,1.444) (0.140,1.393) (0.145,1.448) (0.150,1.500) (0.155,1.548) (0.160,1.594) (0.165,1.545) (0.170,1.500) (0.175,1.457) (0.180,1.500) (0.185,1.459) (0.190,1.421) (0.195,1.385) (0.200,1.350) (0.205,1.317) (0.210,1.286) (0.215,1.326) (0.220,1.295) (0.225,1.267) (0.230,1.304) (0.235,1.277) (0.240,1.250) (0.245,1.286) (0.250,1.260) (0.300,1.200) (0.350,1.286) (0.400,1.200) (0.450,1.200) (0.500,1.230) (0.550,1.309) (0.600,1.375) (0.650,1.362) (0.700,1.393) (0.750,1.400) (0.800,1.406) (0.850,1.412) (0.900,1.483) (0.950,1.468) (1.000,1.470) (1.050,1.471) (1.100,1.514) (1.150,1.539) (1.200,1.512) (1.250,1.500) (1.300,1.512) (1.350,1.522) (1.400,1.511) (1.450,1.500) (1.500,1.510) (1.550,1.481) (1.600,1.472) (1.650,1.445) (1.700,1.447) (1.750,1.449) (1.800,1.458) (1.850,1.468) (1.900,1.468) (1.950,1.462) (2.000,1.455) (2.050,1.478) (2.100,1.486) (2.150,1.493) (2.200,1.473) (2.250,1.467) (2.300,1.480) (2.350,1.474) (2.400,1.500) (2.450,1.512) (2.500,1.506) (2.550,1.488) (2.600,1.488) (2.650,1.506) (2.700,1.506) (2.750,1.505) (2.800,1.505) (2.850,1.516) (2.900,1.510) (2.950,1.500) (3.000,1.500) (3.050,1.495) (3.100,1.495) (3.150,1.495) (3.200,1.505) (3.250,1.505) (3.300,1.509) (3.350,1.518) (3.400,1.513) (3.450,1.504) (3.500,1.513) (3.550,1.517) (3.600,1.504) (3.650,1.508) (3.700,1.512) (3.750,1.508) (3.800,1.500) (3.850,1.500) (3.900,1.496) (3.950,1.504) (4.000,1.507) (4.050,1.500) (4.100,1.504) (4.150,1.504) (4.200,1.496) (4.250,1.486) (4.300,1.479) (4.350,1.479) (4.400,1.469) (4.450,1.473) (4.500,1.483) (4.550,1.480) (4.600,1.477) (4.650,1.477) (4.700,1.481) (4.750,1.478) (4.800,1.484) (4.850,1.488) (4.900,1.488) (4.950,1.491) (5.000,1.488)};
\end{tikzpicture}
```

Nei primi lanci la frequenza relativa sale e scende molto; poi le oscillazioni diventano piccole e restano vicino a $0{,}5$, la probabilità della definizione classica. È quello che dice la **legge empirica del caso**: ripetendo un esperimento molte volte nelle stesse condizioni, la frequenza relativa di un evento si avvicina alla sua probabilità, e di solito l'approssimazione migliora con il numero delle prove. "Di solito" perché non è garantito a ogni passo: nel grafico, anche dopo qualche centinaio di lanci, ci sono tratti in cui la frequenza si allontana da $0{,}5$ prima di tornarci vicino. La versione matematica precisa di questa legge si chiama legge dei grandi numeri.

```ad-warning
La moneta non ha memoria
Dopo cinque croci di fila, al lancio successivo testa ha ancora probabilità $\dfrac{1}{2}$: la moneta non sa cosa è uscito prima. La legge empirica del caso parla della frequenza su molte prove, non dice che le teste "devono recuperare" nei lanci successivi.
```

## La definizione soggettiva

Ci sono eventi che non si possono ripetere e che non hanno esiti equiprobabili, come "la squadra di casa vince la partita di domenica". Per questi si usa la **definizione soggettiva**: la probabilità di un evento è il prezzo che una persona ritiene giusto pagare per ricevere $1$ euro se l'evento si verifica, e niente se non si verifica. Chi è disposto a pagare $0{,}30$ euro per ricevere $1$ euro se la squadra vince le attribuisce la probabilità $0{,}3$.

Il prezzo deve essere coerente: nessuno pagherebbe più di $1$ euro per riceverne al massimo $1$, quindi anche questa probabilità sta tra $0$ e $1$. Persone diverse, con informazioni diverse, possono dare allo stesso evento probabilità diverse.

| Definizione | Quando si usa | Esempio |
|---|---|---|
| Classica | esiti equiprobabili | la faccia di un dado |
| Frequentista | esperimenti ripetibili | una lampadina difettosa |
| Soggettiva | eventi non ripetibili | il risultato di una partita |
