---
stato: bozza
release: dopo la v1.0
aggiornato: 2026-10-05
tag: [contenuti, programma, intelligenza-artificiale, università, ricerca]
---
# Confronto del programma di intelligenza artificiale con i syllabus universitari

Il [[Programma di intelligenza artificiale]] era scritto a memoria e confrontato con un solo corso online. Il 5 ottobre 2026, con il via libera di Alessandro, tre ricerche parallele l'hanno confrontato con i syllabus di tredici atenei. Questa nota tiene le fonti, quello che ne esce, le correzioni già applicate al programma e le proposte di struttura che aspettano una decisione.

Due avvertenze di Alessandro, che valgono per tutta la nota: gli atenei sono molto diversi tra loro e l'offerta dipende dai docenti disponibili, quindi l'assenza di un corso non dice che l'argomento sia marginale; ore e crediti sono vincoli loro e non un obiettivo per Sapiens (vedi [[2026-10-05 I corsi universitari non hanno una misura fissa]]).

## Fonti

Tutte consultate il 5 ottobre 2026. Gli elenchi di argomenti sono quelli dei titoli delle lezioni o delle schede: slide e video non sono stati aperti, quindi un argomento che non compare in un titolo può essere trattato lo stesso.

| Ateneo | Corsi letti | Limiti |
|---|---|---|
| Stanford | CS221 (autunno 2025), CS231n (primavera 2026), CS224n (inverno 2026), CS234 (inverno 2026), CS336 (primavera 2026), CS120 (autunno 2025), CS229 | CS229: l'unico elenco pubblico è del 2019 |
| UC Berkeley | CS188 (autunno 2025), CS189 (primavera 2026), CS285 (primavera 2026), seminario Agentic AI (autunno 2025) | CS182 dietro login |
| MIT | 6.390 (autunno 2026), 6.7960 (autunno 2026), 6.S191 (2026) | |
| Carnegie Mellon | 10-301/601, 11-785, 11-766 (primavera 2026) | |
| Cambridge | Artificial Intelligence, Part IB (2025-26) | |
| Edimburgo | INF2D Reasoning and Agents | anno non indicato |
| DTU | 02180, 02182, 02280 (ex 02285), 02287, 02451 e 02452 (ex 02450), 02456, 02460, 02463, 02465, 02471, 02476, 02477, 02582, quattro corsi di visione, 02517, 02820, 02988, il corso speciale sui modelli linguistici, il piano della magistrale Human-Centered AI | schede lette su kurser.dtu.dk, 2026/27 |
| Bologna | LM Artificial Intelligence 2026/27: Fundamentals of AI and Knowledge Representation, Machine Learning and Data Mining, Deep Learning, NLP, Image Processing and Computer Vision, Ethics in AI, Multi-Agent Systems, Agentic AI Systems | la copertura più completa tra gli italiani; Ethics letto sull'edizione 2025/26 |
| Politecnico di Milano | Foundations of AI, Machine Learning, Artificial Neural Networks and Deep Learning, NLP, Numerical Analysis for ML | schede del 2022/23 (NLP del 2018/19): non riflettono transformer e modelli linguistici di oggi |
| Pisa | AI Fundamentals, Machine Learning, Intelligent Systems for Pattern Recognition, Generative and Deep Learning, Human Language Technologies, Computer Vision | fonti dal 2017/18 al 2026/27 |
| Padova | Foundations of AI, Machine Learning, Deep Learning, Reinforcement Learning, NLP (2025/26), Computer Vision, Agentic AI for Information Access | descrizioni brevi del corso di studi, non le schede ufficiali |
| Sapienza | Machine Learning (2026/27) | un solo programma letto; il resto è piano di studi |
| Politecnico di Torino | Machine Learning and Pattern Recognition, Advanced Machine Learning (2026/27) | due soli corsi |

I tre rapporti completi, con gli indirizzi di ogni pagina letta, gli elenchi delle lezioni corso per corso e i libri adottati, sono in `docs/lezioni/universita/intelligenza-artificiale/syllabus/` (`atenei-esteri.md`, `atenei-italiani.md`, `dtu.md`): servono quando si scrivono le schede delle fonti delle lezioni. I rapporti parlano di 57 capitoli e dei loro numeri come erano prima delle correzioni di questa nota.

## Che cosa conferma

