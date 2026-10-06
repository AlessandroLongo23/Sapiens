---
aggiornato: 2026-10-06
tag: [sessione, laboratori, quaderno]
---
# Quaderno di laboratorio

6 ottobre 2026. Alessandro ha proposto di rifare il quaderno del laboratorio: si apre con B, a mani libere, con il mouse che torna un cursore; ha pagine di strumenti e sostanze, passi, pagine da compilare e pagine vuote; quello che si scrive va nello Zaino, in pagine A5. Decisioni: [[2026-10-06 Il quaderno del laboratorio si apre con B ed è una pagina in cui si scrive]] e [[2026-10-06 Le pagine del quaderno di laboratorio sono A5 e finiscono nello Zaino]].

## Piano
1. Il modello del quaderno senza grafica (`engine/notebook.ts`): pagine, valori dei campi, verifica chiesta all'esperimento, aperto o in sola lettura, tutto serializzabile.
2. Il quaderno a schermo (`src/components/lab/quaderno/`): due pagine A5 affiancate ridotte a stare nello schermo, linguette per le sezioni, campi (numero, testo, scelta), tabelle, scale di colore, appunti liberi.
3. B per aprire e chiudere (`fps.ts`, `free.ts`): mani libere per scrivere, sola lettura altrimenti; il corpo resta fermo; con il controller Share o View.
4. Le immagini di strumenti e sostanze, rese in Blender dagli stessi modelli (`scripts/lab/render_kit.py`, `public/lab/strumenti/`).
5. I tre esperimenti: strumenti, passi con l'indice di tutti i passi, appunti; poi le pagine da compilare.
   - Titolazione: tabella delle letture scritta dallo studente con la lente della buretta nella pagina, volumi, media e concentrazione calcolati da lui, scala della fenolftaleina. Blocca i passi.
   - Saggi alla fiamma: tabella dei colori con scelta da una scala. Non blocca i passi.
   - Solfato di rame: moli di acido, ossido stechiometrico, resa teorica, osservazioni. Non blocca i passi.
6. Test: i tre script end-to-end aggiornati al quaderno nuovo; revisori critici.

Rimandato: il salvataggio nello Zaino (serve un tipo di nota a pagine fisse), le formule con MathLive.

## Esito
Fatto il piano fino al punto 6. Nel codice locale, non committato. Come funziona è in [[Laboratori]], sezione "Il quaderno di laboratorio".

File nuovi: `src/components/lab/quaderno/Quaderno.tsx`, `BuretteLens.tsx`, `pagine.ts`; `scripts/lab/render_kit.py`; `public/lab/strumenti/` (26 immagini, 0,4 MB); `tests/unit/lab-quaderno.test.mjs`.

File cambiati: `engine/notebook.ts` (riscritto: è il modello, senza grafica), `fps.ts` (B, Share o View; lo stato "quaderno aperto" in cui il mouse è libero e il gioco continua), `scene.ts`, `free.ts` (regola delle mani libere, niente più quaderno sul banco), `titolazione.ts`, `saggi.ts`, `esperimento.ts` (le pagine di ciascuno), `Esperimento.tsx`, `Banco.tsx`, `hud.tsx`, e i due test `titolazione.mjs` e `fiamma.mjs`.

Trovato dal revisore critico e corretto:
- Un valore digitato e non confermato si perdeva chiudendo con Esc o con un clic fuori: ora chiudere o girare pagina lo giudica.
- Con il controller i numeri non si riuscivano a scrivere (un passo a pressione, da zero): ora tenendo premuto la croce accelera, una lettura finale parte da quella iniziale, e croce (A) conferma.
- I messaggi del gioco finivano dietro le linguette: ora stanno nella riga sotto il quaderno.
- Il quaderno scriveva ancora da sé il NaOH usato nella prova, che lo studente deve calcolare.
- Il quaderno aperto dal gioco alla fine era scrivibile anche con le mani piene.
- Riapriva sempre sui passi; due linguette accese insieme; campi non di turno uguali agli altri; testi piccoli; righe degli appunti sfasate rispetto ai quadretti.
- Nei testi: la pipetta "rilascia" 25,0 mL (non "contiene"); il colore del solfato non è dato dalle "cinque molecole di acqua".

Non corretto, da sapere:
- Il gioco non va in pausa con il quaderno aperto: un rubinetto lasciato aperto continua a scendere. Il quaderno lo segnala nella riga in basso.
- Nei saggi alla fiamma le risposte sui campioni X e Y restano sui cartellini, con la rotella.
- Chiudere il quaderno dal controller in una partita iniziata con il mouse chiede al browser di catturare di nuovo il mouse senza un gesto dell'utente: dove il browser rifiuta, il gioco va in pausa.
- L'accessibilità è parziale: i campi hanno un'etichetta, ma il quaderno non è stato provato con un lettore di schermo.

Verifiche del 6 ottobre: 29 test unitari (titolazione, saggi, quaderno); `titolazione.mjs` 196 controlli su 196 nelle quattro configurazioni; `fiamma.mjs` 117 su 117 nel banco e nell'aula; 16 azioni su 16 del solfato; `tsc` ed `eslint` puliti sui file del laboratorio.

I test nel browser a volte falliscono a metà per una causa esterna: il server di sviluppo ricarica la pagina quando un'altra sessione modifica file del progetto, e il laboratorio riparte da capo (visto nel dettaglio di un controllo fallito: buretta vuota e gioco non avviato alla terza titolazione). Rilanciati, passano.

## Da fare
- Salvare la relazione nello [[Zaino]] (tipo di nota a pagine A5 fisse, valori come dati).
- Formule con MathLive nei campi e negli appunti.
- Le risposte dei campioni incogniti nel quaderno, togliendo i cartellini.
- Una pagina con la curva di titolazione.
