# scratch: La programmazione a blocchi

Lezione: `docs/lezioni/informatica/riscritte/50-scratch.md`. Nel sito non c'è un ambiente a blocchi: come nella
lezione, un programma a blocchi è detto a parole e il suo algoritmo è un diagramma di flusso, con il contatore di
"ripeti N volte" in vista e la condizione di "ripeti fino a quando" scritta al contrario
(`src/lib/exercises/v2/inf-alg.ts`). Niente programmi in Python o in C++. Scratch è nominato solo dove lo nomina la
lezione.

Un programma a blocchi si scrive così, dall'alto in basso, con i blocchi dentro una C tra parentesi:
`chiedi l'obiettivo e mettilo in ob; porta p a 0; ripeti fino a quando p ≥ ob (cambia p di 1000, dì p); dì "fatto"`.

Famiglie: `ripeti` (N volte due mosse, poi "fatto"), `traguardo` (il contapassi della lezione), `quiz` (i punti
solo a chi risponde bene), `sblocco`, `risparmio`, `somma in giù`, e per il livello 3 anche `rovescia`, `multipli`,
`somma`.

## Livelli

1. **Blocchi ed errori.** Testo. Una affermazione vera tra tre false o il contrario (55%), oppure una situazione da
   classificare: errore logico (il programma parte e fa un'altra cosa) o di sintassi (non parte). Esempio: «nel
   blocco "ruota" metti 80 gradi al posto di 90» → errore logico.
2. **Il "ripeti" con il contatore.** Il diagramma di un "ripeti N volte" (N da 3 a 9): quante volte scrive la prima
   mossa, quante righe scrive in tutto (2N + 1), oppure quale blocco "ripeti" c'era.
3. **Un errore logico.** Un diagramma che si esegue senza fermarsi ma fa un'altra cosa: che cosa scrive con un certo
   ingresso? Quello che doveva scrivere è sempre tra le opzioni sbagliate. Esempio: conto alla rovescia con i due
   blocchi del giro scambiati, con 3 → 2, 1, 0, via.
4. **Dai blocchi al diagramma.** Un programma a blocchi a parole; opzioni: quattro diagrammi.
5. **Costruire il diagramma di un programma a blocchi.** Qui il "ripeti" legge quante volte (`chiedi quante volte e
   mettilo in n; ripeti n volte (…)`), come gli altri programmi del livello leggono qualcosa: le righe non si
   mettono a mano, e il diagramma deve avere il ciclo o la selezione della soluzione. Risposta aperta eseguita sulle prove; a scelta multipla,
   come il livello 4.

## Distrattori

Dai riquadri della lezione: "un programma che parte è giusto"; i blocchi che "si correggono da soli"; la condizione
di "ripeti fino a quando" copiata nel rombo senza girarla; "dì fatto" dentro la C; un giro in più o in meno nel
conto di "ripeti N volte"; il blocco che scrive i punti dentro il "se".

## Da evitare

Un personaggio che si muove (non c'è una scena: il diagramma scrive le mosse); uscite più lunghe di 9 righe da
leggere tra le opzioni (nel livello 2 le righe si contano, non si elencano).
