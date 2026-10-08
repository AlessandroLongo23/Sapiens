---
stato: in sviluppo
aggiornato: 2026-10-07
tag: [contenuti, informatica, da-fare]
---
# Informatica terzo anno, da sistemare

Quello che i rapporti dei 14 gruppi lasciano aperto nel terzo anno di informatica (lezioni 65-98), scritto il 7 ottobre 2026 e non ancora committato né pubblicato. Ogni voce si spunta quando è fatta. Il contesto è in [[2026-10-07 Terzo anno di informatica]]; i dettagli sono nei rapporti dei gruppi (`inf3/rapporti/gruppo-NN.md` nello scratchpad della sessione, da copiare in `docs/lezioni/informatica/` prima che lo scratchpad sparisca) e nelle note `docs/lezioni/informatica/note/65-98`. La revisione dei testi e l'integrazione degli esercizi sono finite il 7 ottobre: le voci che hanno chiuso sono spuntate, e quelle che hanno aperto sono in "Dopo la revisione e l'integrazione". I due rapporti sono in fondo a `docs/lezioni/informatica/rapporti-terzo-anno.md`.

## Prima di pubblicare
- [x] Copiare i rapporti dei gruppi nel repo (per esempio `docs/lezioni/informatica/rapporti-terzo-anno.md`, come ha fatto la fisica): oggi stanno solo nello scratchpad. Fatto il 7 ottobre: `docs/lezioni/informatica/rapporti-terzo-anno.md`, con i rapporti di revisione e integrazione in fondo.
- [x] `npx tsc --noEmit -p .` sull'intero progetto dopo il collegamento dei generatori: dai rapporti non risulta una passata fatta a lotto chiuso (i gruppi 2 e 6 non lo hanno lanciato, 9 e 13 hanno ricontrollato solo i propri file). Fatto a lotto chiuso il 7 ottobre: 0 errori.
- [x] `npm run test:unit` sull'intero progetto a lotto chiuso: l'ultimo conto nei rapporti è 809 su 809 del gruppo 4, a metà lotto. Fatto a lotto chiuso il 7 ottobre: 810 su 810.
- [ ] Rileggere `src/components/content/interactive/informatica/listato.tsx`, sovrascritto alle 13:57 e ripristinato dalle source map: il gruppo 11 lo ha rimodificato e ha chiuso con `tsc` a 0 errori, ma la versione ripristinata era quella dell'ultima compilazione.
- [ ] Togliere dallo scratchpad, quando non serve più, la cartella `gruppo-02/recupero/` con la copia recuperata.
- [ ] Decidere l'ordine di pubblicazione: prima il codice (editor, kit, figure, generatori), poi le lezioni; le lezioni si linkano tra loro e a matematica fino alla 129, e i link non sono stati aperti perché le lezioni non sono pubbliche.

