---
stato: in sviluppo
aggiornato: 2026-10-05
tag: [contenuti, lezioni, matematica, fisica, strumenti]
---
# Piano cartesiano nelle lezioni

Dove montare il plotter ([[Grafico di funzioni]]) dentro le lezioni, con funzioni già scritte e cursori, e dove resta meglio una figura TikZ. L'ha chiesto Alessandro il 2 ottobre 2026. L'elenco è una proposta di Claude e nelle lezioni non c'è ancora nessun piano. Il 2 ottobre 2026 Alessandro ha deciso il metodo ([[2026-10-02 Nelle lezioni la figura resta e il piano la sostituisce con Prova tu]]) e i quattro pezzi che servivano al componente sono scritti, non committati: vedi "Stato attuale".

Nelle tabelle "al posto di" va letto con quella decisione: la figura TikZ resta come copertina, il piano la copre quando lo studente lo chiede.

## Stato attuale
Scritto il 2 ottobre 2026 sul branch `grafico-funzioni`, non committato.
- Il blocco `grafico` nel markdown di una lezione (`src/lib/grafico/blocco.ts`): una riga per cosa, in italiano. `curva` con il suo aspetto, `scelta`, `cursore` (anche con `anima`), `finestra`, `forma`, `valore`, `assi`, `sposta`, `domanda`. La sintassi con un esempio è in `docs/lezioni/README.md`.
- La pagina (`src/lib/content/markdown.ts`) porta le formule già lette dal server: nel browser non si carica il lettore di LaTeX. Un blocco dopo una figura TikZ la prende come copertina, con il bottone "Prova tu" (`src/lib/utils/plot-figure.ts`); da solo, il piano si monta quando la pagina ci arriva. Senza JavaScript e nella stampa resta la figura.
- Il piano compatto (`src/components/grafico/LessonPlot.tsx`): il piano del plotter senza pannello, con la finestra dell'autore (la pagina scorre sopra la figura), i punti notevoli, i cursori con il campo del valore, il controllo a segmenti con le etichette in formula, i valori scritti sotto il piano che seguono i cursori (con la virgola quando bastano due decimali, come frazione semplice quando non bastano, per esempio $\frac{1}{3}$; "non esiste" dove non c'è un valore) e la domanda. Due bottoni stanno negli angoli del disegno, per non occupare altro spazio in altezza e non spostare quello che c'è sotto (Alessandro, 2 ottobre 2026): "Reset" in basso a sinistra, spento finché i valori sono quelli iniziali, e una croce in alto a destra che riporta la figura. Il passo dei cursori negli esempi è 0,1, che è anche quello che vale se non si scrive.
- Il controllo delle lezioni (`scripts/lezioni/check.mts`) segnala un blocco che non si legge, una formula che il plotter non disegna, una lettera senza cursore, un valore che dipende da $x$. Un blocco sbagliato non compare nella pagina: resta la copertina.
- Una pagina di prova solo in sviluppo, `/prova-grafico/lezione`, mostra `docs/lezioni/prove/grafico.md` (sei blocchi, con le figure vere della 87, 88 e 93) o un file di `docs/lezioni` passato con `?file=`.
- I primi sette blocchi sono nelle lezioni, in `docs/lezioni/riscritte`, non pubblicati. Nella 87: $y = ax^2$ con $a$; $y = ax^2 + c$ con il vertice; i tre coefficienti con vertice e asse di simmetria, dentro l'esempio 2; i tre coefficienti con $\Delta$, da solo sotto la tabella delle sei parabole, con una frase prima. Nella 88: il segno del trinomio al variare di $c$ e poi di $a$, con la scelta tra positivo (blu) e negativo (rosso) come nelle figure; i quattro versi con $c$, da solo sotto la tabella riassuntiva. Una scelta può avere un colore suo per ogni formula.
- Le due lezioni non si possono pubblicare prima che questo codice sia in produzione: il sito di oggi non conosce il blocco `grafico` e lo mostrerebbe come codice. L'ordine è: PR su master, poi `scripts/lezioni/publish.mts`.
- Due test in `tests/unit/grafico.test.mjs`. Provato con Playwright su Chromium a 1280 px e su WebKit a 390 px con il tema scuro. Non provato su un telefono vero.

