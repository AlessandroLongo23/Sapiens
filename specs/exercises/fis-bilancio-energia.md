# Il bilancio dell'energia con le forze non conservative

Generatore: `fis-bilancio-energia` (`src/lib/exercises/v2/generators/fis-bilancio-energia.ts`, con `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_bilancio_energia.py` (con `_fis_quantita_moto.py`, `_fis_energia.py` e `_vettori.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/79-fis-bilancio-energia.md`. Percorso nel database: `high_school/physics/fis-forze-conservative/fis-bilancio-energia`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il bilancio con i lavori dati
2. Discesa liscia e tratto con attrito
3. La molla e il pavimento con attrito
4. La rampa con attrito e la molla
5. La cassa tirata in salita
6. La forza media di una resistenza

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Dati con due cifre significative senza zeri finali ambigui (costanti
elastiche e forza della fune con tre, coefficienti di attrito con due decimali e mai con lo zero finale, angoli in gradi
interi); $g = 9{,}8\,\text{m/s}^2$; risposte a due cifre, nessun distrattore a meno dell'8%. Il livello 1 ha energie
intere e risposta esatta.

## Livello 1: il bilancio con i lavori dati

Energia meccanica iniziale da $21$ a $79\,\text{J}$, lavoro positivo di una fune o di un motore e lavoro negativo
dell'attrito, da $11$ a $59\,\text{J}$ in modulo, diversi tra loro; nessun valore multiplo di 10; $E_f$ tra $11$ e $99$.

- "Un carrello ha un'energia meccanica di $72\,\text{J}$. Poi un motore compie un lavoro di $21\,\text{J}$ e l'attrito un
  lavoro di $-36\,\text{J}$. Quanto vale ora l'energia meccanica?" Risposta $57\,\text{J}$; distrattori $87\,\text{J}$ (tutti
  e due i segni rovesciati), $129\,\text{J}$ (il segno dell'attrito), $15\,\text{J}$ (il segno del motore).

## Livello 2: discesa liscia e tratto con attrito

Altezza da $0{,}5$ a $9{,}9\,\text{m}$, $\mu_d$ da $0{,}11$ a $0{,}59$; $d = h/\mu_d$ di almeno $1\,\text{m}$. Scena
`pista-energia` con l'altezza.

- "Uno slittino parte da fermo dal punto $A$, in cima a una discesa liscia alta $0{,}86\,\text{m}$. In fondo, dal punto
  $B$, prosegue su un tratto orizzontale con $\mu_d = 0{,}17$. Quanta strada percorre sul tratto orizzontale prima di
  fermarsi?" Risposta $5{,}1\,\text{m}$; distrattori $0{,}15\,\text{m}$ ($h \cdot \mu_d$), $4{,}1\,\text{m}$ (la velocità in
  fondo letta come distanza), $0{,}52\,\text{m}$ ($g$ rimasto nella formula).

## Livello 3: la molla e il pavimento con attrito

Costante da $101$ a $999\,\text{N/m}$, compressione da $2{,}0$ a $25\,\text{cm}$, massa da $0{,}11$ a $5{,}0\,\text{kg}$;
$d = k x^2 / (2 \mu_d m g)$ almeno tre volte la compressione e almeno $0{,}1\,\text{m}$. Distrattori: senza il mezzo,
senza la massa nell'attrito, senza $g$.

## Livello 4: la rampa con attrito e la molla

Massa da $0{,}5$ a $9{,}9\,\text{kg}$, lunghezza da $0{,}5$ a $5{,}0\,\text{m}$, angolo da $20^\circ$ a $50^\circ$, $\mu_d$
fino a $0{,}39$ con $\tan\alpha \ge 1{,}5\,\mu_d$, costante da $201$ a $999\,\text{N/m}$; compressione in centimetri tra $2$
e $60$. Scena `piano-inclinato`. Distrattori: attrito dimenticato, forza premente $m g$, seno e coseno scambiati.

## Livello 5: la cassa tirata in salita

Massa da $2{,}0$ a $25\,\text{kg}$, angolo da $15^\circ$ a $40^\circ$, $\mu_d$ fino a $0{,}39$, tratto da $1{,}1$ a
$9{,}9\,\text{m}$; forza della fune intera, da $101$ a $999\,\text{N}$, tra $1{,}2$ e $2$ volte quella che serve a salire a
velocità costante; energia cinetica finale almeno il 15% del lavoro della fune. Scena `piano-inclinato` con la forza
$F$. Distrattori: attrito dimenticato, energia potenziale dimenticata, lavoro dell'attrito sommato.

## Livello 6: la forza media di una resistenza

Un tuffatore o una tuffatrice da $41$ a $95\,\text{kg}$, piattaforma da $3{,}0$ a $9{,}9\,\text{m}$, profondità da $1{,}5$ a
$4{,}5\,\text{m}$; $F = m g (h + d)/d$ in kilonewton. Distrattori: la profondità lasciata fuori dal dislivello, il peso
da solo, $g$ dimenticata.

## Esercizi da evitare

- Coefficienti di attrito con lo zero finale ($0{,}30$), che chiederebbero di decidere quante cifre hanno.
- Rampe vicine all'angolo limite, dove l'attrito mangia quasi tutta l'energia.
- Al livello 5, forze appena sufficienti a far salire la cassa.

## Verifica

Il controllo rilegge il testo con un'espressione regolare per livello, controlla cifre significative e intervalli,
ricalcola con $g = 49/5$ e aritmetica esatta (SymPy), confronta la risposta e il formato delle quattro opzioni; dove c'è
una scena controlla che porti i dati del testo e niente di più.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 70 px su 252). `eslint` pulito.

### Errori piantati

Su 40 esercizi per livello (seed 777001): indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole
vietate e una cifra dei dati cambiata, bocciati tutti. Un numero della scena cambiato: 101 su 120; le 19 che passano toccano la scala della freccia al livello 5, che è solo di disegno.

### Esercizi diversi su 1.000

Seed da 1: livello 1 984, livello 2 970, livello 3 1000, livello 4 1000, livello 5 1000, livello 6 996.

## Domande per la revisione

- Il livello 6 dà la forza in kilonewton per tenere due cifre senza notazione scientifica: va bene?
- Gli esempi 3 e 4 della lezione chiedono seno e coseno dalla calcolatrice: i livelli 4 e 5 fanno lo stesso.
