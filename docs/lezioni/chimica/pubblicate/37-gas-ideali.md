# L'equazione di stato dei gas ideali

Lo stato di un gas è descritto da quattro grandezze: la pressione $p$, il volume $V$, la temperatura assoluta $T$ e la quantità di sostanza $n$. Le leggi dei gas le legano a due a due, tenendo fisse le altre; il volume molare vale solo a $0\,^\circ\text{C}$ e $1\,\text{atm}$. L'equazione di stato dei gas ideali mette tutto insieme in una sola formula, che vale in qualunque condizione: conoscendo tre delle quattro grandezze, si trova la quarta.

## Dalle leggi dei gas a una sola equazione

Ognuna delle leggi dei gas descrive che cosa succede quando due grandezze cambiano e le altre due restano fisse:

| Legge | Restano costanti | Relazione |
|---|---|---|
| [Boyle](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-legge-di-boyle) | $n$ e $T$ | $p\,V = \text{costante}$ |
| [Charles](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac) | $n$ e $p$ | $V / T = \text{costante}$ |
| [Gay-Lussac](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac) | $n$ e $V$ | $p / T = \text{costante}$ |
| [Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro) | $p$ e $T$ | $V / n = \text{costante}$ |

Le prime tre, messe insieme, danno l'[equazione generale dei gas](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/l-equazione-generale-dei-gas): per una quantità fissa di gas, $p\,V / T$ resta costante. Il principio di Avogadro aggiunge che, a parità di pressione e temperatura, il volume è proporzionale al numero di moli: con il doppio delle moli, il doppio del volume. Quindi $p\,V / T$ è proporzionale a $n$, e il rapporto $p\,V / (n\,T)$ è lo stesso numero per qualunque gas in qualunque condizione. Questo numero si chiama **costante universale dei gas** e si indica con $R$:

$$p\,V = n\,R\,T$$

È l'**equazione di stato dei gas ideali**. Contiene tutte le leggi precedenti: con $n$ e $T$ fissi, per esempio, il secondo membro è costante e resta la legge di Boyle.

```tikz
% nome: gas-ideali-cilindro-grandezze
% alt: Un cilindro chiuso in alto da un pistone, con dentro le molecole di un gas disegnate come puntini. Accanto sono scritte le quattro grandezze che descrivono lo stato del gas: la pressione p, il volume V, la temperatura T e la quantità di sostanza n
% svg: gas-ideali-cilindro-grandezze-dd0f771c.svg 250x129
\begin{tikzpicture}
\draw[thick] (0,3.2) -- (0,0) -- (2.8,0) -- (2.8,3.2);
\draw[thick, fill=gray!20] (0.02,2.3) rectangle (2.78,2.55);
\draw[thick] (1.4,2.55) -- (1.4,3.3);
\foreach \px/\py in {0.3/0.3, 0.9/0.55, 1.6/0.25, 2.3/0.5, 0.5/1.0, 1.2/1.2, 2.0/1.05, 2.5/1.5, 0.35/1.65, 1.0/1.85, 1.7/1.7, 2.3/2.0, 0.7/2.1, 1.5/0.8} \fill (\px,\py) circle (1.5pt);
\draw[{Stealth}-{Stealth}, thin] (3.15,0) -- (3.15,2.3) node[midway, right] {$V$};
\node[right] at (4.0,2.1) {$n$ moli di gas};
\node[right] at (4.0,1.4) {pressione $p$};
\node[right] at (4.0,0.7) {temperatura $T$};
\end{tikzpicture}
```

## La costante dei gas

Il valore di $R$ si trova dal volume molare: una mole di gas, a $273\,\text{K}$ e $1\,\text{atm}$, occupa $22{,}4\,\text{L}$ (vedi [Il volume molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/il-volume-molare)). Quindi

$$R = \frac{p\,V}{n\,T} = \frac{1\,\text{atm} \cdot 22{,}4\,\text{L}}{1\,\text{mol} \cdot 273\,\text{K}} = 0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)}$$

Con la pressione in pascal ($1\,\text{atm} = 1{,}013 \cdot 10^5\,\text{Pa}$) e il volume in metri cubi ($22{,}4\,\text{L} = 22{,}4 \cdot 10^{-3}\,\text{m}^3$), le unità del Sistema Internazionale, lo stesso conto dà

