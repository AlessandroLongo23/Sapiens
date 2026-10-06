# Brief del terzo anno di chimica (6 ottobre 2026)

Per chi scrive un gruppo di lezioni del terzo anno di chimica delle superiori (liceo scientifico). Il biennio
(file 10-47, più la 01 sulla mole) è scritto e pubblicato con esercizi, formulari e flashcard. Del terzo anno
esistono già due lezioni: `02-geometria-molecolare-vsepr` e `52-chim-orbitali-numeri-quantici`. Questo lotto scrive
le altre 33, in due fasi che lo stesso gruppo fa una dopo l'altra: prima le lezioni con note, formulari, flashcard
e figure (statiche in TikZ e interattive); poi i generatori di esercizi.

Non si pubblica nulla: niente scritture nel database, niente `publish.mts`, niente commit, niente `git stash`,
`git checkout`, `git restore` o `rm` su file non tuoi. Nella stessa cartella lavorano altri nove gruppi e altre
sessioni, e ci sono centinaia di file modificati e non committati che non sono tuoi: crei e modifichi solo i file
delle tue lezioni, elencati sotto. I file condivisi (`src/lib/exercises/index.ts`, `config.ts`, `level-names.ts`,
`v2/open-answers.ts`, `docs/lezioni/prerequisiti.md`, `url.md`, `albero.md`, `originali/index.json`, il vault) li
tocca solo chi coordina: quello che ci andrebbe scritto si riporta nel messaggio finale. Due eccezioni, sempre con
una modifica puntuale (mai riscrivendo il file intero): `src/lib/utils/interactive.ts`, dove registri le tue figure
interattive sotto il commento del tuo gruppo ("Chemistry, third year: ... (group X)"), e
`src/components/content/exercises/scenes/index.tsx`, se aggiungi un tipo di scena.

## Le lezioni e i gruppi

| N | slug | Titolo | Gruppo |
|---|---|---|---|
| 48 | chim-luce-spettri | La luce e gli spettri atomici | A |
| 49 | chim-modello-bohr | Il modello atomico di Bohr | A |
| 50 | chim-livelli-energia | Livelli e sottolivelli di energia | A |
| 51 | chim-onda-particella | Dualismo onda-particella e principio di indeterminazione | A |
| 53 | chim-configurazione-elettronica | La configurazione elettronica | B |
| 57 | gruppi-periodi | Gruppi, periodi e blocchi | B |
| 58 | chim-simboli-lewis | Elettroni di valenza e simboli di Lewis | B |
| 54 | chim-radioattivita | Radioattività e decadimenti | C |
| 55 | chim-tempo-dimezzamento | Il tempo di dimezzamento | C |
| 56 | chim-fissione-fusione | Fissione e fusione nucleare | C |
| 59 | proprieta-periodiche | Raggio atomico ed energia di ionizzazione | D |
| 60 | chim-affinita-elettronegativita | Affinità elettronica ed elettronegatività | D |
| 61 | chim-metalli-non-metalli | Metalli, non metalli e semimetalli | D |
| 62 | chim-regola-ottetto | Energia di legame e regola dell'ottetto | E |
| 63 | legame-covalente | Il legame covalente | E |
| 64 | chim-legame-covalente-polare | Legame covalente polare e legame dativo | E |
| 65 | legame-ionico | Il legame ionico | F |
| 66 | chim-legame-metallico | Il legame metallico | F |
| 67 | chim-formule-lewis | Le formule di Lewis delle molecole | F |
| 69 | chim-polarita-molecole | Molecole polari e apolari | G |
| 70 | chim-legame-valenza | Teoria del legame di valenza: legami sigma e pi greco | G |
| 71 | chim-ibridazione | L'ibridazione degli orbitali | G |
| 72 | chim-forze-dipolo-london | Forze dipolo-dipolo e forze di London | H |
| 73 | chim-legame-idrogeno | Il legame a idrogeno | H |
| 74 | chim-stato-liquido | Lo stato liquido e la tensione di vapore | H |
| 75 | chim-stato-solido | I solidi: ionici, molecolari, covalenti e metallici | H |
| 76 | numero-ossidazione | Valenza e numero di ossidazione | I |
| 77 | chim-ossidi | Ossidi basici e ossidi acidi | I |
| 78 | chim-idruri-idracidi | Idruri e idracidi | I |
| 79 | chim-idrossidi | Gli idrossidi | I |
| 80 | chim-ossiacidi | Gli ossiacidi | J |
| 81 | chim-sali-binari | I sali binari | J |
| 82 | chim-sali-ternari | I sali ternari | J |

