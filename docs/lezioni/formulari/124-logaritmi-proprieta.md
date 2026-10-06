# Formulario: Logaritmi e loro proprietà

## Definizione

Con $a > 0$, $a \neq 1$ e $b > 0$:

$$\log_a b = c \iff a^c = b$$

$a$ è la base, $b$ l'argomento. Per esempio $\log_2 8 = 3$, $\log_3 \dfrac{1}{9} = -2$, $\log_5 \sqrt{5} = \dfrac{1}{2}$.

- $\log x$: logaritmo decimale, in base $10$.
- $\ln x$: logaritmo naturale, in base $e \approx 2{,}718$.

## Uguaglianze che vengono dalla definizione

| Uguaglianza | Esempio |
|---|---|
| $\log_a 1 = 0$ | $\ln 1 = 0$ |
| $\log_a a = 1$ | $\log 10 = 1$ |
| $\log_a a^c = c$ | $\log_2 2^5 = 5$ |
| $a^{\log_a b} = b$ | $3^{\log_3 7} = 7$ |

## Calcolare un logaritmo con la definizione

1. Poni $\log_a b = x$ e scrivi $a^x = b$.
2. Scrivi $a$ e $b$ come potenze dello stesso numero.
3. Uguaglia gli esponenti.

Per esempio $\log_4 8 = x$: $2^{2x} = 2^3$, quindi $x = \dfrac{3}{2}$.

## Proprietà

Con $b > 0$ e $c > 0$:

| Nome | Formula | Esempio |
|---|---|---|
| Prodotto | $\log_a (b \cdot c) = \log_a b + \log_a c$ | $\log_6 4 + \log_6 9 = \log_6 36 = 2$ |
| Quoziente | $\log_a \dfrac{b}{c} = \log_a b - \log_a c$ | $\log_3 54 - \log_3 2 = \log_3 27 = 3$ |
| Potenza | $\log_a b^n = n \cdot \log_a b$ | $\log_2 8^5 = 5 \cdot 3 = 15$ |
| Radice | $\log_a \sqrt[n]{b} = \dfrac{1}{n} \cdot \log_a b$ | $\log_3 \sqrt{27} = \dfrac{3}{2}$ |
| Reciproco | $\log_a \dfrac{1}{c} = -\log_a c$ | $\log_2 \dfrac{1}{8} = -3$ |

## Cambiamento di base

Con $c > 0$ e $c \neq 1$:

$$\log_a b = \frac{\log_c b}{\log_c a}$$

Con la calcolatrice: $\log_2 5 = \dfrac{\log 5}{\log 2} = \dfrac{\ln 5}{\ln 2} \approx 2{,}32$.

- Scambio di base e argomento: $\log_a b = \dfrac{1}{\log_b a}$, con $b \neq 1$.
- Base che è una potenza: $\log_{a^n} b = \dfrac{1}{n} \cdot \log_a b$, con $n \neq 0$. In particolare $\log_{\frac{1}{a}} b = -\log_a b$.

```ad-warning
Il logaritmo di una somma
$\log_a (b + c)$ non è $\log_a b + \log_a c$: $\log_2 (4 + 4) = 3$, mentre $\log_2 4 + \log_2 4 = 4$.
```

```ad-warning
L'esponente sull'argomento o sul logaritmo
$\log_2 8^2 = 2 \cdot 3 = 6$, mentre $\left(\log_2 8\right)^2 = 9$. E $\log_a x^2 = 2\log_a x$ vale solo per $x > 0$.
```

```ad-warning
Quoziente di logaritmi
$\dfrac{\log 5}{\log 2} = \log_2 5 \approx 2{,}32$, non $\log \dfrac{5}{2} \approx 0{,}398$.
```
