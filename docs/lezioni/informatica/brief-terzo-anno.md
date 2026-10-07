# Brief del terzo anno di informatica (7 ottobre 2026)

Per chi scrive un gruppo di lezioni del terzo anno di informatica delle superiori (liceo scientifico, opzione
scienze applicate). Il biennio (lezioni 1-64) è scritto e pubblicato, con esercizi, formulari e flashcard. Questo
lotto scrive le 34 lezioni del terzo anno, file 65-98. Ogni gruppo scrive due o tre lezioni e consegna tutto:
lezione, nota, formulario, flashcard, figure, elementi interattivi, generatore di esercizi con specifica e
controllo.

Alessandro ha chiesto una cura particolare per gli elementi interattivi dentro la lezione: sono la ragione per cui
una lezione di Sapiens vale più della pagina di un libro. Vedi "Elementi interattivi".

## Regole che non si discutono

- Non si pubblica nulla: niente scritture nel database, niente `publish.mts`, niente commit, niente push.
- Si lavora solo in `/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo`. Mai nella cartella
  `/Users/alessandro/Desktop/Personal/Sapiens`, dove lavorano altre sessioni.
- Altri 13 gruppi stanno lavorando nella stessa cartella. Mai `git checkout --`, `git restore`, `git reset`,
  `git stash`, `git clean`, `git add`, `git commit`, e mai `rm` o una riscrittura intera di un file che non hai
  creato tu. Niente `pkill` o `killall`. Se un file che non è tuo ti dà un errore, lo riporti e vai avanti.
- Crei e modifichi solo i file delle tue lezioni, più la registrazione qui sotto. I file condivisi
  (`src/lib/exercises/index.ts`, `config.ts`, `level-names.ts`, `v2/open-answers.ts`, `v2/inf-programmi.ts`,
  `v2/inf-codice.ts`, `v2/costrutti.ts`, `v2/types.ts`, `interactive/kit.tsx`, `interactive/informatica.tsx` e i
  pezzi comuni di `interactive/informatica/`, `src/lib/informatica/`, `src/components/codice/`, `url.md`,
  `albero.md`, i README, il vault) li tocca solo chi coordina. Un pezzo comune che ti serve e non c'è va in un file
  nuovo tuo, e lo segnali nel rapporto.
- La registrazione: una figura interattiva in `FIGURES` di `src/lib/utils/interactive.ts`, sotto il commento del tuo
  gruppo (`// Computer science, third year: ... (group NN).`), con una modifica mirata di poche righe. Una figura si
  registra solo dopo che il suo file esiste e compila: una registrazione anticipata blocca il sito a tutti.
- Il sito di sviluppo è già acceso sulla porta 3133. Non avviarne un altro e non fermarlo: agli script di anteprima
  si passa `--porta 3133`.
- I file temporanei (anteprime, script di controllo) vanno in una sottocartella tua dello scratchpad, indicata nel
  messaggio di avvio. Niente file nella radice del repo.
- `npx tsc --noEmit -p .` gira sull'intero progetto: lancialo al massimo due volte, alla fine, e guarda solo gli
  errori nei tuoi file.

## Le lezioni e i gruppi

