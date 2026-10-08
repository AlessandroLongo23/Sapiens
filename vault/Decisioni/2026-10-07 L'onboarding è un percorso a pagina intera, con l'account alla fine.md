---
stato: decisa
aggiornato: 2026-10-07
tag: [decisione, prodotto, design, onboarding]
---
# L'onboarding è un percorso a pagina intera, con l'account alla fine

## Decisione
Chi si iscrive non passa da una finestra: fa un percorso a pagina intera, `/iscriviti`, una domanda per schermata, con oggetti 3D, animazioni e componenti disegnati apposta. Le domande vengono prima dell'account: lo studente dice chi è, l'età, l'anno e l'argomento, vede da dove comincerà, e solo allora crea l'account.

## Perché
Alessandro, il 7 ottobre 2026, vista la finestra "Chi sei?": "un modale non è sufficiente per un processo di onboarding". Ha chiesto un percorso a step curato e una ricerca su Brilliant e sugli onboarding riconosciuti come i migliori, da provare con Playwright.

Cosa ha mostrato la prova sul campo dello stesso giorno (screenshot in `scratchpad/research/` della sessione, non nel repository):
- Brilliant (brilliant.org, 16 schermate prima dell'account): una domanda per schermata, la mascotte accanto alla domanda, carte grandi con un'illustrazione, barra in tre segmenti, "Continua" in basso; chiede l'età, il livello e tre autovalutazioni, poi dice "so da dove cominciare" e solo dopo chiede l'account. Le schermate cambiano di netto; si muovono la domanda (una molla di circa 300 ms) e la mascotte, disegnata con Rive.
- Duolingo (duolingo.com, corso di matematica): sei scelte, una lezione intera di 14 esercizi e quattro schermate di premio prima di chiedere il profilo, che si può rimandare. La mascotte ripete la scelta con una frase ("Okay, we'll build on what you're learning in school!"). Tra una domanda e l'altra passano circa 1,3 secondi di animazione.
- Khan Academy: tre carte per il ruolo (studente, famiglia, docente) che avanzano al tocco; sotto i 13 anni il modulo cambia (email del genitore, niente accesso con Google) senza mandare via il ragazzo. Nessuna animazione.
- Mimo: sul web il questionario è dietro l'account, quindi non è un modello per l'ingresso.

Dalle raccolte lette lo stesso giorno: Duolingo attribuisce al rinvio dell'iscrizione un 20% in più di utenti attivi al giorno (Appcues, "26 User Onboarding Examples", letto il 7 ottobre 2026, da verificare alla fonte); le app educative hanno una mediana di 15 schermate di onboarding (Lazyweb, da verificare).

Scartati: la finestra come unico ingresso; l'account prima delle domande, come nella prima fetta scritta la mattina.

## Conseguenze
- Supera in parte l'ordine dei passi scritto in [[Onboarding]] la mattina: l'iscrizione viene dopo anno e argomento, e "chi sei" e l'età sono schermate a sé.
- Sotto i 14 anni le risposte su anno e argomento non si salvano con l'account: si chiedono di nuovo a `/benvenuto` dopo la conferma del genitore.
- La finestra resta per accedere e per chi si iscrive nel mezzo di un'azione (un pagamento, una richiesta a un tutor), che altrimenti perderebbe quello che stava facendo.
- La prova senza account, che Duolingo fa e Brilliant no, resta da decidere con la landing ([[2026-10-07 Tre versioni della landing]]).
- Aggiornata [[Onboarding]].

## Collegamenti
- [[Onboarding]], [[2026-10-07 Onboarding]], [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
