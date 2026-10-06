# Ellisse

Pianta due chiodi su una tavola, lega ai chiodi i due capi di uno spago più lungo della loro distanza e fai scorrere una matita tenendo lo spago sempre teso: la curva chiusa che disegni è un'ellisse. Ha la stessa forma l'orbita di un pianeta intorno al Sole, e la vedi ogni volta che guardi di sbieco il bordo rotondo di un bicchiere. Nel piano cartesiano l'ellisse ha un'equazione di secondo grado, come la [circonferenza](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/equazione-della-circonferenza), e dalla sua equazione si leggono la forma e la posizione.

Ti servono la [distanza tra due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) e, per le rette tangenti, i [sistemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado).

## L'ellisse come luogo geometrico

Lo spago teso dice che cosa hanno in comune i punti della curva: la matita è sempre in un punto $P$ in cui i due tratti di spago, da $P$ a un chiodo e da $P$ all'altro, hanno per somma la lunghezza dello spago.

Fissati due punti $F_1$ e $F_2$, l'**ellisse** è il luogo dei punti $P$ del piano per i quali è costante la somma delle distanze da $F_1$ e da $F_2$. I punti $F_1$ e $F_2$ si chiamano **fuochi**. La somma costante si indica con $2a$ e la distanza tra i fuochi, detta **distanza focale**, con $2c$:

$$\overline{PF_1} + \overline{PF_2} = 2a \qquad \overline{F_1F_2} = 2c$$

Deve essere $a > c$. Nel triangolo $PF_1F_2$ un lato è minore della somma degli altri due, quindi $2c < 2a$: lo spago deve essere più lungo della distanza tra i chiodi.

```tikz
% nome: ellisse-luogo-somma-distanze
% alt: Un'ellisse con i fuochi F1 (-4, 0) e F2 (4, 0) e un suo punto P (3, 12/5), unito ai due fuochi da due segmenti: la somma delle loro lunghezze, 37/5 e 13/5, è 10
% svg: ellisse-luogo-somma-distanze-860a6a0d.svg 264x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-6,-4) grid (6,4);
\draw[->] (-6.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (5 and 3);
\draw[thick, red!50] (-4,0) -- (3,2.4);
\draw[thick, orange!70] (4,0) -- (3,2.4);
\fill (-4,0) circle (0.13);
\fill (4,0) circle (0.13);
\fill (3,2.4) circle (0.13);
\node[below] at (-4,0) {$F_1$};
\node[below] at (4,0) {$F_2$};
\node[above right] at (3,2.4) {$P$};
\end{tikzpicture}
```

Nella figura i fuochi sono $F_1(-4, 0)$ e $F_2(4, 0)$ e la somma è $2a = 10$. Il punto $P\Big(3, \dfrac{12}{5}\Big)$ sta sull'ellisse, e lo controlli con la formula della distanza:

$$
\begin{gathered}
\overline{PF_1} = \sqrt{7^2 + \Big(\frac{12}{5}\Big)^2} = \sqrt{\frac{1369}{25}} = \frac{37}{5} \\
\overline{PF_2} = \sqrt{1^2 + \Big(\frac{12}{5}\Big)^2} = \sqrt{\frac{169}{25}} = \frac{13}{5}
\end{gathered}
$$

La somma è $\dfrac{37}{5} + \dfrac{13}{5} = 10$.

## L'equazione canonica

Metti l'origine nel punto medio dei fuochi e l'asse $x$ sulla retta che li unisce: i fuochi sono $F_1(-c, 0)$ e $F_2(c, 0)$. Un punto $P(x, y)$ sta sull'ellisse quando

$$\sqrt{(x + c)^2 + y^2} + \sqrt{(x - c)^2 + y^2} = 2a$$

Per togliere le radici porta la seconda a destra ed eleva al quadrato:

$$
\begin{aligned}
(x + c)^2 + y^2 = {} & 4a^2 - 4a\sqrt{(x - c)^2 + y^2} \\
& + (x - c)^2 + y^2
\end{aligned}
$$

I quadrati $x^2$, $c^2$ e $y^2$ compaiono da tutte e due le parti e si cancellano; restano i doppi prodotti:

$$
\begin{gathered}
4cx - 4a^2 = -4a\sqrt{(x - c)^2 + y^2} \\
\Rightarrow a\sqrt{(x - c)^2 + y^2} = a^2 - cx
\end{gathered}
$$

Elevando ancora al quadrato, i termini $-2a^2cx$ compaiono da tutte e due le parti e si cancellano:

$$
\begin{gathered}
a^2x^2 + a^2c^2 + a^2y^2 = a^4 + c^2x^2 \\
\Rightarrow (a^2 - c^2)x^2 + a^2y^2 = a^2(a^2 - c^2)
\end{gathered}
$$

