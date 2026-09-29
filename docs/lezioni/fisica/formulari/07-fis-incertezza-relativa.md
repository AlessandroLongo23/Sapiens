# Formulario: Incertezza relativa e propagazione delle incertezze

## Incertezza relativa e percentuale

$$\varepsilon = \frac{\Delta x}{\bar{x}} \qquad \varepsilon_\% = \varepsilon \cdot 100\%$$

- È un numero puro, senza unità; si scrive con una o due cifre significative.
- Più è piccola, più la misura è precisa: la precisione di due misure si confronta con le incertezze relative.
- Dalla relativa all'assoluta: $\Delta x = \varepsilon \cdot \bar{x}$. Per esempio $2\%$ di $250$ g è $5$ g.

## Regole di propagazione

| Operazione | Incertezza del risultato |
|---|---|
| $a + b$, $a - b$ | $\Delta a + \Delta b$ (si sommano le assolute) |
| $k \cdot a$, con $k$ esatto | $k \cdot \Delta a$ |
| $a \cdot b$, $\dfrac{a}{b}$ | $\varepsilon_a + \varepsilon_b$ (si sommano le relative) |
| $a^n$ | $n \cdot \varepsilon_a$ |

Esempi: $(47 \pm 1) - (35 \pm 1) = (12 \pm 2)$ mL; $T = \dfrac{(12{,}50 \pm 0{,}06)\,\text{s}}{10} = (1{,}250 \pm 0{,}006)\,\text{s}$; per $V = l^3$, $\varepsilon_V = 3\,\varepsilon_l$.

## Prodotti e quozienti in tre passi

1. Calcola il risultato con i valori medi.
2. Somma le incertezze relative dei dati.
3. Moltiplica per il risultato e arrotonda: incertezza con una cifra significativa, valore alla stessa posizione.

$$A = 29{,}7 \cdot 21{,}0 = 623{,}7 \qquad \varepsilon_A = \frac{0{,}1}{29{,}7} + \frac{0{,}1}{21{,}0} \approx 0{,}0081 \qquad A = (624 \pm 5)\ \text{cm}^2$$

Il dato con l'incertezza relativa più grande è quello che pesa di più sul risultato.

```ad-warning
Nelle differenze le incertezze si sommano
$\Delta(a - b) = \Delta a + \Delta b$: la differenza di valori vicini ha un'incertezza relativa grande.
```

```ad-warning
Nei prodotti si passa dalle relative
Non si sommano incertezze di grandezze diverse, e non si moltiplicano le incertezze tra loro.
```

```ad-warning
L'esponente
Per $l^3$ l'incertezza relativa è $3\,\varepsilon_l$, non $\varepsilon_l$ e non $\varepsilon_l^3$.
```
