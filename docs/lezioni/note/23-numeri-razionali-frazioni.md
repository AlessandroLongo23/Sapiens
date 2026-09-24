# Note: Frazioni e numeri razionali

Lezione nuova, scritta da zero (non c'era un originale). Tre figure nuove, compilate in locale con `scripts/figure/compile.mjs` e guardate solo in chiaro: vanno riviste sul sito anche in scuro.

## Scelte di convenzione

- Impropria: ho scelto "numeratore maggiore o uguale al denominatore", quindi $\dfrac{5}{5}$ è impropria e apparente. Alcuni libri scrivono solo "maggiore" e trattano $\dfrac{5}{5}$ a parte: da decidere.
- Apparenti come caso particolare delle improprie, come nella maggior parte dei testi del biennio.
- La classificazione è limitata a numeratore e denominatore positivi. Così resta fuori $\dfrac{0}{b}$: alcuni libri la chiamano apparente (perché $0$ è multiplo di $b$), altri propria (perché $0 < b$). Non l'ho classificata; se serve, va deciso.
- Il numero razionale è definito come "insieme di tutte le frazioni equivalenti a una frazione data", senza la parola "classe di equivalenza" e senza rimando a relazioni di equivalenza (quella lezione viene dopo, in "Relazioni e funzioni"). Rappresentante: la frazione irriducibile con denominatore positivo.
- Nella figura con $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$ le etichette sono in grassetto ($\mathbf{N}$, $\mathbf{Z}$, $\mathbf{Q}$) e non in lettere doppie: il compilatore TikZ non carica `amssymb`, quindi `\mathbb` non si compila. Se si aggiunge il pacchetto a `compile.mjs`, conviene passare a `\mathbb`.
- Ho messo anche la densità di $\mathbb{Q}$, in un riquadro `ad-note` breve, con un esempio che non richiede operazioni (solo il denominatore comune). Non era nell'ambito richiesto: si può togliere senza danni.
- Ho messo il problema inverso ("i $\dfrac{3}{5}$ sono $15$, quanto è l'intero?") perché in verifica compare sempre insieme alla frazione come operatore.

## Argomenti lasciati ad altre lezioni

- Confronto e ordinamento: solo un rimando a "Confronto tra frazioni", anche dalla sezione sulla retta.
- Le quattro operazioni: rimando a "Operazioni in ℚ".
- Da frazione a decimale e viceversa: rimando a "Numeri decimali e frazioni".
- Calcolo del MCD: rimando a "MCD e MCM in ℕ". La regola dei segni: rimando a "Operazioni in ℤ".
- Numeri misti ($2\tfrac{1}{4}$): non li ho introdotti; ho scritto "$2$ interi e $\dfrac{1}{4}$" a parole. Nella scuola superiore si usano poco.

## Cosa togliere da "Confronto tra frazioni"

La lezione 10 (`docs/lezioni/pubblicate/10-numeri-razionali-confronto-frazioni.md`) oggi spiega anche equivalenza e riduzione, che ora stanno qui. Proposta:

- Sezioni "Frazioni equivalenti" e "Riduzione ai minimi termini": sostituirle con due righe di richiamo ("prima di confrontare conviene ridurre ai minimi termini") e un link a questa lezione. L'esempio con $\dfrac{84}{126}$ si può tenere solo se serve lì, altrimenti va via.
- Frase di apertura sul denominatore negativo: può restare come promemoria di una riga, con link alla sezione "Frazioni con il segno" di questa lezione.
- Sezione "Le frazioni sulla retta": la prima frase (come si trova il punto di $\dfrac{3}{4}$) ripete il procedimento di qui; basta tenere "è maggiore quella più a destra" con la figura e un link.
- Nel formulario 10: le sezioni "Frazioni equivalenti" e "Riduzione ai minimi termini".
- Nelle flashcard 10: `frazioni-equivalenti-definizione`, `proprieta-invariantiva`, `equivalenza-in-croce`, `equivalenza-conto`, `minimi-termini-definizione`, `minimi-termini-come` ripetono carte di qui. Se sono già pubblicate e hanno progressi degli studenti attaccati, conviene deciderlo prima di toglierle.
- Il prodotto in croce per il confronto ($a \cdot d < c \cdot b$) resta lì; qui c'è solo l'uguaglianza.

## Dubbi

- La lezione è lunga (circa 17 000 caratteri, nove esempi): copre operatore, quoziente, classificazione, equivalenza, riduzione, segno, ℚ e retta. Se si vuole accorciare, i candidati sono il riquadro sulla densità e l'esempio 6 in due modi.
- La nidificazione del blocco `tikz` dentro `ad-example` (esempio 9) segue lo schema della lezione 02; da guardare sul sito che venga resa bene.

## Livelli per gli esercizi

1. Frazione di un numero intero, con risultato intero. Esempio: calcola $\dfrac{2}{5}$ di $35$ (risultato $14$).
2. Classificare una frazione con termini positivi (propria, impropria, apparente) e, se impropria non apparente, dire tra quali interi sta. Esempio: $\dfrac{17}{5}$ (impropria, tra $3$ e $4$).
3. Ridurre ai minimi termini una frazione positiva con MCD piccolo e visibile ($2$, $3$, $5$). Esempio: $\dfrac{15}{35} = \dfrac{3}{7}$.
4. Ridurre con un MCD grande, da trovare con la scomposizione, o dire se due frazioni sono equivalenti con il controllo in croce. Esempio: $\dfrac{126}{210} = \dfrac{3}{5}$ (MCD $42$); $\dfrac{9}{12}$ e $\dfrac{15}{20}$ sono equivalenti ($180 = 180$).
5. Aggiungere il segno: ridurre frazioni con numeratore o denominatore negativo, scrivendo il risultato con il denominatore positivo. Esempio: $\dfrac{-36}{-60} = \dfrac{3}{5}$, $\dfrac{42}{-56} = -\dfrac{3}{4}$.
6. Problema inverso, dalla parte all'intero. Esempio: i $\dfrac{4}{7}$ di una somma sono $48$ euro; la somma è $84$ euro.
