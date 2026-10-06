# Determinanti e regola di Cramer

Con i metodi di sostituzione, confronto e riduzione della lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite) un sistema si risolve un passaggio alla volta, e i passaggi cambiano da sistema a sistema. La regola di Cramer invece è una formula: dai coefficienti si calcolano tre numeri, i determinanti, e la soluzione è il quoziente di due di loro. Conviene quando i coefficienti sono scomodi, quando contengono un parametro, e con i sistemi di tre equazioni in tre incognite.

## Matrici e determinante di una matrice 2 × 2

Una **matrice** è una tabella di numeri disposti in righe e colonne, scritta tra parentesi tonde. Una matrice con due righe e due colonne si dice quadrata di ordine 2, o $2 \times 2$:

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

I numeri $a$, $b$, $c$, $d$ sono gli **elementi** della matrice. La **diagonale principale** è quella che va da $a$ a $d$, la **diagonale secondaria** quella che va da $b$ a $c$.

Il **determinante** della matrice è il numero che si ottiene moltiplicando gli elementi della diagonale principale e togliendo il prodotto degli elementi della diagonale secondaria. Si scrive con due barre verticali al posto delle parentesi:

$$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$$

```tikz
% nome: determinante-2x2-diagonali
% alt: Determinante di una matrice 2 per 2 con elementi a, b, c, d: la diagonale principale da a a d porta il segno più, la diagonale secondaria da c a b porta il segno meno
% svg: determinante-2x2-diagonali-680006a8.svg 116x68
\begin{tikzpicture}
\node (a) at (0,1) {$a$};
\node (b) at (1.1,1) {$b$};
\node (c) at (0,0) {$c$};
\node (d) at (1.1,0) {$d$};
\draw (-0.35,-0.35) -- (-0.35,1.35);
\draw (1.45,-0.35) -- (1.45,1.35);
\draw[blue!60, thick] (a) -- (d);
\draw[red!55, thick] (c) -- (b);
\node[right, blue!70] at (1.7,0.75) {$+\,ad$};
\node[right, red!65] at (1.7,0.25) {$-\,bc$};
\end{tikzpicture}
```

Per esempio:

$$
\begin{gathered}
\begin{vmatrix} 3 & 5 \\ 2 & 4 \end{vmatrix} = 12 - 10 = 2 \\
\begin{vmatrix} 1 & -2 \\ -3 & 6 \end{vmatrix} = 6 - 6 = 0
\end{gathered}
$$

Il determinante può essere positivo, negativo o zero. La matrice è una tabella, il determinante è un numero: le parentesi tonde e le barre non sono intercambiabili.

```ad-warning
I segni degli elementi negativi
Con un elemento negativo il prodotto va scritto tra parentesi, e il meno davanti al secondo prodotto si applica a tutto il prodotto. In $\begin{vmatrix} 2 & -3 \\ 4 & 1 \end{vmatrix}$ il prodotto della diagonale secondaria è $(-3) \cdot 4 = -12$, e il determinante è $2 - (-12) = 14$, non $2 - 12 = -10$.
```

## I tre determinanti di un sistema

Un sistema di due equazioni in due incognite in forma normale si scrive

$$
\begin{cases}
ax + by = c \\
a'x + b'y = c'
\end{cases}
$$

con le incognite nello stesso ordine in tutte e due le equazioni e i termini noti a secondo membro. Dai coefficienti si formano tre determinanti.

Il **determinante del sistema** $D$ ha per colonne i coefficienti di $x$ e quelli di $y$:

$$D = \begin{vmatrix} a & b \\ a' & b' \end{vmatrix} = ab' - a'b$$

Il determinante $D_x$ si ottiene da $D$ mettendo la colonna dei termini noti al posto della colonna dei coefficienti di $x$:

$$D_x = \begin{vmatrix} c & b \\ c' & b' \end{vmatrix} = cb' - c'b$$

Il determinante $D_y$ si ottiene da $D$ mettendo la colonna dei termini noti al posto della colonna dei coefficienti di $y$:

$$D_y = \begin{vmatrix} a & c \\ a' & c' \end{vmatrix} = ac' - a'c$$

