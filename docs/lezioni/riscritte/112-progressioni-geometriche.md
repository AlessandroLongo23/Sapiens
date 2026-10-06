# Progressioni geometriche

Piega un foglio a metà: gli strati di carta sono $2$. Piegalo ancora e diventano $4$, poi $8$, poi $16$: a ogni piega raddoppiano, e dopo dieci pieghe sarebbero $1024$. Una successione in cui ogni termine si ottiene dal precedente moltiplicandolo sempre per lo stesso numero si chiama progressione geometrica. Crescono così una popolazione di batteri, un capitale che matura interessi, un messaggio che ognuno inoltra a tre amici.

Per seguire la lezione ti servono le [successioni numeriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/successioni-numeriche) e le [progressioni aritmetiche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-aritmetiche), di cui questa lezione ripete la struttura con la moltiplicazione al posto dell'addizione, e le proprietà delle [potenze](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q).

## Che cos'è una progressione geometrica

Una **progressione geometrica** è una successione di termini diversi da zero in cui il rapporto tra ogni termine e il precedente è sempre lo stesso. Questo rapporto costante si chiama **ragione** e si indica con $q$:

$$\frac{a_{n+1}}{a_n} = q \quad \text{per ogni } n$$

Scritta come legge di ricorrenza, la definizione dice che ogni termine si ottiene dal precedente moltiplicandolo per la ragione: $a_{n+1} = a_n \cdot q$. Una progressione geometrica è individuata dal primo termine $a_1$ e dalla ragione $q$, tutti e due diversi da zero. Gli strati del foglio formano una progressione geometrica con $a_1 = 2$ e $q = 2$.

Per riconoscere una progressione geometrica calcola i rapporti tra termini consecutivi: devono essere tutti uguali.

```ad-example
Esempio 1: riconoscere una progressione geometrica
Stabilisci quali di questi elenchi sono i primi termini di una progressione geometrica, e con quale ragione.

Primo elenco: $80, 40, 20, 10$. I rapporti sono $\dfrac{40}{80} = \dfrac{1}{2}$, $\dfrac{20}{40} = \dfrac{1}{2}$, $\dfrac{10}{20} = \dfrac{1}{2}$. Sono uguali: è una progressione geometrica di ragione $q = \dfrac{1}{2}$.

Secondo elenco: $2, -6, 18, -54$. I rapporti sono $\dfrac{-6}{2} = -3$, $\dfrac{18}{-6} = -3$, $\dfrac{-54}{18} = -3$: è una progressione geometrica di ragione $q = -3$.

Terzo elenco: $2, 4, 6, 8$. I rapporti sono $2$, $\dfrac{3}{2}$, $\dfrac{4}{3}$. Non sono uguali: non è una progressione geometrica. Sono uguali le differenze, quindi è una progressione aritmetica di ragione $2$.
```

```ad-warning
La ragione è il termine dopo diviso il termine prima
In $80, 40, 20, 10$ la ragione è $\dfrac{40}{80} = \dfrac{1}{2}$, non $\dfrac{80}{40} = 2$. Una progressione che si dimezza a ogni passo ha ragione $\dfrac{1}{2}$: moltiplicare per $\dfrac{1}{2}$ e dividere per $2$ sono la stessa operazione.
```

## Crescente, decrescente o a segni alterni

Il comportamento di una progressione geometrica dipende dalla ragione e dal segno del primo termine. Se $q$ è positiva, tutti i termini hanno il segno di $a_1$, e la differenza tra un termine e il precedente è

$$a_{n+1} - a_n = a_n \cdot q - a_n = a_n(q - 1)$$

Il suo segno si legge dai due fattori, e non cambia con $n$:

| Ragione | Con $a_1 > 0$ | Con $a_1 < 0$ |
|---|---|---|
| $q > 1$ | crescente: $1, 2, 4, 8, \dots$ | decrescente: $-1, -2, -4, -8, \dots$ |
| $q = 1$ | costante: $5, 5, 5, \dots$ | costante: $-5, -5, -5, \dots$ |
| $0 < q < 1$ | decrescente: $16, 8, 4, 2, \dots$ | crescente: $-16, -8, -4, -2, \dots$ |

Se $q$ è negativa, ogni termine ha il segno opposto a quello del precedente: la progressione è a segni alterni, e non è monotona. Un esempio è $16, -8, 4, -2, 1, \dots$, che ha $q = -\dfrac{1}{2}$.

