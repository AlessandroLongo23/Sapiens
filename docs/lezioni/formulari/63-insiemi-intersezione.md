# Formulario: Intersezione insiemistica

## Definizione

L'intersezione di $A$ e $B$ è l'insieme degli elementi che appartengono sia ad $A$ sia a $B$:

$$A \cap B = \{x \mid x \in A \ \text{ e } \ x \in B\}$$

"E" vuol dire che le due condizioni valgono insieme (in logica $\wedge$).

Per elencazione: scorri gli elementi del primo insieme e tieni quelli che compaiono anche nel secondo. Per esempio $\{1, 2, 3, 4, 5\} \cap \{2, 4, 6, 8\} = \{2, 4\}$.

## Diagramma di Eulero-Venn

L'intersezione è la zona in cui i due cerchi si sovrappongono.

```tikz
% nome: intersezione-insiemi-diagramma-venn
% alt: Intersezione di due insiemi: nel diagramma di Eulero-Venn è colorata solo la zona in cui i cerchi A e B si sovrappongono
% svg: intersezione-insiemi-diagramma-venn-38085112.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (0,-0.98) arc[start angle=-44.42, end angle=44.42, radius=1.4] arc[start angle=135.58, end angle=224.42, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

Insiemi disgiunti: $A \cap B = \emptyset$, nessun elemento in comune. Per esempio $\{1, 3, 5\} \cap \{2, 4\} = \emptyset$.

## Insiemi descritti da una proprietà

L'intersezione contiene gli elementi che hanno tutte e due le proprietà.

- Multipli comuni: i multipli del MCM. Multipli di $4$ e di $6$: i multipli di $12$, non di $24$.
- Divisori comuni: i divisori del MCD. Divisori di $12$ e di $18$: $\{1, 2, 3, 6\}$.
- Due condizioni: $\{x \in \mathbb{N} \mid x \le 9\} \cap \{x \in \mathbb{N} \mid x \ge 6\} = \{6, 7, 8, 9\}$.

## Proprietà

| Proprietà | Enunciato |
|---|---|
| Commutativa | $A \cap B = B \cap A$ |
| Associativa | $(A \cap B) \cap C = A \cap (B \cap C)$ |
| Idempotenza | $A \cap A = A$ |
| Intersezione con il vuoto | $A \cap \emptyset = \emptyset$ |
| Elemento neutro | $A \cap U = A$ |

Grazie all'associativa si scrive $A \cap B \cap C$ senza parentesi: sono gli elementi comuni a tutti e tre.

## Intersezione e inclusione

$$A \cap B \subseteq A \qquad A \cap B \subseteq B$$

$$A \subseteq B \quad \text{se e solo se} \quad A \cap B = A$$

## Numero di elementi dell'intersezione

$$|A \cap B| = |A| + |B| - |A \cup B|$$

$|A \cap B|$ non supera né $|A|$ né $|B|$.

Per esempio con $|M| = 18$, $|C| = 16$, $|M \cup C| = 26$: $|M \cap C| = 18 + 16 - 26 = 8$.

```ad-warning
Moltiplicare invece di cercare il MCM
I multipli comuni di $4$ e $6$ sono i multipli di $12$: il $12$ non è multiplo di $24$.
```

```ad-warning
Usare il totale al posto dell'unione
Nei problemi, prima di usare la formula togli dal totale chi non sta in nessuno dei due insiemi.
```

```ad-warning
Controllare solo le coppie
Con tre insiemi, $A \cap B$, $B \cap C$ e $A \cap C$ possono essere non vuoti anche se $A \cap B \cap C = \emptyset$.
```
