# Operazioni tra polinomi

Con i polinomi si fanno le stesse operazioni dei monomi, e ognuna si riduce a operazioni tra monomi: la somma algebrica è una riduzione dei termini simili, il prodotto è una catena di prodotti tra monomi tenuti insieme dalla proprietà distributiva. La somma e il prodotto di due polinomi sono sempre un polinomio; il quoziente di un polinomio per un monomio lo è solo a certe condizioni.

Le regole sui monomi (somma di monomi simili, prodotto, quoziente) sono nella lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi); cosa sono i termini, la forma normale e il grado di un polinomio li trovi in [polinomi e grado di un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio). In tutta la lezione i risultati sono ridotti e ordinati secondo le potenze decrescenti di una lettera.

## Somma algebrica

Per sommare due o più polinomi togli le parentesi e poi riduci i termini simili. Come si toglie una parentesi dipende dal segno che la precede:

- se davanti c'è un $+$ (o niente, all'inizio), i termini restano come sono: $+(2x - 5) = 2x - 5$;
- se davanti c'è un $-$, cambi il segno a ogni termine dentro la parentesi: $-(2x - 5) = -2x + 5$.

Il **polinomio opposto** di un polinomio $P$ è il polinomio $-P$ che ha tutti i termini di $P$ con il segno cambiato. L'opposto di $3x^2 - x + 4$ è $-3x^2 + x - 4$, e la somma di un polinomio con il suo opposto è $0$, il polinomio nullo. Sottrarre un polinomio vuol dire sommare il suo opposto, ed è per questo che il $-$ davanti alla parentesi cambia il segno a tutti i termini.

```ad-example
Esempio 1: una somma
$$(3x^2 - 5x + 2) + (x^2 + 4x - 7)$$

Il $+$ davanti alla seconda parentesi non cambia niente:

$$3x^2 - 5x + 2 + x^2 + 4x - 7$$

Riduci i termini simili: $3x^2 + x^2 = 4x^2$, $-5x + 4x = -x$, $2 - 7 = -5$.

$$4x^2 - x - 5$$
```

```ad-example
Esempio 2: una differenza in cui un termine si annulla
$$
\begin{aligned}
&(2x^2y - 3xy + y^2) \\
&\quad - (x^2y - 3xy - 4y^2)
\end{aligned}
$$

Il $-$ davanti alla seconda parentesi cambia il segno a tutti e tre i suoi termini:

$$
\begin{aligned}
&2x^2y - 3xy + y^2 \\
&\quad - x^2y + 3xy + 4y^2
\end{aligned}
$$

$-3xy$ e $+3xy$ sono opposti e si annullano; restano $2x^2y - x^2y = x^2y$ e $y^2 + 4y^2 = 5y^2$.

$$x^2y + 5y^2$$
```

```ad-warning
Cambiare segno solo al primo termine
$-(x^2 - 3x + 1) = -x^2 + 3x - 1$, non $-x^2 - 3x + 1$. Il segno meno davanti alla parentesi vale per tutti i termini che ci sono dentro, anche l'ultimo.
```

```ad-example
Esempio 3: coefficienti frazionari
$$
\begin{aligned}
&\left(\frac{1}{2}a^2 - \frac{2}{3}ab + b^2\right) \\
&\quad - \left(\frac{3}{4}a^2 + \frac{1}{6}ab - 2b^2\right)
\end{aligned}
$$

Togli le parentesi, cambiando i segni della seconda:

$$
\begin{aligned}
&\frac{1}{2}a^2 - \frac{2}{3}ab + b^2 \\
&\quad - \frac{3}{4}a^2 - \frac{1}{6}ab + 2b^2
\end{aligned}
$$

Riduci i termini simili, uno per volta:

$$
\begin{gathered}
\frac{1}{2} - \frac{3}{4} = \frac{2}{4} - \frac{3}{4} = -\frac{1}{4} \\
-\frac{2}{3} - \frac{1}{6} = -\frac{4}{6} - \frac{1}{6} = -\frac{5}{6} \\
1 + 2 = 3
\end{gathered}
$$

$$-\frac{1}{4}a^2 - \frac{5}{6}ab + 3b^2$$
```

## Prodotto di un monomio per un polinomio

Per moltiplicare un monomio per un polinomio usi la **proprietà distributiva** della moltiplicazione rispetto alla somma, $a(b + c) = ab + ac$: moltiplichi il monomio per ciascun termine del polinomio e sommi i prodotti. Ognuno di questi è un prodotto tra monomi, quindi moltiplichi i coefficienti con la regola dei segni e sommi gli esponenti delle lettere uguali.

$$
\begin{aligned}
2x(3x^2 - 4) &= 2x \cdot 3x^2 + 2x \cdot (-4) \\
&= 6x^3 - 8x
\end{aligned}
$$

