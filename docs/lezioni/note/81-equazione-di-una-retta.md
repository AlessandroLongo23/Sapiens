# Note: Equazione della retta e casi particolari

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solve`, `expand`, `Line`, `Point`): i punti dell'apertura su $y = 2x + 1$, le forme esplicite degli esempi 2 e 7, la forma implicita dell'esempio 3 (e il fatto che $4$, $-6$, $-3$ non hanno divisori comuni), le appartenenze e il punto $C(4, -4)$ dell'esempio 4 (anche il conto con le coordinate scambiate, $-3$), le intersezioni degli esempi 5, 7 e 8, il punto $Q(4, -2)$ dell'esempio 6, i tre valori di $k$ dell'esempio 9, le varianti sbagliate dell'avviso sulla divisione, le carte con un conto. Anche le figure: ogni punto disegnato ha le coordinate giuste e ogni estremo di segmento sta sulla sua retta (per esempio $(-4{,}33; -3{,}5)$ e $(1; 4{,}5)$ su $y = \frac{3}{2}x + 3$, $(-1{,}5; 0{,}9)$ e $(5{,}5; -3{,}3)$ su $y = -\frac{3}{5}x$).

## Scelte di convenzione

Tutte da verificare con il libro in uso.
- Punti come nella 80 e nel brief del lotto: $A(-2, 5)$, coordinate $x_A$, $y_A$, frazioni per le coordinate non intere ($\left(0, -\frac{1}{2}\right)$). La distanza $\overline{AB}$ scelta dalla 80 qui non compare.
- Rette orizzontali $y = k$ e verticali $x = h$. "Orizzontale" e "verticale" sono le parole principali, "parallela all'asse $x$/$y$" è spiegata come sinonimo. Nella tabella dei casi della forma implicita ho scritto "orizzontale" e non "parallela all'asse $x$", così non si pone la questione se l'asse $x$ sia parallelo a se stesso.
- Bisettrici "del primo e del terzo quadrante" ($y = x$) e "del secondo e del quarto quadrante" ($y = -x$); nelle formule e nella figura i quadranti sono in numeri romani, come nella 80.
- Forma esplicita $y = mx + q$ con $m$ "coefficiente angolare" e $q$ "ordinata all'origine"; forma implicita $ax + by + c = 0$ con $a$ e $b$ non tutti e due zero. Alcuni libri la chiamano "forma generale" e $q$ "termine noto": non li cito.
- Forma implicita "di solito" con coefficienti interi senza divisori comuni e $a$ positivo, in un `ad-tip`: è un'abitudine, non una regola, e la lezione lo dice.
- La 68 scrive l'equazione lineare come $ax + by = c$: un `ad-note` avvisa che portando $c$ a primo membro cambia segno. Se si preferisce, si toglie senza toccare il resto.
- Il coefficiente angolare è introdotto nella sezione delle rette per l'origine con il solo significato operativo della 45 ("se $x$ aumenta di $1$, $y$ aumenta di $m$") e il link alla 82.
- L'apertura dice "ogni retta del piano ha un'equazione di primo grado" senza dimostrarlo: la dimostrazione (con i triangoli simili) sta meglio nella 82 o si omette, come fanno molti libri del biennio.

## Lasciato ad altre lezioni

- 80: piano, assi, quadranti, coordinate; solo il link nell'apertura.
- 82: il significato di $m$ come $\frac{\Delta y}{\Delta x}$, $m$ da due punti, $m = -\frac{a}{b}$ (nella 81 c'è solo il procedimento per ricavare $y$, con il link), $y - y_0 = m(x - x_0)$ e la retta per due punti. Nella 81 "disegnare con $q$ e $m$" usa solo lo spostamento a destra di $n$ passi e in su di $n \cdot m$.
- 83: parallelismo e perpendicolarità. La figura di $y = \frac{1}{2}x$ e $y = \frac{1}{2}x + 2$ mostra due rette parallele, ma la lezione dice solo "parallela" a parole, senza condizione.
- 84: intersezione tra due rette. La 81 cita la 68 solo per il legame tra equazione lineare e retta.
- 86: l'esempio 9 ha un parametro $k$, ma in una sola retta, non un fascio: chiede quando la retta è orizzontale, quando passa per un punto e se può passare per l'origine. Se sembra un'anticipazione dei fasci, si toglie; è però un esercizio classico di questo capitolo.
- La forma segmentaria $\frac{x}{p} + \frac{y}{q} = 1$ non c'è, perché il brief non la chiede. Alcuni libri la mettono proprio qui: vedi le domande per Andrea.

## Figure

Otto, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (anteprima PNG). Tutte con la griglia `gray!30`, gli assi con le tacche, i punti neri e le rette in tinte chiare (`blue!60`, `red!50`, `teal!60`, `gray!60`); niente `\clip`, niente riempimenti bianchi. Ho tolto le etichette delle tacche che una retta attraversava. Non le ho viste sul sito in tema scuro.
- `rette-parallele-agli-assi` (220×168): $y = 2$, $y = -1$, $x = 3$, $x = -2$.
- `bisettrici-dei-quadranti` (224×194): le due bisettrici, i punti $(2, 2)$ e $(-2, 2)$, i quadranti I-IV.
- `rette-per-origine-y-uguale-mx` (193×196): $y = 3x$, $y = \frac{1}{2}x$, $y = -2x$.
- `forma-esplicita-ordinata-origine` (217×191): $y = \frac{1}{2}x$ e $y = \frac{1}{2}x + 2$, con la freccia dello spostamento e il punto $(0, 2)$.
- `retta-intersezioni-con-gli-assi` (178×137, esempio 5): $2x - 3y + 6 = 0$ con $A(-3, 0)$ e $B(0, 2)$.
- `retta-da-ordinata-origine-e-coefficiente-angolare` (178×145, esempio 6): $y = -\frac{3}{4}x + 1$ con i passi $4$ e $-3$ da $P(0, 1)$ a $Q(4, -2)$.
- `retta-con-frazioni-punti-sugli-assi` (170×184, esempio 7): $y = \frac{3}{2}x + 3$ con $A$, $B$ e $P(-4, -3)$.
- `rette-verticale-orizzontale-per-origine` (178×171, esempio 8): $x = 2$, $y = -\frac{1}{2}$, $3x + 5y = 0$ con il punto $(5, -3)$.

Le quattro figure dentro i riquadri degli esempi sono sotto i 180 px di larghezza. Nessuna figura nel formulario.

## Formulario e flashcard

- Il formulario segue le sezioni della lezione, con la tabella dei casi della forma implicita e i due passaggi tra le forme; tre avvisi ($x = 3$ verticale, la divisione per $b$, $y = 0$ per l'asse $x$).
- 20 carte. Le carte `ordinata-origine-punto` ($y = 4x - 7$), `implicita-in-esplicita` ($x + 2y - 4 = 0$), `appartenenza-conto`, `intersezioni-conto` ($y = 2x - 4$) e `disegnare-q-m` ($y = \frac{2}{3}x + 1$) usano numeri che non sono nella lezione, con le regole della lezione.

## Prerequisiti

La riga `equazione-di-una-retta <- il-piano-cartesiano, funzioni-lineari` va bene così. La 80 porta assi, quadranti e coordinate; la 45 porta $y = mx$ e $y = mx + q$ come funzione e il loro grafico. La 81 linka anche la 68 (le soluzioni di un'equazione lineare formano una retta) e la 42 (la retta verticale non è una funzione, la tabella di valori), ma sono richiami: la 68 viene comunque prima nel percorso e la 42 arriva attraverso la 45. Non le aggiungerei.

## Per il generatore

1. Rette parallele agli assi e bisettrici: dall'equazione al tipo di retta ($x = -4$, $y = 3$, $y = -x$) e dal punto alle equazioni delle parallele agli assi che passano per lui, con coordinate anche frazionarie.
2. Dalla forma implicita a quella esplicita e viceversa, con $m$ e $q$ interi o frazionari e $b$ negativo; nel verso contrario, con i denominatori da togliere e $a$ da rendere positivo.
3. Appartenenza: dire se uno o due punti stanno su una retta data in forma implicita o esplicita, e trovare la coordinata mancante di un punto della retta.
4. Intersezioni con gli assi, anche con risultati frazionari, e riconoscere i casi senza intersezione (orizzontali e verticali) o con la sola origine.
5. Disegno: dalla forma esplicita trovare $(0, q)$ e il secondo punto con lo spostamento dato dal denominatore di $m$ (come nell'esempio 6); risposta come coppia di punti.
6. Equazioni scomode e parametri: equazioni con le frazioni da portare in forma implicita intera (esempio 7), equazioni con $a = 0$, $b = 0$ o $c = 0$ da classificare, e il parametro $k$ per cui la retta è orizzontale, verticale o passa per un punto, compreso il caso "nessun valore" (esempio 9).

## Da cambiare nelle lezioni già scritte

Niente di necessario. La 45 linka già questa lezione con il titolo giusto, e la 68 (sezione sull'interpretazione grafica) dice già che con $b = 0$ l'equazione è una retta verticale, in accordo con la 81. Facoltativo: nella 42, sezione "Grafico per punti", la frase "Come si disegnano con precisione rette e parabole lo vedrai al secondo anno." potrebbe diventare "Come si disegnano con precisione le rette lo vedrai nella lezione [Equazione della retta e casi particolari](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/equazione-della-retta-e-casi-particolari), e le parabole nella lezione [La parabola nel piano cartesiano](/materiale/scuola-superiore/matematica/circonferenza-e-coniche/la-parabola-nel-piano-cartesiano)." (l'URL della parabola va controllato con la 87 di questo lotto).

## Domande per Andrea

- Nome di $ax + by + c = 0$: ho scelto "forma implicita"; l'alternativa è "forma generale" (o citarle tutte e due).
- Rette parallele agli assi: ho usato $y = k$ e $x = h$ e le parole "orizzontale" e "verticale"; alternativa $y = b$ e $x = a$, o solo "parallela all'asse $x$/$y$".
- L'asse $x$ è "parallelo a se stesso"? Ho evitato la questione dicendo "orizzontale" nella tabella dei casi; alternativa: definire il parallelismo includendo le rette coincidenti, come fanno molti libri.
- Forma implicita "preferita" con coefficienti interi primi tra loro e $a$ positivo: l'ho data come abitudine in un riquadro; alternativa: non dirlo, o renderla una regola.
- Forma segmentaria $\frac{x}{p} + \frac{y}{q} = 1$: non c'è; alternativa: aggiungerla in un `ad-note` dopo le intersezioni con gli assi.
- Esempio 9 con il parametro $k$ in una sola retta: l'ho tenuto; alternativa: spostarlo nella lezione sui fasci di rette.
