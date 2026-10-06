# Il lavoro di una forza variabile

Chi tende l'elastico di una fionda sente la forza crescere a mano a mano che tira: all'inizio basta poco, alla fine serve tutta la forza del braccio. Lo stesso succede con la corda di un arco, con una molla, con il respingente che ferma un vagone. In tutti questi casi la forza cambia durante lo spostamento, e la formula $W = F\,s\cos\alpha$ del [lavoro di una forza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) costante non dice quale valore di $F$ usare. Il lavoro però si può ancora calcolare, e la strada passa da un grafico.

## Il grafico forza-spostamento

Consideriamo un corpo che si muove lungo una retta, l'asse $x$, e una forza che agisce su di lui. Del vettore forza conta solo la componente lungo l'asse, che indichiamo con $F$: è positiva se la forza punta nel verso positivo dell'asse, negativa se punta nel verso opposto. Il **grafico forza-spostamento** ha la posizione $x$ in orizzontale e $F$ in verticale.

Nel biennio hai visto due casi. Una forza costante è un segmento orizzontale, e il suo lavoro $F\,\Delta x$ è l'area del rettangolo sotto il segmento. La forza che allunga una molla, $F = k\,x$, è una retta per l'origine, e il lavoro per allungarla di $x$ è l'area del triangolo sotto la retta, $\tfrac{1}{2}\,k\,x^2$. La regola è la stessa per ogni forza, qualunque forma abbia il grafico.

## Il lavoro come somma di tanti piccoli lavori

Dividiamo lo spostamento in tanti tratti brevi, ciascuno lungo $\Delta x$. Se un tratto è abbastanza corto, la forza al suo interno cambia poco, e la si può trattare come costante, uguale al valore che ha all'inizio del tratto. Il lavoro compiuto in quel tratto è allora

$$\Delta W \approx F\,\Delta x$$

cioè l'area di un rettangolo stretto, con base $\Delta x$ e altezza $F$. Il lavoro totale è la somma dei lavori di tutti i tratti, cioè la somma delle aree di tutti i rettangoli.

```tikz
% nome: lavoro-forza-variabile-rettangoli
% alt: Il grafico di una forza F che cresce con la posizione x lungo una curva. Lo spostamento è diviso in cinque tratti uguali, e sotto la curva sono disegnati cinque rettangoli, ciascuno alto quanto la forza all'inizio del tratto. Il terzo rettangolo è evidenziato: la sua base è delta x, la sua altezza F e la sua area è il lavoro compiuto in quel tratto. Tra i rettangoli e la curva restano piccoli triangoli scoperti
\begin{tikzpicture}
\fill[orange!25] (0,0) rectangle (1,0.5);
\fill[orange!25] (1,0) rectangle (2,1.49);
\fill[orange!60] (2,0) rectangle (3,2.26);
\fill[orange!25] (3,0) rectangle (4,2.81);
\fill[orange!25] (4,0) rectangle (5,3.14);
\foreach \x/\y in {0/0.5, 1/1.49, 2/2.26, 3/2.81, 4/3.14} \draw[thin] (\x,0) -- (\x,\y) -- ++(1,0) -- ++(0,-\y);
\draw[->] (-0.3,0) -- (5.8,0) node[right] {$x$};
\draw[->] (0,-0.3) -- (0,3.9) node[above] {$F$};
\draw[thick, red] plot[domain=0:5, samples=40, smooth] (\x, {0.5+1.1*\x-0.11*\x*\x});
\node[below] at (2.5,0) {$\Delta x$};
\draw[dashed, thin] (2,2.26) -- (0,2.26);
\node[left] at (0,2.26) {$F$};
\node at (2.5,1.0) {\small $F\,\Delta x$};
\end{tikzpicture}
```

I rettangoli non coprono esattamente la zona sotto la curva: restano scoperti dei piccoli triangoli, perché dentro ogni tratto la forza in realtà è cambiata un po'. Ma più i tratti sono corti, più quei triangoli diventano piccoli, e la somma dei rettangoli si avvicina all'area compresa tra il grafico e l'asse $x$. Si arriva così alla regola generale:

