# Note: Relazioni di equivalenza e d'ordine

Lezione nuova, scritta da zero (lotto 4). Nove esempi svolti in riquadro, sette figure, 19 carte. I conti sono pochi (resti, prodotti in croce), ma ogni affermazione "vale / non vale" su una relazione è stata controllata con uno script Python con SymPy (`scratchpad/41-verifica.py`): per ogni relazione della lezione, del formulario e delle carte lo script costruisce l'insieme delle coppie (su un tratto finito di ℕ o ℤ quando l'insieme è infinito) e prova riflessiva, antiriflessiva, simmetrica, antisimmetrica, transitiva e totalità. Tutti i risultati coincidono con il testo, compresa la tabella di confronto.

## Scelte di convenzione

- Notazione $a \mathrel{R} b$ per $(a, b) \in R$, relazione sempre chiamata $R$ (niente $\sim$ né $\preceq$). Classe $[a]$, insieme quoziente $A/R$. La lezione 40 (Relazioni binarie), scritta in parallelo, dovrebbe usare la stessa scrittura $a \mathrel{R} b$: da controllare quando si leggono insieme.
- Il diagramma di una relazione in un insieme è descritto come "punti e frecce" e l'anello si chiama cappio. Non ho usato "grafo" né "diagramma sagittale": se la 40 introduce un nome, conviene allinearsi.
- Ordine largo: riflessiva, antisimmetrica, transitiva. Ordine stretto: antiriflessiva, antisimmetrica, transitiva. Alcuni libri definiscono lo stretto solo con antiriflessiva e transitiva; un riquadro `ad-note` spiega che l'antisimmetrica ne segue, così la lezione va bene con tutte e due le versioni. Altri libri ancora chiamano "d'ordine" ogni relazione antisimmetrica e transitiva; la mia frase di definizione ("antisimmetrica e transitiva e in più riflessiva oppure antiriflessiva") è compatibile.
- Per introdurre l'ordine stretto serve l'antiriflessiva, che nel brief non c'era: è un paragrafo dentro la sezione sulla riflessiva, con il controesempio che mostra che "non riflessiva" non vuol dire antiriflessiva.
- Totale: "due elementi diversi qualsiasi sono confrontabili". Con "diversi" la definizione vale anche per gli ordini stretti.
- Divisibilità: il brief dice "divisibilità in ℕ", ma la lezione 19 definisce il divisore solo diverso da zero ("$0$ non è divisore di nessun numero"). Con quella definizione $0$ non è in relazione con sé stesso e la relazione in ℕ non è riflessiva. Ho scritto quindi "tra i naturali diversi da zero", e l'esempio 7 usa i divisori di $6$. Se si vuole ℕ intero bisogna cambiare la definizione nella 19 (con $0$ che divide $0$), cosa che sconsiglio.
- Parallelismo: la lezione dice che è di equivalenza "se si considera ogni retta parallela a sé stessa, come fanno molti libri (due rette sono parallele se non hanno punti in comune oppure coincidono)". La lezione di geometria Rette perpendicolari e parallele, quando si scrive, deve usare la stessa definizione, altrimenti il parallelismo non è riflessivo.
- Frazioni equivalenti: la classe di $\frac{2}{3}$ è scritta con numeratori e denominatori naturali ($\frac{2}{3}, \frac{4}{6}, \frac{6}{9}, \ldots$). Con numeratori negativi la classe conterrebbe anche $\frac{-2}{-3}$; non l'ho detto per non aprire l'argomento.

## Lasciato ad altre lezioni

- Definizione di relazione, prodotto cartesiano, modi di rappresentare una relazione: un paragrafo di richiamo e il link a Relazioni binarie.
- Divisione con resto: link a Operazioni in ℕ. Controllo in croce delle frazioni: link a Frazioni e numeri razionali. Doppia inclusione: link a Sottoinsiemi e uguaglianza.
- Il diagramma di Hasse non c'è: nell'esempio 7 si disegnano tutte le frecce e tutti i cappi. È un argomento che pochi libri del biennio trattano.
- Partizione di un insieme: la lezione dice che le classi "dividono $A$ in gruppi che non si sovrappongono" senza dare il nome "partizione". Se la lezione 03 o un'altra lo introduce, si può aggiungere una parola e un link.

## Da togliere o controllare in lezioni già scritte

