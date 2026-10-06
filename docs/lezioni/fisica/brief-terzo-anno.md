# Brief del terzo anno di fisica (6 ottobre 2026)

Per chi scrive un gruppo di lezioni del terzo anno di fisica delle superiori (liceo scientifico). Il biennio
(lezioni 1-70) è scritto e pubblicato, con figure, esercizi, formulari e flashcard. Questo lotto scrive le 49 lezioni
del terzo anno, file 71-119. Ogni gruppo scrive da 2 a 4 lezioni e consegna tutto: lezione, nota, formulario,
flashcard, figure TikZ, figure interattive, generatore di esercizi con specifica e controllo.

## Regole che non si discutono

- Non si pubblica nulla: niente scritture nel database, niente `publish.mts`, niente commit, niente push.
- Nella cartella ci sono modifiche non committate di altre sessioni e altri 14 gruppi stanno lavorando. Mai
  `git checkout --`, `git restore`, `git reset`, `git stash`, `git clean`, e mai `rm` o una riscrittura intera di un
  file che non hai creato tu. Se un file che non è tuo ti dà un errore, lo riporti e vai avanti.
- Crei e modifichi solo i file delle tue lezioni, più le due registrazioni qui sotto. I file condivisi
  (`src/lib/exercises/index.ts`, `config.ts`, `level-names.ts`, `v2/open-answers.ts`, `kit.tsx`, `fisica.tsx` e gli
  altri pezzi comuni di `interactive/fisica/`, i moduli comuni di `src/lib/exercises/v2/`, `url.md`, `albero.md`, i
  README, il vault) li tocca solo chi coordina. Un pezzo comune che ti serve e non c'è va in un file nuovo tuo.
- Le due registrazioni: una figura interattiva in `FIGURES` di `src/lib/utils/interactive.ts` e una scena degli
  esercizi in `src/components/content/exercises/scenes/index.tsx`, sotto il commento del tuo gruppo
  (`// Physics, third year: ... (group NN).`), con una modifica mirata di poche righe. Una figura si registra solo
  dopo che il suo file esiste e compila: una registrazione anticipata blocca il sito di sviluppo a tutti.
- Il sito di sviluppo è già acceso sulla porta 3111. Non avviarne un altro e non fermarlo: agli script di anteprima
  si passa `--porta 3111`.
- I file temporanei (anteprime, script di controllo, pagine di revisione) vanno in una sottocartella tua dello
  scratchpad della sessione, che ti viene indicata nel messaggio di avvio. Niente file nella radice del repo.
- `npx tsc --noEmit -p .` gira sull'intero progetto: lancialo al massimo due volte, alla fine, e guarda solo gli
  errori nei tuoi file.

## Le lezioni e i gruppi

