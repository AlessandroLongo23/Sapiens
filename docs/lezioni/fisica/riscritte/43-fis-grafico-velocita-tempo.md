# Il grafico velocità-tempo

Se ogni secondo leggi il tachimetro di un autobus e segni i valori su un grafico, con il tempo in orizzontale e la velocità in verticale, ottieni il grafico velocità-tempo del suo viaggio. Da quel grafico si legge molto più della velocità: la pendenza di ogni tratto è l'accelerazione, e l'area sotto il grafico è lo spazio percorso.

## Leggere il grafico

Nel **grafico velocità-tempo**, o grafico $v$-$t$, ogni punto dice quanto vale la velocità $v$ in un istante $t$. La velocità ha un segno, come nelle lezioni sul [moto rettilineo uniforme](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-rettilineo-uniforme-e-il-grafico-spazio-tempo) e sull'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione): un punto sopra l'asse dei tempi vuol dire che il corpo si muove nel verso dell'asse, un punto sotto che si muove nel verso opposto, un punto sull'asse che in quell'istante è fermo.

La forma del grafico dice che moto è:

- un tratto orizzontale è un moto uniforme: la velocità non cambia;
- un tratto inclinato in linea retta è un [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato): la velocità cambia sempre allo stesso ritmo;
- un tratto sull'asse dei tempi è una sosta.

```tikz
% nome: grafico-vt-autobus
% alt: Grafico velocità-tempo di un autobus tra due fermate: nel tratto A, da 0 a 6 secondi, la velocità sale in linea retta da 0 a 12 metri al secondo; nel tratto B, da 6 a 26 secondi, resta 12 metri al secondo; nel tratto C, da 26 a 30 secondi, scende in linea retta fino a zero
% svg: grafico-vt-autobus-0a0ef517.svg 259x220
% poi-interattivo: trascinare i vertici del grafico e leggere l'accelerazione di ogni tratto
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (6.4,4.4);
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,4.9) node[above] {$v$ (m/s)};
\foreach \x/\t in {1/5,2/10,3/15,4/20,5/25,6/30} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/3,2/6,3/9,4/12} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,0) -- (1.2,4) -- (5.2,4) -- (6,0);
\foreach \p in {(1.2,4),(5.2,4),(6,0)} \fill \p circle (0.06);
\node[left] at (0.75,2.5) {\small A};
\node[above] at (3.2,4) {\small B};
\node[right] at (5.65,2.3) {\small C};
\end{tikzpicture}
```

L'autobus parte dalla fermata e accelera per $6\,\text{s}$ fino a $12\,\text{m/s}$ (tratto A), viaggia a velocità costante per $20\,\text{s}$ (tratto B), poi frena e si ferma in $4\,\text{s}$ (tratto C). Il grafico sta sempre sopra l'asse: l'autobus va sempre nello stesso verso.

```ad-warning
Il grafico non è la strada
Il grafico velocità-tempo non disegna la traiettoria. Nel tratto C la linea scende, ma l'autobus non va in discesa e non torna indietro: va avanti sempre più piano. Torna indietro solo dove il grafico passa sotto l'asse dei tempi.
```

## La pendenza è l'accelerazione

L'accelerazione media tra due istanti è la variazione di velocità divisa per l'intervallo di tempo, $a = \Delta v / \Delta t$. Sul grafico $\Delta v$ è quanto sale il grafico e $\Delta t$ quanto si sposta in orizzontale: il loro rapporto è la **pendenza** del tratto, come il [coefficiente angolare](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti) di una retta.

$$a = \frac{\Delta v}{\Delta t} = \frac{v_2 - v_1}{t_2 - t_1}$$

