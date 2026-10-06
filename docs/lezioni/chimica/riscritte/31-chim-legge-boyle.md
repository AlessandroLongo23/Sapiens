# La legge di Boyle

Se tappi con un dito la punta di una siringa piena d'aria e spingi lo stantuffo, l'aria si comprime, ma sempre più a fatica: più il volume diminuisce, più l'aria spinge indietro. Nel 1662 Robert Boyle misurò questo comportamento e trovò una legge semplice, che lega la pressione e il volume di un gas quando la temperatura non cambia. Qualche anno dopo, nel 1676, la trovò anche Edme Mariotte, e per questo molti libri la chiamano legge di Boyle-Mariotte.

## La legge

Si prende una quantità fissa di gas, chiusa in un recipiente con un pistone, e la si tiene a temperatura costante, per esempio immergendo il recipiente in una grande vasca d'acqua. Una trasformazione a temperatura costante si chiama **isoterma**. Si cambia il volume e si misura la pressione:

| $V$ (L) | $1{,}0$ | $2{,}0$ | $3{,}0$ | $4{,}0$ | $5{,}0$ |
|---|---|---|---|---|---|
| $p$ (atm) | $3{,}0$ | $1{,}5$ | $1{,}0$ | $0{,}75$ | $0{,}60$ |
| $p \cdot V$ (atm$\cdot$L) | $3{,}0$ | $3{,}0$ | $3{,}0$ | $3{,}0$ | $3{,}0$ |

Quando il volume raddoppia, la pressione si dimezza; quando il volume triplica, la pressione diventa un terzo. Il prodotto $p \cdot V$ resta sempre lo stesso. È la **legge di Boyle**: a temperatura costante, la pressione di una quantità fissa di gas è inversamente proporzionale al suo volume.

$$p \cdot V = \text{costante}$$

Pressione e volume sono grandezze [inversamente proporzionali](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa). La costante dipende dalla quantità di gas e dalla temperatura, ma non da quale gas si usa: aria, ossigeno o elio seguono la stessa legge.

Negli esercizi il gas passa da uno stato iniziale, con pressione $p_1$ e volume $V_1$, a uno stato finale, con $p_2$ e $V_2$. Il prodotto è lo stesso nei due stati:

$$p_1\,V_1 = p_2\,V_2$$

Da questa uguaglianza si ricava la grandezza che manca:

$$p_2 = \frac{p_1\,V_1}{V_2} \qquad\qquad V_2 = \frac{p_1\,V_1}{p_2}$$

```ad-example
Esempio 1: comprimere un gas
Un gas occupa $2{,}0\,\text{L}$ alla pressione di $1{,}0\,\text{atm}$. Lo si comprime, a temperatura costante, fino a $0{,}50\,\text{L}$. Quale pressione raggiunge?

$$p_2 = \frac{p_1\,V_1}{V_2} = \frac{1{,}0\,\text{atm} \cdot 2{,}0\,\text{L}}{0{,}50\,\text{L}} = 4{,}0\,\text{atm}$$

Il volume è diventato un quarto, e la pressione è quattro volte più grande.
```

```ad-example
Esempio 2: un pallone che sale
Un pallone contiene $3{,}0\,\text{L}$ di elio alla pressione di $760\,\text{mmHg}$. Sale in montagna, dove la pressione è $600\,\text{mmHg}$, e la temperatura resta la stessa. Quanto diventa grande il pallone? (La gomma del pallone è così sottile che il gas dentro ha la pressione dell'aria fuori.)

$$V_2 = \frac{p_1\,V_1}{p_2} = \frac{760\,\text{mmHg} \cdot 3{,}0\,\text{L}}{600\,\text{mmHg}} = 3{,}8\,\text{L}$$

La pressione è diminuita, e il volume è aumentato.
```

Un controllo che non costa niente: se la pressione aumenta, il volume deve diminuire, e viceversa. Se nel risultato le due grandezze vanno nello stesso verso, la formula è stata scritta al contrario.

```ad-warning
La formula rovesciata
L'errore più frequente è scrivere $p_2 = p_1\,V_2/V_1$, con il rapporto dei volumi capovolto: nell'esempio 1 verrebbe $0{,}25\,\text{atm}$, una pressione che diminuisce mentre il gas viene compresso. Parti sempre da $p_1 V_1 = p_2 V_2$ e ricava l'incognita.
```

## Le unità di misura

