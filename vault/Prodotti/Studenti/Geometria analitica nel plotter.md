---
stato: in sviluppo
release: da decidere
aggiornato: 2026-10-03
tag: [prodotto, studenti, strumenti, matematica, geometria]
---
# Geometria analitica nel plotter

Gli strumenti per costruire oggetti geometrici sul piano del [[Grafico di funzioni]]: la retta per due punti, la perpendicolare per un punto, la circonferenza di centro e punto dati o per tre punti. Li ha chiesti Alessandro il 2 ottobre 2026, con l'elenco di quelli di GeoGebra e Desmos e il modo d'uso di ciascuno.

La proposta è di Claude. Il 2 ottobre 2026 Alessandro ha deciso il primo giro, i clic prima della scrittura e lo stesso componente: [[2026-10-02 La geometria analitica sta nel plotter e si costruisce prima con i clic]]. Il resto è proposta.

## Stato attuale
Dal 2 ottobre 2026 il primo giro è scritto sul branch `grafico-funzioni`; dal 3 ottobre è committato e sta nella pagina `/strumenti/grafico-di-funzione`, dove i filmati degli strumenti sono anche nella pagina, con i dati strutturati `VideoObject`.

- La barra sul piano (`GeometryBar.tsx`): una colonna a sinistra su computer, una striscia che scorre in alto su telefono. Dodici strumenti: muovi, punto, intersezione, punto medio, retta per due punti, segmento, parallela, perpendicolare, asse del segmento, circonferenza di centro e punto, circonferenza per tre punti, distanza. Lo strumento resta in mano; Esc lascia prima i clic fatti, poi lo strumento. Una riga ai piedi del piano dice cosa manca.
- I clic (`geometry.ts`, `useGeometryTool`): su un punto lo usa; nel vuoto crea un punto libero, che si ferma sugli incroci della griglia; su un oggetto crea un punto vincolato; dove due oggetti si incontrano crea il punto di intersezione. Prima dell'ultimo clic l'oggetto si vede tratteggiato in grigio. Parallela e perpendicolare prendono retta e punto in qualunque ordine; punto medio e asse prendono anche un segmento.
- L'oggetto che dipende da altri (`src/lib/grafico/geometria.ts`): una riga può essere una costruzione (`build` in `PlotRow`: tipo e righe da cui parte), ricalcolata quando quelle cambiano. I punti liberi restano righe scritte, $A = (2; 3)$, e si trascinano come prima. Anche una formula è un oggetto: una retta, una circonferenza o una conica scritte come equazione o come funzione si riconoscono dai valori, quindi si può fare la parallela a $y = 2x + 1$ o l'intersezione tra una retta costruita e la parabola $y = x^2 - 4$.
- La riga di un oggetto costruito mostra il nome, la definizione a parole e l'equazione, che cambia mentre si trascina: $y = \frac{1}{2}x + \frac{5}{2}$, $x = 3$, $x^2 + y^2 - 4x - 2y - 20 = 0$ con centro e raggio, le lunghezze come $2\sqrt{5}$. I coefficienti sono frazioni quando lo sono, decimali altrimenti.
- Nomi: $A, B, C$ per i punti ($M$ per il punto medio se è libera), $r, s, t, u, v, w$ per le rette, $\gamma$ per le circonferenze, poi con il pedice.
- Togliere una riga toglie quello che ci è costruito sopra, senza chiedere: c'è l'annulla. Le costruzioni stanno nel link e nell'annulla. Un esempio nuovo, "Circonferenza per tre punti".
- Il pannello ha due sezioni che si aprono e si chiudono, ciascuna con il numero delle sue righe: "Formule", quello che si scrive, e "Costruzione", i punti messi con uno strumento e gli oggetti costruiti, nell'ordine in cui sono nati (Alessandro, 2 ottobre 2026: due sezioni, non una per tipo; l'altezza delle righe dei punti non si riduce). Un punto scritto a mano resta tra le formule. I parametri stanno tra le due.
- Le righe non vanno a capo: una formula o un'equazione lunga si taglia. La larghezza del pannello si cambia trascinando il bordo tra pannello e piano, o con le frecce (da 220 a 720 pixel, doppio clic per tornare all'inizio), e resta ricordata sul dispositivo.
- Con il mouse su uno strumento, o con il fuoco da tastiera, una scheda accanto alla barra dice cosa fa e mostra un filmato di pochi secondi dello strumento al lavoro. I dodici filmati sono in `public/grafico/geometria`, ciascuno in WebM (VP9), MP4 (H.264) e con un'immagine JPG, 640 × 400, tra 14 e 64 kB l'uno, con il nome che dice cosa mostrano (`retta-per-due-punti.mp4`). Li registra `scripts/grafico/record-tools.mjs` con Playwright e ffmpeg dalla pagina di prova: vanno registrati di nuovo quando cambia l'aspetto del piano. Su telefono la scheda non c'è: non c'è il passaggio del mouse.
- `tests/unit/geometria.test.mjs` (8 test) e uno in `grafico.test.mjs` per il link. Provato con Playwright su Chromium e WebKit a 1440 px, anche in tema scuro; su telefono solo uno screenshot a 390 px, senza toccare il piano.

