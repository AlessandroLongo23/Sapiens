# Regressione e correlazione

Cinque studenti segnano quante ore hanno studiato matematica nella settimana prima della verifica e che voto hanno preso:

| studente | A | B | C | D | E |
|---|---|---|---|---|---|
| ore di studio $x_i$ | $1$ | $3$ | $5$ | $7$ | $9$ |
| voto $y_i$ | $4$ | $5$ | $7$ | $5$ | $9$ |

Chi ha studiato di più ha preso in genere un voto più alto, ma non sempre: D ha studiato $7$ ore e ha preso $5$. Per descrivere un legame di questo tipo tra due caratteri quantitativi servono un grafico per vederlo, una retta per fare delle stime e un numero, il coefficiente di correlazione, che dice quanto il legame è stretto.

Su ogni unità si osservano due caratteri quantitativi $X$ e $Y$, come nella lezione [Distribuzioni doppie](/materiale/scuola-superiore/matematica/statistica-bivariata/distribuzioni-doppie). I dati sono $n$ coppie $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$; $\bar{x}$ e $\bar{y}$ sono le medie aritmetiche dei due caratteri, $\sigma_x^2$ e $\sigma_y^2$ le varianze, $\sigma_x$ e $\sigma_y$ gli scarti quadratici medi, calcolati come in [Indici di variabilità](/materiale/scuola-superiore/matematica/statistica/indici-di-variabilita).

## Il diagramma a dispersione

Ogni coppia $(x_i, y_i)$ è un punto del [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio). Il grafico con tutti i punti si chiama **diagramma a dispersione**, o nuvola di punti. Sull'asse $x$ si mette il carattere da cui si vuole partire per stimare l'altro: qui le ore di studio, perché ci chiediamo che voto aspettarci da chi ha studiato un certo numero di ore.

```tikz
% nome: diagramma-dispersione-ore-studio-voto
% alt: Diagramma a dispersione di cinque studenti, con le ore di studio sull'asse orizzontale e il voto sull'asse verticale: i punti A (1, 4), B (3, 5), C (5, 7), D (7, 5) ed E (9, 9) salgono da sinistra a destra, con D più in basso degli altri
\begin{tikzpicture}[x=0.5cm, y=0.5cm]
\draw[gray!25, very thin] (0,0) grid (10,10);
\draw[->] (0,0) -- (10.9,0) node[right] {\small ore};
\draw[->] (0,0) -- (0,10.9) node[above] {\small voto};
\foreach \x in {1,3,5,7,9} \node[below] at (\x,0) {\footnotesize $\x$};
\foreach \y in {2,4,6,8,10} \node[left] at (0,\y) {\footnotesize $\y$};
\filldraw[fill=blue!30, draw=blue!60] (1,4) circle (2.4pt);
\node[above left] at (1,4) {\small$A$};
\filldraw[fill=blue!30, draw=blue!60] (3,5) circle (2.4pt);
\node[above left] at (3,5) {\small$B$};
\filldraw[fill=blue!30, draw=blue!60] (5,7) circle (2.4pt);
\node[above left] at (5,7) {\small$C$};
\filldraw[fill=blue!30, draw=blue!60] (7,5) circle (2.4pt);
\node[below right] at (7,5) {\small$D$};
\filldraw[fill=blue!30, draw=blue!60] (9,9) circle (2.4pt);
\node[above left] at (9,9) {\small$E$};
\end{tikzpicture}
```

La forma della nuvola dice già molto. Se i punti salgono da sinistra a destra, al crescere di $X$ cresce in genere anche $Y$; se scendono, al crescere di $X$ in genere $Y$ diminuisce; se sono sparsi senza una direzione, conoscere $X$ non aiuta a prevedere $Y$. Qui i punti salgono.

```ad-warning
I punti non si uniscono
Un diagramma a dispersione non è il grafico di una funzione: due studenti con le stesse ore di studio possono avere voti diversi, e allora due punti stanno uno sopra l'altro. Unire i punti con una spezzata suggerisce un andamento che i dati non hanno.
```

## La covarianza

Il punto che ha per coordinate le due medie, $G(\bar{x}, \bar{y})$, si chiama **baricentro** della nuvola. Per i cinque studenti:

$$
\begin{gathered}
\bar{x} = \frac{1 + 3 + 5 + 7 + 9}{5} = 5 \\
\bar{y} = \frac{4 + 5 + 7 + 5 + 9}{5} = 6
\end{gathered}
$$

quindi $G(5, 6)$. Di ogni punto si guardano i due scarti dalla media, $x_i - \bar{x}$ e $y_i - \bar{y}$, e si moltiplicano. Il segno del prodotto dice da che parte sta il punto rispetto al baricentro. Se il punto è in alto a destra di $G$ i due scarti sono positivi, se è in basso a sinistra sono negativi: in tutti e due i casi il prodotto è positivo. Se il punto è in alto a sinistra o in basso a destra i due scarti hanno segni opposti, e il prodotto è negativo.