Nella formula $p_1 V_1 = p_2 V_2$ le unità si semplificano: le due pressioni possono essere in atmosfere, in kilopascal o in millimetri di mercurio, e i due volumi in litri, in millilitri o in centimetri cubi, purché le due pressioni abbiano la stessa unità, e così i due volumi. Non serve passare al Sistema Internazionale.

```ad-example
Esempio 3: unità diverse nei dati
Una siringa contiene $250\,\text{mL}$ di gas alla pressione di $1{,}20\,\text{atm}$. Il gas viene fatto espandere, a temperatura costante, in un recipiente vuoto, e alla fine occupa $1{,}50\,\text{L}$. Quale pressione ha, in atmosfere e in millimetri di mercurio?

I due volumi devono avere la stessa unità: $250\,\text{mL} = 0{,}250\,\text{L}$. Allora

$$p_2 = \frac{p_1\,V_1}{V_2} = \frac{1{,}20\,\text{atm} \cdot 0{,}250\,\text{L}}{1{,}50\,\text{L}} = 0{,}200\,\text{atm} = 0{,}200 \cdot 760\,\text{mmHg} = 152\,\text{mmHg}$$
```

```ad-warning
Millilitri e litri nella stessa formula
Con $V_1 = 250$ (millilitri) e $V_2 = 1{,}50$ (litri) il conto dà $200\,\text{atm}$, mille volte troppo. Prima di sostituire, porta i due volumi alla stessa unità, e le due pressioni alla stessa unità.
```

## Perché vale: le particelle

La [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare) spiega la legge di Boyle. A temperatura costante le particelle del gas hanno sempre la stessa velocità media. Se il volume si dimezza, nello stesso spazio ci sono il doppio delle particelle rispetto a prima: ogni centimetro quadrato di parete riceve il doppio degli urti al secondo, e la [pressione](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas) raddoppia.

```tikz
% nome: boyle-pistone-compressione
% alt: Due cilindri con un pistone e le stesse otto particelle di gas. A sinistra il pistone è in alto e il gas occupa il volume V a pressione p; a destra il pistone è sceso a metà altezza, il gas occupa V mezzi e le particelle, più fitte, urtano più spesso le pareti: la pressione è 2p
% svg: boyle-pistone-compressione-5379fc15.svg 212x180
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2,3);
\draw[thick, fill=gray!20] (0.02,3) rectangle (1.98,3.25);
\draw[thick] (0.9,3.25) -- (0.9,3.9) (1.1,3.25) -- (1.1,3.9);
\draw[thick] (0,3.9) -- (0,0) -- (2,0) -- (2,3.9);
\foreach \x/\y/\a in {0.4/0.4/30, 1.5/0.6/120, 0.8/1.3/-40, 1.6/1.6/200, 0.3/2.1/70, 1.2/2.5/-120, 0.7/2.8/10, 1.7/2.6/250} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:0.35);
  \fill[blue!30] (\x,\y) circle (0.08);
  \draw (\x,\y) circle (0.08);
}
\node[below] at (1,-0.1) {$V$, $p$};
\begin{scope}[xshift=3.5cm]
\fill[blue!10] (0,0) rectangle (2,1.5);
\draw[thick, fill=gray!20] (0.02,1.5) rectangle (1.98,1.75);
\draw[thick] (0.9,1.75) -- (0.9,3.9) (1.1,1.75) -- (1.1,3.9);
\draw[thick] (0,3.9) -- (0,0) -- (2,0) -- (2,3.9);
\foreach \x/\y/\a in {0.4/0.2/30, 1.5/0.3/120, 0.8/0.65/-40, 1.6/0.8/200, 0.3/1.05/70, 1.2/1.25/-120, 0.7/1.4/10, 1.7/1.3/250} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:0.35);
  \fill[blue!30] (\x,\y) circle (0.08);
  \draw (\x,\y) circle (0.08);
}
\node[below] at (1,-0.1) {$\frac{V}{2}$, $2p$};
\end{scope}
\end{tikzpicture}
```

Nella figura qui sotto un gas è chiuso in un cilindro con un pistone, a temperatura costante: sposta il pistone e guarda come cambiano la pressione, segnata dal manometro, e il prodotto $p \cdot V$. Il punto sul grafico accanto si muove lungo la curva di Boyle.

