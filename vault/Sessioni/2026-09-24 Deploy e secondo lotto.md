---
aggiornato: 2026-09-24
tag: [sessione]
---
# Deploy e secondo lotto

Seguito di [[2026-09-24 Figure e organizzazione dei lotti]], il 24 settembre 2026.

## Cosa si è fatto
- Il primo lotto era stato committato da un altro agente ma non spinto: `master` era 49 commit avanti a `origin/master`, fermo al 23 dicembre 2025, e la produzione (sapiens-edu.vercel.app) era ancora il sito SvelteKit. Spinto il branch `beta-lotto-1` per avere un'anteprima Vercel.
- Anteprima controllata con `vercel curl` (è protetta dal login di Vercel): pagine, figure, sitemap (18 formulari, 18 mazzi, 18 pagine di esercizi) e redirect dei vecchi indirizzi, compresi i `/wiki/...` del sito attuale, rispondono bene. Accesso e pagamento non provati nel browser.
- Trovato un blocco per la produzione: la `STRIPE_SECRET_KEY` di produzione è una chiave di test di un vecchio account (`51SFoJ…`), mentre i prezzi `PUBLIC_STRIPE_PRICE_*` erano dell'account nuovo `…Gz1`. Decisione: fino alla beta la produzione usa il sandbox (`…PzI`). I sei prezzi di produzione ora puntano al sandbox; chiave segreta e webhook li deve impostare Alessandro dalla dashboard, perché Vercel non restituisce i valori segreti e la chiave nel `.env` locale è scaduta.
- Secondo lotto, i capitoli dei numeri del primo anno: Divisibilità e numeri primi, Numeri interi e valore assoluto, Operazioni in ℤ, Potenze in ℤ, Frazioni e numeri razionali, Operazioni in ℚ, Espressioni con frazioni, Rapporti, proporzioni e percentuali (file 19-26 in `docs/lezioni/`). Otto agenti per lezione, formulario e flashcard, poi otto per i generatori. 12 figure nuove, 154 carte, 8 generatori a 6 livelli, tutti PASS su 6.000 esercizi e di nuovo con un altro seed; prova dell'adattatore su 5.200 esercizi senza problemi; pagine, figure in tema scuro, esercizi, formulari e flashcard guardati nel browser.
- Alleggerite le lezioni che ripetevano quelle nuove: MCD e MCM perde divisibilità e scomposizione, Confronto tra frazioni perde equivalenza e riduzione, Potenze in ℚ rimanda a Potenze in ℤ per i segni; tolte 17 carte doppie e aggiunte 5 carte su MCD e MCM. Dalla pagina degli esercizi di MCD e MCM tolti i livelli su criteri e scomposizione, ora in Divisibilità.
- Tutto pubblicato nel database; il codice degli esercizi nuovi non è committato.
- Problemi a parole. Prima c'erano in 5 generatori su 26, quasi sempre in un solo livello. Il testo dei problemi arriva alla pagina come paragrafo che va a capo grazie a `src/lib/exercises/present.ts`, che però è lavoro di un altro agente non ancora committato: su master i problemi sono ancora una formula con gli a capo fissi. Aggiunto un livello 7 di problemi a quattro generatori: Operazioni in ℕ (9 storie), Operazioni in ℚ (8 storie, anche "del resto"), Rapporti, proporzioni e percentuali (ricette, scale, parti proporzionali) ed Equazioni di primo grado (9 storie: età, consecutivi, biglietti, monete, perimetri, tariffe). Le lezioni di Operazioni in ℕ e in ℚ hanno una sezione nuova sui problemi con due esempi svolti; Equazioni di primo grado ha un secondo esempio (età). Livelli 1-6 identici a prima, tutti PASS anche con un altro seed; livelli collegati e lezioni ripubblicate; controllato sul telefono che il testo vada a capo.

## Decisioni
- Produzione sul sandbox di Stripe fino alla beta (decisa in chat, da trascrivere come decisione se Alessandro la conferma).

## Informazioni nuove
- Tempo del secondo lotto: circa 5 minuti (in parallelo) per scrivere le 8 lezioni con formulari e carte, circa 11 minuti per gli 8 generatori, più verifiche e collegamento; la rilettura di Alessandro resta da fare. Costo in token degli agenti: circa 1,0 milioni per i contenuti e 1,4 milioni per i generatori.
- Dubbi aperti nelle note delle lezioni (`docs/lezioni/note/19-26`) e nelle specifiche (`specs/exercises/`): zero né positivo né negativo, notazione $b \mid a$, impropria con $\geq$, numeri misti, termini negativi nelle proporzioni.

## Prossimo argomento
Chiave Stripe e webhook del sandbox in produzione, poi merge di `beta-lotto-1` e controllo della produzione; commit del secondo lotto; rilettura dei due lotti da parte di Alessandro; terzo lotto.
