# Progressioni aritmetiche

In un teatro la prima fila ha $18$ posti e ogni fila ne ha $2$ in più della precedente: $18, 20, 22, 24, \dots$ Per sapere quanti posti ha la ventesima fila, o quanti ne ha tutta la platea, non serve contare fila per fila: i numeri crescono sempre dello stesso passo, e questo permette di scrivere due formule che danno subito la risposta. Una successione che avanza a passo costante si chiama progressione aritmetica.

Per seguire la lezione ti servono le [successioni numeriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/successioni-numeriche): termine generale, definizione per ricorsione, successioni crescenti e decrescenti.

## Che cos'è una progressione aritmetica

Una **progressione aritmetica** è una successione in cui la differenza tra ogni termine e il precedente è sempre la stessa. Questa differenza costante si chiama **ragione** e si indica con $d$:

$$a_{n+1} - a_n = d \quad \text{per ogni } n$$

Scritta come legge di ricorrenza, la definizione dice che ogni termine si ottiene dal precedente aggiungendo la ragione: $a_{n+1} = a_n + d$. Una progressione aritmetica è quindi individuata da due numeri, il primo termine $a_1$ e la ragione $d$. I posti del teatro formano una progressione aritmetica con $a_1 = 18$ e $d = 2$.

Il segno della ragione dice come si comporta la progressione, perché $d$ è proprio la differenza $a_{n+1} - a_n$ che si studia per la monotonia:

- se $d > 0$ la progressione è crescente, come $3, 7, 11, 15, \dots$, che ha $d = 4$;
- se $d < 0$ è decrescente, come $10, 7, 4, 1, -2, \dots$, che ha $d = -3$;
- se $d = 0$ è costante, come $5, 5, 5, 5, \dots$

Per riconoscere una progressione aritmetica calcola le differenze tra termini consecutivi: devono essere tutte uguali.

```ad-example
Esempio 1: riconoscere una progressione aritmetica
Stabilisci quali di questi elenchi sono i primi termini di una progressione aritmetica, e con quale ragione.

Primo elenco: $12, 7, 2, -3$. Le differenze sono $7 - 12 = -5$, $2 - 7 = -5$, $-3 - 2 = -5$. Sono uguali: è una progressione aritmetica di ragione $d = -5$.

Secondo elenco: $1, 2, 4, 8$. Le differenze sono $1$, $2$, $4$. Non sono uguali: non è una progressione aritmetica.

Terzo elenco: $\dfrac{1}{2}, \dfrac{5}{4}, 2, \dfrac{11}{4}$. Le differenze sono

$$\frac{5}{4} - \frac{1}{2} = \frac{3}{4}, \qquad 2 - \frac{5}{4} = \frac{3}{4}, \qquad \frac{11}{4} - 2 = \frac{3}{4}$$

È una progressione aritmetica di ragione $d = \dfrac{3}{4}$.
```

```ad-warning
La ragione è il termine dopo meno il termine prima
In $12, 7, 2, -3$ la ragione è $7 - 12 = -5$, non $12 - 7 = 5$. Se sottrai nell'ordine sbagliato trovi la ragione con il segno opposto, e una progressione decrescente ti sembra crescente.
```

## Il termine generale

Partendo da $a_1$ e aggiungendo ogni volta la ragione ottieni

$$
\begin{gathered}
a_2 = a_1 + d \\
a_3 = a_2 + d = a_1 + 2d \\
a_4 = a_3 + d = a_1 + 3d
\end{gathered}
$$

Per arrivare al termine di posto $n$ partendo dal primo si fanno $n - 1$ passi, e a ogni passo si aggiunge $d$. Il termine generale di una progressione aritmetica è quindi

$$a_n = a_1 + (n - 1)d$$

Il ragionamento "e così via" si trasforma in una dimostrazione rigorosa con il [principio di induzione](/materiale/scuola-superiore/matematica/successioni-e-progressioni/principio-di-induzione).

```ad-warning
I passi sono n − 1, non n
Per andare dal primo termine al quinto fai quattro passi, non cinque: $a_5 = a_1 + 4d$. Chi scrive $a_n = a_1 + nd$ trova il termine successivo a quello cercato.
```

