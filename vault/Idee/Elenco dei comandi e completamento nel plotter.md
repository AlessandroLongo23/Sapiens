---
stato: decisa in parte
aggiornato: 2026-10-02
tag: [idea, strumenti, matematica]
---
# Elenco dei comandi e completamento nel plotter

Decisa in parte e fatta il 2 ottobre 2026: [[2026-10-02 Le parole del plotter stanno in un elenco solo, con i nomi italiani]]. L'elenco, le proposte mentre si scrive, gli oggetti geometrici scritti, i cursori alla conferma e le funzioni di più numeri sono nel codice: vedi lo stato in [[Grafico di funzioni]]. Di questa nota restano la sezione "Cosa manca, oltre all'elenco" e i comandi di analisi su una funzione (`zeri(f)`, `estremi(f)`, `area(f; g; a; b)`), non fatti.

## L'idea
Alessandro, 2 ottobre 2026: GeoGebra ha una guida per ogni comando (quanti argomenti prende e di che tipo) e, mentre si scrive, propone i comandi che cominciano con le lettere scritte. Scrivendo "tra" dovrebbe uscire "tratti". GeoGebra ne ha centinaia, molti inutili a scuola (il commesso viaggiatore); va deciso quali ammettere, e se nell'elenco entrano anche le funzioni che hanno già una scrittura loro (seno, coseno, valore assoluto).

## Parere di Claude, da confermare
È il prossimo pezzo da fare, prima di altri strumenti, perché è lo stesso pezzo della scrittura degli oggetti geometrici già decisa (`retta(A; B)`, vedi [[2026-10-02 La geometria analitica sta nel plotter e si costruisce prima con i clic]]).

Un solo elenco, una voce per comando: nome italiano, altri nomi accettati, argomenti con il loro tipo (numero, punto, retta, circonferenza, funzione), cosa crea, una riga di descrizione, il filmato, e la scrittura che inserisce. Da quell'elenco escono cinque cose:
- il completamento mentre si scrive;
- la scrittura degli oggetti: i 22 strumenti di oggi hanno già nome, descrizione, filmato e la sequenza di cosa chiedono, che è l'elenco degli argomenti;
- la scheda di aiuto, la stessa del tooltip della barra;
- i permessi di un piano dentro una lezione (vedi "Modi nelle lezioni" in [[Geometria analitica nel plotter]]);
- la guida in pagina sotto lo strumento, che è testo per la ricerca.

Le funzioni con una scrittura loro entrano nell'elenco per essere trovate, senza una seconda sintassi: scegliere "valore assoluto" inserisce $|x|$, scegliere "radice" inserisce $\sqrt{x}$. `abs(x)` e `sqrt(x)` restano accettate in silenzio, come oggi.

Regola per ammettere un comando: è nel programma del liceo, e il suo risultato è qualcosa che si disegna sul piano o un numero che ci si legge sopra. Fuori: commesso viaggiatore, Voronoi, foglio di calcolo, i comandi di calcolo simbolico (Risolvi, Fattorizza, Semplifica), che sono un altro strumento.

Stima: una sessantina di voci.
- Funzioni con la loro scrittura (circa 25): quelle di oggi (`sin`, `cos`, `tg`, `cotg`, `sec`, `csc`, le inverse, le iperboliche, `ln`, `log`, `log_a`, esponenziale, radice, valore assoluto, parte intera, segno, fattoriale).
- Funzioni che mancano: `max`, `min`, resto della divisione, `mcd`, `mcm`, arrotonda, coefficiente binomiale.
- Scritture con i buchi (7, già fatte): tratti, sistema, somma, prodotto, integrale, derivata, successione. Manca il limite.
- Oggetti geometrici (22, già fatti con i clic): da rendere scrivibili.
- Analisi su una funzione, oggi solo con i clic o in automatico: `tangente(f; x_0)`, `zeri(f)`, `estremi(f)`, `flessi(f)`, `asintoti(f)`, `area(f; a; b)`, `area(f; g; a; b)`.

## Cosa manca, oltre all'elenco
In ordine di quanto pesa nel programma:
1. Terzo giro della geometria: trasformazioni (simmetrie, traslazione, rotazione, omotetia) e coniche dalla definizione. Le trasformazioni valgono anche per il grafico di una funzione.
2. Limiti e asintoti: la scrittura $\lim_{x \to a}$ con il valore numerico, e gli asintoti disegnati.
3. Dati e statistica: una tabella di punti, la retta di regressione, la distribuzione binomiale e la normale (quinto anno, e i laboratori di fisica).
4. Area tra due curve.
5. Campo di direzioni di $y' = f(x; y)$ (equazioni differenziali, quinto anno).
6. Tabella dei termini e diagramma a ragnatela per le successioni.

Da non fare: numeri complessi, tre dimensioni, calcolo simbolico.

## Dubbi e conflitti
- Le lettere scritte una dopo l'altra oggi sono un prodotto di parametri: "tra" crea tre cursori. Proposta di Alessandro, 2 ottobre 2026: i cursori compaiono solo quando la formula è confermata (clic altrove o Invio). Parere di Claude: sì, rimandando solo la riga del cursore e non il disegno, che continua a seguire la scrittura con il valore 1; e un cursore non sparisce mentre si modifica la formula, così cancellare e riscrivere una lettera non ne perde il valore.
- MathLive 0.110 permette il completamento con le sole funzioni pubbliche. Provato il 2 ottobre 2026 con Playwright su Chromium e WebKit, sulla pagina di prova: `position` e `getValue(inizio, fine)` danno le lettere prima del cursore di scrittura ("tra", anche dentro una frazione o un esponente, e dopo `y=2`); `getElementInfo(position).bounds` dà il rettangolo sullo schermo a cui agganciare l'elenco; `selection` e `insert` sostituiscono le lettere con la scrittura scelta, con il cursore nel primo buco; l'evento `input` arriva a ogni lettera; un ascoltatore in fase di cattura sul campo prende frecce, Invio ed Esc prima di MathLive, che non si muove.
- Resta un conflitto: le scorciatoie di oggi trasformano la parola appena è completa ("sin", "sen", "tratti"), e dopo le lettere non ci sono più. Scrivendo "tangente" per la retta, a "tan" nasce la funzione tangente e l'elenco perde il filo. Con il completamento le parole devono avere un padrone solo: le scorciatoie dei nomi si tolgono, e la trasformazione la fa l'elenco (alla scelta, oppure da sola quando la parola è esatta e arriva una parentesi, uno spazio o la conferma).
- Non provato: la tastiera di Sapiens su un telefono (se i suoi tasti danno lo stesso evento) e dove sta l'elenco quando la tastiera occupa metà schermo.
- I nomi: italiani (`retta`, `circonferenza`, `tg`). Da chiedere ad Andrea con le altre convenzioni.
- Il separatore degli argomenti è il punto e virgola, perché la virgola è quella dei decimali.
- Come si chiama in una formula un oggetto di un'altra riga: i punti hanno un nome, le rette e le circonferenze ancora no in modo stabile ($r$ è anche il raggio polare, $t$ il parametro).
- Su un telefono l'elenco delle proposte si contende lo spazio con la tastiera.

## Collegamenti
- [[Grafico di funzioni]]
- [[Geometria analitica nel plotter]]
