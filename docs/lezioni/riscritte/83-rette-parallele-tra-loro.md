# Rette parallele e perpendicolari

Le righe di un quaderno sono parallele, i bordi di un foglio sono perpendicolari: nella geometria del primo anno lo si vedeva dal disegno, nel piano cartesiano lo si legge dalle equazioni. Due rette sono parallele quando hanno lo stesso coefficiente angolare, perpendicolari quando il prodotto dei due coefficienti angolari è $-1$. Con queste due condizioni scrivi la retta per un punto parallela o perpendicolare a una retta data, l'asse di un segmento e la proiezione di un punto su una retta. Per seguire la lezione ti serve il coefficiente angolare $m$ della lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti).

## Rette parallele

Due rette del piano sono **parallele** se non hanno punti in comune oppure se coincidono, come nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele); si scrive $r \parallel s$. Nel piano cartesiano, due rette non verticali in forma esplicita

$$
\begin{gathered}
r\colon\ y = m_1x + q_1 \\
s\colon\ y = m_2x + q_2
\end{gathered}
$$

sono parallele se e solo se hanno lo stesso coefficiente angolare:

$$m_1 = m_2$$

Il motivo si vede sul disegno. Il coefficiente angolare dice di quanto sale la retta quando ci si sposta di $1$ verso destra: se $m_1 = m_2$, le due rette salgono della stessa quantità a ogni passo, e la distanza in verticale tra le due, cioè $q_1 - q_2$, resta sempre la stessa. Se invece $m_1 \neq m_2$, una delle due sale più in fretta dell'altra e prima o poi la raggiunge, quindi le rette si incontrano. Quando anche $q_1 = q_2$ le due equazioni sono uguali e le rette coincidono.

```tikz
% nome: rette-parallele-stesso-coefficiente-angolare
% alt: Le rette y = 2x + 1 e y = 2x - 3 nel piano cartesiano: sono parallele, e su tutte e due spostandosi di 1 verso destra si sale di 2
% svg: rette-parallele-stesso-coefficiente-angolare-db976ee3.svg 189x235
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-2.5,-3.5) grid (4.5,5.5);
\draw[->] (-2.5,0) -- (4.9,0) node[right] {$x$};
\draw[->] (0,-3.5) -- (0,5.9) node[above] {$y$};
\foreach \x in {-2,-1,1,2,3,4} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {-3,-2,-1,1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-2.25,-3.5) -- (2.25,5.5);
\draw[thick, red!50] (-0.25,-3.5) -- (3.75,4.5);
\draw[dashed, gray] (0,1) -- (1,1) -- (1,3);
\draw[dashed, gray] (2,1) -- (3,1) -- (3,3);
\node[below] at (0.5,1) {\small $1$};
\node[right] at (1,2) {\small $2$};
\fill (0,1) circle (0.12);
\fill (2,1) circle (0.12);
\node[blue!70!black, right] at (2.2,5.2) {$y = 2x + 1$};
\node[red!60!black, right] at (1.2,-2.2) {$y = 2x - 3$};
\end{tikzpicture}
```

