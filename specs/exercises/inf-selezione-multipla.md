# inf-selezione-multipla: Selezioni annidate e a più vie

Lezione: `docs/lezioni/informatica/riscritte/59-inf-selezione-multipla.md`. Aiuti comuni del capitolo:
`src/lib/exercises/v2/inf-sel.ts` e `scripts/exercises/checkers/_inf_sel.py`.

Ogni esercizio è una cascata: una selezione nel ramo del no di un'altra, scritta una volta nel linguaggio dei
blocchi `diagramma`. Tre famiglie:

- `segno`: sopra zero, sotto zero o proprio zero (temperatura, saldo, numero, quota);
- `confronto`: quale di due numeri è il maggiore, o che sono uguali;
- `fasce`: tre o quattro fasce di un valore (punti, livello, temperatura, carica, media), con le soglie dalla più
  alta in giù con `>=` oppure dalla più bassa in su con `<`; o il prezzo di un biglietto per età.

Il sito scrive una cascata come un `if` dentro un `else`, non con `elif` / `else if`: i programmi degli esercizi
hanno quella forma, che la lezione mostra per prima. Un diagramma con due selezioni è largo circa 550 px: non sta in
un'opzione e, su un telefono, nemmeno sotto la domanda. Per questo le opzioni sono programmi, e il diagramma viene
chiesto (livello 5) e mostrato con la soluzione.

Le prove coprono tutte le strade e ogni soglia (la soglia e il valore subito sotto).

Distrattori, dai riquadri della lezione: le condizioni nell'ordine sbagliato (la soglia più bassa per prima prende
tutti); un `if` su ogni riga, senza `else` (con un valore alto scrive più giudizi); il primo `if` da solo e l'`else`
attaccato al secondo; l'ultima strada scritta dopo le selezioni, per tutti; una soglia con il confine dalla parte
sbagliata; due testi scambiati.

## Livelli

1. **Due selezioni annidate.** Famiglie `segno` e `confronto`, come programma; un ingresso. Opzioni: quattro uscite.
   Esempio: `if a < b` scrive "secondo", altrimenti `if a > b` scrive "primo", altrimenti "pari"; con 6 e 12 →
   secondo.
2. **Una cascata con le soglie.** Tre o quattro fasce, come programma; l'ingresso è una soglia sei volte su dieci.
   Opzioni: i testi delle fasce.
3. **L'ordine delle condizioni.** La consegna e un programma così com'è: con le condizioni nell'ordine sbagliato
   (`ordine`, 40%), con un `if` su ogni riga (`tanti-if`, 40%) o giusto (`giusto`, 20%). Che cosa scrive davvero con
   un ingresso che fa vedere l'errore. Esempio: "freddo" sotto 22, "mite" da 22 a 27, "caldo" da 28 in su, con tre
   `if` separati e 21 in ingresso → freddo, mite.
4. **Dalla consegna alla cascata.** La consegna a parole; opzioni: quattro programmi a tre vie.
5. **Completare il diagramma con due selezioni.** La consegna e il diagramma con il primo rombo, come nel "Prova tu"
   della lezione. Risposta aperta: lo studente mette la seconda selezione nel ramo del no. A scelta multipla:
   quattro programmi.
6. **Scrivere una cascata.** La stessa consegna, con le letture già scritte. Risposta aperta: lo studente scrive il
   programma, con `elif` / `else if` o con le selezioni annidate. A scelta multipla: quattro programmi.

Vincoli: nei programmi delle opzioni al più 9 righe di al più 34 caratteri in Python, e righe di al più 39 in C++
(per questo i testi delle fasce hanno al più 8 lettere); quattro opzioni che scrivono cose diverse sulle prove.

## Da evitare

`switch` e `match` (il sito non li genera, e `break` vale per un linguaggio solo); cascate a quattro vie nelle
opzioni (11 righe); soglie a distanza 1, per cui una fascia sarebbe "da 6 a 6"; fasce che non hanno senso per la
grandezza (un voto 12).
