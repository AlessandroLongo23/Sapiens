# Note: Disequazioni di secondo grado

Lezione nuova, scritta da zero (lotto 8). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`solve_univariate_inequality` su ogni disequazione degli esempi, delle sezioni sul segno, degli avvisi e delle carte, 36 in tutto; `discriminant`, `solve` e `factor` su ogni trinomio; il vertice $-\frac{b}{2a}$ e il suo valore; $\sqrt{20} = 2\sqrt{5}$ e le approssimazioni $-3{,}24$ e $1{,}24$; le verifiche numeriche con $x = 0$, $x = 2$, $x = -1$, $x = -5$). Lo stesso script controlla che ogni punto disegnato sull'asse $x$ delle figure annulli il suo trinomio. Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 226 px.

## Struttura ed esempi

Forma normale ed equazione associata, con il passaggio ad $a$ positivo (link alla 52) e un avviso sul verso. Poi il segno del trinomio con la parabola (link alla 87) nei tre casi del discriminante con $a > 0$, tutti con trinomi che hanno l'asse $x = 1$ ($x^2 - 2x - 3$, $(x - 1)^2$, $x^2 - 2x + 3$), e il caso $a < 0$ con $-x^2 + 2x + 3$. Tabella riassuntiva (verso per righe, $\Delta$ per colonne, quattro colonne), procedimento in cinque passi.

Otto esempi svolti:

1. $x^2 - x - 6 \leq 0$, valori interni, $S = [-2, 3]$;
2. $2x^2 - 3x - 2 > 0$, valori esterni con uno zero frazionario;
3. $4x - x^2 > 3$, tutto a primo membro e poi $a$ positivo, $S = \,]1, 3[$;
4. $x^2 + 2x - 4 \geq 0$, soluzioni $-1 \pm \sqrt{5}$;
5. $x^2 - 6x + 9$ con i quattro versi ($\Delta = 0$, come chiede il brief);
6. $-2x^2 + x - 1 \geq 0$, $\Delta < 0$ con $a$ negativo, impossibile (e il verso opposto sempre vero);
7. $x^2 < 9$, pura;
8. $x^2 > 3x$, spuria.

Tra l'esempio 4 e i casi scomodi c'è la sezione sul metodo della scomposizione, con l'esempio 1 rifatto con la tabella dei segni della 54. Avvisi (`ad-warning`), ognuno dopo il suo punto: cambiare i segni senza il verso, fermarsi all'equazione associata, dimenticare il coefficiente $a$ nella scomposizione, dimenticare il punto di contatto con $\Delta = 0$, "$\Delta$ negativo non vuol dire impossibile", $x < \pm 3$, dividere per $x$; in fondo due generici (leggere il verso senza guardare $a$, risolvere senza zero a secondo membro).

## Scelte di convenzione (da verificare con il libro in uso)

- Intervalli con le quadre rivolte verso l'esterno, scritti con `\mathopen{]}` e `\mathclose{[}` e `\,` dopo `=` e `\cup`, come le 53 e 54; con estremi frazionari o irrazionali `\left]` e `\right[`. In parole "$x < -1$ oppure $x > 3$", come la 54.
- Soluzioni dell'equazione associata $x_1$ e $x_2$ con $x_1 < x_2$, come la 17; con $\Delta = 0$, $x_1 = x_2 = -\frac{b}{2a}$.
- "Valori esterni" e "valori interni" (all'intervallo delle soluzioni), in grassetto dove sono definiti. È la formula più diffusa nei libri italiani che ho in mente, ma alcuni dicono "intervalli esterni" o danno la regola come "segno concorde con $a$ per i valori esterni". Vedi le domande per Andrea.
- Si porta sempre $a$ positivo, come chiede il brief; la tabella riassuntiva vale solo per $a > 0$. Il caso $a < 0$ è descritto in una sezione con una figura, ma non ha una sua tabella.
- $\mathbb{R}$ minus un punto scritto $\mathbb{R} \setminus \{3\}$, come le 43 e 49, accompagnato da "$x \neq 3$".
- $\geq$ e $\leq$ (come la 54), non `\ge` e `\le` (come la 52): a video sono uguali.
- "Concavità rivolta verso l'alto/verso il basso": da allineare con la 87, che non ho visto.

## Lasciato ad altre lezioni

- Il grafico della parabola (vertice, asse, concavità al variare di $a$): link alla 87, qui solo quello che serve per il segno. Il vertice compare solo come punto di contatto con $\Delta = 0$.
- Formula risolutiva, pure e spurie: link alla 17. Scomposizione $a(x - x_1)(x - x_2)$: link alla 77. Tabella dei segni: link alla 54, con un solo esempio (l'esempio 1 rifatto).
- Disequazioni fratte, prodotto con fattori di secondo grado, sistemi e problemi: alla 89. La lezione non la linka, perché non ne ha bisogno; se si vuole un rimando finale, un `ad-note` come quello della 54.
- Il completamento del quadrato per spiegare perché con $\Delta < 0$ il trinomio ha il segno di $a$: lasciato fuori, perché la figura lo mostra. Se si vuole, è un `ad-note` di tre righe.

## Figure

Tredici blocchi TikZ, generati da uno script (`88-figs.py` nello scratchpad) e compilati con `compileFigure` di `scripts/figure/compile.mjs`; guardati in PNG in chiaro e con il filtro del tema scuro applicato a un riquadro bianco (così lo sfondo si inverte come sul sito). Larghezza da 178 a 225 px, la tabella dei segni 262 px; altezza da 115 a 211 px.

- Sezione sul segno, stessa scala per le quattro: `segno-trinomio-delta-positivo`, `segno-trinomio-delta-nullo`, `segno-trinomio-delta-negativo`, `segno-trinomio-a-negativo`. Regioni tra parabola e asse `blue!15` dove il trinomio è positivo e `red!15` dove è negativo, con i segni $+$ e $-$.
- Esempi: `disequazione-secondo-grado-valori-interni`, `-valori-esterni`, `-a-negativo`, `-soluzioni-irrazionali`, `-delta-nullo` (quattro righe, una per verso), `-delta-negativo`, `disequazione-pura-x-quadro-minore-9`, `disequazione-spuria-x-quadro-maggiore-3x`. L'arco che risolve la disequazione è `blue!60` spesso, la regione `blue!15`, e sotto c'è la riga $S$ con i pallini come nella 54, collegata agli zeri da guide tratteggiate.
- `disequazione-secondo-grado-tabella-segni`: tabella dei segni di $(x + 2)(x - 3)$ con lo stesso schema e le stesse misure delle tabelle della 54.

Le parabole sono spezzate (`plot[smooth] coordinates`) con i punti calcolati, e il dominio è scelto in modo che la curva resti nel riquadro: niente `\clip`, niente riempimenti bianchi, niente `\mathbb`. Gli assi non hanno tacche oltre agli zeri; la scala verticale è diversa da quella orizzontale (le figure mostrano il segno, non le misure). Nell'esempio 5 la guida tratteggiata passa dentro il pallino vuoto della riga $> 0$: si vede, ma non confonde.

Il formulario copia `segno-trinomio-delta-positivo`.

## Formulario e flashcard

- Formulario: forma normale, segno con $a > 0$, figura, tabella riassuntiva, procedimento con l'esempio 1, scomposizione, casi particolari, tre avvisi.
- 18 carte, nell'ordine della lezione; tutti i numeri vengono dalla lezione.

## Da cambiare nelle lezioni già scritte

- 78 (Equazioni parametriche), nel paragrafo dopo l'esempio con il discriminante di primo grado: "la condizione $\Delta \geq 0$ è una disequazione di secondo grado, che studierai più avanti" diventa "la condizione $\Delta \geq 0$ è una [disequazione di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado)".
- 17 e 54 linkano già questa lezione (la 17 in fondo, la 54 nel riquadro "Dove si usano"): niente da cambiare.
- 54: l'avviso "Il quadrato maggiore di un numero" ($x^2 > 9$) resta giusto; qui c'è il caso gemello $x^2 < 9$.

## Prerequisiti

La riga della bozza, `disequazioni-secondo-grado <- funzioni-quadratiche, disequazioni-primo-grado`, ha un arco ridondante: con la bozza del lotto, `disequazioni-primo-grado` è già antenata di `funzioni-quadratiche` (attraverso `il-piano-cartesiano`, `radicali-operazioni`, `numeri-reali-radici`), e lo script la segnalerebbe. La cambierei in

```
disequazioni-secondo-grado <- funzioni-quadratiche
```

Anche `equazioni-secondo-grado` è già antenata attraverso `funzioni-quadratiche`. `disequazioni-razionali` (54) e `equazioni-secondo-grado-relazioni` (77) servono solo alla sezione sul metodo della scomposizione, che è un'alternativa: la lezione si segue senza. Se si vuole che quella sezione conti, la riga diventa `disequazioni-secondo-grado <- funzioni-quadratiche, disequazioni-razionali`, ma allora nella riga della 89 l'arco `disequazioni-razionali` diventa ridondante e va tolto.

## Per il generatore

1. $a = 1$, $\Delta > 0$, soluzioni intere, verso stretto o largo: valori interni o esterni ($x^2 - x - 6 \leq 0$, $S = [-2, 3]$). Distrattori: le due soluzioni dell'equazione come risposta; interni ed esterni scambiati.
2. $a \neq 1$ positivo, una o due soluzioni frazionarie ($2x^2 - 3x - 2 > 0$). Distrattore: denominatore $2$ al posto di $2a$.
3. Termini in tutti e due i membri o $a$ negativo, da riportare ad $a > 0$ ($4x - x^2 > 3$, $S = \,]1, 3[$). Distrattore: verso non cambiato.
4. Soluzioni irrazionali con il radicale da semplificare ($x^2 + 2x - 4 \geq 0$). Distrattore: estremi in ordine sbagliato.
5. $\Delta = 0$, uno dei quattro versi ($x^2 - 6x + 9$: $x \neq 3$, $\mathbb{R}$, $\emptyset$, $\{3\}$), anche con $a$ negativo. Distrattori: $\emptyset$ per $\leq 0$, $\mathbb{R}$ per $> 0$.
6. $\Delta < 0$, sempre verificata o impossibile secondo verso e segno di $a$ ($-2x^2 + x - 1 \geq 0$). Distrattore: "impossibile" per ogni verso.
7. Incomplete: pure ($x^2 < 9$, $x^2 \geq 16$, $x^2 + 4 > 0$) e spurie ($x^2 > 3x$). Distrattori: $x < 3$, $x > 3$ dopo aver diviso per $x$.

Il controllo del generatore deve verificare che gli estremi siano inclusi solo con $\geq$ e $\leq$ e che, con $\Delta = 0$, le risposte dei quattro versi siano quelle della tabella.

## Domande per Andrea

- Nome della regola: "valori esterni" e "valori interni" (all'intervallo delle soluzioni); l'alternativa è "intervalli esterni/interni" o la regola "segno concorde con $a$ fuori dalle soluzioni, discorde dentro".
- Con $a < 0$ la lezione moltiplica sempre per $-1$ e cambia il verso, e la tabella riassuntiva è solo per $a > 0$; l'alternativa è leggere direttamente la parabola rivolta verso il basso, con una seconda tabella.
- Ordine dei metodi: prima la parabola, poi la scomposizione con la tabella dei segni come alternativa; alcuni libri partono dalla scomposizione e arrivano alla parabola dopo.
- Soluzioni di $(x - 3)^2 > 0$ scritte $\mathbb{R} \setminus \{3\}$ e "$x \neq 3$"; l'alternativa è l'unione di intervalli $]-\infty, 3[\, \cup \,]3, +\infty[$, o "$\forall x \neq 3$".
- Il vertice non si calcola per risolvere una disequazione (servono solo la posizione degli zeri e la concavità); alcuni insegnanti chiedono comunque il disegno completo della parabola.
