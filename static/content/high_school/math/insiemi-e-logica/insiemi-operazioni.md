
# Operazioni

## Operazioni fra insiemi

Sia fissato un universo $U$. Per due insiemi $A, B \subseteq U$:

### Unione

Contiene gli elementi che appartengono ad almeno uno dei due insiemi.

$$ A \cup B = \{ x \in U \mid x \in A \text{ oppure } x \in B \} $$

Esempio: se $A=\{1,2,3\}$, $B=\{3,4\}$, allora $A\cup B=\{1,2,3,4\}$.

Rappresentazione grafica (area evidenziata = unione):

```tikz
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \fill[blue!20] ( -1,0) circle (1.4);
      \fill[blue!20] (  1,0) circle (1.4);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
      \draw (  1,0) circle (1.4) node[right] {$B$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

### Intersezione

Contiene gli elementi comuni ai due insiemi.

$$ A \cap B = \{ x \in U \mid x \in A \text{ e } x \in B \} $$

Esempio: con $A=\{1,2,3\}$, $B=\{3,4\}$, si ha $A\cap B=\{3\}$.

Rappresentazione grafica (solo la zona centrale):

```tikz
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \fill[blue!20] ( -1,0) circle (1.4);
      \fill[blue!20] (  1,0) circle (1.4);
      \fill[blue!50] ( -1,0) circle (1.4);
      \fill[white]   ( -1.7,0) circle (0.9);
      \fill[white]   (  1.7,0) circle (0.9);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
      \draw (  1,0) circle (1.4) node[right] {$B$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

### Differenza (sottrazione di insiemi)

Contiene gli elementi che sono in $A$ ma non in $B$.

$$ A \smallsetminus B = \{ x \in U \mid x \in A \text{ e } x \notin B \} $$

Esempio: con $A=\{1,2,3\}$, $B=\{3,4\}$, si ha $A\smallsetminus B=\{1,2\}$.

Rappresentazione grafica (solo la parte di $A$ esclusa l’intersezione):

```tikz
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \fill[blue!20] ( -1,0) circle (1.4);
      % “cancello” la zona di intersezione
      \fill[white] (  1,0) circle (1.4);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
      \draw (  1,0) circle (1.4) node[right] {$B$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

### Complementare

Contiene gli elementi dell’universo che non appartengono ad $A$.

$$ A^c = U \smallsetminus A = \{ x \in U \mid x \notin A \} $$

Esempio: se $U=\{1,2,3,4\}$ e $A=\{2,3\}$, allora $A^c=\{1,4\}$.

Rappresentazione grafica (tutto tranne $A$):

```tikz
\begin{tikzpicture}
  \begin{scope}
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \fill[blue!20] (-3,-2) rectangle (3,2);
      \fill[white] ( -1,0) circle (1.4);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

## Proprietà fondamentali

Per tutti gli insiemi $A,B,C$ (sottoinsiemi di $U$) valgono:

- Commutatività: $A\cup B = B\cup A$, $A\cap B = B\cap A$
- Associatività: $(A\cup B)\cup C = A\cup (B\cup C)$, $(A\cap B)\cap C = A\cap (B\cap C)$
- Distributività: $A\cap (B\cup C) = (A\cap B)\cup (A\cap C)$, $A\cup (B\cap C) = (A\cup B)\cap (A\cup C)$
- De Morgan: $(A\cup B)^c = A^c \cap B^c$, $(A\cap B)^c = A^c \cup B^c$

## Esempi riassuntivi

Sia $U=\{1,2,3,4,5,6\}$, $A=\{1,2,3\}$, $B=\{3,4,5\}$:

- $A\cup B = \{1,2,3,4,5\}$
- $A\cap B = \{3\}$
- $A\smallsetminus B = \{1,2\}$, $B\smallsetminus A = \{4,5\}$
- $A^c = \{4,5,6\}$

Queste operazioni sono la base per la logica degli insiemi e per rappresentare situazioni reali (es. studenti che praticano sport diversi, preferenze, insiemi di soluzioni di equazioni, ecc.).