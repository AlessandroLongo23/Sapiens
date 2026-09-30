# L'equilibrio termico e il calorimetro

Generatore: `fis-equilibrio-termico` (`src/lib/exercises/v2/generators/fis-equilibrio-termico.ts`, con
`src/lib/exercises/v2/fis-calore.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_equilibrio_termico.py`
(con `_fis_calore.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/68-fis-equilibrio-termico.md`. Percorso nel
database: `high_school/physics/fis-temperatura-calore/fis-equilibrio-termico`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il calore scambiato
2. Acqua calda e acqua fredda
3. Un metallo nell'acqua
4. Il dato mancante
5. Il calore specifico
6. L'equivalente in acqua

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, sempre con l'unità: calori in kJ, temperature in $^\circ\text{C}$, masse in kg o in g,
calori specifici in $\text{J/(kg}\cdot{}^\circ\text{C)}$. Il risultato si arrotonda come dice la lezione: due cifre
significative per i calori e le masse, la temperatura di equilibrio al grado (livello 2, dove è intera per costruzione) o
al decimo (livello 3, tre cifre), il calore specifico con le cifre significative della differenza $t_e - t_a$ (tre se è
almeno $10\,^\circ\text{C}$, altrimenti due). Un risultato da $100$ in su con due cifre si scrive in notazione scientifica
($3{,}8 \cdot 10^2$). Mai risultati a meno di $10^{-6}$ da un confine di arrotondamento. Calore specifico dell'acqua
$4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, scritto nel testo; metalli: ferro $449$, alluminio $897$, rame $385$, piombo
$129$, argento $233$.

## Livello 1: il calore scambiato

Metà: l'acqua di un calorimetro ($0{,}11$-$0{,}99\,\text{kg}$) si scalda da $10$-$25\,^\circ\text{C}$ di $3$-$30$ gradi;
si chiede il calore ceduto dal metallo, uguale a quello assorbito dall'acqua. Metà: un metallo ($0{,}11$-$0{,}99\,\text{kg}$,
da $60$-$200\,^\circ\text{C}$) si raffredda fino a $15$-$40\,^\circ\text{C}$; si chiede il calore assorbito dall'acqua.
Risultato tra $1$ e $100\,\text{kJ}$.

- "Un pezzo di ferro di $0{,}28\,\text{kg}$, a $136\,^\circ\text{C}$, viene immerso nell'acqua di un calorimetro isolato e
  si raffredda fino a $16\,^\circ\text{C}$. Quanto calore assorbe l'acqua?" Risposta $15\,\text{kJ}$; distrattori
  $2{,}0\,\text{kJ}$ (la temperatura finale al posto di $\Delta t$), $17\,\text{kJ}$ (quella iniziale),
  $0{,}015\,\text{kJ}$ (i joule letti come kilojoule).
- "... $0{,}40\,\text{kg}$ d'acqua ... si scalda da $18$ a $25\,^\circ\text{C}$ ..." Risposta $12\,\text{kJ}$.

## Livello 2: acqua calda e acqua fredda

Masse diverse da $1{,}1$ a $9{,}9\,\text{kg}$, acqua calda $40$-$95\,^\circ\text{C}$, fredda $5$-$30\,^\circ\text{C}$; la
temperatura di equilibrio è intera, almeno $10\,^\circ\text{C}$ e ad almeno $3$ gradi da tutte e due le temperature.

- "In una bacinella si versano $6{,}9\,\text{kg}$ d'acqua a $66\,^\circ\text{C}$ e $1{,}2\,\text{kg}$ d'acqua a
  $12\,^\circ\text{C}$ ..." Risposta $58\,^\circ\text{C}$; distrattori $39\,^\circ\text{C}$ (la media semplice),
  $20\,^\circ\text{C}$ (le masse scambiate), $61\,^\circ\text{C}$.
- "... $7{,}7\,\text{kg}$ a $57\,^\circ\text{C}$ e $2{,}2\,\text{kg}$ a $30\,^\circ\text{C}$ ..." Risposta
  $51\,^\circ\text{C}$.

## Livello 3: un metallo nell'acqua

Metallo $0{,}11$-$0{,}99\,\text{kg}$ a $60$-$250\,^\circ\text{C}$, acqua $0{,}21$-$0{,}99\,\text{kg}$ a
$10{,}0$-$25{,}0\,^\circ\text{C}$ (gradi interi, scritti con un decimale). Risposta al decimo, almeno mezzo grado sopra la
temperatura dell'acqua.

- "Un pezzo di rame di $0{,}11\,\text{kg}$, a $186\,^\circ\text{C}$, viene immerso in $0{,}36\,\text{kg}$ d'acqua a
  $18{,}0\,^\circ\text{C}$ ..." Risposta $22{,}6\,^\circ\text{C}$; distrattori $147\,^\circ\text{C}$ (le masse senza i
  calori specifici), $102\,^\circ\text{C}$ (la media semplice), $57{,}3\,^\circ\text{C}$ (i calori specifici scambiati).
