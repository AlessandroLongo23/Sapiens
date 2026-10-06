# Il momento angolare

Generatore: `fis-momento-angolare-def` (`src/lib/exercises/v2/generators/fis-momento-angolare-def.ts`, con
`src/lib/exercises/v2/fis-momento-angolare.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_momento_angolare_def.py` (con `_fis_momento_angolare.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/90-fis-momento-angolare-def.md`. Percorso nel database:
`high_school/physics/fis-momento-angolare/fis-momento-angolare-def`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Una particella in moto circolare
2. Con l'angolo tra posizione e velocità
3. Un corpo rigido che ruota
4. Il momento angolare dalla forma del corpo
5. Il momento che fa accelerare
6. Il tempo di frenata

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($5{,}9\,\text{kg}\cdot\text{m}^2/\text{s}$, $2{,}9\,\text{N}\cdot\text{m}$,
$3{,}4\,\text{s}$). Dati con due cifre significative senza zeri finali ambigui. Risultati a due cifre significative, mai a
meno di $10^{-6}$ da un confine di arrotondamento, mai da $100$ in su e mai un intero di due cifre che finisce per zero.
Nessun distrattore a meno dell'8% della risposta.

## Regole comuni

- Formule della lezione: $L = m\,v\,r$ nel moto circolare; $L = r\,m\,v\sin\varphi$; $L = I\,\omega$; $I = c\,m r^2$ con
  $c = 1$, $\tfrac12$, $\tfrac25$, $\tfrac23$ (anello sottile, cilindro pieno, sfera piena, sfera cava sottile);
  $M = \Delta L/\Delta t$.
- Scena `particella-polo` (nuova, `scenes/ParticellaPolo.tsx`) al livello 2: il polo, il vettore $\vec r$ con la sua
  lunghezza, la velocità con il suo modulo e l'angolo tra i due. Mai il momento angolare.

## Livello 1: una particella in moto circolare

Un sasso, una pallina o un modellino legati a un filo: massa da $0{,}11$ a $9{,}9\,\text{kg}$, raggio da $0{,}11$ a
$9{,}9\,\text{m}$, velocità da $1{,}1$ a $30\,\text{m/s}$; risultato da $0{,}1\,\text{kg}\cdot\text{m}^2/\text{s}$ in su.

- "Un sasso legato a una corda, di massa $1{,}1\,\text{kg}$, percorre una circonferenza di raggio $0{,}54\,\text{m}$ alla
  velocità di $9{,}9\,\text{m/s}$. Quanto vale il suo momento angolare rispetto al centro?" Risposta
  $5{,}9\,\text{kg}\cdot\text{m}^2/\text{s}$; distrattori $3{,}2$ ($m v r^2$), $29$ ($\tfrac12 m v^2 r$, l'energia per il
  raggio), e $m v/r = 20$, scartato per lo zero finale e sostituito da una scorta ($7{,}4$).
- "…massa $0{,}42\,\text{kg}$, raggio $2{,}8\,\text{m}$, velocità $21\,\text{m/s}$." Risposta
  $25\,\text{kg}\cdot\text{m}^2/\text{s}$; distrattori $69$, $19$, $31$.

## Livello 2: con l'angolo tra posizione e velocità

In più: l'angolo $\varphi$ tra $\vec r$ e $\vec v$, da $20^\circ$ a $70^\circ$ a passi di $5^\circ$ (senza $45^\circ$, dove seno
e coseno coincidono). Con la scena.

- "Una particella di massa $1{,}1\,\text{kg}$ si muove a $9{,}9\,\text{m/s}$. In un certo istante si trova a
  $0{,}54\,\text{m}$ dal polo $O$, e la sua velocità forma un angolo di $25^\circ$ con il vettore $\vec r$ che va da $O$ alla
  particella. Quanto vale il suo momento angolare rispetto a $O$?" Risposta $2{,}5\,\text{kg}\cdot\text{m}^2/\text{s}$;
  distrattori $5{,}3$ (coseno al posto del seno), $5{,}9$ (senza il seno, l'avviso della lezione), $14$ (diviso per il
  seno).
- "…$0{,}48\,\text{kg}$, $9{,}7\,\text{m/s}$, $0{,}92\,\text{m}$, $20^\circ$." Risposta $1{,}5$; distrattori $4{,}0$, $4{,}3$, $13$.

## Livello 3: un corpo rigido che ruota

In più: il corpo esteso, $L = I\omega$. $I$ da $0{,}11$ a $9{,}9\,\text{kg}\cdot\text{m}^2$, $\omega$ da $1{,}1$ a
$30\,\text{rad/s}$.

- "Una ruota ha momento d'inerzia $1{,}1\,\text{kg}\cdot\text{m}^2$ e ruota a $9{,}9\,\text{rad/s}$. Quanto vale il suo momento
  angolare?" Risposta $11\,\text{kg}\cdot\text{m}^2/\text{s}$; distrattori $54$ ($\tfrac12 I\omega^2$, l'energia: l'avviso
  della lezione), $9{,}0$ ($\omega/I$), e $I\omega^2$ fuori intervallo, sostituito da una scorta ($14$).
