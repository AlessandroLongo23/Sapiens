# Il volume molare

Una mole di idrogeno pesa $2{,}02\ \mathrm{g}$, una mole di anidride carbonica $44{,}01\ \mathrm{g}$: più di venti volte tanto. Eppure, alla stessa temperatura e alla stessa pressione, le due moli occupano esattamente lo stesso volume, e lo stesso vale per una mole di qualunque altro gas. Questo volume si chiama volume molare, e permette di passare dal volume di un gas, che si misura con una siringa o un cilindro graduato, al numero di moli, senza pesare niente.

## Una mole di gas, sempre lo stesso volume

Il [principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro) dice che volumi uguali di gas diversi, alla stessa temperatura e alla stessa pressione, contengono lo stesso numero di molecole. Letto al contrario: lo stesso numero di molecole di gas, alla stessa temperatura e pressione, occupa lo stesso volume, qualunque sia il gas. Una mole è un numero fisso di molecole, $N_A = 6{,}02 \cdot 10^{23}$ (vedi [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)), quindi una mole di qualunque gas occupa lo stesso volume.

Il motivo sta nel modello del gas della [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare): in un gas le molecole sono lontanissime tra loro rispetto alle loro dimensioni, e il volume del gas è quasi tutto spazio vuoto. Che una molecola sia piccola come quella dell'idrogeno o più grande come quella dell'anidride carbonica non cambia lo spazio che il gas occupa; conta solo quante molecole ci sono.

Il **volume molare** $V_m$ è il volume occupato da una mole di gas:

$$V_m = \frac{V}{n}$$

e si misura in litri per mole ($\mathrm{L/mol}$). Dipende dalla temperatura e dalla pressione, perché un gas si dilata quando si scalda e si comprime quando aumenta la pressione. Per questo si fissano delle condizioni di riferimento: le **condizioni normali**, temperatura $0\,^\circ\text{C}$ (cioè $273\,\text{K}$) e pressione $1\,\text{atm}$. In condizioni normali il volume molare di ogni gas è

$$V_m = 22{,}4\,\text{L/mol}$$

```tikz
% nome: volume-molare-tre-gas
% alt: Tre recipienti cubici uguali, ciascuno di 22,4 litri, a 0 gradi Celsius e 1 atmosfera. Il primo contiene idrogeno, il secondo ossigeno, il terzo anidride carbonica: in tutti c'è lo stesso numero di molecole, disegnate come piccoli gruppi di atomi, ma le masse sono diverse, 2,02 grammi, 32,00 grammi e 44,01 grammi
% svg: volume-molare-tre-gas-dc7f9aec.svg 338x180
\begin{tikzpicture}
\foreach \x/\gas/\m in {0/{H$_2$}/{$2{,}02$ g}, 3.2/{O$_2$}/{$32{,}00$ g}, 6.4/{CO$_2$}/{$44{,}01$ g}} {
  \draw[thick] (\x,0) rectangle ++(2.4,2.4);
  \node[above] at (\x+1.2,2.4) {$22{,}4$ L};
  \node[below] at (\x+1.2,0) {\gas};
  \node[below] at (\x+1.2,-0.45) {\m};
}
\foreach \px/\py in {0.55/0.6, 1.5/0.45, 1.95/1.25, 0.7/1.55, 1.45/1.95, 1.2/1.1} {
  \draw[fill=blue!10] (\px-0.08,\py) circle (0.08);
  \draw[fill=blue!10] (\px+0.08,\py) circle (0.08);
  \draw[fill=red!40] (3.2+\px-0.11,\py) circle (0.12);
  \draw[fill=red!40] (3.2+\px+0.11,\py) circle (0.12);
  \draw[fill=red!40] (6.4+\px-0.22,\py) circle (0.11);
  \draw[fill=red!40] (6.4+\px+0.22,\py) circle (0.11);
  \draw[fill=gray!50] (6.4+\px,\py) circle (0.12);
}
\node at (4.4,-1.45) {1 mol di ogni gas, a $0\,^\circ$C e 1 atm};
\end{tikzpicture}
```

Il volume molare vale per i gas, e solo per loro. Nei liquidi e nei solidi le particelle sono a contatto, e il volume di una mole dipende dalla loro grandezza: una mole d'acqua liquida, $18{,}02\ \mathrm{g}$, occupa circa $18\ \mathrm{mL}$, più di mille volte meno di una mole di vapore.