```tikz
% nome: progressioni-geometriche-tre-ragioni
% alt: Tre grafici con i primi cinque termini di una progressione geometrica. A sinistra, con ragione 2, i punti 1, 2, 4, 8, 16 salgono sempre più in fretta. Al centro, con ragione un mezzo, i punti 16, 8, 4, 2, 1 scendono verso l'asse orizzontale. A destra, con ragione meno un mezzo, i punti 16, -8, 4, -2, 1 stanno alternativamente sopra e sotto l'asse
\begin{tikzpicture}
\begin{scope}[shift={(0,0)}, xscale=0.34, yscale=0.13]
\draw[->] (-0.5,0) -- (6.2,0) node[right] {\small $n$};
\draw[->] (0,-9) -- (0,19);
\node[left] at (0,16) {\small $16$};
\draw (-0.15,16) -- (0.15,16);
\foreach \x/\y in {1/1, 2/2, 3/4, 4/8, 5/16} \fill[blue!60] (\x,\y) ellipse (0.22 and 0.58);
\end{scope}
\node at (1.0,-1.6) {$q = 2$};
\begin{scope}[shift={(3.1,0)}, xscale=0.34, yscale=0.13]
\draw[->] (-0.5,0) -- (6.2,0) node[right] {\small $n$};
\draw[->] (0,-9) -- (0,19);
\node[left] at (0,16) {\small $16$};
\draw (-0.15,16) -- (0.15,16);
\foreach \x/\y in {1/16, 2/8, 3/4, 4/2, 5/1} \fill[blue!60] (\x,\y) ellipse (0.22 and 0.58);
\end{scope}
\node at (4.1,-1.6) {$q = \frac{1}{2}$};
\begin{scope}[shift={(6.2,0)}, xscale=0.34, yscale=0.13]
\draw[->] (-0.5,0) -- (6.2,0) node[right] {\small $n$};
\draw[->] (0,-9) -- (0,19);
\node[left] at (0,16) {\small $16$};
\draw (-0.15,16) -- (0.15,16);
\foreach \x/\y in {1/16, 2/-8, 3/4, 4/-2, 5/1} \fill[orange!80] (\x,\y) ellipse (0.22 and 0.58);
\end{scope}
\node at (7.2,-1.6) {$q = -\frac{1}{2}$};
\end{tikzpicture}
```
```grafico
% nome: progressione-geometrica-cursore-ragione
% alt: I primi sei termini della progressione geometrica con primo termine 1 come punti del piano, con il cursore della ragione q: con q maggiore di 1 i punti salgono sempre più in fretta, con q tra 0 e 1 scendono verso l'asse orizzontale, con q negativa saltano sopra e sotto l'asse
curva: \left(1;1\right) | blu
curva: \left(2;q\right) | blu
curva: \left(3;q^2\right) | blu
curva: \left(4;q^3\right) | blu
curva: \left(5;q^4\right) | blu
curva: \left(6;q^5\right) | blu
cursore: q = 1,5 da -1,5 a 1,6 passo 0,1
finestra: x da -1 a 7, y da -8 a 11
forma: 3:2
assi: n, aₙ
valore: a_6 = q^5
domanda: Porta $q$ a $1$: che progressione resta? E che cosa fanno i punti con $q$ tra $0$ e $1$, e con $q$ negativa? Il valore $q = 0$ non dà una progressione geometrica.
```

Con $q = 1$ tutti i termini valgono $1$: la progressione è costante. Con $q$ tra $0$ e $1$ i punti scendono verso l'asse orizzontale senza toccarlo. Con $q$ negativa saltano da una parte all'altra dell'asse, e con $q = -1$ valgono alternativamente $1$ e $-1$. Il valore $q = 0$ è escluso dalla definizione: darebbe $1, 0, 0, 0, \dots$, in cui il rapporto tra un termine e il precedente non si può calcolare.

## Il termine generale

Partendo da $a_1$ e moltiplicando ogni volta per la ragione ottieni

$$
\begin{gathered}
a_2 = a_1 \cdot q \\
a_3 = a_2 \cdot q = a_1 \cdot q^2 \\
a_4 = a_3 \cdot q = a_1 \cdot q^3
\end{gathered}
$$

