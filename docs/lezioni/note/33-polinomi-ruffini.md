# Note: Regola di Ruffini e teorema del resto

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (le otto divisioni, i controlli per moltiplicazione, i valori $P(a)$, il valore di $k$ nell'esempio 8) sono stati rifatti con SymPy (`div`, `expand`, `subs`, `solve`). Il controllo `check.mts` passa senza errori sui tre file.

## Scelte di convenzione

- La tabella è scritta in KaTeX con `\begin{array}{r|rrr|r}`: $a$ a sinistra nella seconda riga, quella dei prodotti, e il termine noto e il resto separati da una linea verticale. Mi sembra lo schema più diffuso nei libri italiani, ma alcuni non separano il termine noto con la linea verticale (da verificare sui libri in uso). Da verificare che l'`array` con `\hline` e colonne vuote si veda bene sul telefono (KaTeX lo accetta, non l'ho visto sul sito).
- "Zero del polinomio", con "radice" citato una volta come sinonimo dei libri. Il brief del lotto parla di "ricerca degli zeri", quindi ho tenuto "zero". La 37 dovrebbe usare lo stesso termine.
- Il divisore si scrive $x - a$ e $a$ è "il numero che annulla il divisore": è la frase che uso per $x + 2$, per $ax - b$ e per il teorema di Ruffini, così lo studente ha una sola regola per il segno.
- `check.mts` segnala come "maiuscole all'inglese" i titoli "La tabella di Ruffini" e "Il teorema di Ruffini": è un nome proprio, l'avviso è un falso positivo.

## Divisore ax - b

L'ho messo come sezione breve con un esempio (esempio 4), perché per quanto ricordo compare nei libri del biennio e negli esercizi (da verificare sui libri in uso). Il metodo scelto: tabella con $\frac{b}{a}$, poi si divide per $a$ il quoziente e il resto resta quello. Alcuni libri fanno il contrario (dividono per $a$ dividendo e divisore, e poi moltiplicano per $a$ il resto): il risultato è lo stesso, ma due metodi confondono, quindi ne ho messo uno solo. Se si preferisce togliere l'estensione, vanno via la sezione, l'esempio 4, la riga del teorema del resto con $P\left(\frac{b}{a}\right)$, una sezione e un riquadro del formulario, la carta `ruffini-ax-meno-b`.

## Lasciato ad altre lezioni

- La divisione in colonna, il grado del quoziente in generale e la divisibilità tra polinomi: [Divisione tra polinomi] (32), con link nell'apertura e nel punto in cui si dice che Ruffini vale solo per $x - a$.
- La notazione $P(x)$ e il valore numerico: [Polinomi e grado di un polinomio] (28), con link.
- La ricerca degli zeri razionali (divisori del termine noto) e la scomposizione ripetuta: [Scomposizione con la regola di Ruffini] (37). Qui l'esempio 7 si ferma a $(x - 2)(x^2 + 2x - 3)$ senza scomporre il trinomio, con il link alla 37.
- Non ho messo la divisibilità dei binomi $x^n \pm a^n$ per $x \pm a$ (alcuni libri la trattano qui come applicazione del teorema di Ruffini): sta meglio nella 35 con somma e differenza di cubi, o in un riquadro della 37. Da decidere.

## Da togliere o controllare in lezioni già scritte

- Nessuna lezione già pubblicata tratta Ruffini. La 32 (divisione tra polinomi) del lotto dovrebbe solo linkare qui: da controllare che non abbia anche la tabella.
- La 37 dovrebbe usare "zero" e la stessa tabella (stesso `array`), e rimandare qui per il teorema del resto e il teorema di Ruffini senza ridimostrarli.

## Figura

Una: `regola-di-ruffini-schema`, la tabella della prima divisione con la freccia tratteggiata del primo coefficiente che scende e le tre frecce "$\cdot 3$" dal numero sotto la linea alla colonna successiva, con le etichette "quoziente" e "resto". Compilata con `scripts/figure/compile.mjs` e guardata come immagine in chiaro: numeri, frecce ed etichette leggibili, nessuna sovrapposizione. La terza freccia attraversa la linea verticale del resto, ed è voluto. Non usa colori, riempimenti bianchi né `\clip`; non l'ho vista in tema scuro sul sito. La stessa tabella, senza frecce, è anche in KaTeX subito sopra: se la figura basta, la tabella KaTeX si può togliere, ma sul telefono il KaTeX è più nitido. Non è nel formulario.

## Formulario e flashcard

- Formulario con la tabella in KaTeX, senza la figura.
- 18 carte. Tre usano numeri che non sono nella lezione (la regola sì): `ruffini-conto` ($(x^2 + 5x + 6) : (x + 2) = x + 3$), `teorema-resto-conto` (resto di $x^3 + 2x - 1$ per $x - 1$, cioè $2$) e `teorema-ruffini-conto` ($x^2 - 5x + 6$ per $x - 2$).

## Livelli per gli esercizi

1. Ruffini con $a$ intero positivo, dividendo completo di secondo o terzo grado: $(2x^3 - 5x^2 + x + 7) : (x - 3)$, $Q = 2x^2 + x + 4$, $R = 19$.
2. Ruffini con $a$ negativo, dividendo completo: $(x^3 + 4x^2 + x - 6) : (x + 2)$, $Q = x^2 + 2x - 3$, $R = 0$.
3. Ruffini con dividendo incompleto (uno o due zeri da inserire), $a$ positivo o negativo: $(x^4 - 5x^2 + 3x - 2) : (x + 2)$, $Q = x^3 - 2x^2 - x + 5$, $R = -12$.
4. Ruffini con $a$ frazionario: $(2x^3 + x^2 - 4x + 3) : \left(x - \frac{1}{2}\right)$, $Q = 2x^2 + 2x - 3$, $R = \frac{3}{2}$.
5. Resto con il teorema del resto, senza dividere, anche di grado alto: resto di $(x^5 - 3x^3 + 2x - 1) : (x + 1)$, cioè $-1$.
6. Divisibilità con il teorema di Ruffini, e valore di un parametro: $x^3 + kx^2 - 4x + 4$ divisibile per $x - 2$ per $k = -1$.
7. Divisore $ax - b$ (se si tiene l'estensione): $(4x^3 - 2x^2 + 6x - 1) : (2x - 1)$, $Q = 2x^2 + 3$, $R = 2$.

## Prerequisiti

La riga `polinomi-ruffini <- polinomi-divisione` va bene così. La lezione usa la divisione con quoziente e resto e l'uguaglianza $P(x) = (x - a) \cdot Q(x) + R$, che sono della 32; il valore numerico e $P(x)$ vengono dalla 28, che è già prerequisito della 32 (tramite la 29), quindi aggiungerla sarebbe un arco ridondante. Non servono i prodotti notevoli né la scomposizione.