```ad-example
Esempio 2: calcolare un termine
Calcola il ventesimo termine della progressione aritmetica $5, 8, 11, \dots$ e il nono termine di quella con $a_1 = 10$ e $d = -\dfrac{3}{2}$.

Nella prima $a_1 = 5$ e $d = 8 - 5 = 3$:

$$a_{20} = 5 + 19 \cdot 3 = 5 + 57 = 62$$

Nella seconda la ragione è negativa e frazionaria, ma la formula è la stessa:

$$a_9 = 10 + 8 \cdot \left(-\frac{3}{2}\right) = 10 - 12 = -2$$
```

Svolgendo il prodotto, il termine generale diventa $a_n = dn + (a_1 - d)$: un polinomio di primo grado in $n$, in cui il coefficiente di $n$ è la ragione. Per la progressione $5, 8, 11, \dots$ ottieni $a_n = 5 + (n - 1) \cdot 3 = 3n + 2$. Vale anche il contrario: una successione con termine generale $a_n = pn + q$ è una progressione aritmetica di ragione $p$, perché $a_{n+1} - a_n = p(n + 1) + q - pn - q = p$.

```ad-example
Esempio 3: il posto di un termine
Stabilisci se $100$ e $150$ sono termini della progressione aritmetica $4, 7, 10, \dots$

Qui $a_1 = 4$ e $d = 3$. Per $100$ cerca l'indice $n$ tale che $a_n = 100$:

$$
\begin{gathered}
4 + (n - 1) \cdot 3 = 100 \\
(n - 1) \cdot 3 = 96 \\
n - 1 = 32 \\
n = 33
\end{gathered}
$$

L'indice è un numero naturale: $100$ è il trentatreesimo termine.

Per $150$ la stessa equazione dà $(n - 1) \cdot 3 = 146$, cioè $n - 1 = \dfrac{146}{3}$, che non è un numero naturale: $150$ non è un termine della progressione. Infatti $a_{49} = 148$ e $a_{50} = 151$.
```

### Il grafico: punti su una retta

I punti $(n, a_n)$ del grafico di una progressione aritmetica sono allineati. Infatti $a_n = dn + (a_1 - d)$ ha la stessa forma dell'[equazione della retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari) $y = mx + q$: i punti stanno sulla retta $y = dx + (a_1 - d)$, che ha per coefficiente angolare la ragione. A ogni passo di $1$ verso destra il punto sale di $d$, oppure scende se $d$ è negativo.

Per la progressione $1, 3, 5, 7, 9, \dots$, con $a_1 = 1$ e $d = 2$, la retta è $y = 2x - 1$.

```tikz
% nome: progressione-aritmetica-punti-allineati
% alt: Grafico della progressione aritmetica 1, 3, 5, 7, 9: i cinque punti (1, 1), (2, 3), (3, 5), (4, 7) e (5, 9) sono allineati sulla retta tratteggiata y = 2x - 1; tra il terzo e il quarto punto un gradino mostra che a un passo di 1 verso destra corrisponde una salita di d = 2
% svg: progressione-aritmetica-punti-allineati-0b389b72.svg 223x255
\begin{tikzpicture}[xscale=0.75, yscale=0.5]
\draw[gray!25, very thin] (0,0) grid (6,10);
\draw[->] (-0.4,0) -- (6.6,0) node[right] {$n$};
\draw[->] (0,-1.6) -- (0,10.8) node[above] {$a_n$};
\foreach \x in {1,2,3,4,5} \node[below] at (\x,0) {\small $\x$};
\foreach \y in {1,3,5,7,9} \node[left] at (0,\y) {\small $\y$};
\draw[dashed, gray] (0,-1) -- (5.5,10);
\draw[orange!80!black, thick] (3,5) -- (4,5) -- (4,7);
\node[below, orange!60!black] at (3.5,5) {\small $1$};
\node[right, orange!60!black] at (4,6) {\small $d = 2$};
\foreach \x/\y in {1/1, 2/3, 3/5, 4/7, 5/9} \fill[blue!60] (\x,\y) ellipse (0.11 and 0.165);
\end{tikzpicture}
```
```grafico
% nome: progressione-aritmetica-cursori
% alt: I primi sei termini di una progressione aritmetica come punti del piano, con i cursori del primo termine e della ragione d, e la retta tratteggiata su cui i punti sono allineati: con d positivo i punti salgono, con d negativo scendono, con d uguale a zero stanno tutti alla stessa altezza
curva: y=a_1+\left(x-1\right)d | tratteggiata | grigio
curva: \left(1;a_1\right) | blu
curva: \left(2;a_1+d\right) | blu
curva: \left(3;a_1+2d\right) | blu
curva: \left(4;a_1+3d\right) | blu
curva: \left(5;a_1+4d\right) | blu
curva: \left(6;a_1+5d\right) | blu
cursore: a_1 = 1 da -4 a 6 passo 0,5
cursore: d = 2 da -2 a 2 passo 0,5
finestra: x da -1 a 8, y da -16 a 18
forma: 3:2
assi: n, aₙ
valore: a_6 = a_1+5d
domanda: Porta $d$ a $0$: che progressione resta? Poi muovi solo $a_1$: la pendenza della retta cambia?
```

