# Formulario: Similitudine

## Poligoni simili

Angoli corrispondenti congruenti e lati omologhi in proporzione, con il rapporto di similitudine $k$:

$$\frac{A'B'}{AB} = \frac{B'C'}{BC} = \ldots = k$$

- Si scrive $ABCD \sim A'B'C'D'$, con i vertici corrispondenti nello stesso ordine.
- $k > 1$: ingrandimento; $k < 1$: riduzione; $k = 1$: figure congruenti.
- Due poligoni regolari con lo stesso numero di lati sono sempre simili.

## Criteri di similitudine dei triangoli

| Criterio | Basta che i due triangoli abbiano |
|---|---|
| primo | due angoli congruenti |
| secondo | un angolo congruente e i lati che lo comprendono in proporzione |
| terzo | i tre lati in proporzione |

- Lati omologhi: quelli opposti ad angoli congruenti.
- Una parallela a un lato stacca un triangolo simile: con $DE \parallel BC$, $DE : BC = AD : AB$.
- Nel trapezio le diagonali formano con le basi due triangoli simili, con $k$ uguale al rapporto tra le basi.

## Perimetri, altezze e aree

$$
\begin{gathered}
\frac{2p'}{2p} = k \qquad \frac{A'H'}{AH} = k \\
\frac{\mathcal{A}'}{\mathcal{A}} = k^2
\end{gathered}
$$

Perimetri $2p$ e $2p'$, altezze corrispondenti $AH$ e $A'H'$, aree $\mathcal{A}$ e $\mathcal{A}'$.

Con $k = 3$ e un'area di $20\ \text{cm}^2$: area del simile $9 \cdot 20 = 180\ \text{cm}^2$.

## Teoremi di Euclide

Triangolo $ABC$ rettangolo in $C$, altezza $CH$, proiezioni $AH$ e $HB$:

```tikz
% nome: similitudine-euclide-triangolo-rettangolo
% alt: Triangolo ABC rettangolo in C con l'altezza CH relativa all'ipotenusa AB; l'angolo in A e l'angolo HCB hanno un archetto, l'angolo in B e l'angolo ACH due archetti
% svg: similitudine-euclide-triangolo-rettangolo-957f8664.svg 219x121
\begin{tikzpicture}
\fill[blue!8] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick] (0.00,0.00) -- (4.68,0.00) -- (1.44,2.16) -- cycle;
\draw[thick, blue!70!black] (1.44,2.16) -- (1.44,0.00);
\draw (1.34,2.01) -- (1.49,1.91) -- (1.59,2.06);
\draw (1.59,0.00) -- (1.59,0.15) -- (1.44,0.15);
\draw[black] (0.35,0.00) arc[start angle=0.00, delta angle=56.31, radius=0.35];
\draw[black] (4.35,0.22) arc[start angle=146.31, delta angle=33.69, radius=0.40];
\draw[black] (4.29,0.26) arc[start angle=146.31, delta angle=33.69, radius=0.47];
\draw[black] (1.19,1.79) arc[start angle=-123.69, delta angle=33.69, radius=0.45];
\draw[black] (1.15,1.73) arc[start angle=-123.69, delta angle=33.69, radius=0.52];
\draw[black] (1.44,1.71) arc[start angle=-90.00, delta angle=56.31, radius=0.45];
\node[below left] at (0.00,0.00) {$A$};
\node[below right] at (4.68,0.00) {$B$};
\node[above] at (1.44,2.16) {$C$};
\node[below] at (1.44,0.00) {$H$};
\end{tikzpicture}
```

- Primo: $AB : AC = AC : AH$, cioè $\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH}$; allo stesso modo $\overline{BC}^{\,2} = \overline{AB} \cdot \overline{HB}$.
- Secondo: $AH : CH = CH : HB$, cioè $\overline{CH}^{\,2} = \overline{AH} \cdot \overline{HB}$.

## Misure con l'ombra

Altezza e ombra di due oggetti verticali, nello stesso momento, sono in proporzione: bastone di $1{,}5$ m con ombra di $2$ m, albero con ombra di $10$ m, $x : 10 = 1{,}5 : 2$, $x = 7{,}5$ m.

```ad-warning
Servono angoli e lati
Un quadrato e un rombo con lo stesso lato non sono simili; per i triangoli bastano i criteri.
```

```ad-warning
I lati omologhi non si scelgono dal disegno
Sono quelli opposti agli angoli congruenti, anche se un triangolo è girato.
```

```ad-warning
L'area va con k al quadrato
Lati doppi danno area quadrupla, non doppia.
```
