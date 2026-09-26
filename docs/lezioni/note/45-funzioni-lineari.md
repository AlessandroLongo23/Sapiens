# Note: Proporzionalità diretta e inversa

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `45-check.py` nello scratchpad del lotto): le tabelle delle mele e del viaggio, i sei esempi sulle tabelle (rapporti, prodotti, rapporti con $x^2$, aumenti), i quattro problemi, i controesempi degli avvisi e le carte con un conto.

## Scelte di convenzione

- Lo slug è `funzioni-lineari` ma il titolo e l'URL sono "Proporzionalità diretta e inversa". La funzione lineare $y = mx + q$ è un cenno in una sezione sua, come chiede il brief. Se lo slug resta, conviene che il titolo non cambi: la lezione è sulla proporzionalità.
- "Funzione lineare" per $y = mx + q$ con $q$ qualsiasi, come nei libri del biennio (e come già fanno la 18, esempio 4, e la 44 per $2x + 1$). Alcuni testi chiamano lineare solo $y = mx$ e "affine" $y = mx + q$: non l'ho citato. Da verificare con il libro in uso.
- Lettere: $y = kx$ e $y = \dfrac{k}{x}$ con $k$ "costante di proporzionalità" (con $k \neq 0$); $y = mx + q$ per la funzione lineare, con le lettere della retta del secondo anno. La 44 scrive $f(x) = ax + b$ per l'inversa di una funzione lineare: le due lezioni usano lettere diverse per la stessa forma. Non è un errore, ma se si vuole uniformare, la scelta più comoda per il seguito è $mx + q$.
- Proporzionalità diretta definita dal rapporto costante ($x \neq 0$), inversa dal prodotto costante ($x, y \neq 0$), quadratica da $\dfrac{y}{x^2}$ costante. Nella diretta $k$ può essere negativo (una delle rette della figura ha $k = -1$); nei problemi concreti $k$ è positivo, e la lezione lo dice.
- Il grafico di $y = \dfrac{k}{x}$ è mostrato solo per $x > 0$ e chiamato "ramo di iperbole"; l'altro ramo e il nome "iperbole equilatera" sono in un riquadro `ad-note` con il link alla lezione del terzo anno. Il riquadro si può togliere senza toccare il resto.
- Nella sezione sulle tabelle il procedimento controlla in ordine rapporto, prodotto, rapporto con il quadrato, aumenti. Per la funzione lineare ho usato "il rapporto tra l'aumento di $y$ e l'aumento di $x$", senza la parola "coefficiente angolare" né il simbolo $\Delta$, che arrivano con la retta. L'esempio 5 ha i valori di $x$ non equidistanti apposta.
- Problemi: il metodo è "calcola $k$, poi usa la formula"; la proporzione compare solo come controllo (esempio 1) e nell'avviso sulla proporzione diretta usata nei problemi inversi, dove mostro la proporzione giusta $6 : 4 = x : 10$. "Giorni di lavoro di un operaio" per il prodotto operai per giorni, senza il termine "giornate-uomo".
- Unità nelle figure scritte "euro" e non "€", perché il simbolo non passa dal compilatore TikZ.

## Lasciato ad altre lezioni

- Piano cartesiano: link a Definizione di funzione (42), che ha la sezione "Il piano cartesiano in breve". Non rispiego gli assi.
- Retta, coefficiente angolare e ordinata all'origine: solo il link a Equazione della retta e casi particolari. Parabola: una frase e il link a La parabola nel piano cartesiano. Iperbole: link a Iperbole equilatera e funzione omografica.
- Proporzioni e proprietà fondamentale: link a Rapporti, proporzioni e percentuali (26). Impostare un'equazione: una riga in fondo con il link a Problemi con le equazioni (51).
- Proporzionalità inversa al quadrato ($y = \dfrac{k}{x^2}$) e proporzionalità composta (tre grandezze, come operai, giorni e ore al giorno): non trattate. La composta è nei libri e in qualche verifica; se si vuole, sta bene come ultimo esempio della sezione sui problemi.

## Da togliere o controllare in lezioni già scritte

