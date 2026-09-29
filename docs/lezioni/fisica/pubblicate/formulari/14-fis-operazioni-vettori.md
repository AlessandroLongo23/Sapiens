# Formulario: Somma e differenza di vettori

## Le due regole della somma

- Punta-coda: $\vec{b}$ parte dalla punta di $\vec{a}$; la somma va dall'origine di $\vec{a}$ alla punta di $\vec{b}$.
- Parallelogramma: $\vec{a}$ e $\vec{b}$ partono dallo stesso punto; la somma è la diagonale che parte da lì.
- L'ordine non conta: $\vec{a} + \vec{b} = \vec{b} + \vec{a}$.
- Più vettori: uno dopo l'altro, punta-coda; la somma chiude la spezzata.

## Opposto e differenza

- $-\vec{b}$: stesso modulo e direzione di $\vec{b}$, verso opposto. $\vec{b} + (-\vec{b}) = \vec{0}$.

$$\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$$

- Con $\vec{a}$ e $\vec{b}$ dallo stesso punto, $\vec{a} - \vec{b}$ va dalla punta di $\vec{b}$ alla punta di $\vec{a}$.
- $\vec{b} - \vec{a} = -(\vec{a} - \vec{b})$.

## Prodotto per un numero

$k\vec{a}$ ha modulo $|k| \cdot a$ e la direzione di $\vec{a}$; verso di $\vec{a}$ se $k > 0$, opposto se $k < 0$; per $k = 0$ è il vettore nullo. Con $a = 4\,\text{m}$ verso est, $-2\vec{a}$ è $8\,\text{m}$ verso ovest.

## Casi da fare a mente

| Vettori | Modulo della somma |
|---|---|
| stessa direzione, stesso verso | $a + b$ |
| stessa direzione, versi opposti | maggiore meno minore, verso del maggiore |
| perpendicolari | $\sqrt{a^2 + b^2}$ |

## Per componenti, sulla griglia

$$
\begin{gathered}
s_x = a_x + b_x \qquad s_y = a_y + b_y \\
s = \sqrt{s_x^2 + s_y^2}
\end{gathered}
$$

Per la differenza le componenti si sottraggono. Esempio: $a_x = 3$, $a_y = 1$, $b_x = 1$, $b_y = 2$ danno $s = \sqrt{4^2 + 3^2} = 5$.

```ad-warning
Non sommare i moduli
$3\,\text{km}$ a est più $4\,\text{km}$ a nord fanno $5\,\text{km}$, non $7$.
```

```ad-warning
Il verso della risultante
$30\,\text{N}$ a destra e $12\,\text{N}$ a sinistra: $18\,\text{N}$ verso destra, il verso della forza maggiore.
```

```ad-warning
Il meno non va nel modulo
$-2\vec{a}$ ha modulo $2a$, positivo, e verso opposto ad $\vec{a}$.
```
