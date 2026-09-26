# Composizione e funzione inversa

Un negozio online toglie il $20\%$ da ogni prezzo e poi aggiunge $5$ euro di spedizione. Un articolo da $50$ euro scende a $40$ euro con lo sconto e sale a $45$ euro con la spedizione: hai applicato due funzioni una dopo l'altra, e insieme formano una nuova funzione, che porta dal prezzo di listino al totale da pagare. Questa operazione si chiama composizione. La funzione inversa fa il cammino contrario, e dal totale pagato risale al prezzo di listino.

## Funzione composta

Siano $f: A \to B$ e $g: B \to C$ due funzioni (se la notazione non ti è chiara, riparti da [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione)). La **funzione composta** $g \circ f$ è la funzione da $A$ a $C$ che a ogni $x \in A$ associa $g(f(x))$:

$$
\begin{gathered}
g \circ f: A \to C \\
(g \circ f)(x) = g(f(x))
\end{gathered}
$$

Il simbolo $g \circ f$ si legge "g composto f". Prima si applica $f$ a $x$ e si ottiene $f(x)$, che sta in $B$; poi si applica $g$ a $f(x)$ e si arriva in $C$. Nella scrittura $g \circ f$ la funzione che agisce per prima è quella a destra, la più vicina alla $x$, proprio come in $g(f(x))$.

Nel negozio, lo sconto è $f(x) = 0{,}8x$ e la spedizione è $g(x) = x + 5$. La lettera $x$ in $g$ indica solo il numero su cui $g$ lavora: al posto di $x$ va quello che entra in $g$, cioè $0{,}8x$. La funzione composta è

$$(g \circ f)(x) = 0{,}8x + 5$$

e infatti $(g \circ f)(50) = g(40) = 45$.

### Quando si può comporre

Perché $g(f(x))$ abbia senso, il numero $f(x)$ deve stare nel dominio di $g$, e questo per ogni $x$ del dominio di $f$. La condizione è quindi che l'immagine di $f$ sia contenuta nel dominio di $g$. Quando le funzioni sono scritte come $f: A \to B$ e $g: B \to C$, la condizione è già soddisfatta, perché l'immagine di $f$ sta sempre nel codominio $B$, che è anche il dominio di $g$ (dominio, codominio e immagine sono spiegati in [Dominio, codominio e immagine](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/dominio-codominio-e-immagine)).

```ad-example
Esempio 1: con insiemi finiti
$A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c,\ d\}$, $C = \{10,\ 20\}$, con $f: A \to B$ e $g: B \to C$ date così:

$$
\begin{gathered}
f: \ 1 \mapsto b, \quad 2 \mapsto a, \quad 3 \mapsto d \\
g: \ a \mapsto 10, \quad b \mapsto 20, \\
c \mapsto 20, \quad d \mapsto 10
\end{gathered}
$$

Per ogni elemento di $A$ segui prima la freccia di $f$ e poi quella di $g$:

$$
\begin{aligned}
(g \circ f)(1) &= g(b) = 20 \\
(g \circ f)(2) &= g(a) = 10 \\
(g \circ f)(3) &= g(d) = 10
\end{aligned}
$$

L'elemento $c$ non conta: nessuna freccia di $f$ ci arriva, quindi non entra nel percorso.

La composta nell'ordine opposto, $f \circ g$, non si può fare: $g$ porta in $C = \{10,\ 20\}$, e $f$ è definita solo sugli elementi di $A$, quindi $f(10)$ non ha senso.

```tikz
% nome: composizione-funzioni-insiemi-finiti
% alt: Diagramma a frecce di due funzioni in fila: f porta 1, 2, 3 in b, a, d, poi g porta a, b, c, d in 10, 20, 20, 10
% svg: composizione-funzioni-insiemi-finiti-ef35f765.svg 261x201
\begin{tikzpicture}
\draw (0,0) ellipse (0.6 and 1.9);
\draw (2.8,0) ellipse (0.6 and 2.3);
\draw (5.6,0) ellipse (0.6 and 1.5);
\node at (0,2.65) {$A$};
\node at (2.8,2.65) {$B$};
\node at (5.6,2.65) {$C$};
\node at (1.4,2.65) {$f$};
\node at (4.2,2.65) {$g$};
\node (a1) at (0,0.9) {$1$};
\node (a2) at (0,0) {$2$};
\node (a3) at (0,-0.9) {$3$};
\node (ba) at (2.8,1.35) {$a$};
\node (bb) at (2.8,0.45) {$b$};
\node (bc) at (2.8,-0.45) {$c$};
\node (bd) at (2.8,-1.35) {$d$};
\node (c1) at (5.6,0.45) {$10$};
\node (c2) at (5.6,-0.45) {$20$};
\draw[->, shorten >=2pt, shorten <=2pt] (a1) -- (bb);
\draw[->, shorten >=2pt, shorten <=2pt] (a2) -- (ba);
\draw[->, shorten >=2pt, shorten <=2pt] (a3) -- (bd);
\draw[->, shorten >=2pt, shorten <=2pt] (ba) -- (c1);
\draw[->, shorten >=2pt, shorten <=2pt] (bb) -- (c2);
\draw[->, shorten >=2pt, shorten <=2pt] (bc) -- (c2);
\draw[->, shorten >=2pt, shorten <=2pt] (bd) -- (c1);
\end{tikzpicture}
```
```

