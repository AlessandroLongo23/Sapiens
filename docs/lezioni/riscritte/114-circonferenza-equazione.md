# Equazione della circonferenza

Un'antenna copre tutti i punti che distano da lei meno di una certa lunghezza, e il bordo della zona coperta è una circonferenza. Nella lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio) la circonferenza è il luogo dei punti che hanno una distanza fissata da un punto, il centro. Nel piano cartesiano la distanza si calcola con una formula, quella della lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio), e la definizione diventa un'equazione in $x$ e $y$: con l'equazione puoi dire se un punto sta sulla circonferenza, trovare centro e raggio, e costruire la circonferenza che soddisfa certe condizioni.

## Dal luogo all'equazione

Fissa il centro $C(\alpha, \beta)$ e il raggio $r > 0$. Un punto $P(x, y)$ sta sulla circonferenza se e solo se la sua distanza da $C$ è $r$, cioè $\overline{PC} = r$. Con la formula della distanza:

$$\sqrt{(x - \alpha)^2 + (y - \beta)^2} = r$$

I due membri non sono mai negativi, quindi l'uguaglianza è vera esattamente quando è vera quella tra i loro quadrati. L'**equazione della circonferenza** di centro $C(\alpha, \beta)$ e raggio $r$ è

$$(x - \alpha)^2 + (y - \beta)^2 = r^2$$

Le coordinate di un punto rendono vera l'equazione se il punto sta sulla circonferenza, e solo in quel caso. Con il centro $C(2, 1)$ e il raggio $3$ l'equazione è $(x - 2)^2 + (y - 1)^2 = 9$.

```tikz
% nome: circonferenza-centro-raggio-equazione
% alt: La circonferenza di centro C(2, 1) e raggio 3 nel piano cartesiano: un punto P(x, y) sta sulla circonferenza quando la sua distanza da C è uguale al raggio r
% svg: circonferenza-centro-raggio-equazione-8e0a3823.svg 189x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2,-3) grid (6,5);
\draw[->] (-2.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.6) node[above] {$y$};
\foreach \x in {2,5} \node[below] at (\x,0) {\small $\x$};
\node[left] at (0,1) {\small $1$};
\node[left] at (0,4) {\small $4$};
\draw[thick, blue!60] (2,1) circle (3);
\draw[dashed, gray] (2,0) -- (2,1) -- (0,1);
\draw[thick, red!50] (2,1) -- (3.93,3.30);
\fill (2,1) circle (0.13);
\fill (3.93,3.30) circle (0.13);
\node[below right] at (2,1) {$C$};
\node[above right] at (3.93,3.30) {$P(x, y)$};
\node[red!60!black, above left] at (2.9,2.1) {$r$};
\end{tikzpicture}
```
```grafico
% nome: circonferenza-centro-raggio-cursori
% alt: La circonferenza di centro C(α, β) e raggio r con i cursori di α, β e r: cambiando α e β la circonferenza si sposta senza cambiare forma, cambiando r si allarga o si stringe attorno al centro
curva: \left(x-\alpha\right)^2+\left(y-\beta\right)^2=r^2
curva: C=\left(\alpha;\beta\right) | nero
cursore: \alpha = 2 da -4 a 4 passo 0,5
cursore: \beta = 1 da -4 a 4 passo 0,5
cursore: r = 3 da 0 a 5 passo 0,5
finestra: x da -9 a 9, y da -7 a 7
valore: C = \left(\alpha;\beta\right)
domanda: Muovi $\alpha$ e $\beta$: la circonferenza cambia forma? Poi porta $r$ a $0$: che cosa resta?
```

Cambiando $\alpha$ e $\beta$ la circonferenza si sposta senza cambiare forma: è una traslazione. Con $r = 0$ l'equazione diventa $(x - \alpha)^2 + (y - \beta)^2 = 0$ e resta il solo centro, per questo nella definizione si chiede $r > 0$.

