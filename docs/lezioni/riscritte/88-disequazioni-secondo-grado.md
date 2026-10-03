# Disequazioni di secondo grado

La disequazione $x^2 - 2x - 3 > 0$ chiede per quali valori di $x$ il trinomio $x^2 - 2x - 3$ è positivo. L'equazione $x^2 - 2x - 3 = 0$ ha le soluzioni $-1$ e $3$, ma la disequazione ne ha infinite: tutti i numeri minori di $-1$ e tutti quelli maggiori di $3$. Per trovarle si guarda il grafico del trinomio, che è una parabola: il trinomio è positivo dove la parabola sta sopra l'asse $x$ e negativo dove sta sotto.

Per seguire questa lezione ti servono le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), il grafico della [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) e gli intervalli della lezione [Disequazioni di primo grado e intervalli](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli), con le parentesi quadre rivolte verso l'esterno per gli estremi esclusi.

## Forma normale

Una disequazione è di **secondo grado** quando, portati tutti i termini a primo membro e ridotti i termini simili, si può scrivere in una di queste forme, con $a \neq 0$:

$$
\begin{gathered}
ax^2 + bx + c > 0 \\
ax^2 + bx + c \geq 0 \\
ax^2 + bx + c < 0 \\
ax^2 + bx + c \leq 0
\end{gathered}
$$

L'**equazione associata** è $ax^2 + bx + c = 0$, con lo stesso primo membro: le sue soluzioni $x_1$ e $x_2$, se ci sono, sono i punti in cui il trinomio vale zero, e il suo discriminante $\Delta = b^2 - 4ac$ dice quanti sono.

Conviene lavorare sempre con $a$ positivo. Se $a$ è negativo, moltiplica tutti e due i membri per $-1$ e cambia il verso, come nelle [disequazioni di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli). Per esempio

$$
\begin{gathered}
-x^2 + 4x - 3 \geq 0 \\
\Rightarrow x^2 - 4x + 3 \leq 0
\end{gathered}
$$

```ad-warning
Cambiare i segni senza cambiare il verso
Moltiplicare per $-1$ cambia il segno a tutti i termini e cambia anche il verso: da $-x^2 + 4x - 3 \geq 0$ si arriva a $x^2 - 4x + 3 \leq 0$, non a $x^2 - 4x + 3 \geq 0$. Le due disequazioni hanno soluzioni diverse: la prima $[1, 3]$, l'altra i numeri fuori da $\mathopen{]}1, 3\mathclose{[}$.
```

## Il segno del trinomio con la parabola

Il grafico di $y = ax^2 + bx + c$ è una parabola. Con $a > 0$ ha la concavità rivolta verso l'alto, e i punti in cui incontra l'asse $x$ sono le soluzioni dell'equazione associata. Per ogni $x$, il trinomio vale $y$: è positivo dove la parabola sta sopra l'asse $x$, vale zero dove la tocca, è negativo dove sta sotto. I casi sono tre, secondo il segno di $\Delta$.

### Discriminante positivo

Se $\Delta > 0$ la parabola taglia l'asse $x$ in due punti, $x_1$ e $x_2$. Il trinomio $x^2 - 2x - 3$ ha $\Delta = 16$ e si annulla in $-1$ e in $3$:

```tikz
% nome: segno-trinomio-delta-positivo
% alt: Parabola y uguale a x al quadrato meno 2x meno 3, rivolta verso l'alto, che taglia l'asse x in meno 1 e in 3: il trinomio è positivo prima di meno 1 e dopo 3, dove la parabola sta sopra l'asse, e negativo in mezzo
% svg: segno-trinomio-delta-positivo-38df4bb1.svg 192x139
\begin{tikzpicture}
\fill[blue!15] (-1.42,0) -- plot[smooth] coordinates {(-1.42,1.56) (-1.40,1.50) (-1.37,1.44) (-1.35,1.37) (-1.33,1.31) (-1.30,1.25) (-1.28,1.20) (-1.25,1.14) (-1.23,1.08) (-1.21,1.02) (-1.18,0.97) (-1.16,0.91) (-1.13,0.86) (-1.11,0.80) (-1.09,0.75) (-1.06,0.70) (-1.04,0.65) (-1.01,0.60) (-0.99,0.55) (-0.97,0.50) (-0.94,0.45) (-0.92,0.40) (-0.89,0.35) (-0.87,0.31) (-0.84,0.26) (-0.82,0.22) (-0.80,0.17) (-0.77,0.13) (-0.75,0.08) (-0.72,0.04) (-0.70,0.00)} -- (-0.70,0) -- cycle;
\fill[red!15] (-0.70,0) -- plot[smooth] coordinates {(-0.70,0.00) (-0.61,-0.15) (-0.51,-0.30) (-0.42,-0.43) (-0.33,-0.55) (-0.23,-0.67) (-0.14,-0.77) (-0.05,-0.86) (0.05,-0.94) (0.14,-1.01) (0.23,-1.07) (0.33,-1.11) (0.42,-1.15) (0.51,-1.18) (0.61,-1.19) (0.70,-1.20) (0.79,-1.19) (0.89,-1.18) (0.98,-1.15) (1.07,-1.11) (1.17,-1.07) (1.26,-1.01) (1.35,-0.94) (1.45,-0.86) (1.54,-0.77) (1.63,-0.67) (1.73,-0.55) (1.82,-0.43) (1.91,-0.30) (2.01,-0.15) (2.10,0.00)} -- (2.10,0) -- cycle;
\fill[blue!15] (2.10,0) -- plot[smooth] coordinates {(2.10,0.00) (2.12,0.04) (2.15,0.08) (2.17,0.13) (2.20,0.17) (2.22,0.22) (2.24,0.26) (2.27,0.31) (2.29,0.35) (2.32,0.40) (2.34,0.45) (2.36,0.50) (2.39,0.55) (2.41,0.60) (2.44,0.65) (2.46,0.70) (2.49,0.75) (2.51,0.80) (2.53,0.86) (2.56,0.91) (2.58,0.97) (2.61,1.02) (2.63,1.08) (2.65,1.14) (2.68,1.20) (2.70,1.25) (2.73,1.31) (2.75,1.37) (2.77,1.43) (2.80,1.50) (2.82,1.56)} -- (2.82,0) -- cycle;
\draw[black!70, ->] (-1.54,0) -- (3.01,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.32) -- (0,1.81) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.42,1.56) (-1.32,1.29) (-1.21,1.03) (-1.10,0.79) (-1.00,0.57) (-0.89,0.35) (-0.79,0.15) (-0.68,-0.03) (-0.57,-0.21) (-0.47,-0.37) (-0.36,-0.51) (-0.26,-0.64) (-0.15,-0.76) (-0.04,-0.86) (0.06,-0.95) (0.17,-1.03) (0.28,-1.09) (0.38,-1.14) (0.49,-1.17) (0.59,-1.19) (0.70,-1.20) (0.81,-1.19) (0.91,-1.17) (1.02,-1.14) (1.12,-1.09) (1.23,-1.03) (1.34,-0.95) (1.44,-0.86) (1.55,-0.76) (1.65,-0.64) (1.76,-0.51) (1.87,-0.37) (1.97,-0.21) (2.08,-0.04) (2.19,0.15) (2.29,0.35) (2.40,0.56) (2.50,0.79) (2.61,1.03) (2.72,1.29) (2.82,1.56)};
\fill (-0.70,0) circle (1.6pt);
\node[below left] at (-0.70,-0.05) {\small $-1$};
\fill (2.10,0) circle (1.6pt);
\node[below right] at (2.10,-0.05) {\small $3$};
\node at (-1.19,0.28) {\small $+$};
\node at (0.70,-0.30) {\small $-$};
\node at (2.59,0.28) {\small $+$};
\end{tikzpicture}
```
```grafico
% nome: segno-trinomio-cursore-c
% alt: La parabola y = x² - 2x + c con il cursore di c e il valore del discriminante: è colorata la parte di piano dove il trinomio è positivo, oppure quella dove è negativo, e cambia quando la parabola smette di tagliare l'asse x
curva: y=x^2-2x+c
scelta: \text{positivo} :: x^2-2x+c>0 | blu
scelta: \text{negativo} :: x^2-2x+c<0 | rosso
cursore: c = -3 da -5 a 5 passo 0,1
finestra: x da -5 a 7, y da -6 a 6
valore: \Delta = 4-4c
domanda: Alza $c$ fino a $1$, poi oltre: per quali $x$ il trinomio resta negativo?
```

Il trinomio è positivo per $x < -1$ oppure $x > 3$, negativo tra $-1$ e $3$. In generale, con $a > 0$ e $\Delta > 0$, il trinomio è positivo per i **valori esterni** all'intervallo delle soluzioni, $x < x_1$ oppure $x > x_2$, e negativo per i **valori interni**, $x_1 < x < x_2$.

### Discriminante nullo

