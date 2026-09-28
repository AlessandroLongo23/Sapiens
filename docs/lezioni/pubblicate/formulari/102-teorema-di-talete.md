# Formulario: Teorema di Talete

## Fascio di rette parallele

- Fascio di rette parallele: rette tutte parallele tra loro; trasversale: una retta che le incontra tutte.
- Punti corrispondenti: stanno sulla stessa parallela ($A$ e $A'$); segmenti corrispondenti: $AB$ e $A'B'$.
- Teorema del fascio: a segmenti congruenti su una trasversale corrispondono segmenti congruenti sull'altra.

## Dividere un segmento in parti congruenti

1. Da $A$ traccia una semiretta qualsiasi.
2. Riporta su di essa $n$ segmenti congruenti, fino a $P_n$.
3. Congiungi $P_n$ con $B$.
4. Dagli altri punti traccia le parallele a $P_nB$: dividono $AB$ in $n$ parti congruenti.

## Teorema di Talete

Il rapporto tra due segmenti di una trasversale è uguale al rapporto tra i segmenti corrispondenti dell'altra:

$$AB : BC = A'B' : B'C'$$

```tikz
% nome: teorema-di-talete-segmenti-proporzionali
% alt: Tre rette parallele a, b, c tagliate dalle trasversali r e s: i segmenti AB e BC su r e i segmenti corrispondenti A'B' e B'C' su s
% svg: teorema-di-talete-segmenti-proporzionali-75a455a9.svg 217x143
\begin{tikzpicture}
\draw[thick] (-0.20,0.00) -- (5.00,0.00);
\node[right] at (5.00,0.00) {$a$};
\draw[thick] (-0.20,1.00) -- (5.00,1.00);
\node[right] at (5.00,1.00) {$b$};
\draw[thick] (-0.20,2.60) -- (5.00,2.60);
\node[right] at (5.00,2.60) {$c$};
\draw[thick, blue!70!black] (0.31,-0.35) -- (1.14,2.95);
\node[above] at (1.14,2.95) {$r$};
\draw[thick, blue!70!black] (1.97,-0.35) -- (5.10,2.95);
\node[above] at (5.10,2.95) {$s$};
\fill (0.40,0.00) circle (0.05);
\node[above left] at (0.40,0.00) {$A$};
\fill (0.65,1.00) circle (0.05);
\node[above left] at (0.65,1.00) {$B$};
\fill (1.05,2.60) circle (0.05);
\node[above left] at (1.05,2.60) {$C$};
\fill (2.30,0.00) circle (0.05);
\node[above left] at (2.30,0.00) {$A'$};
\fill (3.25,1.00) circle (0.05);
\node[above left] at (3.25,1.00) {$B'$};
\fill (4.77,2.60) circle (0.05);
\node[above left] at (4.77,2.60) {$C'$};
\end{tikzpicture}
```

Scambiando i medi:

$$AB : A'B' = BC : B'C'$$

Con $\overline{AB} = 4$, $\overline{BC} = 10$, $\overline{A'B'} = 6$: $4 : 10 = 6 : x$, quindi $\overline{B'C'} = 15$.

## Nel triangolo

Una retta parallela a un lato divide gli altri due in parti proporzionali: se $DE \parallel BC$,

$$AD : DB = AE : EC$$

```tikz
% nome: triangolo-parallela-a-un-lato
% alt: Triangolo ABC con il segmento DE parallelo al lato BC, D su AB ed E su AC; per A passa la retta tratteggiata parallela a BC
% svg: triangolo-parallela-a-un-lato-17d89795.svg 209x142
\begin{tikzpicture}
\fill[blue!8] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick] (1.50,2.70) -- (0.00,0.00) -- (4.40,0.00) -- cycle;
\draw[thick, blue!70!black] (0.90,1.62) -- (2.66,1.62);
\draw[densely dashed] (0.20,2.70) -- (3.50,2.70);
\node[above] at (1.50,2.70) {$A$};
\node[below left] at (0.00,0.00) {$B$};
\node[below right] at (4.40,0.00) {$C$};
\node[left] at (0.90,1.62) {$D$};
\node[right] at (2.66,1.62) {$E$};
\fill (0.90,1.62) circle (0.05);
\fill (2.66,1.62) circle (0.05);
\end{tikzpicture}
```

- Anche $AD : AB = AE : AC$.
- Teorema inverso: se $AD : DB = AE : EC$, allora $DE \parallel BC$.

## Teorema della bisettrice

La bisettrice $AD$ dell'angolo $\hat{A}$ divide $BC$ in parti proporzionali agli altri due lati:

$$BD : DC = AB : AC$$

Con $\overline{AB} = 6$, $\overline{AC} = 9$, $\overline{BC} = 10$: $\overline{BD} = 4$, $\overline{DC} = 6$.

## Segmento dei punti medi

Il segmento che unisce i punti medi di due lati di un triangolo è parallelo al terzo lato e congruente alla sua metà: con $\overline{BC} = 12$ cm, $\overline{MN} = 6$ cm.

```ad-warning
Segmenti nello stesso ordine
$AB : BC = A'B' : B'C'$, non $AB : BC = B'C' : A'B'$.
```

```ad-warning
Il segmento parallelo non va con le parti
Con $DE \parallel BC$, $DE : BC$ è uguale ad $AD : AB$, non ad $AD : DB$.
```

```ad-warning
La bisettrice non dimezza il lato
Arriva nel punto medio di $BC$ solo se $AB \cong AC$.
```
