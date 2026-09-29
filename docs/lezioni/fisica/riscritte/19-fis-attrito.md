# Le forze di attrito

Prova a spingere un armadio pesante: all'inizio non si muove, anche se spingi sempre più forte; poi di colpo parte, e a quel punto per tenerlo in movimento serve meno forza di quella che è servita per smuoverlo. Quello che si oppone alla tua spinta è l'attrito, una forza di contatto tra il fondo dell'armadio e il pavimento. Senza attrito non potresti camminare, le auto non frenerebbero e i chiodi non terrebbero; con troppo attrito i motori si consumano e scaldano.

## L'attrito radente

Quando un corpo striscia su una superficie, o è spinto a strisciare, tra le due superfici agisce una forza che si oppone allo strisciamento: l'**attrito radente**. Nasce dalle irregolarità delle due superfici, che anche quando sembrano lisce si incastrano e aderiscono tra loro in molti punti microscopici.

La forza di attrito radente è parallela alla superficie di contatto e ha il verso opposto a quello in cui il corpo si muove, o in cui si muoverebbe se l'attrito non ci fosse. Ci sono due casi:

- l'**attrito statico** agisce quando il corpo è fermo: è quello che tiene fermo l'armadio mentre lo spingi;
- l'**attrito dinamico** agisce quando il corpo striscia: è quello che senti mentre l'armadio scivola.

Tutti e due dipendono da quanto il corpo preme sulla superficie.

## La forza premente

La **forza premente** $F_\perp$ è la forza con cui il corpo preme sulla superficie, perpendicolarmente a essa. Un corpo appoggiato su un pavimento orizzontale, senza altre forze verticali, preme con il suo [peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa): $F_\perp = P = m \cdot g$. Ma se qualcuno spinge il corpo verso il basso, la forza premente cresce; se il corpo è premuto contro una parete, la forza premente è la spinta contro la parete, e il peso non c'entra.

```tikz
% nome: forza-premente-tre-casi
% alt: Tre blocchi: il primo appoggiato sul pavimento, con il peso P verso il basso, preme con F perpendicolare uguale a P; il secondo appoggiato sul pavimento e spinto verso il basso da una forza F sulla faccia superiore preme con P più F; il terzo premuto contro una parete verticale da una forza orizzontale F preme sulla parete con F perpendicolare uguale a F
% svg: forza-premente-tre-casi-6e2b378f.svg 298x113
\begin{tikzpicture}
\draw[thick] (-0.9,0) -- (1.2,0);
\foreach \x in {-0.75,-0.6,...,1.2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (-0.35,0) rectangle (0.65,0.7);
\draw[-{Stealth}, thick, red] (0.15,0.35) -- (0.15,-0.55) node[right] {$\vec{P}$};
\fill (0.15,0.35) circle (1.5pt);
\node at (0.15,-1.05) {\small $F_\perp = P$};
\draw[thick] (2,0) -- (4.1,0);
\foreach \x in {2.15,2.3,...,4.1} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (2.55,0) rectangle (3.55,0.7);
\draw[-{Stealth}, thick, red] (3.05,1.55) -- (3.05,0.7) node[above right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (3.05,0.35) -- (3.05,-0.55) node[right] {$\vec{P}$};
\fill (3.05,0.35) circle (1.5pt);
\node at (3.05,-1.05) {\small $F_\perp = P + F$};
\draw[thick] (5.2,1.6) -- (5.2,-0.6);
\foreach \y in {1.45,1.3,...,-0.6} \draw[thin] (5.2,\y) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (5.2,0.2) rectangle (5.9,1.2);
\draw[-{Stealth}, thick, red] (6.85,0.7) -- (5.9,0.7) node[above right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (5.55,0.7) -- (5.55,-0.2) node[right] {$\vec{P}$};
\fill (5.55,0.7) circle (1.5pt);
\node at (5.8,-1.05) {\small $F_\perp = F$};
\end{tikzpicture}
```

```ad-warning
La forza premente non è sempre il peso
$F_\perp = m \cdot g$ vale solo per un corpo su una superficie orizzontale senza altre forze verticali. Se una mano lo spinge verso il basso o lo tira verso l'alto, se è premuto contro una parete o se sta su un [piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato), la forza premente è un'altra: va trovata ogni volta.
```

