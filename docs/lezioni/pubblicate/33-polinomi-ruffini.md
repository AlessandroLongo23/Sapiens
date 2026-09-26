# Regola di Ruffini e teorema del resto

Quando il divisore è un binomio di primo grado come $x - 3$ o $x + 2$, la [divisione tra polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/divisione-tra-polinomi) in colonna si può sostituire con una tabella di numeri: la **regola di Ruffini**. I conti sono gli stessi, ma si scrivono solo i coefficienti, e la divisione si fa in poche righe. Dalla stessa idea vengono due teoremi che permettono di trovare il resto senza dividere e di sapere in anticipo se una divisione è esatta.

In tutta la lezione i polinomi sono in una variabile $x$ e si scrivono come $P(x)$ (la notazione è spiegata in [polinomi e grado di un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio)).

## Che cosa si ottiene

Dividere $P(x)$ per $x - a$, dove $a$ è un numero, vuol dire trovare il quoziente $Q(x)$ e il resto $R$ tali che

$$P(x) = (x - a) \cdot Q(x) + R$$

Il divisore ha grado $1$, quindi il resto ha grado minore di $1$: è un numero. Il quoziente ha un grado in meno di $P(x)$: dividendo un polinomio di terzo grado si ottiene un quoziente di secondo grado.

Il numero $a$ è quello che si sottrae a $x$ nel divisore. Per $x - 3$ è $a = 3$; per $x + 2$, che si può scrivere $x - (-2)$, è $a = -2$.

## La tabella di Ruffini

Per dividere $2x^3 - 5x^2 + x + 7$ per $x - 3$ si scrivono in una riga i coefficienti del dividendo, con il termine noto separato da una linea, e a sinistra, una riga più in basso, il numero $a = 3$:

$$\begin{array}{r|rrr|r} & 2 & -5 & 1 & 7 \\ 3 & & & & \\ \hline & & & & \end{array}$$

Poi si riempie la tabella da sinistra a destra, ripetendo sempre gli stessi due gesti:

1. Abbassi il primo coefficiente, $2$, sotto la linea orizzontale.
2. Moltiplichi per $3$ il numero appena scritto sotto la linea, $2 \cdot 3 = 6$, e scrivi il prodotto nella colonna successiva, sotto il $-5$.
3. Sommi i due numeri della colonna, $-5 + 6 = 1$, e scrivi la somma sotto la linea.
4. Ripeti i passi 2 e 3 fino all'ultima colonna: $1 \cdot 3 = 3$ e $1 + 3 = 4$; poi $4 \cdot 3 = 12$ e $7 + 12 = 19$.

$$\begin{array}{r|rrr|r} & 2 & -5 & 1 & 7 \\ 3 & & 6 & 3 & 12 \\ \hline & 2 & 1 & 4 & 19 \end{array}$$

```tikz
% nome: regola-di-ruffini-schema
% alt: Tabella di Ruffini per dividere 2x alla terza meno 5x al quadrato più x più 7 per x meno 3: il primo coefficiente 2 scende sotto la linea, ogni numero sotto la linea moltiplicato per 3 va nella colonna successiva, e la somma di ogni colonna dà i coefficienti del quoziente 2, 1, 4 e il resto 19
% svg: regola-di-ruffini-schema-6d40fdc7.svg 273x123
\begin{tikzpicture}
\draw (0.7,1.9) -- (0.7,-0.8);
\draw (5.3,1.9) -- (5.3,-0.8);
\draw (-0.3,0.2) -- (6.8,0.2);
\node at (0,0.8) {$3$};
\node at (1.6,1.5) {$2$};
\node at (3.0,1.5) {$-5$};
\node at (4.4,1.5) {$1$};
\node at (6.0,1.5) {$7$};
\node at (3.0,0.8) {$6$};
\node at (4.4,0.8) {$3$};
\node at (6.0,0.8) {$12$};
\node at (1.6,-0.4) {$2$};
\node at (3.0,-0.4) {$1$};
\node at (4.4,-0.4) {$4$};
\node at (6.0,-0.4) {$19$};
\draw[->, dashed] (1.6,1.25) -- (1.6,-0.15);
\draw[->] (1.8,-0.25) -- (2.75,0.65);
\draw[->] (3.2,-0.25) -- (4.15,0.65);
\draw[->] (4.6,-0.25) -- (5.7,0.65);
\node[font=\small] at (2.05,0.35) {$\cdot 3$};
\node[font=\small] at (3.45,0.35) {$\cdot 3$};
\node[font=\small] at (4.9,0.35) {$\cdot 3$};
\node[font=\small, below] at (3.0,-0.75) {quoziente};
\node[font=\small, below] at (6.0,-0.75) {resto};
\end{tikzpicture}
```