### Con le formule

Quando $f$ e $g$ sono date con una formula, per scrivere $(g \circ f)(x)$ prendi la formula di $g$ e metti $f(x)$ al posto di ogni $x$, tra parentesi. Per calcolare la composta in un numero, invece, puoi andare per passi: calcoli prima $f$ in quel numero, poi $g$ nel risultato.

```ad-example
Esempio 2: una funzione lineare e il quadrato
$f(x) = 2x + 1$ e $g(x) = x^2$, da $\mathbb{R}$ a $\mathbb{R}$.

In $g$ metti $2x + 1$ al posto di $x$:

$$
\begin{aligned}
(g \circ f)(x) &= (2x + 1)^2 \\
&= 4x^2 + 4x + 1
\end{aligned}
$$

Nell'ordine opposto, in $f$ metti $x^2$ al posto di $x$:

$$(f \circ g)(x) = 2x^2 + 1$$

In $x = 3$, per passi: $f(3) = 7$ e $g(7) = 49$, quindi $(g \circ f)(3) = 49$; invece $g(3) = 9$ e $f(9) = 19$, quindi $(f \circ g)(3) = 19$.
```

```ad-warning
Dimenticare le parentesi
Con $g(x) = x^2$ e $f(x) = 2x + 1$, la composta $g(f(x))$ è $(2x + 1)^2$ e non $2x + 1^2$: quello che prende il posto di $x$ va sempre tra parentesi. Scrivere $2x + 1^2$ vorrebbe dire elevare al quadrato solo l'$1$.
```

```ad-warning
Moltiplicare invece di comporre
$(g \circ f)(x)$ non è il prodotto $g(x) \cdot f(x)$. Nell'esempio 2 il prodotto sarebbe $x^2(2x + 1) = 2x^3 + x^2$, che è un'altra funzione: nella composizione una funzione entra dentro l'altra.
```

```ad-example
Esempio 3: la x compare due volte
$f(x) = x - 1$ e $g(x) = x^2 - 3x$, da $\mathbb{R}$ a $\mathbb{R}$.

In $g$ la $x$ compare due volte, e $x - 1$ va messo al posto di entrambe:

$$
\begin{aligned}
(g \circ f)(x) &= (x - 1)^2 - 3(x - 1) \\
&= x^2 - 2x + 1 - 3x + 3 \\
&= x^2 - 5x + 4
\end{aligned}
$$

Nell'ordine opposto, in $f$ metti $x^2 - 3x$ al posto di $x$, cioè togli $1$ dal risultato di $g$:

$$(f \circ g)(x) = x^2 - 3x - 1$$

Controllo in $x = 2$: $f(2) = 1$ e $g(1) = 1 - 3 = -2$; dalla formula, $4 - 10 + 4 = -2$.
```

