---
aggiornato: 2026-10-03
tag: [indice]
---
# Sapiens

Questo vault è la memoria del progetto: cosa è Sapiens, per chi, cosa si costruisce e in che ordine, e perché. Ogni argomento ha la sua nota; le note si collegano tra loro. Quando nasce un'idea va in [[#Idee]], quando si prende una decisione va in [[#Decisioni]] e aggiorna le note che tocca.

## Dove siamo (29 settembre 2026)
Sapiens è online come biblioteca di lezioni con Zaino, esercizi generati, Sapiens AI e un marketplace di tutor. Ha il biennio di matematica completo (104 lezioni su 183) e nessun utente reale. Il prossimo traguardo è la [[Release Beta]] a pagamento di gennaio 2027, con la sola matematica delle superiori.

Il 23 settembre 2026 sono stati decisi piani e prezzi della beta (Free e Studio, prova al contrario), il provider AI (OpenAI con dati nell'UE) e i progressi per tentativo. È emerso che 6 generatori di esercizi su 15 erano rotti in produzione. Il primo generatore della nuova [[Pipeline esercizi]], le equazioni di secondo grado, è verificato su 6.000 esercizi e collegato al sito; aspetta la revisione di Andrea. Ne restano rotti 5. Le 18 lezioni di teoria sono state riscritte e sono online al posto degli originali, che avevano errori e in tre casi erano troncati. Le figure delle lezioni sono diventate file SVG indicizzabili. Dal 24 settembre si lavora a lotti completi (teoria, esercizi, formulario, flashcard), partendo dal programma e dalle 18 lezioni esistenti; i contenuti li produce Claude e li rilegge Andrea (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]). Il 24 settembre le 18 lezioni hanno anche esercizi dai generatori nuovi, un formulario e un mazzo di [[Flashcard]] (346 carte), e gli errori frequenti stanno accanto alle regole; il 24 settembre è fatto anche il secondo lotto (8 lezioni sui numeri), 26 lezioni complete in tutto. Dettagli in [[2026-09-24 Deploy e secondo lotto]]. Dettagli in [[2026-09-24 Figure e organizzazione dei lotti]]. La sera del 24 settembre master è in produzione (il sito Next.js ha sostituito quello SvelteKit) e il pagamento funziona, in modalità test, sul sandbox "Sapiens sandbox" di Stripe (vedi [[2026-09-24 Pagamento in produzione]]). Andrea ha accettato di rileggere i contenuti, e sono decisi i tentativi degli esercizi: ogni tentativo salva l'esercizio intero, corretto sul server, e il livello lo sceglie la pagina. Dettagli in [[2026-09-24 Tentativi degli esercizi]].

Il 25 settembre gli esercizi sono diventati un percorso di livelli per lezione: lo studente sceglie il livello prima della prova, supera un livello con 8 risposte giuste su 10 e può saltare avanti con una prova di salto. Nel codice, non ancora pubblicato. Vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]]. Lo stesso giorno si è deciso che ogni lezione dichiara i suoi prerequisiti: il grafo che ne esce serve a suggerire un ripasso dopo una prova andata male, e dopo la beta diventerà una torre di blocchi (vedi [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]]).

