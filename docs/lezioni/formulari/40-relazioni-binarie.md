# Formulario: Relazioni binarie

## Relazione da A a B

- Relazione binaria da $A$ a $B$: un sottoinsieme del prodotto cartesiano.

$$\mathcal{R} \subseteq A \times B$$

- $a$ è in relazione con $b$, e $b$ è un corrispondente di $a$:

$$a \mathrel{\mathcal{R}} b \iff (a, b) \in \mathcal{R}$$

- Relazione in $A$: l'insieme di partenza e quello di arrivo coincidono, $\mathcal{R} \subseteq A \times A$.
- Casi estremi: la relazione vuota $\emptyset$ e la relazione $A \times B$.

## Dominio, codominio e coppie

| Nome | Che cos'è | Nell'esempio dei divisori |
|---|---|---|
| dominio | l'insieme di partenza $A$ | $\{2,\ 3,\ 5,\ 7\}$ |
| codominio | l'insieme di arrivo $B$ | $\{4,\ 6,\ 9,\ 10\}$ |
| coppie | la relazione $\mathcal{R}$, contenuta in $A \times B$ | sei coppie |

Un elemento del dominio può avere nessuno, uno o più corrispondenti.

## Rappresentazioni

Esempio: "$a$ è un divisore di $b$" da $\{2,\ 3,\ 5,\ 7\}$ a $\{4,\ 6,\ 9,\ 10\}$.

- A parole: la proprietà, insieme ai due insiemi.
- Elenco delle coppie:

$$
\begin{gathered}
\mathcal{R} = \{(2, 4),\ (2, 6),\ (2, 10), \\
(3, 6),\ (3, 9),\ (5, 10)\}
\end{gathered}
$$

- Diagramma a frecce: una freccia da $a$ a $b$ per ogni coppia; in una relazione in $A$ la coppia $(a, a)$ è un cappio.
- Tabella a doppia entrata: $A$ sulle righe, $B$ sulle colonne, un segno nelle caselle delle coppie.
- Grafico cartesiano: $A$ sull'asse orizzontale, $B$ su quello verticale, un punto per ogni coppia.

## Relazione inversa

Va da $B$ ad $A$ e scambia gli elementi di ogni coppia:

$$b \mathrel{\mathcal{R}^{-1}} a \iff a \mathrel{\mathcal{R}} b$$

- "$a$ è un divisore di $b$" ha per inversa "$b$ è un multiplo di $a$".
- Diagramma: le stesse frecce con il verso cambiato. Grafico: $(a, b)$ diventa $(b, a)$, simmetrico rispetto alla retta $y = x$.
- $(\mathcal{R}^{-1})^{-1} = \mathcal{R}$, e $\mathcal{R}^{-1}$ ha tante coppie quante $\mathcal{R}$.

```ad-warning
Scambiare l'ordine nella coppia
Il primo posto è per l'elemento di $A$: "$2$ divide $6$" dà $(2, 6)$, non $(6, 2)$.
```

```ad-warning
Inversa e negazione
L'inversa di "è un divisore di" è "è un multiplo di", non "non è un divisore di".
```

```ad-warning
Dimenticare gli insiemi
La stessa proprietà tra insiemi diversi dà relazioni diverse.
```
