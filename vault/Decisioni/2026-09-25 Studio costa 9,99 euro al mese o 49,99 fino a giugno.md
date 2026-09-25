---
stato: decisa
aggiornato: 2026-09-25
tag: [decisione, business]
---
# Studio costa 9,99 euro al mese o 49,99 fino a giugno

## Decisione
Il piano Studio della [[Release Beta]] costa €9,99 al mese, IVA inclusa. Accanto al mensile c'è un piano fino a giugno a €49,99 in un solo pagamento, pari a €8,33 al mese su sei mesi. Il piano fino a giugno è un pagamento unico, non un abbonamento: dà accesso fino al 30 giugno, non si rinnova e si vende solo a gennaio e febbraio; da marzo la pagina offre solo il mensile. Nessun prezzo più basso per chi si abbona durante la beta: un solo prezzo per tutti.

## Perché
- I concorrenti espongono un mensile alto e vendono il piano lungo (prezzi rilevati il 25 settembre 2026): Skuola.net Premium €12,79 al mese o €3,99 al mese con l'annuale (centro assistenza di Skuola.net); Photomath Plus circa 9,99 dollari al mese o 69,99 all'anno, Quizlet Plus 7,99 dollari al mese o 35,99 all'anno (fonti secondarie, da verificare); Knowunity Pro da €27,99 all'anno (knowunity.it). €9,99 è in linea con il mensile degli altri.
- Netto per abbonato: da €9,99 restano €8,19 dopo l'IVA al 22% e circa €7,80 dopo la commissione di Stripe (1,5% più €0,25 per le carte europee, da verificare). Da €7,99 sarebbero circa €6,20.
- La beta parte a gennaio e l'anno scolastico finisce a giugno: sei mesi, come il piano semestrale che il codice gestisce già (5 mesi pagati su 6). Un annuale comprato a gennaio pagherebbe soprattutto l'estate. Per il genitore €49,99 sono circa due ore di ripetizione (€20-30 l'ora, vedi [[MARKETPLACE]]).
- Abbassare il prezzo dopo è facile; alzarlo vuol dire gestire chi paga già il prezzo vecchio.

- Con una fine fissa al 30 giugno, da marzo il piano lungo costerebbe più del mensile; per questo si vende solo nei primi due mesi. Nessun rinnovo automatico addebita un genitore a luglio.

Alternative scartate: €7,99 o €8,99 al mese; piano annuale; solo mensile; piano fino a giugno con prezzo che scende mese per mese; abbonamento semestrale di sei mesi dall'acquisto, che comprato ad aprile avrebbe coperto l'estate e si sarebbe rinnovato; prezzo "fondatori" più basso per sempre per chi si abbona nella beta, che avrebbe lasciato un secondo prezzo da mantenere in Stripe e sulla pagina.

## Conseguenze
- Da cambiare, quando Alessandro lo chiede: `src/lib/stripe/config.ts` (via Lite, Base e Pro, dentro Studio; il piano fino a giugno come pagamento unico con Checkout in modalità pagamento, e il webhook che scrive in `app_metadata` la scadenza del 30 giugno), i prezzi nel sandbox di Stripe e le variabili `PUBLIC_STRIPE_PRICE_*` su Vercel, la pagina prezzi.
- Aggiornate [[Piani e prezzi]], [[Concorrenti]], [[Agenda]], [[Home]].

## Collegamenti
- [[2026-09-23 Piani che crescono con le funzioni]], [[2026-09-23 Prova al contrario e sessione gratuita giornaliera]]