Il nome di ogni file è `NN-slug.md`, con questi numeri e questi slug esatti: la pubblicazione li abbina per slug.
Il numero 68 non si usa: è il posto della VSEPR, che resta nel file 02.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto.
2. `docs/lezioni/chimica/README.md` (convenzioni chimiche, sezione "Il biennio" con costanti e simboli, blocchi di
   RDKit) e `docs/lezioni/fisica/README.md` (figure TikZ, figure interattive, scene negli esercizi, generatori:
   vale tutto anche qui).
3. `docs/lezioni/chimica/albero.md`, il terzo anno per intero e uno sguardo al quarto, per sapere che cosa sta
   nella tua lezione e che cosa in quelle vicine; `docs/lezioni/chimica/confronto-atzeni.md`, la riga del tuo
   capitolo: è una lista di controllo degli argomenti, non una fonte.
4. `docs/lezioni/chimica/url.md` per i link (più `docs/lezioni/url.md` per la matematica e
   `docs/lezioni/fisica/url.md` per la fisica). Si possono linkare tutte le lezioni del biennio di chimica e
   tutte quelle del terzo anno, che si pubblica insieme; non quelle del quarto e del quinto, che sono vuote. Le
   lezioni di matematica linkabili arrivano al terzo anno compreso (esponenziali e logaritmi), quelle di fisica
   al secondo anno.
5. Le lezioni su cui la tua si appoggia, per non rispiegarle e per usare le stesse parole e notazioni: in
   `docs/lezioni/chimica/riscritte/` le 39-43 (particelle dell'atomo, numero atomico e di massa, isotopi, tavola
   di Mendeleev), le 44-47 (acqua, legami a idrogeno, acidi e basi), la 52 (orbitali e numeri quantici) e la 02
   (VSEPR).
6. Una lezione finita con i suoi quattro file, per la forma: `riscritte/52-chim-orbitali-numeri-quantici.md` e gli
   omonimi in `note/`, `formulari/`, `flashcard/`; e una del biennio con figure interattive e TikZ, per esempio
   `riscritte/41-chim-thomson-rutherford.md`.

## Fase 1: cosa consegnare per ogni lezione

