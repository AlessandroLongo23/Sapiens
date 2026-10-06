# La legge di gravitazione universale

Generatore: `fis-gravitazione-universale` (`src/lib/exercises/v2/generators/fis-gravitazione-universale.ts`, con
`src/lib/exercises/v2/fis-keplero-newton.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_gravitazione_universale.py` (con `_fis_keplero_newton.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/94-fis-gravitazione-universale.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-gravitazione-universale`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La forza tra due corpi
2. Se cambia la distanza
3. Tra corpi celesti
4. Un satellite a una certa quota
5. La gravità su un altro pianeta
6. Tre corpi allineati

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Un risultato si scrive per esteso se sta tra $0{,}01$ e $1000$ e non è
un intero che finisce con uno zero, altrimenti in notazione scientifica ($3{,}6 \cdot 10^{-9}\,\text{N}$,
$7{,}25 \cdot 10^{3}\,\text{N}$, $20{,}5\,\text{m/s}^2$). Due cifre significative nei livelli 1 e 6 (dati a due cifre),
tre nei livelli 3, 4 e 5 (dati a tre cifre); il livello 2 ha risultati esatti. Nessun risultato a meno di $10^{-6}$
da un confine di arrotondamento.

## Regole comuni

- $F = G\,m_1 m_2/r^2$ con $G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$; per la Terra
  $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$ e $R_T = 6{,}37 \cdot 10^{6}\,\text{m}$, scritti nel testo dell'esercizio;
  $g = G\,M/R^2$ sulla superficie di un pianeta.
- I distrattori vengono dagli avvisi della lezione: la distanza non al quadrato, i kilometri non convertiti, la quota
  presa come distanza, le forze sommate invece che sottratte.

## Livello 1: la forza tra due corpi

Masse intere da $11$ a $99\,\text{kg}$ senza zero finale, distanza tra i centri con due cifre, da $0{,}11$ a
$0{,}99\,\text{m}$ o da $1{,}1$ a $9{,}9\,\text{m}$.

- "Due sfere di piombo hanno masse di $93\,\text{kg}$ e $18\,\text{kg}$, e i loro centri distano $5{,}6\,\text{m}$. Con
  quale forza si attraggono?" $6{,}67 \cdot 10^{-11} \cdot 93 \cdot 18/5{,}6^2 = 3{,}56 \cdot 10^{-9} \approx
  3{,}6 \cdot 10^{-9}\,\text{N}$. Distrattori: $2{,}0 \cdot 10^{-8}\,\text{N}$ (la distanza non al quadrato),
  $2{,}4 \cdot 10^{-10}\,\text{N}$ (le masse sommate), $3{,}5 \cdot 10^{-6}\,\text{N}$ (la distanza al numeratore).
- Masse $72$ e $79\,\text{kg}$ a $6{,}6\,\text{m}$: $8{,}7 \cdot 10^{-9}\,\text{N}$.

## Livello 2: se cambia la distanza

Nessuna formula da calcolare: solo il quadrato inverso. La distanza diventa doppia, tripla o quadrupla (metà dei
casi), oppure la metà, un terzo o un quarto. La forza più piccola delle due ha due cifre; la più grande, che è $4$,
$9$ o $16$ volte tanto, sta sotto $100\,\text{N}$, non ha una cifra sola e non è un intero che finisce con uno zero.

- "Due corpi si attraggono con una forza gravitazionale di $1{,}8\,\text{N}$. Quanto vale la forza se la distanza tra i
  loro centri diventa la metà, senza cambiare le masse?" $1{,}8 \cdot 4 = 7{,}2\,\text{N}$. Distrattori:
  $3{,}6\,\text{N}$ (il fattore non al quadrato), $0{,}45\,\text{N}$ e $0{,}90\,\text{N}$ (il fattore nel verso
  sbagliato).
- Forza di $20{,}7\,\text{N}$, distanza tripla: $2{,}3\,\text{N}$.

## Livello 3: tra corpi celesti

Tre situazioni: un pianeta e il suo satellite, una stella e un suo pianeta, due asteroidi. Masse e distanza con
mantisse a tre cifre senza zero finale; la distanza è in kilometri e va convertita. La risposta è in notazione
scientifica, con tre cifre.

- "Due asteroidi di masse $1{,}74 \cdot 10^{15}\,\text{kg}$ e $3{,}11 \cdot 10^{17}\,\text{kg}$ hanno i centri a una
  distanza di $5{,}58 \cdot 10^{3}\,\text{km}$. Con quale forza si attraggono?" Con $r = 5{,}58 \cdot 10^{6}\,\text{m}$:
  $1{,}16 \cdot 10^{9}\,\text{N}$. Distrattori: $1{,}16 \cdot 10^{15}\,\text{N}$ (i kilometri non convertiti),
  $6{,}47 \cdot 10^{15}\,\text{N}$ (la distanza non al quadrato), e l'esponente della distanza non raddoppiato.
- Terra e Luna ($5{,}97 \cdot 10^{24}$ e $7{,}35 \cdot 10^{22}\,\text{kg}$ a $3{,}84 \cdot 10^{5}\,\text{km}$):
  $1{,}98 \cdot 10^{20}\,\text{N}$, l'esempio 2 della lezione.

## Livello 4: un satellite a una certa quota

Massa del satellite intera da $121$ a $989\,\text{kg}$, quota intera da $251$ a $2499\,\text{km}$, senza zero finale.
La distanza è $R_T + h$.

- "Un satellite di $923\,\text{kg}$ orbita a $749\,\text{km}$ sopra la superficie della Terra, che ha massa
  $5{,}97 \cdot 10^{24}\,\text{kg}$ e raggio $6{,}37 \cdot 10^{6}\,\text{m}$. Con quale forza la Terra lo attira?"
  $r = 7{,}119 \cdot 10^{6}\,\text{m}$, $F = 7252{,}1 \approx 7{,}25 \cdot 10^{3}\,\text{N}$. Distrattori:
  $6{,}55 \cdot 10^{5}\,\text{N}$ (la quota al posto della distanza), $9{,}06 \cdot 10^{3}\,\text{N}$ (solo il raggio:
  il peso al suolo), $5{,}16 \cdot 10^{10}\,\text{N}$ (la distanza non al quadrato).
- Satellite di $792\,\text{kg}$ a $745\,\text{km}$: $6{,}23 \cdot 10^{3}\,\text{N}$.

## Livello 5: la gravità su un altro pianeta

Massa con esponente da $22$ a $26$, raggio in kilometri con esponente $3$ o $4$, mantisse a tre cifre; $g$ tra $0{,}5$
e $60\,\text{m/s}^2$, scritta per esteso.

- "Un pianeta ha massa $9{,}31 \cdot 10^{23}\,\text{kg}$ e raggio $1{,}74 \cdot 10^{3}\,\text{km}$. Quanto vale
  l'accelerazione di gravità sulla sua superficie?" $20{,}511 \approx 20{,}5\,\text{m/s}^2$. Distrattori:
  $2{,}05 \cdot 10^{7}\,\text{m/s}^2$ (i kilometri non convertiti), $3{,}57 \cdot 10^{7}\,\text{m/s}^2$ (il raggio non al
  quadrato), $5{,}13\,\text{m/s}^2$ (il diametro al posto del raggio).
- La Luna ($7{,}35 \cdot 10^{22}\,\text{kg}$, $1{,}74 \cdot 10^{3}\,\text{km}$): $1{,}62\,\text{m/s}^2$, l'esempio 4
  della lezione.

## Livello 6: tre corpi allineati

Il corpo B sta tra A e C. Masse intere da $11$ a $99\,\text{kg}$, distanze da $1{,}1$ a $9{,}9\,\text{m}$; il rapporto
tra le due forze sta tra $1{,}3$ e $8$. La risposta dà il modulo e il corpo verso cui la forza è diretta. Scena
`masse-allineate`: i tre corpi con le masse e le due distanze quotate, senza forze.

- "Tre corpi sono allineati. Il corpo B, di $18\,\text{kg}$, sta tra il corpo A, di $93\,\text{kg}$, e il corpo C, di
  $31\,\text{kg}$: dista $5{,}6\,\text{m}$ da A e $1{,}7\,\text{m}$ da C. Quanto vale la forza gravitazionale totale su B,
  e verso quale corpo è diretta?" $F_A = 3{,}56 \cdot 10^{-9}\,\text{N}$, $F_C = 1{,}288 \cdot 10^{-8}\,\text{N}$:
  $9{,}3 \cdot 10^{-9}\,\text{N}$ verso C. Distrattori: lo stesso modulo verso A, $1{,}6 \cdot 10^{-8}\,\text{N}$ verso C
  (le forze sommate), $1{,}3 \cdot 10^{-8}\,\text{N}$ verso C (solo la forza più grande).
- B di $51\,\text{kg}$ tra A di $75\,\text{kg}$ a $3{,}1\,\text{m}$ e C di $91\,\text{kg}$ a $7{,}6\,\text{m}$:
  $2{,}1 \cdot 10^{-8}\,\text{N}$ verso A.

## Esercizi da evitare

- Due forze quasi uguali al livello 6: il risultato sarebbe una differenza di numeri vicini.
- Forze date o trovate come interi che finiscono con uno zero ($40\,\text{N}$) al livello 2.

## Verifica

`fis_gravitazione_universale.py` rilegge il testo, controlla dati e intervalli, ricalcola con razionali esatti
($G = 667/10^{13}$), arrotonda e confronta l'opzione giusta, la forma di tutte le opzioni e la fine della soluzione;
al livello 6 controlla la scena (masse, distanze, posizione di B) e negli altri che non ci sia.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0. Errori piantati (indice, primo e ultimo dato, testo dell'opzione giusta, opzione doppia, parole vietate, scena,
unità): tutti bocciati.

## Domande per la revisione

- Manca un livello inverso (trovare la distanza o una massa data la forza): l'esempio 5 della lezione, il punto in cui
  due forze si bilanciano, non ha un livello suo. Da aggiungere come livello 7?
- Il livello 2 non ha la variante con le masse che cambiano: serve?
