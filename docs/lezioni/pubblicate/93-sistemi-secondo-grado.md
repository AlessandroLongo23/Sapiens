# Sistemi di secondo grado

Un rettangolo ha il perimetro di $14$ cm e l'area di $12\ \text{cm}^2$. Se chiami $x$ e $y$ le misure dei due lati, in centimetri, il perimetro dà $x + y = 7$ e l'area dà $xy = 12$. La seconda equazione ha un termine di secondo grado, e le due equazioni insieme formano un sistema di secondo grado. Si risolve con il metodo di sostituzione dei [sistemi lineari](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite), che qui porta a un'[equazione di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) in una sola incognita.

Non va confuso con i sistemi di disequazioni della lezione [Disequazioni fratte e sistemi di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado): lì ci sono disequazioni in una sola incognita, e le soluzioni sono intervalli; qui ci sono equazioni in due incognite, e le soluzioni sono coppie $(x, y)$.

## Il grado di un sistema

Il grado di un'equazione in due incognite, scritta nella forma polinomio $= 0$, è il grado del polinomio, come nella lezione [Polinomi e grado di un polinomio](/materiale/scuola-superiore/matematica/monomi-e-polinomi/polinomi-e-grado-di-un-polinomio). Il termine $xy$ ha grado $2$, come $x^2$ e $y^2$: l'equazione $xy = 12$, cioè $xy - 12 = 0$, è di secondo grado.

Il grado di un sistema è il prodotto dei gradi delle sue equazioni, come nella lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite). Un sistema di due equazioni in due incognite è un **sistema di secondo grado** quando ha grado $2$, cioè quando un'equazione è di primo grado e l'altra di secondo.

- $x + y = 7$ e $xy = 12$: grado $1 \cdot 2 = 2$.
- $2x - y = 1$ e $x^2 + y^2 = 2$: grado $1 \cdot 2 = 2$.
- $x^2 + y^2 = 10$ e $xy = 3$: grado $2 \cdot 2 = 4$. Non è di secondo grado, e non si risolve con i metodi di questa lezione.

## Il metodo di sostituzione

1. Dall'equazione di primo grado ricava una delle due incognite, se puoi quella con coefficiente $1$ o $-1$.
2. Sostituisci l'espressione trovata nell'equazione di secondo grado: ottieni un'equazione in una sola incognita, che si chiama **equazione risolvente**.
3. Risolvi l'equazione risolvente.
4. Per ogni soluzione, ricava l'altra incognita dall'espressione del passo 1.
5. Scrivi le soluzioni come coppie $(x, y)$.

L'equazione risolvente di solito è di secondo grado, e il suo discriminante dice quante soluzioni ha il sistema: due coppie se $\Delta > 0$, una coppia se $\Delta = 0$, nessuna se $\Delta < 0$, e allora il sistema è impossibile. Può anche capitare che i termini di secondo grado si cancellino e la risolvente sia di primo grado: allora si risolve come un'equazione di primo grado, e ogni sua soluzione dà una coppia.

```ad-example
Esempio 1: si ricava la x
$$
\begin{cases}
x - 2y = 1 \\
xy = 3
\end{cases}
$$

Nella prima equazione $x$ ha coefficiente $1$: ricavala, $x = 2y + 1$. Sostituisci nella seconda, tra parentesi:

$$
\begin{gathered}
(2y + 1)y = 3 \\
\Rightarrow 2y^2 + y - 3 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 1 + 24 = 25 \\
y_{1,2} = \frac{-1 \pm 5}{4} \\
y_1 = -\frac{3}{2}, \quad y_2 = 1
\end{gathered}
$$

Per ogni valore di $y$ ricava $x$ da $x = 2y + 1$:

$$
\begin{gathered}
y = -\frac{3}{2}: \ x = -3 + 1 = -2 \\
y = 1: \ x = 2 + 1 = 3
\end{gathered}
$$

$$S = \left\{\left(-2, -\frac{3}{2}\right), (3, 1)\right\}$$

Verifica della prima coppia: $-2 - 2 \cdot \left(-\dfrac{3}{2}\right) = -2 + 3 = 1$ e $(-2) \cdot \left(-\dfrac{3}{2}\right) = 3$.
```

