# Brief del secondo anno di informatica (5 ottobre 2026)

Per chi scrive un gruppo di lezioni del secondo anno di informatica delle superiori (liceo scientifico, opzione
scienze applicate). Il primo anno (lezioni 1-32) è scritto e pubblicato. Del secondo anno (lezioni 33-64) sono
scritte e pubblicate cinque lezioni di programmazione: 47, 53, 57, 60, 61. Questo lotto scrive le altre 27 e
completa il biennio. Ogni gruppo di lavoro scrive un capitolo, o mezzo.

Non si pubblica nulla: niente scritture nel database, niente `publish.mts`. La pubblicazione la fa chi coordina.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione, un formulario, le flashcard. Vale tutto.
2. `docs/lezioni/informatica/README.md`: le convenzioni di informatica. La sezione "Programmazione" vale per i
   capitoli in cui si programma.
3. `docs/lezioni/informatica/programma.md`, la parte sul primo biennio e sul secondo anno: cosa chiedono le
   Indicazioni nazionali e cosa fanno i libri.
4. `docs/lezioni/informatica/albero.md`, il secondo anno: i titoli di tutte le lezioni, per sapere che cosa sta
   nella tua lezione e che cosa in quelle vicine. Una lezione, un argomento: quello del titolo.
5. `docs/lezioni/informatica/url.md`: gli indirizzi, per i link. Si possono linkare tutte le lezioni del primo e
   del secondo anno (1-64), perché il secondo anno si pubblica tutto insieme, e le lezioni di matematica di
   `docs/lezioni/url.md` che esistono.
6. Una lezione finita con i suoi quattro file, per la forma. Per i capitoli senza programmazione:
   `docs/lezioni/informatica/riscritte/22-inf-file-system.md` e gli omonimi in `note/`, `formulari/`, `flashcard/`.
   Per quelli con la programmazione: `riscritte/60-inf-ciclo-while.md` e `riscritte/47-diagrammi-flusso.md` con
   le loro note.
7. Solo per i capitoli con la programmazione: `docs/lezioni/README.md`, le sezioni "I programmi da eseguire" e
   "Il diagramma di flusso da eseguire", e le cinque lezioni già scritte del secondo anno (47, 53, 57, 60, 61),
   per non ripetere quello che spiegano e per usare le stesse parole.

## Cosa consegnare per ogni lezione

`NN` è il numero della lezione e `slug` il suo slug (te li dà chi ti affida il gruppo).

