# L'equazione di stato dei gas ideali

Generatore: `gas-ideali` (`src/lib/exercises/v2/generators/gas-ideali.ts`, con `src/lib/exercises/v2/chim-mole.ts`).
Verifica indipendente: `scripts/exercises/checkers/gas_ideali.py` (con `_chim_mole.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/37-gas-ideali.md`. Percorso nel database:
`high_school/chemistry/chim-quantita-sostanza/gas-ideali`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il volume di un gas
2. La pressione da una massa
3. Con le unità del SI
4. La temperatura
5. La massa molare
6. La densità di un gas

## Tipi di risposta e dati

Scelta multipla, quattro opzioni con l'unità ($\text{L}$, $\text{atm}$, $\text{mol}$, $^\circ\text{C}$, $\text{g/mol}$,
$\text{g/L}$). $R = 0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)}$ o $8{,}31\,\text{J/(mol}\cdot\text{K)}$,
$T = t + 273$. Dati con tre cifre significative e temperature in gradi interi, mai multipli di $10$; risultati con tre
cifre (la temperatura del livello 4 al grado). Quindici gas con le masse molari della lezione 01.

## Livello 1: il volume di un gas

$0{,}100$-$5{,}00\,\text{mol}$, $1$-$99\,^\circ\text{C}$, $0{,}500$-$5{,}00\,\text{atm}$; $V = nRT/p$. Distrattori: la
temperatura in gradi Celsius, $R = 8{,}31$ con atmosfere e litri, la pressione moltiplicata.

- "Che volume occupano $0{,}979\,\text{mol}$ di idrogeno a $52\,^\circ\text{C}$ e $0{,}519\,\text{atm}$?" Risposta
  $50{,}3\,\text{L}$; distrattori $8{,}05\,\text{L}$ (Celsius), $5{,}09 \cdot 10^3\,\text{L}$ ($R = 8{,}31$),
  $13{,}6\,\text{L}$.
- "... $2{,}00\,\text{mol}$ di ossigeno a $25\,^\circ\text{C}$ e $1{,}00\,\text{atm}$" Risposta $48{,}9\,\text{L}$.

## Livello 2: la pressione da una massa

$1{,}00$-$99{,}9\,\text{g}$ di un gas in $1{,}00$-$99{,}9\,\text{L}$ a $1$-$99\,^\circ\text{C}$: prima $n = m/M$.
Distrattori: la massa usata come moli, la temperatura in gradi Celsius, per gli elementi biatomici la massa dell'atomo.

- "Un recipiente di $10{,}0\,\text{L}$ contiene $64{,}0\,\text{g}$ di ossigeno, $\mathrm{O_2}$, a $27\,^\circ\text{C}$."
  Risposta $4{,}93\,\text{atm}$.
- "... $56{,}9\,\text{L}$ contiene $9{,}79\,\text{g}$ di idrogeno, $\mathrm{H_2}$, a $41\,^\circ\text{C}$" Risposta
  $2{,}20\,\text{atm}$; distrattori $4{,}44\,\text{atm}$ (la massa come moli), $0{,}287\,\text{atm}$, $4{,}39\,\text{atm}$.

## Livello 3: con le unità del SI

Una siringa di $100$-$999\,\text{mL}$ a $50{,}0$-$500\,\text{kPa}$ e $1$-$99\,^\circ\text{C}$: le moli con
$R = 8{,}31$, pressione in pascal e volume in metri cubi. Distrattori: kilopascal non convertiti (mille volte meno),
millilitri presi per litri (mille volte di più), $R = 0{,}0821$ con kilopascal e litri, la temperatura in gradi Celsius.

- "Una siringa contiene $569\,\text{mL}$ di idrogeno a $97{,}9\,\text{kPa}$ e $41\,^\circ\text{C}$." Risposta
  $0{,}0213\,\text{mol}$; distrattori $2{,}13 \cdot 10^{-5}$, $21{,}3$, $2{,}16\,\text{mol}$.

## Livello 4: la temperatura

$0{,}100$-$5{,}00\,\text{mol}$ in un volume con tre cifre (almeno $1\,\text{L}$) a $0{,}500$-$5{,}00\,\text{atm}$; si
costruisce da una temperatura di $11$-$199\,^\circ\text{C}$ e si ricalcola dai dati scritti: $t = pV/(nR) - 273$, al
grado, mai un multiplo di $10$. Distrattori: il valore in kelvin letto come gradi Celsius, $273$ sommato invece di
tolto, poi $t \pm 15$ e $t + 30$.

- "$4{,}64\,\text{mol}$ di idrogeno occupano $193\,\text{L}$ alla pressione di $0{,}581\,\text{atm}$. A quale
  temperatura, in gradi Celsius, si trova il gas?" Risposta $21\,^\circ\text{C}$; distrattori $294\,^\circ\text{C}$,
  $567\,^\circ\text{C}$, $36\,^\circ\text{C}$.

## Livello 5: la massa molare

$0{,}100$-$9{,}99\,\text{g}$ di un gas a $1$-$99\,^\circ\text{C}$ e $0{,}500$-$2{,}00\,\text{atm}$; il volume si calcola
dal gas vero e si arrotonda a tre cifre, e $M = mRT/(pV)$ si ricalcola dai dati scritti. Distrattori: la temperatura in
gradi Celsius, le condizioni normali ($m \cdot 22{,}4 / V$), la formula rovesciata.

- "Un recipiente di $0{,}560\,\text{L}$ contiene $1{,}00\,\text{g}$ di un gas, a $27\,^\circ\text{C}$ e
  $1{,}00\,\text{atm}$." Risposta $44{,}0\,\text{g/mol}$ (l'esempio 4 della lezione).
- "... $24{,}9\,\text{L}$ contiene $0{,}979\,\text{g}$ ... a $52\,^\circ\text{C}$ e $0{,}519\,\text{atm}$" Risposta
  $2{,}02\,\text{g/mol}$.

## Livello 6: la densità di un gas

Un gas a $1$-$199\,^\circ\text{C}$ e $0{,}500$-$5{,}00\,\text{atm}$: $d = pM/(RT)$. Distrattori: la densità in
condizioni normali ($M / 22{,}4$), la temperatura in gradi Celsius, la formula rovesciata.

- "Qual è la densità dell'idrogeno, $\mathrm{H_2}$, a $13\,^\circ\text{C}$ e $4{,}64\,\text{atm}$?" Risposta
  $0{,}399\,\text{g/L}$; distrattori $0{,}0902\,\text{g/L}$, $8{,}78\,\text{g/L}$, $2{,}51\,\text{g/L}$.

## Esercizi da evitare

- Temperature multiple di $10$ o a $0\,^\circ\text{C}$: con $t = 0$ il distrattore dei gradi Celsius sarebbe zero.
- Temperature del livello 4 a mezzo grado da un intero: scartate.

## Verifica

`gas_ideali.py` rilegge il testo, controlla intervalli e cifre dei dati, ricalcola con i razionali esatti e la sua copia
di $R$ e della tavola, arrotonda come la specifica; nel livello 5 controlla anche che la massa molare trovata sia
quella del gas dei `params`, a meno dell'arrotondamento del volume.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 119 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate, primo dato raddoppiato,
due dati scambiati bocciati 60 su 60. L'ultima cifra di un dato cambiata di uno è bocciata quando cambia il risultato
(48 su 60).

### Esercizi diversi su 1.000

Seed da 1: 1000 per ogni livello.

## Domande per la revisione

- Il livello 3 usa i millilitri e i kilopascal perché la conversione è l'errore da allenare; va bene, o si preferisce
  dare anche esercizi già in pascal e metri cubi?
