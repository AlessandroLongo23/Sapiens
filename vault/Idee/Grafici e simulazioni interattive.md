---
stato: idea
aggiornato: 2026-10-01
tag: [idea, strumenti, matematica, fisica]
---
# Grafici e simulazioni interattive

## L'idea
Alessandro, 27 settembre 2026. Avere dentro Sapiens quello che fanno Desmos o GeoGebra, senza mandare lo studente su un altro sito. Dal terzo anno delle superiori, e ancora di più al quarto, al quinto e all'università, si lavora molto con le funzioni, e uno strumento per disegnarle e studiarle serve tutti i giorni. Meglio ancora se si può costruire con una libreria che poi si ridisegna con la grafica di Sapiens.

Lo stesso vale per la fisica: il piano inclinato, il moto parabolico, la caduta dei corpi da fermi, gli urti. Molti esercizi si capiscono molto meglio con un'immagine, un video, o ancora meglio con una simulazione interattiva, con cursori e campi per cambiare i dati e vedere cosa succede.

## Perché potrebbe valere
Serve dove la lezione scritta fa più fatica: funzioni, grafici, moti. Tiene lo studente sul sito invece di mandarlo su GeoGebra. Le simulazioni sono anche il materiale per i video brevi ([[Video brevi]]) e si possono agganciare agli esercizi.

Strade tecniche da valutare (Claude, 27 settembre 2026, licenze e limiti da verificare):
- Grafici di funzioni: Mafs (componenti React per grafici 2D, licenza MIT, stile con variabili CSS, quindi adattabile al quaderno a quadretti), JSXGraph (geometria interattiva, licenza LGPL o MIT), function-plot (su d3). L'API di Desmos e le app di GeoGebra si incorporano, ma per un uso commerciale chiedono un accordo o una licenza.
- Scrittura delle formule: MathLive (MIT) per l'input con tastiera matematica; Compute Engine di CortexJS o math.js per valutare e derivare.
- Simulazioni di fisica: per i moti della scuola bastano le formule chiuse disegnate in SVG o canvas, con i cursori; per gli urti e i corpi rigidi una libreria come Matter.js o Planck.js. Le simulazioni PhET dell'Università del Colorado sono gratuite e incorporabili (licenza CC BY), utili come riferimento.

