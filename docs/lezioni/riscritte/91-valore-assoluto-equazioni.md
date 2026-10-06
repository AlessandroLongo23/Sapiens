# Equazioni e disequazioni con il valore assoluto

L'equazione $|x - 3| = 5$ chiede quali numeri stanno a distanza $5$ da $3$ sulla retta dei numeri. Sono due, $3 - 5 = -2$ e $3 + 5 = 8$, e infatti $|-2 - 3| = |-5| = 5$ e $|8 - 3| = 5$. Quando l'incognita sta dentro un valore assoluto, un'equazione si spezza di solito in due equazioni senza valore assoluto, e una disequazione in un sistema o in un'unione di disequazioni.

Il valore assoluto di un numero lo hai visto nella lezione [Numeri interi e valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto). Per le disequazioni ti servono i [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni) e le [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), con gli intervalli scritti allo stesso modo.

## Il valore assoluto di un'espressione

Il valore assoluto di un numero $a$ è $a$ stesso se $a \geq 0$, il suo opposto $-a$ se $a < 0$. Allo stesso modo, se $A(x)$ è un'espressione con l'incognita, il **valore assoluto** di $A(x)$ si definisce a tratti:

$$
|A(x)| = \begin{cases} A(x) & \text{se } A(x) \geq 0 \\ -A(x) & \text{se } A(x) < 0 \end{cases}
$$

L'espressione $A(x)$ dentro le sbarre si chiama **argomento** del valore assoluto. Per togliere le sbarre bisogna quindi sapere dove l'argomento è positivo o nullo e dove è negativo. Per esempio $x - 2 \geq 0$ per $x \geq 2$, quindi

$$
|x - 2| = \begin{cases} x - 2 & \text{se } x \geq 2 \\ -x + 2 & \text{se } x < 2 \end{cases}
$$

Con un argomento di secondo grado si studia il segno del trinomio: $x^2 - 4$ è positivo o nullo per $x \leq -2$ oppure $x \geq 2$ e negativo tra $-2$ e $2$, quindi $|x^2 - 4|$ vale $x^2 - 4$ fuori da $-2$ e $2$ e $-x^2 + 4$ in mezzo.

Dalla definizione vengono tre fatti che si usano sempre:

- $|A(x)| \geq 0$ per ogni $x$, e $|A(x)| = 0$ solo dove $A(x) = 0$;
- $|A(x)| = |-A(x)|$: per esempio $|2 - x| = |x - 2|$;
- $|x - a|$ è la distanza tra $x$ e $a$ sulla retta dei numeri: $|x - 2|$ è la distanza di $x$ da $2$, $|x + 1| = |x - (-1)|$ la distanza di $x$ da $-1$.

Nel [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) il grafico di $y = |x|$ è formato da due semirette: $y = x$ per $x \geq 0$ e $y = -x$ per $x < 0$. Ha la forma di una V con il vertice nell'origine e sta tutto sopra l'asse $x$, tranne il vertice. Il grafico di $y = |x - 2|$ è lo stesso, spostato di $2$ verso destra, con il vertice in $(2, 0)$: lì l'argomento vale zero.