```ad-note
Altre condizioni di riferimento
Il valore $22{,}4\,\text{L/mol}$ vale a $0\,^\circ\text{C}$ e $1\,\text{atm}$, le condizioni normali dei libri di scuola. Alcuni libri e le tabelle internazionali usano altre condizioni: a $25\,^\circ\text{C}$ e $1\,\text{atm}$ il volume molare è $24{,}5\,\text{L/mol}$; nelle condizioni standard della IUPAC, $0\,^\circ\text{C}$ e $1\,\text{bar}$ (un po' meno di $1\,\text{atm}$), è $22{,}7\,\text{L/mol}$. Prima di usare un volume molare controlla sempre a quale temperatura e pressione si riferisce. Per le altre condizioni c'è [l'equazione di stato dei gas ideali](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/l-equazione-di-stato-dei-gas-ideali).
```

## Dal volume alle moli e viceversa

Se una mole occupa $22{,}4\,\text{L}$, un volume $V$ di gas in condizioni normali contiene

$$n = \frac{V}{V_m} \qquad V = n \cdot V_m$$

con $V$ in litri e $V_m = 22{,}4\,\text{L/mol}$. Insieme alle relazioni della lezione sulla mole, $n = m/M$ e $N = n \cdot N_A$, si passa da una qualunque di queste grandezze a un'altra, sempre attraverso le moli.

```tikz
% nome: volume-molare-mappa-conversioni
% alt: Schema delle conversioni con le moli al centro. A sinistra la massa in grammi, a destra il volume del gas in litri in condizioni normali, sotto il numero di particelle. Dalla massa alle moli si divide per la massa molare M e dalle moli alla massa si moltiplica; dalle moli al volume si moltiplica per 22,4 litri per mole e dal volume alle moli si divide; dalle moli alle particelle si moltiplica per il numero di Avogadro e al contrario si divide
% svg: volume-molare-mappa-conversioni-73ba7a2b.svg 397x145
\begin{tikzpicture}
\node[draw, thick, minimum width=2.1cm, minimum height=0.8cm] (m) at (0,0) {massa $m$};
\node[draw, thick, fill=orange!15, minimum width=2.1cm, minimum height=0.8cm] (n) at (4,0) {moli $n$};
\node[draw, thick, minimum width=2.1cm, minimum height=0.8cm] (V) at (8,0) {volume $V$};
\node[draw, thick, minimum width=2.1cm, minimum height=0.8cm] (N) at (4,-2.6) {particelle $N$};
\draw[-{Stealth}, thick] (1.05,0.2) -- (2.95,0.2) node[midway, above] {$: M$};
\draw[-{Stealth}, thick] (2.95,-0.2) -- (1.05,-0.2) node[midway, below] {$\cdot M$};
\draw[-{Stealth}, thick] (5.05,0.2) -- (6.95,0.2) node[midway, above] {$\cdot\, 22{,}4$};
\draw[-{Stealth}, thick] (6.95,-0.2) -- (5.05,-0.2) node[midway, below] {$: 22{,}4$};
\draw[-{Stealth}, thick] (3.8,-0.4) -- (3.8,-2.2) node[midway, left] {$\cdot N_A$};
\draw[-{Stealth}, thick] (4.2,-2.2) -- (4.2,-0.4) node[midway, right] {$: N_A$};
\node[below] at (8,-0.45) {\small gas, $0\,^\circ$C e 1 atm};
\end{tikzpicture}
```

```ad-example
Esempio 1: dal volume alla massa
Quanti grammi pesano $5{,}60\,\text{L}$ di metano, $\mathrm{CH_4}$, in condizioni normali?

Prima le moli:
$$n = \frac{V}{V_m} = \frac{5{,}60\,\text{L}}{22{,}4\,\text{L/mol}} = 0{,}250\,\text{mol}$$
Poi la massa, con $M = 12{,}01 + 4 \cdot 1{,}01 = 16{,}05\ \mathrm{g/mol}$:
$$m = n \cdot M = 0{,}250\,\text{mol} \cdot 16{,}05\ \mathrm{g/mol} = 4{,}01\ \mathrm{g}$$
```

```ad-example
Esempio 2: dalla massa al volume
Che volume occupano $88{,}0\ \mathrm{g}$ di anidride carbonica in condizioni normali?

Con $M = 44{,}01\ \mathrm{g/mol}$:
$$n = \frac{88{,}0\ \mathrm{g}}{44{,}01\ \mathrm{g/mol}} = 2{,}00\,\text{mol} \qquad V = n \cdot V_m = 2{,}00\,\text{mol} \cdot 22{,}4\,\text{L/mol} = 44{,}8\,\text{L}$$
È più di quanto stia in due secchi da $20$ litri.
```

