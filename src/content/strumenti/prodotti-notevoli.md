# Prodotti notevoli

## Che cosa sono i prodotti notevoli

I prodotti notevoli sono moltiplicazioni tra polinomi che tornano così spesso da avere una regola pronta: si scrive subito il risultato, senza moltiplicare ogni termine per ogni termine.

Un binomio è un polinomio con due termini, come $2x - 3$. I termini sono monomi: un numero, una potenza di $x$, o un numero per una potenza di $x$.

## Come si calcola a mano

Si riconosce la forma, si individuano i termini e si applica la regola.

```ad-example
Esempio: (2x - 3)²
È il quadrato di un binomio con $a = 2x$ e $b = 3$. La regola è:

$$(a - b)^2 = a^2 - 2ab + b^2$$

Calcola le tre parti, una alla volta:

$$\begin{aligned}
a^2 &= (2x)^2 = 4x^2 \\[6pt]
-2ab &= -2 \cdot 2x \cdot 3 = -12x \\[6pt]
b^2 &= 3^2 = 9
\end{aligned}$$

Poi sommale: $(2x - 3)^2 = 4x^2 - 12x + 9$.
```

Le regole da ricordare sono quattro:

$$\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\[6pt]
(a + b)(a - b) &= a^2 - b^2 \\[6pt]
(a + b)^3 &= a^3 + 3a^2b + 3ab^2 + b^3 \\[6pt]
(a + b + c)^2 &= a^2 + b^2 + c^2 + 2ab + 2ac + 2bc
\end{aligned}$$

Nel quadrato del trinomio ogni termine si prende con il suo segno: in $(x^2 + x - 1)^2$ il terzo termine è $-1$, e i doppi prodotti in cui compare diventano negativi.

```ad-example
Esempio: (x + 5)(x - 5)
Le due parentesi hanno un termine uguale, $x$, e uno opposto, $5$ e $-5$. È una somma per una differenza:

$$(x + 5)(x - 5) = x^2 - 25$$
```

```ad-error
Errori frequenti
- Scrivere $(x + 3)^2 = x^2 + 9$: manca il doppio prodotto $6x$.
- Dimenticare la parentesi nel quadrato del primo termine: $(2x)^2$ è $4x^2$, non $2x^2$.
- Sbagliare il segno del doppio prodotto: in $(a - b)^2$ è negativo, il quadrato del secondo termine invece è sempre positivo.
```

## Domande frequenti

### Come faccio a riconoscere una somma per differenza?

Le due parentesi hanno gli stessi termini, ma uno dei due cambia segno: $(3x + 2)(3x - 2)$. Il risultato è il quadrato del termine uguale meno il quadrato di quello che cambia: $9x^2 - 4$.

### E se l'esponente è 4 o più alto?

Servono i coefficienti del triangolo di Tartaglia. Questo strumento sviluppa quadrati e cubi; per $(x + 1)^4$ puoi scriverlo come $(x + 1)^2 \cdot (x + 1)^2$ e sviluppare i due quadrati.
