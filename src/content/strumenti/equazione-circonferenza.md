# Equazione della circonferenza

## Che cos'è

L'equazione della circonferenza è la condizione che soddisfano tutti e soli i punti a distanza $r$ dal centro $C(x_C, y_C)$.

Si può scrivere con il centro e il raggio, $(x - x_C)^2 + (y - y_C)^2 = r^2$, oppure sviluppata, nella forma $x^2 + y^2 + ax + by + c = 0$.

## Come si calcola a mano

```ad-example
Dal centro C(2, -3) e dal raggio 5
Scrivi l'equazione con il centro e il raggio, sviluppa i quadrati e porta tutto a sinistra:

$$\begin{aligned}
(x - 2)^2 + (y + 3)^2 &= 25 \\[6pt]
x^2 - 4x + 4 + y^2 + 6y + 9 &= 25 \\[6pt]
x^2 + y^2 - 4x + 6y - 12 &= 0
\end{aligned}$$
```

Se conosci un punto $P$ della circonferenza, calcola $r^2$ con la formula della distanza tra $C$ e $P$: la radice non serve.

```ad-example
Dall'equazione al centro e al raggio
Parti da $x^2 + y^2 - 4x + 2y - 4 = 0$, dove $a = -4$, $b = 2$ e $c = -4$. Il centro ha coordinate $-\frac{a}{2}$ e $-\frac{b}{2}$, il raggio viene da centro e termine noto:

$$\begin{aligned}
x_C &= -\frac{-4}{2} = 2 \qquad y_C = -\frac{2}{2} = -1 \\[6pt]
r^2 &= x_C^2 + y_C^2 - c = 4 + 1 + 4 = 9 \\[6pt]
r &= 3
\end{aligned}$$
```

Prima delle formule controlla che $x^2$ e $y^2$ abbiano lo stesso coefficiente e che manchi il termine in $xy$. Se il coefficiente non è $1$, dividi tutta l'equazione per quel numero.

```ad-error
Errori frequenti
- Dimenticare il segno meno: il centro ha coordinate $-\frac{a}{2}$ e $-\frac{b}{2}$, quindi con $a = -4$ l'ascissa è $2$, non $-2$.
- Usare le formule senza aver diviso: con $2x^2 + 2y^2 - 8x = 0$ prima si divide per $2$.
- Scrivere $(y - 3)^2$ quando il centro ha ordinata $-3$: sottrarre un numero negativo dà $(y + 3)^2$.
```

## Domande frequenti

### Quando un'equazione non è una circonferenza?

Quando $x^2$ e $y^2$ hanno coefficienti diversi, quando compare il termine in $xy$, oppure quando $r^2$ viene negativo: in quel caso nessun punto del piano soddisfa l'equazione. Se $r^2$ viene $0$, l'equazione rappresenta solo il centro.

### Che cosa significa c = 0?

Il termine noto è zero quando la circonferenza passa per l'origine: sostituendo $x = 0$ e $y = 0$ l'equazione è soddisfatta.
