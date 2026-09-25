# Albero delle lezioni di chimica (scuola superiore)

Fonte dell'albero di `content_nodes` per la chimica delle superiori (materia `chemistry` sotto
`high_school`). Proposta del 26 settembre 2026, approvata e applicata lo stesso giorno; motivazioni e
fonti in `programma.md`. Si applica con `scripts/lezioni/tree.mts --subject chemistry --file
docs/lezioni/chimica/albero.md` (prima senza scrivere, poi con `--apply`; serve
`JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`, perché `src/lib/seo/slug.ts` importa con `@/`).

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione, `+ vecchio-slug` dopo una
lezione indica una lezione di oggi che viene assorbita (deve essere vuota). Nuovo rispetto alla
matematica: `+ vecchio-slug` subito dopo un capitolo, prima delle sue lezioni, indica un capitolo di
oggi che viene assorbito (cancellato quando è vuoto). Le righe `# Primo anno` ... `# Quinto anno`
danno l'anno ai capitoli che seguono (`content_nodes.school_year`). Lo slug è la chiave interna;
l'indirizzo pubblico viene dal titolo. Gli slug nuovi cominciano con `chim-`; tengono lo slug di oggi
le lezioni e i capitoli che esistono già (tutti vuoti) e le sei lezioni scritte in `riscritte/`.

Due slug sono sia un capitolo sia una lezione: `reazioni-redox` e `cinetica-chimica`. `tree.mts`
confronta capitoli e lezioni separatamente, quindi è ammesso.

# Primo anno

## chim-misure | Misure e grandezze
- chim-grandezze-si | Grandezze e unità del Sistema Internazionale
- chim-massa-volume-densita | Massa, volume e densità
- chim-temperatura-calore | Temperatura e calore
- chim-errori-cifre-significative | Errori di misura e cifre significative

## chim-materia | La materia e le sue trasformazioni fisiche
- chim-stati-aggregazione | Gli stati di aggregazione
- chim-modello-particellare | Il modello particellare della materia
- chim-sostanze-miscugli | Sostanze pure, miscugli omogenei ed eterogenei
- chim-soluzioni-percentuale | Le soluzioni e la concentrazione percentuale
- chim-separazione-miscugli | Metodi di separazione dei miscugli
- chim-passaggi-stato | I passaggi di stato
- chim-curve-riscaldamento | Curve di riscaldamento e di raffreddamento

## chim-trasformazioni-chimiche | Dalle trasformazioni chimiche alla teoria atomica
- chim-trasformazioni-fisiche-chimiche | Trasformazioni fisiche e trasformazioni chimiche
- chim-elementi-composti | Elementi, composti e simboli chimici
- chim-legge-lavoisier | La legge di Lavoisier
- chim-legge-proust | La legge di Proust
- chim-legge-proporzioni-multiple | La legge di Dalton delle proporzioni multiple
- chim-teoria-atomica-dalton | La teoria atomica di Dalton
- chim-atomi-molecole-ioni | Atomi, molecole e ioni
- chim-formula-chimica | La formula chimica e il suo significato

# Secondo anno

## chim-gas | Le leggi dei gas
- chim-teoria-cinetica | La teoria cinetico-molecolare
- chim-pressione-gas | La pressione dei gas
- chim-legge-boyle | La legge di Boyle
- chim-legge-charles-gay-lussac | Le leggi di Charles e di Gay-Lussac
- chim-equazione-generale-gas | L'equazione generale dei gas
- chim-principio-avogadro | Il principio di Avogadro

## chim-quantita-sostanza | La quantità di sostanza: la mole
- mole-massa-molare | La mole e la massa molare
  + mole
- chim-formula-minima | Composizione percentuale, formula minima e formula molecolare
- chim-volume-molare | Il volume molare
- gas-ideali | L'equazione di stato dei gas ideali
- chim-pressioni-parziali | Miscele di gas e pressioni parziali

## atomo-struttura | Le particelle dell'atomo
- chim-natura-elettrica | La natura elettrica della materia
- particelle-fondamentali | Elettroni, protoni e neutroni
- chim-thomson-rutherford | I modelli atomici di Thomson e di Rutherford
- numero-massa | Numero atomico, numero di massa e isotopi
- chim-tavola-mendeleev | La tavola periodica di Mendeleev

## chim-acqua | La chimica dell'acqua
- chim-acqua-molecola | La molecola d'acqua e il legame a idrogeno
- chim-acqua-proprieta | Le proprietà fisiche dell'acqua
- chim-acqua-solvente | L'acqua come solvente
- chim-acqua-acidi-basi | Soluzioni acide e basiche: una prima idea del pH

