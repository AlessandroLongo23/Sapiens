# Note: Relazioni tra soluzioni e coefficienti

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`77-verifica.py` nello scratchpad): la dimostrazione di somma e prodotto sulle soluzioni simboliche della formula, lo sviluppo di $a(x - x_1)(x - x_2)$, discriminante, soluzioni, $s$, $p$ e `factor` per le ventidue equazioni usate (esempi, avvisi e carte), le scomposizioni con i radicali ($x^2 + 4x + 2$, $x^2 - 2x - 1$), le sei identità della tabella delle espressioni simmetriche (sostituendo $s = x_1 + x_2$, $p = x_1x_2$) e i valori numerici degli esempi 16 e 17 ($8$, $6$, $31$) calcolati anche sulle soluzioni esplicite. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px: la più larga è $ax^2 + bx + c = a(x - x_1)(x - x_2)$, 253 px (circa 223 px ai 15 px del sito), fuori dai riquadri; tutte le altre stanno sotto i 240 px. Il formulario arriva a 227 px.

## Scelte di convenzione

- Somma e prodotto indicati con $s$ e $p$, come nella maggior parte dei libri, e l'equazione con soluzioni date scritta $x^2 - sx + p = 0$. Da verificare con il libro in uso. Attenzione: la lezione 36 (Trinomio di secondo grado) usa le stesse lettere con un altro significato, $x^2 + sx + p$, dove $s$ è il coefficiente di $x$ (quindi l'opposto della somma delle soluzioni). Ho messo un riquadro `ad-note` ("Il legame con la regola del trinomio") che spiega il segno meno; se crea confusione, l'alternativa è cambiare le lettere nella 36 (per esempio $x^2 + bx + c$ con due numeri $m$ e $n$), ma la 36 ha già flashcard pubblicate e non l'ho toccata.
- Soluzioni $x_1$ e $x_2$ con $x_1 < x_2$, discriminante $\Delta$, come nella 17. Nell'esempio 3 la soluzione nota è $2$ e quella trovata $-\dfrac{1}{3}$: la chiamo prima $x_2$ per il conto e alla fine riordino ($x_1 = -\dfrac{1}{3}$, $x_2 = 2$), come chiede la convenzione.
- Regola di Cartesio con "permanenza" e "variazione", enunciata solo per $a$, $b$, $c$ tutti diversi da zero e $\Delta \geq 0$, con la regola sul valore assoluto maggiore (variazione prima: positiva; permanenza prima: negativa). La giustifico con la tabella dei segni di $s$ e $p$ e dico perché vale anche con $a < 0$. Alcuni libri la chiamano "regola dei segni di Cartesio"; da verificare.
- Scomposizione con soluzioni irrazionali: ho detto esplicitamente, in un `ad-note`, che $x^2 + 4x + 2$ è irriducibile con i coefficienti interi (come dice la 36) e scomponibile nei reali. Senza questa frase la 36 e la 77 sembrano contraddirsi.
- Le formule di somma e prodotto sono dimostrate a partire dalla formula risolutiva (non da $a(x - x_1)(x - x_2)$), che è la via di quasi tutti i libri. La scomposizione viene dopo e usa somma e prodotto.
- Espressioni simmetriche: definizione ("non cambia scambiando $x_1$ con $x_2$") e tabella di sei espressioni; la frase dice "le espressioni simmetriche che si incontrano negli esercizi si scrivono con $s$ e $p$", senza enunciare il teorema generale.

## La formula ridotta nella 17

C'è: è l'`ad-tip` "La formula ridotta, quando b è pari", con $\dfrac{\Delta}{4} = \Big(\dfrac{b}{2}\Big)^2 - ac$ e $x_{1,2} = \dfrac{-\frac{b}{2} \pm \sqrt{\frac{\Delta}{4}}}{a}$, ed è anche nel formulario della 17. Questa lezione non la usa: tutti i discriminanti sono piccoli. La 78 può usarla nei conti con il parametro.

## Lasciato ad altre lezioni

- Risoluzione con la formula, tre casi del discriminante, semplificazione dei radicali: link alla 17.
- Scomposizione a tentativi con somma e prodotto interi e raccoglimento parziale: link alla 36; l'esempio 10 ritrova il risultato del suo esempio 8, l'esempio 12 quello del suo esempio 9.
- Prodotti dei radicali coniugati ($(2 - \sqrt{3})(2 + \sqrt{3}) = 1$): usati come differenza di quadrati con il link ai prodotti notevoli, non rispiegati. Se la 73 (Operazioni con i radicali) ha una sezione sui prodotti notevoli con i radicali, il link potrebbe andare lì.
- Condizioni sul parametro (soluzioni opposte, reciproche, somma assegnata): solo nominate nella frase finale con il link alla 78.
- Problemi: solo l'esempio 8 (rettangolo di perimetro e area dati), con il link alla 79.

