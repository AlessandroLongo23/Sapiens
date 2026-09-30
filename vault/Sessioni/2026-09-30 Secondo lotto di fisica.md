---
aggiornato: 2026-09-30
tag: [sessione, contenuti, fisica]
---
# Secondo lotto di fisica

Sessione del 30 settembre 2026, seguito di [[2026-09-29 Primo lotto di fisica]]. Alessandro ha scelto di continuare con la fisica prima del terzo anno di matematica. Il lotto chiude il primo anno di fisica: l'equilibrio dei solidi (6 lezioni), l'equilibrio dei fluidi (5) e l'ottica geometrica (7), lezioni 20-37. Con il primo lotto le lezioni di fisica complete sono 37, tutto il primo anno. Pubblicate gratis come deciso in [[2026-09-29 La fisica si pubblica gratis accanto alla beta]].

## Cosa si è fatto
- Prima del lotto (Claude):
  - un worktree separato, `Sapiens-fisica`, sul branch `fisica-secondo-lotto`, con il sito di sviluppo sulla porta 3001, perché nella cartella principale lavora un'altra sessione (il laboratorio 3D e gli adesivi), che aveva anche committato sul branch del primo lotto. Turbopack non accetta un `node_modules` collegato con un link simbolico fuori dalla cartella: si copia con `cp -Rc`, che su APFS non occupa spazio;
  - i pezzi di ottica del kit, `src/components/content/interactive/fisica/ottica.tsx`: raggi con la freccia a metà, asse ottico, normale, specchi piani e sferici, lenti sottili, fuochi, oggetto e immagine, con i calcoli di riflessione, legge di Snell ed equazione delle lenti;
  - nel README di fisica le regole su incertezze e cifre significative del primo lotto, le convenzioni TikZ di fulcri, liquidi e ottica, e l'elenco dei pezzi riusabili.
- Le 18 lezioni sono state scritte da sei agenti in parallelo, ognuna con formulario, flashcard e note. In tutto ci sono:
  - 87 figure TikZ;
  - 20 figure interattive, per esempio il corpo appeso a due fili, il piano inclinato con l'attrito, l'altalena dei momenti, la leva nei tre generi, il blocco che si ribalta, il torchio idraulico, il tubo a U, il tubo di Torricelli, il dinamometro con il corpo immerso, lo specchio sferico e la lente con l'oggetto da trascinare, il prisma;
  - 11 tipi di scena nuovi negli esercizi;
  - 18 generatori, per 99 livelli.
- Nuovi pezzi comuni scritti dagli agenti: `interactive/fisica/liquidi.tsx` (recipienti, liquidi, pistoni), `leve.tsx` (asta, fulcro, perno, verso di rotazione, quote), `raggi.tsx` (occhio, raggio che incontra uno specchio sferico).
- Durante il lotto:
  - arrotondate al centesimo di pixel le coordinate del kit (`frame().px`), perché server e browser davano seni diversi nelle ultime cifre e l'idratazione delle scene falliva;
  - ingrandita la freccia dei raggi, che era più piccola di quella TikZ;
  - scelto per il mercurio `gray!60`, visibile anche nel tema scuro;
  - scritto nel README che `\text{cm}` dentro un nodo TikZ non compila e che i colori dello spettro si invertono nel tema scuro.
- Verifiche:
  - ogni generatore dà PASS con i seed 1, 50001 e 777001, boccia gli errori piantati e passa `review.mts` e `width.mts`;
  - i numeri delle lezioni sono rifatti in Python;
  - `check.mts` non dà errori, `tsc` ed ESLint sono puliti.
- Pubblicate: 87 figure e 54 colonne. Controllate a 390 px sul sito di sviluppo, che legge lo stesso database, le 18 lezioni e le 18 schede degli esercizi: tutte le figure caricate, tutte le interattive montate, 372 scene disegnate nelle schede, nessun errore di KaTeX o in console, nessuna pagina che scorre di lato.

## Informazioni nuove
- La convenzione dei segni di specchi e lenti è una sola: $1/p + 1/q = 1/f$ e $G = -q/p$, con $p$ positivo per l'oggetto reale, $q$ positivo per l'immagine reale e negativo per la virtuale, $f$ positiva per lo specchio concavo e la lente convergente. È scritta nella lezione 33 e ripresa nella 36.
- Nelle costruzioni con lo specchio sferico l'arco vero fa mancare l'immagine di qualche pixel: la lezione 33 disegna lo specchio più piatto e lo dice in un riquadro.
- Pezzi ancora fuori dal kit comune:
  - un mezzo ottico (un semipiano con il suo indice) e il prisma;
  - la quota con doppia freccia, scritta due volte;
  - i nomi con il numero in tondo ("2F") sull'asse ottico;
  - l'etichetta dell'angolo di `Incline`.

  Il gruppo di Archimede ha il suo recipiente e non usa `liquidi.tsx`.
- Esercizi poco vari: il livello 4 del piano inclinato (116 esercizi diversi su 1000).
- Dati da verificare, segnati nelle note:
  - date e dettagli storici: Torricelli e Viviani, Périer sul Puy de Dôme, gli emisferi di Guericke, le date di Newton, Galileo e Keplero;
  - densità: dell'alcol, della glicerina e dell'acqua di mare (1030 o 1025 kg/m³);
  - ottica: gli indici di rifrazione (Schott N-BK7 e F2) e l'angolo del secondo arcobaleno;
  - la tabella dell'atmosfera standard, calcolata con la formula e non confrontata con una tabella pubblicata.

## Domande aperte
- Le domande di contenuto sono in [[Domande per Andrea]], nella sezione del secondo lotto; quelle di ogni lezione nelle note `docs/lezioni/fisica/note/20-37`.
- Il valore di $p_0$: la lezione 29 usa $1{,}013 \cdot 10^5$ Pa, la 28 lo arrotonda a $1{,}01 \cdot 10^5$ negli esempi e lo dice.

## Stato
In produzione dal 30 settembre 2026: il branch `fisica-secondo-lotto` è entrato in master con la PR #15, dopo aver unito master (che aveva la PR #14 degli adesivi, senza file in comune). Controllate su `sapiens-edu.vercel.app` a 390 px le lezioni 22, 28 e 33 con le loro schede: figure caricate, interattive montate, scene disegnate, nessun errore di KaTeX. Ogni pagina di lezione, anche di matematica, registra un 404 sul prefetch della pagina del capitolo (`?_rsc=`), che invece risponde 200: c'era già prima, da capire.

Stato dei branch al momento del merge: il branch locale `fisica-primo-lotto` nella cartella principale è su un commit degli adesivi (`bded598`) diverso da quello pushato e unito (`3e090b5`); `pigreko` ha 3 commit non uniti (la rinomina, in attesa della decisione sul nome); `zaino-cestino` è unito e il suo worktree si può togliere.

## Prossimo argomento
Il secondo anno di fisica (cinematica, moti nel piano, dinamica, forze e movimento, lavoro ed energia, temperatura e calore), oppure il terzo anno di matematica.
