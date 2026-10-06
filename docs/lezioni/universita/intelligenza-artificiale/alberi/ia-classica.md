# Albero delle lezioni: Intelligenza artificiale classica (università)

Fonte dell'albero di `content_nodes` per la materia `ia-classica` sotto `university`. Viene dal blocco 1 di
`vault/Contenuti/Programma di intelligenza artificiale.md` (6 ottobre 2026): i capitoli sono quelli del programma, le
lezioni sono una prima divisione degli argomenti di ogni capitolo, da rivedere quando il capitolo si scrive. Si applica
con `scripts/lezioni/tree.mts --level university --subject ia-classica --title "Intelligenza artificiale classica" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.

## ia-cose-ia | Che cos'è l'intelligenza artificiale
- ia-definizioni | Le definizioni di intelligenza artificiale e il test di Turing
- ia-agenti-razionali | Agenti razionali e ambienti
- ia-storia | Storia dell'intelligenza artificiale
- ia-mappa-metodi | La mappa dei metodi: simbolici, probabilistici, apprendimento

## ia-ricerca | Ricerca nello spazio degli stati
- ia-problemi-ricerca | Problemi come ricerca in uno spazio degli stati
- ia-ricerca-ampiezza-profondita | Ricerca in ampiezza e in profondità
- ia-costo-uniforme | Ricerca a costo uniforme e approfondimento iterativo
- ia-ricerca-greedy-a-star | Ricerca greedy e A*
- ia-euristiche | Euristiche ammissibili e consistenti
- ia-ida-star | A* con poca memoria: IDA*

## ia-ricerca-locale | Ricerca locale e algoritmi evolutivi
- ia-hill-climbing | Hill climbing e i suoi limiti
- ia-simulated-annealing | Simulated annealing e ricerca tabu
- ia-beam-search | Beam search
- ia-algoritmi-genetici | Algoritmi genetici
- ia-strategie-evolutive | Strategie evolutive e programmazione genetica
- ia-neuroevoluzione | Neuroevoluzione
- ia-sciami | Intelligenza di sciame: particelle e colonie di formiche

## ia-giochi | Ricerca con avversario
- ia-minimax | Giochi a somma zero e minimax
- ia-alfa-beta | La potatura alfa-beta
- ia-funzioni-valutazione | Funzioni di valutazione e profondità limitata
- ia-expectiminimax | Giochi con il caso: expectiminimax
- ia-mcts | Ricerca ad albero Monte Carlo
- ia-teoria-giochi | Teoria dei giochi: equilibrio di Nash e strategie miste

## ia-vincoli | Vincoli e soddisfacibilità
- ia-csp | Problemi di soddisfacimento di vincoli
- ia-backtracking | Backtracking ed euristiche di ordinamento
- ia-consistenza-arco | Propagazione dei vincoli e consistenza d'arco
- ia-sat | Soddisfacibilità booleana e risolutori SAT

## ia-logica | Logica e rappresentazione della conoscenza
- ia-logica-proposizionale | Logica proposizionale e inferenza
- ia-risoluzione | Forme normali e risoluzione
- ia-logica-primo-ordine | Logica del primo ordine
- ia-unificazione-concatenazione | Unificazione e concatenazione in avanti e all'indietro
- ia-programmazione-logica | Programmazione logica
- ia-sistemi-esperti | Sistemi esperti e sistemi a regole
- ia-ontologie | Reti semantiche, logiche descrittive e ontologie
- ia-grafi-conoscenza | Grafi di conoscenza
- ia-ragionamento-temporale | Ragionamento temporale e calcolo delle situazioni
- ia-logica-epistemica | Logica epistemica e revisione delle credenze
- ia-logica-fuzzy | Logica fuzzy e ragionamento non monotono
- ia-neurosimbolica | Intelligenza artificiale neurosimbolica

## ia-pianificazione | Pianificazione
- ia-strips-pddl | Descrivere un problema di pianificazione: STRIPS e PDDL
- ia-pianificazione-stati | Pianificazione nello spazio degli stati
- ia-ordine-parziale | Pianificazione a ordine parziale
- ia-graphplan | GraphPlan e pianificazione come SAT
- ia-htn | Reti gerarchiche di compiti
- ia-pianificazione-incertezza | Pianificazione con osservabilità parziale
- ia-pianificazione-multi-agente | Pianificazione con più agenti

## ia-ragionamento-probabilistico | Ragionamento probabilistico
- ia-reti-bayesiane | Reti bayesiane
- ia-indipendenza-condizionata | Indipendenza condizionata e d-separazione
- ia-inferenza-esatta | Inferenza esatta: eliminazione di variabili
- ia-inferenza-approssimata | Inferenza approssimata con il campionamento
- ia-campi-markov | Campi aleatori di Markov
- ia-hmm | Modelli di Markov nascosti
- ia-kalman | Filtro di Kalman e filtro a particelle
- ia-apprendere-modelli-probabilistici | Apprendere un modello probabilistico
- ia-causalita | Inferenza causale

## ia-decisioni | Decisioni in sequenza
- ia-utilita | Utilità e teoria delle decisioni
- ia-mdp | Processi decisionali di Markov
- ia-bellman | Le equazioni di Bellman
- ia-iterazione-valori | Iterazione dei valori e della politica