Per arrivare al termine di posto $n$ partendo dal primo si fanno $n - 1$ passi, e a ogni passo si moltiplica per $q$. Il termine generale di una progressione geometrica è quindi

$$a_n = a_1 \cdot q^{n-1}$$

È la formula $a_n = a_1 + (n - 1)d$ delle progressioni aritmetiche in cui l'addizione è diventata una moltiplicazione e la moltiplicazione una potenza. Anche questa si dimostra in modo rigoroso con il [principio di induzione](/materiale/scuola-superiore/matematica/successioni-e-progressioni/principio-di-induzione).

```ad-example
Esempio 2: calcolare un termine
Calcola l'ottavo termine della progressione geometrica $3, 6, 12, \dots$ e il sesto termine di quella con $a_1 = 16$ e $q = -\dfrac{1}{2}$.

Nella prima $a_1 = 3$ e $q = \dfrac{6}{3} = 2$:

$$a_8 = 3 \cdot 2^7 = 3 \cdot 128 = 384$$

Nella seconda la ragione è negativa, e va messa tra parentesi. L'esponente $5$ è dispari, quindi la potenza è negativa:

$$a_6 = 16 \cdot \left(-\frac{1}{2}\right)^5 = 16 \cdot \left(-\frac{1}{32}\right) = -\frac{1}{2}$$
```

```ad-warning
Prima la potenza, poi il prodotto
In $a_8 = 3 \cdot 2^7$ l'esponente riguarda solo la ragione: si calcola $2^7 = 128$ e poi si moltiplica per $3$. Chi calcola $(3 \cdot 2)^7 = 6^7$ ottiene $279\,936$ invece di $384$. E l'esponente è $n - 1$, non $n$: per l'ottavo termine i passi sono sette.
```

Quando la ragione è positiva e diversa da $1$, il termine generale si può scrivere $a_n = \dfrac{a_1}{q} \cdot q^n$: i punti del grafico stanno sulla curva $y = \dfrac{a_1}{q} \cdot q^x$, che è una [funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale) di base $q$ moltiplicata per una costante, come quelli di una progressione aritmetica stanno su una retta.

## Da un termine a un altro

Per passare dal termine di posto $k$ a quello di posto $n$ si fanno $n - k$ passi, e a ogni passo si moltiplica per $q$:

$$a_n = a_k \cdot q^{n-k}$$

La formula si ricava dividendo i due termini generali: $\dfrac{a_n}{a_k} = \dfrac{a_1 q^{n-1}}{a_1 q^{k-1}} = q^{n-k}$. Conoscendo due termini trovi quindi una potenza della ragione, $q^{n-k} = \dfrac{a_n}{a_k}$, e da quella la ragione.

```ad-example
Esempio 3: la progressione da due termini
In una progressione geometrica $a_2 = 6$ e $a_5 = 162$. Trova la ragione e il primo termine.

Dal secondo al quinto termine ci sono tre passi:

$$q^3 = \frac{a_5}{a_2} = \frac{162}{6} = 27$$

L'unico numero reale che ha cubo $27$ è $3$, quindi $q = 3$. Il primo termine viene un passo prima del secondo: $a_1 = \dfrac{a_2}{q} = \dfrac{6}{3} = 2$. La progressione è $2, 6, 18, 54, 162, \dots$
```

```ad-example
Esempio 4: due progressioni con gli stessi termini
In una progressione geometrica $a_3 = 12$ e $a_5 = 48$. Trova la ragione e il primo termine.

Dal terzo al quinto termine ci sono due passi:

$$q^2 = \frac{48}{12} = 4$$

Questa volta l'esponente è pari, e i numeri che hanno quadrato $4$ sono due: $q = 2$ e $q = -2$. In tutti e due i casi $a_1 = \dfrac{a_3}{q^2} = \dfrac{12}{4} = 3$. Le progressioni che soddisfano la richiesta sono due:

$$3, 6, 12, 24, 48, \dots \qquad \text{e} \qquad 3, -6, 12, -24, 48, \dots$$

Hanno uguali i termini di posto dispari e opposti quelli di posto pari.
```

```ad-warning
Con l'esponente pari le ragioni sono due
Da $q^2 = 4$ non segue solo $q = 2$: anche $q = -2$ va bene, e dà una progressione a segni alterni. Succede ogni volta che tra i due termini noti c'è un numero pari di passi, come nelle [equazioni binomie](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-binomie-trinomie-e-scomponibili) di grado pari. Se poi la potenza della ragione risulta negativa con un esponente pari, per esempio $q^2 = -4$, nessuna progressione geometrica di numeri reali ha quei due termini.
```

