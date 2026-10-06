# L'equazione di Bernoulli

Generatore: `fis-bernoulli` (`src/lib/exercises/v2/generators/fis-bernoulli.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_bernoulli.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/99-fis-bernoulli.md`
(note in `docs/lezioni/fisica/note/99-fis-bernoulli.md`). Parti comuni: `src/lib/exercises/v2/fis-fluidi-moto.ts` e
`scripts/exercises/checkers/_fis_fluidi_moto.py`.

Cinque livelli nell'ordine della lezione: il calo di pressione in un tubo orizzontale, la pressione nella strozzatura,
il tubo di sezione costante che sale, la strozzatura con la velocità ricavata dalla continuità, il caso completo con i
tre termini.

## Nomi dei livelli

1. Il calo di pressione nella strozzatura
2. La pressione nella strozzatura
3. Il tubo che sale
4. La strozzatura con i diametri
5. Più in alto e più stretto

## Regole comuni

- Il fluido è sempre acqua, $d = 1000\,\text{kg/m}^3$; $g = 9{,}8\,\text{m/s}^2$.
- $p_1 + \tfrac{1}{2} d\,v_1^2 + d\,g\,h_1 = p_2 + \tfrac{1}{2} d\,v_2^2 + d\,g\,h_2$; la sezione 1 è quella nota e ha
  $h_1 = 0$.
- Pressioni in kilopascal. La pressione data $p_1$ è un intero tra $120$ e $480\,\text{kPa}$ che non finisce per zero.
  Una differenza di pressione (livello 1) ha due cifre significative; una pressione ricavata per differenza (livelli
  2-5) si arrotonda al kilopascal, la posizione dell'addendo meno preciso, come fa la lezione, e deve restare di almeno
  $30\,\text{kPa}$.
- Dati di velocità, diametro e dislivello con due cifre significative senza zeri ambigui.
- Si scartano i valori esatti a meno di $0{,}1$ unità dell'ultima cifra dal punto di arrotondamento e le risposte che
  finiscono con uno zero.
- Scelta multipla con l'unità nell'opzione; distrattori dagli errori della lezione, scartati se entro l'8% dalla
  risposta, poi la risposta moltiplicata per $1{,}25$, $0{,}75$, $1{,}5$, $0{,}6$, $2$, $0{,}4$.
- Scena `tubo-sezioni` ai livelli 3, 4 e 5: il tubo con i due tratti (in salita ai livelli 3 e 5), i dati come
  etichette e l'incognita segnata con "?".

## Livello 1: il calo di pressione nella strozzatura

$p_1 - p_2 = \tfrac{1}{2} d\,(v_2^2 - v_1^2)$, con $v_1$ da $0{,}5$ a $4\,\text{m/s}$ e $v_2$ da $2$ a $12\,\text{m/s}$, almeno
una volta e mezza $v_1$. Distrattori: il quadrato della differenza (l'avviso della lezione), il mezzo dimenticato, i
quadrati sommati.

- "In un tubo orizzontale l'acqua scorre a $2{,}3\,\text{m/s}$ nel tratto largo e a $9{,}1\,\text{m/s}$ in una strozzatura. Di
  quanto è più bassa la pressione nella strozzatura?" Risposta $39\,\text{kPa}$ ($38{,}76$); distrattori $23\,\text{kPa}$,
  $78\,\text{kPa}$, $44\,\text{kPa}$.
- "… $1{,}5\,\text{m/s}$ … $5{,}2\,\text{m/s}$" Risposta $12\,\text{kPa}$ ($12{,}4$).

## Livello 2: la pressione nella strozzatura

$p_2 = p_1 - \tfrac{1}{2} d\,(v_2^2 - v_1^2)$, con un calo di almeno $4\,\text{kPa}$. Distrattori: la pressione che sale
nella strozzatura ($p_1$ più il calo, l'avviso della lezione), il quadrato della differenza, il solo calo.

- "In un tubo orizzontale l'acqua scorre a $1{,}6\,\text{m/s}$ con una pressione di $253\,\text{kPa}$. In una strozzatura la
  velocità sale a $7{,}4\,\text{m/s}$. Quanto vale la pressione nella strozzatura?" Risposta $227\,\text{kPa}$
  ($253 - 26{,}1$); distrattori $279\,\text{kPa}$, $236\,\text{kPa}$, $26\,\text{kPa}$.

## Livello 3: il tubo che sale

Sezione costante, dislivello da $2$ a $25\,\text{m}$: $p_2 = p_1 - d\,g\,h$. Distrattori: la pressione che cresce con la
quota (la quota confusa con la profondità), $g$ dimenticato, il solo termine $d\,g\,h$.

- "Alla base di un palazzo l'acqua scorre in un tubo con una pressione di $427\,\text{kPa}$. Il tubo sale, sempre con la
  stessa sezione, fino a un rubinetto che si trova $3{,}4\,\text{m}$ più in alto. Quanto vale la pressione dell'acqua che
  scorre in quel punto?" Risposta $394\,\text{kPa}$ ($427 - 33{,}3$); distrattori $460\,\text{kPa}$ e $33\,\text{kPa}$; $424\,\text{kPa}$
  ($g$ dimenticato) è entro l'8% dalla risposta e viene scartato.

## Livello 4: la strozzatura con i diametri

Tubo orizzontale, $v_2 = v_1 (D_1/D_2)^2$ con il rapporto dei diametri tra $1{,}3$ e $3$, poi il livello 2. Distrattori: i
diametri non al quadrato, la pressione che sale, il solo calo.

- "In un tubo orizzontale di diametro $4{,}2\,\text{cm}$ l'acqua scorre a $1{,}2\,\text{m/s}$ con una pressione di
  $287\,\text{kPa}$. Più avanti il diametro si riduce a $2{,}1\,\text{cm}$. Quanto vale la pressione nel tratto stretto?"
  Risposta $276\,\text{kPa}$ ($v_2 = 4{,}8\,\text{m/s}$, calo $10{,}8\,\text{kPa}$).

## Livello 5: più in alto e più stretto

I tre termini: $p_2 = p_1 - \tfrac{1}{2} d\,(v_2^2 - v_1^2) - d\,g\,h_2$, rapporto dei diametri tra $1{,}3$ e $2{,}6$,
dislivello da $2$ a $15\,\text{m}$, termine cinetico di almeno $4\,\text{kPa}$. Distrattori: la quota dimenticata, le
velocità dimenticate, la quota sommata.

- "In cantina un tubo di diametro $5{,}2\,\text{cm}$ porta acqua a $1{,}4\,\text{m/s}$ con una pressione di $356\,\text{kPa}$.
  Il tubo sale di $7{,}3\,\text{m}$ e si stringe fino a un diametro di $3{,}1\,\text{cm}$. Quanto vale la pressione
  dell'acqua nel tratto in alto?" Risposta $278\,\text{kPa}$ ($v_2 = 3{,}94\,\text{m/s}$, $356 - 6{,}78 - 71{,}54$).

## Da evitare

- Pressioni finali negative o piccole (sotto $30\,\text{kPa}$): l'acqua lì caviterebbe, e il problema non avrebbe senso.
- Cali di pressione sotto i $4\,\text{kPa}$, che spariscono nell'arrotondamento al kilopascal.
- Esempi della lezione senza esercizio: il vento sul tetto (esempio 4, con l'aria e la forza), lasciato alla lezione
  100, che ha un livello sulla portanza con lo stesso conto.
