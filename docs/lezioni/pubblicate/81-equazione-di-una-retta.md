# Equazione della retta e casi particolari

I punti di una retta del piano cartesiano hanno le coordinate legate da una regola. Sulla retta che passa per $(0, 1)$, $(1, 3)$ e $(2, 5)$, per esempio, l'ordinata di ogni punto è il doppio dell'ascissa più uno. Scritta come equazione, $y = 2x + 1$, questa regola è l'equazione della retta, e con lei puoi dire se un punto sta sulla retta, trovare dove la retta taglia gli assi e disegnarla, senza misurare niente sul foglio. Il piano, gli assi e le coordinate sono quelli della lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio).

## L'equazione di una retta

L'**equazione di una retta** è un'equazione nelle incognite $x$ e $y$ che ha per soluzioni le coordinate di tutti i punti della retta, e di nessun altro punto. Quindi un punto sta sulla retta se e solo se le sue coordinate, messe al posto di $x$ e di $y$, rendono vera l'uguaglianza.

Nella lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite) hai visto che le soluzioni di un'equazione di primo grado in $x$ e $y$, disegnate nel piano, formano una retta. Vale anche il contrario: ogni retta del piano ha un'equazione di primo grado in $x$ e $y$. Le più semplici sono quelle degli assi.

## Gli assi e le rette parallele agli assi

Sull'asse $x$ stanno tutti e soli i punti che hanno ordinata zero, come $(3, 0)$ o $(-5, 0)$, mentre l'ascissa può essere qualsiasi. La condizione è $y = 0$, e questa è l'equazione dell'asse $x$. Allo stesso modo i punti dell'asse $y$ sono quelli con ascissa zero, e l'asse $y$ ha equazione $x = 0$.

$$
\begin{gathered}
\text{asse } x\text{: } y = 0 \\
\text{asse } y\text{: } x = 0
\end{gathered}
$$

Una retta parallela all'asse $x$, cioè orizzontale, ha tutti i punti alla stessa altezza. Se passa per $(0, 2)$, tutti i suoi punti hanno ordinata $2$ e la sua equazione è $y = 2$. In generale la retta orizzontale che taglia l'asse $y$ nel punto $(0, k)$ ha equazione $y = k$. Una retta parallela all'asse $y$, cioè verticale, ha invece tutti i punti con la stessa ascissa: se taglia l'asse $x$ nel punto $(h, 0)$, la sua equazione è $x = h$.

$$
\begin{gathered}
\text{orizzontale: } y = k \\
\text{verticale: } x = h
\end{gathered}
$$

In queste equazioni manca una delle due lettere. La lettera che c'è ha un valore fisso; quella che manca può valere qualsiasi numero.

```tikz
% nome: rette-parallele-agli-assi
% alt: Nel piano cartesiano le rette orizzontali y = 2 e y = -1 e le rette verticali x = 3 e x = -2
% svg: rette-parallele-agli-assi-f102034b.svg 213x168
\begin{tikzpicture}[scale=0.6]
\draw[gray!30, very thin] (-3.5,-2.5) grid (4.5,3.5);
\draw[->] (-3.7,0) -- (4.8,0) node[right] {$x$};
\draw[->] (0,-2.7) -- (0,3.8) node[above] {$y$};
\foreach \x in {-3,-1,1,2,4} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-2,1,3} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-3.5,2) -- (4.5,2);
\draw[thick, blue!60] (-3.5,-1) -- (4.5,-1);
\draw[thick, red!50] (3,-2.5) -- (3,3.5);
\draw[thick, red!50] (-2,-2.5) -- (-2,3.5);
\node[blue!70!black, above] at (3.9,2) {$y = 2$};
\node[blue!70!black, below] at (1.5,-1) {$y = -1$};
\node[red!60!black, above] at (3,3.5) {$x = 3$};
\node[red!60!black, above] at (-2,3.5) {$x = -2$};
\end{tikzpicture}
```

