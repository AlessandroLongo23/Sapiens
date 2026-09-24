# Frazioni e numeri razionali

Se dividi una torta in $8$ fette uguali e ne mangi $3$, hai mangiato $\dfrac{3}{8}$ della torta. Se dividi $7$ euro fra $2$ persone, ognuna riceve $\dfrac{7}{2}$ di euro, cioè $3{,}5$ euro, anche se $7 : 2$ non dà un numero intero. Le frazioni servono proprio a questo: a prendere una parte di una grandezza e a scrivere il risultato di qualunque divisione, anche quando non è esatta. Con le frazioni nasce un nuovo insieme di numeri, quello dei numeri razionali $\mathbb{Q}$.

## La frazione

Una **frazione** è una scrittura $\dfrac{a}{b}$ in cui $a$ e $b$ sono numeri interi e $b \neq 0$. Il numero sopra la linea di frazione, $a$, è il **numeratore**; quello sotto, $b$, è il **denominatore**.

In $\dfrac{3}{8}$ il numeratore è $3$ e il denominatore è $8$. Anche $\dfrac{-5}{2}$, $\dfrac{0}{7}$ e $\dfrac{12}{4}$ sono frazioni; $\dfrac{5}{0}$ invece non lo è, perché il denominatore non può essere zero.

Una frazione si può leggere in due modi, come operatore e come quoziente, e i due modi danno lo stesso numero.

### La frazione come operatore

Prendere $\dfrac{3}{4}$ di una grandezza vuol dire dividerla in $4$ parti uguali e prenderne $3$. Il denominatore dice in quante parti si divide l'intero, il numeratore quante parti se ne prendono. Una frazione con il numeratore $1$, come $\dfrac{1}{4}$, si chiama **unità frazionaria**: è una sola di quelle parti.

```tikz
% nome: frazione-tre-quarti-di-un-rettangolo
% alt: Rettangolo diviso in quattro parti uguali, di cui tre colorate: le parti colorate sono i tre quarti del rettangolo
% svg: frazione-tre-quarti-di-un-rettangolo-e561da8f.svg 231x87
\begin{tikzpicture}
\fill[blue!20] (0,0) rectangle (4.5,1.2);
\draw[thick] (0,0) rectangle (6,1.2);
\draw (1.5,0) -- (1.5,1.2);
\draw (3,0) -- (3,1.2);
\draw (4.5,0) -- (4.5,1.2);
\node at (0.75,0.6) {$\frac{1}{4}$};
\node at (2.25,0.6) {$\frac{1}{4}$};
\node at (3.75,0.6) {$\frac{1}{4}$};
\node at (5.25,0.6) {$\frac{1}{4}$};
\draw (0,-0.15) -- (0,-0.3) -- (4.5,-0.3) -- (4.5,-0.15);
\node[below] at (2.25,-0.35) {$\frac{3}{4}$};
\end{tikzpicture}
```

Per calcolare la frazione di un numero lo si divide per il denominatore e si moltiplica il risultato per il numeratore.

```ad-example
Esempio 1: 3/4 di 20
Dividi $20$ in $4$ parti: $20 : 4 = 5$. Prendine $3$: $5 \cdot 3 = 15$. Quindi $\dfrac{3}{4}$ di $20$ è $15$.
```

```ad-example
Esempio 2: dalla parte all'intero
I $\dfrac{3}{5}$ degli studenti di una classe sono $15$. Quanti sono gli studenti?

Qui si conosce la parte e si cerca l'intero, quindi si fa il cammino al contrario. Tre quinti sono $15$ studenti, quindi un quinto è $15 : 3 = 5$ studenti, e i cinque quinti, cioè tutta la classe, sono $5 \cdot 5 = 25$ studenti.

Controllo: $\dfrac{3}{5}$ di $25$ è $25 : 5 \cdot 3 = 15$.
```

