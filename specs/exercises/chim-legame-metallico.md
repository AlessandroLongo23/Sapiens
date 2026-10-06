# Il legame metallico

Generatore: `chim-legame-metallico` (`src/lib/exercises/v2/generators/chim-legame-metallico.ts`, con
`src/lib/exercises/v2/chim3-f.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legame_metallico.py` (con
`_chim3_f.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/66-chim-legame-metallico.md`. Percorso nel database:
`high_school/chemistry/legami-chimici/chim-legame-metallico`.

Sei livelli nell'ordine della lezione. La lezione è in buona parte descrittiva: i livelli 1 e 5 e metà del 6 sono a
domande fisse; i livelli 2, 3, 4 e l'altra metà del 6 hanno dati estratti. Il livello 2 chiede un numero intero e può
andare a risposta aperta; gli altri sono a scelta multipla con quattro opzioni.

## Nomi dei livelli

1. Il modello del mare di elettroni
2. Elettroni messi in comune da un atomo
3. Gli elettroni del mare in una massa
4. Quale metallo fonde più in alto
5. Le proprietà dei metalli
6. Le leghe

## Dati

Gruppi, masse atomiche con due decimali e punti di fusione (in kelvin, convertiti in gradi Celsius e arrotondati
all'unità) da `src/lib/tools/elementi.json`. $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$.

## Livello 1: il modello del mare di elettroni

Dieci domande della lezione: di che cosa è fatto un metallo nel modello, che cos'è il legame metallico, che cosa vuol
dire delocalizzato, quali elettroni formano il mare, se il legame è direzionale, se ci sono anioni, perché non è un
legame ionico, perché il metallo è neutro, la formula di un metallo, che cosa hanno in comune i metalli.

- "Nel modello del mare di elettroni, da che cosa è formato un metallo?" Risposta: "Cationi ed elettroni liberi";
  distrattori "Cationi e anioni alternati", "Molecole di metallo", "Atomi neutri fermi".
- "Il legame metallico è direzionale?" Risposta: "No: agisce in tutte le direzioni".

## Livello 2: elettroni messi in comune da un atomo

Un metallo dei gruppi 1, 2 o 13 (litio, sodio, potassio, rubidio, cesio, berillio, magnesio, calcio, stronzio, bario,
alluminio) con il suo gruppo. Si chiede quanti elettroni mette in comune ogni atomo: i suoi elettroni di valenza. La
risposta è un numero intero.

- "Il magnesio è un metallo del gruppo $2$. Nel modello del mare di elettroni, quanti elettroni mette in comune ogni
  suo atomo?" Risposta $2$; distrattori $6$, $3$, $1$.
- "L'alluminio è un metallo del gruppo $13$. ..." Risposta $3$; distrattori $13$, $5$, $4$.

Distrattori: il numero del gruppo (per il gruppo 13), gli elettroni che mancano all'ottetto, uno in più o in meno.

## Livello 3: gli elettroni del mare in una massa

Litio, sodio, potassio, magnesio, calcio o alluminio; una massa a tre cifre che corrisponde a $0{,}0500$, $0{,}100$,
$0{,}150$, $0{,}200$, $0{,}250$, $0{,}300$, $0{,}400$ o $0{,}500\,\text{mol}$. Il testo dà gruppo, massa atomica e
$N_A$. Si chiede il numero di elettroni delocalizzati, in notazione scientifica con tre cifre.

- "Quanti elettroni delocalizzati ci sono in $6{,}08\,\text{g}$ di magnesio, metallo del gruppo $2$? La massa atomica è
  $24{,}31$; usa $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$." Risposta $3{,}01 \cdot 10^{23}$; distrattori
  $1{,}51 \cdot 10^{23}$ (gli atomi), $7{,}32 \cdot 10^{24}$, $4{,}81 \cdot 10^{24}$.
- "... in $2{,}70\,\text{g}$ di alluminio, metallo del gruppo $13$? ..." Risposta $1{,}81 \cdot 10^{23}$.

Vincoli come al livello 4 di `legame-ionico`: la risposta entro lo $0{,}6\%$ del valore esatto, nessun distrattore
entro il $5\%$.

Distrattori: gli atomi al posto degli elettroni; la massa non divisa per la massa molare; la massa molare divisa per
la massa; uno o due elettroni in più per atomo.

## Livello 4: quale metallo fonde più in alto

Due metalli, e si chiede quale ha il punto di fusione più alto e perché. Due casi, metà e metà:

- `elettroni`: stesso periodo, uno del gruppo 1 e uno del gruppo 2 (o sodio e alluminio). Risposta: quello che mette
  in comune più elettroni.
- `dimensioni`: due metalli del gruppo 1. Risposta: quello più in alto nel gruppo, "catione più piccolo".

Esempi:

- "Quale metallo ha il punto di fusione più alto, il sodio o il magnesio, e perché?" Risposta "Il magnesio: più
  elettroni in comune"; distrattori "Il sodio: catione più grande", "Il sodio: più elettroni in comune", "Il magnesio:
  meno elettroni in comune".
- "... il rubidio o il sodio ..." Risposta "Il sodio: catione più piccolo"; distrattori "Il rubidio: catione più
  grande", "Il sodio: catione più grande", "Il rubidio: catione più piccolo".

Vincolo: la regola della lezione è confermata dai punti di fusione di `elementi.json` con almeno $10\,^\circ\text{C}$ di
scarto. I passaggi riportano i due punti di fusione.

Distrattori: "catione più grande, legame più forte"; la ragione giusta data al metallo sbagliato.

## Livello 5: le proprietà dei metalli

Quattordici domande della lezione: conduzione elettrica e chi trasporta la carica, resistenza e temperatura, verso
degli elettroni, conduzione del calore, lucentezza, malleabile e duttile, perché un metallo si deforma, malleabile non
vuol dire legame debole, riconoscere un metallo o un composto ionico dalle proprietà, il mercurio.

- "In un filo di rame percorso da corrente, quali particelle si spostano lungo il filo?" Risposta: "Gli elettroni";
  distrattori "I cationi", "Gli anioni", "Gli atomi di rame".
- "Un solido non conduce da solido, conduce fuso e martellato si sbriciola. Che cos'è?" Risposta: "Un composto ionico".

## Livello 6: le leghe

Metà (`lega`): nove domande della lezione su che cos'è una lega, composizione di acciaio, ottone e bronzo, leghe di
sostituzione e interstiziali, perché una lega è più dura, se ha una formula. Metà (`carati`): la massa di oro in un
gioiello.

- "Di che cosa è fatto il bronzo?" Risposta: "Rame e stagno"; distrattori "Rame e zinco", "Ferro e carbonio", "Ferro e
  stagno".
- "Un gioiello di oro a $18$ carati ha una massa di $8{,}16\,\text{g}$. Quanti grammi di oro puro contiene?" Risposta
  $6{,}12\,\text{g}$; distrattori $2{,}04\,\text{g}$ (gli altri metalli), $1{,}47\,\text{g}$ (carati su 100),
  $10{,}88\,\text{g}$ (il rapporto rovesciato).

Vincoli del caso `carati`: carati tra 9, 12, 14, 18, 21 e 22; massa multipla di $0{,}24\,\text{g}$, tra $1{,}92$ e
$12{,}00\,\text{g}$, così la massa di oro ha due decimali esatti.

## Esercizi da evitare

- Confronti tra metalli del gruppo 2: il punto di fusione non scende con regolarità (magnesio $650$, calcio $842$).
- Magnesio contro alluminio ($650$ e $660\,^\circ\text{C}$): la regola dà l'alluminio, ma lo scarto è troppo piccolo.
- Metalli di transizione al livello 4: il modello non prevede i loro punti di fusione, e la lezione lo dice.
- Domande con una risposta che dipende da come si legge il modello ("quale teoria spiega meglio...").

## Verifica

`chim_legame_metallico.py` ha tre chiavi delle risposte scritte dalla lezione (livelli 1 e 5, metà del 6); ricava gli
elettroni di valenza dal gruppo di `elementi.json`, ricalcola moli ed elettroni dai numeri del testo, applica la regola
del livello 4 e la confronta con i punti di fusione di `elementi.json` (bocciando una coppia in cui la regola e la
misura non sono d'accordo), e rifà il conto dei carati.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

Alla prima corsa il controllo ha segnalato il punto di fusione del litio: $453{,}65\,\text{K}$ sono $180{,}5\,^\circ\text{C}$,
che la lezione arrotonda a $181$; il controllo ora arrotonda il mezzo per eccesso, come la lezione.

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta spostato, distrattore uguale alla risposta, testo dell'opzione
giusta scambiato, risposta numerica cambiata, parole vietate, nessun passaggio: tutti bocciati (i dettagli nel
messaggio di consegna).
