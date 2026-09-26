# Albero delle lezioni di informatica (scuola superiore)

Fonte dell'albero di `content_nodes` per l'informatica delle superiori (materia `computer-science` sotto
`high_school`), sul programma del liceo scientifico opzione scienze applicate. Proposta del 26 settembre
2026, da approvare; motivazioni e fonti in `programma.md`. Niente è stato applicato al database. Si
applica con `scripts/lezioni/tree.mts --level high_school --subject computer-science --file
docs/lezioni/informatica/albero.md` (prima senza scrivere, poi con `--apply`; serve
`JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`, perché `src/lib/seo/slug.ts` importa con `@/`).

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione, `+ vecchio-slug` dopo una
lezione indica una lezione di oggi che viene assorbita (deve essere vuota); `+ vecchio-slug` subito
dopo un capitolo, prima delle sue lezioni, indica un capitolo di oggi che viene assorbito (cancellato
quando è vuoto). Le righe `# Primo anno` ... `# Quinto anno` danno l'anno ai capitoli che seguono
(`content_nodes.school_year`). Lo slug è la chiave interna; l'indirizzo pubblico viene dal titolo. Gli
slug nuovi cominciano con `inf-`; tengono lo slug di oggi i capitoli e le lezioni che esistono già
(tutti vuoti).

I titoli delle lezioni di programmazione non nominano un linguaggio: il linguaggio è una domanda
aperta (vedi `programma.md`).

# Primo anno

## informatica | Informatica e informazione
- inf-informazione-dati | Informazione, dati e codici
- hardware-software | Hardware e software
- inf-bit-byte | Bit, byte e unità di misura

## inf-sistemi-numerazione | I sistemi di numerazione
- inf-sistemi-posizionali | I sistemi di numerazione posizionali
- inf-binario-decimale | Conversioni tra binario e decimale
- inf-esadecimale | Il sistema esadecimale
- inf-aritmetica-binaria | Addizione e moltiplicazione in binario

## inf-codifica | La codifica dell'informazione
- inf-interi-segno | Numeri interi con segno e complemento a due
- inf-virgola-mobile | Numeri reali in virgola mobile
- inf-codifica-caratteri | La codifica dei caratteri: ASCII e Unicode
- inf-codifica-immagini | La codifica delle immagini: pixel e colori
- inf-codifica-suoni | La codifica dei suoni

## inf-architettura | L'architettura del computer
- inf-von-neumann | La macchina di von Neumann
- inf-cpu | La CPU e il ciclo di esecuzione delle istruzioni
- memoria-storage | Memoria centrale e memorie di massa
- inf-bus-periferiche | Bus e periferiche
- inf-tipi-computer | Computer, dispositivi mobili e sistemi embedded

## sistemi-operativi | Il sistema operativo
- inf-funzioni-so | Funzioni del sistema operativo
- inf-avvio-interfacce | Avvio del computer e interfacce utente
- processi-thread | Processi, thread e multitasking
- inf-gestione-memoria | La gestione della memoria
- inf-file-system | Il file system: file, cartelle e percorsi

## office | Il foglio di calcolo
- excel | Celle, valori e formule
- inf-riferimenti-celle | Riferimenti relativi e assoluti
- inf-funzioni-foglio | Le funzioni del foglio di calcolo
- inf-funzioni-logiche | Condizioni e funzioni logiche
- inf-grafici-dati | Grafici per rappresentare i dati
- inf-analisi-dati | Ordinare, filtrare e riassumere i dati

## presentazioni | Documenti di testo e presentazioni
- word | Struttura di un documento elettronico
- inf-stili-indici | Stili, titoli, tabelle e indici automatici
- powerpoint | Progettare una presentazione
- creare-slide | Slide efficaci: testo, immagini e grafici
  + tools-present

# Secondo anno

## internet-web | Internet e il web
  + collaborazione-digitale
- internet | Internet, la rete delle reti
- inf-client-server | Il modello client-server
- inf-indirizzi-domini | Indirizzi IP e nomi di dominio
- http-html | Il web: ipertesti, URL e protocollo HTTP
- inf-servizi-internet | Posta elettronica e altri servizi di Internet
- inf-ricerca-informazioni | Cercare e valutare le informazioni in rete
- cloud | Il cloud: archiviare, condividere e lavorare insieme
  + collab-tools

## sicurezza | Sicurezza e cittadinanza digitale
- virus-malware | Virus e malware
- password-sicure | Password e autenticazione
- inf-phishing | Phishing e truffe in rete
- inf-privacy | Privacy e dati personali
- inf-diritto-autore | Diritto d'autore e licenze