Il numero $a^2 - c^2$ è positivo, perché $a > c$: lo chiamiamo $b^2$, con $b > 0$. L'equazione diventa $b^2x^2 + a^2y^2 = a^2b^2$, e dividendo per $a^2b^2$ si ottiene l'**equazione canonica** dell'ellisse:

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \qquad \text{con } b^2 = a^2 - c^2$$

Abbiamo mostrato che ogni punto dell'ellisse verifica l'equazione. Vale anche il viceversa, che qui non dimostriamo: ogni punto che verifica l'equazione ha somma delle distanze dai fuochi uguale a $2a$.

## Vertici, assi e fuochi

Nell'equazione $x$ e $y$ compaiono solo al quadrato. Se il punto $(x, y)$ sta sull'ellisse, ci stanno anche $(-x, y)$, $(x, -y)$ e $(-x, -y)$: l'ellisse è simmetrica rispetto all'asse $y$, all'asse $x$ e all'origine, che è il suo **centro**.

I **vertici** sono i punti in cui l'ellisse incontra i suoi assi di simmetria. Con $y = 0$ l'equazione dà $x^2 = a^2$, con $x = 0$ dà $y^2 = b^2$:

$$
\begin{gathered}
A_1(-a, 0) \qquad A_2(a, 0) \\
B_1(0, -b) \qquad B_2(0, b)
\end{gathered}
$$

Poiché $b^2 = a^2 - c^2$, è $b < a$. Il segmento $A_1A_2$, lungo $2a$, è l'**asse maggiore** e contiene i fuochi; il segmento $B_1B_2$, lungo $2b$, è l'**asse minore**. I numeri $a$ e $b$ sono i **semiassi**. La somma costante $2a$ della definizione è la lunghezza dell'asse maggiore.

Conoscendo i semiassi, i fuochi si trovano da $b^2 = a^2 - c^2$:

$$c = \sqrt{a^2 - b^2} \qquad F_1(-c, 0) \quad F_2(c, 0)$$

```tikz
% nome: ellisse-vertici-fuochi-semiassi
% alt: Un'ellisse con il centro O nell'origine, i vertici A1 e A2 sull'asse x, B1 e B2 sull'asse y, i fuochi F1 e F2 sull'asse x e il triangolo rettangolo O F2 B2, con i cateti c e b e l'ipotenusa a
% svg: ellisse-vertici-fuochi-semiassi-e1e39348.svg 287x196
\begin{tikzpicture}[scale=0.55]
\draw[->] (-6.2,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-4) -- (0,4.4) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (5 and 3);
\draw[thick, red!50] (0,3) -- (4,0);
\draw[very thick, orange!70] (0,0) -- (4,0);
\draw[very thick, teal!60] (0,0) -- (0,3);
\foreach \x/\y in {-5/0, 5/0, 0/-3, 0/3, -4/0, 4/0} \fill (\x,\y) circle (0.12);
\node[below left] at (-5,0) {$A_1$};
\node[below right] at (5,0) {$A_2$};
\node[below right] at (0,-3) {$B_1$};
\node[above right] at (0,3) {$B_2$};
\node[below] at (-4,0) {$F_1$};
\node[below] at (4.1,0) {$F_2$};
\node[below left] at (0,0) {$O$};
\node[below] at (2,0) {$c$};
\node[left] at (0,1.5) {$b$};
\node[above right] at (1.9,1.5) {$a$};
\end{tikzpicture}
```

La figura mostra come ricordare la relazione: nel triangolo rettangolo $OF_2B_2$ i cateti sono $c$ e $b$, e l'ipotenusa $\overline{B_2F_2}$ vale $a$. Infatti $B_2$ è alla stessa distanza dai due fuochi, e la somma delle due distanze è $2a$. Il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) dà $a^2 = b^2 + c^2$.

Dall'equazione si vede anche dove sta la curva. Poiché $\dfrac{y^2}{b^2}$ non è negativo, deve essere $\dfrac{x^2}{a^2} \leq 1$, cioè $-a \leq x \leq a$; allo stesso modo $-b \leq y \leq b$. L'ellisse sta tutta dentro il rettangolo che ha i lati sulle rette $x = \pm a$ e $y = \pm b$, e lo tocca nei quattro vertici.

```ad-example
Esempio 1: dall'equazione agli elementi
Trova vertici e fuochi dell'ellisse $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$.

I denominatori sono $a^2 = 25$ e $b^2 = 9$, quindi $a = 5$ e $b = 3$. I vertici sono $A_1(-5, 0)$, $A_2(5, 0)$, $B_1(0, -3)$, $B_2(0, 3)$; l'asse maggiore è lungo $10$ e l'asse minore $6$. Per i fuochi:

$$c = \sqrt{25 - 9} = \sqrt{16} = 4$$

I fuochi sono $F_1(-4, 0)$ e $F_2(4, 0)$: è l'ellisse della prima figura.
```

