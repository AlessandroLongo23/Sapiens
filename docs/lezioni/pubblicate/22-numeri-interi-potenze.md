# Potenze in ℤ

Nei numeri interi la base di una potenza può essere negativa: $(-2)^3 = (-2) \cdot (-2) \cdot (-2) = -8$. La definizione e le proprietà sono quelle della lezione [Potenze in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n); quello che cambia è il segno del risultato, che dipende dalla base e dall'esponente. L'esponente qui resta un numero naturale: gli esponenti negativi si studiano nella lezione [Potenze in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q).

## Definizione

Dati un numero intero $a$ e un numero naturale $n \geq 2$, la **potenza** $a^n$ è il prodotto di $n$ fattori uguali ad $a$:

$$a^n = \underbrace{a \cdot a \cdot \ldots \cdot a}_{n \text{ fattori}}$$

Per esempio $(-3)^2 = (-3) \cdot (-3) = 9$ e $(-3)^3 = (-3) \cdot (-3) \cdot (-3) = -27$. Quando la base è negativa si scrive tra parentesi, segno compreso: più avanti vedi perché $(-3)^2$ e $-3^2$ non sono lo stesso numero.

Gli esponenti $1$ e $0$ si trattano come in $\mathbb{N}$:

$$a^1 = a \qquad a^0 = 1 \quad (a \neq 0)$$

Così $(-7)^1 = -7$ e $(-7)^0 = 1$. La scrittura $0^0$ non ha significato, per lo stesso motivo spiegato in [Potenze in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n).

## Il segno della potenza

Nel prodotto di numeri interi due fattori negativi danno un risultato positivo, come dice la regola dei segni della lezione [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z). In una potenza con base negativa i fattori negativi si possono quindi accoppiare: se sono in numero pari si accoppiano tutti e il risultato è positivo, se sono in numero dispari ne resta uno senza coppia e il risultato è negativo.

| Base | Esponente pari | Esponente dispari |
|---|---|---|
| positiva | positivo: $2^4 = 16$ | positivo: $2^3 = 8$ |
| negativa | positivo: $(-2)^4 = 16$ | negativo: $(-2)^3 = -8$ |

Una base positiva dà sempre una potenza positiva; la base $0$ dà $0^n = 0$ per ogni $n \geq 1$. Anche $0$ è un numero pari, e infatti $(-5)^0 = 1$ è positivo, come vuole la tabella.

Le potenze successive di $-2$ cambiano segno a ogni passo, e intanto il loro valore assoluto raddoppia: $(-2)^1 = -2$, $(-2)^2 = 4$, $(-2)^3 = -8$, $(-2)^4 = 16$. Sulla retta dei numeri saltano da una parte all'altra dello zero, allontanandosi sempre di più.

```tikz
% nome: potenze-di-meno-due-sulla-retta
% alt: Retta dei numeri da meno 8 a 16 con segnate le potenze di meno 2: meno 2 e meno 8 a sinistra dello zero, 4 e 16 a destra
% svg: potenze-di-meno-due-sulla-retta-5d6c2f8d.svg 371x58
\begin{tikzpicture}
\draw[->] (-3.4,0) -- (6.3,0);
\draw (-2.8,-0.08) -- (-2.8,0.08);
\draw (-2.1,-0.08) -- (-2.1,0.08);
\draw (-1.4,-0.08) -- (-1.4,0.08);
\draw (-0.7,-0.08) -- (-0.7,0.08);
\draw (0,-0.08) -- (0,0.08);
\draw (0.7,-0.08) -- (0.7,0.08);
\draw (1.4,-0.08) -- (1.4,0.08);
\draw (2.1,-0.08) -- (2.1,0.08);
\draw (2.8,-0.08) -- (2.8,0.08);
\draw (3.5,-0.08) -- (3.5,0.08);
\draw (4.2,-0.08) -- (4.2,0.08);
\draw (4.9,-0.08) -- (4.9,0.08);
\draw (5.6,-0.08) -- (5.6,0.08);
\draw (0,-0.18) -- (0,0.18);
\node[below] at (-2.8,-0.2) {$-8$};
\node[below] at (-0.7,-0.2) {$-2$};
\node[below] at (0,-0.2) {$0$};
\node[below] at (1.4,-0.2) {$4$};
\node[below] at (5.6,-0.2) {$16$};
\fill (-0.7,0) circle (0.07); \node[above] at (-0.7,0.15) {$(-2)^1$};
\fill (1.4,0) circle (0.07); \node[above] at (1.4,0.15) {$(-2)^2$};
\fill (-2.8,0) circle (0.07); \node[above] at (-2.8,0.15) {$(-2)^3$};
\fill (5.6,0) circle (0.07); \node[above] at (5.6,0.15) {$(-2)^4$};
\end{tikzpicture}
```

