# Problemi di secondo grado

Generatore: `equazioni-secondo-grado-problemi` (`src/lib/exercises/v2/generators/equazioni-secondo-grado-problemi.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_secondo_grado_problemi.py`. Lezione collegata:
`docs/lezioni/riscritte/79-equazioni-secondo-grado-problemi.md` (note in `docs/lezioni/note/`).

Lo studente riceve un problema a parole e lo risolve con il procedimento in sei passi della lezione:
sceglie l'incognita e ne scrive le limitazioni, traduce il testo in un'equazione di secondo grado, la
porta in forma normale e la risolve, confronta ciascuna delle due soluzioni con le limitazioni e
risponde. La consegna è sempre "Risolvi il problema con un'equazione di secondo grado e controlla
quali soluzioni sono accettabili." Il testo sta nel `problem` come righe `\text{…}` scritte con
`textBlock`, come in `equazioni-problemi`; la pagina lo mostra come paragrafo.

## Si costruisce dalla risposta

Si sceglie prima la soluzione accettabile (il numero, l'altezza, la larghezza della cornice, la
velocità, la percentuale) e spesso anche l'altra, poi si calcolano i dati del testo. Esempio: per i
consecutivi si sceglie $x = 12$ e il testo dice "prodotto $156$"; per la cornice si scelgono i lati
della foto e la larghezza, e il testo dà l'area della cornice $4x^2 + 2(a + b)x$. Così la seconda
soluzione è quasi sempre negativa e da scartare, come negli esempi della lezione, e i numeri restano
piccoli. I livelli 2 e 4 costruiscono apposta anche i casi senza soluzioni reali ($\Delta < 0$).

## Rappresentazione

`params.story` è la storia; poi i dati così come stanno nel testo (per esempio `P` per i
consecutivi, `s` e `p` per somma e prodotto, `a`, `b`, `mode` e `C` o `T` per la cornice, `D`, `k`,
`h` per il moto, `P0` e `P2` per le percentuali) e `asked` quando la domanda può chiedere cose
diverse. Poi `equation` (l'equazione in LaTeX, la stessa dei passaggi), `variable` (`x`, `t` per il
sasso, `v` per il moto, come nella lezione), `normal` (i coefficienti interi $[a, b, c]$ della forma
normale ridotta, $a > 0$) e `roots` (le soluzioni reali dell'equazione, esatte, in forma SymPy). Ai
livelli 2 e 4 anche `case`.

Il verificatore non usa niente di derivato: ricostruisce l'equazione dai dati della storia, la
risolve con SymPy, applica le limitazioni che il testo implica (naturale, intero, positivo, minore
del semiperimetro, $v > k$, sconto sotto il $100\%$) e ricava da solo la risposta. Poi legge
`equation` dal LaTeX e controlla che abbia le stesse soluzioni, e controlla che `normal` sia la
stessa equazione e che `roots` siano le sue radici.

## Tipi di risposta

- Livelli 1, 3, 5, 6, 7: `number`, il numero chiesto (intero positivo), con la variante `choice`.
- Livelli 2 e 4: `choice`. La risposta di un problema può essere una coppia (somma e prodotto,
  i lati di un rettangolo), due risposte ($12$ e $13$ oppure $-13$ e $-12$), due tempi, un lato
  irrazionale oppure "Il problema è impossibile": nessun tipo di oggi le contiene tutte. Nei
  `values` di un'opzione una coppia è `"a;b"` (ordinata), più risposte sono più valori, l'impossibile
  è `"impossibile"`.

## Regole comuni

- Passaggi in italiano, nell'ordine della lezione: che cosa è l'incognita con le limitazioni,
  "Traduci il testo in un'equazione:", le C.E. se l'equazione è fratta, le equazioni equivalenti fino
  alla forma normale (divisa per il fattore comune), $\frac{\Delta}{4}$ quando $b$ è pari e $\Delta$
  altrimenti, $x_{1,2}$, il radicale semplificato, $x_1 < x_2$, poi quali soluzioni si scartano e
  perché ("$-13$ non è un numero naturale e si scarta"), il passaggio alla risposta e il "Controllo
  sul testo:".
- Nell'equazione niente `1x`, `0x`, `+ -`, `- -`, `+ +`; virgola decimale (`0{,}64`) nelle
  percentuali.
- La risposta dei livelli numerici non è mai uno dei numeri scritti nel testo.
- Unità: cm, m, km/h, ore, euro; le aree con `$\text{cm}^2$` dentro il testo.
- Ogni storia (livelli 1, 3, 5, 6, 7) o ogni caso (livelli 2 e 4) esce nella sua quota, e il
  verificatore lo controlla.
- I radicali sono sempre semplificati (radicando senza fattori quadrati) nelle opzioni, nei valori,
  nella soluzione e nei passaggi, tranne la riga della formula, dove $\sqrt{52}$ compare come si
  calcola e la riga dopo lo semplifica. Nessun radicale al denominatore.

## Livello 1: problemi sui numeri

Una soluzione naturale, l'altra negativa da scartare. Tre storie, circa un terzo ciascuna.

- `consecutivi`: prodotto di due naturali consecutivi (metà dei casi) o di due pari o dispari
  consecutivi positivi; si chiede il più piccolo o il più grande. $x$ da 3 a 30.
- `quadrato`: "il quadrato di un numero naturale supera il suo triplo di $c$" ($x^2 = kx + c$) o
  "se al quadrato aggiungi il suo doppio ottieni $c$" ($x^2 + kx = c$), $k$ da 2 a 5.
- `quadrati`: la somma dei quadrati di due naturali consecutivi.

Esempi: "Il prodotto di due numeri naturali consecutivi è 156. Qual è il più piccolo dei due
numeri?" $x(x + 1) = 156$, $x_1 = -13$ scartata, risposta $12$. "Il quadrato di un numero naturale
supera il suo quadruplo di 192." $x^2 - 4x - 192 = 0$, $\frac{\Delta}{4} = 196$, $-12$ scartata,
risposta $16$.

## Livello 2: una, due o nessuna risposta

La difficoltà nuova è la tabella "Quali soluzioni si accettano": il testo decide se le due soluzioni
danno una risposta, due o nessuna. Quote: circa 25% una, 50% due, 25% nessuna.

- `somma-prodotto` (due volte su cinque): "Trova due numeri che hanno somma $s$ e prodotto $p$", senza
  limitazioni, $x(s - x) = p$. Le due soluzioni danno la stessa coppia (una risposta); in quattro
  casi su dieci $\Delta < 0$ e il problema è impossibile (esempio "somma 10 e prodotto 30"). Il
  prodotto può essere negativo.
- `consecutivi-interi`: il prodotto di due interi consecutivi, due risposte ($12$ e $13$ oppure
  $-13$ e $-12$, variante dell'esempio 1).
- `quadrato-intero`: come `quadrato` del livello 1 ma con "un numero intero": due risposte.
- `sasso`: un sasso, un pallone o un razzo giocattolo a un'altezza di $vt - 5t^2$ metri; dopo quanti
  secondi si trova a $H$ m. Due tempi positivi (sale e ridiscende) o, metà delle volte, $H$ sopra
  l'altezza massima e $\Delta < 0$.

Esempi: "Trova due numeri che hanno somma 17 e prodotto 72." Risposta "8 e 9". "Il prodotto di due
numeri interi consecutivi è 30." Risposta "5 e 6 oppure $-6$ e $-5$".

## Livello 3: aree di rettangoli, triangoli e rombi

Area data e un lato espresso con l'altro (esempio 3); soluzione intera, l'altra negativa.

- `rettangolo`: "la base supera l'altezza di $d$" o "supera di $d$ il doppio dell'altezza", area fino
  a 500; si chiede il perimetro, la base o l'altezza. Quattro contesti (rettangolo, aiuola, foglio,
  campo).
- `triangolo`: triangolo o vela, $\frac{x(x + d)}{2} = A$; si chiede base o altezza.
- `rombo`: rombo o aquilone, diagonali $x$ e $x + d$, stessa equazione del triangolo.

Esempi: "In un rettangolo la base supera l'altezza di 4 cm, e l'area è 96 $\text{cm}^2$. Calcola il
perimetro." Risposta 40. "In un rombo la diagonale maggiore supera la minore di 7 cm, e l'area è 130
$\text{cm}^2$." Diagonale maggiore 20.

## Livello 4: lati irrazionali e rettangoli impossibili

Due difficoltà della sezione "Quali soluzioni si accettano", tutte e due senza numeri interi: una
lunghezza può essere irrazionale (esempio 4) e un rettangolo può non esistere (l'esempio con
perimetro 20 e area 30). Quote: circa 70% irrazionale, 30% impossibile.

- `triangolo-irr` e `rettangolo-irr`: la base supera l'altezza di $d$ pari (2, 4, 6), così si usa
  la formula ridotta e $\frac{\Delta}{4} \leq 60$ non è un quadrato; si chiede l'altezza o la base,
  per esempio $\sqrt{13} - 1$ e $\sqrt{13} + 1$.
- `perimetro-area` (metà del livello): perimetro $2s$ e area $A$, $x(s - x) = A$. Sei volte su
  dieci $A > \frac{s^2}{4}$ e il problema è impossibile; le altre i lati sono $\frac{s \pm
  \sqrt{\Delta}}{2}$, tutti e due accettabili e dello stesso rettangolo.

Esempi: "In un triangolo la base supera l'altezza di 2 m, e l'area è 23 $\text{m}^2$." Risposta
$\sqrt{47} - 1$. "Un rettangolo ha il perimetro di 22 m e l'area di 42 $\text{m}^2$." $\Delta = -47$:
impossibile.

## Livello 5: cornici e teorema di Pitagora

La difficoltà nuova è sviluppare un prodotto di binomi o il quadrato di un binomio prima di
arrivare alla forma normale. Due storie, metà ciascuna.

- `cornice`: foto con cornice (cm), giardino con vialetto, piscina con bordo (m). Si dà l'area della
  cornice, l'area totale, oppure (solo per la foto) che la cornice ha la stessa area della foto,
  come nell'esempio 5 ($20 \times 30$, $x = 5$). Si chiede la larghezza (sette volte su dieci) o il
  perimetro esterno.
- `pitagora`: triangolo rettangolo con cateti $x$ e $x + d$ e ipotenusa $c$, oppure rettangolo con
  diagonale $c$ (terne pitagoriche con $c \leq 41$); limitazione $0 < x < c - d$ come nell'esempio
  6. Si chiede un lato, il perimetro o l'area.

Esempi: "Una foto di 22 cm per 24 cm è circondata da una cornice di larghezza costante. L'area
della cornice è 96 $\text{cm}^2$. Quanto misura il perimetro esterno?" $x = 1$, risposta 100. "In un
triangolo rettangolo un cateto supera l'altro di 7 cm, e l'ipotenusa misura 13 cm." Cateto minore 5.

## Livello 6: moto e lavoro

L'incognita al denominatore: equazione fratta, C.E. scritte nei passaggi, poi i denominatori tolti.

- `moto-veloce`: "percorre $D$ km; se andasse $k$ km/h più veloce ci metterebbe un'ora (o due) di
  meno" (esempio 7). Ciclista, auto, treno, camion, con velocità da 10 a 150 km/h e $D \leq 600$.
- `moto-lento`: "più piano, un'ora in più", con la limitazione $v > k$.
- `lavoro`: due rubinetti, due operai o due stampanti; insieme $T$ ore, il secondo $k$ ore più del
  primo (esempio 8). Si chiede il tempo del primo o del secondo.

Esempi: "Un ciclista percorre 60 km a velocità costante. Se andasse 5 km/h più veloce, ci
metterebbe un'ora di meno." Risposta 15. "Due rubinetti, aperti insieme, riempiono una vasca in 6
ore. Da solo, il secondo ci mette 5 ore più del primo. Quante ore ci mette il secondo?" Risposta 15.

## Livello 7: due aumenti o due sconti uguali

$P_0\left(1 \pm \frac{x}{100}\right)^2 = P_2$, risolta come una pura come nell'esempio 9: si divide
per $P_0$, si estrae la radice con il $\pm$, la seconda soluzione si scarta ($-210$ per un aumento,
$180$ per uno sconto che supererebbe il $100\%$). Percentuali 5, 10, 15, 20, 25, 30, 40, 50. Contesti:
bici, abbonamento, abitanti di un paese (aumenti); televisore, valore di un'auto (sconti). Le opzioni
hanno il segno $\%$.

Esempi: "Il prezzo di una bici era 200 euro. È aumentato due volte della stessa percentuale, e ora
è 242 euro." Risposta 10. "Un televisore costava 2000 euro. È stato scontato due volte della stessa
percentuale, e ora costa 1280 euro." Risposta 20.

## Esercizi "brutti" da evitare

- Una risposta che è già un numero del testo (scartata e rigenerata).
- Ipotenuse sopra 41 ($c^2$ oltre 1681 da calcolare a mano), aree sopra 500, distanze oltre 600 km.
- Radicali grandi: al livello 4 $\frac{\Delta}{4} \leq 60$.
- Un sasso che "arriva" a $0$ secondi (un distrattore con un tempo nullo o negativo viene tolto).
- Distrattori con frazioni strane ($\frac{91}{3}$): ai livelli numerici solo interi o numeri con
  un decimale, al livello 1 solo interi.

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. I distrattori vengono dagli avvisi della lezione, poi da
numeri vicini alla risposta:

- la soluzione da scartare tenuta come risposta ("Rispondere con tutte e due le soluzioni"), quando
  la domanda chiede proprio l'incognita: $-13$, $-12$ cm, $-20$ km/h, $-210\%$;
- l'altro numero o l'altro lato (fermarsi alla $x$), il semiperimetro al posto del perimetro;
- il segno di $b$ letto male ($s$ al posto di $r$ in $x^2 - kx - c$), $\Delta$ con il segno
  sbagliato ($b^2 + 4ac$) o letto positivo quando è negativo ($5 \pm \sqrt{5}$ per perimetro 20 e
  area 30), $b$ al posto di $\frac{b}{2}$ nella formula ridotta ($\sqrt{47} - 6$);
- l'area del triangolo senza la divisione per 2, o quella del rettangolo con;
- "Due soluzioni, due coppie" e le limitazioni lette male: solo la coppia naturale quando il testo
  dice "interi", le due soluzioni prese come la coppia ($-13$ e $12$), solo il tempo in salita;
- la cornice senza i quattro angoli ($x = \frac{C}{2(a + b)}$) o su un lato solo;
- nel lavoro i tempi sommati ($x + (x + k) = T$, riquadro "Sommare i tempi");
- nelle percentuali l'aumento totale diviso per due ($10{,}5\%$, riquadro "Due aumenti del 10% non
  fanno il 20%"), l'aumento totale, $\frac{x}{100}$ al posto di $x$;
- per somma e prodotto: la coppia con i segni cambiati, una coppia con la somma giusta e il prodotto
  sbagliato, una con il prodotto giusto e la somma sbagliata; per un problema impossibile, le due
  metà della somma e i divisori del prodotto.

Ai livelli 2 e 4 "Il problema è impossibile" c'è sempre quando è la risposta giusta, e spesso anche
come distrattore.

## Verifiche fatte (27 settembre 2026)

- `sample.mts equazioni-secondo-grado-problemi 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Di
  nuovo con seed di partenza 7001: PASS. Quote al seed 1: livello 2 una 252, due 497, nessuna 251;
  livello 4 irrazionale 698, impossibile 302; le storie degli altri livelli tra 317 e 356 su 1.000
  (tre storie) o tra 496 e 504 (due).
- Errori piantati a mano, tutti bocciati: risposta cambiata (livelli 1, 3, 5, 6, 7); opzione giusta
  spostata (tutti i livelli); opzione giusta con un altro numero; opzione doppia; radicale non
  semplificato in un'opzione ($\sqrt{104}$); distrattore uguale alla risposta ma scritto in un'altra
  forma ($\frac{6 + 2\sqrt{43}}{2}$ accanto a $3 + \sqrt{43}$); `case` invertito; un dato cambiato in
  `params` (la forma normale non torna più, la soluzione diventa irrazionale); un dato cambiato nel
  testo; equazione cambiata; forma normale sbagliata; la soluzione negativa non scartata nei
  passaggi; C.E. tolte; problema impossibile senza l'opzione "impossibile"; percentuale senza il
  segno $\%$.
- `review.mts`: esce con 0, gli esempi si leggono bene.
- `width.mts`: esce con 0. I testi sono prosa e vanno a capo da soli; le opzioni più larghe sono
  "Il problema è impossibile" e i due tempi irrazionali del sasso su due righe (`gathered`), 197 px
  su 252. Le due coppie degli interi consecutivi stanno su due righe.
- Passaggi controllati con `steps-scan.mts`: nessun errore KaTeX.
- Esercizi diversi su 1.000 per livello (seed 1): 238, 499, 852, 687, 610, 334, 752. Il livello 1
  è il più stretto perché i numeri restano piccoli come nella lezione (consecutivi fino a 30).
- `tsc` ed `eslint` senza errori nel generatore.

## Figure

Il sito non genera figure per gli esercizi. Le vorrebbero il livello 3 (rettangolo, triangolo e
rombo con i lati $x$ e $x + d$, come le figure degli esempi 3 e 4), il livello 4 (triangolo e
rettangolo) e il livello 5 (la cornice con la quota $x$ e il triangolo rettangolo con i cateti).
I testi si reggono senza.

## Domande per la revisione

- Livello 2: "Quale può essere il numero?" con risposta "$-2$ oppure $5$" e le due coppie degli
  interi consecutivi sono a scelta multipla; per una risposta aperta servirebbe un tipo che contenga
  più risposte o coppie. Va bene così per ora?
- Il sasso usa la formula $vt - 5t^2$ data dal testo, come la lezione; la nota della lezione dice
  che si può togliere se sembra fuori luogo per il biennio. Se si toglie dalla lezione, va tolto
  anche qui (il livello 2 resta con tre storie).
- Livello 4: i lati del rettangolo con perimetro e area sono entrambi irrazionali, per esempio
  $\frac{11 - \sqrt{13}}{2}$ e $\frac{11 + \sqrt{13}}{2}$ quando il semiperimetro è dispari. È un
  livello di calcolo adatto, o meglio solo semiperimetri pari (lati come $7 \pm 2\sqrt{3}$)?
- Livello 7: le percentuali che danno prezzi interi sono poche (5, 10, 15, 20, 25, 30, 40, 50) e i
  prezzi di partenza diventano multipli di 400 per il 5%. Serve anche il caso con i centesimi?
- Livello 6: la risposta è sempre la velocità o un tempo intero in ore; il lavoro con ore e minuti è
  già nel generatore di primo grado. Serve qui?