Sempre il 2 ottobre 2026, non committato, il secondo giro: altri dieci strumenti, ventidue in tutto.
- Punti notevoli del triangolo (tre vertici o un triangolo, poi la scelta tra baricentro, circocentro, incentro e ortocentro, con le lettere $G$, $O$, $I$, $H$ se sono libere), semiretta, vettore (componenti e modulo), bisettrice (tre punti con il vertice per secondo, oppure due rette, e allora sono due), tangenti (a una circonferenza, a una conica, al grafico di una funzione: una nel punto della curva, due da un punto esterno, nessuna da dentro), circonferenza di centro e raggio (il raggio si scrive in un campo ai piedi del piano), compasso (un segmento o due punti danno il raggio, poi il centro), poligono (i vertici, e si chiude tornando sul primo: area e perimetro, con il nome triangolo o quadrilatero), angolo (tre punti o due rette; l'arco e l'ampiezza sul piano, il quadratino per l'angolo retto), pendenza (il gradino di una unità con $m$ accanto).
- La barra ha sette bottoni, uno per gruppo: muovi, punti, rette e segmenti e vettori, rette da una condizione, circonferenze, poligoni, misure. Ogni bottone mostra lo strumento del gruppo usato per ultimo; un clic lo prende e apre l'elenco degli altri, con il nome. Un angolino segna i gruppi con più strumenti.
- Due strumenti chiedono qualcosa che non è un clic: il raggio da scrivere e il punto notevole da scegliere. Il campo e i bottoni stanno nella riga ai piedi del piano.
- Un angolo di geometria si legge sempre in gradi, anche quando le funzioni usano i radianti.
- I filmati sono ventidue, 2 MB in tutto.
- `tests/unit/geometria.test.mjs`: 14 test.

Sempre il 2 ottobre 2026, non committato: gli oggetti si creano anche scrivendo ([[2026-10-02 Le parole del plotter stanno in un elenco solo, con i nomi italiani]]).
- Ventuno comandi, con il punto e virgola tra gli argomenti: `retta(A; B)`, `segmento`, `semiretta`, `vettore`, `parallela(r; A)`, `perpendicolare(r; A)`, `asse(A; B)`, `bisettrice(A; B; C)` o `bisettrice(r; s)`, `tangente(γ; A)` o `tangente(f; A)`, `circonferenza(C; A)`, `circonferenza(C; 3)`, `circonferenza(A; B; C)`, `compasso(A; B; C)`, `puntomedio(A; B)`, `intersezione(r; s)`, `baricentro`, `circocentro`, `incentro`, `ortocentro`, `poligono(A; B; C; …)`, `distanza`, `angolo`, `pendenza(r)`. Il tipo degli argomenti sceglie il modo: un punto e un numero danno la circonferenza dal raggio. Dove l'ordine non conta si accettano tutti e due (`parallela(A; r)`).
- Un argomento è il nome di un'altra riga: un punto ($A$), una funzione con un nome ($f$), una retta o una circonferenza costruita ($r$, $\gamma$, che si scrive `gamma`). Un raggio è un numero scritto come una formula senza lettere: $3$, $2{,}5$, $\sqrt{2}$.
- Mentre si scrive, la riga dice cosa manca ("Scrivi retta(A; B).", "Non c'è un oggetto C") oppure cosa farà Invio ("Premi Invio per creare: retta per A e B."), e l'oggetto si vede sul piano in grigio tratteggiato.
- Invio, o un clic altrove, crea le stesse righe dello strumento, nella sezione "Costruzione"; la riga scritta resta vuota, pronta per il comando dopo. Con un nome davanti l'oggetto prende quel nome, se è libero: `s = retta(A; B)`.
- Un'equazione prende un nome con i due punti davanti, come in GeoGebra (proposta di Alessandro, 3 ottobre 2026): `r: y = 2x + 1`, `s: x = 3`, `γ: x² + y² = 4`. Il nome vale nei comandi (`parallela(r; A)`, `intersezione(r; s)`), si può scrivere accanto alla curva, e gli strumenti non lo riusano per gli oggetti nuovi. Quando dopo i due punti c'è $y = \dots$ senza altre $y$, la riga è la funzione con quel nome, e le altre formule la usano: $y = r(x) + 2$. Le lettere $x$, $y$, $t$, $e$ non possono essere il nome di una funzione: `t: y = x` resta una retta di nome $t$. I due punti sono un nome solo davanti a un'equazione o a una disequazione: `a : b` da solo resta una divisione.
- `makeWritten` e `readLabel` in `src/lib/grafico/comandi.ts`; 4 test in `tests/unit/comandi.test.mjs`.
- Limiti: un comando confermato non si modifica come testo (si toglie e si riscrive, come con i clic); segmenti e poligoni non hanno un nome; manca `punto(r)` per un punto su un oggetto.

Limiti di questo giro:
- Le intersezioni si trovano tra rette, segmenti e coniche; tra due coniche solo se sono due circonferenze. Con una funzione che non è una retta o una parabola (un seno) no.
- Un punto si vincola a rette, segmenti, circonferenze e grafici di funzione; non a un'ellisse o a un'iperbole scritte come equazione.
- Gli assi non si scelgono come oggetti: per la perpendicolare all'asse $x$ serve la riga $y = 0$.
- Un numero irrazionale che non è una radice si scrive con tre decimali: l'intersezione in $-\sqrt{2}$ si legge $-1{,}414$.
- La distanza non si misura da una circonferenza.
- Il raggio scritto è un numero: non ancora un parametro con il cursore.
- La tangente al grafico di una funzione che non è una conica passa per il punto della curva con la stessa $x$ del punto scelto, come in GeoGebra; da un punto esterno non si cercano le tangenti.
- Il perimetro di un poligono è scritto con i decimali quando non è una frazione.
- Il campo del raggio e i bottoni della scelta non entrano nei filmati: stanno fuori dal riquadro registrato.
- I filmati oggi stanno solo nella scheda, che un motore di ricerca non legge: per la ricerca vanno messi anche nell'articolo della pagina vera, con i dati strutturati `VideoObject` (nome, descrizione, immagine, data, indirizzo del file). Da fare con la pagina sotto `/strumenti`.

## Cosa hanno GeoGebra e Desmos
Fonti, lette il 2 ottobre 2026: il manuale di GeoGebra (`geogebra.github.io/docs/manual/en/Tools/` e le pagine dei singoli strumenti, dal repository `github.com/geogebra/manual`) e la guida di Desmos Geometry (`help.desmos.com`, "Getting Started: Desmos Geometry", "Transformations", e la User Guide collegata).

GeoGebra ha una barra con una decina di gruppi e una cinquantina di strumenti. Quasi ogni strumento accetta, dove chiede un punto, un punto esistente o un clic nel vuoto che lo crea. Fanno eccezione la parallela e la perpendicolare, che vogliono una retta già disegnata, e il compasso. I numeri (raggio, ampiezza, numero di lati, rapporto) si scrivono in una finestrella. Ogni strumento ha un comando da scrivere (`Line(A, B)`, `PerpendicularLine(A, g)`, `Circle(A, B, C)`), e ogni oggetto ha una riga nella vista Algebra, che mostra a scelta l'equazione, la definizione a parole o il comando.

Desmos Geometry ha sei menu (selezione, punto, linea, cerchio, angolo, poligono) e una quindicina di strumenti. Parallela, perpendicolare e bisettrice partono da un oggetto già selezionato; le trasformazioni compaiono dopo aver selezionato un oggetto. Non ha, tra gli strumenti documentati: asse del segmento, tangente, circonferenza per tre punti, circonferenza di raggio scritto, coniche, poligono regolare, pendenza, luogo. Non mostra l'equazione di un oggetto costruito: mostra la sua definizione come chiamata (`circle(A, B)`).

Per una scuola italiana conta l'equazione: l'esercizio tipo è "trova la retta per $A$ e $B$", e la risposta è $y = 2x + 1$. GeoGebra è il modello da seguire; di Desmos si prende la barra corta.

| Strumento | GeoGebra | Desmos |
|---|---|---|
| Punto, punto su un oggetto, intersezione | sì | sì (intersezione e punto vincolato solo come funzioni) |
| Punto medio | sì | sì |
| Retta, segmento, semiretta, vettore | sì | sì |
| Segmento di lunghezza data | sì | no |
| Parallela, perpendicolare | sì | sì |
| Asse del segmento | sì | no |
| Bisettrice | sì (tre punti o due rette) | sì (da un angolo) |
| Tangenti | sì | no |
| Circonferenza di centro e punto | sì | sì |
| Circonferenza di centro e raggio scritto | sì | no |
| Compasso (raggio da un segmento) | sì | sì |
| Circonferenza per tre punti | sì | no (c'è l'arco per tre punti) |
| Arco, settore, semicirconferenza | sì | solo l'arco |
| Ellisse, iperbole, parabola, conica per cinque punti | sì | no |
| Poligono | sì | sì |
| Poligono regolare | sì | no |
| Angolo, angolo di ampiezza data | sì | sì (senza l'ampiezza data) |
| Distanza, lunghezza, area, perimetro | sì | sì (come funzioni o etichette) |
| Pendenza | sì | no |
| Simmetria rispetto a una retta e a un punto | sì | solo rispetto a una retta |
| Rotazione, traslazione, omotetia | sì | sì |
| Inversione circolare | sì | no |
| Luogo | sì | no |

## Proposta: come si usa

### Regole comuni a tutti gli strumenti
- La barra sta sul piano, a sinistra su computer e in basso su telefono. Il primo strumento è "Muovi", quello di oggi: trascina i punti, sposta il piano.
- Dove uno strumento chiede un punto valgono quattro gesti. Un clic su un punto esistente lo usa. Un clic nel vuoto crea un punto libero, che si aggancia all'incrocio della griglia se è vicino. Un clic su una curva o una retta crea un punto vincolato a quell'oggetto. Un clic dove due oggetti si incontrano crea il punto di intersezione.
- Sotto il piano una riga dice cosa manca: "Scegli il primo punto", "Ora il secondo". Dopo il primo clic l'oggetto si vede in anteprima e segue il puntatore.
- Lo strumento resta scelto dopo l'uso, per farne più d'uno di seguito. Esc o "Muovi" lo lasciano; a metà di una costruzione Esc annulla i clic già fatti.
- Ogni oggetto costruito diventa una riga del pannello, con il nome, la definizione a parole ("retta per $A$ e $B$") e l'equazione, che cambia mentre si trascinano i punti. Colore, spessore e tratto sono quelli di ogni riga.
- I nomi arrivano da soli: $A, B, C$ per i punti, $r, s, t$ per le rette, una lettera per le circonferenze (da chiedere ad Andrea).
- Un oggetto che dipende da un altro sparisce con lui. Togliere $A$ toglie la retta per $A$ e $B$: prima di farlo il plotter lo dice.
- Annulla, il link e l'immagine valgono per le costruzioni come per le formule.

### Primo giro: punti, rette, circonferenze
| Strumento | Come si usa | Cosa crea | Cosa mostra la riga |
|---|---|---|---|
| Muovi | Trascina un punto libero o vincolato; trascina il vuoto per spostare il piano | niente | |
| Punto | Un clic: nel vuoto, su un oggetto, su un'intersezione | Punto libero, vincolato o di intersezione | $A = (2; 3)$ |
| Intersezione | Clic sul primo oggetto, poi sul secondo | Tutti i punti in comune | le coordinate di ciascuno |
| Punto medio | Clic su due punti, oppure su un segmento | Il punto medio | $M = (1; 2)$ |
| Retta per due punti | Clic sul primo punto, poi sul secondo | La retta | $y = 2x + 1$, oppure $x = 3$ |
| Segmento | Clic sui due estremi | Il segmento | la lunghezza |
| Parallela | Clic sulla retta, poi sul punto (anche nel vuoto). Vale anche l'ordine inverso | La parallela per il punto | l'equazione |
| Perpendicolare | Come la parallela | La perpendicolare per il punto | l'equazione |
| Asse del segmento | Clic su due punti, oppure su un segmento | L'asse | l'equazione |
| Circonferenza di centro e punto | Clic sul centro, poi su un punto della circonferenza | La circonferenza | $x^2 + y^2 - 4x - 5 = 0$, centro e raggio |
| Circonferenza per tre punti | Clic su tre punti | La circonferenza; se sono allineati la riga lo dice | equazione, centro e raggio |
| Distanza | Clic su due punti, oppure su un punto e una retta, oppure su due rette parallele | Una misura, scritta sul piano | $d = 5$ |

È il nucleo del programma di terza: retta, fasci, distanza punto-retta, circonferenza. Parallela e perpendicolare accettano i due clic in qualunque ordine, a differenza di GeoGebra, perché su un telefono è facile sbagliare ordine.

### Secondo giro: tangenti, angoli, poligoni (fatto il 2 ottobre 2026)
| Strumento | Come si usa | Cosa crea | Cosa mostra la riga |
|---|---|---|---|
| Tangenti | Clic sulla conica o sul grafico, poi sul punto. Da un punto esterno a una conica sono due | Le tangenti | le equazioni |
| Circonferenza di centro e raggio | Clic sul centro, poi si scrive il raggio (un numero o un parametro) | La circonferenza | equazione, centro e raggio |
| Compasso | Clic su un segmento o su due punti, che danno il raggio, poi sul centro | La circonferenza | come sopra |
| Bisettrice | Clic su tre punti, il vertice per secondo; oppure su due rette, e sono due | La bisettrice | l'equazione |
| Semiretta | Clic sull'origine, poi su un punto | La semiretta | l'equazione della sua retta |
| Vettore | Clic sull'inizio, poi sulla fine | Il vettore | le componenti |
| Poligono | Clic sui vertici; si chiude tornando sul primo | Il poligono | area e perimetro |
| Angolo | Clic su tre punti, il vertice per secondo; oppure su due rette | L'angolo, con l'arco | l'ampiezza, in gradi o radianti come il piano |
| Pendenza | Clic su una retta | Il triangolo della pendenza | $m = 2$ |
| Punti notevoli del triangolo | Clic su tre punti o su un poligono di tre lati, poi si sceglie quale | Baricentro, circocentro, incentro, ortocentro | le coordinate |

I punti notevoli del triangolo in GeoGebra sono solo comandi; qui meritano uno strumento, perché nel programma italiano tornano spesso.

### Terzo giro: coniche dalla definizione, trasformazioni, luoghi
| Strumento | Come si usa | Cosa crea | Cosa mostra la riga |
|---|---|---|---|
| Parabola | Clic sul fuoco e sulla direttrice, in qualunque ordine | La parabola | equazione, vertice, fuoco, direttrice |
| Ellisse | Clic sui due fuochi, poi su un punto della curva | L'ellisse | equazione, semiassi, eccentricità |
| Iperbole | Come l'ellisse | L'iperbole | equazione, asintoti, eccentricità |
| Conica per cinque punti | Clic su cinque punti | La conica | equazione e tipo |
| Simmetria rispetto a una retta | Clic sull'oggetto, poi sulla retta | L'immagine | la sua equazione |
| Simmetria rispetto a un punto | Clic sull'oggetto, poi sul centro | L'immagine | la sua equazione |
| Traslazione | Clic sull'oggetto, poi su un vettore o su due punti | L'immagine | la sua equazione |
| Rotazione | Clic sull'oggetto, poi sul centro, poi si scrive l'angolo | L'immagine | la sua equazione |
| Omotetia | Clic sull'oggetto, poi sul centro, poi si scrive il rapporto | L'immagine | la sua equazione |
| Luogo | Clic sul punto che traccia, poi sul punto che si muove sul suo vincolo | La curva del luogo | senza equazione |

### Fuori dalla proposta
Segmento di lunghezza data, poligono regolare, poligono rigido, archi e settori, inversione circolare, retta polare, retta di regressione, testo libero, penna. Sono in GeoGebra, non servono alla geometria analitica del liceo, e ogni strumento in più allunga la barra su un telefono.

## Modi nelle lezioni
Proposta di Alessandro, 2 ottobre 2026: montato in una lezione, il componente si limita a un insieme di strumenti o a una categoria di ingressi (solo funzioni, solo geometria, tutti e due).

Parere di Claude, da confermare. Sì, ma come elenco di permessi e non come tre modi fissi. Tre modi non bastano a una lezione: quella sulla distanza punto-retta vuole solo "punto", "retta per due punti" e "distanza", non tutta la geometria. Il piano di una lezione dichiara quattro cose:
- le righe di partenza, e quali sono bloccate (lo studente non le cambia né le toglie);
- gli strumenti della barra, per nome; nessuno vuol dire niente barra;
- se si possono aggiungere righe scritte, e di che tipo (funzioni, equazioni, punti);
- se il piano si può spostare.

I tre modi di Alessandro diventano tre elenchi già pronti con un nome (`funzioni`, `geometria`, `tutto`), da usare quando non serve altro. I tre usi già decisi per le lezioni (funzioni fissate, scelta tra opzioni, campo libero) sono casi dello stesso elenco. Nello strumento sotto `/strumenti` è tutto aperto. Per la ricerca conviene comunque un secondo indirizzo, `/strumenti/geometria-analitica`, che apre lo stesso componente con la barra in vista e un piano vuoto: costa una pagina e prende un intento diverso.

## Cosa serve nel codice
- Un oggetto che dipende da altri: una riga che non è una formula ma una costruzione (tipo e riferimenti agli oggetti da cui parte), ricalcolata quando quelli cambiano. È il pezzo grosso, e tutto il resto ci si appoggia.
- Il punto vincolato a un oggetto (una posizione lungo la curva) e il punto di intersezione tra due oggetti qualunque. Oggi le intersezioni si trovano solo tra funzioni.
- La barra degli strumenti e la macchina dei clic: per ogni strumento l'elenco di cosa chiede, in ordine, e l'anteprima.
- L'equazione di un oggetto costruito, scritta come la vuole la scuola: i coefficienti come frazioni quando i punti hanno coordinate razionali, non come decimali.
- Le costruzioni nel link e nell'annulla.

## Domande aperte
- La scrittura degli oggetti (`retta(A; B)`): fatta il 2 ottobre 2026, con il nome di un'equazione davanti ai due punti dal 3 ottobre.
- La forma dell'equazione della retta: esplicita $y = mx + q$, implicita $ax + by + c = 0$, o tutte e due a scelta. E quella della circonferenza: sviluppata o con centro e raggio in vista. Da chiedere ad Andrea.
- I nomi: $r, s, t$ per le rette, e quale lettera per le circonferenze. Da chiedere ad Andrea.
- Dove sta la barra su un telefono senza togliere spazio al piano, e come si sceglie un punto piccolo con un dito tra oggetti vicini.
- Se le coordinate dei punti liberi si agganciano sempre alla griglia o solo da vicino.
- Se la geometria vive nello stesso strumento del grafico di funzioni o in una pagina sua (`/strumenti/geometria-analitica`), con lo stesso piano. Per la ricerca sono due intenti diversi.
- Quanti giri prima di pubblicare.
- Se togliere una riga con oggetti costruiti sopra deve chiedere conferma: oggi li toglie e basta.

## Collegamenti
- [[Grafico di funzioni]], [[Grafici e simulazioni interattive]], [[Lezioni]]
- Attori: [[Studente]]
