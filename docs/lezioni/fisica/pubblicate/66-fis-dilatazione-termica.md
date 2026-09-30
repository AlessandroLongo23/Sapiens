# La dilatazione termica

Un barattolo di vetro con il coperchio di metallo troppo stretto si apre tenendo il coperchio qualche secondo sotto l'acqua calda: il metallo si allarga più del vetro, e il coperchio si allenta. Quasi tutti i corpi, scaldandosi, diventano un po' più grandi: è la **dilatazione termica**. L'aumento è piccolo, frazioni di millimetro per ogni metro, ma nei binari, nei ponti e nei termometri conta.

## Perché i corpi si dilatano

Le particelle di un solido o di un liquido non stanno ferme: oscillano intorno alla loro posizione. Più alta è la temperatura, più ampie sono le oscillazioni, e in media le particelle stanno un po' più lontane l'una dall'altra. Tutto il corpo, allora, occupa un po' più di spazio. Raffreddandosi fa il contrario, e si contrae.

## La dilatazione lineare

In una sbarra, un filo, una rotaia conta soprattutto la lunghezza. Scaldando una sbarra lunga $l_0$ di $\Delta t$ gradi, le misure mostrano che l'allungamento $\Delta l$ è [direttamente proporzionale](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare) sia alla lunghezza iniziale sia all'aumento di temperatura:

$$\Delta l = \lambda\, l_0\, \Delta t$$

Una sbarra lunga il doppio si allunga il doppio, perché ogni suo metro si allunga allo stesso modo; scaldata il doppio, si allunga il doppio. Il numero $\lambda$ (lambda) è il **coefficiente di dilatazione lineare**, e dipende solo dal materiale. Si misura in $^\circ\text{C}^{-1}$, cioè "per grado": $\lambda = \dfrac{\Delta l}{l_0\,\Delta t}$ è la frazione della lunghezza di cui la sbarra si allunga per ogni grado. Siccome un grado Celsius e un kelvin sono larghi uguali, lo stesso numero vale in $\text{K}^{-1}$.

La lunghezza a caldo è quella iniziale più l'allungamento:

$$l = l_0 + \Delta l = l_0\,(1 + \lambda\,\Delta t)$$

```tikz
% nome: sbarra-allungamento-ingrandito
% alt: Due sbarre orizzontali uguali appoggiate con l'estremo sinistro contro una parete. Quella in alto è fredda, lunga l con zero; quella in basso è scaldata e sporge a destra di un tratto delta l, segnato con una quota, oltre una linea tratteggiata che prolunga l'estremo della sbarra fredda. L'allungamento è disegnato 50 volte più grande di quanto sarebbe nella scala della sbarra
% svg: sbarra-allungamento-ingrandito-99145007.svg 308x121
\begin{tikzpicture}
\draw[thick] (0,-0.3) -- (0,2.3);
\foreach \y in {-0.15,0,...,2.3} \draw[thin] (0,\y) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0,1.4) rectangle (5,1.7);
\draw[thick, fill=orange!25] (0,0.2) rectangle (5.575,0.5);
\draw[dashed, thin] (5,1.4) -- (5,-0.1);
\draw[{Stealth}-{Stealth}, thin] (0,2.0) -- (5,2.0);
\node[above] at (2.5,2.0) {$l_0$};
\draw[{Stealth}-{Stealth}, thin] (5,-0.1) -- (5.575,-0.1);
\node[below] at (5.29,-0.1) {$\Delta l$};
\node[right] at (5.1,1.55) {\small fredda, $t_0$};
\node[right] at (5.65,0.35) {\small calda, $t_0 + \Delta t$};
\end{tikzpicture}
```

Nella figura l'allungamento è esagerato: una sbarra d'alluminio lunga $1{,}000\,\text{m}$, scaldata di $100\,^\circ\text{C}$, si allunga di $2{,}3\,\text{mm}$, e disegnato nella stessa scala della sbarra sarebbe invisibile.

