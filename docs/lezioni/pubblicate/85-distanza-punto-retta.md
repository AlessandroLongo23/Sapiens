# Distanza di un punto da una retta

Una casa di campagna è a qualche centinaio di metri da una strada diritta, e bisogna costruire il vialetto più corto che la collega alla strada: il vialetto più corto è quello perpendicolare alla strada. Nel piano cartesiano la distanza di un punto da una retta si misura nello stesso modo, lungo la perpendicolare, e una formula la calcola dalle coordinate del punto e dai coefficienti della retta, senza cercare il punto in cui la perpendicolare arriva. Per seguire la lezione servono la [distanza tra due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio), l'[equazione della retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari) in forma implicita e le [rette perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari).

## Che cos'è la distanza di un punto da una retta

Da un punto $P$ si traccia la perpendicolare alla retta $r$, e si chiama $H$ il punto in cui la incontra: $H$ è la [proiezione](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari) di $P$ su $r$. La **distanza del punto $P$ dalla retta $r$** è la lunghezza del segmento $PH$, e si scrive $d(P, r)$:

$$d(P, r) = \overline{PH}$$

È la più corta tra le distanze di $P$ dai punti della retta. Se $Q$ è un altro punto di $r$, il triangolo $PHQ$ è rettangolo in $H$ e $PQ$ è la sua ipotenusa, più lunga del cateto $PH$. Nella figura $\overline{PH} = 2$, mentre $\overline{PQ} = 2\sqrt{5}$, circa $4{,}47$.

```tikz
% nome: distanza-punto-retta-proiezione
% alt: Il punto P di coordinate 4 e 3, la retta r di equazione 3x + 4y - 14 = 0, la proiezione H di P su r con l'angolo retto, e un altro punto Q della retta collegato a P da un segmento tratteggiato più lungo di PH
% svg: distanza-punto-retta-proiezione-4af181ce.svg 175x151
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-0.5,-1.5) grid (6.5,4.5);
\draw[->] (-0.5,0) -- (7.2,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,4.8) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.1) -- (\x,-0.1);
\foreach \x in {2,4} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {-1,1,2,3,4} \draw (0.1,\y) -- (-0.1,\y);
\foreach \y in {2,4} \node[left] at (-0.1,\y) {\small $\y$};
\node[below left] at (0,0) {\small $O$};
\draw[thick, blue!60] (-0.3,3.725) -- (6.8,-1.6) node[right] {$r$};
\draw[thick] (4,3) -- (2.8,1.4);
\draw[dashed] (4,3) -- (6,-1);
\draw (3.04,1.22) -- (3.22,1.46) -- (2.98,1.64);
\fill (4,3) circle (0.1) node[above right] {$P$};
\fill (2.8,1.4) circle (0.1) node[below left] {$H$};
\fill (6,-1) circle (0.1) node[below left] {$Q$};
\end{tikzpicture}
```
```grafico
% nome: distanza-punto-retta-minimo-cursore
% alt: Il punto P(4; 3), la retta r di equazione 3x + 4y - 14 = 0 e un punto Q che scorre sulla retta con il cursore della sua ascissa s, unito a P da un segmento tratteggiato: sotto il piano è scritta la lunghezza di PQ, che è più piccola quando PQ è perpendicolare alla retta
curva: 3x+4y-14=0
curva: P=\left(4;3\right) | nero
curva: Q=\left(s;\frac{14-3s}{4}\right) | nero
curva: \left(4+t\left(s-4\right);3+t\left(\frac{14-3s}{4}-3\right)\right) | rosso | tratteggiata | t da 0 a 1
cursore: s = 6 da -2 a 8 passo 0,2
finestra: x da -3 a 9, y da -3 a 6
valore: \overline{PQ} = \sqrt{\left(s-4\right)^2+\left(\frac{14-3s}{4}-3\right)^2}
domanda: Fai scorrere $Q$ sulla retta con il cursore $s$, la sua ascissa: qual è il valore più piccolo di $\overline{PQ}$? Come sta il segmento $PQ$ rispetto alla retta in quel momento?
```

Se $P$ sta sulla retta, $H$ coincide con $P$ e la distanza è $0$. Se $P$ non sta sulla retta, la distanza è un numero positivo.

## Rette parallele agli assi

