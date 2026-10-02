---
stato: in sviluppo
release: da decidere
aggiornato: 2026-10-02
tag: [prodotto, studenti, strumenti, matematica, lezioni, seo]
---
# Grafico di funzioni

Un piano cartesiano dove lo studente scrive una funzione e la vede disegnata, con i punti notevoli. È uno strumento sotto `/strumenti` e insieme il piano cartesiano di tutto il sito: lo stesso componente si monta nelle lezioni con le funzioni già scritte.

## Stato attuale
Dal 1° ottobre 2026 c'è un prototipo sul branch `grafico-funzioni`, non committato e non pubblicato, alla rotta di prova `/prova-grafico` (fuori dall'indice, da togliere). Fa il primo passo: funzioni $y = f(x)$, parametri con i cursori, punti notevoli.

- `src/lib/grafico/formula.ts`: dal MathJSON al tipo di espressione e a una funzione numerica. Riconosce tutti e quattro i tipi (funzione, equazione implicita, disequazione, curva parametrica) e per ora disegna solo le funzioni; per gli altri la riga dice che arrivano. Conosce seno, coseno, tangente e le inverse, logaritmi (`log` è in base 10), esponenziale, radici (quella dispari di un numero negativo è negativa), valore assoluto, parte intera, i nomi italiani (`sen`, `tg`, `arctg`) e la virgola decimale. Dal 1° ottobre, dopo la prima prova di Alessandro, legge anche le somme e i prodotti su un indice ($\sum_{n=1}^{a}$, con l'estremo che può essere un parametro; al massimo 2000 termini; con $\infty$ in cima la somma si ferma a 2000 termini, o prima se i termini non cambiano più il totale, e la riga lo dice), il fattoriale, le funzioni con un nome (una riga `f(x) = …` vale per le altre: `f(x) + 1`, `f(2x)`) e le derivate di quelle funzioni (`f'`, `f'(x)`, `f''(x)`, `d/dx`), calcolate con le regole di derivazione e non con le differenze. Una funzione si può definire in qualunque lettera (`f(t) = t + 2` è la stessa funzione di `f(x) = x + 2`), purché a destra non ci sia anche la $x$. Una funzione scritta senza nome lo riceve quando si finisce di scriverla (Invio, o uscendo dal campo): la prima lettera libera nell'ordine f, g, h, p, q, r, s, u, v, w, saltando quelle già usate come nome o come parametro. Non ricevono un nome le righe con `y = …`, le equazioni, le disequazioni e una derivata scritta da sola (`f'`).
- `src/lib/grafico/curva.ts`: il campionamento. La linea si spezza sugli asintoti e sui salti, arriva esattamente al bordo del dominio e si infittisce dove curva; resta entro un terzo di pixel dalla curva.
- `src/lib/grafico/notevoli.ts`: zeri (anche quelli di tangenza), intersezione con l'asse $y$, massimi e minimi, intersezioni tra le curve. Più di 24 punti dello stesso tipo non si mostrano.
- `src/components/grafico/Plane.tsx`: il piano in SVG con lo stile del TikZ. Si trascina, si ingrandisce con la rotella, con due dita, con i bottoni e da tastiera; senza `onCamera` la finestra è fissa, per le lezioni. Nel tema scuro si inverte come le figure delle lezioni.
- `src/components/grafico/Plotter.tsx`: lo strumento, con l'elenco delle formule, i cursori dei parametri e il piano. Sul telefono, con la tastiera di Sapiens aperta, il piano resta in alto e la riga che si sta scrivendo sta tra il piano e la tastiera.
- `src/components/math/mathlive.ts` e `MathField.tsx`: il caricamento di MathLive e le tastiere, ora condivisi con la risposta aperta (`OpenAnswer.tsx` li importa da lì), e un campo generico che riferisce quello che si scrive mentre cambia. La tastiera del plotter ha un secondo strato con le funzioni.
- `src/components/grafico/Plotter.tsx` avvisa anche quando una funzione non ha valori nella finestra (per esempio una somma con un termine $1/0$).
- I test del motore: le regole di derivazione sono confrontate con la pendenza numerica su 19 funzioni.

Il primo lotto di impostazioni e comodità è fatto il 1° ottobre 2026, sullo stesso branch e alla stessa rotta di prova. Lo strumento è ora una cornice sola: una barra in alto (elenco che si chiude, annulla e ripeti, esempi, link, immagine, impostazioni, schermo intero), il pannello delle funzioni e dei parametri a sinistra, il piano a destra; sul telefono il piano sta sopra e il pannello sotto.
- Aspetto di una curva (`PlotterParts.tsx`, `RowStyle`): otto colori, tre spessori, tratto continuo, a tratti o a punti, la lettera della funzione scritta accanto alla curva, duplica ed elimina.
- Cursori (`ParamSlider`): minimo, massimo e passo; animazione lenta, normale o veloce, avanti e indietro, in ciclo o una volta. Un cursore che si muove non lascia passi da annullare.
- Impostazioni del piano (`PlaneSettingsPanel`): griglia, assi e numeri; radianti o gradi; asse x in numeri o in multipli di π; finestra scritta a numeri; ritorno alla stessa scala sui due assi. La finestra a numeri ha portato con sé la scala diversa sui due assi, che era nel secondo lotto: la telecamera ha un rapporto tra le due scale (`stretch`). I gradi sono un modo di leggere l'asse x, non un'altra scala (Alessandro, 1° ottobre 2026): 90° sta dove sta π/2, quindi passando da radianti a gradi il disegno del seno non cambia, cambiano solo i numeri sull'asse, e "stessa scala" vuol dire che 90° è lungo quanto π/2 sull'asse y. La x della formula è quella scritta sull'asse.
- Lettura: un punto segue il mouse lungo la curva con le coordinate; un clic sulla curva o su un punto notevole lascia l'etichetta, un altro clic la toglie.
- Annulla e ripeti (`useHistory.ts`): i cambi alla stessa riga o allo stesso cursore fatti in poco più di un secondo sono un passo solo. Dentro un campo Ctrl+Z resta del campo.
- Link al grafico (`documento.ts`): tutto il grafico sta nell'indirizzo dopo `#g=`, e un link rotto non apre niente.
- Immagine (`export.ts`): PNG a doppia risoluzione o SVG, a colori su fondo bianco. Le scritte nel file usano il carattere di ripiego, perché i font della pagina non entrano in un'immagine.
- Nove esempi pronti dal programma della scuola (parabola, retta e parabola, seno e coseno, sinusoide, esponenziale e logaritmo, omografica, cubica e derivata, valore assoluto, polinomi di Taylor).
- Schermo intero: quello del browser dove esiste, che niente del sito può coprire; dove non esiste (iPhone) lo strumento è fissato sopra la pagina. La tastiera di Sapiens si sposta dentro lo strumento per quel tempo.
- I pannelli che compaiono (impostazioni di un cursore, aspetto di una curva, elenco delle funzioni, pannelli della barra) si aprono e si chiudono con un'animazione (richiesta di Alessandro, 1° ottobre 2026).
- La tastiera di Sapiens si apre dal suo bottone anche da computer: prima compariva solo sugli schermi touch.
- `tests/unit/grafico.test.mjs`: 39 test.

Provato con Playwright su Chromium (1440 px e profilo iPhone 13): esempi, animazione, stile, annulla e ripeti, gradi, finestra, etichette, link aperto in un'altra pagina, i due download, schermo intero. Non provato: Safari, un telefono vero, lo zoom con due dita.

Il 2 ottobre 2026 si sono aggiunte le curve che non sono funzioni di $x$ ([[2026-10-02 Il plotter ha le curve implicite, parametriche e polari prima di uscire]]):
- Equazioni implicite (`curva.ts`, `sampleImplicit`): la funzione $F(x, y)$ si legge su una griglia di celle da 4 pixel e la curva passa dove cambia segno (marching squares); ogni attraversamento è rifinito per bisezione. Un cambio di segno dove $F$ non va a zero (i due lati di $1/x$) non è la curva e si scarta. Limite noto: una curva che tocca lo zero senza attraversarlo, come $(x^2 + y^2 - 1)^2 = 0$, non si trova. Una conica costa circa 7 ms (misura in Node).
- Curve parametriche (`sampleParametric`): $(x(t); y(t))$ con il punto e virgola o la virgola; l'intervallo di $t$ sta sulla riga, da 0 a $2\pi$ se non è scritto. Nei campi dei numeri si può scrivere $\pi$ (`2π`, `pi/2`).
- Curve polari: $r = f(\theta)$, anche con $\rho$ o $r(\theta)$; con $x$ e $y$ a destra, $r$ resta un parametro. L'intervallo di $\theta$ sta sulla riga e si converte passando da radianti a gradi.
- Griglia polare: cerchi intorno all'origine ai segni dell'asse, raggi ogni 15°, il nome dei raggi (in radianti o in gradi) dove escono dalla finestra. Con la griglia polare l'asse x misura il raggio, quindi non si legge in gradi.
- Le lettere greche si leggono: $\theta$ è l'angolo, le altre ($\alpha$, $\omega$, $\varphi$…) sono parametri.
- Cinque esempi nuovi: circonferenza ed ellisse, iperbole e asintoti, cicloide, spirale di Archimede, rosa e cardioide.
- Le disequazioni sono riconosciute e non disegnate. I punti notevoli, il punto che scorre e il nome sulla curva valgono solo per le funzioni.
- `tests/unit/grafico.test.mjs`: 51 test.

Sempre il 2 ottobre 2026 è fatto il secondo lotto, con le disequazioni:
- Disequazioni: `y > x²`, `x² + y² < 4`, catene come `1 ≤ x ≤ 3`, più condizioni unite. La regione è colorata a strisce orizzontali alte due pixel (`sampleRegion`), il bordo è la curva dove la condizione passa da vera a falsa, tratteggiato quando il bordo non fa parte della regione.
- Funzioni a tratti: il sistema con la graffa (`cases`, con "altrimenti") e il dominio tra graffe dopo la formula, `x² {0 < x < 2}`. Si possono nominare e derivare. Sulla tastiera di Sapiens ci sono i due tasti.
- Punti: `(2; 3)` o `A = (2; 3)`. Un punto con due numeri si trascina e riscrive la sua riga, fermandosi sulle righe della griglia; uno che dipende da un parametro (`P = (a; a²)`) si muove con il cursore.
- Retta tangente: dall'aspetto di una funzione; il punto di tangenza si trascina lungo la curva e l'etichetta dà la pendenza $m$, calcolata con le regole di derivazione.
- Area tra la curva e l'asse x: i due estremi si scrivono o si trascinano, e l'etichetta dà il valore dell'integrale (Simpson su 2000 intervalli).
- Tabella dei valori: sette righe, da un valore e con un passo scelti.
- Inquadra le curve: un bottone accanto allo zoom. Con sole funzioni tiene le x e adatta l'altezza, lasciando fuori i rami degli asintoti; con curve in $t$ o punti inquadra tutto alla stessa scala.
- Le righe si riordinano trascinando la maniglia, o con le frecce.
- Nomi degli assi nelle impostazioni, per esempio $t$ e $s$.
- Quattro esempi nuovi: funzione a tratti, sistema di disequazioni, tangente e area, triangolo di punti.
- `tests/unit/grafico.test.mjs`: 59 test.

Come sono fatti i punti conta per il passo dopo (vedi "Dopo: geometria analitica"): ogni punto è una riga con un nome, e il piano ha un livello di punti trascinabili separato dalle curve (`PlaneMark`).

Misure del 1° ottobre 2026: il Compute Engine ha un ingresso che legge solo il LaTeX (`@cortex-js/compute-engine/latex-syntax`), 414 kB, 112 kB compressi, e si carica nel browser solo dove si scrive. Le formule iniziali le legge il server, quindi le loro curve sono nell'HTML.

Provato con Playwright su Chromium, a 1360 px e con il profilo di un iPhone 13: nessun errore di pagina. Non provato: lo zoom con due dita, un telefono vero, Safari, la risposta aperta degli esercizi dopo lo spostamento del modulo di MathLive (il controllo dei tipi passa).

Il correttore delle risposte aperte (`src/lib/exercises/v2/grade/node.ts`) non si riusa: è fatto per il confronto esatto e non conosce seno e logaritmo. Il plotter ha il suo valutatore numerico, che parte dallo stesso MathJSON.

## Obiettivo
Lo strumento: un elenco di espressioni e un piano che si sposta e si ingrandisce, da telefono e da computer. Ogni espressione ha un colore. Le lettere diverse da $x$ e $y$ diventano cursori. Sul grafico si vedono zeri, intersezioni, massimi e minimi, con le coordinate.

Nelle lezioni (Alessandro, 1° ottobre 2026) il piano si usa in tre modi, a sostegno di esempi ed esercizi svolti:
1. Con le funzioni già inserite dal paragrafo. È il caso normale.
2. In poche occasioni, con una scelta tra opzioni: un controllo a segmenti dove ogni opzione è una stringa LaTeX.
3. In poche occasioni, con un campo libero per scrivere quello che si vuole.

## Dettagli
- Indirizzo: `/strumenti/grafico-di-funzione`, con una pagina sua come la tavola periodica (scelto da Alessandro il 1° ottobre 2026, dalle parole della ricerca "grafico di funzione online").
- Si pubblica quando la pagina è presentabile, con il primo lotto di impostazioni e comodità: vedi "Cosa hanno Desmos e GeoGebra" (Alessandro, 1° ottobre 2026). Le implicite e le parametriche vengono dopo.
- Disegno nostro in SVG sul kit, senza librerie di grafici: [[2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici]].
- Un solo componente per strumento, lezioni, fisica ed esercizi: [[2026-10-01 Il plotter delle funzioni è il primo uso del piano cartesiano del sito]].
- Punti notevoli numerici, niente studio di funzione: [[2026-10-01 Il plotter trova i punti notevoli, senza lo studio di funzione]].
- Quattro tipi di espressione: [[2026-10-01 Nel plotter si scrivono funzioni, equazioni implicite, disequazioni e curve parametriche]].
- A passi, pubblicando dopo il primo, per telefono e computer insieme: [[2026-10-01 Il plotter esce a passi e si progetta per telefono e computer insieme]].

I passi:
1. $y = f(x)$, parametri con i cursori, punti notevoli. Poi si pubblica.
2. Equazioni implicite e disequazioni, che usano lo stesso algoritmo.
3. Curve parametriche.

Il campionamento deve reggere gli asintoti ($\tan x$, $1/x$) e i buchi nel dominio ($\ln x$, $\sqrt{x}$): la curva si spezza, non si unisce attraverso l'asintoto.

## Cosa hanno Desmos e GeoGebra
Alessandro, 1° ottobre 2026: prima di pubblicare la pagina deve essere presentabile, e l'elenco di campi a sinistra con il piano a destra non lo è. Servono le impostazioni e le comodità che ha GeoGebra: animazione e impostazioni dei cursori, colore delle curve, e così via. L'elenco qui sotto viene dalla conoscenza che Claude ha dei due prodotti, non riverificata sui siti il 1° ottobre 2026: da controllare voce per voce prima di copiarne il comportamento. "Noi" è il prototipo di oggi. Il lotto è la proposta di Claude, da confermare.

| Funzione | Desmos | GeoGebra | Noi | Lotto proposto |
|---|---|---|---|---|
| **Espressioni** | | | | |
| Mostra e nascondi una curva | sì | sì | sì | |
| Colore della curva | sì | sì | sì | 1 |
| Spessore e tratto (continuo, tratteggiato, a punti) | sì | sì | sì | 1 |
| Nome della curva scritto sul grafico | no | sì | sì | 1 |
| Annulla e ripeti | sì | sì | sì | 1 |
| Duplica un'espressione | sì | sì | sì | 1 |
| Riordina trascinando | sì | sì | sì | fatto il 2 ottobre |
| Dominio ristretto e funzioni a tratti | sì | sì | sì | fatto il 2 ottobre |
| Tabella dei valori | sì | sì | sì | fatto il 2 ottobre |
| Cartelle e note di testo tra le espressioni | sì | in parte | no | dopo |
| **Cursori** | | | | |
| Cursore creato da una lettera | sì | sì | sì | |
| Minimo, massimo e passo | sì | sì | sì | 1 |
| Animazione: avvia e ferma, velocità, avanti e indietro o in ciclo | sì | sì | sì | 1 |
| Cursore sul piano | no | sì | no | dopo |
| **Piano** | | | | |
| Sposta, ingrandisci, torna alla vista iniziale | sì | sì | sì | |
| Griglia, assi e numeri che si accendono e si spengono | sì | sì | sì | 1 |
| Finestra scritta a numeri (x e y minimi e massimi) | sì | sì | sì | 1 |
| Asse x in multipli di π | sì | sì | sì | 1 |
| Radianti o gradi | sì | sì | sì | 1 |
| Schermo intero, elenco che si chiude | sì | sì | sì | 1 |
| Scala diversa sui due assi, e blocco 1:1 | sì | sì | sì | fatto con il lotto 1 |
| Inquadra tutte le curve | in parte | sì | sì | fatto il 2 ottobre |
| Nomi degli assi | sì | sì | sì | fatto il 2 ottobre |
| Griglia polare | sì | sì | sì | fatto il 2 ottobre |
| **Lettura del grafico** | | | | |
| Zeri, massimi, minimi, intersezioni | sì | sì | sì | |
| Punto che scorre sulla curva con le coordinate | sì | sì | sì | 1 |
| Etichetta di un punto che resta fissata | sì | sì | sì | 1 |
| Punti scritti come coordinate, e trascinabili | sì | sì | sì | fatto il 2 ottobre |
| **Analisi** | | | | |
| Derivata | sì | sì | sì | |
| Retta tangente in un punto | con una formula | sì | sì | fatto il 2 ottobre |
| Integrale definito con l'area colorata | sì | sì | sì | fatto il 2 ottobre |
| Asintoti e flessi | no | sì | no | con lo studio di funzione |
| Regressioni, liste, statistica | sì | sì | no | dopo |
| **Altri tipi** | | | | |
| Equazioni implicite | sì | sì | sì | fatto il 2 ottobre |
| Disequazioni | sì | sì | sì | fatto il 2 ottobre |
| Curve parametriche | sì | sì | sì | fatto il 2 ottobre |
| Curve polari | sì | sì | sì | fatto il 2 ottobre |
| **Condividere** | | | | |
| Link al grafico | sì | sì | sì | 1 |
| Immagine da scaricare (PNG, SVG) | sì | sì | sì | 1 |
| Salvare nel proprio account | sì | sì | no | dopo (lo Zaino) |
| Incorporare in un'altra pagina | sì | sì | no | dopo |
| **Scrittura** | | | | |
| Tastiera a schermo con le funzioni | sì | sì | sì | |
| Esempi pronti da aprire | sì | sì | sì | 1 |
| **Fuori dal plotter** | | | | |
| Costruzioni di geometria (punti, rette, circonferenze, strumenti) | sì | sì | no | un altro prodotto |
| Grafici in tre dimensioni | sì | sì | no | no |
| Lettura sonora del grafico | sì | no | no | dopo |

## Dopo: geometria analitica
Alessandro, 2 ottobre 2026: dopo il secondo lotto vuole gli strumenti di geometria analitica, come su GeoGebra. Non è ancora discusso cosa entra. Quello che c'è già e su cui si appoggerebbe: i punti con un nome, trascinabili; le rette e le coniche come equazioni; le intersezioni tra funzioni. Quello che manca: oggetti che dipendono da altri oggetti (la retta per $A$ e $B$ che si muove con loro, il punto medio, la perpendicolare, la circonferenza di centro e raggio dati), una barra di strumenti per crearli con i clic, le misure (distanza, pendenza, angolo, area di un poligono). Oggi una riga non può usare un punto di un'altra riga.

## Domande aperte
- Geometria analitica: quali strumenti nel primo giro, e se gli oggetti si creano solo con i clic o anche scrivendo (`retta(A, B)`).
- Pannello e bottone si chiamano ancora "Funzioni" e "Aggiungi una funzione", ma le righe sono anche punti, equazioni e regioni: da rinominare.
- In quale categoria dell'indice degli strumenti: oggi non c'è una categoria per le funzioni.
- Come si mostrano i punti notevoli quando il valore esatto è semplice ($\sqrt{2}$, $\pi/2$).
- Se le espressioni stanno nell'indirizzo, per condividere un grafico, e se si scarica l'immagine (PNG o SVG) come nel generatore di grafici a torta.
- Lo studio di funzione con i passaggi, come strumento suo: se e quando, con quale motore.
- Cosa sostituisce nelle lezioni: le figure del gruppo 2 di [[Grafici e simulazioni interattive]] e i grafici statici di fisica. In che ordine.
- Come si scrive nel markdown di una lezione un piano con le sue funzioni: un blocco con i parametri, senza un componente per figura, sarebbe più rapido delle figure di oggi. Da progettare.

- I messaggi mentre si scrive ("La formula non è finita") compaiono a ogni tasto: da decidere se mostrarli solo quando ci si ferma.
- Nomi delle funzioni sulla tastiera: oggi `sin`, `tan`, `arcsin`. Negli strumenti la convenzione è `sin`, `tg`, `cotg`: da allineare, e da chiedere ad Andrea con le altre convenzioni.
- Un buco eliminabile, come quello di $\frac{x^2-1}{x-1}$ in $x = 1$, oggi non si vede: da decidere se segnarlo con un pallino vuoto.

- Le serie lente sono pesanti: $\sum \frac{\sin(nx)}{n}$ fino a infinito chiede circa 230 ms per ridisegnare la curva (misura in Node del 1° ottobre 2026), quindi il trascinamento va a scatti. Da decidere se abbassare i 2000 termini o disegnare con meno termini mentre ci si sposta.

## Collegamenti
- Attori: [[Studente]]
- Release: non è nella [[Release Beta]]; le funzioni arrivano dal terzo anno.
- Note: [[Grafici e simulazioni interattive]], [[Calcolatori e convertitori]], [[Lezioni]], [[Esercizi]], [[SEO]]
