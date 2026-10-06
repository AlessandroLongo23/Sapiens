# Principio di induzione

Somma i primi numeri dispari: $1 = 1$, poi $1 + 3 = 4$, poi $1 + 3 + 5 = 9$, poi $1 + 3 + 5 + 7 = 16$. I risultati sono $1, 4, 9, 16$, i quadrati dei numeri naturali, e viene da pensare che la somma dei primi $n$ numeri dispari sia sempre $n^2$. Ma i numeri naturali sono infiniti, e nessuno può controllarli uno per uno. Il principio di induzione è il metodo per dimostrare in un numero finito di passaggi che una proprietà vale per tutti i numeri naturali, da un certo punto in poi.

Per seguire la lezione ti servono le [successioni numeriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/successioni-numeriche), l'[implicazione](/materiale/scuola-superiore/matematica/insiemi-e-logica/implicazione-condizioni-necessarie-e-sufficienti) con le parole ipotesi e tesi, e gli enunciati aperti della lezione sui [quantificatori](/materiale/scuola-superiore/matematica/insiemi-e-logica/quantificatori).

## Perché non bastano le verifiche

Controllare una proprietà per i primi valori di $n$ fa nascere un'ipotesi ragionevole, ma non la dimostra. Un esempio celebre è l'espressione $n^2 + n + 41$, studiata da Eulero: per $n = 1$ vale $43$, per $n = 2$ vale $47$, per $n = 3$ vale $53$, tutti numeri primi, e continua a dare numeri primi per ogni $n$ fino a $39$. Con $n = 40$ però

$$40^2 + 40 + 41 = 40(40 + 1) + 41 = 41 \cdot 41 = 1681$$

che non è primo. Trentanove verifiche riuscite non hanno impedito alla quarantesima di fallire.

```ad-warning
Tanti casi veri non fanno una dimostrazione
Una proprietà verificata per $n = 1, 2, 3, \dots, 100$ può essere falsa per $n = 101$. Per affermare che vale per ogni $n$ serve un ragionamento che copra tutti i casi insieme. Per affermare che è falsa, invece, è sufficiente un solo caso in cui non vale, cioè un controesempio.
```

## Il principio

Indica con $P(n)$ un enunciato aperto in cui la variabile $n$ è un numero naturale: una frase che diventa vera o falsa quando al posto di $n$ metti un numero, come "la somma dei primi $n$ numeri dispari è $n^2$".

Il **principio di induzione** dice che, se valgono queste due condizioni:

1. $P(1)$ è vera;
2. per ogni $k \geq 1$, se $P(k)$ è vera allora anche $P(k + 1)$ è vera;

allora $P(n)$ è vera per ogni numero naturale $n \geq 1$.

La prima condizione si chiama **base dell'induzione**. La seconda si chiama **passo induttivo**, ed è un'implicazione, $P(k) \Rightarrow P(k + 1)$: la sua ipotesi, $P(k)$, si chiama **ipotesi induttiva**.

Il principio funziona come una fila di tessere del domino messe in piedi. Se la prima tessera cade, e se ogni tessera cadendo fa cadere la successiva, allora cadono tutte. La base fa cadere la prima tessera: $P(1)$ è vera. Il passo induttivo, usato con $k = 1$, dice che allora è vera $P(2)$; usato con $k = 2$, che è vera $P(3)$; e così via. Qualunque numero $n$ tu scelga, la catena lo raggiunge dopo $n - 1$ passi.

```tikz
% nome: induzione-tessere-domino
% alt: Una fila di tessere del domino numerate 1, 2, 3, poi dei puntini, poi k e k + 1. Una freccia spinge la tessera 1, che cade sulla 2, che cade sulla 3; più avanti la tessera k è inclinata verso la tessera k + 1, ancora in piedi
\begin{tikzpicture}[scale=0.9]
\draw[gray] (-1.2,0) -- (7.4,0);
\draw[fill=blue!35, rotate around={-52:(0.2,0)}] (0,0) rectangle (0.2,1.2);
\draw[fill=blue!35, rotate around={-36:(1.2,0)}] (1,0) rectangle (1.2,1.2);
\draw[fill=blue!35, rotate around={-18:(2.2,0)}] (2,0) rectangle (2.2,1.2);
\draw[->, thick, orange!80!black] (-0.6,1.15) -- (0.42,0.62);
\node at (3.5,0.55) {$\dots$};
\draw[fill=blue!35, rotate around={-18:(5,0)}] (4.8,0) rectangle (5,1.2);
\draw[fill=blue!35] (5.8,0) rectangle (6,1.2);
\node[below] at (0.1,0) {\small $1$};
\node[below] at (1.1,0) {\small $2$};
\node[below] at (2.1,0) {\small $3$};
\node[below] at (4.9,0) {\small $k$};
\node[below] at (5.95,0) {\small $k + 1$};
\end{tikzpicture}
```

