---
stato: idea
aggiornato: 2026-09-28
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

## Dubbi e conflitti
Nessun conflitto con le decisioni prese. Viene dopo la prima onda dei [[Calcolatori e convertitori]], che rimanda già i grafici a "più avanti", e dopo la beta, che copre il primo e secondo anno di matematica.

## Collegamenti
- [[Calcolatori e convertitori]], [[Lezioni]], [[Esercizi]], [[Video brevi]]
