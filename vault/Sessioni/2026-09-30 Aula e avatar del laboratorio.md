---
data: 2026-09-30
tag: [sessione, laboratori]
---
# Aula e avatar del laboratorio

## Di cosa si è parlato
Sessione nata da un ramo della [[2026-09-30 Laboratori, la fetta verticale]], dedicata alla scena con più persone. Prima le prestazioni (misura, ottimizzazione, prima e dopo: vedi [[Laboratori]], sezione Prestazioni), poi gli avatar e l'aula intera.

Alessandro non amava l'avatar e ha proposto uno stile per i volti, la personalizzazione e un solo sistema per 2D e 3D, con i riferimenti di Toy Faces. Claude: le forme sì, il lucido no, perché stona con il quaderno del sito e con il laboratorio pittorico; nel sito l'avatar diventa un adesivo. Poi il kit in Blender, costruito con Alessandro che guardava la finestra di Blender in diretta.

Poi l'aula: Alessandro ha proposto file di banchi doppi, docente da un lato, armadi su un lato e in fondo, finestre sull'altro lato lungo. La ricerca sulle guide britanniche (BB80, CLEAPSS G14) conferma le file rivolte alla lavagna, e aggiunge la lavagna a 90° dalle finestre, la cappa accanto al docente e il muro degli armadi vicino alla porta. Sul numero di posti (la pianta ne ha 12, le classi 24 e oltre) si è arrivati alla postazione come unità e all'aula scelta all'avvio.

## Decisioni
- [[2026-09-30 Gli avatar sono un kit di forme semplici, opachi nel laboratorio e adesivi nel sito]]
- [[2026-09-30 Nel laboratorio condiviso la postazione è l'unità, per gruppi da 1 a 3]]
- [[2026-09-30 L'aula si sceglie all'avvio dai presenti, e si ottimizza per la classe intera]]

## Cosa si è fatto
- Il kit degli avatar (`scripts/lab/avatar_kit.py`) e la sua composizione nella pagina (`avatar-kit.ts`).
- L'aula `/laboratorio/aula` (`scripts/lab/build_aula.py`, `classroom.ts`), la bozza senza luce `/laboratorio/aula-bozza`, la pianta disegnata; `build_banco.py` ora si può importare e ha più porte.
- Il giocatore gira intorno ai mobili; ombre del sole e ombre di contatto su tutta l'aula; l'esperimento completo passa anche nell'aula.
- Tre cotture della luce per misurarne i tempi: 10 minuti (1024), 11 minuti e mezzo (2048, con il computer libero), 2 ore e 33 minuti (4096, insieme ad altre cotture). Alessandro ha confrontato media e alta su dieci viste e cinque ingrandimenti e le ha trovate praticamente uguali: si tiene la media.

## Rimasto aperto
- Le tre forme del viso, l'adesivo 2D dell'avatar, l'editor nell'account, la prova delle proporzioni con studenti veri.
- I livelli di dettaglio degli avatar lontani, il profilo "computer di scuola" nel banco di prova, una misura su un PC con grafica integrata.
- Le aule da 16 e 24 postazioni, la sala d'attesa, il kit su ogni postazione.
- Gli strumenti del banco di fondo e la cappa, oggi arredo, da rendere utilizzabili.
- Sostituire `/laboratorio` con l'aula, se piace.
