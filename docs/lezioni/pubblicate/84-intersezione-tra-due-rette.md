# Intersezione tra due rette

Due rette disegnate nello stesso piano cartesiano di solito si incontrano in un punto, e le coordinate di quel punto si trovano con un conto, senza leggerle dal disegno: sono la soluzione del sistema formato dalle equazioni delle due rette. Con lo stesso conto si capisce se le rette sono parallele o coincidenti, si trovano i vertici di un triangolo di cui si conoscono i lati e si controlla se tre rette passano per lo stesso punto. Per seguire la lezione devi saper scrivere l'equazione di una retta, come nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari), e risolvere un sistema, come nella lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite).

## Il punto comune è la soluzione del sistema

Un punto sta su una retta quando le sue coordinate, messe al posto di $x$ e $y$, rendono vera l'equazione della retta. Un punto che sta su due rette deve quindi rendere vere tutte e due le equazioni nello stesso momento: le sue coordinate sono una soluzione del sistema formato dalle due equazioni. Il **punto di intersezione** di due rette è il punto che hanno in comune, e si trova così:

1. Scrivi il sistema con le equazioni delle due rette.
2. Risolvilo con il metodo più comodo: il confronto se tutte e due le rette sono in forma esplicita $y = mx + q$, la sostituzione o la riduzione se sono in forma implicita $ax + by + c = 0$.
3. Scrivi il punto con le coordinate trovate, prima la $x$ e poi la $y$.

```ad-example
Esempio 1: due rette in forma esplicita
Trova il punto di intersezione delle rette $r: y = 2x - 1$ e $s: y = -x + 5$.

Le due equazioni danno già $y$: usa il confronto e uguaglia i secondi membri.

$$
\begin{gathered}
2x - 1 = -x + 5 \\
\Rightarrow 3x = 6 \\
\Rightarrow x = 2
\end{gathered}
$$

Metti $x = 2$ in una delle due equazioni, per esempio nella seconda: $y = -2 + 5 = 3$. Il punto di intersezione è $P(2, 3)$. Controllo sulla prima retta: $2 \cdot 2 - 1 = 3$.

```tikz
% nome: intersezione-rette-forma-esplicita
% alt: Le rette y = 2x - 1 e y = -x + 5 nel piano cartesiano con la griglia: si incontrano nel punto P di coordinate 2 e 3
% svg: intersezione-rette-forma-esplicita-5df20035.svg 159x174
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-1,-2) grid (6,6);
\draw[->] (-1.4,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,6.6) node[above] {$y$};
\foreach \x in {1,2,3,4,5} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {-1,1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-0.4,-1.8) -- (3.4,5.8);
\draw[thick, red!50] (-0.8,5.8) -- (5.8,-0.8);
\draw[dashed, gray] (2,0) -- (2,3) -- (0,3);
\fill (2,3) circle (0.14);
\node[right] at (2.1,3.3) {$P$};
\node[blue!70!black, left] at (3.4,5.4) {$r$};
\node[red!60!black, right] at (5.8,-0.8) {$s$};
\end{tikzpicture}
```
```

La figura aiuta a controllare il risultato, ma le coordinate si trovano con il sistema: quando non sono intere, dal disegno non si leggono.

```ad-example
Esempio 2: due rette in forma implicita
Trova il punto di intersezione delle rette $r: x + 2y - 3 = 0$ e $s: 3x - 4y - 4 = 0$.

Porta i termini noti a secondo membro, cambiando il segno, e scrivi il sistema in forma normale:

$$
\begin{cases}
x + 2y = 3 \\
3x - 4y = 4
\end{cases}
$$

Usa la riduzione: moltiplica la prima equazione per $2$, così i coefficienti di $y$ diventano $+4$ e $-4$, e somma.

$$
\begin{gathered}
2x + 4y = 6 \\
3x - 4y = 4 \\
\text{somma: } 5x = 10 \\
x = 2
\end{gathered}
$$

Metti $x = 2$ nella prima: $2 + 2y = 3$, quindi $2y = 1$ e $y = \dfrac{1}{2}$. Il punto di intersezione è $P\left(2, \dfrac{1}{2}\right)$. Controllo su $s$: $3 \cdot 2 - 4 \cdot \dfrac{1}{2} - 4 = 6 - 2 - 4 = 0$.
```

