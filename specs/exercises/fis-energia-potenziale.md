# Energia potenziale gravitazionale ed elastica

Generatore: `fis-energia-potenziale` (`src/lib/exercises/v2/generators/fis-energia-potenziale.ts`, con
`src/lib/exercises/v2/fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_energia_potenziale.py` (con `_fis_energia.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/62-fis-energia-potenziale.md`. Percorso nel database:
`high_school/physics/lavoro-energia/fis-energia-potenziale`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'energia potenziale gravitazionale
2. Il livello di riferimento
3. Il lavoro del peso
4. L'energia potenziale elastica
5. La deformazione dall'energia

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($29\,\text{J}$, $-8{,}8\,\text{J}$, $4{,}1\,\text{cm}$). Masse, altezze,
deformazioni ed energie con due cifre significative, senza zeri finali ambigui ($0{,}45$, $4{,}5$, $45$); costanti
elastiche con tre cifre, da $101$ a $999\,\text{N/m}$, mai con lo zero finale; $g = 9{,}8\,\text{m/s}^2$. Risultati a
due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento. Nessun distrattore a meno dell'8%
della risposta.

## Regole comuni

- Formule della lezione: $U = m g h$ con $h$ misurata dal livello di riferimento (negativa sotto), $W_P = U_i - U_f =
  m g (h_i - h_f)$, $U = \tfrac{1}{2} k x^2$ con $x$ in metri, $x = \sqrt{2U/k}$.
- Nessuna scena: le figure della lezione bastano, e i dati sono numeri soli.

## Livello 1: l'energia potenziale gravitazionale

Massa da $1{,}1$ a $9{,}9\,\text{kg}$, altezza da $0{,}30$ a $9{,}9\,\text{m}$, risultato tra $1$ e $99\,\text{J}$.

- "Un vaso di $9{,}9\,\text{kg}$ è su uno scaffale a $0{,}54\,\text{m}$ dal pavimento. Quanto vale la sua energia
  potenziale gravitazionale, con il livello di riferimento sul pavimento?" Risposta $52\,\text{J}$; distrattori
  $5{,}3\,\text{J}$ ($m h$, senza $g$), $26\,\text{J}$ (la metà, confusa con l'energia elastica), $97\,\text{J}$ ($m g$,
  senza l'altezza).

## Livello 2: il livello di riferimento

Metà dei casi il corpo sta sopra il livello (una lampada appesa da $1{,}5$ a $2{,}9\,\text{m}$, il piano di un tavolo da
$0{,}45$ a $0{,}95\,\text{m}$): $U = m g (h_1 - h_2)$; distrattori $m g h_1$ (l'altezza dal pavimento), $m g (h_1 + h_2)$,
$-U$. Metà sta sotto (una borsa sul pavimento, rispetto al tavolo): $U = -m g h_2$; distrattori $+m g h_2$ (il segno),
$0\,\text{J}$ ("è sul pavimento"), $-m h_2$ (senza $g$).

- "Una borsa di $5{,}7\,\text{kg}$ è appoggiata sul pavimento. Quanto vale la sua energia potenziale gravitazionale
  rispetto al piano di un tavolo alto $0{,}65\,\text{m}$?" Risposta $-36\,\text{J}$; distrattori $36\,\text{J}$,
  $0\,\text{J}$, $-3{,}7\,\text{J}$.

## Livello 3: il lavoro del peso

Metà dei casi il corpo sale (una cassa sollevata), metà scende (un sasso che cade); altezze da $0{,}50$ a
$9{,}9\,\text{m}$, diverse; $W_P = m g (h_i - h_f)$ con il segno, tra $1$ e $99\,\text{J}$ in valore assoluto.

- "Un sasso di $3{,}2\,\text{kg}$ cade da $9{,}5\,\text{m}$ a $7{,}4\,\text{m}$ di altezza. Quanto lavoro compie la
  forza-peso?" Risposta $66\,\text{J}$; distrattori $-66\,\text{J}$ (il segno), $m g h_f$ e $m g h_i$ (l'energia di
  arrivo o di partenza al posto della differenza), se lontani almeno l'8% dalla risposta.

## Livello 4: l'energia potenziale elastica

Costante da $101$ a $999\,\text{N/m}$, deformazione da $1{,}1$ a $25\,\text{cm}$ (allungata o compressa), risultato tra
$0{,}10$ e $99\,\text{J}$.

- "Una molla con costante elastica $664\,\text{N/m}$ viene compressa di $5{,}7\,\text{cm}$. Quanta energia
  potenziale elastica ha?" Risposta $1{,}1\,\text{J}$; distrattori $2{,}2\,\text{J}$ (senza il mezzo),
  $19\,\text{J}$ ($\tfrac12 k x$, senza il quadrato), $1{,}1 \cdot 10^2\,\text{J}$ (i $\text{cm}^2$ divisi per $100$
  invece che per $10\,000$: fuori intervallo, sostituito da un distrattore di scorta).

## Livello 5: la deformazione dall'energia

Energia da $0{,}11$ a $9{,}9\,\text{J}$, costante da $101$ a $999\,\text{N/m}$, risposta in centimetri tra $1{,}1$ e
$40$.

- "Una molla con costante elastica $761\,\text{N/m}$ ha un'energia potenziale elastica di $0{,}36\,\text{J}$. Di
  quanti centimetri è deformata?" Risposta $3{,}1\,\text{cm}$; distrattori $2{,}2\,\text{cm}$ ($\sqrt{U/k}$),
  $0{,}095\,\text{cm}$ ($2U/k$ senza radice), $4{,}3\,\text{cm}$ ($\sqrt{4U/k}$).

## Esercizi da evitare

- Energie oltre $99\,\text{J}$, che a due cifre andrebbero in notazione scientifica.
- Due altezze uguali al livello 3.
- Distrattori che arrotondano quasi alla risposta.

## Verifica

`fis_energia_potenziale.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con $g = 49/5$ esatto
(SymPy), arrotonda e confronta la risposta e il formato delle opzioni; controlla che non ci sia una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 70 px su 252).

### Errori piantati

Su 200 esercizi: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia e parole vietate bocciati tutti;
una cifra dei dati cambiata bocciata 173 volte su 200. Le 27 che passano cambiano l'ultima cifra della costante
elastica (tre cifre significative, da $748$ a $749\,\text{N/m}$), che non sposta la risposta a due cifre: non sono
errori.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 989 (978), livello 2 968 (956), livello 3 998 (998), livello 4 996 (993), livello 5
999 (996).

## Domande per la revisione

- La costante elastica con tre cifre significative e la risposta con due: va bene, o meglio costanti con due cifre
  ($45\,\text{N/m}$, $4{,}5 \cdot 10^2\,\text{N/m}$)?
- Al livello 2 il distrattore "$0\,\text{J}$" per un corpo sul pavimento è un errore vero o troppo facile da scartare?
