# Piano inclinato

## Che cos'è

Un corpo su un piano inclinato è tirato giù dal suo peso, ma solo in parte lungo il piano. Il peso $P = m g$ si scompone in una componente parallela al piano, che lo fa scendere, e in una perpendicolare, che lo preme contro il piano ed è equilibrata dalla forza normale $N$.

$$P_\parallel = P \sin\alpha \qquad P_\perp = P \cos\alpha$$

Qui $\alpha$ è l'angolo tra il piano e il terreno. Se conosci l'altezza $h$ e la lunghezza $l$ del piano, $\sin\alpha = h / l$.

## Come si calcola a mano

```ad-example
Un corpo di 2 kg su un piano a 30°, con μs = 0,4 e μd = 0,3
Scomponi il peso, poi confronta la componente parallela con l'attrito statico massimo $\mu_s N$.

$$\begin{aligned}
P &= 2\ \text{kg} \cdot 9{,}8\ \text{m/s}^2 = 19{,}6\ \text{N} \\[6pt]
P_\parallel &= 19{,}6\ \text{N} \cdot \sin 30^\circ = 9{,}8\ \text{N} \\[6pt]
N = P_\perp &= 19{,}6\ \text{N} \cdot \cos 30^\circ \approx 16{,}97\ \text{N} \\[6pt]
\mu_s N &= 0{,}4 \cdot 16{,}97\ \text{N} \approx 6{,}79\ \text{N}
\end{aligned}$$

$9{,}8\ \text{N}$ è più di $6{,}79\ \text{N}$: il corpo scivola. Mentre scende agisce l'attrito dinamico:

$$\begin{aligned}
F_d &= 0{,}3 \cdot 16{,}97\ \text{N} \approx 5{,}09\ \text{N} \\[6pt]
a &= \frac{P_\parallel - F_d}{m} \approx \frac{4{,}71\ \text{N}}{2\ \text{kg}} \approx 2{,}35\ \text{m/s}^2
\end{aligned}$$
```

Se invece $P_\parallel$ è minore dell'attrito statico massimo, il corpo resta fermo: l'attrito statico vale esattamente $P_\parallel$, e l'accelerazione è zero.

```ad-error
Errori frequenti
- Scambiare seno e coseno: la componente lungo il piano va con il seno.
- Calcolare l'attrito con il peso intero, $\mu P$, invece che con la forza normale $\mu N$.
- Usare il coefficiente dinamico per decidere se il corpo parte: serve quello statico.
- Avere la calcolatrice in radianti con l'angolo in gradi.
```

## Domande frequenti

### Senza attrito l'accelerazione dipende dalla massa?

No: $a = g \sin\alpha$, perché la massa compare sia nella forza sia nel secondo principio e si semplifica. Un corpo leggero e uno pesante scendono insieme.

### Perché servono due coefficienti di attrito?

Il coefficiente statico $\mu_s$ dice quanto attrito c'è finché il corpo è fermo, quello dinamico $\mu_d$ quando scivola, ed è di solito più piccolo. Se il problema ne dà uno solo, lo strumento lo usa per entrambi.
