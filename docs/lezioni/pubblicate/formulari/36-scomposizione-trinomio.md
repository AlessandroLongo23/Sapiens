# Formulario: Trinomio di secondo grado

## Il trinomio $x^2 + sx + p$

Se due numeri $m$ e $n$ hanno somma $s$ e prodotto $p$:

$$x^2 + sx + p = (x + m)(x + n)$$

Viene da $(x + m)(x + n) = x^2 + (m + n)x + mn$. Esempio: $x^2 + 7x + 12 = (x + 3)(x + 4)$.

| Termine noto $p$ | Coefficiente $s$ | I due numeri |
|---|---|---|
| positivo | positivo | tutti e due positivi |
| positivo | negativo | tutti e due negativi |
| negativo | positivo o negativo | di segno opposto: quello con il valore assoluto maggiore ha il segno di $s$ |

1. Dai segni di $p$ e $s$ decidi i segni dei due numeri.
2. Scrivi le coppie con prodotto $|p|$, partendo da $1 \cdot |p|$.
3. Cerca la coppia con somma $s$.
4. Scrivi $(x + m)(x + n)$ e controlla moltiplicando.

Prima raccogli un fattore comune o il segno meno: $-x^2 + x + 6 = -(x^2 - x - 6) = -(x - 3)(x + 2)$.

Se nessuna coppia di interi funziona, il trinomio è irriducibile: $x^2 + 4x + 2$, $x^2 + x + 1$.

## Il trinomio $ax^2 + bx + c$ con $a$ diverso da 1

1. Raccogli un eventuale fattore comune.
2. Cerca due numeri $m$ e $n$ con somma $b$ e prodotto $a \cdot c$.
3. Spezza $bx$ in $mx + nx$.
4. Raccogli a gruppi, poi raccogli il binomio comune.

$$
\begin{aligned}
2x^2 + 7x + 3 &= 2x^2 + x + 6x + 3 \\
&= x(2x + 1) + 3(2x + 1) \\
&= (2x + 1)(x + 3)
\end{aligned}
$$

## Trinomi in due lettere

Si lavora sui coefficienti e si aggiunge la seconda lettera a ogni numero:

$$x^2 + 5xy + 6y^2 = (x + 2y)(x + 3y)$$

## Trinomi del tipo $x^4 + sx^2 + p$

Con $x^2$ al posto di $x$:

$$x^4 + sx^2 + p = (x^2 + m)(x^2 + n)$$

Poi si scompongono ancora i fattori: $x^4 - 5x^2 + 4 = (x^2 - 1)(x^2 - 4) = (x - 1)(x + 1)(x - 2)(x + 2)$.

Vale anche con $x^3$: $x^6 - 7x^3 - 8 = (x^3 - 8)(x^3 + 1)$.

```ad-warning
Il segno del numero più grande
$x^2 - x - 20 = (x - 5)(x + 4)$, non $(x + 5)(x - 4)$: con $p$ negativo il numero più grande in valore assoluto ha il segno di $s$.
```

```ad-warning
Con a diverso da 1 i numeri non vanno nelle parentesi
$2x^2 + 7x + 3$ non è $(x + 1)(x + 6)$: i numeri $1$ e $6$ servono a spezzare $7x$.
```

```ad-warning
Fermarsi al primo passo
$(x^2 - 1)(x^2 - 4)$ non è la scomposizione completa di $x^4 - 5x^2 + 4$: i fattori si scompongono ancora.
```