| Materiale | $\lambda$ in $^\circ\text{C}^{-1}$ |
|---|---|
| alluminio | $2{,}3 \cdot 10^{-5}$ |
| ottone | $1{,}9 \cdot 10^{-5}$ |
| rame | $1{,}7 \cdot 10^{-5}$ |
| oro | $1{,}4 \cdot 10^{-5}$ |
| ferro, acciaio, calcestruzzo | $1{,}2 \cdot 10^{-5}$ |
| vetro comune | $8{,}5 \cdot 10^{-6}$ |
| vetro pyrex | $3{,}3 \cdot 10^{-6}$ |
| invar (lega di ferro e nichel) | $1{,}2 \cdot 10^{-6}$ |

Valori a temperatura ambiente, arrotondati a due cifre; per l'acciaio i valori vanno da $1{,}1$ a $1{,}3 \cdot 10^{-5}$ secondo il tipo. I coefficienti sono piccolissimi: per l'acciaio, ogni metro si allunga di $0{,}012\,\text{mm}$ per grado. Il calcestruzzo e il ferro si dilatano quasi allo stesso modo, e per questo il cemento armato, calcestruzzo con dentro sbarre d'acciaio, non si crepa con il caldo e con il freddo.

```ad-example
Esempio 1: il giunto tra due rotaie
Una rotaia d'acciaio lunga $18\,\text{m}$ viene posata a $10\,^\circ\text{C}$. D'estate, al sole, arriva a $50\,^\circ\text{C}$. Di quanto si allunga? Con $\lambda = 1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1}$ e $\Delta t = 50 - 10 = 40\,^\circ\text{C}$:

$$\Delta l = \lambda\, l_0\, \Delta t = 1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1} \cdot 18\,\text{m} \cdot 40\,^\circ\text{C} = 8{,}64 \cdot 10^{-3}\,\text{m} \approx 8{,}6\,\text{mm}$$

Per questo tra una rotaia e l'altra si lasciava uno spazio di qualche millimetro, il giunto, che fa il "tu-tum" dei treni. Senza, le rotaie spingerebbero l'una contro l'altra e si piegherebbero.
```

```ad-warning
$\Delta t$ è una differenza, non la temperatura finale
Nella formula va l'aumento di temperatura, $50 - 10 = 40\,^\circ\text{C}$, non i $50\,^\circ\text{C}$ finali. Con $50$ l'allungamento dell'esempio 1 verrebbe $11\,\text{mm}$, un quarto in più del vero.
```

```ad-example
Esempio 2: il giunto di un ponte
Un ponte d'acciaio è lungo $300\,\text{m}$. In un anno la sua temperatura va da $-15\,^\circ\text{C}$ a $45\,^\circ\text{C}$. Di quanto cambia la sua lunghezza?

$\Delta t = 45 - (-15) = 60\,^\circ\text{C}$, e

$$\Delta l = 1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1} \cdot 300\,\text{m} \cdot 60\,^\circ\text{C} = 0{,}216\,\text{m} \approx 22\,\text{cm}$$

Più di venti centimetri: i ponti lunghi hanno alle estremità dei giunti a pettine, due file di denti d'acciaio che si infilano l'una nell'altra e scorrono.
```

```ad-warning
Le temperature sotto lo zero
Con una temperatura iniziale negativa il $\Delta t$ si calcola con il segno: da $-15\,^\circ\text{C}$ a $45\,^\circ\text{C}$ ci sono $60\,^\circ\text{C}$, non $30$.
```

La formula serve anche al contrario: misurando l'allungamento si trova il coefficiente, e dal coefficiente si riconosce il materiale.