```ad-warning
Il termine noto nella forma implicita
In $x + 2y - 3 = 0$ il termine noto sta a primo membro. Nel sistema in forma normale diventa $x + 2y = 3$, con il segno cambiato; chi lo copia com'è e scrive $x + 2y = -3$ trova il punto d'incontro di un'altra retta. Si può anche lasciare tutto nella forma $\dots = 0$ e ridurre così, purché il termine noto resti dalla stessa parte in tutte e due le equazioni.
```

```ad-warning
Fermarsi alla prima coordinata
Trovato $x = 2$, il punto non è ancora trovato: serve anche $y$. E la risposta è un punto, $P\left(2, \dfrac{1}{2}\right)$, con l'ascissa al primo posto: scrivere $\left(\dfrac{1}{2}, 2\right)$ vuol dire indicare un altro punto.
```

### Rette parallele agli assi

Quando una delle due rette è parallela a un asse, il sistema si risolve per sostituzione in un passaggio: la retta verticale $x = h$ dà già l'ascissa del punto, la retta orizzontale $y = k$ dà già l'ordinata. Anche gli assi sono rette di questo tipo: l'asse $x$ ha equazione $y = 0$ e l'asse $y$ ha equazione $x = 0$, e i punti in cui una retta taglia gli assi, che trovi nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari), sono intersezioni tra due rette come le altre.

```ad-example
Esempio 3: una retta verticale
Trova il punto di intersezione delle rette $r: x = -2$ e $s: 3x + 2y - 1 = 0$.

Tutti i punti di $r$ hanno ascissa $-2$: sostituisci $x = -2$ nell'equazione di $s$.

$$
\begin{gathered}
3 \cdot (-2) + 2y - 1 = 0 \\
\Rightarrow -6 + 2y - 1 = 0 \\
\Rightarrow 2y = 7 \\
\Rightarrow y = \frac{7}{2}
\end{gathered}
$$

Il punto di intersezione è $P\left(-2, \dfrac{7}{2}\right)$.
```

```ad-warning
La retta $x = -2$ non è il punto $x = -2$
L'equazione $x = -2$ nel piano non indica un numero, ma la retta verticale formata da tutti i punti con ascissa $-2$. Nell'esempio 3 la risposta non è "$x = -2$": è il punto $P\left(-2, \dfrac{7}{2}\right)$, con tutte e due le coordinate.
```

## Incidenti, parallele o coincidenti

Due rette nel piano possono stare in tre modi, e ognuno corrisponde a un tipo di sistema, come nella lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite):

- due rette **incidenti** hanno un solo punto in comune, e il sistema è determinato;
- due rette **parallele distinte** non hanno punti in comune, e il sistema è impossibile;
- due rette **coincidenti** sono la stessa retta, hanno tutti i punti in comune, e il sistema è indeterminato.

