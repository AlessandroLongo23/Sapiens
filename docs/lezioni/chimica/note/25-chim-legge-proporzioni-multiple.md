# Note: La legge di Dalton delle proporzioni multiple

Lezione nuova (biennio di chimica, gruppo 25, 30 settembre 2026). Conti rifatti in Python con le masse della lezione
01: ossigeno per grammo di carbonio $16{,}00/12{,}01 = 1{,}332$ e $2{,}664$; esempio 1, $7{,}99/4{,}00 = 1{,}9975$;
esempio 2, $2{,}49/2{,}50 = 0{,}996$, $2{,}39/1{,}60 = 1{,}494$, rapporto $1{,}4997$ (i dati vengono da
$\mathrm{SO_2}$ e $\mathrm{SO_3}$: $0{,}9978$ e $1{,}4967$ g di ossigeno per grammo di zolfo); esempio 3, azoto nel
$\mathrm{NO}$ $46{,}68\%$ e nel $\mathrm{NO_2}$ $30{,}45\%$, rapporti $1{,}141$, $2{,}289$ e $2{,}006$, rapporti delle
percentuali $1{,}536$ e $1{,}306$; tabella degli ossidi dell'azoto $0{,}571$, $1{,}142$, $1{,}713$, $2{,}284$,
$2{,}855$; esempio 4, $16{,}00/2{,}02 = 7{,}92$ e $15{,}84$, rapporto $1{,}995$. `check.mts` passa.

## Struttura

Due composti degli stessi elementi (richiamo di Proust con link, tabella di $\mathrm{CO}$ e $\mathrm{CO_2}$, figura
TikZ), l'enunciato con le due parti che contano ("la stessa massa", "numeri interi piccoli"), un riquadro su Proust e
Dalton; il procedimento in quattro passi con gli esempi 1 (stessa massa) e 2 (masse diverse, rapporto $3 : 2$) e
l'avviso sul confronto senza fissare l'elemento; le percentuali con l'esempio 3 e l'avviso sul confronto delle
percentuali; la tabella dei cinque ossidi dell'azoto e la figura interattiva; perché i rapporti sono interi (ponte
verso la teoria atomica), l'esempio 4 con l'acqua ossigenata e un consiglio per leggere il rapporto dalle formule.

## Scelte

- L'enunciato è scritto come citazione (blocco `>`), perché è la frase da riconoscere nei libri; `check.mts` lo
  accetta. Da togliere se sul sito il blocco citazione non ha uno stile.
- La storia è ridotta a una frase: "all'inizio dell'Ottocento", studiando i composti dell'azoto con l'ossigeno.
  Wikipedia ("John Dalton", letta il 30 settembre 2026) cita una frase del 1802 sul "nitrous gas"; le date esatte
  della prima formulazione (1803, 1804) sono da verificare, e per questo non sono nella lezione.
- Niente moli: i conti usano masse in grammi e, per le percentuali, $100\,\mathrm{g}$ di composto. Le masse atomiche
  entrano solo nei conti da cui ho ricavato i dati, non nel testo.
- Il rapporto si chiede sempre "del secondo rispetto al primo", e nel formulario la colonna "Rapporto" è scritta
  primo : secondo (come nella tabella degli ossidi dell'azoto).

## Figure

TikZ `proporzioni-co-co2-sfere` (molecole a sfere di $\mathrm{CO}$ e $\mathrm{CO_2}$ con le masse per grammo e la
freccia $\times 2$), guardata in chiaro e in scuro. Le sfere hanno i colori di tutte le figure del gruppo:
$\mathrm{C}$ `gray!45`, $\mathrm{O}$ `red!30`, $\mathrm{H}$ `gray!8`, $\mathrm{N}$ `blue!25`.

Interattiva `proporzioni-multiple-ossidi` (`chimica/ProporzioniMultiple.tsx`, con `chimica/sfereDalton.tsx`): cinque
coppie di elementi (C, N, S, H, Fe con l'ossigeno), una riga per composto con la molecola a sfere e una barra lunga
quanto la massa di ossigeno unita alla massa scelta dell'altro elemento ($1$-$10\,\text{g}$). Le barre sono divise in
tratti uguali (l'ossigeno di un atomo ogni $L$ atomi dell'elemento fisso, con $L$ il minimo comune multiplo dei suoi
indici): si vede che ognuna è un numero intero di tratti. La barra più lunga ha sempre la stessa lunghezza, così il
cursore cambia le masse scritte e non il disegno: il messaggio è che il rapporto non dipende dalla massa. Guardata in
chiaro, in scuro, sul telefono e dopo aver cambiato coppia; nessun errore in console, niente scorrimento laterale.

## Esercizi

Generatore `chim-legge-proporzioni-multiple`, cinque livelli (specifica in
`specs/exercises/chim-legge-proporzioni-multiple.md`), senza scene: i dati sono nel testo.

## Domande per Andrea

- La legge si enuncia con "numeri interi piccoli" o "numeri interi e semplici"? E si insegna anche la forma con le
  formule (il consiglio in fondo alla lezione), o solo quella con le masse?
- Il livello 5 degli esercizi chiede la formula del secondo composto conoscendo quella del primo: è nel programma del
  primo anno, o anticipa troppo la formula minima del secondo anno?
- Negli esercizi compaiono anche $\mathrm{P_2O_3}$ e $\mathrm{P_2O_5}$ (le formule tradizionali, non $\mathrm{P_4O_6}$ e
  $\mathrm{P_4O_{10}}$) e i perossidi ($\mathrm{H_2O_2}$, $\mathrm{Na_2O_2}$): vanno bene al primo anno?
- Le date della prima formulazione della legge (1802 con i gas dell'azoto, 1803-1804 nei lavori pubblicati): quale si
  dà a scuola? Da verificare.
