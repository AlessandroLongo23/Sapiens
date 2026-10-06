# Note: Ellisse

Lezione nuova, scritta da zero (lotto del terzo anno, gruppo D, 5 ottobre 2026). Non pubblicata. Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`gruppo-d/verifica.py` nello scratchpad della sessione, 57 controlli sulle tre lezioni): le distanze $\frac{37}{5}$ e $\frac{13}{5}$, i due passaggi al quadrato della dimostrazione, le tre risolventi dell'esempio 4 con i loro discriminanti, il discriminante in funzione di $q$ scritto sotto il piano, lo sdoppiamento in $T(4, 1)$, la risolvente e $\frac{\Delta}{4}$ dell'esempio 6 con le soluzioni $m = -1$ e $m = \frac{1}{4}$, il punto $T_2(-2, 2)$, il sistema dell'esempio 7, le eccentricità della figura, il caso del riquadro "Se trovi un solo valore di m" (da $(5, 4)$ il discriminante è di primo grado in $m$). `check.mts` passa sui tre file senza errori né avvisi.

## Scelte

- Confine con la 119: le due lezioni hanno la stessa scaletta (luogo, equazione canonica, elementi, fuochi sull'asse $y$, eccentricità, retta, tangenti, condizioni). La 119 rimanda alla 118 per i passaggi della dimostrazione e per il procedimento delle tangenti da un punto.
- Convenzione per i fuochi sull'asse $y$: l'equazione resta $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ con $a$ sotto $x^2$ e $b$ sotto $y^2$, e in quel caso $b > a$ e $c^2 = b^2 - a^2$. Altri libri chiamano sempre $a$ il semiasse maggiore e scambiano i denominatori.
- "Distanza focale" è $2c$; $c$ non ha un nome suo (nelle tabelle la riga si chiama "Valore di $c$"). Eccentricità: $c$ diviso per il semiasse maggiore.
- La dimostrazione dell'equazione canonica è nel testo, con i due elevamenti al quadrato; il viceversa è enunciato e non dimostrato, e la lezione lo dice.
- La formula di sdoppiamento ha una dimostrazione breve in un `ad-note`, che non usa il discriminante: per un punto comune alla retta e all'ellisse $\frac{(x - x_0)^2}{a^2} + \frac{(y - y_0)^2}{b^2} = 1 - 2 + 1 = 0$. Non è quella dei libri, che di solito la enunciano.
- "Secante, tangente, esterna" come nella 93, senza grassetto perché sono già definiti lì.
- Coordinate dei punti con la virgola, come nelle lezioni 80-87 (correzione al brief arrivata durante il lavoro: la prima stesura usava il punto e virgola, convertito dappertutto tranne che nei blocchi `grafico`).
- Gli esempi 4, 5 e 6 usano la stessa ellisse $\frac{x^2}{20} + \frac{y^2}{5} = 1$, scelta perché dà punti e pendenze razionali; ha i semiassi irrazionali ($2\sqrt{5}$ e $\sqrt{5}$), che la lezione non calcola.

## Lasciato fuori

- L'area dell'ellisse $\pi ab$, l'ellisse traslata (centro fuori dall'origine), le direttrici, la proprietà ottica dei fuochi, l'ellisse come dilatazione della circonferenza. Nessuna è nell'elenco del lotto; l'ellisse traslata è quella che i libri del terzo anno trattano più spesso.

## Dubbi per Andrea

1. Fuochi sull'asse $y$: va bene tenere $a$ sotto $x^2$ e $b$ sotto $y^2$ (quindi $b > a$), o preferisci che $a$ sia sempre il semiasse maggiore?
2. L'ellisse traslata e l'area $\pi ab$ vanno aggiunte a questa lezione, o restano fuori dal programma della beta?
3. La dimostrazione dello sdoppiamento nel riquadro va bene, o è meglio enunciare la formula e basta, come nella 119?
4. $c$ si chiama "semidistanza focale"? La lezione evita di dargli un nome.
5. L'eccentricità $e$ come lettera: nella 121 $e$ è il numero di Nepero. Qui non c'è conflitto, ma nel piano con i cursori la lettera $e$ è riservata, e il blocco usa il cursore $c$ e mostra l'eccentricità con il nome $E$.

## Da verificare