Per trovare il posto di un termine si scrive l'equazione $a_1 \cdot q^{n-1} = \text{numero}$, in cui l'incognita $n$ sta all'esponente.

```ad-example
Esempio 5: il posto di un termine
Nella progressione geometrica $2, 6, 18, \dots$ quale posto occupa il numero $1458$?

Qui $a_1 = 2$ e $q = 3$:

$$
\begin{gathered}
2 \cdot 3^{n-1} = 1458 \\
3^{n-1} = 729
\end{gathered}
$$

Scomponendo in fattori primi trovi $729 = 3^6$. Due potenze di $3$ sono uguali solo se hanno lo stesso esponente, quindi $n - 1 = 6$ e $n = 7$: il numero $1458$ è il settimo termine.
```

In questo esempio il secondo membro è una potenza esatta della ragione. Quando non lo è, l'equazione si risolve con i logaritmi, nella lezione [Equazioni esponenziali](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/equazioni-esponenziali).

## Medio geometrico

In una progressione geometrica il termine che precede $a_n$ è $\dfrac{a_n}{q}$ e quello che lo segue è $a_n \cdot q$. Il loro prodotto è $a_n^2$, quindi

$$a_n^2 = a_{n-1} \cdot a_{n+1} \quad \text{per ogni } n \geq 2$$

Se i termini sono positivi, $a_n = \sqrt{a_{n-1} \cdot a_{n+1}}$. Il numero $\sqrt{ab}$ si chiama **media geometrica** dei numeri positivi $a$ e $b$: in una progressione geometrica a termini positivi ogni termine, dal secondo in poi, è la media geometrica del precedente e del successivo. In $3, 6, 12$ il termine centrale è $\sqrt{3 \cdot 12} = \sqrt{36} = 6$.

Inserire $k$ **medi geometrici** tra due numeri $a$ e $b$ vuol dire trovare $k$ numeri che, messi in ordine tra $a$ e $b$, formano con loro una progressione geometrica. Come per i medi aritmetici, da $a$ a $b$ ci sono $k + 1$ passi, quindi

$$q^{k+1} = \frac{b}{a}$$

```ad-example
Esempio 6: inserire medi geometrici
Inserisci tre medi geometrici tra $2$ e $162$.

Con i due estremi i termini sono cinque, e i passi da $2$ a $162$ sono quattro:

$$q^4 = \frac{162}{2} = 81$$

L'esponente è pari, quindi $q = 3$ oppure $q = -3$. Con $q = 3$ i medi sono $6$, $18$ e $54$; con $q = -3$ sono $-6$, $18$ e $-54$. Le progressioni sono $2, 6, 18, 54, 162$ e $2, -6, 18, -54, 162$.
```

```ad-tip
Tre numeri in progressione geometrica
Quando un problema parla di tre numeri in progressione geometrica, chiamali $\dfrac{x}{q}$, $x$, $xq$: nel prodotto la ragione si cancella e resta $x^3$. È lo stesso trucco di $x - d$, $x$, $x + d$ per le progressioni aritmetiche.
```

## La somma dei primi n termini

La somma dei primi $n$ termini di una progressione geometrica di ragione $q \neq 1$ è

$$S_n = a_1 \cdot \frac{q^n - 1}{q - 1}$$

Per dimostrarla scrivi la somma con il termine generale, e sotto la stessa somma moltiplicata per $q$:

$$
\begin{aligned}
S_n &= a_1 + a_1 q + a_1 q^2 + \dots + a_1 q^{n-1} \\
q \cdot S_n &= a_1 q + a_1 q^2 + \dots + a_1 q^{n-1} + a_1 q^n
\end{aligned}
$$

Moltiplicare per $q$ sposta ogni termine sul successivo, quindi le due righe hanno in comune tutti i termini tranne due: $a_1$, che c'è solo nella prima, e $a_1 q^n$, che c'è solo nella seconda. Sottraendo la prima riga dalla seconda i termini comuni si cancellano:

$$
\begin{gathered}
q \cdot S_n - S_n = a_1 q^n - a_1 \\
S_n(q - 1) = a_1(q^n - 1)
\end{gathered}
$$

