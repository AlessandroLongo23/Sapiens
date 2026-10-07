# inf-bubble-sort: l'ordinamento a bolle

Esercizi della lezione 76, "L'ordinamento a bolle" (`docs/lezioni/informatica/riscritte/76-inf-bubble-sort.md`),
terzo anno di informatica. Generatore: `src/lib/exercises/v2/generators/inf-bubble-sort.ts`; controllo:
`scripts/exercises/checkers/inf_bubble_sort.py`. I programmi sono scritti a mano nei due linguaggi con
`src/lib/exercises/v2/inf-codice.ts` (`docs/lezioni/informatica/brief-esercizi-codice.md`).

Parole e nomi sono quelli della lezione: vettore `v` di `n` elementi, funzione `ordina`, `i` per i giri, `j` per le
coppie di vicini, scambio con `temp`, bandierina `scambiato`, "giro", "confronti", "scambi". In C++ i vettori sono
array (`int v[]`, `int tempi[N] = {...}` con `const int N`), mai `vector`. Niente notazione O grande.

Una differenza dalla lezione, imposta dalle larghezze: in C++ il limite del ciclo interno è scritto `n-1-i`, senza
spazi. Con gli spazi la riga `for (int j = 0; j < n - 1 - i; j++) {` dentro una funzione è lunga 45 caratteri, e
un programma sotto la domanda ne tiene 42. In Python resta `range(n - 1 - i)`.

## Livelli

1. **Un giro delle bolle.** Un vettore di 5 o 6 numeri diversi tra 2 e 30, metà e metà. Domanda: com'è il vettore
   alla fine del primo giro, in ordine crescente. Il primo giro fa almeno due scambi, non lascia il vettore già in
   ordine, e il più grande non parte dall'ultimo posto. Opzioni di testo. Distrattori: il vettore ordinato per
   intero; solo il primo scambio fatto; il più grande scambiato con l'ultimo, come farebbe la selezione; il giro
   fatto da destra a sinistra; il giro fatto con il confronto al contrario.
   Esempio: 15, 12, 19, 13, 17, 14 → 12, 15, 13, 17, 14, 19.
2. **Confronti e scambi.** La versione che fa tutti i giri, in ordine crescente, su un vettore dato. Due casi, metà
   ciascuno. `confronti`: da 5 a 8 numeri, non già in ordine; la risposta è n(n - 1)/2; distrattori n(n - 1), n²,
   n - 1, il numero di scambi, n. `scambi`: 4 o 5 numeri, né in ordine né rovesciati, con scambi in almeno due giri;
   la risposta è il numero di coppie fuori ordine; distrattori: il numero di confronti, n - 1 (uno per giro), gli
   scambi del solo primo giro, gli elementi fuori posto, uno in più.
   Esempio: 17, 30, 10, 19 → 3 scambi (2 nel primo giro, 1 nel secondo), 6 confronti.
3. **Che cosa scrive il programma.** Un programma intero nei due linguaggi, con un vettore di 5 o 6 numeri diversi
   tra 1 e 20 scritto nel programma (`tempi`, `punti`, `voti`, `prezzi`, `pesi`). Due casi, metà ciascuno. `giri`:
   la versione con la bandierina, che scrive `giri fatti: g`; la bandierina ferma i giri prima della fine
   (2 ≤ g ≤ n - 2). Distrattori: quello che scrive il programma con la bandierina mai riabbassata (n - 1), con la
   bandierina abbassata dall'inizio (0), con `i` che parte da 1; poi g - 1 (il giro senza scambi non contato) e n.
   `scambi`: la versione che fa tutti i giri, conta gli scambi e li restituisce; il programma scrive il numero.
   Distrattori: quello che scrive il programma con il contatore fuori dall'`if` (i confronti), aumentato una volta
   per giro (n - 1), partito da 1; poi gli scambi del solo primo giro e n. Opzioni `writtenOption`.
4. **Quale ciclo interno ordina.** La funzione `ordina` deve ordinare in ordine crescente o decrescente (metà e
   metà); il ciclo esterno è dato a parole. Opzioni: quattro programmi, mostrati con il solo ciclo interno. Il
   programma intero di ogni opzione ordina due vettori (di 5 e di 6 numeri) e li scrive con `stampa`, uno per riga.
   Errori, sette, di cui se ne tengono tre: confronto al contrario; scambio senza `temp`; `j` che si ferma una
   coppia prima; `j` che parte da `i`; confronto e scambio tra `v[i]` e `v[j]`; le ultime due assegnazioni dello
   scambio invertite; nessun confronto (scambia sempre). Nessun errore esce dal vettore.
5. **Scrivere l'ordinamento a bolle.** Risposta aperta. Il programma legge n e poi n numeri interi, uno per riga
   (la lettura c'è già); lo studente scrive la funzione `ordina`, la chiama e scrive il risultato. Tre casi, un
   terzo ciascuno, ognuno in ordine crescente o decrescente e con uno dei cinque nomi di vettore. `vettore`: scrive
   i numeri ordinati, uno per riga. `scambi`: `ordina` restituisce il numero di scambi e il programma lo scrive.
   `giri`: `ordina` fa solo i primi 2 o 3 giri, e il programma scrive il vettore com'è rimasto. Tre prove, su
   vettori di 6, 4 e 5 numeri, che scrivono tre cose diverse: in `vettore` la seconda ha un numero ripetuto; in
   `scambi` i numeri sono tutti diversi e la seconda è già in ordine (scrive 0); in `giri` la prima non esce
   ordinata, così chi ordina tutto non passa. Costrutti chiesti: `funzione` e `annidati`, nominati nella consegna.
   A scelta multipla: quattro cicli interni come nel livello 4; in `scambi` il settimo errore è il contatore fuori
   dall'`if`.

## Vincoli

- Quattro opzioni diverse; i distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni che sono programmi, di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor;
  al più 18 righe in Python e 28 in C++.
- `steps` di due o tre frasi, `solution` di una riga.
- I casi di un livello escono nelle stesse quote.

## Da evitare

- Vettori già in ordine o rovesciati dove si contano gli scambi, e vettori su cui due errori danno la stessa
  risposta: i numeri si estraggono di nuovo, il caso no.
- Numeri ripetuti dove si contano gli scambi: con due numeri uguali `>` e `>=` darebbero conti diversi.
- L'errore di `range(n)` nel ciclo interno (l'indice esce dal vettore) tra le opzioni che sono programmi: in C++
  non ha un comportamento definito.
- Nel livello 3, la riga C++ che dichiara il vettore più lunga di 42 caratteri: il vettore si estrae di nuovo.
- La funzione `ordina` intera come opzione: in C++ le righe dei due cicli superano i 34 caratteri. Per questo le
  opzioni mostrano il ciclo interno, e l'errore "un solo giro", che sta nel ciclo esterno, non c'è.
- La versione con la bandierina nel livello aperto: in C++ il programma intero supera le 28 righe.
