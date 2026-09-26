# Formulario: Operazioni tra polinomi

## Somma algebrica

Togli le parentesi e riduci i termini simili.

- Parentesi preceduta da $+$: i termini restano come sono, $+(2x - 5) = 2x - 5$.
- Parentesi preceduta da $-$: cambi il segno a ogni termine, $-(2x - 5) = -2x + 5$.

Polinomio opposto: $-P$ ha tutti i termini di $P$ con il segno cambiato, e $P + (-P) = 0$. Sottrarre un polinomio vuol dire sommare il suo opposto.

$$
\begin{aligned}
&(2x^2y - 3xy + y^2) \\
&\quad - (x^2y - 3xy - 4y^2) \\
&= x^2y + 5y^2
\end{aligned}
$$

## Prodotto di un monomio per un polinomio

Proprietà distributiva: moltiplichi il monomio per ciascun termine.

$$a(b + c) = ab + ac$$

$$
\begin{aligned}
&-3x^2y\,(2x^2 - xy + 4y^2) \\
&= -6x^4y + 3x^3y^2 - 12x^2y^3
\end{aligned}
$$

## Prodotto di due polinomi

Ogni termine del primo per ogni termine del secondo:

$$(a + b)(c + d) = ac + ad + bc + bd$$

1. Moltiplica il primo termine del primo polinomio per tutti i termini del secondo.
2. Fai lo stesso con gli altri termini del primo polinomio.
3. Riduci i termini simili.
4. Ordina secondo le potenze decrescenti di una lettera.

Con $m$ termini per $n$ termini, prima della riduzione i prodotti sono $m \cdot n$.

$$
\begin{aligned}
&(2x - 3)(x^2 - 4x + 5) \\
&= 2x^3 - 11x^2 + 22x - 15
\end{aligned}
$$

Controllo: sostituisci un numero (per esempio $x = 2$) nel prodotto e nel risultato; i due valori devono essere uguali.

## Grado della somma e del prodotto

| Operazione | Grado del risultato |
|---|---|
| Prodotto di polinomi non nulli | somma dei gradi |
| Somma algebrica | al massimo il più grande dei due; minore se i termini di grado più alto si annullano |
| Divisione per un monomio, quando si può fare | grado del polinomio meno grado del monomio |

## Divisione di un polinomio per un monomio

Dividi ciascun termine per il monomio $M \neq 0$:

$$
\begin{aligned}
&(A + B + C) : M \\
&= A : M + B : M + C : M
\end{aligned}
$$

Il quoziente è un polinomio solo se ogni lettera di $M$ compare in ogni termine con un esponente maggiore o uguale.

$$
\begin{aligned}
&(12x^4y^2 - 8x^3y^3 + 4x^2y) : (4x^2y) \\
&= 3x^2y - 2xy^2 + 1
\end{aligned}
$$

Controllo: quoziente per monomio dà il polinomio di partenza.

```ad-warning
Il meno davanti alla parentesi
$-(x^2 - 3x + 1) = -x^2 + 3x - 1$: cambia segno a tutti i termini, non solo al primo.
```

```ad-warning
Tutti i prodotti
$(x + 2)(x + 5) = x^2 + 7x + 10$, non $x^2 + 10$: mancano i prodotti $x \cdot 5$ e $2 \cdot x$.
```

```ad-warning
Il termine che diventa 1
$4x^2y : 4x^2y = 1$, e l'$1$ resta nel quoziente.
```
