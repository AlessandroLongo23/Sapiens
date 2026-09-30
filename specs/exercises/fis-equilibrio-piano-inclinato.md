# L'equilibrio sul piano inclinato

Generatore: `fis-equilibrio-piano-inclinato` (`src/lib/exercises/v2/generators/fis-equilibrio-piano-inclinato.ts`, con
`src/lib/exercises/v2/fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_equilibrio_piano_inclinato.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/21-fis-equilibrio-piano-inclinato.md`. Percorso nel database:
`high_school/physics/fis-equilibrio-solidi/fis-equilibrio-piano-inclinato`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le componenti del peso
2. Altezza e lunghezza
3. L'inclinazione dalla forza
4. L'angolo limite
5. Fermo o scivola

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni: forze con l'unità ($11\,\text{N}$), angoli in gradi interi ($16^\circ$), coefficienti
senza unità ($0{,}31$). Masse e lunghezze con due cifre significative (da $1{,}1$ a $9{,}9$), angoli in gradi interi,
coefficienti con due decimali; $g = 9{,}8\,\text{N/kg}$. Risultati a due cifre significative (angoli al grado), mai a
meno di $10^{-6}$ da un confine di arrotondamento; forze tra $1$ e $99\,\text{N}$.

## Regole comuni

- Formule della lezione: $P_\parallel = P\sin\alpha = P\,h/l$, $P_\perp = P\cos\alpha = P\,b/l$ con
  $b = \sqrt{l^2 - h^2}$; sul piano liscio $F_v = P\cos\alpha$ e la forza equilibrante (il filo) $P\sin\alpha$; con
  l'attrito il corpo resta fermo se $\tan\alpha \le \mu_s$, e allora l'attrito è $P\sin\alpha$; se scivola è
  $\mu_d P\cos\alpha$; $\tan\alpha_{lim} = \mu_s$.
- Scena `piano-inclinato`: il piano all'inclinazione del testo con l'angolo scritto, oppure con l'altezza e la lunghezza
  (livello 2), il blocco, il filo quando c'è. Niente forze nella scena del problema. Quando l'angolo è la risposta
  (livello 3) il piano è disegnato a $25^\circ$ con la scritta $\alpha$, non in scala, e la soluzione lo ridisegna
  all'angolo vero; al livello 4, quando si chiede l'angolo, non c'è scena. Al livello 1 la soluzione disegna il peso e
  le componenti in scala.
- Corpi: una cassa, uno scatolone, un blocco di legno, una valigia, con l'accordo giusto.

## Livello 1: le componenti del peso

Inclinazione da $10^\circ$ a $70^\circ$; componente parallela o perpendicolare, metà ciascuna.

- "Una cassa di $1{,}4\,\text{kg}$ è appoggiata su un piano inclinato di $37^\circ$. Quanto vale la componente del peso
  perpendicolare al piano?" Risposta $11\,\text{N}$; distrattori $8{,}3\,\text{N}$ (seno e coseno scambiati),
  $14\,\text{N}$ (tutto il peso), $1{,}1\,\text{N}$ (la massa al posto del peso).

## Livello 2: altezza e lunghezza

Un corpo fermo su un piano liscio, tenuto da un filo parallelo al piano; lunghezza e altezza del piano, con l'altezza
tra il $15\%$ e l'$85\%$ della lunghezza. Si chiede la tensione del filo, $P\,h/l$ (metà), o la reazione del piano,
$P\,b/l$ (metà).

- "Una valigia di $1{,}4\,\text{kg}$ è ferma su un piano inclinato liscio, lungo $5{,}1\,\text{m}$ e alto
  $1{,}6\,\text{m}$, tenuta da un filo parallelo al piano. Quanto vale la reazione vincolare del piano?" Risposta
  $13\,\text{N}$; distrattori $14\,\text{N}$ (la reazione uguale al peso), $4{,}3\,\text{N}$ (l'altra componente),
  $4{,}5\,\text{N}$ ($P\,h/b$).
- Per la tensione i distrattori sono $P\,l/h$ (il rapporto rovesciato), $P\,h/b$ (la tangente) e la reazione.

## Livello 3: l'inclinazione dalla forza

La forza del filo e la massa danno $\sin\alpha = T/P$, con $\alpha$ tra $8^\circ$ e $70^\circ$, al grado.

- "Uno scatolone di $2{,}8\,\text{kg}$ è tenuto fermo su un piano inclinato liscio da un filo parallelo al piano, con una
  tensione di $7{,}4\,\text{N}$. Quanto vale l'inclinazione del piano?" Risposta $16^\circ$; distrattori $74^\circ$
  (il coseno al posto del seno), $15^\circ$ (la tangente), e quando dà un angolo il seno di $T/m$ (la massa al posto del
  peso); altrimenti $\pm 3^\circ$.

## Livello 4: l'angolo limite

Metà: dal coefficiente ($0{,}10$-$0{,}90$) all'angolo limite, $\tan^{-1}\mu_s$ al grado; distrattori $\sin^{-1}\mu_s$,
$\cos^{-1}\mu_s$, il complementare. Metà: dall'angolo a cui il libro parte ($6^\circ$-$40^\circ$) al coefficiente,
$\tan\alpha$ con due cifre significative.

- "Un libro è appoggiato su un'asse di legno, che viene inclinata sempre di più. Il libro comincia a scivolare quando
  l'asse forma un angolo di $17^\circ$ con l'orizzontale. Quanto vale il coefficiente di attrito statico?" Risposta
  $0{,}31$; distrattori $0{,}29$ (il seno), $0{,}96$ (il coseno), $3{,}3$ (la tangente rovesciata).

Il livello ha pochi esercizi diversi (una novantina di coefficienti e una trentina di angoli): i dati sono un numero solo.

## Livello 5: fermo o scivola

Inclinazione da $10^\circ$ a $50^\circ$, $\mu_s$ da $0{,}20$ a $0{,}90$, $\mu_d$ da $0{,}10$ a $\mu_s - 0{,}05$. Metà dei
casi $\tan\alpha \le 0{,}9\,\mu_s$ (resta fermo, l'attrito è $P\sin\alpha$), metà $\tan\alpha \ge 1{,}1\,\mu_s$ (scivola,
$\mu_d P\cos\alpha$). Mai casi al limite.

- "Uno scatolone di $1{,}4\,\text{kg}$ è appoggiato su un piano inclinato di $28^\circ$, con $\mu_s = 0{,}25$ e
  $\mu_d = 0{,}18$. Quanto vale la forza di attrito?" $\tan 28^\circ = 0{,}53 > 0{,}25$: scivola. Risposta
  $2{,}2\,\text{N}$; distrattori $3{,}0\,\text{N}$ (l'attrito statico massimo), $6{,}4\,\text{N}$ (la componente
  parallela), $2{,}5\,\text{N}$ ($\mu_d P$, la forza premente presa per il peso).
- Quando resta fermo i distrattori sono $\mu_s P\cos\alpha$ (l'attrito statico sempre al massimo, l'avviso della
  lezione), $P\cos\alpha$, $\mu_d P\cos\alpha$.

## Esercizi da evitare

- $\tan\alpha$ vicina a $\mu_s$ (livello 5): la risposta dipenderebbe dagli arrotondamenti.
- Piani quasi orizzontali o quasi verticali oltre i limiti detti; $\mu_d \ge \mu_s$.
- Forze oltre $99\,\text{N}$ o sotto $1\,\text{N}$.

## Verifica

`fis_equilibrio_piano_inclinato.py` rilegge il testo (con l'accordo), controlla cifre significative e intervalli,
calcola con la trigonometria esatta di SymPy, sceglie al livello 5 fermo o scivola confrontando $\tan\alpha$ con
$0{,}9$ e $1{,}1$ volte $\mu_s$, confronta la risposta e le opzioni; controlla che la scena abbia l'angolo del testo (o
$25^\circ$ con $\alpha$ al livello 3), l'altezza e la lunghezza del testo, e nessuna forza.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 51 px su 252).

### Errori piantati

Bocciati tutti: indice dell'opzione giusta, numeri del testo cambiati, testo dell'opzione giusta, opzione doppia, parole
vietate, angolo della scena spostato di $2^\circ$, una forza nella scena del problema. Eccezione che non è un errore: al
livello 3 una tensione più grande di $1\,\text{N}$ può dare lo stesso angolo al grado (bocciati 38 su 40).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 986 (988), livello 2 1000 (1000), livello 3 974 (981), livello 4 116 (116), livello 5
1000 (1000).

## Domande per la revisione

- Il livello 3 (dall'inclinazione alla forza, al contrario) usa $\sin^{-1}$ come la lezione di seno e coseno: va bene
  al primo anno?
- Serve un livello con la forza orizzontale che tiene il corpo sul piano liscio ($F = P\tan\alpha$), che la lezione non
  tratta?
