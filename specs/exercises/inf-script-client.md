# inf-script-client: gli script nella pagina web

Esercizi della lezione 96, `docs/lezioni/informatica/riscritte/96-inf-script-client.md`. Cinque livelli, tutti a
scelta multipla con quattro opzioni; nessuna risposta aperta, perché la pipeline non esegue JavaScript.

Il JavaScript è testo: sta in `listing` sotto la domanda, in `solutionListing` e nelle opzioni (`listingOption`). La
risposta giusta la calcola il generatore dai suoi numeri. Il controllo Python la ricalcola leggendo il frammento con
un interprete suo (`scripts/exercises/checkers/_inf_g14.py`), che conosce il JavaScript della lezione e una pagina
ridotta (HTML, `querySelector`, `textContent`).

Convenzioni del codice mostrato: `const` e `let`, `===` e `!==`, punto e virgola, rientro di 4 spazi, nomi in
italiano senza accenti. Il contesto è il sito dei Fuori Tempo: posti, biglietti, prezzi, scaletta.

## Livelli

1. **Dove gira lo script.** Quattro casi.
   `concetto` (4 su 10): una pagina dei Fuori Tempo con il suo script (`posti.js` che calcola i posti liberi, ...)
   e la domanda "quale di queste affermazioni è vera?" oppure "è falsa?". Le affermazioni vengono da due elenchi,
   sei vere e otto false, sulle tre conseguenze della lezione: chi esegue lo script (il browser, non il server), chi
   può leggerlo (chiunque apra la pagina), che cosa non può fare (leggere il disco, guardare le altre schede). Una
   giusta e tre dell'altro elenco.
   `head`, `defer`, `fondo` (2 su 10 ciascuno): sotto la domanda la pagina (`head` e `body`, con un paragrafo che ha
   un id e un testo provvisorio) e, dopo una riga con il nome del file, il suo script. Il tag `script` sta nella
   `head` senza `defer`, nella `head` con `defer`, oppure in fondo al `body`. Due domande, metà ciascuna: "che cosa
   c'è nella costante voce?" (l'elemento oppure `null`) e "che cosa si legge sotto il titolo?" (il numero calcolato,
   oppure il testo provvisorio che resta perché lo script si è fermato). Distrattori: l'altro esito, `null` scritto
   nella pagina, l'espressione non calcolata, "tutta la pagina", "il testo scritto nel paragrafo".
   Esempio: `<script src="posti.js"></script>` nella `head`, `voce.textContent = posti - venduti;` → resta `?`.
2. **Che cosa scrive la console.** Uno script di quattro o cinque righe, senza selezione né cicli. Tre casi.
   `conto` (4 su 10): `const`, `let`, un assegnamento che cambia una variabile, e un `console.log` con più
   argomenti. Distrattori: gli argomenti attaccati senza spazio, separati da virgole, con le virgolette, con il nome
   della variabile al posto del valore, con il valore di prima dell'assegnamento.
   `testo` (3 su 10): due valori, ognuno un testo tra virgolette, un numero, o un testo passato da `Number()`, e la
   loro somma con `+`. Distrattori: la somma al posto dell'attaccatura (o viceversa), i due valori separati da uno
   spazio, `NaN`, "si ferma con un errore".
   `const` (3 su 10): una `const` e una `let`, e la terza riga ne riassegna una. Metà delle volte è la `const`, e la
   risposta giusta è l'opzione di testo "Niente: lo script si ferma con un errore". Distrattori: il valore come se
   l'assegnamento fosse riuscito, il valore di prima, lo stesso senza lo spazio.
   Esempio: `const interi = "2"; const ridotti = 3; const persone = interi + ridotti;` → `Persone: 23`.
3. **Selezione e confronti.** Un solo `if`, con o senza `else`. Tre casi, un terzo ciascuno.
   `se`: lo sconto sopra una soglia (`>=` oppure `>`, con il numero spesso uguale alla soglia) o "Esaurito" contro
   "Liberi: n". `uguale`: `===` oppure `!==` tra due valori che sono testi o numeri, con o senza `Number()`: il
   caso più frequente è `"4" === 4`, che è falso. `logici`: due condizioni unite da `&&` oppure `||`, con le quattro
   combinazioni di vero e falso nelle stesse quote.
   Distrattori: l'altro ramo, tutti e due i rami, niente, l'errore, il totale con il prezzo sbagliato.
4. **Cicli e funzioni.** Tre casi, un terzo ciascuno.
   `for`: una somma (`<` oppure `<=`, passo 1 o 2) oppure una riga scritta a ogni giro. `while`: quante file da k
   posti servono per n spettatori, oppure quante settimane per arrivare a una cifra. `funzione`: una funzione con
   due parametri chiamata una volta, una funzione con un `if` e due `return` chiamata in un ciclo, due chiamate
   sommate. Al più cinque righe scritte.
   Distrattori: un giro in più o in meno, gli argomenti scambiati, lo sconto dato a tutti o a nessuno, i due valori
   attaccati al posto della somma.
5. **Da Python a JavaScript.** Sotto la domanda un frammento in Python; le opzioni sono quattro frammenti
   JavaScript, e uno solo fa lo stesso. Quattro casi, un quarto ciascuno: `scrivere` (variabili e `print`),
   `selezione` (`if` con `and` o `or`, oppure `if`, `elif`, `else`), `ciclo` (`for ... in range` oppure `while`),
   `funzione` (`def` con `return`). Ogni distrattore ha un solo errore: `print` rimasto, il tipo davanti al nome
   (`int n`), `and` e `or` rimasti, i due punti al posto delle graffe, la condizione senza tonde, `elif` o `elseif`,
   `def`, `for i in range(...)`, una `const` che poi viene riassegnata, `let` ripetuto, `<=` dove `range` si ferma
   prima, la funzione senza `return`, `"Totale:" + totale` che perde lo spazio.

## Vincoli

- Quattro opzioni diverse, una giusta.
- Righe di al più 42 caratteri sotto la domanda e 34 nelle opzioni; al più 18 righe sotto la domanda e 10 in
  un'opzione.
- Livelli 2, 3 e 4: `params.script` è lo script mostrato, e l'opzione giusta è quello che scrive (le righe unite da
  un a capo), oppure `errore`. Uno script non scrive mai qualcosa per poi fermarsi.
- Livello 1, casi con la pagina: `params.html`, `params.script`, `params.file` e `params.id`; il frammento mostrato
  è l'HTML, una riga vuota, `// file`, lo script.
- Livello 5: `params.python` è il frammento mostrato. Il controllo lo esegue con Python ed esegue ogni opzione con
  il suo interprete: solo quella giusta scrive le stesse righe; le altre scrivono altro, si fermano o non sono
  JavaScript.
- Le quote dei casi sono in `CASE_RANGES` del controllo.

## Da evitare

- Il distrattore "variabile senza `let`": in uno script non in modalità strict `n = 5;` funziona, quindi il
  frammento farebbe lo stesso di quello giusto.
- `==` e `!=`, `var`, `onclick` nell'HTML, i punti e virgola dimenticati come errore (JavaScript li aggiunge).
- Divisioni, numeri decimali, `"2" * 3` e le altre conversioni che la lezione non nomina.
- Uno script che scrive una riga e poi si ferma: nessuna opzione lo saprebbe dire.