```ad-example
Esempio 4: un monomio negativo
$$-3x^2y\,(2x^2 - xy + 4y^2)$$

Moltiplica $-3x^2y$ per ogni termine, con il suo segno:

$$
\begin{gathered}
(-3x^2y)\cdot(2x^2) = -6x^4y \\
(-3x^2y)\cdot(-xy) = +3x^3y^2 \\
(-3x^2y)\cdot(4y^2) = -12x^2y^3
\end{gathered}
$$

$$-6x^4y + 3x^3y^2 - 12x^2y^3$$

Il monomio è negativo, quindi ogni termine del risultato ha il segno opposto a quello che aveva nel polinomio.
```

```ad-example
Esempio 5: coefficienti frazionari
$$\frac{2}{3}ab^2\left(\frac{3}{4}a^2 - 6ab + \frac{9}{2}b\right)$$

$$
\begin{gathered}
\frac{2}{3}\cdot\frac{3}{4} = \frac{1}{2} \qquad \frac{2}{3}\cdot(-6) = -4 \\
\frac{2}{3}\cdot\frac{9}{2} = 3
\end{gathered}
$$

Per le lettere sommi gli esponenti: $ab^2 \cdot a^2 = a^3b^2$, $ab^2 \cdot ab = a^2b^3$, $ab^2 \cdot b = ab^3$.

$$\frac{1}{2}a^3b^2 - 4a^2b^3 + 3ab^3$$
```

```ad-warning
Moltiplicare solo il primo termine
$2x(x + 3) = 2x^2 + 6x$, non $2x^2 + 3$. Il monomio va moltiplicato per tutti i termini della parentesi, compreso il termine noto.
```

## Prodotto di due polinomi

Per moltiplicare due polinomi applichi la proprietà distributiva due volte: ogni termine del primo polinomio si moltiplica per ogni termine del secondo.

$$(a + b)(c + d) = ac + ad + bc + bd$$

Se il primo polinomio ha $m$ termini e il secondo $n$, prima della riduzione i prodotti sono $m \cdot n$: con un binomio e un trinomio sono $2 \cdot 3 = 6$. Contarli è un buon modo per accorgersi di averne dimenticato uno.

1. Moltiplica il primo termine del primo polinomio per tutti i termini del secondo.
2. Fai lo stesso con il secondo termine del primo polinomio, poi con il terzo, e così via.
3. Riduci i termini simili.
4. Ordina il risultato secondo le potenze decrescenti di una lettera.

```ad-example
Esempio 6: due binomi
$$
\begin{aligned}
&(x + 3)(x + 2) \\
&= x \cdot x + x \cdot 2 + 3 \cdot x + 3 \cdot 2 \\
&= x^2 + 2x + 3x + 6 \\
&= x^2 + 5x + 6
\end{aligned}
$$

Se $x$ è una lunghezza, il prodotto è l'area di un rettangolo di lati $x + 3$ e $x + 2$. Il rettangolo si divide in quattro parti, una per ogni prodotto: $x^2$, $3x$, $2x$ e $6$.

```tikz
% nome: prodotto-di-due-binomi-rettangolo
% alt: Rettangolo di base x più 3 e altezza x più 2, diviso in quattro rettangoli più piccoli di area x al quadrato, 3x, 2x e 6
% svg: prodotto-di-due-binomi-rettangolo-48714038.svg 196x173
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (3.9,3.4);
\draw (2.4,0) -- (2.4,3.4);
\draw (0,2.4) -- (3.9,2.4);
\node at (1.2,1.2) {$x^2$};
\node at (3.15,1.2) {$3x$};
\node at (1.2,2.9) {$2x$};
\node at (3.15,2.9) {$6$};
\draw (0,-0.12) -- (0,-0.32);
\draw (2.4,-0.12) -- (2.4,-0.32);
\draw (3.9,-0.12) -- (3.9,-0.32);
\draw[<->] (0,-0.22) -- (2.4,-0.22);
\draw[<->] (2.4,-0.22) -- (3.9,-0.22);
\node[below, text height=1.5ex] at (1.2,-0.3) {$x$};
\node[below, text height=1.5ex] at (3.15,-0.3) {$3$};
\draw (-0.12,0) -- (-0.32,0);
\draw (-0.12,2.4) -- (-0.32,2.4);
\draw (-0.12,3.4) -- (-0.32,3.4);
\draw[<->] (-0.22,0) -- (-0.22,2.4);
\draw[<->] (-0.22,2.4) -- (-0.22,3.4);
\node[left] at (-0.3,1.2) {$x$};
\node[left] at (-0.3,2.9) {$2$};
\path (-1,-0.9) rectangle (4.1,3.6);
\end{tikzpicture}
```
```

