# Funzioni iniettive, suriettive e biettive

Associa a ogni studente di una classe il suo numero sul registro: se conosci il numero, sai subito di quale studente si tratta, perché studenti diversi hanno numeri diversi. Associa invece a ogni studente il mese in cui è nato: in una classe di venticinque studenti almeno due sono nati nello stesso mese, dato che i mesi sono dodici, e dal mese non puoi risalire alla persona. Tutte e due sono funzioni, ma solo la prima si può percorrere all'indietro senza ambiguità. Le parole iniettiva, suriettiva e biettiva servono a descrivere con precisione questa differenza.

## Dominio, codominio e immagine

Una funzione $f: A \to B$ associa a ogni elemento $x$ dell'insieme $A$ uno e un solo elemento $f(x)$ dell'insieme $B$ (la definizione completa è nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione)). Ti servono tre nomi, spiegati più a fondo in [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine):

- il **dominio** è l'insieme di partenza $A$;
- il **codominio** è l'insieme di arrivo $B$, quello in cui la funzione prende i suoi valori;
- l'**immagine** di $f$, indicata con $\mathrm{Im}(f)$, è l'insieme dei valori che la funzione assume davvero: $\mathrm{Im}(f) = \{f(x) \mid x \in A\}$.

L'immagine è sempre contenuta nel codominio, ma può essere più piccola. Prendi $A = \{-1,\ 0,\ 1,\ 2\}$, $B = \{0,\ 1,\ 2,\ 3,\ 4\}$ e $f(x) = x^2$:

$$
\begin{gathered}
-1 \mapsto 1, \qquad 0 \mapsto 0, \\
1 \mapsto 1, \qquad 2 \mapsto 4
\end{gathered}
$$

L'immagine è $\{0,\ 1,\ 4\}$: i numeri $2$ e $3$ stanno nel codominio, ma nessun elemento di $A$ ci arriva.

Una funzione tra insiemi finiti si disegna bene con un **diagramma a frecce**: gli elementi di $A$ a sinistra, quelli di $B$ a destra, e una freccia da ogni $x$ al suo $f(x)$. Per essere una funzione, da ogni elemento di $A$ deve partire esattamente una freccia. Le tre proprietà di questa lezione riguardano invece le frecce che arrivano agli elementi di $B$.

Questo è il diagramma di $f(x) = x^2$ dell'esempio sopra: a $1$ arrivano due frecce, a $2$ e $3$ nessuna.

```tikz
% nome: diagramma-frecce-funzione-x-quadro
% alt: Diagramma a frecce della funzione x al quadrato da {-1, 0, 1, 2} a {0, 1, 2, 3, 4}: a 1 arrivano due frecce, a 2 e 3 nessuna
% svg: diagramma-frecce-funzione-x-quadro-11cd1f1a.svg 170x245
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.9);
\draw (3,0) ellipse (0.7 and 2.9);
\node at (0,3.25) {$A$};
\node at (3,3.25) {$B$};
\node (l0) at (0,1.35) {$-1$};
\node (l1) at (0,0.45) {$0$};
\node (l2) at (0,-0.45) {$1$};
\node (l3) at (0,-1.35) {$2$};
\node (r0) at (3,1.80) {$0$};
\node (r1) at (3,0.90) {$1$};
\node (r2) at (3,0.00) {$2$};
\node (r3) at (3,-0.90) {$3$};
\node (r4) at (3,-1.80) {$4$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (r4);
\end{tikzpicture}
```

## Funzione iniettiva

Una funzione $f: A \to B$ è **iniettiva** se elementi diversi del dominio hanno immagini diverse:

$$
\begin{gathered}
x_1 \neq x_2 \implies f(x_1) \neq f(x_2) \\
\text{per ogni } x_1, x_2 \in A
\end{gathered}
$$

La stessa condizione si scrive anche così, ed è la forma che si usa nelle dimostrazioni:

$$f(x_1) = f(x_2) \implies x_1 = x_2$$

Nel diagramma a frecce, una funzione è iniettiva quando a ogni elemento di $B$ arriva al massimo una freccia. Qualche elemento di $B$ può restare senza frecce: l'iniettività non lo vieta.