```ad-tip
Come ricordare quale colonna cambia
Il nome dice quale colonna esce: in $D_x$ esce la colonna di $x$, in $D_y$ quella di $y$. La colonna dei termini noti entra al suo posto, nella stessa posizione, e l'altra colonna resta dov'era.
```

## La regola di Cramer

Se $D \neq 0$, il sistema ha una e una sola soluzione, e

$$x = \frac{D_x}{D} \qquad y = \frac{D_y}{D}$$

È la **regola di Cramer**. Da dove viene lo mostra il [metodo di riduzione](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite). Moltiplica la prima equazione per $b'$ e la seconda per $b$:

$$
\begin{cases}
ab'x + bb'y = cb' \\
a'bx + bb'y = c'b
\end{cases}
$$

Sottraendo membro a membro la $y$ sparisce, e resta

$$(ab' - a'b)\,x = cb' - c'b$$

cioè $D \cdot x = D_x$. Allo stesso modo, moltiplicando la prima equazione per $a'$ e la seconda per $a$ e sottraendo, sparisce la $x$ e resta $D \cdot y = D_y$. Ogni soluzione del sistema deve quindi rispettare

$$D \cdot x = D_x \qquad D \cdot y = D_y$$

Se $D \neq 0$ si divide per $D$ e si trova una sola coppia possibile; sostituendola nel sistema si controlla che lo risolve davvero. Queste due uguaglianze servono anche per la discussione, più avanti.

Il procedimento:

1. Porta il sistema in forma normale: togli parentesi e denominatori, porta le incognite a primo membro nell'ordine $x$, $y$ e i termini noti a secondo membro. Se in un'equazione manca un'incognita, il suo coefficiente è $0$.
2. Calcola $D$.
3. Se $D \neq 0$, calcola $D_x$ e $D_y$ e dividi: $x = \dfrac{D_x}{D}$, $y = \dfrac{D_y}{D}$.
4. Verifica la coppia in tutte e due le equazioni di partenza.

```ad-example
Esempio 1: un sistema determinato
Risolvi con la regola di Cramer

$$
\begin{cases}
2x + 3y = 7 \\
x - y = 1
\end{cases}
$$

Il sistema è già in forma normale. Il coefficiente di $y$ nella seconda equazione è $-1$.

$$
\begin{aligned}
D &= \begin{vmatrix} 2 & 3 \\ 1 & -1 \end{vmatrix} \\
&= 2 \cdot (-1) - 1 \cdot 3 \\
&= -5
\end{aligned}
$$

$D \neq 0$, quindi il sistema ha una sola soluzione. I termini noti $7$ e $1$ prendono il posto prima della colonna di $x$, poi di quella di $y$:

$$
\begin{aligned}
D_x &= \begin{vmatrix} 7 & 3 \\ 1 & -1 \end{vmatrix} \\
&= -7 - 3 = -10 \\
D_y &= \begin{vmatrix} 2 & 7 \\ 1 & 1 \end{vmatrix} \\
&= 2 - 7 = -5
\end{aligned}
$$

$$x = \frac{-10}{-5} = 2 \qquad y = \frac{-5}{-5} = 1$$

Verifica: $2 \cdot 2 + 3 \cdot 1 = 7$ e $2 - 1 = 1$. La soluzione è la coppia $(2, 1)$.
```

```ad-warning
Il quoziente al contrario
Il determinante del sistema sta sempre al denominatore: $x = \dfrac{D_x}{D}$, non $\dfrac{D}{D_x}$. Nell'esempio 1 il quoziente rovesciato darebbe $x = \dfrac{-5}{-10} = \dfrac{1}{2}$, e la verifica fallirebbe: con $y = 1$ la prima equazione dà $2 \cdot \dfrac{1}{2} + 3 = 4$, non $7$.
```

