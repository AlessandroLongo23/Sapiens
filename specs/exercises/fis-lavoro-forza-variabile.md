# Il lavoro di una forza variabile

Generatore: `fis-lavoro-forza-variabile` (`src/lib/exercises/v2/generators/fis-lavoro-forza-variabile.ts`, con
`src/lib/exercises/v2/fis-lavoro.ts`, `fis-forze-movimento.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_lavoro_forza_variabile.py` (con `_fis_lavoro.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/77-fis-lavoro-forza-variabile.md`. Percorso nel database:
`high_school/physics/fis-forze-conservative/fis-lavoro-forza-variabile`.

Sei livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'area sotto il grafico
2. Le aree sotto l'asse
3. La forza media
4. Il lavoro della forza elastica
5. La velocità dal grafico
6. La molla che ferma il carrello

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($18\,\text{J}$, $-4{,}5\,\text{J}$, $3{,}7\,\text{N}$, $2{,}5\,\text{m/s}$,
$5{,}6\,\text{cm}$). I grafici hanno coordinate intere (posizioni da $0$ a $8\,\text{m}$ al massimo, forze fino a
$12\,\text{N}$ in valore assoluto), quindi le aree sono esatte. Risultati a due cifre significative, scritti come nella
lezione "Il lavoro di una forza" (`fis-lavoro.ts`); la risposta giusta non è mai un numero di due cifre che finisce con
zero ($20\,\text{J}$), né a meno di $10^{-6}$ da un confine di arrotondamento.

## Regole comuni

- Il lavoro è l'area tra il grafico forza-spostamento e l'asse $x$, positiva sopra l'asse e negativa sotto; ogni tratto
  rettilineo è un rettangolo, un triangolo o un trapezio. I passaggi della soluzione calcolano un pezzo alla volta e poi
  sommano, come negli esempi 1 e 2 della lezione.
- Scena `grafico-forza-spostamento` (nuova, `scenes/GraficoForzaSpostamento.tsx`): il foglio quadrettato con le tacche
  numerate e la spezzata. Nel problema le aree non sono colorate; nella scena della soluzione sì (arancione sopra
  l'asse, blu sotto). Il testo non ripete i numeri del grafico: lo studente li legge.
- Forme dei grafici sopra l'asse (livelli 1, 3 e 5): un tratto costante e poi una discesa fino a zero (40%), una salita
  da zero e poi un tratto costante (30%), un tratto costante e poi una retta fino a un altro valore positivo (30%).
  Forze pari, da $2$ a $12\,\text{N}$.

## Livello 1: l'area sotto il grafico

- Grafico: da $0$ a $12\,\text{N}$ in un metro, poi costante fino a $2\,\text{m}$. "Quanto lavoro compie la forza mentre
  il carrello va da $x = 0$ a $x = 2\,\text{m}$?" Risposta $18\,\text{J}$ ($6 + 12$); distrattori $24\,\text{J}$ (forza
  massima per spostamento, l'avviso della lezione), $12\,\text{J}$ (tutto come un triangolo, o il solo rettangolo),
  $6{,}0\,\text{J}$ (il solo triangolo).
- Grafico: $6\,\text{N}$ fino a $2\,\text{m}$, poi giù fino a zero a $5\,\text{m}$: $21\,\text{J}$ (l'esempio 1).

## Livello 2: le aree sotto l'asse

Metà: una retta che scende da un valore positivo a uno negativo e attraversa l'asse in una posizione intera. Metà: due
tratti costanti, il primo positivo e il secondo negativo. Lavoro totale diverso da zero, di qualunque segno.

- Retta da $5\,\text{N}$ in $x = 0$ a $-3\,\text{N}$ in $x = 8\,\text{m}$: $12{,}5 - 4{,}5 = 8{,}0\,\text{J}$; distrattori
  $17\,\text{J}$ (le due aree sommate senza segno, l'avviso della lezione), $-4{,}5\,\text{J}$ (la sola area negativa),
  $-8{,}0\,\text{J}$ (il segno opposto). La sola area positiva, $12{,}5\,\text{J}$, qui non entra tra le opzioni perché
  cade su un confine di arrotondamento.
- $4\,\text{N}$ fino a $3\,\text{m}$, poi $-6\,\text{N}$ fino a $8\,\text{m}$: $12 - 30 = -18\,\text{J}$.

## Livello 3: la forza media

- Con il primo grafico del livello 1: $F_m = 18\,\text{J} / 2\,\text{m} = 9{,}0\,\text{N}$; distrattori $6{,}0\,\text{N}$
  (la media tra il primo e l'ultimo valore, che vale solo per una retta), $12\,\text{N}$ (la forza massima),
  $18\,\text{N}$ (il lavoro diviso per il primo tratto).
- Da $0$ a $4\,\text{N}$ in un metro, poi costante fino a $6\,\text{m}$: $22/6 = 3{,}7\,\text{N}$.

## Livello 4: il lavoro della forza elastica

Metà con la deformazione che aumenta (lavoro negativo), metà con la deformazione che diminuisce (lavoro positivo).
$k$ da $11$ a $99\,\text{N/m}$, deformazioni in centimetri da $11$ a $39$, distanti almeno $6\,\text{cm}$, mai multipli
di dieci. Nessuna scena.

- "Una molla di costante elastica $k = 72\,\text{N/m}$, allungata di $31\,\text{cm}$, si accorcia fino a restare
  allungata di $19\,\text{cm}$. Quanto lavoro compie la forza elastica?" Risposta $2{,}2\,\text{J}$; distrattori
  $-2{,}2\,\text{J}$ (il segno), $0{,}52\,\text{J}$ e $-0{,}52\,\text{J}$ (il quadrato della differenza, l'avviso della
  lezione).
- "… $k = 45\,\text{N/m}$, già allungata di $12\,\text{cm}$, viene allungata fino a $25\,\text{cm}$": $-1{,}1\,\text{J}$.

## Livello 5: la velocità dal grafico

Carrello da $1{,}1$ a $9{,}9\,\text{kg}$, fermo in $x = 0$, senza attrito; grafico come al livello 1.

- Carrello di $5{,}7\,\text{kg}$ e primo grafico del livello 1 ($18\,\text{J}$): $v = \sqrt{2 \cdot 18/5{,}7} =
  2{,}5\,\text{m/s}$; distrattori $1{,}8\,\text{m/s}$ ($\sqrt{W/m}$, il mezzo dimenticato), $6{,}3\,\text{m/s}$
  ($2W/m$, senza radice), $2{,}9\,\text{m/s}$ (con il lavoro $F_{max}\,\Delta x$).
- Carrello di $2{,}0\,\text{kg}$ con il grafico dell'esempio 1: $4{,}6\,\text{m/s}$ (l'esempio 5; il generatore non dà
  masse con lo zero finale, ma il conto è questo).

## Livello 6: la molla che ferma il carrello

Massa da $1{,}1$ a $9{,}9\,\text{kg}$, velocità da $1{,}1$ a $9{,}9\,\text{m/s}$, $k$ con tre cifre da $101$ a
$999\,\text{N/m}$; compressione tra $2$ e $60\,\text{cm}$, chiesta in centimetri. Nessuna scena.

- "Un carrello di $1{,}2\,\text{kg}$ arriva a $1{,}6\,\text{m/s}$, senza attrito, contro una molla a riposo di costante
  elastica $k = 979\,\text{N/m}$. Di quanti centimetri si comprime la molla prima che il carrello si fermi?" Risposta
  $5{,}6\,\text{cm}$; distrattori $0{,}20\,\text{cm}$ ($v\,m/k$, senza radice), $0{,}31\,\text{cm}$ ($m v^2/k$, il
  quadrato non tolto), $4{,}0\,\text{cm}$ e $7{,}9\,\text{cm}$ (il mezzo rimasto da una parte sola).
- $2{,}4\,\text{kg}$, $6{,}6\,\text{m/s}$, $371\,\text{N/m}$: $53\,\text{cm}$.

## Esercizi da evitare

- Lavoro totale nullo al livello 2 (sarebbe un buon esercizio, ma l'opzione $0\,\text{J}$ si riconosce a occhio).
- Grafici più alti di $12\,\text{N}$ o più lunghi di $8\,\text{m}$: sul telefono i quadretti diventano troppo piccoli.
- Risposte come $20\,\text{J}$ o $50\,\text{N}$, con lo zero ambiguo.

## Verifica

`fis_lavoro_forza_variabile.py` rilegge il testo, legge i punti del grafico dalla scena (coordinate intere, dentro il
foglio, sopra l'asse dove deve), calcola l'area con il segno tratto per tratto in aritmetica esatta, confronta la
risposta e le opzioni, controlla che la scena della soluzione sia lo stesso grafico con le aree e che ai livelli 4 e 6
non ci sia una scena.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS (livello 2 con seed 1: 504 rette e 496 gradini; livello 4: 515 e 485). `review.mts` e `width.mts` con codice 0 (opzioni al più 65 px su 252).

### Errori piantati

Su 72 campioni (12 per livello, seed da 4242), bocciati tutti: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, un punto del grafico spostato, parole vietate. Una cifra di un dato cambiata: 67 su 72; nei cinque casi passati la cifra cambiata ($k$ da 97 a 98, massa da 8,8 a 8,9 kg) non cambia la risposta arrotondata, e l'esercizio rovinato è ancora giusto.

## Domande per la revisione

- Il testo dei livelli con il grafico non ripete i numeri: va bene che l'esercizio si possa fare solo guardando la
  figura? Chi usa la sintesi vocale ha la descrizione del grafico nell'alt della scena.
- Al livello 6 la risposta è chiesta in centimetri: meglio in metri, come nell'esempio 6 della lezione?
