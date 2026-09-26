# Formulario: Differenza e complementare

## Differenza

La differenza tra $A$ e $B$ è l'insieme degli elementi di $A$ che non stanno in $B$ (si scrive anche $A - B$):

$$A \setminus B = \{x \mid x \in A \text{ e } x \notin B\}$$

Per elencazione: parti da $A$ e cancella gli elementi che stanno anche in $B$. Per esempio $\{1, 2, 3, 4, 5\} \setminus \{4, 5, 6, 7\} = \{1, 2, 3\}$.

Non è commutativa: $\{4, 5, 6, 7\} \setminus \{1, 2, 3, 4, 5\} = \{6, 7\}$.

```tikz
% nome: differenza-a-meno-b-venn
% alt: Differenza A meno B: nel diagramma di Eulero-Venn è colorata la parte del cerchio A che resta fuori dal cerchio B
% svg: differenza-a-meno-b-venn-8e2a76be.svg 231x155
\begin{tikzpicture}
\draw (-3,-2) rectangle (3,2);
\node[anchor=north east] at (3,2) {$U$};
\fill[blue!20] (0,0.98) arc[start angle=44.42, end angle=315.58, radius=1.4] arc[start angle=224.42, end angle=135.58, radius=1.4] -- cycle;
\draw (-1,0) circle (1.4);
\draw (1,0) circle (1.4);
\node at (-2.1,1.35) {$A$};
\node at (2.1,1.35) {$B$};
\end{tikzpicture}
```

## Casi particolari

| Caso | Differenza |
|---|---|
| Togliere il vuoto | $A \setminus \emptyset = A$ |
| Togliere sé stesso | $A \setminus A = \emptyset$ |
| Partire dal vuoto | $\emptyset \setminus A = \emptyset$ |
| $A$ e $B$ disgiunti | $A \setminus B = A$ |

$$A \setminus B = \emptyset \quad \text{se e solo se} \quad A \subseteq B$$

## Numero di elementi della differenza

$$|A \setminus B| = |A| - |A \cap B|$$

Solo se $B \subseteq A$: $|A \setminus B| = |A| - |B|$.

## Complementare

Complementare di $A$ rispetto all'universo $U$ (anche $A^c$ o $\complement_U A$):

$$
\begin{gathered}
\overline{A} = \{x \in U \mid x \notin A\} \\
\overline{A} = U \setminus A
\end{gathered}
$$

$$|\overline{A}| = |U| - |A|$$

Dipende dall'universo: il complementare di $\{2, 4\}$ è $\{1, 3\}$ in $U = \{1, 2, 3, 4\}$, ma $\{1, 3, 5, 6\}$ in $U = \{1, 2, 3, 4, 5, 6\}$.

Complementare di $B$ rispetto ad $A$, se $B \subseteq A$:

$$\complement_A B = A \setminus B$$

## Proprietà del complementare

$$
\begin{gathered}
A \cup \overline{A} = U \qquad A \cap \overline{A} = \emptyset \\
\overline{\overline{A}} = A \qquad \overline{U} = \emptyset \qquad \overline{\emptyset} = U
\end{gathered}
$$

## Differenza come intersezione

$$A \setminus B = A \cap \overline{B}$$

## Leggi di De Morgan

$$
\begin{gathered}
\overline{A \cup B} = \overline{A} \cap \overline{B} \\
\overline{A \cap B} = \overline{A} \cup \overline{B}
\end{gathered}
$$

Passando al complementare, $\cup$ diventa $\cap$ e $\cap$ diventa $\cup$.

## Problemi con il diagramma

1. Dai un nome agli insiemi e disegna il diagramma nell'universo.
2. Scrivi il numero della zona più interna (l'intersezione di tutti).
3. Riempi le altre zone verso l'esterno: il dato meno i numeri già scritti in quell'insieme.
4. La somma dei numeri nei cerchi è il numero di elementi dell'unione.
5. Nessun insieme: $|\overline{A \cup B}| = \text{totale} - |A \cup B|$.
6. Controlla che la somma di tutte le zone dia il totale.

```ad-warning
Sottrarre $|B|$ invece di $|A \cap B|$
$|A \setminus B| = |A| - |B|$ vale solo quando $B \subseteq A$.
```

```ad-warning
Sbarra su ogni insieme senza cambiare l'operazione
$\overline{A \cup B}$ è $\overline{A} \cap \overline{B}$, non $\overline{A} \cup \overline{B}$.
```

```ad-warning
Togliere le intersezioni senza partire dal centro
Con tre insiemi, chi sta in tutti e tre verrebbe tolto due volte: riempi prima il centro.
```