Se $\Delta = 0$ la parabola tocca l'asse $x$ in un punto solo, il vertice, con $x_1 = x_2 = -\dfrac{b}{2a}$. Il trinomio $x^2 - 2x + 1$ ha $\Delta = 0$ e si annulla solo per $x = 1$:

```tikz
% nome: segno-trinomio-delta-nullo
% alt: Parabola y uguale a x al quadrato meno 2x più 1, rivolta verso l'alto, che tocca l'asse x solo in 1: il trinomio è positivo per ogni x diverso da 1 e vale zero in 1
% svg: segno-trinomio-delta-nullo-4247f679.svg 192x139
\begin{tikzpicture}
\fill[blue!15] (-0.90,0) -- plot[smooth] coordinates {(-0.90,1.56) (-0.84,1.46) (-0.79,1.36) (-0.74,1.26) (-0.68,1.17) (-0.63,1.08) (-0.58,1.00) (-0.52,0.92) (-0.47,0.84) (-0.42,0.76) (-0.36,0.69) (-0.31,0.63) (-0.26,0.56) (-0.20,0.50) (-0.15,0.44) (-0.10,0.39) (-0.04,0.34) (0.01,0.29) (0.06,0.25) (0.11,0.21) (0.17,0.17) (0.22,0.14) (0.27,0.11) (0.33,0.08) (0.38,0.06) (0.43,0.04) (0.49,0.03) (0.54,0.02) (0.59,0.01) (0.65,0.00) (0.70,0.00)} -- (0.70,0) -- cycle;
\fill[blue!15] (0.70,0) -- plot[smooth] coordinates {(0.70,0.00) (0.75,0.00) (0.81,0.01) (0.86,0.02) (0.91,0.03) (0.97,0.04) (1.02,0.06) (1.07,0.08) (1.13,0.11) (1.18,0.14) (1.23,0.17) (1.29,0.21) (1.34,0.25) (1.39,0.29) (1.44,0.34) (1.50,0.39) (1.55,0.44) (1.60,0.50) (1.66,0.56) (1.71,0.63) (1.76,0.69) (1.82,0.76) (1.87,0.84) (1.92,0.92) (1.98,1.00) (2.03,1.08) (2.08,1.17) (2.14,1.26) (2.19,1.36) (2.24,1.46) (2.30,1.56)} -- (2.30,0) -- cycle;
\draw[black!70, ->] (-1.54,0) -- (3.01,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.32) -- (0,1.81) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-0.90,1.56) (-0.82,1.41) (-0.74,1.26) (-0.66,1.13) (-0.58,1.00) (-0.50,0.88) (-0.42,0.76) (-0.34,0.66) (-0.26,0.56) (-0.18,0.47) (-0.10,0.39) (-0.02,0.32) (0.06,0.25) (0.14,0.19) (0.22,0.14) (0.30,0.10) (0.38,0.06) (0.46,0.04) (0.54,0.02) (0.62,0.00) (0.70,0.00) (0.78,0.00) (0.86,0.02) (0.94,0.04) (1.02,0.06) (1.10,0.10) (1.18,0.14) (1.26,0.19) (1.34,0.25) (1.42,0.32) (1.50,0.39) (1.58,0.47) (1.66,0.56) (1.74,0.66) (1.82,0.76) (1.90,0.88) (1.98,1.00) (2.06,1.13) (2.14,1.26) (2.22,1.41) (2.30,1.56)};
\fill (0.70,0) circle (1.6pt);
\node[below] at (0.70,-0.05) {\small $1$};
\node at (-0.63,0.28) {\small $+$};
\node at (2.03,0.28) {\small $+$};
\end{tikzpicture}
```

Il trinomio è positivo per ogni $x$ diverso da $1$ e vale zero per $x = 1$; non è mai negativo. Infatti è un quadrato, $x^2 - 2x + 1 = (x - 1)^2$, e un quadrato non è mai negativo.

### Discriminante negativo

Se $\Delta < 0$ la parabola non incontra l'asse $x$: con $a > 0$ sta tutta sopra. Il trinomio $x^2 - 2x + 3$ ha $\Delta = 4 - 12 = -8$:

```tikz
% nome: segno-trinomio-delta-negativo
% alt: Parabola y uguale a x al quadrato meno 2x più 3, rivolta verso l'alto e tutta sopra l'asse x: il trinomio è positivo per ogni x
% svg: segno-trinomio-delta-negativo-f17a684a.svg 192x139
\begin{tikzpicture}
\fill[blue!15] (-0.55,0) -- plot[smooth] coordinates {(-0.55,1.56) (-0.47,1.44) (-0.38,1.32) (-0.30,1.21) (-0.22,1.12) (-0.13,1.03) (-0.05,0.95) (0.03,0.87) (0.12,0.81) (0.20,0.75) (0.28,0.71) (0.37,0.67) (0.45,0.64) (0.53,0.62) (0.62,0.60) (0.70,0.60) (0.78,0.60) (0.87,0.62) (0.95,0.64) (1.03,0.67) (1.12,0.71) (1.20,0.75) (1.28,0.81) (1.37,0.87) (1.45,0.95) (1.53,1.03) (1.62,1.12) (1.70,1.21) (1.79,1.32) (1.87,1.44) (1.95,1.56)} -- (1.95,0) -- cycle;
\draw[black!70, ->] (-1.54,0) -- (3.01,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.32) -- (0,1.81) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-0.55,1.56) (-0.49,1.47) (-0.43,1.38) (-0.36,1.29) (-0.30,1.21) (-0.24,1.14) (-0.18,1.07) (-0.11,1.01) (-0.05,0.95) (0.01,0.89) (0.07,0.84) (0.14,0.79) (0.20,0.75) (0.26,0.72) (0.32,0.69) (0.39,0.66) (0.45,0.64) (0.51,0.62) (0.58,0.61) (0.64,0.60) (0.70,0.60) (0.76,0.60) (0.83,0.61) (0.89,0.62) (0.95,0.64) (1.01,0.66) (1.08,0.69) (1.14,0.72) (1.20,0.75) (1.26,0.79) (1.33,0.84) (1.39,0.89) (1.45,0.95) (1.51,1.01) (1.58,1.07) (1.64,1.14) (1.70,1.21) (1.76,1.29) (1.83,1.38) (1.89,1.47) (1.95,1.56)};
\node at (-0.63,0.28) {\small $+$};
\node at (2.03,0.28) {\small $+$};
\end{tikzpicture}
```

Il trinomio è positivo per ogni $x$, e non vale mai zero.

### Quando a è negativo

Con $a < 0$ la parabola ha la concavità rivolta verso il basso, e i segni si scambiano. Il trinomio $-x^2 + 2x + 3$ si annulla ancora in $-1$ e in $3$, ma è positivo tra i due valori e negativo fuori:

