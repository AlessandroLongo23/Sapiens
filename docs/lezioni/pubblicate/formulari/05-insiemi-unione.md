# Formulario: Unione insiemistica

## Definizione

L'unione di $A$ e $B$ è l'insieme degli elementi che appartengono ad almeno uno dei due:

$$A \cup B = \{x \mid x \in A \ \text{ oppure } \ x \in B\}$$

"Oppure" è inclusivo (il vel latino, in logica $\vee$): gli elementi comuni fanno parte dell'unione e si scrivono una volta.

Per elencazione: scrivi gli elementi del primo insieme, poi aggiungi quelli del secondo che mancano. Per esempio $\{1, 2, 3\} \cup \{3, 4, 5\} = \{1, 2, 3, 4, 5\}$.

## Diagramma di Eulero-Venn

L'unione è tutta la zona coperta da almeno uno dei due insiemi, compresa la parte comune.

```tikz
% nome: unione-insiemi-diagramma-venn
% alt: Unione di due insiemi: nel diagramma di Eulero-Venn è colorata tutta la zona coperta dai cerchi A e B, compresa la parte comune
% svg: unione-insiemi-diagramma-venn-5d641e0c.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (-1,0) circle (1.4);
\fill[blue!20] (1,0) circle (1.4);
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

## Proprietà

| Proprietà | Enunciato |
|---|---|
| Commutativa | $A \cup B = B \cup A$ |
| Associativa | $(A \cup B) \cup C = A \cup (B \cup C)$ |
| Idempotenza | $A \cup A = A$ |
| Elemento neutro | $A \cup \emptyset = A$ |
| Unione con l'universo | $A \cup U = U$ |

Grazie all'associativa si scrive $A \cup B \cup C$ senza parentesi.

## Unione e inclusione

$$A \subseteq A \cup B \qquad B \subseteq A \cup B$$

$$A \subseteq B \quad \text{se e solo se} \quad A \cup B = B$$

## Numero di elementi dell'unione

$$|A \cup B| = |A| + |B| - |A \cap B|$$

Se $A$ e $B$ sono disgiunti: $|A \cup B| = |A| + |B|$.

Per esempio con $|C| = 15$, $|P| = 12$, $|C \cap P| = 5$: $|C \cup P| = 15 + 12 - 5 = 22$.

```ad-warning
Sommare senza togliere l'intersezione
$|A| + |B|$ conta due volte gli elementi comuni: vale solo se $A$ e $B$ sono disgiunti.
```

```ad-warning
Leggere "oppure" come esclusivo
Un elemento che sta in tutti e due gli insiemi appartiene all'unione.
```

```ad-warning
Confondere $\cup$ e $\cap$
Con $A = \{1, 2, 3\}$ e $B = \{3, 4, 5\}$: $A \cup B = \{1, 2, 3, 4, 5\}$, $A \cap B = \{3\}$.
```
