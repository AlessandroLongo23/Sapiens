# Il moto rettilineo uniforme e il grafico spazio-tempo

Generatore: `fis-moto-rettilineo-uniforme` (`src/lib/exercises/v2/generators/fis-moto-rettilineo-uniforme.ts`, con
`src/lib/exercises/v2/cinematica.ts` e `grafici.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_moto_rettilineo_uniforme.py` (con `_cinematica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/40-fis-moto-rettilineo-uniforme.md`. Percorso nel database:
`high_school/physics/cinematica/fis-moto-rettilineo-uniforme`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La legge oraria
2. L'istante di arrivo
3. Il grafico spazio-tempo
4. L'area sotto il grafico velocità-tempo
5. L'incontro

## Tipi di risposta

Scelta multipla, quattro opzioni con l'unità. Tutte le risposte sono esatte: i dati sono costruiti all'indietro.

## Regole comuni

- Formule della lezione: $s = s_0 + v\,t$ con $v$ con il segno, $t = (s - s_0)/v$; nel grafico spazio-tempo $s_0$ è
  l'intercetta e $v$ la pendenza; nel grafico velocità-tempo lo spostamento è l'area $v\,\Delta t$; due corpi si
  incontrano quando $s_A = s_B$.
- Velocità con due cifre significative ($1{,}5$-$9{,}5$ a mezzi, o $11$-$25\,\text{m/s}$) ai livelli 1 e 2; corpi
  plausibili per la loro velocità, come nel generatore `velocita`.
- Scene: `grafico-dati` (già registrata) ai livelli 3 e 4, con la retta e, al livello 3, i due punti sugli incroci della
  griglia; `strada-posizioni` al livello 5, con $A$, $B$ e le due velocità.

## Livello 1: la legge oraria

$s_0$ multiplo di $5$ da $-50$ a $200\,\text{m}$, non nullo; $t$ intero da $2$ a $40\,\text{s}$; metà velocità positive e
metà negative.

- "Un carrello si muove di moto rettilineo uniforme con velocità $v = -4{,}5\,\text{m/s}$; all'istante $t = 0$ si trova in
  $s_0 = 60\,\text{m}$. Dove si trova all'istante $t = 20\,\text{s}$?" Risposta $-30\,\text{m}$; distrattori
  $-90\,\text{m}$ ($v\,t$, senza $s_0$), $150\,\text{m}$ ($s_0 - v\,t$), $-150\,\text{m}$ ($v\,t - s_0$).

## Livello 2: l'istante di arrivo

Come il livello 1, ma è data la posizione di arrivo e si chiede l'istante, intero da $3$ a $60\,\text{s}$.

- Stesso carrello, "In quale istante passa per la posizione $s = -75\,\text{m}$?" Risposta $30\,\text{s}$; distrattori
  $17\,\text{s}$ ($s/v$), $3{,}3\,\text{s}$ ($(s + s_0)/v$), $0{,}033\,\text{s}$ (il rapporto rovesciato).

## Livello 3: il grafico spazio-tempo

Un foglio di $10 \times 8$ quadretti, $1$ o $2\,\text{s}$ e $10$ o $20\,\text{m}$ per quadretto; la retta passa per
$(0; s_0)$ e per un secondo incrocio della griglia, con velocità esatta tra $1$ e $25\,\text{m/s}$ in valore assoluto
(anche negativa). Metà chiedono la velocità, metà la posizione in un istante dopo la fine del grafico.

- Retta per $(0\,\text{s}; 30\,\text{m})$ e $(8\,\text{s}; 20\,\text{m})$: "Quanto vale la sua velocità?" Risposta
  $-1{,}25\,\text{m/s}$; distrattori $2{,}5\,\text{m/s}$ ($s/t$ del secondo punto, senza $s_0$), $1{,}25\,\text{m/s}$ (il
  segno perso), $-0{,}8\,\text{m/s}$ (il rapporto rovesciato).
- Per la posizione i distrattori sono $v\,t$ senza $s_0$, la velocità letta come $s/t$ e il segno perso.

## Livello 4: l'area sotto il grafico velocità-tempo

Retta orizzontale su una linea della griglia ($1$, $2$ o $5\,\text{m/s}$ per quadretto), velocità positiva al più
$25\,\text{m/s}$; intervallo da $t_1$ a $t_2$ dentro il grafico, non sempre da zero.

- Velocità $6\,\text{m/s}$, "Di quanto si sposta tra $t = 2\,\text{s}$ e $t = 7\,\text{s}$?" Risposta $30\,\text{m}$;
  distrattori $42\,\text{m}$ ($v\,t_2$, da zero), $12\,\text{m}$ ($v\,t_1$), $1{,}2\,\text{m}$ ($v/\Delta t$).

## Livello 5: l'incontro

Metà incontri (due ciclisti, da $2$ a $12\,\text{m/s}$, dalle due estremità di una strada), metà inseguimenti (un'auto
da $18$ a $36\,\text{m/s}$ dietro un camion più lento di almeno $2\,\text{m/s}$). Istante intero da $5$ a $60\,\text{s}$,
distanza iniziale da $50$ a $2000\,\text{m}$. Si chiede l'istante o la posizione (la strada fatta da $A$).

- "Due ciclisti partono nello stesso istante dalle due estremità di una strada dritta lunga $260\,\text{m}$ e si vengono
  incontro: $A$ va a $6\,\text{m/s}$, $B$ a $7\,\text{m/s}$. Dopo quanto tempo si incontrano?" Risposta $20\,\text{s}$;
  distrattori $260\,\text{s}$ (la differenza delle velocità), $43\,\text{s}$ ($D/v_A$), $37\,\text{s}$ ($D/v_B$).
- Nell'inseguimento il distrattore principale è la somma delle velocità; per la posizione, la strada dell'altro corpo,
  metà della distanza, la distanza iniziale.

## Esercizi da evitare

- Posizioni finali nulle o lontanissime ($|s| > 600\,\text{m}$), un istante chiesto al livello 3 dentro il grafico,
  velocità implausibili.

## Verifica

`fis_moto_rettilineo_uniforme.py` rilegge il testo, ricalcola con numeri esatti, controlla gli intervalli, rilegge la
scena `grafico-dati` (la retta passa per i punti disegnati, i punti sono sugli incroci e dentro il foglio, la retta
velocità-tempo è orizzontale su una linea della griglia) e la scena `strada-posizioni` (i due corpi e i versi delle
velocità).

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 76 px).

### Errori piantati

Su 200 esercizi bocciati tutti: indice dell'opzione giusta, un numero del testo, testo dell'opzione giusta, opzione
doppia, parole vietate, la scena cambiata (retta spostata di un quadretto o un punto della strada spostato, 120 su 120).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (997), livello 2 999 (996), livello 3 953 (947), livello 4 935 (941), livello 5 985
(992).

## Domande per la revisione

- Al livello 3 le velocità lette sul grafico possono avere tre cifre ($-1{,}25\,\text{m/s}$): vanno bene, visto che sono
  esatte, o si arrotondano a due cifre significative?
