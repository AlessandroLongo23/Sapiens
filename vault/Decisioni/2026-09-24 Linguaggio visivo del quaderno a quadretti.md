---
stato: decisa
aggiornato: 2026-09-25
tag: [decisione, design]
---
# Linguaggio visivo del quaderno a quadretti

## Decisione
Sapiens prende l'aspetto di un quaderno di matematica: carta calda al posto del grigio, testo color inchiostro blu-nero, il rosso come penna del correttore, quadretti azzurri dietro le intestazioni delle pagine. I titoli sono in un serif (Fraunces), i numeri e le etichette in monospazio (JetBrains Mono), il testo resta in Inter. Ogni materia ha un colore, come il dorso di un libro: matematica rosso, fisica blu, chimica verde, informatica senape; livelli e pagine senza materia usano l'inchiostro.

## Perché
Alessandro, il 24 settembre 2026, ha giudicato il design precedente piatto e anonimo: fondo grigio, schede bianche tutte uguali, icone in un riquadro, contatori in pillole con colori casuali. Il quaderno a quadretti è un riferimento che ogni studente italiano riconosce e lega Sapiens alla scuola senza illustrazioni. Il colore per materia aiuta a orientarsi nell'albero dei contenuti.

## Conseguenze
- Token in `src/app/globals.css`: scale `paper` e `ink`, `--grid`, ombre `paper`, `lift` e `key`, colori `tint-*` derivati da `--hue` e `--chroma` tramite l'attributo `data-subject`.
- Nuove utility: `grid-paper`, `label-mono`. `h1` e `h2` usano il serif per default.
- Le pagine di livello e materia mostrano le materie come copertine colorate; capitoli e lezioni sono un indice numerato. `Stat` è un numero grande con etichetta; `PageHeader` ha occhiello, titolo con tratto di penna e un'etichetta con l'icona.
- Aggiornati bottoni, schede, campi, header, footer, hero della home, pagina prezzi, schede dei tutor, titoli e riquadri delle lezioni.
- Seconda passata, stesso giorno: nello Zaino i quaderni sono copertine colorate come le materie (i colori scelti dallo studente passano per `data-notebook`) e le note si scrivono su carta a quadretti tenue. Le flashcard sono schede a righe con la riga rossa sotto l'intestazione. Gli esercizi hanno le lettere a), b), c) come in una verifica e il numero della domanda. Sapiens AI, l'indice della lezione (numerato, con un segno rosso sulla sezione letta) e il riepilogo degli esercizi usano serif ed etichette in monospazio. Nuovo componente `Sticker` per le icone su etichetta inclinata.
- L'illustrazione della home non ha più le macchie rosse e nere dietro la figura; sta su un foglio a quadretti fissato con lo scotch, che resta chiaro anche nel tema scuro.
- Terza passata, stesso giorno: l'illustrazione della home (uno studente al computer, un PNG di 500 KB) è sostituita da uno schizzo animato in SVG, `src/components/landing/HeroSketch.tsx`. I quadretti del foglio sono le unità del grafico; la penna scrive la formula e il calcolo a mano (font a tratto singolo Hershey Script, generato da `scripts/landing/hero-ink.mjs`), la penna rossa cerchia e spunta. Tre materie con le linguette di un raccoglitore: parabola e soluzioni, moto parabolico come foto stroboscopica, cinetica del primo ordine; la tangente che scorre sulla curva è pendenza, velocità e velocità di reazione, e segue il puntatore. Nessuna libreria, circa 13 KB compressi; l'elemento LCP è ora il titolo. Con il movimento ridotto il disegno è già completo. I bottoni dicono "Prova gratis per 7 giorni" e "Senza carta di credito".
- Stesso giorno, sulla pagina degli esercizi: le lettere a), b), c) diventano numeri 1, 2, 3, 4, in una casella che si trasforma nella spunta o nella croce. Alessandro ha notato che le lettere fanno pensare di poter rispondere da tastiera, e i numeri stanno vicini sulla tastiera: si risponde con 1-4 e anche con a-d. La domanda sta in alto e le risposte in fondo alla pagina; il numero della domanda è accanto alla barra di avanzamento. Gli esercizi sono impaginati per blocchi (testo, dati in riga, formula), vedi [[Esercizi]].
- Da decidere con Alessandro: titolo, occhiello ("medie, superiori e università") e contatori della home non seguono ancora [[2026-09-23 Superiori STEM come segmento iniziale]] e [[2026-09-23 Pratica con progressi come messaggio principale]].
- Il 25 settembre Alessandro ha bocciato il testo in fondo alle pagine delle materie (tre sezioni di paragrafi, un muro di testo). Ora è una pagina di diario: foglio a quadretti con i fori e il margine rosso, testo breve con grassetto ed evidenziatore giallo, il percorso a tappe cerchiate a penna, una figura in TikZ fissata con lo scotch, una checklist con le spunte rosse, un post-it e note a matita (font Caveat, caricato solo su queste pagine). Vale per tutte le dieci materie; i testi sono in `src/lib/content/subject-copy.ts`, le figure le genera `scripts/figure/guides.mjs` in `public/guide/`. I testi sono più corti di prima: l'effetto sulla SEO è da verificare.
- Il 26 settembre Alessandro ha notato che le pagine delle materie avevano tutte la stessa struttura (titolo, percorso con la figura a destra, verifica con post-it, "prima di iniziare") e sembravano generate da un modello. Ora ogni materia compone la sua pagina da blocchi diversi, in ordine e affiancamenti suoi: percorso a tappe, linea degli anni o mappa per aree; errori barrati in rosso con la correzione a matita; scheda da interrogazione a righe; metodo o definizione incorniciati a mano; tabellina; post-it di quattro colori; note a matita. Nuove figure per Scienze (ciclo dell'acqua) e Tecnologia (proiezioni ortogonali). Testi e composizione in `src/lib/content/subject-copy.ts`, blocchi in `src/components/content/SubjectGuide.tsx`.
- Da fare: rivedere con Dario.

## Collegamenti
- [[Principi]] (accessibilità: contrasto e font sono scelte di design)
- [[Lezioni]], [[Zaino]]