## Lezioni, una per una
- [ ] **65** (`65-inf-definire-funzioni.md`): eseguire i tre programmi in C++ nel browser, mai provati lì; guardare come l'editor mostra allo studente l'avviso di `linea;` senza parentesi (il sito compila con `-Wall`); `sqrt` è nominata come funzione di libreria del C++ e nel biennio non è mai stata usata.
- [ ] **66**: eseguire in C++ nel browser il quarto programma e verificare il secondo esercizio (lo script del gruppo non rispondeva alle domande); provare nell'editor una funzione C++ `int` senza `return`; un terzo esercizio (funzione che restituisce vero o falso) era scritto e provato ed è stato tolto per stare nelle 400 righe.
- [ ] **65-68**: rileggere nell'editor del sito i messaggi di errore citati (`TypeError` per l'argomento mancante, `NameError`, `UnboundLocalError`, il nome non dichiarato in C++, `scambia(3, 8)` che non compila): sono stati letti con Python 3.9 e `clang++` del Mac.
- [ ] **69**: è a 393 righe e non ha una figura TikZ dell'albero della scomposizione; la regola "da una a tre insufficienze: giudizio sospeso" è inventata, e il testo lo dice.
- [ ] **70, 71**: la 71 non ha un programma d'esempio per "contare quante volte" (è il primo esercizio); la frase "una ventina di confronti tra un milione" va tenuta allineata con la 74 e la 78, che dicono "al massimo 20".
- [ ] **72**: è a 400 righe esatte; la somma per colonne non ha un programma suo da eseguire e la stampa della matrice come tabella è stata tolta; provare `voti[0][4]` sul Clang del sito.
- [ ] **73**: provare nell'editor una parola accentata letta da tastiera (`length()` conta i byte) e `"Hai " + eta` in C++.
- [ ] **74**: il programma dei confronti con `N` uguale a 1 000 000 non è provato nel Clang del sito (il testo propone 2000 e 4000); a 390 px le righe più lunghe degli editor si leggono scorrendo.
- [x] **75 e 76**, da uniformare: la tabella di traccia sta dopo il programma nella 75 e prima nella 76; i tempi della corsa campestre sono "in minuti" nella 75 e "in secondi" nella 76; `const int N = 6;` è dentro `main` nella 76 e in cima nella 70 e nella 75; nella 76 la formula in evidenza $(n-1)+(n-2)+\dots+1=\frac{n(n-1)}{2}$ esce dal bordo destro a 390 px (nella 75 è stata accorciata). Chiuso dalla revisione: 76 e 77 allineate alla 75, formula a capo dopo l'uguale. L'ordine scelto è una domanda in [[Domande per Andrea]].
- [ ] **76**: è a 398 righe; il secondo programma scrive solo "giri fatti"; il livello 4 del generatore si chiama "Quale ciclo interno ordina" e non "Quale funzione ordina" come chiesto, per una ragione scritta nel rapporto del sottoagente, che nessuno ha riletto.
- [ ] **77**: il riquadro dice in mezza riga che `v[-1]` in Python è l'ultimo elemento, e nella 70 gli indici negativi oggi non compaiono (il rapporto del gruppo 3 li dava come nominati); nella figura `inf-insertion-sort-carte` la freccia `j` dopo uno spostamento sta sotto il posto libero, mentre nel programma `j` è già diminuito.
- [ ] **78**: la riga "a caso" della tabella a 12 elementi dipende dal seme con cui si apre `GaraOrdinamenti.tsx` (4); nel grafico `crescita-confronti-quadrato-lineare-logaritmo` il bottone "Reset" copre l'angolo vicino all'origine, retta e logaritmo sono schiacciati sull'asse, e il cursore non è mai stato mosso in prova.
- [ ] **74 e 78**: `inf-ricerca-binaria-sequenziale` e `inf-gara-ricerche` mostrano tutte e due le ricerche fianco a fianco: decidere se tenerne una sola.
- [x] **77, 78**: il gruppo 5 non le ha rilette dopo aver chiuso la 74 e la 75; vanno lette di seguito con quelle. Rilette di seguito dal lettore della revisione sulle lezioni 65-78; quello che ha trovato e non è stato corretto è nel rapporto.
- [ ] **79**: è a 399 righe; il blocco della tabellina ha un `tabellina.txt` di partenza solo perché senza un file di dati l'editor non tiene il file scritto tra un'esecuzione e l'altra.
- [ ] **81**: 13 grassetti (avviso di `check.mts`); i due esercizi usano `xml.etree.ElementTree`, che la lezione non spiega; nella figura `inf-albero-xml-json` i due testi sono a 11 px sul telefono e rispondono solo al puntatore.
- [ ] **82**: 434 righe contro le 200 indicate; la figura TikZ `contenitore-e-tracce` guardata solo in chiaro; la tabella dice "PNG: animazione no" ed esiste APNG.
- [ ] **83**: nei controlli delle due pagine SVG è stato verificato che la soluzione passi, non che la pagina di partenza venga bocciata.
- [ ] **85**: non c'è audio da ascoltare; i singoli valori dei comandi di `inf-audio-video-dimensione` non sono stati provati uno per uno.
- [ ] **86**: gli esercizi di una pagina con `css` aprono l'editor su `index.html` mentre lo studente deve lavorare in `style.css`; il controllo `p | stile font-family = "Courier New", monospace` è provato solo con Chromium; le modifiche che il testo chiede non sono state provate una per una.
- [ ] **87**: il secondo esercizio conta su come Chromium ripara un `h1` non chiuso e un `<p>` scritto al posto di `</p>`; negli esercizi `p | testo` non conta gli spazi ripetuti.
- [ ] **88**: `inf-html-albero-documento` da telefono è alta circa 1160 px, e toccando una riga del file il rettangolo acceso nella pagina può essere fuori dallo schermo; la figura TikZ `albero-documento-html-scheletro` è stata guardata solo come la disegna il browser.
- [ ] **89**: per un file del sito in `src` (`/icon-192.png`) l'immagine si vede ma l'editor avvisa che "non esiste nel progetto"; nel secondo esercizio le altre due pagine del progetto non vengono corrette.
- [ ] **90**: nell'esercizio 2 passano le celle scritte senza `<tr>`, che il browser ripara da sé; il formulario ha quattro blocchi di codice ed è sulle due schermate abbondanti; le date dei concerti (12 aprile, 3 maggio, 20 giugno) sono del gruppo 11 e vanno confrontate con le altre lezioni del filo.
- [ ] **91**: nella figura `inf-html-modulo-inviato` il campo dell'email è un campo di testo (mostra che cosa parte, non la convalida); il messaggio della regola `non inviato` ("l'invio va fermato con preventDefault()") è scritto per la 98 e in una lezione di solo HTML confonde.
- [ ] **92, 93**: le modifiche proposte dal testo (togliere `<link>`, `padding` a 0, `display: block`, aggiungere `box-sizing`) non sono state rifatte una per una nel browser.
- [ ] **93**: `ScatolaCss` del kit disegna il contorno tratteggiato del margine anche con margine 0, e nel confronto si vede; la 94 potrebbe dover dire che i margini non si fondono dentro un contenitore flex.
- [ ] **95**: nel primo esercizio `2em` al posto di `2rem` dà gli stessi pixel e passa.
- [ ] **96**: la tabella dei tre linguaggi è diventata la figura `inf-js-costrutti-confronto`, di cui sono stati guardati cinque costrutti su otto.
- [x] **97**: nel primo esercizio passava chi scrive `chiudi()` con le parentesi. Chiuso dalla revisione con un controllo sullo stato iniziale.
- [ ] **97**: la figura mostra `class=""` dopo `classList.toggle`, da ricontrollare su più browser.
- [ ] **98**: ha due esercizi e non tre, e `checked` non ne ha uno; le 12 risposte sbagliate di 97 e 98 vanno rilanciate dopo l'ultima modifica ai controlli.
- [ ] **Lunghezza.** Il testo da leggere è sotto le 50 righe del brief nelle lezioni 70-73, 76-78, 90, 91 e 94-98 (gli altri rapporti non lo dicono); decidere se la regola si conta a parole (le lezioni hanno da 950 a 1700 parole) e correggere il brief.
- [x] **Filo "I Fuori Tempo".** I rapporti davano nomi diversi per chi suona (Sara, Leo, Amir, Giulia nel gruppo 9; Sara, Marta, Dario, Leo nei gruppi 10 e 11; Sara, Leo, Marta, Pietro, Emma nel gruppo 13). Nei file, al momento di questa nota, le lezioni 86-94 hanno solo Sara, Marta, Dario e Leo (cercati con `grep`): qualcuno li ha già uniformati. Restano da confrontare le date dei concerti, che nei file sono 7 e 14 marzo, 12 aprile, 3 maggio, 5 e 20 giugno, 12 dicembre. Chiuso il 7 ottobre: lezioni e generatori hanno Sara, Leo, Marta e Dario; nella 89 il secondo concerto è il 27 giugno. Le date del "prossimo concerto" restano una domanda in [[Domande per Andrea]].

