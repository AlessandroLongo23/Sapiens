# Formulario: Sistemi di disequazioni

## Sistema e soluzioni

- Sistema di disequazioni: due o più disequazioni nella stessa incognita, vere contemporaneamente.
- Soluzione del sistema: un numero che rende vere tutte le disequazioni.
- L'insieme delle soluzioni è l'intersezione delle soluzioni delle singole disequazioni:

$$S = S_1 \cap S_2$$

- Intervalli: $\mathopen{]}2, 5\mathclose{[}$ estremi esclusi, $[2, 5]$ estremi compresi.

## Come si risolve

1. Risolvi ogni disequazione per conto suo, fino a $x > 2$, $x \le 5$ e simili.
2. Segna gli estremi sulla retta, in ordine crescente.
3. Una riga per disequazione: linea dove è vera, pallino pieno se l'estremo è compreso, vuoto se è escluso.
4. Soluzione: le strisce in cui ci sono le linee di tutte le righe.
5. Un estremo è compreso solo se è compreso in tutte le disequazioni in cui compare.

```tikz
% nome: sistema-disequazioni-intervallo-limitato
% alt: Grafico del sistema tra x maggiore di 2 e x minore di 5: due righe una sotto l'altra, la prima con la linea a destra di 2, la seconda a sinistra di 5, pallini vuoti, e colorata la striscia tra 2 e 5 dove ci sono tutte e due le linee
% svg: sistema-disequazioni-intervallo-limitato-757161fc.svg 252x76
\begin{tikzpicture}
\fill[orange!20] (1.6,-0.1) rectangle (3.2,1.35);
\draw[gray!70, dashed] (1.6,-0.1) -- (1.6,1.35);
\draw[gray!70, dashed] (3.2,-0.1) -- (3.2,1.35);
\draw[->] (0,0) -- (5.1,0) node[right] {$x$};
\draw (1.6,-0.08) -- (1.6,0.08);
\node[below] at (1.6,-0.1) {$2$};
\draw (3.2,-0.08) -- (3.2,0.08);
\node[below] at (3.2,-0.1) {$5$};
\node[left] at (0,1.10) {\small $x > 2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (1.6,1.10) -- (4.8,1.10);
\draw[thick] (1.6,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x < 5$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0,0.55) -- (3.2,0.55);
\draw[thick] (3.2,0.55) circle (2.2pt);
\end{tikzpicture}
```

$$
\begin{gathered}
\begin{cases}
2x - 1 > 3 \\
x + 2 < 7
\end{cases} \\
x > 2 \text{ e } x < 5 \\
S = \, \mathopen{]}2, 5\mathclose{[}
\end{gathered}
$$

## Casi particolari

| Grafico | Soluzione |
|---|---|
| nessuna striscia con tutte le linee | impossibile, $S = \emptyset$ |
| le linee si toccano in un punto, pallino pieno in tutte le righe | un solo numero, come $S = \{2\}$ |
| una disequazione sempre vera ($0x > -2$) | la soluzione è quella delle altre |
| una disequazione mai vera ($0x > 2$) | impossibile, $S = \emptyset$ |

## Doppie disequazioni

- $-1 < 2x + 3 \le 7$ vuol dire $2x + 3 > -1$ e $2x + 3 \le 7$: è un sistema, con $S = \, \mathopen{]}-2, 2]$.
- Con la $x$ solo al centro puoi lavorare sui tre membri insieme; dividendo per un numero negativo cambiano tutti e due i versi.

$$
\begin{gathered}
1 \le 3 - 2x < 7 \\
\Rightarrow -2 \le -2x < 4 \\
\Rightarrow 1 \ge x > -2 \\
S = \, \mathopen{]}-2, 1]
\end{gathered}
$$

- Con la $x$ in più di un membro si risolve come sistema: $x - 1 < 2x + 3 < 5$ dà $S = \, \mathopen{]}-4, 1\mathclose{[}$.

```ad-warning
L'estremo compreso in una sola disequazione
Da $x \ge 2$ e $x > 2$ viene $S = \, \mathopen{]}2, +\infty\mathclose{[}$: il $2$ è escluso, perché non risolve la seconda.
```

```ad-warning
Cambiare il verso di un solo segno
Da $-2 \le -2x < 4$, dividendo per $-2$, si ottiene $1 \ge x > -2$: cambiano tutti e due i versi.
```

```ad-warning
Intersezione, non unione
Un sistema vuol dire "e": i numeri minori di $-1$ o maggiori di $3$ sono un'unione di intervalli, non un sistema.
```
