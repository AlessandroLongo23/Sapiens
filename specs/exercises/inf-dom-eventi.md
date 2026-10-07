# inf-dom-eventi: il DOM e gli eventi

Esercizi della lezione 97, `docs/lezioni/informatica/riscritte/97-inf-dom-eventi.md`. Cinque livelli, tutti a scelta
multipla con quattro opzioni.

Sotto la domanda c'è sempre un pezzo di pagina e il suo script, nello stesso frammento: l'HTML, una riga vuota, la
riga `// script.js`, lo script. La domanda dice che lo script è collegato con `defer`. La risposta giusta la calcola
il generatore dai suoi parametri; il controllo Python costruisce la pagina da `params.html`, esegue `params.script`
con l'interprete di `scripts/exercises/checkers/_inf_g14.py`, fa partire gli eventi e legge la pagina.

Convenzioni: `querySelector`, `querySelectorAll`, `addEventListener`, mai `onclick` nell'HTML, `const` e `let`,
rientro di 4 spazi. Una dichiarazione troppo lunga per una riga va su due (`const x =` e sotto la chiamata) o su tre
(l'argomento su una riga sua); la registrazione di un ascoltatore su due righe, con `.addEventListener` a capo.

## Livelli

1. **Quale elemento prende il selettore.** La pagina ha un titolo, un paragrafo con una classe, un elenco con un id
   e tre o quattro voci, alcune con una classe (che metà delle volte è anche quella del paragrafo). Tre casi.
   `primo` (8 su 20): `querySelector` con un selettore che trova almeno un elemento (`li`, `.bis`, `#scaletta li`,
   `#scaletta .bis`, `p`, `ul .bis`, `#scaletta`, `ul`); la risposta è il primo nell'ordine della pagina, detto con
   il suo tag e il suo testo. Distrattori: l'ultimo che corrisponde, "tutti gli elementi che corrispondono", `null`,
   un elemento vicino.
   `null` (5 su 20): un selettore che non trova niente, per gli errori del riquadro della lezione: il nome senza
   cancelletto o senza punto, il cancelletto su una classe, il punto su un id, l'id scritto diverso, un tag che non
   c'è. Distrattori: l'elemento che lo studente si aspettava, la prima voce, il paragrafo.
   `quanti` (7 su 20): `querySelectorAll(...)` e `console.log(voci.length)`; una volta su cinque il selettore non
   trova niente e la risposta è 0. Distrattori: 1, tutte le voci, tutti gli elementi con la classe.
   Esempio: `document.querySelector("scaletta")` → `null`.
2. **Che cosa cambia nella pagina.** Lo script lavora una volta, senza eventi. Tre casi.
   `classi` (metà): tre voci con le classi `brano` e, alcune, `bis` (o `top`); tre righe con `classList.add`,
   `remove` o `toggle`, due sulla voce chiesta e una su un'altra. Domanda: quali classi ha alla fine quella voce.
   Opzioni: le quattro combinazioni delle due classi.
   `sostituisce` (un quarto): `brani[i].textContent = "..."` con i da 1 in su; domanda: com'è l'elenco alla fine.
   Distrattori: sostituita la voce prima (chi conta da 1), la voce aggiunta in fondo, l'elenco invariato.
   `conta` (un quarto): `brani.length` scritto in uno `span`; distrattori: tutte le voci al posto di quelle con la
   classe, il punto interrogativo rimasto, uno in più.
3. **Dopo il clic.** Un solo ascoltatore di `click`, da 1 a 8 clic. Tre casi.
   `conta` (3 su 10): una variabile fuori dalla funzione che cresce di 1, 2 o 5 a ogni clic.
   `limite` (4 su 10): il contatore con `if (n < 4)` o `if (n > 0)`; metà delle volte i clic superano il limite.
   `classe` (3 su 10): `classList.toggle("nascosto")`, oppure `remove` o `add`, su un elenco che parte con o senza
   la classe; domanda: quali classi ha l'elenco alla fine.
   Distrattori: il valore senza il limite, un clic in meno, il numero dei clic, il valore iniziale.
4. **Registrare un ascoltatore.** Diciotto coppie di elemento e funzione (bottoni con `click`, campi con `input`).
   `quale` (8 su 20): lo script seleziona l'elemento e definisce la funzione; le opzioni sono quattro istruzioni da
   aggiungere in fondo. Distrattori: `mostra()` con le parentesi, i due argomenti scambiati, `"onclick"` come nome
   dell'evento, il nome della funzione tra virgolette, `mostra.addEventListener("click", bottone)`.
   `funziona`, `subito`, `errore`, `mai` (3 su 20 ciascuno): lo script è completo, scritto bene o con un errore, e
   la domanda è che cosa succede premendo due volte. Le quattro opzioni sono sempre le stesse: la funzione viene
   chiamata a ogni clic; viene chiamata subito, una volta, e poi niente (le parentesi); lo script si ferma con un
   errore (selettore senza cancelletto, con il punto, o con l'id scritto diverso: `addEventListener` su `null`);
   nessun errore ma la funzione non viene mai chiamata (`"onclick"`).
5. **Creare elementi.** `createElement`, `textContent` con un testo più un numero, `append`. Tre casi.
   `ciclo` (7 su 20): un `for` che aggiunge da 2 a 4 voci a un elenco che ne ha già da 1 a 3.
   `clic` (7 su 20): una voce a ogni clic, da 2 a 5 clic, su un elenco vuoto o con una voce.
   `senza` (6 su 20): come i primi due, ma senza la riga con `append`: le voci non compaiono.
   Domanda: quante voci ha l'elenco alla fine, oppure qual è il testo dell'ultima. Distrattori: solo le voci nuove,
   solo quelle dell'HTML, una in più, il testo con il numero sbagliato o con il nome della variabile.

## Vincoli

- Quattro opzioni diverse, una giusta.
- Righe di al più 42 caratteri sotto la domanda e 34 nelle opzioni; al più 18 righe sotto la domanda.
- `params.html` e `params.script` sono le due parti del frammento mostrato. Livello 1: `params.selector`. Livelli
  2, 3 e 5: `params.read` dice che cosa leggere nella pagina (`what`: `text`, `classes`, `count`, `last`, `list`;
  `selector`; `index`) e `params.clicks` su quale bottone e quante volte premere. Livello 4: `params.event`
  (`selector`, `type`) e `params.fn`.
- Livello 1: l'opzione di un elemento vale `tag:testo`, quella dell'elenco `ul#id`; i testi della pagina sono tutti
  diversi.
- Livello 4, caso `quale`: aggiunta in fondo allo script, solo l'istruzione giusta fa chiamare la funzione zero
  volte alla partenza e una volta per ogni evento.
- Le quote dei casi sono in `CASE_RANGES` del controllo.

## Da evitare

- `onclick` nell'HTML o come proprietà; `innerHTML`; `style` (la lezione preferisce le classi).
- Un selettore con `>`, `,` o pseudo-classi: la lezione usa tag, classe, id e discendente.
- Chiedere `textContent` dell'elenco intero, che contiene anche gli a capo dell'HTML.
- Il limite nel caso `clic` del livello 5: il frammento supererebbe le 18 righe.
