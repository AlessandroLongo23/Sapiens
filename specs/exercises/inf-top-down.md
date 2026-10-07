# inf-top-down: scomporre un problema, la progettazione top-down

Esercizi della lezione 69 (`docs/lezioni/informatica/riscritte/69-inf-top-down.md`), terzo anno, capitolo "Le
funzioni". La lezione svolge un problema solo (gli esiti di una classe); gli esercizi usano altri problemi dello
stesso tipo: i biglietti del cinema, una gara di corsa, la gita, il torneo, la pizzeria, le assenze, la biblioteca, la
palestra, le spedizioni, il parcheggio. Niente vettori: i dati sono scritti nel programma o letti uno alla volta.

I programmi sono scritti a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`. Solo numeri interi, e
testi restituiti da una funzione nel livello 3; nessuna divisione.

## Livelli

1. **Riconoscere i sottoproblemi.** Otto problemi, ognuno con quattro sottoproblemi che fanno una cosa sola, quattro
   pezzi di altri problemi e le due funzioni chiamate dal programma principale. Tre casi, un terzo ciascuno.
   `estraneo`: quale di quattro pezzi non è un sottoproblema del problema (tre sono suoi, uno è di un altro
   problema). `due-cose`: quale pezzo fa due cose e va diviso (due sottoproblemi del problema uniti da "e", contro
   tre sottoproblemi singoli: l'errore del riquadro "Un sottoproblema che fa due cose"). `ordine`: da che cosa si
   comincia a scrivere; giusto "dal programma principale, con f e g ancora vuote"; distrattori: dalla funzione più
   facile, dalla seconda funzione e da quelle che chiama, da tutte le funzioni, dal programma principale senza
   definire le funzioni (l'errore del riquadro "Partire dai dettagli").
   Esempio: il problema della gara, pezzi "leggere un tempo valido", "trovare il migliore di due tempi", "scrivere la
   riga di un atleta", "calcolare la multa di un libro" → l'ultimo non è un suo sottoproblema.
2. **Che cosa riceve e restituisce.** Dodici funzioni, ognuna con il suo sottoproblema, che cosa riceve e che cosa
   restituisce. Due casi, metà ciascuno. `riceve`: il programma principale ha già letto il dato e userà il risultato;
   che cosa riceve e che cosa restituisce la funzione. Distrattori: riceve e restituisce scambiati, non riceve
   niente, non restituisce niente, né l'uno né l'altro. `chiamata`: quale riga chiama la funzione nel modo giusto,
   con il risultato nella variabile data; le opzioni sono righe di codice senza punto e virgola (la domanda lo dice).
   Distrattori: il risultato buttato via, argomento e risultato scambiati, la chiamata senza argomenti,
   l'assegnamento rovesciato, il nome senza parentesi.
   Esempio: `prezzo` riceve l'età in `eta`, risultato in `r` → `r = prezzo(eta)`.
3. **Funzioni ancora vuote.** Che cosa scrive un programma in cui una funzione è vuota e restituisce un valore fisso.
   Tre famiglie, un terzo ciascuna. `somma`: tre chiamate sommate in un totale, la funzione restituisce sempre c (da 4
   a 9): scrive 3c. `conta`: un ciclo di n giri (da 3 a 7) che conta quando la funzione, che restituisce sempre vero
   o sempre falso, dice sì: scrive n oppure 0. `riga`: una funzione scritta che scrive un numero e il testo restituito
   da quella vuota, chiamata per k da 1 a n (2 o 3): n righe. Distrattori: la somma degli argomenti (chi crede che la
   funzione li usi), il valore fisso da solo, un giro in più o in meno, il conto rovesciato.
   Esempio: `prezzo` restituisce sempre 9, chiamata con 10, 40 e 70 → 27.
4. **Seguire il programma scomposto.** Che cosa scrive un programma con due funzioni: quella interna ha una selezione
   (`x < T` restituisce un valore, altrimenti un altro), quella esterna la chiama su due valori e somma. Due
   chiamate dal programma principale: una con un valore sotto T e uno sopra, una con un valore uguale a T. Quattro
   temi in quote uguali. Distrattori, ognuno il programma con un errore: i rami scambiati, `<=` al posto di `<`, la
   funzione interna dimenticata (somma i due argomenti), la funzione interna chiamata due volte sullo stesso
   argomento, lo stesso valore per tutti.
   Esempio: `prezzo(eta)` con T = 12, 5 e 9; `coppia(10, 40)` e `coppia(12, 30)` → 14, 18.
5. **Riempire la funzione vuota.** La regola a parole, in tre fasce (cinque temi in quote uguali; nei temi `cinema`
   e `palestra` la prima fascia è "meno di A", negli altri "fino ad A"). Opzioni: quattro funzioni, mostrate da sole.
   Il programma intero di ogni opzione prova la funzione sui valori A − 1, A, A + 1, B, B + 1: solo quella giusta
   scrive i cinque valori della regola. Distrattori: il confine della prima fascia sbagliato (`<` e `<=` scambiati),
   `>=` nella seconda, i valori di due fasce scambiati, i due confronti rovesciati, la funzione ancora vuota.
6. **Scrivere la funzione che manca.** Il programma principale legge uno o due numeri, uno per riga, e la lettura
   c'è già. Lo studente scrive la funzione, la chiama e scrive quello che restituisce (la chiamata non può essere
   già scritta: in C++ il programma di partenza non compilerebbe). Tre famiglie, un terzo ciascuna:
   `fasce` (la regola del livello 5), `migliore` (il più basso di due tempi, oppure il più alto di due punteggi),
   `sconto` (prezzo per numero di posti, meno uno sconto quando i posti sono almeno K, con il totale in una variabile
   locale). Risposta aperta: il programma è eseguito su tre o cinque prove che scrivono numeri diversi, e deve
   contenere una funzione definita e chiamata dallo studente (`funzione`). A scelta multipla: quattro funzioni, come
   nel livello 5.

## Vincoli

- Quattro opzioni diverse; i distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni, di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- I casi e i temi di un livello escono nelle stesse quote.
- Nei livelli 1 e 2 nessun sottoproblema singolo contiene una "e", perché la "e" è il segnale dei due pezzi.
- Nel livello 6 il programma di partenza non contiene nessuna funzione, e la consegna dice che la lettura c'è già.

## Da evitare

Pezzi "estranei" che potrebbero servire al problema (ogni problema ha i suoi quattro, scelti a mano); numeri per cui
due errori danno la stessa uscita (si estraggono di nuovo, senza cambiare famiglia); funzioni che scrivono al posto di
restituire tra le opzioni (in C++ sarebbero programmi di forma diversa); testi vero o falso stampati.
