# Il moto lungo un piano inclinato

Generatore: `fis-piano-inclinato` (`src/lib/exercises/v2/generators/fis-piano-inclinato.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_piano_inclinato.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/54-fis-piano-inclinato.md`. Percorso nel database:
`high_school/physics/fis-forze-movimento/fis-piano-inclinato`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'accelerazione senza attrito
2. Tempo e velocità in fondo
3. L'accelerazione con l'attrito
4. Il lancio in salita
5. In salita con l'attrito

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($4{,}9\,\text{m/s}^2$, $1{,}0\,\text{s}$, $4{,}9\,\text{m/s}$, $1{,}3\,\text{m}$).
Lunghezze e velocità con due cifre significative (da $1{,}1$ a $9{,}9$), angoli in gradi interi, coefficienti con due
decimali; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento, tra $0{,}1$ e $99$.

## Regole comuni

- Formule della lezione: sul piano liscio $a = g\sin\alpha$; da fermo $t = \sqrt{2l/a}$ e $v = \sqrt{2al}$; in discesa
  con l'attrito $a = g(\sin\alpha - \mu_d\cos\alpha)$; lanciato in salita sul piano liscio si ferma dopo
  $t = v_0/(g\sin\alpha)$ e $d = v_0^2/(2g\sin\alpha)$; con l'attrito $|a| = g(\sin\alpha + \mu_d\cos\alpha)$ e
  $d = v_0^2/(2|a|)$.
- Scena `piano-inclinato` (del primo anno): il piano all'inclinazione del testo con l'angolo scritto e, al livello 2,
  la lunghezza. Niente forze, niente velocità.
- Corpi: una cassa, uno scatolone, un blocco di legno, una valigia, con l'accordo giusto.

## Livello 1: l'accelerazione senza attrito

Inclinazione da $10^\circ$ a $60^\circ$.

- "Una cassa scivola lungo un piano inclinato liscio di $46^\circ$. Quanto vale la sua accelerazione?" Risposta
  $7{,}0\,\text{m/s}^2$; distrattori $6{,}8\,\text{m/s}^2$ (il coseno), $9{,}8\,\text{m/s}^2$ (la caduta libera),
  $10\,\text{m/s}^2$ (la tangente).

Il livello ha pochi esercizi diversi (51 angoli, per quattro corpi): i dati sono un numero solo.

## Livello 2: tempo e velocità in fondo

Piano liscio, partenza da ferma, lunghezza da $1{,}1$ a $9{,}9\,\text{m}$, inclinazione da $10^\circ$ a $60^\circ$; il
tempo (metà) o la velocità in fondo (metà).

- "Una cassa parte da ferma dalla cima di un piano inclinato liscio, lungo $5{,}1\,\text{m}$ e inclinato di $11^\circ$.
  Con quale velocità arriva in fondo?" Risposta $4{,}4\,\text{m/s}$; distrattori $3{,}1\,\text{m/s}$ ($\sqrt{al}$, il 2
  dimenticato), $10\,\text{m/s}$ ($\sqrt{2gl}$, la lunghezza presa per l'altezza), $9{,}5\,\text{m/s}$ ($a\,l$).
- Per il tempo i distrattori sono $\sqrt{l/a}$, $2l/a$ (senza radice) e $\sqrt{2l/g}$ ($g$ al posto di $a$).

## Livello 3: l'accelerazione con l'attrito

In discesa, inclinazione da $15^\circ$ a $60^\circ$, $\mu_d$ da $0{,}10$ a $0{,}80$, con $\tan\alpha \ge 1{,}15\,\mu_d$ e
l'accelerazione almeno $0{,}5\,\text{m/s}^2$ (il corpo accelera davvero).

- "Uno scatolone scende lungo un piano inclinato di $48^\circ$, con $\mu_d = 0{,}12$. Quanto vale la sua accelerazione?"
  Risposta $6{,}5\,\text{m/s}^2$; distrattori $8{,}1\,\text{m/s}^2$ (l'attrito sommato), $6{,}1\,\text{m/s}^2$
  ($g(\sin\alpha - \mu_d)$, il peso intero come forza premente), $7{,}3\,\text{m/s}^2$ (l'attrito dimenticato).

## Livello 4: il lancio in salita

Piano liscio, $v_0$ da $1{,}1$ a $9{,}9\,\text{m/s}$, inclinazione da $10^\circ$ a $50^\circ$; lo spazio (metà) o il tempo
(metà) fino a fermarsi.

- "Una cassa viene lanciata a $5{,}1\,\text{m/s}$ su per un piano inclinato liscio di $11^\circ$. Dopo quanto tempo si
  ferma?" Risposta $2{,}7\,\text{s}$; distrattori $0{,}52\,\text{s}$ ($v_0/g$), $0{,}53\,\text{s}$
  ($v_0/(g\cos\alpha)$), $5{,}5\,\text{s}$ (andata e ritorno).
- Per lo spazio i distrattori sono $v_0^2/(g\sin\alpha)$ (il 2 dimenticato), $v_0^2/(2g)$ (il lancio verticale),
  $v_0^2/(2g\cos\alpha)$.

## Livello 5: in salita con l'attrito

$v_0$ da $1{,}1$ a $9{,}9\,\text{m/s}$, inclinazione da $10^\circ$ a $45^\circ$, $\mu_d$ da $0{,}10$ a $0{,}60$.

- "Una cassa viene lanciata a $5{,}1\,\text{m/s}$ su per un piano inclinato di $35^\circ$, con $\mu_d = 0{,}11$. Quanto
  spazio percorre lungo il piano prima di fermarsi?" Risposta $2{,}0\,\text{m}$; distrattori con l'attrito sottratto come
  in discesa (quando la differenza è positiva), senza attrito, e con $g(\sin\alpha + \mu_d)$.

## Esercizi da evitare

- Al livello 3 un corpo che accelera appena ($\tan\alpha$ vicina a $\mu_d$): accelerazioni sotto $0{,}5\,\text{m/s}^2$.
- Risultati sotto $0{,}1$ o oltre $99$.

## Verifica

`fis_piano_inclinato.py` rilegge il testo (con l'accordo), controlla cifre significative e intervalli, calcola con la
trigonometria esatta di SymPy e $g = 49/5$, confronta la risposta e le opzioni (stessa unità, due cifre significative);
controlla che la scena abbia l'angolo del testo, la lunghezza solo al livello 2, e nessuna forza.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 83 px su 252).

### Errori piantati

Bocciati tutti (40 su 40 per tipo): indice dell'opzione giusta, prima cifra di un dato del testo, testo dell'opzione
giusta, opzione doppia, parole vietate, angolo della scena spostato di $2^\circ$.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 203 (202), livello 2 979 (987), livello 3 941 (943), livello 4 976 (987), livello 5
999 (1000).

## Domande per la revisione

- Il livello 5 chiede solo lo spazio; serve anche il caso "si ferma e poi riscende?" con $\mu_s$, come l'esempio 5 della
  lezione?
- Nessun livello chiede il caso del corpo che rallenta in discesa ($\tan\alpha < \mu_d$): è nella lezione (esempio 3),
  va aggiunto?