| N | slug | Titolo | Gruppo |
|---|---|---|---|
| 65 | inf-definire-funzioni | Definire e chiamare una funzione | 1 |
| 66 | inf-parametri-ritorno | Parametri e valore di ritorno | 1 |
| 67 | inf-visibilita | Variabili locali e globali | 2 |
| 68 | inf-passaggio-parametri | Passaggio dei parametri per valore e per riferimento | 2 |
| 69 | inf-top-down | Scomporre un problema: la progettazione top-down | 2 |
| 70 | inf-vettori | I vettori | 3 |
| 71 | inf-ricerca-sequenziale | La ricerca sequenziale | 3 |
| 72 | inf-matrici | Le matrici | 4 |
| 73 | inf-stringhe | Le stringhe | 4 |
| 74 | inf-ricerca-binaria | La ricerca binaria | 5 |
| 75 | inf-selection-sort | L'ordinamento per selezione | 5 |
| 76 | inf-bubble-sort | L'ordinamento a bolle | 6 |
| 77 | inf-insertion-sort | L'ordinamento per inserimento | 6 |
| 78 | inf-confronto-algoritmi | Confrontare gli algoritmi contando le operazioni | 6 |
| 79 | inf-file-testo | Leggere e scrivere un file di testo | 7 |
| 80 | inf-file-csv | File di dati in formato CSV | 7 |
| 81 | inf-xml-json | Dati strutturati: XML e JSON | 7 |
| 82 | formati-multimediali | I formati dei file multimediali | 8 |
| 83 | inf-bitmap-vettoriale | Grafica bitmap e grafica vettoriale | 8 |
| 84 | inf-compressione | La compressione dei dati, con e senza perdita | 8 |
| 85 | inf-audio-video | Audio e video digitali | 9 |
| 86 | inf-font | Caratteri tipografici e font | 9 |
| 87 | inf-markup | I linguaggi di markup | 9 |
| 88 | inf-html-struttura | Struttura di una pagina HTML | 10 |
| 89 | inf-html-testo-link | Testo, link e immagini | 10 |
| 90 | inf-html-elenchi-tabelle | Elenchi e tabelle | 11 |
| 91 | inf-html-moduli | I moduli | 11 |
| 92 | inf-css-regole | Regole e selettori CSS | 12 |
| 93 | inf-css-box | Il modello a scatola | 12 |
| 94 | inf-css-layout | L'impaginazione di una pagina web | 13 |
| 95 | inf-responsive | Pagine responsive e accessibili | 13 |
| 96 | inf-script-client | Gli script nella pagina web | 14 |
| 97 | inf-dom-eventi | Il DOM e gli eventi | 14 |
| 98 | inf-validazione-moduli | Controllare i dati di un modulo | 14 |

Il nome di ogni file è `NN-slug.md` con questi numeri e questi slug esatti: lo script di pubblicazione li cerca
così.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto, tranne la sezione
   "Esercizio guidato", che in questo lotto non si usa.
2. `docs/lezioni/informatica/README.md`, per intero: le convenzioni di informatica, la sezione "Programmazione" e la
   sezione "Figure interattive" con i pezzi del kit.
3. `docs/lezioni/README.md`, le sezioni "I programmi da eseguire" (programmi, pagine web, progetti a più file, file
   letti e scritti da un programma) e "Il diagramma di flusso da eseguire".
4. `docs/lezioni/informatica/albero.md`: il terzo anno per intero (che cosa sta nella tua lezione e che cosa in
   quelle vicine) e uno sguardo al quarto anno (ricorsione, classi e oggetti, pila e coda, basi di dati, reti), per
   non anticipare quello che ha la sua lezione più avanti.
5. `docs/lezioni/informatica/url.md` e `docs/lezioni/url.md`: gli indirizzi per i link. Si linkano le lezioni di
   informatica del biennio e del terzo anno (che si pubblica insieme) e quelle di matematica fino alla 129. Non le
   lezioni vuote del quarto e del quinto anno.
6. Le lezioni del biennio su cui la tua si appoggia, in `docs/lezioni/informatica/riscritte/`, per non rispiegarle e
   per usare le stesse parole: vedi "Confini già fissati".
7. Una lezione finita con i suoi quattro file, per la forma. Con la programmazione: `riscritte/60-inf-ciclo-while.md`
   e `riscritte/64-inf-massimo-minimo-media.md` con gli omonimi in `note/`, `formulari/`, `flashcard/`. Di concetto:
   `riscritte/22-inf-file-system.md`. Con una pagina web: `riscritte/36-http-html.md`.
8. Per gli esercizi: `docs/lezioni/informatica/brief-esercizi-codice.md` e
   `docs/lezioni/informatica/brief-esercizi-secondo-anno.md`.

## Che cosa sa lo studente

Ha 16 anni ed è al terzo anno. Di informatica ha fatto il biennio: codifica di numeri, testi, immagini e suoni,
architettura, sistema operativo e file system, foglio di calcolo, Internet e il web, sicurezza, algoritmi e
diagrammi di flusso, variabili e tipi, lettura e scrittura, selezione, cicli `while` e `for`, cicli annidati,
contatori e accumulatori, massimo, minimo e media. Scrive programmi di una ventina di righe in Python e in C++, senza
funzioni sue e senza vettori. Non ha mai scritto una pagina web: la lezione 36 gli ha mostrato che cos'è l'HTML e
come viaggia.

## Scelte del lotto (del 7 ottobre 2026, da confermare con Alessandro e Andrea)

- **Linguaggi, lezioni 65-80.** Ogni programma è in Python e in C++, in due blocchi `codice` consecutivi, come nel
  secondo anno. Il testo parla del concetto con parole che valgono per tutti e due; quello che cambia sta in un
  riquadro `ad-note` dopo il programma.
