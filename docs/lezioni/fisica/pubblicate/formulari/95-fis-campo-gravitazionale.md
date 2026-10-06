# Formulario: Il campo gravitazionale

## Definizione

Campo gravitazionale in un punto: la forza di gravità su una massa di prova $m$ messa lì, divisa per $m$.

$$\vec g = \frac{\vec F}{m} \qquad \vec F = m\,\vec g$$

- Vettore diretto verso la sorgente; unità $\text{N/kg} = \text{m/s}^2$.
- Dipende dalla sorgente e dal punto, non dalla massa di prova.
- È anche l'accelerazione di un corpo lasciato libero in quel punto.

## Campo di un pianeta

A distanza $r$ dal centro di un corpo sferico di massa $M$ (fuori dal corpo):

$$g = G\,\frac{M}{r^2} \qquad G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$$

- Radiale, verso il centro; le linee di campo sono semirette che finiscono sul pianeta.
- A distanza doppia un quarto, a distanza tripla un nono.
- Terra: $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$, $R_T = 6{,}37 \cdot 10^6\,\text{m}$, al suolo $g_0 = 9{,}8\,\text{N/kg}$.

## Campo a quota h

$$r = R + h \qquad g = G\,\frac{M}{(R + h)^2} \qquad g = g_0 \left(\frac{R_T}{R_T + h}\right)^2$$

| Distanza dal centro | $R_T$ | $\sqrt{2}\,R_T$ | $2 R_T$ | $3 R_T$ | $n R_T$ |
|---|---|---|---|---|---|
| Campo | $g_0$ | $\tfrac{1}{2} g_0$ | $\tfrac{1}{4} g_0$ | $\tfrac{1}{9} g_0$ | $g_0 / n^2$ |

## Più sorgenti

Principio di sovrapposizione: $\vec g = \vec g_1 + \vec g_2$ (somma vettoriale).

Su un punto tra due corpi, lungo la retta dei centri, i moduli si sottraggono. Campo nullo dove

$$\frac{M_1}{x^2} = \frac{M_2}{(d - x)^2} \quad\Rightarrow\quad \frac{x}{d - x} = \sqrt{\frac{M_1}{M_2}}$$

## Dentro e fuori una sfera

| Dove | Campo |
|---|---|
| fuori ($r \ge R$) | $G\,\dfrac{M}{r^2}$, come una massa puntiforme nel centro |
| dentro un guscio cavo | $0$ |
| dentro una sfera omogenea ($r \le R$) | $G\,\dfrac{M}{R^3}\,r$, proporzionale a $r$ |

```ad-warning
La distanza è dal centro
Nella formula va $r = R + h$, non la quota $h$: raggio e quota nella stessa unità.
```

```ad-warning
Il campo non dipende dalla massa di prova
In $g = F/m$ raddoppiando $m$ raddoppia $F$: il campo resta lo stesso.
```

```ad-warning
Campo e forza hanno unità diverse
Il campo è in $\text{N/kg}$, la forza in $\text{N}$: la forza si ottiene moltiplicando il campo per la massa del corpo.
```
