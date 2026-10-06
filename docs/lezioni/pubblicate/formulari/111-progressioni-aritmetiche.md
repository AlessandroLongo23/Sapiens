# Formulario: Progressioni aritmetiche

## Definizione e ragione

Progressione aritmetica: una successione in cui la differenza tra ogni termine e il precedente è costante. La differenza è la ragione $d$.

$$a_{n+1} - a_n = d \qquad a_{n+1} = a_n + d$$

| Ragione | Progressione | Esempio |
|---|---|---|
| $d > 0$ | crescente | $3, 7, 11, 15, \dots$ |
| $d < 0$ | decrescente | $10, 7, 4, 1, \dots$ |
| $d = 0$ | costante | $5, 5, 5, \dots$ |

## Termine generale

$$a_n = a_1 + (n - 1)d$$

- Per $5, 8, 11, \dots$: $a_{20} = 5 + 19 \cdot 3 = 62$.
- Forma di primo grado in $n$: $a_n = dn + (a_1 - d)$. Una successione $a_n = pn + q$ è una progressione aritmetica di ragione $p$.
- Grafico: i punti $(n, a_n)$ sono allineati sulla retta $y = dx + (a_1 - d)$, di coefficiente angolare $d$.

## Da un termine a un altro

$$a_n = a_k + (n - k)d \qquad d = \frac{a_n - a_k}{n - k}$$

Con $a_4 = 11$ e $a_{10} = 35$: $d = \dfrac{24}{6} = 4$ e $a_1 = 11 - 3 \cdot 4 = -1$.

## Medio aritmetico

Ogni termine, dal secondo in poi, è la media aritmetica dei due vicini:

$$a_n = \frac{a_{n-1} + a_{n+1}}{2}$$

- Tre numeri in progressione aritmetica: $x - d$, $x$, $x + d$.
- Inserire $k$ medi aritmetici tra $a$ e $b$: $d = \dfrac{b - a}{k + 1}$. Quattro medi tra $4$ e $24$: $d = 4$, cioè $8, 12, 16, 20$.

## Somma dei primi n termini

Termini equidistanti dagli estremi: $a_{1+k} + a_{n-k} = a_1 + a_n$.

$$S_n = \frac{n(a_1 + a_n)}{2}$$

$$S_n = \frac{n\,[2a_1 + (n - 1)d]}{2}$$

Numero dei termini da $a_1$ ad $a_n$:

$$n = \frac{a_n - a_1}{d} + 1$$

Somme da ricordare:

$$1 + 2 + 3 + \dots + n = \frac{n(n + 1)}{2}$$

$$1 + 3 + 5 + \dots + (2n - 1) = n^2$$

```ad-warning
I passi sono n − 1
$a_5 = a_1 + 4d$, non $a_1 + 5d$.
```

```ad-warning
Il più uno nel numero dei termini
Da $105$ a $294$ con passo $7$ i termini sono $\dfrac{294 - 105}{7} + 1 = 28$, non $27$.
```

```ad-warning
Il segno della ragione
In $12, 7, 2, \dots$ la ragione è $7 - 12 = -5$: termine dopo meno termine prima.
```
