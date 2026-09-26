# Programma di scienze della scuola media: proposta per l'albero delle lezioni

Proposta del 26 settembre 2026, da approvare. L'albero proposto è in `albero.md` (stesso formato
degli alberi di matematica e di chimica): 39 capitoli e 187 lezioni sui tre anni. Niente è stato
applicato al database.

La materia oggi non esiste nel sito: va creata come `science` sotto il livello `middle_school`, con
titolo "Scienze". `scripts/lezioni/tree.mts` la crea da solo con `--level middle_school --subject
science --title Scienze`. Una sola materia per fisica, chimica, biologia, scienze della Terra e
astronomia, come nella scuola media: le Indicazioni nazionali hanno una sola disciplina "Scienze" e i
libri sono di scienze integrate.

## Fonti

- Indicazioni nazionali per il curricolo della scuola dell'infanzia e del primo ciclo, DM 254 del 16
  novembre 2012, capitolo "Scienze" (testo letto il 26 settembre 2026 nella copia PDF pubblicata da
  Mondadori Education, mondadorieducation.it; l'originale è su mim.gov.it). I traguardi al termine
  della secondaria di primo grado sono generali (l'alunno "esplora e sperimenta", "riconosce nel
  proprio organismo strutture e funzionamenti a livelli macroscopici e microscopici", "ha una visione
  della complessità del sistema dei viventi e della loro evoluzione nel tempo", è consapevole "del
  carattere finito delle risorse"). Gli obiettivi al termine della classe terza sono divisi in tre
  gruppi:
  - fisica e chimica: usare i concetti di "pressione, volume, velocità, peso, peso specifico, forza,
    temperatura, calore, carica elettrica", con esperienze come piano inclinato, galleggiamento, vasi
    comunicanti, fusione del ghiaccio, circuito pila-interruttore-lampadina; l'energia "come quantità
    che si conserva" e la produzione di calore nelle catene energetiche; la trasformazione chimica,
    con esempi come le soluzioni in acqua, la combustione di una candela, bicarbonato e aceto;
  - astronomia e scienze della Terra: fenomeni celesti, moti della Terra, dì e notte, stagioni,
    eclissi di Sole e di Luna; i principali tipi di rocce e i processi geologici; la struttura della
    Terra e la tettonica a placche; i rischi sismici, vulcanici e idrogeologici della propria regione;
  - biologia: somiglianze e differenze tra le specie; le grandi classificazioni, i fossili,
    l'evoluzione; il modello cellulare (respirazione cellulare, metabolismo, duplicazione delle
    cellule, fotosintesi); le "prime elementari nozioni di genetica"; sviluppo puberale e sessualità,
    alimentazione, danni di fumo e droghe; biodiversità e scelte ecologicamente sostenibili.
- Nuove Indicazioni nazionali: regolamento adottato con DM 9 dicembre 2025, n. 221, pubblicato nella
  Gazzetta Ufficiale n. 21 del 27 gennaio 2026, in vigore dall'11 febbraio 2026. Testo della Gazzetta
  letto il 26 settembre 2026 nella copia PDF su cislscuola.it. Non è più una bozza: l'articolo 1
  sostituisce le Indicazioni del 2012 e le fa adottare "a decorrere dall'anno scolastico 2026/2027
  [...] a partire dalle classi prime" della primaria e della secondaria di primo grado; l'articolo 3
  chiede agli editori di adeguare i libri delle classi prime dal 2026/27. Il calendario per le altre
  classi (seconde nel 2027/28, terze nel 2028/29, quando le Indicazioni del 2012 cessano del tutto)
  viene da Orizzonte Scuola (articolo sul calendario di attuazione, letto il 26 settembre 2026) e non
  l'ho trovato nel testo del decreto: da verificare. Le ore di scienze non cambiano (resta il DPR 89
  del 2009). Per le scienze della secondaria il testo nuovo ha "competenze attese" e "obiettivi
  specifici di apprendimento al termine della classe terza", divisi in: fenomeni naturali e di origine
  antropica; fenomeni fisici e astronomici; chimica e trasformazioni della materia; energia nei
  fenomeni fisici; fonti energetiche e trasformazioni; esseri viventi e corpo umano; ambiente e
  scienze della Terra; interconnessioni tra scienza, tecnologia, arte e società. Chiude con un elenco
  di conoscenze per chimica, biologia, geologia, fisica e astronomia, fonti di energia. Rispetto al
  2012 compaiono in modo esplicito:
  - moti descritti con posizione, spostamento, velocità e accelerazione, anche con la video-analisi;
    il moto armonico del sistema massa-molla; "moti, oscillazioni e onde";
  - la luce: propagazione nei mezzi, ottica geometrica, e "fenomeni di diffrazione, interferenza e
    polarizzazione della luce attraverso esperimenti pratici";
  - elettricità e magnetismo distinti "a livello fenomenologico", circuiti a corrente costante;
  - la distinzione tra forza ed energia e tra forme e fonti di energia; efficienza energetica;
    lavoro, potenza e rendimento; "energia nucleare da fissione e da fusione";
  - il ciclo del carbonio, produttori, consumatori e decompositori, fotosintesi e respirazione;
    procarioti ed eucarioti; introduzione alla teoria di Darwin;
  - il clima e l'effetto serra; l'analisi dimensionale e gli ordini di grandezza; le georisorse;
  - le malattie sessualmente trasmissibili; la prevenzione delle dipendenze;
  - sistema solare, "evoluzione dell'Universo", confronto tra modello geocentrico ed eliocentrico.

  Nessuno dei due testi dice in quale anno si studia un argomento: gli obiettivi sono tutti "al
  termine della classe terza". L'anno di ogni capitolo viene quindi dai libri.
