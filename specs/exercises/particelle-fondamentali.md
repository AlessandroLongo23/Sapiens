# Elettroni, protoni e neutroni

Generatore: `particelle-fondamentali` (`src/lib/exercises/v2/generators/particelle-fondamentali.ts`, con
`src/lib/exercises/v2/chim-atomo.ts`). Verifica indipendente: `scripts/exercises/checkers/particelle_fondamentali.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/40-particelle-fondamentali.md`. Percorso nel database:
`high_school/chemistry/atomo-struttura/particelle-fondamentali`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Le tre particelle
2. Chi e quando
3. La carica di un gruppo di particelle
4. Le masse
5. Le gocce di Millikan

## Tipi di risposta e dati

Scelta multipla, quattro opzioni. I dati sono quelli della tabella della lezione: elettrone $-1{,}60 \cdot 10^{-19}\,\text{C}$,
$9{,}11 \cdot 10^{-31}\,\text{kg}$, $0{,}000549\,\text{u}$; protone $+1{,}60 \cdot 10^{-19}\,\text{C}$,
$1{,}673 \cdot 10^{-27}\,\text{kg}$, $1{,}007\,\text{u}$; neutrone senza carica, $1{,}675 \cdot 10^{-27}\,\text{kg}$,
$1{,}009\,\text{u}$. Cariche con tre cifre significative ($-4{,}80 \cdot 10^{-19}\,\text{C}$), masse in chilogrammi con
tre cifre, masse in $\text{u}$ di un nucleo con tre decimali (la somma è esatta), masse di elettroni in $\text{u}$ con
tre cifre.

## Livello 1: le tre particelle

Una proprietà presa da un elenco (carica relativa, carica, massa in kg o in $\text{u}$, chi e quando l'ha scoperta,
dove si trova); le opzioni sono sempre "Elettrone", "Protone", "Neutrone", "Nessuna delle tre", ognuna giusta circa una
volta su quattro. "Nessuna delle tre" va con proprietà che non sono di nessuna delle tre: carica relativa $\pm 2$, massa
di circa $4\,\text{u}$, carica $-e$ con la massa di un nucleone, "scoperta da Millikan" (che misurò la carica, non
scoprì una particella).

- "Quale particella subatomica ha massa $1{,}009\,\text{u}$?" Risposta: neutrone.
- "Quale particella subatomica fu scoperta da Millikan nel 1909?" Risposta: nessuna delle tre.

## Livello 2: chi e quando

Sette scoperte della lezione: Crookes (i tubi, anni Settanta dell'Ottocento, senza anno), Goldstein 1886, Stoney 1891,
Thomson 1897, Millikan 1909, Rutherford 1919, Chadwick 1932. Metà: chi; metà: l'anno (senza Crookes).

- "Chi misurò la carica elementare con le gocce d'olio?" Risposta: Millikan.
- "In che anno Chadwick scoprì il neutrone?" Risposta: 1932.

## Livello 3: la carica di un gruppo di particelle

Da $3$ a $20$ protoni, da $0$ a $4$ neutroni in più dei protoni, carica relativa $\pm 1$, $\pm 2$ o $\pm 3$. Risposta
$(p - e)\,e$ in coulomb, con il segno. Distrattori: il segno opposto, i neutroni contati come positivi, protoni ed
elettroni sommati, la carica relativa scritta in coulomb ($-3\,\text{C}$).

- "$3$ protoni, $7$ neutroni e $6$ elettroni" Risposta $-4{,}80 \cdot 10^{-19}\,\text{C}$; distrattori
  $+4{,}80 \cdot 10^{-19}$, $+6{,}40 \cdot 10^{-19}$, $+1{,}44 \cdot 10^{-18}\,\text{C}$.
- "$5$ protoni, $6$ neutroni e $4$ elettroni" Risposta $+1{,}60 \cdot 10^{-19}\,\text{C}$.

## Livello 4: le masse

Un terzo ciascuno. La massa in $\text{u}$ di un nucleo (da $1$ a $20$ protoni, neutroni da $p$ a $p + p/4$; per
l'idrogeno $0$ o $1$), somma delle masse; distrattori: il numero di massa ($12{,}000\,\text{u}$), i neutroni
dimenticati, tutti pesati come neutroni o come protoni, le due masse scambiate. La stessa massa in kg, tre cifre;
distrattori: i neutroni dimenticati, i neutroni pesati come elettroni, un fattore dieci. La massa di $2$-$30$ elettroni
in $\text{u}$; distrattori: gli elettroni pesati come protoni, un fattore dieci, un elettrone solo.

- "Un nucleo contiene $13$ protoni e $13$ neutroni..." Risposta $26{,}208\,\text{u}$; distrattori
  $26{,}000$, $13{,}091$, $26{,}234\,\text{u}$.
- "Un atomo ha $26$ elettroni..." Risposta $0{,}0143\,\text{u}$.

## Livello 5: le gocce di Millikan

Metà: una goccia con carica $k\,e$, $k$ da $2$ a $15$, scritta con tre cifre; quante cariche elementari. Distrattori
$k \pm 1$, $k + 2$, $10k$. Metà: quattro cariche, tre multiple intere di $e$ (da $1$ a $12$) e una con un numero dispari
di mezze cariche ($1{,}5\,e$ fino a $11{,}5\,e$); si chiede quella impossibile.

- "... una carica di $1{,}12 \cdot 10^{-18}\,\text{C}$ ..." Risposta $7$.
- "Quale di queste cariche non può essere la carica di una goccia?" $8{,}80 \cdot 10^{-19}\,\text{C}$ tra
  $4{,}80 \cdot 10^{-19}$, $6{,}40 \cdot 10^{-19}$ e $1{,}12 \cdot 10^{-18}\,\text{C}$.

## Esercizi da evitare

- Nuclei molto lontani da quelli veri (due protoni e sei neutroni): i neutroni stanno tra $p$ e $p + p/4$.
- Proprietà che valgono per due particelle ("ha carica positiva" vale anche per una particella alfa): si usa la carica
  relativa.

## Verifica

`particelle_fondamentali.py` rilegge il testo, assegna la proprietà alla particella con la tabella e la storia della
lezione (regole sue, non l'elenco del generatore), ricalcola cariche e masse con i razionali esatti di SymPy e arrotonda
come la specifica; per Millikan controlla che la carica diviso $e$ sia intera.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 133 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice dell'opzione giusta, opzione doppia, testo dell'opzione giusta, parole vietate
bocciati 60 su 60; un numero del testo cambiato bocciato 40 su 45. I cinque che passano sono del livello 1 e restano
giusti: una carica relativa $+3$, "Millikan nel 2909" o una carica $-2{,}60 \cdot 10^{-19}\,\text{C}$ non sono di
nessuna delle tre particelle, come prima della modifica.
