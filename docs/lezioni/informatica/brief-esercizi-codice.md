# Brief degli esercizi con programmi scritti a mano (7 ottobre 2026)

Per chi scrive i generatori di esercizi del terzo anno di informatica: funzioni; vettori, matrici e stringhe;
ricerca e ordinamento; file; multimedia; HTML; CSS; JavaScript nella pagina.

I generatori del secondo anno scrivono ogni programma una volta, nel linguaggio dei blocchi `diagramma`, e ne
ricavano Python, C++ e uscita (`inf-programmi.ts`). Quel linguaggio non ha funzioni, vettori, stringhe né file. Dal
terzo anno un programma si scrive a mano nei due linguaggi, con il modulo `src/lib/exercises/v2/inf-codice.ts` e il
controllo `scripts/exercises/checkers/_inf_codice.py`. I due file sono comuni a tutti i gruppi e non si modificano:
se manca qualcosa, scrivilo nel tuo modulo e segnalalo nel rapporto.

Il resto vale come nel secondo anno: leggi prima `scripts/exercises/README.md` e
`docs/lezioni/informatica/brief-esercizi-secondo-anno.md` (file da consegnare, da 4 a 6 livelli, quattro opzioni,
`steps`, scrittura, regole di lavoro). Il generatore di riferimento è `inf-vettori`: tre file,
`specs/exercises/inf-vettori.md`, `src/lib/exercises/v2/generators/inf-vettori.ts`,
`scripts/exercises/checkers/inf_vettori.py`. Per i frammenti di HTML e CSS guarda `inf-css-regole`.

## Un programma è tre cose

```ts
import { program, cppProgram, pyList, cppList, reader } from '../inf-codice';

const conta = (v: number[], k: number) =>
	program(
		`
		def conta(v, k):
		    n = 0
		    for x in v:
		        if x > k:
		            n = n + 1
		    return n

		voti = ${pyList(v)}
		print(conta(voti, ${k}))
		`,
		cppProgram(
			`vector<int> voti = ${cppList(v)};\ncout << conta(voti, ${k}) << endl;`,
			`int conta(vector<int> v, int k) {\n    int n = 0;\n    for (int x : v) {\n        if (x > k) {\n            n = n + 1;\n        }\n    }\n    return n;\n}`,
			['vector']
		),
		() => [String(v.filter((x) => x > k).length)]
	);
```

`python` e `cpp` sono i due testi; `run(input, files)` è una funzione TypeScript che dice che cosa scrive il
programma, riga per riga, per le righe battute alla tastiera (`reader(input)` le dà una alla volta). Serve perché
quando l'esercizio viene generato non c'è un interprete Python. I tre devono dire la stessa cosa e il modulo non può
saperlo: lo verifica il controllo, eseguendo davvero il Python e, a richiesta, il C++. Dove il programma andrebbe
in errore, `run` lancia un'eccezione.

Un generatore scrive il programma come funzione dei suoi parametri (nomi, numeri, elementi del vettore, l'errore di
un distrattore) e ne ricava centinaia di varianti. In `inf-vettori` una sola funzione, `loopProgram`, produce
il programma giusto e i suoi errori.

## Le funzioni del modulo

