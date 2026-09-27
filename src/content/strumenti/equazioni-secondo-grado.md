# Equazioni di secondo grado

## Che cos'è un'equazione di secondo grado

Un'equazione di secondo grado si può scrivere nella forma normale $ax^2 + bx + c = 0$, con $a \neq 0$: $a$ è il coefficiente di $x^2$, $b$ quello di $x$, $c$ il termine noto. Ha al massimo due soluzioni reali, che si trovano con la formula risolutiva

$$x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}, \qquad \Delta = b^2 - 4ac.$$

Il discriminante $\Delta$ dice quante sono le soluzioni: se $\Delta > 0$ sono due e distinte, se $\Delta = 0$ sono due coincidenti, se $\Delta < 0$ non ci sono soluzioni reali.

## Come si risolve a mano

Prima porta l'equazione in forma normale: togli le parentesi, porta tutto a primo membro e riduci i termini simili. Se $a$ è negativo, moltiplica tutto per $-1$. Poi calcola $\Delta$ e applica la formula.

```ad-example
Esempio con soluzioni intere
In $x^2 - 5x + 6 = 0$ i coefficienti sono $a = 1$, $b = -5$, $c = 6$.
$\Delta = (-5)^2 - 4 \cdot 1 \cdot 6 = 25 - 24 = 1$.
$x_{1,2} = \dfrac{5 \pm 1}{2}$, quindi $x_1 = 2$ e $x_2 = 3$.
```

```ad-example
Esempio con un radicale
In $x^2 - 2x - 1 = 0$ il discriminante è $\Delta = 4 + 4 = 8$ e $\sqrt{8} = 2\sqrt{2}$.
$x_{1,2} = \dfrac{2 \pm 2\sqrt{2}}{2} = 1 \pm \sqrt{2}$, cioè $x_1 \approx -0{,}414$ e $x_2 \approx 2{,}414$.
```

Le equazioni incomplete si risolvono più in fretta senza formula. Se manca il termine con la $x$ ($b = 0$) l'equazione è pura: da $2x^2 - 8 = 0$ ricavi $x^2 = 4$, quindi $x = \pm 2$. Se manca il termine noto ($c = 0$) è spuria: in $x^2 - 3x = 0$ raccogli $x$, ottieni $x(x - 3) = 0$ e per la legge di annullamento del prodotto $x = 0$ oppure $x = 3$.

```ad-error
Errori frequenti
- Calcolare $b^2$ senza parentesi quando $b$ è negativo: $(-5)^2 = 25$, non $-25$.
- Semplificare solo un termine della frazione: in $\dfrac{2 \pm 2\sqrt{2}}{2}$ si divide per 2 sia il 2 sia il $2\sqrt{2}$.
- Nell'equazione pura, scrivere solo la soluzione positiva: $x^2 = 4$ ha due soluzioni, $2$ e $-2$.
```

## Domande frequenti

### Che cosa vuol dire che non ci sono soluzioni reali?

Che nessun numero reale soddisfa l'equazione, perché servirebbe la radice quadrata di un numero negativo. Si scrive $S = \emptyset$.

### Se $a = 0$ che cosa succede?

Manca il termine con $x^2$ e l'equazione è di primo grado: si risolve portando i termini e dividendo, senza discriminante.

### Posso scrivere i coefficienti con le frazioni?

Sì, frazioni come $2/3$ e decimali come $1{,}5$. Prima di calcolare $\Delta$ il calcolatore moltiplica tutto per il mcm dei denominatori, così lavora con numeri interi.
