# I modelli atomici di Thomson e di Rutherford

Generatore: `chim-thomson-rutherford` (`src/lib/exercises/v2/generators/chim-thomson-rutherford.ts`, con
`src/lib/exercises/v2/chim-atomo.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_thomson_rutherford.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/41-chim-thomson-rutherford.md`. Percorso nel database:
`high_school/chemistry/atomo-struttura/chim-thomson-rutherford`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. I modelli atomici
2. La lamina d'oro
3. Atomo e nucleo
4. Il modello in scala
5. Il volume del nucleo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Nei livelli 3-5 i dati hanno due cifre significative e i risultati pure, in notazione
scientifica ($2{,}6 \cdot 10^{4}$) o in metri e chilometri. Mai risultati a meno di $10^{-6}$ da un confine di
arrotondamento.

## Livello 1: i modelli atomici

Una frase su com'è fatto l'atomo; opzioni fisse "Modello di Dalton", "Modello di Thomson", "Modello di Rutherford",
"Nessuno dei tre", ognuna giusta circa una volta su quattro. Le frasi di "Nessuno dei tre" descrivono atomi che nessuno
ha proposto (elettroni al centro, atomo intero positivo).

- "In quale modello atomico la carica positiva è distribuita in modo uniforme in tutto l'atomo?" Risposta: Thomson.
- "In quale modello atomico l'atomo è quasi tutto vuoto?" Risposta: Rutherford.

## Livello 2: la lamina d'oro

Un terzo ciascuno. Dall'osservazione alla conclusione (le tre osservazioni della lezione e le tre conclusioni di
Rutherford, più una conclusione sbagliata: elettroni più pesanti delle particelle alfa, carica positiva sparsa,
particelle alfa negative). Dalla conclusione all'osservazione (più un'osservazione inventata: le particelle si fermano,
sono attratte). La previsione del modello di Thomson: passano quasi tutte dritte; distrattori: molte tornano indietro,
si fermano tutte, sono deviate tutte di angoli grandi.

- "... si osserva questo: pochissime particelle alfa tornano indietro. Che cosa ne dedusse Rutherford?" Risposta: il
  nucleo contiene quasi tutta la massa dell'atomo.
- "Quale osservazione mostra che l'atomo è quasi tutto vuoto?" Risposta: quasi tutte le particelle alfa attraversano la
  lamina senza deviare.

## Livello 3: atomo e nucleo

Raggio dell'atomo da $0{,}5$ a $2{,}5 \cdot 10^{-10}\,\text{m}$, raggio del nucleo da $1{,}0$ a $9{,}9 \cdot
10^{-15}\,\text{m}$ (poche mantisse tonde). Risposta: il rapporto, due cifre. Distrattori: il rapporto rovesciato, il
segno dell'esponente perso ($10^{-5}$ invece di $10^{5}$), gli esponenti sommati, un fattore dieci.

- "$1{,}5 \cdot 10^{-10}\,\text{m}$ ... $5{,}7 \cdot 10^{-15}\,\text{m}$" Risposta $2{,}6 \cdot 10^{4}$; distrattori
  $3{,}8 \cdot 10^{-5}$, $2{,}6 \cdot 10^{-6}$, $2{,}6 \cdot 10^{24}$.

## Livello 4: il modello in scala

Rapporto dei diametri da $1{,}0 \cdot 10^4$ a $1{,}0 \cdot 10^5$; il nucleo del modello è una capocchia di spillo
($2{,}0\,\text{mm}$), una biglia ($1{,}0\,\text{cm}$), una pallina da ping pong ($4{,}0\,\text{cm}$), un'arancia
($8{,}0\,\text{cm}$) o un pallone ($22\,\text{cm}$). Risposta: il diametro dell'atomo, in metri sotto i $1000\,\text{m}$ e
in chilometri da lì. Distrattori: i centimetri letti come metri, il cubo del rapporto, la divisione, un fattore dieci.

- "$4{,}0 \cdot 10^{4}$ volte ... una pallina da ping pong, con un diametro di $4{,}0\,\text{cm}$" Risposta
  $1{,}6\,\text{km}$.
- "$1{,}0 \cdot 10^{4}$ volte ... una biglia" Risposta $1{,}0 \cdot 10^{2}\,\text{m}$ (cento metri, scritti senza zeri
  ambigui).

## Livello 5: il volume del nucleo

Gli stessi raggi del livello 3. Risposta $(r_{nucleo}/r_{atomo})^3$, due cifre. Distrattori: il rapporto dei raggi non
elevato al cubo, al quadrato, il rapporto rovesciato al cubo, tre volte il rapporto.

- "$1{,}1 \cdot 10^{-10}\,\text{m}$ ... $1{,}6 \cdot 10^{-15}\,\text{m}$" Risposta $3{,}1 \cdot 10^{-15}$; distrattori
  $1{,}5 \cdot 10^{-5}$, $2{,}1 \cdot 10^{-10}$, $3{,}2 \cdot 10^{14}$.

## Verifica

`chim_thomson_rutherford.py` assegna ogni frase al suo modello con parole chiave proprie, conosce le coppie
osservazione-conclusione della lezione e ricalcola i livelli 3-5 con i razionali esatti di SymPy, arrotondando a due
cifre.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 190 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un numero del testo cambiato bocciato 36 su 36.
