# Formulario: Potenze in ℕ

## Definizione

Con $n \geq 2$, la potenza di base $a$ ed esponente $n$ è il prodotto di $n$ fattori uguali ad $a$:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ fattori}}$$

Per esempio $2^3 = 2 \cdot 2 \cdot 2 = 8$. L'esponente $2$ dà il quadrato, l'esponente $3$ il cubo.

Casi da ricordare: $1^n = 1$; $0^n = 0$ per $n \geq 1$; $10^n$ è $1$ seguito da $n$ zeri, come $10^4 = 10\,000$.

## Esponente 1 ed esponente 0

$$a^1 = a \qquad a^0 = 1 \quad (a \neq 0)$$

$0^0$ non ha significato.

## Proprietà delle potenze

Dove compare un esponente $0$, la base deve essere diversa da $0$.

| Proprietà | Formula | Esempio |
|---|---|---|
| Prodotto, stessa base | $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^2 = 2^5$ |
| Quoziente, stessa base ($a \neq 0$, $m \geq n$) | $a^m : a^n = a^{m-n}$ | $2^8 : 2^6 = 2^2$ |
| Potenza di una potenza | $(a^m)^n = a^{m \cdot n}$ | $(2^3)^2 = 2^6$ |
| Prodotto, stesso esponente | $a^n \cdot b^n = (a \cdot b)^n$ | $2^3 \cdot 5^3 = 10^3$ |
| Quoziente, stesso esponente ($b \neq 0$, $a$ divisibile per $b$) | $a^n : b^n = (a : b)^n$ | $6^4 : 3^4 = 2^4$ |

Con basi diverse che sono potenze della stessa base, si riportano a quella base: $4^3 = (2^2)^3 = 2^6$.

## Le potenze nelle espressioni

Le potenze si calcolano prima di moltiplicazioni e divisioni, e l'esponente vale solo per il numero o la parentesi su cui è scritto:

$$3 \cdot 2^2 = 12 \qquad (3 \cdot 2)^2 = 36$$

## Potenze di 10

$$
\begin{aligned}
4352 &= 4 \cdot 10^3 + 3 \cdot 10^2 \\
&\quad + 5 \cdot 10^1 + 2 \cdot 10^0
\end{aligned}
$$

Numeri con molti zeri: $3\,000\,000 = 3 \cdot 10^6$, $250\,000 = 25 \cdot 10^4$.

```ad-warning
Elevare una somma termine per termine
$(2 + 3)^2 = 25$, mentre $2^2 + 3^2 = 13$: la potenza si distribuisce sul prodotto, non sulla somma.
```

```ad-warning
Sommare gli esponenti in una somma
$2^2 + 2^3 = 4 + 8 = 12$, non $2^5 = 32$: $a^m \cdot a^n = a^{m+n}$ vale per il prodotto.
```

```ad-warning
Sbagliare l'esponente zero
$5^0 = 1$, non $0$ e non $5$.
```
