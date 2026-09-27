# Note: Coefficiente angolare e retta per due punti

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `82-verifica.py` nello scratchpad): i coefficienti angolari con `Line(...).slope` (esempi 1, 2, 3, 10, 11 e le carte), $m = -\frac{a}{b}$ con `solve` sulle due rette dell'esempio 4 e su $2y = 6x + 1$, le rette per un punto degli esempi 5 e 6 (anche la retta sbagliata dell'avviso sul segno, che passa davvero per $(3, 4)$), le rette per due punti degli esempi 7 e 8 con `Line(...).equation()`, i due sistemi con `linsolve` (quello impossibile con $A(2, 1)$ e $B(2, 5)$ dà `EmptySet`), l'allineamento con `Point.is_collinear`, $k = 6$ con `solve`, e la formula della retta per due punti moltiplicata per $-4$. Anche le figure: ogni punto disegnato ha le coordinate del testo e sta sulla sua retta, e gli estremi dei segmenti che disegnano le rette stanno sulle rette ($y = \frac{2}{3}x + \frac{1}{3}$, $y = -2x + 5$, $y = -\frac{3}{2}x + 3$, le quattro rette per l'origine). La formula in evidenza più larga misura 216 px con KaTeX a 17 px di base. `check.mts` passa sui tre file.

## Scelte di convenzione (da verificare con il libro in uso)

- Punti $A(2, -3)$ con la virgola, coordinate $x_A$, $y_A$, frazioni per le coordinate non intere ($A\left(\frac{1}{2}, 1\right)$), come deciso per il lotto.
- $\Delta x$ e $\Delta y$ definiti come differenze "da $A$ a $B$", letti "delta $x$". Alcuni libri non usano $\Delta$ e scrivono subito la formula con le coordinate.
- $m_{AB}$ per il coefficiente angolare della retta $AB$, scelto per l'allineamento; scritto in `82-convenzioni.md` per le altre lezioni.
- Punto dato $P(x_0, y_0)$ e formula $y - y_0 = m(x - x_0)$, la scrittura più diffusa; alcuni libri usano $P_0$ o $(x_1, y_1)$.
- Retta verticale: "non ha coefficiente angolare". Non ho scritto "$m$ infinito", che alcuni insegnanti usano a voce ma che al biennio confonde.
- Il nome "coefficiente angolare" spiegato con la bisettrice e i $45^\circ$, senza tangente: la trigonometria non è ancora fatta. La pendenza stradale in percentuale è solo nell'apertura.
- La formula classica $\frac{y - y_A}{y_B - y_A} = \frac{x - x_A}{x_B - x_A}$ è in un riquadro `ad-note`, presentata come riassunto dei passi 2 e 3; il metodo principale è "prima $m$, poi la retta per un punto", che non ha casi esclusi da ricordare oltre alla verticale.
- Allineamento: solo con i coefficienti angolari (e, in una riga, controllando se $C$ sta sulla retta $AB$). Non ho messo il metodo con il determinante né quello con le distanze ($\overline{AB} + \overline{BC} = \overline{AC}$).

## Lasciato ad altre lezioni

