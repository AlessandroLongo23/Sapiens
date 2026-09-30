# Temperatura e calore

In laboratorio si scalda una soluzione sulla piastra, si raffredda una provetta nel ghiaccio, e si vede un bicchiere d'acqua diventare caldo mentre ci si scioglie la soda caustica, o gelido mentre ci si scioglie il nitrato d'ammonio. Per parlare di tutto questo servono due grandezze diverse, che nel linguaggio di tutti i giorni si confondono: la temperatura, che dice quanto un corpo è caldo, e il calore, che è l'energia che passa da un corpo all'altro.

## La temperatura

La **temperatura** è la grandezza che dice quanto un corpo è caldo o freddo, e si misura con il **termometro**. È una grandezza intensiva: un bicchiere e una vasca d'acqua presi dallo stesso rubinetto hanno la stessa temperatura, anche se la vasca contiene molta più acqua (le grandezze intensive sono nella lezione [Grandezze e unità del Sistema Internazionale](/materiale/scuola-superiore/chimica/misure-e-grandezze/grandezze-e-unita-del-sistema-internazionale)).

Il chimico guarda la temperatura dal punto di vista delle particelle. Atomi e molecole sono sempre in movimento: in un gas volano e urtano, in un liquido scorrono le une sulle altre, in un solido vibrano attorno a un posto fisso. La temperatura misura quanto si agitano: più alta è la temperatura, più in fretta si muovono in media le particelle. Il modello è nella lezione [Il modello particellare della materia](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia).

Il termometro misura la propria temperatura: messo a contatto con un corpo, si scalda o si raffredda finché ha la stessa temperatura del corpo, e solo allora la sua lettura è quella del corpo. Per questo una misura di temperatura si legge dopo qualche secondo, quando il valore smette di cambiare. I termometri di laboratorio sono a liquido, con una colonnina di alcol colorato che si dilata con il calore, oppure digitali, con una sonda metallica collegata a un display.

## Le scale Celsius e Kelvin

Nella scala **Celsius** lo zero è la temperatura del ghiaccio che fonde, e $100\,^\circ\text{C}$ quella dell'acqua che bolle, alla pressione di un'atmosfera. È la scala del laboratorio e della vita di tutti i giorni.

Scendendo di temperatura, le particelle si muovono sempre più piano. Esiste una temperatura sotto la quale non si può andare, lo **zero assoluto**, che vale $-273{,}15\,^\circ\text{C}$. La scala **Kelvin**, quella del Sistema Internazionale, parte proprio da lì: lo zero assoluto è $0\,\text{K}$, e un kelvin è ampio quanto un grado Celsius. Indicando con $t$ la temperatura in gradi Celsius e con $T$ quella in kelvin:

$$T = t + 273{,}15 \qquad\qquad t = T - 273{,}15$$

Quando i dati sono gradi interi, come quasi sempre negli esercizi, si usa $273$: $25\,^\circ\text{C}$ sono $298\,\text{K}$. Nella scala Kelvin non ci sono temperature negative, e il kelvin si scrive senza il simbolo di grado: $298\,\text{K}$, non "298 °K".

```tikz
% nome: scale-celsius-kelvin-laboratorio
% alt: Due scale termometriche verticali affiancate, Celsius a sinistra e Kelvin a destra, con cinque linee orizzontali che le attraversano alla stessa temperatura: acqua che bolle, 100 gradi Celsius e 373 kelvin; ghiaccio che fonde, 0 gradi Celsius e 273 kelvin; ghiaccio secco che sublima, meno 78 gradi Celsius e 195 kelvin; azoto liquido che bolle, meno 196 gradi Celsius e 77 kelvin; zero assoluto, meno 273 gradi Celsius e 0 kelvin
% svg: scale-celsius-kelvin-laboratorio-efae65a3.svg 275x210
\begin{tikzpicture}
\draw[thick] (0,-0.2) -- (0,4.8);
\draw[thick] (2.6,-0.2) -- (2.6,4.8);
\node[above] at (0,4.8) {\small Celsius};
\node[above] at (2.6,4.8) {\small Kelvin};
\foreach \y/\c/\k/\w in {4.48/$100\,^\circ$C/$373$ K/acqua che bolle, 3.28/$0\,^\circ$C/$273$ K/ghiaccio che fonde, 2.34/$-78\,^\circ$C/$195$ K/ghiaccio secco, 0.92/$-196\,^\circ$C/$77$ K/azoto liquido, 0/$-273\,^\circ$C/$0$ K/zero assoluto} {
  \draw[dashed, thin] (-0.2,\y) -- (2.8,\y);
  \node[above right, inner sep=1pt] at (0.05,\y) {\small \c};
  \node[above right, inner sep=1pt] at (2.65,\y) {\small \k};
  \node[above right, inner sep=1pt] at (3.9,\y) {\small \w};
}
\end{tikzpicture}
```

