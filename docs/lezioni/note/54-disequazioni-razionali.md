# Note: Studio del segno e disequazioni fratte

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solveset` sulle sette disequazioni degli esempi, sui due casi della sezione sulla tabella e su quelle degli avvisi; `expand` e `factor` di ogni passaggio intermedio; i valori numerici delle verifiche e dei controesempi: $x = -1$ in $x^2 \leq 4x$, $x = \frac{1}{2}$ nel prodotto in croce, $x = 0$ e $x = -2$ nelle verifiche, i prodotti della regola dei segni). La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px di base: la più larga è 207 px nella lezione e 221 px nel formulario.

## Scelte di convenzione

- Intervalli con le parentesi quadre rivolte verso l'esterno per gli estremi esclusi ($]-1, 4[$, $]-\infty, -3[$), come chiede il brief di lotto: da verificare con il libro in uso. In LaTeX ho messo `\,` davanti a una `]` che apre un intervallo dopo un `=` o un `\cup`, perché KaTeX la tratta come parentesi chiusa e la attacca al simbolo precedente; in $\left]-\infty, -\frac{1}{2}\right[$ uso `\left]` e `\right[`.
- Unione di intervalli con $\cup$ e link alla lezione Unione insiemistica (05). In parole scrivo "$x < -3$ oppure $x > 2$", non $\vee$: va allineato con le lezioni 52 e 53, che non ho visto.
- Tabella dei segni (detta anche "grafico dei segni", citato una volta): linea continua dove il fattore è positivo, tratteggiata dove è negativo, $0$ nello zero del fattore, come nei libri italiani più diffusi. Nell'ultima riga lo zero del numeratore è uno $0$ e lo zero del denominatore è un pallino vuoto; molti libri usano invece una croce o il simbolo $\nexists$. Ho scelto il pallino vuoto perché il brief lo chiede e perché è lo stesso segno della retta delle soluzioni.
- Ogni fattore si studia con "$> 0$", anche quando la disequazione è $\geq$; gli zeri si aggiungono alla fine (passo 5). Alcuni libri studiano $N \geq 0$ e $D > 0$: il risultato è lo stesso, ma l'ho tenuto uniforme per non avere due regole.
- Sotto ogni tabella degli esempi c'è una riga $S$ con le soluzioni sulla retta (pallino pieno o vuoto). La sezione sulla tabella non ha la riga $S$, perché lì si studia il segno e non c'è ancora una disequazione.
- "Disequazione fratta" come nel titolo; la lezione non usa "razionale" (lo slug sì). "Disequazione intera" compare una volta, nel procedimento del prodotto, senza definizione: si capisce per contrasto con "fratta" e con la 49.

## Lasciato ad altre lezioni

- Principi di equivalenza, cambio di verso, intervalli, pallino pieno e vuoto: link a 52 nell'apertura, con un solo avviso sul cambio di verso per $3 - x > 0$, che qui serve per ogni fattore con il coefficiente negativo.
- Legge di annullamento del prodotto e C.E.: link a 46. Denominatore comune: link a 48. Confronto con le equazioni fratte (C.E., prodotto in croce): link a 49.
- Scomposizione: link a 34 nel procedimento, a 35 (differenza di quadrati) nell'esempio 4 e a 36 (trinomio) nell'avviso finale. La 37 (Ruffini) e la 38 non servono.
- Sistemi di disequazioni: solo un avviso con il link a 53, per non confondere la tabella dei segni con il grafico dei sistemi.
- Fattori di secondo grado irriducibili, fattori ripetuti come $(x - 1)^2$, fattori numerici negativi: lasciati fuori. Il fattore $-1$ compare solo nel riquadro `ad-tip` dopo l'esempio 3. Se si vuole un caso con un fattore al quadrato, è il primo candidato per un esempio in più.

## Da cambiare in lezioni già scritte

- 49 (Equazioni fratte): il riquadro "Dove si usano" linka già questa lezione, niente da cambiare.
- 46 (Frazioni algebriche e condizioni di esistenza): la sezione sulla legge di annullamento del prodotto potrebbe dire che la stessa scomposizione serve per il segno, con un link qui. Facoltativo.

## Figure

Otto blocchi TikZ, generati da uno script con lo stesso schema, così che tutte le tabelle abbiano la stessa misura: `tabella-segni-prodotto` nella sezione sulla tabella e una per ogni esempio (`disequazione-prodotto-minore`, `disequazione-prodotto-estremi-inclusi`, `disequazione-prodotto-coefficiente-negativo`, `disequazione-prodotto-tre-fattori`, `disequazione-fratta`, `disequazione-fratta-primo-membro`, `disequazione-fratta-tre-fattori`). Linee nere, guide verticali `gray!60` tratteggiate, soluzioni `blue!45` come nelle figure della 46 e della 49; niente `\clip`, niente riempimenti bianchi (i pallini vuoti sono solo contorno). Le linee si interrompono intorno agli $0$, e le guide verticali si fermano prima di ogni riga. Compilate con `compileFigure` di `scripts/figure/compile.mjs` direttamente dai file: larghe 258-262 px, alte 92-139 px. Le ho guardate in PNG in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`); non sul sito. TikZJax non conosce `\tfrac`: nell'esempio 3 lo zero è scritto $-\frac{1}{2}$.

