---
stato: decisa
aggiornato: 2026-10-05
tag: [decisione, fisica, strumenti]
---
# La prima sandbox ha corpi che non ruotano, con statica e moto insieme

## Decisione
Nella prima versione della [[Sandbox di fisica]] i corpi sono punti materiali e blocchi che non ruotano, e i pezzi si agganciano tra loro. Il primo set è: pavimento, soffitto e parete, piano inclinato con attrito, massa, corda ideale, carrucola. Statica e moto ci sono insieme dall'inizio. Si parte da poche scene pronte con il motore controllato sulle formule chiuse; l'editor viene dopo.

## Perché
Alessandro, il 5 ottobre 2026, aveva proposto di partire da piani inclinati, vincoli, masse e corde, e ha approvato il piano di Claude, che aggiungeva tre cose.

- Corpi estesi che ruotano, si urtano e si impilano sono un motore completo, e la dinamica rotazionale è fuori dal programma del biennio.
- La carrucola: senza, la corda serve solo ad appendere. Con la carrucola ci sono la macchina di Atwood e il blocco sul piano inclinato tirato da un peso.
- La statica: corde in tensione e vincoli sono il capitolo dell'equilibrio del primo anno, e per il motore è lo stesso calcolo con accelerazione zero.

Le scene prima dell'editor perché, se i numeri del motore non tornano, conviene scoprirlo prima di aver costruito l'interfaccia.

## Conseguenze
- Le cinque scene di partenza sono in `src/lib/sandbox/scenes.ts`. Il lancio è un moto libero sotto la gravità, con l'atterraggio anelastico.
- Restano fuori: urti tra corpi, rotazione, molle, carrucole mobili, più di una carrucola per corda.
- Aggiornate [[Sandbox di fisica]], [[Agenda]] e `Home.md`.

## Collegamenti
- [[Sandbox di fisica]]
- [[2026-10-05 La sandbox di fisica ha un motore nostro, basato sui vincoli]]
