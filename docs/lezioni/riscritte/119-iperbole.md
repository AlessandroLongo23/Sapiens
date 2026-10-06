# Iperbole

Nell'[ellisse](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/ellisse) è costante la somma delle distanze di un punto da due punti fissi. Se al posto della somma tieni costante la differenza, la curva cambia del tutto: non è più chiusa, è fatta di due rami separati che si allontanano senza fine, e si chiama iperbole. Ne conosci già un pezzo: il grafico della [proporzionalità inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa) è un ramo di iperbole.

La lezione segue passo per passo quella sull'ellisse, e conviene averla letta: molte formule sono le stesse con un segno cambiato. Ti servono anche la [distanza tra due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio) e i [sistemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado).

## L'iperbole come luogo geometrico

Fissati due punti $F_1$ e $F_2$, l'**iperbole** è il luogo dei punti $P$ del piano per i quali è costante la differenza delle distanze da $F_1$ e da $F_2$, presa in valore assoluto. I punti $F_1$ e $F_2$ sono i **fuochi**. La differenza costante si indica con $2a$ e la distanza focale con $2c$:

$$\big|\overline{PF_1} - \overline{PF_2}\big| = 2a \qquad \overline{F_1F_2} = 2c$$

Il valore assoluto serve perché ci sono punti più vicini a $F_2$ e punti più vicini a $F_1$: i primi formano un ramo, i secondi l'altro. Questa volta deve essere $a < c$: nel triangolo $PF_1F_2$ la differenza di due lati è minore del terzo, quindi $2a < 2c$.

```tikz
% nome: iperbole-luogo-differenza-distanze
% alt: Un'iperbole con due rami, i fuochi F1 (-5, 0) e F2 (5, 0) e un punto P (15/4, 3) del ramo destro, unito ai due fuochi da due segmenti lunghi 37/4 e 13/4: la loro differenza è 6
% svg: iperbole-luogo-differenza-distanze-2dcc21d0.svg 259x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-6) grid (7,6);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, red!50] (-5,0) -- (3.75,3);
\draw[thick, orange!70] (5,0) -- (3.75,3);
\fill (-5,0) circle (0.15);
\fill (5,0) circle (0.15);
\fill (3.75,3) circle (0.15);
\node[below] at (-5,0) {$F_1$};
\node[below] at (5.2,0) {$F_2$};
\node[above left] at (3.75,3) {$P$};
\end{tikzpicture}
```

Nella figura i fuochi sono $F_1(-5, 0)$ e $F_2(5, 0)$ e la differenza è $2a = 6$. Per il punto $P\Big(\dfrac{15}{4}, 3\Big)$:

$$
\begin{gathered}
\overline{PF_1} = \sqrt{\Big(\frac{35}{4}\Big)^2 + 3^2} = \sqrt{\frac{1369}{16}} = \frac{37}{4} \\
\overline{PF_2} = \sqrt{\Big(\frac{5}{4}\Big)^2 + 3^2} = \sqrt{\frac{169}{16}} = \frac{13}{4}
\end{gathered}
$$

La differenza è $\dfrac{37}{4} - \dfrac{13}{4} = 6$, quindi $P$ sta sull'iperbole.

## L'equazione canonica

Come per l'ellisse, metti l'origine nel punto medio dei fuochi e l'asse $x$ sulla retta che li unisce: $F_1(-c, 0)$ e $F_2(c, 0)$. Un punto $P(x, y)$ sta sull'iperbole quando

$$\sqrt{(x + c)^2 + y^2} - \sqrt{(x - c)^2 + y^2} = \pm 2a$$

Porta la seconda radice a destra ed eleva al quadrato; poi isola la radice rimasta ed eleva ancora. Sono gli stessi passaggi dell'ellisse, e il doppio segno sparisce con il secondo quadrato:

$$
\begin{gathered}
cx - a^2 = \pm a\sqrt{(x - c)^2 + y^2} \\
\Rightarrow c^2x^2 + a^4 = a^2x^2 + a^2c^2 + a^2y^2 \\
\Rightarrow (c^2 - a^2)x^2 - a^2y^2 = a^2(c^2 - a^2)
\end{gathered}
$$

Qui è $c > a$, e il numero positivo è $c^2 - a^2$: lo chiamiamo $b^2$, con $b > 0$. Dividendo per $a^2b^2$ si ottiene l'**equazione canonica** dell'iperbole:

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \qquad \text{con } b^2 = c^2 - a^2$$

Anche qui vale il viceversa, che non dimostriamo: ogni punto che verifica l'equazione sta sull'iperbole.

## Vertici, assi e fuochi

L'equazione contiene solo $x^2$ e $y^2$: l'iperbole è simmetrica rispetto ai due assi cartesiani e rispetto all'origine, che è il suo centro.

Con $y = 0$ l'equazione dà $x^2 = a^2$: l'iperbole incontra l'asse $x$ nei **vertici reali** $A_1(-a, 0)$ e $A_2(a, 0)$. Con $x = 0$ dà $-\dfrac{y^2}{b^2} = 1$, che è impossibile: l'iperbole non incontra l'asse $y$. I punti $B_1(0, -b)$ e $B_2(0, b)$ non stanno sulla curva, ma servono per disegnarla, e si chiamano vertici non reali.

