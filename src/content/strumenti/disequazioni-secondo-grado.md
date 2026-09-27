# Disequazioni di secondo grado

## Che cos'è una disequazione di secondo grado

Una disequazione di secondo grado è una disuguaglianza che, dopo i calcoli, si scrive come $ax^2 + bx + c > 0$ (o con $\geq$, $<$, $\leq$), con $a$ diverso da zero.

Chiede per quali $x$ il trinomio $ax^2 + bx + c$ è positivo, o negativo. Il suo grafico è una parabola: il trinomio è positivo dove la parabola sta sopra l'asse $x$ e negativo dove sta sotto.

## Come si risolve a mano

Prima porta tutto a sinistra. Se $a$ è negativo, moltiplica tutto per $-1$ e cambia il verso: così la parabola è rivolta verso l'alto.

Poi risolvi l'equazione associata $ax^2 + bx + c = 0$. Le sue soluzioni sono i punti in cui la parabola incontra l'asse $x$.

```ad-example
Esempio: −x² + 2x + 3 < 0
Moltiplica per $-1$ e cambia il verso, poi calcola le radici:

$$\begin{aligned}
x^2 - 2x - 3 &> 0 \\
\Delta &= 4 + 12 = 16 \\
x_{1,2} &= \frac{2 \pm 4}{2}
\end{aligned}$$

Le radici sono $-1$ e $3$. Il trinomio è positivo fuori dalle radici, quindi le soluzioni sono $x < -1$ oppure $x > 3$.
```

Con $a > 0$ la regola dipende dal discriminante $\Delta = b^2 - 4ac$.

Se $\Delta > 0$ ci sono due radici $x_1 < x_2$: il trinomio è positivo per i valori esterni, $x < x_1$ oppure $x > x_2$, e negativo per quelli interni, $x_1 < x < x_2$.

Se $\Delta = 0$ la parabola tocca l'asse in un punto solo: il trinomio non è mai negativo e vale zero solo in $x_1$.

Se $\Delta < 0$ la parabola sta tutta sopra l'asse: il trinomio è sempre positivo.

```ad-example
Esempio con i radicali: x² < 2x + 1
La forma normale è $x^2 - 2x - 1 < 0$. Il discriminante è $8$:

$$\begin{aligned}
x_{1,2} &= \frac{2 \pm \sqrt{8}}{2} \\
&= \frac{2 \pm 2\sqrt{2}}{2} \\
&= 1 \pm \sqrt{2}
\end{aligned}$$

Il verso è $<$: servono i valori interni, $1 - \sqrt{2} < x < 1 + \sqrt{2}$.
```

```ad-error
Errori frequenti
- Moltiplicare per $-1$ senza cambiare il verso: $-x^2 + 4x - 3 \geq 0$ diventa $x^2 - 4x + 3 \leq 0$.
- Rispondere "nessuna soluzione" quando $\Delta < 0$ senza guardare il verso: $x^2 + 1 > 0$ è vera per ogni $x$.
- Scambiare valori esterni e interni: con $a > 0$ il trinomio è negativo tra le radici.
```

## Domande frequenti

### Perché serve $a$ positivo?

Con $a > 0$ la parabola è rivolta verso l'alto e la regola è sempre la stessa. Moltiplicare per $-1$ e cambiare il verso dà una disequazione equivalente, più facile da leggere.

### Che cosa vuol dire $S = \mathbb{R} \setminus \{2\}$?

Tutti i numeri reali tranne $2$. Succede per esempio con $x^2 - 4x + 4 > 0$, che è $(x - 2)^2 > 0$: un quadrato è positivo sempre, tranne quando vale zero.