- **Funzioni.** In C++ la funzione si definisce prima di `main`, senza prototipi (un riquadro nella 65 dice che
  esistono). `void` per le funzioni che non restituiscono niente; in Python si dice che restituiscono `None` solo
  dove serve. Parole: "definire" e "chiamare" una funzione, "parametro" nella definizione e "argomento" nella
  chiamata, "valore di ritorno", "restituire".
- **Passaggio dei parametri (68).** In C++: per valore e per riferimento con `&`. In Python non c'è la scelta: il
  nome del parametro si lega allo stesso oggetto, e conta se l'oggetto si può modificare (una lista) o no (un
  numero, una stringa). La lezione spiega i due modelli uno per linguaggio, senza forzare Python dentro le parole
  del C++, e mostra lo scambio di due variabili nei due modi (in Python restituendo due valori). I puntatori non si
  nominano.
- **Vettori.** In C++ array a dimensione fissata da una costante (`const int N = 5; int v[N];`), come nei libri del
  liceo, passati a una funzione come `int v[], int n`; `vector` compare solo in un riquadro della 70. In Python le
  liste, con `len` e `append`. Gli indici partono da 0 e lo si dice subito. Parola: "vettore" nel testo, con "array"
  e "lista" come nomi nei due linguaggi; "elemento", "indice", "dimensione".
- **Matrici.** In C++ `int m[R][C]` con le costanti; in Python lista di liste. "Riga" e "colonna", `m[i][j]` con `i`
  riga e `j` colonna, sempre.
- **Stringhe.** In C++ `string` (con `#include <string>`), non array di `char`; in Python `str`. Lunghezza, accesso
  al carattere, scorrimento con un ciclo, concatenazione, confronto, qualche metodo utile nei due linguaggi.
- **Ordinamenti.** Sempre in ordine crescente, su un vettore `v` di `n` elementi, scritti come funzione
  `void ordina(int v[], int n)` e `def ordina(v):`. Lo scambio con una variabile `temp` nei due linguaggi (la 75
  dice in un riquadro che Python ha anche `v[i], v[j] = v[j], v[i]`). Nomi: `i` per il giro esterno, `j` per quello
  interno, `imin` per l'indice del minimo, `scambiato` per la bandierina dell'ordinamento a bolle. Niente notazione
  O grande: si contano confronti e scambi, e la 78 arriva a "cresce come $n^2$" e "cresce come $\log_2 n$" a parole e
  con le tabelle.
- **File (79-81).** In Python `open` dentro `with`; in C++ `ifstream` e `ofstream` (`#include <fstream>`). I file
  stanno nel progetto, come linguette accanto al programma. La 81 è una lezione sui formati: gli esempi con un
  programma sono solo in Python (modulo `json`), e lo dice.
- **Pagine web (87-98).** HTML5, con il doctype e `lang="it"`. Elementi semantici (`header`, `nav`, `main`,
  `footer`) dalla 88. CSS in un file separato, mai attributi di presentazione nell'HTML. Impaginazione con flexbox
  (e griglia solo nominata); niente `float` per impaginare, niente tabelle per impaginare. JavaScript in un file
  separato, `const` e `let`, `querySelector`, `addEventListener`, niente `onclick` nell'HTML, niente librerie.
- **Diagrammi di flusso.** Il linguaggio dei blocchi `diagramma` non ha funzioni né vettori: un diagramma compare
  solo dove il programma si può scrivere così (di rado, in questo lotto). Al suo posto ci sono le figure del kit.
- **Nomi delle variabili.** Come nel secondo anno: una lettera per contatori e numeri senza significato, un nome
  intero in minuscolo e senza accenti quando il valore è qualcosa (`voti`, `media`, `trovato`, `nome`).

## Cosa consegnare per ogni lezione

