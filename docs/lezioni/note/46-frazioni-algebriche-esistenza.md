# Note: Frazioni algebriche e condizioni di esistenza

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: i valori degli esempi 1 e 2 e dell'apertura, `factor` e `solve` su ogni denominatore (esempi 3-10, gli avvisi, la tabella del formulario), `solve` sui denominatori che "non si annullano mai" ($x^2 + 1$, $x^2 + 4$, $3x^2 + 2$, $x^4 + x^2 + 5$: solo radici complesse) e su $x^2 - 3$ (radici $\pm\sqrt{3}$). Il controllo automatico `check.mts` passa sui tre file.

Dieci esempi svolti: due sul valore, otto sulle condizioni di esistenza, dal denominatore con una differenza di quadrati fino a quello con un raccoglimento parziale e un fattore che non si annulla mai. I casi scomodi: valori frazionari e fattore scritto "al contrario" ($3 - 2x$, esempio 7), stesso fattore al numeratore e al denominatore (esempio 8), condizione che lega due lettere ($a \neq b$, esempio 9).

## Scelte di convenzione

- Più condizioni si scrivono separate da una virgola, "C.E.: $x \neq 2$, $x \neq 3$", e la lezione dice che la virgola vuol dire "e". Alcuni libri scrivono $x \neq 2 \wedge x \neq 3$, altri "$x \neq 2$ e $x \neq 3$". Ho scelto la virgola perché è la più leggera sul telefono e non richiede il simbolo $\wedge$. Da concordare con 47, 48 e 49, che usano le C.E. di continuo.
- Due valori opposti si abbreviano con $\pm$: "C.E.: $x \neq \pm 3$". La lezione scrive prima la forma estesa e poi l'abbreviazione.
- Quando il denominatore non si annulla mai: "C.E.: nessuna condizione", e non "$\forall x \in \mathbb{R}$", perché i numeri reali nell'albero arrivano al secondo anno. Anche questo da concordare con 47-49.
- La definizione di frazione algebrica dice "quoziente di due polinomi con denominatore diverso dal polinomio nullo", e poi precisa che si parla di frazione algebrica quando il denominatore contiene una lettera; con un numero al denominatore è un polinomio a coefficienti frazionari. I libri oscillano (alcuni chiamano frazione algebrica anche $\frac{x + 1}{3}$); la lezione dice le due cose senza contraddirsi.
- Denominatore di primo grado: il valore escluso si trova "come in un'equazione di primo grado", con un link alla lezione 16 e i passaggi scritti con $\neq$. Non ho spiegato i principi di equivalenza.

## La legge di annullamento del prodotto

