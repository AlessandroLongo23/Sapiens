# Punti notevoli del triangolo

Se ritagli un triangolo di cartone, c'è un solo punto in cui lo tieni in equilibrio sulla punta di una matita: è il baricentro. È uno dei quattro **punti notevoli** del triangolo, i punti in cui si incontrano tre segmenti o tre rette costruiti allo stesso modo a partire dai tre vertici o dai tre lati. Gli altri tre sono l'ortocentro, l'incentro e il circocentro, e ognuno ha una proprietà che serve nei problemi e nelle dimostrazioni.

Qui si usano i triangoli e i criteri di congruenza della lezione [Triangoli e criteri di congruenza](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/triangoli-e-criteri-di-congruenza), e perpendicolari, distanza di un punto da una retta e asse di un segmento della lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele).

## Altezze e ortocentro

L'**altezza** di un triangolo relativa a un lato è il segmento di perpendicolare condotto dal vertice opposto alla retta che contiene quel lato. Il punto in cui l'altezza incontra quella retta si chiama piede dell'altezza. Ogni triangolo ha tre altezze, una per lato: nella figura $AD$ è l'altezza relativa a $BC$, $BE$ quella relativa ad $AC$, $CF$ quella relativa ad $AB$.

```tikz
% nome: altezze-ortocentro-acutangolo
% alt: Triangolo acutangolo ABC con le tre altezze AD, BE e CF, perpendicolari ai lati opposti, che si incontrano nel punto H interno al triangolo
% svg: altezze-ortocentro-acutangolo-1d614c93.svg 232x170
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.80,3.40) -- cycle;
\draw[blue!70!black] (0.00,0.00) -- (2.65,2.50);
\draw[thin] (2.51,2.64) -- (2.37,2.50) -- (2.51,2.36);
\draw[blue!70!black] (5.00,0.00) -- (1.09,2.07);
\draw[thin] (1.00,1.89) -- (1.18,1.80) -- (1.27,1.97);
\draw[blue!70!black] (1.80,3.40) -- (1.80,0.00);
\draw[thin] (2.00,0.00) -- (2.00,0.20) -- (1.80,0.20);
\fill (1.80,1.69) circle (0.06);
\node[above right=1pt] at (1.80,1.69) {$H$};
\node at (-0.27,-0.13) {$A$};
\node at (5.28,-0.11) {$B$};
\node at (1.74,3.69) {$C$};
\node[above right=0pt] at (2.65,2.50) {$D$};
\node[above left=0pt] at (1.09,2.07) {$E$};
\node[below] at (1.80,0.00) {$F$};
\fill (2.65,2.50) circle (0.06);
\fill (1.09,2.07) circle (0.06);
\fill (1.80,0.00) circle (0.06);
\end{tikzpicture}
```

Le tre altezze, o le rette che le contengono, passano sempre per uno stesso punto, che si chiama **ortocentro** e di solito si indica con $H$. Rette che passano per uno stesso punto si dicono concorrenti. Qui la proprietà la enunciamo soltanto: la dimostrazione usa i parallelogrammi.

In un triangolo acutangolo l'ortocentro è interno, come nella figura. In un triangolo ottusangolo le altezze che partono dai due vertici degli angoli acuti cadono fuori dal triangolo, sui prolungamenti dei lati, e l'ortocentro è esterno: si trova dalla parte del vertice dell'angolo ottuso. Qui le altezze non si incontrano, si incontrano le rette che le contengono.

```tikz
% nome: ortocentro-ottusangolo
% alt: Triangolo ABC ottusangolo in C: le altezze da A e da B cadono sui prolungamenti dei lati BC e AC, e le rette delle tre altezze si incontrano nel punto H, fuori dal triangolo, oltre il vertice C
% svg: ortocentro-ottusangolo-be5a16df.svg 234x172
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.50,1.50) -- cycle;
\draw[dashed] (1.50,1.50) -- (0.45,1.95);
\draw[dashed] (1.50,1.50) -- (2.75,2.75);
\draw[blue!70!black] (0.00,0.00) -- (0.78,1.81);
\draw[blue!70!black] (5.00,0.00) -- (2.50,2.50);
\draw[blue!70!black] (1.50,1.50) -- (1.50,0.00);
\draw[blue!70!black, dashed] (1.50,1.50) -- (1.50,3.50);
\draw[blue!70!black, dashed] (0.78,1.81) -- (1.50,3.50);
\draw[blue!70!black, dashed] (2.50,2.50) -- (1.50,3.50);
\draw[thin] (0.96,1.73) -- (0.88,1.55) -- (0.70,1.63);
\draw[thin] (2.36,2.36) -- (2.50,2.22) -- (2.64,2.36);
\draw[thin] (1.70,0.00) -- (1.70,0.20) -- (1.50,0.20);
\fill (1.50,3.50) circle (0.06);
\node[above] at (1.50,3.50) {$H$};
\node at (-0.29,-0.07) {$A$};
\node at (5.30,-0.05) {$B$};
\node at (1.80,1.25) {$C$};
\fill (0.78,1.81) circle (0.06);
\fill (2.50,2.50) circle (0.06);
\fill (1.50,0.00) circle (0.06);
\node[above left=0pt] at (0.78,1.81) {$D$};
\node[right] at (2.50,2.50) {$E$};
\node[below] at (1.50,0.00) {$F$};
\end{tikzpicture}
```