Se la retta è orizzontale, la perpendicolare da $P$ è verticale, quindi $H$ ha la stessa ascissa di $P$ e la distanza è quella tra due punti sulla stessa verticale: la differenza delle ordinate, presa in [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto). Per una retta verticale vale lo stesso con le ascisse. Con $P(x_0, y_0)$ e la retta orizzontale $r$ di equazione $y = k$:

$$d(P, r) = |y_0 - k|$$

e con la retta verticale $r$ di equazione $x = h$:

$$d(P, r) = |x_0 - h|$$

L'asse $x$ ha equazione $y = 0$, quindi la distanza di $P$ dall'asse $x$ è $|y_0|$; allo stesso modo la distanza dall'asse $y$ è $|x_0|$.

```ad-example
Esempio 1: una retta orizzontale e una verticale
Calcola la distanza del punto $P(3, -2)$ dalla retta $r$ di equazione $y = 4$ e dalla retta $s$ di equazione $x = -1$.

La retta $r$ è orizzontale: si confrontano le ordinate, $d(P, r) = |-2 - 4| = |-6| = 6$. La retta $s$ è verticale: si confrontano le ascisse, $d(P, s) = |3 - (-1)| = 4$.

Dagli assi, invece, $P$ dista $|-2| = 2$ (asse $x$) e $|3| = 3$ (asse $y$).

```tikz
% nome: distanza-punto-rette-parallele-assi
% alt: Il punto P di coordinate 3 e -2, la retta orizzontale r di equazione y = 4 e la retta verticale s di equazione x = -1; il segmento verticale da P a r è lungo 6, quello orizzontale da P a s è lungo 4
% svg: distanza-punto-rette-parallele-assi-03ffcf98.svg 144x176
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-2,-3) grid (4,5);
\draw[->] (-2.5,0) -- (4.8,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,5.8) node[above] {$y$};
\foreach \x in {-2,-1,1,2,3,4} \draw (\x,0.12) -- (\x,-0.12);
\foreach \y in {-3,-2,-1,1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y);
\foreach \x in {1,2} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {1,2} \node[left] at (-0.1,\y) {\small $\y$};
\draw[thick, blue!60] (-2.3,4) -- (4.5,4) node[right] {$r$};
\draw[thick, red!50] (-1,-3.2) -- (-1,5.3) node[above] {$s$};
\draw[dashed] (3,-2) -- (3,4);
\draw[dashed] (3,-2) -- (-1,-2);
\node[right] at (3,1) {\small $6$};
\node[below] at (1,-2) {\small $4$};
\fill (3,-2) circle (0.13) node[below right] {$P$};
\end{tikzpicture}
```
```

```ad-warning
La coordinata sbagliata
La retta $x = -1$ è verticale, quindi la distanza da lei si misura in orizzontale, con le ascisse. Chi guarda la $x$ dell'equazione e la confronta con l'ordinata di $P$ trova $|-2 - (-1)| = 1$, che non è la distanza di niente.
```

## La formula della distanza

Per una retta qualsiasi si può trovare la proiezione $H$ e poi misurare $\overline{PH}$, ma servono parecchi conti (li trovi nella sezione "Da dove viene la formula"). La formula dà la distanza direttamente. Si scrive la retta $r$ in forma implicita, $ax + by + c = 0$, e si prende il punto $P(x_0, y_0)$:

$$d(P, r) = \frac{|ax_0 + by_0 + c|}{\sqrt{a^2 + b^2}}$$

Al numeratore c'è il primo membro dell'equazione della retta calcolato nelle coordinate di $P$, in valore assoluto; al denominatore la radice della somma dei quadrati dei coefficienti di $x$ e di $y$. Il termine noto $c$ compare solo al numeratore. Il denominatore non è mai zero, perché nell'equazione di una retta $a$ e $b$ non sono tutti e due zero. Il numeratore invece è zero esattamente quando le coordinate di $P$ rendono vera l'equazione, cioè quando $P$ sta sulla retta.

Il procedimento:

1. Scrivi la retta in forma implicita $ax + by + c = 0$, con tutti i termini a primo membro.
2. Leggi $a$, $b$ e $c$, ognuno con il suo segno.
3. Calcola $ax_0 + by_0 + c$ e prendine il valore assoluto.
4. Dividi per $\sqrt{a^2 + b^2}$.
5. Semplifica il risultato e, se al denominatore resta una radice, [razionalizza](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione).

