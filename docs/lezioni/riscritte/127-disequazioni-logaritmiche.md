# Disequazioni logaritmiche

Una soluzione è acida quando il suo pH è minore di $7$, e il pH è un logaritmo cambiato di segno, $-\log x$, dove $x$ è la concentrazione degli ioni idrogeno in moli per litro: chiedere quali concentrazioni danno $-\log x < 7$ vuol dire risolvere una disequazione logaritmica. Si risolve come un'[equazione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-logaritmiche), passando dai logaritmi agli argomenti, con due attenzioni in più: il verso della disuguaglianza dipende dalla base, e le condizioni di esistenza si mettono a sistema con il resto, perché le soluzioni sono infinite e non si possono controllare una per una.

Ti servono la [funzione logaritmica](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-logaritmica), i [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni) e le [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado).

## Il verso dipende dalla base

Una **disequazione logaritmica** è una disequazione in cui l'incognita compare nell'argomento di almeno un logaritmo, come $\log_2 (x - 1) > 3$.

Il passaggio dai logaritmi agli argomenti si fa con l'andamento della funzione logaritmica. Per due numeri positivi $A$ e $B$:

- se $a > 1$ la funzione è crescente e il verso si conserva: $\log_a A > \log_a B \iff A > B$;
- se $0 < a < 1$ la funzione è decrescente e il verso si rovescia: $\log_a A > \log_a B \iff A < B$.

Le due curve della figura mostrano la differenza sulla stessa richiesta, $\log_a x > -1$. Con la base $2$ la curva sta sopra la retta $y = -1$ a destra del punto di incontro, per $x > \dfrac{1}{2}$. Con la base $\dfrac{1}{2}$ la curva scende, e sta sopra la retta a sinistra del punto di incontro, per $0 < x < 2$: a sinistra le soluzioni si fermano a $0$, perché lì finisce il dominio.

```tikz
% nome: disequazione-logaritmica-verso-e-base
% alt: A sinistra il grafico di y = logaritmo in base 2 di x, crescente, sopra la retta y = -1 per x maggiore di un mezzo; a destra il grafico di y = logaritmo in base un mezzo di x, decrescente, sopra la retta y = -1 per x tra 0 e 2. In ogni disegno le soluzioni sono segnate sull'asse x con una linea spessa e i pallini vuoti agli estremi
\begin{tikzpicture}[scale=0.6]
\begin{scope}
\draw[gray!25, very thin] (-0.5,-2.5) grid (4.5,2.5);
\draw[->] (-0.8,0) -- (5,0) node[right] {\small $x$};
\draw[->] (0,-2.8) -- (0,3.1) node[above] {\small $y$};
\draw[orange!80, thick] (-0.5,-1) -- (4.5,-1);
\node[left] at (-0.4,-1) {\small $-1$};
\draw[thick, blue!60, domain=0.18:4.5, samples=100, smooth] plot (\x, {ln(\x)/ln(2)});
\draw[dashed, gray] (0.5,-1) -- (0.5,0);
\draw[blue!50, line width=2pt] (0.5,0) -- (4.5,0);
\fill (0.5,-1) circle (0.1);
\draw[thick, fill=gray!20] (0.5,0) circle (0.12);
\node[above] at (0.55,0.1) {\small $\frac{1}{2}$};
\node at (2.2,-3.6) {$\log_2 x > -1$};
\end{scope}
\begin{scope}[shift={(7.4,0)}]
\draw[gray!25, very thin] (-0.5,-2.5) grid (4.5,2.5);
\draw[->] (-0.8,0) -- (5,0) node[right] {\small $x$};
\draw[->] (0,-2.8) -- (0,3.1) node[above] {\small $y$};
\draw[orange!80, thick] (-0.5,-1) -- (4.5,-1);
\node[left] at (-0.4,-1) {\small $-1$};
\draw[thick, blue!60, domain=0.18:4.5, samples=100, smooth] plot (\x, {-ln(\x)/ln(2)});
\draw[dashed, gray] (2,-1) -- (2,0);
\draw[blue!50, line width=2pt] (0,0) -- (2,0);
\fill (2,-1) circle (0.1);
\draw[thick, fill=gray!20] (0,0) circle (0.12);
\draw[thick, fill=gray!20] (2,0) circle (0.12);
\node[above] at (2.1,0.1) {\small $2$};
\node at (2.2,-3.6) {$\log_{\frac{1}{2}} x > -1$};
\end{scope}
\end{tikzpicture}
```
```grafico
% nome: disequazione-logaritmica-cursori
% alt: Il grafico di y = logaritmo in base a di x e la retta y = c, con i cursori di a e di c: è colorata la parte di piano dove il logaritmo è maggiore di c, oppure quella dove è minore, e passa dall'altra parte del punto di incontro quando la base scende sotto 1
curva: y=\log_a\left(x\right)
curva: y=c | arancione
scelta: > c :: \log_a\left(x\right)\cdot\log_a\left(a\right)>c | blu
scelta: < c :: \log_a\left(x\right)\cdot\log_a\left(a\right)<c | rosso
cursore: a = 2 da 0,2 a 4 passo 0,1
cursore: c = -1 da -3 a 3 passo 0,1
finestra: x da -2 a 10, y da -6 a 6
curva: P=\left(a^c;\log_a\left(a^c\right)\right) | nero | nome
valore: P = \left(a^c;\log_a\left(a^c\right)\right)
domanda: Con il verso $>$ porta $a$ sotto $1$: da che parte del punto di incontro passano le soluzioni? Arrivano mai a sinistra dell'asse $y$?
```