```ad-warning
Invertire i passaggi nel problema inverso
Se i $\dfrac{3}{5}$ della classe sono $15$ studenti, la classe non è $\dfrac{3}{5}$ di $15$, che è $9$: la classe è più grande della sua parte. Si divide per il numeratore e si moltiplica per il denominatore, e alla fine si controlla con il calcolo diretto.
```

### La frazione come quoziente

La frazione $\dfrac{a}{b}$ è anche il risultato della divisione $a : b$:

$$\dfrac{a}{b} = a : b \qquad (b \neq 0)$$

Le due letture vanno d'accordo. Dividere $3$ pizze fra $4$ persone dà a ognuna $3 : 4$ pizze; tagliando ogni pizza in $4$ spicchi, ognuno riceve $3$ spicchi da un quarto, cioè $\dfrac{3}{4}$ di pizza.

Leggere la frazione come quoziente dice subito quanto vale: $\dfrac{12}{4} = 12 : 4 = 3$, $\dfrac{7}{2} = 7 : 2 = 3{,}5$, $\dfrac{0}{7} = 0 : 7 = 0$. Come passare da una frazione al numero decimale, e viceversa, lo trovi nella lezione [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni).

```ad-warning
Zero al numeratore e zero al denominatore
$\dfrac{0}{7} = 0$, perché $0 : 7 = 0$. $\dfrac{7}{0}$ invece non esiste, perché non si può dividere per zero: nessun numero moltiplicato per $0$ dà $7$.
```

## Frazioni proprie, improprie e apparenti

Per ora guarda le frazioni con numeratore e denominatore positivi. Confrontando il numeratore con il denominatore si distinguono tre tipi di frazione.

- Una frazione è **propria** se il numeratore è minore del denominatore, come $\dfrac{3}{5}$. Prende meno parti di quelle che formano l'intero, quindi vale meno di $1$.
- Una frazione è **impropria** se il numeratore è maggiore del denominatore o uguale a esso, come $\dfrac{9}{4}$ o $\dfrac{5}{5}$. Vale $1$ o più di $1$.
- Una frazione impropria è **apparente** se il numeratore è un multiplo del denominatore, come $\dfrac{12}{3}$ o $\dfrac{5}{5}$. Sembra una frazione, ma è un numero intero: $\dfrac{12}{3} = 4$ e $\dfrac{5}{5} = 1$.

Una frazione impropria ma non apparente sta tra due interi consecutivi, che si trovano con la divisione con resto. Per $\dfrac{9}{4}$: $9 = 4 \cdot 2 + 1$, quindi $\dfrac{9}{4}$ sono $2$ interi e $\dfrac{1}{4}$, e sta tra $2$ e $3$.

```ad-example
Esempio 3: classificare
- $\dfrac{4}{7}$ è propria, perché $4 < 7$.
- $\dfrac{11}{3}$ è impropria, perché $11 > 3$; non è apparente, perché $11$ non è multiplo di $3$. Da $11 = 3 \cdot 3 + 2$ segue che sta tra $3$ e $4$.
- $\dfrac{18}{6}$ è apparente: $18 = 6 \cdot 3$, quindi $\dfrac{18}{6} = 3$.
- $\dfrac{7}{7}$ è apparente e vale $1$.
```

```ad-warning
Confondere apparente con semplificabile
$\dfrac{6}{4}$ si può semplificare, e diventa $\dfrac{3}{2}$, ma non è apparente: $6$ non è multiplo di $4$ e $\dfrac{6}{4} = 1{,}5$ non è un intero. Apparente vuol dire che il denominatore divide il numeratore.
```

Per una frazione negativa si guarda la frazione senza il segno: $-\dfrac{9}{4}$ è impropria perché lo è $\dfrac{9}{4}$.

## Frazioni equivalenti

Due frazioni sono **equivalenti** quando rappresentano lo stesso numero, cioè la stessa parte dell'intero. $\dfrac{2}{3}$ e $\dfrac{4}{6}$ sono equivalenti: se dividi ognuno dei tre terzi in due parti, i due terzi diventano quattro sesti.

