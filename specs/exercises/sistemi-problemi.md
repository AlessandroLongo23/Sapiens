# Problemi con i sistemi

Generatore: `sistemi-problemi` (`src/lib/exercises/v2/generators/sistemi-problemi.ts`).
Verifica indipendente: `scripts/exercises/checkers/sistemi_problemi.py`. Lezione collegata:
`docs/lezioni/riscritte/70-sistemi-problemi.md` (note in `docs/lezioni/note/`).

Lo studente riceve un problema a parole e lo risolve come nella lezione: sceglie le incognite $x$ e
$y$ (e $z$) con le loro limitazioni, traduce ogni informazione del testo in un'equazione, risolve il
sistema, controlla la soluzione sul testo e risponde. La consegna è "Risolvi il problema con un
sistema."; ai livelli 2 e 6, dove il problema può essere impossibile, "Risolvi il problema con un
sistema e controlla che la soluzione sia accettabile.". Il testo sta nel `problem` come righe
`\text{…}` scritte con `textBlock`, come in `equazioni-problemi`; la pagina lo mostra come paragrafo.

## Si costruisce dalla risposta

Si scelgono prima i valori delle incognite (i due numeri, i biglietti venduti, le età, i lati, le
cifre, i prezzi, i litri, le velocità, le monete), poi si calcolano i dati del testo. Le soluzioni
accettabili sono sempre numeri naturali positivi. Ai livelli 2 e 6 il problema impossibile si
costruisce scegliendo apposta un dato che porta la soluzione fuori dalle limitazioni: un incasso che
dà un numero di biglietti non intero o negativo, una concentrazione fuori dalle due di partenza.

## Rappresentazione

`params.story` è la storia; poi i dati così come stanno nel testo (per esempio `N`, `p1`, `p2`, `I`
per i biglietti; `family`, `k`, `n`, `when`, `d` o `S` per le età), `system` (il sistema tradotto,
in LaTeX con `\begin{cases}`, lo stesso dei passaggi), `sol` (i valori delle incognite, razionali
esatti, anche quando la soluzione non è accettabile) e, quando la risposta sono i valori delle
incognite, `labels` e `unit` delle opzioni. Ai livelli 2 e 6 anche `case` (`accettabile` o
`impossibile`). Il verificatore ricostruisce il sistema dai dati della storia, lo risolve con
`linsolve`, decide da solo se la soluzione è accettabile, poi legge `system` dal LaTeX e controlla
che sia lo stesso sistema, equazione per equazione, a meno di un fattore.

## Tipo di risposta

- La risposta sono i valori di tutte le incognite (i due numeri, gli interi e i ridotti, le età, gli
  angoli, i prezzi, i litri, le velocità, le monete): nessun tipo ha due o tre campi, quindi
  `answer` è una scelta (`choice`). Ogni opzione ha una riga per incognita,
  `\begin{gathered} \text{interi: } 180 \\ \text{ridotti: } 120 \end{gathered}`, con l'unità dopo il
  numero (`\text{ anni}`, `^\circ`, `\text{ km/h}`); al livello 1 i due numeri stanno su una riga,
  `31 \text{ e } 19`, il maggiore per primo.
- Quando la domanda chiede un numero solo (l'area del rettangolo al livello 4, il numero con le cifre
  al livello 5), `answer` è `number` e `choice` è la variante a scelta multipla.
- Un problema impossibile ha come risposta l'opzione "Il problema è impossibile".

## Passaggi

