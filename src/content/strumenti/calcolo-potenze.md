# Calcolo delle potenze

## Che cos'è una potenza

Una potenza è una moltiplicazione ripetuta: $a^n$ vuol dire moltiplicare la base $a$ per sé stessa $n$ volte. Per esempio $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$. Il numero in basso è la base, quello in alto l'esponente.

Quando la base è una frazione, si elevano sia il numeratore sia il denominatore:

$$\left(\frac{2}{3}\right)^3 = \frac{2^3}{3^3} = \frac{8}{27}$$

## Come si calcola a mano

Con un esponente positivo basta moltiplicare. Per gli esponenti zero e negativi valgono due regole:

- ogni numero diverso da zero elevato a zero dà 1: $a^0 = 1$;
- un esponente negativo vuol dire fare il reciproco della base e cambiare segno all'esponente: $a^{-n} = \left(\dfrac{1}{a}\right)^n$.

```ad-example
Esempio: esponente negativo
$\left(\dfrac{2}{3}\right)^{-2} = \left(\dfrac{3}{2}\right)^2 = \dfrac{9}{4} = 2{,}25$.
Con una base intera: $5^{-2} = \left(\dfrac{1}{5}\right)^2 = \dfrac{1}{25} = 0{,}04$.
```

```ad-example
Esempio: base negativa
$(-3)^4 = 81$, perché i quattro segni meno si accoppiano. $(-3)^3 = -27$, perché un segno meno resta spaiato.
```

Con una base decimale conviene scriverla come frazione: $1{,}5 = \dfrac{3}{2}$, quindi $1{,}5^2 = \dfrac{9}{4} = 2{,}25$.

```ad-error
Errori frequenti
- Moltiplicare base ed esponente: $2^3$ fa 8, non 6.
- Pensare che un esponente negativo renda negativo il risultato: $2^{-3} = \dfrac{1}{8}$, che è positivo.
- Confondere $(-2)^4 = 16$ con $-2^4 = -16$: senza parentesi l'esponente riguarda solo il 2.
- Scrivere $a^0 = 0$: il risultato è 1.
```

## Domande frequenti

### Perché un numero elevato a zero fa 1?

Per la proprietà del quoziente di potenze: $a^n : a^n = a^{n-n} = a^0$, e un numero diviso per sé stesso fa 1.

### Quanto fa 0 elevato a 0?

Non ha significato. La regola $a^0 = 1$ nasce da una divisione per $a$, e per zero non si divide. Per lo stesso motivo non ha significato 0 elevato a un esponente negativo, che vorrebbe dire fare il reciproco di zero.
