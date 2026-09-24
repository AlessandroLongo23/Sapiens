---
aggiornato: 2026-09-24
tag: [sessione]
---
# Figure e organizzazione dei lotti

Seguito di [[2026-09-23 Revisione delle lezioni]], a cavallo tra il 23 e il 24 settembre 2026.

## Cosa si è fatto
- Figure TikZ: prima non si vedevano da nessuna parte (avvio di TikZJax e CSP), poi sono diventate file SVG compilati alla pubblicazione, con le lettere in tracciati, caricati nel bucket `figure` di Supabase Storage e mostrati come `<img>` con testo alternativo. SVG scelto sul WebP dopo una misura: compressi circa 3 KB a figura contro quasi 8 KB. Disegnate le 14 figure mancanti; 19 figure in 7 lezioni, quelle di un esempio dentro il riquadro dell'esempio. Dettagli in [[Lezioni]].
- Corretti lo stile delle immagini nelle lezioni (bordo e larghezza pensati per le foto) e i titoli dei riquadri, che venivano trasformati in maiuscole all'inglese.

## Decisioni
- [[2026-09-24 Lezioni ed esercizi scritti da Claude e rivisti da Alessandro]]
- [[2026-09-24 Si lavora a lotti completi]]
- [[2026-09-24 Errori frequenti accanto alla regola]]

## Informazioni nuove
- L'albero di matematica ha 86 lezioni, 18 scritte; la [[Release Beta]] ne prevede 150-200. Mancano anche come titoli capitoli del biennio (per esempio scomposizione e frazioni algebriche).
- Il commit resta in sospeso fino alla fine del primo lotto; poi commit divisi per scope e deploy. Finché non c'è il deploy, in produzione le figure non si vedono.

- Programma: in vigore il DM 211/2010; nuove Indicazioni per i licei dal 2027/28 (bozza del 22 aprile 2026). Proposta di albero nuovo in `docs/lezioni/programma.md`: 103 lezioni per il biennio, di cui 18 scritte, 32 già nell'albero e 53 nuove, confrontate anche con YouMath, Theoremz e Matematicamente.it. Vedi [[Programma ministeriale]].

- Albero applicato al database: 39 capitoli, 183 lezioni (104 nel biennio), 136 nodi creati, 74 aggiornati, 15 lezioni vuote assorbite; backup in `docs/lezioni/backup/`; 63 redirect; link tra lezioni, chiave degli esercizi delle equazioni di secondo grado e test aggiornati. Sitemap verificata: solo le 18 lezioni scritte, ai nuovi indirizzi.

- Generatore nuovo delle equazioni di primo grado: sei livelli, 6.000 esercizi verificati, collegato al sito. Vedi [[Pipeline esercizi]].

- Alessandro ha approvato gli esercizi delle equazioni di primo grado, e da ora i generatori non aspettano la sua conferma uno per uno: Claude riferisce, lui rilegge quando vuole.
- Stato degli esercizi delle 18 lezioni: 2 con generatore nuovo (equazioni), 3 con il vecchio rotto (conversione, MCD e MCM tra monomi, espressioni con monomi), 8 con il vecchio che non va in errore ma non è verificato, 5 senza esercizi (quattro sugli insiemi e le funzioni). Si portano tutte e 16 sulla pipeline nuova, con cinque agenti in parallelo per gruppi (razionali, monomi, insiemi, naturali, funzioni). Infrastruttura resa componibile: il registro dei generatori e il verificatore caricano i file da soli (`scripts/exercises/checkers/`), l'adattatore del sito accetta esercizi nati a scelta multipla.

- I 16 generatori sono pronti, verificati di nuovo da Claude con seed diversi e collegati: tutte le 18 lezioni hanno esercizi dai generatori nuovi (18 pagine degli esercizi controllate). Rilettura: https://claude.ai/artifact/GZXGtGcQB1yGubKCJdzgYX. L'adattatore ora mostra la consegna come testo normale, così i problemi lunghi vanno a capo.

- Formulari e flashcard delle 18 lezioni, scritti da cinque agenti sul brief (sezioni nuove in `docs/lezioni/stile.md`), controllati e pubblicati: 18 formulari e 346 carte. Il formulario usava già la colonna `formulary` (c'era solo un testo di prova, salvato in `docs/lezioni/backup/` e tolto). Per le flashcard sono nati la colonna `flashcards`, la pagina con il mazzo e il paywall; lo script di pubblicazione ora scrive anche formulari e flashcard con la stessa protezione dalle sovrascritture. Provato nel browser da telefono e desktop, in chiaro e in scuro; 36 pagine nella sitemap. I dubbi degli agenti sono in fondo a `docs/lezioni/note/`. Vedi [[Flashcard]].
- I formulari sono già visibili in produzione, perché il sito li sapeva mostrare; le flashcard aspettano il deploy.

- Errori frequenti spostati accanto alle regole nelle 18 lezioni, con cinque agenti: 16 lezioni non hanno più la sezione in fondo; ne resta una sola voce in "Unione insiemistica" (unione confusa con intersezione, che la lezione non spiega) e in "Funzioni iniettive, suriettive e biettive" (iniettiva scambiata per crescente, che la lezione non tratta). Controllato che nessuna riga sia cambiata oltre ai titoli tolti; lezioni ripubblicate. Vedi [[2026-09-24 Errori frequenti accanto alla regola]].

## Prossimo argomento
Commit del primo lotto divisi per scope, quando Alessandro dà il via, e deploy.
