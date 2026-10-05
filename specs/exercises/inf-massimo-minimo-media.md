# inf-massimo-minimo-media: Massimo, minimo e media di una sequenza

Lezione: `docs/lezioni/informatica/riscritte/64-inf-massimo-minimo-media.md`. Usa `inf-programmi.ts` e
`inf-iter.ts`. Una sequenza si legge un dato alla volta, con la lunghezza letta prima (programma mostrato con il
`for`) o con un valore di fine (con il `while`). Gli ingressi di ogni esecuzione stanno in `params.tests`.

Contesti: temperature (`gradi`, da −9 a 15, chiuse da 999 perché lo 0 è una temperatura), voti, punti (di 10 in 10),
altezze in centimetri, tempi in secondi, prezzi (tutti positivi, chiusi da 0). Per l'errore dello zero servono dati
sopra e sotto lo zero: temperature, punti di un quiz con penalità, quote rispetto al livello del mare, movimenti di
un salvadanaio. I dati di una sequenza sono tutti diversi.

## Livelli

1. **Il più grande e il più piccolo.** Il programma della lezione (il primo dato letto prima del ciclo) e da 4 a 6
   dati; casi `massimo` e `minimo`. Distrattori: l'altro estremo, l'ultimo dato, il primo, lo 0, n.
   Esempio: 5, 194, 162, 178, 183, 169 → massimo 194.
2. **Partire da 0 è un errore.** Il programma ha `massimo = 0` (o `minimo = 0`) e legge tutti i dati nel ciclo.
   Caso `scrive`: dati tutti negativi (tutti positivi per il minimo), e il programma scrive 0. Caso `quale`: quattro
   sequenze, e solo su una il programma sbaglia. Esempio: massimo da 0 con −2, −29, −16, −12 → scrive 0.
3. **Una sequenza chiusa da un valore.** Da 3 a 5 dati e il valore di fine. Caso `giusto` (sette volte su dieci): la
   lettura è in fondo al corpo. Caso `in-cima`: la lettura è in cima, il valore di fine viene confrontato e vince
   (lo 0 per un minimo, il 999 per un massimo); `params.intended` è il programma giusto, e il suo risultato è tra le
   opzioni sbagliate.
4. **La media.** La divisione `/` dà risultati diversi nei due linguaggi e non si usa nei programmi. Caso `calcolo`:
   senza programma, la media di 2-5 dati con al più due decimali, scritta con la virgola; le opzioni portano il
   valore come frazione esatta. Distrattori: la media corretta a ogni dato con `(media + dato) / 2`, la somma non
   divisa, la somma divisa per un dato in più (il valore di fine contato), il punto medio tra massimo e minimo.
   Caso `programma`: somma e conto con il valore di fine, e la media scritta con `//` su dati la cui somma è
   multipla del conto. Caso `vuota` (una volta su venti circa): arriva solo lo 0 e il programma scrive
   "nessun dato".
5. **Costruire il diagramma del massimo.** Il diagramma della lezione, per il massimo o per il minimo. Risposta
   aperta: il diagramma, eseguito su tre prove. A scelta multipla: quattro programmi con il `for`, perché un
   diagramma con ciclo e selezione è troppo largo per un'opzione.
6. **Scrivere il programma di una sequenza.** Una sequenza chiusa da un valore: casi `massimo`, `minimo`,
   `somma-conto` (la somma e, sotto, quanti sono). Risposta aperta: il programma, su tre prove. A scelta multipla:
   quattro programmi con il `while`.

## Vincoli

Nei livelli 5 e 6 le tre prove hanno il valore cercato in prima posizione, in ultima e dove capita. Nessun `/` e
nessun decimale in un programma; quattro opzioni diverse, nel `calcolo` diverse come numeri; i programmi sbagliati
scrivono altro dal giusto su almeno una prova (quello che parte da 0 resta tra le opzioni solo quando i dati lo
smascherano); opzioni che sono programmi: al più 9 righe in Python e 34 caratteri per riga.

## Da evitare

Il valore di fine tra i dati; sequenze vuote nei livelli aperti; il massimo e il minimo insieme in un programma tra
le opzioni (in Python sono 11 righe); medie con più di due decimali.
