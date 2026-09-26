# Note: Scomposizione con i prodotti notevoli

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (scomposizioni, sviluppi di controllo, irriducibilità di $x^2 + 9$, $x^2 + 4x + 16$, $x^2 + 2x + 4$, $x^2 + xy + y^2$, il valore numerico del controllo con $x = 2$) sono stati rifatti con SymPy (`factor` ed `expand`). `check.mts` passa sui tre file senza errori né avvisi.

## Scelte di convenzione

- Scomposizione in ℤ, come dice il brief di lotto. L'unico esempio con le frazioni ($x^2 - \frac{1}{9}$, esempio 3) lo dichiara ("se ammetti coefficienti frazionari"). La frase in apertura rimanda alla convenzione della lezione 34; se la 34 non la dice, va detta qui per intero.
- Nel prodotto somma per differenza scrivo prima la somma, $(a + b)(a - b)$, come nella formula; è l'ordine dei libri più diffusi.
- Nei risultati i fattori sono ordinati secondo le potenze decrescenti ($(x - y + 1)$, $(9a^2 - 3ab + b^2)$). Per il cubo con il primo termine negativo (esempio 9) do $(1 - x)^3$ e l'equivalente $-(x - 1)^3$, perché i libri usano l'uno o l'altro.
- Cubo di un binomio: la regola è "ogni base con il segno del suo cubo, poi controlla i tripli prodotti", che copre tutti i casi di segno; la regola dei segni "tutti più / alterni" è detta solo come aiuto a colpo d'occhio.
- "Falso quadrato" in grassetto come termine definito, senza distinguere "falso quadrato della somma" e "della differenza": i libri non sono d'accordo su quale dei due si chiami come, e il nome distinto non serve per scomporre.

## Affermazioni che ho ristretto apposta

- "La somma di due quadrati è irriducibile" è falso in generale ($x^4 + 4 = (x^2 + 2x + 2)(x^2 - 2x + 2)$). Nella lezione la dico solo su esempi ($x^2 + 9$, $4a^2 + b^2$, $x^2 + 1$), nel formulario "come $x^2 + 9$".
- Anche il falso quadrato non è sempre irriducibile: $x^4 + x^2 + 1 = (x^2 + x + 1)(x^2 - x + 1)$. Per questo la lezione dice "con $a$ e $b$ monomi di primo grado o numeri è irriducibile", e l'esempio 14 ($x^6 - 1$) spiega perché si parte dalla differenza di quadrati. L'artificio che scompone $x^4 + x^2 + 1$ (aggiungere e togliere $x^2$) è solo nominato: di solito i libri lo mettono tra gli esercizi di approfondimento. Da decidere se merita un riquadro `ad-note`.

## Lasciato ad altre lezioni

- Definizione di scomposizione, polinomio irriducibile, raccoglimento totale e parziale: 34, con link. L'esempio 16 usa un raccoglimento parziale senza spiegarlo.
- Gli sviluppi dei prodotti notevoli e il loro perché: 30, con link in apertura. Qui le formule sono solo lette al contrario, più la verifica della somma di cubi, che la 30 non ha.
- Trinomio non quadrato ($x^2 + 5x + 6$): 36, con link nella sezione sul riconoscimento.
- L'ordine in cui provare i metodi: 37, con link in fondo. Qui c'è solo il procedimento dentro i prodotti notevoli (raccogli, conta i termini, scomponi, ripeti, controlla).
- Il controllo con il valore numerico è anche nella 31 (per le espressioni); qui è un riquadro `ad-tip` di tre righe.

## Da controllare nelle altre lezioni del lotto

- 30: il brief dice che somma e differenza di cubi stanno qui; se la 30 le cita come prodotto $(a + b)(a^2 - ab + b^2)$, va tolto o sostituito con un link.
- 34: se ha già un esempio "raccogli e poi differenza di quadrati" come $3x^2 - 12$, uno dei due si può cambiare per non ripetere lo stesso polinomio.
- 38: userà scomposizioni come $x^2 - 1$, $x^2 - 2x + 1$, $x^3 - 1$: nessun conflitto, ma i risultati devono seguire lo stesso ordine dei fattori.

## Figura

Una: `differenza-di-quadrati-con-le-aree`, il quadrato di lato $a$ meno il quadrato di lato $b$ (a forma di L) ricomposto nel rettangolo $(a + b)(a - b)$. Riempimento `blue!20` come le altre figure, nessun `\clip`, nessun riempimento bianco (il quadratino tolto è solo tratteggiato). Compilata con `scripts/figure/compile.mjs` (410×180) e guardata in chiaro: la prima versione aveva la freccia sopra l'etichetta $a - b$, corretta spostando il rettangolo. Non vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Formulario: tabella del riconoscimento senza la colonna delle formule (sono già sopra), tre avvisi (differenza di quadrati, doppio prodotto, fermarsi troppo presto).
- 20 carte. `quadrato-binomio-conto` ($x^2 + 6x + 9$) e `cubo-binomio-conto` ($x^3 + 6x^2 + 12x + 8$) usano polinomi che non sono tra gli esempi della lezione; le regole sì.

## Livelli per gli esercizi

1. Differenza di quadrati con coefficienti interi: $9x^2 - 16 = (3x + 4)(3x - 4)$.
2. Quadrato di un binomio, doppio prodotto con i due segni: $4x^2 - 12xy + 9y^2 = (2x - 3y)^2$.
3. Somma o differenza di cubi: $8a^3 + 27 = (2a + 3)(4a^2 - 6a + 9)$.
4. Cubo di un binomio o quadrato di un trinomio: $x^3 - 9x^2 + 27x - 27 = (x - 3)^3$.
5. Raccoglimento e poi prodotto notevole, anche con il segno meno: $-2x^3 + 8x = -2x(x + 2)(x - 2)$.
6. Più passi o basi binomie: $x^4 - 81 = (x^2 + 9)(x + 3)(x - 3)$, $x^2 - 2x + 1 - y^2 = (x - 1 + y)(x - 1 - y)$.

## Prerequisiti

La riga `scomposizione-prodotti-notevoli <- scomposizione-raccoglimento, polinomi-prodotti-notevoli` va bene così. Il testo usa il raccoglimento totale in quasi ogni esempio a più passi e quello parziale nell'esempio 16, e ogni formula è un prodotto notevole letto al contrario. Le altre lezioni citate (trinomio, Ruffini, espressioni con polinomi) sono link "dove si va dopo", non prerequisiti.