```tikz
% nome: covarianza-segno-quadranti-baricentro
% alt: Il diagramma a dispersione delle ore di studio e dei voti diviso in quattro zone dalle rette x = 5 e y = 6, che si incontrano nel baricentro G: in alto a destra e in basso a sinistra il prodotto degli scarti è positivo, nelle altre due zone è negativo; A, B ed E stanno nelle zone positive, D in una negativa, C sulla retta x = 5
\begin{tikzpicture}[x=0.5cm, y=0.5cm]
\fill[blue!10] (5,6) rectangle (10,10);
\fill[blue!10] (0,0) rectangle (5,6);
\fill[orange!15] (0,6) rectangle (5,10);
\fill[orange!15] (5,0) rectangle (10,6);
\draw[gray!25, very thin] (0,0) grid (10,10);
\draw[->] (0,0) -- (10.9,0) node[right] {\small ore};
\draw[->] (0,0) -- (0,10.9) node[above] {\small voto};
\foreach \x in {1,3,5,7,9} \node[below] at (\x,0) {\footnotesize $\x$};
\foreach \y in {2,4,6,8,10} \node[left] at (0,\y) {\footnotesize $\y$};
\draw[dashed, gray] (5,0) -- (5,10.3) node[above] {\footnotesize $\bar{x} = 5$};
\draw[dashed, gray] (0,6) -- (10.3,6) node[right] {\footnotesize $\bar{y} = 6$};
\node at (8.9,7) {\small $+$};
\node at (1.2,1.6) {\small $+$};
\node at (1.2,8.8) {\small $-$};
\node at (8.9,1.6) {\small $-$};
\filldraw[fill=blue!30, draw=blue!60] (1,4) circle (2.4pt);
\node[above left] at (1,4) {\small $A$};
\filldraw[fill=blue!30, draw=blue!60] (3,5) circle (2.4pt);
\node[above left] at (3,5) {\small $B$};
\filldraw[fill=blue!30, draw=blue!60] (5,7) circle (2.4pt);
\filldraw[fill=blue!30, draw=blue!60] (7,5) circle (2.4pt);
\node[below right] at (7,5) {\small $D$};
\filldraw[fill=blue!30, draw=blue!60] (9,9) circle (2.4pt);
\node[above left] at (9,9) {\small $E$};
\fill (5,6) circle (2pt);
\node[below right] at (5,6) {\small $G$};
\node[above left] at (5,7) {\small $C$};
\end{tikzpicture}
```

La **covarianza** $\sigma_{xy}$ è la media aritmetica di questi prodotti:

$$
\begin{gathered}
p_i = (x_i - \bar{x})(y_i - \bar{y}) \\
\sigma_{xy} = \frac{p_1 + p_2 + \dots + p_n}{n}
\end{gathered}
$$

Si divide per $n$, come nella varianza. Per i cinque studenti:

| | $x_i$ | $y_i$ | $x_i - \bar{x}$ | $y_i - \bar{y}$ | $p_i$ |
|---|---|---|---|---|---|
| A | $1$ | $4$ | $-4$ | $-2$ | $8$ |
| B | $3$ | $5$ | $-2$ | $-1$ | $2$ |
| C | $5$ | $7$ | $0$ | $1$ | $0$ |
| D | $7$ | $5$ | $2$ | $-1$ | $-2$ |
| E | $9$ | $9$ | $4$ | $3$ | $12$ |
| somma | $25$ | $30$ | $0$ | $0$ | $20$ |

$$\sigma_{xy} = \frac{20}{5} = 4$$

Il segno della covarianza riassume la direzione della nuvola:

- $\sigma_{xy} > 0$: prevalgono i punti in alto a destra e in basso a sinistra di $G$, la nuvola sale. Si dice che tra $X$ e $Y$ c'è una correlazione positiva.
- $\sigma_{xy} < 0$: prevalgono i punti nelle altre due zone, la nuvola scende. La correlazione è negativa.
- $\sigma_{xy} = 0$: i prodotti positivi e quelli negativi si compensano.

Nell'esempio l'unico prodotto negativo è quello di D, che ha studiato più della media e ha preso meno della media.

Il valore della covarianza, invece, da solo dice poco, perché dipende dalle unità di misura. Se le ore si scrivono in minuti, tutti gli scarti $x_i - \bar{x}$ si moltiplicano per $60$ e la covarianza passa da $4$ a $240$, senza che il legame tra studio e voto sia cambiato. Per misurare quanto è stretto il legame serve il coefficiente di correlazione, più avanti.

```ad-warning
Il segno dei prodotti
Il prodotto di due scarti negativi è positivo: per A, $(-4) \cdot (-2) = 8$, non $-8$. Un errore di segno in un solo prodotto cambia la covarianza, e a volte il suo segno.
```

```ad-note
Un altro modo di calcolare la covarianza
La covarianza è anche uguale alla media dei prodotti $x_i y_i$ meno il prodotto delle medie:

$$\sigma_{xy} = \frac{x_1 y_1 + \dots + x_n y_n}{n} - \bar{x} \cdot \bar{y}$$

Per i cinque studenti $\dfrac{4 + 15 + 35 + 35 + 81}{5} - 5 \cdot 6 = 34 - 30 = 4$. Il motivo: sviluppando il prodotto, $p_i = x_i y_i - \bar{x} y_i - \bar{y} x_i + \bar{x}\bar{y}$. Facendo la media dei quattro termini su tutti i dati, il primo dà la media dei prodotti, il secondo e il terzo danno ciascuno $-\bar{x}\bar{y}$ e il quarto dà $+\bar{x}\bar{y}$: resta la media dei prodotti meno $\bar{x}\bar{y}$.
```

## La retta di regressione

Quando la nuvola ha una forma allungata, viene naturale riassumerla con una retta $y = mx + q$ (la forma esplicita di [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari)), da usare per stimare $Y$ quando si conosce $X$. Bisogna decidere quale, tra le tante che passano in mezzo ai punti.

Fissata una retta, per ogni dato $x_i$ essa dà un **valore stimato**, $m x_i + q$, in genere diverso dal valore osservato $y_i$. La differenza

$$e_i = y_i - (m x_i + q)$$

si chiama **residuo**: è positivo se il punto sta sopra la retta, negativo se sta sotto, e il suo valore assoluto è la distanza del punto dalla retta misurata in verticale. Una retta è tanto migliore quanto più i residui sono piccoli. Come per la varianza, per togliere il segno si elevano al quadrato: il **metodo dei minimi quadrati** sceglie la retta che rende minima la somma dei quadrati dei residui, $e_1^2 + e_2^2 + \dots + e_n^2$.