```ad-warning
La retta $x = 3$ non è orizzontale
Siccome nell'equazione compare la $x$, viene da disegnare la retta lungo l'asse $x$. Ma $x = 3$ dice che l'ascissa vale sempre $3$: i punti sono $(3, 0)$, $(3, 1)$, $(3, -2)$, uno sopra l'altro, e la retta è verticale, parallela all'asse $y$. La retta orizzontale è $y = 3$.
```

```ad-example
Esempio 1: le parallele agli assi per un punto
Scrivi le equazioni delle rette che passano per $A(-2, 5)$ e sono parallele agli assi.

La parallela all'asse $x$ è orizzontale: tutti i suoi punti hanno la stessa ordinata di $A$, quindi la sua equazione è $y = 5$. La parallela all'asse $y$ è verticale: tutti i suoi punti hanno la stessa ascissa di $A$, quindi la sua equazione è $x = -2$.

Controllo: le coordinate di $A$ rendono vere tutte e due le equazioni, perché $y_A = 5$ e $x_A = -2$.
```

## Le bisettrici dei quadranti

La **bisettrice del primo e del terzo quadrante** è la retta che passa per l'origine e divide a metà l'angolo retto tra i due semiassi positivi, e anche quello tra i due semiassi negativi. I suoi punti hanno l'ascissa uguale all'ordinata, come $(2, 2)$ e $(-3, -3)$, quindi la sua equazione è $y = x$.

La **bisettrice del secondo e del quarto quadrante** divide a metà gli altri due angoli retti. I suoi punti hanno le coordinate opposte, come $(-2, 2)$ e $(3, -3)$, e la sua equazione è $y = -x$.

$$
\begin{gathered}
\text{I e III quadrante: } y = x \\
\text{II e IV quadrante: } y = -x
\end{gathered}
$$

```tikz
% nome: bisettrici-dei-quadranti
% alt: Le bisettrici dei quadranti: y = x attraversa il primo e il terzo quadrante e passa per il punto (2, 2), y = -x attraversa il secondo e il quarto e passa per il punto (-2, 2)
% svg: bisettrici-dei-quadranti-78ccd8c1.svg 224x194
\begin{tikzpicture}[scale=0.6]
\draw[gray!30, very thin] (-3.5,-3.5) grid (3.5,3.5);
\draw[->] (-3.7,0) -- (3.9,0) node[right] {$x$};
\draw[->] (0,-3.7) -- (0,3.9) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-3,-2,-1,1,2,3} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-3.3,-3.3) -- (3.3,3.3);
\draw[thick, red!50] (-3.3,3.3) -- (3.3,-3.3);
\node[blue!70!black, right] at (3.3,3.3) {$y = x$};
\node[red!60!black, right] at (3.3,-3.3) {$y = -x$};
\fill (2,2) circle (0.1) node[right] {$(2, 2)$};
\fill (-2,2) circle (0.1) node[left] {$(-2, 2)$};
\node at (2.6,1.2) {\small I};
\node at (-2.6,1.2) {\small II};
\node at (-2.6,-1.4) {\small III};
\node at (2.6,-1.4) {\small IV};
\end{tikzpicture}
```

## Rette che passano per l'origine

Ogni retta che passa per l'origine, tranne l'asse $y$, ha un'equazione del tipo

$$y = mx$$

la stessa della proporzionalità diretta nella lezione [Proporzionalità diretta e inversa](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa), dove però la costante non poteva essere zero. Il numero $m$ si chiama **coefficiente angolare** e dice quanto è inclinata la retta: quando $x$ aumenta di $1$, $y$ aumenta di $m$. Con $m$ positivo la retta sale da sinistra a destra, con $m$ negativo scende, con $m = 0$ l'equazione diventa $y = 0$, cioè l'asse $x$. Le bisettrici sono i casi $m = 1$ e $m = -1$. Il significato di $m$ e il modo di calcolarlo da due punti sono nella lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti).

