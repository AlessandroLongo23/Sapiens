---
stato: idea
aggiornato: 2026-09-23
tag: [idea, studenti, algoritmo]
---
# Ripasso pianificato prima di una verifica

## L'idea
Lo studente segna una verifica o un'interrogazione nel [[Diario e calendario]]. Sapiens organizza da solo il ripasso fino a quella data: quali argomenti, quali esercizi e flashcard, in che ordine e in quali giorni, in base a come sono andate le sessioni precedenti. Candidata a un piano a pagamento più avanzato.

## L'algoritmo che Alessandro ricordava
Quasi certamente è FSRS (Free Spaced Repetition Scheduler), del progetto open source open-spaced-repetition. Si basa sul modello DSR (difficoltà, stabilità, recuperabilità): per ogni carta stima lo stato della memoria e quando la si sta per dimenticare. L'utente sceglie la ritenzione desiderata, cioè la quota di carte da ricordare quando tornano, con valori ragionevoli tra 70% e 97%. I parametri predefiniti vengono da circa 727 milioni di ripassi di 10.000 utenti e si possono ottimizzare sulla storia del singolo. Dalla versione 23.10 (2023) è integrato in Anki, e secondo i benchmark del progetto richiede circa il 20-30% di ripassi in meno di SM-2 a parità di ritenzione. Esistono implementazioni pronte, anche in TypeScript.

Fonti: wiki di fsrs4anki su GitHub ("ABC of FSRS", "The optimal retention"); FAQ di Anki "What spaced repetition algorithm does Anki use?"; consultate il 23 settembre 2026.

## Dubbi e conflitti
- FSRS serve a ricordare a lungo termine, non ad arrivare pronti a una data. Per una verifica serve un livello sopra: concentrare i ripassi prima della data, per esempio alzando la ritenzione desiderata man mano che la verifica si avvicina.
- Funziona bene su flashcard (una domanda, una risposta). Per gli esercizi generati l'unità da ripassare è il tipo di esercizio a un certo livello, e conta anche la velocità, non solo giusto o sbagliato.
- Richiede la storia dei tentativi: la tabella decisa in [[2026-09-23 Progressi salvati per ogni tentativo]] è la base.

## Collegamenti
- [[Flashcard]], [[Pratica quotidiana]], [[Esercizi]], [[Piani e prezzi]]
