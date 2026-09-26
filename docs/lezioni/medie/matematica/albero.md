# Albero delle lezioni di matematica (scuola media)

Fonte dell'albero di `content_nodes` per la matematica delle medie (materia `math` sotto
`middle_school`). Proposta del 26 settembre 2026, da approvare; motivazioni e fonti in
`programma.md`. Si applica con `scripts/lezioni/tree.mts --level middle_school --subject math --file
docs/lezioni/medie/matematica/albero.md` (prima senza scrivere, poi con `--apply`; serve
`JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`, perché `src/lib/seo/slug.ts` importa con `@/`).
L'opzione `--level` oggi non esiste: `tree.mts` cerca la materia solo sotto `high_school` (vedi
`programma.md`, "Cosa cambia in tree.mts").

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione, `+ vecchio-slug` dopo una
lezione indica una lezione di oggi che viene assorbita (deve essere vuota). Le righe `# Primo anno`
... `# Terzo anno` danno l'anno ai capitoli che seguono (`content_nodes.school_year`): prima, seconda
e terza media. Lo slug è la chiave interna; l'indirizzo pubblico viene dal titolo. Gli slug nuovi
cominciano con `mat-`; tengono lo slug di oggi i 4 capitoli e le 12 lezioni che esistono già (tutti
vuoti). Due lezioni di oggi sono assorbite: `potenze-radice` e `operazioni-frazioni`.

# Primo anno

## aritmetica | I numeri e le operazioni
- numerazione-decimale | Il sistema di numerazione decimale
- mat-sistemi-numerazione | Altri sistemi di numerazione: romano e binario
- mat-approssimazione-stime | Arrotondamenti e stime
- quattro-operazioni | Le quattro operazioni
- proprieta-operazioni | Le proprietà delle operazioni
- espressioni-aritmetiche | Le espressioni aritmetiche
- mat-problemi-espressioni | Dal problema all'espressione
- mat-operazioni-decimali | Le operazioni con i numeri decimali

## mat-potenze | Le potenze
- mat-potenza | La potenza di un numero
  + potenze-radice
- mat-proprieta-potenze | Le proprietà delle potenze
- mat-potenze-dieci | Potenze di dieci e notazione scientifica

## mat-divisibilita | La divisibilità
- mat-multipli-divisori | Multipli e divisori
- mat-criteri-divisibilita | I criteri di divisibilità
- mat-numeri-primi | Numeri primi e scomposizione in fattori
- mat-mcd | Il massimo comune divisore
- mat-mcm | Il minimo comune multiplo
- mat-problemi-mcd-mcm | Problemi con MCD e mcm

## frazioni | Le frazioni
- mat-frazione-unita | La frazione e l'unità frazionaria
- frazioni-proprie | Frazioni proprie, improprie e apparenti
- frazioni-equivalenti | Frazioni equivalenti e semplificazione
- mat-confronto-frazioni | Confrontare le frazioni e metterle sulla retta
- mat-frazione-di-numero | La frazione di un numero e il problema inverso

## mat-operazioni-frazioni | Le operazioni con le frazioni
- mat-addizione-frazioni | Addizione e sottrazione di frazioni
  + operazioni-frazioni
- mat-moltiplicazione-frazioni | Moltiplicazione di frazioni
- mat-divisione-frazioni | Divisione di frazioni e frazione inversa
- mat-espressioni-frazioni | Potenze ed espressioni con le frazioni

## mat-dati | Dati e grafici
- mat-indagine-statistica | L'indagine statistica e le frequenze
- mat-tabelle-grafici | Tabelle e grafici
- mat-media-moda-mediana | Moda, mediana e media aritmetica

## mat-algoritmi | Problemi e algoritmi
- mat-strategie-problemi | Leggere un problema e scegliere una strategia
- mat-algoritmi-diagrammi | Algoritmi e diagrammi di flusso
- mat-algoritmi-errori | Seguire un algoritmo e trovarne gli errori

## mat-misure | Grandezze e misure
- mat-grandezze-si | Grandezze e Sistema Internazionale
- mat-equivalenze | Multipli, sottomultipli ed equivalenze
- mat-misure-tempo | Misure di tempo e sistema sessagesimale

## geometria-piana | Gli enti geometrici fondamentali
- enti-fondamentali | Punto, retta e piano
- mat-semirette-segmenti | Semirette e segmenti
- mat-operazioni-segmenti | Confronto e operazioni con i segmenti
- mat-punti-piano-cartesiano | Punti e segmenti nel piano cartesiano

