# Iperbole equilatera e funzione omografica

Tra tutte le iperboli ce n'è una famiglia speciale, quella in cui i due semiassi sono uguali. Sono le iperboli che incontri più spesso fuori dalla geometria: il grafico della [proporzionalità inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa) $y = \dfrac{k}{x}$ è una di loro, e lo è anche il grafico di ogni funzione del tipo $y = \dfrac{ax + b}{cx + d}$, che si disegna in pochi passi conoscendo due rette e un punto.

La lezione continua quella sull'[iperbole](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole), da cui prende vertici, fuochi, asintoti ed eccentricità.

## L'iperbole equilatera

Un'iperbole si dice **equilatera** quando ha i semiassi uguali, $a = b$. Mettendo $b = a$ nell'equazione canonica $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = 1$ e moltiplicando per $a^2$ si ottiene

$$x^2 - y^2 = a^2$$

Tutto quello che vale per l'iperbole si semplifica:

- i vertici reali sono $A_1(-a, 0)$ e $A_2(a, 0)$;
- gli asintoti $y = \pm\dfrac{b}{a}x$ diventano $y = x$ e $y = -x$, le bisettrici dei quadranti;
- la distanza focale è $2c$ con $c = \sqrt{a^2 + a^2} = a\sqrt{2}$, e i fuochi sono $F_1(-a\sqrt{2}, 0)$ e $F_2(a\sqrt{2}, 0)$;
- l'eccentricità è $e = \dfrac{c}{a} = \sqrt{2}$, la stessa per ogni iperbole equilatera.

I due asintoti hanno coefficienti angolari $1$ e $-1$, con prodotto $-1$: sono [perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari). Il rettangolo che serve a disegnare l'iperbole è un quadrato.

Con i fuochi sull'asse $y$ l'equazione è $x^2 - y^2 = -a^2$: i vertici reali sono $(0, \pm a)$, i fuochi $(0, \pm a\sqrt{2})$, e gli asintoti sono ancora $y = \pm x$.