| File | Cosa |
|---|---|
| `docs/lezioni/chimica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/chimica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, convenzioni da confermare |
| `docs/lezioni/chimica/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/chimica/flashcard/NN-slug.md` | da 12 a 20 flashcard |
| `src/components/content/interactive/chimica/<Nome>.tsx` | le figure interattive della lezione |

### La lezione

- Per studenti di 16 anni, al terzo anno. La lezione resta più chiara del libro, non più lunga: tra 12.000 e
  25.000 caratteri.
- Una lezione, un argomento: quello del titolo. I confini tra le lezioni del tuo gruppo li decidi tu e li scrivi
  nella nota; quelli con le lezioni di altri gruppi sono fissati qui sotto, e dove tacciono seguono i titoli
  dell'albero. Quando serve un argomento di un'altra lezione, lo si richiama in una frase con il link.
- Ogni numero degli esempi svolti si rifà con uno script Python prima di consegnare (lo script resta nello
  scratchpad, non nel repo). I dati degli elementi (elettronegatività di Pauling, raggi, energie di ionizzazione,
  affinità elettronica, configurazioni, numeri di ossidazione, isotopi) si prendono da
  `src/lib/tools/elementi.json`, il file della tavola periodica del sito, così lezione e strumento dicono la
  stessa cosa; se un dato lì manca o ti sembra sbagliato lo scrivi nella nota. Le masse atomiche hanno due
  decimali e vengono dalla tavola della lezione 01.
- Una affermazione vera solo in parte è un errore: meglio dire meno e dire giusto. Le eccezioni che ogni libro
  nomina (cromo e rame nella configurazione, i limiti dell'ottetto, le anomalie dell'energia di ionizzazione tra
  i gruppi 2 e 13 e tra 15 e 16) si dicono; i modelli si presentano come modelli, con il loro limite.
- Date, nomi e fatti storici scritti a memoria si segnano "da verificare" nella nota.
- Errori frequenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono.
- Gli strumenti del sito si richiamano con un link dove aiutano: la
  [tavola periodica](/strumenti/tavola-periodica) (anche su un elemento: `/strumenti/tavola-periodica?elemento=Cl`)
  e gli [orbitali atomici](/strumenti/orbitali-atomici), che ha la tabella dei sottolivelli con la configurazione
  di ogni elemento. Un blocco per montare la tavola dentro la lezione non esiste: non inventarlo.
- L'esercizio guidato (decisione del 6 ottobre 2026) non ha ancora il suo blocco: non scriverlo. Nella nota indica
  quale esempio svolto della lezione renderebbe di più come esercizio guidato e in quali due o tre punti si
  fermerebbe.

### Costanti e simboli del terzo anno

Oltre a quelli della sezione "Il biennio" del README:

- velocità della luce $c = 3{,}00 \cdot 10^8\,\text{m/s}$; costante di Planck $h = 6{,}63 \cdot 10^{-34}\,\text{J}\cdot\text{s}$;
  lunghezza d'onda $\lambda$ (in nm per la luce visibile, da $400$ a $700\,\text{nm}$), frequenza $\nu$ in Hz,
  $c = \lambda\,\nu$, $E = h\,\nu$;
- livelli dell'idrogeno $E_n = -\dfrac{2{,}18 \cdot 10^{-18}\,\text{J}}{n^2}$; l'elettronvolt si può nominare
  ($1\,\text{eV} = 1{,}60 \cdot 10^{-19}\,\text{J}$), ma i conti sono in joule;
- energie di ionizzazione e di legame in $\text{kJ/mol}$; raggi atomici e lunghezze di legame in pm;
- numeri quantici $n$, $l$, $m_l$, $m_s$ e nomi dei sottolivelli come nella lezione 52; configurazione scritta
  $1s^2\,2s^2\,2p^6$, con il gas nobile tra parentesi quadre nella forma abbreviata, $[\text{Ne}]\,3s^1$;
- isotopi $^{14}_{\ 6}\text{C}$ come nella lezione 42 (KaTeX non ha `\prescript`); particelle $\alpha$ o
  $^4_2\text{He}$, $\beta^-$ o $^{\ 0}_{-1}e$, $\beta^+$, $\gamma$; tempo di dimezzamento $t_{1/2}$; attività in
  becquerel;
- gruppi numerati da 1 a 18, con la numerazione tradizionale (IA-VIIIA) tra parentesi la prima volta che una
  lezione li usa;
- elettronegatività $\chi$ sulla scala di Pauling, differenza $\Delta\chi$; soglie del tipo di legame: sotto
  $0{,}4$ covalente puro, tra $0{,}4$ e $1{,}9$ covalente polare, sopra $1{,}9$ ionico, dette come regola
  pratica con le sue eccezioni (da confermare con Andrea: va tra i dubbi);
- cariche parziali $\delta^+$ e $\delta^-$; momento dipolare $\mu$, con la freccia che punta verso l'atomo più
  elettronegativo, come nella lezione 02 (controlla come lo disegna e fai uguale);
- numero di ossidazione scritto con il segno davanti, $+2$, $-1$; nelle formule gli ioni $\mathrm{Fe^{3+}}$;
- nomenclatura: per ogni composto i tre nomi, sempre in quest'ordine e con queste parole: nome tradizionale
  (ossido ferrico, anidride solforica, acido solforico, solfato di sodio), notazione di Stock (ossido di
  ferro(III)), nome IUPAC (triossido di diferro; per gli ossiacidi e i loro sali la forma del Valitutti, acido
  tetraossosolforico(VI), tetraossosolfato(VI) di disodio). Nelle tabelle le colonne sono Formula, Tradizionale,
  Stock, IUPAC. Nella formula il metallo sta a sinistra; gli idruri covalenti con nome proprio ($\mathrm{NH_3}$,
  $\mathrm{CH_4}$, $\mathrm{H_2O}$) tengono la formula d'uso.

### Confini già fissati

- 48: natura ondulatoria della luce, spettro elettromagnetico, quanti di Planck e fotoni, effetto fotoelettrico
  in breve, spettri continui e a righe, di emissione e di assorbimento. Il perché delle righe è nella 49.
- 49: postulati di Bohr, orbite e livelli dell'idrogeno, salti e righe (serie di Lyman, Balmer, Paschen), stato
  fondamentale ed eccitato, limiti del modello.
- 50: le energie di ionizzazione successive come prova dei livelli e dei sottolivelli, capienza dei livelli
  ($2n^2$) e dei sottolivelli $s$, $p$, $d$, $f$, ordine di energia. La forma degli orbitali è nella 52, il
  riempimento elettrone per elettrone nella 53.
- 51: de Broglie, $\lambda = \dfrac{h}{m\,v}$, la diffrazione degli elettroni, il principio di indeterminazione
  di Heisenberg, dall'orbita all'orbitale come regione di probabilità (che la 52 sviluppa).
- 53: principio di Aufbau, principio di esclusione di Pauli, regola di Hund, regola della diagonale, diagrammi a
  caselle, configurazione abbreviata, eccezioni di cromo e rame, configurazione degli ioni.
- 54: stabilità del nucleo, decadimenti $\alpha$, $\beta^-$, $\beta^+$ e cattura elettronica, emissione $\gamma$,
  equazioni nucleari bilanciate su $A$ e $Z$, potere penetrante, famiglie radioattive in breve. 55: legge del
  decadimento con il tempo di dimezzamento, attività, datazione con il carbonio 14; con tempi che non sono
  multipli interi di $t_{1/2}$ si usano esponenziali e logaritmi della matematica del terzo anno, con il link.
  56: difetto di massa, $E = m\,c^2$, energia di legame per nucleone, fissione e reazione a catena, fusione,
  centrali e stelle.
- 57: legge periodica moderna (ordinata per $Z$), gruppi e periodi, blocchi $s$, $p$, $d$, $f$, dalla
  configurazione alla posizione e ritorno. La storia di Mendeleev è nella 43. 58: elettroni di valenza, simboli
  di Lewis degli atomi, ioni dei gruppi principali. Le formule di Lewis delle molecole sono nella 67.
- 59: carica nucleare efficace, raggio atomico e raggio ionico, energia di prima ionizzazione e successive, con
  gli andamenti. 60: affinità elettronica ed elettronegatività, con gli andamenti; il tipo di legame da
  $\Delta\chi$ è nella 64. 61: proprietà di metalli, non metalli e semimetalli, carattere metallico, le famiglie
  (metalli alcalini, alcalino-terrosi, di transizione, alogeni, gas nobili).
- 62: perché gli atomi si legano, curva dell'energia in funzione della distanza, energia e lunghezza di legame,
  regola dell'ottetto e gas nobili. 63: legame covalente puro, singolo, doppio e triplo, ordine, lunghezza ed
  energia; formule di Lewis solo delle molecole biatomiche e di poche altre semplici. 64: legame covalente polare,
  $\Delta\chi$ e tipo di legame, cariche parziali, legame dativo ($\mathrm{NH_4^+}$, $\mathrm{H_3O^+}$).
- 65: trasferimento di elettroni, ioni, reticolo cristallino e unità formula, energia reticolare, proprietà dei
  composti ionici, la formula dai due ioni. 66: modello del mare di elettroni, proprietà dei metalli spiegate dal
  modello, leghe. 67: il procedimento per la formula di Lewis di una molecola e di uno ione poliatomico,
  risonanza, eccezioni all'ottetto; molecole: quelle della riga 4 di `confronto-atzeni.md`, che sono le stesse
  della 02 e della 69.
- 69: momento dipolare di una molecola come somma di vettori, molecole simmetriche e no, conseguenze (solubilità,
  bacchetta elettrizzata). La 02 chiude già con un paragrafo sulla polarità: la 69 lo sviluppa, senza
  contraddirlo. 70: sovrapposizione degli orbitali, legami $\sigma$ e $\pi$, legami singoli, doppi e tripli.
  71: ibridazione $sp^3$, $sp^2$, $sp$ con metano, etene, etino, acqua e ammoniaca. La teoria degli orbitali
  molecolari è fuori.
- 72: forze dipolo-dipolo, forze di London e polarizzabilità, forze ione-dipolo, effetto sui punti di
  ebollizione. 73: legame a idrogeno, condizioni, punti di ebollizione anomali, ghiaccio, molecole biologiche;
  le lezioni 44 e 45 lo hanno già per l'acqua. 74: viscosità, tensione superficiale, capillarità, evaporazione,
  tensione di vapore ed ebollizione; i passaggi di stato sono nella 19. 75: solidi cristallini e amorfi, i
  quattro tipi di cristalli e le loro proprietà, cella elementare in breve, forme allotropiche del carbonio.
- 76: valenza, numero di ossidazione e le sue regole, calcolo in composti e ioni; le tre nomenclature presentate
  una volta per tutte (prefissi, suffissi -oso e -ico, ipo- e per-). 77: ossidi basici e ossidi acidi (anidridi),
  perossidi in breve. 78: idruri metallici e covalenti, idracidi. 79: idrossidi. 80: ossiacidi, compresi i
  prefissi meta-, piro-, orto-. 81: sali binari; gli ioni (cationi, anioni degli idracidi) si presentano qui.
  82: sali ternari, anioni poliatomici, sali acidi, sali idrati. Ogni lezione di nomenclatura lavora nei due
  sensi, dalla formula al nome e dal nome alla formula. Le reazioni che formano i composti (ossido più acqua,
  acido più base) si nominano come schema, senza stechiometria: il bilanciamento è al quarto anno.

### Figure statiche

- TikZ, con `% nome:` e `% alt:`. Il nome è unico in tutte le lezioni di chimica: comincia con una parola della
  lezione. Vanno guardate tutte, in chiaro e in scuro:
  `node scripts/figure/anteprima.mjs <cartella nello scratchpad> docs/lezioni/chimica/riscritte/NN-slug.md`
  (`--scuro`, `--solo nome`). node-tikzjax non disegna `pattern=`, ignora `\clip`, non conosce `\tfrac` e fallisce
  con `\text{}` dentro un nodo; un riempimento bianco diventa una macchia nel tema scuro.
- Cosa si disegna in TikZ: spettri e onde, livelli di energia e salti, diagrammi a caselle, la regola della
  diagonale, schemi della tavola periodica con gli andamenti, simboli e formule di Lewis (punti e trattini messi
  a mano con le coordinate), reticoli, vettori dei dipoli, sovrapposizioni di orbitali, curve (energia-distanza,
  decadimento, tensione di vapore, punti di ebollizione), schemi di classificazione dei composti. I colori della
  luce si invertono nel tema scuro: per uno spettro a colori veri usa una figura interattiva, che li disegna
  fuori dall'inversione, e in TikZ indica le righe con la lunghezza d'onda.
- Le molecole intere si disegnano con i blocchi di RDKit (` ```molecola `, ` ```molecole `, ` ```molecola3d `)
  quando serve la struttura; RDKit non disegna le coppie solitarie, quindi le formule di Lewis sono TikZ. Per
  compilarle: `scripts/chimica/.venv/bin/python scripts/chimica/figure.py <file.md>`, poi `anteprima.mjs` di
  `scripts/chimica/`.
