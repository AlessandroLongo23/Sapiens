# Albero delle lezioni di tecnologia (scuola media)

Fonte dell'albero di `content_nodes` per la tecnologia della scuola secondaria di primo grado (materia
`technology` sotto `middle_school`, titolo "Tecnologia"). La materia oggi non esiste nel database: lo
script la crea con il titolo dato da `--title`. Proposta del 26 settembre 2026, da approvare;
motivazioni e fonti in `programma.md`. Niente è stato applicato al database. Si applica con
`scripts/lezioni/tree.mts --level middle_school --subject technology --title Tecnologia --file
docs/lezioni/medie/tecnologia/albero.md` (prima senza scrivere, poi con `--apply`; serve
`JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`, perché `src/lib/seo/slug.ts` importa con `@/`).

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione. Le righe `# Primo anno`,
`# Secondo anno` e `# Terzo anno` danno l'anno ai capitoli che seguono (`content_nodes.school_year`).
Lo slug è la chiave interna; l'indirizzo pubblico viene dal titolo. Tutti gli slug sono nuovi e
cominciano con `tec-`; non ci sono lezioni o capitoli di oggi da assorbire.

# Primo anno

## tec-introduzione | La tecnologia e i settori produttivi
- tec-tecnica-tecnologia | Tecnica, tecnologia e scienza
- tec-bisogni-beni-servizi | Bisogni, beni e servizi
- tec-settori-produttivi | I tre settori produttivi
- tec-ciclo-produttivo | Materie prime, semilavorati e prodotti finiti
- tec-ciclo-vita | Il ciclo di vita di un prodotto

## tec-disegno-strumenti | Gli strumenti del disegno tecnico
- tec-strumenti-disegno | Fogli, matite, squadre e compasso
- tec-squadratura | La squadratura del foglio
- tec-linee-scritte | Tipi di linee e scritte
- tec-misure | Grandezze, unità e strumenti di misura
- tec-scale | Le scale di proporzione

## tec-materiali | I materiali e le loro proprietà
- tec-risorse-materiali | Risorse naturali e classificazione dei materiali
- tec-proprieta-fisiche-chimiche | Proprietà fisiche e chimiche
- tec-proprieta-meccaniche | Proprietà meccaniche
- tec-proprieta-tecnologiche | Proprietà tecnologiche

## tec-costruzioni-geometriche | Le costruzioni geometriche
- tec-perpendicolari-parallele | Rette perpendicolari e parallele
- tec-asse-bisettrice | Asse di un segmento e bisettrice di un angolo
- tec-triangoli-quadrilateri | Triangoli e quadrilateri
- tec-poligoni-inscritti | Poligoni regolari inscritti in una circonferenza
- tec-poligoni-lato | Poligoni regolari dato il lato
- tec-curve-raccordi | Ovali, spirali e raccordi

## tec-legno-carta | Il legno e la carta
- tec-legno | Il legno: struttura e proprietà
- tec-legno-lavorazione | La lavorazione del legno e i suoi derivati
- tec-carta-produzione | La produzione della carta
- tec-carta-riciclo | Tipi di carta e riciclo

## tec-computer | Il computer: hardware e software
- tec-sistema-informatico | Il sistema informatico
- tec-hardware | Processore, memorie e periferiche
- tec-codifica-binaria | Bit, byte e codifica binaria
- tec-sistema-operativo | Software e sistema operativo
- tec-file-cartelle | File, cartelle e file system

## tec-fibre-tessili | Le fibre tessili
- tec-fibre-naturali | Le fibre naturali
- tec-fibre-chimiche | Fibre artificiali e sintetiche
- tec-filatura-tessitura | Dalla fibra al tessuto

## tec-metalli | I metalli
- tec-metalli-leghe | Metalli e leghe
- tec-siderurgia | Ghisa e acciaio
- tec-metalli-non-ferrosi | Alluminio, rame e loro leghe
- tec-lavorazione-metalli | La lavorazione dei metalli

## tec-plastiche | Plastiche, nuovi materiali e riciclo
- tec-polimeri | Le materie plastiche
- tec-lavorazione-plastiche | La lavorazione delle plastiche
- tec-nuovi-materiali | Bioplastiche e materiali compositi
- tec-rifiuti-riciclo | Rifiuti, raccolta differenziata e riciclo

## tec-algoritmi | Algoritmi e pensiero computazionale
- tec-esecutore | Istruzioni ed esecutori
- tec-algoritmo | L'algoritmo
- tec-diagrammi-flusso | I diagrammi di flusso
- tec-strutture-controllo | Sequenza, selezione e ripetizione

# Secondo anno

## tec-proiezioni-ortogonali | Le proiezioni ortogonali
- tec-proiezioni-metodo | Il metodo delle proiezioni ortogonali
- tec-proiezioni-figure-piane | Proiezioni di segmenti e figure piane
- tec-proiezioni-solidi | Proiezioni di solidi e di oggetti
- tec-sezioni-solidi | Le sezioni dei solidi
- tec-sviluppo-solidi | Lo sviluppo dei solidi
- tec-quotatura | La quotatura

## tec-agricoltura | Agricoltura e allevamento
- tec-terreno-clima | Il terreno agrario e il clima
- tec-lavorazioni-terreno | Lavorazioni del terreno e macchine agricole
- tec-concimi-irrigazione | Concimazione, irrigazione e difesa delle colture
- tec-coltivazioni | Le principali coltivazioni
- tec-agricoltura-sostenibile | Agricoltura biologica, serre e biotecnologie
- tec-allevamento | L'allevamento
- tec-pesca-acquacoltura | Pesca e acquacoltura

