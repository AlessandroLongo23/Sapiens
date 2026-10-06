# Il lancio obliquo e la gittata

Generatore: `fis-lancio-obliquo` (`src/lib/exercises/v2/generators/fis-lancio-obliquo.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_lancio_obliquo.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/76-fis-lancio-obliquo.md`. Percorso nel database:
`high_school/physics/fis-relativita-galileiana/fis-lancio-obliquo`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le componenti della velocità iniziale
2. L'altezza massima
3. Il tempo di volo
4. La gittata
5. La velocità dalla gittata
6. Il lancio da una quota

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($5{,}4\,\text{m/s}$, $17\,\text{m}$, $1{,}1\,\text{s}$). Velocità di lancio
con due cifre significative, da $5{,}1$ a $9{,}9\,\text{m/s}$ o da $11$ a $35\,\text{m/s}$; angoli interi tra
$20^\circ$ e $70^\circ$ a passi di $5^\circ$, mai $45^\circ$ (lì seno e coseno coincidono e il distrattore dello scambio
sparisce); $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento, mai sopra $99$ (una gittata di tre cifre viene scartata).

## Regole comuni

- Formule e simboli della lezione: $v_{0x} = v_0\cos\alpha$, $v_{0y} = v_0\sin\alpha$, $h_{max} = v_{0y}^2/(2g)$,
  $t_v = 2\,v_{0y}/g$, $L = v_0^2\sin 2\alpha/g$; da una quota $t_v = (v_{0y} + \sqrt{v_{0y}^2 + 2gh})/g$ e
  $L = v_{0x}\,t_v$.
- Il corpo: un pallone calciato, una palla lanciata, un sasso lanciato, da terra. Al livello 6 una palla da un balcone
  sotto i $10\,\text{m}$, un sasso dalla cima di una scogliera sopra.
- Scena `lancio-obliquo` (nuova, `scenes/LancioObliquo.tsx`): il suolo, la palla, la velocità di lancio disegnata con
  l'angolo vero, le etichette dei dati del testo; il dato chiesto non c'è. Il disegno del problema non è in scala; ai
  livelli 4 e 6 la scena della soluzione disegna la traiettoria in scala con la gittata.

## Livello 1: le componenti della velocità iniziale

Metà orizzontale, metà verticale.

- "Una palla viene lanciata da terra a $5{,}7\,\text{m/s}$, con un angolo di $70^\circ$ sull'orizzontale. Quanto vale la
  componente verticale della velocità iniziale?" Risposta $5{,}4\,\text{m/s}$; distrattori $1{,}9\,\text{m/s}$ (il
  coseno, cioè l'altra componente), $5{,}7\,\text{m/s}$ (la velocità intera), $16\,\text{m/s}$ ($v_0\tan\alpha$).
- "Un sasso viene lanciato da terra a $28\,\text{m/s}$, con un angolo di $40^\circ$ sull'orizzontale. Quanto vale la
  componente verticale della velocità iniziale?" Risposta $18\,\text{m/s}$.

## Livello 2: l'altezza massima

- Con i dati del primo esempio, "Quale altezza massima raggiunge?" Risposta $1{,}5\,\text{m}$; distrattori
  $1{,}7\,\text{m}$ ($v_0^2/2g$, senza il seno), $0{,}19\,\text{m}$ (con la componente orizzontale), $2{,}9\,\text{m}$
  (il 2 dimenticato).
- Con i dati del secondo: $17\,\text{m}$.

## Livello 3: il tempo di volo

- Con i dati del primo esempio, "Dopo quanto tempo ricade a terra?" Risposta $1{,}1\,\text{s}$; distrattori
  $0{,}55\,\text{s}$ (il solo tempo di salita), $0{,}40\,\text{s}$ (con la componente orizzontale), $1{,}2\,\text{s}$
  ($2v_0/g$).
- Con i dati del secondo: $3{,}7\,\text{s}$.

## Livello 4: la gittata

- "… A che distanza dal punto di lancio ricade a terra?" Con $5{,}7\,\text{m/s}$ e $70^\circ$: $2{,}1\,\text{m}$;
  distrattori $v_0^2\sin\alpha/g$ (l'angolo non raddoppiato), $2\,v_0^2\sin\alpha/g$ (il doppio del seno al posto del
  seno dell'angolo doppio, l'avviso della lezione), $L/2$ (il tempo di salita al posto del tempo di volo).
- Con $28\,\text{m/s}$ e $40^\circ$: $79\,\text{m}$.

## Livello 5: la velocità dalla gittata

Gittata data con due cifre, da $1{,}1$ a $99\,\text{m}$; $v_0$ tra $3$ e $35\,\text{m/s}$.

- "Un pallone viene calciato da terra con un angolo di $30^\circ$ sull'orizzontale e ricade a terra a $6{,}1\,\text{m}$
  dal punto di lancio. Con quale velocità è partito?" Risposta $8{,}3\,\text{m/s}$; distrattori $\sqrt{gL/\sin\alpha}$,
  $\sqrt{gL}$ (l'angolo dimenticato), $\sqrt{gL\sin 2\alpha}$ (il seno moltiplicato invece che diviso).
- Con $55^\circ$ e $47\,\text{m}$: $22\,\text{m/s}$.

## Livello 6: il lancio da una quota

Altezza da $2{,}1$ a $60\,\text{m}$, angoli da $20^\circ$ a $60^\circ$ sopra l'orizzontale.

- "Un sasso viene lanciato dalla cima di una scogliera alta $12\,\text{m}$, a $15\,\text{m/s}$, con un angolo di
  $30^\circ$ sopra l'orizzontale. A che distanza dalla base tocca il suolo?" Risposta $33\,\text{m}$ (l'esempio 5 della
  lezione); distrattori $20\,\text{m}$ (la formula della gittata alla stessa quota, l'avviso della lezione),
  $v_{0x}\sqrt{2h/g}$ (il tempo del lancio orizzontale), $v_{0x}(\sqrt{v_{0y}^2 + 2gh} - v_{0y})/g$ (il segno sbagliato
  davanti a $v_{0y}$).
- "Una palla viene lanciata da un balcone alto $7{,}5\,\text{m}$, a $8{,}2\,\text{m/s}$, con un angolo di $40^\circ$
  sopra l'orizzontale." Risposta $12\,\text{m}$.

## Esercizi da evitare

- L'angolo di $45^\circ$ e gli angoli sotto $20^\circ$ o sopra $70^\circ$ (traiettorie quasi piatte o quasi verticali).
- Velocità irrealistiche nel problema inverso (sotto $3$ o sopra $35\,\text{m/s}$).
- Gittate di tre cifre.

## Verifica

`fis_lancio_obliquo.py` rilegge il testo, controlla cifre, intervalli e angoli ammessi, calcola con $g = 49/5$ e con
seno e coseno esatti, confronta la risposta e le opzioni; controlla che la scena abbia i dati del testo e nessun dato
chiesto, e ai livelli 4 e 6 che la traiettoria della soluzione abbia la gittata e l'altezza vere.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0 (opzioni al più 55 px su 252).

### Errori piantati

Su 72 campioni (12 per livello, seed da 4242), bocciati tutti: indice dell'opzione giusta, una cifra di un dato del testo, testo dell'opzione giusta, opzione doppia, angolo della scena cambiato, parole vietate.

## Domande per la revisione

- Al livello 1 la tangente come distrattore ($v_0\tan\alpha$) è un errore che gli studenti fanno davvero, o meglio
  $v_0/\cos\alpha$?
- Il livello 6 chiede solo la gittata. Serve un settimo livello con la velocità all'arrivo, o basta la lezione?
