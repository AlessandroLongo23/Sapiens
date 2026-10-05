# inf-condizioni: Condizioni e operatori di confronto

Lezione: `docs/lezioni/informatica/riscritte/56-inf-condizioni.md`. Aiuti comuni del capitolo "La selezione":
`src/lib/exercises/v2/inf-sel.ts` e `scripts/exercises/checkers/_inf_sel.py`.

La lezione parla del valore di una condizione, che i due linguaggi scrivono in modo diverso (`True` e `1`): un valore
vero o falso stampato non passa da `codes`. Per questo quattro livelli su sei sono a scelta multipla di testo, con le
opzioni scritte a mano. Le condizioni sono uguali in Python e in C++ e nel testo sono in carattere da macchina
(`$\texttt{eta >= 18}$`). La lezione mostra un rombo e lascia `if` alla lezione dopo: le selezioni dei livelli 3 e 5
sono diagrammi, non programmi.

Le situazioni sono dieci (età, punteggio, spesa, monete, velocità, altezza, ritardo, temperatura, benzina, peso),
ognuna con la sua variabile, una soglia estratta e una regola a parole con una delle quattro espressioni della
lezione: "almeno" (`>=`), "più di" (`>`), "meno di" (`<`), "al massimo" (`<=`).

Distrattori, dai riquadri della lezione: il confine dalla parte sbagliata (`>` per `>=`); le scritture che non
esistono (`=>`, `=<`, `<>`, `=!`); `=` al posto di `==`; maiuscole e minuscole nei testi, `"10" < "9"`; `true` o
`vero` al posto di `True` e di `1`; `==` tra numeri con la virgola.

## Livelli

1. **Vera o falsa.** Il valore di una variabile (o di due) e quattro condizioni: una sola ha il valore chiesto. Con
   una variabile, almeno una delle quattro la confronta proprio con il valore che ha. Casi: `una` (65%), `due`.
   Esempio: altezza vale 142; quale è falsa tra `altezza < 144`, `altezza >= 142`, `altezza != 142`,
   `altezza <= 142`? → `altezza != 142`.
2. **Le parole del confine.** Tre casi: `frase` (45%), la regola a parole e quattro condizioni ("meno di 15 gradi" →
   `gradi < 15`); `confine` (25%), il valore per cui `gradi < 17` e `gradi <= 17` danno risultati diversi → 17;
   `valori` (30%), quattro valori di cui uno solo rende la condizione vera, o falsa.
3. **Il rombo in un diagramma.** Un diagramma con una selezione, largo al più 345 px. Due domande: che cosa scrive
   con un certo ingresso (il valore di confine sei volte su dieci), oppure con quale di quattro ingressi scrive un
   certo valore. Esempio: `leggi eta`, `se eta <= 12` scrive 4, altrimenti 7; con 12 → 4.
4. **Confronti che ingannano.** Quattro casi: `testi` (30%), una variabile di testo e quattro confronti con `==`,
   `<`, `>`; `assegna` (25%), che cosa succede dopo `a = b`, o dopo `a == b`; `stampa` (25%), un programma di due
   righe che scrive una condizione, con le opzioni "True in Python, 1 in C++"; `virgola` (20%), quanto vale
   `a == 0.3` dopo `a = 0.1 + 0.2`, o come si confrontano due numeri con la virgola.
5. **Costruire il diagramma con una condizione.** La consegna a parole di una tariffa (due numeri, una soglia).
   Risposta aperta: lo studente costruisce il diagramma, eseguito sul valore di confine e sui due valori accanto. A
   scelta multipla: quattro diagrammi, larghi al più 330 px.
6. **Scrivere la condizione.** Il programma del "Prova tu" della lezione: le letture, una variabile booleana che
   parte da falso, e l'ultima riga che scrive 1 o 0 nei due linguaggi (`print(int(...))`, `cout << ...`). Risposta
   aperta: lo studente scrive la condizione; tre prove, con il confine. A scelta multipla: quattro righe di testo
   (`sale = altezza >= 140`). Casi: `una` (una soglia), `due` (due variabili: punti e record, monete e prezzo).

## Da evitare

Confronti tra due testi scritti tutti e due tra virgolette (in C++ non confrontano le lettere); `==` tra un numero e
un testo (in C++ non compila); selezioni con un testo lungo su ogni ramo, il cui diagramma non sta in un telefono;
`if` nei programmi (viene nella lezione dopo).
