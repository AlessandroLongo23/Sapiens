# Formulario: Frigoriferi e pompe di calore

## La macchina frigorifera

Assorbe $Q_f$ dalla sorgente fredda, riceve il lavoro $W$, cede $Q_c$ alla sorgente calda. $Q_c$, $Q_f$ e $W$ in valore assoluto.

$$Q_c = Q_f + W$$

- Il lavoro non può essere zero (enunciato di Clausius).
- Circuito di un frigorifero: evaporatore ($Q_f$), compressore ($W$), condensatore ($Q_c$), valvola di espansione.

## Coefficiente di prestazione

Frigorifero (interessa il calore tolto alla sorgente fredda):

$$\text{COP}_f = \frac{Q_f}{W} = \frac{Q_f}{Q_c - Q_f}$$

Pompa di calore (interessa il calore ceduto alla sorgente calda):

$$\text{COP}_p = \frac{Q_c}{W} = \frac{Q_c}{Q_c - Q_f}$$

Per la stessa macchina:

$$\text{COP}_p = \text{COP}_f + 1$$

- Sono numeri puri. $\text{COP}_p$ è sempre maggiore di 1.
- Lavoro dal coefficiente: $W = Q_f / \text{COP}_f$ oppure $W = Q_c / \text{COP}_p$. Potenza: $P = W / \Delta t$.

## Coefficiente massimo

Macchina reversibile tra $T_c$ e $T_f$, in kelvin ($T = t + 273$):

$$\text{COP}_{f,max} = \frac{T_f}{T_c - T_f} \qquad\qquad \text{COP}_{p,max} = \frac{T_c}{T_c - T_f}$$

- Più le temperature sono vicine, più alto è il coefficiente. Le macchine reali stanno sotto il massimo.

## Il calore da togliere

Per raffreddare: $Q = c\,m\,\Delta t$. Per solidificare: $Q = L_f\,m$. Acqua: $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$.

1. Calcola $Q_f$, sommando raffreddamento e passaggio di stato.
2. Lavoro: $W = Q_f / \text{COP}_f$.
3. Tempo: lavoro diviso potenza del motore.
4. Calore ceduto all'ambiente: $Q_c = Q_f + W$.

## Confronto

| | Macchina termica | Frigorifero | Pompa di calore |
|---|---|---|---|
| Interessa | $W$ | $Q_f$ | $Q_c$ |
| Si spende | $Q_c$ | $W$ | $W$ |
| Indice | $\eta = \dfrac{W}{Q_c}$ | $\text{COP}_f = \dfrac{Q_f}{W}$ | $\text{COP}_p = \dfrac{Q_c}{W}$ |
| Massimo | $1 - \dfrac{T_f}{T_c}$ | $\dfrac{T_f}{T_c - T_f}$ | $\dfrac{T_c}{T_c - T_f}$ |

```ad-warning
Temperature in kelvin
Nel coefficiente massimo $T_c$ e $T_f$ sono assolute: con i gradi Celsius il risultato è sbagliato, anche negativo.
```

```ad-warning
Al numeratore il calore che interessa
$Q_f$ per il frigorifero, $Q_c$ per la pompa di calore; al denominatore sempre $W = Q_c - Q_f$.
```

```ad-warning
Un COP maggiore di 1 non crea energia
La macchina sposta calore, non lo produce dal lavoro: il bilancio è sempre $Q_c = Q_f + W$.
```
