# Regola di Ruffini

## Che cos'è la regola di Ruffini

La regola di Ruffini è un modo veloce per dividere un polinomio $P(x)$ per un binomio della forma $x - a$. Invece di dividere i termini, si lavora solo con i coefficienti, i numeri davanti alle potenze di $x$.

Il numero $a$ si legge dal divisore: per $x - 3$ è $3$, per $x + 2$ è $-2$, perché $x + 2 = x - (-2)$.

## Come si calcola a mano

Si scrivono in riga i coefficienti di $P(x)$, dal grado più alto, con uno zero al posto di ogni potenza che manca. Il numero $a$ va a sinistra. Poi:

1. abbassa il primo coefficiente;
2. moltiplicalo per $a$ e scrivi il prodotto sotto il coefficiente successivo;
3. somma la colonna, e ripeti fino all'ultima.

L'ultima somma è il resto. Le altre sono i coefficienti del quoziente, che ha grado di uno più basso.

```ad-example
Esempio: (2x³ - 7x² + 5) : (x - 3)
Manca il termine in $x$: il suo coefficiente è $0$. Con $a = 3$ lo schema è:

$$\begin{array}{c|ccc|c}
 & 2 & -7 & 0 & 5 \\
3 & & 6 & -3 & -9 \\
\hline
 & 2 & -1 & -3 & -4
\end{array}$$

Il quoziente è $Q(x) = 2x^2 - x - 3$ e il resto è $R = -4$.
```

C'è un controllo veloce, il teorema del resto: il resto è uguale al valore del polinomio in $a$.

```ad-example
Verifica con il teorema del resto
Sostituisci $3$ al posto della $x$:

$$\begin{aligned}
P(3) &= 2 \cdot 3^3 - 7 \cdot 3^2 + 5 \\[6pt]
&= 54 - 63 + 5 \\[6pt]
&= -4
\end{aligned}$$
```

Se il resto è zero, $x - a$ divide $P(x)$ e si può scrivere $P(x) = (x - a) \cdot Q(x)$. È il passo che si usa per scomporre i polinomi.

```ad-error
Errori frequenti
- Saltare lo zero al posto di una potenza che manca.
- Prendere $a$ con il segno sbagliato: per $x + 2$ si scrive $-2$.
- Sottrarre al posto di sommare nelle colonne.
```

## Domande frequenti

### E se il divisore è 2x - 1?

La regola vale per $x - a$. Con $2x - 1$ puoi dividere per $x - \frac{1}{2}$ e poi dividere il quoziente per $2$, oppure usare la divisione in colonna.

### A cosa serve il teorema del resto?

A sapere se un polinomio è divisibile per $x - a$ senza fare la divisione: basta che $P(a)$ sia zero.