- Forma esplicita e implicita, passaggio dall'una all'altra, rette parallele agli assi, bisettrici: 81 (link nell'apertura). Qui solo quello che serve per leggere $m$.
- Parallelismo e perpendicolarità: 83. Citato solo nell'avviso sui quattro punti ($m_{AB} = m_{CD}$), con il link, e nell'avviso "Pendenza e ordinata all'origine" ($y = 2x$ e $y = 2x + 5$ parallele), senza condizione formale.
- Fascio di rette per un punto: 86 (link nel riquadro sulle rette per un punto, che spiega perché la verticale manca).
- Sistemi: 68 (link nella sezione "Con il sistema"). Parabola per tre punti: 87 (link come esempio di uso del sistema).
- Funzioni crescenti e decrescenti: la lezione non è scritta, quindi "sale" e "scende" senza link.

## Da cambiare nelle lezioni già scritte

- 45 (Proporzionalità diretta e inversa): facoltativo. Nell'esempio 5 della sezione "Riconoscere il tipo da una tabella", dopo "vanno divisi per gli aumenti di $x$", si può aggiungere: "Questo rapporto è il coefficiente angolare della retta, spiegato nella lezione [Coefficiente angolare e retta per due punti](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/coefficiente-angolare-e-retta-per-due-punti)."
- 42 (Definizione di funzione): niente da cambiare.

## Figure

Cinque, compilate con `compileFigure` e guardate in PNG (anteprima chiara e con il filtro del tema scuro). Griglia `gray!25`, rette in tinte chiare (`blue!60`, `red!50`, `teal!60`, `violet!50`), punti neri, un punto rosso chiaro per quello non allineato.
- `coefficiente-angolare-delta-x-delta-y` (179×157): $y = \frac{2}{3}x + \frac{1}{3}$ con $A(1, 1)$, $B(4, 3)$ e i due cateti $\Delta x = 3$, $\Delta y = 2$.
- `coefficiente-angolare-rette-per-origine` (193×180): quattro rette per $O$ con $m = 3$, $1$, $\frac{1}{3}$, $-2$.
- `coefficiente-angolare-retta-orizzontale-verticale` (188×159, nell'esempio 3): $y = 4$ per $C$, $D$ e $x = 2$ per $E$, $F$. Tolti i numeri $4$ e $2$ sugli assi, che si sovrapponevano alle rette: le rette sono etichettate con l'equazione.
- `retta-per-due-punti-a-b` (145×191, nell'esempio 7): $y = -2x + 5$ con $A(1, 3)$, $B(3, -1)$ e gli spostamenti tratteggiati.
- `tre-punti-allineati-e-non` (153×191, nell'esempio 10): la retta $AB$ passa per $D(4, -3)$, e $C(4, -2)$ sta un'unità sopra.

Tutte sotto i 280 px. Non viste sul sito. Il formulario non ha figure.

## Formulario e flashcard

- Formulario: tabella del segno di $m$, le quattro formule ($\frac{\Delta y}{\Delta x}$, da due punti, $-\frac{a}{b}$, retta per un punto), i passi della retta per due punti con la formula classica e il sistema, l'allineamento, tre avvisi.
- 20 carte, tutte su regole ed esempi della lezione.

## Prerequisiti

La bozza `il-coefficiente-angolare <- equazione-di-una-retta` è corta di un arco. La cambierei in

```
il-coefficiente-angolare <- equazione-di-una-retta, sistemi-di-equazioni
```

perché la sezione "Retta per due punti: con il sistema" (esempio 9, e il caso impossibile con due punti sulla stessa verticale) chiede di impostare e risolvere un sistema in $m$ e $q$, e i sistemi non sono tra gli antenati di `equazione-di-una-retta` (che arriva da `il-piano-cartesiano` e `funzioni-lineari`). Se si considera quella sezione un'alternativa facoltativa, la riga della bozza va bene così: il resto della lezione si segue con la sola 81.

## Per il generatore

1. Coefficiente angolare da due punti con coordinate intere, anche negative; riconoscere $m = 0$ e il caso senza coefficiente angolare (stessa ascissa).
2. Coefficiente angolare dalla forma implicita ($m = -\frac{a}{b}$), anche con $b$ negativo, e da equazioni non ancora esplicite come $2y = 6x + 1$.
3. Retta per un punto con $m$ dato, $m$ intero, forma esplicita: $P(2, -1)$, $m = 3$ dà $y = 3x - 7$.
4. Retta per un punto con $m$ frazionario e coordinate negative, risposta in forma implicita con coefficienti interi: $P(-3, 4)$, $m = -\frac{2}{3}$ dà $2x + 3y - 6 = 0$.
5. Retta per due punti, compreso il caso verticale $x = x_A$ e orizzontale $y = y_A$, con coefficiente angolare anche frazionario: $A(-4, -1)$, $B(2, 3)$ dà $2x - 3y + 5 = 0$.
6. Tre punti allineati o no (con distrattori quasi allineati come l'esempio 10), e la coordinata incognita di un punto perché sia allineato ($C(k, 11)$ con $A(1, 1)$, $B(3, 5)$: $k = 6$).

Il controllo del generatore deve verificare con `Line` e `Point.is_collinear` di SymPy, normalizzare la forma implicita (coefficienti interi primi tra loro, $a > 0$) prima di confrontarla, e nel livello 6 escludere i valori che mettono due punti sulla stessa verticale.

## Domande per Andrea

- Retta verticale: ho scritto "non ha coefficiente angolare"; alternativa: dire anche che "a volte si dice che $m$ è infinito", che alcuni insegnanti usano.
- Metodo principale per la retta per due punti: "prima $m$, poi $y - y_A = m(x - x_A)$", con la formula $\frac{y - y_A}{y_B - y_A} = \frac{x - x_A}{x_B - x_A}$ in un riquadro facoltativo; alternativa: la formula come metodo principale, come fanno molti libri.
- Nome dell'angolo: $m$ spiegato solo come pendenza e con i $45^\circ$ della bisettrice; alternativa: aggiungere $m = \tan \alpha$ quando ci sarà la lezione sulla tangente.
- Allineamento di tre punti: solo con i coefficienti angolari; alternativa: aggiungere il controllo con le distanze ($\overline{AB} + \overline{BC} = \overline{AC}$) o con il determinante, se il libro in uso li fa.
- Notazione $\Delta x$, $\Delta y$ introdotta già qui; alternativa: solo la formula con le coordinate, lasciando $\Delta$ alla fisica.
