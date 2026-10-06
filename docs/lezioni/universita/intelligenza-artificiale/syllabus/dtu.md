# La DTU a confronto con la bozza di 57 capitoli

Consultazione del 5 ottobre 2026. Ho letto alla fonte tutte le schede citate, su `https://kurser.dtu.dk/course/2026-2027/<codice>` (o `2025-2026` dove indicato). Non ho modificato nessun file del repository.

Tre limiti di metodo:
- **Accesso:** la course base risponde con una pagina vuota senza cookie di sessione, quindi le schede sono lette con `curl` e cookie jar.
- **Ricerca:** la ricerca a testo libero funziona solo per il 2026/27. Per il 2025/26 ho sondato i codici per intervalli (02180-02199, 02280-02291, 02435-02519, 02560-02583, 02800-02834, 02900-02904, 02985-02989).
- **Sintesi:** obiettivi e contenuti qui sotto sono condensati; il testo integrale è all'URL di ogni scheda.

## 1. Codici verificati

| Atteso | Trovato |
|---|---|
| 02450 Intro to ML and Data Mining | Non esiste più. Ultima edizione 2024/25 (5 ECTS). Dal 2025/26 è sostituito da 02451 (triennale, primavera) e 02452 (magistrale, autunno). Molte schede lo citano ancora come prerequisito. |
| 02456 Deep Learning | Confermato. |
| 02180 Intro to AI | Confermato. |
| 02285 AI and Multi-Agent Systems | Attivo nel 2025/26 (7,5 ECTS). Nel 2026/27 la pagina è vuota: lo sostituisce 02280, stesso nome, 10 ECTS ("Previous course 02285"). |
| 02476 MLOps, 02477 Bayesian ML | Confermati. |
| RL, forse 02465 | Confermato: "Introduction to reinforcement learning and control", corso di triennale. |
| Visione | 02516, 02501, 02504, 02510. |
| Linguaggio naturale | Nessun corso con codice. Il testo sta dentro 02805, 02467 e 02462. |
| Etica, IA spiegabile | 02517 (magistrale, attivo dal 2024/25; la pagina 2023/24 è vuota). 02820 "Explainable AI and user experience" è nuovo nel 2026/27 e riservato alla triennale. |
| Modelli linguistici | Nessun corso con codice nella course base, né nel 2025/26 né nel 2026/27. Esiste un corso speciale, vedi sotto. |

### Il corso sui modelli linguistici

È un "special course" senza codice: "Natural language processing, large language model operations and knowledge graphs".

