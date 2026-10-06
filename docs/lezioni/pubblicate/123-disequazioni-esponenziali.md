# Disequazioni esponenziali

Una coltura di batteri raddoppia ogni ora: da quando in poi è più di $32$ volte quella iniziale? La domanda si scrive $2^x > 32$, e la risposta è $x > 5$: dopo la quinta ora. Per passare da una disequazione tra potenze a una disequazione tra esponenti serve sapere se la funzione esponenziale cresce o decresce, e quindi se la base è maggiore o minore di $1$.

Per seguire la lezione ti servono la [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale), i metodi delle [equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali) e le [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado). Le soluzioni si scrivono con gli intervalli, con le parentesi quadre rivolte verso l'esterno per gli estremi esclusi.

## Che cos'è una disequazione esponenziale

Una disequazione è **esponenziale** quando l'incognita compare nell'esponente di almeno una potenza, come in

$$
\begin{gathered}
2^x > 32 \\
\left(\frac{1}{3}\right)^{x + 1} < \frac{1}{27} \\
4^x - 6 \cdot 2^x + 8 < 0
\end{gathered}
$$

I metodi sono quelli delle equazioni esponenziali: stessa base, raccoglimento, sostituzione. Cambia l'ultimo passaggio, quello in cui dalle potenze si passa agli esponenti.

## Dalle potenze agli esponenti

Con la base maggiore di $1$ la funzione $y = a^x$ è crescente: all'esponente più grande corrisponde la potenza più grande. Per questo la disequazione tra le potenze e quella tra gli esponenti hanno lo stesso verso:

$$a > 1: \quad a^{f(x)} > a^{g(x)} \iff f(x) > g(x)$$

Con la base tra $0$ e $1$ la funzione è decrescente: all'esponente più grande corrisponde la potenza più piccola. Passando agli esponenti il verso si inverte:

$$0 < a < 1: \quad a^{f(x)} > a^{g(x)} \iff f(x) < g(x)$$

Lo stesso vale per gli altri versi: con $a > 1$ da $\geq$ si passa a $\geq$ e da $<$ a $<$, con $0 < a < 1$ da $\geq$ si passa a $\leq$ e da $<$ a $>$.

```tikz
% nome: disequazioni-esponenziali-verso
% alt: A sinistra il grafico di y = 2 alla x, crescente: la curva sta sopra la retta y = 4 per x maggiore di 2. A destra il grafico di y = un mezzo alla x, decrescente: la curva sta sopra la retta y = 4 per x minore di -2
% svg: disequazioni-esponenziali-verso-f0d2982a.svg 261x183
\begin{tikzpicture}[scale=0.45]
\begin{scope}
\draw[->] (-2.8,0) -- (3.5,0) node[right] {\small $x$};
\draw[->] (0,-1.2) -- (0,7.6);
\draw[gray] (-2.6,4) -- (3.1,4);
\node[left] at (0,4.5) {\small $4$};
\draw[thick, blue!60, domain=-2.6:2.85, samples=50, smooth] plot (\x, {exp(0.693147*\x)});
\draw[dashed, gray] (2,4) -- (2,0);
\draw[blue!45, line width=2pt] (2.17,0) -- (3.1,0);
\draw[thick] (2,0) circle (0.15);
\fill (2,4) circle (0.14);
\node[below] at (2,-0.1) {\small $2$};
\node[blue!60!black] at (-1.3,6.9) {\small $y = 2^x$};
\node at (0.5,-2.2) {\small $2^x > 4$ per $x > 2$};
\end{scope}
\begin{scope}[shift={(8.4,0)}]
\draw[->] (-3.4,0) -- (3.0,0) node[right] {\small $x$};
\draw[->] (0,-1.2) -- (0,7.6);
\draw[gray] (-3.1,4) -- (2.6,4);
\node[right] at (0,4.5) {\small $4$};
\draw[thick, orange!70, domain=-2.85:2.6, samples=50, smooth] plot (\x, {exp(-0.693147*\x)});
\draw[dashed, gray] (-2,4) -- (-2,0);
\draw[blue!45, line width=2pt] (-3.1,0) -- (-2.17,0);
\draw[thick] (-2,0) circle (0.15);
\fill (-2,4) circle (0.14);
\node[below] at (-2,-0.1) {\small $-2$};
\node[orange!70!black] at (1.7,6.9) {\small $y = \left(\frac{1}{2}\right)^x$};
\node at (-0.5,-2.2) {\small $\left(\frac{1}{2}\right)^x > 4$ per $x < -2$};
\end{scope}
\end{tikzpicture}
```
```grafico
% nome: disequazione-esponenziale-verso-cursori
% alt: Il grafico di y = a alla x e la retta y = b, con i cursori di a e di b: è colorata la parte di piano dove a alla x è maggiore di b, oppure quella dove è minore, e passa da destra a sinistra quando la base scende sotto 1
curva: y=a^x
curva: y=b | grigio
scelta: a^x > b :: a^x>b | blu
scelta: a^x < b :: a^x<b | rosso
cursore: a = 2 da 0,2 a 4 passo 0,1
cursore: b = 4 da -3 a 8 passo 0,5
finestra: x da -6 a 6, y da -3 a 9
valore: \text{estremo} = \frac{\ln b}{\ln a}
domanda: Con $a = 2$ e $b = 4$ è colorata la parte $x > 2$. Porta $a$ a $0{,}5$ passando per $1$: da che parte va la zona colorata? Poi porta $b$ sotto zero.
```