| N | slug | Titolo | Gruppo |
|---|---|---|---|
| 71 | fis-prodotto-scalare-vettoriale | Prodotto scalare e prodotto vettoriale | 30 |
| 72 | fis-sistemi-non-inerziali | Sistemi di riferimento inerziali e non inerziali | 31 |
| 73 | fis-trasformazioni-galileo | Le trasformazioni di Galileo e la composizione delle velocità | 31 |
| 74 | fis-principio-relativita-galileo | Il principio di relatività galileiana | 31 |
| 75 | fis-forze-apparenti | Le forze apparenti: forza centrifuga e forza di Coriolis | 31 |
| 76 | fis-lancio-obliquo | Il lancio obliquo e la gittata | 30 |
| 77 | fis-lavoro-forza-variabile | Il lavoro di una forza variabile | 30 |
| 78 | fis-forze-conservative-energia | Forze conservative ed energia potenziale | 32 |
| 79 | fis-bilancio-energia | Il bilancio dell'energia con le forze non conservative | 32 |
| 80 | fis-quantita-moto-def | La quantità di moto | 32 |
| 81 | fis-impulso | L'impulso e il teorema dell'impulso | 32 |
| 82 | fis-conservazione-quantita-moto | La conservazione della quantità di moto | 33 |
| 83 | fis-urti-anelastici | Gli urti anelastici | 33 |
| 84 | fis-urti-elastici | Gli urti elastici in una e in due dimensioni | 33 |
| 85 | fis-centro-massa | Il centro di massa | 33 |
| 86 | fis-cinematica-rotazionale | Velocità angolare e accelerazione angolare | 34 |
| 87 | fis-momento-inerzia | Il momento d'inerzia | 34 |
| 88 | fis-dinamica-rotazionale | Momento torcente e dinamica delle rotazioni | 34 |
| 89 | fis-energia-rotazionale | L'energia cinetica di rotazione e il rotolamento | 35 |
| 90 | fis-momento-angolare-def | Il momento angolare | 35 |
| 91 | fis-conservazione-momento-angolare | La conservazione del momento angolare | 35 |
| 92 | fis-sistemi-cosmologici | Dal sistema tolemaico al sistema copernicano | 36 |
| 93 | fis-leggi-keplero | Le leggi di Keplero | 36 |
| 94 | fis-gravitazione-universale | La legge di gravitazione universale | 36 |
| 95 | fis-campo-gravitazionale | Il campo gravitazionale | 37 |
| 96 | fis-satelliti | Il moto dei satelliti | 37 |
| 97 | fis-energia-gravitazionale | L'energia potenziale gravitazionale e la velocità di fuga | 37 |
| 98 | fis-portata-continuita | La portata e l'equazione di continuità | 38 |
| 99 | fis-bernoulli | L'equazione di Bernoulli | 38 |
| 100 | fis-torricelli-venturi | Il teorema di Torricelli e l'effetto Venturi | 38 |
| 101 | fis-viscosita | L'attrito viscoso e la velocità limite | 38 |
| 102 | fis-legge-boyle | La legge di Boyle | 39 |
| 103 | fis-leggi-gay-lussac | Le leggi di Gay-Lussac | 39 |
| 104 | fis-gas-perfetto | L'equazione di stato del gas perfetto | 39 |
| 105 | fis-teoria-cinetica | La teoria cinetica dei gas | 40 |
| 106 | fis-temperatura-microscopica | Temperatura ed energia cinetica delle molecole | 40 |
| 107 | fis-sistemi-termodinamici | Sistemi termodinamici e principio zero | 40 |
| 108 | fis-energia-interna | L'energia interna | 40 |
| 109 | fis-lavoro-termodinamico | Il lavoro in una trasformazione termodinamica | 41 |
| 110 | principi-termo | Il primo principio della termodinamica | 41 |
| 111 | fis-trasformazioni-termodinamiche | Le trasformazioni isocora, isobara e isoterma | 41 |
| 112 | fis-calori-molari | I calori molari dei gas | 42 |
| 113 | fis-trasformazione-adiabatica | La trasformazione adiabatica | 42 |
| 114 | fis-macchine-termiche | Le macchine termiche e il rendimento | 43 |
| 115 | fis-enunciati-kelvin-clausius | Gli enunciati di Kelvin e di Clausius | 43 |
| 116 | fis-ciclo-carnot | Il teorema di Carnot e il ciclo di Carnot | 43 |
| 117 | fis-frigoriferi | Frigoriferi e pompe di calore | 44 |
| 118 | fis-entropia | L'entropia | 44 |
| 119 | fis-entropia-disordine | Entropia e disordine | 44 |

Il nome di ogni file è `NN-slug.md` con questi numeri e questi slug esatti (due cifre fino a 99, tre da 100): lo
script di pubblicazione li cerca così.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto.
2. `docs/lezioni/fisica/README.md`, per intero: convenzioni di fisica, notazioni del secondo e del terzo anno,
   incertezze e cifre significative, come si disegnano le figure statiche, le interattive e le scene degli esercizi,
   le regole degli esercizi.
3. `docs/lezioni/fisica/albero.md`: il terzo anno per intero (che cosa sta nella tua lezione e che cosa in quelle
   vicine) e uno sguardo al quarto e al quinto, per non anticipare quello che ha la sua lezione più avanti.
4. `docs/lezioni/fisica/url.md` e `docs/lezioni/url.md`: gli indirizzi per i link. Si linkano le lezioni di fisica
   del biennio e del terzo anno (che si pubblica insieme), quelle di matematica fino alla 129 e quelle di chimica
   in `docs/lezioni/chimica/url.md` che hanno già un testo. Non le lezioni vuote.
