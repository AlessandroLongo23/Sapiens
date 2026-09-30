# Miscele di gas e pressioni parziali

L'aria che respiri non è un gas solo: è una miscela di azoto, ossigeno e, in piccole quantità, argon, anidride carbonica e vapore acqueo. Ognuno di questi gas contribuisce alla pressione dell'aria, e per il tuo corpo conta soprattutto la parte dovuta all'ossigeno: è quella che diminuisce in alta montagna, dove l'aria è rarefatta, e che cresce sott'acqua, quando un sub respira aria compressa. Questa lezione spiega come la pressione di una miscela si divide tra i gas che la formano.

## La pressione parziale

In una miscela di gas ideali ogni gas si comporta come se gli altri non ci fossero. Le molecole di un gas sono lontanissime tra loro, e non si accorgono di quelle degli altri gas: ognuna occupa tutto il recipiente e urta le pareti come farebbe da sola. La **pressione parziale** di un gas in una miscela è la pressione che quel gas avrebbe se occupasse da solo tutto il volume della miscela, alla stessa temperatura.

Poiché ogni gas occupa da solo tutto il volume $V$, la sua pressione parziale si calcola con l'[equazione di stato dei gas ideali](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/l-equazione-di-stato-dei-gas-ideali), usando le moli di quel gas: per il gas $1$, con $n_1$ moli,

$$p_1 = \frac{n_1\,R\,T}{V}$$

## La legge di Dalton

Nel 1801 John Dalton, lo stesso della teoria atomica, trovò che la pressione di una miscela di gas è la somma delle pressioni parziali dei gas che la compongono. È la **legge di Dalton delle pressioni parziali**:

$$p_{tot} = p_1 + p_2 + p_3 + \ldots$$

```tikz
% nome: pressioni-parziali-dalton-tre-recipienti
% alt: Tre recipienti uguali alla stessa temperatura. Il primo contiene solo azoto, sei molecole blu, e ha pressione 0,6 atmosfere; il secondo solo ossigeno, due molecole rosse, e ha pressione 0,2 atmosfere; il terzo contiene tutte e due le quantità insieme, otto molecole, e ha pressione 0,8 atmosfere, la somma delle due
% svg: pressioni-parziali-dalton-tre-recipienti-9412e476.svg 345x132
\begin{tikzpicture}
\foreach \x in {0, 3.3, 6.6} \draw[thick] (\x,0) rectangle ++(2.4,2.4);
\foreach \px/\py in {0.45/0.5, 1.3/0.35, 1.95/0.9, 0.6/1.4, 1.5/1.75, 2.0/2.0} {
  \fill[blue!70!black] (\px,\py) circle (0.1);
  \fill[blue!70!black] (6.6+\px,\py) circle (0.1);
}
\foreach \px/\py in {1.1/1.05, 0.4/2.05} {
  \fill[red!80!black] (3.3+\px,\py) circle (0.1);
  \fill[red!80!black] (6.6+\px,\py) circle (0.1);
}
\node at (2.85,1.2) {$+$};
\node at (6.15,1.2) {$=$};
\node[below] at (1.2,0) {solo azoto};
\node[below] at (4.5,0) {solo ossigeno};
\node[below] at (7.8,0) {miscela};
\node[below] at (1.2,-0.45) {$0{,}6$ atm};
\node[below] at (4.5,-0.45) {$0{,}2$ atm};
\node[below] at (7.8,-0.45) {$0{,}8$ atm};
\end{tikzpicture}
```

La legge vale perché, per un gas ideale, la pressione dipende solo da quante molecole ci sono e non da quali. Sommando le pressioni parziali:

$$p_{tot} = \frac{n_1 R T}{V} + \frac{n_2 R T}{V} + \ldots = \frac{(n_1 + n_2 + \ldots)\,R\,T}{V} = \frac{n_{tot}\,R\,T}{V}$$

La miscela si comporta come un solo gas con tutte le moli insieme.

