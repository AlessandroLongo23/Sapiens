---
aggiornato: 2026-10-05
tag: [sessione, contenuti, informatica]
---
# Prime lezioni di programmazione

Sessione del 5 ottobre 2026. Con l'[[Editor di codice]] pronto, Alessandro ha chiesto di vedere alcune lezioni sulle basi della programmazione (variabili, cicli, istruzioni condizionali) che usino l'editor per gli esempi e i diagrammi di flusso, dopo aver guardato dove stanno nel programma.

## Dove stanno nel programma
Al secondo anno, in quattro capitoli di fila: "Algoritmi e diagrammi di flusso" (6 lezioni, dalla 45 alla 50), "Linguaggi e primi programmi" (5, dalla 51 alla 55), "La selezione" (4, dalla 56 alla 59), "L'iterazione" (5, dalla 60 alla 64). Venti lezioni, nessuna scritta prima di oggi.

## Cosa si è fatto
- Cinque lezioni, scritte da quattro agenti in parallelo su un brief (`docs/lezioni/informatica/brief-programmazione.md`): 47 "I diagrammi di flusso", 53 "Variabili, assegnamento e tipi di dato", 57 "La selezione a due vie", 60 "Il ciclo while", 61 "Il ciclo for". Ognuna ha il testo e la nota; formulario, flashcard e generatore di esercizi non sono stati chiesti.
- In numeri: 16 programmi da eseguire, 10 esercizi con le prove, 12 diagrammi di flusso (più la figura con le quattro forme), 6 tabelle di traccia.
- Le convenzioni per la programmazione, nella sezione "Programmazione" di `docs/lezioni/informatica/README.md`: ogni programma in Python e in C++ con due linguette; gli esercizi come blocchi dell'editor con le prove; i diagrammi di flusso in TikZ con un modello da copiare.
- node-tikzjax non ha `shapes.geometric`: rombo e parallelogramma sono disegnati come percorsi da due macro.

## Verifiche
- `check.mts` senza errori sulle cinque lezioni; `verifica.mts` esegue le soluzioni dei 10 esercizi in Python e in C++, senza errori.
- Nel browser, in sviluppo: le cinque pagine si aprono senza errori nelle formule e senza scorrimento laterale; in ogni esercizio "Soluzione" e poi "Verifica" danno tutte le prove superate.
- Tre affermazioni sul C++ che gli autori non avevano potuto provare, provate nell'editor: una variabile `int` senza valore stampa un numero senza senso (con un avviso del compilatore); un `while` che stampa senza cambiare la variabile e un `for` che conta nel verso sbagliato vengono fermati perché stampano troppo.
- Le figure sono state guardate dagli autori in chiaro e in scuro; da Claude una sola, nella pagina.

## Due difetti del sito trovati guardando le lezioni
- **Il font del codice fondeva i segni.** JetBrains Mono disegnava `>=`, `==` e `!=` come un segno solo, nel codice in linea e nell'editor: uno studente non avrebbe saputo quali tasti premere. Le legature sono spente nel codice delle lezioni e nell'editor.
- **Nell'anteprima delle lezioni i diagrammi non comparivano.** Una lezione non pubblicata non ha le immagini delle figure, e TikZJax nel browser non riesce a disegnare questi diagrammi. La pagina di prova ora compila le figure come farà la pubblicazione (`scripts/figure/svg.mjs`).

## Da decidere
- **La lunghezza.** Le lezioni hanno tra 327 e 480 righe contro le 120-200 del brief. Il testo da leggere è di 40-70 righe; il resto sono i programmi nei due linguaggi e i diagrammi, che in TikZ ripetono ogni volta stili e macro. Va deciso se il limite conta solo il testo.
- **I nomi delle variabili** non sono uniformi tra le lezioni (una lettera in tre, nomi interi in due).
- Le domande per Andrea sono in [[Domande per Andrea]], nella sezione del 5 ottobre.
- Le cinque lezioni sono state pubblicate la sera del 5 ottobre, su richiesta di Alessandro, per vederle al loro posto nel programma. Le altre quindici dei quattro capitoli non sono scritte: quelle di oggi richiamano in due righe quello che verrebbe prima.
- Alessandro ha proposto un diagramma di flusso interattivo, modificabile ed eseguibile. La prima parte è stata costruita la sera stessa: [[Diagrammi di flusso eseguibili]]. I dodici diagrammi delle cinque lezioni sono ora blocchi `diagramma` nei file, non ancora ripubblicati perché il codice non è in produzione. Poi il secondo passo: il diagramma si modifica (blocchi aggiunti nei punti segnati, riscritti o eliminati) e ha accanto il codice in Python e in C++ che lo segue. Il resto dell'idea, dal codice al diagramma, è in [[Diagramma e codice in corrispondenza]].

## Collegamenti
- [[Editor di codice]], [[Pipeline lezioni]], [[Programma ministeriale]], [[Domande per Andrea]]
- [[2026-10-03 Primo lotto di informatica]], [[2026-10-04 Isolamento dell'editor di codice]]
