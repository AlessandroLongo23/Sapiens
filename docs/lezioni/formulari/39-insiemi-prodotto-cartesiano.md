# Formulario: Prodotto cartesiano

## Coppia ordinata

- Coppia ordinata: due elementi in un ordine preciso, con le parentesi tonde; $a$ è il primo elemento, $b$ il secondo.
- Uguaglianza di due coppie:

$$
\begin{gathered}
(a, b) = (c, d) \\
\text{se e solo se } a = c \text{ e } b = d
\end{gathered}
$$

- $(1, 2) \neq (2, 1)$, mentre $\{1, 2\} = \{2, 1\}$. La coppia $(3, 3)$ esiste; l'insieme $\{3, 3\}$ è $\{3\}$.

## Prodotto cartesiano

Tutte le coppie con il primo elemento in $A$ e il secondo in $B$; si legge "$A$ per $B$":

$$
\begin{gathered}
A \times B = \{(a, b) \mid \\
a \in A \text{ e } b \in B\}
\end{gathered}
$$

1. Prendi il primo elemento di $A$ e abbinalo a tutti gli elementi di $B$.
2. Ripeti con ogni altro elemento di $A$.
3. Scrivi le coppie tra graffe, con l'elemento di $A$ sempre al primo posto.

$$
\begin{gathered}
\{1, 2, 3\} \times \{a, b\} = \\
\{(1, a), (1, b), (2, a), \\
(2, b), (3, a), (3, b)\}
\end{gathered}
$$

## Rappresentazioni

- Elenco: le coppie tra graffe.
- Tabella a doppia entrata: elementi di $A$ sulle righe, di $B$ sulle colonne, la coppia $(a, b)$ nella casella dove si incontrano.
- Diagramma a frecce: ogni coppia $(a, b)$ è una freccia da $a$ a $b$; da ogni elemento di $A$ parte una freccia verso ciascun elemento di $B$.
- Reticolo: elementi di $A$ sull'asse orizzontale, di $B$ su quello verticale; ogni coppia è un punto del reticolo.

## Numero di elementi

$$|A \times B| = |A| \cdot |B|$$

$$|A \times A| = |A|^2$$

3 primi e 4 secondi danno $3 \cdot 4 = 12$ menù.

## Proprietà

- Non commutativo: in generale $A \times B \neq B \times A$, ma $|A \times B| = |B \times A|$. Sono uguali solo se $A = B$ o se uno dei due insiemi è vuoto.
- $A \times A$ si scrive anche $A^2$; $\mathbb{R} \times \mathbb{R} = \mathbb{R}^2$ è il piano cartesiano.
- Con l'insieme vuoto:

$$A \times \emptyset = \emptyset \times A = \emptyset$$

```ad-warning
Sommare invece di moltiplicare
Con 3 primi e 4 secondi i menù sono $3 \cdot 4 = 12$, non $3 + 4 = 7$.
```

```ad-warning
Scambiare l'ordine dentro le coppie
In $A \times B$ il primo elemento viene sempre da $A$: $(a, 1) \notin \{1, 2, 3\} \times \{a, b\}$.
```

```ad-warning
Pensare che $A \times \emptyset$ sia $A$
Il vuoto annulla il prodotto: $\{1, 2, 3\} \times \emptyset = \emptyset$.
```
