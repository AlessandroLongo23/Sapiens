---
stato: rilasciata
release: da decidere
aggiornato: 2026-10-04
tag: [prodotto, studenti, informatica, lezioni, esercizi]
---
# Editor di codice

Un editor con il tasto Esegui dentro le lezioni e gli esercizi di informatica: lo studente scrive un programma in Python, C o C++ e lo fa girare nel browser, senza installare nulla.

## Stato attuale
In produzione dal 3 ottobre 2026 (PR #30). Lo strumento è a `/strumenti/editor-di-codice`, nella categoria Informatica dell'indice degli strumenti: pagina in `src/app/(site)/strumenti/editor-di-codice/page.tsx` e `src/components/codice/EditorPage.tsx`, articolo in `src/content/strumenti/editor-di-codice.md`, voce in `src/lib/tools/registry.ts`. Nelle lezioni lo monta un blocco `codice`; nessuna lezione pubblicata ne ha ancora uno, perché la programmazione comincia al secondo anno. I blocchi si provano in sviluppo con `/prova-grafico/lezione?file=prove/codice.md`.

### I tre linguaggi
- **Python:** Pyodide 314.0.7 (CPython 3.14 in WebAssembly) in un Web Worker, `src/components/codice/python.worker.ts`. La parte in Python sta in `public/codice/`: `sapiens.py` esegue il programma, `turtle.py` è la tartaruga, `sapiens_grafici.py` è il backend di matplotlib.
- **C e C++:** Clang 22 in WebAssembly (`@yowasp/clang`, licenza ISC). Il compilatore sta in un worker che resta caricato (`clang.worker.ts`); ogni programma compilato gira in un worker suo (`wasi.worker.ts`, con il motore in `wasi.ts`), così un ciclo che non finisce si ferma senza perdere il compilatore. Il WASI è scritto da noi: i tre flussi standard, l'orologio, i numeri casuali, l'uscita. Gli argomenti di Clang sono in `clang-args.ts`: C17, C++20, `-Wall`, senza ottimizzazione.
- **Limite del C++:** non ha le eccezioni, perché la libreria C++ di questo compilatore è costruita senza. `try`, `catch` e `throw` sono errori di compilazione, e l'editor lo dice in italiano. Classi, ereditarietà, libreria standard e puntatori funzionano.
- Un'interfaccia sola per i tre (`runtime.ts`), e un solo motore per linguaggio in tutta la pagina (`runtimes.ts`): una lezione con cinque programmi carica Python una volta.

### Dove gira un programma
Dal 4 ottobre 2026 i programmi non girano più nella pagina del sito ma in un iframe isolato, perché un programma Python eseguito sulla nostra origine poteva agire sul sito con la sessione di chi lo eseguiva (vedi [[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]]).

- **La pagina** (`sandbox.ts`) crea un iframe nascosto con `sandbox="allow-scripts"`, gli manda il programma e riceve quello che stampa. `runtimes.ts` dà all'editor questi due motori al posto di quelli veri.
- **L'iframe** è la rotta `src/app/codice-sandbox/route.ts`. Ha un'origine sua (`null`): niente cookie leggibili, niente archivi del browser, niente service worker. La sua Content Security Policy lascia raggiungere solo `/codice/`, `/pyodide/` e `/clang/`, e i worker la ereditano. `next.config.ts` esclude questa rotta dalle intestazioni di sicurezza del resto del sito, che altrimenti sostituirebbero le sue.
- **Dentro l'iframe** (`sandbox-host.ts`) stanno i motori veri (`python.ts`, `clang.ts`) e i loro worker. Un worker parte da una riga creata sul posto che importa lo script dal sito (`sandbox-worker.ts`): Chrome non avvia worker di tipo modulo in una pagina senza origine.
- **Gli script dell'iframe** non li compila Next: `scripts/codice/sandbox.mjs` li costruisce con esbuild in `public/codice/sandbox/` (in `.gitignore`), dopo ogni `npm install` e prima di `next dev` e `next build`. Chi modifica i worker con il server di sviluppo acceso usa `node scripts/codice/sandbox.mjs --watch`.
- **I file dei linguaggi** hanno `Access-Control-Allow-Origin: *`, perché l'iframe li legge da un'altra origine.
- **Sul server** `src/proxy.ts` rifiuta con 403 ogni richiesta che modifica qualcosa (tutto tranne GET, HEAD, OPTIONS) se la sua intestazione `Origin` non è il sito. Serve perché WebKit manda il cookie di sessione anche dall'iframe isolato: lì la policy dell'iframe è la prima difesa e questa è la seconda. Le richieste senza `Origin` (webhook di Stripe, script) passano.

### Da dove arrivano i file
Tutto dal nostro sito, niente CDN mentre lo studente usa la pagina: l'indirizzo dello studente non va a terzi. La Content Security Policy di `next.config.ts` è cambiata solo per permettere al sito di mettere in un iframe una propria pagina (`frame-src 'self'`). Due script girano dopo ogni `npm install` (`postinstall`), e le due cartelle sono in `.gitignore`:
- `scripts/codice/pyodide.mjs` copia Pyodide in `public/pyodide/` (13,5 MB) e scarica una volta da jsDelivr i 12 pacchetti di numpy e matplotlib (13,3 MB), controllati con gli hash del file di lock;
- `scripts/codice/clang.mjs` copia il compilatore in `public/clang/` (105 MB su disco, 20 MB in rete con Brotli).

Ogni linguaggio si scarica al primo clic nell'editor o al primo Esegui, mai con la pagina.

### Cosa fa l'editor
- **Editor:** CodeMirror 6 (`Editor.tsx`), con i colori di Dark Modern di VS Code nel tema scuro e di Light Modern in quello chiaro, letti dal tema installato in Cursor (`theme.ts`); parentesi colorate per profondità; rientro di quattro spazi; Ctrl+Invio o ⌘+Invio esegue.
- **Console e tasti:** `Workbench.tsx`. Esegui, Ferma, Ripristina (rimette il programma di partenza), e negli esercizi Verifica e Soluzione.
- **Leggere dalla tastiera** (`input()`, `scanf`, `cin`): la risposta si scrive nella console, nel punto in cui il programma la chiede. Vedi "Dettagli".
- **Errori:** in Python il traceback mostra solo le righe del programma dello studente. In C e C++ i messaggi sono quelli di Clang, con riga e colonna; gli errori durante l'esecuzione (divisione per zero, memoria fuori dai limiti, ricorsione senza fine) sono detti in italiano.
- **Programmi che non finiscono:** fermati dopo 10 secondi, o dopo 100.000 caratteri stampati, o 100.000 comandi della tartaruga, o dal tasto Ferma.
- **Librerie di Python:** tutta la libreria standard; numpy e matplotlib si caricano quando il programma le importa, prima che parta e fuori dal suo limite di tempo. `plt.show()` manda la figura nella console come immagine; una figura mai mostrata compare alla fine.
- **Tartaruga:** riscritta da noi (`public/codice/turtle.py` per la logica, `turtle.ts` e `TurtleCanvas.tsx` per il disegno), perché quella di Python dipende da Tk. Il programma finisce subito e la pagina rianima i comandi in un canvas sopra la console, con un tasto Salta. Tasti, clic e timer danno un errore che lo dice.

### Nelle lezioni
Un blocco `codice` nel markdown della lezione monta l'editor (`src/lib/codice/blocco.ts` legge il blocco, `src/lib/content/markdown.ts` lo pubblica come figura con il programma in testo, `src/lib/utils/code-figure.ts` ci mette l'editor quando la pagina ci arriva). Il formato è spiegato in `docs/lezioni/README.md`.
- Più blocchi di seguito in linguaggi diversi sono lo stesso programma: una linguetta per linguaggio, e la scelta vale per tutti i programmi e per le visite successive (`LessonCode.tsx`).
- Con le prove (`%% prova`, `%% stampa`) il blocco è un esercizio: Verifica esegue il programma su ogni prova e confronta l'uscita. Le prove si scrivono una volta e valgono per i tre linguaggi. Nelle prove di Python la domanda di `input("...")` non viene stampata.
- `%% soluzione` è il programma che supera le prove, dietro il tasto Soluzione.