- Leopardi, Bubani, Marcaccio, Perri, "Scienze Live" 1, 2 e 3, Garzanti Scuola, 2019. Indici per
  unità e lezione letti il 26 settembre 2026 su seleggo.org (pagine "Scienze Live 1", "2", "3").
  L'indice del primo volume letto così salta alcune lezioni (per esempio la terza dell'unità 1): da
  verificare sul libro. Primo volume: metodo e misure, materia, temperatura e calore, idrosfera,
  atmosfera, suolo, viventi e cellula, classificazione, procarioti protisti funghi e virus, piante,
  animali, invertebrati, vertebrati. Secondo: atomo e chimica, chimica del carbonio, movimento,
  forze, struttura della Terra e rocce, comportamento animale, ecologia, rivestimento e locomozione,
  circolazione e difese, alimentazione e digestione, respirazione ed escrezione. Terzo: lavoro ed
  energia, onde e suono, elettricità e magnetismo, luce, vulcani e terremoti, tettonica e storia della
  Terra, Terra e Luna, Sistema solare e Universo, storia della vita, evoluzione, controllo e
  regolazione, organi di senso, riproduzione, biologia molecolare, genetica e biotecnologie.
- Leopardi, Bubani, "Scienze Network 2", Garzanti Scuola, 2020 (seleggo.org, stesso giorno). Stesso
  impianto del secondo volume di Scienze Live, con le rocce aperte dalla struttura interna della Terra
  e con i combustibili fossili.
- Zanoli, "Intorno a te", volumi 1, 2 e 3, A. Mondadori Scuola, 2024 (seleggo.org, stesso giorno).
  Stessa divisione per anni di Scienze Live, con due differenze: miscugli e soluzioni sono nel
  capitolo A4 del secondo volume, dentro "Le basi della chimica"; nel terzo volume l'evoluzione (C9)
  viene prima della storia della vita (C10) e Mendel (D10) prima della biologia molecolare (D11). Nel
  secondo volume il comportamento animale (C8) viene dopo l'ecologia (C7).
- Banfi, Peraboni, "Mosaico scienze" vol. 3, Fabbri Scuola, 2019 (seleggo.org, stesso giorno):
  stessi argomenti di terzo anno degli altri due, in un ordine diverso (fisica, poi astronomia, poi
  Terra, poi corpo umano, genetica ed evoluzione). Primo e secondo volume non trovati.
