# Conduzione, convezione e irraggiamento

Generatore: `fis-propagazione-calore` (`src/lib/exercises/v2/generators/fis-propagazione-calore.ts`, con
`src/lib/exercises/v2/fis-calore.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_propagazione_calore.py`
(con `_fis_calore.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/69-fis-propagazione-calore.md`. Percorso nel
database: `high_school/physics/fis-temperatura-calore/fis-propagazione-calore`.

Cinque livelli, ognuno con una difficoltà in più, tutti sulla legge della conduzione
$Q/\Delta t = \lambda\,S\,\Delta T/d$: la convezione e l'irraggiamento sono qualitativi nella lezione, e stanno nelle
flashcard.

## Nomi dei livelli

1. Il calore che passa ogni secondo
2. Le unità da convertire
3. Il calore in un tempo
4. Lo spessore o la conducibilità
5. Due strati a confronto

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità: watt, joule, centimetri, $\text{W/(m}\cdot\text{K)}$. Dati con due cifre
significative (aree, spessori, potenze, conducibilità della tabella della lezione scritte nel testo), differenze di
temperatura intere; risultati con due cifre, in notazione scientifica da $100$ in su ($2{,}1 \cdot 10^2\,\text{W}$), mai a
meno di $10^{-6}$ da un confine di arrotondamento. Conducibilità: vetro $1{,}0$, mattoni pieni $0{,}80$, legno $0{,}12$,
polistirolo espanso $0{,}035$, lana di roccia $0{,}040$, sughero $0{,}050$, calcestruzzo $1{,}5$, pietra $2{,}2$, rame
$401$, alluminio $237$, ferro $80$, acciaio inossidabile $16$.

La scena `lastra-conduzione` (nuova, `scenes/LastraConduzione.tsx`) disegna la lastra in prospettiva con le frecce del
calore, lo spessore $d$, l'area $S$ e le temperature delle facce (o la differenza $\Delta T$), oppure la sbarra con le
due estremità; mai la risposta, e niente scena quando la risposta è lo spessore (livello 4) o al livello 5.

## Livello 1: il calore che passa ogni secondo

Una lastra di vetro (spessa $0{,}0011$-$0{,}0099\,\text{m}$, $\Delta T$ da $1$ a $6\,^\circ\text{C}$), di legno
($0{,}011$-$0{,}099\,\text{m}$) o di mattoni o polistirolo ($0{,}11$-$0{,}99\,\text{m}$), con $\Delta T$ da $5$ a
$30\,^\circ\text{C}$ e area $1{,}1$-$9{,}9\,\text{m}^2$; tutto in unità del SI. Risultato tra $1$ e $10^4\,\text{W}$.

- "Una lastra di mattoni pieni, con $\lambda = 0{,}80\,\text{W/(m}\cdot\text{K)}$, ha un'area di $1{,}7\,\text{m}^2$ ed è
  spessa $0{,}62\,\text{m}$. Tra le due facce c'è una differenza di temperatura di $29\,^\circ\text{C}$." Risposta
  $64\,\text{W}$; distrattori $24\,\text{W}$ (lo spessore moltiplicato), $8{,}5\,\text{W}$ (area e spessore scambiati),
  $2{,}2\,\text{W}$ ($\Delta T$ dimenticata).
- "Una lastra di legno ... $5{,}8\,\text{m}^2$ ... $0{,}065\,\text{m}$ ... $20\,^\circ\text{C}$." Risposta
  $2{,}1 \cdot 10^2\,\text{W}$.

## Livello 2: le unità da convertire

Metà: una lastra come al livello 1 con lo spessore in millimetri (vetro) o in centimetri, e le temperature delle due
facce (interna $15$-$22\,^\circ\text{C}$, esterna da $-5$ a $10\,^\circ\text{C}$, o fino a $6$ gradi meno per il vetro).
Distrattori: lo spessore non convertito, la temperatura della faccia calda al posto della differenza, la somma delle
temperature (esterna sotto zero) o la faccia fredda. Metà: una sbarra di metallo lunga $11$-$99\,\text{cm}$, di sezione
$1{,}1$-$9{,}9\,\text{cm}^2$, con le estremità a $50$-$100$ e $0$-$30\,^\circ\text{C}$; risultato tra $0{,}1$ e
$1000\,\text{W}$. Distrattori: la lunghezza lasciata in centimetri, la sezione convertita male ($\times 100$), la
temperatura dell'estremità calda al posto della differenza.

- "Una sbarra di rame, con $\lambda = 401\,\text{W/(m}\cdot\text{K)}$, lunga $94\,\text{cm}$ e con una sezione di
  $6{,}2\,\text{cm}^2$, ha un'estremità a $57\,^\circ\text{C}$ e l'altra a $0\,^\circ\text{C}$." Risposta $15\,\text{W}$;
  distrattori $0{,}15\,\text{W}$, $1{,}5 \cdot 10^3\,\text{W}$, $18\,\text{W}$.
- "Una lastra di legno ... $6{,}3\,\text{m}^2$ ... spessa $6{,}5\,\text{cm}$. Una faccia è a $21\,^\circ\text{C}$, l'altra
  a $3\,^\circ\text{C}$." Risposta $2{,}1 \cdot 10^2\,\text{W}$; distrattori $2{,}1\,\text{W}$, $2{,}4 \cdot 10^2\,\text{W}$,
  $35\,\text{W}$.

## Livello 3: il calore in un tempo

Una parete di mattoni, legno o polistirolo, spessa $1{,}1$-$9{,}9\,\text{cm}$, $\Delta T$ $5$-$30\,^\circ\text{C}$, per
$2$-$12$ ore (metà) o $11$-$59$ minuti (metà, non multipli di dieci). Risposta in joule, in notazione scientifica.
Distrattori: il tempo non convertito in secondi, le ore prese per minuti o i minuti per ore, lo spessore lasciato in
centimetri.

- "Una parete di mattoni pieni ... $6{,}2\,\text{m}^2$ ... spessa $9{,}4\,\text{cm}$ ... $8\,^\circ\text{C}$ di differenza
  ... in $2\,\text{h}$?" Risposta $3{,}0 \cdot 10^6\,\text{J}$.
- "Una parete di legno ... $6{,}5\,\text{m}^2$ ... $6{,}3\,\text{cm}$ ... $27\,^\circ\text{C}$ ... in $36\,\text{min}$?"
  Risposta $7{,}2 \cdot 10^5\,\text{J}$; distrattori $1{,}2 \cdot 10^4\,\text{J}$ (i minuti non convertiti),
  $4{,}3 \cdot 10^7\,\text{J}$ (i minuti presi per ore), $7{,}2 \cdot 10^3\,\text{J}$.

## Livello 4: lo spessore o la conducibilità

Metà: lo spessore delle pareti di una borsa frigo di un isolante (superficie $0{,}11$-$0{,}99\,\text{m}^2$, dentro
$2$-$8\,^\circ\text{C}$, fuori $25$-$38\,^\circ\text{C}$, al massimo $1{,}1$-$9{,}9\,\text{W}$), tra $1$ e $30\,\text{cm}$;
distrattori: la formula rovesciata, la temperatura esterna al posto della differenza, i metri letti come centimetri.
Metà: la conducibilità di un materiale da una misura (area $1{,}1$-$9{,}9\,\text{m}^2$, spessore $1{,}1$-$9{,}9\,\text{cm}$,
$\Delta T$ $5$-$30$, $11$-$99\,\text{W}$), tra $0{,}02$ e $3\,\text{W/(m}\cdot\text{K)}$; distrattori: lo spessore in
centimetri, lo spessore al denominatore, $\Delta T$ dimenticata.

- "Una borsa frigo di sughero, con $\lambda = 0{,}050\,\text{W/(m}\cdot\text{K)}$, ha una superficie di
  $0{,}56\,\text{m}^2$. Dentro ci sono $7\,^\circ\text{C}$, fuori $34\,^\circ\text{C}$. ... al massimo $5{,}8\,\text{W}$?"
  Risposta $13\,\text{cm}$.
- "Una lastra di un materiale da costruzione ha un'area di $1{,}8\,\text{m}^2$ ed è spessa $5{,}8\,\text{cm}$. Con
  $20\,^\circ\text{C}$ di differenza tra le facce, la attraversano $53\,\text{W}$." Risposta
  $0{,}085\,\text{W/(m}\cdot\text{K)}$; distrattori $8{,}5$, $25$, $1{,}7$.

## Livello 5: due strati a confronto

Metà: lo spessore di un isolante che lascia passare lo stesso calore di una parete di mattoni, calcestruzzo o pietra
spessa $11$-$49\,\text{cm}$, $d_B = d_A\,\lambda_B/\lambda_A$ (l'esempio 3 della lezione); distrattori: il rapporto
rovesciato, $d_A\,\lambda_B$, $d_A\,(\lambda_A - \lambda_B)$. Metà: da una parete passano $1{,}1$-$9{,}9 \cdot
10^2\,\text{W}$; quanto passa da uno strato isolante spesso $1{,}1$-$9{,}9\,\text{cm}$, a parità di area e di $\Delta T$;
distrattori: gli spessori rovesciati, le conducibilità rovesciate, gli spessori dimenticati.

- "Quale spessore di uno strato di polistirolo espanso ($\lambda = 0{,}035$) lascia passare lo stesso calore di una
  parete di mattoni pieni ($\lambda = 0{,}80$) spessa $38\,\text{cm}$?" Risposta $1{,}7\,\text{cm}$; distrattori
  $8{,}7 \cdot 10^2\,\text{cm}$, $1{,}3\,\text{cm}$, $29\,\text{cm}$.
- "Da una parete di calcestruzzo ($\lambda = 1{,}5$) spessa $34\,\text{cm}$ passano $5{,}8 \cdot 10^2\,\text{W}$. Quanto
  calore passerebbe ... da uno strato di lana di roccia ($\lambda = 0{,}040$) spesso $8{,}6\,\text{cm}$?" Risposta
  $61\,\text{W}$; distrattori $3{,}9\,\text{W}$, $8{,}6 \cdot 10^4\,\text{W}$, $15\,\text{W}$.

## Esercizi da evitare

- Potenze sotto $1\,\text{W}$ (salvo le sbarre, da $0{,}1\,\text{W}$) o da $10^4\,\text{W}$ in su; spessori della borsa
  frigo oltre $30\,\text{cm}$.
- Dati con uno zero finale ambiguo ($580\,\text{W}$): la potenza della parete al livello 5 si scrive in notazione
  scientifica.

## Verifica

`fis_propagazione_calore.py` rilegge il testo, controlla i materiali con la loro conducibilità, le cifre e gli
intervalli dei dati, ricalcola con SymPy e controlla le opzioni e i dati della scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 154 px su 252).

### Errori piantati

Su 50 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 50 su 50; dati
della scena cambiati 36 su 36; un dato del testo aumentato di uno 48 su 50: i due che passano sono del livello 5, dove
una parete di $33$ o $34\,\text{cm}$ dà lo stesso spessore equivalente a due cifre ($1{,}1\,\text{cm}$).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livelli 1-4 da 998 a 1000; livello 5 741 (744), perché lo spessore equivalente ha solo 315
combinazioni di dati.

## Domande per la revisione

- La legge della conduzione con $\lambda$ come l'Amaldi (Fisica.verde, 2017): la lettera è la stessa del coefficiente di
  dilatazione lineare. Va bene, o meglio $k$?
- Serve un livello qualitativo (quale dei tre modi di propagazione), come domande a scelta senza numeri?
