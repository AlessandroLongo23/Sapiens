# Come si scrive una lezione di Sapiens

Brief per la revisione delle 18 lezioni di matematica già pubblicate (23 settembre 2026) e per
quelle nuove. È una proposta: quando Alessandro la approva, diventa la nota
"Standard di qualità" del vault.

## Per chi scriviamo

Studenti delle superiori, soprattutto del biennio (14-16 anni), che aprono la lezione per uno di
tre motivi: non hanno capito in classe, devono fare i compiti, hanno una verifica. Leggono spesso dal
telefono. Vogliono capire in fretta e vedere come si fa. Il libro di testo ce l'hanno già: la lezione
deve essere più chiara del libro, non più lunga.

## Prima di tutto, la matematica giusta

- Ogni definizione, proprietà ed esempio va controllato. Ogni conto degli esempi svolti va rifatto.
- Le convenzioni sono quelle della scuola italiana: 0 appartiene a ℕ; virgola decimale ($0{,}5$, in
  LaTeX con `{,}`); moltiplicazione con $\cdot$; $x_1 < x_2$ quando le soluzioni sono due; MCD e mcm
  come nei titoli del sito (MCD e MCM). Dove i libri non sono d'accordo (per esempio i nomi delle
  proprietà delle operazioni, o se l'equazione monomia si chiama così), si segue la scelta più diffusa e si segnala il dubbio
  nelle note di revisione.
- Una affermazione vera solo in parte è un errore: meglio dire meno e dire giusto.

## Una lezione, un argomento

La lezione tratta l'argomento del suo titolo, e solo quello. Il resto del capitolo ha le sue
lezioni (elenco completo con gli URL in `docs/lezioni/url.md`): quando serve un prerequisito o un
argomento vicino, si mette un link alla sua lezione invece di rispiegarlo. I link sono relativi,
nella forma `[testo](/materiale/scuola-superiore/matematica/<capitolo>/<lezione>)`, e usano solo
URL presenti in quell'elenco.

## Struttura

Nessuno schema fisso, ma di solito:

1. Due o tre frasi di apertura: cos'è e a cosa serve, con un esempio concreto se c'è.
2. Definizioni e proprietà, ognuna seguita subito da un esempio.
3. Il procedimento, quando l'argomento ne ha uno, in passi numerati.
4. Esempi svolti, dal più semplice al meno semplice, almeno tre per le lezioni di procedimento. Gli
   esempi coprono i casi che uno studente incontra in verifica, compresi quelli scomodi (segni
   negativi, frazioni, casi limite).
5. Errori frequenti: gli sbagli veri che fanno gli studenti, con il perché. Ognuno va subito dopo
   la regola o l'esempio a cui si riferisce, in un riquadro `ad-warning`; solo quelli generici, che
   non hanno un punto preciso, vanno in una sezione "Errori frequenti" in fondo.
6. Un riepilogo breve solo se la lezione è lunga. Niente riepilogo che ripete tutto.

Dopo gli esempi svolti di un argomento può venire un esercizio guidato, in cui lo studente fa una parte dei
passaggi: vedi la sezione "Esercizio guidato".

## Formato

- La prima riga è `# Titolo della lezione`, la seconda è vuota: il sito le scarta, perché la pagina ha
  già il titolo. Il testo vero comincia dalla terza riga.
- Titoli di sezione `##` e `###` con la maiuscola solo alla prima parola ("Formula risolutiva", non
  "Formula Risolutiva"). Niente numeri nei titoli ("## 3. Formula"), niente `---` tra le sezioni.
  I titoli dicono cosa c'è nella sezione, non "Introduzione" o "Consigli utili".
- Formule inline con `$...$`, formule in evidenza con `$$...$$` su righe proprie.
- Riquadri con i blocchi del sito, usati con misura:
  - ` ```ad-example ` per gli esempi svolti (la prima riga, se è testo semplice, diventa il titolo del
    riquadro: "Esempio 1: due soluzioni distinte");
  - ` ```ad-warning ` per gli errori frequenti;
  - ` ```ad-tip ` per un trucco o un controllo veloce;
  - ` ```ad-note ` per una precisazione che si può saltare.