il **lavoro di una forza variabile** su un corpo che si sposta da $x_1$ a $x_2$ è uguale all'area compresa tra il grafico forza-spostamento e l'asse $x$, tra $x_1$ e $x_2$.

È lo stesso ragionamento con cui, nel [grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo), lo spostamento è l'area sotto il grafico: anche lì una grandezza che cambia, la velocità, viene moltiplicata per tanti piccoli intervalli.

Nella figura qui sotto scegli in quanti tratti dividere lo spostamento di $40\,\text{cm}$, per una molla e per l'elastico di una fionda. Con quattro tratti la somma dei rettangoli è lontana dall'area vera: per la molla dà $4{,}8\,\text{J}$ invece di $6{,}4\,\text{J}$. Con quaranta tratti i rettangoli seguono il grafico quasi alla perfezione e la somma arriva a $6{,}24\,\text{J}$: l'errore si è ridotto di dieci volte, e continua a ridursi aumentando i tratti.

```interattivo
% nome: lavoro-area-rettangoli-tratti
% alt: Il grafico della forza in funzione dell'allungamento, da 0 a 40 centimetri, per una molla (una retta) o per l'elastico di una fionda (una curva che cresce sempre meno), a scelta. Un cursore cambia il numero di tratti in cui è diviso lo spostamento, da 1 a 40: sotto il grafico sono disegnati i rettangoli, uno per tratto, alti quanto la forza all'inizio del tratto. Sotto la figura sono scritti la lunghezza di un tratto, la somma delle aree dei rettangoli e l'area sotto il grafico, a cui la somma si avvicina quando i tratti aumentano
```

```ad-note
Le unità dell'area
In un grafico forza-spostamento un'area non si misura in metri quadrati: la base è in metri e l'altezza in newton, quindi l'area è in $\text{N} \cdot \text{m}$, cioè in joule. Prima di calcolare un'area leggi sugli assi quanto vale un quadretto: se è largo $0{,}5\,\text{m}$ e alto $2\,\text{N}$, vale $1\,\text{J}$.
```

## Grafici fatti di tratti rettilinei

Quando il grafico è una spezzata, l'area si divide in rettangoli, triangoli e trapezi, e si calcola con le formule della [geometria](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree).

```ad-example
Esempio 1: una spinta che si esaurisce
Un carrello viene spinto lungo un binario rettilineo. La forza vale $6{,}0\,\text{N}$ per i primi $2{,}0\,\text{m}$, poi diminuisce in modo regolare fino ad annullarsi a $5{,}0\,\text{m}$ dalla partenza. Quanto lavoro compie in tutto?

```tikz
% nome: grafico-forza-spostamento-spinta
% alt: Il grafico della forza sul carrello in funzione della posizione: un tratto orizzontale a 6 newton da 0 a 2 metri, poi un segmento che scende fino a 0 newton a 5 metri. Il rettangolo sotto il primo tratto è colorato in arancione, con scritto 12 joule; il triangolo sotto il secondo tratto è colorato in blu, con scritto 9,0 joule
% poi-interattivo: trascinare i vertici della spezzata e leggere le aree dei pezzi
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.8] (0,0) grid (5.5,3.2);
\fill[orange!25] (0,0) rectangle (2,2.4);
\fill[blue!15] (2,0) -- (5,0) -- (2,2.4) -- cycle;
\draw[->] (-0.3,0) -- (6,0) node[right] {$x$ (m)};
\draw[->] (0,-0.3) -- (0,3.4) node[above] {$F$ (N)};
\foreach \x in {1,2,3,4,5} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\x$};
\foreach \y/\t in {0.8/2, 1.6/4, 2.4/6} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\draw[dashed, thin] (2,0) -- (2,2.4);
\draw[thick, red] (0,2.4) -- (2,2.4) -- (5,0);
\node at (1,1.2) {\small $12$ J};
\node at (2.9,0.7) {\small $9{,}0$ J};
\end{tikzpicture}
```

Il lavoro è l'area sotto la spezzata, che si divide in un rettangolo e in un triangolo:

$$W_1 = 6{,}0\,\text{N} \cdot 2{,}0\,\text{m} = 12\,\text{J} \qquad W_2 = \frac{1}{2} \cdot (5{,}0\,\text{m} - 2{,}0\,\text{m}) \cdot 6{,}0\,\text{N} = 9{,}0\,\text{J}$$

$$W = W_1 + W_2 = 12\,\text{J} + 9{,}0\,\text{J} = 21\,\text{J}$$
```