```ad-warning
L'altezza arriva alla retta, non per forza al lato
In un triangolo ottusangolo l'altezza da $A$ non incontra il lato $BC$: il piede $D$ sta sul prolungamento di $BC$ oltre $C$. Disegnarla fino al lato $BC$ dà un segmento che non è perpendicolare a $BC$. Prima si prolunga il lato, poi si traccia la perpendicolare.
```

In un triangolo rettangolo i due cateti sono uno l'altezza dell'altro: se l'angolo retto è in $C$, l'altezza da $A$ relativa a $BC$ è proprio il cateto $AC$, e l'altezza da $B$ è il cateto $BC$. Le due altezze si incontrano in $C$, quindi l'ortocentro è il vertice dell'angolo retto.

```ad-example
Esempio 1: l'angolo tra due altezze
Nel triangolo acutangolo $ABC$ gli angoli sono $\hat{A} = 70^\circ$, $\hat{B} = 50^\circ$, $\hat{C} = 60^\circ$. Le altezze $BE$ e $CF$ si incontrano nell'ortocentro $H$. Quanto misura $\widehat{BHC}$?

```tikz
% nome: esempio-angolo-bhc
% alt: Triangolo acutangolo ABC con le altezze BE e CF, che si incontrano nell'ortocentro H; BEC e CFB sono triangoli rettangoli
% svg: esempio-angolo-bhc-36da908e.svg 232x171
\begin{tikzpicture}
\draw[fill=blue!8, thick] (2.96,3.53) -- (0.00,0.00) -- (5.00,0.00) -- cycle;
\draw[blue!70!black] (0.00,0.00) -- (3.75,2.17);
\draw[blue!70!black] (5.00,0.00) -- (2.07,2.46);
\draw[thin] (3.85,1.99) -- (3.68,1.89) -- (3.58,2.07);
\draw[thin] (1.94,2.31) -- (2.09,2.18) -- (2.22,2.33);
\fill (3.75,2.17) circle (0.06);
\fill (2.07,2.46) circle (0.06);
\node[above right=0pt] at (3.75,2.17) {$E$};
\node[above left=0pt] at (2.07,2.46) {$F$};
\fill (2.96,1.71) circle (0.06);
\node[above=2pt] at (2.96,1.71) {$H$};
\node at (3.00,3.83) {$A$};
\node at (-0.27,-0.12) {$B$};
\node at (5.27,-0.13) {$C$};
\end{tikzpicture}
```

Il triangolo $BEC$ è rettangolo in $E$, e gli angoli acuti di un triangolo rettangolo sommano $90^\circ$:

$$\widehat{EBC} = 90^\circ - 60^\circ = 30^\circ$$

Allo stesso modo il triangolo $CFB$ è rettangolo in $F$:

$$\widehat{FCB} = 90^\circ - 50^\circ = 40^\circ$$

Nel triangolo $BHC$ gli angoli in $B$ e in $C$ sono proprio questi due, quindi

$$
\begin{aligned}
\widehat{BHC} &= 180^\circ - 30^\circ - 40^\circ \\
&= 110^\circ
\end{aligned}
$$

Il risultato è $180^\circ - \hat{A}$, e vale in ogni triangolo acutangolo, perché $\widehat{BHC} = \hat{B} + \hat{C}$.
```

## Mediane e baricentro

La **mediana** relativa a un lato è il segmento che unisce il punto medio di quel lato al vertice opposto. Nella figura $M$, $N$ ed $L$ sono i punti medi dei lati, e $AM$, $BN$, $CL$ sono le tre mediane.

```tikz
% nome: mediane-baricentro
% alt: Triangolo ABC con le tre mediane AM, BN e CL, che vanno dai vertici ai punti medi dei lati opposti e si incontrano nel baricentro G
% svg: mediane-baricentro-8d48da0c.svg 232x170
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.80,3.40) -- cycle;
\draw[blue!70!black] (0.00,0.00) -- (3.40,1.70);
\draw[blue!70!black] (5.00,0.00) -- (0.90,1.70);
\draw[blue!70!black] (1.80,3.40) -- (2.50,0.00);
\draw[thin] (4.11,0.76) -- (4.29,0.94);
\draw[thin] (2.51,2.46) -- (2.69,2.64);
\draw[thin] (1.48,2.52) -- (1.25,2.64);
\draw[thin] (1.45,2.46) -- (1.22,2.58);
\draw[thin] (0.58,0.82) -- (0.35,0.94);
\draw[thin] (0.55,0.76) -- (0.32,0.88);
\draw[thin] (1.18,0.13) -- (1.18,-0.13);
\draw[thin] (1.25,0.13) -- (1.25,-0.13);
\draw[thin] (1.32,0.13) -- (1.32,-0.13);
\draw[thin] (3.68,0.13) -- (3.68,-0.13);
\draw[thin] (3.75,0.13) -- (3.75,-0.13);
\draw[thin] (3.82,0.13) -- (3.82,-0.13);
\fill (3.40,1.70) circle (0.06);
\fill (0.90,1.70) circle (0.06);
\fill (2.50,0.00) circle (0.06);
\fill (2.27,1.13) circle (0.06);
\node[above right=0pt] at (3.40,1.70) {$M$};
\node[above left=0pt] at (0.90,1.70) {$N$};
\node[below] at (2.50,0.00) {$L$};
\node[below right=1pt] at (2.27,1.13) {$G$};
\node at (-0.27,-0.13) {$A$};
\node at (5.28,-0.11) {$B$};
\node at (1.74,3.69) {$C$};
\end{tikzpicture}
```

