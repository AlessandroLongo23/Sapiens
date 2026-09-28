# Equazioni e disequazioni irrazionali

L'equazione $\sqrt{x + 3} = x - 3$ ha l'incognita sotto il segno di radice. Per risolverla si toglie la radice elevando al quadrato tutti e due i membri, e si arriva a un'equazione di secondo grado. Elevare al quadrato, però, può aggiungere soluzioni che l'equazione di partenza non ha: qui $x^2 - 7x + 6 = 0$ dà $1$ e $6$, ma solo $6$ risolve $\sqrt{x + 3} = x - 3$. Tutto il lavoro sta nel riconoscere e scartare le soluzioni in più.

Per seguire la lezione ti servono le condizioni di esistenza dei radicali della lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta), le [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) e, per le disequazioni, i sistemi della lezione [Disequazioni fratte e sistemi di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado).

## Che cos'è un'equazione irrazionale

Un'equazione è **irrazionale** quando l'incognita compare sotto il segno di radice. Sono irrazionali $\sqrt{2x - 1} = 3$, $\sqrt{x + 3} = x - 3$ e $\sqrt[3]{x^3 - 7} = x - 1$. Non lo è $\sqrt{2}\,x = 4$: lì il radicale è un coefficiente, e l'equazione è di primo grado con un coefficiente irrazionale, come nella lezione [Espressioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/espressioni-con-i-radicali).

Quasi tutta la lezione riguarda le radici quadrate; le radici cubiche hanno una sezione loro, alla fine delle equazioni. Per le radici quadrate valgono due fatti, che reggono tutto il resto:

- $\sqrt{A(x)}$ esiste solo per i valori di $x$ che rendono $A(x) \geq 0$;
- quando esiste, $\sqrt{A(x)}$ non è mai negativa.

## Radice uguale a un numero

Nell'equazione $\sqrt{A(x)} = k$ il secondo membro è un numero, e i casi sono tre.

- Se $k < 0$ l'equazione è impossibile, perché una radice quadrata non è mai negativa: $\sqrt{x + 5} = -2$ ha $S = \emptyset$, senza fare conti.
- Se $k = 0$, la radice vale zero solo quando vale zero il radicando: si risolve $A(x) = 0$.
- Se $k > 0$, si elevano al quadrato i due membri e si risolve $A(x) = k^2$. Le soluzioni trovate vanno bene tutte: in ognuna il radicando vale $k^2$, che è positivo, e la sua radice è proprio $k$.

```ad-example
Esempio 1: il secondo membro è un numero positivo
Risolvi $\sqrt{2x - 1} = 3$ e $\sqrt{x^2 - 7} = 3$.

Nella prima eleva al quadrato:

$$
\begin{gathered}
2x - 1 = 9 \\
\Rightarrow 2x = 10 \\
\Rightarrow x = 5
\end{gathered}
$$

Verifica: $\sqrt{10 - 1} = \sqrt{9} = 3$. Quindi $S = \{5\}$.

Nella seconda:

$$
\begin{gathered}
x^2 - 7 = 9 \\
\Rightarrow x^2 = 16 \\
\Rightarrow x = \pm 4
\end{gathered}
$$

Tutte e due le soluzioni vanno bene: per $x = 4$ e per $x = -4$ il radicando vale $16 - 7 = 9$, e $\sqrt{9} = 3$. Quindi $S = \{-4, 4\}$.
```

```ad-warning
Elevare al quadrato con il secondo membro negativo
Da $\sqrt{x + 5} = -2$, elevando al quadrato, si ottiene $x + 5 = 4$, cioè $x = -1$. Ma $\sqrt{-1 + 5} = \sqrt{4} = 2$, non $-2$: la soluzione è falsa, e l'equazione è impossibile. Una radice uguale a un numero negativo non ha soluzioni, e non si fanno conti.
```

## Perché il quadrato aggiunge soluzioni

Se due numeri sono uguali, sono uguali anche i loro quadrati. Il contrario non vale: $(-2)^2 = 2^2$, ma $-2 \neq 2$. Due numeri hanno lo stesso quadrato quando sono uguali oppure opposti, quindi l'equazione

$$\left(\sqrt{A(x)}\right)^2 = [B(x)]^2$$