Il formulario copia `disequazione-fratta` (esempio 5), perché mostra in una figura sola linee, zeri, pallino vuoto del denominatore e riga delle soluzioni.

## Formulario e flashcard

- Il formulario ha una figura e tre avvisi (moltiplicare per il denominatore, includere lo zero del denominatore, dividere per l'incognita).
- 19 carte, tutte su esempi e regole della lezione. La carta `segno-prodotto-conto` usa $(-2) \cdot 3 \cdot (-5) \cdot (-1)$, che nella lezione non c'è; la regola sì.

## Prerequisiti

La riga `disequazioni-razionali <- disequazioni-primo-grado, frazioni-algebriche-esistenza` la cambierei in

`disequazioni-razionali <- disequazioni-primo-grado, frazioni-algebriche-operazioni`

perché gli esempi 6 e 7 portano tutto a primo membro e riducono a una frazione sola con il denominatore comune, cioè sommano frazioni algebriche con il segno meno, che è materia della 48. La 48 arriva alla 46 attraverso la 47, quindi le C.E. e la legge di annullamento del prodotto restano tra gli antenati, e con loro la scomposizione (35, 36). In alternativa si può mettere `equazioni-fratte`, che contiene già la 48 e che la lezione richiama in due punti (C.E., prodotto in croce); non l'ho proposta perché la lezione non usa niente che sia solo della 49. L'unione di intervalli è una notazione con un link, non un prerequisito.

## Per il generatore

1. Prodotto di due fattori già scomposti, coefficienti di $x$ positivi, verso stretto: $(x + 1)(x - 4) < 0$, $S = \,]-1, 4[$.
2. Estremi compresi, dopo aver portato tutto a primo membro e raccolto: $x^2 \leq 4x$, $S = [0, 4]$. Distrattore: $x \leq 4$.
3. Un fattore con il coefficiente di $x$ negativo, zeri anche frazionari: $(3 - x)(2x + 1) < 0$, $S = \left]-\infty, -\frac{1}{2}\right[ \cup \,]3, +\infty[$.
4. Tre fattori, dopo raccoglimento e differenza di quadrati, o $x^2 > k^2$: $x^3 - 9x \geq 0$, $S = [-3, 0] \cup [3, +\infty[$. Distrattore per $x^2 > 9$: $x > 3$.
5. Fratta già nella forma $\frac{N}{D}$ con verso largo: $\frac{x - 1}{x + 2} \geq 0$, $S = \,]-\infty, -2[\, \cup [1, +\infty[$. Distrattore: $-2$ incluso.
6. Fratta da portare a primo membro: $\frac{2x + 1}{x - 3} < 1$, $S = \,]-4, 3[$. Distrattore: $x < -4$ (moltiplicare per il denominatore).
7. Due frazioni, tre fattori, denominatore comune: $\frac{3}{x - 1} \geq \frac{2}{x}$, $S = [-2, 0[\, \cup \,]1, +\infty[$. Distrattore: $x \geq -2$ (prodotto in croce).

Il controllo del generatore deve verificare che gli zeri del denominatore non siano mai inclusi e che, nei livelli con $\geq$ e $\leq$, gli zeri del numeratore lo siano; conviene anche evitare che uno zero del numeratore coincida con uno del denominatore (la frazione si semplificherebbe, caso che la lezione non tratta).
