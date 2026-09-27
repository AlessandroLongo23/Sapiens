# Note: Problemi di secondo grado

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solve` su ogni equazione, `discriminant` per ogni $\Delta$ e $\frac{\Delta}{4}$, `expand` per $(20 + 2x)(30 + 2x)$, $x^2 + (x + 7)^2 - 169$ e $25 - (x - 5)^2$, i controlli sul testo di ogni esempio, il prodotto $(\sqrt{13} + 1)(\sqrt{13} - 1)/2 = 6$ e le approssimazioni $2{,}61$ e $4{,}61$). Il controllo `check.mts` passa sui tre file.

## Struttura ed esempi

Procedimento in sei passi come nella 51, con il passo 6 che confronta le due soluzioni una per una; un avviso subito dopo. Poi la sezione "Quali soluzioni si accettano" con la tabella dei quattro casi (due accettabili, una, nessuna, $\Delta < 0$), il tipo di numero (lunghezze irrazionali sì, persone e oggetti no) e due esempi senza numero: il sasso ($t = 1$ e $t = 3$, tutte e due accettabili e diverse) e il rettangolo con perimetro $20$ e area $30$ ($\frac{\Delta}{4} = -5$), con un `ad-note` sul perché ($x(10 - x) = 25 - (x - 5)^2$).

Nove esempi svolti numerati, dal più semplice:

1. due naturali consecutivi con prodotto $156$, con la variante "interi" dove le soluzioni accettabili diventano due;
2. somma $17$ e prodotto $72$, le due soluzioni sono la stessa coppia (link alla 77 per il metodo con somma e prodotto);
3. rettangolo, area $96$, base che supera l'altezza di $4$, formula ridotta, domanda sul perimetro;
4. triangolo, area $6$, base che supera l'altezza di $2$: soluzione irrazionale $\sqrt{13} - 1$ accettabile, controllo con somma per differenza;
5. cornice intorno a una foto $20 \times 30$ con area uguale alla foto ($x = 5$);
6. Pitagora, cateti $x$ e $x + 7$, ipotenusa $13$, con la limitazione $0 < x < 6$;
7. moto: ciclista su $60$ km, $5$ km/h in più e un'ora in meno (fratta, C.E., link alla 49);
8. lavoro: due rubinetti, insieme $6$ ore, il secondo $5$ ore più lento (fratta);
9. percentuali: due aumenti uguali da $200$ € a $242$ €, risolta come una pura ($x = 10$, $x = -210$ scartata).

Avvisi (`ad-warning`), ognuno dopo il suo punto: rispondere con tutte e due le soluzioni, due soluzioni che non sono due coppie, la cornice su un lato solo, il quadrato del binomio senza doppio prodotto (link a Prodotti notevoli), l'ordine della sottrazione nel moto (con l'equazione sbagliata che dà $\Delta < 0$, verificato), sommare i tempi nel lavoro, due aumenti del $10\%$ che non fanno il $20\%$.

## Scelte di convenzione e dubbi

- "Limitazioni dell'incognita" e "soluzione accettabile" come nella 51. Da verificare con il libro in uso.
- Soluzioni $x_1 < x_2$ come nella 17, anche quando si chiamano $t_1$, $t_2$ o $v_1$, $v_2$: nel sasso e nel moto ho tenuto la lettera della grandezza ($t$, $v$), che rende la limitazione più leggibile. Se si preferisce $x$ ovunque, si cambia in due esempi.
- La formula ridotta ($\frac{\Delta}{4}$) si usa dove $b$ è pari (sasso, rettangolo, triangolo, rettangolo impossibile), come nel riquadro della 17. Non la rispiego.
- Il teorema di Pitagora si usa senza link, come chiede il brief. L'area del triangolo "base per altezza diviso 2" è data in una frase.
- La formula dell'altezza del sasso $20t - 5t^2$ è data dal testo, senza fisica: serve solo a mostrare un problema con due soluzioni accettabili e diverse. Se sembra fuori luogo per il biennio, si toglie senza toccare il resto; la tabella resta vera e l'esempio 1 con "interi" mostra lo stesso caso.
- Nei problemi di somma e prodotto il testo non dà limitazioni: l'ho detto esplicitamente.
- La 17 ha già la formula ridotta (riquadro `ad-tip` "La formula ridotta, quando b è pari"), così l'agente della 77 non deve segnalarla come mancante.

## Lasciato ad altre lezioni

- Il metodo generale (traduzione, tabella delle espressioni, limitazioni) è nella 51: qui solo il link.
- La risoluzione dell'equazione e la formula ridotta sono nella 17; il metodo di somma e prodotto ($t^2 - st + p = 0$) è nella 77, con il link nell'esempio 2.
- Le C.E. delle fratte sono nella 49: qui un paragrafo e il link.
- I problemi con due incognite (sistemi di secondo grado) non ci sono: il capitolo Sistemi di secondo grado è più avanti.

## Figure

Quattro, tutte dentro il riquadro del loro esempio, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG (in chiaro; la versione scura della mia anteprima inverte solo i tratti, non lo sfondo, quindi non l'ho considerata una prova del tema scuro del sito):

- `rettangolo-area-altezza-x` (156×113): rettangolo $12 \times 8$ in proporzione, `blue!15`, lati $x$ e $x + 4$, area al centro.
- `triangolo-area-altezza-x` (144×101): triangolo scaleno con l'altezza tratteggiata e il segno dell'angolo retto, base $x + 2$ e altezza $x$ in proporzione con $2{,}61$ e $4{,}61$.
- `cornice-larghezza-x` (155×136): foto $30 \times 20$ e cornice larga $5$ in scala, cornice colorata con `even odd rule` (niente riempimenti bianchi), quota $x$ sulla destra e $30 + 2x$ sotto.
- `triangolo-rettangolo-cateti-x` (156×79): cateti $5$ e $12$ in proporzione, ipotenusa $13$.

Niente `\clip`, niente `\mathbb`, tinte chiare. Nessuna figura nel formulario.

## Formulario e flashcard

- Formulario: procedimento, tabella dei casi, un'equazione per tipo di problema con i numeri degli esempi, tre avvisi.
- 18 carte, nell'ordine della lezione; i conti usano i numeri degli esempi.

## Prerequisiti

La riga proposta, `equazioni-secondo-grado-problemi <- equazioni-secondo-grado, equazioni-problemi`, la cambierei in:

```
equazioni-secondo-grado-problemi <- equazioni-secondo-grado, equazioni-problemi, equazioni-fratte
```

Due dei tipi di problema del brief (moto e lavoro) portano a un'equazione fratta, e senza le C.E. e il modo di togliere i denominatori quegli esempi non si seguono. `equazioni-fratte` non è antenata né di `equazioni-secondo-grado` (che dipende da primo grado, raccoglimento, radici) né di `equazioni-problemi`, quindi l'arco non è ridondante. `equazioni-secondo-grado-relazioni` non la metterei: la lezione la cita come scorciatoia nell'esempio 2, ma si segue senza. `polinomi-prodotti-notevoli` è già antenata tramite `equazioni-secondo-grado`. Il teorema di Pitagora non ha una lezione, quindi nessun arco.

## Per il generatore

1. Problemi sui numeri: consecutivi (naturali o interi) con prodotto dato, un numero e il suo quadrato ("il quadrato di un numero supera il suo triplo di $10$"), con la scelta tra le soluzioni.
2. Somma e prodotto assegnati, compreso il caso $\Delta < 0$ (nessuna coppia) e la risposta come coppia unica.
3. Rettangoli e triangoli: area data e un lato espresso tramite l'altro, domanda su perimetro o altro lato; casi con soluzione irrazionale accettabile e casi impossibili (perimetro e area incompatibili).
4. Cornici e bordi: foto o giardino con cornice o vialetto di larghezza costante, area della cornice o area totale data.
5. Teorema di Pitagora: cateti $x$ e $x + k$ con ipotenusa data, o cateto e ipotenusa espressi con $x$, con la limitazione sul cateto minore dell'ipotenusa.
6. Moto e lavoro con l'incognita al denominatore (velocità aumentata e tempo diminuito, due rubinetti o due operai), con le C.E.
7. Percentuali ripetute: due aumenti o due sconti uguali, da risolvere come pura.