ha le soluzioni di $\sqrt{A(x)} = B(x)$ e, in più, quelle di $\sqrt{A(x)} = -B(x)$. Le soluzioni dell'equazione elevata al quadrato che non risolvono l'equazione di partenza si chiamano **soluzioni estranee**.

Con $\sqrt{x + 3} = x - 3$:

$$
\begin{gathered}
x + 3 = x^2 - 6x + 9 \\
\Rightarrow x^2 - 7x + 6 = 0 \\
\Rightarrow x_1 = 1, \quad x_2 = 6
\end{gathered}
$$

Per $x = 6$ il primo membro vale $\sqrt{9} = 3$ e il secondo $6 - 3 = 3$: è una soluzione. Per $x = 1$ il primo membro vale $\sqrt{4} = 2$ e il secondo $1 - 3 = -2$: i due membri sono opposti, e $1$ è una soluzione estranea. Risolve $\sqrt{x + 3} = 3 - x$, non l'equazione data.

Nel piano cartesiano le soluzioni di $\sqrt{x + 3} = x - 3$ sono le ascisse dei punti in cui il grafico di $y = \sqrt{x + 3}$ incontra la retta $y = x - 3$. Il grafico della radice si disegna per punti, come nella lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione): passa per $(-3, 0)$, $(1, 2)$ e $(6, 3)$. Elevando al quadrato si aggiunge la curva simmetrica, $y = -\sqrt{x + 3}$, tratteggiata nella figura: la retta incontra la curva della radice in $(6, 3)$ e quella tratteggiata in $(1, -2)$.

```tikz
% nome: equazione-irrazionale-soluzione-estranea
% alt: Il grafico di y uguale a radice di x più 3, la sua metà simmetrica y uguale a meno radice di x più 3 tratteggiata e la retta y uguale a x meno 3: la retta incontra il grafico della radice nel punto 6, 3, e la metà tratteggiata nel punto 1, meno 2, che dà la soluzione estranea
% svg: equazione-irrazionale-soluzione-estranea-393b9377.svg 250x168
\begin{tikzpicture}
\draw[black!70, ->] (-1.64,0) -- (3.32,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.60) -- (0,1.93) node[above] {$y$};
\draw[black!70] (0.42,0.07) -- (0.42,-0.07);
\draw[black!70] (2.52,0.07) -- (2.52,-0.07);
\draw[black!70] (-1.26,0.07) -- (-1.26,-0.07);
\node[above left] at (-1.26,0) {\small $-3$};
\draw[thick, blue!60] plot[smooth] coordinates {(-1.26,0.00) (-1.26,0.03) (-1.25,0.07) (-1.24,0.10) (-1.22,0.13) (-1.19,0.17) (-1.16,0.20) (-1.13,0.24) (-1.09,0.27) (-1.04,0.30) (-0.99,0.34) (-0.93,0.37) (-0.87,0.40) (-0.81,0.44) (-0.73,0.47) (-0.66,0.50) (-0.57,0.54) (-0.48,0.57) (-0.39,0.60) (-0.29,0.64) (-0.18,0.67) (-0.07,0.71) (0.04,0.74) (0.16,0.77) (0.29,0.81) (0.42,0.84) (0.56,0.87) (0.70,0.91) (0.85,0.94) (1.00,0.97) (1.16,1.01) (1.32,1.04) (1.49,1.08) (1.67,1.11) (1.85,1.14) (2.03,1.18) (2.22,1.21) (2.42,1.24) (2.62,1.28) (2.83,1.31) (3.04,1.34)};
\draw[thick, blue!60, dashed] plot[smooth] coordinates {(-1.26,-0.00) (-1.26,-0.03) (-1.25,-0.07) (-1.24,-0.10) (-1.22,-0.13) (-1.19,-0.17) (-1.16,-0.20) (-1.13,-0.24) (-1.09,-0.27) (-1.04,-0.30) (-0.99,-0.34) (-0.93,-0.37) (-0.87,-0.40) (-0.81,-0.44) (-0.73,-0.47) (-0.66,-0.50) (-0.57,-0.54) (-0.48,-0.57) (-0.39,-0.60) (-0.29,-0.64) (-0.18,-0.67) (-0.07,-0.71) (0.04,-0.74) (0.16,-0.77) (0.29,-0.81) (0.42,-0.84) (0.56,-0.87) (0.70,-0.91) (0.85,-0.94) (1.00,-0.97) (1.16,-1.01) (1.32,-1.04) (1.49,-1.08) (1.67,-1.11) (1.85,-1.14) (2.03,-1.18) (2.22,-1.21) (2.42,-1.24) (2.62,-1.28) (2.83,-1.31) (3.04,-1.34)};
\draw[thick, red!50] (-0.25,-1.51) -- (3.02,1.76);
\draw[gray!60, densely dotted] (2.52,0) -- (2.52,1.26);
\draw[gray!60, densely dotted] (0.42,0) -- (0.42,-0.84);
\node[below] at (2.52,-0.05) {\small $6$};
\node[above] at (0.42,0.05) {\small $1$};
\fill (2.52,1.26) circle (1.8pt);
\node[above left] at (2.52,1.26) {\small $(6, 3)$};
\draw[thick, fill=red!50] (0.42,-0.84) circle (1.8pt);
\node[below right] at (0.42,-0.84) {\small $(1, -2)$};
\node[blue!70!black, above] at (-0.84,0.67) {\small $y=\sqrt{x+3}$};
\node[blue!70!black, below] at (2.73,-1.39) {\small $y=-\sqrt{x+3}$};
\node[red!60!black, right] at (3.02,1.76) {\small $y=x-3$};
\end{tikzpicture}
```