Che cosa sono le incognite con le limitazioni; "Traduci il testo in un sistema:" e il sistema; i
passaggi che portano a coefficienti interi (dividere per 2 i perimetri, togliere i decimali,
portare le incognite a sinistra); la risoluzione; "Controllo sul testo:" con i numeri trovati, oppure
il valore scartato e il motivo. La risoluzione segue la lezione: riduzione quando un'incognita ha
coefficienti opposti (si somma, come negli esempi 1, 6 e 9) o uguali (si sottrae, come
nell'esempio 4); altrimenti sostituzione da un coefficiente $\pm 1$ (esempi 2, 3, 7); se
un'equazione del testo dà già un'incognita ($x = 3y$, $x = y + 26$) si sostituisce quella, come
nell'esempio 3. Un monomio sostituito si moltiplica con il punto ($2 \cdot 2x$), un binomio va tra
parentesi ($8(300 - x)$). Nei passaggi nessun ambiente contiene `\text{}`: i sistemi stanno in righe
proprie.

## Livello 1: due numeri

Quattro storie, circa 1 su 4 ciascuna. Il maggiore e il minore, $x > y \geq 2$, $x + y \leq 160$.

- `somma-differenza`: "La somma di due numeri è $S$ e la loro differenza è $D$" (esempio 1).
- `somma-rapporto`: "uno è il triplo dell'altro", $k$ da 2 a 5.
- `differenza-rapporto`: "differiscono di $D$, e il maggiore è il triplo del minore".
- `somma-supera`: "il maggiore supera di $d$ il doppio del minore", $k$ 2 o 3.

Esempi: "La somma di due numeri è 56, e il maggiore supera di 8 il doppio del minore."
$x + y = 56$, $x = 2y + 8$: 40 e 16. "Due numeri differiscono di 20, e il maggiore è il triplo del
minore." $x - y = 20$, $x = 3y$: 30 e 10.

## Livello 2: prezzi, biglietti, monete

Numero dei pezzi e incasso o spesa (esempio 2). Quattro contesti: biglietti interi e ridotti,
quaderni e penne, monete da 2 e da 1 euro, banconote (10 e 5, 20 e 10, 50 e 20, 50 e 10, 20 e 5).
Circa un terzo dei problemi è impossibile: la soluzione non è intera (come l'incasso di 3130 euro
dell'esempio 2) oppure un'incognita è negativa (l'incasso supera quello con tutti i pezzi più cari,
o non arriva a quello con tutti i più economici). Un'opzione è sempre "Il problema è impossibile".

Esempi: "In una cassa ci sono 27 banconote, da 10 euro e da 5 euro, per un totale di 160 euro."
$x + y = 27$, $10x + 5y = 160$: 5 da 10 euro e 22 da 5 euro. "Luca compra 6 oggetti, tra quaderni da
3 euro e penne da 2 euro, e spende 10 euro." $x = -2$: impossibile.

## Livello 3: età

Genitore e figlio (madre o padre, figlia o figlio), $x$ l'età del genitore e $y$ quella del figlio.
La prima frase dà la differenza o la somma delle età di oggi, la seconda "tra $n$ anni" o "$n$ anni
fa" il genitore avrà (aveva) il doppio, il triplo, il quadruplo o il quintuplo degli anni del figlio
(esempio 3, riquadro "Far passare il tempo per uno solo"). Differenza di età tra 20 e 45 anni,
genitore fino a 70, figlio almeno 2 anni e, per "$n$ anni fa", già nato allora.

Esempi: "Oggi un padre ha 20 anni più del figlio. 10 anni fa il padre aveva il triplo degli anni del
figlio." $x = y + 20$, $x - 10 = 3(y - 10)$: 40 e 20. "Oggi la somma delle età di una madre e di suo
figlio è 87 anni. Tra 12 anni la madre avrà il doppio degli anni del figlio." 62 e 25.

## Livello 4: geometria

- `rettangolo` (esempio 4): perimetro dato; poi un lato cambia di una lunghezza e l'altro raddoppia o
  triplica, e si dà il perimetro nuovo. Si chiede l'area. Un lato che cambia di una lunghezza e
  l'altro che cambia di un'altra darebbero due equazioni con gli stessi coefficienti (sistema
  impossibile o indeterminato): per questo uno dei due lati si moltiplica sempre.
- `isoscele` (esempio 5): l'angolo al vertice supera ciascun angolo alla base di $d$ gradi, o il
  contrario ($d$ multiplo di 3), oppure uno è il doppio, il triplo o il quadruplo dell'altro. Si
  chiedono gli angoli; niente triangoli equilateri.

Esempi: "Un rettangolo ha perimetro 38 cm. Se si raddoppia la base e si accorcia l'altezza di 3 cm,
il perimetro diventa 44 cm." $2(x + y) = 38$, $2(2x + y - 3) = 44$: $6 \cdot 13 = 78$. "In un
triangolo isoscele l'angolo al vertice supera di $36^\circ$ ciascuno degli angoli alla base."
$84^\circ$ e $48^\circ$.

## Livello 5: le cifre di un numero

$x$ la cifra delle decine, $y$ quella delle unità, da 1 a 9 e diverse; il numero è $10x + y$
(esempio 6, riquadro "Il numero con le cifre x e y"). La risposta è il numero.

- `somma-scambio`: la somma delle cifre e lo scambio, che fa crescere o diminuire il numero di $D$.
- `rapporto-scambio`: una cifra è il doppio, il triplo o il quadruplo dell'altra, e lo scambio.
- `somma-multiplo`: la somma delle cifre, e il numero è $k$ volte la somma delle cifre.
- `differenza-somma`: una cifra supera l'altra di $d$, e il numero più quello scambiato fa $M$.

Una storia con "la cifra delle unità supera di $d$ quella delle decine" e lo scambio non si fa: sono
la stessa informazione (lo scambio cambia il numero di $9d$), e il sistema sarebbe indeterminato.

Esempi: "Un numero di due cifre ha la somma delle cifre uguale a 12, ed è uguale a 7 volte la somma
delle sue cifre." 84. "La cifra delle unità è il quadruplo di quella delle decine. Se si scambiano le
due cifre, si ottiene un numero che supera di 54 quello di partenza." 28.

## Livello 6: sconti e miscele

- `sconti` (esempio 7): due articoli con il prezzo totale, due sconti diversi (10, 15, 20, 25, 30,
  40, 50 per cento) e il totale scontato. Prezzi multipli di 20 euro, il più caro al massimo il
  quadruplo dell'altro, sconti in euro interi. La seconda equazione ha i decimali ($0{,}8x$), che si
  tolgono moltiplicando per 10 o per 100.
- `miscela` (esempio 8): due soluzioni di alcol, sale o zucchero a concentrazioni diverse, $V$ litri di
  miscela a una concentrazione data. Metà delle miscele è impossibile: la concentrazione chiesta è
  fuori dalle due di partenza, e un'incognita viene negativa (seconda parte dell'esempio 8).

Un'opzione è sempre "Il problema è impossibile", anche negli sconti. Esempi: "Una bicicletta e un
cappotto costano insieme 240 euro. Durante i saldi la bicicletta è scontata del 15% e il cappotto del
40%, e insieme costano 189 euro." 180 e 60 euro. "Una soluzione di sale al 40% e una al 70%; 30 litri
al 84%." $x = -14$: impossibile.

## Livello 7: moto e tre incognite

- `fiume` (esempio 9): una barca contro e con la corrente, o un aereo con il vento contrario e a
  favore; tempi interi da 1 a 5 ore (non tutti e due di un'ora), distanze uguali o diverse.
  $x > 2y > 0$.
- `monete3` (esempio 10): monete di tre tipi (10, 20, 50 centesimi; 5, 10, 20; 20 e 50 centesimi e
  1 euro; 50 centesimi, 1 e 2 euro), il numero totale, il valore in euro con la virgola e una
  relazione semplice tra due tipi ($x = kz$, $y = z + d$, $x = y + d$). Si conta in centesimi, si
  sostituisce la relazione e resta un sistema di due equazioni.

Esempi: "Un aereo percorre 2600 km in 5 ore con il vento contrario, e 2720 km in 4 ore con il vento a
favore." 600 e 80 km/h. "25 monete, da 20 centesimi, da 50 centesimi e da 1 euro, per 9,30 euro; le
monete da 50 centesimi sono 7 più di quelle da 1 euro." 14, 9 e 2.

## Esercizi "brutti" da evitare

- Due equazioni che dicono la stessa cosa (le cifre con la differenza e lo scambio, i due lati del
  rettangolo che cambiano entrambi di una lunghezza): il generatore controlla che il sistema sia
  determinato.
- Età impossibili, un figlio non ancora nato "$n$ anni fa", un triangolo equilatero, una corrente
  quasi veloce quanto la barca, prezzi con i centesimi dopo lo sconto.
- Un problema impossibile assurdo a prima vista: la spesa sotto il minimo possibile scende al più di
  un quinto (6 oggetti non costano 3 euro).
- Opzioni con numeri negativi o nulli, tranne la soluzione scartata di un problema impossibile e le
  coppie naturali più vicine (anche con uno zero).

## Variante a scelta multipla

Quattro opzioni distinte, una corretta; al livello 1 due opzioni con gli stessi due numeri sono la
stessa. I distrattori vengono dagli errori della lezione, poi da valori vicini che rispettano una
sola delle due equazioni:

- livello 1: la differenza divisa male ($\frac{S}{2} + D$ e $\frac{S}{2} - D$), $y$ letto come la
  differenza, la somma divisa per $k$, "supera" dalla parte sbagliata;
- livello 2: $x$ e $y$ scambiati; se il problema è impossibile, la soluzione scartata ($182{,}5$ e
  $117{,}5$, o un numero negativo) e le coppie naturali più vicine;
- livello 3: il tempo che passa per uno solo ($x + n = ky$), il tempo dimenticato ($x = ky$);
- livello 4: il perimetro preso come $x + y$, il semiperimetro, l'area del rettangolo nuovo; gli
  angoli alla base contati una volta sola ($x + y = 180$), vertice e base scambiati;
- livello 5: le cifre scambiate, $x \cdot y$ al posto di $10x + y$, numeri con la stessa somma di
  cifre;
- livello 6: i prezzi scontati al posto di quelli pieni, prezzi scambiati; la miscela a metà; la
  soluzione scartata e i suoi valori assoluti;
- livello 7: la velocità media (riquadro "La velocità media non è la velocità della barca"), le
  velocità contro e con la corrente prese come risposta, barca e corrente scambiate; le monete
  scambiate tra i tipi.

Ai livelli 2 e 6 un'opzione è sempre "Il problema è impossibile"; se il problema è impossibile, tra
le opzioni c'è la soluzione scartata.

## Figure

Il sito non genera figure per gli esercizi: il livello 4 vorrebbe il rettangolo con i lati $x$ e $y$
(figura `rettangolo-base-altezza-incognite` della lezione) e il triangolo isoscele con gli angoli $x$,
$y$, $y$ (figura `triangolo-isoscele-angoli-incogniti`). Il testo si regge da solo.

## Verifiche fatte (27 settembre 2026)

- `sample.mts sistemi-problemi 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Di nuovo con seed di
  partenza 7001: PASS. Le storie escono nella loro quota (livello 1 tra 241 e 255 su 1.000 per
  storia; livello 2 701 accettabili e 299 impossibili; livello 6 504 sconti, 258 miscele accettabili,
  238 impossibili).
- Errori piantati a mano, tutti bocciati (script nello scratchpad, `g70-plant.py`): risposta numerica
  cambiata; opzione giusta spostata; opzione giusta con un altro valore; opzione scritta diversa dai
  suoi valori; `case` invertito; soluzione scartata tolta dalle opzioni di un problema impossibile;
  opzione "impossibile" tolta; sistema sbagliato (angoli alla base contati una volta); dato cambiato
  nei parametri; età implausibili; opzione doppia; etichetta sbagliata in un'opzione; controllo sul
  testo tolto; cifre scambiate come risposta; `params.sol` scambiata; consegna senza "accettabile";
  distrattore negativo a un livello senza problemi impossibili. La prima esecuzione del verificatore
  ha trovato due difetti veri del generatore, corretti: distrattori negativi al livello 1 e la
  soluzione scartata che mancava dalle opzioni dei problemi impossibili.
- `review.mts`: esce con 0.
- `width.mts`: esce con 0. Il testo è prosa e va a capo da solo; l'opzione più larga è "Il problema
  è impossibile", 197 px su 252; le opzioni su tre righe delle monete arrivano a 151 px.
- `steps-scan.mts`: nessun errore KaTeX in soluzioni e passaggi.
- Esercizi diversi su 1.000 per livello: 685, 975, 941, 559, 172, 995, 986. Il livello 5 è il più
  stretto perché i numeri di due cifre sono 72 e le storie ne usano solo una parte (un numero
  multiplo della somma delle sue cifre, una cifra multipla dell'altra).
- `tsc` ed `eslint` senza errori nei file di questo generatore.

## Domande per la revisione

- La risposta è quasi sempre una scelta, perché chiede due o tre valori insieme. Per una futura
  risposta aperta serve un tipo con più campi (uno per incognita, con le etichette): va bene
  un'opzione su due righe ("interi: 180", "ridotti: 120") nel frattempo?
- Il livello 7 mette insieme due difficoltà diverse (il moto con la corrente e le tre incognite), come
  propone la nota della lezione. Meglio dividerle, togliendo un altro livello (per esempio unendo
  numeri ed età)?
- La sezione "Due equazioni che dicono cose diverse" (sistema indeterminato, informazione contata due
  volte) non ha un livello: servirebbe una risposta "il testo non basta". Aggiungerla?
- I problemi impossibili del livello 2 con l'incasso fuori dall'intervallo (30 monete da 2 e da 1
  euro per 70 euro) si vedono senza risolvere il sistema: vanno bene, o meglio solo quelli con la
  soluzione non intera, come nella lezione?
- Le velocità degli aerei (fino a 900 km/h, vento fino a 120 km/h) sono plausibili ma lontane dagli
  esempi: restringerle?
