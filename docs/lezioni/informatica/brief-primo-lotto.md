# Brief del primo lotto di informatica (3 ottobre 2026)

Per chi scrive un gruppo di lezioni del primo anno di informatica delle superiori (liceo scientifico, opzione
scienze applicate). Il lotto è di 32 lezioni in 7 capitoli; ogni gruppo di lavoro ne scrive uno. Le lezioni si
consegnano complete: testo, note, formulario, flashcard ed esercizi.

Non si pubblica nulla: niente scritture nel database, niente `publish.mts`, niente deploy. La pubblicazione la
decide Alessandro.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto.
2. `docs/lezioni/informatica/README.md`: le convenzioni di informatica (basi, unità, parole, foglio di calcolo,
   figure). Valgono per tutti i gruppi: se una convenzione manca, sceglila, usala in modo coerente e scrivila
   nel rapporto finale.
3. `docs/lezioni/informatica/programma.md`: cosa chiedono le Indicazioni nazionali per il primo biennio e cosa
   fanno i libri; la parte "Primo anno" della proposta.
4. `docs/lezioni/informatica/url.md`: gli indirizzi delle lezioni, per i link. Si linkano solo le lezioni del primo
   anno (le prime 32) e le lezioni di matematica di `docs/lezioni/url.md` che esistono davvero.
5. Un esempio completo di lezione di un'altra materia, per il formato dei quattro file:
   `docs/lezioni/fisica/riscritte/01-fis-metodo-sperimentale.md`, e gli omonimi in `formulari/`, `flashcard/`,
   `note/`.
6. `scripts/exercises/README.md`: la pipeline dei generatori di esercizi.
7. Un generatore di concetto con la sua specifica e il suo controllo: `specs/exercises/fis-metodo-sperimentale.md`,
   `src/lib/exercises/v2/generators/fis-metodo-sperimentale.ts`,
   `scripts/exercises/checkers/fis_metodo_sperimentale.py`. E uno di conto:
   `specs/exercises/numeri-naturali-potenze.md` con generatore e controllo omonimi. I tipi sono in
   `src/lib/exercises/v2/types.ts`.

## Cosa consegnare per ogni lezione

`NN` è il numero a due cifre della lezione e `slug` il suo slug nel database (te li dà chi ti affida il gruppo).

