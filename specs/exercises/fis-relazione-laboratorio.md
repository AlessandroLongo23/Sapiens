# La relazione di laboratorio

Generatore: `fis-relazione-laboratorio` (`src/lib/exercises/v2/generators/fis-relazione-laboratorio.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_relazione_laboratorio.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/09-fis-relazione-laboratorio.md` (note in
`docs/lezioni/fisica/note/09-fis-relazione-laboratorio.md`).

Cinque livelli a scelta multipla su situazioni che cambiano, con dati generati dove si può: riconoscere le parti
della relazione, scegliere la tabella scritta bene, confrontare il risultato con il valore atteso, capire quale misura
migliorare, riconoscere un errore sistematico dalle conclusioni.

## Nomi dei livelli

1. Le parti della relazione
2. La tabella dei dati
3. Confronto con il valore atteso
4. Quale misura migliorare
5. Cercare l'errore sistematico

## Tipi di risposta

Tutti i livelli hanno una risposta `choice` con quattro opzioni, senza `toChoice`. Le opzioni di testo sono
`\text{…}`, su più righe in `\begin{gathered}` se superano 252 px a 16 px; al livello 2 le opzioni sono tabelle
`\begin{array}{c|c}`. `values` è un'etichetta che il controllo legge: il nome della parte (`scopo`, `strumenti`, …),
il difetto della tabella (`giusta`, `senza-unita`, `unita-nelle-caselle`, `zero-mancante`, `cifre-in-piu`), la
conclusione (`compatibile`, `non-compatibile`, `diversa-sbagliata`, `rifare`, …), la grandezza da migliorare.

## Regole comuni

- Le regole della lezione: le parti in ordine (titolo, scopo, cenni teorici, materiali e strumenti, procedimento,
  dati, elaborazione dei dati, conclusioni); le tabelle con grandezza e unità nell'intestazione, solo numeri nelle
  caselle, i decimali della sensibilità; una misura è compatibile con il valore atteso se il valore atteso sta
  nell'intervallo da $\bar{x} - \Delta x$ a $\bar{x} + \Delta x$; per migliorare una misura si migliora il dato con il
  contributo più grande all'incertezza relativa (per $l^3$ il contributo è $3\,\varepsilon_l$).
- Esperimenti del biennio, sempre gli stessi nomi: densità di un cilindretto metallico (massa con la bilancia, volume
  con il cilindro graduato), periodo di un pendolo (cronometro), tempo di caduta di una pallina, allungamento di una
  molla (righello), temperatura di equilibrio di due masse d'acqua (termometro), velocità media di un carrello (metro e
  cronometro).
- Numeri scritti come la lezione (virgola `{,}`, unità dopo `\,`, risultati $(\bar{x} \pm \Delta x)$ con l'incertezza
  di una cifra significativa e il valore fino alla sua posizione).
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: le parti della relazione

Una frase presa da una relazione, e la domanda "In quale parte della relazione va questa frase?". Sette parti
possibili (tutte tranne il titolo), circa un settimo ciascuna; quattro opzioni: la parte giusta e tre altre prese a
caso tra le sei rimaste, sempre scritte con i nomi della lezione ("Scopo", "Cenni teorici", "Materiali e strumenti",
"Procedimento", "Dati", "Elaborazione dei dati", "Conclusioni").

Per ogni parte almeno quattro modelli di frase, con l'esperimento, gli strumenti e i numeri che cambiano:

- scopo: "Misurare la densità di un cilindretto metallico e riconoscere di che metallo è fatto."; "Verificare che il
  periodo del pendolo non dipende dalla massa appesa.";
- cenni teorici: "La densità è il rapporto tra massa e volume, $\rho = m / V$."; "Il periodo si ricava dal tempo di
  $10$ oscillazioni, $T = t / 10$.";
- materiali e strumenti: "Cronometro digitale, sensibilità $0{,}01$ s."; "Bilancia elettronica, portata $500$ g,
  sensibilità $0{,}1$ g.";
- procedimento: "Abbiamo riempito il cilindro graduato fino a $50$ mL e vi abbiamo calato il cilindretto."; "Abbiamo
  misurato cinque volte il tempo di $10$ oscillazioni.";
- dati: "Misura $3$: $t = 12{,}53$ s." (una riga di tabella descritta a parole); "Nella tabella $1$ sono riportate le
  cinque masse misurate, in grammi.";
- elaborazione dei dati: "$\bar{t} = \dfrac{75{,}00}{6} = 12{,}50$ s."; "L'incertezza relativa della densità è la
  somma di quelle della massa e del volume.";
- conclusioni: "La densità misurata, $(2{,}7 \pm 0{,}2)\ \text{g/cm}^3$, è compatibile con quella
  dell'alluminio."; "Per ridurre l'incertezza servirebbe un cilindro graduato con una scala più fitta."