- La 26 (Rapporti, proporzioni e percentuali), sezione "Problemi con le proporzioni": definisce di passaggio le grandezze direttamente proporzionali ("due grandezze che crescono insieme nello stesso rapporto") e ha l'avviso "Grandezze che non sono direttamente proporzionali" con il link a questa lezione. Può restare così: è una buona anticipazione. Solo la frase "crescono insieme nello stesso rapporto" è vicina all'errore che questa lezione segnala ("Crescere insieme non basta"); la correggerei in "il cui rapporto resta costante", che è la definizione.
- Nessun'altra lezione scritta tratta la proporzionalità.

## Figure

Quattro, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro come PNG: etichette leggibili, niente sovrapposizioni (nella seconda ho spostato le etichette negative degli assi dall'altro lato perché le rette ci passavano sopra). Linee in `blue!70!black`, `teal!70!black`, `red!60!black` e `gray`, che nel tema scuro diventano tinte chiare; niente `\clip`, niente riempimenti. Non le ho viste sul sito in tema scuro.

- `proporzionalita-diretta-prezzo-mele` (304×251): i punti della tabella sulla semiretta $y = 2{,}4x$, con il tratteggio per $x = 3$.
- `rette-per-origine-y-uguale-kx` (273×256): $y = 2x$, $y = \frac{1}{2}x$, $y = -x$.
- `proporzionalita-inversa-velocita-tempo` (346×219): $t = \dfrac{120}{v}$ con i cinque punti della tabella. Le due scale sono diverse (x 0,05, y 0,6), quindi i punti sono ellissi che compaiono come cerchi.
- `funzione-lineare-taxi` (312×239): $y = 1{,}2x + 3$ e $y = 1{,}2x$ parallele.

La proporzionalità quadratica non ha figura: il testo non la cita e rimanda alla lezione sulla parabola. Se si vuole, un grafico di $y = x^2$ per $x \geq 0$ con i punti $(1, 1)$, $(2, 4)$, $(3, 9)$ sarebbe il complemento naturale.

## Formulario e flashcard

- Il formulario non ha figure. Il terzo avviso ("Il quadrato dimenticato") riprende l'esempio della pizza, che nella lezione è un esempio e non un riquadro `ad-warning`.
- 18 carte. La carta `diretta-costante-conto` usa il pane ($4$ kg a $10$ €) e `problema-velocita` usa $60$ km/h per $2$ ore: numeri che non sono nella lezione, con le regole della lezione.

## Prerequisiti

La riga `funzioni-lineari <- definizione-funzione, numeri-razionali-proporzioni` va bene così. Definizione di funzione porta la notazione $y = f(x)$, la tabella di valori e il piano cartesiano in breve, che servono per i grafici; la 26 porta rapporto, proporzione e i primi problemi con le grandezze proporzionali. Il dubbio in "Dubbi da sciogliere" (i grafici nel piano cartesiano, lezione del secondo anno) si scioglie con la 42: la lezione usa solo il poco di piano cartesiano che la 42 spiega, e rimanda alla lezione del secondo anno per la retta. Proporrei di togliere quella voce dai dubbi, o di riscriverla come "risolto: il piano cartesiano minimo è in Definizione di funzione". Le equazioni non servono: i problemi si risolvono con una moltiplicazione o una divisione.

## Per il generatore

1. Riconoscere il tipo da due grandezze descritte a parole (prezzo e quantità, velocità e tempo, lato e area, taxi): diretta, inversa, quadratica, lineare non proporzionale.
2. Completare una tabella di proporzionalità diretta o inversa: dati una coppia e $k$ da ricavare, trovare i valori mancanti, anche decimali ($x = 2$, $y = 3$; $x = 5$, $y = ?$).
3. Scrivere la formula da una tabella: diretta o inversa, con $k$ intero o decimale ($y = 1{,}5x$, $y = \dfrac{36}{x}$).
4. Riconoscere il tipo da una tabella con tutti e cinque i casi (diretta, inversa, quadratica, lineare, nessuno), con la tabella trappola in cui solo le prime due coppie tornano.
5. Funzione lineare da una tabella, anche con i valori di $x$ non equidistanti: trovare $m$ e $q$ ($x = 1, 3, 4, 6$, $y = 4, 10, 13, 19$, quindi $y = 3x + 1$).
6. Problemi di una riga con diretta e inversa (quaderni, velocità, operai), con risultato decimale o con il tempo in ore e minuti ($2$ ore e mezza $= 2{,}5$ ore).
7. Problemi in due tempi (operai che cambiano a metà lavoro) o con la proporzionalità quadratica (pizza con il diametro $1{,}5$ volte più grande).