```ad-example
Esempio 3: di che metallo è la sbarra?
Una sbarra lunga $1{,}50\,\text{m}$ a $20\,^\circ\text{C}$ viene scaldata fino a $120\,^\circ\text{C}$, e si allunga di $3{,}45\,\text{mm}$. Di che materiale è fatta?

$$\lambda = \frac{\Delta l}{l_0\,\Delta t} = \frac{3{,}45 \cdot 10^{-3}\,\text{m}}{1{,}50\,\text{m} \cdot 100\,^\circ\text{C}} = 2{,}30 \cdot 10^{-5}\,^\circ\text{C}^{-1}$$

È il coefficiente dell'alluminio. L'allungamento va in metri, come la lunghezza: con i millimetri il coefficiente verrebbe mille volte più grande.
```

Nella figura qui sotto scegli il materiale e scaldi la sbarra: l'allungamento è disegnato ingrandito, e il righello sotto l'estremo libero è in millimetri veri.

```interattivo
% nome: dilatazione-sbarra
% alt: Una sbarra lunga un metro, fissata a una parete con l'estremo sinistro, con un cursore che cambia la temperatura da 20 a 220 gradi Celsius e dei bottoni per scegliere il materiale: alluminio, rame, acciaio, vetro pyrex, invar. L'estremo libero scorre su un righello in millimetri disegnato ingrandito 60 volte rispetto alla sbarra, e una quota segna l'allungamento; sotto sono scritti l'aumento di temperatura, il coefficiente del materiale e l'allungamento calcolato con la formula
```

```ad-note
La dilatazione superficiale
Una lastra si allarga in lunghezza e in larghezza, e la sua area $S_0$ cresce di circa $\Delta S = 2\lambda\, S_0\, \Delta t$: il doppio, perché crescono due lati. Anche un foro nella lastra si allarga, come se fosse fatto dello stesso materiale: è così che un coperchio di metallo si allenta sul barattolo.
```

### La lamina bimetallica

Due strisce di metalli diversi, per esempio ottone e acciaio, saldate l'una sull'altra formano una **lamina bimetallica**. Scaldata, l'ottone si allunga più dell'acciaio, e siccome le due strisce non possono scorrere, la lamina si piega, con l'ottone dalla parte esterna della curva. Raffreddata, torna dritta. Le lamine bimetalliche aprono e chiudono i contatti di molti termostati, nei ferri da stiro e nei forni.

```tikz
% nome: lamina-bimetallica
% alt: Una lamina bimetallica fissata a sinistra a un supporto, fatta di una striscia di ottone sopra e una di acciaio sotto. A sinistra è fredda e dritta; a destra è calda e si piega verso il basso, con l'ottone, che si allunga di più, dalla parte esterna della curva
% svg: lamina-bimetallica-a7b4b35f.svg 303x71
\begin{tikzpicture}
\draw[thick, fill=gray!20] (-0.3,-0.5) rectangle (0,0.6);
\draw[thin, fill=orange!25] (0,0.1) rectangle (3,0.22);
\draw[thin, fill=blue!10] (0,-0.02) rectangle (3,0.1);
\node[above] at (1.5,0.22) {\small ottone};
\node[below] at (1.5,-0.02) {\small acciaio};
\node at (1.5,-0.9) {fredda};
\begin{scope}[xshift=4.6cm]
\draw[thick, fill=gray!20] (-0.3,-0.5) rectangle (0,0.6);
\draw[thin, fill=orange!25] (0,0.1) -- (0,0.22) arc[start angle=90, end angle=70, radius=8.72] -- ++(-110:0.12) arc[start angle=70, end angle=90, radius=8.6] -- cycle;
\draw[thin, fill=blue!10] (0,-0.02) -- (0,0.1) arc[start angle=90, end angle=70, radius=8.6] -- ++(-110:0.12) arc[start angle=70, end angle=90, radius=8.48] -- cycle;
\node at (1.5,-0.9) {calda};
\end{scope}
\end{tikzpicture}
```

## La dilatazione volumica

Un corpo si dilata in tutte le direzioni, e il suo volume $V_0$ cresce di

$$\Delta V = \alpha\, V_0\, \Delta t$$

con il **coefficiente di dilatazione volumica** $\alpha$, detto anche cubico, sempre in $^\circ\text{C}^{-1}$. Per un solido, che si allunga allo stesso modo nelle tre direzioni, $\alpha$ è circa il triplo di $\lambda$:

