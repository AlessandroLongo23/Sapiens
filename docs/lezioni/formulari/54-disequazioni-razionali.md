# Formulario: Studio del segno e disequazioni fratte

## Segno di un prodotto e di un quoziente

- Regola dei segni: un prodotto di fattori diversi da zero è positivo se i fattori negativi sono in numero pari, negativo se sono in numero dispari. Il quoziente segue la stessa regola.
- Un prodotto vale zero se almeno un fattore vale zero.
- Un quoziente vale zero se il numeratore vale zero, e non esiste se il denominatore vale zero.

## Segno di un fattore di primo grado

Si risolve $ax + b > 0$. Con il coefficiente di $x$ positivo il fattore è negativo prima del suo zero e positivo dopo; con il coefficiente negativo il contrario.

$$
\begin{gathered}
x - 2 > 0 \ \Rightarrow \ x > 2 \\
3 - x > 0 \ \Rightarrow \ x < 3
\end{gathered}
$$

## Tabella dei segni

In alto gli zeri dei fattori in ordine crescente; una riga per fattore, con la linea continua dove è positivo, tratteggiata dove è negativo, $0$ dove si annulla; nell'ultima riga il segno del prodotto, colonna per colonna. Con uno zero del denominatore, pallino vuoto.

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

## Disequazioni con un prodotto

1. Porta tutto a primo membro: a secondo membro resta $0$.
2. Scomponi il primo membro in fattori di primo grado.
3. Per ogni fattore trova dove si annulla e dove è positivo.
4. Disegna la tabella dei segni.
5. Scegli gli intervalli: $+$ per $> 0$, $-$ per $< 0$; con $\geq$ e $\leq$ aggiungi gli zeri.

$$
\begin{gathered}
x^2 \leq 4x \\
x(x - 4) \leq 0 \\
S = [0, 4]
\end{gathered}
$$

## Disequazioni fratte

1. Porta tutto a primo membro e riduci a una frazione sola $\dfrac{N}{D}$.
2. Scomponi $N$ e $D$ e scrivi le C.E.: $D \neq 0$.
3. Studia il segno di ogni fattore di $N$ e di $D$ nella stessa tabella.
4. Scegli gli intervalli con il segno richiesto; con $\geq$ e $\leq$ aggiungi gli zeri di $N$, mai quelli di $D$.

$$
\begin{gathered}
\frac{x - 1}{x + 2} \geq 0 \qquad \text{C.E.: } x \neq -2 \\
S = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup [1, +\infty\mathclose{[}
\end{gathered}
$$

```ad-warning
Moltiplicare per il denominatore
Il denominatore è positivo per alcuni valori e negativo per altri, e moltiplicando per un negativo il verso cambia: il denominatore non si elimina, se ne studia il segno.
```

```ad-warning
Includere lo zero del denominatore
Con $\geq$ e $\leq$ gli zeri del denominatore restano esclusi: lì la frazione non esiste.
```

```ad-warning
Dividere per l'incognita
Da $x^2 \leq 4x$ non si passa a $x \leq 4$: si porta tutto a primo membro e si scompone, $x(x - 4) \leq 0$.
```