```tikz
% nome: grafico-valore-assoluto-x-e-x-meno-2
% alt: Nel piano cartesiano il grafico di y uguale al valore assoluto di x, una V con il vertice nell'origine, e il grafico di y uguale al valore assoluto di x meno 2, la stessa V spostata di 2 verso destra con il vertice nel punto (2, 0)
% svg: grafico-valore-assoluto-x-e-x-meno-2-23b65263.svg 279x112
\begin{tikzpicture}
\draw[gray!25, very thin, step=0.5] (-1.75,0) grid (2.75,1.75);
\draw[->] (-1.85,0) -- (2.95,0) node[right] {$x$};
\draw[->] (0,-0.15) -- (0,2.00) node[above] {$y$};
\node[below] at (-1.50,0) {\scriptsize $-3$};
\node[below] at (-1.00,0) {\scriptsize $-2$};
\node[below] at (-0.50,0) {\scriptsize $-1$};
\node[below] at (0.50,0) {\scriptsize $1$};
\node[below] at (1.00,0) {\scriptsize $2$};
\node[below] at (1.50,0) {\scriptsize $3$};
\node[below] at (2.00,0) {\scriptsize $4$};
\node[below] at (2.50,0) {\scriptsize $5$};
\draw[blue!60, line width=1.4pt] (-1.65,1.65) -- (0.00,0.00) -- (1.65,1.65);
\fill (0.00,0) circle (1.6pt);
\draw[red!60, line width=1.4pt] (-0.65,1.65) -- (1.00,0.00) -- (2.65,1.65);
\fill (1.00,0) circle (1.6pt);
\node[blue!70, left] at (-1.65,1.65) {\small $y=|x|$};
\node[red!70, right] at (2.65,1.65) {\small $y=|x-2|$};
\end{tikzpicture}
```

```ad-warning
Togliere le sbarre senza guardare il segno
$|x - 3|$ non è sempre $x - 3$: per $x = 1$ vale $|-2| = 2$, mentre $x - 3 = -2$. Le sbarre si tolgono lasciando l'argomento com'è solo dove l'argomento è positivo o nullo; dove è negativo si cambia segno a tutto l'argomento, $-(x - 3) = -x + 3$.
```

## Equazioni del tipo |A(x)| = k

Se $k$ è un numero, l'equazione $|A(x)| = k$ ha tre casi, secondo il segno di $k$.

| $\lvert A(x) \rvert = k$ | Si risolve | Perché |
|---|---|---|
| $k < 0$ | impossibile | un valore assoluto non è mai negativo |
| $k = 0$ | $A(x) = 0$ | vale zero solo se l'argomento vale zero |
| $k > 0$ | $A(x) = -k$ oppure $A(x) = k$ | i numeri con valore assoluto $k$ sono $k$ e $-k$ |

Per esempio $|3x + 2| = -1$ è impossibile, $|x - 4| = 0$ ha la sola soluzione $x = 4$, e $|x - 3| = 5$ dà $x - 3 = -5$ oppure $x - 3 = 5$, cioè $x = -2$ oppure $x = 8$.

```ad-example
Esempio 1: argomento di primo grado
$$|2x - 1| = 5$$

Il secondo membro è positivo: l'argomento vale $5$ oppure $-5$.

$$
\begin{gathered}
2x - 1 = 5 \ \Rightarrow \ x = 3 \\
2x - 1 = -5 \ \Rightarrow \ x = -2
\end{gathered}
$$

$S = \{-2, 3\}$. Verifica: $|2 \cdot 3 - 1| = 5$ e $|2 \cdot (-2) - 1| = |-5| = 5$.
```

```ad-example
Esempio 2: argomento di secondo grado
$$|x^2 - 5| = 4$$

$$
\begin{gathered}
x^2 - 5 = 4 \ \Rightarrow \ x^2 = 9 \ \Rightarrow \ x = \pm 3 \\
x^2 - 5 = -4 \ \Rightarrow \ x^2 = 1 \ \Rightarrow \ x = \pm 1
\end{gathered}
$$

Ognuna delle due equazioni è una [pura](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) con due soluzioni: $S = \{-3, -1, 1, 3\}$.
```

```ad-warning
Il secondo membro negativo
Da $|x| = -3$ non si ricava $x = \pm 3$: $|3| = 3$ e $|-3| = 3$, e nessuno dei due vale $-3$. Un valore assoluto uguale a un numero negativo non ha soluzioni.
```

## Equazioni del tipo |A(x)| = |B(x)|

Due numeri hanno lo stesso valore assoluto quando sono uguali oppure opposti. Quindi