Con $a = 0{,}5$ la zona colorata di $a^x > 4$ passa a sinistra, $x < -2$: la curva ora scende, e sta sopra la retta prima dell'incontro, non dopo. Nel passaggio per $a = 1$, che non è una base ammessa, la curva è la retta $y = 1$ e l'estremo non esiste: $1 > 4$ è falsa per ogni $x$. Portando $b$ sotto zero la retta scende sotto la curva, che è tutta sopra l'asse $x$: $a^x > b$ diventa vera per ogni $x$ e $a^x < b$ per nessuno, qualunque sia la base.

```ad-example
Esempio 1: la stessa disequazione con due basi
Risolvi $2^x > 8$ e $\left(\dfrac{1}{2}\right)^x > 8$.

Nella prima $8 = 2^3$ e la base $2$ è maggiore di $1$: il verso resta.

$$2^x > 2^3 \iff x > 3$$

Nella seconda $8 = \left(\dfrac{1}{2}\right)^{-3}$ e la base $\dfrac{1}{2}$ è minore di $1$: il verso si inverte.

$$\left(\frac{1}{2}\right)^x > \left(\frac{1}{2}\right)^{-3} \iff x < -3$$

Verifica della seconda con $x = -4$, che è minore di $-3$: $\left(\dfrac{1}{2}\right)^{-4} = 16 > 8$, vero. Con $x = 0$, che non lo è: $1 > 8$, falso. Le soluzioni sono $S = \,\mathopen{]}3, +\infty\mathclose{[}$ per la prima e $S = \,\mathopen{]}-\infty, -3\mathclose{[}$ per la seconda.
```

```ad-warning
Con la base minore di 1 il verso si inverte
Da $\left(\dfrac{1}{2}\right)^x > \left(\dfrac{1}{2}\right)^{-3}$ non segue $x > -3$. Prova con $x = 0$: $\left(\dfrac{1}{2}\right)^0 = 1$, che non è maggiore di $8$. Prima di passare agli esponenti guarda sempre la base.
```

```ad-tip
Per non pensare al verso, porta la base sopra 1
Una base tra $0$ e $1$ si può sempre riscrivere con l'esponente opposto: $\left(\dfrac{1}{2}\right)^x = 2^{-x}$. La seconda disequazione dell'esempio 1 diventa $2^{-x} > 2^3$, e con la base $2$ il verso resta: $-x > 3$. Dividendo per $-1$ il verso cambia, come in ogni [disequazione di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli): $x < -3$, lo stesso risultato.
```

