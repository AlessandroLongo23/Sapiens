---
stato: bozza
release: da decidere
aggiornato: 2026-10-03
tag: [prodotto, studenti, informatica, lezioni, esercizi]
---
# Editor di codice

Un editor con il tasto Esegui dentro le lezioni e gli esercizi di informatica: lo studente scrive un programma e lo fa girare nel browser, senza installare nulla.

## Stato attuale
Prototipo per il solo Python, del 3 ottobre 2026, sul branch `grafico-funzioni`, non committato e non pubblicato. La rotta di prova è `/prova-python` (`src/app/(site)/prova-python/page.tsx`), non collegata e fuori dall'indice.

- **Esecuzione:** Pyodide 314.0.7 (CPython 3.14 compilato in WebAssembly) in un Web Worker, `src/components/codice/python.worker.ts`. Il lato pagina è la classe `Python` in `src/components/codice/python.ts`: avvia il worker, lancia il programma, lo ferma. La parte in Python sta in `public/codice/`: `sapiens.py` esegue il programma, `turtle.py` è la tartaruga, `sapiens_grafici.py` è il backend di matplotlib.
- **Da dove arriva Pyodide:** dalla nostra origine, `public/pyodide/`. Lo prepara `scripts/codice/pyodide.mjs` dopo ogni `npm install` (`postinstall` in `package.json`): copia il runtime da `node_modules` (13,5 MB) e scarica una volta sola da jsDelivr i 12 pacchetti di numpy e matplotlib (13,3 MB), controllati con gli hash del file di lock. Senza rete l'installazione riesce lo stesso e mancano solo i due pacchetti. La cartella è in `.gitignore`. Nessun CDN mentre lo studente usa la pagina: la Content Security Policy di `next.config.ts` non cambia e l'indirizzo dello studente non va a terzi.
- **Librerie:** tutta la libreria standard (`math`, `random`, `statistics`, `fractions`, `datetime`, `collections`, `json`, `csv`, `sqlite3` e le altre). numpy e matplotlib si caricano solo quando il programma le importa, prima che parta e fuori dal suo limite di tempo; la barra dice "Carico matplotlib e numpy…". La prima volta ci vogliono circa 4 secondi in locale, poi sono già caricate.
- **matplotlib:** `plt.show()` manda ogni figura nella console come immagine PNG, nel punto in cui il programma la mostra; una figura disegnata e mai mostrata compare alla fine, come in un notebook. Al massimo 20 immagini per esecuzione.
- **Tartaruga:** riscritta da noi (`public/codice/turtle.py` per la logica, `src/components/codice/turtle.ts` e `TurtleCanvas.tsx` per il disegno), perché quella di Python dipende da Tk, che nel browser non c'è. Ha i comandi di movimento, penna, colori (nomi, esadecimali, terne con `colormode`), riempimenti, `circle` con lo stesso poligono di Python, `dot`, `write`, `stamp`, le sei forme, la velocità, più tartarughe, `Screen` con `bgcolor`, `setup` e `tracer`; `textinput` e `numinput` diventano `input()`. Il programma finisce subito e la pagina rianima i comandi in un canvas sopra la console, alla velocità di ogni tartaruga, con un tasto Salta. Tasti, clic e timer (`onkey`, `onclick`, `ontimer`) danno un errore che lo dice. Il riempimento di una figura che si incrocia segue la regola pari-dispari, come Tk: la stella a cinque punte ha il centro vuoto.
- **Quando si scarica:** al primo clic nell'editor o al primo Esegui, mai con la pagina.
- **Editor:** CodeMirror 6 con i colori di Python sui token semantici del sito (tema chiaro e scuro), rientro di quattro spazi, Tab che rientra, Ctrl+Invio o ⌘+Invio che esegue. `src/components/codice/Editor.tsx`, caricato con `next/dynamic`.
- **Console e interfaccia:** `src/components/codice/Runner.tsx`. Editor e console affiancati da computer, uno sopra l'altra sul telefono. Nove programmi di esempio in `src/components/codice/examples.ts`, con due per la tartaruga e uno per matplotlib.
- **`input()`:** la risposta si scrive nella console, nel punto in cui il programma la chiede. Vedi "Dettagli".
- **Errori:** il traceback mostra solo le righe del programma dello studente (`programma.py`), con la riga citata; i messaggi sono quelli di Python, in inglese.
- **Programmi che non finiscono:** fermati dopo 10 secondi, o dopo 100.000 caratteri stampati, o 100.000 comandi della tartaruga, o dal tasto Ferma. Fermare vuol dire chiudere il worker: l'esecuzione dopo ricarica Python dalla cache del browser (circa un secondo e mezzo in locale).

