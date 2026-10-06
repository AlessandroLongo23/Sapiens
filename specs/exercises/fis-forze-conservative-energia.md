# Forze conservative ed energia potenziale

Generatore: `fis-forze-conservative-energia` (`src/lib/exercises/v2/generators/fis-forze-conservative-energia.ts`, con `fis-quantita-moto.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_forze_conservative_energia.py` (con `_fis_quantita_moto.py`, `_fis_energia.py` e `_vettori.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/78-fis-forze-conservative-energia.md`. Percorso nel database: `high_school/physics/fis-forze-conservative/fis-forze-conservative-energia`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'attrito lungo due cammini
2. Il lavoro al ritorno
3. Dal lavoro all'energia potenziale
4. Il lavoro di una molla
5. L'energia cinetica dal grafico
6. La forza dal grafico

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Livelli 1, 2 e 4: dati con due cifre significative (costante elastica con
tre), risposta a due cifre, mai a meno di $10^{-6}$ da un confine di arrotondamento, nessun distrattore a meno dell'8%.
Livelli 3, 5 e 6: valori esatti (energie intere, letture sulla quadrettatura), risposta esatta. Le risposte hanno il
segno; l'opzione $0\,\text{J}$ compare al livello 2.

## Livello 1: l'attrito lungo due cammini

Un libro, una scatola o un astuccio spinto da un angolo all'angolo opposto di un tavolo, lungo i due bordi; tavoli con
la diagonale esatta ($0{,}6 \times 0{,}8$, $0{,}9 \times 1{,}2$, $1{,}2 \times 1{,}6$, $1{,}5 \times 2{,}0$, $0{,}5 \times 1{,}2$, $0{,}8 \times 1{,}5$,
$1{,}8 \times 2{,}4$, $2{,}1 \times 2{,}8$ metri); attrito da $1{,}1$ a $25\,\text{N}$; lavoro tra $1$ e $99\,\text{J}$ in modulo.

- "Una scatola viene spinta sul piano di un tavolo rettangolare di $0{,}9\,\text{m}$ per $1{,}2\,\text{m}$, da un angolo
  all'angolo opposto, seguendo i due bordi. L'attrito ha modulo $7{,}2\,\text{N}$. Quanto lavoro compie l'attrito?"
  Risposta $-15\,\text{J}$; distrattori $-11\,\text{J}$ (la diagonale, come per una forza conservativa), $15\,\text{J}$ (il
  segno), $-8{,}6\,\text{J}$ (un bordo solo).

## Livello 2: il lavoro al ritorno

Metà: una forza conservativa compie $W$ (positivo o negativo, modulo da $1{,}1$ a $49\,\text{J}$) da $A$ a $B$, e si
chiede il lavoro da $B$ ad $A$ lungo un altro cammino, $-W$; distrattori $W$, $0\,\text{J}$, $-2W$. Metà: l'attrito
compie $-W$ all'andata e la cassa torna per la stessa strada, in tutto $-2W$; distrattori $0\,\text{J}$ (l'attrito
trattato come il peso), $-W$, $+2W$.

- "Su un corpo agisce una forza conservativa, che compie un lavoro di $1{,}6\,\text{J}$ quando il corpo va da $A$ a $B$
  lungo un cammino. Quanto lavoro compie quando il corpo torna da $B$ ad $A$ lungo un altro cammino?" Risposta
  $-1{,}6\,\text{J}$.

Circa 320 esercizi diversi su 1.000: i dati sono un numero e un caso.

## Livello 3: dal lavoro all'energia potenziale

Energie intere tra $11$ e $99\,\text{J}$, mai multiple di 10; differenza di almeno $11\,\text{J}$, non multipla di 10. Due
casi: il lavoro da $U_A$ e $U_B$ ($W = U_A - U_B$; distrattori $U_B - U_A$, $\pm(U_A + U_B)$), oppure $U_B$ da $U_A$ e
$W$ ($U_B = U_A - W$; distrattori $U_A + W$, $|W|$, $U_A$).

- "L'energia potenziale gravitazionale di un sasso passa da $28\,\text{J}$ a $43\,\text{J}$. Quanto lavoro ha compiuto il
  peso?" Risposta $-15\,\text{J}$.

## Livello 4: il lavoro di una molla

Costante da $101$ a $999\,\text{N/m}$, due allungamenti in centimetri tra $1{,}1$ e $25$, diversi di almeno $2\,\text{cm}$;
$W_{el} = \tfrac12 k (x_A^2 - x_B^2)$ tra $0{,}1$ e $99\,\text{J}$ in modulo.

- "Una molla con costante elastica $241\,\text{N/m}$ è allungata di $8{,}3\,\text{cm}$. Viene lasciata tornare fino a un
  allungamento di $5{,}6\,\text{cm}$. Quanto lavoro compie la forza elastica?" Risposta $0{,}45\,\text{J}$; distrattori
  $-0{,}45\,\text{J}$ (il segno), $0{,}90\,\text{J}$ (senza il mezzo), $0{,}088\,\text{J}$ (il quadrato della differenza).

## Livello 5: l'energia cinetica dal grafico

Scena `grafico-spezzata`: quattro vertici a metri interi da $0$ a $8$, energie multiple di $5\,\text{J}$ tra $5$ e $45$,
una buca e una collina; la retta tratteggiata di $E$ (multiplo di 5 fino a 50). Si chiede $K = E - U$ in un punto a
metri interi in cui $U$ cade sulla quadrettatura; $K$ di almeno $15\,\text{J}$ e non multipla di 10. Distrattori: $U$,
$E$, $E + U$. La scena della soluzione segna il punto.

## Livello 6: la forza dal grafico

Lo stesso grafico senza la retta di $E$; si chiede $F_x = -\Delta U / \Delta x$ su un tratto tra due vertici, con al più
un decimale, non nulla e non multipla di 10. Distrattori: $+\Delta U/\Delta x$ (il segno), $\pm\Delta U$ (non divisa),
$-U/x$ alla fine del tratto.

## Esercizi da evitare

- Lavori che a due cifre andrebbero in notazione scientifica.
- Al livello 5, punti in cui $U$ non cade sulla quadrettatura; energie cinetiche di una cifra sola.
- Al livello 6, tratti orizzontali e forze con più di un decimale.

## Verifica

Il controllo rilegge il testo con un'espressione regolare per livello, controlla cifre significative e intervalli,
ricalcola con $g = 49/5$ e aritmetica esatta (SymPy), confronta la risposta e il formato delle quattro opzioni; dove c'è
una scena controlla che porti i dati del testo e niente di più.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 65 px su 252). `eslint` pulito.

### Errori piantati

Su 40 esercizi per livello (seed 777001): indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole
vietate e una cifra dei dati cambiata, bocciati tutti. Un numero della scena cambiato: 57 su 80; le 23 che passano toccano il numero di quadretti o delle etichette degli assi, o un vertice lontano dal tratto chiesto al livello 6, che resta dentro i vincoli.

### Esercizi diversi su 1.000

Seed da 1: livello 1 898, livello 2 321, livello 3 947, livello 4 1000, livello 5 917, livello 6 690.

## Domande per la revisione

- Ai livelli 5 e 6 i valori letti sul grafico sono esatti e hanno una o due cifre ($E = 40\,\text{J}$, $F_x = 5\,\text{N}$): va bene, trattandosi di letture?
- Serve un livello sul punto di inversione (dove il grafico incontra la retta di $E$)? L'esempio 4 della lezione lo fa, ma chiede di interpolare lungo un tratto.
