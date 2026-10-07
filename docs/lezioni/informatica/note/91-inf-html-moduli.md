# Note: I moduli

Lezione nuova, scritta da zero il 7 ottobre 2026 (terzo anno, capitolo "Il linguaggio HTML", gruppo 11), insieme alla
90 su elenchi e tabelle. Non pubblicata. 344 righe: 5 pagine da modificare (3 di esempio, 2 esercizi), 1 figura
interattiva, 5 riquadri `ad-warning`.

## Struttura

Apertura con l'iscrizione al concerto del 5 giugno; `<form>`, `<input>`, `<label>` con `for` e `id`, il bottone; i
tipi di `<input>` in una tabella, `<select>` e `<textarea>`; che cosa viene inviato (le coppie di `name` e valore, e
i quattro casi in cui un campo non parte o parte con il `value`); GET e POST; `required` e gli altri controlli
dell'HTML, con il rimando alla 98; due esercizi.

## Che cosa succede davvero nell'anteprima quando si invia un modulo

Provato il 7 ottobre 2026 in Chromium (Playwright), sulla pagina della lezione.

- Aggiornato dalla revisione del lotto, lo stesso 7 ottobre, dopo la correzione dell'anteprima: premendo il bottone
  di invio il browser fa la sua convalida (con un campo `required` vuoto il messaggio compare accanto al campo e il
  modulo non parte) e l'evento `submit` nasce. Se nessuno lo ferma, la pagina resta dov'è e la console sotto
  l'anteprima scrive, per esempio, "Modulo inviato con il metodo POST a /iscrizione: nome=Anna,
  email=anna@scuola.example. Nell'anteprima i dati si fermano qui." Provato a mano sulla prima e sulla terza pagina
  della lezione.
