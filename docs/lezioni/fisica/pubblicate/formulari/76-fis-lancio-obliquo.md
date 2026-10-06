# Formulario: Il lancio obliquo e la gittata

## Componenti della velocità iniziale

Velocità $v_0$, angolo di lancio $\alpha$ sull'orizzontale; origine nel punto di lancio, $y$ verso l'alto.

$$v_{0x} = v_0\cos\alpha \qquad v_{0y} = v_0\sin\alpha$$

## Leggi del moto

Moto uniforme lungo $x$, uniformemente accelerato lungo $y$ con accelerazione $-g$.

$$x = v_{0x}\,t \qquad y = v_{0y}\,t - \tfrac{1}{2}\,g\,t^2$$

$$v_x = v_{0x} \qquad v_y = v_{0y} - g\,t \qquad v = \sqrt{v_x^2 + v_y^2}$$

## Traiettoria

Una parabola per l'origine, con la concavità verso il basso:

$$y = x\tan\alpha - \frac{g}{2\,v_0^2\cos^2\alpha}\,x^2$$

## Lancio che ricade alla quota di partenza

| Grandezza | Formula |
|---|---|
| Tempo di salita | $t_s = \dfrac{v_{0y}}{g}$ |
| Altezza massima | $h_{max} = \dfrac{v_{0y}^2}{2\,g} = \dfrac{v_0^2\sin^2\alpha}{2\,g}$ |
| Tempo di volo | $t_v = \dfrac{2\,v_{0y}}{g} = 2\,t_s$ |
| Gittata | $L = v_{0x}\,t_v = \dfrac{2\,v_0^2\sin\alpha\cos\alpha}{g} = \dfrac{v_0^2\sin 2\alpha}{g}$ |
| Gittata massima, a $\alpha = 45^\circ$ | $L_{max} = \dfrac{v_0^2}{g}$ |
| Velocità dalla gittata | $v_0 = \sqrt{\dfrac{g\,L}{\sin 2\alpha}}$ |

- Nel punto più alto $v_y = 0$ e $v = v_{0x}$.
- Due angoli complementari ($30^\circ$ e $60^\circ$) danno la stessa gittata.
- All'arrivo $v = v_0$, inclinata di $\alpha$ sotto l'orizzontale.

## Lancio da una quota h

$$y = h + v_{0y}\,t - \tfrac{1}{2}\,g\,t^2$$

1. Calcola $v_{0x}$ e $v_{0y}$ (negativa se il lancio è verso il basso).
2. Tempo di volo: $t_v = \dfrac{v_{0y} + \sqrt{v_{0y}^2 + 2\,g\,h}}{g}$.
3. Gittata: $L = v_{0x}\,t_v$.
4. Velocità all'arrivo: $v = \sqrt{v_0^2 + 2\,g\,h}$.

```ad-warning
In cima la velocità non è zero
Si annulla solo $v_y$: resta la componente orizzontale $v_{0x}$.
```

```ad-warning
Seno dell'angolo doppio
$\sin 2\alpha$ non è $2\sin\alpha$: prima si raddoppia l'angolo, poi si calcola il seno.
```

```ad-warning
Formule valide alla stessa quota
$L = v_0^2\sin 2\alpha/g$ e $t_v = 2\,v_{0y}/g$ non valgono se il corpo parte da una quota diversa da quella di arrivo.
```
