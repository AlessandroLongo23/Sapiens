# Note: Il piano cartesiano: distanza e punto medio

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `80-verifica.py` nello scratchpad: `sqrt`, `radsimp`, `solve`, `Point.distance`, `Polygon.area`, `Line.is_parallel`): le distanze della figura orizzontale e verticale ($7$ e $4$) e di quella con il teorema di Pitagora ($5$), gli esempi 2 ($6\sqrt{2} \approx 8{,}49$), 3 ($\frac{\sqrt{97}}{6}$, $97$ primo) e 4 ($x = -2$ e $x = 4$), i punti medi degli esempi 5 e 6 e dell'avviso ($\frac{1}{2}, 1$), il simmetrico $A'(5, -2)$, il baricentro $G(2, 1)$ anche per la via delle mediane, gli esempi 7 (lati $4$, $2\sqrt{5}$, $2\sqrt{5}$, perimetro $4 + 4\sqrt{5}$, area $8$), 8 (quadrati $20$, $5$, $25$, prodotto scalare nullo in $B$, area $5$) e 9 ($D(-1, 2)$, stesso punto medio $M(1, 1)$ delle diagonali, lati opposti paralleli, $\overline{AC}^{\,2} = 52$ e $\overline{BD}^{\,2} = 20$), il vertice $(-3, -4)$ dell'avviso sull'ordine dei vertici e le risposte di tutte le carte. Le figure le ho controllate punto per punto contro gli stessi conti (il segno dell'angolo retto nella figura dell'esempio 8 è costruito sui versori di $BA$ e $BC$). La larghezza delle formule in evidenza è misurata con KaTeX in Chromium a 17 px: la più larga è 246 px ($M\left(\frac{-2 + 4}{2}, \frac{-1 + 3}{2}\right) = M(1, 1)$, nel riquadro dell'esempio 9); la formula della distanza, in `gathered` su due righe, è 204 px. `check.mts` passa sui tre file.

## Scelte di convenzione

- Distanza $\overline{AB}$, scritta in `80-convenzioni.md` all'inizio del lavoro; 82, 83 e 85 si sono allineate (la 85 usa $d(P, r)$ per la distanza punto-retta). La lezione 58 invece scrive $AB = 8$ cm per la lunghezza e cita $\overline{AB}$ come variante: in geometria analitica i libri usano quasi tutti $\overline{AB}$, ma è un'incoerenza tra le due lezioni. Il quadrato si scrive $\overline{AB}^{\,2}$.
- Punti $A(2, -3)$ con la virgola, coordinate non intere con le frazioni; la lezione lo dice nell'esempio 5 con il perché (la virgola decimale). Da verificare con il libro in uso: alcuni libri scrivono $A(1{,}5; 2)$ con il punto e virgola.
- Coordinate $x_A$, $y_A$; punto medio $M$; simmetrico con l'apice, $A'$; baricentro $G$ come nella 61.
- Quadranti numerati in senso antiorario da quello in alto a destra, in parole e in numeri romani nella tabella e nella figura. I punti degli assi non stanno in nessun quadrante: detto esplicitamente.
- "Asse $x$" e "asse $y$" come termini principali, "asse delle ascisse" e "delle ordinate" citati una volta nella definizione.
- Il punto medio è giustificato proiettando sull'asse $x$ e citando il teorema di Talete senza link (la lezione non è ancora scritta) e senza dimostrarlo. Il teorema di Pitagora è usato senza link, come chiede il brief; il suo inverso è enunciato tra parentesi nella sezione sui triangoli.
- Per confrontare i lati e le diagonali uso i quadrati delle distanze (esempi 8 e 9), e nell'esempio 4 l'equazione è scritta con i quadrati per non avere la radice. Lo dico nel testo.
- L'esempio 4 porta a $(x - 1)^2 = 9$, risolta con "i numeri che al quadrato danno $9$ sono $3$ e $-3$", senza la formula risolutiva e senza link alla 17.

## Lasciato ad altre lezioni

- Equazioni degli assi, delle rette orizzontali e verticali e delle bisettrici: 81, con link. Per questo il simmetrico rispetto alla bisettrice $y = x$ non c'è.
- Asse di un segmento e punti equidistanti da due punti: 83 (che linka la 80 per il punto medio). L'esempio 4 è un punto a distanza data, non equidistante.
- Parallelismo con i coefficienti angolari: 82 e 83. Il parallelogramma dell'esempio 9 si riconosce con le diagonali (criterio della 62, con link), senza coefficienti angolari.
- Area di un triangolo qualsiasi: 84 e 85. Qui ci sono solo aree con l'altezza verticale (esempio 7) o con i cateti (esempio 8).
- Baricentro: in un riquadro `ad-note`, formula e un controllo con la proprietà delle mediane della 61, senza dimostrazione. Non ci sono altri punti notevoli.

## Figure

Nove, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` (script `80-fig.mjs`) e guardate in chiaro e con il filtro del tema scuro (`80-png.mjs`, anteprima `80-all.png`):
- `piano-cartesiano-coordinate-punti` (243×198): griglia, numeri sugli assi, $A(3, 2)$ con le proiezioni, $B$, $C$, $D$ nei quattro quadranti.
- `quadranti-segni-coordinate` (208×181).
- `distanza-segmento-orizzontale-verticale` (223×175).
- `distanza-due-punti-teorema-pitagora` (234×186): triangolo $AHB$ con il segno dell'angolo retto.
- `punti-asse-x-a-distanza-data` (204×166), nell'esempio 4.
- `punto-medio-segmento-proiezioni` (243×161).
- `simmetrici-rispetto-assi-e-origine` (266×183).
- `triangolo-rettangolo-dalle-coordinate` (177×145), nell'esempio 8.
- `parallelogramma-quarto-vertice` (171×133), nell'esempio 9.

Griglia `gray!25, very thin`, segmenti `blue!60`, riempimenti `blue!8`, punti neri, come le altre lezioni del lotto (note di convenzioni di 82 e 87). Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`. Non le ho viste sul sito.

## Formulario e flashcard

- Il formulario non ha figure; tre avvisi (segno meno, radice di una somma, coordinata che cambia nella simmetria).
- 20 carte nell'ordine della lezione. `simmetrico-asse-y` usa $(-5, 1)$, che non è nella lezione ma applica la regola della sezione.

## Prerequisiti

La riga `il-piano-cartesiano <- radicali-operazioni, definizione-funzione` va bene così. I radicali servono in tutti gli esempi con la distanza (trasporto fuori: $\sqrt{72} = 6\sqrt{2}$, $\sqrt{20} = 2\sqrt{5}$; prodotto $\sqrt{20} \cdot \sqrt{5}$), e attraverso la 73 arrivano anche il valore assoluto e le frazioni. La 42 è dove lo studente ha visto il piano per la prima volta e la lezione la cita nell'apertura; a rigore la 80 riparte da capo, ma tenerla dà l'ordine giusto nel grafo. La lezione usa anche i criteri del parallelogramma della 62 (esempio 9) e il baricentro della 61 (riquadro `ad-note`): sono applicazioni con il link e la regola scritta nel testo, quindi non le aggiungerei.

## Da cambiare nelle lezioni già scritte

Niente di obbligatorio. La 42 ("Il piano cartesiano in breve") usa gli stessi nomi (asse $x$, asse $y$, origine $O$, ascissa, ordinata) e linka già la 80. L'unica incoerenza è la notazione della lunghezza nella 58 ($AB = 8$ cm, con $\overline{AB}$ citato come variante): se si decide per $\overline{AB}$ ovunque, nella 58 alla riga 186 basta invertire l'ordine, "Per la lunghezza si scrive $\overline{AB}$ (molti libri scrivono anche solo $AB$)", ma poi andrebbero cambiate anche le lunghezze nelle lezioni 58-62. Io lascerei la 58 com'è: in geometria euclidea $AB$ è comune.

## Per il generatore

1. Coordinate e quadranti: dire in quale quadrante o su quale asse sta un punto, con coordinate intere, frazioni e radicali ($-\sqrt{2}$).
2. Distanza tra due punti sulla stessa orizzontale o verticale, con i segni: $A(-3, 2)$, $B(4, 2)$.
3. Distanza nel caso generale con risultato intero (terne pitagoriche) o radicale ridotto ($6\sqrt{2}$), anche con coordinate frazionarie ($\frac{\sqrt{97}}{6}$).
4. Punti di un asse a distanza data da un punto: $(x - 1)^2 + 16 = 25$, due soluzioni (o una sola, o nessuna, se si vuole un livello in più).
5. Punto medio ed estremo dal punto medio, con risultati frazionari.
6. Simmetrici rispetto all'asse $x$, all'asse $y$, all'origine e a un punto; baricentro.
7. Problemi sui poligoni: perimetro, tipo di triangolo (isoscele, rettangolo, con i quadrati dei lati), quarto vertice di un parallelogramma e controllo del rettangolo con le diagonali.

Il controllo deve pretendere il radicale ridotto ($6\sqrt{2}$, non $\sqrt{72}$) e le frazioni per le coordinate non intere. Buoni distrattori: $4 - 3 = 1$ al posto di $4 - (-3)$, $\sqrt{a^2 + b^2} = a + b$, la media tra $A$ e $M$ al posto dell'estremo, la coordinata sbagliata cambiata nella simmetria.

## Domande per Andrea

- Distanza tra due punti: ho scritto $\overline{AB}$ (quasi tutti i libri di geometria analitica); la lezione 58 scrive la lunghezza come $AB$ e cita $\overline{AB}$ come variante. Va bene avere le due notazioni, una per la geometria euclidea e una per la analitica, o si uniforma?
- Coordinate non intere: ho scelto la virgola tra le coordinate e le frazioni, $M\left(\frac{3}{2}, \frac{1}{2}\right)$, per non confondere la virgola decimale; alcuni libri scrivono $(1{,}5; 0{,}5)$ con il punto e virgola. Quale usa la tua classe?
- Il punto medio è giustificato con la proiezione sull'asse $x$ e "lo garantisce il teorema di Talete", senza dimostrazione; l'alternativa è dimostrarlo con due triangoli congruenti, più lungo. Basta la citazione?
- Il baricentro con la formula $\frac{x_A + x_B + x_C}{3}$ è in un riquadro che si può saltare, senza dimostrazione. Lo tieni lì, lo sposti nel programma di una lezione successiva o lo togli?
- I punti degli assi "non appartengono a nessun quadrante": è la scelta dei libri più diffusi, ma qualcuno li assegna ai quadranti che li delimitano. Confermi?
