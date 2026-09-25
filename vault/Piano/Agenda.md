---
aggiornato: 2026-09-26
tag: [piano, agenda]
---
# Agenda

La coda degli argomenti da discutere o decidere, in ordine di priorità. La usa la skill `/sparring` per proporre il prossimo argomento; si aggiorna alla fine di ogni sessione.

La priorità dipende da tre cose: cosa blocca la prossima release, cosa costa caro se deciso tardi, cosa si può fare subito a costo quasi zero.

## Adesso (prima della Release Beta, entro ottobre 2026)
Ordine deciso il 24 settembre 2026: vedi [[2026-09-24 Si lavora a lotti completi]].

1. **Lotti nuovi**, uno alla volta, ciascuno completo di teoria, esercizi, formulario e flashcard. Il secondo (i capitoli dei numeri, 8 lezioni) è fatto e committato il 24 settembre. La rilettura la fa Andrea (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]). Dal 25 settembre ogni lotto scrive anche i prerequisiti delle sue lezioni, e vanno aggiunti alle 26 già scritte (vedi [[2026-09-25 I prerequisiti si scrivono per lezione, con un solo tipo di arco]]). Il grafo del primo anno è scritto (`docs/lezioni/prerequisiti.md`, 26 settembre): ogni lotto nuovo aggiunge le sue righe e ricontrolla quelle delle lezioni che scrive. Restano da decidere il ripasso dopo il secondo errore e il prerequisito chiave per livello.
2. **Richiesta a OpenAI** per la conservazione zero dei dati e creazione del progetto UE; preparare le 50-100 domande della valutazione. Nota: [[Provider AI]].
3. **Deploy dei piani:** scritti e provati il 25 settembre (vedi [[Piani e prezzi]]). Restano il deploy, una prova a mano del pagamento sulla pagina di Stripe, e dopo il deploy l'archiviazione dei vecchi prodotti Lite, Base e Pro nel sandbox e delle variabili `PUBLIC_STRIPE_PRICE_LITE/BASE/PRO*` su Vercel. Rileggere termini e informativa aggiornati.
4. **Progettare il diario** (schermate con Dario). Nota: [[Diario e calendario]].
5. **Strumentazione della beta:** eventi, disdette, commenti; le metriche sugli esercizi sono nel piano [[Progressi dello studente]]. Nota: [[Metriche]].
6. **Legale minimo per incassare:** consenso del genitore, esportazione e cancellazione dei dati, regione di Supabase, IVA (OSS o esenzione), assicurazione. Note: [[GDPR e minori]], [[Società e IVA]].
7. **Lista d'attesa e comunicazione prima del lancio**, e quando coinvolgere Lorena. Note: [[Social]], [[Stagionalità]].
8. **Catalogo degli adesivi:** guida di stile, pipeline e primo lotto (10 capitoli del primo anno) fatti e committati il 26 settembre, con i primi adesivi fustellati e la dimensione regolabile. Restano i lotti: 29 capitoli, materie, studio, stagionali. Viene dopo i contenuti, che restano il collo di bottiglia. Note: [[Adesivi]], [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]].