| File | Cosa |
|---|---|
| `docs/lezioni/informatica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/informatica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, cose da verificare |
| `docs/lezioni/informatica/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/informatica/flashcard/NN-slug.md` | da 12 a 20 flashcard |
| `src/components/content/interactive/informatica/<Nome>.tsx` | le figure interattive, registrate |
| `specs/exercises/<slug>.md` | la specifica degli esercizi |
| `src/lib/exercises/v2/generators/<slug>.ts` | il generatore, `default` con `id` uguale allo slug |
| `scripts/exercises/checkers/<slug con _ al posto di ->.py` | il controllo indipendente, scritto dalla specifica |

### La lezione

- Si legge in 10-15 minuti, senza contare il tempo passato a eseguire e a provare. Con la programmazione (65-80):
  da 50 a 90 righe di testo da leggere, più programmi e figure, non oltre 400 righe in tutto. Di concetto (81-87):
  tra 120 e 200 righe. Con le pagine web (88-98): da 50 a 90 righe di testo, più le pagine, non oltre 400 righe.
- Una lezione, un argomento: quello del titolo. I confini con le lezioni vicine sono in "Confini già fissati"; quelli
  tra le tue lezioni li decidi tu e li scrivi nella nota.
- Si parte da un problema che lo studente riconosce (i voti del quadrimestre, la classifica di un torneo, la rubrica
  del telefono, la pagina di un gruppo musicale, il modulo di iscrizione a una gita), poi l'idea, poi il programma
  o la pagina da eseguire, poi che cosa provare a cambiare e che cosa aspettarsi.
- Ogni idea nuova ha un esempio che gira. Le lezioni di concetto non sono elenchi di definizioni: spiegano perché
  una cosa è fatta così, con un conto o un ragionamento da fare.
- Gli errori veri degli studenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono (l'indice
  fuori dal vettore, `return` dimenticato, la funzione definita e mai chiamata, il file aperto e non chiuso, il tag
  non chiuso, il selettore che non prende niente, lo script che gira prima che la pagina esista).
- In fondo una sezione "Prova tu" con almeno due esercizi dal più semplice al meno semplice, ciascuno con la
  consegna prima del blocco: programmi con `%% prova` e `%% stampa` (e `%% file` dove si scrive un file), pagine con
  `%% controllo`. `%% soluzione` c'è sempre, in ogni linguaggio.
- I programmi devono funzionare davvero: `verifica.mts` per quelli con le prove; gli altri si provano, Python con
  `python3` e il C++ con `clang++`. Le pagine si aprono nel browser e si guardano.
- I fatti si controllano. Storia, norme, numeri che cambiano nel tempo, dettagli dei formati (chi ha definito che
  cosa e quando, quali browser leggono che cosa) vanno nella nota con la fonte (nome e data) oppure con "da
  verificare". Nella lezione niente numeri che invecchiano e niente versioni.
- Niente marchi nei titoli e nelle definizioni; i nomi dei prodotti solo come esempi, una volta. Indirizzi, nomi e
  dati degli esempi sono inventati e si vede (`esempio.it`, `scuola.example`).
- Scrittura: dai del tu; frasi di lunghezza varia, costruite con le subordinate; niente trattini lunghi, niente
  "piuttosto che", niente "è importante notare", "vediamo", "scopriamo", "in conclusione", "fondamentale",
  "cruciale", "essenziale", "semplicemente"; niente domande retoriche in apertura; niente emoji; grassetto solo per
  il termine nel punto in cui è definito.

### Elementi interattivi

Ogni lezione ha almeno due elementi interattivi di tipo diverso, messi nel punto del testo che spiegano, e ognuno
risponde a una domanda precisa che il testo fa prima e a cui risponde dopo, così chi non lo usa non perde niente.
Il testo dice che cosa fare ("esegui un passo alla volta fino al primo scambio e guarda `imin`", "cambia `padding`
da 0 a 20px e guarda che cosa succede alla larghezza"). Un elemento messo per fare numero è peggio di niente.

1. **Il programma da eseguire** (`codice`), nei due linguaggi: è l'esempio normale. Il testo dopo dice che cosa
   cambiare. Per i file, un progetto con il file di dati accanto al programma.
2. **La pagina web** (`codice html` con `css` e `js`, o un progetto con più pagine): dalla 87 alla 98 è il centro
   della lezione. Lo studente modifica e vede la pagina cambiare accanto. Parti da pagine piccole e complete, con
   contenuti credibili, e fai crescere la stessa pagina lungo la lezione (e lungo il capitolo, dove i gruppi si
   accordano attraverso "Confini già fissati").
3. **Una figura del kit di informatica** (blocco ` ```interattivo `, componente tuo in
   `src/components/content/interactive/informatica/<Nome>.tsx` fatto con i pezzi di `informatica.tsx`): le celle di
   un vettore, di una matrice o di una stringa con i puntatori, i passi di un algoritmo con i contatori, la pila
   delle chiamate con parametri e variabili locali, e gli altri pezzi elencati nel README. Mai un pezzo ridisegnato
   a mano se il kit lo ha. Le tracce degli algoritmi stanno in `src/lib/informatica/tracce.ts`: se la tua non c'è,
   scrivila in un file tuo accanto, come funzione pura con il suo test. Niente librerie nuove.
