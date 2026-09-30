# Il moto uniformemente accelerato

Generatore: `moto-uniforme-accelerato` (`src/lib/exercises/v2/generators/moto-uniforme-accelerato.ts`, con
`src/lib/exercises/v2/fis-moto-accelerato.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/moto_uniforme_accelerato.py` (con `_fis_moto.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/42-moto-uniforme-accelerato.md`. Percorso nel database:
`high_school/physics/cinematica/moto-uniforme-accelerato`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La velocità dopo un tempo
2. Partenza da fermo
3. La legge oraria
4. Senza il tempo
5. La frenata
6. Lo spazio di arresto

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, con l'unità nell'opzione ($19\,\text{m/s}$, $41\,\text{m}$, $0{,}89\,\text{s}$). Dati
con due cifre significative, senza zeri finali ambigui ($1{,}1$-$9{,}9$ o $11$-$99$); il tempo di reazione del livello 6
è uno tra $0{,}55$, $0{,}65$, $0{,}75$, $0{,}85$, $0{,}95$, $1{,}1$, ..., $1{,}5\,\text{s}$. Risultati arrotondati a due
cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, sempre sotto $100$ (niente notazione
scientifica nelle opzioni). Nessuna opzione negativa: una velocità o una distanza sotto zero si scarterebbe da sola.

## Regole comuni

- Formule della lezione: $v = v_0 + a\,t$; $s = \tfrac{1}{2}a\,t^2$ da fermo; $\Delta s = v_0\,t + \tfrac{1}{2}a\,t^2$;
  $v^2 = v_0^2 + 2a\,\Delta s$; $t_f = v_0/|a|$, $d_f = v_0^2/(2\,|a|)$; $d = v_0\,t_r + v_0^2/(2\,|a|)$. In frenata,
  con l'asse nel verso del moto, $a < 0$; il testo dà il modulo.
- Corpi: un'auto, uno scooter, un treno, una moto, con l'accordo giusto ("parte da ferma", "da fermo").
- Niente scena: la figura non cambierebbe con i dati.

## Livello 1: la velocità dopo un tempo

$v_0$ da $5$ a $40\,\text{m/s}$, $|a|$ da $1{,}1$ a $4{,}9\,\text{m/s}^2$, $t$ da $1{,}1$ a $20\,\text{s}$. Metà accelera,
metà frena; in frenata la velocità finale resta almeno un quinto di $v_0$ (il corpo non si ferma).

- "Un treno viaggia a $31\,\text{m/s}$ e frena con un'accelerazione costante di modulo $1{,}6\,\text{m/s}^2$. Che
  velocità ha dopo $7{,}6\,\text{s}$?" Risposta $19\,\text{m/s}$; distrattori $29\,\text{m/s}$ ($v_0 - a$, il tempo
  dimenticato), $12\,\text{m/s}$ ($a\,t$, $v_0$ dimenticata), $43\,\text{m/s}$ (il segno della frenata sbagliato).

## Livello 2: partenza da fermo

$a$ da $1{,}1$ a $6\,\text{m/s}^2$, $t$ da $1{,}1$ a $12\,\text{s}$, spazio almeno $1\,\text{m}$.

- "Un'auto parte da ferma con un'accelerazione costante di $2{,}1\,\text{m/s}^2$. Quanta strada percorre nei primi
  $6{,}5\,\text{s}$?" Risposta $44\,\text{m}$; distrattori $89\,\text{m}$ ($a\,t^2$, il mezzo dimenticato),
  $6{,}8\,\text{m}$ ($\tfrac{1}{2}a\,t$, il quadrato dimenticato), $14\,\text{m}$ ($a\,t$, la velocità).

## Livello 3: la legge oraria

$v_0$ da $1{,}1$ a $20\,\text{m/s}$, $|a|$ da $1{,}1$ a $4{,}9\,\text{m/s}^2$, $t$ da $1{,}1$ a $9{,}9\,\text{s}$; metà
accelera, metà frena senza fermarsi (velocità finale almeno $v_0/5$).

- "Uno scooter viaggia a $19\,\text{m/s}$ e frena con un'accelerazione costante di modulo $1{,}6\,\text{m/s}^2$. Quanta
  strada percorre nei primi $2{,}4\,\text{s}$ di frenata?" Risposta $41\,\text{m}$; distrattori $36\,\text{m}$
  ($v_0\,t - a\,t^2$, il mezzo dimenticato), $46\,\text{m}$ ($v_0\,t$, l'accelerazione ignorata), $50\,\text{m}$ (il
  segno sbagliato).

## Livello 4: senza il tempo

Metà la velocità finale ($v_0$ da $1{,}1$ a $20\,\text{m/s}$, $a$ da $1{,}1$ a $4{,}9\,\text{m/s}^2$, tratto da $1{,}1$ a
$99\,\text{m}$), metà lo spazio (velocità finale almeno il $30\%$ sopra quella iniziale, fino a $40\,\text{m/s}$).

- "Un'auto viaggia a $9{,}7\,\text{m/s}$ e accelera con un'accelerazione costante di $3{,}8\,\text{m/s}^2$ per un tratto
  di $5{,}7\,\text{m}$. Che velocità ha alla fine del tratto?" Risposta $12\,\text{m/s}$; distrattori $6{,}6\,\text{m/s}$
  ($\sqrt{2a\,\Delta s}$, $v_0$ dimenticata), $11\,\text{m/s}$ (il $2$ dimenticato), $16\,\text{m/s}$
  ($v_0 + \sqrt{2a\,\Delta s}$, la radice divisa sulla somma).
- "Una moto accelera in modo uniforme da $2{,}2\,\text{m/s}$ a $15\,\text{m/s}$, con un'accelerazione di
  $3{,}5\,\text{m/s}^2$. Quanta strada percorre mentre accelera?" Risposta $31\,\text{m}$; distrattori $63\,\text{m}$ (il
  $2$ dimenticato), $32\,\text{m}$ ($v^2/(2a)$, $v_0$ dimenticata), $23\,\text{m}$ ($(v - v_0)^2/(2a)$).