```ad-warning
Non si moltiplica la forza finale per lo spostamento
Nell'esempio 1 la forza parte da $6{,}0\,\text{N}$ e arriva a zero: usare $W = F\,\Delta x$ con il valore iniziale darebbe $30\,\text{J}$, con quello finale zero. Nessuno dei due è il lavoro, perché la forza non è rimasta costante. La formula $F\,\Delta x$ vale solo dentro un tratto in cui $F$ non cambia.
```

### Le aree sotto l'asse contano con il segno meno

Dove il grafico sta sotto l'asse $x$ la componente $F$ è negativa: la forza punta nel verso opposto allo spostamento e compie un lavoro negativo, cioè resistente. Le aree sotto l'asse si sottraggono: il lavoro totale è la somma delle aree sopra l'asse meno la somma di quelle sotto.

```ad-example
Esempio 2: una forza che cambia verso
Su un disco che scivola lungo l'asse $x$ agisce una forza che vale $8{,}0\,\text{N}$ in $x = 0$ e diminuisce in modo regolare fino a $-4{,}0\,\text{N}$ in $x = 6{,}0\,\text{m}$. Quanto lavoro compie tra $0$ e $6{,}0\,\text{m}$?

```tikz
% nome: grafico-forza-spostamento-area-negativa
% alt: Il grafico di una forza che scende in linea retta da 8 newton nella posizione 0 fino a meno 4 newton a 6 metri, attraversando l'asse a 4 metri. Il triangolo sopra l'asse, tra 0 e 4 metri, è colorato in arancione con scritto più 16 joule; il triangolo sotto l'asse, tra 4 e 6 metri, è colorato in blu con scritto meno 4,0 joule
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.9, ystep=0.5] (0,-1) grid (5.4,2.5);
\fill[orange!25] (0,0) -- (3.6,0) -- (0,2) -- cycle;
\fill[blue!15] (3.6,0) -- (5.4,0) -- (5.4,-1) -- cycle;
\draw[->] (-0.3,0) -- (6.1,0) node[right] {$x$ (m)};
\draw[->] (0,-1.3) -- (0,2.9) node[above] {$F$ (N)};
\foreach \x/\t in {1.8/2, 3.6/4, 5.4/6} \draw (\x,0.07) -- (\x,-0.07);
\node[below] at (1.8,-0.07) {\small $2$};
\node[below left] at (3.6,-0.02) {\small $4$};
\node[above] at (5.4,0.07) {\small $6$};
\foreach \y/\t in {-1/-4, 1/4, 2/8} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\draw[dashed, thin] (5.4,0) -- (5.4,-1);
\draw[thick, red] (0,2) -- (5.4,-1);
\node at (1.1,0.6) {\small $+16$ J};
\node at (4.6,-1.25) {\small $-4{,}0$ J};
\end{tikzpicture}
```

In $6{,}0\,\text{m}$ la forza diminuisce di $12\,\text{N}$, cioè di $2{,}0\,\text{N}$ ogni metro: si annulla in $x = 4{,}0\,\text{m}$. Fino a lì è positiva, poi negativa.

$$W_1 = \frac{1}{2} \cdot 4{,}0\,\text{m} \cdot 8{,}0\,\text{N} = 16\,\text{J} \qquad W_2 = -\frac{1}{2} \cdot 2{,}0\,\text{m} \cdot 4{,}0\,\text{N} = -4{,}0\,\text{J}$$

$$W = W_1 + W_2 = 16\,\text{J} - 4{,}0\,\text{J} = 12\,\text{J}$$

Nei primi quattro metri la forza aiuta il moto, negli ultimi due lo frena.
```

```ad-warning
Sommare tutte le aree come positive
Nell'esempio 2 la somma delle due aree senza segno è $20\,\text{J}$, ma non è il lavoro: l'area sotto l'asse rappresenta un lavoro resistente e va sottratta.
```