Con $a > 1$ le soluzioni di $\log_a x > c$ stanno a destra del punto di incontro $P$, $x > a^c$. Con $0 < a < 1$ passano a sinistra, ma si fermano all'asse $y$: $0 < x < a^c$. A sinistra dell'asse $y$ il logaritmo non esiste, e lì non arriva nessuna soluzione, con nessuno dei due versi. Per $a = 1$ la curva sparisce, e non c'è niente da confrontare.

```ad-warning
Base minore di 1: il verso cambia
Passare da $\log_{\frac{1}{2}} x > -1$ a $x > 2$ è l'errore più frequente di questo argomento. Con la base $\dfrac{1}{2}$ il logaritmo più grande è quello dell'argomento più piccolo, e la disequazione diventa $x < 2$ (con $x > 0$). Guarda la base prima di togliere i logaritmi, ogni volta.
```

## Un logaritmo confrontato con un numero

Nella disequazione $\log_a f(x) > c$ il numero $c$ si scrive come logaritmo, $c = \log_a a^c$, e poi si confrontano gli argomenti con la regola del verso. Insieme va tenuta la condizione di esistenza $f(x) > 0$. Vengono quattro casi:

| Disequazione | Con $a > 1$ | Con $0 < a < 1$ |
|---|---|---|
| $\log_a f(x) > c$ | $f(x) > a^c$ | $0 < f(x) < a^c$ |
| $\log_a f(x) < c$ | $0 < f(x) < a^c$ | $f(x) > a^c$ |

Con $\geq$ e $\leq$ al posto di $>$ e $<$ la tabella è la stessa, tranne che per la condizione $f(x) > 0$, che resta sempre con il verso stretto. Dove la tabella dice $f(x) > a^c$ la condizione di esistenza non si scrive, perché un numero maggiore di $a^c$, che è positivo, è già positivo. Dove dice $0 < f(x) < a^c$ la condizione è la metà di sinistra, e dimenticarla dà soluzioni in più.

```ad-example
Esempio 1: base maggiore di 1, verso maggiore
Risolvi $\log_2 (x - 1) > 3$.

La base è $2 > 1$ e $3 = \log_2 2^3 = \log_2 8$. Il verso si conserva:

$$x - 1 > 8 \ \Rightarrow \ x > 9$$

La condizione $x - 1 > 0$ è già compresa. Quindi $S = \mathopen{]}9, +\infty\mathclose{[}$. Verifica con $x = 17$: $\log_2 16 = 4 > 3$, vero.
```

La disequazione del pH si risolve allo stesso modo. Da $-\log x < 7$, cambiando i segni e il verso, si ottiene $\log x > -7$; la base è $10 > 1$, quindi $x > 10^{-7}$: una soluzione è acida quando la concentrazione supera $10^{-7}$ moli per litro.

```ad-example
Esempio 2: base maggiore di 1, verso minore
Risolvi $\log_3 (2x + 1) \leq 2$.

La base è $3 > 1$ e $2 = \log_3 9$. Il verso si conserva, ma questa volta l'argomento è limitato solo dall'alto, e la condizione di esistenza va scritta:

$$
\begin{gathered}
0 < 2x + 1 \leq 9 \\
\Rightarrow -1 < 2x \leq 8 \\
\Rightarrow -\frac{1}{2} < x \leq 4
\end{gathered}
$$

Quindi $S = \left]-\dfrac{1}{2}, 4\right]$. L'estremo $4$ è compreso, perché $\log_3 9 = 2$; l'estremo $-\dfrac{1}{2}$ no, perché lì l'argomento vale zero.
```