Le tre mediane si incontrano sempre in un punto, il **baricentro**, che si indica con $G$. Il baricentro è interno in ogni triangolo, perché ogni mediana sta tutta dentro il triangolo.

Il baricentro divide ogni mediana in due parti, e la parte che contiene il vertice è il doppio dell'altra:

$$AG = 2 \cdot GM$$

Quindi $AG$ è $\dfrac{2}{3}$ della mediana e $GM$ è $\dfrac{1}{3}$. Lo stesso vale per le altre due mediane: $BG = 2 \cdot GN$ e $CG = 2 \cdot GL$. Anche questa proprietà la enunciamo soltanto: la dimostrazione usa il [segmento dei punti medi](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete) e la [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine).

```ad-warning
La mediana non è né bisettrice né altezza
La mediana arriva nel punto medio del lato opposto, ma in generale non è perpendicolare a quel lato e non divide a metà l'angolo da cui parte. Nella figura $AM$ non forma un angolo retto con $BC$. Mediana, altezza e bisettrice coincidono solo in casi particolari, come il triangolo isoscele (più avanti).
```

```ad-example
Esempio 2: le parti di una mediana
La mediana $AM$ di un triangolo è lunga $12$ cm. Quanto sono lunghi $AG$ e $GM$?

$GM$ è un terzo della mediana e $AG$ i due terzi:

$$
\begin{gathered}
GM = 12 : 3 = 4 \text{ cm} \\
AG = 2 \cdot 4 = 8 \text{ cm}
\end{gathered}
$$

Al contrario: se $GM = 3{,}5$ cm, allora $AG = 2 \cdot 3{,}5 = 7$ cm e la mediana è $AM = 7 + 3{,}5 = 10{,}5$ cm.
```

```ad-warning
Il rapporto al contrario
La parte doppia è quella verso il vertice, non quella verso il lato. Con $AM = 12$ cm la risposta $AG = 4$ cm e $GM = 8$ cm è sbagliata; e il baricentro non è il punto medio della mediana ($6$ cm e $6$ cm).
```

## Asse e bisettrice come luoghi di punti

Per il circocentro e per l'incentro servono due proprietà dell'asse di un segmento e della bisettrice di un angolo. Un **luogo geometrico** è l'insieme di tutti e soli i punti del piano che hanno una certa proprietà: tutti, cioè ogni punto con la proprietà ci sta dentro, e soli, cioè nessun altro punto ci sta.

### L'asse di un segmento

L'asse di un segmento $AB$ è la retta perpendicolare ad $AB$ nel suo punto medio $M$. L'asse è il luogo dei punti equidistanti dagli estremi del segmento: un punto $P$ sta sull'asse di $AB$ se e solo se $PA \cong PB$.

```tikz
% nome: asse-segmento-equidistanza
% alt: Segmento AB con il punto medio M e l'asse a, perpendicolare ad AB in M; un punto P dell'asse è unito ad A e a B, e i segmenti PA e PB sono segnati come congruenti
% svg: asse-segmento-equidistanza-71837b41.svg 194x154
\begin{tikzpicture}
\draw[thick] (0.00,0.00) -- (4.00,0.00);
\draw[blue!70!black] (2,-0.7) -- (2,2.9) node[above] {$a$};
\draw[dashed] (0.00,0.00) -- (2.00,2.30) -- (4.00,0.00);
\draw[thin] (2.20,0.00) -- (2.20,0.20) -- (2.00,0.20);
\draw[thin] (1.00,0.13) -- (1.00,-0.13);
\draw[thin] (3.00,0.13) -- (3.00,-0.13);
\draw[thin] (0.88,1.21) -- (1.08,1.04);
\draw[thin] (0.92,1.26) -- (1.12,1.09);
\draw[thin] (3.08,1.26) -- (2.88,1.09);
\draw[thin] (3.12,1.21) -- (2.92,1.04);
\fill (0.00,0.00) circle (0.06);
\fill (4.00,0.00) circle (0.06);
\fill (2.00,0.00) circle (0.06);
\fill (2.00,2.30) circle (0.06);
\node[left] at (0.00,0.00) {$A$};
\node[right] at (4.00,0.00) {$B$};
\node[below right] at (2.00,0.00) {$M$};
\node[right=2pt] at (2.00,2.30) {$P$};
\end{tikzpicture}
```

Le due parti del "se e solo se" si dimostrano una alla volta.

Se $P$ sta sull'asse, allora $PA \cong PB$. Se $P$ coincide con $M$ è vero, perché $M$ è il punto medio. Altrimenti:

