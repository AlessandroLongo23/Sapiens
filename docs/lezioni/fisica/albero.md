# Albero delle lezioni di fisica (scuola superiore)

Fonte dell'albero di `content_nodes` per la fisica delle superiori (materia `physics` sotto
`high_school`), sul programma del liceo scientifico. Proposta del 26 settembre 2026, da approvare;
motivazioni e fonti in `programma.md`. Niente è stato applicato al database. Si applica con
`scripts/lezioni/tree.mts --level high_school --subject physics --file docs/lezioni/fisica/albero.md`
(prima senza scrivere, poi con `--apply`; serve `JITI_ALIAS='{"@/": "<radice del repo>/src/"}'`,
perché `src/lib/seo/slug.ts` importa con `@/`). Prima di applicarlo va corretto un controllo di
`tree.mts` (vedi "Cosa cambia in tree.mts" in `programma.md`), altrimenti l'assorbimento di
`meccanica-razionale` si ferma.

Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione, `+ vecchio-slug` dopo una
lezione indica una lezione di oggi che viene assorbita (deve essere vuota), `+ vecchio-slug` subito
dopo un capitolo, prima delle sue lezioni, indica un capitolo di oggi che viene assorbito (cancellato
quando è vuoto). Le righe `# Primo anno` ... `# Quinto anno` danno l'anno ai capitoli che seguono
(`content_nodes.school_year`). Lo slug è la chiave interna; l'indirizzo pubblico viene dal titolo.
Gli slug nuovi cominciano con `fis-`; tengono lo slug di oggi i capitoli e le lezioni che esistono
già (tutti vuoti), anche quando cambiano titolo o anno.

# Primo anno

## fis-grandezze | Le grandezze fisiche e la misura
- fis-metodo-sperimentale | Il metodo sperimentale
- fis-grandezze-si | Grandezze fisiche e unità del Sistema Internazionale
- fis-grandezze-derivate | Grandezze derivate: area, volume e densità
- fis-strumenti-misura | Gli strumenti di misura
- fis-errori-misura | Errori casuali ed errori sistematici
- fis-valore-medio | Valore medio e incertezza di una serie di misure
- fis-incertezza-relativa | Incertezza relativa e propagazione delle incertezze
- fis-cifre-significative | Le cifre significative
- fis-relazione-laboratorio | La relazione di laboratorio

## fis-relazioni-grafici | Relazioni tra grandezze e grafici
- fis-tabelle-grafici | Tabelle e grafici cartesiani
- fis-proporzionalita-diretta | Proporzionalità diretta e dipendenza lineare
- fis-proporzionalita-inversa | Proporzionalità inversa e quadratica

## fis-vettori-forze | I vettori e le forze
- fis-scalari-vettori | Grandezze scalari e grandezze vettoriali
- fis-operazioni-vettori | Somma e differenza di vettori
- fis-seno-coseno | Seno e coseno per scomporre un vettore
- forze | Le forze e il dinamometro
- fis-forza-peso | La forza-peso e la massa
- fis-forza-elastica | La forza elastica e la legge di Hooke
- fis-attrito | Le forze di attrito

## fis-equilibrio-solidi | L'equilibrio dei solidi
- fis-equilibrio-punto | L'equilibrio di un punto materiale e le reazioni vincolari
- fis-equilibrio-piano-inclinato | L'equilibrio sul piano inclinato
- fis-momento-forza | Il momento di una forza e di una coppia di forze
- fis-equilibrio-corpo-rigido | L'equilibrio di un corpo rigido
- fis-leve | Le leve e le macchine semplici
- fis-baricentro | Il baricentro e la stabilità dell'equilibrio

## fis-equilibrio-fluidi | L'equilibrio dei fluidi
- fis-pressione | La pressione
- fis-legge-pascal | La legge di Pascal e il torchio idraulico
- fis-legge-stevino | La legge di Stevino e i vasi comunicanti
- fis-pressione-atmosferica | La pressione atmosferica e la sua misura
- fis-archimede | La spinta di Archimede e il galleggiamento

## ottica | L'ottica geometrica
- ottica-geometrica | I raggi di luce e la propagazione rettilinea
- riflessione | La riflessione e gli specchi piani
- fis-specchi-sferici | Gli specchi sferici
- fis-rifrazione | La rifrazione e la riflessione totale
- fis-dispersione | La dispersione della luce e i colori
- fis-lenti | Le lenti sottili
- fis-strumenti-ottici | L'occhio e gli strumenti ottici

# Secondo anno

## cinematica | Il moto rettilineo
- fis-punto-materiale | Punto materiale, traiettoria e sistema di riferimento
- velocita | La velocità media e istantanea
- fis-moto-rettilineo-uniforme | Il moto rettilineo uniforme e il grafico spazio-tempo
- fis-accelerazione | L'accelerazione
- moto-uniforme-accelerato | Il moto uniformemente accelerato
- fis-grafico-velocita-tempo | Il grafico velocità-tempo
- fis-caduta-libera | La caduta libera e il lancio verticale

