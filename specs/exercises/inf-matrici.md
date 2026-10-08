# inf-matrici: Le matrici

Esercizi della lezione 72, `docs/lezioni/informatica/riscritte/72-inf-matrici.md`. Ogni programma è scritto a mano in
Python e in C++ (`src/lib/exercises/v2/inf-codice.ts`), con le convenzioni della lezione: la matrice si chiama `m`,
`m[i][j]` ha sempre `i` per la riga e `j` per la colonna, le dimensioni sono `R` e `C` (`N` per una matrice
quadrata). In Python `R = len(m)` e `C = len(m[0])`; in C++ sono costanti scritte prima di `main`. I numeri sono
interi da 0 a 30, senza divisioni: Python e C++ scrivono le stesse righe.

## Livelli

1. **Un elemento, due indici.** Un programma con una matrice non quadrata (2×3, 3×2, 2×4 o 3×4) di numeri tutti
   diversi da 1 a 30. Due casi, metà ciascuno. `legge`: il programma scrive `m[a][b]`, con `a` diverso da `b`.
   `scrive`: `m[a][b] = m[c][d] + k` e poi scrive `m[a][b]`. Opzioni: quattro numeri. Distrattori: l'elemento con
   gli indici scambiati, quello che trova chi conta da 1, gli elementi vicini; nel secondo caso il vecchio valore, il
   vecchio valore più `k`, l'elemento letto senza `k`.
   Esempio: righe 10, 21, 18, 14 e 25, 8, 16, 2; `print(m[1][0])` → 25.
2. **Una riga o una colonna.** Un solo ciclo somma la riga `r` (`m[r][j]`, con `j` da 0 a C - 1) oppure la colonna
   `c` (`m[i][c]`). Numeri da 1 a 9. Distrattori: la somma della colonna con lo stesso indice al posto della riga (e
   viceversa), la riga o la colonna accanto, la somma di tutta la matrice, la somma senza l'ultimo elemento, il
   numero degli elementi.
   Esempio: righe 3, 7, 6, 5 e 8, 3, 5, 1; somma della riga 0 → 21.
3. **Due cicli annidati.** Il programma intero con i due cicli; tre casi, un terzo ciascuno: `righe` (la somma di
   ogni riga), `colonne` (la somma di ogni colonna), `conta` (per ogni riga, quanti elementi sono maggiori o uguali
   a `k`, con `k` da 5 a 7). L'uscita ha una riga per somma; nelle opzioni le righe sono separate da virgole.
   Distrattori: quello che scrivono gli stessi cicli con un errore, cioè i cicli scambiati, l'azzeramento sopra il
   ciclo esterno (somme che si accumulano), l'azzeramento dentro il ciclo interno (l'ultimo elemento), la stampa dopo
   i due cicli, `+ 1` al posto dell'elemento, il confronto sbagliato.
   Esempio: righe 3, 7, 6, 5 e 8, 3, 5, 1, per righe → 21, 17.
4. **Scegliere i cicli giusti.** La consegna a parole ("Quali cicli scrivono la somma di ogni colonna, un numero per
   riga dello schermo?"). Opzioni: quattro coppie di cicli, mostrate senza la matrice. Gli stessi tre casi del
   livello 3; nel caso `conta` il confronto è `>=`, `>` oppure `<`, e la consegna lo dice. Il programma intero di
   ogni opzione ha una matrice sua, su cui solo i cicli giusti scrivono i numeri giusti.
5. **Le due diagonali.** Una matrice quadrata 3×3 o 4×4 e un solo ciclo che somma la diagonale principale
   (`m[i][i]`) o la secondaria (`m[i][N - 1 - i]`), metà ciascuna. Distrattori: l'altra diagonale, la prima riga, la
   prima colonna, l'ultima colonna, la diagonale senza l'ultimo elemento, il numero dei giri.
6. **Scrivere i cicli.** Risposta aperta. Il programma legge una matrice, un numero per riga di tastiera (la lettura
   c'è già, nei due linguaggi, come nella lezione), e lo studente scrive i cicli e la stampa. Quattro casi, un
   quarto ciascuno: `righe`, `colonne`, `conta` (per ogni riga quanti elementi sono maggiori o uguali a `k`, con `k`
   da 4 a 7) su matrici 2×3, 3×2, 2×4, 4×2 o 3×3; la diagonale `principale` o `secondaria` di una matrice 3×3 o
   4×4. Il programma è eseguito su tre matrici diverse, che scrivono tre uscite diverse. Non si chiede nessun
   costrutto: la lettura contiene già due cicli annidati e la matrice, quindi `annidati` e `vettore` non
   distinguerebbero niente. A scelta multipla: quattro frammenti, come nel livello 4.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore: i cicli con `m[j][i]` restano solo quando la matrice è quadrata, e l'indice `N - i` della
  diagonale viene sempre scartato.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
  Per questo nelle opzioni l'accumulatore è `somma`, `s` o `tot`, e sulla diagonale `s`.
- I casi di un livello escono nelle stesse quote; nel livello 6 le due diagonali si dividono un quarto.

## Da evitare

Matrici quadrate nei livelli 1 e 2, dove gli indici scambiati non darebbero un errore riconoscibile; indici uguali
nel livello 1; matrici in cui due errori danno lo stesso numero (i numeri si estraggono di nuovo, il caso no);
uscite di una dozzina di numeri tra le opzioni del livello 3 (la stampa dentro il ciclo interno), che si
riconoscono dalla lunghezza.