```tikz
% nome: pendenza-grafico-vt
% alt: Grafico velocità-tempo di un'auto che parte da ferma: la velocità è una retta che sale da 0 a 20 metri al secondo in 10 secondi. Tra i punti a 2 secondi e 4 metri al secondo e a 8 secondi e 16 metri al secondo è disegnato il triangolo della pendenza, con il cateto orizzontale Delta t di 6 secondi e quello verticale Delta v di 12 metri al secondo
% svg: pendenza-grafico-vt-bfad8a6b.svg 239x249
% poi-interattivo: spostare i due punti lungo la retta e vedere che Delta v su Delta t resta 2 metri al secondo quadrato
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.4,5.4);
\draw[->] (0,0) -- (5.8,0);
\node[below] at (5.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.8) node[above] {$v$ (m/s)};
\foreach \x/\t in {1/2,2/4,3/6,4/8,5/10} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/4,2/8,3/12,4/16,5/20} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,0) -- (5.2,5.2);
\draw[thick, orange!90!black] (1,1) -- (4,1) -- (4,4);
\fill (1,1) circle (0.06);
\fill (4,4) circle (0.06);
\node[below] at (2.5,1) {\small $\Delta t = 6$ s};
\node[right] at (4,2.5) {\small $\Delta v = 12$ m/s};
\end{tikzpicture}
```

Qui $a = \dfrac{16\,\text{m/s} - 4\,\text{m/s}}{8\,\text{s} - 2\,\text{s}} = \dfrac{12\,\text{m/s}}{6\,\text{s}} = 2{,}0\,\text{m/s}^2$, e lo stesso rapporto viene su qualunque coppia di punti della retta. Un tratto che sale ha accelerazione positiva, un tratto orizzontale ha accelerazione zero, un tratto che scende ha accelerazione negativa. Quanto più il tratto è ripido, tanto più grande è l'accelerazione in modulo.

```ad-example
Esempio 1: le accelerazioni dell'autobus
Quanto vale l'accelerazione dell'autobus in ciascuno dei tre tratti?

Tratto A, da $0$ a $6\,\text{s}$: $a_A = \dfrac{12\,\text{m/s} - 0}{6\,\text{s} - 0} = 2{,}0\,\text{m/s}^2$.

Tratto B, da $6$ a $26\,\text{s}$: la velocità non cambia, $a_B = 0$.

Tratto C, da $26$ a $30\,\text{s}$: $a_C = \dfrac{0 - 12\,\text{m/s}}{30\,\text{s} - 26\,\text{s}} = -3{,}0\,\text{m/s}^2$. Il segno meno dice che l'accelerazione ha il verso opposto alla velocità: l'autobus frena.
```

```ad-warning
I valori, non i quadretti
La pendenza si calcola con i valori letti sugli assi, nelle loro unità, non contando i quadretti: sugli assi dell'autobus un quadretto vale $5\,\text{s}$ in orizzontale e $3\,\text{m/s}$ in verticale. Allo stesso modo non si misura l'angolo del tratto con il goniometro: cambiando la scala di un asse l'angolo cambia, l'accelerazione no.
```

## L'area è lo spostamento

Nel moto uniforme lo spostamento è $\Delta s = v \cdot \Delta t$, il prodotto dell'altezza del grafico per la sua larghezza: l'area del rettangolo tra il grafico e l'asse dei tempi. La stessa idea vale per ogni grafico velocità-tempo: lo **spostamento** in un intervallo di tempo è l'area compresa tra il grafico e l'asse dei tempi in quell'intervallo.

L'area si calcola con le formule della [geometria](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree), con le lunghezze lette sugli assi:

- un tratto orizzontale dà un rettangolo, $\Delta s = v \cdot \Delta t$;
- un tratto inclinato che parte da zero o arriva a zero dà un triangolo, $\Delta s = \tfrac{1}{2}\,v \cdot \Delta t$;
- un tratto inclinato tra due velocità $v_1$ e $v_2$ dà un trapezio, $\Delta s = \dfrac{v_1 + v_2}{2} \cdot \Delta t$.

Le unità tornano: una velocità per un tempo è una lunghezza, $\text{m/s} \cdot \text{s} = \text{m}$.

