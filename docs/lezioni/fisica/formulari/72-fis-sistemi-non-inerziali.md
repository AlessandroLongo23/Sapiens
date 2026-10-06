# Formulario: Sistemi di riferimento inerziali e non inerziali

## Sistemi inerziali

- Sistema inerziale: un corpo libero (forza totale nulla) ha velocità costante. Vale il primo principio.
- Ogni sistema in moto rettilineo uniforme rispetto a un sistema inerziale è inerziale.
- Il suolo è inerziale con ottima approssimazione: la rotazione della Terra dà $a_c \approx 0{,}034\,\text{m/s}^2$ all'equatore, circa lo $0{,}3\%$ di $g$.

## Sistemi non inerziali

Hanno un'accelerazione $\vec A$ rispetto a un sistema inerziale: partono, frenano, curvano o ruotano. Un corpo libero, visto da lì, accelera:

$$\vec a\,' = -\vec A$$

Sull'autobus che frena con accelerazione di modulo $A$, un corpo libero che parte da fermo rispetto all'autobus percorre

$$\Delta s\,' = \tfrac{1}{2}A\,t^2 \qquad t = \sqrt{\frac{2\,\Delta s\,'}{A}} \qquad v' = A\,t$$

## Il pendolo nel veicolo che accelera

Visto dal sistema inerziale: $T\cos\theta = m\,g$ e $T\sin\theta = m\,A$.

$$\tan\theta = \frac{A}{g} \qquad A = g\tan\theta \qquad T = m\sqrt{g^2 + A^2}$$

Il filo pende dalla parte opposta ad $\vec A$. Con $A = 0$ è verticale, a qualunque velocità.

## La caduta in ascensore

| Accelerazione dell'ascensore | Accelerazione di caduta rispetto all'ascensore | Tempo di caduta da $h$ |
|---|---|---|
| nulla | $g$ | $\sqrt{2h/g}$ |
| $A$ verso l'alto | $g + A$ | $\sqrt{2h/(g + A)}$ |
| $A$ verso il basso | $g - A$ | $\sqrt{2h/(g - A)}$ |
| $g$ verso il basso | $0$ | il corpo resta sospeso |

## Inerziale o no

| | Sistema inerziale | Sistema non inerziale |
|---|---|---|
| Moto rispetto a un sistema inerziale | fermo o rettilineo uniforme | accelerato |
| Corpo libero | velocità costante | $\vec a\,' = -\vec A$ |
| Primo e secondo principio | valgono | non valgono con le sole forze vere |

```ad-warning
Inerziale non vuol dire fermo
Conta che la velocità del sistema sia costante in modulo e in direzione, non che sia nulla.
```

```ad-warning
In frenata nessuna forza spinge in avanti
Il corpo continua con la velocità che aveva: è il veicolo che rallenta.
```

```ad-warning
Conta l'accelerazione, non il verso del moto
Un ascensore che sale frenando ha l'accelerazione verso il basso, come uno che parte in discesa.
```
