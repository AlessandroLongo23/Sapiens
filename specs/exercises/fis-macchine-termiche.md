# Le macchine termiche e il rendimento

Generatore: `fis-macchine-termiche` (`src/lib/exercises/v2/generators/fis-macchine-termiche.ts`, con
`src/lib/exercises/v2/fis-macchine.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_macchine_termiche.py` (con
`_fis_macchine.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/114-fis-macchine-termiche.md`. Percorso nel database:
`high_school/physics/fis-secondo-principio/fis-macchine-termiche`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il bilancio di un ciclo
2. Il rendimento dal lavoro
3. Il rendimento dai due calori
4. Dal rendimento ai calori
5. La potenza del motore
6. Il ciclo rettangolare

## Convenzioni, tipi di risposta e cifre

Come nella lezione, $Q_c$ e $Q_f$ sono in valore assoluto e $W = Q_c - Q_f$. Scelta multipla, quattro opzioni, l'unità
nell'opzione. Il rendimento è un numero puro scritto con due decimali ($0{,}35$, $0{,}40$), non in percentuale. Al livello 1
i calori sono interi in joule che non finiscono con zero, e la risposta è esatta. Ai livelli 2, 3 e 4 i calori sono in
kilojoule con due cifre significative ($1{,}1$-$9{,}9\,\text{kJ}$ o $11$-$99\,\text{kJ}$, mai con lo zero finale) e la
risposta ha due cifre, mai un pari merito e mai un intero che finisce con zero ($40\,\text{kJ}$ si scarta). Al livello 5 la
risposta è in joule in notazione scientifica.

I livelli da 1 a 4 hanno la scena `macchina-termica` (lo schema con le due sorgenti e le frecce, tutte della stessa
larghezza: la grandezza cercata ha l'etichetta con il punto interrogativo, oppure nessuna etichetta). Il livello 6 ha la
scena `piano-pv` del gruppo 41, con il ciclo ma senza l'area colorata.

## Livello 1: il bilancio di un ciclo

$Q_c$ da $300$ a $1500\,\text{J}$, rendimento tra $0{,}15$ e $0{,}60$. Metà dei casi chiede il lavoro, metà il calore ceduto
dati $Q_c$ e $W$.

- "In ogni ciclo una macchina termica assorbe $1139\,\text{J}$ dalla sorgente calda e cede $735\,\text{J}$ alla sorgente
  fredda. Quanto lavoro compie in un ciclo?" Risposta $404\,\text{J}$; distrattori $1139\,\text{J}$ ($W = Q_c$, l'errore
  del riquadro della lezione), $1874\,\text{J}$ (i due calori sommati), $735\,\text{J}$ (il calore ceduto).
- "In ogni ciclo una macchina termica assorbe $877\,\text{J}$ dalla sorgente calda e compie un lavoro di $183\,\text{J}$.
  Quanto calore cede alla sorgente fredda in un ciclo?" Risposta $694\,\text{J}$; distrattori $1060\,\text{J}$ (il lavoro
  sommato), $183\,\text{J}$, $877\,\text{J}$.

## Livello 2: il rendimento dal lavoro

$\eta = W / Q_c$, con il rapporto tra $0{,}12$ e $0{,}60$.

- "In ogni ciclo una macchina termica assorbe $8{,}9\,\text{kJ}$ dalla sorgente calda e compie un lavoro di
  $2{,}3\,\text{kJ}$. Qual è il suo rendimento?" Risposta $0{,}26$; distrattori $0{,}74$ (la frazione persa, $1 - \eta$,
  sempre presente), $0{,}35$ (il lavoro diviso il calore ceduto), $3{,}87$ (il rapporto rovesciato).
- "…assorbe $14\,\text{kJ}$ … lavoro di $4{,}2\,\text{kJ}$": risposta $0{,}30$ (esatta, con il segno di uguale).

## Livello 3: il rendimento dai due calori

$\eta = 1 - Q_f / Q_c$, con $Q_f / Q_c$ tra $0{,}40$ e $0{,}88$. Nessuna opzione supera 1.

- "In ogni ciclo una macchina termica assorbe $96\,\text{kJ}$ dalla sorgente calda e cede $63\,\text{kJ}$ alla sorgente
  fredda. Qual è il suo rendimento?" Risposta $0{,}34$; distrattori $0{,}66$ ($Q_f / Q_c$ preso per il rendimento),
  $0{,}52$ ($W / Q_f$), poi un valore vicino.
- "…assorbe $39\,\text{kJ}$ … cede $22\,\text{kJ}$": risposta $0{,}44$.

## Livello 4: dal rendimento ai calori

Il rendimento è dato con due decimali, tra $0{,}15$ e $0{,}55$. Metà dei casi: dati $\eta$ e $W$, il calore assorbito
$Q_c = W / \eta$. Metà: dati $\eta$ e $Q_c$, il calore ceduto $Q_f = (1 - \eta)\,Q_c$.

