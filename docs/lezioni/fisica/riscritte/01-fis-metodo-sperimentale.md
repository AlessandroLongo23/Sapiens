# Il metodo sperimentale

Un sasso lasciato cadere arriva a terra, un lampadario spinto oscilla, l'acqua sul fuoco bolle: la fisica studia fenomeni come questi e cerca le leggi che li governano. Per decidere se un'idea sulla natura è giusta non basta che sembri ragionevole: bisogna metterla alla prova con un esperimento, misurando. Questo modo di lavorare si chiama metodo sperimentale, e da Galileo Galilei in poi è il modo in cui la fisica va avanti.

## Che cosa studia la fisica

Di un fenomeno la fisica considera solo gli aspetti che si possono misurare: la durata di un'oscillazione, la lunghezza di un filo, la massa di un sasso, la temperatura dell'acqua. Queste proprietà misurabili si chiamano **grandezze fisiche**, e la lezione [Grandezze fisiche e unità del Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale) spiega come si misurano. Il sapore di una mela o la bellezza di un tramonto non sono grandezze fisiche: non c'è uno strumento che li misuri, e due persone possono dare giudizi diversi senza che nessuna delle due sbagli.

Una **legge fisica** è una relazione tra grandezze che gli esperimenti confermano: per esempio, come cambia la durata dell'oscillazione di un pendolo quando cambia la lunghezza del filo. Le leggi si scrivono con formule, tabelle e grafici, cioè con il linguaggio della matematica.

## Le fasi del metodo sperimentale

Il metodo sperimentale procede per fasi:

1. Osservazione: si nota un fenomeno e ci si fa una domanda precisa su di esso ("da che cosa dipende la durata di un'oscillazione?").
2. Ipotesi: si propone una risposta possibile, che si possa controllare con delle misure ("la durata dipende dalla massa appesa").
3. Esperimento: si riproduce il fenomeno in condizioni controllate, cambiando una grandezza e misurando come cambia un'altra.
4. Analisi dei dati: si ordinano le misure in una tabella o in un grafico e si guarda se c'è una regolarità.
5. Conclusione: se i dati confermano l'ipotesi, questa diventa una legge, che vale finché altri esperimenti la confermano; se i dati la smentiscono, si scarta e si torna al punto 2 con un'ipotesi nuova.

```tikz
% nome: fasi-metodo-sperimentale
% alt: Le cinque fasi del metodo sperimentale in colonna, collegate da frecce: osservazione e domanda, ipotesi, esperimento e misure, analisi dei dati, conclusione con la legge; una freccia torna dall'analisi dei dati all'ipotesi con la scritta ipotesi smentita
% svg: fasi-metodo-sperimentale-1030c075.svg 216x194
\begin{tikzpicture}
\tikzset{fase/.style={draw, thick, fill=blue!10, rounded corners=3pt, minimum width=3.8cm, minimum height=0.62cm, font=\small}}
\node[fase] (o) at (0,0) {osservazione e domanda};
\node[fase] (i) at (0,-1.1) {ipotesi};
\node[fase] (e) at (0,-2.2) {esperimento e misure};
\node[fase] (a) at (0,-3.3) {analisi dei dati};
\node[fase, fill=orange!25] (c) at (0,-4.4) {conclusione: la legge};
\draw[-{Stealth}, thick] (o) -- (i);
\draw[-{Stealth}, thick] (i) -- (e);
\draw[-{Stealth}, thick] (e) -- (a);
\draw[-{Stealth}, thick] (a) -- node[right, xshift=2pt, font=\small] {ipotesi confermata} (c);
\draw[-{Stealth}, thick] (a.east) -- ++(0.35,0) |- (i.east);
\node[right, font=\small, align=left] at (2.25,-2.2) {ipotesi\\smentita};
\end{tikzpicture}
```

Il metodo è stato descritto per la prima volta in modo chiaro da Galileo Galilei (1564-1642), che studiò la caduta dei corpi facendo rotolare sfere lungo piani inclinati e misurando i tempi. Galileo diceva che la conoscenza della natura nasce dalle "sensate esperienze", cioè dalle osservazioni e dagli esperimenti, e dalle "necessarie dimostrazioni", cioè dai ragionamenti matematici. Nel Saggiatore (1623) scrisse che il libro della natura "è scritto in lingua matematica".

```ad-warning
Un'ipotesi va controllata con delle misure
"Il pendolo oscilla perché vuole tornare giù" non è un'ipotesi utile: nessuna misura può darle torto. "La durata di un'oscillazione raddoppia se raddoppia la massa" invece sì, perché dice che cosa ci si deve aspettare da un esperimento, e l'esperimento può smentirla.
```

## Un esempio: il periodo del pendolo

