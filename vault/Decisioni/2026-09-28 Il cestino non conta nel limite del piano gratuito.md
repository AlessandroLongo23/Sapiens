---
stato: decisa
aggiornato: 2026-09-28
tag: [decisione, business]
---
# Il cestino non conta nel limite del piano gratuito

## Decisione
Le note e i quaderni nel cestino non contano nel limite del piano Free (1 quaderno e 5 note): eliminare libera spazio subito. Ripristinare qualcosa che farebbe superare il limite viene rifiutato, con l'invito a eliminare altro o a passare a Studio.

## Perché
Era rimasta una domanda aperta nella discussione del cestino, il 28 settembre 2026; Alessandro ha accettato tutte le proposte, e questa l'ha scelta Claude. Se il cestino contasse, uno studente con il piano gratuito pieno non potrebbe fare spazio senza passare da "Elimina per sempre", che è proprio il gesto irreversibile che il cestino vuole evitare. Il rischio opposto, usare il cestino come spazio gratis in più, è limitato dai 30 giorni dopo i quali tutto viene cancellato.

## Conseguenze
- `getQuota` in `src/lib/server/zaino.ts` conta solo le note fuori dal cestino, e non quelle di un quaderno nel cestino; `restoreNote` e `restoreNotebook` controllano il limite prima di ripristinare.
- I test end-to-end non possono provare il rifiuto: ogni account nuovo è nella prova di Studio per 7 giorni. Provano i conteggi da cui il limite si legge.

## Collegamenti
- [[2026-09-28 Le note eliminate restano 30 giorni nel cestino]]
- [[Piani e prezzi]]
- [[Zaino]]