4. **Il diagramma di flusso** (`diagramma`), solo dove il programma si può scrivere nel suo linguaggio.
5. **Figure statiche in TikZ**, per quello che non si muove: lo schema di una chiamata, l'albero di un documento
   HTML, la struttura di un file CSV, i livelli di una scomposizione top-down. Si guardano in chiaro e in scuro.

Figure già registrate, fatte con il kit, da usare così o da adattare in un file tuo (nomi dei puntatori, frasi,
dati di partenza devono essere quelli della tua lezione e del tuo programma): `inf-ricerca-sequenziale-passi` (71),
`inf-ricerca-binaria-passi` (74), `inf-selection-sort-passi` (75), `inf-bubble-sort-passi` (76),
`inf-insertion-sort-passi` (77), `inf-scambia-valore-riferimento` (68), `inf-pixel-risoluzione-profondita` (83),
`inf-css-modello-scatola` (93). `inf-kit-campionario` mostra tutti i pezzi insieme. Se una figura esistente va
cambiata, copiala in un file tuo con un nome nuovo e registra quello: i file del kit non si toccano. Per
compressione, audio e video, font, albero del documento, flexbox, media query, DOM ed eventi non c'è ancora niente:
sono figure da progettare, con i pezzi del kit dove servono e con lo stesso linguaggio visivo.

Ogni figura interattiva si guarda sul sito di sviluppo, in chiaro, in scuro e da telefono, al primo passo, a metà e
alla fine, e dopo aver usato ogni comando:

```sh
node scripts/figure/anteprima-interattivo.mjs <uscita.png> figura=<nome> --porta 3133 [--scuro] [--telefono] [--clic "<selettore>" --attendi 800]
node scripts/figure/anteprima.mjs <cartella nello scratchpad> docs/lezioni/informatica/riscritte/NN-slug.md [--scuro]
```

La lezione intera si apre su `http://localhost:3133/prova-grafico/lezione?file=informatica/riscritte/NN-slug.md`:
guardala a 1280 e a 390 px con uno script di Playwright nello scratchpad
(`createRequire('/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo/package.json')('playwright')`), esegui
ogni programma almeno in un linguaggio, premi "Verifica" con la soluzione in ogni esercizio, e controlla che non ci
siano errori nella console, immagini mancanti o scorrimento laterale.

`anteprima-interattivo.mjs` aspetta un `<svg>` nella pagina: con una figura che non ne ha aspetta un minuto e
esce con un errore, ma lo screenshot è buono.