```tikz
% nome: rette-incidenti-parallele-coincidenti
% alt: Tre riquadri affiancati: due rette incidenti che si incontrano in un punto, due rette parallele distinte che non si incontrano e due rette coincidenti sovrapposte
% svg: rette-incidenti-parallele-coincidenti-637ba093.svg 276x99
\begin{tikzpicture}
\draw[gray!60] (0,0) rectangle (2.2,2);
\draw[thick, blue!60] (0.2,0.3) -- (2,1.7);
\draw[thick, red!50] (0.2,1.6) -- (2,0.4);
\fill (1.1,1.0) circle (0.06);
\node[below] at (1.1,0) {\small incidenti};
\begin{scope}[xshift=2.5cm]
\draw[gray!60] (0,0) rectangle (2.2,2);
\draw[thick, blue!60] (0.2,0.7) -- (1.6,1.8);
\draw[thick, red!50] (0.6,0.2) -- (2,1.3);
\node[below] at (1.1,0) {\small parallele};
\end{scope}
\begin{scope}[xshift=5cm]
\draw[gray!60] (0,0) rectangle (2.2,2);
\draw[line width=3pt, blue!35] (0.2,0.3) -- (2,1.7);
\draw[thick, dashed, red!60] (0.2,0.3) -- (2,1.7);
\node[below] at (1.1,0) {\small coincidenti};
\end{scope}
\end{tikzpicture}
```

Per sapere in quale caso sei non serve risolvere il sistema: si confrontano le equazioni, in due modi.

### Dai coefficienti della forma implicita

Con le rette $ax + by + c = 0$ e $a'x + b'y + c' = 0$, e con $a'$, $b'$ e $c'$ diversi da zero, si confrontano i rapporti tra i coefficienti, come nella lezione sui sistemi:

