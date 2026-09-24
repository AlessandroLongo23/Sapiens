---
stato: bozza
aggiornato: 2026-09-23
tag: [tecnica, mobile]
---
# App mobile

Decisione in [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]].

## Stato attuale
- Layout pensato per il telefono, con tab bar e pannelli dal basso (commit dell'8 settembre 2026).
- `capacitor.config.json` e `android/`: wrapper Capacitor che carica il sito dal deployment.
- Manifest e icone ci sono; manca il service worker.

## Obiettivo
1. PWA installabile: service worker che salva l'app e le ultime lezioni lette per aprirle senza rete; invito a installare dopo la seconda visita.
2. App Android e iOS con Capacitor quando i numeri di ritorno lo giustificano, con notifiche native.

## Attenzione
Apple richiede l'acquisto in app per gli abbonamenti digitali venduti dentro l'app iOS, e non permette di rimandare al pagamento sul web. Da considerare nel prezzo e nel flusso.

## Idee
Dal vecchio [[TODO]]: l'app deve essere complementare al sito, non una copia. Vedi [[Foto e soluzione]].
