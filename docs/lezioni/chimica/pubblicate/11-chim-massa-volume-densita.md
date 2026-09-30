# Massa, volume e densità

Un cucchiaio di sale e un cucchiaio di zucchero sembrano uguali, ma sulla bilancia il sale pesa di più; un litro d'olio e un litro d'acqua occupano lo stesso spazio, ma l'olio ha meno massa e infatti ci galleggia sopra. Per descrivere un campione di materia il chimico misura la sua massa e il suo volume, e dal loro rapporto ricava la densità, una grandezza che non dipende da quanto campione c'è e che aiuta a riconoscere una sostanza.

## La massa e la bilancia

La **massa** di un corpo è la quantità di materia che contiene. Nel Sistema Internazionale si misura in chilogrammi, ma in laboratorio si usano quasi sempre i grammi e i milligrammi (le unità e i prefissi sono nella lezione [Grandezze e unità del Sistema Internazionale](/materiale/scuola-superiore/chimica/misure-e-grandezze/grandezze-e-unita-del-sistema-internazionale)). La massa si misura con la **bilancia**, e nei laboratori di chimica ce ne sono di due tipi:

- la **bilancia tecnica**, che mostra i centesimi di grammo ($0{,}01\,\text{g}$), per le pesate di tutti i giorni;
- la **bilancia analitica**, che mostra i decimi di milligrammo ($0{,}0001\,\text{g}$), chiusa in una cabina di vetro con gli sportelli, perché a quella sensibilità anche una corrente d'aria sposta l'ultima cifra.

Un reagente non si appoggia mai direttamente sul piatto della bilancia: si pesa in un recipiente, un vetrino da orologio, una navicella di plastica o un becher. Prima di pesare si fa la **tara**, cioè si azzera la bilancia con il recipiente vuoto sopra, così il display mostra solo la massa di quello che si aggiunge.

Quando la tara non si può fare, si pesa **per differenza**: si pesa il recipiente vuoto, poi il recipiente con il campione, e la massa del campione è la differenza delle due letture.

$$m = m_{pieno} - m_{vuoto}$$

```ad-warning
Il recipiente non fa parte del campione
Se un becher vuoto pesa $48{,}62\,\text{g}$ e con il liquido $68{,}35\,\text{g}$, la massa del liquido è $19{,}73\,\text{g}$, non $68{,}35\,\text{g}$. Nei conti della densità la massa è sempre quella del solo campione.
```

```ad-note
Massa e peso
Nel linguaggio di tutti i giorni si dice "pesare", ma la bilancia misura la massa, e il risultato è in grammi. Il peso è una forza, si misura in newton, e cambia da un pianeta all'altro, mentre la massa no: la differenza è nella lezione di fisica [La forza-peso e la massa](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa).
```

## Il volume e la vetreria

Il **volume** di un corpo è lo spazio che occupa. Nel SI si misura in metri cubi, in laboratorio in litri e millilitri: $1\,\text{L} = 1\,\text{dm}^3$ e $1\,\text{mL} = 1\,\text{cm}^3$. Il volume dei liquidi si misura con la vetreria, e ogni recipiente ha il suo compito.