Il segmento $A_1A_2$, lungo $2a$, è l'**asse trasverso**; il segmento $B_1B_2$, lungo $2b$, è l'**asse non trasverso**. I fuochi stanno sulla retta dell'asse trasverso, e da $b^2 = c^2 - a^2$:

$$c = \sqrt{a^2 + b^2} \qquad F_1(-c, 0) \quad F_2(c, 0)$$

Dall'equazione si vede dove sta la curva: $\dfrac{x^2}{a^2} = 1 + \dfrac{y^2}{b^2} \geq 1$, quindi $x \leq -a$ oppure $x \geq a$. Nella striscia tra le rette $x = -a$ e $x = a$ non ci sono punti dell'iperbole: da una parte sta un ramo, dall'altra l'altro.

```ad-warning
Nell'iperbole a² e b² si sommano
Per i fuochi dell'iperbole è $c^2 = a^2 + b^2$; la differenza $a^2 - b^2$ è la formula dell'ellisse. E tra $a$ e $b$ non c'è un ordine obbligato: in un'iperbole può essere $a > b$, $a < b$ oppure $a = b$.
```

## Gli asintoti

Ricava $y$ dall'equazione canonica, per i punti del primo quadrante:

$$y = \frac{b}{a}\sqrt{x^2 - a^2}$$

Quando $x$ è molto grande, $a^2$ conta poco rispetto a $x^2$, e $\sqrt{x^2 - a^2}$ è poco meno di $x$: il ramo corre vicino alla retta $y = \dfrac{b}{a}x$, restando sotto. Per le simmetrie succede lo stesso negli altri quadranti, con la retta $y = -\dfrac{b}{a}x$. Queste due rette sono gli **asintoti** dell'iperbole:

$$y = \frac{b}{a}x \qquad y = -\frac{b}{a}x$$

Un asintoto è una retta a cui la curva si avvicina sempre di più man mano che ci si allontana dal centro; l'iperbole non tocca mai i suoi. La definizione precisa usa i limiti, che si studiano al quinto anno; qui possiamo misurare la distanza in verticale tra la retta e il ramo, moltiplicando e dividendo per $x + \sqrt{x^2 - a^2}$:

$$\frac{b}{a}x - \frac{b}{a}\sqrt{x^2 - a^2} = \frac{ab}{x + \sqrt{x^2 - a^2}}$$

Il numeratore è fisso e il denominatore cresce con $x$: la differenza è sempre positiva e diventa piccola quanto si vuole. Per l'iperbole $\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$, con $ab = 12$:

| $x$ | $5$ | $10$ | $100$ |
|---|---|---|---|
| distanza in verticale | $1{,}33$ | $0{,}61$ | $0{,}06$ |

Gli asintoti sono le diagonali del rettangolo che ha i lati sulle rette $x = \pm a$ e $y = \pm b$, e questo dà il modo di disegnare un'iperbole:

1. segna i vertici reali $(\pm a, 0)$ e i punti $(0, \pm b)$;
2. disegna il rettangolo con i lati per questi quattro punti, paralleli agli assi;
3. traccia le rette delle due diagonali: sono gli asintoti;
4. disegna i due rami, che partono dai vertici reali e si accostano agli asintoti.

```tikz
% nome: iperbole-vertici-fuochi-asintoti
% alt: L'iperbole x al quadrato fratto 9 meno y al quadrato fratto 16 uguale a 1 con i vertici reali A1 (-3, 0) e A2 (3, 0), i punti B1 (0, -4) e B2 (0, 4), i fuochi F1 (-5, 0) e F2 (5, 0), il rettangolo tratteggiato con i lati per i vertici e gli asintoti lungo le sue diagonali
% svg: iperbole-vertici-fuochi-asintoti-041cea15.svg 259x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-6) grid (7,6);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, gray] (-3,-4) rectangle (3,4);
\draw[dashed, thick, orange!70] (-4.5,-6) -- (4.5,6);
\draw[dashed, thick, orange!70] (-4.5,6) -- (4.5,-6);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/16)}, \x);
\foreach \x/\y in {-3/0, 3/0, 0/-4, 0/4, -5/0, 5/0} \fill (\x,\y) circle (0.15);
\node[below left] at (-3,0) {$A_1$};
\node[below right] at (3,0) {$A_2$};
\node[below right] at (0,-4) {$B_1$};
\node[above right] at (0,4) {$B_2$};
\node[below] at (-5.4,0) {$F_1$};
\node[below] at (5.5,0) {$F_2$};
\end{tikzpicture}
```

```ad-example
Esempio 1: dall'equazione agli elementi
Trova vertici, fuochi e asintoti dell'iperbole $\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$.

I denominatori sono $a^2 = 9$ e $b^2 = 16$, quindi $a = 3$ e $b = 4$. I vertici reali sono $A_1(-3, 0)$ e $A_2(3, 0)$. Per i fuochi:

$$c = \sqrt{9 + 16} = \sqrt{25} = 5$$

I fuochi sono $F_1(-5, 0)$ e $F_2(5, 0)$, e gli asintoti sono $y = \dfrac{4}{3}x$ e $y = -\dfrac{4}{3}x$. È l'iperbole delle due figure.
```

