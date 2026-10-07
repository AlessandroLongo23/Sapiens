# inf-validazione-moduli: controllare i dati di un modulo

Esercizi della lezione 98, `docs/lezioni/informatica/riscritte/98-inf-validazione-moduli.md`. Cinque livelli, tutti a
scelta multipla con quattro opzioni.

Quello che è scritto in un campo si vede nell'attributo `value` del suo tag (`<input id="nome" value="  Anna ">`):
è HTML vero, e a larghezza fissa gli spazi si contano. Una casella spuntata ha l'attributo `checked`. Un tag troppo
lungo va su due righe, con `value` a capo.

La risposta giusta la calcola il generatore. Il controllo Python costruisce il modulo, esegue lo script con
l'interprete di `scripts/exercises/checkers/_inf_g14.py` e fa partire `submit`. Dove lo script usa nomi che non
dichiara (`form`, il campo, `errore`), la domanda dice che sono già stati presi con `querySelector`, e il controllo
glieli dà.

## Livelli

1. **Leggere un campo.** Il campo con il suo `value` e uno script che scrive nella console. Tre casi.
   `lunghezza` (8 su 20): un nome o una città con spazi davanti o dopo (e a volte uno in mezzo), e
   `campo.value.trim().length` (due volte su tre) oppure `campo.value.length`. Distrattori: il conto con o senza
   gli spazi intorno, le sole lettere, gli spazi di un lato solo.
   `somma` (7 su 20): `biglietti.value + 2` contro `Number(biglietti.value) + 2`, oppure due campi sommati con o
   senza `Number()`. Distrattori: la somma al posto dell'attaccatura (o viceversa), `2 + 3` non calcolato, l'errore.
   `casella` (5 su 20): due caselle, e due `console.log` di `checked`, con o senza `!`. Opzioni: le quattro coppie
   di `true` e `false`.
   Esempio: `value="  Anna "` e `nome.value.trim().length` → 4.
2. **Quale valore passa il controllo.** Un ascoltatore di `submit` con un solo controllo, e quattro valori tra
   virgolette come opzioni. La domanda è "con quale valore il modulo parte?" (uno passa, tre vengono fermati) oppure
   "con quale l'invio viene fermato?" (il contrario). Quattro casi, un quarto ciascuno.
   `vuoto`: `testo === ""`, con `trim()` tre volte su quattro; senza `trim()` i soli spazi passano.
   `lunghezza`: `testo.length < m` oppure `> m`, con o senza `trim()`; tra i valori ce n'è uno di lunghezza m.
   `forma`: `!testo.includes("@")` su un'email, oppure `!testo.includes(" ")` su nome e cognome.
   `intervallo`: `n < a || n > b` con `n = Number(biglietti.value)`; tra i valori ci sono i due estremi.
3. **Quale messaggio compare.** Una funzione con i controlli in ordine, ognuno con il suo `return` e il suo
   messaggio, e in fondo `return ""`. Tre campi: il nome (vuoto, troppo corto, troppo lungo), l'email (vuota, senza
   chiocciola), i biglietti (vuoto, non intero, fuori dall'intervallo). Quattro casi, un quarto ciascuno, secondo il
   controllo che ferma il valore: `primo`, `secondo`, `terzo`, `nessuno`. Opzioni: i messaggi della funzione e
   "Niente: il messaggio resta vuoto"; per l'email, che ha due controlli, la quarta è "Tutti e due i messaggi".
   Esempio: `value=" A "` nel nome → dopo `trim()` resta una lettera: "Almeno 2 lettere".
4. **Il modulo parte?** Un ascoltatore di `submit` con un controllo, una variabile `messaggio` e
   `event.preventDefault()` dentro le graffe dell'`if` (`giusto`), assente (`manca`) o fuori dalle graffe
   (`sempre`). Quattro casi, un quarto ciascuno, che sono anche le quattro opzioni: `parte` (nessun messaggio, il
   modulo parte), `fermato` (messaggio, non parte), `lo-stesso` (messaggio, ma parte: manca `preventDefault`),
   `mai` (nessun messaggio, ma non parte: `preventDefault` è fuori dall'`if`).
5. **Scrivere il controllo.** Sotto la domanda la funzione con un commento al posto della condizione; le opzioni
   sono quattro condizioni. Quattro casi.
   `uguali` (3 su 10): due campi che devono avere lo stesso testo, metà delle volte "tolti gli spazi". Distrattori:
   i nodi confrontati al posto dei `value`, `===` al posto di `!==`, un solo `=`, la versione senza `trim()`,
   `trim()` chiamata sul nodo, il nome del campo tra virgolette.
   `vuoto` (2 su 10): distrattori: senza `trim()`, il nodo confrontato con `""`, `!==`, `trim()` sul nodo, un solo
   `=`, `length === ""`.
   `intervallo` (3 su 10): distrattori: `&&` al posto di `||`, la condizione di quando il numero è giusto, i versi
   scambiati, `<=` e `>=`, una sola delle due parti.
   `somma` (2 su 10): due campi sommati, "più di n in tutto". Distrattori: senza `Number()` (`"2" + "1"` fa `"21"`),
   `Number()` intorno alla somma dei testi, i nodi sommati, `<`, `>=`.

## Vincoli

- Quattro opzioni diverse, una giusta.
- Righe di al più 42 caratteri sotto la domanda e 34 nelle opzioni; al più 18 righe sotto la domanda.
- Livelli 1, 3 e 4: `params.html` e `params.script` sono le due parti del frammento (HTML, riga vuota,
  `// script.js`, script); `params.field` è l'id del campo. Livello 2: `params.script`, `params.field`,
  `params.ask` (`passa` o `fermato`). Livello 5: `params.script` con il commento `/* condizione */`,
  `params.fields`, e i numeri della consegna (`low`, `high`, `max`, `trims`).
- Livello 2: il controllo scrive nel campo ognuno dei quattro valori e invia il modulo; uno solo dà l'esito
  chiesto.
- Livello 5: il controllo mette ogni condizione al posto del commento e la prova su valori scelti da lui (campo
  vuoto, soli spazi, estremi dell'intervallo, uno sopra e uno sotto, coppie con la stessa somma). Solo quella giusta
  ferma tutti e soli i valori che la consegna dice.
- Le quote dei casi sono in `CASE_RANGES` del controllo.

## Da evitare

- Il campo vuoto tra i valori di un intervallo: `Number("")` è 0, e la lezione non lo dice.
- `biglietti.value < 1` senza `Number()` come distrattore: il confronto converte da solo, e la condizione funziona.
- Gli attributi `required`, `min`, `max`, `type="email"`: il browser farebbe i suoi controlli prima di `submit`.
- Messaggi più lunghi di 19 caratteri nel livello 4 e di 24 nel livello 3: escono dalle 42 colonne.
- `alert()`; messaggi come "Errore" o "Campo non valido", che la lezione sconsiglia.
