# La teoria cinetico-molecolare

Un profumo spruzzato in un angolo della stanza si sente dall'altra parte dopo pochi secondi, una siringa piena d'aria si comprime con un dito, un pallone si gonfia fino a riempire tutto lo spazio che ha. Nessun solido e nessun liquido si comporta così. La teoria cinetico-molecolare spiega il comportamento dei gas con un modello semplice: il gas è fatto di particelle piccolissime, lontane tra loro, che si muovono di continuo. Da questo modello vengono tutte le leggi dei gas di questo capitolo.

## Il modello del gas

La [teoria particellare della materia](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia) dice che ogni sostanza è fatta di particelle: atomi, come nell'elio e nell'argon, o molecole, come nell'ossigeno $\mathrm{O_2}$, nell'azoto $\mathrm{N_2}$ e nell'anidride carbonica $\mathrm{CO_2}$. Nei solidi e nei liquidi le particelle sono a contatto; nei [gas](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/gli-stati-di-aggregazione) sono lontane l'una dall'altra, e questo cambia tutto.

La **teoria cinetico-molecolare** descrive un gas ideale, cioè un gas modello, con cinque ipotesi:

1. Il gas è formato da un numero enorme di particelle, piccolissime rispetto alla distanza che le separa: il volume occupato dalle particelle stesse è trascurabile rispetto al volume del recipiente.
2. Le particelle si muovono di continuo e in modo disordinato, in linea retta, in tutte le direzioni e con velocità diverse.
3. Tra un urto e l'altro le particelle non si attraggono e non si respingono: non ci sono forze tra loro.
4. Gli urti tra le particelle e contro le pareti del recipiente sono elastici: l'energia cinetica totale delle particelle non cambia.
5. L'energia cinetica media delle particelle è direttamente proporzionale alla temperatura assoluta del gas.

```tikz
% nome: cinetica-gas-particelle
% alt: Un recipiente chiuso, visto in sezione, con una dozzina di particelle di gas lontane tra loro; ogni particella ha una freccia blu scuro che indica la sua velocità, con direzioni tutte diverse e lunghezze diverse
% svg: cinetica-gas-particelle-ecdc1622.svg 193x118
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (5,3);
\foreach \x/\y/\a/\l in {0.6/0.5/35/0.7, 1.5/2.3/-60/0.5, 2.2/1.1/170/0.8, 3.1/2.5/20/0.45, 4.2/0.7/110/0.6, 3.6/1.6/-150/0.9, 0.8/1.7/80/0.4, 2.7/0.4/-20/0.55, 4.4/2.2/-100/0.5, 1.7/0.9/-135/0.35, 2.4/2.0/45/0.65, 0.5/2.6/-10/0.5} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:\l);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
}
\end{tikzpicture}
```

Il modello è una semplificazione: le particelle vere hanno un volume, e un po' si attraggono. Le ipotesi 1 e 3 però sono quasi vere quando il gas è rarefatto, cioè a pressione bassa, e quando le particelle sono veloci, cioè a temperatura alta. Nell'aria che respiri le molecole occupano circa un millesimo del volume, il resto è spazio vuoto, e l'aria si comporta come un gas ideale con un'ottima approssimazione.

## Le proprietà dei gas spiegate dal modello

Le ipotesi della teoria non sono inventate a caso: ognuna spiega qualcosa che si osserva.

- Un gas si comprime facilmente, perché tra le particelle c'è molto spazio vuoto: comprimere vuol dire avvicinarle. Un liquido invece quasi non si comprime, perché le sue particelle sono già a contatto.
- Un gas occupa tutto il volume del recipiente, qualunque sia la forma: le particelle si muovono in tutte le direzioni e nessuna forza le tiene insieme, quindi arrivano dappertutto.
- Un gas ha una densità molto piccola: un litro d'aria ha una massa di circa $1{,}2\,\text{g}$, un litro d'acqua di $1000\,\text{g}$. Nello stesso volume ci sono molte meno particelle.
- Due gas si mescolano da soli, senza bisogno di agitarli: le particelle dell'uno si infilano negli spazi vuoti tra quelle dell'altro. Questo mescolamento spontaneo si chiama **diffusione**.
- Un gas chiuso in un recipiente preme sulle pareti: le particelle ci sbattono contro di continuo, e ogni urto dà una piccola spinta. È la [pressione del gas](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas), il tema della prossima lezione.

La diffusione non è istantanea, anche se le particelle sono velocissime. Ogni particella urta le altre miliardi di volte al secondo, e dopo ogni urto cambia direzione: il suo cammino è una linea spezzata che va avanti e indietro, e per attraversare una stanza le servono secondi o minuti, non millesimi di secondo.

```ad-warning
Nel gas le particelle non si toccano sempre
Un errore frequente è disegnare un gas come un liquido, con le particelle vicine, o pensare che tra una particella e l'altra ci sia aria. Tra le particelle di un gas non c'è niente: c'è il vuoto. L'aria stessa è un gas, fatto di molecole di azoto e di ossigeno e di atomi di argon, lontani tra loro.
```

