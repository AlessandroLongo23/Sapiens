# Confronto tra frazioni

Confrontare due frazioni vuol dire stabilire se sono uguali oppure quale delle due è maggiore. Serve per ordinare dei numeri, per controllare il risultato di un problema e, più avanti, per risolvere le disequazioni. Da qui in avanti i denominatori sono sempre positivi: una frazione con il denominatore negativo si riscrive spostando il segno al numeratore, per esempio $\dfrac{3}{-4} = -\dfrac{3}{4}$.

Prima di confrontare conviene sempre ridurre le frazioni ai minimi termini: i numeri diventano più piccoli, e a volte si scopre che le due frazioni sono la stessa. Frazioni equivalenti, proprietà invariantiva e riduzione ai minimi termini sono spiegate nella lezione [Frazioni e numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali).

## Frazioni con lo stesso denominatore

Se due frazioni hanno lo stesso denominatore (positivo), è maggiore quella con il numeratore maggiore: le parti in cui è diviso l'intero sono uguali, e ne prendi di più.

$$\dfrac{a}{c} < \dfrac{b}{c} \quad \text{se e solo se} \quad a < b \qquad (c > 0)$$

```ad-example
Esempio: stesso denominatore
$\dfrac{3}{7} < \dfrac{5}{7}$ perché $3 < 5$.

La regola vale anche con i numeratori negativi: $-\dfrac{5}{7} < -\dfrac{3}{7}$ perché $-5 < -3$.
```

```ad-warning
Confrontare solo i numeratori
$\dfrac{5}{8}$ non è maggiore di $\dfrac{3}{4}$ solo perché $5 > 3$: con il denominatore comune $\dfrac{3}{4} = \dfrac{6}{8}$, quindi $\dfrac{3}{4} > \dfrac{5}{8}$. I numeratori si confrontano da soli solo quando i denominatori sono uguali.
```

## Frazioni con lo stesso numeratore

Se due frazioni positive hanno lo stesso numeratore, è maggiore quella con il denominatore minore. Più il denominatore è piccolo, più sono grandi le parti in cui è diviso l'intero, e prendendo lo stesso numero di parti si ottiene di più.

```ad-example
Esempio: stesso numeratore
$\dfrac{3}{5} > \dfrac{3}{8}$ perché $5 < 8$: tre quinti sono più di tre ottavi.

$\dfrac{7}{4} > \dfrac{7}{9}$ perché $4 < 9$.
```

```ad-warning
Pensare che un denominatore più grande dia una frazione più grande
$\dfrac{2}{5}$ è minore di $\dfrac{2}{3}$: dividere l'intero in cinque parti le rende più piccole di quelle ottenute dividendolo in tre.
```

La regola si rovescia se il numeratore comune è negativo: $-\dfrac{3}{5} < -\dfrac{3}{8}$, come spiegato più sotto nella parte sulle frazioni negative.

## Denominatore comune

Quando numeratori e denominatori sono tutti diversi, si trasformano le frazioni in frazioni equivalenti con lo stesso denominatore e poi si confrontano i numeratori.

1. Calcola il MCM dei denominatori: sarà il denominatore comune.
2. Per ogni frazione, dividi il MCM per il denominatore e moltiplica per il risultato sia il numeratore sia il denominatore.
3. Confronta i numeratori delle nuove frazioni.

```ad-example
Esempio 1: confrontare 2/3 e 3/4
$\text{MCM}(3, 4) = 12$.

$$\dfrac{2}{3} = \dfrac{2 \cdot 4}{3 \cdot 4} = \dfrac{8}{12} \qquad \dfrac{3}{4} = \dfrac{3 \cdot 3}{4 \cdot 3} = \dfrac{9}{12}$$

Poiché $8 < 9$, si ha $\dfrac{2}{3} < \dfrac{3}{4}$.
```

```ad-example
Esempio 2: confrontare 5/6 e 7/9
$6 = 2 \cdot 3$ e $9 = 3^2$, quindi $\text{MCM}(6, 9) = 2 \cdot 3^2 = 18$.

$$\dfrac{5}{6} = \dfrac{15}{18} \qquad \dfrac{7}{9} = \dfrac{14}{18}$$

Poiché $15 > 14$, si ha $\dfrac{5}{6} > \dfrac{7}{9}$.
```

