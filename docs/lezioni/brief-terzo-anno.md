# Brief del terzo anno di matematica (5 ottobre 2026)

Per chi scrive un gruppo di lezioni del terzo anno di matematica delle superiori (liceo scientifico). Il biennio
(lezioni 1-104) è scritto e pubblicato, con esercizi, formulari e flashcard. Questo lotto scrive le 25 lezioni del
terzo anno, file 105-129, in due fasi: prima le lezioni con note, formulari e flashcard; poi i generatori di
esercizi. Ogni gruppo scrive un capitolo, o mezzo.

Non si pubblica nulla: niente scritture nel database, niente `publish.mts`, niente commit. La pubblicazione la fa
chi coordina. Nella stessa cartella lavorano altri gruppi e altre sessioni: si creano e si modificano solo i file
delle proprie lezioni, elencati sotto. I file condivisi (`src/lib/exercises/index.ts`, `config.ts`,
`level-names.ts`, `v2/open-answers.ts`, `docs/lezioni/prerequisiti.md`, `url.md`, `albero.md`, il vault) li tocca
solo chi coordina: quello che ci andrebbe scritto si riporta nel messaggio finale.

## Le lezioni e i gruppi

| N | slug | Titolo | Gruppo |
|---|---|---|---|
| 105 | funzioni-reali-di-variabile-reale | Funzioni reali e dominio | A |
| 106 | funzioni-dispari-pari | Funzioni pari e dispari | A |
| 107 | funzioni-monotone | Funzioni crescenti e decrescenti | A |
| 108 | funzioni-periodiche | Funzioni periodiche | A |
| 109 | grafici-trasformazioni | Trasformazioni dei grafici | A |
| 110 | successioni-numeriche | Successioni numeriche | B |
| 111 | progressioni-aritmetiche | Progressioni aritmetiche | B |
| 112 | progressioni-geometriche | Progressioni geometriche | B |
| 113 | principio-induzione | Principio di induzione | B |
| 114 | circonferenza-equazione | Equazione della circonferenza | C |
| 115 | circonferenza-rette | Circonferenza e rette | C |
| 116 | parabola-equazione | La parabola nel piano cartesiano | C |
| 117 | parabola-rette | Parabola e rette | C |
| 118 | ellisse | Ellisse | D |
| 119 | iperbole | Iperbole | D |
| 120 | iperbole-equilatera | Iperbole equilatera e funzione omografica | D |
| 121 | funzioni-esponenziali | Funzione esponenziale | E |
| 122 | equazioni-esponenziali | Equazioni esponenziali | E |
| 123 | disequazioni-esponenziali | Disequazioni esponenziali | E |
| 124 | logaritmi-proprieta | Logaritmi e loro proprietà | F |
| 125 | funzioni-logaritmiche | Funzione logaritmica | F |
| 126 | equazioni-logaritmiche | Equazioni logaritmiche | F |
| 127 | disequazioni-logaritmiche | Disequazioni logaritmiche | F |
| 128 | distribuzioni-doppie | Distribuzioni doppie | G |
| 129 | regressione-correlazione | Regressione e correlazione | G |

Il nome di ogni file è `NN-slug.md`, con questi numeri e questi slug esatti: lo script di pubblicazione li cerca
così.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto.
2. `docs/lezioni/README.md`, le sezioni "Il piano cartesiano con i cursori" e "Controllo automatico", e
   `vault/Contenuti/Piano cartesiano nelle lezioni.md`, le sezioni "Tre modi di usarlo", "Lezioni ancora da
   scrivere" e "Dove resta meglio TikZ".
3. `docs/lezioni/albero.md`: il terzo anno per intero (che cosa sta nella tua lezione e che cosa in quelle
   vicine), e uno sguardo al quarto e al quinto, per non anticipare quello che ha la sua lezione più avanti
   (goniometria al quarto anno; limiti, derivate e studio di funzione al quinto).