### Controlli
- `scripts/lezioni/check.mts` legge i blocchi `codice` e segnala quelli scritti male.
- `scripts/codice/verifica.mts` esegue davvero le soluzioni sulle loro prove, nei tre linguaggi, in Node con lo stesso Python e lo stesso Clang del sito; avvisa se il programma di partenza supera già tutte le prove.
- `tests/unit/codice.test.mjs`: 10 prove sul formato del blocco e sul motore Python.
- `tests/e2e/codice.spec.ts`: 16 prove nel browser, due delle quali sull'isolamento: un programma Python eseguito da uno studente che ha fatto l'accesso prova a leggere `/api/me` e a creare un quaderno, e non deve riuscirci; il server rifiuta una scrittura con `Origin` diversa dal sito. Le altre 14: Il 3 ottobre 2026 passano su Chromium, WebKit, Firefox, iPhone e Pixel emulati, in sviluppo e contro la build di produzione (dove la prova del blocco nelle lezioni viene saltata, perché la pagina di prova esiste solo in sviluppo), e su quattro motori contro il sito pubblicato.

Non provato: un telefono vero, un computer di scuola, una rete lenta.

### Cosa ha mostrato la produzione
- Il service worker del sito (`public/sw.js`) rispondeva dalla cache al file da cui parte un web worker, e così il secondo worker di una pagina eseguiva il codice del primo. Ora quei file vanno alla rete. Vale per ogni worker futuro del sito.
- Il worker che esegue un programma compilato dice quando è pronto prima di ricevere il programma.
- Su Vercel il compilatore viaggia compresso in 21 MB, più 4 MB di intestazioni e librerie. Con la rete vera un programma C++ parte in 10-15 secondi la prima volta.

