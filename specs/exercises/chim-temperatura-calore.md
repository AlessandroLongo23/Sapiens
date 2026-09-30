# Temperatura e calore (chimica)

Generatore: `chim-temperatura-calore` (`src/lib/exercises/v2/generators/chim-temperatura-calore.ts`, con
`src/lib/exercises/v2/chim-misure.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_temperatura_calore.py`
(con `_chim_misure.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/12-chim-temperatura-calore.md`. Percorso nel
database: `high_school/chemistry/chim-misure/chim-temperatura-calore`.

Sei livelli, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni, l'unità nell'opzione.

## Nomi dei livelli

1. Celsius e kelvin
2. Differenze di temperatura
3. Il calore
4. La temperatura finale
5. Il calorimetro
6. L'equilibrio termico

## Convenzioni

$T = t + 273$ con le temperature intere (livelli 1 e 2), come la lezione. Calore specifico in
$\text{J/(g}\cdot{}^\circ\text{C)}$, con le masse in grammi, dalla tabella della lezione: acqua $4{,}186$, etanolo $2{,}44$,
olio d'oliva $1{,}97$, alluminio $0{,}897$, ferro $0{,}449$, rame $0{,}385$ (il vetro, con due cifre, no). Il calore si dà in
$\text{kJ}$ da $1000\,\text{J}$ in su, altrimenti in $\text{J}$. Risultati arrotondati come la lezione 13, scritti come
nella specifica di `chim-massa-volume-densita`.

## Livello 1: Celsius e kelvin

Metà da gradi Celsius a kelvin, metà al contrario; il 40% con temperature Celsius negative (da $-260$ a $-5\,^\circ\text{C}$),
le altre da $5$ a $400\,^\circ\text{C}$. Distrattori: $273$ sottratto invece che aggiunto (o il contrario), il segno della
temperatura negativa perso ($-196 + 273$ letto come $196 + 273$), il numero lasciato com'è.

- "Esprimi in gradi Celsius la temperatura $195\,\text{K}$." Risposta $-78\,^\circ\text{C}$; distrattori $468$, $195$,
  $78\,^\circ\text{C}$.
- "Esprimi in kelvin la temperatura $-196\,^\circ\text{C}$." Risposta $77\,\text{K}$; distrattori $469$, $196\,\text{K}$...

## Livello 2: differenze di temperatura

Un campione si scalda o si raffredda di $5$-$80$ gradi. Metà con le due temperature in gradi Celsius e la domanda in
kelvin; metà con la prima in kelvin e la seconda in gradi Celsius, e la domanda in gradi Celsius. Distrattori dall'avviso
della lezione: $273$ aggiunto alla differenza, la temperatura finale convertita invece della differenza, le due scale
sottratte senza convertire.

- "Un campione si scalda da $4\,^\circ\text{C}$ a $49\,^\circ\text{C}$. Di quanti kelvin aumenta la sua temperatura?"
  Risposta $45\,\text{K}$; distrattori $318$, $322$, $591\,\text{K}$.
- "Un campione si raffredda da $350\,\text{K}$ a $20\,^\circ\text{C}$. Di quanti gradi Celsius diminuisce?" Risposta
  $57\,^\circ\text{C}$.

## Livello 3: il calore

Quanto calore serve per scaldare una massa (tre cifre, $10{,}0$-$99{,}9\,\text{g}$ o $101$-$999\,\text{g}$) di una delle sei
sostanze da $10{,}0$-$30{,}0\,^\circ\text{C}$ di $10{,}0$-$70{,}0$ gradi (temperature con un decimale). Risultato con tre
cifre. Distrattori: la temperatura finale o quella iniziale al posto di $\Delta t$, il calore mille volte più piccolo (la
massa letta in chilogrammi).

- "Quanto calore serve per scaldare $57{,}4\,\text{g}$ di alluminio da $29{,}7\,^\circ\text{C}$ a $97{,}8\,^\circ\text{C}$?"
  Risposta $3{,}51\,\text{kJ}$; distrattori $5{,}04\,\text{kJ}$ ($t_f$), $1{,}53\,\text{kJ}$ ($t_i$), $0{,}00351\,\text{kJ}$.
- "... $35{,}6\,\text{g}$ di ferro da $20{,}8$ a $83{,}4\,^\circ\text{C}$ ..." Risposta $1{,}00\,\text{kJ}$.

## Livello 4: la temperatura finale

Un campione riceve o cede (metà ciascuno) un calore in $\text{kJ}$ con tre cifre; si costruisce da un aumento di
$10$-$60$ gradi, e il $\Delta t$ ricalcolato dai dati scritti sta tra $10$ e $100$ gradi. Risposta al decimo di grado,
mai a meno di un centesimo di decimo da un arrotondamento a metà, sempre sopra $0\,^\circ\text{C}$. Distrattori: $\Delta t$
al posto della temperatura finale, il verso sbagliato (sommato invece che sottratto), valori vicini di uno, due o cinque
gradi.

- "Un campione di etanolo di $58{,}4\,\text{g}$, a $85{,}0\,^\circ\text{C}$, cede $5{,}93\,\text{kJ}$ di calore. A quale
  temperatura arriva?" Risposta $43{,}4\,^\circ\text{C}$; distrattori $41{,}6$ ($\Delta t$), $126{,}6$ (il verso),
  $44{,}4\,^\circ\text{C}$.
- "Un campione d'acqua di $982\,\text{g}$, a $88{,}8\,^\circ\text{C}$, cede $98{,}7\,\text{kJ}$ ..." Risposta
  $64{,}8\,^\circ\text{C}$.

## Livello 5: il calorimetro

In un calorimetro con $50{,}0$, $100{,}0$, $150{,}0$ o $200{,}0\,\text{g}$ d'acqua a $18{,}0$-$25{,}0\,^\circ\text{C}$ si scioglie
un sale (nitrato d'ammonio o cloruro di potassio, endotermici; idrossido di sodio o cloruro di calcio, esotermici) o
avviene una reazione, e la temperatura sale o scende di $2{,}0$-$15{,}0$ gradi, metà e metà. Si chiede il calore scambiato
dalla trasformazione e il tipo: le opzioni sono "esotermica, cede ..." e "endotermica, assorbe ...". Il risultato ha le
cifre della variazione di temperatura (due o tre). Distrattori: il tipo sbagliato con lo stesso calore (il $\Delta t$ al
contrario, l'avviso della lezione), la temperatura finale al posto di $\Delta t$ con i due tipi.

- "In un calorimetro con $100{,}0\,\text{g}$ d'acqua a $20{,}0\,^\circ\text{C}$ avviene una reazione, e la temperatura sale
  a $29{,}0\,^\circ\text{C}$." Risposta "esotermica, cede $3{,}8\,\text{kJ}$"; distrattori "endotermica, assorbe
  $3{,}8\,\text{kJ}$", "esotermica, cede $12\,\text{kJ}$", "endotermica, assorbe $12\,\text{kJ}$".
- "... $50{,}0\,\text{g}$ ... $21{,}7\,^\circ\text{C}$ si scioglie del cloruro di calcio ... sale a $36{,}5\,^\circ\text{C}$"
  Risposta "esotermica, cede $3{,}10\,\text{kJ}$".

## Livello 6: l'equilibrio termico

Due masse d'acqua diverse ($50$-$500\,\text{g}$, multipli di $10$), la calda a $40$-$95\,^\circ\text{C}$, la fredda a
$5$-$30\,^\circ\text{C}$, in un becher isolato. Temperatura di equilibrio intera, ad almeno $3$ gradi da tutte e due.
Distrattori: la media semplice, le masse scambiate (se intere), valori a $3$ e $6$ gradi.

- "In un becher isolato si mescolano $240\,\text{g}$ d'acqua a $48\,^\circ\text{C}$ e $160\,\text{g}$ d'acqua a
  $23\,^\circ\text{C}$." Risposta $38\,^\circ\text{C}$.
- "... $350\,\text{g}$ a $94\,^\circ\text{C}$ e $210\,\text{g}$ a $6\,^\circ\text{C}$ ..." Risposta $61\,^\circ\text{C}$;
  distrattori $50$ (la media), $39$ (le masse scambiate), $64\,^\circ\text{C}$.

## Esercizi da evitare

- Temperature finali sotto $0\,^\circ\text{C}$ al livello 4; risultati a metà tra due arrotondamenti.
- Al livello 5, una trasformazione nota che va nel verso sbagliato (il nitrato d'ammonio che scalda l'acqua).

## Verifica

`chim_temperatura_calore.py` rilegge il testo, controlla la sostanza e il suo calore specifico, le cifre dei dati e il
verso delle trasformazioni note, ricalcola con i razionali di SymPy e confronta con l'opzione giusta.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 249 px su 252, al livello 5).

### Errori piantati

Su 60 esercizi (seed da 300): indice spostato, opzione copiata, cifra dell'opzione giusta cambiata e prima cifra di un
dato cambiata bocciati 60 su 60. L'ultima cifra di un dato cambiata bocciata 54 su 60: i sei che passano (livelli 3-5)
hanno lo stesso risultato arrotondato.