1. $AM \cong MB$, perché $M$ è il punto medio di $AB$.
2. $PM$ è in comune ai triangoli $PMA$ e $PMB$.
3. $\widehat{PMA} \cong \widehat{PMB}$, perché sono tutti e due retti.
4. $PMA \cong PMB$ per il primo criterio di congruenza (due lati e l'angolo compreso), quindi $PA \cong PB$.

Se $PA \cong PB$, allora $P$ sta sull'asse. Se $P$ sta sulla retta $AB$, l'unico punto con $PA \cong PB$ è $M$. Altrimenti:

1. I triangoli $PMA$ e $PMB$ hanno $PA \cong PB$ per ipotesi, $AM \cong MB$ e $PM$ in comune.
2. Sono congruenti per il terzo criterio (tre lati), quindi $\widehat{PMA} \cong \widehat{PMB}$.
3. I due angoli sono adiacenti e congruenti, quindi ognuno misura $180^\circ : 2 = 90^\circ$.
4. La retta $PM$ è perpendicolare ad $AB$ in $M$, quindi è l'asse, e $P$ ci sta sopra.

### La bisettrice di un angolo

La [bisettrice](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/enti-geometrici-segmenti-e-angoli) di un angolo è la semiretta che parte dal vertice e divide l'angolo in due angoli congruenti. La bisettrice è il luogo dei punti dell'angolo equidistanti dai due lati: la distanza di un punto da un lato è la lunghezza del segmento di perpendicolare condotto dal punto alla retta del lato.

```tikz
% nome: bisettrice-angolo-equidistanza
% alt: Angolo di vertice O con la bisettrice b; da un punto P della bisettrice partono i segmenti di perpendicolare PH e PK ai due lati, segnati come congruenti
% svg: bisettrice-angolo-equidistanza-96182212.svg 197x146
\begin{tikzpicture}
\draw[thick] (2.76,3.29) -- (0,0) -- (4.6,0);
\draw[blue!70!black] (0,0) -- (4.17,1.94) node[right] {$b$};
\draw[dashed] (3.17,0.00) -- (3.17,1.48) -- (2.04,2.43);
\draw[thin] (2.97,0.00) -- (2.97,0.20) -- (3.17,0.20);
\draw[thin] (1.91,2.28) -- (2.06,2.15) -- (2.19,2.30);
\draw[thin] (0.75,0.00) arc (0.0:25.0:0.75);
\draw[thin] (0.68,0.32) arc (25.0:50.0:0.75);
\draw[thin] (3.04,0.70) -- (3.30,0.70);
\draw[thin] (3.04,0.77) -- (3.30,0.77);
\draw[thin] (2.55,1.83) -- (2.72,2.03);
\draw[thin] (2.50,1.88) -- (2.66,2.08);
\fill (3.17,1.48) circle (0.06);
\fill (3.17,0.00) circle (0.06);
\fill (2.04,2.43) circle (0.06);
\node[left] at (0.00,0.00) {$O$};
\node[right=2pt] at (3.17,1.48) {$P$};
\node[below] at (3.17,0.00) {$H$};
\node[above left=0pt] at (2.04,2.43) {$K$};
\end{tikzpicture}
```

Se $P$ sta sulla bisettrice, allora $PH \cong PK$:

1. I triangoli $OHP$ e $OKP$ hanno il lato $OP$ in comune.
2. $\widehat{HOP} \cong \widehat{KOP}$, perché $OP$ è la bisettrice.
3. $\widehat{OHP} \cong \widehat{OKP}$, perché sono tutti e due retti.
4. La somma degli angoli di un triangolo è $180^\circ$, quindi anche i terzi angoli sono congruenti: $\widehat{OPH} \cong \widehat{OPK}$.
5. $OHP \cong OKP$ per il secondo criterio (un lato e i due angoli adiacenti a quel lato), quindi $PH \cong PK$.

Vale anche il contrario: un punto interno all'angolo che ha la stessa distanza dai due lati sta sulla bisettrice. Questa parte non la dimostriamo, perché richiede un criterio di congruenza dei triangoli rettangoli, ma la useremo per l'incentro.

## Assi e circocentro

I tre assi dei lati di un triangolo si incontrano in un punto, il **circocentro**, che si indica con $O$. Il circocentro ha la stessa distanza dai tre vertici: $OA \cong OB \cong OC$.

```tikz
% nome: assi-circocentro
% alt: Triangolo acutangolo ABC con gli assi dei tre lati, perpendicolari ai lati nei punti medi, che si incontrano nel circocentro O; la circonferenza di centro O passa per i tre vertici
% svg: assi-circocentro-7d09b5e8.svg 232x220
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.80,3.40) -- cycle;
\draw[orange!80!black] (2.50,0.85) circle (2.641);
\draw[blue!70!black] (2.50,-0.50) -- (2.50,1.45);
\draw[thin] (2.70,0.00) -- (2.70,0.20) -- (2.50,0.20);
\draw[thin] (1.25,0.13) -- (1.25,-0.13);
\draw[thin] (3.75,0.13) -- (3.75,-0.13);
\draw[blue!70!black] (3.76,2.04) -- (2.06,0.44);
\draw[thin] (3.26,1.85) -- (3.12,1.71) -- (3.25,1.56);
\draw[thin] (4.11,0.76) -- (4.29,0.94);
\draw[thin] (2.51,2.46) -- (2.69,2.64);
\draw[blue!70!black] (0.46,1.93) -- (3.03,0.57);
\draw[thin] (0.81,1.52) -- (0.98,1.43) -- (1.08,1.61);
\draw[thin] (1.46,2.49) -- (1.24,2.61);
\draw[thin] (0.56,0.79) -- (0.34,0.91);
\fill (2.50,0.85) circle (0.06);
\node[right=3pt] at (2.50,0.85) {$O$};
\node at (-0.27,-0.13) {$A$};
\node at (5.28,-0.11) {$B$};
\node at (1.74,3.69) {$C$};
\end{tikzpicture}
```

Il perché viene dall'asse come luogo. Chiama $O$ il punto in cui si incontrano l'asse di $AB$ e l'asse di $BC$ (si incontrano, perché $AB$ e $BC$ non sono paralleli).

1. $O$ sta sull'asse di $AB$, quindi $OA \cong OB$.
2. $O$ sta sull'asse di $BC$, quindi $OB \cong OC$.
3. Dai due passi precedenti $OA \cong OC$.
4. Un punto equidistante da $A$ e da $C$ sta sull'asse di $AC$: anche il terzo asse passa per $O$.

La circonferenza di centro $O$ e raggio $OA$ passa quindi per tutti e tre i vertici. Si chiama **circonferenza circoscritta** al triangolo, e il suo raggio è la distanza del circocentro dai vertici. Quali altri poligoni hanno una circonferenza circoscritta lo dice la lezione [Poligoni inscritti e circoscritti](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti).

```ad-warning
L'asse non passa per il vertice opposto
L'asse di un lato parte dal punto medio del lato ed è perpendicolare al lato, ma in generale non passa per il vertice opposto. Il segmento che unisce il punto medio al vertice opposto è la mediana, e il segmento perpendicolare che parte dal vertice è l'altezza. Asse, mediana e altezza relativi a uno stesso lato coincidono solo nel triangolo isoscele, per la base.
```

## Bisettrici e incentro

La **bisettrice** di un triangolo relativa a un angolo è il segmento della bisettrice di quell'angolo che va dal vertice al lato opposto. Le tre bisettrici si incontrano sempre in un punto interno al triangolo, l'**incentro**, che si indica con $I$. L'incentro ha la stessa distanza dai tre lati.

```tikz
% nome: bisettrici-incentro
% alt: Triangolo ABC con le tre bisettrici degli angoli, che si incontrano nell'incentro I; la circonferenza di centro I tocca i tre lati, e i raggi tratteggiati sono perpendicolari ai lati
% svg: bisettrici-incentro-4e689b59.svg 232x166
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.80,3.40) -- cycle;
\draw[orange!80!black] (2.09,1.26) circle (1.258);
\draw[blue!70!black] (0.00,0.00) -- (3.19,1.92);
\draw[thin] (0.55,0.00) arc (0.0:31.1:0.55);
\draw[thin] (0.47,0.28) arc (31.1:62.1:0.55);
\draw[blue!70!black] (5.00,0.00) -- (0.93,1.76);
\draw[thin] (4.62,0.40) arc (133.3:156.6:0.55);
\draw[thin] (4.57,0.46) arc (133.3:156.6:0.63);
\draw[thin] (4.50,0.22) arc (156.6:180.0:0.55);
\draw[thin] (4.42,0.25) arc (156.6:180.0:0.63);
\draw[blue!70!black] (1.80,3.40) -- (2.26,-0.00);
\draw[thin] (1.59,3.00) arc (-117.9:-82.3:0.45);
\draw[thin] (1.55,2.93) arc (-117.9:-82.3:0.53);
\draw[thin] (1.51,2.86) arc (-117.9:-82.3:0.61);
\draw[thin] (1.86,2.95) arc (-82.3:-46.7:0.45);
\draw[thin] (1.87,2.87) arc (-82.3:-46.7:0.53);
\draw[thin] (1.88,2.80) arc (-82.3:-46.7:0.61);
\draw[dashed] (2.09,1.26) -- (2.09,0.00);
\draw[dashed] (2.09,1.26) -- (3.00,2.12);
\draw[dashed] (2.09,1.26) -- (0.98,1.85);
\fill (2.09,1.26) circle (0.06);
\node[left=3pt] at (2.09,1.26) {$I$};
\node at (-0.27,-0.13) {$A$};
\node at (5.28,-0.11) {$B$};
\node at (1.74,3.69) {$C$};
\end{tikzpicture}
```

Il ragionamento è lo stesso degli assi, con la bisettrice come luogo. Chiama $I$ il punto in cui si incontrano le bisettrici degli angoli $\hat{A}$ e $\hat{B}$.

1. $I$ sta sulla bisettrice di $\hat{A}$, quindi ha la stessa distanza dai lati $AB$ e $AC$.
2. $I$ sta sulla bisettrice di $\hat{B}$, quindi ha la stessa distanza dai lati $AB$ e $BC$.
3. Allora $I$ ha la stessa distanza da $AC$ e da $BC$, e per la proprietà inversa sta sulla bisettrice di $\hat{C}$.

La circonferenza di centro $I$ che ha come raggio la distanza di $I$ dai lati tocca ognuno dei tre lati in un solo punto, il piede della perpendicolare da $I$ (i raggi tratteggiati nella figura). Si chiama **circonferenza inscritta** nel triangolo.

```ad-warning
Incentro e circocentro
L'incentro è equidistante dai lati ed è il centro della circonferenza inscritta, che sta dentro il triangolo. Il circocentro è equidistante dai vertici ed è il centro della circonferenza circoscritta, che passa per i vertici. Per non scambiarli: "in" come dentro, "circo" come intorno.
```

```ad-example
Esempio 3: l'angolo tra due bisettrici
Nel triangolo $ABC$ gli angoli sono $\hat{A} = 70^\circ$, $\hat{B} = 50^\circ$, $\hat{C} = 60^\circ$. Le bisettrici degli angoli $\hat{B}$ e $\hat{C}$ si incontrano nell'incentro $I$. Quanto misura $\widehat{BIC}$?

```tikz
% nome: esempio-angolo-bic
% alt: Triangolo ABC con l'angolo in B di 50 gradi e l'angolo in C di 60 gradi; le bisettrici da B e da C si incontrano nell'incentro I e formano con BC angoli di 25 e 30 gradi
% svg: esempio-angolo-bic-4f334d5e.svg 232x171
\begin{tikzpicture}
\draw[fill=blue!8, thick] (2.96,3.53) -- (0.00,0.00) -- (5.00,0.00) -- cycle;
\draw[blue!70!black] (0.00,0.00) -- (2.77,1.29);
\draw[blue!70!black] (5.00,0.00) -- (2.77,1.29);
\draw[blue!70!black, dashed] (2.77,1.29) -- (3.94,1.84);
\draw[blue!70!black, dashed] (2.77,1.29) -- (1.63,1.94);
\draw[thin] (0.70,0.00) arc (0.0:25.0:0.70);
\draw[thin] (0.63,0.30) arc (25.0:50.0:0.70);
\draw[thin] (4.39,0.35) arc (150.0:180.0:0.70);
\draw[thin] (4.33,0.38) arc (150.0:180.0:0.77);
\draw[thin] (4.65,0.61) arc (120.0:150.0:0.70);
\draw[thin] (4.62,0.67) arc (120.0:150.0:0.77);
\node[font=\small] at (0.93,0.21) {$25^\circ$};
\node[font=\small] at (3.99,0.27) {$30^\circ$};
\fill (2.77,1.29) circle (0.06);
\node[above=2pt] at (2.77,1.29) {$I$};
\node at (3.00,3.83) {$A$};
\node at (-0.27,-0.12) {$B$};
\node at (5.27,-0.13) {$C$};
\end{tikzpicture}
```

Le bisettrici dividono a metà gli angoli:

$$
\begin{gathered}
\widehat{IBC} = 50^\circ : 2 = 25^\circ \\
\widehat{ICB} = 60^\circ : 2 = 30^\circ
\end{gathered}
$$

Nel triangolo $BIC$:

$$
\begin{aligned}
\widehat{BIC} &= 180^\circ - 25^\circ - 30^\circ \\
&= 125^\circ
\end{aligned}
$$

In ogni triangolo il risultato è $90^\circ + \dfrac{\hat{A}}{2}$: qui $90^\circ + 35^\circ = 125^\circ$.
```

## Dove cadono i punti notevoli

Baricentro e incentro sono sempre interni al triangolo. Ortocentro e circocentro dipendono dal tipo di triangolo:

| Punto | Acutangolo | Rettangolo | Ottusangolo |
|---|---|---|---|
| Baricentro $G$ | interno | interno | interno |
| Incentro $I$ | interno | interno | interno |
| Ortocentro $H$ | interno | nel vertice dell'angolo retto | esterno, dalla parte dell'angolo ottuso |
| Circocentro $O$ | interno | nel punto medio dell'ipotenusa | esterno, oltre il lato opposto all'angolo ottuso |

Nel triangolo rettangolo il circocentro è il punto medio dell'ipotenusa, e la circonferenza circoscritta ha l'ipotenusa come diametro. È l'angolo inscritto in una semicirconferenza della lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio). Di conseguenza la mediana relativa all'ipotenusa è lunga metà dell'ipotenusa, perché va dal circocentro a un vertice ed è un raggio. La dimostrazione usa le diagonali del rettangolo, nella lezione [Parallelogrammi e trapezi](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/parallelogrammi-e-trapezi).

```tikz
% nome: triangolo-rettangolo-ortocentro-circocentro
% alt: Triangolo ABC rettangolo in C: l'ortocentro H coincide con il vertice C, il circocentro O è il punto medio dell'ipotenusa AB e la circonferenza circoscritta ha AB come diametro
% svg: triangolo-rettangolo-ortocentro-circocentro-251f739d.svg 234x210
\begin{tikzpicture}
\draw[orange!80!black] (2.50,0.00) circle (2.500);
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.80,2.40) -- cycle;
\draw[thin] (1.65,2.20) -- (1.85,2.05) -- (2.00,2.25);
\draw[blue!70!black] (1.80,2.40) -- (1.80,0.00);
\draw[thin] (2.00,0.00) -- (2.00,0.20) -- (1.80,0.20);
\draw[dashed] (1.80,2.40) -- (2.50,0.00);
\draw[thin] (1.25,0.13) -- (1.25,-0.13);
\draw[thin] (3.75,0.13) -- (3.75,-0.13);
\draw[thin] (2.27,1.24) -- (2.03,1.16);
\fill (2.50,0.00) circle (0.06);
\node[below] at (2.50,0.00) {$O$};
\fill (1.80,2.40) circle (0.06);
\node[above=2pt] at (1.80,2.40) {$C = H$};
\node at (-0.30,0.00) {$A$};
\node at (5.30,0.00) {$B$};
\end{tikzpicture}
```

Nel triangolo ottusangolo gli assi si incontrano fuori, dall'altra parte del lato più lungo rispetto al vertice dell'angolo ottuso.

```tikz
% nome: circocentro-ottusangolo
% alt: Triangolo ABC ottusangolo in C: gli assi dei lati si incontrano nel circocentro O, che sta fuori dal triangolo, dall'altra parte del lato AB rispetto a C, e la circonferenza di centro O passa per i tre vertici
% svg: circocentro-ottusangolo-5345e748.svg 234x218
\begin{tikzpicture}
\draw[orange!80!black] (2.50,-1.00) circle (2.693);
\draw[fill=blue!8, thick] (0.00,0.00) -- (5.00,0.00) -- (1.50,1.50) -- cycle;
\draw[blue!70!black] (2.50,0.40) -- (2.50,-1.40);
\draw[thin] (2.67,0.00) -- (2.67,-0.17) -- (2.50,-0.17);
\draw[blue!70!black] (3.41,1.12) -- (2.34,-1.37);
\draw[thin] (3.09,0.82) -- (3.03,0.66) -- (3.18,0.59);
\draw[blue!70!black] (0.47,1.03) -- (2.78,-1.28);
\draw[thin] (0.63,0.63) -- (0.75,0.51) -- (0.87,0.63);
\fill (2.50,-1.00) circle (0.06);
\node[right=1pt] at (2.50,-1.00) {$O$};
\node at (-0.29,-0.07) {$A$};
\node at (5.30,-0.05) {$B$};
\node at (1.33,1.75) {$C$};
\end{tikzpicture}
```

La tabella si può percorrere con un solo triangolo: trascina il vertice $C$ e guarda dove vanno i quattro punti. Quando l'angolo in $C$ diventa retto, $H$ si ferma su $C$ e $O$ sul punto medio di $AB$; quando diventa ottuso, escono tutti e due.

```interattivo
% nome: punti-notevoli-posizione
% alt: Il triangolo ABC con il lato AB fisso e il vertice C da trascinare; si possono mostrare altezze, assi, mediane e bisettrici, con ortocentro H, circocentro O e circonferenza circoscritta, baricentro G, incentro I e circonferenza inscritta; la didascalia dice se il triangolo è acutangolo, rettangolo o ottusangolo e dove cadono H e O: interni, su vertice dell'angolo retto e punto medio dell'ipotenusa, oppure esterni; G e I restano sempre interni
```

```ad-example
Esempio 4: i punti notevoli di un triangolo rettangolo
Il triangolo $ABC$ è rettangolo in $C$ e l'ipotenusa $AB$ è lunga $10$ cm. Dove sono l'ortocentro e il circocentro? Quanto è lunga la mediana $CO$ relativa all'ipotenusa, e a che distanza da $C$ si trova il baricentro?

L'ortocentro è il vertice $C$ dell'angolo retto. Il circocentro è il punto medio $O$ dell'ipotenusa, quindi il raggio della circonferenza circoscritta è

$$OA = 10 : 2 = 5 \text{ cm}$$

La mediana relativa all'ipotenusa va da $C$ al punto medio $O$, che è il circocentro: è un raggio, quindi $CO = 5$ cm. Il baricentro sta sulla mediana, a due terzi dal vertice:

$$CG = \frac{2}{3} \cdot 5 = \frac{10}{3} \text{ cm}$$

cioè circa $3{,}33$ cm.
```

```ad-example
Esempio 5: un pozzo alla stessa distanza da tre case
Tre case sono nei punti $A$, $B$, $C$. Dove si scava un pozzo che abbia la stessa distanza dalle tre case?

Il pozzo deve essere equidistante da $A$ e da $B$, quindi sull'asse di $AB$, ed equidistante da $B$ e da $C$, quindi sull'asse di $BC$. Il punto è il circocentro del triangolo $ABC$: si disegnano due assi e si prende il punto in cui si incontrano (il terzo passa di lì in ogni caso).

Il caso scomodo è quando l'angolo in una delle case è ottuso, come in $C$ nella figura precedente: il pozzo cade fuori dal triangolo delle tre case, dall'altra parte del lato $AB$. È comunque la risposta giusta. Se invece si cercasse il punto dentro il triangolo formato da tre strade dritte che abbia la stessa distanza dalle tre strade, la risposta sarebbe l'incentro.
```

## Triangolo isoscele ed equilatero

Nel triangolo isoscele la bisettrice dell'angolo al vertice è anche mediana e altezza relative alla base.

```tikz
% nome: isoscele-bisettrice-altezza-mediana
% alt: Triangolo isoscele ABC con AB congruente ad AC; la bisettrice AH dell'angolo in A divide la base BC in due parti congruenti ed è perpendicolare a BC
% svg: isoscele-bisettrice-altezza-mediana-f57beb91.svg 194x161
\begin{tikzpicture}
\draw[fill=blue!8, thick] (0.00,0.00) -- (4.00,0.00) -- (2.00,3.20) -- cycle;
\draw[blue!70!black] (2.00,3.20) -- (2.00,0.00);
\draw[thin] (1.11,1.53) -- (0.89,1.67);
\draw[thin] (3.11,1.67) -- (2.89,1.53);
\draw[thin] (0.96,0.13) -- (0.96,-0.13);
\draw[thin] (1.03,0.13) -- (1.03,-0.13);
\draw[thin] (2.96,0.13) -- (2.96,-0.13);
\draw[thin] (3.04,0.13) -- (3.04,-0.13);
\draw[thin] (1.68,2.69) arc (-122.0:-90.0:0.60);
\draw[thin] (2.00,2.60) arc (-90.0:-58.0:0.60);
\draw[thin] (2.20,0.00) -- (2.20,0.20) -- (2.00,0.20);
\fill (2.00,0.00) circle (0.06);
\node[above] at (2.00,3.20) {$A$};
\node[left] at (0.00,0.00) {$B$};
\node[right] at (4.00,0.00) {$C$};
\node[below] at (2.00,0.00) {$H$};
\end{tikzpicture}
```

```ad-example
Dimostrazione: la bisettrice dell'angolo al vertice
Ipotesi: $AB \cong AC$; $AH$ è la bisettrice di $\widehat{BAC}$, con $H$ su $BC$. Tesi: $BH \cong HC$ e $AH \perp BC$.

1. $AB \cong AC$ per ipotesi.
2. $\widehat{BAH} \cong \widehat{HAC}$, perché $AH$ è la bisettrice.
3. $AH$ è in comune ai triangoli $ABH$ e $ACH$.
4. $ABH \cong ACH$ per il primo criterio, quindi $BH \cong HC$: $AH$ è la mediana.
5. Sempre dalla congruenza, $\widehat{AHB} \cong \widehat{AHC}$. Sono adiacenti, quindi ognuno è retto: $AH$ è l'altezza.
```

La retta $AH$ è perpendicolare a $BC$ nel suo punto medio, quindi è anche l'asse della base. Nel triangolo isoscele allora i quattro punti notevoli stanno tutti su questa retta, che è insieme altezza, mediana, bisettrice e asse.

Nel triangolo equilatero ogni lato può fare da base, quindi la stessa cosa vale per le linee che partono da tutti e tre i vertici: ognuna è altezza, mediana e bisettrice e sta sull'asse del lato opposto. Le tre linee sono le stesse per tutti e quattro i punti, e i quattro punti notevoli coincidono in un solo punto, il centro del triangolo.

```tikz
% nome: equilatero-punti-coincidenti
% alt: Triangolo equilatero ABC: le tre linee che partono dai vertici sono insieme altezze, mediane e bisettrici e stanno sugli assi dei lati; si incontrano in un solo punto O, centro sia della circonferenza circoscritta sia di quella inscritta
% svg: equilatero-punti-coincidenti-a312b3e7.svg 209x216
\begin{tikzpicture}
\draw[orange!80!black] (2.20,1.27) circle (2.540);
\draw[fill=blue!8, thick] (0.00,0.00) -- (4.40,0.00) -- (2.20,3.81) -- cycle;
\draw[orange!80!black] (2.20,1.27) circle (1.270);
\draw[blue!70!black] (0.00,0.00) -- (3.30,1.91);
\draw[thin] (3.22,2.05) -- (3.07,1.97) -- (3.15,1.82);
\draw[blue!70!black] (4.40,0.00) -- (1.10,1.91);
\draw[thin] (1.02,1.76) -- (1.16,1.67) -- (1.25,1.82);
\draw[blue!70!black] (2.20,3.81) -- (2.20,0.00);
\draw[thin] (2.37,0.00) -- (2.37,0.17) -- (2.20,0.17);
\fill (2.20,1.27) circle (0.06);
\node[above right=0pt] at (2.20,1.27) {$O$};
\node at (-0.26,-0.15) {$A$};
\node at (4.66,-0.15) {$B$};
\node at (2.20,4.11) {$C$};
\end{tikzpicture}
```

Il centro $O$ è anche il baricentro, quindi divide ogni altezza in due parti, una doppia dell'altra. La parte verso il vertice è il raggio della circonferenza circoscritta, l'altra è il raggio della circonferenza inscritta: nel triangolo equilatero il raggio della circoscritta è il doppio di quello della inscritta.

```ad-example
Esempio 6: i due raggi del triangolo equilatero
L'altezza di un triangolo equilatero è lunga $9$ cm. Quanto misurano i raggi della circonferenza inscritta e della circonferenza circoscritta?

Il centro divide l'altezza in un terzo e due terzi:

$$
\begin{gathered}
r = 9 : 3 = 3 \text{ cm} \\
R = 2 \cdot 3 = 6 \text{ cm}
\end{gathered}
$$

Controllo: $r + R = 9$ cm, cioè tutta l'altezza.
```
