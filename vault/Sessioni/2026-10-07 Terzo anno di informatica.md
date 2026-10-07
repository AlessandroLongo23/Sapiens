---
aggiornato: 2026-10-07
tag: [sessione, contenuti, informatica]
---
# Terzo anno di informatica

Sessione del 7 ottobre 2026, seguito di [[2026-10-05 Secondo anno di informatica]]. Alessandro ha chiesto: "scrivi le lezioni, formulari, esercizi e flashcard di informatica [terzo anno], avendo cura degli elementi interattivi nella lezione". Sono scritte le 34 lezioni del terzo anno, file 65-98, in otto capitoli, ciascuna con nota, formulario, flashcard, figure interattive e generatore di esercizi con specifica e controllo.

- Le funzioni (5 lezioni, 65-69)
- Vettori, matrici e stringhe (4, 70-73)
- Ricerca e ordinamento (5, 74-78)
- I file (3, 79-81)
- Immagini, suoni e video digitali (5, 82-86)
- HTML (5, 87-91)
- I fogli di stile (4, 92-95)
- Pagine web interattive (3, 96-98)

Il codice è in produzione dal 7 ottobre (PR #51, unita dopo i controlli) e i testi delle 34 lezioni, con formulari e flashcard, sono pubblicati nel database lo stesso giorno, con il via di Alessandro: 102 scritture e 10 figure TikZ compilate. Dopo la pubblicazione sono state aperte in produzione, a 390 px, sei pagine (cinque lezioni e una scheda di esercizi) e tre figure interattive sono state usate fino a metà: nessun errore. Quello che resta aperto è in [[Informatica terzo anno, da sistemare]].

## Cosa si è fatto
- Prima dei gruppi, il brief `docs/lezioni/informatica/brief-terzo-anno.md` (gruppi, scelte del lotto, confini tra le 34 lezioni, forma del rapporto) e tre agenti che hanno preparato quello che al sito mancava:
  - i file in C e C++ nell'editor (un file system in memoria dietro le chiamate WASI, `src/components/codice/wasi-files.ts`), i file scritti da un programma che ricompaiono nel progetto in Python e in C++, `%% file <nome>` negli esercizi, e `verifica.mts` che esegue i progetti;
  - il modulo `src/lib/exercises/v2/inf-codice.ts` con il controllo `_inf_codice.py`, per gli esercizi con programmi scritti a mano nei due linguaggi (il linguaggio dei diagrammi non ha funzioni né vettori), i frammenti `listing` di HTML, CSS e JavaScript, e i costrutti `funzione` e `vettore` che un livello aperto può chiedere; il brief è `docs/lezioni/informatica/brief-esercizi-codice.md`;
  - il kit delle figure interattive di informatica (`src/components/content/interactive/informatica.tsx` e la cartella `informatica/`, con le tracce degli algoritmi in `src/lib/informatica/tracce.ts`), descritto nella sezione "Figure interattive" di `docs/lezioni/informatica/README.md`.
- Quattordici gruppi in parallelo nella stessa cartella, da due o tre lezioni ciascuno. In tre gruppi i generatori li hanno scritti dei sottoagenti (67 e 68 nel gruppo 2, 76-78 nel gruppo 6, 96-98 nel gruppo 14).
- Durante e dopo i gruppi, l'editor corretto su loro segnalazione: vedi "Lavoro sul sito".
- Dopo i gruppi (chi coordina): i 34 generatori collegati al sito nel worktree, in `index.ts`, `config.ts`, `level-names.ts`, e i 16 livelli aperti dichiarati in `v2/open-answers.ts`.

## Numeri
I totali sono la somma dei 14 file `gruppo-NN.json` dei rapporti; dove ho contato anche dai file lo dico.

- 34 lezioni, 11.951 righe secondo i rapporti (12.017 con `wc -l` sui file di `riscritte/` dopo la revisione).
- 65 programmi da eseguire nelle lezioni, 79 esercizi di "Prova tu", 58 pagine web. I gruppi non hanno contato tutti allo stesso modo (una coppia Python e C++ vale uno nelle lezioni 65-85; nel gruppo 14 un programma è un blocco `codice javascript` e una pagina è un gruppo `html`, `css`, `js`, esempi ed esercizi insieme). Nei file i blocchi sono 89 `codice python`, 88 `codice cpp`, 4 `codice javascript`, 56 `codice html` e 14 `codice index.html`.
- Dei 79 esercizi, 43 hanno le prove (`%% prova`, eseguite da `verifica.mts`) e 36 sono pagine con `%% controllo`, provate nel browser: la divisione viene dal campo `verifica` dei rapporti.
- 46 figure interattive nuove, contate nelle righe aggiunte a `FIGURES` in `src/lib/utils/interactive.ts`; i blocchi `interattivo` nelle lezioni sono 47, perché la 83 riusa `inf-pixel-risoluzione-profondita` del kit. La 78 ha anche un blocco `grafico`.
- 10 figure TikZ (66, 80, 81, 82, 86, 87, 88, 90, 92, 94), nessun blocco `diagramma`.
- 634 flashcard (somma dei rapporti, uguale al conto dei titoli `## ` nei 34 file).
- 34 generatori, 183 livelli (il conto non è cambiato con l'integrazione: è la somma della tabella del suo rapporto e delle righe di `level-names.ts`). 16 livelli a risposta aperta "scrivi il programma", uno per generatore nelle lezioni 65-80; le lezioni 81-98 sono tutte a scelta multipla.
- 12 file di test nuovi in `tests/unit/informatica-*.test.mjs`, 68 prove secondo i rapporti, per le funzioni pure delle figure (tracce, lettura dei selettori, contrasto, compressione, celle unite).

## Le figure interattive, lezione per lezione
Ogni figura risponde a una domanda che il testo fa prima e a cui risponde dopo.

- **65** `inf-definire-funzione-passi`: in che ordine vengono eseguite le righe di un programma con una funzione, e da dove riprende il programma quando la funzione ha finito?
- **66** `inf-parametri-ritorno-passi`: quale argomento finisce in quale parametro, e dove va il valore dopo `return`?
- **67** `inf-visibilita-pila`: mentre `punti` calcola, quante variabili `totale` ci sono e quanto valgono?
- **68** `inf-passaggio-parametri-pila`: se dentro `scambia` lo scambio avviene, dove finisce? Sostituisce `inf-scambia-valore-riferimento`, che resta registrata e non è usata.
- **69** `inf-top-down-albero`: fin dove conviene scendere, e in che ordine si scrivono le funzioni?
- **70** `inf-vettore-indice-elemento`: quale elemento è `voti[3]`, e che cosa c'è in `voti[5]`? `inf-vettore-scorri-passi`: che cosa cambia giro dopo giro, e che cosa succede all'ultimo giro con `i <= 5`?
- **71** `inf-ricerca-sequenziale-posizione`: quanti elementi guarda la ricerca, e che cosa cambia se non si ferma al primo? `inf-ricerca-sequenziale-casi`: quanti confronti servono a seconda del posto del valore?
- **72** `inf-matrice-indici`: con quali due indici si scrive un elemento, e quale viene prima? `inf-matrice-somme`: in che ordine i due cicli visitano i voti, e che cosa cambia per colonne?
- **73** `inf-stringa-vocali`: quanti giri fa il ciclo e in quanti il contatore sale? `inf-stringa-palindroma`: quanti confronti servono, e quando ci si ferma?
- **74** `inf-ricerca-binaria-armadietti`: quanti elementi guarda la ricerca binaria per trovare il 21 tra otto numeri, e quanti per sapere che il 30 non c'è? `inf-ricerca-binaria-sequenziale`: sullo stesso vettore ordinato, quanti confronti fa la sequenziale e quanti la binaria?
- **75** `inf-selection-sort-imin`: quanti confronti e quanti scambi servono per ordinare sei tempi, e che cosa cambia con un vettore già in ordine?
- **76** `inf-bubble-sort-giri`: quanti confronti e scambi sui sei tempi, e che cosa risparmia la bandierina?
- **77** `inf-insertion-sort-carte`: per ogni carta, quanti confronti prima di fermarsi e quanti spostamenti?
- **78** `inf-gara-ordinamenti`: sullo stesso vettore, chi fa meno confronti e chi sposta meno? `inf-gara-ricerche`: quanti confronti alle due ricerche per l'ultimo elemento e per uno assente? Più il grafico `crescita-confronti-quadrato-lineare-logaritmo`.
- **79** `inf-file-lettura-righe`: che cosa finisce in `riga` a ogni giro, e da dove riparte la lettura al giro dopo?
- **80** `inf-csv-campi`: dove taglia il programma una riga, e che cosa succede se il separatore non è quello del file?
- **81** `inf-albero-xml-json`: che cosa corrisponde, in XML e in JSON, a ogni nodo dell'albero?
- **82** `inf-scegli-formato`: quale formato conviene per questa immagine, e perché gli altri no?
- **83** `inf-bitmap-vettoriale-zoom`: che cosa succede ingrandendo la stessa figura come bitmap e come vettoriale? Più `inf-pixel-risoluzione-profondita` del kit.
- **84** `inf-rle-riga`: quando RLE accorcia una riga di pixel, e quando la allunga? `inf-compressione-perdita`: quanto si può buttare prima che si veda?
- **85** `inf-audio-video-dimensione`: quanto occupa un brano o un video senza compressione, e quanto con il bitrate di un file compresso? `inf-video-fotogrammi-differenza`: quanti pixel cambiano davvero da un fotogramma al successivo?
- **86** `inf-font-bitmap-contorno`: che cosa succede a una lettera ingrandendola, se è una griglia di pixel e se è un contorno?
- **87** `inf-markup-testo-albero-pagina`: che cosa hanno in comune il testo marcato, l'albero e la pagina?
- **88** `inf-html-albero-documento`: come nasce l'albero dal file, e che albero esce senza `</h2>`?
- **89** `inf-html-percorsi-sito`: che cosa cambia nel percorso relativo cambiando pagina, e che cosa non cambia nell'indirizzo assoluto?
- **90** `inf-html-celle-unite`: quando una cella ne prende due, quale cella sparisce dal codice, e da quale riga?
- **91** `inf-html-modulo-inviato`: di quello che scrivi in un modulo, che cosa parte, con che nome, e dove viaggia con GET e con POST?
- **92** `inf-css-selettori`: quali elementi prende un selettore, e perché `nav a` ne prende meno di `a`? `inf-css-cascata`: cinque regole danno un colore allo stesso paragrafo, quale vince?
- **93** `inf-css-scatola-strati`: quanto è largo davvero un riquadro con `width: 200px`? `inf-css-box-sizing-confronto`: due riquadri con la stessa regola e `box-sizing` diverso, quale è largo 200 px? La figura `inf-css-modello-scatola` del kit resta registrata e non è usata.
- **94** `inf-css-flexbox`: con `column`, `justify-content: center` centra in orizzontale o in verticale, e che cosa succede a cinque elementi che non ci stanno?
- **95** `inf-media-query-larghezza`: a quale larghezza `main` e `aside` si affiancano? `inf-contrasto-colori`: il grigio chiaro su bianco è sufficiente, e il bianco sull'arancione?
- **96** `inf-script-ordine-lettura`: quando lo script cerca `#liberi`, il browser lo ha già costruito? `inf-js-costrutti-confronto`: che cosa cambia tra il costrutto che conosco e quello di JavaScript?
- **97** `inf-dom-albero-eventi`: quando premo un bottone, quale nodo riceve l'evento e quale viene cambiato?
- **98** `inf-modulo-percorso-dato`: che strada fa il dato dal campo al messaggio o all'invio, e quale controllo ferma tre spazi?

## Scelte da confermare
Le ha fissate chi coordina nella sezione "Scelte del lotto" del brief, il 7 ottobre, e vanno confermate con Alessandro e Andrea. Le domande che ne nascono sono in [[Domande per Andrea]], sezione "Informatica, terzo anno".

- **Linguaggi.** Nelle lezioni 65-80 ogni programma è in Python e in C++, in due blocchi consecutivi, con le differenze in un riquadro dopo il programma. La 81 ha i programmi solo in Python (modulo `json`) e lo dice.
- **Funzioni.** In C++ la funzione si definisce prima di `main`, senza prototipi; `void` per chi non restituisce niente. Parole: "definire" e "chiamare", "parametro" e "argomento", "valore di ritorno", "restituire".
- **Passaggio dei parametri (68).** Un modello per linguaggio: in C++ per valore e per riferimento con `&`; in Python il nome legato a un valore, senza forzarlo nelle parole del C++. I puntatori non si nominano.
- **Vettori.** In C++ array a dimensione fissata da una costante (`const int N = 5; int v[N];`), passati come `int v[], int n`; `vector` solo in un riquadro della 70. In Python le liste, con `len` e `append`. "Vettore" nel testo, "array" e "lista" come nomi nei due linguaggi.
- **Matrici e stringhe.** `int m[R][C]` e lista di liste, `m[i][j]` con `i` riga e `j` colonna; in C++ `string`, non array di `char`.
- **Ordinamenti.** Sempre in ordine crescente, come funzione `ordina`, con lo scambio attraverso `temp`; nomi `i`, `j`, `imin`, `scambiato`. Niente notazione O grande: si contano confronti e scambi, e la 78 arriva a "cresce come $n^2$" e "cresce come $\log_2 n$".
- **File.** In Python `open` dentro `with`; in C++ `ifstream` e `ofstream`. I file stanno nel progetto, come linguette accanto al programma.
- **Pagine web (87-98).** HTML5 con doctype e `lang="it"`, elementi semantici dalla 88, CSS in un file separato, impaginazione con flexbox (griglia solo nominata, niente `float`), JavaScript in un file separato con `const` e `let`, `querySelector`, `addEventListener`, senza `onclick` nell'HTML e senza librerie.
- **Diagrammi di flusso.** Il linguaggio dei blocchi `diagramma` non ha funzioni né vettori: nel lotto non ce n'è nessuno, e al loro posto ci sono le figure del kit.
- **Filo dei capitoli sul web.** Il sito di un gruppo musicale della scuola, "I Fuori Tempo"; ogni lezione ne costruisce un pezzo da capo.

Scelte dei gruppi che toccano più lezioni: lo scambio nella selezione solo quando `imin != i` (75, e i conti della 78); -1 come "non trovato" nei due linguaggi (71, 74); un confronto contato per ogni elemento guardato (71, 74, 78); negli esercizi il vettore dichiarato `int v[6]` o `int v[MAX]` con `MAX = 100`, senza la costante `N` delle lezioni (75, 76); la 86 che usa un foglio di stile prima della lezione sul CSS; nomi veri di font nel generatore della 86.

## Verifiche fatte
- `check.mts` su lezione, formulario e flashcard di ogni lezione: nessun errore. Avvisi rimasti: 13 grassetti nella 81 (i termini definiti) e, nella 86 e nella 87, l'avviso sulle pagine web i cui controlli si provano nel browser, lo stesso che `verifica.mts` dà per la 90 e la 91.
- `verifica.mts`: tutti gli esercizi con le prove passano nei due linguaggi (2 per lezione nelle 65-82, 84 e 85; 1 nella 83; 2 in JavaScript nella 96).
- Gli esercizi di pagina provati nel browser dai gruppi con uno script di Playwright: la pagina di partenza bocciata e la soluzione promossa in tutti; risposte sbagliate scritte apposta e bocciate nelle lezioni 88-91, 94, 95, 97 e 98.
- Ogni generatore: 1000 esercizi per livello con i seed 1, 50001 e 777001 attraverso `verify.py`, tutti PASS. Errori piantati apposta e bocciati, con le eccezioni dette sotto.
- Le figure interattive guardate sul sito di sviluppo in chiaro, in scuro e a 390 px, al primo passo, a metà e alla fine; i gruppi hanno corretto dopo aver guardato (legende su due righe, altezze che cambiavano tra i passi, stili della pagina che entravano in `ol`, `ul` e `pre`).
- Le lezioni aperte dai gruppi su `/prova-grafico/lezione` a 1280 e a 390 px, con i programmi eseguiti e "Verifica" premuto con la soluzione.
- Il comportamento del browser davanti agli errori dell'HTML (88) provato su Chromium, WebKit e Firefox di Playwright: i tre costruiscono lo stesso albero.
- Le soglie del contrasto (95) lette su WCAG 2.2, W3C Recommendation del 12 dicembre 2024, il 7 ottobre 2026.
- `tsc` sull'intero progetto a 0 errori nelle ultime passate dei gruppi 3, 5 e 11; ESLint pulito sui file di ogni gruppo.

## Verifiche non fatte
- **`tsc` sull'intero progetto.** I gruppi 2 e 6 non lo hanno lanciato; i gruppi 9 e 13 dopo l'ultima correzione hanno ricontrollato solo i propri file; il gruppo 14 ha guardato solo i propri. Dai rapporti non risulta una passata sull'intero progetto dopo il collegamento dei generatori.
- **Generatori scritti da sottoagenti.** Per 67, 68, 76, 77 e 78 chi ha chiuso il gruppo ha rilanciato i tre seed e letto i nomi dei livelli, e non ha visto di persona il C++, gli errori piantati, il numero di esercizi diversi e le pagine a 390 px (per 76-78 nemmeno le risposte aperte consegnate); non ha riletto il codice né le specifiche. Per 96-98 il rapporto del sottoagente non era arrivato alla chiusura.
- **C++ degli esercizi.** Controllato con `INF_CPP=1` su un campione (25 esercizi per livello quasi ovunque, 20 nella 66, 80 e 60 nella 72 e nella 73), non sui 1000. Il resto è controllato solo in Python. Nella 73 il campione aveva trovato un errore vero, corretto.
- **C++ nel browser.** I programmi della 65 non sono stati eseguiti in C++ nel browser, e della 66 tre su quattro; passano con `clang++ -Wall` e con `verifica.mts`.
- **Messaggi di errore citati.** Quelli delle lezioni 65-68 sono stati letti con il Python 3.9 e il `clang++` del Mac, non nell'editor del sito.
- **Un solo browser.** Tutte le prove sono in Chromium di Playwright, tranne quella della 88. Niente Safari, niente Firefox, nessun telefono vero.
- **Screen reader.** Nessuna figura provata con uno vero. La tastiera è stata provata in modo diseguale (in alcuni gruppi solo Fine e Invio, nel gruppo 8 solo su `inf-rle-riga`). Il movimento ridotto è stato misurato solo su `inf-css-flexbox`.
- **Tema scuro.** Le lezioni intere non sono state guardate in scuro dai gruppi 8 e 14; la figura TikZ della 82 solo in chiaro.
- **Figure TikZ con lo script.** `anteprima.mjs` non partiva nel worktree: vedi "Incidenti".
- **Pagine degli esempi.** Le modifiche che il testo chiede allo studente non sono state rifatte una per una nelle lezioni 86, 92 e 93.
- **Esercizi generati nel browser.** I gruppi 8, 9, 12 e 14 non hanno cliccato le opzioni fino al verdetto; in più gruppi solo alcune schermate sono state lette con attenzione (5 nel gruppo 3, 5 nel 7, 8 su 32 nell'8, 15 su 33 nel 12) e le altre controllate dallo script per scorrimento laterale ed errori.
- **Gruppo 14.** Le 12 risposte sbagliate delle lezioni 97 e 98 sono state provate prima dell'ultima modifica ai controlli e non rilanciate.
- **Altro.** La scheda da stampare degli esercizi, i formulari e le flashcard nel browser (gruppo 7), i link verso le altre lezioni (non pubblicate), il cursore del grafico della 78.
- **Fatti.** Storia, norme e dettagli dei formati sono scritti a memoria nelle lezioni 80-87, 91-93 e 96, ed elencati sotto "Da verificare" in ogni nota.

## Lavoro sul sito
Lo stato dell'editor è in [[Editor di codice]]; la sintassi per chi scrive le lezioni è in `docs/lezioni/README.md`, "I programmi da eseguire".

- **Prima dei gruppi:** i file letti e scritti dai programmi in C, C++ e Python, `%% file`, `verifica.mts` sui progetti; `inf-codice.ts` e i costrutti `funzione` e `vettore`; il kit delle figure.
- **Durante il lotto:** i controlli sul comportamento delle pagine. Un `%% controllo` può cominciare con delle azioni (`> clic`, `> scrivi`, `> scegli`, `> spunta`, `> invia`, `> premi`, `> aspetta`) e ha regole nuove (`visibile`, `nascosto`, `classe`, `valore`, `inviato`, `@avviso`).
- **Dopo le segnalazioni dei gruppi:**
  - l'anteprima fa partire la convalida e l'evento `submit`: l'iframe ha ora `allow-forms`, con `form-action 'none'`, e la console dice che cosa sarebbe stato inviato. Il ragionamento sulla sicurezza è nel commento di `src/app/codice-sandbox/pagina/route.ts`. Lo avevano segnalato i gruppi 11 e 14 come il limite più pesante;
  - la regola `stile` confronta bene lo spessore di un bordo (segnalato dal gruppo 12: `border-top-width = 2px` bocciava la soluzione giusta);
  - un link `pagina.html#id` scorre al punto (gruppo 10);
  - `attributo` su `href`, `src` e `action` accetta percorsi relativi equivalenti (gruppo 10: `./scaletta.html` veniva bocciato);
  - `> larghezza N` fissa la larghezza dell'anteprima per un controllo, e lo studente ha tre tasti di larghezza (gruppo 13: una media query non si poteva correggere).

Queste correzioni sono arrivate dopo che alcune lezioni erano state scritte attorno al difetto: vedi la sezione sull'editor in [[Informatica terzo anno, da sistemare]].

## Incidenti
1. **Una prova e2e sul database di produzione.** L'agente dell'editor ha fatto partire per sbaglio la prova "saved programs", che crea un utente di prova sul database di produzione e lo cancella. Ha poi verificato con due query che non sono rimasti utenti `e2e-%` né righe in `programs`.
2. **Un file sovrascritto.** Alle 13:57 il gruppo 2 ha creato `Listato.tsx` in `src/components/content/interactive/informatica/`. Il disco del Mac non distingue maiuscole e minuscole, e la scrittura è finita su `listato.tsx` del gruppo 11, usato da `CelleUnite.tsx` e `ModuloInviato.tsx`. Il gruppo 2 lo ha ripristinato in circa un minuto dalle source map di `.next` (`sourcesContent`, 2920 byte, con le esportazioni `Listato`, `Tasto`, `Codice`, `Titolino`): è la versione dell'ultima compilazione prima dell'incidente, e se il gruppo 11 aveva salvato modifiche negli ultimi secondi senza che il sito le ricompilasse, quelle sono perse. Il gruppo 11 ha poi modificato di nuovo il file (data del file 14:13) e ha chiuso con `tsc` a 0 errori e le due figure guardate. Il file del gruppo 2 ora si chiama `PilaProgramma.tsx`; la copia recuperata e il file originale del gruppo 2 sono in `gruppo-02/recupero/` nello scratchpad. Nel frattempo il sito di sviluppo ha dato per qualche minuto un errore di compilazione, visto dai gruppi 8, 9 e 13.
3. **`node-tikzjax` mancava nel worktree.** Il pacchetto ha un suo `package.json` in `scripts/figure/`, che nel worktree non era installato: molti gruppi non hanno potuto guardare le figure TikZ con `anteprima.mjs`, oppure lo hanno lanciato in sola lettura dalla cartella principale `Sapiens`, con l'uscita nello scratchpad. È stato installato a lotto in corso; le figure le riguarda il revisore.

## Informazioni nuove
- Tre gruppi hanno scritto lo stesso pezzo, un listato con la riga in esecuzione accesa: `ProgrammaPassi.tsx` (gruppo 1), `PilaProgramma.tsx` (gruppo 2) e `listato.tsx` (gruppo 11). L'albero di nodi con i rami è stato rifatto in cinque figure (69, 81, 87, 88, 97).
- Dentro una lezione gli elementi `pre`, `table`, `ol`, `ul`, `li`, `h4` e `p` di una figura prendono lo stile di `.markdown-content`: i gruppi 7, 9, 12 e 14 lo hanno scoperto ognuno per conto suo e sono passati a `div` con i ruoli.
- Una lettera accentata dentro un nodo TikZ fa fallire TikZJax nella pagina di anteprima, anche se `anteprima.mjs` la compila (gruppo 12); un `<` o un `>` scritto come testo rompe l'SVG (gruppo 9).
- Il carattere monospazio lega `===` in un segno solo: nelle figure del gruppo 14 le legature sono spente.
- Un avviso di React ("Can't perform a React state update on a component that hasn't mounted yet") è comparso una volta ai gruppi 4, 11 e 13 e non si è ripetuto; nessuno sa da quale componente venga.
- Due volte la consegna di una risposta aperta non ha dato il verdetto entro il tempo dello script (gruppo 4), e ripetuta lo ha dato subito.
- Per il prossimo lotto in una cartella condivisa: un nome di file che differisce da un altro solo per le maiuscole va vietato nel brief, e `scripts/figure/` va installato prima di partire.

## Limiti
- **Lunghezza.** Il testo da leggere è sotto le 50 righe indicate dal brief in quasi tutte le lezioni di programmazione e del web (da 21 a 45 paragrafi lunghi), con le righe totali spesso al limite delle 400 (la 72 a 400, la 79 a 399, la 76 a 398). Le lezioni di concetto superano le 200 righe contando i programmi e le pagine: la 82 ne ha 434, la 84 ne ha 348, le 85, 86 e 87 ne hanno 258, 284 e 305.
- **Risposte aperte.** Si correggono su quello che il programma scrive e sulla presenza del costrutto chiesto: una ricerca sequenziale dentro `cerca` o `v.sort()` dentro `ordina` passano (74, 75); nel livello 5 della 79 passa chi fa il conto senza usare il file; nel livello 6 della 80 le righe arrivano dalla tastiera, perché la pagina degli esercizi non dà file al programma dello studente.
- **Varietà.** Alcuni livelli hanno pochi esercizi diversi su 1000: 120 (85, livello 1), 129 (95, livello 6), 147 (87, livello 5), 162 (65, livello 1), 165 (89, livello 1), 171 e 206 (98, livelli 4 e 3), 192 (84, livello 1), 198 (83, livello 4). Contando quello che lo studente vede, il livello 5 della 73 ne ha 64.
- **Errori piantati non bocciati.** Solo dove il numero cambiato non entra nella risposta: 4 su 105 nel gruppo 8, 2 su 85 nella 95, e nel gruppo 14 la cifra cambiata in un frammento.
- **Controlli delle pagine.** Un controllo non guarda due momenti, quindi nel primo esercizio della 97 passa chi scrive `chiudi()` con le parentesi; `scrivi` toglie gli spazi intorno al testo, quindi nessun controllo verifica `trim()`; nell'esercizio 2 della 90 passano le celle scritte senza `<tr>`, che il browser ripara.
- **Lezioni vicine scritte in parallelo.** Tra 75 e 76: l'ordine delle parti, l'unità dei tempi (minuti o secondi), il posto di `const int N`. Tra 74 e 78: due figure con le due ricerche fianco a fianco.
- **Figure.** `inf-html-albero-documento` da telefono è alta circa 1160 px; nella 81 i due testi affiancati sono a 11 px sul telefono; `inf-stringa-vocali` porta in minuscolo la parola scritta e con "Aiuola" conta una vocale in più del programma; nel grafico della 78 il bottone "Reset" copre l'angolo vicino all'origine.
- Nella 85 non c'è audio da ascoltare. La 98 ha due esercizi e `checked` non ne ha uno.

## Revisione del lotto
Fatta il 7 ottobre in due parti: la revisione dei testi (lezioni, note, formulari e flashcard 65-98, con tre lettori in sola lettura sulle lezioni 65-78, 79-87 e 88-98) e l'integrazione degli esercizi (i 34 generatori collegati al sito e riletti). I due rapporti sono in fondo a `docs/lezioni/informatica/rapporti-terzo-anno.md`, dopo quelli dei 14 gruppi.

### Che cosa è stato corretto
- Le otto correzioni già note. Nella 91 le due frasi false sull'anteprima sono riscritte sul comportamento vero, e "porta i posti a 5 con le freccette" è diventato "scrivi 5" (con `max="4"` le freccette si fermano a 4). Nella 95 il testo fa usare i tre tasti di larghezza e il secondo esercizio ha due controlli con `> larghezza 400` e `> larghezza 900`. Nella 89 il progetto ha una seconda pagina con `index.html#contatti`, da provare. Nella 98 `Number.isInteger` è spiegato per quello che fa. Nella 93 il primo esercizio controlla lo spessore del bordo, e nella 97 un controllo sullo stato iniziale boccia `addEventListener("click", chiudi())`. Le 76 e 77 sono allineate alla 75: traccia dopo il programma, tempi in minuti, `const int N` e `const int MAX` fuori da `main`; la 78 usa `N` e la sua tabella è stata rifatta sui tre casi a 12 elementi. L'ottava, l'esercizio 2 della 90, non si è potuta chiudere (vedi sotto).
- I Fuori Tempo. I componenti erano quattro nelle lezioni 88-90, quattro con altri nomi nella 86, cinque nelle 92-95 e tre estranei nell'esercizio della 97. Ora sono dappertutto Sara (voce), Leo (batteria), Marta (chitarra) e Dario (basso): corrette 86, 92, 93, 94, 95 e 97 con i controlli dell'esercizio. Alla chiusura sono stati allineati anche i generatori `inf-markup`, `inf-css-layout` e `inf-responsive`, che avevano ancora Amir, Giulia, Pietro ed Emma. Il concerto a pagamento di 96 e 98 è diventato "di beneficenza", perché quello di fine anno nelle 88-91 è gratuito, e nella 89 il secondo concerto è il 27 giugno.
- Una quindicina di affermazioni false o vere a metà, nelle lezioni 68, 70, 71, 73, 74, 79, 82, 85, 87, 88, 89, 93 e 98. Tra queste: "gli argomenti vengono copiati nei parametri" contro il paragrafo su Python (68); `-1` che "non può essere un indice" contro `voti[-1]` della 70; `find` che "dà -1" in C++ (73); senza `strip()` non esce `81067` ma le quattro righe (79); il video "sempre" con perdita (82); la connessione "maggiore" del bitrate, mentre l'esercizio accetta l'uguale (85); gli spazi "ignorati" e XML "nato per i dati" (87); senza `</h2>` diventano titolo tutti i paragrafi che seguono (88); il disco che doveva deformarsi e non si deformava (89, ora l'SVG ha `preserveAspectRatio='none'`); `width` senza effetto sugli elementi in linea, immagini escluse (93); "tutti i controlli passano dallo script" (98). L'elenco intero è nel rapporto.
- Lessico, link e doppioni: codec e contenitore nella 85 con le parole della 82; tre link nella 69, che non ne aveva; "lettore di schermo" al posto di "screen reader" e "sintesi vocale" (90, 91, 94); `return 0;` nei `main` in C++ delle 82-85; "record" tolto dalla 80.
- Le formule in evidenza che a 390 px uscivano dalla colonna (76, 84, 85, 93, lezione e formulario) ora vanno a capo dopo l'uguale. Nella 78 e nella 95 due ritocchi per testi che andavano a capo male.
- Negli esercizi, due livelli in cui l'assegnamento poteva lasciare il valore com'era (`inf-vettori` livello 2 e `inf-matrici` livello 1, per esempio 8 al posto di 8): chi saltava l'assegnamento rispondeva giusto. Ora quei numeri vengono estratti di nuovo. Più altre correzioni di italiano o di forma in nove generatori ("Il 80%", una consegna spezzata, un suggerimento che parlava d'altro).
- Il limite di larghezza del programma di partenza. Misurato con Playwright a 390 px, l'editor mostra 38 caratteri senza scorrere e non 42, perché i numeri di riga prendono 36 px. `START_WIDTH = 38` è in `inf-codice.ts` e in `_inf_codice.py`, e otto generatori sono stati corretti per starci: `inf-definire-funzioni`, `inf-parametri-ritorno`, `inf-ricerca-binaria`, `inf-selection-sort`, `inf-bubble-sort`, `inf-insertion-sort`, `inf-top-down`, `inf-file-testo`. Le specifiche dei generatori 65-80 ora dicono 38 per il programma di partenza.
- In cinque livelli con poca varietà i distrattori vengono mescolati prima di sceglierne tre (prima uscivano sempre i primi tre della lista).
- Tolto il generatore di prova `inf-codice-prova` con specifica e controllo.

### Esiti dei controlli
Dal rapporto della revisione:
- `check.mts` su 102 file: 0 errori, un avviso (81, 13 grassetti, letti: sono termini definiti).
- `verifica.mts` su 65-98: 43 esercizi, 0 errori.
- 255 programmi in C++ e Python compilati (`clang++ -fsyntax-only`, `py_compile`): non compilano solo 6 programmi di partenza di esercizi, a cui manca la funzione da scrivere.
- `pagine-lezioni.mjs 87 98`: 32 blocchi, la soluzione passa sempre.
- Le 10 figure TikZ compilate e guardate in chiaro e in scuro: nessun difetto.
- Ogni lezione a 1280, 390 e 390 scuro, 102 pagine: nessuno scorrimento laterale, nessun `interattivo` vuoto, nessuna figura mancante. La console è pulita tranne che nella 96, dove l'errore è voluto (il terzo esercizio collega lo script senza `defer` apposta).

Dal rapporto dell'integrazione:
- I 34 generatori passano `verify.py` con quattro semi: 1, 50001 e 777001 a 1000 esercizi per livello, 600001 a 400.
- C++ compilato su 25 esercizi per livello con il seme 1 nei 16 generatori che hanno programmi: PASS.
- `npx tsc --noEmit -p .` 0 errori; `npx eslint src/lib/exercises` 0 errori e un avviso in un file di matematica; `npm run test:unit` 810 su 810.
- Nel browser a 390 px: 398 pagine di prova (semi 3 e 17 per ogni livello, più la risposta aperta dei 16 livelli aperti con l'editor in C++), con un'opzione cliccata fino al verdetto in ogni pagina a scelta multipla (85 giuste, 281 sbagliate). Nessuno scorrimento laterale. 38 schermate aperte e guardate.
- 184 esercizi letti secondo il rapporto, uno per livello.

Alla chiusura, dopo l'allineamento dei nomi, `inf-markup`, `inf-css-layout` e `inf-responsive` sono stati rilanciati con i semi 1, 50001 e 777001 a 1000 esercizi per livello: PASS tutti e nove.

### Che cosa resta rotto o aperto
- Nell'esercizio 2 della 90 le celle scritte senza `<tr>` passano ancora: il browser crea da sé il `<tr>` e l'albero è identico a quello della soluzione. Serve un controllo sul sorgente dello studente, che oggi non esiste.
- La figura della 88 da telefono è alta 1159 px, e quella della 94 è alta 1074 px. Per accorciarle serve un ridisegno.
- La 76 è salita a 408 righe (era 398) e la 82 a 439.
- Sette livelli hanno meno di 100 esercizi visibilmente diversi su 1000, anche dopo il mescolamento: `inf-selection-sort` 5 (20), `inf-ricerca-binaria` 4 (30), `inf-passaggio-parametri` 4 (40), `inf-stringhe` 5 (64), `inf-ricerca-sequenziale` 3 (65), `inf-bubble-sort` 4 (70), `inf-confronto-algoritmi` 4 (89). Sono livelli "quale programma è giusto" su un algoritmo fisso, con due, tre, quattro o undici domande diverse: per salire servono più contesti nella domanda, lavoro non fatto.
- Con i semi da 424243 a 424642 quattro generatori davano UNBALANCED con 400 esercizi giusti su 400: la prima estrazione tra cinque di `rng.ts` esce sbilanciata su quella finestra per tutti i generatori. Non corretto. Vedi [[Pipeline esercizi]].
- Altri difetti visti e lasciati (il tasto "Verifica" su una seconda riga a 390 px, la punteggiatura dopo una formula che va a capo da sola, le tabelle di traccia che scorrono nel loro riquadro, `x` con due significati tra 71, 74 e 77) sono in "Difetti non corretti" del rapporto.

### Che cosa non è stato controllato
- Le lezioni intere a 390 px sono state guardate a pezzi, e solo 11 su 34 (un foglio su due o tre). Le altre 23 le ha controllate solo lo script.
- Le figure interattive sono state guardate a 390 px in chiaro e solo al primo passo. In scuro solo quelle dentro i fogli della 81 e della 97. I comandi non sono stati usati, tranne la gara della 78.
- Nessun programma è stato eseguito nel browser dal revisore e "Verifica" non è stato premuto sugli esercizi di programmazione: per quelli c'è solo `verifica.mts`.
- Le dichiarazioni "nessun difetto" dei tre lettori non sono state verificate; verificate solo le correzioni proposte.
- Formulari e flashcard: `check.mts` e ricerche mirate, non una rilettura intera, e non sono stati aperti nel browser.
- Solo Chromium. Il messaggio di convalida del browser è stato visto in inglese.
- Degli esercizi è stato letto uno per livello e non cinque: un errore che esce solo in una famiglia rara può essere sfuggito.
- La consegna di una risposta aperta nel browser (giusta, sbagliata, giusta senza il costrutto) non è stata riprovata dopo il collegamento.
- Il C++ oltre i 25 esercizi per livello di un solo seme.
- La pagina esercizi vera di una lezione: le lezioni non sono nel database, quindi i percorsi di `config.ts` sono stati confrontati solo con `originali/index.json`. Se nel database i capitoli avranno slug diversi, le 34 righe vanno corrette.
- Le prove e2e (`tests/e2e/esercizi-informatica.spec.ts` crea utenti), gli errori piantati dopo le correzioni, il tema scuro e la scheda da stampare degli esercizi, un telefono vero.

## Stato
Scritto, rivisto e collegato in un worktree, poi unito a master con la PR #51 e pubblicato nel database il 7 ottobre 2026. Le copie dell'ultima versione pubblicata sono in `docs/lezioni/informatica/pubblicate/`.

## Collegamenti
- [[Informatica terzo anno, da sistemare]], [[Domande per Andrea]], [[Pipeline lezioni]], [[Pipeline esercizi]], [[Lezioni]], [[Esercizi]], [[Editor di codice]], [[Diagrammi di flusso eseguibili]]
- [[2026-10-05 Secondo anno di informatica]], [[2026-10-03 Primo lotto di informatica]], [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]
