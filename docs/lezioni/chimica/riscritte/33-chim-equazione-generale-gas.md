# L'equazione generale dei gas

Nelle leggi di Boyle, di Charles e di Gay-Lussac una delle tre grandezze del gas resta ferma e le altre due cambiano. Fuori dal laboratorio succede di rado: un pallone sonda che sale nell'atmosfera trova una pressione più bassa e una temperatura più bassa, e il suo volume cambia per tutte e due le ragioni insieme. Le tre leggi si possono riunire in una sola, che vale anche quando pressione, volume e temperatura cambiano tutti e tre.

## Dalle tre leggi a una sola

Una quantità fissa di gas passa da uno stato iniziale, con pressione $p_1$, volume $V_1$ e temperatura assoluta $T_1$, a uno stato finale con $p_2$, $V_2$ e $T_2$. Il passaggio si può immaginare in due tappe, perché lo stato finale non dipende dalla strada fatta per arrivarci.

1. Prima si porta la pressione da $p_1$ a $p_2$ tenendo ferma la temperatura $T_1$. Per la [legge di Boyle](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-legge-di-boyle) il volume diventa $V' = \dfrac{p_1\,V_1}{p_2}$.
2. Poi si porta la temperatura da $T_1$ a $T_2$ tenendo ferma la pressione $p_2$. Per la [legge di Charles](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac) il volume diventa $V_2 = V' \cdot \dfrac{T_2}{T_1}$.

Mettendo insieme le due tappe, $V_2 = \dfrac{p_1\,V_1}{p_2} \cdot \dfrac{T_2}{T_1}$, cioè $p_2\,V_2\,T_1 = p_1\,V_1\,T_2$. Dividendo per $T_1\,T_2$ si ottiene l'**equazione generale dei gas**:

$$\frac{p_1\,V_1}{T_1} = \frac{p_2\,V_2}{T_2}$$

In altre parole, per una quantità fissa di gas il rapporto $\dfrac{p\,V}{T}$ ha sempre lo stesso valore, qualunque cosa succeda al gas:

$$\frac{p\,V}{T} = \text{costante}$$

```tikz
% nome: equazione-generale-due-tappe
% alt: Grafico pressione-volume con due isoterme tratteggiate, alla temperatura T1 e alla temperatura più alta T2. Il gas va dallo stato 1, sull'isoterma T1, allo stato 2, sull'isoterma T2, in due tappe: prima lungo l'isoterma T1 fino alla pressione finale, con una freccia blu, poi a pressione costante, con una freccia arancione orizzontale, fino allo stato 2
% svg: equazione-generale-due-tappe-a04f8ca6.svg 280x207
% poi-interattivo: spostare lo stato 2 nel piano e vedere le due tappe che cambiano, mentre p V / T resta lo stesso
\begin{tikzpicture}
\draw[->] (0,0) -- (6.2,0) node[right] {$V$};
\draw[->] (0,0) -- (0,4.4) node[above] {$p$};
\draw[thin, dashed, gray, domain=1.5:5.8, samples=50, smooth] plot (\x, {6/\x});
\draw[thin, dashed, gray, domain=2.25:5.8, samples=50, smooth] plot (\x, {9/\x});
\node[right] at (5.8,1.03) {\small $T_1$};
\node[right] at (5.8,1.55) {\small $T_2$};
\draw[-{Stealth}, thick, blue!60, domain=2:2.95, samples=30, smooth] plot (\x, {6/\x});
\draw[-{Stealth}, thick, orange!90!black] (3,2) -- (4.45,2);
\fill (2,3) circle (0.06) node[above right] {\small $1$};
\fill (3,2) circle (0.06);
\fill (4.5,2) circle (0.06) node[above right] {\small $2$};
\draw[dashed, thin] (0,3) -- (2,3);
\draw[dashed, thin] (0,2) -- (3,2);
\node[left] at (0,3) {$p_1$};
\node[left] at (0,2) {$p_2$};
\draw[dashed, thin] (2,0) -- (2,3);
\draw[dashed, thin] (4.5,0) -- (4.5,2);
\node[below] at (2,0) {$V_1$};
\node[below] at (4.5,0) {$V_2$};
\end{tikzpicture}
```

