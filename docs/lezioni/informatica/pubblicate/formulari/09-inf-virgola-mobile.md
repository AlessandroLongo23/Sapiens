# Formulario: Numeri reali in virgola mobile

## Numeri binari con la virgola

- Pesi dopo la virgola: $\frac{1}{2}$, $\frac{1}{4}$, $\frac{1}{8}$, $\frac{1}{16}$, ogni volta la metà.
- Per leggere: somma i pesi delle cifre a $1$. Esempio: $101{,}011_2 = 4 + 1 + 0{,}25 + 0{,}125 = 5{,}375$.

Dal decimale al binario, per la parte dopo la virgola:

1. Moltiplica per $2$ la parte dopo la virgola.
2. La parte intera del risultato ($0$ o $1$) è la prossima cifra.
3. Tieni la parte dopo la virgola e ripeti.
4. Ti fermi quando resta $0$; le cifre vanno nell'ordine in cui le trovi.

Esempio: $0{,}625 \to 1{,}25 \to 0{,}5 \to 1$, cifre $1$, $0$, $1$: $0{,}625 = 0{,}101_2$.

## Numeri esatti e numeri che non finiscono

- Un numero ha un numero finito di cifre binarie dopo la virgola solo se la sua frazione ridotta ha per denominatore una potenza di $2$.
- $0{,}5 = \frac{1}{2}$ e $0{,}375 = \frac{3}{8}$ sono esatti; $0{,}1 = \frac{1}{10}$ e $0{,}2 = \frac{1}{5}$ hanno infinite cifre.

$$0{,}1 = 0{,}0001\,1001\,1001\,1001\ldots_2$$

## Notazione scientifica in base due

- Forma normalizzata: una sola cifra prima della virgola, che è $1$. Esempio: $1101{,}01_2 = 1{,}10101_2 \cdot 2^3$.
- Tre parti: segno, mantissa (le cifre), esponente (la potenza di $2$).
- Virgola verso sinistra: esponente positivo. Virgola verso destra: esponente negativo, $0{,}00101_2 = 1{,}01_2 \cdot 2^{-3}$.

## Standard IEEE 754

| Formato | Segno | Esponente | Mantissa | Cifre decimali affidabili |
|---|---|---|---|---|
| 32 bit | 1 bit | 8 bit | 23 bit | circa $7$ |
| 64 bit | 1 bit | 11 bit | 52 bit | $15$ o $16$ |

A 32 bit:

1. Segno: $0$ positivo, $1$ negativo.
2. Esponente: l'esponente vero più $127$, in binario su 8 bit.
3. Mantissa: le cifre dopo la virgola della forma normalizzata, poi zeri. L'$1$ prima della virgola non si scrive.

Esempio: $-6{,}5 = -1{,}101_2 \cdot 2^2$; segno $1$, esponente $129 = 1000\,0001_2$, mantissa $101$ e poi zeri.

## Errori di arrotondamento

- Quello che non sta nella mantissa viene arrotondato: a 64 bit $0{,}1 + 0{,}2$ dà $0{,}30000000000000004$.
- A 32 bit i numeri interi sono esatti fino a $2^{24} = 16\,777\,216$.

```ad-warning
Le cifre dopo la virgola hanno i loro pesi
$101{,}011_2$ non è $5{,}3$: la prima cifra dopo la virgola pesa $\frac{1}{2}$.
```

```ad-warning
L'esponente conta gli spostamenti della virgola
$1101{,}01_2$ ha quattro cifre prima della virgola, ma l'esponente è $3$.
```

```ad-warning
Mai chiedere se due risultati sono uguali
Due numeri in virgola mobile si confrontano guardando se la loro differenza è abbastanza piccola.
```
