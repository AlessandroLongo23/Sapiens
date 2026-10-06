# Formulario: Le macchine termiche e il rendimento

## Il ciclo

In una trasformazione ciclica $\Delta U = 0$, quindi il lavoro totale è uguale al calore totale scambiato:

$$W = Q$$

Nel piano pressione-volume il lavoro di un ciclo percorso in senso orario è l'area racchiusa.

## La macchina termica

- Assorbe $Q_c$ dalla sorgente calda (a $T_c$), cede $Q_f$ alla sorgente fredda (a $T_f$), compie il lavoro $W$.
- $Q_c$ e $Q_f$ sono presi in valore assoluto.

$$W = Q_c - Q_f$$

```tikz
% nome: macchina-termica-schema-flussi
% alt: Lo schema di una macchina termica: in alto la sorgente calda a temperatura Tc, al centro la macchina, in basso la sorgente fredda a temperatura Tf. Una freccia larga scende dalla sorgente calda alla macchina con il calore assorbito, 1200 joule; una freccia più stretta scende dalla macchina alla sorgente fredda con il calore ceduto, 780 joule; una terza freccia esce di lato con il lavoro, 420 joule. Le larghezze delle frecce sono in proporzione
% svg: macchina-termica-schema-flussi-dfb45fcf.svg 215x182
\begin{tikzpicture}
\draw[thick, fill=red!15] (-1.7,4.0) rectangle (1.7,4.7);
\node at (0,4.35) {\small sorgente calda, $T_c$};
\draw[thick, fill=blue!10] (-1.7,0) rectangle (1.7,0.7);
\node at (0,0.35) {\small sorgente fredda, $T_f$};
\draw[thin, fill=orange!25] (-0.6,4.0) -- (-0.6,3.3) -- (-0.75,3.3) -- (0,3.0) -- (0.75,3.3) -- (0.6,3.3) -- (0.6,4.0) -- cycle;
\draw[thin, fill=orange!25] (-0.39,1.7) -- (-0.39,1.0) -- (-0.54,1.0) -- (0,0.7) -- (0.54,1.0) -- (0.39,1.0) -- (0.39,1.7) -- cycle;
\draw[thin, fill=green!15] (0.65,2.56) -- (2.3,2.56) -- (2.3,2.71) -- (2.6,2.35) -- (2.3,1.99) -- (2.3,2.14) -- (0.65,2.14) -- cycle;
\draw[thick, fill=gray!20] (0,2.35) circle (0.65);
\node at (0,2.35) {\scriptsize macchina};
\node[left] at (-0.8,3.6) {$Q_c = 1200$ J};
\node[left] at (-0.6,1.3) {$Q_f = 780$ J};
\node[above] at (1.7,2.75) {$W = 420$ J};
\end{tikzpicture}
```

## Il rendimento

$$\eta = \frac{W}{Q_c} = 1 - \frac{Q_f}{Q_c}$$

- Numero puro tra 0 e 1, spesso in percentuale: $0{,}35 = 35\%$.
- Esempio: $Q_c = 1200\,\text{J}$, $Q_f = 780\,\text{J}$ danno $W = 420\,\text{J}$ e $\eta = 0{,}35$.

| Si cerca | Formula |
|---|---|
| il calore assorbito | $Q_c = \dfrac{W}{\eta}$ |
| il lavoro | $W = \eta\,Q_c$ |
| il calore ceduto | $Q_f = Q_c - W = (1 - \eta)\,Q_c$ |

## Con la potenza

In un tempo $\Delta t$ una macchina di potenza $P$ compie $W = P\,\Delta t$ e assorbe

$$Q_c = \frac{P\,\Delta t}{\eta}$$

## Il ciclo rettangolare

Due trasformazioni a pressione costante e due a volume costante: il lavoro è base per altezza,

$$W = (p_A - p_D)(V_B - V_A)$$

con la pressione in pascal e il volume in metri cubi ($1\,\text{L} = 10^{-3}\,\text{m}^3$).

```ad-warning
Al denominatore c'è il calore assorbito
$\eta = W / Q_c$, non $W / Q_f$; e $Q_f / Q_c$ è la frazione persa, non il rendimento.
```

```ad-warning
Per trovare il calore assorbito si divide
$Q_c = W / \eta$ è più grande di $W$: moltiplicando per $\eta$ verrebbe più piccolo.
```

```ad-warning
Stesso intervallo di tempo
Lavoro e calore si prendono nello stesso tempo: un ciclo, un secondo, un'ora.
```