```ad-example
Esempio 4: una funzione composta con sé stessa
$f(x) = 3x - 1$, da $\mathbb{R}$ a $\mathbb{R}$.

Quando dominio e codominio coincidono, una funzione si può comporre con sé stessa. $(f \circ f)(x) = f(f(x))$ vuol dire applicare $f$ due volte:

$$
\begin{aligned}
(f \circ f)(x) &= 3(3x - 1) - 1 \\
&= 9x - 3 - 1 \\
&= 9x - 4
\end{aligned}
$$

Controllo in $x = 1$: $f(1) = 2$ e $f(2) = 5$; dalla formula, $9 - 4 = 5$.
```

```ad-example
Esempio 5: quando la composta non è definita dappertutto
$f(x) = x - 2$, da $\mathbb{R}$ a $\mathbb{R}$, e $g(x) = \dfrac{1}{x}$, che ha come dominio i reali diversi da zero.

La formula della composta è

$$(g \circ f)(x) = \dfrac{1}{x - 2}$$

ma non vale per ogni $x$ reale: $f(2) = 0$, e $0$ non sta nel dominio di $g$. L'immagine di $f$ non è contenuta nel dominio di $g$, quindi $g \circ f$ si può fare solo togliendo il $2$ dal dominio di $f$. È la stessa condizione che scriveresti per la frazione, C.E.: $x \neq 2$ (le condizioni di esistenza sono spiegate in [Frazioni algebriche e condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza)).

Nell'ordine opposto non c'è nessun problema, perché $f$ accetta qualsiasi numero reale:

$$(f \circ g)(x) = \dfrac{1}{x} - 2$$

definita per ogni $x \neq 0$, cioè su tutto il dominio di $g$.
```

## La composizione non è commutativa

Torna al negozio e scambia l'ordine: prima la spedizione, poi lo sconto. Con $f(x) = 0{,}8x$ e $g(x) = x + 5$ ottieni

$$
\begin{aligned}
(f \circ g)(x) &= 0{,}8(x + 5) \\
&= 0{,}8x + 4
\end{aligned}
$$

Con lo sconto applicato per primo, un articolo da $50$ euro costa $45$ euro; con la spedizione per prima costa $44$ euro, perché lo sconto si prende anche sui $5$ euro. In generale $g \circ f$ e $f \circ g$ sono funzioni diverse, come negli esempi 2 e 3, e a volte una delle due non si può nemmeno fare, come nell'esempio 1. Per questo si dice che la composizione non è commutativa.

Qualche coppia di funzioni dà lo stesso risultato nei due ordini: con $f(x) = x + 2$ e $g(x) = x + 3$ entrambe le composte valgono $x + 5$. Sono casi particolari, e non si possono dare per scontati.

```ad-warning
Leggere $g \circ f$ da sinistra a destra
In $g \circ f$ la prima funzione che agisce è $f$, anche se si scrive per seconda. Se ti confondi, riscrivi $(g \circ f)(x)$ come $g(f(x))$: la funzione più vicina alla $x$ è quella che si calcola per prima.
```

## Funzione identità

Su ogni insieme $A$ c'è la funzione che lascia tutto com'è: la **funzione identità** di $A$, che a ogni elemento associa l'elemento stesso.

$$
\begin{gathered}
\mathrm{id}_A: A \to A \\
\mathrm{id}_A(x) = x
\end{gathered}
$$

Comporre una funzione con l'identità non la cambia. Se $f: A \to B$, allora

$$
\begin{gathered}
f \circ \mathrm{id}_A = f \\
\mathrm{id}_B \circ f = f
\end{gathered}
$$

perché $f(\mathrm{id}_A(x)) = f(x)$ e $\mathrm{id}_B(f(x)) = f(x)$. Nella composizione l'identità ha lo stesso ruolo che ha lo $0$ nell'addizione o l'$1$ nella moltiplicazione. Su $\mathbb{R}$ il grafico dell'identità $y = x$ è la retta che taglia a metà il primo e il terzo quadrante, detta **bisettrice** del primo e del terzo quadrante.