Il 26 settembre ogni pagina indice del materiale (la biblioteca, i livelli, le materie, i capitoli) ha una copertina a quadretti dove lo studente attacca adesivi, salvati per pagina; è deciso anche il sistema degli adesivi: li fa Sapiens in SVG, a pacchetti per capitolo, materia, studio e stagione, tutti liberi nella beta. Nel codice, non ancora pubblicato. Vedi [[2026-09-26 Sistema degli adesivi]]. Lo stesso giorno fisica e informatica delle superiori e le medie (matematica, Scienze e Tecnologia) hanno avuto l'albero per anno dal programma ministeriale: 856 lezioni ancora vuote. Vedi [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]]. Sempre il 26 settembre è fatto il terzo lotto, monomi, polinomi e scomposizione: 12 lezioni con esercizi, formulario e flashcard, 38 lezioni complete in tutto. Vedi [[2026-09-26 Terzo lotto, monomi polinomi e scomposizione]]. Lo stesso giorno il quarto lotto, 13 lezioni su prodotto cartesiano, relazioni e funzioni, frazioni algebriche ed equazioni: 51 lezioni complete. Vedi [[2026-09-26 Quarto lotto, relazioni funzioni e frazioni algebriche]]. Poi il quinto lotto, 11 lezioni su disequazioni, statistica e geometria del piano, e il sesto, le 5 lezioni che mancavano di insiemi e logica: il primo anno di matematica è completo, 67 lezioni con esercizi, formulario e flashcard. Vedi [[2026-09-26 Quinto lotto, disequazioni statistica e geometria]] e [[2026-09-26 Sesto lotto, intersezione differenza e logica]]. Il 27 settembre il settimo lotto apre il secondo anno: sistemi lineari, radicali ed equazioni di secondo grado, 12 lezioni, 79 complete in tutto. Vedi [[2026-09-27 Settimo lotto, sistemi radicali e secondo grado]]. Lo stesso giorno l'ottavo lotto, piano cartesiano, retta e parabola, 10 lezioni: 89 complete. Vedi [[2026-09-27 Ottavo lotto, piano cartesiano retta e parabola]]. Il 28 settembre il nono lotto, equazioni e disequazioni di grado superiore e probabilità, 6 lezioni: 95 complete. Vedi [[2026-09-28 Nono lotto, grado superiore e probabilità]]. Lo stesso giorno il decimo lotto, la geometria del secondo anno, 9 lezioni: 104 complete, e il biennio di matematica è finito. Vedi [[2026-09-28 Decimo lotto, geometria del secondo anno]]. Lo schermo "Oggi" è diventato il Diario: pagina del giorno con le voci della scuola scritte in una riga, i consigli di Sapiens come post-it, il ripasso prima delle verifiche, il registro dei giorni passati e una pagina personale con gli adesivi. Nel codice, non ancora pubblicato. Vedi [[2026-09-26 Diario]]. Sempre il 26 settembre una verifica SEO ha trovato il sito non indicizzato e circa 250 pagine vuote nella sitemap: ora sono fuori dalla ricerca (restano sul sito), e ogni pagina esercizi ha una scheda gratuita e indicizzata da fare sul quaderno. Resta da scegliere il dominio. Nel codice, non ancora pubblicato. Vedi [[2026-09-26 SEO e scheda degli esercizi]]. Il 28 settembre si è deciso che il marketing parte a ottobre, con Lorena: video brevi su TikTok e Instagram, un test con i singoli docenti, un piano per ogni fascia di budget (ancora da scegliere). Vedi [[Piano di acquisizione]] e [[2026-09-28 Marketing e acquisizione clienti]]. Lo stesso giorno sono scritti gli inviti: il link di uno studente o il codice di un creator danno 14 giorni di prova; l'amico che finisce la prima prova fa guadagnare 30 giorni di Studio a chi l'ha invitato, fino a 3 l'anno. Dopo una ricerca sulle regole danesi e italiane, lo stesso giorno: un codice proprio solo per chi ha almeno 18 anni, i creator pagati a contenuto e non a provvigione (rischio Enasarco), il codice salvato solo dopo "Usa l'invito". Migrazione applicata, codice non ancora pubblicato. Vedi [[Inviti e codici]]. Sempre il 28 settembre è ripartita la ricerca del nome: il candidato è Articolo34, dall'articolo 34 della Costituzione, da confermare con una prova a voce con studenti e genitori contro Sapiens e Volevasi. Vedi [[2026-09-28 Il nome e il dominio]]. Sempre il 28 settembre le lezioni hanno avuto le prime figure interattive: 45 in 38 lezioni, nello stile delle figure TikZ, con pezzi da trascinare, cursori e costruzioni animate. Nel codice, non ancora pubblicate. Vedi [[2026-09-28 Figure interattive nelle lezioni]]. Il 29 settembre il legale e fiscale è passato in testa all'Agenda, perché il marketing di ottobre paga creator e raccoglie email prima degli incassi: nessun pagamento per il marketing prima della registrazione moms, e le domande fiscali vanno alle consulenze gratuite di IDA, di cui Alessandro è socio. Vedi [[2026-09-29 Legale e fiscale prima del marketing]] e [[Consulenze IDA]].

