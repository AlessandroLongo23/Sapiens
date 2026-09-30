# La dispersione della luce e i colori

Un raggio di sole che attraversa un prisma di vetro esce allargato in una striscia di colori, dal rosso al violetto: gli stessi colori, nello stesso ordine, dell'arcobaleno. Nel 1666 Isaac Newton fece passare la luce del sole da un foro nella finestra di una stanza buia, la mandò su un prisma e ne studiò i colori; nel 1672 pubblicò il risultato nelle *Philosophical Transactions* della Royal Society. La sua conclusione fu che i colori non li crea il prisma: sono già tutti dentro la luce bianca, e il prisma li separa.

## Il prisma e lo spettro

Un **prisma** ottico è un blocco di vetro con due facce piane inclinate l'una rispetto all'altra. Un raggio di luce si rifrange due volte, entrando e uscendo, secondo la legge di Snell della lezione [La rifrazione e la riflessione totale](/materiale/scuola-superiore/fisica/l-ottica-geometrica/la-rifrazione-e-la-riflessione-totale): entrando si avvicina alla normale, uscendo se ne allontana, e alla fine esce deviato verso la base del prisma.

Se la luce che entra è bianca, i colori escono con deviazioni diverse: il rosso devia meno di tutti, il violetto più di tutti, e sullo schermo si forma una striscia colorata che si chiama **spettro** della luce bianca. I colori passano dall'uno all'altro senza salti; per tradizione se ne nominano sette, come fece Newton: rosso, arancione, giallo, verde, azzurro, indaco e violetto. Questa separazione dei colori si chiama **dispersione** della luce.

```tikz
% nome: prisma-dispersione-luce-bianca
% alt: Un raggio di luce bianca entra da sinistra in un prisma triangolare di vetro; dentro il prisma si divide in un raggio rosso e uno violetto, che escono dalla faccia destra deviati verso la base, il rosso meno del violetto; la separazione è esagerata per renderla visibile
% svg: prisma-dispersione-luce-bianca-8ef48dfe.svg 295x108
\definecolor{rosso}{RGB}{184,46,46}
\definecolor{violetto}{RGB}{166,94,237}
\begin{tikzpicture}[luce/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thick, fill=blue!10] (0,0) -- (3,0) -- (1.5,2.598) -- cycle;
\draw[luce] (-1.204,0.485) -- (0.675,1.169);
\draw[thick, rosso] (0.675,1.169) -- (2.306,1.202);
\draw[thick, violetto] (0.675,1.169) -- (2.355,1.117);
\draw[luce, rosso] (2.306,1.202) -- (4.425,0.613);
\draw[luce, violetto] (2.355,1.117) -- (4.287,0.065);
\node[below] at (-0.95,0.4) {\small luce bianca};
\node[right] at (4.425,0.613) {\small rosso};
\node[right] at (4.287,0.065) {\small violetto};
\end{tikzpicture}
```

Nella figura la separazione dei colori è esagerata: in un prisma di vetro comune il rosso e il violetto escono con direzioni che differiscono di un grado o due, e i colori si vedono bene solo su uno schermo lontano qualche metro.

Newton fece altre due prove. Isolò con un foro un solo colore dello spettro e lo mandò su un secondo prisma: il colore deviava, ma non si divideva più. Una luce di un solo colore come quella si chiama **monocromatica**. Poi raccolse tutti i colori dello spettro con una lente, o con un secondo prisma capovolto, e riottenne luce bianca. La luce bianca è quindi una mescolanza di tutti i colori.

```ad-warning
Il prisma non colora la luce
Un errore comune è pensare che il vetro del prisma aggiunga i colori alla luce, come un filtro. Il prisma non aggiunge niente: separa colori che la luce bianca contiene già, perché li devia in modo diverso. La prova è che, rimessi insieme, ridanno luce bianca.
```

## L'indice di rifrazione dipende dal colore

I colori si separano perché l'indice di rifrazione del vetro non è lo stesso per tutti: è un po' più piccolo per il rosso e un po' più grande per il violetto. Per la legge di Snell, a parità di angolo di incidenza, un indice più grande dà un angolo di rifrazione più piccolo, cioè una deviazione maggiore. I valori per un vetro ottico comune:

| Colore | $n$ |
|---|---|
| rosso | $1{,}514$ |
| giallo | $1{,}517$ |
| azzurro | $1{,}522$ |
| violetto | $1{,}530$ |

Le differenze sono nella terza cifra decimale, per questo nella lezione sulla rifrazione si usava un solo valore, $1{,}50$. Anche l'acqua ha un indice che cresce dal rosso ($1{,}331$) al violetto ($1{,}343$). Da $v = c/n$ si vede che nel vetro la luce rossa è un po' più veloce di quella violetta; nel vuoto invece tutti i colori viaggiano alla stessa velocità $c$, e non c'è dispersione.

