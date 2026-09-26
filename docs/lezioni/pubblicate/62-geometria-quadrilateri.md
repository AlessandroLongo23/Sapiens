# Parallelogrammi e trapezi

Un foglio di quaderno, lo schermo del telefono, una piastrella a rombo, la sezione di un tetto a due falde tagliata a metà altezza: sono tutti quadrilateri, e ognuno appartiene a una famiglia con proprietà precise. Chi sa che un rettangolo ha le diagonali congruenti, o che gli angoli opposti di un parallelogramma sono congruenti, trova misure di lati e angoli senza misurarle. Le proprietà si dimostrano con i [criteri di congruenza dei triangoli](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza) e con gli angoli formati dalle [rette parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele) tagliate da una trasversale.

## Il quadrilatero

Un **quadrilatero** è un poligono con quattro lati. Si indica con le lettere dei vertici prese in ordine, $ABCD$, e ha quattro lati, $AB$, $BC$, $CD$ e $DA$, e quattro angoli, $\hat{A}$, $\hat{B}$, $\hat{C}$ e $\hat{D}$.

Due lati sono **consecutivi** se hanno un vertice in comune, come $AB$ e $BC$, e **opposti** se non ne hanno, come $AB$ e $CD$. Allo stesso modo $\hat{A}$ e $\hat{C}$ sono angoli opposti, $\hat{A}$ e $\hat{B}$ consecutivi. Una **diagonale** è il segmento che unisce due vertici opposti: un quadrilatero ne ha due, $AC$ e $BD$.

```tikz
% nome: quadrilatero-lati-angoli-diagonali
% alt: Un quadrilatero ABCD con i lati AB, BC, CD, DA e le due diagonali AC e BD tratteggiate
% svg: quadrilatero-lati-angoli-diagonali-16a6be89.svg 216x138
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (4.6,2.2) -- (0.8,2.6) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (4.6,2.2) -- (0.8,2.6) -- cycle;
\draw[dashed] (0,0) -- (4.6,2.2);
\draw[dashed] (4,0) -- (0.8,2.6);
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[right] at (4.6,2.2) {$C$};
\node[above left] at (0.8,2.6) {$D$};
\end{tikzpicture}
```

La diagonale $AC$ divide il quadrilatero in due triangoli, $ABC$ e $ACD$. La somma degli angoli interni di un triangolo è $180^\circ$ (lo dimostra la lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele)), e gli angoli dei due triangoli insieme formano proprio gli angoli del quadrilatero. Quindi in ogni quadrilatero

$$\hat{A} + \hat{B} + \hat{C} + \hat{D} = 360^\circ$$

Se tre angoli misurano $80^\circ$, $95^\circ$ e $110^\circ$, il quarto misura $360^\circ - 285^\circ = 75^\circ$. Tutti i quadrilateri di questa lezione sono convessi: ogni angolo è minore di un angolo piatto e le diagonali stanno dentro la figura.

## Il parallelogramma

Un **parallelogramma** è un quadrilatero con i lati opposti paralleli: in $ABCD$, $AB \parallel DC$ e $AD \parallel BC$.

In un parallelogramma valgono queste proprietà:

1. ogni diagonale lo divide in due triangoli congruenti;
2. i lati opposti sono congruenti;
3. gli angoli opposti sono congruenti;
4. gli angoli consecutivi sono supplementari (la loro somma è $180^\circ$);
5. le diagonali si tagliano scambievolmente a metà: il loro punto di incontro è il punto medio di entrambe.

```tikz
% nome: parallelogramma-proprieta-lati-angoli
% alt: Un parallelogramma ABCD: i lati opposti hanno gli stessi trattini e gli angoli opposti gli stessi archetti, perché sono congruenti
% svg: parallelogramma-proprieta-lati-angoli-b9848264.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[black] (2,0.11) -- (2,-0.11);
\draw[black] (3.2,2.31) -- (3.2,2.09);
\draw[black] (4.48,1.11) -- (4.68,1.01);
\draw[black] (4.52,1.19) -- (4.72,1.09);
\draw[black] (0.48,1.11) -- (0.68,1.01);
\draw[black] (0.52,1.19) -- (0.72,1.09);
\draw[black] (0.42,0) arc[start angle=0, delta angle=61.39, radius=0.42];
\draw[black] (4.78,2.2) arc[start angle=180, delta angle=61.39, radius=0.42];
\draw[black] (4.15,0.28) arc[start angle=61.39, delta angle=118.61, radius=0.32];
\draw[black] (4.19,0.35) arc[start angle=61.39, delta angle=118.61, radius=0.4];
\draw[black] (1.05,1.92) arc[start angle=-118.61, delta angle=118.61, radius=0.32];
\draw[black] (1.01,1.85) arc[start angle=-118.61, delta angle=118.61, radius=0.4];
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```

Nella figura i trattini dicono quali lati sono congruenti: $AB$ e $DC$ hanno un trattino, $AD$ e $BC$ due. Gli archetti fanno lo stesso con gli angoli.

### Dimostrazione delle prime tre proprietà

Ipotesi: $ABCD$ è un quadrilatero con $AB \parallel DC$ e $AD \parallel BC$.

Tesi: $ABC \cong CDA$, quindi $AB \cong DC$, $AD \cong BC$, $\hat{B} \cong \hat{D}$ e $\hat{A} \cong \hat{C}$.