- Un grafico con un parametro da muovere può essere un blocco ` ```grafico ` (il piano con i cursori; sintassi in
  `docs/lezioni/README.md`, esempio in `riscritte/31-chim-legge-boyle.md`): sempre dopo una figura TikZ che fa da
  copertina e sempre con una `domanda:` che ha una risposta precisa, data dal testo subito dopo.

### Figure interattive

Alessandro le ha chieste espressamente: ogni lezione ne ha almeno una, salvo che non ci sia davvero niente da
muovere (e allora la nota dice perché), e non più di tre. Una figura interattiva risponde a un "che cosa succede
se": lo studente muove, sceglie o costruisce qualcosa e legge una conseguenza. Una animazione che si guarda e
basta non conta.

- Un blocco ` ```interattivo ` con `% nome:` e `% alt:`, un file per figura in
  `src/components/content/interactive/chimica/`, fatto con `kit.tsx` e con i pezzi che la cartella ha già
  (`orbitali.tsx`, `sfereDalton.tsx`, `particelle-materia.ts`, `gas.tsx`, `acqua.tsx`, `vetreria.tsx`): leggili
  prima di disegnare a mano. Si registra in `FIGURES` di `src/lib/utils/interactive.ts` sotto il commento del
  tuo gruppo. Il nome del file `.tsx` comincia con una parola della tua lezione, per non scontrarsi con gli
  altri gruppi; un modulo di pezzi comuni del tuo gruppo si chiama `chim3-<lettera del gruppo>-<nome>.tsx`.
