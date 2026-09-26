# Operazioni in ℤ

In $\mathbb{N}$ la sottrazione $3 - 8$ non si può fare; nei numeri interi sì, e fa $-5$. Con gli interi si fanno le stesse operazioni dei [naturali](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n), ma ogni numero ha un segno, e per calcolare bisogna sapere come si combinano i segni. Qui trovi le regole per addizione, sottrazione, moltiplicazione e divisione, come si tolgono le parentesi e come si risolve un'espressione. Che cosa sono l'opposto e il valore assoluto di un intero lo spiega la lezione [Numeri interi e valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto).

Il segno $+$ davanti a un numero positivo si può omettere: $+5$ e $5$ sono lo stesso numero. Un numero negativo che segue il segno di un'operazione va tra parentesi: si scrive $4 \cdot (-3)$ e $7 - (-2)$, mai $4 \cdot -3$ o $7 - -2$.

## Addizione

La regola per sommare due interi dipende dai loro segni: se sono [concordi](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto), cioè hanno lo stesso segno, come $-3$ e $-8$, oppure discordi, cioè hanno segni diversi, come $+5$ e $-2$.

La somma di due interi concordi ha lo stesso segno degli addendi e per valore assoluto la somma dei valori assoluti:

$$
\begin{gathered}
(+3) + (+5) = +8 \\
(-3) + (-5) = -8
\end{gathered}
$$

La somma di due interi discordi ha il segno dell'addendo con il valore assoluto maggiore e per valore assoluto la differenza tra il valore assoluto maggiore e il minore:

$$
\begin{gathered}
(+7) + (-4) = +3 \\
(-7) + (+4) = -3
\end{gathered}
$$

In $(-7) + (+4)$ i valori assoluti sono $7$ e $4$: la differenza è $7 - 4 = 3$, e il segno è quello di $-7$, che ha il valore assoluto maggiore. Se gli addendi sono opposti la somma è $0$, per esempio $(-6) + (+6) = 0$. Lo $0$ resta l'elemento neutro: $(-9) + 0 = -9$.

Sulla retta dei numeri, sommare un positivo vuol dire spostarsi verso destra e sommare un negativo spostarsi verso sinistra, di tante unità quanto è il suo valore assoluto. Nella figura, partendo da $-3$ e facendo $5$ passi a destra si arriva a $+2$; partendo da $+4$ e facendo $6$ passi a sinistra si arriva a $-2$.

```tikz
% nome: addizione-interi-retta-dei-numeri
% alt: Retta dei numeri da meno 6 a 6 con due frecce: da meno 3 cinque passi a destra fino a 2, cioè meno 3 più 5 uguale 2; da 4 sei passi a sinistra fino a meno 2, cioè 4 più meno 6 uguale meno 2
% svg: addizione-interi-retta-dei-numeri-21934355.svg 405x109
\begin{tikzpicture}
\draw[->] (-5.3,0) -- (5.3,0);
\draw (-4.8,-0.08) -- (-4.8,0.08);
\draw (-4.0,-0.08) -- (-4.0,0.08);
\draw (-3.2,-0.08) -- (-3.2,0.08);
\draw (-2.4,-0.08) -- (-2.4,0.08);
\draw (-1.6,-0.08) -- (-1.6,0.08);
\draw (-0.8,-0.08) -- (-0.8,0.08);
\draw (0.0,-0.08) -- (0.0,0.08);
\draw (0.8,-0.08) -- (0.8,0.08);
\draw (1.6,-0.08) -- (1.6,0.08);
\draw (2.4,-0.08) -- (2.4,0.08);
\draw (3.2,-0.08) -- (3.2,0.08);
\draw (4.0,-0.08) -- (4.0,0.08);
\draw (4.8,-0.08) -- (4.8,0.08);
\node[below] at (-4.8,-0.1) {$-6$};
\node[below] at (-4.0,-0.1) {$-5$};
\node[below] at (-3.2,-0.1) {$-4$};
\node[below] at (-2.4,-0.1) {$-3$};
\node[below] at (-1.6,-0.1) {$-2$};
\node[below] at (-0.8,-0.1) {$-1$};
\node[below] at (0.0,-0.1) {$0$};
\node[below] at (0.8,-0.1) {$1$};
\node[below] at (1.6,-0.1) {$2$};
\node[below] at (2.4,-0.1) {$3$};
\node[below] at (3.2,-0.1) {$4$};
\node[below] at (4.0,-0.1) {$5$};
\node[below] at (4.8,-0.1) {$6$};
\draw[dashed] (-2.4,0) -- (-2.4,0.6);
\draw[dashed] (1.6,0) -- (1.6,0.6);
\draw[->, thick] (-2.4,0.6) -- (1.6,0.6);
\node[above] at (-0.4,0.6) {$(-3) + (+5) = +2$};
\draw[dashed] (3.2,0) -- (3.2,1.6);
\draw[dashed] (-1.6,0) -- (-1.6,1.6);
\draw[->, thick] (3.2,1.6) -- (-1.6,1.6);
\node[above] at (0.8,1.6) {$(+4) + (-6) = -2$};
\end{tikzpicture}
```