```ad-example
Esempio 2: il quadrato di un binomio
$$
\begin{cases}
2x - y = 1 \\
x^2 + y^2 = 2
\end{cases}
$$

Dalla prima, $y = 2x - 1$. Sostituisci nella seconda e sviluppa il quadrato del binomio:

$$
\begin{gathered}
x^2 + (2x - 1)^2 = 2 \\
\Rightarrow x^2 + 4x^2 - 4x + 1 = 2 \\
\Rightarrow 5x^2 - 4x - 1 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 16 + 20 = 36 \\
x_{1,2} = \frac{4 \pm 6}{10} \\
x_1 = -\frac{1}{5}, \quad x_2 = 1
\end{gathered}
$$

Da $y = 2x - 1$: per $x = -\dfrac{1}{5}$ si ha $y = -\dfrac{2}{5} - 1 = -\dfrac{7}{5}$; per $x = 1$ si ha $y = 1$.

$$S = \left\{\left(-\frac{1}{5}, -\frac{7}{5}\right), (1, 1)\right\}$$

Verifica della prima coppia nella seconda equazione: $\dfrac{1}{25} + \dfrac{49}{25} = \dfrac{50}{25} = 2$.
```

```ad-warning
Ricavare l'altra incognita dall'equazione di secondo grado
Nell'esempio 2, trovato $x = 1$, viene da metterlo in $x^2 + y^2 = 2$: si ottiene $y^2 = 1$, cioè $y = 1$ oppure $y = -1$. Ma la coppia $(1, -1)$ non risolve il sistema, perché $2 \cdot 1 - (-1) = 3$, non $1$. L'altra incognita si ricava dall'espressione di primo grado, che per ogni $x$ dà una sola $y$.
```

```ad-warning
Scrivere le soluzioni come numeri
Le soluzioni di un sistema in due incognite sono coppie. Nell'esempio 2 non si scrive $S = \left\{-\dfrac{1}{5}, 1\right\}$, che sono solo i valori di $x$: ogni valore di $x$ va con il suo valore di $y$, e con quello solo.
```

## Retta e parabola

Nel piano cartesiano l'equazione $y = ax^2 + bx + c$ è una [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) e l'equazione $y = mx + q$ è una retta. Come per l'[intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette), un punto sta su tutte e due le linee quando le sue coordinate risolvono il sistema delle due equazioni: le soluzioni del sistema sono i punti comuni.

Le due equazioni danno già $y$: si uguagliano i secondi membri, e l'equazione risolvente è di secondo grado in $x$. Il suo discriminante dice come stanno la retta e la parabola.

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | **secante** |
| $\Delta = 0$ | uno | **tangente** |
| $\Delta < 0$ | nessuno | **esterna** |

Nei tre esempi che seguono la parabola è sempre $y = x^2 - 2x - 3$, la stessa della lezione [Disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), e cambia solo la retta.

