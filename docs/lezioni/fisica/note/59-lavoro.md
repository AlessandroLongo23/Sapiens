# Note: Il lavoro di una forza

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 17, 30 settembre 2026). Conti rifatti in Python:
$40 \cdot 5{,}0 = 200$ J; $50 \cdot 8{,}0 \cos 30^\circ = 346{,}41$ J; la mela di $100$ g sollevata di un metro,
$0{,}98$ J; $2{,}0 \cdot 9{,}8 \cdot 1{,}5 = 29{,}4$ J, $12 \cdot 9{,}8 \cdot 3{,}0 = 352{,}8$ J; $0{,}30 \cdot 117{,}6 =
35{,}28$ N e $-105{,}84$ J; esempio 5: $F_\perp = 196 - 25 = 171$ N, $F_d = 34{,}2$ N, $W_{att} = -273{,}6$ J,
$W_{tot} = 72{,}81$ J, con la forza totale $(43{,}30 - 34{,}2) \cdot 8{,}0 = 72{,}81$ J, e $346{,}4 + 273{,}6 = 620$ J
nell'avviso; molla $\tfrac{1}{2} \cdot 200 \cdot 0{,}10^2 = 1{,}0$ J e $4{,}0 - 1{,}0 = 3{,}0$ J; flashcard
$10 \cdot 4 \cdot 0{,}5 = 20$ J. `check.mts` passa.

## Struttura ed esempi

Forza e spostamento paralleli ($W = F\,s$, il joule, esempio 1); la forza inclinata (componenti $F_x$ e $F_y$ lungo lo
spostamento e perpendicolare, $W = F\,s\cos\alpha$, avviso sull'angolo misurato dalla verticale, esempio 2); lavoro
positivo, negativo e nullo (figura con i tre casi, tabella con lavoro motore e resistente, forze perpendicolari:
peso, reazione, forza centripeta; avviso "fatica non vuol dire lavoro"; interattiva); il lavoro del peso ($\pm m g h$,
sul piano inclinato $m g\,s\sin\alpha = m g h$, non dipende dal percorso, rimando alla lezione 62; avviso massa e peso;
esempio 3); il lavoro dell'attrito (sempre negativo, rimando alla 64; esempio 4); il lavoro di più forze (somma con il
segno, uguale al lavoro della forza totale, rimando alla 61; esempio 5 che riprende il 2 con l'attrito, e la fune che
alleggerisce la cassa come nella lezione sull'attrito del primo anno; avviso); il lavoro come area (rettangolo per la
forza costante, triangolo per la molla, $\tfrac{1}{2}k\,x^2$; avviso sui centimetri; esempio 6 in due tratti, con il
grafico numerico; interattiva); un errore generico in fondo (il lavoro non è un vettore).

## Scelte

- Le componenti lungo lo spostamento e perpendicolari si chiamano $F_x$ e $F_y$, come dice il README (asse $x$ lungo
  lo spostamento): $F_\perp$ resta la forza premente del primo anno.
