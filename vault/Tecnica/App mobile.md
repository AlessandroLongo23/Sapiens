---
stato: in sviluppo
aggiornato: 2026-09-25
tag: [tecnica, mobile]
---
# App mobile

Decisione in [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]].

## Stato attuale
- Layout pensato per il telefono, con tab bar e pannelli dal basso (commit dell'8 settembre 2026). L'header rispetta la barra di stato (`pt-safe-t`) dal 24 settembre 2026, quando la pagina occupa tutto lo schermo.
- PWA (24 settembre 2026): `public/sw.js` salva i file statici, le immagini e le ultime 30 pagine di `/materiale` aperte; senza rete una lezione salvata si riapre, le altre pagine mostrano `public/offline.html` con l'elenco delle lezioni salvate. Le pagine con dati personali (Zaino, account, admin, API) non si salvano mai. Il service worker si registra solo nella build di produzione. Dal secondo giorno di visita compare l'invito a installare (`InstallPrompt`): pulsante "Installa" su Chrome ed Edge, istruzioni su Safari per iOS; non compare dentro l'app Capacitor né quando l'app è già installata.
- Capacitor 8 (`capacitor.config.json`, `android/`, `ios/`): wrapper che carica il sito dal deployment. Android migrato da Capacitor 6/7 il 24 settembre 2026 (Gradle 8.14, SDK 36); progetto iOS creato lo stesso giorno. Tutti e due compilano e girano nei simulatori.
- Modalità app (24 settembre 2026). Il 24 settembre Alessandro ha provato l'APK e ha detto che l'app sembrava un sito per computer ristretto sul telefono: si apriva sulla pagina di vendita, aveva due navigazioni (hamburger e tab bar), le briciole di pane, il footer e intestazioni da copertina con i contatori. Ora, quando Sapiens gira installato sul telefono (PWA dalla schermata Home, o Capacitor, che aggiunge `SapiensApp` allo user agent), uno script in `<head>` mette la classe `app` su `<html>` prima del primo disegno, e la variante Tailwind `app:` (sempre con `max-md:`) cambia la struttura: l'app si apre su `APP_START` (Matematica delle superiori) e non mostra mai la landing; l'header è una freccia indietro più la ricerca; la tab bar è Materiale, Zaino, Ripetizioni, Profilo, e Profilo apre il foglio con account, tema, sezioni e link legali; spariscono briciole, contatori, footer ed etichette "Vai alla lezione"; i titoli sono più piccoli; il contenuto sfuma tra una pagina e l'altra (`ViewTransition` in `Shell`); niente selezione del testo né menu del tocco prolungato sui comandi. La freccia torna indietro nella cronologia dell'app, oppure sale alla pagina madre se l'app è stata aperta da un link (`src/lib/app/navigation.ts`). Il sito nel browser non cambia. Il tasto indietro di Android funziona già con Capacitor, senza codice.
- Sviluppo: con `npm run dev` avviato, `npm run cap:dev:ios` e `npm run cap:dev:android` aprono l'app nel simulatore collegata a `localhost:3000` con il live reload. Con Xcode 27 il deploy di `cap run ios` fallisce perché Simulator.app non è più dove Capacitor lo cerca: lo script `scripts/cap-dev-ios.mjs` installa e avvia l'app con `simctl`.

## Obiettivo
1. Deciso il 25 settembre 2026: l'app si apre su "Oggi" ([[2026-09-25 Oggi è lo schermo iniziale dell'app]], piano in [[Progressi dello studente]]). Una schermata iniziale dell'app, "Oggi" (lezione da riprendere, pratica quotidiana, serie di giorni), e un onboarding che chiede classe e indirizzo una volta sola, al posto di `APP_START` fisso. Da disegnare con Dario: vedi [[Agenda]].
2. PWA installabile: service worker che salva l'app e le ultime lezioni lette per aprirle senza rete; invito a installare dopo la seconda visita.
3. App Android e iOS con Capacitor quando i numeri di ritorno lo giustificano, con notifiche native.

## Attenzione
Apple richiede l'acquisto in app per gli abbonamenti digitali venduti dentro l'app iOS, e non permette di rimandare al pagamento sul web. Da considerare nel prezzo e nel flusso. Apple può anche rifiutare un'app che carica soltanto un sito remoto (linea guida 4.2, da verificare sulla versione in vigore): prima di pubblicare su App Store l'app iOS deve offrire qualcosa in più del sito, per esempio notifiche native.

## Idee
Dal vecchio [[TODO]]: l'app deve essere complementare al sito, non una copia. Vedi [[Foto e soluzione]].