### La forza media

Una forza variabile compie lo stesso lavoro di una forza costante scelta bene. La **forza media** $F_m$ su uno spostamento $\Delta x$ è la forza costante che, sullo stesso spostamento, compirebbe lo stesso lavoro:

$$F_m = \frac{W}{\Delta x}$$

Sul grafico è l'altezza del rettangolo che ha la stessa base e la stessa area della figura sotto il grafico. Nell'esempio 1 vale $F_m = 21\,\text{J} / 5{,}0\,\text{m} = 4{,}2\,\text{N}$.

```tikz
% nome: forza-media-rettangolo-stessa-area
% alt: Il grafico della forza dell'esempio 1, un tratto orizzontale a 6 newton fino a 2 metri e poi una discesa fino a zero a 5 metri. Una linea tratteggiata orizzontale all'altezza di 4,2 newton, da 0 a 5 metri, è la forza media: il rettangolo sotto questa linea ha la stessa area della figura sotto il grafico
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.8] (0,0) grid (5.5,3.2);
\fill[orange!25] (0,0) rectangle (5,1.68);
\draw[->] (-0.3,0) -- (6,0) node[right] {$x$ (m)};
\draw[->] (0,-0.3) -- (0,3.4) node[above] {$F$ (N)};
\foreach \x in {1,2,3,4,5} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\x$};
\foreach \y/\t in {0.8/2, 1.6/4, 2.4/6} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\draw[thick, red] (0,2.4) -- (2,2.4) -- (5,0);
\draw[thick, dashed, orange!90!black] (0,1.68) -- (5,1.68) -- (5,0);
\node[right] at (5,1.68) {$F_m$};
\end{tikzpicture}
```

Quando la forza cambia in linea retta da $F_1$ a $F_2$, la figura è un trapezio e la forza media è la media dei due valori, $F_m = (F_1 + F_2)/2$. Se il grafico non è una retta, questa scorciatoia non vale.

## Quando il grafico è una curva

Se il grafico è una curva, l'area non si calcola con una formula elementare. Su un foglio quadrettato la si stima contando i quadretti: si contano quelli tutti sotto la curva, si aggiungono quelli attraversati dalla curva contandoli per metà, e si moltiplica per il lavoro che vale un quadretto.

```ad-example
Esempio 3: l'elastico di una fionda
La forza necessaria per tendere l'elastico di una fionda è stata misurata a vari allungamenti e riportata nel grafico. Quanto lavoro serve per tendere l'elastico di $40\,\text{cm}$?

```tikz
% nome: grafico-fionda-quadretti
% alt: Su un foglio quadrettato, il grafico della forza che tende l'elastico di una fionda in funzione dell'allungamento: una curva che parte dall'origine, sale ripida all'inizio e sempre meno poi, fino a 32 newton a 40 centimetri. Ogni quadretto è largo 5 centimetri e alto 4 newton. La zona sotto la curva è colorata
\begin{tikzpicture}
\fill[orange!25] (0,0) -- plot[domain=0:4.4, samples=40, smooth] (\x, {2*\x-0.22727*\x*\x}) -- (4.4,0) -- cycle;
\foreach \k in {0,0.55,...,4.41} { \draw[gray!60, very thin] (\k,0) -- (\k,4.4); \draw[gray!60, very thin] (0,\k) -- (4.4,\k); }
\draw[->] (-0.3,0) -- (5.1,0) node[right] {$x$ (cm)};
\draw[->] (0,-0.3) -- (0,4.9) node[above] {$F$ (N)};
\foreach \x/\t in {1.1/10, 2.2/20, 3.3/30, 4.4/40} \draw (\x,0.07) -- (\x,-0.07) node[below] {\small $\t$};
\foreach \y/\t in {1.1/8, 2.2/16, 3.3/24, 4.4/32} \draw (0.07,\y) -- (-0.07,\y) node[left] {\small $\t$};
\draw[thick, red] plot[domain=0:4.4, samples=40, smooth] (\x, {2*\x-0.22727*\x*\x});
\end{tikzpicture}
```

Un quadretto è largo $5\,\text{cm} = 0{,}05\,\text{m}$ e alto $4\,\text{N}$: vale $0{,}05\,\text{m} \cdot 4\,\text{N} = 0{,}20\,\text{J}$. Sotto la curva ci sono $34$ quadretti interi e $14$ attraversati dalla curva, che contiamo per metà:

$$34 + \frac{14}{2} = 41 \text{ quadretti} \qquad W \approx 41 \cdot 0{,}20\,\text{J} = 8{,}2\,\text{J}$$

È una stima: con quadretti più piccoli si troverebbe un valore più preciso, circa $8{,}5\,\text{J}$. Se l'elastico fosse una molla, con la forza che cresce in linea retta fino a $32\,\text{N}$, il lavoro sarebbe l'area del triangolo, $\tfrac{1}{2} \cdot 0{,}40\,\text{m} \cdot 32\,\text{N} = 6{,}4\,\text{J}$: la curva sta sopra la retta, e il lavoro è maggiore.
```

