# inf-ricerca-sequenziale: La ricerca sequenziale

Esercizi della lezione `docs/lezioni/informatica/riscritte/71-inf-ricerca-sequenziale.md` (terzo anno di
informatica). I programmi sono scritti a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`, con i nomi
della lezione: `posizione` che parte da -1, `trovato`, il contatore `volte`, la funzione `cerca(v, x)` (in C++
`int cerca(int v[], int n, int x)`). In C++ il vettore è un array con la dimensione nella costante `N`.

Si conta un confronto per ogni elemento guardato. "La ricerca che si ferma" è quella del ciclo
`while i < N and posizione == -1` e della funzione con `return i` dentro il ciclo.

I programmi scrivono numeri interi oppure le parole `presente` e `assente`; nessuno scrive un valore vero o falso
(Python scrive `True`, C++ scrive `1`). Nessun programma esce dal vettore.

## Livelli

1. **Contare i confronti.** A parole, senza programma: il vettore con i suoi 6, 7 o 8 valori (tra 2 e 12) è scritto
   nella domanda, insieme al valore cercato; si chiede quanti confronti fa la ricerca che si ferma appena lo trova.
   Tre casi, un terzo ciascuno. `presente`: il valore c'è una volta, all'indice k → k + 1 (il primo posto esce meno
   spesso degli altri). `assente`: il valore non c'è → n. `ripetuto`: il valore c'è due volte → l'indice del primo
   più 1. Esempio: "Il vettore pesi contiene, in ordine, i valori 6, 2, 12, 10, 9, 2, 11, 3. La ricerca sequenziale
   cerca il valore 2 ..." → 2.
   Distrattori: l'indice al posto del numero dei confronti, i confronti fino alla seconda occorrenza, la dimensione,
   gli elementi che restano, 1; per `assente` n − 1, n + 1, 1, 0.
2. **Che cosa scrive la ricerca.** Un programma intero su un vettore di 6 o 7 numeri di una cifra, con il valore
   cercato in `x`; che cosa scrive. Quattro casi, un quarto ciascuno.
   `prima`: il valore c'è due volte e il ciclo `while` si ferma → l'indice della prima.
   `ultima`: il valore c'è due volte e il ciclo `for` non si ferma → l'indice dell'ultima.
   `assente`: il valore non c'è, con uno dei due cicli → -1.
   `conta`: il valore c'è due o tre volte e il programma conta in `volte` → 2 o 3.
   Esempio: `punti = [6, 8, 1, 8, 2, 7, 4]`, `x = 8`, ciclo `for` → 3.
   Distrattori: l'indice dell'altra occorrenza, il posto contato da 1, -1, il numero delle occorrenze, il valore
   stesso, la dimensione, l'ultimo indice.
3. **Quale funzione cerca bene.** La consegna a parole. Tre famiglie, un terzo ciascuna: `prima` ("l'indice del
   primo elemento di v uguale a x, oppure -1 se x non c'è"), `ultima` (l'indice dell'ultimo), `conta` (quante volte
   x compare). Opzioni: quattro funzioni mostrate da sole. Il programma intero di ogni opzione prova la funzione su
   un vettore di 6 o 7 numeri con quattro valori: uno che c'è due volte, non agli estremi; uno che non c'è; il primo
   elemento; l'ultimo. Solo la funzione giusta scrive i quattro numeri giusti.
   Distrattori, dagli errori della lezione: `return -1` in un `else` dentro il ciclo; `else` che rimette la
   variabile al valore di partenza; il ciclo che non si ferma quando serve il primo, o che si ferma quando serve
   l'ultimo o il conto; `return v[i]` al posto di `return i`; `return i + 1`; il ciclo che parte da 1; il confronto
   `i == x`; `volte + v[i]`; `!=`; il contatore che parte da 1.
4. **Caso migliore, peggiore e medio.** A parole. Cinque casi, un quinto ciascuno.
   `migliore`: n elementi (da 5 a 400) → 1. `peggiore`: → n. `medio`: n dispari, il valore c'è e ogni posto ha la
   stessa probabilità → (n + 1) : 2. `indice`: la ricerca ha trovato il valore dopo c confronti → indice c − 1.
   `doppio`: nel caso peggiore n confronti; con il doppio degli elementi → 2n.
   Distrattori: 0, n, n : 2, n − 1, n + 1, (n − 1) : 2, 4n, il numero dei confronti preso per indice.
5. **Scrivere la ricerca.** Il programma legge 5 o 6 numeri interi e poi il valore x, uno per riga; lo studente
   scrive tutto (il programma di partenza è vuoto, con il commento `scrivi qui`). Tre famiglie, un terzo ciascuna.
   `posizione`: scrivere l'indice del primo elemento uguale a x, oppure -1. `conta`: scrivere quante volte x
   compare. `presente`: scrivere la parola `presente` o `assente`.
   Risposta aperta: il programma è eseguito su tre prove (x due volte, non agli estremi; x assente; x una volta
   sola, al primo posto) e deve contenere un vettore (`vettore`): x arriva per ultimo, quindi i numeri vanno
   conservati.
   A scelta multipla: quattro programmi di cui si vede la parte dopo la lettura. Distrattori: il ciclo che non si
   ferma, l'`else` che cancella, `posizione + 1`, `posizione = v[i]`, il ciclo da 1; `volte = 1`, `volte + v[i]`,
   `!=`, il contatore da 1; le due parole scambiate, il confronto `i == x`.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni che sono programmi e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
  Per questo nel livello 2 i numeri del vettore hanno una cifra.
- I casi di un livello escono nelle stesse quote.
- Nei vettori, tolto il valore cercato, ogni numero compare una volta sola.

## Da evitare

Valori vero o falso stampati. Programmi che escono dal vettore (il ciclo senza `i < N`): l'errore è nella lezione e
nelle flashcard, non tra le opzioni. Vettori ordinati, che fanno pensare alla ricerca binaria. Il caso medio con n
pari, che non dà un numero intero.
