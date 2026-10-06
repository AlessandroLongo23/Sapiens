# Il centro di massa

Generatore: `fis-centro-massa` (`src/lib/exercises/v2/generators/fis-centro-massa.ts`, con
`src/lib/exercises/v2/fis-urti.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_centro_massa.py` (con `_fis_urti.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/85-fis-centro-massa.md`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il centro di massa di due corpi
2. Tre corpi su una retta
3. Tre corpi nel piano
4. La velocità del centro di massa
5. Camminare su una barca

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($44\,\text{cm}$, $2{,}0\,\text{m}$, $-0{,}24\,\text{m/s}$). Dati con due
cifre significative senza zeri finali ambigui (la massa della barca con tre); nel livello 3 coordinate intere e masse
intere scritte con due cifre ($4{,}0\,\text{kg}$). Risultati a due cifre significative, mai a meno di $10^{-6}$ da un
confine di arrotondamento e mai un numero intero di decine. Nel livello 4 la risposta ha il segno. Nessun distrattore
a meno dell'8% della risposta; i posti vuoti li prendono risposte di scorta.

## Regole comuni

- Formule della lezione: $x_{cm} = \dfrac{m_1 x_1 + m_2 x_2 + \ldots}{M}$, lo stesso per $y_{cm}$;
  $v_{cm} = \dfrac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$; per la barca $m\,(\ell - d) = M\,d$.

## Livello 1: il centro di massa di due corpi

Due sfere (da $1{,}1$ a $9{,}9\,\text{kg}$, diverse di almeno il 15%) alle estremità di un'asta lunga da 21 a
$99\,\text{cm}$. Risposta: la distanza dalla prima sfera, $m_2 d/(m_1 + m_2)$.

- "Due sfere di $1{,}8\,\text{kg}$ e $6{,}5\,\text{kg}$ sono fissate alle estremità di un'asta di massa trascurabile,
  lunga $56\,\text{cm}$. A che distanza dalla prima sfera si trova il centro di massa?" Risposta $44\,\text{cm}$;
  distrattori $28\,\text{cm}$ (il punto medio, l'avviso della lezione), $12\,\text{cm}$ (la distanza dall'altra
  sfera), $57\,\text{cm}$ (scorta).
- "Due sfere di $1{,}7\,\text{kg}$ e $9{,}4\,\text{kg}$ ... lunga $33\,\text{cm}$. ..." Risposta $28\,\text{cm}$;
  distrattori $5{,}1\,\text{cm}$, $36\,\text{cm}$, $45\,\text{cm}$.

## Livello 2: tre corpi su una retta

In più: tre termini. Tre palline (da $1{,}1$ a $9{,}9\,\text{kg}$) sull'asse $x$: la prima nell'origine, la seconda
in $x_2$ (da $1{,}1$ a $4{,}9\,\text{m}$), la terza in $x_3$ (fino a $9{,}9\,\text{m}$, almeno $0{,}5\,\text{m}$ oltre
la seconda).

- "Tre palline di $5{,}8\,\text{kg}$, $6{,}3\,\text{kg}$ e $5{,}8\,\text{kg}$ sono allineate lungo l'asse $x$: la
  prima è nell'origine, la seconda in $x_2 = 2{,}5\,\text{m}$ e la terza in $x_3 = 3{,}5\,\text{m}$. Qual è l'ascissa
  del centro di massa?" Risposta $2{,}0\,\text{m}$; distrattori $3{,}0\,\text{m}$ (la massa della prima pallina
  lasciata fuori dal totale), $2{,}6\,\text{m}$ e $1{,}4\,\text{m}$ (scorta; la media semplice delle posizioni e le
  masse scambiate qui cadono a meno dell'8%).
- "Tre palline di $1{,}7\,\text{kg}$, $9{,}4\,\text{kg}$ e $1{,}2\,\text{kg}$ ... $x_2 = 3{,}2\,\text{m}$ ...
  $x_3 = 4{,}9\,\text{m}$. ..." Risposta $2{,}9\,\text{m}$; distrattori $3{,}4\,\text{m}$, $4{,}1\,\text{m}$,
  $3{,}8\,\text{m}$.

## Livello 3: tre corpi nel piano

In più: due coordinate. Tre palline in tre punti diversi con coordinate intere da 0 a 6 (metri) e masse intere da 1
a 6 kg. Si chiede l'ascissa o l'ordinata (ognuna tra il 40% e il 60%). La coordinata chiesta vale almeno
$0{,}5\,\text{m}$ e differisce di almeno il 10% sia dall'altra coordinata del centro di massa sia dalla media
semplice delle tre coordinate, così i due errori tipici restano riconoscibili.

Scena `vettori-piano`: griglia e assi da 0 a 7, con i tre punti $A$, $B$, $C$. Il centro di massa non è disegnato.

- "Tre palline si trovano nei punti $A(4;\,2)$, $B(5;\,5)$ e $C(5;\,2)$ di un piano cartesiano, con le coordinate in
  metri. Le loro masse sono, nell'ordine, $4{,}0\,\text{kg}$, $1{,}0\,\text{kg}$ e $4{,}0\,\text{kg}$. Qual è
  l'ordinata del centro di massa?" Risposta $2{,}3\,\text{m}$; distrattori $4{,}6\,\text{m}$ (l'ascissa),
  $3{,}0\,\text{m}$ (la media semplice), $3{,}3\,\text{m}$ (masse assegnate ai punti sbagliati).
- "... $A(3;\,1)$, $B(0;\,2)$ e $C(0;\,1)$ ... $2{,}0\,\text{kg}$, $6{,}0\,\text{kg}$ e $3{,}0\,\text{kg}$. Qual è
  l'ascissa del centro di massa?" Risposta $0{,}55\,\text{m}$; distrattori $1{,}5\,\text{m}$, $1{,}0\,\text{m}$,
  $1{,}6\,\text{m}$.

## Livello 4: la velocità del centro di massa

In più: le velocità al posto delle posizioni, con il segno. Due carrelli che si vengono incontro (tutti i dati da
$1{,}1$ a $9{,}9$); risposta di almeno $0{,}2\,\text{m/s}$ in modulo, positiva o negativa (ognuna tra il 35% e il
65%).

- "Su una rotaia un carrello di $1{,}7\,\text{kg}$ si muove verso destra a $1{,}2\,\text{m/s}$; un carrello di
  $9{,}4\,\text{kg}$ gli viene incontro a $6{,}7\,\text{m/s}$. Qual è la velocità del centro di massa dei due
  carrelli? Prendi come positivo il verso destra." Risposta $-5{,}5\,\text{m/s}$; distrattori $5{,}9\,\text{m/s}$
  (segno della seconda velocità dimenticato), $5{,}5\,\text{m/s}$ (verso sbagliato), $-7{,}1\,\text{m/s}$ (scorta).
- "... $5{,}8\,\text{kg}$ ... a $5{,}8\,\text{m/s}$; un carrello di $6{,}3\,\text{kg}$ gli viene incontro a
  $5{,}8\,\text{m/s}$. ..." Risposta $-0{,}24\,\text{m/s}$; distrattori $5{,}8\,\text{m/s}$, $0{,}24\,\text{m/s}$,
  $-0{,}31\,\text{m/s}$.

## Livello 5: camminare su una barca

In più: il centro di massa che resta fermo, da tradurre in un'equazione. Barca da 101 a 299 kg (tre cifre, mai con
lo zero finale), persona da 41 a 99 kg, tratto percorso lungo la barca da $1{,}1$ a $6{,}9\,\text{m}$. Risposta
$d = m\,\ell/(m + M)$.

- "Una barca di $202\,\text{kg}$ è ferma su un lago, con a bordo una persona di $72\,\text{kg}$. La persona cammina
  lungo la barca per $6{,}3\,\text{m}$. Di quanto si sposta la barca, se l'attrito con l'acqua è trascurabile?"
  Risposta $1{,}7\,\text{m}$; distrattori $2{,}2\,\text{m}$ (divisa per la sola massa della barca),
  $4{,}6\,\text{m}$ (lo spostamento della persona), $6{,}3\,\text{m}$ (tutto il tratto).
- "Una barca di $158\,\text{kg}$ ... una persona di $45\,\text{kg}$. ... per $1{,}2\,\text{m}$. ..." Risposta
  $0{,}27\,\text{m}$; distrattori $0{,}34\,\text{m}$, $0{,}93\,\text{m}$, $1{,}2\,\text{m}$.

## Da evitare

- Masse quasi uguali nel livello 1 (il centro di massa sarebbe il punto medio).
- Nel livello 3 punti coincidenti, e casi in cui ascissa e ordinata del centro di massa sono quasi uguali.
- Il sistema Terra-Luna e gli altri conti in notazione scientifica: restano negli esempi della lezione.
- Nella scena del livello 3, il centro di massa.
