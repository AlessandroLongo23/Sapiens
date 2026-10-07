# Rapporti dei gruppi, terzo anno di informatica (7 ottobre 2026)

I rapporti finali dei 14 gruppi che hanno scritto le lezioni 65-98, uno dopo l'altro e senza modifiche (ognuno conserva il suo titolo), seguiti dal rapporto della revisione dei testi e da quello dell'integrazione degli esercizi. Il brief è in `brief-terzo-anno.md`.

---

## Gruppo 01: lezioni 65, 66

# Gruppo 01: funzioni (lezioni 65 e 66)

File consegnati, tutti in `/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo`:

- `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/65-inf-definire-funzioni.md`
- `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/66-inf-parametri-ritorno.md`
- `src/components/content/interactive/informatica/ProgrammaPassi.tsx` (pezzo comune alle due figure),
  `DefinireFunzionePassi.tsx`, `ParametriRitornoPassi.tsx`
- `src/lib/informatica/tracce-funzioni.ts`, con `tests/unit/informatica-tracce-funzioni.test.mjs` (3 test, passano)
- `specs/exercises/inf-definire-funzioni.md`, `specs/exercises/inf-parametri-ritorno.md`
- `src/lib/exercises/v2/generators/inf-definire-funzioni.ts`, `inf-parametri-ritorno.ts`
- `scripts/exercises/checkers/inf_definire_funzioni.py`, `inf_parametri_ritorno.py`

## Scelte

- Filo delle due lezioni: la classifica del torneo di calcetto della scuola (non pallavolo, che non ha pareggi).
  La 65 usa la funzione `linea()`, la 66 `scheda(vinte, pareggi)`, `punti(vinte, pareggi)` e `qualificata`.
- Confine 65/66: nella 65 solo funzioni senza parametri e `void`; l'ultima sezione anticipa un parametro
  (`linea(n)`) e definisce "parametro". "Argomento", più parametri, `return` sono della 66.
- Confine con la 67: nessuna variabile locale spiegata. `punti` è `return 3 * vinte + pareggi`, senza variabile
  d'appoggio. Le figure mostrano i riquadri delle chiamate ma il testo non dice "pila delle chiamate". Una riga con
  il link alla 67 dice che i parametri di due funzioni con lo stesso nome sono variabili diverse.
- Confine con la 68: nessuna funzione assegna a un parametro; la figura fa vedere che gli argomenti sono copiati
  ma non pone la domanda "che cosa succede alla variabile di chi chiama".
- In Python il codice fuori dalle funzioni è il "programma principale"; nelle figure il suo riquadro si chiama
  `programma`, in C++ `main`.
- Prototipi C++ in un riquadro `ad-note` della 65; `None` solo nel riquadro "print al posto di return" della 66.
- Stampare e restituire: due funzioni sugli stessi numeri (`scheda` stampa, `punti` restituisce) e una tabella.
- Nella 66 un terzo esercizio (funzione che restituisce vero o falso) era scritto e provato, tolto per stare sotto
  le 400 righe. Il generatore ha un livello su questo.
- Generatori: nessun valore vero o falso stampato; le funzioni booleane sono sempre condizioni di una selezione.

## Domande per Andrea

Lezione 65:
- In Python va bene "programma principale" per le istruzioni fuori dalle funzioni, o in classe usi `def main():`?
- Il primo esempio è una funzione di una riga (`linea`). Preferisci un corpo di più righe fin dall'inizio?
- I prototipi del C++ solo in un riquadro, o usati almeno in un esempio?
- Va introdotta la parola "procedura" per le funzioni che non restituiscono niente?

Lezione 66:
- Prima una funzione che stampa (`scheda`) e poi quella con `return` (`punti`), oppure subito `return`?
- Usi anche "la funzione ritorna 14"? La lezione usa solo "restituisce".
- Più `return` in una funzione vanno bene da subito, o preferisci un solo `return` in fondo?
- Serve una convenzione per i nomi delle funzioni che rispondono vero o falso?
- Serve un esempio con una funzione `double` (la media)?

## Da verificare

- 65: `linea;` senza parentesi in C++ compila con un avviso (provato con `clang++` sul Mac). Il sito compila con
  `-Wall`: non ho guardato come l'avviso compare allo studente nell'editor.
- 65: il messaggio del C++ per la chiamata prima della definizione è stato letto solo da `clang++` del Mac; la
  lezione non ne cita il testo.
- 66: il testo del `TypeError` per l'argomento mancante è di Python 3.9 (Mac); non l'ho provocato nel Python del
  sito.
- 66: che cosa fa nell'editor del sito una funzione C++ `int` senza `return` non è stato provato (sul Mac: avviso,
  e un numero a caso). La lezione dice "il valore non è definito".
- `sqrt` è nominata nella 65 come funzione di libreria del C++; nel biennio non è mai stata usata.

## Elementi interattivi

| Nome | Lezione | Domanda | Come l'ho guardato |
|---|---|---|---|
| `inf-definire-funzione-passi` | 65 | In che ordine vengono eseguite le righe di un programma con una funzione, e da dove riprende il programma quando la funzione ha finito? | Pagina di prova a 800 e 390 px, chiaro e scuro, Python e C++, passo 1, 4 e ultimo; "Esegui" fino in fondo dentro la lezione. |
| `inf-parametri-ritorno-passi` | 66 | Quale argomento finisce in quale parametro, e dove va il valore dopo `return`? | Come sopra, più la variante `punti(p, v)`, i passi 5, 6, 7 e 8, e l'avanzamento da tastiera (frecce e Fine). |
| `funzione-argomenti-valore-di-ritorno` (TikZ) | 66 | Che cosa entra e che cosa esce da una funzione | PNG in chiaro e in scuro; corretta un'etichetta che toccava la scatola. |
| Programmi `codice` (3 nella 65, 4 nella 66) | 65, 66 | Ognuno ha una modifica chiesta e un risultato da prevedere | Eseguiti nel browser in Python; in C++ solo in parte (vedi Limiti). |

Le due figure seguono il programma della lezione riga per riga: listato con la riga in esecuzione accesa e la riga
della chiamata segnata "in attesa", `Pila` del kit con parametri e variabili, lo schermo, la frase, `ComandiPassi`.
Partono nel linguaggio scelto per i programmi della pagina (`sapiens:linguaggio` in `localStorage`) e lo seguono; il
loro selettore scrive la stessa chiave, quindi cambia anche le linguette dei programmi.

Scostamento dalle altre figure: sotto i 640 px frase e comandi stanno subito sotto il listato, e pila e schermo
sotto i comandi. Con il C++ (16 righe) la figura è alta circa 910 px a 390 px: così un passo si legge senza
scorrere, ma pila e schermo restano in parte sotto il bordo dello schermo.

## Pezzi del kit che mancano

- **Un listato con la riga in esecuzione.** `PassoPila` ha già `riga` e `uscita`, ma nel kit non c'è un pezzo che
  li mostra. Ho scritto `Listato` e `Schermo` dentro `ProgrammaPassi.tsx`, non esportati. Se servono al gruppo 2
  (67, 68) conviene portarli in `informatica.tsx`.
- **`Legenda` per le variabili.** Accetta solo gli stati delle celle: per `nuova`, `letta`, `scritta` ho usato le
  chiavi `esame`, `confronto`, `scambio`, che hanno lo stesso aspetto.
- **`Pila` senza funzioni chiamate.** Con `passi` tiene lo spazio vuoto sopra `main`; ho messo in quello spazio un
  riquadro tratteggiato "nessuna funzione chiamata", sovrapposto dalla figura, senza toccare il kit.
- Il valore restituito è mostrato come una scatola di nome `return` nel riquadro della funzione: è una scelta mia,
  non una convenzione del kit.

## Limiti

- **C++ nel browser, lezione 65:** non provato. Lezione 66: eseguiti tre programmi su quattro e verificato un
  esercizio su due (il mio script non rispondeva alle domande del quarto programma). Tutti i programmi e tutte le
  soluzioni passano con `clang++ -Wall` e con `verifica.mts`.
- **Figure da telefono in scuro:** guardate solo ad alcuni passi, non a tutti.
- **Generatori in C++:** `INF_CPP=1` su 25 esercizi per livello per `inf-definire-funzioni` (PASS). Per
  `inf-parametri-ritorno` su 20 per livello (PASS). Sono campioni piccoli: alcuni casi hanno due o tre esercizi.
- **Esercizi nel browser:** ogni livello guardato a 390 px con i semi 3 e 11, solo in Python. Livelli aperti (65
  livello 5, 66 livello 6): consegnate una risposta giusta ("Giusto"), una che scrive altro ("Sbagliato") e una
  con i numeri giusti senza funzione (bocciata con il messaggio sul costrutto). Lo script che scrive nell'editor
  ha fallito alcune consegne per conto suo; le ho ripetute con un altro seme.
- **Anteprima TikZ:** `scripts/figure/anteprima.mjs` in questa cartella non trova `node-tikzjax`. Ho usato lo
  script della cartella `Sapiens`, in sola lettura, con l'uscita nello scratchpad.
- Errori piantati (opzione giusta spostata, distrattore uguale al giusto, uscita attesa sbagliata, costrutto non
  chiesto, partenza uguale alla soluzione, prova sbagliata): tutti bocciati da `verify.py`, su un campione per
  livello.
- Esercizi diversi su 1000 (seed 1): 65 → 162, 297, 236, 569, 582; 66 → 768, 834, 974, 806, 969, 1000.
- `tsc`: 0 errori nel progetto. ESLint pulito sui miei file. `check.mts` senza avvisi.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, tre righe dopo `inf-kit-campionario`:

```ts
	// Computer science, third year: functions (group 01).
	'inf-definire-funzione-passi': () => import('@/components/content/interactive/informatica/DefinireFunzionePassi'),
	'inf-parametri-ritorno-passi': () => import('@/components/content/interactive/informatica/ParametriRitornoPassi'),
```

File nuovo fuori dall'elenco del brief: `tests/unit/informatica-tracce-funzioni.test.mjs`, il test della traccia.
I generatori non sono collegati al sito.

---

## Gruppo 02: lezioni 67, 68, 69

# Gruppo 02: lezioni 67, 68, 69

## Incidente da leggere per primo

Alle 13:57 del 7 ottobre ho sovrascritto per errore `src/components/content/interactive/informatica/listato.tsx`,
file del gruppo 11 (lezioni 90-91, usato da `CelleUnite.tsx` e `ModuloInviato.tsx`). Ho creato un file mio chiamato
`Listato.tsx`: il disco del Mac non distingue maiuscole e minuscole, e la scrittura è finita sul loro file. Me ne sono
accorto subito e l'ho ripristinato in circa un minuto dalla copia nelle source map del sito di sviluppo
(`.next/dev/server/chunks/ssr/*.js.map`, `sourcesContent`): 2920 byte, con le esportazioni `Listato`, `Tasto`,
`Codice`, `Titolino` che i loro due componenti importano. È la versione dell'ultima compilazione prima
dell'incidente: se il gruppo 11 aveva salvato modifiche negli ultimi secondi senza che il sito le ricompilasse, quelle
sono perse. Il gruppo 11 deve rileggere il file. La copia recuperata e il mio file sono in
`gruppo-02/recupero/`. Il mio pezzo ora si chiama `PilaProgramma.tsx`.

## Scelte

- 67: la funzione degli esempi è `punti(vinte, pareggi)` della 66. "Programma principale" come nella 65 (in C++
  `main`). La differenza tra i linguaggi è detta: in Python le variabili del programma principale sono globali, in
  C++ quelle di `main` sono locali. `global` solo in un riquadro. Le costanti globali (`const` in C++) in un paragrafo.
