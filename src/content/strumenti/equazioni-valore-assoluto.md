# Equazioni con il valore assoluto

## Che cos'è un'equazione con il valore assoluto

È un'equazione in cui la $x$ compare dentro un valore assoluto, come $|2x - 3| = 5$. Il valore assoluto di un numero è il numero senza segno: $|5| = 5$ e $|-5| = 5$. L'espressione dentro le barre si chiama argomento.

## Come si risolve a mano

Se dall'altra parte c'è un numero $k$, i casi sono tre. Con $k$ negativo l'equazione è impossibile, perché un valore assoluto non è mai negativo. Con $k = 0$ l'argomento vale zero. Con $k$ positivo l'argomento vale $k$ oppure $-k$.

```ad-example
Esempio: |2x − 3| = 5
L'argomento vale $5$ oppure $-5$:

$$\begin{aligned}
2x - 3 = 5 &\;\Rightarrow\; x = 4 \\
2x - 3 = -5 &\;\Rightarrow\; x = -1
\end{aligned}$$

Le soluzioni sono $S = \{-1,\ 4\}$.
```

Se dall'altra parte c'è la $x$, si studia il segno dell'argomento. Dove l'argomento è positivo o zero, le barre si tolgono; dove è negativo, si cambia il segno dell'argomento. Ogni caso dà un'equazione di primo grado, e la sua soluzione si tiene solo se rispetta la condizione del caso.

```ad-example
Esempio: |2x − 3| = x + 1
L'argomento è positivo o zero per $x \geq \frac{3}{2}$. I due casi:

$$\begin{aligned}
x \geq \tfrac{3}{2}: \quad 2x - 3 = x + 1 &\;\Rightarrow\; x = 4 \\
x < \tfrac{3}{2}: \quad -2x + 3 = x + 1 &\;\Rightarrow\; x = \tfrac{2}{3}
\end{aligned}$$

Tutte e due rispettano la loro condizione: $S = \left\{\frac{2}{3},\ 4\right\}$.
```

```ad-error
Errori frequenti
- Scrivere $2x - 3 = \pm(x + 1)$ senza controllare: la soluzione va confrontata con la condizione del suo caso, oppure verificata nell'equazione.
- Nel secondo caso cambiare il segno solo al primo termine: $-(2x - 3)$ è $-2x + 3$.
- Risolvere $|x + 2| = -3$: è impossibile, senza fare calcoli.
```

## Domande frequenti

### Perché si fa la verifica?

Sostituire la soluzione nell'equazione di partenza trova gli errori di conto e le soluzioni che non rispettano il loro caso. Il calcolatore la fa per ogni soluzione accettata.

### Le soluzioni possono essere infinite?

Sì. In $|x - 1| = x - 1$ il primo caso dà un'uguaglianza vera per ogni $x \geq 1$, e le soluzioni sono tutto l'intervallo $\left[ 1, +\infty \right[$.