## Primo uso: i grafici degli strumenti
Alessandro, 28 settembre 2026, guardando lo strumento del punto medio: sarebbe più bello poter trascinare i punti A e B direttamente sul grafico. Proposta di Claude: costruire il primo pezzo del componente proprio a partire dagli strumenti, invece di finirlo prima in astratto, e usarlo poi anche per funzioni e simulazioni.
- Dove serve: distanza, punto medio, retta per due punti, parabola (vertice o un punto), seno e coseno (l'angolo sulla circonferenza goniometrica), triangoli e Pitagora (i vertici).
- I punti scattano sulla griglia (interi, o mezzi con lo zoom), così i numeri restano esatti e i passaggi leggibili.
- Campi e grafico sincronizzati, e l'indirizzo con loro; punti selezionabili con Tab e spostabili con le frecce; area di tocco grande sul telefono.
- La pagina resta statica per Google: il grafico diventa interattivo solo nel browser, l'esempio con i passaggi resta nell'HTML.
- Componente nostro in SVG, partendo dagli schizzi che ci sono già; prima valutare Mafs per un'ora.

Decisione sui tempi, Alessandro, 28 settembre 2026: non subito. È tra le prossime cose da fare, con calma e in una conversazione dedicata, perché deve essere fatto molto bene. È in [[Agenda]].

## Figure interattive nelle lezioni
Il 28 settembre 2026 è nata la prima, nella lezione Equivalenza e aree: il triangolo DMC si trascina intorno a M e il trapezio diventa il triangolo AED, con quattro cursori per la forma (vedi [[Lezioni]]). La fisica è scritta a mano: un pezzo con un solo grado di libertà non ha bisogno di Matter.js o Planck.js.

Poi Alessandro ha chiesto di cercare altre occasioni nelle 104 lezioni scritte. Quattro agenti le hanno lette il 28 settembre 2026 e hanno proposto una sessantina di figure, circa una ventina di valore alto. Quasi tutte si raggruppano in pochi componenti comuni, e il valore sta nel costruire quelli e non le figure una alla volta. Lo sforzo è S se riusa uno schema esistente, M se serve un componente nuovo. Le valutazioni sono degli agenti, da rivedere.

1. Pezzi che si muovono conservando l'area (lo schema della 98, S). Nella 98 il parallelogramma che diventa rettangolo (il triangolo AHD che scorre su BKC); nella 35 la L di $a^2 - b^2$ che diventa il rettangolo $(a+b)(a-b)$ (alta); nella 100 il primo teorema di Euclide, il quadrato che diventa parallelogramma e poi rettangolo (alta, M); nella 99 i settori del cerchio riordinati, con un cursore sul loro numero (alta, M); nella 60 gli angoli del triangolo che scivolano sulla parallela; nella 83 la rotazione di 90° che dà $-1/m$.
2. Piano cartesiano con parametri (M una volta, poi S per ogni lezione). È il componente dei grafici descritto sopra, e da solo copre una quindicina di lezioni: la parabola con $a$, $b$, $c$ e $\Delta$ (17 e 87, alta), il segno del trinomio (88), retta e parabola (93), i sistemi di rette incidenti, parallele e coincidenti (68, 69, 84, alta), $m$ e $q$ (45, 81), l'equazione parametrica al variare di $k$ (78, alta), la discussione delle equazioni letterali (50, alta), le rette orizzontali per iniettiva e suriettiva (18, alta), le rette verticali per riconoscere una funzione (42), la funzione inversa (44), il rettangolo di area costante sotto l'iperbole (45, alta), e le lezioni 90, 91 e 92.
3. Geometria con punti da trascinare (M). L'angolo alla circonferenza che resta metà di quello al centro mentre V si muove (96, alta), i punti notevoli che escono dal triangolo ottusangolo (61, alta), la disuguaglianza triangolare con i lati che si chiudono o no (59, alta), la trasversale su due rette (60, alta); poi 62, 80, 82, 85, 97, 101, 102, 103, 104.
4. Retta dei numeri (S). Il verso della disuguaglianza che si gira moltiplicando per un negativo, con i due punti che si scambiano (52, alta); poi 21, 53, 71, 77.
5. Diagrammi di Venn da colorare (M). De Morgan e la distributiva come la stessa zona colorata in due modi (3 e 64, alta); poi 2, 5, 63, 66, 94.
6. Barre e griglie per le frazioni (S). Le frazioni equivalenti come lo stesso pezzo tagliato più fine (23, alta); poi 7, 24, 26.
7. Simulazioni e procedure a passi (M). I lanci della moneta con la frequenza relativa che si stringe intorno a 0,5 (94, alta), la bilancia dei principi di equivalenza (16, alta), le tessere algebriche che compongono il rettangolo del trinomio (36, alta); poi 7, 19, 41, 51, 56, 57, 65, 95.

Nessuna proposta per 1, 4, 6, 8-15, 20, 22, 25, 27-29, 31, 32, 34, 37-40, 43, 46-49, 55, 67, 70, 72-76, 79 e 89.

Fatto il 28 settembre 2026, su richiesta di Alessandro: tutti i gruppi tranne il 2, lasciando fuori le proposte di valore basso. Sono 45 figure in 38 lezioni, nel codice e non pubblicate; vedi [[2026-09-28 Figure interattive nelle lezioni]]. Restano le figure del gruppo 2 e quelle di valore basso (per esempio le lezioni 30, 33, 58, 65, 80, 90 e 91).

Ordine proposto prima di farle (Claude): prima il gruppo 1, che riusa il codice della 98 (parallelogramma e differenza di quadrati), poi il piano cartesiano del gruppo 2, che è il più ampio. Tra le figure isolate, quelle con più valore sono l'angolo alla circonferenza (96), la moneta (94) e la bilancia (16).

## Fisica
Il 29 settembre 2026, prima del primo lotto di fisica, si è deciso di non usare un motore fisico e di non aggiungere pacchetti: le figure interattive di fisica usano il kit, allargato con un modulo di fisica (vettori, forze, blocchi, molle, carrucole, fili, poi cariche e linee di campo), e i modelli della scuola si disegnano dalle loro formule chiuse, con un integratore scritto a mano dove non ce ne sono. Negli esercizi la figura è una scena disegnata dagli stessi componenti. I grafici di fisica sono statici in TikZ, disegnati come quelli di matematica, finché non c'è il piano cartesiano del kit, che deve avere la stessa identità visiva del TikZ. Vedi [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]].

## Il plotter delle funzioni
Il 1° ottobre 2026 il piano cartesiano è diventato un prodotto: [[Grafico di funzioni]]. È disegnato da noi sul kit, senza Mafs, JSXGraph o function-plot, e senza Desmos e GeoGebra, che per l'uso commerciale chiedono una licenza. Lo strumento è il primo uso; le figure del gruppo 2 e i grafici di fisica vengono dopo, con lo stesso componente. Vedi [[2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici]] e [[2026-10-01 Il plotter delle funzioni è il primo uso del piano cartesiano del sito]].

## Dubbi e conflitti
Il piano cartesiano del gruppo 2 è lo stesso componente che Alessandro il 28 settembre 2026 ha rimandato a una conversazione dedicata: le figure del gruppo 2 aspettano quella.

Nessun conflitto con le decisioni prese. Viene dopo la prima onda dei [[Calcolatori e convertitori]], che rimanda già i grafici a "più avanti", e dopo la beta, che copre il primo e secondo anno di matematica.

## Collegamenti
- [[Calcolatori e convertitori]], [[Lezioni]], [[Esercizi]], [[Video brevi]]
