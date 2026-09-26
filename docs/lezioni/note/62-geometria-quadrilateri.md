# Note: Parallelogrammi e trapezi

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`62-verifica.py` nello scratchpad del lotto): la somma degli angoli, i cinque esempi, l'equazione dell'esempio 5, le carte con un conto. Per gli esempi 3 e 4 ho controllato anche la figura vera con le coordinate: un rettangolo con $AC = 10$ e $\widehat{AMB} = 120^\circ$ ha davvero $\widehat{MAB} = 30^\circ$ e $AD = 5$; un rombo con $\hat{A} = 50^\circ$ ha $\hat{B} = 130^\circ$ e le diagonali perpendicolari. Ho controllato anche che le figure siano quello che dicono (il parallelogramma ha i lati opposti paralleli, il trapezio isoscele ha i lati obliqui uguali, $AECD$ è un parallelogramma, il punto di incontro delle diagonali del trapezio isoscele è più vicino alla base minore).

## Scelte di convenzione

- Trapezio con definizione esclusiva: "quadrilatero con due soli lati opposti paralleli", quindi un parallelogramma non è un trapezio. Mi pare la definizione più diffusa nei libri italiani, ma non l'ho verificata su un libro in uso: da verificare. Un riquadro `ad-note` dice che alcuni libri usano "almeno due lati paralleli". La scelta semplifica due cose: lo schema delle inclusioni (trapezi e parallelogrammi sono famiglie separate) e le proprietà del trapezio isoscele, che con la definizione inclusiva non valgono per i parallelogrammi con i lati obliqui congruenti. Se si sceglie l'altra definizione, cambiano la definizione, il riquadro, lo schema, due avvisi e due carte (`trapezio-definizione`, `parallelogramma-due-lati-paralleli-vf`).
- Trapezio scaleno: "lati obliqui non congruenti". La lezione dice che il trapezio rettangolo ha anche lui i lati obliqui diversi, ma di solito si chiama rettangolo. Alcuni libri contano il rettangolo tra gli scaleni, altri no: da verificare.
- Rettangolo definito come "quadrilatero con i quattro angoli retti", rombo come "quadrilatero con i quattro lati congruenti", quadrato con entrambe le cose; che siano parallelogrammi viene dalle condizioni sufficienti 1 e 2. Alcuni libri li definiscono come parallelogrammi particolari ("parallelogramma con un angolo retto"): il contenuto non cambia.
- Misure di lunghezza scritte $AB = 8$ cm, senza il soprassegno $\overline{AB}$ che usano alcuni libri; congruenza con $\cong$. Angoli $\hat{A}$ per l'angolo al vertice, $\widehat{BAC}$ per gli altri.
- Criteri di congruenza chiamati "primo, secondo, terzo criterio", con tra parentesi cosa chiedono. Da allineare con la lezione 59 quando è scritta (se usa LAL, ALA, LLL o altri nomi).
- Nomi delle coppie di angoli: alterni interni, corrispondenti, coniugati interni. Da allineare con la lezione 60.
- Tutti i quadrilateri sono convessi (detto una volta, nella prima sezione). I quadrilateri concavi non compaiono.
- I 15 grassetti che il controllo segnala sono tutti termini definiti (quadrilatero, lati consecutivi e opposti, diagonale, le famiglie, basi, lati obliqui, altezza, i tre tipi di trapezio).

## Dimostrazioni

Quattro dimostrazioni svolte per intero con ipotesi, tesi e passi numerati: le proprietà 1-3 del parallelogramma (secondo criterio), la condizione "diagonali che si tagliano a metà" (primo criterio), l'esempio 2 ($AMCN$ è un parallelogramma, con la condizione 4) e gli angoli alla base del trapezio isoscele (con la parallela ad $AD$ da $C$). Quattro dimostrazioni brevi in prosa: diagonali del parallelogramma che si tagliano a metà, diagonali congruenti del rettangolo, diagonali perpendicolari e bisettrici del rombo (terzo criterio), diagonali congruenti del trapezio isoscele. Le altre condizioni sufficienti (1, 2, 4) e i viceversa di rettangolo e rombo sono solo enunciati.

La dimostrazione del trapezio isoscele usa gli angoli alla base del triangolo isoscele (lezione 59) e non il criterio dei triangoli rettangoli (ipotenusa e cateto), che la 59 non tratta.