- "Un pezzo di piombo di $0{,}79\,\text{kg}$, a $101\,^\circ\text{C}$, ... $0{,}69\,\text{kg}$ d'acqua a $11{,}0\,^\circ\text{C}$"
  Risposta $14{,}1\,^\circ\text{C}$.

## Livello 4: il dato mancante

Acqua con acqua. Metà: la massa dell'acqua calda da aggiungere, $m_1 = m_2\,(t_e - t_2)/(t_1 - t_e)$, con $m_2$ da
$1{,}1$ a $9{,}9\,\text{kg}$, $t_1$ $50$-$95$, $t_2$ $5$-$25$, $t_e$ ad almeno $5$ gradi da tutte e due; risultato tra
$0{,}1$ e $10\,\text{kg}$. Distrattori: il rapporto rovesciato, $t_1 - t_2$ al denominatore, $t_1 - t_2$ con
$t_1 - t_e$. Metà: la temperatura dell'acqua calda, $t_1 = t_e + m_2\,(t_e - t_2)/m_1$, tra $35$ e $99{,}5\,^\circ\text{C}$ e
almeno $5$ gradi sopra $t_e$, al grado. Distrattori: le masse scambiate, $2t_e - t_2$ (masse uguali), $\pm 3$ e
$\pm 6$ gradi, mai sopra $99{,}5$.

- "$7{,}5\,\text{kg}$ d'acqua calda vengono mescolati con $3{,}3\,\text{kg}$ d'acqua a $23\,^\circ\text{C}$, e la
  temperatura finale è $51\,^\circ\text{C}$. Qual era la temperatura dell'acqua calda?" Risposta $63\,^\circ\text{C}$.
- "Quanta acqua a $61\,^\circ\text{C}$ bisogna aggiungere a $7{,}9\,\text{kg}$ d'acqua a $20\,^\circ\text{C}$ per
  ottenere acqua a $29\,^\circ\text{C}$?" Risposta $2{,}2\,\text{kg}$; distrattori $28\,\text{kg}$ (il rapporto
  rovesciato), $1{,}7\,\text{kg}$ ($t_1 - t_2$ al denominatore), $6{,}2\,\text{kg}$.

## Livello 5: il calore specifico

