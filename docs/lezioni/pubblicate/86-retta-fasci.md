# Fasci di rette

Per un punto passano infinite rette: se immagini una retta che ruota attorno a un chiodo piantato nel punto $C(2, 1)$, ogni sua posizione è una retta diversa, e tutte hanno in comune il punto $C$. L'insieme di queste rette si chiama fascio, e si descrive con una sola equazione che contiene un **parametro**, una lettera che cambia da una retta all'altra. Gli esercizi sui fasci chiedono di scegliere il valore del parametro giusto: quello che dà la retta del fascio che passa per un punto, o che è parallela a una retta data.

Per seguire la lezione ti servono la [retta per un punto con coefficiente angolare dato](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti), le condizioni di [parallelismo e perpendicolarità](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari) e l'[intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette). Il parametro si tratta come nelle [equazioni letterali](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-letterali): sta per un numero fissato ma non dato, e nei conti si usa come un numero.

## Fascio proprio

Il **fascio proprio** di centro $C$ è l'insieme di tutte le rette del piano che passano per il punto $C$, che si chiama **centro del fascio**.

Una retta che passa per $C(x_0, y_0)$ e non è verticale ha equazione $y - y_0 = m(x - x_0)$, come nella lezione sul [coefficiente angolare](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti). Se lasci $m$ libero di cambiare, ottieni tutte queste rette insieme:

$$y - y_0 = m(x - x_0)$$

Qui il parametro è $m$: a ogni valore di $m$ corrisponde una retta del fascio, con quella pendenza. Manca una sola retta, quella verticale $x = x_0$, che passa per $C$ ma non ha coefficiente angolare. Il fascio proprio completo è quindi

$$
\begin{gathered}
y - y_0 = m(x - x_0) \\
\text{e la retta } x = x_0
\end{gathered}
$$

Con il centro $C(2, 1)$ l'equazione è $y - 1 = m(x - 2)$. Per $m = 0$ ottieni la retta orizzontale $y = 1$; per $m = 2$ la retta $y = 2x - 3$; per $m = -1$ la retta $y = -x + 3$. La retta $x = 2$ è la verticale del fascio.

```tikz
% nome: fascio-proprio-centro-2-1
% alt: Il fascio proprio di centro C(2, 1): le rette y = 1, y = 2x - 3, y = -x + 3 e y = x/2 passano tutte per C, e con loro la retta verticale x = 2, disegnata tratteggiata
% svg: fascio-proprio-centro-2-1-e1f5cb23.svg 200x201
\begin{tikzpicture}[scale=0.7]
\draw[gray!25, very thin] (-1,-2) grid (5,4);
\draw[->] (-1.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.5) node[above] {$y$};
\foreach \x in {1,3,4} \draw (\x,0.1) -- (\x,-0.1) node[below] {\small $\x$};
\foreach \y in {-1,1,2,3} \draw (0.1,\y) -- (-0.1,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-1,1) -- (5,1);
\draw[thick, blue!60] (0.5,-2) -- (3.5,4);
\draw[thick, blue!60] (-0.5,3.5) -- (4.5,-1.5);
\draw[thick, blue!60] (-1,-0.5) -- (5,2.5);
\draw[thick, dashed, red!60] (2,-2) -- (2,4);
\fill (2,1) circle (0.12);
\node at (2.33,0.42) {$C$};
\node[red!60!black, left] at (2,3.6) {$x = 2$};
\end{tikzpicture}
```

```ad-example
Esempio 1: la retta del fascio per un punto
Scrivi il fascio proprio di centro $C(2, 1)$ e trova la retta del fascio che passa per $A(4, 5)$.

Il fascio è $y - 1 = m(x - 2)$, insieme alla retta $x = 2$. La retta cercata passa per $A$: sostituisci le coordinate di $A$ al posto di $x$ e $y$ e trova $m$.

$$
\begin{gathered}
5 - 1 = m(4 - 2) \\
\Rightarrow 4 = 2m \\
\Rightarrow m = 2
\end{gathered}
$$

Con $m = 2$ l'equazione è $y - 1 = 2(x - 2)$, cioè $y = 2x - 3$. Verifica: per $x = 4$ si ha $y = 8 - 3 = 5$, e il punto $A$ sta sulla retta.
```

Se il punto ha la stessa ascissa del centro, per esempio $B(2, 4)$, la sostituzione dà $3 = m \cdot 0$, che è impossibile: nessun valore di $m$ va bene, perché la retta per $C$ e $B$ è la verticale $x = 2$.

