# Formulario: Divisibilità e numeri primi

## Multipli e divisori

Con $b \neq 0$, $a$ è divisibile per $b$ ($b$ è divisore di $a$, $a$ è multiplo di $b$) quando esiste un naturale $q$ tale che

$$a = b \cdot q$$

I multipli di un numero sono infiniti; i divisori di un numero diverso da zero sono finiti e nessuno lo supera. $1$ divide ogni numero, ogni $a \neq 0$ divide sé stesso, $0$ è multiplo di ogni numero, $0$ non è divisore di nessun numero.

Tutti i divisori di $n$: cerca le coppie $d \cdot (n : d) = n$ con $d = 1, 2, 3, \dots$ e fermati quando $d \cdot d > n$. Per esempio $36 = 1 \cdot 36 = 2 \cdot 18 = 3 \cdot 12 = 4 \cdot 9 = 6 \cdot 6$.

Se $d$ divide $a$ e $b$, divide anche $a + b$ e $a - b$ (con $a \geq b$).

## Criteri di divisibilità

| per | se |
|---|---|
| $2$ | l'ultima cifra è pari ($0, 2, 4, 6, 8$) |
| $3$ | la somma delle cifre è divisibile per $3$ |
| $4$ | le ultime due cifre sono $00$ o formano un numero divisibile per $4$ |
| $5$ | l'ultima cifra è $0$ o $5$ |
| $9$ | la somma delle cifre è divisibile per $9$ |
| $10$ | l'ultima cifra è $0$ |
| $11$ | la differenza tra la somma delle cifre di posto dispari e quella delle cifre di posto pari (contando da destra) è $0$ o un multiplo di $11$ |
| $25$ | le ultime due cifre sono $00$, $25$, $50$ o $75$ |

Due criteri si combinano solo se i numeri non hanno fattori primi in comune: per $6$ servono $2$ e $3$, per $12$ servono $3$ e $4$, per $15$ servono $3$ e $5$.

## Numeri primi e composti

Primo: ha esattamente due divisori, $1$ e sé stesso. Composto: maggiore di $1$ e non primo. $0$ e $1$ non sono né primi né composti; $2$ è l'unico primo pari. I primi sono infiniti.

$$
\begin{gathered}
2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19, \\
23,\ 29,\ 31,\ 37,\ 41,\ 43,\ 47, \\
53,\ 59,\ 61,\ 67,\ 71,\ 73,\ 79, \\
83,\ 89,\ 97
\end{gathered}
$$

Crivello di Eratostene fino a $100$:

1. Scrivi i numeri da $2$ a $100$.
2. Cerchia il primo numero non cancellato: è primo.
3. Cancella i suoi multipli, a partire dal suo quadrato.
4. Ripeti con $3$, $5$, $7$; con $11 \cdot 11 = 121 > 100$ ti fermi: i non cancellati sono primi.

Per sapere se $n$ è primo:

1. Dividi $n$ per i primi $2, 3, 5, 7, 11, \dots$ in ordine.
2. Se uno lo divide, $n$ è composto.
3. Se arrivi a un primo $p$ con $p \cdot p > n$ senza divisori, $n$ è primo.

Per esempio $91 = 7 \cdot 13$ è composto; $211$ è primo (nessun primo fino a $13$ lo divide, e $17 \cdot 17 = 289 > 211$).

## Scomposizione in fattori primi

Ogni numero maggiore di $1$ è prodotto di primi in un solo modo, a meno dell'ordine (teorema fondamentale dell'aritmetica).

1. Dividi per il più piccolo primo che divide il numero.
2. Riparti dal quoziente, provando di nuovo lo stesso primo.
3. Continua fino a $1$.
4. Scrivi il prodotto dei primi trovati, con i fattori uguali raccolti in potenze.

Per esempio $1260 = 2^2 \cdot 3^2 \cdot 5 \cdot 7$ e $4500 = 45 \cdot 100 = 2^2 \cdot 3^2 \cdot 5^3$.

## Divisibilità e numero dei divisori

$a$ è divisibile per $b$ quando ogni fattore primo di $b$ compare nella scomposizione di $a$ con esponente almeno uguale: $1260$ è divisibile per $45 = 3^2 \cdot 5$, non per $8 = 2^3$.

Numero dei divisori di $n = p^a \cdot q^b$ (con $p$, $q$ primi diversi), e allo stesso modo con più fattori:

$$(a + 1) \cdot (b + 1)$$

Per esempio $72 = 2^3 \cdot 3^2$ ha $4 \cdot 3 = 12$ divisori.

```ad-warning
Lasciare fattori non primi
$36 = 4 \cdot 9$ non è una scomposizione in fattori primi: serve $36 = 2^2 \cdot 3^2$.
```

```ad-warning
Credere che i dispari siano primi
$91 = 7 \cdot 13$ è dispari e composto: prova i primi fino a quello con il quadrato che supera il numero.
```

```ad-warning
Dimenticare il più uno
$72 = 2^3 \cdot 3^2$ ha $4 \cdot 3 = 12$ divisori, non $3 \cdot 2 = 6$.
```