$$
\begin{gathered}
|A(x)| = |B(x)| \\
\Updownarrow \\
A(x) = B(x) \ \text{ oppure } \ A(x) = -B(x)
\end{gathered}
$$

Qui non servono condizioni: tutti e due i membri sono valori assoluti, e le soluzioni delle due equazioni vanno tutte bene.

```ad-example
Esempio 3: due valori assoluti uguali
$$|x - 3| = |2x + 1|$$

$$
\begin{gathered}
x - 3 = 2x + 1 \ \Rightarrow \ x = -4 \\
x - 3 = -2x - 1 \ \Rightarrow \ x = \frac{2}{3}
\end{gathered}
$$

$S = \left\{-4, \dfrac{2}{3}\right\}$. Verifica con $x = -4$: $|-7| = 7$ e $|-7| = 7$.
```

```ad-warning
Cambiare segno a un solo termine
Nella seconda equazione il segno meno va davanti a tutto $B(x)$: $x - 3 = -(2x + 1)$, cioè $x - 3 = -2x - 1$. Chi scrive $x - 3 = -2x + 1$ trova $x = \dfrac{4}{3}$, che non è una soluzione: $\left|\dfrac{4}{3} - 3\right| = \dfrac{5}{3}$, mentre $\left|\dfrac{8}{3} + 1\right| = \dfrac{11}{3}$.
```

## Equazioni del tipo |A(x)| = B(x)

Quando il secondo membro contiene l'incognita, non si sa in anticipo se è positivo. Un valore assoluto non è mai negativo, quindi le soluzioni devono rispettare la **condizione** $B(x) \geq 0$. Il procedimento:

1. Scrivi la condizione $B(x) \geq 0$ e risolvila.
2. Risolvi le due equazioni $A(x) = B(x)$ e $A(x) = -B(x)$.
3. Tieni solo le soluzioni che rispettano la condizione.

Le soluzioni scartate non sono un errore di calcolo: sono i valori per cui $|A(x)|$ e $B(x)$ sono opposti, invece che uguali.

```ad-example
Esempio 4: argomento di primo grado
$$|x - 4| = 2x + 1$$

Condizione: $2x + 1 \geq 0$, cioè $x \geq -\dfrac{1}{2}$.

$$
\begin{gathered}
x - 4 = 2x + 1 \ \Rightarrow \ x = -5 \\
x - 4 = -2x - 1 \ \Rightarrow \ x = 1
\end{gathered}
$$

$x = -5$ non rispetta la condizione e si scarta; $x = 1$ la rispetta. $S = \{1\}$. Verifica: $|1 - 4| = 3$ e $2 \cdot 1 + 1 = 3$.
```

```ad-warning
Dimenticare la condizione
Senza la condizione nell'esempio 4 si accetta anche $x = -5$. Ma per $x = -5$ il primo membro vale $|-9| = 9$ e il secondo $2 \cdot (-5) + 1 = -9$: sono opposti. La condizione $B(x) \geq 0$ va scritta prima di risolvere, o almeno controllata alla fine sostituendo le soluzioni.
```

```ad-example
Esempio 5: argomento di secondo grado
$$|x^2 - 4| = 3x$$

Condizione: $3x \geq 0$, cioè $x \geq 0$. Poi le due equazioni:

$$
\begin{gathered}
x^2 - 4 = 3x \\
x^2 - 3x - 4 = 0 \\
x = -1, \ x = 4
\end{gathered}
$$

$$
\begin{gathered}
x^2 - 4 = -3x \\
x^2 + 3x - 4 = 0 \\
x = -4, \ x = 1
\end{gathered}
$$

Delle quattro soluzioni rispettano la condizione solo $1$ e $4$: $S = \{1, 4\}$. Verifica con $x = 1$: $|1 - 4| = 3$ e $3 \cdot 1 = 3$.
```

