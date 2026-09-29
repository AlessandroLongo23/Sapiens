# Le forze di attrito

Generatore: `fis-attrito` (`src/lib/exercises/v2/generators/fis-attrito.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_attrito.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/19-fis-attrito.md`
(note in `docs/lezioni/fisica/note/19-fis-attrito.md`).

Cinque livelli, ognuno con una difficoltà in più: l'attrito dinamico, un coefficiente da una misura, quale attrito
agisce, una forza premente che non è il peso, un libro contro la parete.

## Nomi dei livelli

1. L'attrito dinamico
2. Il coefficiente di attrito
3. Quanto vale l'attrito
4. La forza premente non è il peso
5. Un libro contro la parete

## Tipi di risposta

Risposta `number`, il valore esatto arrotondato a due cifre significative (mezzo in su, niente arrotondamenti a
metà): forze in N, masse in kg, coefficienti senza unità. Scelta multipla con l'unità nell'opzione (nessuna per i
coefficienti).

## Regole comuni

- $F_\perp = m \cdot g$ su un piano orizzontale senza altre forze verticali, $F_s \le \mu_s F_\perp$,
  $F_d = \mu_d F_\perp$, $g = 9{,}8$ N/kg, come la lezione.
- Masse con due cifre (da $1{,}0$ a $9{,}9$ o da $10$ a $99$ kg), coefficienti con due decimali tra $0{,}10$ e $0{,}80$,
  forze della risposta tra $1$ e $99$ N.
- Corpi: una cassa, uno scatolone, un mobile, una slitta (su una strada innevata), un blocco di legno (su un tavolo),
  con l'accordo giusto ("è fermo", "è ferma", "lo si spinge").
- Nessuna scena: una scena con le sole forze date non sarebbe un diagramma delle forze corretto (mancano la reazione
  del piano e l'attrito, che è la risposta).

## Livello 1: l'attrito dinamico

- "Una cassa di $20$ kg striscia su un pavimento orizzontale; il coefficiente di attrito dinamico è $\mu_d = 0{,}30$.
  Quanto vale la forza di attrito?" Risposta $59$ N; distrattori $6{,}0$ N (la massa al posto del peso), $2{,}0 \cdot
  10^{2}$ N (il peso), $6{,}5 \cdot 10^{2}$ N.
- "Un blocco di legno di $8{,}1$ kg … $\mu_d = 0{,}28$." Risposta $22$ N.

## Livello 2: il coefficiente di attrito

Metà dinamico, dalla forza che trascina il corpo a velocità costante (esempio 2 della lezione); metà statico, dalla
forza più piccola che lo mette in moto. La forza del testo è $\mu m g$ arrotondata a due cifre, e la risposta si
calcola dal testo, non da $\mu$.

- "Per trascinare a velocità costante una slitta di $12$ kg su una strada innevata orizzontale serve una forza
  orizzontale di $29$ N. Quanto vale il coefficiente di attrito dinamico?" Risposta $0{,}25$; distrattori $2{,}4$
  ($F / m$), $4{,}1$ ($m g / F$), $2{,}5$.

## Livello 3: quanto vale l'attrito

Una cassa ferma con $\mu_s$ e $\mu_d < \mu_s$ viene spinta con una forza orizzontale. Metà dei casi la spinta è al più
il $90\%$ dell'attrito statico massimo e la risposta è la spinta stessa; metà è almeno il $110\%$ e la risposta è
l'attrito dinamico. Mai casi al limite.

- "Una cassa di $20$ kg è ferma su un pavimento orizzontale, con $\mu_s = 0{,}40$ e $\mu_d = 0{,}30$. La si spinge
  orizzontalmente con una forza di $50$ N." Risposta $50$ N; distrattori $78$ N (l'attrito statico sempre al
  massimo, l'avviso della lezione), $59$ N, $2{,}0 \cdot 10^{2}$ N.
- "… con una forza di $90$ N." Risposta $59$ N; distrattori $78$ N, $90$ N (la spinta), $31$ N.

## Livello 4: la forza premente non è il peso

Un corpo appoggiato su un piano orizzontale, con una mano che lo preme verso il basso (metà) o una corda che lo tira
verso l'alto con una forza minore del peso (metà), tra il $15\%$ e l'$80\%$ del peso e al più $99$ N. Si chiede
l'attrito statico massimo.

- "Uno scatolone di $1{,}6$ kg è appoggiato su un pavimento orizzontale, con $\mu_s = 0{,}76$. Una corda lo tira verso
  l'alto con una forza di $9{,}1$ N, più piccola del suo peso." Risposta $5{,}0$ N; distrattori $12$ N (la forza
  premente presa per il peso, l'avviso della lezione), $19$ N (la corda con il segno sbagliato), $6{,}9$ N.

## Livello 5: un libro contro la parete

La forza premente è la spinta orizzontale della mano (esempio 4 della lezione). Metà: la massa più grande che il
libro può avere senza scivolare, da $\mu_s F / g$ (tra $0{,}1$ e $9$ kg). Metà: la spinta minima per un libro di massa
data (da $0{,}10$ a $0{,}99$ kg), $m g / \mu_s$.

- "Un libro di $0{,}77$ kg è premuto contro una parete verticale da una mano che lo spinge orizzontalmente; tra libro e
  parete $\mu_s = 0{,}61$. Con quale forza minima bisogna spingerlo perché non scivoli?" Risposta $12$ N; distrattori
  $4{,}6$ N ($\mu_s m g$, la forza premente presa per il peso), $7{,}5$ N (il peso), $1{,}3$ N.

## Esercizi da evitare

- Una spinta vicina all'attrito statico massimo (livello 3): il risultato dipenderebbe dagli arrotondamenti.
- Una corda che tira più del peso (il corpo si solleverebbe); forze oltre $99$ N.
- Coefficienti fuori da $0{,}10$-$0{,}80$ e $\mu_d \ge \mu_s$.

## Verifica

`fis_attrito.py` rilegge il testo (con l'accordo di genere), controlla cifre significative e intervalli, calcola con
SymPy la forza premente dei casi della lezione, confronta la spinta con $0{,}9$ e $1{,}1$ volte l'attrito statico
massimo e sceglie l'attrito giusto; poi la risposta, le opzioni, la quota dei casi.

Esito: seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Bocciati tutti tranne due, che non sono errori: cambiare la massa al livello 3 quando il corpo resta fermo non cambia
la risposta (l'attrito è la spinta), e al livello 2 una massa di $43$ kg al posto di $42$ dà lo stesso coefficiente
arrotondato. Bocciati anche un coefficiente di $0{,}95$ e una spinta a ridosso dell'attrito statico massimo.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 992 (986), livello 2 993 (989), livello 3 1000 (1000), livello 4 1000 (1000),
livello 5 967 (966).

## Domande per la revisione

- $F_\perp$ come nella lezione, o $F_N$, o $N$?
- Il livello 5 (libro contro la parete) usa un'idea che la lezione mostra in un solo esempio: tenerlo, o spostarlo nel
  capitolo sull'equilibrio?
- Negli esercizi manca il piano inclinato, che è nel capitolo successivo.