```ad-warning
Moltiplicare solo i primi e gli ultimi termini
$(x + 2)(x + 5)$ non è $x^2 + 10$: mancano i due prodotti "in croce", $x \cdot 5$ e $2 \cdot x$. Il risultato giusto è $x^2 + 5x + 2x + 10 = x^2 + 7x + 10$.
```

```ad-example
Esempio 7: un binomio per un trinomio
$$(2x - 3)(x^2 - 4x + 5)$$

I prodotti sono $2 \cdot 3 = 6$. Prima $2x$ per ogni termine del trinomio, poi $-3$ per ogni termine:

$$2x^3 - 8x^2 + 10x - 3x^2 + 12x - 15$$

Riduci i termini simili: $-8x^2 - 3x^2 = -11x^2$ e $10x + 12x = 22x$.

$$2x^3 - 11x^2 + 22x - 15$$
```

```ad-warning
Sbagliare il segno di un prodotto
Ogni prodotto ha il suo segno, dato dalla regola dei segni: in $(x - 3)(x - 4)$ il prodotto $(-3)\cdot(-4)$ vale $+12$, non $-12$. Il risultato è $x^2 - 4x - 3x + 12 = x^2 - 7x + 12$.
```

```ad-example
Esempio 8: due lettere
$$(x^2 - 2xy + 3y^2)(2x - y)$$

Qui il polinomio con più termini è il primo: moltiplica ogni suo termine per $2x$ e per $-y$.

$$
\begin{aligned}
&2x^3 - x^2y - 4x^2y \\
&\quad + 2xy^2 + 6xy^2 - 3y^3
\end{aligned}
$$

Riduci: $-x^2y - 4x^2y = -5x^2y$ e $2xy^2 + 6xy^2 = 8xy^2$. Il risultato, ordinato secondo le potenze decrescenti di $x$, è

$$2x^3 - 5x^2y + 8xy^2 - 3y^3$$
```

```ad-example
Esempio 9: coefficienti frazionari
$$\left(\frac{1}{2}x - \frac{2}{3}\right)\left(4x + \frac{3}{2}\right)$$

$$
\begin{aligned}
&\frac{1}{2}x \cdot 4x = 2x^2 \\
&\frac{1}{2}x \cdot \frac{3}{2} = \frac{3}{4}x \\
&-\frac{2}{3}\cdot 4x = -\frac{8}{3}x \\
&-\frac{2}{3}\cdot\frac{3}{2} = -1
\end{aligned}
$$

I due termini di primo grado si sommano con il denominatore comune $12$:

$$\frac{3}{4}x - \frac{8}{3}x = \frac{9}{12}x - \frac{32}{12}x = -\frac{23}{12}x$$

$$2x^2 - \frac{23}{12}x - 1$$
```

```ad-example
Esempio 10: tre fattori
$$(x - 1)(x + 1)(x + 2)$$

Il prodotto tra polinomi è associativo: moltiplica i primi due e poi il risultato per il terzo.

$$
\begin{aligned}
(x - 1)(x + 1) &= x^2 + x - x - 1 \\
&= x^2 - 1
\end{aligned}
$$

$$
\begin{aligned}
&(x^2 - 1)(x + 2) \\
&= x^3 + 2x^2 - x - 2
\end{aligned}
$$

Il primo prodotto ha due termini che si annullano: non è un caso, è uno dei prodotti notevoli.
```

```ad-note
Prodotti con una regola veloce
Alcuni prodotti, come $(x - 1)(x + 1)$ o il quadrato $(x + 3)^2 = (x + 3)(x + 3)$, tornano così spesso che hanno una regola per scrivere subito il risultato. Li trovi nella lezione sui [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli).
```

```ad-tip
Controllare un prodotto con un numero
Sostituisci alla lettera un numero, per esempio $x = 2$, sia nel prodotto di partenza sia nel risultato: se i due valori sono diversi c'è un errore. Nell'esempio 7, $(2 \cdot 2 - 3)(2^2 - 4 \cdot 2 + 5) = 1 \cdot 1 = 1$ e $2 \cdot 8 - 11 \cdot 4 + 22 \cdot 2 - 15 = 1$. Con $x = 1$ il controllo è più veloce ma non si accorge degli esponenti sbagliati, perché $1^2 = 1^3 = 1$.
```

## Il grado della somma e del prodotto

Il grado del risultato si può prevedere prima di fare i conti, e confrontarlo con quello che ottieni è un altro controllo.

Il grado del prodotto di due polinomi non nulli è la somma dei loro gradi. Con una sola lettera il motivo si vede subito: il termine di grado più alto del prodotto è il prodotto dei due termini di grado più alto dei fattori, e nessun altro prodotto ha lo stesso grado, quindi non si può annullare. Nell'esempio 7, $(2x - 3)$ ha grado $1$ e $(x^2 - 4x + 5)$ grado $2$: il prodotto ha grado $1 + 2 = 3$. La regola vale anche per il grado rispetto a una lettera: nell'esempio 8 il grado rispetto a $y$ è $2 + 1 = 3$, e infatti c'è il termine $-3y^3$.