```ad-warning
La condizione di esistenza dimenticata
Nell'esempio 2 chi scrive solo $2x + 1 \leq 9$ trova $x \leq 4$ e mette tra le soluzioni anche $x = -3$, per cui l'argomento vale $-5$ e il logaritmo non esiste. Quando la disequazione limita l'argomento solo dall'alto, a limitarlo dal basso è la condizione di esistenza.
```

```ad-example
Esempio 3: base minore di 1
Risolvi $\log_{\frac{1}{2}} (x + 3) > -2$.

La base è $\dfrac{1}{2} < 1$ e $\left(\dfrac{1}{2}\right)^{-2} = 4$, quindi $-2 = \log_{\frac{1}{2}} 4$. Il verso si rovescia, e l'argomento deve restare positivo:

$$
\begin{gathered}
0 < x + 3 < 4 \\
\Rightarrow -3 < x < 1
\end{gathered}
$$

Quindi $S = \mathopen{]}-3, 1\mathclose{[}$. Verifica con $x = -1$: $\log_{\frac{1}{2}} 2 = -1 > -2$, vero.
```

```ad-example
Esempio 4: base minore di 1 e argomento di secondo grado
Risolvi $\log_{\frac{1}{2}} \left(x^2 - 3x\right) \geq -2$.

Come nell'esempio 3, $-2 = \log_{\frac{1}{2}} 4$ e il verso si rovescia: $0 < x^2 - 3x \leq 4$. Sono due disequazioni di secondo grado, da risolvere a sistema:

$$
\begin{cases}
x^2 - 3x > 0 \\
x^2 - 3x - 4 \leq 0
\end{cases}
$$

La prima ha l'equazione associata $x(x - 3) = 0$, con soluzioni $0$ e $3$, ed è vera per i valori esterni: $x < 0$ oppure $x > 3$. La seconda ha $\Delta = 9 + 16 = 25$ e soluzioni $-1$ e $4$, ed è vera per i valori interni: $-1 \leq x \leq 4$.

```tikz
% nome: sistema-logaritmica-base-minore-di-1
% alt: Grafico del sistema tra x al quadrato meno 3x maggiore di 0, vera prima di 0 e dopo 3, e x al quadrato meno 3x meno 4 minore o uguale a 0, vera tra -1 e 4 con gli estremi compresi: le due linee si sovrappongono tra -1 e 0, con -1 compreso e 0 escluso, e tra 3 e 4, con 3 escluso e 4 compreso
\begin{tikzpicture}
\fill[orange!20] (1.10,-0.1) rectangle (2.20,1.35);
\fill[orange!20] (3.30,-0.1) rectangle (4.40,1.35);
\draw[gray!70, dashed] (1.10,-0.1) -- (1.10,1.35);
\draw[gray!70, dashed] (2.20,-0.1) -- (2.20,1.35);
\draw[gray!70, dashed] (3.30,-0.1) -- (3.30,1.35);
\draw[gray!70, dashed] (4.40,-0.1) -- (4.40,1.35);
\draw[->] (0,0) -- (5.80,0) node[right] {$x$};
\draw (1.10,-0.08) -- (1.10,0.08);
\node[below] at (1.10,-0.1) {$-1$};
\draw (2.20,-0.08) -- (2.20,0.08);
\node[below] at (2.20,-0.1) {$0$};
\draw (3.30,-0.08) -- (3.30,0.08);
\node[below] at (3.30,-0.1) {$3$};
\draw (4.40,-0.08) -- (4.40,0.08);
\node[below] at (4.40,-0.1) {$4$};
\node[left] at (0,1.10) {\small $x^2 - 3x > 0$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,1.10) -- (2.20,1.10);
\draw[thick] (2.20,1.10) circle (2.2pt);
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (3.30,1.10) -- (5.50,1.10);
\draw[thick] (3.30,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x^2 - 3x - 4 \le 0$};
\draw[blue!50, line width=1.8pt] (1.10,0.55) -- (4.40,0.55);
\fill (1.10,0.55) circle (2.2pt);
\fill (4.40,0.55) circle (2.2pt);
\end{tikzpicture}
```

Le due linee si sovrappongono in due tratti:

$$S = [-1, 0\mathclose{[} \,\cup\, \mathopen{]}3, 4]$$

Verifica con $x = 4$: l'argomento vale $16 - 12 = 4$ e $\log_{\frac{1}{2}} 4 = -2 \geq -2$, vero. Con $x = 1$, che sta tra i due tratti, l'argomento vale $-2$ e il logaritmo non esiste.
```

## Due logaritmi con la stessa base