La funzione $f(x) = x^2$ dell'esempio precedente non è iniettiva, perché $-1$ e $1$ sono diversi ma hanno la stessa immagine, $1$.

```ad-warning
Confondere la definizione di funzione con l'iniettività
"Da ogni elemento di $A$ parte una sola freccia" è la condizione perché $f$ sia una funzione, e vale per tutte le funzioni. "A ogni elemento di $B$ arriva al massimo una freccia" è l'iniettività, e vale solo per alcune.
```

## Funzione suriettiva

Una funzione $f: A \to B$ è **suriettiva** se ogni elemento del codominio è immagine di almeno un elemento del dominio:

$$
\begin{gathered}
\text{per ogni } y \in B \text{ esiste almeno} \\
\text{un } x \in A \text{ tale che } f(x) = y
\end{gathered}
$$

Detto in un altro modo, $f$ è suriettiva quando l'immagine coincide con il codominio: $\mathrm{Im}(f) = B$. Nel diagramma a frecce, a ogni elemento di $B$ arriva almeno una freccia.

La funzione $f(x) = x^2$ dell'esempio precedente non è suriettiva, perché $2$ e $3$ stanno in $B$ ma non sono immagine di nessun elemento di $A$.

## Funzione biettiva

Una funzione $f: A \to B$ è **biettiva** (o **biunivoca**) se è sia iniettiva sia suriettiva. Questo vuol dire che ogni elemento di $B$ è immagine di uno e un solo elemento di $A$:

$$
\begin{gathered}
\text{per ogni } y \in B \text{ esiste uno} \\
\text{e un solo } x \in A \text{ tale che } f(x) = y
\end{gathered}
$$

Nel diagramma a frecce, a ogni elemento di $B$ arriva esattamente una freccia. Gli elementi di $A$ e quelli di $B$ sono accoppiati a due a due: per questo si parla anche di corrispondenza biunivoca.

| Proprietà | Quante frecce arrivano a ogni elemento di $B$ |
|---|---|
| iniettiva | al massimo una |
| suriettiva | almeno una |
| biettiva | esattamente una |

## Esempi con insiemi finiti

```ad-example
Esempio 1: iniettiva ma non suriettiva
$A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c,\ d\}$, con

$$1 \mapsto a, \qquad 2 \mapsto b, \qquad 3 \mapsto c$$

A $a$, $b$ e $c$ arriva una freccia sola, quindi la funzione è iniettiva. A $d$ non arriva nessuna freccia, quindi non è suriettiva.

```tikz
% nome: funzione-iniettiva-non-suriettiva
% alt: Diagramma a frecce di una funzione iniettiva ma non suriettiva: 1, 2, 3 vanno in a, b, c e a d non arriva nessuna freccia
% svg: funzione-iniettiva-non-suriettiva-8b3dff06.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$A$};
\node at (3,2.75) {$B$};
\node (l0) at (0,0.90) {$1$};
\node (l1) at (0,0.00) {$2$};
\node (l2) at (0,-0.90) {$3$};
\node (r0) at (3,1.35) {$a$};
\node (r1) at (3,0.45) {$b$};
\node (r2) at (3,-0.45) {$c$};
\node (r3) at (3,-1.35) {$d$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r2);
\end{tikzpicture}
```
```

```ad-example
Esempio 2: suriettiva ma non iniettiva
$A = \{1,\ 2,\ 3,\ 4\}$, $B = \{a,\ b,\ c\}$, con

$$
\begin{gathered}
1 \mapsto a, \qquad 2 \mapsto a, \\
3 \mapsto b, \qquad 4 \mapsto c
\end{gathered}
$$

Ogni elemento di $B$ riceve almeno una freccia, quindi la funzione è suriettiva. Ad $a$ ne arrivano due, da $1$ e da $2$, quindi non è iniettiva.

```tikz
% nome: funzione-suriettiva-non-iniettiva
% alt: Diagramma a frecce di una funzione suriettiva ma non iniettiva: 1 e 2 vanno entrambi in a, 3 in b e 4 in c
% svg: funzione-suriettiva-non-iniettiva-4b7cf81c.svg 170x207
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 2.4);
\draw (3,0) ellipse (0.7 and 2.4);
\node at (0,2.75) {$A$};
\node at (3,2.75) {$B$};
\node (l0) at (0,1.35) {$1$};
\node (l1) at (0,0.45) {$2$};
\node (l2) at (0,-0.45) {$3$};
\node (l3) at (0,-1.35) {$4$};
\node (r0) at (3,0.90) {$a$};
\node (r1) at (3,0.00) {$b$};
\node (r2) at (3,-0.90) {$c$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l3) -- (r2);
\end{tikzpicture}
```
```