- Tabelle solo per confronti veri (casi del discriminante, proprietà delle operazioni).
- Grassetto solo per il termine nel punto in cui viene definito. Niente grassetto per enfasi.
- Le figure si disegnano, non si descrivono: ogni diagramma di Eulero-Venn, diagramma a frecce,
  grafico o retta dei numeri a cui il testo si riferisce va nella lezione come blocco ` ```tikz `,
  subito dopo il paragrafo a cui si riferisce; la figura di un esempio va dentro il riquadro
  dell'esempio, dopo il testo che la spiega. Una sezione che parla di un diagramma senza mostrarlo è incompleta. Ogni blocco
  comincia con due commenti: `% nome:` (poche parole con i trattini, diventa il nome del file SVG,
  per esempio `diagramma-venn-unione`) e `% alt:` (una frase che dice cosa mostra la figura, per
  Google Immagini e per la sintesi vocale). La riga `% svg:` la scrive lo script di pubblicazione. TikZJax, che li disegna
  nel browser, ignora `\clip`, e un riempimento bianco usato per "cancellare" diventa una macchia
  nel tema scuro: le zone si colorano con percorsi esatti (archi) o con `even odd rule`. Ogni
  disegno va guardato sul sito, in chiaro e in scuro, prima di pubblicarlo.

## Come si scrive

- Si dà del tu allo studente. Nelle dimostrazioni va bene "noi" ("abbiamo trovato che").
- Frasi di lunghezza varia, periodi costruiti con le subordinate, non una fila di frasi corte tutte
  uguali. Un paragrafo, un'idea.
- Parole semplici e precise. Il termine tecnico si introduce, si spiega una volta e poi si usa sempre
  quello, senza sinonimi di comodo.
- Niente trattini lunghi (—); si usano virgole, due punti, parentesi.
- Da non usare mai: "piuttosto che" nel senso di "invece di"; "è importante notare/sottolineare
  che"; "vediamo insieme", "andiamo a vedere", "scopriamo"; "in conclusione", "in sintesi";
  "fondamentale", "cruciale", "essenziale" come riempitivi; domande retoriche per aprire una
  sezione; "semplicemente", "basta" quando il passaggio non è semplice per chi legge; emoji.
- Niente frasi che annunciano ("In questa lezione vedremo..."): si comincia dal contenuto.

## Esercizio guidato

Tra gli esempi svolti e gli esercizi c'è un salto: un esempio si legge fino in fondo senza accorgersi di non aver
capito. L'esercizio guidato è un esempio svolto in cui a certi punti la spiegazione si ferma, e lo studente deve
fare il passaggio e confermare prima di vedere il seguito. Si scrive a mano, con il blocco ` ```guidato ` (la
sintassi è in `README.md`). Il primo è nella lezione 121.

Dove sta e che cosa svolge:

- Dopo gli esempi svolti dell'argomento a cui si riferisce, fuori dai riquadri, e prima che la lezione passi a un
  altro argomento. Uno per lezione di solito; due solo se la lezione ha due procedimenti diversi.
- È un esercizio del tipo che lo studente troverà in verifica e tra gli esercizi della lezione. Non ripete un
  esempio svolto che sta poco sopra: o prende il suo posto, o ha numeri diversi e almeno una difficoltà in più
  (un segno, una base minore di $1$, una soluzione da scartare).
- Il titolo dice che esercizio è ("Un'esponenziale decrescente spostata in giù"), come il titolo di un esempio. La
  parola "guidato" la mette la pagina.

Come si scrive il testo:

- Comincia dalla consegna, in una frase, come la scriverebbe un libro di esercizi.
- Ogni passaggio dice che cosa si fa e perché si fa così: è la spiegazione di un insegnante accanto allo studente,
  non l'elenco delle righe del conto. Valgono le regole di "Come si scrive".
