# inf-selezione-due-vie: La selezione a due vie

Lezione: `docs/lezioni/informatica/riscritte/57-inf-selezione-due-vie.md`. Aiuti comuni del capitolo:
`src/lib/exercises/v2/inf-sel.ts` e `scripts/exercises/checkers/_inf_sel.py`.

Ogni esercizio parte da una selezione scritta una volta sola, nel linguaggio dei blocchi `diagramma`. Cinque
famiglie, con i numeri estratti ogni volta:

- `una-via`: se la condizione è vera un valore cambia (e si scrive un avviso), poi il valore si scrive in tutti i
  casi: lo sconto, la spedizione, il bonus, la pozione;
- `due-vie`: un testo se la soglia è superata, un altro se no (dieci situazioni);
- `tariffa`: come sopra, ma si scrive uno di due numeri (il prezzo di un biglietto, la spedizione): il suo diagramma
  è abbastanza stretto per stare in un'opzione;
- `resto`: pari o dispari, multiplo di 3, 4, 5, 10 oppure no, con `%`;
- `maggiore`: il maggiore, o il minore, di due numeri.

La soglia è detta con le parole della lezione: "almeno" (`>=`), "più di" (`>`), "meno di" (`<`), "al massimo"
(`<=`). Le prove sono tre: il valore di confine e i due accanto (per `maggiore`: primo più grande, secondo più
grande, uguali), quindi i due rami e il confine.

Distrattori, dagli errori dei riquadri della lezione: il confine dalla parte sbagliata (`>` per `>=`); i due blocchi
scambiati; l'`else` dimenticato, con la seconda istruzione fuori dal blocco; un'istruzione del blocco uscita dal
rientro (o dalle graffe), che viene eseguita sempre; l'ultima riga finita dentro il blocco; il confronto girato;
`==` al posto della soglia; il segno sbagliato; `"a"` tra virgolette al posto di `a`.

## Livelli

1. **Che cosa scrive un if.** Una selezione a una via, come programma, e un ingresso: metà delle volte il valore di
   confine. Opzioni: quattro uscite. Esempio: `if punti > 50`, scrive "bonus", `punti = punti + 25`, poi scrive
   `punti`; con 49 → 49.
2. **Che cosa scrive un if-else.** Una selezione a due vie, come programma o, quando è abbastanza stretto, come
   diagramma. Esempio: `if n % 4 == 0` scrive "multiplo", altrimenti "non multiplo"; con 37 → non multiplo.
3. **Dalla consegna al programma.** La consegna a parole; opzioni: quattro programmi, di cui uno solo fa quello che
   dice la consegna su tutte le prove.
4. **Dal programma al diagramma.** Il programma; opzioni: quattro diagrammi. Solo le famiglie `una-via`, `tariffa`,
   `maggiore`: un diagramma con un testo su ogni ramo è più largo di un'opzione.
5. **Costruire il diagramma di una selezione.** La consegna. Risposta aperta: lo studente costruisce il diagramma,
   eseguito sulle tre prove. A scelta multipla: quattro diagrammi, oppure quattro programmi per `due-vie` e `resto`.
6. **Scrivere una selezione.** La stessa consegna, con le letture già scritte. Risposta aperta: lo studente scrive
   il programma, eseguito sulle tre prove. A scelta multipla: come il livello 3.

Vincoli: quattro opzioni che scrivono cose diverse sulle prove; nei programmi delle opzioni righe di al più 34
caratteri in Python e 39 in C++; diagrammi delle opzioni larghi al più 330 px, con una selezione.

## Da evitare

`%` con numeri negativi (i due linguaggi danno resti diversi); la divisione `/`; consegne in cui il valore di confine
non si capisce dalle parole.
