# Confronto della bozza con i syllabus di atenei esteri

Consultazione del 5 ottobre 2026. Ho letto 17 pagine di corso in 6 atenei e non ho modificato nessun file del repository. I titoli delle lezioni sono quelli delle pagine; non ho aperto slide o video, quindi un sottoargomento che non compare in un titolo può comunque essere trattato a lezione.

## 1. Corsi letti

Pagine non lette o lette solo in parte:

- **CS229:** la pagina attuale (Summer 2026) rimanda a un foglio dietro login Stanford. L'unico elenco pubblico è quello di Spring 2019, che uso come fonte vecchia.
- **CS182 Berkeley:** la pagina fa25 chiede il login CalNet, non letta.
- **CS221:** non ho aperto i moduli, solo il calendario.
- **MIT 6.390:** la pagina Fall 2025 è chiusa; ho letto calendario Fall 2026 e dispense pubbliche.

### Stanford

| Corso | Periodo | URL | Lezioni | Testi |
|---|---|---|---|---|
| CS221 Artificial Intelligence: Principles and Techniques | Autumn 2025 | https://stanford-cs221.github.io/autumn2025/ | Overview; Learning I-III; Search I-II; MDPs I-III; Games I-II; Bayesian Networks I-III; Logic I-II; Language Models [New]; AI & Society [New]; AI Supply Chains [New]; Conclusion | Nessuno obbligatorio. Facoltativi: Russell e Norvig; Koller e Friedman; Sutton e Barto; Hastie, Tibshirani e Friedman |
| CS229 Machine Learning | Spring 2019 | https://cs229.stanford.edu/syllabus-autumn2018.html | Regressione lineare; logistica, Newton, percettrone, GLM; GDA e Naive Bayes; SVM e kernel; bias-varianza, regolarizzazione; tree ensembles; Neural Networks: Basics; Neural Networks: Training; consigli pratici; k-means, GMM, EM; factor analysis; PCA, ICA; MDP e Bellman; value/policy iteration, LQR, LQG; Q-learning; policy search, REINFORCE, POMDP | Dispense del corso |
| CS231n Deep Learning for Computer Vision | Spring 2026 | https://cs231n.stanford.edu/schedule.html | 1 Intro; 2 Linear classifiers (kNN, softmax); 3 Regularization and Optimization (SGD, momentum, AdaGrad, Adam); 4 Neural Networks and Backpropagation; 5 CNNs; 6 CNN Architectures (batch norm, transfer learning, AlexNet, VGG, ResNet); 7 RNN (LSTM, GRU, seq2seq); 8 Attention and Transformers; 9 Detection, Segmentation, Visualizing (anche adversarial examples); 10 Video; 11 Large Scale Distributed Training; 12 Self-supervised; 13 Generative 1 (VAE, GAN, autoregressivi); 14 Generative 2 (diffusione); 15 3D Vision; 16 Vision and Language; 17 World Modeling; 18 Human-Centered AI | Nessuno; dispense cs231n.github.io |
| CS224n NLP with Deep Learning | Winter 2026 | https://web.stanford.edu/class/cs224n/ | History of NLP; Word Vectors; Backpropagation and Neural Network Basics; Language Models and RNNs; Transformers; Pretraining (Scaling, Systems, Data); Post-training (RLHF, SFT, DPO); Efficient Adaptation (Prompting + PEFT); Agents, Tool Use, and RAG; Benchmarking and Evaluation; Reasoning 1-2; Tokenization and Multilinguality; Interpretability; Social and Broader Impacts; Multimodality; LoRA; Open Questions | Jurafsky e Martin; Eisenstein; Goldberg; Goodfellow, Bengio e Courville |
| CS234 Reinforcement Learning | Winter 2026 | https://web.stanford.edu/class/cs234/ | Intro; Tabular MDP Planning; Policy Evaluation; Q-learning and function approximation; Policy Search (2); Offline RL e Imitation Learning; Offline RL e RLHF; Offline RL / Bandits; Exploration (3); RL and MCTS; guest; Alignment, Impacts | Sutton e Barto, 2ª ed. |
| CS336 Language Modeling from Scratch | Spring 2026 | https://cs336.stanford.edu/ | 1 Overview, tokenization; 2 PyTorch, resource accounting; 3 Architectures, hyperparameters; 4 Attention alternatives and mixture of experts; 5 GPUs, TPUs; 6 Kernels, Triton; 7-8 Parallelism; 9 e 11 Scaling laws; 10 Inference; 12 Evaluation; 13-14 Data; 15 Mid/post-training (SFT/RLHF); 16 Post-training RLVR; 17 Alignment, multimodality; 18-19 guest. Cinque compiti: Basics, Systems, Scaling, Data, Alignment and Reasoning RL | Nessuno |
| CS120 Introduction to AI Safety | Fall 2025 | https://web.stanford.edu/class/cs120/ | What Does Safe AI Mean; Reward Functions, Alignment, and Human Preferences; Encoding Human Preferences; Validation of AI Systems; Impact of Data; Social-Choice Theory; AI and Mental Health; Red Teaming, Adversarial Vulnerabilities, and Multi-Agent Systems; Interpretability; Formal Methods / Safe Human-AI Interaction; Jailbreaks; Evaluating AI Systems / AI Governance; Scalable Oversight | Articoli |

