# Albero delle lezioni di scienze (scuola media)

Fonte dell'albero di `content_nodes` per le scienze della scuola secondaria di primo grado (materia
`science` sotto `middle_school`, titolo "Scienze"). La materia oggi non esiste nel database: lo script
la crea con il titolo dato da `--title`. Proposta del 26 settembre 2026, da approvare; motivazioni e
fonti in `programma.md`. Niente è stato applicato al database. Si applica con
`scripts/lezioni/tree.mts --level middle_school --subject science --title Scienze --file
docs/lezioni/medie/scienze/albero.md` (prima senza scrivere, poi con `--apply`; serve
`JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`, perché `src/lib/seo/slug.ts` importa con `@/`).

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione. Le righe `# Primo anno`,
`# Secondo anno` e `# Terzo anno` danno l'anno ai capitoli che seguono (`content_nodes.school_year`).
Lo slug è la chiave interna; l'indirizzo pubblico viene dal titolo. Tutti gli slug sono nuovi e
cominciano con `sci-`; non ci sono lezioni o capitoli di oggi da assorbire.

# Primo anno

## sci-metodo | Il metodo scientifico e le misure
- sci-metodo-scientifico | Il metodo scientifico
- sci-grandezze-unita | Grandezze fisiche e unità di misura
- sci-strumenti-errori | Strumenti di misura ed errori
- sci-tabelle-grafici | Rappresentare i dati con tabelle e grafici

## sci-materia | La materia e le sue proprietà
- sci-corpi-materia | Corpi, materia e sostanze
- sci-massa-volume | Massa e volume
- sci-densita | La densità
- sci-stati-aggregazione | Solidi, liquidi e aeriformi
- sci-modello-particellare | Il modello particellare della materia

## sci-calore | Temperatura e calore
- sci-temperatura | La temperatura e i termometri
- sci-dilatazione | La dilatazione termica
- sci-calore-equilibrio | Il calore e l'equilibrio termico
- sci-propagazione-calore | Conduzione, convezione e irraggiamento
- sci-passaggi-stato | I passaggi di stato

## sci-idrosfera | L'acqua e l'idrosfera
- sci-acqua-sostanza | L'acqua, una sostanza speciale
- sci-ciclo-acqua | Il ciclo dell'acqua
- sci-mari-oceani | Mari e oceani
- sci-acque-continentali | Fiumi, laghi, ghiacciai e acque sotterranee
- sci-acqua-risorsa | L'acqua come risorsa e il suo inquinamento

## sci-atmosfera | L'atmosfera, il tempo e il clima
- sci-composizione-aria | La composizione dell'aria e gli strati dell'atmosfera
- sci-pressione-atmosferica | La pressione atmosferica
- sci-umidita-precipitazioni | Umidità, nuvole e precipitazioni
- sci-venti-previsioni | I venti e le previsioni del tempo
- sci-inquinamento-aria | L'inquinamento dell'aria
- sci-clima | Il clima e i climi dell'Italia
- sci-effetto-serra | L'effetto serra e il riscaldamento globale

## sci-suolo | Il suolo
- sci-suolo-formazione | Com'è fatto e come si forma il suolo
- sci-dissesto-idrogeologico | Erosione, frane e tutela del suolo

## sci-cellula | I viventi e la cellula
- sci-caratteristiche-viventi | Le caratteristiche dei viventi
- sci-cellula-struttura | La cellula, unità della vita
- sci-cellula-animale-vegetale | Cellula animale e cellula vegetale
- sci-energia-cellula | L'energia nella cellula: la respirazione cellulare
- sci-divisione-cellulare | La divisione cellulare

## sci-classificazione | La classificazione dei viventi
- sci-classificare | Classificare i viventi: la specie e il nome scientifico
- sci-domini-regni | Domini e regni
- sci-batteri | I batteri
- sci-protisti | I protisti
- sci-funghi | I funghi
- sci-virus | I virus

## sci-piante | Le piante
- sci-pianta-organizzazione | Com'è fatta una pianta
- sci-radice-fusto | La radice e il fusto
- sci-foglia-fotosintesi | La foglia e la fotosintesi
- sci-riproduzione-piante | La riproduzione delle piante e il fiore
- sci-seme-frutto | Il seme, il frutto e la germinazione
- sci-classificazione-piante | Muschi, felci, gimnosperme e angiosperme

## sci-invertebrati | Gli animali invertebrati
- sci-caratteristiche-animali | Le caratteristiche degli animali
- sci-poriferi-cnidari | Poriferi e cnidari
- sci-vermi | Platelminti, nematodi e anellidi
- sci-molluschi | I molluschi
- sci-artropodi | Gli artropodi e gli insetti
- sci-echinodermi | Gli echinodermi

## sci-vertebrati | Gli animali vertebrati
- sci-caratteristiche-vertebrati | Le caratteristiche dei vertebrati
- sci-pesci | I pesci
- sci-anfibi | Gli anfibi
- sci-rettili | I rettili
- sci-uccelli | Gli uccelli
- sci-mammiferi | I mammiferi
- sci-comportamento-animale | Il comportamento animale

