---
stato: decisa
aggiornato: 2026-10-04
tag: [decisione, informatica, sicurezza]
---
# I programmi dell'editor girano in un iframe senza l'origine del sito

## Decisione
I programmi dell'[[Editor di codice]] girano in un iframe con `sandbox="allow-scripts"`, che ha un'origine sua e una policy che gli lascia raggiungere solo i file dei linguaggi. In più il server rifiuta ogni richiesta di scrittura che non arriva da una pagina del sito.

## Perché
Alessandro ha chiesto se fosse rischioso eseguire codice nel browser. C e C++ non lo sono: il programma è WebAssembly e vede solo le funzioni di `wasi.ts`. Python sì: Pyodide espone il modulo `js`, e il worker girava sulla nostra origine.

Il 3 ottobre 2026 la prova lo ha confermato. Un programma Python di quindici righe, eseguito nell'editor da un utente di prova con l'accesso fatto, ha letto `/api/me` (id, email, piano) e ha creato un quaderno nello Zaino con una POST a `/api/zaino/quaderni`.

Finché il codice lo scrive lo studente il danno è a se stesso. Diventa un problema quando il codice arriva da un altro: un compagno che dice "incolla questo", e in futuro un link condivisibile o codice salvato e condiviso.

Alternative scartate:
- togliere `fetch`, `XMLHttpRequest` e simili dal worker prima di eseguire: alza l'asticella ma non è un confine, e restano la cache del service worker e IndexedDB, che un worker della nostra origine può scrivere;
- un dominio separato per l'esecuzione: è un confine vero, ma chiede un secondo progetto e un secondo dominio da tenere allineati.

## Conseguenze
- Dopo la patch lo stesso programma stampa `origine: null` e le due richieste sono bloccate; nessun quaderno viene creato. La prova è in `tests/e2e/codice.spec.ts`.
- Con la policy dell'iframe tolta apposta, WebKit mandava comunque il cookie di sessione dall'iframe e il quaderno veniva creato: per WebKit un iframe senza origine dentro una nostra pagina resta "stesso sito". Da qui il controllo dell'intestazione `Origin` in `src/proxy.ts`, che vale per tutto il sito e non solo per l'editor.
- Gli script dell'iframe si costruiscono con esbuild (`scripts/codice/sandbox.mjs`), nuova dipendenza di sviluppo, perché Next non può compilarli per una pagina che non è del sito.
- I file dei linguaggi restano nella cache del browser anche dentro l'iframe: alla seconda visita Chromium, WebKit e Firefox li riconfermano con una risposta 304.
- Le funzioni che portano codice da uno studente a un altro (link condivisibile, codice nello Zaino, consegne) ora si possono costruire senza aprire questo buco.
- Aggiornata la nota [[Editor di codice]].

## Collegamenti
- [[Editor di codice]], [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]
- [[2026-10-04 Isolamento dell'editor di codice]]
