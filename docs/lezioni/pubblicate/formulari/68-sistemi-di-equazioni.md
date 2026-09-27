# Formulario: Sistemi di due equazioni in due incognite

## Equazione lineare e sistema

- Equazione lineare in due incognite: $ax + by = c$, con $a$ e $b$ non tutti e due zero. Ha infinite soluzioni, che sono coppie ordinate $(x, y)$ e formano una retta.
- Soluzione del sistema: una coppia che risolve tutte e due le equazioni.

$$
\begin{cases}
x + y = 5 \\
2x + 3y = 12
\end{cases}
$$

Soluzione: $S = \{(3, 2)\}$.

- Forma normale: incognite a primo membro, prima $x$ e poi $y$, termine noto a secondo membro.

$$
\begin{cases}
ax + by = c \\
a'x + b'y = c'
\end{cases}
$$

- Grado del sistema: il prodotto dei gradi delle equazioni. Grado $1$: sistema lineare.

## Metodi di risoluzione

Sostituzione, quando un coefficiente è $1$ o $-1$:
1. Ricava un'incognita da un'equazione.
2. Sostituiscila nell'altra equazione e risolvi.
3. Ricava l'altra incognita dall'espressione del passo 1.

Confronto, quando tutte e due le equazioni sono nella forma $y = \dots$:
1. Uguaglia le due espressioni di $y$ e risolvi.
2. Ricava $y$ da una delle due.

Riduzione, quando i coefficienti di un'incognita sono uguali od opposti, o nessuno è $1$:
1. Moltiplica le equazioni (tutti i termini) per rendere opposti o uguali i coefficienti di un'incognita.
2. Somma le equazioni se sono opposti, sottraile se sono uguali.
3. Risolvi e trova l'altra incognita.

$$
\begin{gathered}
3x + 2y = 7 \\
5x - 2y = 1 \\
\text{somma: } 8x = 8 \\
x = 1, \ y = 2
\end{gathered}
$$

Con le frazioni: prima ogni equazione in forma normale, ciascuna con il suo MCM.

## Determinato, impossibile, indeterminato

| Rapporti | Sistema | Rette |
|---|---|---|
| $\dfrac{a}{a'} \neq \dfrac{b}{b'}$ | determinato | incidenti |
| $\dfrac{a}{a'} = \dfrac{b}{b'} \neq \dfrac{c}{c'}$ | impossibile | parallele distinte |
| $\dfrac{a}{a'} = \dfrac{b}{b'} = \dfrac{c}{c'}$ | indeterminato | coincidenti |

- I rapporti si leggono sulla forma normale, con $a'$, $b'$, $c'$ diversi da zero. Se uno è zero: determinato quando $ab' \neq a'b$.
- Risolvendo: $0 = 7$ vuol dire impossibile, $0 = 0$ indeterminato.

$$
\begin{gathered}
x - 2y = 3 \\
-2x + 4y = -6 \\
S = \{(x, y) \mid x - 2y = 3\}
\end{gathered}
$$

## Sistemi fratti

1. Scrivi le C.E. su tutti i denominatori, per $x$ e per $y$.
2. Togli i denominatori e risolvi il sistema intero.
3. Confronta la soluzione con le C.E.: se non le rispetta, non è accettabile.

```ad-warning
Scambiare l'ordine nella coppia
$x = 3$, $y = 2$ si scrive $(3, 2)$: $(2, 3)$ è un'altra coppia, e $\{3, 2\}$ è un insieme di due numeri.
```

```ad-warning
Il segno nella sottrazione
Sottraendo $6x - 15y = 27$ da $6x + 8y = 4$ si ottiene $23y = -23$: il meno cambia segno a tutti i termini.
```

```ad-warning
Indeterminato non è "tutte le coppie"
Le soluzioni sono infinite, ma solo quelle di una delle due equazioni: $(0, 0)$ non risolve $x - 2y = 3$.
```