## Radice uguale a un'espressione

Nell'equazione $\sqrt{A(x)} = B(x)$ il secondo membro contiene l'incognita. I valori di $x$ che la risolvono devono rispettare tre richieste: il radicale deve esistere, $A(x) \geq 0$; il secondo membro non può essere negativo, perché è uguale a una radice, $B(x) \geq 0$; e devono risolvere l'equazione elevata al quadrato, $A(x) = [B(x)]^2$.

La prima richiesta si può lasciare da parte. Dove vale $A(x) = [B(x)]^2$, il radicando è uguale a un quadrato, e un quadrato non è mai negativo: $A(x) \geq 0$ è già garantita. La seconda invece è quella che scarta le soluzioni estranee: se $B(x) \geq 0$, i due membri sono numeri non negativi, e due numeri non negativi con lo stesso quadrato sono uguali. L'equazione equivale quindi al sistema

$$
\begin{cases}
B(x) \geq 0 \\
A(x) = [B(x)]^2
\end{cases}
$$

Il procedimento:

1. Se il radicale non è da solo in un membro, isolalo.
2. Scrivi la condizione $B(x) \geq 0$ e risolvila.
3. Eleva al quadrato tutti e due i membri e risolvi l'equazione che ottieni.
4. Tieni solo le soluzioni che rispettano la condizione.

```ad-example
Esempio 2: una soluzione accettabile e una no
$$\sqrt{3x + 1} = x - 1$$

Condizione: $x - 1 \geq 0$, cioè $x \geq 1$. Eleva al quadrato; il secondo membro è il quadrato di un binomio:

$$
\begin{gathered}
3x + 1 = x^2 - 2x + 1 \\
\Rightarrow x^2 - 5x = 0 \\
\Rightarrow x(x - 5) = 0
\end{gathered}
$$

Le soluzioni sono $0$ e $5$. La condizione $x \geq 1$ scarta $0$ e tiene $5$: $S = \{5\}$. Verifica: $\sqrt{16} = 4$ e $5 - 1 = 4$. Per $x = 0$, invece, il primo membro vale $1$ e il secondo $-1$.
```

```ad-warning
Elevare al quadrato termine per termine
Il quadrato di $x - 1$ è $x^2 - 2x + 1$, non $x^2 - 1$ e nemmeno $x^2 + 1$: manca il doppio prodotto, come nei [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli). Si eleva al quadrato tutto il membro, non ogni termine per conto suo.
```

```ad-example
Esempio 3: prima si isola il radicale
$$x + \sqrt{x - 1} = 7$$

Porta $x$ a secondo membro, così il radicale resta da solo:

$$\sqrt{x - 1} = 7 - x$$

Condizione: $7 - x \geq 0$, cioè $x \leq 7$. Eleva al quadrato:

$$
\begin{gathered}
x - 1 = 49 - 14x + x^2 \\
\Rightarrow x^2 - 15x + 50 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 225 - 200 = 25 \\
x_{1,2} = \frac{15 \pm 5}{2} \\
x_1 = 5, \quad x_2 = 10
\end{gathered}
$$

La condizione $x \leq 7$ scarta $10$: $S = \{5\}$. Verifica: $5 + \sqrt{4} = 5 + 2 = 7$.
```