5. Le lezioni del biennio su cui la tua si appoggia, in `docs/lezioni/fisica/riscritte/`, per non rispiegarle e per
   usare le stesse parole e gli stessi simboli. Per le lezioni sui gas anche `docs/lezioni/chimica/riscritte/` (31
   legge di Boyle, 32 Charles e Gay-Lussac e le vicine): la lezione di fisica non ripete quella di chimica, la
   richiama e va oltre.
6. Una lezione finita con i suoi quattro file, per la forma: `riscritte/51-leggi-newton.md` o
   `riscritte/63-energia.md` e gli omonimi in `note/`, `formulari/`, `flashcard/`; e una figura interattiva con la
   sua registrazione, per esempio `src/components/content/interactive/fisica/` con `MotoIncontro.tsx` nella
   cartella sopra.

## Che cosa sa lo studente

Ha 16 anni ed è al terzo anno. Di fisica ha fatto il biennio: misure, vettori (somma, componenti con seno e coseno),
equilibrio, fluidi fermi, ottica geometrica, cinematica, moto circolare uniforme e armonico, i tre principi, lavoro
ed energia, temperatura e calore. Di matematica ha il biennio e sta facendo il terzo anno: retta, parabola, coniche,
esponenziali e logaritmi. Non ha ancora la goniometria (quarto anno): conosce seno, coseno e tangente di un angolo
acuto nel triangolo rettangolo e i radianti dal moto circolare. Niente derivate, niente integrali, niente limiti.
Di conseguenza:

- il coseno di un angolo ottuso, dove serve (prodotto scalare, lavoro resistente), si introduce nella lezione con
  $\cos(180^\circ - \alpha) = -\cos\alpha$ e il valore dalla calcolatrice, senza la circonferenza goniometrica;
- $\sin 2\alpha$ nella gittata si scrive prima come $2\sin\alpha\cos\alpha$, e la forma compatta si dà come
  scrittura equivalente che la calcolatrice sa calcolare;
- un'area sotto una curva è un'area (rettangoli, triangoli, trapezi, quadretti contati); dove la curva non è una
  retta (isoterma, adiabatica, forza gravitazionale) il risultato si enuncia, dicendo che la dimostrazione chiede
  strumenti del quinto anno;
- il logaritmo naturale ($\ln$) compare nel lavoro dell'isoterma e nell'entropia: si usa come tasto della
  calcolatrice, con il link alla lezione di matematica sui logaritmi.

## Cosa consegnare per ogni lezione

| File | Cosa |
|---|---|
| `docs/lezioni/fisica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/fisica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, cose da verificare |
| `docs/lezioni/fisica/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/fisica/flashcard/NN-slug.md` | da 12 a 20 flashcard |
| `src/components/content/interactive/fisica/<Nome>.tsx` | le figure interattive, registrate |
| `specs/exercises/<slug>.md` | la specifica degli esercizi |
| `src/lib/exercises/v2/generators/<slug>.ts` | il generatore, `default` con `id` uguale allo slug |
| `scripts/exercises/checkers/<slug con _ al posto di ->.py` | il controllo indipendente, scritto dalla specifica |

### La lezione

- Tra 15.000 e 30.000 caratteri, più chiara del libro e non più lunga. Una lezione, un argomento: quello del
  titolo. I confini tra le tue lezioni li decidi tu e li scrivi nella nota; quelli con le lezioni di altri gruppi
  seguono i titoli dell'albero e l'elenco "Confini già fissati" qui sotto.
- Si parte da una situazione che lo studente conosce, poi la legge, poi gli esempi svolti con i numeri: almeno
  tre esempi per lezione, di difficoltà crescente, ognuno con dati, formula letterale, sostituzione con le unità e
  risultato con le cifre significative giuste. Le lezioni storiche o qualitative (92, 115, 119) hanno comunque
  esempi con un conto o un ragionamento da fare.
- Ogni conto si rifà in Python prima di consegnare, con i dati scritti come nella lezione. Una frase vera solo in
  parte è un errore: meglio dire meno e dire giusto. Le dimostrazioni che i libri del terzo anno danno si danno
  (teorema dell'impulso, velocità dopo un urto elastico in una dimensione, velocità orbitale, pressione del gas
  dalla teoria cinetica, rendimento di Carnot enunciato); le altre si enunciano, dicendolo.
- Costanti e dati tabulati (masse e raggi dei pianeti, viscosità, calori molari, densità): quelli del README dove
  ci sono, altrimenti valori correnti dei libri di testo, elencati nella nota sotto "Da verificare" con il valore
  usato. Date, nomi e fatti storici scritti a memoria vanno nello stesso elenco.
- Errori frequenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono.
- Link verso i prerequisiti e verso le lezioni vicine, solo con gli URL dei file `url.md`.

### Figure TikZ

Ogni lezione ha almeno due figure TikZ, di più dove il testo descrive una situazione (uno schema per ogni esempio
che ha una geometria, un grafico per ogni legge che lega due grandezze). Blocchi ` ```tikz ` con `% nome:` e
`% alt:`, disegnati con i pezzi della tabella del README. Vanno guardate tutte, in chiaro e in scuro:

