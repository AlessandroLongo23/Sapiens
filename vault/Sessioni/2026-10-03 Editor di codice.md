---
data: 2026-10-03
tag: [sessione, informatica, strumenti]
---
# Editor di codice

## Di cosa si è parlato
Alessandro ha chiesto se per informatica abbia senso offrire un IDE online dove eseguire il codice nel browser.

Claude ha risposto di sì, ma non un IDE: un editor con il tasto Esegui dentro la lezione e l'esercizio, con Python eseguito nel browser da Pyodide. I motivi: Python era già il linguaggio scelto il 26 settembre, l'esecuzione sul dispositivo dello studente non costa e non ha problemi di sicurezza, nei laboratori di scuola spesso non si può installare nulla, e senza esecuzione gli esercizi di informatica restano a scelta multipla. Ha indicato tre punti delicati: `input()`, il peso di Pyodide, il C++.

Alessandro ha detto che servono anche C e C++, perché alcuni licei fanno quello, e Java per altri. Claude ha risposto che questi tre non si eseguono bene nel browser e chiedono un servizio sul server, che gli esercizi con più linguaggi vanno corretti su ingresso e uscita, e che l'albero di informatica andrebbe diviso in un tronco comune e capitoli per linguaggio. Ha proposto Python e C++ insieme al primo lotto di programmazione, Java dopo. Su questo non è stata presa una decisione.

Alessandro ha poi chiesto un prototipo per Python in una rotta di prova.

## Cosa è stato fatto
Il prototipo è a `/prova-python`, sul branch `grafico-funzioni`, non committato. Il dettaglio è in [[Editor di codice]]. In breve: Pyodide in un Web Worker, servito dalla nostra origine; CodeMirror 6 come editor; una console dove si risponde agli `input()`; limiti di tempo e di stampa per i programmi che non finiscono.

Il punto tecnico risolto è `input()`: il programma si ferma quando chiede una riga e riparte dall'inizio con le righe scritte fino a lì, con lo stesso seme per i numeri casuali. Evita l'isolamento cross-origin di tutto il sito.

Dieci prove passate in Chromium senza schermo sul server di sviluppo.

## Librerie e tartaruga
Alessandro ha chiesto se si possono importare librerie. Claude ha verificato che la libreria standard funziona già, e che mancavano la tartaruga (dipende da Tk) e numpy con matplotlib (non sono nel pacchetto npm di Pyodide). Alessandro ha chiesto di aggiungere numpy e matplotlib e di ricreare la tartaruga. Fatto lo stesso giorno: numpy e matplotlib si caricano quando il programma li importa e le figure vanno nella console; la tartaruga è riscritta in Python e disegnata in un canvas sopra la console. Dettagli in [[Editor di codice]].

Prima, su richiesta di Alessandro, i colori dell'editor sono diventati quelli di Dark Modern di VS Code (Light Modern nel tema chiaro del sito), letti dal tema installato in Cursor.

## I cinque passi
Alessandro ha chiesto i prossimi passi e se si potessero aggiungere C e C++. Claude ne ha proposti cinque, e Alessandro ha detto di farli tutti, nell'ordine.

1. **Mettere al sicuro il prototipo Python.** Provato su Chromium, WebKit, Firefox, iPhone e Pixel emulati, con una suite Playwright nuova (`tests/e2e/codice.spec.ts`). Firefox ha trovato un difetto: lì un ciclo che stampa senza fine arrivava al limite di tempo prima che a quello di stampa, perché ogni `print` passava da Python a JavaScript; ora il testo si raccoglie dentro Python. Committato sul branch `editor-codice`, costruito senza cambiare il branch attivo della cartella condivisa.
2. **C e C++ nel browser.** Clang 22 in WebAssembly (`@yowasp/clang`), con un WASI scritto da noi; due worker, uno per il compilatore e uno per ogni programma. `scanf` e `cin` si rispondono nella console come `input()`. Limite: niente eccezioni in C++.
3. **Decisione sui linguaggi**, con le misure: [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]. Claude aveva detto, prima di controllare, che C e C++ non si eseguivano bene nel browser: era sbagliato.
4. **Il blocco nelle lezioni e gli esercizi.** Un blocco `codice` nel markdown monta l'editor; più blocchi di seguito sono lo stesso programma in più linguaggi, con le linguette; con le prove il blocco è un esercizio corretto su ingresso e uscita. Uno script esegue le soluzioni sulle prove, nei tre linguaggi, prima di pubblicare. Il branch `editor-codice` è stato spostato sopra `grafico-funzioni`, dove vive il meccanismo dei blocchi delle lezioni.
5. **Il primo lotto di informatica.** Vedi [[2026-10-03 Primo lotto di informatica]].

Il dettaglio dei punti da 1 a 4 è in [[Editor di codice]].

## Decisioni
- [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]

## Rimasto da fare
- Provare l'editor su un computer di scuola e su un telefono vero, e misurare il peso in rete dalla build pubblicata.
- Java, e come si scrivono per tre linguaggi le 44 lezioni di programmazione.
- Il branch `editor-codice` non è stato pubblicato né unito: parte da `grafico-funzioni`, quindi va unito dopo il plotter. Le righe aggiunte a `Home.md` e `Agenda.md` non sono nel branch, perché quei file hanno modifiche non committate di altre sessioni.
- Le domande aperte di [[Editor di codice]].