| Funzione | Che cosa fa |
|---|---|
| `program(python, cpp, run)` | il programma; i due testi passano da `tidy` |
| `tidy(testo)` | toglie il rientro comune, le righe vuote intorno e gli spazi a fine riga; i tab diventano 4 spazi |
| `cppProgram(main, prima, include)` | il C++ intero: `#include <iostream>`, gli altri `include`, `using namespace std;`, quello che sta prima di `main`, `return 0;` |
| `pyList(v)`, `cppList(v)`, `quoted(s)` | `[3, 1, 4]`, `{3, 1, 4}`, `"testo"` |
| `reader(input)` | per `run`: la prossima riga battuta a ogni chiamata |
| `written(p, input, files)` | le righe che il programma scrive, oppure `null` se va in errore |
| `wrongPrograms(giusto, candidati, tests, files)` | i candidati che finiscono su ogni prova e su almeno una scrivono altro dal giusto; due che scrivono lo stesso contano una volta |
| `programOption(p, mostrato?)` | un programma come opzione; `mostrato` è la parte che si vede (solo la funzione) |
| `writtenOption(righe)` | quello che un programma scrive, su una riga con le virgole (da `inf-programmi.ts`) |
| `printedOption(righe)` | quello che un programma scrive, una riga sotto l'altra a larghezza fissa |
| `listingOption(testo, valore?)` | un frammento a larghezza fissa su una o più righe: HTML, CSS, JavaScript, JSON, CSV |
| `textOption(etichetta, valore?)` | una frase o un numero (da `inf-programmi.ts`) |
| `programAnswer(soluzione, partenza, tests)` | la risposta aperta "scrivi il programma", con le prove calcolate da `run` |
| `needing(risposta, ...costrutti)` | i costrutti che la risposta deve contenere (da `inf-programmi.ts`) |
| `reference(p, tests, altro)` | i `params` per il controllo: `program`, `tests`, `expected`, più quello che aggiungi |
| `texts(p)` | i due testi senza `run`, per `code` e `solutionCode` |
| `partOf(parte, intero)` | se `parte` è fatta di righe consecutive di `intero` |
| `drawn(famiglie, livello)` | il `build` di un livello: estrae la famiglia una volta e i numeri di nuovo, fino a trenta volte, quando il livello lancia `TooFew` |
| `pick(rng, giusta, altre)` | `choose`, che lancia `TooFew` se restano meno di tre opzioni sbagliate diverse |
| `makeCodeGenerator(id, titolo, livelli)` | il generatore: `makeGenerator` più i controlli di questo modulo |

`choose`, `shuffle`, `lines` e `BANNED` sono quelli di `inf-programmi.ts`, esportati di nuovo da `inf-codice.ts`.

Campi nuovi in `types.ts`: `ChoiceOption.listing`, `Sample.listing` e `Sample.solutionListing` (un frammento a
larghezza fissa come opzione, sotto la domanda, con la soluzione), e i costrutti `funzione` e `vettore`.

## Un esempio per ogni tipo di livello

Che cosa scrive un programma: il programma intero sotto la domanda, opzioni che sono uscite.

```ts
const shown = conta(v, k);
const rows = written(shown)!;
const others = wrongPrograms(shown, mistakes, [[]]).map((p) => written(p)!);
return {
	prompt: 'Segui la funzione un elemento alla volta.',
	problem: 'Che cosa scrive questo programma?',
	code: texts(shown),
	solution: rows.join(', '),
	steps: [...],
	answer: choose(rng, writtenOption(rows), others.map(writtenOption)),
	params: reference(shown, [[]], { ask: 'output', case: 'conta' })
};
```

Quale programma fa questo: opzioni che sono programmi. Il programma intero sta in `values` ed è quello che il
controllo esegue; con il secondo argomento l'opzione mostra solo la funzione.

```ts
const kept = wrongPrograms(right, candidates, tests);
answer: choose(rng, programOption(right, { python: defPython, cpp: defCpp }), kept.map((p) => programOption(p, shownOf(p)))),
params: reference(right, tests, { case })
```

Un frammento di HTML, CSS, JavaScript, JSON o CSV: non c'è niente da eseguire. Il frammento sotto la domanda va in
`listing`, le opzioni sono `listingOption`, e il controllo Python del generatore legge i frammenti per conto suo (in
`inf_css_regole.py`: l'HTML con `html.parser`, la regola CSS con un'espressione regolare).

```ts
return {
	prompt: 'Guarda come comincia il selettore.',
	problem: 'Quale regola CSS scrive in colore red solo il testo dell’elemento con classe nota?',
	listing: '<p>Primo</p>\n<p class="nota">Secondo</p>\n',
	solutionListing: right,
	answer: choose(rng, listingOption(right), wrong.map((text) => listingOption(text))),
	params: { case: 'regola', class: 'nota', colour: 'red' }
};
```

Scrivi il programma: risposta aperta, con la scelta multipla di programmi in `choice`.

```ts
return {
	prompt: 'Scrivi il programma.',
	problem: 'Il programma legge due voti a e b. Scrivi una funzione media(a, b) che restituisce ..., poi chiamala e scrivi il risultato. La lettura c’è già.',
	solutionCode: texts(solution),
	answer: needing(programAnswer(solution, { python: startPython, cpp: startCpp }, tests), 'funzione'),
	choice: choose(rng, programOption(solution, shown), kept.map(...)),
	params: reference(solution, tests, { case })
};
```

## Che cosa mettere in `params`