- Sottoinsiemi e uguaglianza (04), sezione "Proprietà dell'inclusione": la tabella riflessiva/antisimmetrica/transitiva potrebbe chiudersi con una frase "per questo l'inclusione è una relazione d'ordine" e il link a questa lezione. Nient'altro da togliere.
- Frazioni e numeri razionali (23), sezione "Frazioni equivalenti": si può aggiungere un link a questa lezione dove si dice che le frazioni equivalenti rappresentano lo stesso numero (il numero razionale come classe di frazioni equivalenti è nell'esempio 6).
- Nessuna lezione pubblicata oggi tratta le proprietà delle relazioni, quindi non ci sono doppioni.

## Figure

Sette, tutte in bianco e nero salvo una, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`) in un'anteprima locale; non viste sul sito.

1. `proprieta-riflessiva-cappi` (182×130): tre elementi con il cappio e una freccia.
2. `proprieta-simmetrica-frecce-andata-ritorno` (158×106): frecce curve di andata e ritorno.
3. `proprieta-antisimmetrica-una-freccia` (156×104): un ciclo di tre frecce senza ritorno e un cappio (è antisimmetrica ma non transitiva, cosa che il testo non dice: si può usare come esercizio).
4. `proprieta-transitiva-scorciatoia` (132×95): la scorciatoia tratteggiata.
5. `relazione-cappi-frecce-uno-due-tre` (250×112), esempio 1.
6. `relazione-equivalenza-classi-diagramma` (242×192), esempio 5: le due classi su fondo `blue!15` e `orange!20`, linee con due punte per andata e ritorno (il testo dell'esempio lo spiega).
7. `relazione-ordine-divisori-di-sei` (202×210), esempio 7.

I cappi sono disegnati con `to[out=…, in=…, looseness=8]`, senza librerie. Il formulario non ha figure.

## Formulario e flashcard

- Il formulario ha la tabella delle proprietà con la lettura sul diagramma, le classi di $\mathbb{N}$ per il resto $3$ e una tabella dei tipi di relazione ridotta a sei righe (senza la perpendicolarità).
- 19 carte, tutte con relazioni ed esempi della lezione.

## Prerequisiti

Proposta: `relazioni-equivalenza-ordine <- relazioni-binarie, sottoinsiemi-ugualianza`. La lezione si regge sulla definizione di relazione in un insieme e sul suo diagramma, che vengono dalla 40. L'inclusione tra insiemi però è uno dei tre esempi di relazione d'ordine chiesti dal brief, compare nella sezione sull'antisimmetrica (la doppia inclusione) e nella tabella finale, e oggi non è un antenato della lezione: nel grafo il prodotto cartesiano dipende solo da insiemi-rappresentazione, non da sottoinsiemi-ugualianza. Gli altri argomenti degli esempi (divisione con resto, divisibilità, frazioni equivalenti) sono richiamati in una riga con il link e non servono per seguire le definizioni: sono lezioni collegate, non prerequisiti. Se si preferisce tenere una sola freccia, la riga attuale regge, ma lo studente arriverebbe all'inclusione senza averla vista.

## Per il generatore

1. Una proprietà alla volta su una relazione finita (3-4 elementi) data con l'elenco delle coppie: "è riflessiva?", "è simmetrica?", con la coppia mancante come risposta al "no".
2. Le quattro proprietà di una relazione finita data con l'elenco o con il diagramma (come l'esempio 1).
3. Proprietà di una relazione in $\mathbb{N}$ o $\mathbb{Z}$ data a parole, con il controesempio quando non vale: $a \cdot b > 0$, $a + b$ pari, $a < b$, "$a$ e $b$ hanno la stessa ultima cifra", $|a| = |b|$.
4. Relazioni di equivalenza: classi e insieme quoziente di una relazione finita, oppure delle classi di "stesso resto nella divisione per $n$" con $n$ tra $2$ e $5$, compreso "a quale classe appartiene $[k]$".
5. Relazioni d'ordine: stabilire se una relazione è d'ordine, largo o stretto, totale o parziale (divisibilità sui divisori di un numero, inclusione tra i sottoinsiemi di $\{1, 2\}$, $\leq$ e $<$).
6. Casi scomodi: aggiungere il minimo numero di coppie perché una relazione finita diventi riflessiva, simmetrica, transitiva o di equivalenza (il caso dell'andata e ritorno che richiede i cappi).
