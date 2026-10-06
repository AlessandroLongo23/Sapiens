# Note: Il percettrone

Prima lezione del capitolo pilota (3.1 del programma, vedi `vault/Contenuti/Programma di intelligenza artificiale.md`), scritta il 5 ottobre 2026. Pubblicata il 6 ottobre 2026 nel corso di Deep learning (`/materiale/universita/deep-learning/dal-neurone-alla-rete/il-percettrone`), con `scripts/lezioni/publish.mts --dir docs/lezioni/universita/intelligenza-artificiale --per-slug`; `originali/index.json` porta l'id della lezione e si allunga a ogni lezione nuova. In produzione le tre figure interattive mancano finché il loro codice non è pubblicato. Con il sito in sviluppo si guarda anche a:
`/prova-grafico/lezione?file=universita/intelligenza-artificiale/riscritte/01-dl-percettrone.md`.

## Che cosa c'è

- Il testo, con cinque figure TikZ: lo schema del percettrone, la retta di decisione, AND e OR separabili, lo XOR con le due diagonali, la rete con due unità nascoste.
- Tre figure interattive, in `src/components/content/interactive/ia/`:
  - `percettrone-separa-a-mano`: lo studente sposta la retta e conta gli ingressi giusti; con lo XOR non supera 3 su 4;
  - `percettrone-regola-apprendimento`: un addestramento vero, rifatto a ogni corsa. I pesi di partenza sono estratti a caso tra −1 e 1, l'ordine degli esempi si rimescola a ogni epoca, il tasso di apprendimento si sceglie con un cursore (da 0,05 a 1, all'inizio 0,2), e la retta è disegnata dai pesi del momento. Si avvia, si ferma, si riprende, si fa un esempio alla volta, e «Nuovi pesi» riparte da capo. Con AND e OR si ferma da solo alla prima epoca senza errori; con lo XOR va avanti finché lo studente non lo ferma. La prima versione partiva da pesi nulli con gli esempi in ordine fisso: Alessandro ha chiesto di cambiarla il 5 ottobre 2026;
  - `rete-xor-strato-nascosto`: la rete a mano che calcola lo XOR, con il piano delle unità nascoste accanto.
- Un esercizio di codice in Python (completare la correzione dei pesi), con tre prove.
- `rete.tsx` è il primo pezzo del componente per disegnare una rete: spessore e grigio della linea dicono il peso, il tratteggio il segno, il colore dell'unità la sua attivazione. Per ora i pesi sono fissi; nelle prossime lezioni dovrà seguire un addestramento.

Mancano formulario e flashcard.

## Numeri controllati

I conti della lezione vengono da `ia/regola.ts`, lo stesso file che usano le figure, eseguito il 5 ottobre 2026:

- AND, da pesi nulli, con η = 1 e gli ingressi in ordine: errori per epoca 1, 3, 3, 2, 1, 0; dieci correzioni; pesi finali (2, 1), bias −2.
- OR: errori 1, 2, 1, 0; pesi finali (1, 1), bias 0.
- XOR: errori 2, 3, 4, poi 4 per sempre; i pesi a fine epoca sono (−1, 0) con bias 1 dalla seconda epoca in poi.

Questi numeri valgono per il testo (esempio 2, il caso dello XOR seguito a mano) e per l'esercizio di codice. La figura dell'addestramento parte da pesi casuali e non li riproduce: nel browser, tre corse su AND si sono fermate da sole con 4 ingressi giusti su 4 (dopo 4, 5 e 11 epoche), e una corsa su XOR dopo 17 epoche stava ancora correggendo. La soluzione dell'esercizio di codice passa le sue prove (`scripts/codice/verifica.mts`).

Il limite del teorema per l'AND (51 correzioni) è calcolato a mano con il vettore (2, 2, −3)/√17: da ricontrollare in rilettura. Non è detto che sia il margine migliore, e la lezione non lo afferma.

## Fonti: che cosa è stato letto e dove

Il metodo deciso chiede di leggere le fonti prima di scrivere. Qui gli articoli originali non sono stati letti: i fatti storici vengono da fonti secondarie, consultate il 5 ottobre 2026.