- "Una macchina termica ha un rendimento di $0{,}49$ e in ogni ciclo compie un lavoro di $8{,}4\,\text{kJ}$. Quanto calore
  assorbe dalla sorgente calda in un ciclo?" Risposta $17\,\text{kJ}$; distrattori $4{,}1\,\text{kJ}$ (moltiplicato per
  $\eta$, l'errore del riquadro), $16\,\text{kJ}$ (diviso per $1 - \eta$), $4{,}3\,\text{kJ}$ (moltiplicato per $1 - \eta$).
- "Una macchina termica ha un rendimento di $0{,}16$ e in ogni ciclo assorbe $1{,}7\,\text{kJ}$ dalla sorgente calda. Quanto
  calore cede alla sorgente fredda in un ciclo?" Risposta $1{,}4\,\text{kJ}$; distrattori $0{,}27\,\text{kJ}$ (il lavoro),
  $2{,}0\,\text{kJ}$ (diviso per $1 - \eta$), $11\,\text{kJ}$ (diviso per $\eta$).

## Livello 5: la potenza del motore

Potenza da $11$ a $99\,\text{kW}$ (senza zero finale), rendimento tra $0{,}20$ e $0{,}45$, tempo in minuti da questa lista:
2, 3, 4, 5, 6, 8, 12, 15, 25. $Q_c = P\,\Delta t / \eta$ con il tempo in secondi e la potenza in watt.

- "Un motore termico ha una potenza di $12\,\text{kW}$ e un rendimento di $0{,}21$. Quanto calore assorbe in
  $25\,\text{min}$?" Risposta $8{,}6 \cdot 10^{7}\,\text{J}$; distrattori $1{,}4 \cdot 10^{6}\,\text{J}$ (i minuti non
  convertiti), $3{,}8 \cdot 10^{6}\,\text{J}$ (moltiplicato per $\eta$), $1{,}8 \cdot 10^{7}\,\text{J}$ (il lavoro, senza il
  rendimento: sempre presente).
- "…$75\,\text{kW}$ … $0{,}21$ … $6\,\text{min}$": risposta $1{,}3 \cdot 10^{8}\,\text{J}$.

## Livello 6: il ciclo rettangolare

Un ciclo rettangolare percorso in senso orario: pressione bassa $100$, $150$ o $200\,\text{kPa}$, pressione alta fino a
$500\,\text{kPa}$ a passi di $50$; volumi interi in litri, da $1$-$4$ a non più di $8$. Il calore assorbito dato nel testo è
quello di un gas perfetto monoatomico, come nell'esempio 5 della lezione:
$Q_c = \tfrac{3}{2}\,V_A\,(p_A - p_D) + \tfrac{5}{2}\,p_A\,(V_B - V_A)$. Il lavoro è l'area, $(p_A - p_D)(V_B - V_A)$, e
il rendimento $W / Q_c$ è almeno $0{,}10$. I passaggi convertono kilopascal e litri in pascal e metri cubi.

- "Un gas perfetto compie in senso orario il ciclo rettangolare $ABCD$ della figura, tra le pressioni di $100\,\text{kPa}$ e
  $300\,\text{kPa}$ e tra i volumi di $2\,\text{L}$ e $6\,\text{L}$. In ogni ciclo assorbe $3600\,\text{J}$ di calore. Qual è
  il rendimento del ciclo?" $W = 800\,\text{J}$, risposta $0{,}22$; distrattori $0{,}33$ (l'area sotto il lato superiore,
  $p_A\,(V_B - V_A)$, e anche la base presa uguale a $V_B$), $0{,}78$ (la frazione persa), poi un valore vicino.
- "…$200\,\text{kPa}$ e $350\,\text{kPa}$ … $2\,\text{L}$ e $3\,\text{L}$ … $1325\,\text{J}$": risposta $0{,}11$.

## Esercizi da evitare

- Rendimenti sotto $0{,}10$ o sopra $0{,}60$: una cifra sola, oppure macchine irrealistiche.
- Risposte a pari merito tra due arrotondamenti, o interi che finiscono con zero.
- Al livello 6 un calore assorbito che non corrisponde a nessun gas: quello dato è sempre quello del gas monoatomico.

## Verifica

`fis_macchine_termiche.py` rilegge il testo con espressioni regolari, controlla intervalli e cifre dei dati, ricalcola con i
razionali, confronta l'opzione giusta, il formato e i valori delle altre, la presenza degli errori tipici (la frazione persa al
livello 2, il lavoro al livello 5), le etichette della scena e, al livello 6, gli stati del ciclo e che il calore assorbito
sia quello del gas monoatomico.

## Domande per la revisione

- Il rendimento come numero ($0{,}35$) e non in percentuale: va bene per le opzioni?
- Al livello 6 il testo ripete pressioni e volumi che si leggono dalla figura: tenerli nel testo o lasciarli solo sugli assi?
