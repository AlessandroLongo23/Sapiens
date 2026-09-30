---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi, tecnica]
---
# La risposta aperta si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo

## Decisione
Il campo della risposta aperta è un editor di formule, MathLive, con due modi di scrivere che lo studente sceglie:
- la tastiera di Sapiens, virtuale, simile a quella di GeoGebra, con un layout nostro (frazione, radice, potenza, pedice, ±, ∅, ℝ, "impossibile", virgola decimale); è il modo iniziale sugli schermi touch;
- la tastiera del dispositivo, dove `/` apre una frazione, `^` l'esponente e `sqrt` una radice; è il modo iniziale da computer.

Lo studente cambia modo dal campo, e la scelta resta nelle Preferenze dell'account. MathLive si carica solo quando una prova ha domande aperte.

## Perché
Alessandro, 30 settembre 2026: si devono poter scrivere esponenti e frazioni con numeratori e denominatori lunghi, quindi serve uno strumento fatto per la matematica, una tastiera virtuale o una libreria o entrambe, e lo studente usa quella con cui si trova meglio. MathLive ha le due cose in una sola libreria.

Alternativa scartata: un campo di testo semplice con una fila di tasti e l'anteprima, proposto da Claude. Non regge frazioni lunghe ed esponenti annidati.

## Conseguenze
- Sul server il LaTeX dello studente si legge con il Compute Engine (degli stessi autori di MathLive) e si confronta in modo esatto con i nostri `rational.ts` e `surd.ts`. La correzione resta sul server, come vuole [[2026-09-24 Ogni tentativo salva l'esercizio intero]].
- Da verificare: la virgola decimale in MathLive, il peso della libreria, il comportamento sul telefono a 390 px, il tema scuro.
- Il campo va vestito con lo stile del quaderno.

## Collegamenti
- [[Esercizi]], [[Account e impostazioni]], [[2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta]]
