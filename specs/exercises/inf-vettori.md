# inf-vettori: I vettori

Esercizi della lezione `docs/lezioni/informatica/riscritte/70-inf-vettori.md` (terzo anno di informatica). I
programmi sono scritti a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`, come nella lezione: in
Python una lista, in C++ un array con la dimensione nella costante `N` (`const int N = 5;` prima di `main`), passato a
una funzione come `int v[], int n`. Gli indici partono da 0. Parole della lezione: vettore, elemento, indice,
dimensione.

I numeri sono interi e i programmi scrivono solo interi, uno per riga. Nessun programma mostrato o offerto come
opzione esce dal vettore: un indice fuori dal vettore in C++ non ha un comportamento definito, quindi l'errore
dell'indice è chiesto a parole (livello 1) e, nei distrattori, compare solo come ciclo che salta un elemento.

I nomi dei vettori sono `voti`, `punti`, `passi`, `tempi`, `pesi`, `gol`; nel livello 6 il vettore si chiama `v`,
perché le righe delle opzioni stiano in 34 caratteri.

## Livelli

1. **Indici ed elementi.** A parole, senza programma. Quattro casi, un quarto ciascuno.
   `ultimo`: "Il vettore tempi ha dimensione 26. Qual è l'indice del suo ultimo elemento?" → 25 (dimensione da 4 a
   60; distrattori: n, n + 1, n − 2).
   `dimensione`: "Gli indici del vettore voti vanno da 0 a 36. Qual è la sua dimensione?" → 37 (distrattori:
   l'ultimo indice, uno in meno, due in più).
   `fuori`: "Il vettore passi ha dimensione 6. Quale di questi elementi non esiste?" → `passi[6]` (distrattori: il
   primo elemento, l'ultimo, uno in mezzo, che esistono tutti).
   `posto`: "Il vettore gol ha dimensione 9. Come si scrive il suo terzo elemento?" → `gol[2]` (dal secondo
   all'ottavo; distrattori: l'indice uguale al posto, uno in più, due in meno).
2. **Leggere e scrivere un elemento.** Un programma intero su un vettore di 4 o 5 numeri diversi tra 2 e 9, senza
   cicli; la domanda è che cosa scrive, su due righe. Tre casi, un terzo ciascuno.
   `leggi`: scrive un elemento e la somma di altri due. Esempio: `voti = [4, 6, 7, 2, 5]`, `print(voti[3])`,
   `print(voti[1] + voti[2])` → 2, 13.
   `scrivi`: un assegnamento `v[a] = v[b] + c`, poi scrive `v[a]` e `v[a] + v[d]`. Esempio:
   `pesi = [6, 8, 2, 5, 7]`, `pesi[0] = pesi[1] + 1` → 9, 11.
   `ultimo`: il primo elemento prende il valore dell'ultimo più un numero; l'ultimo indice è scritto
   `len(v) - 1` in Python e `N - 1` in C++; scrive il primo e l'ultimo.
   Distrattori: quello che si ottiene saltando l'assegnamento, contando gli indici da 1, scrivendo l'indice al posto
   dell'elemento, andando un indice più avanti, facendo l'assegnamento al contrario, dimenticando il numero da
   aggiungere, scrivendo le righe in ordine inverso. Una lettura sbagliata che esce dal vettore non dà un'opzione.
3. **Scorrere un vettore.** Un programma intero con un ciclo su un vettore di 5 o 6 numeri diversi tra 2 e 12, in cui
   il massimo non è né il primo né l'ultimo; che cosa scrive. Tre famiglie, un terzo ciascuna.
   `somma`: la somma degli elementi visitati. `conta`: quanti elementi visitati sono maggiori di k, con k uno degli
   elementi. `massimo`: l'elemento più grande, con la variabile che parte da `v[0]` e il ciclo dall'indice 1.
   In `somma` e `conta` il ciclo mostrato non è sempre quello solito: parte da 0, oppure parte da 1, oppure si ferma
   un elemento prima della fine (`len(v) - 1`, `N - 1`), e va letto. Esempio: `gol = [10, 9, 7, 12, 4]`, ciclo da 1,
   somma → 32.
   Distrattori: quello che scrive lo stesso programma con un errore (gli altri estremi del ciclo, la somma degli
   indici, l'ultimo elemento al posto della somma, la variabile che parte da 1, `>=` o `<` al posto di `>`, il
   minimo al posto del massimo), il numero degli elementi, l'ultimo indice.
4. **Quale ciclo fa questo.** La domanda dà il vettore con i suoi valori e chiede quale pezzo di programma calcola
   la somma di tutti gli elementi, quanti sono maggiori di k, o il più grande, e in quale variabile. Opzioni:
   quattro programmi, di cui si vede solo il ciclo con la variabile che lo precede. Il programma intero di ogni
   opzione dichiara il vettore e scrive la variabile: solo quello giusto scrive il numero giusto su quel vettore.
   Distrattori: il ciclo che parte da 1, quello che si ferma un elemento prima, `somma + i`, `somma = v[i]`, la
   variabile che parte da 1, `somma + 1`; per `conta` anche `>=`, `<`, `conta + v[i]`; per `massimo` il confronto al
   contrario, `massimo = i`, l'assegnamento senza selezione, `massimo + 1`.
5. **Un vettore in una funzione.** Un programma intero con una funzione; che cosa scrive. Tre casi, un terzo
   ciascuno.
   `modifica`: la funzione riceve il vettore e ne cambia ogni elemento (`aumenta`: più k; `raddoppia`, `triplica`:
   per k); il programma scrive un elemento dopo la chiamata → l'elemento cambiato.
   `numero`: la funzione riceve un solo elemento, `aumenta(v[a])`, e cambia il suo parametro; il programma scrive lo
   stesso elemento → il valore di prima.
   `restituisce`: la funzione `sopra(v)` conta gli elementi maggiori di k e restituisce il conto.
   Distrattori: l'altra lettura della chiamata (cambiato o non cambiato), gli elementi vicini, il numero k; per
   `restituisce` gli errori del ciclo del livello 3.
6. **Scrivere un programma con un vettore.** Il programma legge 5 o 6 numeri interi, uno per riga, e lo studente
   scrive tutto: il programma di partenza è vuoto, con il commento `scrivi qui`. Tre famiglie, un terzo ciascuna.
   `rovescia`: scriverli in ordine inverso. `sopra-ultimo`: scrivere quanti sono maggiori dell'ultimo letto.
   `differenze`: trovare il più grande e scrivere per ogni numero quanto gli manca per arrivarci.
   Risposta aperta: il programma è eseguito su tre liste di numeri diversi tra 1 e 20, che scrivono tre cose
   diverse, e deve contenere un vettore (`vettore`). In tutte e tre le famiglie il risultato dipende da un numero
   letto dopo gli altri, quindi senza conservarli non si arriva alla risposta.
   A scelta multipla: quattro programmi di cui si vede la parte dopo la lettura. Distrattori: il ciclo che si ferma
   all'indice 1, quello in avanti, quello che scrive l'indice, quello che parte dal penultimo; il confronto con il
   primo o con il penultimo, `>=`, `<`, la somma al posto del conto; la differenza al contrario, il minimo, il
   massimo scritto da solo, il massimo senza selezione.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni che sono programmi e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- I casi di un livello escono nelle stesse quote.
- Nelle prove del livello 6 l'ultimo numero non è né il più grande né il più piccolo e il primo non è il più
  grande, così ogni errore previsto si vede; le tre prove hanno un numero diverso di elementi sopra l'ultimo.

## Da evitare

Programmi che escono dal vettore, tra quelli mostrati e tra le opzioni. Vettori con elementi ripetuti, in cui due
letture diverse danno lo stesso numero (i numeri si estraggono di nuovo quando restano meno di tre distrattori).
Medie e divisioni, che Python e C++ scrivono in modo diverso. Liste stampate intere.
