# Note: Espressioni con monomi

## Errori nell'originale

- La "procedura tipica" metteva al primo posto "Elimina le parentesi usando la proprietà distributiva" e solo dopo potenze e prodotti. È un ordine sbagliato: si parte dalle parentesi più interne e dentro ciascuna si fanno potenze, poi prodotti e quozienti da sinistra a destra, poi somme. La lezione ora dà l'ordine corretto.
- Gli esempi 2 e 4 ($2x(3x^2 - 5y) - (x^3 - 2xy)$ e $\frac{3}{2}a^2b(4ab^2 - 3a^2) - \frac{9}{4}a^3b^3$) sono prodotti di un monomio per un polinomio, con risultato un polinomio: appartengono a Operazioni tra polinomi o Espressioni con polinomi. I conti erano giusti, ma li ho tolti.
- Mancava l'ordine da sinistra a destra tra prodotti e quozienti, e mancavano le parentesi quadre e graffe.
- "prodotti/quote/potenze" (refuso), "forma canonica" al posto di "forma normale".

## Cosa è cambiato

- Quattro esempi di difficoltà crescente, tutti con risultato un monomio: prodotto e somma; potenza, quoziente e somma; una quadra con frazione al divisore; tonde, quadre e graffe con potenze e frazioni (risultato $-\frac{5}{3}b$). Ogni passaggio è verificato con SymPy.
- Errori frequenti nuovi: quoziente e prodotto nell'ordine sbagliato, somma prima del prodotto, segno meno fuori dalla potenza, coefficiente non elevato.
- Tolta la "mini-checklist", che ripeteva la procedura.

## Dubbi

- Ho escluso la proprietà distributiva: se si vuole che questa lezione copra anche monomio per polinomio, va deciso insieme alla lezione Espressioni con polinomi per non ripetere.
- Il link a Espressioni con polinomi punta a una lezione ancora vuota.

## Formulario e flashcard

- Il formulario è corto (circa 1200 caratteri): la lezione è un ordine delle operazioni più esempi lunghi, che non si riassumono in formule. Gli esempi con quadre e graffe non entrano nelle carte, perché non si fanno a mente.
- Le carte `potenza-dispari`, `potenza-pari`, `quoziente-conto` e `somma-frazione` riprendono i passaggi dell'esempio 2 e 3 e si sovrappongono in parte al mazzo di Operazioni tra monomi. Decidere se tenerle o sostituirle con altre carte sull'ordine delle operazioni.