Le rette verticali non hanno coefficiente angolare, e vanno trattate a parte. Due rette verticali $x = h_1$ e $x = h_2$ sono sempre parallele tra loro (e all'asse $y$); una retta verticale non è mai parallela a una retta non verticale. Le rette orizzontali $y = k$ hanno $m = 0$ e rientrano nella regola: sono tutte parallele tra loro e all'asse $x$.

### La condizione in forma implicita

Se le rette sono in forma implicita

$$
\begin{gathered}
r\colon\ ax + by + c = 0 \\
s\colon\ a'x + b'y + c' = 0
\end{gathered}
$$

puoi portarle in forma esplicita e confrontare $m$, oppure usare direttamente i coefficienti. Quando $b$ e $b'$ non sono zero, il coefficiente angolare è $-\dfrac{a}{b}$, come nella lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti), e l'uguaglianza $-\dfrac{a}{b} = -\dfrac{a'}{b'}$, moltiplicata in croce, diventa

$$ab' = a'b$$

Questa condizione vale anche con le rette verticali: se $b = b' = 0$ è vera ($0 = 0$) e le rette sono tutte e due verticali, quindi parallele; se una sola delle due è verticale è falsa. Per esempio $2x - 3y + 1 = 0$ e $4x - 6y + 5 = 0$ sono parallele, perché $2 \cdot (-6) = -12$ e $4 \cdot (-3) = -12$; in forma esplicita tutte e due hanno $m = \dfrac{2}{3}$. È lo stesso confronto della lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite), dove $ab' \neq a'b$ vuol dire sistema determinato, cioè rette che si incontrano in un punto.

```ad-warning
Confrontare i coefficienti senza portare in forma esplicita
Le rette $y = 2x + 1$ e $2y = 4x + 7$ sono parallele, anche se nella seconda davanti a $x$ c'è $4$: dividendo per $2$ diventa $y = 2x + \dfrac{7}{2}$, con $m = 2$. Il coefficiente angolare si legge solo quando la $y$ è da sola, con coefficiente $1$.
```

## Rette perpendicolari

Due rette sono **perpendicolari** se si incontrano formando quattro angoli retti; si scrive $r \perp s$. Nel piano cartesiano, due rette non verticali $y = m_1x + q_1$ e $y = m_2x + q_2$ sono perpendicolari se e solo se il prodotto dei loro coefficienti angolari è $-1$:

$$m_1 \cdot m_2 = -1$$

In altre parole $m_2 = -\dfrac{1}{m_1}$: il coefficiente angolare della perpendicolare è l'**antireciproco** di $m_1$, cioè il reciproco cambiato di segno. L'antireciproco di $2$ è $-\dfrac{1}{2}$, quello di $-\dfrac{3}{4}$ è $\dfrac{4}{3}$.

Il motivo si vede ruotando la retta. Spostare una retta parallelamente a se stessa non cambia gli angoli che forma con un'altra retta, quindi si possono guardare solo le rette per l'origine $y = m_1x$. Il punto $P(1, m_1)$ sta sulla retta, e con $m_1$ positivo il triangolo rettangolo con i vertici $O$, $Q(1, 0)$ e $P$ ha i cateti lunghi $1$ e $m_1$ (nella figura $m_1 = 2$). Se ruoti tutto di un angolo retto intorno all'origine, in senso antiorario, $Q$ va in $Q'(0, 1)$ e $P$ va in $P'(-m_1, 1)$: il triangolo ruotato è uguale al primo, e la retta ruotata, perpendicolare alla prima, passa per $O$ e per $P'$. Il suo coefficiente angolare è

$$m_2 = \frac{1}{-m_1} = -\frac{1}{m_1}$$

```tikz
% nome: rette-perpendicolari-rotazione-triangolo
% alt: La retta y = 2x e la retta y = -x/2, perpendicolari nell'origine: il triangolo con i vertici O, Q(1, 0) e P(1, 2), ruotato di un angolo retto, diventa il triangolo O, Q'(0, 1), P'(-2, 1)
% svg: rette-perpendicolari-rotazione-triangolo-c4d65ea5.svg 226x163
\begin{tikzpicture}[scale=1.1]
\draw[gray!25, very thin] (-2.6,-0.6) grid (2,2.6);
\draw[->] (-2.6,0) -- (2.2,0) node[right] {$x$};
\draw[->] (0,-0.6) -- (0,2.8) node[above] {$y$};
\fill[blue!15] (0,0) -- (1,0) -- (1,2) -- cycle;
\fill[red!15] (0,0) -- (0,1) -- (-2,1) -- cycle;
\draw[thick, blue!60] (-0.3,-0.6) -- (1.3,2.6);
\draw[thick, red!50] (-2.6,1.3) -- (1.2,-0.6);
\draw (0.11,0.22) -- (-0.11,0.34) -- (-0.22,0.11);
\fill (1,2) circle (0.05) node[right] {$P(1, 2)$};
\fill (1,0) circle (0.05) node[below] {$Q$};
\fill (-2,1) circle (0.05) node[above] {$P'(-2, 1)$};
\fill (0,1) circle (0.05) node[above right] {$Q'$};
\node[below left] at (0,0) {$O$};
\node[blue!70!black, right] at (1.3,2.4) {$y = 2x$};
\node[red!60!black, below] at (-1.9,0.8) {$y = -\frac{1}{2}x$};
\end{tikzpicture}
```
```grafico
% nome: perpendicolari-antireciproco-scelta
% alt: La retta y = mx con il cursore di m e una seconda retta per l'origine, con il coefficiente angolare scelto tra l'antireciproco, l'opposto e il reciproco di m: solo con l'antireciproco le due rette restano perpendicolari per ogni m
curva: y=mx
scelta: -\frac{1}{m} :: y=-\frac{1}{m}x
scelta: -m :: y=-mx
scelta: \frac{1}{m} :: y=\frac{1}{m}x
cursore: m = 2 da -4 a 4 passo 0,25
finestra: x da -6 a 6, y da -4 a 4
domanda: Con $-\frac{1}{m}$ muovi il cursore: l'angolo resta retto? Poi scegli $-m$: per quali valori di $m$ l'angolo è retto? E con $\frac{1}{m}$ lo diventa mai?
```

Con $m_1 = 2$ si ottiene $m_2 = -\dfrac{1}{2}$, e infatti $2 \cdot \left(-\dfrac{1}{2}\right) = -1$. Il ragionamento funziona anche con $m_1$ negativo; non funziona con $m_1 = 0$, perché $0$ non ha reciproco. La perpendicolare a una retta orizzontale è una retta verticale, che non ha coefficiente angolare: le rette $y = k$ e $x = h$ sono sempre perpendicolari, come l'asse $x$ e l'asse $y$, e la condizione $m_1 \cdot m_2 = -1$ non si può usare.

```ad-warning
Opposto e reciproco insieme
La perpendicolare a una retta con $m = \dfrac{2}{3}$ ha $m = -\dfrac{3}{2}$. Non $-\dfrac{2}{3}$, che è solo l'opposto, e non $\dfrac{3}{2}$, che è solo il reciproco: il prodotto deve venire $-1$, e $\dfrac{2}{3} \cdot \left(-\dfrac{2}{3}\right) = -\dfrac{4}{9}$, $\dfrac{2}{3} \cdot \dfrac{3}{2} = 1$.
```

### La condizione in forma implicita

Per le rette $ax + by + c = 0$ e $a'x + b'y + c' = 0$ con $b$ e $b'$ diversi da zero, la condizione $\left(-\dfrac{a}{b}\right) \cdot \left(-\dfrac{a'}{b'}\right) = -1$ diventa $aa' = -bb'$, cioè

$$aa' + bb' = 0$$

Anche questa vale in tutti i casi, comprese le rette verticali: con $r\colon x - 3 = 0$ e $s\colon y + 1 = 0$ si ha $a = 1$, $b = 0$, $a' = 0$, $b' = 1$, e $1 \cdot 0 + 0 \cdot 1 = 0$. Per esempio $2x + 5y - 1 = 0$ e $5x - 2y + 3 = 0$ sono perpendicolari, perché $2 \cdot 5 + 5 \cdot (-2) = 0$.

| | forma esplicita | forma implicita |
|---|---|---|
| parallele | $m_1 = m_2$ | $ab' = a'b$ |
| perpendicolari | $m_1 \cdot m_2 = -1$ | $aa' + bb' = 0$ |

Le condizioni in forma esplicita valgono per le rette non verticali; quelle in forma implicita valgono sempre.

```ad-example
Esempio 1: riconoscere parallele e perpendicolari
Tra le rette $r\colon y = 3x - 2$, $s\colon 6x - 2y + 5 = 0$ e $t\colon x + 3y - 1 = 0$, quali sono parallele e quali perpendicolari?

Porta $s$ e $t$ in forma esplicita:

$$
\begin{gathered}
s\colon\ y = 3x + \frac{5}{2} \\
t\colon\ y = -\frac{1}{3}x + \frac{1}{3}
\end{gathered}
$$

I coefficienti angolari sono $3$, $3$ e $-\dfrac{1}{3}$. Quindi $r \parallel s$, perché $m$ è lo stesso, e $t$ è perpendicolare a tutte e due, perché $3 \cdot \left(-\dfrac{1}{3}\right) = -1$. Controllo con la forma implicita su $s$ e $t$: $6 \cdot 1 + (-2) \cdot 3 = 0$.
```

```ad-example
Esempio 2: trovare un parametro
Per quale valore di $k$ la retta $y = (2k - 1)x + 3$ è parallela alla retta $y = 5x - 1$? E per quale è perpendicolare?

Il coefficiente angolare della prima retta è $2k - 1$. Per il parallelismo deve essere uguale a $5$:

$$
\begin{gathered}
2k - 1 = 5 \\
k = 3
\end{gathered}
$$

Per la perpendicolarità deve essere l'antireciproco di $5$, cioè $-\dfrac{1}{5}$:

$$
\begin{gathered}
2k - 1 = -\frac{1}{5} \\
2k = \frac{4}{5} \qquad k = \frac{2}{5}
\end{gathered}
$$

Con $k = 3$ la retta è $y = 5x + 3$, parallela alla data; con $k = \dfrac{2}{5}$ è $y = -\dfrac{1}{5}x + 3$, perpendicolare.
```

## Retta per un punto parallela o perpendicolare a una retta data

Per un punto $P(x_0, y_0)$ passa una sola retta parallela a una retta data $r$ e una sola retta perpendicolare a $r$. Se $r$ non è verticale e la sua perpendicolare non è verticale, cioè se $m$ esiste e non è zero, le trovi così:

1. Calcola il coefficiente angolare $m$ di $r$, portandola in forma esplicita se serve.
2. Per la parallela usa lo stesso $m$; per la perpendicolare usa l'antireciproco $-\dfrac{1}{m}$.
3. Scrivi la retta per $P$ con quel coefficiente angolare, con la formula della lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti):

