# Note: Eventi e probabilità

Lezione nuova, scritta da zero (lotto 9). Ogni probabilità di lezione, formulario e carte è stata ricalcolata in uno script (`lotto9/94/verify.py` nello scratchpad) contando gli esiti di uno spazio campionario enumerato con `itertools.product` (dado, due dadi, due e tre monete, mazzo di 40 carte come coppie valore-seme, urna di 10 palline) e `fractions.Fraction`, con i conti di controllo ripetuti con `sympy.Rational`: 67 controlli, compresi gli elenchi degli esiti scritti nel testo (le sei coppie con somma 7, le tre con somma 4, gli otto esiti di tre monete nell'ordine della lezione), le unioni e intersezioni dell'esempio del dado, $12 / 500 = 0{,}024$. La tabella della simulazione di lanci della moneta viene da una simulazione vera (`random.Random(2)`, 10 000 lanci), rifatta nello stesso script; lo script controlla anche la frase "ci sono tratti in cui la frequenza si allontana da $0{,}5$" (succede, per esempio, tra 220 e 230 lanci). Una prima versione diceva che dopo 10 000 lanci la frequenza era più lontana da $0{,}5$ che dopo 1000: lo script ha trovato che era falso ($0{,}0038$ contro $0{,}004$) e la frase è cambiata. Il controllo `check.mts` passa sui tre file, con un solo avviso: 19 grassetti, tutti su termini definiti (la lezione introduce molti termini). Le formule in evidenza, misurate con KaTeX a 17 px in Chromium con il foglio di stile caricato, sono larghe al massimo 232 px nella lezione (i due righi degli esiti di tre monete) e 201 px nel formulario, dopo aver spezzato su due righe $0 \leq p(E) \leq 1$, $p(\emptyset) = 0$, $p(\Omega) = 1$ (331 px su una riga).

## Struttura ed esempi

Esperimento aleatorio, esito, spazio campionario $\Omega$ (moneta, dado, due monete, due dadi come prodotto cartesiano con la tabella 6 per 6), un riquadro `ad-note` sul mazzo di 40 carte napoletane. Poi eventi (elementare, certo, impossibile), operazioni tra eventi con un diagramma di Venn del dado ($A$ pari, $B$ maggiore di 3), eventi incompatibili e compatibili. Definizione classica con la condizione di equiprobabilità detta prima della formula, scritta in parole e con la cardinalità $\dfrac{|E|}{|\Omega|}$ della 64; $0 \leq p(E) \leq 1$. Definizione frequentista con la simulazione e la legge empirica del caso, cenno alla soggettiva, tabella di confronto delle tre definizioni.

Otto esempi svolti:

1. eventi con due monete (nessun calcolo, solo sottoinsiemi);
2. un dado: pari, multiplo di 3, evento certo, evento impossibile;
3. due monete: una testa e una croce $\frac{1}{2}$, almeno una testa $\frac{3}{4}$;
4. due dadi: somma 7 ($\frac{1}{6}$), somma 4 ($\frac{1}{12}$), somma 12 ($\frac{1}{36}$);
5. urna con 3 rosse, 5 blu, 2 verdi: rossa $0{,}3$, non blu $\frac{1}{2}$;
6. mazzo: asso, denari, figura, re di spade;
7. tre monete, esattamente due teste $\frac{3}{8}$, con l'elenco ordinato degli esiti;
8. lampadine difettose, stima frequentista $0{,}024$.

Avvisi, ognuno dopo il suo punto: eventi incompatibili in un esperimento e compatibili in un altro; probabilità maggiore di 1; esiti non equiprobabili (due monete con tre "risultati", le 11 somme dei dadi), ripreso nell'esempio 5 con i colori dell'urna; la moneta non ha memoria.

## Scelte di convenzione (da verificare con il libro in uso)

- Notazione $p(E)$, minuscola, come chiede il brief di scegliere la più diffusa nel biennio: la usano, per quanto ricordo, i Bergamini-Barozzi-Trifone; altri libri scrivono $P(E)$. Da verificare.
- Spazio campionario $\Omega$; alcuni libri usano $U$ o $S$. Evento contrario $\overline{E}$, come il complementare della 64.
- Esiti di due monete scritti come parole, $TC$; esiti di due dadi come coppie ordinate $(a, b)$, righe della tabella per il primo dado e colonne per il secondo.
- "Somma logica" e "prodotto logico" introdotti come secondi nomi di unione e intersezione, perché la 95 ha "somma" nel titolo.
- "Legge empirica del caso" per l'enunciato della scuola, con la frase che la versione precisa si chiama legge dei grandi numeri; l'enunciato dice "di solito l'approssimazione migliora", non "converge", per non esagerare.
- Definizione soggettiva con il prezzo per ricevere 1 euro e la coerenza (de Finetti), senza nominare de Finetti.
- Mazzo napoletano con asso, 2-7, fante (8), cavallo (9), re (10). La nota dice che piacentine e siciliane "sono uguali per i conti": hanno anch'esse 40 carte, 4 semi e 3 figure per seme; da verificare se si vuole citarle.

## Lasciato ad altre lezioni

- Probabilità dell'evento contrario e dell'unione: alla 95. Qui l'evento contrario e l'unione sono definiti come eventi, senza formule di probabilità.
- Calcolo combinatorio, probabilità condizionata e composta, indipendenza: lezioni di anni successivi, oggi vuote, né trattate né linkate. Gli esiti si contano elencandoli; per tre monete l'elenco è ordinato fissando la prima moneta, senza diagramma ad albero.
- Frequenza relativa: definita nella 55, qui richiamata con il link e la stessa notazione $f_r = \dfrac{f_a}{N}$ (per questo non è in grassetto).

## Figure

Quattro blocchi TikZ nella lezione, generati da `lotto9/94/figs.py` (che controlla le coordinate: ogni numero del Venn sta dentro i cerchi giusti e lontano dai bordi, le caselle colorate sono esattamente quelle dell'evento, ogni punto del grafico è la frequenza della simulazione), compilati con `compileFigure` e guardati in PNG in chiaro e con `invert(1) hue-rotate(180deg)` su un riquadro bianco.

- `due-dadi-tabella-somme` (166x165): tabella 6 per 6 con le somme, caselle con somma 7 in `blue!20`. Il formulario la copia.
- `eventi-dado-diagramma-venn` (231x155): stesse misure dei Venn della 63, con i sei esiti al loro posto e senza zone colorate.
- `frequenza-relativa-testa-lanci-moneta` (270x173): frequenza relativa di testa nei primi 1000 lanci della simulazione, retta tratteggiata a $0{,}5$. È la più larga del lotto; se 270 px sono troppi per il telefono, si può accorciare l'asse $x$ (oggi 5 cm).

Le altre quattro figure dello stesso script servono alla 95.

## Formulario e flashcard

- Formulario: spazio campionario ed eventi con la tabella dei dadi, tabella parola-evento-operazione, definizione classica con tre esempi di una riga, frequentista e soggettiva, tre avvisi.
- 20 carte, nell'ordine della lezione; tutti i numeri vengono dagli esempi.

## Da cambiare nelle lezioni già scritte

- 55 (Dati, frequenze e grafici), facoltativo: dopo "È un numero tra $0$ e $1$, che si scrive come frazione o con la virgola, e la somma delle frequenze relative di tutte le modalità è $1$." si può aggiungere "Ripetendo un esperimento molte volte, la frequenza relativa serve anche a stimare una probabilità: vedi [Eventi e probabilità](/materiale/scuola-superiore/matematica/probabilita/eventi-e-probabilita)."
- Nessuna lezione scritta parla già di probabilità o di dadi (cercato "probabil", "aleatori", "dado" nelle 01-89): niente da correggere.

## Prerequisiti

La riga della bozza, `concetti-probabilita <- insiemi-operazioni, statistica-dati, numeri-razionali-frazioni`, ha un arco ridondante: `numeri-razionali-frazioni` è antenata di `statistica-dati` (attraverso `numeri-razionali-proporzioni`). Inoltre la lezione non usa le proprietà delle operazioni (la 03), ma unione, intersezione e complementare, e il complementare è nella 64, che viene dopo unione e intersezione. Proporrei

```
concetti-probabilita <- insiemi-differenza, statistica-dati
```

La lezione linka anche il prodotto cartesiano (39) per i due dadi, ma la tabella lo rende non necessario. Se si preferisce un solo arco verso gli insiemi che copra anche il prodotto cartesiano, `insiemi-operazioni` va bene (ha per genitori `insiemi-differenza` e `insiemi-prodotto-cartesiano`).

## Per il generatore

1. Dado o moneta, evento descritto a parole: elencare i casi favorevoli e dare $\frac{k}{6}$ semplificato (multiplo di 3, $\frac{1}{3}$). Distrattori: $\frac{2}{3}$ (i casi sfavorevoli al posto dei favorevoli); $\frac{1}{2}$ per ogni evento, "o succede o no". Il controllo deve accettare la frazione non semplificata ($\frac{2}{6}$) come giusta.
2. Eventi certi e impossibili, e riconoscere incompatibili e compatibili (pari e maggiore di 3). Distrattore: "incompatibili" per eventi che hanno un esito in comune.
3. Due o tre monete ($\frac{1}{2}$ per una testa e una croce, $\frac{3}{8}$ per esattamente due teste su tre). Distrattori: $\frac{1}{3}$ e $\frac{1}{4}$ (risultati contati senza ordine).
4. Urna con palline di più colori (rossa $\frac{3}{10}$). Distrattore: $\frac{1}{3}$, un colore su tre.
5. Mazzo di 40 carte (figura $\frac{3}{10}$, asso $\frac{1}{10}$, carta di un seme $\frac{1}{4}$). Distrattori: $\frac{3}{40}$ per le figure (quelle di un seme solo), $\frac{1}{52}$ e altri valori del mazzo francese.
6. Due dadi, somma data (7: $\frac{1}{6}$; 4: $\frac{1}{12}$). Distrattori: $\frac{1}{11}$ (le somme possibili) e $\frac{3}{36}$ per somma 7 contando le coppie senza ordine.
7. Frequenza relativa e stima frequentista ($\frac{12}{500} = 0{,}024$). Distrattore: $\frac{500}{12}$.

## Domande per Andrea

- Notazione: $p(E)$ o $P(E)$? E $\Omega$ o $U$ per lo spazio campionario?
- Nome dell'enunciato frequentista: "legge empirica del caso" (con il cenno alla legge dei grandi numeri) va bene per il biennio, o preferisci solo "legge dei grandi numeri"?
- Gli esiti di due monete scritti $TC$ e quelli di due dadi $(a, b)$: meglio uniformare con le coppie anche per le monete, $(T, C)$?
- La definizione soggettiva è un cenno di due paragrafi con il prezzo per 1 euro: basta, o nel programma del biennio si può togliere del tutto?
- Il mazzo di 40 carte: napoletane come chiede il brief. Vuoi anche un esempio con il mazzo di 52 carte francesi, che compare in molti esercizi?