Dal 5 ottobre 2026 ([[2026-10-05 Strumenti nelle lezioni]]) i blocchi `grafico` sono in altre 31 lezioni, non committati e non pubblicati: 9 nel primo anno di matematica (16, 18, 42, 44, 45, 50, 52), 19 nel secondo (68, 78, 81, 82, 83, 84, 85, 86, 89, 90, 91, 92, 93, 104), 5 in fisica (10, 12, 39, 41, 49), 2 in chimica (31, 32) e uno in informatica (12). Dell'elenco qui sotto restano fuori la 80 e la 17, e in fisica le lezioni che hanno già un `interattivo` con gli stessi cursori (40, 42, 43, 44, 54, 56). I segmenti si disegnano come curve in $t$ con un parametro dentro, quindi distanza, pendenza e asse (82, 83, 85) sono entrati con i cursori al posto dei punti da trascinare. Da correggere nel componente: il bottone "Reset" copre lo zero del piano; `valore:` non ha unità, passa alle frazioni e scrive "non esiste" anche con infinite soluzioni.

Limiti:
- Nessun oggetto di geometria costruito (retta per due punti da trascinare, distanza): i punti del blocco sono fermi. Servono per le lezioni 80, 82, 83 e 85.
- Niente area e tangente come strumenti del blocco: servono per le lezioni di fisica 43 e 39.
- Niente angoli in gradi né asse in multipli di $\pi$.
- Una sola scelta per piano.
- `LessonPlot.tsx` ripete in piccolo il passaggio da formule a curve che sta in `Plotter.tsx`: da unificare quando il lavoro sul plotter dell'altra sessione è chiuso.

## Da dove viene l'elenco
Le figure delle lezioni sono blocchi TikZ con una riga `% alt`. Il 2 ottobre 2026 uno script le ha contate: nelle 104 lezioni di matematica (`docs/lezioni/riscritte`) le figure su un piano cartesiano sono 97, in 23 lezioni; nelle 70 di fisica (`docs/lezioni/fisica/riscritte`) i grafici sono 44, in 20 lezioni. Il conteggio legge il codice TikZ e il testo alternativo, non l'immagine: qualche figura può essere sfuggita o contata in più.

Le lezioni su esponenziali, logaritmi e goniometria non sono ancora scritte (terzo e quarto anno, vedi `docs/lezioni/programma.md`): per quelle il plotter si prevede mentre si scrivono, e l'elenco è in fondo.

Il gruppo 2 di [[Grafici e simulazioni interattive]], del 28 settembre 2026, indicava già una quindicina di lezioni. Questa nota lo sostituisce con i punti precisi.

## Tre modi di usarlo
- **Una famiglia in una figura.** Dove oggi ci sono tre o quattro curve disegnate insieme per mostrare cosa cambia con un coefficiente, un cursore le sostituisce: è l'uso con più valore.
- **Punti da trascinare.** Con gli strumenti di [[Geometria analitica nel plotter]]: la retta per due punti, la distanza, la perpendicolare, con l'equazione che cambia nella riga.
- **Lettura.** Una curva fissa su cui lo studente legge un valore, la tangente, l'area. Vale poco in matematica, molto in fisica.

## Matematica
Valore: alto dove un cursore sostituisce più figure o mostra un passaggio che il testo fatica a dire.

