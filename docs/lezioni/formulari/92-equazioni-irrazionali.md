# Formulario: Equazioni e disequazioni irrazionali

## Due fatti sulla radice quadrata

- $\sqrt{A(x)}$ esiste solo dove $A(x) \geq 0$.
- Quando esiste, $\sqrt{A(x)}$ non è mai negativa.

## Radice uguale a un numero

- $\sqrt{A(x)} = k$ con $k < 0$: impossibile.
- $\sqrt{A(x)} = 0$: si risolve $A(x) = 0$.
- $\sqrt{A(x)} = k$ con $k > 0$: si risolve $A(x) = k^2$, senza altre condizioni.

## Radice uguale a un'espressione

$\sqrt{A(x)} = B(x)$ equivale al sistema

$$
\begin{cases}
B(x) \geq 0 \\
A(x) = [B(x)]^2
\end{cases}
$$

La condizione $A(x) \geq 0$ non serve: $A(x)$ è uguale a un quadrato.

1. Isola il radicale in un membro.
2. Scrivi e risolvi la condizione $B(x) \geq 0$.
3. Eleva al quadrato e risolvi.
4. Tieni le soluzioni che rispettano la condizione.

Soluzioni estranee: quelle dell'equazione elevata al quadrato che non risolvono l'equazione data. Con $\sqrt{x + 3} = x - 3$ il quadrato dà $1$ e $6$, e $1$ è estranea: $S = \{6\}$.

Metodo della verifica: eleva al quadrato senza condizioni e metti ogni soluzione nell'equazione di partenza. Solo per le equazioni.

## Due radicali e radici cubiche

$\sqrt{A(x)} = \sqrt{B(x)}$ equivale al sistema

$$
\begin{cases}
A(x) \geq 0 \\
A(x) = B(x)
\end{cases}
$$

- $\sqrt{A(x)} + \sqrt{B(x)} = k$: isola una radice, eleva al quadrato, isola l'altra, eleva di nuovo; poi la verifica.
- $\sqrt[3]{A(x)} = B(x)$ equivale ad $A(x) = [B(x)]^3$, senza condizioni.

## Disequazioni con un numero

| Disequazione | $k < 0$ | $k = 0$ | $k > 0$ |
|---|---|---|---|
| $\sqrt{A(x)} < k$ | impossibile | impossibile | $0 \leq A(x) < k^2$ |
| $\sqrt{A(x)} > k$ | $A(x) \geq 0$ | $A(x) > 0$ | $A(x) > k^2$ |

Esempio: $\sqrt{x - 2} < 3$ dà $2 \leq x < 11$.

## Disequazioni con un'espressione

$\sqrt{A(x)} < B(x)$ equivale al sistema

$$
\begin{cases}
A(x) \geq 0 \\
B(x) > 0 \\
A(x) < [B(x)]^2
\end{cases}
$$

$\sqrt{A(x)} > B(x)$ ha per soluzioni l'unione di quelle dei due sistemi

$$
\begin{cases}
B(x) < 0 \\
A(x) \geq 0
\end{cases}
$$

$$
\begin{cases}
B(x) \geq 0 \\
A(x) > [B(x)]^2
\end{cases}
$$

Con $\leq$ e $\geq$ si mette l'uguale nell'ultima disequazione (e $B(x) \geq 0$ nel verso $\leq$).

Esempio: $\sqrt{x + 5} < x - 1$ ha $S = \,\mathopen{]}4, +\infty\mathclose{[}$; $\sqrt{x + 5} > x - 1$ ha $S = [-5, 4\mathclose{[}$.

```ad-warning
Dimenticare la condizione
Da $\sqrt{3x + 1} = x - 1$ il quadrato dà $0$ e $5$, ma $x \geq 1$ tiene solo $5$.
```

```ad-warning
Un sistema solo per il verso maggiore
In $\sqrt{A(x)} > B(x)$ i valori con $B(x) < 0$ sono soluzioni, se la radice esiste: $\sqrt{5} > -1$.
```

```ad-warning
Condizioni sulla radice cubica
$\sqrt[3]{x^3 - 7} = x - 1$ ha $S = \{-1, 2\}$: il secondo membro può essere negativo.
```