Se il centro è l'origine, $\alpha = 0$ e $\beta = 0$, e l'equazione si riduce a

$$x^2 + y^2 = r^2$$

Per esempio $x^2 + y^2 = 25$ è la circonferenza di centro $O(0, 0)$ e raggio $5$.

```ad-warning
I segni del centro e il quadrato del raggio
Nell'equazione le coordinate del centro compaiono con il segno cambiato e il raggio compare al quadrato. La circonferenza $(x + 3)^2 + (y - 1)^2 = 4$ ha centro $(-3, 1)$, non $(3, -1)$, perché $x + 3 = x - (-3)$; e ha raggio $2$, non $4$.
```

```ad-example
Esempio 1: l'equazione dal centro e dal raggio
Scrivi l'equazione della circonferenza di centro $C(-3, 1)$ e raggio $2$.

Qui $\alpha = -3$, $\beta = 1$ e $r = 2$:

$$(x + 3)^2 + (y - 1)^2 = 4$$

Sviluppa i due quadrati con i [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli) e porta tutto a primo membro:

$$
\begin{gathered}
x^2 + 6x + 9 + y^2 - 2y + 1 = 4 \\
\Rightarrow x^2 + y^2 + 6x - 2y + 6 = 0
\end{gathered}
$$
```

## Punti interni ed esterni

La stessa distanza che definisce la circonferenza dice anche da che parte sta un punto $P$ che non le appartiene. Si confronta $\overline{PC}$ con il raggio, oppure, senza radici, $\overline{PC}^2$ con $r^2$:

| Confronto | Il punto $P$ è |
|---|---|
| $\overline{PC}^2 < r^2$ | interno alla circonferenza |
| $\overline{PC}^2 = r^2$ | sulla circonferenza |
| $\overline{PC}^2 > r^2$ | esterno alla circonferenza |

Con la circonferenza $(x - 2)^2 + (y - 1)^2 = 9$ si sostituiscono le coordinate nel primo membro e si confronta con $9$. Per $A(2, 4)$ si ottiene $0 + 9 = 9$: il punto sta sulla circonferenza. Per $B(4, 2)$ si ottiene $4 + 1 = 5 < 9$: è interno. Per $D(-1, 3)$ si ottiene $9 + 4 = 13 > 9$: è esterno.

```tikz
% nome: punti-interni-esterni-circonferenza
% alt: La circonferenza di centro C(2, 1) e raggio 3 con tre punti: A(2, 4) sulla circonferenza, B(4, 2) interno e D(-1, 3) esterno
% svg: punti-interni-esterni-circonferenza-b0f0e6c5.svg 189x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2,-3) grid (6,5);
\draw[->] (-2.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.6) node[above] {$y$};
\foreach \x in {2,4} \node[below] at (\x,0) {\small $\x$};
\draw[thick, blue!60] (2,1) circle (3);
\fill (2,1) circle (0.13);
\fill (2,4) circle (0.13);
\fill (4,2) circle (0.13);
\fill (-1,3) circle (0.13);
\node[below right] at (2,1) {$C$};
\node[above] at (2,4) {$A$};
\node[right] at (4,2) {$B$};
\node[above left] at (-1,3) {$D$};
\end{tikzpicture}
```
```grafico
% nome: punti-interni-esterni-cursore-raggio
% alt: La circonferenza di centro C(2, 1) con il cursore del raggio r e i tre punti fermi A(2, 4), B(4, 2) e D(-1, 3): aumentando r i punti passano uno alla volta da esterni a interni, B quando r² supera 5, A quando supera 9, D quando supera 13
curva: \left(x-2\right)^2+\left(y-1\right)^2=r^2
curva: C=\left(2;1\right) | nero
curva: A=\left(2;4\right) | rosso
curva: B=\left(4;2\right) | rosso
curva: D=\left(-1;3\right) | rosso
cursore: r = 3 da 1 a 5 passo 0,1
finestra: x da -7 a 11, y da -6 a 8
valore: r^2 = r^2
domanda: Parti da $r = 1$ e aumenta: in che ordine $A$, $B$ e $D$ entrano nella circonferenza? Per quale valore di $r^2$ il punto $D$ sta sulla circonferenza?
```

