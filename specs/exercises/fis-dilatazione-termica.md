# La dilatazione termica

Generatore: `fis-dilatazione-termica` (`src/lib/exercises/v2/generators/fis-dilatazione-termica.ts`, con
`src/lib/exercises/v2/fis-termologia.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_dilatazione_termica.py`
(con `_fis_termologia.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/66-fis-dilatazione-termica.md`. Percorso nel
database: `high_school/physics/fis-temperatura-calore/fis-dilatazione-termica`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'allungamento
2. La temperatura finale
3. Il coefficiente di dilatazione
4. Un liquido che trabocca
5. Il volume di un solido

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione: millimetri, millilitri, centimetri cubi, $^\circ\text{C}^{-1}$ (in
notazione scientifica, $1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1}$), gradi Celsius interi. Lunghezze, volumi e masse con due cifre
significative, temperature intere; risultati a due cifre significative, mai a meno di un confine di arrotondamento
(pari merito escluso con i razionali esatti). I coefficienti sono quelli delle tabelle della lezione e si danno nel testo:
alluminio $2{,}3$, ottone $1{,}9$, rame $1{,}7$, acciaio $1{,}2 \cdot 10^{-5}$; vetro $8{,}5$, vetro pyrex $3{,}3 \cdot 10^{-6}$
(il vetro è sempre "una bacchetta"); acqua $2{,}1$ e mercurio $1{,}8 \cdot 10^{-4}\,^\circ\text{C}^{-1}$.

## Livello 1: l'allungamento

Lunghezza da $1{,}1$ a $9{,}9\,\text{m}$ o da $11$ a $99\,\text{m}$; temperatura iniziale da $-20$ a $30\,^\circ\text{C}$, aumento
multiplo di $5$ da $10$ a $200\,^\circ\text{C}$; allungamento tra $0{,}1$ e $999\,\text{mm}$.

- "Un filo d'acciaio ($\lambda = 1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1}$) è lungo $18\,\text{m}$ a $10\,^\circ\text{C}$. Di quanti
  millimetri si allunga se lo si scalda fino a $50\,^\circ\text{C}$?" Risposta $8{,}6\,\text{mm}$; distrattori $11\,\text{mm}$ (la
  temperatura finale al posto di $\Delta t$), $0{,}0086\,\text{mm}$ (i metri non convertiti), $0{,}22\,\text{mm}$ ($\Delta t$
  dimenticato).

## Livello 2: la temperatura finale

Lunghezze $1{,}0$, $1{,}5$, $2{,}0$, $2{,}5$, $3{,}0$, $4{,}0$, $5{,}0$, $6{,}0$, $8{,}0\,\text{m}$ o $12$, $15$, $18$, $24$, $25$, $36$,
$45\,\text{m}$; aumento multiplo di $10$ da $20$ a $200\,^\circ\text{C}$, scelto perché l'allungamento misurato abbia al più tre
cifre significative; temperatura iniziale da $-10$ a $30\,^\circ\text{C}$.

- "Una bacchetta di vetro ($\lambda = 8{,}5 \cdot 10^{-6}\,^\circ\text{C}^{-1}$) è lunga $1{,}0\,\text{m}$ a $8\,^\circ\text{C}$.
  Scaldandola si allunga di $0{,}255\,\text{mm}$. A quale temperatura è arrivata?" Risposta $38\,^\circ\text{C}$; distrattori
  $30\,^\circ\text{C}$ ($\Delta t$ dato come temperatura finale), $-22\,^\circ\text{C}$ ($\Delta t$ tolto), $46\,^\circ\text{C}$ (la
  temperatura iniziale contata due volte).

## Livello 3: il coefficiente di dilatazione

Gli stessi dati del livello 2, con le due temperature (iniziale da $10$ a $30\,^\circ\text{C}$) e senza il coefficiente: la
risposta è il coefficiente della tabella.