```ad-example
Esempio 2: prima la forma normale
Risolvi con la regola di Cramer

$$
\begin{cases}
3(x - 1) = 2y + 1 \\[4pt]
\dfrac{x}{2} + \dfrac{y}{3} = 1
\end{cases}
$$

Nella prima equazione togli la parentesi e porta $2y$ a primo membro e $-3$ a secondo membro: $3x - 2y = 4$. Nella seconda moltiplica tutto per $6$, il MCM dei denominatori: $3x + 2y = 6$. Il sistema in forma normale è

$$
\begin{cases}
3x - 2y = 4 \\
3x + 2y = 6
\end{cases}
$$

$$
\begin{aligned}
D &= \begin{vmatrix} 3 & -2 \\ 3 & 2 \end{vmatrix} \\
&= 6 - (-6) = 12 \\
D_x &= \begin{vmatrix} 4 & -2 \\ 6 & 2 \end{vmatrix} \\
&= 8 - (-12) = 20 \\
D_y &= \begin{vmatrix} 3 & 4 \\ 3 & 6 \end{vmatrix} \\
&= 18 - 12 = 6
\end{aligned}
$$

$$x = \frac{20}{12} = \frac{5}{3} \qquad y = \frac{6}{12} = \frac{1}{2}$$

Verifica nella seconda equazione di partenza: $\dfrac{5}{6} + \dfrac{1}{6} = 1$. La soluzione è la coppia $\left(\dfrac{5}{3}, \dfrac{1}{2}\right)$.
```

```ad-warning
Leggere i coefficienti prima della forma normale
Nell'esempio 2 il $2y$ della prima equazione sta a secondo membro: portato a sinistra diventa $-2y$, e nella prima riga di $D$ il coefficiente di $y$ è $-2$, non $2$. I determinanti si scrivono solo dopo aver portato il sistema in forma normale. Anche un'incognita che manca va messa in colonna: in $\begin{cases} x = 3 \\ x + y = 5 \end{cases}$ la prima riga di $D$ è $1$, $0$.
```

## La discussione con i determinanti

Le uguaglianze $D \cdot x = D_x$ e $D \cdot y = D_y$ dicono anche che cosa succede quando $D = 0$.

- Se $D \neq 0$, il sistema è determinato: una sola soluzione, quella della regola di Cramer.
- Se $D = 0$ e almeno uno tra $D_x$ e $D_y$ è diverso da zero, il sistema è impossibile: per esempio $D \cdot x = D_x$ diventa $0 \cdot x = D_x$ con $D_x \neq 0$, e nessun numero la rispetta.
- Se $D = D_x = D_y = 0$, il sistema è indeterminato, con infinite soluzioni, tranne in un caso particolare che trovi nel riquadro più sotto.

| $D$ | $D_x$ e $D_y$ | Il sistema è |
|---|---|---|
| $D \neq 0$ | qualunque | determinato |
| $D = 0$ | almeno uno $\neq 0$ | impossibile |
| $D = 0$ | tutti e due $= 0$ | indeterminato |

$D = 0$ vuol dire $ab' = a'b$: quando $a'$ e $b'$ non sono zero, è lo stesso che $\dfrac{a}{a'} = \dfrac{b}{b'}$, la condizione sui rapporti dei coefficienti della lezione [Sistemi di due equazioni in due incognite](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite). Nel grafico le due rette sono parallele (sistema impossibile) o coincidenti (sistema indeterminato).

```ad-example
Esempio 3: D uguale a zero
Discuti i due sistemi

$$
\begin{gathered}
\begin{cases}
2x - 4y = 3 \\
x - 2y = 1
\end{cases} \\[6pt]
\begin{cases}
2x - 4y = 2 \\
x - 2y = 1
\end{cases}
\end{gathered}
$$

I coefficienti delle incognite sono gli stessi nei due sistemi, quindi anche $D$:

$$
\begin{aligned}
D &= \begin{vmatrix} 2 & -4 \\ 1 & -2 \end{vmatrix} \\
&= -4 - (-4) = 0
\end{aligned}
$$

Nel primo sistema:

$$
\begin{aligned}
D_x &= \begin{vmatrix} 3 & -4 \\ 1 & -2 \end{vmatrix} \\
&= -6 - (-4) = -2
\end{aligned}
$$

$D = 0$ e $D_x \neq 0$: il primo sistema è impossibile, $S = \emptyset$. Infatti, dividendo per $2$ la prima equazione, si trova $x - 2y = \dfrac{3}{2}$, che contraddice $x - 2y = 1$.

Nel secondo sistema:

$$
\begin{aligned}
D_x &= \begin{vmatrix} 2 & -4 \\ 1 & -2 \end{vmatrix} = 0 \\
D_y &= \begin{vmatrix} 2 & 2 \\ 1 & 1 \end{vmatrix} = 0
\end{aligned}
$$

Tutti e tre i determinanti sono zero: il secondo sistema è indeterminato. La prima equazione è la seconda moltiplicata per $2$, e le soluzioni sono le infinite coppie che rispettano $x - 2y = 1$, come $(1, 0)$, $(3, 1)$, $(-1, -1)$.
```

