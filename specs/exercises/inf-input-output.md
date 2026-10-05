# inf-input-output: Il primo programma: input e output

Lezione: `docs/lezioni/informatica/riscritte/52-inf-input-output.md`. Segue il generatore di riferimento
`inf-ciclo-while` (`src/lib/exercises/v2/inf-programmi.ts`), con gli aiuti di `inf-primi.ts`.

I programmi sono sequenze di scritture e letture, senza selezione e senza cicli. Quello che si legge è un testo di
una parola sola (`leggi nome: testo`), così Python e C++ si comportano allo stesso modo. Tre famiglie di programmi
che leggono, un terzo ciascuna:

- `saluto`: legge un nome; scrive un saluto con il nome e, sotto, una chiusura (6 saluti, 5 chiusure);
- `frase`: legge un nome e un secondo dato (città, materia, sport, animale); scrive in una riga nome, verbo, dato;
- `etichette`: legge gli stessi due dati; scrive due righe, ognuna con la sua etichetta ("Nome:", "Città:").

Vincoli: righe di Python di al più 34 caratteri; due prove con parole diverse; quattro opzioni che sulle prove
scrivono cose diverse.

Distrattori, dai riquadri della lezione: il nome della variabile tra virgolette (viene scritto il nome, non il
valore); il conto tra virgolette o senza; l'ordine dei pezzi o delle letture scambiato; una riga al posto di due e
due al posto di una; un pezzo dimenticato.

## Livelli

1. **Testi e conti da stampare.** Due scritture, nessuna lettura. Tre casi, un terzo ciascuno: `calcolo` (il conto
   senza virgolette), `testo` (lo stesso conto tra virgolette), `misto` (tutti e due nella stessa riga). Opzioni:
   quattro uscite. Esempio: `print("Penne:", 2)`, `print("2 * 5 =", 2 * 5)` → "Penne: 2, 2 * 5 = 10".
2. **Che cosa stampa dopo una lettura.** Il programma di una famiglia e le parole scritte alla tastiera. In 4 casi
   su 10 (`virgolette`) i nomi delle variabili sono tra virgolette. Esempio: con Elena e Udine,
   `print("Nome:", nome)`, `print("Città:", citta)` → "Nome: Elena, Città: Udine".
3. **Quale programma stampa.** La consegna a parole e un esempio; opzioni: quattro programmi.
4. **Costruire il diagramma.** La stessa consegna. Risposta aperta: il diagramma, eseguito sulle due prove. A scelta
   multipla: quattro diagrammi.
5. **Scrivere il programma.** La stessa consegna. Risposta aperta: il programma, che parte dalla prima lettura. A
   scelta multipla: come il livello 3.

## Da evitare

Testi letti di più parole (in C++ `cin >>` si ferma al primo spazio); numeri letti (sono nella lezione dopo);
domande scritte prima di leggere (la verifica confronta carattere per carattere); virgole dentro i testi, perché
nelle opzioni la virgola separa le righe.
