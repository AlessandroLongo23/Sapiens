# Formulario: Il momento angolare

## Momento angolare di una particella

Rispetto al polo $O$, con $\vec{r}$ da $O$ alla particella e $\varphi$ l'angolo tra $\vec{r}$ e $\vec{p}$:

$$\vec{L} = \vec{r} \times \vec{p} \qquad L = r\,m\,v\sin\varphi = m\,v\,b$$

- $b = r\sin\varphi$ è il braccio: la distanza del polo dalla retta del moto.
- Unità: $\text{kg}\cdot\text{m}^2/\text{s}$.
- $\vec{L}$ è perpendicolare al piano del moto: esce dal foglio ($\odot$, positivo) se la particella gira intorno a $O$ in senso antiorario, entra ($\otimes$, negativo) se gira in senso orario.

| Moto | Momento angolare |
|---|---|
| circolare, polo nel centro | $L = m\,v\,r = m\,r^2\,\omega$ |
| rettilineo uniforme, retta a distanza $b$ dal polo | $L = m\,v\,b$, costante |
| rettilineo, retta che passa per il polo | $L = 0$ |

## Momento angolare di un corpo rigido

Rotazione intorno a un asse fisso, con $I$ il momento d'inerzia rispetto all'asse:

$$L = I\,\omega$$

- $\vec{L}$ sta lungo l'asse, con il verso della mano destra (dita nel verso della rotazione, pollice lungo $\vec{L}$).
- $\omega$ in $\text{rad/s}$: $\omega = 2\pi f$.

## Momento delle forze e momento angolare

$$M = \frac{\Delta L}{\Delta t} \qquad \Delta L = M\,\Delta t$$

- $M$ è il momento totale delle forze esterne, rispetto allo stesso polo di $L$.
- Nel grafico di $L$ in funzione di $t$ la pendenza è $M$.
- $1\,\text{N}\cdot\text{m}\cdot\text{s} = 1\,\text{kg}\cdot\text{m}^2/\text{s}$.

## Traslazione e rotazione

| Traslazione | Rotazione |
|---|---|
| $m$ | $I$ |
| $\vec{v}$ | $\omega$ |
| $\vec{F}$ | $\vec{M}$ |
| $\vec{p} = m\,\vec{v}$ | $L = I\,\omega$ |
| $\vec{F} = \dfrac{\Delta\vec{p}}{\Delta t}$ | $\vec{M} = \dfrac{\Delta\vec{L}}{\Delta t}$ |
| $K = \tfrac{1}{2} m v^2$ | $K_{rot} = \tfrac{1}{2} I\,\omega^2$ |

```ad-warning
Il polo va detto
$L$ dipende dal polo: si sceglie all'inizio e non si cambia.
```

```ad-warning
Non sempre $L = m\,v\,r$
Vale solo se $\vec{v}$ è perpendicolare a $\vec{r}$; altrimenti $L = r\,m\,v\sin\varphi$. Anche una particella che va dritta ha momento angolare, se la retta non passa per il polo.
```

```ad-warning
$L$ non è $K_{rot}$
$L = I\,\omega$ va con $\omega$, $K_{rot} = \tfrac{1}{2} I\,\omega^2$ con $\omega^2$.
```