Servono tutte e due le condizioni. Senza la base nessuna tessera comincia a cadere; senza il passo induttivo la caduta si ferma alla prima tessera che non spinge la successiva.

```ad-note
Un principio, non un teorema
Il principio di induzione non si dimostra a partire da proprietà più semplici dei numeri naturali: è uno degli assiomi con cui Giuseppe Peano, alla fine dell'Ottocento, ha descritto l'insieme $\mathbb{N}$. Esprime l'idea che ogni numero naturale si raggiunge partendo dal primo e passando un numero finito di volte al successivo.
```

## Come si scrive una dimostrazione per induzione

1. Scrivi con precisione l'enunciato $P(n)$ da dimostrare e il primo valore di $n$ per cui deve valere.
2. Base: sostituisci quel primo valore e controlla, con un conto, che l'enunciato è vero.
3. Ipotesi induttiva: scrivi $P(k)$, cioè l'enunciato con $k$ al posto di $n$, e supponilo vero.
4. Tesi: scrivi $P(k + 1)$, cioè l'enunciato con $k + 1$ al posto di $n$. È quello che devi ottenere.
5. Passo induttivo: parti da un membro di $P(k + 1)$, fai comparire l'espressione che conosci dall'ipotesi induttiva, sostituiscila e trasforma fino ad arrivare all'altro membro.
6. Concludi: poiché valgono la base e il passo induttivo, per il principio di induzione $P(n)$ è vera per ogni $n$ a partire dal primo valore.

```ad-example
Esempio 1: la somma dei primi n numeri naturali
Dimostra che per ogni $n \geq 1$

$$1 + 2 + 3 + \dots + n = \frac{n(n + 1)}{2}$$

Base. Per $n = 1$ il primo membro ha il solo termine $1$, e il secondo membro vale $\dfrac{1 \cdot 2}{2} = 1$: l'uguaglianza è vera.

Ipotesi induttiva. Supponi che per un certo $k \geq 1$ sia

$$1 + 2 + \dots + k = \frac{k(k + 1)}{2}$$

Tesi. Devi dimostrare l'uguaglianza con $k + 1$ al posto di $n$:

$$1 + 2 + \dots + k + (k + 1) = \frac{(k + 1)(k + 2)}{2}$$

Passo induttivo. Nel primo membro della tesi i primi $k$ termini sono la somma dell'ipotesi induttiva. Sostituiscila e raccogli $k + 1$:

$$
\begin{aligned}
1 + 2 + \dots + k + (k + 1) &= \frac{k(k + 1)}{2} + (k + 1) \\
&= \frac{k(k + 1) + 2(k + 1)}{2} \\
&= \frac{(k + 1)(k + 2)}{2}
\end{aligned}
$$

È il secondo membro della tesi. Base e passo induttivo valgono, quindi per il principio di induzione la formula è vera per ogni $n \geq 1$.
```

La stessa formula si trova nelle [progressioni aritmetiche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-aritmetiche), dimostrata con le coppie di termini equidistanti dagli estremi. L'induzione ha un limite che quell'altra dimostrazione non ha: serve a dimostrare una formula che conosci già, non a scoprirla.

```ad-warning
Come si scrive P(k + 1) per una somma
Passando da $k$ a $k + 1$ il primo membro guadagna un termine, quello di posto $k + 1$, mentre nel secondo membro $k + 1$ prende il posto di $n$ dappertutto. Nell'esempio 1 il termine nuovo è $k + 1$, non $1$: scrivere $\dfrac{k(k + 1)}{2} + 1$ è un errore frequente.
```

