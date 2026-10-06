# Equazioni binomie, trinomie e scomponibili

L'equazione $x^3 - 4x = 0$ è di terzo grado, e la formula delle equazioni di secondo grado non serve. Si risolve scomponendo: $x^3 - 4x = x(x - 2)(x + 2)$, e un prodotto vale zero solo quando vale zero uno dei fattori, quindi le soluzioni sono $0$, $2$ e $-2$. Quasi tutte le equazioni di grado superiore al secondo che incontri a scuola si risolvono così, oppure appartengono a due famiglie con un metodo proprio: le binomie, come $x^4 = 16$, e le trinomie, come $x^4 - 5x^2 + 4 = 0$.

Per seguire questa lezione ti servono la scomposizione in fattori, dal [raccoglimento](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale) alla [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini), le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) e la radice $n$-esima della lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta). Tutte le equazioni sono risolte in $\mathbb{R}$.

## Equazioni di grado superiore al secondo

Un'equazione intera è di grado $n$ quando, portati tutti i termini a primo membro e ridotti i termini simili, si scrive nella **forma normale** $P(x) = 0$, con $P(x)$ polinomio di grado $n$. Per esempio $x^3 = 4x$ diventa $x^3 - 4x = 0$, di terzo grado, e $x^2(x^2 - 5) = -4$ diventa $x^4 - 5x^2 + 4 = 0$, di quarto grado.

Un'equazione di grado $n$ ha al massimo $n$ soluzioni reali, e può averne meno, anche nessuna. Per le equazioni di terzo e di quarto grado esistono formule risolutive, ma sono lunghe e a scuola non si usano; dal quinto grado in su una formula generale con i radicali non esiste. Per questo si risolvono solo equazioni con una forma particolare.

## Equazioni scomponibili

Se il polinomio $P(x)$ si scompone in fattori di primo e di secondo grado, l'equazione $P(x) = 0$ si risolve con la [legge di annullamento del prodotto](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza): un prodotto vale zero se e solo se almeno uno dei fattori vale zero. Ogni fattore uguagliato a zero dà un'equazione di primo o di secondo grado, e le soluzioni dell'equazione di partenza sono tutte le soluzioni di queste equazioni, messe insieme.

1. Porta tutti i termini a primo membro, in modo che a secondo membro resti $0$.
2. Scomponi il primo membro: prima il [raccoglimento totale o parziale](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale), poi i [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli) e il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado), infine la [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).
3. Uguaglia a zero ogni fattore e risolvi le equazioni di primo e di secondo grado che ottieni.
4. Scrivi l'insieme $S$ con tutte le soluzioni trovate, ognuna una volta sola.

```ad-example
Esempio 1: un raccoglimento e una differenza di quadrati
$$x^3 - 4x = 0$$

Raccogli $x$ e scomponi la differenza di quadrati:

$$
\begin{gathered}
x(x^2 - 4) = 0 \\
x(x - 2)(x + 2) = 0
\end{gathered}
$$

Il prodotto vale zero se $x = 0$, oppure $x - 2 = 0$, oppure $x + 2 = 0$. Le soluzioni sono tre: $S = \{-2, 0, 2\}$.
```

```ad-warning
Dividere per x
Scritta come $x^3 = 4x$, l'equazione invita a dividere per $x$ e a scrivere $x^2 = 4$, che dà solo $-2$ e $2$. Così si perde $x = 0$, che è una soluzione: $0^3 = 4 \cdot 0$. Per $x$ non si divide, perché può valere zero: si porta tutto a primo membro e si raccoglie.
```

```ad-example
Esempio 2: un raccoglimento parziale
$$x^3 - 2x^2 - 9x + 18 = 0$$

Raccogli $x^2$ dai primi due termini e $-9$ dagli ultimi due, poi il fattore comune $x - 2$:

$$
\begin{aligned}
&x^2(x - 2) - 9(x - 2) = 0 \\
&(x - 2)(x^2 - 9) = 0 \\
&(x - 2)(x - 3)(x + 3) = 0
\end{aligned}
$$

$S = \{-3, 2, 3\}$.
```

