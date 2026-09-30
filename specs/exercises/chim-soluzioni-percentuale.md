# Le soluzioni e la concentrazione percentuale

Generatore: `chim-soluzioni-percentuale` (`src/lib/exercises/v2/generators/chim-soluzioni-percentuale.ts`, con
`src/lib/exercises/v2/chim-materia.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_soluzioni_percentuale.py`
(con `_chim_stati_soluzioni.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/17-chim-soluzioni-percentuale.md`.
Percorso nel database: `high_school/chemistry/chim-materia/chim-soluzioni-percentuale`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La percentuale in massa
2. Soluto e solvente
3. Massa su volume
4. La percentuale in volume
5. Quanto soluto serve
6. La solubilità

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità: percentuali come $6{,}0\%$, masse in grammi. I numeri sono costruiti
all'indietro: le percentuali dei livelli 1-4 sono esatte e hanno due cifre significative (da $1{,}0$ a $9{,}9\%$ con un
decimale, da $10$ a $40\%$ intere; $8\%$ si scrive $8{,}0\%$), le masse del livello 5 e del corpo di fondo sono
esatte; la percentuale della soluzione satura ha tre cifre.

## Livello 1: la percentuale in massa

Massa della soluzione (da $50$ a $500\,\text{g}$) e del soluto (un decimale al più). Distrattori: il 100 dimenticato,
il rapporto rovesciato, la massa della soluzione presa per quella del solvente.

- "In $500\,\text{g}$ di una soluzione acquosa ci sono $18\,\text{g}$ di cloruro di sodio ..." Risposta $3{,}6\%$.

## Livello 2: soluto e solvente

Massa del soluto e dell'acqua, in grammi interi: prima si sommano. Distrattori: diviso per il solvente (l'avviso della
lezione), il 100 dimenticato, la percentuale del solvente.

- "Si sciolgono $12\,\text{g}$ di zucchero in $188\,\text{g}$ d'acqua ..." Risposta $6{,}0\%$; distrattore
  $6{,}4\%$.

## Livello 3: massa su volume

Massa del soluto e volume della soluzione, metà in mL e metà in L (da convertire). Distrattori: il volume in litri
nella formula, il 100 dimenticato, il rapporto rovesciato.

## Livello 4: la percentuale in volume

Etanolo in vino, birra, collutorio o soluzione di alcol in acqua, con il volume della soluzione dato (i volumi non si
sommano). Distrattori: diviso per il resto (come se fosse il solvente), il 100 dimenticato, i volumi sommati.

- "In una bottiglia di vino da $750\,\text{mL}$ ci sono $105\,\text{mL}$ di etanolo ..." Risposta $14\%$.

## Livello 5: quanto soluto serve

Una soluzione al $p\%$ in massa da $50$-$500\,\text{g}$: sei volte su dieci si chiede il soluto, $p \cdot m / 100$
(distrattori: il 100 dimenticato, $p$ grammi, "$p$ grammi in 100 g d'acqua" riportato alla soluzione), le altre
l'acqua, $m - m_{\text{soluto}}$ (distrattori: il soluto, la soluzione intera, la soluzione più il soluto, "$p$ grammi
in 100 g d'acqua").

## Livello 6: la solubilità

Sei solubilità in grammi per $100\,\text{g}$ d'acqua, scritte nel testo: cloruro di sodio $35{,}9$ a $20\,^\circ\text{C}$,
nitrato di potassio $31{,}6$ a $20$ e $63{,}9$ a $40\,^\circ\text{C}$, cloruro di potassio $34{,}0$, cloruro di ammonio
$37{,}2$, solfato di rame $20{,}7$ a $20\,^\circ\text{C}$ (da verificare, vedi le note della lezione). Metà: si mette
più soluto di quello che si scioglie in $100$-$400\,\text{g}$ d'acqua, e si chiede il corpo di fondo (distrattori: la
solubilità tolta senza riportarla all'acqua, la massa sciolta, la solubilità). Metà: la percentuale in massa della
soluzione satura, $100\,S/(100 + S)$ (distrattori: $S$ letta come percentuale, la percentuale dell'acqua,
$100\,S/(100 - S)$).

- "... cloruro di sodio è $35{,}9\,\text{g}$ in $100\,\text{g}$ d'acqua. Si mettono $173\,\text{g}$ ... in
  $400\,\text{g}$ d'acqua ..." Risposta $29{,}4\,\text{g}$ (se ne sciolgono $143{,}6\,\text{g}$).

## Esercizi da evitare

- Percentuali sopra il $40\%$ ai livelli 1-3 e 5; soluto sotto $1\,\text{g}$ (sotto $0{,}5\,\text{g}$ al livello 3).
- Risultati che non sono esatti con le cifre dette sopra.

## Verifica

`chim_soluzioni_percentuale.py` rilegge il testo, ricalcola con i razionali di SymPy, controlla che le percentuali dei
livelli 1-4 siano esatte a due cifre e che la solubilità del livello 6 sia quella della sua tabella.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 66 px).

### Errori piantati

Su 72 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate, un numero del testo
aumentato di uno bocciati 72 su 72.

### Esercizi diversi su 1.000

Seed da 1: livello 1 877, livello 2 779, livello 3 935, livello 4 196, livello 5 942, livello 6 385.

## Domande per la revisione

- Due cifre significative per le percentuali dei livelli 1-4 anche quando i dati ne hanno tre (per esempio
  $17{,}7\,\text{g}$ in $300\,\text{g}$ dà $5{,}9\%$): va bene, o si scrive $5{,}90\%$?