## Lezioni scritte attorno a un difetto dell'editor poi corretto
Le correzioni sono arrivate dopo i rapporti. Per ogni voce va controllato che testo, esercizi e nota dicano quello che l'editor fa oggi.
- [x] **91**: la lezione dice che nell'anteprima l'invio non fa niente e mostra i controlli con `input:invalid` in un `style.css` di una riga; ora l'anteprima convalida e fa nascere `submit`. Anche la sezione della nota "Che cosa succede davvero nell'anteprima quando si invia un modulo".
- [ ] **98**: alla pagina centrale sono stati aggiunti i controlli sull'evento `change` perché `submit` non nasceva; la nota lo dà ancora come limite.
- [x] **95**: l'esercizio 2 non corregge la media query; ora c'è `> larghezza N`. Le pagine di esempio dicono allo studente di cambiare la soglia perché non poteva stringere l'anteprima, e ora ci sono i tre tasti di larghezza.
- [x] **89**: la lezione dà la scrittura `pagina.html#id` e non chiede di provarla; ora scorre. Chiuso dalla revisione: il progetto ha `storia.html` con `index.html#contatti`, e la lezione lo fa provare.
- [ ] **89**: controllare il secondo esercizio con `./scaletta.html`.
- [x] **93**: la nota dice che la revisione ha aggiunto al primo esercizio le regole sullo spessore del bordo: da confermare con una prova. Confermato: con `border: 3px solid teal` la soluzione viene bocciata.

