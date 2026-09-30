# Miscele di gas e pressioni parziali

Generatore: `chim-pressioni-parziali` (`src/lib/exercises/v2/generators/chim-pressioni-parziali.ts`, con
`src/lib/exercises/v2/chim-mole.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_pressioni_parziali.py`
(con `_chim_mole.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/38-chim-pressioni-parziali.md`. Percorso nel
database: `high_school/chemistry/chim-quantita-sostanza/chim-pressioni-parziali`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La legge di Dalton
2. La frazione molare
3. Con l'equazione di stato
4. Una miscela in grammi
5. Un gas raccolto sopra l'acqua

## Tipi di risposta e dati

Scelta multipla, quattro opzioni con l'unità. Livello 1 in kilopascal con un decimale (somme e differenze: il
risultato ha i decimali dei dati); gli altri in atmosfere o moli con tre cifre significative. Dieci gas (azoto,
ossigeno, idrogeno, anidride carbonica, metano, ammoniaca, monossido di carbonio, cloro, anidride solforosa, propano),
masse molari della lezione 01; $R = 0{,}0821$, $T = t + 273$, $1\,\text{atm} = 760\,\text{mmHg}$.

## Livello 1: la legge di Dalton

Tre gas, pressioni parziali $1{,}1$-$59{,}9\,\text{kPa}$ con un decimale (l'ultima cifra mai zero). Metà: la
pressione totale; distrattori le somme di due pressioni sole. Metà: la pressione totale e due parziali, trovare la
terza; distrattori una sola pressione tolta, le due sommate al totale, la somma delle due note.

- "Una miscela di monossido di carbonio, cloro e idrogeno ha pressione totale $67{,}1\,\text{kPa}$. Le pressioni
  parziali dei primi due gas sono $39{,}3\,\text{kPa}$ e $9{,}6\,\text{kPa}$. Qual è la pressione parziale
  dell'idrogeno?" Risposta $18{,}2\,\text{kPa}$; distrattori $27{,}8$, $57{,}5$, $116{,}0\,\text{kPa}$.
- "Una miscela contiene azoto, ossigeno e anidride carbonica, con pressioni parziali ..." Risposta la somma.

## Livello 2: la frazione molare

Due gas, $0{,}100$-$5{,}00\,\text{mol}$ ciascuno, pressione totale $0{,}500$-$5{,}00\,\text{atm}$: $p_1 = x_1 p_{tot}$.
Distrattori: le moli per la pressione totale (senza frazione molare), il rapporto con l'altro gas, la parte dell'altro
gas.

- "Una miscela contiene $0{,}660\,\text{mol}$ di monossido di carbonio, $\mathrm{CO}$, e $0{,}632\,\text{mol}$ di
  cloro, $\mathrm{Cl_2}$, alla pressione totale di $3{,}06\,\text{atm}$." Risposta $1{,}56\,\text{atm}$; distrattori
  $2{,}02$, $3{,}20$, $1{,}50\,\text{atm}$.

## Livello 3: con l'equazione di stato

Due gas, $0{,}100$-$2{,}00\,\text{mol}$, in $1{,}00$-$99{,}9\,\text{L}$ a $1$-$99\,^\circ\text{C}$ (mai multipli di
$10$). Metà chiede la pressione parziale del primo gas, metà la totale. Distrattori: la temperatura in gradi Celsius,
parziale e totale scambiate, la pressione dell'altro gas.

- "Un recipiente di $10{,}0\,\text{L}$ contiene $0{,}400\,\text{mol}$ di azoto e $0{,}100\,\text{mol}$ di ossigeno a
  $27\,^\circ\text{C}$" (l'esempio 1 della lezione) Risposta $0{,}985\,\text{atm}$ o $1{,}23\,\text{atm}$.
- "... $51{,}2\,\text{L}$ ... $0{,}660\,\text{mol}$ di monossido di carbonio ... $23\,^\circ\text{C}$" Risposta
  $0{,}313\,\text{atm}$.

## Livello 4: una miscela in grammi

Due gas, $1{,}00$-$99{,}9\,\text{g}$ ciascuno, pressione totale $0{,}500$-$5{,}00\,\text{atm}$: prima le moli, poi la
frazione molare. Distrattori: la frazione in massa (l'avviso della lezione), le moli per la pressione totale, la parte
dell'altro gas.

- "Una bombola contiene $8{,}00\,\text{g}$ di metano e $32{,}0\,\text{g}$ di ossigeno alla pressione totale di
  $1{,}50\,\text{atm}$" (l'esempio 3 della lezione) Risposta $0{,}499\,\text{atm}$; distrattore $0{,}300\,\text{atm}$.
- "... $6{,}60\,\text{g}$ di monossido di carbonio e $6{,}32\,\text{g}$ di cloro ... $3{,}06\,\text{atm}$" Risposta
  $2{,}22\,\text{atm}$.

## Livello 5: un gas raccolto sopra l'acqua

$100$-$999\,\text{mL}$ di idrogeno, ossigeno o azoto raccolti a $18$-$30\,^\circ\text{C}$ (tranne $29$), pressione
atmosferica $735$-$775\,\text{mmHg}$ (mai con lo zero finale); il testo dà la tensione di vapore dell'acqua a quella
temperatura. Distrattori: la tensione di vapore non tolta, sommata, la temperatura in gradi Celsius.

- "Si raccolgono $632\,\text{mL}$ di azoto sopra l'acqua, a $26\,^\circ\text{C}$, con la pressione atmosferica di
  $766\,\text{mmHg}$. A $26\,^\circ\text{C}$ la tensione di vapore dell'acqua è $25{,}2\,\text{mmHg}$." Risposta
  $0{,}0251\,\text{mol}$; distrattori $0{,}0259$ (vapore non tolto), $0{,}0268$ (sommato), $0{,}289\,\text{mol}$.

Tensione di vapore dell'acqua in mmHg: 18 °C $15{,}5$; 19 $16{,}5$; 20 $17{,}5$; 21 $18{,}7$; 22 $19{,}8$; 23 $21{,}1$;
24 $22{,}4$; 25 $23{,}8$; 26 $25{,}2$; 27 $26{,}7$; 28 $28{,}3$; 30 $31{,}8$ (tabella del CRC Handbook come la riportano
i libri, da verificare con Andrea). A 29 °C la tabella dà $30{,}0$, con uno zero finale ambiguo: escluso.

## Esercizi da evitare

- Nel livello 1, somme che finiscono con uno zero dopo la virgola sono ammesse ($116{,}0$): la virgola dice che lo zero
  è significativo.
- Due gas uguali nella stessa miscela.

## Verifica

`chim_pressioni_parziali.py` rilegge il testo, controlla intervalli e cifre dei dati, ricalcola con i razionali
esatti; nel livello 5 confronta la tensione di vapore con la sua copia della tabella.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 119 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, testo dell'opzione giusta, parole vietate, primo dato raddoppiato
bocciati 60 su 60; due dati scambiati bocciati 52 su 60 (gli 8 che passano sono somme del livello 1, dove scambiare
due addendi non cambia il risultato). L'ultima cifra di un dato cambiata di uno è bocciata quando cambia il risultato.

### Esercizi diversi su 1.000

Seed da 1: 1000 per i livelli 1-4, 997 per il 5.

## Domande per la revisione

- La tensione di vapore dell'acqua va data nel testo, come qui, o lo studente la deve leggere da una tabella?
