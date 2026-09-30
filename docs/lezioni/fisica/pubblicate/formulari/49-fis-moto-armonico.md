# Formulario: Il moto armonico

## Definizione

- Il moto della proiezione $Q$ su un diametro di un punto $P$ in moto circolare uniforme.
- Ampiezza $A = r$: distanza massima dal centro; l'escursione tra le estremità è $2A$.
- Periodo $T$ e frequenza $f = 1/T$ come nel moto circolare; pulsazione $\omega = 2\pi/T = 2\pi f$.

## Legge oraria

Partendo da $x = A$ all'istante $t = 0$:

$$x = A\cos(\omega t)$$

- $\omega t$ in radianti: calcolatrice in RAD.

| $t$ | $0$ | $T/4$ | $T/2$ | $3T/4$ | $T$ |
|---|---|---|---|---|---|
| $x$ | $A$ | $0$ | $-A$ | $0$ | $A$ |

## Velocità e accelerazione

$$v = -\omega A\sin(\omega t) \qquad a = -\omega^2 A\cos(\omega t) = -\omega^2 x$$

$$v_{max} = \omega A = \frac{2\pi A}{T} \qquad a_{max} = \omega^2 A = \frac{4\pi^2 A}{T^2}$$

| Dove si trova | Velocità | Accelerazione |
|---|---|---|
| Nel centro, $x = 0$ | massima, $\omega A$ | zero |
| In un'estremità, $x = \pm A$ | zero | massima, $\omega^2 A$, verso il centro |

- Da $v_{max}$ e $a_{max}$: $\omega = a_{max}/v_{max}$, $A = v_{max}/\omega$.

```ad-warning
L'ampiezza
È metà dell'escursione, non l'escursione intera.
```

```ad-warning
La calcolatrice in gradi
Con $\omega t$ in gradi il coseno viene quasi $1$: imposta i radianti.
```

```ad-warning
Nel centro
Velocità massima e accelerazione nulla; alle estremità il contrario.
```
