---
data: 2026-09-30
tag: [sessione, lezioni, video]
---
# Clip animate delle lezioni

## Di cosa si è parlato
Alessandro ha notato che le lezioni non hanno nessun video né altra spiegazione che non sia il testo. Ha proposto un manim reskinnato (sfondo a quadretti, colori del design system, evidenziazioni custom) per generare contenuti per ogni lezione, come modalità alternativa alla lettura.

Claude ha fatto notare che la pipeline dei video era già decisa il 28 settembre per i social, con manim, e ancora da progettare: farla una volta sola serve a tutti e due. Contro il video per lezione ha portato i numeri: 174 lezioni scritte, circa 17 ore di video a 6 minuti l'una, da guardare tutte per controllarle e da rifare a ogni correzione del testo. Per questo ha proposto clip per sezione. Gli altri rischi segnalati: i difetti tipici di manim scritto da un LLM (da intercettare con i fotogrammi chiave in PNG controllati da Claude), la scelta della voce italiana e l'hosting, che non può stare su Supabase. A favore c'è l'accessibilità per chi ha la dislessia.

Alessandro ha scelto le clip per sezione, manim e un pilota subito. Sull'hosting ha proposto YouTube, perché i video si possono monetizzare, e ha aggiunto che il player dentro Sapiens dà un'impressione più curata.

## Decisioni
- [[2026-09-30 Le lezioni hanno clip animate per sezione, fatte con un manim a quadretti]]
- [[2026-09-30 Le clip partono da una lezione pilota, che dà anche i primi video social]]

## Informazioni nuove
- Per guadagnare con la pubblicità di YouTube serve il Programma partner: 1.000 iscritti e 4.000 ore di visualizzazione pubbliche in 12 mesi, oppure 10 milioni di visualizzazioni di Shorts in 90 giorni (da verificare sulle regole attuali di YouTube).
- Un video monetizzato mostra la pubblicità anche quando è incorporato in un altro sito, quindi anche dentro le lezioni.
- I guadagni di YouTube sono un ricavo dell'impresa: rientrano nel punto legale e fiscale dell'[[Agenda]].

## Dopo la sessione
Alessandro ha confermato la doppia pubblicazione (YouTube e player di Sapiens) e ha chiesto di partire subito con il pilota sulle equazioni di secondo grado, solo nella versione desktop 16:9, per validare il flusso di lavoro.

## Il pilota
Fatto lo stesso giorno, in `video/` (istruzioni in `video/README.md`). manim 0.21 con manim-voiceover 0.4, LaTeX da TinyTeX. Il tema prende colori e font da `globals.css`: quadretti, Fraunces, Inter, JetBrains Mono, Caveat, l'evidenziatore del sito, la penna rossa per cerchi, barre e spunte, la grafite per note e frecce. Le scene mettono i blocchi in una griglia di zone (idea presa da Code2Video, ICML 2026). Un controllo automatico segnala blocchi fuori quadro, sovrapposti, rimpiccioliti o dentro l'intestazione. Un agente critico legge i fotogrammi di ogni passo, il codice, i tempi della voce e la lezione. Ogni errore nuovo va in `video/pitfalls.md`.

Il critico ha trovato cose che il controllo non vede. Nella clip 2 si barrava "−5² = −25", che è vero, e la voce diceva "meno cinque al quadrato", cioè la scrittura ambigua che la clip correggeva. Nella clip 4 la voce diceva che con delta non quadrato perfetto le soluzioni sono irrazionali, senza "positivo". Voti dopo i giri di correzione: 6, 7 e 7,5 per la clip 1 (tre giri), 5,5 e 7 per la 2, 5 e 6,5 per la 3, 6 per la 4. Al controllo finale: 8, 7,5, 6,5 e 7.

La chiave OpenAI di produzione ha risposto "429, no credits": la voce del pilota è Alice di macOS. Probabilmente anche Sapiens AI in produzione non risponde (da verificare).

## Rimasto aperto
- Se le clip sono gratuite come le lezioni o solo nel piano Studio.
- La voce italiana: serve credito OpenAI per gpt-4o-mini-tts, o un altro servizio.
- Il taglio verticale per i social, rimandato: per ora solo la versione desktop.
- Chi guarda le clip prima della pubblicazione (il critico non sente l'audio).

## Prossimo argomento
Alessandro guarda le quattro clip e decide se il flusso di lavoro regge; poi la voce vera e il player (vedi [[Agenda]], punto 10). Nella coda generale resta primo il legale e fiscale.
