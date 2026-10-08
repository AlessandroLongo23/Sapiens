---
stato: in uso
release: beta
aggiornato: 2026-10-07
tag: [contenuti, revisione]
---
# Domande per Andrea

Tutte le domande sui contenuti che aspettano la rilettura di Andrea, in un posto solo: convenzioni, notazioni, definizioni che cambiano tra i libri, scelte degli esercizi. Andrea rilegge con i suoi tempi e la pubblicazione non lo aspetta (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]); questa nota fa in modo che nessuna domanda resti solo in una chat.

## Come si usa
- Ogni lotto aggiunge qui le sue domande principali, in una sezione con il nome del lotto e il link alla nota di sessione. Le domande minori restano nelle note delle lezioni (`docs/lezioni/note/`, sezione dei dubbi) e nelle specifiche degli esercizi (`specs/exercises/`, sezione "Domande per la revisione"): ogni sezione qui dice dove trovarle.
- Una domanda aperta è una casella vuota. Quando Andrea risponde si spunta la casella, si scrive la risposta sulla stessa riga ("Andrea, data: …") e si annota cosa è cambiato nelle lezioni o nei generatori.
- Le domande sono scritte perché Andrea possa rispondere senza aprire il codice: la scelta fatta, l'alternativa, dove si trova.

## Convenzioni generali (23 settembre 2026)
Dalla revisione delle 18 lezioni originali; dettagli in `docs/lezioni/README.md`. Tra parentesi la scelta fatta.
- [ ] Inclusione: $\subseteq$ e $\subset$ (scelta fatta), oppure $\subset$ e $\subsetneq$.
- [ ] Sottoinsiemi impropri: $\emptyset$ e $A$ (scelta fatta), oppure solo $A$.
- [ ] Cardinalità: $|A|$ (scelta fatta), $\text{card}(A)$ o $n(A)$.
- [ ] Differenza tra insiemi: $A \setminus B$ (scelta fatta), oppure $A - B$.
- [ ] MCD e MCM maiuscoli come nei titoli del sito, oppure m.c.m. come in molti libri.
- [ ] Coefficiente di MCD e MCM tra monomi: MCD e MCM dei valori assoluti con coefficienti interi, 1 con coefficienti frazionari (scelta fatta), oppure sempre 1.
- [ ] Equazione indeterminata: $S = \mathbb{R}$ (scelta fatta, con un riquadro su $\mathbb{Q}$), oppure $S = \mathbb{Q}$ al primo anno.
- [ ] Elemento neutro di sottrazione e divisione: "non esiste" (scelta fatta), oppure "solo a destra".
- [ ] Nomi: "monomia" per $ax^2 = 0$, "identità" per l'equazione indeterminata, la proprietà dissociativa che alcuni libri non nominano.

## Primo generatore: equazioni di secondo grado (23 settembre 2026)
Specifica in `specs/exercises/equazioni-secondo-grado.md`. Vedi [[2026-09-23 Primo generatore della pipeline]].
- [ ] Le proporzioni tra i casi (pure e spurie al livello 1, complete e pure al livello 4) sono quelle giuste?
- [ ] Al livello 4 servono anche radici con denominatore da razionalizzare, come $x^2 = \frac{5}{2}$?
- [ ] Il livello 5 dovrebbe includere prodotti e quadrati da sviluppare, come $(x - 1)^2 = 2x + 3$?

## Terzo lotto: monomi, polinomi e scomposizione (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/27-38` e nelle specifiche. Vedi [[2026-09-26 Terzo lotto, monomi polinomi e scomposizione]].
- [ ] Nome del trinomio $x^2 + sx + p$: caratteristico, speciale, somma e prodotto, oppure nessuno.
- [ ] Il divisore $ax - b$ nella regola di Ruffini, e la divisibilità di $x^n \pm a^n$: nella 35 o nella 37?
- [ ] L'ordine dei fattori nelle scomposizioni, e se $3 - x$ al posto di $x - 3$ va accettato quando arriveranno le risposte aperte.
- [ ] "La somma di due quadrati è irriducibile" vale solo al primo grado ($x^4 + 4$ si scompone): basta la precisazione della lezione 35?
- [ ] Risposte aperte con due campi (quoziente e resto) per divisione e Ruffini.

## Quarto lotto: relazioni, funzioni e frazioni algebriche (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/39-51` e nelle specifiche. Vedi [[2026-09-26 Quarto lotto, relazioni funzioni e frazioni algebriche]].
- [ ] Insieme immagine: $\mathrm{Im}(f)$ o $f(A)$ (la 18 usa il primo, la 43 il secondo e cita l'altro).
- [ ] Funzione lineare: $ax + b$ o $mx + q$ (44 e 45).
- [ ] Il parametro delle equazioni letterali: $a$ o $k$ (la 50 usa $a$; dal settimo lotto parametriche e sistemi usano $k$).
- [ ] La riduzione allo stesso denominatore non ha esercizi propri (la risposta sarebbe una coppia di frazioni): basta dentro le somme della 48?
- [ ] Nelle equazioni problema una soluzione negativa sull'età conta come impossibile?
- [ ] La carta `inversa-lineare` della 18 doppia una della 44.

## Quinto lotto: disequazioni, statistica e geometria (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/52-62` e nelle specifiche. Vedi [[2026-09-26 Quinto lotto, disequazioni statistica e geometria]].
- [ ] Intervalli con le quadre rovesciate, $]a, b]$, e la scrittura delle soluzioni: "$x < -3$ oppure $x > 2$" o con gli intervalli.
- [ ] Definizioni che cambiano tra i libri: triangolo isoscele (almeno due lati uguali), trapezio (due soli lati paralleli), rette parallele (le coincidenti contano), moda quando tutti i valori hanno la stessa frequenza.
- [ ] La 59 usa "supplementari di angoli congruenti sono congruenti", mentre la 58 enuncia solo "supplementari di uno stesso angolo".
- [ ] Esercizi che vorrebbero una figura: il livello 1 delle disequazioni (retta), i livelli 1-3 delle parallele (gli otto angoli), gli aerogrammi, le dimostrazioni da completare.

## Sesto lotto: intersezione, differenza e logica (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/63-67` e nelle specifiche. Vedi [[2026-09-26 Sesto lotto, intersezione differenza e logica]].
- [ ] Nomi delle forme dell'implicazione: la 66 chiama inversa $q \to p$ e contraria $\neg p \to \neg q$; alcuni libri dicono reciproca (o conversa) la prima e inversa la seconda.
- [ ] Equivalenza tra proposizioni con $\Leftrightarrow$ (alcuni libri usano $\equiv$), e la precedenza tra $\wedge$ e $\vee$ (la 65 mette sempre le parentesi).
- [ ] La 64 e la 66 sono lunghe (circa 22.000 caratteri): le note dicono quali esempi togliere se serve.
- [ ] Il motore delle figure non compila `\mathbb{N}` né `\complement`: in due figure c'è una scritta al posto del simbolo.
- [ ] Esercizi che vorrebbero una figura: i problemi con i diagrammi (livelli 5-6 dell'intersezione, 6-7 della differenza), gli insiemi di verità (livello 6 dell'implicazione, livello 2 dei quantificatori).

## Settimo lotto: sistemi, radicali e secondo grado (27 settembre 2026)
Altri dubbi in `docs/lezioni/note/68-79` e nelle specifiche. Vedi [[2026-09-27 Settimo lotto, sistemi radicali e secondo grado]].
- [ ] Lettere sotto radice: la 72 usa condizioni di esistenza e valori assoluti ($\sqrt{x^2} = |x|$), dalla 73 alla 76 le lettere sono positive, dichiarato in ogni lezione.
- [ ] "Semplificare" un radicale: nella 72 vuol dire dividere indice ed esponenti; $\sqrt{12} = 2\sqrt{3}$ è "portare fuori" (73). La 17 usa "semplificare" nel senso largo.
- [ ] Le coppie soluzione dei sistemi: $(x, y)$ con la virgola; la 68 scrive $S = \{(3, 2)\}$, la 69 "la coppia $(2, 1)$".
- [ ] I nomi "regola di Cartesio", "permanenza" e "variazione" (77), e le lettere $s$ e $p$, che nella 36 hanno un altro segno ($x^2 + sx + p$ contro $x^2 - sx + p$).
- [ ] Le approssimazioni per difetto dei numeri negativi (71): $-2{,}65$ per $-\sqrt{7}$, perché "per difetto" vuol dire minore.
- [ ] Opzioni con il valore giusto in forma non ridotta ($\frac{30\sqrt{2}}{2}$, $\sqrt{8}$ al posto di $2\sqrt{2}$) contano come errori (livelli 1-4 della razionalizzazione, 1 e 5 delle espressioni): è giusto?
- [ ] Il sasso lanciato in alto (79, altezza $20t - 5t^2$) viene dalla fisica: si tiene nel biennio?
- [ ] Nelle equazioni parametriche, "soluzioni reali" quando per un valore di $k$ l'equazione diventa di primo grado: i libri scrivono "$k \le \frac{3}{2}$" oppure "$k \le \frac{3}{2}$ e $k \ne 1$".

## Ottavo lotto: piano cartesiano, retta e parabola (27 settembre 2026)
Altre domande nella sezione "Domande per Andrea" di ogni nota (`docs/lezioni/note/80-89`) e nelle specifiche. Vedi [[2026-09-27 Ottavo lotto, piano cartesiano retta e parabola]].
- [ ] Distanza tra due punti $\overline{AB}$ nella geometria analitica, mentre la 58 scrive la lunghezza $AB$: due notazioni, una per la geometria euclidea e una per l'analitica, o si uniforma?
- [ ] Coordinate non intere: $M\left(\frac{3}{2}, \frac{1}{2}\right)$ con la virgola e le frazioni, oppure $(1{,}5; 0{,}5)$ con il punto e virgola come in alcuni libri?
- [ ] $ax + by + c = 0$ chiamata "forma implicita" (alternativa: "forma generale"); la forma segmentaria $\frac{x}{p} + \frac{y}{q} = 1$ non c'è.
- [ ] Retta per due punti: il metodo principale è "prima $m$, poi $y - y_A = m(x - x_A)$", con la formula $\frac{y - y_A}{y_B - y_A} = \frac{x - x_A}{x_B - x_A}$ in un riquadro; molti libri fanno il contrario.
- [ ] Rette parallele: le coincidenti contano (come nella 60), così $m_1 = m_2$ vale senza eccezioni; l'alternativa è la definizione stretta con $q_1 \neq q_2$.
- [ ] Perché $m_1 \cdot m_2 = -1$: giustificato con la rotazione di un triangolo di un angolo retto; molti libri lo dimostrano con Pitagora o con il secondo teorema di Euclide.
- [ ] Fascio generato scritto $r + k s = 0$ con un parametro solo (la retta $s$ esclusa), oppure $\lambda r + \mu s = 0$ con due parametri.
- [ ] Vertice della parabola: la 87 insegna $x_V = -\frac{b}{2a}$ e $y_V$ per sostituzione, con $-\frac{\Delta}{4a}$ come controllo; molti libri fanno imparare $V\left(-\frac{b}{2a}, -\frac{\Delta}{4a}\right)$ come formula unica.
- [ ] Parabola per tre punti (sistema $3 \times 3$) in un riquadro della 87 e in un livello degli esercizi: si tiene al secondo anno o va al terzo?
- [ ] Disequazioni con $a < 0$: la 88 moltiplica sempre per $-1$ e cambia verso; la 89 legge il segno direttamente e mostra il cambio di verso come alternativa. Quale metodo si insegna come principale?
- [ ] Nome della regola: "valori esterni / valori interni" (88); alternative "intervalli esterni" o "segno concorde con $a$".
- [ ] Nella tabella dei segni un trinomio con $\Delta > 0$ sta in una riga sola con i suoi zeri (89), oppure si scompone sempre in due fattori di primo grado?
- [ ] Soluzioni di $(x - 3)^2 > 0$: $\mathbb{R} \setminus \{3\}$ con "$x \neq 3$", oppure l'unione di due intervalli.

## Guida alle formule (27 settembre 2026)
La pagina `/guida-latex` insegna agli studenti a scrivere le formule nelle note (`src/lib/guide/writing.ts`). Le scelte di notazione vanno rilette come quelle delle lezioni.
- [ ] Minore o uguale scritto `\leq` ($\leq$); molti libri italiani stampano $\leqslant$ (`\leqslant`). Quale si insegna?
- [ ] La virgola decimale scritta `3{,}14`, con le graffe perché LaTeX non lasci lo spazio dopo la virgola: si spiega così, o si lascia perdere e si accetta lo spazio?
- [ ] Il diviso scritto con i due punti `a : b`, come alle medie, e il segno $\div$ come alternativa.
- [ ] Le coordinate con la virgola, come nelle lezioni: dipende dalla domanda sulle coordinate dell'ottavo lotto.

## Chimica (25 settembre 2026)
Le lezioni di chimica non sono nella beta; le domande restano per quando entreranno. Vedi [[2026-09-25 Chimica con RDKit]].
- [ ] La tavola delle masse atomiche, la classificazione degli amminoacidi, la soglia di polarità del legame.
- [ ] I nomi: coppia solitaria, propan-2-olo.
- [ ] Date e dati scritti a memoria, segnati "da verificare" nelle note di ogni lezione (`docs/lezioni/chimica/`).