- "Una bacchetta di vetro lunga $1{,}0\,\text{m}$ a $19\,^\circ\text{C}$ viene scaldata fino a $49\,^\circ\text{C}$, e si allunga di
  $0{,}255\,\text{mm}$. Quanto vale il coefficiente di dilatazione lineare?" Risposta $8{,}5 \cdot 10^{-6}\,^\circ\text{C}^{-1}$;
  distrattori $0{,}0085\,^\circ\text{C}^{-1}$ (i millimetri non convertiti), $2{,}6 \cdot 10^{-4}\,^\circ\text{C}^{-1}$ ($\Delta t$
  dimenticato), $5{,}2 \cdot 10^{-6}\,^\circ\text{C}^{-1}$ (la temperatura finale al posto di $\Delta t$).

## Livello 4: un liquido che trabocca

Un recipiente pieno di acqua (tra $10$ e $40\,^\circ\text{C}$, dove vale il coefficiente della tabella) o di mercurio (tra $0$ e
$100\,^\circ\text{C}$), volume da $1{,}1$ a $9{,}9\,\text{L}$, aumento di almeno $5\,^\circ\text{C}$; la dilatazione del recipiente si
trascura, e il testo lo dice.

- "Un recipiente è pieno fino all'orlo di $1{,}4\,\text{L}$ di mercurio ($\alpha = 1{,}8 \cdot 10^{-4}\,^\circ\text{C}^{-1}$) a
  $41\,^\circ\text{C}$. Lo si scalda fino a $50\,^\circ\text{C}$. Quanti millilitri di liquido traboccano? Trascura la dilatazione
  del recipiente." Risposta $2{,}3\,\text{mL}$; distrattori $6{,}8\,\text{mL}$ ($3\alpha$, come per un solido),
  $0{,}0023\,\text{mL}$ (i litri non convertiti), $13\,\text{mL}$ (la temperatura finale).

## Livello 5: il volume di un solido

Una sfera, un cubo o un cilindro di uno dei sei materiali, volume da $11$ a $99\,\text{cm}^3$, temperatura iniziale da $10$ a
$30\,^\circ\text{C}$, aumento multiplo di $10$ da $50$ a $400\,^\circ\text{C}$; il testo dà $\lambda$, e serve $\alpha \approx 3\lambda$.

- "Una sfera d'acciaio ($\lambda = 1{,}2 \cdot 10^{-5}\,^\circ\text{C}^{-1}$) ha il volume di $55\,\text{cm}^3$ a
  $20\,^\circ\text{C}$. Di quanto aumenta il suo volume a $220\,^\circ\text{C}$?" Risposta $0{,}40\,\text{cm}^3$; distrattori
  $0{,}13\,\text{cm}^3$ ($\lambda$ al posto di $3\lambda$, l'avviso della lezione), $0{,}26\,\text{cm}^3$ ($2\lambda$, la
  superficie), $0{,}44\,\text{cm}^3$ (la temperatura finale).

## Esercizi da evitare

- L'acqua fuori dall'intervallo $10$-$40\,^\circ\text{C}$ (il coefficiente cambia molto; sotto $4\,^\circ\text{C}$ l'acqua si
  contrae).
- Allungamenti sotto $0{,}1\,\text{mm}$ o variazioni di volume sotto $0{,}01\,\text{cm}^3$ (livello 5) e $0{,}1\,\text{mL}$
  (livello 4).
- Dati misurati con più di tre cifre significative (livelli 2 e 3).

## Verifica

`fis_dilatazione_termica.py` rilegge il testo (con l'accordo e il corpo giusto per il vetro), controlla che i coefficienti
siano quelli delle tabelle, intervalli e cifre, ricalcola con i razionali e confronta l'opzione giusta e il formato delle
altre.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS. `review.mts` e
`width.mts` con codice 0 (opzioni al più 113 px su 252).

### Errori piantati

Bocciati tutti (200 su 200 per tipo): indice dell'opzione giusta, un numero del testo cambiato, testo dell'opzione giusta,
opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1: livello 1 1000, livello 2 997, livello 3 987, livello 4 995, livello 5 999.

## Domande per la revisione

- I simboli $\lambda$ (lineare) e $\alpha$ (volumica) sono quelli del README, "come l'Amaldi (da verificare)": se il libro usa
  $\alpha$ per la lineare e $\beta$ per la volumica, come molti testi, vanno cambiati qui, nella lezione e nel checker.
- Il livello 3 chiede il coefficiente, non il materiale: serve una variante "di che materiale è?" con i nomi nelle opzioni?
