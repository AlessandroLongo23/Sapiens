---
stato: in uso
release: beta
aggiornato: 2026-09-29
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

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Standard di qualità]]
