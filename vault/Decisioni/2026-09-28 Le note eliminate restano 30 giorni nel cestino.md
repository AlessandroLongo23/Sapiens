---
stato: decisa
aggiornato: 2026-09-28
tag: [decisione, prodotto]
---
# Le note eliminate restano 30 giorni nel cestino

## Decisione
Eliminare una nota o un quaderno dello [[Zaino]] li sposta nel cestino, dove restano per 30 giorni e si possono ripristinare; poi vengono cancellati per sempre. Un quaderno va nel cestino con le sue note e torna con loro. Siccome c'è un modo per tornare indietro, eliminare non chiede più conferma; la conferma resta solo per "Elimina per sempre" e "Svuota il cestino", che non si annullano.

## Perché
Idea di Alessandro, 28 settembre 2026: tutte le app per prendere appunti hanno un cestino, e dopo aver cancellato una nota spesso la si può recuperare. Fino a quel giorno eliminare era irreversibile, ed era per questo che Alessandro aveva voluto la conferma prima di accartocciare la nota. Con il cestino la conferma diventa un passaggio in più senza motivo, e l'animazione può partire subito.

Alternative scartate:
- La conferma senza cestino, com'era: un errore resta un errore.
- Un post-it con "Annulla" per pochi secondi, provato lo stesso giorno e scartato da Alessandro: non convinceva, e passati i secondi la nota è persa lo stesso.

## Conseguenze
- Nel codice sul ramo `zaino-cestino`, non ancora in master né pubblicato. Colonna `deleted_at` su `notes` e `notebooks`; un job `pg_cron` ogni notte (3:17 UTC) cancella quello che è nel cestino da più di 30 giorni (migrazione `20260928140000_zaino_trash`, già applicata al database di produzione, compatibile con il codice pubblicato).
- Cancellando l'account il cestino si svuota subito, con tutto il resto: vedi [[GDPR e minori]].
- Il cestino non conta nel limite del piano gratuito: [[2026-09-28 Il cestino non conta nel limite del piano gratuito]].
- Come si butta una nota (dal menu, trascinandola sul cestino) è nello [[Zaino]].

## Collegamenti
- [[Zaino]]
- [[GDPR e minori]]