```ad-warning
L'ipotesi induttiva non è la tesi
Supporre vera $P(k)$ non vuol dire supporre quello che devi dimostrare. Quello che devi dimostrare è che $P(n)$ vale per ogni $n$; nel passo induttivo dimostri soltanto un'implicazione: se vale per un numero, vale per il successivo. Un'implicazione può essere vera anche quando la sua ipotesi è falsa, e per questo il passo induttivo da solo non dice nulla: serve anche la base.
```

## Esempi svolti

### Somme

```ad-example
Esempio 2: la somma dei primi n numeri dispari
Dimostra che per ogni $n \geq 1$

$$1 + 3 + 5 + \dots + (2n - 1) = n^2$$

Il numero dispari di posto $n$ è $2n - 1$; quello di posto $k + 1$ è $2(k + 1) - 1 = 2k + 1$.

Base. Per $n = 1$ il primo membro è $1$ e il secondo è $1^2 = 1$: vero.

Ipotesi induttiva. Per un certo $k \geq 1$ sia $1 + 3 + \dots + (2k - 1) = k^2$.

Tesi. $1 + 3 + \dots + (2k - 1) + (2k + 1) = (k + 1)^2$.

Passo induttivo. Sostituisci l'ipotesi induttiva nei primi $k$ termini:

$$
\begin{aligned}
1 + 3 + \dots + (2k - 1) + (2k + 1) &= k^2 + 2k + 1 \\
&= (k + 1)^2
\end{aligned}
$$

Per il principio di induzione la formula vale per ogni $n \geq 1$. Nella figura il passo induttivo si vede: per passare da un quadrato di lato $k$ a uno di lato $k + 1$ si aggiunge una cornice a forma di L, che ha $2k + 1$ quadretti.

```tikz
% nome: somma-dispari-quadrato-cornici
% alt: Un quadrato di lato 4 formato da 16 quadretti e diviso in quattro cornici a forma di L di colori alternati: la prima è un solo quadretto in basso a sinistra, la seconda ne ha 3, la terza 5, la quarta 7. I numeri 1, 3, 5 e 7 sono scritti sulla diagonale, nell'angolo di ogni cornice
\begin{tikzpicture}[scale=0.62]
\fill[blue!35] (0,0) rectangle (1,1);
\fill[orange!45] (1,0) rectangle (2,2);
\fill[orange!45] (0,1) rectangle (1,2);
\fill[blue!35] (2,0) rectangle (3,3);
\fill[blue!35] (0,2) rectangle (2,3);
\fill[orange!45] (3,0) rectangle (4,4);
\fill[orange!45] (0,3) rectangle (3,4);
\draw[gray!70, thin] (0,0) grid (4,4);
\draw[thick] (0,0) rectangle (4,4);
\draw[thick] (1,0) -- (1,1) -- (0,1);
\draw[thick] (2,0) -- (2,2) -- (0,2);
\draw[thick] (3,0) -- (3,3) -- (0,3);
\node at (0.5,0.5) {$1$};
\node at (1.5,1.5) {$3$};
\node at (2.5,2.5) {$5$};
\node at (3.5,3.5) {$7$};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: la somma dei primi n quadrati
Dimostra che per ogni $n \geq 1$

$$1^2 + 2^2 + 3^2 + \dots + n^2 = \frac{n(n + 1)(2n + 1)}{6}$$

Base. Per $n = 1$ il primo membro è $1$ e il secondo è $\dfrac{1 \cdot 2 \cdot 3}{6} = 1$: vero.

Ipotesi induttiva. Per un certo $k \geq 1$ sia $1^2 + 2^2 + \dots + k^2 = \dfrac{k(k + 1)(2k + 1)}{6}$.

Tesi. Con $k + 1$ al posto di $n$ il fattore $2n + 1$ diventa $2(k + 1) + 1 = 2k + 3$:

$$1^2 + 2^2 + \dots + k^2 + (k + 1)^2 = \frac{(k + 1)(k + 2)(2k + 3)}{6}$$

Passo induttivo. Sostituisci l'ipotesi induttiva e raccogli $k + 1$, senza svolgere i prodotti:

$$
\begin{aligned}
1^2 + \dots + k^2 + (k + 1)^2 &= \frac{k(k + 1)(2k + 1)}{6} + (k + 1)^2 \\
&= \frac{(k + 1)\,[k(2k + 1) + 6(k + 1)]}{6} \\
&= \frac{(k + 1)(2k^2 + 7k + 6)}{6}
\end{aligned}
$$

