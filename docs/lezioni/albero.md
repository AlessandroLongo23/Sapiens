# Albero delle lezioni di matematica (scuola superiore)

Fonte dell'albero di `content_nodes` per la matematica delle superiori. Si applica con
`scripts/lezioni/tree.mts` (prima senza scrivere, poi con `--apply`). Proposta e motivazioni in
`programma.md`.

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione, `+ vecchio-slug` dopo una
lezione indica una lezione di oggi che viene assorbita (deve essere vuota). Lo slug è la chiave
interna (le configurazioni degli esercizi usano il percorso degli slug); l'indirizzo pubblico viene
dal titolo. Le righe `#` sono solo per chi legge.

# Primo anno

## insiemi-e-logica | Insiemi e logica
- prime-definizioni | Prime definizioni
- insiemi-rappresentazione | Rappresentazione degli insiemi
- sottoinsiemi-ugualianza | Sottoinsiemi e uguaglianza
- insiemi-unione | Unione insiemistica
- insiemi-intersezione | Intersezione insiemistica
- insiemi-differenza | Differenza e complementare
  + insiemi-complementare
- insiemi-prodotto-cartesiano | Prodotto cartesiano
- insiemi-operazioni | Proprietà delle operazioni tra insiemi
- logica-proposizioni | Proposizioni e connettivi logici
- logica-implicazione | Implicazione, condizioni necessarie e sufficienti
- logica-quantificatori | Quantificatori

## numeri-naturali | Numeri naturali \mathbb{N}
- numeri-naturali-operazioni | Operazioni in \mathbb{N}
- numeri-naturali-potenze | Potenze in \mathbb{N}
- numeri-naturali-divisibilita | Divisibilità e numeri primi
- numeri-naturali-mcm-mcd | MCD e MCM in \mathbb{N}

## numeri-interi | Numeri interi \mathbb{Z}
- numeri-interi-valore-assoluto | Numeri interi e valore assoluto
- numeri-interi-operazioni | Operazioni in \mathbb{Z}
- numeri-interi-potenze | Potenze in \mathbb{Z}

## numeri-razionali | Numeri razionali \mathbb{Q}
- numeri-razionali-frazioni | Frazioni e numeri razionali
- numeri-razionali-confronto-frazioni | Confronto tra frazioni
- numeri-razionali-operazioni | Operazioni in \mathbb{Q}
- numeri-razionali-potenze | Potenze in \mathbb{Q}
- numeri-razionali-espressioni | Espressioni con frazioni
- numeri-razionali-conversione | Numeri decimali e frazioni
- numeri-razionali-proporzioni | Rapporti, proporzioni e percentuali

## funzioni | Relazioni e funzioni
- relazioni-binarie | Relazioni binarie
- relazioni-equivalenza-ordine | Relazioni di equivalenza e d'ordine
- definizione-funzione | Definizione di funzione
- dominio-codominio-immagine | Dominio, codominio e immagine
- funzioni-iniettive-suriettive-biettive | Funzioni iniettive, suriettive e biettive
- composizione-di-funzioni | Composizione e funzione inversa
  + funzioni-invertibili
- funzioni-lineari | Proporzionalità diretta e inversa

## monomi-polinomi | Monomi e polinomi
- monomi | Monomi
- monomi-grado | Grado di un monomio
- monomi-operazioni | Operazioni tra monomi
  + monomi-potenza
- monomi-mcm-mcd | MCD e MCM tra monomi
- monomi-espressioni | Espressioni con monomi
- polinomi | Polinomi e grado di un polinomio
  + polinomi-grado
- polinomi-operazioni | Operazioni tra polinomi
- polinomi-prodotti-notevoli | Prodotti notevoli
- polinomi-espressioni | Espressioni con polinomi
- polinomi-divisione | Divisione tra polinomi
- polinomi-ruffini | Regola di Ruffini e teorema del resto

## scomposizione | Scomposizione in fattori
- scomposizione-raccoglimento | Raccoglimento totale e parziale
- scomposizione-prodotti-notevoli | Scomposizione con i prodotti notevoli
- scomposizione-trinomio | Trinomio di secondo grado
- scomposizione-ruffini | Scomposizione con la regola di Ruffini
- polinomi-mcd-mcm | MCD e MCM di polinomi

## frazioni-algebriche | Frazioni algebriche
- frazioni-algebriche-esistenza | Frazioni algebriche e condizioni di esistenza
- frazioni-algebriche-semplificazione | Semplificazione delle frazioni algebriche
- frazioni-algebriche-operazioni | Operazioni con le frazioni algebriche

## equazioni-sistemi | Equazioni di primo grado
- equazioni-primo-grado | Equazioni di primo grado intere
- equazioni-fratte | Equazioni fratte
- equazioni-letterali | Equazioni letterali
- equazioni-problemi | Problemi con le equazioni