```tikz
% nome: frazioni-equivalenti-due-terzi-quattro-sesti
% alt: Due rettangoli uguali, il primo diviso in tre parti con due colorate, il secondo diviso in sei parti con quattro colorate: la parte colorata è la stessa
% svg: frazioni-equivalenti-due-terzi-quattro-sesti-f8d1ec0f.svg 256x117
\begin{tikzpicture}
\fill[blue!20] (0,1.6) rectangle (4,2.6);
\draw[thick] (0,1.6) rectangle (6,2.6);
\draw (2,1.6) -- (2,2.6);
\draw (4,1.6) -- (4,2.6);
\node[left] at (-0.2,2.1) {$\frac{2}{3}$};
\fill[blue!20] (0,0) rectangle (4,1);
\draw[thick] (0,0) rectangle (6,1);
\draw (1,0) -- (1,1);
\draw (2,0) -- (2,1);
\draw (3,0) -- (3,1);
\draw (4,0) -- (4,1);
\draw (5,0) -- (5,1);
\node[left] at (-0.2,0.5) {$\frac{4}{6}$};
\draw[dashed] (4,-0.2) -- (4,2.8);
\end{tikzpicture}
```

### Proprietà invariantiva

Se moltiplichi o dividi il numeratore e il denominatore di una frazione per lo stesso numero diverso da zero, ottieni una frazione equivalente. È la **proprietà invariantiva**:

$$\dfrac{a}{b} = \dfrac{a \cdot k}{b \cdot k} \qquad (k \neq 0)$$

e, quando $k$ divide sia $a$ sia $b$, $\dfrac{a}{b} = \dfrac{a : k}{b : k}$.

Moltiplicando per $2, 3, 4, \ldots$ si ottengono infinite frazioni equivalenti alla stessa frazione:

$$\dfrac{3}{5} = \dfrac{6}{10} = \dfrac{9}{15} = \dfrac{12}{20} = \ldots$$

```ad-warning
Aggiungere lo stesso numero sopra e sotto
La proprietà invariantiva vale per la moltiplicazione e per la divisione, non per l'addizione e la sottrazione. $\dfrac{2+1}{3+1} = \dfrac{3}{4}$, che non è equivalente a $\dfrac{2}{3}$: $\dfrac{2}{3} = \dfrac{8}{12}$ e $\dfrac{3}{4} = \dfrac{9}{12}$.
```

### Il controllo in croce

Per sapere se due frazioni $\dfrac{a}{b}$ e $\dfrac{c}{d}$ sono equivalenti non serve trasformarle: sono equivalenti quando i prodotti in croce sono uguali,

$$\dfrac{a}{b} = \dfrac{c}{d} \quad \text{se e solo se} \quad a \cdot d = b \cdot c$$

```ad-example
Esempio 4: sono equivalenti?
$\dfrac{6}{8}$ e $\dfrac{9}{12}$: $6 \cdot 12 = 72$ e $8 \cdot 9 = 72$, quindi sono equivalenti (valgono tutte e due $\dfrac{3}{4}$).

$\dfrac{4}{6}$ e $\dfrac{6}{8}$: $4 \cdot 8 = 32$ e $6 \cdot 6 = 36$, quindi non sono equivalenti.
```

Il prodotto in croce serve anche a stabilire quale di due frazioni è maggiore: lo trovi nella lezione [Confronto tra frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/confronto-tra-frazioni).

## Riduzione ai minimi termini

Una frazione è **ridotta ai minimi termini**, o **irriducibile**, quando il numeratore e il denominatore non hanno divisori comuni diversi da $1$, cioè quando il loro MCD è $1$. $\dfrac{3}{4}$ è ridotta ai minimi termini; $\dfrac{6}{8}$ no, perché $6$ e $8$ sono divisibili per $2$.

