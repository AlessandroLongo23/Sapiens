# Gli urti anelastici

Generatore: `fis-urti-anelastici` (`src/lib/exercises/v2/generators/fis-urti-anelastici.ts`, con
`src/lib/exercises/v2/fis-urti.ts`, `fis-energia.ts`, `fis-lavoro.ts`, `fisica-equilibrio.ts` e `vettori.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_urti_anelastici.py` (con `_fis_urti.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/83-fis-urti-anelastici.md`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. I due corpi restano attaccati
2. Urto frontale con i corpi attaccati
3. L'energia dissipata
4. I corpi si separano dopo l'urto
5. Il pendolo balistico
6. Urto ad angolo retto

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Dati con due cifre significative senza zeri finali ambigui;
$g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento. Nessuna opzione è un numero intero di decine ($40$, $20$); le energie (livello 3) e la velocità del
proiettile (livello 5) da $100$ in su si scrivono in notazione scientifica, come nella lezione
($3{,}7 \cdot 10^2\,\text{m/s}$). Nel livello 2 la risposta ha il segno. Nessun distrattore a meno dell'8% della
risposta; i posti vuoti li prendono risposte di scorta.

## Regole comuni

- Simboli della lezione: $v_1$, $v_2$ prima, $V$ (velocità comune) o $V_1$, $V_2$ dopo; $E_d = K_i - K_f$.
- Lungo una retta l'asse è verso destra, e la velocità di chi viene incontro è negativa.

## Livello 1: i due corpi restano attaccati

Un carrello ne urta uno fermo e resta agganciato. Masse da $1{,}1$ a $9{,}9\,\text{kg}$, diverse di almeno il 15%;
velocità da $1{,}1$ a $9{,}9\,\text{m/s}$. Risposta $V = m_1 v_1/(m_1 + m_2)$.

- "Su una rotaia un carrello di $2{,}5\,\text{kg}$ si muove a $4{,}4\,\text{m/s}$ e urta un carrello fermo di
  $3{,}5\,\text{kg}$. Dopo l'urto i due carrelli restano agganciati. Con che velocità si muovono?" Risposta
  $1{,}8\,\text{m/s}$; distrattori $2{,}2\,\text{m/s}$ (la media delle velocità, l'avviso della lezione),
  $3{,}1\,\text{m/s}$ ($m_1 v_1/m_2$), $2{,}6\,\text{m/s}$ (masse scambiate).
- "... un carrello di $1{,}7\,\text{kg}$ si muove a $1{,}2\,\text{m/s}$ e urta un carrello fermo di
  $9{,}4\,\text{kg}$. ..." Risposta $0{,}18\,\text{m/s}$; distrattori $0{,}60\,\text{m/s}$, $0{,}22\,\text{m/s}$,
  $1{,}0\,\text{m/s}$.

## Livello 2: urto frontale con i corpi attaccati

In più: il secondo carrello viene incontro, e la risposta ha il segno. Tutti i dati da $1{,}1$ a $9{,}9$; velocità
finale di almeno $0{,}2\,\text{m/s}$ in modulo. Risposta $V = (m_1 v_1 - m_2 v_2)/(m_1 + m_2)$, con $v_2$ il modulo
scritto nel testo. Circa metà delle risposte positive e metà negative (tra il 35% e il 65%).

- "Su una rotaia un carrello di $1{,}7\,\text{kg}$ si muove verso destra a $1{,}2\,\text{m/s}$; un carrello di
  $9{,}4\,\text{kg}$ gli viene incontro a $6{,}7\,\text{m/s}$. Nell'urto i due restano agganciati. Qual è la loro
  velocità dopo l'urto? Prendi come positivo il verso destra." Risposta $-5{,}5\,\text{m/s}$; distrattori
  $5{,}9\,\text{m/s}$ (segno di $v_2$ dimenticato, l'avviso della lezione), $5{,}5\,\text{m/s}$ (verso sbagliato),
  $-7{,}1\,\text{m/s}$ (scorta; $(v_1 - v_2)/2 = -2{,}75$ è a un confine di arrotondamento).
- "... un carrello di $5{,}8\,\text{kg}$ si muove verso destra a $5{,}8\,\text{m/s}$; un carrello di
  $6{,}3\,\text{kg}$ gli viene incontro a $5{,}8\,\text{m/s}$. ..." Risposta $-0{,}24\,\text{m/s}$; distrattori
  $5{,}8\,\text{m/s}$, $0{,}24\,\text{m/s}$, $-0{,}31\,\text{m/s}$.

## Livello 3: l'energia dissipata

In più: le energie cinetiche. Stessa situazione del livello 1 (senza il vincolo sulle masse). Risposta
$E_d = \tfrac12 m_1 v_1^2 - \tfrac12 (m_1 + m_2) V^2$.

- "Su una rotaia un carrello di $5{,}8\,\text{kg}$ si muove a $5{,}8\,\text{m/s}$ e urta un carrello fermo di
  $6{,}3\,\text{kg}$. Dopo l'urto i due carrelli restano agganciati. Quanta energia cinetica si dissipa nell'urto?"
  Risposta $51\,\text{J}$; distrattori $98\,\text{J}$ ($K_i$), $75\,\text{J}$ (la perdita del solo primo carrello,
  $\tfrac12 m_1 (v_1^2 - V^2)$), $66\,\text{J}$ (scorta; $K_f = 47\,\text{J}$ è a meno dell'8%).
- "... un carrello di $1{,}7\,\text{kg}$ si muove a $1{,}2\,\text{m/s}$ e urta un carrello fermo di
  $9{,}4\,\text{kg}$. ..." Risposta $1{,}0\,\text{J}$; distrattori $1{,}2\,\text{J}$ ($K_i$), $0{,}19\,\text{J}$
  ($K_f$), $1{,}3\,\text{J}$.

## Livello 4: i corpi si separano dopo l'urto

In più: due velocità finali, una data. Il primo carrello ($v_1$ da $2{,}1$ a $9{,}9\,\text{m/s}$) dopo l'urto
prosegue nello stesso verso a $V_1$ (almeno $0{,}2\,\text{m/s}$, meno di $v_1$). Vincoli di coerenza fisica: il
secondo parte più veloce del primo di almeno $0{,}2\,\text{m/s}$, e l'energia cinetica finale è sotto il 97% di quella
iniziale (l'urto è anelastico). Risposta $V_2 = m_1 (v_1 - V_1)/m_2$.

- "Su una rotaia un carrello di $5{,}8\,\text{kg}$ si muove a $5{,}8\,\text{m/s}$ e urta un carrello fermo di
  $6{,}3\,\text{kg}$. Dopo l'urto il primo carrello prosegue nello stesso verso a $2{,}2\,\text{m/s}$. Con che velocità
  parte il secondo carrello?" Risposta $3{,}3\,\text{m/s}$; distrattori $5{,}3\,\text{m/s}$ ($V_1$ dimenticata),
  $7{,}4\,\text{m/s}$ ($V_1$ sommata), $3{,}6\,\text{m/s}$ (masse dimenticate, $v_1 - V_1$).
- "... un carrello di $3{,}2\,\text{kg}$ si muove a $2{,}2\,\text{m/s}$ e urta un carrello fermo di
  $4{,}9\,\text{kg}$. Dopo l'urto il primo carrello prosegue nello stesso verso a $0{,}34\,\text{m/s}$. ..." Risposta
  $1{,}2\,\text{m/s}$; distrattori $1{,}4\,\text{m/s}$, $1{,}7\,\text{m/s}$, $1{,}9\,\text{m/s}$.

## Livello 5: il pendolo balistico

In più: due fasi con due leggi diverse, e le unità da convertire. Proiettile da $5{,}1$ a $25\,\text{g}$, blocco da
$1{,}1$ a $9{,}9\,\text{kg}$, salita da $2{,}1$ a $25\,\text{cm}$; velocità tra $150$ e $900\,\text{m/s}$. Risposta
$v = \dfrac{m + M}{m}\sqrt{2 g h}$.

- "Un proiettile di $22\,\text{g}$ si conficca in un blocco di $6{,}2\,\text{kg}$ appeso a due fili. Il blocco, con il
  proiettile dentro, sale di $8{,}6\,\text{cm}$. Qual era la velocità del proiettile?" Risposta
  $3{,}7 \cdot 10^2\,\text{m/s}$; distrattori $22\,\text{m/s}$ (energia meccanica conservata attraverso l'urto,
  l'avviso della lezione), $3{,}7 \cdot 10^3\,\text{m/s}$ (altezza lasciata in centimetri),
  $2{,}6 \cdot 10^2\,\text{m/s}$ (il 2 dimenticato sotto la radice).
- "Un proiettile di $9{,}3\,\text{g}$ si conficca in un blocco di $5{,}6\,\text{kg}$ ... sale di $4{,}9\,\text{cm}$. ..."
  Risposta $5{,}9 \cdot 10^2\,\text{m/s}$; distrattori $24\,\text{m/s}$, $5{,}9 \cdot 10^3\,\text{m/s}$,
  $4{,}2 \cdot 10^2\,\text{m/s}$.

## Livello 6: urto ad angolo retto

In più: due dimensioni. Un pattinatore (da 41 a 99 kg) verso est e una pattinatrice verso nord (velocità da $1{,}1$ a
$9{,}9\,\text{m/s}$) si scontrano e restano abbracciati. Nessuna delle due quantità di moto è sotto il 40% dell'altra.
Risposta $V = \sqrt{p_x^2 + p_y^2}/(m_1 + m_2)$.

Scena `vettori-piano`: gli assi e le due velocità iniziali, lungo $x$ (est) e lungo $y$ (nord), in proporzione, con i
valori. La velocità comune compare solo nella scena della soluzione.

- "Su una pista di ghiaccio un pattinatore di $71\,\text{kg}$ va verso est a $6{,}3\,\text{m/s}$; una pattinatrice di
  $72\,\text{kg}$ va verso nord a $5{,}8\,\text{m/s}$. I due si scontrano e restano abbracciati. Con che velocità si
  muovono subito dopo l'urto?" Risposta $4{,}3\,\text{m/s}$; distrattori $6{,}0\,\text{m/s}$ (quantità di moto
  sommate come numeri; coincide con la media delle velocità), $8{,}6\,\text{m/s}$ (velocità composte,
  $\sqrt{v_1^2 + v_2^2}$), $5{,}6\,\text{m/s}$ (scorta).
- "... un pattinatore di $82\,\text{kg}$ va verso est a $7{,}6\,\text{m/s}$; una pattinatrice di $78\,\text{kg}$ va
  verso nord a $9{,}3\,\text{m/s}$. ..." Risposta $6{,}0\,\text{m/s}$; distrattori $12\,\text{m/s}$,
  $8{,}4\,\text{m/s}$, $7{,}8\,\text{m/s}$.

## Da evitare

- Nel livello 2 una velocità finale quasi nulla: il segno non si distinguerebbe.
- Nel livello 4 dati che descrivono un urto impossibile (più energia cinetica dopo che prima, o il primo carrello
  che attraversa il secondo).
- Nel livello 5 velocità da fionda o da cannone: fuori da $150$-$900\,\text{m/s}$ si scarta.
- Auto e furgoni con masse da scrivere in notazione scientifica nel livello 6: i pattinatori tengono i dati leggibili.