```ad-warning
Dimenticare la retta verticale
L'equazione $y - y_0 = m(x - x_0)$ non contiene la retta $x = x_0$: per nessun valore di $m$ diventa verticale. Quando la sostituzione porta a un'uguaglianza impossibile, come $3 = 0$, la risposta non è "nessuna retta", ma la retta verticale del fascio.
```

## Fascio improprio

Il **fascio improprio** è l'insieme di tutte le rette parallele a una retta data. Le rette parallele non verticali hanno lo stesso coefficiente angolare e ordinate all'origine diverse, quindi un fascio improprio si scrive fissando $m$ e lasciando libero $q$:

$$y = mx + q \qquad (m \text{ fisso})$$

Il parametro ora è $q$, e ogni valore di $q$ dà una retta del fascio. In forma implicita si fissano invece $a$ e $b$ e si lascia libero il termine noto: le parallele a $x - 2y + 4 = 0$ sono le rette $x - 2y + c = 0$, con $c$ che cambia. Le rette verticali formano anch'esse un fascio improprio, $x = h$ con $h$ che cambia, che non si può scrivere nella forma $y = mx + q$.

Per le rette parallele a $x - 2y + 4 = 0$ ricava $y$: $y = \dfrac{1}{2}x + 2$, quindi $m = \dfrac{1}{2}$ e il fascio è $y = \dfrac{1}{2}x + q$.

```tikz
% nome: fascio-improprio-parallele
% alt: Il fascio improprio delle rette y = x/2 + q: sono disegnate le parallele con q = -2, 0, 2 e 4, e la retta con q = 4 passa per il punto P(-2, 3)
% svg: fascio-improprio-parallele-25d2f12d.svg 205x227
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-4,-3) grid (4,6);
\draw[->] (-4.3,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,6.6) node[above] {$y$};
\foreach \x in {-2,2} \draw (\x,0.1) -- (\x,-0.1) node[below] {\small $\x$};
\foreach \y in {2,4} \draw (0.1,\y) -- (-0.1,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-2,-3) -- (4,0);
\draw[thick, blue!60] (-4,-2) -- (4,2);
\draw[thick, blue!60] (-4,0) -- (4,4);
\draw[thick, red!50] (-4,2) -- (4,6);
\fill (-2,3) circle (0.14);
\node[above left] at (-2,3) {$P$};
\end{tikzpicture}
```

```ad-example
Esempio 2: la parallela per un punto
Trova la retta parallela a $x - 2y + 4 = 0$ che passa per $P(-2, 3)$.

Il fascio delle parallele è $y = \dfrac{1}{2}x + q$. Sostituisci le coordinate di $P$:

$$
\begin{gathered}
3 = \frac{1}{2} \cdot (-2) + q \\
\Rightarrow 3 = -1 + q \\
\Rightarrow q = 4
\end{gathered}
$$

La retta è $y = \dfrac{1}{2}x + 4$, che in forma implicita diventa $x - 2y + 8 = 0$. Verifica con $P$: $-2 - 6 + 8 = 0$.
```

## Fascio generato da due rette

Spesso il fascio è dato con un'equazione come $(1 + k)x + (1 - k)y - 3 - k = 0$, dove il parametro $k$ compare nei coefficienti. Per capire di che fascio si tratta si parte da due rette, dette **generatrici** del fascio (alcuni libri le chiamano rette base):

$$
\begin{gathered}
r: \ ax + by + c = 0 \\
s: \ a'x + b'y + c' = 0
\end{gathered}
$$

Con un parametro $k$ si forma l'equazione

