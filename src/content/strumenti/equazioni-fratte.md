# Equazioni fratte

## Che cos'è un'equazione fratta

Un'equazione fratta è un'equazione in cui la $x$ compare in almeno un denominatore, come $\dfrac{3}{x - 2} = \dfrac{5}{x}$.

Una frazione con denominatore zero non ha significato. Per questo, prima di tutto, si escludono i valori che annullano un denominatore: sono le condizioni di esistenza, in breve C.E.

## Come si risolve a mano

Scomponi i denominatori e scrivi le C.E. Poi calcola il mcm dei denominatori, scrivi i due membri con il mcm sotto e togli il denominatore. Resta un'equazione intera, senza la $x$ sotto.

```ad-example
Esempio: 3/(x − 2) = 5/x
C.E.: $x \neq 0$ e $x \neq 2$. Il mcm è $x(x - 2)$:

$$\begin{aligned}
\frac{3x}{x(x - 2)} &= \frac{5(x - 2)}{x(x - 2)} \\
3x &= 5x - 10 \\
x &= 5
\end{aligned}$$

Il $5$ rispetta le C.E.: è accettabile, e $S = \{5\}$.
```

L'ultimo passo è il confronto con le C.E. Una soluzione dell'equazione intera che annulla un denominatore non è accettabile e si scarta.

```ad-example
Esempio con una soluzione da scartare: x/(x − 2) = 2/(x − 2)
C.E.: $x \neq 2$. Tolto il denominatore resta $x = 2$, proprio il valore escluso. La soluzione non è accettabile: $S = \emptyset$.
```

```ad-error
Errori frequenti
- Semplificare prima di scrivere le C.E.: in $\dfrac{x^2 - 4}{x - 2} = 4$ il $2$ va escluso anche se il fattore $x - 2$ si semplifica.
- Usare come mcm il prodotto di tutti i denominatori: con $x$ e $2x$ il mcm è $2x$, non $2x^2$.
- Dimenticare di moltiplicare anche i termini senza frazione, come il $3$ in $\dfrac{x}{x - 1} = 3$.
- Trattare $1 - x$ e $x - 1$ come fattori diversi: sono opposti, $1 - x = -(x - 1)$.
```

## Domande frequenti

### Perché si possono eliminare i denominatori?

Moltiplicare i due membri per lo stesso numero diverso da zero dà un'equazione equivalente. Per le C.E. il mcm non è zero, quindi si può fare. Per i valori esclusi invece non vale, e da qui nascono le soluzioni da scartare.

### Come si scrive una frazione nel calcolatore?

Con la barra $/$ e il denominatore tra parentesi: `3/(x - 2)`. Tutto quello che segue la barra, fino al segno $+$ o $-$ successivo, è il denominatore: `1/2x` vuol dire $\dfrac{1}{2x}$.