$$y - y_0 = m(x - x_0)$$

4. Controlla che le coordinate di $P$ soddisfino l'equazione trovata.

```ad-example
Esempio 3: parallela e perpendicolare per un punto
Scrivi le equazioni delle rette per $P(1, 4)$ parallela e perpendicolare alla retta $r\colon y = 2x - 3$.

La retta $r$ ha $m = 2$. La parallela per $P$ ha lo stesso coefficiente angolare:

$$
\begin{aligned}
y - 4 &= 2(x - 1) \\
y &= 2x + 2
\end{aligned}
$$

La perpendicolare ha $m = -\dfrac{1}{2}$:

$$
\begin{aligned}
y - 4 &= -\frac{1}{2}(x - 1) \\
y &= -\frac{1}{2}x + \frac{9}{2}
\end{aligned}
$$

Controllo con $x = 1$: $2 \cdot 1 + 2 = 4$ e $-\dfrac{1}{2} + \dfrac{9}{2} = 4$, quindi tutte e due passano per $P$. Nella figura $r$ è la retta blu continua, la parallela è quella blu tratteggiata e la perpendicolare è quella rossa.

```tikz
% nome: retta-parallela-perpendicolare-per-punto
% alt: La retta y = 2x - 3 e il punto P(1, 4); per P passano la parallela y = 2x + 2 e la perpendicolare y = -x/2 + 9/2, che formano un angolo retto in P
% svg: retta-parallela-perpendicolare-per-punto-4594798d.svg 195x196
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-1.5,-1.5) grid (6.5,6.5);
\draw[->] (-1.5,0) -- (6.9,0) node[right] {$x$};
\draw[->] (0,-1.5) -- (0,6.9) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {1,2,3,4,5,6} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (0.75,-1.5) -- (4.5,6);
\draw[thick, blue!60, dashed] (-0.4,1.2) -- (2,6);
\draw[thick, red!50] (-1.5,5.25) -- (6.5,1.25);
\draw (1.13,4.27) -- (1.40,4.13) -- (1.27,3.87);
\fill (1,4) circle (0.14);
\node[below right] at (1,4) {$P$};
\node[blue!70!black, right] at (4.1,5.3) {$r$};
\end{tikzpicture}
```
```grafico
% nome: parallela-perpendicolare-punto-cursori
% alt: La retta r di equazione y = 2x - 3 e il punto P, mosso dai cursori delle sue coordinate u e v: per P passano la parallela a r, tratteggiata, e la perpendicolare, rossa, che si spostano con P senza cambiare pendenza
curva: y=2x-3 | blu
curva: P=\left(u;v\right) | nero
curva: y-v=2\left(x-u\right) | blu | tratteggiata
curva: y-v=-\frac{1}{2}\left(x-u\right) | rosso
cursore: u = 1 da -4 a 6 passo 0,5
cursore: v = 4 da -4 a 6 passo 0,5
finestra: x da -5 a 8, y da -4 a 7
domanda: I cursori $u$ e $v$ sono le coordinate di $P$. Sposta $P$: le due rette cambiano pendenza? Che cosa succede alla parallela quando $P$ arriva sulla retta $r$, per esempio con $u = 3$ e $v = 3$?
```
```