Entra per primo $B$, quando $r^2$ supera $5$, poi $A$ quando supera $9$, poi $D$ quando supera $13$: sono i tre numeri trovati sostituendo le coordinate. Il punto $D$ sta sulla circonferenza per $r^2 = 13$, cioè $r = \sqrt{13} \approx 3{,}6$.

## L'equazione in forma generale

Sviluppando i quadrati di $(x - \alpha)^2 + (y - \beta)^2 = r^2$, come nell'esempio 1, si ottiene

$$
\begin{gathered}
x^2 + y^2 - 2\alpha x - 2\beta y \, + \\
+ \, \alpha^2 + \beta^2 - r^2 = 0
\end{gathered}
$$

Chiamando $a$ il coefficiente di $x$, $b$ quello di $y$ e $c$ il termine noto, l'equazione prende la **forma generale**

$$x^2 + y^2 + ax + by + c = 0$$

dove

$$
\begin{gathered}
a = -2\alpha \\
b = -2\beta \\
c = \alpha^2 + \beta^2 - r^2
\end{gathered}
$$

Nella forma generale si riconoscono tre cose: $x^2$ e $y^2$ hanno lo stesso coefficiente, che qui è $1$; non c'è il termine con il prodotto $xy$; gli altri termini sono di primo grado o noti.

### Centro e raggio dalla forma generale

Le tre uguaglianze si leggono anche al contrario. Dalle prime due ricavi le coordinate del centro, dalla terza il raggio:

$$
\begin{gathered}
\alpha = -\frac{a}{2} \qquad \beta = -\frac{b}{2} \\
r = \sqrt{\alpha^2 + \beta^2 - c}
\end{gathered}
$$

Il centro si trova quindi dimezzando i coefficienti di $x$ e di $y$ e cambiando il segno. Per il raggio si sommano i quadrati delle coordinate del centro, si toglie $c$ e si estrae la radice.

```ad-example
Esempio 2: centro e raggio
Trova centro e raggio della circonferenza $x^2 + y^2 - 4x + 6y - 3 = 0$.

I coefficienti sono $a = -4$, $b = 6$, $c = -3$.

$$
\begin{gathered}
\alpha = -\frac{-4}{2} = 2 \\
\beta = -\frac{6}{2} = -3 \\
r = \sqrt{4 + 9 - (-3)} = \sqrt{16} = 4
\end{gathered}
$$

La circonferenza ha centro $C(2, -3)$ e raggio $4$. Controllo: $(x - 2)^2 + (y + 3)^2 = 16$, sviluppata, dà $x^2 + y^2 - 4x + 6y + 4 + 9 - 16 = 0$, cioè l'equazione di partenza.

```tikz
% nome: circonferenza-centro-2-meno-3-raggio-4
% alt: La circonferenza x² + y² - 4x + 6y - 3 = 0, con il centro C(2, -3) e un raggio lungo 4 disegnato fino al punto (6, -3)
% svg: circonferenza-centro-2-meno-3-raggio-4-d976f417.svg 193x194
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-3,-8) grid (7,2);
\draw[->] (-3.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-8.3) -- (0,2.6) node[above] {$y$};
\node[above] at (2,0) {\small $2$};
\node[above] at (6,0) {\small $6$};
\node[left] at (0,-3) {\small $-3$};
\draw[thick, blue!60] (2,-3) circle (4);
\draw[dashed, gray] (2,0) -- (2,-3) -- (0,-3);
\draw[thick, red!50] (2,-3) -- (6,-3);
\fill (2,-3) circle (0.15);
\fill (6,-3) circle (0.15);
\node[below] at (2,-3) {$C$};
\node[red!60!black, above] at (4,-3) {$4$};
\end{tikzpicture}
```
```grafico
% nome: circonferenza-forma-generale-cursori
% alt: La circonferenza x² + y² + ax + by + c = 0 con i cursori dei tre coefficienti, il centro e il valore di α² + β² - c scritto sotto il piano: quando quel valore scende a zero la circonferenza si riduce al centro, e sotto zero sparisce
curva: x^2+y^2+ax+by+c=0
curva: C=\left(-\frac{a}{2};-\frac{b}{2}\right) | nero
cursore: a = -4 da -8 a 8 passo 0,5
cursore: b = 6 da -8 a 8 passo 0,5
cursore: c = -3 da -12 a 16 passo 0,5
finestra: x da -9 a 11, y da -11 a 5
valore: C = \left(-\frac{a}{2};-\frac{b}{2}\right)
valore: \alpha^2+\beta^2-c = \frac{a^2}{4}+\frac{b^2}{4}-c
domanda: Alza $c$ fino a $13$: che cosa diventa la circonferenza? E con $c$ più grande di $13$?
```

Con $c = 13$ il valore $\alpha^2 + \beta^2 - c$ è zero e la circonferenza si riduce al centro; con $c$ più grande è negativo e non resta nessun punto. Sono i casi della sezione "Quando l'equazione non è una circonferenza".
```