Calorimetro trascurato. Acqua $0{,}100$-$0{,}300\,\text{kg}$ a $12{,}0$-$25{,}0\,^\circ\text{C}$, campione
$0{,}100$-$0{,}500\,\text{kg}$ scaldato a $80{,}0$-$100{,}0\,^\circ\text{C}$ (dati con tre cifre); la temperatura di
equilibrio si costruisce da uno dei cinque metalli, arrotondata al decimo, e il calore specifico si ricalcola dai dati
scritti. Distrattori: $t_x - t_a$ al posto di $t_x - t_e$ (l'avviso della lezione), le masse scambiate, le due
differenze scambiate.

- "Un calorimetro contiene $0{,}100\,\text{kg}$ d'acqua a $14{,}0\,^\circ\text{C}$. Un campione di metallo di
  $0{,}370\,\text{kg}$, scaldato a $91{,}0\,^\circ\text{C}$, ... $33{,}6\,^\circ\text{C}$." Risposta
  $386\,\text{J/(kg}\cdot{}^\circ\text{C)}$ (tre cifre: $t_e - t_a = 19{,}6$).
- "... $0{,}245\,\text{kg}$ d'acqua a $24{,}0\,^\circ\text{C}$ ... $0{,}280\,\text{kg}$ ... $84{,}0\,^\circ\text{C}$ ...
  $29{,}7\,^\circ\text{C}$." Risposta $3{,}8 \cdot 10^2\,\text{J/(kg}\cdot{}^\circ\text{C)}$ (due cifre).

## Livello 6: l'equivalente in acqua

Metà: trovare l'equivalente da una mescolanza di acqua calda ($80$-$200\,\text{g}$ a $50{,}0$-$80{,}0\,^\circ\text{C}$) e
fredda ($150$-$300\,\text{g}$ a $12{,}0$-$25{,}0\,^\circ\text{C}$), $m_{eq} = m_h\,(t_h - t_e)/(t_e - t_c) - m_c$, tra
$10$ e $99\,\text{g}$; distrattori $m_c + m_{eq}$ (la massa d'acqua non sottratta), l'equivalente messo con l'acqua calda
(se positivo), $\times 1{,}5$ e $\times 0{,}5$. Metà: il calore specifico come al livello 5 con un equivalente di
$10$-$60\,\text{g}$ e le masse in grammi; distrattori: l'equivalente dimenticato, l'equivalente sommato al campione, le due
differenze scambiate.

- "Un calorimetro con equivalente in acqua di $49\,\text{g}$ contiene $240\,\text{g}$ d'acqua a $20{,}0\,^\circ\text{C}$.
  Un campione di metallo di $130\,\text{g}$, scaldato a $95{,}0\,^\circ\text{C}$, ... $26{,}6\,^\circ\text{C}$." Risposta
  $9{,}0 \cdot 10^2\,\text{J/(kg}\cdot{}^\circ\text{C)}$.
- "Un calorimetro contiene $300\,\text{g}$ d'acqua a $19{,}0\,^\circ\text{C}$. Si versano $170\,\text{g}$ d'acqua a
  $62{,}0\,^\circ\text{C}$, e la temperatura di equilibrio è $34{,}1\,^\circ\text{C}$." Risposta $14\,\text{g}$;
  distrattori $3{,}1 \cdot 10^2\,\text{g}$ (la massa d'acqua non sottratta), $21\,\text{g}$, $7{,}1\,\text{g}$.

## Esercizi da evitare

- Temperature di equilibrio attaccate a una delle due iniziali (livelli 2-4); acqua calda sopra $99{,}5\,^\circ\text{C}$.
- Distrattori di temperatura fisicamente impossibili al livello 4 (sopra $99{,}5\,^\circ\text{C}$ o sotto $t_e$).
- Calori sotto $1\,\text{kJ}$ o da $100\,\text{kJ}$ in su (livello 1).

## Verifica

`fis_equilibrio_termico.py` rilegge il testo di ogni livello, controlla intervalli e cifre dei dati, ricalcola con i
razionali esatti di SymPy e arrotonda come la specifica; controlla l'opzione giusta, che le opzioni siano quattro, con
l'unità e con valori diversi.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 162 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un dato del testo aumentato di uno bocciato 58 su 60. I due che passano sono del livello 6: un
equivalente in acqua di $33$ o $34\,\text{g}$ dà lo stesso calore specifico a due cifre, quindi non è un errore.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 998 (998), livello 2 1000 (998), livelli 3-6 1000 (1000).

## Domande per la revisione

- Il calore specifico al livello 5 e 6 con le cifre significative di $t_e - t_a$ (spesso due, quindi in notazione
  scientifica): va bene, o si preferisce sempre tre cifre?
- Le temperature di partenza dell'acqua scritte con un decimale ($18{,}0\,^\circ\text{C}$) e quelle del metallo intere
  ($186\,^\circ\text{C}$): convenzione accettabile?
