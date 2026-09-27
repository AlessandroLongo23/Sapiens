# Formulario: Fasci di rette

## Fascio proprio

- Tutte le rette che passano per il centro $C(x_0, y_0)$, con il parametro $m$:

$$
\begin{gathered}
y - y_0 = m(x - x_0) \\
\text{e la retta } x = x_0
\end{gathered}
$$

- La retta verticale $x = x_0$ non si ottiene per nessun valore di $m$.
- Retta del fascio per un punto: sostituisci le coordinate del punto e trova $m$. Se viene un'uguaglianza impossibile, la retta è $x = x_0$.

## Fascio improprio

- Tutte le rette parallele a una retta data, con il parametro $q$:

$$y = mx + q \qquad (m \text{ fisso})$$

- In forma implicita: $a$ e $b$ fissi, termine noto che cambia ($x - 2y + c = 0$).
- Le rette verticali: $x = h$, con $h$ che cambia.

## Fascio generato da due rette

- Generatrici $r: ax + by + c = 0$ e $s: a'x + b'y + c' = 0$, combinazione lineare:

$$
\begin{gathered}
ax + by + c \, + \\
k(a'x + b'y + c') = 0
\end{gathered}
$$

- $r$ e $s$ incidenti: fascio proprio, il centro è la soluzione del sistema tra $r$ e $s$.
- $r$ e $s$ parallele: fascio improprio; per un valore di $k$ l'equazione non è una retta.
- Retta esclusa: $s$, quella moltiplicata per $k$. Con $k = 0$ si ottiene $r$.

Per studiare un fascio con $k$ nei coefficienti:
1. Svolgi i prodotti e raccogli $k$: $(\dots) + k(\dots) = 0$.
2. Le due espressioni uguagliate a zero sono le generatrici.
3. Incidenti: risolvi il sistema e trovi il centro. Parallele: fascio improprio.
4. La generatrice moltiplicata per $k$ è la retta esclusa.

$$
\begin{gathered}
(1 + k)x + (1 - k)y - 3 - k = 0 \\
x + y - 3 + k(x - y - 1) = 0 \\
C(2, 1), \ \text{esclusa } x - y - 1 = 0
\end{gathered}
$$

## Problemi con i fasci

| Retta cercata | Condizione |
|---|---|
| per un punto | sostituisci le coordinate |
| parallela a una retta | stesso $m$ |
| perpendicolare | prodotto degli $m$ uguale a $-1$ |

- Il coefficiente angolare del fascio: $m = -\dfrac{a}{b}$, con $a$ e $b$ che dipendono da $k$. Il valore di $k$ che annulla $b$ dà la retta verticale.
- Equazione in $k$ impossibile: controlla la retta esclusa. Equazione vera per ogni $k$: il punto è il centro.

```ad-warning
Dimenticare la retta verticale
$y - y_0 = m(x - x_0)$ non contiene $x = x_0$: se la sostituzione dà $3 = 0$, la risposta è la verticale.
```

```ad-warning
Il termine noto nel raccoglimento
$-3 - k$ si divide: $-3$ resta fuori, $-k$ diventa $k(\dots - 1)$.
```

```ad-warning
Equazione in k impossibile
Non vuol dire "nessuna retta": se il punto sta sulla retta esclusa, la risposta è lei.
```
