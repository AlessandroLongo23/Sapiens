# I passaggi di stato e il calore latente

Generatore: `fis-passaggi-stato` (`src/lib/exercises/v2/generators/fis-passaggi-stato.ts`, con
`src/lib/exercises/v2/fis-calore.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_passaggi_stato.py` (con
`_fis_calore.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/70-fis-passaggi-stato.md`. Percorso nel database:
`high_school/physics/fis-temperatura-calore/fis-passaggi-stato`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il calore latente
2. La massa dal calore
3. Due tappe
4. Tre tappe
5. Il grafico temperatura-calore
6. Ghiaccio nell'acqua

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità (J, g, J/kg, $^\circ\text{C}$). Dati dell'acqua come nella lezione, scritti
ogni volta nel testo: $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, $L_v = 2{,}26 \cdot 10^6\,\text{J/kg}$,
$c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, ghiaccio $2{,}1 \cdot 10^3\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Masse con due
cifre significative ($0{,}11$-$0{,}99\,\text{kg}$, o grammi), risultati con due cifre, in notazione scientifica da $100$
in su, mai a meno di $10^{-6}$ da un confine di arrotondamento.

## Livello 1: il calore latente

$Q = L\,m$, un quarto dei casi ciascuno: fusione del ghiaccio, solidificazione dell'acqua (calore ceduto),
vaporizzazione, condensazione del vapore (calore ceduto). Distrattori: l'altro calore latente, la massa in grammi
($\times 1000$), $L/m$.

- "$0{,}36\,\text{kg}$ d'acqua a $0\,^\circ\text{C}$ diventano ghiaccio nel congelatore. Quanto calore cedono?" Risposta
  $1{,}2 \cdot 10^5\,\text{J}$; distrattori $8{,}1 \cdot 10^5\,\text{J}$ ($L_v$), $1{,}2 \cdot 10^8\,\text{J}$ (i grammi),
  $9{,}3 \cdot 10^5\,\text{J}$ ($L/m$).
- "Quanto calore serve per trasformare in vapore $0{,}32\,\text{kg}$ d'acqua che bolle a $100\,^\circ\text{C}$?" Risposta
  $7{,}2 \cdot 10^5\,\text{J}$.

Il livello ha pochi esercizi diversi (quattro casi per 81 masse, circa 300).

## Livello 2: la massa dal calore

Metà ghiaccio che fonde ($Q$ da $1{,}1 \cdot 10^3$ a $9{,}9 \cdot 10^5\,\text{J}$), metà acqua che bolle ($Q$ da
$1{,}1 \cdot 10^4$ a $9{,}9 \cdot 10^6\,\text{J}$); risposta in grammi, tra $10$ e $1000$. Distrattori: l'altro calore
latente, i chilogrammi letti come grammi, $\times 10$.

- "A un blocco di ghiaccio a $0\,^\circ\text{C}$ si forniscono $3{,}6 \cdot 10^4\,\text{J}$. Quanti grammi di ghiaccio
  fondono?" Risposta $1{,}1 \cdot 10^2\,\text{g}$; distrattori $16\,\text{g}$ ($L_v$), $0{,}11\,\text{g}$,
  $1{,}1 \cdot 10^3\,\text{g}$.
- "All'acqua che bolle ... si forniscono $3{,}1 \cdot 10^4\,\text{J}$. Quanti grammi d'acqua diventano vapore?"
  Risposta $14\,\text{g}$; distrattori $93\,\text{g}$ ($L_f$), $0{,}014\,\text{g}$, $1{,}4 \cdot 10^2\,\text{g}$.

## Livello 3: due tappe

Metà: ghiaccio a $0\,^\circ\text{C}$ che diventa acqua a $5$-$60\,^\circ\text{C}$, $L_f\,m + c\,m\,t$; distrattori: la sola
fusione, il solo riscaldamento, $L_v$ al posto di $L_f$. Metà: acqua a $10$-$90\,^\circ\text{C}$ che diventa vapore,
$c\,m\,(100 - t) + L_v\,m$; distrattori: la sola ebollizione, il solo riscaldamento, il riscaldamento da $0$ invece che da
$t$.

- "Quanto calore serve per trasformare $0{,}36\,\text{kg}$ di ghiaccio a $0\,^\circ\text{C}$ in acqua a $26\,^\circ\text{C}$?"
  Risposta $1{,}6 \cdot 10^5\,\text{J}$; distrattori $1{,}2 \cdot 10^5$, $3{,}9 \cdot 10^4$, $8{,}5 \cdot 10^5\,\text{J}$.
- "Quanto calore serve per trasformare in vapore $0{,}32\,\text{kg}$ d'acqua a $28\,^\circ\text{C}$?" Risposta
  $8{,}2 \cdot 10^5\,\text{J}$.

## Livello 4: tre tappe

Ghiaccio da $-30$ a $-5\,^\circ\text{C}$ fino ad acqua a $5$-$60\,^\circ\text{C}$, come l'esempio 3 della lezione.
Distrattori: il riscaldamento del ghiaccio dimenticato, il calore specifico dell'acqua usato per il ghiaccio, la fusione
dimenticata.

- "Quanto calore serve per trasformare $0{,}49\,\text{kg}$ di ghiaccio a $-16\,^\circ\text{C}$ in acqua a
  $20\,^\circ\text{C}$?" Risposta $2{,}2 \cdot 10^5\,\text{J}$; distrattori $2{,}0 \cdot 10^5$, $2{,}4 \cdot 10^5$,
  $5{,}7 \cdot 10^4\,\text{J}$.
- "... $0{,}66\,\text{kg}$ ... $-11\,^\circ\text{C}$ ... $17\,^\circ\text{C}$?" Risposta $2{,}8 \cdot 10^5\,\text{J}$.

## Livello 5: il grafico temperatura-calore

La scena `curva-riscaldamento` (nuova, `scenes/CurvaRiscaldamento.tsx`) disegna la spezzata salita, pianerottolo,
salita, con i valori scritti sugli assi in corrispondenza degli angoli, come il grafico TikZ della lezione. Metà: una
sostanza solida di massa data, da $20\,^\circ\text{C}$, fonde a $60$-$350\,^\circ\text{C}$ (decine), con il pianerottolo
tra $q_1$ ($5$-$60\,\text{kJ}$) e $q_1 + \Delta Q$ ($\Delta Q$ da $11$ a $99\,\text{kJ}$, non multiplo di dieci); si chiede
$L_f = \Delta Q/m$. Distrattori: la fine del pianerottolo al posto della sua lunghezza, $\Delta Q \cdot m$, i kJ non
convertiti. Metà: un blocco di ghiaccio da $-10$, $-20$, $-30$ o $-40\,^\circ\text{C}$ fino ad acqua a $40\,^\circ\text{C}$,
con gli angoli al decimo di kJ; si chiede la massa in grammi. Distrattori: la fine del pianerottolo, $L_v$, l'inizio del
pianerottolo. La verifica controlla anche che i tratti in salita appartengano alla stessa massa di ghiaccio.

- "Un campione di $0{,}27\,\text{kg}$ di una sostanza solida ..." con gli angoli $(0; 20)$, $(39; 160)$, $(80; 160)$,
  $(87; 200)$. Risposta $1{,}5 \cdot 10^5\,\text{J/kg}$; distrattori $3{,}0 \cdot 10^5$ (la fine del pianerottolo),
  $1{,}1 \cdot 10^4$ ($\Delta Q \cdot m$), $1{,}5 \cdot 10^2\,\text{J/kg}$.
- "Il grafico mostra la temperatura di un blocco di ghiaccio ..." con $(0; -10)$, $(6{,}7; 0)$, $(113{,}6; 0)$,
  $(167{,}2; 40)$. Risposta $3{,}2 \cdot 10^2\,\text{g}$.

Il testo del caso della massa è sempre lo stesso: cambia il grafico.

## Livello 6: ghiaccio nell'acqua

Un cubetto di $11$-$99\,\text{g}$ a $0\,^\circ\text{C}$ in $150$-$400\,\text{g}$ d'acqua a $15$-$40\,^\circ\text{C}$; l'acqua
può cedere almeno il $10\%$ in più del calore che serve per fondere il ghiaccio, quindi il ghiaccio fonde tutto (il testo
lo dice). Temperatura finale almeno $1\,^\circ\text{C}$, con due cifre. Distrattori: il calore latente dimenticato, l'acqua
di fusione non scaldata, il calore latente con il segno sbagliato.

- "Un cubetto di ghiaccio di $49\,\text{g}$ ... $260\,\text{g}$ d'acqua a $22\,^\circ\text{C}$." Risposta
  $5{,}9\,^\circ\text{C}$; distrattori $19\,^\circ\text{C}$, $7{,}0\,^\circ\text{C}$, $31\,^\circ\text{C}$.
- "... $29\,\text{g}$ ... $240\,\text{g}$ d'acqua a $38\,^\circ\text{C}$." Risposta $25\,^\circ\text{C}$.

## Esercizi da evitare

- Ghiaccio che non fonde tutto (livello 6): la risposta sarebbe $0\,^\circ\text{C}$ con un conto diverso, non trattato.
- Pianerottoli che finiscono su un numero con uno zero finale ambiguo.

## Verifica

`fis_passaggi_stato.py` rilegge il testo, ricalcola con SymPy, controlla l'opzione giusta e le altre; al livello 5
ricalcola dagli angoli della scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 104 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate bocciati 60 su 60; un dato
del testo aumentato di uno 57 su 60 (i tre che passano sono del livello 6: un grammo di ghiaccio in più non cambia la
temperatura finale a due cifre); un angolo del grafico spostato di $1\,\text{kJ}$ 8 su 10 (i due che passano danno lo
stesso risultato a due cifre).

### Esercizi diversi su 1.000

Seed da 1 (da 50001), contando i testi: livello 1 306 (306), livello 2 307 (310), livello 3 951 (954), livello 4 996 (994),
livello 6 987 (990); al livello 5 i testi sono 82 ma i grafici cambiano ogni volta.

## Domande per la revisione

- Il ghiaccio che non fonde tutto (temperatura finale $0\,^\circ\text{C}$ e massa rimasta) va aggiunto come livello?
- Il calore specifico del ghiaccio $2{,}1 \cdot 10^3$ e del vapore $2{,}0 \cdot 10^3\,\text{J/(kg}\cdot{}^\circ\text{C)}$: sono i
  valori dell'Amaldi?