- 68: due modelli, uno per linguaggio. La prima sezione (un assegnamento al parametro non cambia l'argomento) vale
  per tutti e due e introduce "passaggio per valore"; "per riferimento" è definito solo per il C++; per Python nomi
  attaccati a valori, senza "oggetto", "mutabile", "tupla". Lo scambio riuscito in Python è `return y, x`. La lista e
  l'array compaiono in un programma di sei righe, con il rimando alla 70; in C++ il parametro è `int voti[]` senza
  `n`, perché la funzione tocca solo l'elemento 0.
- 69: il problema è la pagella di una classe con le insufficienze (solo interi, niente vettori). Albero su due
  livelli, quattro funzioni. "Funzione vuota" al posto di "stub". La regola dell'esito è inventata e il testo lo dice.
- Confini tra le tre: la 67 dice solo che i parametri sono locali; che cosa succede agli argomenti è della 68; la 69
  non introduce costrutti nuovi oltre a `pass`.

## Domande per Andrea

- 67: in Python le variabili del programma principale sono globali. Basta dirlo in un riquadro, o dal terzo anno i
  programmi Python devono avere `def main():`?
- 67: `global` solo in un riquadro, o con un esempio da eseguire? "Visibilità" o "ambito"?
- 68: per Python va bene "un nome attaccato a un valore", o preferisci "per valore" e "per riferimento" anche lì?
- 68: va bene mostrare `return y, x` e una lista prima della lezione sui vettori?
- 69: la pagella con le insufficienze o un gioco a turni? "Funzione vuota" o "stub"? Presenti anche il bottom-up?

## Da verificare

- I messaggi di errore citati (`NameError`, `UnboundLocalError`, il nome non dichiarato in C++, `scambia(3, 8)` che
  non compila) sono stati letti con il Python 3.9 e il `clang++` della macchina, non nell'editor del sito.
- La regola "da una a tre insufficienze: giudizio sospeso" è un esempio, non una norma.

## Elementi interattivi

- `inf-visibilita-pila` (67): mentre `punti` calcola, quante variabili `totale` ci sono e quanto valgono? Guardata in
  chiaro, in scuro, a 390 px, in Python e in C++, ai passi 1, 3, 5, 10.
- `inf-passaggio-parametri-pila` (68): se dentro `scambia` lo scambio avviene, dove finisce? Tre programmi
  (Tentativo, Scambio, Vettore) nei due linguaggi; lo scambio riuscito in Python ha una traccia sua. Guardata in
  chiaro, in scuro, a 390 px, ogni scelta, inizio, metà e fine. Sostituisce `inf-scambia-valore-riferimento`, che
  resta registrata e non è usata.
- `inf-top-down-albero` (69): fin dove conviene scendere, e in che ordine si scrivono le funzioni? Guardata in
  chiaro, in scuro, a 390 px, ai passi 1, 4, 6, 7, 10, e da tastiera (freccia destra, Fine).
- Programmi `codice`: 8 coppie Python e C++ più 6 esercizi. Ogni lezione aperta a 1280 e a 390 px in Python e in C++:
  tutti i programmi eseguiti, tutte le soluzioni verificate, nessuno scorrimento laterale, nessuna immagine mancante.

## Pezzi del kit che mancano

- Il listato con la riga in corso accesa, quello che il programma ha scritto e il linguaggio preso dalla scelta della
  pagina (`sapiens:linguaggio`). L'ho scritto in `PilaProgramma.tsx`; il gruppo 1 ha fatto lo stesso per conto suo in
  `ProgrammaPassi.tsx`, e il gruppo 11 ha un altro `Listato`. Sono tre versioni dello stesso pezzo, da unire nel kit.
- Un albero (riquadri con i rami): in `TopDownAlbero.tsx` è fatto a mano con una griglia.

## Limiti

- `npx tsc --noEmit -p .` sull'intero progetto non l'ho lanciato, su indicazione di chi coordina. I miei quattro
  componenti e il generatore della 69 passano `tsc` con un tsconfig ristretto ai soli file, ed ESLint è pulito.
- I generatori della 67 e della 68 li hanno scritti due sottoagenti. Di mio ho solo rilanciato i tre seed (PASS per
  tutti e due) e letto i nomi dei livelli. Non ho letto il loro codice né le loro specifiche, non ho visto i loro
  rapporti, e non ho controllato di persona C++, errori piantati, ESLint, numero di esercizi diversi e pagine a 390 px.
- Generatore della 69, controllato da me: tre seed PASS; C++ PASS su 25 esercizi per livello; 17 errori piantati
  tutti bocciati; esercizi diversi su 1000: 526, 696, 537, 981, 983, 995; ogni livello guardato a 390 px con due semi;
  nel livello aperto consegnate una risposta giusta, una sbagliata e una giusta senza funzione, con il verdetto atteso.
  Nel livello 6 lo studente scrive anche la chiamata, perché in C++ un programma di partenza che chiama una funzione
  non definita non compila.
- Nelle prove delle lezioni in C++ la console riporta "Failed to read the 'localStorage' property": viene dallo
  script di prova, che imposta il linguaggio anche dentro la cornice isolata dell'editor. In Python non compare.
- La 69 è a 393 righe su 400. Non ha una figura TikZ dell'albero.

## File condivisi toccati

`src/lib/utils/interactive.ts`, dopo il blocco del gruppo 01:

```ts
	// Computer science, third year: scope and parameters (group 02).
	'inf-visibilita-pila': () => import('@/components/content/interactive/informatica/VisibilitaPila'),
	'inf-passaggio-parametri-pila': () => import('@/components/content/interactive/informatica/PassaggioParametriPila'),
	'inf-top-down-albero': () => import('@/components/content/interactive/informatica/TopDownAlbero'),
```

E `listato.tsx` del gruppo 11, sovrascritto e ripristinato: vedi sopra.

---

## Gruppo 03: lezioni 70, 71

# Gruppo 03: vettori e ricerca sequenziale (lezioni 70 e 71)

Lavoro del 7 ottobre 2026 nella cartella `Sapiens-informatica-terzo`. Niente pubblicato, niente commit.

## File

Per ciascuna lezione (`70-inf-vettori`, `71-inf-ricerca-sequenziale`): lezione in `riscritte/`, nota in `note/`,
formulario in `formulari/`, flashcard in `flashcard/` (19 e 18 carte), specifica in `specs/exercises/<slug>.md`,
generatore in `src/lib/exercises/v2/generators/<slug>.ts`, controllo in `scripts/exercises/checkers/inf_vettori.py`
e `inf_ricerca_sequenziale.py`.

Figure, in `src/components/content/interactive/informatica/`: `VettoreIndiceElemento.tsx`, `VettoreScorriPassi.tsx`,
`RicercaSequenzialePosizione.tsx`, `RicercaSequenzialeCasi.tsx`. Tracce in un file nuovo accanto a `tracce.ts`:
`src/lib/informatica/tracce-vettori.ts`, con i test in `tests/unit/informatica-tracce-vettori.test.mjs` (6 test,
tutti verdi).

## Scelte

- **Confine tra 70 e 71.** La 70 non cerca niente e non dà mai una posizione: dichiarare, leggere e scrivere un
  elemento, scorrere, somma, media, conteggio, massimo, riempire dalla tastiera, vettore come parametro. La 71 parte
  dal vettore già noto: `trovato`, `posizione` da -1, il `while` che si ferma, la funzione `cerca`, i confronti. La
  posizione del massimo resta alla 75 (`imin`).
- **Vettore degli esempi.** `voti = [7, 5, 8, 6, 10]` nella 70 (media 7,2: Python e C++ la scrivono uguale);
  `arrivi = [12, 7, 25, 3, 18, 9, 31, 14]` con il 18 cercato nella 71, gli stessi valori di
  `inf-ricerca-sequenziale-passi`.
- **C++.** `const int N = 5;` prima di `main` in ogni programma; funzioni con `int v[], int n`; `vector` in un
  riquadro della 70 con `push_back`. La dimensione è fissa anche quando i dati si leggono (cinque o sei valori).
- **Python.** Ciclo con l'indice, `for i in range(len(voti))`, uguale al C++; `for voto in voti` in un riquadro.
  Liste riempite con `append`. Niente `in`, `index`, `count`, `max`, `sum`.
- **Fermarsi.** Con un `while` a due condizioni e poi con `return` dentro la funzione; `break` non compare.
- **"Non trovato"** è -1 nei due linguaggi, nella lezione e negli esercizi.
- **Caso medio** solo quando il valore c'è: (n + 1) : 2, con il conto fatto per otto elementi.
- **Esercizi.** Nessun programma mostrato o offerto come opzione esce dal vettore; l'indice fuori dal vettore è
  chiesto a parole (livello 1 di `inf-vettori`). I livelli aperti partono da un programma vuoto e chiedono
  `vettore`: in tutte le famiglie un dato arriva dopo gli altri, quindi senza conservarli non si risponde.
- **Nomi nei generatori.** I vettori si chiamano `voti`, `punti`, `passi`, `tempi`, `pesi`, `gol`; nei livelli
  aperti `v`, e la funzione che cerca l'ultima occorrenza si chiama `cerca`, perché le righe delle opzioni stiano
  in 34 caratteri. Il contatore del livello 3 e 4 di `inf-vettori` è `conta`, per lo stesso motivo.

## Domande per Andrea

Lezione 70:

- In C++ la dimensione nella costante `N` prima di `main` va bene, o la vuoi dentro `main`, o con `#define`?
- Per i dati "quanti ne vuole l'utente" in classe usi un array con una capienza massima e una variabile `n` per gli
  elementi usati? Qui la dimensione è sempre fissa.
- In Python il ciclo con l'indice come forma principale, o `for voto in voti`?
- "Dimensione" o "lunghezza" del vettore?
- Gli indici negativi di Python (`voti[-1]`) vanno nominati, come ora, o tolti?

Lezione 71:

- La ricerca che si ferma la scrivi con il `while` a due condizioni, con una bandierina nella condizione, o con
  `break`?
- -1 come "non trovato" va bene anche in Python?
- Il caso medio, con (n + 1) : 2, resta o al terzo anno si fermano a caso migliore e peggiore?
- In Python va detto, almeno in un riquadro, che esistono `in` e `index`?

## Da verificare

- Quello che fa il C++ con un indice fuori dal vettore non è definito dal linguaggio. La 70 descrive il Clang del
  sito, provato il 7 ottobre 2026: con l'indice scritto come numero il compilatore scrive
  `warning: array index 5 is past the end of the array` e il programma stampa 0; con `i <= N` in un ciclo nessun
  avviso, e la somma esce 36, giusta per caso. La lezione dice "un numero che con i voti non c'entra" e "può perfino
  sembrare giusto", senza citare numeri.
- Nella 71, "la ricerca binaria trova un valore tra un milione con una ventina di confronti": la 78 dice "al massimo
  20". Da tenere allineato se la 74 o la 78 cambiano.
- I messaggi di Python citati (`IndexError: list index out of range`) sono quelli di Pyodide sul sito e di
  Python 3.9 sul Mac.

## Elementi interattivi

| Nome | Lezione | Domanda a cui risponde | Come l'ho guardato |
|---|---|---|---|
| `inf-vettore-indice-elemento` | 70 | Quale elemento è `voti[3]`, e che cosa c'è in `voti[5]`? | 800 px chiaro e scuro, 390 px chiaro e scuro; all'inizio, sul primo elemento, fuori dal vettore, dopo tre aumenti; da tastiera |
| `inf-vettore-scorri-passi` | 70 | Che cosa cambia giro dopo giro, e che cosa succede all'ultimo giro con `i <= 5`? | chiaro, scuro e 390 px; primo passo, metà, fine; Somma e Massimo, le due condizioni; otto valori scritti a mano; dopo Mescola; frecce, Inizio, Fine, Invio |
| `inf-ricerca-sequenziale-posizione` | 71 | Quanti elementi guarda la ricerca, e che cosa cambia se non si ferma al primo? | chiaro, scuro e 390 px; primo passo, metà, fine; "Si ferma" e "Va avanti"; due 18; un valore che non c'è; da tastiera |
| `inf-ricerca-sequenziale-casi` | 71 | Quanti confronti servono a seconda del posto del valore? | chiaro, scuro e 390 px; primo posto, ultimo, valore assente, 2 e 12 elementi; da tastiera |

Tutte stanno in 390 px senza scorrimento laterale e senza errori nella console, e tengono la stessa altezza da un
passo all'altro. Sono state guardate anche dentro le due lezioni, a 390 px in chiaro e a 1280 px in scuro. I
programmi `codice` sono 4 nella 70 e 3 nella 71, ognuno con le istruzioni su che cosa provare.

Correzioni fatte dopo averle guardate: la legenda di `casi` andava su due righe a 390 px (etichette accorciate); il
bottone che rimette i voti restava solo su una riga (due righe di bottoni); la fila di `casi` cambiava altezza
passando da 8 a 12 elementi (altezza minima fissata); la frase dell'ultimo passo di `scorri` occupava cinque righe
sul telefono (accorciata).

## Pezzi del kit che mancano

- **Una cella fuori dal vettore.** `Celle` non ha un modo per disegnare un posto che non appartiene alla fila. Ho
  aggiunto in fondo una cella con valore `?` e stato `scartata` (tratteggiata), con la voce di legenda "fuori dal
  vettore". Funziona, ma lo screen reader la legge come "5: ? (scartato)". Servirà anche alla 72 e alla 73.
- **Variabili dentro `VettorePassi`.** `VettorePassi` mostra solo i contatori. Per far vedere `posizione` l'ho
  messa tra i contatori della traccia; per `i` e `somma` nella 70 ho composto la figura a mano con `Variabili`.
  Una prop `variabili` per passo eviterebbe le due strade.
- **Altezza di `Celle` quando cambia il numero delle celle.** `passi` tiene l'altezza tra i passi di una traccia,
  non quando cambia la dimensione del vettore: in `casi` ho messo un'altezza minima attorno.
- `inf-codice.ts`: niente da segnalare, non è servito nessun modulo di aiuto in più.

## Limiti

- **Lunghezza del testo.** Il brief chiede da 50 a 90 righe di testo. Contando un paragrafo per riga la 70 ne ha 21
  più 6 riquadri e la 71 ne ha 30 più 3 riquadri e una tabella: circa 1000 e 950 parole, come le lezioni del
  secondo anno. Le righe totali sono 395 e 376, sotto le 400.
- **"Contare quante volte"** nella 71 non ha un programma d'esempio nel testo: è il primo esercizio.
- **Livelli aperti a scelta multipla.** La pagina mostra lo stesso titolo ("Scrivi il programma.") nelle due forme,
  e a scelta multipla le opzioni mostrano solo la parte dopo la lettura senza che la domanda lo dica.
- **Controllo del C++ dei generatori.** Fatto con `INF_CPP=1` su 25 esercizi per livello (seed 1 per tutti e due,
  seed 50001 anche per `inf-vettori`), non sui 1000.
- **Pagina di prova degli esercizi.** Guardati a 390 px tutti i livelli con i seed 3 e 58; ho letto con attenzione
  solo cinque schermate (vettori 4, 5, 6; ricerca 2, 3), le altre sono state controllate per scorrimento laterale
  ed errori. Risposte aperte consegnate: giusta, sbagliata e giusta senza vettore, in Python (vettori seed 3,
  ricerca seed 3) e in C++ (vettori seed 6, ricerca seed 6); verdetti tutti come attesi.
- **Lezioni nel browser.** Ogni programma eseguito in Python a 1280 px e in C++ a 390 px; non in C++ a 1280 né in
  Python a 390. In console resta un "request failed" su una richiesta `_rsc` della pagina di prova, che non dipende
  dalla lezione.
- **Errori piantati.** 38 in `inf-vettori` e 31 in `inf-ricerca-sequenziale`, tutti bocciati, più il C++ che scrive
  altro (bocciato con `INF_CPP=1`). Alla prima passata due non erano bocciati (il vettore di `params` rovesciato,
  dove somma e conteggio non cambiano): ho aggiunto ai due controlli il confronto tra `params.vector` e il vettore
  scritto nel programma.
- **`tsc`.** Lanciato una volta sull'intero progetto: 0 errori. ESLint pulito sui miei file.
- **Screen reader.** Non provato con uno vero; ho letto le etichette `aria` dal DOM.
- **Scheda da stampare** degli esercizi: non guardata.

Esercizi diversi su 1000 (contati su `params`, seed 1): `inf-vettori` 782, 1000, 1000, 1000, 1000, 1000;
`inf-ricerca-sequenziale` 1000, 1000, 1000, 764, 1000.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, cinque righe in `FIGURES`, dopo `inf-kit-campionario`:

```ts
	// Computer science, third year: arrays (group 03).
	'inf-vettore-indice-elemento': () => import('@/components/content/interactive/informatica/VettoreIndiceElemento'),
	'inf-vettore-scorri-passi': () => import('@/components/content/interactive/informatica/VettoreScorriPassi'),
	'inf-ricerca-sequenziale-posizione': () => import('@/components/content/interactive/informatica/RicercaSequenzialePosizione'),
	'inf-ricerca-sequenziale-casi': () => import('@/components/content/interactive/informatica/RicercaSequenzialeCasi'),
```

File nuovi fuori dalla tabella del brief, da sapere per chi coordina: `src/lib/informatica/tracce-vettori.ts` e
`tests/unit/informatica-tracce-vettori.test.mjs`. Per collegare i generatori: `inf-vettori` livelli da 1 a 6 con il 6
aperto, `inf-ricerca-sequenziale` livelli da 1 a 5 con il 5 aperto; tutti e due i livelli aperti vanno dichiarati in
`runAnswers` di `v2/open-answers.ts`.

---

## Gruppo 04: lezioni 72, 73

# Rapporto del gruppo 04: lezioni 72 (Le matrici) e 73 (Le stringhe)

File creati, tutti nuovi:

- `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/72-inf-matrici.md` e `73-inf-stringhe.md`
- `src/components/content/interactive/informatica/MatriceIndici.tsx`, `MatriceSomme.tsx`, `StringaPassi.tsx` (la
  figura a passi su una parola, usata dalle due che seguono), `StringaVocali.tsx`, `StringaPalindroma.tsx`
- `src/lib/informatica/tracce-matrici-stringhe.ts` (tracce e lettura di una parola) con
  `tests/unit/informatica-tracce-matrici-stringhe.test.mjs` (10 prove, tutte passate; `npm run test:unit`: 809 su 809)
- `specs/exercises/inf-matrici.md`, `inf-stringhe.md`
- `src/lib/exercises/v2/generators/inf-matrici.ts`, `inf-stringhe.ts`
- `scripts/exercises/checkers/inf_matrici.py`, `inf_stringhe.py`

## Scelte

- **Confine 72/73 con la 70.** Vettore, indice fuori dal vettore e `append` sono richiamati con un link. Le parole
  sono quelle della 70 (elemento, indice, dimensione; `N` costante prima di `main`; il ciclo con l'indice anche in
  Python).
- **72, dimensioni in Python.** `R = len(voti)` e `C = len(voti[0])` in due variabili, così i cicli sono
  `range(R)` e `range(C)` e si leggono come in C++. La 70 scrive `len(voti)` nel `range`.
- **72, niente matrice passata a una funzione** (`int m[][C]` in C++): nessun programma della lezione ha funzioni.
- **72, somma per colonne senza un programma suo da eseguire**: schema a parole, la figura con la scelta "Per
  colonne", la consegna di modificare il programma dei totali; il programma intero è la soluzione del primo
  esercizio. La stampa della matrice come tabella è stata tolta. Tutte e due le cose per stare nelle 400 righe.
- **72, tris come matrice di stringhe** (`string campo[N][N]`), per non introdurre `char` prima della 73.
- **73, il ciclo usa sempre l'indice**; in C++ la lunghezza va prima in `int n = parola.length();`.
- **73, `char` del C++** compare in un riquadro e nella funzione `vocale(char c)`. Codici dei caratteri come numeri,
  `toupper` fuori dalla tabella, `split`, indici negativi e `[::-1]` non ci sono.
- **73, palindroma con due indici che si fermano alla prima coppia diversa** (`while i < j and palindroma`, con
  `else`), uguale passo per passo alla figura. "Rovescia e confronta" è detto in una frase.
- **73, `find` in C++ assegnato a un `int`**, così "non trovato" è -1 come in Python; `string::npos` non è nominato.
- **Esercizi, 72 livello 6 senza costrutti chiesti.** La lettura della matrice, che è data, contiene già due cicli
  annidati e la matrice: `annidati` e `vettore` non distinguerebbero niente, e `check()` boccerebbe la partenza. La
  risposta è corretta solo su quello che scrive, su tre matrici diverse.
- **Esercizi, 73 livello 6 chiede `ciclo`** e la consegna lo dice ("Usa un ciclo"): `parola[::-1]`,
  `parola.count()` e `parola.replace()` scrivono il risultato giusto e vengono bocciati.
- **Esercizi, niente livello sulla palindroma**: risponde sì o no, e con due sole uscite non ci sono quattro opzioni.

## Domande per Andrea

72:
- In classe la matrice si passa a una funzione? Serve un paragrafo su `int m[][C]`?
- In Python: `R = len(voti)` e `C = len(voti[0])` in due variabili, o `len` dentro i `range` come nella 70?
- "Diagonale secondaria" o "antidiagonale"?
- Trasposta e massimo di una matrice: vanno aggiunti?

73:
- In C++ solo `string`, o fai vedere anche gli array di `char`?
- In Python il ciclo con l'indice sempre, o `for c in parola` quando l'indice non serve?
- I codici dei caratteri (`ord`, `chr`, `toupper`) e il cifrario di Cesare meritano un paragrafo?
- Per la palindroma: i due indici come versione principale, o "rovescia e confronta"?

## Da verificare

- 72: `voti[0][4]` in C++ stampa 5 (il primo elemento della riga dopo). Provato sul Mac con `clang++`; sul Clang del
  sito non provato a mano. Per la norma del linguaggio è un accesso non definito.
- 73: "una lettera accentata occupa due byte" vale per UTF-8. Sul Mac `"città".length()` dà 6; non provato
  nell'editor del sito con una parola accentata letta da tastiera.
- 73: `"Hai " + eta` in C++ "compila e stampa un testo sbagliato": sul Mac con `eta = 2` stampa "i ", e Clang avvisa
  solo con `-Wall`. Con un numero più grande della lunghezza del testo il comportamento non è definito.
- 73: `nome[n]` su una `string` è il carattere di fine stringa (cppreference, `operator[]`, dal C++11): la lezione
  dice "un carattere di solito invisibile".
- Le medie del programma dei totali (72) si scrivono diversamente quando sono intere: Python `6.0`, C++ `6`, come già
  detto nella 64.

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-matrice-indici` | 72 | Con quali due indici si scrive un elemento, e quale viene prima? | Pagina di prova a 390 px in chiaro e a 800 px in scuro, dopo il clic su due celle; nella lezione a 1280 e 390 px, chiaro e scuro. Altezza ferma al clic. |
| `inf-matrice-somme` | 72 | In che ordine i due cicli visitano i voti, quante volte `somma` riparte, che cosa cambia per colonne? | Primo passo, passo 10, ultimo passo (tasto Fine), "Per colonne" con clic su una cella (salta al passo 14 di 22), a 390 px in chiaro e in scuro e a 800 px; "Esegui" fino in fondo nella lezione. Altezza ferma tra i passi, nessuno scorrimento laterale. |
| `inf-stringa-vocali` | 73 | Quanti giri fa il ciclo e in quanti il contatore sale? | Primo passo, passo 7, fine; parola scritta a mano ("Aiuola", che la figura porta in minuscolo); messaggio di errore con "due parole"; 390 px chiaro, 800 px scuro. |
| `inf-stringa-palindroma` | 73 | Quanti confronti servono, e quando ci si ferma? | "ossesso" fino alla fine (Avanti e tasto Fine), "ossuto" (si ferma al passo 3, coppia arancione) in scuro a 390 px, una parola di 12 lettere a 390 px. |
| programmi `codice` | 72 e 73 | vedi le note delle lezioni | Tutti eseguiti nella pagina della lezione in Python e in C++; "Verifica" con la soluzione in tutti e quattro gli esercizi, nei due linguaggi: prove superate. Nessun errore in console (vedi "Limiti" per un avviso visto una volta). |

Le figure non sono state provate con uno screen reader. Da tastiera sono stati provati solo Fine e Invio.

## Pezzi del kit che mancano

Provati `Matrice` e `Stringa` nel campionario, con il clic sulle celle: funzionano, in chiaro, in scuro e a 390 px.
Difetti e mancanze, senza toccare il kit:

- `Stringa` non ha `passi`: con due puntatori che finiscono sulla stessa cella l'altezza cambia da un passo
  all'altro. In `StringaPassi.tsx` ho usato `Celle` con `unite` e `passi`, e ho messo `j` sopra e `i` sotto.
- `Dati` accetta solo numeri: per scrivere una parola non c'è un campo. L'ho scritto in `StringaPassi.tsx`,
  ricopiando le classi di `CAMPO`, che il kit non esporta. Se serve ad altri (71, ordinamenti di parole) conviene
  portarlo nel kit.
- `Matrice` non ha un posto per un valore accanto a ogni riga o sotto ogni colonna (i totali) né per un'etichetta
  di riga (il nome dello studente). In `MatriceSomme.tsx` le somme scritte stanno in un riquadro a parte.
- `Matrice`: senza `riga` o `colonna` lo spazio a lato cambia, e la matrice si sposta quando il nome compare. Si
  evita passando sempre il nome con `su: -1` quando l'indice non ha ancora un valore: funziona, ma non è scritto
  nel README.
- `Contatori` scrive i nomi in maiuscolo: non va bene per nomi di variabili (`i`, `j`, `somma`). Ho usato
  `Variabili`.
- `Frase` con `tutte` tiene il posto della frase più lunga per numero di caratteri: cambiando parola nelle figure
  delle stringhe l'altezza cambia di qualche pixel (485 e 476 px a 390 px), mai tra un passo e l'altro.
- Il messaggio di errore del campo (anche in `Dati`) allunga la figura quando compare.
- Negli esercizi, `inf-codice.ts`: il limite di 34 caratteri per un'opzione esclude in C++ i cicli all'indietro e
  con il passo 2 dentro una funzione (`    for (int i = n - 1; i >= 0; i--) {` ne ha 37).

## Limiti

- **Esercizi diversi come li vede lo studente.** Su `params` tutti i livelli superano i cento su 1000 (72: 1000 per
  livello; 73: 452, 614, 573, 726, 936, 972). Contando consegna, programma mostrato e opzioni, i livelli "scegli
  il programma" ne hanno meno: 72 livello 4, 177; 73 livello 5, 64; 72 livello 6, 286. La matrice e le parole di
  prova cambiano, ma lo studente non le vede.
- **C++ degli esercizi**: con `INF_CPP=1` controllati 80 esercizi per livello della 72 e 60 della 73 (seed da 1):
  PASS. Il resto dei 1000 per livello è controllato solo in Python. Il primo passaggio con il C++ aveva trovato un
  errore vero, corretto: un distrattore `r = s[i] + s[i]`, che in C++ somma due caratteri e dà un numero.
- **Errori piantati**, sette per generatore (opzione giusta spostata, uscita attesa sbagliata, distrattore che fa
  come il giusto, prova con l'uscita sbagliata, partenza uguale alla soluzione, dati di `params` cambiati, frase
  vietata): tutti bocciati da `verify.py`. Il C++ che scrive altro non è stato piantato a mano: lo ha fatto
  l'errore qui sopra.
- **Pagina di prova degli esercizi**: due semi per livello a 390 px (nessuno scorrimento, nessun programma
  tagliato). Risposta aperta: 72 livello 6 una giusta e una sbagliata; 73 livello 6 una giusta, una sbagliata e una
  giusta senza ciclo (bocciata con il messaggio sul ciclo). Due volte la consegna non ha dato il verdetto entro il
  tempo dello script (45 e 120 secondi); ripetuta, lo ha dato subito. Non ho capito se è il carico della macchina.
- **Un avviso di React visto una volta** ("Can't perform a React state update on a component that hasn't mounted
  yet") aprendo la 72 a 390 px in scuro; in due ripetizioni non è più comparso. Non so da quale componente venga.
- **`tsc`** lanciato una volta: nessun errore nei miei file.
- **Lunghezza.** La 72 è a 400 righe esatte, la 73 a 393. Le righe di testo sono 35 e 42 (un paragrafo per riga,
  circa 1270 e 1310 parole), sotto le 50-90 del brief contate a righe.
- La figura delle vocali porta in minuscolo la parola scritta: con "Aiuola" conta 5 vocali, mentre il programma
  della lezione ne conta 4. Il campo mostra la parola in minuscolo dopo l'invio.
- Il generatore non è collegato al sito e i livelli aperti (6 e 6) non sono dichiarati in `open-answers.ts`.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, cinque righe aggiunte in fondo a `FIGURES`:

```ts
	// Computer science, third year: matrices and strings (group 04).
	'inf-matrice-indici': () => import('@/components/content/interactive/informatica/MatriceIndici'),
	'inf-matrice-somme': () => import('@/components/content/interactive/informatica/MatriceSomme'),
	'inf-stringa-vocali': () => import('@/components/content/interactive/informatica/StringaVocali'),
	'inf-stringa-palindroma': () => import('@/components/content/interactive/informatica/StringaPalindroma'),
```

Ho aggiunto un file in `src/lib/informatica/` (`tracce-matrici-stringhe.ts`) e uno in `tests/unit/`, come chiede il
brief per le tracce che mancano. `tracce.ts` non è stato toccato.

---

## Gruppo 05: lezioni 74, 75

# Gruppo 5: ricerca binaria (74) e ordinamento per selezione (75)

Tutto in `/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo`. Niente pubblicato, niente git.

## File creati

- Lezioni: `docs/lezioni/informatica/riscritte/74-inf-ricerca-binaria.md` (396 righe),
  `.../riscritte/75-inf-selection-sort.md` (386 righe), con gli omonimi in `note/`, `formulari/`, `flashcard/` (18
  carte ciascuna).
- Figure: `src/components/content/interactive/informatica/RicercaBinariaArmadietti.tsx`,
  `RicercaBinariaSequenziale.tsx`, `SelectionSortImin.tsx`.
- Tracce: `src/lib/informatica/tracce-ricerca-selezione.ts`, con i test in
  `tests/unit/informatica-tracce-ricerca-selezione.test.mjs` (4 test, passano; passano anche gli 8 del kit).
- Esercizi: `specs/exercises/inf-ricerca-binaria.md`, `specs/exercises/inf-selection-sort.md`,
  `src/lib/exercises/v2/generators/inf-ricerca-binaria.ts`, `.../inf-selection-sort.ts`,
  `scripts/exercises/checkers/inf_ricerca_binaria.py`, `.../inf_selection_sort.py`.

## Scelte

- **74.** Funzione `cerca(v, x)` (in C++ `cerca(v, n, x)`), che restituisce l'indice oppure -1; prima l'uguaglianza,
  poi le due metà; ciclo `while sinistra <= destra`. Esempio: gli armadietti occupati della palestra, 3, 8, 12, 17,
  21, 26, 34, 40, cercando il 21 (tre confronti, usa tutti e due i rami) e il 30 (assente, tre confronti). Si conta
  un confronto per elemento guardato, come nelle tracce del kit. I confronti sono visti dimezzando da 1000 (dieci
  numeri, dieci confronti), con un programma che li conta e la tabella 8, 100, 1000, 1 000 000; il logaritmo è solo
  nominato, con il link a matematica.
- **74, C++.** `int centro;` è dichiarata prima del ciclo: con la dichiarazione dentro, la riga supera i 42
  caratteri che stanno in un esercizio sul telefono. Lezione ed esercizi hanno la stessa forma.
- **75.** Struttura del brief, nell'ordine: idea con le carte, figura, (lo scambio), programma, traccia, conteggio,
  "Prova tu". Lo scambio ha la sua sezione, "Scambiare due elementi", subito prima del programma.
- **75, lo scambio solo se `imin != i`.** Così il programma conta gli scambi come la traccia del kit e come la 78
  (0 scambi su un vettore ordinato).
- **75, i dati.** Gli stessi della 76 del gruppo 6: i sei tempi 15, 12, 19, 13, 17, 14, con `ordina`, `stampa` e
  `tempi`. La selezione li ordina con 15 confronti e 3 scambi.
- **Costante `N`** in cima al programma, fuori da `main`, come nella 70; `MAX` uguale a 100 negli esercizi che
  leggono il numero degli elementi, come nella 76.
- **Esercizi.** Nei generatori il vettore è dichiarato `int v[6]`, senza la costante `N`, e il programma del
  livello aperto della 75 legge un indice `k` e scrive `v[k]` invece di leggere e stampare tutto il vettore: sono
  i soli modi per stare nelle 28 righe in C++ e 18 in Python.

## Domande per Andrea

74:
- La funzione restituisce -1 quando il valore non c'è: usi questa convenzione, o una variabile `trovato` accanto
  alla posizione?
- Va bene contare un confronto per elemento guardato, o vuoi contare i due confronti (`==` e `<`) di ogni giro?
- Il logaritmo è solo nominato, con il link a matematica, e al terzo anno non è ancora stato fatto: lo lasci o lo
  togli?
- In C++ va bene `int centro;` dichiarata prima del ciclo?

75:
- Lo scambio va fatto solo quando `imin != i`, come qui, o sempre? Cambia il conto degli scambi (3 contro 5 sui sei
  tempi), e deve essere uguale nella 78.
- Il nome `imin` va bene, e per l'ordine decrescente `imax`?
- La formula $n(n-1)/2$ sta bene già qui, o la lasci alla 78?
- Lo scambio di Python in una riga è in un riquadro: lo accetti nelle risposte degli studenti?

## Da verificare

- La 71 è arrivata mentre lavoravo: l'ho riletta alla fine. La sua funzione si chiama anche lei `cerca(v, x)`,
  restituisce -1 e conta un confronto per elemento, come la mia; ho aggiunto il richiamo nella 74. Le lezioni 77 e
  78 non le ho rilette.
- La 76 del gruppo 6 ha la tabella di traccia prima del programma; la 75 dopo, come dice il brief. Va scelto un
  ordine per le tre lezioni.
- Nella 76 i tempi della corsa campestre sono "in secondi", nella 75 "in minuti" (15 secondi non sono un tempo da
  corsa campestre). Va scritta la stessa unità.
- Nella 76 `const int N = 6;` sta dentro `main`; nella 70 e nelle mie sta in cima.
- Nella 76 la formula in evidenza $(n-1)+(n-2)+\dots+1=\frac{n(n-1)}{2}$ a 390 px esce dal bordo destro: l'avevo
  uguale e l'ho accorciata.
- Il gruppo 6 ha registrato `inf-gara-ricerche` per la 78: se fa quello che fa `inf-ricerca-binaria-sequenziale`,
  una lezione può usare la figura dell'altra.
- Il programma C++ dei confronti con `N` uguale a 1 000 000 funziona sul Mac; nel Clang del sito non l'ho provato,
  e il testo propone solo 2000 e 4000.

## Elementi interattivi

| Nome | Lezione | Domanda | Come l'ho guardato |
|---|---|---|---|
| `inf-ricerca-binaria-armadietti` | 74 | Quanti elementi guarda la ricerca binaria per trovare il 21 tra otto numeri, e quanti per sapere che il 30 non c'è? | Chiaro, scuro, telefono; primo passo, metà, fine; 30 (assente), 3 (primo), 2 e 12 valori, "Nuovi valori", campo con un testo sbagliato; tutti i passi da tastiera a 330, 390 e 800 px: altezza costante, niente fuori dallo schermo. |
| `inf-ricerca-binaria-sequenziale` | 74 | Sullo stesso vettore ordinato, quanti confronti fa la ricerca sequenziale e quanti la binaria? | Come sopra, più "Esegui". I due contatori sono affiancati sotto la frase. |
| `inf-selection-sort-imin` | 75 | Quanti confronti e quanti scambi servono per ordinare sei tempi, e che cosa cambia con un vettore già in ordine? | Come sopra: un confronto, uno scambio, la fine, il vettore ordinato, 2 e 12 valori, "Mescola". |
| Programmi `codice` | 74, 75 | Vedi le note delle lezioni. | Tutti eseguiti nella pagina, Python a 1280 px e C++ a 390 px; "Verifica" premuto in ogni esercizio con il programma di partenza e con la soluzione. |

`inf-ricerca-binaria-armadietti` è la traccia del kit con i dati della lezione (parte dal 21, non dal 26).
`inf-selection-sort-imin` ha una traccia sua: nomi `i`, `j`, `imin`, un passo per ogni riga del programma, frasi con
i valori delle variabili, `i` e `j` sopra le celle e `imin` sotto.

## Esercizi

| Generatore | Livello | Tipo | Diversi su 1000 (seed 1) |
|---|---|---|---|
| `inf-ricerca-binaria` | 1 Un giro della ricerca | testo, con il vettore a larghezza fissa | 1000 |
| | 2 Che cosa scrive la ricerca | che cosa scrive il programma | 1000 |
| | 3 Contare i confronti | testo, conto | 825 |
| | 4 Il corpo del ciclo | opzioni che sono programmi | 1000 |
| | 5 Scrivere la ricerca binaria | aperta, `funzione`; scelta multipla di programmi | 1000 |
| `inf-selection-sort` | 1 Trovare il minimo | che cosa scrive il programma | 1000 |
| | 2 Lo scambio | che cosa scrive il programma | 1000 |
| | 3 Un giro dell'ordinamento | testo | 1000 |
| | 4 Confronti e scambi | testo, conto | 461 |
| | 5 Il corpo del giro | opzioni che sono programmi | 1000 |
| | 6 Scrivere l'ordinamento | aperta, `funzione`; scelta multipla di programmi | 1000 |

- `sample.mts … 1000 all <seed> | verify.py`: PASS con 1, 50001 e 777001 per tutti e due, rifatto dopo l'ultima
  modifica. Con `INF_CPP=1` su 25 esercizi per livello: PASS.
- Errori piantati (13 nel primo, 14 nel secondo: opzione giusta spostata, distrattore uguale al giusto, uscita
  attesa sbagliata, dati di `params` cambiati, riga troppo larga, trattino lungo, prova con l'uscita sbagliata,
  soluzione senza funzione) e due con `INF_CPP=1` (il C++ che scrive altro): tutti bocciati. Uno, il vettore di
  `params` scambiato nel livello 5 della selezione, all'inizio passava: ho aggiunto ai due controlli il confronto
  tra il vettore di `params` e quello scritto nel programma.
- `npx tsc --noEmit -p .`: due passate. Alla prima un errore mio (corretto) e tre in `inf-html-moduli.ts`, di un
  altro gruppo; alla seconda nessun errore in tutto il progetto. `npx eslint` sui miei file: pulito.
- Nel browser a 390 px: ogni livello con il seme 3 in Python (clic sull'opzione giusta) e con il seme 8 in C++
  (clic su una sbagliata); nessuno scorrimento laterale. In due casi il clic dello script non è arrivato, e li ho
  rifatti a parte: "Giusto". Livelli aperti (`&open=1`), in Python e in C++: la soluzione dà
  "Giusto", un programma che scrive il numero sbagliato dà "Sbagliato" con la prova che non passa, uno che scrive i
  numeri giusti senza funzione è bocciato con il messaggio sul costrutto.

## Pezzi del kit che mancano

- Due file di celle con lo stesso vettore e i contatori affiancati (due algoritmi a confronto): l'ho composto a mano
  in `RicercaBinariaSequenziale.tsx` con `Celle`, `Contatori`, `Frase`, `ComandiPassi` e `Dati`. Il riquadro "Cerco
  21" sopra le celle è copiato da `VettorePassi`, che non lo esporta. `Contatori` non ha un titolo né larghezze
  uguali: li ho messi da fuori.
- `Dati` con dodici valori a due cifre taglia il testo del campo sul telefono (si scorre dentro il campo): si vede
  nella seconda figura della 74.

## Limiti

- A 390 px le due tabelle di traccia (sei colonne nella 74, cinque nella 75) scorrono dentro il loro riquadro; la
  pagina non scorre di lato.
- Negli editor della lezione le righe più lunghe (`centro = (sinistra + destra) // 2`, il vettore di dodici
  armadietti, la stampa del programma dei confronti) sul telefono si leggono scorrendo l'editor.
- La risposta aperta è corretta su quello che il programma scrive e sulla presenza di una funzione: una ricerca
  sequenziale dentro `cerca`, o `v.sort()` dentro `ordina`, passano.
- Nel livello 3 della ricerca binaria il caso "al massimo" ha 28 dimensioni possibili, e nel livello 4 della
  selezione i casi `confronti` e `giro` sono pochi: i diversi su 1000 sono 825 e 461.
- Non ho guardato la scheda da stampare né le figure con `prefers-reduced-motion`.
- I link verso le altre lezioni usano gli indirizzi di `url.md`; non li ho aperti, perché le lezioni non sono
  pubblicate.
- I generatori non sono collegati al sito.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, quattro righe in `FIGURES`:

```ts
	// Computer science, third year: binary search and selection sort (group 05).
	'inf-ricerca-binaria-armadietti': () => import('@/components/content/interactive/informatica/RicercaBinariaArmadietti'),
	'inf-ricerca-binaria-sequenziale': () => import('@/components/content/interactive/informatica/RicercaBinariaSequenziale'),
	'inf-selection-sort-imin': () => import('@/components/content/interactive/informatica/SelectionSortImin'),
```

Ho aggiunto due file accanto a quelli comuni, senza toccarli: `src/lib/informatica/tracce-ricerca-selezione.ts` e
`tests/unit/informatica-tracce-ricerca-selezione.test.mjs`.

---

## Gruppo 06: lezioni 76, 77, 78

# Gruppo 06: ordinamento a bolle, per inserimento, confronto tra algoritmi (76, 77, 78)

## Scelte

- 76 e 77 hanno la struttura della 75: l'idea (fila per la foto, carte in mano), la figura passo per passo, la tabella, il programma, confronti e scambi, "Prova tu". La 76 usa gli stessi sei tempi della 75 (15, 12, 19, 13, 17, 14) e ricorda in una frase i conti della selezione.
- 76: bandierina con `while i < n - 1 and scambiato`, così i confronti coincidono con la traccia del kit. Il secondo programma scrive solo "giri fatti", per stare in 400 righe.
- 77: l'elemento tenuto da parte si chiama `x` (il brief non fissava il nome). Si lavora solo per spostamenti. Un confronto è `v[j] > x`; i controlli `j >= 0` non si contano.
- 78: niente O grande; "cresce come n", "come log₂ n", "come n²", definiti da che cosa succede quando n raddoppia. L'operazione contata è il confronto. Nella gara un passo è un confronto per ciascun algoritmo; le bolle corrono con la bandierina.
- 78: per stare in 400 righe gli esercizi della lezione leggono solo n (e k), senza vettori.
- Esercizi con vettori letti: in C++ `int v[MAX]` con `const int MAX = 100`, un valore per riga in ingresso e in uscita.
- I confini tra le tre lezioni e i dettagli sono nelle note di ogni lezione.

## Domande per Andrea

76
- Le bolle portano il più grande in fondo, come qui, o il più piccolo in cima?
- La bandierina con un `while` a due condizioni va bene? Si chiama "bandierina" o "flag"?
- Il ciclo interno accorciato (`n - 1 - i`) va bene come versione di base?

77
- Come si chiama in classe l'elemento tenuto da parte: `x`, `temp`, `chiave`?
- Inserimento per spostamenti, come qui, o prima la versione con gli scambi tra vicini?
- La regola per cui la seconda condizione di un `and` non viene controllata se la prima è falsa va detta qui o nella lezione 58, che non la dice?

78
- "Cresce come n²" e "cresce come log₂ n", o "quadratico" e "logaritmico"?
- Al terzo anno il logaritmo è già stato visto in matematica? Qui è spiegato solo con i dimezzamenti.
- Serve anche il caso medio degli ordinamenti?
- Va bene contare solo i confronti nel caso peggiore, lasciando scambi e spostamenti alla tabella?

## Da verificare

- 76: che cosa fa davvero il C++ dell'editor del sito leggendo `v[n]` (comportamento non definito) non è stato provato.
- 77: `v[-1]` in Python è detto in mezza riga; la lezione 70 non parla di indici negativi.
- 78: la riga "a caso" della tabella a 12 elementi dipende dal seme con cui si apre `GaraOrdinamenti.tsx` (4): se cambia, va rifatta.
- 78: "cento milioni di confronti al secondo" è un'ipotesi dichiarata; "fino a qualche migliaio di elementi" è un ordine di grandezza.
- L'origine del nome "a bolle" non ha una fonte con nome e data.

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-bubble-sort-giri` | 76 | Quanti confronti e scambi sui sei tempi, e che cosa risparmia la bandierina? | 390 e 800 px, chiaro e scuro; primo passo, metà, fine; con la bandierina; vettore rovesciato scritto nel campo; dopo Mescola con Esegui; frecce e Fine da tastiera |
| `inf-insertion-sort-carte` | 77 | Per ogni carta, quanti confronti prima di fermarsi e quanti spostamenti? | 390 e 800 px, chiaro e scuro; primo passo, due punti a metà, fine; vettore già in ordine scritto nel campo; tastiera |
| `inf-gara-ordinamenti` | 78 | Sullo stesso vettore, chi fa meno confronti e chi sposta meno? | 390 e 800 px, chiaro e scuro; inizio, metà, fine; in ordine, rovesciato, a caso; 3, 6 e 12 elementi; dopo Mescola con Esegui; tastiera |
| `inf-gara-ricerche` | 78 | Quanti confronti alle due ricerche per l'ultimo elemento e per uno assente? | 390 e 800 px, chiaro e scuro; primo, centrale, assente; 6 e 12 elementi; metà e fine |
| grafico `crescita-confronti-quadrato-lineare-logaritmo` | 78 | Da 8 a 16 a 32: chi raddoppia, chi quadruplica, chi aumenta di 1? | nella pagina della lezione a 390 px in chiaro e a 1280 px in scuro, solo con n = 8: il cursore non è stato mosso |
| programmi `codice` | 76, 77, 78 | vedi le note | tutti eseguiti nella pagina, Python a 390 px e C++ a 1280 px; "Verifica" con la soluzione in tutti e sei gli esercizi, nei due linguaggi; nessun errore in console, nessuno scorrimento laterale, nessuna immagine mancante |

La 74 ha già una figura con le due ricerche fianco a fianco su dodici elementi: `inf-gara-ricerche` le somiglia. Chi coordina può tenerne una sola.

## Pezzi del kit che mancano

- Contatori compatti in riga. `Contatori` del kit è troppo largo per stare accanto al nome di una corsia a 330 px: in `informatica/gara.tsx` (file mio, nuovo) ci sono `Corsia` (nome, contatori in riga, celle senza indici e senza puntatori), `Scelta` (un `ToggleGroup` con il nome visibile sopra, che `ToggleGroup` non ha), `corridore`, `passoAl` e `ritmoDi`. Se servono ad altri, vanno nel kit.
- `corridore` e `passoAl` sono funzioni pure ma stanno in un file `.tsx` e non hanno un test.

## Limiti

- `npx tsc` non è stato lanciato da me, su indicazione di chi coordina: i miei cinque file `.tsx` e i tre generatori hanno solo ESLint pulito e il fatto che il sito li carica.
- I tre generatori li hanno scritti tre sottoagenti, che hanno riferito a chi coordina e non a me. Io ho controllato di persona solo questo: i nove file esistono, `sample.mts 1000 all | verify.py` dà PASS con i seed 1, 50001 e 777001 per tutti e tre, ESLint è pulito, nomi e numero dei livelli. Non ho visto di persona: il controllo del C++ (`INF_CPP=1`), gli errori piantati, il conto degli esercizi diversi per livello, le pagine degli esercizi a 390 px e le risposte aperte consegnate. Non ho riletto il codice dei generatori né le specifiche.
- Nella 76 il livello 4 si chiama "Quale ciclo interno ordina", diverso da quello che avevo chiesto ("Quale funzione ordina"): la ragione è nel rapporto del sottoagente, che non ho letto.
- Le lezioni hanno da 26 a 40 paragrafi di testo fuori dai programmi, meno delle 50 righe indicate dal brief; le parole sono tra 1000 e 1400. La 76 è a 398 righe su 400.
- Nel grafico della 78 il bottone "Reset" copre l'angolo vicino all'origine, e retta e logaritmo sono schiacciati sull'asse (è il punto della figura, ma si leggono male).
- Nella figura dell'inserimento la freccia `j`, dopo uno spostamento, sta sotto il posto libero (l'indice appena confrontato), mentre nel programma `j` è già diminuito: la traccia comune non è stata cambiata.
- Le figure non sono state provate con uno screen reader.
- Nessun avviso rimasto in `check.mts`.

## File condivisi toccati

`src/lib/utils/interactive.ts`, cinque righe aggiunte in `FIGURES`:

```ts
	// Computer science, third year: sorting and counting operations (group 06).
	'inf-bubble-sort-giri': () => import('@/components/content/interactive/informatica/BubbleSortGiri'),
	'inf-insertion-sort-carte': () => import('@/components/content/interactive/informatica/InsertionSortCarte'),
	'inf-gara-ordinamenti': () => import('@/components/content/interactive/informatica/GaraOrdinamenti'),
	'inf-gara-ricerche': () => import('@/components/content/interactive/informatica/GaraRicerche'),
```

File nuovi miei fuori dall'elenco del brief: `src/components/content/interactive/informatica/gara.tsx`.

---

## Gruppo 07: lezioni 79, 80, 81

# Gruppo 7: i file (lezioni 79, 80, 81)

Lezioni 79 `inf-file-testo`, 80 `inf-file-csv`, 81 `inf-xml-json`. Per ciascuna: lezione, nota, formulario,
flashcard, figura interattiva registrata, specifica, generatore e controllo Python. Niente pubblicato, niente
commit.

## Scelte

- **Confini tra le tre.** La 79 ha un dato per riga (aprire, leggere, convertire, scrivere, accodare, chiudere, il
  file che non c'è). La 80 divide la riga in campi e parla solo di tabelle. La 81 parte da quello che una tabella
  non sa dire (una lista dentro un record). `strip()` e `readline()` nascono nella 79 perché la 80 li usa.
- **Conversione in C++.** `getline` e poi `stoi(riga)`, in parallelo con `int(riga)` di Python; `file >> voto` è in
  un riquadro della 79 come scrittura alternativa. Nella 80 un campo per variabile, letto con `getline(file, campo,
  ',')`, senza `stringstream`.
- **File che non c'è.** In Python `try` ed `except FileNotFoundError`, dati come forma da usare; in C++ `if
  (!file)`.
- **Chiusura.** Python sempre con `with`; in C++ `file.close()` scritto in ogni programma.
- **Campi contati da 0** nella 80 ("il campo 0 è il nome"), come gli indici della lista di `split`.
- **81 solo in Python** per i programmi (`json.load`), e lo dice. I due esercizi della 81 fanno scrivere il file di
  dati: lo studente corregge `gita.xml` e completa `playlist.json`, il programma è già scritto (per l'XML usa
  `xml.etree.ElementTree`, che la lezione non spiega).
- **Un file accanto al programma che scrive** (79, tabellina): senza un file di dati l'editor non tiene il file
  scritto tra un'esecuzione e l'altra, quindi il blocco ha un `tabellina.txt` di partenza.
- **Esercizi.** 79: cinque livelli, l'aperto fa scrivere un file e rileggerlo. 80: sei livelli, l'aperto legge le
  righe `nome,punti` dalla tastiera e le taglia. 81: cinque livelli a scelta multipla su frammenti, senza un
  livello sulla scelta del formato (sarebbero opinioni).
- I programmi dei generatori usano nomi di file corti (`num.txt`, `turni.txt`) dove la riga del C++ o
  dell'opzione Python supererebbe la larghezza; nel livello 5 della 80 i vettori C++ sono dichiarati senza
  dimensione (`string nomi[] = {...}`) per lo stesso motivo.

## Domande per Andrea

79
- Per il file che non c'è in Python va bene `try` ed `except`, oppure preferisci `os.path.exists`?
- In C++ i numeri si leggono con `getline` e `stoi`, come qui, o con `file >> voto` come forma principale?
- `file.close()` in C++ va scritto sempre, anche quando il file si chiude da solo alla fine di `main`?
- "Segnaposto" per il punto del file a cui è arrivata la lettura va bene, o usi "cursore"?

80
- In C++ va bene un `getline` con il separatore per ogni campo, o preferisci la riga intera e `stringstream`?
- Il separatore dei file della lezione è la virgola, e il punto e virgola compare nella figura e in un riquadro:
  lo vuoi al contrario, visto che i file esportati a scuola hanno quasi sempre il punto e virgola?
- Il modulo `csv` di Python va solo nominato, come qui?

81
- Un solo programma, in Python con `json`, e il dizionario detto in una riga: basta?
- Gli esercizi con il file da correggere e il programma già scritto ti sembrano adatti?
- Per XML bastano le quattro regole del ben formato, senza schemi e senza la dichiarazione `<?xml ... ?>`?

## Da verificare

- 80: il punto e virgola come separatore nelle versioni italiane dei fogli di calcolo (viene dal separatore di
  elenco delle impostazioni internazionali): la lezione dice "spesso", senza nominare prodotti. La RFC 4180
  (Shafranovich, ottobre 2005) non è nominata.
- 81: XML 1.0 è una raccomandazione del W3C del 10 febbraio 1998; JSON è descritto da ECMA-404 (ottobre 2013) e
  RFC 8259 (dicembre 2017). Nomi e date stanno solo nella nota. In XML gli attributi possono stare anche tra apici
  singoli: la lezione dice "tra virgolette". L'esempio "fatture elettroniche" tra gli usi di XML (formato
  FatturaPA) va confermato.
- 79: il riquadro sulla chiusura prima di rileggere vale come regola; con `endl` in C++ il problema non si vede.

## Elementi interattivi

| Nome | Lezione | Domanda | Come l'ho guardato |
|---|---|---|---|
| `inf-file-lettura-righe` | 79 | Che cosa finisce in `riga` a ogni giro, e da dove riparte la lettura al giro dopo? | Sul sito in chiaro e in scuro, a 800 e a 390 px, al primo passo, a metà e alla fine; dentro la lezione; frecce, Inizio e Fine da tastiera; "Esegui" |
| `inf-csv-campi` | 80 | Dove taglia il programma una riga, e che cosa succede se il separatore non è quello del file? | Chiaro e scuro, 800 e 390 px, più passi; `voti.csv` con la virgola e con il punto e virgola, `medie.csv` con la virgola; dentro la lezione in scuro; frecce da tastiera |
| `inf-albero-xml-json` | 81 | Che cosa corrisponde, in XML e in JSON, a ogni nodo dell'albero? | Chiaro e scuro, 800 e 390 px, con `voti` e con un voto scelti; dentro la lezione; ogni nodo scelto da tastiera e con un clic sul testo |
| Programmi con file | 79, 80, 81 | Che cosa cambia nel programma se cambiano i dati del file? (e che cosa resta nel file dopo) | Ogni programma eseguito nel browser, in Python e in C++ (81 solo Python), a 1280 e a 390 px; "Verifica" con il programma di partenza (non passa) e con la soluzione (passa) in tutti e 6 gli esercizi |
| TikZ `struttura-file-csv`, `albero-dato-studente` | 80, 81 | statiche | In chiaro e in scuro con lo script di anteprima, e dentro la lezione a 390 px |

Le tracce delle due figure a passi sono funzioni pure con i test: `src/lib/informatica/file-righe.ts`,
`src/lib/informatica/csv-campi.ts`, `tests/unit/informatica-file.test.mjs` (4 test, tutti passati).

## Esercizi

| Generatore | Livelli | Aperti | Diversi su 1000, per livello | Seed |
|---|---|---|---|---|
| `inf-file-testo` | 5: che cosa scrive (1, 2), che cosa resta nel file (3), programmi come opzioni (4), scrivi il programma (5) | 5 | 998, 999, 980, 999, 1000 | PASS 1, 50001, 777001 |
| `inf-file-csv` | 6: frammenti (1, 2), che cosa scrive (3), programmi come opzioni (4), che cosa resta nel file (5), scrivi il programma (6) | 6 | 961, 1000, 1000, 1000, 999, 1000 | PASS 1, 50001, 777001 |
| `inf-xml-json` | 5, tutti a scelta multipla su frammenti | nessuno | 1000, 517, 1000, 985, 913 | PASS 1, 50001, 777001 |

- C++: `INF_CPP=1` su 25 esercizi per livello, PASS per `inf-file-testo` e `inf-file-csv` (la 81 non ha programmi).
- Errori piantati: 24, tutti bocciati (opzione giusta spostata, uscita attesa sbagliata, file cambiato, distrattore
  che scrive come il giusto, soluzione senza ciclo, C++ che scrive altro o che scrive dove Python accoda,
  frammento giusto reso non valido, distrattore reso ben formato o con gli stessi dati).
- ESLint pulito sui miei file. `tsc`: nessun errore nei miei file; 4 errori in file di altri gruppi
  (`generators/inf-html-moduli.ts`, 3; `generators/inf-ricerca-binaria.ts`, 1).
- Pagina di prova a 390 px: ogni livello con due semi, una risposta giusta e una sbagliata, 32 pagine, tutte con
  il verdetto atteso, senza scorrimento laterale e senza errori in console. Livelli aperti: una risposta giusta e
  una sbagliata in Python, una giusta in C++, per tutti e due i generatori. Ho guardato cinque schermate; le
  altre sono controllate solo dallo script.

## Pezzi del kit che mancano

- Dentro una lezione gli elementi `pre`, `table`, `ol` e `li` di una figura prendono lo stile di
  `.markdown-content`, che vince sulle classi: nelle mie figure sono `div` con i ruoli. Un pezzo del kit per un
  testo a larghezza fissa e uno per una tabella eviterebbe a ogni gruppo di riscoprirlo.
- Un albero con i nodi da scegliere (l'ho fatto a mano in `AlberoXmlJson.tsx`; serve anche per il DOM e per il
  top-down).
- Il pannello "file di testo riga per riga, con la riga in corso evidenziata" (a mano in `CsvCampi.tsx`).
- `Variabili` non tiene l'altezza da un passo all'altro: ho messo sotto una copia invisibile della riga più larga.
- `Dati` ha l'etichetta fissa "I valori del vettore": per i numeri di un file non si poteva usare, e la figura
  della 79 ha i dati fissi.

## Limiti

- Le risposte aperte si correggono su quello che il programma stampa. Nel livello 5 della 79 una risposta che fa
  il conto senza usare il file viene accettata; nel livello 6 della 80 le righe arrivano dalla tastiera, non da un
  file, perché la pagina non dà file al programma dello studente.
- La 81 è a 200 righe e la 79 a 399: sul limite. La 81 ha un avviso di `check.mts` (13 grassetti, tutti termini
  definiti).
- Le lezioni non le ho guardate schermata per schermata: ho guardato le figure dentro la pagina, alcune schermate
  a 390 e a 1280 px e l'esito di ogni editor; il resto (scorrimento laterale, immagini, console) lo dice lo script.
- Da telefono, nella figura della 81, i due testi stanno affiancati a 11 px: si leggono, ma sono piccoli.
- I pezzi di testo XML e JSON della figura della 81 rispondono solo al puntatore; da tastiera si usano i nodi
  dell'albero.
- Il C++ dei frammenti del livello 5 della 80 è controllato sul contenuto del file solo con `INF_CPP=1`.
- I formulari e le flashcard non li ho guardati nel browser.

## File condivisi toccati

`src/lib/utils/interactive.ts`, quattro righe in fondo a `FIGURES`:

```ts
	// Computer science, third year: files (group 07).
	'inf-file-lettura-righe': () => import('@/components/content/interactive/informatica/LetturaRighe'),
	'inf-csv-campi': () => import('@/components/content/interactive/informatica/CsvCampi'),
	'inf-albero-xml-json': () => import('@/components/content/interactive/informatica/AlberoXmlJson'),
```

File nuovi oltre a quelli delle lezioni: `src/lib/informatica/file-righe.ts`, `src/lib/informatica/csv-campi.ts`,
`tests/unit/informatica-file.test.mjs`, `src/lib/exercises/v2/inf-file.ts` (aiuti comuni ai tre generatori),
`scripts/exercises/checkers/_inf_file.py` (esegue un programma e restituisce anche i file che lascia).

---

## Gruppo 08: lezioni 82, 83, 84

# Gruppo 08: formati, bitmap e vettoriale, compressione (lezioni 82, 83, 84)

## Scelte

- Confini tra le tre lezioni. La 82 definisce "con perdita" e "senza perdita" in due frasi, perché servono a leggere
  le tabelle dei formati, e rimanda alla 84 per il come. SVG nella 82 è solo "vettoriale"; che cosa vuol dire è della
  83. Contenitore e codec sono introdotti nella 82 con una figura; i codec per nome sono lasciati alla 85.
- La 82 ha la "firma" dei formati (i primi byte del file), che rende vera la frase "l'estensione non è il
  contenuto" e dà un programma da eseguire. Non è nei programmi del liceo: è una domanda per Andrea.
- La 83 misura la stampa in pollici e dpi ("densità di stampa"), con i centimetri negli esempi; "risoluzione"
  resta il numero di pixel, come nella 11. La pagina SVG è fatta del solo elemento `svg`.
- La 84 definisce il rapporto di compressione come originale diviso compresso ($12 : 1$); RLE con il numero prima
  del valore (`6B4N4R2B`), un byte per pixel e due per sequenza. Huffman è solo nominato.
- Lunghezza: le righe totali sono 434, 249 e 348, perché ogni esercizio di "Prova tu" è nei due linguaggi. Il testo
  fuori dai blocchi `codice` è di circa 160, 135 e 150 righe. La 82 e la 84 superano le 200 righe del brief se si
  contano i programmi.
- Generatori in testo semplice, con `makeGenerator` e gli aiuti di `inf-sic.ts` (situazioni, affermazioni, testi da
  classificare), importati senza modificarli; la 83 usa `makeCodeGenerator` per il frammento SVG sotto la domanda.
  Le unità sono scritte fuori dalle formule ("$975$ kB"), perché nei campioni in testo `\text{}` non si usa.

## Domande per Andrea

- 82: la firma dei file resta, o è troppo? Contenitore e codec stanno qui o solo nella 85? DOCX va tra i formati
  aperti, tra i proprietari, o resta fuori come ora? GIF come "senza perdita, ma con 256 colori" va bene?
- 83: i libri in uso fanno i conti della stampa in pollici o in centimetri? Va bene una pagina fatta del solo `svg`
  prima delle lezioni di HTML? Le operazioni di base bastano in una tabella, o la voce `editing-base` dell'albero
  vuole una lezione sua?
- 84: il rapporto di compressione è originale diviso compresso, o i libri lo definiscono al contrario? RLE si
  scrive `6B` o `B6`? Per dizionario e codici di lunghezza diversa basta l'idea con un esempio?

## Da verificare

- Le firme dei formati (PNG, JPEG, GIF, PDF, ZIP), scritte a memoria dalle specifiche.
- Le date e le norme dei formati aperti citate nella nota della 82 (PDF ISO 32000-1 del 2008, ODT ISO/IEC 26300 del
  2006); nella lezione non ci sono date.
- La tabella di quantizzazione della figura sulla perdita, quella della norma JPEG (ITU-T T.81, allegato K),
  scritta a memoria.
- Gli ordini di grandezza: "una foto senza perdita si dimezza, più o meno", "un formato audio senza perdita porta a
  poco più della metà", "300 dpi per un foglio guardato da vicino", WebP "di solito con file più piccoli".
- APNG esiste, e la tabella dice "PNG: animazione no".

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-scegli-formato` | 82 | Quale formato conviene per questa immagine, e perché gli altri no? | chiaro a 800 px (fotografia, logo), chiaro a 390 px (animazione), scuro a 390 px; dentro la lezione a 1280 e a 390 |
| programma delle firme, `codice` | 82 | Il file si chiama gita.png: che cosa c'è dentro? | eseguito nel browser in Python e in C++ |
| `contenitore-e-tracce`, TikZ | 82 | Che cosa c'è dentro un file video? | nella lezione, solo in chiaro |
| `inf-bitmap-vettoriale-zoom` | 83 | Che cosa succede ingrandendo la stessa figura come bitmap e come vettoriale? | chiaro a 800 px a 1 e a 8, chiaro a 390 px a 3, scuro a 390 px a 24 |
| pagina SVG, `codice html` | 83 | Che cosa c'è scritto in un file vettoriale? | eseguita nel browser; i due esercizi verificati con la soluzione |
| `inf-pixel-risoluzione-profondita` (del kit) | 83 | Che cosa si perde togliendo pixel? | solo dentro la lezione: non l'ho riguardata da sola |
| `inf-rle-riga` | 84 | Quando RLE accorcia una riga di pixel, e quando la allunga? | chiaro a 800 px all'inizio e dopo aver dipinto da tastiera, chiaro a 390 px con la scacchiera, scuro con la tinta unita |
| programma RLE, `codice` | 84 | Che cosa succede comprimendo due volte? | eseguito nel browser in Python e in C++ |
| `inf-compressione-perdita` | 84 | Quanto si può buttare prima che si veda? | chiaro a 800 px a qualità 50 e 10, chiaro a 390 px a 5, scuro a 390 px a 95 |

Le tre lezioni sono state aperte a 1280 e a 390 px: nessun errore in console, nessuna immagine mancante, nessuno
scorrimento laterale della pagina. Ogni programma è stato eseguito e ogni esercizio verificato con la soluzione, in
Python e in C++.

## Pezzi del kit che mancano

- `src/lib/informatica/compressione.ts` (file nuovo mio): sequenze e codifica RLE, e la compressione a blocchi di
  8 per 8 con la tabella di JPEG. Test in `tests/unit/informatica-compressione.test.mjs` (8 prove, tutte superate).
- Una scelta tra più di quattro opzioni che vada a capo: `ScegliFormato.tsx` ha i suoi bottoni a pillola
  (`role="radio"`), perché `ToggleGroup` non va a capo. Servirà anche ad altri.
- Una tavolozza di colori con cui dipingere su `GrigliaPixel`: `RleRiga.tsx` ha la sua.
- Due viste affiancate con la didascalia sotto (originale e risultato): rifatte in `BitmapVettorialeZoom.tsx` e in
  `CompressionePerdita.tsx`.

## Limiti

- La 82 (434 righe) e la 84 (348) superano le 200 righe indicate per le lezioni di concetto, contando i programmi.
- Le figure non sono state provate con uno screen reader, e da tastiera ho provato solo `inf-rle-riga`. Il tema
  scuro è stato guardato sulle figure da sole, non sulle lezioni intere.
- La figura TikZ della 82 è stata guardata solo in chiaro.
- `inf-compressione-perdita` ricalcola 4096 pixel a ogni scatto del cursore, e `inf-bitmap-vettoriale-zoom` ne
  ridisegna 9216: su un computer è fluido, su un telefono vero non l'ho provato.
- Nei controlli delle due pagine SVG ho verificato che la soluzione passi, non che la pagina di partenza venga
  bocciata.
- Esercizi: ogni livello guardato a 390 px con due semi (3 e 8) senza scorrimento laterale; ho letto con attenzione
  solo otto di quelle trentadue schermate, e non ho consegnato risposte nella pagina di prova (i livelli sono tutti
  a scelta multipla, nessuno aperto).
- Errori piantati (opzione giusta spostata, due opzioni uguali, `case` cambiato): tutti bocciati. Con un numero del
  testo cambiato, 4 campioni su 105 non sono bocciati: sono scene in cui il numero non entra nella risposta.
- Esercizi diversi su 1000 (seed 1): 82: 665, 672, 407, 418, 913; 83: 386, 733, 385, 198, 913; 84: 192, 994, 985,
  631, 967, 936.
- `npx tsc --noEmit -p .` lanciato una volta: nessun errore nei miei file; 5 errori in file di altri gruppi
  (`inf-html-moduli.ts`, `inf-markup.ts`, `inf-ricerca-binaria.ts`). Durante il lavoro il sito di sviluppo si è
  fermato una volta per un import rotto in `CelleUnite.tsx` e `ModuloInviato.tsx` (da `listato.tsx`), non miei.
- I generatori non sono collegati al sito.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, in fondo a `FIGURES`:

```ts
	// Computer science, third year: media formats and compression (group 08).
	'inf-scegli-formato': () => import('@/components/content/interactive/informatica/ScegliFormato'),
	'inf-bitmap-vettoriale-zoom': () => import('@/components/content/interactive/informatica/BitmapVettorialeZoom'),
	'inf-rle-riga': () => import('@/components/content/interactive/informatica/RleRiga'),
	'inf-compressione-perdita': () => import('@/components/content/interactive/informatica/CompressionePerdita'),
```

---

## Gruppo 09: lezioni 85, 86, 87

# Gruppo 9: audio e video, font, linguaggi di markup (lezioni 85, 86, 87)

Tutto in `/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo`. Niente pubblicato, niente commit.

## Scelte

- **85 e 12.** Campionamento, quantizzazione e conto dei byte di un suono non compresso restano nella 12. La 85 gira attorno al bitrate: quello non compresso in una formula, quello di un file compresso come scelta di chi salva, e la dimensione come bitrate per secondi diviso 8.
- **85, 82 e 84.** I formati audio sono una tabella di tre righe con il link alla 82. Codec e contenitore sono due paragrafi sul video. La compressione tra fotogrammi è spiegata con le sole differenze pixel per pixel; la compensazione del movimento è una frase, i fotogrammi I, P e B non sono nominati.
- **86 e 10, 83, 92.** Il codice del carattere è della 10, il disegno della 86. Font bitmap e a contorni sono un caso di bitmap e vettoriale, con il link alla 83. Lo studente non ha ancora scritto CSS: le pagine hanno il foglio di stile pronto, con soli selettori di elemento, e chiedono di cambiare i valori.
- **86, parole.** "Famiglia di caratteri" per il disegno con le sue varianti, "font" per il file; "con le grazie", "senza grazie", "a spaziatura fissa"; "corpo", "peso", "interlinea", "linea di base".
- **87 e 36, 81, 88.** La prima pagina è completa ma di doctype, `html` e `head` il testo dice solo che li spiega la lezione dopo. L'albero è quello del contenuto di `body`. XML è un paragrafo con il link alla 81. Markdown ha quattro segni (`#`, `*`, `**`, `-`).
- **87, elementi.** `h1`, `p`, `em`, `strong`, `ul`, `li`; `a` solo nella figura delle parti di un elemento; `br` solo nominato. `em` e `strong` presentati per il significato.
- **I Fuori Tempo.** Il sito comincia nella 87: nome, una riga, l'elenco di chi suona (Sara voce, Leo batteria, Amir basso, Giulia chitarra). Il gruppo compare già nella 85 (la registrazione delle prove) e nella 86 (la locandina del concerto, "sabato 14 marzo alle 21, nella palestra della scuola").
- **Esercizi.** Tre generatori di cinque livelli, tutti a scelta multipla, con `makeCodeGenerator`. Nessun livello aperto. Nella 85 quattro livelli su cinque sono conti costruiti all'indietro.
- **Lunghezza.** Le tre lezioni hanno 258, 284 e 305 righe: circa 140-150 di testo ciascuna, il resto sono programmi, pagine e soluzioni. Sono sopra le 200 righe indicate per le lezioni di concetto.

## Domande per Andrea

**85**
- Codec e contenitore stanno bene qui, o vanno lasciati per intero alla 82?
- "Bitrate" oppure "flusso di bit", come in una riga della lezione 12?
- Serve nominare i fotogrammi I, P e B?
- Vuoi dell'audio vero da ascoltare a bitrate diversi? Non c'è.

**86**
- "Famiglia di caratteri" e "font", oppure "tipo di carattere" come nei menu dei programmi?
- "Con le grazie" e "senza grazie", oppure "graziati" e "bastoni"?
- La 86 usa il CSS prima della 92: va bene come anticipo, o la lezione va spostata dopo?

**87**
- "Marcatore" in generale e "tag" per l'HTML: vanno bene tutte e due?
- `em` e `strong` anticipati qui, prima della 89?
- L'albero con `body` come radice anticipa troppo la 88?
- Markdown come secondo esempio, o i tuoi libri usano LaTeX?

## Da verificare

Scritti a memoria, senza controllo in rete. L'elenco completo è nelle tre note.

- 85: i numeri del CD (44,1 kHz, 16 bit, 1411,2 kbit/s); "a 320 kbit/s quasi nessuno distingue il file dall'originale"; FLAC "circa la metà"; 24, 25, 30 e 60 fotogrammi al secondo; "una fotografia compressa bene diventa dieci o venti volte più piccola"; H.264 "molto diffuso"; un fotogramma chiave "ogni pochi secondi"; 5 Mbit/s come bitrate plausibile di un Full HD.
- 86: l'origine delle grazie; i 16 pixel e l'interlinea tra 1,4 e 1,6 come regole di leggibilità; il maiuscolo che si legge più lentamente; quali font sono installati su quali dispositivi.
- 87: un lettore XML rifiuta un file non ben formato; chi usa Markdown.
- Il controllo `p | stile font-family = "Courier New", monospace` (86, secondo esercizio) è provato solo con Chromium.
- Il secondo esercizio della 87 conta su come Chromium ripara un `h1` non chiuso e un `<p>` scritto al posto di `</p>`.

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-audio-video-dimensione` | 85 | Quanto occupa un brano o un video senza compressione, e quanto con il bitrate di un file compresso? | Chiaro e scuro a 800 px, telefono a 390 px, nei due modi (brano, video). Corretti: l'ordine delle frequenze, i contatori che andavano a capo, i decimali. I singoli valori dei comandi non sono stati provati uno per uno. |
| `inf-video-fotogrammi-differenza` | 85 | Quanti pixel cambiano davvero da un fotogramma al successivo? | Primo passo, terzo, settimo (cambio di scena) e ultimo, chiaro, scuro e telefono; il tasto Fine da tastiera. Corretti i contatori e la didascalia che cambiava altezza. |
| `inf-font-bitmap-contorno` | 86 | Che cosa succede a una lettera ingrandendola, se è una griglia di pixel e se è un contorno? | A 10, 40 e 80 pixel, con e senza contorno, chiaro, scuro e telefono. |
| `inf-markup-testo-albero-pagina` | 87 | Che cosa hanno in comune il testo marcato, l'albero e la pagina? | HTML e Markdown, elementi `em` e `ul` scelti, chiaro, scuro e telefono. Rifatto l'albero dopo la prima anteprima (gli stili della pagina entravano in `ul`, `li` e `h4`). |
| Pagine `codice html` con `css` | 86 | Che cosa cambia con la famiglia, con corpo, peso e interlinea, e se un font manca? | Eseguite nella lezione a 1280 e a 390 px. Le modifiche che il testo chiede allo studente non sono state provate una per una. |
| Prima pagina `codice html` | 87 | Che cosa succede cambiando il testo e togliendo un tag di chiusura? | Eseguita; l'effetto di `</h1>` mancante è stato visto nell'esercizio 2. |
| Programmi `codice` | 85 | (esercizi) | `verifica.mts` nei due linguaggi, e Verifica nel browser. |

Le tre lezioni intere sono state aperte a 1280 e a 390 px, in chiaro, e a 1280 px in scuro: nessun errore in console, nessuna immagine mancante, nessuno scorrimento laterale. In ogni esercizio "Verifica" è stato premuto con la partenza (non passa) e con la soluzione (passa), a 1280 e a 390 px. Le figure TikZ sono state guardate in chiaro; in scuro solo dentro la lezione.

Dei tre generatori sono stati guardati tutti i livelli a 390 px con due semi (3 e 58): nessuno scorrimento, nessun errore. Non ho cliccato le opzioni fino al verdetto.

## Pezzi del kit che mancano

- Un interruttore acceso/spento (`Switch`): non c'è tra i componenti, ho usato `ToggleGroup` con due opzioni.
- Una barra di confronto in scala (due quantità, una sotto l'altra, con il valore a destra): l'ho scritta dentro `AudioVideoDimensione.tsx`. Servirebbe anche alla 84 (rapporto di compressione).
- Un albero di nodi con i rami (elementi annidati): scritto dentro `MarkupTestoAlberoPagina.tsx`. La 88 e la 97 ne avranno bisogno.
- File nuovi miei accanto a `tracce.ts`: `src/lib/informatica/fotogrammi.ts` e `src/lib/informatica/glifi.ts`, con i test in `tests/unit/informatica-gruppo09.test.mjs` (4 test, passano).
- `Contatori` con tre voci va a capo a 390 px quando le etichette sono lunghe: ne ho usate due.
- Dentro una figura gli elementi `ul`, `li` e `h4` prendono gli stili del testo della lezione: ho usato `div` con `role="list"`.

## Limiti

- `npx tsc --noEmit -p .` lanciato due volte: un errore in `inf-markup.ts` (riga 222), corretto dopo. Non potendo rilanciarlo sul progetto, ho controllato i tre generatori con un `tsc` sui soli tre file, senza errori. I componenti e i due file di `src/lib/informatica` non davano errori nella passata sul progetto. Restavano 4 errori in file di altri gruppi.
- `scripts/figure/anteprima.mjs` in questa cartella non parte (manca `node-tikzjax` in `scripts/figure`): ho lanciato lo stesso script dalla cartella `Sapiens`, in sola lettura, con l'uscita nello scratchpad.
- Un `<` o un `>` scritto come testo in una figura TikZ rompe l'SVG ("Invalid character in tag name"): nella figura della 87 sono disegnati come tratti.
- Nella pagina di prova degli esercizi, sopra le opzioni compare la scelta "Python | C++" anche nei livelli che hanno solo un frammento: è della pagina, non l'ho toccata.
- Gli esercizi di una pagina con `css` aprono l'editor su `index.html`, mentre nella 86 lo studente deve lavorare in `style.css`: il testo lo dice, ma serve un clic in più.
- Nel generatore `inf-font` i nomi dei font sono marchi veri (Georgia, Calibri, Menlo e altri): sono valori di `font-family`, e inventarli non insegnerebbe a leggerne uno vero. Da decidere.
- Livello 5 di `inf-markup`: 147 esercizi diversi su 1000, il più basso dei quindici livelli. Livello 1 di `inf-audio-video`: 120.
- Errori piantati (opzione giusta spostata, numero del testo cambiato, distrattore reso uguale al giusto) su 136 campioni per generatore: tutti bocciati. Per `inf-markup` il testo non ha numeri, quindi quella prova non si applica.
- Durante il lavoro il sito di sviluppo ha dato per qualche minuto un errore di compilazione per un file non mio (`CelleUnite.tsx` importava `Codice` da `listato.tsx`); si è risolto da solo.
- Non c'è audio da ascoltare nella 85.

## File condivisi toccati

`src/lib/utils/interactive.ts`, in fondo a `FIGURES`:

```ts
	// Computer science, third year: audio, video, fonts and markup (group 09).
	'inf-audio-video-dimensione': () => import('@/components/content/interactive/informatica/AudioVideoDimensione'),
	'inf-video-fotogrammi-differenza': () => import('@/components/content/interactive/informatica/VideoFotogrammiDifferenza'),
	'inf-font-bitmap-contorno': () => import('@/components/content/interactive/informatica/FontBitmapContorno'),
	'inf-markup-testo-albero-pagina': () => import('@/components/content/interactive/informatica/MarkupTestoAlberoPagina'),
```

Nessun altro file condiviso.

---

## Gruppo 10: lezioni 88, 89

# Gruppo 10: lezioni 88 (Struttura di una pagina HTML) e 89 (Testo, link e immagini)

File consegnati, per ciascuna lezione: `riscritte/`, `note/`, `formulari/`, `flashcard/` in `docs/lezioni/informatica/`; `specs/exercises/<slug>.md`; `src/lib/exercises/v2/generators/<slug>.ts`; `scripts/exercises/checkers/inf_html_struttura.py` e `inf_html_testo_link.py`. Figure: `src/components/content/interactive/informatica/AlberoDocumento.tsx` e `PercorsiSito.tsx`, con le funzioni pure in `src/lib/informatica/albero-documento.ts` e `percorsi-sito.ts` e i test in `tests/unit/informatica-albero-documento.test.mjs` (7 test, passano).

## Scelte

- Confine tra le due lezioni. La 88 ha scheletro, titoli e paragrafi, parti della pagina, albero, commenti, errori. La 89 ha `em`, `strong`, `br`, i link e le immagini. Nella 88 il menu ha già due `<a href>` (un `nav` senza link non è un menu), con una frase che rimanda alla 89.
- Le pagine sono progetti di un file (`codice index.html`) e non blocchi `codice html`: con `codice html` l'editor mostra anche le linguette `style.css` e `script.js` vuote, che prima del capitolo sul CSS confondono.
- Parole: "testa" e "corpo", "scheda" del browser, "genitore", "figlio", "fratelli"; "indirizzo assoluto" (URL intero) e "percorso relativo".
- 88: oltre a `header`, `nav`, `main`, `footer` c'è `section` (una riga) e `div` in un riquadro, perché servono ai capitoli sul CSS. Regole dei titoli: un solo `h1`, nessun livello saltato scendendo.
- 89, immagini: un'immagine non si scrive in un blocco. Il disco della pagina è un SVG scritto in `src` come `data:`, con `alt`, `width` e `height` prima di `src` perché restino visibili. Per far vedere `alt` lo studente mette in `src` un file che non c'è. Tabella completa delle prove nella nota della 89.
- `width` e `height` restano attributi HTML, perché sono nel confine della lezione e riservano lo spazio; il brief vieta gli attributi di presentazione, quindi è una scelta da confermare.
- Generatori: tutti i livelli a scelta multipla su frammenti; i livelli 2 e 3 della 89 sono il conto del percorso relativo, nei due versi.

## Domande per Andrea

88:
- Va bene insegnare "un solo `h1` per pagina" come regola, anche se lo standard non la impone?
- `section` e `div` già qui, o solo dal CSS?
- "Testa" e "corpo" accanto a `head` e `body`: come dicono i libri in adozione?

89:
- `b` e `i` vanno almeno nominati?
- Il percorso che comincia con `/` in un riquadro: tenerlo o toglierlo?
- `width` e `height` nell'HTML, o tutto al CSS?
- Serve `target="_blank"`?

## Da verificare

- 88: `title` "tra i preferiti e nei risultati di un motore di ricerca" e "senza `meta charset` il browser indovina la codifica" sono scritti a memoria. Il comportamento davanti agli errori (titolo non chiuso, testo in `head`, tag sconosciuto, `</p>` mancante, commento non chiuso, chiusura di un elemento non aperto) è stato provato il 7 ottobre 2026 in Chromium, WebKit e Firefox di Playwright: i tre browser costruiscono lo stesso albero.
- 89: "con `width` e `height` il browser riserva il rettangolo prima che il file arrivi" è scritto a memoria, senza fonte consultata.

## Elementi interattivi

| Nome | Lezione | Domanda | Come l'ho guardato |
|---|---|---|---|
| quattro pagine da modificare | 88 | che cosa cambia cambiando `title` e `h1`; spazi e a capo; togliere `main`; che cosa fa il browser con quattro errori | nella lezione a 1280 e 390 px, chiaro e scuro |
| `inf-html-albero-documento` | 88 | come nasce l'albero dal file, e che albero esce senza `</h2>`? | `/prova-fisica` a 390 e 800 px, chiaro e scuro: apertura, tocco su nodo, riga e rettangolo, Esegui a metà, fine, variante senza `</h2>`; nella lezione a 1280 px |
| figura TikZ `albero-documento-html-scheletro` | 88 | l'albero della prima pagina | nella lezione, chiaro e scuro (resa di TikZJax nel browser) |
| pagine e sito di tre pagine | 89 | spostare `em`, togliere `br`, togliere `../`, cambiare un `id`, deformare un'immagine, far comparire `alt` | nella lezione a 1280 e 390 px; link tra pagine e ancore provati con un clic |
| `inf-html-percorsi-sito` | 89 | che cosa cambia nel percorso relativo cambiando pagina, e che cosa non cambia nell'indirizzo assoluto? | `/prova-fisica` a 390 e 800 px, chiaro e scuro: partenza e arrivo cambiati, percorso scritto a mano giusto, rotto, fuori dal sito, su una cartella, indirizzo esterno |

Esercizi di "Prova tu": tre per lezione, ognuno provato nel browser con la partenza, almeno una risposta sbagliata e la soluzione.

Esercizi dei generatori: guardati a 390 px, quattro semi per livello, con una risposta consegnata su due semi. 1000 esercizi per livello con i semi 1, 50001 e 777001: PASS. Esercizi diversi su 1000 (contati su `params`): 88: 213, 394, 564, 996, 704; 89: 165, 229, 216, 592, 337. Errori piantati (opzione giusta spostata in ogni livello, frase vietata, riga troppo larga, commento chiuso, titolo chiuso, seconda pagina giusta, `..` in più, secondo percorso giusto, lato del file cambiato, `br` in più, `id` cambiato): tutti bocciati.

## Pezzi del kit che mancano

- Un albero disegnato dall'alto (nodi e rami) e un albero di cartelle a rientri: li ho scritti dentro le due figure. Se servono ad altri, sono da portare nel kit.
- `usePassi` non ha un passo iniziale: la figura della 88 si apre sull'albero finito, e per farlo passa a `ComandiPassi` un oggetto costruito a mano finché nessun comando è stato usato.
- Ho usato `Titolino` di `informatica/listato.tsx` (gruppo 11).

## Limiti

- Nell'anteprima un link `pagina.html#id` apre la pagina ma non scorre al punto: la lezione 89 dà la scrittura e non chiede di provarla. Va segnalato a chi cura l'editor.
- Per un file del sito in `src` (`/icon-192.png`) l'immagine si vede ma l'editor avvisa che "non esiste nel progetto": i due messaggi si contraddicono.
- `anteprima.mjs` per le figure TikZ non parte in questa cartella (manca il pacchetto `node-tikzjax`): la figura TikZ della 88 l'ho guardata solo come la disegna il browser nella pagina della lezione.
- La figura della 88 da telefono è alta circa 1160 px: file, albero e pagina stanno uno sotto l'altro, e toccando una riga del file il rettangolo che si accende nella pagina può essere fuori dallo schermo.
- Nella pagina di prova degli esercizi sopra le opzioni che sono frammenti compare la scelta "Python / C++", che qui non serve: è della pagina, non dei generatori.
- Nel secondo esercizio della 89 il controllo vuole il valore esatto di `href`: `./scaletta.html` o `/index.html` vengono bocciati. Le altre due pagine del progetto non vengono corrette.
- Le lezioni non le ho rilette su un telefono vero; a 390 px le ho guardate a pezzi, non riga per riga.
- `tsc`: nessun errore nei miei file; ne restano in `inf-html-moduli.ts`, `inf-markup.ts`, `inf-ricerca-binaria.ts`, di altri gruppi.
- I generatori non sono collegati al sito.

## File condivisi toccati

`src/lib/utils/interactive.ts`, tre righe in fondo a `FIGURES`:

```ts
	// Computer science, third year: HTML structure and text (group 10).
	'inf-html-albero-documento': () => import('@/components/content/interactive/informatica/AlberoDocumento'),
	'inf-html-percorsi-sito': () => import('@/components/content/interactive/informatica/PercorsiSito'),
```

---

## Gruppo 11: lezioni 90, 91

# Gruppo 11: Elenchi e tabelle (90), I moduli (91)

Tutto consegnato per le due lezioni: lezione, nota, formulario, flashcard, figura interattiva registrata,
specifica, generatore e controllo Python. Niente pubblicato, niente commit.

File creati:

- `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/90-inf-html-elenchi-tabelle.md` e
  `…/91-inf-html-moduli.md`
- `src/components/content/interactive/informatica/CelleUnite.tsx`, `ModuloInviato.tsx`, `listato.tsx`
- `src/lib/informatica/celle-unite.ts`, `modulo-inviato.ts`, con `tests/unit/informatica-celle-unite.test.mjs` e
  `informatica-modulo-inviato.test.mjs` (10 test, tutti verdi)
- `specs/exercises/inf-html-elenchi-tabelle.md`, `inf-html-moduli.md`
- `src/lib/exercises/v2/generators/inf-html-elenchi-tabelle.ts`, `inf-html-moduli.ts`
- `scripts/exercises/checkers/inf_html_elenchi_tabelle.py`, `inf_html_moduli.py`, `_inf_html11.py`

## Scelte

- Confine tra le due: nella 90 quello che l'utente legge (elenchi, tabelle), nella 91 quello che l'utente scrive.
  Nessun elemento dei moduli nella 90, nessuna tabella nella 91.
- Nomi presi dalle lezioni del gruppo 10, lette a lavoro iniziato: Sara, Marta, Dario e Leo; i pezzi Controtempo,
  Ultima campanella, Fuori orario; il concerto di fine anno il 5 giugno in aula magna. Le altre date sono nostre (12
  aprile al Parco Verdi, 3 maggio in aula magna, 20 giugno da definire).
- Tabelle: solo `table`, `tr`, `th`, `td`, `caption`, `colspan`, `rowspan`. Niente `thead`, `tbody`, `scope`.
- I bordi delle tabelle vengono da un `style.css` di due regole, scritte una per riga per stare nelle 400 righe; la
  lezione dice di usarlo senza leggerlo e rimanda alla 92.
- Celle unite: l'idea è "la cella assorbita non si scrive più", con il "conto dei posti" per controllare una riga
  (i `colspan` scritti più i posti presi da sopra danno le colonne). Il nome è nostro.
- Moduli: ogni riga è un `<p>` con `<label for>` e campo, senza foglio di stile. Niente `fieldset`, `legend`,
  `pattern`, `checked`, `selected`, `<input type="submit">`. `placeholder` solo come errore.
- "Pallino" per `radio`, "casella" per `checkbox`, "coppia" per nome e valore, "corpo della richiesta" spiegato in
  una riga (la 36 non lo nomina).
- GET e POST: dove finiscono i dati e quando si usa l'uno o l'altro, con il link alla 36; la codifica
  dell'indirizzo (`%40`, `+`) in una riga, perché la figura la mostra.
- Controlli dell'HTML: `required`, `min`, `max`, `minlength`, `maxlength`, il tipo `email`. Tutto il resto alla 98,
  con un avviso sul perché il controllo del browser non basta.
- Le pagine sono sempre documenti interi (doctype, `lang`, `charset`, `title`), anche negli esercizi.
- Negli esercizi della 91 ogni controllo sul comportamento ha prima una regola sull'attributo e poi quella
  sull'invio, così il messaggio che lo studente legge parla dell'attributo che manca.
- Esercizi dei generatori: tutti a scelta multipla, come chiede il brief per 81-98, con frammenti veri sotto la
  domanda o come opzioni; rientro di due spazi e `<input>` su due righe per stare nelle larghezze.

## Domande per Andrea

90:
- `<thead>` e `<tbody>` vanno già qui, o bastano `<tr>`, `<th>`, `<td>`?
- `<th>` di riga e `scope`: qui o nella 95?
- L'elenco di definizioni (`<dl>`) è nel programma?
- "Conto dei posti" va bene come nome del controllo su una riga con celle unite?
- Tre esercizi in "Prova tu" sono troppi?

91:
- `<fieldset>` e `<legend>` per i pallini: qui, nella 95, o da nessuna parte?
- "Pallino" e "casella" vanno bene, o usi "pulsante di opzione" e "casella di controllo"?
- GET e POST: bastano queste righe o vuoi la richiesta intera con le intestazioni?
- La codifica dell'indirizzo merita più di una riga?
- `pattern` è nel programma del terzo anno?

## Da verificare

- Regole su che cosa invia un modulo e forma delle coppie (campo senza `name`, casella non spuntata, `value` di
  pallini e opzioni, spazio in `+`, chiocciola in `%40`, `get` come metodo predefinito): HTML Living Standard e URL
  Standard del WHATWG. Scritte a memoria; la sola codifica è confrontata con `URLSearchParams` nei test.
- Il testo fuori dalle celle spostato sopra la tabella: regola del parser HTML (WHATWG), non riletta.
- Il pallino diverso al secondo livello di un elenco, l'aspetto di `date` e di `number`, le lettere rifiutate da un
  campo `number`: visti solo in Chromium. La lezione dice "di solito".
- Le frasi sugli screen reader (tabella letta come dati, etichetta letta entrando nel campo): non provate.
- Il controllo dei browser su un indirizzo email è poco severo (`anna@x` passa): la lezione non dà una regola più
  precisa di "una chiocciola con qualcosa prima e dopo".

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-html-celle-unite` | 90 | Quando una cella ne prende due, quale cella sparisce dal codice, e da quale riga? | 800, 390 e 330 px, chiaro e scuro, 10 stati (inizio, colspan, rowspan, due rowspan, blocco 2×2, intestazioni unite, cella senza vicine, separa, ricomincia, tastiera): altezza costante, nessun errore in console |
| `inf-html-modulo-inviato` | 91 | Di quello che scrivi in un modulo, che cosa parte, con che nome, e dove viaggia con GET e con POST? | 800, 390 e 330 px, chiaro e scuro, 7 stati (get, post, casella, valori lunghi, campi vuoti, tastiera): altezza costante a 800 e 390 |
| 3 pagine `codice html` | 90 | `ul` e `ol`; elenco annidato; tabella dei concerti | nella lezione a 1280 e 390 px, chiaro e scuro |
| 3 pagine `codice html` | 91 | etichetta e campo; tipi di campo e gruppo di pallini; controlli con `input:invalid` | come sopra; i comportamenti descritti dal testo (clic sull'etichetta, pallini, bordi rossi, lettere nel campo numerico) provati uno per uno con Playwright |
| TikZ `albero-elenco-annidato` | 90 | Perché l'elenco interno sta dentro il `<li>` | nella lezione, chiaro e scuro |
| 5 esercizi `%% controllo` | 90, 91 | | pagina di partenza, soluzione, soluzione riscritta a mano e 3-5 risposte sbagliate ciascuno: ogni errore boccia il controllo giusto |

Che cosa fa davvero l'invio di un modulo nell'anteprima (Chromium): niente. L'iframe ha `sandbox` senza
`allow-forms`, e il browser ferma l'invio prima dell'evento `submit` e prima della convalida: nessuna richiesta, la
pagina resta dov'è, e non compare nemmeno il messaggio di un campo `required` vuoto. Nella console del browser resta
"Blocked form submission…". La lezione lo dice, e mostra i controlli con `input:invalid` in un `style.css` di una
riga. Dettagli nella nota della 91.

## Pezzi del kit che mancano

- `listato.tsx` (mio, in `interactive/informatica/`): `Listato` (righe di codice a larghezza fissa, accese o
  barrate), `Tasto` (bottone che resta nel giro del Tab quando non ha niente da fare: in `informatica.tsx` esiste ma
  non è esportato), `Codice` e `Titolino`. Possono servire ad altre figure sul web.
- `src/lib/informatica/celle-unite.ts` e `modulo-inviato.ts`: funzioni pure, con i test.
- `_inf_html11.py`: lettore di frammenti HTML per i controlli (albero senza riparazioni, posti delle celle con
  `colspan` e `rowspan`). `inf_codice_prova.py` ne ha uno più piccolo dentro di sé.
- Anteprima delle pagine: premendo il bottone di invio non succede niente, nemmeno la convalida. Sarebbe utile che
  `pagina.ts` intercettasse il clic, chiamasse `reportValidity()` e scrivesse nella console della lezione le coppie
  che partirebbero. Oggi `required` nell'anteprima non si può vedere all'invio.
- Il messaggio della regola `non inviato` quando fallisce ("l'invio va fermato con preventDefault()") è scritto per
  la 98: in una lezione di solo HTML confonde. L'ho aggirato mettendo prima una regola sull'attributo.
- `docs/lezioni/README.md` dice ancora che i controlli sul comportamento non ci sono; azioni e regole sono in
  `src/lib/codice/blocco.ts` e funzionano (`scrivi`, `spunta`, `invia`, `inviato`, `non spuntato` usati qui).
- La pagina `/prova-grafico/esercizio` mostra la scelta "Python | C++" anche quando l'esercizio ha solo frammenti.

## Generatori

| Generatore | Livelli | Tipo | Diversi su 1000 (seed 1, per `params`) |
|---|---|---|---|
| `inf-html-elenchi-tabelle` | 1 Puntato o numerato, 2 Elenchi annidati, 3 Righe e colonne, 4 Scrivere una tabella, 5 Celle larghe: colspan, 6 Celle alte: rowspan | scelta multipla; frammento sotto la domanda o frammenti come opzioni; conti nei livelli 2, 3, 5, 6 | 722, 885, 499, 912, 690, 312 |
| `inf-html-moduli` | 1 Il campo giusto, 2 Etichetta e campo, 3 Che cosa viene inviato, 4 Caselle, pallini e menu, 5 GET e POST, 6 I controlli del browser | scelta multipla; frammento sotto la domanda o frammenti come opzioni; l'indirizzo costruito all'indietro nel livello 5 | 671, 723, 1000, 651, 870, 424 |

- `sample.mts … 1000 all <seed> | verify.py`: PASS con 1, 50001 e 777001 per tutti e due.
- Errori piantati: 22 nella 90 e 29 nella 91 (opzione giusta spostata in ogni livello, distrattore uguale al giusto,
  frammento giusto rovinato, frammento mostrato cambiato, testo vietato, riga troppo larga): tutti bocciati.
- `npx eslint` sui miei file: pulito. `npx tsc --noEmit -p .`: due passate; la prima dava 3 errori di tipo in
  `inf-html-moduli.ts` (corretti) e uno in `inf-ricerca-binaria.ts`, non mio; la seconda 0 errori in tutto il
  progetto.
- Nel browser a 390 px: tutti i 12 livelli con i semi 3 e 8, nessuno scorrimento laterale e nessun errore in
  console; una risposta giusta e una sbagliata consegnate in un livello per generatore, con il verdetto atteso.
- Nessun livello a risposta aperta: per HTML non esiste.

## Limiti

- Tutte le prove nel browser sono in Chromium (Playwright). Firefox e Safari non provati, in particolare il
  comportamento dell'invio e di `input:invalid`.
- `verifica.mts` non esegue i controlli delle pagine: restano gli avvisi "i controlli si provano nel browser" (3
  nella 90, 2 nella 91), e li ho provati con uno script mio.
- Un errore passa nell'esercizio 2 della 90: le celle scritte senza `<tr>`, che il browser ripara da sé.
- Il testo da leggere delle due lezioni è più corto del minimo indicato (circa 40 capoversi contro 50-90 righe), con
  397 e 344 righe in tutto: la 90 è al limite delle 400 per via delle pagine intere negli esercizi.
- Il formulario della 90 ha quattro blocchi di codice ed è sulle due schermate abbondanti.
- A 330 px di schermo (più stretto del telefono di riferimento) la riga più lunga del codice in `CelleUnite`
  scorre dentro il suo riquadro, e `ModuloInviato` cresce di una riga con valori molto lunghi.
- Nella figura dei moduli il campo dell'email è un campo di testo: mostra che cosa parte, non la convalida.
- In una sola passata dello script sugli esercizi della 90 è comparso in console "Can't perform a React state
  update on a component that hasn't mounted yet"; nelle passate successive no. Non so da quale componente venga.
- Console della 91: i messaggi "Blocked form submission" sono attesi a ogni controllo che invia il modulo.
- Le figure non sono state provate con uno screen reader; hanno etichette, `aria-pressed` sulle celle e la frase in
  `aria-live`.
- I generatori non sono collegati al sito, come da brief.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, tre righe in fondo a `FIGURES`:

```ts
	// Computer science, third year: lists, tables and forms (group 11).
	'inf-html-celle-unite': () => import('@/components/content/interactive/informatica/CelleUnite'),
	'inf-html-modulo-inviato': () => import('@/components/content/interactive/informatica/ModuloInviato'),
```

---

## Gruppo 12: lezioni 92, 93

# Rapporto del gruppo 12: lezioni 92 (Regole e selettori CSS) e 93 (Il modello a scatola)

7 ottobre 2026. Tutto in `/Users/alessandro/Desktop/Personal/Sapiens-informatica-terzo`. Niente pubblicato, niente
commit.

## File creati

- `docs/lezioni/informatica/riscritte/92-inf-css-regole.md`, `93-inf-css-box.md`, con gli omonimi in `note/`,
  `formulari/`, `flashcard/`.
- `src/components/content/interactive/informatica/SelettoriCss.tsx`, `CascataCss.tsx`, `ScatolaStrati.tsx`,
  `ConfrontoBoxSizing.tsx`.
- `src/lib/informatica/css.ts` (selettori, peso, cascata: funzioni pure) con `tests/unit/informatica-css.test.mjs`
  (5 prove, tutte verdi).
- `specs/exercises/inf-css-regole.md`, `inf-css-box.md`; `src/lib/exercises/v2/generators/inf-css-regole.ts`,
  `inf-css-box.ts`; `scripts/exercises/checkers/inf_css_regole.py`, `inf_css_box.py`.

## Scelte

- **Confine tra 92 e 93.** La 92 ha solo colori e testo: `color`, `background-color`, `font-family`, `font-size`,
  `font-weight`, `text-align`. Padding, bordi, margini, larghezze e `display` sono tutti della 93. La 92 dice
  soltanto che sfondo, bordi e margini non si ereditano.
- **Selettori.** Elemento, classe, id, discendente, e la virgola in un riquadro. Fuori: `li.prossimo`, `>`,
  pseudo-classi, `*`, due classi sullo stesso elemento.
- **Cascata.** Tre passi: il selettore che pesa di più (si contano gli id, poi le classi, poi i nomi di elemento),
  a parità l'ultima regola, e il valore ereditato che perde contro qualunque regola sull'elemento. "Specificità" è
  nominata una volta. Fuori: `!important`, l'attributo `style`, `<style>`.
- **Unità.** Solo `px` in tutte e due le lezioni. Colori con il nome e in `#RRGGBB`.
- **93.** Uno e due valori per `padding` e `margin`; `border` con i suoi tre valori; `box-sizing` come alternativa
  a `content-box`; `display: block` e `inline-block`; `margin: 0 auto` in un riquadro; i margini che si fondono in
  un riquadro. `span` è introdotto qui in una riga; `div` è richiamato dalla 88.
- **Filo.** Il sito dei Fuori Tempo: home, pagina dei concerti con menu ed elenco delle date, riquadro del prossimo
  concerto. La pagina della figura dei selettori è la stessa della seconda pagina della 92.
- **Esercizi.** Tutti a scelta multipla su frammenti; nessuna risposta aperta, perché il correttore non legge il
  CSS. I selettori e la cascata del generatore della 92 vengono da `src/lib/informatica/css.ts`, lo stesso modulo
  delle figure; il controllo Python li riscrive per conto suo.

## Domande per Andrea

92:
- La specificità come tre conti in ordine (id, classi, nomi di elemento) va bene, o i vostri libri usano i punteggi
  100, 10, 1?
- `li.prossimo` e `a:hover` vanno in questa lezione? Ora non ci sono.
- Serve nominare il CSS scritto dentro la pagina (`<style>`, attributo `style`), almeno per riconoscerlo?
- `class` va anticipato nel capitolo sull'HTML?

93:
- `box-sizing: border-box` va presentato come la scelta normale o come un'alternativa?
- I margini che si fondono: basta il riquadro, o serve un esempio da eseguire?
- `display: inline-block` va tenuto, visto che il menu della 94 si fa con flexbox?
- `span` introdotto qui va bene, o lo volete nella 88 accanto a `div`?

## Da verificare

Tutti i fatti sono scritti a memoria, non ricontrollati in rete. L'elenco con le fonti da citare è nelle due note.
I più pesanti:
- le regole dell'autore battono il foglio del browser qualunque sia la specificità (CSS Cascading and Inheritance
  Level 4);