```interattivo
% nome: gas-cilindro-boyle
% alt: Un cilindro verticale chiuso da un pistone, con dentro particelle di gas che rimbalzano sulle pareti, un manometro collegato al cilindro e accanto un piccolo grafico. Si sceglie quale grandezza tenere costante (qui la temperatura), e con un cursore si cambia il volume da 1 a 4 litri: la pressione letta sul manometro cambia in modo che il prodotto p per V resti costante, e sul grafico pressione-volume il punto dello stato del gas scorre lungo un ramo di iperbole. Un altro cursore cambia il numero di particelle
```

## Il grafico pressione-volume

Riportando i dati della tabella in un grafico, con il volume sull'asse orizzontale e la pressione su quello verticale, i punti stanno su un ramo di **iperbole equilatera**, la curva della [proporzionalità inversa](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica). La curva scende: più grande è il volume, più piccola è la pressione. Si avvicina agli assi senza toccarli, perché la pressione non diventa mai zero, per quanto il gas si espanda.

```tikz
% nome: boyle-grafico-pressione-volume
% alt: Grafico della pressione in funzione del volume per un gas a temperatura costante: i cinque punti della tabella, da 3,0 atmosfere a 1,0 litri a 0,60 atmosfere a 5,0 litri, stanno su un ramo di iperbole che scende e si avvicina agli assi
% svg: boyle-grafico-pressione-volume-9e45c0ea.svg 286x230
% poi-interattivo: trascinare il punto dello stato del gas lungo la curva e leggere p, V e il loro prodotto, che resta 3,0 atm per litro
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.6] (0,0) grid (6,4.2);
\draw[->] (0,0) -- (6.4,0);
\node[below] at (6.2,-0.3) {$V$ (L)};
\draw[->] (0,0) -- (0,4.5) node[above] {$p$ (atm)};
\foreach \x in {1,...,6} \node[below] at (\x,0) {\small $\x$};
\foreach \y/\t in {1.2/1{,}0,2.4/2{,}0,3.6/3{,}0} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=0.86:6, samples=60, smooth] plot (\x, {3.6/\x});
\foreach \x/\y in {1/3.6,2/1.8,3/1.2,4/0.9,5/0.72} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

La costante $p \cdot V$ cresce con la temperatura: a temperatura più alta le particelle sono più veloci e, a parità di volume, la pressione è più grande. Per ogni temperatura c'è una curva, chiamata **isoterma**, e le isoterme delle temperature più alte stanno più lontane dagli assi.

```tikz
% nome: boyle-isoterme
% alt: Tre isoterme dello stesso gas nel grafico pressione-volume: tre rami di iperbole, uno dentro l'altro; quello più vicino agli assi è alla temperatura più bassa T1, quello più lontano alla temperatura più alta T3
% svg: boyle-isoterme-d7659d38.svg 228x188
% poi-interattivo: cambiare la temperatura con un cursore e vedere l'isoterma allontanarsi dagli assi
\begin{tikzpicture}
\draw[->] (0,0) -- (5.2,0) node[right] {$V$};
\draw[->] (0,0) -- (0,4.2) node[above] {$p$};
\draw[thick, blue!60, domain=0.385:4.3, samples=60, smooth] plot (\x, {1.5/\x});
\draw[thick, orange!90!black, domain=0.77:4.3, samples=60, smooth] plot (\x, {3/\x});
\draw[thick, red!80!black, domain=1.155:4.3, samples=60, smooth] plot (\x, {4.5/\x});
\node[right, blue!60] at (4.3,0.349) {$T_1$};
\node[right, orange!90!black] at (4.3,0.698) {$T_2$};
\node[right, red!80!black] at (4.3,1.047) {$T_3$};
\node[right] at (2.4,3.2) {\small $T_1 < T_2 < T_3$};
\end{tikzpicture}
```
```grafico
% nome: boyle-isoterma-prodotto-cursore
% alt: Un'isoterma nel grafico pressione-volume, il ramo di iperbole p uguale a k diviso V, con il cursore di k, il valore del prodotto p per V, da 1 a 6 atmosfere per litro, e l'isoterma della tabella, con k uguale a 3,0, tratteggiata per confronto: quando k cresce, come succede scaldando il gas, la curva si allontana dagli assi. Un punto segna lo stato del gas a 2 litri, e sotto il piano si legge la sua pressione
curva: y=\frac{k}{x}
curva: y=\frac{3}{x} | tratteggiata | grigio
curva: A=\left(2;\frac{k}{2}\right) | nero
cursore: k = 4,5 da 1 a 6 passo 0,1
finestra: x da 0 a 6, y da 0 a 5
forma: 6:5
assi: V (L), p (atm)
valore: p_A = \frac{k}{2}
domanda: Il cursore $k$ è il prodotto $p \cdot V$, che cresce con la temperatura. Portalo da $3$ a $6$: di quanto cambia la pressione nel punto $A$, a $2\,\text{L}$?
```

Un grafico curvo non si legge bene a occhio: non è facile dire se una curva è proprio un'iperbole. Per controllare una legge di proporzionalità inversa si mette sull'asse orizzontale l'inverso del volume, $1/V$: se $p \cdot V$ è costante, allora $p = \text{costante} \cdot \dfrac{1}{V}$, e i punti stanno su una retta che passa per l'origine.

```tikz
% nome: boyle-pressione-inverso-volume
% alt: Grafico della pressione in funzione dell'inverso del volume per i dati della tabella: sull'asse orizzontale 1 su V da 0 a 1 litri alla meno uno, sull'asse verticale p in atmosfere; i cinque punti stanno su una retta che passa per l'origine
% svg: boyle-pressione-inverso-volume-37f395d8.svg 275x234
% poi-interattivo: passare con un bottone dal grafico di p in funzione di V a quello di p in funzione di 1/V, con i punti che si spostano sulla retta
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=1, ystep=0.6] (0,0) grid (5.5,4.2);
\draw[->] (0,0) -- (6,0);
\node[below] at (5.7,-0.35) {$\frac{1}{V}$ (L$^{-1}$)};
\draw[->] (0,0) -- (0,4.5) node[above] {$p$ (atm)};
\foreach \x/\t in {1/0{,}2,2/0{,}4,3/0{,}6,4/0{,}8,5/1{,}0} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.2/1{,}0,2.4/2{,}0,3.6/3{,}0} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (5.5,3.96);
\foreach \x/\y in {5/3.6,2.5/1.8,1.667/1.2,1.25/0.9,1/0.72} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

