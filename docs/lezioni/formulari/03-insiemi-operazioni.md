# Formulario: Proprietà delle operazioni tra insiemi

## Le operazioni

Negli esempi $U = \{1, 2, \dots, 8\}$, $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5, 6\}$.

| Operazione | Definizione | Esempio |
|---|---|---|
| Unione | $A \cup B = \{x \mid x \in A \text{ oppure } x \in B\}$ | $\{1, 2, 3, 4, 5, 6\}$ |
| Intersezione | $A \cap B = \{x \mid x \in A \text{ e } x \in B\}$ | $\{3, 4\}$ |
| Differenza | $A \setminus B = \{x \mid x \in A \text{ e } x \notin B\}$ | $\{1, 2\}$ |
| Complementare | $\overline{A} = \{x \in U \mid x \notin A\} = U \setminus A$ | $\{5, 6, 7, 8\}$ |

La differenza si scrive anche $A - B$; il complementare anche $\complement_U A$ o $A^c$. Nell'unione "oppure" comprende gli elementi comuni, scritti una volta sola.

Insiemi disgiunti: $A \cap B = \emptyset$.

## Casi particolari

$$
\begin{gathered}
A \cup A = A \qquad A \cup \emptyset = A \\
A \cap A = A \qquad A \cap \emptyset = \emptyset
\end{gathered}
$$

$$A \setminus \emptyset = A \qquad A \setminus A = \emptyset$$

$$
\begin{gathered}
A \cup \overline{A} = U \qquad A \cap \overline{A} = \emptyset \\
\overline{\overline{A}} = A \qquad \overline{U} = \emptyset \qquad \overline{\emptyset} = U
\end{gathered}
$$

## Prodotto cartesiano

Coppia ordinata $(a, b)$: conta l'ordine, $(1, 2) \neq (2, 1)$.

$$A \times B = \{(a, b) \mid a \in A \text{ e } b \in B\}$$

Se $A$ ha $m$ elementi e $B$ ne ha $n$, $A \times B$ ne ha $m \cdot n$. Inoltre $A \times \emptyset = \emptyset$ e $A^2 = A \times A$.

Per esempio $\{1, 2\} \times \{a, b, c\} = \{(1, a), (1, b), (1, c), (2, a), (2, b), (2, c)\}$.

## Operazioni e inclusione

Queste affermazioni sono equivalenti:

$$
\begin{gathered}
A \subseteq B \qquad A \cup B = B \\
A \cap B = A \qquad A \setminus B = \emptyset
\end{gathered}
$$

## Proprietà

| Proprietà | Unione | Intersezione |
|---|---|---|
| Commutativa | $A \cup B = B \cup A$ | $A \cap B = B \cap A$ |
| Associativa | $(A \cup B) \cup C = A \cup (B \cup C)$ | $(A \cap B) \cap C = A \cap (B \cap C)$ |
| Distributiva | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| Leggi di De Morgan | $\overline{A \cup B} = \overline{A} \cap \overline{B}$ | $\overline{A \cap B} = \overline{A} \cup \overline{B}$ |

La differenza non è né commutativa né associativa; il prodotto cartesiano in generale non è commutativo. Nelle espressioni si usano le parentesi e si parte dalle più interne.

```ad-warning
L'ordine nella differenza
$A \setminus B = \{1, 2\}$ ma $B \setminus A = \{5, 6\}$: sono insiemi diversi.
```

```ad-warning
Il complementare senza universo
Il complementare di $\{2, 4\}$ non si calcola finché non sai qual è $U$.
```

```ad-warning
Coppie con le graffe
Gli elementi di $A \times B$ si scrivono $(1, a)$; $\{1, a\}$ è un insieme, senza ordine.
```