| Rapporti | Rette |
|---|---|
| $\dfrac{a}{a'} \neq \dfrac{b}{b'}$ | incidenti |
| $\dfrac{a}{a'} = \dfrac{b}{b'} \neq \dfrac{c}{c'}$ | parallele distinte |
| $\dfrac{a}{a'} = \dfrac{b}{b'} = \dfrac{c}{c'}$ | coincidenti |

I termini noti $c$ e $c'$ stanno a primo membro invece che a secondo, ma cambiano segno tutti e due, quindi il loro rapporto è lo stesso che nella forma normale del sistema. Se uno dei coefficienti è zero il rapporto non si scrive: le rette sono incidenti quando $ab' \neq a'b$, e altrimenti parallele o coincidenti.

### Dal coefficiente angolare e dall'ordinata all'origine

Con le rette in forma esplicita $y = mx + q$ e $y = m'x + q'$ il confronto è più diretto, perché $m$ dice la pendenza della retta e $q$ il punto in cui taglia l'asse $y$ (il significato di $m$ è nella lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti)):

| $m$ e $q$ | Rette |
|---|---|
| $m \neq m'$ | incidenti |
| $m = m'$, $q \neq q'$ | parallele distinte |
| $m = m'$, $q = q'$ | coincidenti |

Due rette con pendenze diverse prima o poi si incontrano; due rette con la stessa pendenza si incontrano solo se partono dallo stesso punto dell'asse $y$, e allora sono la stessa retta. Le rette verticali $x = h$ non hanno forma esplicita e non hanno $m$: due rette verticali sono parallele (o coincidenti, se $h$ è lo stesso), mentre una retta verticale e una non verticale sono sempre incidenti, come nell'esempio 3. Il parallelismo come condizione su $m$ si studia nella lezione [Rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari).

Le tre righe della tabella sono tre posizioni dei cursori. La retta blu è $y = 2x - 1$ e resta ferma; la rossa è $y = mx + q$, e all'inizio è la retta $y = -x + 5$ dell'esempio 1.

```grafico
% nome: rette-incidenti-parallele-coincidenti-cursori
% alt: La retta y = 2x - 1 e la retta y = mx + q con i cursori di m e di q e le coordinate del punto comune P: con m diverso da 2 le rette sono incidenti, con m = 2 sono parallele e P non esiste, con m = 2 e q = -1 coincidono
curva: y=2x-1
curva: y=mx+q | rosso
curva: P=\left(\frac{q+1}{2-m};\frac{2\left(q+1\right)}{2-m}-1\right) | nero
cursore: m = -1 da -4 a 4 passo 0,5
cursore: q = 5 da -6 a 6 passo 0,5
finestra: x da -6 a 6, y da -5 a 7
valore: P = \left(\frac{q+1}{2-m};\frac{2\left(q+1\right)}{2-m}-1\right)
domanda: Porta $m$ a $2$: dove finisce il punto $P$? Poi porta anche $q$ a $-1$. E se lasci $q = -1$ e cambi $m$, dove si incontrano le due rette?
```

```ad-example
Esempio 4: tre coppie di rette
a) $r: 2x - 3y + 1 = 0$ e $s: 4x - 6y - 5 = 0$.

$$
\begin{gathered}
\frac{a}{a'} = \frac{2}{4} = \frac{1}{2} \\
\frac{b}{b'} = \frac{-3}{-6} = \frac{1}{2} \\
\frac{c}{c'} = \frac{1}{-5} = -\frac{1}{5}
\end{gathered}
$$

I primi due rapporti sono uguali e il terzo no: le rette sono parallele distinte. In forma esplicita diventano $y = \dfrac{2}{3}x + \dfrac{1}{3}$ e $y = \dfrac{2}{3}x - \dfrac{5}{6}$: stessa $m$, $q$ diverse.

b) $r: y = 3x - 2$ e $s: 6x - 2y - 4 = 0$.

Porta $s$ in forma esplicita: $-2y = -6x + 4$, e dividendo per $-2$ si ottiene $y = 3x - 2$. È la stessa equazione di $r$: le rette sono coincidenti.

c) $r: y = -x + 4$ e $s: y = 2x + 4$.

Le $q$ sono uguali ma le $m$ no ($-1$ e $2$): le rette sono incidenti. Il punto comune è quello sull'asse $y$ con ordinata $4$, cioè $(0, 4)$.
```

```ad-warning
Stessa $q$ non vuol dire parallele
Nell'esempio 4c le due rette hanno la stessa $q$ e si incontrano proprio sull'asse $y$. Il parallelismo lo decide $m$: la $q$ conta solo quando le $m$ sono già uguali, per distinguere le parallele dalle coincidenti.
```

```ad-warning
Leggere $m$ nella forma implicita
Nella retta $2x - 3y + 1 = 0$ il coefficiente angolare non è $2$: prima si ricava $y$, e si trova $m = \dfrac{2}{3}$. Chi confronta i coefficienti di $x$ di due equazioni implicite come se fossero le $m$ sbaglia ogni volta che i coefficienti di $y$ sono diversi.
```

Se risolvi il sistema senza aver fatto il confronto, lo capisci alla fine: con due rette parallele distinte le incognite spariscono e resta un'uguaglianza falsa come $0 = 7$; con due rette coincidenti resta un'uguaglianza sempre vera, $0 = 0$.

## Problemi con i triangoli

Tre rette che si incontrano a due a due in tre punti diversi formano un triangolo, e i tre punti di intersezione ne sono i vertici. Nei problemi di questo tipo si risolvono tre sistemi, uno per ogni coppia di lati.

### Vertici di un triangolo dati i lati

```ad-example
Esempio 5: tre lati, tre vertici
I lati di un triangolo $ABC$ stanno sulle rette

$$
\begin{gathered}
AB: x + 3y - 2 = 0 \\
BC: 2x + y - 9 = 0 \\
CA: 4x - 3y + 7 = 0
\end{gathered}
$$

Trova i vertici.

Il vertice $A$ sta sui lati $AB$ e $CA$: è la loro intersezione. Nel sistema i coefficienti di $y$ sono $+3$ e $-3$: somma le due equazioni.

$$
\begin{gathered}
(x + 4x) + (3y - 3y) - 2 + 7 = 0 \\
\Rightarrow 5x + 5 = 0 \\
\Rightarrow x = -1
\end{gathered}
$$

Da $AB$: $-1 + 3y - 2 = 0$, quindi $y = 1$, e il vertice è $A(-1, 1)$.

Il vertice $B$ sta su $AB$ e $BC$. Da $BC$ ricavi $y = 9 - 2x$ e lo sostituisci in $AB$:

$$
\begin{gathered}
x + 3(9 - 2x) - 2 = 0 \\
\Rightarrow -5x + 25 = 0 \\
\Rightarrow x = 5
\end{gathered}
$$

quindi $y = 9 - 10 = -1$, e il vertice è $B(5, -1)$.

Il vertice $C$ sta su $BC$ e $CA$. Sostituisci di nuovo $y = 9 - 2x$, questa volta in $CA$:

$$
\begin{gathered}
4x - 3(9 - 2x) + 7 = 0 \\
\Rightarrow 10x - 20 = 0 \\
\Rightarrow x = 2
\end{gathered}
$$

quindi $y = 9 - 4 = 5$, e il vertice è $C(2, 5)$.

```tikz
% nome: vertici-triangolo-dati-i-lati
% alt: Il triangolo ABC con i lati sulle rette x + 3y - 2 = 0, 2x + y - 9 = 0 e 4x - 3y + 7 = 0 e i vertici A(-1, 1), B(5, -1) e C(2, 5)
% svg: vertici-triangolo-dati-i-lati-8499e4cb.svg 163x164
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-2,-2) grid (6,6);
\draw[->] (-2.4,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-2.4) -- (0,6.6) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y);
\foreach \y in {2,3,4,5} \node[left] at (-0.12,\y) {\small $\y$};
\draw[thick, blue!60] (-2,1.333) -- (6,-1.333);
\draw[thick, red!50] (1.5,6) -- (5.5,-2);
\draw[thick, green!45!black] (-1.75,0) -- (2.75,6);
\fill (-1,1) circle (0.14) node[above left] {$A$};
\fill (5,-1) circle (0.14) node[below] {$B$};
\fill (2,5) circle (0.14) node[right] {$C$};
\end{tikzpicture}
```
```