| Fatto nella lezione | Da dove viene |
|---|---|
| McCulloch e Pitts 1943, titolo e rivista | voce "Perceptron" di Wikipedia in inglese, bibliografia |
| Rapporto di Rosenblatt del 1957, finanziamento dell'Office of Naval Research, simulazione sull'IBM 704 | stessa voce |
| Articolo del 1958 sulla Psychological Review, volume e pagine | stessa voce; il PDF dell'articolo (ling.upenn.edu) ha risposto 403 e non è stato letto |
| New York Times, 8 luglio 1958, titolo, le cinquanta prove, le schede segnate a sinistra e a destra, la frase sulle attese della marina | risultati di ricerca (tra cui una pagina di Cornell); l'articolo non è stato letto |
| Mark I Perceptron: 400 fotocellule in griglia 20 per 20, potenziometri, presentazione nel 1960 | voce "Perceptron" di Wikipedia. La voce "Mark I Perceptron" dice invece 1958: le date non coincidono |
| I tre strati S, A, R della macchina di Rosenblatt | a memoria, coerente con le due voci |
| Novikoff 1962, e il limite (R/γ)² | voce "Perceptron" e risultati di ricerca; la dimostrazione nella lezione è quella standard, riscritta |
| Minsky e Papert: parità e connessione come esempi principali, non lo XOR | voce "Perceptrons (book)" di Wikipedia |
| La frase sul "giudizio intuitivo" e "sterile", capitolo 13, pagine 231-232 | Quote Investigator, 24 luglio 2026, che riporta le scansioni del libro |
| Minsky e Papert nel 1988 sulle cause del calo della ricerca | voce "Perceptrons (book)" |
| 14 funzioni separabili su 16, 104 su 256, 1882 su 65 536 | a memoria (successione delle funzioni a soglia); da verificare |
| Rumelhart, Hinton e Williams 1986, Nature 323 | a memoria |

Da leggere alla fonte prima di pubblicare: Rosenblatt 1958, il capitolo 13 di Minsky e Papert, Novikoff 1962.

### Link nelle fonti

Aggiunti il 5 ottobre 2026, su richiesta di Alessandro.

- McCulloch e Pitts 1943, Rosenblatt 1958, Rumelhart, Hinton e Williams 1986: link al DOI. I tre DOI sono stati risolti e i dati (titolo, rivista, volume, pagine, anno) coincidono con quelli del registro Crossref: per questi tre la citazione è verificata, e le righe "a memoria" della tabella qui sopra non valgono più per Rumelhart.
- Novikoff: il volume del simposio del 1962 non ha un indirizzo. Il link porta alla copia su Internet Archive del rapporto dello Stanford Research Institute del gennaio 1963 (DTIC AD0298258), che ha il titolo con "for" al posto di "on"; la pagina esiste.
- Minsky e Papert: pagina del libro sul sito della MIT Press (edizione ampliata). L'indirizzo viene dai risultati di ricerca; il sito respinge le richieste automatiche, quindi non è stato aperto.
- New York Times: l'indirizzo è quello dell'archivio del giornale, scritto a memoria. Il sito respinge le richieste automatiche: è l'unico link non verificato, da aprire a mano.
- Rapporto di Rosenblatt del 1957: nessun link, non ne ho trovato uno affidabile.

Il controllo automatico segnala ogni link esterno con un avviso ("link esterno"): è previsto per le lezioni delle superiori, dove i link sono interni. Qui sono sei avvisi attesi.

## Dubbi da decidere

1. Convenzione sulla soglia: la lezione usa uscite 0 e 1, con risposta 0 quando la somma è nulla. Per il teorema passa a classi +1 e −1. Molti testi usano solo ±1: scegliere una convenzione per tutto il corso.
2. Notazione: vettori in grassetto, bias $b$, bersaglio $t$, tasso $\eta$. Goodfellow e Bishop usano lettere diverse tra loro: anche questa va fissata una volta.
3. La dimostrazione del teorema di convergenza sta nel testo. È corta, ma si può spostare in un riquadro da saltare.
4. Dove sta il percettrone nel programma. Sei atenei lo insegnano tra i modelli lineari (2.3), prima delle reti; qui apre il capitolo 3.1, come chiesto per il pilota. Se la proposta 2 del confronto con i syllabus passa, questa lezione si divide: regola e teorema in 2.3, XOR e strato nascosto in 3.1.
5. L'ultima sezione anticipa lo strato nascosto. Serve a chiudere il discorso sullo XOR, ma è l'apertura della lezione successiva: decidere quanto lasciarne qui.
6. Lunghezza: 27.000 caratteri, più di una lezione delle superiori. Si può dividere in due (il percettrone e la sua regola; lo XOR e i limiti).
7. I titoli con i nomi propri fanno scattare l'avviso "maiuscole all'inglese" del controllo automatico: è un falso allarme.
8. Le parole in inglese: "bias" resta in inglese come nei corsi italiani letti; "bersaglio" per target, "tasso di apprendimento" per learning rate, "strato nascosto" per hidden layer.

## Figure

Le cinque TikZ sono state compilate e guardate in chiaro. Le tre interattive sono state guardate in chiaro da computer; la rete anche in scuro e a larghezza di telefono. Non sono state provate su un telefono vero né con la tastiera.