## Figure interattive
- [ ] `inf-definire-funzione-passi`, `inf-parametri-ritorno-passi` (65, 66): con il C++ sono alte circa 910 px a 390 px, e pila e schermo restano in parte sotto il bordo; in scuro da telefono guardate solo ad alcuni passi.
- [ ] `inf-stringa-vocali` (73): porta in minuscolo la parola scritta, e con "Aiuola" conta 5 vocali dove il programma della lezione ne conta 4.
- [ ] `inf-vettore-indice-elemento` (70): la cella "fuori dal vettore" è una cella `scartata` con valore `?`, che lo screen reader legge come "5: ? (scartato)".
- [ ] `inf-ricerca-binaria-sequenziale` (74): `Dati` con dodici valori a due cifre taglia il testo del campo sul telefono.
- [ ] `inf-compressione-perdita` e `inf-bitmap-vettoriale-zoom` (84, 83): ricalcolano 4096 e 9216 pixel a ogni scatto del cursore; su un telefono vero non provate.
- [ ] `inf-html-celle-unite`, `inf-html-modulo-inviato` (90, 91): a 330 px la riga più lunga scorre nel suo riquadro e la seconda cresce di una riga con valori molto lunghi.
- [ ] Figure delle stringhe (73): cambiando parola l'altezza cambia di qualche pixel; il messaggio di errore del campo allunga la figura quando compare (anche in `Dati`).
- [ ] Figure registrate e non usate da nessuna lezione (cercate con `grep` in `riscritte/`): `inf-scambia-valore-riferimento`, `inf-css-modello-scatola` e le cinque figure a passi del kit (`inf-ricerca-sequenziale-passi`, `inf-ricerca-binaria-passi`, `inf-selection-sort-passi`, `inf-bubble-sort-passi`, `inf-insertion-sort-passi`), sostituite dalle copie adattate dei gruppi. Da decidere se tenerle come esempi del kit o toglierle.
- [ ] `inf-pixel-risoluzione-profondita` (83): riusata dal kit e guardata solo dentro la lezione.
- [x] Le dieci figure TikZ da riguardare con `anteprima.mjs` in chiaro e in scuro, ora che `node-tikzjax` è installato (lo fa il revisore). Compilate e guardate tutte in chiaro e in scuro dal revisore: nessun difetto.
- [ ] Un avviso di React comparso una volta aprendo la 72, gli esercizi della 90 e la 95 ("Can't perform a React state update on a component that hasn't mounted yet"): non si è ripetuto e nessuno sa da quale componente venga.