Si dimostra che questa retta esiste, è una sola (purché i valori $x_i$ non siano tutti uguali) e ha

$$m = \frac{\sigma_{xy}}{\sigma_x^2} \qquad q = \bar{y} - m\bar{x}$$

Si chiama **retta di regressione** di $Y$ rispetto a $X$, e $m$ è il coefficiente di regressione. La seconda formula dice che $\bar{y} = m\bar{x} + q$, cioè che la retta passa per il baricentro $G(\bar{x}, \bar{y})$. Per questo si può scrivere anche senza calcolare $q$, come retta per $G$ di coefficiente angolare $m$:

$$y - \bar{y} = m(x - \bar{x})$$

Per i cinque studenti serve ancora la varianza delle ore. I quadrati degli scarti $x_i - \bar{x}$ sono $16$, $4$, $0$, $4$, $16$:

$$
\begin{gathered}
\sigma_x^2 = \frac{40}{5} = 8 \\
m = \frac{4}{8} = 0{,}5 \\
q = 6 - 0{,}5 \cdot 5 = 3{,}5
\end{gathered}
$$

La retta di regressione è $y = 0{,}5x + 3{,}5$.

```tikz
% nome: retta-regressione-ore-studio-voto-residui
% alt: Il diagramma a dispersione delle ore di studio e dei voti con la retta di regressione y = 0,5x + 3,5, che passa per il baricentro G (5, 6) e per i punti A e B; segmenti verticali uniscono alla retta i punti C, D ed E e sono i loro residui: 1, meno 2 e 1
\begin{tikzpicture}[x=0.5cm, y=0.5cm]
\draw[gray!25, very thin] (0,0) grid (10,10);
\draw[->] (0,0) -- (10.9,0) node[right] {\small ore};
\draw[->] (0,0) -- (0,10.9) node[above] {\small voto};
\foreach \x in {1,3,5,7,9} \node[below] at (\x,0) {\footnotesize $\x$};
\foreach \y in {2,4,6,8,10} \node[left] at (0,\y) {\footnotesize $\y$};
\draw[thick, red!60] (0,3.5) -- (10,8.5);
\draw[very thick, orange!80] (5,7) -- (5,6);
\draw[very thick, orange!80] (7,5) -- (7,7);
\draw[very thick, orange!80] (9,9) -- (9,8);
\filldraw[fill=blue!30, draw=blue!60] (1,4) circle (2.4pt);
\node[above left] at (1,4) {\small $A$};
\filldraw[fill=blue!30, draw=blue!60] (3,5) circle (2.4pt);
\node[above left] at (3,5) {\small $B$};
\filldraw[fill=blue!30, draw=blue!60] (5,7) circle (2.4pt);
\node[above left] at (5,7) {\small $C$};
\filldraw[fill=blue!30, draw=blue!60] (7,5) circle (2.4pt);
\node[below right] at (7,5) {\small $D$};
\filldraw[fill=blue!30, draw=blue!60] (9,9) circle (2.4pt);
\node[above left] at (9,9) {\small $E$};
\fill (5,6) circle (2pt);
\node[below right] at (5,6) {\small $G$};
\node[red!60!black, below right] at (6.6,10.9) {\small $y = 0{,}5x + 3{,}5$};
\end{tikzpicture}
```
```grafico
% nome: retta-minimi-quadrati-cursori
% alt: I cinque punti delle ore di studio e dei voti con una retta y = mx + q che si muove con i cursori di m e di q; sotto il piano è scritta la somma S dei quadrati dei residui, che vale 16 per la retta y = 6 e scende a 6 per la retta di regressione
curva: y=mx+q | rosso
curva: A=(1;4) | nero
curva: B=(3;5) | nero
curva: C=(5;7) | nero
curva: D=(7;5) | nero
curva: E=(9;9) | nero
cursore: m = 0 da -1 a 2 passo 0,05
cursore: q = 6 da 0 a 8 passo 0,1
finestra: x da -1 a 11, y da -1 a 11
valore: S = 165m^2+5q^2+50mq-340m-60q+196
domanda: $S$ è la somma dei quadrati dei residui. Parti dalla retta orizzontale $y = 6$ e muovi $m$ e $q$ per rendere $S$ più piccola che puoi: a quali valori arrivi?
```

I valori stimati e i residui dei cinque studenti sono:

| | $x_i$ | $y_i$ | valore stimato | residuo $e_i$ | $e_i^2$ |
|---|---|---|---|---|---|
| A | $1$ | $4$ | $4$ | $0$ | $0$ |
| B | $3$ | $5$ | $5$ | $0$ | $0$ |
| C | $5$ | $7$ | $6$ | $1$ | $1$ |
| D | $7$ | $5$ | $7$ | $-2$ | $4$ |
| E | $9$ | $9$ | $8$ | $1$ | $1$ |
| somma | | | | $0$ | $6$ |

La somma dei quadrati dei residui è $6$, e nessun'altra retta fa di meglio: nel piano con i cursori $S$ parte da $16$ per la retta orizzontale $y = 6$ e scende fino a $6$ solo per $m = 0{,}5$ e $q = 3{,}5$. Per la retta che passa per A ed E, $y = 0{,}625x + 3{,}375$, i residui sono $0$, $-0{,}25$, $0{,}5$, $-2{,}75$, $0$ e la somma dei quadrati è $7{,}875$.

```ad-tip
Due controlli sulla retta
La retta di regressione passa per il baricentro: sostituendo $\bar{x}$ deve uscire $\bar{y}$, qui $0{,}5 \cdot 5 + 3{,}5 = 6$. E la somma dei residui è zero, come la somma degli scarti dalla media: $0 + 0 + 1 - 2 + 1 = 0$.
```

