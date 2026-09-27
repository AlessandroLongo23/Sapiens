# Note: Sistemi di due equazioni in due incognite

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`linsolve` sui dieci sistemi degli esempi e su quello della nota sui coefficienti nulli, `solve` sui due sistemi fratti, `expand` dei passaggi con le parentesi e dei MCM dell'esempio 5, le verifiche numeriche, i rapporti dell'esempio 8, le coppie dell'esempio 7 e degli avvisi, il valore sbagliato $y = \frac{23}{7}$ dell'avviso sul segno, le equazioni esplicite delle rette nelle figure). La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px di base: la più larga è 251 px nella lezione e 250 px nel formulario (il sito usa 15 px). `check.mts` passa sui tre file senza avvisi.

## Scelte di convenzione (da verificare con il libro in uso)

- Coppie scritte $(x, y)$ con la virgola, come nella 39 e nella 42. Per evitare lo scontro con la virgola decimale gli esempi hanno soluzioni intere o frazionarie, mai decimali.
- Sistemi con `\begin{cases}`, incognite $x$ e $y$, forma normale $ax + by = c$, $a'x + b'y = c'$ con i coefficienti con l'apice (è la notazione dei rapporti $\frac{a}{a'}$ del brief; alcuni libri usano $a_1, a_2$).
- Soluzione scritta $S = \{(3, 2)\}$, coerente con $S$ della 16 e della 49. Molti libri scrivono solo "$(3; 2)$" o "$x = 3$, $y = 2$".
- Indeterminato: $S = \{(x, y) \mid x - 2y = 3\}$, con in più la forma parametrica $\{(2t + 3, t) \mid t \in \mathbb{R}\}$. La lettera $t$ è mia; alcuni libri usano $k$ o scrivono "$\forall y \in \mathbb{R}$". Se la forma parametrica sembra troppo per il biennio, si toglie la frase senza altre conseguenze.
- "Metodo di riduzione", con "di addizione e sottrazione" citato una volta. La proprietà è enunciata come sistema equivalente (una equazione sostituita dalla somma), che è l'enunciato corretto; l'idea "somma e un'incognita sparisce" è nei passi.
- Grado del sistema come prodotto dei gradi, definizione più diffusa. Il sistema di grado 2 è citato senza link, perché la lezione "Sistemi di secondo grado" non è scritta.
- Criterio dei rapporti con la condizione esplicita "$a'$, $b'$, $c'$ diversi da zero" e un riquadro `ad-note` con i prodotti in croce $ab' \neq a'b$ per i coefficienti nulli, che rimanda al determinante della 69. Nel criterio i rapporti si leggono solo sulla forma normale (avviso dedicato).
- Figure: rette in `blue!60` e `red!50`, etichette in `blue!70!black` e `red!60!black`, punti neri. Nelle coincidenti una riga larga `blue!35` con sopra una tratteggiata `red!60`, per far vedere che le rette sono due.

## Lasciato ad altre lezioni

- Regola di Cramer, determinanti, sistemi letterali e sistemi di tre equazioni: 69 (un link nella scelta del metodo e uno nel riquadro sui coefficienti nulli).
- Problemi che portano a un sistema: 70. Non l'ho linkata perché nella lezione non c'è un punto naturale; l'apertura usa un problema (quaderni e penne) solo come motivazione. Se si vuole, si aggiunge una frase in fondo all'apertura.
- Equazione della retta, coefficiente angolare, intersezione tra rette: lezioni del capitolo "Piano cartesiano e retta" non scritte, quindi niente link; per il grafico di $y = mx + q$ il link è alla 45.
- Condizioni di esistenza: il metodo è nella 49 (link); qui solo il fatto che riguardano tutte e due le incognite.

## Da cambiare nelle lezioni già scritte

- 16 (Equazioni di primo grado intere): l'apertura linka già questa lezione ("nei [sistemi di equazioni](...)"). Niente da cambiare.
- 45 (Proporzionalità diretta e inversa): facoltativo. Alla fine della sezione "La funzione lineare", dopo il rimando all'equazione della retta, si può aggiungere: "Due rette di questo tipo si incontrano, in generale, in un punto: trovarlo vuol dire risolvere un [sistema di due equazioni](/materiale/scuola-superiore/matematica/sistemi-lineari/sistemi-di-due-equazioni-in-due-incognite)."
- 53 (Sistemi di disequazioni): nessuna modifica necessaria. Le due lezioni usano "sistema" per cose diverse (una incognita e intervalli, due incognite e coppie), ma il contesto le separa.

## Figure

Quattro, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`): leggibili in tutti e due.
- `equazione-lineare-due-incognite-retta` (164×165): la retta $x + y = 5$ con sei punti a coordinate intere.
- `sistema-determinato-rette-incidenti` (187×162): $x + y = 5$ e $2x + 3y = 12$ con il punto $(3, 2)$ e le tratteggiate verso gli assi.
- `sistema-impossibile-rette-parallele` (225×116): $2x + 3y = 6$ e $4x + 6y = 5$.
- `sistema-indeterminato-rette-coincidenti` (184×116): $x - 2y = 3$ e $-2x + 4y = -6$ sovrapposte, con i punti $(1, -1)$, $(3, 0)$, $(5, 1)$.

Tutte fuori dai riquadri e sotto i 280 px. Non viste sul sito. Il formulario non ha figure.

## Formulario e flashcard

- Il formulario ha i tre metodi in passi brevi, la tabella dei rapporti con la colonna delle rette, i sistemi fratti in tre passi e tre avvisi (ordine nella coppia, segno nella sottrazione, indeterminato).
- 20 carte, tutte su esempi e regole della lezione.

## Prerequisiti

La bozza `sistemi-di-equazioni <- equazioni-primo-grado` è corta di un arco. La cambierei in

```
sistemi-di-equazioni <- equazioni-primo-grado, funzioni-lineari
```

perché la sezione "Interpretazione grafica" e la prima figura ricavano $y = mx + q$ e la leggono come retta, cosa che senza la 45 non si segue; la 45 porta con sé anche le coppie ordinate (dalla 39, attraverso relazioni e funzioni). I sistemi fratti usano la 49, ma sono l'ultima sezione e il resto della lezione si segue senza: non la metterei come prerequisito. Se invece si vuole che la lezione intera sia coperta, `equazioni-fratte` sostituisce `equazioni-primo-grado` (che ne è antenato) e la riga diventa `sistemi-di-equazioni <- equazioni-fratte, funzioni-lineari`.

## Per il generatore

1. Verificare se una coppia è soluzione di un sistema (anche con la coppia scambiata come distrattore), e portare un'equazione in forma normale.
2. Sostituzione con un coefficiente $1$ o $-1$, soluzione intera: $x + y = 5$, $2x + 3y = 12$, $S = \{(3, 2)\}$.
3. Confronto con due equazioni $y = mx + q$, soluzione anche frazionaria: $y = 2x - 1$, $y = 4 - x$, $S = \left\{\left(\frac{5}{3}, \frac{7}{3}\right)\right\}$.
4. Riduzione con coefficienti da moltiplicare in tutte e due le equazioni e soluzioni negative: $3x + 4y = 2$, $2x - 5y = 9$, $S = \{(2, -1)\}$.
5. Sistemi con denominatori numerici da portare in forma normale: esempio 5, $S = \{(2, 3)\}$.
6. Riconoscere dai coefficienti se il sistema è determinato, impossibile o indeterminato (con la rappresentazione delle rette come risposta alternativa), con alcuni sistemi da risolvere fino a $0 = k$.
7. Sistemi fratti: C.E. su $x$ e $y$, soluzione accettabile o non accettabile ($S = \emptyset$).

Il controllo del generatore deve verificare la soluzione con `linsolve`, che nei livelli 2-5 il sistema sia determinato, e nel livello 7 che la soluzione non accettabile cada davvero su un valore escluso.
