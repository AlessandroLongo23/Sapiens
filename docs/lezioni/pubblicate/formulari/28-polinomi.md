# Formulario: Polinomi e grado di un polinomio

## Polinomio e termini

- Polinomio: somma algebrica di monomi, che si chiamano termini; ogni termine ha il segno che ha davanti. $2x^3 - x + 7$ ha i termini $2x^3$, $-x$, $7$.
- Un monomio è un polinomio con un solo termine.
- Binomio, trinomio, quadrinomio: due, tre, quattro termini, contati in forma normale.
- Non è un polinomio se una lettera sta al denominatore: $\frac{2}{x} + 1$ no, $\frac{x}{2} + 1$ sì.

## Forma normale

In forma normale ogni termine è un monomio in forma normale e non ci sono termini simili.

1. Scrivi in forma normale ogni monomio.
2. Cerca i termini simili.
3. Somma i loro coefficienti, con il segno.
4. Cancella i termini con coefficiente $0$.
5. Ordina secondo le potenze decrescenti di una lettera.

$$
\begin{aligned}
&3x^2 - 2x + 5 - x^2 + 4x - 7 \\
&= 2x^2 + 2x - 2
\end{aligned}
$$

## Termine noto e grado

- Termine noto: il termine senza lettere; se non c'è, vale $0$.
- Grado: il grado più alto tra i termini del polinomio ridotto.
- Grado rispetto a una lettera: l'esponente più alto di quella lettera.

$$
\begin{gathered}
3x^2y^3 - 5x^4 + 2xy - 1 \\
\text{grado } 5,\ \text{rispetto a } x \ 4,\ \text{rispetto a } y \ 3
\end{gathered}
$$

- Un numero diverso da $0$ ha grado $0$.
- Il polinomio nullo, $0$, non ha grado.

## Ordinato, completo, omogeneo

| Il polinomio è | se | Esempio |
|---|---|---|
| ordinato secondo le potenze decrescenti di $x$ | gli esponenti di $x$ diminuiscono da sinistra a destra | $5x^4 - 2x^3 + x - 6$ |
| completo rispetto a $x$ | ci sono tutte le potenze di $x$, dalla più alta fino a $x^0$ | $x^3 - 2x^2 + x - 5$ |
| omogeneo | tutti i termini hanno lo stesso grado | $x^3 - 2x^2y + 5y^3$ |

Un polinomio incompleto si completa con termini di coefficiente $0$: $x^3 + 2x - 1 = x^3 + 0x^2 + 2x - 1$.

## Valore numerico e $P(x)$

1. Sostituisci ogni lettera con il suo numero, tra parentesi.
2. Calcola potenze, poi prodotti, poi somme.

$$
\begin{gathered}
2x^2 - 3x + 1 \ \text{per}\ x = -2: \\
2(-2)^2 - 3(-2) + 1 = 15
\end{gathered}
$$

- Con tutte le lettere uguali a $0$ ottieni il termine noto; con tutte uguali a $1$, la somma dei coefficienti.
- $P(x)$ è un polinomio nella variabile $x$; $P(2)$ è il suo valore numerico per $x = 2$.
- Coefficiente direttore: il coefficiente del termine di grado più alto.

$$
\begin{gathered}
P(x) = 2x^3 - x + 4 \\
P(2) = 18 \qquad P(-1) = 3 \\
P(0) = 4
\end{gathered}
$$

```ad-warning
Il grado non è la somma dei gradi
$x^3 + x^2$ ha grado $3$, non $5$. E si riduce prima: $x^3 + 2x - x^3 = 2x$ ha grado $1$.
```

```ad-warning
Completo vuol dire fino al termine noto
$x^3 + x^2 + x$ non è completo: manca la potenza $x^0$.
```

```ad-warning
Il meno davanti alla potenza
Per $x = -3$: $x^2 = (-3)^2 = 9$, ma $-x^2 = -(-3)^2 = -9$.
```