```tikz
% nome: rette-per-origine-y-uguale-mx
% alt: Tre rette che passano per l'origine: y = 3x, molto ripida, y = x/2, poco inclinata, e y = -2x, che scende da sinistra a destra
% svg: rette-per-origine-y-uguale-mx-b4c29f78.svg 193x196
\begin{tikzpicture}[scale=0.6]
\draw[gray!30, very thin] (-3.5,-3.5) grid (3.5,3.5);
\draw[->] (-3.7,0) -- (3.9,0) node[right] {$x$};
\draw[->] (0,-3.7) -- (0,3.9) node[above] {$y$};
\foreach \x in {-3,-2,2,3} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-3,-2,2,3} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-1.15,-3.45) -- (1.15,3.45) node[right] {$y = 3x$};
\draw[thick, teal!60] (-3.4,-1.7) -- (3.4,1.7) node[above] {$y = \frac{1}{2}x$};
\draw[thick, red!50] (-1.7,3.4) -- (1.7,-3.4) node[right] {$y = -2x$};
\end{tikzpicture}
```

## La forma esplicita

Se sposti in su di $q$ tutti i punti della retta $y = mx$, ottieni una retta parallela, i cui punti hanno l'ordinata aumentata di $q$. La sua equazione è

$$y = mx + q$$

ed è la [funzione lineare](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa) che conosci. Ogni retta non verticale ha un'equazione di questo tipo, che si chiama **forma esplicita** perché la $y$ è ricavata, da sola a primo membro. Il numero $m$ è il coefficiente angolare, lo stesso della retta $y = mx$ di partenza; il numero $q$ si chiama **ordinata all'origine**, perché con $x = 0$ si ottiene $y = q$: la retta taglia l'asse $y$ nel punto $(0, q)$.

```tikz
% nome: forma-esplicita-ordinata-origine
% alt: La retta y = x/2 + 2 è la retta y = x/2 spostata in su di 2 e taglia l'asse y nel punto (0, 2)
% svg: forma-esplicita-ordinata-origine-48153bd9.svg 217x191
\begin{tikzpicture}[scale=0.6]
\draw[gray!30, very thin] (-3.5,-2.5) grid (3.5,4.5);
\draw[->] (-3.7,0) -- (3.9,0) node[right] {$x$};
\draw[->] (0,-2.7) -- (0,4.8) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-2,-1,1,3,4} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, gray!60] (-3.5,-1.75) -- (3.5,1.75) node[below right] {$y = \frac{1}{2}x$};
\draw[thick, blue!60] (-3.5,0.25) -- (3.5,3.75) node[above] {$y = \frac{1}{2}x + 2$};
\draw[->, dashed] (2,1.1) -- (2,2.9);
\fill (0,2) circle (0.1) node[above left] {$(0, 2)$};
\end{tikzpicture}
```
```grafico
% nome: forma-esplicita-cursori-m-q
% alt: La retta y = mx + q con i cursori di m e di q, la retta y = mx tratteggiata per confronto e il punto Q(0; q) sull'asse y: cambiando q la retta si sposta in su o in giù senza cambiare pendenza, cambiando m ruota intorno a Q
curva: y=mx+q
curva: y=mx | tratteggiata | grigio
curva: Q=\left(0;q\right) | nero
cursore: m = 0,5 da -4 a 4 passo 0,25
cursore: q = 2 da -5 a 5 passo 0,5
finestra: x da -5 a 5, y da -4 a 6
domanda: Muovi solo $q$: la pendenza cambia? Poi muovi solo $m$: quale punto resta fermo? Esiste un valore di $m$ che rende la retta verticale?
```

Le rette già viste sono casi particolari della forma esplicita: con $q = 0$ si ha $y = mx$, una retta per l'origine; con $m = 0$ si ha $y = q$, una retta orizzontale.

