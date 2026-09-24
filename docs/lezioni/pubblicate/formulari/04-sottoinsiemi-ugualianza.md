# Formulario: Sottoinsiemi e uguaglianza

## Inclusione

$A$ è un sottoinsieme di $B$ se ogni elemento di $A$ è anche elemento di $B$:

$$A \subseteq B$$

Si legge "$A$ è incluso in $B$" (oppure "è contenuto in"); al contrario $B \supseteq A$, "$B$ contiene $A$". Se non vale si scrive $A \not\subseteq B$.

Per dimostrare $A \subseteq B$ si controllano tutti gli elementi di $A$; per smentirla basta un elemento di $A$ che non sta in $B$. Per esempio $\{1, 3\} \subseteq \{1, 2, 3, 4, 5\}$, ma $\{1, 6\} \not\subseteq \{1, 2, 3, 4, 5\}$.

Per ogni insieme $A$:

$$A \subseteq A \qquad \emptyset \subseteq A$$

## Inclusione stretta

$A \subseteq B$ e $A \neq B$:

$$A \subset B$$

$\subseteq$ ricorda $\le$, $\subset$ ricorda $<$. Per esempio $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$. Alcuni testi scrivono $\subset$ per l'inclusione e $\subsetneq$ per quella stretta.

## Sottoinsiemi impropri e propri

Impropri: $\emptyset$ e $A$ stesso. Propri: tutti gli altri.

I sottoinsiemi di $\{a, b, c\}$ sono 8: $\emptyset$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$, $\{a, b, c\}$; 2 impropri e 6 propri.

## Uguaglianza

Due insiemi sono uguali quando hanno esattamente gli stessi elementi. Si dimostra con la doppia inclusione:

$$A = B \quad \text{se e solo se} \quad A \subseteq B \ \text{ e } \ B \subseteq A$$

L'ordine e le ripetizioni non contano: $\{1, 2, 3\} = \{3, 1, 2\} = \{1, 1, 2, 3\}$.

## Proprietà dell'inclusione

| Proprietà | Enunciato |
|---|---|
| Riflessiva | $A \subseteq A$ |
| Antisimmetrica | se $A \subseteq B$ e $B \subseteq A$, allora $A = B$ |
| Transitiva | se $A \subseteq B$ e $B \subseteq C$, allora $A \subseteq C$ |

Se $A$ e $B$ sono finiti e $A \subseteq B$, allora $|A| \le |B|$; il viceversa non vale.

```ad-warning
$\in$ e $\subseteq$
Con $B = \{2, 4, 6\}$: $2 \in B$ e $\{2\} \subseteq B$ sono veri, $\{2\} \in B$ è falso.
```

```ad-warning
Il vuoto non è un elemento di ogni insieme
Con $A = \{1, 2\}$ vale $\emptyset \subseteq A$, ma $\emptyset \in A$ è falso.
```

```ad-warning
$A \subset A$ è sempre falso
L'inclusione stretta richiede insiemi diversi: si scrive $A \subseteq A$.
```