```tikz
% nome: area-trapezio-grafico-vt
% alt: Lo stesso grafico velocità-tempo dell'auto che parte da ferma: l'area sotto la retta tra 2 e 8 secondi è un trapezio colorato, con le basi verticali di 4 e 16 metri al secondo e l'altezza orizzontale di 6 secondi; la sua area, 60 metri, è lo spostamento dell'auto in quell'intervallo
% svg: area-trapezio-grafico-vt-a8b9120d.svg 227x249
% poi-interattivo: spostare gli estremi dell'intervallo e leggere l'area del trapezio, cioè lo spostamento
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (5.4,5.4);
\fill[blue!15] (1,0) -- (1,1) -- (4,4) -- (4,0) -- cycle;
\draw[->] (0,0) -- (5.8,0);
\node[below] at (5.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.8) node[above] {$v$ (m/s)};
\foreach \x/\t in {1/2,2/4,3/6,4/8,5/10} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/4,2/8,3/12,4/16,5/20} \node[left] at (0,\y) {\small $\t$};
\draw[dashed, thin] (1,0) -- (1,1);
\draw[dashed, thin] (4,0) -- (4,4);
\draw[thick, blue!60!black] (0,0) -- (5.2,5.2);
\node at (2.8,1.2) {$60$ m};
\end{tikzpicture}
```

```ad-example
Esempio 2: lo spostamento dall'area
Quanta strada fa l'auto del grafico qui sopra tra $2\,\text{s}$ e $8\,\text{s}$?

L'area è un trapezio con le basi $v_1 = 4\,\text{m/s}$ e $v_2 = 16\,\text{m/s}$ e l'altezza $\Delta t = 6\,\text{s}$:

$$\Delta s = \frac{v_1 + v_2}{2} \cdot \Delta t = \frac{4\,\text{m/s} + 16\,\text{m/s}}{2} \cdot 6\,\text{s} = 10\,\text{m/s} \cdot 6\,\text{s} = 60\,\text{m}$$

Controllo con la legge oraria, partendo da $2\,\text{s}$ con $v_0 = 4\,\text{m/s}$ e $a = 2{,}0\,\text{m/s}^2$: $\Delta s = 4 \cdot 6 + \tfrac{1}{2} \cdot 2{,}0 \cdot 6^2 = 24 + 36 = 60\,\text{m}$.
```

Un grafico fatto di più tratti si divide in figure semplici, una per tratto, e si sommano le aree. La **velocità media** su tutto il viaggio è lo spostamento totale diviso per il tempo totale.

```ad-example
Esempio 3: il viaggio dell'autobus
Quanta strada fa l'autobus tra le due fermate? Qual è la sua velocità media?

```tikz
% nome: aree-grafico-vt-autobus
% alt: Il grafico velocità-tempo dell'autobus diviso in tre figure colorate: un triangolo sotto il tratto A, di 36 metri; un rettangolo sotto il tratto B, di 240 metri; un triangolo sotto il tratto C, di 24 metri
% svg: aree-grafico-vt-autobus-2f05978f.svg 259x220
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,0) grid (6.4,4.4);
\fill[orange!25] (0,0) -- (1.2,4) -- (1.2,0) -- cycle;
\fill[blue!15] (1.2,0) rectangle (5.2,4);
\fill[orange!25] (5.2,0) -- (5.2,4) -- (6,0) -- cycle;
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,4.9) node[above] {$v$ (m/s)};
\foreach \x/\t in {1/5,2/10,3/15,4/20,5/25,6/30} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/3,2/6,3/9,4/12} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,0) -- (1.2,4) -- (5.2,4) -- (6,0);
\node at (0.85,1) {\small $36$};
\node at (3.2,2) {\small $240$ m};
\node at (5.5,1) {\small $24$};
\end{tikzpicture}
```

Tratto A, triangolo: $\tfrac{1}{2} \cdot 12\,\text{m/s} \cdot 6\,\text{s} = 36\,\text{m}$. Tratto B, rettangolo: $12\,\text{m/s} \cdot 20\,\text{s} = 240\,\text{m}$. Tratto C, triangolo: $\tfrac{1}{2} \cdot 12\,\text{m/s} \cdot 4\,\text{s} = 24\,\text{m}$. In tutto

$$\Delta s = 36\,\text{m} + 240\,\text{m} + 24\,\text{m} = 300\,\text{m} \qquad v_m = \frac{\Delta s}{\Delta t} = \frac{300\,\text{m}}{30\,\text{s}} = 10\,\text{m/s}$$
```