La retta verticale $x = h$ invece non ha forma esplicita. Per $x = h$ ci sono infiniti punti della retta, uno per ogni valore di $y$, e per ogni altro valore di $x$ nessuno: non c'è un'espressione in $x$ da scrivere dopo $y =$. Detto con le parole della lezione [Definizione di funzione](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione), una retta verticale non è il grafico di una funzione.

## La forma implicita

Portando tutti i termini a primo membro, l'equazione di qualsiasi retta, verticali comprese, diventa

$$ax + by + c = 0$$

con $a$ e $b$ numeri che non sono tutti e due zero. Questa è la **forma implicita** dell'equazione della retta. La retta verticale $x = 3$, per esempio, si scrive $x - 3 = 0$, con $a = 1$, $b = 0$ e $c = -3$; la retta $y = 2x + 1$ si scrive $2x - y + 1 = 0$.

Dai coefficienti si riconoscono subito i casi particolari:

| Se | la retta è | esempio |
|---|---|---|
| $a = 0$ | orizzontale | $2y - 6 = 0$ |
| $b = 0$ | verticale | $3x + 6 = 0$ |
| $c = 0$ | per l'origine | $x - 2y = 0$ |

Con $a = 0$ l'equazione non ha la $x$, come $y = k$; con $b = 0$ non ha la $y$, come $x = h$. Se oltre ad $a$ anche $c$ è zero, la retta è l'asse $x$; se oltre a $b$ anche $c$ è zero, è l'asse $y$.

```ad-note
Il termine noto dall'altra parte
Nella lezione sui sistemi l'equazione di primo grado era scritta $ax + by = c$, con il termine noto a secondo membro. È la stessa retta, ma portando il termine noto a primo membro cambia segno: $x + y = 5$ diventa $x + y - 5 = 0$, con $c = -5$.
```

La stessa retta ha infinite equazioni in forma implicita, perché moltiplicando tutti i termini per lo stesso numero diverso da zero le soluzioni non cambiano. Le equazioni $2x - y + 1 = 0$, $4x - 2y + 2 = 0$ e $-2x + y - 1 = 0$ descrivono la stessa retta. La forma esplicita, invece, è una sola.

```ad-tip
Quale equazione scegliere
Di solito si scrive la forma implicita con i coefficienti interi e senza divisori comuni, e con $a$ positivo: $2x - y + 1 = 0$, non $-4x + 2y - 2 = 0$. Due equazioni che sembrano diverse sono la stessa retta se una si ottiene dall'altra moltiplicando tutti i termini per lo stesso numero.
```

### Dalla forma implicita a quella esplicita

Se $b \neq 0$, dalla forma implicita si ricava la $y$:

1. lascia a primo membro il termine con la $y$ e porta gli altri a secondo membro, cambiando il loro segno;
2. dividi per $b$ tutti e due i membri, cioè ogni termine del secondo membro.

Se $b = 0$ la retta è verticale e non ha forma esplicita, come hai visto sopra. Dalla forma esplicita si leggono subito $m$ e $q$; la regola per leggere $m$ direttamente dai coefficienti $a$ e $b$ è nella lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti).

```ad-example
Esempio 2: dalla forma implicita a quella esplicita
Scrivi in forma esplicita la retta $3x - 2y + 4 = 0$ e trova $m$ e $q$.

Il termine con la $y$ resta a primo membro, gli altri passano a secondo membro con il segno cambiato; poi si divide per $-2$ ogni termine:

$$
\begin{aligned}
-2y &= -3x - 4 \\
y &= \dfrac{-3x}{-2} + \dfrac{-4}{-2} \\
y &= \dfrac{3}{2}x + 2
\end{aligned}
$$

Il coefficiente angolare è $m = \dfrac{3}{2}$ e l'ordinata all'origine è $q = 2$.
```

```ad-warning
Dividere solo una parte del secondo membro
Da $-2y = -3x - 4$ si divide per $-2$ tutto il secondo membro. Dividendo solo il termine con la $x$ si ottiene $y = \dfrac{3}{2}x - 4$; dimenticando il segno di $-2$ si ottiene $y = -\dfrac{3}{2}x - 2$. Tutte e due sono rette diverse da quella giusta, $y = \dfrac{3}{2}x + 2$.
```

