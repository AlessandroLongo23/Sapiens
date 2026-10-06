# La conservazione del momento angolare

Generatore: `fis-conservazione-momento-angolare`
(`src/lib/exercises/v2/generators/fis-conservazione-momento-angolare.ts`, con
`src/lib/exercises/v2/fis-momento-angolare.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_conservazione_momento_angolare.py` (con `_fis_momento_angolare.py`). Lezione
collegata: `docs/lezioni/fisica/riscritte/91-fis-conservazione-momento-angolare.md`. Percorso nel database:
`high_school/physics/fis-momento-angolare/fis-conservazione-momento-angolare`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Un corpo che cambia forma
2. Due masse che si avvicinano all'asse
3. Un disco cade su un altro
4. Un salto sulla giostra
5. Dal perielio all'afelio
6. L'energia cinetica dopo il cambio di forma

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($6{,}0\,\text{rad/s}$, $31\,\text{km/s}$, $13\,\text{J}$). Dati con due cifre
significative senza zeri finali ambigui; la massa della giostra ha tre cifre, da $101$ a $199\,\text{kg}$, mai con lo zero
finale. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, mai da $100$ in su
e mai un intero di due cifre che finisce per zero. Nessun distrattore a meno dell'8% della risposta.

## Regole comuni

- Formule della lezione: $I_1\omega_1 = I_2\omega_2$; $I_1\omega_1 = (I_1 + I_2)\,\omega$; $m\,v\,r = (I + m r^2)\,\omega$ con
  $I = \tfrac12 M r^2$; $v_p r_p = v_a r_a$; $K_{rot} = \tfrac12 I\omega^2$.
- Scena `orbita-ellisse` (nuova, `scenes/OrbitaEllisse.tsx`) al livello 5: l'orbita con il Sole, le due distanze e la
  velocità al perielio. Mai la velocità all'afelio.

## Livello 1: un corpo che cambia forma

Una pattinatrice, un tuffatore o una ragazza su uno sgabello girevole. $I_1$ da $1{,}1$ a $9{,}9\,\text{kg}\cdot\text{m}^2$,
$\omega_1$ da $1{,}1$ a $9{,}9\,\text{rad/s}$. Circa otto volte su dieci il corpo si chiude ($I_2$ tra un quarto e il 70% di
$I_1$), le altre si apre ($I_2$ tra $1{,}3$ e $2{,}5$ volte $I_1$); al livello 6, dove il risultato deve stare tra $1$ e
$99\,\text{J}$, circa sei su dieci. Quote ammesse: tra il 45% e il 90% e tra il 10% e il 55%.

- "Una pattinatrice gira su se stessa con le braccia aperte: il suo momento d'inerzia è $3{,}6\,\text{kg}\cdot\text{m}^2$ e la
  sua velocità angolare $2{,}5\,\text{rad/s}$. Stringe le braccia al corpo, e il momento d'inerzia diventa
  $1{,}5\,\text{kg}\cdot\text{m}^2$. Con che velocità angolare ruota adesso?" Risposta $6{,}0\,\text{rad/s}$; distrattori
  $1{,}0\,\text{rad/s}$ (rapporto rovesciato), $3{,}9\,\text{rad/s}$ (energia cinetica conservata, $\omega_1\sqrt{I_1/I_2}$:
  l'avviso della lezione), $14\,\text{rad/s}$ (rapporto al quadrato).

## Livello 2: due masse che si avvicinano all'asse

In più: i momenti d'inerzia si calcolano, $I = 2 m r^2$. Masse da $0{,}11$ a $2{,}5\,\text{kg}$, $r_1$ da $21$ a
$99\,\text{cm}$, $r_2$ tra il 30% e l'80% di $r_1$, $\omega_1$ da $1{,}1$ a $9{,}9\,\text{rad/s}$.

- "Due masse di $0{,}35\,\text{kg}$ sono fissate a un'asta leggera che ruota senza attrito intorno al suo centro a
  $6{,}2\,\text{rad/s}$; ciascuna dista $44\,\text{cm}$ dall'asse. Un meccanismo le avvicina fino a $22\,\text{cm}$ dall'asse.
  Trascura la massa dell'asta: con che velocità angolare ruota adesso il sistema?" Risposta $25\,\text{rad/s}$;
  distrattori $12\,\text{rad/s}$ (rapporto dei raggi senza il quadrato), $8{,}8\,\text{rad/s}$ (con la radice),
  $3{,}1\,\text{rad/s}$ (rapporto rovesciato), $1{,}6\,\text{rad/s}$ (rovesciato e al quadrato): i primi tre che restano.

## Livello 3: un disco cade su un altro

In più: due corpi che si uniscono. $I_1$ e $I_2$ da $0{,}011$ a $0{,}99\,\text{kg}\cdot\text{m}^2$ con $I_2$ tra un quarto e il
triplo di $I_1$, $\omega_1$ da $1{,}1$ a $30\,\text{rad/s}$.

- "Un disco con momento d'inerzia $0{,}58\,\text{kg}\cdot\text{m}^2$ gira a $5{,}8\,\text{rad/s}$ intorno al suo asse. Un secondo
  disco, fermo, con momento d'inerzia $0{,}63\,\text{kg}\cdot\text{m}^2$, cade sul primo lungo lo stesso asse. Con che velocità
  angolare girano insieme?" Risposta $2{,}8\,\text{rad/s}$; distrattori $5{,}3\,\text{rad/s}$ ($I_1\omega_1/I_2$, il primo
  disco dimenticato), $4{,}0\,\text{rad/s}$ (energia conservata), $12\,\text{rad/s}$ (rapporto rovesciato); $I_2$ al
  numeratore ($3{,}0$) è troppo vicino alla risposta e viene scartato.

## Livello 4: un salto sulla giostra

In più: il momento angolare di una particella che arriva in tangente e il suo $m r^2$. Giostra come disco pieno da
$101$ a $199\,\text{kg}$ e raggio da $1{,}1$ a $2{,}5\,\text{m}$; bambino da $21$ a $49\,\text{kg}$, velocità da $1{,}5$ a
$6{,}5\,\text{m/s}$.

- "Una giostra è un disco pieno di $151\,\text{kg}$ e raggio $1{,}8\,\text{m}$, fermo, libero di ruotare senza attrito
  intorno al centro. Un bambino di $48\,\text{kg}$ corre a $2{,}6\,\text{m/s}$ lungo la tangente al bordo e ci salta sopra.
  Con che velocità angolare parte la giostra?" Risposta $0{,}56\,\text{rad/s}$; distrattori $0{,}92\,\text{rad/s}$ ($m r^2$
  del bambino dimenticato: l'avviso della lezione), $0{,}31\,\text{rad/s}$ (senza il braccio, $m v$ al posto di $m v r$),
  $0{,}35\,\text{rad/s}$ (giostra come anello, $M r^2$); $v/r$ quando serve.

## Livello 5: dal perielio all'afelio

In più: la forza centrale e le orbite. Un asteroide o una cometa: perielio da $11$ a $99$ milioni di chilometri, afelio
tra $1{,}3$ e $4$ volte il perielio e al più $99$, velocità al perielio da $11$ a $99\,\text{km/s}$. Con la scena. I numeri
non sono quelli di un corpo vero.

- "Una cometa percorre un'orbita ellittica intorno al Sole. Al perielio, a $25$ milioni di chilometri dal Sole, ha una
  velocità di $44\,\text{km/s}$. Che velocità ha all'afelio, a $35$ milioni di chilometri dal Sole?" Risposta
  $31\,\text{km/s}$; distrattori $62\,\text{km/s}$ (rapporto rovesciato), $37\,\text{km/s}$ (con la radice),
  $22\,\text{km/s}$ (al quadrato).

## Livello 6: l'energia cinetica dopo il cambio di forma

In più: due passaggi, e l'energia che non si conserva. Stessi dati del livello 1; risultato tra $1$ e $99\,\text{J}$.

- "Una pattinatrice gira su se stessa con le braccia aperte: il suo momento d'inerzia è $9{,}8\,\text{kg}\cdot\text{m}^2$ e la
  sua velocità angolare $1{,}3\,\text{rad/s}$. Stringe le braccia al corpo, e il momento d'inerzia diventa
  $6{,}2\,\text{kg}\cdot\text{m}^2$. Quanto vale adesso la sua energia cinetica di rotazione?" Risposta $13\,\text{J}$;
  distrattori $8{,}3\,\text{J}$ (l'energia di prima, come se si conservasse: l'avviso della lezione), $5{,}2\,\text{J}$
  ($\tfrac12 I_2\omega_1^2$, la velocità angolare non aggiornata), $26\,\text{J}$ (senza il mezzo).

## Esercizi da evitare

- Rapporti tra i momenti d'inerzia vicini a 1: i distrattori sarebbero quasi uguali alla risposta.
- Un corpo che si chiude fino a meno di un quarto del momento d'inerzia: velocità angolari non credibili per una persona.
- Risultati in notazione scientifica o con uno zero finale ambiguo.

## Verifica

`fis_conservazione_momento_angolare.py` rilegge il testo, controlla cifre significative, intervalli e rapporti, ricalcola
in modo esatto (SymPy), confronta la risposta e il formato delle opzioni; al livello 5 controlla che la scena abbia le
distanze e la velocità del testo, negli altri che non ci sia una scena; ai livelli 1 e 6 controlla le quote dei due casi.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli intervalli.
`review.mts` e `width.mts` con codice 0 (opzioni al più 84 px su 252).

### Errori piantati

Su 200 esercizi del seed 1: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate, un
dato del testo cambiato nell'ultima cifra e una scritta della scena cambiata (33 su 33) bocciati tutti. Il dato cambiato
viene preso anche quando a due cifre la risposta non cambia, perché il controllo confronta i numeri del testo con
`params`.
