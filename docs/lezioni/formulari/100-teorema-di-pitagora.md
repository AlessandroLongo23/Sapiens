# Formulario: Teoremi di Pitagora e di Euclide

## Nomi

Triangolo $ABC$ rettangolo in $C$: cateti $AC$ e $BC$, ipotenusa $AB$, altezza $CH$ relativa all'ipotenusa. $AH$ è la proiezione di $AC$ sull'ipotenusa, $HB$ quella di $BC$, e $\overline{AH} + \overline{HB} = \overline{AB}$. Misure: $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$.

## Primo teorema di Euclide

Il quadrato di un cateto è equivalente al rettangolo di ipotenusa e proiezione di quel cateto:

$$
\begin{gathered}
\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH} \\
\overline{BC}^{\,2} = \overline{AB} \cdot \overline{HB}
\end{gathered}
$$

Con $\overline{AB} = 25$ e $\overline{AH} = 9$: $\overline{AC} = \sqrt{225} = 15$.

## Teorema di Pitagora

Il quadrato dell'ipotenusa è equivalente alla somma dei quadrati dei cateti:

$$c^2 = a^2 + b^2$$

$$
\begin{gathered}
c = \sqrt{a^2 + b^2} \\
a = \sqrt{c^2 - b^2} \qquad b = \sqrt{c^2 - a^2}
\end{gathered}
$$

- Inverso: se $c^2 = a^2 + b^2$, con $c$ il lato più lungo, il triangolo è rettangolo e l'angolo retto è opposto a $c$.
- Terne pitagoriche: $3$, $4$, $5$; $5$, $12$, $13$; $8$, $15$, $17$; $7$, $24$, $25$; e i loro multipli ($6$, $8$, $10$).

## Secondo teorema di Euclide

Il quadrato dell'altezza relativa all'ipotenusa è equivalente al rettangolo delle due proiezioni:

$$\overline{CH}^{\,2} = \overline{AH} \cdot \overline{HB}$$

Con $\overline{AH} = 9$ e $\overline{HB} = 16$: $\overline{CH} = \sqrt{144} = 12$. Controllo con l'area: $\overline{CH} = \dfrac{\overline{AC} \cdot \overline{BC}}{\overline{AB}}$.

## Figure particolari

| Figura | Formula |
|---|---|
| diagonale del quadrato di lato $\ell$ | $d = \ell\sqrt{2}$, $\ell = \dfrac{d\sqrt{2}}{2}$ |
| altezza del triangolo equilatero | $h = \dfrac{\ell\sqrt{3}}{2}$ |
| area del triangolo equilatero | $\dfrac{\ell^2\sqrt{3}}{4}$ |
| triangolo $45^\circ$, $45^\circ$, $90^\circ$ | cateti $\ell$, ipotenusa $\ell\sqrt{2}$ |
| triangolo $30^\circ$, $60^\circ$, $90^\circ$ | ipotenusa $\ell$, cateti $\dfrac{\ell}{2}$ e $\dfrac{\ell\sqrt{3}}{2}$ |

Nel triangolo $30^\circ$, $60^\circ$, $90^\circ$ il cateto lungo metà ipotenusa è quello opposto all'angolo di $30^\circ$.

## Nei problemi

1. Trova nella figura un triangolo rettangolo: metà rettangolo (diagonale), un quarto di rombo (diagonali), il triangolo che l'altezza stacca da un trapezio.
2. Segna i cateti e l'ipotenusa, il lato opposto all'angolo retto.
3. Ipotenusa: somma dei quadrati; cateto: differenza dei quadrati.

Trapezio isoscele: $\overline{AH} = \dfrac{B - b}{2}$. Trapezio rettangolo: il cateto orizzontale è $B - b$.

```ad-warning
La radice di una somma
$\sqrt{8^2 + 6^2} = \sqrt{100} = 10$, non $8 + 6 = 14$.
```

```ad-warning
Per il cateto si sottrae
Con ipotenusa $13$ e cateto $5$ l'altro cateto è $\sqrt{169 - 25} = 12$, non $\sqrt{169 + 25}$.
```

```ad-warning
Ogni cateto con la sua proiezione
$\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH}$, non $\overline{AB} \cdot \overline{HB}$.
```