```ad-warning
I denominatori sono i quadrati dei semiassi
In $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$ i semiassi sono $5$ e $3$, non $25$ e $9$. E per i fuochi si sottrae: $c^2 = a^2 - b^2$. La somma $a^2 + b^2$ è la formula dell'[iperbole](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole).
```

```ad-example
Esempio 2: un'equazione da portare in forma canonica
Trova semiassi e fuochi dell'ellisse $4x^2 + 9y^2 = 36$.

Nella forma canonica il secondo membro è $1$: dividi tutto per $36$.

$$\frac{4x^2}{36} + \frac{9y^2}{36} = 1 \ \Rightarrow \ \frac{x^2}{9} + \frac{y^2}{4} = 1$$

Quindi $a^2 = 9$ e $b^2 = 4$: i semiassi sono $a = 3$ e $b = 2$. Poi $c = \sqrt{9 - 4} = \sqrt{5}$, e i fuochi sono $F_1(-\sqrt{5}, 0)$ e $F_2(\sqrt{5}, 0)$. Il valore di $c$ si lascia con il radicale.
```

## L'ellisse con i fuochi sull'asse y

Se i fuochi stanno sull'asse $y$, in $F_1(0, -c)$ e $F_2(0, c)$, gli stessi passaggi con $x$ e $y$ scambiati portano ancora all'equazione

$$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$$

ma questa volta il semiasse più lungo è $b$, quello sull'asse $y$. L'asse maggiore è $B_1B_2$, la somma costante delle distanze dai fuochi è $2b$, e $c = \sqrt{b^2 - a^2}$. Per sapere dove stanno i fuochi confronta i due denominatori: l'asse maggiore, e con lui i fuochi, sta dalla parte del denominatore più grande.

| | $a > b$ | $a < b$ |
|---|---|---|
| Fuochi | sull'asse $x$: $(\pm c, 0)$ | sull'asse $y$: $(0, \pm c)$ |
| Valore di $c$ | $c = \sqrt{a^2 - b^2}$ | $c = \sqrt{b^2 - a^2}$ |
| Asse maggiore | $A_1A_2$, lungo $2a$ | $B_1B_2$, lungo $2b$ |
| Somma delle distanze | $2a$ | $2b$ |

In tutti e due i casi i vertici sono $(\pm a, 0)$ e $(0, \pm b)$. Se $a = b$ l'equazione diventa $x^2 + y^2 = a^2$: i fuochi coincidono con il centro e l'ellisse è una circonferenza di raggio $a$.

