# Circonferenza e rette

Una retta può tagliare una circonferenza in due punti, toccarla in uno solo o non incontrarla: nella lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio) i tre casi si distinguono confrontando la distanza del centro dalla retta con il raggio. Nel piano cartesiano quella distanza si calcola, e i punti comuni si trovano risolvendo un sistema. Qui servono l'[equazione della circonferenza](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/equazione-della-circonferenza), la [distanza di un punto da una retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta) e i [fasci di rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/fasci-di-rette).

## Posizione di una retta rispetto a una circonferenza

Chiama $C$ il centro, $r$ il raggio e $d$ la distanza di $C$ dalla retta. Ci sono due modi per stabilire la posizione della retta, e danno sempre la stessa risposta.

Il primo confronta $d$ con $r$. Il secondo mette a sistema le due equazioni: ricavata $y$ (o $x$) dall'equazione della retta e sostituita in quella della circonferenza, si ottiene un'equazione risolvente di secondo grado, come nella lezione [Sistemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado), e il suo discriminante $\Delta$ dice quanti sono i punti comuni.

| Distanza | Risolvente | Punti comuni | La retta è |
|---|---|---|---|
| $d < r$ | $\Delta > 0$ | due | secante |
| $d = r$ | $\Delta = 0$ | uno | tangente |
| $d > r$ | $\Delta < 0$ | nessuno | esterna |

Il confronto tra $d$ e $r$ è più veloce quando serve solo la posizione. Il sistema è più lungo, ma dà anche le coordinate dei punti comuni.

```ad-example
Esempio 1: tre rette e una circonferenza
Stabilisci la posizione delle rette $3x + 4y - 1 = 0$, $3x + 4y - 36 = 0$ e $3x + 4y - 46 = 0$ rispetto alla circonferenza $x^2 + y^2 - 2x - 4y - 20 = 0$.

La circonferenza ha centro $C(1, 2)$ e raggio $r = \sqrt{1 + 4 + 20} = 5$. Le tre rette hanno gli stessi coefficienti di $x$ e $y$, quindi il denominatore della distanza è sempre $\sqrt{9 + 16} = 5$, e al numeratore c'è $3 \cdot 1 + 4 \cdot 2 = 11$ più il termine noto:

$$
\begin{gathered}
d_1 = \frac{|11 - 1|}{5} = 2 \\
d_2 = \frac{|11 - 36|}{5} = 5 \\
d_3 = \frac{|11 - 46|}{5} = 7
\end{gathered}
$$

La prima retta è secante, perché $2 < 5$; la seconda è tangente, perché $d_2 = r$; la terza è esterna, perché $7 > 5$.

```tikz
% nome: retta-circonferenza-posizioni-cartesiano
% alt: La circonferenza di centro C(1, 2) e raggio 5 con tre rette parallele: la secante 3x + 4y - 1 = 0, a distanza 2 dal centro, la tangente 3x + 4y - 36 = 0, a distanza 5, che la tocca nel punto T(4, 6), e la retta esterna 3x + 4y - 46 = 0, a distanza 7
\begin{tikzpicture}[scale=0.34]
\draw[gray!25, very thin] (-5,-4) grid (10,10);
\draw[->] (-5.3,0) -- (10.7,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,10.7) node[above] {$y$};
\draw[thick, blue!60] (1,2) circle (5);
\draw[thick, teal!70] (-5,4) -- (5.667,-4);
\draw[thick, red!50] (-1,9.75) -- (10,1.5);
\draw[thick, orange!80] (2,10) -- (10,4);
\draw[dashed, gray] (-0.2,0.4) -- (5.2,7.6);
\fill (1,2) circle (0.18);
\fill (4,6) circle (0.18);
\node[right] at (1.1,1.6) {$C$};
\node[below right] at (4,6) {$T$};
\node[teal!70!black, left] at (-5,4) {\small $d = 2$};
\node[red!60!black, left] at (-1,9.75) {\small $d = 5$};
\node[orange!80!black, right] at (10,4) {\small $d = 7$};
\end{tikzpicture}
```
```grafico
% nome: retta-circonferenza-distanza-cursore
% alt: La circonferenza di centro (1, 2) e raggio 5 e la retta 3x + 4y + k = 0 con il cursore k: sotto il piano è scritta la distanza d del centro dalla retta, e la retta è secante, tangente o esterna secondo che d sia minore, uguale o maggiore di 5
curva: x^2+y^2-2x-4y-20=0
curva: 3x+4y+k=0 | rosso
curva: C=\left(1;2\right) | nero
cursore: k = -1 da -50 a 30 passo 1
finestra: x da -10 a 12, y da -7 a 11
valore: d = \frac{\left|k+11\right|}{5}
domanda: Muovi $k$ finché $d = 5$: in quanti punti la retta incontra la circonferenza? Per quanti valori di $k$ succede?
```

La distanza vale $5$ per due valori, $k = -36$ e $k = 14$: sono le due tangenti parallele, una da una parte e una dall'altra del centro, e ognuna tocca la circonferenza in un punto solo.
```