```ad-example
Esempio 1: vertici e fuochi di due iperboli equilatere
Trova vertici, fuochi e asintoti di $x^2 - y^2 = 9$ e di $x^2 - y^2 = -4$.

Nella prima $a^2 = 9$, quindi $a = 3$, e il secondo membro è positivo: i fuochi sono sull'asse $x$. I vertici reali sono $(\pm 3, 0)$ e, poiché $c = 3\sqrt{2}$, i fuochi sono $(\pm 3\sqrt{2}, 0)$.

Nella seconda $a^2 = 4$, quindi $a = 2$, e il secondo membro è negativo: i fuochi sono sull'asse $y$. I vertici reali sono $(0, \pm 2)$ e i fuochi $(0, \pm 2\sqrt{2})$.

Per tutte e due gli asintoti sono $y = x$ e $y = -x$.

```tikz
% nome: iperbole-equilatera-riferita-agli-assi
% alt: L'iperbole equilatera x al quadrato meno y al quadrato uguale a 9, con i vertici A1 (-3, 0) e A2 (3, 0), i fuochi F1 e F2 sull'asse x a distanza 3 radice di 2 dal centro, il quadrato tratteggiato di lato 6 e gli asintoti y = x e y = -x, perpendicolari
% svg: iperbole-equilatera-riferita-agli-assi-ed2d4eab.svg 259x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-6) grid (7,6);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, gray] (-3,-3) rectangle (3,3);
\draw[dashed, thick, orange!70] (-6,-6) -- (6,6);
\draw[dashed, thick, orange!70] (-6,6) -- (6,-6);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/9)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/9)}, \x);
\foreach \x/\y in {-3/0, 3/0, -4.243/0, 4.243/0} \fill (\x,\y) circle (0.15);
\node[below left] at (-3,0) {$A_1$};
\node[below right] at (3,0) {$A_2$};
\node[below] at (-4.9,0) {$F_1$};
\node[below] at (5,0) {$F_2$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-equilatera-secondo-membro-cursore
% alt: La curva x² - y² = k con il cursore k, da -9 a 9, e gli asintoti y = x e y = -x tratteggiati: con k positivo i rami stanno a destra e a sinistra e i fuochi sull'asse x, con k negativo sopra e sotto e i fuochi sull'asse y, con k uguale a zero restano le due rette degli asintoti
curva: x^2-y^2=k
curva: y=x | tratteggiata | grigio
curva: y=-x | tratteggiata | grigio
cursore: k = 9 da -9 a 9 passo 0,1
finestra: x da -8 a 8, y da -7 a 7
valore: a = \sqrt{\left|k\right|}
valore: c = \sqrt{2\left|k\right|}
domanda: Abbassa $k$ da $9$ verso $0$: che cosa fanno i vertici? Che cosa resta per $k = 0$? E dove stanno i rami quando $k$ è negativo?
```

Quando $k$ scende verso $0$ il semiasse $a = \sqrt{k}$ diminuisce: i vertici si avvicinano al centro e i rami si stringono contro gli asintoti. Per $k = 0$ l'equazione è $x^2 - y^2 = 0$, cioè $(x - y)(x + y) = 0$: restano le due rette $y = x$ e $y = -x$, gli asintoti stessi, e non c'è più un'iperbole. Con $k$ negativo i rami stanno sopra e sotto, e i fuochi sull'asse $y$.
```

## L'iperbole equilatera riferita agli asintoti

### Dall'equazione x² − y² = a² a xy = k

Gli asintoti di un'iperbole equilatera sono perpendicolari, quindi si possono usare come assi cartesiani al posto degli assi di simmetria. Per trovare l'equazione nel nuovo riferimento serve una proprietà che non dipende dagli assi scelti.

Scrivi $x^2 - y^2 = a^2$ come $(x - y)(x + y) = a^2$. Con la formula della [distanza di un punto da una retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta), le distanze di $P(x, y)$ dai due asintoti $x - y = 0$ e $x + y = 0$ sono

$$d_1 = \frac{|x - y|}{\sqrt{2}} \qquad d_2 = \frac{|x + y|}{\sqrt{2}}$$

Il loro prodotto è $\dfrac{|x^2 - y^2|}{2}$, che per i punti dell'iperbole vale $\dfrac{a^2}{2}$: in un'iperbole equilatera il prodotto delle distanze di un punto dai due asintoti è costante.

Prendi ora gli asintoti come assi. Le distanze di un punto $(x, y)$ dai due assi sono $|y|$ e $|x|$, quindi la proprietà diventa $|xy| = \dfrac{a^2}{2}$. Chiamando $k$ il valore costante del prodotto $xy$, l'equazione dell'**iperbole equilatera riferita agli asintoti** è

$$xy = k \qquad \text{con } k \neq 0 \text{ e } |k| = \frac{a^2}{2}$$

Poiché $x$ non può essere zero, l'equazione si scrive anche $y = \dfrac{k}{x}$: è la proporzionalità inversa, con la costante $k$ che può essere anche negativa.

### Rami, vertici e fuochi

Il segno di $k$ dice dove stanno i rami:

- se $k > 0$, $x$ e $y$ hanno lo stesso segno: i rami stanno nel primo e nel terzo quadrante, e l'asse trasverso è sulla retta $y = x$;
- se $k < 0$, $x$ e $y$ hanno segni opposti: i rami stanno nel secondo e nel quarto quadrante, e l'asse trasverso è sulla retta $y = -x$.

Gli asintoti sono gli assi cartesiani. In $y = \dfrac{k}{x}$, quando $|x|$ cresce, $|y|$ diventa piccolo quanto si vuole ma non è mai zero: la curva si accosta all'asse $x$ senza toccarlo. Lo stesso succede con l'asse $y$ quando $x$ si avvicina a zero.

I vertici sono i punti in cui l'iperbole incontra l'asse trasverso. Con $k > 0$ metti $y = x$ in $xy = k$: ottieni $x^2 = k$, e i vertici sono

$$V_1(-\sqrt{k}, -\sqrt{k}) \qquad V_2(\sqrt{k}, \sqrt{k})$$

La distanza di $V_2$ dall'origine è il semiasse: $a = \sqrt{k + k} = \sqrt{2k}$, in accordo con $k = \dfrac{a^2}{2}$. I fuochi stanno sulla stessa retta a distanza $c = a\sqrt{2} = 2\sqrt{k}$ dall'origine:

$$F_1(-\sqrt{2k}, -\sqrt{2k}) \qquad F_2(\sqrt{2k}, \sqrt{2k})$$

Con $k < 0$ fai lo stesso con $y = -x$ e con $|k|$ al posto di $k$: i vertici sono $(-\sqrt{|k|}, \sqrt{|k|})$ e $(\sqrt{|k|}, -\sqrt{|k|})$, i fuochi $(-\sqrt{2|k|}, \sqrt{2|k|})$ e $(\sqrt{2|k|}, -\sqrt{2|k|})$.

```ad-example
Esempio 2: k positivo
Trova vertici, semiasse e fuochi dell'iperbole $xy = 4$.

Qui $k = 4$ è positivo: i rami sono nel primo e nel terzo quadrante. Con $\sqrt{k} = 2$ i vertici sono $V_1(-2, -2)$ e $V_2(2, 2)$. Il semiasse è $a = \sqrt{2 \cdot 4} = 2\sqrt{2}$, e $c = 2\sqrt{4} = 4$. Con $\sqrt{2k} = 2\sqrt{2}$ i fuochi sono $F_1(-2\sqrt{2}, -2\sqrt{2})$ e $F_2(2\sqrt{2}, 2\sqrt{2})$.

Per disegnarla aggiungi qualche punto: $(1, 4)$, $(4, 1)$, $\Big(\dfrac{1}{2}, 8\Big)$ e i loro simmetrici rispetto all'origine.

```tikz
% nome: iperbole-equilatera-xy-uguale-4
% alt: L'iperbole equilatera xy = 4, con i rami nel primo e nel terzo quadrante che si accostano agli assi cartesiani, i vertici V1 (-2, -2) e V2 (2, 2) e i fuochi F1 e F2 sulla retta y = x tratteggiata, e i punti (1, 4) e (4, 1)
% svg: iperbole-equilatera-xy-uguale-4-07d866de.svg 259x259
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-7) grid (7,7);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-7.3) -- (0,7.7) node[above] {$y$};
\draw[dashed, gray] (-6.5,-6.5) -- (6.5,6.5);
\draw[thick, blue!60, domain=0.58:7, samples=80, smooth] plot (\x, {4/\x});
\draw[thick, blue!60, domain=0.58:7, samples=80, smooth] plot (-\x, {-4/\x});
\foreach \x/\y in {2/2, -2/-2, 2.828/2.828, -2.828/-2.828, 1/4, 4/1} \fill (\x,\y) circle (0.15);
\node[below left] at (2.1,2) {$V_2$};
\node[above right] at (-2.1,-2) {$V_1$};
\node[right] at (3,3) {$F_2$};
\node[left] at (-3,-3) {$F_1$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-equilatera-xy-k-cursore
% alt: L'iperbole equilatera xy = k con il cursore k, da -9 a 9: con k positivo i rami sono nel primo e nel terzo quadrante, con k negativo nel secondo e nel quarto, più k è vicino a zero più i rami sono vicini agli assi, e per k uguale a zero restano i due assi
curva: xy=k
cursore: k = 4 da -9 a 9 passo 0,1
finestra: x da -8 a 8, y da -7 a 7
valore: a = \sqrt{2\left|k\right|}
domanda: Porta $k$ sotto zero: in quali quadranti passano i rami? Che cosa fanno i vertici quando $k$ si avvicina a $0$, e che cosa resta per $k = 0$?
```

Con $k$ negativo i rami passano nel secondo e nel quarto quadrante. Quando $k$ si avvicina a $0$ il semiasse $a = \sqrt{2|k|}$ diminuisce e i vertici vanno verso l'origine. Per $k = 0$ l'equazione $xy = 0$ è vera quando $x = 0$ oppure $y = 0$: restano i due assi, cioè gli asintoti, ed è per questo che nella definizione si chiede $k \neq 0$.
```

```ad-example
Esempio 3: k negativo
Trova vertici e fuochi dell'iperbole $xy = -9$.

Qui $k = -9$ è negativo: i rami sono nel secondo e nel quarto quadrante, e l'asse trasverso sta sulla retta $y = -x$. Con $\sqrt{|k|} = 3$ i vertici sono $V_1(-3, 3)$ e $V_2(3, -3)$. Il semiasse è $a = \sqrt{2 \cdot 9} = 3\sqrt{2}$ e, con $\sqrt{2|k|} = 3\sqrt{2}$, i fuochi sono $F_1(-3\sqrt{2}, 3\sqrt{2})$ e $F_2(3\sqrt{2}, -3\sqrt{2})$.

```tikz
% nome: iperbole-equilatera-xy-uguale-meno-9
% alt: L'iperbole equilatera xy = -9, con i rami nel secondo e nel quarto quadrante, i vertici V1 (-3, 3) e V2 (3, -3) e i fuochi F1 e F2 sulla retta y = -x tratteggiata
% svg: iperbole-equilatera-xy-uguale-meno-9-53ee6740.svg 259x259
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-7) grid (7,7);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-7.3) -- (0,7.7) node[above] {$y$};
\draw[dashed, gray] (-6.5,6.5) -- (6.5,-6.5);
\draw[thick, blue!60, domain=1.29:7, samples=80, smooth] plot (\x, {-9/\x});
\draw[thick, blue!60, domain=1.29:7, samples=80, smooth] plot (-\x, {9/\x});
\foreach \x/\y in {3/-3, -3/3, 4.243/-4.243, -4.243/4.243} \fill (\x,\y) circle (0.15);
\node[above left] at (3.1,-3) {$V_2$};
\node[below right] at (-3.1,3) {$V_1$};
\node[right] at (4.4,-4.4) {$F_2$};
\node[left] at (-4.4,4.4) {$F_1$};
\end{tikzpicture}
```
```