```ad-warning
Il raggio non è la radice di c
Nell'esempio 2 il termine noto è $c = -3$, e il raggio non è né $3$ né $\sqrt{3}$: nel termine noto ci sono anche i quadrati delle coordinate del centro, perché $c = \alpha^2 + \beta^2 - r^2$. Solo quando il centro è l'origine si ha $c = -r^2$.
```

```ad-tip
Lo stesso conto con il completamento del quadrato
Se non ricordi le formule, raggruppa i termini in $x$ e quelli in $y$ e aggiungi a ogni gruppo il numero che lo rende un quadrato di binomio, aggiungendolo anche a secondo membro:

$$
\begin{gathered}
(x^2 - 4x) + (y^2 + 6y) = 3 \\
(x^2 - 4x + 4) + (y^2 + 6y + 9) = 3 + 4 + 9 \\
(x - 2)^2 + (y + 3)^2 = 16
\end{gathered}
$$

Il numero da aggiungere è il quadrato della metà del coefficiente di $x$ (o di $y$).
```

### Quando l'equazione non è una circonferenza

Il completamento del quadrato, fatto con le lettere, trasforma $x^2 + y^2 + ax + by + c = 0$ in

$$(x - \alpha)^2 + (y - \beta)^2 = \alpha^2 + \beta^2 - c$$

con $\alpha = -\dfrac{a}{2}$ e $\beta = -\dfrac{b}{2}$. Il primo membro è una somma di quadrati, che non è mai negativa. Tutto dipende quindi dal segno del secondo membro.

| $\alpha^2 + \beta^2 - c$ | L'equazione rappresenta |
|---|---|
| positivo | una circonferenza di raggio $\sqrt{\alpha^2 + \beta^2 - c}$ |
| zero | il solo punto $(\alpha, \beta)$ |
| negativo | nessun punto |

Prima di parlare di centro e raggio va controllato che $\alpha^2 + \beta^2 - c$ sia positivo.

```ad-example
Esempio 3: un punto solo oppure nessuno
Stabilisci che cosa rappresentano le equazioni $x^2 + y^2 - 2x + 4y + 5 = 0$ e $x^2 + y^2 + 2x + 3 = 0$.

Nella prima $\alpha = 1$, $\beta = -2$ e $c = 5$:

$$\alpha^2 + \beta^2 - c = 1 + 4 - 5 = 0$$

L'equazione equivale a $(x - 1)^2 + (y + 2)^2 = 0$: una somma di due quadrati vale zero solo se valgono zero tutti e due, quindi l'unico punto è $(1, -2)$.

Nella seconda $\alpha = -1$, $\beta = 0$ (manca il termine in $y$) e $c = 3$:

$$\alpha^2 + \beta^2 - c = 1 + 0 - 3 = -2$$

L'equazione equivale a $(x + 1)^2 + y^2 = -2$, che nessun punto può rendere vera: non rappresenta nessuna figura.
```

