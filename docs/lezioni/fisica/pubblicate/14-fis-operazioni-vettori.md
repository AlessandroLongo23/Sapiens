# Somma e differenza di vettori

Cammini per $3\,\text{km}$ verso est e poi per $4\,\text{km}$ verso nord: dal punto di partenza sei lontano $5\,\text{km}$, non $7$. Due spostamenti uno dopo l'altro, due forze che tirano la stessa barca, il vento che spinge un aereo di lato: in tutti questi casi si sommano [grandezze vettoriali](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/grandezze-scalari-e-grandezze-vettoriali), e la loro somma tiene conto delle direzioni. Il vettore somma si chiama anche **risultante**.

## La regola punta-coda

Per sommare $\vec{a}$ e $\vec{b}$ si disegna $\vec{b}$ con l'origine sulla punta di $\vec{a}$, senza cambiarne modulo, direzione e verso. Il vettore **somma** $\vec{a} + \vec{b}$ va dall'origine di $\vec{a}$ alla punta di $\vec{b}$. È quello che succede con due spostamenti: il secondo parte da dove è finito il primo, e lo spostamento totale va dalla partenza all'arrivo.

```tikz
% nome: somma-punta-coda
% alt: Il vettore a, 3 chilometri verso est, e il vettore b, 4 chilometri verso nord, disegnato con l'origine sulla punta di a; il vettore somma, in arancione, va dall'origine di a alla punta di b ed è lungo 5 chilometri
% svg: somma-punta-coda-96a40119.svg 117x124
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-0.5,-0.5) grid (4.5,4.5);
\draw[-{Stealth}, thick, blue] (0,0) -- (3,0) node[midway, below] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (3,0) -- (3,4) node[midway, right] {$\vec{b}$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (3,4) node[midway, above left] {$\vec{a} + \vec{b}$};
\fill (0,0) circle (2.5pt);
\end{tikzpicture}
```

Con i quadretti di $1\,\text{km}$ la figura è il cammino dell'inizio: $\vec{a}$ è lo spostamento di $3\,\text{km}$ verso est, $\vec{b}$ quello di $4\,\text{km}$ verso nord. I due vettori e la somma formano un triangolo rettangolo, e la somma è l'ipotenusa: il suo modulo è $\sqrt{3^2 + 4^2} = 5\,\text{km}$, come dice il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide).

## La regola del parallelogramma

Quando i due vettori partono dallo stesso punto, come due forze applicate allo stesso corpo, si usa la **regola del parallelogramma**: dalla punta di $\vec{a}$ si traccia la parallela a $\vec{b}$, dalla punta di $\vec{b}$ la parallela ad $\vec{a}$, e si ottiene un parallelogramma. La somma $\vec{a} + \vec{b}$ è la diagonale che parte dall'origine comune.

```tikz
% nome: somma-parallelogramma
% alt: I vettori a, tre quadretti a destra e uno in alto, e b, un quadretto a destra e due in alto, partono dallo stesso punto; le parallele tratteggiate completano il parallelogramma, e la somma in arancione è la diagonale che parte dall'origine comune e arriva a quattro quadretti a destra e tre in alto
% svg: somma-parallelogramma-41ddb270.svg 178x133
\begin{tikzpicture}[scale=0.8]
\draw[gray!25, very thin] (-0.5,-0.5) grid (4.5,3.5);
\draw[dashed, thin] (3,1) -- (4,3);
\draw[dashed, thin] (1,2) -- (4,3);
\draw[-{Stealth}, thick, blue] (0,0) -- (3,1) node[midway, below right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (1,2) node[midway, above left] {$\vec{b}$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (4,3) node[above right] {$\vec{a} + \vec{b}$};
\fill (0,0) circle (2pt);
\end{tikzpicture}
```

Le due regole danno lo stesso vettore: il lato tratteggiato che va dalla punta di $\vec{a}$ al vertice opposto è una copia di $\vec{b}$, quindi il parallelogramma contiene il triangolo della regola punta-coda. La figura mostra anche che l'ordine non conta: con la copia di $\vec{a}$ attaccata a $\vec{b}$ si arriva allo stesso vertice, quindi

$$\vec{a} + \vec{b} = \vec{b} + \vec{a}$$

Trascina le punte di $\vec{a}$ e di $\vec{b}$, poi passa da una regola all'altra con il bottone: la somma, che nella figura si chiama $\vec{s}$, resta la stessa.