- Ogni figura interattiva ha subito prima, nella stessa sezione, una figura TikZ o una frase che la presenta, e
  il testo dopo dice che cosa si doveva vedere: chi non la tocca non perde niente.
- Si guarda con il sito in sviluppo, già acceso (non avviarne un altro, non riavviarlo). La porta cambia: il 6
  ottobre 2026 era la 3131, e sulla 3000 girava un altro progetto; controlla quale risponde a `/prova-fisica` e
  passala con `--porta`:
  `node scripts/figure/anteprima-interattivo.mjs <png nello scratchpad> figura=<nome> [--scuro] [--telefono] [--clic "..." --attendi 1500]`.
  Con la macchina carica lo script va in timeout, perché aspetta che la rete sia ferma: tre gruppi hanno usato
  una copia nello scratchpad che aspetta l'`<svg>` della figura.
  Ogni figura va vista in chiaro, in scuro e da telefono (390 px), ai valori iniziali e dopo aver mosso i
  comandi, e lo screenshot va letto. Niente scorrimento laterale sul telefono (`ToggleGroup` con etichette lunghe
  lo provoca). I colori che hanno un significato chimico si disegnano fuori dall'inversione del tema scuro o non
  portano informazione da soli.
- Idee da cui partire, da cambiare se trovi di meglio: 48 lo spettro con il cursore della lunghezza d'onda che dà
  frequenza, energia del fotone e colore, e lo spettro a righe di un elemento a scelta; 49 i livelli
  dell'idrogeno con il salto da scegliere e la riga che compare; 50 le energie di ionizzazione successive di un
  elemento a scelta, con i salti; 51 la lunghezza d'onda di de Broglie al variare di massa e velocità; 53 il
  diagramma a caselle da riempire, che segnala le violazioni di Pauli e di Hund; 57 dalla configurazione alla
  casella della tavola; 58 i simboli di Lewis dal gruppo; 54 la carta dei nuclidi con il decadimento che sposta
  il nucleo; 55 un campione di nuclei che decadono a caso con la curva accanto; 56 l'energia di legame per
  nucleone con fissione e fusione; 59 e 60 gli andamenti lungo un periodo o un gruppo a scelta; 61 la scala del
  carattere metallico; 62 due atomi che si avvicinano sulla curva dell'energia; 63 gli elettroni condivisi da
  costruire; 64 due atomi a scelta, $\Delta\chi$ e il tipo di legame con la nube che si sposta; 65 il reticolo e
  la formula dai due ioni; 66 il mare di elettroni con il campo elettrico e con il colpo di martello a confronto
  con un cristallo ionico; 67 la formula di Lewis da costruire con il conto degli elettroni; 69 i dipoli di
  legame da sommare con la geometria che cambia; 70 la sovrapposizione che dà $\sigma$ o $\pi$; 71 gli orbitali
  che si mescolano; 72 il punto di ebollizione al variare della molecola; 73 chi fa legami a idrogeno con chi;
  74 la tensione di vapore con la temperatura e la pressione esterna; 75 il tipo di solido dalle proprietà; 76 il
  numero di ossidazione da calcolare atomo per atomo; 77-82 il composto da costruire (elemento e numero di
  ossidazione a scelta) con formula e tre nomi.

