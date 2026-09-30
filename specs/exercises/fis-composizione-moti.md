# La composizione dei moti

Generatore: `fis-composizione-moti` (`src/lib/exercises/v2/generators/fis-composizione-moti.ts`, con
`src/lib/exercises/v2/fis-moti-piano.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_composizione_moti.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/46-fis-composizione-moti.md`. Percorso nel database:
`high_school/physics/fis-moti-piano/fis-composizione-moti`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Velocità nella stessa direzione
2. Con la corrente e contro
3. Velocità perpendicolari
4. Attraversare il fiume
5. La prua controcorrente

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($2{,}0\,\text{m/s}$, $30\,\text{s}$, $36\,\text{m}$) o in gradi interi
($37^\circ$). Dati con due cifre significative senza zeri ambigui; risultati a due cifre significative (angoli al grado),
mai vicini a un confine di arrotondamento. Al livello 1 i dati hanno un decimale e il risultato, una somma o una
differenza, è esatto tra $1{,}0$ e $9{,}9\,\text{m/s}$.

## Regole comuni

- Formule della lezione: velocità sulla stessa retta che si sommano o si sottraggono; $t = d/(v_b \pm v_c)$; con la
  prua perpendicolare $v = \sqrt{v_b^2 + v_c^2}$, $\tan\beta = v_c/v_b$, $t = d/v_b$, $x = v_c\,t$; con la prua
  controcorrente $\sin\alpha = v_c/v_b$ e $t = d/\sqrt{v_b^2 - v_c^2}$.
- Scena `fiume-barca` (nuova, `src/components/content/exercises/scenes/FiumeBarca.tsx`) dal livello 3: il fiume visto
  dall'alto con la corrente verso destra, la barca in $A$, la velocità della barca e quella della corrente in scala tra
  loro, con i valori scritti; la larghezza scritta, non in scala. Niente velocità risultante nel problema: la soluzione
  la aggiunge, in arancione, con la traiettoria tratteggiata. Al livello 5 l'angolo della prua non è un dato: il
  problema lo disegna a $30^\circ$ con la scritta $\alpha$, e la soluzione all'angolo vero.

## Livello 1: velocità nella stessa direzione

Metà: un marinaio cammina sul ponte di un traghetto ($1{,}1$-$2{,}0\,\text{m/s}$, il traghetto $3{,}0$-$8{,}5\,\text{m/s}$);
metà: una barca a motore su un fiume ($2{,}0$-$8{,}0\,\text{m/s}$, la corrente $1{,}1$-$3{,}0\,\text{m/s}$, mai più veloce
della barca). Stesso verso o versi opposti, metà ciascuno.

- "Una barca a motore va a $3{,}8\,\text{m/s}$ rispetto all'acqua su un fiume la cui corrente va a $2{,}4\,\text{m/s}$. La
  barca va verso valle, nel verso della corrente. Quanto vale la sua velocità rispetto alla riva?" Risposta
  $6{,}2\,\text{m/s}$; distrattori la differenza, e ciascuna delle due velocità da sola.

## Livello 2: con la corrente e contro

Canoa $2{,}0$-$6{,}0\,\text{m/s}$, corrente $0{,}50$-$2{,}0\,\text{m/s}$ e più lenta della canoa di almeno
$0{,}8\,\text{m/s}$, tratto da $11$ a $99\,\text{m}$, tempo di almeno $2\,\text{s}$. Verso valle o verso monte, metà ciascuno.

- "Una canoa va a $4{,}1\,\text{m/s}$ rispetto all'acqua, su un fiume la cui corrente va a $0{,}74\,\text{m/s}$. Quanto
  tempo impiega a percorrere $52\,\text{m}$ lungo il fiume verso valle?" $v = 4{,}84\,\text{m/s}$, risposta
  $11\,\text{s}$; distrattori $d/v_b$ (la corrente dimenticata), il segno sbagliato, $d/v_c$.

## Livello 3: velocità perpendicolari

Barca $1{,}1$-$6{,}0\,\text{m/s}$, corrente $0{,}50$-$4{,}0\,\text{m/s}$, prua perpendicolare alla riva. Metà la velocità
rispetto alla riva, metà l'angolo della traiettoria con la perpendicolare alla riva (tra $8^\circ$ e $82^\circ$).

- "Una barca va a $1{,}6\,\text{m/s}$ rispetto all'acqua, con la prua perpendicolare alla riva, su un fiume la cui corrente
  va a $1{,}2\,\text{m/s}$. Quanto vale la sua velocità rispetto alla riva?" Risposta $2{,}0\,\text{m/s}$; distrattori
  $2{,}8\,\text{m/s}$ (i moduli sommati), $\sqrt{v_b^2 - v_c^2}$, $v_b$.
- Per l'angolo i distrattori sono il complementare (l'angolo con la riva) e il seno al posto della tangente.

## Livello 4: attraversare il fiume

Fiume largo da $11$ a $99\,\text{m}$, corrente $0{,}50$-$3{,}0\,\text{m/s}$, barca $1{,}1$-$6{,}0\,\text{m/s}$ con la prua
perpendicolare. Metà il tempo di attraversamento $d/v_b$, metà lo spostamento a valle $v_c\,d/v_b$.

- "Un fiume è largo $73\,\text{m}$ e la corrente va a $0{,}71\,\text{m/s}$. Una barca che va a $4{,}2\,\text{m/s}$ rispetto
  all'acqua parte con la prua perpendicolare alla riva. Quanto tempo impiega ad arrivare sull'altra riva?" Risposta
  $17\,\text{s}$; distrattori $d/v$ con la velocità risultante (l'avviso della lezione), $d/v_c$, $d/(v_b + v_c)$.
- Per lo spostamento a valle i distrattori sono $v_b\,d/v_c$, il percorso lungo la diagonale $v\,d/v_b$, $v_c\,d/v$.

## Livello 5: la prua controcorrente

Corrente tra il $15\%$ e il $90\%$ della velocità della barca; fiume da $11$ a $99\,\text{m}$. Metà l'angolo della prua
($\sin\alpha = v_c/v_b$), metà il tempo di attraversamento ($d/\sqrt{v_b^2 - v_c^2}$).

- "Un fiume è largo $52\,\text{m}$ e la corrente va a $0{,}86\,\text{m/s}$. Una barca va a $3{,}7\,\text{m/s}$ rispetto
  all'acqua e vuole arrivare nel punto proprio di fronte alla partenza. Di quale angolo deve inclinare la prua
  controcorrente, rispetto alla perpendicolare alla riva?" Risposta $13^\circ$; distrattori la tangente al posto del
  seno, il coseno (l'angolo con la riva).
- Per il tempo i distrattori sono $d/v_b$ (la prua dritta), $d/\sqrt{v_b^2 + v_c^2}$, $d/(v_b - v_c)$.

## Esercizi da evitare

- Una corrente più veloce della barca quando la barca deve risalire o arrivare di fronte.
- Angoli quasi nulli o quasi retti; tempi sotto $2\,\text{s}$ al livello 2.

## Verifica

`fis_composizione_moti.py` rilegge il testo, controlla cifre significative e intervalli, calcola con SymPy esatto,
arrotonda, confronta la risposta e la forma delle opzioni, e controlla la scena (velocità e larghezza del testo, la
risultante solo nella soluzione, $\alpha$ disegnato a $30^\circ$ al livello 5).

## Domande per la revisione

- Al livello 3 l'angolo si chiede rispetto alla perpendicolare alla riva, come nella lezione; alcuni libri lo danno
  rispetto alla riva. Va bene?