Se i coefficienti di $x^2$ e $y^2$ sono uguali tra loro ma diversi da $1$, prima di tutto si divide l'equazione per quel coefficiente. Se invece sono diversi, come in $x^2 + 4y^2 = 4$, o se compare il termine $xy$, l'equazione non è quella di una circonferenza.

```ad-example
Esempio 4: coefficienti da dividere e centro con le frazioni
Trova centro e raggio di $2x^2 + 2y^2 - 2x + 6y - 3 = 0$.

I coefficienti di $x^2$ e $y^2$ valgono tutti e due $2$: dividi per $2$.

$$x^2 + y^2 - x + 3y - \frac{3}{2} = 0$$

Ora $a = -1$, $b = 3$, $c = -\dfrac{3}{2}$:

$$
\begin{gathered}
\alpha = \frac{1}{2} \qquad \beta = -\frac{3}{2} \\
\alpha^2 + \beta^2 - c = \frac{1}{4} + \frac{9}{4} + \frac{3}{2} = 4
\end{gathered}
$$

Il valore è positivo: è una circonferenza, con centro $C\Big(\dfrac{1}{2}, -\dfrac{3}{2}\Big)$ e raggio $\sqrt{4} = 2$.
```

```ad-warning
Leggere a, b e c senza dividere
In $2x^2 + 2y^2 - 2x + 6y - 3 = 0$ i numeri $-2$, $6$ e $-3$ non sono $a$, $b$ e $c$: le formule del centro e del raggio valgono solo quando $x^2$ e $y^2$ hanno coefficiente $1$. Senza dividere otterresti il centro $(1, -3)$, che è sbagliato.
```

### Che cosa dicono i coefficienti

Dalle formule $\alpha = -\dfrac{a}{2}$, $\beta = -\dfrac{b}{2}$ e dalla sostituzione di $(0, 0)$ nell'equazione si leggono alcuni casi a colpo d'occhio.

| Coefficiente nullo | Equazione | La circonferenza |
|---|---|---|
| $a = 0$ | $x^2 + y^2 + by + c = 0$ | ha il centro sull'asse $y$ |
| $b = 0$ | $x^2 + y^2 + ax + c = 0$ | ha il centro sull'asse $x$ |
| $c = 0$ | $x^2 + y^2 + ax + by = 0$ | passa per l'origine |
| $a = 0$ e $b = 0$ | $x^2 + y^2 + c = 0$ | ha il centro nell'origine |

Per esempio $x^2 + y^2 - 6x = 0$ ha il centro $(3, 0)$ sull'asse $x$ e passa per l'origine; il suo raggio è $\sqrt{9 + 0 - 0} = 3$.

