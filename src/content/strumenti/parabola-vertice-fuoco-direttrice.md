# Vertice, fuoco e direttrice della parabola

## Che cos'è

La parabola con asse verticale è il grafico di un'equazione $y = ax^2 + bx + c$, con $a$ diverso da $0$.

Il vertice $V$ è il suo punto più basso o più alto. L'asse di simmetria è la retta verticale per il vertice. Il fuoco $F$ e la direttrice $d$ sono un punto e una retta con una proprietà speciale: ogni punto della parabola è lontano dal fuoco quanto dalla direttrice.

## Come si calcola a mano

```ad-example
Esempio: la parabola y = x² - 4x + 3
Qui $a = 1$, $b = -4$ e $c = 3$. Calcola l'ascissa del vertice e sostituiscila per trovare l'ordinata:

$$\begin{aligned}
x_V &= -\frac{b}{2a} = -\frac{-4}{2} = 2 \\[6pt]
y_V &= 2^2 - 4 \cdot 2 + 3 = -1
\end{aligned}$$

Il vertice è $V(2, -1)$ e l'asse è $x = 2$. Con il discriminante $\Delta = 16 - 12 = 4$ trovi il fuoco e la direttrice:

$$\begin{aligned}
y_F &= \frac{1 - \Delta}{4a} = \frac{1 - 4}{4} = -\frac{3}{4} \\[6pt]
y_d &= -\frac{1 + \Delta}{4a} = -\frac{1 + 4}{4} = -\frac{5}{4}
\end{aligned}$$

Il fuoco è $F\left(2, -\frac{3}{4}\right)$ e la direttrice è $y = -\frac{5}{4}$.
```

Le formule generali, con $\Delta = b^2 - 4ac$:

$$\begin{aligned}
V &\left(-\frac{b}{2a}, -\frac{\Delta}{4a}\right) \\[6pt]
F &\left(-\frac{b}{2a}, \frac{1 - \Delta}{4a}\right) \\[6pt]
d&\colon\ y = -\frac{1 + \Delta}{4a}
\end{aligned}$$

### Concavità e intersezioni con gli assi

Il segno di $a$ decide la concavità: con $a > 0$ la parabola è rivolta verso l'alto, con $a < 0$ verso il basso. L'asse $y$ si taglia sempre nel punto $(0, c)$. Per l'asse $x$ si risolve $ax^2 + bx + c = 0$: due punti se $\Delta > 0$, uno solo (il vertice) se $\Delta = 0$, nessuno se $\Delta < 0$.

```ad-error
Errori frequenti
- Dimenticare il meno in $x_V = -\frac{b}{2a}$: con $b = -4$ viene $2$, non $-2$.
- Sbagliare il segno della direttrice: il fuoco sta dentro la parabola, la direttrice fuori.
- Calcolare $b^2$ senza parentesi: $(-4)^2 = 16$.
```

## Domande frequenti

### Come controllo fuoco e direttrice?

Il vertice sta esattamente a metà strada tra i due. Nell'esempio $-\frac{3}{4}$ e $-\frac{5}{4}$ hanno per media $-1$, l'ordinata del vertice.

### Posso trovare $y_V$ senza sostituire?

Sì, con $y_V = -\frac{\Delta}{4a}$. Sostituire $x_V$ nell'equazione dà lo stesso numero ed è un buon controllo.