```ad-warning
La retta va in forma implicita
La formula della distanza vuole la retta nella forma $ax + by + c = 0$. Con $y = x - 4$ i coefficienti non sono $1$ e $-4$: prima si scrive $x - y - 4 = 0$, poi si legge $a = 1$, $b = -1$, $c = -4$.
```

### I punti di intersezione e la corda

Quando la retta è secante, i due punti comuni $A$ e $B$ si trovano con il sistema, e il segmento $AB$ è una corda. La sua lunghezza si ottiene dalla [distanza tra due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) oppure, senza trovare $A$ e $B$, dal teorema di Pitagora: la perpendicolare condotta dal centro dimezza la corda, quindi metà corda, la distanza $d$ e il raggio sono i lati di un triangolo rettangolo.

$$\overline{AB} = 2\sqrt{r^2 - d^2}$$

```ad-example
Esempio 2: intersezioni e lunghezza della corda
Trova i punti in cui la retta $y = x - 4$ incontra la circonferenza $x^2 + y^2 - 2x - 4y - 20 = 0$, e la lunghezza della corda.

Sostituisci $y = x - 4$ nell'equazione della circonferenza:

$$
\begin{gathered}
x^2 + (x - 4)^2 - 2x - 4(x - 4) - 20 = 0 \\
\Rightarrow 2x^2 - 14x + 12 = 0 \\
\Rightarrow x^2 - 7x + 6 = 0
\end{gathered}
$$

Le soluzioni sono $x_1 = 1$ e $x_2 = 6$. Da $y = x - 4$ ottieni $y = -3$ e $y = 2$: i punti sono $A(1, -3)$ e $B(6, 2)$.

$$\overline{AB} = \sqrt{(6 - 1)^2 + (2 + 3)^2} = \sqrt{50} = 5\sqrt{2}$$

Controllo con la distanza. La retta in forma implicita è $x - y - 4 = 0$, e il centro è $C(1, 2)$:

$$d = \frac{|1 - 2 - 4|}{\sqrt{2}} = \frac{5}{\sqrt{2}}$$

$$\overline{AB} = 2\sqrt{25 - \frac{25}{2}} = 2 \cdot \frac{5}{\sqrt{2}} = 5\sqrt{2}$$

```tikz
% nome: corda-retta-secante-circonferenza
% alt: La circonferenza di centro C(1, 2) e raggio 5 e la retta y = x - 4, che la taglia nei punti A(1, -3) e B(6, 2): la perpendicolare dal centro incontra la corda AB nel suo punto medio H e forma con il raggio CB un triangolo rettangolo
\begin{tikzpicture}[scale=0.36]
\draw[gray!25, very thin] (-5,-4) grid (8,8);
\draw[->] (-5.3,0) -- (8.7,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,8.7) node[above] {$y$};
\draw[thick, blue!60] (1,2) circle (5);
\draw[thick, red!50] (0,-4) -- (8,4);
\draw[dashed, gray] (1,2) -- (3.5,-0.5);
\draw[dashed, gray] (1,2) -- (6,2);
\fill (1,2) circle (0.17);
\fill (1,-3) circle (0.17);
\fill (6,2) circle (0.17);
\fill (3.5,-0.5) circle (0.17);
\node[above] at (1,2.1) {$C$};
\node[below right] at (1,-3) {$A$};
\node[right] at (6.2,1.7) {$B$};
\node[below right] at (3.5,-0.5) {$H$};
\end{tikzpicture}
```
```grafico
% nome: corda-lunghezza-cursore-q
% alt: La circonferenza di centro C(1, 2) e raggio 5 e la retta y = x + q con il cursore q: sotto il piano sono scritte la distanza d del centro dalla retta e la lunghezza della corda, che è massima, uguale al diametro 10, quando la retta passa per il centro, e non esiste quando d supera 5
curva: x^2+y^2-2x-4y-20=0
curva: y=x+q | rosso
curva: C=\left(1;2\right) | nero
cursore: q = -4 da -8 a 10 passo 0,5
finestra: x da -10 a 12, y da -7 a 11
valore: d = \frac{\left|q-1\right|}{\sqrt{2}}
valore: \overline{AB} = 2\sqrt{25-\frac{\left(q-1\right)^2}{2}}
domanda: Per quale $q$ la corda è più lunga, e quanto misura? Che cosa succede alla corda quando $d$ supera $5$?
```

La corda è più lunga per $q = 1$, quando la retta passa per il centro: allora $d = 0$ e la corda è un diametro, lungo $10$. Quando $d$ supera $5$ la retta è esterna, sotto la radice c'è un numero negativo e la corda non esiste.
```

