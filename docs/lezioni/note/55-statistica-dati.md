# Note: Dati, frequenze e grafici

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy e con un conteggio in Python: le tabelle dei 20 numeri di fratelli e delle 30 altezze (frequenze, percentuali arrotondate, cumulate), gli angoli dell'aerogramma dello sport ($126^\circ$, $90^\circ$, $72^\circ$, $54^\circ$, $18^\circ$, somma $360^\circ$), il cammino inverso dell'esempio 5 ($80$, $50$, $40$, $30$ su $200$) e i conti delle carte.

## Scelte di convenzione

- Notazione: $N$ per il numero totale dei dati, $f_a$ per la frequenza assoluta, $f_r$ per la relativa; la percentuale resta a parole. I libri variano molto ($n_i$, $F_i$, $f_i$, $f_i/n$…). Da allineare con Media, mediana e moda e con Indici di variabilità, che usano le frequenze nella media ponderata: se una delle due ha scelto un'altra notazione, conviene cambiare questa.
- Classi scritte $150 \vdash 160$ (compreso l'estremo dalla parte del trattino verticale), come nella maggior parte dei libri italiani di statistica, con un `ad-note` che le collega all'intervallo $[150, 160[$ della lezione 52. Da verificare con il libro in uso; alcuni scrivono le classi direttamente come intervalli, o come "150-160" con la regola a parole.
- Caratteri qualitativi: la lezione dice che alcuni hanno un ordine (titolo di studio, giudizio) e altri no, senza i nomi "ordinati/ordinabili" e "sconnessi" che usano alcuni libri. Serve per le cumulate qui e per la mediana nella 56.
- "Ortogramma" con "diagramma a barre" come sinonimo detto una volta; "aerogramma" con "grafico a torta". Il diagramma a bastoni (per i discreti) e l'ideogramma non ci sono: alcuni libri li trattano, si possono aggiungere in una riga.
- Il diagramma cartesiano è presentato solo per i dati che cambiano nel tempo (serie storiche), come fa la maggior parte dei libri del biennio. Il poligono delle frequenze non c'è.
- 21 grassetti, tutti su termini definiti nel punto della definizione (il controllo avvisa sopra 12). Se sono troppi, i primi da togliere sono "censimento", "tabella di frequenza" e "ampiezza".

## Lasciato ad altre lezioni

- Media, mediana e moda: niente, nemmeno un cenno, oltre alla frase "la media di due CAP non ha senso" nell'avviso sui numeri qualitativi.
- Percentuali: il conto $f_r \cdot 100$ è detto in una riga con il link a Rapporti, proporzioni e percentuali; la proporzione $\alpha : 360^\circ = f_a : N$ è citata senza rispiegarla.
- Istogramma con classi di ampiezza diversa: solo un `ad-note` (l'area è proporzionale alla frequenza, altezza = frequenza / ampiezza), senza esempio né figura. Se nelle verifiche compare spesso, merita un esempio con figura; altrimenti il riquadro si può togliere.
- Campionamento: la lezione dice solo che le unità del campione si scelgono a caso e dà un esempio di campione scelto male. Niente tipi di campionamento.

## Da togliere o controllare in lezioni già scritte

- Rapporti, proporzioni e percentuali (26): nell'esempio 2 delle percentuali ("$18$ studenti su $24$ hanno la sufficienza") si potrebbe aggiungere un link a questa lezione come "dove si usa", ma non è necessario. Nient'altro da togliere: nessuna lezione pubblicata tratta la statistica.

## Figure

Cinque, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro come PNG (non sul sito, né in tema scuro). Tinte `blue!20`, `orange!30`, `green!25`, `red!20`, `violet!20`, bordi scuri, niente `\clip` né riempimenti bianchi. Le etichette sotto gli assi hanno `text height`/`text depth` fissi, perché senza le parole con e senza discendenti ("nuoto", "pallavolo") uscivano su righe diverse.

- `ortogramma-sport-preferito` (289×162), fuori dai riquadri.
- `istogramma-altezze-studenti` (287×154), fuori dai riquadri. L'asse orizzontale parte da poco prima di $150$, senza il segno di interruzione dell'asse: da valutare se aggiungerlo.
- `aerogramma-sport-preferito` (247×157), dopo l'esempio 4.
- `aerogramma-mezzi-di-trasporto` (254×149), dentro il riquadro dell'esempio 5.
- `diagramma-cartesiano-temperature` (254×153), dentro il riquadro dell'esempio 6.

Il formulario non ha figure.

## Formulario e flashcard

- Il formulario ha la tabella dei tipi di carattere, che nella lezione è in prosa con un esempio a elenco: è un riordino, non un contenuto nuovo.
- 20 carte. La carta `aerogramma-dall-angolo` usa i numeri dell'esempio 5; `frequenza-relativa-conto` quelli dell'esempio 1.

## Prerequisiti

La riga `statistica-dati <- numeri-razionali-proporzioni` va bene così. La lezione usa le frazioni, i decimali e le percentuali (frequenze relative e percentuali, angoli come percentuale di $360^\circ$), e la proporzione $\alpha : 360^\circ = f_a : N$: tutto sta nella 26. Il link alla lezione 52 (intervalli) è in un `ad-note` che si può saltare e non è un prerequisito: le classi sono spiegate a parole. L'angolo giro di $360^\circ$ è dato per noto dalla scuola media.

## Per il generatore

1. Riconoscere il tipo di carattere: qualitativo, quantitativo discreto o continuo (anche il caso del numero che non è una quantità, come il CAP).
2. Frequenze da un elenco di dati: contare le frequenze assolute di un carattere con 3-5 modalità e $N$ "comodo" ($20$, $25$, $40$, $50$), poi relative e percentuali.
3. Frequenze cumulate di un carattere quantitativo discreto, e lettura ("quanti hanno al massimo…", "che percentuale ha meno di…").
4. Dati in classi: dato un elenco di valori e le classi $a \vdash b$, contare le frequenze con i dati sul confine; percentuali arrotondate a un decimale.
5. Angoli dell'aerogramma dalle frequenze ($f_r \cdot 360^\circ$), con $N$ divisore di $360$ perché gli angoli vengano interi.
6. Cammino inverso: dagli angoli dei settori (o dalle percentuali) e da $N$, le frequenze assolute.