```ad-example
Esempio 2: un'equazione da portare in forma canonica
Trova vertici, fuochi e asintoti dell'iperbole $4x^2 - y^2 = 16$.

Dividi per $16$, per avere $1$ al secondo membro:

$$\frac{x^2}{4} - \frac{y^2}{16} = 1$$

Quindi $a = 2$ e $b = 4$. I vertici reali sono $(\pm 2, 0)$. Poi $c = \sqrt{4 + 16} = \sqrt{20} = 2\sqrt{5}$, e i fuochi sono $(\pm 2\sqrt{5}, 0)$. Gli asintoti sono $y = \pm\dfrac{4}{2}x$, cioè $y = 2x$ e $y = -2x$. Qui $b$ è maggiore di $a$, e i fuochi stanno lo stesso sull'asse $x$.
```

## L'iperbole con i fuochi sull'asse y

Se i fuochi stanno sull'asse $y$, in $F_1(0, -c)$ e $F_2(0, c)$, i passaggi con $x$ e $y$ scambiati portano all'equazione

$$\frac{x^2}{a^2} - \frac{y^2}{b^2} = -1$$

che si può scrivere anche $\dfrac{y^2}{b^2} - \dfrac{x^2}{a^2} = 1$. Ora è l'asse $y$ a essere incontrato, nei vertici reali $B_1(0, -b)$ e $B_2(0, b)$; l'asse trasverso è $B_1B_2$ e la differenza costante delle distanze dai fuochi è $2b$. I rami stanno uno sopra e uno sotto.

| | $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = 1$ | $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = -1$ |
|---|---|---|
| Fuochi | sull'asse $x$: $(\pm c, 0)$ | sull'asse $y$: $(0, \pm c)$ |
| Vertici reali | $(\pm a, 0)$ | $(0, \pm b)$ |
| Asse trasverso | lungo $2a$ | lungo $2b$ |
| Valore di $c$ | $c = \sqrt{a^2 + b^2}$ | $c = \sqrt{a^2 + b^2}$ |
| Asintoti | $y = \pm\dfrac{b}{a}x$ | $y = \pm\dfrac{b}{a}x$ |

Le due iperboli con gli stessi $a$ e $b$ hanno lo stesso rettangolo, gli stessi asintoti e la stessa distanza focale: una sta nei due angoli degli asintoti che contengono l'asse $x$, l'altra nei due che contengono l'asse $y$.

