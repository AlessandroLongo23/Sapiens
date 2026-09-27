# Punto medio di un segmento

## Che cos'è

Il punto medio di un segmento è il punto che lo divide in due parti uguali.

Nel piano cartesiano lo si indica di solito con $M$. Le sue coordinate sono la media delle coordinate degli estremi: l'ascissa di $M$ sta a metà strada tra le ascisse di $A$ e $B$, e lo stesso vale per l'ordinata.

## Come si calcola a mano

```ad-example
Esempio: il punto medio tra A(-3, 2) e B(5, 7)
Somma le ascisse e dividi per $2$, poi fai lo stesso con le ordinate:

$$\begin{aligned}
x_M &= \frac{-3 + 5}{2} = \frac{2}{2} = 1 \\[6pt]
y_M &= \frac{2 + 7}{2} = \frac{9}{2}
\end{aligned}$$

Il punto medio è $M\left(1, \frac{9}{2}\right)$, cioè $M(1;\ 4{,}5)$ scritto con i decimali.
```

La regola generale, con $A(x_A, y_A)$ e $B(x_B, y_B)$:

$$M\left(\frac{x_A + x_B}{2}, \frac{y_A + y_B}{2}\right)$$

È la stessa idea della media di due voti: il numero che sta esattamente in mezzo.

### Con le frazioni

Tra $A\left(\frac{1}{2}, 1\right)$ e $B\left(\frac{3}{2}, -1\right)$ la somma delle ascisse è $2$, quella delle ordinate è $0$:

$$\begin{aligned}
x_M &= \frac{2}{2} = 1 \\[6pt]
y_M &= \frac{0}{2} = 0
\end{aligned}$$

Il punto medio è $M(1, 0)$, sull'asse $x$.

```ad-error
Errori frequenti
- Sottrarre le coordinate invece di sommarle: la differenza serve per la distanza, non per il punto medio.
- Dimenticare di dividere per $2$: $-3 + 5 = 2$ è la somma, non l'ascissa di $M$.
- Mescolare ascisse e ordinate: $x_M$ si calcola solo con le $x$, $y_M$ solo con le $y$.
```

## Domande frequenti

### Come si controlla il risultato?

Calcola la distanza di $M$ da $A$ e da $B$: devono essere uguali, e ognuna deve essere metà della lunghezza di $AB$.

### Come trovo un estremo se conosco l'altro e il punto medio?

Rovescia la formula. Se $M$ è il punto medio, $x_B = 2x_M - x_A$ e $y_B = 2y_M - y_A$. Con $A(1, 2)$ e $M(3, 5)$ ottieni $B(5, 8)$.

### Perché il risultato è una frazione?

Perché la somma delle coordinate può essere dispari: $\frac{9}{2}$ è il valore esatto, e $4{,}5$ è lo stesso numero scritto con la virgola.