## Prima della v1.0 e della v2
- Onboarding su classe e indirizzo. Lo schermo "Oggi" è deciso ed entra nella beta (vedi [[2026-09-25 Oggi è lo schermo iniziale dell'app]]); la grafica con Dario. Note: [[App mobile]], [[Progressi dello studente]].
- Torre dei prerequisiti, una per capitolo o per anno, con Dario. Nota: [[Mappa dei prerequisiti]].
- Adesivi dopo l'MVP: premi agganciati alla serie di giorni della Pratica quotidiana, adesivi per gli utenti Free, "crea il tuo" da modelli. Note: [[Adesivi]], [[Pratica quotidiana]].
- Prezzo del contatto per i tutor e regole di qualità. Nota: [[Pay-per-lead]].
- Come trovare i primi tutor reali. Nota: [[Marketplace]].
- Dettaglio degli strumenti DSA e consulenza di un esperto. Nota: [[Strumenti DSA]].
- Date di v1.0, v2 e v3. Nota: [[Roadmap]].

## Scuole (v4), con due eccezioni da fare presto
- **Intervista alla madre di Alessandro** su come si fanno oggi i turni ATA e l'orario nel suo liceo. Costa un pomeriggio e orienta tutto il modulo. Nota: [[Turni ATA]].
- **Verificare i diritti sull'algoritmo** rispetto all'uso per l'Università di Padova, e quale solver usa. Nota: [[Orario e aule]].
- Cosa vuol dire "completa" per la v4. Nota: [[Release v4 Scuole]].
- ACN, MePA, contratti di trattamento dati, AI Act. Note: [[Contratti con le scuole]], [[AI Act]].
- Registro elettronico, SIDI, piattaforma Unica. Nota: [[Registro elettronico]].
- Prezzo per le scuole e condizioni per le scuole partner. Nota: [[Vendita alle scuole]].

## Chiusi di recente
- 2026-09-26: sistema degli adesivi: li crea Sapiens (gli studenti poi solo da modelli), SVG scritti da Claude senza aspettare Dario, pacchetti per capitolo, materia, studio e stagione, tutti liberi nella beta. Copertine con adesivi su ogni pagina indice del materiale. Vedi [[2026-09-26 Sistema degli adesivi]].
- 2026-09-25: prerequisiti come DAG di lezioni con un solo tipo di arco, scritti nei lotti; ripasso suggerito dopo una prova andata male per la beta; torre dopo la beta. Vedi [[2026-09-25 Mappa dei prerequisiti]].
- 2026-09-26: progressi dello studente, le sette funzioni: errori nel riepilogo, prova da riprendere, rifai gli errori e `/errori`, progressi nel materiale, pratica quotidiana e serie, schermo "Oggi" come apertura dell'app, metriche della beta. Da pubblicare con un deploy. Vedi [[Progressi dello studente]] e [[2026-09-26 Progressi dello studente]].
- 2026-09-25: esercizi come percorso di livelli, con prova di salto; risposta senza attesa dell'esercizio dopo; soluzione animata. Nel codice, da pubblicare con un deploy; i nomi dei livelli vanno riletti da Andrea. Vedi [[2026-09-25 Percorso degli esercizi]].
- 2026-09-24: editor delle note rifatto (una barra, barra degli strumenti agganciabile, pagine con miniature, carta per nota, indice, modalità Lettura, zoom, stampa). Committato, da pubblicare con un deploy. Vedi [[2026-09-24 Editor delle note]].
- 2026-09-24: tentativi degli esercizi scritti e provati: tabella `exercise_attempts` applicata, correzione sul server, livello scelto dalla pagina, soluzione dopo l'errore. Da pubblicare con un deploy. Vedi [[Esercizi]].
- 2026-09-24: tentativi degli esercizi (esercizio intero salvato, correzione sul server, livello scelto dalla pagina) e revisione dei contenuti affidata ad Andrea. Primo lotto e deploy di master fatti. Vedi [[2026-09-24 Tentativi degli esercizi]].
- 2026-09-24: MVP degli adesivi sulle note e note come fogli a larghezza fissa, con la tabella `note_stickers` applicata. Vedi [[Adesivi]].
- 2026-09-24: adesivi come gamificazione, dopo la beta, con le regole su premi, scadenze e vendita. Vedi [[2026-09-24 Adesivi]].
- 2026-09-24: programma di matematica e albero delle lezioni riorganizzato (183 lezioni). Vedi [[Programma ministeriale]].
- 2026-09-24: figure delle lezioni come SVG statici; organizzazione del lavoro a lotti; contenuti senza Andrea; posizione degli errori frequenti. Vedi [[2026-09-24 Figure e organizzazione dei lotti]].
- 2026-09-23: revisione delle 18 lezioni pubblicate. Vedi [[2026-09-23 Revisione delle lezioni]].
- 2026-09-23: prototipo della pipeline eseguito, riscritto su sei livelli e collegato al sito. Vedi [[2026-09-23 Primo generatore della pipeline]].
- 2026-09-23: piani, prova al contrario, formulari gratuiti, provider AI, progressi per tentativo. Vedi [[2026-09-23 Prezzi, provider e pipeline]].
- 2026-09-23: niente interviste ([[2026-09-23 Niente interviste, il prodotto nasce dall'esperienza diretta]]); accordi sui diritti rimandati ([[2026-09-23 Accordi sui diritti rimandati a quando ci saranno ricavi]]).
- 2026-09-23: algoritmo e vincoli, lancio completo, statali e paritarie, impresa individuale, dati DSA. Vedi [[2026-09-23 Prima sessione di pianificazione]].