### UC Berkeley

| Corso | Periodo | URL | Lezioni | Testi |
|---|---|---|---|---|
| CS188 Introduction to AI | Fall 2025 | https://inst.eecs.berkeley.edu/~cs188/fa25/ | Intro; Uninformed Search; A* and Heuristics; CSPs I-II; Game Trees I-II; MDPs I-II; RL I-II; Probability; Bayes Nets (Representation, Independence, Inference, Sampling); Decision Networks and VPI; HMMs; Particle Filtering; ML I Naive Bayes; ML II Perceptrons; ML III Neural Networks; ML IV Applications and Decision Trees; ML V Transformers; AI for Healthcare; AI for Equality | Russell e Norvig (capitoli scelti) e il testo del corso, https://inst.eecs.berkeley.edu/~cs188/textbook/ (ha anche un capitolo 10 Logic senza lezione in calendario) |
| CS189/289A Intro to Machine Learning | Spring 2026 | https://eecs189.org/sp26/ | 1-3 Intro, strumenti, terminologia; 4 Clustering; 5-7 MLE, gaussiane, misture; 7-10 regressione lineare e regolarizzazione; 11 Classification; 12 Logistic regression, ROC; 13 e 15 SGD, momentum, Adam; 14 MLE, MAP, bias-varianza; 16 Entropy; 17 Neural Networks, Why We Need Depth, Universal Approximation, Activation Functions; 18 Backpropagation; 19 Backprop (cont.) e CNN; 20 CNN; 21-22 Transformers; 23 LLM Training and Applications; 24 Self-Supervised Learning; 25 AI for Protein Engineering; 26 guest su Agents; 27 LLMs, Agents, Environments | Bishop e Bishop, Deep Learning: Foundations and Concepts, 2024 (obbligatorio) |
| CS185/285 Deep Reinforcement Learning | Spring 2026 | https://rail.eecs.berkeley.edu/deeprlcourse/ | Intro; Behavioral Cloning (2); RL Basics; Policy Gradients; Actor Critic; Value-Based RL; Q-learning in Practice; Advanced Policy Gradients (2); Variational Inference; VI in RL; Control as Inference; LLM RL; Model-Based RL (2); Offline RL (2); Exploration; RL Theory; Advanced Exploration; Multi-task RL; Challenges | Non indicati nella pagina |
| Agentic AI (seminario di Dawn Song) | Fall 2025 | https://rdi.berkeley.edu/agentic-ai/f25 | LLM Agents Overview; system design; Post-Training Verifiable Agents; Agent Evaluation; Training Agentic Models; Multi-Agent AI (Noam Brown); Predictable Noise in LLM; Agents for Scientific Discovery; Deploying Real-World Agents; Multi-Agent Systems in the Era of LLMs (Oriol Vinyals); Embodiment (Peter Stone); Agentic AI Safety and Security | Articoli. Prerequisiti consigliati: CS182, CS188, CS189 |

### MIT