```tikz
% nome: segno-trinomio-a-negativo
% alt: Parabola y uguale a meno x al quadrato più 2x più 3, rivolta verso il basso, che taglia l'asse x in meno 1 e in 3: il trinomio è negativo prima di meno 1 e dopo 3 e positivo in mezzo
% svg: segno-trinomio-a-negativo-db302183.svg 192x139
\begin{tikzpicture}
\fill[red!15] (-1.42,0) -- plot[smooth] coordinates {(-1.42,-1.56) (-1.40,-1.50) (-1.37,-1.44) (-1.35,-1.37) (-1.33,-1.31) (-1.30,-1.25) (-1.28,-1.20) (-1.25,-1.14) (-1.23,-1.08) (-1.21,-1.02) (-1.18,-0.97) (-1.16,-0.91) (-1.13,-0.86) (-1.11,-0.80) (-1.09,-0.75) (-1.06,-0.70) (-1.04,-0.65) (-1.01,-0.60) (-0.99,-0.55) (-0.97,-0.50) (-0.94,-0.45) (-0.92,-0.40) (-0.89,-0.35) (-0.87,-0.31) (-0.84,-0.26) (-0.82,-0.22) (-0.80,-0.17) (-0.77,-0.13) (-0.75,-0.08) (-0.72,-0.04) (-0.70,0.00)} -- (-0.70,0) -- cycle;
\fill[blue!15] (-0.70,0) -- plot[smooth] coordinates {(-0.70,0.00) (-0.61,0.15) (-0.51,0.30) (-0.42,0.43) (-0.33,0.55) (-0.23,0.67) (-0.14,0.77) (-0.05,0.86) (0.05,0.94) (0.14,1.01) (0.23,1.07) (0.33,1.11) (0.42,1.15) (0.51,1.18) (0.61,1.19) (0.70,1.20) (0.79,1.19) (0.89,1.18) (0.98,1.15) (1.07,1.11) (1.17,1.07) (1.26,1.01) (1.35,0.94) (1.45,0.86) (1.54,0.77) (1.63,0.67) (1.73,0.55) (1.82,0.43) (1.91,0.30) (2.01,0.15) (2.10,0.00)} -- (2.10,0) -- cycle;
\fill[red!15] (2.10,0) -- plot[smooth] coordinates {(2.10,0.00) (2.12,-0.04) (2.15,-0.08) (2.17,-0.13) (2.20,-0.17) (2.22,-0.22) (2.24,-0.26) (2.27,-0.31) (2.29,-0.35) (2.32,-0.40) (2.34,-0.45) (2.36,-0.50) (2.39,-0.55) (2.41,-0.60) (2.44,-0.65) (2.46,-0.70) (2.49,-0.75) (2.51,-0.80) (2.53,-0.86) (2.56,-0.91) (2.58,-0.97) (2.61,-1.02) (2.63,-1.08) (2.65,-1.14) (2.68,-1.20) (2.70,-1.25) (2.73,-1.31) (2.75,-1.37) (2.77,-1.43) (2.80,-1.50) (2.82,-1.56)} -- (2.82,0) -- cycle;
\draw[black!70, ->] (-1.54,0) -- (3.01,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.56) -- (0,1.57) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.42,-1.56) (-1.32,-1.29) (-1.21,-1.03) (-1.10,-0.79) (-1.00,-0.57) (-0.89,-0.35) (-0.79,-0.15) (-0.68,0.03) (-0.57,0.21) (-0.47,0.37) (-0.36,0.51) (-0.26,0.64) (-0.15,0.76) (-0.04,0.86) (0.06,0.95) (0.17,1.03) (0.28,1.09) (0.38,1.14) (0.49,1.17) (0.59,1.19) (0.70,1.20) (0.81,1.19) (0.91,1.17) (1.02,1.14) (1.12,1.09) (1.23,1.03) (1.34,0.95) (1.44,0.86) (1.55,0.76) (1.65,0.64) (1.76,0.51) (1.87,0.37) (1.97,0.21) (2.08,0.04) (2.19,-0.15) (2.29,-0.35) (2.40,-0.56) (2.50,-0.79) (2.61,-1.03) (2.72,-1.29) (2.82,-1.56)};
\fill (-0.70,0) circle (1.6pt);
\node[below right] at (-0.70,-0.05) {\small $-1$};
\fill (2.10,0) circle (1.6pt);
\node[below left] at (2.10,-0.05) {\small $3$};
\node at (-1.19,-0.30) {\small $-$};
\node at (0.70,0.28) {\small $+$};
\node at (2.59,-0.30) {\small $-$};
\end{tikzpicture}
```
```grafico
% nome: segno-trinomio-cursore-a
% alt: La parabola y = a(x² - 2x - 3) con il cursore di a: taglia sempre l'asse x in -1 e in 3, e la parte di piano dove il trinomio è positivo passa dai valori interni, con a negativo, ai valori esterni, con a positivo
curva: y=a\left(x^2-2x-3\right)
scelta: \text{positivo} :: a\left(x^2-2x-3\right)>0 | blu
scelta: \text{negativo} :: a\left(x^2-2x-3\right)<0 | rosso
cursore: a = -1 da -3 a 3 passo 0,1
finestra: x da -5 a 7, y da -6 a 6
domanda: Porta $a$ da negativo a positivo: i due zeri si spostano? E i segni?
```

Allo stesso modo, con $a < 0$ e $\Delta = 0$ il trinomio è negativo per ogni $x$ tranne il vertice, dove vale zero, e con $\Delta < 0$ è negativo per ogni $x$. Per non dover ricordare due regole, nelle disequazioni si moltiplica per $-1$ e si cambia il verso: da $-x^2 + 2x + 3 > 0$ si passa a $x^2 - 2x - 3 < 0$, che ha le stesse soluzioni, $-1 < x < 3$.

## La tabella riassuntiva

Con $a > 0$ le soluzioni dipendono solo dal segno di $\Delta$ e dal verso. Se $a$ è negativo, prima rendilo positivo.

| Verso | $\Delta > 0$ | $\Delta = 0$ | $\Delta < 0$ |
|---|---|---|---|
| $> 0$ | $x < x_1$ oppure $x > x_2$ | $x \neq x_1$ | ogni $x$ |
| $\geq 0$ | $x \leq x_1$ oppure $x \geq x_2$ | ogni $x$ | ogni $x$ |
| $< 0$ | $x_1 < x < x_2$ | nessun $x$ | nessun $x$ |
| $\leq 0$ | $x_1 \leq x \leq x_2$ | $x = x_1$ | nessun $x$ |

"Ogni $x$" vuol dire $S = \mathbb{R}$, "nessun $x$" vuol dire $S = \emptyset$. La colonna di $\Delta > 0$ si ricorda così: con $a > 0$, il verso $>$ vuole i valori esterni, il verso $<$ quelli interni.

Ogni casella della tabella è una posizione del cursore: scegli il verso, muovi $c$ e guarda quale parte di piano resta colorata.

```grafico
% nome: disequazione-secondo-grado-tabella-cursore
% alt: La parabola y = x² - 2x + c con il cursore di c, il discriminante e i quattro versi tra cui scegliere: è colorata la parte di piano dove vale la disequazione, con il bordo tratteggiato quando gli estremi sono esclusi
curva: y=x^2-2x+c
scelta: > 0 :: x^2-2x+c>0
scelta: \geq 0 :: x^2-2x+c\ge0
scelta: < 0 :: x^2-2x+c<0
scelta: \leq 0 :: x^2-2x+c\le0
cursore: c = -3 da -5 a 5 passo 0,1
finestra: x da -5 a 7, y da -6 a 6
valore: \Delta = 4-4c
domanda: Con $c = 1$ il discriminante è zero: che cosa cambia tra $> 0$ e $\geq 0$? E tra $< 0$ e $\leq 0$?
```

## Come si risolve

1. Porta tutti i termini a primo membro e riduci alla forma normale $ax^2 + bx + c$ confrontato con $0$.
2. Se $a$ è negativo, moltiplica per $-1$ e cambia il verso.
3. Calcola $\Delta$ e, se non è negativo, le soluzioni $x_1 \leq x_2$ dell'equazione associata.
4. Disegna a grandi linee la parabola: concavità verso l'alto e i punti sull'asse $x$. Il vertice non serve.
5. Scegli dove la parabola sta sopra l'asse (verso $>$) o sotto (verso $<$). Con $\geq$ e $\leq$ aggiungi i punti in cui tocca l'asse. Scrivi $S$ con gli intervalli.

## Esempi svolti

Nelle figure la parte di parabola che risolve la disequazione è colorata, e l'ultima riga, $S$, mostra le soluzioni sulla retta: pallino pieno per un estremo compreso, pallino vuoto per un estremo escluso.

