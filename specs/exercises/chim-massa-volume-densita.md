# Massa, volume e densità (chimica)

Generatore: `chim-massa-volume-densita` (`src/lib/exercises/v2/generators/chim-massa-volume-densita.ts`, con
`src/lib/exercises/v2/chim-misure.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_massa_volume_densita.py`
(con `_chim_misure.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/11-chim-massa-volume-densita.md`. Percorso
nel database: `high_school/chemistry/chim-misure/chim-massa-volume-densita`.

Sei livelli, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni, l'unità nell'opzione.

## Nomi dei livelli

1. La densità
2. Massa o volume
3. Unità diverse
4. La pesata per differenza
5. Il volume per immersione
6. Galleggia o affonda

## Dati e cifre significative

Densità della tabella della lezione, in $\text{g/mL}$ a $20\,^\circ\text{C}$: etanolo $0{,}789$, glicerina $1{,}26$, acido
solforico concentrato $1{,}84$, mercurio $13{,}6$; alluminio $2{,}70$, ferro $7{,}87$, rame $8{,}96$, piombo $11{,}3$; al
livello 6 anche olio d'oliva $0{,}92$ e acqua $1{,}00$. I dati hanno tre cifre significative (volumi da $10{,}0$ a
$99{,}9$), tranne le pesate al centesimo di grammo del livello 4 e le letture del cilindro al mezzo millilitro del livello 5.
Nessun dato intero finisce con uno zero. Il risultato ha le cifre significative del dato che ne ha meno, come la lezione
13, e si scrive come lì: in notazione scientifica quando l'ultima cifra significativa sta a sinistra delle unità o è uno
zero delle unità ($4{,}62 \cdot 10^3\,\text{kg/m}^3$). Mai un risultato a metà tra due arrotondamenti (i dati costruiti
sono scartati se il valore esatto è a meno di un millesimo di unità dalla metà).

## Livello 1: la densità

Un campione di liquido (60%, volume in $\text{mL}$) o di solido (40%, in $\text{cm}^3$) con massa e volume: la densità.
Si costruisce da una densità tra $0{,}50$ e $15\,\text{g/mL}$, con la massa arrotondata a tre cifre. Distrattori: $V/m$
(l'avviso della lezione), $m \cdot V$, poi valori vicini.

- "Un campione di un liquido ha la massa di $83{,}1\,\text{g}$ e il volume di $10{,}2\,\text{mL}$." Risposta
  $8{,}15\,\text{g/mL}$; distrattori $0{,}123$, $848\,\text{g/mL}$.
- "... $181\,\text{g}$ ... $39{,}2\,\text{mL}$ ..." Risposta $4{,}62\,\text{g/mL}$.

## Livello 2: massa o volume

Metà la massa ($m = d\,V$, di un liquido o di un pezzo di metallo), metà il volume da prelevare ($V = m/d$, di un
liquido). Distrattori: la formula rovesciata ($V/d$ o $m \cdot d$) e $d/V$ o $d/m$.

- "La densità dell'etanolo è $0{,}789\,\text{g/mL}$. Quanti millilitri bisogna prelevare per averne $57{,}4\,\text{g}$?"
  Risposta $72{,}8\,\text{mL}$; distrattori $45{,}3\,\text{mL}$ ($m \cdot d$), $0{,}0137\,\text{mL}$.
- "Un pezzo di rame ha il volume di $12{,}5\,\text{cm}^3$. ..." Risposta $112\,\text{g}$.

## Livello 3: unità diverse

Un terzo ciascuno: la densità data in $\text{kg/m}^3$ e la massa di un volume in $\text{mL}$; la massa in chilogrammi di
un volume in litri; la densità in $\text{kg/m}^3$ da grammi e millilitri. Distrattori: il fattore $1000$ non applicato o
applicato al contrario, un fattore $10$, un milione.

- "La densità dell'etanolo è $0{,}789\,\text{g/mL}$. Quanti chilogrammi pesano $5{,}74\,\text{L}$?" Risposta
  $4{,}53\,\text{kg}$; distrattori $4{,}53 \cdot 10^3\,\text{kg}$ (i grammi scritti come chilogrammi), $0{,}00453$, $45{,}3$.
- "Un liquido ha la massa di $181\,\text{g}$ e il volume di $39{,}2\,\text{mL}$. Quanto vale la sua densità in
  $\text{kg/m}^3$?" Risposta $4{,}62 \cdot 10^3\,\text{kg/m}^3$.

La densità in $\text{kg/m}^3$ del primo caso si scrive come intero ($789$, $1260$, $13\,600$), come nella lezione: lo zero
finale di $1260$ è ambiguo, e la risposta ha comunque tre cifre, quelle del volume.

## Livello 4: la pesata per differenza

Becher vuoto ($25{,}00$-$80{,}00\,\text{g}$), volume prelevato con una pipetta tarata ($10{,}00$, $20{,}00$, $25{,}00$,
$50{,}00\,\text{mL}$, quattro cifre) o con un cilindro (tre cifre), becher pieno; la massa del liquido è la differenza,
al centesimo. Liquidi con densità $0{,}789$, $0{,}998$, $1{,}03$, $1{,}07$, $1{,}26$, $1{,}84\,\text{g/mL}$. Il risultato
ha le cifre del dato che ne ha meno tra la massa del liquido e il volume. Distrattori: il becher pieno diviso per il
volume (l'avviso della lezione), $V/m$, il becher vuoto diviso per il volume.

- "Un becher vuoto ha la massa di $54{,}59\,\text{g}$. Si prelevano con un cilindro graduato $39{,}2\,\text{mL}$ di un
  liquido ..., e la bilancia segna $93{,}71\,\text{g}$." Risposta $0{,}998\,\text{g/mL}$ (massa $39{,}12\,\text{g}$).
- "... $78{,}96\,\text{g}$ ... $10{,}2\,\text{mL}$ ... $89{,}87\,\text{g}$" Risposta $1{,}07\,\text{g/mL}$.

## Livello 5: il volume per immersione

Un granulo di alluminio, ferro, rame o piombo, un quarto ciascuno: massa al decimo di grammo (tre cifre), letture del
cilindro al mezzo millilitro da $10{,}0$ a $30{,}0\,\text{mL}$, volume del granulo da $3{,}0$ a $18{,}0\,\text{mL}$. Il
risultato ha due cifre se il volume è sotto $10\,\text{mL}$, tre altrimenti. I passaggi dicono di che metallo si tratta.
Distrattori dall'avviso della lezione: la massa divisa per la seconda lettura o per la prima, $V/m$.

- "Un granulo di metallo ha la massa di $98{,}6\,\text{g}$. In un cilindro graduato l'acqua è a $10{,}0\,\text{mL}$; si
  immerge il granulo, e l'acqua sale a $21{,}0\,\text{mL}$." Risposta $8{,}96\,\text{g/mL}$ (rame); distrattori
  $4{,}70$, $9{,}86$, $0{,}112\,\text{g/mL}$.
- "... $62{,}7\,\text{g}$ ... $16{,}5$ ... $23{,}5\,\text{mL}$" Risposta $9{,}0\,\text{g/mL}$.

## Livello 6: galleggia o affonda

Un oggetto con massa e volume (tre cifre): la sua densità sta tra quelle di due liquidi vicini della lista (etanolo,
olio d'oliva, acqua, glicerina, mercurio), ad almeno $0{,}02\,\text{g/mL}$ da tutte e due. Metà "In quale di questi
liquidi galleggia?", con un solo liquido più denso dell'oggetto tra le opzioni; metà "In quale affonda?", con uno solo
meno denso. Le opzioni sono i liquidi con la loro densità.

- "Un oggetto ha la massa di $30{,}5\,\text{g}$ e il volume di $35{,}6\,\text{cm}^3$. In quale di questi liquidi
  affonda?" ($0{,}857\,\text{g/mL}$) Risposta etanolo, tra olio d'oliva, acqua e mercurio.
- "... $51{,}2\,\text{g}$ ... $57{,}4\,\text{cm}^3$ ... affonda?" ($0{,}892$) Risposta etanolo, tra olio, glicerina,
  mercurio.

## Esercizi da evitare

- Dati interi che finiscono con zero; risultati a metà tra due arrotondamenti.
- Al livello 6, densità a meno di $0{,}02\,\text{g/mL}$ da quella di un liquido.

## Verifica

`chim_massa_volume_densita.py` rilegge il testo, controlla le cifre dei dati, ricalcola con i razionali di SymPy,
arrotonda e scrive il risultato come la specifica, e controlla l'opzione giusta, le quattro opzioni diverse, l'unità;
al livello 6 confronta la densità dell'oggetto con la tabella dei liquidi.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 179 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice spostato, opzione copiata e cifra dell'opzione giusta cambiata bocciati 60 su 60.
La prima cifra di un dato cambiata: bocciati 57 su 60; i tre che passano sono del livello 6, dove l'oggetto resta tra gli
stessi due liquidi. L'ultima cifra di un dato cambiata: bocciati 38 su 60, perché spesso il risultato arrotondato non
cambia (un centesimo di grammo sul becher del livello 4 sposta la densità dello $0{,}1\%$).