```ad-note
Il metodo dei due sistemi
Molti libri risolvono $|A(x)| = B(x)$ togliendo le sbarre secondo la definizione: dove $A(x) \geq 0$ l'equazione è $A(x) = B(x)$, dove $A(x) < 0$ è $-A(x) = B(x)$. Si ottengono due sistemi, e le soluzioni sono quelle di tutti e due messe insieme. Per l'esempio 4:

$$
\begin{cases} x \geq 4 \\ x - 4 = 2x + 1 \end{cases}
$$

$$
\begin{cases} x < 4 \\ -x + 4 = 2x + 1 \end{cases}
$$

Il primo dà $x = -5$, che non è maggiore o uguale a $4$: nessuna soluzione. Il secondo dà $x = 1$, che è minore di $4$: accettata. Il risultato è lo stesso, $S = \{1\}$. Con un argomento di secondo grado questo metodo chiede di risolvere anche le disequazioni $A(x) \geq 0$ e $A(x) < 0$, e la condizione $B(x) \geq 0$ di solito è più corta.
```

## Più valori assoluti

Con due o più valori assoluti che contengono l'incognita, come in $|x - 1| + |x + 2| = 5$, si tolgono le sbarre intervallo per intervallo.

1. Trova gli zeri degli argomenti e mettili in ordine sulla retta: dividono la retta in intervalli.
2. In ogni intervallo ogni argomento ha un segno solo: riscrivi l'equazione senza sbarre, con la definizione.
3. Risolvi l'equazione di ogni intervallo e tieni la soluzione solo se appartiene a quell'intervallo.
4. Scrivi $S$ con le soluzioni accettate.

Ogni zero va messo in uno solo degli intervalli, di solito in quello alla sua destra.

```ad-example
Esempio 6: due valori assoluti
$$|x - 1| + |x + 2| = 5$$

Gli argomenti si annullano in $1$ e in $-2$. L'argomento $x - 1$ è negativo per $x < 1$, l'argomento $x + 2$ per $x < -2$.

| Intervallo | $\lvert x - 1 \rvert$ | $\lvert x + 2 \rvert$ | Equazione | Soluzione |
|---|---|---|---|---|
| $x < -2$ | $-x + 1$ | $-x - 2$ | $-2x - 1 = 5$ | $x = -3$, accettata |
| $-2 \leq x < 1$ | $-x + 1$ | $x + 2$ | $3 = 5$ | nessuna |
| $x \geq 1$ | $x - 1$ | $x + 2$ | $2x + 1 = 5$ | $x = 2$, accettata |

$x = -3$ è minore di $-2$ e $x = 2$ è maggiore di $1$: stanno nei loro intervalli. $S = \{-3, 2\}$.

Con le distanze si capisce il perché: $|x - 1| + |x + 2|$ è la somma delle distanze di $x$ da $1$ e da $-2$. Tra $-2$ e $1$ la somma vale sempre $3$, la distanza tra i due punti; fuori cresce, e vale $5$ a distanza $1$ da uno dei due estremi, in $-3$ e in $2$.
```

```ad-warning
Accettare una soluzione fuori dal suo intervallo
In ogni intervallo l'equazione senza sbarre vale solo lì. Se nel primo intervallo di un'equazione si trova $x = 0$, che non è minore di $-2$, quella soluzione si scarta: in $x = 0$ gli argomenti hanno altri segni, e l'equazione giusta è un'altra.
```

## Disequazioni del tipo |A(x)| < k e |A(x)| > k

Con $k > 0$, la disequazione $|x| < k$ chiede i numeri a distanza da $0$ minore di $k$: sono quelli tra $-k$ e $k$. La disequazione $|x| > k$ chiede quelli a distanza maggiore di $k$: sono quelli prima di $-k$ o dopo $k$. Con un argomento qualsiasi vale lo stesso:

$$
\begin{gathered}
|A(x)| < k \\
\Updownarrow \\
-k < A(x) < k
\end{gathered}
$$

