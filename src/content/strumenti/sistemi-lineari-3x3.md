# Sistemi lineari 3x3

## Che cos'è un sistema di tre equazioni

Un sistema lineare 3x3 è formato da tre equazioni di primo grado in tre incognite, $x$, $y$ e $z$, che devono essere vere insieme.

La soluzione è una terna di numeri, come $(1, 2, 3)$. In forma normale ogni equazione ha le incognite a sinistra, nello stesso ordine, e il termine noto a destra.

## Come si risolve a mano

I metodi sono due: la riduzione, che toglie un'incognita alla volta, e la regola di Cramer, che usa i determinanti.

```ad-example
Esempio: riduzione
Risolvi il sistema $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$. Togli la $x$ dalla seconda equazione sottraendo il doppio della prima, e dalla terza sottraendo la prima:

$$\begin{aligned}
-3y - z &= -9 \\
y - 2z &= -4
\end{aligned}$$

Dalla seconda ricavi $y = 2z - 4$ e lo metti nella prima: $-7z = -21$, cioè $z = 3$. Poi $y = 2$ e, dalla prima equazione, $x = 1$.
```

Per la regola di Cramer serve il determinante di una tabella $3 \times 3$. Si calcola con la regola di Sarrus: ricopi a destra le prime due colonne, moltiplichi i numeri sulle tre diagonali che scendono verso destra e sulle tre che scendono verso sinistra, poi sottrai la seconda somma dalla prima.

```ad-example
Esempio: regola di Sarrus
Le diagonali verso destra danno $-2$, $2$ e $-2$; quelle verso sinistra $1$, $1$ e $8$:

$$\begin{aligned}
D &= \begin{vmatrix} 1 & 2 & -1 \\ 2 & -1 & 1 \\ 1 & 1 & 2 \end{vmatrix} \\
&= (-2 + 2 - 2) - (1 + 1 + 8) \\
&= -2 - 10 \\
&= -12
\end{aligned}$$
```

$D_x$, $D_y$ e $D_z$ si ottengono mettendo la colonna dei termini noti al posto della colonna di $x$, di $y$ o di $z$. Se $D$ non è zero la soluzione è una sola:

$$x = \frac{D_x}{D} \qquad y = \frac{D_y}{D} \qquad z = \frac{D_z}{D}$$

```ad-error
Errori frequenti
- Usare la regola di Sarrus per tabelle più grandi di $3 \times 3$: il risultato è sbagliato.
- Dimenticare il segno meno davanti alle tre diagonali verso sinistra.
- Sostituire l'espressione trovata in una sola delle altre equazioni: va sostituita in tutte e due.
```

## Domande frequenti

### Che cosa succede se il determinante $D$ è zero?

La regola di Cramer non si può usare, e con tre incognite non basta guardare $D_x$, $D_y$ e $D_z$: il sistema $x + y + z = 1$, $x + y + z = 2$, $x + y + z = 3$ li ha tutti zero ed è impossibile. Il calcolatore allora risolve il sistema per riduzione, e sono le equazioni che restano a dire se è impossibile o indeterminato.

### Che cosa vuol dire indeterminato?

Che le soluzioni sono infinite: dopo la riduzione restano meno equazioni che incognite. Il calcolatore scrive le equazioni che le soluzioni devono rispettare.

### Posso usare frazioni e decimali?

Sì, come $1/2$ o $0{,}5$. Prima di cominciare il calcolatore moltiplica ogni equazione per il mcm dei suoi denominatori, così lavora con numeri interi, e dà la soluzione con le frazioni esatte.
