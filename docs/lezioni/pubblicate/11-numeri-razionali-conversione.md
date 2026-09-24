# Numeri decimali e frazioni

Lo stesso numero si può scrivere come frazione o come numero decimale: $\dfrac{3}{4}$ e $0{,}75$ sono due scritture dello stesso numero, e così $\dfrac{1}{3}$ e $0{,}333\ldots$ Passare da una scrittura all'altra serve continuamente nelle espressioni, dove con le frazioni i conti sono esatti, e nei problemi, dove i dati arrivano spesso con la virgola.

## Numeri decimali limitati e periodici

Dividendo il numeratore di una frazione per il denominatore si ottiene un numero intero oppure uno di questi due tipi di numero decimale.

- Un **decimale limitato** ha un numero finito di cifre dopo la virgola: $0{,}75$, $2{,}35$, $0{,}108$.
- Un **decimale periodico** ha infinite cifre dopo la virgola, e da un certo punto in poi un gruppo di cifre si ripete sempre uguale. Il gruppo che si ripete è il **periodo** e si scrive una volta sola, con una barra sopra: $0{,}333\ldots = 0{,}\overline{3}$ e $1{,}4545\ldots = 1{,}\overline{45}$.

Tra la virgola e il periodo possono esserci cifre che non si ripetono: formano l'**antiperiodo**. In $0{,}25\overline{3} = 0{,}25333\ldots$ la parte intera è $0$, l'antiperiodo è $25$ e il periodo è $3$. Un periodico senza antiperiodo, come $1{,}\overline{45}$, si dice **periodico semplice**; uno con l'antiperiodo, come $0{,}25\overline{3}$, si dice **periodico misto**.

Tutti i decimali limitati e periodici si possono scrivere come frazione. Esistono anche numeri con infinite cifre decimali che non si ripetono mai, come $\pi = 3{,}14159\ldots$: quelli non sono frazioni e non sono numeri razionali.

## Da decimale limitato a frazione

Un decimale limitato conta decimi, centesimi, millesimi: $0{,}75$ sono $75$ centesimi, cioè $\dfrac{75}{100}$. Da qui la regola.

1. Al numeratore scrivi il numero senza la virgola.
2. Al denominatore scrivi $1$ seguito da tanti zeri quante sono le cifre dopo la virgola.
3. Riduci la frazione ai minimi termini dividendo per il MCD.

```ad-example
Esempio 1: 0,75
Due cifre dopo la virgola, quindi denominatore $100$. Poiché $\text{MCD}(75, 100) = 25$,

$$0{,}75 = \dfrac{75}{100} = \dfrac{75 : 25}{100 : 25} = \dfrac{3}{4}$$
```

```ad-example
Esempio 2: 2,35
La parte intera entra nel numeratore: $235$. Poiché $\text{MCD}(235, 100) = 5$,

$$2{,}35 = \dfrac{235}{100} = \dfrac{47}{20}$$
```

```ad-example
Esempio 3: 1,625
Tre cifre dopo la virgola, quindi denominatore $1000$. Poiché $\text{MCD}(1625, 1000) = 125$,

$$1{,}625 = \dfrac{1625}{1000} = \dfrac{13}{8}$$
```

```ad-example
Esempio 4: −0,08
Il segno resta davanti alla frazione. Le cifre dopo la virgola sono due, $0$ e $8$, quindi il denominatore è $100$ e non $10$:

$$-0{,}08 = -\dfrac{8}{100} = -\dfrac{2}{25}$$
```

```ad-warning
Contare male gli zeri del denominatore
In $0{,}08$ le cifre dopo la virgola sono due, quindi $0{,}08 = \dfrac{8}{100}$ e non $\dfrac{8}{10}$. Contano tutte le cifre dopo la virgola, compresi gli zeri.
```

## Da decimale periodico a frazione

La frazione che dà un numero periodico si chiama **frazione generatrice**. Una sola regola vale sia per i periodici semplici sia per i misti.

1. Al numeratore scrivi il numero senza virgola e senza barra, fermandoti alla fine del primo periodo, e sottrai il numero formato dalle cifre che vengono prima del periodo (parte intera e antiperiodo).
2. Al denominatore scrivi tanti $9$ quante sono le cifre del periodo, seguiti da tanti $0$ quante sono le cifre dell'antiperiodo.
3. Riduci la frazione ai minimi termini.