## Tangente in un punto della circonferenza

Per la lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio), la tangente è perpendicolare al raggio che arriva al punto di contatto. Se $P$ è un punto della circonferenza di centro $C$, la tangente in $P$ è la retta che passa per $P$ ed è perpendicolare a $CP$. Con le [rette perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari) il procedimento è questo:

1. Controlla che $P$ stia sulla circonferenza, sostituendo le sue coordinate nell'equazione.
2. Calcola il coefficiente angolare del raggio, $m_{CP} = \dfrac{y_P - y_C}{x_P - x_C}$.
3. La tangente ha coefficiente angolare $m = -\dfrac{1}{m_{CP}}$.
4. Scrivi la retta per $P$ con quel coefficiente angolare: $y - y_P = m(x - x_P)$.

Due casi non passano per la formula del passo 3. Se il raggio $CP$ è orizzontale, cioè $y_P = y_C$, la tangente è la retta verticale $x = x_P$. Se il raggio è verticale, cioè $x_P = x_C$, la tangente è la retta orizzontale $y = y_P$.

```ad-example
Esempio 3: la tangente in un punto
Scrivi la tangente alla circonferenza $x^2 + y^2 - 2x - 4y - 20 = 0$ nel suo punto $P(4, 6)$.

Il punto sta sulla circonferenza: $16 + 36 - 8 - 24 - 20 = 0$. Il centro è $C(1, 2)$, quindi

$$m_{CP} = \frac{6 - 2}{4 - 1} = \frac{4}{3}$$

La tangente ha coefficiente angolare $-\dfrac{3}{4}$ e passa per $P$:

$$
\begin{gathered}
y - 6 = -\frac{3}{4}(x - 4) \\
\Rightarrow 4y - 24 = -3x + 12 \\
\Rightarrow 3x + 4y - 36 = 0
\end{gathered}
$$

È la retta tangente dell'esempio 1, che ha distanza $5$ dal centro. Nel punto $Q(6, 2)$ della stessa circonferenza, invece, il raggio $CQ$ è orizzontale e la tangente è la retta verticale $x = 6$.

```tikz
% nome: tangente-in-un-punto-circonferenza
% alt: La circonferenza di centro C(1, 2) e raggio 5 con la tangente 3x + 4y - 36 = 0 nel punto P(4, 6), perpendicolare al raggio CP, e la tangente verticale x = 6 nel punto Q(6, 2), perpendicolare al raggio orizzontale CQ
\begin{tikzpicture}[scale=0.36]
\draw[gray!25, very thin] (-5,-4) grid (9,10);
\draw[->] (-5.3,0) -- (9.7,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,10.7) node[above] {$y$};
\draw[thick, blue!60] (1,2) circle (5);
\draw[thick, red!50] (-1,9.75) -- (9,2.25);
\draw[thick, orange!80] (6,-4) -- (6,10);
\draw[dashed, gray] (1,2) -- (4,6);
\draw[dashed, gray] (1,2) -- (6,2);
\draw[thin] (3.64,5.52) -- (4.12,5.16) -- (4.48,5.64);
\draw[thin] (5.4,2) -- (5.4,2.6) -- (6,2.6);
\fill (1,2) circle (0.17);
\fill (4,6) circle (0.17);
\fill (6,2) circle (0.17);
\node[left] at (0.9,2.5) {$C$};
\node[above right] at (4,6) {$P$};
\node[below right] at (6,2) {$Q$};
\end{tikzpicture}
```
```