```ad-note
Da dove viene la formula di m
Per una retta che passa per $G$ il residuo è $e_i = (y_i - \bar{y}) - m(x_i - \bar{x})$. Elevando al quadrato e facendo la media su tutti i dati si ottiene

$$\frac{e_1^2 + \dots + e_n^2}{n} = \sigma_x^2 \, m^2 - 2\sigma_{xy} \, m + \sigma_y^2$$

Al variare di $m$ è un trinomio di secondo grado con il primo coefficiente positivo: il suo grafico è una [parabola](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/la-parabola) con la concavità verso l'alto, e il valore più piccolo si ha nel vertice, $m = \dfrac{2\sigma_{xy}}{2\sigma_x^2} = \dfrac{\sigma_{xy}}{\sigma_x^2}$. Che la retta migliore debba passare per $G$ qui non lo dimostriamo.
```

### Che cosa dicono m e q

Il coefficiente angolare $m$ dice di quanto varia in media $Y$ quando $X$ aumenta di una unità. Con $m = 0{,}5$, a ogni ora di studio in più corrisponde in media mezzo voto in più. Il segno di $m$ è quello della covarianza, perché $\sigma_x^2$ è positiva: retta crescente con correlazione positiva, decrescente con correlazione negativa.

Il termine noto $q$ è il valore stimato per $x = 0$: qui $3{,}5$, il voto che la retta assegna a chi non ha studiato. Ha senso solo se $x = 0$ è un valore vicino a quelli osservati.

### Stimare con la retta

Per stimare $Y$ per un valore di $X$ che non compare tra i dati si sostituisce quel valore nell'equazione. Per uno studente che ha studiato $6$ ore:

$$y = 0{,}5 \cdot 6 + 3{,}5 = 6{,}5$$

La stima è un valore medio, non una certezza: D, con $7$ ore, ha preso $2$ voti meno di quanto dice la retta.

```ad-warning
Fuori dai dati la retta non vale
La retta è stata costruita con ore di studio tra $1$ e $9$, e descrive i dati in quell'intervallo. Per $x = 20$ darebbe $y = 0{,}5 \cdot 20 + 3{,}5 = 13{,}5$, un voto che non esiste. Più ci si allontana dai valori osservati, meno la stima è affidabile.
```

## Il coefficiente di correlazione lineare

Per misurare quanto i punti sono vicini a una retta, senza dipendere dalle unità di misura, si divide la covarianza per i due scarti quadratici medi. Il **coefficiente di correlazione lineare** $r$, detto anche di Bravais-Pearson, è

$$r = \frac{\sigma_{xy}}{\sigma_x \cdot \sigma_y}$$

Si può calcolare quando $\sigma_x$ e $\sigma_y$ sono diversi da zero. Per i cinque studenti manca la varianza dei voti. I quadrati degli scarti $y_i - \bar{y}$ sono $4$, $1$, $1$, $1$, $9$:

$$
\begin{gathered}
\sigma_y^2 = \frac{16}{5} = 3{,}2 \\
r = \frac{4}{\sqrt{8 \cdot 3{,}2}} = \frac{4}{\sqrt{25{,}6}} \approx 0{,}79
\end{gathered}
$$

Le proprietà di $r$:

- È sempre compreso tra $-1$ e $1$: $-1 \leq r \leq 1$.
- Ha il segno della covarianza, e quindi di $m$: positivo se la nuvola sale, negativo se scende.
- $r = 1$ quando tutti i punti stanno su una retta crescente, $r = -1$ quando stanno tutti su una retta decrescente: la correlazione si dice perfetta.
- Più $r$ è vicino a $1$ o a $-1$, più i punti sono stretti attorno alla retta di regressione; più è vicino a $0$, più sono sparsi. Se $r = 0$ i due caratteri si dicono incorrelati.
- È un numero puro, senza unità di misura, e non cambia se si cambia l'unità di $X$ o di $Y$: con le ore scritte in minuti la covarianza diventa $240$, ma anche $\sigma_x$ si moltiplica per $60$, e $r$ resta $0{,}79$.

