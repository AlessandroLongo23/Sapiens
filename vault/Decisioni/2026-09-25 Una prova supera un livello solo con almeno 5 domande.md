---
stato: decisa
aggiornato: 2026-09-25
tag: [decisione, studenti, prodotto]
---
# Una prova supera un livello solo con almeno 5 domande

## Decisione
Una prova di livello più corta di 5 domande, perché la sessione gratuita del giorno ne ha lasciate meno di 10, conta per allenarsi, per la serie e per gli errori, ma non supera il livello. Da 5 domande in su vale la soglia dell'80% (vedi [[2026-09-25 Gli esercizi sono un percorso di livelli]]).

## Perché
Con la soglia in proporzione, una prova di 3 domande si supera con 3 su 3: troppo poco per dire che un livello è capito. Con la pratica quotidiana che consuma domande gratuite ([[2026-09-25 La pratica quotidiana entra nella beta]]) le prove corte diventano frequenti. 5 è la lunghezza della prova di salto, che già basta per aprire livelli.

Alternative scartate: superare un livello solo con una prova intera di 10 domande, che obbliga un utente Free a spendere tutta la sessione del giorno su un livello; lasciare la soglia in proporzione anche sulle prove corte.

## Conseguenze
- In `src/lib/exercises/levels.ts` una lunghezza minima per superare un livello, pari a `JUMP_LENGTH`.
- La pagina dice prima di cominciare quando una prova è troppo corta per superare il livello.

## Collegamenti
- [[Esercizi]], [[Piani e prezzi]]
