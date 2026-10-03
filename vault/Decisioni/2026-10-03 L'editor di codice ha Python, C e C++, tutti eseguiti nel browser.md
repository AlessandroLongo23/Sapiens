---
stato: decisa
aggiornato: 2026-10-03
tag: [decisione, informatica, strumenti, tecnica]
---
# L'editor di codice ha Python, C e C++, tutti eseguiti nel browser

## Decisione
L'[[Editor di codice]] di informatica esegue tre linguaggi: Python, C e C++. Tutti e tre girano nel browser dello studente, senza un servizio che esegue codice sul server. Java resta da decidere.

## Perché
Alessandro, 3 ottobre 2026: oltre a Python servono C e C++, perché alcuni licei fanno quelli; altri fanno Java. Ha chiesto di decidere con le misure in mano, dopo un prototipo.

Le misure del prototipo, del 3 ottobre 2026, su un Mac con il server di sviluppo in locale (quindi senza il tempo di rete):

| | Chromium | WebKit | Firefox |
|---|---|---|---|
| C++, prima esecuzione (compilatore, compilazione, programma) | 3,3 s | 2,8 s | 3,3 s |
| C++, programma nuovo con il compilatore già caricato | 2,8 s | 2,8 s | 2,4 s |
| C, programma nuovo con il compilatore già caricato | 1,8 s | 1,8 s | 0,9 s |
| C o C++, lo stesso programma eseguito di nuovo | 0,05 s | 0,04 s | 0,05 s |
| Python, prima esecuzione | 1,3 s | 1,3 s | 1,3 s |

Il compilatore è Clang 22 compilato in WebAssembly (`@yowasp/clang`, licenza ISC): 105 MB su disco, 27 MB con gzip, 20 MB con Brotli. Si scarica una volta, al primo Esegui di un programma in C o C++.

Alternativa scartata: eseguire C e C++ su un servizio nostro (contenitori Cloudflare, oppure Piston o Judge0 su una macchina nostra). Funziona di sicuro e non pesa sul dispositivo, ma porta un costo per esecuzione, codice di sconosciuti da isolare, il login obbligatorio e i limiti contro gli abusi. Con questi tempi nel browser non serve. Resta la strada di riserva se sui computer delle scuole o sui telefoni veri il compilatore si rivela troppo pesante.

## Conseguenze
- Supera in parte [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], che fissava Python come unico linguaggio di informatica. Python resta il linguaggio in cui si scrivono per primi lezioni ed esempi.
- Il C++ dell'editor non ha le eccezioni: la libreria C++ di questo compilatore è costruita senza, quindi `try`, `catch` e `throw` sono errori di compilazione, e l'editor lo dice in italiano. Classi, ereditarietà, libreria standard e puntatori funzionano.
- Gli esercizi di programmazione si correggono su ingresso e uscita, con le stesse prove per i tre linguaggi.
- L'albero di informatica ha 44 lezioni legate al linguaggio (da "Linguaggi e primi programmi" a "Strutture dati"): va deciso come si scrivono per tre linguaggi. Non discusso.
- Da misurare prima di pubblicare: il tempo su un computer di scuola e su un telefono vero, la memoria, il peso in rete dalla build pubblicata, il limite di dimensione dei file statici su Vercel (il file più grande è 75 MB).
- Java: il compilatore nel browser esiste (CheerpJ, licenza commerciale da verificare) oppure serve il server. Da decidere quando si arriva alla programmazione a oggetti del quarto anno.

## Collegamenti
- [[Editor di codice]], [[2026-10-03 Editor di codice]]
- [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]]
- [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]
