# Note: L'equilibrio termico e il calorimetro

Lezione nuova (terzo lotto di fisica, il secondo anno, gruppo 20, 30 settembre 2026). Conti rifatti in Python:
esempio 1, $(2{,}0 \cdot 80 + 3{,}0 \cdot 20)/5{,}0 = 44$; esempio 2, $c_1 m_1 = 89{,}8$, $c_2 m_2 = 2093$, numeratore
$55\,330$, denominatore $2182{,}8$, $t_e = 25{,}35\,^\circ\text{C}$, calore scambiato $1{,}119 \cdot 10^4\,\text{J}$, rapporto
delle capacità $23{,}3$, media semplice $85$; esempio 3, senza calorimetro $33{,}3\,^\circ\text{C}$,
$100 \cdot 27{,}5/12{,}5 = 220$, $m_{eq} = 20\,\text{g}$; esempio 4, $Q = 4328\,\text{J}$, $c_x = 383{,}2$ (con
$4328$ arrotondato, $383{,}18$), senza equivalente $348{,}4$, differenza $9{,}1\%$; avviso sulla lettura, $0{,}1/4{,}7 = 2{,}1\%$.
`check.mts` passa.

## Struttura ed esempi

L'equilibrio termico (definizione, verso del calore, il termometro, il principio zero in un riquadro), il calore ceduto
uguale al calore assorbito (con le differenze positive; la forma con i segni, $Q_1 + Q_2 = 0$, in un riquadro, con la
stessa convenzione di $\Delta t$ della lezione 67), la temperatura di equilibrio (ricavata come equazione di primo grado,
letta come media pesata con le capacità termiche, il caso della stessa sostanza), gli esempi 1 (acqua e acqua) e 2 (ferro
in acqua), due avvisi (la media semplice, le unità dei dati), la figura interattiva; il calorimetro delle mescolanze con
la figura; l'equivalente in acqua con l'esempio 3 e l'avviso su dove va sommato; la misura del calore specifico in cinque
passi, l'esempio 4 (il rame), l'avviso sulle due differenze di temperatura e il consiglio sulla quantità d'acqua.

## Scelte

- Temperature in gradi Celsius con la $t$ minuscola, come dice il README (qui non c'è il tempo nelle formule); calore
  specifico in $\text{J/(kg}\cdot{}^\circ\text{C)}$ e capacità termica in $\text{J/}^\circ\text{C}$, come la lezione 67 del
  gruppo 19 (che scrive $\text{J}/^\circ\text{C}$: stessa resa).
- Il bilancio è scritto con le due differenze positive, "calore ceduto uguale calore assorbito", che è la forma che uno
  studente usa di solito; l'Amaldi (Fisica.verde, Zanichelli 2017, capitolo 13, diapositive del capitolo lette il 30
  settembre 2026) scrive $Q_1 + Q_2 = 0$ con i segni, e la lezione lo dice in un riquadro.
- Dati: acqua $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$ (l'Amaldi e la lezione 67), ferro $449$, rame $385$
  (Wikipedia, "Table of specific heat capacities", letta il 30 settembre 2026, valori a $25\,^\circ\text{C}$), gli stessi
  della tabella della lezione 67.
- Il principio zero è in un riquadro che si può saltare: il DM parla di "equilibrio termico" nel primo biennio, il nome
  del principio è del triennio.
- L'esempio 4 dà un risultato con due cifre ($3{,}8 \cdot 10^2$) perché la differenza $t_e - t_a = 4{,}7$ ne ha due: è
  anche lo spunto per il consiglio sulla quantità d'acqua.

## Figure

Due TikZ, guardate in chiaro e in scuro: `due-corpi-contatto-calore` (i due blocchi rosato e azzurro con la freccia del
calore) e `calorimetro-delle-mescolanze` (recipiente doppio con il vuoto, coperchio, termometro, agitatore, campione).
Interattiva `equilibrio-termico-due-corpi` (`fisica/EquilibrioTermicoDueCorpi.tsx`): per ogni corpo materiale (acqua,
alluminio, ferro, piombo), massa ($0{,}10$-$2{,}00\,\text{kg}$) e temperatura ($0$-$100\,^\circ\text{C}$); "Metti a
contatto" avvicina i corpi e le temperature convergono a $t_e$ in quattro secondi (legge esponenziale scritta a mano,
che arriva esatta a $t_e$), con il grafico nel tempo, senza numeri sull'asse del tempo, perché la rapidità dello scambio
dipende dal contatto, che la lezione non tratta. Guardata in chiaro, in scuro, sul telefono e dopo il contatto.
I pezzi comuni delle tre figure del gruppo (colore di un corpo secondo la temperatura, dati dei materiali, tacche di un
grafico) sono in `fisica/calore.tsx`.

## Esercizi

Generatore `fis-equilibrio-termico`, sei livelli (specifica in `specs/exercises/fis-equilibrio-termico.md`), senza scene:
i dati sono tutti nel testo.

## Domande per Andrea

- Il bilancio si insegna come "calore ceduto = calore assorbito" con le differenze positive, o come $Q_1 + Q_2 = 0$ con i
  segni, come l'Amaldi? La lezione dà la prima forma e la seconda in un riquadro.
- Il principio zero della termodinamica va nominato al secondo anno, o si lascia al triennio?
- L'equivalente in acqua è nel programma del biennio (l'Amaldi Fisica.verde non lo nomina nelle diapositive del capitolo
  13), o va tolto dalla lezione e dal livello 6 degli esercizi?
- Il calorimetro disegnato con il vuoto tra le pareti (tipo vaso di Dewar) va bene, o nei laboratori delle scuole si
  usa il calorimetro di polistirolo, e conviene disegnare quello?