- I quattro blocchi corrispondono a come gli atenei dividono la materia: un corso di fondamenti (ricerca, logica, pianificazione, incertezza), uno di machine learning, uno di deep learning, e la visione sempre in un corso suo.
- La visione non entra nel corso di deep learning, come stimato: ha ovunque un corso a sé, con una parte classica.
- Il rinforzo tabellare dentro il machine learning (2.11) ha due precedenti, Politecnico di Milano e Sapienza. Il deep reinforcement learning chiude il corso di deep learning a Bologna e a Pisa, come il nostro 3.13.
- La distinzione di Alessandro tra sistemi multi-agente e agenti basati su un modello linguistico è quella degli atenei. Bologna ha due corsi distinti (Multi-Agent Systems, classico, e Agentic AI Systems); alla DTU 02280 è IA classica e pianificazione, senza modelli linguistici.
- Il taglio tra costruire un modello linguistico e usarlo (4.1-4.4 contro 4.5-4.9) corrisponde a due corsi veri: CS336 a Stanford e 11-766 a Carnegie Mellon.
- Trovano riscontro argomenti che sembravano di troppo: reti su grafi (Pisa, Carnegie Mellon, DTU), mappe auto-organizzanti (Pisa), regole di associazione (Bologna), PAC e dimensione VC (Milano, Padova, Pisa, Carnegie Mellon), algoritmi genetici e sciami (Bologna), RLHF e DPO (Bologna, Stanford), LoRA e RAG (Padova).

## Che cosa dice di nuovo

- Un blocco dedicato ai modelli linguistici non ha precedenti tra gli atenei italiani letti: lì stanno dentro il corso di elaborazione del linguaggio, che a Padova nel 2025/26 è per circa metà modelli linguistici. Alla DTU esiste solo un corso speciale senza codice, tenuto la prima volta nella primavera 2026, sull'uso (servizi, RAG, grafi di conoscenza). Il blocco 4 è quindi il punto in cui Sapiens offre qualcosa che gli atenei non hanno ancora, ed è anche quello in cui la rilettura ha meno termini di paragone.
- Gli agenti basati su un modello linguistico stanno comparendo come corsi a scelta nati da corsi precedenti: a Bologna dal corso di rinforzo, a Padova dal recupero dell'informazione. Nessun ateneo ha un corso di fondamenti sugli agenti.
- Alla DTU "human-centered" non vuol dire etica: vuol dire misurare le persone (esperimenti con utenti, prototipi, scienze cognitive). Il nostro blocco 5 è costruito sui rischi.
- Quasi ogni corso tecnico americano ha una lezione sull'impatto sociale al suo interno, oltre a un eventuale corso dedicato. Bologna apre il corso di fondamenti con IA affidabile e AI Act.
- L'ottimizzazione numerica e la matematica per l'apprendimento hanno un esame loro in tre atenei italiani (Milano, Bologna, Pisa).
- Le macchine a vettori di supporto stanno uscendo dai corsi introduttivi americani del 2026 (assenti in CS189, 10-301 e 6.390) e restano in quelli italiani.

## Correzioni già applicate al programma

Aggiunte di argomenti e correzioni di archi che non cambiano la struttura, fatte il 5 ottobre 2026.

Archi:
- tolto l'arco dal blocco 1 al blocco 2 (2.1 non chiede più 1.1): alla DTU IA classica e machine learning sono due linee senza archi tra loro, e nessun corso di machine learning letto parte dall'IA classica;
- 2.6 chiede anche 0.3, per i processi gaussiani;
- 3.11 chiede anche 1.8: Padova e Pisa insegnano i modelli di Markov nascosti dentro il corso di linguaggio.

Argomenti aggiunti, per capitolo: teoria dei giochi oltre la somma zero (1.4); logiche descrittive, reti semantiche e frame, ragionamento temporale, calcolo delle situazioni, logica epistemica e revisione delle credenze, IA neurosimbolica (1.6); ordine parziale, GraphPlan, pianificazione come SAT, con osservabilità parziale e con più agenti (1.7); apprendimento nei modelli probabilistici, causalità più estesa (1.8); calibrazione e confronto statistico tra modelli (2.2); elastic net, percettrone come classificatore lineare, classificatori generativi gaussiani (2.3); apprendimento attivo e qualità delle etichette (2.7); stima di densità a kernel (2.8); analisi fattoriale e fattorizzazione non negativa (2.9); esplorazione e approssimazione lineare della funzione valore (2.11); perché serve la profondità (3.1); generalizzazione delle reti e addestramento su più GPU (3.3); visione classica (3.10); n-grammi e analisi morfologica e sintattica (3.11); modelli del mondo ed esplorazione (3.13); dati sintetici e lingue diverse dall'inglese (4.1); rinforzo con ricompensa verificabile e modelli che ragionano (4.2); statistica delle valutazioni (4.4); agenti che scrivono codice (4.8); rimedi alle distorsioni (5.1); prototipi, vettori di concetto, valutare una spiegazione (5.2); riproducibilità (5.7).

## Proposte di struttura, da decidere