## Kit delle figure di informatica
File: `src/components/content/interactive/informatica.tsx` e la cartella `informatica/`.
- [ ] Unire i listati con la riga in esecuzione: `ProgrammaPassi.tsx` (gruppo 1, con `Listato` e `Schermo` non esportati) e `PilaProgramma.tsx` (gruppo 2) sono quasi uguali, e `listato.tsx` (gruppo 11, con `Listato`, `Tasto`, `Codice`, `Titolino`) è una terza versione. `Tasto` esiste anche in `informatica.tsx` e non è esportato.
- [ ] `Stringa` non ha `passi`: con due puntatori sulla stessa cella l'altezza cambia da un passo all'altro. Il gruppo 4 ha usato `Celle` con `unite` e `passi` in `StringaPassi.tsx`.
- [ ] `Dati` non legge parole (solo interi da 0 a 99), ha l'etichetta fissa "I valori del vettore" e non esporta le classi di `CAMPO`: il campo per una parola è riscritto in `StringaPassi.tsx`, e la figura della 79 ha i dati fissi.
- [ ] `Celle` non ha una cella "fuori dal vettore", e non tiene l'altezza quando cambia il numero delle celle (solo tra i passi di una traccia).
- [ ] `VettorePassi` mostra solo i contatori: manca una prop `variabili` per passo. Il riquadro "Cerco 21" non è esportato.
- [ ] `Matrice` non ha un posto per i totali di riga e di colonna né per un'etichetta di riga; senza `riga` o `colonna` lo spazio a lato cambia (si evita con `su: -1`, che nel README non è scritto).
- [ ] `Contatori` scrive i nomi in maiuscolo, non ha un titolo né larghezze uguali, è troppo largo accanto al nome di una corsia a 330 px e con tre voci lunghe va a capo a 390 px. La versione compatta è in `informatica/gara.tsx` (`Corsia`, `Scelta`, `corridore`, `passoAl`, `ritmoDi`); `corridore` e `passoAl` sono funzioni pure in un file `.tsx` e non hanno un test.
- [ ] `Legenda` accetta solo gli stati delle celle: per le variabili (`nuova`, `letta`, `scritta`) il gruppo 1 ha usato chiavi con lo stesso aspetto.
- [ ] `Pila` senza funzioni chiamate tiene uno spazio vuoto sopra `main`; `Variabili` non tiene l'altezza da un passo all'altro; `Frase` prende solo testo (manca il codice in monospazio, `conCodice` è uguale in due figure) e con `tutte` misura per numero di caratteri.
- [ ] `usePassi` non ha un passo iniziale (88) e non sa "vai al passo k e prosegui da solo": `usePassiAvvio` è in `informatica/passi-avvio.ts`, usato da due figure.
- [ ] Un pezzo `Albero` (nodi e rami, con i nodi da scegliere): rifatto a mano in `TopDownAlbero.tsx`, `AlberoXmlJson.tsx`, `MarkupTestoAlberoPagina.tsx`, `AlberoDocumento.tsx` e `DomAlberoEventi.tsx`. Anche l'albero di cartelle a rientri di `PercorsiSito.tsx` e il documento a elementi annidati di `SelettoriCss.tsx`.
- [ ] Una scelta tra più di quattro valori che va a capo: riscritta in `ScegliFormato.tsx`, in `impaginazione.tsx` (`Scelta`) e in `gara.tsx` (`Scelta`), perché `ToggleGroup` non va a capo. Manca anche un interruttore acceso e spento.
- [ ] Pezzi scritti dentro una figura e utili ad altre: la tavolozza per dipingere su `GrigliaPixel` (`RleRiga.tsx`), le due viste affiancate con la didascalia (`BitmapVettorialeZoom.tsx`, `CompressionePerdita.tsx`), la barra di confronto in scala (`AudioVideoDimensione.tsx`), la misura sotto una scatola (`ConfrontoBoxSizing.tsx`), il file di testo con la riga in corso (`CsvCampi.tsx`), `usePosti`, `posto` e `Regola` (`impaginazione.tsx`).
- [ ] Un pezzo per un testo a larghezza fissa e uno per una tabella: dentro una lezione `pre`, `table`, `ol`, `ul`, `li`, `h4`, `p` di una figura prendono lo stile di `.markdown-content`, e ogni gruppo lo ha riscoperto. Va scritto nel README, insieme alle legature del monospazio (`===`).
- [ ] `scripts/figure/anteprima-interattivo.mjs` aspetta un `<svg>` nella pagina: con una figura senza `<svg>` aspetta un minuto ed esce con un errore, anche se lo screenshot è buono.
- [ ] TikZ: una lettera accentata in un nodo fa fallire TikZJax nella pagina di anteprima (corretto nella 92 con `` \`a ``), e un `<` o un `>` scritto come testo rompe l'SVG (87): da scrivere nel README delle lezioni.

## Esercizi generati
- [ ] **Varietà bassa.** Esercizi diversi su 1000: 85 livello 1 (120), 95 livello 6 (129), 87 livello 5 (147), 65 livello 1 (162), 89 livello 1 (165), 98 livelli 4 e 3 (171 e 206), 84 livello 1 (192), 83 livello 4 (198), 88 livello 1 (213), 89 livelli 3 e 2 (216 e 229), 94 livelli 5 e 2 (226 e 286). Contando quello che lo studente vede e non `params`: 73 livello 5 (64), 72 livello 4 (177), 72 livello 6 (286). Nel livello 6 della 93 il caso `blocco` ha 40 combinazioni.
- [ ] **C++ controllato a campione.** `INF_CPP=1` su 25 esercizi per livello (20 nella 66, 80 nella 72, 60 nella 73), non sui 1000. Da lanciare per intero almeno una volta su tutti i generatori delle lezioni 65-80. Il C++ dei frammenti del livello 5 della 80 è controllato sul contenuto del file solo così.
- [ ] **Generatori dei sottoagenti da rileggere.** 67 e 68 (gruppo 2), 76, 77, 78 (gruppo 6), 96, 97, 98 (gruppo 14): codice, specifiche, C++, errori piantati, esercizi diversi, pagine a 390 px e risposte aperte non visti da chi ha chiuso il gruppo. Per 67 e 68 mancano anche i numeri degli esercizi diversi.
- [ ] **Risposte aperte.** Si correggono su quello che il programma scrive e sul costrutto: passano una ricerca sequenziale dentro `cerca` (74), `v.sort()` dentro `ordina` (75), e una funzione vuota chiamata accanto alla formula. Nel livello 5 della 79 passa chi fa il conto senza usare il file.
- [ ] **Risposte aperte che non possono leggere file.** La pagina degli esercizi non dà file al programma dello studente: nel livello 6 della 80 le righe `nome,punti` arrivano dalla tastiera.
- [ ] **Livelli aperti a scelta multipla** (70, 71 e gli altri): la pagina mostra lo stesso titolo "Scrivi il programma." nelle due forme, e le opzioni mostrano solo la parte dopo la lettura senza che la domanda lo dica.
- [ ] **Larghezza delle opzioni.** Il limite di 34 caratteri di `inf-codice.ts` esclude in C++ i cicli all'indietro e con passo 2 dentro una funzione; per starci i generatori usano nomi corti (`conta`, `cerca`, `num.txt`), `int centro;` prima del ciclo (74), `int v[6]` senza costante (75), vettori senza dimensione (80).
- [ ] **Scelta "Python | C++"** sopra le opzioni anche negli esercizi di soli frammenti HTML, CSS e JavaScript (`/prova-grafico/esercizio`): da controllare se la pagina vera degli esercizi fa lo stesso.
- [ ] **Errori piantati passati**: 4 su 105 nel gruppo 8 e 2 su 85 nella 95, dove il numero cambiato non entra nella risposta; nel gruppo 14 la cifra cambiata in un frammento. Da guardare a mano che nessuno tocchi un dato che lo studente legge.
- [x] **Verdetti non visti.** I gruppi 8, 9, 12 e 14 non hanno cliccato le opzioni fino al verdetto e alla spiegazione; il gruppo 8 non ha consegnato risposte. Fatto nell'integrazione per tutti i generatori: un'opzione cliccata fino al verdetto su 366 pagine a scelta multipla. Le risposte aperte non sono state consegnate (vedi sotto).
- [ ] **Niente livello sulla palindroma** (73) e niente livello sulla scelta del formato (81): scelte dei gruppi, da confermare.
- [ ] Moduli di aiuto nati nel lotto, da tenere o da unire a `inf-codice.ts`: `v2/inf-file.ts` con `_inf_file.py`, `v2/inf-g14-web.ts` con `_inf_g14.py`, `_inf_html11.py` (un lettore di HTML più grande di quello dentro `inf_codice_prova.py`).
- [ ] La scheda da stampare degli esercizi non è stata guardata da nessun gruppo.

## Editor e controlli delle pagine
File: `src/components/codice/`, `src/lib/codice/blocco.ts`; stato in [[Editor di codice]].
- [ ] L'azione `scrivi` toglie gli spazi intorno al testo: un controllo non può scrivere un campo di soli spazi, quindi nessun esercizio della 98 verifica `trim()`.
- [ ] Un controllo non può guardare due momenti, prima e dopo un'azione (97, primo esercizio).
- [ ] `verifica.mts` non esegue i controlli delle pagine: i 36 esercizi di pagina sono stati provati solo con gli script dei gruppi, che non restano nel repo.
- [ ] Ogni pagina `html` più `css` mostra una linguetta `script.js` vuota; un blocco `codice html` da solo mostra anche `style.css` vuota (per questo le lezioni 88 e 89 usano `codice index.html`).
- [ ] Un esercizio di pagina si apre su `index.html` anche quando si lavora in `style.css` (segnalato per la 86; da guardare nelle 92-95).
- [ ] Un'immagine non si può mettere in un blocco: le lezioni 89 e 95 la scrivono come `data:image/svg+xml` in `src`.
- [ ] Nelle prove in C++ la console riporta "Failed to read the 'localStorage' property": viene dallo script di prova del gruppo 2, da confermare che in una pagina vera non compare.
- [ ] Il test e2e "saved programs" crea e cancella un utente sul database di produzione: va spostato su un ambiente di prova o segnato in modo che non parta per sbaglio.

## Dopo la revisione e l'integrazione
Voci nuove del 7 ottobre, dai rapporti di revisione e di integrazione.
- [ ] **90, esercizio 2**: le celle scritte senza `<tr>` passano ancora. Il controllo `table tr | quanti = 3` c'era già e non le ferma, perché il browser crea da sé il `<tr>` e l'albero è identico a quello della soluzione. Serve un controllo sul sorgente dello studente, che oggi non esiste.
- [ ] **88**: `inf-html-albero-documento` da telefono è alta 1159 px. Togliendo il livello vuoto dell'albero si recuperano circa 40 px; per accorciarla davvero servono due linguette "albero" e "pagina", cioè un ridisegno. `inf-css-flexbox` (94) è alta 1074 px per lo stesso motivo.
- [ ] **76**: è a 408 righe dopo la revisione (era 398). La 82 è a 439.
- [ ] **Sette livelli sotto 100 esercizi visibilmente diversi su 1000** (domanda, programma e opzioni senza l'ordine): `inf-selection-sort` livello 5 (20), `inf-ricerca-binaria` livello 4 (30), `inf-passaggio-parametri` livello 4 (40), `inf-stringhe` livello 5 (64), `inf-ricerca-sequenziale` livello 3 (65), `inf-bubble-sort` livello 4 (70), `inf-confronto-algoritmi` livello 4 (89). Servono più contesti nella domanda (nomi, che cosa si ordina o si cerca), nel generatore e nel suo controllo.
- [ ] **Un esercizio letto per livello, non cinque.** Un errore che esce solo in una famiglia rara può essere sfuggito: da rileggere cinque esercizi per livello.
- [ ] **Risposte aperte non riconsegnate nel browser** dopo il collegamento dei generatori: né giusta, né sbagliata, né giusta senza il costrutto. Lo script dell'integrazione ha aperto la pagina e non ha consegnato un programma.
- [ ] **Figure interattive guardate dal revisore solo al primo passo e in chiaro** (a 390 px). In scuro solo quelle dentro i fogli della 81 e della 97; i comandi non sono stati usati, tranne la gara della 78.
- [ ] **Formulari e flashcard non riletti per intero**: solo `check.mts` e ricerche mirate, e non sono stati aperti nel browser.
- [ ] **Solo Chromium** anche nella revisione e nell'integrazione; il messaggio di convalida del browser è stato visto in inglese.
- [ ] **I percorsi di `config.ts` non sono stati confrontati con il database**: le lezioni non ci sono ancora, quindi il confronto è solo con `docs/lezioni/informatica/originali/index.json`. Se i capitoli avranno slug diversi, le 34 righe vanno corrette.
- [ ] **Lezioni intere a 390 px** guardate a pezzi solo per 11 lezioni su 34 (66, 69, 72, 76, 78, 81, 84, 88, 91, 95, 97); le altre le ha controllate solo lo script.
- [ ] **`rng.ts`**: con i semi da 424243 a 424642 la prima estrazione tra cinque esce sbilanciata. Non corretto, vedi "Domande aperte" in [[Pipeline esercizi]].
- [ ] **`inf-html-elenchi-tabelle`**: l'elenco annidato `gruppo` ha nove nomi (tra cui Sara e Giulia) divisi in voci, chitarre e ritmo. Non è il filo dei Fuori Tempo e non è stato toccato: da decidere se cambiargli nome.
- [ ] Gli altri difetti visti e lasciati sono nella sezione "Difetti non corretti" del rapporto di revisione (il tasto "Verifica" su una seconda riga a 390 px, la punteggiatura dopo una formula in linea, il contorno della parola scelta in `inf-markup-testo-albero-pagina`, `x` con due significati tra 71, 74 e 77, `<button>` e `<input>` senza `type` in 95, 97 e 98).

## Fonti e fatti da verificare
Gli elenchi interi sono nella sezione "Da verificare" di ogni nota. I più pesanti:
- [ ] **80**: il punto e virgola come separatore nei fogli di calcolo in italiano (viene dal separatore di elenco delle impostazioni internazionali); la RFC 4180 (Shafranovich, ottobre 2005) non è nominata.
- [ ] **81**: XML 1.0, raccomandazione del W3C del 10 febbraio 1998; JSON in ECMA-404 (ottobre 2013) e RFC 8259 (dicembre 2017); la fattura elettronica come esempio di XML (formato FatturaPA); gli attributi tra apici singoli.
- [ ] **82**: le firme dei formati (PNG, JPEG, GIF, PDF, ZIP), scritte a memoria; PDF come ISO 32000-1 del 2008 e ODT come ISO/IEC 26300 del 2006; "WebM è nato per le pagine web"; WebP "di solito con file più piccoli".
- [ ] **84**: la tabella di quantizzazione di JPEG (ITU-T T.81, allegato K) usata dalla figura, scritta a memoria; Deflate come RFC 1951 del 1996; "una foto senza perdita si dimezza, più o meno".
- [ ] **85**: i numeri del CD (44,1 kHz, 16 bit, 1411,2 kbit/s); "a 320 kbit/s quasi nessuno distingue il file dall'originale"; FLAC "circa la metà"; 24, 25, 30 e 60 fotogrammi al secondo; 5 Mbit/s per un Full HD.
- [ ] **86**: l'origine delle grazie (Catich, "The Origin of the Serif", 1968, da verificare); i 16 pixel e l'interlinea tra 1,4 e 1,6; il maiuscolo che si legge più lentamente; quali font sono installati su quali dispositivi.
- [ ] **88, 89**: `title` nei risultati dei motori di ricerca; "senza `meta charset` il browser indovina la codifica"; `width` e `height` che riservano il rettangolo prima che il file arrivi (MDN non consultata).
- [ ] **90, 91**: le regole su che cosa invia un modulo e la codifica dell'indirizzo (HTML Living Standard e URL Standard del WHATWG), scritte a memoria e confrontate solo con `URLSearchParams`; il testo fuori dalle celle spostato sopra la tabella; l'aspetto di `date` e `number`, visto solo in Chromium; le frasi sugli screen reader, non provate.
- [ ] **92, 93**: tutti i fatti sul CSS sono scritti a memoria: l'ordine delle origini nella cascata (CSS Cascading and Inheritance Level 4), `border-style` che parte da `none`, `width` e margini verticali sugli elementi in linea (CSS 2.1, 10.3.1 e 10.6.1), i margini che si fondono (CSS 2.1, 8.3.1), i 148 colori con nome.
- [ ] **95**: i 980 px che un telefono finge senza la riga del viewport, i 16 px di partenza del carattere, `a` senza `href` che non prende il fuoco, la legge Stanca (n. 4 del 2004) citata in una domanda della nota. Il contrasto invece è verificato su WCAG 2.2 (W3C, 12 dicembre 2024), letta il 7 ottobre 2026.
- [ ] **96, 98**: la storia del nome JavaScript (Wirfs-Brock e Eich, "JavaScript: the first 20 years", HOPL IV, 2020, da controllare); le regole di `defer` e l'ordine "controlli dell'HTML, poi `submit`" (HTML Living Standard); `value` di un campo `number` non valido; i messaggi di errore citati sono quelli di Chromium.
- [ ] **70, 72, 73, 76, 77**: quello che fa il C++ con un indice fuori dal vettore non è definito dal linguaggio; le lezioni descrivono il Clang del sito senza citare numeri. Da rileggere che nessuna frase lo dia per regola.
- [ ] **76**: l'origine del nome "a bolle" non ha una fonte con nome e data. **78**: "cento milioni di confronti al secondo" è un'ipotesi dichiarata. **94**: la storia delle tabelle usate per impaginare è senza fonte.

## Prove mai fatte
- [ ] Safari e Firefox: tutto il lotto è stato provato solo in Chromium di Playwright, tranne gli errori dell'HTML della 88. In particolare l'invio dei moduli e `input:invalid` (91), `font-family` calcolato (86), `classList.toggle` (97).
- [ ] Un telefono vero: lezioni e figure sono state guardate solo a 390 px in Playwright.
- [ ] Uno screen reader: nessuna figura è stata provata; le etichette `aria` sono state lette dal DOM. La tastiera è stata provata solo su parte delle figure.
- [ ] `prefers-reduced-motion`: misurato solo su `inf-css-flexbox`.
- [ ] La scheda da stampare degli esercizi e le lezioni in stampa.
- [ ] Il tema scuro sulle lezioni intere dei gruppi 8 e 14 (82-84, 96-98).
- [ ] Formulari e flashcard nel browser (gruppo 7 non li ha guardati; gli altri rapporti non lo dicono).
- [ ] Le pagine vere dopo la pubblicazione: finora solo `/prova-grafico/lezione` e `/prova-grafico/esercizio` in sviluppo.

## Collegamenti
- [[2026-10-07 Terzo anno di informatica]], [[Domande per Andrea]], [[Pipeline lezioni]], [[Pipeline esercizi]], [[Editor di codice]], [[Agenda]]