```ad-example
Esempio 3: fuochi sull'asse y
Trova vertici e fuochi dell'ellisse $\dfrac{x^2}{9} + \dfrac{y^2}{25} = 1$.

Qui $a^2 = 9$ e $b^2 = 25$, quindi $a = 3$ e $b = 5$: il denominatore più grande è sotto $y^2$, e i fuochi stanno sull'asse $y$.

$$c = \sqrt{25 - 9} = 4$$

I vertici sono $A_1(-3, 0)$, $A_2(3, 0)$, $B_1(0, -5)$, $B_2(0, 5)$ e i fuochi $F_1(0, -4)$ e $F_2(0, 4)$. È l'ellisse dell'esempio 1 con gli assi scambiati.

```tikz
% nome: ellisse-fuochi-asse-y
% alt: L'ellisse x al quadrato fratto 9 più y al quadrato fratto 25 uguale a 1, allungata lungo l'asse y, con i vertici A1 (-3, 0), A2 (3, 0), B1 (0, -5), B2 (0, 5) e i fuochi F1 (0, -4) e F2 (0, 4) sull'asse y
% svg: ellisse-fuochi-asse-y-2270f391.svg 176x242
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-4,-6) grid (4,6);
\draw[->] (-4.3,0) -- (4.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (3 and 5);
\foreach \x/\y in {-3/0, 3/0, 0/-5, 0/5, 0/-4, 0/4} \fill (\x,\y) circle (0.14);
\node[below left] at (-3,0) {$A_1$};
\node[below right] at (3,0) {$A_2$};
\node[below right] at (0,-5) {$B_1$};
\node[above right] at (0,5) {$B_2$};
\node[right] at (0,-3.8) {$F_1$};
\node[right] at (0,3.8) {$F_2$};
\end{tikzpicture}
```
```grafico
% nome: ellisse-semiassi-cursori
% alt: L'ellisse x²/a² + y²/b² = 1 con i cursori dei due semiassi e i suoi fuochi: con a maggiore di b è allungata lungo l'asse x e i fuochi F e G stanno sull'asse x, con b maggiore di a è allungata lungo l'asse y e i fuochi H e K stanno sull'asse y, con a uguale a b è una circonferenza e i fuochi coincidono con il centro
curva: \frac{x^2}{a^2}+\frac{y^2}{b^2}=1
curva: F=\left(\sqrt{a^2-b^2};0\right) | nero
curva: G=\left(-\sqrt{a^2-b^2};0\right) | nero
curva: H=\left(0;\sqrt{b^2-a^2}\right) | nero
curva: K=\left(0;-\sqrt{b^2-a^2}\right) | nero
cursore: a = 3 da 1 a 6 passo 0,1
cursore: b = 5 da 1 a 6 passo 0,1
finestra: x da -8 a 8, y da -7 a 7
valore: c = \sqrt{\left|a^2-b^2\right|}
domanda: I punti segnati sono i fuochi. Fai crescere $a$ fino a superare $b$: dove passano i fuochi? Che curva vedi nel momento in cui $a = b$, e quanto vale $c$?
```

Finché $a < b$ i fuochi stanno sull'asse $y$ e si avvicinano al centro man mano che $a$ cresce. Per $a = b$ è $c = 0$: i due fuochi coincidono con il centro e la curva è la circonferenza di raggio $a$. Appena $a$ supera $b$ i fuochi ricompaiono sull'asse $x$, e l'ellisse si allunga in orizzontale.
```

```ad-warning
Non sempre a è il semiasse maggiore
In $\dfrac{x^2}{9} + \dfrac{y^2}{25} = 1$ il semiasse sotto $x^2$ è $a = 3$ e l'asse maggiore è lungo $2b = 10$. Prima di calcolare $c$ guarda quale denominatore è più grande, poi sottrai il più piccolo dal più grande: $c^2 = 25 - 9$, mai $9 - 25$.
```

## L'eccentricità

Due ellissi con lo stesso asse maggiore possono essere una quasi rotonda e l'altra molto schiacciata. Il numero che misura lo schiacciamento è l'**eccentricità**, il rapporto tra la distanza focale e la lunghezza dell'asse maggiore:

$$e = \frac{c}{a} \ \text{ se } a > b \qquad e = \frac{c}{b} \ \text{ se } a < b$$

Poiché $c$ è minore del semiasse maggiore, per un'ellisse è sempre $0 \leq e < 1$. Con $e = 0$ i fuochi coincidono con il centro e l'ellisse è una circonferenza. Quando $e$ cresce verso $1$ i fuochi si avvicinano ai vertici dell'asse maggiore e l'ellisse si schiaccia.

```tikz
% nome: ellissi-eccentricita
% alt: Quattro curve con lo stesso asse maggiore, lungo 10, sull'asse x: una circonferenza tratteggiata con eccentricità 0 e tre ellissi con eccentricità 3/5, 4/5 e 24/25, sempre più schiacciate
% svg: ellissi-eccentricita-701d2cce.svg 247x239
\begin{tikzpicture}[scale=0.5]
\draw[->] (-5.8,0) -- (6.2,0) node[right] {$x$};
\draw[->] (0,-5.5) -- (0,6) node[above] {$y$};
\draw[thick, dashed, gray] (0,0) circle (5);
\draw[thick, teal!60] (0,0) ellipse (5 and 4);
\draw[thick, blue!60] (0,0) ellipse (5 and 3);
\draw[thick, orange!70] (0,0) ellipse (5 and 1.4);
\node[gray, right] at (0,4.5) {\small $e = 0$};
\node[teal!60!black, right] at (0,3.5) {\small $e = \frac{3}{5}$};
\node[blue!60!black, right] at (0,2.5) {\small $e = \frac{4}{5}$};
\node[orange!70!black, right] at (0,0.8) {\small $e = \frac{24}{25}$};
\end{tikzpicture}
```
```grafico
% nome: ellisse-eccentricita-cursore
% alt: La curva x²/25 + y²/(25 - c²) = 1 con i fuochi F e G in (c, 0) e (-c, 0) e il cursore di c, da 0 a 8: per c = 0 è una circonferenza, fino a c = 5 è un'ellisse sempre più schiacciata con eccentricità c/5 minore di 1, oltre c = 5 l'eccentricità supera 1 e la curva è un'iperbole con gli stessi vertici
curva: \frac{x^2}{25}+\frac{y^2}{25-c^2}=1
curva: F=\left(c;0\right) | nero
curva: G=\left(-c;0\right) | nero
cursore: c = 3 da 0 a 8 passo 0,1
finestra: x da -10 a 10, y da -7 a 7
valore: E = \frac{c}{5}
domanda: Qui $a = 5$, i punti $F$ e $G$ sono i fuochi ed $E$ è l'eccentricità. Che curva vedi con $c = 0$? Che cosa succede all'ellisse quando $c$ si avvicina a $5$? E quando lo supera, dove $E > 1$?
```

Con $c = 0$ è $E = 0$ e la curva è la circonferenza di raggio $5$. Quando $c$ cresce verso $5$ i fuochi vanno verso i vertici $(\pm 5, 0)$ e l'ellisse si schiaccia sull'asse maggiore. Per $c = 5$ il denominatore $25 - c^2$ è zero e l'equazione non ha senso: non c'è nessuna ellisse con $E = 1$. Oltre, il denominatore è negativo, la somma diventa una differenza e la curva ha due rami: è un'[iperbole](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole), la conica con eccentricità maggiore di $1$.

Nella figura il semiasse maggiore è sempre $a = 5$ e il semiasse minore vale $5$, $4$, $3$ e $\dfrac{7}{5}$. Per l'ellisse dell'esempio 1, con $a = 5$ e $c = 4$, è $e = \dfrac{4}{5}$. Quella dell'esempio 3 ha la stessa eccentricità, $e = \dfrac{c}{b} = \dfrac{4}{5}$, perché ha la stessa forma.

```ad-warning
Il denominatore dell'eccentricità
L'eccentricità si calcola dividendo $c$ per il semiasse maggiore, non per forza per $a$. Se dividi per il semiasse minore trovi un numero che può superare $1$, e per un'ellisse $e$ è sempre minore di $1$.
```

## Ellisse e retta

Un punto sta sia sull'ellisse sia su una retta quando le sue coordinate risolvono il sistema delle due equazioni. Come per [retta e parabola](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado), ricavi $y$ dall'equazione della retta, lo sostituisci in quella dell'ellisse e ottieni un'equazione risolvente di secondo grado in $x$, il cui discriminante dice come stanno le due linee.

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno | tangente |
| $\Delta < 0$ | nessuno | esterna |

Con l'ellisse la risolvente è sempre di secondo grado: una retta che ha un solo punto in comune con l'ellisse è tangente. Per una retta verticale $x = k$ si sostituisce $x$ e la risolvente è in $y$.

```ad-example
Esempio 4: tre rette parallele
Stabilisci la posizione delle rette $y = -x + 3$, $y = -x + 5$ e $y = -x + 6$ rispetto all'ellisse $\dfrac{x^2}{20} + \dfrac{y^2}{5} = 1$.

Moltiplicando per $20$ l'equazione dell'ellisse diventa $x^2 + 4y^2 = 20$. Sostituisci $y = -x + 3$:

$$
\begin{gathered}
x^2 + 4(-x + 3)^2 = 20 \\
\Rightarrow x^2 + 4x^2 - 24x + 36 - 20 = 0 \\
\Rightarrow 5x^2 - 24x + 16 = 0
\end{gathered}
$$

Il discriminante è $\Delta = 576 - 320 = 256$, positivo: la retta è secante.

$$x_{1,2} = \frac{24 \pm 16}{10}$$

Le soluzioni sono $x_1 = \dfrac{4}{5}$ e $x_2 = 4$. Le ordinate si calcolano dalla retta: $y_1 = -\dfrac{4}{5} + 3 = \dfrac{11}{5}$ e $y_2 = -4 + 3 = -1$. I punti comuni sono $\Big(\dfrac{4}{5}, \dfrac{11}{5}\Big)$ e $(4, -1)$.

Con $y = -x + 5$ la risolvente è $5x^2 - 40x + 80 = 0$, cioè $x^2 - 8x + 16 = 0$, che ha $\Delta = 64 - 64 = 0$ e la soluzione doppia $x = 4$: la retta è tangente nel punto $T(4, 1)$.

Con $y = -x + 6$ la risolvente è $5x^2 - 48x + 124 = 0$, con $\Delta = 2304 - 2480 = -176$: la retta è esterna. Nella figura ogni retta porta il suo termine noto $q$.

```tikz
% nome: ellisse-rette-secante-tangente-esterna
% alt: L'ellisse x al quadrato fratto 20 più y al quadrato fratto 5 uguale a 1 e tre rette parallele: y = -x + 3 la taglia nei punti (4/5, 11/5) e (4, -1), y = -x + 5 è tangente nel punto T (4, 1), y = -x + 6 non la incontra
% svg: ellisse-rette-secante-tangente-esterna-18d735be.svg 283x203
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-5,-3) grid (8,5);
\draw[->] (-5.3,0) -- (8.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (4.472 and 2.236);
\draw[thick, red!50] (-1.5,4.5) -- (6,-3);
\draw[thick, teal!60] (0.3,4.7) -- (8,-3);
\draw[thick, orange!70] (1.3,4.7) -- (8,-2);
\foreach \x/\y in {0.8/2.2, 4/-1, 4/1} \fill (\x,\y) circle (0.13);
\node[right] at (4.1,1.2) {$T$};
\node[red!50!black, below left] at (6.2,-3) {\small $q = 3$};
\node[teal!60!black, below] at (8.1,-3) {\small $5$};
\node[orange!70!black, right] at (8,-2) {\small $6$};
\end{tikzpicture}
```
```grafico
% nome: ellisse-fascio-rette-parallele
% alt: L'ellisse x²/20 + y²/5 = 1 e la retta y = -x + q con il cursore q, da -8 a 8, e il discriminante della risolvente scritto sotto: la retta è secante quando q è compreso tra -5 e 5, tangente per q uguale a 5 o a -5, esterna negli altri casi
curva: \frac{x^2}{20}+\frac{y^2}{5}=1
curva: y=-x+q | rosso
cursore: q = 3 da -8 a 8 passo 0,1
finestra: x da -8 a 8, y da -6 a 6
valore: \Delta = 400-16q^2
domanda: Sotto il piano c'è il discriminante della risolvente. Per quali valori di $q$ la retta è tangente? Che segno ha $\Delta$ quando la retta è esterna?
```

La retta è tangente quando $\Delta = 0$, cioè per $q = 5$ e per $q = -5$: le tangenti con coefficiente angolare $-1$ sono due, una per parte. Tra $-5$ e $5$ il discriminante è positivo e la retta è secante; fuori è negativo e la retta è esterna.
```

Il discriminante scritto sotto il piano è quello della risolvente $5x^2 - 8qx + 4q^2 - 20 = 0$, che ottieni sostituendo $y = -x + q$: $\Delta = 64q^2 - 20(4q^2 - 20) = 400 - 16q^2$.

## Rette tangenti a un'ellisse

### Tangente in un punto dell'ellisse

Se $P(x_0, y_0)$ è un punto dell'ellisse $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2} = 1$, la retta tangente in $P$ ha equazione

$$\frac{x_0 x}{a^2} + \frac{y_0 y}{b^2} = 1$$

È la **formula di sdoppiamento**, la stessa della [circonferenza](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/circonferenza-e-rette): nell'equazione dell'ellisse scrivi $x^2$ come $x \cdot x$ e $y^2$ come $y \cdot y$, poi sostituisci una delle due $x$ con $x_0$ e una delle due $y$ con $y_0$.

```ad-note
Perché quella retta è tangente
La retta passa per $P$: mettendo $x = x_0$ e $y = y_0$ il primo membro diventa $\dfrac{x_0^2}{a^2} + \dfrac{y_0^2}{b^2}$, che vale $1$ perché $P$ sta sull'ellisse. Prendi ora un punto $(x, y)$ che sta sia sulla retta sia sull'ellisse, e calcola

$$\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2}$$

Sviluppando i quadrati trovi tre gruppi: $\dfrac{x^2}{a^2} + \dfrac{y^2}{b^2}$, che vale $1$; $-2\Big(\dfrac{x_0x}{a^2} + \dfrac{y_0y}{b^2}\Big)$, che vale $-2$; $\dfrac{x_0^2}{a^2} + \dfrac{y_0^2}{b^2}$, che vale $1$. Il totale è $1 - 2 + 1 = 0$. Una somma di due quadrati è zero solo se sono zero tutti e due: $x = x_0$ e $y = y_0$. La retta ha in comune con l'ellisse il solo punto $P$, quindi è tangente.
```

```ad-example
Esempio 5: la tangente in un punto
Scrivi la tangente all'ellisse $\dfrac{x^2}{20} + \dfrac{y^2}{5} = 1$ nel suo punto $T(4, 1)$.

Controlla prima che $T$ stia sull'ellisse: $\dfrac{16}{20} + \dfrac{1}{5} = \dfrac{4}{5} + \dfrac{1}{5} = 1$. Poi sdoppia, con $x_0 = 4$ e $y_0 = 1$:

$$
\begin{gathered}
\frac{4x}{20} + \frac{1 \cdot y}{5} = 1 \\
\Rightarrow \frac{x}{5} + \frac{y}{5} = 1 \ \Rightarrow \ x + y = 5
\end{gathered}
$$

In forma esplicita è $y = -x + 5$, la retta tangente dell'esempio 4.
```

```ad-warning
Lo sdoppiamento vale solo per un punto dell'ellisse
Se $P$ non sta sull'ellisse, la formula dà una retta che non è tangente e che non passa nemmeno per $P$. Prima di usarla sostituisci le coordinate di $P$ nell'equazione dell'ellisse e controlla che venga $1$.
```

### Tangenti da un punto esterno

Da un punto $P(x_0, y_0)$ esterno all'ellisse escono due rette tangenti. Per trovarle:

1. scrivi il [fascio di rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/fasci-di-rette) di centro $P$: $y - y_0 = m(x - x_0)$;
2. metti a sistema il fascio con l'ellisse e scrivi la risolvente, che contiene $m$;
3. imponi la condizione di tangenza $\Delta = 0$: è un'equazione in $m$;
4. sostituisci nel fascio i valori di $m$ trovati.

```ad-example
Esempio 6: le tangenti da un punto esterno
Trova le tangenti all'ellisse $\dfrac{x^2}{20} + \dfrac{y^2}{5} = 1$ condotte dal punto $P(2, 3)$.

Il punto è esterno: $\dfrac{4}{20} + \dfrac{9}{5} = 2$, maggiore di $1$. Il fascio di centro $P$ è $y = mx + 3 - 2m$. Sostituisci in $x^2 + 4y^2 = 20$:

$$
\begin{gathered}
x^2 + 4(mx + 3 - 2m)^2 = 20 \\
\Rightarrow (1 + 4m^2)x^2 + 8m(3 - 2m)x \\
+ \, 4(3 - 2m)^2 - 20 = 0
\end{gathered}
$$

Il coefficiente di $x$ è pari, quindi conviene $\dfrac{\Delta}{4}$:

$$
\begin{aligned}
\frac{\Delta}{4} = {} & 16m^2(3 - 2m)^2 \\
& - (1 + 4m^2)\big[4(3 - 2m)^2 - 20\big]
\end{aligned}
$$

Svolgendo il prodotto, i termini $16m^2(3 - 2m)^2$ si cancellano e resta

$$
\begin{aligned}
\frac{\Delta}{4} &= -4(3 - 2m)^2 + 20 + 80m^2 \\
&= 64m^2 + 48m - 16
\end{aligned}
$$

La condizione $\Delta = 0$, divisa per $16$, è $4m^2 + 3m - 1 = 0$:

$$m_{1,2} = \frac{-3 \pm \sqrt{9 + 16}}{8} = \frac{-3 \pm 5}{8}$$

Le soluzioni sono $m_1 = -1$ e $m_2 = \dfrac{1}{4}$. Le tangenti sono

$$y = -x + 5 \qquad y = \frac{1}{4}x + \frac{5}{2}$$

La prima tocca l'ellisse in $T_1(4, 1)$, come nell'esempio 5. La seconda la tocca in $T_2(-2, 2)$: il punto sta sull'ellisse, perché $\dfrac{4}{20} + \dfrac{4}{5} = 1$, e sulla retta, perché $\dfrac{1}{4} \cdot (-2) + \dfrac{5}{2} = 2$.

```tikz
% nome: ellisse-tangenti-da-punto-esterno
% alt: L'ellisse x al quadrato fratto 20 più y al quadrato fratto 5 uguale a 1 e le due tangenti condotte dal punto esterno P (2, 3): la retta y = -x + 5, che la tocca in T1 (4, 1), e la retta y = x/4 + 5/2, che la tocca in T2 (-2, 2)
% svg: ellisse-tangenti-da-punto-esterno-8f9dcda1.svg 283x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-6,-3) grid (7,5);
\draw[->] (-6.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) ellipse (4.472 and 2.236);
\draw[thick, red!50] (0.5,4.5) -- (7,-2);
\draw[thick, red!50] (-6,1) -- (7,4.25);
\foreach \x/\y in {2/3, 4/1, -2/2} \fill (\x,\y) circle (0.13);
\node[above] at (2,3.1) {$P$};
\node[right] at (4.1,1.2) {$T_1$};
\node[above left] at (-2,2.1) {$T_2$};
\end{tikzpicture}
```
```grafico
% nome: ellisse-fascio-per-un-punto
% alt: L'ellisse x²/20 + y²/5 = 1, il punto P (2, 3) e la retta del fascio di centro P con il cursore del coefficiente angolare m, da -3 a 3: sotto il piano è scritto il discriminante diviso per 4, che si annulla per m = -1 e per m = 0,25, dove la retta è tangente
curva: \frac{x^2}{20}+\frac{y^2}{5}=1
curva: y=m\left(x-2\right)+3 | rosso
curva: P=\left(2;3\right) | nero
cursore: m = -1 da -3 a 3 passo 0,05
finestra: x da -8 a 8, y da -6 a 6
valore: \frac{\Delta}{4} = 64m^2+48m-16
domanda: Fai girare la retta intorno a $P$: per quali valori di $m$ è tangente? Che cosa fa la retta per i valori di $m$ compresi tra i due?
```

La retta è tangente per $m = -1$ e per $m = 0{,}25$, i due valori in cui $\dfrac{\Delta}{4}$ si annulla. Per $m$ compreso tra i due il discriminante è negativo e la retta è esterna: passa per $P$ ma gira dalla parte opposta all'ellisse. Per gli altri valori è secante.
```