Il grado Celsius e il kelvin hanno la stessa ampiezza, quindi una **differenza di temperatura** ha lo stesso numero nelle due scale: se una soluzione passa da $20\,^\circ\text{C}$ a $50\,^\circ\text{C}$, cioè da $293\,\text{K}$ a $323\,\text{K}$,

$$\Delta T = \Delta t = 30\,\text{K} = 30\,^\circ\text{C}$$

```ad-example
Esempio 1: temperature del laboratorio in kelvin
L'etanolo bolle a $78\,^\circ\text{C}$, l'azoto liquido a $77\,\text{K}$. Quanto valgono queste temperature nell'altra scala? Di quanti kelvin è più caldo l'etanolo che bolle dell'azoto che bolle?

$$T = 78 + 273 = 351\,\text{K} \qquad\qquad t = 77 - 273 = -196\,^\circ\text{C}$$

La differenza è $351\,\text{K} - 77\,\text{K} = 274\,\text{K}$, e in gradi Celsius $78 - (-196) = 274\,^\circ\text{C}$: lo stesso numero.
```

```ad-warning
Il $+273$ solo sulle temperature, non sulle differenze
Una temperatura si converte aggiungendo $273$; una differenza di temperatura no, perché nella sottrazione i due $273$ si tolgono. Un aumento da $20\,^\circ\text{C}$ a $50\,^\circ\text{C}$ è di $30\,\text{K}$, non di $303\,\text{K}$. E con le temperature negative il segno conta: $-196 + 273$ fa $77$, non $469$.
```

Il chimico usa il kelvin soprattutto con i gas, perché le leggi dei gas valgono solo con la temperatura assoluta: raddoppiare la temperatura di un gas vuol dire passare da $300\,\text{K}$ a $600\,\text{K}$, non da $27\,^\circ\text{C}$ a $54\,^\circ\text{C}$ (si vede nella lezione [Le leggi di Charles e di Gay-Lussac](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac)). La scala Fahrenheit, che si usa negli Stati Uniti, e la taratura del termometro sono nella lezione di fisica [La temperatura e le scale termometriche](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche).

## Il calore

Due corpi a temperature diverse, messi a contatto, si scambiano energia: il più caldo si raffredda, il più freddo si scalda, finché le due temperature diventano uguali e si raggiunge l'**equilibrio termico**. L'energia che passa da un corpo all'altro per una differenza di temperatura si chiama **calore**, $Q$. Va sempre dal corpo più caldo a quello più freddo, mai al contrario.

Il calore è energia, e nel SI si misura in **joule** ($\text{J}$); in chimica si usa spesso il kilojoule, $1\,\text{kJ} = 1000\,\text{J}$. Una vecchia unità, ancora sulle etichette degli alimenti, è la **caloria**:

$$1\,\text{cal} = 4{,}186\,\text{J} \qquad\qquad 1\,\text{kcal} = 4186\,\text{J}$$

La "caloria" delle etichette è in realtà una chilocaloria.

```ad-warning
Temperatura e calore non sono la stessa cosa
La temperatura è uno stato del corpo, il calore è energia in viaggio tra due corpi. La fiamma di un fiammifero ha una temperatura altissima, ma scalda pochissimo una pentola d'acqua; un termosifone tiepido ha una temperatura bassa, ma cede alla stanza molto più calore. Un corpo non "contiene calore": si dice che assorbe o cede calore.
```

## Calore e variazione di temperatura

Quanto calore serve per scaldare un corpo? Dipende da tre cose: dalla massa (per scaldare un litro d'acqua serve più calore che per un bicchiere), da quanto deve salire la temperatura, e dalla sostanza. La dipendenza dalla sostanza si misura con il **calore specifico** $c$, il calore che serve per scaldare di un grado un grammo di quella sostanza. Il calore scambiato è

$$Q = c \cdot m \cdot \Delta t$$

dove $\Delta t = t_{finale} - t_{iniziale}$ è la variazione di temperatura. In laboratorio le masse si misurano in grammi, e il calore specifico si dà in $\text{J/(g}\cdot{}^\circ\text{C)}$:

| Sostanza | $c$ in $\text{J/(g}\cdot{}^\circ\text{C)}$ |
|---|---|
| acqua | $4{,}186$ |
| etanolo | $2{,}44$ |
| olio d'oliva | $1{,}97$ |
| alluminio | $0{,}897$ |
| vetro | $0{,}84$ |
| ferro | $0{,}449$ |
| rame | $0{,}385$ |

Sono gli stessi valori della lezione di fisica [Calore, capacità termica e calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico), dove sono dati in $\text{J/(kg}\cdot{}^\circ\text{C)}$: $4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)} = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, perché in un chilogrammo ci sono mille grammi. Un grado Celsius è ampio quanto un kelvin, quindi si può scrivere anche $\text{J/(g}\cdot\text{K)}$.