```ad-tip
La formula di sdoppiamento
Se $P(x_0, y_0)$ sta sulla circonferenza $x^2 + y^2 + ax + by + c = 0$, la tangente in $P$ si scrive subito sostituendo $x^2$ con $x_0 x$, $y^2$ con $y_0 y$, $x$ con $\dfrac{x + x_0}{2}$ e $y$ con $\dfrac{y + y_0}{2}$:

$$
\begin{gathered}
x_0 x + y_0 y + a \cdot \frac{x + x_0}{2} \, + \\
+ \, b \cdot \frac{y + y_0}{2} + c = 0
\end{gathered}
$$

Nell'esempio 3, con $P(4, 6)$: $4x + 6y - (x + 4) - 2(y + 6) - 20 = 0$, cioè $3x + 4y - 36 = 0$. La formula si ottiene ripetendo con le lettere il procedimento dei quattro passi.
```

```ad-warning
Lo sdoppiamento vale solo per i punti della circonferenza
Se $P$ non sta sulla circonferenza, la formula di sdoppiamento dà comunque una retta, ma quella retta non è una tangente. Per un punto esterno si usa il metodo della sezione che segue.
```

## Tangenti da un punto esterno

Quante tangenti passano per un punto $P$ dipende da dove sta $P$, e la posizione si stabilisce come nella lezione [Equazione della circonferenza](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/equazione-della-circonferenza), confrontando $\overline{PC}$ con il raggio.

| Il punto $P$ è | Tangenti per $P$ |
|---|---|
| esterno | due |
| sulla circonferenza | una |
| interno | nessuna |

Se $P(x_0, y_0)$ è esterno, le tangenti si cercano tra le rette che passano per $P$, cioè nel fascio proprio di centro $P$:

1. Scrivi il fascio, $y - y_0 = m(x - x_0)$, e portalo in forma implicita: $mx - y + y_0 - mx_0 = 0$.
2. Scrivi la distanza del centro $C$ dalla retta del fascio: è un'espressione in $m$.
3. Imponi la condizione di tangenza, cioè che la distanza sia uguale al raggio, ed eleva al quadrato per togliere valore assoluto e radice.
4. Risolvi l'equazione in $m$: ogni soluzione è il coefficiente angolare di una tangente.

Dal punto $P(5, 0)$ alla circonferenza $x^2 + y^2 = 5$, per esempio, il fascio è $y = m(x - 5)$, cioè $mx - y - 5m = 0$. Il centro è l'origine e il raggio è $\sqrt{5}$:

$$
\begin{gathered}
\frac{|-5m|}{\sqrt{m^2 + 1}} = \sqrt{5} \\
\Rightarrow 25m^2 = 5(m^2 + 1) \\
\Rightarrow m^2 = \frac{1}{4}
\end{gathered}
$$

Le soluzioni sono $m = \dfrac{1}{2}$ e $m = -\dfrac{1}{2}$: le tangenti sono $y = \dfrac{1}{2}(x - 5)$ e $y = -\dfrac{1}{2}(x - 5)$.