L'ultima riga si legge così: il numero nell'ultima colonna, $19$, è il resto; gli altri, $2$, $1$ e $4$, sono i coefficienti del quoziente, a partire dal grado più alto. Il dividendo è di terzo grado, quindi il quoziente è di secondo:

$$Q(x) = 2x^2 + x + 4 \qquad R = 19$$

Per controllare, moltiplica il quoziente per il divisore e aggiungi il resto: devi ritrovare il dividendo.

$$
\begin{aligned}
&(x - 3)(2x^2 + x + 4) + 19 \\
&= 2x^3 + x^2 + 4x \\
&\quad - 6x^2 - 3x - 12 + 19 \\
&= 2x^3 - 5x^2 + x + 7
\end{aligned}
$$

```ad-note
Perché la tabella funziona
Prendi un dividendo di terzo grado $p_3x^3 + p_2x^2 + p_1x + p_0$ e un quoziente di secondo grado $q_2x^2 + q_1x + q_0$. Svolgendo il prodotto si trova
$$
\begin{aligned}
&(x - a)(q_2x^2 + q_1x + q_0) + R \\
&= q_2x^3 + (q_1 - aq_2)x^2 \\
&\quad + (q_0 - aq_1)x + (R - aq_0)
\end{aligned}
$$
e, perché sia uguale al dividendo, i coefficienti devono essere $q_2 = p_3$, $q_1 = p_2 + aq_2$, $q_0 = p_1 + aq_1$, $R = p_0 + aq_0$. Sono proprio i conti della tabella: il primo coefficiente scende, e ogni altro numero è il coefficiente sopra più $a$ per il numero precedente.
```

## Come si procede

1. Ordina il dividendo secondo le potenze decrescenti di $x$ e completalo: per ogni potenza che manca scrivi un coefficiente $0$.
2. Scrivi i coefficienti nella prima riga, con il termine noto separato da una linea verticale.
3. Trova $a$ dal divisore $x - a$ (per $x + 2$ è $a = -2$) e scrivilo a sinistra, nella seconda riga.
4. Abbassa il primo coefficiente; poi, colonna per colonna, moltiplica per $a$ l'ultimo numero scritto sotto la linea, mettilo nella colonna successiva e somma.
5. L'ultimo numero è il resto; gli altri sono i coefficienti del quoziente, che ha un grado in meno del dividendo.

```ad-warning
Dimenticare i termini mancanti
In $x^4 - 5x^2 + 3x - 2$ manca il termine in $x^3$. Se scrivi solo $1$, $-5$, $3$, $-2$, la tabella tratta il polinomio come se fosse $x^3 - 5x^2 + 3x - 2$ e il risultato è sbagliato. La prima riga giusta è $1$, $0$, $-5$, $3$, $-2$: un coefficiente per ogni potenza, dalla quarta fino al termine noto.
```

```ad-warning
Il segno di $a$
Per dividere per $x + 2$ a sinistra si scrive $-2$, non $2$: il divisore è $x - a$, e $x + 2 = x - (-2)$. Per $x - 5$ si scrive $5$. In pratica $a$ è il numero che rende zero il divisore.
```

La regola vale solo per divisori della forma $x - a$, con la $x$ di grado $1$ e coefficiente $1$. Per dividere per $x^2 - 1$ o per $x^2 + x + 1$ serve la [divisione in colonna](/materiale/scuola-superiore/matematica/monomi-e-polinomi/divisione-tra-polinomi); per un divisore come $2x - 1$ c'è un adattamento, spiegato più avanti.

## Esempi svolti

```ad-example
Esempio 1: un resto uguale a zero
Dividi $x^3 - 3x^2 + 4$ per $x - 2$.

Manca il termine in $x$, quindi i coefficienti sono $1$, $-3$, $0$, $4$. Il divisore è $x - 2$, quindi $a = 2$.
$$\begin{array}{r|rrr|r} & 1 & -3 & 0 & 4 \\ 2 & & 2 & -2 & -4 \\ \hline & 1 & -1 & -2 & 0 \end{array}$$
I conti, colonna per colonna: $-3 + 2 = -1$; $0 + (-2) = -2$; $4 + (-4) = 0$.

$Q(x) = x^2 - x - 2$ e $R = 0$: la divisione è esatta, e $x^3 - 3x^2 + 4 = (x - 2)(x^2 - x - 2)$.
```