$$\alpha \approx 3\lambda$$

Per i liquidi conta solo il volume, perché non hanno una forma propria, e si dilatano molto più dei solidi:

| Liquido | $\alpha$ in $^\circ\text{C}^{-1}$ |
|---|---|
| acqua (intorno a $20\,^\circ\text{C}$) | $2{,}1 \cdot 10^{-4}$ |
| mercurio | $1{,}8 \cdot 10^{-4}$ |
| alcol etilico | $7{,}5 \cdot 10^{-4}$ |

Per l'alcol etilico altre tabelle danno $1{,}1 \cdot 10^{-3}$: il valore è da verificare. Il coefficiente dell'acqua cambia molto con la temperatura, come si vede più avanti.

```ad-example
Esempio 4: la colonna di un termometro
Il bulbo di un termometro contiene $0{,}500\,\text{cm}^3$ di mercurio, e il capillare ha una sezione di $0{,}010\,\text{mm}^2$. Di quanto sale la colonna se la temperatura aumenta di $10\,^\circ\text{C}$? Trascura la dilatazione del vetro.

$$\Delta V = \alpha\, V_0\, \Delta t = 1{,}8 \cdot 10^{-4}\,^\circ\text{C}^{-1} \cdot 0{,}500\,\text{cm}^3 \cdot 10\,^\circ\text{C} = 9{,}0 \cdot 10^{-4}\,\text{cm}^3 = 0{,}90\,\text{mm}^3$$

Il mercurio in più riempie un tratto di capillare lungo

$$h = \frac{\Delta V}{S} = \frac{0{,}90\,\text{mm}^3}{0{,}010\,\text{mm}^2} = 90\,\text{mm} = 9{,}0\,\text{cm}$$

Meno di un millimetro cubo di mercurio fa salire la colonna di nove centimetri: è per questo che il capillare è sottile.
```

```ad-example
Esempio 5: una sfera d'acciaio
Una sfera d'acciaio ha il volume di $50\,\text{cm}^3$ a $20\,^\circ\text{C}$. Di quanto aumenta il suo volume a $220\,^\circ\text{C}$?

Il coefficiente volumico è $\alpha \approx 3\lambda = 3 \cdot 1{,}2 \cdot 10^{-5} = 3{,}6 \cdot 10^{-5}\,^\circ\text{C}^{-1}$, e

$$\Delta V = 3{,}6 \cdot 10^{-5}\,^\circ\text{C}^{-1} \cdot 50\,\text{cm}^3 \cdot 200\,^\circ\text{C} = 0{,}36\,\text{cm}^3$$
```

```ad-warning
Il coefficiente lineare in una formula di volume
Per il volume di un solido serve $\alpha \approx 3\lambda$: con il $\lambda$ della tabella, nell'esempio 5 verrebbe $0{,}12\,\text{cm}^3$, un terzo del vero.
```

```ad-note
Anche il recipiente si dilata
Un liquido si scalda sempre dentro un recipiente, che si dilata anche lui. Quello che si vede, per esempio quanto liquido trabocca da un recipiente pieno, è la differenza tra la dilatazione del liquido e quella del recipiente. Il vetro si dilata molto meno dei liquidi, e negli esercizi di solito la sua dilatazione si trascura, dicendolo.
```

## Il comportamento anomalo dell'acqua

L'acqua non segue la regola tra $0$ e $4\,^\circ\text{C}$: in quell'intervallo, scaldandosi, si contrae. Il suo volume è il più piccolo, e la densità la più grande, a circa $4\,^\circ\text{C}$ (più precisamente $3{,}98\,^\circ\text{C}$); sopra, si dilata come gli altri liquidi. Il grafico mostra il volume di un chilogrammo d'acqua, con i valori della densità di Wikipedia, "Water (data page)", letta il 30 settembre 2026 ($999{,}84\,\text{kg/m}^3$ a $0\,^\circ\text{C}$, $999{,}97$ a $4\,^\circ\text{C}$, $999{,}70$ a $10\,^\circ\text{C}$).

