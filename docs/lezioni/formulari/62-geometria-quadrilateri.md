# Formulario: Parallelogrammi e trapezi

## Quadrilatero

- Lati opposti: senza vertici in comune ($AB$ e $CD$). Diagonali: uniscono vertici opposti ($AC$ e $BD$).
- Somma degli angoli interni:

$$\hat{A} + \hat{B} + \hat{C} + \hat{D} = 360^\circ$$

## Parallelogramma

Quadrilatero con i lati opposti paralleli: $AB \parallel DC$, $AD \parallel BC$.

1. Ogni diagonale lo divide in due triangoli congruenti.
2. Lati opposti congruenti: $AB \cong DC$, $AD \cong BC$.
3. Angoli opposti congruenti: $\hat{A} \cong \hat{C}$, $\hat{B} \cong \hat{D}$.
4. Angoli consecutivi supplementari: $\hat{A} + \hat{B} = 180^\circ$.
5. Le diagonali si tagliano a metà: $AM \cong MC$, $BM \cong MD$.

Esempio: $\hat{A} = 70^\circ \Rightarrow \hat{C} = 70^\circ$, $\hat{B} = \hat{D} = 110^\circ$.

## Condizioni per essere un parallelogramma

Basta una delle quattro:

1. lati opposti congruenti a due a due;
2. angoli opposti congruenti a due a due;
3. diagonali che si tagliano a metà;
4. due lati opposti paralleli e congruenti.

## Rettangolo, rombo, quadrato

- Rettangolo: quattro angoli retti. Rombo: quattro lati congruenti. Quadrato: quattro lati congruenti e quattro angoli retti. Sono tutti parallelogrammi.

| Figura | Diagonali |
|---|---|
| parallelogramma | si tagliano a metà |
| rettangolo | si tagliano a metà, congruenti |
| rombo | si tagliano a metà, perpendicolari, bisettrici degli angoli |
| quadrato | si tagliano a metà, congruenti, perpendicolari, bisettrici degli angoli |

- Un parallelogramma con le diagonali congruenti è un rettangolo; con le diagonali perpendicolari è un rombo.
- Nel rettangolo $AM \cong BM \cong CM \cong DM$. Nel quadrato ogni diagonale forma angoli di $45^\circ$ con i lati.

## Trapezio

Quadrilatero con due soli lati opposti paralleli: le basi (maggiore e minore). Gli altri due sono i lati obliqui; l'altezza è la distanza tra le basi.

- Angoli adiacenti a un lato obliquo supplementari: $\hat{A} + \hat{D} = 180^\circ$, $\hat{B} + \hat{C} = 180^\circ$.
- Isoscele: lati obliqui congruenti. Rettangolo: un lato obliquo perpendicolare alle basi (due angoli retti). Scaleno: lati obliqui non congruenti.

Nel trapezio isoscele:

1. angoli adiacenti a ciascuna base congruenti: $\hat{A} \cong \hat{B}$, $\hat{C} \cong \hat{D}$;
2. angoli opposti supplementari: $\hat{A} + \hat{C} = 180^\circ$;
3. diagonali congruenti: $AC \cong BD$.

## Le famiglie di quadrilateri

```tikz
% nome: quadrilateri-schema-inclusioni
% alt: Schema a insiemi dei quadrilateri: dentro i quadrilateri ci sono i trapezi, con isosceli e rettangoli, e i parallelogrammi; dentro i parallelogrammi i rettangoli e i rombi, che si sovrappongono nei quadrati
% svg: quadrilateri-schema-inclusioni-df07d61a.svg 270x186
\begin{tikzpicture}[scale=0.96]
\draw[thick, rounded corners=6pt] (0,0) rectangle (7.3,5);
\node[below right] at (0,5) {\small Quadrilateri};
\fill[orange!15] (1.3,2.2) ellipse (1.1 and 1.75);
\draw (1.3,2.2) ellipse (1.1 and 1.75);
\node at (1.3,3.55) {\small Trapezi};
\draw (1.3,2.65) ellipse (0.85 and 0.42);
\node at (1.3,2.65) {\scriptsize isosceli};
\draw (1.3,1.45) ellipse (0.85 and 0.42);
\node at (1.3,1.45) {\scriptsize rettangoli};
\fill[blue!10, rounded corners=10pt] (2.55,0.3) rectangle (7.1,4.3);
\draw[rounded corners=10pt] (2.55,0.3) rectangle (7.1,4.3);
\node at (4.83,3.75) {\small Parallelogrammi};
\draw (4.15,1.95) ellipse (1.4 and 1.0);
\draw (5.51,1.95) ellipse (1.4 and 1.0);
\node at (3.5,1.95) {\scriptsize Rettangoli};
\node at (6.25,1.95) {\scriptsize Rombi};
\node at (4.83,1.95) {\scriptsize Quadrati};
\end{tikzpicture}
```

```ad-warning
Diagonali perpendicolari
Un quadrilatero con le diagonali perpendicolari è un rombo solo se è già un parallelogramma: l'aquilone non lo è.
```

```ad-warning
Il quadrato è un rettangolo
Ha i quattro angoli retti: è un rettangolo, e anche un rombo.
```

```ad-warning
Diagonali del trapezio isoscele
Sono congruenti ma non si tagliano a metà: il trapezio non è un parallelogramma.
```
