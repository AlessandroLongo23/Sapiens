# Insiemi e Logica di base

## Definizione di insieme

Un insieme è una collezione ben definita di oggetti, detti elementi. Scriviamo $a \in A$ se l'elemento $a$ appartiene all'insieme $A$, e $a \notin A$ se non appartiene. Gli insiemi si indicano con lettere maiuscole ($A, B, C$), gli elementi con minuscole ($a, b, c$).

Esempi:

- $A = \{1,2,3\}$
- $B = \{\text{"rosso"}, \text{"verde"}, \text{"blu"}\}$
- $\mathbb{N} = \{0,1,2,3,\dots\}$ insieme dei numeri naturali

## Modi di rappresentare un insieme

### 1) Rappresentazione estensiva (per elencazione)

Si elencano tutti gli elementi tra parentesi graffe, separati da virgole.

$$ A = \{2, 4, 6, 8\} $$

### 2) Rappresentazione intensiva (per proprietà caratteristica)

Si specifica una proprietà che caratterizza gli elementi dell’insieme.

$$ A = \{ x \in \mathbb{N} \mid x \text{ è pari e } 2 \le x \le 8 \} $$

### 3) Rappresentazione grafica (diagrammi di Eulero-Venn)

Gli insiemi sono rappresentati come regioni del piano. L’appartenenza corrisponde a punti interni alla regione.

Esempio: $A \subseteq U$ e $B \subseteq U$ ($U$ è l’insieme universo).

```tikz
\begin{tikzpicture}
  \begin{scope}[shift={(0,0)}]
    % Universo
    \draw (-3,-2) rectangle (3,2) node[anchor=north east] {$U$};
    % Insiemi A e B
    \begin{scope}
      \clip (-3,-2) rectangle (3,2);
      \draw ( -1,0) circle (1.4) node[left] {$A$};
      \draw (  1,0) circle (1.4) node[right] {$B$};
    \end{scope}
  \end{scope}
\end{tikzpicture}
```

## Sottoinsiemi e uguaglianza

- $A = B$ se hanno esattamente gli stessi elementi.
- $A \subseteq B$ se ogni elemento di $A$ è anche elemento di $B$.

Esempio: $\{1,2\} \subseteq \{1,2,3\}$.