### Periodici semplici

Senza antiperiodo, al denominatore ci sono solo dei $9$.

```ad-example
Esempio 1: 0,3 periodico
Il numero senza virgola è $3$, prima del periodo c'è $0$. Il periodo ha una cifra.

$$0{,}\overline{3} = \dfrac{3 - 0}{9} = \dfrac{3}{9} = \dfrac{1}{3}$$
```

```ad-warning
Trattare un periodico come un limitato
$0{,}\overline{3}$ non è $0{,}3 = \dfrac{3}{10}$: è $\dfrac{1}{3}$. La barra indica che le cifre continuano all'infinito.
```

```ad-example
Esempio 2: 1,45 periodico
Il numero senza virgola è $145$, prima del periodo c'è la parte intera $1$. Il periodo ha due cifre, quindi il denominatore è $99$.

$$1{,}\overline{45} = \dfrac{145 - 1}{99} = \dfrac{144}{99} = \dfrac{16}{11}$$
```

```ad-warning
Dimenticare di sottrarre la parte intera
$1{,}\overline{45}$ non è $\dfrac{145}{99}$, che vale $1{,}\overline{46}$. Nel numeratore va sottratto quello che viene prima del periodo, anche quando è solo la parte intera: $\dfrac{145 - 1}{99} = \dfrac{16}{11}$.
```

### Periodici misti

Con l'antiperiodo, al denominatore si aggiungono gli zeri.

```ad-example
Esempio 3: 0,16 con periodo 6
In $0{,}1\overline{6}$ il numero senza virgola è $16$, prima del periodo c'è $1$. Periodo di una cifra e antiperiodo di una cifra: denominatore $90$.

$$0{,}1\overline{6} = \dfrac{16 - 1}{90} = \dfrac{15}{90} = \dfrac{1}{6}$$
```

```ad-warning
Dimenticare gli zeri dell'antiperiodo
$0{,}1\overline{6}$ non è $\dfrac{15}{9}$ e nemmeno $\dfrac{16}{99}$: il periodo ha una cifra e l'antiperiodo una, quindi il denominatore è $90$ e la frazione è $\dfrac{15}{90} = \dfrac{1}{6}$.
```

```ad-example
Esempio 4: 0,253 con periodo 3
In $0{,}25\overline{3}$ il numero senza virgola è $253$, prima del periodo c'è $25$. Periodo di una cifra e antiperiodo di due: denominatore $900$.

$$0{,}25\overline{3} = \dfrac{253 - 25}{900} = \dfrac{228}{900} = \dfrac{19}{75}$$
```

```ad-example
Esempio 5: 2,318 con periodo 18
In $2{,}3\overline{18}$ il numero senza virgola è $2318$, prima del periodo c'è $23$. Periodo di due cifre e antiperiodo di una: denominatore $990$.

$$2{,}3\overline{18} = \dfrac{2318 - 23}{990} = \dfrac{2295}{990} = \dfrac{51}{22}$$

Per ridurre si divide per $\text{MCD}(2295, 990) = 45$.
```

### Perché la regola funziona

L'idea è moltiplicare il numero per potenze di $10$ in modo da ottenere due numeri con la stessa coda periodica dopo la virgola, e poi sottrarli: la coda sparisce.

Prendiamo $x = 1{,}\overline{45}$. Il periodo ha due cifre, quindi moltiplichiamo per $100$:

$$100x = 145{,}\overline{45} \qquad x = 1{,}\overline{45}$$

Le cifre dopo la virgola sono le stesse, quindi sottraendo restano solo le parti intere: $100x - x = 145 - 1$, cioè $99x = 144$ e $x = \dfrac{144}{99}$.

Con un periodico misto si sposta prima la virgola oltre l'antiperiodo. Per $x = 0{,}25\overline{3}$:

$$1000x = 253{,}\overline{3} \qquad 100x = 25{,}\overline{3}$$

Sottraendo, $900x = 253 - 25 = 228$ e quindi $x = \dfrac{228}{900}$. Le potenze di $10$ da usare sono sempre queste: una sposta la virgola alla fine del primo periodo, l'altra alla fine dell'antiperiodo. La loro differenza dà i $9$ e gli $0$ del denominatore ($1000 - 100 = 900$), la differenza dei due numeri dà il numeratore.