```ad-warning
Se trovi un solo valore di m
Il fascio $y - y_0 = m(x - x_0)$ non contiene la retta verticale $x = x_0$. Se la condizione $\Delta = 0$ dà un'equazione di primo grado in $m$, con una sola soluzione, la seconda tangente è proprio la retta verticale per $P$. Succede quando l'ascissa di $P$ è $a$ oppure $-a$: dal punto $(5, 4)$ una delle due tangenti all'ellisse dell'esempio 1 è $x = 5$.
```

## Trovare l'equazione di un'ellisse

Nell'equazione canonica ci sono due numeri da trovare, $a^2$ e $b^2$: servono due condizioni. Ogni informazione sull'ellisse diventa un'equazione.

| Informazione | Equazione |
|---|---|
| un vertice $(\pm a, 0)$ o $(0, \pm b)$ | dà subito $a$ oppure $b$ |
| un fuoco | dà $c$, quindi $a^2 - b^2 = c^2$ o $b^2 - a^2 = c^2$ |
| l'eccentricità | il rapporto tra $c$ e il semiasse maggiore |
| il passaggio per un punto | le coordinate del punto verificano l'equazione |

```ad-example
Esempio 7: l'ellisse per due punti
Trova l'ellisse con il centro nell'origine e i fuochi sull'asse $x$ che passa per $A(4, 2)$ e $B(1, 3)$.

Sostituisci le coordinate dei due punti nell'equazione canonica. Le incognite compaiono al denominatore: per avere un sistema lineare poni $p = \dfrac{1}{a^2}$ e $q = \dfrac{1}{b^2}$.

$$
\begin{cases}
16p + 4q = 1 \\
p + 9q = 1
\end{cases}
$$

Dalla seconda equazione $p = 1 - 9q$; sostituendo nella prima:

$$
\begin{gathered}
16 - 144q + 4q = 1 \\
\Rightarrow 140q = 15 \ \Rightarrow \ q = \frac{3}{28}
\end{gathered}
$$

e quindi $p = 1 - \dfrac{27}{28} = \dfrac{1}{28}$. Allora $a^2 = 28$ e $b^2 = \dfrac{28}{3}$. L'equazione è

$$\frac{x^2}{28} + \frac{3y^2}{28} = 1$$

cioè $x^2 + 3y^2 = 28$. Poiché $a^2 > b^2$, i fuochi stanno davvero sull'asse $x$. Controllo: $16 + 3 \cdot 4 = 28$ e $1 + 3 \cdot 9 = 28$.
```

