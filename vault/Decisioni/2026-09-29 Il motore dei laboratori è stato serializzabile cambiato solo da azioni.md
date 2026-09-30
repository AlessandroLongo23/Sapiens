---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, tecnica]
---
# Il motore dei laboratori è stato serializzabile cambiato solo da azioni

## Decisione
Nel motore dei [[Laboratori]] lo stato del mondo (sostanze, quantità, temperature, posizione e stato degli strumenti) è separato dal disegno 3D e si può salvare e trasmettere. Cambia solo attraverso azioni, come "versa 5 mL da A a B" o "apri il gas"; il disegno legge lo stato e non lo modifica.

## Perché
Proposta di Claude, 29 settembre 2026, accettata da Alessandro mentre si discuteva il [[Laboratorio condiviso]]: con stato e azioni separati il multigiocatore è mandare le azioni a tutti, altrimenti è una riscrittura. Serve anche senza multigiocatore: salvare e riprendere un esperimento, rivederlo, mostrarlo al docente, scrivere test automatici. Costa poco adesso perché il motore si scrive ora. Nel prototipo stato e oggetti 3D sono mescolati (`src/components/lab/engine/experiment.ts`, `liquid.ts`). Alternativa scartata: pensarci dopo.

## Conseguenze
- Il motore del primo traguardo si scrive così ([[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]]).
- La simulazione deve dare lo stesso risultato con le stesse azioni (niente numeri casuali non controllati nello stato).

## Collegamenti
- [[2026-09-29 Laboratori]], [[2026-09-29 Il laboratorio condiviso si costruisce insieme al motore]]