```tikz
% nome: vetreria-volumi
% alt: Sei recipienti di vetro in fila, disegnati di lato con un po' di liquido azzurro: un becher, una beuta a forma di cono, un cilindro graduato alto e stretto con le tacche, una buretta lunghissima con il rubinetto in basso, una pipetta tarata con il rigonfiamento al centro e una sola tacca in alto, un matraccio tarato con il collo lungo e una sola tacca sul collo
% svg: vetreria-volumi-6e6de3e7.svg 354x152
\begin{tikzpicture}
% becher
\fill[cyan!20] (0,0) rectangle (1.0,0.6);
\draw[thin] (0,0.6) -- (1.0,0.6);
\draw[thick] (-0.08,1.3) -- (0,1.22) -- (0,0) -- (1.0,0) -- (1.0,1.22);
\foreach \y in {0.4,0.8} \draw[thin] (0.75,\y) -- (1.0,\y);
\node[below] at (0.5,-0.1) {\small becher};
% beuta
\begin{scope}[xshift=0.25cm]
\fill[cyan!20] (1.5,0) -- (2.7,0) -- (2.48,0.5) -- (1.72,0.5) -- cycle;
\draw[thin] (1.72,0.5) -- (2.48,0.5);
\draw[thick] (1.95,1.5) -- (1.95,1.05) -- (1.5,0) -- (2.7,0) -- (2.25,1.05) -- (2.25,1.5);
\node[below] at (2.1,-0.1) {\small beuta};
\end{scope}
% cilindro graduato
\begin{scope}[xshift=0.6cm]
\fill[cyan!20] (3.2,0.15) rectangle (3.6,1.4);
\draw[thin] (3.2,1.4) -- (3.6,1.4);
\draw[thick] (3.2,2.4) -- (3.2,0.15) -- (3.6,0.15) -- (3.6,2.4);
\draw[thick] (3.0,0) -- (3.8,0) -- (3.8,0.15) -- (3.0,0.15) -- cycle;
\foreach \y in {0.4,0.6,...,2.2} \draw[thin] (3.2,\y) -- (3.32,\y);
\node[below] at (3.4,-0.1) {\small cilindro};
\end{scope}
% buretta
\begin{scope}[xshift=0.95cm]
\fill[cyan!20] (4.3,0.9) rectangle (4.5,2.4);
\draw[thin] (4.3,2.4) -- (4.5,2.4);
\draw[thick] (4.3,3.3) -- (4.3,0.9) -- (4.36,0.7) -- (4.36,0.25) -- (4.4,0.05) -- (4.44,0.25) -- (4.44,0.7) -- (4.5,0.9) -- (4.5,3.3);
\draw[thick, fill=gray!20] (4.22,0.5) rectangle (4.58,0.62);
\foreach \y in {1.1,1.3,...,3.1} \draw[thin] (4.3,\y) -- (4.38,\y);
\node[below] at (4.4,-0.1) {\small buretta};
\end{scope}
% pipetta tarata
\begin{scope}[xshift=1.35cm]
\fill[cyan!20] (5.37,0.2) -- (5.43,0.2) -- (5.43,0.9) -- (5.55,1.05) -- (5.55,1.65) -- (5.43,1.8) -- (5.43,2.5) -- (5.37,2.5) -- (5.37,1.8) -- (5.25,1.65) -- (5.25,1.05) -- (5.37,0.9) -- cycle;
\draw[thick] (5.37,3.3) -- (5.37,1.8) -- (5.25,1.65) -- (5.25,1.05) -- (5.37,0.9) -- (5.39,0.05) -- (5.41,0.05) -- (5.43,0.9) -- (5.55,1.05) -- (5.55,1.65) -- (5.43,1.8) -- (5.43,3.3);
\draw[thin] (5.3,2.5) -- (5.5,2.5);
\node[below] at (5.4,-0.1) {\small pipetta};
\end{scope}
% matraccio tarato
\begin{scope}[xshift=1.75cm]
\fill[cyan!20] (6.1,0) -- (7.1,0) .. controls (7.3,0.35) and (7.1,0.8) .. (6.7,0.95) -- (6.7,1.8) -- (6.5,1.8) -- (6.5,0.95) .. controls (6.1,0.8) and (5.9,0.35) .. (6.1,0) -- cycle;
\draw[thin] (6.5,1.8) -- (6.7,1.8);
\draw[thick] (6.5,2.4) -- (6.5,0.95) .. controls (6.1,0.8) and (5.9,0.35) .. (6.1,0) -- (7.1,0) .. controls (7.3,0.35) and (7.1,0.8) .. (6.7,0.95) -- (6.7,2.4);
\draw[thin] (6.45,1.8) -- (6.75,1.8);
\node[below] at (6.6,-0.1) {\small matraccio};
\end{scope}
\end{tikzpicture}
```