```ad-example
Esempio 3: fuochi sull'asse y
Trova vertici, fuochi e asintoti dell'iperbole $\dfrac{x^2}{16} - \dfrac{y^2}{9} = -1$.

Il secondo membro è $-1$: i fuochi stanno sull'asse $y$. Da $a^2 = 16$ e $b^2 = 9$ hai $a = 4$ e $b = 3$. I vertici reali sono $B_1(0, -3)$ e $B_2(0, 3)$. Poi

$$c = \sqrt{16 + 9} = 5$$

e i fuochi sono $F_1(0, -5)$ e $F_2(0, 5)$. Gli asintoti sono $y = \dfrac{3}{4}x$ e $y = -\dfrac{3}{4}x$.

```tikz
% nome: iperbole-fuochi-asse-y
% alt: L'iperbole x al quadrato fratto 16 meno y al quadrato fratto 9 uguale a -1, con un ramo sopra e uno sotto l'asse x, i vertici reali B1 (0, -3) e B2 (0, 3), i fuochi F1 (0, -5) e F2 (0, 5) sull'asse y, il rettangolo tratteggiato e gli asintoti y = 3/4 x e y = -3/4 x
% svg: iperbole-fuochi-asse-y-709c06c0.svg 259x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-7,-6) grid (7,6);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, gray] (-4,-3) rectangle (4,3);
\draw[dashed, thick, orange!70] (-7,-5.25) -- (7,5.25);
\draw[dashed, thick, orange!70] (-7,5.25) -- (7,-5.25);
\draw[thick, blue!60, domain=-6.8:6.8, samples=60, smooth] plot (\x, {3*sqrt(1+\x*\x/16)});
\draw[thick, blue!60, domain=-6.8:6.8, samples=60, smooth] plot (\x, {-3*sqrt(1+\x*\x/16)});
\foreach \x/\y in {0/-3, 0/3, 0/-5, 0/5} \fill (\x,\y) circle (0.15);
\node[below right] at (0,-3) {$B_1$};
\node[above right] at (0,3) {$B_2$};
\node[right] at (0.1,-5.2) {$F_1$};
\node[right] at (0.1,5.2) {$F_2$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-semiassi-cursori
% alt: L'iperbole x²/a² - y²/b² = -1, oppure uguale a 1, con i cursori di a e di b, gli asintoti tratteggiati e la loro pendenza b/a scritta sotto: cambiando il secondo membro i rami passano dagli angoli che contengono l'asse y a quelli che contengono l'asse x e gli asintoti restano gli stessi; con a uguale a b gli asintoti sono perpendicolari
scelta: = -1 :: \frac{x^2}{a^2}-\frac{y^2}{b^2}=-1
scelta: = 1 :: \frac{x^2}{a^2}-\frac{y^2}{b^2}=1
curva: y=\frac{b}{a}x | tratteggiata | grigio
curva: y=-\frac{b}{a}x | tratteggiata | grigio
cursore: a = 4 da 1 a 6 passo 0,1
cursore: b = 3 da 1 a 6 passo 0,1
finestra: x da -10 a 10, y da -8 a 8
valore: \frac{b}{a} = \frac{b}{a}
valore: c = \sqrt{a^2+b^2}
domanda: Cambia il secondo membro da $-1$ a $1$: gli asintoti si muovono? Poi aumenta $b$ tenendo fermo $a$: che cosa fanno gli asintoti? E che angolo formano quando $a = b$?
```

Cambiando il secondo membro gli asintoti restano fermi: i rami passano dai due angoli che contengono l'asse $y$ ai due che contengono l'asse $x$. Se $b$ cresce con $a$ fermo, la pendenza $\dfrac{b}{a}$ cresce e gli asintoti si avvicinano all'asse $y$. Quando $a = b$ la pendenza è $1$: gli asintoti sono le bisettrici dei quadranti e formano un angolo retto.
```

```ad-warning
Dove stanno i fuochi lo dice il segno
Nell'ellisse guardi quale denominatore è più grande. Nell'iperbole no: guardi quale termine è positivo quando il secondo membro è $1$. In $\dfrac{x^2}{4} - \dfrac{y^2}{16} = 1$ il termine positivo è quello con $x^2$, e i fuochi sono sull'asse $x$ anche se $16 > 4$.
```

## L'eccentricità

Anche per l'iperbole l'**eccentricità** è il rapporto tra la distanza focale e la lunghezza dell'asse trasverso:

$$
\begin{gathered}
e = \frac{c}{a} \ \text{ con i fuochi sull'asse } x \\
e = \frac{c}{b} \ \text{ con i fuochi sull'asse } y
\end{gathered}
$$

Nell'iperbole $c$ è maggiore del semiasse trasverso, quindi è sempre $e > 1$, mentre per l'ellisse è $e < 1$. Con i fuochi sull'asse $x$, da $c^2 = a^2 + b^2$ si ha

$$e = \sqrt{1 + \frac{b^2}{a^2}}$$

Più $e$ è grande, più è grande $\dfrac{b}{a}$, la pendenza degli asintoti: i rami sono più aperti. Con $e$ vicino a $1$ gli asintoti sono quasi orizzontali e i rami sono stretti intorno all'asse $x$.

```tikz
% nome: iperboli-eccentricita
% alt: Tre iperboli con gli stessi vertici reali (-3, 0) e (3, 0) ed eccentricità 5/4, 5/3 e 3: più l'eccentricità è grande, più i rami sono aperti
% svg: iperboli-eccentricita-76e8e3a7.svg 275x228
\begin{tikzpicture}[scale=0.42]
\draw[->] (-7.6,0) -- (8,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[thick, teal!60, domain=-4.7:4.7, samples=60, smooth] plot ({3*sqrt(1+\x*\x/5.0625)}, \x);
\draw[thick, teal!60, domain=-4.7:4.7, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/5.0625)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, orange!70, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/72)}, \x);
\draw[thick, orange!70, domain=-6:6, samples=60, smooth] plot ({-3*sqrt(1+\x*\x/72)}, \x);
\fill (-3,0) circle (0.15);
\fill (3,0) circle (0.15);
\node[teal!60!black, right] at (7,4.7) {\small $e = \frac{5}{4}$};
\node[blue!60!black, above] at (5.6,6) {\small $e = \frac{5}{3}$};
\node[orange!70!black, above] at (2.5,6) {\small $e = 3$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-eccentricita-cursore
% alt: L'iperbole x²/9 - y²/(c² - 9) = 1 con i vertici reali fermi in (-3, 0) e (3, 0), i fuochi F e G in (c, 0) e (-c, 0), gli asintoti tratteggiati e il cursore di c, da 3,1 a 9: l'eccentricità c/3 è scritta sotto il piano; più è grande più i rami sono aperti, e quando è vicina a 1 i rami si chiudono intorno all'asse x
curva: \frac{x^2}{9}-\frac{y^2}{c^2-9}=1
curva: y=\frac{\sqrt{c^2-9}}{3}x | tratteggiata | grigio
curva: y=-\frac{\sqrt{c^2-9}}{3}x | tratteggiata | grigio
curva: F=\left(c;0\right) | nero
curva: G=\left(-c;0\right) | nero
cursore: c = 5 da 3,1 a 9 passo 0,1
finestra: x da -11 a 11, y da -8 a 8
valore: E = \frac{c}{3}
domanda: Qui $a = 3$, i punti $F$ e $G$ sono i fuochi ed $E$ è l'eccentricità. Allontana i fuochi: che cosa fanno i rami? E quando $c$ scende verso $3$, dove $E$ si avvicina a $1$?
```

Nella figura i vertici reali sono sempre $(\pm 3, 0)$. Allontanando i fuochi l'eccentricità cresce, gli asintoti diventano più ripidi e i rami si aprono. Quando $c$ scende verso $3$ l'eccentricità si avvicina a $1$, i fuochi vanno verso i vertici e i rami si chiudono intorno all'asse $x$; il valore $E = 1$ non si raggiunge, perché deve essere $c > a$.

L'iperbole dell'esempio 1 ha $e = \dfrac{5}{3}$, quella dell'esempio 2 ha $e = \dfrac{2\sqrt{5}}{2} = \sqrt{5}$, quella dell'esempio 3 ha $e = \dfrac{c}{b} = \dfrac{5}{3}$.

## Iperbole e retta

I punti comuni a un'iperbole e a una retta sono le soluzioni del sistema delle due equazioni. Ricavi $y$ dalla retta, sostituisci e ottieni la risolvente. Se la risolvente è di secondo grado, il discriminante decide come per l'ellisse:

| Risolvente | Punti comuni | La retta è |
|---|---|---|
| $\Delta > 0$ | due | secante |
| $\Delta = 0$ | uno | tangente |
| $\Delta < 0$ | nessuno | esterna |

Una retta secante può tagliare due volte lo stesso ramo, oppure una volta ciascuno dei due rami.

```ad-example
Esempio 4: tre rette parallele
Stabilisci la posizione delle rette $y = -2x + 6$, $y = -2x + 4$ e $y = -2x + 2$ rispetto all'iperbole $\dfrac{x^2}{5} - \dfrac{y^2}{4} = 1$.

Moltiplicando per $20$ l'equazione dell'iperbole diventa $4x^2 - 5y^2 = 20$. Sostituisci $y = -2x + 6$:

$$
\begin{gathered}
4x^2 - 5(-2x + 6)^2 = 20 \\
\Rightarrow 4x^2 - 20x^2 + 120x - 180 - 20 = 0 \\
\Rightarrow 16x^2 - 120x + 200 = 0
\end{gathered}
$$

Dividendo per $8$ resta $2x^2 - 15x + 25 = 0$, con $\Delta = 225 - 200 = 25$: la retta è secante.

$$x_{1,2} = \frac{15 \pm 5}{4}$$

Le soluzioni sono $x_1 = \dfrac{5}{2}$ e $x_2 = 5$, con $y_1 = -5 + 6 = 1$ e $y_2 = -10 + 6 = -4$. I punti comuni sono $\Big(\dfrac{5}{2}, 1\Big)$ e $(5, -4)$, tutti e due sul ramo destro.

Con $y = -2x + 4$ la risolvente è $16x^2 - 80x + 100 = 0$, cioè $4x^2 - 20x + 25 = 0$, che è $(2x - 5)^2 = 0$: ha $\Delta = 0$ e la soluzione doppia $x = \dfrac{5}{2}$. La retta è tangente nel punto $T\Big(\dfrac{5}{2}, -1\Big)$.

Con $y = -2x + 2$ la risolvente è $16x^2 - 40x + 40 = 0$, cioè $2x^2 - 5x + 5 = 0$, con $\Delta = 25 - 40 = -15$: la retta è esterna, e passa tra i due rami. Nella figura ogni retta porta il suo termine noto $q$.

```tikz
% nome: iperbole-rette-secante-tangente-esterna
% alt: L'iperbole x al quadrato fratto 5 meno y al quadrato fratto 4 uguale a 1 e tre rette parallele: y = -2x + 6 taglia il ramo destro nei punti (5/2, 1) e (5, -4), y = -2x + 4 è tangente nel punto T (5/2, -1), y = -2x + 2 passa tra i due rami senza incontrarli
% svg: iperbole-rette-secante-tangente-esterna-6d2ebf05.svg 276x222
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-7,-5) grid (7,5);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,5.7) node[above] {$y$};
\draw[thick, blue!60, domain=-5:5, samples=60, smooth] plot ({2.236*sqrt(1+\x*\x/4)}, \x);
\draw[thick, blue!60, domain=-5:5, samples=60, smooth] plot ({-2.236*sqrt(1+\x*\x/4)}, \x);
\draw[thick, red!50] (0.5,5) -- (5.5,-5);
\draw[thick, teal!60] (-0.5,5) -- (4.5,-5);
\draw[thick, orange!70] (-1.5,5) -- (3.5,-5);
\foreach \x/\y in {2.5/1, 5/-4, 2.5/-1} \fill (\x,\y) circle (0.14);
\node[left] at (2.4,-1.2) {$T$};
\node[red!50!black, below] at (5.6,-5) {\small $6$};
\node[teal!60!black, below] at (4.6,-5) {\small $4$};
\node[orange!70!black, below left] at (3.9,-5) {\small $q = 2$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-fascio-rette-parallele
% alt: L'iperbole x²/5 - y²/4 = 1 e la retta y = -2x + q con il cursore q, da -8 a 8, e il discriminante della risolvente scritto sotto: la retta è esterna quando q è compreso tra -4 e 4, tangente per q uguale a 4 o a -4, secante negli altri casi
curva: \frac{x^2}{5}-\frac{y^2}{4}=1
curva: y=-2x+q | rosso
cursore: q = 6 da -8 a 8 passo 0,1
finestra: x da -9 a 9, y da -7 a 7
valore: \Delta = 80q^2-1280
domanda: Sotto il piano c'è il discriminante della risolvente. Per quali valori di $q$ la retta è tangente? Dove passa la retta quando $\Delta$ è negativo?
```

La retta è tangente per $q = 4$ e per $q = -4$, una volta per ramo. Tra $-4$ e $4$ il discriminante è negativo: la retta passa tra i due rami e non ne incontra nessuno. È il contrario dell'ellisse, dove le rette esterne sono quelle lontane dal centro.
```

Il discriminante scritto sotto il piano è quello della risolvente $16x^2 - 20qx + 5q^2 + 20 = 0$, che ottieni sostituendo $y = -2x + q$: $\Delta = 400q^2 - 64(5q^2 + 20) = 80q^2 - 1280$.

### Le rette parallele a un asintoto

C'è un caso che con l'ellisse non capita. Se la retta è parallela a un asintoto, cioè ha coefficiente angolare $\dfrac{b}{a}$ o $-\dfrac{b}{a}$, nella risolvente i termini con $x^2$ si cancellano e resta un'equazione di primo grado: la retta incontra l'iperbole in un solo punto, e la attraversa.

```ad-example
Esempio 5: una retta parallela a un asintoto
Trova i punti comuni all'iperbole $\dfrac{x^2}{9} - \dfrac{y^2}{16} = 1$ e alla retta $y = \dfrac{4}{3}x - 2$.

La retta ha lo stesso coefficiente angolare dell'asintoto $y = \dfrac{4}{3}x$. Moltiplicando per $144$ l'iperbole diventa $16x^2 - 9y^2 = 144$. Sostituendo, il quadrato è $\Big(\dfrac{4}{3}x - 2\Big)^2 = \dfrac{16}{9}x^2 - \dfrac{16}{3}x + 4$:

$$
\begin{gathered}
16x^2 - 16x^2 + 48x - 36 = 144 \\
\Rightarrow 48x = 180 \ \Rightarrow \ x = \frac{15}{4}
\end{gathered}
$$

L'ordinata è $y = \dfrac{4}{3} \cdot \dfrac{15}{4} - 2 = 3$. C'è un solo punto comune, $P\Big(\dfrac{15}{4}, 3\Big)$, quello della prima figura.

```tikz
% nome: iperbole-retta-parallela-asintoto
% alt: Il ramo destro dell'iperbole x al quadrato fratto 9 meno y al quadrato fratto 16 uguale a 1, il suo asintoto y = 4/3 x tratteggiato e la retta y = 4/3 x - 2, parallela all'asintoto, che attraversa il ramo nel solo punto P (15/4, 3)
% svg: iperbole-retta-parallela-asintoto-5839e6d7.svg 163x228
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-1,-6) grid (7,6);
\draw[->] (-1.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-6.3) -- (0,6.7) node[above] {$y$};
\draw[dashed, thick, orange!70] (-1,-1.333) -- (4.5,6);
\draw[thick, blue!60, domain=-6:6, samples=60, smooth] plot ({3*sqrt(1+\x*\x/16)}, \x);
\draw[thick, red!50] (-1,-3.333) -- (6,6);
\fill (3.75,3) circle (0.15);
\node[right] at (3.9,2.7) {$P$};
\end{tikzpicture}
```
```grafico
% nome: iperbole-parallela-asintoto-cursore
% alt: L'iperbole x²/9 - y²/16 = 1, il suo asintoto y = 4/3 x tratteggiato e la retta parallela y = 4/3 x + q con il cursore q, da -6 a 6: la retta incontra l'iperbole in un solo punto, la cui ascissa è scritta sotto il piano e si allontana senza limite quando q si avvicina a zero; per q = 0 la retta è l'asintoto e il punto non esiste
curva: \frac{x^2}{9}-\frac{y^2}{16}=1
curva: y=\frac{4}{3}x | tratteggiata | grigio
curva: y=\frac{4}{3}x+q | rosso
cursore: q = -2 da -6 a 6 passo 0,1
finestra: x da -12 a 12, y da -9 a 9
valore: x_P = -\frac{3\left(q^2+16\right)}{8q}
domanda: Sotto il piano c'è l'ascissa del punto comune $P$. Porta $q$ verso $0$: dove va $P$? E che cosa resta per $q = 0$?
```

Per ogni $q \neq 0$ il punto comune è uno solo, con ascissa $x_P = -\dfrac{3(q^2 + 16)}{8q}$, che si ottiene dalla risolvente di primo grado $-24qx - 9q^2 = 144$. Quando $q$ si avvicina a $0$ il denominatore diventa piccolo e $P$ scappa lungo il ramo, sempre più lontano. Per $q = 0$ la retta è l'asintoto, e il punto comune non c'è più.
```

```ad-warning
Un solo punto comune non vuol dire tangente
Per l'iperbole la regola "un punto solo, quindi tangente" vale soltanto quando la risolvente è di secondo grado e ha $\Delta = 0$. Una retta parallela a un asintoto ha un solo punto comune con l'iperbole ma la attraversa, e non è tangente. L'asintoto stesso non ha nessun punto comune: sostituendo $y = \dfrac{b}{a}x$ nell'equazione canonica si ottiene $0 = 1$.
```

## Rette tangenti a un'iperbole

### Tangente in un punto dell'iperbole

Anche per l'iperbole vale la **formula di sdoppiamento**, che qui enunciamo senza dimostrarla. Se $P(x_0, y_0)$ è un punto dell'iperbole, la tangente in $P$ è

$$\frac{x_0 x}{a^2} - \frac{y_0 y}{b^2} = 1$$

per l'iperbole con i fuochi sull'asse $x$; per quella con i fuochi sull'asse $y$ il secondo membro è $-1$, come nell'equazione.

```ad-example
Esempio 6: la tangente in un punto
Scrivi la tangente all'iperbole $\dfrac{x^2}{5} - \dfrac{y^2}{4} = 1$ nel suo punto $T\Big(\dfrac{5}{2}, -1\Big)$.

Il punto sta sull'iperbole: $\dfrac{25}{4} \cdot \dfrac{1}{5} - \dfrac{1}{4} = \dfrac{5}{4} - \dfrac{1}{4} = 1$. Sdoppia, con $x_0 = \dfrac{5}{2}$ e $y_0 = -1$:

$$\frac{5}{2} \cdot \frac{x}{5} - \frac{(-1) \cdot y}{4} = 1 \ \Rightarrow \ \frac{x}{2} + \frac{y}{4} = 1$$

Moltiplicando per $4$ ottieni $2x + y = 4$, cioè $y = -2x + 4$: è la retta che nell'esempio 4 aveva $\Delta = 0$.
```

### Tangenti da un punto che non sta sull'iperbole

Il procedimento è quello dell'ellisse: fascio di centro $P$, sistema con l'iperbole, condizione $\Delta = 0$ sulla risolvente. I valori di $m$ accettabili sono quelli per cui la risolvente resta di secondo grado, cioè diversi da $\pm\dfrac{b}{a}$. A seconda di dove sta $P$ le tangenti possono essere due, una o nessuna: dal centro dell'iperbole, per esempio, non ne esce nessuna.

```ad-example
Esempio 7: le tangenti da un punto
Trova le tangenti all'iperbole $\dfrac{x^2}{5} - \dfrac{y^2}{4} = 1$ condotte dal punto $P(1, 2)$.

Il fascio di centro $P$ è $y = mx + 2 - m$. Sostituisci in $4x^2 - 5y^2 = 20$:

$$
\begin{gathered}
4x^2 - 5(mx + 2 - m)^2 = 20 \\
\Rightarrow (4 - 5m^2)x^2 - 10m(2 - m)x \\
- \, 5(2 - m)^2 - 20 = 0
\end{gathered}
$$

Il coefficiente di $x$ è pari, quindi conviene $\dfrac{\Delta}{4}$:

$$
\begin{aligned}
\frac{\Delta}{4} = {} & 25m^2(2 - m)^2 \\
& + (4 - 5m^2)\big[5(2 - m)^2 + 20\big]
\end{aligned}
$$

Svolgendo il prodotto, i termini $25m^2(2 - m)^2$ si cancellano e resta

$$
\begin{aligned}
\frac{\Delta}{4} &= 20(2 - m)^2 + 80 - 100m^2 \\
&= -80m^2 - 80m + 160
\end{aligned}
$$

La condizione $\Delta = 0$, divisa per $-80$, è $m^2 + m - 2 = 0$, cioè $(m - 1)(m + 2) = 0$: le soluzioni sono $m_1 = -2$ e $m_2 = 1$. Per tutti e due i valori $4 - 5m^2$ è diverso da zero. Le tangenti sono

$$y = -2x + 4 \qquad y = x + 1$$

La prima tocca il ramo destro in $T_1\Big(\dfrac{5}{2}, -1\Big)$, come nell'esempio 6. La seconda tocca il ramo sinistro in $T_2(-5, -4)$: il punto sta sull'iperbole, perché $\dfrac{25}{5} - \dfrac{16}{4} = 1$, e sulla retta, perché $-5 + 1 = -4$.

```tikz
% nome: iperbole-tangenti-da-un-punto
% alt: L'iperbole x al quadrato fratto 5 meno y al quadrato fratto 4 uguale a 1 e le due tangenti condotte dal punto P (1, 2): la retta y = -2x + 4, che tocca il ramo destro in T1 (5/2, -1), e la retta y = x + 1, che tocca il ramo sinistro in T2 (-5, -4)
% svg: iperbole-tangenti-da-un-punto-ba8b611e.svg 276x208
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-7,-5) grid (7,5);
\draw[->] (-7.3,0) -- (7.7,0) node[right] {$x$};
\draw[->] (0,-5.3) -- (0,5.7) node[above] {$y$};
\draw[thick, blue!60, domain=-5:5, samples=60, smooth] plot ({2.236*sqrt(1+\x*\x/4)}, \x);
\draw[thick, blue!60, domain=-5:5, samples=60, smooth] plot ({-2.236*sqrt(1+\x*\x/4)}, \x);
\draw[thick, red!50] (-0.5,5) -- (4.5,-5);
\draw[thick, red!50] (-6,-5) -- (4,5);
\foreach \x/\y in {1/2, 2.5/-1, -5/-4} \fill (\x,\y) circle (0.14);
\node[right] at (1.2,2.1) {$P$};
\node[left] at (2.4,-1.2) {$T_1$};
\node[above left] at (-5,-3.9) {$T_2$};
\end{tikzpicture}
```
```

