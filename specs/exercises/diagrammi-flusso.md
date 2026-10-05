# diagrammi-flusso: I diagrammi di flusso

Lezione: `docs/lezioni/informatica/riscritte/47-diagrammi-flusso.md`. Ogni algoritmo è scritto una volta sola, nel
linguaggio dei blocchi `diagramma` (`src/lib/exercises/v2/inf-alg.ts`). La lezione mostra il passaggio dal diagramma
al programma: solo il livello 5 ha programmi, in Python e in C++, come opzioni.

Famiglie: `ordine` (soli assegnamenti: una variabile usata e poi cambiata, lo scambio di due variabili), `quota`,
`unita`, `rettangolo`, `soglia`, `sconto`, `spedizione`, `due numeri`, `divisibile` (il resto e poi la domanda),
`rovescia`, `somma`, `multipli`, `divisioni`.

## Livelli

1. **I blocchi e le frecce.** Testo. Casi: `forma` (60%), che forma ha il blocco con scritto «n ← n − 1»;
   `contenuto` (20%), che cosa si scrive dentro un rombo; `frecce` (20%), quante frecce escono da un rombo.
2. **Leggere una sequenza.** Un diagramma in sequenza, per il 40% di soli assegnamenti, dove la freccia non è un
   uguale. Esempio: x ← 4, y ← x + 2, x ← x · 3, scrivi x, scrivi y → 12, 6.
3. **Leggere una selezione.** Un diagramma con una selezione e un ingresso, anche sul confine della condizione.
4. **Leggere una ripetizione.** Un ciclo di al più 6 giri: che cosa scrive (65%), oppure quante volte viene
   attraversato il rombo (i giri più uno). Esempio: conto alla rovescia con 3 → 3, 2, 1, via; rombo 4 volte.
5. **Dal diagramma al programma.** Il diagramma; opzioni: quattro programmi, di cui uno solo fa quello che fa il
   diagramma. Al più 9 righe in Python e righe di al più 34 caratteri.
6. **Costruire un diagramma.** Il compito a parole. Risposta aperta eseguita sulle prove; a scelta multipla,
   quattro diagrammi.

## Distrattori

Dai riquadri della lezione: la freccia letta come un uguale (il valore vecchio usato dopo il cambio, lo scambio
ingenuo di due variabili); il confine della condizione; i rami scambiati; nel ciclo, i due blocchi del giro
scambiati e il giro in più o in meno; nel programma, la riga rientrata per sbaglio che finisce dentro il giro
(`print("via")` rientrato) o dentro il ramo, e `if` al posto di `while`. Nessun ciclo che non finisce tra le
opzioni.

## Da evitare

Più di 6 giri; `/` e numeri negativi con `//` e `%`; parole da scrivere più lunghe di 7 lettere dentro un ciclo (in
C++ la riga supera i 34 caratteri); selezioni a due vie con testi lunghi tra le opzioni (il diagramma supera la
larghezza di un telefono: i due rami scrivono "sì" e "no").