$$R = \frac{1{,}013 \cdot 10^5\,\text{Pa} \cdot 22{,}4 \cdot 10^{-3}\,\text{m}^3}{1\,\text{mol} \cdot 273\,\text{K}} = 8{,}31\,\text{J/(mol}\cdot\text{K)}$$

perché un pascal per un metro cubo è un joule. È la stessa costante, scritta in due unità diverse, e ognuna va con le sue unità per le altre grandezze:

| $R$ | Pressione | Volume | Temperatura |
|---|---|---|---|
| $0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)}$ | atmosfere | litri | kelvin |
| $8{,}31\,\text{J/(mol}\cdot\text{K)}$ | pascal | metri cubi | kelvin |

Le conversioni che servono più spesso: $1\,\text{atm} = 1{,}013 \cdot 10^5\,\text{Pa} = 760\,\text{mmHg}$, $1\,\text{kPa} = 10^3\,\text{Pa}$, $1\,\text{L} = 10^{-3}\,\text{m}^3$, $1\,\text{mL} = 10^{-3}\,\text{L}$, e per la temperatura $T = t + 273$, con $t$ in gradi Celsius (vedi [Temperatura e calore](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore)).

```ad-warning
La temperatura in gradi Celsius
Nell'equazione di stato la temperatura va sempre in kelvin. Con $t = 0\,^\circ\text{C}$ al posto di $T = 273\,\text{K}$ il volume verrebbe zero; con $25$ al posto di $298$ verrebbe quasi dodici volte più piccolo.
```

```ad-warning
Unità mescolate
Con $R = 0{,}0821$ la pressione va in atmosfere e il volume in litri; con $R = 8{,}31$ in pascal e metri cubi. Una pressione in kilopascal con $R = 0{,}0821$, o un volume in litri con $R = 8{,}31$, dà un risultato sbagliato di un fattore $100$ o $1000$.
```

## Il gas ideale

L'equazione vale esattamente per un **gas ideale**, un modello in cui le molecole sono punti che non occupano volume e non si attraggono tra loro, e si urtano come palline elastiche. I gas veri si comportano quasi come un gas ideale quando le molecole sono lontane e veloci: a pressioni basse o moderate, fino a qualche atmosfera, e a temperature lontane da quella a cui il gas diventa liquido. In queste condizioni, che sono quelle della vita di tutti i giorni e degli esercizi, l'equazione dà risultati con errori di solito più piccoli dell'$1\%$. Ad alta pressione, o vicino alla liquefazione, le molecole sono vicine, si attraggono e occupano una parte del volume, e l'equazione non basta più.

```ad-note
In fisica
La stessa equazione, scritta anche con il numero di molecole al posto delle moli, è nella lezione di fisica [L'equazione di stato del gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto): "gas perfetto" e "gas ideale" sono due nomi dello stesso modello.
```

## Come si usa

1. Scrivi i dati e l'incognita, e porta la temperatura in kelvin.
2. Scegli $R$: $0{,}0821$ se la pressione è in atmosfere e il volume in litri, $8{,}31$ se sono in pascal e metri cubi. Converti i dati che non sono nelle unità giuste.
3. Ricava l'incognita dall'equazione: $V = n R T / p$, $p = n R T / V$, $n = p V / (R T)$, $T = p V / (n R)$.
4. Sostituisci i numeri con le loro unità, e controlla che le unità si semplifichino in quella giusta.

```ad-example
Esempio 1: il volume a temperatura ambiente
Che volume occupano $2{,}00\,\text{mol}$ di ossigeno a $25\,^\circ\text{C}$ e $1{,}00\,\text{atm}$?

La temperatura in kelvin è $T = 25 + 273 = 298\,\text{K}$. Con la pressione in atmosfere si usa $R = 0{,}0821$:
$$V = \frac{n\,R\,T}{p} = \frac{2{,}00\,\text{mol} \cdot 0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)} \cdot 298\,\text{K}}{1{,}00\,\text{atm}} = 48{,}9\,\text{L}$$
Un po' più del doppio di $22{,}4\,\text{L}$: le moli sono due, e a $25\,^\circ\text{C}$ il gas è più dilatato che a $0\,^\circ\text{C}$.
```

