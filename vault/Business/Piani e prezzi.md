---
stato: bozza
aggiornato: 2026-09-23
tag: [business]
---
# Piani e prezzi

## Stato attuale
In `src/lib/stripe/config.ts`, con Stripe:

| Piano | Prezzo al mese | Cosa include |
|---|---|---|
| Free | €0 | Teoria e formulari |
| Lite | €4,99 | Esercizi, flashcard, Zaino illimitato, niente pubblicità |
| Base | €19,99 | Lite più Sapiens AI (piano "più popolare") |
| Pro | €59,99 | Base più un'ora di ripetizione a settimana |

Prova gratuita di 7 giorni senza carta. Prezzi semestrali opzionali (5 mesi pagati su 6). Il piano viene scritto in `app_metadata` dal webhook di Stripe; i contenuti a pagamento sono bloccati sul server.

Cose che non tornano oggi: il Free promette la pubblicità (che non c'è), il Lite promette le flashcard (che non esistono), il Pro promette un'ora di ripetizione che non ha un sistema di prenotazione.

## Deciso
- Scala dei piani: Free, Studio (€7,99-9,99), Plus (circa €15-20, quando le sue funzioni esistono), Famiglia (circa €30, con la v2). Nella beta solo Free e Studio. Vedi [[2026-09-23 Piani che crescono con le funzioni]].
- Prova al contrario di 7 giorni, poi Free con una sessione di esercizi al giorno. Vedi [[2026-09-23 Prova al contrario e sessione gratuita giornaliera]].
- Formulari e calcolatrici gratuiti. Vedi [[2026-09-23 Formulari e calcolatrici gratuiti]].
- Il Pro non include più ore di ripetizione. Diventa Base più contatto con il tutor pagato da Sapiens più [[Area genitori]], ed esce con la [[Release v2 Tutor]]. Fino ad allora c'è solo una lista d'attesa. Vedi [[2026-09-23 Il piano Pro non include ore di ripetizione]].
- L'AI è a pagamento fin dalla [[Release Beta]].

## Discussione del 23 settembre 2026
Idea di Alessandro: piani da gratuito fino a un piano completo (AI e contatto con il tutor) intorno a €50-60 al mese, con piani intermedi intorno a €5-10 e €25-30. Esercizi, formulari e flashcard a pagamento; Zaino con un'anteprima gratuita e illimitato a pagamento; le funzioni AI nel piano più alto prima del Pro, perché l'inferenza costa.

Fatti emersi nella discussione:
- L'AI costa tra pochi centesimi e circa 3 dollari al mese per studente (vedi [[Provider AI]]). Non giustifica da sola un salto di prezzo tra piani.
- Anche lo spazio per le note costa pochissimo: una nota è testo, al massimo 200.000 caratteri. I limiti vanno decisi per il valore che danno, non per il costo.
- I formulari sono anche strumenti compensativi DSA, che la decisione [[2026-09-23 Strumenti DSA aperti a tutti, senza certificazione]] rende accessibili a tutti. Metterli a pagamento vuol dire far pagare uno strumento compensativo.
- Riferimenti di prezzo per le famiglie, da [[MARKETPLACE]]: un'ora di ripetizione alle superiori costa €20-30; il pass studente di Superprof €29 al mese, quello di Letuelezioni €19. Un piano da €50-60 viene confrontato con 2-3 ore di ripetizione.
- Anteprima gratuita: Duolingo, completamente gratuito nei contenuti, aveva a fine 2025 il 9,2% degli utenti mensili abbonati (12,2 milioni su 133,1 milioni, bilancio 2025). Per il software in abbonamento, le analisi di settore riportano per il freemium classico conversioni intorno al 2-5% e per la "prova al contrario" (tutto sbloccato per qualche giorno, poi si torna al piano gratuito) intorno all'8-12% (OpenView, riportato da fonti secondarie, da verificare).

## Domande aperte
- Il prezzo del Pro, una volta tolta l'ora (€59,99 non ha più senso).
- I prezzi Lite e Base sono giusti per le famiglie italiane? Confronto con i concorrenti in [[Concorrenti]].
- Piano famiglia con più figli?
- Piano annuale, prezzi per studenti universitari.
- Tutti i piani studente sono B2C: il piano per il singolo docente e la licenza per le scuole sono in [[Vendita alle scuole]].