```ad-warning
Il vertice sta sui due lati che lo nominano
Il vertice $A$ è l'intersezione dei lati $AB$ e $CA$, i due che contengono la lettera $A$. Se metti a sistema $AB$ e $BC$ trovi $B$, non $A$: prima di risolvere, scegli la coppia di rette giusta per il vertice che cerchi.
```

### Area di un triangolo con un lato su un asse

Quando un lato del triangolo sta sull'asse $x$, la sua lunghezza è la distanza tra due punti con la stessa ordinata, cioè il valore assoluto della differenza delle ascisse, come nella lezione [Il piano cartesiano: distanza e punto medio](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio). L'altezza relativa a quel lato è la distanza del terzo vertice dall'asse $x$, cioè il valore assoluto della sua ordinata. Se il lato sta sull'asse $y$ i ruoli si scambiano: base dalle ordinate, altezza dall'ascissa del terzo vertice.

```ad-example
Esempio 6: il terzo vertice sotto l'asse
Trova l'area del triangolo formato dalle rette $r: x - 2y - 2 = 0$, $s: 3x + 2y + 6 = 0$ e dall'asse $x$.

L'asse $x$ ha equazione $y = 0$. Mettendo $y = 0$ nelle due rette:

$$
\begin{gathered}
r: x - 2 = 0 \ \Rightarrow \ x = 2 \\
s: 3x + 6 = 0 \ \Rightarrow \ x = -2
\end{gathered}
$$

I vertici sull'asse sono $A(-2, 0)$ e $B(2, 0)$. Il terzo vertice è l'intersezione di $r$ e $s$: sommando le due equazioni i termini in $y$ spariscono.

$$
\begin{gathered}
4x + 4 = 0 \ \Rightarrow \ x = -1 \\
-1 - 2y - 2 = 0 \ \Rightarrow \ y = -\frac{3}{2}
\end{gathered}
$$

Il terzo vertice è $C\left(-1, -\dfrac{3}{2}\right)$, sotto l'asse $x$. La base è $\overline{AB} = |2 - (-2)| = 4$ e l'altezza è $\left|-\dfrac{3}{2}\right| = \dfrac{3}{2}$:

$$
\text{Area} = \frac{1}{2} \cdot 4 \cdot \frac{3}{2} = 3
$$

```tikz
% nome: area-triangolo-lato-asse-x
% alt: Il triangolo con i vertici A(-2, 0) e B(2, 0) sull'asse x e il terzo vertice C(-1, -3/2) sotto l'asse, con l'altezza tratteggiata da C all'asse x
% svg: area-triangolo-lato-asse-x-f81fd7fc.svg 184x137
\begin{tikzpicture}[scale=0.62]
\draw[gray!25, very thin] (-3,-3) grid (3,1);
\fill[blue!10] (-2,0) -- (2,0) -- (-1,-1.5) -- cycle;
\draw[->] (-3.4,0) -- (3.6,0) node[right] {$x$};
\draw[->] (0,-3.3) -- (0,1.6) node[above] {$y$};
\foreach \x in {-3,-2,-1,1,2,3} \draw (\x,0.1) -- (\x,-0.1);
\foreach \y in {-3,-2,-1,1} \draw (0.1,\y) -- (-0.1,\y) node[right] {\small $\y$};
\draw[thick, blue!60] (-2.6,-2.3) -- (3.4,0.7) node[above] {$r$};
\draw[thick, red!50] (-0.4,-2.4) -- (-2.6,0.9) node[above] {$s$};
\draw[dashed] (-1,0) -- (-1,-1.5);
\fill (-2,0) circle (0.1) node[above left] {$A$};
\fill (2,0) circle (0.1) node[above] {$B$};
\fill (-1,-1.5) circle (0.1) node[below left] {$C$};
\end{tikzpicture}
```
```

