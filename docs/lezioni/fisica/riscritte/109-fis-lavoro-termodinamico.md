# Il lavoro in una trasformazione termodinamica

Nel cilindro di un motore la miscela che brucia si espande e spinge il pistone, che fa girare le ruote. In una pompa da bicicletta succede il contrario: sei tu a spingere lo stantuffo, e l'aria dentro viene compressa. In tutti e due i casi una forza sposta un pistone, quindi c'è un [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza): nel primo lo compie il gas, nel secondo lo subisce. Questo lavoro si calcola dalla pressione e dal volume del gas, senza conoscere né la forza né lo spostamento, e sul piano pressione-volume si legge come un'area.

## Il lavoro a pressione costante

Un gas è chiuso in un cilindro da un pistone di sezione $S$, libero di scorrere senza attrito. Il gas ha [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione) $p$, e quindi preme sul pistone con una forza perpendicolare alla sua superficie, di modulo

$$F = p\,S$$

Scaldiamo il gas lentamente: si espande e solleva il pistone di un tratto $h$, mentre la pressione resta la stessa, perché a tenerla fissa sono il peso del pistone e la pressione dell'aria esterna, che non cambiano. Forza e spostamento hanno la stessa direzione e lo stesso verso, e il lavoro della forza del gas è

$$W = F\,h = p\,S\,h$$

Il prodotto $S\,h$ è il volume del cilindretto che il pistone ha lasciato libero, cioè l'aumento di volume del gas, $\Delta V = V_f - V_i$.

```tikz
% nome: pistone-lavoro-espansione
% alt: Un cilindro verticale chiuso da un pistone, disegnato due volte. A sinistra il gas, a pressione p, spinge il pistone verso l'alto con una forza F. A destra il gas si è espanso e il pistone, di sezione S, è salito di un tratto h: la fascia di volume in più, tra la vecchia e la nuova posizione del pistone, è colorata ed è indicata con delta V
% svg: pistone-lavoro-espansione-4eefc146.svg 232x114
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (1.6,1.2);
\draw[thick] (0,2.9) -- (0,0) -- (1.6,0) -- (1.6,2.9);
\draw[thick, fill=gray!20] (0.03,1.2) rectangle (1.57,1.38);
\draw[-{Stealth}, thick, red] (0.8,1.38) -- (0.8,2.4) node[right] {$\vec{F}$};
\node at (0.8,0.6) {$p$};
\draw[-{Stealth}, thick] (2.1,1.4) -- (3.0,1.4);
\fill[blue!10] (3.5,0) rectangle (5.1,1.2);
\fill[orange!25] (3.5,1.2) rectangle (5.1,2.0);
\draw[thick] (3.5,2.9) -- (3.5,0) -- (5.1,0) -- (5.1,2.9);
\draw[thick, fill=gray!20] (3.53,2.0) rectangle (5.07,2.18);
\draw[dashed] (3.5,1.2) -- (5.1,1.2);
\draw[dashed, thin] (5.1,1.2) -- (5.8,1.2);
\draw[dashed, thin] (5.1,2.0) -- (5.8,2.0);
\draw[{Stealth}-{Stealth}, thin] (5.6,1.2) -- (5.6,2.0) node[midway, right] {$h$};
\node at (4.3,0.6) {$p$};
\node at (4.3,1.6) {$\Delta V$};
\node[above] at (4.3,2.18) {$S$};
\end{tikzpicture}
```

Il **lavoro compiuto da un gas** in una trasformazione a pressione costante è quindi

$$W = p\,\Delta V = p\,(V_f - V_i)$$

La forma del recipiente non conta: la formula vale per un palloncino che si gonfia come per un cilindro, purché la pressione resti la stessa mentre il volume cambia.

Con la pressione in pascal e il volume in metri cubi il lavoro viene in joule:

$$\text{Pa} \cdot \text{m}^3 = \frac{\text{N}}{\text{m}^2} \cdot \text{m}^3 = \text{N} \cdot \text{m} = \text{J}$$