## L'attrito statico

Spingi l'armadio con una forza orizzontale $\vec{F}$ che parte da zero e cresce piano. Finché l'armadio resta fermo, l'attrito statico $\vec{F}_s$ ha lo stesso modulo della tua spinta e verso opposto: se spingi con $50\,\text{N}$, l'attrito vale $50\,\text{N}$; se spingi con $70\,\text{N}$, vale $70\,\text{N}$. L'attrito statico si adatta alla forza che deve contrastare.

```tikz
% nome: attrito-statico-blocco-fermo
% alt: Un blocco fermo sul pavimento, spinto verso destra da una forza F: l'attrito statico Fs ha lo stesso modulo e verso opposto, verso sinistra, e le due frecce hanno la stessa lunghezza
% svg: attrito-statico-blocco-fermo-1b484e8c.svg 155x36
\begin{tikzpicture}
\draw[thick] (-2,0) -- (2,0);
\foreach \x in {-1.85,-1.7,...,2} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (-0.5,0) rectangle (0.5,0.7);
\draw[-{Stealth}, thick, red] (0,0.35) -- (1.3,0.35) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (0,0.35) -- (-1.3,0.35) node[left] {$\vec{F}_s$};
\fill (0,0.35) circle (1.5pt);
\end{tikzpicture}
```

L'attrito statico però non può crescere oltre un valore massimo, che è proporzionale alla forza premente:

$$F_s \le \mu_s \cdot F_\perp$$

Il numero $\mu_s$ è il **coefficiente di attrito statico**. Dipende dai materiali delle due superfici e da come sono lavorate (lisce, ruvide, bagnate, oliate), ed è un numero puro, senza unità di misura, perché è il rapporto tra due forze. Quando la spinta supera $\mu_s \cdot F_\perp$ l'attrito statico non basta più, e il corpo comincia a strisciare.

```ad-warning
L'attrito statico non è sempre al massimo
$\mu_s \cdot F_\perp$ è il valore più grande che l'attrito statico può avere, non il valore che ha. Un armadio fermo spinto con $50\,\text{N}$ ha un attrito di $50\,\text{N}$, anche se il suo attrito massimo è $78\,\text{N}$; se nessuno lo spinge, l'attrito è zero.
```

## L'attrito dinamico

Quando il corpo striscia, l'attrito diventa **attrito dinamico** $\vec{F}_d$. Ha il verso opposto a quello del moto del corpo rispetto alla superficie, e il suo modulo non dipende dalla spinta, ma solo dalla forza premente:

$$F_d = \mu_d \cdot F_\perp$$

Il numero $\mu_d$ è il **coefficiente di attrito dinamico**. Per le stesse due superfici è di solito più piccolo di $\mu_s$: per questo l'armadio, una volta partito, si spinge con meno fatica. In buona approssimazione $F_d$ non dipende dalla velocità del corpo, né dall'estensione della superficie di contatto: una cassa appoggiata sul lato grande o sul lato piccolo ha lo stesso attrito.

| Superfici (asciutte) | $\mu_s$ | $\mu_d$ |
|---|---|---|
| vetro su vetro | da $0{,}9$ a $1{,}0$ | $0{,}4$ |
| legno su legno | $0{,}62$ | $0{,}48$ |
| alluminio su acciaio | $0{,}61$ | $0{,}47$ |
| ghiaccio su ghiaccio, a $0\,^\circ\text{C}$ | $0{,}1$ | $0{,}02$ |
| teflon su teflon | $0{,}04$ | $0{,}04$ |

I valori sono indicativi: cambiano molto con lo stato delle superfici, e ogni tabella dà numeri un po' diversi.

