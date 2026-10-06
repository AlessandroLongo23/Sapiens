---
stato: in sviluppo
aggiornato: 2026-10-06
tag: [contenuti, matematica, da-fare]
---
# Matematica terzo anno, da sistemare

Quello che resta aperto dopo il terzo anno di matematica (lezioni 105-129), i grafici negli esercizi e l'esercizio guidato, in produzione dal 6 ottobre 2026 su richiesta di Alessandro senza aspettare questi punti. Ogni voce si spunta quando è fatta. Il contesto è in [[2026-10-05 Terzo anno di matematica]] e [[2026-10-06 Grafici negli esercizi ed esercizio guidato]].

## Repository e pubblicazione
- [ ] Allineare la cartella di lavoro principale a master. Le PR #41 e #42 sono partite da una copia separata (`../Sapiens-terzo-anno`); nella cartella principale i file del lotto sono ancora non tracciati o modificati, e un `git pull` si ferma. Va fatto con le altre sessioni ferme, senza perdere le loro modifiche.
- [ ] Togliere la copia `../Sapiens-terzo-anno` (contiene una copia dei file `.env`) quando la cartella principale è allineata.
- [ ] Committare le modifiche alle note condivise del vault rimaste fuori dalle PR: Home, Agenda, Domande per Andrea, Pipeline lezioni, Lezioni, Esercizi, Piano cartesiano nelle lezioni, e questa nota.
- [ ] Pubblicare le lezioni 87 e 88: su master hanno i piani con i cursori di un'altra sessione, mai scritti nel database. Tenute fuori dalla pubblicazione del 6 ottobre.
- [ ] `scripts/lezioni/publish.mts` non ha un filtro per numero o per slug: con modifiche di più sessioni nella cartella pubblica tutto quello che trova.
- [ ] Limite rigido delle richieste per `POST /api/lezioni/guidato` con una regola del firewall di Vercel. Oggi il limite di 20 al minuto è contato nella memoria di ogni istanza.
- [ ] Un test unitario fallisce ogni tanto sotto carico (1 su 723 in una corsa su tre il 6 ottobre, mai identificato).
- [ ] Nella radice del repo c'è `.sandbox-lez.tmp.mjs`, di un'altra sessione (fisica).

## Da confermare con Alessandro
- [ ] Esercizio guidato: i nomi ("Esercizio guidato", "Domanda 1 di 4", "Mostra il passaggio", "Vai avanti senza rispondere").
- [ ] Esercizio guidato: tenere "Vai avanti senza rispondere" o solo "Mostra il passaggio".
- [ ] Esercizio guidato: lo stato si ricorda finché la scheda del browser è aperta; ritrovarlo anche il giorno dopo?
- [ ] Esercizio guidato: accanto all'esempio 4 della 121 o al suo posto.
- [ ] Esercizio guidato: dopo tre errori "Mostra il passaggio" viene messo in evidenza; la risposta non si rivela da sola. Confermare che è quello che si voleva.
- [ ] Grafici: i due livelli nuovi di `funzioni-esponenziali` dopo "Asintoto e immagine", o i casi di solo $a^x$ subito dopo "Crescente o decrescente".
- [ ] Grafici: nel livello "Dal grafico alla funzione" i punti non hanno le coordinate scritte, si leggono sulla griglia.
- [ ] Grafici: nel tema scuro il grafico ha uno sfondo nero suo, come il plotter.
- [ ] Se la pagina a parte degli esercizi svolti serve ancora ([[2026-09-30 Ogni lezione ha una pagina di esercizi svolti, fatta dai suoi generatori]]).

