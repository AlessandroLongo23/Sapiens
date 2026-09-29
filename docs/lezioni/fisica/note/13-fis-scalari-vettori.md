# Note: Grandezze scalari e grandezze vettoriali

Lezione nuova, primo lotto di fisica, gruppo 4 (i vettori), 29 settembre 2026. Tutti i numeri di lezione, formulario
e carte sono rifatti in Python (`numeri.py` nello scratchpad del lotto, 79 controlli sulle tre lezioni del gruppo). Il
controllo `check.mts` passa sui tre file senza avvisi.

## Struttura ed esempi

Grandezze scalari (con il segno che non è un verso: la temperatura sotto zero), grandezze vettoriali con modulo,
direzione e verso, come si disegna un vettore (freccia, notazione, scala), vettori uguali, opposti e nullo, spostamento
e distanza percorsa. Cinque esempi: disegnare in scala ($150\,\text{m}$ in scala $1\,\text{cm} : 50\,\text{m}$), leggere
in scala ($4{,}5\,\text{cm}$ a $20\,\text{N}$ per centimetro), avanti e indietro su una retta ($12$ e $5$ km), il giro
di pista (spostamento nullo), due tratti perpendicolari tra gli isolati ($300$ e $400$ m, con Pitagora).

Avvisi accanto alla regola: direzione e verso, il modulo mai negativo, stesso modulo non vuol dire uguali, lo
spostamento non è la strada fatta.

## Scelte

- Le parole della lezione sono "modulo (o intensità), direzione e verso", come l'Amaldi e gli altri libri del
  biennio; "origine" o "coda" per il punto da cui parte la freccia. Il "punto di applicazione" è lasciato alla lezione
  sulle forze, con un rimando.
- Notazione $\vec{v}$ per il vettore e $v$ o $|\vec{v}|$ per il modulo, come il README di fisica; una riga dice che
  molti libri usano il grassetto.
- La somma di vettori non si spiega qui: l'esempio 5 usa Pitagora per un solo caso (due tratti perpendicolari), che è
  la prima cosa che uno studente incontra con gli spostamenti, e rimanda alla lezione 14.
- Il vettore nullo è introdotto qui perché serve all'esempio del giro di pista.
- Le componenti non compaiono: arrivano nella 14 (sulla griglia) e nella 15 (con seno e coseno).

## Figure

Statiche (TikZ, guardate in chiaro e in scuro con `anteprima.mjs`): `vettore-origine-punta-direzione`,
`spostamento-in-scala` (freccia di 3 cm e scala di 1 cm), `vettori-uguali-opposti-griglia` (a = (3, 2), b uguale, c
opposto, d = (2, 3) con lo stesso modulo), `distanza-spostamento-retta` (1 km per tacca), `spostamento-isolati-pitagora`.

Interattiva: `vettori-confronto-griglia` (`src/components/content/interactive/fisica/VettoriConfronto.tsx`): $\vec{a}$
fisso come nella figura statica, $\vec{b}$ con l'origine e la punta da trascinare, che scattano sugli incroci; sotto i
moduli in quadretti, direzione e verso, e una frase che dice se $\vec{b}$ è uguale, opposto, parallelo o solo lungo
uguale. Le due frecce stanno in metà diverse della griglia, così i nomi non si incontrano. Guardata in chiaro, scuro e
a 390 px, in più posizioni (uguale, opposto, lungo il bordo alto e il bordo destro).

## Esercizi

Generatore `fis-scalari-vettori`, cinque livelli (vedi la specifica): scalare o vettoriale; vettori uguali e opposti
sulla griglia (scena); la scala di un disegno; distanza e spostamento su una retta (scena); lo spostamento sulla
griglia con Pitagora (scena). Esito in fondo.

## Domande per Andrea

- "Modulo" o "intensità"? La lezione usa modulo e cita intensità una volta.
- Il vettore si scrive $\vec{v}$ (qui) o in grassetto $\mathbf{v}$, come alcuni libri? E il modulo $v$ o $|\vec{v}|$?
- La scala si scrive $1\,\text{cm} : 20\,\text{N}$; il vostro libro scrive "$1\,\text{cm} \to 20\,\text{N}$" o in un altro
  modo?
- Il punto da cui parte la freccia: "origine", "coda" o "punto di applicazione" anche per gli spostamenti?
- Va bene anticipare Pitagora nell'esempio 5, o gli spostamenti non allineati vanno tutti nella lezione 14?

## Verifiche

- `check.mts` su lezione, formulario (1 schermata) e 18 carte: nessun errore, nessun avviso.
- Generatore: `sample.mts fis-scalari-vettori 1000 all` con i seed 1, 50001 e 777001, `verify.py` PASS (5000
  esercizi per seed); errori piantati (opzione giusta spostata, due opzioni uguali, un dato del testo cambiato, un
  vettore della scena spostato, la risposta cambiata) tutti bocciati; `review.mts` codice 0; `width.mts` codice 0
  (opzione più larga 214 px).