```ad-warning
Elevare al quadrato senza isolare il radicale
Se nell'esempio 3 elevi al quadrato $x + \sqrt{x - 1} = 7$ così com'è, ottieni $x^2 + 2x\sqrt{x - 1} + x - 1 = 49$: il doppio prodotto contiene ancora la radice, e non hai fatto passi avanti. Prima si isola il radicale, poi si eleva al quadrato.
```

```ad-example
Esempio 4: una soluzione negativa
$$\sqrt{x + 6} = -x$$

Condizione: $-x \geq 0$, cioè $x \leq 0$. Eleva al quadrato:

$$
\begin{gathered}
x + 6 = x^2 \\
\Rightarrow x^2 - x - 6 = 0 \\
\Rightarrow x_1 = -2, \quad x_2 = 3
\end{gathered}
$$

La condizione tiene $-2$ e scarta $3$: $S = \{-2\}$. Verifica: $\sqrt{-2 + 6} = 2$ e $-(-2) = 2$.
```

```ad-warning
Scartare le soluzioni negative
La condizione riguarda il secondo membro $B(x)$, non la $x$. Nell'esempio 4 la soluzione è negativa, $x = -2$, e va bene, perché per $x = -2$ il secondo membro $-x$ vale $2$. Una soluzione si scarta solo se non rispetta $B(x) \geq 0$.
```

```ad-example
Esempio 5: un'equazione impossibile
$$\sqrt{x^2 + 3} = x - 1$$

Condizione: $x \geq 1$. Eleva al quadrato:

$$
\begin{gathered}
x^2 + 3 = x^2 - 2x + 1 \\
\Rightarrow 2x = -2 \\
\Rightarrow x = -1
\end{gathered}
$$

I termini $x^2$ si cancellano, e resta un'equazione di primo grado. La sua soluzione, $-1$, non rispetta $x \geq 1$: l'equazione è impossibile, $S = \emptyset$. Infatti per $x = -1$ il primo membro vale $\sqrt{4} = 2$ e il secondo $-2$.
```

```ad-tip
Il metodo della verifica
Invece della condizione $B(x) \geq 0$ puoi elevare al quadrato senza condizioni, risolvere, e poi mettere ogni soluzione trovata nell'equazione di partenza: tieni quelle che la rendono vera. È il controllo fatto negli esempi dopo la soluzione. Conviene quando la condizione è scomoda da risolvere, come con due radicali; con soluzioni irrazionali, invece, la verifica richiede conti lunghi, e la condizione è più rapida. Nelle disequazioni la verifica non si può usare, perché le soluzioni sono infinite.
```

## Due radicali

### Due radici uguali

Nell'equazione $\sqrt{A(x)} = \sqrt{B(x)}$ i due membri, se esistono, non sono negativi, e l'elevamento al quadrato non aggiunge soluzioni. Serve solo che i radicali esistano; e dove $A(x) = B(x)$, se uno dei due radicandi non è negativo, non lo è nemmeno l'altro. Serve quindi una condizione sola, sul radicando più semplice:

$$
\begin{cases}
A(x) \geq 0 \\
A(x) = B(x)
\end{cases}
$$

```ad-example
Esempio 6: la condizione sul radicando più semplice
$$\sqrt{x^2 - 4} = \sqrt{3x}$$

Il radicando più semplice è $3x$: condizione $3x \geq 0$, cioè $x \geq 0$. Eleva al quadrato:

$$
\begin{gathered}
x^2 - 4 = 3x \\
\Rightarrow x^2 - 3x - 4 = 0 \\
\Rightarrow x_1 = -1, \quad x_2 = 4
\end{gathered}
$$

La condizione scarta $-1$: per $x = -1$ i radicandi valgono tutti e due $-3$, e le radici non esistono. Resta $S = \{4\}$, con $\sqrt{12} = \sqrt{12}$.
```

### Somma di due radici

Nell'equazione $\sqrt{A(x)} + \sqrt{B(x)} = k$ un solo elevamento al quadrato non basta. Si isola una radice, si eleva al quadrato, si isola la radice che rimane e si eleva al quadrato di nuovo. Le condizioni da scrivere a ogni passo diventano molte, e qui conviene la verifica.