Provato il 3 ottobre 2026 in Chromium senza schermo, sul server di sviluppo. Per la grafica: matplotlib con e senza `plt.show()`, la stella riempita con il tasto Salta, la spirale animata fino in fondo (circa 3 secondi), la tartaruga con un `input()` in mezzo, l'errore di `onkey`. Prima ancora, dieci prove sul resto: due `input()` di seguito, numeri casuali uguali tra una riesecuzione e l'altra, traceback, errore di sintassi, ciclo che stampa senza fine, ciclo muto fermato a mano e dal limite di tempo, modifica del programma durante un'attesa, larghezza da telefono (390 px, nessuno scorrimento orizzontale). Non provato: Safari, Firefox, un telefono vero, la build di produzione, una rete lenta.

## Obiettivo
Da discutere. Proposta di Claude del 3 ottobre 2026, non ancora decisa: lo stesso blocco montato nelle lezioni, come il blocco `grafico`, e negli esercizi, dove la correzione avviene su ingresso e uscita (il programma legge dei dati e stampa un risultato, e gli stessi test valgono per ogni linguaggio). Non un IDE con file, progetti e terminale.

## Dettagli
**Perché `input()` riesegue il programma.** Un worker può fermarsi ad aspettare la tastiera solo con SharedArrayBuffer, che chiede l'isolamento cross-origin di tutta la pagina. In Next la navigazione tra le pagine non ricarica il documento, quindi l'isolamento andrebbe messo su tutto il sito, dove può rompere i riquadri di Stripe e gli embed. Il prototipo fa in un altro modo: quando il programma chiede una riga che nessuno ha ancora scritto, si ferma; scritta la riga, riparte dall'inizio con tutte le righe scritte fino a lì. Il seme di `random` è lo stesso per tutta l'esecuzione, così la ripetizione rifà gli stessi passi, e quello che la console mostra già non viene rimandato.

Limiti noti di questa scelta:
- un programma lento prima di un `input()` rifà il lavoro a ogni risposta;
- un programma che dipende dall'ora (`time`, `datetime`) può comportarsi in modo diverso tra una ripetizione e l'altra;
- un `except:` senza tipo cattura anche il segnale di attesa, e il programma finisce nel limite di stampa o di tempo;
- `sys.stdin` non è collegato, funziona solo `input()`.

Alessandro, 3 ottobre 2026: numpy e matplotlib vanno messi; la tartaruga si ricrea, perché logica e disegno sono molto semplici.

**Dipendenze aggiunte:** `pyodide`, `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`, `@codemirror/language`, `@codemirror/autocomplete`, `@codemirror/lang-python`, `@lezer/highlight`.

## Domande aperte
- Gli altri linguaggi. Alessandro, 3 ottobre 2026: servono anche C e C++, perché alcuni licei fanno quello, e Java per altri. La decisione del 26 settembre fissava il solo Python ([[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]]). Valutazione di Claude: C, C++ e Java chiedono un servizio che compila ed esegue sul server (contenitori isolati, senza rete, dietro il login), e un albero di informatica con un tronco comune e capitoli per linguaggio. Non deciso.
- HTML e CSS (terzo anno) e SQL (quarto anno): un iframe isolato e SQLite in WebAssembly, secondo Claude. Non discusso.
- Quando si costruisce davvero: l'ordine delle materie dopo la matematica non è deciso, e le 171 lezioni di informatica sono vuote.
- La tartaruga non ha `undo`, `clearstamp`, le forme registrate dallo studente (`register_shape`) né la modalità `logo`: da aggiungere se le lezioni li usano.
- I messaggi di errore in italiano, o una spiegazione accanto a quelli di Python.
- Le intestazioni di cache per `/pyodide/`: oggi il browser richiede la conferma dei file a ogni caricamento. Con un indirizzo che porta la versione si possono tenere in cache per sempre.
- `public/pyodide/` passa dal proxy (`src/proxy.ts`) come ogni indirizzo non escluso: da escludere prima di pubblicare.
- Salvare il codice dello studente (nello Zaino, o per lezione).
- Quanto pesa Pyodide compresso su una rete di scuola: da misurare sulla build pubblicata.

## Collegamenti
- Attori: [[Studente]]
- Note: [[Lezioni]], [[Esercizi]], [[Programma ministeriale]]
- Decisioni: [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]
- Sessioni: [[2026-10-03 Editor di codice]]