## Le tre leggi sono casi particolari

Quando una delle tre grandezze non cambia, nell'equazione generale si semplifica, e resta una delle leggi già viste:

| Che cosa resta costante | Trasformazione | Legge | Formula |
|---|---|---|---|
| la temperatura, $T_1 = T_2$ | isoterma | Boyle | $p_1 V_1 = p_2 V_2$ |
| la pressione, $p_1 = p_2$ | isobara | Charles | $V_1/T_1 = V_2/T_2$ |
| il volume, $V_1 = V_2$ | isocora | Gay-Lussac | $p_1/T_1 = p_2/T_2$ |

Basta quindi ricordare l'equazione generale: le altre tre si ottengono cancellando la grandezza che resta costante.

## Come si risolve un problema

1. Scrivi i dati in due colonne, stato 1 e stato 2, con le tre grandezze $p$, $V$ e $T$; una delle sei è l'incognita.
2. Porta le temperature in kelvin: $T = t + 273$.
3. Controlla le unità: le due pressioni nella stessa unità, i due volumi nella stessa unità. Quale unità non importa, perché si semplificano.
4. Ricava l'incognita dall'equazione generale, poi sostituisci i numeri.
5. Controlla il risultato: se la pressione cresce e la temperatura cala, il volume deve diminuire, e così via.

```ad-example
Esempio 1: si cambia tutto
Un gas occupa $5{,}00\,\text{L}$ alla pressione di $1{,}00\,\text{atm}$ e alla temperatura di $27\,^\circ\text{C}$. Lo si comprime fino a $2{,}00\,\text{L}$ e intanto lo si scalda fino a $127\,^\circ\text{C}$. Quale pressione raggiunge?

| | stato 1 | stato 2 |
|---|---|---|
| $p$ | $1{,}00\,\text{atm}$ | $p_2$ |
| $V$ | $5{,}00\,\text{L}$ | $2{,}00\,\text{L}$ |
| $T$ | $27 + 273 = 300\,\text{K}$ | $127 + 273 = 400\,\text{K}$ |

Dall'equazione generale si ricava $p_2$:

$$p_2 = \frac{p_1\,V_1\,T_2}{T_1\,V_2} = \frac{1{,}00\,\text{atm} \cdot 5{,}00\,\text{L} \cdot 400\,\text{K}}{300\,\text{K} \cdot 2{,}00\,\text{L}} = 3{,}33\,\text{atm}$$

Controllo: il volume è diventato $2{,}5$ volte più piccolo e la temperatura assoluta è cresciuta di un terzo; tutte e due le cose fanno crescere la pressione, e infatti $1{,}00 \cdot 2{,}5 \cdot \dfrac{4}{3} = 3{,}33$.
```

```ad-example
Esempio 2: il pallone sonda
Un pallone sonda viene riempito a terra con $4{,}00\,\text{m}^3$ di elio, a $750\,\text{mmHg}$ e $17\,^\circ\text{C}$. A $10\,\text{km}$ di quota la pressione è $200\,\text{mmHg}$ e la temperatura $-53\,^\circ\text{C}$. Quale volume ha l'elio lassù?

In kelvin $T_1 = 290\,\text{K}$ e $T_2 = 220\,\text{K}$. Le pressioni sono tutte e due in millimetri di mercurio, e il volume resta in metri cubi:

$$V_2 = \frac{p_1\,V_1\,T_2}{T_1\,p_2} = \frac{750\,\text{mmHg} \cdot 4{,}00\,\text{m}^3 \cdot 220\,\text{K}}{290\,\text{K} \cdot 200\,\text{mmHg}} = 11{,}37\ldots\,\text{m}^3 \approx 11{,}4\,\text{m}^3$$

La pressione più bassa fa espandere il gas, la temperatura più bassa lo fa contrarre; vince la pressione, che è diventata quasi quattro volte più piccola. Per questo i palloni sonda partono poco gonfi.
```