L'acqua ha il calore specifico più alto tra le sostanze comuni: per scaldarla serve molto calore, e raffreddandosi ne cede molto. Per questo in laboratorio si scalda a bagnomaria, e per questo un bicchiere d'acqua è un buon "misuratore di calore": dalla variazione della sua temperatura si ricava quanto calore ha ricevuto o ceduto.

```ad-example
Esempio 2: scaldare l'acqua di un becher
Quanto calore serve per portare $200{,}0\,\text{g}$ d'acqua da $20{,}0\,^\circ\text{C}$ a $75{,}0\,^\circ\text{C}$?

$\Delta t = 75{,}0 - 20{,}0 = 55{,}0\,^\circ\text{C}$, e

$$Q = c \cdot m \cdot \Delta t = 4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)} \cdot 200{,}0\,\text{g} \cdot 55{,}0\,^\circ\text{C} = 46\,046\,\text{J} \approx 46{,}0\,\text{kJ}$$

Il risultato è arrotondato a tre cifre, come $\Delta t$ (la regola è nella lezione [Errori di misura e cifre significative](/materiale/scuola-superiore/chimica/misure-e-grandezze/errori-di-misura-e-cifre-significative)).
```

```ad-warning
Le unità del calore specifico decidono quelle della massa
Con $c$ in $\text{J/(g}\cdot{}^\circ\text{C)}$ la massa va in grammi, con $c$ in $\text{J/(kg}\cdot{}^\circ\text{C)}$ in chilogrammi. Nell'esempio 2, con $4186$ e $200{,}0$ il calore verrebbe mille volte troppo grande, $46\,\text{MJ}$.
```

Dalla stessa formula si ricava di quanto sale la temperatura di un corpo che riceve un certo calore, $\Delta t = \dfrac{Q}{c \cdot m}$.

```ad-example
Esempio 3: l'etanolo si scalda più dell'acqua
A $100{,}0\,\text{g}$ di etanolo a $20{,}0\,^\circ\text{C}$ si danno $5{,}00\,\text{kJ}$ di calore. A che temperatura arriva? E $100{,}0\,\text{g}$ d'acqua, con lo stesso calore?

$$\Delta t = \frac{Q}{c \cdot m} = \frac{5000\,\text{J}}{2{,}44\,\text{J/(g}\cdot{}^\circ\text{C)} \cdot 100{,}0\,\text{g}} = 20{,}49\ldots\,^\circ\text{C} \approx 20{,}5\,^\circ\text{C}$$

L'etanolo arriva a $20{,}0 + 20{,}5 = 40{,}5\,^\circ\text{C}$. L'acqua, con un calore specifico quasi doppio, si scalda di $\dfrac{5000}{4{,}186 \cdot 100{,}0} = 11{,}9\,^\circ\text{C}$ e arriva a $31{,}9\,^\circ\text{C}$. Il calore dice di quanto sale la temperatura, non a quanto arriva.
```

### Il segno del calore

Quando un corpo si scalda, $\Delta t$ è positivo e anche $Q$: il corpo **assorbe** calore. Quando si raffredda, $\Delta t$ è negativo e $Q$ viene negativo: il corpo **cede** calore. In un recipiente isolato, dove il calore non esce e non entra, il calore ceduto da un corpo è tutto assorbito dagli altri.

Il chimico usa questa idea per misurare il calore che una trasformazione cede o assorbe: la fa avvenire in un bicchiere isolato pieno d'acqua, un **calorimetro**, e misura di quanto cambia la temperatura dell'acqua. Se l'acqua si scalda, la trasformazione le ha ceduto calore; se si raffredda, la trasformazione le ha preso calore. Nel primo caso la trasformazione si dice **esotermica**, nel secondo **endotermica**; le reazioni di questo tipo si studiano nella lezione [Reazioni esotermiche ed endotermiche: l'entalpia](/materiale/scuola-superiore/chimica/l-energia-delle-reazioni/reazioni-esotermiche-ed-endotermiche-l-entalpia).

