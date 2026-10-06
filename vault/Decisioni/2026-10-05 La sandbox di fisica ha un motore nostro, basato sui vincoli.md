---
stato: decisa
aggiornato: 2026-10-05
tag: [decisione, fisica, tecnica, strumenti]
---
# La sandbox di fisica ha un motore nostro, basato sui vincoli

## Decisione
La [[Sandbox di fisica]] ha un motore fisico, scritto da noi, in unità SI: a ogni passo calcola insieme le accelerazioni dei corpi e le forze dei vincoli. Supera in parte la decisione del 29 settembre 2026, che diceva "non si usa un motore fisico": quella resta valida per le figure delle lezioni e per le scene degli esercizi.

## Perché
Alessandro, il 5 ottobre 2026, ha proposto la sandbox e ha approvato il piano di Claude. Una scena che compone l'utente non ha una formula chiusa, quindi serve un motore. Il motivo della decisione del 29 settembre però resta: la simulazione deve dare i numeri della lezione. Per questo il motore risolve i vincoli e non li approssima: la tensione di una corda e la reazione di un piano sono incognite dello stesso sistema delle accelerazioni, e un sistema con forze costanti segue la sua legge chiusa.

Alternativa scartata: Matter.js o Planck.js. Hanno unità proprie, corde fatte di catene elastiche, contatti che rimbalzano, e non danno la tensione o la reazione da leggere, che sono le cose che un esercizio chiede.

## Conseguenze
- Il motore è in `src/lib/sandbox/engine.ts`, con i test in `tests/unit/sandbox.test.mjs` che lo confrontano con le formule chiuse.
- Ogni pezzo nuovo (molla, urti, corpi che ruotano) è lavoro nostro, da aggiungere quando una lezione lo chiede.
- Aggiornate [[Sandbox di fisica]], [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]], [[Agenda]] e `Home.md`.

## Collegamenti
- [[Sandbox di fisica]]
- [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]
- [[2026-10-05 La prima sandbox ha corpi che non ruotano, con statica e moto insieme]]
- [[2026-10-05 Strumenti nelle lezioni]]
