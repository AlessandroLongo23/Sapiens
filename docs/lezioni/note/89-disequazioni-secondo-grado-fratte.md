# Note: Disequazioni fratte e sistemi di secondo grado

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: `solve_univariate_inequality` e `solveset` sulle disequazioni dei nove esempi, sulle varianti citate nel testo (verso $>$ nell'esempio 3, verso $\leq$ nell'esempio 6, area maggiore di $25$ e minore di $16$ nell'esempio 9 e nel suo avviso, $4 > x^2$ dell'avviso sul moltiplicare per $x$), `Intersection` per i sistemi degli esempi 7, 8 e 9, `discriminant` e `factor` dei trinomi, `together` per la riduzione dell'esempio 5; i valori delle verifiche ($x = 0$, $\pm 1$, $3$, $5$) a mano. Le formule in evidenza sono state misurate con KaTeX in Chromium: la più larga è 230 px (dentro un riquadro), nel formulario 178 px.

## Scelte di convenzione

- Un fattore di secondo grado occupa una riga sola della tabella dei segni, con i suoi due zeri (o uno, o nessuno); la scomposizione $a(x - x_1)(x - x_2)$ in due righe è citata come alternativa in un riquadro `ad-tip`. Molti libri fanno così, altri scompongono sempre: da verificare con il libro in uso.
- Il segno del trinomio è ripreso dalla lezione 88 in una tabella di tre righe per $a > 0$, più una frase per $a < 0$. Non ho visto la 88 scritta: la tabella dice solo il risultato, con le parole "positivo fuori dalle soluzioni, negativo tra le soluzioni". Se la 88 usa altre parole ("valori esterni / interni") o un'altra tabella, conviene allineare questa.
- Con $a < 0$ la lezione mostra tutti e due i modi: leggere il segno direttamente (esempio 5, $4 - x^2$ positivo tra le soluzioni) e raccogliere il meno e cambiare il verso (paragrafo dopo l'esempio 5). Il brief della 88 dice che lì si porta $a$ positivo: il secondo modo è quello coerente con la 88.
- Tabella dei segni, pallino vuoto per lo zero del denominatore nella riga della frazione, riga $S$ sotto la tabella: come la 54. Grafico del sistema: come la 53 (pallini, strisce arancioni). Nelle righe del grafico del sistema ho scritto la disequazione di partenza ($x^2 - 4 > 0$) e non la soluzione, perché la soluzione ha due pezzi e non sta in un'etichetta.
- Intervalli con `\mathopen{]}` e `\mathclose{[}`, "oppure" per l'unione in parole e $\cup$ negli insiemi, come 52-54. Punto isolato scritto $\{1\} \cup [3, +\infty[$.
- "Disequazione prodotto" usato come nome, senza grassetto di definizione: è un nome che i libri usano, ma la 54 non lo introduce.

## Lasciato ad altre lezioni

- Segno del trinomio, metodo della parabola, casi $\Delta = 0$ e $\Delta < 0$: 88 (e 87 per la parabola). Qui c'è solo il riassunto necessario alla tabella e una figura.
- Studio del segno e C.E.: 54. Grafico dei sistemi, disequazione sempre o mai vera in un sistema: 53. Procedimento dei problemi e limitazioni: 79. Scomposizione del trinomio: 77.
- Fattori di grado superiore al secondo, fattori ripetuti di primo grado come $(x - 1)^3$, disequazioni con il valore assoluto: fuori. Il capitolo "Equazioni e disequazioni di grado superiore" non ha ancora lezioni scritte.
- Frazioni in cui uno zero del numeratore coincide con uno del denominatore (frazione semplificabile): non trattate, come nella 54.

## Da cambiare nelle lezioni già scritte

- 54: il riquadro `ad-note` "Dove si usano" linka già questa lezione. Niente da cambiare.
- 53: niente da cambiare; la sezione sulle disequazioni sempre o mai vere vale anche qui ed è richiamata con una frase.

## Figure

Nove blocchi TikZ, generati da uno script (`89-figs.py` nello scratchpad) con gli stessi schemi della 54 (tabelle) e della 53 (grafici dei sistemi), così che le misure siano uniformi:

- `segno-trinomio-parabola-riga`: la parabola $y = x^2 - 2x - 3$ con la parte sopra l'asse in blu e quella sotto tratteggiata in arancione, e sotto la riga dei segni del trinomio. La curva è calcolata dalla funzione; gli zeri $-1$ e $3$ stanno sulla parabola. Scala diversa sui due assi (0,62 cm per unità in $x$, 0,22 in $y$), perché la parabola scende fino a $-4$ e sale fino a $5$: da verificare se disturba.
- sei tabelle dei segni (`disequazione-prodotto-trinomio`, `disequazione-prodotto-delta-negativo`, `disequazione-prodotto-delta-nullo`, `disequazione-fratta-numeratore-trinomio`, `disequazione-fratta-coefficiente-negativo`, `disequazione-fratta-quadrato-numeratore`), una per esempio 1-6, con la riga $S$;
- due grafici di sistema (`sistema-secondo-grado`, `sistema-secondo-grado-tre-disequazioni`) per gli esempi 7 e 8. Nell'esempio 8 le due strisce sono separate da un piccolo spazio in $3$, il punto escluso.

Compilate con `compileFigure` di `scripts/figure/compile.mjs`: larghe da 185 a 276 px, alte da 78 a 132 px; le tabelle hanno la retta accorciata a 4,5 cm (la 54 usa 4,8) perché le etichette dei trinomi, come $x^2 - 5x + 6$, sono più larghe. Guardate in PNG in chiaro e con il filtro del tema scuro; non sul sito. Segni, zeri e pallini di ogni tabella sono stati confrontati con le soluzioni di SymPy.

Il formulario non ha figure: la tabella dei segni è quella della 54, e il formulario della 54 la mostra già.

## Formulario e flashcard

- Formulario: tabella del segno del trinomio, tre procedimenti, una riga sui problemi, tre avvisi (moltiplicare per il denominatore, il fattore con $\Delta < 0$, il punto isolato).
- 19 carte, nell'ordine della lezione. Le carte `trinomio-a-negativo` e `problema-limitazioni` usano esempi della lezione; `sistema-mai-vera` usa $x^2 + 1 < 0$, citato nella lezione dopo l'esempio 8.

## Prerequisiti

La riga della bozza `disequazioni-secondo-grado-fratte <- disequazioni-secondo-grado, disequazioni-razionali, sistemi-di-disequazioni` va bene così. Le tre lezioni coprono le tre parti (segno del trinomio, tabella dei segni e C.E., grafico del sistema), e nessuna è antenata di un'altra: la 54 non passa per la 53. La sezione sui problemi richiama la 79 (`equazioni-secondo-grado-problemi`) per le limitazioni dell'incognita; si potrebbe aggiungerla, ma la lezione rispiega in una frase quello che serve, e non la metterei per non allungare la catena.

## Per il generatore

1. Prodotto di un fattore di primo grado e di un trinomio con $\Delta > 0$ e $a > 0$, verso stretto: $(x + 1)(x^2 - 5x + 6) > 0$, $S = \,]-1, 2[\, \cup \,]3, +\infty[$.
2. Prodotto con un trinomio a $\Delta < 0$ (sempre positivo): $(x^2 + x + 1)(x - 2) \leq 0$, $S = \,]-\infty, 2]$. Distrattore: $S = \emptyset$.
3. Prodotto con un quadrato ($\Delta = 0$), verso largo o stretto: $(x - 3)(x^2 - 2x + 1) \geq 0$, $S = \{1\} \cup [3, +\infty[$. Distrattore: $[3, +\infty[$ senza il punto isolato.
4. Fratta con un trinomio al numeratore o al denominatore, già nella forma $\frac{N}{D}$: $\frac{x^2 - 2x - 3}{x - 2} \geq 0$, $S = [-1, 2[\, \cup [3, +\infty[$. Distrattore: $2$ incluso.
5. Fratta da portare a primo membro, con $a < 0$ dopo la riduzione: $\frac{4}{x} > x$, $S = \,]-\infty, -2[\, \cup \,]0, 2[$. Distrattore: $]-2, 2[$ (moltiplicare per $x$).
6. Sistema di due disequazioni di secondo grado: $x^2 - 4x + 3 \leq 0$ e $x^2 - 4 > 0$, $S = \,]2, 3]$. Distrattore: l'unione invece dell'intersezione.
7. Problema con un'area: rettangolo di perimetro $2p$, area maggiore di $A$, con le limitazioni $0 < x < p$: $3 < x < 7$ per $p = 10$, $A = 21$.

Il controllo del generatore deve verificare che gli zeri del denominatore non siano mai inclusi, che gli zeri isolati dei quadrati siano inclusi con $\geq$ e $\leq$ ed esclusi con $>$ e $<$, e che uno zero del numeratore non coincida con uno del denominatore. Nel livello 7 conviene scegliere $A$ minore di $\frac{p^2}{4}$ (l'area massima, del quadrato), altrimenti il problema è impossibile; un caso con $A = \frac{p^2}{4}$ o maggiore si può tenere come variante scomoda, ma la risposta allora è "nessun rettangolo".

## Domande per Andrea

- Fattore di secondo grado nella tabella dei segni: una riga sola con i due zeri (scelta fatta), oppure scomporre sempre in due fattori di primo grado quando $\Delta > 0$?
- Trinomio con $a < 0$ in una fratta: la lezione legge il segno direttamente (positivo tra le soluzioni) e mostra come alternativa il raccoglimento del meno con il cambio di verso. Quale dei due si insegna come metodo principale?
- Zero del denominatore nella riga della frazione: pallino vuoto, come nella 54, oppure la croce o il simbolo $\nexists$ di molti libri?
- Nel grafico del sistema le righe portano la disequazione di partenza ($x^2 - 4 > 0$) e non la soluzione, perché la soluzione ha due pezzi. Va bene, o si preferisce numerare le righe (1), (2), (3)?
- Il nome "disequazione prodotto" per $(x + 1)(x^2 - 5x + 6) > 0$: si usa in classe, o si dice solo "disequazione scomposta in fattori"?
