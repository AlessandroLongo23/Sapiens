# Brief delle prime lezioni di programmazione (5 ottobre 2026)

Per chi scrive una lezione del secondo anno di informatica delle superiori in cui si programma: i capitoli
"Algoritmi e diagrammi di flusso", "Linguaggi e primi programmi", "La selezione", "L'iterazione". Alessandro ha
chiesto di vedere alcune lezioni sulle basi (variabili, selezione, cicli) che usino l'editor di codice per gli
esempi e i diagrammi di flusso. Non si pubblica nulla.

## Da leggere prima di scrivere, in quest'ordine

1. `docs/lezioni/stile.md`: come si scrive una lezione. Vale tutto.
2. `docs/lezioni/informatica/README.md`: le convenzioni di informatica, e soprattutto la sezione "Programmazione"
   (linguaggi, esercizi, il modello dei diagrammi di flusso in TikZ, da copiare).
3. `docs/lezioni/README.md`, sezione "I programmi da eseguire": il formato dei blocchi `codice` (linguaggi in
   blocchi consecutivi, `%% soluzione`, `%% prova`, `%% stampa`).
4. `docs/lezioni/prove/codice.md`: esempi di blocchi che funzionano.
5. Una lezione del primo anno per il tono e la forma: `docs/lezioni/informatica/riscritte/04-*.md`, con la sua
   nota in `note/`.
6. `docs/lezioni/informatica/url.md`: gli indirizzi, per i link. Si linkano solo le lezioni del primo anno (le
   prime 32) e le lezioni di matematica di `docs/lezioni/url.md` che esistono; le altre lezioni di
   programmazione non sono ancora scritte, quindi si nominano senza link.

## Cosa consegnare per ogni lezione

`NN` è il numero della lezione e `slug` il suo slug (te li dà chi ti affida il lavoro).

| File | Cosa |
|---|---|
| `docs/lezioni/informatica/riscritte/NN-slug.md` | la lezione |
| `docs/lezioni/informatica/note/NN-slug.md` | note per Alessandro e Andrea: scelte, dubbi, cose da verificare |

Formulario, flashcard e generatore di esercizi non si fanno in questo giro.

## La lezione

- Per studenti di 15 anni che non hanno mai programmato. Si legge in 10-15 minuti, senza contare il tempo passato
  a eseguire i programmi: tra 120 e 200 righe di markdown. Una lezione, un argomento.
- Le lezioni che vengono prima nell'albero non sono ancora scritte: la lezione deve reggersi da sola. Quello che
  serve e viene da una lezione precedente (leggere un dato, stampare) si richiama in due righe con un esempio,
  senza rispiegarlo tutto.
- Ogni idea nuova ha, nell'ordine: la spiegazione a parole con un caso che lo studente riconosce; il diagramma di
  flusso, quando l'idea è una scelta o una ripetizione; un programma da eseguire, nei due linguaggi; che cosa
  provare a cambiare nel programma e che cosa aspettarsi.
- Almeno tre programmi da eseguire e almeno due esercizi con le prove (`%% prova`), dal più semplice al meno
  semplice. Gli esercizi stanno in fondo, in una sezione "Prova tu", ciascuno con la consegna prima del blocco.
- Almeno due diagrammi di flusso (nelle lezioni su selezione e cicli; nella lezione sui diagrammi di flusso
  sono il centro, almeno cinque). Ogni diagramma corrisponde a un programma della lezione: stessi nomi, stesso
  ordine dei passi.
- Seguire a mano un programma: almeno una tabella di traccia (i valori delle variabili passo per passo) nelle
  lezioni su variabili e cicli.
- Gli errori veri di chi comincia in riquadri `ad-warning`, subito dopo la regola a cui si riferiscono (`=` al
  posto di `==`, il ciclo che non finisce, il rientro sbagliato in Python, il punto e virgola dimenticato in C++,
  la variabile usata prima di averle dato un valore).
- I programmi devono funzionare davvero. I programmi con prove si controllano con `verifica.mts` (sotto); gli
  altri si provano a mano: Python con `python3`, il C++ rileggendolo con cura (se sulla macchina c'è `clang++` o
  `g++`, compilandolo).
- Scrittura: dai del tu; frasi di lunghezza varia, costruite con le subordinate; niente trattini lunghi, niente
  "piuttosto che", niente "è importante notare", "vediamo", "scopriamo", "in conclusione", "fondamentale",
  "cruciale", "essenziale", "semplicemente"; niente domande retoriche in apertura; niente emoji; grassetto solo
  per il termine nel punto in cui è definito.

## Verifiche, tutte da eseguire e da riportare

```sh
# formato, formule, link, stile: nessun errore
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/informatica/riscritte/NN-*.md
# le soluzioni superano le prove, in Python e in C++ (la prima volta scarica il compilatore: qualche minuto)
node node_modules/jiti/lib/jiti-cli.mjs scripts/codice/verifica.mts docs/lezioni/informatica/riscritte/NN-*.md
# le figure, in chiaro e in scuro: apri i PNG e guardali uno per uno
node scripts/figure/anteprima.mjs <cartella tua sotto /tmp> docs/lezioni/informatica/riscritte/NN-slug.md
node scripts/figure/anteprima.mjs <cartella tua sotto /tmp> docs/lezioni/informatica/riscritte/NN-slug.md --scuro
```

Nei diagrammi controlla che nessuna freccia attraversi un blocco o un testo, che "sì" e "no" siano leggibili e
dalla parte giusta, e che il disegno non superi i 9 cm di larghezza.

Il sito in sviluppo è già acceso sulla porta 3001: la lezione si vede a
`http://localhost:3001/prova-grafico/lezione?file=informatica/riscritte/NN-slug.md`. Non avviare altri server.

## Regole di lavoro

- La cartella è condivisa con altre sessioni. Crea solo i due file della tabella. Non modificare file esistenti.
- Niente comandi git che cambiano qualcosa. Niente `rm` su file che non hai creato tu. Niente `pkill` o simili.
- Niente scritture nel database e niente pubblicazione.
- I file temporanei vanno in una cartella tua sotto `/tmp`, non nella repo.

## Rapporto finale

Breve e fattuale, in italiano: i file creati; quanti programmi, esercizi e diagrammi ha la lezione; l'esito di
`check.mts` e di `verifica.mts`; se hai guardato le figure nei due temi e cosa hai corretto; le scelte che il
README non fissava; le domande per Andrea; quello che non sei riuscito a fare.