```ad-warning
Il verso dipende dalla base, non dal segno dell'esponente
In $2^{-x} > 2^3$ la base è $2$, maggiore di $1$: passando agli esponenti il verso resta, $-x > 3$. Il verso cambia nel passaggio dopo, quando dividi per $-1$. Sono due regole diverse: quella dell'esponenziale guarda la base, quella delle disequazioni di primo grado guarda il segno del numero per cui dividi.
```

## Le disequazioni elementari

Nella disequazione elementare $a^x > b$, o con un altro verso, il primo passo è guardare il segno di $b$. Una potenza con la base positiva è sempre positiva: è maggiore di qualunque numero negativo e dello zero, e non è mai minore di loro.

| | $b > 0$ | $b \leq 0$ |
|---|---|---|
| $a^x > b$, $a^x \geq b$ | si scrive $b$ come potenza di $a$ | sempre vera, $S = \mathbb{R}$ |
| $a^x < b$, $a^x \leq b$ | si scrive $b$ come potenza di $a$ | impossibile, $S = \emptyset$ |

```ad-example
Esempio 2: secondo membro negativo o nullo
Risolvi $3^x > -9$, $5^x \leq 0$ e $2^x \geq 0$.

- $3^x$ è positivo per ogni $x$, quindi è sempre maggiore di $-9$: $S = \mathbb{R}$.
- $5^x$ non è mai negativo né nullo: $S = \emptyset$.
- $2^x$ è sempre positivo, quindi è sempre maggiore o uguale a zero: $S = \mathbb{R}$.
```

```ad-warning
Non cercare un esponente per un numero negativo
In $3^x > -9$ non si scrive $-9$ come potenza di $3$, perché non lo è, e non si risponde $x > -2$: la disequazione è vera per ogni $x$, anche per $x = -5$, dato che $3^{-5} = \dfrac{1}{243}$ è positivo.
```

## Disequazioni con la stessa base

Il procedimento ricalca quello delle equazioni.

1. Scrivi tutte le basi come potenze dello stesso numero e riduci ogni membro a una sola potenza.
2. Guarda la base: se è maggiore di $1$ il verso resta, se è tra $0$ e $1$ si inverte.
3. Scrivi la disequazione tra gli esponenti con il verso giusto.
4. Risolvila e scrivi $S$.

```ad-example
Esempio 3: base maggiore di 1
$$3^{2x - 1} \leq 27$$

Dato che $27 = 3^3$ e la base $3$ è maggiore di $1$, il verso resta:

$$
\begin{gathered}
3^{2x - 1} \leq 3^3 \\
\Rightarrow 2x - 1 \leq 3 \\
\Rightarrow x \leq 2
\end{gathered}
$$

Quindi $S = \,\mathopen{]}-\infty, 2]$. Verifica con $x = 0$: $3^{-1} = \dfrac{1}{3} \leq 27$, vero.
```

```ad-example
Esempio 4: base tra 0 e 1
$$\left(\frac{1}{3}\right)^{x + 1} < \frac{1}{27}$$

Dato che $\dfrac{1}{27} = \left(\dfrac{1}{3}\right)^3$ e la base $\dfrac{1}{3}$ è minore di $1$, il verso si inverte:

$$
\begin{gathered}
\left(\frac{1}{3}\right)^{x + 1} < \left(\frac{1}{3}\right)^3 \\
\Rightarrow x + 1 > 3 \\
\Rightarrow x > 2
\end{gathered}
$$

Quindi $S = \,\mathopen{]}2, +\infty\mathclose{[}$. Verifica con $x = 3$: $\left(\dfrac{1}{3}\right)^4 = \dfrac{1}{81} < \dfrac{1}{27}$, vero.
```

