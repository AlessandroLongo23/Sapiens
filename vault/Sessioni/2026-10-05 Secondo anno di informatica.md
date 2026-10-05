---
aggiornato: 2026-10-05
tag: [sessione, contenuti, informatica]
---
# Secondo anno di informatica

Sessione del 5 ottobre 2026, seguito di [[2026-10-05 Prime lezioni di programmazione]]. Alessandro ha chiesto di completare il biennio di informatica. Il primo anno era completo dal 3 ottobre ([[2026-10-03 Primo lotto di informatica]]); del secondo erano scritte cinque lezioni di programmazione. Questo lotto scrive le altre 27.

## Cosa si è fatto
- Brief del lotto: `docs/lezioni/informatica/brief-secondo-anno.md`. Fissa tre scelte rimaste aperte, da confermare: nelle lezioni con la programmazione la lunghezza si conta sul testo (40-80 righe, 350 in tutto); una lettera per contatori e numeri senza significato, un nome intero quando il valore è qualcosa; Python e C++ insieme.
- Sette gruppi in parallelo, uno per capitolo o mezzo capitolo:
  - Internet e il web: 33-36 e 37-39
  - Sicurezza e cittadinanza digitale: 40-44
  - Algoritmi e diagrammi di flusso: 45, 46, 48, 49, 50
  - Linguaggi e primi programmi: 51, 52, 54, 55
  - La selezione: 56, 58, 59
  - L'iterazione: 62, 63, 64
- Ogni lezione ha testo, nota, formulario e flashcard. Formulario e flashcard sono stati scritti anche per le cinque lezioni già pubblicate (47, 53, 57, 60, 61).
- I diagrammi di flusso delle lezioni nuove sono tutti blocchi `diagramma` ([[Diagrammi di flusso eseguibili]]): 58 nel secondo anno, di cui 16 da riordinare, correggere, completare o costruire. Il capitolo sugli algoritmi, che viene prima dei linguaggi, lavora quasi solo con quelli.

## Numeri
- Secondo anno: 32 lezioni, circa 7500 righe. 29 esercizi con le prove, in Python e in C++. 24 figure TikZ nei capitoli senza programmazione e nelle lezioni 50 e 51.
- Il biennio di informatica ha 64 lezioni, tutte con formulario e flashcard.

## Verifiche
- `check.mts` su lezioni, formulari e flashcard del secondo anno: nessun errore. Tre avvisi nella 63 sono righe di asterischi dentro blocchi di codice.
- `verifica.mts`: 29 esercizi, 0 errori nei due linguaggi.
- Ogni pagina del secondo anno aperta in Chromium nell'anteprima, a 1280 e a 390 px: figure tutte presenti, nessun errore nelle formule, nessuno scorrimento laterale, ogni editor montato, ogni diagramma da eseguire arrivato a "Fine".
- I gruppi di algoritmi hanno risolto nel browser i loro 13 esercizi sui diagrammi con i gesti dello studente. Non risolti a mano: la costruzione nella 54 e nella 62, la correzione del rombo nella 55, il completamento nella 59.
- Le figure TikZ sono state guardate dai gruppi in chiaro e in scuro.

## Corretto nel sito
- In C++ il resto di una divisione per zero dava un messaggio in inglese: ora dice "divisione intera per zero", come la divisione (`src/components/codice/wasi.ts`).

