# Il pendolo e la molla

Generatore: `fis-pendolo-molla` (`src/lib/exercises/v2/generators/fis-pendolo-molla.ts`, con
`src/lib/exercises/v2/fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_pendolo_molla.py` (con `_fis_forze_movimento.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/58-fis-pendolo-molla.md`. Percorso nel database:
`high_school/physics/fis-forze-movimento/fis-pendolo-molla`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il periodo della molla
2. Il periodo del pendolo
3. Che cosa cambia il periodo
4. Dal periodo alla molla o al filo
5. Misurare g

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($0{,}99\,\text{s}$, $20\,\text{N/m}$, $0{,}99\,\text{m}$,
$9{,}8\,\text{m/s}^2$). Dati con due cifre significative: masse, lunghezze e periodi da $0{,}11$ a $0{,}99$ o da $1{,}1$
a $9{,}9$ (metà ciascuno), costanti elastiche da $11$ a $99\,\text{N/m}$, masse del pendolo in grammi da $11$ a $99$,
tempi cronometrati da $1{,}1$ a $99\,\text{s}$ per $10$ o $20$ oscillazioni; $g = 9{,}8\,\text{m/s}^2$. Risultati a due
cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento.

## Regole comuni

- Formule della lezione: molla $T = 2\pi\sqrt{m/k}$, pendolo $T = 2\pi\sqrt{l/g}$ per piccole oscillazioni; il periodo
  del pendolo non dipende dalla massa né dall'ampiezza (piccola), quello della molla non dipende dall'ampiezza; al
  contrario $k = 4\pi^2 m/T^2$, $l = g T^2/(4\pi^2)$, $g = 4\pi^2 l/T^2$, con $T$ = tempo diviso per il numero di
  oscillazioni.
- Niente scene.

## Livello 1: il periodo della molla

- "Un blocco di $0{,}36\,\text{kg}$, attaccato a una molla di costante elastica $45\,\text{N/m}$, oscilla su un piano
  orizzontale liscio. Quanto vale il periodo delle oscillazioni?" Risposta $0{,}56\,\text{s}$; distrattori
  $70\,\text{s}$ ($2\pi\sqrt{k/m}$, massa e costante scambiate), $0{,}089\,\text{s}$ ($\sqrt{m/k}$, senza $2\pi$),
  $0{,}050\,\text{s}$ ($2\pi m/k$, senza radice).

## Livello 2: il periodo del pendolo

La massa della pallina è nel testo e non serve.

- "Un pendolo è formato da una pallina di $45\,\text{g}$ appesa a un filo lungo $0{,}36\,\text{m}$. Quanto vale il
  periodo delle piccole oscillazioni?" Risposta $1{,}2\,\text{s}$; distrattori $33\,\text{s}$ ($2\pi\sqrt{g/l}$),
  $0{,}19\,\text{s}$ (senza $2\pi$), $5{,}7\,\text{s}$ ($2\pi\sqrt{l/(m g)}$, la massa sotto la radice).

## Livello 3: che cosa cambia il periodo

Cinque casi, un quinto ciascuno: il filo del pendolo di lunghezza doppia, tripla o quadrupla ($T\sqrt{k}$); la pallina
di massa doppia, tripla o quadrupla (uguale); l'ampiezza da $2^\circ$ a $4^\circ$, $6^\circ$ o $8^\circ$ (uguale); il
blocco sulla molla di massa doppia, tripla o quadrupla ($T\sqrt{k}$); la molla con la costante doppia, tripla o
quadrupla ($T/\sqrt{k}$). Opzioni tra $T\sqrt{k}$, $T k$, $T$, $T/\sqrt{k}$, $T/k$; risultato almeno $0{,}1\,\text{s}$.

- "Un pendolo oscilla con un periodo di $0{,}36\,\text{s}$. Se si fa partire il pendolo da un angolo di $6^\circ$ invece
  che di $2^\circ$, quanto diventa il periodo?" Risposta $0{,}36\,\text{s}$; distrattori $0{,}62\,\text{s}$,
  $1{,}1\,\text{s}$, $0{,}21\,\text{s}$.

## Livello 4: dal periodo alla molla o al filo

$10$ o $20$ oscillazioni complete cronometrate insieme. Metà: la costante elastica di una molla con una massa appesa
($k$ tra $1$ e $99\,\text{N/m}$). Metà: la lunghezza di un pendolo ($l$ tra $0{,}1$ e $9{,}9\,\text{m}$).

- "Un blocco di $0{,}84\,\text{kg}$, appeso a una molla, compie 10 oscillazioni complete in $9{,}2\,\text{s}$. Quanto
  vale la costante elastica della molla?" Risposta $39\,\text{N/m}$; distrattori $36\,\text{N/m}$ ($4\pi^2 m/T$, il
  periodo non al quadrato), $0{,}39\,\text{N/m}$ (il tempo totale preso per il periodo), $6{,}2\,\text{N/m}$ ($2\pi$ al
  posto di $4\pi^2$).
- Per la lunghezza i distrattori sono $g T/(2\pi)$, $g T^2/(2\pi)$ e $g t^2/(4\pi^2)$ con il tempo totale.

## Livello 5: misurare g

Un pendolo su un pianeta sconosciuto; $g$ tra $0{,}5$ e $30\,\text{m/s}^2$.

- "Su un pianeta sconosciuto un pendolo lungo $0{,}36\,\text{m}$ compie 10 piccole oscillazioni complete in
  $45\,\text{s}$. Quanto vale l'accelerazione di gravità sul pianeta?" Risposta $0{,}70\,\text{m/s}^2$; distrattori
  $3{,}2\,\text{m/s}^2$ (il periodo non al quadrato), $0{,}0070\,\text{m/s}^2$ (il tempo totale), $0{,}11\,\text{m/s}^2$
  ($2\pi$ al posto di $4\pi^2$).

## Esercizi da evitare

- Periodi sotto $0{,}1\,\text{s}$ al livello 3; costanti oltre $99\,\text{N/m}$ o lunghezze oltre $9{,}9\,\text{m}$ al
  livello 4.

## Verifica

`fis_pendolo_molla.py` rilegge il testo, controlla dati e intervalli (le oscillazioni sono $10$ o $20$, le ampiezze del
livello 3 piccole), calcola con $g = 49/5$ e $\pi$ esatti, confronta la risposta e le opzioni; controlla che non ci sia
una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 92 px su 252).

### Errori piantati

Bocciati: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate (40 su 40); prima cifra
di un dato del testo 32 su 40, perché al livello 2 il primo dato è la massa della pallina, che non entra nel periodo: il
cambio non è un errore.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 959 (960), livello 2 959 (960), livello 3 813 (812), livello 4 651 (642), livello 5 970
(969).

## Domande per la revisione

- Il livello 3 è un esercizio di ragionamento travestito da conto: meglio come vero o falso ("il periodo raddoppia")?
- Il livello 5 con un pianeta inventato: meglio la Luna e Marte con i valori veri ($1{,}62$ e $3{,}71\,\text{m/s}^2$, da
  verificare)?