```ad-warning
In xy = k il semiasse non è k
Per $xy = 4$ i vertici non sono $(\pm 4, 0)$: l'iperbole non incontra gli assi, che sono i suoi asintoti. I vertici stanno sulla bisettrice, in $(2, 2)$ e $(-2, -2)$, e il semiasse è $a = \sqrt{2k} = 2\sqrt{2}$.
```

```ad-example
Esempio 4: la tangente in un vertice
Tra le rette $y = -x + q$, trova quelle tangenti all'iperbole $xy = 4$.

Sostituisci $y = -x + q$ in $xy = 4$:

$$x(-x + q) = 4 \ \Rightarrow \ x^2 - qx + 4 = 0$$

La risolvente è di secondo grado, e la retta è tangente quando $\Delta = q^2 - 16 = 0$, cioè per $q = 4$ e per $q = -4$. Con $q = 4$ la risolvente è $x^2 - 4x + 4 = 0$, cioè $(x - 2)^2 = 0$: il punto di contatto è $(2, 2)$. Con $q = -4$ è $(-2, -2)$.

Le tangenti sono $y = -x + 4$ e $y = -x - 4$, e toccano l'iperbole nei due vertici. Sono perpendicolari alla retta $y = x$ dell'asse trasverso, come succede nei vertici di ogni iperbole.

```tikz
% nome: iperbole-xy-4-tangente-nel-vertice
% alt: L'iperbole xy = 4 e la retta y = -x + 4, tangente nel vertice V2 (2, 2), con la retta y = x dell'asse trasverso tratteggiata e perpendicolare alla tangente
% svg: iperbole-xy-4-tangente-nel-vertice-c50aef2c.svg 259x259
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-7) grid (7,7);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-7.3) -- (0,7.7) node[above] {$y$};
\draw[dashed, gray] (-6.5,-6.5) -- (6.5,6.5);
\draw[thick, blue!60, domain=0.58:7, samples=80, smooth] plot (\x, {4/\x});
\draw[thick, blue!60, domain=0.58:7, samples=80, smooth] plot (-\x, {-4/\x});
\draw[thick, red!50] (-3,7) -- (7,-3);
\fill (2,2) circle (0.15);
\node[above right] at (2.1,2.1) {$V_2$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-xy-4-fascio-cursore
% alt: L'iperbole xy = 4 e la retta y = -x + q con il cursore q, da -8 a 8, e il discriminante q² - 16 scritto sotto: la retta è tangente nei vertici per q uguale a 4 e a -4, secante per q maggiore di 4 o minore di -4, esterna tra -4 e 4
curva: xy=4
curva: y=-x+q | rosso
cursore: q = 4 da -8 a 8 passo 0,1
finestra: x da -8 a 8, y da -7 a 7
valore: \Delta = q^2-16
domanda: Abbassa $q$ da $4$ a $-4$: quanti punti comuni ha la retta con l'iperbole lungo il percorso? E per $q$ maggiore di $4$?
```

Tra $-4$ e $4$ il discriminante è negativo: la retta passa tra i due rami e non li incontra. Per $q > 4$ taglia due volte il ramo del primo quadrante, per $q < -4$ due volte quello del terzo.
```

## La funzione omografica

### Che cos'è

Si chiama **funzione omografica** una funzione della forma

$$
\begin{gathered}
y = \frac{ax + b}{cx + d} \\
\text{con } c \neq 0 \text{ e } ad - bc \neq 0
\end{gathered}
$$

Qui $a$, $b$, $c$, $d$ sono quattro coefficienti qualsiasi: non hanno niente a che fare con i semiassi e con la distanza focale, che in questa parte della lezione non servono. Il [dominio](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/funzioni-reali-e-dominio) è formato dai numeri che non annullano il denominatore: $x \neq -\dfrac{d}{c}$.

Le due condizioni escludono i casi in cui il grafico è una retta:

- se $c = 0$ la funzione è $y = \dfrac{a}{d}x + \dfrac{b}{d}$, una retta;
- se $ad - bc = 0$ il numeratore è un multiplo del denominatore e la frazione si semplifica in una costante. Per esempio $y = \dfrac{2x + 4}{x + 2} = \dfrac{2(x + 2)}{x + 2}$ vale $2$ per ogni $x \neq -2$: il grafico è la retta $y = 2$ senza il punto di ascissa $-2$.

### Il grafico è un'iperbole equilatera

Prendi $y = \dfrac{2x + 1}{x - 1}$. Al numeratore fai comparire il denominatore: $2x + 1 = 2(x - 1) + 3$. Allora

$$y = \frac{2(x - 1) + 3}{x - 1} = 2 + \frac{3}{x - 1}$$

cioè $y - 2 = \dfrac{3}{x - 1}$. È la curva $y = \dfrac{3}{x}$, cioè l'iperbole equilatera $xy = 3$, spostata di $1$ verso destra e di $2$ verso l'alto, come nella lezione [Trasformazioni dei grafici](/materiale/scuola-superiore/matematica/funzioni-e-loro-proprieta/trasformazioni-dei-grafici). Con lei si spostano il centro, che dall'origine va in $C(1, 2)$, e gli asintoti, che dagli assi cartesiani diventano le rette $x = 1$ e $y = 2$.

Lo stesso conto con le lettere dà il caso generale. Il grafico della funzione omografica è un'iperbole equilatera con gli asintoti paralleli agli assi cartesiani:

$$
\begin{gathered}
\text{asintoto verticale: } x = -\frac{d}{c} \\
\text{asintoto orizzontale: } y = \frac{a}{c}
\end{gathered}
$$

Il **centro** dell'iperbole è il punto in cui si incontrano gli asintoti, $C\Big(-\dfrac{d}{c}, \dfrac{a}{c}\Big)$, ed è il suo centro di simmetria.

Per ricordarli: l'asintoto verticale passa per il valore di $x$ escluso dal dominio, quello che annulla il denominatore; l'asintoto orizzontale sta all'altezza del rapporto tra i coefficienti di $x$. Quando $|x|$ è molto grande, infatti, $b$ e $d$ contano poco e la frazione vale circa $\dfrac{ax}{cx} = \dfrac{a}{c}$.

```ad-note
Il conto con le lettere
Sottrai $\dfrac{a}{c}$ dalla funzione e riduci allo stesso denominatore:

$$
\begin{aligned}
\frac{ax + b}{cx + d} - \frac{a}{c} &= \frac{c(ax + b) - a(cx + d)}{c(cx + d)} \\
&= \frac{bc - ad}{c(cx + d)}
\end{aligned}
$$

Dividendo numeratore e denominatore per $c^2$:

$$y - \frac{a}{c} = \frac{k}{x + \dfrac{d}{c}} \qquad \text{con } k = \frac{bc - ad}{c^2}$$

Rispetto agli assi che passano per $C$ è l'iperbole $xy = k$. La condizione $ad - bc \neq 0$ dice che $k \neq 0$. Se $bc - ad > 0$ i rami stanno in alto a destra e in basso a sinistra del centro; se $bc - ad < 0$ in alto a sinistra e in basso a destra. Per $y = \dfrac{2x + 1}{x - 1}$ è $bc - ad = 1 \cdot 1 - 2 \cdot (-1) = 3$.
```

```ad-warning
I segni e i coefficienti degli asintoti
In $y = \dfrac{2x + 1}{x - 1}$ l'asintoto verticale è $x = 1$, non $x = -1$: è il numero che annulla $x - 1$. L'asintoto orizzontale è $y = \dfrac{2}{1} = 2$, il rapporto tra i coefficienti di $x$, e non $\dfrac{b}{d} = -1$, che è invece l'ordinata del punto in cui il grafico incontra l'asse $y$.
```

### Come si disegna

1. Trova i due asintoti, $x = -\dfrac{d}{c}$ e $y = \dfrac{a}{c}$, e disegnali tratteggiati: si incontrano nel centro $C$.
2. Trova le intersezioni con gli assi: con $x = 0$ hai il punto $\Big(0, \dfrac{b}{d}\Big)$, se $d \neq 0$; con $y = 0$ il numeratore si annulla, e hai il punto $\Big(-\dfrac{b}{a}, 0\Big)$, se $a \neq 0$.
3. Calcola qualche altro punto, e di ogni punto segna il simmetrico rispetto a $C$.
4. Disegna i due rami, uno per parte dell'asintoto verticale, che si accostano agli asintoti.

```ad-example
Esempio 5: il grafico di una funzione omografica
Disegna il grafico di $y = \dfrac{2x + 1}{x - 1}$.

I coefficienti sono $a = 2$, $b = 1$, $c = 1$, $d = -1$. Gli asintoti sono $x = 1$ e $y = 2$, e il centro è $C(1, 2)$.

Con $x = 0$ ottieni $y = \dfrac{1}{-1} = -1$: il grafico incontra l'asse $y$ in $(0, -1)$. Con $y = 0$ deve essere $2x + 1 = 0$: incontra l'asse $x$ in $\Big(-\dfrac{1}{2}, 0\Big)$.

Altri punti: per $x = 2$ è $y = \dfrac{5}{1} = 5$, per $x = 4$ è $y = \dfrac{9}{3} = 3$. Il simmetrico di $(2, 5)$ rispetto a $C$ è $(0, -1)$, già trovato; quello di $(4, 3)$ è $(-2, 1)$, e infatti per $x = -2$ la funzione vale $\dfrac{-3}{-3} = 1$.

```tikz
% nome: funzione-omografica-2x-piu-1-fratto-x-meno-1
% alt: Il grafico di y = (2x + 1)/(x - 1): un'iperbole equilatera con gli asintoti x = 1 e y = 2 tratteggiati, il centro C (1, 2), un ramo in alto a destra per i punti (2, 5) e (4, 3) e un ramo in basso a sinistra per i punti (-2, 1), (-1/2, 0) e (0, -1)
% svg: funzione-omografica-2x-piu-1-fratto-x-meno-1-708411cf.svg 227x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-5,-4) grid (7,8);
\draw[->] (-5.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,8.7) node[above] {$y$};
\draw[dashed, thick, orange!70] (1,-4) -- (1,8);
\draw[dashed, thick, orange!70] (-5,2) -- (7,2);
\draw[thick, blue!60, domain=1.5:7, samples=80, smooth] plot (\x, {2+3/(\x-1)});
\draw[thick, blue!60, domain=-5:0.5, samples=80, smooth] plot (\x, {2+3/(\x-1)});
\foreach \x/\y in {1/2, 2/5, 4/3, 0/-1, -2/1, -0.5/0} \fill (\x,\y) circle (0.15);
\node[above left] at (1,2) {$C$};
\node[orange!70!black, right] at (1,-3.4) {\small $x = 1$};
\node[orange!70!black, above] at (-3.8,2) {\small $y = 2$};
\end{tikzpicture}
```
```grafico
% nome: funzione-omografica-cursori
% alt: Il grafico di y = (ax + b)/(cx + d) con i cursori dei quattro coefficienti e i due asintoti tratteggiati, x = -d/c e y = a/c: sotto il piano sono scritti ad - bc e il centro; quando ad - bc è zero l'iperbole sparisce e resta una retta orizzontale, e quando c è zero il grafico è una retta
curva: y=\frac{ax+b}{cx+d}
curva: x=-\frac{d}{c} | tratteggiata | grigio
curva: y=\frac{a}{c} | tratteggiata | grigio
cursore: a = 2 da -4 a 4 passo 0,1
cursore: b = 1 da -6 a 6 passo 0,1
cursore: c = 1 da -3 a 3 passo 0,1
cursore: d = -1 da -4 a 4 passo 0,1
finestra: x da -8 a 8, y da -7 a 7
valore: ad-bc = ad-bc
valore: C = \left(-\frac{d}{c};\frac{a}{c}\right)
domanda: Quali cursori spostano il centro, e quale no? Poi porta $b$ a $-2$, dove $ad - bc = 0$: che cosa resta del grafico? Rimetti $b = 1$ e porta $c$ a $0$: che cosa diventa?
```

Il centro $C\Big(-\dfrac{d}{c}, \dfrac{a}{c}\Big)$ dipende da $a$, $c$ e $d$: il cursore $b$ non lo sposta, cambia solo quanto i rami sono lontani dal centro e da che parte stanno. Con $b = -2$ è $ad - bc = 0$ e la funzione vale $2$ per ogni $x \neq 1$: i rami si sono schiacciati sugli asintoti e resta la retta $y = 2$. Con $c = 0$ non c'è più asintoto verticale: la funzione è $y = -2x - 1$, una retta. Sono i due casi che la definizione esclude.
```

