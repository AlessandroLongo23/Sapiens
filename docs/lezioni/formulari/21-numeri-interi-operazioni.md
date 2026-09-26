# Formulario: Operazioni in ℤ

## Addizione

Concordi (stesso segno): segno comune, si sommano i valori assoluti.

$$
\begin{gathered}
(+3) + (+5) = +8 \\
(-3) + (-5) = -8
\end{gathered}
$$

Discordi (segni diversi): segno dell'addendo con il valore assoluto maggiore, si sottraggono i valori assoluti.

$$
\begin{gathered}
(+7) + (-4) = +3 \\
(-7) + (+4) = -3
\end{gathered}
$$

Numeri opposti: $a + (-a) = 0$. Elemento neutro: $a + 0 = a$.

## Sottrazione

Sottrarre un numero vuol dire sommare il suo opposto:

$$a - b = a + (-b)$$

Per esempio $(-2) - (-6) = (-2) + (+6) = +4$. In $\mathbb{Z}$ la sottrazione si fa sempre; non è commutativa: $3 - 8 = -5$, $8 - 3 = +5$.

## Somma algebrica e segni

In una somma algebrica si sommano a parte i positivi e i negativi: $5 - 8 + 3 - 7 + 2 = 10 - 15 = -5$.

| Scrittura | Diventa |
|---|---|
| $+(+a)$ | $+a$ |
| $+(-a)$ | $-a$ |
| $-(+a)$ | $-a$ |
| $-(-a)$ | $+a$ |

## Togliere le parentesi

1. Parentesi preceduta da $+$: si toglie e i termini restano con il loro segno.
2. Parentesi preceduta da $-$: si toglie e si cambia il segno a tutti i termini dentro.

Per esempio $7 - (3 - 5 + 2) = 7 - 3 + 5 - 2 = 7$.

## Regola dei segni

Vale per moltiplicazione e divisione; il valore assoluto è il prodotto (o il quoziente) dei valori assoluti.

| $\cdot$ oppure $:$ | $+$ | $-$ |
|---|---|---|
| $+$ | $+$ | $-$ |
| $-$ | $-$ | $+$ |

Con più fattori diversi da $0$: numero pari di fattori negativi, prodotto positivo; numero dispari, prodotto negativo. Per esempio $(-2) \cdot (+3) \cdot (-1) \cdot (-5) = -30$.

Moltiplicare per $-1$ dà l'opposto: $(-1) \cdot a = -a$.

## Divisione

Con $b \neq 0$, $a : b$ è l'intero $q$ tale che $q \cdot b = a$, quando esiste: $(-12) : (+3) = -4$. La divisione non è interna in $\mathbb{Z}$: $(-7) : 2$ non si può fare. $0 : (-4) = 0$; $(-4) : 0$ è impossibile.

## Proprietà

Valgono commutativa e associativa di addizione e moltiplicazione, distributiva ($a \cdot (b - c) = a \cdot b - a \cdot c$ senza condizioni), elementi neutri $0$ e $1$, elemento assorbente $0$, legge di annullamento del prodotto, invariantiva della sottrazione senza condizioni.

| Operazione | Interna in $\mathbb{N}$ | Interna in $\mathbb{Z}$ |
|---|---|---|
| Addizione | sì | sì |
| Sottrazione | no | sì |
| Moltiplicazione | sì | sì |
| Divisione | no | no |

## Espressioni

Stesso ordine dei naturali: parentesi dalle più interne, poi potenze, poi moltiplicazioni e divisioni da sinistra a destra, infine la somma algebrica.

```ad-warning
Due termini negativi si sommano
$-5 - 3 = -8$, non $+8$: la regola dei segni vale per $\cdot$ e $:$, mentre $(-3) \cdot (-4) = +12$.
```

```ad-warning
Il meno davanti alla parentesi cambia tutti i segni
$7 - (3 - 5 + 2) = 7 - 3 + 5 - 2$, non $7 - 3 - 5 + 2$.
```

```ad-warning
Segno della somma tra discordi
$(-7) + (+4) = -3$: non $+3$ e non $-11$.
```