4. `docs/lezioni/url.md`: gli indirizzi per i link. Si possono linkare tutte le lezioni del biennio e tutte quelle
   del terzo anno, che si pubblica insieme. Non le lezioni del quarto e del quinto anno, che sono vuote.
5. Le lezioni del biennio su cui la tua si appoggia, per non rispiegarle e per usare le stesse parole e notazioni.
   Le trovi in `docs/lezioni/riscritte/`: 18 e 42-45 (funzioni), 80-86 (piano cartesiano e retta), 87-89 (parabola
   $y = ax^2 + bx + c$ e disequazioni di secondo grado), 93 (sistemi di secondo grado, retta e parabola), 96
   (circonferenza nella geometria sintetica), 104 (trasformazioni geometriche), 08, 09, 22, 76 (potenze, fino
   all'esponente razionale), 55-57 (statistica), 81 (retta, per la regressione).
6. Una lezione finita con i suoi quattro file, per la forma: `riscritte/87-funzioni-quadratiche.md` e gli omonimi
   in `note/`, `formulari/`, `flashcard/`. La 87 ha anche i blocchi `grafico`.

## Fase 1: cosa consegnare per ogni lezione

| File | Cosa |
|---|---|
| `docs/lezioni/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, convenzioni da confermare |
| `docs/lezioni/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/flashcard/NN-slug.md` | da 12 a 20 flashcard |

### La lezione

- Per studenti di 16 anni, al terzo anno. Sono più grandi di quelli del biennio, ma la lezione resta più chiara
  del libro, non più lunga: tra 15.000 e 30.000 caratteri, come quelle del secondo anno.
- Una lezione, un argomento: quello del titolo. I confini tra lezioni vicine dello stesso gruppo li decidi tu e li
  scrivi nella nota; quelli con le lezioni di altri gruppi seguono i titoli dell'albero. Alcuni confini già
  fissati:
  - 105 riprende il dominio naturale della 43 e lo porta alle funzioni del terzo anno che lo studente già conosce
    (razionali fratte, irrazionali, con il valore assoluto); gli zeri e il segno di una funzione stanno qui. Il
    dominio di esponenziali e logaritmi sta nelle lezioni 121 e 125.
  - 108, funzioni periodiche, viene prima della goniometria (quarto anno): definizione, periodo, esempi con
    grafici dati e con la parte frazionaria o funzioni definite a tratti e ripetute; seno e coseno si possono
    nominare in un riquadro come esempio che arriverà, senza usarli.
  - 109, trasformazioni dei grafici: traslazioni, simmetrie, dilatazioni, valore assoluto, cioè $f(x - a) + b$,
    $-f(x)$, $f(-x)$, $k f(x)$, $f(kx)$, $|f(x)|$, $f(|x|)$. Le trasformazioni del piano come tali sono nella 104.
  - 114 e 115: la circonferenza come luogo e la sua equazione nella 114 (centro e raggio, dalla forma
    $x^2 + y^2 + ax + by + c = 0$ e ritorno, circonferenza per tre punti o con condizioni); posizioni
    retta-circonferenza, tangenti da un punto e in un punto, circonferenze tra loro nella 115.
  - 116 e 117: la 87 ha già $y = ax^2 + bx + c$ con vertice, asse e intersezioni con gli assi. La 116 dà la
    parabola come luogo (fuoco e direttrice), le parabole con asse parallelo all'asse $x$, la parabola da
    condizioni (tre punti, vertice e un punto, fuoco e direttrice). La 117: posizioni retta-parabola, tangenti,
    il segmento parabolico se serve; la 93 ha già il sistema retta-parabola dal lato algebrico.
  - 120: iperbole equilatera riferita agli assi e agli asintoti ($xy = k$), funzione omografica
    $y = \frac{ax + b}{cx + d}$ con centro e asintoti.
  - 121 e 124: le potenze con esponente reale e la funzione $a^x$ nella 121; la definizione di logaritmo e le
    proprietà (prodotto, quoziente, potenza, cambiamento di base) nella 124; la funzione $\log_a x$ come inversa
    nella 125. Il numero $e$ si presenta nella 121 come base che si incontra nella crescita continua, senza limiti.
  - 128 e 129: tabelle a doppia entrata, distribuzioni marginali e condizionate, indipendenza nella 128;
    diagramma a dispersione, covarianza, retta di regressione ai minimi quadrati e coefficiente di correlazione
    lineare nella 129. Si appoggiano alle 55-57.
- Ogni conto degli esempi svolti si rifà con SymPy prima di consegnare. Una affermazione vera solo in parte è un
  errore: meglio dire meno e dire giusto. Le dimostrazioni che i libri del terzo anno danno si danno (equazione
  della circonferenza, formula della somma di una progressione, proprietà dei logaritmi), con ipotesi e passaggi
  chiari; quelle che richiedono strumenti del quarto o del quinto anno si enunciano e basta, dicendolo.
- Convenzioni, oltre a quelle di `stile.md`: virgola decimale con `{,}`; coordinate dei punti con la virgola,
  $P(2, -3)$, e le coordinate non intere scritte come frazioni, come nelle lezioni 80-87 (la 80 lo spiega
  nell'esempio 5; il punto e virgola resta solo dentro i blocchi `grafico`, dove è la sintassi del plotter); intervalli con le parentesi quadre rovesciate oppure tonde come
  li scrivono le lezioni 52-54 e 88 (controlla e usa la stessa forma); $\log_a x$, $\ln x$ per la base $e$ e
  $\log x$ per la base 10 (da confermare, va tra i dubbi della nota); $\sin$ e $\tan$ come nella 101; insieme
  delle soluzioni $S = \dots$ come nelle lezioni di equazioni e disequazioni del biennio.
- Errori frequenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono.
- Link verso i prerequisiti e verso le lezioni vicine, solo con gli URL di `url.md`.

### Figure

- Le figure si disegnano in TikZ, con `% nome:` e `% alt:`, e vanno guardate. Per vederle:
  `node scripts/figure/anteprima.mjs <cartella di uscita> docs/lezioni/riscritte/NN-slug.md` (con `--scuro` per
  il tema scuro, `--solo nome` per una sola): scrive un PNG con tutte le figure della lezione, da leggere figura
  per figura. Usa come cartella di uscita una sottocartella tua dentro la cartella temporanea della sessione, non
  il repo. node-tikzjax non disegna `pattern=`, ignora `\clip` e non conosce `\tfrac`; un riempimento bianco per
  "cancellare" diventa una macchia nel tema scuro. Guarda come sono fatti i grafici nelle lezioni 87 e 88.
- Ogni figura corrisponde al testo: i punti stanno sulla curva, i fuochi alla distanza giusta, gli asintoti con la
  pendenza giusta. Controlla le coordinate con un conto, non a occhio.
- Blocchi `grafico` (il piano con i cursori): due o tre per lezione dove un cursore mostra una famiglia di curve
  ($a^x$ e $\log_a x$ con il cursore $a$; $f(x - a) + b$ e $k f(x)$; circonferenza, ellisse e iperbole con i loro
  parametri; il fascio di rette che diventa tangente). Sempre dopo una figura TikZ che fa da copertina, e sempre
  con una `domanda:`. La sintassi è in `docs/lezioni/README.md`; `check.mts` dice se un blocco non si legge. Dove
  non c'è un "cosa succede se", niente blocco.

### Note, formulario, flashcard

Come in `stile.md`. La nota elenca: le scelte fatte (confini, convenzioni), i dubbi per Andrea in forma di domanda,
le cose da verificare, e una riga `Prerequisiti proposti:` con al massimo quattro slug di lezioni (del biennio o
del terzo anno) senza le quali la lezione non si segue. Il formulario prende tutto dalla lezione; le figure si
copiano dalla lezione così come sono, solo se servono.

### Controlli prima di consegnare

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/riscritte/NN-slug.md docs/lezioni/formulari/NN-slug.md docs/lezioni/flashcard/NN-slug.md
```

Deve uscire senza errori per ogni lezione; gli avvisi si leggono e si spiegano nel messaggio finale se restano. Le
figure si guardano tutte, in chiaro e in scuro. Rileggi ogni lezione una volta dall'inizio come la leggerebbe uno
studente, cercando frasi vietate da `stile.md`, trattini lunghi e conti sbagliati.

### Messaggio finale della fase 1

Per ogni lezione: caratteri, numero di esempi svolti, figure, blocchi `grafico`, flashcard; esito di `check.mts`;
i prerequisiti proposti; le tre domande più pesanti per Andrea; quello che non hai potuto controllare.

## Fase 2: i generatori di esercizi

Parte quando chi coordina lo chiede, dopo la fase 1. Un generatore per lezione, con id uguale allo slug.

Da leggere: `scripts/exercises/README.md` (tutto, in particolare "Aggiungere un generatore"),
`src/lib/exercises/v2/types.ts`, due generatori del secondo anno con specifica e controllo
(`funzioni-quadratiche` e `disequazioni-secondo-grado`: `specs/exercises/<id>.md`,
`src/lib/exercises/v2/generators/<id>.ts`, `scripts/exercises/checkers/<id con _>.py`), i moduli comuni di
`src/lib/exercises/v2/` (`rational.ts`, `surd.ts`, `latex.ts`, `rng.ts`, `grafici.ts`),
`src/lib/exercises/v2/open-answers.ts` (l'intestazione: come si classificano i livelli a risposta aperta) e la
decisione `vault/Decisioni/2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro.md`.

Per ogni lezione tre file nuovi:

| File | Cosa |
|---|---|
| `specs/exercises/<slug>.md` | la specifica: livelli, vincoli, due esempi per livello, esercizi da evitare, distrattori |
| `src/lib/exercises/v2/generators/<slug>.ts` | il generatore, `default` con `id` uguale allo slug |
| `scripts/exercises/checkers/<slug con _ al posto di ->.py` | il controllo indipendente, scritto dalla specifica |

- Da 5 a 7 livelli nell'ordine della lezione, ognuno con una sola difficoltà in più. Gli esercizi seguono la
  lezione pubblicata: stesse notazioni, stessi nomi, stessi procedimenti nei passaggi della soluzione.
- Ogni esercizio ha la forma a scelta multipla, con distrattori presi dagli errori veri degli studenti (quelli dei
  riquadri `ad-warning` della lezione). Dove la risposta è un numero, un insieme di numeri o un'espressione,
  il livello può andare anche a risposta aperta: lo proponi tu, con la classificazione (`V`, `F`,
  `form('...')`, `EXCLUDED`) secondo l'intestazione di `open-answers.ts`.
- Un modulo comune per il tuo capitolo, se serve, va in un file nuovo `src/lib/exercises/v2/<nome>.ts` con il
  controllo comune in `scripts/exercises/checkers/_<nome>.py`; i moduli comuni che esistono si usano senza
  modificarli.
- Controlli, per ogni generatore:
  - `sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py` dà PASS, e lo stesso con i seed 50001 e
    777001;
  - errori piantati apposta in qualche campione (risposta cambiata, vincolo violato, opzione giusta sbagliata)
    vengono bocciati;
  - `review.mts <slug> <file html nella cartella temporanea>` esce con 0;
  - `width.mts <slug>` esce con 0;
  - `npx eslint` sui tuoi file è pulito. `npx tsc --noEmit -p .` gira sull'intero progetto e altri gruppi stanno
    scrivendo: guarda solo gli errori nei tuoi file.
- Non collegare il generatore al sito. Nel messaggio finale, per ogni generatore, riporta in tre blocchi pronti da
  incollare: i livelli offerti (`levels: [1, 2, ...]`), i nomi dei livelli nelle parole dello studente, come in
  `src/lib/exercises/level-names.ts` (`1: 'Centro e raggio dalla forma canonica'`), e la riga di
  `open-answers.ts`. Poi: esito dei controlli con i tre seed, limiti noti, domande per Andrea.

## Fase 3: più piani con i cursori (5 ottobre 2026, richiesta di Alessandro)

Il terzo anno getta le basi dello studio di funzione: dominio, zeri, segno, simmetrie, monotonia, asintoti,
trasformazioni, posizione di una retta rispetto a una curva. È il punto giusto per mettere nelle lezioni più piani
con i cursori, con i parametri giusti. L'esempio di Alessandro: $y = a^x$ con il cursore $a$, dove si vede la
curva crescente per $a > 1$, costante nel caso limite $a = 1$, decrescente per $0 < a < 1$.

Rileggi ogni tua lezione dall'inizio cercando i punti in cui un parametro cambia la forma di una curva o il
risultato di un procedimento, e lì aggiungi un blocco `grafico`. Non per fare numero: ogni piano spiega un punto
preciso del testo, quello accanto a cui sta.

- Ogni piano segue una figura TikZ che fa da copertina, nello stesso riquadro o nella stessa sezione: una figura
  che c'è già, oppure una nuova che mostra lo stato iniziale del piano.
- Ogni piano ha una `domanda:` che chiede di prevedere o di trovare qualcosa con una risposta precisa ("porta $a$
  a $1$: che curva resta?", "per quale $q$ la retta diventa tangente?"), e il testo subito dopo dà la risposta,
  così chi non muove i cursori non perde niente. Le grandezze da leggere vanno in righe `valore:`.
- I casi limite sono il contenuto, non un incidente: se il cursore passa per un valore in cui la curva degenera
  ($a = 1$, $a = 0$, $r = 0$, $\Delta = 0$), la domanda o il testo lo nominano. Se il caso limite non insegna
  niente, l'intervallo del cursore lo evita.
- Rivedi anche i piani che ci sono già con lo stesso criterio.
- Quanti: quelli che servono. Una lezione di procedimento sulle equazioni può restare con uno; una lezione su una
  famiglia di curve può arrivarne a cinque. Sopra cinque la pagina pesa sul telefono.
- Il blocco ha dei limiti (`docs/lezioni/README.md` e "Limiti" in `vault/Contenuti/Piano cartesiano nelle
  lezioni.md`): una sola `scelta` per piano, punti fermi, niente gradi. Non aggirarli con trucchi che confondono.
- Non cambiare il resto della lezione, se non le frasi attorno ai piani nuovi. Formulari e flashcard non si
  toccano. Aggiorna la nota della lezione con l'elenco dei piani.

Controlli: `check.mts` su ogni lezione toccata; ogni piano nuovo o cambiato aperto su
`http://localhost:3000/prova-grafico/lezione?file=riscritte/NN-slug.md` (il server è già acceso, non avviarne un
altro) a 390 px, con i cursori ai valori iniziali, agli estremi e nei casi limite, e lo screenshot guardato; le
figure nuove in anteprima, in chiaro e in scuro. Lo script di Playwright sta nello scratchpad e trova il pacchetto
con `createRequire('/Users/alessandro/Desktop/Personal/Sapiens/package.json')('playwright')`: niente file nella
radice del repo.

Nel messaggio finale, per ogni lezione: i piani aggiunti e cambiati (dove, cosa mostra, la domanda), e quelli che
hai scartato con il perché. Poi tre elenchi che servono a progettare quello che ancora non c'è, senza costruirlo:

1. i piani che servirebbero ma che il blocco non sa fare (un punto da trascinare, la tangente, punti isolati di
   una successione, un'area), con la lezione e il punto;
2. per ogni lezione, due o tre esercizi "dalla funzione al grafico" e "dal grafico alla funzione" che avrebbero
   senso come livello o come flashcard (quale funzione, quali grafici sbagliati accanto a quello giusto, e quale
   errore dello studente rappresenta ogni grafico sbagliato);
3. per ogni lezione, l'esempio svolto che renderebbe di più come esercizio guidato, cioè svolto a passi in cui lo
   studente a un certo punto deve scrivere un risultato, scegliere o muovere un cursore e confermare prima di
   andare avanti: quale esempio, in quali due o tre punti si ferma e che cosa chiede.