```ad-example
Esempio 3: con la regola di Ruffini
$$2x^3 - 3x^2 - 3x + 2 = 0$$

Non ci sono raccoglimenti. Gli zeri razionali del polinomio vanno cercati tra le frazioni $\dfrac{p}{q}$ con $p$ divisore di $2$ e $q$ divisore di $2$: $\pm 1$, $\pm 2$, $\pm \dfrac{1}{2}$.

$$
\begin{gathered}
P(1) = 2 - 3 - 3 + 2 = -2 \\
P(-1) = -2 - 3 + 3 + 2 = 0
\end{gathered}
$$

Lo zero è $-1$: dividi per $x + 1$.

$$\begin{array}{r|rrr|r} & 2 & -3 & -3 & 2 \\ -1 & & -2 & 5 & -2 \\ \hline & 2 & -5 & 2 & 0 \end{array}$$

L'equazione diventa $(x + 1)(2x^2 - 5x + 2) = 0$. Il primo fattore dà $x = -1$; il secondo è un'equazione di secondo grado:

$$
\begin{gathered}
\Delta = 25 - 16 = 9 \\
x = \frac{5 \pm 3}{4} \ \Rightarrow \ x = \frac{1}{2}, \ x = 2
\end{gathered}
$$

$S = \left\{-1, \dfrac{1}{2}, 2\right\}$.
```

```ad-example
Esempio 4: un fattore senza soluzioni
$$x^3 + x^2 + x - 3 = 0$$

La somma dei coefficienti è $1 + 1 + 1 - 3 = 0$, quindi $P(1) = 0$. Dividi per $x - 1$:

$$\begin{array}{r|rrr|r} & 1 & 1 & 1 & -3 \\ 1 & & 1 & 2 & 3 \\ \hline & 1 & 2 & 3 & 0 \end{array}$$

L'equazione diventa $(x - 1)(x^2 + 2x + 3) = 0$. Il fattore $x^2 + 2x + 3$ ha $\Delta = 4 - 12 = -8$ e non si annulla mai. L'unica soluzione è $x = 1$: $S = \{1\}$. Un'equazione di terzo grado può avere una soluzione sola.
```

```ad-warning
Uguagliare i fattori a un numero diverso da zero
La legge di annullamento del prodotto vale solo con lo zero. Da $x(x - 1)(x + 1) = 6$ non si ricava $x = 6$ oppure $x - 1 = 6$: un prodotto può valere $6$ in infiniti modi. Si porta il $6$ a primo membro, $x^3 - x - 6 = 0$, e si scompone con Ruffini: $(x - 2)(x^2 + 2x + 3) = 0$, che dà solo $x = 2$.
```

## Equazioni binomie

Un'equazione **binomia** è un'equazione della forma

$$ax^n + b = 0$$

con $a \neq 0$ e $n$ numero naturale maggiore di $2$ (con $n = 1$ e $n = 2$ è di primo grado o una pura di secondo grado). Si porta $b$ a secondo membro e si divide per $a$:

$$x^n = -\frac{b}{a}$$

Chiamiamo $k$ il numero a secondo membro. Le soluzioni di $x^n = k$ sono i numeri reali che elevati alla $n$ danno $k$, cioè le sue radici $n$-esime, e quante sono dipende dal segno di $k$ e da $n$ pari o dispari.

Con $n$ pari una potenza non è mai negativa, e due numeri opposti hanno la stessa potenza: $2^4 = (-2)^4 = 16$. Quindi con $k > 0$ le soluzioni sono due, opposte, con $k < 0$ non ce ne sono. Con $n$ dispari la potenza ha il segno della base, e numeri diversi hanno potenze diverse: per ogni $k$ la soluzione è una sola, con lo stesso segno di $k$, come per la [radice di indice dispari](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta) di un radicando negativo.

| $x^n = k$ | $n$ pari | $n$ dispari |
|---|---|---|
| $k > 0$ | $x = \pm\sqrt[n]{k}$, due soluzioni | $x = \sqrt[n]{k}$, una soluzione |
| $k = 0$ | $x = 0$ | $x = 0$ |
| $k < 0$ | nessuna soluzione | $x = \sqrt[n]{k}$, una soluzione negativa |

I grafici di $y = x^4$ e di $y = x^3$ mostrano il perché. Le soluzioni di $x^n = k$ sono le ascisse dei punti in cui la retta orizzontale $y = k$ incontra il grafico: $y = x^4$ sta tutto sopra l'asse $x$ ed è simmetrico, mentre $y = x^3$ sale sempre e passa da tutti i valori, negativi compresi.

