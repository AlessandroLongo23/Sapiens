# Formulario: Trasformazioni dei grafici

## La regola generale

Un'operazione fuori da $f$ agisce sulle ordinate, in verticale, nel verso che ti aspetti. Un'operazione dentro $f$, sulla $x$, agisce sulle ascisse, in orizzontale, nel verso contrario.

## Tabella delle trasformazioni

| Equazione | Trasformazione del grafico di $f$ | $(x_0, y_0)$ va in |
|---|---|---|
| $y = f(x) + b$ | traslazione verticale di $b$ | $(x_0, y_0 + b)$ |
| $y = f(x - a)$ | traslazione orizzontale di $a$ | $(x_0 + a, y_0)$ |
| $y = f(x - a) + b$ | traslazione di vettore $\vec{v}(a, b)$ | $(x_0 + a, y_0 + b)$ |
| $y = -f(x)$ | simmetria rispetto all'asse $x$ | $(x_0, -y_0)$ |
| $y = f(-x)$ | simmetria rispetto all'asse $y$ | $(-x_0, y_0)$ |
| $y = -f(-x)$ | simmetria rispetto all'origine | $(-x_0, -y_0)$ |
| $y = k f(x)$, $k > 0$ | dilatazione verticale di fattore $k$ | $(x_0, k y_0)$ |
| $y = f(kx)$, $k > 0$ | dilatazione orizzontale di fattore $\dfrac{1}{k}$ | $\Big(\dfrac{x_0}{k}, y_0\Big)$ |

- $y = f(x - 3)$ va a destra di $3$; $y = f(x + 3)$ va a sinistra di $3$.
- $y = k f(x)$ non sposta gli zeri; $y = f(kx)$ non sposta il punto sull'asse $y$.
- Con $k > 1$: $k f(x)$ allunga in verticale, $f(kx)$ stringe in orizzontale.

## Valore assoluto

$y = |f(x)|$:

1. Tieni le parti del grafico sopra l'asse $x$.
2. Ribalta rispetto all'asse $x$ le parti che stanno sotto.

$y = f(|x|)$:

1. Tieni la parte con $x \geq 0$ e cancella quella con $x < 0$.
2. Copia a sinistra la simmetrica rispetto all'asse $y$ della parte tenuta.

## Più trasformazioni

Si applicano nell'ordine in cui si calcola il valore: prima quello che succede alla $x$, poi quello che succede al risultato, con le moltiplicazioni prima delle addizioni.

Per $y = -2\sqrt{x + 1} + 3$ da $y = \sqrt{x}$: a sinistra di $1$, ordinate raddoppiate, ribaltamento rispetto all'asse $x$, in su di $3$. Il punto di partenza è $(-1, 3)$.

Per la parabola: $x^2 - 4x + 3 = (x - 2)^2 - 1$, cioè $y = x^2$ traslata del vettore $\vec{v}(2, -1)$.

```ad-warning
Il verso in orizzontale
$f(x + 3)$ sposta a sinistra e $f(2x)$ stringe: dentro $f$ tutto va al contrario.
```

```ad-warning
Valore assoluto fuori o dentro
$|x - 2|$ è una V con il vertice in $(2, 0)$; $|x| - 2$ è una V con il vertice in $(0, -2)$.
```

```ad-warning
L'ordine conta
$f(2x - 4) = f\big(2(x - 2)\big)$: è $f(2x)$ spostato a destra di $2$, non di $4$.
```
