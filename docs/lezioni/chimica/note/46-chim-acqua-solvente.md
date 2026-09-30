# Note: L'acqua come solvente

Lezione nuova (biennio di chimica, gruppo 29, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$0{,}30 \cdot 2 = 0{,}60$ e $0{,}30 + 0{,}60 = 0{,}90\,\text{mol}$; esempio 2, $110 \cdot 0{,}500 = 55{,}0$,
$31{,}6 \cdot 0{,}500 = 15{,}8$, $55{,}0 - 15{,}8 = 39{,}2\,\text{g}$; esempio 3, $280/10 = 28\,^\circ\text{f}$. `check.mts`
passa.

## Struttura

Sciogliere un composto ionico (orientamento delle molecole d'acqua, ioni idratati, figura interattiva, simboli di stato,
dissociazione ionica con $\mathrm{NaCl}$, $\mathrm{CaCl_2}$, $\mathrm{Na_2SO_4}$, figura TikZ degli ioni idratati, esempio
delle moli di ioni, avviso sul $\mathrm{Cl_2}$, elettroliti, composti ionici insolubili con il loro avviso); sostanze
molecolari polari (zucchero, glucosio ed etanolo con RDKit, non elettroliti); sostanze apolari e "il simile scioglie il
simile", con una tabella e il sapone in un riquadro; solubilità e temperatura (tabella, cristallizzazione con l'esempio,
gas); l'acqua dura (reazione del calcare, gradi francesi, classificazione, esempio, calcare e sapone).

## Scelte

- La lezione 17 (gruppo 22) definisce già solubilità, soluzione satura e corpo di fondo e ha il grafico delle curve di
  solubilità: qui ci sono solo il link, la tabella in funzione della temperatura, la cristallizzazione e i gas. I valori
  della tabella sono coerenti con quelli della lezione 17 ($\mathrm{NaCl}$ circa $36\,\text{g}$, $\mathrm{KNO_3}$
  $31{,}6\,\text{g}$ a $20\,^\circ\text{C}$, circa $64$ a $40$, $110$ a $60$).
- Tabella delle solubilità ($\mathrm{NaCl}$, $\mathrm{KCl}$, $\mathrm{KNO_3}$, saccarosio, da $0$ a $100\,^\circ\text{C}$):
  valori da manuale (la tabella delle solubilità del CRC Handbook, riportata da Wikipedia, "Solubility table"), non
  riletti il 30 settembre 2026: da verificare.
- Ossigeno disciolto a contatto con l'aria: $14{,}6$, $9{,}1$, $7{,}6\,\text{mg/L}$ a $0$, $20$, $30\,^\circ\text{C}$ (valori
  da manuale, da verificare).
- Durezza: $1\,^\circ\text{f} = 10\,\text{mg/L}$ di carbonato di calcio; classificazione dolce sotto $15$, media $15$-$30$,
  dura sopra $30\,^\circ\text{f}$ (una delle classificazioni diffuse; altre fonti hanno sei classi): da verificare. Non
  ho scritto i valori di legge per l'acqua del rubinetto, perché non li ho controllati.
- La reazione del calcare con l'anidride carbonica è scritta in un'equazione, come cenno, e il fatto che vada
  all'indietro scaldando è detto a parole.
- Simboli di stato $(s)$, $(l)$, $(g)$, $(aq)$ introdotti qui: da controllare che le lezioni precedenti (21-28) non li
  abbiano già definiti in modo diverso.
- Il glucosio è disegnato con la formula scheletrica, senza stereochimica (la lezione 01 spiega le formule scheletriche).

## Figure

Interattiva `acqua-sale-si-scioglie` (`chimica/SaleSiScioglie.tsx`): un cristallo di $4 \times 2$ ioni sul fondo; "Sciogli"
fa staccare gli ioni uno alla volta in dieci secondi, nell'ordine di quelli con meno vicini ancora nel cristallo (il
fondo del recipiente conta come un vicino), e un cursore fa avanzare la dissoluzione a mano. Ogni ione si porta dietro il
suo guscio: cinque molecole con l'ossigeno verso $\mathrm{Na^+}$, sei con un idrogeno verso $\mathrm{Cl^-}$. Disegnate solo
le molecole dei gusci (le altre coprirebbero gli ioni), e la didascalia lo dice. Guardata in chiaro, in scuro, sul
telefono, all'inizio, a metà e alla fine: nessun errore, niente scorrimento laterale.

TikZ `acqua-ioni-idratati` (sei molecole attorno a ciascuno ione), guardata in chiaro e in scuro. RDKit
`acqua-solvente-glucosio-etanolo` (` ```molecole `, gruppi O-H in blu), anteprima guardata.

## Esercizi

Generatore `chim-acqua-solvente`, sei livelli (specifica in `specs/exercises/chim-acqua-solvente.md`): che cosa succede in
acqua, gli ioni di un sale, le moli di ioni, quanto se ne scioglie o resta sul fondo, la cristallizzazione, la durezza.
Niente scene.

## Domande per Andrea

- Il termine "dissociazione ionica" per i composti ionici (e non "ionizzazione") è quello dei libri del biennio?
- "Il simile scioglie il simile" è una regola che si insegna così al secondo anno?
- La classificazione della durezza (dolce, media, dura, con i limiti $15$ e $30\,^\circ\text{f}$): quale usano i libri?
- La reazione $\mathrm{CaCO_3} + \mathrm{CO_2} + \mathrm{H_2O} \longrightarrow \mathrm{Ca^{2+}} + 2\,\mathrm{HCO_3^-}$ è
  troppo per il biennio? Si può lasciare solo a parole.
- Il livello 3 degli esercizi (moli di ioni) usa la mole, che al secondo anno viene prima dell'acqua: va bene?
