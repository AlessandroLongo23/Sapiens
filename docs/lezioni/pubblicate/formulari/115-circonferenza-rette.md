# Formulario: Circonferenza e rette

## Posizione di una retta rispetto a una circonferenza

$d$ è la distanza del centro dalla retta, $r$ il raggio, $\Delta$ il discriminante della risolvente del sistema.

| Distanza | Risolvente | Punti comuni | La retta è |
|---|---|---|---|
| $d < r$ | $\Delta > 0$ | due | secante |
| $d = r$ | $\Delta = 0$ | uno | tangente |
| $d > r$ | $\Delta < 0$ | nessuno | esterna |

Lunghezza della corda staccata da una retta secante:

$$\overline{AB} = 2\sqrt{r^2 - d^2}$$

## Tangente in un punto della circonferenza

La tangente in $P$ è perpendicolare al raggio $CP$.

1. Controlla che $P$ stia sulla circonferenza.
2. Calcola $m_{CP} = \dfrac{y_P - y_C}{x_P - x_C}$.
3. La tangente ha coefficiente angolare $m = -\dfrac{1}{m_{CP}}$.
4. Scrivi $y - y_P = m(x - x_P)$.

Raggio orizzontale: tangente verticale $x = x_P$. Raggio verticale: tangente orizzontale $y = y_P$.

Formula di sdoppiamento, per $P(x_0, y_0)$ sulla circonferenza $x^2 + y^2 + ax + by + c = 0$:

$$
\begin{gathered}
x_0 x + y_0 y + a \cdot \frac{x + x_0}{2} \, + \\
+ \, b \cdot \frac{y + y_0}{2} + c = 0
\end{gathered}
$$

## Tangenti da un punto esterno

| Il punto $P$ è | Tangenti per $P$ |
|---|---|
| esterno | due |
| sulla circonferenza | una |
| interno | nessuna |

1. Scrivi il fascio per $P(x_0, y_0)$: $mx - y + y_0 - mx_0 = 0$.
2. Scrivi la distanza del centro dalla retta del fascio.
3. Imponi che sia uguale a $r$ ed eleva al quadrato.
4. Risolvi in $m$.

Se l'equazione in $m$ è di primo grado, la seconda tangente è la retta verticale $x = x_0$.

## Circonferenza tangente a una retta

Il raggio è la distanza del centro dalla retta. Con il centro $C(\alpha, \beta)$: tangente all'asse $x$ se $r = |\beta|$, all'asse $y$ se $r = |\alpha|$.

## Due circonferenze

$d$ è la distanza tra i centri, $r$ il raggio maggiore, $r'$ il minore.

| Confronto | Le circonferenze sono |
|---|---|
| $d > r + r'$ | esterne |
| $d = r + r'$ | tangenti esternamente |
| $r - r' < d < r + r'$ | secanti |
| $d = r - r'$, con $d \neq 0$ | tangenti internamente |
| $d < r - r'$ | una interna all'altra |

Asse radicale: la retta che si ottiene sottraendo membro a membro le due equazioni. Passa per i punti comuni di due circonferenze secanti; è la tangente comune di due circonferenze tangenti. I punti comuni si trovano con il sistema tra l'asse radicale e una delle due circonferenze.

```ad-warning
La retta in forma implicita
Per la distanza $y = x - 4$ va scritta $x - y - 4 = 0$: $a = 1$, $b = -1$, $c = -4$.
```

```ad-warning
Lo sdoppiamento solo sulla circonferenza
Se $P$ non sta sulla circonferenza, la formula di sdoppiamento non dà una tangente.
```

```ad-warning
La tangente verticale
Il fascio $y - y_0 = m(x - x_0)$ non contiene $x = x_0$: va controllata a parte.
```
