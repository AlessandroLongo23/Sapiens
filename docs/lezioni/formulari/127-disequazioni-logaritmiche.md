# Formulario: Disequazioni logaritmiche

## La regola del verso

Con $A > 0$ e $B > 0$:

| Base | Regola |
|---|---|
| $a > 1$ | $\log_a A > \log_a B \iff A > B$ (il verso si conserva) |
| $0 < a < 1$ | $\log_a A > \log_a B \iff A < B$ (il verso si rovescia) |

Le condizioni di esistenza, argomento $> 0$, non cambiano mai verso.

## Un logaritmo confrontato con un numero

| Disequazione | Con $a > 1$ | Con $0 < a < 1$ |
|---|---|---|
| $\log_a f(x) > c$ | $f(x) > a^c$ | $0 < f(x) < a^c$ |
| $\log_a f(x) < c$ | $0 < f(x) < a^c$ | $f(x) > a^c$ |

Per esempio $\log_3 (2x + 1) \leq 2$ diventa $0 < 2x + 1 \leq 9$, con $S = \left]-\dfrac{1}{2}, 4\right]$.

## Due logaritmi con la stessa base

$$
\log_a f(x) > \log_a g(x) \ \Rightarrow \
\begin{cases}
f(x) > 0 \\
g(x) > 0 \\
f(x) > g(x) \ \text{ se } a > 1, \quad f(x) < g(x) \ \text{ se } 0 < a < 1
\end{cases}
$$

## Procedimento

1. Scrivi le C.E.: ogni argomento positivo.
2. Con le proprietà riduci ogni membro a un solo logaritmo, con la stessa base; un numero $c$ diventa $\log_a a^c$.
3. Passa agli argomenti, guardando la base per il verso.
4. Risolvi la disequazione ottenuta.
5. Metti a sistema con le C.E.

Con una sostituzione $t = \log_a x$: risolvi in $t$, poi torna alla $x$ con disequazioni del tipo $\log_a x > c$.

## Disequazioni esponenziali con i logaritmi

Con $b > 0$:

| Disequazione | Con $a > 1$ | Con $0 < a < 1$ |
|---|---|---|
| $a^{f(x)} > b$ | $f(x) > \log_a b$ | $f(x) < \log_a b$ |
| $a^{f(x)} < b$ | $f(x) < \log_a b$ | $f(x) > \log_a b$ |

Con $b \leq 0$: $a^{f(x)} > b$ è vera per ogni $x$ per cui $f(x)$ esiste, $a^{f(x)} < b$ è impossibile.

Per esempio $3^x > 7$ ha $S = \mathopen{]}\log_3 7, +\infty\mathclose{[}$, con $\log_3 7 \approx 1{,}77$.

```ad-warning
Base minore di 1
$\log_{\frac{1}{2}} x > -1$ diventa $0 < x < 2$, non $x > 2$.
```

```ad-warning
La condizione di esistenza
$\log_3 (2x + 1) \leq 2$ non è $x \leq 4$: serve anche $2x + 1 > 0$.
```

```ad-warning
Dividere per un logaritmo negativo
$\log 0{,}5$ e $\log 2 - \log 3$ sono negativi: dividendo per loro il verso cambia.
```
