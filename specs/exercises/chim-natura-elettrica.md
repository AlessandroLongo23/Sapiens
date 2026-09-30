# La natura elettrica della materia

Generatore: `chim-natura-elettrica` (`src/lib/exercises/v2/generators/chim-natura-elettrica.ts`, con
`src/lib/exercises/v2/chim-atomo.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_natura_elettrica.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/39-chim-natura-elettrica.md`. Percorso nel database:
`high_school/chemistry/atomo-struttura/chim-natura-elettrica`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Attrazione e repulsione
2. Conduttori e isolanti
3. Lo strofinio
4. Contare gli elettroni
5. Due sfere a contatto

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Le cariche in $\text{nC}$ con il segno e un decimale ($+3{,}2\,\text{nC}$), i numeri
di elettroni con due cifre significative in notazione scientifica ($5{,}0 \cdot 10^{10}$), come la lezione. Carica
elementare $e = 1{,}60 \cdot 10^{-19}\,\text{C}$, scritta nel testo. Mai risultati a meno di $10^{-6}$ da un confine
di arrotondamento.

## Livello 1: attrazione e repulsione

Tre corpi $A$, $B$, $C$, tutti carichi (lo si dice, perché un corpo carico attira anche un corpo neutro); il segno di
$A$ e due relazioni ($A$-$B$, $B$-$C$) estratti a caso. Metà: il segno di $C$, opzioni fisse "Positiva", "Negativa",
"Nessuna: è neutro", "Non si può stabilire". Metà: che cosa fanno $A$ e $C$ avvicinati, opzioni "Si attraggono", "Si
respingono", "Non si fanno forze", "Dipende dalla distanza".

- "$A$ ha carica negativa; $A$ e $B$ si respingono, $B$ e $C$ si attraggono. Che cosa succede avvicinando $A$ e $C$?"
  Risposta: si attraggono.
- "$A$ ha carica positiva; $A$ e $B$ si attraggono, $B$ e $C$ si attraggono. Che carica ha $C$?" Risposta: positiva.

## Livello 2: conduttori e isolanti

Conduttori della lezione: rame, ferro, alluminio, argento, grafite, acqua salata, corpo umano. Isolanti: vetro,
plastica, gomma, legno secco, aria secca. Metà: un conduttore e tre isolanti, "Quale è un conduttore?"; metà il
contrario.

- "Quale di questi materiali è un isolante?" Vetro, corpo umano, acqua salata, argento. Risposta: vetro.
- "Quale di questi materiali è un conduttore?" Grafite, gomma, plastica, aria secca. Risposta: grafite.

## Livello 3: lo strofinio

Quattro coppie con il segno vero: vetro e seta (vetro positivo), plastica e lana, palloncino e capelli, pettine e
capelli (oggetto negativo). Metà: l'oggetto ha una carica da $1{,}1$ a $9{,}9\,\text{nC}$ (decimi non nulli), si chiede
quella del panno o dei capelli; distrattori: lo stesso segno, zero, metà, il doppio. Metà: il verso degli elettroni;
distrattori: il verso opposto, le cariche positive che si spostano, "lo strofinio crea le cariche".

- "Una bacchetta di vetro strofinata con un panno di seta acquista una carica di $+3{,}2\,\text{nC}$. Quale carica
  acquista il panno di seta?" Risposta $-3{,}2\,\text{nC}$.
- "Un palloncino strofinato sui capelli acquista una carica negativa. Che cosa è successo?" Risposta: gli elettroni
  passano dai capelli al palloncino.

## Livello 4: contare gli elettroni

Carica con due cifre significative, metà in $\text{nC}$ (da $1{,}0$ a $99\,\text{nC}$), metà in coulomb con
$10^{-10}$-$10^{-14}$; segno a caso. Risposta $N = |Q|/e$ con due cifre, e "in più" se la carica è negativa, "in meno" se
è positiva. Distrattori: il verso sbagliato, i nanocoulomb non convertiti (o un fattore dieci), la carica moltiplicata
per $e$.

- "Un oggetto ha una carica di $-8{,}0\,\text{nC}$..." Risposta $5{,}0 \cdot 10^{10}$ in più; distrattori
  $5{,}0 \cdot 10^{10}$ in meno, $5{,}0 \cdot 10^{19}$ in più, $1{,}3 \cdot 10^{-27}$ in più.
- "... $+5{,}5 \cdot 10^{-12}\,\text{C}$ ..." Risposta $3{,}4 \cdot 10^{7}$ in meno.

## Livello 5: due sfere a contatto

Cariche intere da $-12$ a $+12\,\text{nC}$ (non nulle, diverse, somma pari), scritte con un decimale; circa tre coppie su
quattro di segno opposto. Metà: la carica di ciascuna, $(Q_A + Q_B)/2$; distrattori: le cariche sommate senza segno, la
somma non dimezzata, la differenza dimezzata, la carica di partenza. Metà: gli elettroni che passano,
$|Q_A - Q_{fin}|/e$, due cifre; distrattori: la somma al posto della differenza, la differenza non dimezzata, i nC non
convertiti, un fattore dieci.

- "$Q_A = +6{,}0\,\text{nC}$ e $Q_B = -4{,}0\,\text{nC}$ ... Quale carica ha ciascuna sfera?" Risposta
  $+1{,}0\,\text{nC}$; distrattori $+5{,}0$, $+2{,}0$, $-5{,}0\,\text{nC}$.
- "$Q_A = -11{,}0\,\text{nC}$ e $Q_B = +5{,}0\,\text{nC}$ ... Quanti elettroni passano?" Risposta
  $5{,}0 \cdot 10^{10}$.

## Esercizi da evitare

- Una relazione "si attraggono" tra corpi di cui non si dice che sono tutti carichi (livello 1).
- Numeri di elettroni su un confine di arrotondamento (per esempio $1\,\text{nC}$, che dà $6{,}25 \cdot 10^9$).

## Verifica

`chim_natura_elettrica.py` rilegge il testo di ogni livello, ricostruisce segni, materiali e cariche con le regole della
lezione (con i razionali esatti di SymPy per i conti), controlla i segni veri delle coppie strofinate, arrotonda come la
specifica e controlla l'opzione giusta, che le opzioni siano quattro e diverse.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 189 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un numero del testo cambiato bocciato 30 su 30 (i livelli 1, 2 e metà del 3 non hanno numeri).