```ad-example
Esempio 7: due elevamenti al quadrato
$$\sqrt{2x + 1} + \sqrt{x - 3} = 4$$

Isola la prima radice ed eleva al quadrato; a secondo membro c'è il quadrato di un binomio, con il doppio prodotto $2 \cdot 4 \cdot \sqrt{x - 3} = 8\sqrt{x - 3}$:

$$\sqrt{2x + 1} = 4 - \sqrt{x - 3}$$

$$
\begin{aligned}
2x + 1 &= 16 - 8\sqrt{x - 3} \\
&\quad + x - 3
\end{aligned}
$$

Isola la radice rimasta ed eleva di nuovo al quadrato:

$$
\begin{gathered}
8\sqrt{x - 3} = 12 - x \\
64(x - 3) = 144 - 24x + x^2 \\
x^2 - 88x + 336 = 0
\end{gathered}
$$

$$
\begin{gathered}
\Delta = 7744 - 1344 = 6400 \\
x_{1,2} = \frac{88 \pm 80}{2} \\
x_1 = 4, \quad x_2 = 84
\end{gathered}
$$

Verifica. Per $x = 4$: $\sqrt{9} + \sqrt{1} = 3 + 1 = 4$, vero. Per $x = 84$: $\sqrt{169} + \sqrt{81} = 13 + 9 = 22$, falso. Quindi $S = \{4\}$. La soluzione $84$ non rispetta la condizione $12 - x \geq 0$ del secondo elevamento: con le condizioni si arrivava allo stesso risultato.
```

## Radici cubiche

Una radice cubica esiste per ogni radicando e ha il suo stesso segno, come nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta). Inoltre due numeri con lo stesso cubo sono uguali: $(-2)^3 = -8$ e $2^3 = 8$ sono diversi. Elevare al cubo non aggiunge soluzioni, e l'equazione $\sqrt[3]{A(x)} = B(x)$ equivale a

$$A(x) = [B(x)]^3$$

senza condizioni, se non quelle per eventuali denominatori.

```ad-example
Esempio 8: una radice cubica
$$\sqrt[3]{x^3 - 7} = x - 1$$

Eleva al cubo tutti e due i membri. Il cubo del binomio è $(x - 1)^3 = x^3 - 3x^2 + 3x - 1$:

$$
\begin{gathered}
x^3 - 7 = x^3 - 3x^2 + 3x - 1 \\
\Rightarrow 3x^2 - 3x - 6 = 0 \\
\Rightarrow x^2 - x - 2 = 0
\end{gathered}
$$

Le soluzioni sono $-1$ e $2$, e vanno bene tutte e due: $S = \{-1, 2\}$. Verifica: per $x = -1$, $\sqrt[3]{-8} = -2$ e $-1 - 1 = -2$; per $x = 2$, $\sqrt[3]{1} = 1$ e $2 - 1 = 1$.
```

```ad-warning
Le condizioni della radice quadrata sulla radice cubica
Nell'esempio 8 chi impone $x - 1 \geq 0$, come per una radice quadrata, perde la soluzione $-1$. Una radice cubica può essere negativa: nessuna condizione sul secondo membro.
```

## Disequazioni irrazionali

In una disequazione irrazionale l'incognita sta sotto una radice e al posto dell'uguale c'è un verso. Le soluzioni sono intervalli, scritti come nella lezione [Disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), e sono infinite: la verifica non si può fare, e le condizioni si scrivono sempre. Ogni disequazione diventa un sistema, o l'unione di due sistemi, di disequazioni senza radici.

Il principio è uno: se due numeri sono positivi o nulli, elevandoli al quadrato il verso resta lo stesso. Da $2 < 3$ viene $4 < 9$. Se uno dei due è negativo non funziona più: $-3 < 2$, ma $9 > 4$.

### Radice confrontata con un numero

Con un numero $k$ a secondo membro i casi si leggono dal segno di $k$:

| Disequazione | $k < 0$ | $k = 0$ | $k > 0$ |
|---|---|---|---|
| $\sqrt{A(x)} < k$ | impossibile | impossibile | $0 \leq A(x) < k^2$ |
| $\sqrt{A(x)} > k$ | $A(x) \geq 0$ | $A(x) > 0$ | $A(x) > k^2$ |

