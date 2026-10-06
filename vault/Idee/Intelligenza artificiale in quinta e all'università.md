---
stato: idea
aggiornato: 2026-10-05
tag: [idea, contenuti, informatica, intelligenza-artificiale, università]
---
# Intelligenza artificiale in quinta e all'università

## L'idea
Alessandro, 5 ottobre 2026. Ha trovato su internet il corso "AI Engineering from Scratch" di Rohit Ghumare (github.com/rohitg00/ai-engineering-from-scratch) e ha chiesto che cosa copre e con quale qualità. In futuro vuole aggiungere l'intelligenza artificiale agli argomenti di quinta: un'infarinatura della classificazione dei metodi (apprendimento supervisionato, non supervisionato, per rinforzo; reti convoluzionali, ricorrenti, su grafi; i metodi più datati come SVM, clustering e discesa del gradiente), con risorse di approfondimento. In alternativa, o in aggiunta, mettere tutti questi argomenti in un corso universitario, quando Sapiens farà l'università.

Ha chiesto di salvare tutti gli argomenti, di scrivere un programma completo del corso universitario e di filtrarlo per la quinta. I due elenchi sono in [[Programma di intelligenza artificiale]].

### Come lavorarci (Alessandro, 5 ottobre 2026, secondo messaggio)
Il programma universitario deve essere completo e di qualità insieme, senza rinunciare a nessuna delle due, anche se chiede più tempo e più cura: per chi studia informatica oggi questi argomenti servono, e saranno online per tutti. L'ordine del lavoro:
1. Prima la visione d'insieme: tutto l'albero degli argomenti e una classificazione precisa di architetture, modelli e tecniche. La struttura stessa deve aiutare chi studia a orientarsi e a ricordare, in una materia complessa e recente.
2. Poi, lezione per lezione, i riferimenti della letteratura scientifica chiari prima di scrivere: paper e riviste da cui prendere idee, materiale e il modo di spiegare. L'esempio è il paper di AlexNet per le reti convoluzionali. La lezione deve essere precisa e completa ma non lunga né verbosa, e dare gli strumenti per imparare ed esercitarsi.
3. Componenti interattive su misura dentro le lezioni. Esempi: il clustering, che nei paper è una figura ferma, come qualcosa che l'utente controlla; per la quinta, la ricerca con A* su una griglia dove si scelgono inizio, fine e ostacoli e si vede l'algoritmo lavorare; gli algoritmi genetici con un videogioco che impara a giocare da solo. Alessandro ha già programmato un Flappy Bird in cui una popolazione di uccelli, ciascuno con una rete neurale di pochi neuroni, impara a giocare con un algoritmo genetico.