Il [trinomio](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado) $2k^2 + 7k + 6$ si scompone in $(k + 2)(2k + 3)$, e si ottiene il secondo membro della tesi. Per il principio di induzione la formula vale per ogni $n \geq 1$.
```

```ad-tip
Guarda la tesi prima di fare i conti
Nel passo induttivo sai già dove devi arrivare. Nell'esempio 3 la tesi contiene i fattori $k + 1$, $k + 2$ e $2k + 3$: conviene raccogliere subito $k + 1$ e cercare gli altri due nella scomposizione, invece di sviluppare un polinomio di terzo grado. Se poi alla fine non hai mai usato l'ipotesi induttiva, c'è quasi sempre un errore.
```

### Divisibilità

Un numero intero è divisibile per $3$ se si può scrivere come $3$ per un numero intero. Nelle dimostrazioni di divisibilità il passo induttivo consiste nello scrivere l'espressione con $k + 1$ come somma di due addendi: quello dell'ipotesi induttiva e un multiplo evidente del divisore.

```ad-example
Esempio 4: una proprietà di divisibilità
Dimostra che per ogni $n \geq 1$ il numero $n^3 + 2n$ è divisibile per $3$.

Base. Per $n = 1$ ottieni $1 + 2 = 3$, che è divisibile per $3$.

Ipotesi induttiva. Per un certo $k \geq 1$ il numero $k^3 + 2k$ è divisibile per $3$.

Tesi. Il numero $(k + 1)^3 + 2(k + 1)$ è divisibile per $3$.

Passo induttivo. Sviluppa il cubo e separa i termini dell'ipotesi induttiva dagli altri:

$$
\begin{aligned}
(k + 1)^3 + 2(k + 1) &= k^3 + 3k^2 + 3k + 1 + 2k + 2 \\
&= (k^3 + 2k) + 3k^2 + 3k + 3 \\
&= (k^3 + 2k) + 3(k^2 + k + 1)
\end{aligned}
$$

Il primo addendo è divisibile per $3$ per l'ipotesi induttiva, il secondo perché contiene il fattore $3$. La somma di due numeri divisibili per $3$ è divisibile per $3$, quindi la tesi è vera. Per il principio di induzione $n^3 + 2n$ è divisibile per $3$ per ogni $n \geq 1$.
```

### Formule per le successioni ricorsive

L'induzione è lo strumento naturale per le successioni definite per ricorsione, perché la legge di ricorrenza lega proprio $a_k$ ad $a_{k+1}$. Così si dimostrano in modo rigoroso i termini generali $a_n = a_1 + (n - 1)d$ e $a_n = a_1 \cdot q^{n-1}$ delle progressioni.

```ad-example
Esempio 5: il termine generale di una successione ricorsiva
La successione definita da $a_1 = 3$ e $a_{n+1} = 2a_n - 1$ comincia con $3, 5, 9, 17, 33$. Dimostra che il suo termine generale è $a_n = 2^n + 1$.

Base. Per $n = 1$ la formula dà $2^1 + 1 = 3$, che è proprio $a_1$.

Ipotesi induttiva. Per un certo $k \geq 1$ sia $a_k = 2^k + 1$.

Tesi. $a_{k+1} = 2^{k+1} + 1$.

Passo induttivo. La legge di ricorrenza dà $a_{k+1}$ a partire da $a_k$, che conosci dall'ipotesi induttiva:

$$
\begin{aligned}
a_{k+1} &= 2a_k - 1 \\
&= 2(2^k + 1) - 1 \\
&= 2^{k+1} + 2 - 1 = 2^{k+1} + 1
\end{aligned}
$$

Per il principio di induzione $a_n = 2^n + 1$ per ogni $n \geq 1$.
```

### Disuguaglianze

Alcune proprietà sono false per i primi numeri naturali e vere da un certo numero $n_0$ in poi. Il principio vale anche in questa forma: se $P(n_0)$ è vera, e se per ogni $k \geq n_0$ da $P(k)$ segue $P(k + 1)$, allora $P(n)$ è vera per ogni $n \geq n_0$. È la stessa fila di tessere, in cui la prima a cadere è quella di posto $n_0$. Nello stesso modo, per le successioni che partono da $a_0$ la base è $n = 0$.

```ad-example
Esempio 6: una disuguaglianza vera da 3 in poi
Dimostra che $2^n > 2n + 1$ per ogni $n \geq 3$.