```tikz
% nome: tangenti-da-punto-esterno-fascio
% alt: La circonferenza x² + y² = 5 e il punto esterno P(5, 0): tra le rette del fascio di centro P, due sono tangenti e toccano la circonferenza nei punti (1, 2) e (1, -2); una terza retta del fascio, tratteggiata, è secante
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-3,-3) grid (6,3);
\draw[->] (-3.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,3.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) circle (2.236);
\draw[thick, red!50] (-1,3) -- (6,-0.5);
\draw[thick, red!50] (-1,-3) -- (6,0.5);
\draw[dashed, gray] (-3,1.6) -- (6,-0.2);
\fill (5,0) circle (0.12);
\fill (1,2) circle (0.12);
\fill (1,-2) circle (0.12);
\node[above right] at (5,0) {$P$};
\node[above right] at (1,2) {\small $(1, 2)$};
\node[below right] at (1,-2) {\small $(1, -2)$};
\end{tikzpicture}
```
```grafico
% nome: fascio-per-p-tangente-circonferenza
% alt: La circonferenza x² + y² = 5 e la retta del fascio di centro P(5, 0) con il cursore del coefficiente angolare m: sotto il piano sono scritti la distanza d del centro dalla retta e il raggio; la retta è tangente quando d è uguale al raggio
curva: x^2+y^2=5
curva: y=m\left(x-5\right) | rosso
curva: P=\left(5;0\right) | nero
cursore: m = 1 da -3 a 3 passo 0,1
finestra: x da -5 a 8, y da -5 a 5
valore: d = \frac{\left|5m\right|}{\sqrt{m^2+1}}
valore: r = \sqrt{5}
domanda: Muovi $m$ finché $d$ è uguale a $r$: per quanti valori di $m$ la retta è tangente?
```

I valori sono due, $m = 0{,}5$ e $m = -0{,}5$, quelli trovati con il conto: tra i due la retta è secante, fuori è esterna.

```ad-example
Esempio 4: due tangenti oblique
Trova le tangenti alla circonferenza $x^2 + y^2 = 10$ condotte dal punto $P(-5, 5)$.

Il punto è esterno: $\overline{PO}^2 = 25 + 25 = 50 > 10$. Il fascio di centro $P$ è $y - 5 = m(x + 5)$, cioè $mx - y + 5m + 5 = 0$. Il centro è $O(0, 0)$ e il raggio è $\sqrt{10}$:

$$\frac{|5m + 5|}{\sqrt{m^2 + 1}} = \sqrt{10}$$

Eleva al quadrato e semplifica:

$$
\begin{gathered}
25(m + 1)^2 = 10(m^2 + 1) \\
\Rightarrow 5m^2 + 10m + 5 = 2m^2 + 2 \\
\Rightarrow 3m^2 + 10m + 3 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 100 - 36 = 64 \\
m_{1,2} = \frac{-10 \pm 8}{6} \\
m_1 = -3, \quad m_2 = -\frac{1}{3}
\end{gathered}
$$

Sostituendo nel fascio: con $m = -3$ si ha $y - 5 = -3(x + 5)$, cioè $3x + y + 10 = 0$; con $m = -\dfrac{1}{3}$ si ha $y - 5 = -\dfrac{1}{3}(x + 5)$, cioè $x + 3y - 10 = 0$.

I punti di contatto si trovano mettendo a sistema ogni tangente con la circonferenza: sono $B(-3, -1)$ e $A(1, 3)$. I due segmenti di tangente sono congruenti, come dice il teorema della lezione Circonferenza e cerchio: $\overline{PA} = \sqrt{36 + 4} = 2\sqrt{10}$ e $\overline{PB} = \sqrt{4 + 36} = 2\sqrt{10}$.

```tikz
% nome: tangenti-da-p-circonferenza-raggio-radice-10
% alt: La circonferenza x² + y² = 10 con le due tangenti condotte dal punto esterno P(-5, 5): la retta x + 3y - 10 = 0, che la tocca in A(1, 3), e la retta 3x + y + 10 = 0, che la tocca in B(-3, -1)
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-6,-4) grid (5,6);
\draw[->] (-6.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,6.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) circle (3.162);
\draw[thick, red!50] (-6,5.333) -- (5,1.667);
\draw[thick, red!50] (-5.333,6) -- (-2,-4);
\draw[dashed, gray] (0,0) -- (1,3);
\draw[dashed, gray] (0,0) -- (-3,-1);
\fill (-5,5) circle (0.14);
\fill (1,3) circle (0.14);
\fill (-3,-1) circle (0.14);
\fill (0,0) circle (0.14);
\node[below left] at (-5,5) {$P$};
\node[above right] at (1,3) {$A$};
\node[left] at (-3.1,-1) {$B$};
\node[below right] at (0,0) {$O$};
\end{tikzpicture}
```
```

