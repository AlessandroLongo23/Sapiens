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

## Decisioni
Nessuna registrata.

## Rimasto da fare
- Provare a mano il prototipo, anche su Safari e su un telefono vero.
- Decidere i linguaggi oltre Python: supera in parte [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]].
- Decidere se committare il prototipo e su quale branch: oggi è nell'albero di `grafico-funzioni` insieme al plotter e al laboratorio.
- Le domande aperte di [[Editor di codice]].