```ad-example
Esempio 4: retta in forma implicita e punto con coordinate negative
Scrivi in forma implicita le rette per $A(-2, 1)$ parallela e perpendicolare alla retta $r\colon 3x + 4y - 12 = 0$.

Il coefficiente angolare di $r$ è $m = -\dfrac{a}{b} = -\dfrac{3}{4}$. La parallela per $A$, attento al segno di $x_0 = -2$:

$$
\begin{aligned}
y - 1 &= -\frac{3}{4}(x + 2) \\
y &= -\frac{3}{4}x - \frac{1}{2}
\end{aligned}
$$

Moltiplicando per $4$ e portando tutto a primo membro: $3x + 4y + 2 = 0$. La perpendicolare ha l'antireciproco di $-\dfrac{3}{4}$, cioè $\dfrac{4}{3}$:

$$
\begin{aligned}
y - 1 &= \frac{4}{3}(x + 2) \\
y &= \frac{4}{3}x + \frac{11}{3}
\end{aligned}
$$

Moltiplicando per $3$: $4x - 3y + 11 = 0$. Controllo con $A$: $3 \cdot (-2) + 4 \cdot 1 + 2 = 0$ e $4 \cdot (-2) - 3 \cdot 1 + 11 = 0$. E la condizione di perpendicolarità tra $r$ e la seconda retta: $3 \cdot 4 + 4 \cdot (-3) = 0$.
```