```tikz
% nome: circonferenza-per-origine-centro-asse-x
% alt: La circonferenza x² + y² - 6x = 0: ha il centro C(3, 0) sull'asse x, perché manca il termine in y, e passa per l'origine O, perché manca il termine noto
% svg: circonferenza-per-origine-centro-asse-x-c482dc24.svg 207x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-2,-4) grid (7,4);
\draw[->] (-2.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60] (3,0) circle (3);
\fill (3,0) circle (0.13);
\fill (0,0) circle (0.13);
\node[above] at (3,0.1) {$C$};
\node[below left] at (0,0) {$O$};
\node[below right] at (6,0) {\small $6$};
\end{tikzpicture}
```
```grafico
% nome: circonferenza-coefficienti-nulli-cursori
% alt: La circonferenza x² + y² + ax + by + c = 0 con i cursori di a, b e c, il centro e l'origine: con c = 0 passa per l'origine qualunque siano a e b, con b = 0 il centro resta sull'asse x, con c negativo l'origine è interna
curva: x^2+y^2+ax+by+c=0
curva: C=\left(-\frac{a}{2};-\frac{b}{2}\right) | nero
curva: O=\left(0;0\right) | rosso
cursore: a = -6 da -8 a 8 passo 1
cursore: b = 0 da -8 a 8 passo 1
cursore: c = 0 da -9 a 0 passo 1
finestra: x da -11 a 11, y da -9 a 9
valore: C = \left(-\frac{a}{2};-\frac{b}{2}\right)
valore: r = \sqrt{\frac{a^2}{4}+\frac{b^2}{4}-c}
domanda: Con $c = 0$ muovi $a$ e $b$: la circonferenza lascia mai l'origine? Poi porta $c$ sotto zero: l'origine è dentro o fuori?
```

Con $c = 0$ la circonferenza passa per l'origine qualunque siano $a$ e $b$; se anche $a$ e $b$ sono zero resta la sola origine. Con $c < 0$ l'origine è interna: sostituendo $(0, 0)$ il primo membro vale $c$, che è negativo, e questo vuol dire che la distanza dell'origine dal centro è minore del raggio.

## Trovare l'equazione da condizioni

Nell'equazione $x^2 + y^2 + ax + by + c = 0$ ci sono tre coefficienti da determinare, e lo stesso vale per $\alpha$, $\beta$ e $r$ nell'altra forma: per individuare una circonferenza servono tre condizioni. Conoscere il centro vale per due, perché dà due coordinate; il passaggio per un punto vale per una.

### Centro e un punto

Il raggio è la distanza tra il centro e il punto.

```ad-example
Esempio 5: centro e passaggio per un punto
Scrivi l'equazione della circonferenza di centro $C(1, -2)$ che passa per $A(4, 2)$.

Il quadrato del raggio è il quadrato della distanza $\overline{CA}$:

$$r^2 = (4 - 1)^2 + (2 + 2)^2 = 9 + 16 = 25$$

Quindi $r = 5$ e l'equazione è $(x - 1)^2 + (y + 2)^2 = 25$, che in forma generale diventa

$$x^2 + y^2 - 2x + 4y - 20 = 0$$
```

### Gli estremi di un diametro

Il centro è il punto medio del diametro, e il raggio è la distanza del centro da uno dei due estremi.

```ad-example
Esempio 6: il diametro
Scrivi l'equazione della circonferenza che ha per diametro il segmento di estremi $A(-1, 3)$ e $B(5, -1)$.

Il centro è il punto medio di $AB$:

$$C\Big(\frac{-1 + 5}{2}, \frac{3 - 1}{2}\Big) = C(2, 1)$$

Il quadrato del raggio è $\overline{CA}^2$:

$$r^2 = (-1 - 2)^2 + (3 - 1)^2 = 9 + 4 = 13$$

L'equazione è $(x - 2)^2 + (y - 1)^2 = 13$, cioè $x^2 + y^2 - 4x - 2y - 8 = 0$. Il raggio è $\sqrt{13}$, e non serve calcolarlo: nell'equazione entra $r^2$.

```tikz
% nome: circonferenza-diametro-ab
% alt: La circonferenza che ha per diametro il segmento di estremi A(-1, 3) e B(5, -1): il centro C(2, 1) è il punto medio del diametro
% svg: circonferenza-diametro-ab-edc3d91c.svg 172x172
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-2,-3) grid (6,5);
\draw[->] (-2.3,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.6) node[above] {$y$};
\draw[thick, blue!60] (2,1) circle (3.606);
\draw[thick, red!50] (-1,3) -- (5,-1);
\fill (2,1) circle (0.14);
\fill (-1,3) circle (0.14);
\fill (5,-1) circle (0.14);
\node[above right] at (2,1) {$C$};
\node[above left] at (-1,3) {$A$};
\node[below right] at (5,-1) {$B$};
\end{tikzpicture}
```
```