La disuguaglianza è falsa per $n = 1$, perché $2 > 3$ è falso, e per $n = 2$, perché $4 > 5$ è falso: la base è $n = 3$.

Base. Per $n = 3$ ottieni $2^3 = 8$ e $2 \cdot 3 + 1 = 7$, e $8 > 7$ è vero.

Ipotesi induttiva. Per un certo $k \geq 3$ sia $2^k > 2k + 1$.

Tesi. $2^{k+1} > 2(k + 1) + 1$, cioè $2^{k+1} > 2k + 3$.

Passo induttivo. Scrivi $2^{k+1}$ come $2 \cdot 2^k$ e usa l'ipotesi induttiva, moltiplicando i due membri per $2$:

$$2^{k+1} = 2 \cdot 2^k > 2(2k + 1) = 4k + 2$$

Resta da confrontare $4k + 2$ con $2k + 3$. La differenza è $(4k + 2) - (2k + 3) = 2k - 1$, che è positiva per ogni $k \geq 1$, quindi $4k + 2 > 2k + 3$. Mettendo in fila le due disuguaglianze:

$$2^{k+1} > 4k + 2 > 2k + 3$$

Per il principio di induzione $2^n > 2n + 1$ per ogni $n \geq 3$.
```

Nelle disuguaglianze il passo induttivo raramente porta alla tesi con un solo passaggio: di solito l'ipotesi induttiva dà una prima disuguaglianza, e ne serve una seconda, da dimostrare a parte, per arrivare alla tesi.

```ad-example
Esempio 7: la disuguaglianza di Bernoulli
Dimostra che, se $x$ è un numero reale con $x > -1$, allora per ogni $n \geq 1$

$$(1 + x)^n \geq 1 + nx$$

Base. Per $n = 1$ i due membri sono uguali a $1 + x$, e la disuguaglianza, che ammette l'uguaglianza, è vera.

Ipotesi induttiva. Per un certo $k \geq 1$ sia $(1 + x)^k \geq 1 + kx$.

Tesi. $(1 + x)^{k+1} \geq 1 + (k + 1)x$.

Passo induttivo. Moltiplica i due membri dell'ipotesi induttiva per $1 + x$. Poiché $x > -1$, il fattore $1 + x$ è positivo e il verso della disuguaglianza non cambia:

$$
\begin{aligned}
(1 + x)^{k+1} &\geq (1 + kx)(1 + x) \\
&= 1 + x + kx + kx^2 \\
&= 1 + (k + 1)x + kx^2
\end{aligned}
$$

Il termine $kx^2$ non è mai negativo, e togliendolo il secondo membro non aumenta: $1 + (k + 1)x + kx^2 \geq 1 + (k + 1)x$. Quindi $(1 + x)^{k+1} \geq 1 + (k + 1)x$, che è la tesi. Per il principio di induzione la disuguaglianza vale per ogni $n \geq 1$.
```

## Quando l'induzione sembra funzionare e non funziona

```ad-warning
Il passo induttivo senza la base
Considera l'enunciato "per ogni $n \geq 1$ il numero $n^2 + n$ è dispari". Il passo induttivo riesce: supponendo $k^2 + k$ dispari,

$$(k + 1)^2 + (k + 1) = (k^2 + k) + 2(k + 1)$$

è la somma di un numero dispari e di un numero pari, quindi è dispari. Eppure l'enunciato è falso: per $n = 1$ si ha $1 + 1 = 2$, che è pari, e in realtà $n^2 + n = n(n + 1)$ è pari per ogni $n$, perché tra due numeri consecutivi uno è pari. Senza la base, il passo induttivo ha dimostrato soltanto che se una tessera cadesse cadrebbe anche la successiva.
```

Gli altri errori frequenti riguardano la forma della dimostrazione:

- partire dalla tesi $P(k + 1)$ come se fosse vera e trasformarla fino a un'identità: così si usa quello che si deve dimostrare. Parti da un membro e arriva all'altro;
- verificare la base per $n = 1$ quando l'enunciato comincia da un altro valore, o dimenticare di dire da quale valore di $k$ vale il passo induttivo;
- dimostrare il passo induttivo per un valore particolare, per esempio da $k = 1$ a $k = 2$: il passo deve valere per un $k$ generico, indicato con la lettera.