La vetreria si divide in due famiglie. Quella **graduata** ha una scala di tacche e misura volumi diversi; quella **tarata** ha una sola tacca e misura un solo volume, con molta precisione.

| Strumento | A che cosa serve | Precisione tipica |
|---|---|---|
| becher, beuta | contenere, mescolare, scaldare | le tacche sono solo indicative |
| cilindro graduato | misurare un volume in fretta | un cilindro da $100\,\text{mL}$ ha tacche da $1\,\text{mL}$ |
| buretta | erogare un volume goccia a goccia | tacche da $0{,}1\,\text{mL}$ su $50\,\text{mL}$ |
| pipetta tarata | prelevare un volume preciso | $10{,}00\,\text{mL}$ con meno di $0{,}02\,\text{mL}$ di differenza |
| matraccio tarato | preparare un volume preciso di soluzione | $250{,}0\,\text{mL}$ con meno di $0{,}2\,\text{mL}$ di differenza |

La buretta è un tubo lungo con un rubinetto in fondo, e la sua scala ha lo zero in alto: i numeri crescono verso il basso, perché dicono quanto liquido è uscito. Il volume erogato è la differenza tra la lettura finale e quella iniziale, $V = V_{finale} - V_{iniziale}$. La pipetta si riempie con una pompetta di gomma, la propipetta, e mai con la bocca. Come si scrive l'incertezza di queste misure lo spiega la lezione [Errori di misura e cifre significative](/materiale/scuola-superiore/chimica/misure-e-grandezze/errori-di-misura-e-cifre-significative).

```ad-warning
Il becher non è uno strumento di misura
Le tacche stampate su un becher o su una beuta servono per orientarsi, e possono sbagliare di qualche millilitro su cento. Per misurare un volume si usa un cilindro, una pipetta o una buretta; per preparare una soluzione di volume preciso, un matraccio.
```

### Leggere il menisco

La superficie dell'acqua in un tubo stretto non è piana: vicino al vetro si alza e forma una curva che si chiama **menisco**. Per l'acqua e per le soluzioni acquose la lettura si fa sul fondo del menisco, con l'occhio alla stessa altezza. Se l'occhio sta più in alto o più in basso, la linea che va dall'occhio al fondo del menisco incontra la scala in un altro punto, e la lettura è sbagliata: è l'**errore di parallasse**.

