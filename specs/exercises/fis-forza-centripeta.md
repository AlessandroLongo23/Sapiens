# La forza centripeta

Generatore: `fis-forza-centripeta` (`src/lib/exercises/v2/generators/fis-forza-centripeta.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_forza_centripeta.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/57-fis-forza-centripeta.md`. Percorso nel database:
`high_school/physics/fis-forze-movimento/fis-forza-centripeta`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La forza centripeta
2. Dal periodo
3. L'auto in curva
4. Il disco e il pesetto
5. In cima al giro

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($4{,}0\,\text{N}$, $20\,\text{m/s}$). Dati con due cifre significative:
masse da $0{,}11$ a $0{,}99\,\text{kg}$, velocità da $1{,}1$ a $9{,}9\,\text{m/s}$, raggi e periodi da $0{,}11$ a
$0{,}99$ o da $1{,}1$ a $9{,}9$ (metà ciascuno), raggi delle curve da $11$ a $99\,\text{m}$, coefficienti con due
decimali; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento, forze tra $0{,}1$ e $99\,\text{N}$.

## Regole comuni

- Formule della lezione: $F_c = m v^2/r$, $v = 2\pi r/T$ (quindi $F_c = 4\pi^2 m r/T^2$); curva piana
  $v_{max} = \sqrt{\mu_s g r}$; disco e pesetto fermo $m v^2/r = M g$; in cima al giro verticale $T + m g = m v^2/r$,
  velocità minima $\sqrt{g r}$.
- Niente scene: le figure della lezione bastano, e i dati non cambiano il disegno.

## Livello 1: la forza centripeta

- "Una pallina di $0{,}49\,\text{kg}$, legata a un filo, gira su un tavolo orizzontale liscio lungo una circonferenza di
  raggio $0{,}53\,\text{m}$, a $3{,}6\,\text{m/s}$. Quanto vale la tensione del filo?" Risposta $12\,\text{N}$;
  distrattori $3{,}3\,\text{N}$ ($m v/r$, il quadrato dimenticato), $24\,\text{N}$ ($v^2/r$, l'accelerazione al posto
  della forza), $3{,}4\,\text{N}$ ($m v^2 r$).

## Livello 2: dal periodo

La pallina compie un giro ogni $T$ secondi.

- Con $m = 0{,}49\,\text{kg}$, $r = 0{,}36\,\text{m}$ e un giro ogni $0{,}53\,\text{s}$: risposta $25\,\text{N}$;
  distrattori $13\,\text{N}$ (il periodo non al quadrato), $3{,}9\,\text{N}$ ($2\pi$ al posto di $4\pi^2$),
  $5{,}8\,\text{N}$ ($m v/r$).

## Livello 3: l'auto in curva

- "Un'auto percorre una curva piana di raggio $49\,\text{m}$; tra le gomme e l'asfalto $\mu_s = 0{,}55$. Qual è la
  velocità più alta con cui può affrontare la curva senza slittare?" Risposta $16\,\text{m/s}$; distrattori
  $22\,\text{m/s}$ ($\sqrt{g r}$, l'attrito dimenticato), $12\,\text{m/s}$ ($\mu_s\sqrt{g r}$), e $\mu_s g r$ quando è
  sotto $100$.

## Livello 4: il disco e il pesetto

Masse e raggio da $0{,}11$ a $0{,}99$; velocità almeno $0{,}5\,\text{m/s}$.

- Disco di $0{,}49\,\text{kg}$, pesetto di $0{,}36\,\text{kg}$, raggio $0{,}45\,\text{m}$: risposta $1{,}8\,\text{m/s}$;
  distrattori $1{,}3\,\text{m/s}$ ($\sqrt{M g r}$, la massa del disco dimenticata), $3{,}2\,\text{m/s}$ (senza
  radice), e le masse scambiate quando si arrotondano senza ambiguità (qui $2{,}45$ no: il quarto è $2{,}2\,\text{m/s}$,
  un valore vicino alla risposta).

## Livello 5: in cima al giro

Metà: la velocità minima di un secchio d'acqua in cima, $\sqrt{g r}$. Metà: la tensione in cima di una pallina che gira
in verticale, $m v^2/r - m g$, con $v^2 \ge 1{,}3\,g r$ (il filo è ben teso).

- "Un secchio d'acqua viene fatto girare in verticale, su una circonferenza di raggio $0{,}36\,\text{m}$. Qual è la
  velocità più piccola che deve avere nel punto più alto perché l'acqua non cada?" Risposta $1{,}9\,\text{m/s}$;
  distrattori $2{,}7\,\text{m/s}$ ($\sqrt{2 g r}$), $3{,}5\,\text{m/s}$ ($g r$, senza radice), $5{,}2\,\text{m/s}$
  ($\sqrt{g/r}$).
- Per la tensione i distrattori sono $m v^2/r$ (il peso dimenticato), $m v^2/r + m g$ (il peso sommato, come nel punto
  più basso) e $m g$.

Il caso della velocità minima ha pochi esercizi diversi (un dato solo, il raggio: 162 valori).

## Esercizi da evitare

- Forze sotto $0{,}1\,\text{N}$ o oltre $99\,\text{N}$; un filo quasi lento in cima al giro.

## Verifica

`fis_forza_centripeta.py` rilegge il testo, controlla dati e intervalli, calcola con $g = 49/5$ e $\pi$ esatti,
confronta la risposta e le opzioni; controlla che non ci sia una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 65 px su 252).

### Errori piantati

Bocciati tutti (40 su 40 per tipo): indice dell'opzione giusta, prima cifra di un dato del testo, testo dell'opzione
giusta, opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 999 (999), livello 2 1000 (1000), livello 3 927 (924), livello 4 999 (997), livello 5
650 (662).

## Domande per la revisione

- Il livello 5 usa il giro in verticale, che la lezione tratta solo nel punto più alto: va bene al secondo anno?
- Un livello con la velocità in km/h da convertire (l'auto in curva) renderebbe il livello 3 più vicino ai libri: da
  aggiungere?