| Lezione | Punto | Cosa c'è sul piano | Valore |
|---|---|---|---|
| 87 Funzioni quadratiche | "La parabola $y = ax^2$" | $y = ax^2$ con il cursore $a$, da $-3$ a $3$; al posto delle quattro parabole | alto |
| 87 | "La parabola $y = ax^2 + c$" | cursori $a$ e $c$, con $y = x^2$ tratteggiata | alto |
| 87 | "Vertice e asse di simmetria" | $y = ax^2 + bx + c$ con tre cursori, il vertice e l'asse segnati | alto |
| 87 | "Con l'asse x" | la stessa parabola, con $\Delta$ scritto accanto e gli zeri segnati; sotto la tabella delle sei parabole, che resta TikZ | alto |
| 88 Disequazioni di secondo grado | i tre casi del discriminante e "Quando $a$ è negativo" | parabola con $a$, $b$, $c$, la regione $ax^2 + bx + c > 0$ colorata, un controllo a segmenti per il verso ($>$, $\ge$, $<$, $\le$); al posto di quattro figure | alto |
| 93 Sistemi di secondo grado | "Retta e parabola" | parabola fissa e retta $y = x + q$ con il cursore $q$: secante, tangente, esterna; al posto di tre figure | alto |
| 86 Fasci di rette | "Fascio proprio" | $y - 1 = m(x - 2)$ con $m$ in movimento | alto |
| 86 | "Fascio improprio" | $y = \frac{x}{2} + q$ con $q$ in movimento | alto |
| 68 Sistemi di equazioni | "Interpretazione grafica" | due rette con i coefficienti a cursore: incidenti, parallele, coincidenti in una figura sola; il punto comune è segnato | alto |
| 84 Intersezione tra due rette | "Il punto comune è la soluzione del sistema" | due rette, il punto di intersezione con le coordinate | alto |
| 81 Equazione di una retta | "Rette che passano per l'origine" | $y = mx$ con il cursore $m$ | alto |
| 81 | "La forma esplicita" | $y = mx + q$ con due cursori, $y = mx$ tratteggiata | alto |
| 82 Il coefficiente angolare | "Il segno di $m$" | $y = mx$, cursore $m$ | medio (lo stesso della 81: uno dei due) |
| 82 | "Il coefficiente angolare da due punti" | due punti da trascinare, la retta per loro con l'equazione nella riga | alto |
| 78 Equazioni parametriche | discussione al variare di $k$ | la parabola dell'equazione con il cursore $k$: gli zeri si avvicinano, coincidono, spariscono | alto |
| 45 Funzioni lineari | "Il grafico: una retta per l'origine" | $y = kx$, cursore $k$ | medio |
| 45 | "Il grafico: un ramo di iperbole" | $y = \frac{k}{x}$ per $x > 0$, cursore $k$ | medio |
| 18 Iniettive, suriettive, biiettive | "Con il grafico: le rette orizzontali" | la retta $y = k$ a cursore sopra una funzione scelta con un controllo a segmenti ($2x + 1$, $x^2$, $x^3$) | alto |
| 42 Definizione di funzione | "Riconoscere una funzione dal grafico" | la retta $x = k$ a cursore su una parabola e su una circonferenza | medio |
| 44 Composizione di funzioni | "Il grafico della funzione inversa" | $f$, la sua inversa e $y = x$, con $f$ scelta tra tre | medio |
| 90 Equazioni binomie e trinomie | "Equazioni binomie" | $y = x^n$ con $n$ intero a cursore e la retta $y = k$: quante soluzioni | alto |
| 91 Valore assoluto | "Il valore assoluto di un'espressione" | $y = \lvert x - a \rvert$ con il cursore $a$ e la retta $y = k$ | medio |
| 92 Equazioni irrazionali | "Perché il quadrato aggiunge soluzioni" | $y = \sqrt{x + 3}$, il ramo $-\sqrt{x + 3}$ tratteggiato e la retta $y = x - k$ | medio |
| 54 Disequazioni razionali | accanto alla tabella dei segni | il grafico di $\frac{N(x)}{D(x)}$ con la regione dove è positiva | medio |
| 50 Equazioni letterali | discussione | la retta $y = ax - b$: con $a = 0$ diventa orizzontale e non taglia l'asse | medio |
| 80 Il piano cartesiano | "Segmenti obliqui", "Punto medio di un segmento" | due punti da trascinare, con la distanza e il punto medio | alto |
| 83 Parallele e perpendicolari | "Retta per un punto parallela o perpendicolare" | una retta, un punto da trascinare, la parallela e la perpendicolare | alto |
| 83 | "Asse di un segmento" | due punti da trascinare e l'asse | medio |
| 85 Distanza punto-retta | "Che cos'è la distanza di un punto da una retta" | una retta, un punto da trascinare, la distanza scritta sul piano | alto |
| 17 Equazioni di secondo grado | dopo la formula risolutiva | parabola con $a$, $b$, $c$: le soluzioni sono gli zeri | da decidere |