```tikz
% nome: menisco-buretta-cilindro
% alt: Due tratti di scala visti da vicino con il menisco dell'acqua. A sinistra un cilindro graduato con una tacca per millilitro e i numeri che crescono verso l'alto, 30, 35, 40: il fondo del menisco è sulla tacca 36. A destra una buretta con una tacca per decimo di millilitro e i numeri che crescono verso il basso, 12 in alto e 13 in basso: il fondo del menisco è sulla quarta tacca sotto il 12, cioè 12,4. In tutti e due un occhio alla stessa altezza del fondo del menisco
% svg: menisco-buretta-cilindro-9cd63150.svg 299x148
\begin{tikzpicture}
% cilindro
\fill[cyan!20] (0,0) -- (0,1.97) .. controls (0.25,1.77) and (0.45,1.75) .. (0.8,1.75) .. controls (1.15,1.75) and (1.35,1.77) .. (1.6,1.97) -- (1.6,0) -- cycle;
\draw[thin] (0,1.97) .. controls (0.25,1.77) and (0.45,1.75) .. (0.8,1.75) .. controls (1.15,1.75) and (1.35,1.77) .. (1.6,1.97);
\draw[thick] (0,3.2) -- (0,0);
\draw[thick] (1.6,3.2) -- (1.6,0);
\foreach \k in {0,...,11} \draw[thin] (0,{0.25+\k*0.25}) -- ++(0.15,0);
\draw[thick] (-1.25,1.75) .. controls (-1.1,1.90) .. (-0.9,1.75) .. controls (-1.1,1.60) .. (-1.25,1.75);
\fill (-1.0,1.75) circle (1.3pt);
\draw[dashed, thin] (-0.85,1.75) -- (0.8,1.75);
\foreach \k in {0,5,10} \draw[thin] (0,{0.25+\k*0.25}) -- ++(0.35,0);
\node[right, font=\scriptsize] at (0.35,0.25) {$30$};
\node[right, font=\scriptsize] at (0.35,1.5) {$35$};
\node[right, font=\scriptsize] at (0.35,2.75) {$40$};
\node[below] at (0.8,-0.1) {\small cilindro: $36$ mL};
% buretta
\begin{scope}[xshift=4.4cm]
\fill[cyan!20] (0,0) -- (0,2.22) .. controls (0.25,2.02) and (0.45,2.00) .. (0.8,2.00) .. controls (1.15,2.00) and (1.35,2.02) .. (1.6,2.22) -- (1.6,0) -- cycle;
\draw[thin] (0,2.22) .. controls (0.25,2.02) and (0.45,2.00) .. (0.8,2.00) .. controls (1.15,2.00) and (1.35,2.02) .. (1.6,2.22);
\draw[thick] (0,3.2) -- (0,0);
\draw[thick] (1.6,3.2) -- (1.6,0);
\foreach \k in {0,...,11} \draw[thin] (0,{0.25+\k*0.25}) -- ++(0.15,0);
\draw[thick] (-1.25,2.0) .. controls (-1.1,2.15) .. (-0.9,2.0) .. controls (-1.1,1.85) .. (-1.25,2.0);
\fill (-1.0,2.0) circle (1.3pt);
\draw[dashed, thin] (-0.85,2.0) -- (0.8,2.0);
\foreach \k in {1,11} \draw[thin] (0,{0.25+\k*0.25}) -- ++(0.35,0);
\draw[thin] (0,1.75) -- ++(0.25,0);
\node[right, font=\scriptsize] at (0.35,3.0) {$12$};
\node[right, font=\scriptsize] at (0.35,0.5) {$13$};
\node[below] at (0.8,-0.1) {\small buretta: $12{,}4$ mL};
\end{scope}
\end{tikzpicture}
```

Nel cilindro i numeri crescono verso l'alto, e chi guarda dall'alto legge un volume più grande di quello vero; nella buretta crescono verso il basso, e chi guarda dall'alto legge un volume più piccolo. Nella figura qui sotto sposti l'occhio e guardi dove la linea di vista incontra la scala, nel cilindro e nella buretta.

```interattivo
% nome: lettura-menisco
% alt: Un tratto di un cilindro graduato, o di una buretta, visto da vicino con l'acqua e il suo menisco, e un occhio a sinistra che si sposta in su e in giù con un cursore o trascinandolo. Una linea tratteggiata va dall'occhio al fondo del menisco e incontra la scala in un punto segnato in rosso: è la lettura. Sotto si leggono la lettura fatta e quella giusta, che coincidono solo con l'occhio all'altezza del fondo del menisco. Due bottoni scelgono il cilindro, con i numeri che crescono verso l'alto, o la buretta, con i numeri che crescono verso il basso
```

```ad-warning
La lettura della buretta si fa due volte
Il volume erogato è la differenza di due letture, e ognuna ha il suo menisco da leggere bene. Una buretta riempita "fino allo zero" non ha bisogno di partire proprio da $0{,}0\,\text{mL}$: basta leggere e scrivere la lettura iniziale, per esempio $0{,}3\,\text{mL}$, e sottrarla alla fine.
```

### Il volume di un solido