- Saraceni, Strumia, "Osservare e capire. Le scienze", edizione verde, Zanichelli: volume 1 (anno non
  indicato) e seconda edizione 2025, volumi tematici A "La materia" e B "La vita" (seleggo.org,
  stesso giorno). Il volume 1 ha misure, materia, cellule, mondo dei viventi, piante, invertebrati,
  vertebrati (con "Il comportamento dei vertebrati" come paragrafo) e un'unità sul sistema Terra
  (atmosfera, clima, mari, acque continentali, suolo). La seconda edizione è divisa per temi e non per
  anni: A1-A8 vanno da misure e materia a forze, equilibrio, chimica, energia, onde e suoni; B1-B9 da
  cellule e classificazione a ecosistemi, biomi, evoluzione e storia della vita. Dei volumi A e B ho
  letto i titoli dei capitoli e, per il B, i paragrafi; i volumi C (corpo umano) e D (Terra) non li
  ho letti. Da verificare: come la seconda edizione, già adeguata alle Nuove Indicazioni, divide i
  capitoli tra i tre anni, e dove mette elettricità, magnetismo e luce (non sono nei capitoli A1-A8).
- Non letti: Pearson, De Agostini, Loescher, Sanoma, Lattes, Atlas. Non ho trovato dati sulle
  adozioni: che questi siano i libri "più diffusi" è da verificare.

## Proposta

Capitoli nell'ordine in cui si studiano, divisi per anno; l'elenco delle lezioni è in `albero.md`.
Una lezione tratta un argomento e si legge in 10-15 minuti, per un ragazzo di 11-13 anni. Tra
parentesi il numero di lezioni e i capitoli dei libri da cui viene il capitolo: L = Scienze Live
(unità), I = Intorno a te, Z = Osservare e capire edizione verde vol. 1, Z25 = seconda edizione 2025,
N = Scienze Network 2, M = Mosaico scienze 3.

### Primo anno (11 capitoli, 58 lezioni)

1. Il metodo scientifico e le misure (4; L1 U1, I1 A1, Z A1, Z25 A1). Il metodo, le grandezze e le
   unità con multipli e sottomultipli, strumenti ed errori, tabelle e grafici.
2. La materia e le sue proprietà (5; L1 U2, I1 A2, Z A2, Z25 A2). Massa, volume e densità stanno
   qui come in tutti e tre i libri; la forza peso aspetta il secondo anno.
3. Temperatura e calore (5; L1 U3, I1 A3). Calore ed equilibrio termico separati dalla temperatura,
   come chiedono le Nuove Indicazioni.
4. L'acqua e l'idrosfera (5; L1 U4, I1 B1, Z D4-D5).
5. L'atmosfera, il tempo e il clima (7; L1 U5, I1 B2, Z D2-D3). Chiude con l'effetto serra.
6. Il suolo (2; L1 U6, I1 B3, Z D6). Con il dissesto idrogeologico, che le Indicazioni del 2012
   chiedono tra i rischi della propria regione.
7. I viventi e la cellula (5; L1 U7, I1 C1, Z B1). Respirazione cellulare e divisione cellulare
   sono qui, come nel libro Zanichelli; la fotosintesi va con le piante.
8. La classificazione dei viventi (6; L1 U8-U9, I1 C2-C3, Z B2). Specie e nome scientifico, domini e
   regni, poi batteri, protisti, funghi e virus.
9. Le piante (6; L1 U10, I1 C4, Z B3).
10. Gli animali invertebrati (6; L1 U11-U12, I1 C5, Z B4). La prima lezione sono le caratteristiche
    comuni degli animali (L1 U11).
11. Gli animali vertebrati (7; L1 U13, I1 C6, Z B5). L'ultima lezione è il comportamento animale.

### Secondo anno (13 capitoli, 63 lezioni)

1. L'atomo, gli elementi e i legami (5; L2 U1, N U1, I2 A4).
2. Sostanze, miscugli e soluzioni (3; I2 A4, Z25 A5). Solubilità e separazione dei miscugli, come
   chiedono le Nuove Indicazioni. In Scienze Live non ho trovato i miscugli nell'indice: da
   verificare se stanno nel primo volume.
3. Le reazioni chimiche (6; L2 U1, N U1, I2 A4-A5, Z25 A6). Trasformazioni fisiche e chimiche,
   equazioni, conservazione della massa, poi ossidi, acidi, basi, pH e sali.
4. La chimica del carbonio (3; L2 U2, N U2, I2 A5). Idrocarburi e biomolecole.
5. Il moto (4; L2 U3, N U3, I2 A6, Z25 A3).
6. Le forze e i principi della dinamica (5; L2 U4, N U4, I2 A6, Z25 A3).
7. Equilibrio, leve e pressione (6; L2 U4, N U4, I2 A7, Z25 A4). Baricentro, leve e piano
   inclinato, pressione, Stevino e vasi comunicanti, Pascal, Archimede.