# Secondo anno

## sci-atomo | L'atomo, gli elementi e i legami
- sci-struttura-atomo | Protoni, neutroni ed elettroni
- sci-numero-atomico | Numero atomico, numero di massa e isotopi
- sci-tavola-periodica | Gli elementi e la tavola periodica
- sci-metalli-non-metalli | Metalli, non metalli e gas nobili
- sci-legami-chimici | I legami chimici

## sci-miscugli | Sostanze, miscugli e soluzioni
- sci-sostanze-miscugli | Sostanze pure e miscugli
- sci-soluzioni-solubilita | Le soluzioni e la solubilità
- sci-separare-miscugli | Come si separano i miscugli

## sci-reazioni | Le reazioni chimiche
- sci-trasformazioni-chimiche | Trasformazioni fisiche e trasformazioni chimiche
- sci-reazioni-equazioni | Le reazioni chimiche e le equazioni
- sci-conservazione-massa | La conservazione della massa
- sci-ossidi-idrossidi-acidi | Ossidi, idrossidi e acidi
- sci-ph | Acidi, basi e scala del pH
- sci-neutralizzazione-sali | La neutralizzazione e i sali

## sci-chimica-carbonio | La chimica del carbonio
- sci-carbonio-idrocarburi | Il carbonio e gli idrocarburi
- sci-carboidrati-lipidi | Carboidrati e lipidi
- sci-proteine-acidi-nucleici | Proteine e acidi nucleici

## sci-moto | Il moto
- sci-traiettoria-riferimento | Posizione, traiettoria e sistema di riferimento
- sci-velocita-moto-uniforme | La velocità e il moto rettilineo uniforme
- sci-accelerazione | L'accelerazione e il moto vario
- sci-caduta-corpi | La caduta dei corpi

## sci-forze | Le forze e i principi della dinamica
- sci-forze-misura | Le forze e la loro misura
- sci-risultante | Sommare le forze: la risultante
- sci-peso-massa | La forza peso e la massa
- sci-attrito | L'attrito
- sci-principi-dinamica | I tre principi della dinamica

## sci-equilibrio | Equilibrio, leve e pressione
- sci-baricentro-equilibrio | Il baricentro e l'equilibrio dei corpi
- sci-leve | Le leve e il piano inclinato
- sci-pressione | La pressione
- sci-pressione-liquidi | La pressione nei liquidi e i vasi comunicanti
- sci-principio-pascal | Il principio di Pascal
- sci-galleggiamento | La spinta di Archimede e il galleggiamento

## sci-minerali-rocce | Minerali e rocce
- sci-minerali | I minerali
- sci-rocce-magmatiche | Le rocce magmatiche
- sci-rocce-sedimentarie | Le rocce sedimentarie
- sci-rocce-metamorfiche | Le rocce metamorfiche
- sci-ciclo-rocce | Il ciclo delle rocce

## sci-ecosistemi | Gli ecosistemi
- sci-ecosistema | Ecosistemi, popolazioni e comunità
- sci-relazioni-organismi | Predazione, competizione e simbiosi
- sci-catene-alimentari | Produttori, consumatori e decompositori
- sci-cicli-materia | I cicli della materia e il ciclo del carbonio
- sci-biomi | I biomi della Terra
- sci-biodiversita | La biodiversità e la sua tutela

## sci-corpo-organizzazione | Organizzazione del corpo e locomozione
- sci-tessuti | Cellule e tessuti
- sci-organi-apparati | Organi, sistemi e apparati
- sci-pelle | La pelle
- sci-ossa-scheletro | Le ossa e lo scheletro
- sci-articolazioni | Le articolazioni
- sci-muscoli | I muscoli e il movimento

## sci-digerente | Alimentazione e digestione
- sci-principi-nutritivi | Alimenti e principi nutritivi
- sci-dieta-equilibrata | Una dieta equilibrata
- sci-bocca-stomaco | L'apparato digerente: dalla bocca allo stomaco
- sci-intestino-fegato | L'intestino, il fegato e il pancreas

## sci-respirazione-escrezione | Respirazione ed escrezione
- sci-apparato-respiratorio | L'apparato respiratorio
- sci-scambi-gassosi | Respirare: ventilazione e scambi gassosi
- sci-fumo-polmoni | Il fumo e la salute dei polmoni
- sci-apparato-urinario | I reni e l'apparato urinario

## sci-circolazione-difese | Circolazione e difese immunitarie
- sci-sangue | Il sangue
- sci-cuore | Il cuore
- sci-vasi-circolazione | I vasi sanguigni e la doppia circolazione
- sci-sistema-linfatico | Il sistema linfatico
- sci-sistema-immunitario | Il sistema immunitario
- sci-vaccini | Vaccini e malattie infettive

# Terzo anno

