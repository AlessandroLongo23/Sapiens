# Note: Composizione e funzione inversa

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: le composte degli esempi 2-5 e del negozio (in entrambi gli ordini, con i valori in $3$, $2$, $1$ e $50$), il prodotto $g(x) \cdot f(x)$ dell'avviso, le inverse degli esempi 7-10 e di $ax + b$ (con `solve` e con la verifica $f(f^{-1}(x)) = f^{-1}(f(x)) = x$), i controlli numerici e l'intersezione $(-1, -1)$ tra $2x + 1$ e la sua inversa.

## Scelte di convenzione

- $g \circ f$ letto "g composto f", definito come $(g \circ f)(x) = g(f(x))$, con la regola "agisce prima quella a destra". È la convenzione di tutti i libri italiani che ho presente.
- Condizione per comporre: "l'immagine di $f$ è contenuta nel dominio di $g$". Alcuni libri chiedono "codominio di $f$ contenuto nel dominio di $g$", che è più forte; la lezione dice che con $f: A \to B$ e $g: B \to C$ la condizione è automatica, così vanno bene entrambe le letture. L'esempio 5 ($\frac{1}{x - 2}$) mostra il caso in cui non vale e usa "C.E.: $x \neq 2$" con il link alla 46.
- Identità scritta $\mathrm{id}_A$ e chiamata "funzione identità". Alcuni libri dicono "funzione identica" e scrivono $i_A$ o $I$: da allineare con il libro in uso se serve.
- Inversa: $f^{-1}$, letto "f alla meno uno" o "inversa di f", definita con $f^{-1}(y) = x \iff f(x) = y$. La lezione 18 scrive l'inversa come $f^{-1}(y) = \frac{y - 1}{2}$; qui il procedimento ha un passo "scambia le lettere" e spiega che $f^{-1}(y)$ e $f^{-1}(x)$ sono la stessa funzione, così le due lezioni non si contraddicono.
- L'immagine si chiama "immagine di $f$" a parole, senza simbolo: la 18 usa $\mathrm{Im}(f)$, la 43 potrebbe usare $f(A)$ (il brief di lotto dice "insieme immagine f(A)"). Conviene che 18 e 43 scelgano un simbolo solo.
- La formula $f^{-1}(x) = \frac{x - b}{a}$ è nella lezione e nel formulario, ma la lezione dice di usare il procedimento e non la formula.
- Composizione non commutativa mostrata in tre modi: formule diverse (negozio, esempi 2 e 3), una delle due non definita (esempio 1), e un caso in cui le due coincidono ($x + 2$ e $x + 3$) per non far credere che siano sempre diverse.
- Non ho parlato di proprietà associativa della composizione né dell'inversa di una composta, $(g \circ f)^{-1} = f^{-1} \circ g^{-1}$: fuori dal brief e rare nel biennio. Se servono, una nota `ad-note` in fondo.

## Lasciato ad altre lezioni

- Perché servono iniettività e suriettività per l'inversa: un paragrafo di richiamo e il link alla 18.
- Dominio, codominio e immagine: link alla 43. Grafico per punti: link alla 42.
- Ricavare $x$: link a Equazioni di primo grado intere (16). Le formule inverse della fisica (ricavare una lettera) sono nella 50; non le ho linkate per non allargare.
- Inverse non lineari: nessuna. La radice quadrata come inversa di $x^2$ su $[0, +\infty)$ resta nella 18.
- Simmetria rispetto alla bisettrice solo a livello intuitivo ("specchio"), senza dimostrazione: il piano cartesiano ha la sua lezione al secondo anno. La frase "la retta $y = 4 - x$ è perpendicolare alla bisettrice" dell'ultimo paragrafo usa una nozione del secondo anno; si può togliere senza danni.

## Da cambiare in lezioni già scritte

Lezione 18 (Funzioni iniettive, suriettive e biettive), sezione "Funzioni biettive e funzioni inverse". Propongo di ridurla così:

- tenere la definizione di invertibile, l'equivalenza "$f$ è invertibile $\iff$ $f$ è biettiva" e il paragrafo che spiega perché servono entrambe le condizioni: è il punto di arrivo naturale della 18;
- togliere il paragrafo "Per trovare l'inversa di una funzione biettiva si risolve $y = f(x)$...", tranne il caso $x^2 \to \sqrt{y}$ se si vuole tenerlo come esempio di restrizione del dominio, e sostituirlo con una frase: "Come si trova l'inversa, come si compone con $f$ e com'è fatto il suo grafico è spiegato in [Composizione e funzione inversa](...)";
- nel formulario della 18, la sezione "Funzione inversa" può restare con la sola equivalenza, togliendo il calcolo di $f^{-1}(y)$ per $2x + 1$ (ora nel formulario 44);
- la carta `inversa-lineare` della 18 ($f^{-1}(y) = \frac{y - 1}{2}$ per $2x + 1$) doppia la carta `inversa-lineare-conto` di qui: la toglierei dalla 18, oppure la terrei con la risposta scritta anche come $f^{-1}(x) = \frac{x - 1}{2}$. Il suo id è già pubblicato, quindi la scelta va fatta sapendo che toglierla cancella i progressi legati a quella carta.

## Figure

Tre, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro:

- `composizione-funzioni-insiemi-finiti` (261×201), nell'esempio 1: tre ellissi $A$, $B$, $C$ con le frecce di $f$ e di $g$, le etichette $A\ f\ B\ g\ C$ sulla stessa riga. È la figura più larga dentro un riquadro: a 280 px ci sta, ma di poco.
- `funzione-inversa-insiemi-finiti` (170×172), nell'esempio 6: le frecce rovesciate da $B$ ad $A$, stesso stile dei diagrammi della 18. La funzione $f$ di partenza è la stessa della figura `funzione-biettiva` della 18.
- `grafico-funzione-inversa-bisettrice` (254×236): $2x + 1$ in `blue!70`, l'inversa in `orange!80`, la bisettrice tratteggiata, i punti $(1, 3)$ e $(3, 1)$ uniti da un segmento puntinato, il punto $(-1, -1)$ senza etichetta. Nessun riempimento, nessun `\clip`. Non l'ho vista sul sito in tema scuro.

Nessuna figura nel formulario.

## Formulario e flashcard

- Il formulario non ha figure; i tre avvisi sono ordine della composizione, prodotto al posto della composizione, inversa scambiata con il reciproco.
- 19 carte. Tutte usano esempi della lezione.

## Prerequisiti

La riga di oggi è `composizione-di-funzioni <- funzioni-iniettive-suriettive-biettive`. La terrei, e aggiungerei `equazioni-primo-grado`:

`composizione-di-funzioni <- funzioni-iniettive-suriettive-biettive, equazioni-primo-grado`

Il perché: il procedimento per l'inversa di $ax + b$ è risolvere un'equazione di primo grado in $x$ con $y$ come termine noto (esempi 7-9, con segni negativi e coefficienti frazionari), e senza saperlo lo studente non segue la metà della lezione. Nell'albero il capitolo Relazioni e funzioni viene prima delle equazioni: con l'arco nuovo la lezione si sblocca solo dopo le equazioni, come succede nei libri che mettono le funzioni inverse dopo le equazioni. In alternativa, se si vuole la lezione nel capitolo delle funzioni senza aspettare, va segnato tra i "Dubbi da sciogliere". Gli esempi 2 e 3 sviluppano $(2x + 1)^2$ e $(x - 1)^2$ (prodotti notevoli), ma è un conto di contorno: non lo metterei come prerequisito.

## Per il generatore

1. Composta con insiemi finiti: date le frecce di $f$ e di $g$, trovare $(g \circ f)(x)$ per ogni $x$, e dire se $f \circ g$ si può fare.
2. Composta in un punto, per passi: $f(x) = 2x + 1$, $g(x) = x^2$, calcolare $(g \circ f)(3)$ e $(f \circ g)(3)$.
3. Formula della composta con funzioni lineari, nei due ordini e con sé stessa: $f(x) = 3x - 1$, $(f \circ f)(x) = 9x - 4$.
4. Formula della composta con un quadrato o con la $x$ due volte: $g(x) = x^2 - 3x$, $f(x) = x - 1$, $(g \circ f)(x) = x^2 - 5x + 4$.
5. Inversa di una funzione lineare con coefficienti interi, anche negativi: $f(x) = -2x + 5$, $f^{-1}(x) = \frac{5 - x}{2}$.
6. Inversa con coefficienti frazionari e controllo con la composizione: $f(x) = \frac{2}{3}x - 4$, $f^{-1}(x) = \frac{3}{2}x + 6$.
7. Riconoscere: la funzione è invertibile? ($a = 0$, oppure $2x$ da $\mathbb{Z}$ a $\mathbb{Z}$), e punti del grafico dell'inversa: se $(p, q)$ sta sul grafico di $f$, quale punto sta su quello di $f^{-1}$.