### Dalla forma esplicita a quella implicita

Porti tutti i termini a primo membro. Se ci sono frazioni, prima moltiplichi tutti e due i membri per il minimo comune multiplo dei denominatori, così i coefficienti diventano interi.

```ad-example
Esempio 3: dalla forma esplicita a quella implicita
Scrivi in forma implicita, con i coefficienti interi, la retta $y = \dfrac{2}{3}x - \dfrac{1}{2}$.

Il minimo comune multiplo dei denominatori $3$ e $2$ è $6$. Si moltiplicano per $6$ tutti i termini, poi si porta tutto a primo membro:

$$
\begin{aligned}
6y &= 4x - 3 \\
-4x + 6y + 3 &= 0 \\
4x - 6y - 3 &= 0
\end{aligned}
$$

L'ultima riga è la penultima moltiplicata per $-1$, per avere $a$ positivo. I coefficienti $4$, $-6$ e $-3$ non hanno divisori comuni, quindi l'equazione non si semplifica.
```

## Punto che appartiene a una retta

Per sapere se un punto $P(x_P, y_P)$ sta su una retta, sostituisci $x_P$ al posto di $x$ e $y_P$ al posto di $y$ nell'equazione. Se l'uguaglianza che ottieni è vera, il punto appartiene alla retta; se è falsa, non le appartiene. Allo stesso modo, se conosci una sola coordinata di un punto della retta, l'altra si trova risolvendo l'equazione di primo grado che resta.

```ad-example
Esempio 4: punti sulla retta
Data la retta $3x + 2y - 4 = 0$, di' se i punti $A(2, -1)$ e $B(-1, 3)$ le appartengono, poi trova il punto $C$ della retta che ha ascissa $4$.

Per $A$ si mette $2$ al posto di $x$ e $-1$ al posto di $y$:

$$3 \cdot 2 + 2 \cdot (-1) - 4 = 0$$

L'uguaglianza è vera, quindi $A$ appartiene alla retta. Per $B$:

$$3 \cdot (-1) + 2 \cdot 3 - 4 = -1$$

e $-1 \neq 0$: $B$ non appartiene alla retta.

Per $C$ si conosce $x_C = 4$, e l'ordinata si trova dall'equazione:

$$
\begin{aligned}
3 \cdot 4 + 2y - 4 &= 0 \\
2y &= -8 \\
y &= -4
\end{aligned}
$$

Il punto è $C(4, -4)$.
```

```ad-warning
Scambiare le coordinate
L'ascissa va al posto di $x$ e l'ordinata al posto di $y$. Mettendo le coordinate di $A(2, -1)$ al contrario nell'esempio 4 si ottiene $3 \cdot (-1) + 2 \cdot 2 - 4 = -3$, e si concluderebbe, sbagliando, che $A$ non sta sulla retta.
```

## Intersezioni con gli assi

I punti dell'asse $y$ hanno ascissa zero, quindi il punto in cui una retta taglia l'asse $y$ si trova mettendo $x = 0$ nella sua equazione. Allo stesso modo il punto sull'asse $x$ si trova mettendo $y = 0$. In forma esplicita il primo punto si legge subito: è $(0, q)$.

$$
\begin{gathered}
\text{asse } y\text{: metti } x = 0 \\
\text{asse } x\text{: metti } y = 0
\end{gathered}
$$

Tre casi particolari. Una retta orizzontale $y = k$, con $k \neq 0$, non taglia mai l'asse $x$, perché gli è parallela; una retta verticale $x = h$, con $h \neq 0$, non taglia mai l'asse $y$. Una retta che passa per l'origine, ma non è un asse, taglia tutti e due gli assi nello stesso punto, l'origine.

