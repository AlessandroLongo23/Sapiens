# Note: La parabola nel piano cartesiano

Lezione nuova (lotto del terzo anno, gruppo C, 5 ottobre 2026). Conti rifatti con SymPy (`gruppo-c/verifica.py` nello scratchpad). Per le parabole degli esempi 2, 3, 4, 5 e 6 lo script non si fida delle formule: riparte da fuoco e direttrice, impone $\overline{PF} = \overline{PH}$ e controlla che esca la stessa equazione.

## Scelte

- Confine con la 87: vertice, asse, concavità, intersezioni con gli assi e disegno di $y = ax^2 + bx + c$ non sono rispiegati; c'è il link. Qui: luogo, fuoco e direttrice, forma $y - y_V = a(x - x_V)^2$, parabola con asse orizzontale, parabola da condizioni.
- Confine con la 117: le condizioni che riguardano una retta tangente sono nella 117.
- Dimostrazione: l'equazione $y = ax^2$ è ricavata dal luogo con fuoco $F(0, f)$ e direttrice $y = -f$, poi $a = \frac{1}{4f}$. Il caso generale passa per la traslazione (link alla 104): la lezione dice che una traslazione non cambia le distanze, quindi fuoco e direttrice si spostano con la parabola. Non c'è il conto diretto con fuoco generico.
- Fuoco e direttrice sono dati in due modi nella stessa tabella: dal vertice ($y_V \pm \frac{1}{4a}$), che è quello consigliato, e dai coefficienti ($\frac{1 - \Delta}{4a}$, $-\frac{1 + \Delta}{4a}$).
- La 87 dà $y_V$ per sostituzione e $-\frac{\Delta}{4a}$ come controllo: qui $-\frac{\Delta}{4a}$ entra nella tabella, perché serve per le formule di fuoco e direttrice.
- Parabola con asse orizzontale: "concavità verso destra" e "verso sinistra". Le formule sono presentate come quelle di prima con le coordinate scambiate, in una tabella a due colonne.
- Conteggio delle condizioni (tre; vertice e fuoco ne valgono due, punto, direttrice e asse una): è una regola pratica, vera per le parabole con asse parallelo a un asse cartesiano.
- L'apertura dell'antenna parabolica è una frase sola: la proprietà di riflessione non è dimostrata né usata.

## Lasciato fuori

- La forma $x^2 = 2py$ con il parametro $p$, che alcuni libri usano.
- Parabole con asse obliquo.
- La 87 ha già la parabola per tre punti in un `ad-note`: qui è un esempio svolto, con numeri diversi. Le due versioni non si contraddicono.

## Figure e blocchi grafico

Cinque figure TikZ, guardate in chiaro e in scuro. Due blocchi `grafico`: $y = ax^2$ con fuoco e direttrice e il cursore $a$ (copertina: le due parabole con fuoco vicino e lontano); $x = ay^2 + by + c$ con vertice, fuoco e direttrice (copertina: la figura dell'esempio 4, dentro il riquadro). Aperti su `/prova-grafico/lezione`: si disegnano; il secondo mostra $V = (4; 1)$ all'inizio. I cursori non sono stati mossi: con $a = 0$ fuoco e direttrice non esistono, e non so che cosa mostra il piano in quel punto.

Nella figura dell'esempio 4 fuoco e vertice distano un quarto di unità e i due punti quasi si toccano: è la geometria dell'esempio.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Cinque piani, ognuno dopo una figura TikZ e con la risposta scritta subito dopo. Aperti a 390 px con i cursori ai valori iniziali, agli estremi e nei casi limite.

1. `parabola-luogo-punto-cursore` (nuovo, "La parabola come luogo geometrico"): il punto $P$ scorre sulla parabola con il cursore $u$, con $\overline{PF}$ e $\overline{PH}$ scritte sotto, sempre uguali; minime nel vertice, dove valgono $1$. La retta verticale per $P$ è tratteggiata, perché il blocco non disegna segmenti.
2. `parabola-fuoco-direttrice-cursore-a` (c'era): aggiunta la risposta, compreso il caso $a = 0$.
3. `parabola-asse-orizzontale-cursori` (c'era, esempio 4): aggiunta la risposta, compreso il caso $a = 0$.
4. `parabola-fuoco-fisso-direttrice-cursore` (nuovo, esempio 5, con la figura nuova `parabola-da-fuoco-e-direttrice-orizzontale`): fuoco fermo, direttrice $y = k$; il cursore si ferma a $k = 0{,}5$, prima che la direttrice passi per il fuoco, dove il luogo non è più una parabola.
5. `parabola-vertice-fisso-cursore-a` (nuovo, esempio 7, con la figura nuova `parabola-da-vertice-e-punto`): vertice fermo, cursore $a$; passa per $A$ solo con $a = -0{,}5$, e per $a = 0$ resta una retta.

Scartati: $y = ax^2 + bx + c$ con vertice, fuoco e direttrice a tre cursori (ripete il piano 2 e quelli della 87); la parabola per tre punti (servirebbero punti da trascinare); fuoco e direttrice verticale dell'esempio 6 (lo stesso piano del 4 con gli assi scambiati).

## Domande per Andrea

- Fuoco e direttrice: preferite che lo studente impari le formule con $\Delta$ o il procedimento "vertice, poi $\pm \frac{1}{4a}$"? La lezione dà tutti e due e consiglia il secondo.
- Il caso generale è giustificato con la traslazione di $y = ax^2$. Volete invece il conto diretto del luogo con fuoco e direttrice generici, come fanno alcuni libri?
- "Concavità verso destra / verso sinistra" per $x = ay^2 + by + c$: è il termine che usate?
- Serve la forma $x^2 = 2py$ (o $y^2 = 2px$) con il parametro $p$?
- La proprietà ottica del fuoco merita un riquadro, o resta la frase di apertura?

## Da verificare

- I blocchi `grafico` su un telefono vero, e il comportamento con $a = 0$.
- Larghezza delle formule in evidenza e della tabella a tre colonne delle formule sul telefono: non misurata. La tabella "Elemento / $y = ax^2 + bx + c$ / $x = ay^2 + by + c$" è la più larga della lezione.

Prerequisiti proposti: funzioni-quadratiche, trasformazioni-geometriche, circonferenza-equazione (l'ultimo solo per l'ordine del capitolo e per il confronto dei tre punti: si può togliere).