Il 29 settembre, prima del primo lotto di fisica, si è deciso come si disegna la fisica: figure statiche in TikZ, che ha già circuiti, grafici e molle; figure interattive con il kit delle lezioni, allargato con un modulo di fisica e senza motore fisico; negli esercizi una scena descritta nei dati e disegnata dal kit; grafici statici in TikZ, come quelli di matematica, finché non c'è il piano cartesiano del kit. La fisica si pubblica gratis lotto per lotto, come la chimica. Lo stesso giorno il primo lotto di fisica: le 19 lezioni dei primi tre capitoli del primo anno (grandezze e misura, grafici, vettori e forze), con 17 figure interattive, le prime scene negli esercizi e 19 generatori; tutto in produzione dal 29 settembre. Vedi [[2026-09-29 Primo lotto di fisica]]. Il 30 settembre il secondo lotto chiude il primo anno di fisica: 18 lezioni su equilibrio dei solidi e dei fluidi e ottica geometrica, con 20 figure interattive e 18 generatori; 37 lezioni di fisica complete, tutto in produzione dal 30 settembre (PR #15). Lo stesso giorno il terzo lotto, tutto il secondo anno (lezioni 38-70: cinematica, moti nel piano, dinamica, forze e movimento, lavoro ed energia, temperatura e calore), con 34 figure interattive e 33 generatori: 70 lezioni di fisica, tutto in produzione dal 30 settembre (PR #16). Poi il biennio di chimica: 38 lezioni nuove (misure, materia, trasformazioni, gas, mole, atomo, acqua), 39 con quella sulla mole, tutto in produzione dal 30 settembre (PR #17). Vedi [[2026-09-30 Biennio di chimica]]. Vedi [[2026-09-30 Terzo lotto di fisica]]. Vedi [[2026-09-30 Secondo lotto di fisica]]. Vedi [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]] e [[2026-09-29 La fisica si pubblica gratis accanto alla beta]].

Sempre il 29 settembre è nata l'idea dei [[Laboratori]]: ambienti 3D da esplorare in prima persona, come in un videogioco, per chimica e poi per le altre aree. Il prototipo `/laboratorio` (i cristalli di solfato di rame, modellato in Blender e animato con three.js) è nel codice locale. Si parte subito, in parallelo ai lotti, da computer, con un motore modulare per la chimica su un catalogo di sostanze ricavato dal programma; il primo traguardo è il motore in un laboratorio libero insieme a una stanza condivisa fino a 32 persone, docente compreso, senza chat ([[Laboratorio condiviso]]), su Cloudflare Durable Objects perché Supabase Realtime non regge i messaggi di una stanza; il prototipo, che ha ora un corpo con due mani che prendono, mescolano e versano, va online fuori dall'indice e senza link. Il 30 settembre si è deciso lo stile: un videogioco in prima persona, pittorico e morbido, senza interfaccia da pagina web e con asset gratuiti a licenza libera; la prova è la fetta verticale `/laboratorio/banco`. Vedi [[2026-09-29 Laboratori]] e [[2026-09-30 Laboratori, la fetta verticale]]. Lo stesso giorno gli avatar (un kit di forme semplici, opachi nel laboratorio e adesivi nel sito) e un'aula intera, `/laboratorio/aula`, con dodici postazioni, i compagni e il docente; nell'aula l'unità è la postazione, per gruppi da 1 a 3, e la misura dell'aula si sceglie all'avvio dai presenti. Vedi [[2026-09-30 Aula e avatar del laboratorio]].

Sempre il 30 settembre si è deciso come arriva la risposta aperta negli esercizi, che la beta promette e oggi manca: ogni livello è una tappa con più tipi di esercizio, 4 ripetizioni da 8 domande con la risposta aperta che cresce (8/0, 6/2, 4/4, 2/6) portano a superato; si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo; la forma conta solo dove è l'esercizio, e ogni livello dichiara cosa si valuta. Con la risposta aperta arriva la memoria degli esercizi: FSRS per livello, con la risposta aperta che pesa più della multipla, ripassi aperti nella pratica quotidiana fino a padroneggiato, quando la memoria regge per settimane, superato che non si perde mai, e il ripasso implicito lungo il grafo dei prerequisiti, tutto nella beta. Correttore, ripetizioni a rampa e campo MathLive sono in produzione dal 30 settembre (PR #18, #19 e #20); la memoria FSRS non c'è ancora. Vedi [[2026-09-30 Risposta aperta e memoria degli esercizi]].

