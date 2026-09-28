# Formulario: Equazioni e disequazioni con il valore assoluto

## Definizione

$$
|A(x)| = \begin{cases} A(x) & \text{se } A(x) \geq 0 \\ -A(x) & \text{se } A(x) < 0 \end{cases}
$$

- $|A(x)| \geq 0$ sempre, e $|A(x)| = 0$ solo dove $A(x) = 0$.
- $|A(x)| = |-A(x)|$, per esempio $|2 - x| = |x - 2|$.
- $|x - a|$ è la distanza tra $x$ e $a$ sulla retta.

## Equazioni

| Equazione | Si risolve |
|---|---|
| $\lvert A(x) \rvert = k$, $k < 0$ | impossibile |
| $\lvert A(x) \rvert = 0$ | $A(x) = 0$ |
| $\lvert A(x) \rvert = k$, $k > 0$ | $A(x) = -k$ oppure $A(x) = k$ |
| $\lvert A(x) \rvert = \lvert B(x) \rvert$ | $A(x) = B(x)$ oppure $A(x) = -B(x)$ |
| $\lvert A(x) \rvert = B(x)$ | $A(x) = \pm B(x)$ con la condizione $B(x) \geq 0$ |

Esempio: $|x - 4| = 2x + 1$, condizione $x \geq -\dfrac{1}{2}$; si trovano $-5$ (scartato) e $1$, quindi $S = \{1\}$.

## Più valori assoluti

1. Trova gli zeri degli argomenti e dividi la retta in intervalli.
2. In ogni intervallo togli le sbarre con il segno di ogni argomento.
3. Risolvi e tieni la soluzione solo se sta nel suo intervallo.

## Disequazioni con k > 0

$$
\begin{gathered}
|A(x)| < k \\
\Updownarrow \\
-k < A(x) < k
\end{gathered}
$$

$$
\begin{gathered}
|A(x)| > k \\
\Updownarrow \\
A(x) < -k \ \text{ oppure } \ A(x) > k
\end{gathered}
$$

Valori interni per $<$, valori esterni per $>$; con $\leq$ e $\geq$ gli estremi sono compresi. Per esempio $|2x - 3| \leq 5$ dà $S = [-1, 4]$.

## Disequazioni con k negativo o nullo

| Disequazione | Soluzioni |
|---|---|
| $\lvert A(x) \rvert < k$, $k \leq 0$ | nessuna |
| $\lvert A(x) \rvert \leq 0$ | $A(x) = 0$ |
| $\lvert A(x) \rvert > k$, $k < 0$ | ogni $x$ |
| $\lvert A(x) \rvert > 0$ | $A(x) \neq 0$ |

## Disequazioni con B(x)

$$
\begin{gathered}
|A(x)| < B(x) \ \Leftrightarrow \ \begin{cases} A(x) < B(x) \\ A(x) > -B(x) \end{cases}
\end{gathered}
$$

$$
\begin{gathered}
|A(x)| > B(x) \\
\Updownarrow \\
A(x) < -B(x) \ \text{ oppure } \ A(x) > B(x)
\end{gathered}
$$

Il primo è un sistema (intersezione), il secondo un'unione.

```ad-warning
Dimenticare la condizione
In $|A(x)| = B(x)$ le soluzioni con $B(x) < 0$ si scartano: per $x = -5$, $|x - 4| = 9$ ma $2x + 1 = -9$.
```

```ad-warning
Valori esterni in una riga
$|x + 1| > 2$ non si scrive $-2 > x + 1 > 2$: è $x + 1 < -2$ oppure $x + 1 > 2$.
```

```ad-warning
Il secondo membro negativo
$|x| = -3$ non ha soluzioni, e $|x - 3| > -2$ è vera per ogni $x$.
```
