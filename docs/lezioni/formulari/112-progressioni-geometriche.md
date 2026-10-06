# Formulario: Progressioni geometriche

## Definizione e ragione

Progressione geometrica: una successione di termini diversi da zero in cui il rapporto tra ogni termine e il precedente è costante. Il rapporto è la ragione $q$, con $q \neq 0$.

$$\frac{a_{n+1}}{a_n} = q \qquad a_{n+1} = a_n \cdot q$$

## Crescente, decrescente o a segni alterni

| Ragione | Con $a_1 > 0$ | Con $a_1 < 0$ |
|---|---|---|
| $q > 1$ | crescente | decrescente |
| $q = 1$ | costante | costante |
| $0 < q < 1$ | decrescente | crescente |
| $q < 0$ | segni alterni, non monotona | segni alterni, non monotona |

## Termine generale

$$a_n = a_1 \cdot q^{n-1}$$

Per $3, 6, 12, \dots$: $a_8 = 3 \cdot 2^7 = 384$.

## Da un termine a un altro

$$a_n = a_k \cdot q^{n-k} \qquad q^{n-k} = \frac{a_n}{a_k}$$

- Esponente dispari, una ragione: $q^3 = 27$ dà $q = 3$.
- Esponente pari, due ragioni: $q^2 = 4$ dà $q = 2$ oppure $q = -2$.

## Medio geometrico

$$a_n^2 = a_{n-1} \cdot a_{n+1}$$

- Media geometrica di due numeri positivi $a$ e $b$: $\sqrt{ab}$.
- Tre numeri in progressione geometrica: $\dfrac{x}{q}$, $x$, $xq$.
- Inserire $k$ medi geometrici tra $a$ e $b$: $q^{k+1} = \dfrac{b}{a}$.

## Somma dei primi n termini

Per $q \neq 1$:

$$S_n = a_1 \cdot \frac{q^n - 1}{q - 1} = a_1 \cdot \frac{1 - q^n}{1 - q}$$

Per $q = 1$: $S_n = n \cdot a_1$.

Per $3, 6, 12, \dots$: $S_8 = 3 \cdot \dfrac{2^8 - 1}{2 - 1} = 765$.

## Crescita a percentuale costante

Interesse composto, con capitale iniziale $C_0$ e tasso annuo $i$:

$$C_n = C_0(1 + i)^n$$

- Aumento del $3\%$ a ogni periodo: ragione $1{,}03$.
- Diminuzione del $20\%$ a ogni periodo: ragione $0{,}8$.

```ad-warning
Prima la potenza, poi il prodotto
$3 \cdot 2^7 = 3 \cdot 128 = 384$, non $6^7$. L'esponente è $n - 1$, non $n$.
```

```ad-warning
Con l'esponente pari le ragioni sono due
Da $q^4 = 81$ viene $q = 3$ oppure $q = -3$.
```

```ad-warning
Le percentuali non si sommano
Cinque aumenti del $3\%$ moltiplicano per $1{,}03^5 \approx 1{,}159$, non per $1{,}15$.
```