```ad-warning
Altezza negativa
L'ordinata di $C$ è $-\dfrac{3}{2}$, ma una lunghezza non è mai negativa: l'altezza è $\dfrac{3}{2}$. Chi usa l'ordinata con il suo segno trova un'area di $-3$, che non ha senso. Lo stesso vale per la base: la differenza delle ascisse va presa in valore assoluto.
```

### Triangoli con un vertice nell'origine

Una retta che non passa per l'origine e non è parallela a un asse forma con i due assi un triangolo rettangolo, con il vertice dell'angolo retto nell'origine $O(0, 0)$. I cateti stanno sugli assi, e le loro lunghezze sono i valori assoluti delle coordinate dei punti in cui la retta taglia gli assi.

```ad-example
Esempio 7: il triangolo con gli assi
Trova l'area del triangolo che la retta $r: 2x - 5y + 10 = 0$ forma con gli assi.

Con $y = 0$: $2x + 10 = 0$, quindi $x = -5$ e il punto sull'asse $x$ è $A(-5, 0)$. Con $x = 0$: $-5y + 10 = 0$, quindi $y = 2$ e il punto sull'asse $y$ è $B(0, 2)$. I cateti sono $\overline{OA} = |-5| = 5$ e $\overline{OB} = 2$:

$$
\text{Area} = \frac{1}{2} \cdot 5 \cdot 2 = 5
$$
```

Un triangolo con un vertice nell'origine può avere anche i lati fuori dagli assi: due lati stanno su rette per l'origine, $y = mx$, e il terzo su un'altra retta. Allora $O$ è l'intersezione dei primi due lati, e gli altri due vertici si trovano con due sistemi.

