# inf-operatori-logici: Gli operatori logici

Lezione: `docs/lezioni/informatica/riscritte/58-inf-operatori-logici.md`. Aiuti comuni del capitolo:
`src/lib/exercises/v2/inf-sel.ts` e `scripts/exercises/checkers/_inf_sel.py`.

I programmi sono selezioni a due vie con una condizione composta, scritta una volta nel linguaggio dei blocchi
`diagramma`. Quattro famiglie:

- `e`: due valori letti, ognuno con la sua soglia, uniti da E (la giostra, l'esame, la spada, la gita);
- `o`: due valori uniti da O (il premio, lo sconto, la porta); un valore troppo basso o troppo alto (il biglietto
  ridotto, l'allarme della serra); un valore che deve essere uno di due (il giorno di chiusura);
- `intervallo`: un valore compreso tra due estremi, scritto `1 <= voto E voto <= 10`;
- `precedenza` (solo nel livello 2): `voto >= 9 O voto >= 6 E ore >= 20`, senza parentesi.

Nei testi le condizioni sono scritte come nei diagrammi, con E, O, NON, perché un testo è lo stesso per i due
linguaggi; nei programmi `codes` scrive `and`, `or`, `not` e `&&`, `||`, `!`. Le prove coprono le quattro
combinazioni di vero e falso e i valori di confine.

Distrattori, dai riquadri della lezione: E al posto di O e viceversa; il confine dalla parte sbagliata; un confronto
solo dei due; i due testi scambiati; i pezzi negati senza cambiare l'operatore (`voto < 1 E voto > 10`, mai vera);
il contrario di `<` scritto `>`.

## Livelli

1. **Tabelle di verità.** Testo. Quattro casi: `tabella` (30%), i valori di A e B e quattro espressioni, di cui una
   sola ha il valore chiesto; `valori` (35%), lo stesso con due confronti e i valori delle variabili; `precedenza`
   (20%), tre lettere, con e senza parentesi; `righe` (15%), in quante righe della tabella un'espressione è vera.
   Esempio: A vera, B falsa; quale è falsa tra `NON (A E B)`, `NON B`, `NON A O B`, `A O NON B`? → `NON A O B`.
2. **Che cosa scrive con E, O, NON.** Un programma con una condizione composta. Due domande: che cosa scrive con
   certi ingressi (un confine sei volte su dieci), oppure con quale di quattro ingressi scrive un certo testo.
3. **Dentro o fuori da un intervallo.** La consegna a parole ("compreso tra 1 e 10, estremi inclusi", oppure "meno
   di 11 oppure almeno 65"); opzioni: quattro programmi.
4. **Negare una condizione.** Testo. Quale di quattro condizioni è vera esattamente quando quella data è falsa. Casi:
   `confronto` (25%), un confronto solo (`eta < 21` → `eta >= 21`); `e`, `o`: De Morgan
   (`eta >= 18 E soldi >= 40` → `eta < 18 O soldi < 40`).
5. **Costruire il diagramma di una condizione composta.** La consegna. Risposta aperta: lo studente costruisce il
   diagramma con una selezione sola. A scelta multipla: quattro programmi (un rombo con due confronti è più largo di
   un'opzione).
6. **Scrivere una condizione composta.** La stessa consegna, con le letture già scritte. Risposta aperta: lo
   studente scrive il programma. A scelta multipla: quattro programmi.

Vincoli: nei programmi delle opzioni righe di al più 34 caratteri in Python e 39 in C++; quattro opzioni che
scrivono cose diverse sulle prove; nel livello 4 il controllo prova ogni opzione su una griglia di valori intorno a
ogni numero della condizione.

## Da evitare

`giorno == 6 O 7` come programma (il diagramma non lo esegue); `1 <= voto <= 10`, che in C++ vuol dire altro; un
valore vero o falso scritto o tenuto in una variabile; NON davanti a un confronto senza parentesi (`!eta >= 18` in
C++ nega solo `eta`).
