# Formulario: Funzioni pari e dispari

## Definizioni

In tutti e due i casi il dominio deve essere simmetrico rispetto allo zero: insieme a ogni $x$ contiene $-x$.

| | Condizione, per ogni $x$ del dominio | Il grafico è simmetrico rispetto a |
|---|---|---|
| pari | $f(-x) = f(x)$ | l'asse $y$ |
| dispari | $f(-x) = -f(x)$ | l'origine |

Esempi: $y = x^4 - 3x^2 + 1$ è pari, $y = x^3 - 3x$ è dispari, $y = x^2 + x$ non è né pari né dispari.

## Come si riconosce

1. Trova il dominio: se non è simmetrico rispetto allo zero, la funzione non è né pari né dispari.
2. Calcola $f(-x)$, con $-x$ tra parentesi, e semplifica.
3. Se viene $f(x)$ è pari; se viene $-f(x)$ è dispari; altrimenti nessuna delle due.

Per dimostrare che una funzione non è pari, o non è dispari, è sufficiente un numero: $f(1) = 2$ e $f(-1) = 0$ per $x^2 + x$.

## Potenze e polinomi

- $x^n$ con $n$ pari è una funzione pari; con $n$ dispari è dispari.
- Polinomio con soli termini di grado pari (termine noto compreso): pari.
- Polinomio con soli termini di grado dispari: dispari.
- Polinomio con termini dei due tipi: né pari né dispari.

## Proprietà

- Se $f$ è dispari ed è definita in $0$, allora $f(0) = 0$.
- L'unica funzione sia pari sia dispari è quella che vale sempre zero.

| $f$ | $g$ | $f \cdot g$ e $\dfrac{f}{g}$ | $f + g$ |
|---|---|---|---|
| pari | pari | pari | pari |
| dispari | dispari | pari | dispari |
| pari | dispari | dispari | né pari né dispari |

L'ultima casella vale se nessuna delle due funzioni è la funzione nulla.

## Usare la simmetria

- Pari: $f(-a) = f(a)$. Il grafico per $x < 0$ è il simmetrico rispetto all'asse $y$ di quello per $x > 0$.
- Dispari: $f(-a) = -f(a)$. Il grafico per $x < 0$ è il simmetrico rispetto all'origine di quello per $x > 0$.

```ad-warning
Il meno dentro e il meno fuori
$f(-x)$ si calcola sostituendo $-x$ tra parentesi, $(-x)^2 = x^2$; $-f(x)$ è l'opposto di tutta la funzione.
```

```ad-warning
Né pari né dispari
"Non pari" non vuol dire "dispari": la maggior parte delle funzioni non è né l'una né l'altra.
```

```ad-warning
Il dominio prima del conto
$y = \dfrac{x^2}{x - 1}$ ha dominio $\mathbb{R} \setminus \{1\}$, non simmetrico: non è né pari né dispari, senza calcolare $f(-x)$.
```
