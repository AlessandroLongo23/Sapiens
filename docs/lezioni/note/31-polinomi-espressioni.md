# Note: Espressioni con polinomi

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (sviluppi, risultati degli esempi, valori numerici dei controlli, termini noti) sono stati rifatti con SymPy.

## Scelte di convenzione

- Risultati ordinati secondo le potenze decrescenti di $x$, come chiede il brief del lotto. Con due lettere questo dà scritture come $-9x^2 + y^2$ al posto di $y^2 - 9x^2$: nella sezione sulla somma per differenza le ho messe tutte e due ($y^2 - 9x^2 = -9x^2 + y^2$), per far vedere da dove viene la seconda. Nella carta `somma-differenza-disordine` la risposta è solo la forma ordinata.
- Divisione per un monomio scritta con ":" come nella 13 e nella 15.
- Per riconoscere una somma per differenza in disordine ho dato una regola sola: il termine con lo stesso segno nei due fattori è $a$, quello con i segni opposti è $b$. Usa i nomi $a$ e $b$ della formula $(a + b)(a - b) = a^2 - b^2$, quindi presuppone che la lezione 30 la scriva così. Da controllare quando la 30 è pronta.
- Nessuna figura: la lezione è fatta di conti e il brief non ne chiedeva.

## Lasciato ad altre lezioni

- Le regole di somma, prodotto e divisione per un monomio sono nella 29, le formule dei prodotti notevoli nella 30: qui non c'è nessuna formula scritta per esteso, solo i casi in cui riconoscerle. Il cubo di un binomio compare nell'esempio 5 senza spiegazione, il quadrato del trinomio nell'esempio 7 con un riquadro sui segni dei doppi prodotti (è l'errore che si fa dentro le espressioni, non una ripetizione della formula).
- Il valore numerico di un polinomio è nella 28: qui c'è il link e il suo uso come controllo.
- Niente triangolo di Tartaglia e niente somma o differenza di cubi, che sono nella 30 e nella 35.

## Dubbi

- Il controllo con il valore numerico: la lezione dice che un valore solo "non basta a dimostrare" il risultato e che se i numeri tornano il risultato "con buona probabilità è giusto". È vero ma informale; il fatto preciso (due polinomi di grado al più $n$ uguali in $n + 1$ punti sono uguali) l'ho lasciato fuori, perché al primo anno non serve. Da decidere se aggiungerlo in un `ad-note`.
- Il consiglio di non scegliere un valore che annulla un fattore è prudente, non necessario: il controllo resta valido, ma gli errori dentro quel fattore non si vedono. La lezione lo dice così.
- Gli esempi 3, 4 e 6 hanno molti termini che si annullano ($x^4$, $x^2y$, i termini in $x$). È voluto, perché capita spesso negli esercizi dei libri, ma se sembrano troppo "costruiti" si possono cambiare i coefficienti.

## Da togliere o controllare in lezioni già scritte

- Espressioni con monomi (15): la nota diceva che il link a questa lezione puntava a una lezione vuota. Ora c'è; niente da cambiare nella 15.
- Operazioni tra polinomi (29) e Prodotti notevoli (30) non le ho viste: se la 30 ha già una sezione sul riconoscere i prodotti notevoli in disordine (per esempio $(3x + y)(y - 3x)$), una delle due va accorciata. Io terrei il riconoscimento qui, dove serve.

## Formulario e flashcard

- Il formulario riassume l'ordine delle operazioni, i quattro modi di riconoscere un prodotto notevole e il controllo in quattro passi. I tre riquadri sono i tre errori della lezione che costano di più (meno davanti a un prodotto, numero davanti a una potenza, divisione solo del primo termine).
- 18 carte. `termine-noto-mente` usa un'espressione ($(x - 3)^2 - (x + 2)(x - 2)$, termine noto $13$) che non è nella lezione, ma la regola sì.

## Prerequisiti

La riga `polinomi-espressioni <- polinomi-prodotti-notevoli, monomi-espressioni` va bene così. La lezione usa l'ordine delle operazioni della 15 e i prodotti notevoli della 30; le operazioni tra polinomi (29) e il valore numerico (28) arrivano attraverso la 30, che dipende dalla 29, che dipende dalla 28, quindi aggiungerle sarebbe un arco ridondante.

## Livelli per gli esercizi

1. Prodotti e somma, senza prodotti notevoli: $3x(x - 2) - (x + 1)(x - 5) = 2x^2 - 2x + 5$.
2. Un prodotto notevole in forma standard con un meno o un numero davanti: $(x - 3)^2 - (x + 2)(x - 2) - 2(x - 1)^2 = -2x^2 - 2x + 11$.
3. Due lettere o monomi di grado più alto: $(2x^2 - y)^2 - (2x^2 + y)(2x^2 - y) + 4x^2(y - 1) = -4x^2 + 2y^2$.
4. Coefficienti frazionari: $\left(\frac{1}{2}x - \frac{2}{3}\right)^2 - \left(\frac{1}{3}x + 1\right)\left(\frac{1}{3}x - 1\right) + \frac{2}{3}x = \frac{5}{36}x^2 + \frac{13}{9}$.
5. Cubo di un binomio e potenza dentro un prodotto: $(x - 2)^3 - x(x - 3)^2 + 3(x + 1)(x - 1) = 3x^2 + 3x - 11$.
6. Prodotto notevole da riconoscere (termini in disordine, fattori opposti, binomio come termine): $(x + y - 3)(x + y + 3) - (x - y)^2 = 4xy - 9$.
7. Parentesi annidate con divisione per un monomio e quadrato di un trinomio, come l'esempio 7.