```ad-example
Esempio 8: i fuochi e un punto
Trova l'ellisse che ha i fuochi $F_1(-4, 0)$ e $F_2(4, 0)$ e passa per $P\Big(3, \dfrac{12}{5}\Big)$.

Qui la definizione fa prima del sistema: la somma delle distanze di $P$ dai fuochi è $2a$. Le due distanze sono quelle calcolate all'inizio della lezione, $\dfrac{37}{5}$ e $\dfrac{13}{5}$, quindi $2a = 10$ e $a = 5$. Con $c = 4$:

$$b^2 = a^2 - c^2 = 25 - 16 = 9$$

L'ellisse è $\dfrac{x^2}{25} + \dfrac{y^2}{9} = 1$.
```

```ad-example
Esempio 9: un vertice e l'eccentricità
Trova l'ellisse con i fuochi sull'asse $y$, un vertice in $B_2(0, 5)$ ed eccentricità $e = \dfrac{3}{5}$.

I fuochi sono sull'asse $y$, quindi il semiasse maggiore è $b = 5$ e l'eccentricità è $e = \dfrac{c}{b}$:

$$c = e \cdot b = \frac{3}{5} \cdot 5 = 3$$

Con i fuochi sull'asse $y$ è $c^2 = b^2 - a^2$, quindi $a^2 = 25 - 9 = 16$. L'ellisse è $\dfrac{x^2}{16} + \dfrac{y^2}{25} = 1$.
```

Le stesse idee, con una differenza al posto di una somma, portano all'[iperbole](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole).
