---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, tecnica, multigiocatore]
---
# Il laboratorio condiviso usa Cloudflare Durable Objects, non Supabase Realtime

## Decisione
Le stanze del [[Laboratorio condiviso]] girano su Cloudflare Durable Objects: un oggetto per stanza, con WebSocket, che fa da server autorevole e manda a tutti le posizioni raccolte in un messaggio per ciclo. Supabase resta per gli account (il Worker verifica il token di Supabase) e per salvare i risultati.

## Perché
Alessandro, 29 settembre 2026: preferiva Supabase, che conosce già, se la differenza non era grande. La verifica di Claude sui documenti ufficiali (consultati il 29 settembre 2026) dice che è grande:
- Supabase Realtime conta come messaggio ogni consegna a ogni iscritto. Una stanza di 32 persone a 10 aggiornamenti al secondo fa 320 × 32 = 10.240 messaggi al secondo, contro un tetto di 500 al secondo per progetto con il limite di spesa attivo e 2.500 senza. Una sola stanza supera il tetto; con 32 persone ciascuna potrebbe mandare circa 2,4 aggiornamenti al secondo.
- Stima per 50 stanze da 32 persone, 3 ore al giorno per 22 giorni di scuola: circa 300.000 dollari al mese di messaggi su Supabase; circa 47 dollari al mese su Durable Objects (3,8 miliardi di messaggi in arrivo, fatturati 20 a 1, più la durata). Con 300 stanze circa 280 dollari al mese.
- Supabase non ha un posto dove tenere il ciclo del server: le Edge Functions si fermano dopo 400 secondi. Il Durable Object della stanza è quel server.
Fonti: supabase.com/docs/guides/realtime/limits, supabase.com/docs/guides/platform/manage-your-usage/realtime-messages, developers.cloudflare.com/durable-objects/platform/pricing, developers.cloudflare.com/durable-objects/platform/limits (tutte del 29 settembre 2026). Alternative scartate: Supabase Realtime; Colyseus su server propri (server da gestire); Liveblocks (fatto per documenti condivisi). PartyServer, la libreria di PartyKit ora di Cloudflare, si può usare sopra i Durable Objects.

## Conseguenze
- Serve un account Cloudflare con il piano Workers a pagamento (5 dollari al mese) e un Worker per le stanze.
- Da verificare: il numero massimo di connessioni WebSocket per oggetto (non documentato, 32 è molto sotto qualunque limite plausibile) e la latenza reale dalle scuole italiane.
- Il motore resta stato più azioni ([[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]]): il Durable Object applica le azioni e le rimanda a tutti.

## Collegamenti
- [[2026-09-29 Il laboratorio condiviso si costruisce insieme al motore]], [[2026-09-29 Laboratori]]
