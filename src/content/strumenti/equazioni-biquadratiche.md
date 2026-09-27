# Equazioni biquadratiche

## Che cos'è un'equazione biquadratica

Un'equazione biquadratica è un'equazione di quarto grado con solo la $x^4$, la $x^2$ e il termine noto:

$$ax^4 + bx^2 + c = 0$$

Mancano la $x^3$ e la $x$. Per questo si risolve con un'equazione di secondo grado.

## Come si risolve a mano

Poni $t = x^2$. Allora $x^4 = (x^2)^2 = t^2$, e l'equazione diventa $at^2 + bt + c = 0$, di secondo grado nella nuova incognita $t$. Risolvila con il discriminante e la formula risolutiva.

Poi torna alla $x$: per ogni soluzione $t$ risolvi $x^2 = t$.

```ad-example
Esempio: x⁴ − 5x² + 4 = 0
Con $t = x^2$ diventa $t^2 - 5t + 4 = 0$, che ha le soluzioni $t_1 = 1$ e $t_2 = 4$. Torna alla $x$:

$$\begin{aligned}
x^2 = 1 &\;\Rightarrow\; x = \pm 1 \\
x^2 = 4 &\;\Rightarrow\; x = \pm 2
\end{aligned}$$

Le soluzioni sono quattro: $S = \{-2,\ -1,\ 1,\ 2\}$.
```

Una soluzione $t$ negativa non dà nessuna $x$, perché un quadrato non è mai negativo. Con $t = 0$ si ha solo $x = 0$.

```ad-example
Esempio con una t da scartare: x⁴ + 3x² − 4 = 0
Le soluzioni in $t$ sono $t_1 = -4$ e $t_2 = 1$. L'equazione $x^2 = -4$ non ha soluzioni e si scarta; da $x^2 = 1$ viene $x = \pm 1$. Quindi $S = \{-1,\ 1\}$.
```

```ad-error
Errori frequenti
- Fermarsi alle soluzioni in $t$: le soluzioni dell'equazione sono i valori di $x$.
- Dimenticare il segno meno: da $x^2 = 4$ vengono $x = 2$ e $x = -2$.
- Cercare la radice di una $t$ negativa invece di scartarla.
```

## Domande frequenti

### Quante soluzioni può avere?

Al massimo quattro, due per ogni $t$ positiva. Ne ha due se una sola $t$ è positiva, una sola ($x = 0$) se l'unica $t$ non negativa è zero, nessuna se le $t$ sono negative o non esistono.

### E se $t$ non è un numero intero?

Si procede allo stesso modo. Con $t = \dfrac{3 + \sqrt{5}}{2}$ le soluzioni sono $x = \pm\sqrt{\dfrac{3 + \sqrt{5}}{2}}$: il calcolatore le lascia così e ne dà il valore approssimato.