```ad-warning
La velocità media non è la media delle velocità
La velocità media dell'autobus è $10\,\text{m/s}$, non la media tra la velocità più bassa e la più alta, $(0 + 12)/2 = 6\,\text{m/s}$: l'autobus è stato a $12\,\text{m/s}$ per la maggior parte del tempo. La media aritmetica di velocità iniziale e finale dà la velocità media solo dentro un unico tratto rettilineo del grafico.
```

## Le aree con il segno

Quando il grafico passa sotto l'asse dei tempi il corpo si muove nel verso negativo, e il suo spostamento in quell'intervallo è negativo. L'area sotto l'asse si conta con il segno meno. Si distinguono allora due grandezze:

- lo **spostamento** $\Delta s$ è la somma delle aree con il loro segno, e dice di quanto è cambiata la posizione tra l'inizio e la fine;
- la **distanza percorsa** è la somma delle aree tutte prese positive, e dice quanta strada ha fatto il corpo, andata e ritorno.

Le due coincidono solo se il corpo non cambia mai verso.

```tikz
% nome: aree-con-segno-grafico-vt
% alt: Grafico velocità-tempo di una palla lanciata su per un piano inclinato: la velocità scende in linea retta da 6 metri al secondo a 0 in 3 secondi e continua fino a meno 4 metri al secondo a 5 secondi. Il triangolo sopra l'asse dei tempi, tra 0 e 3 secondi, ha area più 9 metri; quello sotto l'asse, tra 3 e 5 secondi, ha area meno 4 metri
% svg: aree-con-segno-grafico-vt-515e153f.svg 230x232
% poi-interattivo: spostare la velocità finale e vedere le due aree cambiare, con lo spostamento e la distanza percorsa scritti sotto
\begin{tikzpicture}[scale=0.85]
\draw[gray!25, very thin] (0,-2.4) grid (5.4,3.4);
\fill[blue!15] (0,0) -- (0,3) -- (3,0) -- cycle;
\fill[red!15] (3,0) -- (5,-2) -- (5,0) -- cycle;
\draw[->] (0,0) -- (5.8,0);
\node[above] at (5.7,0.05) {$t$ (s)};
\draw[->] (0,-2.6) -- (0,3.8) node[above] {$v$ (m/s)};
\foreach \x in {1,2} \node[below] at (\x,0) {\small $\x$};
\foreach \x in {4,5} \node[above] at (\x,0) {\small $\x$};
\node[above right] at (3,0) {\small $3$};
\foreach \y/\t in {-2/-4,-1/-2,1/2,2/4,3/6} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,3) -- (5,-2);
\node at (0.95,0.9) {$+9$ m};
\node at (4.5,-0.45) {\small $-4$ m};
\end{tikzpicture}
```

