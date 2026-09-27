# Note: Intersezione tra due rette

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`linsolve` sui sistemi dei dieci esempi e delle carte, le forme esplicite dell'esempio 4 con `solve`, i punti sugli assi degli esempi 6 e 7, le aree $3$, $5$ e $10$, anche con `Triangle(...).area` e `Line.is_perpendicular` per l'esempio 8, le sostituzioni dell'esempio 9 e il valore $k = 3$ dell'esempio 10). Anche le figure sono controllate: gli estremi di ogni segmento disegnato e ogni punto etichettato stanno sulla retta giusta (script `84-verifica.py` nello scratchpad). La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px di base: la più larga è 254 px (nell'esempio 5, dentro un riquadro), cioè circa 224 px ai 15 px del sito. `check.mts` passa sui tre file senza avvisi.

## Scelte di convenzione (da verificare con il libro in uso)

- Punti $P(2, 3)$ con la virgola, coordinate non intere come frazioni ($P\left(2, \frac{1}{2}\right)$), rette indicate con lettere minuscole seguite dai due punti ($r: y = 2x - 1$), come fanno quasi tutti i libri.
- Distanza e lunghezza con $\overline{AB}$, come deciso dalla 80 (`80-convenzioni.md`).
- Nell'esempio 5 i lati si chiamano con il nome del segmento ($AB: x + 3y - 2 = 0$); è la notazione dei libri per questo tipo di esercizio, ma mescola il segmento con la retta che lo contiene.
- "Punto di intersezione" come termine principale; "punto d'incontro" compare solo nell'avviso sul termine noto. "Rette concorrenti" per tre rette per lo stesso punto: è il termine dei libri, ma alcuni dicono solo "passano per uno stesso punto".
- Criterio dei rapporti copiato dalla 68 (stessa tabella, stessa condizione su $a'$, $b'$, $c'$ diversi da zero, stesso $ab' \neq a'b$ per i coefficienti nulli), con una frase che spiega perché il rapporto $\frac{c}{c'}$ non cambia passando dalla forma normale $ax + by = c$ alla forma implicita $ax + by + c = 0$.
- Figure: griglia `gray!25`, rette `blue!60`, `red!50` e `green!45!black` (la terza), etichette delle rette con la lettera, triangoli riempiti in `blue!10`. Nel tema scuro diventano blu, rosso e verde chiaro su nero, leggibili.

## Lasciato ad altre lezioni

- Equazione della retta, forme esplicita e implicita, intersezioni con gli assi: 81 (link nell'apertura e nella sezione sulle rette parallele agli assi).
- Significato di $m$: 82 (link). Condizione di parallelismo e perpendicolarità: 83 (link; l'esempio 8 usa $m_1 \cdot m_2 = -1$ senza spiegarlo).
- Distanza tra due punti: 80 (link nella sezione sull'area); l'esempio 8 usa la formula senza ricavarla.
- Area di un triangolo qualsiasi: 85 (una frase con link alla fine della sezione sui triangoli).
- Fasci di rette: 86 (una frase con link alla fine). L'esempio 10 con il parametro $k$ anticipa l'idea senza nominarla.
- Metodi di risoluzione dei sistemi e tipi di sistema: 68 (link), non rispiegati.

## Da cambiare nelle lezioni già scritte

- 68 (Sistemi di due equazioni in due incognite): facoltativo. Nella nota della 68 si diceva che l'intersezione tra rette non era linkata perché non scritta. Alla fine della sezione "Interpretazione grafica", dopo "dal disegno non si leggono con precisione.", si può aggiungere: "Come si usa il sistema per trovare il punto d'incontro di due rette, e per i problemi con i triangoli, è nella lezione [Intersezione tra due rette](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/intersezione-tra-due-rette)."
- 45: il link al sistema di due equazioni c'è già; niente da cambiare.

## Figure

Sei, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in PNG in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`).
- `intersezione-rette-forma-esplicita` (159×174), nell'esempio 1: le due rette e $P(2, 3)$ con le tratteggiate verso gli assi.
- `rette-incidenti-parallele-coincidenti` (276×99), fuori dai riquadri: tre pannelli senza assi, con il nome del caso sotto.
- `vertici-triangolo-dati-i-lati` (163×164), nell'esempio 5.
- `area-triangolo-lato-asse-x` (184×137), nell'esempio 6: triangolo riempito, altezza tratteggiata.
- `triangolo-rettangolo-vertice-origine` (132×169), nell'esempio 8, con il segno dell'angolo retto in $O$.
- `tre-rette-concorrenti` (156×157), nell'esempio 9.

Tutte sotto i 280 px, niente `\clip`, niente riempimenti bianchi. Non viste sul sito.

## Formulario e flashcard

- Il formulario ha il procedimento, le due tabelle (rapporti e $m$, $q$), le regole sui triangoli con l'esempio 7, il controllo delle tre rette e tre avvisi. Nessuna figura.
- 19 carte, tutte su esempi e regole della lezione.

## Prerequisiti

La bozza `intersezione-tra-due-rette <- equazione-di-una-retta, sistemi-di-equazioni` è quasi giusta, ma la sezione "Dal coefficiente angolare e dall'ordinata all'origine" e la tabella con $m$ e $q$ si seguono solo sapendo che $m$ è la pendenza, e l'avviso "Leggere $m$ nella forma implicita" usa $m = -\frac{a}{b}$, che è della 82. La cambierei in

```
intersezione-tra-due-rette <- il-coefficiente-angolare, sistemi-di-equazioni
```

(`equazione-di-una-retta` diventa ridondante, perché è prerequisito della 82). L'esempio 8 usa anche la perpendicolarità della 83, ma è un solo esempio in fondo e il resto si segue senza: non la metterei. Se invece si vuole coprire tutta la lezione, `rette-parallele-tra-loro` sostituisce `il-coefficiente-angolare`, e la riga della 86 (`retta-fasci <- rette-parallele-tra-loro, intersezione-tra-due-rette, ...`) diventerebbe ridondante sul primo arco.

## Per il generatore

1. Trovare il punto di intersezione di due rette in forma esplicita, soluzione intera (confronto): $y = 2x - 1$, $y = -x + 5$, $P(2, 3)$.
2. Due rette in forma implicita o una retta parallela a un asse, con una coordinata frazionaria: $x + 2y - 3 = 0$, $3x - 4y - 4 = 0$, $P\left(2, \frac{1}{2}\right)$; $x = -2$, $3x + 2y - 1 = 0$.
3. Riconoscere se due rette sono incidenti, parallele distinte o coincidenti, dai rapporti o da $m$ e $q$, con coppie trappola (stessa $q$ e $m$ diverse, forma implicita con coefficienti di $y$ diversi).
4. Vertici di un triangolo date le rette dei tre lati (tre sistemi, vertici interi).
5. Area del triangolo con un lato sull'asse $x$ (o $y$) formato da due rette e dall'asse, con il terzo vertice anche sotto l'asse o con coordinate frazionarie; area del triangolo con gli assi.
6. Tre rette: dire se sono concorrenti, oppure trovare il parametro $k$ perché lo siano.

Il controllo del generatore deve verificare i punti con `linsolve`, che le rette dei livelli 1-2 e 4-6 siano davvero incidenti, che nel livello 5 l'area venga dalla base e dall'altezza in valore assoluto, e nel livello 6 che il parametro dia una retta non parallela alle altre due.

## Domande per Andrea

- Tre rette per lo stesso punto: le ho chiamate "concorrenti"; in alternativa solo "passano per uno stesso punto", senza il nome.
- Nei problemi sui triangoli i lati sono indicati con il nome del segmento ($AB: x + 3y - 2 = 0$); in alternativa lettere per le rette ($r$, $s$, $t$) e poi i vertici come $r \cap s$.
- Il riconoscimento di incidenti, parallele e coincidenti è dato in due modi, con i rapporti dei coefficienti (come nella 68) e con $m$ e $q$; si può tenere solo il secondo, se in classe si usa solo quello.
- L'esempio 8 (triangolo rettangolo in $O$) usa la perpendicolarità della 83 e la distanza della 80: se la lezione 84 si fa in classe prima della 83, si può sostituire con un triangolo con il vertice nell'origine e un lato sull'asse $x$.