```ad-example
Esempio 3: una retta secante
$$
\begin{cases}
y = x^2 - 2x - 3 \\
y = x - 3
\end{cases}
$$

Uguaglia i secondi membri:

$$
\begin{gathered}
x^2 - 2x - 3 = x - 3 \\
\Rightarrow x^2 - 3x = 0 \\
\Rightarrow x(x - 3) = 0
\end{gathered}
$$

La risolvente ha due soluzioni, $x = 0$ e $x = 3$. Da $y = x - 3$: per $x = 0$ si ha $y = -3$, per $x = 3$ si ha $y = 0$.

$$S = \{(0, -3), (3, 0)\}$$

La retta taglia la parabola nei due punti $(0, -3)$ e $(3, 0)$:

```tikz
% nome: sistema-retta-parabola-secante
% alt: La parabola y uguale a x al quadrato meno 2x meno 3 e la retta y uguale a x meno 3, che la taglia in due punti, 0, meno 3 e 3, 0
% svg: sistema-retta-parabola-secante-1c2cd7fe.svg 179x144
\begin{tikzpicture}
\draw[black!70, ->] (-1.14,0) -- (2.46,0) node[right] {$x$};
\draw[black!70, ->] (0,-2.18) -- (0,1.09) node[above] {$y$};
\draw[thick, blue!60] plot[smooth] coordinates {(-0.96,0.91) (-0.90,0.74) (-0.84,0.57) (-0.77,0.41) (-0.71,0.25) (-0.65,0.11) (-0.59,-0.03) (-0.52,-0.16) (-0.46,-0.29) (-0.40,-0.41) (-0.34,-0.52) (-0.27,-0.62) (-0.21,-0.72) (-0.15,-0.81) (-0.09,-0.89) (-0.02,-0.96) (0.04,-1.03) (0.10,-1.09) (0.16,-1.15) (0.23,-1.19) (0.29,-1.23) (0.35,-1.26) (0.41,-1.29) (0.48,-1.31) (0.54,-1.32) (0.60,-1.32) (0.66,-1.32) (0.72,-1.31) (0.79,-1.29) (0.85,-1.26) (0.91,-1.23) (0.97,-1.19) (1.04,-1.15) (1.10,-1.09) (1.16,-1.03) (1.22,-0.96) (1.29,-0.89) (1.35,-0.81) (1.41,-0.72) (1.47,-0.62) (1.54,-0.52) (1.60,-0.41) (1.66,-0.29) (1.72,-0.16) (1.79,-0.03) (1.85,0.11) (1.91,0.25) (1.97,0.41) (2.04,0.57) (2.10,0.74) (2.16,0.91)};
\draw[thick, red!50] (-0.96,-1.52) -- (2.16,0.20);
\fill (0.00,-0.99) circle (1.8pt);
\node[left] at (0.00,-0.99) {\small $(0, -3)$};
\fill (1.80,0.00) circle (1.8pt);
\node[above left] at (1.80,0.00) {\small $(3, 0)$};
\node[red!60!black, below] at (-0.96,-1.52) {\small $y=x-3$};
\end{tikzpicture}
```
```

```ad-example
Esempio 4: una retta tangente
$$
\begin{cases}
y = x^2 - 2x - 3 \\
y = 2x - 7
\end{cases}
$$

$$
\begin{gathered}
x^2 - 2x - 3 = 2x - 7 \\
\Rightarrow x^2 - 4x + 4 = 0 \\
\Rightarrow (x - 2)^2 = 0
\end{gathered}
$$

La risolvente ha $\Delta = 16 - 16 = 0$ e la sola soluzione $x = 2$. Da $y = 2x - 7$ si ha $y = -3$: $S = \{(2, -3)\}$. La retta tocca la parabola nel punto $(2, -3)$, e la parabola sta tutta sopra la retta, tranne in quel punto:

```tikz
% nome: sistema-retta-parabola-tangente
% alt: La parabola y uguale a x al quadrato meno 2x meno 3 e la retta y uguale a 2x meno 7, tangente alla parabola nel punto 2, meno 3
% svg: sistema-retta-parabola-tangente-1b1639c9.svg 156x150
\begin{tikzpicture}
\draw[black!70, ->] (-1.14,0) -- (2.46,0) node[right] {$x$};
\draw[black!70, ->] (0,-2.18) -- (0,1.09) node[above] {$y$};
\draw[thick, blue!60] plot[smooth] coordinates {(-0.96,0.91) (-0.90,0.74) (-0.84,0.57) (-0.77,0.41) (-0.71,0.25) (-0.65,0.11) (-0.59,-0.03) (-0.52,-0.16) (-0.46,-0.29) (-0.40,-0.41) (-0.34,-0.52) (-0.27,-0.62) (-0.21,-0.72) (-0.15,-0.81) (-0.09,-0.89) (-0.02,-0.96) (0.04,-1.03) (0.10,-1.09) (0.16,-1.15) (0.23,-1.19) (0.29,-1.23) (0.35,-1.26) (0.41,-1.29) (0.48,-1.31) (0.54,-1.32) (0.60,-1.32) (0.66,-1.32) (0.72,-1.31) (0.79,-1.29) (0.85,-1.26) (0.91,-1.23) (0.97,-1.19) (1.04,-1.15) (1.10,-1.09) (1.16,-1.03) (1.22,-0.96) (1.29,-0.89) (1.35,-0.81) (1.41,-0.72) (1.47,-0.62) (1.54,-0.52) (1.60,-0.41) (1.66,-0.29) (1.72,-0.16) (1.79,-0.03) (1.85,0.11) (1.91,0.25) (1.97,0.41) (2.04,0.57) (2.10,0.74) (2.16,0.91)};
\draw[thick, red!50] (0.21,-2.08) -- (2.16,0.07);
\fill (1.20,-0.99) circle (1.8pt);
\node[below right] at (1.20,-0.99) {\small $(2, -3)$};
\node[red!60!black, right] at (0.21,-2.08) {\small $y=2x-7$};
\end{tikzpicture}
```
```

