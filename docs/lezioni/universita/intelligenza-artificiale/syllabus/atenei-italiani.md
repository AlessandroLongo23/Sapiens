# Confronto con i syllabus degli atenei italiani

Consultazione del 5 ottobre 2026. Nessun file del repository è stato modificato.

La copertura è piena solo per Bologna. Per gli altri atenei molte schede 2026/27 non si aprono o non sono pubblicate, quindi parte dei dati viene da anni precedenti.

Le pagine sono state lette con uno strumento che riassume: gli elenchi sono fedeli nel contenuto, ma non sempre parola per parola. Dove la fonte è un estratto di ricerca o un anno vecchio, è indicato.

## 1. Corsi trovati

### Università di Bologna, LM Artificial Intelligence (cod. 6700), a.a. 2026/27

Piano letto su https://corsi.unibo.it/2cycle/artificial-intelligence/course-structure-diagram/piano/2026/6700/000/000/2026. Gli URL delle schede hanno la forma `https://www.unibo.it/en/study/phd-professional-masters-specialisation-schools-and-other-programmes/course-unit-catalogue?codiceMateria=<CODICE>&annoAccademico=2026&codiceCorso=6700&single=True&search=True`.

| Corso | CFU | Argomenti del syllabus | Testi |
|---|---|---|---|
| Fundamentals of AI and Knowledge Representation (91248, Milano, Calegari), obbligatorio. URL: https://www.unibo.it/en/study/course-units-transferable-skills-moocs/course-unit-catalogue/course-unit/2026/530654 | 12 | Modulo 1: introduzione, paradigmi, Trustworthy AI e AI Act; ricerca non informata e informata; giochi (minimax, alfa-beta); CSP; pianificazione (STRIPS, GraphPlan, partial order, gerarchica); algoritmi genetici e swarm intelligence. Modulo 2: logica del primo ordine, Prolog, ontologie, description logics, knowledge graph; ragionamento temporale, Event Calculus, sistemi a regole, complex event processing, business process management; knowledge graph e RAG con i foundation model, IA neuro-simbolica. Modulo 3: probabilità, reti bayesiane, HMM, modelli grafici, indipendenza condizionata e d-separazione, inferenza esatta e approssimata, ragionamento causale, stima dell'incertezza nei foundation model | Russell e Norvig; Brachman e Levesque; Description Logic Handbook |
| Machine Learning and Data Mining (95631, Sartori), obbligatorio. Contenuti letti sulla scheda 2025/26: https://www.unibo.it/en/study/course-units-transferable-skills-moocs/course-unit-catalogue/course-unit/2025/502283 | 6 | Processo di data mining, data warehouse, data lake; teoria dell'apprendimento; supervisionato e non; selezione e validazione del modello; regressione; classificazione (discriminante lineare, alberi, inferenza bayesiana, SVM, kNN, regressione logistica, random forest, AdaBoost); ensemble, boosting, bagging; regole di associazione e Apriori; clustering (k-means, DBSCAN, EM, gerarchico, kernel); CRISP-DM | Alpaydin; documentazione scikit-learn |
| Deep Learning (91250, Asperti), obbligatorio. URL: https://www.unibo.it/en/study/course-units-transferable-skills-moocs/course-unit-catalogue/course-unit/2026/529959 | 6 | Retropropagazione; reti feedforward, convoluzionali, ricorrenti; immagini (localizzazione, segmentazione, style transfer) e testo; visualizzazione delle unità (deep dream); tecniche avversarie e generative, con accento sui modelli a diffusione; chiusura con deep reinforcement learning (videogiochi, guida autonoma) | Dive into Deep Learning; Goodfellow, Bengio, Courville |
| Natural Language Processing (91258, Torroni), obbligatorio, 2° anno | 6 | Linguistica computazionale; preparazione del testo; modelli a n-grammi; classificazione con modelli lineari; semantica vettoriale ed embedding; modelli linguistici neurali; RNN; embedding contestuali, attenzione e transformer; LLM; basi di information retrieval; elementi di parlato; applicazioni | Jurafsky e Martin, 3ª ed. |
| Image Processing and Computer Vision (91254, Lisanti, Salti), obbligatorio | 6 | Formazione dell'immagine; filtri spaziali; contorni (Canny); feature locali (Harris, SIFT); Hough; calibrazione della camera, omografie; classificazione di immagini, bag of visual words, convoluzione, pooling, batch norm; LeNet, AlexNet, ZFNet, VGG, Inception, ResNet; regolarizzazione e addestramento in PyTorch | Gonzalez; Hartley e Zisserman; D2L |
| Ethics in AI (91257, Sartor, Lagioia, Calegari), obbligatorio, 2° anno. La scheda 2026/27 (https://www.unibo.it/en/study/course-units-transferable-skills-moocs/course-unit-catalogue/course-unit/2026/530663) dice "syllabus not published yet"; contenuti letti sulla scheda 2025/26 (stesso schema di URL con annoAccademico=2025, codiceCorso=9063) | 6 | Introduzione all'etica; singolarità e superintelligenza; agentività artificiale, libero arbitrio, coscienza; responsabilità degli agenti; machine ethics; roboetica; bias e discriminazione; antropomorfismo, interazione uomo-macchina, dignità; fiducia; human in the loop, sicurezza, accountability; spiegabilità e trasparenza; valutazione di casi d'uso (robot militari, auto autonome, sanità, creatività); rilevanza giuridica; privacy; modellazione di norme giuridiche ed etiche | materiali del corso |
| Multi-Agent Systems (91267, Calegari), a scelta | 6 | Agenti in contesti distribuiti, autonomia, artefatti, ragionamento automatico, coordinazione, sistemi auto-organizzanti, approcci ispirati alla natura, simulazione; tecnologie JADE e Jason | sul sito del corso |
| Agentic AI Systems M (B8565, Musolesi), a scelta libera | 8 | Progettazione di sistemi agentici; RL (banditi a più braccia, Monte Carlo, metodi tabellari e con approssimazione di funzioni); applicazioni a giochi, controllo, robotica; teoria algoritmica dei giochi per l'apprendimento multi-agente (cooperazione, coordinazione, dilemmi sociali); agenti basati su LLM con RLHF, DPO e reasoning model; apprendimento generativo e creatività; problemi aperti (safety, value alignment, superintelligenza, controllabilità) | Sutton e Barto; Bishop e Bishop 2023; Russell e Norvig; Floreano e Mattiussi; Foster |

Nel 2025/26 lo stesso docente teneva "Autonomous and Adaptive Systems M" (92858, 8 CFU), con contenuti quasi identici più i sistemi adattivi bio-ispirati.

Altri corsi in piano, di cui ho letto solo il nome: Statistical and Mathematical Methods for AI, Combinatorial Decision Making and Optimization, Cognition and Neuroscience (tutti obbligatori, 6 CFU), Machine Learning for Computer Vision, Knowledge Engineering, Architecture and Platforms for AI, AI in Industry. "Artificial Intelligence and Robotics" ed "Expert Systems" non sono attivi nel 2026/27.

### Politecnico di Milano, LM Computer Science and Engineering

Elenco dei corsi (offerta 2025) letto su https://www.ingindinf.polimi.it/en/corsi/corsi-di-laurea-magistrale/translate-to-english-dettaglio/481-2025. Le schede di dettaglio che si aprono sono del 2022/23 o più vecchie; quelle recenti non le ho raggiunte.

| Corso | CFU | Anno della scheda letta | Argomenti | Testi |
|---|---|---|---|---|
| Foundations of Artificial Intelligence (056889, Amigoni, Lanzi). URL: https://onlineservices.polimi.it/schedaincarico/letturaschedadocente.jsp?evn_default=evento&c_classe=787997 | 5 | 2022/23 | Introduzione; spazio degli stati, strategie di ricerca, CSP; logica proposizionale e risolutori SAT; pianificazione STRIPS e PDDL; incertezza nella rappresentazione della conoscenza; panoramica di ML e DL; storia e fondamenti filosofici | Russell e Norvig, 4ª ed. |
| Machine Learning (097683, Restelli, Loiacono). URL: https://onlineservices.polimi.it/schedaincarico/schedaincarico/controller/scheda_pubblica/SchedaPublic.do?evn_default=evento&c_classe=789102 | 5 | 2022/23 | Teoria dell'apprendimento (bias e varianza, dimensione VC, limiti, apprendimento online); supervisionato (LMS, regressione logistica, percettrone, famiglia esponenziale, kernel: RBF, processi gaussiani, SVM; selezione di modello e feature; bagging, boosting); RL e controllo (MDP, Bellman, value e policy iteration, TD, SARSA, Q-learning, approssimazione della funzione valore, policy search, POMDP, banditi) | Bishop 2006; Sutton e Barto |
| Artificial Neural Networks and Deep Learning (054307, Matteucci, Boracchi). URL: https://onlineservices.polimi.it/schedaincarico/letturaschedadocente.jsp?evn_default=evento&c_classe=787734 | 5 | 2022/23 | Dal percettrone alle reti feedforward; retropropagazione, Adagrad, Adam; sovradattamento, dropout, data augmentation; approssimazione universale, problemi del gradiente; CNN; RNN e LSTM; autoencoder, word2vec, VAE; transfer learning; reti interamente convoluzionali, U-Net, R-CNN, YOLO; GAN. Nessun transformer nella scheda di quell'anno | Goodfellow, Bengio, Courville |
| Natural Language Processing (088946, Sbattella). URL: https://onlineservices.polimi.it/schedaincarico/schedaincarico/controller/scheda_pubblica/SchedaPublic.do?evn_default=evento&c_classe=690485 | 5 | 2018/19, superata: oggi il corso è di Carman e la sua scheda non l'ho trovata | Morfologia, sintassi, semantica, discorso; parlato (prosodia, sintesi, riconoscimento); n-grammi, POS tagging, parsing | Jurafsky e Martin, 2ª ed. |
| Numerical Analysis for Machine Learning (055697, Miglio). URL: https://onlineservices.polimi.it/schedaincarico/schedaincarico/controller/scheda_pubblica/SchedaPublic.do?evn_default=evento&c_classe=836890 | 10 | 2024/25 | SVD, PCA, minimi quadrati, QR; differenziazione automatica (forward, backward); ottimizzazione e addestramento (SGD, metodi accelerati, Newton); proprietà di approssimazione delle reti | Strang 2019; Nocedal e Wright |

Solo per nome, dall'elenco 2025: Reinforcement Learning, Deep Learning 1 e 2, Computer Vision, Uncertainty in AI, Advanced AI Techniques, Design of AI Systems, Adversarial Machine Learning, Game Theory, Multiagent Systems, Architecture of ML Systems, Computer Ethics, Ethics for Technology. La pagina chrome.ws.dei.polimi.it del corso di Matteucci era in manutenzione.

### Università di Pisa, LM Informatica, curriculum Artificial Intelligence

Curriculum 2025/26 letto su https://didattica.di.unipi.it/laurea-magistrale-in-informatica/curricula/curriculum-artificial-intelligence/. Obbligatori: AI Fundamentals (6), Computational Mathematics for Learning and Data Analysis (9), Machine Learning (9), Generative and Deep Learning (9). Al secondo anno Human Language Technologies (9) e Computer Vision (9), segnati "inattivi 2025/26". A scelta: Continual Learning, Learning on Graphs, Robotics, Algorithmic Game Theory.

Dal 2024/25 i programmi stanno sul Course Catalogue Cineca, che non riesco a leggere perché richiede JavaScript, e Moodle chiede il login. Le fonti sono quindi di anni diversi.

| Corso | CFU | Anno e fonte | Argomenti | Testi |
|---|---|---|---|---|
| Artificial Intelligence Fundamentals (Simi) | 6 | 2017/18, vecchio. https://esami.unipi.it/esami2/programma.php?c=33188 | Agenti; CSP (riduzione, consistenza, euristiche); rappresentazione della conoscenza (logica classica, ragionamento non monotono, conoscenza e credenze, ragionamento temporale, reti semantiche, frame, description logics); incertezza (reti di credenze, sequenze temporali); pianificazione (spazio degli stati, regressione, partial order, gerarchica, risorse, multi-agente); sistemi a regole (programmazione logica, sistemi di produzione, CLP, abduzione). Ricerca e logica classica sono prerequisiti, dati dalla triennale | Poole e Mackworth; Russell e Norvig; Brachman e Levesque; Barber |
| Machine Learning (Micheli) | 9 | 2019/20. https://esami.unipi.it/esami2/pdfProgCorsoStu.php?language=it&c=42276 | Apprendimento come approssimazione di funzioni, generalizzazione; spazio delle ipotesi, bias induttivo, modelli a regole, modelli lineari, nearest neighbor, regolarizzazione; reti neurali (percettrone, feedforward multistrato, reti profonde, randomized NN, ricorrenti); teoria statistica dell'apprendimento, model selection e assessment, bias e varianza; SVM e kernel; modelli bayesiani e grafici; non supervisionato (vector quantization, SOM); domini strutturati. Corequisito: metodi numerici e ottimizzazione | Haykin; Mitchell; Goodfellow et al.; Hastie et al. |
| Intelligent Systems for Pattern Recognition (Bacciu), oggi sostituito da Generative and Deep Learning | 9 | 2023/24. https://esami.unipi.it/esami2/programma.php?pg=ects&c=59065 | Apprendimento bayesiano; modelli grafici non orientati; reti bayesiane dinamiche; deep learning (CNN, autoencoder, DBN, ricorrenti con gate); generativi (VAE, GAN, diffusione, modelli espliciti); transformer, Neural Turing Machine, memory network; deep graph network; principi di RL e deep RL; segnali e serie temporali; elaborazione di immagini | Barber; Goodfellow et al.; Prince 2023 |
| Generative and Deep Learning (Bacciu) | 9 | pagina Moodle pubblica, anno non indicato. https://elearning.di.unipi.it/course/info.php?id=1128 | Solo le sezioni: introduzione (2 h); modelli probabilistici e causalità; apprendimento nei modelli probabilistici (16 h); fondamenti di deep learning (18 h); deep learning generativo (18 h); temi avanzati (8 h) | non indicati |
| Human Language Technologies (Passaro) | 9 | 2023/24. https://esami.unipi.it/esami2/programma.php?c=59049 | Modelli linguistici, HMM, Viterbi, generativi e discriminativi; morfologia, POS tagging, NER; parsing a costituenti e a dipendenze; pipeline di annotazione; semantica lessicale, corpora; semantica distribuzionale ed embedding; deep learning per il linguaggio; estrazione di informazione, entity linking, classificazione, riassunto, sentiment, question answering, chatbot, traduzione | Jurafsky e Martin; Bird et al.; Goodfellow et al. |
| Computer Vision (Carta) | n.d. | 2026/27, descrizione pubblica su Moodle. https://elearning.di.unipi.it/course/info.php?id=1171 | Formazione dell'immagine, modelli di camera e colore; Fourier e convoluzione; derivate, aliasing, multi-scala; feature locali; RANSAC, omografie; calibrazione, stereo, geometria epipolare; CNN; Vision Transformer e U-Net; detection e segmentazione; auto-supervisionato (contrastivo, DINOv3); modelli visione-linguaggio e PEFT; diffusione; foundation model, multimodalità, modelli visione-linguaggio-azione; robustezza, calibrazione dell'incertezza, out-of-distribution, continual learning | non indicati |

### Università di Padova, LM Computer Engineering (curriculum AI) e LM ICT (track AI)

Descrizioni lette su https://degrees.dei.unipd.it/master-degrees/computer-engineering/computer-engineering-study-plan/ (la pagina non indica l'anno) e track 2026/27 su https://mime.dei.unipd.it/tracks/artificial-intelligence/. Il catalogo ufficiale (unipd.coursecatalogue.cineca.it) non si legge senza JavaScript, quindi questi sono riassunti del corso di studi e non le schede complete.

| Corso | CFU | Argomenti |
|---|---|---|
| Foundations of Artificial Intelligence, obbligatorio | 9 | Agenti intelligenti; strategie di ricerca avanzate; pianificazione automatica; ragionamento e apprendimento nei modelli grafici probabilistici; inferenza causale |
| Machine Learning, obbligatorio | 9 | Imparare un modello; convergenza uniforme; compromesso bias-complessità; dimensione VC; modelli lineari; discesa del gradiente e SGD; selezione e validazione; regolarizzazione e selezione delle feature; SVM; alberi e random forest; boosting; clustering |
| Deep Learning, obbligatorio | 6 | Reti feedforward; retropropagazione; differenziazione automatica; sovradattamento e regolarizzazione; ottimizzatori (Adam); CNN; RNN; transformer e auto-attenzione |
| Reinforcement Learning (Susto, Carli), obbligatorio | 6 | Banditi a k braccia; esplorazione e sfruttamento; MDP ed equazioni di Bellman; programmazione dinamica; Monte Carlo; differenze temporali; approssimazione della funzione valore; policy gradient; deep RL. Testo: Sutton e Barto (da https://reinforcementlearning.dei.unipd.it/course-thesis.php) |
| Natural Language Processing (Satta), 2025/26, Moodle: https://stem.elearning.unipd.it/course/view.php?id=15243 | 6 | Normalizzazione e tokenizzazione, BPE; embedding statici e contestuali; n-grammi; modelli linguistici neurali; BERT, ELMo, GPT; LLM e pre-addestramento; fine-tuning e instruction tuning; LoRA e adattatori; RAG; chatbot e prompt engineering; POS tagging, HMM, NER, parsing a dipendenze; traduzione e attenzione; transformer; inferenza e beam search; large reasoning model. Testo: Jurafsky e Martin, 3ª ed. (bozza del 6 gennaio 2026) |
| Computer Vision | 9 | Acquisizione ed elaborazione a basso livello, poi sistemi basati su deep learning; formazione dell'immagine e calibrazione |
| Agentic AI for Information Access, a scelta | 6 | Agenti che pianificano, ragionano e usano strumenti per compiti di accesso all'informazione; neural search, adaptive querying, RAG |

Solo per nome: Recommender Systems, Learning from Networks, Autonomous Robotics, Adversarial Machine Learning.

### Sapienza, LM Artificial Intelligence and Robotics (33514)

Piano 2026/27 letto su https://corsidilaurea.uniroma1.it/en/course/33514/study-plan. Le schede dei singoli insegnamenti si aprono vuote: il catalogo avvisa che i contenuti 2026/27 "sono in corso di aggiornamento".

Corsi nel piano: Artificial Intelligence (6), Machine Learning (6), Computer Vision (6), obbligatori; a scelta Reinforcement Learning (6), Neural Networks (6), Planning and Reasoning (6), Generative AI (6), Multilingual NLP (6), Elective in AI (12).

L'unico programma letto alla fonte è Machine Learning (Iocchi, 6 CFU, a.a. 2026/27), su https://sites.google.com/diag.uniroma1.it/machine-learning:
- **classificazione:** valutazione, alberi, apprendimento bayesiano, modelli lineari, SVM, kernel, classificatori multipli.
- **regressione:** lineare e logistica, kNN, percettrone, reti neurali, CNN.
- **non supervisionato:** k-means, variabili latenti ed EM.
- **rinforzo:** MDP, Q-learning.
- **testi:** Mitchell; Bishop; Murphy; Goodfellow et al.

Da fonte secondaria (estratti di ricerca, pagine non aperte): Planning and Reasoning nel 2022/23 (Liberatore) copriva linguaggi di pianificazione, ricerca euristica, pianificazione non deterministica, DPLL, tableaux, logiche modali, LTL e model checking, CSP, revisione delle credenze. Artificial Intelligence (Nardi) copriva agenti, problem solving, rappresentazione della conoscenza, pianificazione classica, partial order, GraphPlan, gerarchica.

### Politecnico di Torino, LM Computer Engineering, a.a. 2026/27

| Corso | CFU | Argomenti | Testi |
|---|---|---|---|
| Machine Learning and Pattern Recognition (Cumani). https://didattica.polito.it/pls/portal30/sviluppo.guide.visualizza?p_cod_ins=01URTYG | 6 | Probabilità e quadro bayesiano; modelli generativi e discriminativi; cross-validation; teoria delle decisioni, rapporti di verosimiglianza; PCA e LDA; classificatori gaussiani e Naive Bayes; regressione logistica; kernel e reti neurali; misture gaussiane ed EM; variabili latenti continue (PLDA, analisi fattoriale); calibrazione degli score | Bishop 2006; Murphy 2012 |
| Advanced Machine Learning (Tommasi). https://didattica.polito.it/pls/portal30/sviluppo.guide.visualizza?p_cod_ins=01URWYG | 6 | Parte 1: definizioni di IA, probabilità, teoria delle decisioni, percettrone. Parte 2: PyTorch, CNN con retropropagazione e SGD, da AlexNet a ResNet, attenzione e transformer. Parte 3: multi-task, non supervisionato e auto-supervisionato, sequenze con RNN e transformer, VAE, GAN, diffusione, 3D, apprendimento con pochi esempi. Parte 4: lettura di articoli | Goodfellow; Prince; Bishop; Murphy; Shalev-Shwartz e Ben-David |

La guida 2026/27 di Data Science and Engineering risultava in costruzione; i corsi di NLP e RL non li ho letti.

## 2. Argomenti in due o più syllabus che da noi mancano o sono appena accennati

| Argomento | Dove compare | Nostro capitolo |
|---|---|---|
| Visione classica: formazione dell'immagine, filtri, contorni, feature locali (Harris, SIFT), Hough, RANSAC, calibrazione, omografie, geometria epipolare | Bologna IPCV, Pisa CV, Padova CV; Pisa ISPR per filtri e feature | 3.10, che oggi è solo deep; o un capitolo prima di 3.4 |
| Modelli linguistici a n-grammi, e linguistica di base (morfologia, POS tagging con HMM, parsing a costituenti e a dipendenze) | Bologna NLP, Padova NLP, Pisa HLT, Polimi NLP 2018/19 | 3.11: gli n-grammi mancano, il parsing è una parola sola |
| Description logics, reti semantiche, frame | Bologna, Pisa AIF | 1.6 |
| Ragionamento temporale (Event Calculus, logiche temporali) | Bologna, Pisa AIF; Sapienza P&R da fonte secondaria | 1.6 o 1.7 |
| GraphPlan; il partial order planning come voce esplicita | Bologna, Pisa AIF; Sapienza da fonte secondaria | 1.7 |
| Apprendimento nei modelli probabilistici e variabili latenti (apprendimento bayesiano, analisi fattoriale, PLDA, classificatori generativi gaussiani) | Pisa GDL e ISPR, Pisa ML, Polito MLPR, Padova FAI; Polimi ML per famiglia esponenziale e processi gaussiani | 1.8 copre solo l'inferenza; 2.3 e 2.9 per i generativi gaussiani e l'analisi fattoriale |
| Causalità con peso proprio | Bologna modulo 3, Padova FAI, Pisa GDL | 1.8: oggi è l'ultima voce di un elenco |
| Teoria delle decisioni applicata ai classificatori e calibrazione | Polito MLPR, Pisa CV | 2.2 |
| Approssimazione della funzione valore prima delle reti profonde | Polimi ML, Padova RL, Bologna Agentic AI | tra 2.11 e 3.13: da noi l'approssimazione entra solo con DQN |
| Teoria dei giochi per sistemi multi-agente (cooperazione, coordinazione, dilemmi sociali) | Bologna Agentic AI; corsi dedicati a Polimi e Pisa, solo per nome | 4.9, forse con un richiamo in 1.4 |
| Reasoning model come classe di modelli | Padova NLP, Bologna Agentic AI | 4.1 o 4.2: in 4.5 c'è solo il ragionamento a passi come tecnica di prompt |
| Reti neurali già nel corso base di ML (percettrone, MLP) | Pisa ML, Sapienza ML, Polito MLPR, Polimi MIML 2021/22 | scelta di struttura: da noi il percettrone arriva in 3.1 |
| Matematica dedicata: differenziazione automatica, SVD, ottimizzazione numerica | Polimi Numerical Analysis for ML; Bologna e Pisa, corsi obbligatori letti solo per nome | 0.5 e 3.2. Risponde alla domanda aperta su dove si spiega l'ottimizzazione: in questi tre atenei ha un esame suo |

Sull'etica ho letto un solo syllabus (Bologna), quindi non rientra nel criterio dei due. Contiene però temi che il nostro blocco 5 non ha: responsabilità e accountability degli agenti artificiali, machine ethics, fiducia, interazione uomo-macchina e antropomorfismo, modellazione formale delle norme. Lo stesso vale per i sistemi multi-agente classici (architetture ad agenti, coordinazione, auto-organizzazione, JADE e Jason): un solo syllabus letto, ma il nostro 4.9 parte direttamente dagli agenti basati su LLM.

## 3. Nostri argomenti che nessun syllabus letto tratta

Quasi tutti i casi qui sotto sono più probabilmente un ritardo degli atenei che un nostro eccesso; fanno eccezione le voci dell'ultimo gruppo.

- **4.3 Inferenza ed efficienza:** quantizzazione, cache chiavi-valori, decodifica speculativa, distillazione. Solo Padova NLP cita "LLM inference and beam search".
- **4.4 Valutare un modello linguistico:** assente ovunque come argomento.
- **4.5 e 4.8 nei dettagli:** uscite strutturate, gestione del contesto, costi, protocolli come MCP, memoria degli agenti, modi di fallimento. Padova (prompt engineering, corso agentico) e Bologna Agentic AI toccano il tema senza questo dettaglio.
- **5.7 Produzione:** nessun syllabus letto. Esistono corsi dal nome affine (Bologna "Architecture and Platforms for AI", Polimi "Architecture of ML Systems") che non ho aperto.
- **5.4 Riservatezza:** privacy differenziale e apprendimento federato assenti; Bologna ha solo "AI and privacy" dentro l'etica.
- **5.3 Robustezza:** jailbreak, iniezione di prompt, filigrane assenti. Polimi e Padova hanno un corso "Adversarial Machine Learning", solo per nome.
- **5.5 Allineamento e controllo:** compare solo come chiusura "problemi aperti" di Bologna Agentic AI.
- **5.2:** interpretabilità meccanicistica, SHAP e LIME assenti; Bologna ha la visualizzazione delle unità (DL) e la spiegabilità (etica).
- **3.13 nel dettaglio:** TRPO, PPO, DDPG, TD3, SAC, MuZero, offline, imitazione, rinforzo inverso, dalla simulazione al reale. I syllabus si fermano a "policy gradient" e "deep RL".
- **3.12 Audio:** generazione di musica, codec neurali, riconoscimento del parlante. Bologna NLP ha solo "elementi di speech processing".
- **3.9:** flow matching, flussi normalizzanti (Pisa dice "explicit models"), metriche FID e CLIP score.
- **4.1:** leggi di scala. **5.6:** quadri di Stati Uniti e Regno Unito, schede dei modelli.
- **Voci di cui valutare il peso:** logica fuzzy (1.6); ricerca tabu, programmazione genetica, neuroevoluzione (1.3); expectiminimax e MCTS (1.4: Bologna si ferma ad alfa-beta); filtro di Kalman e a particelle (1.8: a Sapienza stanno in "Probabilistic Robotics", solo nome); clustering spettrale (2.8); kernel PCA, ICA, t-SNE, UMAP (2.9); miscela di esperti (3.6); reti di Hopfield e macchine di Boltzmann (3.8: solo le DBN a Pisa).

Trovano invece conferma: reti su grafi (Pisa ISPR e un corso a scelta), SOM (Pisa ML), regole di associazione (Bologna, Polimi MIML), PAC e dimensione VC (Polimi, Padova, Pisa), algoritmi genetici e swarm (Bologna), modelli visione-linguaggio-azione (Pisa CV), RLHF e DPO (Bologna), LoRA e RAG (Padova).

## 4. Differenze di ordine e di prerequisiti

**I processi di Markov stanno con il rinforzo.** Nessuno dei corsi di fondamenti letti (Bologna, Polimi, Pisa, Padova) contiene MDP ed equazioni di Bellman: lì ci sono ricerca, vincoli, logica, pianificazione e incertezza. Gli MDP compaiono nel corso di ML (Polimi, Sapienza) o di RL (Padova, Bologna). Il nostro 1.9 nell'IA classica è la scelta di Russell e Norvig, ma nessuno degli atenei letti la segue.

**Il rinforzo tabellare dentro il corso base di ML ha due precedenti.** Polimi dedica un terzo del corso di ML a MDP, TD, Q-learning, policy search, POMDP e banditi; Sapienza chiude con MDP e Q-learning. Questo sostiene il nostro 2.11. Padova e Bologna ne fanno un corso a parte.

**I banditi vengono prima degli MDP a Padova e a Bologna,** come in Sutton e Barto; Polimi li mette in fondo. Da noi stanno in 2.11, dopo gli MDP di 1.9. Se si vuole un'introduzione al rinforzo senza prerequisiti (come previsto per 2.1), i banditi sono l'ingresso che usano due atenei su tre.

**Il transformer viene dopo le reti ricorrenti quasi ovunque,** come nel nostro arco 3.5 → 3.6: Padova DL, Bologna NLP, Pisa ISPR. Due eccezioni: Polito AML insegna attenzione e transformer subito dopo le CNN e riprende le sequenze (RNN e transformer insieme) solo nella parte successiva; Pisa CV arriva al Vision Transformer dalle CNN senza passare dalle ricorrenti. L'arco 3.5 → 3.6 è quindi una scelta storica e didattica, non un prerequisito stretto. La scheda Polimi 2022/23 non aveva ancora il transformer.

**Embedding statici e n-grammi precedono reti ricorrenti e transformer in tutti i corsi di NLP letti** (Bologna, Pisa; Polimi mette word2vec nel corso di deep learning accanto agli autoencoder). Da noi tutto 3.11 dipende da 3.5 e 3.6, quindi word2vec e TF-IDF finiscono dopo il transformer. Conviene spezzare 3.11: una parte prima di 3.5 (testo, n-grammi, embedding statici) e i compiti dopo. Nell'elenco di Padova gli LLM compaiono prima di parsing e traduzione, ma l'ordine di una pagina Moodle non è per forza quello delle lezioni.

**Gli HMM servono al linguaggio.** Padova e Pisa li insegnano dentro il corso di NLP; Bologna nei fondamenti. Manca l'arco 1.8 → 3.11.

**I modelli probabilistici aprono il corso sui generativi a Pisa** (16 ore di apprendimento nei modelli probabilistici prima del deep learning). Il nostro 3.9 non dipende da 1.8: un arco 1.8 → 3.9 rispecchierebbe quella scelta.

**Le reti convoluzionali a Bologna si insegnano nel corso di visione,** dopo l'elaborazione classica delle immagini, in parallelo al corso di deep learning.

**Il deep RL chiude il corso di deep learning a Bologna e a Pisa (ISPR),** come il nostro 3.13.

**AI Act e IA affidabile aprono il corso di fondamenti a Bologna,** al primo semestre del primo anno; da noi sono in 5.6, in fondo. Un cenno in 1.1 costerebbe poco.

**RLHF e DPO a Bologna stanno nel corso di rinforzo e agenti,** coerente con il nostro arco 3.13 → 4.2; a Padova fine-tuning e LoRA stanno nel corso di NLP senza passare dal rinforzo.

**Pisa dà ricerca e logica classica come prerequisiti della magistrale** (si fanno alla triennale); gli altri le rifanno nel corso di fondamenti.

## 5. Come gli atenei dividono la materia

| Area | Bologna | Polimi | Pisa | Padova | Sapienza | Polito |
|---|---|---|---|---|---|---|
| Fondamenti (ricerca, logica, pianificazione, incertezza) | un corso da 12, più ottimizzazione combinatoria (6) e Knowledge Engineering a scelta | Foundations of AI (5), più Uncertainty in AI e Advanced AI Techniques | AI Fundamentals (6) | Foundations of AI (9) | Artificial Intelligence (6), Planning and Reasoning (6) a scelta | non letto |
| ML classico | ML and Data Mining (6) | Machine Learning (5), con il rinforzo | Machine Learning (9), centrato sulle reti | Machine Learning (9), molto teorico | Machine Learning (6), con reti e rinforzo | ML and Pattern Recognition (6) |
| Deep learning | Deep Learning (6) | ANN and Deep Learning (5), Deep Learning 1 e 2 | Generative and Deep Learning (9) | Deep Learning (6) | Neural Networks (6), Generative AI (6) | Advanced ML (6) |
| Linguaggio e LLM | NLP (6), obbligatorio | NLP (5) | Human Language Technologies (9) | NLP (6) | Multilingual NLP (6) | non letto |
| Rinforzo | dentro Agentic AI Systems (8, a scelta) e in coda a Deep Learning | dentro Machine Learning, più un corso Reinforcement Learning | dentro il corso sui generativi (programma ISPR 2023/24) | corso obbligatorio (6) | in coda a ML, più un corso a scelta (6) | non letto |
| Visione | due corsi (6 + 6) | Computer Vision | Computer Vision (9) | Computer Vision (9) | Computer Vision (6) | dentro Advanced ML |
| Agenti e multi-agente | Multi-Agent Systems (6, classico) e Agentic AI Systems (8, RL più LLM) | Multiagent Systems, Game Theory | Algorithmic Game Theory a scelta | Agentic AI for Information Access (6, a scelta) | nessun corso dedicato nel piano | non letto |
| Etica e regole | Ethics in AI (6), obbligatorio; AI Act anche nei fondamenti | Computer Ethics, Ethics for Technology | Social and Ethical Issues in IT, solo nome | non trovato | non trovato | non letto |

Quattro osservazioni per la nostra struttura.

1. Nessun ateneo ha un corso intitolato ai modelli linguistici. Gli LLM stanno dentro il corso di NLP (Bologna, Padova), che resta un corso di linguaggio con una parte classica consistente. Il nostro blocco 4 separato non ha precedenti tra i corsi letti; il contenuto corrispondente (pre-addestramento, fine-tuning, LoRA, RAG, prompt) nel 2025/26 a Padova è circa metà del corso di NLP.
2. Gli agenti basati su LLM stanno comparendo come corsi a scelta nuovi, e in entrambi i casi nascono da un corso preesistente: a Bologna dal corso di rinforzo (rinominato da "Autonomous and Adaptive Systems" ad "Agentic AI Systems" tra 2025/26 e 2026/27), a Padova dall'information retrieval. I sistemi multi-agente classici restano un corso distinto. Il nostro 4.9 fonde le due tradizioni che Bologna tiene separate.
3. Il rinforzo ha tre collocazioni: corso a sé (Padova), parte del corso base di ML (Polimi, Sapienza), parte del corso sugli agenti (Bologna). La nostra scelta di distribuirlo è più vicina a Polimi e Sapienza; nessun ateneo lo spezza su più di due corsi.
4. I corsi sono piccoli, 5 o 6 CFU quasi ovunque, e la visione è sempre un corso a sé con una parte classica. Questo conferma la stima della bozza che 3.10 non entra nel corso di deep learning.

## Limiti della ricerca

- **Sapienza:** letto un solo programma (Machine Learning); il resto è piano di studi o fonte secondaria.
- **Polimi:** le schede aperte sono del 2022/23 (NLP del 2018/19), quindi non riflettono LLM e transformer nei corsi attuali; Reinforcement Learning, Multiagent Systems e il corso di NLP di Carman non li ho letti.
- **Pisa:** fonti dal 2017/18 al 2026/27; il programma corrente di AI Fundamentals non l'ho letto.
- **Padova:** descrizioni brevi del corso di studi, non le schede ufficiali.
- **Polito:** due soli corsi.
- **Corsi di etica:** letto solo quello di Bologna (edizione 2025/26).
