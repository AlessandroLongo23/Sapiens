# Note: Distanza di un punto da una retta

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `85-verifica.py` nello scratchpad): le distanze dei sette esempi sia con la formula sia con `Line.distance` di `sympy.geometry`, le proiezioni con `Line.projection` ($H\left(\frac{14}{5}, \frac{7}{5}\right)$, $H\left(\frac{3}{2}, 0\right)$, $H\left(\frac{19}{5}, \frac{12}{5}\right)$), il sistema dell'esempio 5, la forma implicita alternativa dell'esempio 3, la versione con le frazioni dell'esempio 4, i valori sbagliati degli avvisi ($\frac{6}{\sqrt{5}}$, $\frac{17}{5}$), l'area $9$ dell'esempio 7 anche con `Triangle.area`, la dimostrazione con lettere positive ($\overline{PA} \cdot \overline{PB} / \overline{AB} - \frac{N}{\sqrt{a^2+b^2}} = 0$) e con i numeri ($\frac{10}{3}$, $\frac{5}{2}$, $\frac{25}{6}$), le carte. Nelle figure ho controllato che ogni punto disegnato stia sulla sua retta e che gli estremi dei segmenti delle rette abbiano le coordinate giuste. La formula in evidenza più larga misura 243 px con KaTeX a 17 px (circa 215 px ai 15 px del sito). `check.mts` passa sui tre file senza avvisi.

## Scelte di convenzione (da verificare con il libro in uso)