```ad-example
Esempio 1: azoto e ossigeno in un recipiente
Un recipiente di $10{,}0\,\text{L}$ contiene $0{,}400\,\text{mol}$ di azoto e $0{,}100\,\text{mol}$ di ossigeno a $27\,^\circ\text{C}$. Quali sono le pressioni parziali e la pressione totale?

Con $T = 300\,\text{K}$:
$$p_{\mathrm{N_2}} = \frac{0{,}400 \cdot 0{,}0821 \cdot 300}{10{,}0}\,\text{atm} = 0{,}985\,\text{atm} \qquad p_{\mathrm{O_2}} = \frac{0{,}100 \cdot 0{,}0821 \cdot 300}{10{,}0}\,\text{atm} = 0{,}246\,\text{atm}$$
$$p_{tot} = 0{,}985 + 0{,}246 = 1{,}23\,\text{atm}$$
Lo stesso risultato viene dalle moli totali, $0{,}500\,\text{mol}$: $p_{tot} = 0{,}500 \cdot 0{,}0821 \cdot 300 / 10{,}0 = 1{,}23\,\text{atm}$.
```

Nella figura qui sotto scegli le moli di azoto, ossigeno e anidride carbonica in un recipiente di $22{,}4\,\text{L}$ e la temperatura: le barre mostrano la pressione parziale di ogni gas e, a destra, la loro somma. Con «Guarda un gas» vedi un gas alla volta, con la sua pressione parziale.

```interattivo
% nome: miscela-gas-dalton
% alt: Un recipiente chiuso di 22,4 litri con molecole di tre colori che si muovono e rimbalzano sulle pareti: azoto in blu, ossigeno in rosso, anidride carbonica in verde. Accanto, una barra per ogni gas con la sua pressione parziale e una barra della pressione totale fatta dei tre pezzi impilati. Con i cursori si scelgono le moli di ogni gas, da 0 a 1, e la temperatura, da 0 a 100 gradi Celsius; a 0 gradi ogni pressione parziale in atmosfere vale quanto le moli del suo gas. Un selettore mette in evidenza un gas alla volta
```

```ad-warning
Usare il volume di un solo gas
Nella formula $p_1 = n_1 R T / V$ il volume $V$ è quello di tutto il recipiente, perché ogni gas della miscela lo occupa tutto. Usare solo una parte del volume, per esempio quella proporzionale alle moli del gas, dà la pressione totale e non quella parziale.
```

## La frazione molare

Il rapporto tra le moli di un gas e le moli totali della miscela si chiama **frazione molare** e si indica con $x$:

$$x_1 = \frac{n_1}{n_{tot}}$$

È un numero puro, tra $0$ e $1$, e le frazioni molari di tutti i gas della miscela sommano a $1$. Dividendo $p_1 = n_1 R T / V$ per $p_{tot} = n_{tot} R T / V$, tutto si semplifica tranne le moli:

$$\frac{p_1}{p_{tot}} = \frac{n_1}{n_{tot}} = x_1 \qquad\Rightarrow\qquad p_1 = x_1 \cdot p_{tot}$$

La pressione parziale di un gas è la sua frazione molare per la pressione totale: in una miscela con un quarto delle molecole di ossigeno, un quarto della pressione è dovuto all'ossigeno.

Per il [principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro), nei gas la frazione molare è anche la frazione del volume: la composizione dell'aria "in volume" è la sua composizione in moli. L'aria secca ha questa composizione:

| Gas | Percentuale in volume | Frazione molare |
|---|---|---|
| Azoto, $\mathrm{N_2}$ | $78{,}08\%$ | $0{,}7808$ |
| Ossigeno, $\mathrm{O_2}$ | $20{,}95\%$ | $0{,}2095$ |
| Argon, $\mathrm{Ar}$ | $0{,}93\%$ | $0{,}0093$ |
| Anidride carbonica, $\mathrm{CO_2}$ | $0{,}04\%$ | $0{,}0004$ |

```ad-example
Esempio 2: l'ossigeno in montagna
Al livello del mare la pressione dell'aria è circa $1{,}00\,\text{atm}$; a $3000\,\text{m}$ di quota è circa $0{,}70\,\text{atm}$. Quanto vale la pressione parziale dell'ossigeno nei due casi, con $x_{\mathrm{O_2}} = 0{,}21$?

$$\text{al mare: } p_{\mathrm{O_2}} = 0{,}21 \cdot 1{,}00\,\text{atm} = 0{,}21\,\text{atm} \qquad \text{a } 3000\,\text{m: } p_{\mathrm{O_2}} = 0{,}21 \cdot 0{,}70\,\text{atm} = 0{,}15\,\text{atm}$$
La percentuale di ossigeno è la stessa, ma a ogni respiro i polmoni ne ricevono meno: per questo in alta quota ci si affatica prima.
```