## Lezioni
- [ ] Rilettura di Andrea: le domande del lotto sono in [[Domande per Andrea]], sezione "Matematica, terzo anno". Le più pesanti: coordinate con la virgola, $\ln$ e $\log$, successioni da $a_1$, $a$ sempre sotto $x^2$ in ellisse e iperbole, "crescente" in senso stretto.
- [ ] La 129 è lunga 34.000 caratteri, sopra i 30.000 del brief: valutare se togliere un esempio.
- [ ] Fatti storici scritti a memoria nelle note della 110 e della 113 (Eulero e $n^2 + n + 41$, Peano, l'aneddoto di Gauss, la leggenda degli scacchi): da verificare su una fonte.
- [ ] Le lezioni del biennio non rimandano alle nuove: 43, 80, 87, 91, 93, 104.
- [ ] 123 dice "il verso si inverte", 127 e 107 "si rovescia": scegliere un verbo.
- [ ] Nel piano di $a^x$ e $\log_a x$ (125), per $a$ tra 1 e circa 1,44 le curve si incontrano in due punti sulla bisettrice: il testo non lo dice.
- [ ] Nella 127 la zona di $\log_a x > c$ è scritta come $\log_a x \cdot \log_a a$ per farla sparire con $a = 1$: è un accorgimento per un difetto del plotter, da togliere quando il plotter è corretto.
- [ ] Larghezza delle formule in evidenza sul telefono non misurata: a rischio 115 (risolvente dell'esempio 2), 116 (tabella a tre colonne), 117 (dimostrazione di $m = 2ax_0 + b$), 118-120 (equazione con le due radici, vertici e fuochi di $xy = k$), 129 (tabelle a sette colonne).
- [ ] I piani di 121-127 sono stati visti in chiaro; nel tema scuro solo lo stato iniziale o niente. Nessun piano provato su un telefono vero, su Safari o su Firefox.
- [ ] Titoli con "logₐ" nella 125: il pedice viene da un carattere di riserva, più leggero del resto.
- [ ] Nell'esercizio guidato, sul telefono, la virgola dopo una formula a fine riga va a capo da sola ("vale 1 , qualunque").

## Blocco `grafico` e plotter
- [ ] Con $a = 1$ la zona di $\log_a x > c$ resta colorata senza la curva.
- [ ] $\frac{k}{x}$ con $k = 0$ viene disegnata anche in $x = 0$; il punto tolto da un grafico non è segnato (105, 107).
- [ ] `assi:` e i nomi dei `valore:` non leggono LaTeX ("aₙ" scritto in Unicode); i valori arrotondati sono scritti con $=$ e non con $\approx$.
- [ ] La lettera `e` è riservata al numero di Nepero e `check.mts` non lo segnala: l'eccentricità si chiama $E$ (118, 119).
- [ ] Il bottone "Reset" copre l'angolo in basso a sinistra del piano (111).
- [ ] Quello che i gruppi avrebbero usato e non c'è: un punto da trascinare sulla curva, punti liberi da trascinare, le soluzioni come segmento sull'asse $x$, segmenti e aree colorate, due zone insieme, punti in numero variabile. L'elenco per capitolo è in [[Piano cartesiano nelle lezioni]].

## Esercizi
- [ ] Portare i grafici negli altri 24 generatori del terzo anno: le proposte per capitolo sono in [[Esercizi con i grafici]].
- [ ] Il correttore della risposta aperta non legge logaritmi, intervalli e disequazioni: i livelli 6 e 7 di `equazioni-logaritmiche` e tutte le disequazioni sono a scelta multipla.
- [ ] Mai provati in una prova vera con accesso: il riepilogo e la pagina degli errori con i grafici come opzioni, e la risposta aperta battuta a mano sul livello "Trova la base".
- [ ] Stampa della scheda giornaliera per il livello "Dalla funzione al grafico": non guardata.
- [ ] Nei grafici degli esercizi l'asintoto tratteggiato passa sopra un numero dell'asse, e una curva ripida può coprire la lettera "y".
- [ ] Il livello 4 di `funzioni-esponenziali` mostra `a^x` come testo grezzo nella consegna.
- [ ] Esempi delle lezioni rimasti senza esercizio: tangenti da un punto esterno a ellisse e iperbole, asse radicale, basi diverse nelle equazioni esponenziali e logaritmiche, radicali nelle basi, il verdetto "indipendenti o dipendenti" nella 128, il diagramma a dispersione e i residui nella 129. Gli elenchi completi sono in fondo alle specifiche `specs/exercises/`.
- [ ] Poca varietà: livelli 1 e 4 di `funzioni-esponenziali` (circa 70 e 60 esercizi diversi), 1 e 7 di `equazioni-esponenziali` (circa 50 e 45), livello 3 di `funzioni-dispari-pari` (quindici forme), livello 7 di `regressione-correlazione` e livello 6 di `principio-induzione` (frasi fisse).
- [ ] Livelli con tre opzioni invece di quattro: 5 di `ellisse`, 2 di `circonferenza-equazione`, 1 di `circonferenza-rette`, 1 di `parabola-rette`.
- [ ] Numeri sopra 9999 senza separatore delle migliaia e apostrofi misti nei generatori delle successioni.
- [ ] Passaggi della soluzione più lunghi di 70 caratteri escono tagliati nella pagina di revisione (funzioni, logaritmi): da guardare sulla pagina vera.
- [ ] Le pagine di revisione (`review.mts`) sono state guardate a campione, non tutte: mai aperta quella di `ellisse`, una sola per funzioni e per circonferenza e parabola.
- [ ] `review.mts` ha un errore di ESLint che c'era già (`KATEX_VERSION` non usata).

## Esercizio guidato
- [ ] Scriverlo per le altre 24 lezioni del terzo anno: le proposte (esempio e fermate) sono in [[Esercizio guidato nelle lezioni]]. Stima: circa un'ora di sessione per lezione.
- [ ] Un tipo di fermata "scegli il grafico tra quattro", ora che i grafici come opzioni esistono (serve per la 120).
- [ ] Mai provato con un lettore di schermo, su un telefono vero, su Safari o Firefox.
- [ ] Il messaggio dei troppi tentativi (429) non è stato visto nella pagina, solo la risposta della rotta.
- [ ] Il pallino dell'opzione scelta è blu, non del colore del sito.
- [ ] Confermare tre volte senza muovere il cursore conta come tre errori e fa comparire l'invito.

## Flashcard
- [ ] I grafici nelle flashcard, che Alessandro ha nominato il 5 ottobre: il disegno è riusabile; mancano il campo figura nella carta, la resa su fronte o retro e il controllo. Le carte devono essere nuove, perché i progressi sono legati all'id.

## Collegamenti
- [[2026-10-05 Terzo anno di matematica]], [[2026-10-06 Grafici negli esercizi ed esercizio guidato]], [[Domande per Andrea]], [[Pipeline lezioni]], [[Pipeline esercizi]], [[Agenda]]
- [[Fisica terzo anno, da sistemare]]