```ad-example
Esempio 2: la formula
Calcola la distanza del punto $P(4, 3)$ dalla retta $r$ di equazione $3x + 4y - 14 = 0$.

La retta è già in forma implicita, con $a = 3$, $b = 4$ e $c = -14$. Al numeratore $|3 \cdot 4 + 4 \cdot 3 - 14| = |10| = 10$, al denominatore $\sqrt{9 + 16} = \sqrt{25} = 5$:

$$
\begin{aligned}
d(P, r) &= \frac{|12 + 12 - 14|}{\sqrt{3^2 + 4^2}} \\
&= \frac{10}{5} = 2
\end{aligned}
$$

Sono il punto e la retta della prima figura: $\overline{PH} = 2$.
```

```ad-example
Esempio 3: la retta in forma esplicita
Calcola la distanza del punto $P(2, -1)$ dalla retta $r$ di equazione $y = 2x + 3$.

Prima si porta la retta in forma implicita: spostando $y$ a secondo membro si ottiene $0 = 2x - y + 3$, cioè $2x - y + 3 = 0$. Quindi $a = 2$, $b = -1$, $c = 3$.

$$
\begin{aligned}
d(P, r) &= \frac{|2 \cdot 2 - (-1) + 3|}{\sqrt{2^2 + (-1)^2}} \\
&= \frac{|4 + 1 + 3|}{\sqrt{5}} = \frac{8}{\sqrt{5}}
\end{aligned}
$$

Al denominatore c'è una radice: moltiplica numeratore e denominatore per $\sqrt{5}$.

$$d(P, r) = \frac{8\sqrt{5}}{5}$$

Con la forma implicita $-2x + y - 3 = 0$, che si ottiene spostando tutto a primo membro, il numeratore è $|-4 - 1 - 3| = |-8| = 8$: il risultato è lo stesso.
```

```ad-warning
Leggere i coefficienti dalla forma esplicita
In $y = 2x + 3$ il coefficiente di $y$ è $1$, ma nella forma implicita $2x - y + 3 = 0$ diventa $-1$. Chi prende $a = 2$, $b = 1$, $c = 3$ senza portare tutto a primo membro calcola $|4 - 1 + 3| = 6$ e trova $\dfrac{6}{\sqrt{5}}$, che è sbagliato. La formula vale solo con la retta scritta come $ax + by + c = 0$.
```

```ad-warning
Il denominatore
Al denominatore c'è $\sqrt{a^2 + b^2}$: $c$ non c'entra, e la radice di una somma non si spezza. Nell'esempio 3, $\sqrt{2^2 + (-1)^2} = \sqrt{5}$: non è $2 + 1$, e il quadrato di $-1$ è $1$, non $-1$.
```

```ad-example
Esempio 4: coefficienti frazionari e numeratore negativo
Calcola la distanza del punto $P(-3, 1)$ dalla retta $r$ di equazione $y = \dfrac{1}{2}x - 1$.

Per togliere la frazione moltiplica per $2$ tutti e due i membri: $2y = x - 2$, cioè $x - 2y - 2 = 0$. Quindi $a = 1$, $b = -2$, $c = -2$.

$$
\begin{aligned}
d(P, r) &= \frac{|-3 - 2 \cdot 1 - 2|}{\sqrt{1^2 + (-2)^2}} \\
&= \frac{|-7|}{\sqrt{5}} = \frac{7}{\sqrt{5}} \\
&= \frac{7\sqrt{5}}{5}
\end{aligned}
$$

Se usi la forma $\dfrac{1}{2}x - y - 1 = 0$, senza moltiplicare per $2$, il numeratore è $\left|-\dfrac{3}{2} - 1 - 1\right| = \dfrac{7}{2}$ e il denominatore $\sqrt{\dfrac{1}{4} + 1} = \dfrac{\sqrt{5}}{2}$: il rapporto è ancora $\dfrac{7}{\sqrt{5}}$. Moltiplicare l'equazione per un numero diverso da zero moltiplica per lo stesso numero numeratore e denominatore, quindi la distanza non cambia; togliere le frazioni serve solo a fare conti più comodi.
```