```ad-example
Esempio 5: una retta esterna
$$
\begin{cases}
y = x^2 - 2x - 3 \\
y = x - 6
\end{cases}
$$

$$
\begin{gathered}
x^2 - 2x - 3 = x - 6 \\
\Rightarrow x^2 - 3x + 3 = 0
\end{gathered}
$$

La risolvente ha $\Delta = 9 - 12 = -3$, negativo: non ha soluzioni, e il sistema è impossibile, $S = \emptyset$. La retta passa sotto la parabola senza incontrarla:

```tikz
% nome: sistema-retta-parabola-esterna
% alt: La parabola y uguale a x al quadrato meno 2x meno 3 e la retta y uguale a x meno 6, che passa sotto la parabola senza incontrarla
% svg: sistema-retta-parabola-esterna-f55cbe6c.svg 188x144
\begin{tikzpicture}
\draw[black!70, ->] (-1.14,0) -- (2.46,0) node[right] {$x$};
\draw[black!70, ->] (0,-2.18) -- (0,1.09) node[above] {$y$};
\draw[thick, blue!60] plot[smooth] coordinates {(-0.96,0.91) (-0.90,0.74) (-0.84,0.57) (-0.77,0.41) (-0.71,0.25) (-0.65,0.11) (-0.59,-0.03) (-0.52,-0.16) (-0.46,-0.29) (-0.40,-0.41) (-0.34,-0.52) (-0.27,-0.62) (-0.21,-0.72) (-0.15,-0.81) (-0.09,-0.89) (-0.02,-0.96) (0.04,-1.03) (0.10,-1.09) (0.16,-1.15) (0.23,-1.19) (0.29,-1.23) (0.35,-1.26) (0.41,-1.29) (0.48,-1.31) (0.54,-1.32) (0.60,-1.32) (0.66,-1.32) (0.72,-1.31) (0.79,-1.29) (0.85,-1.26) (0.91,-1.23) (0.97,-1.19) (1.04,-1.15) (1.10,-1.09) (1.16,-1.03) (1.22,-0.96) (1.29,-0.89) (1.35,-0.81) (1.41,-0.72) (1.47,-0.62) (1.54,-0.52) (1.60,-0.41) (1.66,-0.29) (1.72,-0.16) (1.79,-0.03) (1.85,0.11) (1.91,0.25) (1.97,0.41) (2.04,0.57) (2.10,0.74) (2.16,0.91)};
\draw[thick, red!50] (-0.18,-2.08) -- (2.16,-0.79);
\node[red!60!black, right] at (2.16,-0.79) {\small $y=x-6$};
\end{tikzpicture}
```
```