- Il testo prima di una fermata porta lo studente fino alla domanda, e gli dà quello che serve per rispondere senza
  dare la risposta. Il testo dopo riparte dalla risposta e la giustifica: deve reggere anche per chi ha sbagliato,
  per chi si è fatto mostrare il passaggio e per chi è andato avanti senza rispondere.
- Letto di fila, senza le fermate, deve essere un esempio svolto completo: è così che lo vedono Google, chi stampa
  la lezione e chi ha JavaScript spento. Se il grafico serve a capire, in fondo ci va una figura `tikz`.

Come si scelgono le fermate:

- Una fermata sta dove gli studenti sbagliano davvero: il verso che si inverte, il segno, la soluzione da scartare,
  la condizione dimenticata, l'esponente negativo. Per trovarle si parte dai riquadri `ad-warning` della lezione.
- Da due a quattro per esercizio. Non una a ogni riga: i passaggi di routine si spiegano e basta, altrimenti
  l'esercizio diventa un modulo da compilare.
- La domanda chiede una cosa sola, e si capisce senza rileggere tutto: "Scrivi l'ascissa del punto in cui il
  grafico incontra l'asse $x$", non "Completa".
- Il tipo segue la risposta. `scrivi` per un numero, le soluzioni di un'equazione, un'espressione, una retta.
  `scegli` per quello che il correttore non legge (intervalli, disequazioni, logaritmi) e per le decisioni: il
  verso, quale soluzione si scarta, quale regola si applica. `cursore` quando la risposta si vede su un grafico:
  portare l'asintoto al suo posto, la retta finché è tangente.
- L'ultima fermata non è l'ultima riga: dopo c'è sempre il testo che chiude, con il risultato e, se serve, la
  verifica.

I messaggi di errore:

- Per ogni fermata si scrivono gli errori che uno studente fa davvero, di solito da uno a tre, ognuno con il suo
  messaggio. Un errore previsto è il risultato di uno sbaglio preciso (ha preso $a^0 = 0$, ha dimenticato di
  cambiare il verso), non un numero a caso.
- Il messaggio dice che cosa è andato storto e rimette sulla strada, senza dare la risposta: "Hai sostituito
  $x = 1$. Sull'asse $y$ l'ascissa è $0$." Una o due frasi.
- Il tono è quello di chi corregge un compito accanto allo studente: si descrive il passaggio, non lo studente.
  Niente "Sbagliato!", "Attento!", "Ops", punti esclamativi, e niente "è facile" o "basta".
