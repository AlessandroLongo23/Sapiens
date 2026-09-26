# Note: Operazioni tra polinomi

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (somme, prodotti, divisioni per un monomio, gradi, i due controlli con $x = 2$) sono stati rifatti con SymPy. Il controllo `check.mts` passa senza errori né avvisi sui tre file.

## Scelte di convenzione

- Risultati ordinati secondo le potenze decrescenti di una lettera, come dice il brief del lotto; nell'esempio 8, con due lettere, si dice esplicitamente "decrescenti di $x$".
- Divisione per un monomio scritta con ":" come in Operazioni tra monomi; `\cdot` solo dove serve mostrare il singolo prodotto.
- "Proprietà distributiva della moltiplicazione rispetto alla somma", in grassetto perché è il punto in cui la lezione la nomina come regola. Se la si considera già definita in Operazioni in ℕ, si può togliere il grassetto (i grassetti sono tre: polinomio opposto, proprietà distributiva, divisibile).
- "Divisibile" per un polinomio rispetto a un monomio, con la stessa condizione della lezione 14 per i monomi (ogni lettera del divisore in ogni termine, con esponente maggiore o uguale).
- Il grado del prodotto è motivato solo per una lettera ("con una sola lettera il motivo si vede subito"); con più lettere la regola vale ma la spiegazione con "il termine di grado più alto" non è esatta, perché i termini di grado massimo possono essere più d'uno. Ho preferito dire meno.

## Lasciato ad altre lezioni

- Termini, forma normale, grado, polinomio nullo: [Polinomi e grado di un polinomio] (28), con link nell'apertura.
- Prodotti notevoli (30): solo un riquadro `ad-note` dopo l'esempio 10, che dice che $(x - 1)(x + 1)$ e $(x + 3)^2$ hanno una regola veloce, con il link. Niente errore $(a+b)^2 = a^2 + b^2$, che resta alla 30.
- Divisione tra polinomi (32): una riga di link in fondo, dopo l'esempio 13 (quoziente che non è un polinomio).
- Espressioni con polinomi (31): nessun esempio con più operazioni mescolate. Il controllo con il valore numerico compare qui solo come riquadro `ad-tip` sul singolo prodotto; la 31 lo tratta per le espressioni.

## Da togliere o controllare in lezioni già scritte

- Operazioni tra monomi (13), riga 124: il link "potenza di un monomio" punta alla stessa lezione (`operazioni-tra-monomi`). Va corretto o tolto; non c'è una lezione separata sulla potenza.
- Equazioni di primo grado intere (16) dice "Svolgi i prodotti e togli le parentesi" senza link: si potrebbe aggiungere un link a questa lezione nel passo 2 del procedimento.

## Figura

Una: `prodotto-di-due-binomi-rettangolo`, dentro l'esempio 6. Il rettangolo di lati $x + 3$ e $x + 2$ diviso nelle quattro aree $x^2$, $3x$, $2x$, $6$, con le quote sui lati. Solo linee e testo, niente riempimenti, niente `\clip`. Compilata con `compileFigure` di `scripts/figure/compile.mjs` (196x173) e guardata in chiaro; non vista sul sito in tema scuro. Somiglia alla figura del quadrato di un binomio che il brief suggerisce per la 30: se nella 30 la figura c'è, conviene che le due usino le stesse proporzioni e lo stesso stile di quote. Non è nel formulario.

## Formulario e flashcard

- 19 carte. `differenza-conto` ($(x^2 + 2x) - (x^2 - 3x) = 5x$) usa numeri che non sono nella lezione; la regola sì.
- Il formulario ha una tabella dei gradi che mette insieme due paragrafi della lezione e la frase sul grado del quoziente nella sezione della divisione.

## Dubbi

- Esempio 10, tre fattori: dice "il prodotto tra polinomi è associativo" senza dimostrarlo. Mi sembra il livello giusto per il biennio, ma si può riformulare come "moltiplica i primi due, poi il risultato per il terzo" senza nominare la proprietà.
- Il riquadro sul controllo con $x = 2$ avverte che $x = 1$ non vede gli esponenti sbagliati. È vero e utile, ma allunga la lezione; se la 31 tratta il controllo per esteso, qui si può ridurre a una riga.

## Livelli per gli esercizi

1. Somma di due polinomi in una lettera, coefficienti interi: $(3x^2 - 5x + 2) + (x^2 + 4x - 7) = 4x^2 - x - 5$.
2. Differenza con cambio di segno e un termine che si annulla, anche in due lettere: $(2x^2y - 3xy + y^2) - (x^2y - 3xy - 4y^2) = x^2y + 5y^2$.
3. Monomio per polinomio, con monomio negativo o coefficienti frazionari: $-3x^2y\,(2x^2 - xy + 4y^2) = -6x^4y + 3x^3y^2 - 12x^2y^3$.
4. Binomio per binomio, con segni: $(x - 3)(x - 4) = x^2 - 7x + 12$.
5. Binomio per trinomio, o due lettere, o coefficienti frazionari: $(2x - 3)(x^2 - 4x + 5) = 2x^3 - 11x^2 + 22x - 15$.
6. Divisione di un polinomio per un monomio, anche con coefficiente negativo frazionario, o riconoscere che il quoziente non è un polinomio: $(12x^4y^2 - 8x^3y^3 + 4x^2y) : (4x^2y) = 3x^2y - 2xy^2 + 1$.

## Prerequisiti

La riga `polinomi-operazioni <- polinomi` va bene così. La lezione usa anche le operazioni tra monomi (prodotto e quoziente) e le frazioni nei coefficienti, ma ci arriva già attraverso `polinomi <- monomi-grado, monomi-operazioni`: aggiungere `monomi-operazioni` sarebbe un arco ridondante, che lo script segnalerebbe. Le regole sul grado usano il grado di un polinomio (28) e il grado di un monomio (12), anche questi già a monte di `polinomi`.
