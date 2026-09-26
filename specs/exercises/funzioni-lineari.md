# Proporzionalità diretta e inversa

Generatore: `funzioni-lineari` (`src/lib/exercises/v2/generators/funzioni-lineari.ts`). Verifica
indipendente: `scripts/exercises/checkers/funzioni_lineari.py`. Lezione collegata: "Proporzionalità
diretta e inversa" (`docs/lezioni/riscritte/45-funzioni-lineari.md`), con la sezione "Per il
generatore" della sua nota.

Lo studente riconosce il tipo di legame tra due grandezze (da una formula, da una situazione, da una
tabella), trova la costante e i valori mancanti, scrive la formula, ricava $m$ e $q$ di una funzione
lineare e risolve problemi di proporzionalità diretta, inversa e quadratica. Proporzioni e
percentuali restano al generatore `numeri-razionali-proporzioni`: qui il metodo è quello della
lezione, "calcola $k$, poi usa la formula".

## Rappresentazione

- Le tabelle sono un `array` di due righe, `x` sopra e `y` sotto, con una riga orizzontale:
  `\begin{array}{c|cccc} x & 2 & 5 & 8 \\ \hline y & 3 & 7{,}5 & 12 \end{array}`. Da tre a cinque
  colonne; il valore da trovare è un `?`. Nel `problem` la tabella sta dentro un `gathered` (livelli
  3-5) o sotto una riga di testo (livello 2, con `textBlock`), così la pagina la mostra come una
  formula sola e non la spezza. `params.xs` e `params.ys` hanno gli stessi valori come razionali
  esatti (`"5/2"`), con `"?"` al posto del valore mancante.
- Livello 1: `params.mode` è `formula` (la formula è il `problem`) oppure `situazione` (il testo è il
  `problem`, con `textBlock`; `params.story` e i numeri della storia).
- Livelli 6 e 7: problema a parole con `textBlock`, `params.story`, `params.dir` e i dati; la
  risposta si ricalcola dai soli dati.
- `params.case` dice il caso di cui la verifica controlla la quota.

## Regole comuni

- Virgola decimale (`7{,}5`), `\cdot`, frazioni con `\dfrac`. Ogni numero della tabella, della
  risposta e delle opzioni è un decimale finito con al massimo due cifre dopo la virgola (tre o
  quattro compaiono solo nei passaggi, come il rapporto $0{,}1125$ di una tabella che non è
  diretta).
- `€` mai: il testo dice "euro". I prezzi non interi hanno due decimali (`7{,}20`), anche nelle
  opzioni.
- I valori di $x$ sono positivi e diversi da zero, come chiede la lezione nella sezione sulle
  tabelle.
- Nelle formule: niente `1x`, `+ -`, termini nulli; polinomi per potenze decrescenti
  (`y = -2x + 20`).
- La risposta non è mai un numero già scritto nel testo o nella tabella.

## Livello 1: il tipo di legame da una formula o da una situazione

Quattro risposte, un quarto ciascuna: proporzionalità diretta, inversa, quadratica, funzione lineare
non proporzionale. Metà formule, metà situazioni a parole. Le opzioni sono sempre le quattro, nello
stesso ordine.

