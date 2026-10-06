# Note: Disequazioni esponenziali

Lezione nuova del terzo anno, scritta da zero il 5 ottobre 2026 (gruppo E). Le soluzioni dei dodici esempi sono state rifatte con SymPy (`gruppo-e/verifica.py` nella cartella temporanea della sessione): per le disequazioni più semplici con `solveset`, per le altre confrontando su una griglia di valori razionali il valore di verità della disequazione con l'insieme scritto nella lezione.

## Scelte

- Confine con la 122: i metodi (stessa base, raccoglimento, sostituzione) sono dati per noti e qui si lavora sul verso. Gli esempi riprendono apposta le stesse espressioni della 122 ($4^x - 6 \cdot 2^x + 8$, $9^x - 8 \cdot 3^x - 9$, $2^{x + 2} + 2^x$), così lo studente confronta equazione e disequazione.
- Confine con il gruppo F: $2^x > 5$ è nominata in fondo, con il link alla 124 e alla 127; la lezione dice che le soluzioni sono i numeri maggiori di quello per cui $2^x = 5$, senza scriverlo.
- Due strade per la base tra $0$ e $1$: invertire il verso (regola principale) oppure riscrivere con la base maggiore di $1$ e l'esponente opposto (riquadro `ad-tip`). Un avviso distingue il cambio di verso dovuto alla base da quello dovuto alla divisione per un numero negativo.
- Sostituzione: le condizioni su $t$ si riportano una alla volta su $a^x$; l'esempio 10 mostra insieme la condizione impossibile ($3^x \leq -1$) e quella sempre vera ($3^x > -1$).
- Disequazioni fratte: un solo esempio, con la tabella dei segni nello stile della 54.
- Intervalli con le quadre rovesciate, come nella 88. Coordinate dei punti con la virgola (correzione di chi coordina al brief); in questa lezione non ce ne sono fuori dai blocchi `grafico`.

## Dubbi per Andrea

- Per la base tra $0$ e $1$ quale strada volete come principale: invertire il verso, o riscrivere sempre in base maggiore di $1$?
- Nella sostituzione la lezione non scrive il sistema con $t > 0$: riporta ogni condizione su $a^x$ e lì scarta o tiene. Preferite il sistema $\begin{cases} t > 0 \\ \dots \end{cases}$?
- La doppia disequazione $2 < 2^x < 4$ è risolta in una riga, senza passare per il sistema di due disequazioni. Va bene?
- Le disequazioni fratte con esponenziali hanno un solo esempio. Ne serve un secondo, o un prodotto?
- Mancano i sistemi di disequazioni esponenziali. Servono?

## Da verificare

- Allineato con la 127 definitiva (5 ottobre 2026): il secondo link in fondo alla lezione va alla 127, che risolve $3^x > 7$ e $4^x - 5 \cdot 2^x + 6 < 0$ nella sezione "Disequazioni esponenziali che si risolvono con i logaritmi"; la 123 cita la stessa disequazione.
- I blocchi `grafico` sono stati aperti nel browser il 5 ottobre 2026 (fase 3, vedi sotto), a 390 px su Chromium; non su un telefono vero.
- Le figure sono state guardate nelle anteprime PNG in chiaro e in scuro, non sul sito. La figura `disequazioni-esponenziali-verso` è larga 392 px, la più larga del gruppo: va guardata sul telefono.

## Figure e blocchi

Tre figure TikZ: `disequazioni-esponenziali-verso` (due riquadri, base $2$ e base $\frac{1}{2}$), `disequazione-esponenziale-sostituzione` (dentro l'esempio 8), `disequazione-esponenziale-fratta-segni` (dentro l'esempio 11). Un blocco `grafico`: `disequazione-esponenziale-verso-cursori`.

## Formulario e flashcard

Formulario senza figure, con la tabella delle quattro sostituzioni e la tabella del verso. 18 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Due piani, tutti e due aperti su `/prova-grafico/lezione` a 390 px, con i cursori ai valori iniziali, agli estremi e nei casi limite, e con le due scelte.

- `disequazione-esponenziale-verso-cursori` (rivisto): aggiunto l'estremo sotto il piano ("non esiste" per $a = 1$ e per $b \leq 0$) e un paragrafo che dà le risposte: la zona passa a sinistra con $a < 1$, per $a = 1$ non c'è niente di colorato, con $b \leq 0$ è colorato tutto oppure niente. Visto nel browser: il plotter colora tutto il piano o niente, come atteso.
- `disequazione-esponenziale-sostituzione-cursori` (nuovo, esempio 8, copertina `disequazione-esponenziale-sostituzione`): $y = 2^x$ con le rette $y = p$ e $y = q$ e la scelta tra valori interni ed esterni. Caso limite $p \leq 0$: la zona interna perde l'estremo sinistro e quella esterna perde il pezzo $2^x < p$, come nell'esempio 10. La zona è scritta con il prodotto $(2^x - p)(2^x - q)$, perché il blocco non legge una doppia disequazione; l'etichetta mostra $p < 2^x < q$.

Scartati: un piano per la disequazione fratta (due curve e una tabella dei segni: il blocco ha una sola scelta e non impila); uno per il raccoglimento, dove il parametro sarebbe solo il segno di un fattore.

Prerequisiti proposti: funzioni-esponenziali, equazioni-esponenziali, disequazioni-secondo-grado, disequazioni-razionali