```ad-example
Esempio 4: la palla che torna indietro
Una palla viene lanciata su per un piano inclinato a $6{,}0\,\text{m/s}$; la sua velocità cambia come nel grafico qui sopra. Qual è lo spostamento della palla dopo $5{,}0\,\text{s}$? Quanta strada ha percorso?

Per $3{,}0\,\text{s}$ la palla sale rallentando, e si ferma: area del triangolo sopra l'asse, $\tfrac{1}{2} \cdot 6{,}0\,\text{m/s} \cdot 3{,}0\,\text{s} = 9{,}0\,\text{m}$. Poi scende, sempre più veloce: area sotto l'asse, $\tfrac{1}{2} \cdot 4{,}0\,\text{m/s} \cdot 2{,}0\,\text{s} = 4{,}0\,\text{m}$, da contare con il meno.

$$\Delta s = 9{,}0\,\text{m} - 4{,}0\,\text{m} = 5{,}0\,\text{m} \qquad \text{distanza percorsa} = 9{,}0\,\text{m} + 4{,}0\,\text{m} = 13\,\text{m}$$

Dopo $5{,}0\,\text{s}$ la palla è $5{,}0\,\text{m}$ più in su del punto di partenza, ma ha fatto $13\,\text{m}$ di strada. L'accelerazione è la pendenza, la stessa per tutto il moto: $a = (-4{,}0 - 6{,}0)/5{,}0\,\text{m/s}^2 = -2{,}0\,\text{m/s}^2$, anche nell'istante in cui la palla è ferma.
```

```ad-warning
Fermo non vuol dire senza accelerazione
Nell'istante $t = 3{,}0\,\text{s}$ la palla ha velocità zero, ma il grafico continua a scendere con la stessa pendenza: l'accelerazione è ancora $-2{,}0\,\text{m/s}^2$. Se fosse zero, la palla resterebbe ferma lì, e il grafico da quel punto in poi sarebbe orizzontale.
```

## Dal grafico velocità-tempo al grafico spazio-tempo

Il grafico velocità-tempo dice anche com'è fatto il grafico spazio-tempo, perché la velocità è la pendenza del grafico spazio-tempo. Senza fare conti:

- dove la velocità è positiva la posizione cresce e il grafico spazio-tempo sale; dove è negativa scende;
- dove la velocità è costante il grafico spazio-tempo è una retta, più ripida quanto più grande è la velocità;
- dove la velocità cresce in modulo il grafico spazio-tempo si incurva diventando sempre più ripido; dove cala si appiattisce;
- dove la velocità è zero il grafico spazio-tempo è per un istante orizzontale: è il punto più alto o più basso della curva, se lì il corpo cambia verso.

Nei tratti di moto uniformemente accelerato il grafico spazio-tempo è un arco di [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola), perché la legge oraria $s = s_0 + v_0\,t + \tfrac{1}{2}a\,t^2$ è di secondo grado nel tempo. Qui sotto il viaggio dell'autobus: una parabola che si fa sempre più ripida, una retta, una parabola che si appiattisce fino a diventare orizzontale alla fermata.

```tikz
% nome: autobus-da-vt-a-st
% alt: Due grafici uno sopra l'altro con lo stesso asse dei tempi, da 0 a 30 secondi. Sopra il grafico velocità-tempo dell'autobus: sale da 0 a 12 metri al secondo fino a 6 secondi, resta costante fino a 26 secondi, scende a zero a 30 secondi. Sotto il grafico spazio-tempo: un arco di parabola che parte orizzontale e diventa sempre più ripido fino a 36 metri a 6 secondi, poi una retta fino a 276 metri a 26 secondi, poi un arco di parabola che si appiattisce e arriva orizzontale a 300 metri a 30 secondi
% svg: autobus-da-vt-a-st-f2d1b086.svg 238x408
\begin{tikzpicture}[scale=0.75]
\draw[gray!25, very thin] (0,7.3) grid (6.4,11.7);
\draw[->] (0,7.3) -- (6.8,7.3) node[right] {$t$};
\draw[->] (0,7.3) -- (0,12.2) node[above] {$v$ (m/s)};
\foreach \y/\t in {8.3/3,9.3/6,10.3/9,11.3/12} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,7.3) -- (1.2,11.3) -- (5.2,11.3) -- (6,7.3);
\draw[gray!25, very thin] (0,0) grid (6.4,5.4);
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.9) node[above] {$s$ (m)};
\foreach \x/\t in {1/5,2/10,3/15,4/20,5/25,6/30} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/60,2/120,3/180,4/240,5/300} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black, domain=0:1.2, samples=30, smooth] plot (\x, {0.41667*\x*\x});
\draw[thick, blue!60!black] (1.2,0.6) -- (5.2,4.6);
\draw[thick, blue!60!black, domain=5.2:6, samples=30, smooth] plot (\x, {(276+12*(5*\x-26)-1.5*(5*\x-26)*(5*\x-26))/60});
\draw[dashed, thin] (1.2,0) -- (1.2,11.3);
\draw[dashed, thin] (5.2,0) -- (5.2,11.3);
\draw[dashed, thin] (6,0) -- (6,7.3);
\end{tikzpicture}
```

