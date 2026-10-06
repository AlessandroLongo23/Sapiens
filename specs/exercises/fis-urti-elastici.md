# Gli urti elastici in una e in due dimensioni

Generatore: `fis-urti-elastici` (`src/lib/exercises/v2/generators/fis-urti-elastici.ts`, con
`src/lib/exercises/v2/fis-urti.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_urti_elastici.py` (con `_fis_urti.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/84-fis-urti-elastici.md`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più: tre lungo una retta, due nel piano.

## Nomi dei livelli

1. La velocità del corpo colpito
2. Il primo corpo prosegue o torna indietro
3. Due corpi che si vengono incontro
4. Le direzioni dopo un colpo di striscio
5. Le velocità dopo un colpo di striscio

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($1{,}9\,\text{m/s}$), nel livello 4 in gradi ($38^\circ$). Dati con due
cifre significative senza zeri finali ambigui; angoli interi. Risultati a due cifre significative, mai a meno di
$10^{-6}$ da un confine di arrotondamento e mai un numero intero di decine. Nei livelli 2 e 3 la risposta ha il
segno. Nessun distrattore a meno dell'8% della risposta; i posti vuoti li prendono risposte di scorta.

## Regole comuni

- Formule della lezione: $V_1 = \dfrac{(m_1 - m_2) v_1 + 2 m_2 v_2}{m_1 + m_2}$,
  $V_2 = \dfrac{(m_2 - m_1) v_2 + 2 m_1 v_1}{m_1 + m_2}$; con il bersaglio fermo $V_1 = \dfrac{m_1 - m_2}{m_1 + m_2} v_1$ e
  $V_2 = \dfrac{2 m_1}{m_1 + m_2} v_1$; masse uguali e bersaglio fermo nel piano: $\theta_1 + \theta_2 = 90^\circ$,
  $V_1 = v_1\cos\theta_1$, $V_2 = v_1\sin\theta_1$.
- Lungo una retta le masse vanno da $1{,}1$ a $9{,}9\,\text{kg}$ e differiscono di almeno il 15%: con masse uguali le
  velocità si scambiano e non c'è niente da calcolare.

## Livello 1: la velocità del corpo colpito

Un carrello ($v_1$ da $1{,}1$ a $9{,}9\,\text{m/s}$) urta elasticamente un carrello fermo. Risposta $V_2$.

- "Su una rotaia un carrello di $5{,}1\,\text{kg}$ si muove a $2{,}5\,\text{m/s}$ e urta elasticamente un carrello
  fermo di $8{,}6\,\text{kg}$. Con che velocità parte il carrello che era fermo?" Risposta $1{,}9\,\text{m/s}$;
  distrattori $0{,}93\,\text{m/s}$ (la formula dei corpi che restano uniti), $2{,}5\,\text{m/s}$ (velocità scambiate,
  come tra masse uguali), $3{,}1\,\text{m/s}$ (masse scambiate).
- "... un carrello di $1{,}7\,\text{kg}$ si muove a $1{,}2\,\text{m/s}$ ... fermo di $9{,}4\,\text{kg}$. ..." Risposta
  $0{,}37\,\text{m/s}$; distrattori $0{,}18\,\text{m/s}$, $1{,}2\,\text{m/s}$, $2{,}0\,\text{m/s}$.

## Livello 2: il primo corpo prosegue o torna indietro

In più: il segno. Stessa situazione; risposta $V_1$, di almeno $0{,}2\,\text{m/s}$ in modulo, positiva se il primo
carrello è più pesante e negativa se è più leggero (ognuno dei due casi tra il 35% e il 65%).

- "Su una rotaia un carrello di $5{,}1\,\text{kg}$ si muove a $2{,}5\,\text{m/s}$ e urta elasticamente un carrello
  fermo di $8{,}6\,\text{kg}$. Qual è la velocità del primo carrello dopo l'urto? Prendi come positivo il verso in cui
  si muoveva." Risposta $-0{,}64\,\text{m/s}$; distrattori $0{,}64\,\text{m/s}$ (segno perso), $0{,}93\,\text{m/s}$
  (corpi uniti), $1{,}9\,\text{m/s}$ (la velocità dell'altro carrello).
- "... un carrello di $1{,}7\,\text{kg}$ si muove a $1{,}2\,\text{m/s}$ ... fermo di $9{,}4\,\text{kg}$. ..." Risposta
  $-0{,}83\,\text{m/s}$; distrattori $0{,}83\,\text{m/s}$, $0{,}18\,\text{m/s}$, $0{,}37\,\text{m/s}$.

## Livello 3: due corpi che si vengono incontro

In più: tutti e due in moto, con la formula generale e $v_2$ negativa. Velocità da $1{,}1$ a $9{,}9\,\text{m/s}$;
risposta $V_1$ con il segno, di almeno $0{,}2\,\text{m/s}$ in modulo.

- "Su una rotaia un carrello di $5{,}1\,\text{kg}$ si muove verso destra a $2{,}5\,\text{m/s}$; un carrello di
  $8{,}6\,\text{kg}$ gli viene incontro a $3{,}5\,\text{m/s}$. L'urto è elastico. Qual è la velocità del primo
  carrello dopo l'urto? Prendi come positivo il verso destra." Risposta $-5{,}0\,\text{m/s}$; distrattori
  $3{,}8\,\text{m/s}$ (segno di $v_2$ dimenticato, l'avviso della lezione), $-1{,}3\,\text{m/s}$ (corpi uniti),
  $0{,}97\,\text{m/s}$ (la formula dell'altro carrello).
- "... un carrello di $1{,}7\,\text{kg}$ si muove verso destra a $1{,}2\,\text{m/s}$; un carrello di
  $9{,}4\,\text{kg}$ gli viene incontro a $6{,}7\,\text{m/s}$. ..." Risposta $-12\,\text{m/s}$; distrattori
  $11\,\text{m/s}$, $-5{,}5\,\text{m/s}$, $-4{,}3\,\text{m/s}$.

## Livello 4: le direzioni dopo un colpo di striscio

In più: due dimensioni, con la regola dei $90^\circ$. Una boccia ($v_1$ da $1{,}1$ a $9{,}9\,\text{m/s}$) colpisce di
striscio una boccia ferma della stessa massa e devia di $\theta_1$, intero tra $15^\circ$ e $75^\circ$ e ad almeno
$6^\circ$ da $45^\circ$. Risposta $\theta_2 = 90^\circ - \theta_1$.

Scena `vettori-piano`: la velocità iniziale lungo la retta orizzontale, con il suo valore, e dal punto $O$ dell'urto
la direzione tratteggiata della prima boccia dopo l'urto, con l'angolo. La freccia tratteggiata ha sempre la stessa
lunghezza (non dà la velocità), e della boccia colpita non c'è niente.

- "Su un tavolo da biliardo una boccia a $5{,}8\,\text{m/s}$ colpisce di striscio una boccia ferma della stessa
  massa. L'urto è elastico, e dopo l'urto la prima boccia si muove in una direzione che forma un angolo di $52^\circ$
  con quella iniziale. Che angolo forma con la direzione iniziale la velocità della boccia colpita?" Risposta
  $38^\circ$; distrattori $52^\circ$ (lo stesso angolo), $128^\circ$ (il supplementare), $142^\circ$ ($90^\circ +
  \theta_1$).
- "... un angolo di $72^\circ$ ..." Risposta $18^\circ$; distrattori $72^\circ$, $108^\circ$, $162^\circ$.

## Livello 5: le velocità dopo un colpo di striscio

In più: i moduli, dal triangolo rettangolo delle velocità. Stessa situazione e stessa scena; metà delle volte si
chiede $V_1 = v_1\cos\theta_1$, metà $V_2 = v_1\sin\theta_1$ (ognuna tra il 40% e il 60%).

- "... una boccia a $5{,}8\,\text{m/s}$ ... un angolo di $52^\circ$ con quella iniziale. Con che velocità parte la
  boccia colpita?" Risposta $4{,}6\,\text{m/s}$; distrattori $3{,}6\,\text{m/s}$ (seno e coseno scambiati),
  $7{,}4\,\text{m/s}$ (la tangente), $2{,}9\,\text{m/s}$ (la velocità divisa a metà).
- "... una boccia a $1{,}7\,\text{m/s}$ ... un angolo di $72^\circ$ ... Qual è la velocità della prima boccia dopo
  l'urto?" Risposta $0{,}53\,\text{m/s}$; distrattori $1{,}6\,\text{m/s}$, $5{,}2\,\text{m/s}$, $0{,}85\,\text{m/s}$.

## Da evitare

- Masse uguali lungo una retta, e risposte quasi nulle nei livelli con il segno.
- Angoli vicini a $45^\circ$, dove le due bocce hanno la stessa velocità e seno e coseno non si distinguono.
- Urti nel piano tra masse diverse: chiedono un sistema di tre equazioni, che la lezione fa in un esempio ma che non
  si presta alla scelta multipla.
- Nella scena, la direzione o la velocità della boccia colpita.