```ad-example
Esempio 5: i punti sugli assi
Trova i punti in cui la retta $2x - 3y + 6 = 0$ taglia gli assi.

Con $x = 0$ l'equazione diventa $-3y + 6 = 0$, cioè $y = 2$: la retta taglia l'asse $y$ nel punto $B(0, 2)$. Con $y = 0$ diventa $2x + 6 = 0$, cioè $x = -3$: la retta taglia l'asse $x$ nel punto $A(-3, 0)$.

Con questi due punti puoi anche disegnare la retta.

```tikz
% nome: retta-intersezioni-con-gli-assi
% alt: La retta 2x - 3y + 6 = 0 taglia l'asse x nel punto A(-3, 0) e l'asse y nel punto B(0, 2)
% svg: retta-intersezioni-con-gli-assi-c09dab93.svg 178x137
\begin{tikzpicture}[scale=0.55]
\draw[gray!30, very thin] (-4.5,-1.5) grid (2.5,3.5);
\draw[->] (-4.7,0) -- (2.9,0) node[right] {$x$};
\draw[->] (0,-1.7) -- (0,3.9) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-1,1,2,3} \draw (0.08,\y) -- (-0.08,\y) node[right] {\small $\y$};
\draw[thick, blue!60] (-4.5,-1) -- (2.25,3.5);
\fill (-3,0) circle (0.11) node[above left] {$A$};
\fill (0,2) circle (0.11) node[above left] {$B$};
\end{tikzpicture}
```
```

```ad-warning
Quale coordinata si annulla
Per il punto sull'asse $x$ si mette $y = 0$, non $x = 0$: sull'asse $x$ è l'ordinata a essere zero. Nell'esempio 5, mettendo $x = 0$ per cercare il punto sull'asse $x$ si troverebbe $(0, 2)$, che sta invece sull'asse $y$.
```

## Disegnare una retta

Per due punti distinti passa una sola retta, quindi per disegnarla ti servono due suoi punti. Ci sono due modi comodi di trovarli.

### Con due punti

Scegli due valori di $x$ e calcola i valori di $y$ corrispondenti con l'equazione, come per una [tabella di valori](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/definizione-di-funzione). Conviene scegliere valori di $x$ che danno $y$ intero (nella forma esplicita, i multipli del denominatore di $m$) e abbastanza lontani tra loro, perché due punti troppo vicini fanno sbagliare l'inclinazione. Spesso i due punti più comodi sono le intersezioni con gli assi, come nell'esempio 5. Un terzo punto è un buon controllo: se non cade sulla retta disegnata, c'è un errore.

### Con l'ordinata all'origine e il coefficiente angolare

Dalla forma esplicita $y = mx + q$ hai già un punto, $(0, q)$ sull'asse $y$. Il secondo lo dà $m$: quando $x$ aumenta di $1$, $y$ aumenta di $m$, quindi quando $x$ aumenta di $n$, $y$ aumenta di $n \cdot m$. Se $m$ è una frazione, conviene spostarsi a destra di tanti passi quanto il suo denominatore, così lo spostamento in verticale è un numero intero; se $m$ è negativo, lo spostamento in verticale è verso il basso.

