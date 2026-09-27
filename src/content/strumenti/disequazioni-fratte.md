# Disequazioni fratte

## Che cos'è una disequazione fratta

Una disequazione fratta è una disequazione con la $x$ al denominatore, scritta come una frazione confrontata con zero: $\dfrac{N(x)}{D(x)} > 0$, oppure con $\geq$, $<$, $\leq$. Chiede per quali $x$ la frazione è positiva, o negativa.

## Come si risolve a mano

Il denominatore non si elimina, perché non si sa se è positivo o negativo. Si studia invece il segno di ogni fattore.

Scrivi le condizioni di esistenza (C.E.): il denominatore diverso da zero. Poi trova dove è positivo ciascun fattore del numeratore e del denominatore. Un fattore di secondo grado si studia con il discriminante e il segno di $a$, su una riga sola.

Metti tutto nella tabella dei segni: in alto gli zeri in ordine crescente, una riga per fattore, in fondo il segno della frazione con la regola dei segni.

```ad-example
Esempio: (x² − 2x − 3)/(x − 2) ≥ 0
C.E.: $x \neq 2$. Il numeratore ha $\Delta = 16$ e si annulla in $-1$ e in $3$:

$$\begin{aligned}
x^2 - 2x - 3 > 0 &\;\Rightarrow\; x < -1 \;\text{ oppure }\; x > 3 \\
x - 2 > 0 &\;\Rightarrow\; x > 2
\end{aligned}$$

Dalla tabella dei segni la frazione è positiva tra $-1$ e $2$ e dopo $3$. Il verso è $\geq$: entrano gli zeri del numeratore, mentre il $2$ resta escluso.

$$S = \left[ -1, 2 \right[ \cup \left[ 3, +\infty \right[$$
```

```ad-error
Errori frequenti
- Moltiplicare i due membri per il denominatore: il verso andrebbe cambiato dove è negativo.
- Includere gli zeri del denominatore con $\geq$ o $\leq$: lì la frazione non esiste.
- Con $a < 0$ usare la regola di $a > 0$: $4 - x^2$ è positivo tra $-2$ e $2$.
```

## Domande frequenti

### E se il secondo membro non è zero?

Porta tutto a primo membro e riduci a una frazione sola. Per esempio $\dfrac{2x + 1}{x - 3} < 1$ diventa $\dfrac{x + 4}{x - 3} < 0$. Poi scrivi il nuovo numeratore e il nuovo denominatore nel calcolatore.

### Perché un prodotto ha più righe?

Se scrivi il denominatore come $x(x - 1)$, ogni fattore ha la sua riga, come nella lezione. Un trinomio scritto per intero, come $x^2 - x$, ha una riga sola: il risultato è lo stesso.