```ad-example
Esempio 5: basi diverse, potenze dello stesso numero
Risolvi $4^x < 8$ e $\left(\dfrac{1}{4}\right)^x \geq 8$.

Tutte le basi sono potenze di $2$. Nella prima $4^x = 2^{2x}$ e $8 = 2^3$:

$$
\begin{gathered}
2^{2x} < 2^3 \\
\Rightarrow 2x < 3 \\
\Rightarrow x < \frac{3}{2}
\end{gathered}
$$

Nella seconda $\dfrac{1}{4} = 2^{-2}$, quindi $\left(\dfrac{1}{4}\right)^x = 2^{-2x}$. La base ora è $2$, e il verso resta:

$$
\begin{gathered}
2^{-2x} \geq 2^3 \\
\Rightarrow -2x \geq 3 \\
\Rightarrow x \leq -\frac{3}{2}
\end{gathered}
$$

Nell'ultimo passaggio il verso è cambiato perché hai diviso per $-2$. Le soluzioni sono $S = \,\mathopen{]}-\infty, \frac{3}{2}\mathclose{[}$ per la prima e $S = \,\mathopen{]}-\infty, -\frac{3}{2}]$ per la seconda.
```

```ad-example
Esempio 6: l'esponente è di secondo grado
Risolvi $2^{x^2 - 3x} < \dfrac{1}{4}$ e $\left(\dfrac{1}{3}\right)^{x^2 - 1} \leq \dfrac{1}{27}$.

Nella prima $\dfrac{1}{4} = 2^{-2}$ e la base è maggiore di $1$:

$$
\begin{gathered}
x^2 - 3x < -2 \\
\Rightarrow x^2 - 3x + 2 < 0
\end{gathered}
$$

L'equazione associata ha le soluzioni $1$ e $2$, e il verso $<$ vuole i valori interni: $1 < x < 2$, cioè $S = \,\mathopen{]}1, 2\mathclose{[}$.

Nella seconda $\dfrac{1}{27} = \left(\dfrac{1}{3}\right)^3$ e la base è minore di $1$: il verso si inverte.

$$
\begin{gathered}
x^2 - 1 \geq 3 \\
\Rightarrow x^2 - 4 \geq 0
\end{gathered}
$$

L'equazione associata ha le soluzioni $-2$ e $2$, e il verso $\geq$ vuole i valori esterni, estremi compresi: $x \leq -2$ oppure $x \geq 2$.

$$S = \,\mathopen{]}-\infty, -2] \cup [2, +\infty\mathclose{[}$$

Verifica della seconda con $x = 0$, che non è una soluzione: $\left(\dfrac{1}{3}\right)^{-1} = 3$, che non è minore o uguale a $\dfrac{1}{27}$.
```

## Somme di potenze: il raccoglimento

Come nelle equazioni, da una somma di potenze della stessa base si raccoglie la potenza comune. Dopo il raccoglimento si divide per il numero che la moltiplica, e lì vale la regola solita: se quel numero è negativo, il verso cambia.

```ad-example
Esempio 7: raccoglimento con un fattore negativo
Risolvi $2^{x + 2} + 2^x > 40$ e $3^x - 3^{x + 2} > -72$.

Nella prima $2^{x + 2} = 4 \cdot 2^x$:

$$
\begin{gathered}
2^x (4 + 1) > 40 \\
\Rightarrow 2^x > 8 \\
\Rightarrow x > 3
\end{gathered}
$$

Nella seconda $3^{x + 2} = 9 \cdot 3^x$, e il fattore che resta dopo il raccoglimento è negativo:

$$
\begin{gathered}
3^x (1 - 9) > -72 \\
\Rightarrow -8 \cdot 3^x > -72 \\
\Rightarrow 3^x < 9 \\
\Rightarrow x < 2
\end{gathered}
$$

Dividendo per $-8$ il verso è cambiato; nel passaggio agli esponenti no, perché la base $3$ è maggiore di $1$. Verifica con $x = 0$: $1 - 9 = -8 > -72$, vero.
```

