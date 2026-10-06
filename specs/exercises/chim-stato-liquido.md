# Lo stato liquido e la tensione di vapore

Generatore: `chim-stato-liquido` (`src/lib/exercises/v2/generators/chim-stato-liquido.ts`, con
`src/lib/exercises/v2/chim3-h.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_stato_liquido.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/74-chim-stato-liquido.md`.

Sei livelli, ognuno con una difficoltà in più: due a domande fisse sulle due metà della lezione, poi il confronto tra
tensioni di vapore, la lettura della tabella dell'acqua, la stessa lettura con la conversione tra atmosfere e
millimetri di mercurio, e infine il confronto tra tensione di vapore e pressione esterna. Tutti a scelta multipla con
quattro opzioni; nessun livello a risposta aperta, perché le risposte sono parole o numeri con unità.

## Nomi dei livelli

1. Viscosità, tensione superficiale, capillarità
2. Evaporazione e tensione di vapore
3. Il più volatile
4. Leggere la tabella della tensione di vapore
5. Con le atmosfere
6. Bolle o non bolle

## Dati

Solo le tabelle della lezione.

Tensione di vapore dell'acqua ($\text{mmHg}$): $0\,^\circ\text{C}$ $4{,}6$; $20$ $17{,}5$; $25$ $23{,}8$; $40$ $55{,}3$;
$60$ $149$; $80$ $355$; $90$ $526$; $100$ $760$; $120$ $1489$.

Tensione di vapore a $20\,^\circ\text{C}$ ($\text{mmHg}$) e temperatura di ebollizione a $1\,\text{atm}$: etere dietilico
$440$ e $35\,^\circ\text{C}$; acetone $185$ e $56\,^\circ\text{C}$; etanolo $44$ e $78\,^\circ\text{C}$; acqua $17{,}5$ e
$100\,^\circ\text{C}$. Alla temperatura di ebollizione a $1\,\text{atm}$ la tensione di vapore è $760\,\text{mmHg}$.
Dall'esempio 4: etanolo a $60\,^\circ\text{C}$, $351\,\text{mmHg}$.

Conversione: $1\,\text{atm} = 760\,\text{mmHg}$. Una pressione in atmosfere si scrive con tre cifre significative.

Le tabelle nel problema hanno due colonne: "temperatura ($^\circ\text{C}$)" o "liquido", e "tensione di vapore
($\text{mmHg}$)", con l'unità su una seconda riga dell'intestazione per stare nella larghezza del telefono.

## Livello 1: viscosità, tensione superficiale, capillarità

Venticinque domande fisse della prima metà della lezione, ognuna con la risposta e tre distrattori: che cos'è la
viscosità, come cambia con la temperatura, da che cosa dipende, viscoso e denso (olio, mercurio), il glicerolo, le
molecole lunghe degli oli, le sferette che cadono, il liquido più viscoso; la causa e la misura della tensione
superficiale, il legame con le forze, i confronti presi dalla tabella (mercurio, acqua, etanolo, etere dietilico), la
goccia sferica, l'effetto della temperatura; coesione, adesione, quando un liquido bagna, acqua su vetro e su cera, il
menisco dell'acqua e del mercurio, il tubo più sottile.

Distrattori: l'errore del riquadro "Viscoso non vuol dire denso" (la viscosità come massa in un certo volume, "Sì:
viscoso vuol dire denso", "Tredici volte maggiore"), coesione e adesione scambiate, le definizioni delle altre
grandezze della lezione.

- "Che cos'è la viscosità di un liquido?" Risposta: la resistenza che oppone allo scorrimento. Distrattori: la massa
  che c'è in un certo volume; la pressione del suo vapore; l'energia per allargare la sua superficie.
- "Che menisco forma il mercurio in un tubo di vetro sottile?" Risposta: convesso. Distrattori: concavo; piatto;
  nessun menisco.

## Livello 2: evaporazione e tensione di vapore

Venticinque domande fisse della seconda metà: quali molecole sfuggono, perché l'evaporazione raffredda, il liquido
volatile, dove e a che temperatura avviene l'evaporazione, perché è più rapida a caldo e diversa da liquido a liquido;
la tensione di vapore, l'equilibrio dinamico, da che cosa dipende e da che cosa non dipende (quantità di liquido,
volume e forma del recipiente), come cambia con la temperatura e con le forze; quando bolle un liquido, la temperatura
di ebollizione normale, montagna e pentola a pressione, di che cosa sono fatte le bolle, le bollicine d'aria.

Distrattori: gli errori dei tre riquadri (più liquido dà più tensione di vapore; l'acqua bolle sempre a
$100\,^\circ\text{C}$; le bolle sono aria), la tensione di vapore confusa con la tensione superficiale, l'equilibrio in
cui tutto si ferma, la crescita proporzionale.

- "Da che cosa dipende la tensione di vapore?" Risposta: dal liquido e dalla temperatura. Distrattori: dalla quantità
  di liquido; dal volume del recipiente; dalla forma del recipiente.
