# Equazioni di secondo grado

## Che cos'è un'equazione di secondo grado

Un'equazione di secondo grado è un'equazione in cui, dopo i calcoli, la $x$ compare anche al quadrato, come $x^2$.

Si può sempre scrivere nella forma normale:

$$ax^2 + bx + c = 0$$

I numeri $a$, $b$ e $c$ si chiamano coefficienti: $a$ è il numero davanti a $x^2$ e non può essere zero, $b$ quello davanti a $x$, $c$ il termine noto, il numero da solo.

Ha al massimo due soluzioni, cioè due numeri che, messi al posto della $x$, rendono vera l'uguaglianza.

## Un esempio svolto

```ad-example
Esempio: x² - 5x + 6 = 0
Individua i coefficienti:

$$a = 1 \qquad b = -5 \qquad c = 6$$

Calcola il discriminante, il numero che si indica con $\Delta$:

$$\Delta = b^2 - 4ac$$
$$= (-5)^2 - 4 \cdot 1 \cdot 6$$
$$= 25 - 24$$
$$= 1$$

Metti i coefficienti nella formula risolutiva:

$$x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a} = \dfrac{5 \pm 1}{2}$$

Con il segno meno trovi la prima soluzione, con il più la seconda:

$$x_1 = \dfrac{5 - 1}{2} = 2$$
$$x_2 = \dfrac{5 + 1}{2} = 3$$
```

## La regola generale

Prima porta l'equazione in forma normale: togli le parentesi, porta tutto a sinistra e somma i termini simili. Se $a$ è negativo, moltiplica tutto per $-1$.

Poi calcola il discriminante e applica la formula risolutiva:

$$\Delta = b^2 - 4ac$$
$$x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a}$$

Il segno del discriminante dice quante sono le soluzioni. Se $\Delta$ è positivo sono due, diverse. Se $\Delta$ è zero sono due uguali. Se $\Delta$ è negativo non ci sono soluzioni reali.

```ad-example
Esempio con un radicale: x² - 2x - 1 = 0
Il discriminante non è un quadrato perfetto:

$$\Delta = (-2)^2 - 4 \cdot 1 \cdot (-1) = 4 + 4 = 8$$

Semplifica la radice, portando fuori il quadrato $4$:

$$\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$$

Metti tutto nella formula e raccogli il $2$ al numeratore:

$$x_{1,2} = \dfrac{2 \pm 2\sqrt{2}}{2}$$
$$= \dfrac{2(1 \pm \sqrt{2})}{2}$$
$$= 1 \pm \sqrt{2}$$

Le soluzioni valgono circa $-0{,}414$ e $2{,}414$.
```

## Le equazioni incomplete

Quando manca un termine, l'equazione si risolve più in fretta, senza la formula.

Se manca il termine con la $x$, cioè $b = 0$, l'equazione si chiama pura. Porta il numero a destra ed estrai la radice, con il più e con il meno. Per esempio, da $2x^2 - 8 = 0$:

$$2x^2 = 8$$
$$x^2 = 4$$
$$x = \pm 2$$

Se manca il termine noto, cioè $c = 0$, l'equazione si chiama spuria. Raccogli la $x$ e usa la legge di annullamento del prodotto: un prodotto è zero quando almeno un fattore è zero. Per esempio:

$$x^2 - 3x = 0$$
$$x(x - 3) = 0$$
$$x = 0 \quad \text{oppure} \quad x = 3$$

```ad-error
Errori frequenti
- Calcolare $b^2$ senza parentesi quando $b$ è negativo: $(-5)^2 = 25$, non $-25$.
- Semplificare solo un termine della frazione. In $\dfrac{2 \pm 2\sqrt{2}}{2}$ si divide per $2$ sia il $2$ sia il $2\sqrt{2}$.
- Nell'equazione pura, scrivere solo la soluzione positiva: $x^2 = 4$ ha due soluzioni, $2$ e $-2$.
```

## Domande frequenti

### Che cosa vuol dire che non ci sono soluzioni reali?

Che nessun numero reale rende vera l'uguaglianza, perché servirebbe la radice quadrata di un numero negativo. Si scrive $S = \emptyset$.

### Se $a = 0$ che cosa succede?

Manca il termine con $x^2$ e l'equazione è di primo grado. Si risolve portando i termini e dividendo, senza discriminante.

### Posso scrivere i coefficienti con le frazioni?

Sì, frazioni come $2/3$ e decimali come $1{,}5$. Prima di calcolare $\Delta$ il calcolatore moltiplica tutto per il mcm dei denominatori, così lavora con numeri interi.
