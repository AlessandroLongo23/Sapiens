# Formulario: Rette perpendicolari e parallele

## Rette perpendicolari

- Perpendicolari: incidenti e con i quattro angoli retti, $r \perp s$. Se un angolo è retto, lo sono tutti.
- Per un punto $P$ passa una e una sola retta perpendicolare a una retta $r$.

## Primo teorema dell'angolo esterno

- Angolo esterno: formato da un lato e dal prolungamento di un altro; è adiacente all'angolo interno.
- Ogni angolo esterno è maggiore di ciascuno dei due angoli interni non adiacenti.
- In un triangolo la somma di due angoli interni è minore di $180^\circ$: niente due angoli retti o ottusi.

## Proiezione, distanza, asse

- Proiezione di $P$ su $r$: il piede $H$ della perpendicolare da $P$ a $r$.
- Distanza di $P$ da $r$: la lunghezza di $PH$. È il segmento più corto da $P$ a $r$: ogni obliquo $PA$ è più lungo.
- Asse del segmento $AB$: la retta perpendicolare ad $AB$ nel punto medio $M$.

## Rette parallele

- Parallele: nello stesso piano, senza punti in comune oppure coincidenti, $r \parallel s$.
- Quinto postulato di Euclide: per un punto fuori da una retta passa una e una sola parallela alla retta.
- Se $a \parallel b$ e $b \parallel c$, allora $a \parallel c$.
- Due rette perpendicolari alla stessa retta sono parallele.

## Angoli formati da una trasversale

```tikz
% nome: trasversale-otto-angoli
% alt: Due rette a e b tagliate dalla trasversale t; gli otto angoli sono numerati da 1 a 4 nel punto su a e da 5 a 8 nel punto su b, nello stesso ordine
% svg: trasversale-otto-angoli-83c26bae.svg 179x142
\begin{tikzpicture}
\draw[thick] (-0.6,1.7) -- (3.6,1.7) node[right] {$a$};
\draw[thick] (-0.6,0) -- (3.6,0) node[right] {$b$};
\draw[thick, blue!70!black] (0.5,-0.75) -- (2.2,2.45) node[above] {$t$};
\node at (2.16,1.92) {$\hat{1}$};
\node at (1.59,2.06) {$\hat{2}$};
\node at (1.44,1.48) {$\hat{3}$};
\node at (2.02,1.34) {$\hat{4}$};
\node at (1.26,0.22) {$\hat{5}$};
\node at (0.68,0.36) {$\hat{6}$};
\node at (0.54,-0.22) {$\hat{7}$};
\node at (1.12,-0.36) {$\hat{8}$};
\end{tikzpicture}
```

| Coppia | Posizione | Esempi |
|---|---|---|
| alterni interni | interni, parti opposte di $t$ | $\hat{3}$ e $\hat{5}$, $\hat{4}$ e $\hat{6}$ |
| alterni esterni | esterni, parti opposte di $t$ | $\hat{1}$ e $\hat{7}$, $\hat{2}$ e $\hat{8}$ |
| corrispondenti | stessa parte, stessa posizione | $\hat{1}$ e $\hat{5}$, $\hat{4}$ e $\hat{8}$ |
| coniugati interni | interni, stessa parte di $t$ | $\hat{4}$ e $\hat{5}$, $\hat{3}$ e $\hat{6}$ |
| coniugati esterni | esterni, stessa parte di $t$ | $\hat{1}$ e $\hat{8}$, $\hat{2}$ e $\hat{7}$ |

## Criterio di parallelismo e inverso

Due rette tagliate da una trasversale sono parallele se e solo se

- gli angoli alterni (interni o esterni) sono congruenti, oppure
- gli angoli corrispondenti sono congruenti, oppure
- gli angoli coniugati (interni o esterni) sono supplementari.

Con $a \parallel b$ gli otto angoli hanno due ampiezze, $\alpha$ e $180^\circ - \alpha$.

## Angoli del triangolo

$$\hat{A} + \hat{B} + \hat{C} = 180^\circ$$

- Triangolo rettangolo: gli angoli acuti sono complementari, la loro somma è $90^\circ$.
- Triangolo equilatero: ogni angolo misura $60^\circ$.
- Secondo teorema dell'angolo esterno: l'angolo esterno in $B$ è congruente a $\hat{A} + \hat{C}$, la somma dei due interni non adiacenti.

## Angoli di un poligono

Poligono convesso con $n$ lati:

$$S = (n - 2) \cdot 180^\circ$$

- Poligono regolare: ogni angolo misura $S : n$, per esempio $720^\circ : 6 = 120^\circ$ nell'esagono.
- La somma degli angoli esterni, uno per vertice, è $360^\circ$.

```ad-warning
Coniugati congruenti
Con due parallele i coniugati sono supplementari: $115^\circ + 65^\circ = 180^\circ$, non uguali.
```

```ad-warning
Angolo esterno con l'angolo sbagliato
L'angolo esterno in $B$ è $\hat{A} + \hat{C}$; l'angolo interno $\hat{B}$ è il suo supplementare.
```

```ad-warning
Moltiplicare per $n$
La somma degli angoli di un poligono è $(n - 2) \cdot 180^\circ$: per il triangolo $180^\circ$, non $540^\circ$.
```