- "Di che cosa sono fatte le bolle di un liquido che bolle?" Risposta: del vapore di quel liquido. Distrattori: di
  aria; di idrogeno e ossigeno; di vuoto.

## Livello 3: il più volatile

Una tabella con tre o quattro liquidi chiamati A, B, C (e D) e la loro tensione di vapore a $20\,^\circ\text{C}$ in
$\text{mmHg}$: numeri interi tra $5$ e $600$, estratti su scala logaritmica, tali che per ogni coppia il maggiore sia
almeno $1{,}3$ volte il minore più $3$. Una domanda tra quattro, con la stessa frequenza:

| Caso | Domanda | Risposta |
|---|---|---|
| `volatile` | Qual è il più volatile? | la tensione di vapore più alta |
| `forze` | In quale le forze intermolecolari sono più intense? | la più bassa |
| `alta` | Quale bolle alla temperatura più alta, a parità di pressione esterna? | la più bassa |
| `bassa` | Quale bolle alla temperatura più bassa, a parità di pressione esterna? | la più alta |

Opzioni: "Il liquido A" e così via. Con quattro liquidi sono i quattro liquidi; con tre la quarta opzione è "Sono
volatili allo stesso modo", "Le forze sono uguali in tutti" o "Bollono alla stessa temperatura". Il distrattore
principale è l'estremo opposto.

- A $18$, B $223$, C $596$; "Quale bolle alla temperatura più alta, a parità di pressione esterna?" Risposta: il
  liquido A.
- A $57$, B $9$, C $235$, D $85$; "Qual è il più volatile?" Risposta: il liquido C.

## Livello 4: leggere la tabella della tensione di vapore

La tabella dell'acqua, intera (circa una volta su tre) o con cinque, sei o sette righe tra cui quella che serve, in
ordine di temperatura. Due casi, metà e metà:

- `temperatura`: data la pressione esterna in $\text{mmHg}$, uguale a un valore della tabella, a che temperatura bolle
  l'acqua;
- `pressione`: l'acqua bolle a una temperatura della tabella, qual è la pressione esterna.

La riga di $0\,^\circ\text{C}$ si mostra ma non si chiede. Distrattori: le righe vicine nella tabella mostrata, poi
$100\,^\circ\text{C}$ (o $760\,\text{mmHg}$), poi le altre righe.

- "... A che temperatura bolle l'acqua se la pressione esterna è $526\,\text{mmHg}$?" Risposta $90\,^\circ\text{C}$;
  distrattori $80\,^\circ\text{C}$, $100\,^\circ\text{C}$, $120\,^\circ\text{C}$.
- "... In un recipiente l'acqua bolle a $80\,^\circ\text{C}$. Qual è la pressione esterna?" Risposta
  $355\,\text{mmHg}$; distrattori $149\,\text{mmHg}$, $526\,\text{mmHg}$, $760\,\text{mmHg}$.

## Livello 5: con le atmosfere

Come il livello 4, con la pressione in atmosfere. Il testo ricorda che $1\,\text{atm} = 760\,\text{mmHg}$. Due casi,
metà e metà.

`temperatura`: la pressione esterna è $0{,}196$, $0{,}467$, $0{,}692$ o $1{,}96\,\text{atm}$, che per $760$ danno
$149$, $355$, $526$ e $1490$ (la riga $1489$); si chiede la temperatura di ebollizione dell'acqua con la tabella
dell'acqua. Distrattori come nel livello 4.

`pressione`: "A quale pressione esterna, in atmosfere, il liquido bolle a quella temperatura?" La risposta è la
tensione di vapore divisa per $760$, con tre cifre significative. Dieci dati con la stessa frequenza:

- l'acqua a $40$, $60$, $80$, $90$, $120\,^\circ\text{C}$, con la tabella dell'acqua: $0{,}0728$; $0{,}196$; $0{,}467$;
  $0{,}692$; $1{,}96\,\text{atm}$;
- i quattro liquidi a $20\,^\circ\text{C}$, con la tabella dei liquidi (tutte e quattro le righe, o tre):
  $0{,}579$; $0{,}243$; $0{,}0579$; $0{,}0230\,\text{atm}$;
- l'etanolo a $60\,^\circ\text{C}$, con la tensione di vapore nel testo: $0{,}462\,\text{atm}$.

Distrattori: il prodotto per $760$ al posto del quoziente ($113\,240\,\text{atm}$), il numero in $\text{mmHg}$ con
l'unità $\text{atm}$ ($149\,\text{atm}$), poi uno tra la riga vicina divisa per $760$ e il quoziente rovesciato
($760 : 149$).

Un dato si scarta se la quarta cifra del quoziente è a meno di $0{,}05$ da un cinque, cioè se l'arrotondamento a tre
cifre è in dubbio. Con i dati della lezione non succede mai.

- "... A che temperatura bolle l'acqua se la pressione esterna è $0{,}692\,\text{atm}$?" Risposta
  $90\,^\circ\text{C}$.