$$
\begin{gathered}
|A(x)| > k \\
\Updownarrow \\
A(x) < -k \ \text{ oppure } \ A(x) > k
\end{gathered}
$$

Il verso $<$ dà i **valori interni**, una [doppia disequazione](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni), cioè un sistema; il verso $>$ dà i **valori esterni**, cioè l'unione delle soluzioni di due disequazioni. Con $\leq$ e $\geq$ si includono gli estremi. La figura mostra $|x - 2| < 3$ e $|x - 2| > 3$: i numeri a distanza da $2$ minore di $3$ stanno tra $-1$ e $5$, quelli a distanza maggiore stanno fuori.

```tikz
% nome: valore-assoluto-valori-interni-esterni
% alt: Due rette dei numeri con segnati meno 1, 2 e 5. Sopra, le soluzioni di valore assoluto di x meno 2 minore di 3: il segmento tra meno 1 e 5, estremi esclusi. Sotto, le soluzioni di valore assoluto di x meno 2 maggiore di 3: le due semirette prima di meno 1 e dopo 5, estremi esclusi
% svg: valore-assoluto-valori-interni-esterni-67a076a8.svg 265x77
\begin{tikzpicture}
\draw[gray!70, dashed] (1.10,-0.1) -- (1.10,1.35);
\draw[gray!70, dashed] (2.20,-0.1) -- (2.20,1.35);
\draw[gray!70, dashed] (3.30,-0.1) -- (3.30,1.35);
\draw[->] (0,0) -- (4.70,0) node[right] {$x$};
\draw (1.10,-0.08) -- (1.10,0.08);
\node[below] at (1.10,-0.1) {$-1$};
\draw (2.20,-0.08) -- (2.20,0.08);
\node[below] at (2.20,-0.1) {$2$};
\draw (3.30,-0.08) -- (3.30,0.08);
\node[below] at (3.30,-0.1) {$5$};
\node[left] at (0,1.10) {\small $|x-2|<3$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt, shorten >=2.6pt] (1.10,1.10) -- (3.30,1.10);
\draw[thick] (1.10,1.10) circle (2.2pt);
\draw[thick] (3.30,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $|x-2|>3$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (1.10,0.55);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.30,0.55) -- (4.40,0.55);
\draw[thick] (1.10,0.55) circle (2.2pt);
\draw[thick] (3.30,0.55) circle (2.2pt);
\end{tikzpicture}
```

```ad-example
Esempio 7: valori interni
$$|2x - 3| \leq 5$$

$$
\begin{gathered}
-5 \leq 2x - 3 \leq 5 \\
-2 \leq 2x \leq 8 \\
-1 \leq x \leq 4
\end{gathered}
$$

Si aggiunge $3$ a tutti e tre i membri e poi si divide per $2$: $S = [-1, 4]$.
```

```ad-example
Esempio 8: valori esterni
$$|x + 1| > 2$$

$$
\begin{gathered}
x + 1 < -2 \ \Rightarrow \ x < -3 \\
x + 1 > 2 \ \Rightarrow \ x > 1
\end{gathered}
$$

Le soluzioni sono quelle della prima disequazione e quelle della seconda, messe insieme:

$$x < -3 \ \text{ oppure } \ x > 1$$

$$S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$$
```

```ad-warning
Scrivere i valori esterni come una doppia disequazione
Da $|x + 1| > 2$ c'è chi scrive $-2 > x + 1 > 2$, oppure $-2 < x + 1 < 2$. La prima scrittura vorrebbe un numero minore di $-2$ e insieme maggiore di $2$, che non esiste; la seconda dà i valori interni, cioè le soluzioni di $|x + 1| < 2$. Con il verso $>$ le due disequazioni sono legate da "oppure" e non si scrivono in una riga sola.
```

