# Formulario: L'equilibrio di un punto materiale e le reazioni vincolari

## Condizione di equilibrio

Un punto materiale fermo resta fermo se la risultante delle forze è nulla:

$$\vec{R} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 + \ldots = \vec{0}$$

- Due forze: stesso modulo, stessa direzione, versi opposti.
- Forza equilibrante: $\vec{F}_e = -\vec{R}$, stesso modulo della risultante delle altre forze e verso opposto.

## Reazioni vincolari

- Il vincolo esercita la reazione vincolare $\vec{F}_v$, che vale quanto serve per impedire il movimento.
- Piano d'appoggio liscio: $\vec{F}_v$ perpendicolare al piano, $F_v = F_\perp$; il piano spinge, non tira.

| Corpo su un piano orizzontale | $F_v$ |
|---|---|
| nessun'altra forza verticale | $P$ |
| una forza $F$ lo preme verso il basso | $P + F$ |
| una forza $F < P$ lo tira verso l'alto | $P - F$ |

- Filo ideale: tira lungo il filo con la tensione $\vec{T}$, uguale in tutti i punti; non spinge.
- Corpo appeso a un filo verticale: $T = P$.

## Equilibrio per componenti

$$
\begin{gathered}
R_x = F_{1x} + F_{2x} + \ldots = 0 \\
R_y = F_{1y} + F_{2y} + \ldots = 0
\end{gathered}
$$

1. Disegna il punto con tutte le forze.
2. Scegli gli assi, $x$ orizzontale e $y$ verticale.
3. Scomponi ogni forza con seno e coseno, con il segno.
4. Somma delle $x$ uguale a zero, somma delle $y$ uguale a zero.
5. Risolvi: al massimo due incognite.

## Corpo appeso a due fili

Fili simmetrici, angolo $\alpha$ con l'orizzontale:

$$T = \frac{P}{2\sin\alpha}$$

- Filo inclinato di $\beta$ dalla verticale e filo orizzontale: $T\cos\beta = P$, $F = T\sin\beta$.
- Più i fili sono vicini all'orizzontale, più la tensione cresce: a $30^\circ$ ogni filo tira con $P$, a $5^\circ$ con $5{,}7\,P$.

```ad-warning
La reazione non è sempre il peso
$F_v = P$ solo su un piano orizzontale senza altre forze verticali.
```

```ad-warning
Le tensioni non si sommano come numeri
Due fili a $30^\circ$ tirano con $P$ ciascuno, non con $P/2$: si sommano le componenti.
```

```ad-warning
Seno e coseno scambiati
Con l'angolo dalla verticale la componente verticale va con il coseno.
```
