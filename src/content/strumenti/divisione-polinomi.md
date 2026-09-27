# Divisione tra polinomi

## Che cos'è la divisione tra polinomi

Dividere un polinomio $A(x)$, il dividendo, per un polinomio $B(x)$, il divisore, vuol dire trovare due polinomi: il quoziente $Q(x)$ e il resto $R(x)$. Devono rispettare questa uguaglianza, con il resto di grado più basso del divisore:

$$A(x) = B(x) \cdot Q(x) + R(x)$$

Il grado di un polinomio è l'esponente più alto della $x$. Se il resto è zero, $A(x)$ è divisibile per $B(x)$.

## Come si calcola a mano

Si ordinano i due polinomi dal grado più alto al più basso. Nel dividendo, al posto delle potenze che mancano, si lascia uno spazio o si scrive uno zero. Poi si ripetono sempre gli stessi tre passi:

1. dividi il primo termine del dividendo per il primo termine del divisore: è un termine del quoziente;
2. moltiplica quel termine per tutto il divisore;
3. sottrai il prodotto dal dividendo: ottieni un resto parziale, e ricominci da lì.

Ti fermi quando il resto ha grado minore del divisore.

```ad-example
Esempio: (6x³ - 5x² + 4) : (2x - 3)
Primo giro: $6x^3 : 2x = 3x^2$. Moltiplica e sottrai:

$$\begin{aligned}
3x^2(2x - 3) &= 6x^3 - 9x^2 \\[6pt]
6x^3 - 5x^2 + 4 - (6x^3 - 9x^2) &= 4x^2 + 4
\end{aligned}$$

Secondo giro: $4x^2 : 2x = 2x$, e il nuovo resto è $6x + 4$. Terzo giro: $6x : 2x = 3$, e resta $13$.

Il quoziente è $Q(x) = 3x^2 + 2x + 3$, il resto è $R = 13$.
```

Per controllare, moltiplica divisore e quoziente e aggiungi il resto: devi ritrovare il dividendo.

```ad-error
Errori frequenti
- Dimenticare le potenze mancanti: in $6x^3 - 5x^2 + 4$ manca il termine in $x$, e le colonne si spostano.
- Sottrarre solo il primo termine del prodotto: si sottrae tutto il prodotto, cambiando il segno a ogni termine.
- Continuare quando il resto ha già grado più basso del divisore.
```

## Domande frequenti

### Quando posso usare la regola di Ruffini?

Quando il divisore è un binomio della forma $x - a$, come $x - 2$ o $x + 3$. Lo schema di Ruffini dà lo stesso quoziente e lo stesso resto con meno calcoli.

### I coefficienti del quoziente possono essere frazioni?

Sì. Se il primo coefficiente del divisore non divide quelli del dividendo, nel quoziente compaiono frazioni: $(x^3 - 1) : 2x$ dà $\frac{1}{2}x^2$ con resto $-1$.
