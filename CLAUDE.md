# Sapiens

Sapiens è una piattaforma per la scuola italiana. Oggi serve gli studenti delle superiori con lezioni STEM, esercizi generati, lo Zaino (quaderni e note), l'assistente Sapiens AI e un marketplace di tutor. In futuro servirà anche famiglie, tutor e scuole. Il prossimo traguardo è la beta a pagamento di gennaio 2027, con la sola matematica. Il progetto è di Alessandro Longo, con Andrea (contenuti), Dario (design) e Lorena (marketing).

## Da dove ripartire

All'inizio di ogni sessione, prima di rispondere a qualunque domanda sul progetto (non solo su una feature), leggi:
1. `vault/Home.md`: dove siamo, decisioni prese, decisioni aperte.
2. `vault/Piano/Agenda.md`: gli argomenti in coda, in ordine di priorità.
3. La nota più recente in `vault/Sessioni/`: cosa si è fatto nell'ultima sessione e cosa era rimasto a metà.

Poi rispondi come chi conosce già il progetto: Alessandro non deve rispiegare il contesto.

## Il vault è la memoria del progetto

`vault/` è un vault Obsidian in italiano, una nota per argomento. Si parte da `vault/Home.md`, che ha la mappa, le decisioni e le domande aperte.

- `Visione/`: visione, problema, principi, concorrenti
- `Attori/`: studente, genitore, tutor, docente, dirigente, DSGA e personale ATA
- `Prodotti/`: una nota per feature, divise per Studenti, Tutor, Famiglie e Scuole
- `Contenuti/`: pipeline di lezioni ed esercizi, programma, standard di qualità
- `Business/`, `Marketing/`, `Legale/`, `Tecnica/`, `Team/`
- `Piano/`: `Agenda.md` (gli argomenti da discutere, in ordine di priorità), roadmap, release, metriche
- `Decisioni/`: una nota per decisione, con nome `AAAA-MM-GG titolo`
- `Sessioni/`: una nota per ogni sessione di discussione
- `Idee/`: idee non ancora valutate
- `Template/`: modelli per feature, decisione, idea e attore
- `Archivio/`: documenti precedenti al vault (ROADMAP, MARKETPLACE, TODO, la bozza DESCRIPTION), che fanno da fonte e non si aggiornano

## Regole

- Prima di lavorare su una feature, leggi la sua nota in `vault/Prodotti/` e le decisioni collegate. Se il lavoro richiesto contraddice una decisione, fallo notare prima di scrivere codice.
- Dopo un cambiamento rilevante al codice, aggiorna la sezione "Stato attuale" della nota, lo `stato` e la data in `aggiornato`.
- Le nuove idee vanno in `Idee/`; le decisioni vanno in `Decisioni/`, e poi si aggiornano le note che toccano e l'elenco in `Home.md`. Per farlo c'è la skill `/vault`.
- Per discutere, fare brainstorming o decidere cosa fare dopo c'è la skill `/sparring`: parte dall'Agenda, discute e registra tutto nel vault.
- Nelle note, "Stato attuale" descrive il codice di oggi e "Obiettivo" quello che deve diventare. Quello che non è stato discusso va in "Domande aperte": niente testo inventato.
- Il vault segue le regole di scrittura globali: niente trattini lunghi, niente "piuttosto che" usato come contrasto, grassetto raro, fonti con nome e data, "da verificare" sui dati non controllati.
- Le regole per il codice sono in `.cursorrules` e `README.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
