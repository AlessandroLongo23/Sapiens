# inf-stringhe: Le stringhe

Esercizi della lezione 73, `docs/lezioni/informatica/riscritte/73-inf-stringhe.md`. Ogni programma è scritto a mano
in Python e in C++ (`src/lib/exercises/v2/inf-codice.ts`), con le convenzioni della lezione: in C++ `string` con
`#include <string>`, mai array di `char`; `n` è la lunghezza (`len(s)`, `s.length()`), `i` l'indice; un carattere si
scrive `"a"` in Python e `'a'` in C++. Le parole sono in minuscolo, senza accenti e senza spazi, da 4 a 10 lettere:
così `len` e `length()` danno lo stesso numero e `cin >>` legge tutta la parola.

## Livelli

1. **Lunghezza e caratteri.** Una parola di almeno cinque lettere tutte diverse. Tre casi, un terzo ciascuno:
   `lunghezza` (il programma scrive la lunghezza), `carattere` (scrive `parola[k]`, con `k` né primo né ultimo),
   `dalla-fine` (calcola `n` e scrive `parola[n - 1]` o `parola[n - 2]`). Distrattori: la lunghezza diminuita o
   aumentata di 1 (l'indice dell'ultimo carattere scambiato per la lunghezza), il carattere che trova chi conta
   da 1, i caratteri vicini, il primo e l'ultimo.
   Esempio: `testo = "genova"`, `print(testo[4])` → v.
2. **Contare con un ciclo.** Un ciclo con un contatore. Tre casi: `lettera` (quante volte compare una lettera, in
   una parola che la ha almeno due volte), `prima` (quante lettere vengono prima di una data nell'alfabeto, con `<`
   tra caratteri), `doppie` (quante volte un carattere è uguale al successivo, con il ciclo fino a `n - 2`).
   Distrattori: quello che scrive lo stesso ciclo con un errore (il confronto al contrario, il contatore che parte
   da 1, il ciclo che salta il primo o l'ultimo carattere, `+ i` al posto di `+ 1`, la selezione dimenticata) e la
   lunghezza della parola.
   Esempio: "mamma", doppie → 1.
3. **Costruire una stringa.** Un ciclo che parte dalla stringa vuota e attacca un pezzo a ogni giro. Cinque casi,
   un quinto ciascuno: `rovescia` (ciclo all'indietro, carattere attaccato in fondo), `davanti` (ciclo in avanti,
   carattere messo davanti), `salta` (un carattere ogni due, con il passo 2), `sostituisce` (un asterisco al posto
   di una lettera, con `else`), `raddoppia` (ogni carattere due volte). Distrattori: quello che costruisce lo stesso
   ciclo con un errore (una copia, un carattere in meno, solo l'ultimo carattere, i caratteri di indice dispari) e
   la parola com'è.
   Esempio: "mare", `nuova = testo[i] + nuova` → eram.
4. **Confrontare due stringhe.** Tre stringhe `a`, `b`, `c`: il programma scrive quella che viene prima tra `a` e
   `b`, poi `uguali` o `diverse` confrontando `a` con `c`. Tre casi per il primo confronto: `ordine` (due parole
   minuscole con iniziali diverse), `prefisso` (una è l'inizio dell'altra: viene prima la più corta), `maiuscola`
   (la parola che nel dizionario verrebbe dopo ha l'iniziale maiuscola, e quindi viene prima). `c` è `a` uguale,
   oppure con l'iniziale dell'altro tipo, oppure senza l'ultima lettera. Le quattro opzioni sono le quattro coppie
   di risposte possibili.
5. **Scegliere la funzione giusta.** La consegna a parole. Quattro casi: `conta(s, c)` (quante volte `c` compare),
   `rovescia(s)`, `senza(s, c)` (la stringa senza i caratteri uguali a `c`), `raddoppia(s)`. Opzioni: quattro
   funzioni, mostrate da sole. Il programma intero di ogni opzione chiama la funzione su due parole e scrive i due
   risultati; i distrattori ne scrivono di diversi su almeno una delle due.
6. **Scrivere il ciclo.** Risposta aperta. Il programma legge una parola (la lettura c'è già) e lo studente scrive
   il ciclo e la stampa. Tre casi: `conta` (quante volte compare una lettera data), `rovescia`, `sostituisce` (un
   asterisco al posto di una lettera data). Il programma è eseguito su tre parole: con una lettera data, una
   parola che la ha all'inizio o alla fine, una che la ha due volte, una che la ha in mezzo. La risposta deve
   contenere un ciclo (`ciclo`), e la consegna lo dice: `parola[::-1]` e `parola.count("a")` scrivono il risultato
   giusto e non passano. La consegna porta un esempio, che è la prima prova. A scelta multipla: quattro frammenti.

## Vincoli

- Quattro opzioni diverse; i distrattori che sono programmi scrivono altro dal giusto su almeno una prova, non vanno
  in errore e non restituiscono la stringa vuota.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 negli altri programmi, di al più 38 nel
  programma di partenza dell'editor. Per questo nel livello 5 non ci
  sono cicli all'indietro né con il passo 2 (dentro una funzione la riga del `for` in C++ supera i 34 caratteri), e
  la funzione che raddoppia usa un nome corto per la stringa nuova.
- Niente valori vero o falso stampati: la palindroma della lezione, che risponde sì o no, non ha un livello suo.

## Da evitare

Parole con lettere accentate o maiuscole dove non sono l'argomento (livello 4); parole palindrome tra le prove di
`rovescia`; parole in cui due errori danno lo stesso risultato (si estrae un'altra parola, il caso no).
