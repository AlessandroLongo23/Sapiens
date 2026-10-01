---
stato: decisa
aggiornato: 2026-10-01
tag: [decisione, strumenti, chimica, seo]
---
# La tavola periodica sta tra gli strumenti, con una pagina sua

## Decisione
La tavola periodica vive all'indirizzo `/strumenti/tavola-periodica`, con una carta nell'indice degli strumenti sotto Chimica. Ha un layout proprio e non usa lo scheletro dei calcolatori. Lo stesso componente si monta anche nelle lezioni di chimica.

## Perché
Alessandro, il 1° ottobre 2026, ha chiesto se aggiungerla tra gli strumenti o da un'altra parte, perché è una ricerca molto frequente tra gli studenti.

Chi cerca una tavola periodica vuole uno strumento: nella ricerca del 1° ottobre 2026 (Claude, ricerca web dagli Stati Uniti, ordine su google.it da verificare) in cima ci sono Zanichelli, Ptable, Wikipedia, dsapp.it e chemgenius.it, che la tiene sotto `/strumenti/tavola-periodica/`. È il secondo criterio di [[Calcolatori e convertitori]]: le ricerche sono da strumento, e una lezione non le prenderebbe. La sezione ha già una categoria Chimica con 7 pagine (massa molare, grammi e moli, molarità, diluizione, pH, formula minima, reagente limitante) che si collegano alla tavola.

Lo scheletro dei calcolatori non va bene: `ToolPage` è fatto per input, risultato e passaggi, e il titolo della pagina esce come "… online, con i passaggi". La tavola è una griglia con una scheda per elemento.

Alternative scartate:
- Alla radice del sito (`/tavola-periodica`). Indirizzo più corto, ma fuori dalla sezione che ha già gli strumenti di chimica.
- Dentro il materiale di chimica, accanto alle lezioni. L'intento di ricerca è da strumento e lì si perderebbe tra le lezioni.

## Conseguenze
- Serve una route propria dentro `src/app/(site)/strumenti/`, accanto a `[slug]`, e una carta nell'indice che non passa dal registro dei calcolatori così com'è (`src/lib/tools/registry.ts` presuppone un motore, un esempio svolto e un articolo). Da vedere quando si scrive.
- L'idea è diventata una nota di prodotto: [[Tavola periodica interattiva]], spostata da `Idee/` a `Prodotti/Studenti/`.
- Aggiornate [[Calcolatori e convertitori]], [[Agenda]] e [[Home]].

## Collegamenti
- [[Tavola periodica interattiva]], [[Calcolatori e convertitori]], [[SEO]], [[Lezioni]]
- [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]], [[2026-10-01 La prima tavola periodica è ampia come Ptable e si fa subito]]
