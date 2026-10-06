# Momento torcente e dinamica delle rotazioni

Generatore: `fis-dinamica-rotazionale` (`src/lib/exercises/v2/generators/fis-dinamica-rotazionale.ts`, con
`src/lib/exercises/v2/fis-rotazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_dinamica_rotazionale.py` (con `_fis_rotazioni.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/88-fis-dinamica-rotazionale.md`. Percorso nel database:
`high_school/physics/fis-momento-angolare/fis-dinamica-rotazionale`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il secondo principio per le rotazioni
2. Una forza tangente a un disco
3. Una forza obliqua
4. Frenare e avviare una ruota
5. Il secchio e la carrucola con massa
6. La macchina di Atwood con la carrucola pesante

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($\text{rad/s}^2$, $\text{N} \cdot \text{m}$, $\text{rad/s}$,
$\text{m/s}^2$, $\text{N}$). Dati con due cifre significative senza zeri ambigui; $g = 9{,}8\,\text{m/s}^2$. Risultati
a due cifre significative, minori di $100$, mai vicini a un confine di arrotondamento.

## Regole comuni

- Formule della lezione: $M_{tot} = I\,\alpha$; $M = F\,R$ per una forza tangente, $M = r\,F \sin\varphi$ per una
  obliqua; $I = \frac{1}{2} m R^2$ per il disco; $\omega = \omega_0 + \alpha\,t$; per il secchio
  $a = m g/(m + \frac{1}{2} M)$ e $T = \frac{1}{2} M a$; per la macchina di Atwood
  $a = (m_2 - m_1) g/(m_1 + m_2 + \frac{1}{2} M)$ e $T_2 = m_2 (g - a)$.
- Scene esistenti, non modificate: `asta-forze` nel livello 3 (la porta vista dall'alto, i cardini come perno, la
  forza con il suo angolo e la distanza dai cardini), `corpi-collegati` di tipo `atwood` nel livello 6 (le due masse;
  la massa della carrucola è solo nel testo).

## Livello 1: il secondo principio per le rotazioni

Metà: una ruota con $I$ tra $0{,}11$ e $9{,}9\,\text{kg} \cdot \text{m}^2$ e momento totale tra $0{,}50$ e
$60\,\text{N} \cdot \text{m}$; si chiede $\alpha$. Metà: un volano con $I$ e $\alpha$ ($0{,}50$-$40\,\text{rad/s}^2$);
si chiede il momento totale.

- "Su una ruota con momento d'inerzia $0{,}91\,\text{kg} \cdot \text{m}^2$ agisce un momento totale di
  $1{,}2\,\text{N} \cdot \text{m}$. Quanto vale la sua accelerazione angolare?" Risposta $1{,}3\,\text{rad/s}^2$;
  distrattori $M\,I$, $I/M$, $M/I^2$.
- "Un volano con momento d'inerzia $0{,}53\,\text{kg} \cdot \text{m}^2$ deve prendere un'accelerazione angolare di
  $0{,}87\,\text{rad/s}^2$. Quale momento totale serve?" Risposta $0{,}46\,\text{N} \cdot \text{m}$; distrattori
  $\alpha/I$, $I/\alpha$, $I\,\alpha^2$.

## Livello 2: una forza tangente a un disco

Un disco pieno ($0{,}50$-$9{,}9\,\text{kg}$, raggio $0{,}11$-$0{,}99\,\text{m}$) libero di ruotare, con una forza di
$1{,}1$-$40\,\text{N}$ tangente al bordo (esempio 1). Momento e momento d'inerzia si calcolano prima.

- "Un disco pieno di massa $2{,}0\,\text{kg}$ e raggio $0{,}50\,\text{m}$ può ruotare senza attrito attorno al suo
  asse. Una forza di $4{,}3\,\text{N}$ agisce sul bordo, tangente al disco. Quanto vale l'accelerazione angolare del
  disco?" Risposta $8{,}6\,\text{rad/s}^2$; distrattori $F/I$ (il braccio dimenticato), $F R/(m R^2)$ (il mezzo del
  disco dimenticato), $F/m$.
- Con $4{,}7\,\text{kg}$, $0{,}32\,\text{m}$ e $3{,}7\,\text{N}$: risposta $4{,}9\,\text{rad/s}^2$.

## Livello 3: una forza obliqua

Una porta con $I$ tra $1{,}1$ e $9{,}9\,\text{kg} \cdot \text{m}^2$ rispetto ai cardini, spinta a $0{,}31$-$0{,}95\,\text{m}$
dai cardini con $5{,}0$-$60\,\text{N}$ a $30^\circ$, $35^\circ$, ..., $70^\circ$ dal piano della porta, senza i
$45^\circ$ (seno e coseno uguali); sotto i $30^\circ$ la scena `asta-forze` scrive l'angolo sopra la freccia. Esempio 2 della lezione.

- "Una porta ha momento d'inerzia $4{,}9\,\text{kg} \cdot \text{m}^2$ rispetto ai cardini. La spingi a
  $0{,}60\,\text{m}$ dai cardini con una forza di $7{,}6\,\text{N}$, che forma un angolo di $35^\circ$ con il piano
  della porta. Con quale accelerazione angolare parte la porta?" Risposta $0{,}53\,\text{rad/s}^2$; distrattori il
  coseno al posto del seno, l'angolo dimenticato, la distanza dimenticata.
- Con $3{,}8\,\text{kg} \cdot \text{m}^2$, $0{,}75\,\text{m}$, $12\,\text{N}$ e $60^\circ$: $2{,}1\,\text{rad/s}^2$.

## Livello 4: frenare e avviare una ruota

Metà: una ruota con $I$ ($0{,}11$-$5{,}0$) gira a $5{,}0$-$60\,\text{rad/s}$ e un freno la ferma in
$1{,}1$-$20\,\text{s}$; si chiede il modulo del momento frenante (esempio 3). Metà: un motore applica un momento
costante a un volano fermo; si chiede $\omega$ dopo $t$.

- "Una ruota con momento d'inerzia $0{,}69\,\text{kg} \cdot \text{m}^2$ gira a $8{,}6\,\text{rad/s}$. Un freno la ferma
  in $3{,}8\,\text{s}$ con accelerazione angolare costante. Quanto vale, in modulo, il momento frenante?" Risposta
  $1{,}6\,\text{N} \cdot \text{m}$; distrattori $I\,\omega_0$ (il tempo dimenticato), $I\,\omega_0\,t$, $\alpha$ da sola.
- "Un motore applica un momento costante di $0{,}84\,\text{N} \cdot \text{m}$ a un volano fermo, che ha momento
  d'inerzia $0{,}41\,\text{kg} \cdot \text{m}^2$. Quale velocità angolare ha il volano dopo $3{,}3\,\text{s}$?"
  Risposta $6{,}8\,\text{rad/s}$; distrattori $\alpha$ presa per $\omega$, $M\,I\,t$, $\frac{1}{2}\alpha t^2$.

## Livello 5: il secchio e la carrucola con massa

Un secchio ($0{,}50$-$9{,}9\,\text{kg}$) appeso a una fune avvolta su una carrucola a disco ($0{,}50$-$9{,}9\,\text{kg}$);
accelerazione non oltre $9{,}3\,\text{m/s}^2$, per non confonderla con la caduta libera. Metà l'accelerazione, metà la
tensione. Esempio 4 della lezione.

- "Un secchio di massa $2{,}0\,\text{kg}$ è appeso a una fune avvolta attorno a una carrucola, un disco pieno di massa
  $4{,}0\,\text{kg}$ che ruota senza attrito attorno al suo asse. Il secchio viene lasciato libero. Con quale
  accelerazione scende?" Risposta $4{,}9\,\text{m/s}^2$; distrattori $9{,}8$ (caduta libera), $m g/(m + M)$ (tutta la
  massa della carrucola), $m g/(\frac{1}{2} M)$.