## Funzione inversa

Nella lezione [Funzioni iniettive, suriettive e biettive](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/funzioni-iniettive-suriettive-e-biettive) hai visto che una funzione si può percorrere all'indietro solo se è biettiva: se non è iniettiva, qualche elemento di $B$ proviene da due elementi diversi di $A$; se non è suriettiva, qualche elemento di $B$ non proviene da nessuno.

Se $f: A \to B$ è biettiva, la **funzione inversa** di $f$ è la funzione $f^{-1}: B \to A$ che a ogni $y \in B$ associa l'unico $x \in A$ tale che $f(x) = y$:

$$f^{-1}(y) = x \iff f(x) = y$$

Il simbolo $f^{-1}$ si legge "f alla meno uno", oppure "inversa di f". Nel diagramma a frecce l'inversa si ottiene rovesciando tutte le frecce di $f$: dominio e codominio si scambiano.

```ad-example
Esempio 6: l'inversa con insiemi finiti
$A = \{1,\ 2,\ 3\}$, $B = \{a,\ b,\ c\}$ e $f: A \to B$ data da

$$1 \mapsto b, \qquad 2 \mapsto c, \qquad 3 \mapsto a$$

A ogni elemento di $B$ arriva esattamente una freccia, quindi $f$ è biettiva. Rovesciando le frecce ottieni $f^{-1}: B \to A$:

$$a \mapsto 3, \qquad b \mapsto 1, \qquad c \mapsto 2$$

```tikz
% nome: funzione-inversa-insiemi-finiti
% alt: Diagramma a frecce della funzione inversa da B = {a, b, c} ad A = {1, 2, 3}: a va in 3, b va in 1, c va in 2
% svg: funzione-inversa-insiemi-finiti-83a452e7.svg 170x172
\begin{tikzpicture}
\draw (0,0) ellipse (0.7 and 1.9);
\draw (3,0) ellipse (0.7 and 1.9);
\node at (0,2.25) {$B$};
\node at (3,2.25) {$A$};
\node at (1.5,2.25) {$f^{-1}$};
\node (l0) at (0,0.90) {$a$};
\node (l1) at (0,0.00) {$b$};
\node (l2) at (0,-0.90) {$c$};
\node (r0) at (3,0.90) {$1$};
\node (r1) at (3,0.00) {$2$};
\node (r2) at (3,-0.90) {$3$};
\draw[->, shorten >=2pt, shorten <=2pt] (l0) -- (r2);
\draw[->, shorten >=2pt, shorten <=2pt] (l1) -- (r0);
\draw[->, shorten >=2pt, shorten <=2pt] (l2) -- (r1);
\end{tikzpicture}
```

Se invece $f$ portasse sia $1$ sia $2$ in $b$, rovesciando le frecce da $b$ ne partirebbero due, e $f^{-1}$ non sarebbe una funzione.
```

### L'inversa annulla la funzione

Se applichi $f$ e poi $f^{-1}$ torni al punto di partenza, e lo stesso succede nell'ordine opposto. In simboli:

$$
\begin{gathered}
f^{-1} \circ f = \mathrm{id}_A \\
f \circ f^{-1} = \mathrm{id}_B
\end{gathered}
$$

Nell'esempio 6, $f^{-1}(f(1)) = f^{-1}(b) = 1$ e $f(f^{-1}(a)) = f(3) = a$, e così per tutti gli altri elementi. Queste due uguaglianze sono anche il modo per controllare un'inversa che hai calcolato: se componendola con $f$ nei due ordini ottieni l'identità, è giusta.

```ad-warning
L'inversa non è il reciproco
In $f^{-1}$ l'esponente $-1$ non è una potenza: $f^{-1}(x)$ non è $\dfrac{1}{f(x)}$. Per $f(x) = 2x + 1$ l'inversa è $f^{-1}(x) = \dfrac{x - 1}{2}$ (si trova come nella prossima sezione), mentre il reciproco è $\dfrac{1}{2x + 1}$: con $x = 3$ la prima vale $1$ e il secondo $\dfrac{1}{7}$.
```