8. Minerali e rocce (5; L2 U5, N U5, I2 B4).
9. Gli ecosistemi (6; L2 U7, N U7, I2 C7, Z25 B6-B7). Con il ciclo del carbonio e la biodiversità.
10. Organizzazione del corpo e locomozione (6; L2 U8, N U8-U9, I2 D1-D2).
11. Alimentazione e digestione (4; L2 U10, N U11, I2 D3).
12. Respirazione ed escrezione (4; L2 U11, N U12-U13, I2 D4-D5).
13. Circolazione e difese immunitarie (6; L2 U9, N U10, I2 D5-D6). Sangue, cuore, vasi, sistema
    linfatico, sistema immunitario, vaccini.

L'ordine dei capitoli segue Scienze Live e Intorno a te: chimica, poi moto e forze, poi rocce ed
ecologia, poi corpo umano. Tra i libri cambia l'ordine degli apparati; qui segue Intorno a te
(digestione, respirazione, circolazione), con la circolazione in fondo perché lega gli altri.

### Terzo anno (15 capitoli, 66 lezioni)

1. Il lavoro, l'energia e le sue fonti (7; L3 U1, I3 A8, M 1, Z25 A7). Lavoro e potenza, forme di
   energia, energia cinetica e potenziale, conservazione e rendimento, fonti fossili, rinnovabili,
   nucleare.
2. Onde e suono (4; L3 U2, I3 A9, M 4, Z25 A8). La prima lezione sono le oscillazioni di pendolo e
   molla, dalle Nuove Indicazioni.
3. Elettricità e magnetismo (7; L3 U3, I3 A10, M 2-3).
4. La luce (5; L3 U4, I3 A11, M 5). L'ultima lezione, la luce come onda con diffrazione e
   interferenza, viene dalle Nuove Indicazioni; nei libri del 2019 c'è solo "La natura della luce"
   (L3 U4).
5. Vulcani e terremoti (4; L3 U5, I3 B5, M 10-11). Apre con la struttura interna della Terra, come
   Intorno a te.
6. La tettonica delle placche (3; L3 U6, I3 B6, M 12).
7. La Terra e la Luna (4; L3 U7, I3 B7, M 8-9).
8. Il Sistema solare e l'Universo (6; L3 U8, I3 B8, M 6-7). Apre con il passaggio dal modello
   geocentrico a quello eliocentrico e chiude con l'origine e l'evoluzione dell'Universo.
9. L'evoluzione dei viventi (3; L3 U10, I3 C9, M 18).
10. La storia della vita sulla Terra (3; L3 U9, I3 C10, M 13 e 19). Fossili ed ere geologiche,
    origine della vita, evoluzione umana.
11. Sistema nervoso e sistema endocrino (5; L3 U11, I3 D7, M 14). Con le dipendenze.
12. Gli organi di senso (4; L3 U12, I3 D8, M 15).
13. La riproduzione umana (5; L3 U13, I3 D9, M 16). Con le infezioni sessualmente trasmissibili,
    che le Nuove Indicazioni nominano.
14. La genetica (3; L3 U15, I3 D10, M 17).
15. Il DNA e le biotecnologie (3; L3 U14, I3 D11, M 17).

L'ordine segue Intorno a te: fisica, Terra, astronomia, evoluzione, corpo umano, genetica. Scienze
Live mette la storia della vita prima dell'evoluzione e la biologia molecolare prima di Mendel.

## Numeri

- 39 capitoli e 187 lezioni: primo anno 11 capitoli e 58 lezioni, secondo 13 e 63, terzo 15 e 66.
- Per area: biologia (compreso il corpo umano) 17 capitoli e 82 lezioni; fisica 9 e 47; scienze
  della Terra e astronomia 8 e 36; chimica 5 e 22. Ho messo in chimica "La materia e le sue
  proprietà" e in fisica il metodo e le misure; idrosfera, atmosfera e suolo sono in scienze della
  Terra.
- Anno per area: primo anno 30 lezioni di biologia, 14 di Terra, 9 di fisica, 5 di chimica; secondo
  26 di biologia, 17 di chimica, 15 di fisica, 5 di Terra; terzo 26 di biologia, 23 di fisica, 17 di
  Terra.
