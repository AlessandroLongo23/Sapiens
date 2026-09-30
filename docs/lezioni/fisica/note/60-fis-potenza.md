# Note: La potenza

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 17, 30 settembre 2026). Conti rifatti in Python:
$15 \cdot 9{,}8 \cdot 1{,}2 = 176{,}4$ J, $88{,}2$ W e $17{,}64$ W; $60 \cdot 9{,}8 \cdot 3{,}0 = 1764$ J, $441$ W;
$72 / 3{,}6 = 20$ m/s, $600 \cdot 20 = 12\,000$ W, $600 \cdot 72 = 43\,200$; $500 \cdot 9{,}8 = 4900$ N,
$4900 \cdot 0{,}40 = 1960$ W; $2{,}0 \cdot 0{,}75 = 1{,}5$ kWh $= 5{,}4 \cdot 10^6$ J, $1{,}5 \cdot 0{,}25 = 0{,}375$
euro; $75 \cdot 9{,}80665 = 735{,}49875$ W, $100$ CV $= 73{,}5$ kW; flashcard $600/3 = 200$ W, $50 \cdot 2 = 100$ W,
$10\,\text{W} \cdot 100\,\text{h} = 1$ kWh. `check.mts` passa.

## Struttura ed esempi

Lavoro diviso tempo ($P = W/\Delta t$, il watt, kW e MW, le formule inverse; avviso sulle due grandezze con la lettera
$P$ e sul watt W e il lavoro $W$; esempio 1, la stessa cassa sollevata in tempi diversi; esempio 2, le scale di corsa);
potenza e velocità ($P = F\,v$ ricavata da $W = F\,v\,\Delta t$, la salita ripida, figura dell'auto con forza motrice,
forza resistente e velocità; esempio 3, l'auto in autostrada con i km/h; avviso sulle unità; esempio 4, la gru; nota con
$P = F\,v\cos\alpha$); il kilowattora ($1\,\text{kWh} = 3{,}6 \cdot 10^6$ J, l'energia in bolletta, avviso kW e kWh,
esempio 5 con il costo); il cavallo vapore come nota finale.

## Scelte

- Il peso si scrive $m g$ in tutta la lezione, come dicono le notazioni del secondo anno, e un avviso lo spiega.
- L'energia compare qui per la prima volta come "si misura in joule come il lavoro", con il rimando alla lezione 61 che
  la definisce: il kilowattora serve già in questa lezione, come chiede la scaletta.
- A velocità costante la forza del motore bilancia le forze resistenti per il primo principio (rimando alla lezione dei
  principi): è l'unico uso della dinamica.
- Niente rendimento: non era nella scaletta, e l'Amaldi lo mette forse con le macchine termiche (da verificare).
- Il prezzo di $0{,}25$ euro al kilowattora è detto come esempio, non come dato vero.
- Il cavallo vapore metrico come $75$ chilogrammi-peso per un metro al secondo, $735{,}49875$ W, e l'horsepower di circa
  $746$ W: valori noti, ma da verificare con una fonte citabile (per esempio la brochure del SI del BIPM, che elenca le
  unità fuori dal sistema).

## Figure

Una TikZ, `auto-forza-velocita-potenza` (un blocco che fa da auto, $\vec F$ e $\vec F_r$ di $1{,}8$ cm, uguali, e
$\vec v$ sopra), guardata in chiaro e in scuro. Niente interattive: non ho trovato una figura che valesse davvero
(due persone che sollevano la stessa cassa in tempi diversi si capiscono dall'esempio). Una possibile: un'auto che sale
salite di pendenza diversa a potenza fissa, con la velocità che cala; la lascio come idea.

## Esercizi

Generatore `fis-potenza`, cinque livelli (specifica in `specs/exercises/fis-potenza.md`): Lavoro e tempo, Sollevare un
carico, Potenza e velocità, La velocità in km/h, Il kilowattora. Niente scene.

## Domande per Andrea

- $P$ per la potenza e $m g$ per il peso quando compaiono insieme: va bene, o si preferisce $F_P$ per il peso come fanno
  alcuni libri?
- Il kilowattora e il cavallo vapore: bastano come li dice la lezione (il CV solo come curiosità)?
- $P = F\,v\cos\alpha$ in una nota: serve, o si tiene solo il caso della forza parallela alla velocità?
- Il rendimento ($\eta = P_{utile}/P_{assorbita}$) va in questa lezione o altrove?