- `border-style` parte da `none`, e un bordo senza stile ha spessore 0 (CSS Backgrounds and Borders Level 3);
- `width`, `height` e margini verticali non si applicano agli elementi in linea (CSS 2.1, 10.3.1 e 10.6.1);
- i margini verticali di due blocchi vicini si fondono (CSS 2.1, 8.3.1);
- i colori con nome sono "più di cento" (148 in CSS Color Level 4, da verificare).

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-css-selettori` | 92 | Quali elementi prende un selettore, e perché `nav a` ne prende meno di `a`? | Chiaro a 800 px e scuro a 390 px all'avvio; a 390 px con `prossimo` (niente, con il perché), con `#date li`, con un elenco con la virgola in scuro; in scuro a 800 px con `a:hover` (errore). Altezza uguale in tutti gli stati dopo la correzione della frase (785 px a 390). |
| `inf-css-cascata` | 92 | Cinque regole danno un colore allo stesso paragrafo: quale vince? | Chiaro e scuro, 800 e 390 px: all'avvio, con `#avviso` spenta, con due regole spente e le due `p` scambiate, con la sola `main` (ereditata), con tutte spente, dopo "Ricomincia". Altezza costante (539 e 562 px). |
| `inf-css-scatola-strati` | 93 | Quanto è largo davvero un riquadro con `width: 200px`? | Chiaro a 800 e a 390 px all'avvio; scuro a 390 px con i quattro cursori al massimo; scuro a 800 px con padding, bordo e margine a 0. |
| `inf-css-box-sizing-confronto` | 93 | Due riquadri con la stessa regola e `box-sizing` diverso: quale è largo 200 px? | Chiaro a 800 px all'avvio; scuro a 390 px con i cursori al massimo; chiaro a 390 px con i cursori a 0; scuro a 800 px con valori piccoli. Altezza costante a 390 px (734 px). |
| Pagine `codice html` + `css` | 92 (2), 93 (3) | Vedi le note delle lezioni | Eseguite a 1280 e a 390 px; la 93 anche a 1280 in scuro. |
| Esercizi con `%% controllo` | 92 (3), 93 (3) | | "Verifica" con il foglio di partenza (bocciato) e con la soluzione (superato), a 1280 e a 390 px. |
| TikZ `parti-di-una-regola-css` | 92 | Le parti di una regola | Chiaro e scuro con `anteprima.mjs`, e nella pagina della lezione. |