## Livello 5: la frenata

Velocità da $30$ a $99\,\text{km/h}$ (intera, non multipla di $10$), $|a|$ da $3$ a $8\,\text{m/s}^2$. Metà il tempo,
metà lo spazio di frenata.

- "Un'auto viaggia a $84\,\text{km/h}$ e frena con un'accelerazione costante di modulo $4{,}1\,\text{m/s}^2$ fino a
  fermarsi. Quanta strada percorre durante la frenata?" Risposta $66\,\text{m}$; distrattori il $2$ dimenticato
  ($v_0^2/|a|$, spesso oltre $100$ e sostituito), $2{,}8\,\text{m}$ (il quadrato dimenticato), i chilometri all'ora non
  convertiti (quando stanno sotto $100$); se mancano, la risposta spostata del $20\%$ e del $40\%$.
- Per il tempo i distrattori sono $v/|a|$ con la velocità in km/h, $v_0/(2\,|a|)$ e il rapporto rovesciato.

## Livello 6: lo spazio di arresto

Come il livello 5, più il tempo di reazione; spazio di arresto sotto $100\,\text{m}$.

- "Un'auto viaggia a $78\,\text{km/h}$ quando il guidatore vede un ostacolo. Il suo tempo di reazione è $0{,}75\,\text{s}$,
  poi l'auto frena con un'accelerazione costante di modulo $6{,}8\,\text{m/s}^2$. Quanto vale lo spazio di arresto?"
  Risposta $51\,\text{m}$; distrattori $35\,\text{m}$ (solo la frenata), $16\,\text{m}$ (solo la reazione),
  $85\,\text{m}$ (il $2$ dimenticato nella frenata).

## Esercizi da evitare

- Frenate che portano il corpo a fermarsi prima del tempo del testo (livelli 1 e 3): la legge non varrebbe più.
- Risultati di $100$ o più (servirebbe la notazione scientifica) o sotto $1\,\text{m}$ (livello 2).

## Verifica

`moto_uniforme_accelerato.py` rilegge il testo (con l'accordo e gli intervalli dei dati), ricalcola con i razionali
esatti di SymPy, arrotonda a due cifre, confronta la risposta e il formato delle opzioni, controlla che non ci sia una
scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 73 px su 252, problemi tutti di testo).

### Errori piantati

Su 240 esercizi (40 per livello): indice dell'opzione giusta 240, testo dell'opzione giusta 240, opzione doppia 240,
parole vietate 240, scena aggiunta 240 bocciati. Un numero del testo cambiato di un'unità: 227 su 240; i 13 che
passano danno davvero la stessa risposta arrotondata (per esempio $v_0$ da $19$ a $20$ in una radice).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (999), livello 2 968 (956), livello 3 997 (1000), livello 4 1000 (999), livello 5
923 (907), livello 6 985 (972).

## Domande per la revisione

- Le frenate si danno con il modulo dell'accelerazione ("di modulo $4{,}1\,\text{m/s}^2$"): va bene, o l'Amaldi scrive
  "decelerazione" o $a = -4{,}1\,\text{m/s}^2$?
- Il tempo di reazione con due decimali sotto il secondo ($0{,}75\,\text{s}$): va bene come dato a due cifre?