```tikz
% nome: binomia-pari-dispari-grafici
% alt: A sinistra il grafico di y uguale a x alla quarta, tutto sopra l'asse x: la retta y uguale a 2 lo incontra in due punti opposti, la retta y uguale a meno 1 non lo incontra. A destra il grafico di y uguale a x alla terza: ciascuna delle due rette lo incontra in un punto solo
% svg: binomia-pari-dispari-grafici-2fa16ce4.svg 312x155
\begin{tikzpicture}
\draw[black!70, ->] (-1.49,0) -- (1.49,0) node[right] {$x$};
\draw[black!70, ->] (0.00,-0.88) -- (0.00,1.93) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.13,1.72) (-1.07,1.40) (-1.02,1.13) (-0.96,0.90) (-0.90,0.70) (-0.85,0.54) (-0.79,0.41) (-0.73,0.31) (-0.68,0.22) (-0.62,0.16) (-0.57,0.11) (-0.51,0.07) (-0.45,0.04) (-0.40,0.03) (-0.34,0.01) (-0.28,0.01) (-0.23,0.00) (-0.17,0.00) (-0.11,0.00) (-0.06,0.00) (0.00,0.00) (0.06,0.00) (0.11,0.00) (0.17,0.00) (0.23,0.00) (0.28,0.01) (0.34,0.01) (0.40,0.03) (0.45,0.04) (0.51,0.07) (0.57,0.11) (0.62,0.16) (0.68,0.22) (0.73,0.31) (0.79,0.41) (0.85,0.54) (0.90,0.70) (0.96,0.90) (1.02,1.13) (1.07,1.40) (1.13,1.72)};
\node[right] at (1.13,1.67) {\small $y=x^4$};
\draw[blue!60, thick] (-1.36,1.10) -- (1.36,1.10);
\fill (-1.01,1.10) circle (1.8pt);
\draw[gray!60, densely dotted] (-1.01,1.10) -- (-1.01,0);
\fill (1.01,1.10) circle (1.8pt);
\draw[gray!60, densely dotted] (1.01,1.10) -- (1.01,0);
\draw[red!60, thick] (-1.36,-0.55) -- (1.36,-0.55);
\node[left] at (-1.36,1.10) {\small $2$};
\node[left] at (-1.36,-0.55) {\small $-1$};
\draw[black!70, ->] (2.26,0) -- (5.24,0) node[right] {$x$};
\draw[black!70, ->] (3.75,-1.62) -- (3.75,1.93) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(2.54,-1.57) (2.60,-1.35) (2.66,-1.15) (2.72,-0.97) (2.78,-0.81) (2.84,-0.66) (2.91,-0.54) (2.97,-0.43) (3.03,-0.34) (3.09,-0.26) (3.15,-0.20) (3.21,-0.14) (3.27,-0.10) (3.33,-0.07) (3.39,-0.04) (3.45,-0.02) (3.51,-0.01) (3.57,-0.01) (3.63,-0.00) (3.69,-0.00) (3.75,0.00) (3.81,0.00) (3.87,0.00) (3.93,0.01) (3.99,0.01) (4.05,0.02) (4.11,0.04) (4.17,0.07) (4.23,0.10) (4.29,0.14) (4.35,0.20) (4.41,0.26) (4.47,0.34) (4.53,0.43) (4.59,0.54) (4.66,0.66) (4.72,0.81) (4.78,0.97) (4.84,1.15) (4.90,1.35) (4.96,1.57)};
\node[right] at (4.96,1.42) {\small $y=x^3$};
\draw[blue!60, thick] (2.39,1.10) -- (5.11,1.10);
\fill (4.82,1.10) circle (1.8pt);
\draw[gray!60, densely dotted] (4.82,1.10) -- (4.82,0);
\draw[red!60, thick] (2.39,-0.55) -- (5.11,-0.55);
\fill (2.90,-0.55) circle (1.8pt);
\draw[gray!60, densely dotted] (2.90,-0.55) -- (2.90,0);
\node[left] at (2.39,1.10) {\small $2$};
\node[left] at (2.39,-0.55) {\small $-1$};
\end{tikzpicture}
```
```grafico
% nome: binomia-esponente-retta-cursori
% alt: Il grafico di y = x alla n con il cursore dell'esponente n, da 2 a 7, e la retta orizzontale y = k con il cursore di k: con n pari la retta incontra il grafico in due punti se k è positivo e in nessuno se è negativo, con n dispari sempre in un punto solo
curva: y=x^n
curva: y=k | rosso
cursore: n = 4 da 2 a 7 passo 1
cursore: k = 2 da -4 a 4 passo 0,5
finestra: x da -4 a 4, y da -4 a 4
domanda: Con $n = 4$ porta $k$ sotto zero: quanti punti comuni restano? Poi passa a $n = 3$ e rifai lo stesso. Che cosa cambia tra $n$ pari e $n$ dispari?
```

