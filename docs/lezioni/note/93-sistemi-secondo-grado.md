# Note: Sistemi di secondo grado

Lezione nuova, scritta da zero (lotto 9). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `lotto9/93/verifica.py` nello scratchpad (28 controlli): `solve` su ogni sistema degli esempi, delle note, degli avvisi e delle carte, tenendo le soluzioni reali, confrontate con l'insieme $S$ scritto nella lezione; `expand` e `discriminant` su ogni risolvente e ogni equazione in $t$; l'identità $x^2 + y^2 = (x + y)^2 - 2xy$; la coppia $(1, -1)$ dell'avviso, che risolve solo la seconda equazione; `solve_univariate_inequality` per controllare che la parabola stia tutta sopra la tangente $y = 2x - 7$ (frase dell'esempio 4); il sistema di grado $4$ dell'elenco, che ha davvero quattro soluzioni reali. Lo script delle figure (`lotto9/93/figs.py`) controlla che ogni punto disegnato stia sulla parabola e sulla retta, e che il discriminante di ogni risolvente corrisponda al numero di punti disegnati. Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 246 px (il ritorno da $y$ a $x$ nell'esempio 1).

## Struttura ed esempi

Apertura con il rettangolo di perimetro $14$ e area $12$ e la riga che distingue la lezione dalla 89 (sistemi di disequazioni in una incognita), come chiede il brief. Poi il grado di un'equazione in due incognite (link alla lezione sul grado di un polinomio) e del sistema (link alla 68, che dà già la definizione come prodotto dei gradi), con un sistema di grado $4$ come controesempio. Metodo di sostituzione in cinque passi, con l'equazione risolvente e i tre casi del suo discriminante; retta e parabola con la tabella secante, tangente, esterna; sistemi simmetrici con $t^2 - st + p = 0$ (link alla 77); problemi.

Nove esempi svolti:

1. $x - 2y = 1$, $xy = 3$: si ricava $x$, risolvente in $y$, soluzioni frazionarie;
2. $2x - y = 1$, $x^2 + y^2 = 2$: quadrato di un binomio, $S = \left\{\left(-\frac{1}{5}, -\frac{7}{5}\right), (1, 1)\right\}$;
3. $y = x^2 - 2x - 3$, $y = x - 3$: secante in $(0, -3)$ e $(3, 0)$;
4. stessa parabola e $y = 2x - 7$: tangente in $(2, -3)$;
5. stessa parabola e $y = x - 6$: esterna, impossibile;
6. $x + y = 1$, $xy = -6$: simmetrico, $S = \{(-2, 3), (3, -2)\}$, con il confronto con la sostituzione;
7. $x + y = 5$, $x^2 + y^2 = 13$: dalla somma dei quadrati al prodotto;
8. rettangolo con perimetro $14$ e area $12$: lati $3$ e $4$, le due coppie sono lo stesso rettangolo;
9. rettangolo con perimetro $34$ e diagonale $13$: lati $5$ e $12$.

Nel testo, senza riquadro: il simmetrico con $\Delta = 0$ ($x + y = 6$, $xy = 9$), quello impossibile ($x + y = 2$, $xy = 5$), il rettangolo impossibile (perimetro $20$, area $30$) collegato al risultato dell'esempio 9 della 89 (area massima $25$). Un `ad-note` sulle rette verticali: $x = 1$ incontra la parabola in un punto ma non è tangente. Avvisi, ognuno dopo il suo punto: ricavare l'altra incognita dall'equazione di secondo grado, scrivere le soluzioni come numeri, dimenticare la coppia scambiata, il segno della somma in $t^2 - st + p = 0$ (lo stesso avviso della 77).

La parabola degli esempi 3-5 è $y = x^2 - 2x - 3$, la stessa delle figure della 88.

## Scelte di convenzione (da verificare con il libro in uso)

- Soluzioni come insieme di coppie, $S = \{(3, 4), (4, 3)\}$, come la 68; le coppie in ordine crescente di $x$. I punti comuni scritti come coppie senza nome, $(0, -3)$; la 84 dà un nome al punto ($P(2, 3)$), qui i punti sono due e i nomi non servono.
- "Equazione risolvente", in grassetto dove è definita: è il termine dei libri che ho in mente. Alcuni dicono solo "equazione in una incognita".
- Con $\Delta = 0$ la lezione dice "una coppia" e "un punto"; alcuni libri dicono "due soluzioni coincidenti", come la 17 per le equazioni. Nel sistema ho preferito contare le coppie, che è quello che lo studente scrive in $S$.
- Retta "secante", "tangente", "esterna" in grassetto nella tabella. Sono i nomi della geometria della circonferenza; per la parabola alcuni libri dicono "non ha punti in comune" invece di "esterna".
- L'incognita dell'equazione ausiliaria dei simmetrici si chiama $t$ (la 77 usa $x$ in $x^2 - sx + p = 0$); lo dice la lezione.
- Sistema simmetrico definito come "resta lo stesso scambiando $x$ con $y$". Alcuni libri distinguono simmetrici "fondamentali" ($x + y = s$, $xy = p$) e "riconducibili": la lezione non usa i due nomi.
- Il grado dell'equazione $xy = 12$ spiegato con il grado del polinomio (il termine $xy$ ha grado $2$), link alla lezione sui polinomi.

## Lasciato ad altre lezioni