## programmazione-visiva | Algoritmi e diagrammi di flusso
- algoritmi | Il concetto di algoritmo
- inf-problema-algoritmo | Dal problema all'algoritmo
- diagrammi-flusso | I diagrammi di flusso
- inf-pseudocodice | Lo pseudocodice
- inf-bohm-jacopini | Sequenza, selezione, iterazione e teorema di Böhm-Jacopini
- scratch | La programmazione a blocchi

## inf-primi-programmi | Linguaggi e primi programmi
- inf-linguaggi-programmazione | Linguaggi, compilatori e interpreti
- inf-input-output | Il primo programma: input e output
- inf-variabili-tipi | Variabili, assegnamento e tipi di dato
- inf-espressioni | Operatori ed espressioni
- inf-errori-debug | Errori e debug

## inf-selezione | La selezione
- inf-condizioni | Condizioni e operatori di confronto
- inf-selezione-due-vie | La selezione a due vie
- inf-operatori-logici | Gli operatori logici
- inf-selezione-multipla | Selezioni annidate e a più vie

## inf-iterazione | L'iterazione
- inf-ciclo-while | Il ciclo while
- inf-ciclo-for | Il ciclo for
- inf-contatori-accumulatori | Contatori e accumulatori
- inf-cicli-annidati | Cicli annidati
- inf-massimo-minimo-media | Massimo, minimo e media di una sequenza

# Terzo anno

## inf-funzioni | Le funzioni
- inf-definire-funzioni | Definire e chiamare una funzione
- inf-parametri-ritorno | Parametri e valore di ritorno
- inf-visibilita | Variabili locali e globali
- inf-passaggio-parametri | Passaggio dei parametri per valore e per riferimento
- inf-top-down | Scomporre un problema: la progettazione top-down

## inf-array | Vettori, matrici e stringhe
- inf-vettori | I vettori
- inf-ricerca-sequenziale | La ricerca sequenziale
- inf-matrici | Le matrici
- inf-stringhe | Le stringhe

## inf-ordinamento | Ricerca e ordinamento
- inf-ricerca-binaria | La ricerca binaria
- inf-selection-sort | L'ordinamento per selezione
- inf-bubble-sort | L'ordinamento a bolle
- inf-insertion-sort | L'ordinamento per inserimento
- inf-confronto-algoritmi | Confrontare gli algoritmi contando le operazioni

## inf-file | I file
- inf-file-testo | Leggere e scrivere un file di testo
- inf-file-csv | File di dati in formato CSV
- inf-xml-json | Dati strutturati: XML e JSON

## multimedia | Immagini, suoni e video digitali
- formati-multimediali | I formati dei file multimediali
- inf-bitmap-vettoriale | Grafica bitmap e grafica vettoriale
  + editing-base
- inf-compressione | La compressione dei dati, con e senza perdita
- inf-audio-video | Audio e video digitali
- inf-font | Caratteri tipografici e font

## inf-html | Il linguaggio HTML
- inf-markup | I linguaggi di markup
- inf-html-struttura | Struttura di una pagina HTML
- inf-html-testo-link | Testo, link e immagini
- inf-html-elenchi-tabelle | Elenchi e tabelle
- inf-html-moduli | I moduli

## inf-css | I fogli di stile
- inf-css-regole | Regole e selettori CSS
- inf-css-box | Il modello a scatola
- inf-css-layout | L'impaginazione di una pagina web
- inf-responsive | Pagine responsive e accessibili

## inf-web-interattivo | Pagine web interattive
- inf-script-client | Gli script nella pagina web
- inf-dom-eventi | Il DOM e gli eventi
- inf-validazione-moduli | Controllare i dati di un modulo

# Quarto anno

## inf-ricorsione | La ricorsione
- inf-funzioni-ricorsive | Funzioni ricorsive
- inf-ricorsione-esempi | Fattoriale, potenze e successione di Fibonacci
- inf-merge-sort | L'ordinamento per fusione

## inf-oggetti | La programmazione a oggetti
- inf-paradigmi | Dalla programmazione strutturata agli oggetti
- inf-classi-oggetti | Classi e oggetti
- inf-attributi-metodi | Attributi, metodi e costruttori
- inf-incapsulamento | L'incapsulamento
- inf-uml | Il diagramma delle classi UML
- inf-sottoclassi | Classi derivate ed ereditarietà
- inf-polimorfismo | Il polimorfismo

## inf-strutture-dati | Strutture dati
- inf-pila | La pila
- inf-coda | La coda
- inf-alberi-binari | Alberi binari di ricerca

