# Albero delle lezioni: Analisi matematica II (università)

Fonte dell'albero di `content_nodes` per la materia `analisi-2` sotto `university`. Viene da
`vault/Contenuti/Programma di Analisi matematica I e II.md` (7 ottobre 2026), ricavato dai programmi ufficiali degli atenei: le lezioni
sono una prima divisione, da rivedere quando il capitolo si scrive. Si applica con
`scripts/lezioni/tree.mts --level university --subject analisi-2 --title "Analisi matematica II" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.
Le righe `+ slug` assorbono i 3 capitoli e le 3 lezioni segnaposto di prima, tutti vuoti.

## an2-spazio-r | Lo spazio Rⁿ
  + integralidoppi
  + integrali-tripli
  + serie-di-taylor
- an2-vettori-prodotto-scalare-norma-distanza | Vettori, prodotto scalare, norma e distanza
  + integrali-doppi
  + integrali-tripli
  + serie-taylor
- an2-insiemi-aperti-chiusi-frontiera | Insiemi aperti, chiusi e frontiera
- an2-insiemi-limitati-compatti-connessi | Insiemi limitati, compatti e connessi
- an2-rette-piani-quadriche-nello-spazio | Rette, piani e quadriche nello spazio
- an2-coordinate-polari-cilindriche-sferiche | Coordinate polari, cilindriche e sferiche

## an2-curve | Curve
- an2-curve-parametriche | Curve parametriche
- an2-vettore-tangente-retta-tangente | Vettore tangente e retta tangente
- an2-lunghezza-curva | Lunghezza di una curva
- an2-ascissa-curvilinea | Ascissa curvilinea
- an2-integrale-curvilineo-prima-specie | Integrale curvilineo di prima specie
- an2-curvatura-versore-normale-terna-frenet | Curvatura, versore normale e terna di Frenet

## an2-funzioni-piu-variabili-limiti-continuita | Funzioni di più variabili: limiti e continuità
- an2-dominio-grafico-insiemi-livello | Dominio, grafico e insiemi di livello
- an2-limiti-piu-variabili | Limiti in più variabili
- an2-tecniche-limiti | Tecniche per i limiti
- an2-continuita-teorema-weierstrass | Continuità e teorema di Weierstrass

## an2-calcolo-differenziale-piu-variabili | Calcolo differenziale in più variabili
- an2-derivate-parziali-gradiente | Derivate parziali e gradiente
- an2-derivate-direzionali | Derivate direzionali
- an2-differenziabilita-piano-tangente | Differenziabilità e piano tangente
- an2-teorema-differenziale-totale-formula-gradiente | Teorema del differenziale totale e formula del gradiente
- an2-funzioni-valori-vettoriali-matrice-jacobiana | Funzioni a valori vettoriali e matrice jacobiana
- an2-derivazione-funzioni-composte | Derivazione delle funzioni composte
- an2-derivate-seconde-teorema-schwarz-matrice | Derivate seconde, teorema di Schwarz e matrice hessiana
- an2-formula-taylor-secondo-ordine | Formula di Taylor al secondo ordine
- an2-teorema-valor-medio-funzioni-omogenee | Teorema del valor medio e funzioni omogenee

## an2-ottimizzazione | Ottimizzazione
- an2-punti-critici-teorema-fermat | Punti critici e teorema di Fermat
- an2-forme-quadratiche-segno-matrice-hessiana | Forme quadratiche e segno della matrice hessiana
- an2-classificazione-punti-critici | Classificazione dei punti critici
- an2-caso-hessiana-degenere | Il caso dell'hessiana degenere
- an2-teorema-funzioni-implicite-due-variabili | Teorema delle funzioni implicite in due variabili (Dini)
- an2-funzioni-implicite-piu-variabili-sistemi | Funzioni implicite in più variabili e sistemi
- an2-estremi-vincolati-parametrizzazione-vincolo | Estremi vincolati per parametrizzazione del vincolo
- an2-moltiplicatori-lagrange | Moltiplicatori di Lagrange
- an2-moltiplicatori-lagrange-tre-variabili-due | Moltiplicatori di Lagrange in tre variabili e con due vincoli
- an2-massimi-minimi-assoluti-insiemi-compatti | Massimi e minimi assoluti su insiemi compatti

## an2-integrali-doppi | Integrali doppi
- an2-integrale-doppio-domini-normali | Integrale doppio e domini normali
- an2-formule-riduzione | Formule di riduzione
- an2-cambiamento-variabili-determinante-jacobiano | Cambiamento di variabili e determinante jacobiano
- an2-integrali-doppi-coordinate-polari | Integrali doppi in coordinate polari
- an2-simmetrie-aree-baricentri-momenti-inerzia | Simmetrie, aree, baricentri e momenti d'inerzia

## an2-integrali-tripli | Integrali tripli
- an2-integrazione-fili-strati | Integrazione per fili e per strati
- an2-coordinate-cilindriche | Coordinate cilindriche
- an2-coordinate-sferiche | Coordinate sferiche
- an2-volumi-masse-baricentri-momenti-inerzia | Volumi, masse, baricentri e momenti d'inerzia
- an2-solidi-rotazione-teorema-guldino | Solidi di rotazione e teorema di Guldino
- an2-derivazione-sotto-segno-integrale | Derivazione sotto il segno di integrale

## an2-campi-vettoriali-integrali-linea | Campi vettoriali e integrali di linea
- an2-campi-vettoriali | Campi vettoriali
- an2-lavoro-campo-lungo-curva | Lavoro di un campo lungo una curva
- an2-forme-differenziali-lineari | Forme differenziali lineari
- an2-campi-conservativi-potenziale | Campi conservativi e potenziale
- an2-campi-irrotazionali-forme-chiuse | Campi irrotazionali e forme chiuse
- an2-insiemi-semplicemente-connessi-lemma-poincare | Insiemi semplicemente connessi e lemma di Poincaré
- an2-calcolo-potenziale | Calcolo del potenziale
- an2-formule-gauss-green-piano | Formule di Gauss-Green nel piano
- an2-teorema-divergenza-formula-stokes-piano | Teorema della divergenza e formula di Stokes nel piano

## an2-superfici-integrali-superficie | Superfici e integrali di superficie
- an2-superfici-parametriche-cartesiane | Superfici parametriche e cartesiane
- an2-piano-tangente-versore-normale | Piano tangente e versore normale
- an2-area-superficie | Area di una superficie
- an2-superfici-rotazione-teorema-guldino | Superfici di rotazione e teorema di Guldino
- an2-integrale-superficie-funzione | Integrale di superficie di una funzione
- an2-superfici-orientabili-flusso-campo | Superfici orientabili e flusso di un campo
- an2-teorema-divergenza | Teorema della divergenza
- an2-teorema-stokes | Teorema di Stokes