```ad-warning
D uguale a zero non vuol dire impossibile
Con $D = 0$ la regola di Cramer non si usa, perché si dividerebbe per zero, ma il sistema non è per forza impossibile: bisogna calcolare $D_x$ e $D_y$. Nell'esempio 3 i due sistemi hanno lo stesso $D = 0$, e uno è impossibile, l'altro ha infinite soluzioni.
```

La discussione è fatta di due domande in fila, e si può seguire un passo alla volta su un diagramma di flusso. I sei numeri da leggere sono i coefficienti della forma normale, nell'ordine $a$, $b$, $c$ e poi $a'$, $b'$, $c'$, che nel diagramma si chiamano `a2`, `b2`, `c2`. All'inizio ci sono quelli del primo sistema dell'esempio 3: eseguilo, poi cambia il terzo numero da $3$ a $2$ per avere il secondo sistema.

```diagramma
% nome: discussione-sistema-determinanti
% alt: Diagramma di flusso della discussione di un sistema con i determinanti: si leggono i sei coefficienti, si calcolano D, Dx e Dy; se D è diverso da zero il sistema è determinato e si scrivono x e y; altrimenti, se Dx e Dy sono tutti e due zero è indeterminato, se no è impossibile
% ingresso: 2, -4, 3, 1, -2, 1
% codice: no
leggi a
leggi b
leggi c
leggi a2
leggi b2
leggi c2
D = a * b2 - b * a2
Dx = c * b2 - b * c2
Dy = a * c2 - c * a2
se D != 0
    scrivi "determinato: x =", Dx / D, "y =", Dy / D
altrimenti
    se Dx == 0 E Dy == 0
        scrivi "indeterminato"
    altrimenti
        scrivi "impossibile"
```

```ad-note
Il caso in cui la tabella sbaglia
Se tutti e quattro i coefficienti delle incognite sono zero, i tre determinanti valgono zero qualunque siano i termini noti, e il sistema diventa $0 = c$, $0 = c'$. È indeterminato solo se anche $c$ e $c'$ sono zero; se uno dei due non lo è, è impossibile. È l'unico caso in cui $D = D_x = D_y = 0$ non vuol dire indeterminato. Con i numeri non capita quasi mai, ma nei sistemi letterali può capitare per un valore del parametro, come nell'esempio 5.
```

## Sistemi letterali

Un sistema **letterale** contiene, oltre alle incognite, un parametro: una lettera che sta per un numero fissato ma non dato, come nelle [equazioni letterali](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-letterali). In questa lezione il parametro si chiama $k$, perché $a$, $b$ e $c$ sono già i nomi dei coefficienti. Discutere il sistema vuol dire dire, per ogni valore di $k$, se è determinato, impossibile o indeterminato, e trovare le soluzioni.

Con la regola di Cramer la discussione ha una forma fissa:

1. Porta il sistema in forma normale.
2. Calcola $D$ e scomponilo in fattori.
3. Trova i valori di $k$ che annullano $D$.
4. Per gli altri valori il sistema è determinato: calcola $D_x$ e $D_y$, dividi e [semplifica](/materiale/scuola-superiore/matematica/frazioni-algebriche/semplificazione-delle-frazioni-algebriche).
5. Per ogni valore che annulla $D$, sostituiscilo nel sistema e guarda se è impossibile o indeterminato.
6. Scrivi la risposta caso per caso.

