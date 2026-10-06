# Formulario: Equazione della circonferenza

## Equazione con centro e raggio

Circonferenza di centro $C(\alpha, \beta)$ e raggio $r$:

$$(x - \alpha)^2 + (y - \beta)^2 = r^2$$

Con il centro nell'origine: $x^2 + y^2 = r^2$. Esempio: centro $(2, 1)$ e raggio $3$ danno $(x - 2)^2 + (y - 1)^2 = 9$.

## Punti interni ed esterni

| Confronto | Il punto $P$ è |
|---|---|
| $\overline{PC}^2 < r^2$ | interno |
| $\overline{PC}^2 = r^2$ | sulla circonferenza |
| $\overline{PC}^2 > r^2$ | esterno |

## Forma generale

$$x^2 + y^2 + ax + by + c = 0$$

Dal centro e dal raggio ai coefficienti: $a = -2\alpha$, $b = -2\beta$, $c = \alpha^2 + \beta^2 - r^2$.

Dai coefficienti al centro e al raggio:

$$
\begin{gathered}
\alpha = -\frac{a}{2} \qquad \beta = -\frac{b}{2} \\
r = \sqrt{\alpha^2 + \beta^2 - c}
\end{gathered}
$$

Esempio: $x^2 + y^2 - 4x + 6y - 3 = 0$ ha centro $(2, -3)$ e raggio $\sqrt{4 + 9 + 3} = 4$.

| $\alpha^2 + \beta^2 - c$ | L'equazione rappresenta |
|---|---|
| positivo | una circonferenza |
| zero | il solo punto $(\alpha, \beta)$ |
| negativo | nessun punto |

Se $x^2$ e $y^2$ hanno lo stesso coefficiente diverso da $1$, prima si divide per quel coefficiente. Con coefficienti diversi, o con il termine $xy$, non è una circonferenza.

| Coefficiente nullo | La circonferenza |
|---|---|
| $a = 0$ | ha il centro sull'asse $y$ |
| $b = 0$ | ha il centro sull'asse $x$ |
| $c = 0$ | passa per l'origine |
| $a = 0$ e $b = 0$ | ha il centro nell'origine |

## Trovare l'equazione da condizioni

Servono tre condizioni: il centro vale per due, il passaggio per un punto per una.

- Centro e un punto: $r^2$ è il quadrato della distanza tra il centro e il punto.
- Estremi di un diametro: il centro è il punto medio, $r^2$ è il quadrato della distanza del centro da un estremo.
- Tre punti non allineati: si sostituiscono le coordinate in $x^2 + y^2 + ax + by + c = 0$ e si risolve il sistema in $a$, $b$, $c$.
- Due punti e centro su una retta: si scrive il centro con una sola lettera e si impone che abbia la stessa distanza dai due punti.

```ad-warning
I segni del centro
$(x + 3)^2 + (y - 1)^2 = 4$ ha centro $(-3, 1)$ e raggio $2$, non centro $(3, -1)$ e raggio $4$.
```

```ad-warning
Il raggio non è la radice di c
In $x^2 + y^2 - 4x + 6y - 3 = 0$ il raggio è $4$: $r^2 = \alpha^2 + \beta^2 - c$, non $-c$.
```

```ad-warning
Prima si divide
In $2x^2 + 2y^2 - 2x + 6y - 3 = 0$ si divide per $2$ prima di leggere $a$, $b$, $c$.
```