## Il sub e il respiro

```ad-example
Esempio 4: la bolla del sub
Un sub, a $20\,\text{m}$ di profondità, espira una bolla d'aria di $1{,}5\,\text{cm}^3$. Nell'acqua la pressione cresce di circa $1\,\text{atm}$ ogni $10\,\text{m}$ di profondità, e in superficie c'è la pressione atmosferica, $1{,}0\,\text{atm}$. Quanto è grande la bolla quando arriva in superficie, se la temperatura dell'acqua è la stessa?

A $20\,\text{m}$ la pressione è quella atmosferica più quella di $20\,\text{m}$ d'acqua: $p_1 = 1{,}0 + 2{,}0 = 3{,}0\,\text{atm}$. In superficie $p_2 = 1{,}0\,\text{atm}$:

$$V_2 = \frac{p_1\,V_1}{p_2} = \frac{3{,}0\,\text{atm} \cdot 1{,}5\,\text{cm}^3}{1{,}0\,\text{atm}} = 4{,}5\,\text{cm}^3$$

La bolla triplica il suo volume salendo. Per lo stesso motivo un sub che respira aria dalle bombole non deve mai risalire trattenendo il fiato: l'aria nei polmoni si espanderebbe come la bolla.
```

```ad-warning
La pressione sott'acqua comprende quella atmosferica
A $20\,\text{m}$ di profondità la pressione non è $2{,}0\,\text{atm}$, ma $3{,}0\,\text{atm}$: all'acqua sopra la bolla si aggiunge l'aria sopra l'acqua. Con $2{,}0\,\text{atm}$ la bolla in superficie verrebbe di $3{,}0\,\text{cm}^3$ invece che di $4{,}5\,\text{cm}^3$.
```

La legge di Boyle spiega anche il respiro. Per inspirare, il diaframma si abbassa e il volume dei polmoni aumenta: la pressione dell'aria nei polmoni diventa un po' più bassa di quella atmosferica, e l'aria entra. Per espirare succede il contrario.

```ad-note
Quando la legge di Boyle non basta
La legge vale per il gas ideale. A pressioni molto alte le particelle di un gas reale sono così vicine che il loro volume e le loro attrazioni non sono più trascurabili, e il prodotto $p \cdot V$ smette di essere costante. Un gas che si comprime molto, se la temperatura non è troppo alta, alla fine diventa liquido: è così che si riempiono le bombole di gas da campeggio.
```