## disequazioni-lineari | Disequazioni di primo grado
- disequazioni-primo-grado | Disequazioni di primo grado e intervalli
- sistemi-di-disequazioni | Sistemi di disequazioni
- disequazioni-razionali | Studio del segno e disequazioni fratte

## statistica | Statistica
- statistica-dati | Dati, frequenze e grafici
- statistica-medie | Media, mediana e moda
- statistica-variabilita | Indici di variabilità

## geometria-piano-triangoli | Geometria del piano: triangoli e quadrilateri
- geometria-enti | Enti geometrici, segmenti e angoli
- angoli-e-lati-dei-triangoli | Triangoli e criteri di congruenza
- geometria-punti-notevoli | Punti notevoli del triangolo
- geometria-perpendicolari-parallele | Rette perpendicolari e parallele
- geometria-quadrilateri | Parallelogrammi e trapezi

# Secondo anno

## sistemi-lineari | Sistemi lineari
- sistemi-di-equazioni | Sistemi di due equazioni in due incognite
- sistemi-cramer | Determinanti e regola di Cramer
- sistemi-problemi | Problemi con i sistemi

## numeri-reali | Numeri reali e radicali
- numeri-reali-irrazionali | Numeri irrazionali e numeri reali
- numeri-reali-radici | Radicali e loro proprietà
- radicali-operazioni | Operazioni con i radicali
- radicali-razionalizzazione | Razionalizzazione
- numeri-reali-espressioni | Espressioni con i radicali
- radicali-esponente-razionale | Potenze con esponente razionale

## geometria-analitica | Piano cartesiano e retta
- il-piano-cartesiano | Il piano cartesiano: distanza e punto medio
  + la-distanza-tra-due-punti
  + punto-medio-segmento
- equazione-di-una-retta | Equazione della retta e casi particolari
  + rette-passanti-per-origine-assi
  + equazioni-degli-assi
  + rette-parallele-asse-x
  + rette-parallele-asse-y
- il-coefficiente-angolare | Coefficiente angolare e retta per due punti
  + retta-passante-per-due-punti
- rette-parallele-tra-loro | Rette parallele e perpendicolari
  + rette-perpendicolari-tra-loro
  + retta-passante-per-un-punto
- intersezione-tra-due-rette | Intersezione tra due rette
- distanza-punto-retta | Distanza di un punto da una retta
- retta-fasci | Fasci di rette

## equazioni-di-secondo-grado | Equazioni di secondo grado
- equazioni-secondo-grado | Equazioni di secondo grado
- equazioni-secondo-grado-relazioni | Relazioni tra soluzioni e coefficienti
- equazioni-parametriche | Equazioni parametriche
- equazioni-secondo-grado-problemi | Problemi di secondo grado

## parabola-disequazioni | Parabola e disequazioni di secondo grado
- funzioni-quadratiche | La parabola
- disequazioni-secondo-grado | Disequazioni di secondo grado
- disequazioni-secondo-grado-fratte | Disequazioni fratte e sistemi di secondo grado

## grado-superiore | Equazioni e disequazioni di grado superiore
- equazioni-binomie-trinomie | Equazioni binomie, trinomie e scomponibili
- valore-assoluto-equazioni | Equazioni e disequazioni con il valore assoluto
- equazioni-irrazionali | Equazioni e disequazioni irrazionali
- sistemi-secondo-grado | Sistemi di secondo grado

## probabilita | Probabilità
- concetti-probabilita | Eventi e probabilità
- leggi-probabilita | Probabilità della somma e dell'evento contrario

## geometria-piano-circonferenza | Geometria del piano: circonferenza, aree e similitudine
- circonferenza-cerchio | Circonferenza e cerchio
- poligoni-inscritti | Poligoni inscritti e circoscritti
- equivalenza-aree | Equivalenza e aree
- circonferenza-lunghezza-area | Lunghezza della circonferenza e area del cerchio
- teorema-di-pitagora | Teoremi di Pitagora e di Euclide
  + teorema-di-euclide
- triangolo-rettangolo-trigonometria | Seno, coseno e tangente nel triangolo rettangolo
- teorema-di-talete | Teorema di Talete
- similitudine | Similitudine
- trasformazioni-geometriche | Trasformazioni geometriche

# Terzo anno

## funzioni-proprieta | Funzioni e loro proprietà
- funzioni-reali-di-variabile-reale | Funzioni reali e dominio
- funzioni-dispari-pari | Funzioni pari e dispari
- funzioni-monotone | Funzioni crescenti e decrescenti
- funzioni-periodiche | Funzioni periodiche
- grafici-trasformazioni | Trasformazioni dei grafici

## successioni | Successioni e progressioni
- successioni-numeriche | Successioni numeriche
- progressioni-aritmetiche | Progressioni aritmetiche
- progressioni-geometriche | Progressioni geometriche
- principio-induzione | Principio di induzione