```ad-example
Esempio 1: valori interni
$$x^2 - x - 6 \leq 0$$

Il coefficiente $a = 1$ è positivo. Risolvi l'equazione associata:

$$
\begin{gathered}
\Delta = 1 + 24 = 25 \\
x_{1,2} = \frac{1 \pm 5}{2} \\
x_1 = -2, \quad x_2 = 3
\end{gathered}
$$

La parabola taglia l'asse $x$ in $-2$ e in $3$. Il verso è $\leq$: servono i punti in cui la parabola sta sotto l'asse, cioè i valori interni, più i due punti in cui lo tocca.

```tikz
% nome: disequazione-secondo-grado-valori-interni
% alt: Parabola y uguale a x al quadrato meno x meno 6 con evidenziato l'arco sotto l'asse x, tra meno 2 e 3, e sotto le soluzioni della disequazione minore o uguale a zero: il segmento da meno 2 a 3 con i pallini pieni
% svg: disequazione-secondo-grado-valori-interni-ddeff324.svg 216x172
\begin{tikzpicture}
\fill[blue!15] (-1.24,0) -- plot[smooth] coordinates {(-1.24,0.00) (-1.14,-0.20) (-1.03,-0.39) (-0.93,-0.56) (-0.83,-0.72) (-0.72,-0.87) (-0.62,-1.00) (-0.52,-1.12) (-0.41,-1.22) (-0.31,-1.31) (-0.21,-1.39) (-0.10,-1.45) (0.00,-1.50) (0.10,-1.53) (0.21,-1.56) (0.31,-1.56) (0.41,-1.56) (0.52,-1.53) (0.62,-1.50) (0.72,-1.45) (0.83,-1.39) (0.93,-1.31) (1.03,-1.22) (1.14,-1.12) (1.24,-1.00) (1.34,-0.87) (1.45,-0.72) (1.55,-0.56) (1.65,-0.39) (1.76,-0.20) (1.86,0.00)} -- (1.86,0) -- cycle;
\draw[black!70, ->] (-2.05,0) -- (2.67,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.65) -- (0,1.38) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.72,1.12) (-1.62,0.86) (-1.52,0.61) (-1.42,0.38) (-1.32,0.16) (-1.21,-0.05) (-1.11,-0.25) (-1.01,-0.43) (-0.91,-0.60) (-0.81,-0.75) (-0.71,-0.89) (-0.60,-1.02) (-0.50,-1.13) (-0.40,-1.23) (-0.30,-1.32) (-0.20,-1.39) (-0.10,-1.46) (0.01,-1.50) (0.11,-1.54) (0.21,-1.56) (0.31,-1.56) (0.41,-1.56) (0.51,-1.54) (0.61,-1.50) (0.72,-1.46) (0.82,-1.39) (0.92,-1.32) (1.02,-1.23) (1.12,-1.13) (1.22,-1.02) (1.33,-0.89) (1.43,-0.75) (1.53,-0.60) (1.63,-0.43) (1.73,-0.25) (1.83,-0.05) (1.94,0.16) (2.04,0.38) (2.14,0.61) (2.24,0.86) (2.34,1.12)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-1.24,0.00) (-1.14,-0.20) (-1.03,-0.39) (-0.93,-0.56) (-0.83,-0.72) (-0.72,-0.87) (-0.62,-1.00) (-0.52,-1.12) (-0.41,-1.22) (-0.31,-1.31) (-0.21,-1.39) (-0.10,-1.45) (0.00,-1.50) (0.10,-1.53) (0.21,-1.56) (0.31,-1.56) (0.41,-1.56) (0.52,-1.53) (0.62,-1.50) (0.72,-1.45) (0.83,-1.39) (0.93,-1.31) (1.03,-1.22) (1.14,-1.12) (1.24,-1.00) (1.34,-0.87) (1.45,-0.72) (1.55,-0.56) (1.65,-0.39) (1.76,-0.20) (1.86,0.00)};
\fill (-1.24,0) circle (1.6pt);
\node[below left] at (-1.24,-0.05) {\small $-2$};
\fill (1.86,0) circle (1.6pt);
\node[below right] at (1.86,-0.05) {\small $3$};
\node[left] at (-2.05,-2.40) {\small $S$};
\draw[blue!45, line width=2pt] (-1.24,-2.40) -- (1.86,-2.40);
\fill (-1.24,-2.40) circle (2.5pt);
\fill (1.86,-2.40) circle (2.5pt);
\draw[gray!60, densely dotted] (-1.24,-1.75) -- (-1.24,-2.20);
\draw[gray!60, densely dotted] (1.86,-1.75) -- (1.86,-2.20);
\end{tikzpicture}
```

$-2 \leq x \leq 3$, cioè $S = [-2, 3]$. Verifica con $x = 0$, che sta nell'intervallo: $0 - 0 - 6 = -6 \leq 0$, vero.
```

```ad-example
Esempio 2: valori esterni
$$2x^2 - 3x - 2 > 0$$

$$
\begin{gathered}
\Delta = 9 + 16 = 25 \\
x_{1,2} = \frac{3 \pm 5}{4} \\
x_1 = -\frac{1}{2}, \quad x_2 = 2
\end{gathered}
$$

Il denominatore è $2a = 4$. Il verso è $>$: servono i valori esterni, con gli estremi esclusi.

```tikz
% nome: disequazione-secondo-grado-valori-esterni
% alt: Parabola y uguale a 2x al quadrato meno 3x meno 2 con evidenziati i due rami sopra l'asse x, prima di meno un mezzo e dopo 2, e sotto le soluzioni della disequazione maggiore di zero con i pallini vuoti
% svg: disequazione-secondo-grado-valori-esterni-7102228c.svg 217x173
\begin{tikzpicture}
\fill[blue!15] (-1.08,0) -- plot[smooth] coordinates {(-1.08,1.65) (-1.05,1.58) (-1.03,1.51) (-1.01,1.45) (-0.99,1.38) (-0.97,1.32) (-0.95,1.26) (-0.92,1.19) (-0.90,1.13) (-0.88,1.07) (-0.86,1.01) (-0.84,0.95) (-0.82,0.90) (-0.79,0.84) (-0.77,0.78) (-0.75,0.73) (-0.73,0.67) (-0.71,0.62) (-0.69,0.57) (-0.66,0.51) (-0.64,0.46) (-0.62,0.41) (-0.60,0.36) (-0.58,0.32) (-0.56,0.27) (-0.53,0.22) (-0.51,0.18) (-0.49,0.13) (-0.47,0.09) (-0.45,0.04) (-0.42,0.00)} -- (-0.42,0) -- cycle;
\fill[blue!15] (1.70,0) -- plot[smooth] coordinates {(1.70,0.00) (1.72,0.04) (1.74,0.09) (1.76,0.13) (1.79,0.17) (1.81,0.22) (1.83,0.27) (1.85,0.32) (1.87,0.36) (1.89,0.41) (1.92,0.46) (1.94,0.51) (1.96,0.57) (1.98,0.62) (2.00,0.67) (2.02,0.73) (2.05,0.78) (2.07,0.84) (2.09,0.90) (2.11,0.95) (2.13,1.01) (2.15,1.07) (2.18,1.13) (2.20,1.19) (2.22,1.26) (2.24,1.32) (2.26,1.38) (2.28,1.45) (2.31,1.51) (2.33,1.58) (2.35,1.65)} -- (2.35,0) -- cycle;
\draw[black!70, ->] (-1.70,0) -- (3.06,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.16) -- (0,1.90) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.08,1.65) (-0.99,1.39) (-0.90,1.14) (-0.82,0.91) (-0.73,0.68) (-0.65,0.48) (-0.56,0.28) (-0.48,0.10) (-0.39,-0.07) (-0.30,-0.22) (-0.22,-0.36) (-0.13,-0.49) (-0.05,-0.60) (0.04,-0.70) (0.12,-0.79) (0.21,-0.86) (0.29,-0.92) (0.38,-0.97) (0.47,-1.00) (0.55,-1.02) (0.64,-1.03) (0.72,-1.02) (0.81,-1.00) (0.89,-0.97) (0.98,-0.92) (1.07,-0.86) (1.15,-0.79) (1.24,-0.70) (1.32,-0.60) (1.41,-0.49) (1.49,-0.36) (1.58,-0.22) (1.66,-0.07) (1.75,0.10) (1.84,0.28) (1.92,0.47) (2.01,0.68) (2.09,0.90) (2.18,1.14) (2.26,1.39) (2.35,1.65)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-1.08,1.65) (-1.05,1.58) (-1.03,1.51) (-1.01,1.45) (-0.99,1.38) (-0.97,1.32) (-0.95,1.26) (-0.92,1.19) (-0.90,1.13) (-0.88,1.07) (-0.86,1.01) (-0.84,0.95) (-0.82,0.90) (-0.79,0.84) (-0.77,0.78) (-0.75,0.73) (-0.73,0.67) (-0.71,0.62) (-0.69,0.57) (-0.66,0.51) (-0.64,0.46) (-0.62,0.41) (-0.60,0.36) (-0.58,0.32) (-0.56,0.27) (-0.53,0.22) (-0.51,0.18) (-0.49,0.13) (-0.47,0.09) (-0.45,0.04) (-0.42,0.00)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(1.70,0.00) (1.72,0.04) (1.74,0.09) (1.76,0.13) (1.79,0.17) (1.81,0.22) (1.83,0.27) (1.85,0.32) (1.87,0.36) (1.89,0.41) (1.92,0.46) (1.94,0.51) (1.96,0.57) (1.98,0.62) (2.00,0.67) (2.02,0.73) (2.05,0.78) (2.07,0.84) (2.09,0.90) (2.11,0.95) (2.13,1.01) (2.15,1.07) (2.18,1.13) (2.20,1.19) (2.22,1.26) (2.24,1.32) (2.26,1.38) (2.28,1.45) (2.31,1.51) (2.33,1.58) (2.35,1.65)};
\fill (-0.42,0) circle (1.6pt);
\node[below left] at (-0.42,-0.05) {\small $-\frac{1}{2}$};
\fill (1.70,0) circle (1.6pt);
\node[below right] at (1.70,-0.05) {\small $2$};
\node[left] at (-1.70,-1.91) {\small $S$};
\draw[blue!45, line width=2pt] (-1.70,-1.91) -- (-0.53,-1.91);
\draw[thick] (-0.42,-1.91) circle (2.5pt);
\draw[blue!45, line width=2pt] (1.80,-1.91) -- (2.81,-1.91);
\draw[thick] (1.70,-1.91) circle (2.5pt);
\draw[gray!60, densely dotted] (-0.42,-1.26) -- (-0.42,-1.71);
\draw[gray!60, densely dotted] (1.70,-1.26) -- (1.70,-1.71);
\end{tikzpicture}
```

$$x < -\frac{1}{2} \ \text{ oppure } \ x > 2$$

$$
\begin{gathered}
S = \left]-\infty, -\frac{1}{2}\right[ \\
\cup \,\mathopen{]}2, +\infty\mathclose{[}
\end{gathered}
$$
```