Sono 30 punti in 20 lezioni. Sulla 17: il grafo dei prerequisiti (`docs/lezioni/prerequisiti.md`) mette il piano cartesiano e la parabola dopo le equazioni di secondo grado, quindi lì il grafico anticiperebbe due lezioni. Meglio un rimando in avanti alla 87, o un riquadro di approfondimento.

Lezioni dove il plotter non entra: la geometria sintetica (58-62, 96-103), che non ha coordinate e ha già le figure interattive del kit; le 52 e 53, che lavorano sulla retta dei numeri e hanno già le loro figure; la 104, che aspetta le trasformazioni del terzo giro di geometria.

## Fisica
| Lezione | Punto | Cosa c'è sul piano | Valore |
|---|---|---|---|
| 43 Grafico velocità-tempo | l'area sotto la curva | lo strumento dell'area con gli estremi da trascinare: lo spazio percorso | alto |
| 39 Velocità | velocità istantanea | lo strumento della tangente sul grafico spazio-tempo: la pendenza è la velocità | alto |
| 40 Moto rettilineo uniforme | grafico spazio-tempo | $s = s_0 + vt$ con due cursori, assi $t$ e $s$; al posto delle tre rette | alto |
| 42 Moto uniformemente accelerato | i due grafici | $v = v_0 + at$ e $s = v_0 t + \frac{1}{2}at^2$ con gli stessi cursori | alto |
| 44 Caduta libera | i due grafici | come la 42, con $g$ | medio |
| 49 Moto armonico | posizione nel tempo | $x = A\cos(\omega t + \varphi)$ con tre cursori | alto |
| 56 Moto dei proiettili | la traiettoria | curva in $t$ con i cursori della velocità e dell'angolo | alto |
| 11 Proporzionalità diretta | le tre rette per l'origine | $y = kx$, cursore $k$ | medio |
| 12 Proporzionalità inversa | l'iperbole | $y = \frac{k}{x}$, cursore $k$ | medio |
| 18 Forza elastica, 59 Lavoro | forza e allungamento | $F = kx$ con il cursore $k$; nella 59 l'area è il lavoro | medio |
| 61 Energia cinetica | spazio di frenata | $d = \frac{v^2}{2\mu g}$ con il cursore $\mu$ | medio |
| 54 Piano inclinato | velocità-tempo sulla rampa | retta con il cursore dell'angolo | basso |

Sono 13 punti in 13 lezioni.

## Lezioni ancora da scrivere
Da prevedere mentre si scrivono: $a^x$ e $\log_a x$ con il cursore $a$ (crescente, decrescente, il caso $a = 1$), una accanto all'altra con $y = x$; $A\sin(\omega x + \varphi)$; la circonferenza, l'ellisse e l'iperbole con i loro parametri; le trasformazioni di un grafico, $f(x - a) + b$ e $k f(x)$; la retta tangente e la derivata; la funzione integrale. Gli esempi dello strumento ne coprono già alcune.

## Dove resta meglio TikZ
1. **Gli esempi svolti.** Il testo dice "la parabola taglia l'asse in $-2$ e in $3$" e la figura deve mostrare proprio quello, ferma. Otto delle dodici figure della 88 sono così. Un piano che lo studente può spostare smette di corrispondere alla frase accanto.
2. **Le figure composte.** Nella 88 e nella 89 sotto la parabola c'è la retta delle soluzioni, allineata alle stesse $x$: il plotter non impila due disegni. Nella 87 le sei parabole in tabella (segno di $a$ per segno di $\Delta$) si confrontano con un colpo d'occhio, e un cursore mostra un caso alla volta.
3. **Le annotazioni.** Il triangolo della pendenza con "3" e "2" sui cateti (82), i "quattro passi a destra e tre in basso" (81), i tratteggi verso gli assi, l'angolo retto, le quote lungo un segmento (80, 85 "Da dove viene la formula"). Il plotter scrive nomi e coordinate, non queste.
4. **I dati di un esperimento.** I punti misurati con la retta che li approssima (fisica 03, 10, 11), la curva di riscaldamento con i nomi dei tratti (70), l'attrito a due tratti (19), il volume dell'acqua (66). Sono disegni di dati, non di una formula.
5. **Dove non c'è un "cosa succede se".** I quadranti, i punti con le loro coordinate, i simmetrici (80): la figura va letta, non provata.
6. **Quello che si stampa.** Formulari, flashcard, PDF e testi degli esercizi usano un'immagine.