| Chiave | Contenuto |
|---|---|
| `program` | il programma di riferimento intero, `{ python, cpp }`: quello mostrato, quello dell'opzione giusta, la soluzione dell'aperta |
| `tests` | le righe battute alla tastiera, una lista di testi per ogni prova; `[[]]` se il programma non legge niente |
| `expected` | quello che `run` dice che il riferimento scrive su ogni prova, riga per riga |
| `ask` | `'output'` quando l'opzione giusta è quello che il riferimento scrive sulla prima prova |
| `files` | i file che il programma trova accanto a sé, nome e contenuto, quando ne legge |
| `case` | il caso dell'esercizio, per le quote |

Le prime tre le scrive `reference`. Un livello di solo testo o di frammenti non ha `program`. Aggiungi le chiavi
che servono al tuo controllo per ricalcolare la risposta (il vettore, il numero, la classe).

## Regole

- **Larghezze**, controllate da `check()` e dal controllo Python. Un programma o un frammento che è un'opzione ha
  righe di al più 34 caratteri; un programma sotto la domanda o con la soluzione, e un frammento sotto la
  domanda, di al più 42; il programma di partenza di una risposta aperta di al più 38. A 390 px un programma sotto
  la domanda ha 335 px utili, e a 13 px ogni carattere ne occupa 7,8: ce ne stanno 42. L'editor dà 36 px ai numeri
  di riga e gliene restano 301: ce ne stanno 38 (misurato nel browser il 7 ottobre 2026). Righe: un'opzione mostra al più 10 righe in Python e 16 in C++ (un
  frammento 10); sotto la domanda al più 18 in Python e 28 in C++ (un frammento 18). Niente tab.
- **Opzioni che sono programmi.** Con le funzioni il C++ intero è lungo: mostra solo la parte che cambia
  (`programOption(p, mostrato)`), e scrivi nella domanda che cosa si sta guardando. Tutte le opzioni di una domanda
  sono programmi, oppure nessuna.
- **Distrattori.** Prepara almeno cinque errori veri, ognuno diverso, e passa i programmi da `wrongPrograms`. Un
  distrattore non va mai in errore (un indice fuori dal vettore in C++ non ha un comportamento definito): `run`
  lancia un'eccezione e `wrongPrograms` lo scarta. Una domanda su quale programma va in errore si fa con opzioni
  di testo. Se i numeri estratti lasciano meno di tre distrattori, estrai di nuovo i numeri ma non la famiglia,
  altrimenti le quote si sbilanciano: `drawn(famiglie, livello)` lo fa, e il livello lancia `TooFew` (lo fa anche
  `pick`, che è `choose` con il controllo dei tre distrattori).
- **Prove.** Una risposta aperta ha almeno due prove, su ingressi che fanno percorrere strade diverse. Un valore
  per riga: `int(input())` in Python e `cin >>` in C++ leggono allo stesso modo solo così.
- **Costrutti.** `needing(…, 'funzione')` chiede una funzione definita e chiamata dallo studente (`main` in C++ non
  conta, e nemmeno una funzione definita e mai chiamata); `'vettore'` chiede una lista in Python, un array o un
  `vector` in C++; restano `'ciclo'`, `'selezione'`, `'while'`, `'for'`, `'annidati'`. Chi chiede un costrutto lo
  nomina nella consegna ("Scrivi una funzione …"), legge i suoi numeri e ha prove che scrivono cose diverse. Il
  programma di partenza ha un commento con `scrivi qui` nei due linguaggi e non contiene già il costrutto chiesto:
  per `funzione` la funzione la scrive lo studente per intero.
- **Che cosa si può usare** perché Python e C++ scrivano lo stesso: interi e testi; `//` in Python e `/` tra interi
  in C++ solo su numeri mai negativi; niente decimali stampati (`print(7 / 2)` e `cout << 7 / 2.0` vanno bene,
  `print(6 / 2)` scrive `3.0` e C++ scrive `3`); niente valori vero o falso stampati (`True` e `1`); niente lista
  stampata intera (`print(v)` non ha un equivalente in C++). Dove la lezione parla proprio di queste differenze il
  livello è a scelta multipla con opzioni di testo.
- **Scrittura.** Dai del tu, niente trattini lunghi, niente "piuttosto che": lo controllano `check()` e il controllo
  Python anche nelle opzioni.

## Il controllo Python

```py
from checkers._inf_codice import choice_of, common, has, reference, run_python

def check(sample):
    errors = common(sample)
    ...  # quello che è proprio dei tuoi livelli, ricalcolato qui
    return errors, sample["params"].get("case")
```