Poiché $q \neq 1$, puoi dividere per $q - 1$ e ottieni la formula. Cambiando segno a numeratore e denominatore la formula diventa

$$S_n = a_1 \cdot \frac{1 - q^n}{1 - q}$$

che è più comoda quando $q$ è compresa tra $0$ e $1$, perché numeratore e denominatore restano positivi.

```ad-warning
Con q = 1 la formula non si usa
Se $q = 1$ il denominatore $q - 1$ vale zero, e la formula non ha significato. Ma in quel caso la progressione è costante, e la somma è $S_n = n \cdot a_1$: per $5, 5, 5, 5$ è $4 \cdot 5 = 20$.
```

```ad-example
Esempio 7: la somma con una ragione intera
Calcola la somma dei primi otto termini della progressione geometrica $3, 6, 12, \dots$

Qui $a_1 = 3$, $q = 2$ e $n = 8$:

$$S_8 = 3 \cdot \frac{2^8 - 1}{2 - 1} = 3 \cdot 255 = 765$$

Controllo, sommando gli otto termini: $3 + 6 + 12 + 24 + 48 + 96 + 192 + 384 = 765$.
```

```ad-example
Esempio 8: ragione frazionaria e ragione negativa
Calcola le somme $1 + \dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dfrac{1}{16} + \dfrac{1}{32}$ e $2 - 6 + 18 - 54 + 162$.

La prima è la somma di sei termini di una progressione geometrica con $a_1 = 1$ e $q = \dfrac{1}{2}$. Con la seconda forma della formula:

$$
\begin{aligned}
S_6 &= \frac{1 - \left(\frac{1}{2}\right)^6}{1 - \frac{1}{2}} \\
&= \frac{63}{64} \cdot 2 = \frac{63}{32}
\end{aligned}
$$

La seconda è la somma di cinque termini con $a_1 = 2$ e $q = -3$. La potenza $(-3)^5 = -243$ è negativa, perché l'esponente è dispari:

$$
\begin{aligned}
S_5 &= 2 \cdot \frac{(-3)^5 - 1}{-3 - 1} \\
&= 2 \cdot \frac{-244}{-4} = 2 \cdot 61 = 122
\end{aligned}
$$
```

```ad-note
I chicchi sulla scacchiera
Una leggenda racconta che l'inventore degli scacchi chiese al suo re, come ricompensa, un chicco di grano sulla prima casella, due sulla seconda, quattro sulla terza, e così via raddoppiando fino alla sessantaquattresima. I chicchi formano una progressione geometrica con $a_1 = 1$ e $q = 2$, e in tutto sono

$$S_{64} = \frac{2^{64} - 1}{2 - 1} = 2^{64} - 1 = 18\,446\,744\,073\,709\,551\,615$$

cioè più di diciotto miliardi di miliardi.
```

## Crescita a percentuale costante

Una quantità che a ogni periodo aumenta della stessa [percentuale](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali) forma una progressione geometrica. Se un capitale $C_0$ è depositato a un tasso di interesse annuo $i$, e gli interessi di ogni anno si aggiungono al capitale, dopo un anno il capitale è $C_0 + C_0 \cdot i = C_0(1 + i)$: è stato moltiplicato per $1 + i$. Lo stesso accade ogni anno, quindi dopo $n$ anni il capitale è

$$C_n = C_0(1 + i)^n$$

I capitali $C_0, C_1, C_2, \dots$ formano una progressione geometrica di ragione $1 + i$. Questo modo di calcolare gli interessi si chiama **interesse composto**.

```ad-example
Esempio 9: un capitale al 3% annuo
Depositi $1000$ euro al tasso annuo del $3\%$, con interesse composto. Quanto hai dopo cinque anni?

Il tasso è $i = 0{,}03$ e la ragione è $1 + i = 1{,}03$:

$$C_5 = 1000 \cdot 1{,}03^5 \approx 1000 \cdot 1{,}15927 = 1159{,}27$$

Dopo cinque anni hai $1159{,}27$ euro.
```

```ad-warning
Le percentuali non si sommano
Cinque aumenti del $3\%$ non fanno un aumento del $15\%$: con il $15\%$ in una volta sola avresti $1150$ euro, non $1159{,}27$. Ogni anno il $3\%$ si calcola sul capitale dell'anno prima, che contiene già gli interessi precedenti. Attenzione anche agli indici: qui il capitale iniziale è $C_0$, quindi $C_5$ è il sesto termine della progressione e l'esponente è $5$, il numero degli anni.
```