### Note, formulario, flashcard

Come in `stile.md`. La nota elenca: le scelte fatte (confini, convenzioni), i dubbi per Andrea in forma di
domanda, le cose da verificare, le figure interattive con il loro nome, l'esempio per l'esercizio guidato, e una
riga `Prerequisiti proposti:` con al massimo quattro slug di lezioni di chimica senza le quali la lezione non si
segue. Il formulario prende tutto dalla lezione; le figure si copiano dalla lezione così come sono, solo se
servono. Le flashcard non hanno figure.

### Controlli prima di passare alla fase 2

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/chimica/riscritte/NN-slug.md docs/lezioni/chimica/formulari/NN-slug.md docs/lezioni/chimica/flashcard/NN-slug.md
```

Deve uscire senza errori per ogni lezione; gli avvisi si leggono e si spiegano nel messaggio finale se restano.
`npx eslint` sui tuoi file `.tsx` è pulito, e `npx tsc --noEmit -p .` non ha errori nei tuoi file (gira su tutto
il progetto mentre altri scrivono: guarda solo i tuoi). Rileggi ogni lezione una volta dall'inizio come la
leggerebbe uno studente, cercando frasi vietate da `stile.md`, trattini lunghi, "piuttosto che" e conti sbagliati.

## Fase 2: i generatori di esercizi

Un generatore per lezione, con id uguale allo slug, subito dopo la fase 1.

Da leggere: `scripts/exercises/README.md` (tutto, in particolare "Aggiungere un generatore"),
`src/lib/exercises/v2/types.ts`, due generatori di chimica con specifica e controllo
(`chim-orbitali-numeri-quantici` e `chim-tavola-mendeleev`: `specs/exercises/<id>.md`,
`src/lib/exercises/v2/generators/<id>.ts`, `scripts/exercises/checkers/<id con _>.py`), i moduli comuni di
`src/lib/exercises/v2/`, l'intestazione di `src/lib/exercises/v2/open-answers.ts` e la decisione
`vault/Decisioni/2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro.md`.

Per ogni lezione tre file nuovi:

| File | Cosa |
|---|---|
| `specs/exercises/<slug>.md` | la specifica: livelli, vincoli, due esempi per livello, esercizi da evitare, distrattori |
| `src/lib/exercises/v2/generators/<slug>.ts` | il generatore, `default` con `id` uguale allo slug |
| `scripts/exercises/checkers/<slug con _ al posto di ->.py` | il controllo indipendente, scritto dalla specifica |

- Da 4 a 6 livelli nell'ordine della lezione, ognuno con una sola difficoltà in più. Gli esercizi seguono la
  lezione: stesse notazioni, stessi nomi, stessi procedimenti nei passaggi della soluzione, stessi dati
  (`elementi.json`, masse della lezione 01).
- Ogni esercizio ha la forma a scelta multipla, con distrattori presi dagli errori veri degli studenti (quelli
  dei riquadri `ad-warning`). Le risposte con unità restano a scelta multipla, con l'unità nell'opzione. Dove la
  risposta è un numero puro (un numero di ossidazione, un numero di elettroni, un numero di tempi di
  dimezzamento) il livello può andare anche a risposta aperta: lo proponi tu, con la classificazione secondo
  l'intestazione di `open-answers.ts`. Formule chimiche e nomi dei composti restano a scelta multipla.
- Nomenclatura: livelli nei due sensi (formula → nome, nome → formula), con le tre nomenclature; i distrattori
  sono gli errori veri (suffisso -oso e -ico scambiati, pedici non semplificati, numero di ossidazione sbagliato,
  -ito e -ato scambiati, -uro al posto di -ato).
- Una figura che cambia con i dati è una scena (`scene`), disegnata con i pezzi del kit; la scena non dà la
  risposta. Guarda prima se un tipo di scena che esiste fa al caso tuo.
- Un modulo comune per il tuo gruppo, se serve, va in un file nuovo `src/lib/exercises/v2/chim3-<lettera>.ts`,
  con il controllo comune in `scripts/exercises/checkers/_chim3_<lettera>.py`. I moduli comuni che esistono si
  usano senza modificarli. Nel biennio due gruppi hanno scelto lo stesso nome e uno ha sovrascritto il file
  dell'altro: la lettera del gruppo nel nome serve a questo.
- Controlli, per ogni generatore:
  - `sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py` dà PASS, e lo stesso con i seed 50001 e
    777001;
  - errori piantati apposta in qualche campione (risposta cambiata, vincolo violato, distrattore uguale alla
    risposta) vengono bocciati;
  - `review.mts <slug> <file html nello scratchpad>` esce con 0;
  - `width.mts <slug>` esce con 0;
  - `npx eslint` sui tuoi file è pulito; `npx tsc --noEmit -p .`: guarda solo gli errori nei tuoi file.
- Non collegare il generatore al sito.

## Messaggio finale

Per ogni lezione: caratteri, numero di esempi svolti, figure TikZ, figure interattive (nome e che cosa fa),
blocchi `grafico`, flashcard; esito di `check.mts`; i prerequisiti proposti. Per ogni generatore, in tre blocchi
pronti da incollare: i livelli offerti (`levels: [1, 2, ...]`), i nomi dei livelli nelle parole dello studente
come in `src/lib/exercises/level-names.ts`, e la riga di `open-answers.ts`; poi l'esito dei controlli con i tre
seed. In fondo: le cinque domande più pesanti per Andrea su tutto il gruppo, i fatti da verificare, i limiti
noti, quello che non hai potuto controllare, e l'elenco completo dei file creati o modificati.
