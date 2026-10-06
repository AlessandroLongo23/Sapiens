---
stato: decisa
aggiornato: 2026-10-06
tag: [decisione, laboratori, zaino]
---
# Le pagine del quaderno di laboratorio sono A5 e finiscono nello Zaino

## Decisione
Deciso da Alessandro il 6 ottobre 2026. Le pagine del quaderno dei [[Laboratori]] sono A5 ad altezza fissa, 560 × 792 px, mostrate a coppie nel laboratorio. Quello che lo studente scrive vivrà nello [[Zaino]] come un tipo di nota a parte, la relazione di laboratorio, nello stesso formato.

## Perché
A4 e A5 hanno le stesse proporzioni, quindi la stessa pagina si ingrandisce o si rimpicciolisce senza che l'impaginazione cambi: due A5 affiancati sono esattamente il foglio dello Zaino (792 × 1120 px) messo di traverso. Il quaderno aperto mostra due pagine insieme e deve stare nello schermo: con due A4, su un portatile da 1366 × 768 il testo scenderebbe a circa 9 px; con due A5 resta a 13-14 px. In una pagina A5 stanno 23 quadretti per 33 righe, abbastanza per le tabelle dei tre esperimenti.

## Conseguenze
- Il foglio dello Zaino oggi cresce con il testo; le pagine del laboratorio hanno altezza fissa, quindi serve un formato per nota.
- Una pagina da compilare non è markdown: si salva come dati (quale modello, quali valori nei campi) e la ridisegna lo stesso componente del laboratorio. Il quaderno del laboratorio tiene già i valori così (`toJSON` in `notebook.ts`).
- Il salvataggio nello Zaino non è ancora fatto: per ora quello che si scrive vale per la sessione. Da fare con account, limiti del piano gratuito e stampa.

## Collegamenti
- [[2026-10-06 Il quaderno del laboratorio si apre con B ed è una pagina in cui si scrive]], [[Zaino]], [[Laboratori]]