```ad-warning
Fermarsi all'equazione associata
Le soluzioni dell'equazione associata non sono le soluzioni della disequazione: nell'esempio 2 non si risponde "$x = -\dfrac{1}{2}$ e $x = 2$". Quei due numeri sono gli estremi degli intervalli, e con il verso $>$ non sono nemmeno soluzioni.
```

```ad-example
Esempio 3: coefficiente di x² negativo
$$4x - x^2 > 3$$

Porta tutto a primo membro e ordina, poi moltiplica per $-1$ cambiando il verso:

$$
\begin{gathered}
-x^2 + 4x - 3 > 0 \\
\Rightarrow x^2 - 4x + 3 < 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 16 - 12 = 4 \\
x_{1,2} = \frac{4 \pm 2}{2} \\
x_1 = 1, \quad x_2 = 3
\end{gathered}
$$

Il verso ora è $<$: valori interni, estremi esclusi.

```tikz
% nome: disequazione-secondo-grado-a-negativo
% alt: Parabola y uguale a x al quadrato meno 4x più 3, ottenuta cambiando segno al trinomio, con evidenziato l'arco sotto l'asse x tra 1 e 3, e sotto le soluzioni della disequazione minore di zero: il segmento tra 1 e 3 con i pallini vuoti
% svg: disequazione-secondo-grado-a-negativo-49cf9d99.svg 208x173
\begin{tikzpicture}
\fill[blue!15] (0.75,0) -- plot[smooth] coordinates {(0.75,0.00) (0.80,-0.06) (0.85,-0.12) (0.90,-0.18) (0.95,-0.23) (1.00,-0.28) (1.05,-0.32) (1.10,-0.36) (1.15,-0.39) (1.20,-0.42) (1.25,-0.44) (1.30,-0.46) (1.35,-0.48) (1.40,-0.49) (1.45,-0.50) (1.50,-0.50) (1.55,-0.50) (1.60,-0.49) (1.65,-0.48) (1.70,-0.46) (1.75,-0.44) (1.80,-0.42) (1.85,-0.39) (1.90,-0.36) (1.95,-0.32) (2.00,-0.28) (2.05,-0.23) (2.10,-0.18) (2.15,-0.12) (2.20,-0.06) (2.25,0.00)} -- (2.25,0) -- cycle;
\draw[black!70, ->] (-0.75,0) -- (3.75,0) node[right] {$x$};
\draw[black!70, ->] (0,-0.70) -- (0,2.35) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-0.21,2.10) (-0.12,1.85) (-0.04,1.61) (0.05,1.38) (0.13,1.16) (0.22,0.96) (0.30,0.77) (0.39,0.60) (0.47,0.44) (0.56,0.29) (0.65,0.15) (0.73,0.03) (0.82,-0.08) (0.90,-0.18) (0.99,-0.27) (1.07,-0.34) (1.16,-0.40) (1.24,-0.44) (1.33,-0.47) (1.41,-0.49) (1.50,-0.50) (1.59,-0.49) (1.67,-0.47) (1.76,-0.44) (1.84,-0.40) (1.93,-0.34) (2.01,-0.27) (2.10,-0.18) (2.18,-0.08) (2.27,0.03) (2.36,0.15) (2.44,0.29) (2.53,0.44) (2.61,0.60) (2.70,0.77) (2.78,0.96) (2.87,1.16) (2.95,1.38) (3.04,1.61) (3.12,1.85) (3.21,2.10)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(0.75,0.00) (0.80,-0.06) (0.85,-0.12) (0.90,-0.18) (0.95,-0.23) (1.00,-0.28) (1.05,-0.32) (1.10,-0.36) (1.15,-0.39) (1.20,-0.42) (1.25,-0.44) (1.30,-0.46) (1.35,-0.48) (1.40,-0.49) (1.45,-0.50) (1.50,-0.50) (1.55,-0.50) (1.60,-0.49) (1.65,-0.48) (1.70,-0.46) (1.75,-0.44) (1.80,-0.42) (1.85,-0.39) (1.90,-0.36) (1.95,-0.32) (2.00,-0.28) (2.05,-0.23) (2.10,-0.18) (2.15,-0.12) (2.20,-0.06) (2.25,0.00)};
\fill (0.75,0) circle (1.6pt);
\node[below left] at (0.75,-0.05) {\small $1$};
\fill (2.25,0) circle (1.6pt);
\node[below right] at (2.25,-0.05) {\small $3$};
\node[left] at (-0.75,-1.45) {\small $S$};
\draw[blue!45, line width=2pt] (0.85,-1.45) -- (2.15,-1.45);
\draw[thick] (0.75,-1.45) circle (2.5pt);
\draw[thick] (2.25,-1.45) circle (2.5pt);
\draw[gray!60, densely dotted] (0.75,-0.80) -- (0.75,-1.25);
\draw[gray!60, densely dotted] (2.25,-0.80) -- (2.25,-1.25);
\end{tikzpicture}
```

$1 < x < 3$, cioè $S = \,\mathopen{]}1, 3\mathclose{[}$. Verifica con $x = 2$ nella disequazione di partenza: $8 - 4 = 4 > 3$, vero.
```

```ad-example
Esempio 4: soluzioni irrazionali
$$x^2 + 2x - 4 \geq 0$$

$$
\begin{gathered}
\Delta = 4 + 16 = 20 \\
\sqrt{20} = 2\sqrt{5}
\end{gathered}
$$

$$
\begin{aligned}
x_{1,2} &= \frac{-2 \pm 2\sqrt{5}}{2} \\
&= -1 \pm \sqrt{5}
\end{aligned}
$$

Quindi $x_1 = -1 - \sqrt{5}$ e $x_2 = -1 + \sqrt{5}$, circa $-3{,}24$ e $1{,}24$. Il verso è $\geq$: valori esterni, estremi compresi.

```tikz
% nome: disequazione-secondo-grado-soluzioni-irrazionali
% alt: Parabola y uguale a x al quadrato più 2x meno 4 con evidenziati i due rami sopra l'asse x, prima di meno 1 meno radice di 5 e dopo meno 1 più radice di 5, e sotto le soluzioni della disequazione maggiore o uguale a zero con i pallini pieni
% svg: disequazione-secondo-grado-soluzioni-irrazionali-b4af7412.svg 218x168
\begin{tikzpicture}
\fill[blue!15] (-2.42,0) -- plot[smooth] coordinates {(-2.42,1.17) (-2.40,1.13) (-2.39,1.08) (-2.37,1.04) (-2.36,1.00) (-2.34,0.95) (-2.32,0.91) (-2.31,0.87) (-2.29,0.83) (-2.28,0.78) (-2.26,0.74) (-2.24,0.70) (-2.23,0.66) (-2.21,0.62) (-2.20,0.58) (-2.18,0.54) (-2.16,0.50) (-2.15,0.47) (-2.13,0.43) (-2.12,0.39) (-2.10,0.35) (-2.08,0.31) (-2.07,0.28) (-2.05,0.24) (-2.04,0.21) (-2.02,0.17) (-2.01,0.14) (-1.99,0.10) (-1.97,0.07) (-1.96,0.03) (-1.94,0.00)} -- (-1.94,0) -- cycle;
\fill[blue!15] (0.74,0) -- plot[smooth] coordinates {(0.74,0.00) (0.76,0.03) (0.77,0.07) (0.79,0.10) (0.81,0.14) (0.82,0.17) (0.84,0.21) (0.85,0.24) (0.87,0.28) (0.89,0.32) (0.90,0.35) (0.92,0.39) (0.93,0.43) (0.95,0.47) (0.96,0.50) (0.98,0.54) (1.00,0.58) (1.01,0.62) (1.03,0.66) (1.04,0.70) (1.06,0.74) (1.08,0.79) (1.09,0.83) (1.11,0.87) (1.12,0.91) (1.14,0.95) (1.16,1.00) (1.17,1.04) (1.19,1.09) (1.20,1.13) (1.22,1.18)} -- (1.22,0) -- cycle;
\draw[black!70, ->] (-2.88,0) -- (1.80,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.48) -- (0,1.43) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-2.42,1.17) (-2.33,0.92) (-2.24,0.68) (-2.15,0.46) (-2.06,0.25) (-1.96,0.05) (-1.87,-0.14) (-1.78,-0.31) (-1.69,-0.47) (-1.60,-0.62) (-1.51,-0.76) (-1.42,-0.88) (-1.33,-0.99) (-1.24,-1.08) (-1.15,-1.17) (-1.05,-1.24) (-0.96,-1.30) (-0.87,-1.34) (-0.78,-1.37) (-0.69,-1.39) (-0.60,-1.40) (-0.51,-1.39) (-0.42,-1.37) (-0.33,-1.34) (-0.24,-1.30) (-0.14,-1.24) (-0.05,-1.17) (0.04,-1.08) (0.13,-0.99) (0.22,-0.88) (0.31,-0.76) (0.40,-0.62) (0.49,-0.47) (0.58,-0.31) (0.67,-0.14) (0.76,0.05) (0.86,0.25) (0.95,0.46) (1.04,0.69) (1.13,0.92) (1.22,1.18)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-2.42,1.17) (-2.40,1.13) (-2.39,1.08) (-2.37,1.04) (-2.36,1.00) (-2.34,0.95) (-2.32,0.91) (-2.31,0.87) (-2.29,0.83) (-2.28,0.78) (-2.26,0.74) (-2.24,0.70) (-2.23,0.66) (-2.21,0.62) (-2.20,0.58) (-2.18,0.54) (-2.16,0.50) (-2.15,0.47) (-2.13,0.43) (-2.12,0.39) (-2.10,0.35) (-2.08,0.31) (-2.07,0.28) (-2.05,0.24) (-2.04,0.21) (-2.02,0.17) (-2.01,0.14) (-1.99,0.10) (-1.97,0.07) (-1.96,0.03) (-1.94,0.00)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(0.74,0.00) (0.76,0.03) (0.77,0.07) (0.79,0.10) (0.81,0.14) (0.82,0.17) (0.84,0.21) (0.85,0.24) (0.87,0.28) (0.89,0.32) (0.90,0.35) (0.92,0.39) (0.93,0.43) (0.95,0.47) (0.96,0.50) (0.98,0.54) (1.00,0.58) (1.01,0.62) (1.03,0.66) (1.04,0.70) (1.06,0.74) (1.08,0.79) (1.09,0.83) (1.11,0.87) (1.12,0.91) (1.14,0.95) (1.16,1.00) (1.17,1.04) (1.19,1.09) (1.20,1.13) (1.22,1.18)};
\fill (-1.94,0) circle (1.6pt);
\node[below left] at (-1.94,-0.05) {\small $-1-\sqrt{5}$};
\fill (0.74,0) circle (1.6pt);
\node[below right] at (0.74,-0.05) {\small $-1+\sqrt{5}$};
\node[left] at (-2.88,-2.23) {\small $S$};
\draw[blue!45, line width=2pt] (-2.88,-2.23) -- (-1.94,-2.23);
\fill (-1.94,-2.23) circle (2.5pt);
\draw[blue!45, line width=2pt] (0.74,-2.23) -- (1.62,-2.23);
\fill (0.74,-2.23) circle (2.5pt);
\draw[gray!60, densely dotted] (-1.94,-1.58) -- (-1.94,-2.03);
\draw[gray!60, densely dotted] (0.74,-1.58) -- (0.74,-2.03);
\end{tikzpicture}
```

$$
\begin{gathered}
x \leq -1 - \sqrt{5} \\
\text{oppure} \ x \geq -1 + \sqrt{5}
\end{gathered}
$$

$$
\begin{gathered}
S = \left]-\infty, -1 - \sqrt{5}\right] \\
\cup \left[-1 + \sqrt{5}, +\infty\right[
\end{gathered}
$$
```

