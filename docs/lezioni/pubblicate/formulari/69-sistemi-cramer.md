# Formulario: Determinanti e regola di Cramer

## Determinante di una matrice 2 × 2

Diagonale principale meno diagonale secondaria:

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$

$$\begin{vmatrix} 2 & -3 \\ 4 & 1 \end{vmatrix} = 2 - (-12) = 14$$

## I tre determinanti di un sistema

Sistema in forma normale:

$$
\begin{cases}
ax + by = c \\
a'x + b'y = c'
\end{cases}
$$

- Determinante del sistema, con i coefficienti delle incognite:

$$D = \begin{vmatrix} a & b \\ a' & b' \end{vmatrix} = ab' - a'b$$

- $D_x$: i termini noti al posto della colonna di $x$.

$$D_x = \begin{vmatrix} c & b \\ c' & b' \end{vmatrix} = cb' - c'b$$

- $D_y$: i termini noti al posto della colonna di $y$.

$$D_y = \begin{vmatrix} a & c \\ a' & c' \end{vmatrix} = ac' - a'c$$

## Regola di Cramer

Se $D \neq 0$:

$$x = \frac{D_x}{D} \qquad y = \frac{D_y}{D}$$

1. Porta il sistema in forma normale (un'incognita che manca ha coefficiente $0$).
2. Calcola $D$.
3. Se $D \neq 0$, calcola $D_x$ e $D_y$ e dividi.
4. Verifica la coppia nelle equazioni di partenza.

## Discussione

| $D$ | $D_x$ e $D_y$ | Il sistema è |
|---|---|---|
| $D \neq 0$ | qualunque | determinato |
| $D = 0$ | almeno uno $\neq 0$ | impossibile |
| $D = 0$ | tutti e due $= 0$ | indeterminato |

Eccezione: se i quattro coefficienti delle incognite sono tutti zero, il sistema è $0 = c$, $0 = c'$, impossibile se $c$ o $c'$ non è zero.

## Sistemi letterali

1. Calcola $D$ e scomponilo; trova i valori del parametro che lo annullano.
2. Per gli altri valori: Cramer, e semplifica.
3. Per ogni valore che annulla $D$: sostituiscilo nel sistema e guarda le equazioni.

$$
\begin{gathered}
\begin{cases} kx + y = 1 \\ x + ky = 1 \end{cases} \\[4pt]
D = (k - 1)(k + 1) \\
D_x = D_y = k - 1
\end{gathered}
$$

Se $k \neq \pm 1$, la soluzione è $\left(\dfrac{1}{k + 1}, \dfrac{1}{k + 1}\right)$; se $k = 1$, indeterminato; se $k = -1$, impossibile.

## Tre equazioni in tre incognite

Sostituzione: ricava un'incognita da un'equazione, sostituiscila nelle altre due, risolvi il sistema $2 \times 2$, trova la terza.

Regola di Sarrus: ricopia a destra le prime due colonne, somma i prodotti delle diagonali che scendono verso destra e togli quelli delle diagonali che scendono verso sinistra.

$$
\begin{aligned}
&\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} \\
&= aei + bfg + cdh \\
&\quad - ceg - afh - bdi
\end{aligned}
$$

Cramer, se $D \neq 0$:

$$
\begin{gathered}
x = \frac{D_x}{D} \qquad y = \frac{D_y}{D} \\[4pt]
z = \frac{D_z}{D}
\end{gathered}
$$

Se $D = 0$, Cramer non decide: si risolve per sostituzione o riduzione.

```ad-warning
Il quoziente al contrario
$x = \dfrac{D_x}{D}$: il determinante del sistema sta sempre al denominatore.
```

```ad-warning
D uguale a zero non vuol dire impossibile
Con $D = 0$ servono $D_x$ e $D_y$: il sistema può essere impossibile o indeterminato.
```

```ad-warning
Fermarsi ai determinanti con un parametro
Per i valori che annullano $D$, sostituisci nel sistema: con $D = D_x = D_y = 0$ può essere impossibile.
```