```ad-warning
Una sola soluzione non vuol dire una sola tangente
Il fascio $y - y_0 = m(x - x_0)$ non contiene la retta verticale $x = x_0$. Se $P$ è esterno e l'equazione in $m$ è di primo grado, con una sola soluzione, la seconda tangente c'è lo stesso: è la retta verticale, e va controllata a parte calcolando la sua distanza dal centro.
```

```ad-example
Esempio 5: una tangente è verticale
Trova le tangenti alla circonferenza $x^2 + y^2 = 25$ condotte dal punto $P(5, 10)$.

Il punto è esterno: $25 + 100 > 25$. Il fascio è $y - 10 = m(x - 5)$, cioè $mx - y + 10 - 5m = 0$:

$$
\begin{gathered}
\frac{|10 - 5m|}{\sqrt{m^2 + 1}} = 5 \\
\Rightarrow (2 - m)^2 = m^2 + 1 \\
\Rightarrow 4 - 4m = 1 \\
\Rightarrow m = \frac{3}{4}
\end{gathered}
$$

I termini $m^2$ si cancellano e resta una sola soluzione, che dà la tangente $y - 10 = \dfrac{3}{4}(x - 5)$, cioè $3x - 4y + 25 = 0$. La retta verticale per $P$ è $x = 5$: la sua distanza dal centro $O$ è $5$, uguale al raggio, quindi è la seconda tangente.

```tikz
% nome: tangenti-da-p-una-verticale
% alt: La circonferenza x² + y² = 25 con le due tangenti condotte dal punto P(5, 10): la retta verticale x = 5, che la tocca in (5, 0), e la retta 3x - 4y + 25 = 0, che la tocca in (-3, 4)
\begin{tikzpicture}[scale=0.32]
\draw[gray!25, very thin] (-8,-6) grid (7,11);
\draw[->] (-8.3,0) -- (7.8,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,11.8) node[above] {$y$};
\draw[thick, blue!60] (0,0) circle (5);
\draw[thick, red!50] (5,-6) -- (5,11);
\draw[thick, red!50] (-8,0.25) -- (6.333,11);
\fill (5,10) circle (0.19);
\fill (5,0) circle (0.19);
\fill (-3,4) circle (0.19);
\node[right] at (5.1,10) {$P$};
\node[below right] at (5,0) {\small $5$};
\node[above left] at (-3,4.1) {\small $(-3, 4)$};
\end{tikzpicture}
```
```

```ad-note
Lo stesso problema con il discriminante
Le tangenti si possono trovare anche mettendo a sistema il fascio con la circonferenza e imponendo che la risolvente abbia $\Delta = 0$. Il risultato è lo stesso, ma i conti sono più lunghi: con la circonferenza conviene la distanza.
```

## Circonferenza tangente a una retta

Se una circonferenza è tangente a una retta, il suo raggio è la distanza del centro da quella retta. È una delle condizioni con cui si trova l'equazione di una circonferenza, accanto a quelle della lezione precedente.

```ad-example
Esempio 6: centro e retta tangente
Scrivi l'equazione della circonferenza di centro $C(3, -1)$ tangente alla retta $4x - 3y + 10 = 0$.

Il raggio è la distanza di $C$ dalla retta:

$$r = \frac{|4 \cdot 3 - 3 \cdot (-1) + 10|}{\sqrt{16 + 9}} = \frac{25}{5} = 5$$

L'equazione è $(x - 3)^2 + (y + 1)^2 = 25$, cioè $x^2 + y^2 - 6x + 2y - 15 = 0$.
```

Con gli assi cartesiani il conto è immediato: una circonferenza di centro $C(\alpha, \beta)$ è tangente all'asse $x$ quando $r = |\beta|$, e all'asse $y$ quando $r = |\alpha|$. La circonferenza di centro $(3, -2)$ tangente all'asse $x$ ha raggio $2$; quella con lo stesso centro tangente all'asse $y$ ha raggio $3$.

## Due circonferenze

Per due circonferenze di centri $C$ e $C'$ si confronta la distanza $d = \overline{CC'}$ con la somma e con la differenza dei raggi, come nella lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio). Chiama $r$ il raggio maggiore e $r'$ quello minore.