```ad-warning
Sbagliare la somma tra discordi
$(-7) + (+4)$ fa $-3$. Non fa $+3$, perché il segno è quello di $-7$, che ha il valore assoluto maggiore; e non fa $-11$, perché tra discordi i valori assoluti si sottraggono, non si sommano.
```

## Sottrazione

In $\mathbb{Z}$ la sottrazione si trasforma in un'addizione: sottrarre un numero vuol dire sommare il suo opposto.

$$a - b = a + (-b)$$

Per esempio $(+3) - (+8) = (+3) + (-8) = -5$ e $(-2) - (-6) = (-2) + (+6) = +4$. La definizione è la stessa dei naturali, perché la differenza sommata al sottraendo dà il minuendo: $(-5) + (+8) = +3$. Siccome l'opposto di un intero esiste sempre, la differenza di due interi è sempre un intero: in $\mathbb{Z}$ la sottrazione è un'operazione interna.

La sottrazione resta non commutativa: $3 - 8 = -5$, mentre $8 - 3 = +5$. Scambiando minuendo e sottraendo il risultato diventa l'opposto.

## Somma algebrica e segni

Una **somma algebrica** è una sequenza di addizioni e sottrazioni tra interi, come $5 - 8 + 3 - 7 + 2$. Siccome ogni sottrazione è l'addizione dell'opposto, una somma algebrica si legge come una somma di numeri con il loro segno, $(+5) + (-8) + (+3) + (-7) + (+2)$, e ognuno di questi numeri si chiama **termine**. Per questo addizione e sottrazione in $\mathbb{Z}$ si trattano insieme.

In una somma algebrica i termini si possono spostare e raggruppare come si vuole, purché ognuno si porti dietro il suo segno. Conviene sommare a parte i positivi e i negativi:

$$
\begin{aligned}
&5 - 8 + 3 - 7 + 2 \\
&= (5 + 3 + 2) - (8 + 7) \\
&= 10 - 15 \\
&= -5
\end{aligned}
$$

Quando un numero con il suo segno è preceduto da $+$ o da $-$, i due segni si riducono a uno: segni uguali danno $+$, segni diversi danno $-$.

| Scrittura | Diventa | Esempio |
|---|---|---|
| $+(+a)$ | $+a$ | $4 + (+3) = 4 + 3 = 7$ |
| $+(-a)$ | $-a$ | $4 + (-3) = 4 - 3 = 1$ |
| $-(+a)$ | $-a$ | $4 - (+3) = 4 - 3 = 1$ |
| $-(-a)$ | $+a$ | $4 - (-3) = 4 + 3 = 7$ |

```ad-warning
Meno meno
$4 - (-3)$ fa $4 + 3 = 7$, non $4 - 3 = 1$: togliere un numero negativo fa aumentare il risultato.
```

```ad-warning
Sommare due negativi
$-5 - 3$ fa $-8$, non $-2$ e non $+8$: sono due termini negativi, $(-5) + (-3)$, quindi concordi, e i valori assoluti si sommano. Qui non c'è nessun "meno per meno": i due segni $-$ appartengono a due termini diversi, e la regola dei segni vale per moltiplicazione e divisione, non per sommare due termini.
```

## Togliere le parentesi

In una somma algebrica le parentesi si possono togliere senza calcolare quello che c'è dentro, con due regole.

1. Se la parentesi è preceduta da $+$, si toglie la parentesi e i termini dentro restano con il loro segno.
2. Se la parentesi è preceduta da $-$, si toglie la parentesi e si cambia il segno a tutti i termini dentro.

La seconda regola viene dalla sottrazione: togliere una somma vuol dire sommare l'opposto di ogni termine. Per esempio