| File | Cosa |
|---|---|
| `docs/lezioni/informatica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/informatica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, fonti da verificare |
| `docs/lezioni/informatica/formulari/NN-slug.md` | il formulario |
| `docs/lezioni/informatica/flashcard/NN-slug.md` | da 12 a 20 flashcard |

I generatori di esercizi non si fanno in questo lotto.

Per le cinque lezioni già scritte ti può essere chiesto solo il formulario e le flashcard: in quel caso la lezione
e la sua nota non si toccano.

## Tutte le lezioni

- Per studenti di 15 anni. Una lezione si legge in 10-15 minuti. Le lezioni che vengono prima nell'albero ora
  esistono o stanno per esistere: quello che serve da una lezione precedente si richiama in una riga con il link,
  senza rispiegarlo.
- Ogni definizione è seguita da un esempio che lo studente riconosce (il telefono, il registro elettronico, una
  chat, un videogioco, un acquisto in rete). Le lezioni di concetto non sono elenchi di definizioni: spiegano
  perché una cosa è fatta così.
- Gli errori veri degli studenti in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono.
- I fatti si controllano. Le affermazioni storiche, le norme (GDPR, legge sul diritto d'autore, età del consenso
  digitale in Italia), i numeri che cambiano nel tempo e tutto ciò di cui non sei sicuro vanno nelle note con la
  fonte (nome e data) oppure con "da verificare". Meglio dire meno e dire giusto. Nella lezione niente numeri che
  invecchiano (quanti utenti, quanti attacchi, quale versione).
- Niente marchi nei titoli e nelle definizioni; i nomi dei prodotti solo come esempi, una volta, quando servono a
  riconoscere di cosa si parla.
- Scrittura: dai del tu; frasi di lunghezza varia, costruite con le subordinate; niente trattini lunghi, niente
  "piuttosto che", niente "è importante notare", "vediamo", "scopriamo", "in conclusione", "fondamentale",
  "cruciale", "essenziale", "semplicemente"; niente domande retoriche in apertura; niente emoji; grassetto solo
  per il termine nel punto in cui è definito.

## Lezioni senza programmazione (Internet e il web, Sicurezza e cittadinanza digitale)

- Tra 110 e 180 righe di markdown.
- Le figure si disegnano in TikZ, non si descrivono: uno schema di rete, il viaggio di una richiesta dal browser
  al server, la struttura di un URL, i passi di un attacco di phishing. Almeno una figura per lezione dove c'è
  qualcosa da mostrare. Ogni figura va guardata prima di consegnare, in chiaro e in scuro:
  `node scripts/figure/anteprima.mjs <cartella tua sotto /tmp> docs/lezioni/informatica/riscritte/NN-slug.md` e
  poi lo stesso con `--scuro`; apri i PNG e controllali uno per uno (testi sovrapposti, frecce storte, pezzi fuori
  dal disegno). Larghezza massima 9 cm.
- Le lezioni sulla sicurezza e sulla cittadinanza digitale danno regole che lo studente può applicare oggi, con il
  motivo di ognuna. Niente allarmismo e niente istruzioni che servano ad attaccare qualcuno: come si riconosce e
  come ci si difende, non come si fa.
- Indirizzi, nomi e messaggi degli esempi sono inventati e si vede: domini `esempio.it`, `scuola.example`,
  indirizzi IP degli intervalli riservati alla documentazione (`192.0.2.x`, `198.51.100.x`, `203.0.113.x`).

## Lezioni con la programmazione (Algoritmi e diagrammi di flusso, Linguaggi e primi programmi, La selezione, L'iterazione)

- La lunghezza si conta sul testo: da 40 a 80 righe di testo da leggere, più i programmi e i diagrammi. In tutto
  non più di 350 righe.
- Ogni programma è in Python e in C++, in due blocchi `codice` consecutivi, come dice il README. Fanno eccezione
  le lezioni del capitolo "Algoritmi e diagrammi di flusso" che vengono prima dei linguaggi (45, 46, 48, 49, 50):
  lì l'algoritmo è a parole, in pseudocodice o in un diagramma, e un programma compare solo dove la lezione lo
  chiede, come anticipo.
- I diagrammi di flusso sono blocchi `diagramma`, che la pagina disegna ed esegue: non si disegnano in TikZ. Ogni
  diagramma corrisponde a un programma o a un algoritmo della lezione, con gli stessi nomi e lo stesso ordine dei
  passi, e il testo dice che cosa fare con il diagramma (con quali valori eseguirlo, che cosa guardare nella
  tabella delle variabili). `% ingresso:` porta i valori che la lezione usa. Dove l'esercizio chiede di scrivere
  il programma guardando il diagramma, il blocco ha `% codice: no`. Dove ha senso, un esercizio chiede di
  costruire il diagramma, con `% modifica: sì`.
  Il linguaggio dei diagrammi ha: `leggi`, `scrivi`, assegnamento, `se` con `altrimenti`, `finché`, e le
  espressioni con `+ - * / // %`, i confronti, `E`, `O`, `NON`. Non ha funzioni, vettori, né un ciclo con il
  contatore scritto in una riga: quello che non si può scrivere così non ha un diagramma.
- Nomi delle variabili: una lettera per i contatori e per i numeri senza un significato proprio (`i`, `n`, `a`,
  `b`); un nome intero, in minuscolo e senza accenti, quando il valore è qualcosa (`spesa`, `voto`, `somma`,
  `massimo`).