```ad-example
Esempio 8: un triangolo rettangolo in $O$
Le rette $r: y = 2x$, $s: x + 2y = 0$ e $t: 3x + y - 10 = 0$ formano un triangolo. Trova i vertici, verifica che il triangolo è rettangolo in $O$ e calcola l'area.

Le rette $r$ e $s$ passano tutte e due per l'origine, quindi un vertice è $O(0, 0)$. Il vertice $A$ è l'intersezione di $r$ e $t$: sostituisci $y = 2x$ in $t$.

$$
\begin{gathered}
3x + 2x - 10 = 0 \\
\Rightarrow x = 2, \ y = 4
\end{gathered}
$$

Quindi $A(2, 4)$. Il vertice $B$ è l'intersezione di $s$ e $t$: da $s$ ricavi $x = -2y$ e sostituisci in $t$.

$$
\begin{gathered}
-6y + y - 10 = 0 \\
\Rightarrow y = -2, \ x = 4
\end{gathered}
$$

Quindi $B(4, -2)$. La retta $s$ in forma esplicita è $y = -\dfrac{1}{2}x$: i coefficienti angolari di $r$ e $s$ sono $2$ e $-\dfrac{1}{2}$, e il loro prodotto è $-1$, quindi $r$ e $s$ sono perpendicolari, come nella lezione [Rette parallele e perpendicolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/rette-parallele-e-perpendicolari). Il triangolo è rettangolo in $O$, e i cateti sono $OA$ e $OB$:

$$
\begin{gathered}
\overline{OA} = \sqrt{2^2 + 4^2} = \sqrt{20} \\
\overline{OB} = \sqrt{4^2 + (-2)^2} = \sqrt{20}
\end{gathered}
$$

$$
\text{Area} = \frac{1}{2} \cdot \sqrt{20} \cdot \sqrt{20} = 10
$$

I due cateti sono uguali ($\sqrt{20} = 2\sqrt{5}$): il triangolo è anche isoscele.

```tikz
% nome: triangolo-rettangolo-vertice-origine
% alt: Il triangolo OAB con O nell'origine, A(2, 4) sulla retta y = 2x e B(4, -2) sulla retta x + 2y = 0, rettangolo in O; il lato AB sta sulla retta 3x + y - 10 = 0
% svg: triangolo-rettangolo-vertice-origine-fd846138.svg 132x169
\begin{tikzpicture}[scale=0.42]
\draw[gray!25, very thin] (-1,-3) grid (5,5);
\fill[blue!10] (0,0) -- (2,4) -- (4,-2) -- cycle;
\draw[->] (-1.4,0) -- (5.6,0) node[right] {$x$};
\draw[->] (0,-3.4) -- (0,5.6) node[above] {$y$};
\foreach \x in {1,2,3,4} \draw (\x,0.12) -- (\x,-0.12);
\foreach \y in {-2,-1,1,2,3,4} \draw (0.12,\y) -- (-0.12,\y);
\node[below] at (2,-0.1) {\small $2$};
\node[left] at (-0.1,4) {\small $4$};
\draw[thick, blue!60] (-0.5,-1) -- (2.6,5.2) node[right] {$r$};
\draw[thick, red!50] (5.2,-2.6) -- (-1,0.5) node[above] {$s$};
\draw[thick, green!45!black] (1.6,5.2) -- (4.4,-3.2) node[right] {$t$};
\draw (0.268,0.536) -- (0.804,0.268) -- (0.536,-0.268);
\fill (0,0) circle (0.14) node[below left] {$O$};
\fill (2,4) circle (0.14) node[left] {$A$};
\fill (4,-2) circle (0.14) node[below left] {$B$};
\end{tikzpicture}
```
```

L'area di un triangolo qualsiasi, senza lati sugli assi e senza angolo retto, si calcola con la distanza di un vertice dalla retta del lato opposto, nella lezione [Distanza di un punto da una retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta).

## Tre rette per lo stesso punto

Tre rette si dicono **concorrenti** quando passano tutte per lo stesso punto. Per controllarlo:

1. Trova il punto di intersezione di due delle tre rette.
2. Sostituisci le sue coordinate nell'equazione della terza retta.
3. Se l'uguaglianza è vera, le tre rette passano per quel punto; se è falsa, la terza retta non ci passa, e le tre rette formano un triangolo (o hanno due lati paralleli).