### Tre punti

Per tre punti non allineati passa una sola circonferenza: è quella circoscritta al triangolo che ha i tre punti come vertici. Per trovarla si sostituiscono le coordinate di ogni punto in $x^2 + y^2 + ax + by + c = 0$: ogni punto dà un'equazione di primo grado nelle incognite $a$, $b$, $c$, e le tre equazioni formano un sistema, come nella lezione [Determinanti e regola di Cramer](/materiale/scuola-superiore/matematica/sistemi-lineari/determinanti-e-regola-di-cramer).

```ad-example
Esempio 7: la circonferenza per tre punti
Trova la circonferenza che passa per $A(4, 3)$, $B(0, 5)$ e $D(-2, 3)$.

Sostituisci le coordinate dei tre punti. Per $A$: $16 + 9 + 4a + 3b + c = 0$. Per $B$: $0 + 25 + 5b + c = 0$. Per $D$: $4 + 9 - 2a + 3b + c = 0$.

$$
\begin{cases}
4a + 3b + c = -25 \\
5b + c = -25 \\
-2a + 3b + c = -13
\end{cases}
$$

In tutte e tre le equazioni $c$ ha coefficiente $1$, quindi sottraendo le equazioni a due a due $c$ sparisce. Prima meno seconda: $4a - 2b = 0$, cioè $b = 2a$. Seconda meno terza: $2a + 2b = -12$. Sostituendo $b = 2a$:

$$
\begin{gathered}
2a + 4a = -12 \\
\Rightarrow a = -2 \\
\Rightarrow b = -4
\end{gathered}
$$

Dalla seconda equazione, $c = -25 - 5b = -25 + 20 = -5$. La circonferenza è

$$x^2 + y^2 - 2x - 4y - 5 = 0$$

con centro $C(1, 2)$ e raggio $\sqrt{1 + 4 + 5} = \sqrt{10}$. Verifica con il punto $D$: $4 + 9 + 4 - 12 - 5 = 0$.

```tikz
% nome: circonferenza-per-tre-punti
% alt: La circonferenza che passa per i tre punti A(4, 3), B(0, 5) e D(-2, 3), con il centro C(1, 2): è la circonferenza circoscritta al triangolo ABD, disegnato tratteggiato
% svg: circonferenza-per-tre-punti-4e36d3a6.svg 189x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-3,-2) grid (5,6);
\draw[->] (-3.3,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-2.3) -- (0,6.6) node[above] {$y$};
\draw[thick, blue!60] (1,2) circle (3.162);
\draw[dashed, gray] (4,3) -- (0,5) -- (-2,3) -- cycle;
\fill (1,2) circle (0.13);
\fill (4,3) circle (0.13);
\fill (0,5) circle (0.13);
\fill (-2,3) circle (0.13);
\node[below] at (1,2) {$C$};
\node[right] at (4.1,3) {$A$};
\node[above right] at (0,5.05) {$B$};
\node[left] at (-2.1,3) {$D$};
\end{tikzpicture}
```
```

```ad-note
Il centro come incontro degli assi
Il centro è equidistante da $A$, da $B$ e da $D$, quindi sta sull'asse di $AB$ e sull'asse di $BD$: si può trovare anche come intersezione di due assi, scritti come nella lezione [Rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari). Se i tre punti sono allineati gli assi sono paralleli, il sistema in $a$, $b$, $c$ è impossibile e la circonferenza non esiste.
```

### Due punti e il centro su una retta

Se il centro deve stare su una retta data, le sue coordinate si scrivono con una sola lettera, e la condizione che lo determina è che abbia la stessa distanza dai due punti.