```ad-example
Esempio 1: il rosso e il violetto nel vetro
Un raggio di luce bianca passa dall'aria al vetro della tabella con un angolo di incidenza di $60^\circ$. Trova l'angolo di rifrazione del rosso e del violetto.

Per il rosso, con $n = 1{,}514$:

$$\sin\theta_2 = \frac{\sin 60^\circ}{1{,}514} = 0{,}5720\ldots \qquad \theta_2 = 34{,}89\ldots^\circ \approx 34{,}9^\circ$$

Per il violetto, con $n = 1{,}530$:

$$\sin\theta_2 = \frac{\sin 60^\circ}{1{,}530} = 0{,}5660\ldots \qquad \theta_2 = 34{,}47\ldots^\circ \approx 34{,}5^\circ$$

I due raggi si separano di $0{,}4^\circ$: il violetto, con l'indice più grande, si avvicina di più alla normale. Qui gli angoli si danno al decimo di grado, perché al grado intero sarebbero tutti e due $35^\circ$ e la differenza non si vedrebbe.
```

```ad-warning
Chi devia di più
Il colore che devia di più è quello con l'indice di rifrazione più grande, il violetto, non il rosso. Per ricordarlo basta pensare allo spettro del prisma: il rosso sta dalla parte del vertice, il violetto dalla parte della base, verso cui il prisma devia la luce.
```

Nel prisma qui sotto l'indice di ogni colore viene da un vetro ottico denso, che separa i colori più del vetro comune. Cambia l'angolo con cui la luce bianca arriva sul prisma e guarda come si apre il ventaglio dei colori.

```interattivo
% nome: prisma-dispersione-colori
% alt: Un prisma triangolare di vetro; un raggio di luce bianca arriva da sinistra sulla prima faccia, con l'angolo di incidenza che si cambia trascinando l'inizio del raggio o con un cursore; dentro il prisma e all'uscita il raggio si divide in sei raggi colorati, dal rosso al violetto, che arrivano su uno schermo; sotto sono scritti l'indice del rosso e del violetto, le loro deviazioni e la differenza; un interruttore allarga la separazione per vederla meglio
```

## L'arcobaleno

L'arcobaleno è la dispersione della luce del sole nelle gocce di pioggia. Un raggio di sole entra in una goccia e si rifrange, con i colori che si separano; si riflette sulla parete opposta della goccia; esce rifrangendosi di nuovo, e i colori si separano ancora di più.

```tikz
% nome: arcobaleno-goccia
% alt: Un raggio di luce del sole entra da sinistra nella parte alta di una goccia d'acqua; dentro la goccia si separa in un raggio rosso e uno violetto, che si riflettono sulla parete opposta ed escono dalla parte bassa verso sinistra e verso il basso, il rosso più inclinato del violetto; la separazione è esagerata
% svg: arcobaleno-goccia-1d046c91.svg 159x161
\definecolor{rosso}{RGB}{184,46,46}
\definecolor{violetto}{RGB}{166,94,237}
\begin{tikzpicture}[luce/.style={thick, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}}]
\draw[thick, fill=cyan!20] (0,0) circle (1.3);
\draw[luce] (-2.26,1.12) -- (-0.66,1.12);
\draw[thick, rosso] (-0.66,1.12) -- (1.212,0.471) -- (0.271,-1.272);
\draw[thick, violetto] (-0.66,1.12) -- (1.247,0.369) -- (0.055,-1.299);
\draw[luce, rosso] (0.271,-1.272) -- (-0.761,-2.218);
\draw[luce, violetto] (0.055,-1.299) -- (-1.120,-2.060);
\node[above] at (-1.6,1.12) {\small luce del sole};
\node[below] at (-0.761,-2.218) {\small rosso};
\node[left] at (-1.120,-2.060) {\small violetto};
\end{tikzpicture}
```

Per chi guarda, la luce rossa che esce dalle gocce forma circa $42^\circ$ con la direzione dei raggi del sole, la violetta circa $41^\circ$. Perciò l'arcobaleno si vede solo con il sole alle spalle, è un arco di cerchio, e ha il rosso all'esterno e il violetto all'interno: il rosso arriva all'occhio dalle gocce che stanno un po' più in alto. A volte si vede un secondo arco più largo e più pallido, a circa $51^\circ$, con i colori in ordine inverso: viene dalla luce che nelle gocce si riflette due volte.

## Il colore dei corpi