```tikz
% nome: acqua-volume-temperatura
% alt: Grafico del volume di un chilogrammo d'acqua in funzione della temperatura, da 0 a 12 gradi Celsius. L'asse verticale parte da 1000 centimetri cubi, non da zero, e arriva a 1000,5. La curva scende da 1000,16 centimetri cubi a 0 gradi fino al minimo di 1000,03 a 4 gradi, poi risale e passa per 1000,30 a 10 gradi; i tre valori misurati sono segnati con un punto
% svg: acqua-volume-temperatura-de30d14f.svg 288x210
% poi-interattivo: spostare un punto sulla curva e leggere volume e densità a ogni temperatura
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=0.8, ystep=0.8] (4.8,4.0);
\draw[->] (0,0) -- (5.2,0) node[right] {$t$ ($^\circ$C)};
\draw[->] (0,0) -- (0,4.4) node[above] {$V$ (cm$^3$)};
\foreach \x/\l in {0.8/2, 1.6/4, 2.4/6, 3.2/8, 4.0/10, 4.8/12} \node[below] at (\x,0) {\small $\l$};
\node[below] at (0,0) {\small $0$};
\foreach \y/\l in {0/{1000{,}0}, 0.8/{1000{,}1}, 1.6/{1000{,}2}, 2.4/{1000{,}3}, 3.2/{1000{,}4}, 4.0/{1000{,}5}} \node[left] at (0,\y) {\small $\l$};
\draw[thick, blue] plot[smooth] coordinates {(0.00,1.258) (0.20,1.004) (0.40,0.787) (0.60,0.605) (0.80,0.457) (1.00,0.343) (1.20,0.263) (1.40,0.215) (1.60,0.200) (1.80,0.217) (2.00,0.266) (2.20,0.345) (2.40,0.455) (2.60,0.595) (2.80,0.764) (3.00,0.963) (3.20,1.190) (3.40,1.446) (3.60,1.729) (3.80,2.041) (4.00,2.379) (4.20,2.744) (4.40,3.136) (4.60,3.554) (4.80,3.998)};
\fill (0,1.284) circle (1.5pt);
\fill (1.6,0.224) circle (1.5pt);
\fill (4.0,2.380) circle (1.5pt);
\end{tikzpicture}
```

Le differenze sono piccole, meno di tre decimillesimi, ma hanno conseguenze grandi. D'inverno, in un lago, l'acqua della superficie si raffredda, diventa più densa e scende; quando tutto il lago è a $4\,^\circ\text{C}$ l'acqua più fredda resta sopra, perché è meno densa, e ghiaccia per prima. Il ghiaccio, con la densità di $917\,\text{kg/m}^3$, è ancora meno denso e galleggia, come spiega la lezione sulla [spinta di Archimede](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-spinta-di-archimede-e-il-galleggiamento). Lo strato di ghiaccio isola l'acqua sotto, che sul fondo resta intorno ai $4\,^\circ\text{C}$: i laghi gelano dall'alto, e i pesci sopravvivono.

Anche il passaggio da acqua a ghiaccio è anomalo: congelando, l'acqua aumenta di volume di circa il $9\%$ ($1000/917 \approx 1{,}09$). Una bottiglia di vetro piena d'acqua dimenticata nel congelatore si rompe, e l'acqua che gela nelle crepe delle rocce le spacca.

```ad-warning
L'acqua scaldata non si dilata sempre
Tra $0$ e $4\,^\circ\text{C}$ l'acqua scaldata si contrae, e la formula $\Delta V = \alpha V_0 \Delta t$ con un $\alpha$ positivo lì non vale. Anche sopra i $4\,^\circ\text{C}$ il coefficiente cambia molto con la temperatura: il valore della tabella vale intorno ai $20\,^\circ\text{C}$.
```