$$
\begin{gathered}
ax + by + c \, + \\
k(a'x + b'y + c') = 0
\end{gathered}
$$

che si chiama **combinazione lineare** delle due equazioni. Per ogni valore di $k$ è un'equazione di primo grado in $x$ e $y$, cioè una retta, tranne quando i coefficienti di $x$ e di $y$ si annullano tutti e due; se $r$ e $s$ sono incidenti, questo non succede per nessun $k$.

Se $r$ e $s$ sono incidenti, tutte queste rette passano per il loro punto di intersezione $C$. Le coordinate di $C$ rendono zero tutte e due le espressioni $ax + by + c$ e $a'x + b'y + c'$, perché $C$ sta su $r$ e su $s$; allora l'equazione diventa $0 + k \cdot 0 = 0$, che è vera per ogni $k$. Le rette della combinazione formano il fascio proprio di centro $C$, e il centro si trova risolvendo il [sistema](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite) formato dalle due generatrici.

Con $k = 0$ si ottiene $r$. La retta $s$ invece non si ottiene per nessun valore di $k$: per far sparire $ax + by + c$ bisognerebbe moltiplicarla per zero, ma nell'equazione non ha un parametro davanti. La generatrice moltiplicata per $k$ è la **retta esclusa** dal fascio; tutte le altre rette per $C$ si ottengono per un valore di $k$, e uno solo.

Se invece $r$ e $s$ sono parallele, la combinazione dà rette parallele a tutte e due: il fascio è improprio. In questo caso c'è un valore di $k$ per cui i coefficienti di $x$ e di $y$ si annullano insieme, e l'equazione non è più una retta (esempio 5).

Per studiare un fascio scritto con $k$ nei coefficienti:

1. Svolgi i prodotti e separa i termini con $k$ da quelli senza, raccogliendo $k$: ottieni la forma $(\dots) + k(\dots) = 0$.
2. Le due espressioni, uguagliate a zero, sono le generatrici $r$ e $s$.
3. Se $r$ e $s$ sono incidenti, il fascio è proprio: il centro è la soluzione del sistema tra $r$ e $s$.
4. Se $r$ e $s$ sono parallele, il fascio è improprio.
5. La retta esclusa è $s$, quella moltiplicata per $k$.

```ad-example
Esempio 3: centro e retta esclusa
Studia il fascio $(1 + k)x + (1 - k)y - 3 - k = 0$.

Svolgi i prodotti e separa i termini con $k$:

$$
\begin{gathered}
x + kx + y - ky - 3 - k = 0 \\
\Rightarrow x + y - 3 \, + \\
k(x - y - 1) = 0
\end{gathered}
$$

Le generatrici sono $r: x + y - 3 = 0$ e $s: x - y - 1 = 0$. Hanno coefficienti angolari $-1$ e $1$, quindi sono incidenti, e il fascio è proprio. Il centro è la soluzione del sistema:

$$
\begin{cases}
x + y = 3 \\
x - y = 1
\end{cases}
$$

Sommando le equazioni trovi $2x = 4$, cioè $x = 2$, e poi $y = 1$. Il centro è $C(2, 1)$, lo stesso dell'esempio 1. Verifica sull'equazione di partenza, con $x = 2$ e $y = 1$: $2 + 2k + 1 - k - 3 - k = 0$ per ogni $k$.

La retta esclusa è $s: x - y - 1 = 0$, cioè $y = x - 1$.
```

```tikz
% nome: fascio-generato-da-due-rette
% alt: Le generatrici r: x + y - 3 = 0 e s: x - y - 1 = 0 si incontrano nel centro C(2, 1); la retta s, esclusa dal fascio, è tratteggiata
% svg: fascio-generato-da-due-rette-e42a432b.svg 200x201
\begin{tikzpicture}[scale=0.7]
\draw[gray!25, very thin] (-1,-2) grid (5,4);
\draw[->] (-1.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,4.5) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.1) -- (\x,-0.1) node[below] {\small $\x$};
\foreach \y in {-1,1,2,3} \draw (0.1,\y) -- (-0.1,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-0.5,3.5) -- (4.5,-1.5);
\draw[thick, dashed, red!60] (-0.5,-1.5) -- (4.5,3.5);
\fill (2,1) circle (0.12);
\node[above] at (2,1.15) {$C$};
\node[blue!70!black, right] at (0,3.1) {$r$};
\node[red!60!black, right] at (4.3,3.2) {$s$};
\end{tikzpicture}
```

```ad-warning
Il termine noto nel raccoglimento
Nell'esempio 3 il termine noto $-3 - k$ va diviso in due: $-3$ resta con $x + y$, e $-k$ va dentro la parentesi di $k$ come $-1$. Chi lo dimentica scrive $s: x - y = 0$ e trova un centro sbagliato. Dopo aver raccolto, svolgi di nuovo i prodotti e controlla di ritrovare l'equazione di partenza.
```

Anche il fascio proprio $y - y_0 = m(x - x_0)$ è una combinazione lineare: scritto come $(y - y_0) - m(x - x_0) = 0$, ha per generatrici la retta orizzontale $y = y_0$ e la retta verticale $x = x_0$, e la retta esclusa è proprio quella verticale.

```ad-example
Esempio 4: una generatrice verticale
Studia il fascio $kx - y + 2 - 3k = 0$.

Separa i termini con $k$:

$$-y + 2 + k(x - 3) = 0$$

Le generatrici sono $r: y = 2$, orizzontale, e $s: x = 3$, verticale: sono incidenti, e il fascio è proprio. Il centro si legge senza conti, perché su $r$ si ha $y = 2$ e su $s$ si ha $x = 3$: è $C(3, 2)$. La retta esclusa è la verticale $x = 3$.

Ricavando $y$ si trova $y - 2 = k(x - 3)$: è il fascio di centro $C(3, 2)$ scritto con il coefficiente angolare, e $k$ fa la parte di $m$.
```

```ad-example
Esempio 5: generatrici parallele
Studia il fascio $(2 + 2k)x + (1 + k)y + k - 3 = 0$ e trova la retta del fascio che passa per l'origine.

Separa i termini con $k$:

$$
\begin{gathered}
2x + y - 3 \, + \\
k(2x + y + 1) = 0
\end{gathered}
$$

Le generatrici $2x + y - 3 = 0$ e $2x + y + 1 = 0$ hanno lo stesso coefficiente angolare $-2$ e ordinate all'origine diverse: sono parallele, e il fascio è improprio. Tutte le sue rette hanno $m = -2$.

Per $k = -1$ i coefficienti $2 + 2k$ e $1 + k$ valgono zero, e l'equazione diventa $-4 = 0$: per questo valore non c'è nessuna retta. La retta esclusa è la generatrice $2x + y + 1 = 0$.

Per la retta che passa per $O(0, 0)$ sostituisci $x = 0$ e $y = 0$: resta $k - 3 = 0$, cioè $k = 3$. La retta è $8x + 4y = 0$, cioè $2x + y = 0$.
```

## Problemi con i fasci

Negli esercizi il fascio è dato e si cerca la retta del fascio che ha una proprietà. Il metodo è sempre lo stesso: si traduce la proprietà in un'equazione in $k$, si risolve, e si sostituisce il valore trovato nel fascio. Negli esempi di questa sezione il fascio è quello dell'esempio 3:

$$(1 + k)x + (1 - k)y - 3 - k = 0$$

con centro $C(2, 1)$ e retta esclusa $x - y - 1 = 0$.

### La retta che passa per un punto

Si sostituiscono le coordinate del punto al posto di $x$ e $y$: resta un'equazione di primo grado in $k$.

```ad-example
Esempio 6: la retta per un punto
Trova la retta del fascio che passa per $A(4, 5)$.

Conviene sostituire nella forma con le generatrici, $x + y - 3 + k(x - y - 1) = 0$, perché i conti sono più corti:

$$
\begin{gathered}
4 + 5 - 3 + k(4 - 5 - 1) = 0 \\
\Rightarrow 6 - 2k = 0 \\
\Rightarrow k = 3
\end{gathered}
$$

Con $k = 3$ il fascio dà $4x - 2y - 6 = 0$, cioè $2x - y - 3 = 0$, oppure $y = 2x - 3$: è la retta trovata nell'esempio 1 con l'altro modo di scrivere il fascio.
```

```tikz
% nome: fascio-retta-per-un-punto
% alt: Nel fascio di centro C(2, 1) la retta che passa per A(4, 5) è y = 2x - 3; la retta esclusa x - y - 1 = 0 è tratteggiata e passa per B(3, 2)
% svg: fascio-retta-per-un-punto-e9dd801b.svg 200x230
\begin{tikzpicture}[scale=0.7]
\draw[gray!25, very thin] (-1,-2) grid (5,5);
\draw[->] (-1.3,0) -- (5.5,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,5.6) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.1) -- (\x,-0.1) node[below] {\small $\x$};
\foreach \y in {-1,1,2,3,4} \draw (0.1,\y) -- (-0.1,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (0.5,-2) -- (4,5);
\draw[thick, dashed, red!60] (-1,-2) -- (5,4);
\fill (2,1) circle (0.13);
\fill (4,5) circle (0.13);
\fill (3,2) circle (0.13);
\node[right] at (2.05,0.75) {$C$};
\node[right] at (4.05,5) {$A$};
\node[below right] at (3,2) {$B$};
\end{tikzpicture}
```

Con un punto della retta esclusa l'equazione in $k$ non ha soluzioni. Il punto $B(3, 2)$ sta sulla retta esclusa, perché $3 - 2 - 1 = 0$, e sostituendo si trova

$$
\begin{gathered}
3 + 2 - 3 + k(3 - 2 - 1) = 0 \\
\Rightarrow 2 + 0 \cdot k = 0
\end{gathered}
$$

cioè $2 = 0$, che è falso per ogni $k$. La retta per $C$ e per $B$ esiste: è proprio la retta esclusa, $x - y - 1 = 0$. Al contrario, sostituendo le coordinate del centro l'equazione diventa $0 = 0$, vera per ogni $k$: tutte le rette del fascio passano per $C$.

```ad-warning
Equazione in k impossibile, retta che esiste
Quando cerchi la retta del fascio per un punto e l'equazione in $k$ è impossibile, la risposta non è "nessuna retta": è la retta esclusa, se il punto sta su di lei. Controlla sempre la retta esclusa prima di scrivere la risposta.
```

### La retta parallela o perpendicolare a una retta data

Il coefficiente angolare di una retta del fascio si legge dalla forma implicita, $m = -\dfrac{a}{b}$, e dipende da $k$. Nel fascio dell'esempio 3 i coefficienti sono $a = 1 + k$ e $b = 1 - k$, quindi, per $k \neq 1$,

$$m = -\frac{1 + k}{1 - k}$$

Per $k = 1$ il coefficiente di $y$ si annulla e il fascio dà $2x - 4 = 0$, cioè la retta verticale $x = 2$, che non ha coefficiente angolare. Per $k = -1$ si annulla il coefficiente di $x$ e si ottiene $2y - 2 = 0$, la retta orizzontale $y = 1$.

Per la retta parallela a una retta data si uguaglia $m$ al coefficiente angolare della retta data; per la perpendicolare si impone che il prodotto dei due coefficienti angolari sia $-1$, come nella lezione sulle [rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari).

```ad-example
Esempio 7: la parallela e la perpendicolare
Trova la retta del fascio parallela a $3x + y - 1 = 0$ e quella perpendicolare a $x - 2y + 4 = 0$.

La retta $3x + y - 1 = 0$ ha $m = -3$. La parallela ha lo stesso coefficiente angolare:

$$
\begin{gathered}
-\frac{1 + k}{1 - k} = -3 \\
\Rightarrow 1 + k = 3(1 - k) \\
\Rightarrow 4k = 2 \\
\Rightarrow k = \frac{1}{2}
\end{gathered}
$$

Con $k = \dfrac{1}{2}$ il fascio dà $\dfrac{3}{2}x + \dfrac{1}{2}y - \dfrac{7}{2} = 0$, e moltiplicando per $2$ si ottiene $3x + y - 7 = 0$.

La retta $x - 2y + 4 = 0$ ha $m = \dfrac{1}{2}$, quindi la perpendicolare ha $m = -2$:

$$
\begin{gathered}
-\frac{1 + k}{1 - k} = -2 \\
\Rightarrow 1 + k = 2(1 - k) \\
\Rightarrow 3k = 1 \\
\Rightarrow k = \frac{1}{3}
\end{gathered}
$$

Con $k = \dfrac{1}{3}$ il fascio dà $\dfrac{4}{3}x + \dfrac{2}{3}y - \dfrac{10}{3} = 0$, cioè $2x + y - 5 = 0$. Verifica: tutte e due le rette passano per $C(2, 1)$, perché $6 + 1 - 7 = 0$ e $4 + 1 - 5 = 0$.
```

```ad-example
Esempio 8: la parallela è la retta esclusa
Trova la retta del fascio parallela alla bisettrice $y = x$.

La bisettrice ha $m = 1$:

$$
\begin{gathered}
-\frac{1 + k}{1 - k} = 1 \\
\Rightarrow -1 - k = 1 - k \\
\Rightarrow -1 = 1
\end{gathered}
$$

L'equazione è impossibile: nessun valore di $k$ dà una retta con $m = 1$. Ma la retta esclusa $x - y - 1 = 0$, cioè $y = x - 1$, ha proprio $m = 1$ e passa per $C$: è lei la retta cercata.

Anche la perpendicolare a una retta orizzontale va cercata a parte: è una retta verticale, che non ha $m$, e la formula $-\dfrac{1 + k}{1 - k}$ non la dà. Qui è la retta $x = 2$, che si ottiene per $k = 1$.
```

```ad-warning
Dividere per un'espressione che si annulla
La formula $m = -\dfrac{1 + k}{1 - k}$ vale solo per $k \neq 1$. Il valore $k = 1$, che annulla il denominatore, va studiato a parte, sostituendolo nel fascio: dà la retta verticale, che nelle domande sulla perpendicolare a una retta orizzontale è la risposta.
```