```ad-warning
Dimenticare il valore assoluto
Senza valore assoluto l'esempio 4 darebbe $-\dfrac{7}{\sqrt{5}}$, ma una distanza non è mai negativa. Il segno di $ax_0 + by_0 + c$ dice solo da quale parte della retta sta $P$; per la distanza conta il valore assoluto.
```

```ad-tip
La distanza dall'origine
Per l'origine $O(0, 0)$ il numeratore è $|c|$, quindi $d(O, r) = \dfrac{|c|}{\sqrt{a^2 + b^2}}$. Per esempio l'origine dista $\dfrac{|-10|}{\sqrt{9 + 16}} = \dfrac{10}{5} = 2$ dalla retta $3x + 4y - 10 = 0$.
```

## Da dove viene la formula

Senza formula, la distanza si trova in tre passi: si scrive la retta perpendicolare a $r$ che passa per $P$, si trova la proiezione $H$ come punto d'incontro delle due rette e si calcola la distanza tra $P$ e $H$. Nell'esempio 5 lo facciamo con i dati dell'esempio 2, per vedere che il risultato è lo stesso.

```ad-example
Esempio 5: con la proiezione
Trova la proiezione $H$ del punto $P(4, 3)$ sulla retta $r$ di equazione $3x + 4y - 14 = 0$ e calcola $\overline{PH}$.

La retta $r$ ha [coefficiente angolare](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti) $m = -\dfrac{3}{4}$, quindi le perpendicolari hanno coefficiente angolare $\dfrac{4}{3}$. La perpendicolare per $P$ è

$$
\begin{gathered}
y - 3 = \frac{4}{3}(x - 4) \\
4x - 3y - 7 = 0
\end{gathered}
$$

Il punto $H$ è l'[intersezione](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette) delle due rette, cioè la soluzione del sistema

$$
\begin{cases}
3x + 4y = 14 \\
4x - 3y = 7
\end{cases}
$$

Moltiplica la prima equazione per $3$ e la seconda per $4$ e sommale: $25x = 70$, quindi $x = \dfrac{14}{5}$; dalla prima equazione $4y = 14 - \dfrac{42}{5} = \dfrac{28}{5}$ e $y = \dfrac{7}{5}$. Il punto è $H\left(\dfrac{14}{5}, \dfrac{7}{5}\right)$. Le differenze delle coordinate tra $P$ e $H$ sono $4 - \dfrac{14}{5} = \dfrac{6}{5}$ e $3 - \dfrac{7}{5} = \dfrac{8}{5}$, quindi

$$
\begin{aligned}
\overline{PH} &= \sqrt{\frac{36}{25} + \frac{64}{25}} \\
&= \sqrt{4} = 2
\end{aligned}
$$

come con la formula.
```

La formula fa questi conti una volta per tutte, con le lettere al posto dei numeri. La dimostrazione più corta non ha nemmeno bisogno di trovare $H$: usa un triangolo rettangolo e la sua area.