## Da sapere
- **Norme.** Le lezioni 43 (privacy) e 44 (diritto d'autore) citano il GDPR, l'età del consenso digitale e la legge sul diritto d'autore, in termini generali e senza numeri di articolo. Controllati sul testo il 5 ottobre: GDPR art. 8 e art. 12, le licenze Creative Commons. Il resto è scritto a memoria ed è elencato nelle note delle due lezioni come "da verificare": vanno rilette con le fonti.
- **Fatti storici** (ARPANET, il web al CERN, Böhm e Jacopini 1966): a memoria, nelle note con la fonte da controllare.
- **Lo pseudocodice** della 48 ha la forma dei blocchi del diagramma (`leggi`, `scrivi`, `←`, `se`, `altrimenti`, `finché` con il rientro), senza "allora" e senza righe di chiusura.
- **`0 <= x <= 10` in C++** non compila con il compilatore del sito ("chained comparison"); la lezione 58 lo dice. Che altri compilatori lo accettino non è stato provato.
- **La selezione a più vie** nella 59 non ha un diagramma: tre rombi in cascata sono larghi 862 px e non stanno nel riquadro.
- **Niente generatori di esercizi** per il secondo anno: il primo li ha, il secondo no.
- Non provato su Safari, Firefox e su un telefono vero.

## Gli esercizi (stessa sessione, dopo le lezioni)
Alessandro ha chiesto gli esercizi del secondo anno, con diagrammi di flusso e codice dentro: a scelta multipla scegliere il diagramma o il programma giusto, a risposta aperta costruire il diagramma o scrivere il programma.

- **Il sistema degli esercizi ora lo sa fare.** Un'opzione può essere un diagramma o un programma (mostrato in Python o in C++, a scelta dello studente); una domanda può mostrarne uno; una risposta aperta può essere un diagramma da costruire o un programma da scrivere.
  - Il diagramma consegnato lo esegue il server, con l'interprete delle lezioni, sulle prove dell'esercizio.
  - Il programma gira nel browser dello studente sugli ingressi dell'esercizio; il server confronta le uscite con quelle attese, che il browser non riceve mai.
  - La correzione guarda solo quello che il programma scrive: un `for` passa dove la consegna dice "usa un while".
- **32 generatori**, uno per lezione del secondo anno, 187 livelli. Quelli di Internet e sicurezza (33-44, 51) sono a scelta multipla di testo. Quelli di programmazione (45-50, 52-64) hanno 32 livelli a risposta aperta: 19 "costruisci il diagramma" e 13 "scrivi il programma".
- Un programma di un esercizio è scritto una volta sola, nel linguaggio dei diagrammi: da lì escono il diagramma, il codice nei due linguaggi e le prove (`src/lib/exercises/v2/inf-programmi.ts`). Il controllo indipendente traduce ed esegue ogni programma con Python, senza passare dall'interprete del sito (`scripts/exercises/checkers/_inf_programmi.py`).
- Brief: `docs/lezioni/informatica/brief-esercizi-secondo-anno.md`. Sette gruppi in parallelo, come per le lezioni.
- Pagina di prova, solo in sviluppo: `/prova-grafico/esercizio?g=<slug>&l=<livello>&seed=<seed>` e `&open=1` per la risposta aperta.

### Verifiche degli esercizi
- Ogni generatore: 1000 esercizi per livello con tre semi, verificati dal controllo in Python, dai gruppi; poi tutti e 32 insieme con un quarto seme, 400 per livello: tutti passano.
- I gruppi hanno piantato errori apposta nei campioni e controllato che venissero bocciati.
- Nel browser, sulla pagina di prova: i gruppi hanno aperto ogni livello a larghezza di telefono e consegnato risposte giuste e sbagliate nei livelli aperti (non tutti: in due generatori della selezione i diagrammi sono stati solo guardati).
- Una sessione vera con un account di prova, su "Il ciclo while": la domanda mostra il programma, il selettore cambia linguaggio, la risposta viene corretta e contata. I livelli aperti in una sessione vera non sono stati provati: si aprono solo dopo aver superato i primi quattro.

### Corretto nel sito
- Un diagramma più largo del suo spazio veniva tagliato da tutti e due i lati, senza poter scorrere a sinistra: ora parte dal bordo sinistro e scorre. Valeva anche per il disegno delle lezioni prima che diventasse interattivo.
- Un testo su più righe in un'opzione (pseudocodice) tiene le righe e il rientro.
- Nei capitoli che vengono prima dei linguaggi, il diagramma da costruire non ha il codice accanto.

### Limiti degli esercizi
- **Lezione 48, pseudocodice.** I livelli sono stati scritti quando il sito non mostrava il testo su più righe: lo pseudocodice intero è su una riga con le barre. Ora si può mostrare bene, e quei due livelli vanno rifatti.
- **Varietà.** Nei livelli "a consegna" dei primi programmi i programmi davvero diversi sono tra 20 e 58; il generatore di riferimento ne ha 64 per livello.
- **Diagrammi larghi.** Le cascate di rombi (59) e le condizioni composte (58) non compaiono nelle domande, solo come risposta da costruire; i generatori hanno un interruttore per riaccenderli ora che scorrono.
- **Lezioni di concetto.** Dove la risposta viene da una tabella di affermazioni, il controllo ha la sua copia: un'affermazione classificata male allo stesso modo dalle due parti la vede solo chi rilegge. Le opzioni sbagliate dei livelli "che cosa fare" vanno lette da una persona.
- La lettera O degli operatori logici somiglia allo zero nel carattere del codice.
- Niente esercizi su `switch`, `match` ed `elif`.

### I costrutti chiesti nella risposta (sera del 5 ottobre)
Alessandro ha chiesto di chiudere il primo dei limiti segnalati: la correzione guardava solo l'uscita, quindi un `for` passava dove la consegna chiedeva un `while`, e nei livelli senza ingresso passava anche chi scriveva i numeri a mano con sei `print`.

- Un livello aperto dichiara i costrutti che la risposta deve contenere (`needs`: `ciclo`, `selezione`, `while`, `for`). Il server corregge prima l'uscita; se è giusta, cerca i costrutti nel diagramma o nel codice consegnato (`src/lib/exercises/v2/costrutti.ts`). Per il codice toglie commenti e testi e cerca le parole riservate. Se manca qualcosa la risposta è sbagliata, con un messaggio suo: "Il programma scrive il risultato giusto, ma l'esercizio chiede un ciclo while, e qui non c'è".
- Chi lo dichiara, su 32 livelli aperti: un ciclo nei cinque generatori dell'iterazione (`while` in "Scrivere un ciclo" della 60, `for` nella 61); una selezione in quelli del capitolo sulla selezione; i cicli e le selezioni della soluzione dove si costruisce un diagramma nel capitolo sugli algoritmi (45-50). Non lo dichiarano i primi programmi (52-55), dove non c'è niente da chiedere, i due livelli "correggi" e quello che parte da un diagramma con il rombo già messo (59, livello 5).
- I due livelli aperti del ciclo while ora leggono il numero a cui il ciclo si ferma e sono provati su due numeri: l'uscita non si può più battere a mano.
- Il controllo indipendente in Python verifica che la soluzione abbia il costrutto chiesto, che il programma di partenza non lo abbia già, e che una consegna che nomina `while` o `for` lo chieda.
- Verifiche: i 19 generatori con risposte aperte passano su due semi, 500 esercizi per livello; `tests/unit/costrutti.test.mjs` (5); nel browser, in sviluppo, la somma da 1 a n consegnata con la formula e con un `for` viene respinta con il messaggio, con il `while` passa.
- Limiti che restano: chi somma da 1 a n con la formula in una lezione sui cicli si vede dire che manca il ciclo. Gli esercizi già salvati nelle sessioni in corso restano corretti alla vecchia maniera.

Secondo passo, la notte del 5 ottobre, su richiesta di Alessandro ("finisci la task"):

- Nuovo costrutto `annidati`, un ciclo nel corpo di un altro. In un diagramma si legge dall'albero; in Python dal rientro; in C++ dalle graffe, o dall'istruzione che segue il ciclo quando le graffe non ci sono. Lo chiedono i due livelli aperti dei cicli annidati (63): due cicli in fila, o un triangolo fatto con un ciclo solo e `"*" * i`, scrivono giusto e non passano.
- "I due cicli di una tabella" (63, livello 5) ora legge le due dimensioni ed è provato su m, n e su n, m. Il "ripeti" di Scratch (50, livello 5) legge quante volte. Nessun livello che chiede un costrutto è più senza ingresso, e la regola è controllata: un livello con `needs` che non legge niente, o le cui prove scrivono tutte lo stesso, non passa `check()` né il controllo Python. Questo chiude il `while` finto accanto ai `print`.
- Sopra l'editor di un programma da scrivere la pagina dice che cosa deve esserci ("Nel programma deve esserci un ciclo while."), così nessuno scopre il vincolo dal verdetto. Per i diagrammi no: lì senza il costrutto non si arriva all'uscita giusta.
- Un livello aperto è stato provato dentro una sessione vera (`tests/e2e/esercizi-informatica.spec.ts`): con i sei livelli del ciclo while passati, "Ripassa il livello 6" chiede il programma, mostra il vincolo e corregge la consegna.

## Domande per Andrea
Ogni nota di lezione ha le sue. Le principali sono riportate in [[Domande per Andrea]], sezione "Informatica, secondo anno".

## Collegamenti
- [[Pipeline lezioni]], [[Programma ministeriale]], [[Diagrammi di flusso eseguibili]], [[Editor di codice]]
- [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]
