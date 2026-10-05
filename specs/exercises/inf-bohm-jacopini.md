# inf-bohm-jacopini: Sequenza, selezione, iterazione e teorema di Böhm-Jacopini

Lezione: `docs/lezioni/informatica/riscritte/49-inf-bohm-jacopini.md`. Gli algoritmi sono diagrammi di flusso
(`src/lib/exercises/v2/inf-alg.ts`); niente programmi in Python o in C++.

Famiglie con una struttura dentro l'altra, solo mostrate e mai come opzione: `bum` (i numeri da 1 a n con una
parola al posto dei multipli), `sufficienti` (quanti voti letti sono almeno 6), `euclide`. Famiglie con la versione
a salti, in passi numerati: `somma in giù` (l'esercizio della lezione), `rovescia`, `sblocco` (il codice chiesto
finché è sbagliato, con "errato" a ogni tentativo), `traguardo`, `multipli`.

## Livelli

1. **Riconoscere la struttura.** Un diagramma: solo la sequenza, una selezione, un'iterazione, una selezione dentro
   un'iterazione (un quarto ciascuna). Le opzioni sono sempre queste quattro.
2. **Selezione o iterazione?** Testo. Un compito a parole e la struttura che gli serve: nessuna oltre la sequenza,
   una selezione, un'iterazione; la quarta opzione, "un salto", non è mai giusta.
3. **Una struttura dentro l'altra.** Un diagramma annidato e i suoi ingressi: che cosa scrive. Esempio: `bum` con
   divisore 3 e 7 in ingresso → 1, 2, bum, 4, 5, bum, 7.
4. **Il teorema di Böhm-Jacopini.** Testo: una affermazione vera tra tre false, o una falsa tra tre vere.
5. **Togliere i salti.** Un algoritmo scritto con due salti, in passi numerati; opzioni: quattro diagrammi
   strutturati, di cui uno solo è equivalente.
6. **Costruire il diagramma senza salti.** Lo stesso algoritmo. Risposta aperta eseguita sulle prove; a scelta
   multipla, come il livello 5.

## Distrattori

Dai riquadri della lezione: il rombo preso sempre per una selezione; `se` dove serve `finché`; nei livelli 5 e 6 la
condizione del salto in avanti copiata com'è (dice quando si esce, mentre `finché` vuole sapere quando si resta);
"tre strutture" letto come "tre istruzioni"; il teorema letto come obbligo di usarle tutte, o come divieto di altre
scritture.

## Da evitare

Domande di memoria su nomi e date (1966, Böhm, Jacopini); diagrammi annidati tra le opzioni (due rombi sono troppo
larghi); prove con cui un diagramma sbagliato non termina (il traguardo non si prova con 0).