```ad-example
Esempio 2: $a$ negativo e dividendo incompleto
Dividi $x^4 - 5x^2 + 3x - 2$ per $x + 2$.

Il dividendo è di quarto grado e manca il termine in $x^3$: i coefficienti sono $1$, $0$, $-5$, $3$, $-2$. Il divisore è $x + 2 = x - (-2)$, quindi $a = -2$.
$$\begin{array}{r|rrrr|r} & 1 & 0 & -5 & 3 & -2 \\ -2 & & -2 & 4 & 2 & -10 \\ \hline & 1 & -2 & -1 & 5 & -12 \end{array}$$
Ogni prodotto va fatto con il segno: $1 \cdot (-2) = -2$, poi $(-2)\cdot(-2) = 4$, poi $(-1)\cdot(-2) = 2$, poi $5 \cdot (-2) = -10$.

Il quoziente è di terzo grado: $Q(x) = x^3 - 2x^2 - x + 5$, e $R = -12$.
```

```ad-example
Esempio 3: $a$ frazionario
Dividi $2x^3 + x^2 - 4x + 3$ per $x - \frac{1}{2}$.

Qui $a = \frac{1}{2}$. I prodotti diventano metà dei numeri sotto la linea:
$$\begin{array}{r|rrr|r} & 2 & 1 & -4 & 3 \\ \frac{1}{2} & & 1 & 1 & -\frac{3}{2} \\ \hline & 2 & 2 & -3 & \frac{3}{2} \end{array}$$
$2 \cdot \frac{1}{2} = 1$ e $1 + 1 = 2$; $2 \cdot \frac{1}{2} = 1$ e $-4 + 1 = -3$; $(-3)\cdot\frac{1}{2} = -\frac{3}{2}$ e $3 - \frac{3}{2} = \frac{3}{2}$.

$Q(x) = 2x^2 + 2x - 3$ e $R = \frac{3}{2}$. Il resto può essere una frazione anche se tutti i coefficienti del dividendo sono interi.
```

## Divisore del tipo $ax - b$

Con un divisore come $2x - 1$, dove la $x$ ha un coefficiente diverso da $1$, la tabella si usa con un passaggio in più. Si raccoglie il coefficiente: $2x - 1 = 2\left(x - \frac{1}{2}\right)$. Si divide il dividendo per $x - \frac{1}{2}$ con la regola di Ruffini, e si ottiene $P(x) = \left(x - \frac{1}{2}\right) \cdot Q_1(x) + R$. Poiché $x - \frac{1}{2}$ è la metà di $2x - 1$, il quoziente vero è la metà di $Q_1(x)$, mentre il resto non cambia:

$$P(x) = (2x - 1) \cdot \frac{Q_1(x)}{2} + R$$

In generale, per dividere per $ax - b$ si usa la tabella con $\frac{b}{a}$, poi si dividono per $a$ i coefficienti del quoziente; il resto resta quello della tabella.

```ad-example
Esempio 4: divisione per $2x - 1$
Dividi $4x^3 - 2x^2 + 6x - 1$ per $2x - 1$.

$2x - 1 = 2\left(x - \frac{1}{2}\right)$, quindi nella tabella si usa $\frac{1}{2}$:
$$\begin{array}{r|rrr|r} & 4 & -2 & 6 & -1 \\ \frac{1}{2} & & 2 & 0 & 3 \\ \hline & 4 & 0 & 6 & 2 \end{array}$$
La tabella dà $Q_1(x) = 4x^2 + 6$ e $R = 2$. Dividendo per $2$ i coefficienti del quoziente:
$$Q(x) = 2x^2 + 3 \qquad R = 2$$
Controllo: $(2x - 1)(2x^2 + 3) + 2 = 4x^3 + 6x - 2x^2 - 3 + 2 = 4x^3 - 2x^2 + 6x - 1$.
```

```ad-warning
Dividere anche il resto
Nella divisione per $ax - b$ si dividono per $a$ solo i coefficienti del quoziente. Il resto è quello che compare nell'ultima colonna della tabella: nell'esempio 4 è $2$, non $1$.
```

## Il teorema del resto

Per sapere il resto della divisione di $P(x)$ per $x - a$ non serve fare la divisione: si calcola il [valore numerico](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio) del polinomio per $x = a$.

**Teorema del resto**: il resto della divisione di $P(x)$ per $x - a$ è $P(a)$.

Il perché viene dall'uguaglianza della divisione, $P(x) = (x - a) \cdot Q(x) + R$, che vale per ogni valore di $x$. Se al posto di $x$ metti $a$, il primo fattore diventa $a - a = 0$ e il prodotto si annulla:

$$
\begin{aligned}
P(a) &= (a - a) \cdot Q(a) + R \\
&= 0 + R \\
&= R
\end{aligned}
$$

