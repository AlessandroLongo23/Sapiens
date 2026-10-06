# Formulario: Temperatura ed energia cinetica delle molecole

## Energia cinetica media di una molecola

Dal confronto tra $p\,V = \frac{1}{3}\,N\,m\,v_{qm}^2$ e $p\,V = N\,k_B\,T$:

$$K_m = \frac{1}{2}\,m\,v_{qm}^2 = \frac{3}{2}\,k_B\,T$$

- $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$ (costante di Boltzmann), $k_B = R / N_A$.
- $T$ è la temperatura assoluta, in kelvin: $T = t + 273$.
- $K_m$ non dipende dal gas: alla stessa temperatura è uguale per tutte le molecole.
- A $T = 0\,\text{K}$ le molecole sarebbero ferme.

## Velocità quadratica media

$$v_{qm} = \sqrt{\frac{3\,k_B\,T}{m}} = \sqrt{\frac{3\,R\,T}{M}} \qquad\qquad T = \frac{M\,v_{qm}^2}{3\,R}$$

$R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$; $M$ è la massa molare in $\text{kg/mol}$, $m$ la massa di una molecola.

| Se | allora |
|---|---|
| $T$ raddoppia | $K_m$ raddoppia, $v_{qm}$ aumenta di $\sqrt{2}$ volte |
| $T$ diventa quattro volte più grande | $v_{qm}$ raddoppia |
| stessa $T$, gas diversi | $\dfrac{v_{qm,1}}{v_{qm,2}} = \sqrt{\dfrac{M_2}{M_1}}$ |

Azoto a $293\,\text{K}$: $v_{qm} = 511\,\text{m/s}$.

## Distribuzione di Maxwell

Le molecole non hanno tutte la stessa velocità: la curva di Maxwell dice quante ne hanno una data velocità.

```tikz
% nome: distribuzione-maxwell-due-temperature
% alt: Le distribuzioni di Maxwell delle velocità delle molecole di azoto a due temperature. A 300 kelvin la curva è alta e stretta, con il massimo a circa 420 metri al secondo; a 900 kelvin è più bassa e più larga, con il massimo a circa 730 metri al secondo e una coda che supera i 1500 metri al secondo
% poi-interattivo: cambiare la temperatura con un cursore e vedere la curva che si allarga e si abbassa, con l'area che resta uguale
\begin{tikzpicture}[x=0.9cm]
\draw[->] (0,0) -- (6.6,0);
\node[below] at (5.9,-0.45) {$v$ (m/s)};
\draw[->] (0,0) -- (0,4.3) node[above right, inner sep=1pt] {\small numero di molecole};
\foreach \x/\t in {1/300,2/600,3/900,4/1200,5/1500,6/1800} {
  \draw[thin] (\x,0.06) -- (\x,-0.06);
  \node[below] at (\x,-0.06) {\small $\t$};
}
\draw[thick, blue!60, domain=0:6.2, samples=100, smooth] plot (\x, {4.946*\x*\x*exp(-0.5054*\x*\x)});
\draw[thick, orange!90!black, domain=0:6.2, samples=100, smooth] plot (\x, {0.9521*\x*\x*exp(-0.16849*\x*\x)});
\node[right, blue!60!black] at (1.9,3.3) {$300$ K};
\node[above right, orange!90!black] at (3.2,1.75) {$900$ K};
\end{tikzpicture}
```

- Velocità più probabile, media e quadratica media: $v_p < \bar v < v_{qm}$, con $v_p \approx 0{,}82\,v_{qm}$ e $\bar v \approx 0{,}92\,v_{qm}$.
- Se $T$ aumenta la curva si sposta a destra, si allarga e si abbassa; l'area non cambia.
- A parità di $T$, molecole più pesanti hanno la curva più stretta e spostata verso le velocità basse.

## Energia cinetica di tutte le molecole

$$K_{tot} = N\,K_m = \frac{3}{2}\,N\,k_B\,T = \frac{3}{2}\,n\,R\,T$$

```ad-warning
La temperatura in kelvin
In $K_m = \frac{3}{2}\,k_B\,T$ e in $v_{qm} = \sqrt{3RT/M}$ si usa la temperatura assoluta: $20\,^\circ\text{C}$ sono $293\,\text{K}$.
```

```ad-warning
La massa molare in chilogrammi per mole
$28{,}0\,\text{g/mol} = 28{,}0 \cdot 10^{-3}\,\text{kg/mol}$. In grammi la velocità dell'azoto verrebbe $16\,\text{m/s}$ invece di $511\,\text{m/s}$.
```

```ad-warning
La velocità va con la radice
Temperatura doppia: energia doppia, velocità $\sqrt{2}$ volte. Massa quattro volte più grande: velocità dimezzata.
```
