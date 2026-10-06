---
aggiornato: 2026-10-06
tag: [sessione, esercizi, lezioni, matematica]
---
# Grafici negli esercizi ed esercizio guidato

Sessione del 6 ottobre 2026, seguito di [[2026-10-05 Terzo anno di matematica]]. Alessandro ha dato il via alle due cose discusse la sera prima: i grafici negli esercizi, nelle due direzioni, e l'esercizio guidato dentro le lezioni, con un pilota e un numero di fermate non fisso. Sono costruiti tutti e due e provati in sviluppo. Niente è committato né pubblicato.

## Cosa si è deciso
- [[2026-10-06 Gli esercizi mostrano grafici, dalla funzione al grafico e dal grafico alla funzione]]
- [[2026-10-06 Le lezioni hanno un esercizio guidato, con fermate non fisse]]. Una fermata è un punto in cui la spiegazione si interrompe finché lo studente scrive, sceglie o muove un cursore e conferma.

## Grafici negli esercizi
- Un generatore dichiara un piano con `piano()` (`src/lib/exercises/v2/piano.ts`): finestra, curve in LaTeX, tratteggi, punti. Il server lo disegna come SVG fermo (`src/lib/exercises/v2/piano-svg.ts`, `src/lib/grafico/statico.ts`) con il campionamento del plotter, in due taglie; nel browser non entra il lettore di LaTeX.
- Il piano sta sotto il problema (scena `piano-cartesiano`) oppure è un'opzione della scelta multipla (`ChoiceOption.scene`): quattro grafici due per due sul telefono.
- Pilota `funzioni-esponenziali`, che passa da 7 a 9 livelli: il 6 "Dalla funzione al grafico" e il 7 "Dal grafico alla funzione", dopo "Asintoto e immagine"; dominio e crescita scalano a 8 e 9. Nel livello 6 esce l'esempio di Alessandro ($3^x$ con la curva crescente, la retta $y = 1$ e la decrescente). Nel livello 7 circa quattro casi su dieci chiedono la base e si possono scrivere.
- Il controllo Python dei grafici è riusabile (`scripts/exercises/checkers/_grafici.py`): il grafico giusto è quello della funzione, quelli sbagliati sono funzioni diverse e distinguibili nella finestra, i punti stanno sulla curva.
- Come si usa: sezione "Esercizi con i grafici" in `scripts/exercises/README.md`.
- Verifiche: tre seed da 1000 per livello, undici tipi di errore piantato tutti bocciati, `review.mts`, `width.mts`, `open-answers.mts` e `grade-check.mts` a posto; screenshot a 390 e 1280 px, in chiaro e in scuro, per i due livelli, la scheda giornaliera e un esercizio di fisica con la sua scena.
- Non verificato: una prova vera con accesso (riepilogo ed errori), la risposta aperta battuta a mano, la stampa della scheda per il livello 6.