Sempre il 30 settembre si è deciso che le lezioni avranno clip animate con voce, da 1 a 3 minuti per sezione, fatte con un manim a quadretti e dalla stessa pipeline dei video social; si parte da una lezione pilota, che dà anche i primi video di ottobre. Dove stanno le clip (YouTube, player di Sapiens o tutti e due) è da decidere. Vedi [[2026-09-30 Clip animate delle lezioni]].

Il 1° ottobre si è decisa e scritta la tavola periodica: tra gli strumenti, a `/strumenti/tavola-periodica`, con una pagina sua; senza pagine per elemento per ora; ampia come Ptable (famiglie, stato fisico a una temperatura, andamenti periodici, blocchi, isotopi) e con due PDF da stampare; disegnata prima da computer, con la griglia che scorre sul telefono. In produzione dal 1° ottobre (PR #24). Vedi [[2026-10-01 Tavola periodica]] e [[Tavola periodica interattiva]]. Lo stesso giorno la scheda degli elementi ha avuto le foto (96 su 118, da Wikimedia Commons), e si è deciso che gli orbitali avranno una lezione dedicata e un visualizzatore in tre dimensioni: il visualizzatore è uno strumento, a `/strumenti/orbitali-atomici`, con la tabella dei sottolivelli che mostra anche la configurazione elettronica di ogni elemento, e la lezione "Orbitali e numeri quantici", la prima del terzo anno di chimica, è pubblicata con otto figure agganciate ai paragrafi, formulario, flashcard ed esercizi. Tutto in produzione dal 1° ottobre. Vedi [[Orbitali atomici interattivi]]. Sempre il 1° ottobre si è deciso il grafico di funzioni: il plotter è il piano cartesiano di tutto il sito, disegnato da noi in SVG sul kit e senza librerie di grafici (Desmos e GeoGebra chiedono una licenza per l'uso commerciale); trova i punti notevoli, senza lo studio di funzione; accetta funzioni, equazioni implicite, disequazioni e curve parametriche, a passi; si progetta per telefono e computer insieme. Dal 3 ottobre è in produzione a `/strumenti/grafico-di-funzione` (PR #27), con la geometria analitica, i comandi scritti, i grafici salvati e il blocco grafico nelle note. Lo strumento ha dal 2 ottobre il primo lotto di impostazioni (aspetto delle curve, cursori animati, impostazioni del piano, annulla, link, immagine, esempi, schermo intero) e disegna anche equazioni implicite, curve parametriche e polari, con la griglia polare. Vedi [[Grafico di funzioni]] e [[2026-10-01 Grafico di funzioni]].

Il 3 ottobre è arrivato l'editor di codice per informatica: Python, C e C++ eseguiti nel browser, senza server (C e C++ con Clang in WebAssembly, vedi [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]; Java resta da decidere). È in produzione tra gli strumenti, a `/strumenti/editor-di-codice` (PR #30), e nelle lezioni un blocco `codice` lo monta con una linguetta per linguaggio e la verifica degli esercizi su ingresso e uscita. Vedi [[Editor di codice]] e [[2026-10-03 Editor di codice]]. Lo stesso giorno è scritto e pubblicato il primo lotto di informatica, il primo anno: 32 lezioni senza programmazione, con formulari, flashcard e 32 generatori di esercizi (175 livelli), gratis come fisica e chimica (vedi [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]). Vedi [[2026-10-03 Primo lotto di informatica]].

## Mappa
- **Visione:** [[Visione]], [[Problema]], [[Principi]], [[Concorrenti]]
- **Attori:** [[Studente]], [[Genitore]], [[Tutor]], [[Docente]], [[Dirigente]], [[DSGA e personale ATA]]
- **Prodotti per gli studenti:** [[Lezioni]], [[Esercizi]], [[Pratica quotidiana]], [[Zaino]], [[Diario e calendario]], [[Account e impostazioni]], [[Inviti e codici]], [[Sapiens AI]], [[Strumenti DSA]], [[Flashcard]], [[Adesivi]], [[Ricerca]], [[Laboratori]], [[Calcolatori e convertitori]], [[Tavola periodica interattiva]], [[Orbitali atomici interattivi]], [[Grafico di funzioni]], [[Editor di codice]]
- **Prodotti per i tutor:** [[Marketplace]], [[Pay-per-lead]], [[Agenda tutor]]
- **Prodotti per le famiglie:** [[Area genitori]]
- **Prodotti per le scuole:** [[Registro elettronico]], [[Verifiche]], [[Orario e aule]], [[Turni ATA]]
- **Contenuti:** [[Pipeline lezioni]], [[Pipeline esercizi]], [[Programma ministeriale]], [[Standard di qualità]], [[Domande per Andrea]]
- **Business:** [[Piani e prezzi]], [[Margini per cliente]], [[Vendita alle scuole]]
- **Marketing:** [[Piano di acquisizione]], [[Creator]], [[SEO]], [[Social]], [[Stagionalità]]
- **Legale:** [[GDPR e minori]], [[Consulenze IDA]], [[Contratti con le scuole]], [[AI Act]], [[Società e IVA]], [[Tutela del consumatore]], [[Accordi del team]]
- **Tecnica:** [[Architettura]], [[Schema dati]], [[Provider AI]], [[App mobile]]
- **Piano:** [[Agenda]], [[Roadmap]], [[Metriche]], [[Progressi dello studente]]
- **Team:** [[Persone e ruoli]]

## Da discutere
La coda degli argomenti, in ordine di priorità, è in [[Agenda]]. Le sessioni di lavoro sono registrate in `Sessioni/`, l'ultima è [[2026-10-03 Primo lotto di informatica]]. Per ripartire: `/sparring`.

## Decisioni
Una nota per decisione in `Decisioni/`, con la data nel nome. Le più recenti in cima:
- [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]
- [[2026-10-03 L'editor di codice ha Python, C e C++, tutti eseguiti nel browser]]
- [[2026-10-03 I grafici del plotter si salvano con nome e si mettono nelle note]]
- [[2026-10-03 Il piano di una lezione dichiara cosa è permesso]]
- [[2026-10-02 Le parole del plotter stanno in un elenco solo, con i nomi italiani]]
- [[2026-10-02 La geometria analitica sta nel plotter e si costruisce prima con i clic]]
- [[2026-10-02 Il plotter ha le curve implicite, parametriche e polari prima di uscire]]
- [[2026-10-01 Il plotter esce a passi e si progetta per telefono e computer insieme]] (superata in parte)
- [[2026-10-01 Nel plotter si scrivono funzioni, equazioni implicite, disequazioni e curve parametriche]]
- [[2026-10-01 Il plotter trova i punti notevoli, senza lo studio di funzione]]
- [[2026-10-01 Il plotter delle funzioni è il primo uso del piano cartesiano del sito]]
- [[2026-10-01 Il piano cartesiano lo disegniamo noi sul kit, senza librerie di grafici]]
- [[2026-10-01 Gli orbitali hanno una lezione dedicata e un visualizzatore in tre dimensioni]]
- [[2026-10-01 Nella scheda degli elementi vanno le foto, i modelli 3D restano per dopo]]
- [[2026-10-01 La tavola periodica si disegna prima da computer, con la scheda accanto alla griglia]]
- [[2026-10-01 La prima tavola periodica è ampia come Ptable e si fa subito]]
- [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]]
- [[2026-10-01 La tavola periodica sta tra gli strumenti, con una pagina sua]]
- [[2026-09-30 Ogni lezione ha una pagina di esercizi svolti, fatta dai suoi generatori]]
- [[2026-09-30 Le clip partono da una lezione pilota, che dà anche i primi video social]]
- [[2026-09-30 Le lezioni hanno clip animate per sezione, fatte con un manim a quadretti]]
- [[2026-09-30 Il ripasso spaziato e quello implicito sui prerequisiti entrano nella beta]]
- [[2026-09-30 Superato non si perde, padroneggiato torna da ripassare come invito]]
- [[2026-09-30 La memoria degli esercizi è per livello, con FSRS, e la risposta aperta pesa di più]]
- [[2026-09-30 Nella risposta aperta la forma conta solo dove è l'esercizio]]
- [[2026-09-30 La risposta aperta si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo]]
- [[2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta]]
- [[2026-09-30 I laboratori devono sembrare un videogioco, in uno stile pittorico e morbido]]
- [[2026-09-30 Il prototipo dei laboratori usa solo asset con licenza libera]]
- [[2026-09-30 Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito]]
- [[2026-09-30 Nel laboratorio condiviso la postazione è l'unità, per gruppi da 1 a 3]]
- [[2026-09-30 L'aula si sceglie all'avvio dai presenti, e si ottimizza per la classe intera]]
- [[2026-09-30 Le funzioni dipendono dal dispositivo, con un passaggio tra telefono e computer]]
- [[2026-09-29 Il laboratorio condiviso usa Cloudflare Durable Objects, non Supabase Realtime]]
- [[2026-09-29 Nel laboratorio condiviso niente chat, solo segnali]]
- [[2026-09-29 Il laboratorio condiviso si costruisce insieme al motore]]
- [[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]]
- [[2026-09-29 Il prototipo del laboratorio va su master, fuori dall'indice e senza link]]
- [[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]]
- [[2026-09-29 Il laboratorio di chimica è un motore modulare su un catalogo ricavato dal programma]]
- [[2026-09-29 I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc]]
- [[2026-09-29 I laboratori 3D partono subito, in parallelo ai lotti]]
- [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]
- [[2026-09-29 La fisica si pubblica gratis accanto alla beta]]
- [[2026-09-29 Niente pagamenti per il marketing prima della registrazione moms]]
- [[2026-09-28 Il nome si sceglie con una prova a voce, Articolo34 contro Sapiens e Volevasi]]
- [[2026-09-28 Le note eliminate restano 30 giorni nel cestino]]
- [[2026-09-28 Il cestino non conta nel limite del piano gratuito]]
- [[2026-09-28 Porta un amico solo per i maggiorenni]]
- [[2026-09-28 I creator si pagano a contenuto, non a provvigione]]
- [[2026-09-28 L'invito si salva solo dopo Usa l'invito]]
- [[2026-09-28 Porta un amico premia l'attivazione con 30 giorni di Studio]] (superata in parte)
- [[2026-09-28 Il codice di un creator dà 14 giorni di prova e al creator il 30 per cento per 3 mesi]] (superata in parte)
- [[2026-09-28 Il marketing parte a ottobre, con Lorena]]
- [[2026-09-28 Video brevi con animazioni per le spiegazioni e un volto per le presentazioni]]
- [[2026-09-28 Un test con i singoli docenti già nella beta]]
- [[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]]
- [[2026-09-27 I contenuti li rileggono Andrea e Alessandro]]
- [[2026-09-27 Gli adesivi si vedono anche nella modalità Avanzata]]
- [[2026-09-27 Una pagina ha la stessa forma per ogni livello di accesso]]
- [[2026-09-27 La scheda degli esercizi è giornaliera]]
- [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]] (superata in parte)
- [[2026-09-26 Navigazione del diario, calendario dentro e niente vista log]]
- [[2026-09-26 Il diario prende il posto di Oggi]]
- [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]] (superata in parte)
- [[2026-09-26 Gli adesivi sono per tutti gli iscritti]]
- [[2026-09-26 Pacchetti di adesivi per capitolo, materia, studio e stagione]]
- [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]]
- [[2026-09-26 Gli adesivi li crea Sapiens, gli studenti poi solo da modelli]]
- [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]]
- [[2026-09-25 I capitoli si mostrano per anno]]
- [[2026-09-25 Una prova supera un livello solo con almeno 5 domande]]
- [[2026-09-25 Oggi è lo schermo iniziale dell'app]] (superata in parte)
- [[2026-09-25 Rifare gli errori vuol dire esercizi nuovi sugli stessi livelli]]
- [[2026-09-25 La pratica quotidiana entra nella beta]]
- [[2026-09-25 Gli esercizi sono un percorso di livelli]] (superata in parte)
- [[2026-09-25 Studio costa 9,99 euro al mese o 49,99 fino a giugno]]
- [[2026-09-24 Il livello degli esercizi lo sceglie la pagina]] (superata)
- [[2026-09-24 Ogni tentativo salva l'esercizio intero]]
- [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]
- [[2026-09-24 Le note sono fogli a larghezza fissa]]
- [[2026-09-24 Adesivi nella beta, a partire dalle note]]
- [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]
- [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
- [[2026-09-24 Errori frequenti accanto alla regola]]
- [[2026-09-24 Si lavora a lotti completi]]
- [[2026-09-24 Lezioni ed esercizi scritti da Claude e rivisti da Alessandro]]
- [[2026-09-23 I nuovi generatori vanno sul sito subito, a scelta multipla]]
- [[2026-09-23 Radici irrazionali nella beta]]
- [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]
- [[2026-09-23 OpenAI con dati nell'UE per la beta]]
- [[2026-09-23 Formulari e calcolatrici gratuiti]]
- [[2026-09-23 Prova al contrario e sessione gratuita giornaliera]]
- [[2026-09-23 Piani che crescono con le funzioni]]
- [[2026-09-23 Progressi salvati per ogni tentativo]]
- [[2026-09-23 Accordi sui diritti rimandati a quando ci saranno ricavi]]
- [[2026-09-23 Niente interviste, il prodotto nasce dall'esperienza diretta]]
- [[2026-09-23 Strumenti DSA aperti a tutti, senza certificazione]]
- [[2026-09-23 Impresa individuale finché i ricavi non giustificano una società]]
- [[2026-09-23 Vendita a scuole statali e paritarie]]
- [[2026-09-23 Le release si lanciano complete]]
- [[2026-09-23 Vincoli dell'algoritmo configurabili dall'interfaccia]]
- [[2026-09-23 Il vault come memoria del progetto]]
- [[2026-09-23 L'AI propone il voto, il docente decide]]
- [[2026-09-23 Pratica con progressi come messaggio principale]]
- [[2026-09-23 Il piano Pro non include ore di ripetizione]]
- [[2026-09-23 Esercizi da generatori scritti dall'AI]]
- [[2026-09-23 La v1.0 è lo STEM del liceo scientifico]]
- [[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]]
- [[2026-09-23 Superiori STEM come segmento iniziale]]
- [[2026-09-23 Ordine dei clienti famiglie, tutor, scuole]]
- [[2026-09-06 I tutor pagano il contatto, non le lezioni]]
- [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]]

## Idee
Idee non ancora valutate, in `Idee/`: [[Passaparola in classe]], [[Pubblicità per chi non paga]], [[Grafici e simulazioni interattive]], [[Mascotte per materia]], [[Foto e soluzione]], [[Video brevi]], [[Video di spiegazione e di esercizi svolti]], [[Ripasso pianificato prima di una verifica]], [[AI sugli appunti]], [[Dettatura e scrittura a mano]], [[Registrazione e riassunto delle lezioni in classe]], [[Mappa dei prerequisiti]], [[Tipi di esercizio sui passaggi]], [[Foto e modelli 3D degli elementi]].

## Decisioni aperte più importanti
Ognuna ha il dettaglio nella nota collegata.
- Prezzo del lead per i tutor: €5 (analisi del 6 settembre) o €10-15 (idea del 23 settembre). Vedi [[Pay-per-lead]].
- Date di v2, v3 e v4. Vedi [[Roadmap]].
- Dove vivono i dati degli studenti e quale provider AI usare, per poter vendere alle scuole. Vedi [[Provider AI]] e [[GDPR e minori]].
- Il nome del progetto: Articolo34, se passa la prova a voce. Vedi [[2026-09-28 Il nome si sceglie con una prova a voce, Articolo34 contro Sapiens e Volevasi]].
- Budget del marketing fino a giugno 2027. Vedi [[Piano di acquisizione]].
- Prezzo e modello di vendita per le scuole. Vedi [[Vendita alle scuole]].
- Cosa vuol dire "completa" per la release delle scuole: tutti i moduli insieme o un modulo alla volta. Vedi [[Release v4 Scuole]].

## Archivio
Documenti precedenti al vault, tenuti come fonte: `Archivio/DESCRIPTION (bozza aereo).md`, [[ROADMAP]] (3 settembre 2026), [[MARKETPLACE]] (ricerca sul mercato delle ripetizioni, 6 settembre 2026), [[TODO]]. I log operativi della SEO restano fuori dal vault, nella root della repo: `SEO-TODO.md` e `SITEMAP.md`.

## Regole del vault
- Una nota, un argomento. Se una nota parla di due cose, si divide.
- In testa a ogni nota: `stato` (idea, bozza, decisa, in sviluppo, rilasciata), `release`, `aggiornato`, `tag`.
- Nelle note di prodotto "Stato attuale" descrive il codice di oggi, "Obiettivo" quello che deve diventare. Non si mescolano.
- Niente testo inventato per riempire: quello che non è stato discusso va in "Domande aperte".
- Le fonti esterne hanno nome e data; i dati non verificati sono segnati "da verificare".
- Ogni sessione di discussione lascia una nota in `Sessioni/` e aggiorna [[Agenda]].
- I template sono in `Template/`.
