# Note: Relazioni binarie

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti in Python con SymPy (`divisors` e filtri su prodotti cartesiani): le sei coppie della relazione dei divisori su 16 di $A \times B$, le coppie di "minore di" e della sua inversa, l'esempio 1 ($a + b = 6$), l'esempio 2 ($b = a^2$), l'esempio 4 (divisibilità in $\{1, 2, 3, 4\}$, otto coppie), l'esempio 5 ($x \cdot y = 12$ in $\mathbb{N}$), il conto della negazione ($16 - 6 = 10$) e le carte con un conto.

## Scelte di convenzione

- Simbolo $\mathcal{R}$ per la relazione, $a \mathrel{\mathcal{R}} b$ e $(a, b) \in \mathcal{R}$ come notazioni equivalenti, $\mathcal{R}^{-1}$ per l'inversa. La 41 dovrebbe usare lo stesso simbolo.
- Dominio e codominio di una relazione sono l'insieme di partenza e quello di arrivo, come chiede il brief di lotto e come fa la 18 per le funzioni. Molti libri (per esempio la linea Bergamini, da verificare sull'edizione in uso) chiamano invece dominio l'insieme degli elementi di $A$ che hanno almeno un corrispondente e codominio quello degli elementi di $B$ raggiunti, e chiamano "grafico" l'insieme delle coppie. La lezione lo dice in un riquadro `ad-note` e non usa mai "grafico" per l'insieme delle coppie, per non confonderlo con il grafico cartesiano. Da decidere se tenere il riquadro.
- "Corrispondente" per il secondo elemento di una coppia (non "immagine", che resta alle funzioni).
- "Diagramma a frecce" come nome principale, "diagramma sagittale" citato una volta.
- Nella tabella a doppia entrata il segno nelle caselle è $\bullet$, non la croce, per non confonderlo con $\times$ del prodotto cartesiano.
- Nel grafico cartesiano gli assi sono in scala (le distanze tra 2, 3, 5, 7 sono diverse); le coppie di $A \times B$ sono cerchietti grigi vuoti, quelle della relazione punti pieni.
- Lettere: $a, b$ per le relazioni da $A$ a $B$, $x, y$ per le relazioni in un insieme.

## Lasciato ad altre lezioni

- Coppia ordinata e prodotto cartesiano: una riga di richiamo e il link alla 39.
- Proprietà riflessiva, simmetrica, antisimmetrica, transitiva: solo nominate, con il link alla 41. Il cappio è introdotto qui (esempio 4) perché serve a disegnare le relazioni in un insieme; la 41 lo usa per la riflessiva. L'esempio 5 dice che $x \cdot y = 12$ "coincide con la sua inversa" senza chiamarla simmetrica: la parola resta alla 41, che può ripartire da qui.
- Funzione come relazione con un solo corrispondente per ogni elemento: una frase, il link alla 42 e un avviso in fondo.
- Relazione inversa e funzione inversa: la lezione non ne parla. La 44 potrebbe dire che l'inversa di una relazione esiste sempre, mentre l'inversa di una funzione è ancora una funzione solo se la funzione è biettiva, con un link qui.

## Da togliere o controllare in lezioni già scritte

- 03 (Proprietà delle operazioni tra insiemi): nessun intervento in più rispetto a quello che propone la 39.
- 18 (Funzioni iniettive, suriettive e biettive): usa "dominio" e "codominio" come insieme di partenza e di arrivo e "diagramma a frecce", coerenti con questa lezione. Niente da cambiare.
- 04 (Sottoinsiemi e uguaglianza) parla di inclusione: potrebbe citare che "è sottoinsieme di" è una relazione, ma non serve.

## Figure

Cinque, tutte in bianco e nero (nessun riempimento, a parte i punti pieni del grafico e i cerchietti `gray`), niente `\clip`. Le ho compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro; non le ho viste sul sito in tema scuro.

- `diagramma-frecce-relazione-divisore` (170×207): la relazione dei divisori, stesso stile dei diagrammi della 18.
- `grafico-cartesiano-relazione-divisore` (237×235): reticolo di $A \times B$ con le sei coppie in evidenza.
- `diagramma-frecce-relazione-inversa-multiplo` (170×207): l'inversa, con $B$ a sinistra.
- `diagramma-frecce-relazione-quadrato` (170×207), dentro l'esempio 2: lo studente legge le coppie dal disegno.
- `diagramma-frecce-relazione-divisore-in-un-insieme` (163×169), dentro l'esempio 4: un solo ovale, quattro cappi. I cappi sono disegnati con `to[out=…, in=…, looseness=6]` e non con lo stile `loop`; sono piccoli ma leggibili. Se la 41 li disegna più grandi, conviene uniformare.

Le frecce che arrivano a $6$ e a $10$ nel primo e nel terzo diagramma si sovrappongono un poco nella punta, come nella 18.

## Formulario e flashcard

- Il formulario ha una tabella dominio, codominio e coppie con l'esempio dei divisori, e nessuna figura.
- 18 carte. Le carte `coppia-ordine` e `minore-conto` usano insiemi più piccoli di quelli della lezione ($\{2, 3\}$ e $\{6, 9\}$; $\{1, 2, 3\}$); la regola è nella lezione. `divisore-conto` usa gli insiemi dell'avviso "Dimenticare gli insiemi".

## Prerequisiti

La riga `relazioni-binarie <- insiemi-prodotto-cartesiano` va bene così. La definizione è "sottoinsieme di $A \times B$", quindi servono coppia ordinata, prodotto cartesiano e sottoinsieme, e i sottoinsiemi arrivano già attraverso la 39. Gli esempi usano divisori e multipli, ma solo con numeri piccoli e a livello di scuola media: non è un prerequisito. Il grafico cartesiano usa le coordinate di un punto in modo intuitivo, come la 42.

## Per il generatore

1. Coppie da una proprietà, insiemi piccoli: dati $A$, $B$ (3-4 elementi) e una proprietà ("è un divisore di", "$a + b = k$", "$b = 2a$", "$a < b$"), scrivere l'elenco delle coppie.
2. Appartenenza: dire se $(a, b) \in \mathcal{R}$ per alcune coppie, comprese coppie scambiate e coppie fuori da $A \times B$.
3. Da una rappresentazione all'altra: dato il diagramma a frecce, la tabella o il grafico cartesiano (in forma testuale: le coppie segnate), scrivere l'elenco delle coppie e dire quali elementi del dominio non hanno corrispondenti e quali del codominio non sono raggiunti.
4. Dalle coppie alla proprietà: dato l'elenco (per esempio $\{(1, 1), (2, 4), (3, 9)\}$), scegliere tra quattro proprietà quella che lo descrive.
5. Relazione in un insieme: coppie di una relazione in $A$ con 4-5 elementi, contando i cappi (divisibilità, "$x + y$ è pari", "$x \leq y$").
6. Relazione inversa: dalle coppie di $\mathcal{R}$ quelle di $\mathcal{R}^{-1}$, e la proprietà a parole dell'inversa ("è un divisore di" / "è un multiplo di", "è minore di" / "è maggiore di"), con il distrattore della negazione.