Il grado della somma algebrica di due polinomi è al massimo il più grande dei due gradi. Se i due gradi sono diversi, è proprio il più grande; se sono uguali, può essere minore, perché i termini di grado più alto possono annullarsi:

$$(x^3 + 2x) + (-x^3 + x^2) = x^2 + 2x$$

I due polinomi hanno grado $3$, la loro somma grado $2$. Se si annullano tutti i termini, come in $P + (-P)$, il risultato è il polinomio nullo, che non ha grado.

```ad-warning
Sommare i gradi in una somma
Il grado si somma nel prodotto, non nella somma: $(x^2 + 1) + (x^3 - x)$ ha grado $3$, non $5$. È la stessa differenza che c'è tra $x^2 + x^3$ e $x^2 \cdot x^3 = x^5$.
```

## Divisione di un polinomio per un monomio

Per dividere un polinomio per un monomio diverso da zero dividi ciascun termine del polinomio per il monomio e sommi i quozienti, come nella proprietà distributiva:

$$
\begin{aligned}
&(A + B + C) : M \\
&= A : M + B : M + C : M
\end{aligned}
$$

Il risultato è un polinomio solo se ogni termine del polinomio è divisibile per il monomio, cioè se ogni lettera del monomio compare in ogni termine con un esponente maggiore o uguale. In questo caso si dice che il polinomio è **divisibile** per il monomio. Il grado del quoziente è il grado del polinomio meno il grado del monomio, perché ogni termine perde lo stesso numero di gradi.

```ad-example
Esempio 11: un termine che diventa 1
$$(12x^4y^2 - 8x^3y^3 + 4x^2y) : (4x^2y)$$

Ogni termine contiene $x$ con esponente almeno $2$ e $y$ con esponente almeno $1$, quindi la divisione si può fare:

$$
\begin{gathered}
12x^4y^2 : 4x^2y = 3x^2y \\
-8x^3y^3 : 4x^2y = -2xy^2 \\
4x^2y : 4x^2y = 1
\end{gathered}
$$

$$3x^2y - 2xy^2 + 1$$

Il polinomio ha grado $6$, il monomio $3$: il quoziente ha grado $6 - 3 = 3$.
```

```ad-warning
Perdere il termine uguale al divisore
$4x^2y : 4x^2y = 1$, e l'$1$ resta nel risultato. Scrivere $3x^2y - 2xy^2$ senza il $+1$ vuol dire aver trattato il quoziente come se fosse $0$. Moltiplicando per $4x^2y$ il risultato sbagliato non ritrovi il polinomio di partenza.
```

```ad-example
Esempio 12: un divisore negativo con coefficiente frazionario
$$
\begin{aligned}
&\left(-\frac{3}{2}a^3b^2 + \frac{9}{4}a^2b^3 - 3ab^4\right) \\
&\quad : \left(-\frac{3}{4}ab^2\right)
\end{aligned}
$$

Dividere per $-\frac{3}{4}$ vuol dire moltiplicare per $-\frac{4}{3}$, quindi ogni coefficiente cambia segno:

$$
\begin{gathered}
-\frac{3}{2}\cdot\left(-\frac{4}{3}\right) = 2 \\
\frac{9}{4}\cdot\left(-\frac{4}{3}\right) = -3 \\
-3\cdot\left(-\frac{4}{3}\right) = 4
\end{gathered}
$$

Per le lettere sottrai gli esponenti: $a^3b^2 : ab^2 = a^2$, $a^2b^3 : ab^2 = ab$, $ab^4 : ab^2 = b^2$.

$$2a^2 - 3ab + 4b^2$$
```

```ad-example
Esempio 13: un quoziente che non è un polinomio
$$(6x^3 + 4x^2 - 2x + 5) : (2x)$$

I primi tre termini sono divisibili per $2x$ e danno $3x^2 + 2x - 1$, ma il termine noto $5$ non contiene la $x$: $5 : 2x = \dfrac{5}{2x}$, che ha la lettera al denominatore. Il quoziente non è un polinomio, e il polinomio non è divisibile per $2x$.
```

```ad-tip
Controllare una divisione
Moltiplica il quoziente per il monomio: devi ritrovare il polinomio di partenza. Nell'esempio 12, $-\frac{3}{4}ab^2\,(2a^2 - 3ab + 4b^2) = -\frac{3}{2}a^3b^2 + \frac{9}{4}a^2b^3 - 3ab^4$.
```

La divisione di un polinomio per un altro polinomio, con quoziente e resto, è nella lezione sulla [divisione tra polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/divisione-tra-polinomi).