```ad-example
Esempio 9: argomento di secondo grado
$$|x^2 - 5| < 4$$

Valori interni: $-4 < x^2 - 5 < 4$, cioè il sistema

$$
\begin{cases}
x^2 - 5 > -4 \\
x^2 - 5 < 4
\end{cases}
\ \Rightarrow \
\begin{cases}
x^2 > 1 \\
x^2 < 9
\end{cases}
$$

La prima dà $x < -1$ oppure $x > 1$, la seconda $-3 < x < 3$, come nelle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado) pure. Il sistema si risolve con il grafico, come nei [sistemi di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado):

```tikz
% nome: valore-assoluto-sistema-secondo-grado
% alt: Grafico del sistema tra x quadro maggiore di 1 e x quadro minore di 9: la prima riga ha due semirette, prima di meno 1 e dopo 1, la seconda il segmento tra meno 3 e 3, tutti con i pallini vuoti; sono colorate le strisce tra meno 3 e meno 1 e tra 1 e 3
% svg: valore-assoluto-sistema-secondo-grado-0a332a63.svg 242x77
\begin{tikzpicture}
\fill[orange!20] (0.88,-0.1) rectangle (1.76,1.35);
\fill[orange!20] (2.64,-0.1) rectangle (3.52,1.35);
\draw[gray!70, dashed] (0.88,-0.1) -- (0.88,1.35);
\draw[gray!70, dashed] (1.76,-0.1) -- (1.76,1.35);
\draw[gray!70, dashed] (2.64,-0.1) -- (2.64,1.35);
\draw[gray!70, dashed] (3.52,-0.1) -- (3.52,1.35);
\draw[->] (0,0) -- (4.70,0) node[right] {$x$};
\draw (0.88,-0.08) -- (0.88,0.08);
\node[below] at (0.88,-0.1) {$-3$};
\draw (1.76,-0.08) -- (1.76,0.08);
\node[below] at (1.76,-0.1) {$-1$};
\draw (2.64,-0.08) -- (2.64,0.08);
\node[below] at (2.64,-0.1) {$1$};
\draw (3.52,-0.08) -- (3.52,0.08);
\node[below] at (3.52,-0.1) {$3$};
\node[left] at (0,1.10) {\small $x^2 > 1$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,1.10) -- (1.76,1.10);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.64,1.10) -- (4.40,1.10);
\draw[thick] (1.76,1.10) circle (2.2pt);
\draw[thick] (2.64,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x^2 < 9$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt, shorten >=2.6pt] (0.88,0.55) -- (3.52,0.55);
\draw[thick] (0.88,0.55) circle (2.2pt);
\draw[thick] (3.52,0.55) circle (2.2pt);
\end{tikzpicture}
```

$$-3 < x < -1 \ \text{ oppure } \ 1 < x < 3$$

$$S = \,\mathopen{]}-3, -1\mathclose{[}\, \cup \,\mathopen{]}1, 3\mathclose{[}$$

Verifica con $x = 2$: $|4 - 5| = 1 < 4$, vero; con $x = 0$: $|-5| = 5 < 4$, falso.
```

Se $k$ è negativo o zero le regole dei valori interni ed esterni non servono: si usa solo il fatto che un valore assoluto non è mai negativo. Con l'argomento $x - 3$:

| Disequazione | Soluzioni | Perché |
|---|---|---|
| $\lvert x - 3 \rvert < -2$ | nessuna, $S = \emptyset$ | un valore assoluto non è mai negativo |
| $\lvert x - 3 \rvert > -2$ | ogni $x$, $S = \mathbb{R}$ | un valore assoluto è sempre maggiore di un negativo |
| $\lvert x - 3 \rvert < 0$ | nessuna, $S = \emptyset$ | non è mai negativo |
| $\lvert x - 3 \rvert \leq 0$ | solo $x = 3$ | vale zero solo dove l'argomento è zero |
| $\lvert x - 3 \rvert > 0$ | $x \neq 3$ | è positivo tranne dove l'argomento è zero |
| $\lvert x - 3 \rvert \geq 0$ | ogni $x$, $S = \mathbb{R}$ | non è mai negativo |

