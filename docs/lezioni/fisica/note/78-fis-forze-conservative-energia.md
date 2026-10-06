# Note: Forze conservative ed energia potenziale

Lezione nuova (lotto del terzo anno, gruppo 32, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $0{,}30 \cdot 20 \cdot 9{,}8 = 58{,}8$ N, diagonale $5{,}0$ m, $-294$ J e $-411{,}6$ J;
- esempio 2: $0{,}50 \cdot 9{,}8 \cdot 4{,}0 = 19{,}6$ J, $-588$ J;
- esempio 3: $0{,}25$ J, $2{,}25$ J, $-2{,}0$ J;
- parabola: $\sqrt{2 \cdot 0{,}64 / 200} = 0{,}080$ m, $K = 0{,}39$ J a 5 cm;
- esempio 4: $U(1{,}0) = 7{,}0$ J, $\sqrt{2 \cdot 5{,}0 / 0{,}50} = 4{,}472$ m/s, inversione a $4{,}5$ m, forze $+5{,}0$ N e $-2{,}0$ N;
- figura interattiva dei cammini: $2{,}0 \cdot 9{,}8 \cdot 3{,}0 = 58{,}8$ J, $-25$ J sul cammino diritto.

`check.mts`: 0 errori, 0 avvisi.

## Scelte

- Confine con il biennio: il lavoro del peso lungo cammini diversi e $U = m g h$, $U = \tfrac12 k x^2$ sono della 62, qui richiamati in poche righe con il link. La 62 ha già una nota che nomina le forze conservative: qui c'è la definizione.
- Confine con la 77 (gruppo 30): il lavoro della molla $\tfrac12 k x_i^2 - \tfrac12 k x_f^2$ si prende da lì con il link, senza rifare l'area.
- Confine con la 79: qui solo la frase che con le forze non conservative l'energia meccanica cambia; il bilancio $W_{nc} = \Delta E$ è della 79.
- Il lavoro nullo sul cammino chiuso si ricava confrontando il cammino chiuso con il corpo che resta fermo in $A$; il viceversa si argomenta per le forze che dipendono solo dalla posizione (percorso al contrario, lavoro opposto).
- Tra le forze non conservative ci sono anche la spinta di una mano e la trazione di una fune o di un motore, non solo quelle dissipative: serve alla 79.
- La forza dal grafico è $F_x = -\Delta U / \Delta x$, "l'opposto della pendenza", senza derivate; esatta sui tratti rettilinei, per questo l'esempio 4 e gli esercizi usano grafici a tratti.
- Equilibrio stabile e instabile sono in poche righe con una figura; l'equilibrio indifferente non c'è.
- Simboli: $U$, $K$, $E$ come nel biennio; $x$ è la posizione nei grafici e la deformazione per la molla.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `cassa-due-cammini-attrito` (1 cm = 1 m), `cammino-chiuso-due-percorsi`, `energia-potenziale-molla-parabola` (0,3 cm per cm, 3 cm per J; riga `% poi-interattivo`), `equilibrio-stabile-instabile-grafico`, `grafico-energia-potenziale-tratti` (0,7 cm per m, 0,3 cm per J).

Interattive (registrate sotto il commento del gruppo 32):

- `lavoro-due-cammini-peso-attrito` (`fisica/LavoroDueCammini.tsx`): che cosa cambia nel lavoro del peso e in quello dell'attrito se si allunga il cammino da $A$ a $B$? Il punto $C$ si trascina, a scatti di 0,25 m.
- `grafico-energia-potenziale-buca` (`fisica/GraficoEnergiaPotenziale.tsx`): da dove deve partire il corpo dell'esempio 4 per superare la collina di 8 J? Cursore per la partenza da 0 a 2 m, bottone che lascia andare; passo di integrazione scritto a mano, con la velocità ripresa dall'energia.

## Esercizio guidato

L'esempio 4 (il grafico a tratti). Si fermerebbe in tre punti: leggere $U$ in $x = 1{,}0$ m e dire quanto vale $E$; trovare $K$ in $x = 2{,}0$ m; dire dove il corpo torna indietro (qui un cursore sulla retta di $E$).

## Esercizi

Generatore `fis-forze-conservative-energia`, sei livelli (specifica in `specs/exercises/`). Scena nuova `grafico-spezzata` ai livelli 5 e 6.

## Domande per Andrea

- Il viceversa (lavoro nullo su ogni cammino chiuso, quindi forza conservativa) va tenuto con l'argomento in tre righe, o basta enunciarlo?
- La forza come opposto della pendenza del grafico di $U$ è al livello del terzo anno, prima delle derivate? L'Amaldi la dà? (da verificare)
- L'equilibrio stabile e instabile sul grafico sta bene qui o è materia del quarto anno?
- Serve un esempio con l'energia potenziale negativa (livello zero in alto)?

## Da verificare

- Nessuna costante oltre $g = 9{,}8$ m/s². L'energia potenziale elettrica "al quarto anno" è detta senza link.

Prerequisiti proposti: fis-energia-potenziale, energia, fis-lavoro-forza-variabile, lavoro