Il valore assoluto del risultato non dipende dal segno della base: è la potenza del [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto) della base, $|a^n| = |a|^n$. Per esempio $|(-3)^3| = |-27| = 27$ e $|-3|^3 = 3^3 = 27$. Da qui viene il procedimento.

### Come si calcola una potenza di un intero

1. Individua la base: se il segno meno è dentro la parentesi fa parte della base, altrimenti no.
2. Decidi il segno: base positiva, risultato positivo; base negativa, risultato positivo con esponente pari e negativo con esponente dispari.
3. Calcola la potenza del valore assoluto della base.
4. Scrivi il risultato con il segno trovato al passo 2.

```ad-example
Esempio: tre potenze con base negativa
$(-5)^3$: la base è $-5$, l'esponente $3$ è dispari, quindi il risultato è negativo; $5^3 = 125$, perciò $(-5)^3 = -125$.

$(-3)^4$: la base è $-3$, l'esponente $4$ è pari, quindi il risultato è positivo; $3^4 = 81$, perciò $(-3)^4 = 81$.

$(-10)^5$: la base è $-10$, l'esponente è dispari; $10^5 = 100\,000$, perciò $(-10)^5 = -100\,000$.
```

```ad-warning
Dimenticare il segno con l'esponente dispari
$(-2)^3$ non fa $8$: i fattori negativi sono tre, due si accoppiano e il terzo resta, quindi $(-2)^3 = -8$.
```

La base $-1$ merita un posto a parte, perché $|-1|^n = 1$ e resta solo il segno:

$$
\begin{gathered}
(-1)^n = 1 \text{ se } n \text{ è pari} \\
(-1)^n = -1 \text{ se } n \text{ è dispari}
\end{gathered}
$$

Per esempio $(-1)^{100} = 1$ e $(-1)^{37} = -1$, senza fare nessuna moltiplicazione.

Lo stesso ragionamento lega le potenze di due numeri opposti. Con esponente pari sono uguali, con esponente dispari sono opposte (se $n = 0$, serve $a \neq 0$):

$$
\begin{gathered}
(-a)^n = a^n \text{ se } n \text{ è pari} \\
(-a)^n = -a^n \text{ se } n \text{ è dispari}
\end{gathered}
$$

Per esempio $(-4)^2 = 4^2 = 16$ e $(-4)^3 = -4^3 = -64$.

## La differenza tra $(-a)^n$ e $-a^n$

L'esponente si riferisce solo a quello che gli sta subito a sinistra: un numero o una parentesi. In $(-3)^2$ gli sta a sinistra la parentesi, quindi la base è $-3$. In $-3^2$ gli sta a sinistra il $3$, quindi la base è $3$, e il meno davanti indica l'opposto del risultato: si calcola prima la potenza e poi si cambia segno.

$$
\begin{aligned}
(-3)^2 &= (-3) \cdot (-3) \\
&= 9 \qquad\qquad -3^2 \\
&= -(3 \cdot 3) \\
&= -9
\end{aligned}
$$

Con esponente dispari le due scritture danno lo stesso numero, ma per motivi diversi: $(-2)^3 = -8$ perché i fattori negativi sono tre, $-2^3 = -8$ perché è l'opposto di $2^3 = 8$.

Il meno può stare anche davanti a una parentesi elevata a potenza. In $-(-2)^4$ si calcola prima $(-2)^4 = 16$ e poi se ne prende l'opposto, $-16$; in $-(-2)^3$ si calcola $(-2)^3 = -8$, e l'opposto è $8$.

```ad-warning
Leggere $-3^2$ come $(-3)^2$
$-3^2 = -9$, non $9$. Senza parentesi il meno non fa parte della base: prima si fa la potenza $3^2 = 9$, poi si cambia segno.
```

La stessa regola vale nelle espressioni. In $5 - 2^2$ la potenza è $2^2 = 4$ e l'espressione vale $5 - 4 = 1$; in $5 + (-2)^2$ la potenza è $(-2)^2 = 4$ e l'espressione vale $5 + 4 = 9$.

```ad-warning
Moltiplicare base ed esponente
$(-3)^2$ non è $(-3) \cdot 2 = -6$, ma $(-3) \cdot (-3) = 9$.
```

## Le proprietà delle potenze

Le cinque proprietà delle potenze valgono anche quando le basi sono numeri interi e gli esponenti sono naturali, con le stesse condizioni viste in [Potenze in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n), dove trovi anche il perché di ciascuna. Dove compare un esponente $0$, la base deve essere diversa da $0$.