Esempio: "Bilancia elettronica, portata $500$ g, sensibilità $0{,}1$ g." Risposta: Materiali e strumenti.

## Livello 2: la tabella dei dati

Una grandezza misurata tre volte con uno strumento di sensibilità data (tempi con il cronometro da $0{,}01$ s,
lunghezze con il righello da $0{,}1$ cm, masse con la bilancia da $0{,}1$ g o da $0{,}01$ g, temperature con il
termometro da $0{,}1\,{}^\circ\text{C}$); le tre misure sono generate, e almeno una ha lo zero finale ($0{,}60$,
$12{,}0$). "Quale tabella è scritta bene?" Quattro tabelle con le stesse misure: quella giusta e tre con un difetto
ciascuna, presi a caso tra quattro:

- `senza-unita`: l'intestazione ha la grandezza ma non l'unità;
- `unita-nelle-caselle`: l'unità è in ogni casella e non nell'intestazione;
- `zero-mancante`: la misura con lo zero finale è scritta senza ($0{,}6$);
- `cifre-in-piu`: una misura ha una cifra in più di quelle che lo strumento dà ($0{,}651$).

Ogni tabella ha due colonne: il numero della misura e la grandezza, per esempio
`\begin{array}{c|c} \text{n.} & t\ (\text{s}) \\ \hline 1 & 0{,}62 \\ 2 & 0{,}60 \\ 3 & 0{,}65 \end{array}`. I passaggi
dicono il difetto di ogni tabella sbagliata.

Esempio: tempi $0{,}62$, $0{,}60$, $0{,}65$ s con il cronometro da $0{,}01$ s. Risposta: la tabella con
$t\ (\text{s})$ nell'intestazione e $0{,}62$, $0{,}60$, $0{,}65$.

## Livello 3: confronto con il valore atteso

Un risultato e il valore atteso. "Il gruppo ha misurato la densità del cilindretto: $(2{,}6 \pm 0{,}2)\ \text{g/cm}^3$.
Il cilindretto è di alluminio, che ha la densità di $2{,}70\ \text{g/cm}^3$. Quale conclusione è giusta?" Contesti:
densità di metalli (alluminio $2{,}70$, ferro $7{,}87$, rame $8{,}96$, piombo $11{,}3\ \text{g/cm}^3$) e dell'acqua
($1{,}00\ \text{g/cm}^3$), accelerazione di gravità ($9{,}8\ \text{m/s}^2$), temperatura dell'acqua che bolle al livello
del mare ($100{,}0\,{}^\circ\text{C}$), velocità del suono nell'aria a $20\,{}^\circ\text{C}$ ($343$ m/s).

Quattro opzioni fisse, in ordine mescolato:

- `compatibile`: "compatibile: il valore atteso sta nell'intervallo della misura";
- `non-compatibile`: "non compatibile: il valore atteso è fuori dall'intervallo";
- `diversa-sbagliata`: "sbagliata: è diversa dal valore atteso";
- `rifare`: "da rifare finché non dà il valore atteso".

La risposta è `compatibile` o `non-compatibile`, metà ciascuna. Margini chiari: il valore atteso sta dentro
l'intervallo di almeno un'unità sull'ultima cifra dell'incertezza, o fuori di almeno un'unità. Quando è compatibile,
il valore misurato è diverso da quello atteso (altrimenti la trappola "diversa" non c'è).

## Livello 4: quale misura migliorare

Una formula con due dati misurati e le loro incertezze: la densità $\rho = m / V$ (massa e volume), la velocità
$v = s / t$ (distanza e tempo), l'area $A = a \cdot b$ (i due lati), la densità di un cubetto $\rho = m / l^3$ (massa e
spigolo). "Quale misura conviene migliorare per ridurre l'incertezza del risultato?" Quattro opzioni: i due dati per
nome ("la massa", "il volume"), "tutte e due allo stesso modo", "nessuna: l'incertezza del risultato non dipende dai
dati".