### L'inversa di una funzione lineare

Una funzione $f: \mathbb{R} \to \mathbb{R}$ della forma $f(x) = ax + b$, con $a \neq 0$, è biettiva, e quindi ha l'inversa. Per trovarla si ricava $x$, come in un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere) in cui $y$ è un numero qualsiasi:

1. Scrivi $y = ax + b$.
2. Ricava $x$ in funzione di $y$: ottieni $f^{-1}(y)$.
3. Scambia i nomi delle lettere, scrivendo $x$ al posto di $y$: ottieni $f^{-1}(x)$.
4. Controlla con un numero: se $f(p) = q$, deve essere $f^{-1}(q) = p$.

Il terzo passo non cambia la funzione: $f^{-1}(y) = \dfrac{y - 1}{2}$ e $f^{-1}(x) = \dfrac{x - 1}{2}$ sono la stessa funzione, scritta con due lettere diverse, e dicono entrambe "togli $1$ e dividi per $2$". Si scambiano le lettere perché di solito la variabile si chiama $x$, e perché così i grafici di $f$ e di $f^{-1}$ si possono disegnare nello stesso piano, con la $x$ sull'asse orizzontale.

Seguendo i passi con $a$ e $b$ qualsiasi, da $y = ax + b$ si ricava $x = \dfrac{y - b}{a}$, quindi

$$f^{-1}(x) = \dfrac{x - b}{a}$$

La formula non serve impararla: con i quattro passi la ritrovi ogni volta.

```ad-example
Esempio 7: coefficienti interi
$f(x) = 3x - 6$, da $\mathbb{R}$ a $\mathbb{R}$.

Scrivi $y = 3x - 6$ e ricava $x$:

$$
\begin{aligned}
y + 6 &= 3x \\
x &= \dfrac{y + 6}{3}
\end{aligned}
$$

Scambiando le lettere:

$$f^{-1}(x) = \dfrac{x + 6}{3} = \dfrac{1}{3}x + 2$$

Controllo: $f(4) = 12 - 6 = 6$ e $f^{-1}(6) = \dfrac{6 + 6}{3} = 4$.
```

```ad-example
Esempio 8: il coefficiente di x è negativo
$f(x) = -2x + 5$, da $\mathbb{R}$ a $\mathbb{R}$.

Da $y = -2x + 5$ porta il termine con la $x$ a sinistra e $y$ a destra, così il coefficiente di $x$ diventa positivo:

$$
\begin{aligned}
2x &= 5 - y \\
x &= \dfrac{5 - y}{2}
\end{aligned}
$$

Scambiando le lettere:

$$f^{-1}(x) = \dfrac{5 - x}{2}$$

Controllo con la composizione:

$$
\begin{aligned}
f^{-1}(f(x)) &= \dfrac{5 - (-2x + 5)}{2} \\
&= \dfrac{2x}{2} = x
\end{aligned}
$$
```

```ad-example
Esempio 9: il coefficiente di x è una frazione
$f(x) = \dfrac{2}{3}x - 4$, da $\mathbb{R}$ a $\mathbb{R}$.

Da $y = \dfrac{2}{3}x - 4$ porta il $-4$ a sinistra e moltiplica per $\dfrac{3}{2}$, il reciproco di $\dfrac{2}{3}$:

$$
\begin{aligned}
y + 4 &= \dfrac{2}{3}x \\
x &= \dfrac{3}{2}(y + 4) \\
&= \dfrac{3}{2}y + 6
\end{aligned}
$$

Scambiando le lettere:

$$f^{-1}(x) = \dfrac{3}{2}x + 6$$

Controllo: $f(0) = -4$ e $f^{-1}(-4) = -6 + 6 = 0$.
```

