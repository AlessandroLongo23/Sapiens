# Note: Funzioni reali e dominio

Lezione nuova (lotto del terzo anno, gruppo A, 5 ottobre 2026). I conti degli esempi, degli avvisi e delle carte sono stati rifatti con SymPy (`gruppo-a/verifica.py` nello scratchpad della sessione): radici dei denominatori, domini degli esempi 2-6, zeri, segno e valori di controllo dell'esempio 7, zeri e segno dell'esempio 8, estremi e zeri della funzione della figura "dal grafico".

## Scelte

- Confine con la 43: la 43 ha già il dominio naturale delle funzioni con un denominatore. Qui si riparte dalla definizione in tre righe e si aggiungono radici di indice pari e dispari, valore assoluto e i casi con più condizioni. Un solo esempio è solo fratto (denominatore di secondo grado, che al primo anno non si poteva risolvere).
- Confine con le altre lezioni del gruppo: zeri e segno stanno qui, come fissato dal brief. Simmetrie alla 106, crescenza alla 107. La composizione e l'inversa restano alla 44.
- Classificazione: solo razionale intera, razionale fratta, irrazionale, e la parola "trascendente" con il link alle lezioni 121 e 125. Niente "algebrica" definita con rigore.
- "Insieme immagine" come nella 43, non "codominio" nel senso di insieme dei valori.
- Intervalli con le parentesi quadre rovesciate, come nelle lezioni 52 e 88.
- Coordinate con la virgola, $(0, 4)$, come nelle lezioni 80-87 (correzione di chi coordina al brief, che indicava il punto e virgola).
- Nella tabella dei segni dell'esempio 7 la riga del numeratore è $x^2 - 4$ intero, non scomposto in due fattori (non ho controllato quale delle due forme usa la 89). La figura segue lo stile della 54 (linea continua dove è positivo, tratteggiata dove è negativo, pallino vuoto dove non esiste).
- La figura delle "zone escluse" mostra anche il grafico vero della funzione, che lo studente non sa ancora disegnare: il testo dice che è lì per controllo. Non si parla di asintoti (quinto anno).
- Dominio dei problemi (il lato di un quadrato) non ripetuto: è nella 43.

## Domande per Andrea

- Classificazione delle funzioni: la lezione dà solo tre nomi (razionale intera, razionale fratta, irrazionale) e nomina le trascendenti. Serve lo schema completo del libro (algebriche e trascendenti, con esponenziali, logaritmiche e goniometriche), o va bene così?
- "Dominio naturale" e "campo di esistenza" sono dati come sinonimi; le condizioni si chiamano "condizioni" e non "C.E.". In classe si scrive "C.E." anche per le funzioni?
- Zone escluse dal grafico: il libro in uso le fa tratteggiare ("si cancellano le zone") già al terzo anno, o è un'abitudine del quinto? Se è del quinto, la seconda figura dell'esempio 7 si può togliere.
- Il segno di $x^2 - 4$ è studiato come trinomio intero (parabola), non come prodotto $(x - 2)(x + 2)$ con due righe in tabella. Quale delle due usa la classe?
- L'insieme immagine letto dal grafico è in un punto dell'elenco, senza esercizi: va sviluppato qui o lasciato alla 43?

## Da verificare

- Le figure sono state guardate in anteprima (PNG di `scripts/figure/anteprima.mjs`), in chiaro e in scuro, non sul sito pubblicato.
- Il blocco `grafico` ($y = \sqrt{x^2 - c}$) è stato aperto sulla pagina di prova del sito in sviluppo, con il cursore ai due estremi ($c = -4$ e $c = 9$): disegna bene. Non provato sul telefono.
- Dopo la rilettura: la retta $x = 1$ dell'esempio 7 è ora chiamata "asintoto verticale", con il link alla 120, che usa la stessa parola.
- Con $c = 0$ il blocco disegna $y = |x|$: la domanda non lo chiede, ma uno studente può notarlo.

## Figure

Quattro TikZ: `dominio-radice-x-quadro-meno-4` (copertina del blocco), `dominio-zeri-segno-dal-grafico`, `tabella-segni-x-quadro-meno-4-fratto-x-meno-1`, `segno-funzione-fratta-zone-escluse`. Un blocco `grafico`: `dominio-radice-x-quadro-meno-c-cursore`.

## Formulario e flashcard

Formulario senza figure. Aggiunge alla tabella delle condizioni la riga "radice di indice pari al denominatore, $A(x) > 0$", che nella lezione è nell'avviso e nell'esempio 4. 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani, ognuno dopo una figura TikZ e con la risposta scritta nel testo che segue.
- `dominio-radice-x-quadro-meno-c-cursore` (esempio 2, c'era già): $y = \sqrt{x^2 - c}$. Aggiunti il valore $x_2 = \sqrt{c}$, la domanda sul caso $c = 0$ (resta $|x|$) e il paragrafo con la risposta.
- `funzione-fratta-zero-e-valore-escluso-cursore` (esempio 7, nuovo, copertina la figura delle zone escluse): $y = \frac{x^2 - 4}{x - b}$ con la retta $x = b$. Caso limite $b = 2$: lo zero esce dal dominio e resta la retta $y = x + 2$. Il piano non segna il punto mancante: lo dice il testo.
- `valore-assoluto-meno-k-zeri-cursore` (esempio 8, nuovo, con la figura nuova `valore-assoluto-meno-2-zeri-e-segno`): $y = |x - 1| - k$. Casi limite $k = 0$ (uno zero) e $k < 0$ (nessuno).

Scartato: un piano per $\frac{\sqrt{x + 3}}{x - b}$ (esempio 3), dove il valore escluso entra ed esce dalla semiretta. Il punto si capisce dal conto, e il grafico ha un asintoto e una forma che lo studente non sa ancora leggere.

Prerequisiti proposti: dominio-codominio-immagine, disequazioni-secondo-grado, disequazioni-razionali, valore-assoluto-equazioni
