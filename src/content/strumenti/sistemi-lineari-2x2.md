# Sistemi lineari 2x2

## Che cos'è un sistema lineare

Un sistema lineare di due equazioni in due incognite è una coppia di equazioni di primo grado in $x$ e $y$ che devono essere vere insieme.

La soluzione è una coppia di numeri, come $(3, 2)$, che rende vere tutte e due le equazioni. Prima di risolverlo conviene scriverlo in forma normale, con le incognite a sinistra e il termine noto a destra:

$$\begin{cases} ax + by = c \\ a'x + b'y = c' \end{cases}$$

## Come si risolve a mano

I metodi che si studiano sono tre, e danno sempre la stessa soluzione.

Con la sostituzione ricavi un'incognita da un'equazione e la metti nell'altra. Conviene scegliere un'incognita con coefficiente $1$, così non compaiono frazioni.

```ad-example
Esempio: sostituzione
Risolvi il sistema formato da $2x + y = 7$ e $3x - 2y = 0$. Dalla prima ricavi $y = 7 - 2x$ e la sostituisci nella seconda:

$$\begin{aligned}
3x - 2(7 - 2x) &= 0 \\
3x - 14 + 4x &= 0 \\
7x &= 14 \\
x &= 2
\end{aligned}$$

Poi $y = 7 - 2 \cdot 2 = 3$. La soluzione è la coppia $(2, 3)$.
```

Con la riduzione moltiplichi le equazioni per dei numeri, in modo che un'incognita abbia coefficienti opposti, e le sommi: quell'incognita sparisce.

Con la regola di Cramer calcoli tre determinanti. Il determinante di una tabella $2 \times 2$ è il prodotto sulla diagonale principale meno quello sulla diagonale secondaria.

```ad-example
Esempio: regola di Cramer
Per $2x + 3y = 7$ e $x - y = 1$:

$$\begin{aligned}
D &= 2 \cdot (-1) - 1 \cdot 3 = -5 \\
D_x &= 7 \cdot (-1) - 1 \cdot 3 = -10 \\
D_y &= 2 \cdot 1 - 1 \cdot 7 = -5
\end{aligned}$$

Quindi $x = \dfrac{D_x}{D} = 2$ e $y = \dfrac{D_y}{D} = 1$.
```

Se $D = 0$ la regola di Cramer non si usa. Il sistema è impossibile quando $D_x$ o $D_y$ non è zero, indeterminato quando sono zero anche loro.

```ad-error
Errori frequenti
- Sostituire l'espressione trovata nella stessa equazione da cui l'hai ricavata: ottieni $0 = 0$, che non dice niente.
- Dimenticare le parentesi quando sostituisci: $-2(7 - 2x)$ cambia il segno a tutti e due i termini.
- Mettere $D$ al numeratore: nella regola di Cramer $D$ sta sempre al denominatore.
```

## Domande frequenti

### Quando un sistema è impossibile o indeterminato?

È impossibile quando i calcoli portano a un'uguaglianza falsa, come $0 = 1$: le due rette sono parallele. È indeterminato quando portano a $0 = 0$: le due equazioni dicono la stessa cosa e le soluzioni sono infinite.

### Quale metodo conviene?

La sostituzione quando c'è un coefficiente $1$ o $-1$, la riduzione quando i coefficienti di un'incognita sono uguali od opposti, Cramer quando i numeri sono scomodi.

### Posso scrivere le equazioni come sul quaderno?

Sì: scegli "Equazioni" e scrivi per esempio $3(x - 1) = 2y + 1$. Il calcolatore porta prima il sistema in forma normale e toglie i denominatori.