## Chimica: il benzene e i composti aromatici (28 settembre 2026)
Lezione `chim-benzene` (`docs/lezioni/chimica/riscritte/07-chim-benzene.md`), non ancora pubblicata. Le domande minori e i dati da verificare sono nella nota `docs/lezioni/chimica/note/07-chim-benzene.md`. Tra parentesi la scelta fatta.
- [ ] Il benzene disegnato sempre con la formula di Kekulé, anche nei modelli 3D, e il cerchio solo citato nel testo (scelta fatta, perché RDKit non lo disegna); oppure un disegno con il cerchio fatto a parte.
- [ ] "Formule limite" con "strutture di risonanza" tra parentesi, "ibrido di risonanza", "energia di risonanza" (scelta fatta): sono i termini dei libri di scuola?
- [ ] Aromaticità in quattro condizioni, con la regola di Hückel $4n + 2$ (scelta fatta), oppure tre come in molti libri.
- [ ] "Orbitale $p$" senza "ibridazione $sp^2$" (scelta fatta, l'ibridazione è una lezione del terzo anno non ancora scritta), oppure l'ibridazione data per nota.
- [ ] Due sostituenti diversi: 1-cloro-4-metilbenzene in ordine alfabetico, con 4-clorotoluene come alternativa (scelta fatta); prefissi *o*-, *m*-, *p*- in corsivo.
- [ ] Caffeina: aromatico solo l'anello a cinque atomi, lo scheletro detto piano (scelta fatta, come nella 05).
- [ ] Il bromo sul cicloesene e sul benzene anticipa la lezione sulla sostituzione elettrofila aromatica: si tiene qui?

## Strumenti, seconda onda (28 settembre 2026)
Le 55 pagine nuove di `/strumenti` (vedi [[Calcolatori e convertitori]]). Tra parentesi la scelta fatta; ogni articolo in `src/content/strumenti/` spiega la sua.
- [ ] Funzioni goniometriche: $\sin$ e $\cos$ (scelta fatta) oppure "sen" come in molti libri italiani; $\text{tg}$ e $\text{cotg}$.
- [ ] Accelerazione di gravità: $9{,}8\ \text{m/s}^2$ (scelta fatta) oppure $9{,}81$. Lo studente può cambiarla.
- [ ] Energia: $K$ e $U$ (scelta fatta) oppure $E_c$ ed $E_p$.
- [ ] Caloria: $4{,}184\ \text{J}$, la termochimica (scelta fatta), oppure $4{,}186\ \text{J}$.
- [ ] Ordine di grandezza: soglia 5 (scelta fatta) oppure $\sqrt{10} \approx 3{,}16$.
- [ ] Intervalli: quadre rovesciate $\left]2, 5\right[$ e "oppure" tra due intervalli (scelta fatta), come nella lezione; oppure tonde e $\cup$.
- [ ] Varianza: divisore $n$ (scelta fatta), con quella campionaria ($n - 1$) come riga in più.
- [ ] Solidi: $A_b$, $A_l$, $A_t$ (scelta fatta) oppure $S_b$, $S_l$, $S_t$; numeri fissi dei poligoni regolari a tre decimali (0,688 per il pentagono).
- [ ] Trinomi con primo coefficiente diverso da 1: scomposti con Ruffini (scelta fatta), non con il metodo "ac".
- [ ] Crediti scolastici: la media M comprende il voto di comportamento? La norma dice solo "media dei voti dello scrutinio finale"; lo strumento chiede la media già calcolata.
- [ ] Tabelle di verità: precedenza $\neg$, poi $\wedge$, $\vee$, $\veebar$, poi $\to$, poi $\leftrightarrow$; tra $\wedge$ e $\vee$ mescolati si chiedono le parentesi (scelta fatta), come nella lezione.

## Strumenti, terza onda (28 settembre 2026)
Le 33 pagine aggiunte a `/strumenti`. Tra parentesi la scelta fatta.
- [ ] Quartili: metodo delle due metà, con la mediana esclusa quando i dati sono dispari (scelta fatta); Excel e le calcolatrici interpolano.
- [ ] Temperatura assoluta: $T = t + 273{,}15$ (scelta fatta) oppure $273$, come molti libri di chimica.
- [ ] Logaritmi: $\log$ senza base vale base 10 e $\ln$ è la base $e$ (scelta fatta); il cambio di base usa $\ln$.
- [ ] Settore circolare: attraverso la frazione $\frac{\alpha}{360°}$ (scelta fatta) oppure la proporzione $\ell : C = \alpha : 360°$.
- [ ] Acido solforico trattato come acido forte che si dissocia due volte (scelta fatta, come molti libri), anche se la seconda dissociazione non è completa.
- [ ] Equazioni con il valore assoluto: argomento $= \pm k$ quando dall'altra parte c'è un numero, due casi sul segno dell'argomento quando c'è la $x$ (scelta fatta).
- [ ] Interesse composto con i mesi: $M = C(1 + i)^t$ con $t$ frazionario (convenzione esponenziale, scelta fatta) oppure la convenzione mista.
- [ ] Forza della correlazione: debole sotto $|r| = 0{,}3$, forte sopra $0{,}7$ (scelta fatta; soglie diffuse ma non universali).

## Nono lotto: grado superiore e probabilità (28 settembre 2026)
Lezioni 90-95, vedi [[2026-09-28 Nono lotto, grado superiore e probabilità]]. Le domande minori sono nelle note (`docs/lezioni/note/90-95`, sezione "Domande per Andrea") e nelle specifiche (`specs/exercises/`, sezione "Domande per la revisione"). Tra parentesi la scelta fatta.
- [ ] Equazioni reciproche: fuori dalla 90 (scelta fatta), oppure una sezione in più.
- [ ] Disequazioni di grado superiore: una sezione breve in fondo alla 90 (scelta fatta), oppure una lezione loro.
- [ ] Equazione in $t$ delle trinomie: senza nome (scelta fatta), "risolvente" o "ausiliaria"; la binomia richiede $n > 2$?
- [ ] $|A(x)| = B(x)$: metodo principale con la condizione $B(x) \geq 0$ e i due sistemi in un riquadro (scelta fatta nella 91), oppure i due sistemi come nei libri che partono da lì. Lo strumento sulle equazioni con il valore assoluto usa i due casi sul segno dell'argomento: le due pagine vanno allineate.
- [ ] $|A| < B \Leftrightarrow -B < A < B$ senza condizione su $B$ (scelta fatta), e il simbolo $\Updownarrow$ per "equivale a", che nessun'altra lezione usa.
- [ ] Equazioni irrazionali: metodo delle condizioni con la verifica in un riquadro (scelta fatta), oppure la verifica come metodo principale; il sistema di $\sqrt{A} = B$ su due righe (scelta fatta) o su tre, con $A \geq 0$ scritta e dichiarata superflua; "soluzioni estranee" (scelta fatta) o "non accettabili"; servono le disequazioni con due radicali?
- [ ] Sistemi di secondo grado: "equazione risolvente" e retta "esterna" alla parabola sono i termini di classe? Con $\Delta = 0$ "una coppia" (scelta fatta) o "due soluzioni coincidenti"? Servono i simmetrici di quarto grado e quelli con $x - y = s$?
- [ ] Probabilità: $p(E)$ (scelta fatta) o $P(E)$; $\Omega$ (scelta fatta) o $U$; "legge empirica del caso" o "legge dei grandi numeri"; teniamo il cenno alla probabilità soggettiva?
- [ ] Incompatibili e indipendenti: la 95 dice solo che sono cose diverse (scelta fatta), oppure un esempio subito, prima della probabilità condizionata.
- [ ] Generatori con nove livelli, uno per sezione della lezione (valore assoluto, irrazionali): vanno bene, o meglio due generatori, uno per le equazioni e uno per le disequazioni?
- [ ] Distrattori non presi dagli avvisi delle lezioni ($x^2 = 4 \Rightarrow x = \pm 4$ nelle biquadratiche, "doppio" e "opposti" nelle irrazionali, $\frac{k_A + k_B}{2n}$ nella somma): sono errori che gli studenti fanno davvero?
- [ ] Ruffini in un livello solo nelle equazioni scomponibili (scelta fatta), oppure due.

## Decimo lotto: geometria del secondo anno (28 settembre 2026)
Lezioni 96-104, vedi [[2026-09-28 Decimo lotto, geometria del secondo anno]]. Le domande minori sono nelle note (`docs/lezioni/note/96-104`) e nelle specifiche (`specs/exercises/`). Tra parentesi la scelta fatta.
- [ ] Misure con il soprassegno, $\overline{AB} = 8$ cm (scelta fatta nelle 59, 80 e 96-104), oppure $AB = 8$ cm come nelle 58, 61 e 62. Il capitolo del primo anno e quello del secondo vanno allineati.
- [ ] $\sin$ e $\tan$ come sulla calcolatrice (scelta fatta, con un riquadro), oppure $\text{sen}$ e $\text{tg}$.
- [ ] Triangolo rettangolo in $C$ con altezza $CH$ e Pitagora $c^2 = a^2 + b^2$ (scelta fatta), oppure rettangolo in $A$, o $i^2 = c_1^2 + c_2^2$.
- [ ] Simbolo di equivalenza tra superfici: $\doteq$ (scelta fatta) o $\equiv$.
- [ ] Area del poligono regolare $\frac{P \cdot a}{2}$ (scelta fatta) oppure $p \cdot a$ con $2p$ per il perimetro; i numeri fissi dei poligoni regolari restano nella 98?
- [ ] Unità delle misure composte: $9\pi - 18$ cm² (scelta fatta nella 99 e nel generatore) oppure $(9\pi - 18)$ cm², che è la scrittura corretta se l'unità vale per tutta la misura.
- [ ] Angoli arrotondati al centesimo di grado (scelta fatta nella 101) o in gradi e primi.
- [ ] Nomi: "piccolo teorema di Talete" per il fascio di parallele; ordine e nomi dei criteri di similitudine; isometrie "inverse" o "invertenti".
- [ ] La 96 e la 97 usano Pitagora come noto dalle medie, prima della 100: va bene? E il criterio di congruenza dei triangoli rettangoli va aggiunto alla 59?
- [ ] La dimostrazione classica del primo teorema di Euclide resta completa (scelta fatta), anche se è lunga?
- [ ] Generatori con otto livelli (lunghezza della circonferenza, Talete, similitudine): vanno bene, o si fondono?

## Figure interattive (28 settembre 2026)
45 figure interattive in 38 lezioni, vedi [[2026-09-28 Figure interattive nelle lezioni]]. Si provano in locale su `/prova-interattivo`. Tra parentesi la scelta fatta.
- [ ] Unità nelle figure che mostrano misure: $\overline{AB} = 10$ in Euclide e $c = 10$ in Pitagora (100), centimetri del disegno nel parallelogramma (98), multipli di $r$ nei settori del cerchio (99). Vanno bene numeri senza unità?
- [ ] 99, settori riordinati: la fila si chiama con "base" e "altezza" (scelta fatta), o con semiperimetro e apotema del poligono inscritto, come nel paragrafo sui poligoni?
- [ ] 101: nella figura i rapporti sono scritti $a/c$, $b/c$, $a/b$ (scelta fatta, perché sta prima delle definizioni), o già $\sin\alpha$, $\cos\alpha$, $\tan\alpha$?
- [ ] 103: triangolo di partenza di lati 13, 14 e 15 cm (perimetro 42, area 84; scelta fatta).
- [ ] 104: con $k = 0$ l'immagine collassa in $O$ e la didascalia dice che non è un'omotetia (scelta fatta). Va mostrato, o il cursore salta lo zero?
- [ ] 23 e 26: le figure mostrano anche l'errore, cioè "aggiungi $k$ sopra e sotto" nelle frazioni equivalenti e la somma ingenua delle percentuali in rosso. Aiuta, o rischia di fissare l'errore?
- [ ] 16, bilancia: servono pesi positivi, quindi le equazioni sono $3x + 5 = 11$, $2x + 3 = 11$ e $5x = 2x + 12$ (l'esempio 2 dopo aver aggiunto 3 ai due membri). Va bene, o serve un'altra equazione?
- [ ] 36, tessere algebriche: il lato $x$ non è un multiplo del quadratino, altrimenti $x^2 + 4$ si chiuderebbe in un rettangolo di quadratini. Quindi è diverso dalla figura TikZ.
- [ ] 94: sull'asse del dado "1/3" e "1/6", su quello della moneta "0,5". Frazioni ovunque?
- [ ] 59: nella disuguaglianza triangolare $a = BC$, $b = AC$, $c = AB$ (scelta fatta).
- [ ] 62: il trapezio rettangolo si classifica solo come rettangolo, non come scaleno (scelta fatta).
- [ ] 41: le spie dicono già "relazione d'ordine largo/stretto" nella sezione sul controllo delle proprietà, prima della definizione.
- [ ] 95: bastano gli eventi in elenco (doppio, somma, almeno un $k$, nessun $k$, un dado uguale a $k$, somma pari), o ne servono altri?
- [ ] 57 e 77: voti a passi interi, soluzioni a passi di mezzo. Nella 77 la regola di Cartesio compare nella figura prima della sezione che la spiega: meglio spostare la figura in "Segni delle soluzioni"?
- [x] 102, "Perché vale": c'era $A'B' : \overline{B'C'} = 3 : 2$, con le due notazioni mescolate. Corretto in $A'B' : B'C'$ (Claude, 28 settembre 2026).

## Fisica, prima del primo lotto (29 settembre 2026)
Vedi [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]].
- [ ] Colori per grandezza nelle figure, uguali nel TikZ e nelle figure interattive: un colore per le forze, uno per le velocità, uno per le accelerazioni, uno per i campi? Quale convenzione usano i libri che conosci (per esempio l'Amaldi)?

## Primo lotto di fisica: grandezze, grafici, vettori e forze (29 settembre 2026)
Le 19 lezioni del primo anno sui primi tre capitoli; vedi [[2026-09-29 Primo lotto di fisica]]. Qui le domande che valgono per tutta la fisica, con la scelta fatta tra parentesi; quelle di ogni lezione (circa 95) sono nella sezione "Domande per Andrea" di `docs/lezioni/fisica/note/NN-slug.md`, e i dubbi sugli esercizi nelle specifiche `specs/exercises/fis-*.md` e `forze.md`. Le convenzioni scelte sono in `docs/lezioni/fisica/README.md`.
- [ ] Colori delle frecce: forze rosse, vettori generici e spostamenti blu, velocità blu scuro, accelerazioni verdi, risultante arancione, componenti tratteggiate (scelta fatta).
- [ ] $g = 9{,}8\,	ext{m/s}^2$ (scelta fatta, come l'Amaldi) o $9{,}81$; in m/s² o in N/kg.
- [ ] Densità $d$ (scelta fatta, come l'Amaldi) o $\rho$.
- [ ] Incertezza di una misura singola: la sensibilità intera (scelta fatta) o metà.
- [ ] Incertezza di una serie: la semidispersione (scelta fatta) o già lo scarto quadratico medio in prima.
- [ ] Incertezza scritta con una cifra significativa (scelta fatta) o due quando la prima è 1; arrotondata con la regola solita (scelta fatta) o sempre per eccesso.
- [ ] Propagazione nel caso peggiore: si sommano le assolute nelle somme e le relative nei prodotti (scelta fatta).
- [ ] Simbolo dell'incertezza relativa: $\varepsilon$ (scelta fatta), $e_r$ o $\Delta x / x$.
- [ ] "Precisione" e "accuratezza" come nella lezione 05, dato che alcuni libri chiamano precisione la sensibilità; "sbaglio" o "errore grossolano".
- [ ] Vettori con la freccia $\vec v$ (scelta fatta) o in grassetto; "modulo" o "intensità"; versori sì o no al primo anno.
- [ ] Angolo di un vettore sempre dal semiasse positivo delle $x$ in senso antiorario (scelta fatta), oppure anche da altri riferimenti; $\sin$ o $\text{sen}$ (come in matematica, domanda già aperta).
- [ ] Forza premente $F_\perp$ (scelta fatta), $F_N$ o $N$; allungamento $\Delta l$ (scelta fatta) o $x$; legge di Hooke con il segno già al primo anno.
- [ ] Ordine di grandezza: soglia 5, $\sqrt{10}$ o "la potenza più vicina" (gli esercizi usano solo numeri dove le regole coincidono).
- [ ] La notazione scientifica spiegata nella lezione 02 di fisica, perché la matematica non ha una lezione sua: va bene lì?
- [ ] Molle in serie e in parallelo lasciate fuori, perché il programma non le cita: confermi?
- [ ] Coefficienti di attrito presi da Engineering ToolBox (pagina senza data): meglio la tabella dell'Amaldi.

## Secondo lotto di fisica: equilibrio e ottica (30 settembre 2026)
Le 18 lezioni che chiudono il primo anno: equilibrio dei solidi, dei fluidi, ottica geometrica. Vedi [[2026-09-30 Secondo lotto di fisica]]. Qui le domande che valgono per più lezioni, con la scelta fatta tra parentesi; le altre sono nella sezione "Domande per Andrea" di `docs/lezioni/fisica/note/20-37`.
- [ ] Reazione vincolare $\vec F_v$ (scelta fatta), $\vec N$ o $\vec R$; componenti del peso $P_\parallel$ e $P_\perp$ (scelta fatta) o $P_x$ e $P_y$.
- [ ] Momento $M$ (scelta fatta) o $\tau$, positivo in senso antiorario, braccio come distanza dalla retta d'azione, unità N·m.
- [ ] Leve: "forza motrice e resistente" (scelta fatta) o "potenza e resistenza"; "base d'appoggio" o "poligono d'appoggio".
- [ ] Specchi e lenti: $1/p + 1/q = 1/f$, $G = -q/p$, $q < 0$ per l'immagine virtuale e $f < 0$ per lo specchio convesso e la lente divergente (scelta fatta), oppure solo valori positivi con la natura dell'immagine detta a parole; simboli $p$, $q$, $f$ o $d_o$, $d_i$.
- [ ] Angoli di rifrazione $\theta_1$, $\theta_2$ (scelta fatta) o $\hat\imath$, $\hat r$; angoli al grado (scelta fatta) o al decimo.
- [ ] $p_0 = 1{,}013 \cdot 10^5\,\text{Pa}$ (lezione 29), arrotondato a $1{,}01 \cdot 10^5$ negli esempi della 28: va bene, o sempre lo stesso valore?
- [ ] Acqua di mare a 1030 kg/m³ (scelta fatta) o 1025; $g$ in N/kg nella legge di Stevino.
- [ ] Argomenti che forse l'Amaldi del primo anno non fa: gli spostamenti dei pistoni nel torchio, la profondità apparente, i due specchi ad angolo, i due fili con angoli diversi (un sistema di due equazioni). Il verricello è stato lasciato fuori.
- [ ] Velocità della luce e anno luce messi nella lezione 31: è il posto giusto?

## Terzo lotto di fisica: il secondo anno (30 settembre 2026)
Le 33 lezioni del secondo anno: cinematica, moti nel piano, dinamica, forze e movimento, lavoro ed energia, temperatura e calore. Vedi [[2026-09-30 Terzo lotto di fisica]]. Qui le domande che valgono per più lezioni, con la scelta fatta tra parentesi; le altre sono nella sezione "Domande per Andrea" di `docs/lezioni/fisica/note/38-70`.
- [ ] Coefficienti di dilatazione $\lambda$ (lineare) e $\alpha$ (volumica) (scelta fatta, dal README, da verificare sull'Amaldi) oppure $\alpha$ e $\beta$; conducibilità termica $\lambda$ (scelta fatta) o $k$. Se l'Amaldi usa altre lettere cambiano le lezioni 66 e 69.
- [ ] Posizione $s$ (scelta fatta) o $x$; il grafico si chiama "spazio-tempo" (scelta fatta), "posizione-tempo" o "orario"; "velocità scalare media" e il simbolo della velocità media.
- [ ] Caduta libera con l'asse verso l'alto e $a = -g$ (scelta fatta) o con l'asse verso il basso e $h = \tfrac12 g t^2$.
- [ ] Frenata con $a$ negativa (scelta fatta) o "decelerazione" positiva.
- [ ] Deformazione della molla $x$ (secondo anno) o $\Delta l$ (legge di Hooke, primo anno): le due lezioni oggi usano lettere diverse.
- [ ] $g$ in m/s² dal secondo anno o ancora in N/kg.
- [ ] "Diagramma delle forze" (scelta fatta) o "diagramma di corpo libero"; $\vec F_{AB}$ per "forza di A su B".
- [ ] Energia dissipata che "diventa energia interna" o "diventa calore"; bilancio $\Delta E = W_{attrito}$ o $W_{nc}$; rendimento $\eta$ in percentuale o numero puro.
- [ ] Calore scambiato con le differenze positive ("ceduto uguale ad assorbito") o $Q_1 + Q_2 = 0$ con i segni; unità $\text{J/(kg}\cdot{}^\circ\text{C)}$ o $\text{J/(kg}\cdot\text{K)}$; 273 o 273,15.
- [ ] Argomenti forse fuori dal secondo anno dell'Amaldi: la legge della conduzione con i conti, l'equivalente in acqua, la macchina di Atwood, il peso apparente, i radianti e $\omega$, la dimostrazione di $a_c = v^2/r$ con i triangoli simili, il pendolo ad ampiezza grande.

## Biennio di chimica (30 settembre 2026)
Le 38 lezioni nuove del primo e del secondo anno di chimica. Vedi [[2026-09-30 Biennio di chimica]]. Qui le domande che valgono per più lezioni, con la scelta fatta tra parentesi; le altre sono nella sezione "Domande per Andrea" di `docs/lezioni/chimica/note/10-47`.
- [ ] Condizioni normali a $0\,^\circ\text{C}$ e 1 atm con 22,4 L/mol (scelta fatta) o standard a $25\,^\circ\text{C}$ con 24,5 L/mol.
- [ ] Numero di Avogadro $6{,}022 \cdot 10^{23}$ (lezione 01) arrotondato a $6{,}02$ nei conti (scelta fatta).
- [ ] Calore specifico per grammo, J/(g·°C) (scelta fatta in chimica), o per chilogrammo come in fisica.
- [ ] Nomi delle leggi dei gas: "Charles e Gay-Lussac" (scelta fatta, come nell'albero) o "prima e seconda legge di Gay-Lussac"; "gas ideale" o "gas perfetto"; "formula minima" o "formula empirica".
- [ ] Simboli delle temperature di fusione ed ebollizione: $t_f$ e $t_{eb}$ o altro; "brinamento" per il passaggio da aeriforme a solido.
- [ ] Formule dei composti ionici al primo anno, e con quale metodo; quali ioni poliatomici a memoria; gli idrati.
- [ ] Legame covalente, elettronegatività e VSEPR si possono nominare al secondo anno (lezioni sull'acqua)? H⁺ o H₃O⁺, ione ossonio o idronio?
- [ ] La composizione percentuale è sia nella 01 sia nella 35: da quale si toglie?
- [ ] Rame e zolfo: Cu₂S (rapporto 3,96) o CuS negli esempi di Proust.
- [ ] Argomenti forse fuori dal biennio: fattore di ritenzione, sopraffusione, manometro a tubo aperto, frazione molare, gas raccolto sopra l'acqua, legge di Graham, abbondanze isotopiche.

## Risposta aperta negli esercizi (30 settembre 2026)
Dove la forma non conta, la risposta aperta accetta tutte le scritture equivalenti (vedi [[2026-09-30 Nella risposta aperta la forma conta solo dove è l'esercizio]]). Qui i casi dubbi, con la scelta proposta tra parentesi.
- [ ] Un'equazione nell'incognita $y$ risolta scrivendo $x = 3$: giusta (proposta: sì, con una riga che lo fa notare) o sbagliata?
- [ ] Soluzioni irrazionali scritte con il $\pm$, come $x = \frac{3 \pm \sqrt 5}{2}$: valgono (proposta: sì) o si chiedono le due soluzioni separate?
- [ ] Una frazione scritta come decimale esatto ($1{,}2$ per $\frac{6}{5}$): giusta (proposta: sì); e un periodico scritto con la linea, $0{,}\overline{3}$?
- [ ] Una risposta giusta ma non ridotta ($\frac{3}{6}$) dove l'esercizio non chiede di ridurre: giusta con una riga che dice che si può semplificare (proposta)?
- [ ] Equazione impossibile: valgono "impossibile", $S = \emptyset$, "nessuna soluzione"; indeterminata: "indeterminata", $S = \mathbb{R}$, "per ogni $x$". Manca qualche scrittura che si usa in classe?
- [ ] Quali livelli chiedono una forma: la tabella è in `src/lib/exercises/v2/open-answers.ts` (449 livelli classificati il 30 settembre, sul branch `risposta-aperta`); `scripts/exercises/open-answers.mts` stampa il riepilogo. I casi dubbi sono qui sotto.
- [ ] Monomi e polinomi calcolati ("Calcola il prodotto", "Riduci il monomio", "MCD dei monomi"): il risultato va sempre in forma normale, con i termini simili sommati (scelta fatta, altrimenti il testo copiato passerebbe). Va bene anche un ordine diverso dei termini, come $-y^2 + 9$ per $9 - y^2$?
- [ ] "Calcola e semplifica" sulle frazioni algebriche: è giusta la frazione ridotta anche con il denominatore sviluppato, come $\frac{x - 16}{x^2 - 7x + 6}$ (scelta fatta), o il denominatore va lasciato scomposto?
- [ ] Rette: dove la consegna chiede la forma esplicita si accetta solo $y = mx + q$, con qualunque scrittura equivalente del secondo membro (scelta fatta). Dove non la chiede, vale anche la forma implicita?
- [ ] Percentuali di variazione ("Di quale percentuale è cambiato il prezzo?", risposta $-25$): il segno è obbligatorio, o vale anche $25$ quando lo studente scrive che è una diminuzione? E il simbolo % si può omettere (scelta fatta: sì)?
- [ ] Unità di misura e gradi nella risposta ($25$ cm, $149°$): si accettano con e senza (scelta fatta). Una unità diversa da quella della consegna ($0{,}25$ m per $25$ cm) si converte o è un errore?
- [ ] Domini e condizioni di esistenza: valgono $x \neq 4$, $D = \mathbb{R} \setminus \{4\}$ e $x \neq \pm \frac{2}{3}$ (scelta fatta); servono altre scritture, come gli intervalli?
- [ ] Funzione inversa: scritta in $x$ o in $y$ vale lo stesso (scelta fatta)?
- [ ] Un trinomio che non si scompone: vale sia la parola "irriducibile" sia il trinomio riscritto uguale (scelta fatta). Va bene anche dove la consegna chiede i fattori di primo grado?
- [ ] Con la virgola decimale, "$x = 0,2$" può voler dire $0$ e $2$ oppure $0{,}2$: il correttore prova le due letture e accetta la risposta se una è giusta (scelta fatta). Ti sembra giusto, o in classe si usa sempre il punto e virgola tra due soluzioni?

## Tavola periodica (1° ottobre 2026)
Dalla costruzione dello strumento `/strumenti/tavola-periodica`; vedi [[2026-10-01 Tavola periodica]] e [[Tavola periodica interattiva]]. Tra parentesi la scelta fatta.
- [ ] Famiglie e colori: dieci famiglie, come le dà PubChem (scelta fatta). Il polonio è tra i semimetalli e l'astato tra gli alogeni; idrogeno, carbonio, azoto, ossigeno, fosforo, zolfo e selenio sono "non metalli"; alluminio, gallio, indio, stagno, tallio, piombo, bismuto e gli elementi da 113 a 116 sono "altri metalli". I libri italiani dividono allo stesso modo? E il nome "altri metalli" va bene, o si dice "metalli del blocco p"?
- [ ] Lantanidi e attinidi: quindici elementi per riga, dal lantanio al lutezio e dall'attinio al laurenzio, sotto la tavola. Nella vista dei blocchi lantanio e attinio sono nel blocco d, perché hanno un elettrone d e nessun elettrone f, e gli altri quattordici per riga nel blocco f (scelta fatta). Oppure nel blocco d vanno lutezio e laurenzio, come propone la IUPAC?
- [ ] Configurazione elettronica: scritta nell'ordine di riempimento, `[Ar] 4s² 3d⁶`, per tutti gli elementi (scelta fatta). I libri scrivono anche `[Ar] 3d⁶ 4s²`: quale vuoi?
- [ ] Raggio atomico: la vista degli andamenti usa il raggio covalente di legame singolo, in pm (scelta fatta, perché scende lungo il periodo e sale lungo il gruppo come nei libri). Il sodio dà 155 pm, mentre molti libri riportano 186 pm, che è il raggio metallico. La fonte è una tabella di Wikipedia i cui valori sembrano quelli di Pyykkö e Atsumi del 2009: da verificare. Va bene il raggio covalente, o i libri usano un altro raggio?
- [ ] Affinità elettronica: tolta dalla tavola. I valori di PubChem non sono affidabili (fluoro 322 kJ/mol contro 328) e mancano dove l'anione non è stabile. Serve? Con quale segno, e da quale fonte?
- [ ] Energia di ionizzazione in kJ/mol (scelta fatta), convertita dagli eV di PubChem: il ferro dà 762,4, il francio 375,7 (altre fonti danno 393).
- [ ] Numeri di ossidazione: sono quelli di PubChem, e hanno buchi che si notano. Al cloro manca +3, al bromo +3 e +7, al manganese +6, all'ossigeno −1, all'osmio +8; il palladio ha "+3, +2" dove ci si aspetta +2 e +4; i gas nobili hanno solo 0, anche lo xeno. Dal rutherfordio in poi sono calcolati: nella scheda sono segnati "previsti", sul foglio da stampare non ci sono. Serve un elenco da libro di scuola: da quale tavola lo prendiamo?
- [ ] Elettronegatività dei gas nobili: cripton 3,00 e xeno 2,60 hanno un valore di Pauling e compaiono colorati; elio, neon e argon no. Meglio toglierli tutti dalla vista?
- [ ] Stato fisico: calcolato dai punti di fusione e di ebollizione a 1 atm. L'elio non solidifica mai; carbonio e arsenico sublimano (il carbonio a 3825 °C, l'arsenico a 614 °C) e nella scheda il loro punto di fusione è segnato "sotto pressione". Per 25 elementi almeno uno dei due punti non è noto, e dove lo stato non si può dire la casella è tratteggiata.
- [ ] Massa tra parentesi quadre: l'articolo dice che si usa per gli elementi radioattivi senza una composizione fissa in natura, e che torio, protoattinio e uranio hanno comunque una massa atomica. Va bene detto così?
- [ ] Le frasi sugli andamenti (per esempio "l'energia di ionizzazione in generale cresce da sinistra a destra lungo un periodo, con qualche eccezione: il boro meno del berillio, l'ossigeno meno dell'azoto") e l'articolo sotto la tavola vanno riletti come una lezione.

## Orbitali e numeri quantici (1° ottobre 2026)
Prima lezione del terzo anno di chimica, scritta ma non pubblicata; vedi [[2026-10-01 Gli orbitali hanno una lezione dedicata e un visualizzatore in tre dimensioni]] e le note in `docs/lezioni/chimica/note/52-chim-orbitali-numeri-quantici.md`. Tra parentesi la scelta fatta.
- [ ] La lezione sta nel programma, al posto di "Orbitali e numeri quantici" (scelta fatta), e spiega da dove vengono le forme: onda chiusa, nodi, mappa di probabilità. È troppo per una terza? In alternativa i nodi e gli orbitali in moto diventano una lezione di approfondimento a parte.
- [ ] I numeri quantici letti sui nodi: $n - 1$ nodi in tutto, $l$ nodi angolari (scelta fatta). I libri danno le regole senza i nodi: va bene così?
- [ ] Nomi: "numero quantico secondario" per $l$ e $m_l$ per il magnetico (scelta fatta), oppure "angolare" e $m$.
- [ ] Orbitale come "mappa della probabilità di trovare l'elettrone", con la superficie al 90% per i disegni dei libri (scelta fatta). Alcuni libri dicono 95%.
- [ ] Negli esercizi il livello 4 chiede di contare i nodi radiali e angolari: va tenuto?
- [ ] La frase "il segno conterà quando studierai i legami" anticipa gli orbitali molecolari, che il programma lascia fuori: toglierla?
- [ ] L'approfondimento dice che la velocità dei puntini è il flusso della probabilità e il momento angolare attorno all'asse, e che non è la velocità misurabile dell'elettrone: detto in modo accettabile per una terza?

## Grafico di funzioni e geometria analitica (2 ottobre 2026)
Vedi [[Grafico di funzioni]] e la proposta in [[Geometria analitica nel plotter]].
- [ ] L'equazione di una retta costruita da due punti si mostra in forma esplicita ($y = mx + q$), implicita ($ax + by + c = 0$) o in tutte e due a scelta?
- [ ] L'equazione di una circonferenza costruita: sviluppata ($x^2 + y^2 + ax + by + c = 0$) o con centro e raggio in vista?
- [ ] I nomi degli oggetti: $A, B, C$ per i punti e $r, s, t$ per le rette. Quale lettera per le circonferenze?
- [ ] L'ampiezza di un angolo costruito è scritta sempre in gradi, con un decimale ($36{,}9°$), anche se il piano usa i radianti per le funzioni. Va bene, o serve anche in radianti?
- [ ] I punti notevoli del triangolo prendono le lettere $G$ (baricentro), $O$ (circocentro), $I$ (incentro), $H$ (ortocentro). Sono quelle dei libri che usi?
- [ ] I nomi dei comandi che si scrivono nel plotter: `retta`, `segmento`, `semiretta`, `parallela`, `perpendicolare`, `asse`, `bisettrice`, `tangente`, `circonferenza`, `puntomedio`, `intersezione`, `baricentro`, `poligono`, `distanza`, `angolo`, `pendenza`; per i numeri `resto`, `mcd`, `mcm`, `binomiale`, `arrotonda`. Vanno bene, o i libri usano altre parole (per esempio "mediana", "altezza" come comandi a parte)?
- [ ] Le successioni partono da $a_0$ o da $a_1$? Il plotter accetta tutte e due, e disegna quella con il termine generale da $n = 0$. Negli esempi e nelle lezioni quale usiamo?
- [ ] Nella funzione integrale la variabile dentro l'integrale è $t$: $F(x) = \int_0^x f(t)\,dt$. Va bene come esempio?
- [ ] Nel plotter `varianza(a; b; c)` e `devstandard(a; b; c)` dividono per $n$, come nella lezione di statistica. Serve anche la versione campionaria ($n - 1$), con un nome suo?
- [ ] `casuale(2; 5)` è un numero tra 2 e 5, e per scegliere tra due soli valori servono le graffe: `casuale({2; 5})`. Con tre o più valori le graffe non servono. È chiaro per uno studente, o confonde?

## Confronto con i video di Atzeni (3 ottobre 2026)
Dal confronto con gli argomenti del canale del prof. Atzeni (`docs/lezioni/chimica/confronto-atzeni.md`, sessione [[2026-10-03 Video del prof. Atzeni]]). Le prime due sono anche per il prof. Magini.
- [ ] Gluconeogenesi, glicogeno (sintesi e demolizione) e beta-ossidazione degli acidi grassi: al quinto anno del liceo si fanno? Oggi l'albero ha glicolisi, fermentazioni, ciclo di Krebs con la fosforilazione ossidativa e fotosintesi. Serve una lezione sul metabolismo di lipidi e glicogeno, o basta un cenno?
- [ ] L'equazione di Nernst è stata aggiunta come lezione di approfondimento (`chim-nernst`), anche se il DM chiede solo "cenni di elettrochimica". Va bene tenerla così, o è troppo per il liceo?
- [ ] "Il pH dopo una reazione tra acido e base" (`chim-ph-miscele`) è una lezione a parte, dopo le soluzioni tampone. È l'ordine giusto, o va prima?

## Primo lotto di informatica: il primo anno (3 ottobre 2026)
Dal lotto delle 32 lezioni del primo anno ([[2026-10-03 Primo lotto di informatica]]). Qui le domande che toccano più lezioni o che decidono una convenzione; le altre, lezione per lezione, sono in `docs/lezioni/informatica/note/`. Le convenzioni scelte sono in `docs/lezioni/informatica/README.md`.

Convenzioni di tutto il lotto:
- [ ] Multipli del byte: kB = 1000 B (Sistema Internazionale) e KiB = 1024 B (norma IEC), con il fattore sempre scritto negli esercizi. Il vostro libro usa KB = 1024? Serve una frase in più nella lezione 03?
- [ ] Velocità di trasmissione in Mbit/s, e quantità di bit in Mbit. Oppure Mb e Mbps, come nelle offerte delle connessioni?
- [ ] Numeri nelle altre basi con il pedice ($1011_2$, cifre esadecimali in tondo). Le sequenze di bit in modulo e segno e in complemento a due sono senza pedice, perché sono bit in una rappresentazione e non numeri in base due: va bene?
- [ ] "Traboccamento" con "overflow" tra parentesi, "nucleo" con "kernel", "avvio" con "boot", "in attesa" e non "bloccato", "slide" con "diapositive": i termini italiani come principali vanno bene, o in classe si usano quelli inglesi?
- [ ] Funzioni del foglio di calcolo con i nomi italiani (`SOMMA`, `MEDIA`, `SE`, `CONTA.SE`) e il punto e virgola come separatore. Fogli Google in italiano usa gli stessi nomi?

Informazione e basi (lezioni 01-07):
- [ ] Informazione come "dato a cui è stato dato un significato", o la definizione con l'incertezza?
- [ ] I dati (documenti, foto) sono software? La lezione 02 dice di no. Il firmware sta nel software di base o è una categoria a parte? Antivirus e programmi di utilità dove stanno?
- [ ] Software libero e open source come sinonimi: va bene al primo anno?
- [ ] Da decimale a binario: quale metodo per primo? Ora le divisioni successive fino a 127 e la sottrazione delle potenze di due fino a 1023. Il limite di 10 bit (12 per l'esadecimale) va alzato a 16?
- [ ] "Quanti bit servono" compare nella 01, nella 03 e nella 05: dove deve stare?
- [ ] L'ottale ha una sezione breve e un livello di esercizi nella lezione sull'esadecimale: basta?
- [ ] La sottrazione binaria con il prestito ha un solo paragrafo e nessun esercizio. Va sviluppata?

Codifica (lezioni 08-12):
- [ ] Il complemento a due è definito dal peso negativo del bit più significativo, e "inverti e somma 1" è il procedimento. Va bene? Servono complemento a uno o eccesso?
- [ ] Virgola mobile: il formato a 32 bit con l'eccesso 127 è troppo per una prima? Serve un cenno a infinito e NaN?
- [ ] I codici ASCII 48, 65 e 97 si danno in verifica o si chiedono a memoria? Di UTF-8 serve il dettaglio dei bit di prefisso?
- [ ] "Risoluzione" è il numero di pixel o la densità in dpi? Servono tavolozza e CMYK?
- [ ] Campionamento: "almeno il doppio" o "più del doppio" della frequenza massima? Il teorema va nominato (Nyquist-Shannon)?

Architettura e sistema operativo (lezioni 13-22):
- [ ] Lo schema di von Neumann ha quattro blocchi (CPU, memoria centrale, periferiche, bus), con le memorie di massa tra le periferiche. Va bene, o serve un blocco a parte? Serve un cenno all'architettura Harvard?
- [ ] Il linguaggio macchina inventato della lezione sulla CPU ha le istruzioni in italiano (`CARICA`, `SOMMA`, `SALVA`, `FERMA`) e tre registri, senza MAR e MDR. O i nomi inglesi dei libri (`LOAD`, `ADD`, `STORE`)?
- [ ] "Istruzioni al secondo = frequenza diviso impulsi per istruzione" è molto semplificato: tenerlo?
- [ ] La ROM dentro la memoria centrale va bene? Servono dischi ottici e nastri?
- [ ] Le funzioni del sistema operativo sono cinque, o sei con "utenti e sicurezza"? Quattro strati, o il modello a cipolla del libro?
- [ ] Stati di un processo: tre (pronto, in esecuzione, in attesa), o cinque con "nuovo" e "terminato"? I thread sono un cenno senza esercizi: basta?
- [ ] Gestione della memoria: paginazione senza segmentazione va bene? Il conto delle pagine si chiede davvero in verifica?
- [ ] Percorsi: `C:\Utenti` (il nome mostrato in italiano) o `C:\Users` (quello vero sul disco)?

Foglio di calcolo, documenti e presentazioni (lezioni 23-32):
- [ ] Riferimenti assoluti: l'esempio è l'IVA al 22%. Meglio un cambio di valuta, che non invecchia? I riferimenti misti restano nella lezione, con la tavola pitagorica, o vanno in fondo come approfondimento?
- [ ] Mancano `#RIF!`, `CONTA.VALORI` e le varianti di `ARROTONDA`: servono?
- [ ] Grafici: la lezione dice "linee" per ogni andamento nel tempo, senza l'eccezione dei pochi dati a colonne. Serve il grafico a barre orizzontali? "Oltre cinque o sei fette" per la torta è una regola pratica.
- [ ] "Tabella pivot" va bene come unico nome? Fogli Google non ha il comando dei subtotali: la lezione va attenuata?
- [ ] Nomi degli stili: Titolo 1, Corpo del testo, Didascalia (quelli di LibreOffice Writer), "indice" con "sommario" detto una volta. In classe si usano questi?
- [ ] Presentazioni: da uno a due minuti per slide; al massimo 6 righe e almeno 24 punti. Vanno bene come regole, o servono numeri diversi?
- [ ] Diritto d'autore sulle immagini: citare l'eccezione didattica (legge 633/1941, articolo 70)? Da vedere anche con chi segue il legale.

Fatti da verificare (le lezioni sono online dal 3 ottobre 2026; questi sono scritti a memoria dagli agenti, con la fonte nelle note): "First Draft of a Report on the EDVAC" (1945); ASCII (1963, minuscole nel 1967); Unicode 1.0 (1991); IEEE 754 (1985); il teorema del campionamento (Shannon 1949); il CD audio a 44,1 kHz e 16 bit; i prefissi binari IEC (1998); il supercomputer Leonardo del CINECA; i comportamenti dei programmi (nomi degli errori del foglio in italiano, aggiornamento dell'indice e della tabella pivot, `SUBTOTALE`).

## Informatica, prime lezioni di programmazione (5 ottobre 2026)
Cinque lezioni del secondo anno scritte come prova: 47 "I diagrammi di flusso", 53 "Variabili, assegnamento e tipi di dato", 57 "La selezione a due vie", 60 "Il ciclo while", 61 "Il ciclo for". Le domande di ogni lezione sono nelle note `docs/lezioni/informatica/note/`; qui quelle che valgono per tutto il blocco di programmazione.

- **Linguaggi.** Ogni programma è in Python e in C++, con due linguette. Va bene questa coppia, o serve anche il C, o un linguaggio solo?
- **Nomi delle strutture.** "Ripetizione", "iterazione" o "ciclo"? "Selezione a una via e a due vie" o "semplice e doppia"? Una ripetizione del corpo è un "giro" o un'"iterazione"?
- **Diagrammi di flusso.** L'assegnamento si scrive con la freccia ← o con `=`? Sui rami "sì" e "no" oppure "vero" e "falso"? Basta un parallelogramma unico per leggere e scrivere? Nella selezione a una via il ramo "sì" va a destra o in basso? Il `for` si disegna come il `while` equivalente o con un blocco suo?
- **Nomi delle variabili.** Una lettera, come nei diagrammi dei libri, o nomi interi (`spesa`, `voto`)? Le lezioni oggi non sono uniformi: 47, 60 e 61 usano una lettera, 53 e 57 nomi interi.
- **C++.** `string` e `double` da subito? Le graffe sempre, anche con una sola istruzione? `i++` da subito? Il contatore dichiarato dentro il `for`? Il ciclo di base è `i = 0; i < n` oppure `i = 1; i <= n`?
- **Cosa entra al biennio.** Il `do-while`, almeno nel diagramma? La divisione intera `//` di Python già nelle variabili? Il resto dei numeri negativi, che in Python e in C++ dà risultati diversi?
- **Parole.** "Numero con la virgola" o "numero reale"? "Bocciato" o "non promosso" negli esempi? La variabile di appoggio dello scambio si chiama `temp`, `aux` o `appoggio`? Lo zero che chiude una lettura ha un nome ("sentinella")? L'errore di un giro in più o in meno ha un nome in classe?
- **Tabella di traccia.** Una riga per istruzione, una per controllo della condizione o una per giro?
- **Diagramma che si esegue.** I dodici diagrammi delle cinque lezioni ora si eseguono un blocco alla volta ([[Diagrammi di flusso eseguibili]]). Nel rombo le condizioni composte si uniscono con E, O, NON in maiuscolo: va bene, o servono AND, OR, NOT? Quoziente e resto si vedono come `div` e `mod`: sono le parole giuste al biennio? La divisione `/` dà il numero con la virgola anche tra interi (7 / 2 fa 3,5), come in Python e non come in C++: è la scelta giusta per un diagramma?

## Informatica, secondo anno (5 ottobre 2026)
Le altre 27 lezioni del secondo anno ([[2026-10-05 Secondo anno di informatica]]). Ogni lezione ha le sue domande nella nota in `docs/lezioni/informatica/note/`; qui quelle che cambiano più lezioni insieme.

- **Pseudocodice (48, 49).** Ha la forma dei blocchi del diagramma: `leggi`, `scrivi`, `←`, `se` / `altrimenti` / `finché` con il rientro, in minuscolo, con `inizio` e `fine`. Va bene, o in classe si usa `SE ... ALLORA ... FINE SE` e `MENTRE ... ESEGUI`?
- **Nome della terza struttura.** "Ripetizione" e "ciclo" nella 47, "iterazione" nella 49 e nel titolo del capitolo: se ne sceglie uno?
- **Proprietà dell'algoritmo e fasi (45, 46).** Cinque proprietà (finito, non ambiguo, eseguibile, deterministico, generale) e cinque fasi (analisi, strategia, algoritmo, prova, programma): sono i nomi che usi?
- **Teorema di Böhm-Jacopini (49).** L'enunciato è alla portata di una seconda? Si nomina il `goto`? Serve il ciclo con la condizione in coda, che i nostri diagrammi non disegnano?
- **Programmazione a blocchi (50).** Non abbiamo un ambiente a blocchi: la lezione usa i diagrammi modificabili. È un sostituto accettabile, o in classe si usa Scratch e la lezione deve seguirlo?
- **Primo programma (52).** `string` già dalla prima lettura o prima un numero? `endl` o `"\n"`? `return 0;` sempre? I commenti qui?
- **Espressioni (54).** Il resto dei numeri negativi si tratta al biennio? `pow` o il prodotto per le potenze in C++? `(double) a / b` o `a * 1.0 / b`? Le forme brevi (`+=`, `i++`) qui o con i cicli?
- **Errori (55).** I nomi dei tre tipi ("in esecuzione" o "di runtime", "logici" o "semantici")? Gli avvisi del compilatore si trattano? Si usa un debugger?
- **Condizioni e operatori logici (56, 58).** In C++ un valore vero o falso si stampa come 1 e 0, o si insegna `boolalpha`? Tabelle di verità con vero e falso, V e F, o 1 e 0? De Morgan al secondo anno? Il corto circuito si nomina? In Python si fa usare `1 <= voto <= 10`?
- **Selezione a più vie (59).** Lo `switch` al secondo anno? E `match` di Python? "A più vie" o "multipla", "annidate" o "nidificate"?
- **Cicli (62, 63, 64).** "Accumulatore" anche per il prodotto? `totale += punti` dal secondo anno? Il limite di `int` e il fattoriale che sbaglia vanno detti? Massimo e minimo partono dal primo dato o da un valore "impossibile"? "Valore di fine", "sentinella" o "tappo"? Media in C++ con la somma `double` o con il cast?
- **Internet (33-39).** "Fornitore di accesso" o "provider"? IPv6 con le abbreviazioni o solo che esiste? Le parti dell'URL sono "protocollo, nome del server, percorso" o "schema, host, path"? I cookie stanno nella 36, nella 43 o in nessuna? PEC, POP3 e FTP restano? I social network vanno qui o nella cittadinanza digitale?
- **Sicurezza (40-44).** Il conto delle combinazioni di una password con le potenze è alla portata di una seconda? Si contraddice "cambia la password ogni tre mesi"? Servono i nomi smishing, vishing, spear phishing? Il cyberbullismo ha una lezione sua? Le norme delle lezioni 43 e 44 vanno rilette con le fonti: l'elenco è nelle due note.

## Informatica, esercizi del secondo anno (5 ottobre 2026)
I 32 generatori del secondo anno ([[2026-10-05 Secondo anno di informatica]]). Ogni specifica in `specs/exercises/<slug>.md` finisce con le sue domande; qui quelle che decidono più livelli.

- **Scelte di fondo.** Dalla sera del 5 ottobre una risposta aperta deve contenere il costrutto della lezione (deciso da Alessandro): nel capitolo sui cicli chi somma da 1 a n con la formula si vede dire che manca il ciclo. Va bene, o lì la formula deve passare? Nei testi le condizioni composte sono scritte con E, O, NON come nei diagrammi: va bene, o `and` / `or`?
- **Pseudocodice (48).** Ora il sito mostra un testo su più righe: i livelli vanno rifatti con lo pseudocodice intero, nella forma della lezione?
- **Classificazioni da rileggere.** Le tabelle di vero e falso e di "che cosa fare" delle lezioni 33-44 e 51; i dodici problemi della 46 con i loro vincoli; i dati di tipo testo e numero della 53; i tre tipi di errore della 55, in particolare il "nome non definito".
- **Divisione.** Dove serviva una divisione esatta gli esercizi usano `div` o `//` con numeri divisibili, perché `/` dà risultati diversi nei due linguaggi. Va bene?
- **Cicli.** Metà dei `for` in C++ ha `i < 6` e metà `i <= 5`: una forma sola? Nei cicli annidati le opzioni sono con il `while`: va bene in una lezione che usa solo `for`?
- **Selezione.** Le fasce della 59 non usano il voto con i giudizi, che è l'esempio della lezione: lo si vuole anche negli esercizi?

## Strumenti montati nelle lezioni (5 ottobre 2026)
I piani con i cursori, i programmi e i diagrammi aggiunti a 39 lezioni già scritte ([[2026-10-05 Strumenti nelle lezioni]]). Ogni domanda nomina la lezione.

- **Matematica, primo anno.** Nella 16 e nella 50 un'equazione è letta come incontro di due rette, che anticipa i sistemi lineari del secondo anno: va bene al primo? Nella 11 il diagramma della divisione dà solo le cifre dopo la virgola e si ferma a 8: basta? Nella 52 la tariffa è una retta continua, anche se gli ingressi sono numeri naturali. Nella 44, con $a = 0$, il punto $Q$ resta disegnato mentre l'inversa sparisce, e il testo non lo commenta.
- **Matematica, secondo anno.** Nella 78 c'è un grafico prima della lezione sul piano cartesiano, con un rimando in avanti alla parabola: accettabile, o va tolto? Nella 68 e nella 84, quando le rette coincidono, sotto il piano il punto comune risulta "non esiste", mentre i punti comuni sono infiniti (la domanda porta lo studente a vederlo). Nella 69 il diagramma segue la tabella, quindi nel caso del riquadro "Il caso in cui la tabella sbaglia" risponde "indeterminato"; i coefficienti $a'$, $b'$, $c'$ lì si chiamano `a2`, `b2`, `c2`. Nella 82, 83 e 85 i punti si muovono con cursori chiamati $u$, $v$, $s$, lettere che la lezione non usa. Nella 89 l'asse $y$ si chiama "area" senza unità. Nella 90 e nella 92 (esempio 13) la figura di copertina è composta e il piano ne mostra solo una parte.
- **Fisica.** Nella 39 il cursore si chiama $h$ e la domanda dice che è $\Delta t$: confonde? Nella 10 la pendenza è in centimetri ogni 100 g, mentre la lezione 11 la scrive $0{,}040$ cm/g. Nella 12 le costanti delle quattro leggi ($0{,}8x$; $0{,}5x + 3$; $12/x$; $0{,}1x^2$) sono scelte per avere numeri puliti, senza unità.
- **Chimica.** Nella 32 la pressione della figura non è scritta, quindi il cursore è $V_0$: se la lezione dichiara la pressione, il cursore può prendere quel nome. Nella 31 la temperatura della tabella non è scritta, quindi il cursore è il prodotto $p \cdot V$: se si scrive la temperatura, può essere $T$ in kelvin. Nella 19 il rimando alla tavola periodica viene prima della lezione 22, dove arrivano elementi e simboli: va bene lì?
- **Fisica, scene della sandbox** (20, 54, 55). Le forze hanno i nomi delle lezioni ($P$, $F_v$, $F_s$, $F_d$, $T$): vanno bene anche dove la lezione 55 scrive $m_2\vec{g}$ per il peso? Nella 54 il grafico è la velocità lungo la rampa, positiva in salita, come nell'esempio 4: va detto di più nel testo? Nella 55 il blocco, dopo che il pesetto ha toccato terra, prosegue e si ferma per attrito: è un caso che la lezione non tratta.
- **Fisica, terzo anno, dalla revisione del 6 ottobre 2026.** Il peso è $mg$ nelle figure delle lezioni 79, 81 e 88 e in `LavoroDueCammini`, $P$ altrove: una sola scrittura? Nella 81 la forza del suolo si chiama $F_s$, che nel corso è l'attrito statico: $F_v$? La quantità di moto è blu nelle lezioni 80, 82, 83 e blu scuro nella 90: quale colore? Nella 82 le forze interne sono arancioni, il colore della risultante. Nella 99 il tubo ha il tratto alto la metà con $v_2$ doppia, mentre con il diametro dimezzato la lezione 98 dà un fattore 4. Nella 97, riga 75, con i numeri scritti viene $7{,}05 \cdot 10^{10}$ J e non $7{,}06$. Sette figure non partono dai numeri di un esempio della lezione (rampa con attrito della 79, vagone di Galileo, lancio obliquo, urto elastico, biliardo, centro di massa, urto anelastico): si cambiano i valori di partenza o gli esempi? Nella figura della 79 le barre dell'energia hanno sempre la stessa altezza totale, anche raddoppiando la massa.
- **Informatica.** Nella 05 e nella 26 c'è un diagramma di flusso al primo anno, prima della lezione 47, con due righe su come si legge: va bene, o serve un rimando? Nella 09, 10 e 41 c'è un programma in Python per chi non programma ancora, con la frase "non serve saper programmare"; nella 10 compare `.encode("utf-8").decode("latin-1")`, la riga meno leggibile. Nella 36 la lezione ora nomina i tag `<h1>`, `<p>`, `<a href>`: l'HTML non ha una sua lezione nel biennio, è il posto giusto per introdurli?

## Matematica, terzo anno (5 ottobre 2026)
Dal lotto [[2026-10-05 Terzo anno di matematica]]. Le domande minori sono nelle note `docs/lezioni/note/105-129` e in fondo alle specifiche `specs/exercises/`.

- **Convenzioni di tutto l'anno.** Coordinate con la virgola, $P(2, -3)$, e non intere come frazioni, come nel biennio: resta così, o si passa al punto e virgola dei libri? $\ln x$ per la base $e$ e $\log x$ per la base 10, oppure $\text{Log}$ e $\log$? "Crescente" senza aggiunte vuol dire in senso stretto (lezione 107): è l'uso del libro?
- **Funzioni (105-109).** Gli intervalli di monotonia hanno l'estremo chiuso nel vertice, "decrescente in $]-\infty, 2]$ e crescente in $[2, +\infty[$": in classe si scrive così o "per $x < 2$"? Le funzioni periodiche prima della goniometria, con $\lfloor x \rfloor$ e $\operatorname{mant}(x)$: il libro le tratta, e con quale notazione? Nelle trasformazioni composte la lezione fa raccogliere il coefficiente in $f(2x - 4)$: è l'ordine che insegni? Negli esercizi sulle trasformazioni si chiede dove va un punto, perché gli esercizi non mostrano grafici: basta?
- **Successioni (110-113).** Si parte da $a_1$ anche se $0 \in \mathbb{N}$: va bene? Il simbolo di sommatoria non compare mai: va introdotto qui? La somma infinita della progressione geometrica sta in un riquadro, senza "limite" e "serie": resta? Somma dei quadrati e disuguaglianza di Bernoulli sono al livello giusto, e serve l'induzione forte? Gli esercizi sull'induzione chiedono i pezzi (un caso, la tesi, il passo, l'errore): sono quelli giusti?
- **Circonferenza e parabola (114-117).** La tangente alla parabola in un punto è data con $m = 2ax_0 + b$, senza sdoppiamento; nella 115 lo sdoppiamento è in un riquadro, mentre ellisse e iperbole lo usano come metodo principale: si uniforma? Il segmento parabolico e la formula $\frac{|a| \cdot |x_2 - x_1|^3}{6}$ restano al terzo anno? Fuoco e direttrice si trovano dal vertice aggiungendo e togliendo $\frac{1}{4a}$: va bene? Per le tangenti da un punto esterno gli esercizi chiedono i due coefficienti angolari: bastano?
- **Ellisse e iperbole (118-120).** $a$ sta sempre sotto $x^2$, anche con i fuochi sull'asse $y$ (ellisse con $b > a$, iperbole con secondo membro $-1$): il libro chiama invece sempre $a$ il semiasse maggiore o trasverso? Il passaggio da $x^2 - y^2 = a^2$ a $xy = k$ usa il prodotto delle distanze dagli asintoti, senza rotazione: va bene? Coniche traslate, area dell'ellisse e funzione omografica per tre punti restano fuori?
- **Esponenziali (121-123).** Con la base tra 0 e 1 la strada principale è invertire il verso, e riscrivere in base maggiore di 1 è un suggerimento: o il contrario? Nella sostituzione la condizione $t > 0$ si dichiara subito, senza sistema: basta? Il numero $e$ è presentato con $\left(1 + \frac{1}{n}\right)^n$ dall'interesse composto e chiamato "numero di Nepero": è la linea del libro?
- **Logaritmi (124-127).** Le condizioni di esistenza si scrivono prima, con la verifica finale ammessa come alternativa; nelle disequazioni il sistema tiene sempre tutte e due le condizioni: va bene? L'incognita nella base e il valore assoluto di un logaritmo restano fuori? Una soluzione si lascia come $\log_2 39 - 4$ o si chiede $\log_2 \frac{39}{16}$ o il valore approssimato? Le opzioni delle disequazioni sono scritte solo con gli intervalli: serve anche $2 < x \leq 4$?
- **Esercizio guidato della 121 (6 ottobre 2026).** L'ultima fermata chiede di riconoscere che $3 = \left(\frac{1}{3}\right)^{-1}$ per trovare lo zero di $y = \left(\frac{1}{3}\right)^x - 3$: va bene nella lezione sulla funzione, o è un passaggio della 122? I messaggi per gli errori previsti delle quattro fermate vanno riletti. Vedi [[2026-10-06 Grafici negli esercizi ed esercizio guidato]].
- **Statistica bivariata (128-129).** Covarianza e $r$ dividono per $n$, come la varianza della 57. Il chi quadrato è solo nominato: va calcolato nella 128? La seconda retta di regressione manca nella 129: serve? Vanno bene i simboli $f_{ij}$, $r_i$, $c_j$, o si passa a $n_{ij}$? Per $r$ non ci sono soglie (forte, debole), e gli esercizi usano $|r| \leq 0{,}09$ e $|r| \geq 0{,}80$: vanno bene?

## Laboratorio: saggi alla fiamma (5 ottobre 2026)
Il secondo esperimento del laboratorio di chimica, vedi [[2026-10-05 Saggi alla fiamma]] e [[Laboratori]]. I dati sono in `src/lib/lab/saggi.ts`.
- [ ] **Colori e nomi.** LiCl rosso carminio, NaCl giallo intenso, KCl lilla, CaCl₂ rosso arancio, SrCl₂ rosso scarlatto, BaCl₂ verde giallo, CuCl₂ verde azzurro: sono i nomi che useresti in classe? Presi dalle tabelle scolastiche, senza una fonte citata: da verificare.
- [ ] **Attraverso il vetro al cobalto.** Il sodio sparisce e il potassio diventa rosso violaceo; gli altri si attenuano (litio e stronzio restano rossastri, il calcio verdino, il rame blu). Vanno bene, o nel gioco conviene mostrare il vetro solo per sodio e potassio?
- [ ] **Lunghezze d'onda.** Nel catalogo, non ancora mostrate: Li 671 nm, Na 589 nm, K 766 e 404 nm, Ca 622 e 554 nm, Sr 606 e 461 nm, Ba 524 e 554 nm, Cu 510-555 nm. Da verificare prima di usarle.
- [ ] **Procedura.** Acido cloridrico 2 M con etichetta "irritante" (a scuola si usa più concentrato?); ansa al nichel-cromo; l'ansa pulita prima in acido e poi in fiamma finché non la colora più; il sale preso con l'ansa bagnata; l'ansa sul bordo della fiamma, poco sopra il cono azzurro. Cambieresti qualcosa?
- [ ] **Campioni incogniti.** X è un sale bianco tra litio, potassio, calcio, stronzio e bario; Y è sodio, da solo o con il potassio. Distinguere litio, stronzio e calcio è la parte difficile: è giusto chiederlo al biennio?
- [ ] **Parole.** "Il sale evapora nella fiamma" (non "brucia"), "ansa", "vetrino da orologio", "cartellino": vanno bene?
- [ ] **Sicurezza nella scheda.** Occhiali, capelli raccolti, ansa rovente, HCl 2 M irritante, cloruro di bario tossico se ingerito, cloruro di rame nocivo: manca qualcosa?
- [ ] **Prossimi esperimenti.** Titolazione acido-base, pila Daniell e laboratorio libero sono segnaposto nel menu, non scelti con te: quali esperimenti del biennio metteresti per primi?

## Laboratorio: titolazione acido-base (6 ottobre 2026)
Il terzo esperimento del laboratorio di chimica, vedi [[2026-10-06 Titolazione acido-base]] e [[Laboratori]]. I dati sono in `src/lib/lab/titolazione.ts`.
- [ ] **Anno.** Nella scheda è indicato il triennio: la titolazione di un acido forte con una base forte la faresti al terzo o al quarto anno, o già al secondo?
- [ ] **Reagenti e quantità.** NaOH 0,100 mol/L nella buretta, 25,0 mL di HCl tra 0,052 e 0,074 mol/L nella beuta, fenolftaleina all'1% in etanolo, due gocce. Sono i valori che useresti in classe?
- [ ] **Buretta da 25 mL.** Graduata ogni 0,1 mL, letta a 0,05 mL stimando la metà della divisione. Nel gioco è più corta di una vera (25 mL in 22 cm) perché lo zero resti sotto gli occhi: va detto allo studente?
- [ ] **Procedura.** Buretta "già avvinata", riempita sopra lo zero con l'imbutino, imbuto tolto, aria fatta uscire dalla punta, menisco tra 0 e 5 mL (non per forza sullo zero); una titolazione di prova e due accurate su beute diverse, la media delle due accurate. Cambieresti qualcosa? L'avvinamento della buretta e della pipetta andrebbe fatto fare allo studente?
- [ ] **Concordanza.** Due titolazioni accurate "concordano" entro 0,20 mL. A scuola si chiede 0,10 mL: quale soglia vuoi?
- [ ] **Colore al viraggio.** Scelto per giocare bene, non misurato: una goccia (0,05 mL) oltre l'equivalenza dà un rosa pallido, 0,3 mL un fucsia pieno. Il rosa che compare dove cade la base sparisce agitando, sempre più lentamente vicino alla fine. Corrisponde a quello che si vede davvero?
- [ ] **Anidride carbonica.** Il rosa pallido che svanisce dopo mezzo minuto per la CO₂ dell'aria non c'è: nel gioco il rosa resta. Va aggiunto o almeno detto?
- [ ] **Troppo indicatore.** Dalla quinta goccia il quaderno segna che la fenolftaleina "è un acido debole e consuma un po' di base". È detto bene?
- [ ] **Parole.** "Viraggio", "titolante", "becher degli scarti", "imbutino", "avvinata", "rubinetto della buretta": vanno bene?
- [ ] **Sicurezza nella scheda.** Occhiali, NaOH 0,1 M irritante, HCl diluito irritante, fenolftaleina in etanolo lontano dalle fiamme. Per la fenolftaleina serve un'avvertenza in più (è classificata come sospetto cancerogeno, da verificare sulla scheda di sicurezza)?
- [ ] **Smaltimento.** Il quaderno dice che le soluzioni titolate, quasi neutre, vanno nel recipiente dei rifiuti acquosi. Giusto così?

## Terzo anno di chimica (6 ottobre 2026)
Le 33 lezioni nuove del terzo anno di chimica (file 48-82). Vedi [[2026-10-06 Terzo anno di chimica]]. Qui le domande che valgono per più lezioni, con la scelta fatta tra parentesi; le altre sono nella sezione dei dubbi di `docs/lezioni/chimica/note/48-82`.
- [ ] **Soglie di $\Delta\chi$.** Sotto 0,4 covalente puro, tra 0,4 e 1,9 polare, sopra 1,9 ionico (scelta fatta), oppure 1,7 per lo ionico? Con i dati della tavola del sito restano sotto 1,9 composti ionici veri (KI 1,84, MgCl₂ 1,85, Na₂S 1,65), mentre BF₃, covalente, fa 1,94; con 1,7 il legame H–F (1,78) diventerebbe ionico. Le lezioni 64, 65 e 69 danno la soglia come regola pratica e gli esercizi usano solo coppie in cui soglia e "metallo più non metallo" concordano.
- [ ] **Ordine di scrittura della configurazione.** $4s^2\,3d^6$, nell'ordine di riempimento come la tavola del sito (scelta fatta), o $3d^6\,4s^2$, per livello? Cambiarlo tocca `elementi.json`, le lezioni 53 e 57 e tre generatori.
- [ ] **Simboli di Lewis.** Un puntino per lato fino a quattro, poi le coppie (scelta fatta), o prima la coppia dell'$s$? Decide come si disegnano berillio, boro e carbonio, anche nella 67.
- [ ] **Ottetto o ottetto espanso.** Per H₂SO₄, SO₄²⁻, SO₃ e HClO₄ la 67 mostra tutte e due le formule e negli esercizi usa quella con l'ottetto, i legami dativi e le cariche formali. Quale vuoi come riferimento? E la carica formale si tiene in terza?
- [ ] **Nomenclatura, i tre nomi.** Sempre nell'ordine tradizionale, Stock, IUPAC (scelta fatta). Per gli ossiacidi la 80 ne dà due, tradizionale e IUPAC, perché il numero romano è già dentro "acido tetraossosolforico(VI)": serve anche una colonna Stock, e come si scrive? Per idracidi e idruri covalenti la 78 dà anche lo Stock ("solfuro di idrogeno"): lì ne bastano due?
- [ ] **Prefissi IUPAC.** Senza elisione, "pentaossido di difosforo" (scelta fatta), o "pentossido"? Il prefisso mono- solo in "monossido" e solo se l'elemento ha più ossidi (FeO monossido di ferro, CaO ossido di calcio): va bene?
- [ ] **Nome IUPAC dei sali con più anioni.** "bis[triossonitrato(V)] di calcio", "tris[tetraossosolfato(VI)] di diferro" (scelta fatta), o "tetraossosolfato(VI) di ferro(III)" con il numero romano sul metallo? La forma del Valitutti non è stata controllata sul libro: da verificare.
- [ ] **Sali acidi.** Nella colonna "tradizionale": idrogenocarbonato (scelta fatta, come nella lezione 47), bicarbonato o carbonato acido?
- [ ] **Idruri covalenti.** La 78 dice che nel silano l'idrogeno ha $-1$ e che nella fosfina il segno è una convenzione. A scuola si dà $+1$ all'idrogeno in tutti gli idruri covalenti?
- [ ] **Raggi atomici.** La tavola del sito ha i raggi covalenti (sodio 155 pm); molti libri danno per i metalli il raggio metallico (186 pm). Teniamo i covalenti?
- [ ] **Affinità elettronica.** Energia liberata, con il segno più, e "nessuna" dove l'anione non è stabile (scelta fatta), o valori negativi come il Valitutti? Stessa domanda per l'energia reticolare, data positiva nella 65.
- [ ] **Conti che forse sono troppo per una terza.** La carica nucleare efficace come $Z$ meno gli elettroni interni (59); il principio di indeterminazione con $\Delta x \cdot m\,\Delta v \geq \frac{h}{4\pi}$ (51); una mole di fotoni in kJ/mol (48); il bilancio di energia con le energie di legame (62); esponenziali e logaritmi nel tempo di dimezzamento (55); il difetto di massa in joule e non in MeV (56); il debye e la somma dei dipoli con il coseno (69); le frazioni delle particelle nella cella elementare (75).
- [ ] **Sottolivelli nella 50.** Introdotti dal gradino più piccolo dentro un livello nelle energie di ionizzazione successive e dagli spettri: va bene, o in classe si danno come regola? La formula di Rydberg e i valori in eV mancano nella 49: servono?
- [ ] **Teoria del legame di valenza e ibridazione.** Nella 70 i lobi hanno due colori per il segno della funzione d'onda; nella 71 l'ibridazione è raccontata in due passi (promozione, mescolamento) e acqua e ammoniaca sono $sp^3$. Va bene?
- [ ] **Forze intermolecolari.** "Forze di van der Waals" vuol dire dipolo-dipolo più London (scelta fatta nella 72)? Il legame a idrogeno con le parole "donatore" e "accettore" e solo con F, O, N (73)? La tensione di vapore in mmHg (74)? Il diagramma di stato non è in nessuna lezione dell'albero: dove va?
- [ ] **Radioattività.** La cattura elettronica si tiene (54)? Il carbonio 14 con 5730 anni, come i libri, mentre NUBASE2020 dà $5{,}70 \cdot 10^3$ (55)? Il neutrone a 1,00866 u o 1,00867 (56)?
- [ ] **Nomi.** "Kripton" come la tavola del sito (scelta fatta il 6 ottobre, corretta anche la lezione 43 che scriveva "cripto"), e "xeno".
- [ ] **Numeri di ossidazione che mancano nella tavola del sito.** Cloro $+3$, ossigeno $-1$, bromo $+7$, manganese $+6$: le lezioni 76-80 li usano. Li aggiungiamo a `elementi.json`?
- [ ] **Dati scritti a memoria, da verificare su una fonte.** Energie di ionizzazione successive dei primi venti elementi (50, 59), raggi ionici (59, 65), affinità elettroniche (60), energie e lunghezze di legame (62, 63, 70), energie reticolari (65), momenti dipolari (69), temperature di ebollizione e tensioni di vapore (72-74), righe degli spettri (48). Gli elenchi sono nelle note delle lezioni.

## Terzo anno di fisica (6 ottobre 2026)
Le 49 lezioni del terzo anno (71-119): relatività galileiana, forze conservative, quantità di moto, corpo rigido, gravitazione, fluidi in moto, gas, primo e secondo principio. Vedi [[2026-10-06 Terzo anno di fisica]]. Qui le domande che valgono per più lezioni, con la scelta fatta tra parentesi; le altre sono nella sezione "Domande per Andrea" di ogni nota in `docs/lezioni/fisica/note/71-119` e, raccolte per gruppo, in `docs/lezioni/fisica/rapporti-terzo-anno.md`.
- [ ] Urti: velocità dopo l'urto $V_1$ e $V_2$ (scelta fatta, come l'Amaldi, da verificare) oppure $v_1'$ e $v_2'$.
- [ ] Primo principio $\Delta U = Q - W$ con il lavoro compiuto dal sistema (scelta fatta) oppure $\Delta U = Q + W$ con il lavoro subito.
- [ ] Secondo principio: $T_c$, $T_f$, $Q_c$, $Q_f$ in valore assoluto (scelta fatta) oppure $T_2$, $T_1$, $Q_2$, $Q_1$; $\text{COP}_f$ e $\text{COP}_p$ per frigorifero e pompa di calore.
- [ ] Microstati $\Omega$ in $S = k_B \ln \Omega$ (scelta fatta, perché $W$ è il lavoro) oppure $W$ come sui libri.
- [ ] Forza centrifuga $F_{cf}$ (scelta fatta; nella 57 $F_c$ è la centripeta); forze apparenti disegnate tratteggiate; Coriolis senza formula, o con $2\,m\,\omega\,v'$ in un riquadro.
- [ ] Gittata $L$ nella 76 e $x_G$ nella 56 del biennio: si uniforma il biennio?
- [ ] $\vec I$ per l'impulso e $I$ per il momento d'inerzia: basta la freccia a distinguerli? Nella 88 $M$ è sia il momento sia la massa della carrucola.
- [ ] Il coefficiente $c$ in $I = c\,m\,r^2$ (gruppo 35) non è nel README: va bene come lettera?
- [ ] Il coseno di un angolo ottuso introdotto nella 71 con $\cos(180^\circ - \alpha) = -\cos\alpha$, prima della goniometria: va bene, o il prodotto scalare aspetta?
- [ ] $\ln$ usato come tasto della calcolatrice nel lavoro dell'isoterma e nell'entropia, con il link alla lezione sui logaritmi: basta?
- [ ] La forza come opposto della pendenza del grafico di $U$ e l'equilibrio stabile e instabile (78): al terzo anno, prima delle derivate?
- [ ] Componenti di un vettore scritte $(4;\ 3)$ o $(4, 3)$ nella 71.
- [ ] Negli esercizi sull'impulso i tempi d'urto sono decine di millisecondi per tenere le forze sotto i 100 N: meglio tempi realistici e forze in kilonewton?
- [ ] Costanti, dati dei pianeti, viscosità, calori molari, date e fatti storici scritti a memoria: gli elenchi "Da verificare" delle note, soprattutto 92, 93 e 112.

## Laboratorio di fisica (7 ottobre 2026)
Piano in [[Laboratorio di fisica]]; niente è ancora costruito.
- [ ] Quali esperienze di laboratorio si fanno davvero, anno per anno, in un liceo scientifico? L'elenco di partenza è di Claude, senza una fonte: densità, molla, pendolo, rotaia con fototraguardi, tavolo delle forze, leva, Archimede, calorimetro; urti e Boyle al terzo anno; riflessione, Snell, lenti, Young; Ohm, serie e parallelo, condensatore, induzione.
- [ ] Per le prime quattro schede (pendolo, molla, rotaia, densità): quali strumenti e con quale sensibilità, quante misure ripetute, e come si scrive l'incertezza al biennio (semidispersione, errore assoluto e relativo).

## Simulazioni di verifica (8 ottobre 2026)
Per [[Simulazioni di verifica]], matematica al biennio.
- [ ] Una verifica scritta vera: quanto dura (un'ora di lezione, due), quanti esercizi ha, e quanti sono esercizi brevi, espressioni o equazioni lunghe, problemi?
- [ ] Come si distribuiscono i punti tra gli esercizi e come si passa dai punti al voto in decimi? Dove sta la sufficienza?
- [ ] Il credito parziale: quanto vale un esercizio con il metodo giusto e un errore di calcolo? E un risultato giusto senza passaggi?
- [ ] Quanto tempo in più ha di solito uno studente con un PDP?

## Informatica, terzo anno (7 ottobre 2026)
Dal lotto [[2026-10-07 Terzo anno di informatica]]: 34 lezioni (65-98), scritte e non ancora pubblicate. Le scelte fissate prima di scrivere sono nella sezione "Scelte del lotto" di `docs/lezioni/informatica/brief-terzo-anno.md`; le domande minori restano nelle note `docs/lezioni/informatica/note/65-98`. Qui le più pesanti per prime, poi lezione per lezione.

Scelte che cambiano più lezioni:
- [ ] **Vettori in C++ (70 e tutto il resto fino alla 80).** Array a dimensione fissa con una costante, `const int N = 5; int v[N];`, passati a una funzione come `int v[], int n`, e `vector` solo in un riquadro della 70 con `push_back`: è quello che fai in classe? La costante `N` prima di `main`, dentro `main`, o con `#define`? Quando i dati sono "quanti ne vuole l'utente" usi un array con una capienza massima e una variabile `n` per gli elementi usati?
- [ ] **`int v[100]` negli esercizi.** Nei generatori il vettore è dichiarato `int v[6]` senza la costante (75) o `int v[MAX]` con `const int MAX = 100` (76, 77), perché il programma stia nelle righe di un esercizio sul telefono: va bene, o serve una forma sola, uguale a quella della lezione 70?
- [ ] **Passaggio dei parametri in Python (68).** La lezione ha due modelli, uno per linguaggio: in C++ "per valore" e "per riferimento" con `&`; in Python "un nome attaccato a un valore", senza le parole "oggetto", "mutabile" e "immutabile". Va bene, o preferisci dire "per valore" e "per riferimento" anche per Python, come fanno molti libri? Lo scambio riuscito in Python è `return y, x`: si può mostrare un `return` con due valori? Presenti anche `const int &x`?
- [ ] **`imin != i` prima dello scambio (75, 78).** Nell'ordinamento per selezione lo scambio si fa solo quando `imin != i`, o sempre come in molti libri? Cambia il conto degli scambi (3 contro 5 sui sei tempi della lezione) e deve essere uguale nella 78.
- [ ] **Python con o senza `def main():` (65, 67).** Le istruzioni fuori dalle funzioni sono chiamate "programma principale", e in Python le sue variabili sono globali mentre in C++ quelle di `main` sono locali. Basta dirlo in un riquadro, o dal terzo anno i programmi Python devono avere `def main():`?
- [ ] **Che cosa si conta (71, 74, 78).** Un confronto per ogni elemento guardato, e non i due confronti (`==` e `<`) di ogni giro della ricerca binaria: va bene? Nella 78 si contano solo i confronti nel caso peggiore, e scambi e spostamenti restano nella tabella: è la scelta giusta, o vuoi anche gli assegnamenti (tre per scambio) e il caso medio degli ordinamenti?
- [ ] **Il logaritmo prima di averlo fatto (74, 78).** È solo nominato e spiegato con i dimezzamenti, con il link a matematica: al terzo anno gli studenti lo hanno già visto? Lo lasci o togli anche il nome? "Cresce come $n^2$" e "cresce come $\log_2 n$", o "quadratico" e "logaritmico"?
- [ ] **-1 come "non trovato" (71, 74).** Va bene nei due linguaggi, anche in Python dove qualcuno usa `None`? O una variabile `trovato` accanto alla posizione?
- [ ] **Nomi veri di font (86).** Il generatore `inf-font` usa come valori di `font-family` nomi che sono marchi (Georgia, Calibri, Menlo e altri), perché inventarli non insegnerebbe a leggerne uno vero. Si tengono?
- [ ] **CSS prima del CSS (86, 90).** La 86 usa un foglio di stile pronto prima della lezione 92, e la 90 un `style.css` di due regole per i bordi delle tabelle "da usare senza leggerlo": va bene come anticipo, o la 86 va spostata dopo la 92?
- [ ] **`defer` nella `head` (96-98).** È l'unica forma usata per collegare lo script; molti libri del liceo mettono il tag in fondo al `body`. Quale delle due vuoi nelle lezioni? `const` e `let` insieme dalla prima riga, o solo `let`?
- [ ] **Indice o elemento nei cicli di Python (70, 72, 73).** Le lezioni usano sempre `for i in range(len(voti))`, uguale al C++, e `for voto in voti` sta in un riquadro: va bene, o in Python la forma principale è l'altra?

Le funzioni:
- [ ] **65.** Il primo esempio è una funzione di una riga (`linea`): preferisci un corpo di più righe fin dall'inizio? I prototipi del C++ solo in un riquadro, o usati almeno in un esempio? Va introdotta la parola "procedura" per le funzioni che non restituiscono niente?
- [ ] **66.** Prima una funzione che stampa (`scheda`) e poi quella con `return` (`punti`), o subito `return`? In classe dici anche "la funzione ritorna 14"? Più `return` in una funzione vanno bene da subito? Serve una convenzione per i nomi delle funzioni che rispondono vero o falso, e un esempio con una funzione `double`?
- [ ] **67.** `global` solo in un riquadro, o con un esempio da eseguire (un contatore di chiamate)? "Visibilità" o "ambito"? Le costanti globali in maiuscolo e `const` si introducono qui?
- [ ] **68.** Va bene che la lista e l'array compaiano qui, in un programma di sei righe, prima della lezione sui vettori?
- [ ] **69.** La pagella con le insufficienze o un gioco a turni? "Funzione vuota" o "stub", e in Python con `pass` o con un `return` provvisorio? Presenti anche il bottom-up? L'albero della scomposizione lo disegni con i riquadri?

Vettori, matrici e stringhe:
- [ ] **70.** "Dimensione" o "lunghezza" del vettore?
- [ ] **71.** La ricerca che si ferma la scrivi con il `while` a due condizioni, con una bandierina nella condizione, o con `break` (che nella 70 e nella 71 non compare)? "Ricerca sequenziale" o "ricerca lineare"? Il caso medio, con (n + 1) : 2, resta? In Python va detto che esistono `in` e `index`?
- [ ] **72.** In classe la matrice si passa a una funzione, e serve un paragrafo su `int m[][C]`? In Python `R = len(voti)` e `C = len(voti[0])` in due variabili, o `len` dentro i `range`? "Diagonale secondaria" o "antidiagonale"? Trasposta e massimo di una matrice vanno aggiunti?
- [ ] **73.** In C++ solo `string`, o fai vedere anche gli array di `char`? I codici dei caratteri (`ord`, `chr`, `toupper`) e il cifrario di Cesare meritano un paragrafo? Per la palindroma i due indici come versione principale, o "rovescia e confronta"?

Ricerca e ordinamento:
- [ ] **74.** In C++ va bene `int centro;` dichiarata prima del ciclo (dentro, la riga non sta in un esercizio sul telefono)? Serve un esempio di ricerca binaria tra nomi in ordine alfabetico?
- [ ] **75.** Il nome `imin` va bene, e per l'ordine decrescente `imax`? La formula $\frac{n(n-1)}{2}$ sta già qui o solo nella 78? Lo scambio di Python in una riga è in un riquadro: lo accetti nelle risposte degli studenti (il correttore lo accetta)?
- [ ] **76.** Le bolle portano il più grande in fondo, come qui, o il più piccolo in cima? La bandierina con un `while` a due condizioni va bene, e si chiama "bandierina" o "flag"? Il ciclo interno accorciato (`n - 1 - i`) va bene come versione di base?
- [ ] **77.** Come chiami l'elemento tenuto da parte: `x`, `temp`, `chiave`? Inserimento per spostamenti, come qui, o prima la versione con gli scambi tra vicini? La regola per cui la seconda condizione di un `and` non viene controllata se la prima è falsa va detta qui o nella lezione 58, che non la dice?
- [ ] **75, 76, 77.** La tabella di traccia va prima del programma (76) o dopo (75)? È da scegliere un ordine per le tre lezioni.

I file:
- [ ] **79.** Per il file che non c'è, in Python va bene `try` ed `except FileNotFoundError`, due anni prima delle eccezioni, o preferisci `os.path.exists`? In C++ i numeri si leggono con `getline` e `stoi`, o con `file >> voto` come forma principale? `file.close()` va scritto sempre? "Segnaposto", "cursore" o "puntatore" per il punto a cui è arrivata la lettura? Servono `read()` e `readlines()`?
- [ ] **80.** In C++ un `getline` con il separatore per ogni campo, o la riga intera e `stringstream`? Il separatore dei file della lezione è la virgola: lo vuoi al contrario, visto che i file esportati a scuola hanno quasi sempre il punto e virgola? I campi contati da 0 anche a parole ("il campo 0")? Il modulo `csv` solo nominato?
- [ ] **81.** Un solo programma, in Python con `json`, e il dizionario detto in una riga: basta, o in classe leggi anche XML con un programma? Gli esercizi fanno correggere un file XML e completare un file JSON con il programma già scritto: sono adatti? Per XML bastano le regole del ben formato, senza schemi? La fattura elettronica come esempio italiano?

Immagini, suoni e video:
- [ ] **82.** La firma dei file (i primi byte) è fuori dai programmi del liceo: resta? Contenitore e codec stanno qui, nella 85 o in tutte e due? DOCX va tra i formati aperti, tra i proprietari, o resta fuori? GIF come "senza perdita, ma con 256 colori" va bene?
- [ ] **83.** I libri in uso fanno i conti della stampa in pollici o in centimetri? Serve distinguere dpi e ppi? Va bene una pagina fatta del solo `svg` prima delle lezioni di HTML? Le operazioni di base bastano in una tabella, o la voce `editing-base` dell'albero vuole una lezione sua?
- [ ] **84.** Il rapporto di compressione è originale diviso compresso, o i libri lo definiscono al contrario? RLE si scrive `6B` o `B6`? Per dizionario e codici di lunghezza diversa basta l'idea, o vuoi Huffman per intero?
- [ ] **85.** "Bitrate" o "flusso di bit", come in una riga della lezione 12? Serve nominare i fotogrammi I, P e B? Vuoi dell'audio vero da ascoltare a bitrate diversi (oggi non c'è)?
- [ ] **86.** "Famiglia di caratteri" e "font", o "tipo di carattere" come nei menu dei programmi? "Con le grazie" e "senza grazie", o "graziati" e "bastoni"? Sei regole di leggibilità in elenco sono troppe?

HTML:
- [ ] **87.** "Marcatore" in generale e "tag" per l'HTML: vanno bene tutte e due? `em` e `strong` anticipati qui, prima della 89? L'albero con `body` come radice anticipa troppo la 88? Markdown come secondo esempio, o i tuoi libri usano LaTeX?
- [ ] **88.** Va bene insegnare "un solo `h1` per pagina" come regola, anche se lo standard non la impone? `section` e `div` già qui, o solo dal CSS? "Testa" e "corpo" accanto a `head` e `body`: come dicono i libri in adozione? Serve un esempio di messaggio del validatore?
- [ ] **89.** `width` e `height` restano attributi HTML dell'immagine (il brief vieta gli attributi di presentazione, ma riservano lo spazio), o vanno al CSS? `b` e `i` vanno almeno nominati? Serve `target="_blank"`? Il percorso che comincia con `/` resta in un riquadro?
- [ ] **90.** `<thead>` e `<tbody>` vanno già qui? `<th>` di riga e `scope`: qui o nella 95? L'elenco di definizioni (`<dl>`) è nel programma? "Conto dei posti" va bene come nome del controllo su una riga con celle unite? Tre esercizi sono troppi?
- [ ] **91.** `<fieldset>` e `<legend>` per i pallini: qui, nella 95, o da nessuna parte? "Pallino" e "casella", o "pulsante di opzione" e "casella di controllo"? GET e POST in poche righe, o la richiesta intera con le intestazioni? `pattern` è nel programma del terzo anno?

I fogli di stile:
- [ ] **92.** La specificità come tre conti in ordine (id, classi, nomi di elemento), o con i punteggi 100, 10, 1 dei libri? `li.prossimo` e `a:hover` vanno in questa lezione (ora non ci sono, e `a:hover` è quello che gli studenti chiedono per primo)? Serve nominare `<style>` e l'attributo `style`, almeno per riconoscerli? `class` e `id` vanno anticipati nel capitolo sull'HTML? Serve `rgb()` oltre ai nomi e all'esadecimale?
- [ ] **93.** `box-sizing: border-box` come scelta normale ("mettilo sempre") o come alternativa? I margini che si fondono: basta il riquadro? `display: inline-block` va tenuto, visto che il menu della 94 si fa con flexbox? `span` introdotto qui, o nella 88 accanto a `div`? Servono tre e quattro valori per `padding` e `margin`?
- [ ] **94.** `flex: 1` come una sola dichiarazione ("prende lo spazio che avanza"), senza `flex-grow`, `flex-shrink`, `flex-basis`: va bene, sapendo che il conto della lezione vale solo nei due casi mostrati? `space-evenly`, `align-content` e la griglia restano fuori? "Asse trasversale" o "asse secondario"?
- [ ] **95.** Responsive e accessibilità in una lezione sola, con l'accessibilità ridotta al contrasto più quattro controlli: basta, o due lezioni? `em` spiegato solo per le proprietà diverse da `font-size`: si tiene così o si toglie? Si nominano le WCAG e la legge italiana sull'accessibilità, o resta "linee guida internazionali"? "Lettore di schermo" o "screen reader"?

Pagine web interattive:
- [ ] **96.** Il programma con `prompt()` va bene come ponte dai programmi alla pagina? I vettori di JavaScript in una frase sola sono troppo o troppo poco?
- [ ] **97.** Gli ascoltatori sono sempre funzioni con un nome: vuoi anche la funzione scritta dentro `addEventListener`, che è la forma più comune nei siti veri? "Ascoltatore" o "gestore dell'evento"? Va bene lasciare fuori `innerHTML` e la propagazione degli eventi?
- [ ] **98.** Il controllo dell'email si ferma alla chiocciola: è abbastanza? `Number.isInteger()` si tiene, o si accetta che `2.5` passi? Campi senza `required` per far lavorare lo script, o tutti e due i controlli con `novalidate`? "Validazione" compare una volta e poi si dice "controllo": va bene?

Dalla revisione del lotto (7 ottobre 2026):
- [ ] **I Fuori Tempo (86-98).** Lezioni e generatori ora hanno quattro componenti: Sara alla voce, Leo alla batteria, Marta alla chitarra, Dario al basso, come nelle lezioni 88-90. Va bene, o preferisci i cinque che c'erano nelle 92-95 (con Pietro ed Emma)?
- [ ] **Il "prossimo concerto" (88-95).** Nelle 92-95 è venerdì 12 dicembre in palestra, nelle 88-91 è venerdì 5 giugno in aula magna. I giorni tornano tutti con l'anno scolastico 2025-26, quindi sono concerti diversi. Va bene così, o il sito deve avere un solo "prossimo concerto"? Le date con il giorno della settimana invecchiano.
- [ ] **96, 98.** Il concerto con i biglietti a 8 euro è stato chiamato "di beneficenza", perché quello di fine anno è gratuito. Va bene, o togliamo il prezzo?
- [ ] **90, esercizio 2.** Le celle scritte senza `<tr>` passano, e nessun controllo sull'albero le distingue dalla soluzione, perché il browser ripara la tabella da sé. Si accetta, o serve un controllo sul sorgente dello studente (che oggi non esiste)?
- [ ] **75, 76, 77.** Ora la tabella di traccia sta dopo il programma in tutte e tre, come chiede il brief. Il gruppo 6 l'aveva messa subito dopo la figura: preferisci quell'ordine, da portare allora anche nella 75?
- [ ] **76.** È a 408 righe: si accetta, o si toglie qualcosa (per esempio la funzione `stampa` dal primo programma)?
- [ ] **85.** "Codifica" per MP3, AAC e H.264 e "codec" per il programma, come nella 82: va bene, o in classe si dice "codec" per tutte e due le cose?
- [ ] **81.** "Dati strutturati" è definito come dati ad albero, ma anche una tabella è un dato strutturato. Si lascia?
- [ ] **89.** Perché il disco si deformi come una fotografia, l'SVG ha `preserveAspectRatio='none'`: è un trucco. Va bene, o si aspetta che l'editor abbia le immagini vere?
- [ ] **88.** La figura `inf-html-albero-documento` da telefono è alta 1160 px: si accetta, o si ridisegna con due linguette "albero" e "pagina"?

Le domande dei generatori:
- [ ] Le risposte aperte si correggono su quello che il programma scrive e sul costrutto chiesto (`funzione`, `vettore`, `ciclo`): una ricerca sequenziale dentro `cerca` o `v.sort()` dentro `ordina` passano. È accettabile, o in quei livelli va vietato qualcosa?
- [ ] Nel livello 6 della 73 la consegna dice "Usa un ciclo" e `parola[::-1]`, `parola.count()` e `parola.replace()` vengono bocciati anche se scrivono il risultato giusto: è quello che vuoi?
- [ ] Non c'è un livello sulla palindroma (73, risponde solo sì o no) né uno sulla scelta del formato tra CSV, XML e JSON (81, "sarebbero opinioni"): vanno aggiunti in un'altra forma?
- [ ] Nei generatori i nomi sono accorciati perché le opzioni stiano in 34 caratteri (`conta`, `cerca`, `v`, file `num.txt`): si leggono ancora come quelli della lezione?
- [ ] I nomi dei 183 livelli (in `src/lib/exercises/level-names.ts`) sono dei gruppi: da rileggere, come quelli degli altri lotti.

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Standard di qualità]]
