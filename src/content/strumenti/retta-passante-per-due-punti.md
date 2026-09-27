# Retta passante per due punti

## Che cos'è

L'equazione di una retta è un'uguaglianza in $x$ e $y$ che è vera per le coordinate di tutti i suoi punti, e solo per quelle.

Per due punti diversi passa una retta sola. La sua pendenza è il coefficiente angolare $m$: dice di quanto sale la retta quando ti sposti di $1$ verso destra.

## Come si calcola a mano

```ad-example
Esempio: la retta per A(1, 1) e B(4, 3)
Calcola il coefficiente angolare, poi scrivi la retta per $A$ con quella pendenza e ricava $y$:

$$\begin{aligned}
m &= \frac{y_B - y_A}{x_B - x_A} = \frac{3 - 1}{4 - 1} = \frac{2}{3} \\[6pt]
y - 1 &= \frac{2}{3}(x - 1) \\[6pt]
y &= \frac{2}{3}x + \frac{1}{3}
\end{aligned}$$

Per la forma implicita moltiplica per $3$ e porta tutto a primo membro: $2x - 3y + 1 = 0$.
```

Le due formule generali sono queste. La prima dà la pendenza, la seconda la retta per un punto $P(x_0, y_0)$ con coefficiente angolare $m$:

$$\begin{aligned}
m &= \frac{y_B - y_A}{x_B - x_A} \\[6pt]
y - y_0 &= m(x - x_0)
\end{aligned}$$

La forma esplicita è $y = mx + q$, dove $q$ è l'ordinata del punto in cui la retta taglia l'asse $y$. La forma implicita è $ax + by + c = 0$, di solito con i coefficienti interi e $a$ positivo.

### Casi particolari

Se i due punti hanno la stessa ordinata, $m = 0$ e la retta è orizzontale: $y = k$. Se hanno la stessa ascissa la retta è verticale, $x = h$, e non ha coefficiente angolare, perché si dovrebbe dividere per zero.

### Parallele e perpendicolari

Due rette parallele hanno lo stesso $m$. Due rette perpendicolari hanno coefficienti angolari antireciproci: il prodotto fa $-1$. La perpendicolare a una retta con $m = \frac{3}{2}$ ha $m = -\frac{2}{3}$.

```ad-error
Errori frequenti
- Capovolgere la frazione: sopra va la differenza delle $y$, sotto quella delle $x$.
- Sottrarre in ordine diverso sopra e sotto: il segno di $m$ viene sbagliato.
- Scrivere $m = 0$ per una retta verticale: $m = 0$ è la retta orizzontale.
```

## Domande frequenti

### Come controllo l'equazione?

Sostituisci le coordinate dell'altro punto. Con $B(4, 3)$ e $y = \frac{2}{3}x + \frac{1}{3}$ viene $\frac{8}{3} + \frac{1}{3} = 3$: la retta passa per $B$.

### Quale forma devo scrivere?

Dipende dall'esercizio. La forma esplicita fa leggere subito $m$ e $q$; quella implicita vale anche per le rette verticali.