Si potrebbe usare come denominatore comune anche il prodotto dei denominatori ($6 \cdot 9 = 54$): il confronto viene giusto lo stesso, ma con numeri più grandi.

## Prodotto in croce

Con due sole frazioni c'è una scorciatoia. Se i denominatori $b$ e $d$ sono positivi,

$$\dfrac{a}{b} < \dfrac{c}{d} \quad \text{se e solo se} \quad a \cdot d < c \cdot b$$

cioè si confrontano il prodotto del primo numeratore per il secondo denominatore e il prodotto del secondo numeratore per il primo denominatore.

Funziona perché è il metodo del denominatore comune con $b \cdot d$ al posto del MCM:

$$\dfrac{a}{b} = \dfrac{a \cdot d}{b \cdot d} \qquad \dfrac{c}{d} = \dfrac{c \cdot b}{d \cdot b}$$

Le due frazioni hanno ora lo stesso denominatore $b \cdot d$, che è positivo, quindi si confrontano i numeratori $a \cdot d$ e $c \cdot b$. Se uno dei denominatori fosse negativo, anche $b \cdot d$ sarebbe negativo e il verso del confronto si rovescerebbe: per questo, prima di moltiplicare in croce, il segno va portato al numeratore.

```ad-example
Esempio: confrontare 7/12 e 11/19
$7 \cdot 19 = 133$ e $11 \cdot 12 = 132$. Poiché $133 > 132$, si ha $\dfrac{7}{12} > \dfrac{11}{19}$.

Qui il MCM dei denominatori è proprio $12 \cdot 19 = 228$, quindi il prodotto in croce non costa più conti del denominatore comune.
```

```ad-warning
Moltiplicare in croce con un denominatore negativo
Con $\dfrac{1}{-2}$ e $\dfrac{1}{3}$ il prodotto in croce darebbe $1 \cdot 3 = 3$ contro $1 \cdot (-2) = -2$, e quindi $\dfrac{1}{-2} > \dfrac{1}{3}$, che è falso. Prima si scrive $\dfrac{1}{-2} = -\dfrac{1}{2}$, poi si moltiplica in croce: $-1 \cdot 3 = -3 < 1 \cdot 2 = 2$, quindi $-\dfrac{1}{2} < \dfrac{1}{3}$.
```

## Frazioni negative

Ogni frazione negativa è minore di zero e quindi minore di ogni frazione positiva: $-\dfrac{9}{10} < \dfrac{1}{100}$ senza bisogno di conti.

Fra due frazioni negative è maggiore quella più vicina a zero. Si può procedere in due modi:

- confrontare le frazioni senza il segno e poi rovesciare il risultato: $\dfrac{3}{4} > \dfrac{2}{3}$, quindi $-\dfrac{3}{4} < -\dfrac{2}{3}$;
- ridurre allo stesso denominatore tenendo il segno al numeratore: $-\dfrac{3}{4} = -\dfrac{9}{12}$ e $-\dfrac{2}{3} = -\dfrac{8}{12}$, e $-9 < -8$.

I due modi danno lo stesso risultato; il secondo è più comodo quando ci sono insieme frazioni positive e negative.

```ad-warning
Sbagliare verso con le frazioni negative
$-\dfrac{1}{2} < -\dfrac{1}{3}$, anche se $\dfrac{1}{2} > \dfrac{1}{3}$. Fra due numeri negativi è maggiore quello più vicino a zero.
```

## Ordinare più frazioni

Per mettere in ordine più frazioni si riducono tutte allo stesso denominatore, il MCM di tutti i denominatori, e si ordinano i numeratori.