```ad-example
Esempio 1: la cassa sul pavimento
Una cassa di $20\,\text{kg}$ è ferma su un pavimento orizzontale; i coefficienti di attrito sono $\mu_s = 0{,}40$ e $\mu_d = 0{,}30$. Quanto vale l'attrito se la cassa viene spinta orizzontalmente con $50\,\text{N}$? E con $90\,\text{N}$?

Il pavimento è orizzontale e non ci sono altre forze verticali, quindi la forza premente è il peso:

$$F_\perp = m \cdot g = 20\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 196\,\text{N}$$

L'attrito statico massimo e l'attrito dinamico sono

$$
\begin{aligned}
F_{s,\max} &= \mu_s \cdot F_\perp = 0{,}40 \cdot 196\,\text{N} = 78{,}4\,\text{N} \approx 78\,\text{N} \\
F_d &= \mu_d \cdot F_\perp = 0{,}30 \cdot 196\,\text{N} = 58{,}8\,\text{N} \approx 59\,\text{N}
\end{aligned}
$$

Con la spinta di $50\,\text{N}$, minore di $78\,\text{N}$, la cassa resta ferma, e l'attrito statico vale $50\,\text{N}$, come la spinta. Con la spinta di $90\,\text{N}$, maggiore di $78\,\text{N}$, la cassa parte, e mentre striscia l'attrito è quello dinamico, $59\,\text{N}$.
```

Il grafico dell'attrito in funzione della spinta, per la cassa dell'esempio 1, riassume tutto: finché la cassa è ferma l'attrito cresce come la spinta, lungo la bisettrice; quando la spinta supera $78\,\text{N}$ la cassa parte, e l'attrito scende a $59\,\text{N}$ e resta lì.

```tikz
% nome: grafico-attrito-spinta
% alt: Il grafico della forza di attrito in funzione della spinta per la cassa dell'esempio 1: un tratto rettilineo dall'origine fino a 78 newton, dove la spinta e l'attrito statico sono uguali, poi un salto verso il basso fino all'attrito dinamico di 59 newton, che resta costante anche per spinte più grandi
% svg: grafico-attrito-spinta-fa9bc0dd.svg 228x166
% poi-interattivo: far crescere la spinta e vedere il punto salire lungo la bisettrice e poi scendere all'attrito dinamico
\begin{tikzpicture}[x=0.03cm, y=0.03cm]
\draw[gray!25, very thin] (0,0) grid[step=20] (120,100);
\draw[->] (0,0) -- (132,0) node[right] {\small $F$ (N)};
\draw[->] (0,0) -- (0,112) node[above] {\small attrito (N)};
\foreach \x in {20,40,60,80,100,120} \node[below] at (\x,0) {\scriptsize $\x$};
\foreach \y in {20,40,60,80,100} \node[left] at (0,\y) {\scriptsize $\y$};
\node[below left] at (0,0) {\scriptsize $0$};
\draw[thick, blue] (0,0) -- (78.4,78.4);
\draw[dashed, thin, blue] (78.4,78.4) -- (78.4,58.8);
\draw[thick, blue] (78.4,58.8) -- (120,58.8);
\fill[blue] (78.4,78.4) circle (1.5pt);
\node[above left] at (78.4,78.4) {\scriptsize $F_{s,\max}$};
\node[above] at (104,58.8) {\scriptsize $F_d$};
\node[right] at (20,50) {\scriptsize ferma};
\node[below] at (104,58.8) {\scriptsize striscia};
\end{tikzpicture}
```

Nella figura qui sotto puoi far crescere tu la spinta su un blocco e guardare quando parte.

```interattivo
% nome: attrito-blocco-spinta
% alt: Un blocco di 5 chilogrammi su un pavimento, spinto verso destra da una forza F che si cambia con un cursore da 0 a 40 newton; sotto, il grafico dell'attrito in funzione della spinta si disegna mentre si procede. Finché la spinta non supera l'attrito statico massimo di 19,6 newton il blocco resta fermo e l'attrito statico è uguale e opposto alla spinta; oltre, il blocco scivola e l'attrito scende all'attrito dinamico di 14,7 newton; un bottone rimette il blocco fermo, e si possono scegliere due coppie di superfici
```

## Trovare i coefficienti di attrito

I coefficienti si misurano con un dinamometro. Si tira il corpo orizzontalmente con il dinamometro, aumentando piano la forza: la lettura più alta prima che il corpo parta è l'attrito statico massimo. Poi si tira il corpo in modo che strisci a velocità costante: in quel caso la spinta e l'attrito dinamico si bilanciano (lo spiega il [primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali)), e il dinamometro legge proprio l'attrito dinamico. Divisi per la forza premente, i due valori danno $\mu_s$ e $\mu_d$.