Il volume di un solido regolare si calcola con le formule della geometria: un cubetto con lo spigolo di $2{,}0\,\text{cm}$ ha il volume di $2{,}0^3 = 8{,}0\,\text{cm}^3$. Quello di un solido irregolare, come un granulo di metallo o un sasso, si misura **per immersione**: si versa dell'acqua in un cilindro graduato e si legge il volume $V_1$, poi si immerge del tutto il solido e si legge il nuovo volume $V_2$. Il solido occupa il posto di un volume d'acqua uguale al suo, quindi

$$V = V_2 - V_1$$

Il metodo funziona se il solido non si scioglie nel liquido e non lo assorbe: un cristallo di sale nell'acqua si scioglie, e il suo volume si misura in un liquido in cui non si scioglie, come l'olio.

## La densità

A parità di volume, sostanze diverse hanno masse diverse. La grandezza che lo misura è la **densità**, il rapporto tra la massa $m$ di un campione e il suo volume $V$:

$$d = \frac{m}{V}$$

La densità dice quanta massa c'è in un'unità di volume. Nel SI si misura in chilogrammi al metro cubo ($\text{kg/m}^3$); in laboratorio si usano i grammi al millilitro ($\text{g/mL}$), che sono la stessa cosa dei grammi al centimetro cubo ($\text{g/cm}^3$). Poiché $1\,\text{g} = 10^{-3}\,\text{kg}$ e $1\,\text{mL} = 10^{-6}\,\text{m}^3$,

$$1\,\text{g/mL} = \frac{10^{-3}\,\text{kg}}{10^{-6}\,\text{m}^3} = 1000\,\text{kg/m}^3$$

Per i gas, che hanno densità mille volte più piccole, si usano i grammi al litro: l'aria ha circa $1{,}2\,\text{g/L}$.

La densità è una grandezza intensiva: un granello di rame e un filo di rame hanno masse e volumi diversissimi, ma lo stesso rapporto $m/V$. Per questo la densità, insieme alle temperature di fusione e di ebollizione, serve a riconoscere una sostanza.

| Sostanza | $d$ in $\text{g/mL}$ a $20\,^\circ\text{C}$ |
|---|---|
| aria | $0{,}0012$ |
| acetone | $0{,}79$ |
| etanolo (alcol etilico) | $0{,}789$ |
| olio d'oliva | $0{,}92$ |
| ghiaccio (a $0\,^\circ\text{C}$) | $0{,}917$ |
| acqua | $0{,}998$ |
| acqua di mare | circa $1{,}03$ |
| glicerina | $1{,}26$ |
| acido solforico concentrato | $1{,}84$ |
| cloruro di sodio (solido) | $2{,}16$ |
| alluminio | $2{,}70$ |
| ferro | $7{,}87$ |
| rame | $8{,}96$ |
| piombo | $11{,}3$ |
| mercurio | $13{,}6$ |
| oro | $19{,}3$ |

Nei conti, se non serve più precisione, la densità dell'acqua si prende $1{,}00\,\text{g/mL}$: un millilitro d'acqua ha la massa di un grammo, un litro quella di un chilogrammo.

```ad-example
Esempio 1: che liquido è?
Un becher vuoto ha la massa di $48{,}62\,\text{g}$. Con un cilindro graduato si misurano $25{,}0\,\text{mL}$ di un liquido incolore, si versano nel becher, e la bilancia segna $68{,}35\,\text{g}$. Qual è la densità del liquido? Che liquido può essere?

La massa del liquido è la differenza delle due pesate:

$$m = 68{,}35\,\text{g} - 48{,}62\,\text{g} = 19{,}73\,\text{g}$$

e la densità

$$d = \frac{m}{V} = \frac{19{,}73\,\text{g}}{25{,}0\,\text{mL}} = 0{,}7892\,\text{g/mL} \approx 0{,}789\,\text{g/mL}$$

Il risultato è arrotondato a tre cifre, come il volume; la regola è nella lezione sulle cifre significative. Nella tabella è la densità dell'etanolo; l'acetone, con $0{,}79\,\text{g/mL}$, è vicinissimo, e per distinguerli servirebbe un'altra misura, come la temperatura di ebollizione.
```

