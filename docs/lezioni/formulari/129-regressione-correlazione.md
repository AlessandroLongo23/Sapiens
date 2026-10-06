# Formulario: Regressione e correlazione

## Diagramma a dispersione e baricentro

- Dati: $n$ coppie $(x_i, y_i)$ di due caratteri quantitativi. Ogni coppia è un punto del piano: l'insieme dei punti è il diagramma a dispersione.
- Baricentro: $G(\bar{x}, \bar{y})$.

## Covarianza

$$
\begin{gathered}
p_i = (x_i - \bar{x})(y_i - \bar{y}) \\
\sigma_{xy} = \frac{p_1 + p_2 + \dots + p_n}{n}
\end{gathered}
$$

- $\sigma_{xy} > 0$: la nuvola sale, correlazione positiva. $\sigma_{xy} < 0$: la nuvola scende, correlazione negativa.
- Il valore dipende dalle unità di misura.
- Altro modo:

$$\sigma_{xy} = \frac{x_1 y_1 + \dots + x_n y_n}{n} - \bar{x} \cdot \bar{y}$$

## Retta di regressione

- Residuo di un punto rispetto alla retta $y = mx + q$: $e_i = y_i - (m x_i + q)$.
- Minimi quadrati: la retta che rende minima $e_1^2 + e_2^2 + \dots + e_n^2$ ha

$$m = \frac{\sigma_{xy}}{\sigma_x^2} \qquad q = \bar{y} - m\bar{x}$$

- Passa per il baricentro: $y - \bar{y} = m(x - \bar{x})$.
- $m$: di quanto varia in media $Y$ quando $X$ aumenta di $1$. $q$: valore stimato per $x = 0$.
- Stima: si sostituisce $x$ nell'equazione, solo per valori vicini a quelli osservati.
- Controlli: la retta passa per $G$; la somma dei residui è zero.

```tikz
% nome: retta-regressione-ore-studio-voto-residui
% alt: Il diagramma a dispersione delle ore di studio e dei voti con la retta di regressione y = 0,5x + 3,5, che passa per il baricentro G (5, 6) e per i punti A e B; segmenti verticali uniscono alla retta i punti C, D ed E e sono i loro residui: 1, meno 2 e 1
\begin{tikzpicture}[x=0.5cm, y=0.5cm]
\draw[gray!25, very thin] (0,0) grid (10,10);
\draw[->] (0,0) -- (10.9,0) node[right] {\small ore};
\draw[->] (0,0) -- (0,10.9) node[above] {\small voto};
\foreach \x in {1,3,5,7,9} \node[below] at (\x,0) {\footnotesize $\x$};
\foreach \y in {2,4,6,8,10} \node[left] at (0,\y) {\footnotesize $\y$};
\draw[thick, red!60] (0,3.5) -- (10,8.5);
\draw[very thick, orange!80] (5,7) -- (5,6);
\draw[very thick, orange!80] (7,5) -- (7,7);
\draw[very thick, orange!80] (9,9) -- (9,8);
\filldraw[fill=blue!30, draw=blue!60] (1,4) circle (2.4pt);
\node[above left] at (1,4) {\small $A$};
\filldraw[fill=blue!30, draw=blue!60] (3,5) circle (2.4pt);
\node[above left] at (3,5) {\small $B$};
\filldraw[fill=blue!30, draw=blue!60] (5,7) circle (2.4pt);
\node[above left] at (5,7) {\small $C$};
\filldraw[fill=blue!30, draw=blue!60] (7,5) circle (2.4pt);
\node[below right] at (7,5) {\small $D$};
\filldraw[fill=blue!30, draw=blue!60] (9,9) circle (2.4pt);
\node[above left] at (9,9) {\small $E$};
\fill (5,6) circle (2pt);
\node[below right] at (5,6) {\small $G$};
\node[red!60!black, below right] at (6.6,10.9) {\small $y = 0{,}5x + 3{,}5$};
\end{tikzpicture}
```

## Coefficiente di correlazione lineare

$$r = \frac{\sigma_{xy}}{\sigma_x \cdot \sigma_y}$$

- $-1 \leq r \leq 1$, con il segno di $\sigma_{xy}$ e di $m$.
- $r = 1$ o $r = -1$: tutti i punti su una retta, crescente o decrescente.
- $r$ vicino a $0$: nessun legame lineare. $r = 0$: caratteri incorrelati.
- È un numero puro: non cambia con le unità di misura.

## Procedimento

1. Calcola $\bar{x}$ e $\bar{y}$.
2. Tabella con gli scarti, i loro prodotti e i loro quadrati.
3. Dividi le tre somme per $n$: $\sigma_{xy}$, $\sigma_x^2$, $\sigma_y^2$.
4. $m = \dfrac{\sigma_{xy}}{\sigma_x^2}$, $q = \bar{y} - m\bar{x}$.
5. $r = \dfrac{\sigma_{xy}}{\sqrt{\sigma_x^2 \cdot \sigma_y^2}}$.

Con $x$: $1, 3, 5, 7, 9$ e $y$: $4, 5, 7, 5, 9$ si ha $\bar{x} = 5$, $\bar{y} = 6$, $\sigma_{xy} = 4$, $\sigma_x^2 = 8$, $\sigma_y^2 = 3{,}2$, quindi $y = 0{,}5x + 3{,}5$ e $r \approx 0{,}79$.

```ad-warning
Varianza in m, scarti quadratici medi in r
In $m$ si divide per $\sigma_x^2$; in $r$ per $\sigma_x \cdot \sigma_y$.
```

```ad-warning
Stimare fuori dai dati
Lontano dai valori osservati la retta può dare risultati assurdi, come un voto di $13{,}5$ o un prezzo negativo.
```

```ad-warning
Correlazione, causa e r = 0
Un $r$ vicino a $1$ non dice che $X$ causa $Y$; un $r$ vicino a $0$ esclude solo il legame lineare.
```