```ad-note
Il periodo 9
Applicando la regola a $0{,}\overline{9}$ si ottiene $\dfrac{9}{9} = 1$. Non è un errore della regola: $0{,}\overline{9}$ e $1$ sono lo stesso numero. Lo conferma anche il ragionamento con le potenze di $10$: se $x = 0{,}\overline{9}$, allora $10x = 9{,}\overline{9}$ e $9x = 9$, cioè $x = 1$. Un altro modo per vederlo: $\dfrac{1}{3} = 0{,}\overline{3}$, e moltiplicando per $3$ si ha $1 = 0{,}\overline{9}$. Per questo un periodo $9$ non si usa mai: $0{,}4\overline{9}$ si scrive $0{,}5$.
```

## Limitato o periodico: lo dice il denominatore

Senza fare la divisione si può sapere che tipo di decimale darà una frazione. Prima riduci la frazione ai minimi termini, poi scomponi il denominatore in fattori primi.

- Se il denominatore ha solo i fattori $2$ e $5$, il decimale è limitato.
- Se il denominatore ha altri fattori primi, il decimale è periodico: semplice se tra i fattori non compaiono né $2$ né $5$, misto se compaiono insieme ad altri.

Il motivo della prima regola: se il denominatore contiene solo $2$ e $5$, lo si può trasformare in una potenza di $10$ moltiplicando per i fattori che mancano. Per esempio $\dfrac{3}{8} = \dfrac{3 \cdot 125}{8 \cdot 125} = \dfrac{375}{1000} = 0{,}375$. Con un fattore $3$, $7$ o $11$ al denominatore non esiste nessuna potenza di $10$ che sia un suo multiplo, perché le potenze di $10$ hanno solo i fattori $2$ e $5$.

```ad-example
Esempio: prevedere il tipo di decimale
- $\dfrac{7}{20}$: $20 = 2^2 \cdot 5$, limitato. Infatti $\dfrac{7}{20} = 0{,}35$.
- $\dfrac{4}{11}$: $11$ è primo, diverso da $2$ e $5$, periodico semplice. Infatti $\dfrac{4}{11} = 0{,}\overline{36}$.
- $\dfrac{5}{12}$: $12 = 2^2 \cdot 3$, c'è il $3$ insieme al $2$, periodico misto. Infatti $\dfrac{5}{12} = 0{,}41\overline{6}$.
- $\dfrac{21}{30}$: il $3$ al denominatore fa pensare a un periodico, ma la frazione non è ridotta. Ridotta diventa $\dfrac{7}{10}$, e infatti $\dfrac{21}{30} = 0{,}7$.
```

```ad-warning
Guardare il denominatore di una frazione non ridotta
$\dfrac{21}{30}$ dà un decimale limitato anche se $30$ contiene il fattore $3$: la regola dei fattori $2$ e $5$ vale solo dopo aver ridotto la frazione ai minimi termini.
```

## Da frazione a decimale

Per passare da una frazione al numero decimale si divide il numeratore per il denominatore, con la divisione in colonna se i numeri non permettono di farla a mente.

```ad-example
Esempio 1: 3/8
$3 : 8 = 0{,}375$. A un certo punto il resto diventa $0$ e la divisione finisce: il decimale è limitato, come previsto dal denominatore $8 = 2^3$.
```

```ad-example
Esempio 2: 5/12
Dividendo $5$ per $12$:

- $50 : 12 = 4$ con resto $2$;
- $20 : 12 = 1$ con resto $8$;
- $80 : 12 = 6$ con resto $8$.

Il resto $8$ si è già presentato: da qui in poi la divisione ripete gli stessi passi e la cifra $6$ torna all'infinito. Quindi $\dfrac{5}{12} = 0{,}41\overline{6}$.
```

Nella divisione per un numero $d$ i resti possibili sono solo $0, 1, \ldots, d - 1$: prima o poi il resto è $0$ (decimale limitato) oppure un resto si ripete, e da quel momento si ripetono anche le cifre (decimale periodico). Per questo una frazione non può dare un decimale infinito che non si ripete. Il periodo può però essere lungo: $\dfrac{2}{7} = 0{,}\overline{285714}$.

```ad-tip
Controlla con il passaggio inverso
Dopo ogni conversione dividi il numeratore della frazione per il denominatore e confronta il risultato con il decimale di partenza.
```
