# Formulario: Il legame covalente

## Il legame covalente

- Legame covalente: una coppia di elettroni messa in comune da due atomi. Conta nel livello esterno di tutti e due.
- Si forma di solito tra atomi di non metalli, uguali o diversi.
- Covalente puro (o apolare): tra atomi uguali, la coppia sta a metà.
- Formula di Lewis: i simboli degli atomi con tutti gli elettroni di valenza; una coppia in comune si può scrivere con un trattino, $\mathrm{H{-}H}$.

## Coppie di legame e coppie solitarie

- Coppia di legame: la coppia in comune tra due atomi.
- Coppia solitaria: una coppia che appartiene a un atomo solo e non fa legami.
- Elettrone spaiato: un elettrone di valenza che non è in coppia; è quello che l'atomo mette in comune.

Elettroni intorno a un atomo:

$$2 \cdot \text{coppie solitarie} + 2 \cdot \text{coppie di legame}$$

Nel $\mathrm{Cl_2}$ ogni cloro ha $3$ coppie solitarie e $1$ di legame: $6 + 2 = 8$.

## Quanti legami forma un atomo

$$\text{numero di legami} = 8 - \text{elettroni di valenza}$$

| Elemento | Gruppo | Elettroni di valenza | Legami | Coppie solitarie |
|---|---|---|---|---|
| idrogeno | 1 | $1$ | $1$ | $0$ |
| carbonio | 14 | $4$ | $4$ | $0$ |
| azoto | 15 | $5$ | $3$ | $1$ |
| ossigeno | 16 | $6$ | $2$ | $2$ |
| fluoro, cloro | 17 | $7$ | $1$ | $3$ |

L'idrogeno arriva a $2$ elettroni, non a $8$.

## Legami singoli, doppi e tripli

| Legame | Coppie in comune | Ordine di legame | Esempio |
|---|---|---|---|
| singolo | $1$ | $1$ | $\mathrm{H{-}H}$, $\mathrm{Cl{-}Cl}$ |
| doppio | $2$ | $2$ | $\mathrm{O{=}O}$ |
| triplo | $3$ | $3$ | $\mathrm{N{\equiv}N}$ |

Ordine di legame: il numero di coppie di elettroni in comune tra due atomi.

## Ordine, lunghezza ed energia

Tra gli stessi due atomi, al crescere dell'ordine il legame è più corto e più forte.

| Legame | Lunghezza (pm) | Energia (kJ/mol) |
|---|---|---|
| $\mathrm{C{-}C}$ | $154$ | $348$ |
| $\mathrm{C{=}C}$ | $134$ | $614$ |
| $\mathrm{C{\equiv}C}$ | $120$ | $839$ |
| $\mathrm{N{-}N}$ | $145$ | $163$ |
| $\mathrm{N{=}N}$ | $125$ | $418$ |
| $\mathrm{N{\equiv}N}$ | $110$ | $945$ |

## Scrivere la formula di Lewis di una molecola semplice

1. Conta gli elettroni di valenza di tutti gli atomi.
2. Dai a ogni atomo i legami che gli servono: $8$ meno i suoi elettroni di valenza, uno solo per l'idrogeno.
3. Metti gli elettroni che restano come coppie solitarie.
4. Controlla: $8$ elettroni intorno a ogni atomo, $2$ intorno all'idrogeno, e il totale uguale a quello del passo 1.

```tikz
% nome: covalente-lewis-molecole-semplici
% alt: Le formule di Lewis di cinque molecole, con i legami disegnati come trattini e le coppie solitarie come coppie di puntini. Acqua: l'ossigeno legato a due idrogeni, con due coppie solitarie. Ammoniaca: l'azoto legato a tre idrogeni, con una coppia solitaria. Metano: il carbonio legato a quattro idrogeni, senza coppie solitarie. Diossido di carbonio: il carbonio al centro con due legami doppi, uno per ciascun ossigeno, e due coppie solitarie su ogni ossigeno. Cloruro di idrogeno: l'idrogeno legato al cloro, che ha tre coppie solitarie
\begin{tikzpicture}
% acqua
\node at (0,0) {O};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\foreach \p in {(-0.09,0.3),(0.09,0.3),(-0.09,-0.3),(0.09,-0.3)} \fill \p circle (1.3pt);
\node at (0,-1.2) {\small acqua};
% ammoniaca
\begin{scope}[shift={(3.2,0)}]
\node at (0,0) {N};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\foreach \p in {(-0.09,0.3),(0.09,0.3)} \fill \p circle (1.3pt);
\node at (0,-1.2) {\small ammoniaca};
\end{scope}
% metano
\begin{scope}[shift={(6.4,0)}]
\node at (0,0) {C};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\node at (0,0.75) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\draw[thick] (0,0.22) -- (0,0.53);
\node at (0,-1.2) {\small metano};
\end{scope}
% diossido di carbonio
\begin{scope}[shift={(1.2,-2.5)}]
\node at (0,0) {C};
\node at (-0.9,0) {O};
\node at (0.9,0) {O};
\draw[thick] (-0.66,0.05) -- (-0.22,0.05);
\draw[thick] (-0.66,-0.05) -- (-0.22,-0.05);
\draw[thick] (0.22,0.05) -- (0.66,0.05);
\draw[thick] (0.22,-0.05) -- (0.66,-0.05);
\foreach \p in {(-0.99,0.3),(-0.81,0.3),(-0.99,-0.3),(-0.81,-0.3),(0.99,0.3),(0.81,0.3),(0.99,-0.3),(0.81,-0.3)} \fill \p circle (1.3pt);
\node at (0,-0.85) {\small diossido di carbonio};
\end{scope}
% cloruro di idrogeno
\begin{scope}[shift={(5.3,-2.5)}]
\node at (-0.4,0) {H};
\node at (0.45,0) {Cl};
\draw[thick] (-0.18,0) -- (0.16,0);
\foreach \p in {(0.36,0.32),(0.54,0.32),(0.36,-0.32),(0.54,-0.32),(0.82,0.09),(0.82,-0.09)} \fill \p circle (1.3pt);
\node at (0.1,-0.85) {\small cloruro di idrogeno};
\end{scope}
\end{tikzpicture}
```

```ad-warning
La coppia di legame conta per tutti e due
Nel conto dell'ottetto la coppia in comune vale due elettroni per ciascuno dei due atomi.
```

```ad-warning
Un legame doppio non è forte il doppio
$\mathrm{C{=}C}$ vale $614\,\text{kJ/mol}$, meno di $2 \cdot 348 = 696\,\text{kJ/mol}$.
```

```ad-warning
La formula di Lewis non dà la forma
Dice quali atomi sono legati e con quante coppie; la forma della molecola si ricava con la teoria VSEPR.
```