```ad-tip
L'ordine delle soluzioni irrazionali
Con $a > 0$ la soluzione con il segno meno davanti al radicale è la più piccola: $-1 - \sqrt{5} < -1 + \sqrt{5}$. Se hai dubbi, usa le approssimazioni, qui $-3{,}24$ e $1{,}24$, solo per metterle in ordine; nel risultato lascia i radicali.
```

## Il metodo della scomposizione

Le stesse disequazioni si possono risolvere con lo [studio del segno](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte). Se $\Delta > 0$, il trinomio si scompone come nella lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti):

$$
\begin{aligned}
&ax^2 + bx + c \\
&= a(x - x_1)(x - x_2)
\end{aligned}
$$

e il segno del prodotto si legge dalla tabella dei segni. Nell'esempio 1, $x^2 - x - 6 = (x + 2)(x - 3)$, e la disequazione diventa $(x + 2)(x - 3) \leq 0$:

```tikz
% nome: disequazione-secondo-grado-tabella-segni
% alt: Tabella dei segni di x più 2 per x meno 3 e, sotto, le soluzioni della disequazione minore o uguale a zero: il segmento da meno 2 a 3 con i pallini pieni
% svg: disequazione-secondo-grado-tabella-segni-0bd83ff0.svg 262x115
\begin{tikzpicture}
\node at (1.60,0) {$-2$};
\node at (3.20,0) {$3$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$x+2$};
\draw[thick, dashed] (0.00,-0.62) -- (1.43,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick] (1.77,-0.62) -- (3.20,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick] (3.20,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (1.60,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-3$};
\draw[thick, dashed] (0.00,-1.24) -- (1.60,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick, dashed] (1.60,-1.24) -- (3.03,-1.24);
\node[above] at (2.40,-1.29) {\small $-$};
\draw[thick] (3.37,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (3.20,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\node at (1.60,-1.86) {\small $0$};
\node at (3.20,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.60,-2.48) -- (3.20,-2.48);
\fill (1.60,-2.48) circle (2.5pt);
\fill (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è negativo tra $-2$ e $3$ e vale zero nei due estremi: $S = [-2, 3]$, lo stesso risultato della parabola. Con $a > 0$ la tabella dà sempre la regola dei valori esterni e interni: prima di $x_1$ i due fattori sono negativi, tra $x_1$ e $x_2$ uno solo, dopo $x_2$ nessuno.

```ad-tip
Quale metodo scegliere
La scomposizione conviene quando il trinomio si scompone a vista, con un raccoglimento, una differenza di quadrati o la regola di somma e prodotto. La parabola funziona sempre, anche con $\Delta = 0$ e con $\Delta < 0$, quando il trinomio ha un fattore ripetuto o non si scompone affatto.
```

```ad-warning
Dimenticare il coefficiente a
Nella scomposizione $a(x - x_1)(x - x_2)$ il coefficiente $a$ conta. Da $-x^2 + 4x - 3 > 0$ si ottiene $-(x - 1)(x - 3) > 0$: se perdi il segno meno studi $(x - 1)(x - 3) > 0$ e trovi le soluzioni sbagliate, cioè i valori esterni al posto di quelli interni. Il modo più sicuro è rendere $a$ positivo prima di scomporre.
```

## Discriminante nullo

Con $\Delta = 0$ il trinomio è $a$ per un quadrato, e con $a > 0$ non è mai negativo. Il verso decide tutto, e i quattro casi sono diversi tra loro.

```ad-example
Esempio 5: i quattro versi con lo stesso trinomio
$$x^2 - 6x + 9$$

$\Delta = 36 - 36 = 0$, e il trinomio è il quadrato di un binomio: $x^2 - 6x + 9 = (x - 3)^2$. La parabola tocca l'asse $x$ solo in $3$ e per il resto sta sopra.

```tikz
% nome: disequazione-secondo-grado-delta-nullo
% alt: Parabola y uguale a x al quadrato meno 6x più 9, che tocca l'asse x solo in 3, e sotto le soluzioni dei quattro versi: maggiore di zero tutta la retta tranne 3, maggiore o uguale tutta la retta, minore nessun numero, minore o uguale solo 3
% svg: disequazione-secondo-grado-delta-nullo-f7ae9fbc.svg 210x211
\begin{tikzpicture}
\draw[black!70, ->] (-0.37,0) -- (3.91,0) node[right] {$x$};
\draw[black!70, ->] (0,-0.11) -- (0,2.12) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(0.45,1.87) (0.52,1.69) (0.59,1.51) (0.66,1.35) (0.73,1.20) (0.80,1.05) (0.87,0.92) (0.94,0.79) (1.01,0.67) (1.08,0.57) (1.15,0.47) (1.22,0.38) (1.29,0.30) (1.37,0.23) (1.44,0.17) (1.51,0.12) (1.58,0.07) (1.65,0.04) (1.72,0.02) (1.79,0.00) (1.86,0.00) (1.93,0.00) (2.00,0.02) (2.07,0.04) (2.14,0.07) (2.21,0.12) (2.28,0.17) (2.35,0.23) (2.43,0.30) (2.50,0.38) (2.57,0.47) (2.64,0.57) (2.71,0.67) (2.78,0.79) (2.85,0.92) (2.92,1.05) (2.99,1.20) (3.06,1.35) (3.13,1.51) (3.20,1.69) (3.27,1.87)};
\fill (1.86,0) circle (1.6pt);
\node[below] at (1.86,-0.05) {\small $3$};
\node[left] at (-0.37,-0.86) {\small $>0$};
\draw[blue!45, line width=2pt] (-0.37,-0.86) -- (1.76,-0.86);
\draw[thick] (1.86,-0.86) circle (2.5pt);
\draw[blue!45, line width=2pt] (1.96,-0.86) -- (3.72,-0.86);
\draw[thick] (1.86,-0.86) circle (2.5pt);
\node[left] at (-0.37,-1.46) {\small $\geq 0$};
\draw[blue!45, line width=2pt] (-0.37,-1.46) -- (3.72,-1.46);
\node[left] at (-0.37,-2.06) {\small $<0$};
\node[left] at (-0.37,-2.66) {\small $\leq 0$};
\fill (1.86,-2.66) circle (2.5pt);
\draw[gray!60, densely dotted] (1.86,-0.21) -- (1.86,-2.46);
\end{tikzpicture}
```