```ad-tip
Parallela e perpendicolare senza passare per m
In forma implicita, la parallela a $ax + by + c = 0$ ha equazione $ax + by + c' = 0$ (stessi $a$ e $b$), e la perpendicolare ha equazione $bx - ay + c' = 0$ (coefficienti scambiati, uno cambiato di segno). Il numero $c'$ si trova sostituendo il punto. Nell'esempio 4: la parallela è $3x + 4y + c' = 0$, e con $A(-2, 1)$ si ha $-6 + 4 + c' = 0$, quindi $c' = 2$; la perpendicolare è $4x - 3y + c' = 0$, e $-8 - 3 + c' = 0$ dà $c' = 11$.
```

Quando la retta data è parallela a un asse, il procedimento con $m$ non serve e non funziona: la perpendicolare a una retta orizzontale è verticale, e una retta verticale non si scrive nella forma $y - y_0 = m(x - x_0)$. Le rette parallele agli assi per $P(x_0, y_0)$ sono $y = y_0$ e $x = x_0$, come nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari).

```ad-example
Esempio 5: retta data orizzontale
Scrivi le rette per $P(3, -2)$ parallela e perpendicolare alla retta $r\colon 2y - 6 = 0$.

Nell'equazione di $r$ non c'è la $x$: dividendo per $2$ diventa $y = 3$, una retta orizzontale. La parallela per $P$ è orizzontale anche lei, e passa per i punti che hanno la stessa ordinata di $P$:

$$y = -2$$

La perpendicolare è verticale e passa per i punti con la stessa ascissa di $P$:

$$x = 3$$

Se la retta data fosse stata verticale, per esempio $x = 5$, i ruoli si sarebbero scambiati: parallela $x = 3$, perpendicolare $y = -2$.
```

