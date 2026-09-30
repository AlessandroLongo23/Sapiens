# Corpi collegati e tensione dei fili

Generatore: `fis-corpi-collegati` (`src/lib/exercises/v2/generators/fis-corpi-collegati.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_corpi_collegati.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/55-fis-corpi-collegati.md`. Percorso nel database:
`high_school/physics/fis-forze-movimento/fis-corpi-collegati`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'accelerazione di due carrelli
2. La tensione tra i carrelli
3. Il pesetto e la carrucola
4. La tensione del filo appeso
5. Con l'attrito sul tavolo
6. La macchina di Atwood

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($3{,}0\,\text{m/s}^2$, $9{,}0\,\text{N}$). Masse con due cifre
significative, da $1{,}1$ a $9{,}9\,\text{kg}$, sempre diverse tra loro; forze da $11$ a $99\,\text{N}$; coefficienti con
due decimali; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento, tra $0{,}1$ e $99$.

## Regole comuni

- Formule della lezione: due carrelli tirati, $a = F/(m_1 + m_2)$ e $T = m_2\,a$ (il filo tira il carrello di dietro);
  carrello e pesetto, $a = (m_2 - \mu_d m_1)\,g/(m_1 + m_2)$ ($\mu_d = 0$ sul tavolo liscio) e $T = m_2(g - a)$; Atwood con
  $m_1 < m_2$, $a = (m_2 - m_1)\,g/(m_1 + m_2)$ e $T = 2 m_1 m_2\,g/(m_1 + m_2)$.
- Scena `corpi-collegati` (nuova, `scenes/CorpiCollegati.tsx`): il sistema del testo (`traino`, `tavolo`, `atwood`) con
  le masse scritte accanto ai corpi e, per il traino, la forza. Niente accelerazioni, niente tensioni.

## Livello 1: l'accelerazione di due carrelli

- "Due carrelli, di $4{,}9\,\text{kg}$ e $3{,}6\,\text{kg}$, sono collegati da un filo su un piano orizzontale liscio. Il
  carrello di $4{,}9\,\text{kg}$ è tirato da una forza orizzontale di $45\,\text{N}$. Quanto vale l'accelerazione dei
  carrelli?" Risposta $5{,}3\,\text{m/s}^2$; distrattori $9{,}2\,\text{m/s}^2$ (la forza sul primo carrello solo),
  $0{,}54\,\text{m/s}^2$ (i pesi al posto delle masse), e $F/m_2$ quando è sotto $100$.

## Livello 2: la tensione tra i carrelli

Stesso sistema; si chiede la tensione.

- Con i dati di sopra: risposta $19\,\text{N}$; distrattori $45\,\text{N}$ (la forza che tira), $26\,\text{N}$ (la parte
  del primo carrello), e metà della forza quando si arrotonda senza ambiguità (qui $22{,}5$ no: il quarto è
  $23\,\text{N}$, dai valori vicini alla risposta).

## Livello 3: il pesetto e la carrucola

Tavolo liscio; si chiede l'accelerazione.

- "Un carrello di $4{,}9\,\text{kg}$ sta su un tavolo orizzontale liscio ed è collegato da un filo, attraverso una
  carrucola sul bordo del tavolo, a un pesetto di $3{,}6\,\text{kg}$ che pende nel vuoto. Quanto vale l'accelerazione del
  carrello?" Risposta $4{,}2\,\text{m/s}^2$; distrattori $9{,}8\,\text{m/s}^2$ (la caduta libera),
  $7{,}2\,\text{m/s}^2$ ($m_2 g/m_1$: la tensione presa per il peso del pesetto), $5{,}6\,\text{m/s}^2$ (le masse
  scambiate).

## Livello 4: la tensione del filo appeso

Stesso sistema; si chiede la tensione.

- Con i dati di sopra: risposta $20\,\text{N}$; distrattori $35\,\text{N}$ (il peso del pesetto, l'avviso della
  lezione), $48\,\text{N}$ (il peso del carrello), $15\,\text{N}$ ($m_2\,a$).

## Livello 5: con l'attrito sul tavolo

Un blocco al posto del carrello, $\mu_d$ da $0{,}10$ a $0{,}60$; il pesetto pesa almeno $1{,}2$ volte $\mu_d\,m_1 g$
(il testo dice che il blocco scivola), accelerazione almeno $0{,}2\,\text{m/s}^2$.

- Con $\mu_d = 0{,}29$ e le masse di sopra: risposta $2{,}5\,\text{m/s}^2$; distrattori $5{,}8\,\text{m/s}^2$
  (l'attrito sommato), $4{,}4\,\text{m/s}^2$ (diviso per la sola $m_1$), $4{,}2\,\text{m/s}^2$ (l'attrito dimenticato).

## Livello 6: la macchina di Atwood

La massa più piccola nel testo per prima; accelerazione (metà) o tensione (metà).

- "Una macchina di Atwood porta due masse di $3{,}6\,\text{kg}$ e $4{,}5\,\text{kg}$, lasciate libere da ferme. Quanto
  vale la tensione del filo?" Risposta $39\,\text{N}$; distrattori $35\,\text{N}$ e $44\,\text{N}$ (i due pesi),
  $40\,\text{N}$ (la media dei pesi).
- Per l'accelerazione i distrattori sono $(m_2 - m_1)g/m_2$, $(m_2 - m_1)g/m_1$ e $g$.

## Esercizi da evitare

- Masse uguali (nessun moto nella macchina di Atwood, nessuna differenza tra i carrelli).
- Al livello 5 un pesetto che basta appena a vincere l'attrito.

## Verifica

`fis_corpi_collegati.py` rilegge il testo, controlla masse, forze e coefficienti, calcola con $g = 49/5$ esatto,
confronta la risposta e le opzioni; controlla che la scena sia del tipo giusto, con le masse (e la forza) del testo e
nient'altro.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 83 px su 252).

### Errori piantati

Bocciati tutti (48 su 48 per tipo): indice dell'opzione giusta, prima cifra di un dato del testo, testo dell'opzione
giusta, opzione doppia, parole vietate, una massa della scena cambiata.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (997), livello 2 999 (997), livello 3 925 (924), livello 4 926 (926), livello 5
999 (994), livello 6 924 (918).

## Domande per la revisione

- Al livello 1 e 2 la forza tira sempre il carrello nominato per primo: serve anche il caso in cui tira l'altro?
- Un livello con il tempo o la velocità dopo un tratto (la cinematica sopra la dinamica, come l'esempio 4 della
  lezione)?
