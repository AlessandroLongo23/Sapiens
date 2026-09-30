# La velocità media e istantanea

Generatore: `velocita` (`src/lib/exercises/v2/generators/velocita.ts`, con `src/lib/exercises/v2/cinematica.ts`).
Verifica indipendente: `scripts/exercises/checkers/velocita.py` (con `_cinematica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/39-velocita.md`. Percorso nel database: `high_school/physics/cinematica/velocita`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La velocità media
2. Chilometri all'ora e metri al secondo
3. Distanza e tempo
4. Velocità media e velocità scalare media
5. Un viaggio in due tratti

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Livelli 1-3 con risultati esatti; livello 4 con due cifre significative,
mai a meno di $10^{-6}$ da un confine di arrotondamento; livello 5 arrotondato al $\text{km/h}$, mai vicino a un mezzo.

## Regole comuni

- Formule della lezione: $v_m = \Delta s / \Delta t$ con il segno, $v_s = d / \Delta t$, $1\,\text{m/s} = 3{,}6\,\text{km/h}$,
  $\Delta s = v\,\Delta t$ con il tempo in ore, velocità media di un viaggio come distanza totale su tempo totale.
- Corpi plausibili per la loro velocità (`moverFor`): fino a $2{,}5\,\text{m/s}$ un pedone, un carrello o un cane, fino a
  $8\,\text{m/s}$ anche un ciclista o un monopattino, fino a $15\,\text{m/s}$ un ciclista o un motorino, oltre un'auto o un
  treno. Il controllo lo verifica.
- Scena `strada-posizioni` ai livelli 1 (le due posizioni con l'istante) e 4 (partenza, punto di ritorno, arrivo, i due
  tratti).

## Livello 1: la velocità media

Velocità con due cifre significative ($1{,}5$-$9{,}5$ a mezzi, oppure $11$-$15\,\text{m/s}$), metà positive e metà
negative; $\Delta t$ da $2$ a $20\,\text{s}$, $t_1$ da $1$ a $15\,\text{s}$, posizioni intere.

- "Un motorino su una strada dritta passa dalla posizione $s_1 = 31\,\text{m}$ all'istante $t_1 = 6\,\text{s}$ e dalla
  posizione $s_2 = -140\,\text{m}$ all'istante $t_2 = 24\,\text{s}$. Qual è la sua velocità media?" Risposta
  $-9{,}5\,\text{m/s}$; distrattori $9{,}5\,\text{m/s}$ (il segno perso), $-5{,}8\,\text{m/s}$ ($s_2/t_2$),
  $-7{,}1\,\text{m/s}$ ($\Delta s / t_2$).

## Livello 2: chilometri all'ora e metri al secondo

Metà da $\text{km/h}$ a $\text{m/s}$ (multipli di $9\,\text{km/h}$ da $18$ a $135$, o $3{,}6$ volte un intero da $5$ a
$40$), metà da $\text{m/s}$ a $\text{km/h}$ (interi da $5$ a $45$, non multipli di $10$).

- "Converti in metri al secondo la velocità di $45\,\text{km/h}$." Risposta $12{,}5\,\text{m/s}$; distrattori
  $162\,\text{m/s}$ ($\cdot 3{,}6$), $0{,}75\,\text{m/s}$ ($:60$), $1{,}25\,\text{m/s}$ ($:36$).

Il livello ha pochi esercizi diversi (80): i dati sono un numero solo.

## Livello 3: distanza e tempo

Velocità costante da $30$ a $130\,\text{km/h}$ (multipli di $5$), tempi in minuti ($6$, $10$, $12$, $15$, ..., $50$),
distanze con al più un decimale. Metà chiedono la distanza, metà il tempo.

- "Un pullman viaggia a velocità costante di $80\,\text{km/h}$ su una strada dritta. Quanta strada percorre in
  $18\,\text{min}$?" Risposta $24\,\text{km}$; distrattori $1440\,\text{km}$ (i minuti non convertiti),
  $14{,}4\,\text{km}$ ($18\,\text{min}$ letti come $0{,}18\,\text{h}$), $267\,\text{km}$ ($v \cdot 60 / M$).
- Per il tempo i distrattori sono le ore lette come centesimi, il rapporto rovesciato, le ore scritte come minuti.

## Livello 4: velocità media e velocità scalare media

Partenza da $0$ a $60\,\text{m}$, andata da $40$ a $300\,\text{m}$ e ritorno da $20\,\text{m}$ fino a $100\,\text{m}$ oltre
la partenza, tutti multipli di $10$; tempo totale da $10$ a $90\,\text{s}$; velocità scalare media al più
$25\,\text{m/s}$. Metà chiedono $v_s$, metà $v_m$.

- "Un cane parte da $s = 30\,\text{m}$, arriva fino a $s = 140\,\text{m}$ e torna indietro fino a $s = 50\,\text{m}$, in
  tutto in $82\,\text{s}$. Quanto vale la sua velocità scalare media?" Risposta $2{,}4\,\text{m/s}$; distrattori
  $0{,}24\,\text{m/s}$ (la velocità media), $1{,}3\,\text{m/s}$ (solo l'andata), $0{,}61\,\text{m/s}$ (posizione finale su
  tempo).

## Livello 5: un viaggio in due tratti

Velocità da $30$ a $130\,\text{km/h}$ (multipli di $10$), diverse. Metà danno due distanze (tempi dei tratti in quarti
d'ora, da $0{,}25$ a $3\,\text{h}$, diversi), metà due durate in minuti ($10$, $15$, $20$, $30$, $40$, $45$, $60$,
$90$, diverse).

- "Un'auto percorre $50\,\text{km}$ a $40\,\text{km/h}$ e poi altri $25\,\text{km}$ a $50\,\text{km/h}$, sempre nello
  stesso verso. Qual è la sua velocità media su tutto il viaggio?" Risposta $43\,\text{km/h}$ ($75\,\text{km}$ in
  $1{,}75\,\text{h}$); distrattori $45\,\text{km/h}$ (la media delle velocità), $44\,\text{km/h}$ (la media armonica),
  la media pesata con le distanze quando è diversa.

## Esercizi da evitare

- Velocità nulle, velocità implausibili per il corpo, tratti di uguale durata al livello 5 (la media delle velocità
  sarebbe giusta).

## Verifica

`velocita.py` rilegge il testo, ricalcola con SymPy, controlla intervalli e cifre significative dei dati, la
plausibilità dei corpi, la scena dei livelli 1 e 4 (punti e tratti del testo, niente spostamento).

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 87 px).

### Errori piantati

Su 200 esercizi bocciati tutti: indice dell'opzione giusta, un numero del testo cambiato (al livello 4 e 5 servono i
controlli sui multipli di $10$ e sui quarti d'ora, perché un piccolo cambio può dare lo stesso arrotondamento), testo
dell'opzione giusta, opzione doppia, parole vietate, un punto della scena spostato.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (1000), livello 2 80 (80), livello 3 658 (644),
livello 4 1000 (1000), livello 5 973 (976).