Una radice non è mai negativa, quindi non è mai minore di un numero negativo o di zero, ed è sempre maggiore di un numero negativo, dove esiste. Con $k > 0$ si eleva al quadrato. Nel verso $<$ va aggiunta la condizione $A(x) \geq 0$; nel verso $>$ no, perché $A(x) > k^2$ la contiene già. Per esempio $\sqrt{x + 1} < -2$ è impossibile, e $\sqrt{x + 1} > -2$ è vera per $x \geq -1$.

Con i versi $\leq$ e $\geq$ si ragiona allo stesso modo: $\sqrt{A(x)} \leq 0$ vale solo dove $A(x) = 0$, e con $k > 0$ si ha $0 \leq A(x) \leq k^2$ nel verso $\leq$ e $A(x) \geq k^2$ nel verso $\geq$.

```ad-example
Esempio 9: radice minore di un numero
$$\sqrt{x - 2} < 3$$

Il numero è positivo: il radicando deve esistere ed essere minore di $3^2 = 9$.

$$
\begin{cases}
x - 2 \geq 0 \\
x - 2 < 9
\end{cases}
\Rightarrow
\begin{cases}
x \geq 2 \\
x < 11
\end{cases}
$$

Quindi $2 \leq x < 11$, cioè $S = [2, 11\mathclose{[}$.
```

```ad-warning
Dimenticare che il radicale deve esistere
Nell'esempio 9 chi eleva soltanto al quadrato trova $x < 11$, che comprende anche $x = 0$. Ma $\sqrt{0 - 2}$ non esiste. Nel verso $<$ la condizione $A(x) \geq 0$ va scritta.
```

```ad-example
Esempio 10: radice maggiore o uguale a un numero
$$\sqrt{x^2 - 5} \geq 2$$

Il numero è positivo: eleva al quadrato. La condizione di esistenza è già contenuta nel risultato.

$$
\begin{gathered}
x^2 - 5 \geq 4 \\
\Rightarrow x^2 \geq 9
\end{gathered}
$$

Le soluzioni sono i valori esterni a $-3$ e $3$, estremi compresi: $x \leq -3$ oppure $x \geq 3$.

$$S = \,\mathopen{]}-\infty, -3] \cup [3, +\infty\mathclose{[}$$
```

### Radice minore di un'espressione

La disequazione $\sqrt{A(x)} < B(x)$ chiede tre cose: il radicale deve esistere; $B(x)$ deve essere positivo, perché è maggiore di una radice, che non è negativa; e, con i due membri non negativi, si può elevare al quadrato senza cambiare il verso. Equivale quindi al sistema

$$
\begin{cases}
A(x) \geq 0 \\
B(x) > 0 \\
A(x) < [B(x)]^2
\end{cases}
$$

Con il verso $\leq$ il sistema è lo stesso, con $B(x) \geq 0$ e $A(x) \leq [B(x)]^2$.

```ad-example
Esempio 11: un sistema di tre disequazioni
$$\sqrt{x + 5} < x - 1$$

Scrivi e risolvi le tre disequazioni del sistema.

- Esistenza: $x + 5 \geq 0$, cioè $x \geq -5$.
- Secondo membro positivo: $x - 1 > 0$, cioè $x > 1$.
- Elevamento al quadrato: $x + 5 < x^2 - 2x + 1$, cioè $x^2 - 3x - 4 > 0$. Il trinomio si annulla in $-1$ e in $4$, e con il verso $>$ servono i valori esterni: $x < -1$ oppure $x > 4$.

```tikz
% nome: sistema-disequazione-irrazionale
% alt: Grafico del sistema della disequazione radice di x più 5 minore di x meno 1: la prima riga parte da meno 5 con il pallino pieno, la seconda parte da 1 con il pallino vuoto, la terza è formata da due semirette, prima di meno 1 e dopo 4, con i pallini vuoti; è colorata la striscia dopo 4, dove ci sono tutte e tre le linee
% svg: sistema-disequazione-irrazionale-3d20b742.svg 276x98
\begin{tikzpicture}
\fill[orange!20] (3.20,-0.1) rectangle (4.00,1.90);
\draw[gray!70, dashed] (0.80,-0.1) -- (0.80,1.90);
\draw[gray!70, dashed] (1.60,-0.1) -- (1.60,1.90);
\draw[gray!70, dashed] (2.40,-0.1) -- (2.40,1.90);
\draw[gray!70, dashed] (3.20,-0.1) -- (3.20,1.90);
\draw[->] (0,0) -- (4.30,0) node[right] {$x$};
\draw (0.80,-0.08) -- (0.80,0.08);
\node[below] at (0.80,-0.1) {$-5$};
\draw (1.60,-0.08) -- (1.60,0.08);
\node[below] at (1.60,-0.1) {$-1$};
\draw (2.40,-0.08) -- (2.40,0.08);
\node[below] at (2.40,-0.1) {$1$};
\draw (3.20,-0.08) -- (3.20,0.08);
\node[below] at (3.20,-0.1) {$4$};
\node[left] at (0,1.65) {\small $x+5 \ge 0$};
\draw[blue!50, line width=1.8pt] (0.80,1.65) -- (4.00,1.65);
\fill (0.80,1.65) circle (2.2pt);
\node[left] at (0,1.10) {\small $x-1 > 0$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.40,1.10) -- (4.00,1.10);
\draw[thick] (2.40,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x^2-3x-4 > 0$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (1.60,0.55);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.20,0.55) -- (4.00,0.55);
\draw[thick] (1.60,0.55) circle (2.2pt);
\draw[thick] (3.20,0.55) circle (2.2pt);
\end{tikzpicture}
```

Le tre linee ci sono insieme solo dopo $4$: $S = \,\mathopen{]}4, +\infty\mathclose{[}$. Verifica con $x = 5$: $\sqrt{10}$ vale circa $3{,}16$, che è minore di $5 - 1 = 4$.
```

