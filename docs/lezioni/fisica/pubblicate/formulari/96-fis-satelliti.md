# Formulario: Il moto dei satelliti

## Orbita circolare

La gravità fa da forza centripeta:

$$G\,\frac{M\,m}{r^2} = m\,\frac{v^2}{r}$$

$M$ è la massa del corpo centrale, $r$ la distanza dal suo centro: $r = R + h$ per un satellite a quota $h$.

## Velocità orbitale

$$v = \sqrt{\frac{G\,M}{r}}$$

- Non dipende dalla massa del satellite.
- A ogni raggio una sola velocità; più lontano, più lento.
- Al suolo ($r = R_T$): $7{,}91\,\text{km/s}$, la prima velocità cosmica.
- Per la Terra $G M_T = 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$.

## Periodo

$$T = \frac{2\pi\,r}{v} \qquad T = 2\pi\,\sqrt{\frac{r^3}{G\,M}}$$

## Terza legge di Keplero

$$\frac{T^2}{r^3} = \frac{4\pi^2}{G\,M}$$

La costante è la stessa per tutti i satelliti dello stesso corpo centrale. Da qui:

| Cerco | Formula |
|---|---|
| la massa del corpo centrale | $M = \dfrac{4\pi^2\,r^3}{G\,T^2}$ |
| il raggio dell'orbita | $r = \sqrt[3]{\dfrac{G\,M\,T^2}{4\pi^2}}$ |

## Satelliti della Terra

| Satellite | Quota | Velocità | Periodo |
|---|---|---|---|
| Stazione Spaziale | $400\,\text{km}$ | $7{,}67\,\text{km/s}$ | $92$ minuti |
| GPS | $20\,200\,\text{km}$ | $3{,}87\,\text{km/s}$ | $12{,}0$ ore |
| Geostazionario | $35\,800\,\text{km}$ | $3{,}07\,\text{km/s}$ | $23$ ore e $56$ minuti |

Geostazionario: sopra l'equatore, periodo uguale a quello di rotazione della Terra ($8{,}62 \cdot 10^4\,\text{s}$), $r = 4{,}22 \cdot 10^7\,\text{m}$.

## Assenza apparente di peso

In orbita la gravità c'è (a $400\,\text{km}$ è l'$89\%$ di quella al suolo). Satellite e astronauti sono in caduta libera con la stessa accelerazione: nessuno preme sull'altro, e la bilancia segna zero.

## Procedimento

1. Individua il corpo centrale: conta la sua massa, non quella del satellite.
2. Trova $r = R + h$, in metri.
3. Velocità: $v = \sqrt{G M / r}$.
4. Periodo: $T = 2\pi r / v$.
5. Controlla l'ordine di grandezza: intorno alla Terra da $1$ a $8\,\text{km/s}$.

```ad-warning
La quota non è il raggio dell'orbita
Nelle formule va la distanza dal centro, $r = R + h$.
```

```ad-warning
Il cubo sta sotto la radice
$T = 2\pi\sqrt{r^3/(G M)}$: raggio al cubo, radice quadrata, $G M$ al denominatore.
```

```ad-warning
In orbita la gravità c'è
Gli astronauti galleggiano perché cadono insieme alla Stazione, non perché manca la gravità.
```
