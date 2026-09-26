# Formulario: Potenze in ℤ

## Definizione

Con $a$ intero e $n \geq 2$ naturale, la potenza è il prodotto di $n$ fattori uguali ad $a$:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ fattori}}$$

$$a^1 = a \qquad a^0 = 1 \quad (a \neq 0)$$

$0^0$ non ha significato. La base negativa si scrive tra parentesi: $(-3)^2 = 9$.

## Il segno della potenza

| Base | Esponente pari | Esponente dispari |
|---|---|---|
| positiva | positivo: $2^4 = 16$ | positivo: $2^3 = 8$ |
| negativa | positivo: $(-2)^4 = 16$ | negativo: $(-2)^3 = -8$ |

$0$ è pari: $(-5)^0 = 1$. Il valore assoluto: $|a^n| = |a|^n$.

$$
\begin{gathered}
(-1)^n = 1 \text{ se } n \text{ è pari} \\
(-1)^n = -1 \text{ se } n \text{ è dispari}
\end{gathered}
$$

Potenze di numeri opposti:

$$
\begin{gathered}
(-a)^n = a^n \text{ se } n \text{ è pari} \\
(-a)^n = -a^n \text{ se } n \text{ è dispari}
\end{gathered}
$$

Per calcolare una potenza:

1. individua la base (il meno fa parte della base solo se è dentro la parentesi);
2. decidi il segno con la tabella;
3. calcola la potenza del valore assoluto della base e scrivi il segno davanti.

## $(-a)^n$ e $-a^n$

L'esponente vale solo per il numero o la parentesi subito alla sua sinistra:

$$
\begin{gathered}
(-3)^2 = 9 \qquad -3^2 = -9 \\
-(-2)^4 = -16 \\
-(-2)^3 = 8
\end{gathered}
$$

## Proprietà delle potenze

Esponenti naturali; dove compare un esponente $0$, la base deve essere diversa da $0$.

| Proprietà | Formula | Esempio |
|---|---|---|
| Prodotto, stessa base | $a^m \cdot a^n = a^{m+n}$ | $(-2)^3 \cdot (-2)^2 = (-2)^5$ |
| Quoziente, stessa base ($a \neq 0$, $m \geq n$) | $a^m : a^n = a^{m-n}$ | $(-3)^5 : (-3)^3 = (-3)^2$ |
| Potenza di una potenza | $(a^m)^n = a^{m \cdot n}$ | $[(-2)^3]^2 = (-2)^6$ |
| Prodotto, stesso esponente | $a^n \cdot b^n = (a \cdot b)^n$ | $(-2)^3 \cdot 5^3 = (-10)^3$ |
| Quoziente, stesso esponente ($b \neq 0$, $a$ divisibile per $b$) | $a^n : b^n = (a : b)^n$ | $(-12)^2 : 4^2 = (-3)^2$ |

Basi opposte: prima si porta tutto alla stessa base, $(-2)^4 \cdot 2^3 = 2^4 \cdot 2^3 = 2^7$.

Nelle espressioni le potenze si calcolano prima di moltiplicazioni e divisioni.

```ad-warning
Leggere $-3^2$ come $(-3)^2$
$-3^2 = -9$: senza parentesi il meno non fa parte della base.
```

```ad-warning
Dimenticare il segno con l'esponente dispari
$(-2)^3 = -8$, non $8$.
```

```ad-warning
Trattare basi opposte come la stessa base
$(-2)^3 \cdot 2^3 = (-4)^3 = -64$, non $(-2)^6 = 64$.
```