```ad-example
Esempio 4: tre casi
Risolvi e discuti

$$
\begin{cases}
kx + y = 1 \\
x + ky = 1
\end{cases}
$$

Il determinante del sistema è una [differenza di quadrati](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli):

$$
\begin{aligned}
D &= \begin{vmatrix} k & 1 \\ 1 & k \end{vmatrix} \\
&= k^2 - 1 \\
&= (k - 1)(k + 1)
\end{aligned}
$$

$D$ si annulla per $k = 1$ e per $k = -1$. Poi:

$$
\begin{aligned}
D_x &= \begin{vmatrix} 1 & 1 \\ 1 & k \end{vmatrix} = k - 1 \\
D_y &= \begin{vmatrix} k & 1 \\ 1 & 1 \end{vmatrix} = k - 1
\end{aligned}
$$

Se $k \neq 1$ e $k \neq -1$, il sistema è determinato:

$$
\begin{aligned}
x &= \frac{k - 1}{(k - 1)(k + 1)} \\
&= \frac{1}{k + 1}
\end{aligned}
$$

e allo stesso modo $y = \dfrac{1}{k + 1}$.

Se $k = 1$, anche $D_x$ e $D_y$ valgono $0$. Il sistema diventa $x + y = 1$ scritto due volte: è indeterminato.

Se $k = -1$, $D_x = -2 \neq 0$: il sistema è impossibile. Infatti diventa $-x + y = 1$ e $x - y = 1$, e sommando membro a membro si trova $0 = 2$.

La risposta: se $k \neq \pm 1$, la soluzione è $\left(\dfrac{1}{k + 1}, \dfrac{1}{k + 1}\right)$; se $k = 1$, il sistema è indeterminato; se $k = -1$, è impossibile.
```

```ad-warning
Usare la formula semplificata per tutti i valori
Nell'esempio 4 la formula $x = \dfrac{1}{k + 1}$ ha senso anche per $k = 1$, dove dà $\dfrac{1}{2}$, ma per $k = 1$ il sistema ha infinite soluzioni, non una. La semplificazione per $k - 1$ si può fare solo quando $k - 1 \neq 0$: la formula vale per i valori che non annullano $D$, e i valori che lo annullano si studiano a parte, sostituendoli nel sistema.
```

```ad-example
Esempio 5: tutti i determinanti nulli, ma il sistema è impossibile
Risolvi e discuti

$$
\begin{cases}
kx + 2ky = 3 \\
kx - ky = 0
\end{cases}
$$

$$
\begin{aligned}
D &= \begin{vmatrix} k & 2k \\ k & -k \end{vmatrix} \\
&= -k^2 - 2k^2 = -3k^2
\end{aligned}
$$

$D$ si annulla solo per $k = 0$.

$$
\begin{aligned}
D_x &= \begin{vmatrix} 3 & 2k \\ 0 & -k \end{vmatrix} = -3k \\
D_y &= \begin{vmatrix} k & 3 \\ k & 0 \end{vmatrix} = -3k
\end{aligned}
$$

Se $k \neq 0$:

$$x = \frac{-3k}{-3k^2} = \frac{1}{k} \qquad y = \frac{1}{k}$$

Se $k = 0$, anche $D_x$ e $D_y$ valgono $0$, e la tabella direbbe "indeterminato". Ma sostituendo $k = 0$ nel sistema tutti i coefficienti delle incognite si annullano, e la prima equazione diventa $0 = 3$: il sistema è impossibile.

La risposta: se $k \neq 0$, la soluzione è $\left(\dfrac{1}{k}, \dfrac{1}{k}\right)$; se $k = 0$, il sistema è impossibile.
```

```ad-warning
Fermarsi ai determinanti
Quando $D = 0$, sostituisci il valore del parametro nel sistema e guarda le equazioni che ottieni. Nell'esempio 5 i tre determinanti nulli fanno pensare a un sistema indeterminato, e il sistema invece è impossibile.
```

## Sistemi di tre equazioni in tre incognite

Un sistema di tre equazioni in tre incognite $x$, $y$, $z$ si scrive, in forma normale,

$$
\begin{cases}
ax + by + cz = d \\
a'x + b'y + c'z = d' \\
a''x + b''y + c''z = d''
\end{cases}
$$

e una sua soluzione è una **terna** ordinata $(x, y, z)$ che rende vere tutte e tre le equazioni.

### Con il metodo di sostituzione

Il metodo di sostituzione funziona come con due incognite, con un passaggio in più:

1. Ricava un'incognita da un'equazione, scegliendo quella con coefficiente $1$ o $-1$ se c'è.
2. Sostituiscila nelle altre due: ottieni un sistema di due equazioni in due incognite.
3. Risolvi questo sistema con uno dei metodi che conosci.
4. Sostituisci i due valori trovati nell'espressione del passo 1 e trova la terza incognita.