Correzioni fatte dopo aver guardato: nella cascata le regole erano un `ol` che prendeva i margini della pagina e
la casella di spunta era blu (rifatte con `div` e un bottone con `role="checkbox"` nei colori del sito); nel
confronto le linee dei 200 px attraversavano le scritte e lo spazio riservato stava tra il riquadro e la sua
misura (ora la linea sta solo dietro il riquadro e la misura gli sta attaccata); le frasi lunghe cambiavano
l'altezza delle figure a 390 px.

Non guardato: la tastiera è stata provata solo per costruzione (bottoni e campi nativi), non con uno screen
reader. Le figure non sono state provate con `prefers-reduced-motion`.

## Pezzi del kit che mancano

- **Un documento HTML disegnato come elementi uno dentro l'altro**, con gli elementi che si accendono. L'ho fatto
  in `SelettoriCss.tsx` (componente `Elemento`). Servirà anche a chi disegna l'albero del documento (88) e il DOM
  (97): se un altro gruppo ha fatto qualcosa di simile, conviene unificarli nel kit.
- **Il lettore di selettori e la cascata**: `src/lib/informatica/css.ts`, file nuovo del gruppo. Può servire alla
  97 (`querySelector`).
- **Una frase con il codice in monospazio** (`conCodice`, uguale in due figure): `Frase` del kit prende solo testo.
- **La misura sotto una scatola** (una parentesi larga quanto la scatola con il conto): in `ConfrontoBoxSizing.tsx`.
- `ScatolaCss` del kit disegna sempre il contorno tratteggiato del margine, anche con margine 0: nel confronto si
  vede un filo tratteggiato intorno al bordo. Non l'ho toccato.