| Confronto | Le circonferenze sono | Punti comuni |
|---|---|---|
| $d > r + r'$ | esterne | nessuno |
| $d = r + r'$ | tangenti esternamente | uno |
| $r - r' < d < r + r'$ | secanti | due |
| $d = r - r'$, con $d \neq 0$ | tangenti internamente | uno |
| $d < r - r'$ | una interna all'altra | nessuno |

```tikz
% nome: due-circonferenze-esterne-distanza-centri
% alt: Due circonferenze esterne: la prima di centro O e raggio 3, la seconda di centro C' sull'asse x e raggio 2; la distanza d tra i centri è 6, maggiore della somma dei raggi 5
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-4,-4) grid (9,4);
\draw[->] (-4.3,0) -- (9.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60] (0,0) circle (3);
\draw[thick, red!50] (6,0) circle (2);
\fill (0,0) circle (0.15);
\fill (6,0) circle (0.15);
\node[below left] at (0,0) {$O$};
\node[above] at (6,0.1) {$C'$};
\draw[dashed, gray] (0,-3.5) -- (6,-3.5);
\draw[dashed, gray] (0,0) -- (0,-3.5);
\draw[dashed, gray] (6,0) -- (6,-3.5);
\node[below] at (3,-3.5) {\small $d = 6$};
\end{tikzpicture}
```
```grafico
% nome: due-circonferenze-distanza-centri-cursore
% alt: La circonferenza di centro l'origine e raggio 3 e una circonferenza di raggio 2 con il centro in (k, 0), che si muove con il cursore k: sotto il piano è scritta la distanza d tra i centri; le circonferenze sono tangenti esternamente per d = 5, secanti tra 1 e 5, tangenti internamente per d = 1, concentriche per d = 0
curva: x^2+y^2=9
curva: \left(x-k\right)^2+y^2=4 | rosso
cursore: k = 6 da -7 a 7 passo 0,5
finestra: x da -10 a 10, y da -7 a 7
valore: d = \left|k\right|
domanda: I raggi sono $3$ e $2$. Avvicina i centri: per quali valori di $d$ le circonferenze sono tangenti? Che cosa sono per $d = 0$?
```

Sono tangenti esternamente per $d = 5$, la somma dei raggi, e tangenti internamente per $d = 1$, la differenza; tra $1$ e $5$ sono secanti, sotto $1$ la piccola è interna alla grande. Per $d = 0$ hanno lo stesso centro: sono concentriche, e non hanno punti comuni.

### L'asse radicale

I punti comuni risolvono il sistema delle due equazioni. Tutte e due cominciano con $x^2 + y^2$: sottraendo membro a membro i termini di secondo grado si cancellano, e resta un'equazione di primo grado, cioè una retta. Si chiama **asse radicale** delle due circonferenze, ed esiste quando i centri sono diversi.

Un punto che sta su tutte e due le circonferenze rende vere le due equazioni, quindi anche la loro differenza: i punti comuni stanno sull'asse radicale. Per due circonferenze secanti l'asse radicale è la retta che passa per i due punti di intersezione; per due circonferenze tangenti è la tangente comune nel punto di contatto. I punti comuni si trovano mettendo a sistema l'asse radicale con una delle due circonferenze.