$$7 - (3 - 5 + 2) = 7 - 3 + 5 - 2 = 7$$

e infatti, calcolando prima la parentesi, $3 - 5 + 2 = 0$ e $7 - 0 = 7$. Allo stesso modo $10 + (-4 + 6) = 10 - 4 + 6 = 12$.

Con più parentesi una dentro l'altra si applicano le stesse regole, una parentesi alla volta, di solito partendo dalla più interna.

```ad-warning
Cambiare segno solo al primo termine
$7 - (3 - 5 + 2)$ non è $7 - 3 - 5 + 2 = 1$: il $-$ davanti alla parentesi cambia il segno di tutti i termini, quindi $7 - 3 + 5 - 2 = 7$.
```

## Moltiplicazione e regola dei segni

Il prodotto di due interi ha per valore assoluto il prodotto dei valori assoluti; il segno è $+$ se i fattori sono concordi e $-$ se sono discordi. Se un fattore è $0$, il prodotto è $0$.

$$
\begin{gathered}
(+3) \cdot (+4) = +12 \\
(-3) \cdot (-4) = +12
\end{gathered}
$$

$$
\begin{gathered}
(+3) \cdot (-4) = -12 \\
(-3) \cdot (+4) = -12
\end{gathered}
$$

Questa è la **regola dei segni**, e vale anche per la divisione:

| $\cdot$ oppure $:$ | $+$ | $-$ |
|---|---|---|
| $+$ | $+$ | $-$ |
| $-$ | $-$ | $+$ |

Moltiplicare per $-1$ dà l'opposto: $(-1) \cdot 5 = -5$ e $(-1) \cdot (-5) = +5$.

```ad-note
Perché meno per meno fa più
Sappiamo che $4 + (-4) = 0$ e che ogni numero moltiplicato per $0$ dà $0$, quindi $(-3) \cdot [4 + (-4)] = 0$. Con la proprietà distributiva diventa $(-3) \cdot 4 + (-3) \cdot (-4) = 0$, cioè $-12 + (-3) \cdot (-4) = 0$. Il numero che sommato a $-12$ dà $0$ è $+12$, quindi $(-3) \cdot (-4) = +12$.
```

Con più di due fattori, tutti diversi da $0$, il valore assoluto è il prodotto dei valori assoluti e il segno dipende solo da quanti fattori sono negativi: se sono in numero pari il prodotto è positivo, se sono in numero dispari è negativo. Per esempio in $(-2) \cdot (+3) \cdot (-1) \cdot (-5)$ ci sono tre fattori negativi, quindi il prodotto è negativo: $-(2 \cdot 3 \cdot 1 \cdot 5) = -30$.

```ad-tip
Prima il segno, poi il numero
In un prodotto lungo conta i fattori negativi e scrivi subito il segno; poi moltiplica i valori assoluti senza pensare più ai segni.
```

## Divisione

Dati due interi $a$ e $b$ con $b \neq 0$, il quoziente $a : b$ è il numero intero $q$ tale che $q \cdot b = a$, quando esiste. Il segno segue la regola dei segni, e il valore assoluto è il quoziente dei valori assoluti:

$$
\begin{gathered}
(-12) : (+3) = -4 \\
(-12) : (-4) = +3 \\
(+15) : (-5) = -3
\end{gathered}
$$

Per esempio $(-12) : (+3) = -4$ perché $(-4) \cdot (+3) = -12$.

Come in $\mathbb{N}$, la divisione non è sempre possibile: $(-7) : 2$ non ha un quoziente intero, perché nessun intero moltiplicato per $2$ dà $-7$. In $\mathbb{Z}$ la divisione non è un'operazione interna; per poter dividere sempre (tranne che per zero) si passa ai [numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q).

Per lo zero valgono le regole dei naturali: $0 : (-4) = 0$, mentre $(-4) : 0$ è impossibile e $0 : 0$ è indeterminata. Lo $0$ non ha segno, quindi $0 : (-4)$ fa $0$, non "$-0$".

## Proprietà che valgono in ℤ

Le proprietà delle operazioni viste in $\mathbb{N}$ valgono anche in $\mathbb{Z}$, con gli stessi nomi:

