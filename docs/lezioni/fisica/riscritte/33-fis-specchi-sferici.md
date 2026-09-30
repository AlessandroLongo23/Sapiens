# Gli specchi sferici

Il dorso di un cucchiaio ti restituisce una faccia piccola e diritta, l'incavo una faccia capovolta; lo specchietto per il trucco ingrandisce, lo specchio a un incrocio di montagna mostra tutta la strada ma con le auto piccolissime. Sono tutti specchi curvi, e la loro immagine si trova con le stesse leggi della riflessione degli specchi piani, spiegate nella lezione [La riflessione e gli specchi piani](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-riflessione-e-gli-specchi-piani), applicate a una superficie che cambia direzione da un punto all'altro.

## Specchi concavi e convessi

Uno **specchio sferico** è una calotta di sfera, cioè la parte di una superficie sferica tagliata da un piano, con una delle due facce lucidata. Se la faccia che riflette è quella interna lo specchio è **concavo** (come l'incavo del cucchiaio); se è quella esterna è **convesso** (come il dorso).

Gli elementi di uno specchio sferico sono:

- il **centro di curvatura** $C$, il centro della sfera di cui lo specchio fa parte;
- il raggio di curvatura $R$, il raggio di quella sfera;
- il vertice $V$, il centro della calotta;
- l'**asse ottico**, la retta che passa per $C$ e per $V$.

Nelle figure la luce arriva sempre da sinistra, e lo specchio ha i trattini sul retro.

```tikz
% nome: specchio-concavo-convesso
% alt: A sinistra uno specchio concavo e a destra uno specchio convesso, ciascuno disegnato come un arco spesso che fa parte di una circonferenza tratteggiata grigia; su ogni asse ottico sono segnati il centro di curvatura C, che è il centro della circonferenza, il fuoco F a metà tra C e il vertice, il vertice V, e il raggio di curvatura R. Nello specchio concavo C e F sono davanti allo specchio, nel convesso dietro
% svg: specchio-concavo-convesso-232e691a.svg 375x147
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-2.3,0) -- (0.5,0);
\draw[thin, dashed, gray] (-1.600,0) circle (1.60);
\foreach \t in {-31,-27,-23,-19,-15,-11,-7,-3,1,5,9,13,17,21,25,29,33} \draw[thin] ($(-1.600,0)+(\t:1.60)$) -- ++(0.12,-0.12);
\draw[thick] (-0.289,-0.918) arc[start angle=-35, end angle=35, radius=1.60];
\draw[thin] (-1.600,0) -- ($(-1.600,0)+(25:1.60)$) node[midway, above left] {\small $R$};
\fill (-1.600,0) circle (1.5pt) node[below] {$C$};
\fill (-0.800,0) circle (1.5pt) node[below] {$F$};
\fill (0,0) circle (1.5pt) node[below right] {$V$};
\node at (-0.8,-2.0) {\small concavo};
\draw[thin, dash dot] (2.50,0) -- (5.60,0);
\draw[thin, dashed, gray] (5.000,0) circle (1.60);
\foreach \t in {149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213} \draw[thin] ($(5.000,0)+(\t:1.60)$) -- ++(0.12,-0.12);
\draw[thick] (3.689,-0.918) arc[start angle=215, end angle=145, radius=1.60];
\draw[thin] (5.000,0) -- ($(5.000,0)+(155:1.60)$) node[midway, above right] {\small $R$};
\fill (5.000,0) circle (1.5pt) node[below] {$C$};
\fill (4.200,0) circle (1.5pt) node[below] {$F$};
\fill (3.40,0) circle (1.5pt) node[below left] {$V$};
\node at (4.20,-2.0) {\small convesso};

\end{tikzpicture}
```

## Il fuoco

Un fascio di raggi paralleli all'asse ottico arriva su uno specchio concavo. Ogni raggio viene riflesso con la legge della riflessione, rispetto alla normale nel suo punto di incidenza, che per una sfera è la retta che passa per il centro $C$. Il risultato è che tutti i raggi riflessi passano per uno stesso punto dell'asse, il **fuoco** $F$, che sta a metà tra il vertice e il centro di curvatura. La distanza del fuoco dal vertice si chiama **distanza focale** $f$:

$$f = \frac{R}{2}$$

In uno specchio convesso i raggi paralleli all'asse vengono riflessi allargandosi, come se venissero tutti da un punto dietro lo specchio: il fuoco dello specchio convesso è quel punto, dietro lo specchio, sempre a distanza $R/2$ dal vertice. È un fuoco virtuale, perché la luce riflessa non ci passa: ci passano i prolungamenti dei raggi.

```tikz
% nome: fuoco-specchi-sferici
% alt: A sinistra quattro raggi paralleli all'asse colpiscono uno specchio concavo e vengono riflessi passando tutti per il fuoco F, davanti allo specchio; a destra quattro raggi paralleli colpiscono uno specchio convesso e vengono riflessi allargandosi, e i loro prolungamenti tratteggiati dietro lo specchio passano tutti per il fuoco F, che è virtuale
% svg: fuoco-specchi-sferici-d697a705.svg 360x125
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-3.2,0) -- (0.4,0);
\foreach \x/\y in {-0.098/-1.183,-0.079/-1.066,-0.063/-0.948,-0.048/-0.830,-0.035/-0.712,-0.025/-0.593,-0.016/-0.475,-0.009/-0.356,-0.004/-0.238,-0.001/-0.119,0.000/0.000,-0.001/0.119,-0.004/0.238,-0.009/0.356,-0.016/0.475,-0.025/0.593,-0.035/0.712,-0.048/0.830,-0.063/0.948,-0.079/1.066,-0.098/1.183} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.118,-1.300) arc[start angle=-10.40, end angle=10.40, radius=7.20];
\draw[raggio, orange!90!black] (-3.0,-1.00) -- (-0.070,-1.000);
\draw[raggio=0.3, orange!90!black] (-0.070,-1.000) -- (-2.600,1.239);
\draw[raggio, orange!90!black] (-3.0,-0.50) -- (-0.017,-0.500);
\draw[raggio=0.3, orange!90!black] (-0.017,-0.500) -- (-2.600,0.592);
\draw[raggio, orange!90!black] (-3.0,0.50) -- (-0.017,0.500);
\draw[raggio=0.3, orange!90!black] (-0.017,0.500) -- (-2.600,-0.592);
\draw[raggio, orange!90!black] (-3.0,1.00) -- (-0.070,1.000);
\draw[raggio=0.3, orange!90!black] (-0.070,1.000) -- (-2.600,-1.239);
\fill (-1.20,0) circle (1.5pt) node[below=2pt] {$F$};
\node[below right] at (0,0) {$V$};
\draw[thin, dash dot] (1.20,0) -- (6.20,0);
\foreach \x/\y in {4.498/1.183,4.479/1.066,4.463/0.948,4.448/0.830,4.435/0.712,4.425/0.593,4.416/0.475,4.409/0.356,4.404/0.238,4.401/0.119,4.400/0.000,4.401/-0.119,4.404/-0.238,4.409/-0.356,4.416/-0.475,4.425/-0.593,4.435/-0.712,4.448/-0.830,4.463/-0.948,4.479/-1.066,4.498/-1.183} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (4.518,-1.300) arc[start angle=190.40, end angle=169.60, radius=7.20];
\draw[raggio, orange!90!black] (1.40,-1.00) -- (4.470,-1.000);
\draw[raggio=0.4, orange!90!black] (4.470,-1.000) -- (3.792,-1.600);
\draw[thin, dashed, orange!90!black] (4.470,-1.000) -- (5.600,0.000);
\draw[raggio, orange!90!black] (1.40,-0.50) -- (4.417,-0.500);
\draw[raggio=0.4, orange!90!black] (4.417,-0.500) -- (1.816,-1.600);
\draw[thin, dashed, orange!90!black] (4.417,-0.500) -- (5.600,0.000);
\draw[raggio, orange!90!black] (1.40,0.50) -- (4.417,0.500);
\draw[raggio=0.4, orange!90!black] (4.417,0.500) -- (1.816,1.600);
\draw[thin, dashed, orange!90!black] (4.417,0.500) -- (5.600,0.000);
\draw[raggio, orange!90!black] (1.40,1.00) -- (4.470,1.000);
\draw[raggio=0.4, orange!90!black] (4.470,1.000) -- (3.792,1.600);
\draw[thin, dashed, orange!90!black] (4.470,1.000) -- (5.600,0.000);
\fill (5.60,0) circle (1.5pt) node[below=2pt] {$F$};
\node[below left] at (4.40,0) {$V$};

\end{tikzpicture}
```

```ad-note
I raggi vicini all'asse
Questo vale per i raggi vicini all'asse ottico, detti parassiali. I raggi che colpiscono lo specchio lontano dall'asse vengono riflessi un po' più vicino al vertice, e l'immagine di un punto diventa una macchiolina: è l'aberrazione sferica. Negli specchi che devono concentrare un fascio largo in un punto (antenne paraboliche, telescopi) si usa per questo la forma di un paraboloide. Nelle figure di questa lezione, come nei libri, lo specchio è disegnato meno curvo di quanto sarebbe davvero, e i raggi sono disegnati come raggi parassiali.
```

```ad-warning
Il fuoco non è il centro
Il fuoco sta a metà strada tra il vertice e il centro di curvatura: uno specchio con raggio di curvatura $40\,\text{cm}$ ha la distanza focale di $20\,\text{cm}$, non di $40\,\text{cm}$.
```

```ad-example
Esempio 1: accendere un fuoco con il Sole
Uno specchio concavo ha il raggio di curvatura di $40\,\text{cm}$. A quale distanza dallo specchio si concentra la luce del Sole?

Il Sole è così lontano che i suoi raggi arrivano paralleli: se lo specchio è puntato verso il Sole, con l'asse nella direzione dei raggi, vengono riflessi tutti nel fuoco, a

$$f = \frac{R}{2} = \frac{40}{2} = 20\,\text{cm}$$

dal vertice. Un pezzo di carta messo lì può prendere fuoco: *fuoco*, in latino *focus*, vuol dire proprio focolare.
```

## I raggi notevoli

Tra tutti i raggi che partono da un punto ce ne sono quattro di cui si sa subito dove vanno dopo la riflessione. Si chiamano **raggi notevoli** e servono a costruire le immagini. Per uno specchio concavo:

1. un raggio parallelo all'asse viene riflesso passando per il fuoco;
2. un raggio che passa per il fuoco viene riflesso parallelo all'asse (è il primo percorso al contrario);
3. un raggio che passa per il centro di curvatura arriva perpendicolare allo specchio, perché è diretto lungo la normale, e torna indietro su se stesso;
4. un raggio che arriva nel vertice viene riflesso simmetrico rispetto all'asse, che in quel punto è la normale.

```tikz
% nome: raggi-notevoli-specchio-concavo
% alt: Quattro disegni di uno specchio concavo con il fuoco F e il centro C: un raggio parallelo all'asse viene riflesso passando per il fuoco; un raggio che passa per il fuoco viene riflesso parallelo all'asse; un raggio che passa per il centro torna indietro su se stesso; un raggio che arriva nel vertice viene riflesso simmetrico rispetto all'asse
% svg: raggi-notevoli-specchio-concavo-70ea76be.svg 273x241
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-2.800,0.000) -- (0.400,0.000);
\foreach \x/\y in {-0.098/-1.081,-0.078/-0.962,-0.060/-0.843,-0.044/-0.723,-0.030/-0.603,-0.019/-0.483,-0.011/-0.362,-0.005/-0.242,-0.001/-0.121,0.000/0.000,-0.001/0.121,-0.005/0.242,-0.011/0.362,-0.019/0.483,-0.030/0.603,-0.044/0.723,-0.060/0.843,-0.078/0.962,-0.098/1.081} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.121,-1.200) arc[start angle=-11.54, end angle=11.54, radius=6.00];
\draw[raggio, orange!90!black] (-2.600,0.700) -- (-0.041,0.700);
\draw[raggio=0.3, orange!90!black] (-0.041,0.700) -- (-2.600,-1.168);
\fill (-1.000,0.000) circle (1.5pt) node[below] {$F$};
\fill (-2.000,0.000) circle (1.5pt) node[below] {$C$};
\node[below] at (-1.200,-1.350) {\small parallelo all'asse};
\draw[thin, dash dot] (1.100,0.000) -- (4.300,0.000);
\foreach \x/\y in {3.802/-1.081,3.822/-0.962,3.840/-0.843,3.856/-0.723,3.870/-0.603,3.881/-0.483,3.889/-0.362,3.895/-0.242,3.899/-0.121,3.900/0.000,3.899/0.121,3.895/0.242,3.889/0.362,3.881/0.483,3.870/0.603,3.856/0.723,3.840/0.843,3.822/0.962,3.802/1.081} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (3.779,-1.200) arc[start angle=-11.54, end angle=11.54, radius=6.00];
\draw[raggio, orange!90!black] (1.300,0.800) -- (3.880,-0.490);
\draw[raggio=0.3, orange!90!black] (3.880,-0.490) -- (1.300,-0.490);
\fill (2.900,0.000) circle (1.5pt) node[below] {$F$};
\fill (1.900,0.000) circle (1.5pt) node[below] {$C$};
\node[below] at (2.700,-1.350) {\small per il fuoco};
\draw[thin, dash dot] (-2.800,-3.200) -- (0.400,-3.200);
\foreach \x/\y in {-0.098/-4.281,-0.078/-4.162,-0.060/-4.043,-0.044/-3.923,-0.030/-3.803,-0.019/-3.683,-0.011/-3.562,-0.005/-3.442,-0.001/-3.321,0.000/-3.200,-0.001/-3.079,-0.005/-2.958,-0.011/-2.838,-0.019/-2.717,-0.030/-2.597,-0.044/-2.477,-0.060/-2.357,-0.078/-2.238,-0.098/-2.119} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.121,-4.400) arc[start angle=-11.54, end angle=11.54, radius=6.00];
\draw[raggio=0.45, orange!90!black] (-2.600,-2.960) -- (-0.051,-3.980);
\draw[raggio=0.85, orange!90!black] (-0.051,-3.980) -- (-2.600,-2.960);
\fill (-1.000,-3.200) circle (1.5pt) node[below] {$F$};
\fill (-2.000,-3.200) circle (1.5pt) node[below] {$C$};
\node[below] at (-1.200,-4.550) {\small per il centro};
\draw[thin, dash dot] (1.100,-3.200) -- (4.300,-3.200);
\foreach \x/\y in {3.802/-4.281,3.822/-4.162,3.840/-4.043,3.856/-3.923,3.870/-3.803,3.881/-3.683,3.889/-3.562,3.895/-3.442,3.899/-3.321,3.900/-3.200,3.899/-3.079,3.895/-2.958,3.889/-2.838,3.881/-2.717,3.870/-2.597,3.856/-2.477,3.840/-2.357,3.822/-2.238,3.802/-2.119} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (3.779,-4.400) arc[start angle=-11.54, end angle=11.54, radius=6.00];
\draw[raggio, orange!90!black] (1.300,-2.400) -- (3.900,-3.200);
\draw[raggio, orange!90!black] (3.900,-3.200) -- (1.300,-4.000);
\fill (2.900,-3.200) circle (1.5pt) node[below] {$F$};
\fill (1.900,-3.200) circle (1.5pt) node[below] {$C$};
\node[below] at (2.700,-4.550) {\small nel vertice};

\end{tikzpicture}
```

Per uno specchio convesso valgono le stesse regole con il fuoco e il centro dietro lo specchio: un raggio parallelo all'asse viene riflesso come se venisse dal fuoco, un raggio diretto verso il fuoco viene riflesso parallelo all'asse, un raggio diretto verso il centro torna indietro su se stesso.

## La costruzione dell'immagine

Per trovare l'immagine di un oggetto, disegnato come una freccia con la base sull'asse ottico:

1. dalla punta della freccia si tracciano due raggi notevoli, per esempio quello parallelo all'asse e quello che passa per il fuoco;
2. si disegnano i raggi riflessi con le regole dei raggi notevoli;
3. se i raggi riflessi si incontrano davanti allo specchio, il punto d'incontro è la punta dell'immagine, che è **reale**; se si allontanano, si prolungano all'indietro dietro lo specchio, e il punto d'incontro dei prolungamenti è la punta dell'immagine, che è **virtuale**;
4. la base dell'immagine sta sull'asse, sotto o sopra la punta.

Un'immagine reale si forma dove passa davvero la luce riflessa, e si può raccogliere su uno schermo; un'immagine virtuale no, come quella di uno specchio piano. Un terzo raggio notevole serve da controllo: deve passare per lo stesso punto.

### Oggetto oltre il centro

```tikz
% nome: specchio-concavo-oggetto-oltre-c
% alt: Specchio concavo con distanza focale di 1,2 centimetri; l'oggetto, una freccia nera alta 1 centimetro, è a 3,6 centimetri dal vertice, oltre il centro C. Dalla punta partono tre raggi: quello parallelo all'asse è riflesso per il fuoco, quello per il fuoco è riflesso parallelo all'asse, quello che arriva nel vertice è riflesso simmetrico; si incontrano a 1,8 centimetri dal vertice, tra F e C, dove si forma l'immagine blu, reale, capovolta, alta la metà dell'oggetto
% svg: specchio-concavo-oggetto-oltre-c-dd14ec31.svg 182x114
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-4.10,0) -- (0.60,0);
\foreach \x/\y in {-0.115/-1.280,-0.094/-1.159,-0.075/-1.038,-0.059/-0.916,-0.044/-0.795,-0.032/-0.673,-0.021/-0.551,-0.013/-0.429,-0.007/-0.306,-0.002/-0.184,-0.000/-0.061,-0.000/0.061,-0.002/0.184,-0.007/0.306,-0.013/0.429,-0.021/0.551,-0.032/0.673,-0.044/0.795,-0.059/0.916,-0.075/1.038,-0.094/1.159,-0.115/1.280} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.137,-1.400) arc[start angle=-11.21, end angle=11.21, radius=7.20];
\draw[raggio, orange!90!black] (-3.600,1.000) -- (-0.070,1.000);
\draw[raggio=0.3, orange!90!black] (-0.070,1.000) -- (-2.953,-1.500);
\draw[raggio, blue!70!black] (-3.600,1.000) -- (-0.017,-0.493);
\draw[raggio=0.3, blue!70!black] (-0.017,-0.493) -- (-4.000,-0.509);
\draw[raggio, green!50!black] (-3.600,1.000) -- (0.000,0.000);
\draw[raggio=0.3, green!50!black] (0.000,0.000) -- (-4.000,-1.111);
\draw[-{Stealth}, very thick] (-3.600,0) -- (-3.600,1.000);
\draw[-{Stealth}, very thick, blue!70!black] (-1.800,0) -- (-1.800,-0.500);
\fill (-1.200,0.000) circle (1.5pt) node[below] {$F$};
\fill (-2.400,0.000) circle (1.5pt) node[below] {$C$};
\node[below right] at (0,0) {$V$};

\end{tikzpicture}
```

L'immagine è reale, capovolta e più piccola dell'oggetto, e si forma tra il fuoco e il centro. È il caso degli oggetti lontani.

### Oggetto tra il centro e il fuoco

```tikz
% nome: specchio-concavo-oggetto-tra-c-e-f
% alt: Specchio concavo con distanza focale di 1,2 centimetri; l'oggetto è a 1,8 centimetri dal vertice, tra il centro C e il fuoco F. I tre raggi notevoli riflessi si incontrano a 3,6 centimetri dal vertice, oltre C, dove si forma l'immagine blu, reale, capovolta e alta il doppio dell'oggetto
% svg: specchio-concavo-oggetto-tra-c-e-f-33974920.svg 182x110
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-4.10,0) -- (0.60,0);
\foreach \x/\y in {-0.115/-1.280,-0.094/-1.159,-0.075/-1.038,-0.059/-0.916,-0.044/-0.795,-0.032/-0.673,-0.021/-0.551,-0.013/-0.429,-0.007/-0.306,-0.002/-0.184,-0.000/-0.061,-0.000/0.061,-0.002/0.184,-0.007/0.306,-0.013/0.429,-0.021/0.551,-0.032/0.673,-0.044/0.795,-0.059/0.916,-0.075/1.038,-0.094/1.159,-0.115/1.280} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.137,-1.400) arc[start angle=-11.21, end angle=11.21, radius=7.20];
\draw[raggio, orange!90!black] (-1.800,0.600) -- (-0.025,0.600);
\draw[raggio=0.3, orange!90!black] (-0.025,0.600) -- (-4.000,-1.401);
\draw[raggio, blue!70!black] (-1.800,0.600) -- (-0.087,-1.113);
\draw[raggio=0.3, blue!70!black] (-0.087,-1.113) -- (-4.000,-1.210);
\draw[raggio, green!50!black] (-1.800,0.600) -- (0.000,0.000);
\draw[raggio=0.3, green!50!black] (0.000,0.000) -- (-4.000,-1.333);
\draw[-{Stealth}, very thick] (-1.800,0) -- (-1.800,0.600);
\draw[-{Stealth}, very thick, blue!70!black] (-3.600,0) -- (-3.600,-1.200);
\fill (-1.200,0.000) circle (1.5pt) node[below] {$F$};
\fill (-2.400,0.000) circle (1.5pt) node[below] {$C$};
\node[below right] at (0,0) {$V$};

\end{tikzpicture}
```

L'immagine è reale, capovolta e più grande dell'oggetto, e si forma oltre il centro. Se l'oggetto sta proprio nel centro, l'immagine è reale, capovolta, grande quanto l'oggetto e si forma anch'essa nel centro. Se l'oggetto sta nel fuoco, i raggi riflessi escono paralleli e l'immagine non si forma: è così che funziona il faro di un'auto, con la lampadina nel fuoco di uno specchio.

### Oggetto tra il fuoco e lo specchio

```tikz
% nome: specchio-concavo-oggetto-tra-f-e-v
% alt: Specchio concavo con distanza focale di 1,6 centimetri; l'oggetto è a 0,8 centimetri dal vertice, tra il fuoco e lo specchio. I tre raggi riflessi si allontanano tra loro; i loro prolungamenti tratteggiati si incontrano dietro lo specchio, a 1,6 centimetri dal vertice, dove si forma l'immagine virtuale, tratteggiata, diritta e alta il doppio dell'oggetto. Il raggio che va verso lo specchio come se venisse dal fuoco ha il prolungamento tratteggiato fino a F
% svg: specchio-concavo-oggetto-tra-f-e-v-f33567b1.svg 219x114
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-3.70,0) -- (2.00,0);
\foreach \x/\y in {-0.086/-1.279,-0.070/-1.158,-0.056/-1.036,-0.044/-0.915,-0.033/-0.793,-0.024/-0.671,-0.016/-0.549,-0.010/-0.427,-0.005/-0.305,-0.002/-0.183,-0.000/-0.061,-0.000/0.061,-0.002/0.183,-0.005/0.305,-0.010/0.427,-0.016/0.549,-0.024/0.671,-0.033/0.793,-0.044/0.915,-0.056/1.036,-0.070/1.158,-0.086/1.279} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (-0.103,-1.400) arc[start angle=-8.39, end angle=8.39, radius=9.60];
\draw[raggio, orange!90!black] (-0.800,0.600) -- (-0.019,0.600);
\draw[raggio=0.3, orange!90!black] (-0.019,0.600) -- (-3.600,-0.727);
\draw[thin, dashed, orange!90!black] (-0.019,0.600) -- (1.600,1.200);
\draw[raggio, blue!70!black] (-0.800,0.600) -- (-0.069,1.148);
\draw[raggio=0.3, blue!70!black] (-0.069,1.148) -- (-3.600,1.039);
\draw[thin, dashed, blue!70!black] (-0.069,1.148) -- (1.600,1.200);
\draw[thin, dashed, blue!70!black] (-0.800,0.600) -- (-1.600,0.000);
\draw[raggio, green!50!black] (-0.800,0.600) -- (0.000,0.000);
\draw[raggio=0.3, green!50!black] (0.000,0.000) -- (-2.000,-1.500);
\draw[thin, dashed, green!50!black] (0.000,0.000) -- (1.600,1.200);
\draw[-{Stealth}, very thick] (-0.800,0) -- (-0.800,0.600);
\draw[-{Stealth}, very thick, blue!70!black, dashed] (1.600,0) -- (1.600,1.200);
\fill (-1.600,0.000) circle (1.5pt) node[below] {$F$};
\fill (-3.200,0.000) circle (1.5pt) node[below] {$C$};
\node[below right] at (0,0) {$V$};

\end{tikzpicture}
```

I raggi riflessi si allontanano: si incontrano i loro prolungamenti, dietro lo specchio. L'immagine è virtuale, diritta e più grande dell'oggetto. È quello che succede avvicinando il viso allo specchietto per il trucco.

La tabella riassume i casi dello specchio concavo; $p$ è la distanza dell'oggetto dal vertice.

| Dove sta l'oggetto | Com'è l'immagine | Dove si forma |
|---|---|---|
| oltre il centro, $p > R$ | reale, capovolta, più piccola | tra $F$ e $C$ |
| nel centro, $p = R$ | reale, capovolta, grande uguale | in $C$ |
| tra centro e fuoco, $f < p < R$ | reale, capovolta, più grande | oltre $C$ |
| nel fuoco, $p = f$ | nessuna immagine | |
| tra fuoco e vertice, $p < f$ | virtuale, diritta, più grande | dietro lo specchio |

Nella figura puoi trascinare l'oggetto lungo l'asse e passare allo specchio convesso: guarda che cosa succede all'immagine quando l'oggetto supera il fuoco.

```interattivo
% nome: specchio-sferico-immagine
% alt: Uno specchio concavo con l'asse ottico, il centro C e il fuoco F; l'oggetto, una freccia nera verso l'alto, si trascina lungo l'asse. Dalla sua punta partono il raggio parallelo all'asse e il raggio che passa per il fuoco, riflessi dallo specchio; l'immagine, blu, è reale e capovolta quando l'oggetto è oltre il fuoco, virtuale, diritta e tratteggiata dietro lo specchio quando l'oggetto è tra il fuoco e lo specchio. Un selettore passa allo specchio convesso. Sotto sono scritti p, q e l'ingrandimento G
```

### Lo specchio convesso

```tikz
% nome: specchio-convesso-immagine
% alt: Specchio convesso con il fuoco F e il centro C dietro lo specchio, a 1,5 e 3 centimetri dal vertice; l'oggetto, alto 0,9 centimetri, è a 3 centimetri dal vertice. Il raggio parallelo all'asse è riflesso come se venisse dal fuoco, quello diretto verso il fuoco è riflesso parallelo all'asse, quello nel vertice è riflesso simmetrico; i prolungamenti tratteggiati si incontrano dietro lo specchio a 1 centimetro dal vertice, tra V e F, dove si forma l'immagine virtuale, diritta, alta un terzo dell'oggetto
% svg: specchio-convesso-immagine-41f8a967.svg 265x114
\begin{tikzpicture}
\tikzset{raggio/.style={thick, postaction={decorate}, decoration={markings, mark=at position #1 with {\arrow{Stealth}}}}, raggio/.default=0.5}
\draw[thin, dash dot] (-3.50,0) -- (3.40,0);
\foreach \x/\y in {0.091/1.279,0.075/1.158,0.060/1.037,0.047/0.915,0.035/0.793,0.025/0.672,0.017/0.550,0.010/0.428,0.005/0.306,0.002/0.183,0.000/0.061,0.000/-0.061,0.002/-0.183,0.005/-0.306,0.010/-0.428,0.017/-0.550,0.025/-0.672,0.035/-0.793,0.047/-0.915,0.060/-1.037,0.075/-1.158,0.091/-1.279} \draw[thin] (\x,\y) -- ++(0.12,-0.12);
\draw[thick] (0.110,-1.400) arc[start angle=188.95, end angle=171.05, radius=9.00];
\draw[raggio, orange!90!black] (-3.000,0.900) -- (0.045,0.900);
\draw[raggio=0.3, orange!90!black] (0.045,0.900) -- (-0.910,1.500);
\draw[thin, dashed, orange!90!black] (0.045,0.900) -- (1.000,0.300);
\draw[raggio, blue!70!black] (-3.000,0.900) -- (0.005,0.299);
\draw[raggio=0.3, blue!70!black] (0.005,0.299) -- (-3.400,0.296);
\draw[thin, dashed, blue!70!black] (0.005,0.299) -- (1.000,0.300);
\draw[thin, dashed, blue!70!black] (0.005,0.299) -- (1.500,0.000);
\draw[raggio, green!50!black] (-3.000,0.900) -- (0.000,0.000);
\draw[raggio=0.3, green!50!black] (0.000,0.000) -- (-3.400,-1.020);
\draw[thin, dashed, green!50!black] (0.000,0.000) -- (1.000,0.300);
\draw[-{Stealth}, very thick] (-3.000,0) -- (-3.000,0.900);
\draw[-{Stealth}, very thick, blue!70!black, dashed] (1.000,0) -- (1.000,0.300);
\fill (1.500,0.000) circle (1.5pt) node[below] {$F$};
\fill (3.000,0.000) circle (1.5pt) node[below] {$C$};
\node[below right] at (0,0) {$V$};

\end{tikzpicture}
```

Con uno specchio convesso i raggi riflessi si allontanano sempre, e l'immagine è sempre virtuale, diritta e più piccola dell'oggetto, dietro lo specchio tra il vertice e il fuoco, dovunque sia l'oggetto.

```ad-warning
L'immagine virtuale sta dietro lo specchio
Un'immagine virtuale non si forma davanti allo specchio, dove arriva la luce, ma dietro, dove si incontrano i prolungamenti tratteggiati dei raggi. Se nella costruzione i raggi riflessi non si incontrano davanti allo specchio, non hai sbagliato: prolungali all'indietro.
```

## L'equazione dei punti coniugati

La costruzione dice dove si forma l'immagine; un'equazione lo dice con i numeri. Si chiamano

- $p$ la distanza dell'oggetto dal vertice dello specchio;
- $q$ la distanza dell'immagine dal vertice;
- $f$ la distanza focale.

Oggetto e immagine si chiamano punti coniugati, e le tre distanze sono legate dall'**equazione dei punti coniugati**

$$\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$$

L'equazione vale per tutti i casi, se si scrivono le distanze con il segno giusto. La convenzione dei segni di questa lezione, che vale anche per le lenti, è:

- $p$ è positiva: l'oggetto sta davanti allo specchio, dalla parte da cui arriva la luce;
- $q$ è positiva se l'immagine è reale (davanti allo specchio) e negativa se l'immagine è virtuale (dietro lo specchio);
- $f$ è positiva per uno specchio concavo e negativa per uno specchio convesso: $f = R/2$ per il concavo, $f = -R/2$ per il convesso.

Il rapporto tra l'altezza $h'$ dell'immagine e l'altezza $h$ dell'oggetto si chiama **ingrandimento** $G$, e si calcola anche dalle distanze:

$$G = \frac{h'}{h} = -\frac{q}{p}$$

Il segno dice il verso: $G > 0$ se l'immagine è diritta, $G < 0$ se è capovolta. Il valore senza segno dice la grandezza: più grande dell'oggetto se è maggiore di $1$, più piccola se è minore di $1$.

Per trovare $q$ si isola $\dfrac{1}{q}$ e poi si fa il reciproco:

$$\frac{1}{q} = \frac{1}{f} - \frac{1}{p}$$

```ad-example
Esempio 2: oggetto oltre il centro
Un oggetto alto $4{,}0\,\text{cm}$ si trova a $60\,\text{cm}$ da uno specchio concavo con distanza focale $20\,\text{cm}$. Dove si forma l'immagine, e com'è?

$$\frac{1}{q} = \frac{1}{20} - \frac{1}{60} = \frac{3 - 1}{60} = \frac{2}{60} = \frac{1}{30} \quad\Rightarrow\quad q = 30\,\text{cm}$$

$$G = -\frac{q}{p} = -\frac{30}{60} = -0{,}50 \qquad h' = G \cdot h = -0{,}50 \cdot 4{,}0 = -2{,}0\,\text{cm}$$

$q$ è positiva: l'immagine è reale, a $30\,\text{cm}$ davanti allo specchio, tra $F$ ($20\,\text{cm}$) e $C$ ($40\,\text{cm}$). $G$ è negativo: è capovolta, alta $2{,}0\,\text{cm}$, la metà dell'oggetto. È il caso della prima costruzione.
```

```ad-warning
Il reciproco dimenticato
L'equazione dà $\dfrac{1}{q}$, non $q$. Nell'esempio 2 il conto dà $\dfrac{1}{30}$, e $q$ è il reciproco, $30\,\text{cm}$; scrivere $q = 0{,}033\,\text{cm}$ vuol dire essersi fermati a metà. Un controllo veloce: con l'oggetto oltre il centro, $q$ deve venire tra $f$ e $2f$.
```

```ad-example
Esempio 3: oggetto tra il centro e il fuoco
Lo stesso specchio ($f = 20\,\text{cm}$), con l'oggetto a $30\,\text{cm}$. Dove si forma l'immagine?

$$\frac{1}{q} = \frac{1}{20} - \frac{1}{30} = \frac{3 - 2}{60} = \frac{1}{60} \quad\Rightarrow\quad q = 60\,\text{cm} \qquad G = -\frac{60}{30} = -2{,}0$$

L'immagine è reale, oltre il centro, capovolta e grande il doppio dell'oggetto.
```

```ad-example
Esempio 4: lo specchietto per il trucco
Lo stesso specchio, con il viso a $10\,\text{cm}$, tra il fuoco e lo specchio. Dove si forma l'immagine?

$$\frac{1}{q} = \frac{1}{20} - \frac{1}{10} = \frac{1 - 2}{20} = -\frac{1}{20} \quad\Rightarrow\quad q = -20\,\text{cm}$$

$$G = -\frac{q}{p} = -\frac{-20}{10} = +2{,}0$$

$q$ è negativa: l'immagine è virtuale, $20\,\text{cm}$ dietro lo specchio. $G$ è positivo e vale $2{,}0$: diritta e grande il doppio.
```

```ad-warning
Il segno di q per l'immagine virtuale
Il meno di $q = -20\,\text{cm}$ non va buttato via: dice che l'immagine è dietro lo specchio, cioè virtuale. E serve nel calcolo dell'ingrandimento: con $q = +20\,\text{cm}$ si troverebbe $G = -2{,}0$, un'immagine capovolta, che con l'oggetto tra il fuoco e lo specchio non esiste.
```

## Gli specchi convessi negli incroci e nei retrovisori

Per uno specchio convesso la distanza focale è negativa, e l'equazione dà sempre $q$ negativa e $G$ positivo e minore di $1$: l'immagine è virtuale, diritta e più piccola. In compenso lo specchio convesso manda verso l'occhio la luce che arriva da un angolo molto largo, e in poco spazio mostra una grande porzione di strada. Per questo si usa agli incroci con poca visibilità, nei parcheggi, all'uscita dei garage e in molti specchietti retrovisori.

```ad-example
Esempio 5: lo specchio all'incrocio
Uno specchio convesso a un incrocio ha il raggio di curvatura di $1{,}0\,\text{m}$. Un'auto si trova a $4{,}5\,\text{m}$ dallo specchio. Dove si forma la sua immagine, e di quanto è rimpicciolita?

Lo specchio è convesso, quindi $f = -\dfrac{R}{2} = -0{,}50\,\text{m}$:

$$\frac{1}{q} = \frac{1}{-0{,}50} - \frac{1}{4{,}5} = -2{,}0 - 0{,}222\ldots = -2{,}222\ldots \quad\Rightarrow\quad q = -0{,}45\,\text{m}$$

$$G = -\frac{q}{p} = -\frac{-0{,}45}{4{,}5} = +0{,}10$$

L'immagine è virtuale, $45\,\text{cm}$ dietro lo specchio, diritta e alta un decimo dell'auto.
```

Proprio perché l'immagine è così piccola, l'auto nello specchio sembra più lontana di quanto sia. Negli Stati Uniti sugli specchietti convessi è stampata l'avvertenza "gli oggetti nello specchio sono più vicini di quanto sembrano".

```ad-warning
Il segno di f per lo specchio convesso
Per uno specchio convesso $f$ va messa nell'equazione con il meno. Nell'esempio 5, con $f = +0{,}50\,\text{m}$ si troverebbe $q = +0{,}56\,\text{m}$, un'immagine reale davanti allo specchio: un risultato impossibile, perché uno specchio convesso non dà mai immagini reali di oggetti reali.
```

Gli specchi concavi, invece, sono negli specchietti per il trucco, nei fari, nei forni solari e nei grandi telescopi, di cui parla la lezione [L'occhio e gli strumenti ottici](/materiale/scuola-superiore/fisica/l-ottica-geometrica/l-occhio-e-gli-strumenti-ottici). Le stesse costruzioni e la stessa equazione, con la stessa convenzione dei segni, servono per le [lenti sottili](/materiale/scuola-superiore/fisica/l-ottica-geometrica/le-lenti-sottili).
