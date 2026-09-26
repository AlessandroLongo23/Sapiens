# Note: Punti notevoli del triangolo

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: gli angoli $\widehat{BHC} = 110^\circ$ e $\widehat{BIC} = 125^\circ$ sul triangolo $70^\circ$, $50^\circ$, $60^\circ$ costruito con `sympy.geometry` (ortocentro e incentro calcolati, angoli misurati), le formule generali $90^\circ + \hat{A}/2$ e $180^\circ - \hat{A}$, il rapporto $AG : GM = 2$, i conti degli esempi 2, 4 e 6, e le posizioni di ortocentro e circocentro nei triangoli rettangolo, ottusangolo ed equilatero usati nelle figure ($R = 2r$ nell'equilatero).

## Scelte di convenzione

- Nomi: ortocentro $H$, baricentro $G$, circocentro $O$, incentro $I$; piedi delle altezze $D$, $E$, $F$; punti medi $M$ (su $BC$), $N$ (su $CA$), $L$ (su $AB$). $L$ al posto di $P$ perché $P$ è il punto generico delle dimostrazioni sui luoghi. I libri variano (alcuni usano $M_a$, $M_b$, $M_c$): da verificare con il libro in uso.
- "Circonferenza inscritta" e "circonferenza circoscritta", non "cerchio inscritto" come nel brief: il cerchio è la parte di piano, e i libri parlano di circonferenza. La parola "tangente" non compare: dico che la circonferenza "tocca ogni lato in un solo punto", perché la lezione su circonferenza e tangenti non è ancora scritta.
- Altezza definita come segmento verso la retta del lato (non verso il lato), per coprire il triangolo ottusangolo. L'ortocentro è il punto comune alle altezze "o alle rette che le contengono".
- Bisettrice di un triangolo come segmento dal vertice al lato opposto; bisettrice di un angolo come semiretta (con link alla 58).
- La bisettrice come luogo è detta per i "punti dell'angolo": i punti equidistanti dalle due rette dei lati sono anche quelli dell'altra bisettrice (angolo adiacente), che non ho nominato.
- Grassetti: 11, tutti su termini definiti.

## Cosa è dimostrato e cosa solo enunciato

- Dimostrati: asse come luogo (le due direzioni, primo e terzo criterio), bisettrice come luogo nella direzione diretta (secondo criterio dopo aver ricavato il terzo angolo con la somma $180^\circ$), incontro degli assi nel circocentro, incontro delle bisettrici nell'incentro, e nel triangolo isoscele che la bisettrice dell'angolo al vertice è mediana e altezza.
- Solo enunciati: l'incontro delle altezze ("la dimostrazione usa i parallelogrammi") e delle mediane con la proprietà $2 : 1$ ("strumenti che arrivano più avanti", cioè il teorema dei punti medi); la direzione inversa della bisettrice come luogo (serve il criterio di congruenza dei triangoli rettangoli, che forse la 59 non ha: da controllare quando la 59 è scritta, e se c'è la dimostrazione si può aggiungere in quattro righe); il circocentro nel punto medio dell'ipotenusa (link alla 62, "usa le diagonali del rettangolo": la 62 dovrebbe dire che le diagonali del rettangolo sono congruenti e si dividono a metà, e allora la conseguenza è immediata); la posizione del circocentro nell'ottusangolo.
- Nella dimostrazione degli assi dico che gli assi di $AB$ e $BC$ si incontrano "perché $AB$ e $BC$ non sono paralleli", senza spiegare che rette perpendicolari a rette incidenti sono incidenti. Mi sembra un dettaglio da non esplicitare al biennio.
- Le dimostrazioni sui luoghi sono in elenchi numerati nel testo; solo quella sull'isoscele è in un riquadro `ad-example` con ipotesi e tesi. Se la 59 fissa un formato diverso per le dimostrazioni (per esempio una tabella affermazione/giustificazione), conviene allinearle.

## Lasciato ad altre lezioni