```tikz
% nome: coefficiente-correlazione-sei-nuvole
% alt: Sei diagrammi a dispersione: con r = 1 i punti stanno su una retta che sale, con r circa 0,9 le stanno vicini, con r circa 0,5 sono più sparsi, con r circa 0 non hanno una direzione, con r circa -0,9 stanno vicini a una retta che scende, con r = -1 stanno su una retta che scende
\begin{tikzpicture}[x=0.2cm, y=0.2cm]
\draw[->] (0,0) -- (10.6,0);
\draw[->] (0,0) -- (0,10.6);
\foreach \x/\y in {1/1.5, 1.9/2.3, 2.8/3.1, 3.7/3.9, 4.6/4.7, 5.5/5.5, 6.4/6.3, 7.3/7.1, 8.2/7.9, 9.1/8.7} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (5,-0.3) {\footnotesize $r = 1$};
\draw[->] (12.5,0) -- (23.1,0);
\draw[->] (12.5,0) -- (12.5,10.6);
\foreach \x/\y in {13.5/1.5, 14.5/1.5, 15.5/4, 16/4.5, 17/3, 17.5/6, 18/5, 18.5/7, 19/5.5, 20/8.5} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (17.5,-0.3) {\footnotesize $r \approx 0{,}9$};
\draw[->] (25,0) -- (35.6,0);
\draw[->] (25,0) -- (25,10.6);
\foreach \x/\y in {26/3.5, 27.5/5.5, 28.5/1.5, 29.5/2.5, 30/7.5, 30.5/6, 31/4, 31.5/8, 32.5/6, 33/6} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (30,-0.3) {\footnotesize $r \approx 0{,}5$};
\draw[->] (0,-15.5) -- (10.6,-15.5);
\draw[->] (0,-15.5) -- (0,-4.9);
\foreach \x/\y in {1/-8, 2/-8.5, 2.5/-13.5, 3.5/-14, 4/-14, 5/-11, 5.5/-8.5, 7/-6.5, 7.5/-11.5, 9/-12} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (5,-15.8) {\footnotesize $r \approx 0$};
\draw[->] (12.5,-15.5) -- (23.1,-15.5);
\draw[->] (12.5,-15.5) -- (12.5,-4.9);
\foreach \x/\y in {14/-6.5, 15/-9, 15.5/-7.5, 16.5/-9.5, 17/-11, 17.5/-9, 18/-10, 18.5/-10.5, 19/-12, 20.5/-12.5} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (17.5,-15.8) {\footnotesize $r \approx -0{,}9$};
\draw[->] (25,-15.5) -- (35.6,-15.5);
\draw[->] (25,-15.5) -- (25,-4.9);
\foreach \x/\y in {26/-7, 26.9/-7.8, 27.8/-8.6, 28.7/-9.4, 29.6/-10.2, 30.5/-11, 31.4/-11.8, 32.3/-12.6, 33.2/-13.4, 34.1/-14.2} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (1.8pt);
\node[below] at (30,-15.8) {\footnotesize $r = -1$};
\end{tikzpicture}
```
```grafico
% nome: correlazione-dispersione-attorno-alla-retta-cursore
% alt: I cinque punti delle ore di studio e dei voti con la retta di regressione y = 0,5x + 3,5; il cursore d allontana dalla retta i punti C, D ed E, mentre A e B restano sopra; la retta non cambia e sotto il piano è scritto r, che vale 1 per d = 0, circa 0,79 per d = 1 e circa 0,54 per d = 2
curva: y=\frac{x+7}{2} | rosso
curva: A=(1;4) | nero
curva: B=(3;5) | nero
curva: C=(5;6+d) | nero
curva: D=(7;7-2d) | nero
curva: E=(9;8+d) | nero
cursore: d = 1 da 0 a 2 passo 0,1
finestra: x da -1 a 11, y da -1 a 11
valore: r = \frac{5}{\sqrt{25+15d^2}}
domanda: Il cursore $d$ allontana C, D ed E dalla retta. Porta $d$ a $0$: quanto vale $r$? E la retta di regressione si è spostata?
```

Nel piano A e B stanno sulla retta, e i residui di C, D ed E sono $d$, $-2d$ e $d$: con $d = 1$ sono i dati dei cinque studenti. La retta di regressione è $y = 0{,}5x + 3{,}5$ per ogni valore di $d$; quello che cambia è $r$. Con $d = 0$ tutti i punti sono sulla retta e $r = 1$; con $d = 1$ si ha $r \approx 0{,}79$; con $d = 2$ si scende a $r \approx 0{,}54$. Due nuvole possono avere la stessa retta di regressione e correlazioni diverse: la retta dice dove passano i punti in media, $r$ dice quanto le stanno vicini.

Con $r \approx 0{,}79$ il legame tra ore di studio e voto dei cinque studenti è positivo e abbastanza stretto, ma lontano da una retta perfetta.

Con pochi dati, la retta e $r$ dipendono molto da ogni singolo punto. Nella figura E, che aveva preso $9$, prende invece $4$: la retta di regressione diventa orizzontale, $y = 5$.

```tikz
% nome: punto-anomalo-retta-regressione-orizzontale
% alt: Il diagramma a dispersione delle ore di studio e dei voti con la retta di regressione che sale; una freccia porta il punto E da (9, 9) a E' in (9, 4), e con E' al posto di E la retta di regressione è la retta orizzontale tratteggiata y = 5
\begin{tikzpicture}[x=0.5cm, y=0.5cm]
\draw[gray!25, very thin] (0,0) grid (10,10);
\draw[->] (0,0) -- (10.9,0) node[right] {\small ore};
\draw[->] (0,0) -- (0,10.9) node[above] {\small voto};
\foreach \x in {1,3,5,7,9} \node[below] at (\x,0) {\footnotesize $\x$};
\foreach \y in {2,4,6,8,10} \node[left] at (0,\y) {\footnotesize $\y$};
\draw[thick, red!60] (0,3.5) -- (10,8.5);
\draw[thick, dashed, red!60] (0,5) -- (10,5);
\draw[->, gray] (9,8.6) -- (9,4.5);
\filldraw[fill=blue!30, draw=blue!60] (1,4) circle (2.4pt);
\node[above left] at (1,4) {\small $A$};
\filldraw[fill=blue!30, draw=blue!60] (3,5) circle (2.4pt);
\node[above left] at (3,5) {\small $B$};
\filldraw[fill=blue!30, draw=blue!60] (5,7) circle (2.4pt);
\node[above left] at (5,7) {\small $C$};
\filldraw[fill=blue!30, draw=blue!60] (7,5) circle (2.4pt);
\node[below right] at (7,5) {\small $D$};
\filldraw[fill=blue!30, draw=blue!60] (9,9) circle (2.4pt);
\node[above left] at (9,9) {\small $E$};
\draw[blue!60, thick] (9,4) circle (2.4pt);
\node[below right] at (9,4) {\small $E'$};
\node[red!60!black, below] at (5,5) {\small $y = 5$};
\end{tikzpicture}
```
```grafico
% nome: punto-anomalo-retta-e-correlazione-cursore
% alt: I punti A, B, C e D delle ore di studio e dei voti restano fermi, mentre il voto k del punto E, che ha 9 ore di studio, si sceglie con un cursore da 0 a 10; la retta di regressione e i valori di m e di r scritti sotto il piano seguono il cursore: per k = 9 m vale 0,5 e r circa 0,79, per k = 4 la retta è orizzontale e r vale 0, per k = 0 r vale circa -0,49
curva: y=\frac{k-4}{10}x+\frac{62-3k}{10} | rosso
curva: A=(1;4) | nero
curva: B=(3;5) | nero
curva: C=(5;7) | nero
curva: D=(7;5) | nero
curva: E=(9;k) | nero
cursore: k = 9 da 0 a 10 passo 0,5
finestra: x da -1 a 11, y da -1 a 11
valore: m = \frac{k-4}{10}
valore: r = \frac{k-4}{\sqrt{2k^2-21k+67}}
domanda: Il cursore $k$ è il voto di E. Per quale voto la retta di regressione è orizzontale, e quanto vale $r$ in quel caso? Per quali voti $r$ è negativo?
```