Un corpo che non emette luce propria si vede perché diffonde verso l'occhio una parte della luce che lo illumina. Quando la luce bianca lo colpisce, alcuni colori vengono assorbiti e altri vengono diffusi: il colore del corpo è quello della luce che diffonde.

- Un corpo **bianco** diffonde tutti i colori; un corpo **nero** li assorbe tutti.
- Una foglia verde diffonde soprattutto il verde e assorbe gli altri colori; un pomodoro rosso diffonde il rosso.
- Un corpo trasparente colorato, come un vetro rosso o un filtro, lascia passare il suo colore e assorbe gli altri.

Il colore che vediamo dipende quindi anche dalla luce che illumina il corpo. Il corpo può diffondere solo i colori che riceve.

```ad-example
Esempio 2: una maglietta rossa in luce blu
Una maglietta che in luce bianca è rossa viene illuminata solo con luce blu. Di che colore appare?

La maglietta diffonde il rosso e assorbe gli altri colori, blu compreso. In luce blu non riceve rosso da diffondere, e il blu lo assorbe: non manda luce all'occhio e appare nera. In luce rossa invece appare rossa, e un foglio bianco, illuminato con la stessa luce rossa, appare anche lui rosso.
```

```ad-warning
Il colore non è solo dell'oggetto
"La maglietta è rossa" vale in luce bianca. Il colore che vediamo nasce dall'incontro tra la luce che arriva e quello che il corpo assorbe: sotto una luce colorata un corpo bianco prende il colore della luce, e un corpo di un altro colore può sembrare nero.
```

## La sintesi additiva e la sintesi sottrattiva

I colori si possono ottenere mescolandone altri in due modi diversi, a seconda che si sommino luci o si sovrappongano sostanze che assorbono.

La **sintesi additiva** somma luci colorate, per esempio tre faretti puntati sullo stesso muro bianco. Con tre luci, rossa, verde e blu, i **colori primari additivi**, si ottengono tutti gli altri:

- rosso e verde danno giallo;
- verde e blu danno ciano, un azzurro chiaro;
- blu e rosso danno magenta, un rosa porpora;
- rosso, verde e blu insieme danno bianco.

Gli schermi dei telefoni e dei televisori funzionano così: ogni punto dell'immagine è fatto di tre piccole sorgenti, rossa, verde e blu, e il colore del punto dipende da quanto è accesa ciascuna.

La **sintesi sottrattiva** avviene quando si sovrappongono filtri, o si mescolano inchiostri e colori a tempera: ogni sostanza assorbe una parte della luce bianca, e si vede quello che resta. I **colori primari sottrattivi** sono ciano, magenta e giallo, perché ciascuno assorbe uno solo dei primari additivi: il ciano assorbe il rosso, il magenta il verde, il giallo il blu. Quindi:

- giallo e ciano danno verde (restano solo i colori che nessuno dei due assorbe);
- ciano e magenta danno blu;
- magenta e giallo danno rosso;
- ciano, magenta e giallo insieme danno nero, perché assorbono tutto.

Le stampanti usano gli inchiostri ciano, magenta e giallo, più il nero per risparmiare inchiostro e avere un nero più pieno.

Lo stesso vale per il colore dei corpi: un corpo giallo diffonde il rosso e il verde e assorbe il blu, come il filtro giallo; un corpo ciano diffonde il verde e il blu, un corpo magenta il rosso e il blu.

```ad-example
Esempio 3: una banana in luce colorata
Una banana, gialla in luce bianca, viene illuminata con luce rossa, poi con luce blu. Di che colore appare?

La banana diffonde il rosso e il verde. In luce rossa diffonde il rosso che riceve, e appare rossa. In luce blu non riceve niente che possa diffondere: il blu lo assorbe, e appare nera.
```

Accendi e spegni le tre luci, o i tre filtri, e guarda i colori nelle zone in cui si sovrappongono.

```interattivo
% nome: sintesi-additiva-sottrattiva
% alt: Tre cerchi colorati che si sovrappongono in parte; con la sintesi additiva sono tre luci, rossa, verde e blu, su uno schermo scuro, e dove si sovrappongono si vedono giallo, ciano, magenta e al centro bianco; con la sintesi sottrattiva sono tre filtri, ciano, magenta e giallo, su un foglio bianco, e dove si sovrappongono si vedono blu, rosso, verde e al centro nero; ogni luce o filtro si accende e si spegne con un bottone
```

```ad-warning
Giallo e blu non fanno verde con le luci
Con le tempere giallo e blu danno un verde, perché si sottraggono. Con le luci il giallo e il blu insieme danno bianco: il giallo è già rosso più verde, e aggiungendo il blu ci sono tutti e tre i primari additivi. Prima di mescolare, chiediti se stai sommando luci o sovrapponendo sostanze che assorbono.
```
