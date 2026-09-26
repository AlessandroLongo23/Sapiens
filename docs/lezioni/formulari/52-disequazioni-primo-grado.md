# Formulario: Disequazioni di primo grado e intervalli

## Disequazione e soluzioni

- Disequazione: disuguaglianza tra due espressioni con un'incognita, con uno dei segni $<$, $>$, $\le$, $\ge$.
- Soluzione: numero che, al posto dell'incognita, rende vera la disequazione. L'insieme delle soluzioni $S$ si scrive come intervallo.

## Intervalli

Parentesi rivolta verso il numero: estremo incluso, pallino pieno. Parentesi rivolta verso l'esterno: estremo escluso, pallino vuoto.

| Disuguaglianza | Intervallo |
|---|---|
| $a \le x \le b$ | $[a, b]$ |
| $a < x < b$ | $\mathopen{]}a, b\mathclose{[}$ |
| $a \le x < b$ | $[a, b\mathclose{[}$ |
| $a < x \le b$ | $\mathopen{]}a, b]$ |
| $x \ge a$ | $[a, +\infty\mathclose{[}$ |
| $x > a$ | $\mathopen{]}a, +\infty\mathclose{[}$ |
| $x \le a$ | $\mathopen{]}-\infty, a]$ |
| $x < a$ | $\mathopen{]}-\infty, a\mathclose{[}$ |

Dalla parte di $+\infty$ e $-\infty$ la parentesi è sempre rivolta verso l'esterno. Con le parentesi tonde: $(2, 5]$ è lo stesso di $\mathopen{]}2, 5]$.

## Principi di equivalenza

- Primo principio: aggiungere o sottrarre lo stesso termine ai due membri. Regola del trasporto: un termine cambia membro cambiando segno.
- Secondo principio, numero positivo: moltiplicare o dividere i due membri, il verso resta.
- Secondo principio, numero negativo: moltiplicare o dividere i due membri e cambiare il verso.

$$
\begin{gathered}
2 < 5 \ \Rightarrow \ -2 > -5 \\
-2x > 6 \ \Rightarrow \ x < -3
\end{gathered}
$$

## Forma normale

| Forma normale $ax > b$ | Soluzioni |
|---|---|
| $a > 0$ | $x > \dfrac{b}{a}$ |
| $a < 0$ | $x < \dfrac{b}{a}$ (verso cambiato) |
| $a = 0$ | $0 > b$ vera: $S = \mathbb{R}$; falsa: $S = \emptyset$ |

$0x > 0$ e $0x < 0$: $S = \emptyset$. $0x \ge 0$ e $0x \le 0$: $S = \mathbb{R}$.

## Come si risolve

1. Moltiplica tutti i termini per il MCM dei denominatori (positivo: il verso resta), numeratori tra parentesi.
2. Togli le parentesi.
3. Trasporta: termini con $x$ a primo membro, numeri a secondo membro.
4. Riduci alla forma normale.
5. Dividi per il coefficiente di $x$; se è negativo, cambia il verso.
6. Scrivi $S$ come intervallo e disegnalo sulla retta.

$$
\begin{gathered}
2 - 5x \ge 17 \\
-5x \ge 15 \\
x \le -3 \\
S = \mathopen{]}-\infty, -3]
\end{gathered}
$$

## Problemi

- Almeno $a$: $x \ge a$. Al massimo $a$: $x \le a$. Più di $a$: $x > a$. Meno di $a$: $x < a$.
- Se l'incognita conta oggetti, le soluzioni sono solo i numeri naturali dell'intervallo.

```ad-warning
Dimenticare di cambiare il verso
Da $-3x < 12$ si ottiene $x > -4$, non $x < -4$.
```

```ad-warning
Cambiare il verso quando non serve
Da $3x > -6$ si ottiene $x > -2$: il verso cambia solo se il coefficiente è negativo.
```

```ad-warning
La parentesi dalla parte sbagliata
$x \le 4$ è $\mathopen{]}-\infty, 4]$, non $\mathopen{]}-\infty, 4\mathclose{[}$.
```