Ridurre (o semplificare) una frazione vuol dire applicare la proprietà invariantiva dividendo, fino ad arrivare alla frazione irriducibile equivalente.

1. Calcola il MCD del numeratore e del denominatore (senza segni). Se non ricordi come si fa, c'è la lezione [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n).
2. Dividi il numeratore e il denominatore per il MCD.
3. Il segno, se c'è, resta davanti alla frazione.

Si può anche dividere a più riprese per un divisore comune che si vede subito ($2$, $3$, $5$, $10$), finché non ce ne sono più: si arriva alla stessa frazione, solo con più passaggi.

```ad-example
Esempio 5: ridurre 18/24
$\text{MCD}(18, 24) = 6$, quindi

$$\dfrac{18}{24} = \dfrac{18 : 6}{24 : 6} = \dfrac{3}{4}$$
```

```ad-example
Esempio 6: ridurre 60/84 in due modi
Con il MCD: $60 = 2^2 \cdot 3 \cdot 5$ e $84 = 2^2 \cdot 3 \cdot 7$, quindi $\text{MCD}(60, 84) = 2^2 \cdot 3 = 12$ e

$$\dfrac{60}{84} = \dfrac{60 : 12}{84 : 12} = \dfrac{5}{7}$$

A più riprese: dividi per $2$, poi ancora per $2$, poi per $3$.

$$\dfrac{60}{84} = \dfrac{30}{42} = \dfrac{15}{21} = \dfrac{5}{7}$$

$5$ e $7$ non hanno divisori comuni diversi da $1$, quindi ti fermi.
```

```ad-example
Esempio 7: ridurre −45/75 e 56/14
$\text{MCD}(45, 75) = 15$, quindi $-\dfrac{45}{75} = -\dfrac{45 : 15}{75 : 15} = -\dfrac{3}{5}$.

$\text{MCD}(56, 14) = 14$, perché $14$ divide $56$: $\dfrac{56}{14} = \dfrac{4}{1} = 4$. Quando il MCD è il denominatore, la frazione è apparente e la riduzione dà un intero.
```

```ad-warning
Semplificare gli addendi
In $\dfrac{6 + 2}{6 + 5}$ non si può cancellare il $6$ sopra e sotto: la frazione vale $\dfrac{8}{11}$, non $\dfrac{2}{5}$. Si semplificano solo i fattori, cioè numeri che moltiplicano tutto il numeratore e tutto il denominatore.
```

```ad-warning
Fermarsi troppo presto
Da $\dfrac{60}{84}$, dividendo per $2$, si ottiene $\dfrac{30}{42}$, che non è ancora irriducibile. Prima di chiudere controlla che numeratore e denominatore non abbiano più divisori comuni; dividendo per il MCD sei sicuro di arrivare in fondo con un passaggio solo.
```

## Frazioni con il segno

Numeratore e denominatore sono interi, quindi possono essere negativi. Il segno di una frazione segue la regola dei segni della divisione tra interi, che trovi in [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z): se numeratore e denominatore hanno lo stesso segno la frazione è positiva, se hanno segni diversi è negativa.

$$\dfrac{-3}{4} = \dfrac{3}{-4} = -\dfrac{3}{4} \qquad\qquad \dfrac{-3}{-4} = \dfrac{3}{4}$$

Di solito il denominatore si scrive positivo e il segno si mette davanti alla frazione o al numeratore. Anche questa è la proprietà invariantiva, con $k = -1$: $\dfrac{3}{-4} = \dfrac{3 \cdot (-1)}{(-4) \cdot (-1)} = \dfrac{-3}{4}$.

```ad-warning
Due segni meno non fanno una frazione negativa
$\dfrac{-3}{-4}$ è positiva, perché è $(-3) : (-4)$ e il quoziente di due numeri negativi è positivo: $\dfrac{-3}{-4} = \dfrac{3}{4}$.
```