Quando il corpo cambia verso, il grafico spazio-tempo ha un massimo o un minimo nell'istante in cui il grafico velocità-tempo attraversa l'asse. Per la palla dell'esempio 4 la posizione sale fino a $9{,}0\,\text{m}$ a $3{,}0\,\text{s}$, dove la velocità è zero, e poi torna giù fino a $5{,}0\,\text{m}$: il grafico spazio-tempo è un arco di parabola rivolto verso il basso, con il vertice a $3{,}0\,\text{s}$.

```tikz
% nome: palla-da-vt-a-st
% alt: Due grafici uno sopra l'altro con lo stesso asse dei tempi, da 0 a 5 secondi. Sopra il grafico velocità-tempo della palla sul piano inclinato, una retta che scende da 6 a meno 4 metri al secondo e taglia l'asse dei tempi a 3 secondi. Sotto il grafico spazio-tempo, un arco di parabola con la concavità verso il basso: sale da 0 a 9 metri a 3 secondi, dove è orizzontale, e riscende a 5 metri a 5 secondi
% svg: palla-da-vt-a-st-470bae3f.svg 209x399
\begin{tikzpicture}[scale=0.75]
\draw[gray!25, very thin] (0,6.5) grid (5.4,11.4);
\draw[->] (0,8.5) -- (5.8,8.5) node[right] {$t$};
\draw[->] (0,6.3) -- (0,11.9) node[above] {$v$ (m/s)};
\foreach \y/\t in {7.5/-2,9.5/2,10.5/4,11.5/6} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black] (0,11.5) -- (5,6.5);
\draw[gray!25, very thin] (0,0) grid (5.4,4.9);
\draw[->] (0,0) -- (5.8,0);
\node[below] at (5.6,-0.45) {$t$ (s)};
\draw[->] (0,0) -- (0,5.2) node[above] {$s$ (m)};
\foreach \x in {1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1/2,2/4,3/6,4/8} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60!black, domain=0:5, samples=50, smooth] plot (\x, {(6*\x-\x*\x)/2});
\draw[dashed, thin] (3,0) -- (3,8.5);
\fill (3,4.5) circle (0.06);
\fill (3,8.5) circle (0.06);
\end{tikzpicture}
```

```ad-warning
Due grafici da non confondere
Un grafico spazio-tempo e un grafico velocità-tempo con la stessa forma raccontano moti diversi. Una retta orizzontale nel grafico spazio-tempo è un corpo fermo; nel grafico velocità-tempo è un corpo che si muove a velocità costante. Prima di leggere un grafico si guarda che cosa c'è sull'asse verticale.
```

Nella figura qui sotto il grafico velocità-tempo ha tre tratti: trascini i vertici in su e in giù, e quelli in mezzo anche di lato, e sotto leggi l'accelerazione di ogni tratto, lo spostamento totale e la distanza percorsa. Le aree sopra l'asse sono colorate in blu, quelle sotto in rosso.

```interattivo
% nome: grafico-velocita-tempo-tratti
% alt: Un grafico velocità-tempo fatto di tre tratti rettilinei, da 0 a 12 secondi, con quattro vertici da trascinare: i due estremi in verticale, i due vertici in mezzo anche in orizzontale. Le aree tra il grafico e l'asse dei tempi sono colorate in blu sopra l'asse e in rosso sotto; sotto il grafico sono scritte l'accelerazione di ciascun tratto, lo spostamento totale, somma delle aree con il segno, e la distanza percorsa, somma delle aree senza segno
```