- I tre blocchi `grafico` sono stati visti nel browser il 5 ottobre 2026 (pagina `/prova-grafico/lezione`, Chromium a 420 px, tema chiaro), ai valori iniziali e agli estremi dei cursori: l'ellisse con $a = 6$, $b = 1$ e con $a = 1$, $b = 6$, la circonferenza con $a = b$; i fuochi $F$ e $G$ con $c = 0$ e $c = 4{,}9$; la retta con $q = 3$, $5$, $-8$, $8$. Funzionano tutti. Due blocchi erano fuori dal riquadro dell'esempio e quindi senza copertina: ora stanno dentro, subito dopo la figura. Non visti in scuro né su un telefono vero.
- Le figure sono state guardate nelle anteprime di `scripts/figure/anteprima.mjs`, in chiaro e in scuro, e nella pagina di prova in chiaro.
- La larghezza delle formule in evidenza sul telefono non è misurata: ho spezzato su due righe le più lunghe a stima.
- Confronto con le lezioni 114-117 del gruppo C: stessi nomi ("secante, tangente, esterna", "formula di sdoppiamento", "punto di contatto", "imponi $\Delta = 0$"), coordinate con la virgola. La 118 ora rimanda alla 115 per lo sdoppiamento.

## Figure

Sei, in TikZ. Coordinate controllate con un conto: fuochi $(\pm 4, 0)$ per $a = 5$, $b = 3$; $P(3, 2{,}4)$ sull'ellisse; semiassi $4{,}472$ e $2{,}236$ per $a^2 = 20$, $b^2 = 5$; le tre rette per due punti ciascuna, calcolati da $y = -x + q$; le tangenti $y = -x + 5$ e $y = \frac{x}{4} + \frac{5}{2}$ con i punti di contatto $(4, 1)$ e $(-2, 2)$.

- `ellisse-luogo-somma-distanze`, `ellisse-vertici-fuochi-semiassi` (copiata nel formulario), `ellisse-fuochi-asse-y`, `ellissi-eccentricita`, `ellisse-rette-secante-tangente-esterna`, `ellisse-tangenti-da-punto-esterno`.
- Blocchi `grafico`: `ellisse-semiassi-cursori`, `ellisse-eccentricita-cursore`, `ellisse-fascio-rette-parallele`.

## Formulario e flashcard

- Il formulario mette l'eccentricità nella tabella dei due casi e copia la figura degli elementi.
- 19 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Quattro piani, ognuno dopo una figura che fa da copertina e seguito dal testo con la risposta. Visti su `/prova-grafico/lezione` con Chromium a 390 px, in chiaro, ai valori iniziali, agli estremi e nei casi limite.

- `ellisse-semiassi-cursori` (esempio 3), cambiato: ora ha i quattro punti dei fuochi, due sull'asse $x$ e due sull'asse $y$, scritti con una radice che esiste solo da una parte. Il plotter non disegna i punti senza valore, quindi i fuochi passano da un asse all'altro quando $a$ supera $b$, e per $a = b$ stanno nel centro. Con $a = b$ le quattro etichette si sovrappongono e se ne legge una sola.
- `ellisse-eccentricita-cursore` (sezione "L'eccentricità"), cambiato: $c$ ora va da $0$ a $8$. Fino a $5$ è l'ellisse, per $c = 5$ il piano resta vuoto (il denominatore è zero), oltre compare l'iperbole con gli stessi vertici. Il testo lo dice e rimanda alla 119. L'eccentricità si chiama $E$ perché la lettera $e$ nel plotter è il numero di Nepero.
- `ellisse-fascio-rette-parallele` (esempio 4): domanda riscritta, risposta nel testo ($q = \pm 5$).
- `ellisse-fascio-per-un-punto` (esempio 6), nuovo: la retta per $P(2, 3)$ con il cursore $m$ e $\frac{\Delta}{4} = 64m^2 + 48m - 16$; tangente per $m = -1$ e $m = 0{,}25$. Il passo del cursore è $0{,}05$ per poter fermarsi su $0{,}25$.

Scartati: un piano per il luogo geometrico (servirebbe un punto da trascinare sull'ellisse, con le due distanze); un piano per la tangente in un punto (servirebbe un punto che si muove sulla curva); un piano per le condizioni (non c'è una famiglia di curve).

Prerequisiti proposti: il-piano-cartesiano, sistemi-secondo-grado, circonferenza-equazione, retta-fasci
