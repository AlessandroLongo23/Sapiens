# Calcolo delle potenze

## Che cos'è una potenza

Una potenza è una moltiplicazione ripetuta di un numero per sé stesso.

Il numero che si moltiplica si chiama base, il numero piccolo in alto si chiama esponente e dice quante volte la base compare. Per esempio, in $2^5$ la base è 2 e l'esponente è 5:

$$2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2$$
$$= 32$$

## Come si calcola a mano

Con un esponente positivo basta moltiplicare la base per sé stessa, un fattore alla volta. Quando la base è una frazione, si elevano il numeratore e il denominatore:

$$\left(\frac{2}{3}\right)^3 = \frac{2^3}{3^3}$$
$$= \frac{8}{27}$$

```ad-example
Esempio: esponente negativo
Calcola $\left(\dfrac{2}{3}\right)^{-2}$. L'esponente è negativo: fai il reciproco della base, cioè scambia numeratore e denominatore, e togli il meno all'esponente.

$$\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2$$

Poi eleva il numeratore e il denominatore:

$$\left(\dfrac{3}{2}\right)^2 = \dfrac{9}{4}$$
$$= 2{,}25$$

Con una base intera il reciproco di 5 è $\dfrac{1}{5}$:

$$5^{-2} = \left(\dfrac{1}{5}\right)^2$$
$$= \dfrac{1}{25} = 0{,}04$$
```

La regola generale per gli esponenti negativi: fai il reciproco della base e cambia segno all'esponente.

$$a^{-n} = \left(\dfrac{1}{a}\right)^n$$

Per l'esponente zero c'è un'altra regola: ogni numero diverso da zero elevato a zero dà 1.

$$a^0 = 1$$

```ad-example
Esempio: base negativa
Con l'esponente pari i segni meno si accoppiano a due a due, e il risultato è positivo:

$$(-3)^4 = (-3) \cdot (-3) \cdot (-3) \cdot (-3)$$
$$= 81$$

Con l'esponente dispari resta un segno meno spaiato, e il risultato è negativo:

$$(-3)^3 = -27$$
```

Con una base decimale conviene scriverla come frazione, poi procedere come con le frazioni:

$$1{,}5^2 = \left(\dfrac{3}{2}\right)^2$$
$$= \dfrac{9}{4} = 2{,}25$$

```ad-error
Errori frequenti
- Moltiplicare base ed esponente: $2^3$ fa 8, non 6.
- Pensare che un esponente negativo renda negativo il risultato: $2^{-3} = \dfrac{1}{8}$, che è positivo.
- Confondere $(-2)^4 = 16$ con $-2^4 = -16$: senza parentesi l'esponente riguarda solo il 2.
- Scrivere $a^0 = 0$: il risultato è 1.
```

## Domande frequenti

### Perché un numero elevato a zero fa 1?

Per la proprietà del quoziente di potenze: dividendo una potenza per sé stessa, gli esponenti si sottraggono.

$$a^n : a^n = a^{n-n} = a^0$$

Un numero diviso per sé stesso fa 1, quindi anche $a^0$ fa 1.

### Quanto fa 0 elevato a 0?

Non ha significato. La regola $a^0 = 1$ nasce da una divisione per $a$, e per zero non si divide.

Per lo stesso motivo non ha significato 0 elevato a un esponente negativo, che vorrebbe dire fare il reciproco di zero.
