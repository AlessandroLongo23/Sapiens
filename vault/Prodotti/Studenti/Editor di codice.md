---
stato: rilasciata
release: da decidere
aggiornato: 2026-10-04
tag: [prodotto, studenti, informatica, lezioni, esercizi]
---
# Editor di codice

Un editor con il tasto Esegui dentro le lezioni e gli esercizi di informatica: lo studente scrive un programma in Python, C, C++ o JavaScript, oppure una pagina web in HTML e CSS, lo fa girare nel browser senza installare nulla e lo salva tra i suoi programmi.

## Stato attuale
In produzione dal 3 ottobre 2026 (PR #30). Lo strumento è a `/strumenti/editor-di-codice`, nella categoria Informatica dell'indice degli strumenti: pagina in `src/app/(site)/strumenti/editor-di-codice/page.tsx` e `src/components/codice/EditorPage.tsx`, articolo in `src/content/strumenti/editor-di-codice.md`, voce in `src/lib/tools/registry.ts`. Nelle lezioni lo monta un blocco `codice`; nessuna lezione pubblicata ne ha ancora uno, perché la programmazione comincia al secondo anno. I blocchi si provano in sviluppo con `/prova-grafico/lezione?file=prove/codice.md`.

### I tre linguaggi
- **Python:** Pyodide 314.0.7 (CPython 3.14 in WebAssembly) in un Web Worker, `src/components/codice/python.worker.ts`. La parte in Python sta in `public/codice/`: `sapiens.py` esegue il programma, `turtle.py` è la tartaruga, `sapiens_grafici.py` è il backend di matplotlib.
- **C e C++:** Clang 22 in WebAssembly (`@yowasp/clang`, licenza ISC). Il compilatore sta in un worker che resta caricato (`clang.worker.ts`); ogni programma compilato gira in un worker suo (`wasi.worker.ts`, con il motore in `wasi.ts`), così un ciclo che non finisce si ferma senza perdere il compilatore. Il WASI è scritto da noi: i tre flussi standard, l'orologio, i numeri casuali, l'uscita. Gli argomenti di Clang sono in `clang-args.ts`: C17, C++20, `-Wall`, senza ottimizzazione.
- **Limite del C++:** non ha le eccezioni, perché la libreria C++ di questo compilatore è costruita senza. `try`, `catch` e `throw` sono errori di compilazione, e l'editor lo dice in italiano. Classi, ereditarietà, libreria standard e puntatori funzionano.
- Un'interfaccia sola per i tre (`runtime.ts`), e un solo motore per linguaggio in tutta la pagina (`runtimes.ts`): una lezione con cinque programmi carica Python una volta.

### JavaScript e le pagine web
Aggiunti il 4 ottobre 2026 (vedi [[2026-10-04 L'editor di codice ha anche JavaScript e le pagine web]]). Sono due cose diverse.

- **JavaScript come programma** (`javascript.worker.ts`, `javascript.ts`, `js-environment.ts`): un programma con la console, come Python. `console.log` stampa, `prompt()` legge dalla console con lo stesso meccanismo della riesecuzione, `alert()` scrive, `Math.random` ha il seme. Un errore dice la riga. Gira in un worker dell'iframe isolato, uno per esecuzione, e non scarica niente. Non ha `document`.
- **Pagina web** (`WebBench.tsx`; dal pomeriggio del 4 ottobre è un progetto, vedi "Progetti a più file"): tre file, `index.html`, `style.css` e `script.js`, con una linguetta ciascuno, e accanto la pagina che ne esce. Sotto l'anteprima c'è la console con i `console.log` e gli errori dello script, con la riga.
  - I file si collegano come in una pagina vera, con `<link rel="stylesheet" href="style.css">` e `<script src="script.js"></script>` (`web-assemble.ts`). Un file non collegato non viene applicato e una nota lo dice.
  - Senza script l'anteprima segue i tasti, mezzo secondo dopo l'ultimo. Con uno script aspetta "Esegui", così un `alert()` non si apre a ogni pausa.
  - L'anteprima è un secondo iframe isolato, la rotta `src/app/codice-sandbox/pagina/route.ts`, con il suo script `pagina.ts`. Lo script dello studente lì non può fare richieste di rete, inviare moduli o aprire link; le immagini `https` si vedono, `alert()` e `prompt()` sono quelli del browser.
  - Uno script di pagina gira nel thread della pagina, e un ciclo infinito bloccherebbe la scheda. `loop-guard.ts` legge lo script con il parser di CodeMirror e mette in ogni ciclo una chiamata che lo ferma dopo 2 secondi, senza spostare le righe.
- **Nelle lezioni** un gruppo di blocchi che comincia con `html` è una pagina; `javascript` da solo è un programma. L'esercizio di una pagina si corregge con `%% controllo`: una frase per lo studente e regole fatte di un selettore CSS e una condizione (`quanti`, `testo`, `attributo`, `stile`), eseguite sulla pagina resa (`web-checks.ts`). Il formato è in `docs/lezioni/README.md`.

### Progetti a più file
Dal 4 ottobre 2026 (vedi [[2026-10-04 L'editor di codice ha i progetti a più file, accanto allo snippet]]). Lo snippet, un file con la sua uscita, resta com'è; il progetto è l'altra forma.

- **Modello** (`src/lib/codice/progetto.ts`): un progetto è un oggetto percorso → testo. I percorsi possono avere cartelle (`css/stile.css`, fino a quattro livelli). Estensioni: `py`, `c`, `cpp`, `h`, `hpp`, `js`, `html`, `css`, `md`, `json`, `txt`, `csv` e le immagini `png`, `jpg`, `gif`, `webp`, `svg`. Al più 40 file e 1,5 milioni di caratteri in tutto.
- **Cartelle** (sera del 4 ottobre): si creano dall'elenco, anche vuote (nel progetto sono un percorso che finisce con la barra, senza testo), si rinominano con quello che contengono e si eliminano con tutto il contenuto. L'elenco è un albero, con le cartelle che si aprono e si chiudono. Un file si trascina in una cartella, o fuori da tutte sulla parte vuota dell'elenco; la cartella sotto il file trascinato prende uno sfondo tenue e l'icona aperta, senza altre animazioni (Alessandro ha scartato l'icona che si ingrandiva e ruotava: "qualcosa di più convenzionale"). Una cartella non si trascina.
- **Immagini**: caricate dal dispositivo, rimpicciolite nel browser a 1280 px di lato lungo e tenute dentro il progetto come data URL. Nessun bucket. I PDF non ci sono.
- **Banco** (`ProjectBench.tsx`): possiede i file e li dà a `Workbench` (programmi) o a `WebBench` (pagine), che ne sono la console e l'anteprima. Aprire un modulo o un foglio di stile non cambia quello che "Esegui" fa.
- **Due disposizioni**: `explorer`, nello strumento, e `tabs`, nelle lezioni, con una linguetta per file sopra il codice e l'uscita accanto o sotto.
- **La disposizione `explorer`** (rifatta la sera del 4 ottobre su indicazione di Alessandro): l'elenco dei file a sinistra (`Explorer.tsx`: crea, rinomina, elimina, aggiungi immagine); accanto i file aperti come schede, che si chiudono, si riordinano trascinandole e si spostano in una seconda colonna; sotto il codice l'uscita dei programmi, che un tasto nella barra nasconde del tutto e che un'esecuzione riapre. La pagina di un sito è una scheda in più, "Anteprima": all'inizio accanto al codice, si può chiudere, tenere da sola, e "Esegui" la riapre. La console della pagina sta nella fascia sotto, che si apre da sola per un errore o una nota. Maniglie tra elenco e codice, tra le due colonne, tra codice e uscita (`Panes` e `Handle` in `Split.tsx`).
- **Trascinare una scheda** mostra dove andrà prima di lasciarla: tra le schede una linea nel punto di inserimento; sopra il codice un velo sulla colonna in cui entra o, con una colonna sola, sulla metà sinistra o destra dove nascerà la colonna nuova.
- **Impostazioni nel progetto**: l'ingranaggio le apre come una scheda in più tra quelle dei file, nella seconda colonna (creata se non c'è), così si vede il codice cambiare; l'uscita resta dov'è. Nell'editor a file singolo prendono ancora il posto dell'uscita.
- **Schermo intero**: un tasto nella barra, in ogni editor dello strumento (`fullscreen.ts`), con lo schermo intero del browser dove c'è e l'editor steso sopra la pagina in ogni caso.
- **Quale programma parte**: tra i programmi "Esegui" avvia quello scelto nell'elenco (all'inizio il primo), perché anche un modulo è un programma; si cambia con il triangolino accanto al nome. Tra le pagine vale l'ultima aperta.
- **Python**: i file del progetto vengono scritti in `/progetto` dentro Pyodide prima di ogni esecuzione, che parte da lì: `import modulo` e `open("dati.txt")` funzionano, e un modulo modificato viene riletto. Nel traceback il file avviato si chiama ancora `programma.py`, i moduli `/progetto/nome.py`.
- **C e C++**: tutti i `.c`, o tutti i `.cpp`, si compilano insieme; gli altri file sono lì per `#include`.
- **Pagine**: `web-assemble.ts` dà a ogni percorso scritto nella pagina (`<link>`, `<script src>`, `<img src>`, `url()` nei fogli di stile) il file del progetto; un percorso che non esiste e un file non collegato sono detti in una nota. Un link a un'altra pagina del progetto la apre nell'anteprima e nell'editor. Un file `.md` è mostrato come pagina.
- **Nelle lezioni**: blocchi `codice` con il nome di un file sono un progetto; `%% crea` dà allo studente l'elenco per creare file. Il vecchio gruppo `html`, `css`, `js` è ora un progetto con i nomi `index.html`, `style.css`, `script.js`.
- **Salvataggio**: un progetto salvato ha linguaggio `project` e i suoi file (migrazione `20261004160000_program_projects.sql`, applicata in produzione). I programmi `web` salvati prima si aprono come progetti.
- La voce "Pagina web" del menu non c'è più: una pagina è un esempio di "Progetto".

### I programmi salvati
Dal 4 ottobre 2026 (vedi [[2026-10-04 I programmi dell'editor si salvano con nome, come i grafici]]). Costruito sul modello dei grafici del plotter.

- Nella barra dell'editor il tasto "I miei programmi" apre un pannello (`SavedPrograms.tsx`): "Salva con nome" crea un programma, "Salva" scrive sopra quello caricato, l'elenco li ricarica e li elimina. Senza account il pannello apre l'accesso.
- Un programma salvato ha un nome, un linguaggio (`python`, `c`, `cpp`, `javascript`, `web`) e i suoi file: `main` per un programma, `html`, `css` e `js` per una pagina (`src/lib/codice/salvati.ts`).
- Tabella `programs` (migrazione `20261004120000_programs.sql`, applicata in produzione il 4 ottobre), con la sicurezza a livello di riga come `plots`. Server in `src/lib/server/programmi.ts`, rotte `/api/programmi` e `/api/programmi/[id]`.
- Nei blocchi delle lezioni c'è "Salva", che mette il programma dello studente tra i suoi; da lì non si carica niente, perché il blocco è della lezione.
- I programmi e i grafici sono ora nell'esportazione dei dati dell'account (`src/lib/server/account.ts`); i grafici mancavano.

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
- **Editor:** CodeMirror 6 (`Editor.tsx`), con i colori di Dark Modern di VS Code nel tema scuro e di Light Modern in quello chiaro, letti dal tema installato in Cursor (`theme.ts`); parentesi colorate per profondità; nello strumento, da 640 px in su, una minimappa del programma lungo il bordo destro del codice (`@replit/codemirror-minimap`), che nelle lezioni non c'è; rientro di quattro spazi; Ctrl+Invio o ⌘+Invio esegue.
- **Larghezza e impostazioni** (4 ottobre 2026, chieste da Alessandro): nello strumento, su schermo largo, una maniglia tra il codice e l'uscita ne cambia la larghezza (`Split.tsx`, con un'impugnatura al centro; trascinata, con le frecce, doppio clic per tornare a metà, dal 25 al 75 per cento). Il tasto con l'ingranaggio mostra le impostazioni al posto dell'uscita (`SettingsPanel.tsx`, `settings.ts`): colori del codice (Modern, GitHub, One, Solarized, ciascuno per il tema chiaro e per lo scuro del sito), dimensione del testo (un intero da 10 a 20 pixel, 13 di partenza, scritto o cambiato con più e meno), larghezza del rientro (2, 4 o 8 spazi: cambia anche le righe già scritte, e ogni programma si apre con il rientro scelto), minimappa, numeri di riga, a capo automatico, chiusura automatica di parentesi e virgolette. Restano nel browser (`localStorage`, chiave `sapiens:editor`), non nell'account, e valgono anche per gli editor delle lezioni, che però non hanno né il tasto né la maniglia. Un editor aperto prende la modifica senza perdere il testo. I colori di GitHub, One e Solarized sono scritti dalle loro tavolozze pubbliche, a memoria: da verificare.
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
- `tests/unit/codice.test.mjs`: 20 prove (17 prima dei progetti) sul formato del blocco (programmi e pagine), sulle regole dei controlli, sul collegamento dei file, sulla guardia dei cicli, su JavaScript e sul motore Python.
- `tests/e2e/codice.spec.ts`: 32 prove nel browser (le ultime aggiunte: maniglia e impostazioni, quattro sui progetti, un progetto in una lezione; queste ultime sette sono passate solo su Chromium in sviluppo). Delle prime 23: Sette sono del 4 ottobre: JavaScript, le pagine web (due), i programmi salvati (tre), un esercizio in JavaScript e uno di pagina in una lezione. Due sono sull'isolamento, e la prima ora prova anche lo script di una pagina web: un programma Python eseguito da uno studente che ha fatto l'accesso prova a leggere `/api/me` e a creare un quaderno, e non deve riuscirci; il server rifiuta una scrittura con `Origin` diversa dal sito. Le altre 14: Il 3 ottobre 2026 passano su Chromium, WebKit, Firefox, iPhone e Pixel emulati, in sviluppo e contro la build di produzione (dove la prova del blocco nelle lezioni viene saltata, perché la pagina di prova esiste solo in sviluppo), e su quattro motori contro il sito pubblicato.

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
- Nei progetti: JavaScript a moduli (`import` tra file `.js`) non c'è; i PDF non si caricano; non si scarica il progetto come cartella; non si trascinano i file tra cartelle; il traceback di Python non usa il nome vero del file avviato.
- Le immagini stanno dentro il progetto, non in un bucket: scelta proposta da Claude, Alessandro ha detto di procedere. Se servono file grandi va ridiscusso, con il tema di cosa caricano dei minorenni.
- SQL (quarto anno): SQLite in WebAssembly, secondo Claude. Non discusso.
- I controlli sul comportamento di una pagina (un clic che cambia il testo) non ci sono: oggi si controlla solo com'è la pagina appena caricata.
- Nell'anteprima non si caricano librerie da CDN (Bootstrap, jQuery): la policy lo vieta. Da decidere se serve.
- La guardia dei cicli non copre il codice scritto negli attributi (`onclick="while(true){}"`).
- Il limite del piano gratuito per i programmi salvati è una scelta di Claude: 10, senza limite con un piano a pagamento. Da confermare.
- Un blocco con l'editor dentro le note dello [[Zaino]], come quello del plotter: non fatto.
- I programmi eliminati non passano dal cestino.
- I messaggi di errore in italiano, o una spiegazione accanto a quelli di Python e di Clang.
- L'isolamento non limita la memoria: un programma può ancora far chiudere la scheda. Il limite di 10 secondi copre solo il tempo.
- Su Chromium non è stato verificato che cosa succede togliendo la policy dell'iframe (se il cookie parte o no): la prova non caricava Python. Su WebKit parte, su Firefox no.
- La tartaruga non ha `undo`, `clearstamp`, le forme registrate dallo studente né la modalità `logo`.
- La prova automatica del blocco nelle lezioni gira solo in sviluppo: serve una lezione pubblicata con un blocco `codice` per provarlo anche in produzione.

## Collegamenti
- Attori: [[Studente]]
- Note: [[Lezioni]], [[Esercizi]], [[Programma ministeriale]], [[Pipeline lezioni]]
- Decisioni: [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]], [[2026-10-04 L'editor di codice ha i progetti a più file, accanto allo snippet]], [[2026-10-04 L'editor di codice ha anche JavaScript e le pagine web]], [[2026-10-04 I programmi dell'editor si salvano con nome, come i grafici]], [[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]], [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]
- Sessioni: [[2026-10-03 Editor di codice]], [[2026-10-04 Isolamento dell'editor di codice]]
