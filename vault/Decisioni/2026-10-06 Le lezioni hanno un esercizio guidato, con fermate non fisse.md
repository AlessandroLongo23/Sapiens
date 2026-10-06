---
stato: decisa
aggiornato: 2026-10-06
tag: [decisione, lezioni, esercizi]
---
# Le lezioni hanno un esercizio guidato, con fermate non fisse

## Decisione
Dentro la lezione, dopo gli esempi svolti, c'è un esercizio guidato: uno svolgimento spiegato passo per passo che in alcuni punti, le fermate, si interrompe finché lo studente scrive un risultato, sceglie o muove un cursore e conferma. Il numero di fermate è ragionevole e non fisso: si mettono dove ci stanno bene, altrimenti no. Si costruisce il blocco e si prova su una lezione pilota, la 121 (Funzione esponenziale), prima di scriverlo per le altre.

## Perché
Alessandro, 5 ottobre 2026: tra lezione ed esercizi manca un passaggio. Chi legge la lezione arriva agli esercizi con la teoria e pochi esempi svolti; serve qualcosa di guidato, in cui lo studente impara come si risolvono gli esercizi, con la spiegazione che oggi vede solo dopo una risposta sbagliata, su esempi scelti e curati. La sequenza è teoria, pratica svolta, pratica guidata con le parti in cui si risponde e si conferma, poi gli esercizi. Il 6 ottobre, dopo la spiegazione di cosa sia una fermata, Alessandro ha scelto un numero di fermate non fisso e ha dato il via al pilota.

Alternativa scartata: una fermata a ogni passaggio. Claude l'ha sconsigliata perché diventa un modulo da compilare e somiglia agli esercizi che vengono subito dopo.

## Conseguenze
- Un blocco nuovo nel markdown delle lezioni, con la sua sintassi in `docs/lezioni/README.md`, il controllo in `scripts/lezioni/check.mts` e le regole di scrittura in `docs/lezioni/stile.md`.
- Proposte di Claude accettate con il via, da confermare sul pilota: se lo studente sbaglia vede un messaggio sul suo errore e può riprovare o farsi mostrare il passaggio; può andare avanti senza rispondere; funziona senza accesso e non entra nei progressi; senza JavaScript e in stampa resta un esempio svolto leggibile.
- Scriverlo per le 129 lezioni di matematica è un lotto a sé. Le proposte per le lezioni del terzo anno sono in [[Esercizio guidato nelle lezioni]].

## Domande aperte
- Se la pagina a parte degli esercizi svolti serve ancora ([[2026-09-30 Ogni lezione ha una pagina di esercizi svolti, fatta dai suoi generatori]]).
- Se un utente iscritto vede l'esercizio guidato segnato come fatto.
- In che ordine si scrive per le altre lezioni.

## Collegamenti
- [[Lezioni]], [[Pipeline lezioni]], [[Standard di qualità]], [[Esercizio guidato nelle lezioni]], [[Tipi di esercizio sui passaggi]]