## Disequazioni che diventano di secondo grado: la sostituzione

Quando compaiono $a^{2x}$ e $a^x$, oppure $a^x$ e $a^{-x}$, si pone $t = a^x$, come nelle equazioni.

1. Poni $t = a^x$ e risolvi la disequazione in $t$ come una [disequazione di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado).
2. Riscrivi ogni condizione su $t$ come condizione su $a^x$: ognuna è una disequazione elementare.
3. Risolvi le disequazioni elementari, ricordando che $a^x$ è sempre positivo.
4. Metti insieme i risultati: una condizione doppia come $2 < t < 4$ chiede che valgano tutte e due le disequazioni, una condizione con "oppure" chiede l'unione.

```ad-example
Esempio 8: valori interni
$$4^x - 6 \cdot 2^x + 8 < 0$$

Con $t = 2^x$ la disequazione diventa $t^2 - 6t + 8 < 0$. L'equazione associata ha le soluzioni $2$ e $4$, e il verso $<$ vuole i valori interni:

$$2 < t < 4$$

Torna a $x$: $2 < 2^x < 4$, cioè $2^1 < 2^x < 2^2$. La base è maggiore di $1$ e i versi restano:

$$1 < x < 2$$

Quindi $S = \,\mathopen{]}1, 2\mathclose{[}$. Verifica con $x = \dfrac{3}{2}$: $4^{\frac{3}{2}} = 8$ e $2^{\frac{3}{2}} = 2\sqrt{2}$, quindi il primo membro vale $16 - 12\sqrt{2} \approx -0{,}97$, negativo.

```tikz
% nome: disequazione-esponenziale-sostituzione
% alt: Il grafico di y = 2 alla x con le rette y = 2 e y = 4: la curva sta tra le due rette per x compreso tra 1 e 2, l'intervallo colorato sull'asse x
% svg: disequazione-esponenziale-sostituzione-1e8be3db.svg 168x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-3,-1) grid (4,7);
\draw[->] (-3.3,0) -- (4.5,0) node[right] {$x$};
\draw[->] (0,-1.3) -- (0,7.6) node[above] {$t$};
\foreach \x in {-2,-1,1,2,3} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {2,4} \node[left] at (0,\y) {\small $\y$};
\draw[gray] (-3,2) -- (4,2);
\draw[gray] (-3,4) -- (4,4);
\draw[thick, blue!60, domain=-3:2.75, samples=50, smooth] plot (\x, {exp(0.693147*\x)});
\draw[dashed, gray] (1,2) -- (1,0);
\draw[dashed, gray] (2,4) -- (2,0);
\draw[blue!45, line width=2pt] (1.15,0) -- (1.85,0);
\draw[thick] (1,0) circle (0.14);
\draw[thick] (2,0) circle (0.14);
\fill (1,2) circle (0.13);
\fill (2,4) circle (0.13);
\node[blue!60!black, right] at (2.75,6.6) {$t = 2^x$};
\end{tikzpicture}
```
```grafico
% nome: disequazione-esponenziale-sostituzione-cursori
% alt: Il grafico di y = 2 alla x con le due rette orizzontali y = p e y = q, e la parte di piano dove 2 alla x sta tra p e q, oppure fuori: quando p scende sotto zero la zona dei valori interni non ha più un estremo sinistro
curva: y=2^x
curva: y=p | grigio
curva: y=q | grigio
scelta: p < 2^x < q :: \left(2^x-p\right)\left(2^x-q\right)<0 | blu
scelta: 2^x < p \text{ o } 2^x > q :: \left(2^x-p\right)\left(2^x-q\right)>0 | rosso
cursore: p = 2 da -3 a 3,5 passo 0,5
cursore: q = 4 da 4 a 8 passo 0,5
finestra: x da -6 a 6, y da -3 a 9
domanda: Abbassa $p$ da $2$ fino a $0$ e sotto: la zona $p < 2^x < q$ ha ancora un estremo sinistro? E che cosa resta della zona esterna?
```

Finché $p$ è positivo la curva sta tra le due rette in un intervallo limitato, come $1 < x < 2$ nella figura. Quando $p$ arriva a $0$ o scende sotto, la condizione $2^x > p$ è vera per ogni $x$: della zona interna resta solo $2^x < q$, una semiretta senza estremo sinistro. Della zona esterna sparisce il pezzo $2^x < p$, che diventa impossibile, e resta solo $2^x > q$. È quello che succede nell'esempio 10.
```

