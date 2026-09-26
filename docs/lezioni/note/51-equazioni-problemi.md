# Note: Problemi con le equazioni

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solve` su ogni equazione, `expand` per $(x + 3)^2$ e per $12x + 18(30 - x)$, i controlli sul testo di ogni esempio, il valore sbagliato $36 : 0{,}35 \approx 102{,}86$ dell'avviso sulle percentuali). Il controllo `check.mts` passa sui tre file.

## Struttura ed esempi

Procedimento in sei passi, una tabella di traduzione dal testo ai simboli, una sezione sulle limitazioni dell'incognita con un esempio di soluzione da scartare (rettangolo con altezza $-1$), poi otto esempi svolti di tipi diversi, dal più semplice:

1. numeri consecutivi ($84$), con il caso non accettabile della somma $100$ ($x = \frac{97}{3}$, non intero);
2. età, "quanti anni fa" (la lezione 16 ha già un "tra quanti anni", quindi qui ho preso l'altro verso), con la limitazione $0 < x < 12$;
3. perimetro di un rettangolo, con la domanda sull'area (per l'avviso "Fermarsi alla x");
4. area di un quadrato con il lato allungato, dove $x^2$ si cancella;
5. percentuali una dopo l'altra (il $40\%$ del resto);
6. moto, due veicoli che si vengono incontro;
7. miscela di due caffè, con il caso non accettabile della miscela da $20$ €/kg;
8. due rubinetti (lavoro), con il risultato in ore e minuti.

Gli errori frequenti stanno ognuno dopo la regola o l'esempio a cui si riferiscono: l'ordine delle parole, chi supera chi, far passare il tempo per uno solo, fermarsi alla $x$, sommare le percentuali, sommare i tempi, leggere $2{,}4$ ore come $2$ ore e $40$ minuti. Non c'è una sezione finale di errori generici.

## Scelte di convenzione e dubbi

- "Limitazioni dell'incognita" e "soluzione accettabile" come termini, come nel brief. Alcuni libri dicono "condizioni" o "dominio del problema"; non li ho citati per non dare un sinonimo in più. Da verificare con il libro in uso.
- La verifica "sul testo e non sull'equazione" è detta come regola nel procedimento e ripresa nel formulario e in una carta. La lezione 16 dice "verifica sostituendo nell'equazione di partenza": per le equazioni va bene, per i problemi no, e la lezione spiega il perché.
- Prezzi con "€" dopo il numero, come nella 26 (la 16 scrive "euro" per esteso).
- Nell'esempio del moto la formula $s = v \cdot t$ è data in una frase, senza link: la proporzionalità diretta (45) e le formule inverse (50) la trattano, ma qui serve solo usarla. Se si vuole, si aggiunge un link a Proporzionalità diretta e inversa.
- Il problema di lavoro usa l'incognita solo al numeratore ($\frac{x}{4} + \frac{x}{6} = 1$), quindi resta un'equazione intera. La versione classica con i tempi incogniti al denominatore è una fratta e l'ho lasciata fuori.
- L'esempio 4 usa il quadrato di un binomio, con link a Prodotti notevoli.
- Solo problemi con una incognita; i problemi con due incognite hanno la lezione Problemi con i sistemi, che è del secondo anno e non ho linkato; l'URL è nell'elenco, quindi il link si può aggiungere nell'apertura.

## Da cambiare in lezioni già scritte

Lezione 16 (Equazioni di primo grado intere), sezione "Dal testo all'equazione": oggi ha un paragrafo con il procedimento e due esempi svolti (il quaderno e la penna, le età di Marco e Sara). Proposta: ridurla al solo paragrafo, accorciato, con il link, e togliere i due esempi. Per esempio:

> Molti problemi si risolvono con un'equazione di primo grado: scegli l'incognita, traduci il testo in un'equazione, la risolvi e controlli che la soluzione abbia senso nel problema. Il procedimento, con esempi di tutti i tipi (numeri, età, geometria, percentuali, moto, miscele, lavoro), è in [Problemi con le equazioni](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/problemi-con-le-equazioni).

L'apertura della mia lezione cita "tre quaderni e una penna costano $9$ €", che richiama l'esempio 8 della 16: se quell'esempio resta, il richiamo è coerente; se si toglie, la frase funziona lo stesso. Nel formulario della 16, la sezione "Dal testo all'equazione" può diventare una riga con il link a questa lezione. Le carte della 16 non parlano di problemi.

## Figure

Due, entrambe dentro il riquadro del loro esempio, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (non sul sito in tema scuro):

- `rettangolo-lati-incogniti` (181×117): rettangolo $17 \times 10$ in proporzione, riempito `blue!15`, lati $x$ e $x + 7$.
- `moto-incontro-due-veicoli` (250×88): segmento $AB$ con il punto d'incontro $P$ a $\frac{120}{210}$ della lunghezza, frecce `blue!50` e `orange!70` con $80t$ e $60t$, quota $210$ km sotto. L'ho stretta da 288 a 250 px per il riquadro degli esempi sul telefono.

Niente `\clip`, niente riempimenti bianchi. Nessuna figura nel formulario.

## Formulario e flashcard

- Formulario: procedimento, tabella di traduzione ridotta, limitazioni, una riga per tipo di problema con l'equazione dell'esempio della lezione, tre avvisi.
- 18 carte, nell'ordine della lezione. Le carte con i conti usano i numeri degli esempi della lezione.

## Prerequisiti

La riga `equazioni-problemi <- equazioni-primo-grado, numeri-razionali-proporzioni` va bene così. La lezione si regge sulla risoluzione delle equazioni intere (16, anche con i denominatori numerici per l'esempio dei rubinetti) e sulle percentuali della 26 (esempio 5, tabella di traduzione). L'esempio 4 usa il quadrato di un binomio, e Prodotti notevoli non è un antenato di equazioni-primo-grado (che dipende da polinomi-operazioni); non lo aggiungerei, perché è un solo esempio, ha il link, e un arco in più per un esempio va contro la regola "senza la quale non si segue". Se si vuole essere rigorosi, l'alternativa è `equazioni-problemi <- equazioni-primo-grado, numeri-razionali-proporzioni, polinomi-prodotti-notevoli`.

## Per il generatore

1. Problemi sui numeri, traduzione diretta: "un numero aumentato del suo doppio dà $45$" ($x = 15$), "la somma del triplo di un numero e $4$ è $19$".
2. Numeri consecutivi (anche pari o dispari), con il controllo che la soluzione sia intera: somma accettabile o non accettabile.
3. Età, "tra $x$ anni" e "$x$ anni fa", con le limitazioni.
4. Problemi geometrici: perimetro di rettangoli e triangoli isosceli con un lato espresso tramite l'altro, domanda sull'area; lato di un quadrato con l'area che aumenta ($x^2$ che si cancella); casi con lato negativo, problema impossibile.
5. Percentuali e sconti: prezzo prima dello sconto con una spesa aggiunta, percentuali una dopo l'altra sul resto.
6. Moto (incontro, e inseguimento con partenze a orari diversi) e miscele, con il caso della miscela fuori dall'intervallo dei due prezzi.
7. Lavoro con due rubinetti o due operai, con incognita solo al numeratore, risultato in ore e minuti.
