# La forza elastica e la legge di Hooke

Generatore: `fis-forza-elastica` (`src/lib/exercises/v2/generators/fis-forza-elastica.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_forza_elastica.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/18-fis-forza-elastica.md` (note in `docs/lezioni/fisica/note/18-fis-forza-elastica.md`).

Sei livelli, ognuno con una difficoltà in più: la legge diretta, quella inversa, i centimetri, lunghezza e
allungamento, la costante da una tabella, un corpo appeso.

## Nomi dei livelli

1. La forza dalla legge di Hooke
2. L'allungamento dalla forza
3. Centimetri e metri
4. Lunghezza e allungamento
5. La costante da una tabella
6. Una massa appesa

## Tipi di risposta

Risposta `number`: forze e allungamenti arrotondati a due cifre significative (mezzo in su, niente arrotondamenti a
metà), la costante elastica e le lunghezze finali esatte e intere. Scelta multipla con l'unità nell'opzione
(`N`, `m`, `cm`, `N/m`); per le risposte intere i distrattori si arrotondano all'intero.

## Regole comuni

- $F = k \cdot \Delta l$, $\Delta l = l - l_0$, $g = 9{,}8$ N/kg. Costanti elastiche intere tra quelle della lista:
  $10$, $20$, $25$, $40$, $50$, $80$, $100$, $120$, $150$, $200$, $250$, $300$, $400$, $500$ N/m.
- Dati con due cifre significative; lunghezze intere in centimetri.
- Passaggi con la conversione scritta ("$4{,}4$ cm $= 0{,}044$ m") dove serve.

## Livello 1: la forza dalla legge di Hooke

$k$ dalla lista, l'allungamento in metri con due cifre (da $0{,}010$ a $0{,}099$ m o da $0{,}10$ a $0{,}50$ m), forza
di almeno $0{,}1$ N.

- "Una molla ha la costante elastica di $100$ N/m. Quale forza serve per allungarla di $0{,}035$ m?" Risposta
  $3{,}5$ N; distrattori $3{,}5 \cdot 10^{2}$ N (l'allungamento preso in centimetri), $2{,}9 \cdot 10^{3}$ N
  ($k / \Delta l$), $3{,}5 \cdot 10^{-4}$ N ($\Delta l / k$).
- "… $150$ N/m … $0{,}030$ m?" Risposta $4{,}5$ N.

## Livello 2: l'allungamento dalla forza

Forza con due cifre (da $1{,}0$ a $9{,}9$ o da $10$ a $99$ N), allungamento in metri tra $0{,}010$ e $0{,}99$.

- "Una molla con la costante elastica di $100$ N/m viene tirata con una forza di $3{,}5$ N. Di quanto si allunga?"
  Risposta $0{,}035$ m; distrattori $3{,}5 \cdot 10^{2}$ m ($F \cdot k$), $29$ m ($k / F$), $3{,}5$ m (i centimetri
  scritti come metri).
- "… $150$ N/m … $3{,}0$ N?" Risposta $0{,}020$ m.

## Livello 3: centimetri e metri

Metà: la forza da $k$ e da un allungamento in centimetri (l'esempio 1 della lezione). Metà: l'allungamento in
centimetri da $F$ e $k$ (tra $1$ e $99$ cm).

- "Una molla ha la costante elastica di $200$ N/m. Quale forza serve per allungarla di $5{,}0$ cm?" Risposta $10$ N;
  distrattori $1{,}0 \cdot 10^{3}$ N (i centimetri non convertiti, l'avviso della lezione), $1{,}0 \cdot 10^{2}$ N,
  $4{,}0 \cdot 10^{3}$ N.
- "Una molla con la costante elastica di $40$ N/m viene tirata con una forza di $6{,}0$ N. Di quanti centimetri si
  allunga?" Risposta $15$ cm; distrattori $0{,}15$ cm, $0{,}0015$ cm, $2{,}4 \cdot 10^{2}$ cm.

## Livello 4: lunghezza e allungamento

Lunghezza a riposo da $5$ a $20$ cm, allungamento intero da $2$ a $15$ cm, lunghezza finale fino a $27$ cm; la forza
$k \cdot \Delta l$ ha due cifre significative esatte. Due casi:

- la costante da due lunghezze (55%), con la scena `molla-righello`: la stessa molla a riposo e con il corpo appeso
  accanto a un righello in centimetri; il testo dice anche le due lunghezze;
- la lunghezza finale da $l_0$, $k$ e $F$ (45%), senza scena nel problema (disegnerebbe la risposta); la scena è nella
  soluzione.

Esempi:

- "La figura mostra una molla a riposo, lunga $12$ cm, e la stessa molla con un corpo appeso che la tira con una forza
  di $2{,}0$ N: ora è lunga $16$ cm. Quanto vale la costante elastica?" Risposta $50$ N/m; distrattori $13$ N/m (la
  lunghezza al posto dell'allungamento, l'avviso della lezione), $1$ N/m (l'allungamento in centimetri), $17$ N/m.
- "Una molla lunga $12$ cm a riposo ha la costante elastica di $50$ N/m. Quanto diventa lunga se la si tira con una
  forza di $3{,}0$ N?" Risposta $18$ cm; distrattori $6$ cm (l'allungamento), $24$ cm.

## Livello 5: la costante da una tabella

Quattro misure proporzionali, come l'esempio 4 della lezione: allungamenti $1$, $2$, $3$, $4$ volte una base ($1{,}0$,
$1{,}5$, $2{,}0$, $2{,}5$, $3{,}0$, $4{,}0$, $5{,}0$ cm), forze $k \cdot \Delta l$ con un decimale (con due la tabella
supera la larghezza del telefono).

- Forze $2{,}5$; $5{,}0$; $7{,}5$; $10{,}0$ N, allungamenti $2{,}5$; $5{,}0$; $7{,}5$; $10{,}0$ cm: risposta $100$ N/m;
  distrattori $1$ N/m ($k$ in N/cm), $10$ N/m, $200$ N/m.

Distrattori: $k$ in newton al centimetro, il rapporto rovesciato, l'ultima forza, il doppio.

## Livello 6: una massa appesa

Massa in grammi (da $50$ a $500$ g, multipla di $10$) o in chilogrammi (da $0{,}10$ a $0{,}99$ kg), metà ciascuno;
allungamento in centimetri tra $1$ e $60$.

- "A una molla verticale con la costante elastica di $100$ N/m si appende un corpo di $180$ g. Di quanti centimetri
  si allunga la molla?" Risposta $1{,}8$ cm; distrattori $0{,}18$ cm (la massa presa per la forza, l'avviso della
  lezione), $0{,}018$ cm (i metri scritti come centimetri), $1{,}8 \cdot 10^{2}$ cm.

## Esercizi da evitare

- Arrotondamenti a metà; costanti fuori dalla lista; tabelle non proporzionali.
- Allungamenti sotto $1$ cm o oltre $60$ cm al livello 6; lunghezze che il righello non contiene.

## Verifica

`fis_forza_elastica.py` rilegge il testo (e la tabella, che toglie dal testo prima di leggere la prosa), porta le
lunghezze in metri, calcola con SymPy $F = k (l - l_0)$ e $\Delta l = m g / k$, controlla la lista delle costanti, le
cifre significative dei dati, la proporzionalità della tabella e che la scena del livello 4 disegni le lunghezze del
testo su un righello abbastanza lungo. Poi la risposta, le opzioni, la quota dei casi.

Esito: seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` codice 0; `width.mts` codice 0 dopo
aver tolto le forze con due decimali dalla tabella (erano $3$ su $150$ oltre i $350$ px).

### Errori piantati

Tutti bocciati: le sei modifiche generiche (risposta, opzione giusta, opzioni uguali, spazio sottile, un dato, la
scena), una costante fuori lista, una tabella non proporzionale.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 713 (699), livello 2 753 (739), livello 3 814 (803), livello 4 894 (885), livello 5 84
(84), livello 6 715 (703). Il livello 5 è stretto per costruzione.

## Domande per la revisione

- $\Delta l$ come nella lezione, o $x$? E la costante in N/m sempre, o anche in N/cm negli esercizi?
- Livello 4: il testo dice le lunghezze e la figura le mostra sul righello. Si vuole invece che lo studente le legga
  solo sul righello?
- Molle in serie e in parallelo: né la lezione né il generatore le trattano (vedi le note della lezione).
