# La formula chimica e il suo significato

Generatore: `chim-formula-chimica` (`src/lib/exercises/v2/generators/chim-formula-chimica.ts`, con
`src/lib/exercises/v2/chim-trasformazioni.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_formula_chimica.py`
(con `_chim_trasformazioni.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/28-chim-formula-chimica.md`.
Percorso nel database: `high_school/chemistry/chim-trasformazioni-chimiche/chim-formula-chimica`.

Sei livelli, ognuno con una difficoltà in più. Risposte a scelta multipla: un numero intero di atomi (livelli 1-5) o
una formula (livello 6).

## Nomi dei livelli

1. Leggere gli indici
2. Tutti gli atomi
3. Il coefficiente
4. Le parentesi
5. Gli idrati
6. La formula dagli ioni

## Formule

Composti veri con il loro nome: 27 formule senza parentesi (molecolari, come $\mathrm{H_2SO_4}$ e
$\mathrm{C_8H_{10}N_4O_2}$, e ioniche, come $\mathrm{CaCO_3}$ e $\mathrm{Na_3PO_4}$), 17 con le parentesi
($\mathrm{Ca(OH)_2}$, $\mathrm{Al_2(SO_4)_3}$, $\mathrm{(NH_4)_3PO_4}$...), 10 idrati ($\mathrm{CuSO_4 \cdot 5H_2O}$,
$\mathrm{Na_2CO_3 \cdot 10H_2O}$...). Per le sostanze molecolari la domanda dice "una molecola", per le ioniche
"un'unità formula".

## Livello 1: leggere gli indici

"Quanti atomi di ossigeno ci sono in un'unità formula di carbonato di calcio, $\mathrm{CaCO_3}$?" Risposta $3$;
distrattori gli indici degli altri elementi e il totale degli atomi ($1$, $5$), poi numeri vicini.

"... in un'unità formula di ossido di ferro(III), $\mathrm{Fe_2O_3}$?" Risposta $3$.

## Livello 2: tutti gli atomi

Formule con almeno un indice $1$ non scritto. "Quanti atomi ci sono in tutto in un'unità formula di carbonato di
calcio, $\mathrm{CaCO_3}$?" Risposta $5$; distrattori $3$ (gli indici $1$ saltati, qui anche il numero di elementi), poi $4$ e $6$.

## Livello 3: il coefficiente

Coefficiente da 2 a 5, risultato al più 40. "Quanti atomi di ossigeno ci sono in $4\,\mathrm{Fe_2O_3}$, cioè in $4$
unità formula di ossido di ferro(III)?" Risposta $12$; distrattori $7$ (coefficiente sommato all'indice), $3$ (solo
l'indice), $20$ (il coefficiente per tutti gli atomi).

"... atomi di calcio ... $5\,\mathrm{CaCO_3}$ ..." Risposta $5$; distrattori $6$, $1$, $25$.

## Livello 4: le parentesi

Tre volte su quattro un elemento che sta solo dentro la parentesi, una volta su quattro tutti gli atomi.

"Quanti atomi di ossigeno ci sono in un'unità formula di fosfato di magnesio, $\mathrm{Mg_3(PO_4)_2}$?" Risposta $8$;
distrattori $4$ (l'indice fuori dimenticato), $6$ (i due indici sommati), $2$ (solo l'indice fuori).

"Quanti atomi di azoto ... solfato di ammonio, $\mathrm{(NH_4)_2SO_4}$?" Risposta $2$.

## Livello 5: gli idrati

Ossigeno, idrogeno o tutti gli atomi, con la stessa probabilità. Distrattori: solo il sale; l'acqua contata una
volta; il coefficiente dell'acqua non moltiplicato per l'indice.

"Quanti atomi di idrogeno ci sono in un'unità formula di cloruro di calcio esaidrato, $\mathrm{CaCl_2 \cdot 6H_2O}$?"
Risposta $12$; distrattori $2$, $8$, $13$.

"Quanti atomi ci sono in tutto in ... solfato di sodio decaidrato, $\mathrm{Na_2SO_4 \cdot 10H_2O}$?" Risposta $37$;
distrattori $7$ (solo il sale), $10$, $17$.

## Livello 6: la formula dagli ioni

Otto cationi ($\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{NH_4^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$,
$\mathrm{Fe^{2+}}$, $\mathrm{Fe^{3+}}$, $\mathrm{Al^{3+}}$) e undici anioni (fluoruro, cloruro, bromuro, idrossido,
nitrato, ossido, solfuro, solfato, carbonato, nitruro, fosfato), senza le coppie che non danno un composto del
biennio (ammonio con idrossido, ossido, nitruro e fluoruro; nitruri diversi da quelli di magnesio, calcio e
alluminio; carbonati e solfuri dei cationi $3+$). Distrattori: gli indici scambiati, un ione per tipo, le parentesi
dimenticate, lo scambio delle cariche senza semplificare, un ione in più.

"Qual è la formula del composto formato dagli ioni $\mathrm{Fe^{3+}}$ e $\mathrm{O^{2-}}$ (ossido di ferro(III))?"
Risposta $\mathrm{Fe_2O_3}$; distrattori $\mathrm{Fe_3O_2}$, $\mathrm{FeO}$, $\mathrm{Fe_2O_4}$.

"... $\mathrm{Fe^{2+}}$ e $\mathrm{CO_3^{2-}}$ ..." Risposta $\mathrm{FeCO_3}$; distrattori
$\mathrm{Fe_2(CO_3)_2}$, $\mathrm{Fe_2CO_3}$, $\mathrm{Fe(CO_3)_2}$.

## Esercizi da evitare

- Opzioni con gli stessi atomi della risposta (sarebbero giuste anche loro).
- Al livello 4, elementi che compaiono anche fuori dalla parentesi (la domanda non misurerebbe la parentesi).

## Verifica

Il controllo legge la formula dal LaTeX e la conta con un parser suo (parentesi annidate, punto degli idrati);
controlla che il nome corrisponda alla formula (tabella propria dei composti) e che "molecola" o "unità formula"
corrispondano alla sostanza (un metallo o lo ione ammonio la fanno ionica). Al livello 6 trova il rapporto neutro più
piccolo tra i due ioni e accetta solo l'opzione con quegli atomi e con le parentesi dove servono.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 91 px su 252).

### Errori piantati

Su 72 esercizi (12 per livello, seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta,
parole vietate bocciati 72 su 72; una cifra del testo aumentata di uno bocciata 65 su 65 (cambia un indice, e il nome
del composto non corrisponde più alla formula).

### Esercizi diversi su 1.000

Seed da 1: livello 1 750, livello 2 371, livello 3 918, livello 4 699, livello 5 552, livello 6 743.
