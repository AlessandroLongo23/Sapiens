# inf-selection-sort: l'ordinamento per selezione

Esercizi della lezione 75, "L'ordinamento per selezione"
(`docs/lezioni/informatica/riscritte/75-inf-selection-sort.md`). Generatore:
`src/lib/exercises/v2/generators/inf-selection-sort.ts`; controllo:
`scripts/exercises/checkers/inf_selection_sort.py`. I programmi sono scritti a mano in Python e in C++ con
`src/lib/exercises/v2/inf-codice.ts`.

Il programma è quello della lezione: la funzione `ordina(v)` (in C++ `void ordina(int v[], int n)`), `i` per il giro
esterno, `j` per quello interno, `imin` per l'indice del minimo, lo scambio con `temp` fatto solo quando
`imin != i`. Si conta un confronto per ogni `v[j] < v[imin]` e uno scambio solo quando avviene. I vettori hanno
numeri interi diversi tra loro, da 2 a 40.

## Livelli

1. **Trovare il minimo.** Un programma senza funzioni: un vettore di 5 o 6 numeri, `i` con un valore, `imin` che
   parte da `i`, il ciclo su `j` e la stampa di `imin` e di `v[imin]`. Due casi, metà ciascuno: `inizio` (`i` vale
   0) e `da i` (`i` vale almeno 1, e il più piccolo di tutto il vettore sta prima di `i`). Il minimo non è né
   l'elemento di partenza né il primo più piccolo che si incontra. Opzioni: quello che il programma scrive.
   Distrattori: quello che scrive lo stesso programma con un errore (il confronto con `v[i]` al posto di
   `v[imin]`, il ciclo o `imin` che partono da 0, il segno rovesciato), l'indice contato da 1, il valore due volte,
   indice e valore scambiati.
   Esempio: `v = [7, 14, 18, 11, 30, 24]`, `i = 1` → 3, 11.
2. **Lo scambio.** Un programma che scambia due elementi di un vettore di 4 o 5 numeri e poi li scrive tutti. Tre
   casi: `con temp` (lo scambio giusto, metà), `senza temp` (le due assegnazioni del riquadro `ad-warning`, un
   quarto), `ordine sbagliato` (`temp` c'è, ma la seconda e la terza riga sono scambiate, un quarto). Opzioni:
   quello che il programma scrive. Distrattori: quello che scrivono le altre due versioni, e il vettore com'era.
   Esempio: `v = [22, 40, 39, 12]`, `v[1] = v[2]` e poi `v[2] = v[1]` → 22, 39, 39, 12.
3. **Un giro dell'ordinamento.** Senza programma: un vettore di 5 o 6 numeri, e si chiede com'è dopo il primo giro,
   dopo i primi due o dopo i primi tre (un terzo ciascuno). L'ultimo dei giri chiesti fa uno scambio e il vettore
   non è ancora ordinato. Distrattori: un giro in meno, un giro in più, il minimo portato al suo posto facendo
   scorrere gli altri di un posto, lo scambio senza `temp`, i giri dell'ordinamento a bolle, il vettore tutto
   ordinato, i giri fatti cercando il massimo.
   Esempio: 22, 40, 39, 12, 25, dopo i primi due giri → 12, 22, 39, 40, 25.
4. **Confronti e scambi.** Senza programma, tre casi. `confronti` (20%): quanti confronti in tutto su $n$ elementi
   ($n$ da 4 a 100), cioè $n(n-1)/2$; distrattori $n^2$, $n(n-1)$, $n-1$, $n(n+1)/2$, $n$. `giro` (40%): quanti
   confronti nel giro in cui `i` vale un numero dato, su $n$ elementi ($n$ da 5 a 12), cioè $n - 1 - i$;
   distrattori $n - i$, $n - 1$, $i$. `scambi` (40%): quanti scambi su un vettore dato di 5-7 numeri, dove almeno
   un giro scambia e almeno uno no; distrattori $n - 1$ (uno per giro), gli elementi fuori posto, i confronti.
   Esempio: 18, 40, 19, 21, 7, 17, 11 → 5 scambi.
5. **Il corpo del giro.** La consegna descrive la funzione a parole e dice che cosa fa il ciclo esterno; le opzioni
   sono quattro corpi del ciclo esterno, da `imin = i` allo scambio. Due famiglie, metà ciascuna: `crescente` e
   `decrescente` (l'indice si chiama `imax`, come nel secondo esercizio della lezione). Il programma intero di ogni
   opzione ordina un vettore di 6 o 7 numeri e lo scrive: solo quello giusto lo scrive in ordine. Distrattori: il
   segno rovesciato, il confronto con `v[i]`, lo scambio senza `temp`, `imin` che parte da 0, il ciclo interno che
   parte da 0.
6. **Scrivere l'ordinamento.** Risposta aperta. Il vettore di 6 numeri è già nel programma, che legge un indice
   `k`; lo studente scrive la funzione `ordina`, la chiama e scrive `v[k]`. Ordine crescente o decrescente, metà e
   metà. Il programma è eseguito sui sei indici, quindi le prove vedono tutto il vettore ordinato, e deve contenere
   una funzione definita e chiamata dallo studente (`funzione`). A scelta multipla: quattro corpi del ciclo
   esterno, come nel livello 5.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore: nessun errore previsto porta un indice fuori dal vettore.
- Righe di al più 34 caratteri nelle opzioni e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor;
  al più 28 righe in C++ e 18 in Python. Per starci, il programma del livello 6 non legge il vettore
  e non lo stampa per intero: legge un indice e scrive un elemento. Il vettore è dichiarato con la dimensione
  scritta come numero, `int v[6]`, senza la costante `N` della lezione.
- I casi di un livello escono nelle quote scritte sopra.

## Da evitare

Numeri ripetuti nel vettore (due minimi uguali renderebbero ambiguo l'indice); nel livello 1 un minimo che si
trova al primo confronto; nel livello 3 un giro che non cambia niente; nel livello 4 un vettore in cui tutti i giri
scambiano o nessuno; nel livello 6 un vettore già in ordine.

## Limiti

La risposta aperta è corretta su quello che il programma scrive e sulla presenza di una funzione: un altro
ordinamento dentro una funzione `ordina`, o `v.sort()` chiamato da una funzione, passa. Non si chiede il costrutto
`annidati`, perché una selezione scritta con `min` e `index` non ha due cicli annidati ed è giusta. In C++ il
controllo si fa a richiesta (`INF_CPP=1`).