```ad-warning
La massa sopra, il volume sotto
La densità è $m/V$, non $V/m$. Nell'esempio 1, $25{,}0/19{,}73 = 1{,}27$ direbbe che il liquido è più denso dell'acqua, mentre ha meno massa dello stesso volume d'acqua. Un controllo che non costa niente: un liquido che galleggia sull'acqua ha una densità minore di $1\,\text{g/mL}$.
```

```ad-example
Esempio 2: di che metallo è il granulo?
Un granulo di metallo ha la massa di $20{,}3\,\text{g}$. In un cilindro graduato con l'acqua a $12{,}0\,\text{mL}$ lo si immerge, e l'acqua sale a $19{,}5\,\text{mL}$. Di che metallo può essere?

Il volume del granulo è $V = 19{,}5\,\text{mL} - 12{,}0\,\text{mL} = 7{,}5\,\text{mL}$, e

$$d = \frac{20{,}3\,\text{g}}{7{,}5\,\text{mL}} = 2{,}706\ldots\,\text{g/mL} \approx 2{,}7\,\text{g/mL}$$

con due cifre, come il volume. Tra i metalli della tabella è l'alluminio.
```

```ad-warning
Il volume letto non è il volume del solido
Dopo l'immersione il cilindro segna il volume dell'acqua più quello del solido: il volume del solido è la differenza $V_2 - V_1$. Con $19{,}5\,\text{mL}$ al posto di $7{,}5\,\text{mL}$ la densità dell'esempio 2 verrebbe $1{,}04\,\text{g/mL}$, quella di un metallo che quasi galleggia.
```

### Massa e volume dalla densità

Dalla formula della densità si ricavano la massa e il volume, come in un'[equazione di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere):

$$m = d \cdot V \qquad V = \frac{m}{d}$$

In laboratorio servono di continuo: un liquido si misura più comodamente con una pipetta che con una bilancia, e con la densità si passa dal volume prelevato alla massa. Prima di fare il conto, massa, volume e densità vanno scritti in unità che si accordano: $\text{g}$, $\text{mL}$ e $\text{g/mL}$, oppure $\text{kg}$, $\text{m}^3$ e $\text{kg/m}^3$.

```ad-example
Esempio 3: la massa di un volume di acido
L'acido solforico concentrato ha la densità di $1{,}84\,\text{g/mL}$. Quanto vale la massa di $25{,}0\,\text{mL}$ di acido?

$$m = d \cdot V = 1{,}84\,\text{g/mL} \cdot 25{,}0\,\text{mL} = 46{,}0\,\text{g}$$

I millilitri si semplificano, e resta la massa in grammi.
```

```ad-example
Esempio 4: il volume che contiene una massa data
Per una reazione servono $10{,}0\,\text{g}$ di etanolo, che è più comodo misurare in volume. Quanti millilitri bisogna prelevare?

$$V = \frac{m}{d} = \frac{10{,}0\,\text{g}}{0{,}789\,\text{g/mL}} = 12{,}67\ldots\,\text{mL} \approx 12{,}7\,\text{mL}$$

Il volume è più grande di $10{,}0\,\text{mL}$, perché l'etanolo è meno denso dell'acqua.
```

```ad-example
Esempio 5: un litro di mercurio
Il mercurio ha la densità di $13{,}6\,\text{g/mL}$. Quanto vale in $\text{kg/m}^3$? Quanti chilogrammi pesa un litro di mercurio?

$13{,}6\,\text{g/mL} = 13{,}6 \cdot 1000\,\text{kg/m}^3 = 13\,600\,\text{kg/m}^3$.

Un litro è $1000\,\text{mL}$, quindi $m = 13{,}6\,\text{g/mL} \cdot 1000\,\text{mL} = 13\,600\,\text{g} = 13{,}6\,\text{kg}$: una bottiglia da un litro piena di mercurio pesa quanto un secchio d'acqua da tredici litri e mezzo.
```

