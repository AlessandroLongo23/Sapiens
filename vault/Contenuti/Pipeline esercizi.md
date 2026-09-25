---
stato: in sviluppo
release: beta
aggiornato: 2026-09-26
tag: [contenuti, ai]
---
# Pipeline esercizi

Come si producono esercizi per tutti gli argomenti senza scriverli a mano e senza pagare l'AI a ogni esercizio. Decisione in [[2026-09-23 Esercizi da generatori scritti dall'AI]].

## Il principio
L'AI non scrive l'esercizio: scrive il generatore. L'inferenza si paga una volta per ogni tipo di esercizio, e il generatore produce esercizi infiniti e diversi in un millisecondo. È la stessa idea dei 15 generatori di oggi (`src/lib/exercises/`), senza il costo di scriverli a mano.

## Il flusso
1. **Specifica, scritta da Claude.** Livelli di difficoltà, vincoli, due o tre esempi a mano. Esempio: equazione di secondo grado, livello 1, soluzioni intere tra -9 e 9, coefficiente di x² uguale a 1, delta positivo.
2. **Generatore, scritto da Claude.** Costruito al contrario: sceglie prima la soluzione, poi costruisce l'esercizio. Per l'equazione sceglie due radici intere piccole ed espande (x−r₁)(x−r₂). Così i "numeri belli" sono garantiti per costruzione, non cercati per tentativi.
3. **Verifica automatica.** Un harness genera 500-1000 campioni, controlla ogni soluzione con un sistema di calcolo simbolico (SymPy, solo nella pipeline, non in produzione) e ogni vincolo della specifica. Se qualcosa fallisce, Claude corregge il generatore e si ripete.
4. **Revisione umana.** Andrea rilegge specifiche e campioni con i suoi tempi e manda ad Alessandro conferme o correzioni; la pubblicazione non lo aspetta (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]).
5. **Pubblicazione** del generatore, collegato alle lezioni.

## Banca statica
Per quello che non si parametrizza bene (problemi con testo, fisica con contesto, domande concettuali): esercizi generati una volta, verificati facendoli risolvere a un secondo modello in modo indipendente e confrontando i risultati, controllati a campione, salvati nel database.

## Analisi del codice esistente (23 settembre 2026)
- **Vecchi generatori** (`src/lib/exercises/`): 6 su 15 falliscono sempre. Si tengono come riferimento per il tipo di esercizio e per le idee di risposte sbagliate plausibili, non come base (vedi [[Esercizi]]).
- **Libreria matematica** (`src/lib/math/`, circa 3.600 righe): un CAS (Computer Algebra System) iniziato da Alessandro, come dice il suo README. Ha un parser da LaTeX ad albero di espressioni, la valutazione con variabili e semplificazioni sulle sole potenze. Mancano i termini simili raccolti, i prodotti sviluppati e l'aritmetica esatta: anche le frazioni sono numeri decimali, e 1/3+1/6 dà 0.5. Le classi di polinomi ed equazioni non funzionano. Si tengono le funzioni di utilità (MCD, mcm, numeri primi) e forse il parser; il resto si abbandona. Il lavoro simbolico lo fa SymPy nella pipeline, e in produzione il generatore conosce già la risposta esatta.
- **Controllo delle risposte aperte nel browser:** per i numeri, confronto tra razionali esatti. Per le espressioni, valutazione dei due lati in 5-8 punti casuali, più un controllo della forma quando la specifica la richiede (sviluppata, scomposta). Libreria candidata: `@cortex-js/compute-engine` se l'input è MathLive, altrimenti una build ridotta di mathjs.

## Prototipo
Il primo generatore della pipeline è quello delle equazioni di secondo grado: specifica in `specs/exercises/equazioni-secondo-grado.md`, codice in `src/lib/exercises/v2/`, strumenti in `scripts/exercises/` (istruzioni nel README). Scritto il 23 settembre 2026 ed eseguito per la prima volta nella sessione successiva, lo stesso giorno.