- "... Quanto vale la tensione della fune?" Risposta $9{,}8\,\text{N}$; distrattori il peso del secchio,
  $\frac{1}{2} M g$, $m\,a$.

## Livello 6: la macchina di Atwood con la carrucola pesante

Due masse, la prima tra $0{,}50$ e $5{,}0\,\text{kg}$ e la seconda tra $1{,}2$ e $3$ volte la prima; carrucola a disco
di $0{,}50$-$5{,}0\,\text{kg}$; accelerazione di almeno $0{,}2\,\text{m/s}^2$. Metà l'accelerazione, metà la tensione
dal lato della massa più pesante. Esempio 5 della lezione.

- "Una macchina di Atwood porta due masse di $1{,}0\,\text{kg}$ e $2{,}0\,\text{kg}$. La carrucola è un disco pieno di
  massa $1{,}0\,\text{kg}$, senza attrito sull'asse, e il filo non slitta. Quanto vale l'accelerazione delle due
  masse?" Risposta $2{,}8\,\text{m/s}^2$; distrattori la carrucola ideale ($3{,}3$), tutta la massa della carrucola
  al denominatore, il peso della sola massa pesante al numeratore.
- "... Quanto vale la tensione del tratto di filo che regge la massa più pesante?" Risposta $14\,\text{N}$; distrattori
  il peso $m_2 g$, la tensione dell'altro tratto $m_1 (g + a)$, $m_2 (g + a)$.

## Esercizi da evitare

- Angolo di $45^\circ$ nel livello 3: seno e coseno coincidono e il distrattore principale sparisce.
- Masse quasi uguali o troppo diverse nella macchina di Atwood.
- Carrucole così leggere che il secchio è quasi in caduta libera.

## Verifica

`fis_dinamica_rotazionale.py` rilegge il testo, controlla cifre significative e intervalli, e ricalcola: i livelli 5 e
6 risolvendo con SymPy il sistema delle equazioni dei corpi e della carrucola, senza usare le formule chiuse; il
livello 3 con il seno esatto. Arrotonda a due cifre, confronta risposta e forma delle opzioni, e controlla che le
scene dei livelli 3 e 6 portino i dati del testo.

## Domande per la revisione

- Il momento dalle componenti, $M_z = r_x F_y - r_y F_x$ (esempio 6), non ha un livello: va aggiunto qui o resta alla
  lezione sul prodotto vettoriale?
- Nel livello 6 si chiede solo la tensione dal lato pesante: serve anche l'altra, o la differenza tra le due?
