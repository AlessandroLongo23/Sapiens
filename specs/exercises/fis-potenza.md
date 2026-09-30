# La potenza

Generatore: `fis-potenza` (`src/lib/exercises/v2/generators/fis-potenza.ts`, con `src/lib/exercises/v2/fis-lavoro.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_potenza.py` (con `_fis_lavoro.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/60-fis-potenza.md`. Percorso nel database: `high_school/physics/lavoro-energia/fis-potenza`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Lavoro e tempo
2. Sollevare un carico
3. Potenza e velocità
4. La velocità in km/h
5. Il kilowattora

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, con l'unità nell'opzione (W, kWh, J). Dati con due cifre significative (lavori e
forze con tre, da $101$ a $999$), mai un intero che finisce con lo zero; $g = 9{,}8\,\text{m/s}^2$. Risultati con due
cifre significative, scritti come nelle lezioni (notazione scientifica da $100$ in su e sotto $0{,}01$; modulo comune
`fis-lavoro.ts`), mai a ridosso di un confine di arrotondamento. Niente scene: le figure non cambierebbero con i
dati.

## Regole comuni

- Formule della lezione: $P = W / \Delta t$; per sollevare a velocità costante $P = m g h / \Delta t$ e
  $P = m g \cdot v$; $P = F \cdot v$ con la forza parallela alla velocità e la velocità in m/s ($v = V / 3{,}6$);
  $E = P \cdot \Delta t$, in kWh con la potenza in kW e il tempo in ore, e $1\,\text{kWh} = 3{,}6 \cdot 10^6\,\text{J}$.
- Il peso si scrive $m g$ nei passaggi, perché $P$ è la potenza.

## Livello 1: lavoro e tempo

Lavoro da $101$ a $999\,\text{J}$, tempo da $1{,}1$ a $9{,}9\,\text{s}$.

- "Un motore compie un lavoro di $748\,\text{J}$ in $1{,}4\,\text{s}$. Quale potenza media sviluppa?" Risposta
  $5{,}3 \cdot 10^2\,\text{W}$; distrattori $1{,}0 \cdot 10^3\,\text{W}$ (lavoro per tempo),
  $1{,}9 \cdot 10^{-3}\,\text{W}$ (il rapporto rovesciato), poi $1{,}2$ volte la risposta.

## Livello 2: sollevare un carico

Massa da $11$ a $99\,\text{kg}$, altezza e tempo da $1{,}1$ a $9{,}9$.

- "Un montacarichi solleva a velocità costante una cassa di $75\,\text{kg}$ fino a un'altezza di $1{,}4\,\text{m}$ in
  $5{,}1\,\text{s}$. Quale potenza media sviluppa?" Risposta $2{,}0 \cdot 10^2\,\text{W}$; distrattori $21\,\text{W}$
  (la massa al posto del peso), $1{,}0 \cdot 10^3\,\text{W}$ (il lavoro, senza dividere per il tempo).

## Livello 3: potenza e velocità

Metà un carico sollevato a velocità costante (massa da $11$ a $99\,\text{kg}$, velocità da $0{,}11$ a
$0{,}99\,\text{m/s}$), metà un traino (forza da $101$ a $999\,\text{N}$, velocità da $1{,}1$ a $9{,}9\,\text{m/s}$).

- "Un argano solleva un carico di $36\,\text{kg}$ a velocità costante, $0{,}45\,\text{m/s}$. Quale potenza
  sviluppa?" Risposta $1{,}6 \cdot 10^2\,\text{W}$; distrattori $16\,\text{W}$ (la massa per la velocità),
  $7{,}8 \cdot 10^2\,\text{W}$ ($m g / v$).
- "Un cavallo tira un carro lungo una strada piana con una forza di $447\,\text{N}$, parallela alla strada, e il carro
  avanza a velocità costante, $6{,}4\,\text{m/s}$. Quale potenza sviluppa il cavallo?" Risposta
  $2{,}9 \cdot 10^3\,\text{W}$; distrattori $70\,\text{W}$ ($F / v$), $0{,}014\,\text{W}$ ($v / F$).

## Livello 4: la velocità in km/h

Velocità da $11$ a $99\,\text{km/h}$, forza resistente da $101$ a $999\,\text{N}$.

- "Un'auto viaggia a velocità costante, $75\,\text{km/h}$; le forze resistenti valgono in tutto $135\,\text{N}$.
  Quale potenza sviluppa il motore?" Risposta $2{,}8 \cdot 10^3\,\text{W}$; distrattori $1{,}0 \cdot 10^4\,\text{W}$
  (km/h non convertiti), $3{,}6 \cdot 10^4\,\text{W}$ (moltiplicato per $3{,}6$), $6{,}5\,\text{W}$ ($F / v$).

## Livello 5: il kilowattora

Un forno elettrico, una stufa elettrica, un bollitore o un condizionatore da $1{,}1$ a $3{,}9\,\text{kW}$, con
l'accordo giusto. Metà in kilowattora da un tempo in minuti ($11$-$99$), metà in joule da un tempo in ore ($1{,}1$-$9{,}9$).

- "Un forno elettrico da $2{,}8\,\text{kW}$ resta acceso per $36$ minuti. Quanta energia consuma, in kilowattora?"
  Risposta $1{,}7\,\text{kWh}$; distrattori $1{,}0 \cdot 10^2\,\text{kWh}$ (i minuti presi per ore), $1{,}0\,\text{kWh}$
  (i minuti presi per centesimi d'ora, $0{,}36\,\text{h}$).
- "Un bollitore da $1{,}9\,\text{kW}$ resta acceso per $1{,}8\,\text{h}$. Quanta energia consuma, in joule?" Risposta
  $1{,}2 \cdot 10^7\,\text{J}$; distrattori $3{,}4 \cdot 10^3\,\text{J}$ (senza il $3600$),
  $1{,}2 \cdot 10^4\,\text{J}$ (senza il $1000$), $3{,}4\,\text{J}$ (i kilowattora presi per joule).

## Esercizi da evitare

- Risultati a ridosso di un confine di arrotondamento: il distrattore che ci cade viene sostituito da uno di riserva
  ($1{,}2$, $0{,}8$, $1{,}5$, $0{,}5$ volte la risposta).

## Verifica

`fis_potenza.py` rilegge il testo (con l'accordo), controlla cifre significative e intervalli, ricalcola in aritmetica
esatta con SymPy ($5/18$ per i km/h), arrotonda da sé e confronta l'opzione giusta; controlla che ogni opzione sia
scritta con due cifre significative e con l'unità giusta, e che non ci sia una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 109 px su 252).

### Errori piantati

Su 200 esercizi (seed da 90001) bocciati tutti: indice dell'opzione giusta, testo dell'opzione giusta, un numero del
testo cambiato, opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1: livello 1 993, livello 2 999, livello 3 973, livello 4 998, livello 5 974.

## Domande per la revisione

- Il distrattore $v / F$ del traino dà potenze minuscole ($0{,}014\,\text{W}$): tenerlo o sostituirlo?
- Serve un livello con il rendimento di un motore, che la lezione non tratta?