- Criteri di congruenza, triangolo isoscele, somma degli angoli, perpendicolare, distanza punto-retta, definizione di asse: link a 59 e 60, non rispiegati. La definizione di asse è ripetuta in una riga perché serve subito.
- Retta di Eulero, excentri, teorema della bisettrice (divide il lato opposto in parti proporzionali): esclusi, non sono nel programma di questa lezione.
- Formule dei raggi con l'area ($r = 2S/p$...): escluse, servono le aree.

## Da controllare in lezioni già scritte o del lotto

- 59: se dimostra gli angoli alla base dell'isoscele con la bisettrice e il primo criterio, la mia dimostrazione "la bisettrice è mediana e altezza" ne ripete metà. Non è un problema, ma si può accorciare con un rimando.
- 60: se definisce l'asse e ne dimostra già la proprietà di equidistanza, la sezione "L'asse di un segmento" qui si può ridurre al solo enunciato con link. Il brief assegna i luoghi a questa lezione, quindi li ho dimostrati.
- 62: deve contenere le diagonali del rettangolo congruenti, a cui rimando per l'ipotenusa.

## Figure

Tredici figure TikZ, calcolate con uno script Python (coordinate di piedi, punti medi, centri e raggi esatti al centesimo) e compilate con `compileFigure` di `scripts/figure/compile.mjs`: tutte tra 194 e 234 px di larghezza, quindi entrano anche nei riquadri. Le ho guardate in PNG nel tema chiaro, non sul sito in tema scuro. Colori: riempimento `blue!8`, linee notevoli `blue!70!black`, circonferenze `orange!80!black`; niente `\clip`, niente bianco.

altezze-ortocentro-acutangolo, ortocentro-ottusangolo, esempio-angolo-bhc, mediane-baricentro, asse-segmento-equidistanza, bisettrice-angolo-equidistanza, assi-circocentro, bisettrici-incentro, esempio-angolo-bic, triangolo-rettangolo-ortocentro-circocentro, circocentro-ottusangolo, isoscele-bisettrice-altezza-mediana, equilatero-punti-coincidenti.

Nella figura `ortocentro-ottusangolo` l'etichetta $D$ tocca il tratteggio del prolungamento di $BC$: leggibile, ma da guardare sul sito. Il formulario non ha figure: le tabelle bastano.

## Formulario e flashcard

- Il formulario ha due tabelle a quattro colonne: sul telefono potrebbero scorrere di lato. Se è così, la prima si può spezzare in quattro righe di elenco.
- Formulario e carte riportano $\widehat{BIC} = 90^\circ + \hat{A}/2$ e $\widehat{BHC} = 180^\circ - \hat{A}$ (acutangolo), che la lezione ricava solo alla fine degli esempi 1 e 3: se si preferisce tenerli come risultati di esempio, vanno tolti dal formulario e la carta `angolo-bic-conto` va cambiata.
- 20 carte.

## Prerequisiti

La riga `geometria-punti-notevoli <- geometria-perpendicolari-parallele` va bene così. La lezione usa perpendicolari, distanza punto-retta, asse e somma degli angoli (dalla 60) e i criteri di congruenza e il triangolo isoscele (dalla 59), che arrivano attraverso la 60 e non serve un arco diretto. La 62 è solo linkata per un'affermazione enunciata, non è un prerequisito.

## Per il generatore

1. Riconoscere il punto notevole dalla proprietà o dalla costruzione: "equidistante dai vertici", "incontro delle mediane", "centro della circonferenza inscritta".
2. Baricentro e mediana: dati $AM$ o $GM$ o $AG$, trovare le altre due lunghezze (anche con decimali: $GM = 3{,}5$).
3. Dove cade il punto: dato il tipo di triangolo (o i tre angoli), dire se ortocentro e circocentro sono interni, esterni, su un vertice o sul punto medio dell'ipotenusa.
4. Triangolo rettangolo: data l'ipotenusa, raggio della circoscritta, mediana relativa all'ipotenusa e distanza del baricentro dal vertice dell'angolo retto.
5. Angolo tra due bisettrici, $\widehat{BIC}$, dati due angoli del triangolo.
6. Angolo tra due altezze, $\widehat{BHC}$, in un triangolo acutangolo dati due angoli.
7. Triangolo equilatero: data l'altezza (o un raggio), i raggi della inscritta e della circoscritta.