## fis-moti-piano | I moti nel piano
- fis-spostamento-velocita-piano | Spostamento e velocità nel piano
- fis-composizione-moti | La composizione dei moti
- fis-moto-circolare-uniforme | Il moto circolare uniforme
- fis-accelerazione-centripeta | L'accelerazione centripeta
- fis-moto-armonico | Il moto armonico

## dinamica | I principi della dinamica
- fis-primo-principio | Il primo principio della dinamica e i sistemi inerziali
- leggi-newton | Il secondo principio della dinamica
- fis-terzo-principio | Il terzo principio della dinamica
- fis-diagramma-corpo-libero | Il diagramma delle forze

## fis-forze-movimento | Le forze e il movimento
- fis-piano-inclinato | Il moto lungo un piano inclinato
- fis-corpi-collegati | Corpi collegati e tensione dei fili
- fis-moto-proiettili | Il moto di un proiettile lanciato in orizzontale
- fis-forza-centripeta | La forza centripeta
- fis-pendolo-molla | Il pendolo e la molla

## lavoro-energia | Lavoro ed energia
- lavoro | Il lavoro di una forza
- fis-potenza | La potenza
- fis-energia-cinetica | L'energia cinetica e il teorema dell'energia cinetica
- fis-energia-potenziale | Energia potenziale gravitazionale ed elastica
- energia | La conservazione dell'energia meccanica
- fis-energia-totale | Forze dissipative e conservazione dell'energia totale

## fis-temperatura-calore | La temperatura e il calore
- fis-temperatura | La temperatura e le scale termometriche
- fis-dilatazione-termica | La dilatazione termica
- calore | Calore, capacità termica e calore specifico
- fis-equilibrio-termico | L'equilibrio termico e il calorimetro
- fis-propagazione-calore | Conduzione, convezione e irraggiamento
- fis-passaggi-stato | I passaggi di stato e il calore latente

# Terzo anno

## fis-relativita-galileiana | La dinamica e la relatività galileiana
- fis-prodotto-scalare-vettoriale | Prodotto scalare e prodotto vettoriale
- fis-sistemi-non-inerziali | Sistemi di riferimento inerziali e non inerziali
- fis-trasformazioni-galileo | Le trasformazioni di Galileo e la composizione delle velocità
- fis-principio-relativita-galileo | Il principio di relatività galileiana
- fis-forze-apparenti | Le forze apparenti: forza centrifuga e forza di Coriolis
- fis-lancio-obliquo | Il lancio obliquo e la gittata

## fis-forze-conservative | Il lavoro e le forze conservative
- fis-lavoro-forza-variabile | Il lavoro di una forza variabile
- fis-forze-conservative-energia | Forze conservative ed energia potenziale
  + lagrangiana
- fis-bilancio-energia | Il bilancio dell'energia con le forze non conservative

## fis-quantita-moto | La quantità di moto
- fis-quantita-moto-def | La quantità di moto
- fis-impulso | L'impulso e il teorema dell'impulso
- fis-conservazione-quantita-moto | La conservazione della quantità di moto
- fis-urti-anelastici | Gli urti anelastici
- fis-urti-elastici | Gli urti elastici in una e in due dimensioni
- fis-centro-massa | Il centro di massa

## fis-momento-angolare | Il corpo rigido e il momento angolare
  + meccanica-razionale
- fis-cinematica-rotazionale | Velocità angolare e accelerazione angolare
- fis-momento-inerzia | Il momento d'inerzia
- fis-dinamica-rotazionale | Momento torcente e dinamica delle rotazioni
- fis-energia-rotazionale | L'energia cinetica di rotazione e il rotolamento
- fis-momento-angolare-def | Il momento angolare
- fis-conservazione-momento-angolare | La conservazione del momento angolare

## fis-gravitazione | La gravitazione
- fis-sistemi-cosmologici | Dal sistema tolemaico al sistema copernicano
- fis-leggi-keplero | Le leggi di Keplero
- fis-gravitazione-universale | La legge di gravitazione universale
- fis-campo-gravitazionale | Il campo gravitazionale
- fis-satelliti | Il moto dei satelliti
- fis-energia-gravitazionale | L'energia potenziale gravitazionale e la velocità di fuga

## fis-fluidi | La meccanica dei fluidi
- fis-portata-continuita | La portata e l'equazione di continuità
- fis-bernoulli | L'equazione di Bernoulli
- fis-torricelli-venturi | Il teorema di Torricelli e l'effetto Venturi
- fis-viscosita | L'attrito viscoso e la velocità limite