```ad-example
Esempio 6: coefficienti che danno frazioni
Disegna il grafico di $y = \dfrac{x - 3}{2x + 4}$.

I coefficienti sono $a = 1$, $b = -3$, $c = 2$, $d = 4$. L'asintoto verticale è $x = -\dfrac{4}{2} = -2$, quello orizzontale è $y = \dfrac{1}{2}$, e il centro è $C\Big(-2, \dfrac{1}{2}\Big)$.

Con $x = 0$ ottieni $y = -\dfrac{3}{4}$; con $y = 0$ deve essere $x - 3 = 0$, cioè $x = 3$. Le intersezioni con gli assi sono $\Big(0, -\dfrac{3}{4}\Big)$ e $(3, 0)$.

Altri punti: per $x = -1$ è $y = \dfrac{-4}{2} = -2$, e per $x = -3$ è $y = \dfrac{-6}{-2} = 3$; i punti $(-1, -2)$ e $(-3, 3)$ sono simmetrici rispetto a $C$. Il simmetrico di $(3, 0)$ è $(-7, 1)$, e infatti per $x = -7$ la funzione vale $\dfrac{-10}{-10} = 1$.

Qui $bc - ad = -6 - 4 = -10$ è negativo: i rami stanno in alto a sinistra e in basso a destra del centro.

```tikz
% nome: funzione-omografica-x-meno-3-fratto-2x-piu-4
% alt: Il grafico di y = (x - 3)/(2x + 4): un'iperbole equilatera con gli asintoti x = -2 e y = 1/2 tratteggiati, il centro C (-2, 1/2), un ramo in alto a sinistra per i punti (-7, 1) e (-3, 3) e un ramo in basso a destra per i punti (-1, -2), (0, -3/4) e (3, 0)
% svg: funzione-omografica-x-meno-3-fratto-2x-piu-4-3a8d4727.svg 259x212
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-9,-5) grid (5,6);
\draw[->] (-9.3,0) -- (5.7,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, thick, orange!70] (-2,-5) -- (-2,6);
\draw[dashed, thick, orange!70] (-9,0.5) -- (5,0.5);
\draw[thick, blue!60, domain=-9:-2.46, samples=80, smooth] plot (\x, {0.5-2.5/(\x+2)});
\draw[thick, blue!60, domain=-1.54:5, samples=80, smooth] plot (\x, {0.5-2.5/(\x+2)});
\foreach \x/\y in {-2/0.5, -7/1, -3/3, -1/-2, 0/-0.75, 3/0} \fill (\x,\y) circle (0.15);
\node[below left] at (-2,0.5) {$C$};
\node[orange!70!black, left] at (-2,-4.4) {\small $x = -2$};
\node[orange!70!black, above] at (3.6,0.5) {\small $y = \frac{1}{2}$};
\end{tikzpicture}
```
```