```ad-example
Esempio 3: trovare la temperatura
Un gas occupa $3{,}00\,\text{L}$ a $1{,}00\,\text{atm}$ e $20\,^\circ\text{C}$. Dopo una trasformazione occupa $1{,}50\,\text{L}$ alla pressione di $2{,}50\,\text{atm}$. Quale temperatura ha, in gradi Celsius?

Dall'equazione generale, moltiplicando in croce, $T_2 = T_1 \cdot \dfrac{p_2\,V_2}{p_1\,V_1}$:

$$T_2 = 293\,\text{K} \cdot \frac{2{,}50\,\text{atm} \cdot 1{,}50\,\text{L}}{1{,}00\,\text{atm} \cdot 3{,}00\,\text{L}} = 366\,\text{K} \qquad t_2 = 366 - 273 = 93\,^\circ\text{C}$$

Il risultato del conto è una temperatura assoluta: per averla in gradi Celsius si tolgono $273$.
```

```ad-warning
Le temperature e le pressioni giuste
Nell'equazione generale la temperatura va in kelvin e la pressione è quella assoluta. Con i gradi Celsius, nell'esempio 1 si avrebbe $p_2 = 1{,}00 \cdot 5{,}00 \cdot 127/(27 \cdot 2{,}00) = 11{,}8\,\text{atm}$, più di tre volte il valore giusto; con una temperatura sotto zero si troverebbe una pressione negativa. E il risultato del conto, quando l'incognita è la temperatura, è in kelvin.
```

## Le condizioni normali

Il volume di un gas cambia molto con la temperatura e la pressione: dire che un campione di gas occupa $250\,\text{mL}$ non dice quanto gas c'è, se non si dice anche a quale temperatura e a quale pressione. Per confrontare i gas tra loro si riportano i volumi a condizioni di riferimento. Le più usate nei libri di chimica sono le **condizioni normali**: la temperatura di $0\,^\circ\text{C}$ ($273\,\text{K}$) e la pressione di $1\,\text{atm}$ ($760\,\text{mmHg}$).

```ad-example
Esempio 4: riportare un volume a condizioni normali
In laboratorio si raccolgono $250\,\text{mL}$ di un gas a $25\,^\circ\text{C}$ e alla pressione di $740\,\text{mmHg}$. Quale volume occuperebbe lo stesso gas in condizioni normali?

Lo stato 2 è quello delle condizioni normali: $p_2 = 760\,\text{mmHg}$, $T_2 = 273\,\text{K}$. Con $T_1 = 298\,\text{K}$:

$$V_2 = \frac{p_1\,V_1\,T_2}{T_1\,p_2} = \frac{740\,\text{mmHg} \cdot 250\,\text{mL} \cdot 273\,\text{K}}{298\,\text{K} \cdot 760\,\text{mmHg}} = 223\,\text{mL}$$

In condizioni normali il gas occupa un po' meno: è più freddo e un po' più compresso.
```

```ad-note
Condizioni normali e condizioni standard
Non tutti i libri usano gli stessi valori di riferimento. Oltre alle condizioni normali ($0\,^\circ\text{C}$ e $1\,\text{atm}$) si trovano le condizioni standard di temperatura e pressione della IUPAC, $0\,^\circ\text{C}$ e $1\,\text{bar}$, e le condizioni ambiente, $25\,^\circ\text{C}$ e $1\,\text{atm}$. Negli esercizi di questo corso "condizioni normali" vuol dire sempre $0\,^\circ\text{C}$ e $1\,\text{atm}$.
```

## La costante dipende dalla quantità di gas

L'equazione generale vale per una quantità fissa di gas: il gas non deve uscire dal recipiente né entrarne dell'altro. Il valore della costante $p\,V/T$ dipende infatti da quanto gas c'è. Se nel recipiente si pompa il doppio del gas, alla stessa pressione e alla stessa temperatura il gas occupa il doppio del volume, e la costante raddoppia. Lo dice il [principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro), il tema della prossima lezione; e quando la quantità di gas si misura in moli, la costante diventa una sola per tutti i gas, nell'[equazione di stato dei gas ideali](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/l-equazione-di-stato-dei-gas-ideali).

```ad-warning
Un recipiente che perde o si riempie
L'equazione generale non si usa se la quantità di gas cambia: una gomma che si sgonfia perdendo aria, un pallone che si gonfia con il fiato, una bombola da cui esce il gas. In quei casi il rapporto $p\,V/T$ non resta costante.
```
