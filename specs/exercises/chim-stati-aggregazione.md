# Gli stati di aggregazione

Generatore: `chim-stati-aggregazione` (`src/lib/exercises/v2/generators/chim-stati-aggregazione.ts`, con
`src/lib/exercises/v2/chim-materia.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_stati_aggregazione.py`
(con `_chim_stati_soluzioni.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/14-chim-stati-aggregazione.md`.
Percorso nel database: `high_school/chemistry/chim-materia/chim-stati-aggregazione`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le proprietà dei tre stati
2. Lo stato a una temperatura
3. La temperatura in kelvin
4. Quale sostanza
5. Il volume cambia con lo stato

## Tipi di risposta

Scelta multipla, quattro opzioni. Livelli 1-4: opzioni in parole (una proprietà, uno stato, una sostanza); livello 5:
un volume con l'unità, tre cifre significative per il ghiaccio e due per il vapore, come i dati delle densità. Le
temperature di fusione e di ebollizione, alla pressione atmosferica e arrotondate al grado, sono quelle della lezione
più sei (metano, acetone, ammoniaca, iodio, piombo, rame), scritte nel testo o nella tabella dell'esercizio.

## Livello 1: le proprietà dei tre stati

Un campione di materia (cubetto di ghiaccio, moneta di rame, acqua di un bicchiere, aria di un pallone...) e lo stato
in cui è. Sei volte su dieci si chiede la proprietà che ha, quattro volte su dieci quella che NON ha. Le nove proprietà
della lezione: forma propria (solido), volume proprio (solido, liquido), prende la forma del recipiente (liquido,
aeriforme), occupa tutto il recipiente (aeriforme), si comprime facilmente (aeriforme), quasi incomprimibile (solido,
liquido), superficie libera orizzontale (liquido), rigido (solido), scorre (liquido, aeriforme). I distrattori sono
tre proprietà del gruppo opposto.

- "L'elio di un palloncino è un aeriforme. Quale di queste proprietà NON ha?" Risposta: è quasi incomprimibile;
  distrattori: occupa tutto il recipiente, prende la forma del recipiente, si comprime facilmente.

## Livello 2: lo stato a una temperatura

Una sostanza con fusione e ebollizione a almeno 10 gradi di distanza, una temperatura in gradi Celsius ad almeno 5
gradi da tutte e due (mai sotto $-268\,^\circ\text{C}$), stato scelto a caso tra i tre. Opzioni fisse: solido,
liquido, aeriforme, "solido e liquido insieme" (lo stato che c'è solo alla temperatura di fusione: la temperatura
dell'esercizio non è mai quella).

- "Alla pressione atmosferica l'azoto fonde a $-210\,^\circ\text{C}$ e bolle a $-196\,^\circ\text{C}$. In che stato si
  trova a $-203\,^\circ\text{C}$?" Risposta: liquido.

## Livello 3: la temperatura in kelvin

Come il livello 2, con la temperatura in kelvin ($T = t + 273$) e quelle della sostanza in gradi Celsius; niente
sostanze che fondono sopra $1000\,^\circ\text{C}$. In circa sei casi su dieci chi confronta i kelvin con i gradi
Celsius senza convertire trova un altro stato (caso "trappola"), l'errore dell'avviso della lezione.

- "... lo iodio fonde a $114\,^\circ\text{C}$ e bolle a $184\,^\circ\text{C}$. In che stato si trova alla
  temperatura di $487\,\text{K}$?" Risposta: aeriforme ($214\,^\circ\text{C}$).

## Livello 4: quale sostanza

Una tabella con quattro sostanze, le loro temperature di fusione e di ebollizione, una temperatura multipla di 5 tra
$-200$ e $300\,^\circ\text{C}$ ad almeno 3 gradi da ogni confine; una sola sostanza è nello stato chiesto. Le opzioni
sono le quattro sostanze.

- Tabella piombo, ossigeno, cloruro di sodio, ferro; "Quale è allo stato aeriforme a $190\,^\circ\text{C}$?" Risposta:
  ossigeno.

## Livello 5: il volume cambia con lo stato

Metà: una massa d'acqua da $120$ a $900\,\text{g}$ che ghiaccia, densità del ghiaccio $0{,}917\,\text{g/mL}$; si chiede
il volume del ghiaccio, $V = m/d$ a tre cifre. Distrattori: $m \cdot d$ (la densità moltiplicata), $m$ (il volume
dell'acqua liquida), $V - m$ (solo l'aumento). Metà: da $1{,}1$ a $9{,}9\,\text{g}$ d'acqua che bolle, densità del
vapore $0{,}60\,\text{g/L}$; volume del vapore in litri, due cifre. Distrattori: lo stesso numero in mL (g/L letto
come g/mL), $m \cdot d$ in L, $m$ in mL (il volume dell'acqua liquida).

- "Una bottiglia contiene $168\,\text{g}$ d'acqua ..." Risposta $183\,\text{mL}$; distrattori $154$, $168$,
  $15{,}2\,\text{mL}$.
- "Si fanno bollire $1{,}1\,\text{g}$ d'acqua ..." Risposta $1{,}8\,\text{L}$; distrattori $1{,}8\,\text{mL}$,
  $0{,}66\,\text{L}$, $1{,}1\,\text{mL}$.

## Esercizi da evitare

- Temperature a meno di 5 gradi da un passaggio di stato (livelli 2-3), a meno di 3 nella tabella (livello 4).
- Sostanze con meno di 10 gradi tra fusione ed ebollizione ai livelli 2-3 (non c'è posto per un liquido lontano dai
  confini).
- Risultati a meno di $10^{-6}$ da un confine di arrotondamento.

## Verifica

`chim_stati_aggregazione.py` rilegge il testo, ha la sua tabella delle temperature e delle proprietà, riconosce
campioni e sostanze, ricalcola stato e volume con i razionali di SymPy; controlla che le opzioni siano quattro e
diverse e che la giusta sia quella segnata.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (tabella del livello 4 al più 320 px su 350, opzioni al più
196 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un numero del testo aumentato di uno bocciato 38 su 48: gli altri sono temperature dei livelli 2-4
che, cambiate di un grado, danno lo stesso stato, quindi non sono errori.

### Esercizi diversi su 1.000

Seed da 1: livello 1 557, livello 2 851, livello 3 839, livello 4 1000, livello 5 469.

## Domande per la revisione

- La quarta opzione fissa dei livelli 2 e 3, "solido e liquido insieme", va bene come distrattore, o si preferisce
  cambiare tipo di domanda?
- Le temperature delle sei sostanze aggiunte sono da verificare su una tabella (vedi le note della lezione).