| Corso | Periodo | URL | Lezioni | Testi |
|---|---|---|---|---|
| 6.390 Introduction to Machine Learning | Fall 2026 | https://introml.mit.edu/fall26/calendar e https://introml.mit.edu/notes/ | 2 Regression and Regularization; 3 Gradient Descent; 4 Linear Classification; 5 Features and Neural Networks I; 6 Neural Networks II; 7 CNN; 8 Representation Learning; 9 Transformers; 10 MDP; 11 Reinforcement Learning; 12 Non-parametric Models | Dispense del corso (CC BY-NC-SA 4.0) |
| 6.7960 Deep Learning | Fall 2026 | https://deeplearning6-7960.github.io/ | Intro; How to train a neural net; Approximation theory; ConvNets; Sequence Modeling; Transformers; Generalization Theory; Going Deep; Representation Learning (3); Foundation models: pre-training, scaling laws; Generative models: basics, VAE and GAN, Diffusion and Flows; Generalization (OOD); Transfer learning; Inference-time Algorithms; Evaluation; Applying DL. Due tutorial di "Agentic Coding" | Letture per lezione; dalla pagina 2024: Foundations of Computer Vision e Understanding Deep Learning. Prerequisiti: 18.05 e 6.390 o equivalente |
| 6.S191 Introduction to Deep Learning | 2026 | https://introtodeeplearning.com/ | Intro to DL; Deep Sequence Modeling; Deep Computer Vision; Deep Generative Modeling; Deep RL; New Frontiers; The Three Laws of AI; AI for Science; Massively Parallel Training | Nessuno |