- Almeno tre programmi da eseguire e almeno due esercizi con le prove (`%% prova`, `%% stampa`, `%% soluzione` nei
  due linguaggi), dal più semplice al meno semplice, in fondo, in una sezione "Prova tu". I programmi degli
  esercizi leggono senza scrivere una domanda. Nelle lezioni 45, 46, 48, 49, 50 gli esercizi sono sui diagrammi
  (da eseguire, da completare, da costruire) e i programmi con le prove sono facoltativi.
- Almeno una tabella di traccia nelle lezioni sui cicli.
- I programmi devono funzionare davvero: quelli con le prove si controllano con `verifica.mts`; gli altri si
  provano, Python con `python3` e il C++ compilandolo con `clang++` (c'è sulla macchina).
- Python e C++ si comportano in modo diverso in alcuni punti (la divisione tra interi, il resto dei numeri
  negativi, la stampa di un numero con la virgola, `True` e `true`): dove la lezione li tocca lo dice, in un
  riquadro `ad-note`; dove non servono, gli esempi li evitano.

## Formulario e flashcard

Come in `stile.md` e come nei file del primo anno. Il formulario di una lezione di programmazione raccoglie le
forme da ricordare nei due linguaggi (come si scrive una selezione, un ciclo, una lettura), in tabelle, con il
codice in linea o in blocchi di codice semplici (non blocchi `codice` da eseguire). Le flashcard chiedono di
riconoscere e di prevedere ("che cosa stampa", "quale condizione fa uscire dal ciclo"), non date né nomi.

## Verifiche, tutte da eseguire e da riportare

```sh
# formato, formule, link, stile, diagrammi: nessun errore sui tuoi file
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/informatica/riscritte/NN-*.md docs/lezioni/informatica/formulari/NN-*.md docs/lezioni/informatica/flashcard/NN-*.md
# solo con la programmazione: le soluzioni superano le prove, in Python e in C++
node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/NN-*.md
# solo con figure TikZ: in chiaro e in scuro, PNG da guardare uno per uno
node scripts/figure/anteprima.mjs <cartella tua sotto /tmp> docs/lezioni/informatica/riscritte/NN-slug.md
node scripts/figure/anteprima.mjs <cartella tua sotto /tmp> docs/lezioni/informatica/riscritte/NN-slug.md --scuro
```

Il sito in sviluppo è già acceso sulla porta 3000: la lezione si vede a
`http://localhost:3000/prova-grafico/lezione?file=informatica/riscritte/NN-slug.md`. Non avviare altri server.
Un diagramma si prova lì: eseguilo fino in fondo con i valori di `% ingresso:`.

## Regole di lavoro

- La cartella è condivisa con altre sessioni e con gli altri gruppi di questo lotto. Crea solo i file della
  tabella, per le lezioni che ti sono affidate. Non modificare file esistenti: né le lezioni già scritte, né i
  README, né `url.md`, né il codice del sito, né il vault.
- Niente comandi git che cambiano qualcosa (commit, checkout, switch, stash, reset, restore, clean, add). Niente
  `rm` su file che non hai creato tu. Niente `pkill`, `killall` o simili.
- Niente scritture nel database e niente pubblicazione.
- I file temporanei vanno in una cartella tua sotto `/tmp`, non nella repo.

## Rapporto finale

Breve e fattuale, in italiano:

1. i file creati;
2. per ogni lezione: righe, figure, programmi, esercizi con le prove, diagrammi;
3. l'esito di `check.mts` e, dove serve, di `verifica.mts`; se hai guardato le figure nei due temi e i diagrammi
   nella pagina, e che cosa hai corretto;
4. le convenzioni che hai scelto e che il README non fissava;
5. le domande per Andrea e le fonti da verificare, una riga ciascuna;
6. quello che non sei riuscito a fare o che hai lasciato a metà, detto chiaramente.
