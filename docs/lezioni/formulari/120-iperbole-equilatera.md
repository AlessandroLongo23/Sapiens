# Formulario: Iperbole equilatera e funzione omografica

## Iperbole equilatera riferita agli assi

Iperbole equilatera: un'iperbole con i semiassi uguali, $a = b$.

$$x^2 - y^2 = a^2 \qquad x^2 - y^2 = -a^2$$

| | $x^2 - y^2 = a^2$ | $x^2 - y^2 = -a^2$ |
|---|---|---|
| Vertici reali | $(\pm a, 0)$ | $(0, \pm a)$ |
| Fuochi | $(\pm a\sqrt{2}, 0)$ | $(0, \pm a\sqrt{2})$ |

Asintoti $y = x$ e $y = -x$, perpendicolari. Per i fuochi $c = a\sqrt{2}$; eccentricità $e = \sqrt{2}$.

## Iperbole equilatera riferita agli asintoti

$$xy = k \qquad \text{con } k \neq 0$$

Si scrive anche $y = \dfrac{k}{x}$. Gli asintoti sono gli assi cartesiani.

| | $k > 0$ | $k < 0$ |
|---|---|---|
| Rami | primo e terzo quadrante | secondo e quarto quadrante |
| Asse trasverso | sulla retta $y = x$ | sulla retta $y = -x$ |
| Vertici | $(\pm\sqrt{k}, \pm\sqrt{k})$ | $(-\sqrt{\lvert k \rvert}, \sqrt{\lvert k \rvert})$ e $(\sqrt{\lvert k \rvert}, -\sqrt{\lvert k \rvert})$ |
| Fuochi | $(\pm\sqrt{2k}, \pm\sqrt{2k})$ | $(-\sqrt{2\lvert k \rvert}, \sqrt{2\lvert k \rvert})$ e $(\sqrt{2\lvert k \rvert}, -\sqrt{2\lvert k \rvert})$ |

Semiasse $a = \sqrt{2\lvert k \rvert}$, e per i fuochi $c = 2\sqrt{\lvert k \rvert}$. Per $xy = 4$: vertici $(2, 2)$ e $(-2, -2)$, $a = 2\sqrt{2}$, $c = 4$.

## Funzione omografica

$$
\begin{gathered}
y = \frac{ax + b}{cx + d} \\
\text{con } c \neq 0 \text{ e } ad - bc \neq 0
\end{gathered}
$$

Il grafico è un'iperbole equilatera con gli asintoti paralleli agli assi.

- Dominio: $x \neq -\dfrac{d}{c}$.
- Asintoto verticale: $x = -\dfrac{d}{c}$.
- Asintoto orizzontale: $y = \dfrac{a}{c}$.
- Centro: $C\Big(-\dfrac{d}{c}, \dfrac{a}{c}\Big)$.
- Rispetto agli assi per $C$ è l'iperbole $xy = k$, con $k = \dfrac{bc - ad}{c^2}$.

Se $c = 0$ il grafico è una retta; se $ad - bc = 0$ è una retta orizzontale senza un punto.

Per $y = \dfrac{2x + 1}{x - 1}$: asintoti $x = 1$ e $y = 2$, centro $C(1, 2)$.

## Come si disegna una funzione omografica

1. Asintoti e centro $C$.
2. Intersezioni con gli assi: $\Big(0, \dfrac{b}{d}\Big)$ se $d \neq 0$, $\Big(-\dfrac{b}{a}, 0\Big)$ se $a \neq 0$.
3. Qualche altro punto, ognuno con il simmetrico rispetto a $C$.
4. I due rami, uno per parte dell'asintoto verticale.

## Dagli asintoti alla funzione

Con asintoti $x = p$ e $y = q$:

$$y = q + \frac{k}{x - p}$$

$k$ si trova con un punto del grafico; poi si riduce a una sola frazione.

```ad-warning
Il semiasse di xy = k
I vertici di $xy = 4$ sono $(2, 2)$ e $(-2, -2)$, non $(\pm 4, 0)$: gli assi sono asintoti.
```

```ad-warning
Il segno dell'asintoto verticale
Per $y = \dfrac{2x + 1}{x - 1}$ è $x = 1$, il numero che annulla il denominatore, non $x = -1$.
```

```ad-warning
L'asintoto orizzontale
È $\dfrac{a}{c}$, il rapporto tra i coefficienti di $x$, non $\dfrac{b}{d}$.
```
