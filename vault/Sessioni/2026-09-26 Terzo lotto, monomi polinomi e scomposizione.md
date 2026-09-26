---
aggiornato: 2026-09-26
tag: [sessione, contenuti, matematica]
---
# Terzo lotto: monomi, polinomi e scomposizione

Sessione del 26 settembre 2026. Alessandro ha chiesto il prossimo lotto di matematica (teoria, esercizi, formulario, flashcard), partendo dal primo anno per completarlo e poi passare agli anni dopo.

## Cosa si è deciso
- L'ordine dei lotti non era scritto da nessuna parte. Claude ha scelto l'algebra: il resto di "Monomi e polinomi" (7 lezioni) e tutta "Scomposizione in fattori" (5), perché frazioni algebriche ed equazioni dipendono da lì. Per chiudere il primo anno propone tre lotti: insiemi, logica e funzioni (12 lezioni); frazioni algebriche, equazioni e disequazioni (9); statistica e geometria (8). Da confermare con Alessandro.
- Un prerequisito cambiato su proposta dell'agente della lezione: `scomposizione-ruffini <- polinomi-ruffini, scomposizione-trinomio, scomposizione-prodotti-notevoli` (quasi ogni esempio finisce con un trinomio). Le altre righe del lotto sono state confermate dagli agenti così come erano.

## Cosa si è fatto
- Dodici lezioni nuove (file 27-38 in `docs/lezioni/`): Monomi; Polinomi e grado di un polinomio; Operazioni tra polinomi; Prodotti notevoli; Espressioni con polinomi; Divisione tra polinomi; Regola di Ruffini e teorema del resto; Raccoglimento totale e parziale; Scomposizione con i prodotti notevoli; Trinomio di secondo grado; Scomposizione con la regola di Ruffini; MCD e MCM di polinomi. Un agente per lezione, con un brief comune che divideva gli argomenti tra le lezioni; ogni conto rifatto con SymPy. 9 figure nuove, 229 flashcard, formulari. Pubblicate nel database.
- Dodici generatori di esercizi (79 livelli), uno per lezione, ognuno con specifica, controllo indipendente in Python, verifica su 1.000 esercizi per livello con due seed ed errori piantati. Claude ha rifatto la verifica con un terzo seed (424242): PASS per tutti. Collegati al sito (`config.ts`, `index.ts`) con i nomi dei livelli in `level-names.ts`.
- Bug trovato da due agenti in `collect()` di `src/lib/exercises/v2/monomi.ts`: quando due termini simili si annullavano, il monomio nullo perdeva le lettere e assorbiva i termini noti successivi ($(3a^2 - a - 3) + (a + 2)$ dava $3a^2 + 2 - 3$). Corretto sommando per parte letterale; i sei generatori già in produzione che la usano passano di nuovo la verifica.
- Lezione 13 (Operazioni tra monomi): tolto il rimando a "potenza di un monomio", che puntava alla lezione stessa.
- Formule sul telefono: a 390 px 201 formule in evidenza delle lezioni nuove uscivano dalla colonna (dentro i riquadri degli esempi c'è poco spazio). Spezzate su più righe con `aligned`, a capo prima di ogni "=" e a metà delle somme lunghe; le tabelle della divisione in colonna rimpicciolite. Ne resta una che sborda di 15 px. Script in `scratchpad` della sessione, non nella repo.
- Esercizi provati nel browser da telefono con un account di prova sul piano Studio, poi cancellato, aprendo ogni livello. Il test ha trovato tre difetti:
  - i livelli si chiamavano solo "Livello 1", "Livello 2": scritti i 79 nomi in `level-names.ts`;
  - problemi troppo larghi per il telefono (tutti al livello 7 di Espressioni con polinomi, due su tre al livello 3 di MCD e MCM): cinque generatori ora li scrivono su più righe con `aligned`, entro 350 px a 18 px. Il sito li mostrava con i segni `&` visibili, perché `src/lib/exercises/present.ts` divideva le righe ma non toglieva l'allineamento: corretto;
  - risposte tagliate nel pulsante, che ha 252 px utili a 16 px (fino al 90% delle opzioni al livello 6 della divisione): otto generatori ora mettono le opzioni larghe su due righe con `gathered`, per esempio quoziente e resto.
  Misura finale su 150 esercizi per livello: nessun problema oltre 350 px, nessuna opzione oltre 252 px. La misura ora è un passo della pipeline: `scripts/exercises/width.mts`, citato nel README degli esercizi.
- Dopo il lotto, su richiesta di Alessandro, sistemata la larghezza anche nel materiale già pubblicato. Lezioni 1-26: 157 formule spezzate su più righe (28 riscritte a mano, per esempio gli insiemi per proprietà e l'elenco dei numeri primi), ripubblicate, zero formule oltre la colonna a 390 px. Esercizi: 12 generatori già pubblicati corretti da sei agenti (insiemi, naturali, interi, espressioni con monomi, espressioni con frazioni, equazioni di secondo grado), con i controlli Python adattati e la verifica rifatta con tre seed. `width.mts` ora misura il problema come lo dispone la pagina: le frasi vanno a capo da sole e i dati separati da `\quad` stanno in una riga che si spezza. Tutti i 38 generatori escono con 0.

## Informazioni nuove
- Tempi: circa 4-6 minuti per agente per lezione, formulario e carte; 11-38 minuti per generatore. Token degli agenti: circa 1,4 milioni per i contenuti e 2,5 milioni per i generatori.
- Gli agenti in parallelo condividono lo scratchpad: uno ha sovrascritto un file di prova di un altro. Da ora i brief chiedono file con un prefisso proprio.

## Domande aperte
Per Andrea, oltre ai dubbi in fondo a ogni nota (`docs/lezioni/note/27-38`) e a ogni specifica (`specs/exercises/`):
- nome del trinomio $x^2 + sx + p$ (caratteristico, speciale, somma e prodotto, oppure nessuno);
- il divisore $ax - b$ nella regola di Ruffini, e la divisibilità di $x^n \pm a^n$ (nella 35 o nella 37);
- l'ordine dei fattori nelle scomposizioni, e se $3 - x$ al posto di $x - 3$ va accettato quando arriveranno le risposte aperte;
- "la somma di due quadrati è irriducibile" vale solo al primo grado ($x^4 + 4$ si scompone): basta la precisazione della lezione 35?
- risposte aperte con due campi (quoziente e resto) per divisione e Ruffini.

## Prossimo argomento
Deploy, poi il quarto lotto (proposta: insiemi, logica e funzioni).