```ad-example
Esempio 5: indice dispari, secondo membro negativo
$$x^3 + 8 = 0$$

$$x^3 = -8 \ \Rightarrow \ x = \sqrt[3]{-8} = -2$$

L'esponente è dispari e la soluzione è una sola, negativa: $S = \{-2\}$. Verifica: $(-2)^3 + 8 = -8 + 8 = 0$.
```

```ad-example
Esempio 6: indice pari, due soluzioni
$$2x^4 - 32 = 0$$

$$
\begin{gathered}
2x^4 = 32 \ \Rightarrow \ x^4 = 16 \\
x = \pm\sqrt[4]{16} = \pm 2
\end{gathered}
$$

$S = \{-2, 2\}$.
```

```ad-warning
Dimenticare la soluzione negativa
Da $x^4 = 16$ si scrive spesso solo $x = 2$. Anche $-2$ va bene, perché $(-2)^4 = 16$: con l'esponente pari e il secondo membro positivo le soluzioni sono sempre due, opposte.
```

```ad-example
Esempio 7: indice pari, secondo membro negativo
$$x^4 + 81 = 0$$

$$x^4 = -81$$

Una potenza con esponente pari non è mai negativa: nessun numero reale soddisfa l'equazione, $S = \emptyset$.
```

```ad-warning
Confondere indice pari e dispari
$x^4 = -81$ non ha soluzioni, e non si risponde $x = -3$: $(-3)^4 = 81$, non $-81$. Invece $x^3 = -8$ ha la soluzione $-2$, e chi applica la regola del pari la dichiara impossibile. Prima di tutto guarda se l'esponente è pari o dispari.
```

```ad-example
Esempio 8: soluzioni irrazionali
$$x^6 - 5 = 0$$

$$x^6 = 5 \ \Rightarrow \ x = \pm\sqrt[6]{5}$$

L'esponente è pari e il secondo membro positivo: $S = \left\{-\sqrt[6]{5}, \sqrt[6]{5}\right\}$. Il radicale non si semplifica e resta così.
```

```ad-note
Le binomie si possono anche scomporre
$x^3 + 8$ è una [somma di cubi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli): $x^3 + 8 = (x + 2)(x^2 - 2x + 4)$. Il secondo fattore ha $\Delta = 4 - 16 = -12$ e non si annulla mai, e resta $x = -2$, come nell'esempio 5. Allo stesso modo $x^4 - 16 = (x^2 - 4)(x^2 + 4)$ dà solo $\pm 2$. Il risultato è lo stesso; con la radice $n$-esima si fa prima.
```

Se $b = 0$ l'equazione è $ax^n = 0$, e l'unica soluzione è $x = 0$.

## Equazioni trinomie

Un'equazione **trinomia** è un'equazione della forma

$$ax^{2n} + bx^n + c = 0$$

con $a \neq 0$, $b \neq 0$, $c \neq 0$ e $n \geq 2$: l'esponente del primo termine è il doppio di quello del secondo, e poi c'è il termine noto. Con $n = 2$ si ha $ax^4 + bx^2 + c = 0$, che si chiama equazione **biquadratica**; con $n = 3$ si ha $ax^6 + bx^3 + c = 0$.

Poiché $x^{2n} = (x^n)^2$, con la sostituzione $t = x^n$ la trinomia diventa un'equazione di secondo grado nell'incognita $t$:

$$
\begin{gathered}
t = x^n \\
at^2 + bt + c = 0
\end{gathered}
$$

Il procedimento:

1. Poni $t = x^n$ e scrivi l'equazione in $t$.
2. Risolvi l'equazione in $t$ con la formula o con la regola di somma e prodotto. Se ha $\Delta < 0$, anche la trinomia non ha soluzioni.
3. Per ogni soluzione $t_1$, $t_2$ torna a $x$: risolvi le binomie $x^n = t_1$ e $x^n = t_2$.
4. Scrivi $S$ con tutte le soluzioni in $x$.

Nelle biquadratiche $t = x^2$, e il terzo passo segue la regola delle pure: un valore di $t$ positivo dà due soluzioni opposte, $x = \pm\sqrt{t}$, un valore negativo nessuna. Per questo una biquadratica può avere $4$, $2$ o nessuna soluzione.

