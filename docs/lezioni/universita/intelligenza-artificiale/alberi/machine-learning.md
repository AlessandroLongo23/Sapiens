# Albero delle lezioni: Machine learning (università)

Fonte dell'albero di `content_nodes` per la materia `machine-learning` sotto `university`. Viene dal blocco 2 di
`vault/Contenuti/Programma di intelligenza artificiale.md` (6 ottobre 2026): i capitoli sono quelli del programma, le
lezioni sono una prima divisione degli argomenti di ogni capitolo, da rivedere quando il capitolo si scrive. Si applica
con `scripts/lezioni/tree.mts --level university --subject machine-learning --title "Machine learning" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.

## ml-imparare-dai-dati | Imparare dai dati
- ml-regole-o-dati | Regole scritte e regole imparate
- ml-tipi-apprendimento | Apprendimento supervisionato, non supervisionato e per rinforzo
- ml-classificazione-regressione | Classificazione e regressione
- ml-funzioni-perdita | Funzioni di perdita
- ml-quando-non-serve | Quando non usare l'apprendimento automatico

## ml-valutare | Valutare e generalizzare
- ml-addestramento-test | Insiemi di addestramento, validazione e test
- ml-convalida-incrociata | Convalida incrociata
- ml-sovradattamento | Sottoadattamento e sovradattamento
- ml-bias-varianza | Il compromesso tra distorsione e varianza
- ml-regolarizzazione | Regolarizzazione
- ml-metriche-classificazione | Metriche di classificazione: precisione, richiamo, ROC
- ml-calibrazione | Calibrazione delle probabilità
- ml-confronto-modelli | Confronto statistico tra modelli
- ml-pac-vc | Apprendimento PAC e dimensione di Vapnik-Chervonenkis

## ml-modelli-lineari | Modelli lineari
- ml-regressione-lineare | Regressione lineare e minimi quadrati
- ml-discesa-gradiente | Regressione con la discesa del gradiente
- ml-ridge-lasso | Ridge, lasso ed elastic net
- ml-regressione-polinomiale | Regressione polinomiale e funzioni di base
- ml-regressione-logistica | Regressione logistica
- ml-softmax | Classificazione a più classi: softmax
- ml-analisi-discriminante | Analisi discriminante e classificatori gaussiani

## ml-vicini-bayes | Vicini più prossimi e Naive Bayes
- ml-knn | k vicini più prossimi
- ml-maledizione-dimensionalita | La maledizione della dimensionalità
- ml-naive-bayes | Naive Bayes

## ml-alberi-insieme | Alberi e metodi d'insieme
- ml-alberi-decisione | Alberi di decisione
- ml-entropia-gini | Entropia, indice di Gini e potatura
- ml-bagging-foreste | Bagging e foreste casuali
- ml-adaboost | AdaBoost
- ml-gradient-boosting | Gradient boosting e XGBoost
- ml-stacking | Stacking e voto

## ml-svm-kernel | Macchine a vettori di supporto e metodi a kernel
- ml-margine-massimo | Il classificatore a margine massimo
- ml-margine-morbido | Margine morbido e hinge loss
- ml-duale-kernel | Formulazione duale e trucco del kernel
- ml-svr | Regressione a vettori di supporto
- ml-processi-gaussiani | Processi gaussiani

## ml-preparare-dati | Preparare i dati e scegliere un modello
- ml-pulizia-codifica | Pulizia, codifica e normalizzazione dei dati
- ml-caratteristiche | Costruzione e selezione delle caratteristiche
- ml-iperparametri | Ricerca degli iperparametri
- ml-apprendimento-attivo | Apprendimento attivo e qualità delle etichette
- ml-dati-sbilanciati | Dati sbilanciati
- ml-pipeline | Pipeline di addestramento

## ml-clustering | Clustering
- ml-k-means | k-means
- ml-scelta-k | Scegliere il numero di cluster
- ml-clustering-gerarchico | Clustering gerarchico
- ml-dbscan | DBSCAN
- ml-misture-gaussiane | Misture gaussiane e algoritmo EM
- ml-clustering-spettrale | Clustering spettrale
- ml-stima-densita | Stima di densità a kernel

## ml-riduzione-dimensionalita | Riduzione della dimensionalità
- ml-pca | Analisi delle componenti principali
- ml-kernel-pca | PCA con kernel e analisi fattoriale
- ml-ica-nmf | Componenti indipendenti e fattorizzazione non negativa
- ml-tsne-umap | t-SNE e UMAP
- ml-som | Mappe auto-organizzanti

## ml-altri-compiti | Altri compiti
- ml-anomalie | Rilevamento di anomalie
- ml-regole-associazione | Regole di associazione
- ml-raccomandazione | Sistemi di raccomandazione
- ml-serie-storiche | Serie storiche

## ml-rinforzo-tabellare | Apprendimento per rinforzo tabellare
- ml-banditi | Banditi a più braccia
- ml-monte-carlo | Metodi Monte Carlo per il rinforzo
- ml-sarsa-q-learning | Differenze temporali: SARSA e Q-learning
- ml-td-lambda | Metodi a n passi e TD(λ)
- ml-esplorazione | Strategie di esplorazione
- ml-valore-lineare | Approssimazione lineare della funzione valore