Tutti i casi, con $k$ positivo, nullo o negativo, si vedono spostando la retta $y = k$ sul grafico di $y = |x - 3|$: la disequazione $|x - 3| < k$ vale per gli $x$ in cui il grafico sta sotto la retta, $|x - 3| > k$ per quelli in cui sta sopra.

```grafico
% nome: valore-assoluto-retta-k-cursore
% alt: Il grafico di y = |x - 3|, una V con il vertice in (3; 0), e la retta orizzontale y = k con il cursore di k: è colorata la parte di piano dove |x - 3| è minore di k, oppure quella dove è maggiore; con k negativo o nullo la prima sparisce e la seconda prende tutto il piano, tranne x = 3 quando k = 0
curva: y=\left|x-3\right|
curva: y=k | rosso
scelta: < k :: \left|x-3\right|<k
scelta: > k :: \left|x-3\right|>k
cursore: k = 2 da -3 a 6 passo 0,5
finestra: x da -4 a 10, y da -4 a 7
domanda: Abbassa $k$ fino a $0$ e poi a $-2$: che cosa resta colorato con $<$? E con $>$? Confronta con le righe della tabella.
```

```ad-warning
Applicare la regola con k negativo
Da $|2x - 1| < -3$ c'è chi scrive $3 < 2x - 1 < -3$, che non ha senso, oppure risolve un sistema che per caso dà qualche soluzione. La disequazione è impossibile, e lo si vede prima di fare conti: a sinistra c'è un numero positivo o nullo, a destra un negativo.
```

## Disequazioni del tipo |A(x)| < B(x) e |A(x)| > B(x)

Con l'incognita a secondo membro valgono le stesse regole, con $B(x)$ al posto di $k$:

$$
\begin{gathered}
|A(x)| < B(x) \\
\Updownarrow \\
\begin{cases} A(x) < B(x) \\ A(x) > -B(x) \end{cases}
\end{gathered}
$$

$$
\begin{gathered}
|A(x)| > B(x) \\
\Updownarrow \\
A(x) < -B(x) \ \text{ oppure } \ A(x) > B(x)
\end{gathered}
$$

Il primo è un sistema, il secondo un'unione. Non serve una condizione su $B(x)$: dove $B(x) \leq 0$ il sistema non ha soluzioni da solo, perché $A(x)$ dovrebbe stare tra $-B(x)$ e $B(x)$, e $-B(x)$ non è minore di $B(x)$; nell'unione, invece, dove $B(x) < 0$ la disequazione è sempre vera, e l'unione comprende già quei valori.

```ad-example
Esempio 10: minore di un'espressione
$$|x - 3| < 2x$$

$$
\begin{cases}
x - 3 < 2x \\
x - 3 > -2x
\end{cases}
\ \Rightarrow \
\begin{cases}
x > -3 \\
x > 1
\end{cases}
$$

I numeri maggiori di $1$ sono anche maggiori di $-3$: $x > 1$, cioè $S = \,\mathopen{]}1, +\infty\mathclose{[}$. Verifica con $x = 2$: $|-1| = 1 < 4$, vero; con $x = 0$: $3 < 0$, falso.
```