```ad-example
Esempio 2: il coefficiente di attrito dinamico
Per trascinare una slitta di $12\,\text{kg}$ a velocità costante su una strada innevata orizzontale serve una forza orizzontale di $29\,\text{N}$. Quanto vale il coefficiente di attrito dinamico?

A velocità costante la forza di $29\,\text{N}$ è uguale all'attrito dinamico. La forza premente è il peso della slitta: $F_\perp = 12\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 117{,}6\,\text{N}$. Quindi

$$\mu_d = \frac{F_d}{F_\perp} = \frac{29\,\text{N}}{117{,}6\,\text{N}} = 0{,}246\ldots \approx 0{,}25$$

Il coefficiente non ha unità: newton diviso newton.
```

```ad-example
Esempio 3: una mano che spinge verso il basso
Un libro di $1{,}5\,\text{kg}$ è appoggiato su un tavolo orizzontale, con $\mu_s = 0{,}50$. Quale forza orizzontale serve per smuoverlo? E se una mano lo preme anche verso il basso con $6{,}0\,\text{N}$?

Senza la mano la forza premente è il peso, $F_\perp = 1{,}5 \cdot 9{,}8\,\text{N} = 14{,}7\,\text{N}$, e l'attrito statico massimo è $0{,}50 \cdot 14{,}7\,\text{N} = 7{,}35\,\text{N} \approx 7{,}4\,\text{N}$: serve una forza di poco più di $7{,}4\,\text{N}$.

Con la mano il libro preme sul tavolo con il suo peso e con la spinta della mano:

$$F_\perp = 14{,}7\,\text{N} + 6{,}0\,\text{N} = 20{,}7\,\text{N}$$

e l'attrito statico massimo diventa $0{,}50 \cdot 20{,}7\,\text{N} = 10{,}35\,\text{N} \approx 10\,\text{N}$.
```

```ad-example
Esempio 4: un libro premuto contro la parete
Un libro di $0{,}50\,\text{kg}$ è tenuto fermo contro una parete verticale da una mano che lo spinge orizzontalmente con $20\,\text{N}$; tra libro e parete $\mu_s = 0{,}40$. Il libro scivola?

Qui la superficie è verticale, e il libro preme sulla parete con la spinta della mano: $F_\perp = 20\,\text{N}$, non il peso. L'attrito statico, parallelo alla parete, può arrivare a

$$F_{s,\max} = 0{,}40 \cdot 20\,\text{N} = 8{,}0\,\text{N}$$

Il peso del libro è $0{,}50 \cdot 9{,}8\,\text{N} = 4{,}9\,\text{N}$, meno di $8{,}0\,\text{N}$: l'attrito statico lo tiene fermo, e vale $4{,}9\,\text{N}$ verso l'alto.
```

## Attrito volvente e attrito viscoso

Quando un corpo rotola, come una ruota o una sfera, al posto dell'attrito radente agisce l'**attrito volvente**, dovuto soprattutto alla piccola deformazione della ruota e del terreno nel punto di contatto. A parità di forza premente è molto più piccolo dell'attrito radente: è per questo che una valigia pesante si trascina a fatica e si tira facilmente sulle rotelle, e che i cuscinetti a sfere riducono l'attrito nei motori. Per l'attrito volvente conta anche la ruota: più il raggio è grande e più la ruota è rigida, meno attrito c'è.

Un corpo che si muove in un fluido, come l'aria o l'acqua, subisce l'**attrito viscoso**. È diverso dall'attrito radente perché dipende dalla velocità: è nullo quando il corpo è fermo rispetto al fluido e cresce quando il corpo va più veloce. Dipende anche dalla forma del corpo e dal fluido: un paracadute aperto frena molto più di un paracadutista raccolto, e muoversi nell'acqua costa più fatica che nell'aria. Le carrozzerie delle auto e gli scafi delle barche hanno forme affusolate per ridurre questo attrito.