```ad-example
Esempio 3: quante molecole in un litro
Quante molecole di azoto ci sono in $1{,}00\,\text{L}$ di azoto in condizioni normali?

$$n = \frac{1{,}00\,\text{L}}{22{,}4\,\text{L/mol}} = 0{,}04464\,\text{mol} \qquad N = n \cdot N_A = 0{,}04464 \cdot 6{,}02 \cdot 10^{23} = 2{,}69 \cdot 10^{22}$$
Lo stesso numero vale per un litro di qualunque altro gas nelle stesse condizioni.
```

```ad-warning
Usare 22,4 L/mol fuori dalle condizioni normali
Il valore $22{,}4\,\text{L/mol}$ vale solo a $0\,^\circ\text{C}$ e $1\,\text{atm}$. Un gas a $25\,^\circ\text{C}$, o in una bombola a $200\,\text{atm}$, ha un altro volume molare: in quei casi si usa l'equazione di stato dei gas ideali.
```

```ad-warning
Usare il volume molare per un liquido o un solido
Una mole d'acqua liquida non occupa $22{,}4\,\text{L}$ ma circa $18\,\text{mL}$. Il volume molare uguale per tutti vale solo per le sostanze allo stato gassoso.
```

## La densità di un gas

La densità di un gas, massa diviso volume, si ricava dalla massa molare: una mole ha massa $M$ e, in condizioni normali, volume $22{,}4\,\text{L}$, quindi

$$d = \frac{M}{V_m}$$

in grammi per litro. La densità di un gas è proporzionale alla sua massa molare: a parità di condizioni, un gas con molecole più pesanti è più denso.

| Gas | $M$ ($\mathrm{g/mol}$) | $d$ a $0\,^\circ\text{C}$ e $1\,\text{atm}$ ($\mathrm{g/L}$) |
|---|---|---|
| Idrogeno, $\mathrm{H_2}$ | $2{,}02$ | $0{,}0902$ |
| Metano, $\mathrm{CH_4}$ | $16{,}05$ | $0{,}717$ |
| Azoto, $\mathrm{N_2}$ | $28{,}02$ | $1{,}25$ |
| Ossigeno, $\mathrm{O_2}$ | $32{,}00$ | $1{,}43$ |
| Anidride carbonica, $\mathrm{CO_2}$ | $44{,}01$ | $1{,}96$ |
| Cloro, $\mathrm{Cl_2}$ | $70{,}90$ | $3{,}17$ |

L'aria, una miscela soprattutto di azoto e ossigeno, ha una densità di circa $1{,}29\ \mathrm{g/L}$ in condizioni normali. Un gas più leggero dell'aria sale, come il metano che esce da un fornello; uno più pesante si accumula in basso, come l'anidride carbonica in fondo a una grotta o in una cantina dove fermenta il mosto.

```ad-example
Esempio 4: la densità dell'anidride carbonica
Qual è la densità dell'anidride carbonica in condizioni normali? È più o meno densa dell'aria?

$$d = \frac{M}{V_m} = \frac{44{,}01\ \mathrm{g/mol}}{22{,}4\,\text{L/mol}} = 1{,}96\ \mathrm{g/L}$$
È più densa dell'aria ($1{,}29\ \mathrm{g/L}$): circa una volta e mezza.
```

Girando la formula, $M = d \cdot V_m$: misurando la densità di un gas sconosciuto si trova la sua massa molare. È uno dei modi per arrivare alla formula molecolare di un composto, come nella lezione [Composizione percentuale, formula minima e formula molecolare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/composizione-percentuale-formula-minima-e-formula-molecolare).

```ad-example
Esempio 5: un gas sconosciuto
Un idrocarburo gassoso ha formula minima $\mathrm{CH_2}$, e in condizioni normali la sua densità è $1{,}25\ \mathrm{g/L}$. Qual è la sua formula molecolare?

La massa molare è
$$M = d \cdot V_m = 1{,}25\ \mathrm{g/L} \cdot 22{,}4\,\text{L/mol} = 28{,}0\ \mathrm{g/mol}$$
La formula minima $\mathrm{CH_2}$ ha massa $12{,}01 + 2 \cdot 1{,}01 = 14{,}03\ \mathrm{g/mol}$, quindi $n = 28{,}0 / 14{,}03 = 2{,}00$, e la formula molecolare è $\mathrm{C_2H_4}$: è l'etene (etilene).
```

```ad-warning
Dividere al contrario
La densità è $M / V_m$, non $V_m / M$: per l'anidride carbonica $22{,}4 / 44{,}01$ darebbe $0{,}509$, e la farebbe più leggera dell'aria. Il controllo con le unità: $\mathrm{g/mol}$ diviso $\mathrm{L/mol}$ dà $\mathrm{g/L}$.
```