```tikz
% nome: parallelogramma-diagonale-angoli-alterni
% alt: Il parallelogramma ABCD diviso dalla diagonale AC in due triangoli; gli angoli BAC e ACD hanno un archetto, gli angoli CAD e BCA due, perché sono alterni interni
% svg: parallelogramma-diagonale-angoli-alterni-79e99210.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw (0,0) -- (5.2,2.2);
\draw[black] (0.9,0) arc[start angle=0, delta angle=22.93, radius=0.9];
\draw[black] (4.3,2.2) arc[start angle=180, delta angle=22.93, radius=0.9];
\draw[black] (0.46,0.19) arc[start angle=22.93, delta angle=38.46, radius=0.5];
\draw[black] (0.53,0.23) arc[start angle=22.93, delta angle=38.46, radius=0.58];
\draw[black] (4.74,2.01) arc[start angle=-157.07, delta angle=38.46, radius=0.5];
\draw[black] (4.67,1.97) arc[start angle=-157.07, delta angle=38.46, radius=0.58];
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```

1. Traccia la diagonale $AC$ e considera i triangoli $ABC$ e $CDA$. Il lato $AC$ è in comune.
2. $\widehat{BAC} \cong \widehat{DCA}$, perché sono angoli alterni interni formati dalle parallele $AB$ e $DC$ con la trasversale $AC$.
3. $\widehat{BCA} \cong \widehat{DAC}$, perché sono angoli alterni interni formati dalle parallele $AD$ e $BC$ con la stessa trasversale.
4. Per il secondo criterio di congruenza (un lato e i due angoli adiacenti), $ABC \cong CDA$.
5. In triangoli congruenti, ad angoli congruenti stanno opposti lati congruenti: $AB$ è opposto a $\widehat{BCA}$ e $DC$ a $\widehat{DAC}$, quindi $AB \cong DC$; allo stesso modo $BC \cong AD$. Gli angoli $\hat{B}$ e $\hat{D}$ sono gli angoli rimasti dei due triangoli, quindi $\hat{B} \cong \hat{D}$.
6. $\hat{A}$ è la somma di $\widehat{BAC}$ e $\widehat{DAC}$, $\hat{C}$ è la somma di $\widehat{DCA}$ e $\widehat{BCA}$: sono somme di angoli congruenti (passi 2 e 3), quindi $\hat{A} \cong \hat{C}$.

La proprietà 4 viene dalle parallele: $\hat{A}$ e $\hat{B}$ sono angoli coniugati interni formati dalle parallele $AD$ e $BC$ con la trasversale $AB$, quindi sono supplementari. Lo stesso vale per ogni coppia di angoli consecutivi.

### Le diagonali si tagliano a metà

Chiama $M$ il punto in cui si incontrano le diagonali $AC$ e $BD$.

```tikz
% nome: parallelogramma-diagonali-punto-medio
% alt: Le diagonali del parallelogramma ABCD si incontrano nel punto M, che divide ciascuna in due parti congruenti
% svg: parallelogramma-diagonali-punto-medio-11edbae6.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw (0,0) -- (5.2,2.2);
\draw (4,0) -- (1.2,2.2);
\draw[black] (1.26,0.65) -- (1.34,0.45);
\draw[black] (3.86,1.75) -- (3.94,1.55);
\draw[black] (3.27,0.44) -- (3.4,0.61);
\draw[black] (3.2,0.49) -- (3.33,0.66);
\draw[black] (1.87,1.54) -- (2,1.71);
\draw[black] (1.8,1.59) -- (1.93,1.76);
\fill (2.6,1.1) circle (0.05);
\node[below=2pt] at (2.6,1.1) {$M$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```

Per dimostrarlo si confrontano i triangoli $ABM$ e $CDM$. Hanno $AB \cong DC$, per la proprietà 2. Hanno $\widehat{MAB} \cong \widehat{MCD}$, alterni interni delle parallele $AB$ e $DC$ con la trasversale $AC$, e $\widehat{MBA} \cong \widehat{MDC}$, alterni interni delle stesse parallele con la trasversale $BD$. Per il secondo criterio i due triangoli sono congruenti, e quindi $AM \cong MC$ e $BM \cong MD$.

```tikz
% nome: parallelogramma-diagonali-dimostrazione
% alt: Il parallelogramma ABCD con le diagonali che si incontrano in M; i triangoli ABM e CDM hanno i lati AB e CD congruenti e gli angoli adiacenti congruenti
% svg: parallelogramma-diagonali-dimostrazione-6ebb3340.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw (0,0) -- (5.2,2.2);
\draw (4,0) -- (1.2,2.2);
\draw[black] (0.9,0) arc[start angle=0, delta angle=22.93, radius=0.9];
\draw[black] (4.3,2.2) arc[start angle=180, delta angle=22.93, radius=0.9];
\draw[black] (3.53,0.37) arc[start angle=141.84, delta angle=38.16, radius=0.6];
\draw[black] (3.47,0.42) arc[start angle=141.84, delta angle=38.16, radius=0.68];
\draw[black] (1.67,1.83) arc[start angle=-38.16, delta angle=38.16, radius=0.6];
\draw[black] (1.73,1.78) arc[start angle=-38.16, delta angle=38.16, radius=0.68];
\draw[black] (2,0.11) -- (2,-0.11);
\draw[black] (3.2,2.31) -- (3.2,2.09);
\fill (2.6,1.1) circle (0.05);
\node[below=2pt] at (2.6,1.1) {$M$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```