Con $d = 0$ i punti stanno su una retta orizzontale: la progressione è costante, e tutti i termini valgono $a_1$. Con $d$ negativo la retta scende. Muovendo solo $a_1$ la retta si sposta in su o in giù restando parallela a se stessa, perché la sua pendenza è $d$.

## Da un termine a un altro

Per passare dal termine di posto $k$ a quello di posto $n$ si fanno $n - k$ passi, ognuno di ampiezza $d$:

$$a_n = a_k + (n - k)d$$

La formula si ricava sottraendo i due termini generali: $a_n - a_k = (n - 1)d - (k - 1)d = (n - k)d$. Vale anche quando $n$ è minore di $k$: in quel caso $n - k$ è negativo, e tornare indietro vuol dire sottrarre la ragione. Con $k = 1$ ritrovi il termine generale.

Letta al contrario, la formula dà la ragione quando conosci due termini qualunque:

$$d = \frac{a_n - a_k}{n - k}$$

È la formula del [coefficiente angolare](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti) della retta che passa per i punti $(k, a_k)$ e $(n, a_n)$.

```ad-example
Esempio 4: la progressione da due termini
In una progressione aritmetica $a_4 = 11$ e $a_{10} = 35$. Trova la ragione, il primo termine e il termine generale.

Dal quarto al decimo termine ci sono $10 - 4 = 6$ passi:

$$d = \frac{35 - 11}{10 - 4} = \frac{24}{6} = 4$$

Dal quarto termine torna indietro di tre passi fino al primo:

$$a_1 = a_4 - 3d = 11 - 12 = -1$$

Il termine generale è $a_n = -1 + (n - 1) \cdot 4 = 4n - 5$. Controllo: $a_{10} = 40 - 5 = 35$.
```

## Medio aritmetico

In una progressione aritmetica il termine che precede $a_n$ è $a_n - d$ e quello che lo segue è $a_n + d$. La loro somma è $2a_n$, quindi

$$a_n = \frac{a_{n-1} + a_{n+1}}{2} \quad \text{per ogni } n \geq 2$$

Ogni termine, dal secondo in poi, è la [media aritmetica](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda) del precedente e del successivo: da qui viene il nome della progressione. In $3, 7, 11$ il termine centrale è $\dfrac{3 + 11}{2} = 7$.

```ad-tip
Tre numeri in progressione aritmetica
Quando un problema parla di tre numeri in progressione aritmetica, chiamali $x - d$, $x$, $x + d$ invece di $a_1$, $a_1 + d$, $a_1 + 2d$: nella somma la ragione si cancella e resta $3x$.
```

```ad-example
Esempio 5: tre numeri in progressione aritmetica
Tre numeri in progressione aritmetica hanno somma $18$ e prodotto $120$. Trovali.

Chiama i tre numeri $x - d$, $x$, $x + d$. La somma dà subito il termine centrale:

$$(x - d) + x + (x + d) = 3x = 18 \quad \Rightarrow \quad x = 6$$

Il prodotto, con $x = 6$ e il prodotto notevole $(6 - d)(6 + d) = 36 - d^2$, dà

$$
\begin{gathered}
6(36 - d^2) = 120 \\
36 - d^2 = 20 \\
d^2 = 16 \\
d = \pm 4
\end{gathered}
$$

Con $d = 4$ i numeri sono $2, 6, 10$; con $d = -4$ sono gli stessi in ordine inverso, $10, 6, 2$. Controllo: $2 + 6 + 10 = 18$ e $2 \cdot 6 \cdot 10 = 120$.
```

Inserire $k$ **medi aritmetici** tra due numeri $a$ e $b$ vuol dire trovare $k$ numeri che, messi in ordine tra $a$ e $b$, formano con loro una progressione aritmetica. La progressione ha $k + 2$ termini, e da $a$ a $b$ ci sono $k + 1$ passi:

$$d = \frac{b - a}{k + 1}$$

