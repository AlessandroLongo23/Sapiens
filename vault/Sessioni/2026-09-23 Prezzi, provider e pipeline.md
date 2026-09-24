---
aggiornato: 2026-09-23
tag: [sessione]
---
# Prezzi, provider e pipeline

Seconda sessione del 23 settembre 2026. Chiusa per un guasto della shell: nessun comando poteva essere eseguito.

## Da riprendere nella prossima sessione
1. **Eseguire il prototipo della pipeline**, che è scritto ma non è mai stato eseguito. File creati: `specs/exercises/equazioni-secondo-grado.md`, `src/lib/exercises/v2/` (tipi, RNG con seed, razionali, LaTeX, registro, generatore), `scripts/exercises/` (`sample.mts`, `verify.py`, `review.mts`, README). Comandi dalla root:
   - `node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts equazioni-secondo-grado 1000 all 1 | python3 scripts/exercises/verify.py`
   - `node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/review.mts`, che scrive la pagina con i campioni da rivedere
   - `tsc` sui soli file `v2`, comando nel README

   Correggere finché la verifica passa, rivedere i campioni, poi collegare il generatore al sito al posto di `equazioni-secondo-grado.js`, che è rotto.
2. **Da confermare con Alessandro:** ai livelli 1 e 2 il prototipo esclude le equazioni incomplete (b=0 o c=0). Proposta: tenerle come livello a parte, perché sono le prime che si studiano.
3. **Rifare il controllo dei link del vault**, che questa sessione non ha potuto eseguire.
4. **Poi, in ordine di [[Agenda]]:** richiesta a OpenAI per la conservazione zero dei dati, schema della tabella dei tentativi, prezzo esatto di Studio.

## Stato di git
Niente è committato. ROADMAP, MARKETPLACE e TODO sono rinominati in `vault/Archivio/` e in stage. Il vault, CLAUDE.md, le skill `vault` e `sparring` e i file del prototipo non sono tracciati. Il lavoro di Alessandro sullo Zaino (modificato e non committato) non è stato toccato.

## Decisioni
- [[2026-09-23 Niente interviste, il prodotto nasce dall'esperienza diretta]]
- [[2026-09-23 Accordi sui diritti rimandati a quando ci saranno ricavi]]
- [[2026-09-23 Progressi salvati per ogni tentativo]]
- [[2026-09-23 Piani che crescono con le funzioni]]
- [[2026-09-23 Prova al contrario e sessione gratuita giornaliera]]
- [[2026-09-23 Formulari e calcolatrici gratuiti]]
- [[2026-09-23 OpenAI con dati nell'UE per la beta]]

## Informazioni nuove
- Il vecchio livello degli esercizi è in gran parte rotto: 6 generatori su 15 falliscono sempre (vedi [[Esercizi]]).
- La libreria in `src/lib/math` è un CAS parziale non funzionante (vedi [[Pipeline esercizi]]).
- Il costo dell'AI per studente è marginale (vedi [[Provider AI]]).
- L'algoritmo di ripasso che Alessandro ricordava è FSRS (vedi [[Ripasso pianificato prima di una verifica]]).

## Idee registrate
[[Ripasso pianificato prima di una verifica]], [[Video di spiegazione e di esercizi svolti]], [[AI sugli appunti]], [[Dettatura e scrittura a mano]], [[Registrazione e riassunto delle lezioni in classe]].

## Fonti consultate il 23 settembre 2026
- Provider AI: developers.openai.com/api/docs/pricing, /guides/your-data, /guides/safety-checks/under-18-api-guidance; platform.claude.com/docs/en/about-claude/pricing, /manage-claude/data-residency, /build-with-claude/claude-in-amazon-bedrock; anthropic.com/legal/aup; support.claude.com/en/articles/9307344; ai.google.dev/gemini-api/docs/pricing e /terms; cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency (solo estratto); mistral.ai/pricing/api; legal.mistral.ai/terms/commercial-terms-of-service.
- Duolingo: modulo 10-K per il 2025 (sec.gov), 12,2 milioni di abbonati e 133,1 milioni di utenti mensili al 31 dicembre 2025.
- Freemium e prova al contrario: Lenny's Newsletter "What is a good free-to-paid conversion"; ChartMogul "SaaS Conversion Report"; articoli secondari che riportano i dati OpenView 2023.
- FSRS: wiki di github.com/open-spaced-repetition/fsrs4anki; faqs.ankiweb.net/what-spaced-repetition-algorithm.
