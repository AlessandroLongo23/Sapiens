# Formulario: Equazioni binomie, trinomie e scomponibili

## Grado superiore al secondo

- Forma normale: $P(x) = 0$, con $P(x)$ polinomio di grado $n$.
- Un'equazione di grado $n$ ha al massimo $n$ soluzioni reali, anche nessuna.

## Equazioni scomponibili

Legge di annullamento del prodotto: un prodotto vale zero se e solo se almeno uno dei fattori vale zero.

1. Porta tutto a primo membro: a secondo membro resta $0$.
2. Scomponi: raccoglimento, prodotti notevoli, trinomio di secondo grado, Ruffini.
3. Uguaglia a zero ogni fattore e risolvi.
4. Scrivi $S$ con tutte le soluzioni, ognuna una volta.

$$
\begin{gathered}
x^3 - 4x = 0 \\
x(x - 2)(x + 2) = 0 \\
S = \{-2, 0, 2\}
\end{gathered}
$$

## Equazioni binomie

$$
\begin{gathered}
ax^n + b = 0 \\
x^n = -\frac{b}{a} = k
\end{gathered}
$$

| $x^n = k$ | $n$ pari | $n$ dispari |
|---|---|---|
| $k > 0$ | $x = \pm\sqrt[n]{k}$ | $x = \sqrt[n]{k}$ |
| $k = 0$ | $x = 0$ | $x = 0$ |
| $k < 0$ | nessuna soluzione | $x = \sqrt[n]{k}$ |

Esempi: $x^4 = 16$ dà $x = \pm 2$; $x^3 = -8$ dà $x = -2$; $x^4 = -81$ è impossibile.

## Equazioni trinomie

$$
\begin{gathered}
ax^{2n} + bx^n + c = 0 \\
t = x^n \ \Rightarrow \ at^2 + bt + c = 0
\end{gathered}
$$

1. Poni $t = x^n$ e risolvi l'equazione in $t$ (con $\Delta < 0$ nessuna soluzione).
2. Torna a $x$: risolvi le binomie $x^n = t_1$ e $x^n = t_2$.
3. Scrivi $S$ con tutte le soluzioni in $x$.

Biquadratica ($n = 2$, $t = x^2$): ogni $t > 0$ dà $x = \pm\sqrt{t}$, ogni $t < 0$ nessuna soluzione.

$$
\begin{gathered}
x^4 - 5x^2 + 4 = 0 \\
t = 1, \ t = 4 \\
S = \{-2, -1, 1, 2\}
\end{gathered}
$$

## Disequazioni di grado superiore

Scomponi $P(x)$ in fattori di primo e di secondo grado e studia il segno con la tabella dei segni. Per esempio $x^3 - x^2 - 4x + 4 > 0$ diventa $(x - 1)(x - 2)(x + 2) > 0$, con $S = \,\mathopen{]}-2, 1\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}$.

```ad-warning
Dividere per x
Da $x^3 = 4x$ non si passa a $x^2 = 4$: si perde $x = 0$. Si porta tutto a primo membro e si raccoglie.
```

```ad-warning
Fermarsi a t
Le soluzioni in $t$ non sono le soluzioni: da $t = 1$ e $t = 4$ si torna a $x^2 = 1$ e $x^2 = 4$.
```

```ad-warning
t negativo con l'esponente dispari
$x^2 = -4$ non ha soluzioni, ma $x^3 = -1$ ha la soluzione $x = -1$.
```