- Nella figura TikZ `cassa-fune-componenti-lavoro` la componente utile $F_x$ è arancione (`orange!90!black`, "ciò che
  deve risaltare"), non rossa tratteggiata come vorrebbe la tabella del README per le componenti: la richiesta era di
  evidenziarla, e l'interattiva fa lo stesso. Da confermare.
- L'allungamento della molla è $x$, come nell'energia potenziale elastica $\tfrac{1}{2}k\,x^2$ delle notazioni del
  secondo anno; la lezione dice una volta che è il $\Delta l$ della legge di Hooke.
- Il lavoro del peso lungo il piano inclinato è ricavato con $\cos(90^\circ - \alpha) = \sin\alpha$, che la lezione 15
  (seno e coseno) dice a parole: "il seno di un angolo è il coseno del suo complementare".
- Il lavoro come area è detto per la forza costante e per la molla; niente integrali né forze variabili generiche (sono
  del terzo anno, "Il lavoro di una forza variabile").
- Esempio 1 e 2 in notazione scientifica ($2{,}0 \cdot 10^2$ J, $3{,}5 \cdot 10^2$ J) per rispettare le due cifre
  significative dei dati; i dati $40$ N, $50$ N, $20$ kg hanno lo zero finale ambiguo, come negli esempi del primo anno.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `cassa-fune-componenti-lavoro` ($30^\circ$, $F$ di $2{,}0$ cm, componenti di
$1{,}732$ e $1{,}0$ cm), `segno-lavoro-tre-casi` ($40^\circ$, $90^\circ$, $140^\circ$), `lavoro-peso-piano-inclinato`
($30^\circ$, spostamento di $2{,}0$ cm lungo il piano, dislivello $h = 1{,}0$ cm sul peso), `grafico-forza-costante-area`,
`grafico-molla-area-triangolo`, `grafico-molla-due-tratti` (dentro l'esempio 6: $0{,}20$ m in $4$ cm, $40$ N in $3$ cm,
punti $(0{,}10;\ 20)$ e $(0{,}20;\ 40)$ sulle coordinate giuste). Le tre ultime hanno la riga `% poi-interattivo:`.
In TikZ `\tfrac` fa fallire node-tikzjax: nei nodi va `\frac`.

Interattive (`src/lib/utils/interactive.ts`, gruppo 17):

- `cassa-fune-lavoro` (`fisica/CassaFuneLavoro.tsx`): angolo da $0^\circ$ a $180^\circ$ e forza fino a $100$ N; forza
  con le componenti, quella utile in arancione; lettura di $F_x$ e di $W$, didascalia per lavoro motore, nullo e
  resistente; un bottone fa percorrere alla cassa i suoi $4{,}0$ m e il lavoro cresce con lo spostamento. Oltre
  $90^\circ$ la cassa avanza lo stesso ("spinta da qualcos'altro"): la figura parla del lavoro della fune.
- `molla-area-lavoro` (`fisica/MollaAreaLavoro.tsx`): la molla con la fine da trascinare e, sotto, sulla stessa scala
  orizzontale, il grafico $F = k\,x$ disegnato per la figura (tacche ogni $5$ cm e ogni $10$ N) con l'area che si
  colora; cursori per $x$ (fino a $20$ cm) e $k$ ($50$-$200$ N/m); un bottone allunga la molla da zero.

Guardate in chiaro, in scuro, al telefono e dopo i bottoni: niente errori in console, niente scorrimento laterale. Non ho
potuto guardare la cassa con un angolo ottuso (lo strumento di anteprima clicca, ma non muove i cursori): i conti e la
posizione delle scritte li ho controllati sul codice.

## Esercizi

Generatore `lavoro`, sei livelli (specifica in `specs/exercises/lavoro.md`): Forza e spostamento paralleli, La forza
inclinata, Il segno del lavoro, Il lavoro totale, La fune inclinata con l'attrito, L'area sotto il grafico. Scena nuova
`cassa-fune` (`scenes/CassaFune.tsx`); al livello 6 la scena `grafico-dati`. Modulo comune del gruppo
`src/lib/exercises/v2/fis-lavoro.ts` (risultati con due cifre, notazione scientifica da $100$) e
`scripts/exercises/checkers/_fis_lavoro.py`.

## Domande per Andrea

- "Lavoro motore" e "lavoro resistente": sono i nomi dell'Amaldi del secondo anno, o si dice solo "positivo" e
  "negativo"?
- Le componenti della forza lungo lo spostamento: $F_x$ e $F_y$, oppure $F_\parallel$ e $F_\perp$ come sul piano
  inclinato (ma $F_\perp$ è già la forza premente)?
- La componente utile va evidenziata in arancione anche nelle figure statiche, o resta del colore della forza?
- L'allungamento della molla: $x$ (come nell'energia elastica) o $\Delta l$ (come nella legge di Hooke del primo anno)?
- Il lavoro come area sotto il grafico, con la molla e $\tfrac{1}{2}k\,x^2$, è nel programma del secondo anno, o lo si
  lascia alla lezione sull'energia potenziale elastica?
- L'esempio 5 (fune inclinata con l'attrito, la fune che alleggerisce la cassa) è troppo per il secondo anno?