```ad-example
Esempio 12: il radicando di secondo grado
$$\sqrt{x^2 - 4} < x + 1$$

- Esistenza: $x^2 - 4 \geq 0$, cioè $x \leq -2$ oppure $x \geq 2$.
- Secondo membro positivo: $x + 1 > 0$, cioè $x > -1$.
- Elevamento al quadrato: $x^2 - 4 < x^2 + 2x + 1$, cioè $2x > -5$ e $x > -\dfrac{5}{2}$.

Le tre condizioni valgono insieme per $x \geq 2$: la prima toglie tutto l'intervallo tra $-1$ e $2$, e la parte $x \leq -2$ non rispetta la seconda. Quindi $S = [2, +\infty\mathclose{[}$.
```

### Radice maggiore di un'espressione

Nella disequazione $\sqrt{A(x)} > B(x)$ il segno di $B(x)$ divide i casi in due.

- Dove $B(x) < 0$ la disequazione è vera in tutti i punti in cui la radice esiste, perché una radice non negativa è maggiore di un numero negativo.
- Dove $B(x) \geq 0$ i due membri non sono negativi, e si eleva al quadrato. La condizione di esistenza non serve: $A(x) > [B(x)]^2$ la contiene già.

Le soluzioni sono l'unione delle soluzioni dei due sistemi:

$$
\begin{cases}
B(x) < 0 \\
A(x) \geq 0
\end{cases}
$$

$$
\begin{cases}
B(x) \geq 0 \\
A(x) > [B(x)]^2
\end{cases}
$$

Con il verso $\geq$ i sistemi sono gli stessi, con $A(x) \geq [B(x)]^2$ nel secondo.