```ad-example
Esempio 8: centro su una retta
Trova la circonferenza che passa per $A(0, 1)$ e $B(4, 3)$ e ha il centro sulla retta $y = x - 3$.

Un punto della retta ha coordinate $(\alpha, \alpha - 3)$. Il centro $C$ è equidistante da $A$ e da $B$, quindi $\overline{CA}^2 = \overline{CB}^2$:

$$
\begin{gathered}
\alpha^2 + (\alpha - 4)^2 = \\
= (\alpha - 4)^2 + (\alpha - 6)^2
\end{gathered}
$$

Il termine $(\alpha - 4)^2$ compare in tutti e due i membri e si cancella:

$$
\begin{gathered}
\alpha^2 = \alpha^2 - 12\alpha + 36 \\
\Rightarrow 12\alpha = 36 \\
\Rightarrow \alpha = 3
\end{gathered}
$$

Il centro è $C(3, 0)$, e $r^2 = \overline{CA}^2 = 9 + 1 = 10$. L'equazione è $(x - 3)^2 + y^2 = 10$, cioè

$$x^2 + y^2 - 6x - 1 = 0$$

Verifica con $B$: $16 + 9 - 24 - 1 = 0$.

```tikz
% nome: circonferenza-due-punti-centro-su-retta
% alt: La circonferenza che passa per A(0, 1) e B(4, 3) con il centro C(3, 0) sulla retta y = x - 3: i raggi CA e CB sono uguali
% svg: circonferenza-due-punti-centro-su-retta-092f7918.svg 189x189
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-1,-4) grid (7,4);
\draw[->] (-1.3,0) -- (7.6,0) node[right] {$x$};
\draw[->] (0,-4.3) -- (0,4.6) node[above] {$y$};
\draw[thick, blue!60] (3,0) circle (3.162);
\draw[thick, red!50] (-0.5,-3.5) -- (7,4);
\draw[dashed, gray] (0,1) -- (3,0) -- (4,3);
\fill (3,0) circle (0.13);
\fill (0,1) circle (0.13);
\fill (4,3) circle (0.13);
\node[below right] at (3,0) {$C$};
\node[above left] at (0,1) {$A$};
\node[above] at (4,3.1) {$B$};
\node[red!60!black, right] at (0.3,-3.5) {\small $y = x - 3$};
\end{tikzpicture}
```
```grafico
% nome: circonferenza-centro-su-retta-cursore
% alt: Il centro C si muove sulla retta y = x - 3 con il cursore α, e la circonferenza di centro C passa sempre per A(0, 1): sotto il piano sono scritti i quadrati delle distanze di C da A e da B(4, 3), che sono uguali solo per α = 3, quando la circonferenza passa anche per B
curva: \left(x-\alpha\right)^2+\left(y-\alpha+3\right)^2=\alpha^2+\left(\alpha-4\right)^2
curva: y=x-3 | tratteggiata | grigio
curva: C=\left(\alpha;\alpha-3\right) | nero
curva: A=\left(0;1\right) | rosso
curva: B=\left(4;3\right) | rosso
cursore: \alpha = 1 da -2 a 6 passo 0,5
finestra: x da -9 a 13, y da -9 a 9
valore: \overline{CA}^2 = \alpha^2+\left(\alpha-4\right)^2
valore: \overline{CB}^2 = \left(\alpha-4\right)^2+\left(\alpha-6\right)^2
domanda: La circonferenza passa sempre per $A$. Muovi $\alpha$ finché passa anche per $B$: per quale valore succede?
```

Succede solo per $\alpha = 3$, quando i due quadrati valgono tutti e due $10$: è la soluzione dell'equazione $\overline{CA}^2 = \overline{CB}^2$.
```

Le condizioni che riguardano una retta tangente, e tutto quello che succede tra una circonferenza e una retta o tra due circonferenze, sono nella lezione [Circonferenza e rette](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/circonferenza-e-rette).
