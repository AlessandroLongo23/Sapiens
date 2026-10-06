# Le leggi di Charles e di Gay-Lussac

Un palloncino gonfiato e messo nel congelatore si sgonfia un po', e torna come prima quando si scalda. Una mongolfiera sale perché l'aria scaldata dal bruciatore si espande e diventa meno densa dell'aria intorno. Una bomboletta spray gettata nel fuoco scoppia. In tutti questi casi il gas cambia temperatura, e con la temperatura cambiano il suo volume o la sua pressione. Le due leggi di questa lezione dicono come, e portano a scoprire lo zero assoluto.

## La legge di Charles: volume e temperatura

Si prende una quantità fissa di gas, in un cilindro chiuso da un pistone libero di scorrere, e lo si scalda. Il pistone sale finché la pressione del gas torna uguale a quella che il pistone e l'aria esterna fanno su di lui: la pressione del gas resta costante. Una trasformazione a pressione costante si chiama **isobara**. Alla fine del Settecento Jacques Charles misurò il volume di diversi gas a temperature diverse, e trovò che il volume cresce in modo lineare con la temperatura in gradi Celsius, allo stesso modo per tutti i gas. Joseph Louis Gay-Lussac fece misure più precise e le pubblicò nel 1802.

Per ogni grado di aumento della temperatura il volume cresce di $1/273$ del volume che il gas ha a $0\,^\circ\text{C}$. Con $V_0$ il volume a $0\,^\circ\text{C}$ e $t$ la temperatura in gradi Celsius:

$$V = V_0 \left(1 + \frac{t}{273}\right)$$

Il grafico del volume in funzione della temperatura in gradi Celsius è una retta. Se la si prolunga verso le temperature basse, incontra l'asse delle temperature a $-273\,^\circ\text{C}$: a quella temperatura il volume del gas diventerebbe zero. Nessun gas ci arriva davvero, perché prima diventa liquido; ma la retta di ogni gas, a qualunque pressione, punta allo stesso punto.

```tikz
% nome: charles-volume-temperatura-celsius
% alt: Grafico del volume di un gas in funzione della temperatura in gradi Celsius, a pressione costante: i quattro punti misurati tra 0 e 150 gradi Celsius stanno su una retta; la retta, prolungata con un tratto tratteggiato verso le temperature basse, incontra l'asse orizzontale a meno 273 gradi Celsius
% svg: charles-volume-temperatura-celsius-40a83e9e.svg 315x239
% poi-interattivo: cambiare la pressione e vedere che la retta cambia pendenza ma incontra l'asse sempre a meno 273 gradi Celsius
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6667, ystep=0.625] (0,0) grid (6.8,4.4);
\draw[->] (0,0) -- (7.2,0);
\node[below] at (7.0,-0.35) {$t$ ($^\circ$C)};
\draw[->] (0,0) -- (0,4.7) node[above] {$V$ (L)};
\foreach \x/\t in {1.333/-200,2.667/-100,4/0,5.333/100,6.667/200} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.25/0{,}5,2.5/1{,}0,3.75/1{,}5} \node[left] at (0,\y) {\small $\t$};
\draw[thick, dashed, blue!60] (0.36,0) -- (4,2.5);
\draw[thick, blue!60] (4,2.5) -- (6.6,4.286);
\foreach \x/\y in {4/2.5,4.667/2.958,5.333/3.416,6.0/3.874} \fill (\x,\y) circle (0.06);
\fill[red] (0.36,0) circle (0.06);
\node[below, red] at (0.42,0) {\small $-273$};
\end{tikzpicture}
```
```grafico
% nome: charles-rette-zero-assoluto-cursore
% alt: La retta del volume in funzione della temperatura in gradi Celsius, con il cursore di V0, il volume a 0 gradi Celsius, da 0,3 a 1,6 litri, e la retta della figura, con V0 uguale a 1,0 litri, tratteggiata per confronto: cambiando V0 la retta cambia pendenza, ma incontra l'asse delle temperature sempre nello stesso punto, a meno 273 gradi Celsius, segnato in rosso
curva: y=a\left(1+\frac{x}{273}\right)
curva: y=1+\frac{x}{273} | tratteggiata | grigio
curva: Z=\left(-273;0\right) | rosso
cursore: a = 1,4 da 0,3 a 1,6 passo 0,1
finestra: x da -300 a 210, y da 0 a 1,8
forma: 4:3
assi: t (°C), V (L)
valore: V_0 = a
domanda: Il cursore $a$ è $V_0$, il volume a $0\,^\circ\text{C}$: a un'altra pressione lo stesso gas ne ha uno diverso. Muovilo: la retta cambia pendenza, ma dove incontra l'asse delle temperature?
```