```ad-example
Esempio 3: una miscela data in grammi
Una bombola contiene $8{,}00\ \mathrm{g}$ di metano, $\mathrm{CH_4}$, e $32{,}0\ \mathrm{g}$ di ossigeno, $\mathrm{O_2}$, alla pressione totale di $1{,}50\,\text{atm}$. Quali sono le pressioni parziali?

Prima le moli, con le masse molari $16{,}05$ e $32{,}00\ \mathrm{g/mol}$:
$$n_{\mathrm{CH_4}} = \frac{8{,}00}{16{,}05} = 0{,}4984\,\text{mol} \qquad n_{\mathrm{O_2}} = \frac{32{,}0}{32{,}00} = 1{,}000\,\text{mol} \qquad n_{tot} = 1{,}498\,\text{mol}$$
Poi le frazioni molari e le pressioni parziali:
$$x_{\mathrm{CH_4}} = \frac{0{,}4984}{1{,}498} = 0{,}3326 \qquad p_{\mathrm{CH_4}} = 0{,}3326 \cdot 1{,}50\,\text{atm} = 0{,}499\,\text{atm}$$
$$x_{\mathrm{O_2}} = \frac{1{,}000}{1{,}498} = 0{,}6674 \qquad p_{\mathrm{O_2}} = 0{,}6674 \cdot 1{,}50\,\text{atm} = 1{,}00\,\text{atm}$$
Il metano è il $20\%$ della massa della miscela, ma un terzo delle molecole e quindi un terzo della pressione: le sue molecole sono leggere, e in pochi grammi ce ne sono molte.
```

```ad-warning
La percentuale in massa non è la frazione molare
Nell'esempio 3 il metano è $8{,}00\ \mathrm{g}$ su $40{,}0\ \mathrm{g}$, cioè il $20\%$ della massa, e usare $0{,}20$ come frazione molare darebbe $p_{\mathrm{CH_4}} = 0{,}30\,\text{atm}$, sbagliato. La pressione parziale segue le moli: prima si dividono le masse per le masse molari.
```

## Un gas raccolto sopra l'acqua

In laboratorio un gas prodotto da una reazione si raccoglie spesso facendolo gorgogliare in una provetta capovolta piena d'acqua: il gas sale e spinge fuori l'acqua. Il gas raccolto, però, non è puro: sopra l'acqua c'è sempre un po' di vapore acqueo, che ha la sua pressione parziale, la tensione di vapore dell'acqua, che dipende solo dalla temperatura ($23{,}8\,\text{mmHg}$ a $25\,^\circ\text{C}$). Quando il livello dell'acqua dentro e fuori la provetta è lo stesso, la pressione totale nella provetta è quella atmosferica, e per la legge di Dalton

$$p_{gas} = p_{atm} - p_{\mathrm{H_2O}}$$

```ad-example
Esempio 4: idrogeno raccolto sopra l'acqua
Si raccolgono $250\,\text{mL}$ di idrogeno sopra l'acqua a $25\,^\circ\text{C}$, con la pressione atmosferica di $755\,\text{mmHg}$. Quante moli di idrogeno sono state raccolte?

La pressione parziale dell'idrogeno è
$$p_{\mathrm{H_2}} = 755\,\text{mmHg} - 23{,}8\,\text{mmHg} = 731{,}2\,\text{mmHg} = \frac{731{,}2}{760}\,\text{atm} = 0{,}9621\,\text{atm}$$
e con l'equazione di stato, con $V = 0{,}250\,\text{L}$ e $T = 298\,\text{K}$:
$$n = \frac{p\,V}{R\,T} = \frac{0{,}9621 \cdot 0{,}250}{0{,}0821 \cdot 298}\,\text{mol} = 9{,}83 \cdot 10^{-3}\,\text{mol}$$
```