## fis-gas | La temperatura e i gas
- fis-legge-boyle | La legge di Boyle
- fis-leggi-gay-lussac | Le leggi di Gay-Lussac
- fis-gas-perfetto | L'equazione di stato del gas perfetto
- fis-teoria-cinetica | La teoria cinetica dei gas
- fis-temperatura-microscopica | Temperatura ed energia cinetica delle molecole

## termodinamica | Il primo principio della termodinamica
- fis-sistemi-termodinamici | Sistemi termodinamici e principio zero
- fis-energia-interna | L'energia interna
- fis-lavoro-termodinamico | Il lavoro in una trasformazione termodinamica
- principi-termo | Il primo principio della termodinamica
- fis-trasformazioni-termodinamiche | Le trasformazioni isocora, isobara e isoterma
- fis-calori-molari | I calori molari dei gas
- fis-trasformazione-adiabatica | La trasformazione adiabatica

## fis-secondo-principio | Il secondo principio della termodinamica
- fis-macchine-termiche | Le macchine termiche e il rendimento
- fis-enunciati-kelvin-clausius | Gli enunciati di Kelvin e di Clausius
- fis-ciclo-carnot | Il teorema di Carnot e il ciclo di Carnot
- fis-frigoriferi | Frigoriferi e pompe di calore
- fis-entropia | L'entropia
- fis-entropia-disordine | Entropia e disordine

# Quarto anno

## onde-meccaniche | Le onde meccaniche
- propagazione-onde | Le onde e la loro propagazione
- fis-onde-periodiche | Onde periodiche: lunghezza d'onda, periodo e velocità
- fis-onda-armonica | L'equazione dell'onda armonica
- fis-interferenza-onde | Sovrapposizione e interferenza
- fis-onde-stazionarie | Le onde stazionarie e la risonanza
- fis-huygens-diffrazione | Il principio di Huygens, la rifrazione e la diffrazione delle onde

## fis-suono | Il suono
- acustica | Le onde sonore
- fis-intensita-suono | Altezza, timbro e intensità: il decibel
- fis-effetto-doppler | L'effetto Doppler
- fis-battimenti | Interferenza sonora e battimenti

## fis-luce-onde | La natura ondulatoria della luce
- fis-modelli-luce | Il modello corpuscolare e il modello ondulatorio della luce
- fis-esperimento-young | L'interferenza della luce: l'esperimento di Young
- fis-lamine-sottili | L'interferenza nelle lamine sottili
- fis-diffrazione-fenditura | La diffrazione da una fenditura
- fis-reticolo-diffrazione | Il reticolo di diffrazione

## elettrostatica | La carica elettrica e la legge di Coulomb
- fis-carica-elettrica | La carica elettrica e la sua conservazione
- fis-elettrizzazione | Conduttori, isolanti e modi di elettrizzazione
- fis-legge-coulomb | La legge di Coulomb
- fis-coulomb-materia | La forza di Coulomb nella materia e la polarizzazione

## fis-campo-elettrico | Il campo elettrico
- carica-campo | Il vettore campo elettrico
- fis-campo-cariche-puntiformi | Il campo di una o più cariche puntiformi
- fis-linee-campo | Le linee del campo elettrico
- fis-flusso-elettrico | Il flusso del campo elettrico
- fis-teorema-gauss | Il teorema di Gauss per il campo elettrico
- fis-campi-simmetrici | Il campo di distribuzioni di carica simmetriche

## fis-potenziale-elettrico | Il potenziale elettrico
- fis-energia-potenziale-elettrica | L'energia potenziale elettrica
- potenziale | Il potenziale elettrico e la differenza di potenziale
- fis-superfici-equipotenziali | Le superfici equipotenziali
- fis-circuitazione-elettrica | La circuitazione del campo elettrostatico
- fis-carica-campo-uniforme | Il moto di una carica in un campo elettrico uniforme

## fis-condensatori | Conduttori in equilibrio e condensatori
- fis-conduttori-equilibrio | Conduttori in equilibrio elettrostatico e capacità
- fis-condensatore-piano | Il condensatore piano
- fis-condensatori-serie-parallelo | Condensatori in serie e in parallelo
- fis-energia-condensatore | L'energia di un condensatore carico

## fis-corrente-continua | La corrente elettrica continua
- fis-corrente-elettrica | L'intensità di corrente e i generatori
- fis-leggi-ohm | Le leggi di Ohm e la resistività
- fis-resistori-serie-parallelo | Resistori in serie e in parallelo
- fis-leggi-kirchhoff | Le leggi di Kirchhoff
- fis-effetto-joule | L'effetto Joule e la potenza elettrica
- fis-forza-elettromotrice | Forza elettromotrice e resistenza interna
- fis-circuito-rc | La carica e la scarica di un condensatore