```ad-example
Esempio 13: l'unione di due sistemi
$$\sqrt{x + 5} > x - 1$$

Primo sistema, secondo membro negativo: $x - 1 < 0$ e $x + 5 \geq 0$, cioè $-5 \leq x < 1$.

Secondo sistema, secondo membro non negativo: $x - 1 \geq 0$, cioè $x \geq 1$, e

$$
\begin{gathered}
x + 5 > x^2 - 2x + 1 \\
\Rightarrow x^2 - 3x - 4 < 0
\end{gathered}
$$

che dà i valori interni, $-1 < x < 4$. Insieme a $x \geq 1$: $1 \leq x < 4$.

L'unione dei due sistemi è $-5 \leq x < 4$, cioè $S = [-5, 4\mathclose{[}$. È la disequazione dell'esempio 11 con il verso opposto: nella figura il grafico di $y = \sqrt{x + 5}$ sta sopra la retta $y = x - 1$ da $-5$ fino al punto di incontro $(4, 3)$, e sotto dopo.

```tikz
% nome: disequazione-irrazionale-confronto-grafici
% alt: Il grafico di y uguale a radice di x più 5, che parte dal punto meno 5, 0, e la retta y uguale a x meno 1, che lo incontra nel punto 4, 3: il grafico della radice sta sopra la retta da meno 5 a 4 e sotto dopo 4; sotto, le soluzioni della disequazione maggiore, da meno 5 compreso a 4 escluso
% svg: disequazione-irrazionale-confronto-grafici-1c643949.svg 264x168
\begin{tikzpicture}
\draw[black!70, ->] (-2.36,0) -- (3.12,0) node[right] {$x$};
\draw[black!70, ->] (0,-1.12) -- (0,2.24) node[above] {$y$};
\draw[thick, red!50] (-0.64,-1.04) -- (2.48,2.08);
\draw[thick] plot[smooth] coordinates {(-2.00,0.00) (-2.00,0.03) (-1.99,0.07) (-1.97,0.10) (-1.95,0.14) (-1.92,0.17) (-1.89,0.21) (-1.85,0.24) (-1.80,0.28) (-1.75,0.31) (-1.70,0.35) (-1.63,0.38) (-1.56,0.42) (-1.48,0.45) (-1.40,0.49) (-1.31,0.52) (-1.22,0.56) (-1.12,0.59) (-1.01,0.63) (-0.90,0.66) (-0.78,0.70) (-0.65,0.73) (-0.52,0.77) (-0.39,0.80) (-0.24,0.84) (-0.09,0.87) (0.06,0.91) (0.22,0.94) (0.39,0.98) (0.57,1.01) (0.74,1.05) (0.93,1.08) (1.12,1.12) (1.32,1.15) (1.53,1.19) (1.74,1.22) (1.95,1.26) (2.18,1.29) (2.40,1.33) (2.64,1.36) (2.88,1.40)};
\draw[blue!60, line width=1.8pt] plot[smooth] coordinates {(-2.00,0.00) (-2.00,0.03) (-1.99,0.07) (-1.97,0.10) (-1.95,0.14) (-1.92,0.17) (-1.89,0.21) (-1.85,0.24) (-1.80,0.28) (-1.75,0.31) (-1.70,0.35) (-1.63,0.38) (-1.56,0.42) (-1.48,0.45) (-1.40,0.49) (-1.31,0.52) (-1.22,0.56) (-1.12,0.59) (-1.01,0.63) (-0.90,0.66) (-0.78,0.70) (-0.65,0.73) (-0.52,0.77) (-0.39,0.80) (-0.24,0.84) (-0.09,0.87) (0.06,0.91) (0.22,0.94) (0.39,0.98) (0.57,1.01) (0.74,1.05) (0.93,1.08) (1.12,1.12) (1.32,1.15) (1.53,1.19) (1.60,1.20)};
\fill (-2.00,0) circle (1.6pt);
\node[below] at (-2.00,-0.05) {\small $-5$};
\fill (1.60,1.20) circle (1.6pt);
\node[above left] at (1.60,1.20) {\small $(4, 3)$};
\draw[gray!60, densely dotted] (1.60,1.20) -- (1.60,-1.24);
\draw[gray!60, densely dotted] (-2.00,-0.35) -- (-2.00,-1.24);
\node[below right] at (1.60,-0.05) {\small $4$};
\node[black!80, below] at (2.64,1.20) {\small $y=\sqrt{x+5}$};
\node[red!60!black, right] at (2.48,2.00) {\small $y=x-1$};
\node[left] at (-2.36,-1.44) {\small $S$};
\draw[blue!45, line width=2pt] (-2.00,-1.44) -- (1.50,-1.44);
\fill (-2.00,-1.44) circle (2.5pt);
\draw[thick] (1.60,-1.44) circle (2.5pt);
\end{tikzpicture}
```
```

```ad-warning
Un sistema solo
Nell'esempio 13 chi eleva al quadrato solo con $x - 1 \geq 0$ trova $1 \leq x < 4$ e perde tutti i valori tra $-5$ e $1$. Per $x = 0$, per esempio, $\sqrt{5} > -1$ è vero. Dove il secondo membro è negativo la disequazione $\sqrt{A(x)} > B(x)$ è sempre vera, se la radice esiste.
```

```ad-warning
Intersezione al posto dell'unione
I due sistemi di $\sqrt{A(x)} > B(x)$ descrivono due casi che non possono valere insieme, $B(x) < 0$ e $B(x) \geq 0$: le loro soluzioni si uniscono. Se le intersechi trovi sempre $S = \emptyset$.
```
