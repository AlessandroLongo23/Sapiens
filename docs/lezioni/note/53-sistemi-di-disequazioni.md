# Note: Sistemi di disequazioni

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`reduce_inequalities` su ogni disequazione e su ogni sistema, compresi i casi varianti citati nel testo: $5 - x > 3$ nell'esempio 5, $x + 3 > x + 5$ nell'esempio 6, i controlli con un numero e sugli estremi). Otto esempi svolti, sette figure.

## Scelte di convenzione

- Intervalli con le parentesi quadre rivolte verso l'esterno per gli estremi esclusi ($]2, 5[$, $]-\infty, 4[$), come chiede il brief di lotto per tutte e tre le lezioni di disequazioni. Da verificare con il libro in uso: alcuni libri usano le tonde, $(2, 5)$. Davanti a una parentesi aperta al contrario ho scritto `S = \, ]2, 5[`, perché KaTeX tratta `]` come parentesi di chiusura e lo attaccherebbe all'uguale.
- Grafico del sistema: retta orientata in basso con i numeri, sopra una riga per disequazione, linea continua solo dove la disequazione è vera (niente tratteggio dove è falsa), pallino pieno o vuoto, linee verticali tratteggiate sugli estremi, striscia della soluzione colorata. La lezione dice che i libri lo disegnano in modi diversi (tratteggio dove è falsa, retta in alto). Da verificare con il libro in uso.
- A sinistra di ogni riga c'è la disequazione risolta ($x > 2$), non quella di partenza; per la disequazione sempre vera dell'esempio 6 l'etichetta è $0x > -2$.
- "Sistema impossibile" per $S = \emptyset$, come per le equazioni. Soluzione con un solo numero scritta $S = \{2\}$, con un avviso contro $[2, 2]$.
- La doppia disequazione è presentata prima come sistema (è quello che chiede il brief), poi con il metodo dei tre membri, solo quando la $x$ è nel membro centrale. L'esempio 8 ($x - 1 < 2x + 3 < 5$) mostra il caso in cui serve il sistema.
- Nel formulario la doppia disequazione è data con l'esempio $-1 < 2x + 3 \le 7$ e non con la forma generale $a < ax + b < c$ del brief, dove la lettera $a$ avrebbe due significati.

## Lasciato ad altre lezioni

- Come si risolve una singola disequazione, i principi di equivalenza, il cambio di verso, la forma normale con i casi sempre vera e mai vera, la notazione degli intervalli: link a Disequazioni di primo grado e intervalli (52). Nella lezione ci sono solo i passaggi risolutivi, senza rispiegare.
- Intersezione e simbolo $\cap$: link a Proprietà delle operazioni tra insiemi (03), come chiede il brief. Il link all'unione (in un avviso sulle condizioni unite da "o") va a Unione insiemistica, che è scritta.
- Lo studio del segno ha un avviso in fondo ("Confondere il grafico del sistema con lo studio del segno"), con link alla lezione 54. Se la 54 ha già un avviso uguale dal suo lato, uno dei due si può togliere.
- Sistemi con disequazioni fratte o di secondo grado: non citati, arrivano al secondo anno.
- Nessun problema a parole con un sistema di disequazioni: l'apertura traduce due condizioni in un sistema, ma non c'è un esempio svolto. Se si vuole, un problema tipo "un numero intero tale che…" (con le soluzioni intere dentro un intervallo) sarebbe il nono esempio.

## Da togliere o controllare in lezioni già scritte

Niente: nessuna lezione pubblicata tratta i sistemi di disequazioni. Proprietà delle operazioni tra insiemi (03) potrebbe citare questa lezione come uso dell'intersezione.

## Figure

Sette, tutte generate con lo stesso schema (script in `scratchpad/53-fig/gen.py`) e compilate con `compileFigure` di `scripts/figure/compile.mjs`; ho guardato gli SVG in chiaro.

| Nome | Dimensioni |
|---|---|
| `sistema-disequazioni-intervallo-limitato` | 252×76 |
| `sistema-disequazioni-stesso-verso` | 191×76 |
| `sistema-tre-disequazioni` | 269×98 |
| `sistema-disequazioni-impossibile` | 252×76 |
| `sistema-disequazioni-un-solo-punto` | 191×77 |
| `sistema-disequazione-sempre-vera` | 207×76 |
| `doppia-disequazione-sistema` | 261×77 |

Colori `blue!50` per le linee, `orange!20` per la striscia della soluzione, `orange!45` per la linea verticale del sistema con un solo punto, `gray!70` per le verticali tratteggiate. Niente `\clip` né riempimenti bianchi: il pallino vuoto è un cerchio senza riempimento, e la linea si ferma al suo bordo con `shorten`. Non le ho viste sul sito in tema scuro. `\mathbb{R}` non compila in TikZJax (manca amssymb), per questo l'etichetta della riga sempre vera è $0x > -2$. La prima figura è copiata anche nel formulario.

## Formulario e flashcard

- Il formulario ha una tabella dei casi particolari (impossibile, un punto, sempre vera, mai vera) che nella lezione è in prosa in due sezioni; il contenuto è lo stesso.
- 19 carte. Le carte `sistema-un-punto-escluso` e `sistema-oppure-unione` vengono dalla variante dell'esempio 5 e dall'avviso sulle condizioni unite da "o".
- Le formule in evidenza di lezione e formulario sono state misurate con KaTeX a 17 px: la più larga è 183 px.

## Prerequisiti

La riga `sistemi-di-disequazioni <- disequazioni-primo-grado, insiemi-intersezione` va bene nella sostanza, ma `insiemi-intersezione` è una lezione non ancora scritta, e la lezione linka Proprietà delle operazioni tra insiemi al suo posto. Se l'arco serve al ripasso prima che la lezione sull'intersezione esista, lo cambierei in `insiemi-operazioni` (03); quando Intersezione insiemistica sarà scritta, si torna a `insiemi-intersezione` e si aggiorna il link. Non servono altri archi: le equazioni di primo grado arrivano attraverso disequazioni-primo-grado, e il MCM dei denominatori numerici dell'esempio 3 è già nella 52.

## Per il generatore

1. Sistema di due disequazioni già in forma $x > a$, $x \le b$ (o da un solo passaggio), con soluzione un intervallo limitato o illimitato: $x > 2$, $x < 5$ dà $]2, 5[$.
2. Sistema di due disequazioni di primo grado da risolvere, con un cambio di verso e l'estremo compreso in una sola: $5 - 2x \le 1$, $3x - 4 > x$ dà $]2, +\infty[$.
3. Sistema di tre disequazioni, una con denominatori numerici: esempio 3, $S = [-3, 4]$.
4. Casi limite: sistema impossibile, sistema con un solo punto, punto escluso (risposta $\emptyset$, $\{2\}$ o un intervallo, con i distrattori sugli estremi).
5. Sistema con una disequazione sempre vera o mai vera ($0x > b$).
6. Doppia disequazione con la $x$ solo al centro, anche con coefficiente negativo: $1 \le 3 - 2x < 7$ dà $]-2, 1]$.
7. Doppia disequazione con la $x$ in due membri, da risolvere come sistema: $x - 1 < 2x + 3 < 5$ dà $]-4, 1[$.
