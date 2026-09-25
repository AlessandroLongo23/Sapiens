---
aggiornato: 2026-09-25
tag: [indice]
---
# Sapiens

Questo vault è la memoria del progetto: cosa è Sapiens, per chi, cosa si costruisce e in che ordine, e perché. Ogni argomento ha la sua nota; le note si collegano tra loro. Quando nasce un'idea va in [[#Idee]], quando si prende una decisione va in [[#Decisioni]] e aggiorna le note che tocca.

## Dove siamo (24 settembre 2026)
Sapiens è online come biblioteca di lezioni con Zaino, esercizi generati, Sapiens AI e un marketplace di tutor, ma ha poco contenuto (26 lezioni complete su 183) e nessun utente reale. Il prossimo traguardo è la [[Release Beta]] a pagamento di gennaio 2027, con la sola matematica delle superiori.

Il 23 settembre 2026 sono stati decisi piani e prezzi della beta (Free e Studio, prova al contrario), il provider AI (OpenAI con dati nell'UE) e i progressi per tentativo. È emerso che 6 generatori di esercizi su 15 erano rotti in produzione. Il primo generatore della nuova [[Pipeline esercizi]], le equazioni di secondo grado, è verificato su 6.000 esercizi e collegato al sito; aspetta la revisione di Andrea. Ne restano rotti 5. Le 18 lezioni di teoria sono state riscritte e sono online al posto degli originali, che avevano errori e in tre casi erano troncati. Le figure delle lezioni sono diventate file SVG indicizzabili. Dal 24 settembre si lavora a lotti completi (teoria, esercizi, formulario, flashcard), partendo dal programma e dalle 18 lezioni esistenti; i contenuti li produce Claude e li rilegge Andrea (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]). Il 24 settembre le 18 lezioni hanno anche esercizi dai generatori nuovi, un formulario e un mazzo di [[Flashcard]] (346 carte), e gli errori frequenti stanno accanto alle regole; il 24 settembre è fatto anche il secondo lotto (8 lezioni sui numeri), 26 lezioni complete in tutto. Dettagli in [[2026-09-24 Deploy e secondo lotto]]. Dettagli in [[2026-09-24 Figure e organizzazione dei lotti]]. La sera del 24 settembre master è in produzione (il sito Next.js ha sostituito quello SvelteKit) e il pagamento funziona, in modalità test, sul sandbox "Sapiens sandbox" di Stripe (vedi [[2026-09-24 Pagamento in produzione]]). Andrea ha accettato di rileggere i contenuti, e sono decisi i tentativi degli esercizi: ogni tentativo salva l'esercizio intero, corretto sul server, e il livello lo sceglie la pagina. Dettagli in [[2026-09-24 Tentativi degli esercizi]].

Il 25 settembre gli esercizi sono diventati un percorso di livelli per lezione: lo studente sceglie il livello prima della prova, supera un livello con 8 risposte giuste su 10 e può saltare avanti con una prova di salto. Nel codice, non ancora pubblicato. Vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]].

Il 26 settembre ogni pagina indice del materiale (la biblioteca, i livelli, le materie, i capitoli) ha una copertina a quadretti dove lo studente attacca adesivi, salvati per pagina; è deciso anche il sistema degli adesivi: li fa Sapiens in SVG, a pacchetti per capitolo, materia, studio e stagione, tutti liberi nella beta. Nel codice, non ancora pubblicato. Vedi [[2026-09-26 Sistema degli adesivi]].

## Mappa
- **Visione:** [[Visione]], [[Problema]], [[Principi]], [[Concorrenti]]
- **Attori:** [[Studente]], [[Genitore]], [[Tutor]], [[Docente]], [[Dirigente]], [[DSGA e personale ATA]]
- **Prodotti per gli studenti:** [[Lezioni]], [[Esercizi]], [[Pratica quotidiana]], [[Zaino]], [[Diario e calendario]], [[Sapiens AI]], [[Strumenti DSA]], [[Flashcard]], [[Adesivi]]
- **Prodotti per i tutor:** [[Marketplace]], [[Pay-per-lead]], [[Agenda tutor]]
- **Prodotti per le famiglie:** [[Area genitori]]
- **Prodotti per le scuole:** [[Registro elettronico]], [[Verifiche]], [[Orario e aule]], [[Turni ATA]]
- **Contenuti:** [[Pipeline lezioni]], [[Pipeline esercizi]], [[Programma ministeriale]], [[Standard di qualità]]
- **Business:** [[Piani e prezzi]], [[Margini per cliente]], [[Vendita alle scuole]]
- **Marketing:** [[SEO]], [[Social]], [[Stagionalità]]
- **Legale:** [[GDPR e minori]], [[Contratti con le scuole]], [[AI Act]], [[Società e IVA]], [[Tutela del consumatore]], [[Accordi del team]]
- **Tecnica:** [[Architettura]], [[Schema dati]], [[Provider AI]], [[App mobile]]
- **Piano:** [[Agenda]], [[Roadmap]], [[Metriche]], [[Progressi dello studente]]
- **Team:** [[Persone e ruoli]]

## Da discutere
La coda degli argomenti, in ordine di priorità, è in [[Agenda]]. Le sessioni di lavoro sono registrate in `Sessioni/`, l'ultima è [[2026-09-26 Sistema degli adesivi]]. Per ripartire: `/sparring`.

## Decisioni
Una nota per decisione in `Decisioni/`, con la data nel nome. Le più recenti in cima:
- [[2026-09-26 Pacchetti di adesivi per capitolo, materia, studio e stagione]]
- [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]]
- [[2026-09-26 Gli adesivi li crea Sapiens, gli studenti poi solo da modelli]]
- [[2026-09-25 Una prova supera un livello solo con almeno 5 domande]]
- [[2026-09-25 Oggi è lo schermo iniziale dell'app]]
- [[2026-09-25 Rifare gli errori vuol dire esercizi nuovi sugli stessi livelli]]
- [[2026-09-25 La pratica quotidiana entra nella beta]]
- [[2026-09-25 Gli esercizi sono un percorso di livelli]]
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
Idee non ancora valutate, in `Idee/`: [[Mascotte per materia]], [[Foto e soluzione]], [[Video brevi]], [[Video di spiegazione e di esercizi svolti]], [[Ripasso pianificato prima di una verifica]], [[AI sugli appunti]], [[Dettatura e scrittura a mano]], [[Registrazione e riassunto delle lezioni in classe]].

## Decisioni aperte più importanti
Ognuna ha il dettaglio nella nota collegata.
- Prezzo del lead per i tutor: €5 (analisi del 6 settembre) o €10-15 (idea del 23 settembre). Vedi [[Pay-per-lead]].
- Date di v2, v3 e v4. Vedi [[Roadmap]].
- Dove vivono i dati degli studenti e quale provider AI usare, per poter vendere alle scuole. Vedi [[Provider AI]] e [[GDPR e minori]].
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
