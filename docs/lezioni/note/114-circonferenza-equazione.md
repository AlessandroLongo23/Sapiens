# Note: Equazione della circonferenza

Lezione nuova (lotto del terzo anno, gruppo C, 5 ottobre 2026). I conti degli otto esempi, delle tabelle e degli avvisi sono stati rifatti con SymPy (`gruppo-c/verifica.py` nello scratchpad della sessione, 88 controlli per le quattro lezioni del gruppo, tutti passati). Lo stesso script controlla le coordinate delle figure: punti sulla circonferenza, raggi, estremi delle rette.

## Scelte

- Confine con la 115: qui il luogo, le due forme dell'equazione, il passaggio dall'una all'altra, i casi degeneri, la posizione di un punto (interno, esterno) e la circonferenza da condizioni che non riguardano rette tangenti (centro e punto, diametro, tre punti, due punti e centro su una retta). Tutto ciò che coinvolge una retta tangente, comprese le condizioni di tangenza, è nella 115.
- Centro $C(\alpha, \beta)$ e forma generale $x^2 + y^2 + ax + by + c = 0$, come chiede il brief. Il raggio è dato come $r = \sqrt{\alpha^2 + \beta^2 - c}$, senza la variante $\frac{1}{2}\sqrt{a^2 + b^2 - 4c}$: una formula sola da ricordare.
- Il completamento del quadrato compare due volte: come controllo in un `ad-tip` (con i numeri dell'esempio 2) e con le lettere per decidere quando l'equazione è una circonferenza. Nel biennio non ha una lezione sua, quindi è spiegato qui in tre righe.
- Casi degeneri: "il solo punto $(\alpha, \beta)$" e "nessun punto", senza i nomi "circonferenza degenere" e "circonferenza immaginaria".
- La posizione di un punto ha una sezione breve, perché la 115 la usa per contare le tangenti.
- Nell'esempio 7 i tre punti si chiamano $A$, $B$, $D$, perché $C$ è il centro in tutta la lezione.
- Coordinate con la virgola, come nelle lezioni 80-87 (correzione del brief del 5 ottobre); il punto e virgola resta solo nei blocchi `grafico`.

## Lasciato ad altre lezioni

- La circonferenza come grafico di due funzioni ($y = \beta \pm \sqrt{r^2 - (x - \alpha)^2}$, le semicirconferenze): non c'è. Servirebbe per i grafici con le radici e per le disequazioni irrazionali risolte graficamente.
- Fasci di circonferenze: non ci sono, né qui né nella 115.
- Circonferenza per tre punti con gli assi dei segmenti: solo nominata in un `ad-note`, con il link alla 83.

## Figure e blocchi grafico

Sei figure TikZ, guardate in chiaro e in scuro con `anteprima.mjs`. Due blocchi `grafico`: centro e raggio con i cursori $\alpha$, $\beta$, $r$ (copertina: la prima figura); forma generale con i cursori $a$, $b$, $c$ e il valore $\alpha^2 + \beta^2 - c$ (copertina: la figura dell'esempio 2, dentro il riquadro). I due blocchi sono stati aperti su `/prova-grafico/lezione` del sito in sviluppo: si disegnano e i valori iniziali sono giusti ($C = (2; 1)$; $\alpha^2 + \beta^2 - c = 16$). I cursori non sono stati mossi.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Cinque piani, ognuno dopo una figura TikZ e con la risposta scritta subito dopo. Aperti a 390 px su `/prova-grafico/lezione` con i cursori ai valori iniziali, agli estremi e nei casi limite.

1. `circonferenza-centro-raggio-cursori` (c'era): $\alpha$, $\beta$, $r$. Aggiunta la risposta: traslazione, e con $r = 0$ resta il centro.
2. `punti-interni-esterni-cursore-raggio` (nuovo, sezione "Punti interni ed esterni"): cursore $r$ e i tre punti fermi; i punti entrano a $r^2 = 5$, $9$, $13$.
3. `circonferenza-forma-generale-cursori` (c'era, esempio 2): aggiunta la risposta sui casi $c = 13$ e $c > 13$.
4. `circonferenza-coefficienti-nulli-cursori` (nuovo, "Che cosa dicono i coefficienti", con la figura nuova `circonferenza-per-origine-centro-asse-x`): con $c = 0$ passa sempre per l'origine, con $c < 0$ l'origine è interna. Il cursore $c$ si ferma a $0$: sopra, la circonferenza può sparire, ed è il tema del piano 3.
5. `circonferenza-centro-su-retta-cursore` (nuovo, esempio 8): il centro scorre sulla retta con $\alpha$, la circonferenza passa sempre per $A$ e per $B$ solo con $\alpha = 3$.

Scartati: la circonferenza per tre punti (servirebbero punti da trascinare); il diametro (niente parametro che insegni qualcosa); il completamento del quadrato (è un conto, non una curva).

## Domande per Andrea

- Il centro si chiama $C(\alpha, \beta)$ e i coefficienti $a$, $b$, $c$: va bene, o il vostro libro usa $C(x_0, y_0)$ oppure $C(x_C, y_C)$?
- Per il raggio dalla forma generale basta $r = \sqrt{\alpha^2 + \beta^2 - c}$, o volete anche $r = \frac{1}{2}\sqrt{a^2 + b^2 - 4c}$ in evidenza?
- I casi con $\alpha^2 + \beta^2 - c \le 0$ vanno chiamati "circonferenza degenere" e "circonferenza non reale", come fanno alcuni libri, o basta dire "un solo punto" e "nessun punto"?
- Le semicirconferenze come grafici di funzioni vanno in questa lezione, in un riquadro, o le lasciamo alla lezione sulle funzioni irrazionali?
- I fasci di circonferenze sono fuori dall'albero: va bene così per il terzo anno?

## Da verificare

- I blocchi `grafico` su un telefono vero e con i cursori agli estremi ($r = 0$ nel primo; $c$ oltre $13$ nel secondo, dove la curva deve sparire).
- La larghezza delle formule in evidenza sul telefono: non è stata misurata; le più lunghe sono spezzate con `gathered`.

Prerequisiti proposti: il-piano-cartesiano, circonferenza-cerchio, sistemi-cramer (l'ultimo serve solo per l'esempio dei tre punti, e si può togliere).
