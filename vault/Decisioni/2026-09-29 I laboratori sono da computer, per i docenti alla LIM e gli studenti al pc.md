---
stato: decisa
aggiornato: 2026-09-29
tag: [decisione, laboratori, prodotto]
---
# I laboratori sono da computer, per i docenti alla LIM e gli studenti al pc

## Decisione
I [[Laboratori]] si usano da computer, con tastiera e mouse in prima persona (WASD per muoversi, il mouse per guardare, clic o E per usare un oggetto). Sono pensati per due casi: il docente che fa l'esperimento alla LIM davanti alla classe, e lo studente al pc, a casa o nell'aula computer della scuola. Non c'è una versione per il telefono.

## Perché
Alessandro, 29 settembre 2026: "la vedo dura progettare un'esperienza utente soddisfacente al telefono, con così tanti controlli da mappare su uno schermo senza pulsanti". I controlli in prima persona sono già familiari dai videogiochi. Alternative scartate: solo studenti a casa (che richiederebbe il telefono), docenti e studenti su ogni dispositivo.

## Conseguenze
- Il prototipo ha già tolto il layout per il telefono e ha i controlli in prima persona (`src/components/lab/engine/fps.ts`).
- Si aggancia al test con i docenti già nella beta ([[2026-09-28 Un test con i singoli docenti già nella beta]]) e alla vendita alle scuole ([[Vendita alle scuole]]).
- È un'eccezione dichiarata a [[2026-09-03 Mobile-first, poi PWA, poi Capacitor]], che per il resto del prodotto resta valida ([[App mobile]]): sul telefono la pagina deve almeno dire che serve un computer. Da fare.

## Collegamenti
- [[2026-09-29 Laboratori]]
