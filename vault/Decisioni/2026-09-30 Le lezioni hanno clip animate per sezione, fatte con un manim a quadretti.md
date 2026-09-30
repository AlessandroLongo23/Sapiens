---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, contenuti, lezioni, video]
---
# Le lezioni hanno clip animate per sezione, fatte con un manim a quadretti

## Decisione
Accanto alla lettura, le lezioni hanno delle clip animate con voce, da 1 a 3 minuti, una per sezione: una regola, un esempio svolto, un errore frequente. Non c'è un video unico per tutta la lezione. Le animazioni si fanno con manim, con un tema di Sapiens: sfondo a quadretti, i colori del design system, i font del sito, l'evidenziatore e la penna rossa come animazioni proprie. Con lo stesso tema e la stessa pipeline si fanno i video brevi dei social.

## Perché
Idea di Alessandro, 30 settembre 2026: le lezioni non hanno nessun video né altra spiegazione che non sia il testo, e una seconda modalità per imparare aiuta chi legge male o poco. Aiuta anche chi ha la dislessia, in linea con [[2026-09-23 Strumenti DSA aperti a tutti, senza certificazione]].

Il formato è una scelta di Alessandro tra tre opzioni proposte da Claude. Un video per lezione, da 5 a 10 minuti, sulle 174 lezioni scritte al 30 settembre (104 di matematica e 70 di fisica) farebbe circa 17 ore di video: si controllano solo guardandole tutte, e ogni correzione del testo ne rende vecchio uno. Una clip per sezione si rifà da sola, si ritaglia in verticale per i social e, se nessuno la finisce, si riscrive solo il suo copione. Scartati anche i soli esercizi svolti, che lasciano la teoria solo scritta.

Il motore è manim, già indicato per i social in [[2026-09-28 Video brevi con animazioni per le spiegazioni e un volto per le presentazioni]]: è il più adatto a trasformare un'equazione passo passo. Scartato Remotion (React), che riuserebbe il kit delle figure interattive e i token di `globals.css` ma trasforma le formule con più fatica; la sua licenza per i team piccoli era da verificare.

## Conseguenze
- Serve un tema manim di Sapiens: sfondo, palette, Fraunces, JetBrains Mono, Inter e il font a tratto singolo di `scripts/landing/hero-ink.mjs`, più le animazioni dell'evidenziatore e del cerchio rosso.
- La voce si sincronizza con il copione, per esempio con il plugin manim-voiceover (da provare). La voce italiana è da scegliere.
- Per trovare i difetti tipici di manim scritto da un LLM (scritte sovrapposte, oggetti fuori dallo schermo, tempi sfasati) si rendono i fotogrammi chiave in PNG e Claude li controlla prima di pubblicare.
- I copioni partono dalle lezioni già rilette, come i video dei social (vedi [[Piano di acquisizione]]).
- Si parte da una lezione pilota: vedi [[2026-09-30 Le clip partono da una lezione pilota, che dà anche i primi video social]].
- Aggiornate [[Lezioni]], [[Video di spiegazione e di esercizi svolti]], [[Video brevi]], [[Social]].

## Dove stanno
Deciso da Alessandro il 30 settembre 2026, su proposta di Claude: gli stessi file vanno su YouTube, come canale per farsi trovare e più avanti per guadagnare, e dentro le lezioni nel player di Sapiens su un CDN video (Cloudflare Stream, Bunny o Mux, da scegliere), senza pubblicità né video suggeriti di altri canali. Un video monetizzato mostra la pubblicità anche quando è incorporato, per questo nelle lezioni non si usa il player di YouTube.

## Domande aperte
- Se le clip sono gratuite come le lezioni o solo nel piano Studio.
- Sottotitoli e trascrizione: il copione fa già da trascrizione.

## Collegamenti
- [[Lezioni]], [[2026-09-24 Linguaggio visivo del quaderno a quadretti]], [[Video brevi]], [[Social]]
