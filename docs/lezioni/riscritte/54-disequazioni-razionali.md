# Studio del segno e disequazioni fratte

La disequazione $(x - 2)(x + 3) > 0$ chiede per quali valori di $x$ il prodotto di due fattori è positivo. Svolgere il prodotto non aiuta, perché si arriva a $x^2 + x - 6 > 0$, che non è di primo grado. Conviene invece lasciare i fattori come sono e studiare il segno di ciascuno: il segno del prodotto viene dalla regola dei segni. Con lo stesso metodo si risolvono le disequazioni fratte, come $\dfrac{x - 1}{x + 2} \geq 0$, in cui l'incognita sta al denominatore.

Ogni fattore si studia con una [disequazione di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli), e le soluzioni si scrivono con gli intervalli di quella lezione. In questa lezione tutti i fattori sono di primo grado.

## Il segno di un prodotto e di un quoziente

Il segno di un prodotto dipende solo dai segni dei fattori, con la regola dei segni delle [operazioni tra numeri interi](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z): un prodotto di fattori diversi da zero è positivo se i fattori negativi sono in numero pari, negativo se sono in numero dispari. Per esempio $(-2) \cdot 3 \cdot (-5) = 30$ è positivo, con due fattori negativi, mentre $(-2) \cdot 3 \cdot 5 = -30$ è negativo, con uno solo.

Se uno dei fattori vale zero, il prodotto vale zero, qualunque sia il segno degli altri: è la [legge di annullamento del prodotto](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza).

Un quoziente segue la stessa regola dei segni del prodotto: $\dfrac{-6}{-3} = 2$ è positivo, $\dfrac{6}{-3} = -2$ è negativo. La differenza è lo zero: un quoziente vale zero quando il numeratore vale zero, e non esiste quando il denominatore vale zero.

## Il segno di un fattore di primo grado

Un fattore di primo grado $ax + b$ vale zero in un solo punto, e da una parte di quel punto è positivo, dall'altra negativo. Per sapere da che parte è positivo si risolve la disequazione $ax + b > 0$.

Il fattore $x - 2$ si annulla per $x = 2$, e $x - 2 > 0$ dà $x > 2$: è negativo prima di $2$ e positivo dopo. Lo stesso vale per ogni fattore con il coefficiente di $x$ positivo, come $x + 3$ o $2x + 1$: negativo a sinistra del suo zero, positivo a destra.

Con il coefficiente di $x$ negativo succede il contrario. Il fattore $3 - x$ si annulla per $x = 3$, e

$$
\begin{gathered}
3 - x > 0 \\
\Rightarrow -x > -3 \\
\Rightarrow x < 3
\end{gathered}
$$

perché dividendo per $-1$ il verso si cambia. Quindi $3 - x$ è positivo a sinistra di $3$ e negativo a destra: per $x = 0$ vale $3$, per $x = 5$ vale $-2$.

```ad-warning
Dimenticare di cambiare il verso
Da $3 - x > 0$ si arriva a $-x > -3$, e chi divide per $-1$ senza cambiare il verso scrive $x > -3$. Controlla con un numero: per $x = 0$ il fattore vale $3$, positivo, e infatti $0 < 3$.
```

## La tabella dei segni

Per studiare il segno di un prodotto di fattori di primo grado si usa la **tabella dei segni**, detta anche grafico dei segni. In alto si scrivono, in ordine crescente, i valori in cui si annullano i fattori; sotto, una riga per ogni fattore, con una linea continua dove il fattore è positivo, una linea tratteggiata dove è negativo e lo $0$ nel punto in cui si annulla. Nell'ultima riga, intervallo per intervallo, si scrive il segno del prodotto con la regola dei segni.

Per $(x - 2)(x + 3)$ i fattori si annullano in $-3$ e in $2$. Il fattore $x + 3$ è positivo per $x > -3$ e $x - 2$ per $x > 2$:

```tikz
% nome: tabella-segni-prodotto
% alt: Tabella dei segni di x meno 2 per x più 3: le linee continue indicano dove i fattori sono positivi, le tratteggiate dove sono negativi; il prodotto è positivo prima di meno 3 e dopo 2, negativo in mezzo
% svg: tabella-segni-prodotto-0f8c13b2.svg 262x92
\begin{tikzpicture}
\node at (1.60,0) {$-3$};
\node at (3.20,0) {$2$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\node[left] at (-0.1,-0.62) {$x+3$};
\draw[thick, dashed] (0.00,-0.62) -- (1.43,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick] (1.77,-0.62) -- (3.20,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick] (3.20,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (1.60,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-2$};
\draw[thick, dashed] (0.00,-1.24) -- (1.60,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick, dashed] (1.60,-1.24) -- (3.03,-1.24);
\node[above] at (2.40,-1.29) {\small $-$};
\draw[thick] (3.37,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (3.20,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\node at (1.60,-1.86) {\small $0$};
\node at (3.20,-1.86) {\small $0$};
\end{tikzpicture}
```