```ad-note
La dimostrazione
Prendi $P(x_0, y_0)$ fuori dalla retta $ax + by + c = 0$, con $a \neq 0$ e $b \neq 0$ (se uno dei due è zero la retta è parallela a un asse, e il caso è già risolto). Chiama $N = ax_0 + by_0 + c$, che non è zero perché $P$ non sta sulla retta.

La retta orizzontale per $P$ incontra $r$ nel punto $A$, la verticale nel punto $B$. $A$ ha ordinata $y_0$, e dall'equazione della retta $ax_A + by_0 + c = 0$, cioè $x_A = -\dfrac{by_0 + c}{a}$. Quindi

$$x_0 - x_A = \frac{ax_0 + by_0 + c}{a} = \frac{N}{a}$$

e $\overline{PA} = \dfrac{|N|}{|a|}$. Allo stesso modo $\overline{PB} = \dfrac{|N|}{|b|}$.

```tikz
% nome: distanza-punto-retta-dimostrazione-triangolo
% alt: Il punto P di coordinate 4 e 3 e la retta r di equazione 3x + 4y - 14 = 0; la parallela all'asse x per P incontra r in A, la parallela all'asse y in B; il triangolo PAB è rettangolo in P e PH è l'altezza relativa all'ipotenusa AB
% svg: distanza-punto-retta-dimostrazione-triangolo-78c70d89.svg 175x149
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (-0.5,-1.5) grid (6.5,4.5);
\draw[->] (-0.5,0) -- (7.2,0) node[right] {$x$};
\draw[->] (0,-1.8) -- (0,4.8) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.1) -- (\x,-0.1);
\foreach \x in {2,4,6} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {-1,1,2,3,4} \draw (0.1,\y) -- (-0.1,\y);
\foreach \y in {2,4} \node[left] at (-0.1,\y) {\small $\y$};
\node[below left] at (0,0) {\small $O$};
\draw[thick, blue!60] (-0.3,3.725) -- (6.8,-1.6) node[right] {$r$};
\draw[thick, red!50] (0.667,3) -- (4,3) -- (4,0.5);
\draw (3.7,3) -- (3.7,2.7) -- (4,2.7);
\draw[thick] (4,3) -- (2.8,1.4);
\draw (3.04,1.22) -- (3.22,1.46) -- (2.98,1.64);
\fill (4,3) circle (0.1) node[above right] {$P$};
\fill (0.667,3) circle (0.1) node[above right] {$A$};
\fill (4,0.5) circle (0.1) node[right] {$B$};
\fill (2.8,1.4) circle (0.1) node[below left] {$H$};
\end{tikzpicture}
```

Il triangolo $PAB$ è rettangolo in $P$, perché $PA$ è orizzontale e $PB$ è verticale. Con il teorema di Pitagora

$$
\begin{aligned}
\overline{AB}^{\,2} &= \frac{N^2}{a^2} + \frac{N^2}{b^2} \\
&= \frac{N^2(a^2 + b^2)}{a^2 b^2}
\end{aligned}
$$

quindi $\overline{AB} = \dfrac{|N|\sqrt{a^2 + b^2}}{|a| \cdot |b|}$. Il segmento $PH$ è l'altezza relativa all'ipotenusa $AB$. L'[area del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree) si può calcolare con i due cateti o con l'ipotenusa e l'altezza, $\dfrac{\overline{PA} \cdot \overline{PB}}{2} = \dfrac{\overline{AB} \cdot \overline{PH}}{2}$, e quindi

$$
\begin{aligned}
\overline{PH} &= \frac{\overline{PA} \cdot \overline{PB}}{\overline{AB}} \\
&= \frac{N^2}{|a| \cdot |b|} \cdot \frac{|a| \cdot |b|}{|N|\sqrt{a^2 + b^2}} \\
&= \frac{|N|}{\sqrt{a^2 + b^2}}
\end{aligned}
$$

che è la formula. Con i numeri dell'esempio 2, $\overline{PA} = \dfrac{10}{3}$, $\overline{PB} = \dfrac{5}{2}$, $\overline{AB} = \dfrac{25}{6}$ e $\overline{PH} = \dfrac{25}{3} : \dfrac{25}{6} = 2$.
```

## Distanza tra due rette parallele

Se due rette $r$ e $s$ sono [parallele](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari), tutti i punti di $r$ hanno la stessa distanza da $s$: questa è la **distanza tra le due rette**, e si scrive $d(r, s)$. Per calcolarla si sceglie un punto di $r$ con coordinate comode, per esempio quello che sta su un asse, e si calcola la sua distanza da $s$. Due rette incidenti hanno invece un punto in comune, e il calcolo ha senso solo per le parallele.

Se le due equazioni hanno gli stessi coefficienti $a$ e $b$, cioè $r\colon ax + by + c = 0$ e $s\colon ax + by + c' = 0$, c'è anche una formula diretta:

$$d(r, s) = \frac{|c - c'|}{\sqrt{a^2 + b^2}}$$

```ad-example
Esempio 6: due rette parallele
Verifica che le rette $r\colon 3x - 4y + 8 = 0$ e $s\colon 6x - 8y - 9 = 0$ sono parallele e calcola la loro distanza.

I coefficienti di $x$ e di $y$ sono proporzionali, $\dfrac{6}{3} = \dfrac{-8}{-4} = 2$, mentre i termini noti no: le rette sono parallele e distinte. Il punto di $r$ con $x = 0$ ha $-4y + 8 = 0$, cioè $y = 2$: è $P(0, 2)$. La sua distanza da $s$ è

$$
\begin{aligned}
d(P, s) &= \frac{|6 \cdot 0 - 8 \cdot 2 - 9|}{\sqrt{36 + 64}} \\
&= \frac{|-25|}{10} = \frac{5}{2}
\end{aligned}
$$

Con la formula diretta bisogna prima dare alle due equazioni gli stessi $a$ e $b$: dividendo per $2$ l'equazione di $s$ si ottiene $3x - 4y - \dfrac{9}{2} = 0$, e

$$
\begin{aligned}
d(r, s) &= \frac{\left|8 - \left(-\frac{9}{2}\right)\right|}{\sqrt{9 + 16}} \\
&= \frac{25}{2} : 5 = \frac{5}{2}
\end{aligned}
$$

```tikz
% nome: distanza-tra-rette-parallele
% alt: Le rette parallele r di equazione 3x - 4y + 8 = 0 e s di equazione 6x - 8y - 9 = 0; il punto P di coordinate 0 e 2 sulla retta r e la sua proiezione H di coordinate 3/2 e 0 sulla retta s, con l'angolo retto: PH è la distanza tra le rette, 5/2
% svg: distanza-tra-rette-parallele-bef21ef5.svg 155x164
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-2.5,-2.5) grid (4.5,5);
\draw[->] (-2.5,0) -- (5.2,0) node[right] {$x$};
\draw[->] (0,-2.8) -- (0,5.6) node[above] {$y$};
\foreach \x in {-2,-1,1,2,3,4} \draw (\x,0.12) -- (\x,-0.12);
\foreach \y in {-2,-1,1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y);
\foreach \x in {-2,3} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {-2,4} \node[left] at (-0.1,\y) {\small $\y$};
\draw[thick, blue!60] (-2.5,0.125) -- (3.8,4.85) node[right] {$r$};
\draw[thick, red!50] (-1.8,-2.475) -- (4.5,2.25) node[right] {$s$};
\draw[thick] (0,2) -- (1.5,0);
\draw (1.74,0.18) -- (1.56,0.42) -- (1.32,0.24);
\fill (0,2) circle (0.13) node[above left] {$P$};
\fill (1.5,0) circle (0.13) node[below right] {$H$};
\end{tikzpicture}
```
```

```ad-warning
La formula diretta con coefficienti diversi
Nell'esempio 6 le equazioni hanno coefficienti diversi, $3x - 4y$ e $6x - 8y$. Chi usa subito la formula diretta calcola $\dfrac{|8 - (-9)|}{5} = \dfrac{17}{5}$, che è sbagliato: prima si rendono uguali $a$ e $b$.
```

Con due rette in forma esplicita che hanno lo stesso $m$, per esempio $y = 2x + 1$ e $y = 2x - 4$, le forme implicite $2x - y + 1 = 0$ e $2x - y - 4 = 0$ hanno già gli stessi $a$ e $b$, e la distanza è $\dfrac{|1 - (-4)|}{\sqrt{5}} = \dfrac{5}{\sqrt{5}} = \sqrt{5}$.

```ad-warning
La differenza delle q non è la distanza
Tra $y = 2x + 1$ e $y = 2x - 4$ la differenza delle ordinate all'origine è $5$, ma quella è la lunghezza di un segmento verticale tra le due rette, non perpendicolare. La distanza è $\sqrt{5}$, circa $2{,}24$.
```

Lo vedi cambiando la pendenza delle due rette, $y = mx + 1$ e $y = mx + q$: sotto il piano ci sono la distanza $d$ e la differenza delle ordinate all'origine, cioè il tratto in verticale.

```grafico
% nome: distanza-parallele-differenza-q
% alt: Le rette parallele y = mx + 1 e y = mx + q con i cursori di m e di q: sotto il piano sono scritte la distanza tra le due rette e la differenza delle ordinate all'origine, che coincidono solo quando le rette sono orizzontali
curva: y=mx+1
curva: y=mx+q | rosso
cursore: m = 2 da -4 a 4 passo 0,5
cursore: q = -4 da -6 a 6 passo 0,5
finestra: x da -7 a 7, y da -6 a 6
valore: d = \frac{\left|1-q\right|}{\sqrt{m^2+1}}
valore: \text{in verticale} = \left|1-q\right|
domanda: Porta $m$ a $0$: i due numeri diventano uguali? Poi aumenta $m$ senza toccare $q$: quale dei due cambia, e perché?
```