Altre forze hanno grafici curvi che incontrerai presto: la forza di gravità lontano dalla superficie della Terra, che diminuisce con la distanza (lezione [L'energia potenziale gravitazionale e la velocità di fuga](/materiale/scuola-superiore/fisica/la-gravitazione/l-energia-potenziale-gravitazionale-e-la-velocita-di-fuga)), e la forza di un gas che si espande spingendo un pistone (lezione [Il lavoro in una trasformazione termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica)). In quei casi il lavoro è ancora l'area sotto il grafico, e il suo valore esatto si calcola con strumenti di matematica del quinto anno; le lezioni daranno il risultato.

## Il lavoro della forza elastica

La forza variabile più comune è quella di una molla. Chiamiamo $x$ la deformazione della molla, misurata dalla posizione di riposo e positiva quando la molla è allungata. Per la [legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke) la forza elastica sul corpo attaccato alla molla richiama sempre verso la posizione di riposo, e la sua componente lungo l'asse è

$$F = -k\,x$$

Il grafico è una retta che passa per l'origine e scende: con la molla allungata ($x > 0$) la forza è negativa. Quando il corpo si sposta da una deformazione $x_1$ a una deformazione più grande $x_2$, la figura tra il grafico e l'asse è un trapezio che sta sotto l'asse, con le basi lunghe $k\,x_1$ e $k\,x_2$ e l'altezza $x_2 - x_1$.

```tikz
% nome: grafico-forza-elastica-trapezio
% alt: Il grafico della forza elastica in funzione della deformazione x: una retta che parte dall'origine e scende sotto l'asse. Tra le deformazioni x uno e x due, la figura compresa tra l'asse e la retta è un trapezio colorato, sotto l'asse: le sue basi verticali sono lunghe k per x uno e k per x due
\begin{tikzpicture}
\fill[blue!15] (1.5,0) -- (3.5,0) -- (3.5,-2.1) -- (1.5,-0.9) -- cycle;
\draw[->] (-0.3,0) -- (5.2,0) node[right] {$x$};
\draw[->] (0,-3.1) -- (0,0.9) node[above] {$F$};
\draw[thick, red] (0,0) -- (4.6,-2.76) node[right] {$F = -k\,x$};
\draw[dashed, thin] (1.5,0) -- (1.5,-0.9) -- (0,-0.9);
\draw[dashed, thin] (3.5,0) -- (3.5,-2.1) -- (0,-2.1);
\node[above] at (1.5,0) {$x_1$};
\node[above] at (3.5,0) {$x_2$};
\node[left] at (0,-0.9) {$-k\,x_1$};
\node[left] at (0,-2.1) {$-k\,x_2$};
\end{tikzpicture}
```

L'area del trapezio è la semisomma delle basi per l'altezza:

$$\frac{(k\,x_1 + k\,x_2)\,(x_2 - x_1)}{2} = \frac{1}{2}\,k\,(x_2 + x_1)(x_2 - x_1) = \frac{1}{2}\,k\,x_2^2 - \frac{1}{2}\,k\,x_1^2$$

Il trapezio è sotto l'asse, quindi il lavoro è l'opposto di quest'area. Il **lavoro della forza elastica** quando la deformazione passa da $x_1$ a $x_2$ è

$$W_{el} = \frac{1}{2}\,k\,x_1^2 - \frac{1}{2}\,k\,x_2^2$$

La formula vale in tutti i casi, non solo in quello della figura:

- se la deformazione aumenta ($|x_2| > |x_1|$) il lavoro è negativo: la molla si oppone a chi la deforma;
- se la deformazione diminuisce il lavoro è positivo: la molla, tornando verso la posizione di riposo, spinge o tira il corpo nel verso del moto;
- per una molla compressa $x$ è negativo, ma nella formula compare al quadrato: allungamento e compressione della stessa lunghezza danno lo stesso lavoro;
- partendo dalla posizione di riposo ($x_1 = 0$) si ritrova $W_{el} = -\tfrac{1}{2}\,k\,x^2$, l'opposto del lavoro $\tfrac{1}{2}\,k\,x^2$ compiuto dalla mano che allunga lentamente la molla.

Il lavoro della forza elastica dipende solo dalla deformazione iniziale e da quella finale. La quantità $\tfrac{1}{2}\,k\,x^2$ che compare due volte è l'[energia potenziale elastica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/energia-potenziale-gravitazionale-ed-elastica) del biennio; la lezione [Forze conservative ed energia potenziale](/materiale/scuola-superiore/fisica/il-lavoro-e-le-forze-conservative/forze-conservative-ed-energia-potenziale) spiega per quali forze si può definire una quantità di questo tipo.

```ad-example
Esempio 4: una molla tesa ancora di più
Una molla di costante elastica $k = 300\,\text{N/m}$ è già allungata di $4{,}0\,\text{cm}$, e viene allungata lentamente fino a $10\,\text{cm}$. Quanto lavoro compie la forza elastica? E la mano che tira?

Le deformazioni in metri: $x_1 = 0{,}040\,\text{m}$ e $x_2 = 0{,}10\,\text{m}$.

$$W_{el} = \frac{1}{2}\,k\,x_1^2 - \frac{1}{2}\,k\,x_2^2 = \frac{1}{2} \cdot 300\,\text{N/m} \cdot \left[(0{,}040\,\text{m})^2 - (0{,}10\,\text{m})^2\right] = 0{,}24\,\text{J} - 1{,}5\,\text{J} = -1{,}26\,\text{J} \approx -1{,}3\,\text{J}$$

La forza elastica compie un lavoro negativo. La mano, che tira lentamente con una forza uguale e opposta, compie il lavoro opposto, $+1{,}3\,\text{J}$.

Controllo con il trapezio: la forza passa da $300 \cdot 0{,}040 = 12\,\text{N}$ a $300 \cdot 0{,}10 = 30\,\text{N}$, la forza media è $21\,\text{N}$ e lo spostamento $0{,}060\,\text{m}$: $21\,\text{N} \cdot 0{,}060\,\text{m} = 1{,}26\,\text{J}$.
```

```ad-warning
Il quadrato della differenza non è la differenza dei quadrati
Il lavoro tra $x_1$ e $x_2$ non è $\tfrac{1}{2}\,k\,(x_2 - x_1)^2$: nell'esempio 4 si troverebbe $\tfrac{1}{2} \cdot 300 \cdot 0{,}060^2 = 0{,}54\,\text{J}$ invece di $1{,}26\,\text{J}$. Quella formula tratta la molla come se partisse da riposo, mentre era già tesa e la forza partiva da $12\,\text{N}$. Si calcolano i due termini $\tfrac{1}{2}\,k\,x^2$ separatamente, con le deformazioni in metri, e poi si sottrae.
```

## Forza variabile ed energia cinetica

Il [teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) dice che il lavoro totale delle forze su un corpo è uguale alla variazione della sua energia cinetica:

$$W_{tot} = \frac{1}{2}\,m\,v_f^2 - \frac{1}{2}\,m\,v_i^2$$

Vale anche quando le forze sono variabili. In ogni piccolo tratto la forza è praticamente costante e il teorema vale; sommando su tutti i tratti, a sinistra si ottiene il lavoro totale e a destra le variazioni di energia cinetica si sommano una dopo l'altra, lasciando solo la differenza tra il valore finale e quello iniziale. Il lavoro, però, va calcolato come area.

Questo rende il teorema molto utile con le forze variabili: l'accelerazione cambia da punto a punto, e le leggi del moto uniformemente accelerato non si possono usare, ma la velocità finale si trova lo stesso.

```ad-example
Esempio 5: la velocità del carrello
Il carrello dell'esempio 1 ha una massa di $2{,}0\,\text{kg}$ e parte da fermo; gli attriti sono trascurabili. Con quale velocità arriva a $5{,}0\,\text{m}$ dalla partenza?

La forza del grafico è l'unica che compie lavoro (peso e reazione del binario sono perpendicolari al moto), e il suo lavoro è $W = 21\,\text{J}$. Con $v_i = 0$:

$$W = \frac{1}{2}\,m\,v_f^2 \quad\Rightarrow\quad v_f = \sqrt{\frac{2\,W}{m}} = \sqrt{\frac{2 \cdot 21\,\text{J}}{2{,}0\,\text{kg}}} = 4{,}58\ldots\,\text{m/s} \approx 4{,}6\,\text{m/s}$$
```

```ad-example
Esempio 6: il respingente
Un carrello di $1{,}2\,\text{kg}$ arriva a $2{,}0\,\text{m/s}$ contro un respingente a molla, di costante elastica $k = 480\,\text{N/m}$, fissato alla fine del binario. Senza attriti, di quanto si comprime la molla prima che il carrello si fermi?

```tikz
% nome: carrello-respingente-molla
% alt: Un carrello su un binario orizzontale si muove verso destra con velocità v, verso una molla orizzontale fissata a una parete all'estremità destra del binario
\begin{tikzpicture}
\draw[thick] (0,0) -- (5.6,0);
\foreach \x in {0.15,0.3,...,5.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick] (5.6,0) -- (5.6,1.1);
\foreach \y in {0.15,0.3,...,1.1} \draw[thin] (5.6,\y) -- ++(0.15,0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (5.6,0.5) -- (3.9,0.5);
\draw[thick] (3.9,0.3) -- (3.9,0.7);
\draw[thick, fill=blue!10] (1,0.24) rectangle (2.3,0.8);
\draw[thick, fill=gray!20] (1.3,0.12) circle (0.12);
\draw[thick, fill=gray!20] (2.0,0.12) circle (0.12);
\draw[-{Stealth}, thick, blue!60!black] (2.3,0.52) -- (3.2,0.52) node[above] {$\vec{v}$};
\end{tikzpicture}
```

Durante la compressione sul carrello lavora solo la forza elastica, che parte da zero e cresce: il moto non è uniformemente decelerato. La molla parte da riposo ($x_1 = 0$) e arriva alla compressione massima $x$, quando il carrello è fermo ($v_f = 0$):

$$W_{el} = \Delta K \quad\Rightarrow\quad -\frac{1}{2}\,k\,x^2 = 0 - \frac{1}{2}\,m\,v_i^2$$

$$x = v_i\sqrt{\frac{m}{k}} = 2{,}0\,\text{m/s} \cdot \sqrt{\frac{1{,}2\,\text{kg}}{480\,\text{N/m}}} = 2{,}0\,\text{m/s} \cdot 0{,}050\,\text{s} = 0{,}10\,\text{m}$$

La molla si comprime di $10\,\text{cm}$. In quel punto la forza elastica vale $480\,\text{N/m} \cdot 0{,}10\,\text{m} = 48\,\text{N}$, il suo valore massimo; la forza media durante la frenata è la metà, $24\,\text{N}$, e infatti $24\,\text{N} \cdot 0{,}10\,\text{m} = 2{,}4\,\text{J}$, tutta l'energia cinetica che il carrello aveva.
```

```ad-warning
Con una forza variabile l'accelerazione non è costante
Nell'esempio 6 non si può calcolare la decelerazione con $a = F/m$ usando la forza massima e poi applicare le formule del moto uniformemente accelerato: la forza cambia a ogni istante. Con le forze variabili si passa dal lavoro e dall'energia cinetica.
```