I contributi all'incertezza relativa ($\varepsilon_m$ e $\varepsilon_V$; $\varepsilon_m$ e $3\,\varepsilon_l$ per il
cubetto) stanno in rapporto almeno $3$, oppure sono uguali (circa una volta su cinque, e allora la risposta è "tutte e
due allo stesso modo"). Nel caso del cubetto, circa metà delle volte $\varepsilon_l$ da sola è più piccola di
$\varepsilon_m$ ma $3\,\varepsilon_l$ è più grande: la trappola dell'esponente.

Esempio: "$m = (67{,}5 \pm 0{,}1)\,\text{g}$, $V = (25 \pm 2)\,\text{mL}$." Risposta: il volume ($8\%$ contro lo
$0{,}15\%$).

## Livello 5: cercare l'errore sistematico

Una grandezza con un valore atteso noto (gli stessi contesti del livello 3), misurata più volte; il testo dà il
risultato scritto dal gruppo e il valore atteso. "Quale conclusione segue dai dati?" Quattro opzioni fisse:

- `compatibile`: "compatibile: nessun segno di errore sistematico";
- `eccesso`: "non compatibile: probabile errore sistematico che aumenta le misure";
- `difetto`: "non compatibile: probabile errore sistematico che diminuisce le misure";
- `casuali`: "non compatibile: colpa degli errori casuali, basta ripetere le misure" (sempre sbagliata: gli errori
  casuali allargano l'intervallo, non lo spostano).

Tre casi, un terzo ciascuno: compatibile; risultato più grande del valore atteso, fuori dall'intervallo di almeno tre
volte l'incertezza; risultato più piccolo, nello stesso modo. Il testo dice anche uno strumento o un metodo che può
spiegare lo spostamento, senza dire il verso (per esempio "il cronometro è stato fatto partire a mano").

Esempio: "Il periodo di un pendolo, che la teoria dà di $1{,}42$ s, è stato misurato $(1{,}51 \pm 0{,}02)\,\text{s}$."
Risposta: non compatibile, errore sistematico che aumenta le misure.

## Esercizi da evitare

- Frasi del livello 1 che potrebbero stare in due parti (una formula con i numeri dei dati è elaborazione, una
  formula letterale è cenni teorici: le frasi lo rispettano).
- Tabelle del livello 2 in cui il difetto `zero-mancante` non si vede perché nessuna misura ha lo zero finale.
- Valori attesi sul bordo dell'intervallo; incertezze troppo grandi (oltre il $20\%$).
- Al livello 4, contributi quasi uguali ma non uguali.

## Verifica

`scripts/exercises/checkers/fis_relazione_laboratorio.py` rilegge il testo: al livello 1 riconosce la frase da una
tabella di modelli scritta dalla specifica e controlla la parte; al livello 2 rilegge le misure e la sensibilità,
analizza ogni tabella (intestazione, unità, decimali) e controlla che una sola sia senza difetti; ai livelli 3 e 5
ricalcola l'intervallo, la posizione del valore atteso e i margini; al livello 4 ricalcola i contributi all'incertezza
relativa con `Rational` e il loro rapporto. Controlla anche le opzioni (quattro, diverse, quella giusta) e la quota dei
casi.

Due scelte del generatore, dove la specifica non si poteva seguire alla lettera:

- Livello 4, trappola dell'esponente: se $\varepsilon_l < \varepsilon_m$, il rapporto tra $3\,\varepsilon_l$ e
  $\varepsilon_m$ è per forza minore di $3$, quindi "rapporto almeno $3$" e "trappola" non stanno insieme. Nella
  trappola il rapporto è almeno $2$ (tra $2$ e $3$); in tutti gli altri casi resta almeno $3$, o i contributi sono
  uguali.
- Livello 1, elaborazione: la frase "L'incertezza relativa della densità è la somma di quelle della massa e del
  volume" da sola è una regola, e potrebbe stare nei cenni teorici; il generatore la scrive con i numeri
  ($\varepsilon_\rho = 0{,}005 + 0{,}080 = 0{,}085$), così è un conto.

Esito: `sample.mts fis-relazione-laboratorio 1000 all 1`, `… 50001` e `… 777001`, 5.000 esercizi ciascuno, PASS.
Tutte le formule di problema, soluzione, passaggi e opzioni dei 5.000 esercizi del seed 1 passano da KaTeX;
`width.mts` senza formule oltre la misura (opzioni fino a $240$ px su $252$).

### Errori piantati

115 su 115 bocciati:

- opzione giusta spostata, due opzioni uguali, un trattino lungo nel testo (tutti i livelli);
- un risultato sbagliato di un'unità in una frase di elaborazione (media, somma delle incertezze relative, densità,
  semidispersione, differenza), una densità dichiarata compatibile con il metallo ma lontana, l'etichetta della parte
  cambiata (livello 1);
- la tabella giusta senza unità nell'intestazione o con una cifra in più, una misura cambiata in tabella, una tabella
  difettosa etichettata come giusta (livello 2);
- il valore atteso portato sul bordo dell'intervallo, il risultato spostato dall'altra parte (compatibile che diventa
  non compatibile e viceversa, eccesso che diventa difetto), un'incertezza con due cifre significative (livelli 3 e 5);
- contributi resi quasi uguali: un caso "uguali" spostato di un'unità sull'ultima cifra, contributi in rapporto
  $1{,}6$ (livello 4).

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 512 (524), livello 2 994 (993), livello 3 803 (815), livello 4 990
(995), livello 5 981 (983). Il livello 1 è il più stretto: molte frasi dei cenni teorici e delle conclusioni hanno
poche varianti, perché le formule scritte con le lettere non cambiano.