## tec-alimentazione | L'alimentazione
- tec-principi-nutritivi | I principi nutritivi
- tec-fabbisogno-energetico | Il fabbisogno energetico e le calorie
- tec-dieta-equilibrata | La dieta equilibrata e la piramide alimentare

## tec-industria-alimentare | Produrre e conservare gli alimenti
- tec-filiera-alimentare | Dal campo alla tavola: la filiera alimentare
- tec-cereali-pane-pasta | Cereali, pane e pasta
- tec-latte-derivati | Il latte e i suoi derivati
- tec-carne-pesce-uova | Carne, pesce e uova
- tec-olio-vino-bevande | Olio, vino e altre bevande
- tec-conservazione-alimenti | Alterazione e conservazione degli alimenti
- tec-imballaggi-etichette | Conservanti, imballaggi ed etichette

## tec-internet | Telecomunicazioni e Internet
- tec-telecomunicazioni | Telefono, radio e televisione
- tec-reti | Le reti di computer
- tec-internet-funzionamento | Come funziona Internet: indirizzi e protocolli
- tec-web-servizi | Il Web e i servizi della rete
- tec-valutare-informazioni | Cercare e valutare le informazioni in rete

## tec-materiali-costruzione | Vetro, ceramica e materiali da costruzione
- tec-ceramica | La ceramica
- tec-vetro | Il vetro
- tec-pietre-laterizi | Pietre e laterizi
- tec-cemento-calcestruzzo | Calce, cemento e calcestruzzo

## tec-edificio | Costruire un edificio
- tec-strutture-portanti | Carichi e strutture portanti
- tec-elementi-edificio | Fondazioni, pilastri, travi e solai
- tec-cantiere | Dal progetto al cantiere

## tec-casa-citta | La casa e la città
- tec-pianta-casa | Rilevare e disegnare la pianta di una casa
- tec-impianti-casa | Gli impianti della casa
- tec-casa-sostenibile | Casa sostenibile, sicura e accessibile
- tec-citta-urbanistica | La città e il piano regolatore

## tec-sicurezza-digitale | Sicurezza e cittadinanza digitale
- tec-identita-digitale | Identità digitale e dati personali
- tec-password | Password e autenticazione
- tec-attacchi-informatici | Attacchi informatici e comportamenti sicuri
- tec-cifrari | Cifrari per proteggere i dati
- tec-rispetto-online | Rispetto online e cyberbullismo

## tec-programmare-blocchi | Programmare a blocchi
- tec-blocchi-eventi | Blocchi, eventi e sequenze
- tec-cicli | I cicli
- tec-condizioni | Condizioni e operatori logici
- tec-variabili | Le variabili
- tec-debug | Trovare e correggere gli errori

# Terzo anno

## tec-assonometrie | Le assonometrie
- tec-metodo-assonometrico | Il metodo assonometrico
- tec-cavaliera | L'assonometria cavaliera
- tec-isometrica | L'assonometria isometrica
- tec-cad-stampa-3d | Disegno al computer e stampa 3D

## tec-fonti-non-rinnovabili | L'energia e le fonti non rinnovabili
- tec-lavoro-energia-potenza | Lavoro, energia e potenza
- tec-forme-energia | Le forme di energia e le loro trasformazioni
- tec-fonti-consumi | Fonti di energia e consumi
- tec-combustibili-fossili | Carbone e gas naturale
- tec-petrolio | Il petrolio
- tec-centrale-termoelettrica | La centrale termoelettrica
- tec-centrale-nucleare | La centrale nucleare e le scorie

## tec-fonti-rinnovabili | Le fonti rinnovabili
- tec-idroelettrica | L'energia idroelettrica
- tec-solare-termico | Il solare termico
- tec-fotovoltaico | Il fotovoltaico
- tec-eolica | L'energia eolica
- tec-geotermia-biomasse | Geotermia e biomasse

## tec-elettricita | L'energia elettrica
- tec-circuito-componenti | Il circuito elettrico e i suoi simboli
- tec-legge-ohm | Corrente, tensione e la legge di Ohm
- tec-serie-parallelo | Collegamenti in serie e in parallelo
- tec-motore-alternatore | Motore elettrico e alternatore
- tec-rete-elettrica | Dalla centrale alla presa: la rete elettrica
- tec-consumi-elettrici | Potenza e consumi: il kilowattora
- tec-impianto-elettrico | L'impianto elettrico di casa e la sicurezza

## tec-energia-ambiente | Energia e ambiente
- tec-inquinamento-clima | Inquinamento, effetto serra e clima
- tec-risparmio-energetico | Risparmio ed efficienza energetica
- tec-sviluppo-sostenibile | Lo sviluppo sostenibile

## tec-macchine | Macchine e meccanismi
- tec-macchine-semplici | Le macchine semplici
- tec-trasmissione-moto | La trasmissione del moto
- tec-trasformazione-moto | La trasformazione del moto
- tec-motori-combustione | I motori a combustione

## tec-trasporti | I trasporti
- tec-trasporto-strada | Il trasporto su strada
- tec-trasporto-rotaia | Il trasporto su rotaia
- tec-navi-aerei | Navi e aerei
- tec-mobilita-sostenibile | La mobilità sostenibile

## tec-dati-ia | Dati e intelligenza artificiale
- tec-dati-societa | Dati digitali e società
- tec-ia-apprendimento | Come impara l'intelligenza artificiale
- tec-ia-generativa | L'intelligenza artificiale generativa
- tec-ia-controllo-umano | Errori, rischi e controllo umano

## tec-robotica | Robot, sensori e automazione
- tec-procedure-funzioni | Procedure e funzioni
- tec-schede-programmabili | Le schede programmabili
- tec-sensori-attuatori | Sensori, attuatori e raccolta di dati
- tec-programmare-robot | Programmare un robot