```ad-warning
Le unità che non si accordano
Con la densità in $\text{kg/m}^3$ e il volume in millilitri il conto non dà una massa sensata: $789\,\text{kg/m}^3 \cdot 12{,}7\,\text{mL}$ fa circa $10\,020$, ma non sono né grammi né chilogrammi. Prima si portano i dati in unità che si accordano, poi si moltiplica.
```

## Da che cosa dipende la densità

La densità di una sostanza dipende dalla temperatura. Scaldandosi quasi tutte le sostanze si dilatano: la massa resta la stessa, il volume cresce, e la densità diminuisce. Per questo le tabelle dicono sempre a quale temperatura sono misurati i valori. L'acqua fa un'eccezione tra $0$ e $4\,^\circ\text{C}$, dove scaldandosi si contrae, ed è più densa a $4\,^\circ\text{C}$; il ghiaccio è meno denso dell'acqua liquida, e galleggia.

La densità di una soluzione dipende da quanto soluto contiene. Una soluzione di cloruro di sodio è più densa dell'acqua, e lo è tanto di più quanto più sale c'è disciolto: è per questo che nel mare, e ancora di più nel Mar Morto, si galleggia meglio che in piscina. Misurare la densità di una soluzione è uno dei modi per sapere quanto è concentrata; la concentrazione è nella lezione [Le soluzioni e la concentrazione percentuale](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale).

Due liquidi che non si mescolano, messi nello stesso recipiente, si dispongono a strati: sotto il più denso, sopra il meno denso. L'olio galleggia sull'acqua, l'acqua galleggia sul mercurio. Allo stesso modo un solido galleggia su un liquido più denso di lui e affonda in un liquido meno denso: un cubetto di ghiaccio, con $0{,}917\,\text{g/mL}$, galleggia nell'acqua e affonda nell'etanolo, che ha $0{,}789\,\text{g/mL}$. Il chimico usa queste differenze per separare due liquidi con l'imbuto separatore, come spiega la lezione [Metodi di separazione dei miscugli](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/metodi-di-separazione-dei-miscugli).

```tikz
% nome: colonna-densita-liquidi
% alt: Un cilindro con tre liquidi che non si mescolano, a strati: in fondo il mercurio, grigio, con densità 13,6 grammi al millilitro; in mezzo l'acqua, azzurra, con densità 1,00; sopra l'olio, giallo, con densità 0,92. Un granulo di ferro, con densità 7,87, galleggia sul mercurio, sotto l'acqua
% svg: colonna-densita-liquidi-75ca91d1.svg 184x140
\begin{tikzpicture}
\fill[gray!60] (0,0) rectangle (1.4,0.9);
\fill[cyan!20] (0,0.9) rectangle (1.4,2.1);
\fill[yellow!20] (0,2.1) rectangle (1.4,3.0);
\draw[thin] (0,0.9) -- (1.4,0.9);
\draw[thin] (0,2.1) -- (1.4,2.1);
\draw[thin] (0,3.0) -- (1.4,3.0);
\draw[thick] (0,3.6) -- (0,0) -- (1.4,0) -- (1.4,3.6);
\draw[thick, fill=gray!20] (0.5,0.82) rectangle (0.9,1.08);
\node[right] at (1.6,2.55) {\small olio, $0{,}92$ g/mL};
\node[right] at (1.6,1.5) {\small acqua, $1{,}00$ g/mL};
\node[right] at (1.6,0.45) {\small mercurio, $13{,}6$ g/mL};
\draw[thin] (0.9,0.95) -- (1.6,1.0);
\node[right] at (1.6,1.0) {\small ferro, $7{,}87$ g/mL};
\end{tikzpicture}
```

La densità dei materiali, del legno e dei metalli, e il grafico massa-volume sono anche nella lezione di fisica [Grandezze derivate: area, volume e densità](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-derivate-area-volume-e-densita).
