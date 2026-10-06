# Formulario: Funzioni periodiche

## Definizione

$f$ è periodica se esiste $T > 0$ tale che, per ogni $x$ del dominio, anche $x + T$ e $x - T$ sono nel dominio e

$$f(x + T) = f(x)$$

Periodo: il più piccolo numero positivo $T$ per cui vale. Il grafico è un tratto largo $T$ ricopiato uguale verso destra e verso sinistra.

## Multipli del periodo

Per ogni intero $k$:

$$f(x + kT) = f(x)$$

Sul grafico il periodo si misura tra due cime consecutive.

## Calcolare un valore

1. Togli o aggiungi $T$ a $x$ fino ad arrivare a un numero $x_0$ dell'intervallo in cui conosci la funzione.
2. $f(x) = f(x_0)$.

Con $T = 4$: $f(10) = f(2)$, $f(-3) = f(1)$, $f(2025) = f(1)$ perché $2025 = 506 \cdot 4 + 1$.

## Parte intera e parte frazionaria

- Parte intera $\lfloor x \rfloor$: il più grande intero che non supera $x$. $\lfloor 2{,}7 \rfloor = 2$, $\lfloor -1{,}3 \rfloor = -2$.
- Parte frazionaria: $\operatorname{mant}(x) = x - \lfloor x \rfloor$, sempre tra $0$ incluso e $1$ escluso. $\operatorname{mant}(2{,}7) = 0{,}7$, $\operatorname{mant}(-1{,}3) = 0{,}7$.
- $y = \operatorname{mant}(x)$ è periodica di periodo $1$, con il grafico a dente di sega.

## Cambiare il periodo

Se $f$ ha periodo $T$ e $k > 0$, la funzione $f(kx)$ ha periodo

$$\frac{T}{k}$$

Hanno ancora periodo $T$: $f(x) + c$, $c \cdot f(x)$ con $c \neq 0$, $f(x - a)$.

## Zeri e funzioni non periodiche

- Se $x_0$ è uno zero, lo sono tutti i numeri $x_0 + kT$.
- Una funzione crescente o decrescente non è periodica.
- $y = x^2$ non è periodica: $f(0 + T) = f(0)$ darebbe $T = 0$.
- Una funzione costante è periodica ma non ha periodo.

```ad-warning
Il periodo è il più piccolo
Se $f(x + 8) = f(x)$ ma il tratto che si ripete è lungo $4$, il periodo è $4$.
```

```ad-warning
Moltiplicare la x divide il periodo
Se $f$ ha periodo $6$, $f(3x)$ ha periodo $2$, non $18$.
```

```ad-warning
La parte intera dei negativi
$\lfloor -1{,}3 \rfloor = -2$, non $-1$.
```