Per $\log_a f(x) > \log_a g(x)$ servono tre condizioni insieme: i due argomenti positivi e il confronto tra gli argomenti, con il verso conservato se $a > 1$ e rovesciato se $0 < a < 1$.

$$
a > 1: \
\begin{cases}
f(x) > 0 \\
g(x) > 0 \\
f(x) > g(x)
\end{cases}
\qquad
0 < a < 1: \
\begin{cases}
f(x) > 0 \\
g(x) > 0 \\
f(x) < g(x)
\end{cases}
$$

Le prime due righe sono le C.E., e hanno sempre il verso $>$, qualunque sia la base e qualunque sia il verso della disequazione.

```ad-example
Esempio 5: base maggiore di 1
Risolvi $\log_2 (x + 3) > \log_2 (2x - 1)$.

La base è $2 > 1$ e il verso si conserva:

$$
\begin{cases}
x + 3 > 0 \\
2x - 1 > 0 \\
x + 3 > 2x - 1
\end{cases}
\ \Rightarrow \
\begin{cases}
x > -3 \\
x > \dfrac{1}{2} \\
x < 4
\end{cases}
$$

```tikz
% nome: sistema-logaritmica-due-logaritmi
% alt: Grafico del sistema tra x maggiore di -3, x maggiore di un mezzo e x minore di 4: le tre linee si sovrappongono tra un mezzo e 4, con i due estremi esclusi
\begin{tikzpicture}
\fill[orange!20] (2.50,-0.1) rectangle (3.75,1.90);
\draw[gray!70, dashed] (1.25,-0.1) -- (1.25,1.90);
\draw[gray!70, dashed] (2.50,-0.1) -- (2.50,1.90);
\draw[gray!70, dashed] (3.75,-0.1) -- (3.75,1.90);
\draw[->] (0,0) -- (5.30,0) node[right] {$x$};
\draw (1.25,-0.08) -- (1.25,0.08);
\node[below] at (1.25,-0.1) {$-3$};
\draw (2.50,-0.08) -- (2.50,0.08);
\node[below] at (2.50,-0.1) {$\frac{1}{2}$};
\draw (3.75,-0.08) -- (3.75,0.08);
\node[below] at (3.75,-0.1) {$4$};
\node[left] at (0,1.65) {\small $x > -3$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (1.25,1.65) -- (5.00,1.65);
\draw[thick] (1.25,1.65) circle (2.2pt);
\node[left] at (0,1.10) {\small $x > \frac{1}{2}$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.50,1.10) -- (5.00,1.10);
\draw[thick] (2.50,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $x < 4$};
\draw[blue!50, line width=1.8pt, shorten >=2.6pt] (0.00,0.55) -- (3.75,0.55);
\draw[thick] (3.75,0.55) circle (2.2pt);
\end{tikzpicture}
```

Quindi $S = \left]\dfrac{1}{2}, 4\right[$. Verifica con $x = 1$: $\log_2 4 = 2$ e $\log_2 1 = 0$, e $2 > 0$ è vero.
```

```ad-example
Esempio 6: base minore di 1
Risolvi $\log_{\frac{1}{3}} (x + 1) \geq \log_{\frac{1}{3}} (5 - x)$.

La base è $\dfrac{1}{3} < 1$ e il verso si rovescia; le condizioni di esistenza restano con il verso $>$:

$$
\begin{cases}
x + 1 > 0 \\
5 - x > 0 \\
x + 1 \leq 5 - x
\end{cases}
\ \Rightarrow \
\begin{cases}
x > -1 \\
x < 5 \\
x \leq 2
\end{cases}
$$

Le tre condizioni valgono insieme per $-1 < x \leq 2$: $S = \mathopen{]}-1, 2]$. Verifica con $x = 0$: $\log_{\frac{1}{3}} 1 = 0$ e $\log_{\frac{1}{3}} 5$ è negativo, quindi $0 \geq \log_{\frac{1}{3}} 5$ è vero.
```

Qui sotto ci sono i due membri dell'esempio 5 come funzioni, $y = \log_2 (x + 3)$ e $y = \log_2 (2x - 1)$. La seconda curva comincia solo da $x = \dfrac{1}{2}$, e la prima le sta sopra fino a $x = 4$, dove si incontrano: le soluzioni sono $\dfrac{1}{2} < x < 4$.

```tikz
% nome: disequazione-due-logaritmi-curve
% alt: I grafici di y = logaritmo in base 2 di (x + 3) e di y = logaritmo in base 2 di (2x - 1): il secondo esiste solo a destra della retta x = un mezzo, tratteggiata, e i due si incontrano nel punto di ascissa 4; tra un mezzo e 4 il primo sta sopra il secondo, e quel tratto dell'asse x è segnato con una linea spessa
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-3.5,-3.5) grid (7.5,4.5);
\draw[->] (-3.8,0) -- (8.1,0) node[right] {$x$};
\draw[->] (0,-3.8) -- (0,5.1) node[above] {$y$};
\foreach \x in {-2,2,4,6} \node[below] at (\x,-0.05) {\small $\x$};
\draw[dashed, gray] (0.5,-3.6) -- (0.5,4.6);
\draw[thick, blue!60, domain=-2.91:7.5, samples=140, smooth] plot (\x, {ln(\x+3)/ln(2)});
\draw[thick, orange!70, domain=0.545:7.5, samples=140, smooth] plot (\x, {ln(2*\x-1)/ln(2)});
\draw[dashed, gray] (4,2.807) -- (4,0);
\draw[blue!50, line width=2pt] (0.5,0) -- (4,0);
\draw[thick, fill=gray!20] (0.5,0) circle (0.12);
\draw[thick, fill=gray!20] (4,0) circle (0.12);
\fill (4,2.807) circle (0.1);
\node[blue!60!black, above] at (-1.9,1.3) {\small $\log_2 (x + 3)$};
\node[orange!70!black, right] at (1.35,-1.6) {\small $\log_2 (2x - 1)$};
\end{tikzpicture}
```
```grafico
% nome: disequazione-due-logaritmi-cursore
% alt: I grafici di y = logaritmo in base a di (x + 3) e di y = logaritmo in base a di (2x - 1) con il cursore della base a e la retta x = un mezzo tratteggiata: le due curve si incontrano sempre nel punto di ascissa 4; con a maggiore di 1 la prima sta sopra tra un mezzo e 4, con a tra 0 e 1 sta sopra a destra di 4
curva: y=\log_a\left(x+3\right) | blu
curva: y=\log_a\left(2x-1\right) | arancione
curva: x=\frac{1}{2} | tratteggiata | grigio
cursore: a = 2 da 0,2 a 4 passo 0,1
finestra: x da -5 a 9, y da -7 a 7
domanda: Porta $a$ a $0{,}5$: il punto di incontro si sposta? E dove sta adesso la curva blu sopra quella arancione?
```

Il punto di incontro resta in $x = 4$, perché lì i due argomenti sono uguali qualunque sia la base. Con la base minore di $1$ le due curve si ribaltano, e la blu sta sopra l'arancione a destra di $4$: le soluzioni di $\log_a (x + 3) > \log_a (2x - 1)$ diventano $x > 4$. A sinistra di $\dfrac{1}{2}$ la seconda curva non c'è, con nessuna base, e lì non c'è niente da confrontare.

```ad-warning
Il verso delle C.E. non si rovescia mai
Con la base minore di $1$ si rovescia solo il verso del confronto tra gli argomenti. Le condizioni di esistenza restano $f(x) > 0$ e $g(x) > 0$: un logaritmo esiste quando l'argomento è positivo, e questo non dipende dalla base.
```

## Disequazioni in cui servono le proprietà

Con più logaritmi, o con un numero accanto ai logaritmi, i passi sono quelli delle equazioni logaritmiche, con il sistema al posto del controllo finale.

1. Scrivi le C.E. sulla disequazione di partenza: ogni argomento positivo.
2. Con le proprietà dei logaritmi riduci ogni membro a un solo logaritmo, tutti con la stessa base, scrivendo come logaritmi anche i numeri.
3. Passa agli argomenti: stesso verso se la base è maggiore di $1$, verso opposto se è compresa tra $0$ e $1$.
4. Risolvi la disequazione ottenuta.
5. Metti a sistema il risultato con le C.E.: le soluzioni sono la parte comune.

```ad-example
Esempio 7: somma di logaritmi
Risolvi $\log_2 x + \log_2 (x - 2) < 3$.

C.E.: $x > 0$ e $x - 2 > 0$, cioè $x > 2$. Unisci i logaritmi e scrivi $3 = \log_2 8$:

$$\log_2 \left[x(x - 2)\right] < \log_2 8$$

La base è maggiore di $1$ e il verso si conserva:

$$
\begin{gathered}
x(x - 2) < 8 \\
\Rightarrow x^2 - 2x - 8 < 0
\end{gathered}
$$

L'equazione associata ha $\Delta = 36$ e soluzioni $-2$ e $4$; la disequazione è vera per i valori interni, $-2 < x < 4$. A sistema con la condizione $x > 2$:

```tikz
% nome: sistema-logaritmica-somma
% alt: Grafico del sistema tra la condizione di esistenza x maggiore di 2 e la disequazione vera per x tra -2 e 4: le due linee si sovrappongono tra 2 e 4, con i due estremi esclusi
\begin{tikzpicture}
\fill[orange!20] (2.50,-0.1) rectangle (3.75,1.35);
\draw[gray!70, dashed] (1.25,-0.1) -- (1.25,1.35);
\draw[gray!70, dashed] (2.50,-0.1) -- (2.50,1.35);
\draw[gray!70, dashed] (3.75,-0.1) -- (3.75,1.35);
\draw[->] (0,0) -- (5.30,0) node[right] {$x$};
\draw (1.25,-0.08) -- (1.25,0.08);
\node[below] at (1.25,-0.1) {$-2$};
\draw (2.50,-0.08) -- (2.50,0.08);
\node[below] at (2.50,-0.1) {$2$};
\draw (3.75,-0.08) -- (3.75,0.08);
\node[below] at (3.75,-0.1) {$4$};
\node[left] at (0,1.10) {\small $x > 2$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt] (2.50,1.10) -- (5.00,1.10);
\draw[thick] (2.50,1.10) circle (2.2pt);
\node[left] at (0,0.55) {\small $-2 < x < 4$};
\draw[blue!50, line width=1.8pt, shorten <=2.6pt, shorten >=2.6pt] (1.25,0.55) -- (3.75,0.55);
\draw[thick] (1.25,0.55) circle (2.2pt);
\draw[thick] (3.75,0.55) circle (2.2pt);
\end{tikzpicture}
```

Quindi $S = \mathopen{]}2, 4\mathclose{[}$. Senza le C.E. avresti scritto $\mathopen{]}-2, 4\mathclose{[}$, che contiene numeri come $x = 1$, per cui $\log_2 (x - 2)$ non esiste.
```

```ad-example
Esempio 8: una differenza, senza frazioni
Risolvi $\log_3 (x + 5) - \log_3 (x - 1) > 1$.

C.E.: $x + 5 > 0$ e $x - 1 > 0$, cioè $x > 1$. Unendo i due logaritmi otterresti una disequazione fratta. Conviene portare a destra il logaritmo con il segno meno, così restano solo somme, e scrivere $1 = \log_3 3$:

$$
\begin{gathered}
\log_3 (x + 5) > \log_3 3 + \log_3 (x - 1) \\
\Rightarrow \log_3 (x + 5) > \log_3 \left[3(x - 1)\right]
\end{gathered}
$$

La base è maggiore di $1$:

$$
\begin{gathered}
x + 5 > 3x - 3 \\
\Rightarrow x < 4
\end{gathered}
$$

A sistema con $x > 1$: $S = \mathopen{]}1, 4\mathclose{[}$. Verifica con $x = 2$: $\log_3 7 - \log_3 1 = \log_3 7$, che è maggiore di $1$ perché $7 > 3$.
```

## Disequazioni che si risolvono con una sostituzione

Quando lo stesso logaritmo compare più volte si pone $t$ uguale a quel logaritmo, si risolve la disequazione in $t$ e poi si torna alla $x$ con una disequazione del tipo $\log_a x > c$ per ogni condizione trovata.

```ad-example
Esempio 9: secondo grado nel logaritmo
Risolvi $\log_2^2 x - \log_2 x - 2 > 0$.

C.E.: $x > 0$. Poni $t = \log_2 x$:

$$t^2 - t - 2 > 0$$

L'equazione associata ha $\Delta = 9$ e soluzioni $-1$ e $2$; la disequazione è vera per i valori esterni, $t < -1$ oppure $t > 2$. Torna alla $x$, con la base $2 > 1$:

$$\log_2 x < -1 \ \Rightarrow \ 0 < x < \frac{1}{2} \qquad \log_2 x > 2 \ \Rightarrow \ x > 4$$

Le due condizioni erano unite da "oppure", quindi le soluzioni si uniscono:

$$S = \left]0, \frac{1}{2}\right[ \,\cup\, \mathopen{]}4, +\infty\mathclose{[}$$
```

Quando il logaritmo è un fattore di un prodotto o di un quoziente, la disequazione si risolve con lo [studio del segno](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte), e il segno del logaritmo si legge dal grafico: con la base maggiore di $1$, $\log_a x$ è positivo per $x > 1$, nullo per $x = 1$ e negativo per $0 < x < 1$.

```ad-example
Esempio 10: un quoziente con un logaritmo
Risolvi $\dfrac{\log_2 x}{x - 3} \geq 0$.

C.E.: $x > 0$ per il logaritmo e $x \neq 3$ per il denominatore. Il numeratore $\log_2 x$ è positivo per $x > 1$ e vale zero per $x = 1$; il denominatore è positivo per $x > 3$. La tabella dei segni parte da $0$, dove comincia il dominio:

| $x$ | $\mathopen{]}0, 1\mathclose{[}$ | $1$ | $\mathopen{]}1, 3\mathclose{[}$ | $3$ | $\mathopen{]}3, +\infty\mathclose{[}$ |
|---|---|---|---|---|---|
| $\log_2 x$ | $-$ | $0$ | $+$ | $+$ | $+$ |
| $x - 3$ | $-$ | $-$ | $-$ | $0$ | $+$ |
| $\dfrac{\log_2 x}{x - 3}$ | $+$ | $0$ | $-$ | $\nexists$ | $+$ |

Il simbolo $\nexists$ dice che per $x = 3$ il quoziente non esiste.

Il quoziente è positivo o nullo per $0 < x \leq 1$ oppure $x > 3$:

$$S = \mathopen{]}0, 1] \,\cup\, \mathopen{]}3, +\infty\mathclose{[}$$
```

## Disequazioni esponenziali che si risolvono con i logaritmi

Nelle [disequazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-esponenziali) i due membri si scrivono come potenze della stessa base e si confrontano gli esponenti. Con $3^x > 7$ non si può, perché $7$ non è una potenza di $3$ che si riconosce a occhio; ma $7 = 3^{\log_3 7}$, e a questo punto le basi sono uguali. La regola del verso è quella della funzione esponenziale, la stessa dei logaritmi: per $b > 0$,

| Disequazione | Con $a > 1$ | Con $0 < a < 1$ |
|---|---|---|
| $a^{f(x)} > b$ | $f(x) > \log_a b$ | $f(x) < \log_a b$ |
| $a^{f(x)} < b$ | $f(x) < \log_a b$ | $f(x) > \log_a b$ |

Se $b$ è negativo o nullo non servono i logaritmi: una potenza con la base positiva è sempre positiva, quindi $a^{f(x)} > b$ è vera per ogni $x$ per cui $f(x)$ esiste, e $a^{f(x)} < b$ è impossibile.

```tikz
% nome: disequazione-esponenziale-con-logaritmo
% alt: Il grafico di y = 3 alla x e la retta orizzontale y = 7: la curva sta sopra la retta a destra del punto di incontro, che ha ascissa logaritmo in base 3 di 7, circa 1,77; le soluzioni sono segnate sull'asse x con una linea spessa che parte da quel valore, con il pallino vuoto
\begin{tikzpicture}[xscale=1.1, yscale=0.42]
\draw[gray!25, very thin] (-2.5,-0.5) grid (3.5,10.5);
\draw[->] (-2.8,0) -- (4,0) node[right] {$x$};
\draw[->] (0,-0.8) -- (0,11.3) node[above] {$y$};
\foreach \x in {-2,-1,1,3} \node[below] at (\x,0) {\small $\x$};
\node[above left] at (0,7) {\small $7$};
\node[above left] at (0,1) {\small $1$};
\draw[orange!80, thick] (-2.5,7) -- (3.5,7);
\draw[thick, blue!60, domain=-2.5:2.14, samples=80, smooth] plot (\x, {pow(3,\x)});
\draw[dashed, gray] (1.771,7) -- (1.771,0);
\draw[blue!50, line width=2pt] (1.771,0) -- (3.5,0);
\fill (1.771,7) ellipse (0.065 and 0.17);
\draw[thick, fill=gray!20] (1.771,0) ellipse (0.075 and 0.196);
\node[below] at (1.9,-0.9) {\small $\log_3 7$};
\node[blue!60!black, left] at (1.95,9.6) {$y = 3^x$};
\end{tikzpicture}
```
```grafico
% nome: disequazione-esponenziale-cursori
% alt: Il grafico di y = a alla x e la retta y = b, con i cursori di a e di b: è colorata la parte di piano dove a alla x è maggiore di b, oppure quella dove è minore; con b negativo la prima è tutto il piano e la seconda sparisce
curva: y=a^x
curva: y=b | arancione
scelta: > b :: a^x>b | blu
scelta: < b :: a^x<b | rosso
cursore: a = 3 da 0,2 a 4 passo 0,1
cursore: b = 7 da -3 a 9 passo 0,1
finestra: x da -6 a 6, y da -3 a 9
valore: \log_a b = \frac{\ln\left(b\right)}{\ln\left(a\right)}
domanda: Porta $b$ sotto zero: per quali $x$ vale ancora $a^x > b$? E $a^x < b$? Poi riporta $b$ a $7$ e porta $a$ sotto $1$: da che parte passano le soluzioni di $a^x > 7$?
```

Con $b$ negativo la curva sta tutta sopra la retta: $a^x > b$ vale per ogni $x$, $a^x < b$ per nessuno, e il logaritmo di $b$ non esiste. Con $b = 7$ e $a$ sotto $1$ la curva scende, e le soluzioni di $a^x > 7$ passano a sinistra del punto di incontro: $x < \log_a 7$. Per $a = 1$ la curva è la retta $y = 1$, e la disequazione $1 > 7$ è falsa per ogni $x$.

```ad-example
Esempio 11: base maggiore di 1 e base minore di 1
Risolvi $3^x > 7$ e $\left(\dfrac{1}{2}\right)^x < 5$.

Nella prima la base è $3 > 1$ e il verso si conserva: $x > \log_3 7$. Quindi $S = \mathopen{]}\log_3 7, +\infty\mathclose{[}$, con $\log_3 7 \approx 1{,}77$.

Nella seconda la base è $\dfrac{1}{2} < 1$ e il verso si rovescia: $x > \log_{\frac{1}{2}} 5$. Poiché $\log_{\frac{1}{2}} 5 = -\log_2 5 \approx -2{,}32$, le soluzioni sono $x > -\log_2 5$, cioè $S = \mathopen{]}-\log_2 5, +\infty\mathclose{[}$. Verifica con $x = 0$: $\left(\dfrac{1}{2}\right)^0 = 1 < 5$, vero.
```

Se l'incognita è all'esponente in tutti e due i membri, con basi diverse, si calcola il logaritmo dei due membri. Scegliendo una base maggiore di $1$, come $10$ o $e$, il verso si conserva; poi si risolve una disequazione di primo grado, in cui i logaritmi sono numeri.

```ad-example
Esempio 12: basi diverse nei due membri
Risolvi $2^{x + 1} \geq 3^x$.

I due membri sono positivi. Calcola il logaritmo decimale, che conserva il verso:

$$
\begin{gathered}
(x + 1)\log 2 \geq x\log 3 \\
\Rightarrow x\log 2 - x\log 3 \geq -\log 2 \\
\Rightarrow x(\log 2 - \log 3) \geq -\log 2
\end{gathered}
$$

Il coefficiente $\log 2 - \log 3$ è negativo, perché $\log 2 < \log 3$: dividendo, il verso cambia.

$$x \leq \frac{-\log 2}{\log 2 - \log 3} = \frac{\log 2}{\log 3 - \log 2}$$

Quindi $S = \left]-\infty, \dfrac{\log 2}{\log 3 - \log 2}\right]$, e con la calcolatrice l'estremo vale circa $1{,}71$. Verifica con $x = 1$: $2^2 = 4 \geq 3$, vero; con $x = 2$: $2^3 = 8 \geq 9$, falso.
```

```ad-warning
Dividere per un logaritmo negativo
Un logaritmo decimale o naturale è negativo quando l'argomento è minore di $1$: $\log 0{,}5 \approx -0{,}301$. Se in una disequazione dividi i due membri per $\log 0{,}5$, o per una differenza come $\log 2 - \log 3$, il verso cambia, come con ogni numero negativo. Prima di dividere controlla il segno.
```

```ad-example
Esempio 13: dopo una sostituzione
Risolvi $4^x - 5 \cdot 2^x + 6 < 0$.

Poni $t = 2^x$, con $t > 0$: $t^2 - 5t + 6 < 0$. L'equazione associata ha soluzioni $2$ e $3$, e la disequazione è vera per i valori interni, $2 < t < 3$. Torna alla $x$:

$$2 < 2^x < 3$$

La base è maggiore di $1$: da $2^x > 2$ segue $x > 1$, da $2^x < 3$ segue $x < \log_2 3$. Quindi $S = \mathopen{]}1, \log_2 3\mathclose{[}$, con $\log_2 3 \approx 1{,}58$.
```

```ad-example
Esempio 14: quando il capitale supera il doppio
Un capitale depositato al $3\%$ annuo si moltiplica per $1{,}03$ ogni anno. Dopo quanti anni interi supera il doppio del valore iniziale?

Deve essere $1{,}03^t > 2$. La base è maggiore di $1$:

$$t > \log_{1{,}03} 2 = \frac{\log 2}{\log 1{,}03} \approx 23{,}4$$

Il primo numero intero che va bene è $24$: dopo $23$ anni il capitale non è ancora raddoppiato, dopo $24$ sì.
```