```ad-example
Esempio 3: biettiva
$A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c\}$, con

$$1 \mapsto b, \qquad 2 \mapsto c, \qquad 3 \mapsto a$$

A ogni elemento di $B$ arriva esattamente una freccia: la funzione è biettiva.

```tikz
% nome: funzione-biettiva
% alt: Diagramma a frecce di una funzione biettiva: 1 va in b, 2 in c, 3 in a, e a ogni elemento arriva esattamente una freccia
% svg: funzione-biettiva-59ccabf5.svg 170x169
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 1.9);
\draw (3,0) ellipse (0.7 and 1.9);
\node at (0,2.25) {$A$};
\node at (3,2.25) {$B$};
\node (l0) at (0,0.90) {$1$};
\node (l1) at (0,0.00) {$2$};
\node (l2) at (0,-0.90) {$3$};
\node (r0) at (3,0.90) {$a$};
\node (r1) at (3,0.00) {$b$};
\node (r2) at (3,-0.90) {$c$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r1);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r2);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r0);
\end{tikzpicture}
```
```

```ad-tip
Contare gli elementi
Con insiemi finiti, prima di guardare le frecce conta gli elementi. Se $A$ ha più elementi di $B$, la funzione non può essere iniettiva: qualche elemento di $B$ riceve per forza almeno due frecce (è quello che succede con i venticinque studenti e i dodici mesi). Se $A$ ha meno elementi di $B$, non può essere suriettiva. Una funzione biettiva tra insiemi finiti richiede quindi che $A$ e $B$ abbiano lo stesso numero di elementi, ma questo da solo non basta: la funzione $x \mapsto x^2$ da $\{-1,\ 0,\ 1\}$ a $\{-1,\ 0,\ 1\}$ ha tre elementi da entrambe le parti e non è né iniettiva né suriettiva.
```

## Come si verifica ciascuna proprietà

Per le funzioni tra insiemi di numeri, come $f: \mathbb{R} \to \mathbb{R}$, le frecce non si possono disegnare tutte. Si ragiona con l'algebra o con il grafico.

### Con l'algebra

Per dimostrare che $f$ è iniettiva, supponi $f(x_1) = f(x_2)$ e ricava, con passaggi validi per qualunque $x_1$ e $x_2$ del dominio, che $x_1 = x_2$. Per dimostrare che non è iniettiva è sufficiente un controesempio: due numeri diversi del dominio con la stessa immagine.

Per dimostrare che $f$ è suriettiva, prendi un $y$ qualsiasi del codominio e risolvi l'equazione $f(x) = y$ nell'incognita $x$. Se trovi sempre una soluzione, e questa appartiene al dominio, la funzione è suriettiva. Per dimostrare che non lo è, trova un $y$ del codominio per cui l'equazione non ha soluzioni nel dominio.

Provare qualche valore non dimostra che una funzione è iniettiva o suriettiva: un esempio può solo smentirlo.

### Con il grafico: le rette orizzontali

Se hai il grafico di una funzione reale $f: A \to B$, traccia le rette orizzontali $y = k$ al variare di $k$ nel codominio $B$ e conta quante volte ciascuna incontra il grafico:

- $f$ è iniettiva se ogni retta orizzontale incontra il grafico al massimo una volta;
- $f$ è suriettiva se ogni retta $y = k$, con $k \in B$, incontra il grafico almeno una volta;
- $f$ è biettiva se ogni retta $y = k$, con $k \in B$, incontra il grafico esattamente una volta.