- "L'etanolo ha una tensione di vapore di $351\,\text{mmHg}$ a $60\,^\circ\text{C}$. A quale pressione esterna, in
  atmosfere, l'etanolo bolle a $60\,^\circ\text{C}$?" Risposta $0{,}462\,\text{atm}$; distrattori
  $266\,760\,\text{atm}$, $351\,\text{atm}$, $0{,}0579\,\text{atm}$.

## Livello 6: bolle o non bolle

Un liquido a una temperatura con la sua tensione di vapore, scritta nel testo, e una pressione esterna in
$\text{mmHg}$. I dati sono quindici: l'acqua alle otto temperature della tabella da $20$ a $120\,^\circ\text{C}$;
etere dietilico, acetone ed etanolo a $20\,^\circ\text{C}$ e alla loro temperatura di ebollizione a $1\,\text{atm}$
($35$, $56$, $78\,^\circ\text{C}$, con $760\,\text{mmHg}$); l'etanolo a $60\,^\circ\text{C}$. Due casi, metà e metà:

- `bolle`: la pressione esterna è uguale alla tensione di vapore;
- `evapora`: la pressione esterna è almeno $1{,}25$ volte la tensione di vapore, scelta tra $100$, $200$, $300$,
  $400$, $526$, $600$, $700$, $760$, $900$, $1000$, $1520$, $2000$, $2280\,\text{mmHg}$.

Le quattro opzioni sono sempre le stesse:

- "Bolle: la tensione di vapore uguaglia la pressione esterna";
- "Evapora ma non bolle: la tensione di vapore è minore della pressione esterna";
- "Non bolle: l'acqua bolle solo a 100 °C" (per gli altri liquidi "un liquido bolle solo a 100 °C"), l'errore del
  riquadro;
- "Non evapora né bolle: un liquido evapora solo se bolle".

Esempi:

- "L'acqua, a $90\,^\circ\text{C}$, ha una tensione di vapore di $526\,\text{mmHg}$. È in un recipiente aperto, in un
  ambiente dove la pressione esterna è $526\,\text{mmHg}$. Che cosa succede al liquido?" Risposta: bolle.
- "L'etanolo, a $60\,^\circ\text{C}$, ha una tensione di vapore di $351\,\text{mmHg}$ ... la pressione esterna è
  $760\,\text{mmHg}$ ..." Risposta: evapora ma non bolle.

## Esercizi da evitare

- Pressione esterna minore della tensione di vapore: il liquido avrebbe già bollito a una temperatura più bassa, e la
  lezione non tratta il caso.
- Pressione esterna di poco maggiore della tensione di vapore: "quasi bolle" non è una risposta.
- L'acqua che non bolle sotto $760\,\text{mmHg}$ (per esempio a $60\,^\circ\text{C}$ al livello del mare): "non bolle
  perché non è a $100\,^\circ\text{C}$" lì è una ragione difendibile, e ci sarebbero due risposte.
- L'acqua che bolle a $0\,^\circ\text{C}$ sotto $4{,}6\,\text{mmHg}$: a quella temperatura l'acqua gela.
- Temperature o pressioni che non sono righe della tabella: la lezione non interpola (l'esempio 3 conclude solo "di
  poco superiore a $120\,^\circ\text{C}$").
- Nel livello 3, liquidi con tensioni di vapore vicine, e nomi di liquidi veri: con i nomi lo studente risponderebbe a
  memoria senza leggere i numeri.
- Nel livello 5, pressioni in atmosfere sotto i $40\,^\circ\text{C}$ dell'acqua nella tabella dell'acqua ($0{,}00605$)
  e la riga di $100\,^\circ\text{C}$ ($1{,}00\,\text{atm}$, dove dividere non serve).
- Opzioni con le unità della viscosità o della tensione superficiale: il controllo legge le opzioni come testo.

## Verifica

`chim_stato_liquido.py` ha le chiavi delle risposte dei livelli 1 e 2 scritte dalla lezione e una copia sua delle
tabelle. Rilegge il testo e la tabella del problema: nel livello 3 controlla l'intervallo e la distanza dei numeri e
trova il massimo o il minimo; nei livelli 4 e 5 controlla che ogni riga mostrata sia della lezione, trova la riga
chiesta, converte con $760$ e arrotonda a tre cifre con frazioni esatte; nel livello 6 controlla che il dato sia della
lezione e confronta le due pressioni. Controlla anche che le opzioni siano quelle previste e che il loro valore
corrisponda al testo. Le quote dei casi dei livelli 3, 4, 5 e 6 sono in `CASE_RANGES`.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dentro gli intervalli.
`review.mts` e `width.mts` con codice 0 (opzioni al più 202 px su 252, tabelle al più 323 px su 350).

### Errori piantati

Su 360 esercizi (60 per livello, seed da 300): indice dell'opzione giusta spostato, testo dell'opzione giusta scambiato
con un distrattore, distrattore reso uguale alla risposta: bocciati 360 su 360. Un dato del testo cambiato (un numero
fuori intervallo nel livello 3, una riga della tabella nel 4, la conversione nel 5, la pressione esterna nel 6, la
domanda nei livelli 1 e 2): bocciati 377 su 377.