La figura confronta i due conti per un capitale di $100$ euro al $20\%$ annuo: i punti sono il capitale con l'interesse composto, la retta tratteggiata è quello che si otterrebbe sommando ogni anno il $20\%$ del capitale iniziale.

```tikz
% nome: interesse-composto-e-percentuali-sommate
% alt: Il capitale di 100 euro al 20 per cento annuo nei primi sei anni. I punti dell'interesse composto, 100, 120, 144, circa 173, 207, 249 e 299, salgono sempre più in fretta e dal secondo anno stanno sopra la retta tratteggiata delle percentuali sommate, che passa per 100 all'anno zero e per 220 al sesto anno
\begin{tikzpicture}[xscale=0.75, yscale=0.0125]
\draw[gray!25, very thin, ystep=100] (0,0) grid (6.5,320);
\draw[->] (-0.4,0) -- (7,0) node[right] {$n$};
\draw[->] (0,-16) -- (0,345) node[above] {$C_n$};
\foreach \x in {1,2,3,4,5,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {100,200,300} \node[left] at (0,\y) {\small $\y$};
\draw[dashed, gray] (0,100) -- (6.5,230);
\foreach \x/\y in {0/100, 1/120, 2/144, 3/172.8, 4/207.36, 5/248.83, 6/298.6} \fill[blue!60] (\x,\y) ellipse (0.11 and 6.6);
\end{tikzpicture}
```
```grafico
% nome: interesse-composto-cursore-tasso
% alt: Il capitale di 100 euro nei primi sei anni con il cursore del tasso i da 0 a 0,3: i punti dell'interesse composto e la retta tratteggiata delle percentuali sommate. Con i uguale a zero punti e retta sono orizzontali a quota 100; al crescere di i i punti si staccano dalla retta sempre di più
curva: y=100\left(1+ix\right) | tratteggiata | grigio
curva: \left(0;100\right) | blu
curva: \left(1;100\left(1+i\right)\right) | blu
curva: \left(2;100\left(1+i\right)^2\right) | blu
curva: \left(3;100\left(1+i\right)^3\right) | blu
curva: \left(4;100\left(1+i\right)^4\right) | blu
curva: \left(5;100\left(1+i\right)^5\right) | blu
curva: \left(6;100\left(1+i\right)^6\right) | blu
cursore: i = 0,2 da 0 a 0,3 passo 0,05
finestra: x da -1 a 8,5, y da -60 a 520
forma: 3:2
assi: n, Cₙ
valore: C_6 = 100\left(1+i\right)^6
valore: 100\left(1+6i\right) = 100\left(1+6i\right)
domanda: Con $i = 0{,}2$, dopo sei anni di quanto il capitale supera quello delle percentuali sommate? E che cosa resta con $i = 0$?
```

Con $i = 0{,}2$ dopo sei anni il capitale è $100 \cdot 1{,}2^6 \approx 298{,}60$ euro, contro i $100 \cdot (1 + 6 \cdot 0{,}2) = 220$ delle percentuali sommate: circa $78{,}60$ euro in più, e la distanza cresce ogni anno. Con $i = 0$ la ragione è $1$ e il capitale resta fermo a $100$ euro: punti e retta coincidono.

Una quantità che diminuisce di una percentuale costante segue la stessa legge con ragione minore di $1$: un'auto che perde il $20\%$ del valore ogni anno ha ragione $1 - 0{,}20 = 0{,}8$.

