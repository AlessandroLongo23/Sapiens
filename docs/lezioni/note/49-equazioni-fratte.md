# Note: Equazioni fratte

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: `solveset` sulle otto equazioni degli esempi e su quelle degli avvisi ($\frac{x}{x-2} = \frac{2}{x-2}$, $\frac{x^2-4}{x-2} = 4$, $\frac{3}{x-1} = \frac{x+3}{x-1}$, $\frac{1}{x} + 1 = \frac{2}{x}$), `expand` di ogni passaggio intermedio, le scomposizioni dei denominatori, le verifiche numeriche (esempi 1, 5, 8 e l'avviso sui termini senza denominatore) e il conto con $8x^2$ nell'avviso sul MCM. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium: la più larga sta sotto i 250 px a 17 px di base (il sito usa 15 px), quindi entra nei riquadri a 390 px.

## Scelte di convenzione

- "Equazione fratta" come termine principale, "frazionaria" citato una volta. "Soluzione accettabile" e "non accettabile" come nei libri.
- C.E. scritte come nella lezione 46: "C.E.: $x \neq 0$, $x \neq 2$", valori separati da virgola, in ordine crescente. La 46 usa anche $x \neq \pm 3$; qui non serve.
- Procedimento in sei passi con il denominatore comune scritto per intero (riduci i due membri al MCM, poi elimini il denominatore), come fa la maggior parte dei libri. Un paragrafo dice che moltiplicare subito ogni termine per il MCM dà lo stesso risultato. Non ho presentato il metodo "porta tutto a primo membro e poni il numeratore uguale a zero", che si usa di più per le disequazioni fratte: se Andrea lo preferisce, si aggiunge come nota.
- Equazione fratta indeterminata: $S = \mathbb{R} \setminus \{-1, 2\}$, coerente con la 16, che per le intere indeterminate scrive $S = \mathbb{R}$, e con la notazione $\setminus$ della 03. Molti libri del primo anno scrivono $\mathbb{Q}$ o "$\forall x \neq -1, x \neq 2$"; la 16 ha già un riquadro su $\mathbb{Q}$ e $\mathbb{R}$, e non l'ho ripetuto.
- La giustificazione del confronto con le C.E. passa dal secondo principio di equivalenza (si moltiplica per un'espressione che è diversa da zero solo sotto le C.E.). Ho detto che l'equazione intera "può avere una soluzione in più" e mai che può perderne, che è vero per la moltiplicazione per il MCM.
- Tabella dei quattro casi (intera determinata con soluzione accettabile o no, intera impossibile, intera indeterminata), ripresa nel formulario.

## Lasciato ad altre lezioni

- Come si trovano le C.E. e la legge di annullamento del prodotto: solo il riassunto e il link a 46.
- MCM di polinomi e fattori opposti: link a 38, con un avviso sul caso $x - 1$ e $1 - x$.
- Scomposizioni dei denominatori (differenza di quadrati, trinomio): nominate nell'esempio, con link al trinomio (36).
- Equazioni fratte che diventano di secondo grado, letterali fratte, disequazioni fratte: solo nel riquadro finale "Dove si usano". L'esempio 5 ha termini in $x^2$ che si cancellano, come l'esempio della 16 sul grado letto sulla forma normale.
- Problemi che portano a equazioni fratte: nessuno, sono nella 51 se servono.

## Da cambiare in lezioni già scritte

- 16 (Equazioni di primo grado intere): l'apertura elenca dove ritorna il metodo (secondo grado, sistemi, disequazioni); si può aggiungere "nelle [equazioni fratte](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-fratte)". Il riquadro "Perché non si moltiplica per zero" è il punto di partenza di questa lezione: potrebbe chiudere con una frase e il link ("per questo, quando si moltiplica per un'espressione con l'incognita, servono le condizioni di esistenza").
- Nient'altro da togliere: nessuna lezione pubblicata tratta le equazioni fratte.

## Figura

Una sola, `soluzioni-equazione-fratta-indeterminata`, nell'esempio 8: la retta dei numeri colorata con due pallini vuoti in $-1$ e $2$. Stesso stile della figura `condizioni-esistenza-retta` della 46 (`blue!45`, pallini senza riempimento, tratto interrotto intorno ai pallini, niente `\clip`). Compilata con `compileFigure` di `scripts/figure/compile.mjs` (245×35) e guardata in chiaro; non vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Il formulario non ha la figura; ha la tabella dei casi e tre avvisi (confronto con le C.E., termini senza denominatore, prodotto in croce).
- 17 carte. Tutte usano equazioni ed esempi della lezione.

## Prerequisiti

La riga `equazioni-fratte <- equazioni-primo-grado, frazioni-algebriche-operazioni` va bene così. La lezione risolve l'equazione intera con i metodi della 16 e porta i membri al denominatore comune come nella somma di frazioni algebriche (48), che a sua volta arriva dalle C.E. (46), dalla semplificazione (47) e dal MCM di polinomi (38): aggiungerli sarebbe ridondante. La differenza tra insiemi ($\mathbb{R} \setminus \{\dots\}$) è solo una notazione citata con un link, non un prerequisito. Se si volesse un arco più corto si potrebbe scrivere `frazioni-algebriche-semplificazione` al posto di `frazioni-algebriche-operazioni` (la riduzione allo stesso denominatore sta nella 47), ma gli esempi 3, 4 e 8 sommano frazioni con il segno meno, che è materia della 48: terrei la riga com'è.

## Per il generatore

1. Una frazione per membro, denominatori di primo grado, soluzione accettabile: $\dfrac{3}{x - 2} = \dfrac{5}{x}$, $S = \{5\}$.
2. Denominatori monomi e numerici, MCM monomio: $\dfrac{2}{x} + \dfrac{1}{2x} = \dfrac{5}{4}$, $S = \{2\}$.
3. Un denominatore da scomporre (differenza di quadrati o raccoglimento), soluzione anche frazionaria: $\dfrac{1}{x - 2} + \dfrac{2}{x + 2} = \dfrac{6}{x^2 - 4}$, $S = \left\{\dfrac{8}{3}\right\}$.
4. Denominatori opposti e termini senza denominatore: $\dfrac{x}{x - 1} + \dfrac{2}{1 - x} = 3$, $S = \left\{\dfrac{1}{2}\right\}$.
5. Prodotti di binomi in cui $x^2$ si cancella: $\dfrac{x - 1}{x + 1} = \dfrac{x + 2}{x + 3}$, $S = \{-5\}$.
6. Casi scomodi mescolati: soluzione non accettabile ($S = \emptyset$), intera impossibile ($S = \emptyset$), indeterminata ($S = \mathbb{R} \setminus \{\dots\}$), soluzione $0$ accettabile. Le risposte a scelta dovrebbero includere la soluzione esclusa come distrattore.

Il controllo del generatore deve verificare, oltre alla soluzione, che nessun valore escluso venga dato come soluzione e che nei livelli 1-5 la soluzione non coincida per caso con un valore escluso.
