# Note: Le leggi di Charles e di Gay-Lussac

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026).

## Cosa c'è

La legge di Charles con la temperatura in gradi Celsius, $V = V_0(1 + t/273)$, e il grafico $V$-$t$ che punta a
$-273\,^\circ\text{C}$; lo zero assoluto e la scala Kelvin, la legge come proporzionalità diretta $V/T$ costante e il
grafico $V$-$T$; gli esempi 1 (palloncino nel congelatore) e 2 (raddoppio del volume) con l'avviso sui gradi Celsius; la
legge di Gay-Lussac a volume costante con il grafico $p$-$T$, la spiegazione con le particelle, gli esempi 3 (gomme
d'estate) e 4 (bomboletta nel fuoco); la figura interattiva; un avviso su come scegliere tra le due leggi e un riquadro
sui nomi "prima e seconda legge di Gay-Lussac".

Conti rifatti in Python: $2{,}50 \cdot 255/298 = 2{,}139$; $2 \cdot 300 - 273 = 327$; $293/283 = 1{,}035$;
$2{,}40 \cdot 318/288 = 2{,}65$; $3{,}0 \cdot 673/293 = 6{,}89$. Punti dei grafici: $V_0 = 1{,}00\,\text{L}$ a
$0\,^\circ\text{C}$, $1{,}183$, $1{,}366$, $1{,}549\,\text{L}$ a $50$, $100$, $150\,^\circ\text{C}$; $p_0 = 2{,}0\,\text{atm}$
a $273\,\text{K}$, $2{,}37$, $2{,}73$, $3{,}10\,\text{atm}$. `check.mts` passa.

## Scelte

- Nomi: il titolo nel database dice "Charles e Gay-Lussac", quindi Charles per la pressione costante e Gay-Lussac per il
  volume costante, come i libri in inglese e alcuni italiani (da verificare quali). Il riquadro finale dà i nomi dei
  libri di fisica italiani (prima e seconda legge di Gay-Lussac) e la forma con $\alpha = 1/273\,^\circ\text{C}^{-1}$.
  La legge a volume costante si attribuisce anche ad Amontons (1702); non lo nomino.
- Storia: Charles alla fine del Settecento (1787, non pubblicato), Gay-Lussac 1802 (da verificare le date sul libro).
- Il grafico $V$-$t$ ha l'asse dei volumi a sinistra, a $-300\,^\circ\text{C}$, non a $0\,^\circ\text{C}$: con l'asse in
  mezzo le etichette dei volumi finivano sulla retta.

## Figure

Tre TikZ, guardate in chiaro e in scuro, tutte con la riga `% poi-interattivo`: `charles-volume-temperatura-celsius` (retta
tratteggiata fino a $-273\,^\circ\text{C}$, segnato in rosso), `charles-volume-temperatura-kelvin` (la stessa retta per
l'origine), `gay-lussac-pressione-temperatura`. Interattiva `gas-cilindro-charles` (`chimica/GasCilindroCharles.tsx`: il
cilindro della lezione 31 aperto con la pressione costante; con il bottone "V costante" diventa Gay-Lussac, con il
pistone fermato da due arresti). Guardata in chiaro, in scuro, sul telefono.

## Esercizi

Generatore `chim-legge-charles-gay-lussac`, cinque livelli (specifica in
`specs/exercises/chim-legge-charles-gay-lussac.md`): Charles in kelvin; Charles in gradi Celsius; Gay-Lussac; la
temperatura finale; dal grafico volume-temperatura (scena `grafico-dati` con la retta per l'origine). Il grafico degli
esercizi è in kelvin perché `grafico-dati` non disegna assi negativi: il grafico in gradi Celsius con la retta che taglia
l'asse a $-273$ resta solo nella lezione.

## Domande per Andrea

- Charles e Gay-Lussac o prima e seconda legge di Gay-Lussac: quale nome usano i libri di chimica delle vostre classi?
- La forma con i gradi Celsius, $V = V_0(1 + t/273)$, va insegnata in chimica, o basta la forma in kelvin?
- $-273\,^\circ\text{C}$ o $-273{,}15\,^\circ\text{C}$ nel testo: la lezione dà il secondo tra parentesi e usa $273$ nei conti.