## Da cambiare nelle lezioni già scritte

- 17 (Equazioni di secondo grado), riquadro `ad-tip` "Controllo veloce con somma e prodotto": aggiungere in fondo una frase con il link. Testo proposto: "Da dove vengono queste due formule, e come si usano per scomporre un trinomio o scrivere un'equazione con soluzioni date, lo trovi nella lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti)."
- 36 (Trinomio di secondo grado), `ad-note` "Numeri non interi": oggi dice che i due numeri "si trovano con la formula delle equazioni di secondo grado, che si studia al secondo anno". Testo proposto: "Alcuni trinomi irriducibili con i coefficienti interi si scompongono se si ammettono numeri irrazionali: per esempio $x^2 + 4x + 2 = (x + 2 - \sqrt{2})(x + 2 + \sqrt{2})$. Il metodo, che usa le soluzioni dell'[equazione di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado) associata, è nella lezione [Relazioni tra soluzioni e coefficienti](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/relazioni-tra-soluzioni-e-coefficienti), al secondo anno."

Le flashcard già pubblicate della 17 (`somma-soluzioni`) restano come sono: dicono la stessa cosa della carta `somma-soluzioni-formula` di questa lezione, con un id diverso.

## Figure

Nessuna. L'argomento è algebrico e il brief non ne chiede; l'unico candidato sarebbe il rettangolo dell'esempio 8, che però non aggiunge niente al testo (la 79 ha le figure dei problemi geometrici).

## Formulario e flashcard

- Il formulario ha le tabelle di scomposizione, segni ed espressioni simmetriche e tre avvisi (segno della somma, discriminante prima di tutto, coefficiente $a$). Nella tabella dei segni ho tolto la riga "negativo, zero: opposte", che c'è nella lezione, per tenerla corta.
- 20 carte, tutte su equazioni e regole della lezione.

## Prerequisiti

La riga `equazioni-secondo-grado-relazioni <- equazioni-secondo-grado, scomposizione-trinomio` va bene. La lezione risolve equazioni con la formula (17) e riprende la scomposizione con somma e prodotto (36), che non è un antenato della 17, quindi l'arco non è ridondante. C'è però una dipendenza in più: la lezione moltiplica radicali coniugati ($(1 - \sqrt{2})(1 + \sqrt{2}) = -1$, esempi 2, 6 e 11), che è materia di `radicali-operazioni`. Se la 17 passa a `radicali-operazioni` come propone il brief, l'arco arriva per transitività e la riga resta così; se la 17 tiene `numeri-reali-radici`, aggiungerei `radicali-operazioni` qui. I prodotti notevoli (differenza di quadrati nella dimostrazione) sono antenati attraverso `radicali-operazioni` o comunque materia del primo anno citata con un link, non un arco da aggiungere.

## Per il generatore

1. Somma e prodotto dai coefficienti, con il controllo del discriminante: $2x^2 - 7x + 3 = 0$ dà $s = \dfrac{7}{2}$, $p = \dfrac{3}{2}$; con $\Delta < 0$ la risposta è "nessuna soluzione reale". Nella stessa famiglia, trovare l'altra soluzione nota una ($3x^2 - 5x - 2 = 0$ con $x = 2$).
2. Scrivere l'equazione con coefficienti interi date le soluzioni: intere ($-3$ e $5$), frazionarie ($-\dfrac{1}{2}$ e $\dfrac{2}{3}$), irrazionali coniugate ($1 \pm \sqrt{2}$).
3. Due numeri di somma e prodotto dati, compreso il caso in cui non esistono (somma $5$, prodotto $7$) e un problema di rettangolo con perimetro e area.
4. Scomporre il trinomio con le soluzioni: frazionarie con $a \neq 1$, $a$ negativo, irrazionali, $\Delta = 0$, e il caso irriducibile.
5. Segni delle soluzioni senza risolvere (Cartesio o tabella di $s$ e $p$), con i distrattori delle equazioni con $\Delta < 0$ e con $a < 0$.
6. Espressioni simmetriche: $x_1^2 + x_2^2$, $\dfrac{1}{x_1} + \dfrac{1}{x_2}$, $(x_1 - x_2)^2$, $\dfrac{1}{x_1^2} + \dfrac{1}{x_2^2}$, con $s$ e $p$ frazionari o negativi. Il controllo del generatore deve scartare le equazioni con $\Delta < 0$ e, per i reciproci, quelle con $c = 0$.