### Trovare una funzione omografica

Se conosci gli asintoti $x = p$ e $y = q$, la funzione ha la forma

$$y = q + \frac{k}{x - p}$$

e per trovare $k$ serve un punto del grafico. Poi si riduce a una sola frazione.

```ad-example
Esempio 7: dagli asintoti e da un punto
Trova la funzione omografica che ha per asintoti le rette $x = 2$ e $y = -1$ e il cui grafico passa per $P(3, 2)$.

Con $p = 2$ e $q = -1$ la funzione è $y = -1 + \dfrac{k}{x - 2}$. Sostituisci le coordinate di $P$:

$$2 = -1 + \frac{k}{3 - 2} \ \Rightarrow \ k = 3$$

Riduci a una sola frazione:

$$
\begin{aligned}
y &= -1 + \frac{3}{x - 2} \\
&= \frac{-(x - 2) + 3}{x - 2} = \frac{5 - x}{x - 2}
\end{aligned}
$$

Controllo: il denominatore si annulla per $x = 2$, il rapporto tra i coefficienti di $x$ è $\dfrac{-1}{1} = -1$, e per $x = 3$ la funzione vale $\dfrac{2}{1} = 2$.
```

```ad-warning
Non ogni frazione di questo tipo è omografica
Prima di cercare gli asintoti controlla che sia $ad - bc \neq 0$. Per $y = \dfrac{6x - 3}{2x - 1}$ è $ad - bc = -6 + 6 = 0$: la funzione vale $3$ per ogni $x \neq \dfrac{1}{2}$, e il suo grafico è una retta orizzontale senza un punto, non un'iperbole.
```