La tabella si legge per colonne. Prima di $-3$ tutti e due i fattori sono negativi, e il prodotto è positivo; tra $-3$ e $2$ c'è un fattore negativo solo, e il prodotto è negativo; dopo $2$ tutti e due sono positivi. Nei punti $-3$ e $2$ il prodotto vale zero. Quindi $(x - 2)(x + 3)$ è:

- positivo per $x < -3$ oppure $x > 2$;
- nullo per $x = -3$ e per $x = 2$;
- negativo per $-3 < x < 2$.

```ad-tip
Controllare un intervallo con un numero
Scegli un numero dentro un intervallo e sostituiscilo nei fattori. Per $x = 0$, che sta tra $-3$ e $2$, si ha $(0 - 2)(0 + 3) = -6$: negativo, come dice la tabella.
```

## Disequazioni con un prodotto

Dallo studio del segno si leggono le soluzioni di tutte le disequazioni che hanno il prodotto a primo membro e zero a secondo membro. Con la tabella precedente, $(x - 2)(x + 3) > 0$ ha come soluzioni gli intervalli in cui il prodotto è positivo,

$$S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}$$

dove $\cup$ è l'[unione](/materiale/scuola-superiore/matematica/insiemi-e-logica/unione-insiemistica) dei due intervalli. La disequazione $(x - 2)(x + 3) \leq 0$ ha invece come soluzioni gli intervalli in cui il prodotto è negativo, più i due valori in cui vale zero: $S = [-3, 2]$.

Il procedimento, per una disequazione intera che dopo la scomposizione ha solo fattori di primo grado:

1. Porta tutti i termini a primo membro, in modo che a secondo membro resti $0$.
2. Scomponi il primo membro in fattori, con i metodi del capitolo sulla [scomposizione](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale).
3. Per ogni fattore trova dove si annulla e dove è positivo.
4. Disegna la tabella dei segni e ricava il segno del prodotto in ogni intervallo.
5. Scegli gli intervalli con il segno richiesto: positivo per $> 0$, negativo per $< 0$. Con $\geq$ e $\leq$ aggiungi i valori in cui il prodotto si annulla.

Nelle figure degli esempi l'ultima riga, $S$, mostra le soluzioni sulla retta: pallino pieno per un estremo compreso, pallino vuoto per un estremo escluso.

## Esempi svolti con il prodotto

