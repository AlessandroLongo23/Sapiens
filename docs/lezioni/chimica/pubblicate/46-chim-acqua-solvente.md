# L'acqua come solvente

Il sale nella pasta, lo zucchero nel caffè, l'anidride carbonica delle bollicine, l'ossigeno che respirano i pesci: l'acqua scioglie un numero enorme di sostanze, e per questo in natura non è quasi mai pura. L'acqua del rubinetto, quella dei fiumi e quella del mare sono tutte [soluzioni](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale) acquose, cioè soluzioni in cui il solvente è l'acqua. Non scioglie però tutto: l'olio resta a galla, la sabbia resta sul fondo. Che cosa decide chi si scioglie e chi no lo spiega la forma della [molecola d'acqua](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/la-molecola-d-acqua-e-il-legame-a-idrogeno): una molecola polare, con un lato negativo, l'ossigeno, e un lato positivo, gli idrogeni.

## Sciogliere un composto ionico

Il cloruro di sodio, il sale da cucina, è un [composto ionico](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni): un cristallo fatto di ioni sodio $\mathrm{Na^+}$ e ioni cloruro $\mathrm{Cl^-}$, alternati e tenuti insieme dall'attrazione tra cariche opposte. Quando il cristallo è nell'acqua, le molecole d'acqua si orientano verso gli ioni della sua superficie: verso uno ione $\mathrm{Na^+}$ girano l'ossigeno, che ha la carica parziale negativa; verso uno ione $\mathrm{Cl^-}$ girano un idrogeno, che ha la carica parziale positiva. Ogni ione della superficie è tirato da molte molecole d'acqua insieme, e quando l'attrazione dell'acqua vince quella degli ioni vicini lo ione si stacca dal cristallo.

Lo ione che si stacca non resta solo: le molecole d'acqua lo circondano, orientate nello stesso modo, e lo accompagnano nel liquido. Uno ione circondato da molecole d'acqua si chiama **ione idratato**, e il fenomeno **idratazione**. Il guscio di molecole d'acqua tiene lontani gli ioni di carica opposta e impedisce che si riattacchino. Nella figura qui sotto il cristallo si scioglie ione dopo ione: prima si staccano gli ioni degli spigoli, che hanno meno vicini a trattenerli, poi quelli rimasti scoperti.

```interattivo
% nome: acqua-sale-si-scioglie
% alt: Un cristallo di cloruro di sodio sul fondo di un recipiente d'acqua, fatto di ioni sodio, cerchi piccoli viola con il segno più, e di ioni cloruro, cerchi grandi verdi con il segno meno, alternati. Un bottone avvia la dissoluzione e un cursore la fa avanzare: gli ioni si staccano uno alla volta, prima quelli degli spigoli, e ognuno si allontana nel liquido circondato dalle molecole d'acqua, che girano l'ossigeno verso gli ioni sodio e un idrogeno verso gli ioni cloruro. Sotto si leggono quanti ioni restano nel cristallo e quanti sono in soluzione
```

Il passaggio del sale dal cristallo alla soluzione si scrive con un'equazione, in cui una lettera tra parentesi dice lo stato di ogni sostanza: $(s)$ solido, $(l)$ liquido, $(g)$ gassoso, $(aq)$ in soluzione acquosa, dal latino *aqua*.

$$\mathrm{NaCl}(s) \longrightarrow \mathrm{Na^+}(aq) + \mathrm{Cl^-}(aq)$$

Questa separazione degli ioni di un composto ionico si chiama **dissociazione ionica**. Gli ioni erano già nel cristallo: l'acqua non li crea, li separa. Da ogni unità formula escono tanti ioni quanti ne indica la formula, ognuno con la sua carica: il cloruro di calcio, $\mathrm{CaCl_2}$, libera uno ione calcio e due ioni cloruro, e uno ione poliatomico come il solfato $\mathrm{SO_4^{2-}}$ resta intero.

$$\mathrm{CaCl_2}(s) \longrightarrow \mathrm{Ca^{2+}}(aq) + 2\,\mathrm{Cl^-}(aq) \qquad \mathrm{Na_2SO_4}(s) \longrightarrow 2\,\mathrm{Na^+}(aq) + \mathrm{SO_4^{2-}}(aq)$$

```tikz
% nome: acqua-ioni-idratati
% alt: A sinistra uno ione sodio, un cerchio piccolo con il segno più, circondato da sei molecole d'acqua che gli rivolgono l'ossigeno, con gli idrogeni verso l'esterno. A destra uno ione cloruro, un cerchio più grande con il segno meno, circondato da sei molecole d'acqua che gli rivolgono un idrogeno ciascuna
% svg: acqua-ioni-idratati-fd896922.svg 237x130
\begin{tikzpicture}
\newcommand{\acquaO}[1]{%
\begin{scope}[rotate=#1]
\draw[thick] (0.62,0) -- ++(-52.25:0.4); \draw[thick] (0.62,0) -- ++(52.25:0.4);
\draw[thick, fill=blue!10] (0.62,0) ++(-52.25:0.4) circle (0.13);
\draw[thick, fill=blue!10] (0.62,0) ++(52.25:0.4) circle (0.13);
\draw[thick, fill=red!20] (0.62,0) circle (0.2);
\end{scope}}
\newcommand{\acquaH}[1]{%
\begin{scope}[rotate=#1]
\draw[thick] (1.07,0) -- (0.67,0); \draw[thick] (1.07,0) -- ++(75.5:0.4);
\draw[thick, fill=blue!10] (0.67,0) circle (0.13);
\draw[thick, fill=blue!10] (1.07,0) ++(75.5:0.4) circle (0.13);
\draw[thick, fill=red!20] (1.07,0) circle (0.2);
\end{scope}}
\draw[thick, fill=violet!15] (0,0) circle (0.28);
\node at (0,0) {$+$};
\foreach \a in {0,60,...,300} \acquaO{\a}
\node at (0,-1.55) {\small $\mathrm{Na^+}(aq)$};
\begin{scope}[shift={(3.8,0)}]
\draw[thick, fill=green!15] (0,0) circle (0.42);
\node at (0,0) {$-$};
\foreach \a in {30,90,...,330} \acquaH{\a}
\node at (0,-1.75) {\small $\mathrm{Cl^-}(aq)$};
\end{scope}
\end{tikzpicture}
```

```ad-example
Esempio 1: gli ioni del cloruro di magnesio
Si sciolgono in acqua $0{,}30\,\text{mol}$ di cloruro di magnesio, $\mathrm{MgCl_2}$. Quanti ioni si formano, e di quale tipo?

L'equazione di dissociazione è

$$\mathrm{MgCl_2}(s) \longrightarrow \mathrm{Mg^{2+}}(aq) + 2\,\mathrm{Cl^-}(aq)$$

Ogni unità formula dà uno ione magnesio e due ioni cloruro. In soluzione ci sono quindi $0{,}30\,\text{mol}$ di ioni $\mathrm{Mg^{2+}}$ e $2 \cdot 0{,}30 = 0{,}60\,\text{mol}$ di ioni $\mathrm{Cl^-}$, in tutto $0{,}90\,\text{mol}$ di ioni. La [mole](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare) conta gli ioni come conta le molecole.
```

```ad-warning
Il cloro non esce come Cl₂
Nell'equazione del cloruro di calcio il $2$ si mette davanti a $\mathrm{Cl^-}$, non come indice: $2\,\mathrm{Cl^-}$ sono due ioni cloruro separati, $\mathrm{Cl_2}$ sarebbe una molecola di cloro, un gas giallo-verde che nell'acqua salata non c'è. Allo stesso modo la carica dello ione calcio è $2+$, e non va divisa tra gli ioni cloruro.
```

Una soluzione di un composto ionico conduce la corrente elettrica, perché contiene ioni liberi di muoversi, e il composto si dice **elettrolita**. Il cristallo solido non la conduce, perché i suoi ioni sono fermi; nemmeno l'acqua pura, che di ioni ne contiene pochissimi. Il quarto anno riprende l'argomento nella lezione [Elettroliti e non elettroliti](/materiale/scuola-superiore/chimica/le-proprieta-delle-soluzioni/elettroliti-e-non-elettroliti).

Non tutti i composti ionici si sciolgono. Nel carbonato di calcio, $\mathrm{CaCO_3}$, il calcare e il marmo, gli ioni si attraggono tanto che l'acqua non riesce a separarli, e lo stesso vale per il cloruro d'argento, $\mathrm{AgCl}$. Quali composti ionici si sciolgono e quali no non si indovina dalla formula: si impara, o si legge in una tabella.

```ad-warning
Ionico non vuol dire solubile
Molti composti ionici si sciolgono in acqua, ma non tutti: il marmo è carbonato di calcio, è un composto ionico, e le statue sotto la pioggia restano in piedi per secoli. Dire che un composto si scioglie perché è ionico è un errore.
```

## Sciogliere una sostanza molecolare polare

Lo zucchero da cucina (il saccarosio), il glucosio e l'alcol etilico si sciolgono benissimo in acqua, ma non sono fatti di ioni: sono fatti di molecole. Le loro molecole hanno gruppi $\mathrm{O{-}H}$, uguali a una metà della molecola d'acqua, che formano legami a idrogeno con l'acqua: l'idrogeno del gruppo $\mathrm{O{-}H}$ si lega all'ossigeno di una molecola d'acqua, e il suo ossigeno riceve l'idrogeno di un'altra. Le molecole d'acqua circondano così ogni molecola di zucchero e la portano in soluzione.

```molecole
% nome: acqua-solvente-glucosio-etanolo
% alt: Due molecole che si sciolgono bene in acqua, con i gruppi O-H evidenziati in blu: a sinistra il glucosio, un anello di cinque atomi di carbonio e uno di ossigeno con cinque gruppi O-H; a destra l'etanolo, due atomi di carbonio e un gruppo O-H
% svg: acqua-solvente-glucosio-etanolo-c02c439c.svg 420x180
colonne: 2
OCC1OC(O)C(O)C(O)C1O | glucosio | evidenzia: [OX2H] blu
CCO | etanolo | evidenzia: [OX2H] blu
```

Qui le molecole si separano l'una dall'altra, ma restano intere: non si formano ioni.

$$\mathrm{C_6H_{12}O_6}(s) \longrightarrow \mathrm{C_6H_{12}O_6}(aq)$$

Per questo l'acqua zuccherata non conduce la corrente: lo zucchero è un **non elettrolita**. Allo stesso modo si sciolgono le sostanze fatte di molecole polari piccole, come l'ammoniaca e l'acetone.

## Le sostanze apolari non si sciolgono

L'olio, la benzina, la cera e i grassi sono fatti di molecole apolari, lunghe catene di atomi di carbonio e di idrogeno senza cariche parziali. Non attirano le molecole d'acqua, e le molecole d'acqua, che si attraggono molto tra loro con i legami a idrogeno, non si separano per farle entrare: le sostanze apolari restano fuori, in uno strato a parte. L'olio sta sopra l'acqua perché è meno denso.

Le sostanze apolari si sciolgono invece in solventi apolari: una macchia d'olio va via con la benzina o con un solvente per sgrassare, e lo iodio, che in acqua si scioglie pochissimo, in olio o in benzina si scioglie bene e li colora di viola. La regola pratica è **il simile scioglie il simile**: i solventi polari, come l'acqua, sciolgono le sostanze ioniche e polari; i solventi apolari sciolgono le sostanze apolari.

| Sostanza | Particelle | In acqua |
|---|---|---|
| cloruro di sodio, $\mathrm{NaCl}$ | ioni | si scioglie, in ioni idratati |
| carbonato di calcio, $\mathrm{CaCO_3}$ | ioni | non si scioglie |
| saccarosio, glucosio | molecole polari | si scioglie, in molecole intere |
| etanolo | molecole polari | si mescola in qualunque proporzione |
| olio, benzina | molecole apolari | non si scioglie |

```ad-note
Come fa il sapone
Una molecola di sapone ha una lunga coda apolare e una testa con una carica. In acqua le code si infilano nelle goccioline di grasso, le teste restano verso l'acqua: il grasso, circondato dalle teste, si stacca dal tessuto o dalla pelle e viene portato via dall'acqua. Il sapone non scioglie il grasso nell'acqua, lo divide in goccioline sospese.
```

## La solubilità e la temperatura

Anche le sostanze che si sciolgono hanno un limite, la **solubilità**: la massa massima che se ne scioglie in $100\,\text{g}$ d'acqua a una data temperatura. La lezione [Le soluzioni e la concentrazione percentuale](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale) la definisce, insieme alle soluzioni sature e al corpo di fondo; qui interessa come cambia con la temperatura.

| Sostanza | $0\,^\circ\text{C}$ | $20\,^\circ\text{C}$ | $40\,^\circ\text{C}$ | $60\,^\circ\text{C}$ | $80\,^\circ\text{C}$ | $100\,^\circ\text{C}$ |
|---|---|---|---|---|---|---|
| cloruro di sodio, $\mathrm{NaCl}$ | $35{,}7$ | $35{,}9$ | $36{,}4$ | $37{,}1$ | $38{,}0$ | $39{,}2$ |
| cloruro di potassio, $\mathrm{KCl}$ | $28{,}0$ | $34{,}2$ | $40{,}1$ | $45{,}8$ | $51{,}3$ | $56{,}3$ |
| nitrato di potassio, $\mathrm{KNO_3}$ | $13{,}3$ | $31{,}6$ | $63{,}9$ | $110$ | $169$ | $246$ |
| saccarosio | $179$ | $204$ | $238$ | $287$ | $362$ | $487$ |

I valori sono in grammi per $100\,\text{g}$ d'acqua. Per quasi tutti i solidi la solubilità cresce con la temperatura: le particelle dell'acqua calda si muovono più in fretta e strappano più facilmente quelle del solido. Quanto cresce dipende dalla sostanza: il nitrato di potassio passa da $13{,}3$ a $246\,\text{g}$, il cloruro di sodio cambia appena.

Se una soluzione satura calda si raffredda, la solubilità scende, e il soluto in più non può restare sciolto: si separa sotto forma di cristalli. È la **cristallizzazione**, uno dei [metodi di separazione dei miscugli](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/metodi-di-separazione-dei-miscugli), e il modo in cui in laboratorio si ottiene un solido puro.

```ad-example
Esempio 2: cristalli che si formano raffreddando
In $50{,}0\,\text{g}$ d'acqua a $60\,^\circ\text{C}$ si scioglie tutto il nitrato di potassio possibile, poi la soluzione si raffredda a $20\,^\circ\text{C}$. Quanto nitrato di potassio cristallizza?

La solubilità è riferita a $100\,\text{g}$ d'acqua, e qui l'acqua è la metà. A $60\,^\circ\text{C}$ se ne sciolgono

$$110\,\text{g} \cdot \frac{50{,}0\,\text{g}}{100\,\text{g}} = 55{,}0\,\text{g}$$

e a $20\,^\circ\text{C}$ ne restano sciolti al massimo $31{,}6 \cdot 0{,}500 = 15{,}8\,\text{g}$. Cristallizzano $55{,}0 - 15{,}8 = 39{,}2\,\text{g}$ di nitrato di potassio.
```

```ad-warning
La solubilità è per 100 g d'acqua
La solubilità della tabella si riferisce a $100\,\text{g}$ d'acqua, non a $100\,\text{g}$ di soluzione e non alla quantità d'acqua del problema. Con $50{,}0\,\text{g}$ d'acqua si scioglie la metà del valore della tabella; con $250\,\text{g}$, due volte e mezza.
```

Per i gas va al contrario: la loro solubilità diminuisce quando la temperatura sale, perché le molecole del gas, più veloci, sfuggono più facilmente dal liquido. Una bibita gassata calda perde le bollicine prima di una fredda, e l'acqua di un fiume scaldata dagli scarichi di una centrale contiene meno ossigeno, con danno per i pesci. L'acqua a contatto con l'aria contiene al massimo, per ogni litro, circa $14{,}6\,\text{mg}$ di ossigeno a $0\,^\circ\text{C}$, $9{,}1\,\text{mg}$ a $20\,^\circ\text{C}$ e $7{,}6\,\text{mg}$ a $30\,^\circ\text{C}$.

```ad-warning
I gas non si comportano come i solidi
Scaldando l'acqua si scioglie più zucchero, ma meno ossigeno e meno anidride carbonica. La regola "più caldo, più solubile" vale per la maggior parte dei solidi, non per i gas.
```

## L'acqua dura

La pioggia, attraversando l'aria, scioglie un po' di anidride carbonica e diventa leggermente acida; filtrando nel terreno scioglie il calcare delle rocce, che in acqua pura resterebbe quasi intero, e si carica di ioni calcio $\mathrm{Ca^{2+}}$, magnesio $\mathrm{Mg^{2+}}$ e idrogenocarbonato $\mathrm{HCO_3^-}$:

$$\mathrm{CaCO_3}(s) + \mathrm{CO_2}(aq) + \mathrm{H_2O}(l) \longrightarrow \mathrm{Ca^{2+}}(aq) + 2\,\mathrm{HCO_3^-}(aq)$$

Un'acqua che contiene molti ioni calcio e magnesio si dice **dura**; una che ne contiene pochi, **dolce**. La durezza dipende dalle rocce da cui viene l'acqua: nelle zone calcaree l'acqua è dura, in quelle di granito è dolce.

In Italia la durezza si misura in **gradi francesi**, simbolo $^\circ\text{f}$: un grado francese corrisponde a $10\,\text{mg}$ di carbonato di calcio per ogni litro d'acqua. Si conta come carbonato di calcio anche il magnesio, con la quantità di carbonato che avrebbe gli stessi ioni positivi. Una classificazione diffusa chiama dolce l'acqua sotto i $15\,^\circ\text{f}$, media tra $15$ e $30\,^\circ\text{f}$, dura sopra i $30\,^\circ\text{f}$; le etichette delle acque minerali e i siti degli acquedotti riportano la durezza.

```ad-example
Esempio 3: la durezza di un'acqua del rubinetto
L'analisi di un'acqua del rubinetto dice che contiene l'equivalente di $280\,\text{mg}$ di carbonato di calcio per litro. Quanti gradi francesi sono, e com'è l'acqua?

Un grado francese sono $10\,\text{mg}$ di carbonato di calcio per litro:

$$\frac{280\,\text{mg/L}}{10\,\text{mg/L}} = 28\,^\circ\text{f}$$

L'acqua è media, vicina al limite delle acque dure.
```

L'acqua dura non fa male, ma dà fastidio in casa. Scaldandola, la reazione scritta sopra va all'indietro: l'anidride carbonica se ne va e il carbonato di calcio si riforma e si deposita come calcare sulle resistenze delle lavatrici, nei bollitori, sui rubinetti. Gli ioni calcio e magnesio, poi, si legano al sapone e lo fanno precipitare, e con l'acqua dura il sapone fa meno schiuma. Per questo in lavatrice e in lavastoviglie si usano addolcitori, che tolgono gli ioni calcio e magnesio dall'acqua.
