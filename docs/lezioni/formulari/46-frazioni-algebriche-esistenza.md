# Formulario: Frazioni algebriche e condizioni di esistenza

## Frazione algebrica e valore

- Frazione algebrica: quoziente di due polinomi, con il denominatore diverso dal polinomio nullo e con almeno una lettera.

$$\frac{A}{B} \qquad \frac{x + 1}{x - 3} \qquad \frac{5}{x}$$

- Valore: sostituisci i numeri alle lettere, calcola numeratore e denominatore, dividi.
- Numeratore zero: la frazione vale $0$, per esempio $\dfrac{0}{4} = 0$.
- Denominatore zero: la frazione non esiste ($\dfrac{8}{0}$ e $\dfrac{0}{0}$ non sono numeri).

## Condizioni di esistenza

Le condizioni di esistenza (C.E.) sono le condizioni sulle lettere perché il denominatore sia diverso da zero. Il numeratore non conta.

$$\frac{3}{x - 2} \qquad \text{C.E.: } x \neq 2$$

Denominatore di primo grado: si esclude il valore che lo annulla.

$$
\begin{aligned}
2x - 3 &\neq 0 \\
x &\neq \frac{3}{2}
\end{aligned}
$$

## Legge di annullamento del prodotto

$$a \cdot b = 0 \iff a = 0 \text{ oppure } b = 0$$

Letta al contrario, per le condizioni di esistenza:

$$a \cdot b \neq 0 \iff a \neq 0 \text{ e } b \neq 0$$

## Procedimento

1. Guarda solo il denominatore.
2. Scomponilo in fattori fino in fondo.
3. Tralascia i fattori numerici.
4. Ogni fattore con le lettere diverso da zero; un fattore ripetuto dà una condizione sola.
5. Scrivi le condizioni insieme: la virgola vuol dire "e".

| Denominatore | Scomposto | C.E. |
|---|---|---|
| $x^2 - 9$ | $(x - 3)(x + 3)$ | $x \neq \pm 3$ |
| $x^2 - 5x + 6$ | $(x - 2)(x - 3)$ | $x \neq 2$, $x \neq 3$ |
| $2x^2 + 6x$ | $2x(x + 3)$ | $x \neq 0$, $x \neq -3$ |
| $x^2 - 4x + 4$ | $(x - 2)^2$ | $x \neq 2$ |
| $a^2 - ab$ | $a(a - b)$ | $a \neq 0$, $a \neq b$ |

## Denominatori che non si annullano mai

Somme di potenze pari con coefficienti positivi più un numero positivo, come $x^2 + 1$, $x^2 + 4$, $3x^2 + 2$: C.E.: nessuna condizione.

Con più frazioni nella stessa espressione, le C.E. sono quelle di tutti i denominatori.

```ad-warning
Dimenticare il valore negativo
$x^2 - 9 \neq 0$ esclude $3$ e anche $-3$: scomponi in $(x - 3)(x + 3)$.
```

```ad-warning
"E", non "oppure"
C.E.: $x \neq 2$, $x \neq 3$ vuol dire diverso da $2$ e anche diverso da $3$.
```

```ad-warning
Fattore comune sopra e sotto
In $\dfrac{x^2 - 1}{x^2 - x}$ la condizione $x \neq 1$ resta anche se $x - 1$ è al numeratore.
```