## Temperatura ed energia delle particelle

Una particella di massa $m$ che si muove con velocità $v$ ha un'[energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica)

$$E_c = \frac{1}{2}\,m\,v^2$$

In un gas le particelle non vanno tutte alla stessa velocità: gli urti ne accelerano alcune e ne rallentano altre, e in ogni istante ci sono particelle lente e particelle veloci. Quello che conta è l'**energia cinetica media**, la media su tutte le particelle. La quinta ipotesi dice che questa energia media è proporzionale alla temperatura assoluta $T$:

$$\overline{E_c} \propto T$$

Scaldare un gas vuol dire far muovere più in fretta le sue particelle; raffreddarlo vuol dire rallentarle. La temperatura, vista dalle particelle, è una misura della loro agitazione.

```tikz
% nome: cinetica-temperatura-velocita
% alt: Due recipienti uguali con le stesse particelle di gas: a sinistra, a 200 kelvin, le frecce delle velocità sono corte; a destra, a 800 kelvin, le frecce sono lunghe il doppio, perché a temperatura quattro volte più alta le particelle vanno in media due volte più veloci
% svg: cinetica-temperatura-velocita-a04217fe.svg 262x116
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (3,2.4);
\draw[thick] (3.8,0) rectangle (6.8,2.4);
\foreach \x/\y/\a in {0.45/0.45/30, 0.5/1.9/10, 1.6/1.2/160, 2.5/1.95/250, 2.55/0.45/70} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:0.35);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
  \draw[-{Stealth}, thick, blue!60!black] (\x+3.8,\y) -- ++(\a:0.7);
  \fill[blue!30] (\x+3.8,\y) circle (0.09);
  \draw (\x+3.8,\y) circle (0.09);
}
\node[below] at (1.5,-0.1) {$T = 200$ K};
\node[below] at (5.3,-0.1) {$T = 800$ K};
\end{tikzpicture}
```

### La temperatura assoluta

La proporzionalità vale con la temperatura assoluta, misurata in kelvin, non con quella in gradi Celsius. Come spiega la lezione sulla [temperatura](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore), la scala Kelvin ha i gradi larghi come quelli Celsius, ma parte dallo **zero assoluto**, $-273{,}15\,^\circ\text{C}$:

$$T = t + 273{,}15 \qquad\qquad t = T - 273{,}15$$

Negli esercizi, con temperature date in gradi interi, si usa $T = t + 273$. Allo zero assoluto l'energia cinetica media delle particelle sarebbe zero: è la temperatura più bassa che possa esistere, e nella scala Kelvin non ci sono temperature negative. La temperatura assoluta si scrive con la $T$ maiuscola, e il kelvin non ha il simbolo di grado: $300\,\text{K}$, non $300\,^\circ\text{K}$.

```ad-example
Esempio 1: da Celsius a kelvin e ritorno
Il ghiaccio secco (anidride carbonica solida) sublima a $-78\,^\circ\text{C}$; il corpo umano è a $37\,^\circ\text{C}$; il filamento di una vecchia lampadina arriva a $2800\,\text{K}$. Quanto valgono le prime due temperature in kelvin, e la terza in gradi Celsius?

$$T = -78 + 273 = 195\,\text{K} \qquad T = 37 + 273 = 310\,\text{K} \qquad t = 2800 - 273 = 2527\,^\circ\text{C}$$

Con la temperatura negativa il segno conta: $-78 + 273$ fa $195$, non $351$.
```

```ad-example
Esempio 2: quando l'energia raddoppia
Un gas viene scaldato da $27\,^\circ\text{C}$ a $327\,^\circ\text{C}$. Di quanto cambia l'energia cinetica media delle sue particelle? E se lo si scalda da $20\,^\circ\text{C}$ a $40\,^\circ\text{C}$?

Si passa alle temperature assolute: $27\,^\circ\text{C}$ sono $300\,\text{K}$, $327\,^\circ\text{C}$ sono $600\,\text{K}$. La temperatura assoluta raddoppia, e con lei l'energia cinetica media:

$$\frac{\overline{E_c}\,'}{\overline{E_c}} = \frac{600\,\text{K}}{300\,\text{K}} = 2$$

Nel secondo caso i gradi Celsius raddoppiano, ma la temperatura assoluta passa da $293\,\text{K}$ a $313\,\text{K}$: il rapporto è $313/293 = 1{,}068\ldots$, e l'energia media cresce di meno del $7\%$.
```

```ad-warning
Il rapporto delle temperature in gradi Celsius
Da $20$ a $40\,^\circ\text{C}$ la temperatura non raddoppia, e l'energia delle particelle non raddoppia: lo zero della scala Celsius è il punto di fusione del ghiaccio, una scelta di comodo, e i rapporti tra gradi Celsius non hanno un significato fisico. Ogni volta che una legge dice "proporzionale alla temperatura", la temperatura va in kelvin.
```

## Particelle leggere e particelle pesanti

