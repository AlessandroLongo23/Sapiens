# Formulario: Velocità angolare e accelerazione angolare

## Posizione e spostamento angolare

- Angoli in radianti, positivi in senso antiorario.
- Spostamento angolare $\Delta\theta = \theta - \theta_0$; $N$ giri valgono $\Delta\theta = 2\pi N$.
- Tutti i punti di un corpo rigido hanno la stessa $\Delta\theta$, la stessa $\omega$ e la stessa $\alpha$.

## Velocità angolare e accelerazione angolare

$$\omega_m = \frac{\Delta\theta}{\Delta t} \qquad \alpha_m = \frac{\Delta\omega}{\Delta t} = \frac{\omega - \omega_0}{\Delta t}$$

- $\omega$ in $\text{rad/s}$, $\alpha$ in $\text{rad/s}^2$.
- Da $n$ giri al minuto: $\omega = \dfrac{2\pi\,n}{60\,\text{s}}$.
- $\alpha$ e $\omega$ con lo stesso segno: la rotazione accelera; con segni opposti: rallenta.

## Moto circolare uniformemente accelerato

$$\omega = \omega_0 + \alpha\,t$$

$$\theta = \theta_0 + \omega_0\,t + \frac{1}{2}\,\alpha\,t^2$$

$$\omega^2 = \omega_0^2 + 2\,\alpha\,\Delta\theta$$

- Nel grafico di $\omega$ in funzione di $t$ la pendenza è $\alpha$ e l'area sotto il grafico è $\Delta\theta$.
- Numero di giri: $N = \dfrac{\Delta\theta}{2\pi}$.

| Moto su una retta | Rotazione |
|---|---|
| $s$, $v$, $a$ | $\theta$, $\omega$, $\alpha$ |
| $v = v_0 + a\,t$ | $\omega = \omega_0 + \alpha\,t$ |
| $s = s_0 + v_0\,t + \frac{1}{2}a\,t^2$ | $\theta = \theta_0 + \omega_0\,t + \frac{1}{2}\alpha\,t^2$ |
| $v^2 = v_0^2 + 2\,a\,\Delta s$ | $\omega^2 = \omega_0^2 + 2\,\alpha\,\Delta\theta$ |

## Grandezze lineari di un punto a distanza r dall'asse

$$l = r\,\Delta\theta \qquad v = \omega\,r$$

$$a_t = \alpha\,r \qquad a_c = \omega^2\,r = \frac{v^2}{r} \qquad a = \sqrt{a_t^2 + a_c^2}$$

- $a_t$ è tangente e cambia il modulo della velocità; $a_c$ punta verso il centro e ne cambia la direzione.
- Nel moto circolare uniforme $\alpha = 0$: resta solo $a_c$.

```ad-warning
Giri e giri al minuto
Nelle formule gli angoli vanno in radianti e $\omega$ in $\text{rad/s}$: i giri si moltiplicano per $2\pi$, i giri al minuto per $2\pi/60$.
```

```ad-warning
Il segno di α
In una rotazione che rallenta $\alpha$ ha il segno opposto a $\omega$.
```

```ad-warning
α non è l'accelerazione centripeta
$\alpha\,r$ dà solo la componente tangenziale; $a_c = \omega^2 r$ c'è anche con $\alpha = 0$.
```