## Lasciato ad altre lezioni

- Criteri di congruenza e triangolo isoscele: link a Triangoli e criteri di congruenza.
- Angoli formati da parallele e trasversale, criterio di parallelismo, somma degli angoli del triangolo: link a Rette perpendicolari e parallele.
- Equazione dell'esempio 5: link a Equazioni di primo grado intere.
- Aree e perimetri (a parte un perimetro nell'esempio 1), teorema di Talete, piccolo teorema di Talete e segmento dei punti medi del trapezio, aquilone e deltoide come famiglia: fuori. L'aquilone è citato due volte come controesempio, senza definirlo.

## Da togliere o controllare in lezioni già scritte

Nessuna lezione pubblicata parla di quadrilateri. Alla lezione 60 conviene chiedere che enunci anche il verso "rette parallele ⇒ angoli alterni interni congruenti" (non solo il criterio di parallelismo), perché questa lezione lo usa in tutte le dimostrazioni del parallelogramma, e che la somma degli angoli di un poligono (cenno) sia coerente con i $360^\circ$ del quadrilatero.

## Figure

Diciotto figure TikZ, tutte generate da uno script Python (`62-figs.py` nello scratchpad) che calcola archetti, trattini e angoli retti dalle coordinate, così che i segni stiano davvero sui lati e sugli angoli giusti. Nessuna libreria TikZ, niente `\clip`, niente riempimenti bianchi; i riempimenti sono `blue!8`, `blue!10`, `blue!12` e `orange!15`. Compilate tutte con `compileFigure`: la più larga è lo schema delle inclusioni, 270 px (le altre tra 149 e 253 px); guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`), dove i riempimenti diventano blu e marrone molto scuri e le linee restano leggibili. Non le ho viste sul sito.

Il formulario copia soltanto lo schema delle inclusioni.

## Formulario e flashcard

- Il formulario ha tre avvisi (diagonali perpendicolari, quadrato come rettangolo, diagonali del trapezio isoscele) e la tabella delle diagonali della lezione.
- 20 carte, tutte con contenuti della lezione; i conti sono quelli degli esempi (angoli di $70^\circ$, $50^\circ$, $60^\circ$).

## Prerequisiti

La riga `geometria-quadrilateri <- geometria-perpendicolari-parallele` va bene come arco diretto, ma la lezione usa i criteri di congruenza e il triangolo isoscele in ogni dimostrazione, e questi arrivano già attraverso `geometria-perpendicolari-parallele <- angoli-e-lati-dei-triangoli`: aggiungere `angoli-e-lati-dei-triangoli` sarebbe un arco ridondante, che lo script segnala. La lascerei così. L'esempio 5 risolve un'equazione di primo grado da una riga, come per Dominio, codominio e immagine: non serve l'arco verso `equazioni-primo-grado`.

## Per il generatore

1. Angoli di un parallelogramma: dato un angolo, trovare un altro angolo (opposto o consecutivo). Risposta numerica. Distrattori: l'angolo consecutivo preso uguale, il complementare invece del supplementare.
2. Lati e diagonali: perimetro dati due lati consecutivi; metà di una diagonale; diagonali del rettangolo ($BD$ dato $AC$, $BM$ dato $AC$). Risposta numerica.
3. Riconoscere una figura dalle proprietà (lati, angoli, diagonali): a scelta multipla tra parallelogramma, rettangolo, rombo, quadrato, trapezio. Distrattori dagli avvisi: diagonali perpendicolari senza che si taglino a metà, due soli lati paralleli.
4. Vero o falso sulle inclusioni e sulle proprietà ("ogni rombo è un rettangolo", "le diagonali del trapezio isoscele si tagliano a metà").
5. Angoli con le diagonali: rombo (bisettrici e angolo retto in $M$) e rettangolo (triangolo isoscele $AMB$, come nell'esempio 3). Risposta numerica.
6. Trapezi: angoli di un trapezio isoscele o rettangolo dato un angolo, poi con un'equazione come l'esempio 5 ($\hat{A} = x + a$, $\hat{D} = bx$). Numeri costruiti dalla risposta, con $x$ intero e angoli tra $30^\circ$ e $150^\circ$.