```ad-example
Esempio 6: disegnare con $q$ e $m$
Disegna la retta $y = -\dfrac{3}{4}x + 1$.

L'ordinata all'origine è $q = 1$: la retta passa per $P(0, 1)$. Il coefficiente angolare è $m = -\dfrac{3}{4}$, con denominatore $4$: partendo da $P$ ci si sposta di $4$ a destra, e $y$ cambia di

$$4 \cdot \left(-\dfrac{3}{4}\right) = -3$$

cioè scende di $3$. Si arriva al punto $Q(4, -2)$, e la retta è quella che passa per $P$ e $Q$. Controllo con l'equazione: $-\dfrac{3}{4} \cdot 4 + 1 = -2$.

```tikz
% nome: retta-da-ordinata-origine-e-coefficiente-angolare
% alt: La retta y = -3x/4 + 1 disegnata partendo dal punto P(0, 1): quattro passi a destra e tre in basso portano al punto Q(4, -2)
% svg: retta-da-ordinata-origine-e-coefficiente-angolare-95df2dc2.svg 178x145
\begin{tikzpicture}[scale=0.55]
\draw[gray!30, very thin] (-1.5,-2.5) grid (5.5,2.5);
\draw[->] (-1.7,0) -- (5.9,0) node[right] {$x$};
\draw[->] (0,-2.7) -- (0,2.9) node[above] {$y$};
\foreach \x in {-1,1,3,5} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-2,1,2} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-1.4,2.05) -- (5.4,-3.05);
\draw[->, dashed] (0,1) -- (4,1);
\draw[->, dashed] (4,1) -- (4,-2);
\node[above] at (2,1) {\small $4$};
\node[right] at (4,-1.2) {\small $-3$};
\fill (0,1) circle (0.11) node[above right] {$P$};
\fill (4,-2) circle (0.11) node[right] {$Q$};
\end{tikzpicture}
```
```

## Esempi con le frazioni e i casi particolari

```ad-example
Esempio 7: un'equazione con le frazioni
Data la retta $\dfrac{x}{2} - \dfrac{y}{3} + 1 = 0$, scrivila in forma implicita con i coefficienti interi e in forma esplicita, trova i punti sugli assi e di' se il punto $P(-4, -3)$ le appartiene.

Il minimo comune multiplo dei denominatori è $6$, e moltiplicando tutti i termini per $6$ si ottiene la forma implicita:

$$3x - 2y + 6 = 0$$

Poi si ricava la $y$:

$$
\begin{aligned}
-2y &= -3x - 6 \\
y &= \dfrac{3}{2}x + 3
\end{aligned}
$$

L'ordinata all'origine è $q = 3$, quindi la retta taglia l'asse $y$ in $B(0, 3)$. Con $y = 0$ la forma implicita diventa $3x + 6 = 0$, cioè $x = -2$: la retta taglia l'asse $x$ in $A(-2, 0)$.

Per $P$ si usa la forma esplicita: con $x = -4$ si ottiene $\dfrac{3}{2} \cdot (-4) + 3 = -6 + 3 = -3$, che è proprio $y_P$. Il punto $P$ appartiene alla retta.

```tikz
% nome: retta-con-frazioni-punti-sugli-assi
% alt: La retta y = 3x/2 + 3 taglia l'asse x in A(-2, 0) e l'asse y in B(0, 3), e passa anche per il punto P(-4, -3)
% svg: retta-con-frazioni-punti-sugli-assi-8cc294cf.svg 170x184
\begin{tikzpicture}[scale=0.5]
\draw[gray!30, very thin] (-4.5,-3.5) grid (2.5,4.5);
\draw[->] (-4.7,0) -- (2.9,0) node[right] {$x$};
\draw[->] (0,-3.7) -- (0,4.9) node[above] {$y$};
\foreach \x in {-4,-3,-1,1,2} \draw (\x,0.08) -- (\x,-0.08) node[below] {\small $\x$};
\foreach \y in {-3,-2,1,2,4} \draw (0.08,\y) -- (-0.08,\y) node[right] {\small $\y$};
\draw[thick, blue!60] (-4.33,-3.5) -- (1,4.5);
\fill (-2,0) circle (0.12) node[above left] {$A$};
\fill (0,3) circle (0.12) node[left] {$B$};
\fill (-4,-3) circle (0.12) node[left] {$P$};
\end{tikzpicture}
```
```

