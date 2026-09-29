# Formulario: Seno e coseno per scomporre un vettore

## Componenti

$\alpha$ è l'angolo tra il vettore e il semiasse positivo delle $x$, in senso antiorario. $\vec{v} = \vec{v}_x + \vec{v}_y$.

$$
\begin{gathered}
v_x = v\cos\alpha \\
v_y = v\sin\alpha
\end{gathered}
$$

- Se l'angolo è dato rispetto all'asse $y$: $v_x = v\sin\beta$, $v_y = v\cos\beta$, oppure si usa $\alpha = 90^\circ - \beta$.
- Esempio: $50\,\text{N}$ a $30^\circ$ danno $F_x \approx 43\,\text{N}$, $F_y = 25\,\text{N}$.
- Calcolatrice in gradi ($D$ o $\text{DEG}$): $\sin 30 = 0{,}5$.

## Segni

| Quadrante | $\alpha$ | $v_x$ | $v_y$ |
|---|---|---|---|
| primo | $0^\circ$-$90^\circ$ | $+$ | $+$ |
| secondo | $90^\circ$-$180^\circ$ | $-$ | $+$ |
| terzo | $180^\circ$-$270^\circ$ | $-$ | $-$ |
| quarto | $270^\circ$-$360^\circ$ | $+$ | $-$ |

## Dalle componenti al vettore

$$
\begin{gathered}
v = \sqrt{v_x^2 + v_y^2} \\
\tan\alpha = \frac{v_y}{v_x}
\end{gathered}
$$

Angolo con $\tan^{-1}$: se $v_x < 0$ si aggiunge $180^\circ$; se solo $v_y < 0$ si aggiunge $360^\circ$. Esempio: $s_x = -3{,}0$, $s_y = 4{,}0$ danno $-53{,}1^\circ + 180^\circ \approx 127^\circ$.

## Somma per componenti

1. Componenti di ogni vettore, con il segno.
2. $R_x$ = somma delle componenti $x$, $R_y$ = somma delle componenti $y$.
3. $R = \sqrt{R_x^2 + R_y^2}$.
4. Angolo con $\tan^{-1}\dfrac{R_y}{R_x}$, corretto se $R_x < 0$.

Risultati con le cifre significative dei dati; nei passaggi una cifra in più.

```ad-warning
Seno e coseno scambiati
Il coseno va con il cateto adiacente all'angolo che conosci, non sempre con l'orizzontale.
```

```ad-warning
La calcolatrice in radianti
$\cos 30$ in radianti dà $0{,}154$, non $0{,}866$.
```

```ad-warning
L'angolo della calcolatrice
$\tan^{-1}$ dà angoli tra $-90^\circ$ e $90^\circ$: guarda i segni delle componenti prima di scriverlo.
```