- Tutte le lezioni sono nuove e da scrivere; nessuna esiste nel database.
- La stima di partenza era 130-170 lezioni; l'albero ne ha 187. Il terzo volume di Intorno a te ha 15
  capitoli e circa 80 paragrafi, e le 66 lezioni del terzo anno ne coprono gli stessi argomenti con
  meno divisioni. Per scendere a 170 si possono togliere o fondere: il comportamento animale, la
  chimica del carbonio (3), le coordinate geografiche (le fa anche geografia), la lezione sulle
  oscillazioni, "La luce come onda", l'origine della vita, le lezioni di salute (fumo, dieta, rischio
  sismico) fuse nelle lezioni sugli apparati e sui fenomeni.

## Scelte fatte

- Anni dai libri: le Indicazioni non dividono per anno. Scienze Live e Intorno a te coincidono quasi
  in tutto; dove si scostano ho seguito Intorno a te, che è del 2024.
- Argomenti delle Nuove Indicazioni aggiunti anche se i libri del 2019 non li hanno come lezione:
  oscillazioni, luce come onda, energia nucleare, modello geocentrico ed eliocentrico, evoluzione
  dell'Universo, ciclo del carbonio, infezioni sessualmente trasmissibili.
- Non aggiunti come lezione: la polarizzazione della luce, l'analisi dimensionale e gli ordini di
  grandezza (possono stare dentro "Grandezze fisiche e unità di misura"), la video-analisi e i
  sensori digitali (sono modi di fare laboratorio, non argomenti), le interconnessioni con arte e
  società.
- Il microscopio non ha una lezione sua: sta dentro "La cellula, unità della vita".
- La chimica del carbonio è tenuta corta (3 lezioni): non è negli obiettivi delle Indicazioni, né
  2012 né 2025, ma è in tutti e tre i libri del secondo anno.
- La fotosintesi sta nelle piante, la respirazione cellulare nella cellula; il ciclo del carbonio
  le riprende negli ecosistemi.
- Titoli in forma di frase nominale; slug tutti nuovi con prefisso `sci-`.

## Punti su cui decidere

1. La beta è di sola matematica: quando si scrivono le scienze delle medie, e da quale anno? Il
   primo anno è quello che dal 2026/27 segue già le Nuove Indicazioni.
2. Nuove Indicazioni o 2012? Chi è in seconda e terza media nel 2026/27 segue ancora i programmi
   del 2012 (da verificare il calendario). L'albero li copre entrambi; le lezioni nuove (oscillazioni,
   luce come onda, nucleare) si possono segnare come facoltative.
3. 187 lezioni contro una stima di 130-170: si accettano o si taglia (vedi "Numeri")?
4. Comportamento animale: una lezione al primo anno (come Zanichelli) o un capitolo al secondo
   (come Garzanti e Mondadori, 3-4 lezioni)? È nei libri ma non nelle Indicazioni.
5. Il suolo ha solo 2 lezioni: capitolo a sé, come nei libri, o dentro "L'atmosfera, il tempo e il
   clima"?
6. Riproduzione, pubertà e sessualità: il testo delle lezioni va scritto con cura per le famiglie.
   Serve una revisione di Andrea o di un docente prima di pubblicarle?
7. Rapporto con la chimica del liceo: gli argomenti di base (atomo, tavola periodica, reazioni)
   ritornano al primo anno del liceo. Si collegano le lezioni, per esempio con il grafo dei
   prerequisiti, o restano separate?
8. Energia e fonti rinnovabili sono anche nel programma di Tecnologia delle medie: si scrivono solo
   qui?
9. Da controllare su altri libri (Pearson, De Agostini, Loescher, Sanoma) e sulle nuove edizioni
   2026 adeguate alle Nuove Indicazioni, se l'anno dei capitoli cambia.

## Fuori dall'albero

- `tree.mts` accetta già `--level` e `--title` e crea la materia se non c'è; le righe `# Primo
  anno`, `# Secondo anno`, `# Terzo anno` sono lette. Non l'ho lanciato, neanche senza `--apply`.
- `src/lib/content/subject-copy.ts` non ha una voce `middle_school/science`: il testo della pagina
  della materia va scritto dopo l'applicazione.