## Trovare l'equazione di un'iperbole

Come per l'ellisse, i numeri da trovare sono due, $a^2$ e $b^2$, e servono due condizioni, oltre a sapere su quale asse stanno i fuochi.

| Informazione | Equazione |
|---|---|
| un vertice reale | dà subito $a$ (fuochi sull'asse $x$) oppure $b$ (fuochi sull'asse $y$) |
| un fuoco | dà $c$, quindi $a^2 + b^2 = c^2$ |
| un asintoto | dà il rapporto $\dfrac{b}{a}$ |
| l'eccentricità | il rapporto tra $c$ e il semiasse trasverso |
| il passaggio per un punto | le coordinate del punto verificano l'equazione |

```ad-example
Esempio 8: gli asintoti e un punto
Trova l'iperbole con i fuochi sull'asse $x$ che ha per asintoti le rette $y = \pm\dfrac{1}{2}x$ e passa per $P(4, 1)$.

Dagli asintoti $\dfrac{b}{a} = \dfrac{1}{2}$, cioè $a = 2b$ e $a^2 = 4b^2$. Sostituisci nell'equazione canonica le coordinate di $P$:

$$
\begin{gathered}
\frac{16}{4b^2} - \frac{1}{b^2} = 1 \\
\Rightarrow \frac{4}{b^2} - \frac{1}{b^2} = 1 \ \Rightarrow \ b^2 = 3
\end{gathered}
$$

Quindi $a^2 = 12$, e l'iperbole è $\dfrac{x^2}{12} - \dfrac{y^2}{3} = 1$. Controllo: $\dfrac{16}{12} - \dfrac{1}{3} = \dfrac{4}{3} - \dfrac{1}{3} = 1$.
```

