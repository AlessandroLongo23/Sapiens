---
aggiornato: 2026-10-03
tag: [sessione, contenuti, informatica]
---
# Primo lotto di informatica

Sessione del 3 ottobre 2026, seguito di [[2026-10-03 Editor di codice]]: è il quinto dei cinque passi che Alessandro ha chiesto di fare di seguito. Il lotto copre il primo anno di informatica delle superiori (liceo scientifico, scienze applicate): 7 capitoli, 32 lezioni, tutte senza programmazione. Sono le prime lezioni di informatica complete.

Scritto, verificato e pubblicato lo stesso giorno: vedi "Stato" e [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]].

## Cosa si è fatto
- Prima del lotto (Claude):
  - indirizzi e indice delle 171 lezioni di informatica dal database (`docs/lezioni/informatica/url.md` e `originali/index.json`, con `scripts/fisica/indice.mts --materia computer-science`);
  - le convenzioni di informatica in `docs/lezioni/informatica/README.md` (basi, unità, parole, foglio di calcolo, figure);
  - il brief dato ai gruppi di lavoro, `docs/lezioni/informatica/brief-primo-lotto.md`, da riusare per i lotti successivi.
- Le 32 lezioni sono state scritte da otto agenti in parallelo, uno per capitolo (il foglio di calcolo diviso in due): informazione (01-03), sistemi di numerazione (04-07), codifica (08-12), architettura (13-17), sistema operativo (18-22), foglio di calcolo (23-25 e 26-28), documenti e presentazioni (29-32). Ognuna ha lezione, note, formulario, flashcard, e un generatore di esercizi con la sua specifica e il suo controllo indipendente in Python.
- In numeri: 32 lezioni, 32 formulari, 32 mazzi di flashcard (da 17 a 20 carte), 32 generatori con 175 livelli, circa 60 figure TikZ.
- Verifiche:
  - ogni generatore dà PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001 (gli agenti) e con il seed 31337 (Claude), boccia gli errori piantati apposta, passa `review.mts` e `width.mts`;
  - `check.mts` non dà errori né avvisi sui 96 file di lezioni, formulari e flashcard; `tsc` ed ESLint sono puliti;
  - i conti degli esempi sono stati rifatti in Python da ogni agente;
  - nel browser, a 390 px, sul sito in sviluppo: le 32 lezioni e le 32 schede di esercizi non hanno errori di KaTeX né scorrimento laterale; tre schede guardate a occhio.
- Esercizi collegati al sito in `src/lib/exercises/index.ts`, `config.ts` e `level-names.ts`.

## Un difetto del sito trovato dal lotto
Un dollaro dentro il codice in linea (il `$B$2` dei riferimenti assoluti) veniva letto come inizio di una formula, sia dal renderer delle lezioni (`src/lib/content/markdown.ts`) sia dal controllo (`scripts/lezioni/check.mts`). Corretto: nel codice in linea un dollaro resta un dollaro. Nessuna lezione già pubblicata aveva un dollaro nel codice.

## Scelte fatte dagli agenti, da uniformare o confermare
- Il foglio di calcolo negli esercizi è disegnato in due modi: `inf-foglio.ts` (lezioni 23-25) mette una riga tra ogni riga e centra tutto, `inf-foglio-dati.ts` (lezioni 26-28) ha una sola riga sotto le lettere e i testi a sinistra. Va scelto uno.
- Le cifre esadecimali negli esercizi sono in `\mathrm{}` e non in `\text{}` come nelle lezioni, perché la pagina degli esercizi legge ogni `\text{}` di un passaggio come prosa. A schermo il risultato è uguale.
- Nelle schede, dopo una formula a spaziatura fissa il punto di fine frase può andare a capo da solo.
- La figura dei campioni di colore RGB della lezione 11 è stata tolta: nel tema scuro il filtro del sito cambia i colori (il rosso diventa rosa, il blu quasi bianco). Per una figura di colori serve un modo di escluderla dall'inversione.
- Molte lezioni superano le 180 righe indicate (fino a 229): le righe in più sono tabelle e figure.

## Esercizi poco vari, da tenere d'occhio
- Il livello 3 di `inf-grafici-dati` ("Il grafico sbagliato") ha 75 situazioni diverse, sotto il centinaio chiesto.
- I livelli di conto sui bus (`inf-bus-periferiche`, livelli 3-5) hanno tra 56 e 66 esercizi diversi, perché le linee vanno da 2 a 20.
- I livelli "vero o falso" hanno una o due domande fisse, e la varietà è nelle quattro affermazioni.

## Domande aperte
- Le domande di contenuto sono in [[Domande per Andrea]], nella sezione del primo lotto di informatica; quelle di ogni lezione nelle note `docs/lezioni/informatica/note/`. Ci sono anche i fatti storici e i comportamenti dei programmi scritti a memoria, da verificare prima di pubblicare.
- I livelli con risposta numerica (conversioni, dimensioni, pagine, formule) potrebbero avere la risposta aperta: oggi sono tutti a scelta multipla, perché non sono in `src/lib/exercises/v2/open-answers.ts`.
- I prerequisiti delle lezioni di informatica non sono scritti: il grafo di `docs/lezioni/prerequisiti.md` è solo di matematica.
- Le pagine delle materie (`src/lib/content/subject-copy.ts`) non sono state toccate.

## Stato
Pubblicato il 3 ottobre 2026. Alessandro, dopo aver visto il lotto scritto, ha chiesto di chiuderlo subito dopo l'editor di codice ([[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]). `scripts/lezioni/publish.mts --dir docs/lezioni/informatica --apply` ha scritto nel database teoria, formulario e flashcard delle 32 lezioni (96 testi) e caricato nel bucket le 62 figure compilate in SVG. Il codice (generatori, collegamento degli esercizi, correzione del dollaro) è in master e in produzione con la PR #31, dopo l'editor di codice (PR #30).

Controllato su `sapiens-edu.vercel.app` a 390 px: le 32 lezioni e le 32 schede di esercizi si aprono, senza errori di KaTeX e senza scorrimento laterale, con 58 figure caricate. Sul sito il codice in linea compariva con gli apici inversi attorno, messi dallo stile `prose` di Tailwind: tolti con la PR #32.

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Programma ministeriale]], [[Domande per Andrea]]
- [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]], [[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]]
- [[Editor di codice]]