Per esempio, un pistone di sezione $40\,\text{cm}^2 = 4{,}0 \cdot 10^{-3}\,\text{m}^2$ che sale di $10\,\text{cm}$ sotto la spinta di un gas a $1{,}5 \cdot 10^5\,\text{Pa}$ riceve una forza $F = p\,S = 600\,\text{N}$ e un lavoro $F\,h = 600\,\text{N} \cdot 0{,}10\,\text{m} = 60\,\text{J}$. Lo stesso numero viene da $p\,\Delta V$: il volume è aumentato di $S\,h = 4{,}0 \cdot 10^{-4}\,\text{m}^3$, e $1{,}5 \cdot 10^5\,\text{Pa} \cdot 4{,}0 \cdot 10^{-4}\,\text{m}^3 = 60\,\text{J}$.

```ad-warning
Litri e atmosfere non danno joule
Il volume in litri e la pressione in atmosfere vanno convertiti prima di moltiplicare: $1\,\text{L} = 10^{-3}\,\text{m}^3$ e $1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$. Un gas a $1\,\text{atm}$ che si espande di $1\,\text{L}$ non compie $1\,\text{J}$ di lavoro, ma $1{,}01 \cdot 10^5\,\text{Pa} \cdot 10^{-3}\,\text{m}^3 = 101\,\text{J}$.
```

```ad-tip
Kilopascal per litri fa joule
Se la pressione è in kilopascal e il volume in litri, il prodotto è già in joule: $1\,\text{kPa} \cdot 1\,\text{L} = 10^3\,\text{Pa} \cdot 10^{-3}\,\text{m}^3 = 1\,\text{J}$. Per questo i grafici di questa lezione hanno la pressione in kilopascal e il volume in litri.
```

## Il segno del lavoro

Il segno di $W$ è quello di $\Delta V$, perché la pressione è sempre positiva.

- In un'**espansione** il volume aumenta, $\Delta V > 0$ e $W > 0$: il gas spinge il pistone nel verso in cui il pistone si muove, e compie lavoro sull'ambiente.
- In una **compressione** il volume diminuisce, $\Delta V < 0$ e $W < 0$: il pistone si muove contro la spinta del gas, e il lavoro lo compie l'ambiente sul gas. Si dice anche che il gas subisce un lavoro.
- Se il volume non cambia, $\Delta V = 0$ e $W = 0$: un gas chiuso in una bombola rigida non compie lavoro, per quanto lo si scaldi.

In tutta la termodinamica di queste lezioni $W$ è il lavoro compiuto dal sistema, positivo quando il gas si espande. Il lavoro che l'ambiente compie sul gas è il suo opposto, $-W$: nella compressione è positivo.

```ad-example
Esempio 1: un gas scaldato che si espande
Un gas chiuso in un cilindro con un pistone libero, alla pressione di $1{,}01 \cdot 10^5\,\text{Pa}$, viene scaldato e passa da $2{,}0\,\text{L}$ a $5{,}0\,\text{L}$. Quanto lavoro compie?

La pressione è costante. La variazione di volume, in metri cubi, è

$$\Delta V = 5{,}0\,\text{L} - 2{,}0\,\text{L} = 3{,}0\,\text{L} = 3{,}0 \cdot 10^{-3}\,\text{m}^3$$

$$W = p\,\Delta V = 1{,}01 \cdot 10^5\,\text{Pa} \cdot 3{,}0 \cdot 10^{-3}\,\text{m}^3 = 303\,\text{J} \approx 3{,}0 \cdot 10^2\,\text{J}$$

Il lavoro è positivo: lo compie il gas, che ha sollevato il pistone contro l'aria esterna.
```

```ad-example
Esempio 2: una compressione
L'aria in una pompa viene compressa alla pressione costante di $2{,}0 \cdot 10^5\,\text{Pa}$, e il suo volume passa da $0{,}80\,\text{L}$ a $0{,}30\,\text{L}$. Quanto lavoro compie il gas? E quanto ne compie chi spinge lo stantuffo?

$$\Delta V = V_f - V_i = 0{,}30\,\text{L} - 0{,}80\,\text{L} = -0{,}50\,\text{L} = -5{,}0 \cdot 10^{-4}\,\text{m}^3$$

$$W = p\,\Delta V = 2{,}0 \cdot 10^5\,\text{Pa} \cdot (-5{,}0 \cdot 10^{-4}\,\text{m}^3) = -1{,}0 \cdot 10^2\,\text{J}$$

Il lavoro del gas è negativo. Chi spinge lo stantuffo compie sul gas il lavoro opposto, $+1{,}0 \cdot 10^2\,\text{J}$.
```