La retta è orizzontale per $k = 4$, e lì $r = 0$: con quel voto la covarianza si annulla. Sotto il $4$ la covarianza diventa negativa, e con lei $m$ e $r$, fino a $r \approx -0{,}49$ per $k = 0$. Un solo studente su cinque capovolge la conclusione: una stima fatta su pochi dati va presa con cautela, e un punto molto lontano dagli altri va sempre controllato.

```ad-note
Perché r sta tra -1 e 1
Per la retta di regressione la media dei quadrati dei residui vale $\sigma_y^2 (1 - r^2)$: si ottiene mettendo $m = \dfrac{\sigma_{xy}}{\sigma_x^2}$ nel trinomio della nota sulla formula di $m$. Una media di quadrati non è mai negativa, quindi $1 - r^2 \geq 0$, cioè $-1 \leq r \leq 1$. Ed è zero, con tutti i punti sulla retta, solo se $r^2 = 1$. Per i cinque studenti $r^2 = \dfrac{16}{25{,}6} = 0{,}625$ e $3{,}2 \cdot (1 - 0{,}625) = 1{,}2$, che è proprio $\dfrac{6}{5}$.
```

```ad-warning
Correlazione non vuol dire causa
In una località di mare, nei giorni in cui si vendono più gelati ci sono anche più scottature. La correlazione è positiva, ma i gelati non scottano: tutte e due le cose aumentano quando c'è il sole. Un valore di $r$ vicino a $1$ dice che due caratteri variano insieme, non che uno è la causa dell'altro.
```

## Il procedimento

1. Calcola le medie $\bar{x}$ e $\bar{y}$.
2. Costruisci la tabella con gli scarti $x_i - \bar{x}$ e $y_i - \bar{y}$, i loro prodotti e i loro quadrati. Le somme delle due colonne degli scarti devono fare zero.
3. Dividi per $n$ le somme delle ultime tre colonne: ottieni $\sigma_{xy}$, $\sigma_x^2$ e $\sigma_y^2$.
4. Per la retta di regressione: $m = \dfrac{\sigma_{xy}}{\sigma_x^2}$ e $q = \bar{y} - m\bar{x}$.
5. Per la correlazione: $r = \dfrac{\sigma_{xy}}{\sqrt{\sigma_x^2 \cdot \sigma_y^2}}$. Moltiplicando prima le due varianze si fa una radice sola e si arrotonda una volta, alla fine.

## Esempi svolti

```ad-example
Esempio 1: altezza e numero di scarpe
Di otto persone si conoscono l'altezza $x$ in centimetri e il numero di scarpe $y$. Trova la retta di regressione e il coefficiente di correlazione, poi stima il numero di scarpe di una persona alta $174$ cm.

Le medie sono $\bar{x} = \dfrac{1360}{8} = 170$ e $\bar{y} = \dfrac{320}{8} = 40$. Nella tabella $a_i = x_i - \bar{x}$ e $b_i = y_i - \bar{y}$ sono gli scarti.

| $x_i$ | $y_i$ | $a_i$ | $b_i$ | $a_i b_i$ | $a_i^2$ | $b_i^2$ |
|---|---|---|---|---|---|---|
| $160$ | $36$ | $-10$ | $-4$ | $40$ | $100$ | $16$ |
| $162$ | $38$ | $-8$ | $-2$ | $16$ | $64$ | $4$ |
| $166$ | $39$ | $-4$ | $-1$ | $4$ | $16$ | $1$ |
| $167$ | $40$ | $-3$ | $0$ | $0$ | $9$ | $0$ |
| $171$ | $39$ | $1$ | $-1$ | $-1$ | $1$ | $1$ |
| $175$ | $43$ | $5$ | $3$ | $15$ | $25$ | $9$ |
| $178$ | $43$ | $8$ | $3$ | $24$ | $64$ | $9$ |
| $181$ | $42$ | $11$ | $2$ | $22$ | $121$ | $4$ |
| somma | | $0$ | $0$ | $120$ | $400$ | $44$ |

$$
\begin{gathered}
\sigma_{xy} = \frac{120}{8} = 15 \qquad \sigma_x^2 = \frac{400}{8} = 50 \\
\sigma_y^2 = \frac{44}{8} = 5{,}5
\end{gathered}
$$

La retta di regressione ha

$$
\begin{gathered}
m = \frac{15}{50} = 0{,}3 \\
q = 40 - 0{,}3 \cdot 170 = -11
\end{gathered}
$$

cioè $y = 0{,}3x - 11$: in media, ogni centimetro in più di altezza corrisponde a $0{,}3$ numeri di scarpe in più. Il coefficiente di correlazione è

$$r = \frac{15}{\sqrt{50 \cdot 5{,}5}} = \frac{15}{\sqrt{275}} \approx 0{,}90$$

Per una persona alta $174$ cm la stima è $y = 0{,}3 \cdot 174 - 11 = 41{,}2$, cioè circa il numero $41$.

```tikz
% nome: retta-regressione-altezza-numero-scarpe
% alt: Diagramma a dispersione di otto persone, con l'altezza in centimetri da 160 a 181 e il numero di scarpe da 36 a 43: i punti salgono attorno alla retta di regressione y = 0,3x - 11, che passa per il baricentro G (170, 40)
\begin{tikzpicture}[x=0.21cm, y=0.42cm]
\draw[->] (155,35) -- (187,35) node[right] {\small cm};
\draw[->] (155,35) -- (155,45.8) node[above] {\small numero};
\foreach \x in {160,165,...,185} \draw (\x,35.12) -- (\x,34.88) node[below] {\footnotesize $\x$};
\foreach \y in {36,38,...,44} \draw (155.25,\y) -- (154.75,\y) node[left] {\footnotesize $\y$};
\draw[thick, red!60] (157,36.1) -- (184,44.2);
\foreach \x/\y in {160/36, 162/38, 166/39, 167/40, 171/39, 175/43, 178/43, 181/42} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (2.2pt);
\fill (170,40) circle (2pt);
\node[below right] at (170,40) {\small $G$};
\node[red!60!black, left] at (181,45) {\small $y = 0{,}3x - 11$};
\end{tikzpicture}
```

Qui $q = -11$ non ha alcun significato: sarebbe il numero di scarpe di una persona alta $0$ cm, lontanissimo dai dati.
```

