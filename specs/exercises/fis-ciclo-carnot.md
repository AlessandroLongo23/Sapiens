# Il teorema di Carnot e il ciclo di Carnot

Generatore: `fis-ciclo-carnot` (`src/lib/exercises/v2/generators/fis-ciclo-carnot.ts`, con
`src/lib/exercises/v2/fis-macchine.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_ciclo_carnot.py` (con
`_fis_macchine.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/116-fis-ciclo-carnot.md`. Percorso nel database:
`high_school/physics/fis-secondo-principio/fis-ciclo-carnot`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il rendimento con le temperature in kelvin
2. Le temperature in gradi Celsius
3. Lavoro e calore ceduto
4. La temperatura di una sorgente
5. La macchina può esistere?
6. Il lavoro di un ciclo di Carnot

## Convenzioni, tipi di risposta e cifre

$\eta_{rev} = 1 - T_f / T_c$ con le temperature in kelvin, $0\,^\circ\text{C} = 273\,\text{K}$, $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.
Il rendimento è un numero puro con due decimali. Temperature intere. Scelta multipla, quattro opzioni, l'unità nell'opzione;
mai un pari merito e mai un intero che finisce con zero come risposta. Il livello 5 ha quattro frasi fisse.

## Livello 1: il rendimento con le temperature in kelvin

$T_f$ da $255$ a $345\,\text{K}$, $T_c$ da $420$ a $900\,\text{K}$, rendimento tra $0{,}15$ e $0{,}70$.

- "Una macchina reversibile lavora tra una sorgente a $635\,\text{K}$ e una a $294\,\text{K}$. Qual è il suo rendimento?"
  Risposta $0{,}54$; distrattori $0{,}46$ ($T_f / T_c$ preso per il rendimento: sempre presente), $0{,}94$ (i gradi Celsius
  nel rapporto), poi $(T_c - T_f) / T_f$ quando non supera 1, o un valore vicino.
- "…$438\,\text{K}$ e $320\,\text{K}$": risposta $0{,}27$.

## Livello 2: le temperature in gradi Celsius

$t_f$ da $5$ a $60\,^\circ\text{C}$, $t_c$ da $150$ a $650\,^\circ\text{C}$: prima si passa ai kelvin.

- "Una macchina reversibile lavora tra una sorgente a $373\,^\circ\text{C}$ e una a $29\,^\circ\text{C}$. Qual è il suo
  rendimento?" $T_c = 646\,\text{K}$, $T_f = 302\,\text{K}$, risposta $0{,}53$; distrattori $0{,}92$ (i gradi Celsius nel
  rapporto, l'errore del riquadro: sempre presente), $0{,}47$ ($T_f / T_c$), $0{,}96$ (convertita solo la temperatura calda).
- "…$169\,^\circ\text{C}$ e $45\,^\circ\text{C}$": risposta $0{,}28$.

## Livello 3: lavoro e calore ceduto

Temperature in kelvin come al livello 1, $Q_c$ in kilojoule con due cifre. Metà dei casi il lavoro $W = \eta_{rev}\,Q_c$,
metà il calore ceduto $Q_f = Q_c\,T_f / T_c$; le due grandezze, arrotondate, sono diverse. Scena `macchina-termica` con le
temperature scritte nelle sorgenti.

- "Una macchina reversibile lavora tra una sorgente a $556\,\text{K}$ e una a $295\,\text{K}$, e in ogni ciclo assorbe
  $5{,}3\,\text{kJ}$ dalla sorgente calda. Quanto lavoro compie in un ciclo?" Risposta $2{,}5\,\text{kJ}$; distrattori
  $2{,}8\,\text{kJ}$ (il calore ceduto: l'altra grandezza è sempre tra le opzioni), $4{,}7\,\text{kJ}$ (la differenza divisa
  per $T_f$), $11\,\text{kJ}$ (diviso per il rendimento).
- "…$528\,\text{K}$ e $276\,\text{K}$ … $4{,}3\,\text{kJ}$ … Quanto calore cede alla sorgente fredda in un ciclo?" Risposta
  $2{,}2\,\text{kJ}$; distrattori $2{,}1\,\text{kJ}$ (il lavoro), $8{,}2\,\text{kJ}$ (il rapporto rovesciato),
  $0{,}051\,\text{kJ}$ (i gradi Celsius nel rapporto).

## Livello 4: la temperatura di una sorgente

Rendimento dato con due decimali, tra $0{,}20$ e $0{,}68$. Metà dei casi: $T_f$ da $265$ a $325\,\text{K}$, si cerca
$T_c = T_f / (1 - \eta_{rev})$. Metà: $T_c$ da $450$ a $900\,\text{K}$, si cerca $T_f = (1 - \eta_{rev})\,T_c$. Risposta al
kelvin.

- "Una macchina reversibile ha un rendimento di $0{,}41$ e cede calore a una sorgente a $282\,\text{K}$. Qual è la
  temperatura della sorgente calda?" Risposta $478\,\text{K}$; distrattori $688\,\text{K}$ (diviso per $\eta$),
  $398\,\text{K}$ (moltiplicato per $1 + \eta$), $166\,\text{K}$ (moltiplicato per $1 - \eta$).
- "…rendimento di $0{,}52$ e assorbe calore da una sorgente a $785\,\text{K}$. Qual è la temperatura della sorgente
  fredda?" Risposta $377\,\text{K}$; distrattori $408\,\text{K}$, $516\,\text{K}$, $1635\,\text{K}$.

## Livello 5: la macchina può esistere?

Un costruttore dichiara temperature (multipli di 5: $T_f$ da $250$ a $350\,\text{K}$, $T_c$ da $420$ a $900\,\text{K}$),
calore assorbito, calore ceduto e lavoro, in joule. Quattro casi, un quarto ciascuno, e quattro frasi:

| Chiave | Frase | Quando |
|---|---|---|
| `primo` | No: viola il primo principio | $W \ne Q_c - Q_f$, di almeno $20\,\text{J}$ |
| `secondo` | No: viola il secondo principio | bilancio in pari e $W / Q_c > \eta_{rev}$, di almeno $0{,}03$ |
| `reversibile` | Sì, ed è reversibile | bilancio in pari e $W / Q_c = \eta_{rev}$ esattamente |
| `irreversibile` | Sì, ed è irreversibile | bilancio in pari e $W / Q_c < \eta_{rev}$, di almeno $0{,}03$ |

- "Un costruttore dichiara che la sua macchina termica, lavorando tra una sorgente a $525\,\text{K}$ e una a $270\,\text{K}$,
  in ogni ciclo assorbe $626\,\text{J}$, cede $266\,\text{J}$ e compie $360\,\text{J}$ di lavoro. Può esistere?" Bilancio in
  pari, $\eta = 0{,}575\ldots$ contro $\eta_{rev} = 0{,}485\ldots$: viola il secondo principio.
- "…$555\,\text{K}$ e $295\,\text{K}$ … assorbe $666\,\text{J}$, cede $354\,\text{J}$ e compie $312\,\text{J}$": i due
  rendimenti sono uguali ($104/222 = 52/111$), è reversibile.

## Livello 6: il lavoro di un ciclo di Carnot

Moli da questa lista: $0{,}100$, $0{,}150$, $0{,}200$, $0{,}250$, $0{,}300$, $0{,}400$, $0{,}500$, $0{,}600$, $0{,}750$,
$0{,}800$. $T_c$ da $400$ a $650\,\text{K}$, $T_f$ da $250$ a $350\,\text{K}$, rendimento almeno $0{,}15$. Il volume passa da
$V_A$ ($1{,}00$, $1{,}50$, $2{,}00$ o $2{,}50\,\text{L}$) al doppio, al triplo o al quadruplo.
$W = n R\,(T_c - T_f) \ln(V_B / V_A)$, tra $100$ e $10\,000\,\text{J}$, con tre cifre significative; il valore sta lontano dai
confini di arrotondamento, perché viene da un logaritmo. Scena `ciclo-carnot` (`scenes/CicloCarnotPV.tsx`) con il ciclo in scala (gas monoatomico per le
adiabatiche: $V_C = V_B\,(T_c / T_f)^{3/2}$) e le due temperature scritte accanto alle isoterme, senza l'area. La scena
`piano-pv` del gruppo 41 qui non va bene: mette i nomi degli stati lontano dal centro della figura, e su un ciclo così
sottile $B$ finisce sopra $D$.

- "Un ciclo di Carnot è percorso da $0{,}300\,\text{mol}$ di gas perfetto tra le temperature di $512\,\text{K}$ e
  $278\,\text{K}$. Nell'espansione isoterma il volume del gas passa da $1{,}50\,\text{L}$ a $4{,}50\,\text{L}$. Quanto lavoro
  compie il gas in un ciclo? Usa $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$." $Q_c = 1402{,}2\ldots\,\text{J}$,
  $\eta = 0{,}4570\ldots$, risposta $641\,\text{J}$; distrattori $1{,}40 \cdot 10^{3}\,\text{J}$ (il calore assorbito:
  sempre presente), $761\,\text{J}$ (il calore ceduto), $278\,\text{J}$ (il logaritmo in base dieci).
- "…$0{,}600\,\text{mol}$ … $409\,\text{K}$ e $296\,\text{K}$ … da $1{,}00\,\text{L}$ a $4{,}00\,\text{L}$": risposta
  $781\,\text{J}$.

## Esercizi da evitare

- Rendimenti dichiarati a meno di $0{,}03$ da quello reversibile senza essere uguali: il confronto chiederebbe la terza
  cifra.
- Temperature fredde sotto $250\,\text{K}$ o calde sopra $900\,\text{K}$.
- Al livello 6 una scena con l'area colorata o con i calori scritti: darebbe la strada.

## Verifica

`fis_ciclo_carnot.py` rilegge il testo, controlla intervalli e cifre, ricalcola con i razionali (con `math.log` al livello 6,
dove controlla anche la distanza dai confini di arrotondamento), confronta l'opzione giusta e il formato delle altre, la
presenza degli errori tipici (il rapporto $T_f / T_c$ al livello 1, i gradi Celsius al livello 2, l'altra grandezza al
livello 3, il calore assorbito al livello 6), le quote dei casi, le etichette e le temperature della scena al livello 3 e i
quattro stati del ciclo al livello 6.

## Domande per la revisione

- Al livello 5 il caso "reversibile" chiede di riconoscere due frazioni uguali ($312/666$ e $260/555$): è troppo fine, o è
  giusto che ci sia?
- Al livello 6 le adiabatiche della figura sono quelle di un gas monoatomico, ma il testo dice solo "gas perfetto": il
  lavoro non dipende da $\gamma$, la figura sì. Va detto nel testo?