- La lezione ora lo dice così: dopo la prima pagina fa compilare e inviare, e fa leggere la riga della console;
  nella sezione sui controlli fa premere il bottone con i campi vuoti (messaggio del browser, niente invio) e di
  nuovo quando nessun campo è rosso. Le due frasi di prima ("non succede niente", "il modulo non parte in nessun
  caso") sono state tolte.
- Il messaggio del browser è nella lingua del browser: in Chromium senza interfaccia è in inglese ("Please fill out
  this field"), sul computer di uno studente sarà in italiano.
- Per far vedere tutti i campi sbagliati insieme, e non solo il primo, la pagina della sezione "I controlli del browser" ha un `style.css` di una
  riga, `input:invalid { border: 2px solid red; }`: il bordo dice in ogni momento che cosa il browser rifiuterebbe.
  Verificato: all'inizio nome ed email rossi; nome normale alla prima lettera; email rossa con `anna` e con `anna@`,
  normale con `anna@esempio.it`; posti rossi con 5 e normali con 4.
- I controlli `%% controllo` con `> invia form` funzionano: `web-checks.ts` dà lui l'evento `submit` quando i campi
  sono validi, e la regola `form | inviato` (o `non inviato`) legge quello.
- Il clic su un'etichetta porta il cursore nel suo campo anche nell'anteprima (verificato), i pallini con lo stesso
  `name` si spengono a vicenda (verificato), e in un campo `number` le lettere battute non entrano (verificato).
- Non provato in Firefox e in Safari.

## Scelte

- Confine con la 98: qui solo quello che fa l'HTML (`required`, `min`, `max`, `minlength`, `maxlength`, il tipo
  `email`). `pattern`, i messaggi personalizzati, il confronto tra due campi e `preventDefault` sono della 98; l'avviso
  finale dice perché il controllo del browser non basta, in tre righe, e rimanda là.
- Confine con la 36: GET e POST sono già nominati là ("la più comune comincia con GET … il browser usa POST"). Qui si
  dice dove finiscono i dati nei due casi e quando si usa l'uno e l'altro; intestazioni e codici di stato non
  compaiono. "Corpo della richiesta" è spiegato in una riga, perché la 36 non lo nomina.
- La codifica dell'indirizzo: una riga sola (la chiocciola diventa `%40`, lo spazio `+`), perché la figura la mostra
  e lo studente la vedrebbe senza spiegazione.
- Ogni riga del modulo è un `<p>` con etichetta e campo, per non avere bisogno di un foglio di stile. `<fieldset>` e
  `<legend>` per il gruppo di pallini non ci sono: la domanda "chi sei?" resta senza un'etichetta sua.
- L'etichetta è sempre legata con `for` e `id`; il `<label>` che racchiude il campo non è mostrato.
- `placeholder` compare solo in un avviso, come errore (usato al posto dell'etichetta).
- `value` ha due sensi, e la lezione li dice tutti e due: valore di partenza su un campo in cui si scrive, valore
  spedito su casella, pallino e opzione. L'attributo `checked` e `selected` non ci sono.
- "Pallino" per il campo `radio` e "casella" per `checkbox`: parole nostre, da confermare.
- Il bottone è sempre `<button type="submit">`; `<input type="submit">` e `type="reset"` non ci sono.
- Negli esercizi i controlli sul comportamento hanno prima una regola sull'attributo (`#nome | attributo required`) e
  poi quella sull'invio: se l'attributo manca lo studente legge "non ha l'attributo required" e non il messaggio di
  `non inviato`, che parla di `preventDefault()` ed è scritto per la 98.

## Elementi interattivi

- Pagina "Iscrizione al concerto" (`codice html`). Domanda: che cosa lega un'etichetta al suo campo? Il testo dice
  di fare clic su "Email", poi di togliere `for`.
- Pagina con tutti i tipi di campo (`codice html`). Domanda: perché di due pallini ne resta acceso uno solo? Il
  testo dice di cambiare il `name` del secondo.
- Figura `inf-html-modulo-inviato` (kit, `ModuloInviato.tsx`). Domanda: di quello che scrivi in un modulo, che cosa
  parte davvero, con che nome, e dove viaggia con GET e con POST? Un campo senza `name` e una casella: le coppie
  compaiono mentre si compila, e la richiesta si riscrive passando da `get` a `post`.
- Pagina dei controlli (`codice html` con `css`). Domanda: quali valori il browser rifiuterebbe? Il bordo rosso
  risponde mentre si scrive.
- Due esercizi con `%% controllo`, con azioni (`scrivi`, `spunta`, `invia`) e regole sul comportamento (`inviato`,
  `non inviato`, `non spuntato`).

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e flashcard (20 carte).
- `verifica.mts`: due pagine, i controlli si provano nel browser (avviso atteso).
- Nel browser (Chromium), a 1280 e a 390 px, in chiaro e in scuro: nessuna immagine mancante, nessuno scorrimento
  laterale; in console solo i messaggi "Blocked form submission" quando un controllo invia il modulo.
- Ogni esercizio verificato con la pagina di partenza, con la soluzione, con la soluzione riscritta a mano e con
  risposte sbagliate: `for` diverso dall'`id`, email senza `name`, campo email di tipo `text`, nome senza `name`;
  nome non obbligatorio, `min` mancante, `max="40"`, pallini con `name` diversi, `min="3"`. Ogni errore fa fallire il
  controllo giusto.
- La figura è stata guardata a 800, 390 e 330 px, in chiaro e in scuro, in sette stati (get, post, casella spuntata,
  valori lunghi con spazi e accenti, campi vuoti, tastiera); la funzione che scrive le coppie è confrontata con
  `URLSearchParams` nei test (`tests/unit/informatica-modulo-inviato.test.mjs`).

## Da verificare

- La forma delle coppie (`application/x-www-form-urlencoded`: spazio in `+`, chiocciola in `%40`) e le regole su che
  cosa parte (campo senza `name`, casella non spuntata, `value` di pallini e opzioni): HTML Living Standard, WHATWG,
  "Form submission" e "Constructing the entry list"; URL Standard, WHATWG, "application/x-www-form-urlencoded".
  Scritte a memoria e confrontate con `URLSearchParams` di Node, non rilette sulla norma in questa sessione.
- "Un modulo senza `method` usa `get`": è il valore predefinito dell'attributo nella stessa norma.
- La tabella dei tipi dice "di solito": l'aspetto di `date` e di `number` cambia da browser a browser (in alcuni un
  campo `number` lascia battere le lettere e poi lo segna come non valido). Visto solo in Chromium.
- "Un campo `email` vuole una chiocciola con qualcosa prima e dopo": il controllo dei browser è poco severo
  (`anna@x` passa). La lezione non dà una regola più precisa.
- "Lo screen reader legge l'etichetta quando si entra nel campo": non provato con uno screen reader.

## Domande per Andrea

- `<fieldset>` e `<legend>` per i gruppi di pallini: qui, nella 95 con l'accessibilità, o da nessuna parte?
- "Pallino" e "casella" per `radio` e `checkbox`: vanno bene, o in classe dici "pulsante di opzione" e "casella di
  controllo"?
- GET e POST: bastano queste righe, o vuoi vedere la richiesta intera, con le intestazioni?
- La codifica dell'indirizzo (`%40`, `+`): una riga è giusta, è troppo, o merita un riquadro?
- `pattern` è nel programma del terzo anno? Qui non c'è; il gruppo 14 decide per la 98.
- I due sensi di `value` sono detti in due punti diversi della lezione: serve un riquadro che li metta insieme?

Prerequisiti proposti: inf-html-struttura, inf-html-testo-link, http-html

## Revisione del lotto (7 ottobre 2026)

- "Porta i posti a 5 con le freccette" è diventato "Scrivi 5": con `max="4"` le freccette si fermano a 4. "Screen reader" è diventato "lettore di schermo".
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