## Lo zero assoluto e la temperatura in kelvin

La temperatura di $-273\,^\circ\text{C}$ (più precisamente $-273{,}15\,^\circ\text{C}$) è lo **zero assoluto**: la temperatura più bassa possibile, alla quale, come dice la [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare), l'energia cinetica delle particelle sarebbe zero. Lord Kelvin, a metà dell'Ottocento, propose di contare le temperature a partire da lì: è la scala Kelvin, con

$$T = t + 273$$

Nella scala Kelvin la retta del grafico passa per l'origine, e la legge diventa una [proporzionalità diretta](/materiale/scuola-superiore/matematica/relazioni-e-funzioni/proporzionalita-diretta-e-inversa). Sostituendo $t = T - 273$ nella formula di prima, $V = V_0 \cdot T / 273$: il volume è proporzionale alla temperatura assoluta. È la **legge di Charles**: a pressione costante, il volume di una quantità fissa di gas è direttamente proporzionale alla sua temperatura assoluta.

$$\frac{V}{T} = \text{costante} \qquad\qquad \frac{V_1}{T_1} = \frac{V_2}{T_2}$$

Se la temperatura assoluta raddoppia, il volume raddoppia; se diventa un terzo, anche il volume diventa un terzo.

```tikz
% nome: charles-volume-temperatura-kelvin
% alt: Grafico del volume dello stesso gas in funzione della temperatura assoluta, a pressione costante: i quattro punti misurati, tra 273 e 423 kelvin, stanno su una retta che, prolungata con un tratto tratteggiato, passa per l'origine
% svg: charles-volume-temperatura-kelvin-1b420be9.svg 300x239
% poi-interattivo: trascinare il punto dello stato del gas lungo la retta e leggere V, T e il loro rapporto, che resta costante
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6667, ystep=0.625] (0,0) grid (6.4,4.4);
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.35) {$T$ (K)};
\draw[->] (0,0) -- (0,4.7) node[above] {$V$ (L)};
\foreach \x/\t in {1.333/100,2.667/200,4/300,5.333/400} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1.25/0{,}5,2.5/1{,}0,3.75/1{,}5} \node[left] at (0,\y) {\small $\t$};
\draw[thick, dashed, blue!60] (0,0) -- (3.64,2.5);
\draw[thick, blue!60] (3.64,2.5) -- (6.2,4.258);
\foreach \x/\y in {3.64/2.5,4.307/2.958,4.973/3.416,5.64/3.874} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

```ad-example
Esempio 1: il palloncino nel congelatore
Un palloncino contiene $2{,}50\,\text{L}$ d'aria a $25\,^\circ\text{C}$. Lo si mette in un congelatore a $-18\,^\circ\text{C}$. Quale volume occupa l'aria, se la pressione resta la stessa?

Le temperature vanno in kelvin: $T_1 = 25 + 273 = 298\,\text{K}$, $T_2 = -18 + 273 = 255\,\text{K}$. Da $V_1/T_1 = V_2/T_2$:

$$V_2 = V_1 \cdot \frac{T_2}{T_1} = 2{,}50\,\text{L} \cdot \frac{255\,\text{K}}{298\,\text{K}} = 2{,}139\ldots\,\text{L} \approx 2{,}14\,\text{L}$$

La temperatura scende, e il volume diminuisce: il palloncino perde circa un settimo del suo volume.
```

```ad-example
Esempio 2: quando il volume raddoppia
Un gas occupa un certo volume a $27\,^\circ\text{C}$. A quale temperatura bisogna scaldarlo, a pressione costante, perché il suo volume raddoppi?

In kelvin $T_1 = 300\,\text{K}$. Il volume è proporzionale alla temperatura assoluta, quindi anche la temperatura assoluta deve raddoppiare:

$$T_2 = 2 \cdot 300\,\text{K} = 600\,\text{K} \qquad t_2 = 600 - 273 = 327\,^\circ\text{C}$$

Non $54\,^\circ\text{C}$: raddoppiare i gradi Celsius non raddoppia il volume.
```

```ad-warning
Le temperature in gradi Celsius nella formula
Nella legge di Charles la temperatura va sempre in kelvin. Con i gradi Celsius, nell'esempio 1 si avrebbe $V_2 = 2{,}50 \cdot (-18)/25$, un volume negativo, che non ha senso; e da $10$ a $20\,^\circ\text{C}$ il volume sembrerebbe raddoppiare, mentre cresce di circa il $3{,}5\%$ ($293/283 = 1{,}035\ldots$).
```

## La legge di Gay-Lussac: pressione e temperatura

Ora il gas è chiuso in un recipiente rigido, come una bombola o una bomboletta spray: il volume non può cambiare. Una trasformazione a volume costante si chiama **isocora**. Scaldando il gas, la sua pressione cresce, e anche qui in modo lineare con la temperatura, con lo stesso coefficiente $1/273$ per grado. Con la temperatura assoluta si ottiene la **legge di Gay-Lussac**: a volume costante, la pressione di una quantità fissa di gas è direttamente proporzionale alla sua temperatura assoluta.

$$\frac{p}{T} = \text{costante} \qquad\qquad \frac{p_1}{T_1} = \frac{p_2}{T_2}$$

```tikz
% nome: gay-lussac-pressione-temperatura
% alt: Grafico della pressione di un gas in funzione della temperatura assoluta, a volume costante: i quattro punti misurati, da 2,0 atmosfere a 273 kelvin a 3,1 atmosfere a 423 kelvin, stanno su una retta che, prolungata con un tratto tratteggiato, passa per l'origine
% svg: gay-lussac-pressione-temperatura-2d59fe5d.svg 302x216
% poi-interattivo: trascinare il punto dello stato del gas lungo la retta e leggere p, T e il loro rapporto
\begin{tikzpicture}
\draw[gray!25, very thin, xstep=0.6667, ystep=1] (0,0) grid (6.4,3.8);
\draw[->] (0,0) -- (6.8,0);
\node[below] at (6.6,-0.35) {$T$ (K)};
\draw[->] (0,0) -- (0,4.1) node[above] {$p$ (atm)};
\foreach \x/\t in {1.333/100,2.667/200,4/300,5.333/400} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/1{,}0,2/2{,}0,3/3{,}0} \node[left] at (0,\y) {\small $\t$};
\draw[thick, dashed, blue!60] (0,0) -- (3.64,2.0);
\draw[thick, blue!60] (3.64,2.0) -- (6.2,3.407);
\foreach \x/\y in {3.64/2.0,4.307/2.366,4.973/2.733,5.64/3.099} \fill (\x,\y) circle (0.06);
\end{tikzpicture}
```

La spiegazione con le particelle è quella della [pressione](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas): a temperatura più alta le particelle sono più veloci, urtano le pareti più spesso e più forte, e la pressione cresce. Se il pistone è libero, come nella legge di Charles, il gas si espande finché gli urti su ogni centimetro quadrato tornano quelli di prima; se le pareti sono rigide, cresce la pressione.

```ad-example
Esempio 3: le gomme d'estate
La pressione assoluta dell'aria nella gomma di un'auto è $2{,}40\,\text{atm}$ al mattino, a $15\,^\circ\text{C}$. Dopo un viaggio su un'autostrada assolata la gomma è a $45\,^\circ\text{C}$. Quale pressione ha l'aria, se il volume della gomma non cambia?

