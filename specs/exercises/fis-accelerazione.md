# L'accelerazione

Generatore: `fis-accelerazione` (`src/lib/exercises/v2/generators/fis-accelerazione.ts`, con
`src/lib/exercises/v2/cinematica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_accelerazione.py` (con
`_cinematica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/41-fis-accelerazione.md`. Percorso nel database:
`high_school/physics/cinematica/fis-accelerazione`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'accelerazione media
2. Con i chilometri all'ora
3. La frenata
4. Velocità finale e tempo
5. Il segno dell'accelerazione

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($2{,}6\,\text{m/s}^2$, $26\,\text{m/s}$, $4\,\text{s}$). Accelerazioni con due
cifre significative ($1{,}1$-$6{,}9\,\text{m/s}^2$, esatte, senza zero dopo la virgola) ai livelli 1, 3 e 5; al livello 2
arrotondate a due cifre significative, mai vicino a un confine; al livello 4 velocità e tempi interi.

## Regole comuni

- Formule della lezione: $a_m = (v_2 - v_1)/\Delta t$ con il segno, $\Delta v = a_m\,\Delta t$, $\Delta t = \Delta v / a_m$,
  i $\text{km/h}$ divisi per $3{,}6$.
- Corpi plausibili: la velocità come nel generatore `velocita`; nessuna accelerazione oltre $7\,\text{m/s}^2$, e un treno
  mai oltre $1{,}5\,\text{m/s}^2$ (allora il corpo diventa un'auto). Il controllo lo verifica.
- Nessuna scena: i dati sono numeri, e una figura non aggiunge niente.

## Livello 1: l'accelerazione media

$v_1$ intero da $1$ a $20\,\text{m/s}$, $\Delta t$ da $2$ a $12\,\text{s}$, $v_2$ al più $40\,\text{m/s}$.

- "Un'auto passa da $9\,\text{m/s}$ a $40\,\text{m/s}$ in $5\,\text{s}$. Qual è la sua accelerazione media?" Risposta
  $6{,}2\,\text{m/s}^2$; distrattori $8{,}0\,\text{m/s}^2$ ($v_2/\Delta t$), $0{,}16\,\text{m/s}^2$ (il rapporto
  rovesciato), $9{,}8\,\text{m/s}^2$ ($(v_1 + v_2)/\Delta t$).

## Livello 2: con i chilometri all'ora

Velocità in $\text{km/h}$ che corrispondono a multipli di $5\,\text{m/s}$ (da ferma, o da $18$, $36$, $54$, $72\,\text{km/h}$),
fino a $144\,\text{km/h}$; $\Delta t$ da $2$ a $15\,\text{s}$; accelerazione al più $7\,\text{m/s}^2$. Un'auto, una moto o
(sotto $1{,}5\,\text{m/s}^2$) un treno, con l'accordo di "ferma" e "fermo".

- "Un'auto passa da $18\,\text{km/h}$ a $72\,\text{km/h}$ in $5\,\text{s}$. Qual è la sua accelerazione media?" Risposta
  $3{,}0\,\text{m/s}^2$; distrattori $11\,\text{m/s}^2$ (i $\text{km/h}$ non convertiti), $39\,\text{m/s}^2$ ($3{,}6$ dalla
  parte sbagliata), $4{,}0\,\text{m/s}^2$ (la velocità finale al posto della variazione).

## Livello 3: la frenata

Accelerazione negativa; metà dei corpi si fermano, metà rallentano fino a una velocità da $2$ a $20\,\text{m/s}$;
$v_1$ al più $40\,\text{m/s}$.

- "Un'auto che va a $19\,\text{m/s}$ frena e in $5\,\text{s}$ scende a $8\,\text{m/s}$. Qual è la sua accelerazione media?"
  Risposta $-2{,}2\,\text{m/s}^2$; distrattori $2{,}2\,\text{m/s}^2$ (il segno perso), $-3{,}8\,\text{m/s}^2$
  ($-v_1/\Delta t$), $-5{,}4\,\text{m/s}^2$ ($-(v_1 + v_2)/\Delta t$).

## Livello 4: velocità finale e tempo

Accelerazione da $0{,}2$ a $4{,}8\,\text{m/s}^2$ in decimi (senza zero dopo la virgola), negativa in circa un caso su tre
(il corpo frena); $v_1$ da $2$ a $30\,\text{m/s}$, $\Delta t$ da $2$ a $30\,\text{s}$, $v_2$ intera tra $0$ e $40$. Metà
chiedono la velocità finale, metà il tempo.

- "Un'auto va a $5\,\text{m/s}$ e accelera per $14\,\text{s}$ con un'accelerazione media di $1{,}5\,\text{m/s}^2$. A che
  velocità arriva?" Risposta $26\,\text{m/s}$; distrattori $21\,\text{m/s}$ ($a\,\Delta t$, senza $v_1$), $5{,}1\,\text{m/s}$
  ($v_1 + a/\Delta t$), $31\,\text{m/s}$ quando serve un riempitivo.
- Per il tempo i distrattori sono $v_2/a$ (senza $v_1$), $(v_1 + v_2)/a$, il rapporto rovesciato.

## Livello 5: il segno dell'accelerazione

Velocità negative da $-2$ a $-40\,\text{m/s}$; metà dei corpi frenano ($|v|$ cala, $a > 0$), metà vanno sempre più
veloci ($a < 0$); istanti $t_1$ da $1$ a $5\,\text{s}$.

- "Un'auto si muove nel verso negativo di una strada dritta. All'istante $t_1 = 5\,\text{s}$ la sua velocità è
  $v_1 = -27\,\text{m/s}$, all'istante $t_2 = 9\,\text{s}$ è $v_2 = -5\,\text{m/s}$. Qual è la sua accelerazione media?"
  Risposta $5{,}5\,\text{m/s}^2$ (frena); distrattori $-5{,}5\,\text{m/s}^2$ (il segno rovesciato), $-8{,}0\,\text{m/s}^2$
  (il meno davanti alla parentesi perso: $-5 - 27$), $0{,}18\,\text{m/s}^2$ (il rapporto rovesciato).

## Esercizi da evitare

- Accelerazioni implausibili (oltre $7\,\text{m/s}^2$, un treno oltre $1{,}5\,\text{m/s}^2$), velocità finali negative al
  livello 4, $v_2 = v_1$.

## Verifica

`fis_accelerazione.py` rilegge il testo (con l'accordo di "ferma" e "fermo"), ricalcola con SymPy, controlla intervalli,
cifre significative, plausibilità, il verbo ("frena" solo con l'accelerazione negativa al livello 4) e che non ci sia
una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 84 px).

### Errori piantati

Su 200 esercizi bocciati tutti: indice dell'opzione giusta, un numero del testo, testo dell'opzione giusta, opzione
doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 701 (706), livello 2 525 (520), livello 3 488 (465), livello 4 961 (954), livello 5 957
(963). I livelli 1-3 hanno pochi dati (tre numeri con vincoli stretti di plausibilità).

## Domande per la revisione

- Il livello 4 usa $\Delta v = a_m\,\Delta t$, che la lezione ricava dalla definizione; la formula $v = v_0 + a\,t$ è della
  lezione sul moto uniformemente accelerato. Va bene anticiparla così, o il livello va spostato là?