- $x^2 - 6x + 9 > 0$: vera per ogni $x$ tranne $3$, dove il trinomio vale zero. $S = \mathbb{R} \setminus \{3\}$, cioè $x \neq 3$.
- $x^2 - 6x + 9 \geq 0$: vera per ogni $x$, $S = \mathbb{R}$.
- $x^2 - 6x + 9 < 0$: un quadrato non è mai negativo, $S = \emptyset$.
- $x^2 - 6x + 9 \leq 0$: vera solo dove il trinomio vale zero, $S = \{3\}$.
```

```ad-warning
Dimenticare il punto di contatto
Con $\Delta = 0$ i versi $\leq$ e $>$ sono quelli in cui si sbaglia di più. $(x - 3)^2 \leq 0$ non è impossibile: per $x = 3$ vale $0 \leq 0$, e $S = \{3\}$. E $(x - 3)^2 > 0$ non è vera per ogni $x$: per $x = 3$ vale $0 > 0$, falso.
```

Lo stesso ragionamento vale con $a$ negativo, dopo aver cambiato il verso: $-x^2 + 6x - 9 \geq 0$ diventa $x^2 - 6x + 9 \leq 0$, e quindi $S = \{3\}$.

## Discriminante negativo

Con $\Delta < 0$ e $a > 0$ la parabola sta tutta sopra l'asse $x$: il trinomio è positivo per ogni $x$. Le disequazioni con il verso $>$ o $\geq$ sono sempre verificate, $S = \mathbb{R}$; quelle con il verso $<$ o $\leq$ sono impossibili, $S = \emptyset$.

```ad-example
Esempio 6: una disequazione impossibile
$$-2x^2 + x - 1 \geq 0$$

Il coefficiente di $x^2$ è negativo: moltiplica per $-1$ e cambia il verso.

$$
\begin{gathered}
2x^2 - x + 1 \leq 0 \\
\Delta = 1 - 8 = -7
\end{gathered}
$$

La parabola $y = 2x^2 - x + 1$ non incontra l'asse $x$ e sta tutta sopra:

```tikz
% nome: disequazione-secondo-grado-delta-negativo
% alt: Parabola y uguale a 2x al quadrato meno x più 1, rivolta verso l'alto e tutta sopra l'asse x: il trinomio non è mai negativo né nullo
% svg: disequazione-secondo-grado-delta-negativo-03a653c7.svg 178x118
\begin{tikzpicture}
\draw[black!70, ->] (-1.71,0) -- (2.47,0) node[right] {$x$};
\draw[black!70, ->] (0,-0.24) -- (0,2.33) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-1.16,2.08) (-1.09,1.91) (-1.02,1.75) (-0.95,1.60) (-0.88,1.46) (-0.81,1.32) (-0.74,1.20) (-0.67,1.08) (-0.60,0.97) (-0.53,0.87) (-0.46,0.78) (-0.39,0.70) (-0.32,0.63) (-0.25,0.56) (-0.18,0.51) (-0.11,0.46) (-0.04,0.42) (0.03,0.39) (0.10,0.37) (0.17,0.35) (0.24,0.35) (0.31,0.35) (0.38,0.37) (0.45,0.39) (0.52,0.42) (0.59,0.46) (0.66,0.51) (0.73,0.56) (0.80,0.63) (0.87,0.70) (0.94,0.78) (1.01,0.87) (1.08,0.97) (1.15,1.08) (1.22,1.20) (1.28,1.32) (1.35,1.46) (1.42,1.60) (1.49,1.75) (1.56,1.91) (1.63,2.08)};
\end{tikzpicture}
```

Il trinomio non è mai negativo né nullo, quindi la disequazione è impossibile: $S = \emptyset$. Con il verso opposto, $-2x^2 + x - 1 < 0$, ogni $x$ è soluzione: $S = \mathbb{R}$.
```

```ad-warning
Delta negativo non vuol dire impossibile
Per l'equazione, $\Delta < 0$ vuol dire nessuna soluzione. Per la disequazione no: $x^2 - 2x + 3 > 0$ ha $\Delta < 0$ ed è vera per ogni $x$. Con $\Delta < 0$ la disequazione è sempre verificata o impossibile, e lo decidono il verso e il segno di $a$.
```

## Disequazioni incomplete

Le disequazioni con $b = 0$ o con $c = 0$ si risolvono con lo stesso metodo: la parabola si disegna a partire dalle soluzioni dell'equazione associata, che per le [equazioni pure e spurie](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) si trovano senza la formula.

```ad-example
Esempio 7: una pura
$$x^2 < 9$$

Porta tutto a primo membro: $x^2 - 9 < 0$. L'equazione associata $x^2 = 9$ ha le soluzioni $-3$ e $3$. Il verso è $<$: valori interni.

```tikz
% nome: disequazione-pura-x-quadro-minore-9
% alt: Parabola y uguale a x al quadrato meno 9 con evidenziato l'arco sotto l'asse x tra meno 3 e 3, e sotto le soluzioni della disequazione x al quadrato minore di 9: il segmento tra meno 3 e 3 con i pallini vuoti
% svg: disequazione-pura-x-quadro-minore-9-03d44562.svg 225x174
\begin{tikzpicture}
\fill[blue!15] (-1.65,0) -- plot[smooth] coordinates {(-1.65,0.00) (-1.54,-0.22) (-1.43,-0.43) (-1.32,-0.62) (-1.21,-0.79) (-1.10,-0.95) (-0.99,-1.09) (-0.88,-1.22) (-0.77,-1.34) (-0.66,-1.44) (-0.55,-1.52) (-0.44,-1.59) (-0.33,-1.64) (-0.22,-1.68) (-0.11,-1.70) (0.00,-1.71) (0.11,-1.70) (0.22,-1.68) (0.33,-1.64) (0.44,-1.59) (0.55,-1.52) (0.66,-1.44) (0.77,-1.34) (0.88,-1.22) (0.99,-1.09) (1.10,-0.95) (1.21,-0.79) (1.32,-0.62) (1.43,-0.43) (1.54,-0.22) (1.65,0.00)} -- (1.65,0) -- cycle;
\draw[black!70, ->] (-2.42,0) -- (2.53,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.79) -- (0,1.29) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-2.09,1.04) (-1.99,0.77) (-1.88,0.52) (-1.78,0.28) (-1.67,0.05) (-1.57,-0.16) (-1.47,-0.36) (-1.36,-0.55) (-1.26,-0.72) (-1.15,-0.88) (-1.05,-1.02) (-0.94,-1.15) (-0.84,-1.27) (-0.73,-1.37) (-0.63,-1.46) (-0.52,-1.54) (-0.42,-1.60) (-0.31,-1.65) (-0.21,-1.68) (-0.10,-1.70) (0.00,-1.71) (0.10,-1.70) (0.21,-1.68) (0.31,-1.65) (0.42,-1.60) (0.52,-1.54) (0.63,-1.46) (0.73,-1.37) (0.84,-1.27) (0.94,-1.15) (1.05,-1.02) (1.15,-0.88) (1.26,-0.72) (1.36,-0.55) (1.47,-0.36) (1.57,-0.16) (1.67,0.05) (1.78,0.28) (1.88,0.52) (1.99,0.77) (2.09,1.04)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-1.65,0.00) (-1.54,-0.22) (-1.43,-0.43) (-1.32,-0.62) (-1.21,-0.79) (-1.10,-0.95) (-0.99,-1.09) (-0.88,-1.22) (-0.77,-1.34) (-0.66,-1.44) (-0.55,-1.52) (-0.44,-1.59) (-0.33,-1.64) (-0.22,-1.68) (-0.11,-1.70) (0.00,-1.71) (0.11,-1.70) (0.22,-1.68) (0.33,-1.64) (0.44,-1.59) (0.55,-1.52) (0.66,-1.44) (0.77,-1.34) (0.88,-1.22) (0.99,-1.09) (1.10,-0.95) (1.21,-0.79) (1.32,-0.62) (1.43,-0.43) (1.54,-0.22) (1.65,0.00)};
\fill (-1.65,0) circle (1.6pt);
\node[below left] at (-1.65,-0.05) {\small $-3$};
\fill (1.65,0) circle (1.6pt);
\node[below right] at (1.65,-0.05) {\small $3$};
\node[left] at (-2.42,-2.54) {\small $S$};
\draw[blue!45, line width=2pt] (-1.55,-2.54) -- (1.55,-2.54);
\draw[thick] (-1.65,-2.54) circle (2.5pt);
\draw[thick] (1.65,-2.54) circle (2.5pt);
\draw[gray!60, densely dotted] (-1.65,-1.89) -- (-1.65,-2.34);
\draw[gray!60, densely dotted] (1.65,-1.89) -- (1.65,-2.34);
\end{tikzpicture}
```