- `aiuto:` è la riga per chi sbaglia in un modo non previsto: un indizio su come partire ("Sostituisci $x = 0$
  nella funzione"), non la soluzione.
- In una fermata `scegli` le opzioni sbagliate sono gli errori veri, e ognuna ha il suo messaggio; niente opzioni
  messe per fare numero.

Prima di consegnare: ogni risposta attesa e ogni errore previsto si rifanno con SymPy, come i conti degli esempi;
`scripts/lezioni/check.mts` deve passare (prova ogni risposta attesa e ogni errore previsto con il correttore vero);
l'esercizio si fa per intero nel browser, sbagliando apposta almeno una volta per fermata, su `/prova-grafico/lezione`
a 390 px. Nelle note della lezione va una sezione sull'esercizio guidato: quale esempio, perché quelle fermate,
quali errori sono previsti.

## Cosa consegnare

Per ogni lezione due file:

- `docs/lezioni/riscritte/NN-slug.md`: la lezione riscritta, pronta per il database.
- `docs/lezioni/note/NN-slug.md`: note di revisione per Alessandro, in italiano, brevi. Errori trovati
  nell'originale (citando la frase); cosa è stato tolto, spostato o aggiunto e perché; dubbi da
  decidere (convenzioni, argomenti che forse appartengono a un'altra lezione); figure da fare.

## Formulario

Il formulario è la pagina che lo studente apre il giorno prima della verifica, o con il quaderno
aperto sui compiti: tutto quello che serve della lezione, da ritrovare con un colpo d'occhio. Non
spiega, ricorda.

- File `docs/lezioni/formulari/NN-slug.md`, stesso numero e slug della lezione. Prima riga
  `# Formulario: Titolo della lezione`, seconda riga vuota.
- La fonte è la lezione pubblicata (`docs/lezioni/pubblicate/NN-slug.md`): stesse notazioni, stessi
  nomi, stesse convenzioni. Niente che la lezione non dica; se nella lezione manca qualcosa che nel
  formulario servirebbe, si segnala nelle note, non si aggiunge.
- Sezioni `##` nell'ordine della lezione, con titoli che dicono cosa contengono.
- Ogni voce è il nome in parole (una riga al massimo) seguito dalla formula, in evidenza con `$$`
  quando è la formula da ricordare. Un esempio numerico di una riga dove chiarisce più della formula
  (le proprietà delle potenze, i prodotti notevoli), non dappertutto.
- I procedimenti in passi numerati, al massimo cinque o sei passi di una riga.
- Tabelle per i confronti tra casi (segno del discriminante, proprietà di unione e intersezione).
- Gli errori più costosi, al massimo tre, in un riquadro ` ```ad-warning ` con titolo e una riga di
  testo; niente altri riquadri.
- Una figura solo se il formulario senza sarebbe meno chiaro (i diagrammi di Venn delle operazioni):
  in quel caso si copia il blocco ` ```tikz ` della lezione così com'è, comprese le righe `% nome`,
  `% alt` e `% svg`. Niente figure nuove.
- Lunghezza: una o due schermate del telefono. Se diventa più lungo, sta rispiegando la lezione.
- Valgono le regole di "Come si scrive" (niente trattini lunghi, niente riempitivi) e del formato
  (virgola decimale con `{,}`, `\cdot`, maiuscola solo alla prima parola dei titoli).

## Flashcard

Le flashcard servono a ripassare: lo studente legge la domanda, risponde a mente, gira la carta e
dice a se stesso se la sapeva. Ogni carta si risolve in pochi secondi, senza carta e penna. Gli
esercizi con i conti lunghi sono dei generatori, non delle flashcard.

- File `docs/lezioni/flashcard/NN-slug.md`. Prima riga `# Flashcard: Titolo della lezione`, seconda
  riga vuota. Poi le carte, ognuna così:

  ```
  ## unione-definizione
  Che cos'è l'unione di due insiemi $A$ e $B$?
  ---
  L'insieme degli elementi che appartengono ad $A$, a $B$ o a entrambi.
  ```

  La riga `## ` porta l'id della carta: minuscole, cifre e trattini, unico nel file, e dice di cosa
  parla la carta. Una volta pubblicato l'id non cambia più, perché i progressi dello studente si
  attaccheranno a quello. Poi la domanda, una riga con solo `---`, la risposta.
- Da 12 a 20 carte per lezione, nell'ordine della lezione, e ognuna chiede una cosa sola.
- Tipi di carta, mescolati: definizione (termine → definizione); il contrario (simbolo, formula o
  descrizione → nome); regola o formula da completare; vero o falso, con il perché nella risposta;
  un conto che si fa a mente in pochi secondi; l'errore frequente ("Quanto vale $(-2)^2$? E
  $-2^2$?").
- La domanda è corta e ha una sola risposta giusta. Niente "Cosa sai di...", niente domande a cui si
  può rispondere in tre modi diversi e tutti giusti.
- La risposta comincia dalla risposta ("$\{1, 2, 3\}$.", "Falso."), poi al massimo una frase di
  perché. Niente elenchi lunghi da imparare a memoria.
- Dentro le carte solo testo e formule: niente riquadri, figure, titoli o tabelle.
- Stesse notazioni e convenzioni della lezione, e niente che la lezione non dica.

Controllo automatico per formulari e flashcard, come per le lezioni:
`node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts <file>`.
