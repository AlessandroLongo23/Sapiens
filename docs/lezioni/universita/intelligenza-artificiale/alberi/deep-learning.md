# Albero delle lezioni: Deep learning (università)

Fonte dell'albero di `content_nodes` per la materia `deep-learning` sotto `university`. Viene dal blocco 3 di
`vault/Contenuti/Programma di intelligenza artificiale.md` (6 ottobre 2026): i capitoli sono quelli del programma, le
lezioni sono una prima divisione degli argomenti di ogni capitolo, da rivedere quando il capitolo si scrive. Si applica
con `scripts/lezioni/tree.mts --level university --subject deep-learning --title "Deep learning" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.

## dl-neurone-rete | Dal neurone alla rete
- dl-percettrone | Il percettrone
- dl-reti-piu-strati | Reti a più strati
- dl-funzioni-attivazione | Funzioni di attivazione
- dl-approssimazione-universale | Approssimazione universale e profondità

## dl-retropropagazione | Retropropagazione
- dl-grafo-calcolo | Il grafo di calcolo
- dl-backpropagation | La retropropagazione dell'errore
- dl-differenziazione-automatica | Differenziazione automatica
- dl-piccolo-framework | Un piccolo framework scritto a mano

## dl-addestrare | Addestrare una rete
- dl-perdite | Funzioni di perdita per le reti
- dl-ottimizzatori | Ottimizzatori: SGD, momento, Adam
- dl-tasso-apprendimento | Piani del tasso di apprendimento
- dl-inizializzazione | Inizializzazione dei pesi e gradienti che svaniscono
- dl-regolarizzazione | Regolarizzazione: decadimento dei pesi e dropout
- dl-normalizzazione | Normalizzazione per batch e per strato
- dl-pytorch | PyTorch e JAX
- dl-diagnosi | Diagnosi di una rete che non impara
- dl-generalizzazione | Generalizzazione delle reti e doppia discesa
- dl-addestramento-scala | Addestramento su più GPU

## dl-cnn | Reti convoluzionali
- dl-convoluzione | Convoluzione e pooling
- dl-lenet-alexnet | Da LeNet ad AlexNet
- dl-vgg-inception | VGG e Inception
- dl-resnet | ResNet e le connessioni residue
- dl-transfer-learning | Trasferimento dell'apprendimento

## dl-rnn | Reti ricorrenti
- dl-rete-ricorrente | La rete ricorrente e la retropropagazione nel tempo
- dl-lstm-gru | LSTM e GRU
- dl-rnn-bidirezionali | Reti ricorrenti bidirezionali e profonde
- dl-seq2seq | Modelli da sequenza a sequenza
- dl-spazio-stato | Modelli a spazio di stato

## dl-transformer | Attenzione e transformer
- dl-attenzione | Il meccanismo di attenzione
- dl-auto-attenzione | Auto-attenzione e attenzione a più teste
- dl-codifica-posizionale | Codifica posizionale
- dl-encoder-decoder | Il transformer: encoder e decoder
- dl-varianti-attenzione | Varianti dell'attenzione
- dl-miscela-esperti | Miscela di esperti

## dl-gnn | Reti su grafi
- dl-grafi-dati | Grafi come dati
- dl-scambio-messaggi | Lo scambio di messaggi
- dl-gcn-sage-gat | GCN, GraphSAGE e GAT
- dl-compiti-grafi | Compiti su nodi, archi e grafi

## dl-rappresentazioni | Imparare rappresentazioni
- dl-autoencoder | Autoencoder
- dl-auto-supervisionato | Apprendimento auto-supervisionato e contrastivo
- dl-embedding | Embedding
- dl-hopfield-boltzmann | Reti di Hopfield e macchine di Boltzmann

## dl-generativi | Modelli generativi
- dl-mappa-generativi | Una mappa dei modelli generativi
- dl-vae | Autoencoder variazionali
- dl-gan | Reti generative avversarie
- dl-flussi-normalizzanti | Flussi normalizzanti
- dl-diffusione | Modelli a diffusione
- dl-diffusione-latente | Diffusione latente e condizionamento
- dl-flow-matching | Flow matching
- dl-autoregressivi | Modelli autoregressivi
- dl-valutazione-generativi | Valutare un modello generativo

## dl-visione | Visione artificiale
- dl-visione-classica | Formazione dell'immagine, filtri e caratteristiche locali
- dl-geometria-visione | Calibrazione della camera e geometria a due viste
- dl-classificazione-immagini | Classificazione di immagini
- dl-rilevamento-oggetti | Rilevamento di oggetti
- dl-segmentazione | Segmentazione semantica e per istanza
- dl-vit | Vision Transformer
- dl-clip | Immagini e testo insieme: CLIP
- dl-ocr | Riconoscimento del testo e dei documenti
- dl-posa-profondita | Stima della posa e della profondità
- dl-video-tracciamento | Video e tracciamento
- dl-visione-3d | Visione in tre dimensioni: NeRF e Gaussian splatting

## dl-nlp | Elaborazione del linguaggio naturale
- dl-preparazione-testo | Preparazione del testo, bag of words e TF-IDF
- dl-n-grammi | Modelli linguistici a n-grammi
- dl-analisi-sintattica | Analisi morfologica e sintattica
- dl-word2vec | Vettori di parole: word2vec, GloVe, fastText
- dl-sottoparole | Tokenizzazione in sottoparole
- dl-classificazione-testo | Classificazione del testo ed estrazione di entità
- dl-traduzione-riassunto | Traduzione e riassunto
- dl-domande-inferenza | Risposta a domande e inferenza testuale
- dl-recupero-informazione | Recupero dell'informazione
- dl-modelli-argomenti | Modelli di argomenti

## dl-audio | Parlato e audio
- dl-segnale-audio | Il segnale audio e la trasformata di Fourier
- dl-spettrogrammi | Spettrogrammi e caratteristiche mel
- dl-classificazione-audio | Classificazione dell'audio
- dl-riconoscimento-parlato | Riconoscimento del parlato
- dl-riconoscimento-parlante | Riconoscimento del parlante
- dl-sintesi-vocale | Sintesi vocale
- dl-musica-codec | Generazione di musica e codec neurali

## dl-rinforzo | Apprendimento per rinforzo con le reti
- dl-dqn | Approssimazione di funzioni e DQN
- dl-reinforce | Gradiente della politica: REINFORCE
- dl-attore-critico | Metodi attore-critico
- dl-ppo | TRPO e PPO
- dl-controllo-continuo | Controllo continuo: DDPG, TD3, SAC
- dl-alphazero | Metodi basati su un modello: da AlphaGo a MuZero
- dl-modelli-mondo | Modelli del mondo
- dl-offline-imitazione | Apprendimento offline e per imitazione
- dl-sim-reale | Dalla simulazione al mondo reale
