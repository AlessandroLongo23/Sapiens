# Formulario: Rette parallele e perpendicolari

## Condizioni di parallelismo e perpendicolarità

- Parallele: nessun punto in comune oppure coincidenti, $r \parallel s$. Perpendicolari: si incontrano ad angolo retto, $r \perp s$.
- Rette non verticali $y = m_1x + q_1$ e $y = m_2x + q_2$:

$$
\begin{gathered}
r \parallel s \ \text{ se } \ m_1 = m_2 \\
r \perp s \ \text{ se } \ m_1 \cdot m_2 = -1
\end{gathered}
$$

- Antireciproco di $m$: $-\dfrac{1}{m}$. Esempio: la perpendicolare a $m = \dfrac{2}{3}$ ha $m = -\dfrac{3}{2}$.
- Rette $ax + by + c = 0$ e $a'x + b'y + c' = 0$, valide in tutti i casi:

| | forma esplicita | forma implicita |
|---|---|---|
| parallele | $m_1 = m_2$ | $ab' = a'b$ |
| perpendicolari | $m_1 \cdot m_2 = -1$ | $aa' + bb' = 0$ |

- Rette parallele agli assi: $x = h_1$ e $x = h_2$ parallele; $y = k$ e $x = h$ perpendicolari. Una retta verticale non ha $m$.

## Retta per un punto parallela o perpendicolare

1. Trova $m$ della retta data (forma esplicita, oppure $m = -\dfrac{a}{b}$).
2. Parallela: stesso $m$. Perpendicolare: $-\dfrac{1}{m}$.
3. Retta per $P(x_0, y_0)$:

$$y - y_0 = m(x - x_0)$$

- In forma implicita: parallela a $ax + by + c = 0$ è $ax + by + c' = 0$, perpendicolare è $bx - ay + c' = 0$; $c'$ si trova sostituendo il punto.
- Retta data $y = k$: parallela $y = y_0$, perpendicolare $x = x_0$. Retta data $x = h$: parallela $x = x_0$, perpendicolare $y = y_0$.

## Asse di un segmento

Perpendicolare ad $AB$ nel punto medio $M$:
1. Calcola $M$ e $m_{AB} = \dfrac{y_B - y_A}{x_B - x_A}$.
2. Scrivi la retta per $M$ con coefficiente angolare $-\dfrac{1}{m_{AB}}$.

Oppure, luogo dei punti con $\overline{PA} = \overline{PB}$:

$$
\begin{gathered}
(x - x_A)^2 + (y - y_A)^2 = \\
= (x - x_B)^2 + (y - y_B)^2
\end{gathered}
$$

- Segmento orizzontale: l'asse è verticale, $x = x_M$. Segmento verticale: l'asse è orizzontale, $y = y_M$.

## Proiezione di un punto su una retta

1. Scrivi la retta $s$ per $P$ perpendicolare a $r$.
2. Risolvi il sistema tra $r$ e $s$: la soluzione è la proiezione $H$.

- Su $y = k$: $H(x_0, k)$. Su $x = h$: $H(h, y_0)$.

```ad-warning
Opposto e reciproco insieme
La perpendicolare a $m = \dfrac{2}{3}$ ha $m = -\dfrac{3}{2}$, non $-\dfrac{2}{3}$ né $\dfrac{3}{2}$.
```

```ad-warning
m solo con la y da sola
$2y = 4x + 7$ ha $m = 2$, non $4$: prima si divide per il coefficiente di $y$.
```

```ad-warning
La proiezione è un punto
Trovata la perpendicolare, va messa a sistema con la retta data: la risposta è $H$, non un'equazione.
```