```ad-example
Esempio 9: rette concorrenti e no
Le rette $r: x - y + 1 = 0$, $s: 2x + y - 7 = 0$ e $t: x + 2y - 8 = 0$ passano per lo stesso punto? E le rette $r$, $s$ e $u: 4x - y - 4 = 0$?

Intersezione di $r$ e $s$: sommando le due equazioni la $y$ sparisce.

$$
\begin{gathered}
3x - 6 = 0 \ \Rightarrow \ x = 2 \\
2 - y + 1 = 0 \ \Rightarrow \ y = 3
\end{gathered}
$$

Il punto comune a $r$ e $s$ è $P(2, 3)$. Sostituisci in $t$: $2 + 2 \cdot 3 - 8 = 0$, vero. Le rette $r$, $s$ e $t$ passano tutte per $P(2, 3)$.

Sostituisci ora in $u$: $4 \cdot 2 - 3 - 4 = 1$, che non è $0$. La retta $u$ non passa per $P$: le rette $r$, $s$ e $u$ non sono concorrenti.

```tikz
% nome: tre-rette-concorrenti
% alt: Le rette x - y + 1 = 0, 2x + y - 7 = 0 e x + 2y - 8 = 0 passano tutte per il punto P(2, 3)
% svg: tre-rette-concorrenti-2a7f355a.svg 156x157
\begin{tikzpicture}[scale=0.45]
\draw[gray!25, very thin] (-1,-1) grid (6,6);
\draw[->] (-1.4,0) -- (6.6,0) node[right] {$x$};
\draw[->] (0,-1.4) -- (0,6.6) node[above] {$y$};
\foreach \x in {1,2,3,4,5} \draw (\x,0.12) -- (\x,-0.12) node[below] {\small $\x$};
\foreach \y in {1,2,3,4,5} \draw (0.12,\y) -- (-0.12,\y) node[left] {\small $\y$};
\draw[thick, blue!60] (-1,0) -- (4.6,5.6) node[above] {$r$};
\draw[thick, red!50] (4,-1) -- (0.6,5.8) node[above] {$s$};
\draw[thick, green!45!black] (-1,4.5) -- (6,1) node[above] {$t$};
\fill (2,3) circle (0.14);
\node[above right] at (2.1,3.1) {$P$};
\end{tikzpicture}
```
```

A volte nella terza retta c'è un parametro, e il problema chiede per quale valore le tre rette sono concorrenti. Si procede allo stesso modo: il punto comune alle due rette senza parametro deve stare anche sulla terza, e sostituendo le sue coordinate si ottiene un'equazione nel parametro.

```ad-example
Esempio 10: il valore del parametro
Per quale valore di $k$ le rette $r: x - y + 1 = 0$, $s: 2x + y - 7 = 0$ e $v: kx + y - 9 = 0$ passano per lo stesso punto?

Il punto comune a $r$ e $s$ è $P(2, 3)$, trovato nell'esempio 9. Perché $v$ passi per $P$, le sue coordinate devono verificarne l'equazione:

$$
\begin{gathered}
k \cdot 2 + 3 - 9 = 0 \\
\Rightarrow 2k = 6 \\
\Rightarrow k = 3
\end{gathered}
$$

Con $k = 3$ la retta è $v: 3x + y - 9 = 0$, e infatti $3 \cdot 2 + 3 - 9 = 0$.
```

```ad-warning
Tre rette che si incontrano a due a due
Tre rette non parallele si incontrano sempre a due a due, ma di solito in tre punti diversi: così formano un triangolo, come nell'esempio 5. Per dire che sono concorrenti non basta trovare un punto di intersezione: serve controllare che quel punto stia anche sulla terza retta.
```

Le rette che passano tutte per lo stesso punto sono infinite, e si possono descrivere con una sola equazione con un parametro: è il fascio di rette, nella lezione [Fasci di rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/fasci-di-rette).