```ad-example
Esempio 8: ridurre 28/−42
Prima il segno: numeratore positivo e denominatore negativo, quindi la frazione è negativa, $\dfrac{28}{-42} = -\dfrac{28}{42}$. Poi $\text{MCD}(28, 42) = 14$:

$$\dfrac{28}{-42} = -\dfrac{28 : 14}{42 : 14} = -\dfrac{2}{3}$$
```

## Il numero razionale

Frazioni equivalenti come $\dfrac{1}{2}$, $\dfrac{2}{4}$, $\dfrac{3}{6}$, $\dfrac{-5}{-10}$ sono scritture diverse dello stesso numero. Questo numero è un **numero razionale**: l'insieme di tutte le frazioni equivalenti a una frazione data. Il numero razionale $\dfrac{1}{2}$ è quindi l'insieme

$$\left\{ \dfrac{1}{2}, \dfrac{2}{4}, \dfrac{3}{6}, \dfrac{4}{8}, \ldots, \dfrac{-1}{-2}, \dfrac{-2}{-4}, \ldots \right\}$$

e si indica con una qualunque delle sue frazioni. Di solito si sceglie la frazione ridotta ai minimi termini con il denominatore positivo, che è una sola: per questo numero è $\dfrac{1}{2}$.

Nei conti la differenza tra frazione e numero razionale non si vede: quando scrivi $\dfrac{2}{4} = \dfrac{1}{2}$ stai dicendo che le due frazioni rappresentano lo stesso numero razionale.

## L'insieme ℚ

L'insieme di tutti i numeri razionali si indica con $\mathbb{Q}$:

$$\mathbb{Q} = \left\{ \dfrac{a}{b} \mid a \in \mathbb{Z},\ b \in \mathbb{Z},\ b \neq 0 \right\}$$

Ogni numero intero è anche un numero razionale, perché si scrive come frazione con il denominatore $1$ (o come qualunque frazione apparente equivalente): $5 = \dfrac{5}{1} = \dfrac{10}{2}$, $-3 = \dfrac{-3}{1} = \dfrac{-6}{2}$, $0 = \dfrac{0}{1}$. Per questo gli insiemi numerici sono uno dentro l'altro:

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$$

Le inclusioni sono strette: $-3$ è intero ma non naturale, $\dfrac{1}{2}$ è razionale ma non intero.

```tikz
% nome: insiemi-numerici-n-z-q
% alt: Tre insiemi uno dentro l'altro: N con 0, 1 e 7 dentro Z, che aggiunge meno 1 e meno 5, dentro Q, che aggiunge un mezzo, meno tre quarti e sette terzi
% svg: insiemi-numerici-n-z-q-9055d13c.svg 353x193
\begin{tikzpicture}
\draw[thick] (0,0) ellipse (4.6 and 2.5);
\draw[thick] (-1,0) ellipse (3.2 and 1.8);
\draw[thick] (-1.9,0) ellipse (1.7 and 1.1);
\node at (2.9,1.4) {$\mathbf{Q}$};
\node at (1.2,1.0) {$\mathbf{Z}$};
\node at (-2.3,0.6) {$\mathbf{N}$};
\node at (-2.4,-0.2) {$0$};
\node at (-1.6,0.1) {$1$};
\node at (-1.3,-0.5) {$7$};
\node at (0.8,0.3) {$-1$};
\node at (0.9,-0.6) {$-5$};
\node at (3.4,0.5) {$\frac{1}{2}$};
\node at (3.4,-0.4) {$-\frac{3}{4}$};
\node at (2.9,-1.3) {$\frac{7}{3}$};
\end{tikzpicture}
```

In $\mathbb{Z}$ la divisione non si può sempre fare: $7 : 2$ non ha un risultato intero. In $\mathbb{Q}$ sì, purché il divisore non sia zero, perché il risultato di $a : b$ è la frazione $\dfrac{a}{b}$. Come si fanno le quattro operazioni con le frazioni lo trovi in [Operazioni in ℚ](/materiale/scuola-superiore/matematica/numeri-razionali/operazioni-in-q).

