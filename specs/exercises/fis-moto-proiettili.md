# Il moto di un proiettile lanciato in orizzontale

Generatore: `fis-moto-proiettili` (`src/lib/exercises/v2/generators/fis-moto-proiettili.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_moto_proiettili.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/56-fis-moto-proiettili.md`. Percorso nel database:
`high_school/physics/fis-forze-movimento/fis-moto-proiettili`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il tempo di volo
2. La gittata
3. Il problema inverso
4. La velocità all'arrivo
5. L'angolo all'arrivo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($0{,}86\,\text{s}$, $3{,}9\,\text{m}$, $9{,}5\,\text{m/s}$) o in gradi interi
($62^\circ$). Altezze con due cifre significative, da $1{,}1$ a $9{,}9\,\text{m}$ o da $11$ a $99\,\text{m}$ (metà
ciascuno); velocità di lancio da $1{,}1$ a $9{,}9\,\text{m/s}$; gittate date da $1{,}1$ a $99\,\text{m}$;
$g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative (angoli al grado), mai a meno di $10^{-6}$ da un confine di
arrotondamento.

## Regole comuni

- Formule della lezione: $t_v = \sqrt{2h/g}$, $x_G = v_0\,t_v$, $|v_y| = g\,t_v = \sqrt{2gh}$,
  $v = \sqrt{v_0^2 + v_y^2}$, $\tan\beta = |v_y|/v_0$; al contrario $v_0 = x_G/t_v$ e $h = \tfrac{1}{2}g(x_G/v_0)^2$.
- Il luogo segue l'altezza: il bordo di un tavolo sotto i $2\,\text{m}$, un balcone sotto i $10\,\text{m}$, la cima di una
  scogliera sopra; una pallina dal tavolo e dal balcone, un sasso dalla scogliera. Nel caso dell'altezza incognita il
  luogo segue l'altezza arrotondata.
- Scena `lancio-orizzontale` (nuova, `scenes/LancioOrizzontale.tsx`): il bordo, la pallina, la velocità di lancio, con
  i dati del testo (altezza, velocità, gittata); il dato chiesto è scritto con la sola lettera. Nel problema il disegno
  non è in scala; al livello 2 la scena della soluzione disegna la traiettoria in scala con la gittata.

## Livello 1: il tempo di volo

- "Una pallina viene lanciata in orizzontale a $4{,}5\,\text{m/s}$ da un balcone alto $3{,}6\,\text{m}$. Dopo quanto
  tempo tocca il suolo?" Risposta $0{,}86\,\text{s}$; distrattori $0{,}61\,\text{s}$ ($\sqrt{h/g}$), $0{,}73\,\text{s}$
  ($2h/g$), $0{,}80\,\text{s}$ ($h/v_0$). La velocità è un dato che non serve: è l'avviso della lezione.

## Livello 2: la gittata

- Con gli stessi dati, "A che distanza dalla base tocca il suolo?" Risposta $3{,}9\,\text{m}$; distrattori
  $2{,}7\,\text{m}$ ($v_0\sqrt{h/g}$), $3{,}3\,\text{m}$ ($v_0 \cdot 2h/g$), $3{,}6\,\text{m}$ (l'altezza).

## Livello 3: il problema inverso

Metà: la velocità di lancio dall'altezza e dalla gittata ($v_0$ tra $0{,}5$ e $40\,\text{m/s}$). Metà: l'altezza dalla
velocità e dalla gittata ($h$ tra $0{,}5$ e $99\,\text{m}$).

- "Una pallina, lanciata in orizzontale da un balcone alto $5{,}3\,\text{m}$, tocca il suolo a $3{,}6\,\text{m}$ dalla
  base. Con quale velocità è stata lanciata?" Risposta $3{,}5\,\text{m/s}$; distrattori $4{,}9\,\text{m/s}$
  ($x/\sqrt{h/g}$), $3{,}7\,\text{m/s}$ ($x\,t_v$, moltiplicato invece che diviso), $3{,}3\,\text{m/s}$
  ($x/(2h/g)$, senza radice).
- Per l'altezza i distrattori sono $g\,t^2$ (il mezzo dimenticato), $g\,t/2$ (il tempo non al quadrato) e
  $\tfrac{1}{2}g(x\,v_0)^2$ (il tempo moltiplicato invece che diviso).

## Livello 4: la velocità all'arrivo

- Con i dati del livello 1, "Con quale velocità tocca il suolo?" Risposta $9{,}5\,\text{m/s}$; distrattori
  $13\,\text{m/s}$ ($v_0 + |v_y|$, le componenti sommate come numeri), $8{,}4\,\text{m/s}$ (la sola componente
  verticale), $4{,}5\,\text{m/s}$ (la velocità di lancio).

## Livello 5: l'angolo all'arrivo

$\beta$ tra $10^\circ$ e $85^\circ$.

- Con i dati del livello 1, "Quale angolo forma la sua velocità con l'orizzontale quando tocca il suolo?" Risposta
  $62^\circ$; distrattori $28^\circ$ (le componenti scambiate), $43^\circ$ (la retta dal bordo al punto d'arrivo,
  $\tan = h/x_G$), e $\beta \pm 4^\circ$.

## Esercizi da evitare

- Velocità di lancio irrealistiche nel problema inverso (sotto $0{,}5$ o sopra $40\,\text{m/s}$).
- Angoli quasi orizzontali o quasi verticali al livello 5.

## Verifica

`fis_moto_proiettili.py` rilegge il testo (con l'accordo e il luogo giusto per l'altezza), controlla cifre e
intervalli, calcola con $g = 49/5$ esatto, confronta la risposta e le opzioni; controlla che la scena abbia i dati del
testo e nessun dato chiesto, e al livello 2 che la traiettoria della soluzione abbia l'altezza e la gittata vere.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 65 px su 252).

### Errori piantati

Bocciati tutti (40 su 40 per tipo): indice dell'opzione giusta, prima cifra di un dato del testo, testo dell'opzione
giusta, opzione doppia, parole vietate, altezza della scena cambiata.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 959 (960), livello 2 959 (960), livello 3 970 (974), livello 4 959 (960), livello 5
959 (955).

## Domande per la revisione

- "Tocca il suolo" anche per il sasso che cade in mare dalla scogliera: va bene, o meglio un testo per ogni luogo?
- L'angolo all'arrivo (livello 5) usa $\tan^{-1}$: al secondo anno va bene, visto che la lezione di seno e coseno del
  primo anno lo introduce?
