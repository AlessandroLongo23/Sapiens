# Formulario: Espressioni con polinomi

## L'ordine delle operazioni

1. Parentesi più interne per prime: tonde, poi quadre, poi graffe.
2. Dentro ogni parentesi, e poi fuori, le potenze, con i prodotti notevoli quando ci sono.
3. Prodotti e divisioni per un monomio, da sinistra verso destra.
4. Somme algebriche: togli le parentesi (con un meno davanti cambi il segno di ogni termine) e somma i termini simili.
5. Ordina il risultato secondo le potenze decrescenti di una lettera.

Lo sviluppo di un prodotto o di una potenza resta tra parentesi finché non tocca a lui:

$$
\begin{aligned}
&-(x + 2)(x - 2) \\
&= -(x^2 - 4) = -x^2 + 4 \\[6pt]
&2(x + 3)^2 = 2(x^2 + 6x + 9) \\
&= 2x^2 + 12x + 18
\end{aligned}
$$

## Riconoscere un prodotto notevole

Somma per differenza: il termine con lo stesso segno nei due fattori è $a$, quello con i segni opposti è $b$, e il prodotto vale $a^2 - b^2$.

$$(3x + y)(y - 3x) = y^2 - 9x^2$$

Quadrato di un binomio opposto e prodotto di due fattori opposti:

$$
\begin{gathered}
(-x - 3)^2 = (x + 3)^2 \\
(2x - 1)(1 - 2x) = -(2x - 1)^2
\end{gathered}
$$

Con tre fattori si comincia dalla coppia che forma un prodotto notevole:

$$
\begin{aligned}
&(x - 2)(x + 3)(x + 2) \\
&= (x^2 - 4)(x + 3)
\end{aligned}
$$

Un binomio può fare da termine:

$$(x + y - 3)(x + y + 3) = (x + y)^2 - 9$$

## Il controllo con il valore numerico

1. Scegli un valore per ogni lettera: piccolo, non $0$ né $1$, che non annulli un fattore o un divisore.
2. Calcola l'espressione di partenza.
3. Calcola il risultato.
4. Se i due numeri sono diversi c'è un errore; se sono uguali, il risultato con buona probabilità è giusto.

Il termine noto del risultato è il valore dell'espressione per $x = 0$.

```ad-warning
Il meno davanti a un prodotto
$-(x + 2)(x - 2) = -x^2 + 4$, non $-x^2 - 4$.
```

```ad-warning
Il numero davanti a una potenza
$2(x + 3)^2 = 2x^2 + 12x + 18$, non $(2x + 6)^2$.
```

```ad-warning
Dividere solo il primo termine
$(6x^2y - 4xy^2) : (2xy) = 3x - 2y$: il monomio divide ogni termine.
```
