# Espressioni con monomi

Un'espressione con monomi è una catena di operazioni tra monomi (somme, prodotti, quozienti, potenze), spesso con parentesi, da ridurre a un risultato il più semplice possibile. Le singole operazioni sono quelle della lezione sulle [operazioni tra monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/operazioni-tra-monomi); qui conta l'ordine in cui farle, che è lo stesso delle espressioni con i numeri.

## L'ordine delle operazioni

1. Si parte dalle parentesi più interne: prima le tonde, poi le quadre, poi le graffe. Quando una parentesi contiene un solo monomio, la tieni finché serve (per esempio per applicare una potenza) e poi la togli.
2. Dentro ogni parentesi, e poi fuori, si calcolano prima le potenze.
3. Poi i prodotti e i quozienti, nell'ordine in cui compaiono, da sinistra verso destra.
4. Per ultime le somme algebriche, riducendo i monomi simili.

```ad-warning
Fare un prodotto prima del quoziente che lo precede
Prodotti e quozienti si fanno nell'ordine in cui compaiono, da sinistra verso destra:

$$12x^5 : 3x^2 \cdot 2x = 4x^3 \cdot 2x = 8x^4$$

Se calcoli prima $3x^2 \cdot 2x = 6x^3$ ottieni $12x^5 : 6x^3 = 2x^2$, che è sbagliato.
```

Alla fine il risultato è un monomio se tutti i termini rimasti sono simili. Se restano monomi non simili, il risultato è un polinomio e si lascia così: le espressioni di quel tipo sono nella lezione sulle [espressioni con polinomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/espressioni-con-polinomi).

## Esempi svolti

```ad-example
Esempio 1: prima il prodotto, poi la somma
$$3a^2b \cdot (-2ab) + 4a^3b^2$$

Il prodotto viene prima della somma:

$$3a^2b \cdot (-2ab) = -6a^3b^2$$

I due termini rimasti sono simili:

$$-6a^3b^2 + 4a^3b^2 = -2a^3b^2$$
```

```ad-warning
Sommare prima di moltiplicare
In $2x + 3x \cdot x$ il prodotto viene prima: $2x + 3x^2$, che non si riduce ulteriormente. Scrivere $5x \cdot x = 5x^2$ vuol dire aver sommato prima del prodotto.
```

```ad-example
Esempio 2: potenza, quoziente e somma
$$(-2x^2y)^3 : (4x^3y^2) - \frac{1}{2}x^3y$$

Prima la potenza. L'esponente è dispari, quindi il segno resta negativo:

$$(-2x^2y)^3 = -8x^6y^3$$

Poi il quoziente:

$$-8x^6y^3 : (4x^3y^2) = -2x^3y$$

Infine la somma di monomi simili:

$$
\begin{aligned}
-2x^3y - \frac{1}{2}x^3y &= \left(-\frac{4}{2} - \frac{1}{2}\right)x^3y \\
&= -\frac{5}{2}x^3y
\end{aligned}
$$
```

```ad-warning
Dimenticare di elevare il coefficiente
$(2x^3)^2 = 4x^6$: si eleva al quadrato anche il $2$. Non è $2x^6$, e non è nemmeno $4x^5$, perché l'esponente $3$ si moltiplica per $2$, non si somma.
```

```ad-example
Esempio 3: una parentesi quadra
$$
\begin{aligned}
&\left[2x^2 \cdot (-3xy)^2 - 5x^4y^2\right] \\
&\quad : \left(-\frac{13}{2}x^2y\right)
\end{aligned}
$$

Dentro la quadra si comincia dalla potenza. L'esponente è pari, quindi il segno diventa positivo:

$$(-3xy)^2 = 9x^2y^2$$

Poi il prodotto e la somma, sempre dentro la quadra:

$$
\begin{aligned}
&2x^2 \cdot 9x^2y^2 - 5x^4y^2 \\
&= 18x^4y^2 - 5x^4y^2 \\
&= 13x^4y^2
\end{aligned}
$$

Resta il quoziente. Dividere per $-\frac{13}{2}$ equivale a moltiplicare per $-\frac{2}{13}$:

$$
\begin{aligned}
&13x^4y^2 : \left(-\frac{13}{2}x^2y\right) \\
&= 13 \cdot \left(-\frac{2}{13}\right)x^{4-2}y^{2-1} \\
&= -2x^2y
\end{aligned}
$$
```

```ad-warning
Il segno meno fuori dalla potenza
$(-2a)^2 = 4a^2$, perché il meno è dentro la parentesi e viene elevato al quadrato. In $-(2a)^2 = -4a^2$ invece il meno è fuori dalla parentesi e il risultato resta negativo; in $-2a^2$ al quadrato va solo la $a$.
```

```ad-example
Esempio 4: tonde, quadre e graffe
$$
\begin{aligned}
&\Bigg\{\left[\left(\frac{1}{2}a^2b - a^2b\right)^2 : \left(\frac{1}{4}a^3\right) \right. \\
&\qquad \left. - \frac{3}{2}ab^2\right] \cdot (-2a^2b) \\
&\quad + \left(\frac{2}{3}ab\right)^2 \cdot 9ab\Bigg\} : (-3a^3b^2)
\end{aligned}
$$

La parentesi tonda più interna contiene una somma di monomi simili:

$$\frac{1}{2}a^2b - a^2b = -\frac{1}{2}a^2b$$

Nella quadra ora c'è $\left(-\frac{1}{2}a^2b\right)^2 : \left(\frac{1}{4}a^3\right) - \frac{3}{2}ab^2$. Prima la potenza, poi il quoziente, poi la somma:

$$
\begin{gathered}
\left(-\frac{1}{2}a^2b\right)^2 = \frac{1}{4}a^4b^2 \\
\frac{1}{4}a^4b^2 : \left(\frac{1}{4}a^3\right) = ab^2 \\
ab^2 - \frac{3}{2}ab^2 = -\frac{1}{2}ab^2
\end{gathered}
$$

Nella graffa ora c'è $\left(-\frac{1}{2}ab^2\right) \cdot (-2a^2b) + \left(\frac{2}{3}ab\right)^2 \cdot 9ab$. Il primo termine è un prodotto; nel secondo viene prima la potenza, poi il prodotto:

$$
\begin{gathered}
\left(-\frac{1}{2}ab^2\right) \cdot (-2a^2b) = a^3b^3 \\
\left(\frac{2}{3}ab\right)^2 \cdot 9ab = \frac{4}{9}a^2b^2 \cdot 9ab \\
= 4a^3b^3
\end{gathered}
$$

I due termini sono simili, quindi la graffa vale $a^3b^3 + 4a^3b^3 = 5a^3b^3$. Resta l'ultimo quoziente:

$$5a^3b^3 : (-3a^3b^2) = -\frac{5}{3}b$$

La $a$ sparisce, perché ha lo stesso esponente nel dividendo e nel divisore.
```