Il grafico di $f(x) = 2x + 1$ è una retta obliqua, e ogni retta orizzontale la incontra in un punto solo. Il grafico di $f(x) = x^2$ è una parabola con il vertice nell'origine: la retta $y = 4$ la incontra in due punti, di ascissa $-2$ e $2$, mentre la retta $y = -1$ non la incontra.

A sinistra la retta, incontrata una volta da ogni retta orizzontale; a destra la parabola, con $y = 4$ che la incontra due volte e $y = -1$ che non la incontra.

```tikz
% nome: test-rette-orizzontali-retta-parabola
% alt: Test delle rette orizzontali: ogni retta orizzontale incontra una volta la retta y = 2x + 1, mentre y = 4 incontra due volte la parabola y = x al quadrato e y = -1 non la incontra
% svg: test-rette-orizzontali-retta-parabola-ce8a41f9.svg 509x316
\begin{tikzpicture}
\draw[->] (-2.5,0) -- (2.5,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,4.5) node[above] {$y$};
\draw[thick, blue, domain=-1.75:1.75, samples=2] plot (\x, {2*\x + 1});
\draw[dashed] (-2.5,-1) -- (2.5,-1);
\draw[dashed] (-2.5,1) -- (2.5,1);
\draw[dashed] (-2.5,3) -- (2.5,3);
\node at (0,-3) {$y = 2x + 1$};
\begin{scope}[xshift=7cm]
\draw[->] (-2.5,0) -- (2.5,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,4.5) node[above] {$y$};
\draw[thick, blue, domain=-2.1:2.1, samples=60, smooth] plot (\x, {\x*\x});
\draw[dashed] (-2.5,4) -- (2.5,4) node[right] {$y = 4$};
\draw[dashed] (-2.5,-1) -- (2.5,-1) node[right] {$y = -1$};
\fill (-2,4) circle (0.07);
\fill (2,4) circle (0.07);
\node at (0,-3) {$y = x^2$};
\end{scope}
\end{tikzpicture}
```

```ad-warning
Rette orizzontali e rette verticali
Le rette verticali servono a riconoscere se un grafico è quello di una funzione: ogni retta verticale $x = k$, con $k$ nel dominio, deve incontrarlo esattamente una volta. Le rette orizzontali servono a riconoscere se la funzione è iniettiva o suriettiva. Non scambiare i due controlli.
```

## Esempi con funzioni reali

```ad-example
Esempio 4: una funzione lineare, biettiva
$f: \mathbb{R} \to \mathbb{R}$, $f(x) = 2x + 1$.

Iniettiva: se $2x_1 + 1 = 2x_2 + 1$, sottraendo $1$ e dividendo per $2$ ottieni $x_1 = x_2$.

Suriettiva: preso un qualsiasi $y \in \mathbb{R}$, l'equazione $2x + 1 = y$ ha la soluzione $x = \dfrac{y - 1}{2}$, che è un numero reale.

La funzione è biettiva.
```

```ad-example
Esempio 5: x² su tutti i reali
$f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$.

Non è iniettiva: $f(-2) = f(2) = 4$, con $-2 \neq 2$.

Non è suriettiva: $y = -1$ sta nel codominio, ma l'equazione $x^2 = -1$ non ha soluzioni reali, perché un quadrato non è mai negativo.
```

```ad-example
Esempio 6: x² con il codominio ristretto
$f: \mathbb{R} \to [0, +\infty)$, $f(x) = x^2$.

La formula è la stessa, ma ora il codominio contiene solo i numeri maggiori o uguali a zero. Per ogni $y \geq 0$ l'equazione $x^2 = y$ ha la soluzione $x = \sqrt{y}$, quindi la funzione è suriettiva. Resta non iniettiva, perché $f(-2) = f(2)$ anche adesso.
```

```ad-example
Esempio 7: x² con il dominio ristretto
$f: [0, +\infty) \to \mathbb{R}$, $f(x) = x^2$.

Ora il dominio contiene solo numeri non negativi. Se $x_1^2 = x_2^2$, allora $x_1 = x_2$ oppure $x_1 = -x_2$; con $x_1$ e $x_2$ entrambi maggiori o uguali a zero, la seconda possibilità vale solo se sono tutti e due $0$, e quindi in ogni caso $x_1 = x_2$. La funzione è iniettiva. Non è suriettiva, perché $-1$ sta ancora nel codominio e non viene raggiunto.
```