```ad-example
Esempio 6: tre incognite, per sostituzione
Risolvi

$$
\begin{cases}
x + y + z = 6 \\
2x - y + z = 3 \\
x + 2y - z = 2
\end{cases}
$$

Dalla prima equazione ricava $z = 6 - x - y$ e sostituiscilo nelle altre due:

$$
\begin{gathered}
2x - y + 6 - x - y = 3 \\
x + 2y - 6 + x + y = 2
\end{gathered}
$$

Riduci i termini simili:

$$
\begin{cases}
x - 2y = -3 \\
2x + 3y = 8
\end{cases}
$$

Dalla prima ricava $x = 2y - 3$ e sostituiscilo nella seconda:

$$
\begin{gathered}
2(2y - 3) + 3y = 8 \\
\Rightarrow 7y - 6 = 8 \\
\Rightarrow y = 2
\end{gathered}
$$

Poi $x = 2 \cdot 2 - 3 = 1$ e $z = 6 - 1 - 2 = 3$.

Verifica: $2 - 2 + 3 = 3$ e $1 + 4 - 3 = 2$. La soluzione è la terna $(1, 2, 3)$.
```

```ad-warning
Sostituire in tutte le altre equazioni
L'espressione $z = 6 - x - y$ va sostituita in tutte e due le equazioni rimaste. Se la sostituisci in una sola, resti con un'equazione in due incognite e una in tre, e il sistema non si riduce.
```

### Il determinante di una matrice 3 × 3 e la regola di Sarrus

Anche una matrice con tre righe e tre colonne ha un determinante. Si calcola con la **regola di Sarrus**:

1. Ricopia a destra della matrice le prime due colonne.
2. Moltiplica i tre elementi di ciascuna delle tre diagonali che scendono verso destra e somma i tre prodotti.
3. Moltiplica i tre elementi di ciascuna delle tre diagonali che scendono verso sinistra e somma i tre prodotti.
4. Il determinante è la prima somma meno la seconda.

```tikz
% nome: regola-di-sarrus
% alt: Regola di Sarrus per il determinante di una matrice 3 per 3 con elementi da a a i: a destra sono ricopiate le prime due colonne, tre diagonali continue scendono verso destra con il segno più e tre diagonali tratteggiate scendono verso sinistra con il segno meno
% svg: regola-di-sarrus-3a055ce6.svg 160x131
\begin{tikzpicture}[x=0.9cm,y=0.8cm,every node/.style={inner sep=1.5pt}]
\node (a1) at (0,0) {$a$};
\node (b1) at (1,0) {$b$};
\node (c1) at (2,0) {$c$};
\node[gray] (d1) at (3,0) {$a$};
\node[gray] (e1) at (4,0) {$b$};
\node (a2) at (0,-1) {$d$};
\node (b2) at (1,-1) {$e$};
\node (c2) at (2,-1) {$f$};
\node[gray] (d2) at (3,-1) {$d$};
\node[gray] (e2) at (4,-1) {$e$};
\node (a3) at (0,-2) {$g$};
\node (b3) at (1,-2) {$h$};
\node (c3) at (2,-2) {$i$};
\node[gray] (d3) at (3,-2) {$g$};
\node[gray] (e3) at (4,-2) {$h$};
\draw (-0.4,0.4) -- (-0.4,-2.4);
\draw (2.4,0.4) -- (2.4,-2.4);
\draw[blue!60, thick] (a1) -- (b2) -- (c3);
\draw[blue!60, thick] (b1) -- (c2) -- (d3);
\draw[blue!60, thick] (c1) -- (d2) -- (e3);
\draw[red!55, thick, dashed] (c1) -- (b2) -- (a3);
\draw[red!55, thick, dashed] (d1) -- (c2) -- (b3);
\draw[red!55, thick, dashed] (e1) -- (d2) -- (c3);
\node[blue!70] at (2,-2.9) {$+$};
\node[blue!70] at (3,-2.9) {$+$};
\node[blue!70] at (4,-2.9) {$+$};
\node[red!65] at (2,0.9) {$-$};
\node[red!65] at (3,0.9) {$-$};
\node[red!65] at (4,0.9) {$-$};
\end{tikzpicture}
```