## Obiettivo
Da discutere. Quello che c'è nel codice è la proposta di Claude del 3 ottobre 2026, costruita su mandato di Alessandro: l'editor nelle lezioni e negli esercizi, con la correzione su ingresso e uscita. Non un IDE con file, progetti e terminale.

## Dettagli
**Perché leggere dalla tastiera riesegue il programma.** Un worker può fermarsi ad aspettare la tastiera solo con SharedArrayBuffer, che chiede l'isolamento cross-origin di tutta la pagina. In Next la navigazione tra le pagine non ricarica il documento, quindi l'isolamento andrebbe messo su tutto il sito, dove può rompere i riquadri di Stripe e gli embed. Il prototipo fa in un altro modo: quando il programma chiede una riga che nessuno ha ancora scritto, si ferma; scritta la riga, riparte dall'inizio con tutte le righe scritte fino a lì. Il seme dei numeri casuali è lo stesso per tutta l'esecuzione, e in C e C++ anche l'ora del giorno resta ferma al primo avvio (così `srand(time(0))` dà gli stessi numeri). Quello che la console mostra già non viene rimandato, e in C e C++ il programma compilato si riusa.

Limiti noti di questa scelta:
- un programma lento prima di una lettura rifà il lavoro a ogni risposta;
- in Python un programma che dipende dall'ora (`time`, `datetime`) può comportarsi in modo diverso tra una ripetizione e l'altra;
- in Python un `except:` senza tipo cattura anche il segnale di attesa, e il programma finisce nel limite di stampa o di tempo;
- in Python `sys.stdin` non è collegato, funziona solo `input()`.

**Tempi misurati** il 3 ottobre 2026 su un Mac, con il server di sviluppo in locale: sono in [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]. In breve, un programma C++ nuovo compila ed esegue in circa 2,5-3 secondi, uno in C in 1-2, Python parte in 1,3.

**Firefox** chiama JavaScript da Python più lentamente: per questo il testo stampato si raccoglie dentro Python e si manda ogni 30 millisecondi.

Alessandro, 3 ottobre 2026: numpy e matplotlib vanno messi; la tartaruga si ricrea, perché logica e disegno sono molto semplici.

**Dipendenze aggiunte:** `pyodide`, `@yowasp/clang`, `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language`, `@codemirror/autocomplete`, `@codemirror/lang-python`, `@codemirror/lang-cpp`, `@lezer/highlight`.

## Domande aperte
- Java: nel browser c'è CheerpJ (licenza commerciale da verificare), altrimenti serve un servizio sul server. Da decidere quando si arriva alla programmazione a oggetti del quarto anno.
- Come si scrivono per tre linguaggi le 44 lezioni di programmazione dell'albero. Le linguette coprono il codice; il testo attorno (tipi, puntatori, memoria) cambia da linguaggio a linguaggio.
- Gli esercizi di programmazione dentro il percorso a livelli di [[Esercizi]] (tentativi salvati, correzione sul server, memoria). Oggi la verifica avviene nel browser e non lascia traccia: il server non può controllare un programma senza eseguirlo.
- Le eccezioni in C++: servirebbe una libreria C++ costruita con le eccezioni di WebAssembly.
- La compilazione del C++ si può accorciare con un'intestazione precompilata per `<iostream>`: da provare se sui computer di scuola i 2,5 secondi diventano troppi.
- Il peso sui telefoni veri (il compilatore è un modulo da 75 MB) e sui computer di scuola: da misurare. Se non regge, C e C++ restano da computer, in linea con [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]].
- Le intestazioni di cache per `/pyodide/` e `/clang/`: oggi il browser riconferma i file a ogni caricamento. Con un indirizzo che porta la versione si possono tenere in cache per sempre.
- `public/pyodide/`, `public/clang/` e `public/codice/` passano dal proxy (`src/proxy.ts`) come ogni indirizzo non escluso: da escludere prima di pubblicare.
- HTML e CSS (terzo anno) e SQL (quarto anno): un iframe isolato e SQLite in WebAssembly, secondo Claude. Non discusso.
- I messaggi di errore in italiano, o una spiegazione accanto a quelli di Python e di Clang.
- Salvare il codice dello studente (nello Zaino, o per lezione).
- L'isolamento non limita la memoria: un programma può ancora far chiudere la scheda. Il limite di 10 secondi copre solo il tempo.
- Su Chromium non è stato verificato che cosa succede togliendo la policy dell'iframe (se il cookie parte o no): la prova non caricava Python. Su WebKit parte, su Firefox no.
- La tartaruga non ha `undo`, `clearstamp`, le forme registrate dallo studente né la modalità `logo`.
- La prova automatica del blocco nelle lezioni gira solo in sviluppo: serve una lezione pubblicata con un blocco `codice` per provarlo anche in produzione.

## Collegamenti
- Attori: [[Studente]]
- Note: [[Lezioni]], [[Esercizi]], [[Programma ministeriale]], [[Pipeline lezioni]]
- Decisioni: [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]], [[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]], [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]
- Sessioni: [[2026-10-03 Editor di codice]], [[2026-10-04 Isolamento dell'editor di codice]]