- Metodi di riduzione e confronto con equazioni di secondo grado, sistemi di grado $4$ (due equazioni di secondo grado), sistemi simmetrici di grado superiore ($x^2 + y^2 = a$, $xy = b$), sistemi con $x - y = s$ (si riportano ai simmetrici con $-y$): fuori. Il sistema di grado $4$ compare solo come esempio di grado.
- Retta e parabola sono solo nel caso $y = ax^2 + bx + c$ e $y = mx + q$; le rette tangenti a una parabola e i fasci sono nella lezione "Parabola e rette" del capitolo Circonferenza e coniche, oggi vuota e non linkata.
- Il teorema di Pitagora nell'esempio 9 è citato senza link: la lezione "Teoremi di Pitagora e di Euclide" non è ancora scritta. Quando lo sarà, va aggiunto il link.
- Discussione dei sistemi letterali o parametrici: fuori.

## Figure

Tre blocchi TikZ, generati da `lotto9/93/figs.py` e compilati con `compileFigure` di `scripts/figure/compile.mjs` (script `lotto9/render.mjs`); guardati in PNG in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`) su un riquadro bianco.

- `sistema-retta-parabola-secante` (179x144), `sistema-retta-parabola-tangente` (156x150), `sistema-retta-parabola-esterna` (188x144), dentro gli esempi 3, 4 e 5. Stessa parabola, stesso riquadro e stessa scala per le tre: parabola `blue!60`, retta `red!50` con il nome accanto, punti comuni con le coordinate. La scala verticale (0,33 cm) è diversa da quella orizzontale (0,6 cm), come nelle figure della 88: la tangenza resta visibile, perché un cambio di scala sugli assi non la cambia.

Nessuna griglia né tacche: le coordinate dei punti sono scritte accanto. Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`.

## Formulario e flashcard

- Formulario: grado, sostituzione con la tabella del discriminante e l'esempio 1, retta e parabola con la tabella e gli esempi 3-5 in una riga, simmetrici, problemi del rettangolo, tre avvisi. Nessuna figura: le tabelle bastano.
- 18 carte, nell'ordine della lezione.

## Da cambiare nelle lezioni già scritte

- 68 (Sistemi di due equazioni in due incognite), sezione "Forma normale e grado": "il sistema formato da $x + y = 5$ e $xy = 6$ ha grado $1 \cdot 2 = 2$ e si risolve con le equazioni di secondo grado, nella lezione sui sistemi di secondo grado" diventa "il sistema formato da $x + y = 5$ e $xy = 6$ ha grado $1 \cdot 2 = 2$ e si risolve con le equazioni di secondo grado, nella lezione [Sistemi di secondo grado](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado)".
- 77 (Relazioni tra soluzioni e coefficienti), facoltativo: in fondo alla sezione sulla forma $x^2 - sx + p = 0$ si può aggiungere "Con la stessa equazione si risolvono i [sistemi simmetrici](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/sistemi-di-secondo-grado) $x + y = s$, $xy = p$."

## Prerequisiti

La riga del brief è senza archi ridondanti (controllato sul grafo di `prerequisiti.md`: nessuna delle tre è antenata delle altre):

```
sistemi-secondo-grado <- sistemi-di-equazioni, equazioni-secondo-grado-relazioni, funzioni-quadratiche
```

La lezione cita anche la 84 (intersezione tra due rette) come modello per retta e parabola, ma non come prerequisito: se si volesse aggiungerla, `sistemi-di-equazioni` diventerebbe ridondante (è antenata di `intersezione-tra-due-rette` attraverso `il-coefficiente-angolare`), e la riga sarebbe `sistemi-secondo-grado <- intersezione-tra-due-rette, equazioni-secondo-grado-relazioni, funzioni-quadratiche`.

## Per il generatore

1. Sostituzione con un'incognita di coefficiente $1$ e seconda equazione $xy = p$ ($x - 2y = 1$, $xy = 3$). Distrattori: una sola coppia; le coppie con $x$ e $y$ scambiati; l'insieme dei soli valori di $y$.
2. Seconda equazione con quadrati ($2x - y = 1$, $x^2 + y^2 = 2$), soluzioni frazionarie. Distrattori: $(1, -1)$ (ricavata dall'equazione di secondo grado); il quadrato senza doppio prodotto.
3. Retta e parabola: dire se la retta è secante, tangente o esterna e trovare i punti ($y = x^2 - 2x - 3$ con $y = x - 3$, $y = 2x - 7$, $y = x - 6$). Distrattori: "tangente" con $\Delta > 0$; punti con l'ordinata calcolata male.
4. Simmetrici $x + y = s$, $xy = p$ con soluzioni intere, anche negative ($s = 1$, $p = -6$), e i casi con $\Delta = 0$ e $\Delta < 0$. Distrattori: una sola coppia; $t^2 + st + p = 0$ (coppie con i segni cambiati, $(-3, 2)$).
5. Simmetrici con la somma dei quadrati ($x + y = 5$, $x^2 + y^2 = 13$). Distrattore: $xy = 12$ (dimenticare il $2$ di $2xy$).
6. Problemi: rettangolo con perimetro e area, o perimetro e diagonale. Distrattori: la somma dei lati uguale al perimetro invece che a metà; due rettangoli diversi per le due coppie.

## Domande per Andrea

- "Equazione risolvente": è il nome che usano i ragazzi in classe?
- Con $\Delta = 0$: "una soluzione" o "due soluzioni coincidenti" del sistema?
- Retta "esterna" alla parabola va bene, o si dice solo "non ha punti in comune"?
- Nei sistemi simmetrici, l'incognita ausiliaria si chiama $t$ o $z$ nei libri che usate?
- Servono in questa lezione i sistemi di grado $4$ simmetrici ($x^2 + y^2 = 25$, $xy = 12$) e quelli con $x - y = s$, che molti libri del biennio trattano?