```ad-example
Esempio 9: quattro soluzioni
$$x^4 - 5x^2 + 4 = 0$$

Con $t = x^2$ l'equazione diventa $t^2 - 5t + 4 = 0$. Due numeri con somma $5$ e prodotto $4$ sono $1$ e $4$, quindi $t_1 = 1$ e $t_2 = 4$. Torna a $x$:

$$
\begin{gathered}
x^2 = 1 \ \Rightarrow \ x = \pm 1 \\
x^2 = 4 \ \Rightarrow \ x = \pm 2
\end{gathered}
$$

$S = \{-2, -1, 1, 2\}$. Verifica con $x = -2$: $16 - 20 + 4 = 0$.
```

```ad-warning
Fermarsi a t
Le soluzioni dell'equazione in $t$ non sono le soluzioni dell'equazione: nell'esempio 9 non si risponde "$1$ e $4$". Il numero $4$ non è nemmeno una soluzione, perché $4^4 - 5 \cdot 4^2 + 4 = 180$. Dopo aver trovato $t$ si torna sempre a $x$.
```

```ad-example
Esempio 10: un valore di t negativo
$$x^4 + 3x^2 - 4 = 0$$

Con $t = x^2$: $t^2 + 3t - 4 = 0$, con le soluzioni $t_1 = -4$ e $t_2 = 1$.

$$
\begin{gathered}
x^2 = -4 \ \Rightarrow \ \text{nessuna soluzione} \\
x^2 = 1 \ \Rightarrow \ x = \pm 1
\end{gathered}
$$

$S = \{-1, 1\}$.
```

```ad-warning
Il valore negativo di t
Da $x^2 = -4$ non si ricava $x = \pm 2$ né $x = \pm\sqrt{-4}$: nessun quadrato è negativo, e quel valore di $t$ si scarta. L'altro valore di $t$ va comunque risolto.
```

```ad-example
Esempio 11: soluzioni irrazionali
$$x^4 - 7x^2 + 10 = 0$$

Con $t = x^2$: $t^2 - 7t + 10 = 0$, con $t_1 = 2$ e $t_2 = 5$, tutti e due positivi.

$$
\begin{gathered}
x^2 = 2 \ \Rightarrow \ x = \pm\sqrt{2} \\
x^2 = 5 \ \Rightarrow \ x = \pm\sqrt{5}
\end{gathered}
$$

$S = \left\{-\sqrt{5}, -\sqrt{2}, \sqrt{2}, \sqrt{5}\right\}$.
```

```ad-example
Esempio 12: nessuna soluzione
$$x^4 + 5x^2 + 6 = 0$$

Con $t = x^2$: $t^2 + 5t + 6 = 0$, con $t_1 = -3$ e $t_2 = -2$. Tutti e due i valori sono negativi, e nessuno dà soluzioni: $S = \emptyset$.

Si poteva vedere subito: $x^4$ e $x^2$ non sono mai negativi, quindi $x^4 + 5x^2 + 6$ vale almeno $6$ e non si annulla.
```

```ad-example
Esempio 13: una trinomia di sesto grado
$$x^6 - 7x^3 - 8 = 0$$

Qui $x^6 = (x^3)^2$: poni $t = x^3$ e ottieni $t^2 - 7t - 8 = 0$. Due numeri con somma $7$ e prodotto $-8$ sono $-1$ e $8$, quindi $t_1 = -1$ e $t_2 = 8$.

$$
\begin{gathered}
x^3 = -1 \ \Rightarrow \ x = -1 \\
x^3 = 8 \ \Rightarrow \ x = 2
\end{gathered}
$$

L'esponente è dispari, e anche il valore negativo di $t$ dà una soluzione: $S = \{-1, 2\}$.
```

```ad-warning
Scartare t negativo con l'esponente dispari
La regola "valore negativo di $t$, nessuna soluzione" vale solo quando $t = x^n$ con $n$ pari. Nell'esempio 13 $t = x^3$, e $x^3 = -1$ ha la soluzione $x = -1$: $(-1)^6 - 7 \cdot (-1)^3 - 8 = 1 + 7 - 8 = 0$.
```

Se nella trinomia manca il termine noto, come in $x^4 - 9x^2 = 0$, non serve la sostituzione: si raccoglie $x^2$, $x^2(x^2 - 9) = 0$, e l'equazione è scomponibile, con le soluzioni $0$, $-3$ e $3$.

