# Note: Controllare i dati di un modulo

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Pagine web interattive", gruppo 14). Non pubblicata.

## Struttura

Apertura con il modulo di iscrizione al concerto; leggere i campi; i quattro tipi di controllo; il messaggio accanto al campo; fermare l'invio; perché il server deve ripetere i controlli; due esercizi.

- Pagine da modificare: 2 (il riepilogo che segue quello che scrivi; il modulo completo con tre campi), più 2 esercizi.
- Figura interattiva: 1. Tabella: 1. Riquadri `ad-warning`: 2 (confrontare i campi invece dei valori, i controlli in fila con `&&`); `ad-note`: 1 (i controlli dell'HTML vengono prima).

## Confini con le lezioni vicine

- La 91 (gruppo 11) ha `form`, `label`, i tipi di `input`, `name`, `required` e gli altri controlli dell'HTML: qui sono dati per fatti, e un riquadro dice in che ordine lavorano con lo script.
- La 97 ha selezione, `textContent`, `classList`, eventi e ascoltatori. Qui arrivano `value`, `checked`, il parametro `event`, `preventDefault()`, e gli eventi `input`, `change` e `submit`.
- Il lato server è solo nominato: che cosa fa un programma sul server è del quinto anno, e non è linkato.

## Scelte

- I campi delle pagine non hanno `required` né `type="email"`, e il campo dell'email è un campo di testo: così ogni controllo passa dallo script e lo studente vede il suo messaggio. La lezione lo dice nel riquadro.
- La forma di un'email si controlla con `includes("@")`. Le espressioni regolari non sono nominate.
- La forma di un numero si controlla con `Number.isInteger(n)` e l'intervallo: `isInteger` scarta i decimali e quello che non è un numero; il campo vuoto (che per `Number` vale 0, un intero) lo ferma `n < 1`. La prima stesura della lezione attribuiva anche il vuoto a `isInteger`: corretto dalla revisione del lotto.
- Una funzione per campo, che restituisce vero o falso, e una funzione `segnala` che scrive o cancella il messaggio. L'id dello `span` del messaggio è `errore-` più l'id del campo.
- I risultati dei controlli stanno in tre costanti e si combinano dopo: il riquadro sull'`&&` spiega perché.
- La pagina completa controlla ogni campo anche sull'evento `change`. È una pratica corretta, e serve anche a un'altra cosa: oggi nell'anteprima dell'editor il clic su un bottone di invio non fa nascere l'evento `submit` (vedi "Da verificare"), e senza `change` la pagina sembrerebbe ferma.
- Negli esercizi la soluzione usa una variabile `valido` e una `messaggio`, senza funzioni di appoggio: è più lunga ma è quella che uno studente scrive.
- Nel programma di partenza dei due esercizi la funzione chiama `event.preventDefault()` sempre: così il programma di partenza non supera nessun controllo (un modulo che parte con i dati giusti è quello che il browser fa da solo), e lo studente deve spostare la chiamata dove serve.
- Gli esercizi sono due e non tre, per restare sotto le 400 righe: `checked` è spiegato nel testo ma non ha un esercizio.

## Elementi interattivi

- Pagina del riepilogo: che cosa cambia in `length` se tolgo `trim()` e scrivo degli spazi davanti al nome?
- `inf-modulo-percorso-dato` (`ModuloPercorsoDato.tsx`): che strada fa quello che scrivo nel campo prima di diventare un messaggio o un invio, e quale controllo ferma tre spazi? Lo studente scrive nel campo o sceglie uno di quattro valori, e segue le tappe: valore letto, `trim()`, controllo sul vuoto, controllo sulla lunghezza, esito.
- Pagina del modulo completo: che cosa vede chi compila con un campo sbagliato, e che cosa succede togliendo `preventDefault()`?
- Due esercizi con i controlli sul comportamento (`> scrivi`, `> invia form`, `inviato`, `non inviato`, `testo =`).

## Domande per Andrea

- Il controllo dell'email si ferma alla chiocciola. Vuoi qualcosa di più (un punto dopo la chiocciola), o va bene così perché il controllo vero lo fa il server?
- `Number.isInteger()` è una funzione in più da ricordare. Preferisci solo `n < 1 || n > 4`, accettando che `2.5` passi?
- Va bene che i campi non abbiano `required`, per far lavorare lo script, o preferisci pagine con tutti e due i controlli e `novalidate` sul `form`?
- La parola "validazione" compare una volta, come traduzione di validation, e poi si dice sempre "controllo". Va bene?

## Da verificare

- Nell'anteprima dell'editor il modulo sta in una cornice che non lascia partire i moduli (attributo `sandbox` senza `allow-forms`): con un browser basato su Chromium, premendo il bottone di invio l'evento `submit` non nasce, e l'ascoltatore non viene chiamato. "Verifica" funziona, perché le azioni `invia` e `clic` fanno nascere l'evento per conto loro. Finché non viene corretto, nella pagina del modulo completo lo studente vede i messaggi solo attraverso `change`, e negli esercizi solo premendo "Verifica". Provato il 7 ottobre 2026 con Playwright (Chromium).
- L'azione `scrivi` dei controlli toglie gli spazi intorno al testo: un controllo non può scrivere tre spazi in un campo, quindi nessun esercizio verifica `trim()` da solo.
- `value` di un campo `type="number"` è la stringa vuota quando quello che è scritto non è un numero: è il comportamento descritto dallo standard HTML, da ricontrollare.
- L'ordine "prima i controlli dell'HTML, poi l'evento `submit`": HTML Living Standard del WHATWG, algoritmo di invio di un modulo. Da ricontrollare.

## Verifiche

- `check.mts`: nessun errore, nessun avviso. `verifica.mts`: avvisi attesi (pagine web).
- Nel browser (Playwright, 1280 e 390 px): tutte le pagine eseguite; la prima pagina provata scrivendo nei campi; i due esercizi con "Verifica" sul codice di partenza (bocciato), sulla soluzione (superato) e su sei risposte sbagliate scritte apposta.

Prerequisiti proposti: inf-dom-eventi, inf-html-moduli, inf-stringhe

## Revisione del lotto (7 ottobre 2026)

- Il concerto è "di beneficenza", come nella 96 (biglietti a 8 euro). Il riquadro sui controlli dell'HTML dice che `type="number"` fa eccezione. Tolta la riga `preventDefault()`, sotto l'anteprima compare la riga con i dati inviati: la lezione lo dice. Il link sul colore rosso porta alla 95 come "pagina accessibile", perché la 95 parla di contrasto e non di chi non distingue i colori.
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