A una stessa temperatura tutte le particelle di gas hanno la stessa energia cinetica media, qualunque sia il gas. Ma l'energia è $\tfrac{1}{2}m v^2$: se la massa è più piccola, per avere la stessa energia la velocità deve essere più grande. A parità di temperatura, le particelle più leggere sono le più veloci.

Le velocità sono grandi. A $25\,^\circ\text{C}$ le molecole di azoto dell'aria vanno in media a circa $480\,\text{m/s}$, più veloci di un aereo di linea; quelle di idrogeno $\mathrm{H_2}$, le più leggere di tutte, a circa $1800\,\text{m/s}$.

```ad-example
Esempio 3: idrogeno e ossigeno
Un recipiente contiene idrogeno $\mathrm{H_2}$ e ossigeno $\mathrm{O_2}$ alla stessa temperatura. Le masse delle molecole stanno come le loro masse molecolari relative, $2{,}02$ e $32{,}00$ (dalla tavola della [lezione sulla mole](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)). Quante volte le molecole di idrogeno sono più veloci?

Le energie medie sono uguali, quindi $m_{\mathrm{H_2}}\,v_{\mathrm{H_2}}^2 = m_{\mathrm{O_2}}\,v_{\mathrm{O_2}}^2$, e

$$\frac{v_{\mathrm{H_2}}}{v_{\mathrm{O_2}}} = \sqrt{\frac{m_{\mathrm{O_2}}}{m_{\mathrm{H_2}}}} = \sqrt{\frac{32{,}00}{2{,}02}} = \sqrt{15{,}8\ldots} \approx 4{,}0$$

Una molecola di ossigeno pesa sedici volte una di idrogeno, e va in media quattro volte più piano.
```

Per questo i gas leggeri diffondono più in fretta. Un palloncino gonfiato con l'elio si sgonfia in un giorno, mentre uno gonfiato con l'aria dura una settimana: gli atomi di elio, leggeri e veloci, passano più spesso attraverso i piccolissimi pori della gomma (i tempi sono indicativi, da verificare). Nella figura qui sotto due recipienti uguali, alla stessa temperatura, contengono lo stesso numero di atomi: sopra elio, sotto argon, un gas dieci volte più pesante. Ognuno ha un piccolo foro verso una camera vuota. Apri i fori e guarda quale gas passa prima: gli atomi di elio, più veloci, arrivano al foro più spesso.

```interattivo
% nome: gas-effusione-foro
% alt: Due recipienti uguali, uno sopra l'altro, con una parete che ha un piccolo foro verso una camera vuota: sopra ci sono atomi di elio, piccoli e veloci, sotto atomi di argon, più grandi e lenti, tutti che rimbalzano sulle pareti e tra loro. Un bottone apre i due fori, e gli atomi di elio passano nella camera vuota circa tre volte più spesso di quelli di argon; un cursore cambia la temperatura da 100 a 600 kelvin e con lei la velocità di tutti gli atomi. Sotto la figura si leggono le velocità medie dei due gas e quanti atomi di ciascuno sono passati dal foro
```

```ad-warning
Stessa temperatura, stessa energia, velocità diverse
A una stessa temperatura non tutte le particelle hanno la stessa velocità: hanno la stessa energia cinetica media. Le molecole di un gas pesante, come l'anidride carbonica, sono più lente di quelle di un gas leggero, come l'elio, anche se i due gas sono alla stessa temperatura.
```

## Dal modello alle leggi dei gas

Lo stato di un gas si descrive con tre grandezze: la pressione $p$, il volume $V$ e la temperatura assoluta $T$, più la quantità di gas. Il modello cinetico prevede come sono legate. Se il volume diminuisce, le particelle urtano più spesso le pareti e la pressione cresce ([legge di Boyle](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-legge-di-boyle)); se la temperatura cresce, le particelle urtano più spesso e più forte, e la pressione cresce, oppure il gas si espande ([leggi di Charles e di Gay-Lussac](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/le-leggi-di-charles-e-di-gay-lussac)); se si aggiungono particelle, a parità di pressione e di temperatura il volume cresce ([principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro)). Le leggi erano state trovate con gli esperimenti, tra il Seicento e l'Ottocento; la teoria cinetica, sviluppata nell'Ottocento da Clausius, Maxwell e Boltzmann, le ha spiegate tutte con le stesse ipotesi. Chi vuole vedere il modello con gli strumenti della fisica trova la [teoria cinetica dei gas](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas) nel corso di fisica.

```ad-note
Gas ideali e gas reali
Nessun gas vero è ideale. Le particelle dei gas reali si attraggono un poco, e quando sono vicine, a pressione alta o a temperatura bassa, l'attrazione conta: il gas si discosta dalle leggi dei gas e alla fine condensa, diventando liquido. L'aria, l'azoto, l'ossigeno, l'elio e l'idrogeno, a temperatura ambiente e a pressioni vicine a quella atmosferica, seguono le leggi del gas ideale con errori di meno dell'$1\%$ (da verificare per i singoli gas).
```