La pagina 2024 di 6.7960 (https://phillipi.github.io/6.7960/) aveva anche "Architectures: Graphs", assente nel 2026.

### Carnegie Mellon

| Corso | Periodo | URL | Lezioni | Testi |
|---|---|---|---|---|
| 10-301/601 Introduction to Machine Learning | Spring 2026 | https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html | Overview; Function Approximation; Decision Trees (2); kNN and Model Selection; Perceptron; Linear Regression; Optimization; SGD / Logistic Regression; Feature Engineering / Regularization; Neural Networks; Backpropagation I-II; Societal Impacts; PAC learning (2); MLE e MAP; CNNs and RNNs; RNN-LMs and Transformer-LMs; Transformers, AutoDiff, Pre-training, Fine-Tuning; In-context Learning / MDPs; Value/Policy Iteration; Policy Gradient / Deep RL; Recommender Systems; Boosting and Bagging; K-Means / PCA; Coding Agents / Significance Testing; Generative Models for Vision | Murphy 2014; Goodfellow, Bengio e Courville 2016; Daumé, CIML |
| 11-785 Introduction to Deep Learning | Spring 2026 | https://deeplearning.cs.cmu.edu/S26/index.html | 1 Introduction; 2 Neural Nets as Universal Approximators; 3-8 Training I-VI; 9-12 CNN I-IV; 13-14 RNN I-II; 15-16 Seq2seq e CTC; 17 Language Models, Translation; 18 Attention, Transformers; 19 Transformers and Newer Architectures; 20 LLM; 21 Autoencoders; 22 VAE; 23 Diffusion; 24 GAN; 25 GNN; 26 RL; 27 Hopfield Networks; 28 Boltzmann Machines | Facoltativi: Dive into Deep Learning; Goodfellow; Nielsen; Rumelhart e McClelland, PDP |
| 11-766 Large Language Model Applications (già 11-667) | Spring 2026 | https://cmu-llms.org/schedule/ | Origins of LLMs; NLU vs generation; science of prompting; when to finetune; embeddings; Retrieval 1-3 (RAG, deep research); Task-Oriented Dialogue; Tool-use, personas; writing assistants; LLMs for evaluation (dati sintetici, AI-as-judge); Multi-agent systems; Harms; Attacking LLMs; Code-writing assistants; immagini; lingue non inglesi; World models; biologia; musica; Numbers; Robots and embodied AI; Deployment | Articoli |

### Europa

| Corso | Periodo | URL | Lezioni | Testi |
|---|---|---|---|---|
| Cambridge, Artificial Intelligence (Part IB) | 2025-26 | https://www.cl.cam.ac.uk/teaching/2526/ArtInt/ | 12 lezioni: Introduction; Search I-II (A*, IDA*, ricerca locale); Game-playing; CSP; Backjumping; Knowledge representation I (reti semantiche, frame, regole, concatenazione) e II (primo ordine, frame problem, situation calculus); Planning I (STRIPS, ordine parziale) e II (GRAPHPLAN, pianificazione come SAT e come CSP); Neural Networks I (percettrone, discesa del gradiente) e II (percettroni multistrato, retropropagazione) | Russell e Norvig, 3ª ed.; Poole e Mackworth; Bishop 2006 |
| Edimburgo, INF2D Reasoning and Agents | pagina corrente, anno non indicato | https://opencourse.inf.ed.ac.uk/inf2d/course-materials | Settimane: 1 agenti, ricerca; 2 ricerca informata, vincoli, ricerca con avversario; 3 agenti logici; 4 primo ordine, unificazione, risoluzione; 5 risoluzione, situation calculus; 6 Symbolic Planning (PDDL); 7 Uncertainty and Rationality; 8 Probabilistic Inference; 9 Inference over Time; 10 Rational Decision Making | Russell e Norvig secondo la pagina del corso (non ho aperto la lista risorse) |

## 2. Argomenti in due o più syllabus, assenti o deboli nella bozza

| Argomento | Dove compare | Nostro capitolo |
|---|---|---|
| Esplorazione nel rinforzo oltre i banditi | CS234 (3 lezioni), CS285 (2), testo CS188 (5.4) | 2.11 e 3.13 |
| Rinforzo sui modelli linguistici con ricompensa verificabile e modelli "che ragionano" | CS336 (RLVR e compito 5), CS224n (Reasoning 1-2), CS285 (LLM RL) | 4.2, oggi fermo a RLHF e DPO |
| Addestramento su larga scala: GPU, parallelismo, conteggio delle risorse | CS336 (lezioni 2, 5-8), CS231n (11), 6.S191 (9), CS224n (Pretraining) | manca; 3.3 o 4.1 |
| Teoria della generalizzazione delle reti (sovraparametrizzazione, double descent) | 6.7960, CS189 (lettura 9.3.2) | 2.2 ha solo PAC e VC; aggiungere in 3.3 |
| Perché serve la profondità | CS189 (17), 11-785 (2), 6.7960 (Approximation theory) | 3.1, accanto al teorema di approssimazione universale |
| Situation calculus e frame problem | Cambridge, Edimburgo | 1.6 o 1.7 |
| Modelli del mondo | CS231n (17), 11-766 | 3.13 (metodi basati su un modello) o 4.10 |
| Agenti che scrivono codice | 10-301, 11-766, tutorial 6.7960 | 4.8 |
| Valutazione degli agenti e statistica delle valutazioni (barre d'errore, test di significatività) | Agentic AI Berkeley (2 lezioni), 10-301 | 4.4 e 4.8 |
| Dati sintetici | CS336 (14), 11-766 | 4.1 o 4.4 |
| Multilinguismo e lingue diverse dall'inglese | CS224n, 11-766 | 4.1; per un corso in italiano pesa |
| Inferenza variazionale come strumento generale | CS285 (3 lezioni), lezioni sui VAE altrove | 0.3 o 3.9 |
| Lezioni di applicazione (sanità, proteine, scienza) | CS188, CS189, 6.S191, 11-766 | nessuno; al più esempi in 5.8 |
| Lezione sull'impatto sociale dentro ogni corso tecnico | CS221, CS188, CS231n, CS224n, CS234, 10-301 | scelta di struttura, vedi sezione 5 |

In un solo syllabus: reti di decisione e valore dell'informazione perfetta (CS188), CTC (11-785, due lezioni), GRAPHPLAN e backjumping (Cambridge), dialogo orientato al compito (11-766), POMDP, LQR e factor analysis (CS229 2019).

## 3. Nostri argomenti che nessun syllabus letto tratta

- **1.3:** algoritmi genetici, strategie evolutive, sciami, colonie di formiche, ricerca tabu. La ricerca locale semplice c'è a Cambridge e nel testo di CS188.
- **1.6:** logica fuzzy, ragionamento non monotono, sistemi esperti, ontologie e grafi di conoscenza.
- **1.7 e 1.8:** reti gerarchiche di compiti; campi di Markov, filtro di Kalman, inferenza causale (potrebbero stare nella settimana 9 di Edimburgo, non verificato).
- **2.6:** SVM e kernel compaiono solo in CS229 2019. Mancano dagli elenchi 2026 di CS189, 10-301 e 6.390. Processi gaussiani e regressione a vettori di supporto non compaiono mai.
- **2.8-2.10:** clustering gerarchico, DBSCAN, spettrale; kernel PCA, t-SNE, UMAP, mappe auto-organizzanti; anomalie, regole di associazione, serie storiche. ICA solo in CS229 2019.
- **2.2:** dimensione VC e "no free lunch" come titolo di lezione (PAC c'è in 10-301; "no free lunch" è una lettura di CS189).
- **3.12:** parlato e audio non hanno un corso tra quelli letti.
- **4.3:** quantizzazione, decodifica speculativa e distillazione non compaiono nei titoli (CS336 ha una lezione "Inference").
- **4.9:** rinforzo con più agenti (MADDPG, QMIX, MAPPO).
- **4.10:** robotica solo in lezioni ospiti (11-766, Agentic AI).
- **5.4, 5.6, 5.7:** privacy differenziale e apprendimento federato; AI Act (CS120 ha mezza lezione di governance); produzione (una lezione "Deployment" in 11-766).

Reti di Hopfield e macchine di Boltzmann (3.8) stanno solo in 11-785; le reti su grafi (3.7) in 11-785 e in 6.7960 2024.

## 4. Differenze di ordine e di prerequisiti

- **Transformer e reti ricorrenti:** CS231n, CS224n, 11-785, 6.7960 e 10-301 mettono le ricorrenti subito prima. 6.390 e CS189 2026 passano dalle convoluzionali ai transformer senza ricorrenti, e così CS188. L'arco 3.5 → 3.6 è quindi una scelta didattica: 3.6 può dipendere da 3.3, con seq2seq come motivazione.
- **Processi decisionali di Markov:** stanno nel corso di IA (CS221 dopo la ricerca, CS188 dopo i giochi), tornano in quello di ML (6.390, 10-301, CS229) e aprono quello di rinforzo (CS234 lezione 2). Ovunque il rinforzo tabellare segue subito nello stesso corso. La bozza li separa in due corsi (1.9 e 2.11).
- **Reti bayesiane:** CS188 e CS221 le mettono dopo MDP e giochi. Edimburgo fa logica, pianificazione, incertezza, decisioni, cioè l'ordine della bozza. In CS188 Naive Bayes fa da ponte tra reti bayesiane e ML.
- **Logica e pianificazione:** in CS221 la logica è in fondo (2 lezioni); nel calendario di CS188 Fall 2025 non c'è. La pianificazione simbolica compare solo a Cambridge ed Edimburgo.
- **Arco B1 → B2:** CS221 apre con tre lezioni di apprendimento prima della ricerca. Nessun corso di ML letto parte da argomenti di IA classica.
- **Percettrone:** in 10-301 (lezione 6), CS229 e CS188 è un algoritmo di ML, prima o accanto alla regressione logistica e molte lezioni prima delle reti. La bozza lo mette in 3.1.
- **Ottimizzatori:** CS231n (lezione 3) e CS189 (13 e 15) insegnano momentum e Adam sui modelli lineari, prima delle reti. 11-785 li mette dopo la retropropagazione, come la bozza.
- **Vettori di parole:** in CS224n vengono prima di reti, ricorrenti e transformer. Il nostro 3.11 chiede 3.5 e 3.6 e contiene word2vec e TF-IDF, che il grafo spinge quindi dopo il transformer: conviene spostarli (3.8 o un capitolo prima di 3.5).
- **Alberi e insiemi:** 10-301 apre con gli alberi e chiude con boosting e bagging; CS189 2026 non li ha.
- **RLHF:** CS234 lo tratta dentro il rinforzo offline, CS224n e CS336 nel post-addestramento. L'arco 3.13 → 4.2 regge.

## 5. Come gli atenei dividono la materia

| Area | Dove sta |
|---|---|
| IA classica | Un corso (CS221, CS188, INF2D, Cambridge). I due americani contengono anche ML, MDP e una lezione sui modelli linguistici |
| Machine learning | Un corso (CS229, CS189, 6.390, 10-301). Nel 2026 metà di ciascuno è deep learning; CS189 adotta un testo di deep learning |
| Deep learning | Un corso generale (11-785, 6.7960) o agganciato a un campo (CS231n, CS224n) |
| Apprendimento per rinforzo | Corso proprio (CS234, CS285), più 2-3 lezioni nei corsi di IA e ML e una in quelli di deep learning (11-785, 6.S191) |
| Modelli linguistici | Dentro il corso di linguaggio (CS224n è ormai quasi tutto LLM), un corso "da zero" (CS336), uno di applicazioni (11-766), e 1-3 lezioni altrove |
| Agenti LLM | Nessun corso di fondamenti. Una lezione in CS224n, due in CS189, un tema speciale in 10-301, alcune in 11-766, un seminario a lezioni ospiti a Berkeley |
| Sistemi multi-agente | Lezioni singole (11-766, due ospiti a Berkeley, mezza in CS120). La parte classica è la ricerca con avversario |
| Etica e sicurezza | Una lezione dentro quasi ogni corso tecnico, più un corso dedicato (CS120) |
| Visione | Corso proprio (CS231n) |

Tre conseguenze per la bozza:

- CS336 (costruire) e 11-766 (usare) corrispondono al taglio 4.1-4.4 contro 4.5-4.9.
- "Agenti" come mezzo corso è coerente con l'offerta.
- Oltre al blocco 5 separato, conviene una lezione di impatto dentro ciascun corso.

## 6. Il capitolo sulle reti neurali di base

| Corso | Lezioni | Percorso | Letture |
|---|---|---|---|
| 11-785 | 5 per 3.1 e 3.2, altre 3 per 3.3 | Storia; reti come approssimatori universali; il problema dell'apprendimento e la regola del percettrone; discesa del gradiente; retropropagazione | McCulloch e Pitts; Rosenblatt; Hebb; complessità dei circuiti booleani; convergenza del percettrone; Widrow e Lehr 1992; Werbos 1990; Rumelhart, Hinton e Williams 1986 |
| 10-301 | 1 (percettrone, lezione 6) più 3 (lezioni 11-13) | Percettrone tra kNN e regressione; poi Neural Networks, Backpropagation I e II (la seconda su numpy e debugging) | Goodfellow 6.1-6.4 e 6.5; "Matrix Calculus for 10-301/601" |
| CS189 | 2 e mezza | Reti, profondità, approssimazione universale, attivazioni; retropropagazione; inizializzazione e batch norm con le convoluzionali | Bishop e Bishop 6.1-6.3 e 8 |
| 6.390 | 2 | Features and Neural Networks I; Neural Networks II. Dispense cap. 6: elemento base, uno strato, molti strati, attivazioni, perdita, retropropagazione (un neurone, poi uno strato nascosto, poi il caso generale) | Dispense cap. 5 e 6 |
| 6.7960 | 3 | Introduzione; How to train a neural net; Approximation theory, con demo interattiva | "Gradient-Based Learning" e "Backprop" |
| CS231n | 1, dopo 2 su classificatori lineari e ottimizzazione | Classificatore lineare di immagini, poi percettrone multistrato e retropropagazione sul grafo di calcolo | Dispense cs231n.github.io (neural-networks-1, optimization-2) |
| CS224n | 1 | Backpropagation and Neural Network Basics, dopo i vettori di parole | Note di calcolo matriciale; dispense CS231n; Rumelhart 1986; "Yes you should understand backprop" |
| CS188 | 2 | ML II Perceptrons; ML III Neural Networks | Testo del corso 9.3-9.9 |
| Cambridge | 2 | Percettrone e discesa del gradiente; multistrato e retropropagazione | Bishop 2006 |
| CS229 (2019) | 2 | Basics; Training | Dispense "Deep learning" e "Backpropagation" |

Osservazioni:

- **XOR:** l'ho trovato scritto solo nelle dispense di 6.390, capitolo 5 (https://introml.mit.edu/notes/feature_representation.html), dove è il dataset non separabile risolto con caratteristiche polinomiali, prima delle reti. Non compare nei titoli degli altri corsi né nelle dispense CS231n scaricate. Le slide non le ho aperte.
- **Sequenza comune:** classificatore lineare o percettrone, limite della separabilità lineare, caratteristiche non lineari scelte a mano, rete che le impara, attivazioni, approssimazione universale, discesa del gradiente, retropropagazione dal neurone singolo al caso generale.
- **Storia:** solo 11-785 apre con le fonti originali, ed è la più vicina alla nostra impostazione.
- **Misura:** da 1 a 5 lezioni in aula per 3.1 più 3.2; il valore tipico è 2 o 3.
- **Conseguenza per la bozza:** la regola del percettrone può stare in 2.3 e 3.1 può partire dal suo limite. Il passaggio per le caratteristiche scelte a mano è il ponte usato da 6.390, 10-301 e CS189.
- **Letture adottate:** Goodfellow cap. 6, Bishop e Bishop cap. 6 e 8, dispense 6.390 cap. 5-6, dispense CS231n, Rumelhart, Hinton e Williams 1986, Nielsen.

I connettori Dovetail e figma chiedono un'autorizzazione che in questa sessione non posso avviare (dalle impostazioni dei connettori di claude.ai o con `/mcp`); qui non sono serviti.
