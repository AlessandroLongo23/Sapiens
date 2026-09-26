# Formulario: Quantificatori

## Enunciato aperto e insieme di verità

Enunciato aperto $p(x)$: frase con una variabile che diventa una proposizione quando a $x$ si sostituisce un elemento dell'universo $U$. Per esempio "$x$ è pari": $p(4)$ vera, $p(7)$ falsa.

Insieme di verità, cioè gli elementi di $U$ che rendono vero $p(x)$:

$$V_p = \{x \in U \mid p(x)\}$$

Dipende dall'universo: "$x^2 = 4$" ha $V_p = \{2\}$ in $\mathbb{N}$ e $V_p = \{-2, 2\}$ in $\mathbb{Z}$.

## I due quantificatori

| Simbolo | Si legge | È vera se |
|---|---|---|
| $\forall x \in U,\ p(x)$ | per ogni $x$ in $U$ | $V_p = U$ |
| $\exists x \in U : p(x)$ | esiste $x$ in $U$ tale che | $V_p \ne \emptyset$ |

"Esiste" vuol dire almeno uno. $\exists!$ si legge "esiste uno e un solo".

Parole: "tutti", "ogni", "qualunque sia" diventano $\forall$; "qualche", "almeno un", "c'è" diventano $\exists$; "nessuno" è $\forall$ con la negazione.

## Come si dimostra

1. $\forall$ vera: serve un ragionamento su un elemento qualunque, gli esempi non bastano.
2. $\forall$ falsa: basta un controesempio (in $\mathbb{N}$, $2x > x$ è falsa per $x = 0$).
3. $\exists$ vera: basta un esempio.
4. $\exists$ falsa: bisogna escludere tutti gli elementi di $U$.

## Negazione

$$
\begin{gathered}
\neg\big(\forall x \in U,\ p(x)\big) \\
\text{equivale a} \\
\exists x \in U : \neg p(x)
\end{gathered}
$$

$$
\begin{gathered}
\neg\big(\exists x \in U : p(x)\big) \\
\text{equivale a} \\
\forall x \in U,\ \neg p(x)
\end{gathered}
$$

"Tutti hanno studiato" si nega con "almeno uno non ha studiato". Il contrario di $x > 0$ è $x \le 0$.

## L'universo cambia il valore di verità

| Proposizione | $\mathbb{N}$ | $\mathbb{Z}$ | $\mathbb{Q}$ |
|---|---|---|---|
| $\exists x : x + 3 = 1$ | F | V | V |
| $\forall x,\ x \ge 0$ | V | F | F |
| $\exists x : 2x = 1$ | F | F | V |

## Due quantificatori

$\forall x \in \mathbb{N},\ \exists y \in \mathbb{N} : y = x + 1$ è vera; $\exists y \in \mathbb{N} : \forall x \in \mathbb{N},\ y = x + 1$ è falsa. Con quantificatori diversi l'ordine conta.

```ad-warning
Negare "tutti" con "nessuno"
La negazione di "tutti" è "almeno uno non", non "nessuno".
```

```ad-warning
Concludere "per ogni" da qualche esempio
$n^2 + n + 41$ è primo da $n = 0$ a $n = 39$, ma per $n = 40$ vale $41 \cdot 41$.
```

```ad-warning
Dimenticare l'universo
$\exists x : x + 3 = 1$ è falsa in $\mathbb{N}$ e vera in $\mathbb{Z}$.
```
