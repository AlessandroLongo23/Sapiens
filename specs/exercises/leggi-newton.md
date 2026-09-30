# Il secondo principio della dinamica

Generatore: `leggi-newton` (`src/lib/exercises/v2/generators/leggi-newton.ts`, con `src/lib/exercises/v2/fis-dinamica.ts`,
`fisica-equilibrio.ts`, `vettori.ts` e `raggi-specchi.ts` per la notazione scientifica). Verifica indipendente:
`scripts/exercises/checkers/leggi_newton.py` (con `_dinamica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/51-leggi-newton.md`. Percorso nel database: `high_school/physics/dinamica/leggi-newton`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'accelerazione
2. La forza o la massa
3. Due forze opposte
4. Due forze perpendicolari
5. Con l'attrito
6. Forza e velocità

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità: accelerazioni ($4{,}4\,\text{m/s}^2$, al livello 3 con il verso:
$4{,}4\,\text{m/s}^2\ \text{verso destra}$), forze ($58\,\text{N}$, al livello 6 in notazione scientifica,
$5{,}0 \cdot 10^{3}\,\text{N}$), masse ($13\,\text{kg}$). Dati con due cifre significative: masse e accelerazioni da
$1{,}1$ a $9{,}9$, forze da $1{,}1$ a $9{,}9$ o da $11$ a $99\,\text{N}$ (mai un intero che finisce con zero), coefficienti
con due decimali; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento, mai un intero di due cifre che finisce con zero, sotto $100$ (tranne il livello 6).

## Livello 1: l'accelerazione

Un carrello, una slitta o una cassa (con l'accordo) tirati su un piano orizzontale senza attrito da una forza
orizzontale: $a = F/m$. Scena `blocco-forze` con la forza.

- "Una cassa di $3{,}6\,\text{kg}$ è tirata su un piano orizzontale senza attrito da una forza orizzontale di
  $6{,}2\,\text{N}$. Quanto vale la sua accelerazione?" Risposta $1{,}7\,\text{m/s}^2$; distrattori $22\,\text{m/s}^2$
  ($F \cdot m$), $0{,}58\,\text{m/s}^2$ ($m/F$), $0{,}18\,\text{m/s}^2$ (la forza divisa per il peso).

## Livello 2: la forza o la massa

Metà: la forza che dà una certa accelerazione, $F = m\,a$ (senza scena, la forza è la risposta); metà: la massa da
forza e accelerazione, $m = F/a$, almeno $0{,}5\,\text{kg}$ (scena con la forza).

- "Quale forza orizzontale serve per dare a un carrello di $9{,}4\,\text{kg}$, su un piano senza attrito,
  un'accelerazione di $6{,}2\,\text{m/s}^2$?" Risposta $58\,\text{N}$; distrattori $1{,}5\,\text{N}$ ($m/a$),
  $0{,}66\,\text{N}$ ($a/m$), e $m\,a\,g$ quando sta sotto $100$, altrimenti il 20% in meno ($47\,\text{N}$).
- "Una slitta, tirata su un piano orizzontale senza attrito da una forza orizzontale di $86\,\text{N}$, ha
  un'accelerazione di $6{,}5\,\text{m/s}^2$. Quanto vale la sua massa?" Risposta $13\,\text{kg}$; distrattori $F\,a$
  (oltre $100$, saltato), $0{,}076\,\text{kg}$ ($a/F$), $8{,}8\,\text{kg}$ ($F/g$, la massa ricavata come da un peso),
  $16\,\text{kg}$.

## Livello 3: due forze opposte

Una cassa sul ghiaccio tirata verso destra e verso sinistra, con forze che differiscono di almeno $5\,\text{N}$: la
forza totale è la differenza, e l'accelerazione ha il verso della forza più grande. Le opzioni hanno il verso. Scena
`blocco-forze` con $\vec F_1$ a destra e $\vec F_2$ a sinistra.

- "Una cassa di $6{,}3\,\text{kg}$ sta su una lastra di ghiaccio, dove l'attrito si trascura. È tirata verso destra con
  una forza di $86\,\text{N}$ e verso sinistra con una forza di $58\,\text{N}$. Quanto vale la sua accelerazione?"
  Risposta $4{,}4\,\text{m/s}^2$ verso destra; distrattori $4{,}4\,\text{m/s}^2$ verso sinistra (il verso sbagliato),
  $23\,\text{m/s}^2$ verso destra (le forze sommate), $14\,\text{m/s}^2$ verso destra (la forza più grande da sola).

## Livello 4: due forze perpendicolari

Una slitta tirata da due funi orizzontali perpendicolari, con forze diverse (la più piccola almeno il $40\%$ della più
grande): $F_{tot} = \sqrt{F_1^2 + F_2^2}$, poi $a = F_{tot}/m$. Scena `punto-forze`, la slitta vista dall'alto.

- "Una slitta di $9{,}4\,\text{kg}$ sul ghiaccio, dove l'attrito si trascura, è tirata da due funi orizzontali
  perpendicolari tra loro, con forze di $24\,\text{N}$ e $12\,\text{N}$. Quanto vale la sua accelerazione?" Risposta
  $2{,}9\,\text{m/s}^2$; distrattori $3{,}8\,\text{m/s}^2$ (le forze sommate), $1{,}3\,\text{m/s}^2$ (sottratte),
  $2{,}6\,\text{m/s}^2$ (la forza più grande da sola).

## Livello 5: con l'attrito

Una cassa che striscia sul pavimento, tirata da una forza orizzontale tra $1{,}3$ e $3$ volte l'attrito dinamico
$\mu_d\,m\,g$ ($\mu_d$ da $0{,}10$ a $0{,}50$): $a = (F - \mu_d m g)/m$. Scena con la forza.

- "Una cassa di $6{,}3\,\text{kg}$ striscia sul pavimento, tirata con una forza orizzontale di $58\,\text{N}$; il
  coefficiente di attrito dinamico è $\mu_d = 0{,}44$. Quanto vale l'accelerazione della cassa?" $F_d = 27{,}2\,\text{N}$,
  risposta $4{,}9\,\text{m/s}^2$; distrattori $9{,}2\,\text{m/s}^2$ (l'attrito dimenticato), $14\,\text{m/s}^2$ (l'attrito
  sommato), $8{,}8\,\text{m/s}^2$ ($\mu_d\,m$ al posto di $\mu_d\,m\,g$).

## Livello 6: forza e velocità

Un'auto di massa tra $1{,}0$ e $2{,}5 \cdot 10^3\,\text{kg}$ si ferma da una velocità, oppure parte da ferma e la
raggiunge, in un tempo da $1{,}1$ a $9{,}9\,\text{s}$, con accelerazione costante. La velocità è in km/h, tra $36$, $45$,
$54$, $63$, $72$ e $81$: va divisa per $3{,}6$. La forza è $m\,v/t$, in notazione scientifica. Niente scena.

- "Un'auto di $1{,}8 \cdot 10^3\,\text{kg}$ parte da ferma e raggiunge $63\,\text{km/h}$ in $6{,}3\,\text{s}$ con
  accelerazione costante. Quanto vale la forza totale sull'auto?" Risposta $5{,}0 \cdot 10^{3}\,\text{N}$; distrattori
  $1{,}8 \cdot 10^{4}\,\text{N}$ (km/h non convertiti), $2{,}0 \cdot 10^{5}\,\text{N}$ (moltiplicato per il tempo),
  $3{,}2 \cdot 10^{4}\,\text{N}$ ($m\,v$, il tempo dimenticato), oppure il 20% in più o in meno.

## Esercizi da evitare

- Risultati con uno zero finale ambiguo o oltre $99$ (livelli 1-5).
- Al livello 3 forze quasi uguali; al livello 4 forze uguali o molto diverse.
- Al livello 5 forze che superano appena l'attrito, o così grandi che l'attrito non conta.

## Verifica

`leggi_newton.py` rilegge il testo (con l'accordo), controlla cifre significative e intervalli, calcola con SymPy
(aritmetica esatta, la velocità come $v \cdot 5/18$), confronta la risposta e le opzioni, controlla le scene (le forze del
testo con modulo e angolo, niente scena dove la forza è la risposta).

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello ciascuno, PASS, quote dei casi dentro
gli intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 180 px su 252, quelle con il verso).

### Esercizi diversi su 1.000

Seed da 1: livello 1 991, livello 2 983, livello 3 999, livello 4 999, livello 5 994, livello 6 972.

### Errori piantati

Bocciati tutti (240 su 240; 180 su 180 per la scena): indice dell'opzione giusta, un numero del testo cambiato, il testo
dell'opzione giusta, un'opzione doppia, parole vietate, un modulo della scena spostato, la scena tolta.

## Domande per la revisione

- Il livello 6 mescola dinamica e cinematica (e la conversione da km/h): è il livello giusto per chiudere, o va nella
  lezione sulle applicazioni?
- Al livello 3 il verso è nelle opzioni: va bene, o si chiede solo il modulo?
