# Note: Il baricentro e la stabilità dell'equilibrio

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 7, 30 settembre 2026). Conti rifatti con SymPy in
`verifica_lezioni_g7.py` (scratchpad del lotto): il manubrio ($0{,}60\,\text{m}$ e il controllo $1{,}2 = 1{,}2$), la
lamina a L ($9500 / 700 = 13{,}57 \approx 14\,\text{cm}$ per le due coordinate), l'armadio
($\tan^{-1} 0{,}375 = 20{,}56^\circ \approx 21^\circ$), i mattoni ($12$, $-6$, $18\,\text{cm}$, tre quarti), e le
coordinate delle figure (baricentro del triangolo, della L, dei blocchi inclinati, della lamina appesa). `check.mts`
passa senza avvisi.

## Struttura ed esempi

Il baricentro come punto di applicazione del peso, i corpi simmetrici (rettangolo, anello, triangolo con il link alla
lezione di matematica sui punti notevoli), il baricentro fuori dal corpo, il metodo della sospensione in passi, il
baricentro di due corpi ($P_1 d_1 = P_2 d_2$ e la media pesata), l'equilibrio stabile, instabile e indifferente per un
corpo appeso e per una pallina, i corpi appoggiati con la base d'appoggio e il ribaltamento. Quattro esempi: il
manubrio, la lamina a L, l'armadio inclinato, i mattoni sul bordo del tavolo. Avvisi: il baricentro sta vicino al
corpo più pesante, conta la verticale del baricentro (e la base d'appoggio non è solo la superficie toccata).

## Scelte

- "Baricentro" per tutta la lezione; "centro di massa" resta alla lezione del terzo anno, non linkata qui.
- L'angolo di ribaltamento usa $\tan^{-1}$, che la lezione 15 ("Seno e coseno per scomporre un vettore") introduce.
- Il criterio della stabilità con l'altezza del baricentro (sale, scende, resta) è in una frase: è il ponte verso
  l'energia potenziale del secondo anno, senza nominarla.
- La base d'appoggio come "poligono che ha per vertici i punti di appoggio più esterni": più precisa sarebbe
  "l'involucro convesso", troppo per il biennio.
- La pila di mattoni si ferma a due mattoni; la serie armonica della pila infinita è una curiosità che non ho messo.

## Figure

Otto TikZ, guardate in chiaro e in scuro: `baricentro-figure-simmetriche` (le mediane del triangolo si incontrano in
$(6{,}8; 0{,}7)$, l'anello con `even odd rule`), `baricentro-per-sospensione` (la lamina ruotata di $4{,}6^\circ$ perché
il foro $A$ sia esattamente sopra il baricentro, calcolato come baricentro del poligono), `baricentro-manubrio`
($5\,\text{cm}$ per metro), `baricentro-lamina-a-elle` ($1\,\text{cm}$ per $10\,\text{cm}$; $G$ in $(1{,}357; 1{,}357)$ sul
segmento $G_1 G_2$), `equilibrio-stabile-instabile-indifferente`, `ribaltamento-verticale-baricentro` (blocchi
$1 \times 2\,\text{cm}$ inclinati di $15^\circ$ e $35^\circ$, con il limite a $26{,}6^\circ$), `ribaltamento-angolo-limite`
(l'armadio all'angolo limite, scala $1{,}4$), `baricentro-mattoni-sporgenti` ($1\,\text{cm}$ per $10\,\text{cm}$).

Interattiva `blocco-ribaltamento` (`src/components/content/interactive/fisica/BloccoRibaltamento.tsx`): si inclina il
blocco sullo spigolo con un cursore o trascinandone lo spigolo in alto, e lo si lascia andare; torna sulla base o si
ribalta sul fianco, secondo da che parte dello spigolo cade la verticale del baricentro. Larghezza e altezza si
cambiano con i cursori, e sotto si leggono l'inclinazione e l'angolo limite $\tan^{-1}(w/h)$. Niente motore fisico:
il blocco ha un solo grado di libertà, e un passo di integrazione scritto a mano, come `TrapezioTriangolo.tsx`, basta.

## Esercizi

Generatore `fis-baricentro`, specifica in `specs/exercises/fis-baricentro.md`: cinque livelli (due corpi, tre corpi,
stabile o instabile, l'angolo di ribaltamento, quanto può sporgere un'asse), scena `asta-forze` per i livelli 1, 2 e il
caso del gatto del livello 5.

## Lasciato ad altre lezioni

- Il centro di massa e il suo moto: terzo anno. L'energia potenziale e la stabilità: secondo anno.
- La forza-peso: lezione 17, che rimanda a questa per il baricentro.

## Domande per Andrea

- Il baricentro di un triangolo: basta il rimando alla geometria, o serve la costruzione con le mediane nella lezione?
- "Base d'appoggio" o "poligono d'appoggio"? Il libro quale usa?
- L'angolo di ribaltamento con l'arcotangente è da primo anno?
- Il criterio dell'altezza del baricentro (sale nello stabile, scende nell'instabile) va bene già qui?