## mat-angoli | Gli angoli
- angoli | L'angolo e la sua misura
- mat-tipi-angoli | Angoli acuti, retti, ottusi e piatti
- mat-operazioni-angoli | Operazioni con gli angoli
- mat-coppie-angoli | Angoli complementari, supplementari e opposti al vertice

## mat-rette | Rette perpendicolari e parallele
- mat-rette-perpendicolari | Rette incidenti e perpendicolari
- mat-rette-parallele | Rette parallele
- mat-parallele-trasversale | Due parallele tagliate da una trasversale
- mat-asse-bisettrice | Asse di un segmento e bisettrice di un angolo

## mat-poligoni-triangoli | Poligoni e triangoli
- mat-poligono | Il poligono e i suoi elementi
- mat-angoli-poligono | Gli angoli di un poligono
- triangoli | Il triangolo e la sua classificazione
- mat-lati-angoli-triangolo | Lati e angoli di un triangolo
- mat-punti-notevoli | Altezze, mediane, bisettrici e punti notevoli
- mat-congruenza-triangoli | Triangoli congruenti

# Secondo anno

## mat-frazioni-decimali | Frazioni e numeri decimali
- numeri-decimali | Dalla frazione al numero decimale
- mat-decimali-periodici | Numeri decimali limitati e periodici
- mat-frazione-generatrice | La frazione generatrice
- mat-espressioni-decimali | Espressioni con frazioni e numeri decimali

## mat-radice-quadrata | La radice quadrata
- mat-radice-quadrata-inversa | La radice quadrata come operazione inversa
- mat-quadrati-perfetti | Quadrati perfetti e scomposizione in fattori
- mat-radici-approssimate | Radici approssimate e stime
- mat-proprieta-radici | Le proprietà delle radici quadrate
- mat-numeri-irrazionali | La radice di 2 e i numeri irrazionali

## mat-rapporti-proporzioni | Rapporti e proporzioni
- mat-rapporto | Il rapporto tra numeri e tra grandezze
- mat-scala | Scale di riduzione e di ingrandimento
- mat-proporzioni | Le proporzioni e la proprietà fondamentale
- mat-proprieta-proporzioni | Le altre proprietà delle proporzioni
- mat-termine-incognito | Il termine incognito di una proporzione

## mat-proporzionalita | Grandezze proporzionali
- mat-proporzionalita-diretta | La proporzionalità diretta
- mat-proporzionalita-inversa | La proporzionalità inversa
- mat-problemi-proporzionalita | Problemi di proporzionalità
- mat-ripartizione | Problemi di ripartizione

## percentuali | Le percentuali
- calcolo-percentuali | La percentuale e il suo calcolo
- percentuali-problemi | Sconti, aumenti e problemi con le percentuali
- mat-variazione-percentuale | La variazione percentuale
- mat-interesse | Interesse, risparmio e prestiti

## mat-quadrilateri | I quadrilateri
- mat-quadrilatero | Il quadrilatero e la sua classificazione
- mat-trapezi | I trapezi
- mat-parallelogramma | Il parallelogramma
- mat-rettangolo-rombo-quadrato | Rettangolo, rombo e quadrato

## mat-isometrie | Le isometrie
- mat-trasformazioni | Trasformazioni e figure congruenti
- mat-traslazione-rotazione | Traslazioni e rotazioni
- mat-simmetrie | Simmetria assiale e simmetria centrale

## mat-aree | Le aree dei poligoni
- mat-figure-equivalenti | Figure equivalenti ed equiscomponibili
- mat-area-rettangolo | L'area del rettangolo e del quadrato
- mat-area-parallelogramma-triangolo | L'area del parallelogramma e del triangolo
- mat-area-rombo-trapezio | L'area del rombo e del trapezio
- mat-aree-stime | Aree di figure composte e stime

## mat-pitagora | Il teorema di Pitagora
- mat-teorema-pitagora | Il teorema di Pitagora nel triangolo rettangolo
- mat-terne-pitagoriche | Le terne pitagoriche
- mat-pitagora-triangoli | Pitagora nei triangoli isosceli ed equilateri
- mat-pitagora-quadrilateri | Pitagora nei quadrilateri