$-3 < x < 3$, cioè $S = \,\mathopen{]}-3, 3\mathclose{[}$. Con il verso opposto, $x^2 > 9$, le soluzioni sono i valori esterni: $x < -3$ oppure $x > 3$.
```

```ad-warning
Scrivere x minore di più o meno 3
Da $x^2 < 9$ viene da scrivere $x < \pm 3$, oppure $x < 3$. La prima scrittura non vuol dire niente, la seconda comprende anche $x = -5$, e $(-5)^2 = 25$ non è minore di $9$. Le soluzioni sono i numeri tra $-3$ e $3$.
```

Se nella pura il termine noto ha lo stesso segno di $a$, l'equazione associata non ha soluzioni: $x^2 + 4$ è sempre positivo, perché $x^2 \geq 0$. Quindi $x^2 + 4 > 0$ ha $S = \mathbb{R}$ e $x^2 + 4 < 0$ ha $S = \emptyset$.

```ad-example
Esempio 8: una spuria
$$x^2 > 3x$$

Porta tutto a primo membro: $x^2 - 3x > 0$. L'equazione associata si risolve raccogliendo $x$: $x(x - 3) = 0$ dà $x_1 = 0$ e $x_2 = 3$. Il verso è $>$: valori esterni, estremi esclusi.

```tikz
% nome: disequazione-spuria-x-quadro-maggiore-3x
% alt: Parabola y uguale a x al quadrato meno 3x con evidenziati i due rami sopra l'asse x, prima di 0 e dopo 3, e sotto le soluzioni della disequazione x al quadrato maggiore di 3x con i pallini vuoti
% svg: disequazione-spuria-x-quadro-maggiore-3x-778bfce0.svg 219x181
\begin{tikzpicture}
\fill[blue!15] (-0.78,0) -- plot[smooth] coordinates {(-0.78,1.89) (-0.75,1.81) (-0.73,1.73) (-0.70,1.65) (-0.67,1.58) (-0.65,1.51) (-0.62,1.43) (-0.60,1.36) (-0.57,1.29) (-0.55,1.22) (-0.52,1.15) (-0.49,1.08) (-0.47,1.02) (-0.44,0.95) (-0.42,0.89) (-0.39,0.82) (-0.36,0.76) (-0.34,0.70) (-0.31,0.64) (-0.29,0.58) (-0.26,0.52) (-0.23,0.46) (-0.21,0.41) (-0.18,0.35) (-0.16,0.30) (-0.13,0.25) (-0.10,0.20) (-0.08,0.15) (-0.05,0.10) (-0.03,0.05) (0.00,0.00)} -- (0.00,0) -- cycle;
\fill[blue!15] (2.25,0) -- plot[smooth] coordinates {(2.25,0.00) (2.28,0.05) (2.30,0.10) (2.33,0.15) (2.35,0.20) (2.38,0.25) (2.41,0.30) (2.43,0.35) (2.46,0.41) (2.48,0.46) (2.51,0.52) (2.54,0.58) (2.56,0.64) (2.59,0.70) (2.61,0.76) (2.64,0.82) (2.67,0.89) (2.69,0.95) (2.72,1.02) (2.74,1.08) (2.77,1.15) (2.80,1.22) (2.82,1.29) (2.85,1.36) (2.87,1.43) (2.90,1.51) (2.92,1.58) (2.95,1.65) (2.98,1.73) (3.00,1.81) (3.03,1.89)} -- (3.03,0) -- cycle;
\draw[black!70, ->] (-1.20,0) -- (3.60,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.12) -- (0,2.14) node[above] {$y$};
\draw[thick] plot[smooth] coordinates {(-0.78,1.89) (-0.68,1.60) (-0.59,1.34) (-0.49,1.08) (-0.40,0.84) (-0.30,0.62) (-0.21,0.41) (-0.11,0.21) (-0.02,0.03) (0.08,-0.14) (0.17,-0.29) (0.27,-0.43) (0.36,-0.55) (0.46,-0.66) (0.55,-0.75) (0.65,-0.83) (0.74,-0.90) (0.84,-0.95) (0.93,-0.98) (1.03,-1.01) (1.13,-1.01) (1.22,-1.01) (1.32,-0.98) (1.41,-0.95) (1.51,-0.90) (1.60,-0.83) (1.70,-0.75) (1.79,-0.66) (1.89,-0.55) (1.98,-0.43) (2.08,-0.29) (2.17,-0.14) (2.27,0.03) (2.36,0.21) (2.46,0.41) (2.55,0.62) (2.65,0.84) (2.74,1.08) (2.84,1.34) (2.93,1.60) (3.03,1.89)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-0.78,1.89) (-0.75,1.81) (-0.73,1.73) (-0.70,1.65) (-0.67,1.58) (-0.65,1.51) (-0.62,1.43) (-0.60,1.36) (-0.57,1.29) (-0.55,1.22) (-0.52,1.15) (-0.49,1.08) (-0.47,1.02) (-0.44,0.95) (-0.42,0.89) (-0.39,0.82) (-0.36,0.76) (-0.34,0.70) (-0.31,0.64) (-0.29,0.58) (-0.26,0.52) (-0.23,0.46) (-0.21,0.41) (-0.18,0.35) (-0.16,0.30) (-0.13,0.25) (-0.10,0.20) (-0.08,0.15) (-0.05,0.10) (-0.03,0.05) (0.00,0.00)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(2.25,0.00) (2.28,0.05) (2.30,0.10) (2.33,0.15) (2.35,0.20) (2.38,0.25) (2.41,0.30) (2.43,0.35) (2.46,0.41) (2.48,0.46) (2.51,0.52) (2.54,0.58) (2.56,0.64) (2.59,0.70) (2.61,0.76) (2.64,0.82) (2.67,0.89) (2.69,0.95) (2.72,1.02) (2.74,1.08) (2.77,1.15) (2.80,1.22) (2.82,1.29) (2.85,1.36) (2.87,1.43) (2.90,1.51) (2.92,1.58) (2.95,1.65) (2.98,1.73) (3.00,1.81) (3.03,1.89)};
\fill (0.00,0) circle (1.6pt);
\node[below left] at (0.00,-0.05) {\small $0$};
\fill (2.25,0) circle (1.6pt);
\node[below right] at (2.25,-0.05) {\small $3$};
\node[left] at (-1.20,-1.88) {\small $S$};
\draw[blue!45, line width=2pt] (-1.20,-1.88) -- (-0.10,-1.88);
\draw[thick] (0.00,-1.88) circle (2.5pt);
\draw[blue!45, line width=2pt] (2.35,-1.88) -- (3.38,-1.88);
\draw[thick] (2.25,-1.88) circle (2.5pt);
\draw[gray!60, densely dotted] (0.00,-1.23) -- (0.00,-1.68);
\draw[gray!60, densely dotted] (2.25,-1.23) -- (2.25,-1.68);
\end{tikzpicture}
```

$$x < 0 \ \text{ oppure } \ x > 3$$

$$S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}3, +\infty\mathclose{[}$$
```

```ad-warning
Dividere per x
Da $x^2 > 3x$ viene da dividere per $x$ e scrivere $x > 3$. Ma $x$ può essere negativo, e allora il verso andrebbe cambiato, o zero. Così si perdono tutte le soluzioni negative: per $x = -1$ si ha $1 > -3$, vero. Porta tutto a primo membro e non dividere per l'incognita.
```

La monomia $ax^2$ confrontata con $0$ è un caso di $\Delta = 0$ con il vertice nell'origine: $x^2 > 0$ per ogni $x \neq 0$, $x^2 \geq 0$ per ogni $x$, $x^2 < 0$ mai, $x^2 \leq 0$ solo per $x = 0$.

## Errori frequenti

```ad-warning
Leggere il verso senza guardare a
La regola "maggiore di zero, valori esterni" vale solo con $a > 0$. Per $-x^2 + x + 6 > 0$ i valori esterni a $-2$ e $3$ sono sbagliati: moltiplicando per $-1$ si ha $x^2 - x - 6 < 0$, con le soluzioni interne, $-2 < x < 3$.
```

```ad-warning
Risolvere senza zero a secondo membro
Il segno del trinomio si confronta con zero. In $x^2 - 4 > 2x - 1$ non si risolve $x^2 - 4 = 0$: prima si porta tutto a primo membro, $x^2 - 2x - 3 > 0$, e poi si trovano le soluzioni dell'equazione associata, $-1$ e $3$.
```
