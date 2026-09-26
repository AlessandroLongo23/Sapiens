# Note: Scomposizione con la regola di Ruffini

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: le sette tabelle di Ruffini (riga per riga), ogni scomposizione (sviluppando il prodotto e con `factor`), i valori dei candidati, l'elenco dei candidati frazionari di $4x^3 - 5x + 6$ e l'irriducibilità di $x^2 + x + 1$ e $x^3 + x + 1$. Il controllo `check.mts` passa sui tre file senza errori né avvisi.

## Scelte di convenzione

- Scomposizione in ℤ, come da brief del lotto. L'unico passaggio con frazioni è l'esempio 3: si divide per $x - \frac{1}{2}$ e poi si porta il $2$ raccolto dal quoziente nel primo fattore, che diventa $2x - 1$. La regola generale "allo zero $\frac{p}{q}$ corrisponde il fattore $qx - p$" è detta nel riquadro dell'errore e nel formulario.
- "Zero del polinomio" come termine, con "radice" citato una volta. Da allineare con la lezione 33: se lì si usa "radice", conviene cambiare qui (o il contrario).
- La tabella di Ruffini è scritta in LaTeX come `\begin{array}{r|rrr|r} ... \hline ...`, con lo zero a sinistra, i prodotti nella seconda riga e il resto dopo la seconda barra. Rende bene con KaTeX, funziona in chiaro e in scuro e passa il controllo. Se la lezione 33 sceglie un'altra forma (figura TikZ, tabella markdown, disposizione diversa), le sette tabelle di qui vanno allineate: è il punto da controllare per primo quando si leggono insieme.
- Il coefficiente direttore è definito qui (serve per i candidati frazionari). Se la lezione 28 o la 33 lo definiscono già, qui basta un link e la definizione si toglie.
- Ordine dei fattori nel risultato: prima il numero e il monomio raccolti, poi i fattori nell'ordine in cui li trova il procedimento. Non ho fissato una regola.

## Dubbi

- Il teorema degli zeri razionali ($p$ divide il termine noto, $q$ il coefficiente direttore) è dimostrato solo nel caso intero, su un esempio; per le frazioni è enunciato. Mi pare il livello dei libri del primo anno, da verificare su un paio di testi.
- La sezione "Quando nessun candidato funziona" dice che un polinomio di secondo o terzo grado senza zeri razionali è irriducibile, con il motivo in una riga. È vero in ℤ (lemma di Gauss) ma non tutti i libri lo dicono; l'ho messo perché risponde alla domanda che lo studente si fa quando nessun candidato va bene. Si può ridurre a un `ad-note`.
- La tabella "numero di termini / metodi da provare" è una guida, non una regola: per esempio un polinomio di quattro termini può essere una differenza di quadrati nascosta ($x^2 + 2x + 1 - y^2$). Non l'ho scritto per non allungare; se la lezione 35 tratta quel caso, si può aggiungere una riga con il link.

## Lasciato ad altre lezioni

- Regola di Ruffini, teorema del resto e teorema di Ruffini: solo link alla 33. La lezione descrive la tabella in due righe (cosa sta dove) e poi la usa.
- Trinomio $x^2 + sx + p$: usato negli esempi con una riga ("i due numeri con somma ... e prodotto ..."), con link alla 36.
- Raccoglimento e prodotti notevoli: link alla 34 e alla 35 nella sezione sulla scelta del metodo.
- Ruffini con polinomi in più lettere (per esempio $x^3 - a^3$ trattato rispetto a $x$) e con parametri: non trattato. Nei libri compare negli esercizi più difficili; se serve, è un esempio da aggiungere o un argomento per il generatore.
- Le frazioni algebriche non hanno ancora una lezione: sono citate senza link nell'ultima frase. Il link alle equazioni di grado superiore (secondo anno) è verso un URL presente in `url.md` ma di una lezione non ancora scritta: da togliere se il sito non mostra i link a lezioni vuote.

## Da togliere o cambiare in lezioni già scritte

Nessuna lezione già scritta tratta la scomposizione con Ruffini, quindi non c'è niente da togliere. La lezione 17 (equazioni di secondo grado) scompone solo le spurie con il raccoglimento, e non ha bisogno di un link a questa.

## Figure

Nessuna. Le tabelle di Ruffini sono array KaTeX (vedi sopra), non figure TikZ; non c'era niente da compilare con `scripts/figure/compile.mjs`.

## Formulario e flashcard

- Il formulario riporta una sola tabella di Ruffini (esempio 1) e i risultati degli esempi 3 e 4 in una riga.
- 20 carte, nell'ordine della lezione. Le carte `candidati-conto`, `zero-in-uno-conto`, `tabella-potenze-mancanti` e `quando-fermarsi` usano i polinomi degli esempi 1 e 2.

## Livelli per gli esercizi

1. Terzo grado, coefficiente direttore $1$, zero $1$ o $-1$, quoziente che si scompone con il trinomio: $x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)$.
2. Terzo grado con una potenza mancante e primo zero diverso da $\pm 1$ o negativo: $x^3 - 13x - 12 = (x + 1)(x + 3)(x - 4)$.
3. Terzo grado con coefficiente direttore diverso da $\pm 1$ e zero frazionario: $2x^3 + x^2 + x - 1 = (2x - 1)(x^2 + x + 1)$.
4. Quarto grado, Ruffini due volte, anche con zero ripetuto: $x^4 - x^3 - 3x^2 + 5x - 2 = (x - 1)^3(x + 2)$.
5. Raccoglimento totale prima di Ruffini, poi trinomio o prodotto notevole: $2x^5 + 2x^4 - 14x^3 - 2x^2 + 12x = 2x(x - 1)(x + 1)(x + 3)(x - 2)$.

## Prerequisiti

La riga di oggi è `scomposizione-ruffini <- scomposizione-raccoglimento, polinomi-ruffini`. La cambierei in

`scomposizione-ruffini <- polinomi-ruffini, scomposizione-trinomio, scomposizione-prodotti-notevoli`

perché quasi ogni esempio finisce con un trinomio di secondo grado da scomporre (esempi 1, 2, 4, 5) e la sezione sulla scelta del metodo presuppone i prodotti notevoli. `scomposizione-raccoglimento` resta raggiunto attraverso le altre due, quindi elencarlo sarebbe un arco ridondante. Se si vuole tenere la lezione accessibile senza la 35 (i prodotti notevoli servono solo nell'ultima sezione), basta `polinomi-ruffini, scomposizione-trinomio`. Di conseguenza `polinomi-mcd-mcm` potrebbe prendere questa lezione tra i suoi prerequisiti, se i suoi esempi usano Ruffini: da decidere con l'agente della 38.