```ad-example
Esempio 9: valori esterni
$$4^x - 3 \cdot 2^x + 2 > 0$$

Con $t = 2^x$: $t^2 - 3t + 2 > 0$. L'equazione associata ha le soluzioni $1$ e $2$, e il verso $>$ vuole i valori esterni:

$$t < 1 \quad \text{oppure} \quad t > 2$$

Torna a $x$, una condizione alla volta:

$$
\begin{gathered}
2^x < 1 \ \Rightarrow \ 2^x < 2^0 \ \Rightarrow \ x < 0 \\
2^x > 2 \ \Rightarrow \ 2^x > 2^1 \ \Rightarrow \ x > 1
\end{gathered}
$$

Le soluzioni sono l'unione dei due intervalli:

$$S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$$
```

```ad-example
Esempio 10: una condizione impossibile e una sempre vera
Risolvi $9^x - 8 \cdot 3^x - 9 \geq 0$ e $9^x - 8 \cdot 3^x - 9 < 0$.

Con $t = 3^x$ il primo membro è $t^2 - 8t - 9$, che si annulla per $t = -1$ e per $t = 9$.

Nella prima il verso $\geq$ vuole i valori esterni: $t \leq -1$ oppure $t \geq 9$. La condizione $3^x \leq -1$ è impossibile; resta

$$3^x \geq 9 \ \Rightarrow \ 3^x \geq 3^2 \ \Rightarrow \ x \geq 2$$

Quindi $S = [2, +\infty\mathclose{[}$.

Nella seconda il verso $<$ vuole i valori interni: $-1 < t < 9$. Devono valere tutte e due le condizioni $3^x > -1$ e $3^x < 9$. La prima è vera per ogni $x$; la seconda dà $x < 2$. Quindi $S = \,\mathopen{]}-\infty, 2\mathclose{[}$.
```

```ad-warning
Rispondere con i valori di t
Nell'esempio 8 la risposta non è $2 < x < 4$: quelli sono i valori di $t$. Bisogna tornare a $2^x$ e risolvere $2 < 2^x < 4$, che dà $1 < x < 2$.
```

```ad-warning
Una condizione su t negativa non si butta sempre via
Nell'esempio 10 la condizione $3^x \leq -1$ è impossibile e si scarta, mentre la condizione $3^x > -1$ è vera per ogni $x$. Se scarti anche questa perché "c'è un numero negativo", concludi che la seconda disequazione non ha soluzioni, e invece le sue soluzioni sono $x < 2$. Guarda il verso prima di decidere.
```

## Prodotti e quozienti

Una disequazione fratta, o un prodotto confrontato con zero, si risolve studiando il segno di ogni fattore e mettendo i segni in tabella, come nella lezione [Studio del segno e disequazioni fratte](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/studio-del-segno-e-disequazioni-fratte). Il segno di un fattore esponenziale si trova con una disequazione elementare.

