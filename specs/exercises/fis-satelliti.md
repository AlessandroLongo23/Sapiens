# Il moto dei satelliti

Generatore: `fis-satelliti` (`src/lib/exercises/v2/generators/fis-satelliti.ts`, con
`src/lib/exercises/v2/fis-campo-orbite.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_satelliti.py` (con `_fis_campo_orbite.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/96-fis-satelliti.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-satelliti`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La velocità orbitale dal raggio
2. La velocità orbitale dalla quota
3. Il periodo dell'orbita
4. Due orbite a confronto
5. La massa del corpo centrale
6. Il raggio dell'orbita dal periodo

## Tipi di risposta e cifre significative

Come in `fis-campo-gravitazionale.md`: scelta multipla con l'unità nell'opzione, dati e risultati con tre cifre
significative, notazione scientifica fuori dall'intervallo $0{,}1$-$1000$, $G = 6{,}67 \cdot 10^{-11}$, $\pi$ con
tutte le cifre della calcolatrice. Velocità in $\text{m/s}$, periodi in secondi.

## Regole comuni

- Formule della lezione: $v = \sqrt{G M / r}$ con $r$ dal centro, $r = R + h$; $T = 2\pi\sqrt{r^3 / (G M)}$;
  $T^2 / r^3 = 4\pi^2 / (G M)$, quindi $M = 4\pi^2 r^3 / (G T^2)$ e $r = \sqrt[3]{G M T^2 / (4\pi^2)}$.
- La massa del satellite non compare mai: non serve.
- Corpo centrale con massa tra $10^{22}$ e $10^{27}\,\text{kg}$. Dove il testo dà il raggio dell'orbita (livelli 1, 3,
  5, 6) l'orbita sta fuori dal corpo: tra $1{,}3$ e $16$ volte il raggio di una sfera di quella massa con densità
  $3000\,\text{kg/m}^3$. Dove dà raggio e quota (livello 2) il corpo ha densità tra $1000$ e $6000\,\text{kg/m}^3$.
  Nomi dei corpi come nel generatore del campo.
- Distrattori a meno del $3\%$ dalla risposta scartati, e completati con multipli della risposta.
- Scena `orbita-pianeta` solo al livello 2: corpo, orbita circolare tratteggiata in scala, satellite con la velocità
  tangente (senza valore), raggio e quota scritti sotto.

## Livello 1: la velocità orbitale dal raggio

- "Un satellite percorre un'orbita circolare di raggio $1{,}67 \cdot 10^{8}\,\text{m}$ intorno a un pianeta di massa
  $1{,}69 \cdot 10^{25}\,\text{kg}$. Con quale velocità si muove?" Risposta $2{,}60 \cdot 10^{3}\,\text{m/s}$;
  distrattori $6{,}75 \cdot 10^{6}\,\text{m/s}$ ($G M / r$, la radice dimenticata), $0{,}201\,\text{m/s}$ ($r^2$ sotto
  la radice), $3{,}85 \cdot 10^{-4}\,\text{m/s}$ (la frazione rovesciata).
- Con $r = 1{,}66 \cdot 10^{8}\,\text{m}$ e $M = 5{,}77 \cdot 10^{25}\,\text{kg}$: risposta $4{,}82 \cdot
  10^{3}\,\text{m/s}$.

## Livello 2: la velocità orbitale dalla quota

Quota tra $0{,}06$ e $2{,}5$ raggi. La difficoltà nuova è $r = R + h$.

- "Un pianeta extrasolare ha massa $1{,}13 \cdot 10^{26}\,\text{kg}$ e raggio $1{,}86 \cdot 10^{7}\,\text{m}$. Un
  satellite percorre un'orbita circolare a una quota di $2{,}59 \cdot 10^{7}\,\text{m}$ sopra la sua superficie. Con
  quale velocità si muove?" Risposta $1{,}30 \cdot 10^{4}\,\text{m/s}$; distrattori $1{,}71 \cdot 10^{4}$ (la quota
  al posto del raggio dell'orbita), $2{,}01 \cdot 10^{4}$ (la quota ignorata), $1{,}69 \cdot 10^{8}$ (senza radice).
- Con $M = 5{,}77 \cdot 10^{25}\,\text{kg}$, $R = 1{,}52 \cdot 10^{7}\,\text{m}$, $h = 3{,}19 \cdot
  10^{7}\,\text{m}$: risposta $9{,}04 \cdot 10^{3}\,\text{m/s}$.

## Livello 3: il periodo dell'orbita

- Con $r = 1{,}67 \cdot 10^{8}\,\text{m}$ e $M = 1{,}69 \cdot 10^{25}\,\text{kg}$: risposta $4{,}04 \cdot
  10^{5}\,\text{s}$; distrattori $31{,}3\,\text{s}$ ($r^2$ al posto di $r^3$), $9{,}77 \cdot 10^{-5}\,\text{s}$ (la
  frazione rovesciata), $6{,}43 \cdot 10^{4}\,\text{s}$ (senza $2\pi$).
- Con $r = 1{,}66 \cdot 10^{8}\,\text{m}$ e $M = 5{,}77 \cdot 10^{25}\,\text{kg}$: risposta $2{,}17 \cdot
  10^{5}\,\text{s}$.

## Livello 4: due orbite a confronto

Due satelliti dello stesso corpo; il raggio della seconda orbita è $2$, $3$, $4$, $5$ o $9$ volte quello della prima.
Metà (tra il $40\%$ e il $60\%$): data la velocità del primo, tra $10^{3}$ e $10^{5}\,\text{m/s}$, quella del secondo,
$v_1 / \sqrt{n}$. Metà: dato il periodo del primo, tra $10^{3}$ e $10^{5}\,\text{s}$, quello del secondo,
$T_1 \cdot n\sqrt{n}$. Niente costanti.

- "... Il raggio dell'orbita del secondo è 2 volte quello del primo. Il primo si muove a $9{,}47 \cdot
  10^{3}\,\text{m/s}$. Con quale velocità si muove il secondo?" Risposta $6{,}70 \cdot 10^{3}\,\text{m/s}$;
  distrattori $1{,}34 \cdot 10^{4}$ (più lontano, più veloce), $2{,}37 \cdot 10^{3}$ (diviso $n^2$), e $v_1 / n$
  quando dista abbastanza dagli altri.
- "... è 4 volte quello del primo. Il primo fa un giro in $6{,}31 \cdot 10^{4}\,\text{s}$." Risposta $5{,}05 \cdot
  10^{5}\,\text{s}$; distrattori $2{,}52 \cdot 10^{5}$ (proporzionale a $r$), $4{,}04 \cdot 10^{6}$ ($n^3$, la radice
  dimenticata), $1{,}01 \cdot 10^{6}$ ($n^2$).

## Livello 5: la massa del corpo centrale

Il periodo dato è quello dell'orbita, arrotondato a tre cifre: la massa che si ritrova è quella di partenza, a meno
dell'arrotondamento.

- "Un satellite percorre un'orbita circolare di raggio $1{,}67 \cdot 10^{8}\,\text{m}$ intorno a un pianeta, e fa un
  giro in $4{,}04 \cdot 10^{5}\,\text{s}$. Quanto vale la massa del pianeta?" Risposta $1{,}69 \cdot
  10^{25}\,\text{kg}$; distrattori $6{,}82 \cdot 10^{30}$ (il periodo non al quadrato), $1{,}01 \cdot 10^{17}$ ($r^2$),
  $2{,}69 \cdot 10^{24}$ ($2\pi$ al posto di $4\pi^2$).
- Con $r = 1{,}66 \cdot 10^{8}\,\text{m}$ e $T = 2{,}17 \cdot 10^{5}\,\text{s}$: risposta $5{,}75 \cdot
  10^{25}\,\text{kg}$.

## Livello 6: il raggio dell'orbita dal periodo

La difficoltà nuova è la radice cubica.

- "Un satellite deve fare un giro intorno a un pianeta di massa $1{,}69 \cdot 10^{25}\,\text{kg}$ in $4{,}04 \cdot
  10^{5}\,\text{s}$, su un'orbita circolare. Quale deve essere il raggio dell'orbita?" Risposta $1{,}67 \cdot
  10^{8}\,\text{m}$; distrattori $2{,}16 \cdot 10^{12}$ (radice quadrata al posto della cubica), $2{,}26 \cdot 10^{6}$
  (il periodo non al quadrato), $5{,}69 \cdot 10^{8}$ (senza $4\pi^2$).
- Con $M = 5{,}77 \cdot 10^{25}\,\text{kg}$ e $T = 2{,}17 \cdot 10^{5}\,\text{s}$: risposta $1{,}66 \cdot
  10^{8}\,\text{m}$.

## Esercizi da evitare

- Orbite dentro il corpo centrale; corpi impossibili.
- Periodi in ore o giorni da convertire: sarebbe una seconda difficoltà (vedi le domande).

## Verifica

`fis_satelliti.py` rilegge il testo, controlla dati, intervalli, nomi dei corpi e che l'orbita stia fuori dal corpo;
calcola con $G$ razionale esatto e radici e $\pi$ a 50 cifre (mpmath), arrotonda a tre cifre e confronta risposta e
opzioni; al livello 2 controlla la scena, agli altri che non ci sia; al livello 4 le quote dei due casi.

## Domande per la revisione

- I periodi sono sempre in secondi: serve un livello con ore o giorni da convertire?
- Il livello 4 (rapporti) viene prima della massa centrale e del raggio dal periodo: è l'ordine giusto?
- Un livello sul satellite geostazionario della Terra, con i dati veri, avrebbe pochi esercizi diversi: lo si lascia
  alla lezione?
- I distrattori delle formule sbagliate danno a volte numeri assurdi ($10^{-4}\,\text{m/s}$): vanno bene come
  controllo dell'ordine di grandezza, o si riconoscono troppo facilmente?