```ad-note
Le rette verticali
Una retta parallela all'asse $y$, come $x = 1$, incontra la parabola $y = x^2 - 2x - 3$ in un punto solo: sostituendo $x = 1$ si ha $y = 1 - 2 - 3 = -4$, e il sistema ha la sola soluzione $(1, -4)$. La retta però non è tangente: attraversa la parabola. Qui la risolvente non è di secondo grado, e la regola del discriminante non si applica.
```

## Sistemi simmetrici

Un sistema si dice **simmetrico** quando, scambiando $x$ con $y$, resta lo stesso. Il più semplice dà la somma e il prodotto delle due incognite:

$$
\begin{cases}
x + y = s \\
xy = p
\end{cases}
$$

Cercare $x$ e $y$ vuol dire cercare due numeri con somma $s$ e prodotto $p$. Per la lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti), sono le soluzioni dell'equazione

$$t^2 - st + p = 0$$

dove l'incognita si chiama $t$ per non confonderla con $x$ e $y$. Se l'equazione ha le soluzioni $t_1$ e $t_2$, il sistema ha le due soluzioni $(t_1, t_2)$ e $(t_2, t_1)$: $x$ può essere l'una o l'altra, e $y$ è quella che resta.

- Con $\Delta > 0$ le coppie sono due, una lo scambio dell'altra.
- Con $\Delta = 0$ si ha $t_1 = t_2$, e la coppia è una sola, $(t_1, t_1)$.
- Con $\Delta < 0$ il sistema è impossibile.

```ad-example
Esempio 6: somma e prodotto
$$
\begin{cases}
x + y = 1 \\
xy = -6
\end{cases}
$$

Qui $s = 1$ e $p = -6$. L'equazione è

$$t^2 - t - 6 = 0$$

con $\Delta = 1 + 24 = 25$ e le soluzioni $t_{1,2} = \dfrac{1 \pm 5}{2}$, cioè $t_1 = -2$ e $t_2 = 3$.

$$S = \{(-2, 3), (3, -2)\}$$

Con la sostituzione si arriva allo stesso punto: da $y = 1 - x$ si ottiene $x(1 - x) = -6$, cioè $x^2 - x - 6 = 0$, la stessa equazione con $x$ al posto di $t$.
```

```ad-warning
Dimenticare la coppia scambiata
Nell'esempio 6 la soluzione non è solo $(-2, 3)$: anche $(3, -2)$ ha somma $1$ e prodotto $-6$. Le coppie sono due, e le due soluzioni dell'equazione in $t$ non sono le due coppie: $S = \{-2, 3\}$ è sbagliato.
```

```ad-warning
Il segno della somma
Nell'equazione $t^2 - st + p = 0$ la somma entra con il segno cambiato. Con $s = 1$ e $p = -6$ l'equazione è $t^2 - t - 6 = 0$; scrivendo $t^2 + t - 6 = 0$ si trovano $-3$ e $2$, che hanno somma $-1$.
```

Con $\Delta = 0$ le due incognite sono uguali: il sistema $x + y = 6$, $xy = 9$ porta a $t^2 - 6t + 9 = 0$, cioè $(t - 3)^2 = 0$, e ha la sola soluzione $(3, 3)$. Con $\Delta < 0$ nessuna coppia di numeri reali ha quella somma e quel prodotto: il sistema $x + y = 2$, $xy = 5$ porta a $t^2 - 2t + 5 = 0$, con $\Delta = 4 - 20 = -16$, ed è impossibile.

