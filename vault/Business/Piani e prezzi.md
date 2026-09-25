---
stato: bozza
aggiornato: 2026-09-25
tag: [business]
---
# Piani e prezzi

## Stato attuale
Dal 25 settembre 2026, nel codice (non ancora pubblicato con un deploy), in `src/lib/stripe/config.ts`:

| Piano | Prezzo | Cosa include |
|---|---|---|
| Free | €0 | Teoria e formulari; una sessione di esercizi al giorno (10 domande, contate sul server in ora di Roma su tutte le lezioni); Zaino con 1 quaderno e 5 note |
| Studio | €9,99 al mese, IVA inclusa | Esercizi senza limiti, flashcard, Zaino senza limiti, Sapiens AI |
| Studio fino a giugno | €49,99 in un solo pagamento | Studio fino al 30 giugno; in vendita solo a gennaio e febbraio, non si rinnova |

- Prova al contrario: i primi 7 giorni dopo la creazione dell'account valgono come Studio, senza carta e senza Stripe (`planOf` in `src/lib/auth/entitlements.ts`). Il Checkout non ha più una prova.
- Il piano in vigore viene, in ordine, dall'abbonamento (`app_metadata.subscription`, scritto dal webhook), dal piano fino a giugno (`app_metadata.pass`, scritto dal webhook quando il pagamento è arrivato e tolto se viene rimborsato per intero), dalla prova, altrimenti è Free. I vecchi piani `lite`, `base` e `pro` rimasti su qualche account valgono come Studio.
- Stripe, sandbox "Sapiens sandbox": prodotto "Sapiens Studio" con due prezzi IVA inclusa, `price_1UJUNcK9L252GFViRe4tpf0D` (mensile) e `price_1UJUNcK9L252GFViUKVdfDl6` (fino a giugno). Su Vercel (Production) `PUBLIC_STRIPE_PRICE_STUDIO` e `PUBLIC_STRIPE_PRICE_STUDIO_JUNE`. Il webhook ascolta anche `checkout.session.async_payment_succeeded` e `charge.refunded`.
- Aggiornati pagina prezzi, pagina dell'abbonamento, paywall, termini e informativa sulla privacy (versione 2026-09-25, con i tentativi degli esercizi tra i dati conservati), FAQ.
- Provato il 25 settembre 2026 con account di prova poi cancellati: prova di 7 giorni, sessione gratuita esaurita dopo 10 risposte, abbonamento mensile addebitato €9,99, disdetta, piano fino a giugno scritto dal webhook, rifiutato a settembre, tolto dal rimborso. Il pagamento sulla pagina di Stripe non si può automatizzare (hCaptcha): va provato una volta a mano.

## Deciso
- Scala dei piani: Free, Studio (€7,99-9,99), Plus (circa €15-20, quando le sue funzioni esistono), Famiglia (circa €30, con la v2). Nella beta solo Free e Studio. Vedi [[2026-09-23 Piani che crescono con le funzioni]].
- Prova al contrario di 7 giorni, poi Free con una sessione di esercizi al giorno. Vedi [[2026-09-23 Prova al contrario e sessione gratuita giornaliera]].
- Formulari e calcolatrici gratuiti. Vedi [[2026-09-23 Formulari e calcolatrici gratuiti]].
- Il Pro non include più ore di ripetizione. Diventa Base più contatto con il tutor pagato da Sapiens più [[Area genitori]], ed esce con la [[Release v2 Tutor]]. Fino ad allora c'è solo una lista d'attesa. Vedi [[2026-09-23 Il piano Pro non include ore di ripetizione]].
- L'AI è a pagamento fin dalla [[Release Beta]].
- Studio costa €9,99 al mese, oppure €49,99 in un solo pagamento fino a giugno; nessun prezzo diverso per chi si abbona nella beta. Il piano fino a giugno è un pagamento unico con accesso fino al 30 giugno, senza rinnovo, in vendita a gennaio e febbraio. Vedi [[2026-09-25 Studio costa 9,99 euro al mese o 49,99 fino a giugno]].

## Discussione del 23 settembre 2026
Idea di Alessandro: piani da gratuito fino a un piano completo (AI e contatto con il tutor) intorno a €50-60 al mese, con piani intermedi intorno a €5-10 e €25-30. Esercizi, formulari e flashcard a pagamento; Zaino con un'anteprima gratuita e illimitato a pagamento; le funzioni AI nel piano più alto prima del Pro, perché l'inferenza costa.

Fatti emersi nella discussione:
- L'AI costa tra pochi centesimi e circa 3 dollari al mese per studente (vedi [[Provider AI]]). Non giustifica da sola un salto di prezzo tra piani.
- Anche lo spazio per le note costa pochissimo: una nota è testo, al massimo 200.000 caratteri. I limiti vanno decisi per il valore che danno, non per il costo.
- I formulari sono anche strumenti compensativi DSA, che la decisione [[2026-09-23 Strumenti DSA aperti a tutti, senza certificazione]] rende accessibili a tutti. Metterli a pagamento vuol dire far pagare uno strumento compensativo.
- Riferimenti di prezzo per le famiglie, da [[MARKETPLACE]]: un'ora di ripetizione alle superiori costa €20-30; il pass studente di Superprof €29 al mese, quello di Letuelezioni €19. Un piano da €50-60 viene confrontato con 2-3 ore di ripetizione.
- Anteprima gratuita: Duolingo, completamente gratuito nei contenuti, aveva a fine 2025 il 9,2% degli utenti mensili abbonati (12,2 milioni su 133,1 milioni, bilancio 2025). Per il software in abbonamento, le analisi di settore riportano per il freemium classico conversioni intorno al 2-5% e per la "prova al contrario" (tutto sbloccato per qualche giorno, poi si torna al piano gratuito) intorno all'8-12% (OpenView, riportato da fonti secondarie, da verificare).

## Domande aperte
- Limite giornaliero di Sapiens AI in Studio: deciso di rimandarlo il 25 settembre 2026; la pagina non promette "illimitato".
- Studio si vende anche dentro l'app iOS? Apple trattiene il 15% (programma per le piccole imprese, da verificare).
- Il prezzo del Pro, una volta tolta l'ora (€59,99 non ha più senso).
- I prezzi Lite e Base sono giusti per le famiglie italiane? Confronto con i concorrenti in [[Concorrenti]].
- Piano famiglia con più figli?
- Piano annuale, prezzi per studenti universitari.
- Tutti i piani studente sono B2C: il piano per il singolo docente e la licenza per le scuole sono in [[Vendita alle scuole]].