`common(sample)` esegue con Python il testo Python del riferimento su ogni prova e lo confronta con `expected`;
controlla che il programma mostrato sia il riferimento o una sua parte; con `ask: 'output'` che l'opzione giusta sia
quello che Python scrive; per le opzioni che sono programmi, che quella giusta sia il riferimento, che le altre
scrivano altro su almeno una prova e che nessuna vada in errore; per la risposta aperta, che la soluzione passi le
sue prove, che il programma di partenza non le passi già, che i costrutti chiesti siano nella soluzione e non nella
partenza (riletti da `has`, scritto di nuovo in Python) e che la consegna li nomini; poi larghezze, righe e frasi
vietate. `input()` prende le righe della prova, `open()` vede solo `params.files` e mai il disco.

Il controllo del tuo generatore aggiunge la risposta ricalcolata per conto suo (in `inf_vettori.py` il
risultato di ogni ciclo è ricalcolato dal vettore) e le `CASE_RANGES`.

Il C++ si controlla a richiesta, perché compilare è lento (circa un secondo a programma):

```sh
INF_CPP=1 INF_CPP_MAX=40 python3 scripts/exercises/verify.py
```

Con `INF_CPP=1` ogni programma distinto (riferimento, opzioni, programma di partenza) è compilato con `clang++
-std=c++17` ed eseguito sulle prove: deve scrivere quello che scrive il suo Python. `INF_CPP_MAX=N` si ferma ai
primi N programmi distinti di ogni livello. I programmi compilati restano in una cartella temporanea, per hash del
testo: una seconda passata sugli stessi semi non ricompila. `INF_CXX` cambia compilatore, `INF_CPP_CACHE` la
cartella.

## Verifiche, tutte da eseguire e da riportare

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 50001 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 777001 | python3 scripts/exercises/verify.py
# il C++: un campione più piccolo, perché ogni programma distinto si compila
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 25 all 1 | INF_CPP=1 python3 scripts/exercises/verify.py
npx tsc --noEmit -p .
npx eslint src/lib/exercises/v2/generators/<slug>.ts
```

Poi pianta qualche errore in un campione (l'opzione giusta spostata, un distrattore che scrive come il giusto,
un'uscita attesa sbagliata, la soluzione senza il costrutto chiesto, il C++ che scrive altro) e controlla che
`verify.py` lo bocci. Conta gli esercizi diversi su 1000 per livello (si conta su `params`): almeno cento.

Nel browser, a 390 px di larghezza: `/prova-grafico/esercizio?g=<slug>&l=<livello>&seed=<seed>`, con `&open=1` per la
risposta aperta, dove va consegnata una risposta giusta, una che scrive il numero sbagliato e una che scrive il
numero giusto senza il costrutto chiesto.

## Limiti

- Il C++ non si controlla se non lo chiedi: senza `INF_CPP=1` un errore nel solo testo C++ passa.
- `run` è una terza scrittura dello stesso programma. Un errore in `run` lo trova il controllo (Python scrive
  altro); un errore uguale nei tre non lo trova nessuno: per questo il controllo del generatore ricalcola la
  risposta dai dati.
- Il Python della macchina è il 3.9: `match` non si può eseguire nel controllo.
- I file: `run`, il controllo Python e quello C++ li leggono da `params.files`, ma si confronta solo quello che il
  programma scrive a schermo, non il contenuto dei file scritti. Una risposta aperta non può leggere file: la pagina
  dà al programma dello studente solo le righe battute, e `check()` lo boccia.
- `funzione` e `vettore` dicono che il costrutto c'è, non che fa il lavoro: una funzione vuota chiamata una volta
  accanto alla formula passa. Per `vettore` in Python contano una lista scritta tra quadre, `list(…)` e `.split()`;
  leggere una lettera di un testo (`nome[0]`) non conta. In C++ contano una variabile dichiarata con le quadre,
  `vector<…>` e `array<…>`. I metodi di una classe non sono visti come funzioni.
- JavaScript, HTML e CSS non si eseguono: sono frammenti di testo, e la risposta giusta la decide il controllo del
  generatore leggendoli. Non c'è una risposta aperta per HTML, CSS o JavaScript.
- Un frammento non ha colori di sintassi né l'etichetta del linguaggio: lo dice la domanda.
- Sulla scheda da stampare i frammenti escono come i programmi; non è stata guardata.
