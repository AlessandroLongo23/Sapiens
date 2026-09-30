# L'equilibrio di un corpo rigido

Generatore: `fis-equilibrio-corpo-rigido` (`src/lib/exercises/v2/generators/fis-equilibrio-corpo-rigido.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_equilibrio_corpo_rigido.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/23-fis-equilibrio-corpo-rigido.md` (note in `docs/lezioni/fisica/note/23-fis-equilibrio-corpo-rigido.md`).
Funzioni comuni in `src/lib/exercises/v2/fis-corpo-rigido.ts` e `scripts/exercises/checkers/_corpo_rigido.py`; scena
`asta-forze`.

Cinque livelli, ognuno con una difficoltà in più: l'equilibrio dei momenti su un'asta leggera, poi anche quello delle
forze (la reazione), poi il peso dell'asta con il suo braccio, poi due reazioni incognite, poi due reazioni e il peso.

## Nomi dei livelli

1. L'asta sul fulcro
2. La reazione del fulcro
3. L'asta con il suo peso
4. La trave su due appoggi
5. La trave con il suo peso

## Tipi di risposta

Tutti i livelli hanno una risposta `number` esatta: i numeri sono costruiti all'indietro. Le forze sono intere
($160\,\text{N}$), le distanze hanno due cifre significative ($0{,}60\,\text{m}$), e una forza ricavata da un
prodotto o da un quoziente ha al più due cifre significative (niente $442\,\text{N}$ da dati di due cifre). Scelta
multipla di quattro opzioni con l'unità; i distrattori sono arrotondati alle cifre della risposta.

## Regole comuni

- Pesi appesi da $20$ a $300\,\text{N}$ a passi di $10$; distanze dal fulcro da $0{,}20$ a $2{,}0\,\text{m}$ a passi
  di $0{,}10$; aste da $1{,}0$ a $4{,}0\,\text{m}$, travi da $2{,}0$ a $6{,}0\,\text{m}$, a passi di $0{,}5$; carichi da
  $200$ a $1200\,\text{N}$ e pesi delle travi da $200$ a $1000\,\text{N}$, a passi di $100$.
- I passaggi seguono il procedimento della lezione: polo dove passa un'incognita, momenti con il segno, risultante.
- La scena `asta-forze` disegna l'asta, i fulcri, le forze note con il valore e in scala (la più lunga 1,4 cm), le
  distanze. Una forza da trovare è un "?" e allora tutte le frecce sono lunghe 1,2 cm; una distanza da trovare è un
  "?" e il peso di destra è disegnato alla stessa distanza di quello di sinistra, fuori scala.

## Livello 1: l'asta sul fulcro

Un'asta di peso trascurabile su un fulcro, un peso per parte. La distanza che manca (55%, $b_2 = P_1 b_1 / P_2$) o il
peso che manca (45%, $P_2 = P_1 b_1 / b_2$).

- "A sinistra, a $0{,}70\,\text{m}$, $60\,\text{N}$; a destra $70\,\text{N}$. A che distanza?" Risposta
  $0{,}60\,\text{m}$; distrattori $0{,}82\,\text{m}$ (il rapporto rovesciato), $0{,}70\,\text{m}$ (la stessa distanza),
  $1{,}3\,\text{m}$.
- "A sinistra, a $1{,}6\,\text{m}$, $110\,\text{N}$; quale peso a destra, a $1{,}1\,\text{m}$?" Risposta
  $160\,\text{N}$; distrattori $76\,\text{N}$ (rovesciato), $110\,\text{N}$, $270\,\text{N}$.

## Livello 2: la reazione del fulcro

Lo stesso sistema, con le due distanze date: prima il peso di destra dai momenti, poi la reazione del fulcro $F_v = P_1 + P_2$.

- "A sinistra, a $0{,}70\,\text{m}$, $60\,\text{N}$; a destra, a $0{,}60\,\text{m}$, il peso che la tiene in
  equilibrio." Risposta $130\,\text{N}$; distrattori $60$ e $70\,\text{N}$ (un peso solo), $110\,\text{N}$ (il peso di
  destra trovato con il rapporto rovesciato).
- L'esempio 1 della lezione ($300\,\text{N}$ a $1{,}5\,\text{m}$, l'altro a $1{,}0\,\text{m}$): $750\,\text{N}$.