```ad-example
Esempio 9: l'iperbole per due punti
Trova l'iperbole con i fuochi sull'asse $x$ che passa per $A(2, 1)$ e $B(4, 5)$.

Poni $p = \dfrac{1}{a^2}$ e $q = \dfrac{1}{b^2}$ e sostituisci le coordinate dei due punti in $px^2 - qy^2 = 1$:

$$
\begin{cases}
4p - q = 1 \\
16p - 25q = 1
\end{cases}
$$

Dalla prima equazione $q = 4p - 1$; sostituendo nella seconda:

$$
\begin{gathered}
16p - 100p + 25 = 1 \\
\Rightarrow 84p = 24 \ \Rightarrow \ p = \frac{2}{7}
\end{gathered}
$$

e quindi $q = \dfrac{8}{7} - 1 = \dfrac{1}{7}$. Allora $a^2 = \dfrac{7}{2}$ e $b^2 = 7$. L'equazione è

$$\frac{2x^2}{7} - \frac{y^2}{7} = 1$$

cioè $2x^2 - y^2 = 7$. Controllo: $2 \cdot 4 - 1 = 7$ e $2 \cdot 16 - 25 = 7$. Se $p$ o $q$ fosse venuto negativo, un'iperbole con i fuochi sull'asse $x$ per quei due punti non ci sarebbe stata.
```

```ad-example
Esempio 10: un fuoco e l'eccentricità
Trova l'iperbole che ha i fuochi $F_1(0, -5)$ e $F_2(0, 5)$ ed eccentricità $e = \dfrac{5}{4}$.

I fuochi sono sull'asse $y$: l'equazione ha la forma $\dfrac{x^2}{a^2} - \dfrac{y^2}{b^2} = -1$, il semiasse trasverso è $b$ e l'eccentricità è $e = \dfrac{c}{b}$. Con $c = 5$:

$$b = \frac{c}{e} = 5 \cdot \frac{4}{5} = 4$$

Poi $a^2 = c^2 - b^2 = 25 - 16 = 9$. L'iperbole è $\dfrac{x^2}{9} - \dfrac{y^2}{16} = -1$.
```

Quando $a = b$ gli asintoti sono perpendicolari e l'iperbole si chiama equilatera: è l'argomento della lezione [Iperbole equilatera e funzione omografica](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/iperbole-equilatera-e-funzione-omografica).