- **Formato:** 5 ECTS, 13 settimane, autunno E4B, massimo 40 iscritti, voto superato o non superato, iscrizione per email.
- **Docenti:** Finn Årup Nielsen, con Nicki Skafte Detlefsen (il docente di MLOps).
- **Da quando:** l'annuncio dice che si è tenuto la prima volta nella primavera 2026 e si ripete dal 4 settembre al 4 dicembre 2026.
- **Prerequisiti:** "machine learning, programming, (deep learning, MLOps)".
- **Obiettivi:** costruire servizi web per l'elaborazione del testo, servizi che chiamano un LLM remoto, un sistema di recupero dell'informazione; usare e interrogare grafi di conoscenza; collegare LLM e recupero (RAG); scrivere codice ordinato; un piccolo progetto.
- **Contenuti:** web service, estrazione del testo, information retrieval, LLM, CampusAI, riconoscimento e collegamento di entità, grafi di conoscenza, RAG.
- **Testo:** dispense del docente.
- **Fonti:** [programma PDF](https://people.compute.dtu.dk/faan/ps/Nielsen2026SpecialAutumn.pdf) e [annuncio su inside.dtu.dk](https://www.inside.dtu.dk/phd/phd-studies-news/special-course-in-autumn-2026-natural-language-processing-large-language-model-operations-and-knowledge-graphs?msgid=eacd2cd1-5275-47b2-93a7-db3a0cd50a18).

È un corso di ingegneria d'uso (servizi, RAG, grafi), non di teoria: niente pre-addestramento, messa a punto o valutazione.

## 2. Schede dei corsi (2026/27 salvo indicazione)

### IA classica

| Codice, nome | ECTS, periodo | Prerequisiti dichiarati | Obiettivi e contenuti | Testo |
|---|---|---|---|---|
| 02180 Introduction to Artificial Intelligence | 5, magistrale, primavera F3A | Programmazione, 02105 Algoritmi 1, matematica discreta (01017/01019), logica proposizionale | Ricerca non informata e informata (A*, greedy), ricerca con avversario (minimax, MCTS), euristiche e funzioni di valutazione, basi di conoscenza in logica proposizionale e del primo ordine, inferenza (modus ponens, concatenazione in avanti e all'indietro, risoluzione, model checking, SAT), revisione delle credenze, aspetti filosofici, etici, legali e sociali | Russell e Norvig |
| 02182 Symbolic AI | 5, triennale IA e Dati, primavera | 01017, 02105, 02450, 02464, 02465 | Stati proposizionali, PDDL, stati di credenza, modelli epistemici; teoria dei giochi ed equilibri, teoria della mente, pianificazione multi-agente, riconoscimento di piani; STRIPS, ricerca con osservabilità parziale e non determinismo; IA neurosimbolica; robot umanoidi | non indicato |
| 02280 AI and Multi-Agent Systems (ex 02285) | 10, magistrale, primavera F4A | 01017, 02101, 02105, 02180; si può seguire in parallelo a 02180 | Pianificazione automatica e sistemi multi-agente, più ricerca e agenti logici; progetto di gruppo in un ambiente multi-agente simulato, lettura di letteratura di ricerca, presentazione in stile conferenza | non indicato |
| 02287 Logical Theories for Uncertainty and Learning | 5, magistrale, autunno | 01017 / 02156 / 02180, probabilità elementare | Logica epistemica, conoscenza di gruppo, logica degli annunci pubblici, revisione delle credenze, aggiornamento bayesiano, funzioni di credenza, teoria dei giochi (Nash, strategie miste, giochi in forma estesa) | Halpern 2003; Fagin e altri 2004; Rasmusen 2006 |

### Machine learning e deep learning

| Codice, nome | ECTS, periodo | Prerequisiti dichiarati | Obiettivi e contenuti | Testo |
|---|---|---|---|---|
| 02451 Introduction to ML / 02452 Machine Learning | 5 ciascuno; primavera F4A (triennale) / autunno E4A (magistrale) | Algebra lineare e analisi (01001-01005), statistica (02402/02403), Python | Preparazione dei dati ed estrazione di caratteristiche, misure di similarità, funzioni di costo e massima verosimiglianza, ottimizzazione, sovradattamento, regolarizzazione, distorsione e varianza, convalida incrociata, confronto statistico tra modelli, PCA, classificazione (alberi, logistica e multinomiale, k-NN, Naive Bayes, reti feed-forward, insiemi), regressione, clustering (k-means, gerarchico, misture), stima di densità (kernel, GMM, EM), anomalie | Dispense |
| 02456 Deep learning | 5, magistrale, autunno E2A | 02450/02451/02452, 01005, probabilità o statistica, Python | Reti feed-forward, funzioni di perdita, retropropagazione, inizializzazione, regolarizzazione, reti residue, CNN, RNN e transformer, reti su grafi, modelli generativi. Otto settimane di lezione, poi progetto. L'uso di IA generativa nel progetto va documentato con una lista di controllo | Prince, Understanding Deep Learning (2023); secondario Goodfellow, Bengio, Courville (2016) |
| 02477 Bayesian machine learning | 5, magistrale, primavera F2A | Matematica, 02402, 02405 Probabilità, 02451/02452 | Prior, verosimiglianza, posteriore, evidenza; ML, MAP, inferenza esatta e approssimata (campionamento, variazionale); selezione del modello; calibrazione e incertezza; teoria bayesiana delle decisioni; processi gaussiani; deep learning bayesiano | Murphy, Probabilistic ML, vol. 1 e 2 (2023) |
| 02460 Advanced Machine Learning | 5, magistrale, primavera F1B | 02450 e 02456 come minimo; consigliati 02476, 02477, 02405 | Tre moduli: modelli generativi profondi, rappresentazioni geometriche e identificabilità, reti su grafi | Tomczak; Hauberg; Hamilton |
| 02476 Machine Learning Operations | 5, magistrale, gennaio | 02456, PyTorch | Organizzazione del codice, controllo di versione di codice e dati, ambienti riproducibili e container, profiling, log degli esperimenti, test e integrazione continua, cloud, addestramento distribuito, ottimizzazione dell'inferenza, messa in servizio e monitoraggio | non indicato |
| 02465 Intro to reinforcement learning and control | 5, triennale, primavera F4B | 02450, 02403, Python | Programmazione dinamica, controllo ad anello aperto e chiuso, LQR, PID, linearizzazione; banditi; MDP, iterazione dei valori e della politica; Q-learning, Sarsa, Monte Carlo; tracce di eleggibilità; approssimatori lineari e non lineari; deep Q-learning | Sutton e Barto (2018); dispense di Herlau |
| 02463 Active ML and agency | 5, triennale IA e Dati, primavera | 02450, 02403 | Ottimizzazione bayesiana, apprendimento attivo, processi gaussiani, funzioni di acquisizione, inferenza causale | Bishop (2006); Shahriari e altri (2016); Settles (2009) |
| 02471 ML for signal processing | 5, magistrale, autunno | Algebra, probabilità, ML di base, 02462 o corso di segnali | Sistemi lineari, STFT e spettrogramma, ICA, NMF, filtro di Wiener, LMS e RLS, Kalman e HMM, lasso, compressed sensing, dictionary learning, metodi a kernel (ridge, SVR) | Theodoridis, 2ª ed. |
| 02582 Computational Data Analysis | 5, magistrale, primavera | uno tra 02409, 02450, 27411 | Ridge, elastic net, LDA, logistica, SVM, CART, bagging, boosting, foreste casuali, PCA sparsa, NMF, ICA, bootstrap | non indicato |

### Visione

| Codice, nome | ECTS, periodo | Prerequisiti | Obiettivi e contenuti |
|---|---|---|---|
| 02516 Intro to Deep Learning in Computer Vision | 5, magistrale, autunno | 02450 | CNN per classificazione, rilevamento, segmentazione; aumento dei dati; attacchi avversari; metodi di attribuzione |
| 02501 Advanced DL in Computer Vision | 5, magistrale, primavera | 02450, 02456, 02516 | Architetture recenti, immagini con testo, video, modelli generativi, pochi dati, spiegabilità ed equità |
| 02504 Computer Vision | 5, magistrale, primavera | 02456 (02516) | Geometria a una e due viste, calibrazione, stima della camera, RANSAC, corrispondenze, caratteristiche; dispense e articoli |
| 02510 DL and data engineering for image analysis | 5, magistrale, primavera | 02450 / 02502 | Segmentazione e rilevamento in 2D e 3D, etichettatura e qualità delle etichette, embedding per controllare un dataset |

Le quattro schede non indicano un libro di testo.

### Etica, spiegabilità, persona

| Codice, nome | ECTS, periodo | Prerequisiti | Obiettivi e contenuti |
|---|---|---|---|
| 02517 Responsible AI: Algorithmic fairness and explainability | 5, magistrale, autunno E2B | uno tra 02450/02451/02452/02456 | Tre parti: epistemologia del ML (adattare un modello contro "intelligenza"), equità (metodi classici, limiti, mitigazione, anche per modelli generativi), IA spiegabile (salienza, prototipi, validazione, assunti filosofici) |
| 02820 Explainable AI and user experience | 5, triennale IA e Dati, autunno; nuovo 2026/27 | 02451/02452, 02462 | LIME, SHAP, LRP, CAV, metodi a gradiente; t-SNE, UMAP; allineamento di rappresentazioni (CCA, CKA); valutare le spiegazioni (fedeltà, stabilità, plausibilità, comprensibilità); design centrato sulla persona, valutazione euristica, esperimenti con utenti; etica dei dati |
| 02988 AI Alignment, safety and security | 2,5, dottorato; non offerto a gennaio 2027 | 02450 consigliato | Allineamento, robustezza e sicurezza di LLM e modelli generativi, comportamento avversario e controllo, valutazione, persona nel ciclo. Testi: Guerraoui e altri (2024); Gabriel (2020) |
| 02810 UX Design Prototyping | 5, magistrale, autunno | 02160/02161/02267 | Bisogni dell'utente, mappa gerarchica delle storie, prototipi, MVP con cicli build-measure-learn, etica e distorsioni |
| 02266 User Experience Engineering | 5, magistrale, gennaio | 02809/02810 | Prototipi di interfacce con dati biometrici, ipotesi verificabili |
| 02455 Experiment in Cognitive Science | 5, magistrale, autunno | 02411, programmazione | Etica degli esperimenti con persone, misure comportamentali e fisiologiche, disegno sperimentale |
| 02458 Cognitive Modelling | 5, magistrale, autunno | 02450, 02454/02464 | Teoria della detezione del segnale, funzione psicometrica, percezione bayesiana, codifica neurale |
| 02805 Social graphs and interactions | 10, magistrale, autunno | programmazione | API web, elaborazione del testo, sentiment, raccomandazione, reti complesse, comunità |

Altri corsi dove compaiono i modelli linguistici:
- **38113 Applied AI for Entrepreneurs** (5, magistrale): prototipi con modelli multimodali, agenti e memoria, taglio di prodotto.
- **42578 Advanced Business Analytics**: RAG, LoRA, chain-of-thought.
- **02462 Signals and data** (triennale): bag of words, GloVe, fastText, attenzione, BERT, GPT.
- **34766 Robotic Manipulation**: apprendimento per imitazione, modelli visione-linguaggio-azione.

## 3. La magistrale Human-Centered AI

Fonti: [piano di studi su dtu.dk](https://www.dtu.dk/english/education/graduate/msc-programmes/human-centered-artificial-intelligence/curriculum), [programme specification su student.dtu.dk](https://student.dtu.dk/en/programme-specifications/master-of-science-in-engineering/human-centered-artificial-intelligence) (rivista per gli immatricolati da settembre 2026), [specializzazioni](https://www.dtu.dk/english/education/graduate/msc-programmes/human-centered-artificial-intelligence/specialization).

La struttura è 120 ECTS: 10 di base politecnica, 50 specifici del programma, 30 di tesi, il resto a scelta.

Gli obbligatori sono pochi:
- **Base politecnica:** un corso sui metodi quantitativi per la sostenibilità (12100 e varianti) e Innovation in Engineering (38400 e varianti).
- **Innovazione:** 02810 UX Design Prototyping.
- **Competenza di base:** 02452 Machine Learning; chi ha già 02450 o 02451 sceglie un altro corso.

Poi 10 ECTS tra 02282, 02504, 02561, 02582, 02805, 02806, 02807, e 30 ECTS da un elenco lungo. Nell'elenco ci sono 02180, 02280, 02456, 02460, 02476, 02477, 02501, 02516, 02517, 02455, 02458, 02266, 02808, 38113, più grafica e videogiochi.

Deep learning, IA classica, IA responsabile e MLOps sono quindi tutti facoltativi. Rinforzo (02465, triennale) e 02820 non sono nell'elenco; entrano solo nei 10 ECTS di triennale ammessi tra i corsi a scelta.

Per chi si è immatricolato prima di settembre 2026, come il vostro revisore, valgono anche 02285 (7,5 ECTS) e 02506 Advanced Image Analysis. Dal 2023 all'inizio del 2024 la base politecnica era di 5 ECTS e la parte specifica di 55.

Le specializzazioni sono sei percorsi consigliati: AI and Cognition, Machine Learning at Scale, Data Science, Human-Computer Interaction, Visual Computing, Computer Games.

## 4. Confronto con i 57 capitoli

### 4.1 Argomenti DTU che da noi mancano o sono appena accennati

| Argomento (corso DTU) | Dove andrebbe |
|---|---|
| Confronto statistico tra modelli: test, bootstrap, permutazioni, confronti multipli, A/B (02451/02452, 02445) | 2.2. Oggi ha metriche e convalida incrociata ma non il confronto tra due modelli |
| ML bayesiano: evidenza, inferenza variazionale, calibrazione, incertezza, deep learning bayesiano (02477) | Manca un capitolo. I processi gaussiani stanno in 2.6, MCMC in 0.3. Candidato a un 2.12, o da dividere tra 2.6 e 3.3 |
| Apprendimento attivo e ottimizzazione bayesiana con funzioni di acquisizione (02463) | 2.7, che cita solo la ricerca bayesiana degli iperparametri |
| Stima di densità a kernel; misure di similarità (02451) | 2.8 o 2.10; 2.4 |
| Metodi sparsi e fattorizzazioni: elastic net, PCA sparsa, NMF, dictionary learning, compressed sensing (02582, 02471) | 2.3 e 2.9 |
| Teoria dei giochi oltre la somma zero: Nash, strategie miste, forma estesa (02182, 02287) | 1.4, o in testa a 4.9 |
| Logica epistemica, revisione delle credenze, stati di credenza, ricerca con osservabilità parziale e non determinismo (02180, 02182, 02287) | 1.6 e 1.2 |
| Pianificazione multi-agente classica, riconoscimento di piani, teoria della mente (02182, 02280) | 1.7. Il nostro 4.9 parte dagli agenti LLM e dal MARL |
| IA neurosimbolica (02182) | 1.6, o ponte verso 4.8 |
| Controllo: LQR, PID, linearizzazione, insegnati insieme al rinforzo (02465) | 1.9 o 4.10 |
| Geometria della visione: modello della camera, calibrazione, due viste, RANSAC, caratteristiche (02504) | 3.10, che oggi è tutto deep learning |
| Ingegneria dei dati per immagini: etichettatura, qualità delle etichette; addestrare con pochi dati (02510, 02501) | 2.7 e 3.8 |
| Segnali: sistemi lineari, Wiener, filtri adattivi (02471) | 3.12, che ha solo Fourier e spettrogrammi |
| Riproducibilità, container, test, integrazione continua, profiling, addestramento distribuito (02476) | 5.7, che oggi copre servizio e ciclo di vita |
| XAI: LRP, CAV, prototipi, CKA; valutare una spiegazione; spiegare a non tecnici (02517, 02820) | 5.2 |
| Mitigazione delle distorsioni e diagnosi nei modelli generativi (02517) | 5.1, che ha origini e criteri ma non i rimedi |
| Epistemologia del ML (02517, 02988) | 1.1, o apertura del blocco 5 |
| Reti sociali e scienza delle reti (02805, 02467) | Assente. Vicino a 3.7 o 2.10 |
| Grafi di conoscenza collegati a un LLM, collegamento di entità (corso speciale) | Arco tra 1.6 e 4.6 |
| Identificabilità e geometria degli spazi latenti (02460) | 3.9, probabilmente fuori misura |

### 4.2 Nostri capitoli senza un corso DTU

Vale per le schede lette: una scheda può tacere un argomento che il docente tratta.

- **1.3:** ricerca locale e algoritmi evolutivi non compaiono in nessuna scheda.
- **1.5:** 02180 nomina SAT, non i problemi di soddisfacimento di vincoli.
- **1.8:** reti bayesiane e campi di Markov non compaiono. HMM e Kalman stanno in 02471, dal lato dei segnali.
- **2.2:** PAC, dimensione VC, "no free lunch" assenti.
- **2.6:** le SVM non sono nel corso introduttivo; stanno in 02582 e 02471.
- **2.9, 2.10:** mappe auto-organizzanti assenti. Le regole di associazione erano in 02450 fino al 2024/25 e sono sparite da 02451/02452.
- **3.8:** Hopfield e Boltzmann assenti.
- **3.11, 3.12:** nessun corso dedicato a linguaggio o parlato con le reti.
- **3.13:** la DTU si ferma a DQN. Gradiente della politica, attore-critico, PPO, SAC, AlphaZero, offline non compaiono.
- **4.1-4.4:** pre-addestramento, tokenizzatori, leggi di scala, RLHF e DPO, quantizzazione, decodifica, valutazione di un LLM non sono in nessuna scheda con codice.
- **4.5, 4.6:** solo nel corso speciale e, in parte, in 42578.
- **4.8:** gli agenti LLM compaiono solo in 38113, con taglio di prodotto.
- **4.9:** il rinforzo multi-agente è assente.
- **5.3-5.5:** jailbreak, iniezione di prompt, filigrane, privacy differenziale, apprendimento federato e allineamento stanno al più nel corso di dottorato 02988.
- **5.6:** nessuna scheda nomina l'AI Act.

Il blocco 4 è quindi quasi tutto fuori dal confronto: il revisore lo conosce dalla DTU solo attraverso 02456 e, se l'ha seguito, il corso speciale.

### 4.3 Catena dei prerequisiti DTU

```
matematica + statistica + Python ─> 02451/02452 ─┬─> 02456 ─┬─> 02476
                                                 │          ├─> 02460 (consigliati 02476, 02477)
                                                 │          └─> 02501, 02504
                                                 ├─> 02477 (con 02405 Probabilità)
                                                 ├─> 02516 ─> 02501
                                                 ├─> 02517 (basta ML o DL)
                                                 └─> 02465, 02463 (con 02403)
matematica discreta + algoritmi ─> 02180 ─> 02280, 02287
```

Differenze dai nostri archi:

1. **IA classica e ML sono due linee senza archi tra loro.** 02451/02452 non chiedono 02180, e 02180 non chiede statistica. Noi abbiamo B1 → B2 (1.1 → 2.1) e B1 → B4. Nella triennale IA e Dati l'ordine è perfino rovesciato: 02182 chiede 02450 e 02465.
2. **Il rinforzo non passa dall'IA classica.** 02465 insegna MDP e programmazione dinamica al proprio interno e chiede solo ML e statistica. Da noi 1.9 → 2.11, e 3.13 chiede anche 1.4. Inoltre 02465 arriva a DQN senza chiedere 02456.
3. **MLOps chiede solo deep learning.** Il nostro 5.7 chiede 4.3, cioè un pezzo del blocco LLM. Con l'arco DTU, 5.7 si potrebbe studiare dopo 3.3.
4. **La visione introduttiva chiede solo il corso di ML** e corre in parallelo a 02456. Da noi 3.10 chiede 3.4 e 3.6.
5. **Il ML bayesiano chiede un corso di probabilità a sé.** Il nostro 2.6, che contiene i processi gaussiani, dichiara 2.3 e 0.5 ma non 0.3: è un arco che manca.
6. **Sistemi multi-agente:** 02280 chiede 02180; il nostro 4.9 chiede 4.8 e 3.13. Sono due materie diverse con lo stesso nome.
7. **Equità e spiegabilità:** 02517 chiede ML oppure deep learning, come i nostri 5.1 ← 2.2 e 5.2 ← 2.5, 3.3. Qui coincidiamo.

### 4.4 Come la DTU divide la materia

Corsi da 5 ECTS, uno per metodo, con due eccezioni a progetto da 10 (02280, 02805).

| Area | Corsi DTU | Nostri blocchi |
|---|---|---|
| IA simbolica | 02180, 02280, 02287 (sezione informatica) | 1.1-1.7 |
| ML introduttivo, reti feed-forward incluse | 02451/02452 | 2.1-2.5, 2.7-2.9, parte di 3.1 |
| Deep learning | 02456, poi 02460 | 3.1-3.9 |
| ML probabilistico | 02477, 02463 | sparso tra 0.3, 0.4, 1.8, 2.6 |
| Visione | quattro corsi | 3.10 |
| Segnali | 02462, 02471 | 3.12, parte di 1.8 |
| Produzione | 02476 | 5.7 |
| Responsabilità | 02517, 02820 | 5.1, 5.2 |

Dove stanno i quattro temi chiesti:

- **Rinforzo:** un corso solo, di triennale, unito al controllo e fuori dall'elenco della magistrale HCAI. Nessun corso di rinforzo con le reti. La vostra scelta di spezzarlo in 1.9, 2.11 e 3.13 lo copre più a fondo, ma il revisore lo ha visto come materia unica, costruita su Sutton e Barto.
- **Modelli linguistici:** nessun corso stabile. Il transformer sta in 02456; l'uso sta nel corso speciale del 2026 e in corsi applicati (38113, 42578); la sicurezza in un corso di dottorato.
- **Sistemi multi-agente:** verificato, 02280/02285 è IA classica. La scheda parla di pianificazione automatica, ricerca, agenti logici e di un progetto in un ambiente simulato. Nessun riferimento a modelli linguistici né a rinforzo.
- **Etica:** un corso tecnico dedicato (02517), più richiami dentro altri corsi: 02180 (aspetti etici, legali e sociali), 02501 e 02516 (equità, spiegabilità, attacchi avversari), 02456 (uso dichiarato dell'IA generativa), 02455 (esperimenti con persone).

### 4.5 Che cosa vuol dire "human-centered", e che cosa suggerisce per il blocco 5

Alla DTU "human-centered" non significa etica dell'IA. Il programma viene dall'ingegneria dei media digitali, e i suoi obiettivi specifici parlano di modellare l'interazione tra persone e sistemi, modellare i bisogni dell'utente, validare con prototipi rapidi, usare dati generati dalle persone (reti sociali, dispositivi indossabili), raccomandare contenuti. L'unico obbligo oltre al ML è un corso di prototipazione UX. La valutazione delle implicazioni etiche e sociali compare in un solo obiettivo, e 02517 è facoltativo.

Rispetto a un percorso generico, la differenza è che la persona entra come oggetto di misura: esperimenti con utenti, scienze cognitive, percezione, visualizzazione. Un percorso generico la tratta come destinatario di tutele.

Il nostro blocco 5 è costruito sui rischi (equità, robustezza, riservatezza, allineamento, regole). Dal confronto escono cinque candidati:

1. **Valutare un sistema con le persone:** disegno di un esperimento con utenti, misure, consenso ed etica della sperimentazione (02455, 02820). Oggi non c'è; starebbe accanto a 4.4 e 5.2.
2. **Spiegare a chi non è tecnico** e valutare se una spiegazione serve davvero: comprensibilità, plausibilità (02820). Estensione di 5.2.
3. **Progettare l'interazione con un sistema di IA:** bisogni dell'utente, prototipo, persona nel ciclo, supervisione dopo il rilascio (02810, 02988). Capitolo nuovo, oppure parte di 4.8 e 5.7.
4. **IA e cognizione umana:** somiglianze e differenze, percezione come inferenza bayesiana (02464, 02458). Candidato per 1.1 più che per il blocco 5.
5. **Limiti epistemici del ML:** che cosa un modello adattato ai dati può e non può affermare (prima parte di 02517). Apertura del blocco 5.

Nel senso opposto, 5.3, 5.4, 5.5 e 5.6 sono argomenti che il revisore non ha incontrato in un corso DTU con codice: lì la revisione avrà meno termini di paragone.