## sci-lavoro-energia | Il lavoro, l'energia e le sue fonti
- sci-lavoro-potenza | Il lavoro e la potenza
- sci-forme-energia | L'energia e le sue forme
- sci-energia-meccanica | Energia cinetica ed energia potenziale
- sci-conservazione-energia | La conservazione dell'energia e il rendimento
- sci-fonti-fossili | Le fonti fossili
- sci-fonti-rinnovabili | Le fonti rinnovabili
- sci-energia-nucleare | L'energia nucleare: fissione e fusione

## sci-onde-suono | Onde e suono
- sci-oscillazioni | Le oscillazioni: il pendolo e la molla
- sci-onde | Le onde e le loro caratteristiche
- sci-suono | Il suono: altezza, intensità e timbro
- sci-fenomeni-acustici | L'eco e gli altri fenomeni acustici

## sci-elettricita | Elettricità e magnetismo
- sci-carica-elettrica | La carica elettrica, conduttori e isolanti
- sci-corrente-tensione | La corrente elettrica e la tensione
- sci-circuiti | I circuiti elettrici
- sci-leggi-ohm | Le leggi di Ohm
- sci-effetti-corrente | Gli effetti della corrente e la sicurezza
- sci-magneti | I magneti, il campo magnetico terrestre e la bussola
- sci-elettromagnetismo | Elettromagnetismo: elettrocalamite, motori e dinamo

## sci-luce | La luce
- sci-propagazione-luce | La propagazione della luce e le ombre
- sci-riflessione-specchi | La riflessione e gli specchi
- sci-rifrazione-lenti | La rifrazione e le lenti
- sci-colori | La dispersione della luce e i colori
- sci-luce-onda | La luce come onda: diffrazione e interferenza

## sci-vulcani-terremoti | Vulcani e terremoti
- sci-interno-terra | La struttura interna della Terra
- sci-vulcani | I vulcani e le eruzioni
- sci-terremoti | I terremoti e le onde sismiche
- sci-rischio-sismico-vulcanico | Il rischio vulcanico e sismico in Italia

## sci-tettonica | La tettonica delle placche
- sci-deriva-continenti | La deriva dei continenti
- sci-placche | Le placche e i loro movimenti
- sci-margini-placche | Dorsali, fosse e catene montuose

## sci-terra-luna | La Terra e la Luna
- sci-forma-terra | La forma della Terra e le coordinate geografiche
- sci-moti-terra | Rotazione e rivoluzione: il dì, la notte e le stagioni
- sci-luna-fasi | La Luna e le sue fasi
- sci-eclissi-maree | Eclissi e maree

## sci-sistema-solare | Il Sistema solare e l'Universo
- sci-geocentrico-eliocentrico | Dal modello geocentrico al modello eliocentrico
- sci-sole | Il Sole
- sci-pianeti | I pianeti e i corpi minori
- sci-stelle | La vita delle stelle
- sci-galassie | Le galassie e le distanze astronomiche
- sci-origine-universo | L'origine e l'evoluzione dell'Universo

## sci-evoluzione | L'evoluzione dei viventi
- sci-lamarck | Fissismo ed evoluzionismo: Lamarck
- sci-darwin | Darwin e la selezione naturale
- sci-prove-evoluzione | Le prove dell'evoluzione

## sci-storia-vita | La storia della vita sulla Terra
- sci-fossili-ere | I fossili e le ere geologiche
- sci-origine-vita | L'origine della vita e le prime cellule
- sci-evoluzione-umana | L'evoluzione umana

## sci-nervoso-endocrino | Sistema nervoso e sistema endocrino
- sci-neuroni | I neuroni e l'impulso nervoso
- sci-encefalo-midollo | L'encefalo e il midollo spinale
- sci-nervoso-periferico | Il sistema nervoso periferico e i riflessi
- sci-sistema-endocrino | Le ghiandole endocrine e gli ormoni
- sci-dipendenze | Alcol, droghe e dipendenze

## sci-sensi | Gli organi di senso
- sci-recettori-tatto | I recettori e il tatto
- sci-vista | La vista
- sci-udito-equilibrio | L'udito e l'equilibrio
- sci-gusto-olfatto | Il gusto e l'olfatto

## sci-riproduzione | La riproduzione umana
- sci-puberta | La pubertà
- sci-apparati-riproduttori | Gli apparati riproduttori maschile e femminile
- sci-ciclo-mestruale | Il ciclo ovarico e il ciclo mestruale
- sci-fecondazione-gravidanza | Fecondazione, gravidanza e parto
- sci-malattie-sessuali | Le infezioni sessualmente trasmissibili e la prevenzione

## sci-genetica | La genetica
- sci-mendel | Gli esperimenti di Mendel
- sci-leggi-mendel | Le leggi di Mendel
- sci-cromosomi-malattie-genetiche | Cromosomi, determinazione del sesso e malattie genetiche

## sci-dna | Il DNA e le biotecnologie
- sci-dna-duplicazione | Il DNA e la sua duplicazione
- sci-sintesi-proteine-mutazioni | La sintesi delle proteine e le mutazioni
- sci-biotecnologie | Le biotecnologie e gli OGM
