# Note: Equivalenza e aree

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `verifica.py` (scratchpad `lotto10/98/`), 44 controlli: le conversioni ($3{,}5\ \text{m}^2 = 35\,000\ \text{cm}^2$, $250\ \text{mm}^2 = 2{,}5\ \text{cm}^2$, $120 \cdot 45 = 5400\ \text{cm}^2 = 0{,}54\ \text{m}^2$), ogni area e ogni misura ricavata dall'area (con `solve`), l'apotema del pentagono di lato $10$ ($5 / \tan 36^\circ = 6{,}8819\ldots$, quindi $6{,}88$ e il numero fisso $0{,}688$), l'area esatta $172{,}05$ e quella con l'apotema arrotondato, $172$. Lo stesso script esegue `figs.py`, che controlla numericamente le 17 figure (56 controlli): parallelogrammi con i lati opposti uguali, piedi delle perpendicolari con l'angolo retto, $BE \cong DC$ e $M$ punto medio nella dimostrazione del trapezio, aree uguali tra le figure dichiarate equivalenti, pezzi congruenti nella figura degli equiscomponibili, altezza $BK$ interna al lato $AD$ nell'esempio 2, apotema perpendicolare al lato. Il controllo `check.mts` passa sui tre file senza avvisi. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 172 px (l'area del pentagono).

## Struttura ed esempi

Superfici equivalenti (estensione come concetto primitivo, simbolo, confronto con la congruenza, relazione di equivalenza con link alla 41), somme e differenze come postulati, equiscomponibili con la figura quadrato e triangolo. Poi area e unità di misura, rettangolo e quadrato, conversioni con la tabella. Poi una sezione per figura, ognuna con il teorema di equivalenza e la formula: parallelogramma, triangolo, trapezio, quadrilatero con le diagonali perpendicolari (rombo, quadrato, aquilone), poligono regolare. Tabella riassuntiva e problemi.

Otto esempi svolti:

1. conversioni e rettangolo con misure in unità diverse;
2. parallelogramma con base $12$, lato $10$, altezza $8$: area $96$ e l'altra altezza $9{,}6$;
3. triangolo rettangolo $6$, $8$, $10$: area $24$ e altezza relativa all'ipotenusa $4{,}8$ (ipotenusa data, Pitagora viene dopo);
4. trapezio: altezza $8$ dall'area $60$ e dalle basi $9$ e $6$;
5. rombo: diagonale $12$ dall'area $96$ e dall'altra diagonale $16$;
6. pentagono regolare di lato $10$ e apotema $6{,}88$: area $172$;
7. figura composta (rettangolo $8 \times 5$ e triangolo di altezza $3$): $52$;
8. triangolo equivalente al rettangolo $8 \times 6$, con base $12$: altezza $8$.

Avvisi: equivalente e congruente, il metro quadrato, il lato obliquo al posto dell'altezza, il diviso due, $\frac{d_1 d_2}{2}$ su un quadrilatero qualsiasi, unità diverse nei dati. Un `ad-note` sui numeri fissi.

## Scelte di convenzione (da verificare con il libro in uso)

- Simbolo di equivalenza $\doteq$, il più diffuso nei libri italiani del biennio che ho in mente; alcuni usano $\equiv$, altri scrivono solo l'uguaglianza delle aree. Vedi le domande per Andrea.
- "Estensione" come concetto primitivo e le due proprietà di somma e differenza presentate come postulati "che molti libri prendono come postulati". Non ho messo il postulato di De Zolt (una parte non è equivalente al tutto), che non serve alle dimostrazioni della lezione.
- Unità: le lunghezze scritte "$8$ cm" come nella 62, le aree "$96\ \text{cm}^2$" come nelle 17, 77 e 89 (la 51 usa "cm²" fuori dal LaTeX).
- Perimetro del poligono regolare con $P$ e area $\dfrac{P \cdot a}{2}$. Molti libri italiani scrivono $2p$ per il perimetro e $p$ per il semiperimetro, e danno la formula come $A = p \cdot a$; qui ho evitato $2p$ perché nella 77 $p$ è il prodotto delle soluzioni. Da decidere.
- "Apotema" al maschile ("l'apotema è arrotondato"), come nel dizionario; la 99 nella `% alt` lo usa al femminile ("è segnata l'apotema"): da allineare.
- La base maggiore e minore del trapezio con $B$ e $b$, come la 50.

## Dimostrazioni

Fatte: parallelogramma equivalente al rettangolo (con passi numerati; ho usato le differenze di figure, trapezio $AKCD$ meno un triangolo, così la dimostrazione vale anche quando il piede $H$ cade fuori dalla base); triangolo metà del parallelogramma (in prosa); trapezio equivalente al triangolo con base $B + b$ (passi numerati); quadrilatero con le diagonali perpendicolari metà del rettangolo delle diagonali (in prosa); poligono regolare come somma di $n$ triangoli.

Omesse: l'equivalenza tra equiscomponibilità ed equivalenza per i poligoni (teorema di Bolyai-Gerwien), che non serve. Il passo 3 della dimostrazione del parallelogramma usa il secondo criterio con il terzo angolo ricavato dalla somma, perché la 59 non ha il "secondo criterio generalizzato".

## Lasciato ad altre lezioni

- Circonferenza e cerchio (area $\pi r^2$): alla 99, che linka già questa lezione per il poligono regolare.
- Raggio, apotema e centro del poligono regolare: definiti in due righe qui e rimandati alla 97.
- Il triangolo equilatero e l'esagono con l'apotema calcolato: alla 100 (teorema di Pitagora), citata nell'`ad-note` sui numeri fissi.
- Le aree con le coordinate: non trattate.

## Figure

Diciassette blocchi TikZ generati da `figs.py`, compilati con `compileFigure` di `scripts/figure/compile.mjs` e guardati in PNG in chiaro e con il filtro del tema scuro su un riquadro bianco. Larghezza da 118 a 249 px; la più larga è `parallelogramma-due-altezze` (246 x 148). Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`, niente `\text` (TikZJax non lo compila: le unità nelle figure sono scritte "cm$^2$").

`rettangolo-quadrato-equivalenti`, `quadrato-triangolo-equiscomponibili`, `area-rettangolo-quadretti`, `centimetro-quadrato-millimetri-quadrati`, `parallelogramma-equivalente-rettangolo` (triangoli congruenti in arancione, trattini e archetti), `parallelogramma-due-altezze`, `triangolo-meta-parallelogramma`, `triangolo-ottusangolo-altezza-esterna`, `triangolo-rettangolo-altezza-ipotenusa`, `trapezio-equivalente-triangolo`, `trapezio-esempio-altezza`, `quadrilatero-diagonali-perpendicolari` (un aquilone non simmetrico, per far vedere che la formula non vale solo per il rombo), `rombo-esempio-diagonale`, `poligono-regolare-triangoli-apotema` (esagono), `pentagono-regolare-esempio`, `figura-composta-rettangolo-triangolo`, `triangolo-equivalente-rettangolo`.

Il formulario non copia figure.

## Formulario e flashcard

- Formulario: equivalenza, unità con la tabella, tabella delle formule, note sulle altezze, procedimento per trovare una misura dall'area, tre avvisi.
- 18 carte, nell'ordine della lezione. I conti delle carte che non sono negli esempi (triangolo $10 \cdot 6$, trapezio con basi $10$ e $6$ e altezza $4$, rombo $8$ e $6$, $2\ \text{m}^2$, parallelogramma $7 \cdot 4$, rettangolo $3 \times 4$) sono nello script.

## Da cambiare nelle lezioni già scritte

- 85 (Distanza di un punto da una retta), riga 259: "L'area del triangolo si può calcolare con i due cateti o con l'ipotenusa e l'altezza" diventa "L'[area del triangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree) si può calcolare con i due cateti o con l'ipotenusa e l'altezza". Facoltativo.
- 99 e 103 linkano già questa lezione; 97 no, e nella sezione su raggio e apotema potrebbe rimandare qui per l'area del poligono regolare (lo decide chi coordina, leggendo la 97).

## Prerequisiti

La riga della bozza va bene:

```
equivalenza-aree <- geometria-quadrilateri
```

La lezione usa il triangolo rettangolo, l'altezza (61) e il poligono regolare con l'apotema (97), ma li richiama in una riga o li definisce; il poligono regolare è l'ultima sezione e si segue senza la 97. Se si preferisce che la 97 sia un prerequisito, la riga diventa `equivalenza-aree <- geometria-quadrilateri, poligoni-inscritti` e nella riga della 99 l'arco `poligoni-inscritti` diventa ridondante.

## Per il generatore

1. Area di rettangolo, quadrato, parallelogramma, triangolo, trapezio, rombo con dati interi. Distrattori: lato obliquo al posto dell'altezza ($12 \cdot 10$ invece di $12 \cdot 8$); triangolo senza il diviso due; trapezio con una sola base.
2. Conversioni tra $\text{m}^2$, $\text{dm}^2$, $\text{cm}^2$, $\text{mm}^2$, anche con dati in unità diverse. Distrattori: fattore $10$ invece di $100$ ($1\ \text{m}^2 = 100\ \text{cm}^2$); prodotto di misure in unità diverse ($1{,}2 \cdot 45$).
3. Una misura dall'area: altezza del triangolo o del trapezio, diagonale del rombo. Distrattori: area divisa per la base senza moltiplicare per $2$ ($2{,}4$ invece di $4{,}8$); per il trapezio divisione per una sola base.
4. Le due altezze del parallelogramma o l'altezza relativa all'ipotenusa (lati dati). Distrattore: altezza più lunga del lato obliquo (va scartata).
5. Poligono regolare con lato e apotema dati. Distrattore: lato per apotema senza il numero dei lati.
6. Figure composte (somma o differenza di rettangoli e triangoli) e figure equivalenti (triangolo equivalente a un rettangolo).

Vogliono una figura i livelli 4 e 6, e il 3 quando la figura è un trapezio o un rombo.

## Domande per Andrea

- Simbolo di equivalenza: $\doteq$ oppure $\equiv$, o niente simbolo e solo le aree?
- Area del poligono regolare: $\dfrac{P \cdot a}{2}$ con $P$ perimetro, come qui, o $p \cdot a$ con $p$ semiperimetro e $2p$ perimetro, come in molti libri?
- Somme e differenze di superfici come postulati (qui) o come proprietà date senza dimostrazione? E serve il postulato di De Zolt?
- I numeri fissi dei poligoni regolari: qui solo un `ad-note`; li volete in tabella (triangolo $0{,}289$, quadrato $0{,}5$, pentagono $0{,}688$, esagono $0{,}866$)?
- "Apotema" maschile o femminile?
