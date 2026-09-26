# Note: Monomi

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (forme normali, valori numerici) sono stati rifatti con SymPy. `check.mts` passa sui tre file senza errori né avvisi.

## Scelte di convenzione

- Definizione di monomio "per costruzione": espressione letterale con sola moltiplicazione tra numeri e lettere ed esponenti naturali delle lettere. Così $4 \cdot a \cdot b \cdot a$ è un monomio non ancora in forma normale, come nella lezione 12 ("$3x \cdot y \cdot (-x)$ no" riferito alla forma normale). Alcuni libri chiamano monomio solo l'espressione già ridotta: da verificare su un paio di libri in uso.
- La divisione per un numero è ammessa ($\frac{x}{3} = \frac{1}{3}x$), la divisione per una lettera no. Ho scritto "tra numeri e lettere c'è solo la moltiplicazione" e poi spiegato che dividere per un numero è moltiplicare per il reciproco: se si preferisce, la definizione può dire "moltiplicazione e divisione per numeri diversi da zero".
- Ordine alfabetico delle lettere presentato come abitudine, non come regola.
- Il coefficiente è detto "numero" senza specificare l'insieme: al primo anno sono razionali, e non ho voluto escludere $\sqrt{2}\,x$, che molti libri considerano un monomio. Nessun esempio con coefficienti irrazionali.
- "Costante" come nome del monomio senza parte letterale, con il grado lasciato alla lezione 12.
- Esponente frazionario: $x^{\frac{1}{2}} = \sqrt{x}$ citato in una frase, senza link alla lezione "Potenze con esponente razionale" (secondo anno, non scritta). Lo studente del primo anno non conosce gli esponenti frazionari: se sembra un anticipo inutile, si può togliere e lasciare solo $\sqrt{x}$ o niente. Il brief del lotto lo chiedeva, per questo c'è.
- Lettera all'esponente ($2^x$): una frase, perché compare negli esercizi "è un monomio?" di diversi libri.

## Lasciato ad altre lezioni

- Grado (rispetto a una lettera e complessivo, costanti di grado $0$, monomio nullo senza grado): solo link a Grado di un monomio.
- Monomi simili, uguali e opposti: un riquadro `ad-note` con la sola definizione di simili e il link a Operazioni tra monomi.
- $3x + 2x = 5x$: un riquadro `ad-note` con link a Operazioni tra monomi, per non far pensare che ogni somma escluda il monomio.
- Polinomi: link a Polinomi e grado di un polinomio (lezione 28 del lotto).
- Frazioni algebriche: nessun link, come da brief.

## Da togliere o controllare in lezioni già scritte

- Grado di un monomio: il primo paragrafo riassume definizione e forma normale e rimanda qui. Va bene così; ora che la lezione esiste, il riassunto si potrebbe ridurre a una frase.
- Operazioni tra monomi: il secondo paragrafo rispiega la forma normale con link qui, e va bene. Nella sezione "Potenza" il link "[potenza di un monomio]" punta alla stessa lezione Operazioni tra monomi (link a se stessa): da togliere o correggere.
- Operazioni tra monomi, esempio 8: "una frazione con una lettera al denominatore, non un monomio" è coerente con la sezione "Espressioni che non sono monomi" di questa lezione; si potrebbe aggiungere un link qui.

## Figura

Una sola: `monomio-area-rettangolo`, un rettangolo $3a \times 2b$ diviso in sei rettangoli $ab$, nell'apertura. Compilata con `scripts/figure/compile.mjs` e guardata in chiaro: righe ed etichette leggibili. Solo linee e testo, niente `\clip` né riempimenti; non l'ho vista sul sito in tema scuro. Non è nel formulario.

## Formulario e flashcard

- Il formulario ha una tabella "Non sono monomi" (espressione e perché): è un confronto tra casi, mi sembra ammesso dallo stile.
- 19 carte. Le carte `parte-letterale` ($\frac{1}{2}ab^3$) e `forma-normale-potenza-numero` ($2^3x \cdot x^2$) usano numeri che non sono nella lezione; la regola sì.

## Esempi svolti

Dieci esempi: uno su coefficiente e parte letterale, tre di riduzione a forma normale (l'ultimo con una potenza nel coefficiente e il secondo con frazioni e due segni meno), uno di riconoscimento, cinque di valore numerico (interi, numero negativo, meno davanti alla potenza, frazioni e segni, lettera che vale zero).

## Livelli per gli esercizi

1. Riconoscere coefficiente e parte letterale di un monomio già in forma normale, compresi coefficienti $1$, $-1$ e frazionari.
2. Dire se un'espressione è un monomio: $\frac{x^2y}{5}$ sì, $\frac{5}{x^2y}$ no, $3a^2b^{-1}$ no.
3. Ridurre a forma normale un prodotto con coefficienti interi e segni: $3x \cdot y \cdot (-x) = -3x^2y$.
4. Ridurre a forma normale con coefficienti frazionari o potenze di numeri: $-\frac{2}{3}a^2b \cdot \frac{9}{4}ab^3 \cdot (-b) = \frac{3}{2}a^3b^5$.
5. Valore numerico con interi, anche negativi: $-2a^3b^2$ per $a = -1$, $b = 3$ vale $18$.
6. Valore numerico con frazioni e segni: $\frac{3}{4}x^2y$ per $x = -\frac{2}{3}$, $y = -6$ vale $-2$.

## Prerequisiti

La riga `monomi <- numeri-razionali-potenze` va bene così. La lezione usa la moltiplicazione e le potenze con basi negative e frazionarie (valore numerico), la proprietà $x^m \cdot x^n = x^{m+n}$ e l'esponente negativo, che sono tutte in Potenze in ℚ; Potenze in ℚ a sua volta porta con sé Operazioni in ℚ e Potenze in ℤ (regola dei segni). Non serve Espressioni con frazioni: i valori numerici sono prodotti di potenze, senza somme né parentesi annidate.