```ad-warning
Scambiare x = 3 e y = 3
Nell'esempio 5 la retta $r$ è $y = 3$, e $x = 3$ è la sua perpendicolare per $P$, non una retta uguale a $r$. La lettera che compare dice tutto: $y = k$ è orizzontale, $x = h$ è verticale.
```

## Asse di un segmento

L'**asse** di un segmento $AB$ è la retta perpendicolare ad $AB$ che passa per il suo punto medio $M$, come nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele). Nel piano cartesiano la definizione diventa un procedimento:

1. Calcola il punto medio $M$ di $AB$, come nella lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio).
2. Calcola il coefficiente angolare di $AB$, $m_{AB} = \dfrac{y_B - y_A}{x_B - x_A}$.
3. Scrivi la retta per $M$ con coefficiente angolare $-\dfrac{1}{m_{AB}}$.

C'è un secondo modo, che usa un'altra proprietà: l'asse è il **luogo dei punti equidistanti** dagli estremi del segmento, cioè un punto $P$ sta sull'asse se e solo se $\overline{PA} = \overline{PB}$, come nella lezione [Punti notevoli del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/punti-notevoli-del-triangolo). Se $P(x, y)$ è un punto qualsiasi, con la formula della distanza la condizione $\overline{PA} = \overline{PB}$ diventa, elevando al quadrato,

$$
\begin{gathered}
(x - x_A)^2 + (y - y_A)^2 = \\
= (x - x_B)^2 + (y - y_B)^2
\end{gathered}
$$

Sviluppando i quadrati con i [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli), $x^2$ e $y^2$ compaiono in tutti e due i membri e si cancellano: resta un'equazione di primo grado, che è l'equazione dell'asse.

```ad-example
Esempio 6: asse di un segmento, nei due modi
Trova l'equazione dell'asse del segmento con estremi $A(1, 2)$ e $B(5, 4)$.

Con il punto medio e la perpendicolare:

$$
\begin{gathered}
M\left(\frac{1 + 5}{2}, \frac{2 + 4}{2}\right) = M(3, 3) \\
m_{AB} = \frac{4 - 2}{5 - 1} = \frac{1}{2}
\end{gathered}
$$

L'asse ha coefficiente angolare $-2$ e passa per $M$:

$$
\begin{aligned}
y - 3 &= -2(x - 3) \\
y &= -2x + 9
\end{aligned}
$$

Con i punti equidistanti:

$$
\begin{gathered}
(x - 1)^2 + (y - 2)^2 = \\
= (x - 5)^2 + (y - 4)^2
\end{gathered}
$$

Sviluppando, $x^2 - 2x + 1 + y^2 - 4y + 4 = x^2 - 10x + 25 + y^2 - 8y + 16$. Tolti $x^2$ e $y^2$ da tutti e due i membri e portato tutto a primo membro:

$$
\begin{gathered}
8x + 4y - 36 = 0 \\
2x + y - 9 = 0
\end{gathered}
$$

che è la stessa retta $y = -2x + 9$.

```tikz
% nome: asse-segmento-piano-cartesiano
% alt: Il segmento di estremi A(1, 2) e B(5, 4) con il punto medio M(3, 3); l'asse y = -2x + 9 passa per M ed è perpendicolare al segmento
% svg: asse-segmento-piano-cartesiano-cd4dd547.svg 181x196
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-0.5,-1.5) grid (6.5,6.5);
\draw[->] (-0.5,0) -- (6.9,0) node[right] {$x$};
\draw[->] (0,-1.5) -- (0,6.9) node[above] {$y$};
\foreach \x in {1,2,3,4,5,6} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {1,2,3,4,5,6} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (1,2) -- (5,4);
\draw[thick, red!50] (1.25,6.5) -- (5.25,-1.5);
\draw (2.87,2.73) -- (3.00,2.46) -- (3.13,2.73);
\fill (1,2) circle (0.14) node[above left] {$A$};
\fill (5,4) circle (0.14) node[above right] {$B$};
\fill (3,3) circle (0.14) node[above right] {$M$};
\end{tikzpicture}
```
```grafico
% nome: asse-segmento-punto-equidistante
% alt: Il segmento di estremi A(1; 2) e B(5; 4), il suo asse y = -2x + 9 e un punto P che scorre sull'asse con il cursore della sua ascissa s, unito ad A e a B da due segmenti tratteggiati: sotto il piano sono scritte le distanze PA e PB, sempre uguali tra loro
curva: \left(1+4t;2+2t\right) | blu | t da 0 a 1
curva: y=-2x+9 | rosso
curva: A=\left(1;2\right) | nero
curva: B=\left(5;4\right) | nero
curva: P=\left(s;-2s+9\right) | nero
curva: \left(s+t\left(1-s\right);-2s+9+t\left(2s-7\right)\right) | grigio | tratteggiata | t da 0 a 1
curva: \left(s+t\left(5-s\right);-2s+9+t\left(2s-5\right)\right) | grigio | tratteggiata | t da 0 a 1
cursore: s = 2 da 1 a 5 passo 0,25
finestra: x da -2 a 8, y da -2 a 8
valore: \overline{PA} = \sqrt{\left(s-1\right)^2+\left(7-2s\right)^2}
valore: \overline{PB} = \sqrt{\left(s-5\right)^2+\left(5-2s\right)^2}
domanda: Fai scorrere $P$ lungo l'asse con il cursore $s$, la sua ascissa: le due distanze cambiano, ma restano uguali tra loro? In quale punto sono più piccole?
```
```