I vantaggi di TikZ in questi casi: è la figura del libro, esatta e con tutte le annotazioni; è un'immagine con il suo testo alternativo, senza codice nel browser; si rilegge una volta, mentre una figura con i cursori ha infiniti stati da controllare; non compete con lo scorrimento della pagina sul telefono.

Due regole che ne vengono:
- Prima la figura ferma, poi il cursore. La prima volta che compare un oggetto serve il disegno che dice dove guardare; il plotter viene dopo, con una domanda scritta ("porta $a$ sotto zero: cosa fa la parabola?"). Un cursore senza domanda è rumore.
- Due o tre piani per lezione, non dodici. Ogni piano è un componente che campiona curve: sul telefono pesa e spezza la lettura.

## Cosa manca al componente
I quattro pezzi dell'elenco del 2 ottobre 2026 (blocco, forma compatta, valori, controllo a segmenti) sono fatti. Resta quello che è in "Limiti", e il campo libero dove lo studente scrive una formula sua, il terzo uso previsto il 1° ottobre 2026.

## Cosa è mancato nel terzo anno di matematica
Dal lotto del 5 ottobre 2026 ([[2026-10-05 Terzo anno di matematica]]): 79 piani in 23 lezioni. Quello che i gruppi avrebbero usato e che il blocco non sa fare, in forma abbreviata.

- **Funzioni (105-109).** punto mobile sull'asse con f(x) e segno; pallino vuoto / punti esclusi; P e simmetrico trascinabili; x1<x2 trascinabili; curve a tratti con dominio limitato; f data per punti; passi intermedi
- **Successioni (110-113).** curva "punti di f(n) per n da 1 a N"; ricorsione; rette da trascinare; rettangoli; curva con condizione sul cursore; scala log; assi/valore con etichette LaTeX
- **Circonferenza e parabola (114-117).** tre punti trascinabili (circonferenza/parabola per 3 punti); punto sulla curva con tangente; P esterno trascinabile; segmenti (non rette); area colorata; fuoco trascinabile
- **Ellisse e iperbole (118-120).** punto trascinabile sulla curva (luogo, tangente, tangenti da P esterno); punti d'intersezione segnati; distanza dall'asintoto; nomi dei punti scelti (F_1, F_2); lettera e riservata
- **Esponenziali (121-123).** punti isolati (1+1/n)^n; punto trascinabile sulla curva con proiezione; tangente; due scelte/piani impilati; soluzione come segmento sull'asse x; zoom guidato; doppia disequazione
- **Logaritmi (124-127).** punto trascinabile sulla curva e simmetrico; intersezione calcolata dal plotter; due zone colorate insieme; soluzioni come segmento sull'asse; scala logaritmica
- **Statistica bivariata (128-129).** punti trascinabili con retta/r aggiornati; residui come segmenti/quadrati; rettangoli covarianza; nuvola generata da r; tabella con casella modificabile

## Ordine proposto
1. I blocchi nella 87 e nella 88, che sono nella beta di gennaio 2027: il componente c'è, mancano i blocchi nelle lezioni.
2. Le rette: 81, 82, 86, 68, 84, 93.
3. La geometria con i punti: 80, 83, 85.
4. La fisica, partendo dalla 43 e dalla 39, dove servono area e tangente.

## Domande aperte
- Chi rilegge le figure con i cursori, e come: Andrea rilegge un'immagine, non un intervallo di valori.
- Nella 17 il grafico prima della lezione sulla parabola: rimando, riquadro o niente.
- Gli estremi e il passo dei cursori: interi, per avere numeri puliti, o decimali.

## Collegamenti
- [[Grafico di funzioni]], [[Geometria analitica nel plotter]], [[Grafici e simulazioni interattive]], [[Lezioni]]
- [[Pipeline lezioni]], [[Standard di qualità]]