1. Unire i processi decisionali di Markov (1.9) al rinforzo tabellare (2.11) in un solo capitolo del blocco 2. Tutti i corsi letti li insegnano uno dopo l'altro nello stesso corso; nessun corso di fondamenti italiano contiene i processi di Markov; alla DTU 02465 li insegna al proprio interno. I banditi vanno in testa, come a Padova, a Bologna e in Sutton e Barto: sono anche l'esempio senza prerequisiti che serve in 2.1.
2. Il capitolo 3.1 parte dal limite del percettrone, non dal percettrone. Carnegie Mellon, Stanford, Berkeley, Milano, Pisa e Sapienza insegnano il percettrone come algoritmo di machine learning, prima delle reti. Il ponte più usato (MIT, Carnegie Mellon, Berkeley) è: classificatore lineare, limite della separabilità lineare, caratteristiche non lineari scelte a mano, rete che le impara. Riguarda il capitolo pilota: vedi sotto.
3. L'arco dalle reti ricorrenti al transformer (3.5 verso 3.6) è una scelta didattica e storica, non un prerequisito: MIT 6.390, Berkeley CS189 e Torino arrivano al transformer senza le ricorrenti. Proposta: 3.6 chiede 3.3, e 3.5 resta l'ordine consigliato.
4. Dividere 3.11. Oggi tutto il capitolo dipende da ricorrenti e transformer, quindi word2vec e TF-IDF finiscono dopo il transformer; in tutti i corsi di linguaggio letti vengono prima. Proposta: un capitolo "Il testo come dato" (preparazione, n-grammi, embedding statici) prima di 3.5, e i compiti dopo.
5. Dividere 4.9 secondo le due tradizioni: i sistemi multi-agente classici (architetture ad agenti, coordinazione, pianificazione con più agenti, teoria dei giochi) nel blocco 1, gli agenti basati su un modello linguistico nel corso sugli agenti.
6. Un capitolo di machine learning bayesiano nel blocco 2 (evidenza, inferenza variazionale, calibrazione e incertezza, processi gaussiani, ottimizzazione bayesiana): ha un corso suo alla DTU (02477) ed è nei programmi di Pisa e Torino. Oggi è sparso tra 0.3, 1.8 e 2.6.
7. Nel blocco 5, un capitolo sul valutare un sistema con le persone (disegno di un esperimento con utenti, misure, consenso), dalla magistrale della DTU; e una lezione di impatto dentro ciascun corso, oltre al blocco 5.
8. Ridurre a un cenno gli argomenti che nessun syllabus letto tratta e che non hanno altre ragioni per restare: logica fuzzy, ricerca tabu, programmazione genetica, clustering spettrale, reti di Hopfield e macchine di Boltzmann (solo a Carnegie Mellon). Da non tagliare per questo motivo le parti dei blocchi 4 e 5 che mancano negli atenei: lì è più probabile un loro ritardo.
9. L'ottimizzazione ha un posto suo, come nei tre atenei italiani che le danno un esame: risponde alla domanda aperta su dove si spiega.

## Per il capitolo pilota sulle reti neurali

Come dieci corsi introducono percettrone, reti a più strati e retropropagazione (vedi [[2026-10-05 Il primo capitolo di intelligenza artificiale sono le reti neurali]]):

- La misura va da una a cinque lezioni in aula; il valore tipico è due o tre.
- La sequenza comune: classificatore lineare o percettrone, limite della separabilità lineare, caratteristiche non lineari scelte a mano, rete che le impara, funzioni di attivazione, approssimazione universale, discesa del gradiente, retropropagazione dal neurone singolo al caso generale.
- Solo 11-785 di Carnegie Mellon apre con la storia e le fonti originali, ed è il corso più vicino all'impostazione scelta da Alessandro. Le sue letture: McCulloch e Pitts, Rosenblatt, Hebb, la convergenza del percettrone, Widrow e Lehr (1992), Werbos (1990), Rumelhart, Hinton e Williams (1986).
- Lo XOR come esempio scritto è stato trovato solo nelle dispense di MIT 6.390 (capitolo 5), dove è il caso non separabile risolto con caratteristiche polinomiali prima delle reti. Negli altri corsi può stare nelle slide, non aperte.
- Le letture adottate più spesso: Goodfellow, Bengio e Courville, capitolo 6; Bishop e Bishop (2024), capitoli 6 e 8; Prince, "Understanding Deep Learning" (2023), che è il testo di 02456 alla DTU; le dispense di MIT 6.390 e di Stanford CS231n; Nielsen.
- Padova, Bologna e Milano hanno la differenziazione automatica tra gli argomenti del corso di deep learning o di analisi numerica.

## Domande aperte
- Le nove proposte di struttura qui sopra.
- La ricerca non ha letto: i corsi di rinforzo, sistemi multi-agente ed elaborazione del linguaggio del Politecnico di Milano di oggi; quasi tutta la Sapienza; un ateneo europeo oltre Cambridge, Edimburgo e DTU (ETH, EPFL); i corsi di etica oltre Bologna.

## Collegamenti
- [[Programma di intelligenza artificiale]], [[Intelligenza artificiale in quinta e all'università]], [[2026-10-05 Il corso di intelligenza artificiale ha quattro blocchi ordinati da un grafo dei prerequisiti]], [[2026-10-05 Il primo capitolo di intelligenza artificiale sono le reti neurali]]