| File | Cosa |
|---|---|
| `docs/lezioni/informatica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/informatica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, fonti da verificare |
| `docs/lezioni/informatica/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/informatica/flashcard/NN-slug.md` | da 12 a 20 flashcard |
| `specs/exercises/slug.md` | la specifica del generatore |
| `src/lib/exercises/v2/generators/slug.ts` | il generatore (id = slug) |
| `scripts/exercises/checkers/slug_con_underscore.py` | il controllo indipendente in Python |

## La lezione

- Per studenti di 14 anni, al primo incontro con la materia. Si legge in 10-15 minuti: di solito tra 110 e 180
  righe di markdown. Una lezione, un argomento: quello del titolo.
- Ogni definizione è seguita da un esempio; ogni procedimento (una conversione di base, il complemento a due, il
  calcolo della dimensione di un file, una formula del foglio) ha i passi numerati e almeno tre esempi svolti nei
  riquadri `ad-example`, dal più semplice al meno semplice, compresi i casi scomodi.
- Gli errori veri degli studenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono.
- Le figure si disegnano in TikZ, non si descrivono. Ogni figura va guardata prima di consegnare, in chiaro e in
  scuro: `node scripts/figure/anteprima.mjs <cartella> docs/lezioni/informatica/riscritte/NN-slug.md` e poi lo
  stesso con `--scuro`; apri i PNG e controllali uno per uno (testi che si sovrappongono, frecce storte, pezzi
  fuori dal disegno).
- Le lezioni di concetto non sono elenchi di definizioni: spiegano perché una cosa è fatta così, con esempi che
  uno studente riconosce (il telefono, il registro elettronico, un videogioco, una foto).
- I fatti si controllano. Ogni conto degli esempi va rifatto con Python. Le affermazioni storiche, i numeri che
  cambiano nel tempo e tutto ciò di cui non sei sicuro vanno nelle note con la fonte (nome e data) oppure con "da
  verificare". Meglio dire meno e dire giusto.
- Scrittura: dai del tu; frasi di lunghezza varia, costruite con le subordinate; niente trattini lunghi, niente
  "piuttosto che", niente "è importante notare", "vediamo", "scopriamo", "in conclusione", "fondamentale",
  "cruciale", "essenziale", "semplicemente"; niente domande retoriche in apertura; niente emoji; grassetto solo per
  il termine nel punto in cui è definito.

## Gli esercizi

Un generatore per lezione, come dice `scripts/exercises/README.md`: livelli nell'ordine della lezione, ognuno con
una sola difficoltà in più (da 4 a 6 livelli); costruzione all'indietro; `check()` con i vincoli della specifica;
sempre una forma a scelta multipla con quattro opzioni e distrattori presi dagli errori veri; i passaggi della
soluzione in italiano. Le risposte che sono stringhe di cifre in un'altra base, formule o parole sono `choice`.

Per le lezioni di concetto le domande si compongono da pezzi intercambiabili (situazioni, oggetti, affermazioni),
così che ogni livello abbia almeno un centinaio di esercizi diversi; il controllo Python ricostruisce la risposta
dai pezzi, non dal testo. Niente domande di pura memoria su date o nomi.

Verifiche, tutte da eseguire e da riportare:

```sh
# 1000 esercizi per livello con tre seed: devono dare PASS
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 1 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 50001 | python3 scripts/exercises/verify.py
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts <slug> 1000 all 777001 | python3 scripts/exercises/verify.py
# il LaTeX passa da KaTeX, e la pagina si guarda
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/review.mts <slug> <file.html>
# larghezze sul telefono
node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/width.mts <slug>
```

Poi pianta apposta qualche errore in un campione (risposta cambiata, vincolo violato, opzione giusta sbagliata) e
controlla che `verify.py` lo bocci. Conta quanti esercizi diversi escono su 1000 per ogni livello e riportalo.

Controlli finali sui testi e sul codice:

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/informatica/riscritte/NN-*.md docs/lezioni/informatica/formulari/NN-*.md docs/lezioni/informatica/flashcard/NN-*.md
npx tsc --noEmit -p .
npx eslint src/lib/exercises/v2/generators/<slug>.ts
```

`check.mts` non deve dare errori sui tuoi file; `tsc` non deve dare errori nei tuoi file (errori in file di altri
non sono tuoi: segnalali e basta).

## Regole di lavoro

- La cartella di lavoro è condivisa con altre sessioni che stanno scrivendo altro. Crea solo file nuovi, nei
  percorsi della tabella qui sopra, più eventuali moduli di aiuto con il prefisso che ti viene assegnato. Non
  modificare file esistenti: in particolare non toccare `src/lib/exercises/index.ts`, `config.ts`,
  `level-names.ts`, `v2/open-answers.ts`, `v2/registry.ts`, `scripts/lezioni/check.mts`, i README, il vault. Il
  collegamento al sito lo fa chi coordina.
- Niente comandi git che cambiano qualcosa (commit, checkout, switch, stash, reset, restore, clean, add). Niente
  `rm` su file che non hai creato tu.
- Niente `pkill`, `killall` o simili: fermerebbero le verifiche degli altri gruppi. Non avviare server di sviluppo.
- Niente scritture nel database e niente pubblicazione.
- I file temporanei (pagine di revisione, anteprime delle figure, script di controllo dei conti) vanno in una
  cartella tua sotto `/tmp`, non nella repo.

## Rapporto finale

Breve e fattuale, in italiano:

1. i file creati;
2. per ogni generatore: i livelli con un nome di poche parole ciascuno, nella lingua dello studente (servono per
   `level-names.ts`, vedi gli esempi in quel file), l'esito delle tre verifiche, quanti esercizi diversi su 1000
   per livello, se `review.mts` e `width.mts` escono con 0;
3. l'esito di `check.mts`, `tsc`, ESLint;
4. le convenzioni che hai scelto e che il README non fissava;
5. le domande per Andrea e le fonti da verificare, una riga ciascuna;
6. quello che non sei riuscito a fare o che hai lasciato a metà, detto chiaramente.