```ad-note
La trinomia come equazione scomponibile
Una trinomia si può anche scomporre: $x^4 - 5x^2 + 4 = (x^2 - 1)(x^2 - 4)$, perché $t^2 - 5t + 4 = (t - 1)(t - 4)$. Da qui $(x - 1)(x + 1)(x - 2)(x + 2) = 0$, con le stesse soluzioni dell'esempio 9. La sostituzione fa gli stessi passaggi con meno scrittura.
```

## Disequazioni di grado superiore al secondo

Con gli stessi metodi si risolvono le disequazioni $P(x) > 0$ (o con $\geq$, $<$, $\leq$) in cui $P(x)$ ha grado maggiore di $2$ e si scompone. Non c'è una parabola da disegnare: si scompone $P(x)$ in fattori di primo e di secondo grado e se ne studia il segno con la tabella dei segni, come nello [studio del segno](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte), leggendo i fattori di secondo grado come nelle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado). Le soluzioni si scrivono con gli intervalli.

```ad-example
Esempio 14: tre fattori di primo grado
$$x^3 - x^2 - 4x + 4 > 0$$

Scomponi con un raccoglimento parziale:

$$
\begin{aligned}
&x^2(x - 1) - 4(x - 1) > 0 \\
&(x - 1)(x^2 - 4) > 0 \\
&(x - 1)(x - 2)(x + 2) > 0
\end{aligned}
$$

I fattori si annullano in $-2$, $1$ e $2$, e sono positivi rispettivamente per $x > -2$, $x > 1$ e $x > 2$.

```tikz
% nome: disequazione-terzo-grado-tabella-segni
% alt: Tabella dei segni di x più 2, x meno 1 e x meno 2 e, sotto, le soluzioni del prodotto maggiore di zero: tra meno 2 e 1 e dopo 2, estremi esclusi
% svg: disequazione-terzo-grado-tabella-segni-367c03d3.svg 251x139
\begin{tikzpicture}
\node at (1.12,0) {$-2$};
\node at (2.25,0) {$1$};
\node at (3.38,0) {$2$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (1.12,-0.20) -- (1.12,-0.45);
\draw[gray!60, densely dotted] (1.12,-0.82) -- (1.12,-1.07);
\draw[gray!60, densely dotted] (1.12,-1.44) -- (1.12,-1.69);
\draw[gray!60, densely dotted] (1.12,-2.06) -- (1.12,-2.31);
\draw[gray!60, densely dotted] (1.12,-2.68) -- (1.12,-2.93);
\draw[gray!60, densely dotted] (2.25,-0.20) -- (2.25,-0.45);
\draw[gray!60, densely dotted] (2.25,-0.82) -- (2.25,-1.07);
\draw[gray!60, densely dotted] (2.25,-1.44) -- (2.25,-1.69);
\draw[gray!60, densely dotted] (2.25,-2.06) -- (2.25,-2.31);
\draw[gray!60, densely dotted] (2.25,-2.68) -- (2.25,-2.93);
\draw[gray!60, densely dotted] (3.38,-0.20) -- (3.38,-0.45);
\draw[gray!60, densely dotted] (3.38,-0.82) -- (3.38,-1.07);
\draw[gray!60, densely dotted] (3.38,-1.44) -- (3.38,-1.69);
\draw[gray!60, densely dotted] (3.38,-2.06) -- (3.38,-2.31);
\draw[gray!60, densely dotted] (3.38,-2.68) -- (3.38,-2.93);
\node[left] at (-0.1,-0.62) {$x+2$};
\draw[thick, dashed] (0.00,-0.62) -- (0.95,-0.62);
\node[above] at (0.56,-0.67) {\small $-$};
\draw[thick] (1.29,-0.62) -- (2.25,-0.62);
\node[above] at (1.69,-0.67) {\small $+$};
\draw[thick] (2.25,-0.62) -- (3.38,-0.62);
\node[above] at (2.81,-0.67) {\small $+$};
\draw[thick] (3.38,-0.62) -- (4.50,-0.62);
\node[above] at (3.94,-0.67) {\small $+$};
\node at (1.12,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-1$};
\draw[thick, dashed] (0.00,-1.24) -- (1.12,-1.24);
\node[above] at (0.56,-1.29) {\small $-$};
\draw[thick, dashed] (1.12,-1.24) -- (2.08,-1.24);
\node[above] at (1.69,-1.29) {\small $-$};
\draw[thick] (2.42,-1.24) -- (3.38,-1.24);
\node[above] at (2.81,-1.29) {\small $+$};
\draw[thick] (3.38,-1.24) -- (4.50,-1.24);
\node[above] at (3.94,-1.29) {\small $+$};
\node at (2.25,-1.24) {\small $0$};
\node[left] at (-0.1,-1.86) {$x-2$};
\draw[thick, dashed] (0.00,-1.86) -- (1.12,-1.86);
\node[above] at (0.56,-1.91) {\small $-$};
\draw[thick, dashed] (1.12,-1.86) -- (2.25,-1.86);
\node[above] at (1.69,-1.91) {\small $-$};
\draw[thick, dashed] (2.25,-1.86) -- (3.21,-1.86);
\node[above] at (2.81,-1.91) {\small $-$};
\draw[thick] (3.54,-1.86) -- (4.50,-1.86);
\node[above] at (3.94,-1.91) {\small $+$};
\node at (3.38,-1.86) {\small $0$};
\draw[gray!60] (-0.1,-2.17) -- (4.50,-2.17);
\node[left] at (-0.1,-2.48) {\small prodotto};
\node at (0.56,-2.48) {$-$};
\node at (1.69,-2.48) {$+$};
\node at (2.81,-2.48) {$-$};
\node at (3.94,-2.48) {$+$};
\node at (1.12,-2.48) {\small $0$};
\node at (2.25,-2.48) {\small $0$};
\node at (3.38,-2.48) {\small $0$};
\node[left] at (-0.1,-3.10) {$S$};
\draw[blue!45, line width=2pt] (1.23,-3.10) -- (2.15,-3.10);
\draw[blue!45, line width=2pt] (3.48,-3.10) -- (4.50,-3.10);
\draw[thick] (1.12,-3.10) circle (2.5pt);
\draw[thick] (2.25,-3.10) circle (2.5pt);
\draw[thick] (3.38,-3.10) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è positivo tra $-2$ e $1$ e dopo $2$. Il verso è $>$, e gli zeri sono esclusi:

$$-2 < x < 1 \ \text{ oppure } \ x > 2$$

$$S = \,\mathopen{]}-2, 1\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}$$