```ad-example
Esempio 7: due circonferenze secanti
Stabilisci la posizione delle circonferenze $x^2 + y^2 = 10$ e $x^2 + y^2 - 12x - 6y + 20 = 0$ e trova i punti comuni.

La prima ha centro $O(0, 0)$ e raggio $\sqrt{10} \approx 3{,}16$. La seconda ha centro $C'(6, 3)$ e raggio $\sqrt{36 + 9 - 20} = 5$. La distanza tra i centri è

$$d = \sqrt{36 + 9} = \sqrt{45} \approx 6{,}71$$

La somma dei raggi è circa $8{,}16$ e la differenza circa $1{,}84$: $d$ sta tra le due, quindi le circonferenze sono secanti. Sottrai la seconda equazione dalla prima:

$$
\begin{gathered}
12x + 6y - 30 = 0 \\
\Rightarrow 2x + y - 5 = 0
\end{gathered}
$$

È l'asse radicale. Ricava $y = 5 - 2x$ e sostituisci nella prima circonferenza:

$$
\begin{gathered}
x^2 + (5 - 2x)^2 = 10 \\
\Rightarrow 5x^2 - 20x + 15 = 0 \\
\Rightarrow x^2 - 4x + 3 = 0
\end{gathered}
$$

Le soluzioni sono $x = 1$ e $x = 3$, a cui corrispondono $y = 3$ e $y = -1$: i punti comuni sono $A(1, 3)$ e $B(3, -1)$.

```tikz
% nome: due-circonferenze-secanti-asse-radicale
% alt: Le circonferenze x² + y² = 10, di centro O, e x² + y² - 12x - 6y + 20 = 0, di centro C'(6, 3) e raggio 5, si tagliano nei punti A(1, 3) e B(3, -1): la retta per A e B è l'asse radicale 2x + y - 5 = 0, perpendicolare alla retta dei centri
\begin{tikzpicture}[scale=0.36]
\draw[gray!25, very thin] (-4,-4) grid (12,9);
\draw[->] (-4.3,0) -- (12.7,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,9.7) node[above] {$y$};
\draw[thick, blue!60] (0,0) circle (3.162);
\draw[thick, teal!70] (6,3) circle (5);
\draw[thick, red!50] (-2,9) -- (4.5,-4);
\draw[dashed, gray] (0,0) -- (6,3);
\fill (0,0) circle (0.17);
\fill (6,3) circle (0.17);
\fill (1,3) circle (0.17);
\fill (3,-1) circle (0.17);
\node[below left] at (0,0) {$O$};
\node[right] at (6.1,3) {$C'$};
\node[right] at (1.2,3.5) {$A$};
\node[right] at (3.3,-1.2) {$B$};
\end{tikzpicture}
```
```grafico
% nome: asse-radicale-cursore-c
% alt: La circonferenza x² + y² = 10, la circonferenza x² + y² - 12x - 6y + c = 0 con il cursore c e il loro asse radicale: aumentando c la seconda circonferenza si stringe attorno al centro (6, 3), le due si staccano, e l'asse radicale resta una retta che non incontra nessuna delle due
curva: x^2+y^2=10
curva: x^2+y^2-12x-6y+c=0 | verde acqua
curva: 12x+6y-10-c=0 | rosso
cursore: c = 20 da -20 a 40 passo 1
finestra: x da -9 a 17, y da -9 a 13
valore: r' = \sqrt{45-c}
domanda: Alza $c$ finché le due circonferenze si staccano: la retta rossa, l'asse radicale, sparisce?
```

No: la sottrazione delle due equazioni dà sempre una retta. Fino a $c = 32$ le circonferenze sono secanti e l'asse radicale passa per i due punti comuni; da $c = 33$ in poi sono esterne, e l'asse radicale passa tra le due senza incontrarle.
```

```ad-example
Esempio 8: due circonferenze tangenti
Stabilisci la posizione delle circonferenze $x^2 + y^2 = 25$ e $x^2 + y^2 - 18x - 24y + 125 = 0$.

La prima ha centro $O(0, 0)$ e raggio $r' = 5$. La seconda ha centro $C(9, 12)$ e raggio $r = \sqrt{81 + 144 - 125} = 10$. La distanza tra i centri è

$$d = \sqrt{81 + 144} = 15$$

che è uguale alla somma dei raggi: le circonferenze sono tangenti esternamente. Sottraendo la seconda equazione dalla prima si ha $18x + 24y - 150 = 0$, cioè l'asse radicale

$$3x + 4y - 25 = 0$$

che è la tangente comune. Il punto di contatto è il suo punto comune con la prima circonferenza, $T(3, 4)$: infatti $3^2 + 4^2 = 25$ e $3 \cdot 3 + 4 \cdot 4 - 25 = 0$.
```

```ad-warning
L'asse radicale non dice se ci sono punti comuni
La sottrazione delle due equazioni dà una retta anche quando le circonferenze sono esterne o una interna all'altra: in quei casi l'asse radicale non incontra nessuna delle due. Che i punti comuni esistano lo dice il confronto tra $d$ e i raggi, o il sistema.
```
