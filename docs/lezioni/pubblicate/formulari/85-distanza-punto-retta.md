# Formulario: Distanza di un punto da una retta

## Definizione

- Distanza di $P$ dalla retta $r$: la lunghezza del segmento $PH$, con $H$ proiezione di $P$ su $r$ (piede della perpendicolare). È la più corta tra le distanze di $P$ dai punti di $r$.

$$d(P, r) = \overline{PH}$$

- Se $P$ sta su $r$, $d(P, r) = 0$.

## Rette parallele agli assi

Con $P(x_0, y_0)$:

- retta orizzontale $y = k$: $d(P, r) = |y_0 - k|$;
- retta verticale $x = h$: $d(P, r) = |x_0 - h|$;
- dall'asse $x$: $|y_0|$; dall'asse $y$: $|x_0|$.

## La formula

Retta $r$ in forma implicita $ax + by + c = 0$, punto $P(x_0, y_0)$:

$$d(P, r) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}$$

1. Scrivi la retta in forma implicita, con tutti i termini a primo membro.
2. Leggi $a$, $b$, $c$ con il loro segno.
3. Calcola $|ax_0 + by_0 + c|$.
4. Dividi per $\sqrt{a^2 + b^2}$.
5. Semplifica e razionalizza: $\dfrac{8}{\sqrt{5}} = \dfrac{8\sqrt{5}}{5}$.

- Dall'origine: $d(O, r) = \dfrac{|c|}{\sqrt{a^2 + b^2}}$.
- Moltiplicare l'equazione per un numero diverso da zero non cambia la distanza.

## Distanza tra due rette parallele

- Scegli un punto comodo su una retta e calcola la sua distanza dall'altra.
- Con gli stessi $a$ e $b$, $r\colon ax + by + c = 0$ e $s\colon ax + by + c' = 0$:

$$d(r, s) = \frac{|c - c'|}{\sqrt{a^2 + b^2}}$$

## Altezza e area di un triangolo

1. Base: $\overline{AB}$ con la distanza tra due punti.
2. Retta $AB$ in forma implicita.
3. Altezza: $h = d(C, AB)$, la distanza del terzo vertice dalla retta $AB$.
4. Area $= \dfrac{\overline{AB} \cdot h}{2}$.

```ad-warning
La forma esplicita
Da $y = 2x + 3$ si passa a $2x - y + 3 = 0$: $b = -1$, non $1$.
```

```ad-warning
Il valore assoluto
Una distanza non è mai negativa: $|-7| = 7$ al numeratore.
```

```ad-warning
La formula diretta per le parallele
Prima si rendono uguali $a$ e $b$: $6x - 8y - 9 = 0$ diventa $3x - 4y - \dfrac{9}{2} = 0$.
```
