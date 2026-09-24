# Note: Operazioni tra monomi

## Errori nell'originale

- "La divisione non è ammessa nel contesto dei monomi" (a proposito di $-12a^4b : 3ab^2$): la divisione si può fare, solo che il quoziente non è un monomio ma una frazione algebrica. Riscritto così.
- La condizione sul quoziente non diceva che il divisore deve essere diverso da zero, e parlava di "esponente al numeratore maggiore o uguale" senza dire che anche una lettera del divisore assente nel dividendo impedisce la divisione. Aggiunti entrambi.
- "forma canonica": nei libri italiani si dice "forma normale".
- Mancavano i monomi uguali e opposti.
- "quotiente" (refuso) e la sezione "Segno e semplificazioni", che ripeteva l'esempio del quoziente non monomio.

## Cosa è cambiato

- Somma e sottrazione trattate insieme come somma algebrica, con un esempio di monomi opposti (risultato 0) e uno con monomi misti, simili e non.
- Esempi nuovi con coefficienti frazionari e segni: prodotto di tre fattori con due segni meno, quoziente con divisore frazionario, quoziente in cui una lettera sparisce.
- La potenza è ridotta a una regola e un esempio, con link alla lezione Potenza di un monomio.
- Il riepilogo a elenco è diventato una tabella di confronto tra le quattro operazioni; aggiunti quattro errori frequenti.
- Tutti gli esempi sono verificati con SymPy.

## Dubbi

- Ho scritto che due costanti ($4$ e $-\frac{2}{3}$) sono simili. Alcuni libri considerano il monomio nullo simile a ogni monomio: non l'ho scritto, da decidere.
- La divisione è scritta con i due punti; alcuni libri usano la linea di frazione. Il testo usa la frazione solo per il caso in cui il risultato non è un monomio.

## Formulario e flashcard

- Nella sezione "Potenza" della lezione il link "potenza di un monomio" punta a `operazioni-tra-monomi`, cioè alla lezione stessa: in `url.md` non c'è una lezione sulla potenza di un monomio. Da correggere nella lezione (togliere la frase o puntare altrove).
- La lezione dice che $(8x^2) : (2y)$ non è un monomio ma non scrive il risultato ($\frac{4x^2}{y}$): la carta `quoziente-non-monomio` dà solo il perché.
