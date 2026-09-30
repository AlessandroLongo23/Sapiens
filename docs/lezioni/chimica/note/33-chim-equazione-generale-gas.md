# Note: L'equazione generale dei gas

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026).

## Cosa c'è

La derivazione in due tappe (un'isoterma, poi un'isobara) con la figura sul piano $p$-$V$; l'equazione
$p_1 V_1/T_1 = p_2 V_2/T_2$ e $pV/T$ costante; la tabella dei tre casi particolari; il procedimento in cinque passi; gli
esempi 1 (si cambia tutto), 2 (il pallone sonda) e 3 (la temperatura finale) e l'avviso su kelvin e pressione assoluta;
le condizioni normali con l'esempio 4 e un riquadro su condizioni normali, standard IUPAC e ambiente; la costante che
dipende dalla quantità di gas, con il rimando al principio di Avogadro e all'equazione di stato dei gas ideali, e l'avviso
sul recipiente che perde. La lezione si ferma prima di $pV = nRT$ e lo lascia alla lezione del gruppo 27 con un link.

Conti rifatti in Python: $1{,}00 \cdot 5{,}00 \cdot 400/(300 \cdot 2{,}00) = 3{,}33$ (controllo $2{,}5 \cdot 4/3 = 3{,}33$);
$750 \cdot 4{,}00 \cdot 220/(290 \cdot 200) = 11{,}38$; $293 \cdot 2{,}50 \cdot 1{,}50/3{,}00 = 366{,}25$, $93\,^\circ\text{C}$;
$740 \cdot 250 \cdot 273/(298 \cdot 760) = 223{,}0$; con i gradi Celsius nell'esempio 1, $11{,}76$. `check.mts` passa.

## Scelte

- Condizioni normali $0\,^\circ\text{C}$ e $1\,\text{atm}$, come il README di chimica (da confermare con Andrea); il
  riquadro nomina $0\,^\circ\text{C}$ e $1\,\text{bar}$ (IUPAC, dal 1982) e $25\,^\circ\text{C}$ e $1\,\text{atm}$, senza
  il volume molare, che è del gruppo 27.
- Il pallone sonda: $750\,\text{mmHg}$ e $17\,^\circ\text{C}$ a terra, $200\,\text{mmHg}$ e $-53\,^\circ\text{C}$ a
  $10\,\text{km}$ (l'atmosfera standard dà circa $265\,\text{hPa} = 199\,\text{mmHg}$ e $-50\,^\circ\text{C}$ a
  $10\,\text{km}$, da verificare).
- La lezione ripete le tre leggi solo nella tabella: sono già nelle due lezioni precedenti.

## Figure

Una TikZ, guardata in chiaro e in scuro: `equazione-generale-due-tappe` (due isoterme tratteggiate, la tappa isoterma in
blu e quella isobara in arancione), con la riga `% poi-interattivo`. Nessuna interattiva: il cilindro delle lezioni 31 e
32 cambia una grandezza per volta, e una figura in cui cambiano tutte e tre non aggiungerebbe molto.

## Esercizi

Generatore `chim-equazione-generale-gas`, cinque livelli (specifica in `specs/exercises/chim-equazione-generale-gas.md`):
quale legge; cambia tutto; gradi Celsius e millilitri; la temperatura finale; le condizioni normali. Nessuna scena.

## Domande per Andrea

- Il nome: "equazione generale dei gas", "legge combinata dei gas" o "equazione di stato" (che però è $pV = nRT$)? Il
  database dice "equazione generale".
- Condizioni normali a $0\,^\circ\text{C}$ e $1\,\text{atm}$ o condizioni standard a $25\,^\circ\text{C}$? Serve la
  stessa scelta nella lezione sul volume molare del gruppo 27.
- La derivazione in due tappe è utile, o basta dare l'equazione e mostrare che contiene le tre leggi?