Nella prima divisione della lezione, per esempio, $P(x) = 2x^3 - 5x^2 + x + 7$ e $a = 3$: $P(3) = 54 - 45 + 3 + 7 = 19$, lo stesso resto trovato con la tabella.

```ad-example
Esempio 5: il resto senza dividere
Trova il resto della divisione di $x^5 - 3x^3 + 2x - 1$ per $x + 1$.

Il divisore è $x - (-1)$, quindi il resto è $P(-1)$:
$$
\begin{aligned}
&P(-1) \\
&= (-1)^5 - 3 \cdot (-1)^3 \\
&\quad + 2 \cdot (-1) - 1 \\
&= -1 + 3 - 2 - 1 \\
&= -1
\end{aligned}
$$
Il resto è $-1$. Con la tabella servirebbero sei colonne; il teorema del resto dà la risposta in una riga, ma non dà il quoziente.
```

Per un divisore $ax - b$ il resto è il valore del polinomio nel numero che annulla il divisore, cioè $P\left(\frac{b}{a}\right)$: dividendo $3x^3 - 2x + 5$ per $3x + 1$, il resto è $P\left(-\frac{1}{3}\right) = -\frac{1}{9} + \frac{2}{3} + 5 = \frac{50}{9}$.

```ad-tip
Un controllo veloce della tabella
Dopo una divisione con la regola di Ruffini, calcola $P(a)$: deve uscire lo stesso numero dell'ultima colonna. Se non esce, c'è un errore in un prodotto o in una somma. Nell'esempio 2, $P(-2) = 16 - 20 - 6 - 2 = -12$, come nella tabella.
```

## Il teorema di Ruffini

Un numero $a$ si chiama **zero** del polinomio $P(x)$ (alcuni libri dicono radice) se $P(a) = 0$. Per esempio $2$ è uno zero di $x^3 - 7x + 6$, perché $8 - 14 + 6 = 0$.

**Teorema di Ruffini**: il polinomio $P(x)$ è divisibile per $x - a$ se e solo se $P(a) = 0$.

È una conseguenza del teorema del resto. $P(x)$ è divisibile per $x - a$ quando il resto è $0$, e il resto è $P(a)$: quindi la divisione è esatta proprio quando $P(a) = 0$. In quel caso l'uguaglianza della divisione diventa

$$P(x) = (x - a) \cdot Q(x)$$

e il polinomio è scritto come prodotto di due fattori.

```ad-example
Esempio 6: verificare la divisibilità
Stabilisci se $P(x) = x^3 - 6x^2 + 11x - 6$ è divisibile per $x - 1$ e per $x + 1$.

Per $x - 1$ calcoli $P(1) = 1 - 6 + 11 - 6 = 0$: il polinomio è divisibile per $x - 1$.

Per $x + 1$ calcoli $P(-1) = -1 - 6 - 11 - 6 = -24$: il resto è $-24$, quindi il polinomio non è divisibile per $x + 1$.
```

```ad-example
Esempio 7: dallo zero alla scomposizione
Verifica che $x^3 - 7x + 6$ è divisibile per $x - 2$ e scrivilo come prodotto.

$P(2) = 8 - 14 + 6 = 0$, quindi la divisione è esatta. Con la tabella, completando con $0$ il termine in $x^2$:
$$\begin{array}{r|rrr|r} & 1 & 0 & -7 & 6 \\ 2 & & 2 & 4 & -6 \\ \hline & 1 & 2 & -3 & 0 \end{array}$$
Il quoziente è $x^2 + 2x - 3$, quindi
$$
\begin{aligned}
&x^3 - 7x + 6 \\
&= (x - 2)(x^2 + 2x - 3)
\end{aligned}
$$
```

Come si trovano gli zeri di un polinomio quando nessuno li dà, e come si usa questa idea per scomporre un polinomio fino in fondo, è nella lezione sulla [scomposizione con la regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).

```ad-example
Esempio 8: trovare un coefficiente
Trova il valore di $k$ per cui $x^3 + kx^2 - 4x + 4$ è divisibile per $x - 2$.

Per il teorema di Ruffini deve essere $P(2) = 0$:
$$P(2) = 8 + 4k - 8 + 4 = 4k + 4$$
$4k + 4 = 0$ dà $k = -1$. Controllo: con $k = -1$ il polinomio è $x^3 - x^2 - 4x + 4$ e $P(2) = 8 - 4 - 8 + 4 = 0$.
```

```ad-warning
Confondere il divisore con lo zero
$x + 3$ divide $P(x)$ se $P(-3) = 0$, non se $P(3) = 0$. Il numero da sostituire è quello che annulla il divisore: per $x + 3$ è $-3$, per $x - 3$ è $3$.
```