## mat-similitudine | La similitudine
- mat-figure-simili | Figure simili e rapporto di similitudine
- mat-omotetia | L'omotetia
- mat-talete | Il teorema di Talete
- mat-criteri-similitudine | I criteri di similitudine dei triangoli
- mat-perimetri-aree-simili | Perimetri e aree di figure simili
- mat-teoremi-euclide | I teoremi di Euclide

# Terzo anno

## mat-numeri-relativi | I numeri relativi
- mat-relativi-confronto | Numeri relativi, valore assoluto e confronto
- mat-relativi-addizione | Addizione e sottrazione di numeri relativi
- mat-relativi-moltiplicazione | Moltiplicazione e divisione di numeri relativi
- mat-relativi-potenze | Potenze e radici di numeri relativi
- mat-relativi-espressioni | Espressioni con i numeri relativi
- mat-insiemi-numerici | Gli insiemi numerici, dai naturali ai reali

## mat-calcolo-letterale | Il calcolo letterale
- mat-sequenze | Regolarità e sequenze: generalizzare con le lettere
- mat-espressioni-letterali | Espressioni letterali e formule
- mat-monomi | I monomi
- mat-operazioni-monomi | Operazioni con i monomi
- mat-polinomi | Polinomi, addizione e sottrazione
- mat-polinomi-prodotto | Moltiplicazione tra polinomi
- mat-prodotti-notevoli | Quadrato di un binomio e somma per differenza

## mat-equazioni | Le equazioni di primo grado
- mat-identita-equazioni | Identità ed equazioni
- mat-principi-equivalenza | I principi di equivalenza
- mat-risolvere-equazioni | Risolvere un'equazione di primo grado
- mat-equazioni-impossibili | Equazioni determinate, indeterminate e impossibili
- mat-problemi-equazioni | Problemi risolti con le equazioni
- mat-formule-inverse | Le formule inverse

## mat-piano-cartesiano | Il piano cartesiano e le funzioni
- mat-coordinate | Coordinate nei quattro quadranti
- mat-distanza-punto-medio | Distanza tra due punti e punto medio
- mat-funzione | Il concetto di funzione
- mat-retta | Il grafico di una retta
- mat-rette-cartesiane | Rette parallele e perpendicolari nel piano cartesiano
- mat-iperbole-parabola | Iperbole e parabola
- mat-crescita-esponenziale | La crescita esponenziale

## mat-statistica | La statistica
- mat-frequenze | Frequenze assolute, relative e percentuali
- mat-grafici-foglio-calcolo | Grafici statistici e foglio di calcolo
- mat-valori-medi | Scegliere il valore medio adatto
- mat-campo-variazione | La variabilità e il campo di variazione

## mat-probabilita | La probabilità
- mat-eventi | Eventi certi, impossibili e aleatori
- mat-probabilita-evento | La probabilità di un evento
- mat-eventi-complementari | Eventi complementari e incompatibili
- mat-eventi-indipendenti | Eventi composti ed eventi indipendenti

## mat-circonferenza | Circonferenza e cerchio
- mat-circonferenza-elementi | Circonferenza, cerchio e loro parti
- mat-posizioni-circonferenza | Posizioni di rette e circonferenze
- mat-angoli-circonferenza | Angoli al centro e alla circonferenza
- mat-poligoni-inscritti | Poligoni inscritti e circoscritti
- mat-poligoni-regolari | Poligoni regolari e apotema

## mat-misura-cerchio | Lunghezza della circonferenza e area del cerchio
- mat-pi-greco | Il numero pi greco
- mat-lunghezza-circonferenza | Lunghezza della circonferenza e di un arco
- mat-area-cerchio | L'area del cerchio
- mat-settore-corona | Settore circolare e corona circolare

## mat-geometria-spazio | La geometria dello spazio
- mat-rette-piani-spazio | Rette e piani nello spazio
- mat-solidi | I solidi e i loro sviluppi
- mat-volume-peso | Volume, capacità e peso specifico

## mat-poliedri | Superficie e volume dei poliedri
- mat-prisma | Il prisma
- mat-parallelepipedo-cubo | Parallelepipedo e cubo
- mat-piramide | La piramide

## mat-solidi-rotazione | I solidi di rotazione
- mat-cilindro | Il cilindro
- mat-cono | Il cono
- mat-sfera | La sfera
- mat-solidi-composti | Solidi composti