## coniche | Circonferenza e coniche
- circonferenza-equazione | Equazione della circonferenza
- circonferenza-rette | Circonferenza e rette
- parabola-equazione | La parabola nel piano cartesiano
- parabola-rette | Parabola e rette
- ellisse | Ellisse
- iperbole | Iperbole
- iperbole-equilatera | Iperbole equilatera e funzione omografica

## esponenziali-logaritmi | Esponenziali e logaritmi
- funzioni-esponenziali | Funzione esponenziale
- equazioni-esponenziali | Equazioni esponenziali
- disequazioni-esponenziali | Disequazioni esponenziali
- logaritmi-proprieta | Logaritmi e loro proprietà
- funzioni-logaritmiche | Funzione logaritmica
- equazioni-logaritmiche | Equazioni logaritmiche
- disequazioni-logaritmiche | Disequazioni logaritmiche

## statistica-bivariata | Statistica bivariata
- distribuzioni-doppie | Distribuzioni doppie
- regressione-correlazione | Regressione e correlazione

# Quarto anno

## goniometria | Goniometria
- misura-angoli | Misura degli angoli: gradi e radianti
- funzioni-goniometriche | Funzioni goniometriche
- funzioni-goniometriche-inverse | Funzioni goniometriche inverse
- archi-associati | Archi associati
- formule-addizione-duplicazione | Formule di addizione e duplicazione
- formule-bisezione-prostaferesi | Formule di bisezione, parametriche e prostaferesi
- equazioni-goniometriche | Equazioni goniometriche
- disequazioni-goniometriche | Disequazioni goniometriche

## trigonometria | Trigonometria
- teoremi-sui-triangoli | Risoluzione dei triangoli rettangoli
- teorema-seni | Teorema dei seni
- teorema-coseno | Teorema del coseno
- trigonometria-applicazioni | Aree e applicazioni della trigonometria

## numeri-complessi | Numeri complessi
- complessi-forma-algebrica | Numeri complessi in forma algebrica
- complessi-forma-trigonometrica | Forma trigonometrica ed esponenziale
- complessi-potenze-radici | Potenze e radici dei numeri complessi

## calcolo-combinatorio | Calcolo combinatorio
- disposizioni-permutazioni | Disposizioni e permutazioni
- combinazioni | Combinazioni e binomio di Newton

## probabilita-avanzata | Probabilità condizionata
- probabilita-condizionata | Probabilità condizionata e composta
- teorema-bayes | Formula di Bayes

## geometria-solida | Geometria dello spazio
- rette-piani-spazio | Rette e piani nello spazio
- solidi-geometrici | Poliedri
- solidi-rotazione | Solidi di rotazione
- superfici-e-volumi-dei-solidi-geometrici | Aree e volumi dei solidi

# Quinto anno

## limiti | Limiti
- topologia-retta | Intervalli e intorni
- definizione-di-limite | Definizione di limite
- teoremi-sui-limiti | Teoremi sui limiti
- forme-indeterminate | Calcolo dei limiti e forme indeterminate
- limiti-notevoli | Limiti notevoli
- infinitesimi-infiniti | Infinitesimi e infiniti
- limiti-successioni | Limiti di successioni

## continuita | Continuità
- funzioni-continue | Funzioni continue e teoremi
- discontinuita | Punti di discontinuità
- asintoti | Asintoti

## derivate | Derivate
- definizione-derivata | Definizione di derivata
- derivate-funzioni | Derivate delle funzioni elementari
- regole-derivazione | Regole di derivazione
- non-derivabilita | Punti di non derivabilità
- teoremi-calcolo-differenziale | Teoremi di Rolle, Lagrange e De l'Hôpital

## studio-funzione | Studio di funzione
- applicazioni-derivate | Massimi, minimi e flessi
- studio-completo-funzione | Studio completo di una funzione
- problemi-massimo-minimo | Problemi di massimo e minimo

## integrali | Integrali
- integrali-indefiniti | Integrali indefiniti
- metodi-integrazione | Metodi di integrazione
- definizione-integrale | Integrale definito
  + integrali-definiti
- teorema-fondamentale | Teorema fondamentale del calcolo integrale
- aree-volumi-integrali | Aree e volumi con gli integrali
- integrali-impropri | Integrali impropri

## equazioni-differenziali-superiori | Equazioni differenziali
- equazioni-differenziali-primo | Equazioni differenziali del primo ordine
- equazioni-differenziali-secondo | Equazioni differenziali del secondo ordine

## distribuzioni-probabilita | Distribuzioni di probabilità
- variabili-aleatorie | Variabili aleatorie discrete
- distribuzioni-binomiale-poisson | Distribuzioni binomiale e di Poisson
- distribuzione-normale | Distribuzione normale

## geometria-analitica-spazio | Geometria analitica nello spazio
- coordinate-spazio-piani | Coordinate nello spazio e piani
- rette-sfere-spazio | Rette e sfere nello spazio