```ad-example
Esempio 1: angoli e lati di un parallelogramma
Nel parallelogramma $ABCD$ l'angolo $\hat{A}$ misura $70^\circ$, il lato $AB$ misura $8$ cm e il lato $BC$ misura $5$ cm. Trova gli altri angoli e il perimetro.

L'angolo opposto ad $\hat{A}$ è congruente: $\hat{C} = 70^\circ$. Gli angoli consecutivi sono supplementari: $\hat{B} = 180^\circ - 70^\circ = 110^\circ$, e $\hat{D} = \hat{B} = 110^\circ$. Controllo: $70^\circ + 110^\circ + 70^\circ + 110^\circ = 360^\circ$.

I lati opposti sono congruenti: $CD = 8$ cm e $DA = 5$ cm. Il perimetro è $2 \cdot (8 + 5) = 26$ cm.

```tikz
% nome: parallelogramma-esempio-angoli
% alt: Il parallelogramma ABCD con l'angolo in A di 70 gradi; gli angoli A e C hanno un archetto, gli angoli B e D due
% svg: parallelogramma-esempio-angoli-7f7c2d26.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[black] (0.42,0) arc[start angle=0, delta angle=61.39, radius=0.42];
\draw[black] (4.78,2.2) arc[start angle=180, delta angle=61.39, radius=0.42];
\draw[black] (4.15,0.28) arc[start angle=61.39, delta angle=118.61, radius=0.32];
\draw[black] (4.19,0.35) arc[start angle=61.39, delta angle=118.61, radius=0.4];
\draw[black] (1.05,1.92) arc[start angle=-118.61, delta angle=118.61, radius=0.32];
\draw[black] (1.01,1.85) arc[start angle=-118.61, delta angle=118.61, radius=0.4];
\node at (0.72,0.36) {\small $70^\circ$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```
```

```ad-warning
Le diagonali del parallelogramma non sono congruenti
Le diagonali di un parallelogramma si tagliano a metà, ma di solito hanno lunghezze diverse e non sono perpendicolari: nella figura delle diagonali $AC$ è molto più lunga di $BD$. Diagonali congruenti ce le ha il rettangolo, diagonali perpendicolari il rombo.
```

## Quando un quadrilatero è un parallelogramma

Le proprietà del parallelogramma si possono leggere anche al contrario, e diventano criteri per riconoscerlo. Un quadrilatero è un parallelogramma se vale anche una sola di queste condizioni:

1. i lati opposti sono congruenti a due a due;
2. gli angoli opposti sono congruenti a due a due;
3. le diagonali si tagliano scambievolmente a metà;
4. due lati opposti sono paralleli e congruenti.

Ognuna si dimostra con i criteri di congruenza. Ecco la dimostrazione della terza.

Ipotesi: le diagonali $AC$ e $BD$ del quadrilatero $ABCD$ si incontrano in $M$, con $AM \cong MC$ e $BM \cong MD$.

Tesi: $AB \parallel DC$ e $AD \parallel BC$.

```tikz
% nome: parallelogramma-diagonali-lal
% alt: Un quadrilatero ABCD con le diagonali che si tagliano a metà nel punto M; gli angoli AMB e CMD, opposti al vertice, hanno un archetto
% svg: parallelogramma-diagonali-lal-2e0702d6.svg 239x123
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw (0,0) -- (5.2,2.2);
\draw (4,0) -- (1.2,2.2);
\draw[black] (1.26,0.65) -- (1.34,0.45);
\draw[black] (3.86,1.75) -- (3.94,1.55);
\draw[black] (3.27,0.44) -- (3.4,0.61);
\draw[black] (3.2,0.49) -- (3.33,0.66);
\draw[black] (1.87,1.54) -- (2,1.71);
\draw[black] (1.8,1.59) -- (1.93,1.76);
\draw[black] (2.32,0.98) arc[start angle=-157.07, delta angle=118.91, radius=0.3];
\draw[black] (2.88,1.22) arc[start angle=22.93, delta angle=118.91, radius=0.3];
\fill (2.6,1.1) circle (0.05);
\node at (2.15,1.18) {$M$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\end{tikzpicture}
```

1. Nei triangoli $AMB$ e $CMD$ si ha $AM \cong MC$ e $BM \cong MD$ per ipotesi.
2. $\widehat{AMB} \cong \widehat{CMD}$, perché sono angoli opposti al vertice.
3. Per il primo criterio di congruenza (due lati e l'angolo compreso), $AMB \cong CMD$; in particolare $\widehat{MAB} \cong \widehat{MCD}$.
4. $\widehat{MAB}$ e $\widehat{MCD}$ sono angoli alterni interni formati dalle rette $AB$ e $DC$ con la trasversale $AC$. Sono congruenti, quindi per il criterio di parallelismo $AB \parallel DC$.
5. Con gli stessi passaggi sui triangoli $AMD$ e $CMB$ si ottiene $AD \parallel BC$.

```ad-warning
Due lati paralleli non bastano
Un quadrilatero con una coppia di lati opposti paralleli può essere un trapezio. Per essere sicuro che sia un parallelogramma servono entrambe le coppie di lati paralleli, oppure una coppia di lati opposti che siano paralleli e anche congruenti (condizione 4).
```

```ad-example
Esempio 2: una dimostrazione con i punti medi
Nel parallelogramma $ABCD$ il punto $M$ è il punto medio di $AB$ e $N$ è il punto medio di $DC$. Dimostra che $AMCN$ è un parallelogramma.

Ipotesi: $ABCD$ è un parallelogramma, $AM \cong MB$, $DN \cong NC$.

Tesi: $AMCN$ è un parallelogramma.

```tikz
% nome: parallelogramma-punti-medi-esempio
% alt: Il parallelogramma ABCD con i punti medi M di AB e N di CD; il quadrilatero AMCN è colorato
% svg: parallelogramma-punti-medi-esempio-8a03f6ea.svg 239x123
\begin{tikzpicture}
\fill[blue!12] (0,0) -- (2,0) -- (5.2,2.2) -- (3.2,2.2) -- cycle;
\draw[thick] (0,0) -- (4,0) -- (5.2,2.2) -- (1.2,2.2) -- cycle;
\draw (2,0) -- (5.2,2.2);
\draw (0,0) -- (3.2,2.2);
\draw[black] (1,0.11) -- (1,-0.11);
\draw[black] (3,0.11) -- (3,-0.11);
\draw[black] (2.2,2.31) -- (2.2,2.09);
\draw[black] (4.2,2.31) -- (4.2,2.09);
\fill (2,0) circle (0.05);
\fill (3.2,2.2) circle (0.05);
\node[below left] at (0,0) {$A$};
\node[below right] at (4,0) {$B$};
\node[above right] at (5.2,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\node[below] at (2,0) {$M$};
\node[above] at (3.2,2.2) {$N$};
\end{tikzpicture}
```

1. $AB \cong DC$, perché sono lati opposti di un parallelogramma.
2. $AM$ è metà di $AB$ e $NC$ è metà di $DC$: metà di segmenti congruenti sono congruenti, quindi $AM \cong NC$.
3. $AM$ sta sulla retta $AB$ e $NC$ sulla retta $DC$, che sono parallele: quindi $AM \parallel NC$.
4. Nel quadrilatero $AMCN$ i lati opposti $AM$ e $NC$ sono paralleli e congruenti: per la condizione 4, $AMCN$ è un parallelogramma.
```

## Il rettangolo

Un **rettangolo** è un quadrilatero con i quattro angoli retti. Gli angoli opposti sono congruenti, quindi per la condizione 2 il rettangolo è un parallelogramma, e ha tutte le sue proprietà. In più, le diagonali del rettangolo sono congruenti.

```tikz
% nome: rettangolo-diagonali-congruenti
% alt: Un rettangolo ABCD con i quattro angoli retti e le diagonali che si incontrano in M; le quattro metà delle diagonali sono congruenti
% svg: rettangolo-diagonali-congruenti-e3e66a78.svg 210x130
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.4,0) -- (4.4,2.4) -- (0,2.4) -- cycle;
\draw[thick] (0,0) -- (4.4,0) -- (4.4,2.4) -- (0,2.4) -- cycle;
\draw (0,0) -- (4.4,2.4);
\draw (4.4,0) -- (0,2.4);
\draw (0.25,0) -- (0.25,0.25) -- (0,0.25);
\draw (4.4,0.25) -- (4.15,0.25) -- (4.15,0);
\draw (4.15,2.4) -- (4.15,2.15) -- (4.4,2.15);
\draw (0,2.15) -- (0.25,2.15) -- (0.25,2.4);
\draw[black] (1.05,0.7) -- (1.15,0.5);
\draw[black] (3.25,1.9) -- (3.35,1.7);
\draw[black] (3.25,0.5) -- (3.35,0.7);
\draw[black] (1.05,1.7) -- (1.15,1.9);
\fill (2.2,1.2) circle (0.05);
\node[below=3pt] at (2.2,1.2) {$M$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4.4,0) {$B$};
\node[above right] at (4.4,2.4) {$C$};
\node[above left] at (0,2.4) {$D$};
\end{tikzpicture}
```

Per dimostrarlo si confrontano i triangoli $ABC$ e $BAD$: il lato $AB$ è in comune, $BC \cong AD$ perché sono lati opposti di un parallelogramma, e $\widehat{ABC} \cong \widehat{BAD}$ perché sono entrambi retti. Per il primo criterio i triangoli sono congruenti, quindi $AC \cong BD$.

Le diagonali si tagliano a metà e sono congruenti, quindi le loro quattro metà sono tutte congruenti: $AM \cong BM \cong CM \cong DM$. Vale anche il contrario: un parallelogramma con le diagonali congruenti è un rettangolo.

```ad-example
Esempio 3: le diagonali di un rettangolo
Nel rettangolo $ABCD$ le diagonali si incontrano in $M$, la diagonale $AC$ misura $10$ cm e l'angolo $\widehat{AMB}$ misura $120^\circ$. Trova $BD$, gli angoli $\widehat{MAB}$ e $\widehat{MAD}$ e il lato $AD$.

Le diagonali sono congruenti: $BD = 10$ cm. Le quattro metà misurano $10 : 2 = 5$ cm.

Il triangolo $AMB$ ha $AM \cong BM$, quindi è isoscele sulla base $AB$ e gli angoli alla base sono congruenti:

$$\widehat{MAB} = \frac{180^\circ - 120^\circ}{2} = 30^\circ$$

L'angolo $\hat{A}$ è retto, quindi $\widehat{MAD} = 90^\circ - 30^\circ = 60^\circ$.

Nel triangolo $AMD$ anche $AM \cong DM$, e $\widehat{AMD} = 180^\circ - 120^\circ = 60^\circ$, perché è adiacente ad $\widehat{AMB}$. Gli angoli alla base misurano $(180^\circ - 60^\circ) : 2 = 60^\circ$: il triangolo ha tre angoli di $60^\circ$ ed è equilatero. Quindi $AD = AM = 5$ cm.

```tikz
% nome: rettangolo-esempio-diagonali
% alt: Il rettangolo ABCD con le diagonali che si incontrano in M; l'angolo AMB misura 120 gradi
% svg: rettangolo-esempio-diagonali-5cfd1753.svg 207x134
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (4.33,0) -- (4.33,2.5) -- (0,2.5) -- cycle;
\draw[thick] (0,0) -- (4.33,0) -- (4.33,2.5) -- (0,2.5) -- cycle;
\draw (0,0) -- (4.33,2.5);
\draw (4.33,0) -- (0,2.5);
\draw (0.25,0) -- (0.25,0.25) -- (0,0.25);
\draw (4.33,0.25) -- (4.08,0.25) -- (4.08,0);
\draw (4.08,2.5) -- (4.08,2.25) -- (4.33,2.25);
\draw (0,2.25) -- (0.25,2.25) -- (0.25,2.5);
\draw[black] (1.86,1.07) arc[start angle=-150, delta angle=120, radius=0.35];
\node at (2.17,0.63) {\scriptsize $120^\circ$};
\fill (2.17,1.25) circle (0.05);
\node[above=3pt] at (2.17,1.25) {$M$};
\node[below left] at (0,0) {$A$};
\node[below right] at (4.33,0) {$B$};
\node[above right] at (4.33,2.5) {$C$};
\node[above left] at (0,2.5) {$D$};
\end{tikzpicture}
```
```

## Il rombo

Un **rombo** è un quadrilatero con i quattro lati congruenti. I lati opposti sono congruenti, quindi per la condizione 1 il rombo è un parallelogramma. In più, le diagonali del rombo sono perpendicolari e ognuna è bisettrice degli angoli che unisce: la diagonale $AC$ divide a metà $\hat{A}$ e $\hat{C}$, la diagonale $BD$ divide a metà $\hat{B}$ e $\hat{D}$.

```tikz
% nome: rombo-diagonali-perpendicolari
% alt: Un rombo ABCD con i quattro lati congruenti; le diagonali AC e BD sono perpendicolari in M, e AC divide a metà gli angoli in A e in C
% svg: rombo-diagonali-perpendicolari-bfd220fe.svg 239x131
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.6,-1.21) -- (5.2,0) -- (2.6,1.21) -- cycle;
\draw[thick] (0,0) -- (2.6,-1.21) -- (5.2,0) -- (2.6,1.21) -- cycle;
\draw (0,0) -- (5.2,0);
\draw (2.6,-1.21) -- (2.6,1.21);
\draw[black] (1.35,-0.51) -- (1.25,-0.7);
\draw[black] (3.85,-0.51) -- (3.95,-0.7);
\draw[black] (3.85,0.51) -- (3.95,0.7);
\draw[black] (1.35,0.51) -- (1.25,0.7);
\draw (2.82,0) -- (2.82,0.22) -- (2.6,0.22);
\draw[black] (0.63,-0.3) arc[start angle=-24.96, delta angle=24.96, radius=0.7];
\draw[black] (0.7,0) arc[start angle=0, delta angle=24.96, radius=0.7];
\draw[black] (4.5,0) arc[start angle=180, delta angle=24.96, radius=0.7];
\draw[black] (4.57,0.3) arc[start angle=155.04, delta angle=24.96, radius=0.7];
\node[left] at (0,0) {$A$};
\node[below] at (2.6,-1.21) {$B$};
\node[right] at (5.2,0) {$C$};
\node[above] at (2.6,1.21) {$D$};
\node[below right] at (2.6,0) {$M$};
\end{tikzpicture}
```

Per dimostrarlo si confrontano i triangoli $AMB$ e $AMD$: $AB \cong AD$ perché i lati del rombo sono congruenti, $BM \cong MD$ perché le diagonali si tagliano a metà, e $AM$ è in comune. Per il terzo criterio (tre lati) i triangoli sono congruenti. Quindi $\widehat{BAM} \cong \widehat{DAM}$, cioè $AC$ è bisettrice di $\hat{A}$, e $\widehat{AMB} \cong \widehat{AMD}$. Questi ultimi due angoli sono adiacenti, e la loro somma è un angolo piatto: essendo congruenti, misurano $90^\circ$ ciascuno, quindi $AC \perp BD$.

Vale anche il contrario: un parallelogramma con le diagonali perpendicolari è un rombo.

```ad-warning
Diagonali perpendicolari non vuol dire rombo
Il contrario vale solo per i parallelogrammi. Un quadrilatero a forma di aquilone ha le diagonali perpendicolari, ma una sola delle due è tagliata a metà: non è un parallelogramma e non è un rombo. Prima di usare le diagonali perpendicolari, controlla che le diagonali si taglino a metà.
```

```ad-example
Esempio 4: gli angoli di un rombo
Nel rombo $ABCD$ l'angolo $\hat{A}$ misura $50^\circ$ e le diagonali si incontrano in $M$. Trova gli angoli del rombo e gli angoli del triangolo $ABM$.

Il rombo è un parallelogramma: $\hat{C} = 50^\circ$ e $\hat{B} = \hat{D} = 180^\circ - 50^\circ = 130^\circ$.

Le diagonali sono bisettrici: $\widehat{BAM} = 50^\circ : 2 = 25^\circ$ e $\widehat{ABM} = 130^\circ : 2 = 65^\circ$. Le diagonali sono perpendicolari: $\widehat{AMB} = 90^\circ$. Controllo: $25^\circ + 65^\circ + 90^\circ = 180^\circ$.

```tikz
% nome: rombo-esempio-angoli
% alt: Il rombo ABCD con l'angolo in A di 50 gradi e le diagonali perpendicolari nel punto M
% svg: rombo-esempio-angoli-ff14a3d5.svg 239x131
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.6,-1.21) -- (5.2,0) -- (2.6,1.21) -- cycle;
\draw[thick] (0,0) -- (2.6,-1.21) -- (5.2,0) -- (2.6,1.21) -- cycle;
\draw (0,0) -- (5.2,0);
\draw (2.6,-1.21) -- (2.6,1.21);
\draw[black] (1.35,-0.51) -- (1.25,-0.7);
\draw[black] (3.85,-0.51) -- (3.95,-0.7);
\draw[black] (3.85,0.51) -- (3.95,0.7);
\draw[black] (1.35,0.51) -- (1.25,0.7);
\draw (2.82,0) -- (2.82,0.22) -- (2.6,0.22);
\draw[black] (0.5,-0.23) arc[start angle=-24.96, delta angle=49.91, radius=0.55];
\node at (1.1,0.2) {\scriptsize $50^\circ$};
\node[left] at (0,0) {$A$};
\node[below] at (2.6,-1.21) {$B$};
\node[right] at (5.2,0) {$C$};
\node[above] at (2.6,1.21) {$D$};
\node[below right] at (2.6,0) {$M$};
\end{tikzpicture}
```
```

## Il quadrato

Un **quadrato** è un quadrilatero con i quattro lati congruenti e i quattro angoli retti. Ha gli angoli retti, quindi è un rettangolo; ha i lati congruenti, quindi è un rombo. Per questo ha le proprietà di entrambi: le diagonali sono congruenti, perpendicolari, si tagliano a metà e sono bisettrici degli angoli. Ogni diagonale divide un angolo retto in due angoli di $45^\circ$.

```tikz
% nome: quadrato-diagonali
% alt: Un quadrato ABCD con le diagonali perpendicolari nel punto M; la diagonale AC divide l'angolo retto in A in due angoli di 45 gradi
% svg: quadrato-diagonali-c50c0508.svg 149x145
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (2.8,0) -- (2.8,2.8) -- (0,2.8) -- cycle;
\draw[thick] (0,0) -- (2.8,0) -- (2.8,2.8) -- (0,2.8) -- cycle;
\draw (0,0) -- (2.8,2.8);
\draw (2.8,0) -- (0,2.8);
\draw[black] (1.4,0.11) -- (1.4,-0.11);
\draw[black] (2.69,1.4) -- (2.91,1.4);
\draw[black] (1.4,2.69) -- (1.4,2.91);
\draw[black] (0.11,1.4) -- (-0.11,1.4);
\draw (1.56,1.24) -- (1.71,1.4) -- (1.56,1.56);
\draw (2.8,0.25) -- (2.55,0.25) -- (2.55,0);
\draw (2.55,2.8) -- (2.55,2.55) -- (2.8,2.55);
\draw (0,2.55) -- (0.25,2.55) -- (0.25,2.8);
\draw[black] (0.55,0) arc[start angle=0, delta angle=45, radius=0.55];
\draw[black] (0.44,0.44) arc[start angle=45, delta angle=45, radius=0.62];
\node at (0.95,0.36) {\scriptsize $45^\circ$};
\node at (0.36,0.95) {\scriptsize $45^\circ$};
\node[below left] at (0,0) {$A$};
\node[below right] at (2.8,0) {$B$};
\node[above right] at (2.8,2.8) {$C$};
\node[above left] at (0,2.8) {$D$};
\node[below=4pt] at (1.4,1.4) {$M$};
\end{tikzpicture}
```

La tabella mette a confronto le diagonali delle quattro figure.

| Figura | Diagonali |
|---|---|
| parallelogramma | si tagliano a metà |
| rettangolo | si tagliano a metà, congruenti |
| rombo | si tagliano a metà, perpendicolari, bisettrici degli angoli |
| quadrato | si tagliano a metà, congruenti, perpendicolari, bisettrici degli angoli |

## Il trapezio

Un **trapezio** è un quadrilatero con due soli lati opposti paralleli. I lati paralleli sono le **basi** (la base maggiore e la base minore), gli altri due sono i **lati obliqui**. L'**altezza** è la distanza tra le due basi: un segmento perpendicolare alle basi con gli estremi su di esse, come $DH$ nella figura.

```tikz
% nome: trapezio-basi-lati-obliqui-altezza
% alt: Un trapezio ABCD con la base maggiore AB, la base minore DC, i lati obliqui AD e BC e l'altezza DH perpendicolare alle basi
% svg: trapezio-basi-lati-obliqui-altezza-4cd577dc.svg 247x124
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (5.4,0) -- (3.8,2.2) -- (1.2,2.2) -- cycle;
\draw[thick] (0,0) -- (5.4,0) -- (3.8,2.2) -- (1.2,2.2) -- cycle;
\draw[dashed] (1.2,2.2) -- (1.2,0);
\draw (1.42,0) -- (1.42,0.22) -- (1.2,0.22);
\node[below left] at (0,0) {$A$};
\node[below right] at (5.4,0) {$B$};
\node[above right] at (3.8,2.2) {$C$};
\node[above left] at (1.2,2.2) {$D$};
\node[below] at (1.2,0) {$H$};
\node[below] at (3.3,0) {\small base maggiore};
\node[above] at (2.5,2.2) {\small base minore};
\node[right] at (1.2,1.0) {\small altezza};
\end{tikzpicture}
```

Le basi sono parallele, quindi gli angoli adiacenti a un lato obliquo sono coniugati interni e sono supplementari: $\hat{A} + \hat{D} = 180^\circ$ e $\hat{B} + \hat{C} = 180^\circ$.

Un trapezio è:

- **isoscele** se i lati obliqui sono congruenti;
- **rettangolo** se un lato obliquo è perpendicolare alle basi: gli angoli adiacenti a quel lato sono retti, e quel lato è anche l'altezza;
- **scaleno** se i lati obliqui non sono congruenti.

```tikz
% nome: trapezio-isoscele-rettangolo-scaleno
% alt: Tre trapezi affiancati: isoscele, con i lati obliqui congruenti; rettangolo, con un lato obliquo perpendicolare alle basi; scaleno, con i lati obliqui diversi
% svg: trapezio-isoscele-rettangolo-scaleno-5f8d3919.svg 253x67
\begin{tikzpicture}[scale=0.82]
\fill[blue!8] (0,0) -- (2.4,0) -- (1.9,1.4) -- (0.5,1.4) -- cycle;
\fill[blue!8] (2.9,0) -- (5.1,0) -- (4.2,1.4) -- (2.9,1.4) -- cycle;
\fill[blue!8] (5.6,0) -- (8,0) -- (7.8,1.4) -- (6.6,1.4) -- cycle;
\draw[thick] (0,0) -- (2.4,0) -- (1.9,1.4) -- (0.5,1.4) -- cycle;
\draw[thick] (2.9,0) -- (5.1,0) -- (4.2,1.4) -- (2.9,1.4) -- cycle;
\draw[thick] (5.6,0) -- (8,0) -- (7.8,1.4) -- (6.6,1.4) -- cycle;
\draw[black] (0.15,0.74) -- (0.35,0.66);
\draw[black] (2.05,0.66) -- (2.25,0.74);
\draw (3.1,0) -- (3.1,0.2) -- (2.9,0.2);
\draw (2.9,1.2) -- (3.1,1.2) -- (3.1,1.4);
\node[below] at (1.2,0) {\small isoscele};
\node[below] at (4.0,0) {\small rettangolo};
\node[below] at (6.8,0) {\small scaleno};
\end{tikzpicture}
```

Anche il trapezio rettangolo ha i lati obliqui diversi, perché il lato perpendicolare è la distanza tra le basi e l'altro è più lungo; di solito però si chiama rettangolo e non scaleno. In un trapezio rettangolo con un angolo acuto di $55^\circ$, l'angolo ottuso adiacente allo stesso lato obliquo misura $180^\circ - 55^\circ = 125^\circ$, e gli altri due sono retti.

```ad-note
Se il parallelogramma è un trapezio
Questa lezione chiama trapezio un quadrilatero con due soli lati paralleli, come la maggior parte dei libri: così un parallelogramma non è un trapezio. Alcuni libri dicono invece "almeno due lati paralleli", e allora ogni parallelogramma è un trapezio particolare. Controlla quale definizione usa il tuo libro.
```

## Il trapezio isoscele

In un trapezio isoscele valgono queste proprietà:

1. gli angoli adiacenti a ciascuna base sono congruenti;
2. gli angoli opposti sono supplementari;
3. le diagonali sono congruenti.

### Dimostrazione della prima proprietà

Ipotesi: $ABCD$ è un trapezio con le basi $AB$ (la maggiore) e $DC$, e $AD \cong BC$.

Tesi: $\widehat{DAB} \cong \widehat{ABC}$.

```tikz
% nome: trapezio-isoscele-angoli-alla-base
% alt: Il trapezio isoscele ABCD con il segmento CE parallelo ad AD; i segmenti AD, BC e CE sono congruenti e gli angoli in A, in E e in B hanno un archetto
% svg: trapezio-isoscele-angoli-alla-base-1238708a.svg 231x115
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (5,0) -- (3.8,2) -- (1.2,2) -- cycle;
\draw[thick] (0,0) -- (5,0) -- (3.8,2) -- (1.2,2) -- cycle;
\draw[dashed] (2.6,0) -- (3.8,2);
\draw[black] (0.51,1.06) -- (0.69,0.94);
\draw[black] (4.31,0.94) -- (4.49,1.06);
\draw[black] (3.11,1.06) -- (3.29,0.94);
\draw[black] (0.45,0) arc[start angle=0, delta angle=59.04, radius=0.45];
\draw[black] (3.05,0) arc[start angle=0, delta angle=59.04, radius=0.45];
\draw[black] (4.77,0.39) arc[start angle=120.96, delta angle=59.04, radius=0.45];
\node[below left] at (0,0) {$A$};
\node[below right] at (5,0) {$B$};
\node[above right] at (3.8,2) {$C$};
\node[above left] at (1.2,2) {$D$};
\node[below] at (2.6,0) {$E$};
\end{tikzpicture}
```

1. Da $C$ traccia la parallela ad $AD$, che incontra la base $AB$ in un punto $E$.
2. Il quadrilatero $AECD$ ha $AE \parallel DC$ (stanno sulle basi) e $AD \parallel EC$ (per costruzione): è un parallelogramma, quindi $EC \cong AD$.
3. Per ipotesi $AD \cong BC$, quindi $EC \cong BC$: il triangolo $EBC$ è isoscele sulla base $EB$, e gli angoli alla base sono congruenti, $\widehat{CEB} \cong \widehat{CBE}$.
4. $\widehat{CEB} \cong \widehat{DAB}$, perché sono angoli corrispondenti formati dalle parallele $AD$ e $EC$ con la trasversale $AB$.
5. Dai passi 3 e 4, $\widehat{DAB} \cong \widehat{CBE}$, e $\widehat{CBE}$ è proprio l'angolo $\widehat{ABC}$ del trapezio.

Gli angoli adiacenti alla base minore sono congruenti anche loro, perché $\hat{D}$ e $\hat{C}$ sono i supplementari di due angoli congruenti. Da qui viene la proprietà 2: $\hat{A} + \hat{C} = \hat{A} + \hat{D} = 180^\circ$.

Per le diagonali si confrontano i triangoli $ABC$ e $BAD$: il lato $AB$ è in comune, $BC \cong AD$ per ipotesi, $\widehat{ABC} \cong \widehat{BAD}$ per la proprietà 1. Per il primo criterio i triangoli sono congruenti, quindi $AC \cong BD$.

```tikz
% nome: trapezio-isoscele-diagonali
% alt: Il trapezio isoscele ABCD con le diagonali AC e BD, che hanno gli stessi trattini perché sono congruenti; gli angoli alla base maggiore hanno un archetto
% svg: trapezio-isoscele-diagonali-8577c7cf.svg 231x115
\begin{tikzpicture}
\fill[blue!8] (0,0) -- (5,0) -- (3.8,2) -- (1.2,2) -- cycle;
\draw[thick] (0,0) -- (5,0) -- (3.8,2) -- (1.2,2) -- cycle;
\draw (0,0) -- (3.8,2);
\draw (5,0) -- (1.2,2);
\draw[black] (0.51,1.06) -- (0.69,0.94);
\draw[black] (4.31,0.94) -- (4.49,1.06);
\draw[black] (1.05,0.68) -- (1.15,0.48);
\draw[black] (1.13,0.72) -- (1.23,0.52);
\draw[black] (3.85,0.48) -- (3.95,0.68);
\draw[black] (3.77,0.52) -- (3.87,0.72);
\draw[black] (0.45,0) arc[start angle=0, delta angle=59.04, radius=0.45];
\draw[black] (4.77,0.39) arc[start angle=120.96, delta angle=59.04, radius=0.45];
\node[below left] at (0,0) {$A$};
\node[below right] at (5,0) {$B$};
\node[above right] at (3.8,2) {$C$};
\node[above left] at (1.2,2) {$D$};
\end{tikzpicture}
```

```ad-warning
Le diagonali del trapezio isoscele non si tagliano a metà
Sono congruenti, come quelle del rettangolo, ma il punto in cui si incontrano non è il punto medio di nessuna delle due: è più vicino alla base minore. Tagliarsi a metà è una proprietà dei parallelogrammi, e un trapezio non lo è.
```

```ad-example
Esempio 5: angoli di un trapezio isoscele con un'equazione
Nel trapezio isoscele $ABCD$, con le basi $AB$ e $DC$, l'angolo $\hat{A}$ misura $x + 20^\circ$ e l'angolo $\hat{D}$ misura $3x$. Trova i quattro angoli.

$\hat{A}$ e $\hat{D}$ sono adiacenti al lato obliquo $AD$, quindi sono supplementari. L'equazione, che si risolve come nella lezione sulle [equazioni di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere), è

$$
\begin{gathered}
x + 20^\circ + 3x = 180^\circ \\
4x = 160^\circ \\
x = 40^\circ
\end{gathered}
$$

Quindi $\hat{A} = 40^\circ + 20^\circ = 60^\circ$ e $\hat{D} = 3 \cdot 40^\circ = 120^\circ$. Il trapezio è isoscele: $\hat{B} = \hat{A} = 60^\circ$ e $\hat{C} = \hat{D} = 120^\circ$. Controllo: $60^\circ + 60^\circ + 120^\circ + 120^\circ = 360^\circ$.
```

## Le famiglie di quadrilateri

Le definizioni mettono le famiglie una dentro l'altra. Ogni quadrato è sia un rettangolo sia un rombo, e i quadrati sono proprio i rettangoli che sono anche rombi. Ogni rettangolo e ogni rombo è un parallelogramma. I trapezi hanno due soli lati paralleli, quindi non sono parallelogrammi; tra i trapezi ci sono gli isosceli e i rettangoli. Restano fuori da entrambe le famiglie i quadrilateri senza lati paralleli, come l'aquilone.

```tikz
% nome: quadrilateri-schema-inclusioni
% alt: Schema a insiemi dei quadrilateri: dentro i quadrilateri ci sono i trapezi, con isosceli e rettangoli, e i parallelogrammi; dentro i parallelogrammi i rettangoli e i rombi, che si sovrappongono nei quadrati
% svg: quadrilateri-schema-inclusioni-df07d61a.svg 270x186
\begin{tikzpicture}[scale=0.96]
\draw[thick, rounded corners=6pt] (0,0) rectangle (7.3,5);
\node[below right] at (0,5) {\small Quadrilateri};
\fill[orange!15] (1.3,2.2) ellipse (1.1 and 1.75);
\draw (1.3,2.2) ellipse (1.1 and 1.75);
\node at (1.3,3.55) {\small Trapezi};
\draw (1.3,2.65) ellipse (0.85 and 0.42);
\node at (1.3,2.65) {\scriptsize isosceli};
\draw (1.3,1.45) ellipse (0.85 and 0.42);
\node at (1.3,1.45) {\scriptsize rettangoli};
\fill[blue!10, rounded corners=10pt] (2.55,0.3) rectangle (7.1,4.3);
\draw[rounded corners=10pt] (2.55,0.3) rectangle (7.1,4.3);
\node at (4.83,3.75) {\small Parallelogrammi};
\draw (4.15,1.95) ellipse (1.4 and 1.0);
\draw (5.51,1.95) ellipse (1.4 and 1.0);
\node at (3.5,1.95) {\scriptsize Rettangoli};
\node at (6.25,1.95) {\scriptsize Rombi};
\node at (4.83,1.95) {\scriptsize Quadrati};
\end{tikzpicture}
```

Le proprietà si ereditano dall'alto verso il basso: tutto quello che vale per i parallelogrammi vale per rettangoli, rombi e quadrati, e tutto quello che vale per i rettangoli o per i rombi vale per i quadrati. Per riconoscere una figura dalle diagonali si procede nello stesso ordine: se le diagonali di un quadrilatero si tagliano a metà è un parallelogramma; se sono anche congruenti è un rettangolo, se sono anche perpendicolari è un rombo, se sono congruenti e perpendicolari è un quadrato.

```ad-warning
Il quadrato è un rettangolo
"Un quadrato non è un rettangolo, perché ha i lati uguali" è sbagliato: il rettangolo chiede solo i quattro angoli retti, e il quadrato li ha. Allo stesso modo il quadrato è un rombo e il rettangolo è un parallelogramma. Il contrario non vale: un rettangolo è un quadrato solo se ha anche i lati congruenti.
```