```ad-example
Esempio 2: la pressione in una bombola
Una bombola da $10{,}0\,\text{L}$ contiene $64{,}0\ \mathrm{g}$ di ossigeno, $\mathrm{O_2}$, a $27\,^\circ\text{C}$. Qual è la pressione?

Le moli sono $n = 64{,}0 / 32{,}00 = 2{,}00\,\text{mol}$ e la temperatura è $T = 27 + 273 = 300\,\text{K}$:
$$p = \frac{n\,R\,T}{V} = \frac{2{,}00 \cdot 0{,}0821 \cdot 300}{10{,}0}\,\text{atm} = 4{,}93\,\text{atm}$$
```

```ad-example
Esempio 3: con le unità del Sistema Internazionale
Una siringa contiene $500\,\text{mL}$ di aria a $150\,\text{kPa}$ e $20\,^\circ\text{C}$. Quante moli di gas contiene?

Con la pressione in pascal si usa $R = 8{,}31$, e il volume va in metri cubi: $p = 1{,}50 \cdot 10^5\,\text{Pa}$, $V = 500\,\text{mL} = 5{,}00 \cdot 10^{-4}\,\text{m}^3$, $T = 293\,\text{K}$.
$$n = \frac{p\,V}{R\,T} = \frac{1{,}50 \cdot 10^5\,\text{Pa} \cdot 5{,}00 \cdot 10^{-4}\,\text{m}^3}{8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 293\,\text{K}} = 0{,}0308\,\text{mol}$$
```

## Massa molare e densità di un gas

Le moli di un gas sono la sua massa diviso la massa molare, $n = m / M$. Sostituendo nell'equazione di stato:

$$p\,V = \frac{m}{M}\,R\,T \qquad\Rightarrow\qquad M = \frac{m\,R\,T}{p\,V}$$

Pesando un volume noto di gas, a temperatura e pressione note, si trova la sua massa molare, in qualunque condizione e non solo in quelle normali.

```ad-example
Esempio 4: la massa molare di un gas sconosciuto
Un recipiente di $0{,}560\,\text{L}$ contiene $1{,}00\ \mathrm{g}$ di un gas, a $27\,^\circ\text{C}$ e $1{,}00\,\text{atm}$. Qual è la massa molare del gas?

$$M = \frac{m\,R\,T}{p\,V} = \frac{1{,}00\ \mathrm{g} \cdot 0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)} \cdot 300\,\text{K}}{1{,}00\,\text{atm} \cdot 0{,}560\,\text{L}} = 44{,}0\ \mathrm{g/mol}$$
Potrebbe essere anidride carbonica, $\mathrm{CO_2}$ ($44{,}01\ \mathrm{g/mol}$), o propano, $\mathrm{C_3H_8}$ ($44{,}11\ \mathrm{g/mol}$): per distinguerli serve la composizione.
```

Allo stesso modo, la densità $d = m / V$ di un gas è

$$d = \frac{p\,M}{R\,T}$$

Cresce con la pressione, perché il gas è più compresso, e diminuisce con la temperatura, perché il gas si dilata: è il motivo per cui l'aria calda sale e le mongolfiere volano.

```ad-example
Esempio 5: la densità dell'anidride carbonica a 25 °C
Qual è la densità dell'anidride carbonica a $25\,^\circ\text{C}$ e $1{,}00\,\text{atm}$?

$$d = \frac{p\,M}{R\,T} = \frac{1{,}00\,\text{atm} \cdot 44{,}01\ \mathrm{g/mol}}{0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)} \cdot 298\,\text{K}} = 1{,}80\ \mathrm{g/L}$$
È meno dei $1{,}96\ \mathrm{g/L}$ a $0\,^\circ\text{C}$: a temperatura più alta lo stesso gas occupa più spazio.
```

```ad-warning
Il volume in millilitri
Nell'esempio 3 il volume dato è $500\,\text{mL}$. Con $R = 0{,}0821$ va scritto $0{,}500\,\text{L}$, con $R = 8{,}31$ come $5{,}00 \cdot 10^{-4}\,\text{m}^3$; il numero $500$ nell'equazione dà un risultato mille volte troppo grande, o un milione di volte.
```