```ad-note
Tra due razionali ce n'è sempre un altro
In $\mathbb{Z}$ ogni numero ha un successivo: dopo $3$ viene $4$. In $\mathbb{Q}$ no: tra due numeri razionali diversi ce n'è sempre un altro. Per esempio tra $\dfrac{1}{3} = \dfrac{4}{12}$ e $\dfrac{1}{2} = \dfrac{6}{12}$ c'è $\dfrac{5}{12}$, e ripetendo il ragionamento se ne trovano infiniti. Per questo si dice che $\mathbb{Q}$ è denso.
```

Non tutti i numeri sono razionali: ci sono numeri, come $\sqrt{2}$, che non si possono scrivere come frazione. Sono i [numeri irrazionali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali).

## Le frazioni sulla retta

Ogni numero razionale corrisponde a un punto della retta dei numeri. Per disegnare $\dfrac{a}{b}$:

1. scrivi la frazione con il denominatore positivo;
2. dividi ogni segmento tra due interi consecutivi in $b$ parti uguali;
3. partendo da $0$, conta $a$ parti verso destra se la frazione è positiva, verso sinistra se è negativa.

Per una frazione impropria conviene prima trovare fra quali interi sta, con la divisione con resto.

```ad-example
Esempio 9: 3/4, 7/4, −1/2 e −5/4 sulla retta
Tutti i denominatori dividono $4$, quindi dividi ogni unità in quarti ($-\dfrac{1}{2} = -\dfrac{2}{4}$).

- $\dfrac{3}{4}$: tre quarti a destra di $0$.
- $\dfrac{7}{4}$: $7 = 4 \cdot 1 + 3$, quindi sta tra $1$ e $2$, tre quarti dopo $1$.
- $-\dfrac{1}{2}$: due quarti a sinistra di $0$, a metà tra $-1$ e $0$.
- $-\dfrac{5}{4}$: $5 = 4 \cdot 1 + 1$, quindi sta tra $-2$ e $-1$, un quarto a sinistra di $-1$.

```tikz
% nome: frazioni-sulla-retta-quarti
% alt: Retta dei numeri da meno 2 a 2 divisa in quarti, con segnati meno cinque quarti, meno un mezzo, tre quarti e sette quarti
% svg: frazioni-sulla-retta-quarti-a6889e55.svg 360x60
\begin{tikzpicture}
\draw[->] (-4.6,0) -- (4.8,0);
\foreach \x in {-4,-3.5,-3,-2.5,-2,-1.5,-1,-0.5,0,0.5,1,1.5,2,2.5,3,3.5,4} \draw (\x,-0.08) -- (\x,0.08);
\foreach \x/\l in {-4/-2,-2/-1,0/0,2/1,4/2} {\draw (\x,-0.18) -- (\x,0.18); \node[below] at (\x,-0.2) {$\l$};}
\fill (-2.5,0) circle (0.07); \node[above] at (-2.5,0.15) {$-\frac{5}{4}$};
\fill (-1,0) circle (0.07); \node[above] at (-1,0.15) {$-\frac{1}{2}$};
\fill (1.5,0) circle (0.07); \node[above] at (1.5,0.15) {$\frac{3}{4}$};
\fill (3.5,0) circle (0.07); \node[above] at (3.5,0.15) {$\frac{7}{4}$};
\end{tikzpicture}
```
```

Frazioni equivalenti finiscono nello stesso punto, perché sono lo stesso numero: $\dfrac{2}{4}$ e $\dfrac{1}{2}$ stanno tutte e due a metà tra $0$ e $1$. Una frazione e la sua opposta, come $\dfrac{3}{4}$ e $-\dfrac{3}{4}$, stanno alla stessa distanza da $0$, da parti opposte. Più a destra c'è il numero maggiore: come si confrontano due frazioni senza disegnarle lo trovi in [Confronto tra frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/confronto-tra-frazioni).