```ad-example
Esempio: ordinare in modo crescente
Ordina $\dfrac{3}{4}$, $-\dfrac{1}{2}$, $\dfrac{5}{6}$, $\dfrac{2}{3}$, $-\dfrac{3}{8}$.

I denominatori sono $4, 2, 6, 3, 8$ e $\text{MCM}(4, 2, 6, 3, 8) = 24$.

$$\dfrac{3}{4} = \dfrac{18}{24} \quad -\dfrac{1}{2} = -\dfrac{12}{24} \quad \dfrac{5}{6} = \dfrac{20}{24} \quad \dfrac{2}{3} = \dfrac{16}{24} \quad -\dfrac{3}{8} = -\dfrac{9}{24}$$

I numeratori in ordine crescente sono $-12 < -9 < 16 < 18 < 20$, quindi

$$-\dfrac{1}{2} < -\dfrac{3}{8} < \dfrac{2}{3} < \dfrac{3}{4} < \dfrac{5}{6}$$
```

## Le frazioni sulla retta

Ogni frazione corrisponde a un punto della retta dei numeri (come si trova è spiegato nella lezione [Frazioni e numeri razionali](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali)). Confrontare due frazioni vuol dire vedere quale delle due sta più a destra: quella è la maggiore.

```tikz
% nome: frazioni-sulla-retta-dei-numeri
% alt: Retta dei numeri da meno 1 a 1 divisa in ottavi, con segnate le frazioni meno tre quarti, meno tre ottavi, un mezzo, due terzi e tre quarti
% svg: frazioni-sulla-retta-dei-numeri-be187290.svg 436x66
\begin{tikzpicture}
\draw[->] (-5.6,0) -- (5.8,0);
\draw (-5.0000,-0.08) -- (-5.0000,0.08);
\draw (-4.3750,-0.08) -- (-4.3750,0.08);
\draw (-3.7500,-0.08) -- (-3.7500,0.08);
\draw (-3.1250,-0.08) -- (-3.1250,0.08);
\draw (-2.5000,-0.08) -- (-2.5000,0.08);
\draw (-1.8750,-0.08) -- (-1.8750,0.08);
\draw (-1.2500,-0.08) -- (-1.2500,0.08);
\draw (-0.6250,-0.08) -- (-0.6250,0.08);
\draw (0.0000,-0.08) -- (0.0000,0.08);
\draw (0.6250,-0.08) -- (0.6250,0.08);
\draw (1.2500,-0.08) -- (1.2500,0.08);
\draw (1.8750,-0.08) -- (1.8750,0.08);
\draw (2.5000,-0.08) -- (2.5000,0.08);
\draw (3.1250,-0.08) -- (3.1250,0.08);
\draw (3.7500,-0.08) -- (3.7500,0.08);
\draw (4.3750,-0.08) -- (4.3750,0.08);
\draw (5.0000,-0.08) -- (5.0000,0.08);
\draw (-5,-0.18) -- (-5,0.18);
\draw (0,-0.18) -- (0,0.18);
\draw (5,-0.18) -- (5,0.18);
\node[below] at (-5,-0.2) {$-1$};
\node[below] at (0,-0.2) {$0$};
\node[below] at (5,-0.2) {$1$};
\fill (-3.75,0) circle (0.07); \node[above] at (-3.75,0.15) {$-\frac{3}{4}$};
\fill (-1.875,0) circle (0.07); \node[above] at (-1.875,0.15) {$-\frac{3}{8}$};
\fill (2.5,0) circle (0.07); \node[above] at (2.5,0.15) {$\frac{1}{2}$};
\fill (3.3333,0) circle (0.07); \node[above] at (3.3333,0.15) {$\frac{2}{3}$};
\fill (3.75,0) circle (0.07); \node[below] at (3.75,-0.2) {$\frac{3}{4}$};
\end{tikzpicture}
```

```ad-tip
Un confronto a colpo d'occhio
Prima di fare conti, confronta le frazioni con $1$ o con $\dfrac{1}{2}$. Una frazione positiva con il numeratore minore del denominatore è minore di $1$, per esempio $\dfrac{5}{6} < 1 < \dfrac{7}{6}$. Allo stesso modo $\dfrac{4}{9} < \dfrac{1}{2}$ (perché $4$ è meno della metà di $9$) e $\dfrac{5}{8} > \dfrac{1}{2}$, quindi $\dfrac{4}{9} < \dfrac{5}{8}$.
```