Verifica con $x = 0$: $4 > 0$, vero; con $x = 3$: $27 - 9 - 12 + 4 = 10 > 0$, vero.
```

```ad-example
Esempio 15: una biquadratica
$$x^4 - 5x^2 + 4 \leq 0$$

Il primo membro è quello dell'esempio 9, e si scompone come nel riquadro sulla trinomia scomponibile: $(x^2 - 1)(x^2 - 4) \leq 0$. Il fattore $x^2 - 1$ si annulla in $-1$ e in $1$ ed è positivo fuori, negativo in mezzo; $x^2 - 4$ si annulla in $-2$ e in $2$ ed è positivo fuori, negativo in mezzo.

```tikz
% nome: disequazione-biquadratica-tabella-segni
% alt: Tabella dei segni di x quadro meno 1 per x quadro meno 4, con una riga per ogni trinomio, e sotto le soluzioni del prodotto minore o uguale a zero: da meno 2 a meno 1 e da 1 a 2, estremi compresi
% svg: disequazione-biquadratica-tabella-segni-f393aa9f.svg 251x115
\begin{tikzpicture}
\node at (0.90,0) {$-2$};
\node at (1.80,0) {$-1$};
\node at (2.70,0) {$1$};
\node at (3.60,0) {$2$};
\node at (4.75,0) {$x$};
\draw[gray!60, densely dotted] (0.90,-0.20) -- (0.90,-0.45);
\draw[gray!60, densely dotted] (0.90,-0.82) -- (0.90,-1.07);
\draw[gray!60, densely dotted] (0.90,-1.44) -- (0.90,-1.69);
\draw[gray!60, densely dotted] (0.90,-2.06) -- (0.90,-2.31);
\draw[gray!60, densely dotted] (1.80,-0.20) -- (1.80,-0.45);
\draw[gray!60, densely dotted] (1.80,-0.82) -- (1.80,-1.07);
\draw[gray!60, densely dotted] (1.80,-1.44) -- (1.80,-1.69);
\draw[gray!60, densely dotted] (1.80,-2.06) -- (1.80,-2.31);
\draw[gray!60, densely dotted] (2.70,-0.20) -- (2.70,-0.45);
\draw[gray!60, densely dotted] (2.70,-0.82) -- (2.70,-1.07);
\draw[gray!60, densely dotted] (2.70,-1.44) -- (2.70,-1.69);
\draw[gray!60, densely dotted] (2.70,-2.06) -- (2.70,-2.31);
\draw[gray!60, densely dotted] (3.60,-0.20) -- (3.60,-0.45);
\draw[gray!60, densely dotted] (3.60,-0.82) -- (3.60,-1.07);
\draw[gray!60, densely dotted] (3.60,-1.44) -- (3.60,-1.69);
\draw[gray!60, densely dotted] (3.60,-2.06) -- (3.60,-2.31);
\node[left] at (-0.1,-0.62) {$x^2-1$};
\draw[thick] (0.00,-0.62) -- (0.90,-0.62);
\node[above] at (0.45,-0.67) {\small $+$};
\draw[thick] (0.90,-0.62) -- (1.63,-0.62);
\node[above] at (1.35,-0.67) {\small $+$};
\draw[thick, dashed] (1.97,-0.62) -- (2.53,-0.62);
\node[above] at (2.25,-0.67) {\small $-$};
\draw[thick] (2.87,-0.62) -- (3.60,-0.62);
\node[above] at (3.15,-0.67) {\small $+$};
\draw[thick] (3.60,-0.62) -- (4.50,-0.62);
\node[above] at (4.05,-0.67) {\small $+$};
\node at (1.80,-0.62) {\small $0$};
\node at (2.70,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x^2-4$};
\draw[thick] (0.00,-1.24) -- (0.73,-1.24);
\node[above] at (0.45,-1.29) {\small $+$};
\draw[thick, dashed] (1.07,-1.24) -- (1.80,-1.24);
\node[above] at (1.35,-1.29) {\small $-$};
\draw[thick, dashed] (1.80,-1.24) -- (2.70,-1.24);
\node[above] at (2.25,-1.29) {\small $-$};
\draw[thick, dashed] (2.70,-1.24) -- (3.43,-1.24);
\node[above] at (3.15,-1.29) {\small $-$};
\draw[thick] (3.77,-1.24) -- (4.50,-1.24);
\node[above] at (4.05,-1.29) {\small $+$};
\node at (0.90,-1.24) {\small $0$};
\node at (3.60,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.50,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.45,-1.86) {$+$};
\node at (1.35,-1.86) {$-$};
\node at (2.25,-1.86) {$+$};
\node at (3.15,-1.86) {$-$};
\node at (4.05,-1.86) {$+$};
\node at (0.90,-1.86) {\small $0$};
\node at (1.80,-1.86) {\small $0$};
\node at (2.70,-1.86) {\small $0$};
\node at (3.60,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (0.90,-2.48) -- (1.80,-2.48);
\draw[blue!45, line width=2pt] (2.70,-2.48) -- (3.60,-2.48);
\fill (0.90,-2.48) circle (2.5pt);
\fill (1.80,-2.48) circle (2.5pt);
\fill (2.70,-2.48) circle (2.5pt);
\fill (3.60,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è negativo tra $-2$ e $-1$ e tra $1$ e $2$. Il verso è $\leq$, e gli zeri sono compresi:

$$-2 \leq x \leq -1 \ \text{ oppure } \ 1 \leq x \leq 2$$

$$S = [-2, -1] \cup [1, 2]$$
```

```ad-warning
Dimenticare che t è x²
Con la sostituzione $t = x^2$ la disequazione dell'esempio 15 diventa $t^2 - 5t + 4 \leq 0$, cioè $1 \leq t \leq 4$. La risposta non è $1 \leq x \leq 4$: per $x = 3$ si ha $81 - 45 + 4 = 40$, positivo. Si torna a $x$ con $1 \leq x^2 \leq 4$, che è un [sistema di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado), oppure si usa la tabella dei segni.
```

## Errori frequenti

```ad-warning
Contare le soluzioni dal grado
Il grado dice quante soluzioni l'equazione può avere al massimo, non quante ne ha. $x^3 + x^2 + x - 3 = 0$ è di terzo grado e ha una soluzione sola; $x^4 + 81 = 0$ è di quarto grado e non ne ha nessuna.
```

```ad-warning
Chiamare binomia un'equazione con due termini qualsiasi
$x^4 - 9x^2 = 0$ ha due termini, ma non è una binomia: manca il termine noto, e $x$ compare con due potenze diverse. Chi la scrive $x^4 = 9x^2$ e divide per $x^2$ trova solo $\pm 3$ e perde $x = 0$. Si raccoglie $x^2$, come nella sezione sulle trinomie.
```