- Sei livelli nell'ordine del libro (vedi [[2026-09-23 Ogni livello aggiunge una sola difficoltà, nell'ordine del libro]]): incomplete, coefficiente direttore 1, coefficiente qualsiasi con radici razionali, radici irrazionali (vedi [[2026-09-23 Radici irrazionali nella beta]]), termini nei due membri, discriminante nullo o negativo.
- Le risposte sono numeri esatti: razionali e radicali semplificati, come `(3-sqrt(5))/2` (tipo `Surd` in `src/lib/exercises/v2/surd.ts`). Le pure e le spurie si risolvono senza la formula, come nel libro.
- Verifica: 6.000 esercizi (1.000 per livello) passano il controllo con SymPy, in circa 25 secondi. Il verificatore boccia gli errori piantati apposta (risposta sbagliata, radicale non semplificato, caso sbagliato, opzioni doppie, generatore in errore) e controlla la quota di ogni caso per livello.
- Esercizi diversi su 1.000 estratti: 232 al livello 1, 143 al livello 2 (sono quasi tutti quelli possibili con radici intere tra −9 e 9), 814 al livello 3, 480 al livello 4, 1.000 al livello 5, 445 al livello 6.
- Sul sito dal 23 settembre 2026 al posto del generatore rotto, solo a scelta multipla, un esercizio per livello (vedi [[2026-09-23 I nuovi generatori vanno sul sito subito, a scelta multipla]]). La pagina mescola gli esercizi, quindi i livelli escono in ordine casuale. Non ancora provato nel browser: le opzioni con i radicali sono lunghe e sul telefono va controllato lo scorrimento.
- Revisione: Alessandro ha controllato gli esercizi il 23 settembre 2026 e li ha approvati. Pagina di revisione: https://claude.ai/artifact/XP1hopEvTp9fResygGbjjn.

Due difetti trovati alla prima esecuzione e corretti: il livello 3 andava in errore su ogni seed, e il verificatore dava PASS lo stesso, perché i campioni mancanti non venivano contati.

## Secondo generatore: equazioni di primo grado (24 settembre 2026)
Specifica in `specs/exercises/equazioni-primo-grado.md`, codice in `src/lib/exercises/v2/generators/equazioni-primo-grado.ts`. Sei livelli nell'ordine della lezione: un solo termine con la x, incognita nei due membri, parentesi, soluzione frazionaria, denominatori, impossibili e indeterminate (per queste la risposta ha `universal: true`, cioè S = ℝ). Verifica indipendente con SymPy: 6.000 esercizi su 6.000, errori piantati tutti bocciati. Collegato al sito al posto del generatore rotto, a scelta multipla, un esercizio per livello. Pagina di revisione: https://claude.ai/artifact/WUnfy7Lu6fw3T5H6eGduMK. Approvato da Alessandro il 24 settembre 2026.

## Generatori delle 18 lezioni (24 settembre 2026)
Oltre alle due equazioni, 16 generatori scritti da cinque agenti in parallelo (insiemi, naturali, razionali, monomi, funzioni), ognuno con specifica, controllo indipendente in `scripts/exercises/checkers/`, verifica su 1.000 esercizi per livello, errori piantati e controllo KaTeX; la verifica rifatta da Claude con seed diversi dà PASS per tutti. Da 5 a 6 livelli ciascuno. Pagina di rilettura: https://claude.ai/artifact/GZXGtGcQB1yGubKCJdzgYX. Il registro dei generatori e il verificatore caricano i file da soli, così un generatore nuovo non tocca file condivisi.

Questioni aperte segnalate dagli agenti (dettagli nella sezione "Domande per la revisione" di ogni specifica):
- Confronto tra due frazioni: la risposta naturale ha tre opzioni (<, >, =), mentre la regola chiede quattro; oggi il confronto si fa scegliendo la maggiore o la minore tra quattro frazioni.
- Risposta aperta futura: conversione frazione → decimale deve controllare la forma, non solo il valore; insiemi di lettere e coppie non entrano nel tipo `set` di oggi; la divisione con resto chiede una coppia quoziente e resto.
- Monomi: manca un livello sul quoziente che non è un monomio (serve una risposta "non è un monomio").
- Una domanda su 0⁰ ha il testo tutto nella consegna e il problema vuoto.

Da quel giorno i generatori non aspettano la conferma di Alessandro uno per uno: Claude li scrive, li verifica e li collega, e riferisce cosa ha fatto con le pagine di revisione. Dal 24 settembre 2026 la rilettura la fa Andrea (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]).

## Chimica
Gli esercizi di chimica sono generatori Python con RDKit (`scripts/chimica/esercizi/`), stesso contratto dei generatori TypeScript, verificati da un controllo indipendente (OPSIN per i nomi). Sul sito arrivano pregenerati, con immagini nella domanda, nelle risposte e nella soluzione: vedi [[2026-09-26 La chimica si pubblica gratis accanto alla beta]] e [[2026-09-25 Chimica con RDKit]].

## Domande aperte
- La pipeline diventa una skill di Claude Code nella repo?
- Quanti tipi di esercizio servono per la matematica dei cinque anni? Stima da fare sul [[Programma ministeriale]]. Moltiplicata per il tempo di rilettura di Andrea, dice se la pipeline regge entro gennaio 2027.