# Terzo anno

## chim-struttura-elettronica | La struttura elettronica dell'atomo
- chim-luce-spettri | La luce e gli spettri atomici
- chim-modello-bohr | Il modello atomico di Bohr
- chim-livelli-energia | Livelli e sottolivelli di energia
- chim-onda-particella | Dualismo onda-particella e principio di indeterminazione
- chim-orbitali-numeri-quantici | Orbitali e numeri quantici
- chim-configurazione-elettronica | La configurazione elettronica

## chim-nucleo | Il nucleo e la radioattività
- chim-radioattivita | Radioattività e decadimenti
- chim-tempo-dimezzamento | Il tempo di dimezzamento
- chim-fissione-fusione | Fissione e fusione nucleare

## tavola-periodica | Il sistema periodico
- gruppi-periodi | Gruppi, periodi e blocchi
- chim-simboli-lewis | Elettroni di valenza e simboli di Lewis
- proprieta-periodiche | Raggio atomico ed energia di ionizzazione
- chim-affinita-elettronegativita | Affinità elettronica ed elettronegatività
- chim-metalli-non-metalli | Metalli, non metalli e semimetalli

## legami-chimici | I legami chimici
- chim-regola-ottetto | Energia di legame e regola dell'ottetto
- legame-covalente | Il legame covalente
- chim-legame-covalente-polare | Legame covalente polare e legame dativo
- legame-ionico | Il legame ionico
- chim-legame-metallico | Il legame metallico
- chim-formule-lewis | Le formule di Lewis delle molecole

## chim-forma-molecole | La forma delle molecole e le teorie del legame
- geometria-molecolare-vsepr | La geometria delle molecole (teoria VSEPR)
- chim-polarita-molecole | Molecole polari e apolari
- chim-legame-valenza | Teoria del legame di valenza: legami sigma e pi greco
- chim-ibridazione | L'ibridazione degli orbitali

## chim-forze-intermolecolari | Forze intermolecolari e stati condensati
- chim-forze-dipolo-london | Forze dipolo-dipolo e forze di London
- chim-legame-idrogeno | Il legame a idrogeno
- chim-stato-liquido | Lo stato liquido e la tensione di vapore
- chim-stato-solido | I solidi: ionici, molecolari, covalenti e metallici

## chim-nomenclatura | Classificazione e nomenclatura dei composti
- numero-ossidazione | Valenza e numero di ossidazione
- chim-ossidi | Ossidi basici e ossidi acidi
- chim-idruri-idracidi | Idruri e idracidi
- chim-idrossidi | Gli idrossidi
- chim-ossiacidi | Gli ossiacidi
- chim-sali-binari | I sali binari
- chim-sali-ternari | I sali ternari

# Quarto anno

## chim-soluzioni | Le proprietà delle soluzioni
- chim-solubilita | La dissoluzione e la solubilità
- chim-elettroliti | Elettroliti e non elettroliti
- chim-molarita | La molarità
- chim-molalita-frazione-molare | Molalità e frazione molare
- chim-diluizione | Diluizione e mescolamento di soluzioni
- chim-proprieta-colligative | Le proprietà colligative

## stechiometria | Le reazioni chimiche e la stechiometria
- equazioni-bilanciate | Le equazioni chimiche e il bilanciamento
- chim-tipi-reazioni | Sintesi, decomposizione, scambio e doppio scambio
- chim-equazioni-ioniche | Equazioni ioniche nette e reazioni di precipitazione
- chim-calcoli-stechiometrici | I calcoli stechiometrici
- chim-reagente-limitante | Reagente limitante e reagente in eccesso
- chim-resa | La resa di una reazione

## chimica-fisica | L'energia delle reazioni
- chim-sistema-energia-interna | Sistema, ambiente e primo principio
- chim-entalpia | Reazioni esotermiche ed endotermiche: l'entalpia
- chim-legge-hess | Entalpie di formazione e legge di Hess
- chim-entropia | L'entropia
- chim-energia-libera | Energia libera e spontaneità delle reazioni

## cinetica-chimica | La velocità di reazione
- velocita-reattiva | La velocità di reazione
  + cinetica-chimica
- chim-equazione-cinetica | Equazione cinetica e ordine di reazione
- chim-teoria-urti | Teoria degli urti ed energia di attivazione
- chim-fattori-velocita | I fattori che influenzano la velocità e i catalizzatori

