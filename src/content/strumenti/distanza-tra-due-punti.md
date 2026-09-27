# Distanza tra due punti

## Che cos'è

La distanza tra due punti del piano cartesiano è la lunghezza del segmento che li unisce.

Si indica con una lineetta sopra le due lettere: $\overline{AB}$ è la distanza tra $A$ e $B$. Si calcola dalle coordinate, cioè dai due numeri che dicono dove sta ogni punto: il primo è l'ascissa ($x$), il secondo l'ordinata ($y$).

## Come si calcola a mano

```ad-example
Esempio: da A(-2, 1) a B(4, 4)
Da $A$ a $B$ ti sposti di $6$ verso destra e di $3$ verso l'alto. Il segmento $AB$ è l'ipotenusa di un triangolo rettangolo con i cateti lunghi $6$ e $3$, quindi usi il teorema di Pitagora:

$$\begin{aligned}
\overline{AB} &= \sqrt{\left(4 - (-2)\right)^2 + (4 - 1)^2} \\[6pt]
&= \sqrt{6^2 + 3^2} = \sqrt{36 + 9} \\[6pt]
&= \sqrt{45} = \sqrt{9 \cdot 5} = 3\sqrt{5} \approx 6{,}71
\end{aligned}$$
```

La regola generale, con $A(x_A, y_A)$ e $B(x_B, y_B)$, è questa:

$$\overline{AB} = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$

I passaggi sono sempre gli stessi: sottrai le ascisse, sottrai le ordinate, eleva al quadrato le due differenze, sommale ed estrai la radice. Se la radice non è intera, porta fuori i fattori quadrati: il risultato esatto è $3\sqrt{5}$, e $6{,}71$ è solo un valore approssimato.

### Segmenti orizzontali e verticali

Se i due punti hanno la stessa ordinata il segmento è orizzontale, e la distanza è la differenza delle ascisse presa senza segno. Tra $C(-3, 4)$ e $D(5, 4)$:

$$\overline{CD} = |5 - (-3)| = 8$$

Con la stessa ascissa si fa lo stesso con le ordinate.

```ad-error
Errori frequenti
- Dimenticare le parentesi con i numeri negativi: $4 - (-2)$ fa $6$, non $2$.
- Estrarre la radice di ogni quadrato: $\sqrt{36 + 9}$ non è $6 + 3$.
- Scrivere il quadrato di una differenza negativa con il segno meno: $(-6)^2 = 36$, sempre positivo.
```

## Domande frequenti

### Conta l'ordine dei punti?

No. Scambiando $A$ e $B$ le differenze cambiano segno, ma i quadrati restano uguali, e la distanza anche.

### Si può usare con le frazioni?

Sì. Con $A\left(\frac{1}{2}, \frac{1}{3}\right)$ e $B(-1, 1)$ i quadrati delle differenze sono $\frac{9}{4}$ e $\frac{4}{9}$. Si sommano con il denominatore comune $36$:

$$\overline{AB} = \sqrt{\frac{97}{36}} = \frac{\sqrt{97}}{6}$$

### E il punto medio?

Il punto medio del segmento si trova con la media delle coordinate: c'è uno strumento apposta, il calcolo del punto medio di un segmento.
