# La conservazione dell'energia meccanica

Generatore: `energia` (`src/lib/exercises/v2/generators/energia.ts`, con `src/lib/exercises/v2/fis-energia.ts`,
`fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente: `scripts/exercises/checkers/energia.py` (con
`_fis_energia.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/63-energia.md`. Percorso nel database:
`high_school/physics/lavoro-energia/energia`.

Cinque livelli, ognuno con una difficoltà in più. Nessun attrito: gli attriti sono il generatore
`fis-energia-totale`.

## Nomi dei livelli

1. La caduta libera
2. L'altezza massima
3. Da un punto all'altro della pista
4. La molla che lancia un blocco
5. La molla e la salita

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($19\,\text{m/s}$, $2{,}2\,\text{m}$, $16\,\text{cm}$). Dati con due cifre
significative senza zeri finali ambigui; costanti elastiche con tre cifre, da $101$ a $999\,\text{N/m}$, mai con lo zero
finale; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di
arrotondamento. Nessun distrattore a meno dell'8% della risposta.

## Regole comuni

- Formule della lezione: $K_i + U_i = K_f + U_f$; $v = \sqrt{2 g h}$; $h_{max} = v_0^2 / (2g)$;
  $v_B^2 = v_A^2 + 2 g (h_A - h_B)$; $\tfrac12 k x^2 = \tfrac12 m v^2$, quindi $v = x\sqrt{k/m}$; $\tfrac12 k x^2 = m g h$.
- Scena `pista-energia` (nuova, `scenes/PistaEnergia.tsx`) al livello 3: la pista da $A$ a $B$ con le due altezze
  scritte e la velocità in $A$; mai la velocità in $B$.

## Livello 1: la caduta libera

Metà: un sasso lasciato cadere; metà: un bambino che parte da fermo in cima a uno scivolo. Altezza da $1{,}1$ a
$99\,\text{m}$.

- "Un sasso viene lasciato cadere da un'altezza di $18\,\text{m}$. Con che velocità arriva al suolo, se la
  resistenza dell'aria è trascurabile?" Risposta $19\,\text{m/s}$; distrattori $13\,\text{m/s}$ ($\sqrt{g h}$, senza
  il 2), $1{,}9\,\text{m/s}$ ($\sqrt{2h/g}$, il tempo di caduta), e $2 g h$ senza radice quando è sotto $100$
  (altrimenti un distrattore di scorta, $23\,\text{m/s}$).

Il livello ha circa 320 esercizi diversi: il dato è un numero solo.

## Livello 2: l'altezza massima

Una palla, un sasso o una freccia lanciati verso l'alto da $2{,}0$ a $30\,\text{m/s}$; risultato da $0{,}20\,\text{m}$ in
su.

- "Una palla viene lanciata verso l'alto a $6{,}6\,\text{m/s}$. Di quanto sale sopra il punto di lancio, se la
  resistenza dell'aria è trascurabile?" Risposta $2{,}2\,\text{m}$; distrattori $4{,}4\,\text{m}$ ($v_0^2/g$),
  $0{,}34\,\text{m}$ ($v_0/(2g)$), $22\,\text{m}$ ($v_0^2/2$, senza $g$).

Circa 250 esercizi diversi.

## Livello 3: da un punto all'altro della pista

$h_A$ da $5{,}0$ a $60\,\text{m}$, $h_B$ da $1{,}1\,\text{m}$ con un dislivello di almeno $3\,\text{m}$, $v_A$ da $1{,}1$ a
$15\,\text{m/s}$, con $v_A^2$ almeno un quarto di $2 g (h_A - h_B)$: altrimenti dimenticare $v_A$ cambierebbe poco la
risposta, e i distrattori verrebbero scartati.

- "Un carrello delle montagne russe passa per il punto $A$, alto $7{,}5\,\text{m}$, alla velocità di
  $9{,}5\,\text{m/s}$. Con che velocità passa per il punto $B$, alto $3{,}5\,\text{m}$, se gli attriti sono
  trascurabili?" Risposta $13\,\text{m/s}$; distrattori $8{,}9\,\text{m/s}$ ($\sqrt{2 g \Delta h}$, $v_A$ dimenticata),
  $18\,\text{m/s}$ ($v_A + \sqrt{2 g \Delta h}$, le velocità sommate: l'avviso della lezione), $15\,\text{m/s}$
  ($\sqrt{v_A^2 + 2 g h_A}$, l'altezza di $A$ al posto del dislivello).

## Livello 4: la molla che lancia un blocco

Costante da $101$ a $999\,\text{N/m}$, compressione da $1{,}1$ a $25\,\text{cm}$, massa da $0{,}11$ a $9{,}9\,\text{kg}$;
velocità tra $0{,}3$ e $30\,\text{m/s}$.

- "Una molla con costante elastica $721\,\text{N/m}$, compressa di $18\,\text{cm}$, lancia un blocco di
  $7{,}5\,\text{kg}$ su un piano orizzontale liscio. Con che velocità parte il blocco?" Risposta $1{,}8\,\text{m/s}$;
  distrattori $1{,}2$ e $2{,}5\,\text{m/s}$ (il mezzo da una parte sola, $v/\sqrt2$ e $v\sqrt2$), $17\,\text{m/s}$
  ($x k / m$, senza radice).

## Livello 5: la molla e la salita

Gli stessi dati, con il blocco che sale su una rampa liscia; altezza in centimetri, tra $1{,}1$ e $99$.

- "Una molla con costante elastica $721\,\text{N/m}$, compressa di $18\,\text{cm}$, lancia un blocco di
  $7{,}5\,\text{kg}$ su un piano liscio, che poi sale in una rampa liscia. Fino a che altezza, in centimetri, sale il
  blocco?" Risposta $16\,\text{cm}$; distrattori $32\,\text{cm}$ (senza il mezzo), $88\,\text{cm}$ ($k x / (2 m g)$, senza
  il quadrato), $1{,}5 \cdot 10^2\,\text{cm}$ (senza $g$: fuori intervallo, sostituito dalla scorta, $19\,\text{cm}$).

## Esercizi da evitare

- Velocità o altezze che a due cifre andrebbero in notazione scientifica.
- Un dislivello di pochi metri con una $v_A$ grande: la risposta sarebbe quasi $v_A$ (almeno $3\,\text{m}$ di dislivello).

## Verifica

`energia.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con $g = 49/5$ e radici esatte
(SymPy), confronta la risposta e il formato delle opzioni; al livello 3 controlla che la scena abbia le altezze e la
velocità del testo, e negli altri livelli che non ci sia una scena.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 65 px su 252).

### Errori piantati

Su 200 esercizi: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate e un numero della
scena cambiato (40 su 40) bocciati tutti; una cifra dei dati cambiata bocciata 164 volte su 200. Le 36 che passano non
sono errori: l'ultima cifra della costante elastica (tre cifre) o un'altezza cambiata di un'unità al livello 1, che sotto
radice sposta la velocità di meno di mezza unità della seconda cifra ($18 \to 19\,\text{m}$ danno tutti e due
$19\,\text{m/s}$).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 309 (311), livello 2 249 (256), livello 3 1000 (998), livello 4 1000 (1000), livello 5
1000 (1000).

## Domande per la revisione

- Il livello 5 chiede l'altezza in centimetri per tenere due cifre significative senza notazione scientifica: va bene,
  o meglio in metri ($0{,}16\,\text{m}$)?
- Serve un livello sul pendolo con la lunghezza del filo e l'angolo ($h = L - L\cos\theta$), che la lezione mette solo in
  una nota?
