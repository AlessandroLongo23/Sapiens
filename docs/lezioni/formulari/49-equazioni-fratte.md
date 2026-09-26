# Formulario: Equazioni fratte

## Equazione fratta e condizioni di esistenza

- Equazione fratta: l'incognita compare in almeno un denominatore, come $\dfrac{12}{x} = 3$. Se non compare in nessun denominatore l'equazione è intera.
- Condizioni di esistenza (C.E.): i valori dell'incognita che non annullano nessun denominatore. Si scompone ogni denominatore e si pone ogni fattore diverso da zero.

$$
\begin{gathered}
\frac{3}{x^2 - 4} = \frac{1}{x} \\
\text{C.E.: } x \neq -2, \ x \neq 0, \ x \neq 2
\end{gathered}
$$

- $x^2 + 1$ non si annulla mai: nessuna condizione.
- Le C.E. si scrivono sui denominatori di partenza, prima di semplificare.

## Come si risolve

1. Scomponi i denominatori e scrivi le C.E.
2. Calcola il MCM dei denominatori e riduci i due membri a frazioni con il MCM come denominatore.
3. Elimina il denominatore: per le C.E. il MCM è diverso da zero.
4. Risolvi l'equazione intera.
5. Confronta la soluzione con le C.E.: accettabile se le rispetta, non accettabile se è un valore escluso.

$$
\begin{gathered}
\frac{3}{x - 2} = \frac{5}{x} \\
\text{C.E.: } x \neq 0, \ x \neq 2 \\
3x = 5(x - 2) \ \Rightarrow \ x = 5 \\
S = \{5\}
\end{gathered}
$$

Denominatori opposti: $\dfrac{2}{1 - x} = -\dfrac{2}{x - 1}$, e il MCM contiene $x - 1$ una volta sola.

## Soluzioni accettabili, impossibili e indeterminate

| Equazione intera | Confronto con le C.E. | Equazione fratta |
|---|---|---|
| una soluzione | la rispetta | determinata, $S = \{\text{soluzione}\}$ |
| una soluzione | è un valore escluso | impossibile, $S = \emptyset$ |
| impossibile | non serve | impossibile, $S = \emptyset$ |
| indeterminata | non serve | indeterminata, $S$ = tutti i numeri tranne i valori esclusi |

$$
\begin{gathered}
\frac{x}{x - 2} = \frac{2}{x - 2} \\
\text{C.E.: } x \neq 2 \\
x = 2 \text{ non accettabile} \\
S = \emptyset
\end{gathered}
$$

Indeterminata con C.E.: $x \neq -1$, $x \neq 2$:

$$S = \mathbb{R} \setminus \{-1, 2\}$$

```ad-warning
Dimenticare il confronto con le C.E.
Da $\dfrac{x}{x - 2} = \dfrac{2}{x - 2}$ si arriva a $x = 2$, che è escluso: $S = \emptyset$, non $\{2\}$.
```

```ad-warning
Dimenticare i termini senza denominatore
In $\dfrac{x + 1}{x - 3} - 2 = \dfrac{4}{x - 3}$ anche il $2$ si moltiplica per $x - 3$: $x + 1 - 2(x - 3) = 4$.
```

```ad-warning
Moltiplicare "in croce" una somma
Il prodotto in croce vale solo con una frazione per membro. $\dfrac{1}{x} + 1 = \dfrac{2}{x}$ diventa $1 + x = 2$.
```
