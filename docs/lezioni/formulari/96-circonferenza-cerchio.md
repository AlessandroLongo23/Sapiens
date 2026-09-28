# Formulario: Circonferenza e cerchio

## Circonferenza, cerchio e loro parti

- Circonferenza di centro $O$ e raggio $r$: i punti del piano a distanza $r$ da $O$. Cerchio: la circonferenza e i punti interni.
- Punto $P$ interno se $\overline{OP} < r$, sulla circonferenza se $\overline{OP} = r$, esterno se $\overline{OP} > r$.
- Corda: segmento con gli estremi sulla circonferenza. Diametro: corda che passa per il centro, la più lunga.

$$\text{diametro} = 2r$$

- Arco: parte di circonferenza tra due punti. Settore circolare: parte di cerchio tra due raggi e un arco. Segmento circolare: parte di cerchio tra una corda e un arco.

```tikz
% nome: settore-segmento-circolare
% alt: Due cerchi: a sinistra il settore circolare compreso tra i raggi OA e OB e l'arco AB; a destra il segmento circolare compreso tra la corda AB e l'arco AB
% svg: settore-segmento-circolare-bf652a2c.svg 236x133
\begin{tikzpicture}
\fill[blue!15] (0.00,0.00) -- (1.13,0.41) arc[start angle=20, end angle=110, radius=1.20] -- cycle;
\fill[blue!15] (4.43,0.41) arc[start angle=20, end angle=130, radius=1.20] -- cycle;
\draw[thick] (0.00,0.00) circle (1.20);
\draw[thick] (3.30,0.00) circle (1.20);
\draw (1.13,0.41) -- (0.00,0.00) -- (-0.41,1.13);
\draw (4.43,0.41) -- (2.53,0.92);
\fill (0.00,0.00) circle (0.06);
\node at (-0.09,-0.24) {$O$};
\fill (3.30,0.00) circle (0.06);
\node at (3.21,-0.24) {$O$};
\fill (1.13,0.41) circle (0.06);
\node at (1.39,0.51) {$A$};
\fill (-0.41,1.13) circle (0.06);
\node at (-0.51,1.39) {$B$};
\fill (4.43,0.41) circle (0.06);
\node at (4.69,0.51) {$A$};
\fill (2.53,0.92) circle (0.06);
\node at (2.35,1.13) {$B$};
\node[font=\small] at (0.00,-1.55) {settore};
\node[font=\small] at (3.30,-1.55) {segmento};
\end{tikzpicture}
```

## Proprietà delle corde

- La perpendicolare dal centro a una corda la divide a metà; l'asse di ogni corda passa per il centro.
- Corde congruenti hanno la stessa distanza dal centro, e viceversa.
- Con la distanza $d$ della corda dal centro, nel triangolo rettangolo con l'ipotenusa $r$:

$$\left(\frac{\text{corda}}{2}\right)^2 + d^2 = r^2$$

## Retta e circonferenza

| Distanza del centro dalla retta | Punti in comune | La retta è |
|---|---|---|
| $d < r$ | due | secante |
| $d = r$ | uno | tangente |
| $d > r$ | nessuno | esterna |

- La tangente è perpendicolare al raggio nel punto di contatto.
- Da un punto esterno $P$: due tangenti, con i segmenti $PA \cong PB$; $OP$ è bisettrice di $\widehat{APB}$, e $\widehat{AOB} + \widehat{APB} = 180^\circ$.

## Due circonferenze

Raggi $r > r'$, distanza dei centri $d$.

| Condizione | Posizione |
|---|---|
| $d > r + r'$ | esterne |
| $d = r + r'$ | tangenti esternamente |
| $r - r' < d < r + r'$ | secanti |
| $d = r - r'$ | tangenti internamente |
| $d < r - r'$ | una interna all'altra ($d = 0$: concentriche) |

## Angoli al centro e alla circonferenza

- Angolo al centro: vertice in $O$. Angolo alla circonferenza: vertice sulla circonferenza, lati secanti.
- Angolo alla circonferenza = metà dell'angolo al centro che insiste sullo stesso arco:

$$\widehat{AVB} = \frac{1}{2}\,\widehat{AOB}$$

- Angoli alla circonferenza sullo stesso arco sono congruenti.
- Angolo inscritto in una semicirconferenza: retto. Se $AB$ è un diametro e $C$ sta sulla circonferenza, $\triangle ABC$ è rettangolo in $C$.

```tikz
% nome: angolo-al-centro-e-alla-circonferenza
% alt: Circonferenza di centro O con l'arco AB evidenziato: l'angolo al centro AOB e l'angolo alla circonferenza AVB, con il vertice V sulla circonferenza, insistono sullo stesso arco
% svg: angolo-al-centro-e-alla-circonferenza-aeaed97d.svg 139x145
\begin{tikzpicture}
\draw[thick] (0.00,0.00) circle (1.60);
\draw[blue!70!black, very thick] (-1.31,-0.92) arc[start angle=215, end angle=325, radius=1.60];
\draw (-1.31,-0.92) -- (0.00,0.00) -- (1.31,-0.92);
\draw[blue!70!black] (-1.31,-0.92) -- (-0.28,1.58) -- (1.31,-0.92);
\draw[thin] (-0.29,-0.20) arc[start angle=-145.00, delta angle=110.00, radius=0.35];
\draw[thin] (-0.47,1.11) arc[start angle=-112.50, delta angle=55.00, radius=0.50];
\fill (0.00,0.00) circle (0.06);
\node at (0.00,0.28) {$O$};
\fill (-0.28,1.58) circle (0.06);
\node at (-0.33,1.85) {$V$};
\fill (-1.31,-0.92) circle (0.06);
\node at (-1.54,-1.08) {$A$};
\fill (1.31,-0.92) circle (0.06);
\node at (1.54,-1.08) {$B$};
\end{tikzpicture}
```

```ad-warning
La metà, non il doppio
L'angolo alla circonferenza è metà di quello al centro: al centro $110^\circ$, alla circonferenza $55^\circ$.
```

```ad-warning
Metà corda nel triangolo
Con $r = 5$ e distanza $3$ il cateto è $4$, e la corda è $8$.
```

```ad-warning
Solo la somma dei raggi
Con raggi $7$ e $3$ e $d = 2$ le circonferenze non sono secanti: $d < r - r'$, una è interna all'altra.
```
