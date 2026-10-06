# Formulario: Prodotto scalare e prodotto vettoriale

## Prodotto scalare

Un numero, con il segno; $\alpha$ è l'angolo tra i due vettori disegnati dallo stesso punto, tra $0^\circ$ e $180^\circ$.

$$\vec{a} \cdot \vec{b} = a\,b\cos\alpha$$

- È il modulo di $\vec{a}$ per la proiezione di $\vec{b}$ su $\vec{a}$, che vale $b\cos\alpha$.
- Il lavoro di una forza costante: $W = \vec{F} \cdot \vec{s}$.
- Coseno di un angolo ottuso: $\cos(180^\circ - \alpha) = -\cos\alpha$.

| Angolo | $\vec{a} \cdot \vec{b}$ |
|---|---|
| acuto | positivo |
| $90^\circ$ | zero |
| ottuso | negativo |

Proprietà: $\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$; $\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$; $\vec{a} \cdot \vec{a} = a^2$.

## Prodotto scalare con le componenti

$$\vec{a} \cdot \vec{b} = a_x\,b_x + a_y\,b_y \qquad \text{(nello spazio si aggiunge } a_z\,b_z\text{)}$$

Angolo tra due vettori:

$$\cos\alpha = \frac{a_x\,b_x + a_y\,b_y}{a\,b} \qquad a = \sqrt{a_x^2 + a_y^2}$$

## Prodotto vettoriale

Un vettore, $\vec{c} = \vec{a} \times \vec{b}$.

$$c = a\,b\sin\alpha$$

- Modulo: l'area del parallelogramma costruito sui due vettori; $\sin(180^\circ - \alpha) = \sin\alpha$.
- Direzione: perpendicolare al piano di $\vec{a}$ e $\vec{b}$.
- Verso, regola della mano destra: la mano aperta lungo $\vec{a}$, le dita si chiudono verso $\vec{b}$, il pollice dà il verso.
- Sul foglio: da $\vec{a}$ a $\vec{b}$ in senso antiorario esce ($\odot$), in senso orario entra ($\otimes$).

Proprietà: $\vec{b} \times \vec{a} = -\,\vec{a} \times \vec{b}$; $\vec{a} \times (\vec{b} + \vec{c}) = \vec{a} \times \vec{b} + \vec{a} \times \vec{c}$; nullo per vettori paralleli.

## Prodotto vettoriale con le componenti

Assi: $x$ a destra, $y$ in alto, $z$ che esce dal foglio. Per due vettori del piano $xy$:

$$c_z = a_x\,b_y - a_y\,b_x$$

$c_z > 0$: esce dal foglio; $c_z < 0$: entra.

Nello spazio:

$$c_x = a_y\,b_z - a_z\,b_y \qquad c_y = a_z\,b_x - a_x\,b_z \qquad c_z = a_x\,b_y - a_y\,b_x$$

Controllo: $\vec{a} \cdot \vec{c} = 0$ e $\vec{b} \cdot \vec{c} = 0$.

## Confronto

| | Scalare | Vettoriale |
|---|---|---|
| Risultato | numero | vettore |
| Funzione | $\cos\alpha$ | $\sin\alpha$ |
| Vettori paralleli | $\pm a\,b$ | nullo |
| Vettori perpendicolari | zero | modulo $a\,b$ |
| Scambiando i fattori | non cambia | cambia verso |

```ad-warning
Seno e coseno scambiati
Coseno per il prodotto scalare, seno per il modulo del prodotto vettoriale.
```

```ad-warning
L'angolo sbagliato
L'angolo è quello tra i vettori con le origini nello stesso punto: può essere ottuso, e allora il prodotto scalare è negativo.
```

```ad-warning
L'ordine nel prodotto vettoriale
$\vec{a} \times \vec{b}$ e $\vec{b} \times \vec{a}$ hanno versi opposti; in $c_y$ l'ordine è $a_z\,b_x - a_x\,b_z$.
```
