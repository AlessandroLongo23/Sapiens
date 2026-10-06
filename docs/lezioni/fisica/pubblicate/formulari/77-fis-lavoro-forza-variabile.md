# Formulario: Il lavoro di una forza variabile

## Lavoro come area

$F$ è la componente della forza lungo lo spostamento, con il suo segno. In un tratto breve $\Delta x$:

$$\Delta W \approx F\,\Delta x$$

Il lavoro tra $x_1$ e $x_2$ è l'area compresa tra il grafico forza-spostamento e l'asse $x$.

- Le aree sopra l'asse sono lavoro positivo, quelle sotto l'asse lavoro negativo: si sommano con il segno.
- L'area si misura in $\text{N} \cdot \text{m} = \text{J}$: un quadretto vale la sua base per la sua altezza, lette sugli assi.

## Come si calcola l'area

| Grafico | Area |
|---|---|
| tratto orizzontale (forza costante) | rettangolo, $F\,\Delta x$ |
| retta dall'asse fino a $F$ | triangolo, $\tfrac{1}{2}\,F\,\Delta x$ |
| retta da $F_1$ a $F_2$ | trapezio, $\tfrac{1}{2}\,(F_1 + F_2)\,\Delta x$ |
| curva | quadretti interi più metà di quelli attraversati, per il valore di un quadretto |

## Forza media

La forza costante che compie lo stesso lavoro sullo stesso spostamento:

$$F_m = \frac{W}{\Delta x}$$

Se la forza cambia in linea retta da $F_1$ a $F_2$: $F_m = \dfrac{F_1 + F_2}{2}$.

## Forza elastica

Componente della forza elastica, con $x$ deformazione dalla posizione di riposo: $F = -k\,x$.

Lavoro della forza elastica da $x_1$ a $x_2$:

$$W_{el} = \frac{1}{2}\,k\,x_1^2 - \frac{1}{2}\,k\,x_2^2$$

- Negativo se la deformazione aumenta, positivo se diminuisce.
- Da riposo a $x$: $W_{el} = -\tfrac{1}{2}\,k\,x^2$; la mano che deforma lentamente la molla compie $+\tfrac{1}{2}\,k\,x^2$.

## Teorema dell'energia cinetica

Vale anche con forze variabili, con il lavoro calcolato come area:

$$W_{tot} = \frac{1}{2}\,m\,v_f^2 - \frac{1}{2}\,m\,v_i^2$$

| Situazione | Risultato |
|---|---|
| corpo fermo che riceve il lavoro $W$ | $v_f = \sqrt{\dfrac{2\,W}{m}}$ |
| corpo a velocità $v_i$ fermato da una molla a riposo | $x = v_i\sqrt{\dfrac{m}{k}}$ |

```ad-warning
Forza per spostamento solo se la forza è costante
Con una forza che cambia non si usa $F\,\Delta x$ con il valore iniziale o finale: si calcola l'area.
```

```ad-warning
Aree sotto l'asse
Un'area sotto l'asse $x$ è un lavoro negativo e si sottrae.
```

```ad-warning
Molla già deformata
Tra $x_1$ e $x_2$ il lavoro non è $\tfrac{1}{2}\,k\,(x_2 - x_1)^2$: si sottraggono i due termini $\tfrac{1}{2}\,k\,x^2$, con $x$ in metri.
```