### Proposte di Claude sul metodo (5 ottobre 2026, non discusse)
- La classificazione ha più assi (tipo di apprendimento, compito, famiglia del modello, architettura, tecnica di addestramento) e un solo albero non li regge: un transformer o una GAN stanno in più posti. Proposta: un albero per l'ordine di studio e una mappa a più assi su cui ogni lezione è etichettata.
- Una scheda delle fonti per lezione, scritta prima della lezione: il paper originale, un capitolo di manuale, una rassegna. Ogni riferimento va letto alla fonte prima di entrare in una lezione, non citato a memoria.
- Pochi banchi interattivi riusabili al posto di una figura su misura per lezione: punti nel piano (clustering, vicini più prossimi, percettrone, SVM, regressione, alberi), griglia (ricerca, Dijkstra, A*, Q-learning), albero di gioco (minimax), popolazione che evolve (algoritmi genetici), curva di perdita (discesa del gradiente, sul [[Grafico di funzioni]]), griglia di pixel (convoluzione), rete (propagazione in avanti e all'indietro).
- Una lezione pilota prima del resto, per provare il metodo intero. La ricerca su griglia serve sia alla quinta sia all'università.

### La struttura d'insieme (Alessandro, 5 ottobre 2026, terzo messaggio)
Gli assi vanno bene per classificare una lezione, ma contano meno dell'ordine. L'ordine lo dà un grafo dei prerequisiti, come per le materie delle superiori, e su quel grafo si appoggiano i macrocapitoli. Alessandro ne vede tre: i modelli che non sono reti neurali né modelli linguistici, cioè gli algoritmi che sono intelligenza artificiale ma non nel senso in cui se ne parla oggi; il deep learning, con le reti neurali e le loro architetture; i modelli linguistici, quelli che conosce anche chi non è del campo. In breve: machine learning senza deep learning, deep learning, LLM.

Proposta di Claude, non discussa: il primo blocco contiene due cose diverse e conviene dividerlo. Ricerca, giochi, logica, pianificazione e algoritmi genetici non imparano dai dati, quindi non sono machine learning. I blocchi diventano quattro, nell'ordine che è insieme quello dei prerequisiti e quello della storia: IA classica, machine learning classico, deep learning, modelli linguistici e agenti. Prima viene un blocco di fondamenti matematici, e in fondo uno trasversale (etica e regole, produzione). L'apprendimento per rinforzo sta a cavallo: la parte tabellare nel machine learning classico, quella con le reti nel deep learning.

Esito, 5 ottobre 2026: Alessandro è d'accordo sui quattro blocchi, con un capitolo 0 di prerequisiti (algebra lineare, probabilità e statistica), i modelli linguistici in un blocco loro pur essendo deep learning, e l'apprendimento per rinforzo declinato sui singoli argomenti senza un blocco suo. Vedi [[2026-10-05 Il corso di intelligenza artificiale ha quattro blocchi ordinati da un grafo dei prerequisiti]].

### Chi rilegge
Alessandro, 5 ottobre 2026: le lezioni universitarie le rilegge lui. Vedi [[2026-10-05 Le lezioni universitarie di intelligenza artificiale le rilegge Alessandro]].

## Perché potrebbe valere
La bozza delle nuove Indicazioni nazionali del 22 aprile 2026 aggiunge l'intelligenza artificiale alle aree di informatica del liceo scientifico opzione scienze applicate, con l'apprendimento automatico tra le linee di lavoro del quinto anno (vedi [[Programma ministeriale]] e `docs/lezioni/informatica/programma.md`). L'[[Editor di codice]] esegue Python nel browser, quindi gli algoritmi si possono provare dentro la lezione.

## Dubbi e conflitti
Valutazione di Claude, 5 ottobre 2026, non discussa.
- L'albero di informatica ha già 11 lezioni di intelligenza artificiale, tra quarto e quinto anno, ancora da scrivere. L'idea le allarga: il programma filtrato elenca 13 argomenti trattabili che oggi non hanno una lezione. L'albero ha 171 lezioni e `docs/lezioni/informatica/programma.md` indica proprio i capitoli del quinto anno come candidati a essere ridotti.
- La bozza del 2026 non è definitiva: se cambia, queste lezioni sono le prime da rivedere.
- L'università non è in nessuna release. [[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]] mette prima le altre materie delle superiori e poi le medie, e [[Visione]] lascia aperto quando e se entra l'università. Il programma universitario è un elenco da tenere, senza una data.
- Il corso di Ghumare copre bene l'apprendimento automatico classico, il deep learning e le basi dell'apprendimento per rinforzo, ma non l'IA classica (ricerca, giochi, logica, reti bayesiane), le reti su grafi e quasi niente delle reti ricorrenti. Due terzi delle lezioni sono su modelli linguistici e agenti, la parte che invecchia più in fretta. È in inglese e per adulti che programmano: come risorsa di approfondimento va bene per pochi studenti di quinta.
- Non è nella beta e non la blocca: va misurata contro i punti dell'[[Agenda]].

## Valutazione critica
Di Claude, 5 ottobre 2026, chiesta da Alessandro; non discussa.

Punti di forza: i quattro blocchi seguono insieme i prerequisiti e la storia; il blocco di IA classica manca in quasi tutti i corsi online, AIEFS compreso; le componenti interattive si appoggiano a quello che Sapiens ha già (kit delle figure, [[Grafico di funzioni]], [[Editor di codice]]); le fonti prima della lezione e un revisore che conosce la materia.

Punti deboli:
- La misura. 57 capitoli sono un percorso di più corsi, non un corso: a 4-8 lezioni per capitolo fanno da 230 a 450 lezioni, più di tutta la matematica delle superiori (183). Un solo revisore non regge quel volume, e già alle superiori la rilettura non teneva il passo della scrittura (vedi [[2026-09-27 I contenuti li rileggono Andrea e Alessandro]]).
- La completezza costa poco nella mappa e molto nelle lezioni. Visione, audio, multimodale, agenti e produzione sono campi interi.
- Il blocco 4 invecchia in pochi mesi.
- Gli esercizi non sono definiti. I generatori a livelli con risposta esatta coprono i calcoli a mano; implementazioni e dimostrazioni no. Addestrare una rete vera nel browser non è possibile senza GPU: che cosa esegue l'editor (numpy compreso) è da verificare.
- Il capitolo 0 vale quattro corsi di matematica che Sapiens non ha.
- Il programma è scritto a memoria e su un solo corso di confronto. Gli alberi delle superiori sono nati da decreto, libri e scuole; questo non è stato confrontato con nessun syllabus universitario. La grana dei capitoli è irregolare e alcuni archi sono discutibili (il transformer dopo le reti ricorrenti).
- Non ha un posto nel piano: l'università non è in nessuna release, la beta di gennaio è di sola matematica e Sapiens non ha ancora utenti reali.
- La concorrenza gratuita in inglese è forte (corsi di Stanford, fast.ai, Karpathy, "Dive into Deep Learning"). In italiano l'offerta sembra più sottile, da verificare.

Suggerimenti: chiamarlo percorso e dividerlo in un nucleo (80-100 lezioni) e in approfondimenti; confrontare l'albero con tre o quattro syllabus veri, a partire da quelli della DTU che Alessandro conosce; fare da pilota un capitolo intero (1.2, la ricerca) e misurare il costo per lezione, rilettura compresa, prima di fissare la misura; definire i tipi di esercizio prima di scrivere; verificare che cosa esegue l'editor; nel blocco 4 solo i principi stabili, con una data; nel capitolo 0 schede di richiamo e non un corso; cominciare dopo la beta, tranne il pilota, che dà anche materiale per i video di ottobre.

Risposta di Alessandro, 5 ottobre 2026: ogni blocco diventa un corso a sé e i prerequisiti sono corsi di matematica indipendenti; l'area è un obiettivo di lungo periodo, da compilare piano piano in parallelo, anche come suo progetto personale di studio; i modelli linguistici si trattano per concetti e svolte tecniche; gli esercizi caso per caso; il pubblico è quello italiano. Vedi [[2026-10-05 Ogni blocco dell'intelligenza artificiale è un corso a sé]]. Poi, lo stesso giorno: il capitolo pilota sono le reti neurali ([[2026-10-05 Il primo capitolo di intelligenza artificiale sono le reti neurali]]), i corsi non hanno una misura fissa ([[2026-10-05 I corsi universitari non hanno una misura fissa]]), modelli linguistici e agenti sono due corsi, e Claude ha il via libera per confrontare il programma con i syllabus di atenei italiani ed esteri. Il confronto è fatto lo stesso giorno su tredici atenei: vedi [[Confronto del programma di intelligenza artificiale con i syllabus universitari]], con le correzioni già applicate e nove proposte di struttura da decidere.

## Collegamenti
- [[Programma di intelligenza artificiale]], [[Programma ministeriale]], [[Editor di codice]], [[Sapiens AI]]
