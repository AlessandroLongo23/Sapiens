# Forze dissipative e conservazione dell'energia totale

Generatore: `fis-energia-totale` (`src/lib/exercises/v2/generators/fis-energia-totale.ts`, con
`src/lib/exercises/v2/fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_energia_totale.py` (con `_fis_energia.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/64-fis-energia-totale.md`. Percorso nel database:
`high_school/physics/lavoro-energia/fis-energia-totale`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il lavoro dell'attrito
2. La velocità dopo un tratto con attrito
3. L'energia dissipata
4. La rampa con l'attrito
5. Il rendimento
6. L'energia spesa

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($-60\,\text{J}$, $2{,}7\,\text{m/s}$, $65\,\text{kJ}$) o in percentuale
intera ($35\%$). Dati con due cifre significative senza zeri finali ambigui, coefficienti di attrito con due decimali,
angoli in gradi interi, rendimenti in percentuale intera; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative,
mai a meno di $10^{-6}$ da un confine di arrotondamento. Nessun distrattore a meno dell'8% della risposta.

## Regole comuni

- Formule della lezione: $W_{attrito} = -F_d \cdot d$ con $F_d = \mu_d\, m g$ sul piano orizzontale e
  $\mu_d\, m g\cos\alpha$ sul piano inclinato; $\Delta E = W_{attrito}$; energia dissipata $E_i - E_f$;
  $\eta = E_{utile} / E_{spesa}$.
- Scene: al livello 3 `pista-energia` (una rampa curva con l'altezza, senza la velocità di arrivo); al livello 4
  `piano-inclinato` (della lezione 21) con l'angolo e la lunghezza scritti, senza forze.

## Livello 1: il lavoro dell'attrito

Massa da $1{,}1$ a $9{,}9\,\text{kg}$, tratto da $0{,}50$ a $9{,}9\,\text{m}$, $\mu_d$ da $0{,}10$ a $0{,}90$; lavoro
negativo, tra $1$ e $99\,\text{J}$ in valore assoluto.

- "Una cassa di $1{,}6\,\text{kg}$ scivola per $7{,}3\,\text{m}$ su un pavimento orizzontale; tra la cassa e il
  pavimento $\mu_d = 0{,}52$. Quanto lavoro compie l'attrito?" Risposta $-60\,\text{J}$; distrattori $60\,\text{J}$ (il
  segno), $-6{,}1\,\text{J}$ (senza $g$), $-37\,\text{J}$ (senza la massa).

## Livello 2: la velocità dopo un tratto con attrito

Velocità iniziale da $2{,}0$ a $15\,\text{m/s}$, $\mu_d$ da $0{,}10$ a $0{,}90$, tratto da $0{,}50$ a $30\,\text{m}$, con
l'attrito che toglie tra il 19% e il 91% dell'energia cinetica: $v_f = \sqrt{v^2 - 2 \mu_d\, g\, d}$. Lo spazio di
frenata, $v^2 / (2 \mu_d\, g)$, è già il livello 5 di `fis-energia-cinetica` (lezione 61, gruppo 17), e qui non si
ripete.

- "Una cassa scivola sul pavimento a $5{,}6\,\text{m/s}$; tra la cassa e il pavimento $\mu_d = 0{,}16$. Con che
  velocità si muove dopo $7{,}6\,\text{m}$?" Risposta $2{,}7\,\text{m/s}$; distrattori $0{,}72\,\text{m/s}$ (le
  velocità sottratte, $v - \sqrt{2\mu_d g d}$), $7{,}4\,\text{m/s}$ (il lavoro dell'attrito con il segno sbagliato),
  $4{,}4\,\text{m/s}$ (senza il 2).

## Livello 3: l'energia dissipata

Un blocco da $0{,}11$ a $9{,}9\,\text{kg}$ parte da fermo in cima a una rampa curva alta da $0{,}30$ a $4{,}9\,\text{m}$ e
arriva in fondo con una velocità tra il 30% e il 90% di quella senza attriti, $\sqrt{2gh}$; energia dissipata tra $1$ e
$99\,\text{J}$.

- "Un blocco di $0{,}16\,\text{kg}$ parte da fermo dalla cima di una rampa curva alta $4{,}7\,\text{m}$ e arriva in
  fondo a $3{,}2\,\text{m/s}$. Quanta energia è stata dissipata dagli attriti?" Risposta $6{,}6\,\text{J}$ ($7{,}37 -
  0{,}82$); distrattori $7{,}4\,\text{J}$ (l'energia iniziale), $5{,}7\,\text{J}$ ($m g h - m v^2$, senza il mezzo);
  l'energia cinetica finale, $0{,}82\,\text{J}$, è sotto $1\,\text{J}$ e lascia il posto a un distrattore di scorta.
  Quando $m g h - m v^2$ è negativo, al suo posto c'è la somma delle due energie.

## Livello 4: la rampa con l'attrito

Un blocco parte da fermo e scivola per un tratto da $0{,}50$ a $9{,}9\,\text{m}$ lungo un piano inclinato da $20^\circ$
a $60^\circ$, con $\mu_d$ da $0{,}10$ a $0{,}60$ e $\tan\alpha$ almeno $1{,}3$ volte $\mu_d$ (il blocco scivola davvero,
e non al limite). $v = \sqrt{2 g l (\sin\alpha - \mu_d\cos\alpha)}$; la massa non serve e non è data.

- "Un blocco parte da fermo e scivola per $7{,}3\,\text{m}$ lungo un piano inclinato di $41^\circ$, con
  $\mu_d = 0{,}30$. Con che velocità arriva in fondo?" Risposta $7{,}8\,\text{m/s}$; distrattori $9{,}7\,\text{m/s}$
  (senza attrito), $7{,}1\,\text{m/s}$ (l'attrito $\mu_d\, m g$, senza il coseno: l'avviso della lezione),
  $8{,}9\,\text{m/s}$ (seno e coseno scambiati).

## Livello 5: il rendimento

Un argano solleva da $11$ a $99\,\text{kg}$ di $1{,}1$-$30\,\text{m}$ consumando da $1{,}1$ a $99\,\text{kJ}$; rendimento
tra il 20% e il 95%, in percentuale intera.

- "Un argano elettrico solleva un carico di $57\,\text{kg}$ di $3{,}3\,\text{m}$, consumando $5{,}3\,\text{kJ}$ di
  energia elettrica. Qual è il suo rendimento?" Risposta $35\%$; distrattori $288\%$ (il rapporto rovesciato),
  $4\%$ (senza $g$), $65\%$ (la parte dissipata).

## Livello 6: l'energia spesa

Un motore elettrico, un motore a benzina, una pompa o un montacarichi con un rendimento dal 15% al 95% (non multiplo di
10), che deve fornire da $1{,}1$ a $99\,\text{kJ}$ di energia utile; energia spesa sotto $100\,\text{kJ}$.

- "Una pompa con un rendimento del $15\%$ deve fornire $9{,}7\,\text{kJ}$ di energia utile. Quanta energia consuma?"
  Risposta $65\,\text{kJ}$; distrattori $1{,}5\,\text{kJ}$ (moltiplicato per $\eta$, l'avviso della lezione),
  $55\,\text{kJ}$ (solo l'energia dissipata), $18\,\text{kJ}$ ($E_{utile}(2 - \eta)$, la parte persa aggiunta a quella
  utile).

## Esercizi da evitare

- Un piano inclinato al limite dello scivolamento ($\tan\alpha$ vicina a $\mu_d$): la velocità in fondo sarebbe quasi
  zero e molto sensibile agli arrotondamenti.
- Una velocità di arrivo quasi uguale a quella senza attriti (energia dissipata troppo piccola) o quasi zero.
- Energie oltre $99\,\text{J}$ o $99\,\text{kJ}$.

## Verifica

`fis_energia_totale.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con $g = 49/5$ e la
trigonometria esatta di SymPy, confronta la risposta e il formato delle opzioni (percentuali intere al livello 5);
controlla che la scena del livello 3 abbia l'altezza del testo e nessuna velocità, quella del livello 4 l'angolo e la
lunghezza del testo e nessuna forza, e che gli altri livelli non abbiano scene.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 65 px su 252).

### Errori piantati

Su 240 esercizi: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate e un numero della
scena cambiato (80 su 80) bocciati tutti; una cifra dei dati cambiata bocciata 237 volte su 240 (le 3 che passano danno
la stessa risposta arrotondata).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (1000), livello 2 997 (999), livello 3 1000 (1000), livello 4 998 (999), livello 5
999 (998), livello 6 994 (988).

## Domande per la revisione

- Il rendimento in percentuale intera ($35\%$) o come numero puro con due cifre ($0{,}35$)?
- Al livello 5 il distrattore del rapporto rovesciato supera il 100%: è un errore che uno studente fa davvero, o si
  scarta troppo facilmente?