```ad-example
Esempio 7: asse con coordinate negative e un segmento orizzontale
Trova l'asse del segmento con estremi $A(-3, 1)$ e $B(1, -5)$. Poi quello del segmento con estremi $C(-1, 3)$ e $D(5, 3)$.

Per il primo segmento:

$$
\begin{gathered}
M\left(\frac{-3 + 1}{2}, \frac{1 - 5}{2}\right) \\
= M(-1, -2) \\
m_{AB} = \frac{-5 - 1}{1 - (-3)} = -\frac{6}{4} = -\frac{3}{2}
\end{gathered}
$$

L'antireciproco di $-\dfrac{3}{2}$ è $\dfrac{2}{3}$:

$$
\begin{aligned}
y + 2 &= \frac{2}{3}(x + 1) \\
y &= \frac{2}{3}x - \frac{4}{3}
\end{aligned}
$$

In forma implicita, $2x - 3y - 4 = 0$. Controllo: con i punti equidistanti si ottiene $8x - 12y - 16 = 0$, la stessa retta divisa per $4$.

Il segmento $CD$ è orizzontale, perché $C$ e $D$ hanno la stessa ordinata: $m_{CD} = 0$, che non ha antireciproco. Il punto medio è $M(2, 3)$ e l'asse è la retta verticale per $M$:

$$x = 2$$

Allo stesso modo, l'asse di un segmento verticale è la retta orizzontale per il suo punto medio, $y = y_M$.
```

## Proiezione di un punto su una retta

La **proiezione** di un punto $P$ su una retta $r$ è il punto $H$ in cui la perpendicolare a $r$ passante per $P$ incontra $r$, come nella lezione [Rette perpendicolari e parallele](/materiale/scuola-superiore/matematica/geometria-del-piano-triangoli-e-quadrilateri/rette-perpendicolari-e-parallele). Se $P$ sta su $r$, la sua proiezione è $P$ stesso. Per trovarla:

1. Scrivi la retta $s$ per $P$ perpendicolare a $r$.
2. Metti a sistema le equazioni di $r$ e di $s$: la soluzione dà le coordinate di $H$, come nella lezione [Intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette).
3. Controlla che $H$ stia su tutte e due le rette.

La lunghezza del segmento $PH$ è la distanza di $P$ da $r$, che ha una formula sua nella lezione [Distanza di un punto da una retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta).