```ad-example
Esempio 2: correlazione negativa e una stima da non fare
Per cinque auto usate dello stesso modello si conoscono l'età $x$ in anni e il prezzo $y$ in migliaia di euro. Trova la retta di regressione e $r$; stima il prezzo di un'auto di $6$ anni e di una di $15$ anni.

Le medie sono $\bar{x} = \dfrac{20}{5} = 4$ e $\bar{y} = \dfrac{55}{5} = 11$. Con $a_i$ e $b_i$ gli scarti, come nell'esempio 1:

| $x_i$ | $y_i$ | $a_i$ | $b_i$ | $a_i b_i$ | $a_i^2$ | $b_i^2$ |
|---|---|---|---|---|---|---|
| $1$ | $15$ | $-3$ | $4$ | $-12$ | $9$ | $16$ |
| $2$ | $14$ | $-2$ | $3$ | $-6$ | $4$ | $9$ |
| $4$ | $10$ | $0$ | $-1$ | $0$ | $0$ | $1$ |
| $5$ | $9$ | $1$ | $-2$ | $-2$ | $1$ | $4$ |
| $8$ | $7$ | $4$ | $-4$ | $-16$ | $16$ | $16$ |
| somma | | $0$ | $0$ | $-36$ | $30$ | $46$ |

$$
\begin{gathered}
\sigma_{xy} = \frac{-36}{5} = -7{,}2 \qquad \sigma_x^2 = \frac{30}{5} = 6 \\
\sigma_y^2 = \frac{46}{5} = 9{,}2
\end{gathered}
$$

$$
\begin{gathered}
m = \frac{-7{,}2}{6} = -1{,}2 \\
q = 11 - (-1{,}2) \cdot 4 = 15{,}8 \\
r = \frac{-7{,}2}{\sqrt{6 \cdot 9{,}2}} = \frac{-7{,}2}{\sqrt{55{,}2}} \approx -0{,}97
\end{gathered}
$$

La retta è $y = -1{,}2x + 15{,}8$: ogni anno in più toglie in media $1200$ euro al prezzo.

Un'auto di $6$ anni sta tra i dati osservati, e la stima è $y = -1{,}2 \cdot 6 + 15{,}8 = 8{,}6$, cioè $8600$ euro. Per un'auto di $15$ anni la retta darebbe $y = -1{,}2 \cdot 15 + 15{,}8 = -2{,}2$, un prezzo negativo: $15$ anni sono molto fuori dai dati, che arrivano a $8$, e lì la retta non descrive più niente.

```tikz
% nome: retta-regressione-eta-prezzo-auto-estrapolazione
% alt: Diagramma a dispersione di cinque auto usate, con l'età in anni e il prezzo in migliaia di euro: i punti scendono lungo la retta di regressione y = -1,2x + 15,8; il prolungamento tratteggiato della retta va sotto l'asse orizzontale e a 15 anni dà un prezzo negativo, meno 2,2
\begin{tikzpicture}[x=0.42cm, y=0.24cm]
\draw[->] (0,0) -- (16,0) node[right] {\small anni};
\draw[->] (0,-3) -- (0,18.5) node[above] {\small migliaia di euro};
\foreach \x in {2,4,...,14} \draw (\x,0.25) -- (\x,-0.25);
\foreach \x in {2,4,6,8,10,12} \node[below] at (\x,-0.25) {\footnotesize $\x$};
\foreach \y in {4,8,12,16} \draw (0.12,\y) -- (-0.12,\y) node[left] {\footnotesize $\y$};
\draw[thick, red!60] (1,14.6) -- (8,6.2);
\draw[thick, dashed, red!60] (0,15.8) -- (1,14.6);
\draw[thick, dashed, red!60] (8,6.2) -- (15,-2.2);
\foreach \x/\y in {1/15, 2/14, 4/10, 5/9, 8/7} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (2.2pt);
\fill (15,-2.2) circle (2pt);
\node[left] at (14.6,-2.6) {\footnotesize $-2{,}2$};
\node[red!60!black, right] at (3.2,14.6) {\small $y = -1{,}2x + 15{,}8$};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: nessun legame, con la formula dei prodotti
Di cinque studenti si conoscono il numero di scarpe $x$ e il voto di italiano $y$: le coppie sono $(38, 5)$, $(39, 7)$, $(40, 6)$, $(41, 8)$, $(42, 4)$. Calcola $r$.