```sh
node scripts/figure/anteprima.mjs <cartella nello scratchpad> docs/lezioni/fisica/riscritte/NN-slug.md [--scuro] [--solo nome]
```

Il PNG si legge figura per figura. node-tikzjax non disegna `pattern=`, ignora `\clip`, non conosce `\tfrac` e
`\text{}` dentro i nodi; un riempimento bianco per "cancellare" diventa una macchia nel tema scuro. Ogni figura
corrisponde al testo: frecce in scala quando la figura dà i moduli, punti sulle curve, angoli giusti. Le coordinate
si controllano con un conto. I diagrammi pressione-volume, i grafici forza-spostamento e le orbite sono grafici
come quelli di matematica: assi, griglia leggera, `plot`.

### Figure interattive

Ogni lezione ha almeno una figura interattiva, messa nel punto del testo che spiega. La figura risponde a una
domanda precisa ("che cosa succede alla gittata se l'angolo passa da 30 a 60 gradi?") e il testo subito dopo dà la
risposta, così chi non la muove non perde niente. Se una lezione non ne ha davvero bisogno lo scrivi nella nota con
il motivo, ma è un'eccezione. Tre strade, in ordine di preferenza secondo il caso:

1. Un componente tuo in `src/components/content/interactive/fisica/<Nome>.tsx`, fatto con `kit.tsx` e `fisica.tsx`
   e con i pezzi pronti elencati nel README (mai un pezzo ridisegnato a mano se il kit lo ha), richiamato nella
   lezione con un blocco ` ```interattivo ` (`% nome:` e `% alt:`). È la strada normale per moti, urti, rotazioni,
   orbite, pistoni, molecole in una scatola, cicli nel piano pressione-volume. I moti hanno la loro formula; dove
   non ce l'hanno basta un passo di integrazione scritto a mano. Niente librerie nuove.
2. Una scena della sandbox di fisica (`LessonScene`), per sistemi di masse, piani, fili e carrucole: vedi il README.
3. Un blocco ` ```grafico ` (il piano con i cursori, sintassi in `docs/lezioni/README.md`, sezione "Il piano
   cartesiano con i cursori"), dove un parametro cambia una curva e basta quello: le isoterme al variare di $T$,
   $U(r)$ al variare della massa. Sempre dopo una figura TikZ che fa da copertina e con una `domanda:`.

Ogni figura interattiva si guarda sul sito di sviluppo, in chiaro, in scuro e da telefono, ai valori iniziali e
agli estremi dei cursori, e dopo aver premuto i bottoni:

```sh
node scripts/figure/anteprima-interattivo.mjs <uscita.png> figura=<nome> --porta 3111 [--scuro] [--telefono] [--clic "button:has-text('Avvia')" --attendi 1500]
```

La lezione intera, con le figure compilate come in pubblicazione, si apre su
`http://localhost:3111/prova-grafico/lezione?file=fisica/riscritte/NN-slug.md`: guardala a 390 px con uno script
di Playwright nello scratchpad (`createRequire('/Users/alessandro/Desktop/Personal/Sapiens/package.json')('playwright')`)
e controlla che non ci siano errori di KaTeX, immagini mancanti o scorrimento laterale.

Difetti noti dei componenti comuni: `Slider` accavalla l'unità al numero se l'etichetta è lunga, `ToggleGroup` non
va a capo oltre quattro o cinque opzioni. Tienine conto nella figura, senza correggere i componenti.

### Nota, formulario, flashcard

Come in `stile.md`. La nota elenca: le scelte fatte (confini, simboli), i dubbi per Andrea in forma di domanda, le
cose da verificare con il valore usato, l'elenco delle figure interattive con la domanda a cui rispondono, l'esempio
svolto che renderebbe di più come esercizio guidato (in quali due o tre punti si fermerebbe e che cosa chiederebbe;
il blocco non esiste ancora, non scriverlo), e una riga `Prerequisiti proposti:` con al massimo quattro slug di
lezioni di fisica o di matematica senza le quali la lezione non si segue. Il formulario prende tutto dalla lezione;
le figure si copiano dalla lezione così come sono, solo se servono.

### Il generatore di esercizi

Da leggere: `scripts/exercises/README.md` (tutto, in particolare "Aggiungere un generatore"),
`src/lib/exercises/v2/types.ts`, la sezione "Esercizi" del README di fisica, due generatori di fisica del secondo
anno con specifica e controllo (per esempio `energia` e `fis-moto-proiettili`, oppure quelli più vicini al tuo
argomento: `specs/exercises/<id>.md`, `src/lib/exercises/v2/generators/<id>.ts`,
`scripts/exercises/checkers/<id con _>.py`), i moduli comuni di fisica in `src/lib/exercises/v2/` (`fis-*.ts`,
`fisica-*.ts`, `latex.ts`, `rng.ts`) e la decisione
`vault/Decisioni/2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro.md`.

- Un generatore per lezione, da 4 a 7 livelli nell'ordine della lezione, ognuno con una sola difficoltà in più.
  Stesse notazioni, stessi nomi, stessi procedimenti della lezione nei passaggi della soluzione.
- Scelta multipla, con l'unità nell'opzione e i distrattori presi dagli errori veri (quelli dei riquadri
  `ad-warning`: unità non convertite, formula rovesciata, seno al posto del coseno, segno del lavoro, kelvin e
  gradi Celsius scambiati, calore assorbito e ceduto scambiati). I numeri si costruiscono all'indietro; i
  risultati non finiscono con uno zero ambiguo. Nelle lezioni qualitative i livelli sono domande di ragionamento
  su casi generati, non definizioni da ricordare.
- Dove la figura cambia con i dati, una scena (`scene` e `solutionScene`): una scena che esiste già se va bene,
  altrimenti un file tuo in `src/components/content/exercises/scenes/`, registrato sotto il commento del tuo
  gruppo. La scena disegna i dati, non la risposta. Almeno un livello con una scena dove l'argomento ha una
  geometria (lancio, urti in due dimensioni, orbite, tubi, piano pressione-volume).
- Un modulo comune per le tue lezioni, se serve, va in un file nuovo `src/lib/exercises/v2/fis-<nome>.ts` con il
  controllo comune in `scripts/exercises/checkers/_fis_<nome>.py`; i moduli che esistono si usano senza modificarli.
- La fisica non ha livelli a risposta aperta: `open-answers.ts` non si tocca.
- Controlli, per ogni generatore:
  - `sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py` dà PASS, e lo stesso con i seed 50001 e
    777001;
  - errori piantati apposta in qualche campione (risposta cambiata, vincolo violato, opzione giusta sbagliata)
    vengono bocciati;
  - `review.mts <slug> <file html nello scratchpad>` esce con 0, e `width.mts <slug>` esce con 0;
  - `npx eslint` sui tuoi file è pulito;
  - le scene nuove guardate con `anteprima-interattivo.mjs ... scena=<tipo> 'dati={...}' --porta 3111`, in chiaro,
    in scuro e da telefono.
- Il generatore non si collega al sito: lo fa chi coordina, dal tuo rapporto.

## Controlli prima di consegnare

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/fisica/riscritte/NN-slug.md docs/lezioni/fisica/formulari/NN-slug.md docs/lezioni/fisica/flashcard/NN-slug.md
```

Senza errori per ogni lezione; gli avvisi si leggono e si spiegano nel rapporto se restano. Rileggi ogni lezione
una volta dall'inizio come la leggerebbe uno studente, cercando frasi vietate da `stile.md`, trattini lunghi,
"piuttosto che" usato come contrasto e conti sbagliati.

## Confini già fissati

- 71: prodotto scalare (con il lavoro come primo uso, $W = \vec F \cdot \vec s$, che lo studente ha già visto come
  $F s \cos\alpha$) e prodotto vettoriale (modulo, direzione con la mano destra, verso), anche per componenti nel
  piano e nello spazio. Il momento di una forza e il momento angolare come prodotti vettoriali stanno nelle
  lezioni 88 e 90, che rimandano qui.
- 72 e 75: la 72 distingue i sistemi inerziali dai non inerziali e mostra che in quelli accelerati il primo
  principio non vale (l'autobus che frena, l'ascensore); le forze apparenti con le loro formule, la centrifuga e
  Coriolis (qualitativa, con i suoi effetti sulla Terra) stanno nella 75. La 50 del biennio (primo principio) ha già il
  sistema inerziale: controlla che cosa dice.
- 73 e 74: nella 73 le trasformazioni di Galileo per posizione e velocità e la composizione delle velocità (la
  barca sul fiume del biennio è il precedente: controlla la lezione sui moti nel piano); nella 74 l'invarianza
  dell'accelerazione, delle leggi della dinamica e il principio di relatività, con la nave di Galileo.
- 76: il biennio ha già una lezione sul moto dei proiettili (56, `fis-moto-proiettili`): leggila per intero e
  parti da dove finisce, senza ripeterla. Qui il lancio con un angolo, la traiettoria, il
  tempo di volo, l'altezza massima, la gittata e l'angolo di 45 gradi, il lancio da una quota.
- 77, 78, 79: il biennio ha lavoro di una forza costante, energia potenziale della forza peso e della molla,
  conservazione e forze dissipative (lezioni 59-64). La 77 dà il lavoro come area sotto il grafico
  forza-spostamento e ricava quello della molla; la 78 definisce la forza conservativa (lavoro indipendente dal
  cammino, nullo su un cammino chiuso), lega $W = -\Delta U$ e legge i grafici dell'energia potenziale; la 79 fa
  il bilancio $W_{nc} = \Delta E$ in problemi con più tratti, attrito e molle. Non ripetere il biennio: richiamalo
  in poche righe con il link.
- 80-85: quantità di moto di un corpo e di un sistema e secondo principio nella forma $\vec F = \Delta\vec p/\Delta t$
  (80); impulso, forza media, area sotto il grafico forza-tempo (81); sistema isolato, forze interne ed esterne,
  rinculo ed esplosioni (82); urti anelastici e completamente anelastici, energia dissipata, pendolo balistico
  (83); urti elastici in una dimensione con le formule delle velocità finali e i casi particolari, e in due
  dimensioni per componenti (84); centro di massa, il suo moto, il sistema del centro di massa solo nominato (85).
- 86-91: il biennio ha l'equilibrio del corpo rigido con il momento di una forza (lezioni 22-25) e il moto
  circolare uniforme. Grandezze angolari, relazioni con le lineari e moto circolare uniformemente accelerato (86);
  momento d'inerzia di masse puntiformi e tabella dei corpi estesi, teorema di Huygens-Steiner enunciato (87);
  $M = I\alpha$, carrucola con massa, momento come prodotto vettoriale (88); energia cinetica di rotazione,
  rotolamento senza strisciamento, la gara sul piano inclinato (89); momento angolare di una particella e di un
  corpo rigido, $M = \Delta L/\Delta t$ (90); conservazione, la pattinatrice, le orbite e il legame con la seconda
  legge di Keplero solo accennato con il link (91).
- 92-97: i modelli da Tolomeo a Copernico, Tycho e Galileo, con i moti retrogradi (92); le tre leggi di Keplero con
  i conti sulla terza (93); la legge di Newton, la bilancia di Cavendish, $g$ dalla legge, massa inerziale e
  gravitazionale (94); il campo $\vec g$, la sua variazione con la quota, il campo dentro e fuori una sfera solo
  enunciato (95); velocità orbitale, periodo, satelliti geostazionari, la terza legge ricavata per le orbite
  circolari, l'assenza apparente di peso (96); $U = -G\frac{m_1 m_2}{r}$, energia totale in orbita, velocità di
  fuga, buchi neri in un riquadro (97).
- 98-101: il biennio ha i fluidi fermi (lezioni 26-31). Fluido ideale, portata e continuità (98); Bernoulli come
  conservazione dell'energia (99); Torricelli, Venturi, portanza e tubo di Pitot come applicazioni (100);
  viscosità, legge di Stokes, velocità limite, moto laminare e turbolento qualitativi (101).
- 102-106: la chimica ha già Boyle e Charles e Gay-Lussac, e la 65 la temperatura assoluta. Boyle con l'isoterma
  nel piano pressione-volume (102); le due leggi di Gay-Lussac in gradi Celsius e in kelvin, lo zero assoluto
  (103); mole, numero di Avogadro, $pV = nRT$ e $pV = N k_B T$, il gas perfetto come modello (104); il modello
  microscopico e la pressione dagli urti, $p V = \frac{1}{3} N m v_{qm}^2$ (105); l'energia cinetica media
  $\frac{3}{2} k_B T$, la velocità quadratica media, la distribuzione di Maxwell qualitativa (106).
- 107-113: sistema, ambiente, stato e variabili di stato, equilibrio, trasformazioni quasistatiche, principio zero
  (107); energia interna come funzione di stato, del gas perfetto monoatomico $U = \frac{3}{2} nRT$, esperienza di
  Joule (108); lavoro $W = p\,\Delta V$ e come area nel piano pressione-volume, dipendenza dal cammino (109); primo
  principio $\Delta U = Q - W$ con le convenzioni dei segni (110); isocora, isobara, isoterma e trasformazioni
  cicliche con $Q$, $W$ e $\Delta U$ in ciascuna (111); $C_V$ e $C_p$, relazione di Mayer, gradi di libertà e gas
  biatomici (112); adiabatica, $pV^\gamma$ costante, confronto con l'isoterma (113).
- 114-119: macchina termica, sorgenti, rendimento (114); i due enunciati e la loro equivalenza, il moto perpetuo
  di seconda specie (115); trasformazioni reversibili e irreversibili, teorema di Carnot, ciclo di Carnot e il
  suo rendimento, ciclo Otto in un riquadro (116); frigorifero, pompa di calore, coefficiente di prestazione
  (117); disuguaglianza di Clausius enunciata, entropia come funzione di stato, variazioni di entropia in casi
  semplici, entropia dell'universo (118); macrostati e microstati, equazione di Boltzmann, freccia del tempo,
  terzo principio in un riquadro (119).

## Il rapporto

Alla fine scrivi due file nella cartella `rapporti/` dello scratchpad della sessione, e nel messaggio finale solo
un riassunto di meno di 250 parole (che cosa è fatto, che cosa non è riuscito, che cosa non hai potuto controllare).

`rapporti/gruppo-NN.json`, un array con un oggetto per lezione:

```json
{
  "n": 76,
  "slug": "fis-lancio-obliquo",
  "caratteri": 21500,
  "esempi": 4,
  "tikz": 5,
  "interattive": ["lancio-obliquo-angolo"],
  "grafico": 0,
  "flashcard": 16,
  "check": "0 errori, 0 avvisi",
  "levels": [1, 2, 3, 4, 5],
  "levelNames": { "1": "Componenti della velocità iniziale", "2": "Tempo di volo" },
  "scene": ["lancio-obliquo"],
  "seed": "PASS 1, 50001, 777001",
  "prerequisiti": ["fis-moto-proiettili", "fis-composizione-moti"]
}
```

I nomi dei livelli sono nelle parole dello studente, come in `src/lib/exercises/level-names.ts`.

`rapporti/gruppo-NN.md`, con queste sezioni: "Scelte" (confini e simboli decisi), "Domande per Andrea" (per
lezione, le più pesanti, in forma di domanda), "Da verificare" (costanti, dati, fatti storici), "Figure
interattive" (nome, lezione, domanda a cui risponde, come l'hai guardata), "Pezzi del kit che mancano", "Limiti"
(esempi della lezione rimasti senza esercizio, controlli non fatti, avvisi rimasti), "File condivisi toccati" (le
righe aggiunte alle due registrazioni).