Negli esercizi di una pagina, `%% controllo` può essere preceduto da azioni (un clic, un testo scritto in un campo,
l'invio di un modulo) e ha regole sul comportamento: la sintassi è in `docs/lezioni/README.md`, "I programmi da
eseguire". Questa parte viene aggiunta mentre il lotto è in corso: se nel README non la trovi ancora, scrivi le
lezioni e torna a guardare prima di scrivere gli esercizi; se alla fine non c'è, usa i controlli sulla pagina
appena caricata e dillo nel rapporto.

Alessandro è esigente sull'aspetto: una figura interattiva sgraziata, con testi che si accavallano o colori a caso,
si rifà. Guardala, correggi, riguardala.

### Nota, formulario, flashcard

Come in `stile.md` e come nei file del secondo anno. La nota elenca: le scelte fatte, i dubbi per Andrea in forma di
domanda, le cose da verificare, l'elenco degli elementi interattivi con la domanda a cui rispondono, e una riga
`Prerequisiti proposti:` con al massimo quattro slug di lezioni senza le quali la lezione non si segue. Il
formulario di una lezione di programmazione raccoglie le forme da ricordare nei due linguaggi, in tabelle, con il
codice in linea o in blocchi di codice semplici (non blocchi `codice` da eseguire); quello di una lezione sul web
raccoglie tag, proprietà e sintassi. Le flashcard chiedono di riconoscere e di prevedere ("che cosa stampa", "quale
elemento prende questo selettore"), non date né nomi.

### Il generatore di esercizi

Da leggere: `scripts/exercises/README.md`, `src/lib/exercises/v2/types.ts`,
`docs/lezioni/informatica/brief-esercizi-codice.md` (il modulo `inf-codice.ts`, per i programmi scritti a mano nei
due linguaggi e per i frammenti di HTML, CSS e JavaScript), `brief-esercizi-secondo-anno.md` per le regole generali,
e un generatore del secondo anno con specifica e controllo vicino al tuo argomento.

- Un generatore per lezione, da 4 a 6 livelli nell'ordine della lezione, ognuno con una sola difficoltà in più e un
  nome di poche parole nella lingua dello studente. Stesse parole, stessi nomi e stessi procedimenti della lezione.
- Scelta multipla con quattro opzioni diverse, e i distrattori presi dagli errori veri (quelli dei riquadri
  `ad-warning`). Almeno un centinaio di esercizi diversi per livello su 1000.
- Lezioni 65-80: almeno un livello "che cosa scrive questo programma", almeno uno con programmi come opzioni, e
  almeno un livello a risposta aperta "scrivi il programma", con i costrutti chiesti dove la consegna li chiede
  (`funzione` in tutto il capitolo sulle funzioni).
- Lezioni 81-98: scelta multipla. Le domande mostrano frammenti veri (HTML, CSS, JavaScript, CSV, JSON) e chiedono
  di prevedere o di riconoscere: che cosa si vede, quale regola vince, quale frammento è scritto bene, quanto è
  largo il riquadro, che cosa cambia dopo il clic. Dove la lezione ha un conto (dimensione di un'immagine, di un
  suono, rapporto di compressione, larghezza di una scatola) almeno un livello è su quel conto, costruito
  all'indietro. Niente domande di pura memoria.
- Controlli, per ogni generatore: `sample.mts <slug> 1000 all <seed> | python3 scripts/exercises/verify.py` dà PASS
  con i seed 1, 50001 e 777001; errori piantati apposta vengono bocciati; `npx eslint` sui tuoi file è pulito; ogni
  livello guardato a 390 px su `http://localhost:3133/prova-grafico/esercizio?g=<slug>&l=<livello>&seed=<seed>` con
  almeno due semi, e nei livelli aperti (`&open=1`) una risposta giusta e una sbagliata consegnate.
- Il generatore non si collega al sito: lo fa chi coordina, dal tuo rapporto.

## Controlli prima di consegnare

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/informatica/riscritte/NN-slug.md docs/lezioni/informatica/formulari/NN-slug.md docs/lezioni/informatica/flashcard/NN-slug.md
node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/NN-slug.md
```

Senza errori per ogni lezione; gli avvisi si leggono e si spiegano nel rapporto se restano. Rileggi ogni lezione una
volta dall'inizio come la leggerebbe uno studente, cercando frasi vietate da `stile.md`, trattini lunghi, "piuttosto
che" e programmi che non corrispondono al testo.

## Confini già fissati

- **65.** Perché una funzione (un pezzo di programma con un nome, scritto una volta e usato più volte), definizione
  e chiamata, il flusso che salta alla funzione e torna. Solo funzioni senza parametri e senza valore di ritorno, o
  con un solo parametro alla fine come anticipo. Le funzioni già usate senza saperlo (`print`, `input`, `sqrt`).
- **66.** Parametri e argomenti (uno e più di uno, l'ordine), `return`, la differenza tra stampare e restituire,
  usare il risultato in un'espressione, una funzione che ne chiama un'altra. Funzioni che restituiscono vero o
  falso.
- **67.** Variabili locali e globali, il tempo di vita di una variabile locale, due variabili con lo stesso nome in
  funzioni diverse, perché le globali si evitano; `global` in Python in un riquadro. La pila delle chiamate come
  figura.
- **68.** Vedi "Scelte del lotto". Il vettore passato a una funzione viene modificato in tutti e due i linguaggi: si
  dice qui in un riquadro con il link alla 70, che lo riprende.
- **69.** La scomposizione di un problema in sottoproblemi, una funzione per sottoproblema, l'albero della
  scomposizione, scrivere prima `main` con funzioni ancora vuote. Un problema solo, svolto per intero (per esempio
  la pagella di una classe, o un gioco a turni), senza vettori.
- **70.** Dichiarare, riempire, leggere e scrivere un elemento, scorrere con un ciclo, somma, media, massimo e
  conteggio su un vettore (la 64 li ha fatti senza vettore: richiamala), l'errore dell'indice fuori dal vettore,
  un vettore come parametro di una funzione.
- **71.** Cercare un valore scorrendo: dire se c'è, dire dove, contare quante volte; fermarsi appena lo si trova;
  il numero di confronti nel caso migliore, peggiore e medio. La ricerca in un vettore ordinato sta nella 74.
- **72.** Matrice come tabella, due indici, i due cicli annidati (la 63 ha i cicli annidati: richiamala), somma per
  righe e per colonne, la diagonale di una matrice quadrata. Esempi: l'orario della settimana, i voti di una classe
  per materia, il campo di un gioco.
- **73.** Vedi "Scelte del lotto". Esempi: contare le vocali, rovesciare una parola, controllare se è palindroma, le
  iniziali di un nome. La codifica dei caratteri è nella lezione 10: richiamala in una riga.
- **74.** La ricerca binaria su un vettore ordinato, con `sinistra`, `destra`, `centro`; perché il vettore deve
  essere ordinato; il numero di confronti che cresce con il logaritmo, visto dimezzando (1000 elementi, 10
  confronti), senza la formula generale; il confronto con la sequenziale in una tabella. Il confronto generale tra
  algoritmi è nella 78.
- **75, 76, 77.** Un ordinamento per lezione, con la stessa struttura: l'idea con le carte o con una fila di persone,
  la figura passo per passo, il programma, la traccia su un vettore di cinque o sei elementi, quanti confronti e
  quanti scambi su quel vettore. La 75 introduce lo scambio. La 76 ha la versione con la bandierina. La 77 lavora
  per spostamenti e lo dice. Il confronto tra i tre sta nella 78: nelle altre basta una riga che ci rimanda.
- **78.** Contare le operazioni invece di cronometrare; confronti e scambi dei tre ordinamenti su vettori ordinati,
  rovesciati e a caso; la tabella con $n$ che raddoppia; ricerca sequenziale e binaria; che cosa vuol dire che un
  algoritmo "non regge" quando i dati crescono. Una figura che fa correre gli algoritmi sullo stesso vettore e
  mostra i contatori. La complessità con la notazione O grande è del quinto anno.
- **79.** Perché i file (i dati sopravvivono al programma: la 22 ha il file system, richiamala), aprire, leggere
  riga per riga, scrivere, accodare, chiudere; il file che non esiste. Numeri letti da un file: la conversione.
- **80.** Il formato CSV (righe, campi, separatore, riga di intestazione), dividere una riga nei suoi campi,
  calcolare su una colonna, scrivere un CSV; il legame con il foglio di calcolo (lezioni 23-28). In Python `split`
  (il modulo `csv` solo nominato); in C++ `getline` con il separatore.
- **81.** Dati con una struttura ad albero; XML (elementi, attributi, annidamento, ben formato) e JSON (oggetti,
  array, valori); lo stesso dato nei due formati e in CSV; quando si usa l'uno e quando l'altro. La 87 riprende i
  linguaggi di markup dal lato dei documenti: qui si parla di dati.
- **82.** Che cos'è un formato di file, estensione e contenuto, contenitore e codifica, i formati più comuni di
  immagini, audio, video e documenti con ciò che li distingue (con o senza perdita, trasparenza, animazione),
  formati aperti e proprietari, come scegliere un formato per uno scopo. Le lezioni 11 e 12 hanno la codifica di
  immagini e suoni: non ripeterle.
- **83.** Bitmap e vettoriale: come è descritta l'immagine, che cosa succede ingrandendo, quando si usa l'una e
  quando l'altra, risoluzione e dimensioni per lo schermo e per la stampa; le operazioni di base su un'immagine
  (ritagliare, ridimensionare, cambiare formato) e che cosa fanno ai dati. SVG come esempio di vettoriale che si
  legge, in una pagina da modificare. La griglia di pixel e la profondità di colore sono nella 11.
- **84.** Perché si comprime, ridondanza, compressione senza perdita (RLE svolto a mano, l'idea del dizionario e dei
  codici di lunghezza diversa senza l'algoritmo di Huffman completo), con perdita (che cosa si butta via e perché
  non si nota), rapporto di compressione, che cosa succede ricomprimendo.
- **85.** Audio: campionamento e quantizzazione sono nella 12, qui bitrate, canali, formati e dimensione di un
  brano. Video: fotogrammi, frequenza, risoluzione, perché un video non compresso è enorme, l'idea della
  compressione tra fotogrammi, codec e contenitore, lo streaming.
- **86.** Carattere, glifo e font; la lezione 10 ha la codifica dei caratteri, qui il disegno: font bitmap e
  vettoriali (contorni), famiglie (con e senza grazie, a spaziatura fissa), corpo, peso, interlinea; i font in una
  pagina web e che cosa succede se il font manca; leggibilità. Una pagina da modificare con `font-family`.
- **87.** Marcare un testo: contenuto e struttura separati dall'aspetto; tag, elementi, attributi, annidamento; un
  linguaggio di markup non è un linguaggio di programmazione; HTML, XML (rimando alla 81), Markdown come esempi.
  Prima pagina HTML minima, senza spiegarne la struttura, che è della 88.
- **88.** Doctype, `html`, `head` (`title`, `meta charset`, `lang`), `body`; titoli e paragrafi; gli elementi
  semantici della pagina; l'albero del documento; commenti; che cosa fa il browser con un errore.
- **89.** Enfasi (`em`, `strong`) e a capo; link (assoluti e relativi, tra due pagine di un progetto, a un punto
  della pagina); immagini (`src`, `alt`, dimensioni) e perché `alt` conta.
- **90.** Elenchi puntati, numerati e annidati; tabelle (`table`, `tr`, `th`, `td`, `caption`, celle unite), solo
  per dati tabellari.
- **91.** `form`, `label`, i tipi di `input`, `select`, `textarea`, `button`; `name` e che cosa viene inviato; GET e
  POST in poche righe con il link alla 36; `required` e gli altri controlli dell'HTML. Il controllo con JavaScript
  è nella 98.
- **92.** A che cosa serve un foglio di stile, come si collega, la regola (selettore, proprietà, valore), selettori
  di elemento, di classe, di id, discendenti; colori e testo; la cascata e l'ereditarietà, quale regola vince.
- **93.** Contenuto, `padding`, `border`, `margin`; larghezza e altezza e che cosa contano (`box-sizing`); elementi
  di blocco e in linea; i margini che si fondono in un riquadro.
- **94.** Flexbox: contenitore ed elementi, direzione, allineamento, distribuzione dello spazio, a capo; la pagina
  classica con intestazione, menu, contenuto e piè di pagina; `position` solo nominato.
- **95.** Viewport, unità relative, media query, immagini che si adattano, prima il telefono; accessibilità:
  contrasto, testo alternativo, ordine dei titoli, tastiera, etichette dei moduli.
- **96.** Che cosa fa uno script in una pagina e dove gira (rimando alla 34, client e server); collegarlo;
  variabili, selezione e cicli in JavaScript confrontati con quelli che lo studente conosce, in una tabella;
  funzioni; la console.
- **97.** Il DOM come albero vivo della pagina, selezionare un elemento, cambiare testo, classi e stile, creare un
  elemento; gli eventi e le funzioni che li ascoltano.
- **98.** Leggere i valori dei campi, controllarli (vuoto, lunghezza, forma, due campi uguali), mostrare il
  messaggio accanto al campo, impedire l'invio; perché il controllo nel browser non basta e va ripetuto sul server.

Le pagine degli esempi dei capitoli sul web hanno un filo: il sito di un gruppo musicale della scuola, "I Fuori
Tempo" (home, concerti in una tabella, iscrizione a un concerto con un modulo). Ogni lezione ne costruisce un pezzo
da capo, piccolo e completo, senza dipendere dai file delle altre lezioni.

## Il rapporto

Alla fine scrivi due file nella cartella `rapporti/` dello scratchpad della sessione, e nel messaggio finale solo
un riassunto di meno di 250 parole (che cosa è fatto, che cosa non è riuscito, che cosa non hai potuto controllare).

`rapporti/gruppo-NN.json`, un array con un oggetto per lezione:

```json
{
  "n": 75,
  "slug": "inf-selection-sort",
  "righe": 310,
  "programmi": 4,
  "esercizi": 2,
  "pagine": 0,
  "tikz": 1,
  "interattive": ["inf-selection-sort-passi"],
  "diagrammi": 0,
  "flashcard": 16,
  "check": "0 errori, 0 avvisi",
  "verifica": "2 esercizi, 0 errori",
  "levels": [1, 2, 3, 4, 5],
  "levelNames": { "1": "Trovare il minimo", "2": "Un giro dell'ordinamento" },
  "aperti": [5],
  "seed": "PASS 1, 50001, 777001",
  "prerequisiti": ["inf-vettori", "inf-cicli-annidati"]
}
```

`rapporti/gruppo-NN.md`, con queste sezioni: "Scelte" (confini e convenzioni decise), "Domande per Andrea" (per
lezione, le più pesanti, in forma di domanda), "Da verificare", "Elementi interattivi" (nome, lezione, domanda a cui
risponde, come l'hai guardato), "Pezzi del kit che mancano", "Limiti" (controlli non fatti, avvisi rimasti, cose
lasciate a metà, dette chiaramente), "File condivisi toccati" (le righe aggiunte alla registrazione).
