# Formulario: Poligoni inscritti e circoscritti

## Definizioni

- Poligono inscritto in una circonferenza: tutti i vertici sulla circonferenza (circonferenza circoscritta).
- Poligono circoscritto a una circonferenza: tutti i lati tangenti alla circonferenza (circonferenza inscritta).
- Inscrivibile se e solo se gli assi dei lati passano per uno stesso punto; circoscrivibile se e solo se le bisettrici degli angoli passano per uno stesso punto.

## Triangolo

- Sempre inscrivibile: centro nel circocentro $O$ (incontro degli assi).
- Sempre circoscrivibile: centro nell'incentro $I$ (incontro delle bisettrici).
- Triangolo rettangolo: l'ipotenusa è un diametro della circonferenza circoscritta, $R = \dfrac{\text{ipotenusa}}{2}$.

## Quadrilateri

Inscrivibile se e solo se gli angoli opposti sono supplementari:

$$\hat{A} + \hat{C} = \hat{B} + \hat{D} = 180^\circ$$

Circoscrivibile se e solo se le somme dei lati opposti sono uguali:

$$\overline{AB} + \overline{CD} = \overline{BC} + \overline{DA}$$

Esempio: lati $9$, $7$, $6$ in ordine, quarto lato $9 + 6 - 7 = 8$.

| Quadrilatero | Inscrivibile | Circoscrivibile |
|---|---|---|
| parallelogramma qualsiasi | no | no |
| rettangolo | sempre | solo se è un quadrato |
| rombo | solo se è un quadrato | sempre |
| quadrato | sempre | sempre |
| trapezio isoscele | sempre | se basi e lati obliqui hanno la stessa somma |

## Poligoni regolari

- Sempre inscrivibili e circoscrivibili, con le due circonferenze concentriche nel centro $O$ del poligono.
- Raggio $r$: distanza del centro da un vertice. Apotema $a$: distanza del centro da un lato, perpendicolare al lato nel suo punto medio; $a < r$.
- Angolo al centro di un poligono regolare di $n$ lati:

$$\frac{360^\circ}{n}$$

```tikz
% nome: poligono-regolare-raggio-apotema
% alt: Pentagono regolare ABCDE con la circonferenza circoscritta e quella inscritta, tutte e due di centro O: il raggio r va dal centro al vertice D, l'apotema a va dal centro al punto medio H del lato CD ed è perpendicolare al lato
% svg: poligono-regolare-raggio-apotema-3f4d6381.svg 158x152
\begin{tikzpicture}
\draw[orange!80!black] (0.00,0.00) circle (1.60);
\fill[blue!8] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[thick] (0.00,1.60) -- (-1.52,0.49) -- (-0.94,-1.29) -- (0.94,-1.29) -- (1.52,0.49) -- cycle;
\draw[blue!70!black] (0.00,0.00) circle (1.29);
\draw (0.00,0.00) -- (0.94,-1.29);
\draw[blue!70!black, thick] (0.00,0.00) -- (0.00,-1.29);
\draw[thin] (0.16,-1.29) -- (0.16,-1.13) -- (0.00,-1.13);
\draw[thin] (-0.47,-1.16) -- (-0.47,-1.42);
\draw[thin] (0.47,-1.16) -- (0.47,-1.42);
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.26) {$O$};
\fill (0.00,-1.29) circle (0.06);
\node at (0.00,-1.57) {$H$};
\node[font=\small] at (0.63,-0.53) {$r$};
\node[font=\small] at (-0.20,-0.65) {$a$};
\node at (0.00,1.88) {$A$};
\node at (-1.79,0.58) {$B$};
\node at (-1.11,-1.52) {$C$};
\node at (1.11,-1.52) {$D$};
\node at (1.79,0.58) {$E$};
\end{tikzpicture}
```

- Esagono regolare: lato uguale al raggio, $\ell = r$. Con $\ell = 6$: $a = \sqrt{6^2 - 3^2} = 3\sqrt{3}$.
- Quadrato inscritto in una circonferenza di raggio $r$: la diagonale è il diametro $2r$; con $r = 5$ il lato è $5\sqrt{2}$.
- Triangolo equilatero: il raggio è il doppio dell'apotema.

```ad-warning
Angoli opposti, non consecutivi
Nel quadrilatero inscritto $\hat{A} + \hat{C} = 180^\circ$: con $\hat{A} = 75^\circ$ e $\hat{B} = 100^\circ$ viene $\hat{C} = 105^\circ$.
```

```ad-warning
Lati opposti, non consecutivi
Nel quadrilatero circoscritto si sommano $AB + CD$ e $BC + DA$, non due lati vicini.
```

```ad-warning
Raggio e apotema
Il raggio arriva al vertice, l'apotema al punto medio del lato: nell'esagono di lato $6$ il raggio è $6$, l'apotema $3\sqrt{3}$.
```