```ad-note
Sommare infiniti termini
Quando la ragione è compresa tra $-1$ e $1$, le potenze $q^n$ si avvicinano sempre di più a zero al crescere di $n$: con $q = \dfrac{1}{2}$ si ha $q^{10} = \dfrac{1}{1024}$. Nella formula $S_n = a_1 \cdot \dfrac{1 - q^n}{1 - q}$ il termine $q^n$ conta sempre meno, e la somma si avvicina sempre di più al numero

$$\frac{a_1}{1 - q}$$

Per esempio le somme $\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dots + \dfrac{1}{2^n}$ valgono $1 - \dfrac{1}{2^n}$ e si avvicinano a $1$: nella figura i rettangoli, ognuno la metà del precedente, riempiono a poco a poco il quadrato di area $1$. Che cosa voglia dire con precisione "sommare infiniti termini" si studia al quinto anno.

```tikz
% nome: somma-meta-un-quarto-un-ottavo-quadrato
% alt: Un quadrato di area 1 diviso in rettangoli: metà del quadrato, poi un quarto, un ottavo, un sedicesimo, un trentaduesimo e un sessantaquattresimo, ognuno la metà del precedente; insieme coprono quasi tutto il quadrato, e resta scoperto solo un quadratino in alto a destra
\begin{tikzpicture}[scale=3.4]
\fill[blue!35] (0,0) rectangle (0.5,1);
\fill[orange!45] (0.5,0) rectangle (1,0.5);
\fill[blue!35] (0.5,0.5) rectangle (0.75,1);
\fill[orange!45] (0.75,0.5) rectangle (1,0.75);
\fill[blue!35] (0.75,0.75) rectangle (0.875,1);
\fill[orange!45] (0.875,0.75) rectangle (1,0.875);
\draw (0.5,0) -- (0.5,1);
\draw (0.5,0.5) -- (1,0.5);
\draw (0.75,0.5) -- (0.75,1);
\draw (0.75,0.75) -- (1,0.75);
\draw (0.875,0.75) -- (0.875,1);
\draw (0.875,0.875) -- (1,0.875);
\draw[thick] (0,0) rectangle (1,1);
\node at (0.25,0.5) {$\frac{1}{2}$};
\node at (0.75,0.25) {$\frac{1}{4}$};
\node at (0.625,0.75) {$\frac{1}{8}$};
\node at (0.875,0.625) {\small $\frac{1}{16}$};
\end{tikzpicture}
```
```grafico
% nome: somme-parziali-geometriche-cursore-ragione
% alt: Le prime otto somme della progressione geometrica con primo termine un mezzo come punti isolati, con il cursore della ragione q da -0,9 a 0,9 e la retta tratteggiata all'altezza di un mezzo fratto 1 meno q: con q uguale a 0,5 i punti salgono verso la retta y = 1, con q negativa stanno alternativamente sopra e sotto la retta, con q vicina a 1 la retta è più in alto e i punti la avvicinano più lentamente
curva: y=\frac{1}{2\left(1-q\right)} | tratteggiata | grigio
curva: \left(1;\frac{1}{2}\right) | blu
curva: \left(2;\frac{1}{2}\left(1+q\right)\right) | blu
curva: \left(3;\frac{1}{2}\left(1+q+q^2\right)\right) | blu
curva: \left(4;\frac{1}{2}\left(1+q+q^2+q^3\right)\right) | blu
curva: \left(5;\frac{1}{2}\left(1+q+q^2+q^3+q^4\right)\right) | blu
curva: \left(6;\frac{1}{2}\left(1+q+q^2+q^3+q^4+q^5\right)\right) | blu
curva: \left(7;\frac{1}{2}\left(1+q+q^2+q^3+q^4+q^5+q^6\right)\right) | blu
curva: \left(8;\frac{1}{2}\left(1+q+q^2+q^3+q^4+q^5+q^6+q^7\right)\right) | blu
cursore: q = 0,5 da -0,9 a 0,9 passo 0,1
finestra: x da -1 a 10, y da -1 a 5,5
assi: n, Sₙ
valore: \frac{a_1}{1-q} = \frac{1}{2\left(1-q\right)}
valore: S_4 = \frac{1}{2}\left(1+q+q^2+q^3\right)
domanda: Qui $a_1 = \dfrac{1}{2}$, e con $q = 0{,}5$ le somme si avvicinano a $1$. A quale numero si avvicinano con $q = -0{,}5$? E con $q = 0{,}8$ ci arrivano più in fretta o più lentamente?
```

Con $q = -0{,}5$ le somme si avvicinano a $\dfrac{1}{2} : \dfrac{3}{2} = \dfrac{1}{3}$, stando alternativamente sopra e sotto. Con $q = 0{,}8$ si avvicinano a $\dfrac{1}{2} : \dfrac{1}{5} = \dfrac{5}{2}$, ma più lentamente: l'ottava somma vale circa $2{,}08$. Più la ragione è vicina a $1$ o a $-1$, più termini servono.
```