Il brief chiede di spiegarla qui. La lezione la enuncia, la giustifica in due righe (zero elemento assorbente in un verso, divisione per il fattore non nullo nell'altro) e poi la legge al contrario, che è la forma che serve per le C.E. La lezione 06 (Operazioni in ℕ) la nomina già in una frase e la lezione 17 (Equazioni di secondo grado) la enuncia in una riga: in 17 si potrebbe aggiungere un link a questa lezione. Il dubbio in `prerequisiti.md` ("La legge di annullamento del prodotto ... non ha una lezione sua nel primo anno") si può chiudere: la sua spiegazione è qui.

## Lasciato ad altre lezioni

- Le tecniche di scomposizione: solo i link nel procedimento (34, 35, 36, 37). Nessun esempio usa Ruffini, perché la riga dei prerequisiti non lo prevede.
- Semplificazione: l'esempio 8 dice che la C.E. resta dopo la semplificazione e rimanda alla 47, senza semplificare.
- Divisione per una frazione algebrica (C.E. anche sul numeratore del divisore): una frase con link alla 48.
- Dominio naturale: un riquadro `ad-note` con link alla 43.
- Denominatori irriducibili che si annullano in punti irrazionali ($x^2 - 3$): un riquadro `ad-note` che avvisa e rimanda alle equazioni di secondo grado. Si può togliere senza toccare il resto.
- Non tratto $\frac{1}{x^2 + y^2}$ (si annulla solo per $x = y = 0$ insieme): la condizione "non entrambi nulli" è scomoda da scrivere e non serve al primo anno.

## Da togliere o controllare in lezioni già scritte

- 17 (Equazioni di secondo grado), riga con "è la **legge di annullamento del prodotto**": può restare, con un link a questa lezione.
- 06 (Operazioni in ℕ): la frase sulla legge va bene così.
- Nessuna lezione pubblicata tratta le frazioni algebriche, quindi non c'è altro da togliere.

## Figura

Una sola, `condizioni-esistenza-retta`, dentro l'esempio 3: la retta dei numeri colorata in `blue!45` con due pallini vuoti in $-3$ e $3$ (cerchi senza riempimento, la linea colorata è interrotta sotto i pallini, niente `\clip` né bianco). Compilata con `compileFigure` di `scripts/figure/compile.mjs`: 270×35, guardata in chiaro. Il primo tentativo aveva i cerchi schiacciati per via di `x=0.7cm`; ora il raggio è in `pt`. Non l'ho vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Il formulario ha una tabella con i cinque denominatori tipo degli esempi (differenza di quadrati, trinomio, raccoglimento, quadrato, due lettere) e tre avvisi.
- 20 carte. `denominatore-numerico` usa $\frac{x + 1}{3}$, che nella lezione c'è; `primo-grado-conto` ed `errore-segno-valore-escluso` usano $\frac{1}{2x - 3}$ e $\frac{x}{3 - x}$, i cui denominatori sono nella lezione.

## Prerequisiti

La riga `frazioni-algebriche-esistenza <- scomposizione-prodotti-notevoli, scomposizione-trinomio` va bene così: gli esempi usano raccoglimento (a cui si arriva da entrambe), differenza di quadrati, quadrato di binomio e trinomio. Il valore numerico dei polinomi arriva per la catena dei polinomi. L'unico candidato in più sarebbe `equazioni-primo-grado`, per trovare il valore che annulla $2x - 3$; non lo aggiungerei, perché la lezione fa il passaggio per esteso ($2x = 3$, $x = \frac{3}{2}$) e nell'albero le frazioni algebriche vengono prima delle equazioni. Se invece le scuole di riferimento fanno le equazioni prima della scomposizione, l'arco ha senso.

## Per il generatore

1. Valore di una frazione algebrica per un valore dato, anche negativo o che annulla il numeratore o il denominatore: $\frac{x^2 - 1}{x + 3}$ per $x = 2$ vale $\frac{3}{5}$, per $x = -3$ non esiste.
2. C.E. con denominatore di primo grado, anche con valore frazionario o con la $x$ col segno meno: $\frac{1}{2x - 3}$, C.E.: $x \neq \frac{3}{2}$; $\frac{x}{3 - x}$, C.E.: $x \neq 3$.
3. C.E. con denominatore monomio o con un raccoglimento totale: $\frac{x - 1}{2x^2 + 6x}$, C.E.: $x \neq 0$, $x \neq -3$.
4. C.E. con differenza di quadrati o quadrato di binomio: $\frac{x + 5}{x^2 - 9}$, C.E.: $x \neq \pm 3$; $\frac{x}{x^2 - 4x + 4}$, C.E.: $x \neq 2$.
5. C.E. con un trinomio di secondo grado: $\frac{3x}{x^2 - 5x + 6}$, C.E.: $x \neq 2$, $x \neq 3$.
6. C.E. con scomposizioni in più passi, fattori che non si annullano mai o due lettere: $\frac{x + 1}{9x - 4x^3}$, C.E.: $x \neq 0$, $x \neq \pm\frac{3}{2}$; $\frac{2}{x^3 + x^2 + 4x + 4}$, C.E.: $x \neq -1$; $\frac{a + b}{a^2 - ab}$, C.E.: $a \neq 0$, $a \neq b$.
7. C.E. di un'espressione con più frazioni: $\frac{1}{x} + \frac{2}{x - 1} - \frac{x}{x^2 + 1}$, C.E.: $x \neq 0$, $x \neq 1$.

Per il formato della risposta il generatore dovrà accettare l'ordine libero delle condizioni e le due forme $x \neq \pm 3$ e $x \neq 3$, $x \neq -3$.