## Livello 3: l'asta con il suo peso

Asta omogenea di lunghezza $L$ e peso $P$, fulcro a $a < L/2 - 0{,}10\,\text{m}$ dall'estremità sinistra, un peso
$F$ appeso all'estremità sinistra: $F a = P (L/2 - a)$. Si chiede $F$ (65%) o $P$ (35%).

- "Lunga $2{,}5\,\text{m}$, pesa $120\,\text{N}$, fulcro a $0{,}30\,\text{m}$." Risposta $380\,\text{N}$; distrattori
  $500\,\text{N}$ (il braccio del peso misurato dall'estremità), $120\,\text{N}$, $38\,\text{N}$ (rovesciato).
- "Lunga $4{,}0\,\text{m}$, fulcro a $0{,}40\,\text{m}$, in equilibrio con $80\,\text{N}$. Quanto pesa l'asta?"
  Risposta $20\,\text{N}$; distrattori $16\,\text{N}$, $80\,\text{N}$, $320\,\text{N}$.

## Livello 4: la trave su due appoggi

Trave di peso trascurabile, appoggi alle estremità $A$ e $B$, un carico $F$ a distanza $a$ da $A$ (mai nel centro).
Si chiede $F_A = F (L - a)/L$ o $F_B = F a / L$, metà ciascuno (le reazioni si chiamano come nella lezione).

- "Lunga $5{,}0\,\text{m}$, carico di $300\,\text{N}$ a $1{,}0\,\text{m}$ da $A$; reazione in $A$?" Risposta
  $240\,\text{N}$; distrattori $60\,\text{N}$ (le reazioni scambiate), $150\,\text{N}$ (metà), $300\,\text{N}$.
- "Lunga $5{,}0\,\text{m}$, $800\,\text{N}$ a $3{,}0\,\text{m}$ da $A$; reazione in $B$?" Risposta $480\,\text{N}$.

## Livello 5: la trave con il suo peso

Come il livello 4, con il peso $P$ della trave nel centro: $F_B = F a / L + P/2$.

- "Lunga $2{,}5\,\text{m}$, pesa $500\,\text{N}$, carico di $600\,\text{N}$ a $1{,}0\,\text{m}$ da $A$; reazione in
  $B$?" Risposta $490\,\text{N}$; distrattori $240\,\text{N}$ (il peso della trave dimenticato), $610\,\text{N}$ (le
  reazioni scambiate), $550\,\text{N}$ (metà di tutto).
- L'esempio 2 della lezione: $F_B = 500\,\text{N}$, $F_A = 900\,\text{N}$.

## Esercizi da evitare

- Due pesi uguali, o la distanza cercata uguale a quella data (livello 1).
- Il carico nel centro della trave (le reazioni sarebbero uguali, e il conto sparisce).
- Una reazione non intera, o una forza ricavata con più di due cifre significative.

## Verifica

`fis_equilibrio_corpo_rigido.py` rilegge il testo e scrive le due condizioni di equilibrio (somma delle forze
verticali e somma dei momenti rispetto all'estremità sinistra) come un sistema lineare, risolto con SymPy per
l'incognita richiesta; controlla la scena (fulcri, forze, valori, quote, "?"), le opzioni e il loro testo.

Esito: `sample.mts fis-equilibrio-corpo-rigido 1000 all` con i seed $1$, $50001$ e $777001$, PASS; `review.mts` e
`width.mts` escono con codice 0 (opzioni al massimo di $62$ px).

### Errori piantati

Su 25 esercizi e 6 modifiche ciascuno (risposta, opzione giusta, due opzioni uguali, testo di un'opzione, un dato del
testo, la scena): 150 su 150 bocciati.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 917 (913), livello 2 834 (833), livello 3 579 (572), livello 4 395
(409), livello 5 837 (856).

## Domande per la revisione

- Le reazioni vincolari si chiamano $F_A$ e $F_B$ (e $F_v$ quella del fulcro), come nella lezione 20 che le indica con $\vec{F}_v$; molti libri usano $R_A$ e $R_B$ o $N_A$ e $N_B$. Quale?
- Livello 3: il peso appeso all'estremità è sempre a sinistra. Serve anche il caso con il peso a destra?
- Serve un livello con un carico oltre un appoggio (una trave a sbalzo, dove una reazione può essere verso il basso)?