| Proprietà | Formula | Esempio |
|---|---|---|
| Prodotto, stessa base | $a^m \cdot a^n = a^{m+n}$ | $(-2)^3 \cdot (-2)^2 = (-2)^5 = -32$ |
| Quoziente, stessa base ($a \neq 0$, $m \geq n$) | $a^m : a^n = a^{m-n}$ | $(-3)^5 : (-3)^3 = (-3)^2 = 9$ |
| Potenza di una potenza | $(a^m)^n = a^{m \cdot n}$ | $[(-2)^3]^2 = (-2)^6 = 64$ |
| Prodotto, stesso esponente | $a^n \cdot b^n = (a \cdot b)^n$ | $(-2)^3 \cdot 5^3 = (-10)^3 = -1000$ |
| Quoziente, stesso esponente ($b \neq 0$, $a$ divisibile per $b$) | $a^n : b^n = (a : b)^n$ | $(-12)^2 : 4^2 = (-3)^2 = 9$ |

Il segno si decide alla fine, sulla potenza che resta: in $(-2)^3 \cdot (-2)^2$ i due fattori hanno segni diversi, ma conta solo che l'esponente finale $5$ sia dispari.

Quando le basi sono opposte, come $-2$ e $2$, non sono la stessa base e le proprietà con la stessa base non si applicano subito. Prima si porta tutto alla stessa base con $(-a)^n = a^n$ (esponente pari) oppure $(-a)^n = -a^n$ (esponente dispari):

$$(-2)^4 \cdot 2^3 = 2^4 \cdot 2^3 = 2^7 = 128$$

```ad-warning
Trattare basi opposte come la stessa base
$(-2)^3 \cdot 2^3$ non è $(-2)^6 = 64$. Le basi sono diverse, ma l'esponente è lo stesso: $(-2)^3 \cdot 2^3 = (-2 \cdot 2)^3 = (-4)^3 = -64$.
```

Per la somma e la differenza di potenze non c'è nessuna proprietà: $(-2)^2 + (-2)^3 = 4 - 8 = -4$, e non $(-2)^5 = -32$.

## Espressioni con le potenze

Nelle espressioni con i numeri interi le potenze si calcolano prima di moltiplicazioni e divisioni, e queste prima di addizioni e sottrazioni; le altre regole sono nella lezione [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z). Per ogni potenza conviene chiedersi subito qual è la base e che segno ha il risultato.

```ad-example
Esempio 1: stesse cifre, segni diversi
Calcola $(-3)^2 - 3^2 + (-1)^5$.

Le tre potenze: $(-3)^2 = 9$ perché l'esponente è pari; $3^2 = 9$; $(-1)^5 = -1$ perché l'esponente è dispari. Quindi

$$9 - 9 + (-1) = 0 - 1 = -1$$
```

```ad-example
Esempio 2: il meno fuori dalla base
Calcola $-2^4 + (-2)^3 \cdot (-1)^{10} - (-5)^0$.

In $-2^4$ la base è $2$: $2^4 = 16$, e il meno davanti dà $-16$. Poi $(-2)^3 = -8$, $(-1)^{10} = 1$ e $(-5)^0 = 1$. Si fa prima la moltiplicazione:

$$
\begin{aligned}
&-16 + (-8) \cdot 1 - 1 \\
&= -16 - 8 - 1 \\
&= -25
\end{aligned}
$$
```

```ad-example
Esempio 3: basi opposte e proprietà
Calcola $(-3)^7 : 3^5 - (-3)^4 : 3^3$.

L'esponente $7$ è dispari, quindi $(-3)^7 = -3^7$; l'esponente $4$ è pari, quindi $(-3)^4 = 3^4$. Ora le basi sono uguali:

$$
\begin{aligned}
&-3^7 : 3^5 - 3^4 : 3^3 \\
&= -3^{7-5} - 3^{4-3} \\
&= -3^2 - 3^1 \\
&= -9 - 3 \\
&= -12
\end{aligned}
$$

Nel primo termine il meno è fuori dalla base: $-3^2$ vale $-9$.
```

```ad-example
Esempio 4: parentesi e potenza di potenza
Calcola $\{[(-2)^3]^2 : (-4)^2 - (-6)^2 : 2^2\} \cdot (-1)^7$.

Dentro la graffa: $[(-2)^3]^2 = (-2)^6 = 64$ e $(-4)^2 = 16$, quindi il primo quoziente è $64 : 16 = 4$. Il secondo ha lo stesso esponente: $(-6)^2 : 2^2 = (-6 : 2)^2 = (-3)^2 = 9$. Infine $(-1)^7 = -1$:

$$\{4 - 9\} \cdot (-1) = (-5) \cdot (-1) = 5$$
```
