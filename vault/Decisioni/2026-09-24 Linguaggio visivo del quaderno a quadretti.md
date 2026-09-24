---
stato: decisa
aggiornato: 2026-09-24
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
- Da fare: rivedere con Dario.

## Collegamenti
- [[Principi]] (accessibilità: contrasto e font sono scelte di design)
- [[Lezioni]], [[Zaino]]