```ad-example
Esempio 4: il ghiaccio istantaneo
Nelle buste di "ghiaccio istantaneo" del pronto soccorso c'è nitrato d'ammonio, che si scioglie in acqua. In un bicchiere di polistirolo con $100{,}0\,\text{g}$ d'acqua a $22{,}0\,^\circ\text{C}$ si sciolgono $10\,\text{g}$ di nitrato d'ammonio, e la temperatura scende a $15{,}0\,^\circ\text{C}$. Quanto calore ha scambiato l'acqua? La dissoluzione è esotermica o endotermica?

Trascurando il bicchiere e la massa del sale, per l'acqua

$$Q = 4{,}186\,\text{J/(g}\cdot{}^\circ\text{C)} \cdot 100{,}0\,\text{g} \cdot (15{,}0 - 22{,}0)\,^\circ\text{C} = -2930\,\text{J} \approx -2{,}9\,\text{kJ}$$

con due cifre, come $\Delta t = -7{,}0\,^\circ\text{C}$. L'acqua ha ceduto circa $2{,}9\,\text{kJ}$, e li ha presi il sale che si scioglieva: la dissoluzione del nitrato d'ammonio è endotermica. Con la soda caustica, l'idrossido di sodio, succede il contrario: l'acqua si scalda, e la dissoluzione è esotermica.
```

```ad-warning
$\Delta t$ al contrario
$\Delta t$ è sempre la temperatura finale meno quella iniziale. Chi fa iniziale meno finale trova un'acqua che assorbe calore mentre si raffredda, e sbaglia anche la conclusione: esotermica al posto di endotermica.
```

## L'equilibrio termico

Quando si mescolano due quantità d'acqua a temperature diverse, in un recipiente isolato, l'acqua calda cede calore a quella fredda finché la temperatura è la stessa dappertutto. Il calore ceduto dall'acqua calda è uguale a quello assorbito dall'acqua fredda, e il calore specifico, lo stesso per tutte e due, si semplifica:

$$m_1\,(t_1 - t_e) = m_2\,(t_e - t_2) \qquad\Rightarrow\qquad t_e = \frac{m_1\,t_1 + m_2\,t_2}{m_1 + m_2}$$

con $t_1$ la temperatura dell'acqua calda, $t_2$ quella della fredda e $t_e$ la **temperatura di equilibrio**. La temperatura di equilibrio è una media delle due temperature in cui pesa di più l'acqua che è di più, e sta sempre tra $t_2$ e $t_1$.

```ad-example
Esempio 5: acqua calda nell'acqua fredda
In un becher isolato con $300\,\text{g}$ d'acqua a $20\,^\circ\text{C}$ si versano $100\,\text{g}$ d'acqua a $80\,^\circ\text{C}$. A quale temperatura arriva l'acqua?

$$t_e = \frac{100\,\text{g} \cdot 80\,^\circ\text{C} + 300\,\text{g} \cdot 20\,^\circ\text{C}}{100\,\text{g} + 300\,\text{g}} = \frac{14\,000}{400}\,^\circ\text{C} = 35\,^\circ\text{C}$$

Più vicino a $20\,^\circ\text{C}$ che a $80\,^\circ\text{C}$, perché l'acqua fredda è il triplo della calda. La media semplice, $50\,^\circ\text{C}$, sarebbe giusta solo con due masse uguali.
```

Con sostanze diverse, come un pezzo di metallo caldo immerso nell'acqua, nel bilancio restano i calori specifici; il calcolo, il calorimetro e la misura del calore specifico di un metallo sono nella lezione di fisica [L'equilibrio termico e il calorimetro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro).

## Calore senza variazione di temperatura

Il calore non fa sempre salire la temperatura. Un becher di ghiaccio tritato sulla piastra resta a $0\,^\circ\text{C}$ finché c'è ghiaccio da fondere, e l'acqua che bolle resta a $100\,^\circ\text{C}$ finché ce n'è da far evaporare: durante un passaggio di stato il calore serve a staccare le particelle le une dalle altre, non ad agitarle di più. La formula $Q = c \cdot m \cdot \Delta t$ vale solo mentre la sostanza resta nello stesso stato; i passaggi di stato hanno le loro lezioni, [I passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato) e [Curve di riscaldamento e di raffreddamento](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/curve-di-riscaldamento-e-di-raffreddamento).