- Distanza di un punto da una retta scritta $d(P, r)$; tra due punti $\overline{AB}$, come ha deciso la 80 (`80-convenzioni.md`); tra due rette parallele $d(r, s)$. Scritte in `85-convenzioni.md`. Molti libri scrivono solo $d$ nella formula.
- Punto generico $P(x_0, y_0)$, con il pedice $0$ e non $x_P$: è la forma della formula in quasi tutti i libri. Nel resto della lezione i punti hanno coordinate numeriche.
- Rette indicate con $r\colon 3x - 4y + 8 = 0$ (due punti) negli esempi sulle parallele, altrove "la retta $r$ di equazione ...".
- Il piede della perpendicolare si chiama $H$ e "proiezione di $P$ su $r$", con link alla 83 che la tratta.
- Formula diretta per le parallele $\frac{|c - c'|}{\sqrt{a^2 + b^2}}$: non tutti i libri del biennio la danno. È in un solo paragrafo, con l'avviso sui coefficienti da rendere uguali; si toglie senza toccare il resto (resterebbe da togliere la seconda parte dell'esempio 6, una carta e una voce del formulario).

## Lasciato ad altre lezioni

- Distanza tra due punti, valore assoluto sulla stessa verticale: 80 (link).
- Forma implicita ed esplicita: 81 (link). Coefficiente angolare e retta per due punti: 82 (link nell'esempio 5 e nell'area). Perpendicolari e proiezione: 83 (link). Intersezione come sistema: 84 (link nell'esempio 5).
- Razionalizzazione: 74 (link); qui solo $\frac{8}{\sqrt{5}} = \frac{8\sqrt{5}}{5}$ e simili.
- Teorema di Pitagora usato senza link nella dimostrazione, come dice il brief.
- Non ho messo: le bisettrici degli angoli formati da due rette (luogo dei punti equidistanti, con $|..| = |..|$), i punti di una retta a distanza data da un'altra, il valore assoluto con il parametro. Portano a equazioni con il valore assoluto, che hanno una lezione non ancora scritta; di solito i libri le mettono dopo i fasci o nei problemi di riepilogo.
- Il segno di $ax_0 + by_0 + c$ e i semipiani: solo una frase nell'avviso sul valore assoluto.

## Figure

Cinque, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG in chiaro e con il filtro del tema scuro: leggibili in tutti e due. Assi, griglia `gray!25`, rette `blue!60` e `red!50`, punti neri, angoli retti disegnati a mano con tre segmenti.
- `distanza-punto-retta-proiezione` (175×151): $P(4, 3)$, $r\colon 3x + 4y - 14 = 0$, $H\left(\frac{14}{5}, \frac{7}{5}\right)$, $Q(6, -1)$. Fuori dai riquadri; gli stessi dati tornano negli esempi 2 e 5.
- `distanza-punto-rette-parallele-assi` (144×176), nell'esempio 1.
- `distanza-punto-retta-dimostrazione-triangolo` (175×149), nel riquadro della dimostrazione: $A\left(\frac{2}{3}, 3\right)$, $B\left(4, \frac{1}{2}\right)$.
- `distanza-tra-rette-parallele` (155×164), nell'esempio 6.
- `area-triangolo-altezza-distanza` (165×181), nell'esempio 7, triangolo riempito `blue!10`.

Tutte sotto i 280 px. Non viste sul sito. Il formulario non ha figure.

## Formulario e flashcard

- Il formulario segue le sezioni della lezione; la dimostrazione e l'esempio con la proiezione non ci sono. Tre avvisi: forma esplicita, valore assoluto, formula diretta per le parallele.
- 18 carte, tutte su regole ed esempi della lezione.

## Prerequisiti

La riga `distanza-punto-retta <- rette-parallele-tra-loro, radicali-razionalizzazione` va bene così. La definizione usa perpendicolare e proiezione (83), che porta con sé 80, 81 e 82 come antenati; il risultato si razionalizza sempre (74). L'esempio 5 usa l'intersezione di due rette (84), ma è la strada lunga per mostrare da dove viene la formula e il resto si segue senza: non la aggiungerei. Se si vuole la lezione intera coperta, si aggiunge `intersezione-tra-due-rette` (terzo prerequisito, non ridondante con la 83).

## Per il generatore

1. Distanza di un punto da una retta parallela a un asse o da un asse ($y = k$, $x = h$), coordinate intere anche negative.
2. Formula con la retta in forma implicita e risultato intero (terne pitagoriche: $a, b$ tra $(3, 4)$, $(6, 8)$, $(5, 12)$), come l'esempio 2.
3. Retta in forma esplicita da portare in forma implicita, risultato da razionalizzare ($\frac{8\sqrt{5}}{5}$), come l'esempio 3.
4. Coefficienti frazionari e numeratore negativo, come l'esempio 4; in questo livello anche la distanza dall'origine.
5. Distanza tra due rette parallele: verificare il parallelismo, scegliere un punto, calcolare; una delle due equazioni multipla dell'altra nei coefficienti di $x$ e $y$ (esempio 6).
6. Altezza e area di un triangolo dati i vertici, con area intera o frazionaria (esempio 7).

Il controllo del generatore deve confrontare la formula con `Line.distance` di SymPy e verificare che il risultato sia razionalizzato; nel livello 6 anche l'area con `Triangle.area`.

## Da cambiare nelle lezioni già scritte

Niente di necessario. Facoltativo nella 74 (Razionalizzazione), sezione "Perché si razionalizza": dopo il secondo motivo si può aggiungere "Lo userai spesso in geometria analitica, per esempio nella [distanza di un punto da una retta](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/distanza-di-un-punto-da-una-retta), dove i risultati come $\frac{8}{\sqrt{5}}$ si scrivono $\frac{8\sqrt{5}}{5}$."

## Domande per Andrea

- Notazione della distanza punto-retta: ho scelto $d(P, r)$ (con $\overline{PH}$ per il segmento); l'alternativa è la sola $d$ nella formula, senza nome del punto e della retta.
- Formula diretta per la distanza tra rette parallele, $\frac{|c - c'|}{\sqrt{a^2 + b^2}}$: l'ho messa, con l'avviso che le equazioni devono avere gli stessi $a$ e $b$; l'alternativa è insegnare solo il metodo del punto scelto su una retta.
- Dimostrazione della formula: ho scelto quella con il triangolo rettangolo $PAB$ e l'area (niente vettori, niente parametri), in un riquadro che si può saltare, più un esempio numerico con la proiezione; l'alternativa è la dimostrazione generale con la proiezione $H$ trovata con le lettere, più lunga, o nessuna dimostrazione.
- Bisettrici degli angoli tra due rette e punti a distanza data da una retta: li ho lasciati fuori perché richiedono equazioni con il valore assoluto; l'alternativa è aggiungerli qui come ultimo esempio, se nel libro in uso stanno in questo capitolo.
