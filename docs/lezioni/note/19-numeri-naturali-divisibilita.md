# Note: Divisibilità e numeri primi

Lezione nuova, senza originale. Circa 3000 parole, 10 esempi svolti, 7 riquadri di errori, una figura (il crivello di Eratostene fino a 100). Formulario di due schermate circa, 20 flashcard.

## Scelte di convenzione

- Definizione di divisibilità con $b \neq 0$ e $a = b \cdot q$, come nella lezione 07; da qui segue che $0$ è divisibile per ogni $b \neq 0$ e che $0$ non è divisore di nessun numero. Non ho introdotto il simbolo $b \mid a$: alcuni libri lo usano già al biennio, altri no. Da decidere.
- Primo: "ha esattamente due divisori". Così $0$ e $1$ sono esclusi dalla definizione stessa, e la lezione spiega perché; la 07 dice invece "maggiore di $1$ con esattamente due divisori". Le due definizioni sono equivalenti.
- Criterio dell'11 contando da destra, con la differenza presa in positivo, identico alla 07. Criteri e tabella sono copiati parola per parola dalla 07, così le due lezioni non si contraddicono finché la 07 non viene alleggerita.
- Criterio del $4$: "le ultime due cifre sono $00$ o formano un numero divisibile per $4$", come nella 07. Il "$00$" è ridondante ($0$ è divisibile per $4$), ma lo tengo perché è la forma dei libri.
- Numero dei divisori con la formula $(a+1)(b+1)$ scritta per due primi e poi estesa a parole; l'esempio usa una tabella a doppia entrata in LaTeX (array), non una tabella markdown.
- L'infinità dei primi è solo enunciata, con Euclide (Elementi, libro IX, circa 300 a.C.). Nessuna dimostrazione.

## Dubbi

- Lunghezza: la lezione è lunga quanto la 07. Candidati al taglio: la nota "Perché i criteri funzionano" (è un ad-note, si può saltare) e l'esempio 8 (4500, il trucco degli zeri).
- La proprietà "se $d$ divide $a$ e $b$ divide $a + b$" è nella lezione perché spiega i criteri; se si toglie la nota sui criteri, può restare solo come regola.
- "Combinare due criteri se i numeri non hanno fattori primi in comune" anticipa il concetto di primi tra loro, che è nella lezione MCD e MCM. Non ho messo il link per non mandare lo studente avanti; da valutare.
- Il controllo automatico dà tre avvisi, tutti falsi positivi: "fondamentale" in "teorema fondamentale dell'aritmetica" (lezione, formulario, carta), e la maiuscola di "Eratostene" nel titolo "Il crivello di Eratostene".
- La figura è compilata e controllata in locale con `scripts/figure/compile.mjs` (284 × 248 px, circa 200 KB perché ogni cifra diventa un tracciato); va ancora guardata sul sito in tema scuro, dove il grigio delle barre è la parte più a rischio. Il codice usa `\foreach` e `\pgfmathtruncatemacro`, che node-tikzjax compila senza problemi.

## Cosa togliere dalla lezione MCD e MCM in ℕ (07)

La 07 oggi contiene quasi tutto il materiale di questa lezione. Quando questa è pubblicata, dalla 07 andrebbero tolte:

- la sezione "Divisori e multipli" (sostituita da una frase con il link a questa lezione);
- la sezione "Numeri primi" con l'elenco dei primi minori di $50$;
- la sezione "Criteri di divisibilità" con la tabella e gli esempi 1 e 2 (7128 e 9152);
- la sezione "Scomposizione in fattori primi" con il procedimento e l'esempio 3 (360); si può tenere il warning "Scomporre con fattori non primi" o spostarlo solo qui (qui c'è già).

Resterebbero in 07: definizioni e calcolo di MCD e MCM, Euclide, il legame MCD · MCM, i primi tra loro, i problemi. L'apertura della 07 ("Per calcolarli servono prima i divisori, i multipli e i numeri primi") andrebbe cambiata in un link a questa lezione. Lo stesso vale per il formulario 07 (sezioni "Divisori, multipli e numeri primi", "Criteri di divisibilità", "Scomposizione in fattori primi") e per le carte `divisore-definizione`, `multipli-infiniti`, `primo-definizione`, `uno-non-primo`, `criterio-3`, `criterio-4-conto`, `criterio-9-conto`, `criterio-11-conto`, `teorema-fondamentale`, `scomposizione-72`, che doppiano quelle di qui. Attenzione: le carte della 07 sono già pubblicate, e toglierle cancella i progressi degli studenti su quegli id.

Anche la lezione Operazioni in ℕ (06) dice che quando il resto è $0$ "$b$ è un divisore di $a$ (ne parla la lezione su MCD e MCM)": il link andrebbe spostato su questa lezione.

## Livelli per gli esercizi

1. Divisibile o no, con la divisione: "$84$ è divisibile per $7$?" (divisore a una cifra, dividendo a due o tre cifre).
2. Un criterio alla volta: "$5271$ è divisibile per $3$? E per $9$?" (un numero, uno o due criteri tra $2, 3, 5, 9, 10$).
3. Tutti i criteri su un numero, compresi $4$, $11$ e $25$: "Per quali tra $2, 3, 4, 5, 9, 10, 11, 25$ è divisibile $2740$?".
4. Primo o composto, provando i primi fino alla radice: "$221$ è primo?" (risposta $13 \cdot 17$; includere trappole come $91$, $119$, $143$).
5. Scomposizione in fattori primi: "Scomponi $1260$" (numeri fino a qualche migliaio con esponenti maggiori di $1$, poi con un fattore come $7$, $11$ o $13$).
6. Dalla scomposizione: "Quanti divisori ha $2^3 \cdot 3^2 \cdot 5$? $2^2 \cdot 3^2 \cdot 5 \cdot 7$ è divisibile per $2^3$?", oppure la cifra mancante: "Quali cifre al posto del quadratino rendono $4\square8$ divisibile per $12$?".