```interattivo
% nome: somma-vettori-parallelogramma
% alt: Su una griglia i vettori a e b partono dallo stesso punto e le loro punte si trascinano sugli incroci; il parallelogramma tratteggiato e la somma in arancione seguono. Un bottone sposta b sulla punta di a e mostra la regola punta-coda; sotto sono scritti i moduli di a, di b e della somma, e la somma dei moduli per confronto
```

```ad-warning
Il modulo della somma non è la somma dei moduli
Nell'esempio del cammino $3\,\text{km} + 4\,\text{km}$ fa $7\,\text{km}$ di strada, ma lo spostamento è di $5\,\text{km}$. Il modulo della somma è uguale alla somma dei moduli solo quando i due vettori hanno la stessa direzione e lo stesso verso; in tutti gli altri casi è minore. Prima di sommare due moduli, guarda le direzioni.
```

## La somma di più vettori

Per sommare tre o più vettori si ripete la regola punta-coda: ogni vettore parte dalla punta del precedente, e la somma va dall'origine del primo alla punta dell'ultimo. I vettori formano una spezzata, e la somma la chiude. L'ordine in cui si mettono i vettori cambia la spezzata ma non la somma.

```ad-example
Esempio 1: quattro spostamenti
Un cane in un prato fa quattro tratti in linea retta: $6\,\text{m}$ verso est, $9\,\text{m}$ verso nord, $2\,\text{m}$ verso ovest, $6\,\text{m}$ verso sud. Trova lo spostamento totale.

```tikz
% nome: somma-quattro-spostamenti
% alt: Su una griglia quattro spostamenti uno dopo l'altro: 6 metri verso est, 9 verso nord, 2 verso ovest, 6 verso sud; lo spostamento totale, in arancione, va dalla partenza all'arrivo, 4 metri a est e 3 a nord della partenza
% svg: somma-quattro-spostamenti-f2ac6002.svg 131x181
\begin{tikzpicture}[scale=0.4]
\draw[gray!25, very thin] (-1,-1) grid (7,10);
\draw[-{Stealth}, thick, blue] (0,0) -- (6,0) node[midway, below] {$\vec{s}_1$};
\draw[-{Stealth}, thick, blue] (6,0) -- (6,9) node[midway, right] {$\vec{s}_2$};
\draw[-{Stealth}, thick, blue] (6,9) -- (4,9) node[midway, above] {$\vec{s}_3$};
\draw[-{Stealth}, thick, blue] (4,9) -- (4,3) node[midway, left] {$\vec{s}_4$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (4,3) node[midway, above left] {$\vec{s}$};
\fill (0,0) circle (4pt);
\end{tikzpicture}
```

Messi punta-coda, i quattro spostamenti portano il cane in un punto che sta $6 - 2 = 4\,\text{m}$ a est della partenza e $9 - 6 = 3\,\text{m}$ a nord. Lo spostamento totale $\vec{s} = \vec{s}_1 + \vec{s}_2 + \vec{s}_3 + \vec{s}_4$ è l'ipotenusa di un triangolo rettangolo con i cateti di $4\,\text{m}$ e $3\,\text{m}$:

$$s = \sqrt{4^2 + 3^2} = 5\,\text{m}$$

Il cane ha percorso $6 + 9 + 2 + 6 = 23\,\text{m}$, ma si è spostato di $5\,\text{m}$.
```

## Il vettore opposto e la differenza

L'**opposto** di $\vec{b}$ è il vettore $-\vec{b}$, che ha lo stesso modulo e la stessa direzione di $\vec{b}$ e il verso opposto. Sommati, un vettore e il suo opposto danno il vettore nullo: $\vec{b} + (-\vec{b}) = \vec{0}$.

La **differenza** $\vec{a} - \vec{b}$ è la somma di $\vec{a}$ con l'opposto di $\vec{b}$:

$$\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$$

Quindi si fa come una somma: si gira $\vec{b}$ e lo si attacca alla punta di $\vec{a}$.

```tikz
% nome: differenza-vettori
% alt: I vettori a e b partono dallo stesso punto O; l'opposto di b, tratteggiato, parte dalla punta di a; la differenza a meno b, in arancione, va da O alla punta dell'opposto di b; una sua copia arancione sottile va dalla punta di b alla punta di a
% svg: differenza-vettori-4c655932.svg 150x185
\begin{tikzpicture}[scale=0.6]
\draw[gray!25, very thin] (-0.5,-3.5) grid (5.5,4.5);
\draw[-{Stealth}, thick, blue] (0,0) -- (5,1) node[pos=0.55, below right] {$\vec{a}$};
\draw[-{Stealth}, thick, blue] (0,0) -- (1,4) node[midway, left] {$\vec{b}$};
\draw[-{Stealth}, thick, blue, dashed] (5,1) -- (4,-3) node[midway, right] {$-\vec{b}$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (4,-3) node[midway, below left] {$\vec{a} - \vec{b}$};
\draw[-{Stealth}, thin, orange!90!black] (1,4) -- (5,1);
\fill (0,0) circle (2.5pt);
\node[left] at (0,0) {$O$};
\end{tikzpicture}
```

Nella figura $\vec{a}$ va di $5$ quadretti a destra e $1$ in alto, $\vec{b}$ di $1$ a destra e $4$ in alto. L'opposto $-\vec{b}$ va di $1$ a sinistra e $4$ in basso, quindi $\vec{a} - \vec{b}$ va di $5 - 1 = 4$ quadretti a destra e di $1 - 4 = -3$, cioè $3$ in basso: il suo modulo è $\sqrt{4^2 + 3^2} = 5$ quadretti.

La freccia arancione sottile mostra una scorciatoia: quando $\vec{a}$ e $\vec{b}$ partono dallo stesso punto, $\vec{a} - \vec{b}$ è il vettore che va dalla punta di $\vec{b}$ alla punta di $\vec{a}$. Infatti $\vec{b} + (\vec{a} - \vec{b}) = \vec{a}$: partendo da $O$ e facendo prima $\vec{b}$ e poi $\vec{a} - \vec{b}$ si arriva alla punta di $\vec{a}$.

```interattivo
% nome: differenza-vettori-opposto
% alt: Su una griglia i vettori a e b partono dallo stesso punto e le loro punte si trascinano; l'opposto di b, tratteggiato, è attaccato alla punta di a e la differenza a meno b è in arancione. Un bottone fa scorrere la differenza finché va dalla punta di b alla punta di a; sotto sono scritti i moduli
```

```ad-warning
L'ordine conta nella differenza
$\vec{b} - \vec{a}$ è l'opposto di $\vec{a} - \vec{b}$: stesso modulo, verso opposto. Nella figura $\vec{b} - \vec{a}$ va dalla punta di $\vec{a}$ alla punta di $\vec{b}$. E, come per la somma, il modulo della differenza non è la differenza dei moduli: qui $a - b \approx 5{,}1 - 4{,}1 = 1$, mentre il modulo di $\vec{a} - \vec{b}$ è $5$.
```

## Il prodotto di un vettore per un numero

Moltiplicare il vettore $\vec{a}$ per un numero $k$ (uno scalare) dà un vettore $k\vec{a}$ che ha:

- modulo $|k| \cdot a$, cioè il modulo di $\vec{a}$ moltiplicato per il valore assoluto di $k$;
- la stessa direzione di $\vec{a}$;
- lo stesso verso di $\vec{a}$ se $k$ è positivo, il verso opposto se $k$ è negativo.

Se $k = 0$ il prodotto è il vettore nullo. Con $k = -1$ si ottiene l'opposto: $(-1)\vec{a} = -\vec{a}$.

```tikz
% nome: vettore-per-numero
% alt: Il vettore a lungo 4 metri verso est e i suoi multipli, uno sotto l'altro: 3a è lungo 12 metri verso est, meno 2a è lungo 8 metri verso ovest, a mezzi è lungo 2 metri verso est
% svg: vettore-per-numero-e3d5fd81.svg 223x93
\begin{tikzpicture}[scale=0.4]
\draw[-{Stealth}, thick, blue] (0,0) -- (4,0);
\node[left] at (-0.3,0) {$\vec{a}$};
\draw[-{Stealth}, thick, orange!90!black] (0,-1.5) -- (12,-1.5);
\node[left] at (-0.3,-1.5) {$3\vec{a}$};
\draw[-{Stealth}, thick, orange!90!black] (8,-3) -- (0,-3);
\node[left] at (-0.3,-3) {$-2\vec{a}$};
\draw[-{Stealth}, thick, orange!90!black] (0,-4.5) -- (2,-4.5);
\node[left] at (-0.3,-4.5) {$\frac{1}{2}\vec{a}$};
\foreach \x in {0,1,...,12} \draw[gray!50, very thin] (\x,0.4) -- (\x,-4.9);
\end{tikzpicture}
```

```ad-example
Esempio 2: multipli di uno spostamento
Il vettore $\vec{a}$ è uno spostamento di $4\,\text{m}$ verso est. Descrivi $3\vec{a}$, $-2\vec{a}$ e $\frac{1}{2}\vec{a}$.

$3\vec{a}$ ha modulo $3 \cdot 4 = 12\,\text{m}$, verso est. $-2\vec{a}$ ha modulo $|-2| \cdot 4 = 8\,\text{m}$ e verso ovest, perché il numero è negativo. $\frac{1}{2}\vec{a}$ ha modulo $2\,\text{m}$, verso est. Tutti e tre hanno la direzione est-ovest di $\vec{a}$.
```

Sposta il cursore e guarda cosa fa il numero al vettore: lo allunga, lo accorcia, lo annulla e lo rovescia.

```interattivo
% nome: vettore-per-scalare
% alt: Il vettore a è fisso in alto a sinistra; un cursore cambia il numero k da meno 3 a 3, e il vettore k per a, in arancione, si allunga, si accorcia, diventa nullo per k uguale a zero e si rovescia per k negativo; sotto sono scritti il modulo di k per a e il suo verso
```

```ad-warning
Il segno meno non va nel modulo
Il modulo di $-2\vec{a}$ è $8\,\text{m}$, non $-8\,\text{m}$: il segno meno dice che il verso è opposto a quello di $\vec{a}$, e il modulo si calcola con il valore assoluto di $k$.
```

## Vettori con la stessa direzione

Quando i vettori stanno sulla stessa retta la somma si fa con i moduli, ma tenendo conto dei versi:

- con lo stesso verso, il modulo della somma è la somma dei moduli, e il verso è quello comune;
- con versi opposti, il modulo della somma è la differenza tra il modulo maggiore e il minore, e il verso è quello del vettore con il modulo maggiore.

Si fa prima scegliendo un verso positivo sulla retta e scrivendo con il segno meno i vettori che vanno nel verso opposto: allora la somma è la somma dei numeri con il segno, e il segno del risultato dà il verso.

```tikz
% nome: somma-vettori-stessa-direzione
% alt: A sinistra due forze nello stesso verso, di 30 e di 12 newton, e la loro somma di 42 newton nello stesso verso; a destra due forze di 30 newton verso destra e di 12 newton verso sinistra, e la loro somma di 18 newton verso destra
% svg: somma-vettori-stessa-direzione-eb50aaf9.svg 231x63
\begin{tikzpicture}[scale=0.075]
\draw[-{Stealth}, thick, red] (0,0) -- (30,0) node[midway, above] {\small $30$ N};
\draw[-{Stealth}, thick, red] (0,-7) -- (12,-7) node[midway, above] {\small $12$ N};
\draw[-{Stealth}, thick, orange!90!black] (0,-14) -- (42,-14) node[midway, above] {\small $42$ N};
\draw[-{Stealth}, thick, red] (50,0) -- (80,0) node[midway, above] {\small $30$ N};
\draw[-{Stealth}, thick, red] (80,-7) -- (68,-7) node[midway, above] {\small $12$ N};
\draw[-{Stealth}, thick, orange!90!black] (50,-14) -- (68,-14) node[midway, above] {\small $18$ N};
\end{tikzpicture}
```

```ad-example
Esempio 3: due forze sulla stessa retta
Una cassa è tirata verso destra con una forza di $30\,\text{N}$ e verso sinistra con una forza di $12\,\text{N}$, sulla stessa retta orizzontale. Trova la forza risultante. E se tutte e due tirassero verso destra?

Con il verso positivo a destra, le forze sono $+30\,\text{N}$ e $-12\,\text{N}$, e la somma è $30 - 12 = +18\,\text{N}$: la risultante ha modulo $18\,\text{N}$ e verso destra, quello della forza maggiore. Se tirassero tutte e due verso destra, la risultante avrebbe modulo $30 + 12 = 42\,\text{N}$, verso destra.
```

```ad-warning
Il verso della risultante
Con versi opposti non basta scrivere $18\,\text{N}$: la risultante ha il verso del vettore con il modulo maggiore, e la risposta completa è "$18\,\text{N}$ verso destra". Un errore frequente è sottrarre al contrario, $12 - 30$, e poi dare il verso della forza minore.
```

## Vettori perpendicolari

Quando due vettori sono perpendicolari, il parallelogramma è un rettangolo, e la somma è la sua diagonale. Il modulo della somma si trova con il teorema di Pitagora:

$$|\vec{a} + \vec{b}| = \sqrt{a^2 + b^2}$$

```ad-example
Esempio 4: due forze perpendicolari
Due ragazzi tirano una slitta con due corde, uno verso est con una forza di $6{,}0\,\text{N}$ e l'altro verso nord con una forza di $8{,}0\,\text{N}$. Quanto vale il modulo della risultante?

```tikz
% nome: somma-vettori-perpendicolari
% alt: Due forze applicate allo stesso punto, 6 newton verso est e 8 newton verso nord, con il rettangolo tratteggiato che completano; la risultante, in arancione, è la diagonale, di 10 newton
% svg: somma-vettori-perpendicolari-4b9cc1eb.svg 95x119
\begin{tikzpicture}[scale=0.3]
\draw[dashed, thin] (6,0) -- (6,8);
\draw[dashed, thin] (0,8) -- (6,8);
\draw[-{Stealth}, thick, red] (0,0) -- (6,0) node[midway, below] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (0,0) -- (0,8) node[midway, left] {$\vec{F}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (6,8) node[midway, below right] {$\vec{R}$};
\draw[thin] (0.8,0) -- (0.8,0.8) -- (0,0.8);
\fill (0,0) circle (6pt);
\end{tikzpicture}
```

Le forze sono perpendicolari, quindi la risultante è la diagonale del rettangolo:

$$R = \sqrt{6{,}0^2 + 8{,}0^2} = \sqrt{100} = 10\,\text{N}$$

La slitta è tirata come da un'unica corda con una forza di $10\,\text{N}$, lungo la diagonale, e non di $14\,\text{N}$.
```

## La somma per componenti

Su una griglia un vettore si descrive con due numeri: di quanti quadretti va a destra e di quanti va in alto. Sono le sue **componenti**, e si scrivono con i pedici $x$ e $y$: il vettore $\vec{a}$ della regola del parallelogramma ha $a_x = 3$ e $a_y = 1$. Una componente è negativa quando il vettore va a sinistra o in basso: il vettore $\vec{a} - \vec{b}$ della differenza ha la componente $y$ uguale a $-3$.

Messi punta-coda, i passi a destra dei due vettori si sommano, e così i passi in alto. Quindi le componenti della somma sono le somme delle componenti:

$$
\begin{gathered}
s_x = a_x + b_x \\
s_y = a_y + b_y
\end{gathered}
$$

e il modulo della somma viene dal teorema di Pitagora, $s = \sqrt{s_x^2 + s_y^2}$. Per la differenza le componenti si sottraggono.

```ad-example
Esempio 5: somma e differenza con le componenti
Sulla griglia della regola del parallelogramma, con i quadretti di $1\,\text{m}$, $\vec{a}$ ha le componenti $a_x = 3\,\text{m}$ e $a_y = 1\,\text{m}$, $\vec{b}$ ha le componenti $b_x = 1\,\text{m}$ e $b_y = 2\,\text{m}$. Trova il modulo di $\vec{a} + \vec{b}$ e di $\vec{a} - \vec{b}$.

Per la somma:

$$
\begin{gathered}
s_x = 3 + 1 = 4\,\text{m} \\
s_y = 1 + 2 = 3\,\text{m} \\
s = \sqrt{4^2 + 3^2} = 5\,\text{m}
\end{gathered}
$$

Per la differenza $\vec{d} = \vec{a} - \vec{b}$ le componenti sono $d_x = 3 - 1 = 2\,\text{m}$ e $d_y = 1 - 2 = -1\,\text{m}$, e il modulo è $d = \sqrt{2^2 + (-1)^2} = \sqrt{5} \approx 2{,}2\,\text{m}$. Il quadrato di una componente negativa è positivo: il segno conta per il verso, non per il modulo.
```

Le componenti funzionano con vettori in qualsiasi direzione, anche quando non stanno sugli incroci di una griglia: si calcolano dal modulo e dall'angolo con il seno e il coseno, nella lezione [Seno e coseno per scomporre un vettore](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/seno-e-coseno-per-scomporre-un-vettore). È il metodo che si usa di più, perché trasforma la somma di vettori in somme di numeri.