Un **pendolo** è un corpo appeso a un filo che oscilla avanti e indietro. Il tempo che impiega per fare un'oscillazione completa, cioè per andare e tornare al punto di partenza, si chiama **periodo** e si indica con $T$. Si racconta che Galileo, giovane, abbia notato che le oscillazioni di una lampada nel duomo di Pisa duravano sempre lo stesso tempo, anche quando diventavano più piccole.

La domanda è: da che cosa dipende il periodo? Le grandezze che si possono cambiare sono tre: la lunghezza $L$ del filo (dal punto a cui è appeso al centro della pallina), la massa $m$ della pallina e l'**ampiezza**, cioè l'angolo di cui si sposta il filo prima di lasciarlo. Per ognuna c'è un'ipotesi da controllare.

Prova tu: cambia una grandezza alla volta, avvia il pendolo e registra il periodo nella tabella.

```interattivo
% nome: pendolo-periodo
% alt: Un pendolo appeso al soffitto, con tre cursori per la lunghezza del filo, la massa della pallina e l'ampiezza dell'oscillazione; un bottone lo fa oscillare e sotto si legge il periodo. Un secondo bottone registra la prova in una tabella: cambiando solo la massa il periodo resta di circa 2 secondi con il filo di 1 metro, cambiando la lunghezza il periodo cambia, e quadruplicando la lunghezza raddoppia.
```

```ad-example
Esempio 1: tre esperimenti sul pendolo
Una classe misura il periodo di un pendolo in tre serie di prove. Con il cronometro si misura il tempo di $10$ oscillazioni e lo si divide per $10$: così l'incertezza dovuta alla prontezza di chi preme il tasto si divide anche lei per $10$, e ogni periodo ha un'incertezza di circa $0{,}02\,\text{s}$. Cosa si può concludere?

Prima serie: filo lungo $1{,}00\,\text{m}$, ampiezza $10^\circ$, cambia la massa.

| $m$ | $50\,\text{g}$ | $100\,\text{g}$ | $200\,\text{g}$ |
|---|---|---|---|
| $T$ | $2{,}01\,\text{s}$ | $2{,}00\,\text{s}$ | $2{,}01\,\text{s}$ |

Seconda serie: massa di $100\,\text{g}$, ampiezza $10^\circ$, cambia la lunghezza.

| $L$ | $0{,}25\,\text{m}$ | $0{,}50\,\text{m}$ | $1{,}00\,\text{m}$ |
|---|---|---|---|
| $T$ | $1{,}00\,\text{s}$ | $1{,}42\,\text{s}$ | $2{,}01\,\text{s}$ |

Terza serie: filo lungo $1{,}00\,\text{m}$, massa di $100\,\text{g}$, cambia l'ampiezza.

| ampiezza | $5^\circ$ | $10^\circ$ | $20^\circ$ |
|---|---|---|---|
| $T$ | $2{,}01\,\text{s}$ | $2{,}01\,\text{s}$ | $2{,}02\,\text{s}$ |

Nella prima serie i periodi differiscono al massimo di $0{,}01\,\text{s}$, meno dell'incertezza: il periodo non dipende dalla massa. Nella seconda il periodo cambia molto di più dell'incertezza: dipende dalla lunghezza. Quando la lunghezza passa da $0{,}25\,\text{m}$ a $1{,}00\,\text{m}$, cioè diventa $4$ volte più grande, il periodo passa da $1{,}00\,\text{s}$ a $2{,}01\,\text{s}$, cioè circa raddoppia. Nella terza serie le differenze sono vicine all'incertezza: per ampiezze piccole il periodo quasi non dipende dall'ampiezza.

La conclusione è una legge: per oscillazioni piccole il periodo di un pendolo dipende solo dalla lunghezza del filo, e raddoppia quando la lunghezza diventa quattro volte più grande.
```

## Le variabili di un esperimento

In un esperimento le grandezze hanno ruoli diversi:

- la **variabile indipendente** è la grandezza che lo sperimentatore sceglie e cambia (nella seconda serie, la lunghezza del filo);
- la **variabile dipendente** è la grandezza che si misura per vedere come risponde (il periodo);
- le **grandezze da tenere costanti** sono tutte le altre che potrebbero influire sul risultato (la massa e l'ampiezza).

Un esperimento così si dice **controllato**: cambia una sola grandezza alla volta, e quindi ogni cambiamento della variabile dipendente si può attribuire a quella.

```ad-warning
Cambiare due grandezze insieme
Se tra una prova e l'altra cambiano sia la massa sia la lunghezza e il periodo cambia, non si può dire quale delle due lo ha fatto cambiare. Per sapere se il periodo dipende dalla massa si confrontano due prove in cui cambia solo la massa.
```

```ad-example
Esempio 2: quali prove confrontare
Un gruppo ha fatto quattro prove con lo stesso pendolo, ciascuna con un'ampiezza di $10^\circ$.

| prova | $L$ | $m$ | $T$ |
|---|---|---|---|
| 1 | $0{,}50\,\text{m}$ | $100\,\text{g}$ | $1{,}42\,\text{s}$ |
| 2 | $1{,}00\,\text{m}$ | $200\,\text{g}$ | $2{,}01\,\text{s}$ |
| 3 | $0{,}50\,\text{m}$ | $200\,\text{g}$ | $1{,}41\,\text{s}$ |
| 4 | $1{,}00\,\text{m}$ | $100\,\text{g}$ | $2{,}00\,\text{s}$ |

Quali prove si confrontano per sapere se il periodo dipende dalla massa? E dalla lunghezza?

Per la massa servono due prove con la stessa lunghezza e masse diverse: la 1 e la 3 (oppure la 2 e la 4). I periodi sono quasi uguali, quindi la massa non conta. Per la lunghezza servono due prove con la stessa massa: la 1 e la 4 (oppure la 3 e la 2). Le prove 1 e 2 non servono a niente: cambiano sia la lunghezza sia la massa.
```

## Misure, incertezza e riproducibilità

Nessuna misura è esatta: ogni misura ha un'incertezza, che dipende dallo strumento e da chi misura. Per questo un risultato si confronta sempre con la sua incertezza. Due periodi di $2{,}01\,\text{s}$ e $2{,}00\,\text{s}$, misurati con un'incertezza di $0{,}02\,\text{s}$, sono uguali per quello che le misure possono dire: la differenza è più piccola dell'incertezza. Due periodi di $1{,}42\,\text{s}$ e $2{,}01\,\text{s}$ sono davvero diversi. Come si stima l'incertezza lo spiegano le lezioni [Errori casuali ed errori sistematici](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/errori-casuali-ed-errori-sistematici) e [Valore medio e incertezza di una serie di misure](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/valore-medio-e-incertezza-di-una-serie-di-misure).

Un esperimento deve essere anche **riproducibile**: chiunque lo ripeta nelle stesse condizioni, in un altro laboratorio, deve trovare gli stessi risultati entro le incertezze. Per questo chi fa un esperimento descrive come lo ha fatto, con gli strumenti e le misure, in una [relazione di laboratorio](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/la-relazione-di-laboratorio).

```ad-warning
Una differenza più piccola dell'incertezza non è una scoperta
Se il periodo misurato con $50\,\text{g}$ è $2{,}01\,\text{s}$ e con $100\,\text{g}$ è $2{,}00\,\text{s}$, non si può concludere che le masse più grandi oscillano più in fretta: con un'incertezza di $0{,}02\,\text{s}$ quelle due misure sono uguali.
```

## Leggi, modelli e teorie

Una legge fisica vale nelle condizioni in cui è stata controllata. La legge del pendolo dell'esempio 1 vale per oscillazioni piccole: con un'ampiezza di $60^\circ$ il periodo è più lungo di circa il $7\%$, e la legge va corretta.

Per trovare una legge semplice, i fisici descrivono il fenomeno con un **modello**, cioè una versione semplificata della realtà che tiene solo quello che conta. Nel modello del pendolo il filo non ha massa e non si allunga, la pallina è un punto e l'aria non la frena. Nessun pendolo vero è così, ma le differenze sono più piccole delle incertezze delle misure, e il modello permette di fare previsioni. Un insieme di leggi e di modelli che spiegano molti fenomeni diversi con pochi principi si chiama **teoria**.

Una legge non si dimostra una volta per tutte: più esperimenti la confermano, più ci si fida di essa. Un solo esperimento che la smentisce, se ripetuto e confermato, obbliga invece a correggerla o a cambiarla.

```ad-example
Esempio 3: un'ipotesi smentita
Aristotele (IV secolo a.C.) sosteneva che un corpo pesante cade più in fretta di uno leggero. È un'ipotesi che si può controllare: se è giusta, un sasso di $2\,\text{kg}$ e uno di $1\,\text{kg}$ lasciati cadere insieme dalla stessa altezza arrivano a terra in tempi diversi.

Galileo fece esperimenti con sfere di masse diverse su piani inclinati e trovò che arrivavano in fondo insieme. L'ipotesi di Aristotele è smentita, e al suo posto c'è la legge di Galileo: senza l'aria, tutti i corpi cadono con lo stesso moto.

Una piuma però cade più piano di un sasso. Non è una smentita della legge: è l'aria che la frena, e la legge parla di corpi senza l'aria. Il 2 agosto 1971, sulla Luna, dove non c'è aria, l'astronauta David Scott della missione Apollo 15 lasciò cadere insieme un martello e una piuma: toccarono il suolo nello stesso istante.
```

```ad-warning
Una conferma non è una dimostrazione
Cento esperimenti che danno ragione a un'ipotesi la rendono credibile, ma non la dimostrano come si dimostra un teorema di geometria: il centunesimo, fatto in condizioni diverse, potrebbe smentirla. Le leggi della fisica si accettano perché finora nessun esperimento le ha smentite, entro il campo in cui valgono.
```