```ad-example
Esempio 8: proiezione con coordinate intere
Trova la proiezione del punto $P(5, 0)$ sulla retta $r\colon y = 2x - 5$.

La retta $r$ ha $m = 2$, quindi la perpendicolare $s$ per $P$ ha $m = -\dfrac{1}{2}$:

$$
\begin{aligned}
y - 0 &= -\frac{1}{2}(x - 5) \\
y &= -\frac{1}{2}x + \frac{5}{2}
\end{aligned}
$$

Le due equazioni hanno tutte e due la $y$ da sola, quindi conviene il metodo del confronto:

$$
\begin{gathered}
2x - 5 = -\frac{1}{2}x + \frac{5}{2} \\
4x - 10 = -x + 5 \\
5x = 15 \qquad x = 3
\end{gathered}
$$

e $y = 2 \cdot 3 - 5 = 1$. La proiezione è $H(3, 1)$. Controllo su $s$: $-\dfrac{3}{2} + \dfrac{5}{2} = 1$.

```tikz
% nome: proiezione-punto-su-retta
% alt: La retta y = 2x - 5, il punto P(5, 0) e la sua proiezione H(3, 1) sulla retta; il segmento PH è perpendicolare alla retta
% svg: proiezione-punto-su-retta-94c270ef.svg 181x175
\begin{tikzpicture}[scale=0.55]
\draw[gray!25, very thin] (-0.5,-1.5) grid (6.5,5.5);
\draw[->] (-0.5,0) -- (6.9,0) node[right] {$x$};
\draw[->] (0,-1.5) -- (0,5.9) node[above] {$y$};
\foreach \x in {1,2,3,4,6} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (1.75,-1.5) -- (5.25,5.5);
\draw[thick, red!50, dashed] (0.6,2.2) -- (6.5,-0.75);
\draw[thick] (5,0) -- (3,1);
\draw (3.13,1.27) -- (3.40,1.13) -- (3.27,0.87);
\fill (5,0) circle (0.14) node[above right] {$P$};
\fill (3,1) circle (0.14) node[left] {$H$};
\node[blue!70!black, right] at (5,4.6) {$r$};
\node[red!60!black, above] at (1,2) {$s$};
\end{tikzpicture}
```
```

```ad-example
Esempio 9: proiezione con risultato frazionario
Trova la proiezione del punto $P(-1, 4)$ sulla retta $r\colon x - 2y + 1 = 0$.

Il coefficiente angolare di $r$ è $-\dfrac{a}{b} = -\dfrac{1}{-2} = \dfrac{1}{2}$, quindi la perpendicolare per $P$ ha $m = -2$:

$$
\begin{aligned}
y - 4 &= -2(x + 1) \\
y &= -2x + 2
\end{aligned}
$$

Qui conviene la sostituzione: metti $y = -2x + 2$ nell'equazione di $r$.

$$
\begin{gathered}
x - 2(-2x + 2) + 1 = 0 \\
x + 4x - 4 + 1 = 0 \\
5x = 3 \qquad x = \frac{3}{5}
\end{gathered}
$$

e $y = -2 \cdot \dfrac{3}{5} + 2 = \dfrac{4}{5}$. La proiezione è $H\left(\dfrac{3}{5}, \dfrac{4}{5}\right)$. Controllo su $r$: $\dfrac{3}{5} - \dfrac{8}{5} + 1 = 0$.
```

```ad-warning
Fermarsi alla perpendicolare
La perpendicolare $s$ è solo il primo passo: la proiezione è un punto, non una retta. Nell'esempio 8 la risposta è $H(3, 1)$, non $y = -\dfrac{1}{2}x + \dfrac{5}{2}$.
```

Se la retta è parallela a un asse il sistema non serve. La proiezione di $P(x_0, y_0)$ sulla retta orizzontale $y = k$ è $H(x_0, k)$, e sulla retta verticale $x = h$ è $H(h, y_0)$: per esempio la proiezione di $P(-3, 4)$ sulla retta $x = 2$ è $H(2, 4)$.