## equilibrio-chimico | L'equilibrio chimico
- chim-equilibrio-dinamico | L'equilibrio dinamico
- costante-equilibrio | La costante di equilibrio
- chim-calcoli-equilibrio | Quoziente di reazione e calcoli all'equilibrio
- chim-le-chatelier | Il principio di Le Châtelier
- chim-prodotto-solubilita | Equilibri di solubilità e prodotto di solubilità

## chim-acidi-basi | Acidi e basi
- chim-teorie-acidi-basi | Le teorie di Arrhenius, Brønsted e Lowry, Lewis
- chim-ph | La ionizzazione dell'acqua, il pH e il pOH
- chim-forza-acidi-basi | La forza di acidi e basi: Ka e Kb
- chim-ph-forti | Il pH di acidi e basi forti
- chim-ph-deboli | Il pH di acidi e basi deboli

## chimica-analitica | Idrolisi, tamponi e titolazioni
- chim-idrolisi | Neutralizzazione e idrolisi salina
- chim-soluzioni-tampone | Le soluzioni tampone
- chim-indicatori | Gli indicatori acido-base
- titolazioni | La titolazione acido-base

## reazioni-redox | Le ossidoriduzioni
- chim-ossidazione-riduzione | Ossidazione e riduzione
- reazioni-redox | Bilanciare le redox con il numero di ossidazione
- chim-redox-semireazioni | Bilanciare le redox con il metodo delle semireazioni

## elettrochimica | L'elettrochimica
- pile | Le pile
- chim-potenziali-standard | I potenziali standard di riduzione
- chim-forza-elettromotrice | Forza elettromotrice e spontaneità delle redox
- chim-pile-accumulatori | Pile e accumulatori di uso comune
- chim-elettrolisi | L'elettrolisi e le leggi di Faraday

# Quinto anno

## chimica-organica | I composti del carbonio
- chim-carbonio-organico | L'atomo di carbonio nei composti organici
- chim-formule-organiche | Rappresentare le molecole organiche
- isomeria | Isomeria
- chim-reattivita-organica | Reagenti elettrofili e nucleofili, effetto induttivo
- gruppi-funzionali | I gruppi funzionali

## chim-idrocarburi | Gli idrocarburi
- idrocarburi | Gli alcani
- alcani-nomenclatura | Nomenclatura degli alcani
- chim-reazioni-alcani | Le reazioni degli alcani
- chim-cicloalcani | I cicloalcani
- chim-alcheni | Gli alcheni
- chim-addizione-elettrofila | L'addizione elettrofila agli alcheni
- chim-alchini | Gli alchini
- chim-benzene | Il benzene e i composti aromatici
- chim-sostituzione-aromatica | La sostituzione elettrofila aromatica

## chim-derivati-idrocarburi | I derivati degli idrocarburi
- chim-alogenuri-alchilici | Gli alogenuri alchilici
- chim-sostituzione-eliminazione | Sostituzione nucleofila ed eliminazione
- chim-alcoli | Gli alcoli
- chim-fenoli-eteri | Fenoli ed eteri
- chim-aldeidi-chetoni | Aldeidi e chetoni
- chim-acidi-carbossilici | Gli acidi carbossilici
- chim-esteri-saponi | Esteri e saponi
- chim-ammine-ammidi | Ammine e ammidi
- chim-polimeri | I polimeri

## biochimica | Le biomolecole
- chim-monosaccaridi | I monosaccaridi
  + macromolecole-vita
- chim-disaccaridi-polisaccaridi | Disaccaridi e polisaccaridi
- chim-trigliceridi | Acidi grassi e trigliceridi
- chim-fosfolipidi-steroidi | Fosfolipidi e steroidi
- amminoacidi-legame-peptidico | Amminoacidi e legame peptidico
- chim-enzimi | Gli enzimi
- chim-acidi-nucleici | Nucleotidi e acidi nucleici

## chim-metabolismo | Il metabolismo energetico
- chim-atp-coenzimi | ATP e coenzimi
- chim-glicolisi | La glicolisi
- chim-fermentazioni | Le fermentazioni
- chim-respirazione-cellulare | Ciclo di Krebs e fosforilazione ossidativa
- chim-fotosintesi | La fotosintesi

## chimica-ambientale | Approfondimenti: chimica, energia e ambiente
  + chimica-industriale
- chim-combustibili-fossili | Petrolio e combustibili fossili
- chim-effetto-serra | Anidride carbonica ed effetto serra
- inquinanti-ambientali | Piogge acide e inquinamento dell'aria
- processi-industriali | La sintesi industriale dell'ammoniaca
- chim-plastiche-riciclo | Plastiche e riciclo