## Esercizio guidato
- Blocco `guidato` nel markdown delle lezioni: testo di lezione tra le fermate; una fermata comincia con `?? scrivi:`, `?? scegli:` o `?? cursore:` e ha le sue righe `chiave: valore`, con i messaggi per gli errori previsti dopo ` :: `. Sintassi in `docs/lezioni/README.md`, regole di scrittura in `docs/lezioni/stile.md`.
- Codice: `src/lib/guidato/` (lettore, correzione), `src/components/guidato/Guided.tsx`, `guidedFigure` in `src/lib/content/markdown.ts`, rotta `src/app/api/lezioni/guidato/route.ts`. `LessonPlot.tsx` ha solo una prop in più.
- Le risposte scritte si correggono sul server con una rotta pubblica, perché il correttore pesa un megabyte compresso; scelte e cursori nel browser. La pagina manda la risposta attesa insieme a quella dello studente: la rotta non tocca il database.
- Comportamento: errore previsto con il messaggio dell'autore, errore non previsto con un messaggio generico e l'aiuto, "Mostra il passaggio", "Vai avanti senza rispondere" (il seguito compare e la domanda resta aperta), stato ricordato per la scheda del browser, "Ricomincia". Senza JavaScript e in stampa è un esempio svolto con le risposte scritte.
- Pilota nella 121, dopo l'esempio 4: $y = \left(\frac{1}{3}\right)^x - 3$, quattro fermate (cursore dell'asintoto, immagine a scelta, ordinata sull'asse $y$, ascissa sull'asse $x$).
- `check.mts` verifica con il correttore vero che la risposta attesa passi e che gli errori previsti non passino, e che il valore del cursore sia raggiungibile.
- Verifiche: percorso completo con Playwright a 390 e 1280 px, in chiaro e in scuro, senza JavaScript e in stampa; i quattro piani già presenti nella 121 funzionano come prima; le 25 lezioni del terzo anno passano `check.mts`; `tsc` pulito, test unitari 716 su 716.
- Corretto di passaggio: la pagina di prova `/prova-grafico/lezione` assegnava il disegno sbagliato a una figura che veniva dopo un piano con copertina.

## Da sapere
- La rotta pubblica della correzione ha un limite di 20 richieste al minuto per indirizzo, deciso con Alessandro il 6 ottobre (`src/lib/server/rate-limit.ts`): oltre, risponde 429 e lo studente legge di aspettare un minuto. Il conteggio sta nella memoria dell'istanza del server, quindi ferma uno script ma non è una garanzia: un limite rigido è una regola del firewall di Vercel, da impostare alla pubblicazione.
- Dopo tre risposte sbagliate alla stessa fermata compare "Vuoi vedere come si fa?" e "Mostra il passaggio" diventa il bottone principale; la risposta non si rivela da sola. Alessandro aveva chiesto se rivelare la risposta dopo un certo numero di errori bastasse come limite: non basta, perché chi abusa della rotta non passa dalla pagina, ma serve allo studente bloccato. Provati nel browser tutti e due: l'invito compare al terzo errore, e la ventunesima richiesta in un minuto riceve 429.
- Il correttore non legge intervalli, disequazioni e logaritmi: nelle lezioni 123-127 le fermate su quelle risposte sono a scelta.
- Sulla porta 3000 dal 6 ottobre gira un altro progetto: le prove sono state fatte su server di Sapiens avviati e poi fermati su altre porte.
- Niente provato su un telefono vero, su Safari o Firefox, con un lettore di schermo, sulla pagina vera della lezione o su una build di produzione.
- Stima per scrivere un esercizio guidato: circa un'ora di sessione per lezione; per le altre 24 del terzo anno tre o quattro sessioni in parallelo.

## Domande per Andrea
- Nella 121 l'ultima fermata chiede $3 = \left(\frac{1}{3}\right)^{-1}$: va bene lì, o è della 122? Riportata in [[Domande per Andrea]].

## Da confermare con Alessandro
- Grafici: posizione dei due livelli; punti senza coordinate scritte nel livello 7; sfondo nero del grafico in scuro.
- Guidato: i nomi ("Esercizio guidato", "Domanda 1 di 4", "Mostra il passaggio", "Vai avanti senza rispondere"); se tenere "Vai avanti" o solo "Mostra il passaggio"; stato ricordato per la scheda o per sempre; il guidato accanto all'esempio 4 o al suo posto.
- I grafici nelle flashcard: il disegno è riusabile, mancano il campo nella carta, la resa e il controllo.

## Prossimo argomento
Le conferme di Alessandro, poi i grafici negli altri generatori del terzo anno e l'esercizio guidato nelle altre 24 lezioni. Resta aperto come pubblicare il lotto.

## Collegamenti
- [[Esercizi]], [[Lezioni]], [[Pipeline esercizi]], [[Pipeline lezioni]], [[Piano cartesiano nelle lezioni]]
- [[Esercizi con i grafici]], [[Esercizio guidato nelle lezioni]]