```ad-warning
Finale meno iniziale, anche quando il volume cala
$\Delta V$ è sempre il volume finale meno quello iniziale. Chi in una compressione sottrae il più piccolo dal più grande trova un lavoro positivo, cioè un gas che si espande mentre lo si schiaccia.
```

## Il piano pressione-volume

Uno stato di equilibrio di una certa quantità di gas è descritto dalla sua pressione e dal suo volume (la temperatura segue dall'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto)), e si disegna come un punto su un piano con il volume in ascissa e la pressione in ordinata: il **piano pressione-volume**. Una trasformazione quasistatica, cioè fatta di stati di equilibrio uno dopo l'altro come spiega la lezione sui [sistemi termodinamici](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/sistemi-termodinamici-e-principio-zero), è una linea che va dallo stato iniziale a quello finale, con una freccia che ne dà il verso.

Una trasformazione a pressione costante, che si chiama isobara, è un segmento orizzontale. Il prodotto $p\,\Delta V$ è allora la base per l'altezza del rettangolo che sta sotto il segmento: il lavoro è l'area sotto la linea della trasformazione.

```tikz
% nome: isobara-lavoro-area-rettangolo
% alt: Il piano pressione-volume con il volume in litri in orizzontale e la pressione in kilopascal in verticale. Una trasformazione a pressione costante di 200 kilopascal va dallo stato A, a 2 litri, allo stato B, a 5 litri: è un segmento orizzontale con una freccia verso destra. Il rettangolo sotto il segmento, fino all'asse dei volumi, è colorato, e dentro è scritto W uguale a p per delta V
% svg: isobara-lavoro-area-rettangolo-cb326071.svg 307x200
\begin{tikzpicture}
\fill[orange!25] (1.6,0) rectangle (4.0,1.8);
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[dashed, thin] (1.6,0) -- (1.6,1.8);
\draw[dashed, thin] (4.0,0) -- (4.0,1.8);
\draw[thick, blue] (1.6,1.8) -- (4.0,1.8);
\draw[-{Stealth}, thick, blue] (2.6,1.8) -- (3.0,1.8);
\fill (1.6,1.8) circle (1.5pt) node[above] {$A$};
\fill (4.0,1.8) circle (1.5pt) node[above] {$B$};
\node at (2.8,0.9) {$W = p\,\Delta V$};
\end{tikzpicture}
```

Nella figura il gas passa da $2\,\text{L}$ a $5\,\text{L}$ a $200\,\text{kPa}$: il rettangolo ha base $3\,\text{L}$ e altezza $200\,\text{kPa}$, e l'area è $200\,\text{kPa} \cdot 3\,\text{L} = 600\,\text{J}$.

## Il lavoro come area

Quando la pressione cambia durante la trasformazione, la formula $W = p\,\Delta V$ non si può usare, perché non c'è una sola pressione da metterci. Resta vera l'idea dell'area. Si divide la trasformazione in tanti passi brevi: in ciascuno il volume cambia di poco e la pressione quasi non varia, così il lavoro del passo è l'area di una striscia sottile, alta quanto la pressione in quel momento. Sommando le strisce si ottiene l'area di tutta la regione che sta tra la linea della trasformazione e l'asse dei volumi. È lo stesso ragionamento che dà il [lavoro di una forza variabile](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/il-lavoro-di-una-forza-variabile) come area sotto il grafico forza-spostamento.

In qualunque trasformazione quasistatica il lavoro compiuto dal gas è l'area sotto la linea che la rappresenta nel piano pressione-volume, presa con il segno più se la linea va verso destra (espansione) e con il segno meno se va verso sinistra (compressione).

Le aree che si calcolano con la geometria sono tre.

- Un tratto orizzontale (pressione costante) ha sotto un rettangolo: $W = p\,\Delta V$.
- Un tratto verticale (volume costante) non ha niente sotto: $W = 0$.
- Un tratto rettilineo obliquo, in cui la pressione cambia in modo uniforme con il volume, ha sotto un trapezio, che ha per basi le due pressioni e per altezza la variazione di volume:

$$W = \frac{p_A + p_B}{2}\,(V_B - V_A)$$

In questa formula $\frac{p_A + p_B}{2}$ è la pressione media durante la trasformazione: il trapezio ha la stessa area del rettangolo con quella altezza.

```ad-example
Esempio 3: la pressione cala mentre il gas si espande
Un gas si espande dallo stato $A$ ($V_A = 2{,}0\,\text{L}$, $p_A = 3{,}0 \cdot 10^5\,\text{Pa}$) allo stato $B$ ($V_B = 6{,}0\,\text{L}$, $p_B = 1{,}0 \cdot 10^5\,\text{Pa}$) lungo il segmento della figura. Quanto lavoro compie?

Sotto il segmento c'è un trapezio con le basi $p_A$ e $p_B$ e l'altezza $V_B - V_A = 4{,}0\,\text{L} = 4{,}0 \cdot 10^{-3}\,\text{m}^3$:

$$W = \frac{p_A + p_B}{2}\,(V_B - V_A) = \frac{3{,}0 \cdot 10^5\,\text{Pa} + 1{,}0 \cdot 10^5\,\text{Pa}}{2} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 8{,}0 \cdot 10^2\,\text{J}$$

Sul grafico il conto si fa anche contando i quadretti: ognuno vale $100\,\text{kPa} \cdot 1\,\text{L} = 100\,\text{J}$, e sotto il segmento ce ne sono $8$ (quattro interi nella fila in basso, e sopra di loro un triangolo che ne vale altri quattro).
```

```tikz
% nome: lavoro-area-trapezio
% alt: Il piano pressione-volume con il volume in litri e la pressione in kilopascal. Un segmento con una freccia scende dallo stato A, a 2 litri e 300 kilopascal, allo stato B, a 6 litri e 100 kilopascal. Il trapezio sotto il segmento, fino all'asse dei volumi, è colorato, e dentro è scritto 800 joule
% svg: lavoro-area-trapezio-42e11ffd.svg 307x200
\begin{tikzpicture}
\fill[orange!25] (1.6,0) -- (1.6,2.7) -- (4.8,0.9) -- (4.8,0) -- cycle;
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[dashed, thin] (1.6,0) -- (1.6,2.7);
\draw[dashed, thin] (4.8,0) -- (4.8,0.9);
\draw[thick, blue] (1.6,2.7) -- (4.8,0.9);
\draw[-{Stealth}, thick, blue] (3.0,1.9125) -- (3.4,1.6875);
\fill (1.6,2.7) circle (1.5pt) node[above] {$A$};
\fill (4.8,0.9) circle (1.5pt) node[above right] {$B$};
\node at (3.0,0.7) {$800$ J};
\end{tikzpicture}
```

Quando la linea è una curva, l'area non si trova con una formula di geometria. La si stima contando i quadretti del grafico, quelli interi e a occhio quelli tagliati dalla curva, e moltiplicando per quanto vale un quadretto. Per alcune curve il risultato esatto è noto: quello della trasformazione a temperatura costante è nella lezione [Le trasformazioni isocora, isobara e isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma).

```tikz
% nome: lavoro-curva-quadretti
% alt: Il piano pressione-volume con una griglia di quadretti larghi mezzo litro e alti 50 kilopascal. Una curva con una freccia scende dallo stato A, a 1 litro e 400 kilopascal, allo stato B, a 4 litri e 100 kilopascal, piegando verso il basso come un ramo di iperbole. La regione sotto la curva, tra 1 e 4 litri, è colorata: copre circa 22 quadretti
% svg: lavoro-curva-quadretti-e8f54ed6.svg 247x215
\begin{tikzpicture}
\fill[orange!25] (0.8,0) -- (0.8,3.6) -- plot[domain=0.8:3.2, samples=40] (\x,{2.88/\x}) -- (3.2,0) -- cycle;
\draw[gray!40, very thin, xstep=0.4, ystep=0.45] (0,0) grid (4.0,4.05);
\draw[->] (-0.3,0) -- (4.5,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.5) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[thick, blue] plot[domain=0.8:3.2, samples=40] (\x,{2.88/\x});
\draw[-{Stealth}, thick, blue] (1.5,1.92) -- (1.72,1.6744);
\fill (0.8,3.6) circle (1.5pt) node[right] {$A$};
\fill (3.2,0.9) circle (1.5pt) node[above right] {$B$};
\end{tikzpicture}
```

Nella figura ogni quadretto è largo $0{,}5\,\text{L}$ e alto $50\,\text{kPa}$, quindi vale $50\,\text{kPa} \cdot 0{,}5\,\text{L} = 25\,\text{J}$. Sotto la curva, tra $1\,\text{L}$ e $4\,\text{L}$, ce ne stanno circa $22$: il lavoro è circa $22 \cdot 25\,\text{J} = 550\,\text{J}$.

## Il lavoro dipende dal cammino

Tra due stati $A$ e $B$ le trasformazioni possibili sono infinite, una per ogni linea che li unisce, e ogni linea ha sotto di sé un'area diversa. Il lavoro quindi non dipende solo dallo stato di partenza e da quello di arrivo: dipende da come il gas ci arriva.

```ad-example
Esempio 4: due cammini tra gli stessi stati
Il gas dell'esempio 3 va da $A$ ($2{,}0\,\text{L}$, $3{,}0 \cdot 10^5\,\text{Pa}$) a $B$ ($6{,}0\,\text{L}$, $1{,}0 \cdot 10^5\,\text{Pa}$) in altri due modi. Nel primo si espande a pressione costante fino a $6{,}0\,\text{L}$ (stato $C$) e poi si raffredda a volume costante. Nel secondo si raffredda prima a volume costante (stato $D$) e poi si espande a pressione costante. Quanto lavoro compie in ciascun caso?

Nei tratti a volume costante, $C \to B$ e $A \to D$, il lavoro è zero. Restano i due tratti a pressione costante, con $\Delta V = 4{,}0 \cdot 10^{-3}\,\text{m}^3$.

Cammino $A \to C \to B$, con l'espansione a $3{,}0 \cdot 10^5\,\text{Pa}$:

$$W_{ACB} = p_A\,\Delta V = 3{,}0 \cdot 10^5\,\text{Pa} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 1{,}2 \cdot 10^3\,\text{J}$$

Cammino $A \to D \to B$, con l'espansione a $1{,}0 \cdot 10^5\,\text{Pa}$:

$$W_{ADB} = p_B\,\Delta V = 1{,}0 \cdot 10^5\,\text{Pa} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 4{,}0 \cdot 10^2\,\text{J}$$

Stati iniziale e finale uguali, tre lavori diversi: $1200\,\text{J}$ passando in alto, $800\,\text{J}$ lungo il segmento dell'esempio 3, $400\,\text{J}$ passando in basso.
```

```tikz
% nome: lavoro-due-cammini
% alt: Il piano pressione-volume con gli stati A, a 2 litri e 300 kilopascal, e B, a 6 litri e 100 kilopascal. Un cammino va da A in orizzontale fino a C, a 6 litri e 300 kilopascal, e poi scende in verticale fino a B. Un altro scende in verticale da A a D, a 2 litri e 100 kilopascal, e poi va in orizzontale fino a B. Sotto il tratto DB la regione è colorata di arancione ed è scritto 400 joule; la regione tra il tratto AC e il tratto DB è colorata di azzurro ed è scritto più 800 joule
% svg: lavoro-due-cammini-e2af85f2.svg 307x200
\begin{tikzpicture}
\fill[orange!25] (1.6,0) rectangle (4.8,0.9);
\fill[blue!10] (1.6,0.9) rectangle (4.8,2.7);
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[dashed, thin] (1.6,0) -- (1.6,0.9);
\draw[dashed, thin] (4.8,0) -- (4.8,0.9);
\draw[thick, blue] (1.6,2.7) -- (4.8,2.7) -- (4.8,0.9);
\draw[thick, red] (1.6,2.7) -- (1.6,0.9) -- (4.8,0.9);
\draw[-{Stealth}, thick, blue] (3.0,2.7) -- (3.4,2.7);
\draw[-{Stealth}, thick, blue] (4.8,2.0) -- (4.8,1.6);
\draw[-{Stealth}, thick, red] (1.6,2.0) -- (1.6,1.6);
\draw[-{Stealth}, thick, red] (3.0,0.9) -- (3.4,0.9);
\fill (1.6,2.7) circle (1.5pt) node[above left] {$A$};
\fill (4.8,2.7) circle (1.5pt) node[above right] {$C$};
\fill (4.8,0.9) circle (1.5pt) node[right] {$B$};
\fill (1.6,0.9) circle (1.5pt) node[left] {$D$};
\node at (3.2,0.45) {$400$ J};
\node at (3.2,1.8) {$+\,800$ J};
\end{tikzpicture}
```

Nella figura qui sotto il cilindro è disegnato sopra il piano pressione-volume, con la stessa scala in orizzontale: la faccia del pistone sta sempre sopra il volume del gas. Scegli uno dei tre cammini da $A$ a $B$ e fallo percorrere: quanto lavoro compie il gas lungo ciascuno?

```interattivo
% nome: pistone-lavoro-cammini
% alt: Un cilindro orizzontale con un pistone e, sotto, il piano pressione-volume con la stessa scala orizzontale, così che il pistone sta sopra il volume del gas. Il gas va dallo stato A, a 2 litri e 300 kilopascal, allo stato B, a 6 litri e 100 kilopascal, lungo uno di tre cammini da scegliere: prima a pressione costante e poi a volume costante, lungo il segmento diretto, oppure prima a volume costante e poi a pressione costante. Un bottone fa percorrere il cammino: il pistone si sposta, il punto dello stato traccia la linea e l'area sotto di essa si colora. Sotto sono scritti il volume, la pressione e il lavoro compiuto fino a quel momento, che alla fine vale 1200, 800 o 400 joule
```

Il pistone parte e arriva nelle stesse posizioni in tutti e tre i casi, ma il gas lo spinge con forze diverse lungo la strada: passando in alto la pressione resta $300\,\text{kPa}$ per tutta l'espansione e il lavoro è $1200\,\text{J}$, passando in basso l'espansione avviene a $100\,\text{kPa}$ e il lavoro è un terzo, $400\,\text{J}$. Nei tratti verticali il pistone è fermo e l'area non cresce.

Per questo il lavoro non è una funzione di stato. Ha senso dire che un gas in un certo stato ha una certa pressione, un certo volume, una certa [energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna); non ha senso dire che "contiene" un certo lavoro. Il lavoro è una quantità di energia che passa tra il gas e l'ambiente durante una trasformazione, e si può dire quanto vale solo dopo aver detto quale trasformazione.

```ad-note
Un confronto con la meccanica
Il lavoro del peso tra due punti non dipende dalla strada, e per questo il peso ha un'energia potenziale ([Forze conservative ed energia potenziale](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/forze-conservative-ed-energia-potenziale)). Il lavoro di un gas tra due stati dipende dalla strada: non esiste una "energia potenziale del gas" da cui ricavarlo come differenza.
```

## Il lavoro in una trasformazione ciclica

Una **trasformazione ciclica**, o ciclo, riporta il gas nello stato di partenza: nel piano pressione-volume è una linea chiusa. Il lavoro totale è la somma dei lavori dei tratti, ciascuno con il suo segno. Nei tratti in cui il gas si espande il lavoro è positivo ed è l'area sotto la parte alta del ciclo; nei tratti in cui viene compresso è negativo ed è l'area sotto la parte bassa. La differenza è l'area racchiusa dalla linea chiusa:

- se il ciclo è percorso in senso orario, l'espansione avviene a pressione più alta della compressione e il lavoro totale è positivo;
- se è percorso in senso antiorario, il lavoro totale è negativo, con lo stesso valore assoluto.

```ad-example
Esempio 5: un ciclo rettangolare
Il gas percorre il ciclo $A \to C \to B \to D \to A$ della figura, con gli stati dell'esempio 4. Quanto lavoro compie in un ciclo?

Tratto per tratto:

- $A \to C$, espansione a $3{,}0 \cdot 10^5\,\text{Pa}$: $W = 3{,}0 \cdot 10^5\,\text{Pa} \cdot 4{,}0 \cdot 10^{-3}\,\text{m}^3 = 1{,}2 \cdot 10^3\,\text{J}$;
- $C \to B$, volume costante: $W = 0$;
- $B \to D$, compressione a $1{,}0 \cdot 10^5\,\text{Pa}$: $W = 1{,}0 \cdot 10^5\,\text{Pa} \cdot (-4{,}0 \cdot 10^{-3}\,\text{m}^3) = -4{,}0 \cdot 10^2\,\text{J}$;
- $D \to A$, volume costante: $W = 0$.

$$W_{ciclo} = 1200\,\text{J} + 0 - 400\,\text{J} + 0 = 8{,}0 \cdot 10^2\,\text{J}$$

È l'area del rettangolo racchiuso dal ciclo, con base $4{,}0 \cdot 10^{-3}\,\text{m}^3$ e altezza $2{,}0 \cdot 10^5\,\text{Pa}$. Il ciclo è percorso in senso orario e il lavoro è positivo; percorso al contrario, $A \to D \to B \to C \to A$, darebbe $-8{,}0 \cdot 10^2\,\text{J}$.
```

```tikz
% nome: ciclo-rettangolare-area-racchiusa
% alt: Il piano pressione-volume con un ciclo rettangolare percorso in senso orario: da A, a 2 litri e 300 kilopascal, in orizzontale fino a C, a 6 litri; poi in verticale giù fino a B, a 100 kilopascal; poi in orizzontale indietro fino a D, a 2 litri; poi in verticale su fino ad A. Il rettangolo racchiuso dal ciclo è colorato, e dentro è scritto W uguale a 800 joule
% svg: ciclo-rettangolare-area-racchiusa-072fe933.svg 307x200
\begin{tikzpicture}
\fill[orange!25] (1.6,0.9) rectangle (4.8,2.7);
\draw[gray!25, very thin, xstep=0.8, ystep=0.9] (0,0) grid (5.6,3.6);
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$V$ (L)};
\draw[->] (0,-0.3) -- (0,4.1) node[above] {$p$ (kPa)};
\foreach \x/\l in {0.8/1,1.6/2,2.4/3,3.2/4,4.0/5,4.8/6,5.6/7} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\l$};
\foreach \y/\l in {0.9/100,1.8/200,2.7/300,3.6/400} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\l$};
\draw[thick, blue] (1.6,2.7) -- (4.8,2.7) -- (4.8,0.9) -- (1.6,0.9) -- cycle;
\draw[-{Stealth}, thick, blue] (3.0,2.7) -- (3.4,2.7);
\draw[-{Stealth}, thick, blue] (4.8,2.0) -- (4.8,1.6);
\draw[-{Stealth}, thick, blue] (3.4,0.9) -- (3.0,0.9);
\draw[-{Stealth}, thick, blue] (1.6,1.6) -- (1.6,2.0);
\fill (1.6,2.7) circle (1.5pt) node[above left] {$A$};
\fill (4.8,2.7) circle (1.5pt) node[above right] {$C$};
\fill (4.8,0.9) circle (1.5pt) node[below right] {$B$};
\fill (1.6,0.9) circle (1.5pt) node[below left] {$D$};
\node at (3.2,1.8) {$W = 800$ J};
\end{tikzpicture}
```

```ad-warning
In un ciclo il lavoro non è zero
Alla fine di un ciclo il gas è tornato nello stato iniziale, e pressione, volume e temperatura sono quelli di partenza. Il lavoro totale però non è zero: è l'area racchiusa dal ciclo. È proprio perché il lavoro non è una funzione di stato che un motore, ripetendo sempre lo stesso ciclo, può fornire lavoro a ogni giro. Da dove venga l'energia lo dice il [primo principio della termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica).
```

## Come si trova il lavoro da un grafico

1. Controlla le unità sugli assi e calcola quanto vale un quadretto: con pascal e metri cubi viene in joule, e anche con kilopascal e litri.
2. Dividi la trasformazione in tratti: orizzontali, verticali, obliqui, curvi.
3. Per ogni tratto trova l'area tra la linea e l'asse dei volumi: rettangolo, niente, trapezio, oppure quadretti contati.
4. Dai il segno a ogni area: più se il tratto va verso destra, meno se va verso sinistra.
5. Somma i lavori dei tratti. Per un ciclo il risultato è l'area racchiusa, positiva se il verso è orario.
