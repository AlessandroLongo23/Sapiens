# Formulario: Successioni numeriche

## Successione, termini, indice

Successione numerica: una funzione che a ogni numero naturale $n \geq 1$ associa un numero reale $a_n$.

$$a_1,\ a_2,\ a_3,\ \dots,\ a_n,\ \dots$$

- $a_n$ è il termine di posto $n$; $n$ è l'indice.
- I termini sono infiniti, l'ordine conta e i valori possono ripetersi: $1, 0, 1, 0, \dots$
- $a_{n+1}$ è il termine che segue $a_n$: si ottiene mettendo $n + 1$ al posto di $n$.

## Come si assegna una successione

Con il termine generale, cioè $a_n$ in funzione di $n$. Per $a_n = n^2 - 3n$: $a_1 = -2$, $a_4 = 4$, $a_{10} = 70$.

Per ricorsione, con il primo termine e la legge di ricorrenza:

$$
\begin{cases}
a_1 = 3 \\
a_{n+1} = 2a_n - 1
\end{cases}
\qquad 3,\ 5,\ 9,\ 17,\ 33,\ \dots
$$

Successione di Fibonacci: $a_1 = 1$, $a_2 = 1$, $a_{n+2} = a_{n+1} + a_n$, cioè $1, 1, 2, 3, 5, 8, 13, \dots$

Segni alterni: $(-1)^n$ vale $1$ per $n$ pari e $-1$ per $n$ dispari; $(-1)^{n+1}$ il contrario.

Un numero è un termine della successione se l'equazione $a_n = \text{numero}$ ha una soluzione $n$ naturale, con $n \geq 1$.

## Grafico

I punti $(n, a_n)$, isolati: non si uniscono.

## Successioni monotone

| Successione | Condizione per ogni $n$ |
|---|---|
| crescente | $a_{n+1} > a_n$ |
| decrescente | $a_{n+1} < a_n$ |
| non decrescente | $a_{n+1} \geq a_n$ |
| non crescente | $a_{n+1} \leq a_n$ |
| costante | $a_{n+1} = a_n$ |

Come si stabilisce:

1. Scrivi $a_{n+1}$.
2. Calcola e semplifica $a_{n+1} - a_n$.
3. Studia il segno per $n \geq 1$: sempre positiva, crescente; sempre negativa, decrescente; cambia segno, non monotona.

Per $a_n = \dfrac{2n - 1}{n}$: $a_{n+1} - a_n = \dfrac{1}{n(n + 1)} > 0$, crescente.

## Successioni limitate

| Successione | Condizione per ogni $n$ |
|---|---|
| limitata superiormente | esiste $M$ con $a_n \leq M$ |
| limitata inferiormente | esiste $m$ con $a_n \geq m$ |
| limitata | esistono $m$ e $M$ con $m \leq a_n \leq M$ |

- $a_n = 2 - \dfrac{1}{n}$: limitata, $1 \leq a_n < 2$.
- $a_n = n^2$: limitata inferiormente, non superiormente.
- $a_n = (-1)^n$: limitata, non monotona.
- Una successione crescente è limitata inferiormente da $a_1$; una decrescente è limitata superiormente da $a_1$.

```ad-warning
Il termine successivo
$a_{n+1}$ non è $a_n + 1$: per $a_n = n^2 - 3n$ è $a_{n+1} = n^2 - n - 2$.
```

```ad-warning
I primi termini non bastano
$a_n = n^2 - 6n$ comincia con $-5, -8, -9$ ma non è decrescente: $a_{n+1} - a_n = 2n - 5$ cambia segno.
```

```ad-warning
Senza il primo termine la ricorsione non parte
Con $a_{n+1} = 2a_n - 1$: da $a_1 = 3$ viene $3, 5, 9, \dots$, da $a_1 = 1$ viene $1, 1, 1, \dots$
```