In kelvin $T_1 = 288\,\text{K}$ e $T_2 = 318\,\text{K}$. Da $p_1/T_1 = p_2/T_2$:

$$p_2 = p_1 \cdot \frac{T_2}{T_1} = 2{,}40\,\text{atm} \cdot \frac{318\,\text{K}}{288\,\text{K}} = 2{,}65\,\text{atm}$$

Per questo la pressione delle gomme si controlla a gomme fredde.
```

```ad-example
Esempio 4: la bomboletta nel fuoco
Una bomboletta spray contiene gas alla pressione di $3{,}0\,\text{atm}$ a $20\,^\circ\text{C}$. Se finisce in un fuoco e arriva a $400\,^\circ\text{C}$, quale pressione raggiunge?

$$p_2 = p_1 \cdot \frac{T_2}{T_1} = 3{,}0\,\text{atm} \cdot \frac{673\,\text{K}}{293\,\text{K}} = 6{,}89\ldots\,\text{atm} \approx 6{,}9\,\text{atm}$$

La pressione più che raddoppia, e la bomboletta può esplodere: è il motivo dell'avvertenza stampata su tutte le bombolette.
```

Nella figura qui sotto scegli quale grandezza tenere costante. Con la pressione costante il pistone è libero: cambia la temperatura e guarda il volume seguire la legge di Charles. Con il volume costante il pistone è bloccato: cambia la temperatura e guarda il manometro seguire la legge di Gay-Lussac. Sul grafico accanto le rette puntano sempre all'origine, lo zero assoluto.

```interattivo
% nome: gas-cilindro-charles
% alt: Un cilindro verticale chiuso da un pistone, con dentro particelle di gas che rimbalzano sulle pareti, un manometro e accanto un piccolo grafico. Si sceglie quale grandezza tenere costante: con la pressione costante il pistone è libero, e un cursore della temperatura da 150 a 600 kelvin fa salire o scendere il pistone, con il punto dello stato che si muove su una retta del grafico volume-temperatura passante per l'origine; con il volume costante il pistone è bloccato, e la temperatura fa cambiare la pressione letta sul manometro, con il punto che si muove sul grafico pressione-temperatura. Le particelle vanno più veloci quando la temperatura sale
```

```ad-warning
Charles o Gay-Lussac
Le due leggi si somigliano, e si confondono. Per scegliere quella giusta guarda che cosa resta costante: se il recipiente può cambiare volume (un palloncino, un pistone libero) resta costante la pressione, e vale la legge di Charles, $V_1/T_1 = V_2/T_2$; se il recipiente è rigido (una bombola, una gomma, una bomboletta) resta costante il volume, e vale la legge di Gay-Lussac, $p_1/T_1 = p_2/T_2$.
```

```ad-note
Prima e seconda legge di Gay-Lussac
I nomi delle due leggi cambiano da un libro all'altro. Molti libri italiani, soprattutto di fisica, le chiamano prima legge di Gay-Lussac (a pressione costante) e seconda legge di Gay-Lussac (a volume costante), e le scrivono con la temperatura in gradi Celsius: $V = V_0\,(1 + \alpha\,t)$ e $p = p_0\,(1 + \alpha\,t)$, con $\alpha = \dfrac{1}{273}\,^\circ\text{C}^{-1}$. Sono le stesse leggi di questa lezione.
```
