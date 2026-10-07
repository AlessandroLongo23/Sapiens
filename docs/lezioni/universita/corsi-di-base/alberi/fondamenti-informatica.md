# Albero delle lezioni: Fondamenti di Informatica (università)

Fonte dell'albero di `content_nodes` per la materia `fondamenti-informatica` sotto `university`. Viene da
`vault/Contenuti/Programma di Fondamenti di informatica.md` (7 ottobre 2026), ricavato dai programmi ufficiali degli atenei: le lezioni
sono una prima divisione, da rivedere quando il capitolo si scrive. Si applica con
`scripts/lezioni/tree.mts --level university --subject fondamenti-informatica --title "Fondamenti di Informatica" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.
Le righe `+ slug` assorbono i 5 capitoli e le 5 lezioni segnaposto di prima, tutti vuoti.

## fdi-rappresentazione-informazione | La rappresentazione dell'informazione
  + variabili-logiche
  + funzioni-logiche
  + porte-logiche
  + reti-combinatorie
  + reti-sequenziali
- fdi-bit-byte-codifica-informazione | Bit, byte e codifica dell'informazione
  + variabili-booleane
  + funzioni-boolean
  + porte-base
  + circuiti-combinatori
  + memorie-basiche
- fdi-sistemi-numerazione-posizionali | I sistemi di numerazione posizionali
- fdi-dal-binario-decimale-ritorno | Dal binario al decimale e ritorno
- fdi-ottale-esadecimale | Ottale ed esadecimale
- fdi-addizione-sottrazione-binario | Addizione e sottrazione in binario
- fdi-interi-senza-segno-overflow | Interi senza segno e overflow
- fdi-modulo-segno-complemento-eccesso | Modulo e segno, complemento a uno, eccesso
- fdi-complemento-due | Il complemento a due
- fdi-operazioni-complemento-due | Operazioni in complemento a due
- fdi-numeri-frazionari-binario-virgola-fissa | Numeri frazionari in binario e virgola fissa
- fdi-virgola-mobile-standard-ieee-754 | La virgola mobile e lo standard IEEE 754
- fdi-errori-arrotondamento | Errori di arrotondamento
- fdi-codifica-caratteri | La codifica dei caratteri
- fdi-immagini-suoni | Immagini e suoni

## fdi-logica-algebra-boole | Logica e algebra di Boole
- fdi-proposizioni-connettivi | Proposizioni e connettivi
- fdi-tabelle-verita | Tabelle di verità
- fdi-proprieta-algebra-boole-teoremi-de | Le proprietà dell'algebra di Boole e i teoremi di De Morgan
- fdi-semplificare-espressione-logica | Semplificare un'espressione logica
- fdi-dalle-espressioni-logiche-alle-porte | Dalle espressioni logiche alle porte

## fdi-calcolatore | Il calcolatore
- fdi-macchina-von-neumann | La macchina di von Neumann
- fdi-cpu-ciclo-prelievo-decodifica-esecuzione | La CPU e il ciclo di prelievo, decodifica ed esecuzione
- fdi-memoria-centrale | La memoria centrale
- fdi-memorie-massa-gerarchia-memorie | Memorie di massa e gerarchia delle memorie
- fdi-bus-dispositivi-ingresso-uscita | Bus e dispositivi di ingresso e uscita
- fdi-linguaggio-macchina-assembly | Linguaggio macchina e assembly
- fdi-sistema-operativo | Il sistema operativo
- fdi-processi-multitasking | Processi e multitasking
- fdi-file-system | Il file system
- fdi-reti-calcolatori-internet-breve | Reti di calcolatori e Internet in breve

## fdi-algoritmi-linguaggi | Algoritmi e linguaggi
- fdi-problemi-algoritmi-programmi | Problemi, algoritmi, programmi
- fdi-diagrammi-flusso | I diagrammi di flusso
- fdi-pseudocodice | Lo pseudocodice
- fdi-sequenza-selezione-iterazione | Sequenza, selezione, iterazione
- fdi-progettare-raffinamenti-successivi | Progettare per raffinamenti successivi
- fdi-tracciare-esecuzione-mano | Tracciare l'esecuzione a mano
- fdi-linguaggi-basso-alto-livello | Linguaggi di basso e di alto livello
- fdi-compilatori-interpreti | Compilatori e interpreti
- fdi-sintassi-semantica | Sintassi e semantica
- fdi-cosa-si-puo-calcolare | Che cosa si può calcolare

## fdi-variabili-tipi-espressioni | Variabili, tipi, espressioni
- fdi-primo-programma | Il primo programma
- fdi-variabili-assegnazione | Variabili e assegnazione
- fdi-tipi-interi | I tipi interi
- fdi-tipi-reali | I tipi reali
- fdi-caratteri | I caratteri
- fdi-tipo-booleano | Il tipo booleano
- fdi-operatori-aritmetici-precedenze | Operatori aritmetici e precedenze
- fdi-divisione-intera-resto | Divisione intera e resto
- fdi-conversioni-tipo | Conversioni di tipo
- fdi-leggere-dalla-tastiera-scrivere-video | Leggere dalla tastiera e scrivere a video
- fdi-costanti-funzioni-matematiche-libreria | Costanti e funzioni matematiche di libreria
- fdi-errori-sintassi-esecuzione-logica | Errori di sintassi, di esecuzione e di logica

## fdi-selezione | La selezione
- fdi-istruzione-if | L'istruzione if
- fdi-if-else-alternative-cascata | if-else e alternative in cascata
- fdi-operatori-confronto-operatori-logici | Operatori di confronto e operatori logici
- fdi-selezioni-annidate | Selezioni annidate
- fdi-scelta-multipla | La scelta multipla

## fdi-iterazione | L'iterazione
- fdi-ciclo-while | Il ciclo while
- fdi-ciclo-for | Il ciclo for
- fdi-ciclo-controllo-coda-do-while | Il ciclo con controllo in coda (do-while)
- fdi-contatori-accumulatori | Contatori e accumulatori
- fdi-cicli-sentinella-controllo-ingresso | Cicli con sentinella e controllo dell'ingresso
- fdi-cicli-annidati | Cicli annidati
- fdi-break-continue | break e continue
- fdi-algoritmi-numerici-cicli | Algoritmi numerici con i cicli

## fdi-funzioni | Le funzioni
- fdi-definire-chiamare-funzione | Definire e chiamare una funzione
- fdi-parametri-valore-restituito | Parametri e valore restituito
- fdi-variabili-locali-globali | Variabili locali e globali
- fdi-passaggio-valore | Il passaggio per valore
- fdi-passaggio-riferimento | Il passaggio per riferimento
- fdi-record-attivazione-pila-chiamate | Il record di attivazione e la pila delle chiamate
- fdi-scomporre-programma-funzioni | Scomporre un programma in funzioni

## fdi-array-matrici | Array e matrici
- fdi-array | Gli array
- fdi-scorrere-array | Scorrere un array
- fdi-massimo-minimo-somma-media | Massimo, minimo, somma e media
- fdi-inserire-eliminare-elemento | Inserire ed eliminare un elemento
- fdi-array-come-parametri-funzione | Array come parametri di una funzione
- fdi-copie-alias | Copie e alias
- fdi-matrici | Le matrici
- fdi-algoritmi-sulle-matrici | Algoritmi sulle matrici

## fdi-stringhe | Le stringhe
- fdi-stringhe-come-sequenze-caratteri | Stringhe come sequenze di caratteri
- fdi-leggere-scrivere-stringhe | Leggere e scrivere stringhe
- fdi-funzioni-libreria-sulle-stringhe | Le funzioni di libreria sulle stringhe
- fdi-algoritmi-sulle-stringhe | Algoritmi sulle stringhe
- fdi-stringa-numero-numero-stringa | Da stringa a numero e da numero a stringa
- fdi-dividere-testo-parole | Dividere un testo in parole

## fdi-ricorsione | La ricorsione
- fdi-definizioni-ricorsive | Definizioni ricorsive
- fdi-fattoriale-fibonacci | Fattoriale e Fibonacci
- fdi-cosa-succede-sulla-pila-chiamate | Che cosa succede sulla pila delle chiamate
- fdi-ricorsione-array-stringhe | Ricorsione su array e stringhe
- fdi-ricorsione-iterazione-confronto | Ricorsione e iterazione a confronto
- fdi-torri-hanoi | Le torri di Hanoi

## fdi-dati-strutturati | I dati strutturati
- fdi-record | Il record
- fdi-array-record | Array di record
- fdi-record-funzioni | Record e funzioni
- fdi-record-dentro-record | Record dentro record

## fdi-file | I file
- fdi-file-testo | File di testo
- fdi-scrivere-file-testo | Scrivere su un file di testo
- fdi-leggere-file-riga-riga | Leggere un file riga per riga
- fdi-elaborare-dati-tabellari-file | Elaborare dati tabellari da file
- fdi-file-binari | I file binari

## fdi-costo-algoritmi | Il costo degli algoritmi
- fdi-contare-operazioni | Contare le operazioni
- fdi-caso-migliore-caso-peggiore-caso | Caso migliore, caso peggiore, caso medio
- fdi-notazione-grande | La notazione O-grande
- fdi-classi-costo-piu-comuni | Le classi di costo più comuni

## fdi-ricerca-ordinamento | Ricerca e ordinamento
- fdi-ricerca-lineare | La ricerca lineare
- fdi-ricerca-binaria | La ricerca binaria
- fdi-ordinamento-selezione | L'ordinamento per selezione
- fdi-ordinamento-inserzione | L'ordinamento per inserzione
- fdi-bubble-sort | Il bubble sort
- fdi-fondere-due-sequenze-ordinate | Fondere due sequenze ordinate
- fdi-merge-sort | Il merge sort
- fdi-quick-sort | Il quick sort
- fdi-ordinamenti-confronto-limite-inferiore-ordinamento | Gli ordinamenti a confronto e il limite inferiore dell'ordinamento

## fdi-puntatori-c | I puntatori in C
- fdi-indirizzi-variabili-puntatore | Indirizzi e variabili puntatore
- fdi-operatori | Gli operatori & e *
- fdi-puntatori-come-parametri | Puntatori come parametri
- fdi-puntatori-array | Puntatori e array
- fdi-aritmetica-puntatori | L'aritmetica dei puntatori
- fdi-puntatori-stringhe | Puntatori e stringhe
- fdi-puntatori-struct-operatore-freccia | Puntatori a struct e operatore freccia
- fdi-puntatori-puntatori | Puntatori a puntatori
- fdi-errori-tipici | Gli errori tipici

## fdi-memoria-dinamica-c | La memoria dinamica in C
- fdi-stack-heap | Stack e heap
- fdi-malloc-free | malloc e free
- fdi-array-dinamici | Array dinamici
- fdi-ridimensionare-realloc | Ridimensionare con realloc
- fdi-matrici-dinamiche | Matrici dinamiche
- fdi-memory-leak-altri-errori-gestione | Memory leak e altri errori di gestione della memoria

## fdi-liste-concatenate-tipi-dato-astratti | Liste concatenate e tipi di dato astratti in C
- fdi-nodi-liste-concatenate | Nodi e liste concatenate
- fdi-inserire-testa-scorrere-lista | Inserire in testa e scorrere la lista
- fdi-inserire-coda-ordine | Inserire in coda e in ordine
- fdi-cercare-eliminare-nodo | Cercare ed eliminare un nodo
- fdi-liste-ricorsione | Liste e ricorsione
- fdi-liste-doppiamente-concatenate | Liste doppiamente concatenate
- fdi-cos-tipo-dato-astratto | Che cos'è un tipo di dato astratto
- fdi-pila | La pila
- fdi-coda | La coda
- fdi-alberi-binari-visite | Alberi binari e visite
- fdi-alberi-binari-ricerca | Alberi binari di ricerca

## fdi-programmi-piu-file-c | Programmi su più file in C
- fdi-typedef-enum-union | typedef, enum e union
- fdi-preprocessore | Il preprocessore
- fdi-file-intestazione-compilazione-separata | File di intestazione e compilazione separata
- fdi-costruire-libreria-funzioni | Costruire una libreria di funzioni

## fdi-dal-c-c | Dal C al C++
- fdi-ingresso-uscita-cin-cout | Ingresso e uscita con cin e cout
- fdi-riferimenti-passaggio-riferimento | I riferimenti e il passaggio per riferimento
- fdi-new-delete | new e delete
- fdi-classe-string | La classe string
- fdi-sovraccarico-funzioni-template-funzione | Sovraccarico di funzioni e template di funzione
- fdi-flussi-file-ifstream-ofstream | I flussi su file (ifstream, ofstream)

## fdi-collezioni-eccezioni-moduli-python | Collezioni, eccezioni e moduli di Python
- fdi-liste | Le liste
- fdi-tuple | Le tuple
- fdi-insiemi | Gli insiemi
- fdi-dizionari | I dizionari
- fdi-strutture-annidate | Strutture annidate
- fdi-riferimenti-oggetti-modificabili-copie | Riferimenti, oggetti modificabili e copie
- fdi-metodi-stringhe-formattazione-uscita | Metodi delle stringhe e formattazione dell'uscita
- fdi-eccezioni | Le eccezioni
- fdi-sollevare-eccezione-controllare-dati-ingresso | Sollevare un'eccezione e controllare i dati in ingresso
- fdi-moduli-import | Moduli e import

## fdi-classi-oggetti | Classi e oggetti
- fdi-dal-record-classe | Dal record alla classe
- fdi-costruttori | I costruttori
- fdi-incapsulamento | Incapsulamento
- fdi-tipo-dato-astratto-scritto-come | Un tipo di dato astratto scritto come classe
- fdi-sovraccarico-operatori | Sovraccarico degli operatori
- fdi-ereditarieta-breve | L'ereditarietà in breve
- fdi-polimorfismo-breve | Il polimorfismo in breve
