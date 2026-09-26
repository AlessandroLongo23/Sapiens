# Note: Disequazioni di primo grado e intervalli

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: `solveset` sulle disequazioni degli otto esempi, sulla variante con $\le$ dell'esempio 6, su quelle degli avvisi ($-3x < 12$, $3x > -6$, $\frac{x}{2} + 1 > x$) e del testo ($2x + 1 > 7$, $-2x > 6$), `expand` dei passaggi con le parentesi (esempi 3 e 4) e i controlli numerici del riquadro sulla verifica. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px: la più larga è 250 px ($-5x \ge 17 - 2 \Rightarrow -5x \ge 15$, esempio 2), le altre stanno sotto i 240. Controllo di `check.mts` passato sui tre file; resta l'avviso "15 grassetti", tutti su termini definiti nel punto in cui compaiono.

## Scelte di convenzione

- Intervalli con le parentesi quadre rivolte verso l'esterno per gli estremi esclusi ($]2, 5]$, $]-\infty, 3[$), come chiede il brief di lotto e come nella maggior parte dei libri italiani. Da verificare con il libro in uso. Un riquadro `ad-note` cita la notazione con le tonde, $(2, 5]$, e quella con le graffe, $\{x \in \mathbb{R} \mid x > 2\}$.
- Nel sorgente le parentesi degli intervalli sono scritte `\mathopen{]}` e `\mathclose{[}`. Con la scrittura semplice `]-\infty, 3[` KaTeX tratta la `]` come parentesi di chiusura: il meno che segue diventa un'operazione binaria, con gli spazi ("$] - \infty$"), e dopo un uguale la parentesi si attacca al segno ("$S =]4$"). L'ho verificato con uno screenshot. Il resto del lotto (53 e 54) dovrebbe usare la stessa scrittura, altrimenti le tre lezioni rendono gli intervalli in due modi diversi; forse conviene una macro o una sostituzione nel renderer.
- $S = \mathbb{R}$ per le disequazioni sempre verificate e $S = \emptyset$ per le impossibili, coerente con la 16. Non ho ripetuto il riquadro su $\mathbb{Q}$ e $\mathbb{R}$ della 16.
- "Sempre verificata" e "impossibile" come nomi dei due casi con $a = 0$. Il brief dice "sempre vera, mai vera": ho usato "sempre verificata" perché è il termine dei libri, e "impossibile" come per le equazioni.
- La forma normale è definita con $a$ e $b$ numeri, senza $a \neq 0$ (diversamente dalla 16, che per le equazioni di primo grado chiede $a \neq 0$ e tratta a parte i casi $0x = b$). L'ho fatto per tenere i tre casi $a > 0$, $a < 0$, $a = 0$ nella stessa tabella, come chiede il brief. Se si vuole la coerenza stretta con la 16, si può scrivere "di primo grado se $a \neq 0$" e lasciare il resto com'è.
- Estremi degli intervalli nei casi con $a > 0$ e $a < 0$ scritti solo per $ax > b$; "con gli altri segni si ragiona allo stesso modo". Il formulario ha la tabella dei quattro casi con $a = 0$.

## Lasciato ad altre lezioni

- Trasporto, cancellazione, MCM, parentesi: richiamati in una riga, con link alla 16.
- Doppie disequazioni ($a < ax + b < c$) e intersezioni: solo nel riquadro finale, link a Sistemi di disequazioni (53). La scrittura $a \le x \le b$ è però spiegata negli intervalli, perché serve per leggerli.
- Disequazioni con prodotti e fratte: link a 54 nel riquadro finale.
- Nell'esempio 7 (voto) le soluzioni sono $x \ge 7$ e il vincolo $x \le 10$ viene dal problema: è già un sistema, ma l'ho detto a parole, senza parlarne come sistema.

## Da cambiare in lezioni già scritte

- 16 (Equazioni di primo grado intere): l'apertura linka già questa lezione. Nient'altro.
- 51 (Problemi con le equazioni): se ha problemi di convenienza tra tariffe risolti con l'equazione del pareggio, potrebbe rimandare qui per la domanda "per quali valori conviene". Non l'ho controllato riga per riga.

## Figure

