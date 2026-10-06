# L'attrito viscoso e la velocità limite

Generatore: `fis-viscosita` (`src/lib/exercises/v2/generators/fis-viscosita.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_viscosita.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/101-fis-viscosita.md`
(note in `docs/lezioni/fisica/note/101-fis-viscosita.md`). Parti comuni: `src/lib/exercises/v2/fis-fluidi-moto.ts` e
`scripts/exercises/checkers/_fis_fluidi_moto.py`.

Cinque livelli nell'ordine della lezione: la forza di Stokes, la velocità limite dalla massa, la velocità limite di una
gocciolina dal raggio, la velocità limite con la spinta di Archimede, la viscosità ricavata dalla velocità limite.

## Nomi dei livelli

1. La forza di Stokes
2. La velocità limite dalla massa
3. La gocciolina nella nebbia
4. La velocità limite con Archimede
5. La viscosità dalla velocità limite

## Regole comuni

- $g = 9{,}8\,\text{m/s}^2$. Liquidi, con viscosità e densità sempre scritte nel testo dove servono: glicerina
  ($1{,}5\,\text{Pa} \cdot \text{s}$, $1260\,\text{kg/m}^3$), miele ($10\,\text{Pa} \cdot \text{s}$, $1400\,\text{kg/m}^3$), olio
  di ricino ($0{,}99\,\text{Pa} \cdot \text{s}$, $960\,\text{kg/m}^3$); aria $1{,}8 \cdot 10^{-5}\,\text{Pa} \cdot \text{s}$.
  Sferette: acciaio $7800$, alluminio $2700$, vetro $2500\,\text{kg/m}^3$.
- Raggi in millimetri o micrometri, velocità in cm/s o mm/s, masse in grammi: le conversioni fanno parte dell'esercizio.
- Dati con due cifre significative senza zeri ambigui (le densità e le viscosità tabulate sono quelle scritte sopra).
- Risposta a scelta multipla, due cifre significative, l'unità nell'opzione ($\text{mN}$, $\text{cm/s}$, $\text{mm/s}$,
  $\text{Pa} \cdot \text{s}$), scelta in modo da non chiedere la notazione scientifica.
- Si scartano i valori esatti a meno di $0{,}1$ unità dell'ultima cifra dal punto di arrotondamento e le risposte che
  finiscono con uno zero ambiguo.
- Distrattori dagli errori della lezione, scartati se entro l'8% dalla risposta, poi la risposta moltiplicata per
  $1{,}25$, $0{,}75$, $1{,}5$, $0{,}6$, $2$, $0{,}4$.
- Nessuna scena: la figura sarebbe una sferetta in un liquido, uguale per tutti i dati.

## Livello 1: la forza di Stokes

$F_v = 6\pi\,\eta\,r\,v$ in millinewton, di almeno $0{,}1\,\text{mN}$; raggio da $0{,}5$ a $5\,\text{mm}$, velocità da $0{,}5$
a $9\,\text{cm/s}$, un liquido a caso (un terzo ciascuno). Distrattori: il diametro al posto del raggio, $\pi$
dimenticato, il 6 dimenticato.

- "Una sferetta di raggio $2{,}2\,\text{mm}$ scende nella glicerina ($\eta = 1{,}5\,\text{Pa} \cdot \text{s}$) alla velocità di
  $3{,}4\,\text{cm/s}$. Quanto vale la forza di attrito viscoso sulla sferetta?" Risposta $2{,}1\,\text{mN}$; distrattori
  $4{,}2\,\text{mN}$, $0{,}67\,\text{mN}$, $0{,}35\,\text{mN}$.
- "… $1{,}1\,\text{mm}$ … nel miele ($\eta = 10\,\text{Pa} \cdot \text{s}$) … $0{,}80\,\text{cm/s}$" Risposta $1{,}7\,\text{mN}$.

## Livello 2: la velocità limite dalla massa

$v_l = \dfrac{m\,g}{6\pi\,\eta\,r}$ in cm/s, con la spinta di Archimede trascurata (lo dice il testo). Sferetta
d'acciaio di raggio da $1{,}1$ a $4\,\text{mm}$; la massa in grammi è quella di una sfera d'acciaio di quel raggio,
arrotondata a due cifre. Distrattori: $g$ dimenticato, il diametro al posto del raggio, $\pi$ dimenticato.

- "Una sferetta d'acciaio di massa $0{,}30\,\text{g}$ e raggio $2{,}1\,\text{mm}$ cade nel miele
  ($\eta = 10\,\text{Pa} \cdot \text{s}$). Trascurando la spinta di Archimede, quanto vale la sua velocità limite?" Risposta
  $0{,}74\,\text{cm/s}$; distrattori $0{,}076\,\text{cm/s}$, $0{,}37\,\text{cm/s}$, $2{,}3\,\text{cm/s}$.

## Livello 3: la gocciolina nella nebbia

Gocciolina d'acqua di raggio da $3$ a $28\,\mu\text{m}$ nell'aria: $v_l = \dfrac{2\,r^2\,g\,d_s}{9\,\eta}$ in mm/s.
Distrattori: il diametro al posto del raggio ($\times 4$), il fattore $2/9$ rovesciato, $g$ dimenticato.

- "Una gocciolina d'acqua ($1000\,\text{kg/m}^3$) di raggio $12\,\mu\text{m}$ scende nell'aria, che ha viscosità
  $1{,}8 \cdot 10^{-5}\,\text{Pa} \cdot \text{s}$. La spinta di Archimede è trascurabile. Quanto vale la velocità limite
  della gocciolina?" Risposta $17\,\text{mm/s}$; distrattori $70\,\text{mm/s}$, $1{,}8\,\text{mm/s}$.
- "… $5{,}5\,\mu\text{m}$ …" Risposta $3{,}7\,\text{mm/s}$.

## Livello 4: la velocità limite con Archimede

$v_l = \dfrac{2\,r^2\,g\,(d_s - d_{fl})}{9\,\eta}$ in mm/s, di almeno $0{,}5\,\text{mm/s}$; sferetta di acciaio, alluminio
o vetro di raggio da $0{,}5$ a $3\,\text{mm}$ in uno dei tre liquidi. Distrattori: la spinta di Archimede dimenticata
($d_s$ da sola), le densità sommate, il diametro al posto del raggio.

- "Una sferetta d'alluminio ($2700\,\text{kg/m}^3$) di raggio $1{,}4\,\text{mm}$ cade nella glicerina, che ha densità
  $1260\,\text{kg/m}^3$ e viscosità $1{,}5\,\text{Pa} \cdot \text{s}$. Quanto vale la sua velocità limite, tenendo conto
  della spinta di Archimede?" Risposta $4{,}1\,\text{mm/s}$; distrattori $7{,}7\,\text{mm/s}$, $11\,\text{mm/s}$,
  $16\,\text{mm/s}$.
- "Una sferetta d'acciaio … $2{,}4\,\text{mm}$ … nel miele …" Risposta $8{,}0\,\text{mm/s}$.

## Livello 5: la viscosità dalla velocità limite

Viscosimetro a caduta: sferetta d'acciaio di raggio da $0{,}5$ a $2{,}5\,\text{mm}$ in un olio di densità $880$, $920$ o
$960\,\text{kg/m}^3$, velocità costante da $1{,}1$ a $99\,\text{mm/s}$:
$\eta = \dfrac{2\,r^2\,g\,(d_s - d_{fl})}{9\,v_l}$, tra $0{,}1$ e $9{,}9\,\text{Pa} \cdot \text{s}$. Distrattori: la spinta di
Archimede dimenticata, il diametro al posto del raggio, $g$ dimenticato.

- "In un cilindro pieno di un olio di densità $920\,\text{kg/m}^3$ una sferetta d'acciaio ($7800\,\text{kg/m}^3$) di raggio
  $1{,}2\,\text{mm}$ scende alla velocità costante di $45\,\text{mm/s}$. Quanto vale la viscosità dell'olio?" Risposta
  $0{,}48\,\text{Pa} \cdot \text{s}$; distrattori $0{,}54\,\text{Pa} \cdot \text{s}$, $1{,}9\,\text{Pa} \cdot \text{s}$,
  $0{,}049\,\text{Pa} \cdot \text{s}$.

## Da evitare

- Sferette grandi o veloci in liquidi poco viscosi (acqua, olio d'oliva), dove la legge di Stokes non vale: per questo
  i liquidi sono solo glicerina, miele e olio di ricino, e nell'aria ci sono solo goccioline di pochi micrometri.
- Domande sul moto laminare e turbolento, che nella lezione sono qualitativi, e sulla legge esponenziale $v(t)$, che è
  solo enunciata: restano alle flashcard.
- Esempi della lezione senza esercizio: la forza tra due lastre ($F = \eta S v / L$).
