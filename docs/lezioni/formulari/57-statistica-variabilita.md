# Formulario: Indici di variabilità

## Campo di variazione

- Differenza tra il dato più grande e il più piccolo. Dipende solo dai due estremi.

$$x_{\max} - x_{\min}$$

- Con i negativi: $-4$, $1$, $5$ danno $5 - (-4) = 9$.

## Scarti dalla media

- Scarto di un dato $x_i$ dalla media $\bar{x}$:

$$x_i - \bar{x}$$

- La somma degli scarti è sempre $0$: serve come controllo, ma la loro media non misura la variabilità.

## Scarto semplice medio

- Media dei valori assoluti degli scarti, cioè la distanza media dei dati dalla media:

$$S = \frac{|x_1 - \bar{x}| + \dots + |x_n - \bar{x}|}{n}$$

## Varianza e scarto quadratico medio

- Varianza: media dei quadrati degli scarti, nel quadrato dell'unità dei dati.

$$\sigma^2 = \frac{(x_1 - \bar{x})^2 + \dots + (x_n - \bar{x})^2}{n}$$

- Scarto quadratico medio (deviazione standard), nella stessa unità dei dati:

$$\sigma = \sqrt{\sigma^2}$$

- $\sigma = 0$ solo se tutti i dati sono uguali. Controllo: $\sigma \geq S$.
- Altro modo: $\sigma^2$ = media dei quadrati dei dati meno $\bar{x}^2$.
- Calcolatrice: il tasto $\sigma_x$ divide per $n$; $s_x$ divide per $n - 1$.

## Radice quadrata

- Per $a \geq 0$, $\sqrt{a}$ è il numero $b \geq 0$ con $b^2 = a$: $\sqrt{49} = 7$, $\sqrt{0{,}36} = 0{,}6$.
- Un numero negativo non ha radice quadrata.
- Se non è esatta, calcolatrice e arrotondamento: $\sqrt{2} \approx 1{,}41$.

## Calcolo con una tabella

1. Calcola la media $\bar{x}$.
2. Colonna degli scarti $x_i - \bar{x}$: la somma deve fare $0$.
3. Colonna dei valori assoluti (per $S$) o dei quadrati (per $\sigma^2$).
4. Somma la colonna e dividi per $n$.
5. Per $\sigma$ calcola la radice quadrata di $\sigma^2$.

Con una tabella di frequenze ogni riga si moltiplica per la sua frequenza $f_i$, e $n = f_1 + \dots + f_k$:

$$\sigma^2 = \frac{(x_1 - \bar{x})^2 f_1 + \dots + (x_k - \bar{x})^2 f_k}{n}$$

| gol $x_i$ | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|---|
| partite $f_i$ | $2$ | $5$ | $6$ | $5$ | $2$ |

$\bar{x} = 2$, $\sigma^2 = \dfrac{8 + 5 + 0 + 5 + 8}{20} = 1{,}3$, $\sigma \approx 1{,}14$.

```ad-warning
Dimenticare la radice
La varianza non è lo scarto quadratico medio: da $\sigma^2 = 3{,}6$ si ottiene $\sigma = \sqrt{3{,}6} \approx 1{,}90$.
```

```ad-warning
Dividere per il numero delle righe
Con una tabella di frequenze si divide per $n$, la somma delle frequenze, non per il numero dei valori diversi.
```

```ad-warning
Il quadrato di uno scarto negativo
$(-3)^2 = 9$, non $-9$: sulla calcolatrice scrivi le parentesi.
```