```ad-example
Esempio 8: stessa formula, insiemi diversi
$f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x$.

È iniettiva: da $2x_1 = 2x_2$ segue $x_1 = x_2$. Non è suriettiva: le immagini sono tutte numeri pari, e un numero dispari come $3$ non viene mai raggiunto, perché $2x = 3$ dà $x = \dfrac{3}{2}$, che non è un intero. La stessa formula su $\mathbb{Q} \to \mathbb{Q}$ è invece biettiva: per ogni $y$ razionale, $x = \dfrac{y}{2}$ è razionale.
```

Riassumendo gli esempi con $x^2$: restringere il dominio può rendere iniettiva una funzione che non lo era, restringere il codominio può renderla suriettiva.

| Funzione | Dominio e codominio | Iniettiva | Suriettiva | Biettiva |
|---|---|---|---|---|
| $2x + 1$ | $\mathbb{R} \to \mathbb{R}$ | sì | sì | sì |
| $x^2$ | $\mathbb{R} \to \mathbb{R}$ | no | no | no |
| $x^2$ | $\mathbb{R} \to [0, +\infty)$ | no | sì | no |
| $x^2$ | $[0, +\infty) \to \mathbb{R}$ | sì | no | no |
| $x^2$ | $[0, +\infty) \to [0, +\infty)$ | sì | sì | sì |

```ad-warning
Parlare di suriettività senza il codominio
La domanda "$x^2$ è suriettiva?" non ha risposta finché non si dice qual è il codominio: da $\mathbb{R}$ a $\mathbb{R}$ non lo è, da $\mathbb{R}$ a $[0, +\infty)$ sì. Lo stesso vale per l'iniettività e il dominio. Scrivi sempre la funzione nella forma $f: A \to B$.
```

## Funzioni biettive e funzioni inverse

Una funzione $f: A \to B$ è **invertibile** se esiste una funzione $f^{-1}: B \to A$ che fa il percorso inverso, cioè che a ogni $y \in B$ associa l'elemento $x \in A$ da cui $y$ proviene. Vale questo risultato:

$$f \text{ è invertibile} \iff f \text{ è biettiva}$$

Le due condizioni servono entrambe. Se $f$ non è iniettiva, qualche $y$ proviene da due elementi diversi, e $f^{-1}(y)$ non saprebbe quale scegliere. Se $f$ non è suriettiva, qualche $y$ di $B$ non proviene da nessun elemento, e $f^{-1}(y)$ non avrebbe un valore. In entrambi i casi $f^{-1}$ non sarebbe una funzione.

Per trovare l'inversa di una funzione biettiva si risolve $y = f(x)$ rispetto a $x$. Per $f(x) = 2x + 1$ da $\mathbb{R}$ a $\mathbb{R}$ si ottiene $x = \dfrac{y - 1}{2}$, quindi $f^{-1}(y) = \dfrac{y - 1}{2}$. Per $f(x) = x^2$ da $[0, +\infty)$ a $[0, +\infty)$, che è biettiva, l'inversa è la radice quadrata, $f^{-1}(y) = \sqrt{y}$. Le funzioni inverse hanno una lezione dedicata, [Composizione e funzione inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/composizione-e-funzione-inversa).

## Errori frequenti

```ad-warning
Pensare che iniettiva voglia dire crescente
Una funzione sempre crescente, o sempre decrescente, su tutto il dominio è iniettiva, perché due valori diversi di $x$ danno valori diversi di $f(x)$. Il contrario non vale: $f(x) = \dfrac{1}{x}$, con dominio i reali diversi da zero, è iniettiva (da $\dfrac{1}{x_1} = \dfrac{1}{x_2}$ segue $x_1 = x_2$), ma su tutto il dominio non è né decrescente, perché $-1 < 1$ e anche $f(-1) = -1 < f(1) = 1$, né crescente, perché $1 < 2$ ma $f(1) = 1 > f(2) = \dfrac{1}{2}$.
```