```ad-example
Esempio 10: una funzione che è l'inversa di sé stessa
$f(x) = 4 - x$, da $\mathbb{R}$ a $\mathbb{R}$.

Da $y = 4 - x$ ricavi $x = 4 - y$, e scambiando le lettere

$$f^{-1}(x) = 4 - x$$

L'inversa è la funzione stessa: applicare $f$ due volte riporta al punto di partenza, perché $f(f(x)) = 4 - (4 - x) = x$. Per esempio $f(1) = 3$ e $f(3) = 1$.
```

```ad-example
Esempio 11: una funzione costante non ha inversa
$f(x) = 5$, da $\mathbb{R}$ a $\mathbb{R}$, cioè $a = 0$ e $b = 5$.

Da $y = 5$ non puoi ricavare $x$, perché la $x$ non c'è. La funzione porta tutti i numeri in $5$, quindi non è iniettiva: da $5$ non si risale a un numero preciso. Non è nemmeno suriettiva, perché nessun $x$ va in $6$. Non ha l'inversa, ed è per questo che nella regola serve $a \neq 0$.
```

```ad-warning
Dimenticare di controllare che f sia biettiva
Il procedimento "ricava $x$" funziona solo se $f$ è biettiva. Con dominio e codominio diversi da $\mathbb{R}$ può non esserlo anche con $a \neq 0$: $f(x) = 2x$ da $\mathbb{Z}$ a $\mathbb{Z}$ non è suriettiva (i dispari non si raggiungono), e $x = \dfrac{y}{2}$ per $y = 3$ non è un intero.
```

## Il grafico della funzione inversa

Se il punto $(p, q)$ sta sul grafico di $f$, vuol dire che $f(p) = q$, cioè che $f^{-1}(q) = p$: quindi il punto $(q, p)$ sta sul grafico di $f^{-1}$. Il grafico dell'inversa si ottiene scambiando le coordinate di ogni punto del grafico di $f$ (come si disegna un grafico per punti è spiegato in [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione)).

Scambiare le coordinate ha un significato geometrico: i punti $(p, q)$ e $(q, p)$ sono simmetrici rispetto alla bisettrice $y = x$, come se la bisettrice fosse uno specchio. Per questo il grafico di $f^{-1}$ è il simmetrico del grafico di $f$ rispetto alla bisettrice del primo e del terzo quadrante.

Nella figura, $f(x) = 2x + 1$ e la sua inversa $f^{-1}(x) = \dfrac{x - 1}{2}$. Il punto $(1, 3)$ sta sul grafico di $f$ e il punto $(3, 1)$ su quello di $f^{-1}$: sono uno lo specchio dell'altro. Le due rette si incontrano in $(-1, -1)$, che sta sulla bisettrice: infatti $f(-1) = -1$, e un punto della bisettrice resta uguale quando scambi le coordinate.

```tikz
% nome: grafico-funzione-inversa-bisettrice
% alt: Grafici di f(x) = 2x + 1 e della sua inversa (x - 1)/2, simmetrici rispetto alla bisettrice y = x tratteggiata; i punti (1, 3) e (3, 1) sono uno lo specchio dell'altro
% svg: grafico-funzione-inversa-bisettrice-87705c0b.svg 254x236
\begin{tikzpicture}[scale=0.8]
\draw[->] (-2.5,0) -- (4.6,0) node[right] {$x$};
\draw[->] (0,-2.5) -- (0,4.6) node[above] {$y$};
\draw[dashed] (-2.5,-2.5) -- (4.4,4.4) node[right] {$y = x$};
\draw[thick, blue!70] (-1.75,-2.5) -- (1.75,4.5) node[left] {$f$};
\draw[thick, orange!80] (-2.5,-1.75) -- (4.5,1.75) node[below] {$f^{-1}$};
\draw[dotted] (1,3) -- (3,1);
\fill (1,3) circle (0.07) node[left] {$(1, 3)$};
\fill (3,1) circle (0.07) node[below right] {$(3, 1)$};
\fill (-1,-1) circle (0.07);
\end{tikzpicture}
```

Anche l'esempio 10 si legge sul grafico: la retta $y = 4 - x$ è perpendicolare alla bisettrice, quindi il suo simmetrico è la retta stessa, e infatti $f$ è l'inversa di sé stessa.