In formula:

$$
\begin{aligned}
&\begin{vmatrix} a & b & c \\ d & e & f \\ g & h & i \end{vmatrix} \\
&= aei + bfg + cdh \\
&\quad - ceg - afh - bdi
\end{aligned}
$$

```ad-warning
Sarrus vale solo per le matrici 3 × 3
La regola di Sarrus non si estende alle matrici più grandi: per una matrice $4 \times 4$ ricopiare le colonne e moltiplicare lungo le diagonali dà un numero sbagliato. Per le matrici $2 \times 2$ non serve, perché le diagonali sono una per verso.
```

### La regola di Cramer con tre incognite

Per un sistema di tre equazioni in tre incognite $D$ è il determinante dei coefficienti delle incognite, e $D_x$, $D_y$, $D_z$ si ottengono mettendo la colonna dei termini noti al posto della colonna di $x$, di $y$ o di $z$. Se $D \neq 0$ il sistema è determinato e

$$
\begin{gathered}
x = \frac{D_x}{D} \qquad y = \frac{D_y}{D} \\[4pt]
z = \frac{D_z}{D}
\end{gathered}
$$

Se $D = 0$ la regola di Cramer non dice niente, e la tabella dei casi per due incognite non si estende: il sistema $x + y + z = 1$, $x + y + z = 2$, $x + y + z = 3$ ha $D = D_x = D_y = D_z = 0$ ed è impossibile. Con $D = 0$ il sistema si risolve per sostituzione o per riduzione, e sono le equazioni a dire se è impossibile o indeterminato.

```ad-example
Esempio 7: tre incognite, con Cramer
Risolvi con la regola di Cramer

$$
\begin{cases}
x + 2y - z = -1 \\
2x - y + z = 6 \\
x + y + 2z = 3
\end{cases}
$$

Calcola $D$ con la regola di Sarrus. I prodotti delle diagonali che scendono verso destra sono $1 \cdot (-1) \cdot 2 = -2$, $2 \cdot 1 \cdot 1 = 2$ e $(-1) \cdot 2 \cdot 1 = -2$, con somma $-2$. Quelli delle diagonali che scendono verso sinistra sono $(-1) \cdot (-1) \cdot 1 = 1$, $1 \cdot 1 \cdot 1 = 1$ e $2 \cdot 2 \cdot 2 = 8$, con somma $10$.

$$
\begin{aligned}
D &= \begin{vmatrix} 1 & 2 & -1 \\ 2 & -1 & 1 \\ 1 & 1 & 2 \end{vmatrix} \\
&= -2 - 10 = -12
\end{aligned}
$$

$D \neq 0$: il sistema è determinato. Allo stesso modo, con la colonna dei termini noti $-1$, $6$, $3$ al posto di una colonna alla volta:

$$
\begin{aligned}
D_x &= \begin{vmatrix} -1 & 2 & -1 \\ 6 & -1 & 1 \\ 3 & 1 & 2 \end{vmatrix} \\
&= 2 - 26 = -24 \\
D_y &= \begin{vmatrix} 1 & -1 & -1 \\ 2 & 6 & 1 \\ 1 & 3 & 2 \end{vmatrix} \\
&= 5 - (-7) = 12 \\
D_z &= \begin{vmatrix} 1 & 2 & -1 \\ 2 & -1 & 6 \\ 1 & 1 & 3 \end{vmatrix} \\
&= 7 - 19 = -12
\end{aligned}
$$

$$
\begin{gathered}
x = \frac{-24}{-12} = 2 \\[4pt]
y = \frac{12}{-12} = -1 \\[4pt]
z = \frac{-12}{-12} = 1
\end{gathered}
$$

Verifica: $2 - 2 - 1 = -1$, $4 + 1 + 1 = 6$ e $2 - 1 + 2 = 3$. La soluzione è la terna $(2, -1, 1)$.
```

```ad-tip
Sostituzione o Cramer
Se un'equazione ha un'incognita con coefficiente $1$ o $-1$, la sostituzione di solito è più corta. Cramer conviene con coefficienti tutti diversi da $\pm 1$, con i parametri, e quando serve una sola incognita: per trovare $z$ bastano $D$ e $D_z$.
```
