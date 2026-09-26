# Note: Enti geometrici, segmenti e angoli

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: i sette esempi (punti medi, equazione $3x + x = 20$, somma e differenze con i primi, equazione $180 - x = 3(90 - x)$, i quattro angoli di due rette incidenti, le bisettrici di angoli adiacenti), le conversioni $37^\circ 30' = 37{,}5^\circ$, i conti delle carte e le coordinate del quadratino dell'angolo retto nell'ultima figura. Il controllo `check.mts` passa sui tre file con un solo avviso, sui grassetti (vedi sotto). Nessuna formula in evidenza supera 171 px (misurate con KaTeX in Playwright).

## Scelte di convenzione

- Postulati di appartenenza in tre punti (infiniti punti su una retta e nel piano; per due punti una sola retta; un punto fuori da ogni retta) e d'ordine in tre (ordinata, illimitata, densa). I libri li numerano e li formulano in modi diversi: ho tenuto la forma più semplice e solo quelli che la lezione usa. Da verificare con il libro in uso.
- "Tutti gli angoli piatti sono congruenti, e così tutti gli angoli giro", l'esistenza e unicità del punto medio e della bisettrice sono date come fatti, senza dire se sono postulati o teoremi: nei libri variano (alcuni li ricavano dal postulato del trasporto dei segmenti e degli angoli, che non ho nominato). Il trasporto con un movimento rigido è usato in modo intuitivo per confronto e somma.
- Congruenza definita con il movimento rigido ("si sovrappongono punto per punto"), come nella maggior parte dei libri del biennio. La lezione 59 ne parla di nuovo per i triangoli: conviene che usi le stesse parole.
- Misure: $AB = 8$ cm per la lunghezza del segmento, con una frase che dice che alcuni libri scrivono $\overline{AB}$; $\widehat{AOB} = 50^\circ$ per gli angoli, e lettere greche ($\alpha$, $\beta$, $\gamma$) nella dimostrazione e nelle figure. Le lezioni 59-62 dovrebbero scegliere la stessa scrittura.
- Angolo definito come parte di piano (con le semirette), con convesso e concavo; per questo ho messo prima una sezione breve su figure convesse e concave. L'angolo nullo e l'angolo giro come due "parti" con i lati coincidenti è la definizione più diffusa; se il libro in uso non li tratta così si può semplificare.
- Esplementari citati in una frase, come termine di "alcuni libri"; non ci sono esempi.
- Primi e secondi: introdotti con due esempi (somma con riporto, differenza con prestito). Nessun conto con i secondi, e nessuna conversione da gradi decimali a primi oltre $37^\circ 30' = 37{,}5^\circ$.
- La dimostrazione degli angoli opposti al vertice è scritta con ipotesi, tesi e passi numerati con la giustificazione, come chiede il brief per la 59; poi la versione con le misure in una riga. Il passo 4 enuncia "supplementari dello stesso angolo sono congruenti", che servirà nelle lezioni successive.

## Lasciato ad altre lezioni

- Rette parallele e perpendicolari: solo il link a 60 quando si parla di rette senza punti in comune. "Perpendicolare" non compare: le bisettrici di angoli adiacenti "formano un angolo retto".
- Congruenza dei triangoli: link a 59.
- Poligonali, rette nello spazio, piani incidenti: non trattati.
- Radianti: niente, la lezione Misura degli angoli: gradi e radianti non è scritta.

## Da togliere o controllare in lezioni già scritte

Nessuna lezione pubblicata tratta questi argomenti. La lezione 51 (Problemi con le equazioni) ha problemi con i rettangoli, ma non usa segmenti o angoli in senso geometrico.

## Figure

Diciannove figure TikZ nella lezione, una copiata nel formulario (`angoli-opposti-al-vertice`). Tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`). Larghezze: la più larga è `angoli-consecutivi-adiacenti` (290 px, fuori dai riquadri); quelle dentro i riquadri degli esempi vanno da 171 a 268 px. Colori: `blue!8`/`blue!15` e `orange!25` per i riempimenti, `blue!60!black` e `orange!80!black` per archi e lati evidenziati; niente `\clip`, niente riempimenti bianchi, nessuna libreria TikZ (gli spostamenti sono fatti con `scope[shift=...]`). Trattini sui segmenti congruenti, archetti con trattini sugli angoli congruenti, quadratino sull'angolo retto. Non le ho viste sul sito.

## Formulario e flashcard

- Il formulario ha la tabella delle misure degli angoli con anche il concavo (che la lezione dice nel testo, sotto la tabella) e la figura degli angoli opposti al vertice.
- 20 carte. La carta `angolo-vertice-notazione` usa $\widehat{PQR}$, che non è nella lezione; la regola sì.

## Grassetti

`check.mts` avvisa per 29 grassetti (soglia 12). Sono tutti termini nel punto in cui vengono definiti: la lezione è quasi tutta definizioni. Ho già tolto il grassetto a 23 termini secondari (origine, estremi, lati, vertice, gradi, primi...). Se si vuole scendere ancora, i candidati sono punto medio, figura, opposte.

## Prerequisiti

La riga `geometria-enti <-` (lezione di base) va bene per la geometria: tutto quello che serve si definisce nella lezione. Gli esempi 2 e 5 risolvono un'equazione di primo grado ($4x = 20$, $180 - x = 3(90 - x)$) con un link a Equazioni di primo grado intere, e i primi usano solo somme e sottrazioni. Non aggiungerei l'arco `equazioni-primo-grado`: i due esempi sono un'applicazione e si possono saltare senza perdere la teoria; se però il generatore propone problemi con l'equazione (livello 6 sotto), l'arco diventa giusto. Da decidere insieme al generatore.

## Per il generatore

1. Segmenti adiacenti e punto medio: dati $AB$ e $BC$ adiacenti, calcolare $AC$, $AM$, $MN$ con i punti medi (esempio 1).
2. Classificare un angolo dalla misura (acuto, retto, ottuso, piatto, concavo, giro) e riconoscere consecutivi, adiacenti, opposti al vertice da una descrizione.
3. Complementare e supplementare di un angolo in gradi interi: $90^\circ - 32^\circ$, $180^\circ - 125^\circ$.
4. Somme e differenze con gradi e primi, con riporto e prestito: $25^\circ 48' + 30^\circ 27'$, $90^\circ - 37^\circ 25'$.
5. Due rette incidenti e bisettrici: dato un angolo, trovare gli altri tre; angolo tra le bisettrici di angoli adiacenti o consecutivi.
6. Problemi con un'equazione: segmento diviso in parti con un rapporto o una differenza (esempio 2), angolo il cui supplementare è un multiplo del complementare (esempio 5).