- addizione e moltiplicazione sono commutative e associative;
- la moltiplicazione è distributiva rispetto all'addizione e alla sottrazione: $a \cdot (b + c) = a \cdot b + a \cdot c$ e $a \cdot (b - c) = a \cdot b - a \cdot c$, ora senza la condizione $b \geq c$;
- $0$ è l'elemento neutro dell'addizione, $1$ quello della moltiplicazione, e $0$ è l'elemento assorbente della moltiplicazione;
- vale la legge di annullamento del prodotto: se un prodotto è $0$, almeno uno dei fattori è $0$;
- la proprietà invariantiva della sottrazione vale sempre, senza la condizione che il numero tolto non superi il sottraendo.

In più, ogni intero ha l'opposto, e la somma di un numero e del suo opposto è l'elemento neutro: $a + (-a) = 0$. È questo che rende la sottrazione sempre possibile. La sottrazione e la divisione continuano a non essere né commutative né associative.

| Operazione | Interna in $\mathbb{N}$ | Interna in $\mathbb{Z}$ |
|---|---|---|
| Addizione | sì | sì |
| Sottrazione | no | sì |
| Moltiplicazione | sì | sì |
| Divisione | no | no |

## Espressioni con gli interi

Un'espressione con gli interi si calcola con lo stesso [ordine delle operazioni](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n) dei naturali: prima le parentesi, dalle più interne; dentro ogni parentesi prima le [potenze](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z), poi moltiplicazioni e divisioni da sinistra a destra, infine la somma algebrica. Il segno che sta all'inizio dell'espressione, o subito dopo una parentesi aperta, appartiene al primo numero: in $-3 \cdot (-4)$ il primo fattore è $-3$.

```ad-example
Esempio 1: una somma algebrica
$$-4 + 9 - 12 + 3$$
Positivi insieme e negativi insieme: $(9 + 3) - (4 + 12) = 12 - 16 = -4$.
```

```ad-example
Esempio 2: moltiplicazioni e divisioni con i segni
$$-3 \cdot (-4) - 20 : (-5) + 2 \cdot (-7)$$
Prima i prodotti e il quoziente: $-3 \cdot (-4) = +12$, $20 : (-5) = -4$, $2 \cdot (-7) = -14$.

L'espressione diventa $12 - (-4) + (-14) = 12 + 4 - 14 = 2$.
```

```ad-warning
Il segno dell'operazione e il segno del numero
Nell'Esempio 2 il $-$ davanti a $20$ è il segno della sottrazione: prima si calcola $20 : (-5) = -4$, poi $-(-4) = +4$. Scrivere $-4$ al posto di $+4$, perdendo uno dei due segni, è un errore frequente.
```

```ad-example
Esempio 3: stessa priorità, da sinistra a destra
$$(-20) : (-4) \cdot (-2)$$
Divisione e moltiplicazione hanno la stessa priorità, quindi si va da sinistra a destra: $(-20) : (-4) = +5$, poi $5 \cdot (-2) = -10$.

Calcolare prima $(-4) \cdot (-2) = 8$ darebbe $(-20) : 8$, che in $\mathbb{Z}$ non si può nemmeno fare.
```

```ad-example
Esempio 4: parentesi tolte in due modi
$$15 - [4 - (6 - 11) + 2]$$
Calcolando dall'interno: $6 - 11 = -5$, poi $4 - (-5) + 2 = 4 + 5 + 2 = 11$, e infine $15 - 11 = 4$.

Togliendo le parentesi: la tonda è preceduta da $-$, quindi $15 - [4 - 6 + 11 + 2]$; la quadra è preceduta da $-$, quindi $15 - 4 + 6 - 11 - 2$. Positivi $15 + 6 = 21$, negativi $4 + 11 + 2 = 17$, risultato $21 - 17 = 4$.
```

```ad-example
Esempio 5: tonde, quadre e graffe
$$
\begin{aligned}
&-[5 - (3 - 8)] + \{ \\
&\quad -2 \cdot [4 - (-6 + 1)]\} : (-3)
\end{aligned}
$$
Tonde: $3 - 8 = -5$ e $-6 + 1 = -5$. L'espressione diventa $-[5 - (-5)] + \{-2 \cdot [4 - (-5)]\} : (-3)$.

Quadre: $5 - (-5) = 5 + 5 = 10$ e $4 - (-5) = 4 + 5 = 9$. Resta $-10 + \{-2 \cdot 9\} : (-3)$.

Graffe: $-2 \cdot 9 = -18$. Resta $-10 + (-18) : (-3)$, dove la divisione viene prima: $(-18) : (-3) = +6$.

Risultato: $-10 + 6 = -4$.
```