```ad-example
Esempio 6: inserire medi aritmetici
Inserisci quattro medi aritmetici tra $4$ e $24$.

Con i due estremi i termini sono sei, e i passi da $4$ a $24$ sono cinque:

$$d = \frac{24 - 4}{5} = 4$$

I quattro medi sono $8$, $12$, $16$ e $20$, e la progressione è $4, 8, 12, 16, 20, 24$.
```

```ad-warning
I passi sono uno più dei medi
Con quattro medi tra $4$ e $24$ si divide per $5$, non per $4$: i medi dividono il tratto tra gli estremi in cinque parti uguali. Se dividi per $4$ trovi $d = 5$ e l'elenco $4, 9, 14, 19, 24$, che ha solo tre medi.
```

## La somma dei primi n termini

Si racconta che Gauss, da bambino, abbia sommato i numeri da $1$ a $100$ in pochi secondi. Aveva notato che il primo e l'ultimo danno $1 + 100 = 101$, il secondo e il penultimo $2 + 99 = 101$, e così per tutte le coppie: sono $50$ coppie, e la somma è $50 \cdot 101 = 5050$. La stessa idea funziona per ogni progressione aritmetica.

### Termini equidistanti dagli estremi

Considera i primi $n$ termini di una progressione aritmetica: $a_1$ e $a_n$ sono gli **estremi**. Due termini sono **equidistanti dagli estremi** se uno viene tanti posti dopo il primo quanti l'altro viene prima dell'ultimo: $a_2$ e $a_{n-1}$, $a_3$ e $a_{n-2}$, in generale $a_{1+k}$ e $a_{n-k}$.

La somma di due termini equidistanti dagli estremi è uguale alla somma degli estremi. Infatti per andare da $a_1$ ad $a_{1+k}$ si aggiunge $k$ volte la ragione, e per andare da $a_n$ ad $a_{n-k}$ la si toglie $k$ volte:

$$a_{1+k} + a_{n-k} = (a_1 + kd) + (a_n - kd) = a_1 + a_n$$

Nei primi sei termini di $3, 7, 11, 15, 19, 23$ le coppie sono $3 + 23 = 26$, $7 + 19 = 26$, $11 + 15 = 26$.

### La formula della somma

La somma dei primi $n$ termini di una successione si indica con $S_n$:

$$S_n = a_1 + a_2 + \dots + a_n$$

Per una progressione aritmetica vale la formula

$$S_n = \frac{n(a_1 + a_n)}{2}$$

cioè la somma dei primi $n$ termini è il numero dei termini per la media dei due estremi.

Per dimostrarla scrivi la somma due volte, la seconda con i termini in ordine inverso:

$$
\begin{aligned}
S_n &= a_1 + a_2 + \dots + a_{n-1} + a_n \\
S_n &= a_n + a_{n-1} + \dots + a_2 + a_1
\end{aligned}
$$

Somma le due righe in colonna. A sinistra ottieni $2S_n$. A destra ogni colonna contiene due termini equidistanti dagli estremi, la cui somma vale $a_1 + a_n$, e le colonne sono $n$:

$$2S_n = n(a_1 + a_n)$$

Dividendo per $2$ ottieni la formula.

La figura mostra la dimostrazione per $1 + 2 + 3 + 4 + 5$. La scala blu, in basso, ha $S_5$ quadretti; la scala arancione, in alto, è la stessa capovolta. Insieme riempiono un rettangolo con $5$ colonne di $1 + 5 = 6$ quadretti, quindi $2S_5 = 5 \cdot 6$ e $S_5 = 15$.

```tikz
% nome: somma-progressione-aritmetica-due-scale
% alt: Un rettangolo di 5 colonne e 6 righe di quadretti diviso in due scale uguali: quella blu, in basso, ha colonne di 1, 2, 3, 4 e 5 quadretti; quella arancione, in alto, ha colonne di 5, 4, 3, 2 e 1 quadretti. Ogni colonna ha in tutto 6 quadretti
% svg: somma-progressione-aritmetica-due-scale-8aac7714.svg 137x179
\begin{tikzpicture}[scale=0.62]
\foreach \i in {1,2,3,4,5} {
  \fill[blue!35] (\i-1,0) rectangle (\i,\i);
  \fill[orange!45] (\i-1,\i) rectangle (\i,6);
}
\draw[gray!70, thin] (0,0) grid (5,6);
\draw[thick] (0,0) rectangle (5,6);
\draw[thick] (0,1) -- (1,1) -- (1,2) -- (2,2) -- (2,3) -- (3,3) -- (3,4) -- (4,4) -- (4,5) -- (5,5);
\foreach \i in {1,2,3,4,5} \node[below] at (\i-0.5,0) {\small $\i$};
\node[left] at (0,3) {$6$};
\node[above] at (2.5,6) {$5$ colonne};
\end{tikzpicture}
```