- Formule: `y = kx` con $k$ intero o decimale della lezione, `y = \dfrac{x}{n}` (diretta con
  $k = \frac{1}{n}$, trappola: la frazione fa pensare all'inversa), `\dfrac{y}{x} = k`;
  `y = \dfrac{k}{x}`, `x \cdot y = k`; `y = kx^2`, `\dfrac{y}{x^2} = k`; `y = mx + q` con $q \neq 0$,
  anche decrescente (`y = -2x + 20`, l'avviso "Diminuire non basta").
- Situazioni (quindici, con numeri a caso): mele al chilo, auto a velocità costante, stampante,
  perimetro di un poligono regolare (dirette); viaggio di lunghezza fissa, operai e giorni,
  rettangolo di area fissa, somma divisa tra amici (inverse); area del quadrato o del cerchio, stoffa
  al metro quadrato, pizza pagata a superficie (quadratiche); taxi, candela che si accorcia,
  palestra con iscrizione, vasca che si riempie (lineari).

I passaggi fanno la domanda della lezione, "se una raddoppia, che cosa fa l'altra?", e scrivono la
costante e la formula.

Esempi: `y = \dfrac{x}{4}` → diretta, perché $\dfrac{x}{4} = \dfrac{1}{4}x$. "Una candela è alta 20
cm e si accorcia di 2 cm ogni ora. Che legame c'è tra le ore passate e l'altezza della candela?" →
lineare: dopo 1 ora 18 cm, dopo 2 ore 16 cm, non si dimezza.

## Livello 2: il valore mancante in una tabella

Il testo dice il tipo ("Nella tabella $x$ e $y$ sono direttamente proporzionali"): metà dirette, metà
inverse. Tabella di 3 o 4 colonne, un solo `?`, in $y$ (7 su 10) o in $x$, mai nella prima colonna.
La prima coppia dà $k$ (rapporto o prodotto), poi si calcola il valore.

- Diretta: $k$ tra 2 e 9 oppure 0,25; 0,4; 0,5; 0,6; 0,75; 0,8; 1,2; 1,25; 1,5; 2,4; 2,5; 3,2;
  3,5; $x$ interi da 1 a 20.
- Inversa: $k$ tra i numeri con molti divisori (12, 18, 20, 24, 30, 36, … 240), $x$ interi fino a
  40 con $\dfrac{k}{x}$ decimale con al massimo una cifra e almeno 0,5.

Esempi: $x = 5, 15, ?$ e $y = 2, 6, 7{,}2$ (diretta) → $k = 0{,}4$, $x = 18$. $x = 1, 3, 4, 14$ e
$y = 84, ?, 21, 6$ (inversa) → $k = 84$, $y = 28$.

## Livello 3: la formula da una tabella

Tabella completa di quattro colonne, diretta o inversa (metà ciascuna), senza dire quale: lo
studente calcola i rapporti, e se non sono costanti i prodotti. La risposta è la formula
(`answer.kind = expression`: `y = 1{,}5x`, `y = \dfrac{36}{x}`). Stessi $k$ del livello 2.

Esempi: $x = 2, 7, 16, 19$, $y = 6, 21, 48, 57$ → $y = 3x$. $x = 3, 6, 24, 30$,
$y = 24, 12, 3, 2{,}4$ → $y = \dfrac{72}{x}$.

## Livello 4: il tipo da una tabella, tra cinque

Il procedimento della lezione: rapporto, prodotto, rapporto con il quadrato, aumenti; se nessuno è
costante, "nessuno dei quattro tipi". Un quinto per ogni risposta. Metà delle tabelle "nessuno" sono
la trappola dell'avviso "Controllare solo due coppie": le prime due coppie hanno lo stesso rapporto
(o prodotto, o rapporto con il quadrato) e l'ultima no; l'altra metà sono curve come $x^2 + c$,
$x^2 + x$, $x^3$, $3 \cdot 2^x$. Le tabelle lineari hanno $x$ consecutivi (i passi diversi sono del
livello 5), $m$ tra −3 e 6 e $q \neq 0$. Da 3 a 5 colonne.

Opzioni: la risposta e tre delle altre quattro, tenendo sempre quella che si sceglie per sbaglio: il
tipo della trappola; per una lineare crescente "diretta" ("Crescere insieme non basta"), per una
decrescente "inversa" ("Diminuire non basta"); per una quadratica "diretta".

Esempi: $x = 1, 2, 4, 5$, $y = 4, 16, 64, 100$ → quadratica ($\dfrac{y}{x^2} = 4$). $x = 1, 2, 4$,
$y = 4, 8, 20$ → nessuno (i rapporti sono 4, 4, 5: la trappola della lezione).

## Livello 5: la funzione lineare da una tabella

Tabella di una $y = mx + q$ con $m$ e $q$ interi non nulli ($m$ da −4 a 6, $q$ da −9 a 9),
quattro colonne, $x$ da 1 a 10. Due tabelle su tre hanno i valori di $x$ non equidistanti, come
l'esempio 5 della lezione: gli aumenti di $y$ vanno divisi per gli aumenti di $x$. Poi
$q = y - mx$ dalla prima coppia e il controllo sull'ultima. Risposta `expression`
(`y = 3x + 1`).

Esempi: $x = 1, 3, 4, 6$, $y = 4, 10, 13, 19$ → $y = 3x + 1$. $x = 2, 3, 8, 9$,
$y = -9, -10, -15, -16$ → $y = -x - 7$.

## Livello 6: problemi di proporzionalità diretta e inversa

Problemi di una o due frasi, metà diretti e metà inversi, come gli esempi 1-3 della lezione. Il primo
passaggio decide il verso ("il doppio degli operai, metà dei giorni"), il secondo calcola la
costante, il terzo il valore.

- Diretti: `quaderni` (quaderni, penne, biglietti del bus, gelati: prezzo di $n_2$ oggetti, al
  centesimo), `rubinetto` (litri in un tempo dato), `paga` (euro guadagnati in un numero di ore).
- Inversi: `velocita-tempo` (ore di viaggio a un'altra velocità, intere o mezze), `velocita-ore`
  (velocità per metterci un tempo dato, anche "2 ore e mezza" = 2,5 ore; risposta intera),
  `operai` (giorni con un altro numero di operai, al massimo un decimale, come i 7,5 giorni della
  lezione), `rubinetti` (minuti con più rubinetti), `scatole` (scatole di un'altra capienza,
  risposta intera).

Esempi: "12 operai finiscono un lavoro in 15 giorni. Quanti giorni servono a 8 operai?" → 22,5.
"3 biglietti del bus costano 7,50 euro. Quanto costano 2 biglietti del bus, in euro?" → 5.

## Livello 7: problemi in due tempi e con il quadrato

Metà `cantiere` (l'esempio 4: $N$ operai per $G$ giorni, dopo $d$ giorni alcuni se ne vanno, al
massimo metà, oppure ne arrivano altri; si chiede quanti giorni dura in tutto o quanti ne servono
ancora; giorni interi o mezzi), metà proporzionalità quadratica: `pizza` (prezzo proporzionale alla
superficie, diametro moltiplicato per 1,5, 2, 1,25, 0,5, 0,75, $\frac{4}{3}$ o 1,2; risposta al
centesimo) e `vernice` (litri per un pavimento quadrato di un altro lato; al massimo un decimale).

Esempi: "12 operai devono finire un lavoro in 15 giorni. Dopo 5 giorni 4 operai vengono spostati su
un altro cantiere. Quanti giorni dura in tutto il lavoro?" → 20. "Una pizza di 30 cm di diametro
costa 8 euro. Quanto costa una pizza di 45 cm?" → 18.

## Da evitare

- Tabelle con $x = 0$ o negativo; valori periodici; risposte già scritte nella tabella.
- Tabelle lineari con passo 1 al livello 5 per più di un terzo dei casi.
- Tabelle "nessuno" che per caso sono di un tipo (il generatore e la verifica le classificano di
  nuovo con il procedimento della lezione).
- Problemi con operai che restano uno solo, tempi in ore con decimali diversi da mezz'ora.

## Variante a scelta multipla

Quattro opzioni diverse per valore e per testo; per i livelli con risposta numerica, prima gli errori
qui sotto (tenuti se danno un numero positivo con al massimo due decimali), poi valori vicini.

- Livelli 1 e 4: le etichette dei tipi (sopra).
- Livello 2, diretta: la legge inversa ($\frac{x_1 y_1}{x}$), la stessa differenza al posto dello
  stesso rapporto, la costante al posto del valore, il rapporto capovolto. Inversa: la legge diretta
  (la proporzione dell'avviso "La proporzione diretta nei problemi inversi"), la stessa differenza,
  il prodotto $k$, $k \cdot x$.
- Livello 3, diretta: $y = \dfrac{x_1 y_1}{x}$ (il tipo sbagliato), il rapporto capovolto
  ($y = \dfrac{1}{k}x$), $y = x + (y_1 - x_1)$, $y = (k + 1)x$. Inversa: il rapporto della prima o
  della seconda coppia ($y = \dfrac{y_1}{x_1}x$, l'avviso sulle due coppie), $y = kx$,
  $y = \dfrac{x}{k}$.
- Livello 5: il primo aumento di $y$ non diviso per l'aumento di $x$ (l'errore dell'esempio 5), $q$
  con il segno cambiato, il primo valore di $y$ letto come $q$, il rapporto $\dfrac{y_1}{x_1}$ come
  proporzionalità diretta, $m$ e $q$ scambiati, $m$ con il segno cambiato.
- Livello 6: la legge dell'altro verso (diretta al posto di inversa e viceversa), la costante al
  posto del valore (il prezzo di un quaderno, la lunghezza del viaggio, il prodotto operai per
  giorni), la stessa differenza; per "2 ore e mezza" il tempo letto come 2,30.
- Livello 7: il lavoro intero diviso per i nuovi operai (l'avviso dell'esempio 4, 22,5 invece di 20),
  l'altra domanda (giorni restanti o totali), la legge diretta sui giorni restanti; per il quadrato
  la proporzionalità diretta (12 euro invece di 18, come nella lezione), il quadrato letto come
  doppio, il rapporto al cubo.

## Verifica

`scripts/exercises/checkers/funzioni_lineari.py`, scritto da questa specifica. Rilegge la tabella
dal LaTeX del problema e la confronta con `params`; classifica ogni tabella con il procedimento
della lezione in razionali esatti; al livello 1 trasforma la formula in SymPy e ne ricava il tipo, o
per le situazioni controlla il tipo della storia e che i numeri siano nel testo; ai livelli 3 e 5
trasforma in SymPy la risposta e ogni opzione (`y = …`) e controlla che una sola sia la funzione
della tabella; ai livelli 6 e 7 risolve di nuovo il problema dai dati e controlla che i dati siano
scritti nel testo e che ogni opzione sia scritta come il suo valore (euro con due decimali). Quote dei
casi: livello 1 un quarto per tipo, livelli 2, 3 e 6 metà e metà, livello 4 un quinto per tipo (la
trappola e le curve "nessuno" un decimo ciascuna), livello 5 un terzo equidistanti, livello 7 metà
`cantiere`.

Esito (26 settembre 2026): `sample.mts funzioni-lineari 1000 all 1` e `… 1000 all 7001` danno PASS,
7.000 esercizi su 7.000 per seed. `width.mts`: nessuna formula oltre i 350 px (la tabella più larga,
cinque colonne, 311 px) e nessuna opzione oltre i 252 px (la più larga 204 px, "proporzionalità
quadratica"). `review.mts` esce con 0.

Esercizi diversi su 1.000 per livello (seed 1 e seed 7001): livello 1, 524 e 499 (le formule
dirette e quadratiche hanno pochi coefficienti, le situazioni molti numeri); livello 2, 997 e 996;
livello 3, 987 e 981; livello 4, 873 e 900; livello 5, 924 e 935; livello 6, 951 e 955; livello 7,
813 e 820.

Errori piantati, tutti bocciati: opzione giusta spostata (livelli 1, 2, 4); formula del livello 1
cambiata in una di un altro tipo; dato della storia che non compare nel testo (livelli 1 e 6); valore
mancante sbagliato; cella della tabella cambiata solo nel problema; tipo scritto nel testo scambiato
(diretta e inversa); opzione con un testo diverso dal suo valore; formula diretta come risposta a una
tabella inversa; due opzioni con la stessa funzione giusta; ultima cella cambiata in tabelle dirette,
inverse, quadratiche e lineari dei livelli 3, 4 e 5 (la tabella diventa "nessuno"); opzione della
trappola tolta; $q$ con il segno cambiato; caso "passi diversi" etichettato come equidistante;
problema inverso risolto con la legge diretta; opzione in euro con un decimale solo; cantiere
risolto con il lavoro intero sui nuovi operai; pizza con la proporzionalità diretta; parole vietate
nei passaggi.

## Domande per la revisione

- Al livello 1 la funzione lineare ha l'etichetta "lineare, non proporzionale", perché anche
  $y = kx$ è una funzione lineare. Va bene, o è meglio "funzione lineare con $q \neq 0$"?
- Al livello 4 le risposte possibili sono cinque ma le opzioni quattro: una delle sbagliate resta
  fuori a caso (mai quella della trappola). Va bene, o è meglio mostrare tutte e cinque le etichette?
- Il livello 7 mette insieme due difficoltà diverse (il lavoro in due tempi e il quadrato), come
  propone la nota della lezione. Se la pagina deve dare un nome solo al livello, conviene dividerlo
  in due?
