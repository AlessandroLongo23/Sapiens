# inf-ricerca-binaria: la ricerca binaria

Esercizi della lezione 74, "La ricerca binaria" (`docs/lezioni/informatica/riscritte/74-inf-ricerca-binaria.md`).
Generatore: `src/lib/exercises/v2/generators/inf-ricerca-binaria.ts`; controllo:
`scripts/exercises/checkers/inf_ricerca_binaria.py`. I programmi sono scritti a mano in Python e in C++ con
`src/lib/exercises/v2/inf-codice.ts`.

Il programma è quello della lezione: la funzione `cerca(v, x)` (in C++ `cerca(v, n, x)`), con `sinistra`, `destra` e
`centro`, il ciclo `while sinistra <= destra`, prima il confronto di uguaglianza e poi le due metà; restituisce
l'indice, oppure -1. Si conta un confronto per ogni elemento guardato, come nella lezione e nelle figure. I vettori
hanno numeri interi diversi tra loro, da 1 a 60.

## Livelli

1. **Un giro della ricerca.** Un vettore ordinato di 7-11 numeri, mostrato con gli indici sopra i valori; il valore
   cercato, e i valori di `sinistra` e `destra` all'inizio di un giro a cui la ricerca arriva davvero, con almeno
   tre elementi ancora da esaminare. Si chiede che cosa succede nel giro. Opzioni di testo: "centro vale 5, poi
   sinistra diventa 6", "centro vale 5, poi destra diventa 4", "centro vale 5: il valore è trovato". Tre casi:
   `destra` (si tiene la metà di destra, 40%), `sinistra` (40%), `trovato` (20%). Distrattori: il centro giusto con
   la metà sbagliata; il centro giusto senza `+ 1` o `- 1` (l'errore del primo riquadro `ad-warning`); un centro
   sbagliato (metà della distanza tra i due indici, la media arrotondata in su, il centro di tutto il vettore) con
   quello che ne segue; "trovato" quando non lo è.
   Esempio: vettore 5, 10, 15, 24, 25, 30, 47, si cerca 12, sinistra 0 e destra 6 → centro vale 3, poi destra
   diventa 2.
2. **Che cosa scrive la ricerca.** Il programma intero nei due linguaggi: la funzione `cerca`, un vettore di 6 o 7
   numeri con un nome corto (`v`, `dati`, `anni`, `pesi`, `eta`) e due chiamate dentro la stampa. Il primo valore
   c'è e non è il primo elemento guardato; il secondo c'è (caso `presente`, metà) o non c'è (`assente`, metà).
   Opzioni: quello che il programma scrive. Distrattori: quello che scrive la stessa funzione con un errore (le due
   metà scambiate, `centro` confrontato con `x` al posto di `v[centro]`, il valore restituito al posto
   dell'indice, un ramo copiato sull'altro), gli indici contati da 1, i valori al posto degli indici, 0 al posto
   di -1.
   Esempio: `eta = [17, 26, 32, 37, 44, 59]`, `cerca(eta, 37)` e `cerca(eta, 30)` → 3, -1.
3. **Contare i confronti.** Tre casi. `trovato` (40%) e `assente` (40%): un vettore ordinato di 7-12 numeri con gli
   indici, e si chiede quanti elementi guarda la ricerca binaria per un valore dato; il valore è scelto in modo che
   la ricerca sequenziale ne guardi un numero diverso. `massimo` (20%): solo la dimensione (da 7 a 1 000 000, tra
   potenze di due, potenze di due meno uno e numeri tondi), e si chiede quanti confronti servono al massimo; la
   spiegazione dimezza come la lezione (1000, 500, 250, ..., 1: dieci numeri, dieci confronti). Distrattori: i
   confronti della ricerca sequenziale, uno in più, uno in meno, il numero degli elementi, la sua metà.
   Esempio: 17, 26, 32, 37, 44, 59, 60, si cerca 28 → 3 (guarda 37, 26, 32).
4. **Il corpo del ciclo.** La consegna descrive la funzione a parole e dice la condizione del ciclo; le opzioni sono
   quattro corpi del ciclo, dal calcolo di `centro` alla fine della selezione, senza il resto della funzione. Tre
   famiglie, un terzo ciascuna: `crescente` (la funzione della lezione), `decrescente` (il vettore è in ordine
   decrescente e il secondo confronto si rovescia, come nel secondo esercizio della lezione), `confronti` (la
   funzione restituisce quanti elementi ha guardato, come il secondo programma della lezione). Il programma intero
   di ogni opzione prova la funzione su quattro valori di un vettore di 7-9 numeri, tre presenti (uno per parte
   rispetto al primo centro) e uno assente: solo quello giusto scrive i quattro numeri giusti. Distrattori: gli
   errori del livello 2, il contatore che cresce solo nei due rami, `centro` calcolato come metà della distanza.
5. **Scrivere la ricerca binaria.** Risposta aperta. Il vettore di 6 numeri è già nel programma, in ordine
   crescente o decrescente (metà e metà), e il programma legge `x`; lo studente scrive la funzione `cerca`, la
   chiama e scrive il risultato. Il programma è eseguito su quattro valori (tre presenti, uno assente) e deve
   contenere una funzione definita e chiamata dallo studente (`funzione`). A scelta multipla: quattro corpi del
   ciclo, come nel livello 4.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova, finiscono
  sempre e non escono mai dal vettore: un errore che può far girare il ciclo all'infinito (`sinistra = centro`) non
  è tra i programmi, ed è nel livello 1 come opzione di testo.
- Righe di al più 34 caratteri nelle opzioni e di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor;
  al più 28 righe in C++ e 18 in Python. Per starci, in C++ `centro` è dichiarata prima del ciclo (come
  nella lezione) e il vettore è dichiarato con la dimensione scritta come numero, `int v[6]`, senza la costante `N`
  che la lezione mette in cima al programma.
- I casi di un livello escono nelle quote scritte sopra.

## Da evitare

Vettori con numeri ripetuti (la posizione trovata non sarebbe unica); valori che la ricerca binaria e la
sequenziale trovano con lo stesso numero di confronti nel livello 3; giri con meno di tre elementi nel livello 1;
programmi che non finiscono tra le opzioni.

## Limiti

La risposta aperta è corretta su quello che il programma scrive e sulla presenza di una funzione: una ricerca
sequenziale dentro una funzione `cerca` passa. In C++ il controllo si fa a richiesta (`INF_CPP=1`).
