# Grafici per rappresentare i dati

Generatore: `inf-grafici-dati` (`src/lib/exercises/v2/generators/inf-grafici-dati.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_grafici_dati.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/27-inf-grafici-dati.md`. Aiuti comuni: `src/lib/exercises/v2/inf-foglio-dati.ts` e
`scripts/exercises/checkers/_inf_foglio_dati.py`.

Quattro livelli, nell'ordine della lezione. La lezione è di concetto: le situazioni sono composte da pezzi
intercambiabili (chi, quali dati, quanti, per fare che cosa), `params` dice quali pezzi sono stati usati e il controllo
ricostruisce la risposta dalla sua tabella dei pezzi. Il livello 1 e il livello 4 hanno anche numeri generati.

## Nomi dei livelli

1. Serie, categorie e legenda
2. Il grafico giusto
3. Il grafico sbagliato
4. L'asse tagliato

## Regole comuni

- Testo in righe `\text{…}`; i riferimenti alle celle in `$\texttt{A1}$`; il foglio come `array` con lettere di
  colonna e numeri di riga. Niente trattini lunghi e niente "piuttosto che".
- Le opzioni di testo più lunghe di 24 caratteri vanno su due righe con `\begin{gathered}`.
- I quattro grafici si chiamano sempre "Grafico a colonne", "Grafico a linee", "Grafico a torta", "Grafico a
  dispersione", come nella lezione.

## Livello 1: serie, categorie e legenda

Una tabella con le categorie nella colonna `A` (da 3 a 5: mesi, giorni, sport, città, gusti) e 2 o 3 serie nelle
colonne successive, con i nomi nell'intestazione; i numeri sono tutti diversi, da 3 a 30. Il testo dice che con tutte
le celle si crea un grafico a colonne, con una serie per ogni colonna di numeri. Sei domande, circa una su sei
ciascuna:

- quante serie ha il grafico (le colonne di numeri);
- quante categorie ci sono sull'asse orizzontale (le righe di dati);
- quante colonne vengono disegnate in tutto (serie per categorie);
- quali nomi compaiono nella legenda (i nomi delle serie);
- quali etichette compaiono lungo l'asse orizzontale (le categorie);
- a quale valore arriva la colonna di una serie per una categoria (il numero della cella).

Le prime tre e l'ultima hanno per risposta un numero; i distrattori sono gli scambi tra serie e categorie, il
prodotto, i numeri con l'intestazione contata. Per legenda e asse le opzioni sono l'elenco delle serie, l'elenco delle
categorie, i numeri della prima colonna, i numeri della prima riga.

- Mese, 1A, 1B con gen, feb, mar: "Quante colonne vengono disegnate in tutto?" Risposta: 6.
- Stessa tabella: "Quali nomi compaiono nella legenda?" Risposta: 1A, 1B. Distrattore: gen, feb, mar.

## Livello 2: il grafico giusto

"{Nome} ha raccolto in un foglio di calcolo {dati}. {Scopo} Quale grafico è il più adatto?" I dati vengono da 28
pezzi, ognuno con un numero che cambia; lo scopo da due frasi per tipo. Il tipo, circa uno su quattro ciascuno:

- colonne: valori di categorie separate da confrontare (iscritti a 5 corsi, punti di 6 squadre, prezzo di uno zaino
  in 4 negozi);
- linee: la stessa grandezza in momenti successivi (la temperatura ogni ora per 24 ore, il prezzo della benzina ogni
  lunedì);
- torta: le poche parti di un totale, da 3 a 5 (la paghetta divisa in 4 voci di spesa, gli studenti divisi tra i mezzi per venire a scuola);
- dispersione: due grandezze misurate sugli stessi casi (ore di studio e voto di 20 compagni, altezza e numero di
  scarpe).

Opzioni: i quattro grafici.

- "Sara ha raccolto in un foglio di calcolo il livello di un fiume misurato ogni giorno per 30 giorni. Vuole mostrare
  come cambia il valore con il passare del tempo." Risposta: Grafico a linee.
- "Omar ha raccolto la superficie e il prezzo di 30 appartamenti. Vuole capire se le due grandezze sono legate tra
  loro." Risposta: Grafico a dispersione.

## Livello 3: il grafico sbagliato

"{Nome} ha rappresentato con un grafico a {torta, linee, colonne} {dati}. Qual è il difetto del grafico?" Quattro
opzioni, sempre le stesse:

- "Torta, ma i dati non sono parti di un totale": una torta per valori che non si sommano (temperature di 4 città,
  prezzi di 3 telefoni, altezze);
- "Torta con troppe fette": le parti di un totale, ma da 12 in su (i 18 gusti di una gelateria, le 20 classi);
- "Linea tra categorie senza ordine": una linea per valori di categorie separate (sport preferiti, squadre, negozi);
- "Nessun difetto": una torta con al più 5 parti di un totale, una linea per misure nel tempo, colonne per categorie.

Circa un caso su quattro ciascuno. La regola del controllo: i dati sono "valori" di categorie, "parti" di un totale o
misure nel "tempo"; torta con valori: non-totale; torta con parti: nessun difetto fino a 6, troppe fette da 12 (tra 7
e 11 la lezione non decide, e non si generano); linea con valori: senza ordine; linea con tempo e colonne con valori:
nessun difetto.

- "Luca ha rappresentato con un grafico a torta il prezzo di 4 modelli di telefono." Risposta: torta, ma i dati non
  sono parti di un totale.
- "Anna ha rappresentato con un grafico a colonne i punti finali delle 5 squadre di un torneo." Risposta: nessun
  difetto.

## Livello 4: l'asse tagliato

"Un grafico a colonne confronta {contesto}: {X} ha $v_1$ e {Y} ha $v_2$. L'asse verticale non parte da zero, ma da
$a$." Costruzione all'indietro: $v_1$ tra 40 e 500, la differenza vera $p$ tra 5, 10, 20, 25 e 50 per cento, il
rapporto apparente $k$ da 2 a 6; $v_2 = v_1 (1 + p/100)$, $d = (v_2 - v_1)/(k - 1)$, $a = v_1 - d$, tutti interi con
$a > 0$. Le altezze disegnate sono $d$ e $k d$.

- Apparente (circa 60%): "Sul grafico, quante volte la colonna di {Y} è alta rispetto a quella di {X}?" Risposta $k$.
- Reale (circa 40%): il testo dà $k$ e chiede "Di quale percentuale il valore di {Y} supera davvero quello di {X}?"
  Risposta $p$.

Esempi: 100 e 110 con l'asse da 90: altezze 10 e 20, la colonna appare alta 2 volte; la differenza vera è del 10 per
cento. 200 e 250 con l'asse da 190: altezze 10 e 60, 6 volte; differenza vera 25 per cento. Distrattori: per $k$, la
differenza dei valori, la percentuale, $k \pm 1$, 1; per $p$, $100(k-1)$, $100k$, la differenza dei valori, $k$.

## Esercizi da evitare

- Al livello 2 una situazione senza lo scopo: gli stessi dati (i visitatori di dodici mesi) possono stare in colonne o
  in linee, ed è lo scopo a decidere.
- Al livello 3 una torta con 7-11 fette.
- Al livello 4 valori non interi, o un asse che parte da zero o sopra il valore più piccolo.

## Verifica

Il controllo ha la sua tabella dei pezzi: per ogni pezzo del livello 2 il grafico che richiede, per ogni pezzo del
livello 3 il tipo di dati. Controlla che il pezzo nominato in `params` sia quello scritto nel problema, che lo scopo sia
uno di quelli del grafico, e ricava la risposta dalla tabella (al livello 3 con la regola qui sopra). Al livello 1
rilegge la tabella e conta serie e categorie; al livello 4 rilegge i due valori e l'inizio dell'asse e ricalcola rapporto
e percentuale. Poi le quattro opzioni e le quote dei casi.

## Domande per la revisione

- Nel livello 2 lo scopo è scritto in chiaro e quasi dice la risposta: si vuole anche un livello senza lo scopo, dove
  contano solo i dati?
- Il livello 3 ha sempre le stesse quattro opzioni: va bene, o servono altri difetti (manca la legenda, mancano le
  unità)?