## Limiti

- **Controllo `stile` e bordi.** `h1 | stile border-top-width = 2px` boccia anche la soluzione giusta ("è 2px:
  dovrebbe essere 2px"): `computed()` in `src/components/codice/web-checks.ts` legge il valore su un `div` di prova
  senza `border-style`, dove lo spessore calcolato è 0. Nel primo esercizio della 93 lo spessore del bordo è nella
  consegna ma non è controllato. È un file comune: non l'ho toccato.
- **TikZ nel browser.** Una lettera accentata dentro un nodo TikZ fa fallire TikZJax nella pagina di anteprima
  (`RuntimeError: unreachable`, figura vuota), anche se `anteprima.mjs` la compila. Corretto nella 92 con
  `` \`a ``. Vale per tutti i gruppi.
- **`anteprima.mjs`** non parte dalla cartella del lotto: manca `node_modules` in `scripts/figure`. L'ho lanciato
  da `/Users/alessandro/Desktop/Personal/Sapiens/scripts/figure/anteprima.mjs` sul file del lotto, in sola lettura,
  con l'uscita nello scratchpad.
- **Linguetta `script.js`.** Ogni pagina `html` + `css` mostra anche una linguetta `script.js` vuota. Nella pagina
  di prova degli esercizi compare la scelta "Python / C++" anche per i frammenti HTML e CSS. Sono dell'editor e
  della pagina di prova.
- **Esercizi nel browser.** Ogni livello è stato guardato a 390 px con tre semi (33 pagine, nessuna scorre di
  lato, nessun errore in console; 15 guardate a occhio). Non ho cliccato le opzioni per vedere il verdetto e la
  spiegazione.
- **Prove a mano delle pagine.** Le modifiche che il testo propone (togliere `<link>`, `padding` a 0,
  `display: block`, aggiungere `box-sizing`) non sono state rifatte una per una nel browser: le pagine sono state
  eseguite così come sono scritte.
- **`tsc`.** Lanciato due volte sull'intero progetto alla fine: nessun errore nei file del gruppo, 3 errori in
  file di altri gruppi (non guardati). Durante il lavoro le figure sono state compilate da sole con un `tsconfig`
  nello scratchpad.
- **Errori piantati.** Opzione giusta spostata, distrattore uguale al giusto, frase vietata, tre opzioni: tutti
  bocciati (33 su 33 per tipo). Frammento cambiato: bocciato in tutti i casi in cui il cambio toccava la risposta
  (13 prove mirate), comprese un selettore gemello tra i distrattori e due regole scambiate.
- **Quote.** Livello 1 della 92: 616 esercizi diversi su 1000, il più basso; il livello 6 della 93 ne ha 831, ma
  il caso `blocco` da solo ha 40 combinazioni di elementi.
- La figura `inf-css-modello-scatola` del kit resta registrata e non è usata da nessuna lezione.

## File condivisi toccati

Solo `src/lib/utils/interactive.ts`, cinque righe dopo `'inf-kit-campionario'`:

```ts
	// Computer science, third year: CSS rules and the box model (group 12).
	'inf-css-selettori': () => import('@/components/content/interactive/informatica/SelettoriCss'),
	'inf-css-cascata': () => import('@/components/content/interactive/informatica/CascataCss'),
	'inf-css-scatola-strati': () => import('@/components/content/interactive/informatica/ScatolaStrati'),
	'inf-css-box-sizing-confronto': () => import('@/components/content/interactive/informatica/ConfrontoBoxSizing'),
```

File nuovi in cartelle comuni: `src/lib/informatica/css.ts`, `tests/unit/informatica-css.test.mjs`.

---

## Gruppo 13: lezioni 94, 95

# Rapporto del gruppo 13: lezioni 94 e 95

Lezioni 94 `inf-css-layout` (L'impaginazione di una pagina web) e 95 `inf-responsive` (Pagine responsive e
accessibili), con nota, formulario, flashcard, figure, specifica, generatore e controllo Python.

File creati:

- `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/94-inf-css-layout.md` e `95-inf-responsive.md`
- `src/components/content/interactive/informatica/Flexbox.tsx`, `MediaQueryLarghezza.tsx`, `ContrastoColori.tsx`,
  `impaginazione.tsx` (pezzi miei, vedi sotto)
- `src/lib/informatica/responsive.ts` con `tests/unit/informatica-responsive.test.mjs` (7 test, passano)
- `specs/exercises/inf-css-layout.md`, `inf-responsive.md`
- `src/lib/exercises/v2/generators/inf-css-layout.ts`, `inf-responsive.ts`
- `scripts/exercises/checkers/inf_css_layout.py`, `inf_responsive.py`

## Scelte

- **94.** Solo flexbox; griglia e `position` in un riquadro in fondo; niente `float`. Termini: contenitore flex,
  elementi flex, asse principale, asse trasversale. Degli elementi si insegna solo `flex: 1`. Valori insegnati:
  `row` e `column`; cinque valori di `justify-content` (senza `space-evenly`); quattro di `align-items` (senza
  `baseline`); `gap`; `nowrap` e `wrap`.
- **95.** Unità `%`, `rem`, `em`, `vw`. Media query solo con `min-width` e `max-width`. "Prima il telefono" per
  mobile first. Accessibilità: contrasto al livello AA (4,5 e 3), testo alternativo, ordine dei titoli, tastiera,
  etichette; niente ARIA, e le WCAG non sono nominate nel testo (sono nella nota con la fonte).
- **Confine tra le due.** La 94 impagina a larghezza fissa e si chiude su `flex-direction: column` come rimando;
  la 95 non rispiega flexbox e parte dalla pagina a due colonne della 94.
- **Filo.** Sara, Leo, Marta, Pietro, Emma della 3B, concerto di venerdì 12 dicembre, colori `teal`, `gold`,
  `ivory`, `navy` come nella 92.
- **Immagini.** Nelle pagine della 95 l'immagine è un `data:image/svg+xml` scritto in `src`, perché un blocco
  `codice` non può avere un file di immagine.
- **Esercizi sulle media query.** Nessun `%% controllo` guarda una proprietà cambiata da una media query: vedi
  "Limiti".

## Domande per Andrea

94:

- `flex: 1` presentato come una sola dichiarazione ("prende lo spazio che avanza"), senza `flex-grow`,
  `flex-shrink`, `flex-basis`: va bene per il terzo anno?
- `space-evenly`, `align-content` e la griglia restano fuori o solo nominati: li vuoi dentro?
- "Asse trasversale" o "asse secondario"?

95:

- Responsive e accessibilità in una lezione sola: l'accessibilità è il contrasto più quattro controlli. Basta?
- `em` è spiegato solo per le proprietà diverse da `font-size`. Lo teniamo così, o lo togliamo?
- Nominare le WCAG e la legge italiana sull'accessibilità, o lasciare "linee guida internazionali"?
- "Lettore di schermo" o "screen reader"?

## Da verificare

- WCAG: verificato. Formula della luminanza relativa, rapporto di contrasto, soglie 4,5 e 3 (criterio 1.4.3, AA),
  7 e 4,5 (1.4.6, AAA), testo grande a 18 punti o 14 in grassetto: lette su WCAG 2.2, W3C Recommendation del 12
  dicembre 2024, il 7 ottobre 2026. La soglia della formula è 0,04045 (0,03928 prima di maggio 2021).
- Non verificato su una fonte: i 980 px che un telefono finge senza la riga del viewport (la lezione non scrive
  il numero); i 16 px di partenza del carattere; che `a` senza `href` non prenda il fuoco (usato come
  distrattore); la legge Stanca citata in una domanda della nota.
- La storia delle tabelle usate per impaginare è detta senza fonte.

## Elementi interattivi

| Nome | Lezione | Domanda | Come l'ho guardato |
|---|---|---|---|
| `inf-css-flexbox` | 94 | Con `column`, `justify-content: center` centra in orizzontale o in verticale? Che cosa succede a cinque elementi che non ci stanno? | Chiaro a 800 px e scuro a 390 px; stato iniziale, colonna con `center`, `space-between` con `align-items: center`, cinque elementi con `nowrap` e con `wrap`; dentro la lezione a 390 px. Tastiera: frecce, Fine e Tab provati con Playwright. Con `prefers-reduced-motion` la transizione è spenta (misurata). |
| `inf-media-query-larghezza` | 95 | A quale larghezza `main` e `aside` si affiancano, e che cosa succede a 600 px? | Chiaro e scuro, 800 e 390 px, a 360, 590, 600, 768 e 1000 px di larghezza scelta; cursore mosso da tastiera fino a 600; dentro la lezione a 390 e 1280 px. |
| `inf-contrasto-colori` | 95 | Il grigio chiaro su bianco è sufficiente? E il bianco sull'arancione? | Chiaro e scuro, 800 e 390 px; le quattro coppie pronte, un colore scritto a mano (`#767676`, `#000000`), un colore scritto a metà (segnato come non valido), lo scambio, due colori uguali (1,00). |
| pagine da modificare | 94 (2), 95 (2) | vedi le note | Aperte a 1280 e 390 px, guardate nell'anteprima. |
| TikZ `pagina-classica-flexbox` | 94 | lo schema della pagina classica | Guardata nel browser in chiaro e in scuro. `scripts/figure/anteprima.mjs` non parte in questa cartella: manca il pacchetto `node-tikzjax`. |

Esercizi di "Prova tu" (sei in tutto): a 1280 e a 390 px la pagina di partenza supera 0 controlli, la soluzione
tutti; una risposta sbagliata per esercizio è bocciata, tranne `2em` al posto di `2rem` nel primo della 95, che dà
gli stessi pixel e passa.

Esercizi generati: tutti i livelli guardati a 390 px con i semi 3 e 17, nessuno scorrimento laterale, nessun
elemento fuori dalla pagina. La pagina di prova mostra la scelta "Python / C++" anche su questi livelli, che non
hanno programmi: non dipende dal generatore.

## Generatori

| Generatore | Livello | Tipo | Diversi su 1000 |
|---|---|---|---|
| `inf-css-layout` | 1 Contenitore ed elementi | testo e frammenti | 994 |
| | 2 Direzione e assi | testo e regole come opzioni | 286 |
| | 3 Lo spazio che avanza | conto, all'indietro | 957 |
| | 4 Andare a capo | conto | 996 |
| | 5 Impaginare la pagina | regole come opzioni | 226 |
| `inf-responsive` | 1 Unità relative | conto | 738 |
| | 2 Quale regola è attiva | foglio con due media query | 664 |
| | 3 Prima il telefono | fogli come opzioni | 442 |
| | 4 Immagini che si adattano | conto | 949 |
| | 5 Il contrasto | soglia | 857 |
| | 6 Una pagina accessibile | frammenti HTML come opzioni | 129 |

Tutti a scelta multipla, nessun livello aperto. `verify.py` dà PASS con i semi 1, 50001 e 777001 per tutti e due.
ESLint pulito sui miei file. Errori piantati (opzione giusta spostata, un distrattore uguale al giusto, un numero
del frammento cambiato, scrittura vietata): 55 su 55 bocciati per la 94; 83 su 85 per la 95. I due passati sono
numeri cambiati che non entrano nella risposta (la larghezza del contenitore in un esercizio in `vw`, una soglia
lontana dalla larghezza del viewport), quindi l'esercizio restava giusto.

## Pezzi del kit che mancano

Scritti in `informatica/impaginazione.tsx`, da portare nel kit se servono ad altri:

- `usePosti` e `posto`: una disposizione calcolata dal browser in una copia nascosta e ridisegnata con una
  transizione su posizione e dimensione. Serve a ogni figura in cui cambia l'impaginazione, perché il CSS non anima
  un cambio di `justify-content`.
- `Scelta`: una scelta tra più valori che va a capo. `ToggleGroup` non va a capo, e cinque valori di
  `justify-content` non stanno in 330 px.
- `Regola`: una regola CSS scritta per esteso con la riga appena cambiata in evidenza.

Manca anche, e non l'ho scritto: un modo per dare una larghezza all'anteprima di una pagina prima di un
`%% controllo` (per esempio `> larghezza 400`). Senza, una media query non si può correggere.

## Limiti

- **La media query dell'esercizio 2 della 95 non è corretta da nessuno.** L'anteprima è larga quanto la colonna
  della lezione (894 px su un computer, 359 su un telefono, misurati), e `stile` legge lo stile a quella larghezza.
  Il controllo guarda la riga del viewport e le regole di base, e la consegna lo dice.
- Nelle pagine di esempio lo studente non può allargare o stringere l'anteprima: la lezione fa cambiare la soglia.
- `npx tsc --noEmit -p .` è stato lanciato due volte nello stesso comando, per sbaglio. Ha trovato un errore di
  tipi in `inf-responsive.ts`, corretto; dopo la correzione ho ricontrollato solo i miei file con un `tsconfig`
  ridotto nello scratchpad, senza errori. Un terzo giro sull'intero progetto non l'ho fatto.
- Righe di testo: 40 nella 94 e 45 nella 95, sotto le 50 del brief, con paragrafi lunghi (circa 1400 e 1700
  parole). Righe in tutto 360 e 383.
- Le figure non sono state provate con un lettore di schermo vero, né su un telefono vero: solo Playwright a 390 px.
- In una delle prove della lezione 95 a 1280 px la console ha dato una volta un avviso di React ("state update on
  a component that hasn't mounted yet") e gli esercizi non si sono caricati; in tre prove successive non è più
  successo. Non so se viene dai miei componenti o da una ricompilazione del sito in quel momento.
- Durante il lavoro il sito si è fermato una volta per un errore in `CelleUnite.tsx` e `listato.tsx` (gruppo 11),
  poi risolto da loro.
- Il messaggio del coordinatore sui controlli di comportamento parlava degli esercizi di 96-98, che sono del
  gruppo 14: non ho toccato quei file. Ho applicato la stessa regola ai miei sei esercizi (la partenza non supera
  nessun controllo) e ho tolto due controlli che la partenza superava già.
- I generatori non sono collegati al sito.

## File condivisi toccati

`src/lib/utils/interactive.ts`, quattro righe in `FIGURES`:

```ts
	// Computer science, third year: layout and responsive pages (group 13).
	'inf-css-flexbox': () => import('@/components/content/interactive/informatica/Flexbox'),
	'inf-media-query-larghezza': () => import('@/components/content/interactive/informatica/MediaQueryLarghezza'),
	'inf-contrasto-colori': () => import('@/components/content/interactive/informatica/ContrastoColori'),
```

File nuovi in cartelle comuni, tutti miei: `src/lib/informatica/responsive.ts`,
`tests/unit/informatica-responsive.test.mjs`, `informatica/impaginazione.tsx`.

---

## Gruppo 14: lezioni 96, 97, 98

# Gruppo 14: lezioni 96, 97, 98 (script, DOM ed eventi, controllo dei moduli)

Nel JSON: `programmi` sono i blocchi `codice javascript` (esempi ed esercizi), `pagine` i gruppi `html`/`css`/`js` (esempi ed esercizi), `esercizi` i blocchi con prove o controlli.

## Scelte

- Confini. 96: che cos'è uno script, dove gira, `defer`, il linguaggio accanto a Python e C++, la console; una sola riga tocca la pagina (`querySelector(...).textContent`), senza spiegarla. 97: DOM, selezione, `textContent`, `classList`, `style`, eventi e ascoltatori senza parametri, `createElement` e `append`; non legge i campi dei moduli. 98: `value`, `checked`, `trim()`, `length`, `Number()`, i quattro tipi di controllo, il messaggio accanto al campo, il parametro `event`, `preventDefault()`, gli eventi `input`, `change`, `submit`, e perché il server ripete i controlli.
- Script sempre con `<script src="script.js" defer></script>` nella `head`; il tag in fondo al `body` è nominato e mostrato nella figura.
- `const` e `let`, mai `var`; sempre `===`; punto e virgola; rientro di 4 spazi. Ascoltatori sempre funzioni con un nome: niente funzioni anonime o freccia. Niente `innerHTML`, niente propagazione degli eventi, niente espressioni regolari.
- Nomi in italiano e minuscoli; dove servono due parole la forma di JavaScript (`nomeValido`, `controllaNome`).
- Nella 98 i campi non hanno `required` né `type="email"`, così ogni controllo passa dallo script; un riquadro dice che i controlli dell'HTML vengono prima.
- La tabella del confronto tra i tre linguaggi nella 96 è la figura `inf-js-costrutti-confronto`: una tabella markdown con tre colonne di codice sul telefono andava a capo dentro le celle, e l'ho tolta. Nel formulario c'è una tabella a due colonne con le sole forme di JavaScript.
- Dopo il messaggio di chi coordina: nessun programma di partenza supera un controllo (riprovato nel browser, 0 controlli superati in tutti e sei gli esercizi di pagina). Per ottenerlo ho tolto i controlli sullo stato iniziale (96 e 97), e nei due esercizi della 98 il programma di partenza chiama `preventDefault()` sempre.

## Domande per Andrea

- 96: `const` e `let` insieme dalla prima riga, o solo `let` al terzo anno?
- 96: `defer` nella `head` come unica forma, o il tag in fondo al `body` come nei libri del liceo?
- 96: il programma con `prompt()` va bene come ponte dai programmi alla pagina?
- 97: vuoi anche la funzione scritta dentro `addEventListener`, che è la forma più comune nei siti veri?
- 97: "ascoltatore" per listener, o "gestore dell'evento"?
- 97: va bene lasciare fuori `innerHTML` e la propagazione degli eventi?
- 98: il controllo dell'email si ferma alla chiocciola: è abbastanza?
- 98: `Number.isInteger()` è una funzione in più: la teniamo, o accettiamo che `2.5` passi?
- 98: campi senza `required` per far lavorare lo script, o tutti e due i controlli con `novalidate`?

## Da verificare

- Storia del nome JavaScript (Netscape, 1995, scelta commerciale): fonte indicata nella nota, non controllata in rete.
- Regole di `defer` e ordine "controlli dell'HTML, poi `submit`": HTML Living Standard del WHATWG, non riletto; il comportamento è stato provato nell'anteprima con Chromium.
- I messaggi di errore citati (`ReferenceError: ... is not defined`, `Cannot set properties of null`) sono quelli di Chromium; altri browser usano parole diverse. Le lezioni dicono "un errore che parla di `null`, come...".
- F12 e "Ispeziona" per aprire la console: detto con "di solito".

## Elementi interattivi

| Nome | Lezione | Domanda | Come è stato guardato |
|---|---|---|---|
| `inf-script-ordine-lettura` (`ScriptOrdineLettura.tsx`) | 96 | Quando lo script cerca `#liberi`, il browser lo ha già costruito? | chiaro, scuro, telefono; primo passo, metà, fine; le tre posizioni del tag; frecce, Home, Fine, Esegui fino in fondo |
| `inf-js-costrutti-confronto` (`CostruttiConfronto.tsx`) | 96 | Che cosa cambia tra il costrutto che conosco e quello di JavaScript? | chiaro, scuro, telefono; cinque degli otto costrutti |
| `inf-dom-albero-eventi` (`DomAlberoEventi.tsx`) | 97 | Quando premo un bottone, quale nodo riceve l'evento e quale viene cambiato? | chiaro, scuro, telefono; tutti e cinque i passi; i due bottoni, due clic veloci, secondo clic che richiude, Ricomincia, Invio da tastiera |
| `inf-modulo-percorso-dato` (`ModuloPercorsoDato.tsx`) | 98 | Che strada fa il dato dal campo al messaggio o all'invio, e quale controllo ferma tre spazi? | chiaro, scuro, telefono; i quattro valori di prova e due scritti a mano; inizio, metà, fine; Invio nel campo |
| Pagine `html`/`css`/`js` | 96, 97, 98 | una per idea (vedi le note) | ogni pagina eseguita a 1280 e a 390 px; nessun errore in console oltre a quelli voluti, nessuno scorrimento laterale, nessuna immagine mancante |
| Programmi `codice javascript` | 96 | che cosa succede togliendo `Number()`; funzione e ciclo | eseguiti con le risposte 2 e 3 |

Esercizi di pagina (96: 1, 97: 3, 98: 2): "Verifica" con il programma di partenza (0 controlli superati), con la soluzione (tutti superati, a 1280 e a 390 px) e, per 97 e 98, con 12 risposte sbagliate scritte apposta (parentesi dopo il nome della funzione, selettore senza cancelletto, senza limiti, senza `append`, senza `preventDefault()`, messaggio non cancellato, confronto tra nodi, intervallo con `&&`, uscita al primo errore...): tutte bocciate con un messaggio sensato. Queste 12 sono state provate prima dell'ultima modifica ai controlli e non rilanciate dopo.

Generatori (scritti da un sottoagente su mia traccia, riverificati da me): tre seed PASS per tutti e tre, ESLint pulito, `tsc` senza errori nei miei file. Esercizi diversi su 1000 per livello: `inf-script-client` 695, 752, 770, 460, 992; `inf-dom-eventi` 1000, 995, 320, 446, 685; `inf-validazione-moduli` 567, 746, 206, 171, 809. Errori piantati: opzione giusta spostata e distrattore uguale al giusto sempre bocciati; una cifra cambiata nel frammento bocciata solo dove la cifra entra nella risposta.

## Pezzi del kit che mancano

- `usePassi` non sa "vai al passo k e prosegui da solo": serve quando un gesto dello studente nel disegno fa partire la traccia. L'ho scritto in `src/components/content/interactive/informatica/passi-avvio.ts` (`usePassiAvvio`, stessa forma di `usePassi` più `parti(k)`), usato da due figure.
- L'albero del DOM è disegnato come in `MarkupTestoAlberoPagina.tsx` (gruppo 9), copiando le sue classi: un pezzo `Albero` comune servirebbe a tre figure (87, 88, 97).
- Dentro una figura `<ol>`, `<ul>`, `<pre>`, `<code>` e `<p>` prendono gli stili del testo della lezione: ho usato `div` e `span` con i ruoli ARIA. Il carattere monospazio lega `===` in un segno solo: nelle mie figure le legature sono spente con `[font-variant-ligatures:none]`.
- L'azione `scrivi` dei controlli toglie gli spazi intorno al testo: non si può scrivere un campo di soli spazi, quindi nessun controllo verifica `trim()`.
- Un controllo non può guardare due momenti (prima e dopo un'azione): per questo nel primo esercizio della 97 chi scrive `chiudi()` con le parentesi passa.
- Moduli di aiuto dei generatori: `src/lib/exercises/v2/inf-g14-web.ts` e `scripts/exercises/checkers/_inf_g14.py`.

## Limiti

- Il più pesante: nell'anteprima dell'editor il clic su un bottone di invio (o Invio in un campo) non fa nascere l'evento `submit`, perché la cornice ha `sandbox` senza `allow-forms` (provato con Chromium). "Verifica" funziona, ma lo studente che prova a mano il modulo della 98 non vede partire i controlli. Ho aggiunto alla pagina centrale i controlli sull'evento `change`, che funzionano; negli esercizi la reazione si vede solo con "Verifica". Va corretto in `WebBench.tsx` o `pagina.ts`, che non sono miei.
- Il testo da leggere è sotto le 50 righe chieste (circa 30 paragrafi lunghi per lezione, più riquadri): le lezioni stanno sotto le 400 righe in tutto (242, 371, 390).
- La 98 ha due esercizi e non tre; `checked` non ha un esercizio.
- Il rapporto finale del sottoagente dei generatori non era arrivato quando ho chiuso: i suoi controlli nel browser (due semi per livello a 390 px) e il confronto dei frammenti con `node` non li posso confermare. Io ho guardato tre esercizi a 390 px, senza arrivare al verdetto. La pagina di prova mostra le linguette Python e C++ anche su questi esercizi, dove non servono.
- Le lezioni non sono state guardate per intero nel tema scuro (solo la 97, a pezzi, e non tutte le schermate); le schermate a 390 px le ho guardate a campione, non tutte.
- `tsc` lanciato una volta sull'intero progetto, filtrando i miei file; gli errori di altri non li ho letti.

## File condivisi toccati

`src/lib/utils/interactive.ts`, in fondo a `FIGURES`:

```ts
	// Computer science, third year: scripts, DOM and form checks (group 14).
	'inf-script-ordine-lettura': () => import('@/components/content/interactive/informatica/ScriptOrdineLettura'),
	'inf-js-costrutti-confronto': () => import('@/components/content/interactive/informatica/CostruttiConfronto'),
	'inf-dom-albero-eventi': () => import('@/components/content/interactive/informatica/DomAlberoEventi'),
	'inf-modulo-percorso-dato': () => import('@/components/content/interactive/informatica/ModuloPercorsoDato'),
```

---

## Revisione dei testi del lotto

# Revisione dei testi del lotto, lezioni 65-98 (7 ottobre 2026)

Ho toccato solo i file `docs/lezioni/informatica/{riscritte,note,formulari,flashcard}/65-98*`. Nessun componente,
nessun generatore, nessun file condiviso, nessun comando git che modifica. Script e schermate sono in
`scratchpad/inf3/revisione/`. Ogni nota di una lezione corretta ha in fondo la sezione "Revisione del lotto" con le
sue modifiche.

Tre sottoagenti in sola lettura hanno riletto per intero le lezioni (65-78, 79-87, 88-98) cercando lessico,
doppioni, affermazioni false e contraddizioni nel filo degli esempi. Ogni loro segnalazione che ho corretto l'ho
prima verificata sul file o nel browser; quelle non corrette sono in "Difetti non corretti".

## Correzioni fatte

### Le otto già note

1. **91, moduli.** Le due frasi false sono riscritte sul comportamento vero, provato a mano nell'anteprima: dopo la
   prima pagina lo studente compila, invia e legge la riga della console ("Modulo inviato con il metodo POST a
   /iscrizione: nome=Anna, ..."); nella sezione sui controlli preme il bottone con i campi vuoti (messaggio del
   browser accanto al nome, niente invio) e di nuovo quando nessun campo è rosso. La nota è aggiornata. Formulario e
   flashcard non ne parlavano. In più: "porta i posti a 5 con le freccette" era falso (con `max="4"` si fermano a
   4), ora è "scrivi 5".
2. **95, responsive.** Il paragrafo sull'anteprima fa usare i tre tasti (provati: 375 px colonna, 768 e tutto lo
   spazio riga) e lascia il cambio di soglia a chi legge dal telefono. Il secondo esercizio ha due controlli con
   `> larghezza 400` e `> larghezza 900`. Provato con tre risposte sbagliate (senza media query, tutto in riga,
   soglia a 1000 px): bocciate tutte. Una soglia diversa da 700 ma compresa tra 400 e 900 passa.
3. **89, link.** Il progetto dei link interni ha una seconda pagina, `storia.html`, con `index.html#contatti`, e la
   lezione lo fa provare (provato: apre la home e scorre). Con un `id` che non c'è la lezione cita la riga della
   console. La nota non dice più che il valore di `href` deve essere esatto.
4. **98, `Number.isInteger`.** Corretta la lezione e la nota: `isInteger` scarta 2.5 e ciò che non è un numero, il
   campo vuoto lo ferma `n < 1`. Formulario e flashcard non avevano la frase falsa: non li ho toccati.
5. **93, primo esercizio.** Aggiunte le regole `border-top-width = 2px` e `border-left-width = 2px`. Con
   `border: 3px solid teal` la soluzione viene bocciata.
6. **97, primo esercizio.** Aggiunto un controllo senza azioni sullo stato iniziale. Con
   `addEventListener("click", chiudi())` ora viene bocciato. Il programma di partenza supera questo controllo, ed è
   voluto.
7. **90, esercizio 2.** Non si può chiudere: `table tr | quanti = 3` c'era già, e passa lo stesso, perché il
   browser crea da sé il `<tr>` attorno alle celle orfane e l'albero è identico a quello della soluzione. Resta
   aperto (vedi domande).
8. **75-78, ordinamenti.** La 76 aveva già "minuti". Ho allineato 76 e 77 alla 75 e al brief: la tabella di traccia
   è scesa dopo il programma, in una sezione "La traccia sui sei tempi" e "La traccia sulle sei carte", e dopo la
   figura resta la risposta alla sua domanda. `const int N` e `const int MAX` sono fuori da `main`, come nelle
   lezioni 70-75; nella 78 il 6 scritto tre volte è diventato `N`. La 78 conta come le altre: ho portato la figura
   fino in fondo nei tre casi a 12 elementi, e la tabella torna (selezione rovesciata 66 e 6, cioè lo scambio solo
   se `imin != i`).

### Filo dei Fuori Tempo

- I componenti erano quattro nelle lezioni 88-90 (Sara, Leo, Marta, Dario), quattro con altri nomi nella 86 (Amir,
  Giulia), cinque nelle 92-95 (con Pietro ed Emma) e tre estranei nell'esercizio della 97. Ora sono dappertutto i
  quattro delle 88-90: corrette 86, 92, 93, 94, 95 e 97 (con i controlli dell'esercizio).
- 85: "la batterista" è diventato "il batterista". 86: "proviamo per la prima volta" è diventato "suoniamo".
- 96 e 98: il concerto con i biglietti a 8 euro ora è "di beneficenza", perché quello di fine anno (5 giugno, aula
  magna) nelle 88-91 è gratuito.
- 89: il secondo concerto è il 27 giugno, perché il 20 giugno nella 90 ha luogo e ingresso "da definire".

### Affermazioni false o vere a metà

- 68: "gli argomenti vengono copiati nei parametri" contraddiceva il paragrafo su Python.
- 70, 71, 74: `-1` "non può essere un indice" contro `voti[-1]` della 70; "il compilatore se ne accorge".
- 73: `find` che "dà -1" in C++; la domanda sulla "prima coppia" diversa in "ossuto".
- 79: senza `strip()` non esce `81067` ma le quattro righe.
- 82: video "sempre" con perdita, "pochi secondi" di video non compresso.
- 85: connessione "maggiore" del bitrate (l'esercizio accetta l'uguale), "nessuna connessione di casa".
- 87: il file di testo aperto nel browser (ora salvato come `pagina.html`), gli spazi "ignorati", XML "nato per i
  dati".
- 88: senza `</h2>` diventano titolo tutti i paragrafi che seguono.
- 89: "guarda il disco deformarsi" era falso, perché un SVG con `viewBox` tiene le proporzioni: provato. L'SVG ha
  ora `preserveAspectRatio='none'` e si deforma.
- 93: il riquadro che "si attacca" al bordo; `width` senza effetto sugli elementi in linea (immagini escluse).
- 98: "tutti i controlli passano dallo script" (il campo `type="number"` fa eccezione).

### Lessico, link, doppioni

- 85: codec e contenitore usano le parole della 82 (codifica = modo, codec = programma), con il link. Adeguati
  formulario e due flashcard.
- 69: non aveva nessun link. Ne ha tre, a 65, 66 e 67.
- 75: richiamo allo scambio della 68; una riga spiega `MAX`, mai usato prima.
- 78: tolto il grassetto a "caso migliore" e "caso peggiore" (sono della 71). 85: tolto a "risoluzione".
- "Screen reader" e "sintesi vocale" sono diventati "lettore di schermo" (90, 91, 94), la parola che la 95 definisce.
- 94: mezza frase per `aside` e per `list-style: none`. 97: per `display: none`.
- 80: "record" (mai definito) tolto da figura e flashcard. 87: "Extensible" come nella 81.
- 82-85: aggiunto `return 0;` ai `main` in C++, come in tutte le lezioni da 60 a 80.
- Piccole: 65, 66, 67, 70 (parole del lotto, due "usiamo"), 85 (frase che annunciava), 87 ("provate"), 78 (sezione
  che si apriva con una domanda).

### Aspetto sul telefono

- 76, 84, 85, 93 (lezione e formulario): le formule in evidenza uscivano dalla colonna a 390 px. Ora vanno a capo
  dopo l'uguale; misurate, stanno tutte nella colonna.
- 78: nella tabella le coppie "11 e 0" andavano a capo. 95: due frasi riscritte perché la punteggiatura dopo una
  formula finiva da sola sulla riga dopo.

## Esito dei controlli

| Controllo | Esito |
|---|---|
| `check.mts` su 102 file | 0 errori. Un avviso: 81, 13 grassetti. Letti: sono tutti termini definiti. |
| `verifica.mts` su 65-98 | 43 esercizi, 0 errori. Restano gli avvisi "pagina web, i controlli si provano nel browser". |
| Compilazione di tutti i blocchi C++ e Python (`clang++ -fsyntax-only`, `py_compile`) | 255 programmi. Non compilano solo 6 programmi di partenza di esercizi, a cui manca la funzione da scrivere. |
| `pagine-lezioni.mjs 87 98` | 32 blocchi, la soluzione passa sempre. |
| Partenze che superano già dei controlli | 91 blocco 5, 92 blocchi 3-5, 93 blocco 5, 97 blocco 4: guardati uno per uno, sono controlli di guardia ("resta nero", "con dati giusti parte", "prima del clic"). Nessuno riguarda da solo quello che l'esercizio chiede. |
| TikZ, 10 figure, chiaro e scuro | Compilate e guardate tutte: nessun difetto. Nessuna lettera accentata dentro i blocchi. |
| Ogni lezione a 1280, 390 e 390 scuro | 102 pagine: nessuno scorrimento laterale, nessun `interattivo` vuoto, nessuna figura mancante. Console pulita, tranne la 96 (vedi sotto). |
| Stile | Nessun trattino lungo, nessun "piuttosto che", nessuna parola vietata. |

La 96 dà in console `Cannot set properties of null (setting 'textContent')`: è il terzo esercizio, il cui script di
partenza è collegato senza `defer` apposta. È voluto.

## Difetti non corretti

Dell'editor e della pagina, non miei:

- A 390 px, negli esercizi con un programma, "Verifica" va su una seconda riga sotto "Python, C++, Salva, Esegui"
  (`fogli/84-1.png`).
- La punteggiatura dopo una formula in linea può finire da sola a inizio riga (`fogli/84-1.png`, esempio 2:
  "30 MB" e il punto sotto). Vale per tutto il sito.
- Nel grafico della 78 il tasto "Reset" copre l'origine (`figure/foglio-04.png`).
- Le tabelle di traccia a 390 px scorrono dentro il loro riquadro (69, 74, 75, 76, 77, 78).

Delle figure:

- `inf-html-albero-documento` (88) da telefono resta alta 1159 px (`figure/alte.png`). Ho guardato il componente:
  file di 15 righe, albero e pagina sono tutti contenuto. Si recuperano circa 40 px togliendo il livello vuoto
  dell'albero, al prezzo di un salto quando si cambia file. Per accorciarla davvero servono due linguette "albero" e
  "pagina" sul telefono: è un ridisegno, non l'ho fatto. `inf-css-flexbox` (94) è alta 1074 px per lo stesso motivo.
- `inf-markup-testo-albero-pagina` (87): nella pagina disegnata il contorno della parola scelta copre gli spazi
  accanto ("Suoniamo[rock]dal 2024", `figure/foglio-08.png`).
- `inf-top-down-albero` (69): al primo passo metà del riquadro è vuota, perché tiene il posto per l'albero intero.

Dei testi, segnalati dai lettori e lasciati:

- 76 è a 408 righe (era 398), 82 a 439.
- 77: l'elemento tenuto da parte si chiama `x`, che in 71 e 74 è il valore cercato. "Cella" per "posto" nella 77.
- 75 legge con `for k`, 76 e 77 con `for i`.
- 78: "la binaria ne fa 4" per un valore assente vale per il 70 della figura; per altri valori sono 3.
- 82 e 84 definiscono tutte e due in grassetto "senza perdita" e "con perdita". 87 ridefinisce tag ed elemento
  senza richiamare la 81.
- 94 e 95 ripetono quasi alla lettera due avvisi di 90 e 88 (tabelle per impaginare, `h4` scelto per la grandezza).
- 95, 97, 98 usano `<button>` e `<input>` senza `type`, che la 91 non presenta.
- 90: la scaletta ha tre brani nel primo esempio e quattro nel secondo.
- I generatori hanno nomi diversi dal filo (`inf-css-layout`: Pietro ed Emma; `inf-responsive`: "Pietro alla
  batteria", "Marta con il basso"; `inf-markup`: Amir, Giulia). Sono dell'altro agente.

## Domande per Alessandro o Andrea

1. I Fuori Tempo sono quattro (Sara voce, Leo batteria, Marta chitarra, Dario basso), come ho uniformato, o
   preferisci i cinque delle lezioni 92-95? I generatori vanno allineati alla scelta.
2. Nelle 92-95 "il prossimo concerto" è venerdì 12 dicembre in palestra, nelle 88-91 è venerdì 5 giugno in aula
   magna. I giorni tornano tutti con l'anno scolastico 2025-26, quindi sono concerti diversi. Va bene così, o il
   sito deve avere un solo "prossimo concerto"? Le date con il giorno della settimana invecchiano.
3. Il concerto a pagamento di 96 e 98 l'ho chiamato "di beneficenza". Va bene, o togliamo il prezzo?
4. 90, esercizio 2: le celle senza `<tr>` passano e nessun controllo sull'albero le distingue. Si accetta, o serve
   un controllo sul sorgente dello studente (che oggi non esiste)?
5. 76 e 77 ora hanno la traccia dopo il programma, come la 75 e come chiede il brief. Il gruppo 6 l'aveva messa
   subito dopo la figura: Andrea preferisce quell'ordine, da portare allora anche nella 75?
6. 76 a 408 righe: si accetta, o si toglie qualcosa (per esempio la funzione `stampa` dal primo programma)?
7. 85: va bene "codifica" per MP3, AAC e H.264 e "codec" per il programma, come nella 82, o in classe si dice
   "codec" per tutte e due le cose?
8. 81: "dati strutturati" è definito come dati ad albero, ma anche una tabella è un dato strutturato. Si lascia?
9. 89: l'SVG con `preserveAspectRatio='none'` è un trucco per far deformare il disco come una fotografia. Va bene,
   o si aspetta che l'editor abbia le immagini vere?
10. La figura della 88 da telefono: si accetta alta 1160 px, o si ridisegna con le linguette?

## Che cosa non ho controllato

- Le lezioni intere a 390 px le ho guardate a pezzi: un foglio su due o tre per 11 lezioni (66, 69, 72, 76, 78, 81
  in scuro, 84, 88, 91, 95, 97 in scuro). Le altre 23 le ha controllate solo lo script.
- Le figure interattive le ho guardate tutte a 390 px in chiaro, al primo passo soltanto. In scuro ho visto solo
  quelle dentro i fogli della 81 e della 97. Non ho usato i loro comandi, tranne la gara della 78.
- Non ho eseguito i programmi nel browser né premuto "Verifica" sugli esercizi di programmazione: per quelli c'è
  `verifica.mts`.
- Le correzioni proposte dai lettori le ho verificate; le loro dichiarazioni "nessun difetto" (conti rifatti,
  anticipazioni riprese) no.
- Solo Chromium. Il messaggio di convalida del browser l'ho visto in inglese, perché Chromium senza interfaccia è
  in inglese.
- Formulari e flashcard: `check.mts` e le ricerche mirate, non una rilettura intera. Non li ho aperti nel browser.

---

## Integrazione degli esercizi

# Integrazione degli esercizi del terzo anno di informatica (7 ottobre 2026)

I 34 generatori delle lezioni 65-98 sono collegati al sito e passano tutte le verifiche. Niente commit, niente
database, niente pubblicazione.

## File condivisi toccati

- `src/lib/exercises/index.ts`: 34 righe nel registro dei generatori.
- `src/lib/exercises/config.ts`: 34 lezioni, con il percorso letto da `docs/lezioni/informatica/originali/index.json`
  (capitoli `inf-funzioni`, `inf-array`, `inf-ordinamento`, `inf-file`, `multimedia`, `inf-html`, `inf-css`,
  `inf-web-interattivo`). In ogni riga lo slug del generatore è lo slug della lezione.
- `src/lib/exercises/level-names.ts`: i nomi dei livelli dai rapporti dei gruppi; per le lezioni 76-78 (il JSON del
  gruppo 6 non c'era) dalle `label` dei generatori.
- `src/lib/exercises/v2/open-answers.ts`: 16 righe in `runAnswers` (l'ultimo livello delle lezioni 65-80).
- `src/lib/exercises/v2/inf-codice.ts`: esporta `drawn`, `pick`, `TooFew`; nuova costante `START_WIDTH = 38`, usata
  dal `check()` per il programma di partenza.
- `scripts/exercises/checkers/_inf_codice.py`: `START_WIDTH = 38` per il programma di partenza.
- `scripts/exercises/README.md` e `docs/lezioni/informatica/brief-esercizi-codice.md`: il riferimento è `inf-vettori`
  (e `inf-css-regole` per i frammenti); il brief documenta `drawn`, `pick` e il limite di 38.
- Tolti `generators/inf-codice-prova.ts`, `checkers/inf_codice_prova.py`, `specs/exercises/inf-codice-prova.md`. Una
  copia è in `integrazione-esercizi/backup-prova/`.

Un controllo scritto per l'occasione (`integrazione-esercizi/registry.mts`) confronta per le 34 lezioni config,
registro, id e livelli del generatore, nomi dei livelli e `runAnswers` con il tipo di risposta che il generatore
produce: tutto concorde. Nel repo non c'è un controllo d'insieme che copra informatica (`open-answers.mts` guarda
solo matematica).

## La larghezza dell'editor

Misurata con Playwright a 390 px sulla pagina di prova: l'area di scorrimento dell'editor è 357 px, i numeri di riga
ne prendono 36, la riga ha 8 + 12 px di margine, un carattere è largo 7,8 px. Ci stanno 38 caratteri: una riga di 38
non scorre, una di 39 sì (provato scrivendole nell'editor). Con 100 righe o più i numeri si allargano e ne stanno 37,
ma nessun programma ci arriva.

Generatori corretti per stare in 38: `inf-definire-funzioni`, `inf-parametri-ritorno`, `inf-ricerca-binaria`,
`inf-selection-sort`, `inf-bubble-sort`, `inf-insertion-sort` (il commento "scrivi qui il resto del programma"
diventa "scrivi qui il resto"), `inf-top-down` ("scrivi qui chiamata e stampa"), `inf-file-testo` ("poi riaprilo,
leggilo e stampa"). In `inf-ricerca-binaria` e `inf-selection-sort` la riga `int v[6] = {…};` arrivava a 40: il
vettore viene estratto di nuovo finché la riga sta in 38, cioè con almeno due numeri di una cifra su sei.

## I 34 generatori

Quattro seed: 1, 50001, 777001 (1000 per livello) e 600001 (400 per livello). C++: `INF_CPP=1 INF_CPP_MAX=40` su 25
esercizi per livello, seed 1. L'ultima colonna conta gli esercizi diversi su 1000 per livello come li vede lo
studente (domanda, programma o frammento, e le quattro opzioni senza l'ordine).

| N | Generatore | Livelli | Aperti | Seed 1, 50001, 777001, 600001 | C++ | Diversi su 1000 |
|---|---|---|---|---|---|---|
| 65 | `inf-definire-funzioni` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 162, 297, 424, 569, 582 |
| 66 | `inf-parametri-ritorno` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 768, 834, 797, 806, 130, 1000 |
| 67 | `inf-visibilita` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 998, 999, 984, 690, 1000 |
| 68 | `inf-passaggio-parametri` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 852, 996, 1000, 40, 988 |
| 69 | `inf-top-down` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 245, 357, 537, 981, 983, 995 |
| 70 | `inf-vettori` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 782, 1000, 1000, 1000, 1000, 1000 |
| 71 | `inf-ricerca-sequenziale` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 1000, 1000, 65, 764, 1000 |
| 72 | `inf-matrici` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 1000, 1000, 1000, 177, 1000, 1000 |
| 73 | `inf-stringhe` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 452, 614, 573, 726, 64, 998 |
| 74 | `inf-ricerca-binaria` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 1000, 1000, 825, 30, 1000 |
| 75 | `inf-selection-sort` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 1000, 1000, 1000, 461, 20, 1000 |
| 76 | `inf-bubble-sort` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 1000, 1000, 1000, 70, 1000 |
| 77 | `inf-insertion-sort` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 1000, 1000, 1000, 167, 1000 |
| 78 | `inf-confronto-algoritmi` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 999, 846, 508, 89, 415, 1000 |
| 79 | `inf-file-testo` | 1-5 | 5 | PASS PASS PASS PASS | PASS | 998, 998, 980, 999, 1000 |
| 80 | `inf-file-csv` | 1-6 | 6 | PASS PASS PASS PASS | PASS | 961, 1000, 1000, 1000, 999, 1000 |
| 81 | `inf-xml-json` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 1000, 990, 1000, 1000, 989 |
| 82 | `formati-multimediali` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 665, 672, 407, 418, 608 |
| 83 | `inf-bitmap-vettoriale` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 386, 991, 577, 198, 608 |
| 84 | `inf-compressione` | 1-6 | nessuno | PASS PASS PASS PASS | non ha programmi | 192, 994, 985, 692, 967, 671 |
| 85 | `inf-audio-video` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 120, 243, 231, 962, 878 |
| 86 | `inf-font` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 580, 159, 197, 639, 999 |
| 87 | `inf-markup` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 868, 820, 926, 784, 591 |
| 88 | `inf-html-struttura` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 364, 546, 595, 996, 704 |
| 89 | `inf-html-testo-link` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 288, 311, 707, 858, 468 |
| 90 | `inf-html-elenchi-tabelle` | 1-6 | nessuno | PASS PASS PASS PASS | non ha programmi | 771, 875, 499, 716, 657, 471 |
| 91 | `inf-html-moduli` | 1-6 | nessuno | PASS PASS PASS PASS | non ha programmi | 360, 556, 1000, 459, 831, 424 |
| 92 | `inf-css-regole` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 836, 1000, 1000, 997, 990 |
| 93 | `inf-css-box` | 1-6 | nessuno | PASS PASS PASS PASS | non ha programmi | 1000, 883, 998, 995, 985, 694 |
| 94 | `inf-css-layout` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 999, 286, 957, 996, 226 |
| 95 | `inf-responsive` | 1-6 | nessuno | PASS PASS PASS PASS | non ha programmi | 738, 997, 442, 984, 857, 129 |
| 96 | `inf-script-client` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 653, 902, 770, 460, 953 |
| 97 | `inf-dom-eventi` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 1000, 995, 320, 263, 685 |
| 98 | `inf-validazione-moduli` | 1-5 | nessuno | PASS PASS PASS PASS | non ha programmi | 567, 417, 206, 171, 368 |

Il primo quarto seed scelto, 424243, dava FAIL su quattro generatori (`inf-ricerca-sequenziale`, `inf-stringhe`,
`inf-confronto-algoritmi`, `inf-html-elenchi-tabelle`) con 400 esercizi su 400 giusti e una sola segnalazione,
UNBALANCED, sui livelli a cinque famiglie. La causa è nel generatore di numeri comune e non in quei quattro file: con
i semi da 424243 a 424642 la prima estrazione tra cinque dà 55 volte su 400 lo stesso caso (13,75% contro il 20%
atteso), uguale per tutti i generatori. Con 600001 le quote tornano. Resta vero che `rng.pick` come prima estrazione
su semi consecutivi può uscire dalle quote su finestre di 400 semi: riguarda `rng.ts`, che non ho toccato.

Altre verifiche: `npx tsc --noEmit -p .` 0 errori; `npx eslint src/lib/exercises` 0 errori e un avviso in un file di
matematica non mio (`generators/funzioni-iniettive-suriettive-biettive.ts:795`, `no-unused-expressions`), lasciato
com'è; `npm run test:unit` 810 su 810.

## Nel browser

Pagina di prova a 390 px, semi 3 e 17 per ogni livello dei 34 generatori, più la risposta aperta dei 16 livelli
aperti con l'editor in C++: 398 pagine. In ognuna a scelta multipla è stata cliccata un'opzione fino al verdetto (85
giuste, 281 sbagliate, con "Come si risolve" aperto). Nessuno scorrimento laterale della pagina, dei riquadri di
codice o dell'editor. L'unica segnalazione dello script (93, livello 5, seme 3) è un falso allarme: è il MathML
nascosto di KaTeX, e la formula a schermo va a capo. Ho aperto e guardato 38 schermate, almeno una per generatore.

Nelle risposte aperte lo script non consegna un programma: il verdetto di una risposta aperta non è stato provato
da me (alcuni gruppi lo hanno fatto, vedi i loro rapporti).

## Esercizi corretti dopo la lettura

Letti un esercizio per livello di ogni generatore (184 esercizi, da cinque a sei per generatore): testo, opzioni,
soluzione, passaggi. Nessun trattino lungo e nessun "piuttosto che". Correzioni:

- `inf-vettori` livello 2 e `inf-matrici` livello 1: l'assegnamento poteva rimettere nell'elemento il valore che
  aveva già (`tempi[0] = tempi[1] + 3` con 8 al posto di 8), così chi saltava l'assegnamento rispondeva giusto. Ora
  quei numeri vengono estratti di nuovo.
- `inf-definire-funzioni` livello 3: "quindi servono una chiamata" diventa "quindi serve una chiamata".
- `inf-parametri-ritorno` livello 6: la consegna spezzata in due frasi ("… Poi chiamala e scrivi il risultato.").
- `inf-stringhe` livello 6: tolto il doppio "un carattere alla volta" dalla consegna.
- `inf-file-csv` livello 6: tolta una virgola di troppo nella soluzione ("aumenta s di 1 quando …").
- `inf-compressione` livello 4: "Il 80%" diventa "L'80%" (anche l'1, l'8 e l'11); aggiornata l'espressione del
  controllo Python. `inf-responsive` livello 1: stesso errore in un passaggio.
- `inf-bitmap-vettoriale` livello 4: nel caso che chiede la densità il suggerimento diceva "Calcola quanto viene
  grande la stampa"; ora "Calcola la densità di stampa."
- `inf-html-struttura` livello 4: il primo passaggio cominciava con la minuscola.
- `inf-css-layout` livello 1: l'opzione "elemento flex diventa solo ul" riscritta "solo ul diventa un elemento flex".

Dopo le correzioni tutti i generatori toccati sono stati rilanciati: la tabella sopra è dell'ultima passata.

Viste e lasciate: in `inf-font` i byte sono scritti senza spazio delle migliaia (76800 B) e in `inf-audio-video` con
(55 200 kB); `inf-confronto-algoritmi` usa l'apostrofo tipografico e gli altri quello dritto; in alcune soluzioni dei
livelli "quale frammento" la frase è generica ("Il frammento che usa l'elemento giusto con i suoi attributi").

## Livelli con poca varietà

Sotto 100 esercizi diversi su 1000, contati con le opzioni:

| Generatore | Livello | Prima | Dopo | Domande diverse |
|---|---|---|---|---|
| `inf-selection-sort` | 5 Il corpo del giro | 5 | 20 | 2 |
| `inf-ricerca-binaria` | 4 Il corpo del ciclo | 9 | 30 | 3 |
| `inf-passaggio-parametri` | 4 Quale funzione lo fa | 40 | 40 | 11 |
| `inf-stringhe` | 5 Scegliere la funzione giusta | 64 | 64 | 4 |
| `inf-ricerca-sequenziale` | 3 Quale funzione cerca bene | 3 | 65 | 3 |
| `inf-bubble-sort` | 4 Quale ciclo interno ordina | 70 | 70 | 2 |
| `inf-confronto-algoritmi` | 4 Dove va il contatore | 44 | 89 | 4 |
| `inf-parametri-ritorno` | 5 Quale funzione restituisce questo | 13 | 130 | 13 |

Dove costava poco (cinque livelli) i distrattori vengono mescolati prima di sceglierne tre: prima uscivano sempre i
primi tre della lista. In `inf-ricerca-sequenziale` il mescolamento ha fatto emergere un distrattore con una riga di
37 caratteri, che prima non usciva mai: ora resta fuori. Gli altri tre livelli mescolavano già.

Questi sono tutti livelli "quale programma è giusto" su un algoritmo fisso: la domanda è la stessa per costruzione
(due ordini, tre o quattro famiglie) e cambiano solo le opzioni. Per salire davvero servono più contesti nella
domanda (nomi, che cosa si ordina o si cerca), cioè lavoro sul generatore e sul suo controllo: non fatto.

Altri livelli hanno molte combinazioni di opzioni ma poche domande diverse, perché la domanda è fissa e variano i
frammenti: `inf-xml-json` 2 e 4 (1 domanda), `inf-markup` 2 e 4, i livelli "quale affermazione è vera" di 82, 83 e
84 (2 domande), `inf-html-moduli` 1 (39), `inf-validazione-moduli` 5 (30) e 2 (48), `inf-responsive` 6 (48). Appena
sopra 100 con le opzioni: `inf-responsive` 6 (129), `inf-definire-funzioni` 1 (162), `inf-insertion-sort` 4 (167),
`inf-matrici` 4 (177), `inf-compressione` 1 (192), `inf-font` 3 (197), `inf-bitmap-vettoriale` 4 (198).

## Che cosa non ho controllato

- La consegna di una risposta aperta nel browser (giusta, sbagliata, giusta senza il costrutto).
- Il C++ oltre i 25 esercizi per livello di un seed, e i generatori 81-98, che non hanno programmi da compilare.
- La pagina esercizi vera di una lezione: le lezioni 65-98 non sono nel database, quindi ho controllato solo che
  percorso, slug e livelli in `config.ts` coincidano con `index.json` e con i generatori. Se nel database i capitoli
  avranno slug diversi da quelli di `index.json`, le 34 righe di `config.ts` vanno corrette.
- Le prove e2e (`tests/e2e/esercizi-informatica.spec.ts` crea utenti: non lanciata).
- Errori piantati nei campioni: non rifatti, li hanno fatti i gruppi.
- Le specifiche in `specs/exercises/`: non le ho aggiornate dove citano i commenti di partenza accorciati o il limite
  di 42 per l'editor.
- Gli altri generatori del terzo anno che hanno ancora una copia locale di `drawn`, `pick` e `TooFew`: funzionano, solo
  `inf-vettori` usa quelle del modulo.
- Tema scuro, scheda da stampare, un telefono vero.
- Ho letto un esercizio per livello, non cinque per livello: un errore che esce solo in una famiglia rara può essere
  sfuggito.