```ad-example
Esempio 11: una disequazione fratta
$$\frac{2^x - 4}{3^x - 1} \geq 0$$

Numeratore: $2^x - 4 \geq 0$ quando $2^x \geq 2^2$, cioè per $x \geq 2$. Si annulla in $x = 2$.

Denominatore: $3^x - 1 > 0$ quando $3^x > 3^0$, cioè per $x > 0$. Si annulla in $x = 0$, dove la frazione non esiste.

```tikz
% nome: disequazione-esponenziale-fratta-segni
% alt: Tabella dei segni di 2 alla x meno 4, negativo prima di 2 e positivo dopo, e di 3 alla x meno 1, negativo prima di 0 e positivo dopo: la frazione è positiva prima di 0, negativa tra 0 e 2, positiva dopo 2; sotto, le soluzioni, a sinistra di 0 escluso e a destra di 2 compreso
% svg: disequazione-esponenziale-fratta-segni-bfa265b8.svg 258x114
\begin{tikzpicture}
\node at (1.60,0) {$0$};
\node at (3.20,0) {$2$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$2^x - 4$};
\draw[thick, dashed] (0.00,-0.62) -- (1.60,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick, dashed] (1.60,-0.62) -- (3.03,-0.62);
\node[above] at (2.40,-0.67) {\small $-$};
\draw[thick] (3.37,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (3.20,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$3^x - 1$};
\draw[thick, dashed] (0.00,-1.24) -- (1.43,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick] (1.77,-1.24) -- (3.20,-1.24);
\node[above] at (2.40,-1.29) {\small $+$};
\draw[thick] (3.20,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (1.60,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small frazione};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\draw[thick] (1.60,-1.86) circle (2.5pt);
\node at (3.20,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (0.00,-2.48) -- (1.50,-2.48);
\draw[blue!45, line width=2pt] (3.20,-2.48) -- (4.80,-2.48);
\draw[thick] (1.60,-2.48) circle (2.5pt);
\fill (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

La frazione è positiva prima di $0$ e dopo $2$, e vale zero in $2$. Il verso è $\geq$: il $2$ è compreso, lo $0$ è escluso perché lì il denominatore si annulla.

$$S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup [2, +\infty\mathclose{[}$$
```

## Basi diverse con lo stesso esponente

Quando i due membri sono potenze con basi diverse e lo stesso esponente, dividi per una delle due. Una potenza con la base positiva è sempre positiva, quindi dividendo il verso non cambia.

```ad-example
Esempio 12: dividere per una potenza
$$2^x > 3^x$$

Dividi tutti e due i membri per $3^x$, che è positivo:

$$
\begin{gathered}
\frac{2^x}{3^x} > 1 \\
\Rightarrow \left(\frac{2}{3}\right)^x > \left(\frac{2}{3}\right)^0
\end{gathered}
$$

La base $\dfrac{2}{3}$ è minore di $1$, e il verso si inverte: $x < 0$. Quindi $S = \,\mathopen{]}-\infty, 0\mathclose{[}$. Verifica con $x = -1$: $\dfrac{1}{2} > \dfrac{1}{3}$, vero. Lo dice anche il grafico della lezione sulla funzione esponenziale: a sinistra dell'asse $y$ la curva di $y = 2^x$ sta sopra quella di $y = 3^x$.
```

## Quando serve un logaritmo

Se il secondo membro non è una potenza della base, come in $2^x > 5$, il ragionamento non cambia: la base è maggiore di $1$, quindi le soluzioni sono i numeri maggiori di quello per cui $2^x = 5$, che sta tra $2$ e $3$. Per scrivere quel numero serve il logaritmo, che trovi nella lezione [Logaritmi e loro proprietà](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta). Lo stesso succede quando una sostituzione porta a una condizione come $2^x < 3$, per esempio in $4^x - 5 \cdot 2^x + 6 < 0$. Queste disequazioni sono risolte nella lezione [Disequazioni logaritmiche](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/disequazioni-logaritmiche), nella sezione sulle disequazioni esponenziali che si risolvono con i logaritmi.

## Il verso in ogni passaggio

| Passaggio | Il verso |
|---|---|
| dalle potenze agli esponenti, base maggiore di $1$ | resta |
| dalle potenze agli esponenti, base tra $0$ e $1$ | si inverte |
| moltiplicare o dividere per una potenza $a^x$ | resta, perché $a^x > 0$ |
| moltiplicare o dividere per un numero negativo | si inverte |