Sostituendo $a_n = a_1 + (n - 1)d$ nella formula ne ottieni una seconda forma, comoda quando conosci il primo termine e la ragione ma non l'ultimo termine:

$$S_n = \frac{n\,[2a_1 + (n - 1)d]}{2}$$

Due somme che si incontrano spesso sono casi particolari. I numeri naturali da $1$ a $n$ formano una progressione aritmetica con $a_1 = 1$ e $a_n = n$; i primi $n$ numeri dispari ne formano una con $a_1 = 1$ e $a_n = 2n - 1$:

$$
\begin{gathered}
1 + 2 + 3 + \dots + n = \frac{n(n + 1)}{2} \\
1 + 3 + 5 + \dots + (2n - 1) = \frac{n \cdot 2n}{2} = n^2
\end{gathered}
$$

```ad-example
Esempio 7: i posti del teatro
Nel teatro dell'inizio la prima fila ha $18$ posti, ogni fila ne ha $2$ in più della precedente e le file sono $20$. Quanti posti ci sono in tutto?

I posti delle file formano una progressione aritmetica con $a_1 = 18$, $d = 2$ e $n = 20$. L'ultima fila ha

$$a_{20} = 18 + 19 \cdot 2 = 56$$

posti, e la somma è

$$S_{20} = \frac{20 \cdot (18 + 56)}{2} = 10 \cdot 74 = 740$$

Il teatro ha $740$ posti.
```

Quando della somma conosci il primo e l'ultimo termine ma non quanti sono i termini, il numero $n$ si ricava dal termine generale: da $a_n = a_1 + (n - 1)d$ ottieni

$$n = \frac{a_n - a_1}{d} + 1$$

```ad-example
Esempio 8: la somma dei multipli di 7 tra 100 e 300
Calcola la somma di tutti i multipli di $7$ compresi tra $100$ e $300$.

I multipli di $7$ formano una progressione aritmetica di ragione $7$. Il primo maggiore di $100$ è $105 = 7 \cdot 15$, l'ultimo minore di $300$ è $294 = 7 \cdot 42$. Il numero dei termini è

$$n = \frac{294 - 105}{7} + 1 = 27 + 1 = 28$$

e la somma è

$$S_{28} = \frac{28 \cdot (105 + 294)}{2} = 14 \cdot 399 = 5586$$
```

```ad-warning
Il più uno nel numero dei termini
Da $105$ a $294$ i passi di $7$ sono $\dfrac{294 - 105}{7} = 27$, ma i termini sono $28$: i termini sono sempre uno più dei passi, come i pali di una staccionata sono uno più dei tratti. Dimenticando il $+ 1$ la somma viene $13{,}5 \cdot 399$, che non è nemmeno un numero intero.
```

```ad-example
Esempio 9: quanti termini servono
Quanti termini della progressione aritmetica $3, 7, 11, \dots$ bisogna sommare, a partire dal primo, per ottenere $210$?

Qui $a_1 = 3$ e $d = 4$, e l'incognita è $n$. Usa la seconda forma della somma:

$$
\begin{gathered}
\frac{n\,[6 + 4(n - 1)]}{2} = 210 \\
\frac{n(4n + 2)}{2} = 210 \\
n(2n + 1) = 210 \\
2n^2 + n - 210 = 0
\end{gathered}
$$

È un'[equazione di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) in $n$:

$$
\begin{gathered}
\Delta = 1 + 1680 = 1681 = 41^2 \\
n = \frac{-1 \pm 41}{4}
\end{gathered}
$$

Le soluzioni sono $n = 10$ e $n = -\dfrac{21}{2}$. Il numero dei termini è un naturale, quindi si accetta solo $n = 10$. Controllo: $a_{10} = 3 + 9 \cdot 4 = 39$ e $S_{10} = \dfrac{10 \cdot (3 + 39)}{2} = 210$.
```

Nelle [progressioni geometriche](/materiale/scuola-superiore/matematica/successioni-e-progressioni/progressioni-geometriche) resta costante il rapporto tra un termine e il precedente, al posto della differenza.
