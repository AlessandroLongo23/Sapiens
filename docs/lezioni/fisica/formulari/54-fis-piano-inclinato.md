# Formulario: Il moto lungo un piano inclinato

## Piano liscio

Accelerazione lungo il piano, verso il basso, indipendente dalla massa:

$$a = g\sin\alpha$$

- Controllo: $\alpha = 0^\circ$ dà $a = 0$, $\alpha = 90^\circ$ dà $a = g$.

## Discesa da fermo

Piano lungo $l$, asse lungo il piano con il verso positivo in discesa:

$$t = \sqrt{\frac{2\,l}{a}} \qquad v = \sqrt{2\,a\,l}$$

- Sul piano liscio, con l'altezza $h = l\sin\alpha$: $v = \sqrt{2\,g\,h}$, come in caduta libera.

## Discesa con l'attrito

- Attrito dinamico, verso l'alto: $F_d = \mu_d\,m\,g\cos\alpha$.

$$a = g\,(\sin\alpha - \mu_d\cos\alpha)$$

| Inclinazione | Il corpo che scende |
|---|---|
| $\tan\alpha > \mu_d$ | accelera |
| $\tan\alpha = \mu_d$ | scende a velocità costante |
| $\tan\alpha < \mu_d$ | rallenta e si ferma |

- Da fermo parte solo se $\tan\alpha > \mu_s$.

## Il corpo lanciato in salita

- Piano liscio: accelerazione $g\sin\alpha$ verso il basso, si ferma dopo

$$t = \frac{v_0}{g\sin\alpha} \qquad d = \frac{v_0^2}{2\,g\sin\alpha}$$

- Con l'attrito, in salita: $|a| = g\,(\sin\alpha + \mu_d\cos\alpha)$ e $d = v_0^2 / (2\,|a|)$.
- Fermo in cima: resta se $\tan\alpha \le \mu_s$, altrimenti riscende con $g\,(\sin\alpha - \mu_d\cos\alpha)$.

```ad-warning
Il coseno al posto del seno
L'accelerazione lungo il piano è $g\sin\alpha$, non $g\cos\alpha$.
```

```ad-warning
La forza premente
Nell'attrito va $m\,g\cos\alpha$, non $m\,g$: $g\,(\sin\alpha - \mu_d\cos\alpha)$.
```

```ad-warning
L'attrito in salita
L'attrito è opposto alla velocità: in salita si somma alla componente del peso.
```