Otto rette dei numeri, tutte con lo stesso stile, generate da uno script e compilate con `compileFigure` di `scripts/figure/compile.mjs`: asse sottile `black!70` con freccia, soluzioni in `blue!45` a 2 pt, pallino pieno nero (`\filldraw`), pallino vuoto senza riempimento con l'asse e il tratto interrotti intorno (come nella 46 e nella 49), niente `\clip` né bianchi. Larghezze tra 243 e 259 px. Guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`): nel tema scuro il pallino pieno diventa bianco e il vuoto resta vuoto, la differenza si vede. Non viste sul sito.

- `intervallo-limitato-retta` ($[-1, 3[$), `intervallo-illimitato-retta` ($]2, +\infty[$): nella sezione sugli intervalli.
- `soluzioni-x-maggiore-4`, `soluzioni-x-minore-uguale-meno-3`, `soluzioni-x-maggiore-uguale-meno-1`, `soluzioni-x-maggiore-uguale-meno-14-quinti`: esempi 1-4.
- `problema-voto-intervallo` ($[7, 10]$, scala più stretta per stare nei 280 px) e `problema-tariffe-numeri-naturali` (otto pallini pieni da $0$ a $7$): esempi 7 e 8.

Il formulario non ha figure. Le etichette sono nella stessa riga: con l'estremo $-\frac{14}{5}$ la frazione è piccola ma leggibile.

## Formulario e flashcard

- Formulario: tabella unica degli otto intervalli, principi, tabella dei casi della forma normale, procedimento in sei passi con un esempio, traduzione delle parole dei problemi, tre avvisi (verso dimenticato, verso cambiato senza motivo, parentesi sbagliata).
- 18 carte. Tutte usano esempi e regole della lezione; la carta `infinito-parentesi` usa $[-\infty, 2]$ come scrittura sbagliata, che la lezione cita come $[-\infty$.

## Prerequisiti

La riga `disequazioni-primo-grado <- equazioni-primo-grado` va bene così. La lezione usa i principi di equivalenza, il trasporto, il MCM dei denominatori e i casi $0x = b$ della 16, e i problemi seguono lo schema della 51, ma solo con traduzioni di una riga: la 51 è un collegamento, non un prerequisito. Gli intervalli si introducono qui da zero; la retta dei numeri e l'ordine tra i numeri relativi arrivano dalla 16 attraverso i numeri interi e razionali. Non servono né gli insiemi (le graffe sono solo citate in una nota) né le relazioni d'ordine (41).

## Per il generatore

1. Intervalli: dalla disuguaglianza all'intervallo e viceversa, limitati e illimitati, estremi inclusi ed esclusi: $-1 \le x < 3 \to [-1, 3[$, $x \le 4 \to ]-\infty, 4]$.
2. Disequazioni con un passaggio e coefficiente positivo: $3x - 5 > 7$, $S = ]4, +\infty[$.
3. Coefficiente negativo (cambio di verso), anche con soluzione negativa e coefficiente positivo per il distrattore: $2 - 5x \ge 17$, $S = ]-\infty, -3]$; $3x > -6$, $S = ]-2, +\infty[$.
4. Parentesi e incognita nei due membri: $4(x + 1) - 3 \le 6x - (x - 2)$, $S = [-1, +\infty[$.
5. Denominatori numerici, soluzione anche frazionaria: $\dfrac{x - 2}{3} - \dfrac{x + 1}{2} \le \dfrac{x}{4}$, $S = \left[-\dfrac{14}{5}, +\infty\right[$.
6. Casi con $a = 0$ mescolati con $>$, $\ge$, $<$, $\le$: $S = \mathbb{R}$ o $S = \emptyset$, con gli esempi 5 e 6 e la variante con $\le$.
7. Problemi semplici con una disequazione (almeno, al massimo, conviene), con soluzioni naturali o limitate dal contesto: esempi 7 e 8.

I distrattori utili sono sempre gli stessi: verso non cambiato, verso cambiato quando il coefficiente è positivo, parentesi dell'estremo sbagliata. Il controllo del generatore deve verificare anche le parentesi dell'intervallo, non solo il numero dell'estremo.
