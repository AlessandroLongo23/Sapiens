# Formulario: Trasformazioni geometriche

## Definizioni

- Trasformazione geometrica: corrispondenza biunivoca tra i punti del piano, $t(P) = P'$.
- Punto unito: $t(P) = P$. Identità: tutti i punti sono uniti.
- Isometria: conserva le distanze, $\overline{A'B'} = \overline{AB}$; manda ogni figura in una figura congruente e conserva lunghezze, angoli, parallelismo, perpendicolarità, allineamento, perimetro e area.

## Le quattro isometrie

| Isometria | Regola | Punti uniti | Verso |
|---|---|---|---|
| traslazione di vettore $\vec{v}$ | $PP'$ ha direzione, verso e modulo di $\vec{v}$ | nessuno ($\vec{v}$ non nullo) | diretta |
| rotazione di centro $O$ e angolo $\alpha$ | $OP' \cong OP$, $\widehat{POP'} = \alpha$ in senso antiorario | solo $O$ | diretta |
| simmetria centrale di centro $O$ | $O$ punto medio di $PP'$ | solo $O$ | diretta |
| simmetria assiale di asse $r$ | $r$ asse del segmento $PP'$ | i punti di $r$ | inversa |

- La simmetria centrale è la rotazione di $180^\circ$.
- Diretta: conserva il verso di percorrenza; inversa: lo inverte.

## Composizione

$t_2 \circ t_1$: prima $t_1$, poi $t_2$. Due simmetrie assiali con assi paralleli $a$ e $b$ a distanza $d$:

$$s_b \circ s_a = \text{traslazione di modulo } 2d$$

perpendicolare agli assi, nel verso da $a$ verso $b$. L'ordine conta: $s_a \circ s_b$ va nel verso opposto.

## Omotetia di centro O e rapporto k

- $P'$ sulla retta $OP$ con $\overline{OP'} = |k| \cdot \overline{OP}$: dalla parte di $P$ se $k > 0$, dalla parte opposta se $k < 0$.
- Lati paralleli, lunghezze per $|k|$, angoli conservati, aree per $k^2$.
- $k = 1$: identità; $k = -1$: simmetria centrale.
- È una similitudine di rapporto $|k|$.

## Nel piano cartesiano

| Trasformazione | Equazioni |
|---|---|
| traslazione di $\vec{v}(a, b)$ | $x' = x + a$, $y' = y + b$ |
| simmetria rispetto all'asse $x$ | $x' = x$, $y' = -y$ |
| simmetria rispetto all'asse $y$ | $x' = -x$, $y' = y$ |
| simmetria rispetto all'origine | $x' = -x$, $y' = -y$ |
| simmetria rispetto a $y = x$ | $x' = y$, $y' = x$ |
| omotetia di centro $O$ e rapporto $k$ | $x' = kx$, $y' = ky$ |

## Immagine di una retta

1. Dalle equazioni ricava $x$ e $y$ in funzione di $x'$ e $y'$.
2. Sostituiscile nell'equazione della retta.
3. Semplifica e togli gli apici.
4. Controlla con un punto della retta.

$$
\begin{gathered}
y = 2x + 1, \quad \vec{v}(3, -1) \\
y' + 1 = 2(x' - 3) + 1 \\
y = 2x - 6
\end{gathered}
$$

```ad-warning
Il segno nella sostituzione
Con $\vec{v}(3, -1)$ si sostituisce $x = x' - 3$ e $y = y' + 1$: il punto di partenza è l'immagine spostata all'indietro.
```

```ad-warning
L'area nell'omotetia
Con $k = 2$ i lati raddoppiano e l'area diventa $4$ volte più grande.
```

```ad-warning
Quale coordinata cambia segno
Simmetria rispetto all'asse $x$: $(3, 2)$ va in $(3, -2)$, non in $(-3, 2)$.
```