```ad-example
Esempio 8: equazioni a cui manca qualcosa
Per ciascuna retta di' di che tipo è, trova i punti sugli assi e disegnala: $3x - 6 = 0$, $4y + 2 = 0$, $3x + 5y = 0$.

La retta $3x - 6 = 0$ ha $b = 0$: dividendo per $3$ si ottiene $x = 2$, una retta verticale. Taglia l'asse $x$ in $(2, 0)$, non taglia mai l'asse $y$ e non ha forma esplicita.

La retta $4y + 2 = 0$ ha $a = 0$: si ricava $y = -\dfrac{1}{2}$, una retta orizzontale. Taglia l'asse $y$ in $\left(0, -\dfrac{1}{2}\right)$ e non taglia mai l'asse $x$.

La retta $3x + 5y = 0$ ha $c = 0$ e passa per l'origine. Qui le intersezioni con gli assi non aiutano, perché con $x = 0$ si trova $y = 0$ e con $y = 0$ si trova $x = 0$: tutte e due sono l'origine. Serve un secondo punto, e con $x = 5$ si ottiene $15 + 5y = 0$, cioè $y = -3$: il punto $(5, -3)$. In forma esplicita la retta è $y = -\dfrac{3}{5}x$.

```tikz
% nome: rette-verticale-orizzontale-per-origine
% alt: Tre rette: la verticale x = 2, l'orizzontale y = -1/2 e la retta 3x + 5y = 0, che passa per l'origine e per il punto (5, -3)
% svg: rette-verticale-orizzontale-per-origine-955a3795.svg 178x171
\begin{tikzpicture}[scale=0.55]
\draw[gray!30, very thin] (-1.5,-3.5) grid (5.5,2.5);
\draw[->] (-1.7,0) -- (5.9,0) node[right] {$x$};
\draw[->] (0,-3.7) -- (0,2.9) node[above] {$y$};
\foreach \x in {1,3,4,5} \draw (\x,-0.08) -- (\x,0.08) node[above] {\small $\x$};
\foreach \y in {-3,-2,-1,1,2} \draw (0.08,\y) -- (-0.08,\y) node[left] {\small $\y$};
\draw[thick, red!50] (2,-3.5) -- (2,2.5) node[above] {$x = 2$};
\draw[thick, teal!60] (-1.5,-0.5) -- (5.5,-0.5);
\node[teal!60!black, below] at (4.4,-0.5) {$y = -\frac{1}{2}$};
\draw[thick, blue!60] (-1.5,0.9) -- (5.5,-3.3);
\node[blue!70!black, below left] at (5.5,-3.35) {$3x + 5y = 0$};
\fill (5,-3) circle (0.11);
\end{tikzpicture}
```
```

```ad-warning
Un'equazione senza $y$ non è un numero
Risolvendo $3x - 6 = 0$ si trova $x = 2$, e viene da pensare a un solo numero, o a un punto. Nel piano cartesiano $x = 2$ è un'equazione in due incognite in cui la $y$ non compare: le sue soluzioni sono tutte le coppie $(2, y)$, con $y$ qualsiasi, e formano una retta verticale.
```

```ad-example
Esempio 9: una retta con un parametro
Data la retta $(k - 1)x + 2y - 4 = 0$, trova per quale valore di $k$ è orizzontale e per quale passa per il punto $A(2, 0)$. Esiste un valore di $k$ per cui passa per l'origine?

La retta è orizzontale quando il coefficiente della $x$ è zero: $k - 1 = 0$, cioè $k = 1$. L'equazione diventa $2y - 4 = 0$, cioè $y = 2$. Il coefficiente della $y$ invece vale sempre $2$, quindi la retta non è verticale per nessun valore di $k$.

Perché passi per $A$, le coordinate di $A$ devono rendere vera l'equazione:

$$
\begin{aligned}
(k - 1) \cdot 2 + 2 \cdot 0 - 4 &= 0 \\
2k - 6 &= 0 \\
k &= 3
\end{aligned}
$$

Con $k = 3$ la retta è $2x + 2y - 4 = 0$, cioè $x + y - 2 = 0$, e infatti $2 + 0 - 2 = 0$.

Per l'origine si mette $x = 0$ e $y = 0$: l'equazione diventa $-4 = 0$, falsa qualunque sia $k$. Nessuna retta di questa famiglia passa per l'origine, perché il termine noto vale sempre $-4$.
```
