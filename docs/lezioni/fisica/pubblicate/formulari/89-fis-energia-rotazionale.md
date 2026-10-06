# Formulario: L'energia cinetica di rotazione e il rotolamento

## Energia cinetica di rotazione

$$K_{rot} = \frac{1}{2} I\,\omega^2$$

$I$ in $\text{kg}\cdot\text{m}^2$, $\omega$ in $\text{rad/s}$ ($\omega = 2\pi f$ se sono dati i giri al secondo).

| Corpo di massa $m$ e raggio $r$ | $I$ | $c$ |
|---|---|---|
| anello sottile, cilindro cavo sottile | $m r^2$ | $1$ |
| sfera cava sottile | $\tfrac{2}{3} m r^2$ | $\tfrac{2}{3}$ |
| disco, cilindro pieno | $\tfrac{1}{2} m r^2$ | $\tfrac{1}{2}$ |
| sfera piena | $\tfrac{2}{5} m r^2$ | $\tfrac{2}{5}$ |

## Lavoro di un momento

$$W = M\,\theta \qquad W = \Delta K_{rot}$$

$\theta$ in radianti.

## Rotolamento senza strisciamento

$$s = r\,\theta \qquad v_{cm} = \omega\,r$$

- Il punto di contatto è fermo, il centro va a $v_{cm}$, il punto più alto a $2 v_{cm}$.

## Energia di un corpo che rotola

$$K = \frac{1}{2} m\,v_{cm}^2 + \frac{1}{2} I\,\omega^2 = (1 + c)\,\frac{1}{2} m\,v_{cm}^2 \qquad \text{con } I = c\,m r^2$$

- L'energia di rotazione è $c$ volte quella di traslazione.

## Piano inclinato

Partenza da fermo, dislivello $h$, angolo $\beta$, lunghezza $l$ ($h = l\sin\beta$):

$$v_{cm} = \sqrt{\frac{2 g h}{1 + c}} \qquad a = \frac{g\sin\beta}{1 + c} \qquad t = \sqrt{\frac{2 l}{a}}$$

Risalita da $v_{cm}$ fino a fermarsi:

$$h = \frac{(1 + c)\,v_{cm}^2}{2 g}$$

- Massa e raggio non contano. Ordine di arrivo: blocco senza attrito ($c = 0$), sfera piena, cilindro pieno, sfera cava, anello.
- L'attrito statico fa girare il corpo e non compie lavoro: l'energia meccanica si conserva.

```ad-warning
Giri e radianti
$\omega$ va in $\text{rad/s}$: giri al secondo per $2\pi$, giri al minuto prima divisi per $60$.
```

```ad-warning
L'energia di rotazione non si dimentica
Per un corpo che rotola $m g h = \tfrac{1}{2} m v^2$ è sbagliata: dà $\sqrt{2 g h}$, la velocità di un corpo che scivola.
```

```ad-warning
Solo senza strisciamento
$v_{cm} = \omega r$ non vale per una ruota che slitta o che è bloccata.
```