```ad-example
Esempio 1: prodotto negativo
$$(x + 1)(x - 4) < 0$$

Il primo membro è già scomposto e il secondo è zero. Il fattore $x + 1$ si annulla per $x = -1$ ed è positivo per $x > -1$; il fattore $x - 4$ si annulla per $x = 4$ ed è positivo per $x > 4$.

```tikz
% nome: disequazione-prodotto-minore
% alt: Tabella dei segni di x più 1 per x meno 4 e, sotto, le soluzioni della disequazione prodotto minore di zero: il segmento tra meno 1 e 4 con i pallini vuoti
% svg: disequazione-prodotto-minore-9b7391e0.svg 262x115
\begin{tikzpicture}
\node at (1.60,0) {$-1$};
\node at (3.20,0) {$4$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$x+1$};
\draw[thick, dashed] (0.00,-0.62) -- (1.43,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick] (1.77,-0.62) -- (3.20,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick] (3.20,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (1.60,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-4$};
\draw[thick, dashed] (0.00,-1.24) -- (1.60,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick, dashed] (1.60,-1.24) -- (3.03,-1.24);
\node[above] at (2.40,-1.29) {\small $-$};
\draw[thick] (3.37,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (3.20,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\node at (1.60,-1.86) {\small $0$};
\node at (3.20,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.70,-2.48) -- (3.10,-2.48);
\draw[thick] (1.60,-2.48) circle (2.5pt);
\draw[thick] (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è negativo solo tra $-1$ e $4$. Il verso è $<$, quindi gli estremi, dove il prodotto vale zero, sono esclusi: $-1 < x < 4$, cioè $S = \,\mathopen{]}-1, 4\mathclose{[}$.
```

```ad-example
Esempio 2: un raccoglimento ed estremi compresi
$$x^2 \leq 4x$$

Porta tutto a primo membro e raccogli $x$:

$$
\begin{gathered}
x^2 - 4x \leq 0 \\
\Rightarrow x(x - 4) \leq 0
\end{gathered}
$$

Il fattore $x$ è positivo per $x > 0$, il fattore $x - 4$ per $x > 4$.

```tikz
% nome: disequazione-prodotto-estremi-inclusi
% alt: Tabella dei segni di x per x meno 4 e, sotto, le soluzioni della disequazione prodotto minore o uguale a zero: il segmento da 0 a 4 con i pallini pieni
% svg: disequazione-prodotto-estremi-inclusi-2116712e.svg 262x114
\begin{tikzpicture}
\node at (1.60,0) {$0$};
\node at (3.20,0) {$4$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$x$};
\draw[thick, dashed] (0.00,-0.62) -- (1.43,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick] (1.77,-0.62) -- (3.20,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick] (3.20,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (1.60,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-4$};
\draw[thick, dashed] (0.00,-1.24) -- (1.60,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick, dashed] (1.60,-1.24) -- (3.03,-1.24);
\node[above] at (2.40,-1.29) {\small $-$};
\draw[thick] (3.37,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (3.20,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\node at (1.60,-1.86) {\small $0$};
\node at (3.20,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.60,-2.48) -- (3.20,-2.48);
\fill (1.60,-2.48) circle (2.5pt);
\fill (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è negativo tra $0$ e $4$ e nullo in $0$ e in $4$. Il verso è $\leq$, e gli estremi sono compresi: $0 \leq x \leq 4$, cioè $S = [0, 4]$.
```

```ad-warning
Dividere per l'incognita
Da $x^2 \leq 4x$ viene da dividere per $x$ e scrivere $x \leq 4$. Ma $x$ può essere negativo, e allora il verso andrebbe cambiato, o zero, e per zero non si divide. Il risultato $x \leq 4$ è sbagliato: per $x = -1$ si ha $1 \leq -4$, falso. Non si divide mai per un'espressione con l'incognita: si porta tutto a primo membro e si scompone.
```

```ad-example
Esempio 3: un fattore con il coefficiente negativo
$$(3 - x)(2x + 1) < 0$$

Studia i due fattori:

$$
\begin{gathered}
3 - x > 0 \ \Rightarrow \ x < 3 \\
2x + 1 > 0 \ \Rightarrow \ x > -\frac{1}{2}
\end{gathered}
$$

Il fattore $3 - x$ è positivo a sinistra di $3$: nella tabella la sua linea è continua prima di $3$ e tratteggiata dopo.

```tikz
% nome: disequazione-prodotto-coefficiente-negativo
% alt: Tabella dei segni di 3 meno x per 2x più 1, dove il primo fattore è positivo a sinistra di 3, e sotto le soluzioni del prodotto minore di zero: prima di meno un mezzo e dopo 3
% svg: disequazione-prodotto-coefficiente-negativo-0a708b29.svg 262x118
\begin{tikzpicture}
\node at (1.60,0) {$-\frac{1}{2}$};
\node at (3.20,0) {$3$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$3-x$};
\draw[thick] (0.00,-0.62) -- (1.60,-0.62);
\node[above] at (0.80,-0.67) {\small $+$};
\draw[thick] (1.60,-0.62) -- (3.03,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick, dashed] (3.37,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $-$};
\node at (3.20,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$2x+1$};
\draw[thick, dashed] (0.00,-1.24) -- (1.43,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick] (1.77,-1.24) -- (3.20,-1.24);
\node[above] at (2.40,-1.29) {\small $+$};
\draw[thick] (3.20,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (1.60,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small prodotto};
\node at (0.80,-1.86) {$-$};
\node at (2.40,-1.86) {$+$};
\node at (4.00,-1.86) {$-$};
\node at (1.60,-1.86) {\small $0$};
\node at (3.20,-1.86) {\small $0$};
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (0.00,-2.48) -- (1.50,-2.48);
\draw[blue!45, line width=2pt] (3.30,-2.48) -- (4.80,-2.48);
\draw[thick] (1.60,-2.48) circle (2.5pt);
\draw[thick] (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

Il prodotto è negativo prima di $-\dfrac{1}{2}$ e dopo $3$, con gli estremi esclusi:

$$x < -\frac{1}{2} \ \text{ oppure } \ x > 3$$

$$S = \left]-\infty, -\frac{1}{2}\right[ \cup \,\mathopen{]}3, +\infty\mathclose{[}$$
```

```ad-tip
Cambiare il segno a un fattore
Si può scrivere $3 - x = -(x - 3)$, e la disequazione diventa $-(x - 3)(2x + 1) < 0$. Moltiplicando per $-1$ e cambiando il verso si ha $(x - 3)(2x + 1) > 0$, con tutti e due i coefficienti di $x$ positivi: le soluzioni sono le stesse.
```

```ad-example
Esempio 4: tre fattori
$$x^3 - 9x \geq 0$$

Raccogli $x$ e poi scomponi la [differenza di quadrati](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli):

$$
\begin{aligned}
x^3 - 9x &= x(x^2 - 9) \\
&= x(x + 3)(x - 3)
\end{aligned}
$$

I fattori si annullano in $0$, $-3$ e $3$, e sono positivi rispettivamente per $x > 0$, $x > -3$ e $x > 3$. Con tre fattori gli intervalli sono quattro:

```tikz
% nome: disequazione-prodotto-tre-fattori
% alt: Tabella dei segni di x per x più 3 per x meno 3, e sotto le soluzioni del prodotto maggiore o uguale a zero: il segmento da meno 3 a 0 e la semiretta da 3, con i pallini pieni
% svg: disequazione-prodotto-tre-fattori-9fde1915.svg 262x139
\begin{tikzpicture}
\node at (1.20,0) {$-3$};
\node at (2.40,0) {$0$};
\node at (3.60,0) {$3$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.20,-0.20) -- (1.20,-0.45);
\draw[gray!60, densely dotted] (1.20,-0.82) -- (1.20,-1.07);
\draw[gray!60, densely dotted] (1.20,-1.44) -- (1.20,-1.69);
\draw[gray!60, densely dotted] (1.20,-2.06) -- (1.20,-2.31);
\draw[gray!60, densely dotted] (1.20,-2.68) -- (1.20,-2.93);
\draw[gray!60, densely dotted] (2.40,-0.20) -- (2.40,-0.45);
\draw[gray!60, densely dotted] (2.40,-0.82) -- (2.40,-1.07);
\draw[gray!60, densely dotted] (2.40,-1.44) -- (2.40,-1.69);
\draw[gray!60, densely dotted] (2.40,-2.06) -- (2.40,-2.31);
\draw[gray!60, densely dotted] (2.40,-2.68) -- (2.40,-2.93);
\draw[gray!60, densely dotted] (3.60,-0.20) -- (3.60,-0.45);
\draw[gray!60, densely dotted] (3.60,-0.82) -- (3.60,-1.07);
\draw[gray!60, densely dotted] (3.60,-1.44) -- (3.60,-1.69);
\draw[gray!60, densely dotted] (3.60,-2.06) -- (3.60,-2.31);
\draw[gray!60, densely dotted] (3.60,-2.68) -- (3.60,-2.93);
\node[left] at (-0.1,-0.62) {$x$};
\draw[thick, dashed] (0.00,-0.62) -- (1.20,-0.62);
\node[above] at (0.60,-0.67) {\small $-$};
\draw[thick, dashed] (1.20,-0.62) -- (2.23,-0.62);
\node[above] at (1.80,-0.67) {\small $-$};
\draw[thick] (2.57,-0.62) -- (3.60,-0.62);
\node[above] at (3.00,-0.67) {\small $+$};
\draw[thick] (3.60,-0.62) -- (4.80,-0.62);
\node[above] at (4.20,-0.67) {\small $+$};
\node at (2.40,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x+3$};
\draw[thick, dashed] (0.00,-1.24) -- (1.03,-1.24);
\node[above] at (0.60,-1.29) {\small $-$};
\draw[thick] (1.37,-1.24) -- (2.40,-1.24);
\node[above] at (1.80,-1.29) {\small $+$};
\draw[thick] (2.40,-1.24) -- (3.60,-1.24);
\node[above] at (3.00,-1.29) {\small $+$};
\draw[thick] (3.60,-1.24) -- (4.80,-1.24);
\node[above] at (4.20,-1.29) {\small $+$};
\node at (1.20,-1.24) {\small $0$};
\node[left] at (-0.1,-1.86) {$x-3$};
\draw[thick, dashed] (0.00,-1.86) -- (1.20,-1.86);
\node[above] at (0.60,-1.91) {\small $-$};
\draw[thick, dashed] (1.20,-1.86) -- (2.40,-1.86);
\node[above] at (1.80,-1.91) {\small $-$};
\draw[thick, dashed] (2.40,-1.86) -- (3.43,-1.86);
\node[above] at (3.00,-1.91) {\small $-$};
\draw[thick] (3.77,-1.86) -- (4.80,-1.86);
\node[above] at (4.20,-1.91) {\small $+$};
\node at (3.60,-1.86) {\small $0$};
\draw[gray!60] (-0.1,-2.17) -- (4.80,-2.17);
\node[left] at (-0.1,-2.48) {\small prodotto};
\node at (0.60,-2.48) {$-$};
\node at (1.80,-2.48) {$+$};
\node at (3.00,-2.48) {$-$};
\node at (4.20,-2.48) {$+$};
\node at (1.20,-2.48) {\small $0$};
\node at (2.40,-2.48) {\small $0$};
\node at (3.60,-2.48) {\small $0$};
\node[left] at (-0.1,-3.10) {$S$};
\draw[blue!45, line width=2pt] (1.20,-3.10) -- (2.40,-3.10);
\draw[blue!45, line width=2pt] (3.60,-3.10) -- (4.80,-3.10);
\fill (1.20,-3.10) circle (2.5pt);
\fill (2.40,-3.10) circle (2.5pt);
\fill (3.60,-3.10) circle (2.5pt);
\end{tikzpicture}
```

Prima di $-3$ i fattori negativi sono tre, e il prodotto è negativo; tra $-3$ e $0$ sono due, e il prodotto è positivo; tra $0$ e $3$ è uno solo; dopo $3$ nessuno. Il verso è $\geq$: servono gli intervalli con il $+$ e i tre zeri.

$$-3 \leq x \leq 0 \ \text{ oppure } \ x \geq 3$$

$$S = [-3, 0] \cup [3, +\infty\mathclose{[}$$
```

```ad-warning
Il quadrato maggiore di un numero
Da $x^2 > 9$ molti scrivono $x > 3$, e perdono metà delle soluzioni: anche $x = -4$ va bene, perché $(-4)^2 = 16 > 9$. Porta tutto a primo membro e scomponi: $x^2 - 9 = (x + 3)(x - 3) > 0$, e la tabella dà $x < -3$ oppure $x > 3$.
```

```ad-warning
Confondere la tabella dei segni con un sistema
Nella tabella dei segni non si cercano gli intervalli in cui tutte le linee sono continue, come nei [sistemi di disequazioni](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/sistemi-di-disequazioni): si contano i segni meno in ogni colonna. Nell'esempio 4 il prodotto è positivo anche tra $-3$ e $0$, dove due fattori su tre sono negativi.
```

## Disequazioni fratte

Una **disequazione fratta** è una disequazione in cui l'incognita compare in almeno un denominatore, come $\dfrac{x - 1}{x + 2} \geq 0$. Come le [equazioni fratte](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte), ha senso solo per i valori che non annullano nessun denominatore: le **condizioni di esistenza** (C.E.), che si trovano come nella lezione [Frazioni algebriche e condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza).

Una frazione $\dfrac{N}{D}$ ha lo stesso segno del prodotto $N \cdot D$, perché quoziente e prodotto seguono la stessa regola dei segni. Per questo si studiano il segno del numeratore e quello del denominatore con la stessa tabella, con due differenze: dove il denominatore si annulla la frazione non esiste, e nella tabella quel punto ha un pallino vuoto; dove si annulla il numeratore la frazione vale zero, e quel punto è una soluzione solo con $\geq$ o $\leq$.

Il procedimento:

1. Porta tutti i termini a primo membro, in modo che a secondo membro resti $0$.
2. Riduci il primo membro a una frazione sola $\dfrac{N}{D}$, con il denominatore comune, come nelle [operazioni con le frazioni algebriche](/materiale/scuola-superiore/matematica/frazioni-algebriche/operazioni-con-le-frazioni-algebriche).
3. Scomponi numeratore e denominatore in fattori e scrivi le C.E.: il denominatore diverso da zero.
4. Studia il segno di ogni fattore, del numeratore e del denominatore, e disegna la tabella dei segni.
5. Scegli gli intervalli con il segno richiesto. Con $\geq$ e $\leq$ aggiungi gli zeri del numeratore, mai quelli del denominatore.

```ad-example
Esempio 5: una frazione maggiore o uguale a zero
$$\frac{x - 1}{x + 2} \geq 0$$

Il primo membro è già una frazione sola e il secondo è zero. C.E.: $x \neq -2$.

Il numeratore $x - 1$ è positivo per $x > 1$ e si annulla per $x = 1$; il denominatore $x + 2$ è positivo per $x > -2$.

```tikz
% nome: disequazione-fratta
% alt: Tabella dei segni di x meno 1 fratto x più 2, con un pallino vuoto in meno 2 dove il denominatore si annulla, e sotto le soluzioni della frazione maggiore o uguale a zero: prima di meno 2, escluso, e da 1 in poi, incluso
% svg: disequazione-fratta-92da2cb1.svg 258x115
\begin{tikzpicture}
\node at (1.60,0) {$-2$};
\node at (3.20,0) {$1$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$x-1$};
\draw[thick, dashed] (0.00,-0.62) -- (1.60,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick, dashed] (1.60,-0.62) -- (3.03,-0.62);
\node[above] at (2.40,-0.67) {\small $-$};
\draw[thick] (3.37,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (3.20,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x+2$};
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

La frazione è positiva prima di $-2$ e dopo $1$. Il verso è $\geq$, quindi si aggiunge lo zero del numeratore, $x = 1$, ma non $x = -2$, dove la frazione non esiste:

$$x < -2 \ \text{ oppure } \ x \geq 1$$

$$S = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup [1, +\infty\mathclose{[}$$
```

```ad-warning
Includere lo zero del denominatore
Con $\geq$ e $\leq$ vengono da includere tutti gli estremi. Nell'esempio 5, però, per $x = -2$ la frazione è $\dfrac{-3}{0}$, che non esiste: l'estremo $-2$ resta escluso, con la parentesi rivolta verso l'esterno e il pallino vuoto.
```

```ad-example
Esempio 6: portare tutto a primo membro
$$\frac{2x + 1}{x - 3} < 1$$

C.E.: $x \neq 3$. Il secondo membro non è zero: porta l'$1$ a primo membro e riduci a una frazione sola, con il denominatore $x - 3$:

$$
\begin{gathered}
\frac{2x + 1}{x - 3} - 1 < 0 \\
\Rightarrow \frac{2x + 1 - (x - 3)}{x - 3} < 0 \\
\Rightarrow \frac{x + 4}{x - 3} < 0
\end{gathered}
$$

Il numeratore è positivo per $x > -4$, il denominatore per $x > 3$.

```tikz
% nome: disequazione-fratta-primo-membro
% alt: Tabella dei segni di x più 4 fratto x meno 3, e sotto le soluzioni della frazione minore di zero: il segmento tra meno 4 e 3 con i pallini vuoti
% svg: disequazione-fratta-primo-membro-1567665c.svg 258x115
\begin{tikzpicture}
\node at (1.60,0) {$-4$};
\node at (3.20,0) {$3$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.60,-0.20) -- (1.60,-0.45);
\draw[gray!60, densely dotted] (1.60,-0.82) -- (1.60,-1.07);
\draw[gray!60, densely dotted] (1.60,-1.44) -- (1.60,-1.69);
\draw[gray!60, densely dotted] (1.60,-2.06) -- (1.60,-2.31);
\draw[gray!60, densely dotted] (3.20,-0.20) -- (3.20,-0.45);
\draw[gray!60, densely dotted] (3.20,-0.82) -- (3.20,-1.07);
\draw[gray!60, densely dotted] (3.20,-1.44) -- (3.20,-1.69);
\draw[gray!60, densely dotted] (3.20,-2.06) -- (3.20,-2.31);
\node[left] at (-0.1,-0.62) {$x+4$};
\draw[thick, dashed] (0.00,-0.62) -- (1.43,-0.62);
\node[above] at (0.80,-0.67) {\small $-$};
\draw[thick] (1.77,-0.62) -- (3.20,-0.62);
\node[above] at (2.40,-0.67) {\small $+$};
\draw[thick] (3.20,-0.62) -- (4.80,-0.62);
\node[above] at (4.00,-0.67) {\small $+$};
\node at (1.60,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x-3$};
\draw[thick, dashed] (0.00,-1.24) -- (1.60,-1.24);
\node[above] at (0.80,-1.29) {\small $-$};
\draw[thick, dashed] (1.60,-1.24) -- (3.03,-1.24);
\node[above] at (2.40,-1.29) {\small $-$};
\draw[thick] (3.37,-1.24) -- (4.80,-1.24);
\node[above] at (4.00,-1.29) {\small $+$};
\node at (3.20,-1.24) {\small $0$};
\draw[gray!60] (-0.1,-1.55) -- (4.80,-1.55);
\node[left] at (-0.1,-1.86) {\small frazione};
\node at (0.80,-1.86) {$+$};
\node at (2.40,-1.86) {$-$};
\node at (4.00,-1.86) {$+$};
\node at (1.60,-1.86) {\small $0$};
\draw[thick] (3.20,-1.86) circle (2.5pt);
\node[left] at (-0.1,-2.48) {$S$};
\draw[blue!45, line width=2pt] (1.70,-2.48) -- (3.10,-2.48);
\draw[thick] (1.60,-2.48) circle (2.5pt);
\draw[thick] (3.20,-2.48) circle (2.5pt);
\end{tikzpicture}
```

La frazione è negativa tra $-4$ e $3$, estremi esclusi: $-4 < x < 3$, cioè $S = \,\mathopen{]}-4, 3\mathclose{[}$. Verifica con $x = 0$: $\dfrac{1}{-3} < 1$, vero.
```

```ad-warning
Moltiplicare per il denominatore
Nell'esempio 6 viene da moltiplicare tutti e due i membri per $x - 3$, come si fa con le equazioni fratte, e si arriva a $2x + 1 < x - 3$, cioè $x < -4$: nessuna delle soluzioni giuste. Il motivo è che $x - 3$ è positivo per alcuni valori e negativo per altri, e moltiplicando per un numero negativo il verso va cambiato. Senza conoscere il segno del denominatore non si sa se cambiarlo: il denominatore non si elimina, si studia il suo segno.
```

```ad-example
Esempio 7: due frazioni e tre fattori
$$\frac{3}{x - 1} \geq \frac{2}{x}$$

C.E.: $x \neq 0$, $x \neq 1$. Porta tutto a primo membro e riduci al denominatore comune $x(x - 1)$:

$$
\begin{gathered}
\frac{3}{x - 1} - \frac{2}{x} \geq 0 \\
\Rightarrow \frac{3x - 2(x - 1)}{x(x - 1)} \geq 0 \\
\Rightarrow \frac{x + 2}{x(x - 1)} \geq 0
\end{gathered}
$$

Il numeratore $x + 2$ è positivo per $x > -2$; nel denominatore, $x$ è positivo per $x > 0$ e $x - 1$ per $x > 1$. I fattori del denominatore hanno il pallino vuoto nell'ultima riga.

```tikz
% nome: disequazione-fratta-tre-fattori
% alt: Tabella dei segni di x più 2 fratto x per x meno 1, e sotto le soluzioni della frazione maggiore o uguale a zero: da meno 2 incluso a 0 escluso, e dopo 1 escluso
% svg: disequazione-fratta-tre-fattori-f0abc8f2.svg 258x139
\begin{tikzpicture}
\node at (1.20,0) {$-2$};
\node at (2.40,0) {$0$};
\node at (3.60,0) {$1$};
\node at (5.05,0) {$x$};
\draw[gray!60, densely dotted] (1.20,-0.20) -- (1.20,-0.45);
\draw[gray!60, densely dotted] (1.20,-0.82) -- (1.20,-1.07);
\draw[gray!60, densely dotted] (1.20,-1.44) -- (1.20,-1.69);
\draw[gray!60, densely dotted] (1.20,-2.06) -- (1.20,-2.31);
\draw[gray!60, densely dotted] (1.20,-2.68) -- (1.20,-2.93);
\draw[gray!60, densely dotted] (2.40,-0.20) -- (2.40,-0.45);
\draw[gray!60, densely dotted] (2.40,-0.82) -- (2.40,-1.07);
\draw[gray!60, densely dotted] (2.40,-1.44) -- (2.40,-1.69);
\draw[gray!60, densely dotted] (2.40,-2.06) -- (2.40,-2.31);
\draw[gray!60, densely dotted] (2.40,-2.68) -- (2.40,-2.93);
\draw[gray!60, densely dotted] (3.60,-0.20) -- (3.60,-0.45);
\draw[gray!60, densely dotted] (3.60,-0.82) -- (3.60,-1.07);
\draw[gray!60, densely dotted] (3.60,-1.44) -- (3.60,-1.69);
\draw[gray!60, densely dotted] (3.60,-2.06) -- (3.60,-2.31);
\draw[gray!60, densely dotted] (3.60,-2.68) -- (3.60,-2.93);
\node[left] at (-0.1,-0.62) {$x+2$};
\draw[thick, dashed] (0.00,-0.62) -- (1.03,-0.62);
\node[above] at (0.60,-0.67) {\small $-$};
\draw[thick] (1.37,-0.62) -- (2.40,-0.62);
\node[above] at (1.80,-0.67) {\small $+$};
\draw[thick] (2.40,-0.62) -- (3.60,-0.62);
\node[above] at (3.00,-0.67) {\small $+$};
\draw[thick] (3.60,-0.62) -- (4.80,-0.62);
\node[above] at (4.20,-0.67) {\small $+$};
\node at (1.20,-0.62) {\small $0$};
\node[left] at (-0.1,-1.24) {$x$};
\draw[thick, dashed] (0.00,-1.24) -- (1.20,-1.24);
\node[above] at (0.60,-1.29) {\small $-$};
\draw[thick, dashed] (1.20,-1.24) -- (2.23,-1.24);
\node[above] at (1.80,-1.29) {\small $-$};
\draw[thick] (2.57,-1.24) -- (3.60,-1.24);
\node[above] at (3.00,-1.29) {\small $+$};
\draw[thick] (3.60,-1.24) -- (4.80,-1.24);
\node[above] at (4.20,-1.29) {\small $+$};
\node at (2.40,-1.24) {\small $0$};
\node[left] at (-0.1,-1.86) {$x-1$};
\draw[thick, dashed] (0.00,-1.86) -- (1.20,-1.86);
\node[above] at (0.60,-1.91) {\small $-$};
\draw[thick, dashed] (1.20,-1.86) -- (2.40,-1.86);
\node[above] at (1.80,-1.91) {\small $-$};
\draw[thick, dashed] (2.40,-1.86) -- (3.43,-1.86);
\node[above] at (3.00,-1.91) {\small $-$};
\draw[thick] (3.77,-1.86) -- (4.80,-1.86);
\node[above] at (4.20,-1.91) {\small $+$};
\node at (3.60,-1.86) {\small $0$};
\draw[gray!60] (-0.1,-2.17) -- (4.80,-2.17);
\node[left] at (-0.1,-2.48) {\small frazione};
\node at (0.60,-2.48) {$-$};
\node at (1.80,-2.48) {$+$};
\node at (3.00,-2.48) {$-$};
\node at (4.20,-2.48) {$+$};
\node at (1.20,-2.48) {\small $0$};
\draw[thick] (2.40,-2.48) circle (2.5pt);
\draw[thick] (3.60,-2.48) circle (2.5pt);
\node[left] at (-0.1,-3.10) {$S$};
\draw[blue!45, line width=2pt] (1.20,-3.10) -- (2.30,-3.10);
\draw[blue!45, line width=2pt] (3.70,-3.10) -- (4.80,-3.10);
\fill (1.20,-3.10) circle (2.5pt);
\draw[thick] (2.40,-3.10) circle (2.5pt);
\draw[thick] (3.60,-3.10) circle (2.5pt);
\end{tikzpicture}
```

La frazione è positiva tra $-2$ e $0$ e dopo $1$. Si aggiunge lo zero del numeratore, $-2$, mentre $0$ e $1$ restano esclusi:

$$-2 \leq x < 0 \ \text{ oppure } \ x > 1$$

$$S = [-2, 0\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$$

Verifica con $x = -2$, che è una soluzione: $\dfrac{3}{-3} = -1$ e $\dfrac{2}{-2} = -1$, e $-1 \geq -1$ è vero.
```

```ad-warning
Moltiplicare "in croce"
Da $\dfrac{3}{x - 1} \geq \dfrac{2}{x}$ il prodotto in croce dà $3x \geq 2(x - 1)$, cioè $x \geq -2$. È sbagliato per lo stesso motivo dell'avviso precedente: si è moltiplicato per $x(x - 1)$ senza conoscerne il segno. Per $x = \dfrac{1}{2}$, che rispetta $x \geq -2$, si ha $\dfrac{3}{-1/2} = -6$ e $\dfrac{2}{1/2} = 4$, e $-6 \geq 4$ è falso.
```

```ad-note
Dove si usano
Lo studio del segno torna al secondo anno nelle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado) e nelle [disequazioni fratte di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-fratte-e-sistemi-di-secondo-grado), dove i fattori possono essere anche di secondo grado.
```

## Errori frequenti

```ad-warning
Studiare il segno senza zero a secondo membro
La tabella dei segni dice dove il prodotto è positivo o negativo, cioè lo confronta con zero. In $(x - 1)(x + 2) > 4$ non si può leggere la tabella di $(x - 1)(x + 2)$: prima si porta il $4$ a primo membro, $x^2 + x - 6 > 0$, e poi si scompone di nuovo con il [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado): $(x + 3)(x - 2) > 0$.
```

```ad-warning
Mettere i valori in ordine sbagliato
In cima alla tabella i valori vanno in ordine crescente, compresi i negativi e le frazioni: $-3$, $-\dfrac{1}{2}$, $0$, $3$. Se l'ordine è sbagliato, gli intervalli e i segni del prodotto sono sbagliati.
```
