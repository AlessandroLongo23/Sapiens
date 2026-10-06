# Formulario: Forze conservative ed energia potenziale

## Forze conservative e non conservative

- Conservativa: il lavoro da $A$ a $B$ dipende solo da $A$ e da $B$, non dal cammino.
- In modo equivalente: il lavoro su ogni cammino chiuso è zero.

$$W_{A \to A} = 0$$

| | esempi | lavoro |
|---|---|---|
| conservative | peso, forza elastica | dipende solo dagli estremi |
| non conservative | attrito, resistenza dell'aria, spinta di una mano o di un motore | dipende dal cammino |

Attrito di modulo costante $F_d$ lungo un cammino di lunghezza $l$:

$$W_{attrito} = -F_d \cdot l$$

## Energia potenziale

$$W_{A \to B} = U_A - U_B = -\Delta U$$

- Contano solo le differenze di $U$: il livello zero si sceglie.
- Una forza non conservativa non ha un'energia potenziale.

| forza | lavoro da $A$ a $B$ | energia potenziale |
|---|---|---|
| peso | $m g h_A - m g h_B$ | $U = m g h$ |
| forza elastica | $\tfrac{1}{2} k x_A^2 - \tfrac{1}{2} k x_B^2$ | $U = \tfrac{1}{2} k x^2$ |

Se lavorano solo forze conservative, $E = K + U$ si conserva.

## Il grafico dell'energia potenziale

Energia cinetica, distanza verticale tra il grafico e la retta di $E$:

$$K = E - U$$

Punti di inversione, dove il corpo si ferma e torna indietro:

$$U = E$$

Forza, l'opposto della pendenza del grafico:

$$F_x = -\frac{\Delta U}{\Delta x}$$

- Il corpo può stare solo dove $U \le E$.
- La forza spinge verso i valori più bassi di $U$.
- Equilibrio dove il grafico è orizzontale: stabile in fondo a una buca, instabile in cima a una collina.

```tikz
% nome: energia-potenziale-molla-parabola
% alt: Il grafico dell'energia potenziale di una molla con costante elastica 200 newton al metro in funzione della deformazione x, da meno 10 a 10 centimetri: una parabola con il vertice nell'origine, che arriva a 1,0 joule agli estremi. Una retta orizzontale tratteggiata segna l'energia meccanica E uguale a 0,64 joule e incontra la parabola nei due punti di inversione, a meno 8 e a 8 centimetri. Nel punto x uguale a 5 centimetri un segmento verticale arancione sotto la parabola, lungo 0,25 joule, è l'energia potenziale U, e un segmento blu dalla parabola alla retta, lungo 0,39 joule, è l'energia cinetica K
% svg: energia-potenziale-molla-parabola-f1f9d19a.svg 317x182
% poi-interattivo: spostare la retta dell'energia meccanica e leggere i punti di inversione
\begin{tikzpicture}
\draw[gray!25, very thin] (-3,0) grid[xstep=0.6, ystep=0.6] (3,3);
\draw[->] (-3.4,0) -- (3.6,0) node[right] {$x$ (cm)};
\draw[->] (0,-0.3) -- (0,3.6) node[above] {$U$ (J)};
\foreach \x/\l in {-3/-10, -1.5/-5, 1.5/5, 3/10} \draw (\x,0.06) -- (\x,-0.06) node[below] {\small $\l$};
\foreach \y/\l in {1.5/0{,}5, 3/1{,}0} \draw (0.06,\y) -- (-0.06,\y) node[left] {\small $\l$};
\draw[thick, blue] plot[domain=-3:3, samples=41] (\x, {\x*\x/3});
\draw[dashed, thick] (-3,1.92) -- (3,1.92) node[right] {\small $E$};
\fill (-2.4,1.92) circle (1.5pt);
\fill (2.4,1.92) circle (1.5pt);
\draw[dashed, thin] (-2.4,1.92) -- (-2.4,0);
\draw[dashed, thin] (2.4,1.92) -- (2.4,0);
\draw[very thick, orange!90!black] (1.5,0) -- (1.5,0.75);
\draw[very thick, blue!60!black] (1.5,0.75) -- (1.5,1.92);
\node[right] at (1.5,0.32) {\small $U$};
\node[right] at (1.5,1.4) {\small $K$};
\end{tikzpicture}
```

```ad-warning
Il segno di W e di ΔU
$W = U_A - U_B$, iniziale meno finale: un sasso che cade perde energia potenziale e riceve un lavoro positivo.
```

```ad-warning
L'attrito al ritorno
Su un'andata e ritorno il lavoro dell'attrito non è zero: è negativo in tutti e due i versi.
```

```ad-warning
Il grafico non è una pista
Il corpo si muove sull'asse $x$; l'altezza del grafico è l'energia potenziale, non una quota.
```