- "…$3{,}9\,\text{kg}\cdot\text{m}^2$ e $5{,}8\,\text{rad/s}$." Risposta $23$; distrattori $66$, $1{,}5$, $28$.

## Livello 4: il momento angolare dalla forma del corpo

In più: il momento d'inerzia dalla forma. Massa da $0{,}11$ a $9{,}9\,\text{kg}$, raggio in centimetri da $11$ a $45$,
$\omega$ da $1{,}1$ a $99\,\text{rad/s}$; risultato da $0{,}1$ in su. Ogni forma tra il 12% e il 40% dei campioni.

- "Una sfera piena di massa $3{,}5\,\text{kg}$ e raggio $12\,\text{cm}$ ruota intorno al suo asse a $25\,\text{rad/s}$. Quanto
  vale il suo momento angolare?" $I = \tfrac25 \cdot 3{,}5 \cdot 0{,}12^2 = 0{,}0202\,\text{kg}\cdot\text{m}^2$, risposta
  $0{,}50\,\text{kg}\cdot\text{m}^2/\text{s}$; distrattori $1{,}3$ ($c$ dimenticato), $4{,}2$ ($c\,m\,r\,\omega$, senza il
  quadrato del raggio), $6{,}3$ ($\tfrac12 I\omega^2$).

## Livello 5: il momento che fa accelerare

In più: la legge $M = \Delta L/\Delta t$. $I$ da $0{,}11$ a $9{,}9\,\text{kg}\cdot\text{m}^2$, $\omega_1$ da $1{,}1$ a $30$ e
$\omega_2$ fino a $60\,\text{rad/s}$ con $\omega_2 \ge 1{,}5\,\omega_1$, $\Delta t$ da $1{,}1$ a $30\,\text{s}$; risultato da
$0{,}1\,\text{N}\cdot\text{m}$ in su.

- "Un motore porta un volano con momento d'inerzia $0{,}24\,\text{kg}\cdot\text{m}^2$ da $1{,}6\,\text{rad/s}$ a
  $7{,}9\,\text{rad/s}$ in $2{,}7\,\text{s}$. Quanto vale il momento medio applicato dal motore?" Risposta
  $0{,}56\,\text{N}\cdot\text{m}$; distrattori $0{,}70$ ($I\omega_2/\Delta t$, la velocità iniziale dimenticata), $4{,}1$
  (moltiplicato per $\Delta t$), $2{,}3$ ($\Delta\omega/\Delta t$, l'accelerazione angolare senza $I$).
- "…$2{,}8\,\text{kg}\cdot\text{m}^2$ da $8{,}5$ a $23\,\text{rad/s}$ in $14\,\text{s}$." Risposta $2{,}9$; distrattori $4{,}6$,
  $1{,}0$, $6{,}3$.

## Livello 6: il tempo di frenata

In più: la legge rovesciata e il momento contrario alla rotazione. $I$ da $0{,}11$ a $9{,}9\,\text{kg}\cdot\text{m}^2$,
$\omega$ da $1{,}1$ a $60\,\text{rad/s}$, momento frenante da $0{,}11$ a $9{,}9\,\text{N}\cdot\text{m}$; tempo da $0{,}5\,\text{s}$
in su.

- "Una ruota con momento d'inerzia $1{,}1\,\text{kg}\cdot\text{m}^2$ gira a $36\,\text{rad/s}$. Un freno le applica un momento
  costante di $7{,}5\,\text{N}\cdot\text{m}$, contrario alla rotazione. In quanto tempo la ruota si ferma?" Risposta
  $5{,}3\,\text{s}$; distrattori $0{,}19\,\text{s}$ (formula rovesciata, $M/(I\omega)$), $4{,}8\,\text{s}$ ($\omega/M$, senza
  $I$), $95\,\text{s}$ ($\tfrac12 I\omega^2/M$, l'energia al posto del momento angolare).
- "…$3{,}9\,\text{kg}\cdot\text{m}^2$, $5{,}8\,\text{rad/s}$, $6{,}7\,\text{N}\cdot\text{m}$." Risposta $3{,}4\,\text{s}$;
  distrattori $0{,}30$, $0{,}87$, $9{,}8$.

## Esercizi da evitare

- Angoli ottusi al livello 2: lo studente non ha ancora il seno di un angolo ottuso.
- Risultati in notazione scientifica o con uno zero finale ambiguo.
- Al livello 5 una $\omega_2$ vicina a $\omega_1$: dimenticare $\omega_1$ cambierebbe poco.

## Verifica

`fis_momento_angolare_def.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola in modo esatto
(SymPy, seno compreso), confronta la risposta e il formato delle opzioni; al livello 2 controlla che la scena abbia
l'angolo e le scritte del testo, negli altri che non ci sia una scena.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli intervalli.
`review.mts` e `width.mts` con codice 0 (opzioni al più 119 px su 252).

### Errori piantati

Su 200 esercizi del seed 1: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate, un
dato del testo cambiato nell'ultima cifra e una scritta della scena cambiata (33 su 33) bocciati tutti. Il dato cambiato
viene preso anche quando a due cifre la risposta non cambia, perché il controllo confronta i numeri del testo con
`params`.