Le medie sono $\bar{x} = 40$ e $\bar{y} = 6$. Questa volta usiamo la formula con la media dei prodotti, e la stessa per le varianze (media dei quadrati meno quadrato della media):

| $x_i$ | $y_i$ | $x_i y_i$ | $x_i^2$ | $y_i^2$ |
|---|---|---|---|---|
| $38$ | $5$ | $190$ | $1444$ | $25$ |
| $39$ | $7$ | $273$ | $1521$ | $49$ |
| $40$ | $6$ | $240$ | $1600$ | $36$ |
| $41$ | $8$ | $328$ | $1681$ | $64$ |
| $42$ | $4$ | $168$ | $1764$ | $16$ |
| somma | | $1199$ | $8010$ | $190$ |

$$
\begin{gathered}
\sigma_{xy} = \frac{1199}{5} - 40 \cdot 6 = 239{,}8 - 240 = -0{,}2 \\
\sigma_x^2 = \frac{8010}{5} - 40^2 = 1602 - 1600 = 2 \\
\sigma_y^2 = \frac{190}{5} - 6^2 = 38 - 36 = 2
\end{gathered}
$$

$$r = \frac{-0{,}2}{\sqrt{2 \cdot 2}} = \frac{-0{,}2}{2} = -0{,}1$$

Il coefficiente è vicino a zero: tra numero di scarpe e voto di italiano non c'è un legame lineare.
```

```ad-example
Esempio 4: r = 0 con un legame evidente
Una palla è lanciata verso l'alto a $20$ m/s. Senza la resistenza dell'aria e con $g = 10$ m/s², dopo $0$, $1$, $2$, $3$, $4$ secondi si trova a $0$, $15$, $20$, $15$, $0$ metri di altezza. Calcola $r$ tra il tempo $x$ e l'altezza $y$.

Le medie sono $\bar{x} = 2$ e $\bar{y} = 10$. Gli scarti di $x$ sono $-2$, $-1$, $0$, $1$, $2$, quelli di $y$ sono $-10$, $5$, $10$, $5$, $-10$, e i prodotti

$$20 - 5 + 0 + 5 - 20 = 0$$

Quindi $\sigma_{xy} = 0$ e $r = 0$: la retta di regressione ha $m = 0$ ed è la retta orizzontale $y = 10$.

```tikz
% nome: correlazione-nulla-punti-su-parabola
% alt: Cinque punti disposti ad arco, (0, 0), (1, 15), (2, 20), (3, 15) e (4, 0): l'altezza della palla sale e poi scende; la retta di regressione è la retta orizzontale y = 10 e non segue l'andamento dei punti
\begin{tikzpicture}[x=1.1cm, y=0.2cm]
\draw[->] (0,0) -- (4.7,0) node[right] {\small tempo (s)};
\draw[->] (0,0) -- (0,23.5) node[above] {\small altezza (m)};
\foreach \x in {1,2,3,4} \draw (\x,0.5) -- (\x,-0.5) node[below] {\footnotesize $\x$};
\foreach \y in {5,10,15,20} \draw (0.07,\y) -- (-0.07,\y) node[left] {\footnotesize $\y$};
\draw[thick, red!60] (0,10) -- (4.4,10);
\node[red!60!black, above] at (3.9,10) {\small $y = 10$};
\foreach \x/\y in {0/0, 1/15, 2/20, 3/15, 4/0} \filldraw[fill=blue!30, draw=blue!60] (\x,\y) circle (2.4pt);
\end{tikzpicture}
```

Eppure l'altezza dipende dal tempo in modo evidente: la palla sale e poi scende, e i punti stanno su un arco. I prodotti positivi e quelli negativi si compensano esattamente.
```

```ad-warning
r = 0 non vuol dire nessun legame
Il coefficiente $r$ misura solo quanto i punti sono vicini a una retta. Se $r$ è vicino a zero non c'è un legame lineare, ma può essercene uno di altro tipo, come nell'esempio 4. Per questo prima di calcolare conviene sempre guardare il diagramma a dispersione.
```

```ad-example
Esempio 5: dagli indici alla retta
Un chiosco registra per $30$ giorni la temperatura massima $x$ in gradi e il numero $y$ di gelati venduti. Dai dati risulta $\bar{x} = 28$, $\bar{y} = 150$, $\sigma_x = 4$, $\sigma_y = 30$, $\sigma_{xy} = 108$. Trova la retta di regressione e $r$, e stima le vendite in un giorno con $32$ gradi.

Attenzione: sono dati gli scarti quadratici medi, non le varianze. Per $m$ serve $\sigma_x^2 = 4^2 = 16$:

$$
\begin{gathered}
m = \frac{108}{16} = 6{,}75 \\
q = 150 - 6{,}75 \cdot 28 = -39
\end{gathered}
$$

La retta è $y = 6{,}75x - 39$. Per $r$ si usano invece $\sigma_x$ e $\sigma_y$:

$$r = \frac{108}{4 \cdot 30} = \frac{108}{120} = 0{,}9$$

Con $32$ gradi la stima è $y = 6{,}75 \cdot 32 - 39 = 177$ gelati.
```

```ad-warning
Varianza in m, scarti quadratici medi in r
Nella formula di $m$ al denominatore c'è la varianza $\sigma_x^2$; nella formula di $r$ c'è il prodotto dei due scarti quadratici medi $\sigma_x \cdot \sigma_y$. Scambiarli è l'errore più comune: nell'esempio 5, dividendo $108$ per $4$ si troverebbe $m = 27$.
```
