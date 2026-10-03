---
stato: rilasciata
release: da decidere
aggiornato: 2026-10-03
tag: [prodotto, studenti, strumenti, matematica, lezioni, seo]
---
# Grafico di funzioni

Un piano cartesiano dove lo studente scrive una funzione e la vede disegnata, con i punti notevoli. È uno strumento sotto `/strumenti` e insieme il piano cartesiano di tutto il sito: lo stesso componente si monta nelle lezioni con le funzioni già scritte.

## Stato attuale
Dal 3 ottobre 2026 lo strumento ha la sua pagina, `/strumenti/grafico-di-funzione`, in produzione su master (PR #27 del 3 ottobre 2026). La rotta di prova `/prova-grafico` non c'è più (resta `/prova-grafico/lezione`, la prova dei piani nelle lezioni, che in produzione risponde 404). La pagina (`src/app/(site)/strumenti/grafico-di-funzione/page.tsx`, `PlotterPage.tsx`) è statica: apre con $f(x) = x^2 - 2x - 1$ letta dal server, ha la voce nel registro degli strumenti (categoria "Algebra ed equazioni", scelta da Claude e da confermare), i collegamenti a tre lezioni, l'articolo `src/content/strumenti/grafico-di-funzione.md` su come si scrive una formula, e sotto l'articolo la guida dei 22 strumenti di geometria, ciascuno con il filmato, la descrizione, il comando scritto e i dati strutturati `VideoObject` (`ToolGuide.tsx`). Lo script dei filmati apre la pagina vera con un link `#g=`. I sette esempi di prova restano tra gli "Esempi" per scelta di Alessandro. Prima di andare in produzione: la prova su un telefono vero e su Safari e la risposta aperta degli esercizi, che fa Alessandro.

Sempre il 3 ottobre: il titolo e l'articolo allargati alle ricerche vicine (calcolatrice grafica, studio di funzione, geometria analitica), la carta nell'indice con il suo disegno, tutto quello che sta sotto il piano in una colonna sola con i filmati dentro la sezione "Geometria analitica" e divisi in cinque gruppi, un player dei filmati nostro (`src/components/ui/VideoClip.tsx`), il bottone "Prova" su ogni scheda (prende lo strumento in mano, riporta il piano in vista e, se allo strumento serve una retta o una curva che non c'è, la aggiunge) e "Svuota il piano" nella barra, con conferma, "Copia il link e svuota" e l'annulla.

Grafici salvati, dal 3 ottobre 2026 ([[2026-10-03 I grafici del plotter si salvano con nome e si mettono nelle note]]): la tabella `plots` (migrazione `20261003120000_plots.sql`, già applicata al database di produzione, con RLS per proprietario), le API `/api/grafici` e `/api/grafici/[id]`, le funzioni in `src/lib/server/grafici.ts` e il pannello "I miei grafici" nella barra (`SavedPlots.tsx`). Un grafico salvato è il codice che andrebbe in un link, riletto dal server prima di scriverlo. "Salva" scrive sopra il grafico caricato, "Salva con nome" ne crea uno nuovo e rifiuta un nome già usato; il bottone della barra mostra il nome del grafico sul piano e un pallino quando ci sono modifiche non salvate (lo spostamento della finestra non conta). Senza account il pannello apre l'accesso. "Svuota" offre "Salva e svuota" o "Salva con nome". Provato con Playwright e un utente di prova, poi cancellato: salvare, sovrascrivere, nome doppio, ricaricare dopo aver svuotato e dopo aver ricaricato la pagina, eliminare. Non fatto: il blocco nelle note, le miniature nell'elenco, rinominare.

Strumenti avanzati, dal 3 ottobre 2026, non committati (richiesti da Alessandro dall'elenco in [[Elenco dei comandi e completamento nel plotter]]):
- Limiti: $\lim_{x \to a}$, da destra e da sinistra, all'infinito, con un parametro o con la $x$ del piano dentro (la derivata dalla definizione). Il valore si trova per tentativi, con punti sempre più vicini, e si ferma dove l'arrotondamento prende il sopravvento. Una riga che è un numero (un limite, $2 + 3$) dice quanto vale sotto la formula.
- Asintoti: un'opzione nell'aspetto di una funzione. Verticali dove $1/f$ si annulla o dove il dominio finisce e la funzione cresce senza fine; orizzontali e obliqui da $\lim (f(2t) - f(t))/t$ e $\lim (2f(t) - f(2t))$. Disegnati tratteggiati e scritti sotto la riga, per la parte di asse in vista.
- Campo di direzioni: $y' = f(x; y)$ o $\frac{dy}{dx} = \dots$ disegna un trattino per ogni pendenza, e per ogni punto del piano la soluzione che ci passa (Runge-Kutta a quattro pendenze).
- Successioni: la tabella dei termini (dieci, da un indice a scelta) e il diagramma a ragnatela per una ricorrenza a un passo senza l'indice nella regola.
- Statistica: `media`, `mediana`, `varianza` (della popolazione), `devstandard`, `normale(x; μ; σ)`, `distbinomiale(k; n; p)`; la retta di regressione di un gruppo di punti, come strumento e come comando, con $r$.
- Trasformazioni: simmetria rispetto a una retta o a un punto, traslazione, rotazione, omotetia, come strumenti (gruppo nuovo nella barra) e come comandi, su punti, rette, segmenti, vettori, circonferenze, coniche e poligoni. Una conica che non è una circonferenza ora mostra la sua equazione.
- `tests/unit/analisi.test.mjs`, 11 test; 612 in tutto. Provati nel browser su Chromium con un grafico per ciascuno.
- I cinque strumenti nuovi hanno il filmato dal 3 ottobre 2026 (`retta-di-regressione`, `simmetria-assiale`, `traslazione`, `rotazione`, `omotetia`): tutti i 27 strumenti ne hanno uno.
- Limiti: un limite che oscilla o diverge piano può risultare "non esiste" a torto o a ragione senza distinguerli; il grafico di una funzione che non è una retta o una conica non si trasforma; non c'è una tabella di dati da incollare, i dati sono punti del piano; la varianza è quella della popolazione, non del campione.

Numeri a caso e successioni di punti, dal 3 ottobre 2026, non committati (richiesta di Alessandro per il triangolo di Sierpinski con il gioco del caos):
- `casuale` (anche `random`): senza niente è un numero tra 0 e 1; con un numero, tra 0 e quello; con due, tra l'uno e l'altro; con tre o più, o con una lista tra graffe, è uno di quelli. Una scelta tra due soli valori si scrive con le graffe, `casuale({4; 7})`, perché due numeri sono i due estremi.
- Un numero a caso resta lo stesso mentre il grafico si guarda: dipende dal posto nella successione (l'indice, e $t$ lungo una curva), non dal momento. "Estrai di nuovo", sotto la riga, li cambia tutti. `casuale()` da solo è un numero, come in GeoGebra, non una funzione di $x$.
- Successioni di punti: una regola per $P_{n+1}$ con il punto di partenza $P_0 = (1; 1)$ in un'altra riga. La regola può usare i punti per nome, i termini della successione, somme e differenze di punti, un punto per o diviso un numero, `puntomedio` e `casuale` tra punti. Sono due successioni di numeri, le coordinate, calcolate insieme; una scelta a caso vale per tutte e due. Si disegnano i primi 2000 punti, piccoli. $P_0$ e i vertici si trascinano e la figura li segue.
- Provato nel browser scrivendo la regola dalla tastiera: `P_{n+1} = puntomedio(P_n; casuale(A; B; C))` disegna 2000 punti e nessuno cade nel buco centrale del triangolo. 2 test in `tests/unit/analisi.test.mjs`; 614 in tutto.
- Limiti: 2000 punti sono il tetto; le successioni di punti non hanno tabella né si usano dentro altre formule ($x_{P_5}$ no); due chiamate scritte uguali in due righe estraggono gli stessi numeri.

Il prototipo è nato il 1° ottobre 2026. Fa il primo passo: funzioni $y = f(x)$, parametri con i cursori, punti notevoli.

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

Ancora il 2 ottobre 2026: le formule pronte, per quello che è difficile da scrivere con la tastiera.
- Sei formule con i buchi da riempire: funzione a tratti, sistema di disequazioni, somma, prodotto, integrale, derivata (`PLOT_TEMPLATES` in `src/components/math/mathlive.ts`). Ci si arriva in tre modi: una parola scritta nella formula (`tratti`, `sistema`, `somma`, `prod`, `int`, `derivata`, più `radice`), il menu con il simbolo Σ in testa al pannello, i tasti della tastiera di Sapiens. Due limiti di MathLive: una parola non può cominciare con un'altra più corta (per questo `int` e `prod`, non "integrale" e "prodotto"), e tra due buchi sopra e sotto un segno viene prima quello sopra (per questo l'estremo inferiore è già scritto, $n = 1$ e $0$).
- Dentro una graffa Invio aggiunge una riga alla graffa, e Backspace in una riga vuota la toglie. Fuori dalla graffa Invio aggiunge una riga al pannello, come prima. Per sapere dove sta il cursore si legge il modello interno di MathLive: se una versione nuova lo sposta, Invio torna a fare solo la riga del pannello.
- Un sistema in una sola graffa è la regione dove valgono tutte le sue disequazioni. Un sistema di equazioni non si disegna in una riga: il messaggio dice di scriverle su righe separate.
- L'integrale con i due estremi è una formula: $F(x) = \int_0^x f(t)\,dt$ è una funzione, con la pendenza data dal teorema fondamentale (anche con estremi che dipendono da $x$). Il valore è una quadratura di Gauss a quattro punti su otto pezzi per unità, tra 12 e 200, con i due pezzi agli estremi dimezzati dodici volte: $\int_0^4 1/\sqrt{t}\,dt$ dà 3,999. Senza estremi il messaggio dice che il plotter non cerca la primitiva. Limiti: un integrale che attraversa un asintoto dà un numero invece di niente ($\int_1^{-1} 1/t\,dt$), e il disegno costa (30 ms per 3000 valori di $\int_0^x e^{-t^2}dt$, misura in Node).
- Le funzioni possono avere un nome maiuscolo: $F(x) = …$ prima non era letta.
- La graffa di una funzione a tratti ora è alta quanto le sue righe: alla pagina di prova mancavano i font di KaTeX, con cui MathLive disegna. Li carica il campo (`MathField.tsx`).
- Funzioni di due lettere: $h(x; y) = x + y^2$ dà un nome che le altre righe usano ($h(x; y) < 10$, $h(x; y) = 4$ come curva di livello); la riga non ha una curva sua e lo dice. La prima riga che nomina una lettera la definisce, una riga dopo con la stessa lettera è un'equazione. Si deriva rispetto a qualunque lettera: $\frac{d}{dx}$, $\frac{\partial}{\partial y}$, $\frac{\partial h}{\partial x}$, derivate miste. Con i numeri le due coordinate si separano con il punto e virgola: $h(2, 3)$ si legge $h(2{,}3)$.
- Le coordinate di un punto con un nome si usano nelle formule: $x_P$ e $y_P$, come scrive la scuola; si leggono anche $x(P)$ e $y(P)$, come in GeoGebra, e `P.x`, come in Desmos (Alessandro, 2 ottobre 2026: aveva scritto la tangente con $x(P)$ e non era letta). Vale per i punti scritti e per quelli costruiti. La tangente in $P$ a $f$ è $y = f'(x_P)(x - x_P) + y_P$ e segue il punto. Una coordinata non è un parametro: non ha un cursore. Se il punto non c'è, il messaggio dice quale riga manca. $x_0$ resta un parametro.
- Il nome di una funzione da solo vale la funzione delle sue lettere: con $a(x; y)$ e $b(x; y)$ definite, $a \cdot b = 0$ disegna le due curve insieme e $ab > k$ la regione, con il cursore di $k$ (Alessandro, 2 ottobre 2026). Per una funzione di una lettera il nome solo è $f(x)$. Prima era un errore.
- Una riga di formula lasciata vuota sparisce quando il fuoco esce dalla riga (Alessandro, 2 ottobre 2026); resta se si preme uno dei suoi bottoni.
- Un pezzo di formula usato più volte si calcola una volta sola per punto: una funzione con un nome usata due volte è lo stesso pezzo, non due copie. Prima dieci passi di $z^2 + c$ scritti con funzioni di funzioni raddoppiavano il lavoro a ogni passo (5,6 secondi per otto passi, misura in Node); ora il costo cresce con il numero dei passi (0,26 secondi per otto, 0,4 per dodici).
- Il disegno è più veloce (2 ottobre 2026, misure in Node e con il profilo di Chromium sul server di sviluppo):
  - Il valutatore ha una strada sua per le operazioni comuni (somma di due o tre termini, sottrazione, prodotto per un numero, quadrato, cubo, seno, coseno, radice, un solo confronto) e calcola una volta i pezzi senza lettere. Un polinomio di quinto grado passa da 260 a 17 nanosecondi per valore; l'interferenza di due sorgenti da 389 a 64.
  - Il bordo e l'interno di una regione vengono da una sola lettura della griglia (`sampleRegionEdge`): l'interno è fatto delle celle, intere dove sono dentro e tagliate lungo il bordo. Prima erano due letture.
  - La griglia delle curve implicite salta le celle senza cambio di segno: una circonferenza passa da 9 a 3 millisecondi.
  - Una curva che non è cambiata non si ricalcola quando ne cambia un'altra (`sampling.ts`, con un'impronta per curva: formula, funzioni con un nome, valori delle lettere): trascinare un punto lascia stare le altre curve.
  - Una curva lenta che continua a cambiare (il piano trascinato, un cursore in moto) si disegna su una griglia larga il doppio, e torna fine dopo 180 millisecondi di quiete.
  - Risultato trascinando il piano: l'interferenza da 19 a 55 fotogrammi al secondo, il Mandelbrot da circa uno a 47, i grafici comuni restano tra 50 e 60.
    - La griglia delle curve implicite e delle regioni appartiene al piano, non alla finestra: trascinando il piano si leggono sempre gli stessi punti. Prima ogni passo del trascinamento leggeva la curva in punti diversi, e un contorno fine tremava: nell'esempio di Mandelbrot l'estremo sinistro saltava di 60 pixel da un fotogramma all'altro (Alessandro, 2 ottobre 2026: "la camera scuote violentemente da sinistra a destra").
  - Durante un trascinamento la camera del piano resta quella chiesta dal puntatore anche se il disegno è in ritardo: prima il piano perdeva strada (278 pixel su 300 in una prova).
    - Una regione finisce dove la sua condizione smette di avere un valore: lì il bordo si disegna e il riempimento arriva. Prima un punto del bordo poteva uscire senza coordinate (un valore infinito da un lato) e il browser fermava lì tutto il tracciato: nel Mandelbrot con 28 passi, dove fuori dall'insieme i termini vanno all'infinito, il riempimento si fermava a metà altezza e il contorno era a pezzi (Alessandro, 2 ottobre 2026). Vale solo per le regioni: una curva scritta come equazione non prende una linea lungo il bordo del dominio.
  - Non fatto: generare il codice della formula (la Content Security Policy di produzione vieta `eval`), calcolare in un worker, tenere le lettere in un vettore invece che in un oggetto, non ridisegnare il pannello a ogni passo del trascinamento.
- Successioni (Alessandro, 2 ottobre 2026: "aggiungiamo i pezzi mancanti, ma rendiamoli generici"). Si scrivono come a scuola:
  - il termine generale, $a_n = 2n + 1$;
  - la ricorrenza, $a_{n+1} = 2a_n + 1$ oppure $a_n = a_{n-1} + 2$, con il valore di partenza in un'altra riga, $a_0 = 3$;
  - a due passi, $F_{n+2} = F_{n+1} + F_n$ con $F_0$ e $F_1$;
  - accoppiate, due successioni che si leggono a vicenda.
  L'indice è una tra $n, k, i, j, m$. Un termine si usa in qualunque altra formula: $a_{10}$, $a_k$ con il cursore di $k$, $\sum_{k=1}^{4} a_k$, $y = x_6$. La regola può usare funzioni con un nome (il metodo di Newton, $x_{n+1} = x_n - f(x_n)/f'(x_n)$) e parametri (una progressione geometrica con la ragione $q$ sul cursore). Una successione si disegna a punti $(n; a_n)$ per gli interi nella finestra; se i termini dipendono da $x$ o $y$ non ha punti suoi e la riga lo dice. Senza una successione con quel nome $a_1$ resta una lettera con il suo cursore, e $A_1 = (2; 3)$ resta un punto. I termini di una ricorrenza si trovano salendo dai valori di partenza, tutte le successioni insieme, una volta sola per punto del piano; il limite è di 2000 termini. In `formula.ts`: `sequences`, i tipi di riga `sequence` e `given`. Nel menu Σ c'è "Successione per ricorrenza" (parola `successione`), e sulla tastiera di Sapiens i tasti $n$ e pedice.
  - Limiti: un termine dentro una funzione con un nome o un integrale legge la $x$ del piano, non quella della funzione; la tabella dei termini e il diagramma a ragnatela non ci sono; nelle lezioni (`LessonPlot.tsx`) una successione non si disegna ancora.
  - Esempi: "Successioni e limiti" e "Successione di Fibonacci" tra quelli veri; l'insieme di Mandelbrot di prova ora è cinque righe con il numero di passi sul cursore.
- Sette esempi di prova in fondo agli "Esempi" (`SHOWPIECES` in `documento.ts`), fatti per vedere fin dove arriva il plotter e da togliere prima di pubblicare (Alessandro, 2 ottobre 2026): metaball con tre punti da trascinare, interferenza di due sorgenti con la fase da far correre, insieme di Mandelbrot, ellisse iperbole e ovale di Cassini dagli stessi fuochi, linee di livello di un dipolo in una riga sola, cuore che batte, curva a farfalla. 
- Il nome di un parametro con il pedice si legge $r_1$ accanto al cursore, non `r_1`.
- Le parole del plotter, dal 2 ottobre 2026 ([[2026-10-02 Le parole del plotter stanno in un elenco solo, con i nomi italiani]]):
  - Un elenco solo, `src/lib/grafico/comandi.ts`, 69 parole in quattro gruppi: funzioni con la loro scrittura (da `sin` a `fattoriale`), lettere (π, le greche, infinito), scritture con i buchi (tratti, sistema, somma, prodotto, integrale, derivata, successione) e oggetti geometrici. Ogni parola ha titolo, modi di scriverla, una riga di descrizione e quello che inserisce.
  - Proposte mentre si scrive (`src/components/math/completion.tsx`): da due lettere in su compare sotto il cursore l'elenco delle parole che cominciano così, o che hanno una parola del titolo che comincia così ("val" trova il valore assoluto). Tab sceglie la prima, le frecce e Invio scelgono, Esc chiude, un tocco sceglie. Finché non si preme una freccia nessuna proposta è scelta, quindi Invio resta Invio. Su telefono l'elenco va sopra la riga quando sotto c'è la tastiera.
  - Una parola intera che non è l'inizio di un'altra diventa subito la sua formula (`sen`, `ln`, `tratti`, `retta`). Una che può continuare aspetta: `sin` può diventare `sinh`, `tan` può diventare `tangente`, `int` può diventare `integrale` o `intersezione`. Un nome di funzione si chiude al tasto dopo: `sinx` è $\sin x$, `sin(` è $\sin($. Lo spazio chiude la parola con i suoi buchi. Le parole lunghe italiane ora si scrivono: `integrale`, `prodotto`.
  - Le scorciatoie a parole di MathLive sono spente nei campi del plotter; restano quelle fatte di segni (`<=`). La risposta aperta degli esercizi non cambia.
  - I cursori dei parametri compaiono alla conferma (Invio o un clic altrove). Mentre si scrive la curva si disegna lo stesso, con le lettere nuove a 1, e un cursore non sparisce: cancellare e riscrivere una lettera non ne perde il valore. Le lettere di una parola non finita ("tra") non si disegnano.
  - Funzioni di più numeri, nuove: `max`, `min`, `resto(a; b)`, `mcd`, `mcm`, `binomiale(n; k)` (anche $\binom{n}{k}$), `arrotonda`. La lettera $\gamma$ ora si legge come lettera (il lettore la prendeva per la costante di Eulero).
  - Oggetti geometrici scritti: vedi [[Geometria analitica nel plotter]].
  - `tests/unit/comandi.test.mjs`, 11 test; 588 in tutto. Provato con Playwright su Chromium e WebKit a 1300 px e, con la tastiera di Sapiens, a 390 px con il tocco (lì un nome di funzione si chiude dopo che il segno è stato scritto, perché i tasti sullo schermo non si sentono prima). Non provato su un telefono vero.
  - Limiti: nell'elenco non ci sono i filmati degli strumenti; i comandi di analisi (`zeri(f)`, `estremi(f)`, `area(f; g; a; b)`) non ci sono; il limite non si scrive; una funzione di più numeri non accetta la virgola al posto del punto e virgola quando è scritta con il nome italiano.
- Un esempio nuovo, "Funzione integrale". `tests/unit/grafico.test.mjs`: 64 test. Provato con Playwright su Chromium e WebKit a 1440 px; la tastiera su telefono solo in uno screenshot a 390 px.

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
La proposta, con l'elenco degli strumenti di GeoGebra e Desmos e il modo d'uso di ciascuno, è in [[Geometria analitica nel plotter]].

Alessandro, 2 ottobre 2026: dopo il secondo lotto vuole gli strumenti di geometria analitica, come su GeoGebra. Non è ancora discusso cosa entra. Quello che c'è già e su cui si appoggerebbe: i punti con un nome, trascinabili; le rette e le coniche come equazioni; le intersezioni tra funzioni. Quello che manca: oggetti che dipendono da altri oggetti (la retta per $A$ e $B$ che si muove con loro, il punto medio, la perpendicolare, la circonferenza di centro e raggio dati), una barra di strumenti per crearli con i clic, le misure (distanza, pendenza, angolo, area di un poligono). Oggi una riga non può usare un punto di un'altra riga.

## Domande aperte
- Geometria analitica: quali strumenti nel primo giro, e se gli oggetti si creano solo con i clic o anche scrivendo (`retta(A, B)`). La proposta e le sue domande sono in [[Geometria analitica nel plotter]].
- Un sistema di equazioni in una graffa: oggi è un messaggio. Da decidere se disegnare le curve e segnare i punti in comune.
- In quale categoria dell'indice degli strumenti: oggi è in "Algebra ed equazioni", perché non c'è una categoria per le funzioni. Da confermare.
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
- Idee: [[Grafici salvati e libreria nel plotter]] (3 ottobre 2026); [[Elenco dei comandi e completamento nel plotter]] (cosa manca e in che ordine, parere del 2 ottobre 2026)