```ad-example
Esempio 7: la somma dei quadrati
$$
\begin{cases}
x + y = 5 \\
x^2 + y^2 = 13
\end{cases}
$$

Anche questo sistema è simmetrico. Dal quadrato del binomio, $(x + y)^2 = x^2 + 2xy + y^2$, quindi, come per le espressioni simmetriche della lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti),

$$x^2 + y^2 = (x + y)^2 - 2xy$$

Sostituisci i valori noti e ricava il prodotto:

$$
\begin{gathered}
13 = 25 - 2xy \\
\Rightarrow 2xy = 12 \\
\Rightarrow xy = 6
\end{gathered}
$$

Ora il sistema è $x + y = 5$, $xy = 6$. L'equazione $t^2 - 5t + 6 = 0$ ha le soluzioni $2$ e $3$:

$$S = \{(2, 3), (3, 2)\}$$

Verifica: $2 + 3 = 5$ e $4 + 9 = 13$.
```

## Problemi con i sistemi di secondo grado

Un problema con due grandezze incognite porta a un sistema di secondo grado quando una delle relazioni del testo contiene un prodotto o un quadrato, come l'area di un rettangolo. Il procedimento è quello dei [problemi con i sistemi](/materiale/scuola-superiore/matematica/sistemi-lineari/problemi-con-i-sistemi): scegli le incognite, scrivi le limitazioni (una lunghezza è positiva), traduci il testo in un sistema, risolvilo e controlla quali soluzioni rispettano le limitazioni.

```ad-example
Esempio 8: il rettangolo con perimetro e area
Un rettangolo ha il perimetro di $14$ cm e l'area di $12\ \text{cm}^2$. Quanto misurano i lati?

Chiama $x$ e $y$ le misure dei lati, in centimetri, con $x > 0$ e $y > 0$. La somma dei due lati è metà del perimetro:

$$
\begin{cases}
x + y = 7 \\
xy = 12
\end{cases}
$$

Il sistema è simmetrico, con $s = 7$ e $p = 12$. L'equazione $t^2 - 7t + 12 = 0$ ha $\Delta = 49 - 48 = 1$ e le soluzioni $t_{1,2} = \dfrac{7 \pm 1}{2}$, cioè $3$ e $4$. Le coppie sono $(3, 4)$ e $(4, 3)$, e rispettano tutte e due le limitazioni.

Le due coppie descrivono lo stesso rettangolo, con la base e l'altezza scambiate: i lati misurano $3$ cm e $4$ cm. Verifica: il perimetro è $2 \cdot (3 + 4) = 14$ cm e l'area $3 \cdot 4 = 12\ \text{cm}^2$.
```

```ad-example
Esempio 9: il rettangolo con perimetro e diagonale
Un rettangolo ha il perimetro di $34$ cm e la diagonale di $13$ cm. Quanto misurano i lati?

Chiama $x$ e $y$ le misure dei lati, con $x > 0$ e $y > 0$. La somma dei lati è $17$; la diagonale è l'ipotenusa di un triangolo rettangolo che ha i lati come cateti, e per il teorema di Pitagora $x^2 + y^2 = 13^2 = 169$.

$$
\begin{cases}
x + y = 17 \\
x^2 + y^2 = 169
\end{cases}
$$

Come nell'esempio 7, da $x^2 + y^2 = (x + y)^2 - 2xy$ si ricava il prodotto:

$$
\begin{gathered}
169 = 289 - 2xy \\
\Rightarrow xy = 60
\end{gathered}
$$

L'equazione $t^2 - 17t + 60 = 0$ ha $\Delta = 289 - 240 = 49$ e le soluzioni $t_{1,2} = \dfrac{17 \pm 7}{2}$, cioè $5$ e $12$. I lati misurano $5$ cm e $12$ cm. Verifica: $5 + 12 = 17$ e $25 + 144 = 169$.
```

Un sistema impossibile, in un problema, vuol dire che la figura richiesta non esiste. Un rettangolo con il perimetro di $20$ cm e l'area di $30\ \text{cm}^2$ porterebbe a $x + y = 10$, $xy = 30$, e all'equazione $t^2 - 10t + 30 = 0$, con $\Delta = 100 - 120 = -20$: non esiste. È lo stesso risultato della lezione [Disequazioni fratte e sistemi di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado), dove un rettangolo con il perimetro di $20$ cm non arriva a un'area maggiore di $25\ \text{cm}^2$.
