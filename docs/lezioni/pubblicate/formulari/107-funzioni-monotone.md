# Formulario: Funzioni crescenti e decrescenti

## Definizioni

$I$ è un intervallo contenuto nel dominio, $x_1$ e $x_2$ due numeri qualsiasi di $I$ con $x_1 < x_2$.

| In $I$ la funzione è | se | Il grafico |
|---|---|---|
| crescente | $f(x_1) < f(x_2)$ | sale |
| decrescente | $f(x_1) > f(x_2)$ | scende |
| crescente in senso lato (non decrescente) | $f(x_1) \leq f(x_2)$ | non scende mai |
| decrescente in senso lato (non crescente) | $f(x_1) \geq f(x_2)$ | non sale mai |

Monotona in $I$: una qualsiasi delle quattro. Strettamente monotona: crescente o decrescente. Senza altre parole, "crescente" e "decrescente" sono in senso stretto.

## Dal grafico

Si percorre il grafico da sinistra a destra e si leggono gli intervalli sull'asse $x$. Gli intervalli si elencano separati: "crescente in $[-3, -1]$ e in $[3, 5]$".

## Con la definizione

1. Prendi $x_1 < x_2$ in $I$, con le lettere.
2. Scrivi $f(x_2) - f(x_1)$ e scomponi, in modo che compaia $x_2 - x_1 > 0$.
3. Studia il segno degli altri fattori.
4. Differenza sempre positiva: crescente. Sempre negativa: decrescente.

## Funzioni note

- Retta $y = mx + q$: crescente se $m > 0$, decrescente se $m < 0$, costante se $m = 0$.
- Parabola $y = ax^2 + bx + c$, con $x_V = -\dfrac{b}{2a}$:

| | per $x \leq x_V$ | per $x \geq x_V$ |
|---|---|---|
| $a > 0$ | decrescente | crescente |
| $a < 0$ | crescente | decrescente |

- $y = x^3$: crescente su $\mathbb{R}$.
- $y = \sqrt{x}$: crescente in $[0, +\infty\mathclose{[}$.
- $y = \dfrac{1}{x}$: decrescente in $\mathopen{]}-\infty, 0\mathclose{[}$ e in $\mathopen{]}0, +\infty\mathclose{[}$, non in tutto il dominio.
- La somma di due funzioni crescenti è crescente, la somma di due decrescenti è decrescente.

## Iniettività e disequazioni

- Una funzione crescente, o decrescente, in tutto il dominio è iniettiva. Il contrario non vale.
- Se $f$ è crescente in $I$: $f(a) < f(b) \Leftrightarrow a < b$.
- Se $f$ è decrescente in $I$: $f(a) < f(b) \Leftrightarrow a > b$.
- L'inversa di una funzione crescente è crescente, quella di una decrescente è decrescente.
- Funzione composta: due crescenti o due decrescenti danno una crescente; una crescente e una decrescente danno una decrescente.

```ad-warning
Due intervalli non sono la loro unione
$y = \dfrac{1}{x}$ è decrescente per $x < 0$ e per $x > 0$, ma $-1 < 1$ e $f(-1) < f(1)$: gli intervalli non si uniscono con $\cup$.
```

```ad-warning
Crescente non vuol dire positiva
$y = x - 5$ è crescente su $\mathbb{R}$ ed è negativa per $x < 5$.
```

```ad-warning
Gli intervalli sono di x
Se il grafico sale da $(-3, -2)$ a $(-1, 2)$, la funzione è crescente in $[-3, -1]$, non in $[-2, 2]$.
```
