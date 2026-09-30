# Il primo principio della dinamica e i sistemi inerziali

Generatore: `fis-primo-principio` (`src/lib/exercises/v2/generators/fis-primo-principio.ts`, con
`src/lib/exercises/v2/fis-dinamica.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_primo_principio.py` (con `_dinamica.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/50-fis-primo-principio.md`. Percorso nel database:
`high_school/physics/dinamica/fis-primo-principio`.

Quattro livelli, ognuno con una difficoltà in più, tutti sulla stessa idea della lezione: a velocità costante la forza
totale è nulla, e le forze si bilanciano. I sistemi inerziali non hanno esercizi numerici: restano nelle flashcard.

## Nomi dei livelli

1. Velocità costante in verticale
2. L'attrito a velocità costante
3. La maniglia inclinata
4. Due funi perpendicolari

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni: forze con l'unità ($23\,\text{N}$), coefficienti senza unità ($0{,}31$). Masse con due
cifre significative da $1{,}1$ a $9{,}9\,\text{kg}$, forze con due cifre significative ($1{,}1$-$9{,}9$ o $11$-$99\,\text{N}$,
mai un intero che finisce con zero), angoli in gradi interi, coefficienti con due decimali; $g = 9{,}8\,\text{N/kg}$.
Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento, mai un intero di due cifre
che finisce con zero (lo zero sarebbe ambiguo); forze tra $1$ e $99\,\text{N}$.

## Livello 1: velocità costante in verticale

Metà: un pacco scende con il paracadute a velocità costante, e si chiede la forza dell'aria; metà: un carico (un
secchio, una cassetta, un sacco di sabbia, con l'accordo) sale tirato da una fune a velocità costante, e si chiede la
tensione. La risposta è il peso $m\,g$. Niente scena.

- "Un pacco di $8{,}5\,\text{kg}$ scende con il paracadute a velocità costante. Quanto vale la forza dell'aria sul pacco
  e sul paracadute, di massa trascurabile?" Risposta $83\,\text{N}$; distrattori $8{,}5\,\text{N}$ (la massa al posto del
  peso), $0\,\text{N}$ ("la velocità è costante, quindi niente forza": è la forza totale a essere nulla), e il peso
  sbagliato del 20% o del 40% per completare.
- "Un secchio di $4{,}3\,\text{kg}$ viene sollevato con una fune a velocità costante. Quanto vale la tensione della
  fune?" Risposta $42\,\text{N}$; distrattori $4{,}3\,\text{N}$, $0\,\text{N}$, $51\,\text{N}$.

## Livello 2: l'attrito a velocità costante

Una cassetta trascinata sul pavimento con una fune orizzontale, a velocità costante: la tensione è uguale all'attrito
dinamico, $T = \mu_d\,m\,g$. Metà: dalla tensione al coefficiente, con $T/(m\,g)$ tra $0{,}10$ e $0{,}80$, e la scena
`blocco-forze` con la tensione; metà: dal coefficiente ($0{,}10$-$0{,}60$) alla tensione, senza scena (la tensione è la
risposta).

- "Una cassetta di $2{,}4\,\text{kg}$ è trascinata sul pavimento con una fune orizzontale, a velocità costante; la
  tensione della fune è di $7{,}2\,\text{N}$. Quanto vale il coefficiente di attrito dinamico?" Risposta $0{,}31$;
  distrattori $3{,}0$ ($T/m$, la massa al posto del peso), $3{,}3$ (il rapporto rovesciato), $0{,}37$.
- "... il coefficiente di attrito dinamico è $\mu_d = 0{,}13$. Quanto vale la tensione della fune?" con $4{,}3\,\text{kg}$:
  risposta $5{,}5\,\text{N}$; distrattori $0{,}56\,\text{N}$ ($\mu_d\,m$), $42\,\text{N}$ (il peso), $6{,}6\,\text{N}$.

## Livello 3: la maniglia inclinata

Una valigia su rotelle tirata a velocità costante lungo la maniglia inclinata di un angolo tra $25^\circ$ e $60^\circ$:
la forza che frena, parallela al pavimento, bilancia la componente orizzontale $F\cos\alpha$. Metà: dalla forza della
maniglia alla forza che frena (scena `blocco-forze` con la forza $F$ all'angolo del testo); metà: dalla forza che frena
alla forza della maniglia, $F = F_x / \cos\alpha$, senza scena.

- "Una valigia su rotelle è tirata a velocità costante con una forza di $62\,\text{N}$, lungo la maniglia inclinata di
  $27^\circ$ sull'orizzontale. Quanto vale la forza che frena la valigia, parallela al pavimento?" Risposta
  $55\,\text{N}$; distrattori $62\,\text{N}$ (tutta la forza), $28\,\text{N}$ (il seno), $70\,\text{N}$ (diviso per il
  coseno).
- Per la forza della maniglia i distrattori sono $F_x\cos\alpha$, $F_x/\sin\alpha$ e $F_x$ stessa.

## Livello 4: due funi perpendicolari

Due ragazzi tirano una cassa con due funi orizzontali perpendicolari, con forze diverse, la più piccola almeno il
$40\%$ della più grande; la cassa striscia a velocità costante, e l'attrito bilancia la risultante,
$\sqrt{F_1^2 + F_2^2}$. Scena `punto-forze`: la cassa vista dall'alto, con le due forze a $0^\circ$ e a $90^\circ$.

- "Due ragazzi tirano una cassa sul pavimento con due funi orizzontali perpendicolari tra loro, con forze di
  $61\,\text{N}$ e $43\,\text{N}$. La cassa striscia a velocità costante. Quanto vale l'attrito?" Risposta
  $75\,\text{N}$; distrattori $18\,\text{N}$ (la differenza), $61\,\text{N}$ (la forza più grande) e $45\,\text{N}$
  (il 40% in meno); la somma dei moduli, $104\,\text{N}$, qui è oltre $99$ e si salta, e così $90$ e $60\,\text{N}$
  (il 20% in più e in meno), che finiscono con zero.
- Con $36$ e $17\,\text{N}$ la risultante è $39{,}8\,\text{N}$, che darebbe $40\,\text{N}$ con lo zero ambiguo:
  l'esercizio si scarta.

## Esercizi da evitare

- Risultati che finiscono con uno zero ambiguo ($40\,\text{N}$) o oltre $99$.
- Angoli piccoli al livello 3, dove $F\cos\alpha$ e $F$ darebbero quasi lo stesso numero.
- Due funi con forze uguali o molto diverse al livello 4.

## Verifica

`fis_primo_principio.py` rilegge il testo (con l'accordo), controlla cifre significative e intervalli, calcola con
SymPy (trigonometria esatta), confronta la risposta e le opzioni, e controlla la scena: le forze del testo, con il
modulo e l'angolo giusti, e nessuna scena dove la forza è la risposta.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 1.000 esercizi per livello ciascuno, PASS, quote dei casi
dentro gli intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 51 px su 252).

### Esercizi diversi su 1.000

Seed da 1: livello 1 264, livello 2 948, livello 3 885, livello 4 842.

### Errori piantati

Bocciati tutti (160 su 160, 80 su 80 per la scena): indice dell'opzione giusta, un numero del testo cambiato, il testo
dell'opzione giusta, un'opzione doppia, parole vietate, un modulo della scena spostato, la scena tolta.

## Domande per la revisione

- Il livello 1 è molto facile: va bene come primo gradino, o si toglie?
- Serve un livello sui sistemi inerziali (per esempio "in quale di questi sistemi vale il primo principio?"), a scelta
  tra frasi?