## inf-progettazione-db | Progettare una base di dati
- inf-archivi-dbms | Dagli archivi ai DBMS
- inf-fasi-progettazione | Le fasi della progettazione
- inf-entita-attributi | Il modello E/R: entità e attributi
- inf-associazioni-er | Associazioni e cardinalità

## inf-modello-relazionale | Il modello relazionale
- inf-tabelle-chiavi | Relazioni, tabelle e chiavi
- inf-da-er-a-tabelle | Dallo schema E/R allo schema relazionale
- inf-integrita-referenziale | L'integrità referenziale
- inf-algebra-relazionale | Gli operatori dell'algebra relazionale
- inf-normalizzazione | La normalizzazione

## inf-sql | Il linguaggio SQL
- inf-sql-tabelle | Creare e modificare tabelle
- inf-sql-dati | Inserire, aggiornare e cancellare dati
- inf-sql-select | Interrogazioni su una tabella
- inf-sql-join | Interrogazioni su più tabelle: la join
- inf-sql-raggruppamenti | Funzioni di aggregazione e raggruppamenti
- inf-sql-annidate | Interrogazioni annidate

## inf-intelligenza-artificiale | L'intelligenza artificiale
- inf-ia-definizioni | L'intelligenza artificiale: definizioni e storia
- inf-ia-simbolica | L'intelligenza artificiale simbolica: regole e ricerca
- inf-imparare-esempi | Imparare dagli esempi: l'apprendimento automatico
- inf-neurone-artificiale | Il neurone artificiale e le reti neurali
- inf-ia-generativa | I sistemi generativi e i modelli linguistici
- inf-ia-distorsioni | Distorsioni, etica e regole dell'intelligenza artificiale

# Quinto anno

## inf-reti | Le reti di computer
- inf-elementi-rete | Elementi e tipi di rete
- inf-trasmissione-dati | Trasmettere i dati: banda, pacchetti ed errori
- inf-iso-osi | Il modello ISO/OSI
- inf-dispositivi-rete | Switch, router e access point

## inf-tcp-ip | Internet e i protocolli TCP/IP
- inf-suite-tcp-ip | La suite TCP/IP
- inf-indirizzi-ipv4 | Indirizzi IP, subnet mask e NAT
- inf-instradamento | L'instradamento dei pacchetti
- inf-tcp-udp | I protocolli TCP e UDP
- inf-dns | Il sistema dei nomi di dominio
- inf-web-dinamico | Il web dinamico: server, script e basi di dati

## inf-crittografia | Sicurezza e crittografia
- inf-sicurezza-sistemi | Riservatezza, integrità e disponibilità
- inf-cifrari-classici | I cifrari classici
- inf-chiave-simmetrica | La crittografia a chiave simmetrica
- inf-chiave-pubblica | La crittografia a chiave pubblica
- inf-rsa | L'algoritmo RSA
- inf-firma-digitale | Funzioni hash, firma digitale e certificati

## inf-grafi | Algoritmi sui grafi
- inf-grafi-rappresentazione | Grafi e loro rappresentazione
- inf-visite-grafi | Visita in ampiezza e in profondità
- inf-cammini-minimi | Il cammino minimo: l'algoritmo di Dijkstra

## inf-computabilita | Computabilità e complessità
- inf-automi | Gli automi a stati finiti
- inf-macchina-turing | La macchina di Turing
- inf-tesi-church-turing | La macchina universale e la tesi di Church-Turing
- inf-problema-fermata | Problemi non calcolabili: il problema della fermata
- inf-o-grande | Il costo di un algoritmo e la notazione O grande
- inf-classi-p-np | Problemi trattabili e intrattabili: le classi P e NP

## inf-calcolo-numerico | Il calcolo numerico
- inf-errori-numerici | Errori di arrotondamento e di troncamento
- inf-calcolo-pi-greco | Il calcolo di pi greco
- inf-bisezione | Gli zeri di una funzione: il metodo di bisezione
- inf-metodo-newton | Il metodo delle tangenti
- inf-integrazione-numerica | L'integrazione numerica

## inf-simulazione | La simulazione
- inf-modelli-simulazioni | Modelli e simulazioni
- inf-monte-carlo | Il metodo Monte Carlo
- inf-metodo-eulero | Simulare un moto: il metodo di Eulero
- inf-modello-dati | Confrontare un modello con i dati

## inf-apprendimento-automatico | L'apprendimento automatico
- inf-addestramento-verifica | Dati di addestramento e di verifica
- inf-regressione-lineare | La regressione lineare
- inf-classificazione | La classificazione: i vicini più prossimi
- inf-alberi-decisione | Gli alberi di decisione
- inf-addestrare-rete | Addestrare una rete neurale