## Altezza e area di un triangolo

In un triangolo $ABC$ l'altezza relativa al lato $AB$ è il segmento perpendicolare ad $AB$ che parte da $C$: la sua lunghezza è la distanza di $C$ dalla retta $AB$. Con le coordinate dei tre vertici l'area si trova così:

1. Calcola la lunghezza della base $\overline{AB}$ con la formula della distanza tra due punti.
2. Scrivi l'equazione della [retta per i due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti) $A$ e $B$, in forma implicita.
3. L'altezza $h$ è la distanza di $C$ da quella retta.
4. L'area è $\dfrac{\overline{AB} \cdot h}{2}$.

```ad-example
Esempio 7: l'area di un triangolo
Calcola l'altezza relativa al lato $AB$ e l'area del triangolo di vertici $A(1, 1)$, $B(5, 3)$ e $C(2, 6)$.

La base è

$$
\begin{aligned}
\overline{AB} &= \sqrt{4^2 + 2^2} \\
&= \sqrt{20} = 2\sqrt{5}
\end{aligned}
$$

La retta $AB$ ha coefficiente angolare $m = \dfrac{3 - 1}{5 - 1} = \dfrac{1}{2}$ e passa per $A$: $y - 1 = \dfrac{1}{2}(x - 1)$. Moltiplicando per $2$ si ha $2y - 2 = x - 1$, cioè $x - 2y + 1 = 0$ (controllo con $B$: $5 - 6 + 1 = 0$). L'altezza è la distanza di $C$ da questa retta:

$$
\begin{aligned}
h &= \frac{|2 - 2 \cdot 6 + 1|}{\sqrt{1 + 4}} \\
&= \frac{9}{\sqrt{5}} = \frac{9\sqrt{5}}{5}
\end{aligned}
$$

L'area è

$$
\begin{aligned}
\text{Area} &= \frac{1}{2} \cdot 2\sqrt{5} \cdot \frac{9}{\sqrt{5}} \\
&= 9
\end{aligned}
$$

Qui conviene tenere l'altezza nella forma $\dfrac{9}{\sqrt{5}}$: la radice si semplifica con quella della base.

```tikz
% nome: area-triangolo-altezza-distanza
% alt: Il triangolo di vertici A di coordinate 1 e 1, B di coordinate 5 e 3 e C di coordinate 2 e 6, con l'altezza CH perpendicolare al lato AB: la sua lunghezza è la distanza di C dalla retta AB
% svg: area-triangolo-altezza-distanza-ee9dcdd8.svg 165x181
\begin{tikzpicture}[scale=0.5]
\draw[gray!25, very thin] (0,0) grid (6,7);
\draw[->] (-0.5,0) -- (6.7,0) node[right] {$x$};
\draw[->] (0,-0.5) -- (0,7.5) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.1) -- (\x,-0.1);
\foreach \y in {1,2,3,4,5,6,7} \draw (0.1,\y) -- (-0.1,\y);
\foreach \x in {1,5} \node[below] at (\x,-0.1) {\small $\x$};
\foreach \y in {3,6} \node[left] at (-0.1,\y) {\small $\y$};
\node[below left] at (0,0) {\small $O$};
\fill[blue!10] (1,1) -- (5,3) -- (2,6) -- cycle;
\draw[thick, blue!60] (1,1) -- (5,3) -- (2,6) -- cycle;
\draw[dashed] (2,6) -- (3.8,2.4);
\draw (4.068,2.534) -- (3.934,2.802) -- (3.666,2.668);
\node[right] at (2.95,4.4) {$h$};
\fill (1,1) circle (0.1) node[below right] {$A$};
\fill (5,3) circle (0.1) node[right] {$B$};
\fill (2,6) circle (0.1) node[above right] {$C$};
\fill (3.8,2.4) circle (0.1) node[below right] {$H$};
\end{tikzpicture}
```
```

```ad-warning
Il vertice giusto
L'altezza relativa ad $AB$ è la distanza del terzo vertice, $C$, dalla retta $AB$. $A$ e $B$ stanno su quella retta e hanno distanza $0$; e se si prende come base un altro lato, per esempio $BC$, l'altezza è la distanza di $A$ dalla retta $BC$.
```
