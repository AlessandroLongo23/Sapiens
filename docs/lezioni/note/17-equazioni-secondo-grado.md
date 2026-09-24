# Note: Equazioni di secondo grado

## Errori nell'originale

- "Se $\Delta$ non è un quadrato perfetto ma positivo, le soluzioni saranno numeri decimali o frazioni": sbagliato. Con coefficienti interi le soluzioni sono irrazionali (per esempio $\frac{5 \pm \sqrt{21}}{2}$) e si lasciano con il radicale semplificato.
- "$x_1$ si ottiene con il segno +, $x_2$ con il segno −": contraddice la convenzione $x_1 < x_2$ del brief e del generatore di esercizi. Nell'esempio 1 dava $x_1 = 3$, $x_2 = 2$. Ora: con $a > 0$ il meno dà $x_1$; per questo il procedimento chiede di rendere $a$ positivo.
- "$\Delta < 0$: le soluzioni sono numeri complessi" (tabella ed esempio 3), detto senza contesto: la risposta a questo livello è "nessuna soluzione reale", $S = \emptyset$. I complessi restano in un ad-note per i curiosi.
- "Se $\Delta$ è un quadrato perfetto, le soluzioni sono numeri interi o razionali": vero solo con coefficienti razionali; ora la frase lo dice ("e i coefficienti sono interi").
- Equazione pura presentata solo con soluzioni ($x^2 = 9$): mancava il caso $x^2 = -4$, impossibile, che il generatore propone al livello 1. Mancavano la condizione $c \neq 0$ per la pura e $b \neq 0$ per la spuria, e l'equazione monomia.
- Refuso nel titolo "Equazioni Pure e Spuria"; titoli numerati e con le maiuscole, `---`, grassetto per enfasi, riassunto che ripeteva tutto.

## Cosa è cambiato

- Ordine nuovo: forma normale, incomplete (pura, spuria, monomia) risolte senza formula, poi formula, discriminante e tre casi, semplificazione dei radicali, formula ridotta come ad-tip, procedimento in sei passi.
- Diciassette esempi, coperti tutti i sei livelli del generatore `equazioni-secondo-grado`: livello 1 esempi 1 a 5; livello 2 esempi 6 e 7; livello 3 esempi 8, 9 e 10 (con divisione per un fattore comune); livello 4 esempi 3, 11, 12 e 13; livello 5 esempi 14 e 15; livello 6 esempi 16 e 17. Tutti verificati con SymPy (soluzioni, $\Delta$ e $\Delta/4$).
- Stesse convenzioni del generatore: $x_1 < x_2$, radicali semplificati, $S = \{\ldots\}$ con la virgola e $S = \emptyset$, per $\Delta = 0$ "$x_1 = x_2 = \ldots$".
- Aggiunti un ad-note sulla derivazione della formula (completamento del quadrato) e un ad-tip sul controllo con somma e prodotto.
- Errori frequenti nuovi: $-5^2$ senza parentesi, segno di $-4ac$, denominatore $2a$, semplificazione di un solo termine, coefficienti letti prima della forma normale, divisione per $x$ nella spuria, $\pm$ nella pura.

## Dubbi da decidere

- "Equazione monomia": il nome non è in tutti i libri (il brief lo cita come esempio di dubbio). L'ho tenuto nella tabella delle incomplete.
- Esempio 15, $(x - 1)^2 = 2x + 3$, richiede lo sviluppo di un quadrato: il generatore al livello 5 oggi non lo fa (è una delle domande aperte della spec). Tenerlo o toglierlo dipende da quella decisione.
- La formula ridotta è scritta con $\frac{\Delta}{4}$ e $\frac{b}{2}$; alcuni libri usano $\frac{b}{2} = k$ o "$\beta$". Da uniformare con il libro più diffuso tra gli utenti.
- L'ad-note sulla derivazione della formula si può togliere se la lezione risulta lunga su telefono.
- Le equazioni fratte e letterali di secondo grado non ci sono: nessuna lezione in elenco.
- L'apertura cita il problema del quadrato di area 49: controllare che non sia troppo simile all'apertura di altre lezioni.

## Figure

Nessuna figura necessaria. Il legame con la parabola va nella lezione Funzioni quadratiche.

## Formulario e flashcard

- Nel formulario ho messo la formula ridotta tra le formule da ricordare, anche se nella lezione sta in un riquadro `ad-tip`. Se Alessandro la considera facoltativa, si può togliere.
- Il nome "monomia" resta quello della lezione, con lo stesso dubbio già segnalato sopra.