## elettromagnetismo | Fenomeni magnetici fondamentali
- fis-magneti | Magneti e linee del campo magnetico
- fis-correnti-magneti | Correnti e magneti: Oersted, Faraday e Ampère
- campi-magnetici | Il campo magnetico e la forza su un filo percorso da corrente
- fis-biot-savart | Il campo di un filo: la legge di Biot-Savart
- fis-spira-solenoide | Il campo di una spira e di un solenoide
- fis-motore-elettrico | Il momento su una spira e il motore elettrico

## fis-campo-magnetico | Il campo magnetico
- fis-forza-lorentz | La forza di Lorentz
- fis-carica-campo-magnetico | Il moto di una carica in un campo magnetico
- fis-flusso-magnetico | Il flusso del campo magnetico e il teorema di Gauss
- fis-teorema-ampere | La circuitazione del campo magnetico e il teorema di Ampère
- fis-magnetismo-materia | Le proprietà magnetiche dei materiali

# Quinto anno

## fis-induzione | L'induzione elettromagnetica
- fis-corrente-indotta | La corrente indotta
- indu-faraday | La legge di Faraday-Neumann
- fis-legge-lenz | La legge di Lenz
- fis-fem-movimento | La forza elettromotrice indotta in un conduttore in moto
- fis-autoinduzione | Autoinduzione, mutua induzione e induttanza
- fis-circuito-rl | Il circuito RL e l'energia del campo magnetico

## fis-corrente-alternata | La corrente alternata
- fis-alternatore | L'alternatore e i valori efficaci
- fis-circuiti-alternata | Resistori, condensatori e induttori in corrente alternata
- fis-circuito-rlc | Il circuito RLC e la risonanza
- fis-trasformatore | Il trasformatore

## fis-maxwell | Le equazioni di Maxwell e le onde elettromagnetiche
- fis-campo-elettrico-indotto | Il campo elettrico indotto
- fis-corrente-spostamento | La corrente di spostamento
- fis-equazioni-maxwell | Le equazioni di Maxwell
- fis-onde-elettromagnetiche | Le onde elettromagnetiche e la velocità della luce
- fis-energia-onde-em | Energia e intensità delle onde elettromagnetiche
- fis-polarizzazione | La polarizzazione
- fis-spettro-em | Lo spettro elettromagnetico e le sue applicazioni

## relativita | La relatività ristretta
- fis-michelson-morley | La velocità della luce e l'esperimento di Michelson e Morley
- relativita-ristretta | I postulati della relatività ristretta
- fis-simultaneita | La relatività della simultaneità
- fis-dilatazione-tempi | La dilatazione dei tempi
- fis-contrazione-lunghezze | La contrazione delle lunghezze
- fis-trasformazioni-lorentz | Le trasformazioni di Lorentz
- fis-velocita-relativistiche | La composizione relativistica delle velocità
- fis-dinamica-relativistica | Quantità di moto ed energia relativistiche
- fis-massa-energia | L'equivalenza tra massa ed energia

## fisica-moderna | I quanti di luce
- fis-corpo-nero | La radiazione di corpo nero
- quantizzazione-energia | L'ipotesi di Planck
- fis-effetto-fotoelettrico | L'effetto fotoelettrico
- fis-effetto-compton | L'effetto Compton

## fis-atomo | I modelli atomici
- fis-elettrone | La scoperta dell'elettrone e l'esperimento di Millikan
- modello-atomico | I modelli atomici di Thomson e di Rutherford
- fis-spettri-atomici | Gli spettri a righe
- fis-modello-bohr | Il modello di Bohr e l'esperimento di Franck e Hertz

## meccanica-quantistica | Onde di materia e indeterminazione
- fis-de-broglie | Le onde di materia di de Broglie
- fis-dualismo | Il dualismo onda-particella e la doppia fenditura
- fis-indeterminazione | Il principio di indeterminazione di Heisenberg
- fis-atomo-quantistico | L'atomo quantistico: numeri quantici e principio di Pauli

## fisica-nucleare | Il nucleo e la radioattività
- fis-nucleo | Il nucleo e la forza nucleare
- fis-energia-legame | Difetto di massa ed energia di legame
- radioattivita | I decadimenti alfa, beta e gamma
- fis-legge-decadimento | La legge del decadimento radioattivo

## fis-energia-nucleare | Energia nucleare e particelle elementari
- fis-fissione | La fissione nucleare e i reattori
- fis-fusione | La fusione nucleare
- fis-particelle-elementari | Le particelle elementari e il modello standard

## astrofisica | Approfondimenti: astrofisica e cosmologia
- fis-relativita-generale | Cenni di relatività generale
- evoluzione-stelle | La vita delle stelle
- fis-universo-espansione | L'universo in espansione e il Big Bang
