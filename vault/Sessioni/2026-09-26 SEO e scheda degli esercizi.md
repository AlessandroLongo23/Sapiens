---
aggiornato: 2026-09-26
tag: [sessione, marketing, esercizi]
---
# SEO e scheda degli esercizi

Sessione del 26 settembre 2026. Alessandro ha chiesto se il ritmo dei lotti va bene e, prima di coprire gli altri anni di matematica, una verifica della SEO: come verrebbe indicizzato Sapiens andando in produzione adesso, cosa cambierebbe con un dominio vero e quale scegliere.

## Cosa si è deciso
- Il ritmo dei lotti va bene: dal 23 al 26 settembre si è passati da 18 a 51 lezioni, il quinto lotto chiude il primo anno. Il collo di bottiglia è la rilettura di Andrea, che ha in coda tutte le note dei lotti. Si continua così, ma senza chiedere a Google di indicizzare lezioni non rilette.
- Pagine senza contenuto fuori dalla ricerca, senza toglierle dal sito: capitoli, materie e livelli senza lezioni pubblicate sono `noindex` e fuori dalla sitemap, le flashcard sono `noindex` (Alessandro ha approvato la proposta di Claude).
- [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]]: idea di Alessandro, due modalità di esercizio (telefono e scrivania) e aggancio per la ricerca.
- La correzione dalla foto dello svolgimento resta un'idea, in [[Foto e soluzione]].

## Cosa si è fatto
- Verifica della produzione con richieste da Googlebot: dettagli in [[SEO]].
- Commit `59d7154`: le 404 dentro `/materiale` e `/ripetizioni` non prendono più i meta della home.
- Commit `a54a507`: `noindex` e sitemap per i nodi vuoti, descrizioni che contano le lezioni pubblicate, flashcard `noindex`, `scripts/check-seo.mjs`. Sitemap da 469 a 232 URL.
- Commit `c170b79`: la scheda degli esercizi. Provata nel browser a 1400 e 390 px su prodotti notevoli, prime definizioni e operazioni con le frazioni algebriche. In locale 243 pagine su 243 passano il controllo, mediana 980 parole (415 prima della scheda, 129 in produzione).
- Niente è ancora pubblicato: serve un deploy.

## Informazioni nuove
- Il sito non risulta indicizzato e Search Console non è collegato.
- Una lezione pesa 1,5 MB di HTML, di cui 1,15 MB di payload React che ripete il testo.

## Domande aperte
- Il dominio: consiglio di Claude un `.it` col nome del marchio, da comprare prima di chiedere l'indicizzazione. Vedi [[SEO]].
- Livelli con esercizi lunghi per la scheda.
- Quando fare la correzione dalla foto: proposta dopo la beta, per Studio.