```ad-example
Esempio 11: maggiore di un'espressione
$$|x^2 - 4| > 3x$$

Valori esterni: $x^2 - 4 < -3x$ oppure $x^2 - 4 > 3x$.

Prima disequazione: $x^2 + 3x - 4 < 0$. Il trinomio si annulla in $-4$ e in $1$ ed è negativo in mezzo: $-4 < x < 1$.

Seconda disequazione: $x^2 - 3x - 4 > 0$. Il trinomio si annulla in $-1$ e in $4$ ed è positivo fuori: $x < -1$ oppure $x > 4$.

Le soluzioni sono tutti i numeri che risolvono almeno una delle due. Nel grafico si prende ogni punto in cui c'è almeno una linea, e non solo le strisce in cui ci sono tutte e due:

```tikz
% nome: valore-assoluto-unione-secondo-grado
% alt: Unione delle soluzioni di due disequazioni: la prima riga è il segmento tra meno 4 e 1, la seconda le due semirette prima di meno 1 e dopo 4, tutti con i pallini vuoti; l'ultima riga, S, è formata dalla semiretta prima di 1 e da quella dopo 4
% svg: valore-assoluto-unione-secondo-grado-bd5f7df1.svg 292x98
\begin{tikzpicture}
\draw[gray!70, dashed] (0.88,-0.1) -- (0.88,1.90);
\draw[gray!70, dashed] (1.76,-0.1) -- (1.76,1.90);
\draw[gray!70, dashed] (2.64,-0.1) -- (2.64,1.90);
\draw[gray!70, dashed] (3.52,-0.1) -- (3.52,1.90);
\draw[->] (0,0) -- (4.70,0) node[right] {$x$};
\draw (0.88,-0.08) -- (0.88,0.08);
\node[below] at (0.88,-0.1) {$-4$};
\draw (1.76,-0.08) -- (1.76,0.08);
\node[below] at (1.76,-0.1) {$-1$};
\draw (2.64,-0.08) -- (2.64,0.08);
\node[below] at (2.64,-0.1) {$1$};
\draw (3.52,-0.08) -- (3.52,0.08);
\node[below] at (3.52,-0.1) {$4$};
\node[left] at (0,1.65) {\small $x^2+3x-4 < 0$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt, shorten >=2.6pt] (0.88,1.65) -- (2.64,1.65);
\draw[thick] (0.88,1.65) circle (2.2pt);
\draw[thick] (2.64,1.65) circle (2.2pt);
\node[left] at (0,1.10) {\small $x^2-3x-4 > 0$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,1.10) -- (1.76,1.10);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.52,1.10) -- (4.40,1.10);
\draw[thick] (1.76,1.10) circle (2.2pt);
\draw[thick] (3.52,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $S$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (2.64,0.55);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.52,0.55) -- (4.40,0.55);
\draw[thick] (2.64,0.55) circle (2.2pt);
\draw[thick] (3.52,0.55) circle (2.2pt);
\end{tikzpicture}
```

$$x < 1 \ \text{ oppure } \ x > 4$$

$$S = \,\mathopen{]}-\infty, 1\mathclose{[}\, \cup \,\mathopen{]}4, +\infty\mathclose{[}$$

Verifica con $x = 2$, che non è una soluzione: $|0| = 0 > 6$ è falso. Per $x = 1$ e $x = 4$ i due membri sono uguali, come nell'esempio 5.
```

```ad-warning
Intersecare invece di unire
Con il verso $>$ le due disequazioni sono legate da "oppure": si prende l'unione. Chi le mette in un sistema nell'esempio 11 cerca i numeri tra $-4$ e $1$ che sono anche minori di $-1$ o maggiori di $4$, trova $-4 < x < -1$ e perde, per esempio, $x = 0$, che è una soluzione: $|-4| = 4 > 0$.
```

## Errori frequenti

```ad-warning
Il valore assoluto di una somma
$|a + b|$ non è $|a| + |b|$: con $a = 3$ e $b = -5$ si ha $|3 - 5| = 2$, mentre $|3| + |-5| = 8$. Quindi $|x - 3|$ non si spezza in $|x| - 3$ o in $|x| + 3$: si tratta sempre tutto l'argomento insieme.
```

```ad-warning
Portare fuori il segno meno
$|-2x|$ è uguale a $|2x| = 2|x|$, non a $-2|x|$: il valore assoluto non è mai negativo, e il segno meno dentro le sbarre sparisce. Invece $-|2x|$, con il meno fuori, è negativo o nullo.
```
