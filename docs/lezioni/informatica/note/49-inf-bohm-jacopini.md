# Note: Sequenza, selezione, iterazione e teorema di Böhm-Jacopini

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "Algoritmi e
diagrammi di flusso"). Non pubblicata.

## Struttura

Le tre strutture di controllo in tabella (che cosa fanno, pseudocodice, diagramma); un ingresso e un'uscita, quindi
l'annidamento, con il conto dei voti sufficienti (pseudocodice, diagramma, tabella di traccia); gli algoritmi con i
salti, con il codice di sblocco scritto con "torna al passo 1"; l'enunciato del teorema, la riscrittura senza salto e
la programmazione strutturata; tre esercizi.

- Righe: 176 nel file, 53 di testo. Nessuna figura TikZ, nessun blocco `codice`.
- Diagrammi: 5. Due nella lezione (`strutture-annidate-voti-sufficienti`, con il codice accanto, e
  `strutture-senza-salti-codice-di-sblocco`) e tre negli esercizi: uno da leggere riconoscendo le strutture, uno da
  completare con una selezione dentro una selezione, uno da costruire togliendo i salti da un algoritmo a passi.
- Tabella di traccia: 1. Avvisi: un rombo non è sempre una selezione; tre strutture, non tre istruzioni. Una nota:
  sufficienti non vuol dire uniche.

## L'enunciato del teorema

"Qualunque algoritmo descritto da un diagramma di flusso, comunque siano messe le sue frecce, si può riscrivere come
un algoritmo equivalente che usa soltanto la sequenza, la selezione e l'iterazione", con "equivalente" spiegato come
"stessi dati di ingresso, stessi risultati". La lezione aggiunge che la riscrittura può chiedere di ripetere
un'istruzione o di aggiungere una variabile, e che il teorema dice che le tre strutture sono sufficienti, non che
sono le sole. Niente dimostrazione.

Quello che ho lasciato fuori: che l'iterazione del teorema è quella con la condizione in testa; che la costruzione
generale usa variabili logiche in più; che l'equivalenza riguarda anche i casi in cui l'algoritmo non termina.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard). `verifica.mts`: 0 esercizi.
- I cinque diagrammi eseguiti fino in fondo nella pagina di anteprima (Chromium con Playwright). Uscite: 2;
  "sbloccato"; 1, 2, "bum", 4, 5, "bum", 7; "ridotto".
- Il diagramma dei multipli di tre contato sul motore: 32 passi con $n = 7$, cioè 8 controlli del rombo esterno e 7
  di quello interno, come dice la consegna. Il codice di sblocco con 1234 al primo colpo non entra nel giro.
- Esercizi risolti nella pagina: la selezione annidata (10 "ridotto", 30 "intero", 70 "ridotto", 14 "intero", 65
  "ridotto"); l'algoritmo senza salti costruito da zero (10 con $n = 4$).

## Scelte

- Il titolo dice "iterazione", la lezione 47 dice "ripetizione, che si chiama anche ciclo": qui la struttura si
  chiama iterazione, con una riga che dice che i tre nomi indicano la stessa cosa.
- I salti si mostrano con un algoritmo a passi numerati ("torna al passo 1"), non con un diagramma: i blocchi
  `diagramma` non possono disegnare un salto, e una figura TikZ di un diagramma non strutturato sarebbe stata l'unica
  del capitolo fatta a mano. La parola `goto` e l'espressione "codice a spaghetti" non ci sono.
- L'esempio del codice di sblocco è scelto perché la riscrittura ripete `leggi pin`: fa vedere che togliere un salto
  può allungare l'algoritmo. Il ciclo con la condizione in coda non c'è, come nella 47.
- Il codice 1234 è un numero, non un testo: così il confronto è tra numeri.
- La pagella legge prima quanti voti ci sono e poi i voti: i vettori non ci sono ancora.
- Link in avanti al ciclo `for` (61) e alle selezioni a più vie (59), in una nota.

## Fonti e cose da verificare

- Corrado Böhm, Giuseppe Jacopini, "Flow diagrams, Turing machines and languages with only two formation rules",
  Communications of the ACM, vol. 9, n. 5, maggio 1966, pp. 366-371. Citato a memoria: anno, autori e rivista sono
  sicuri, volume e pagine da verificare sull'archivio dell'ACM.
- "Due informatici italiani": Böhm è nato a Milano nel 1923, Jacopini era suo allievo a Roma. Da verificare su una
  fonte (per esempio la voce su Böhm dell'Enciclopedia Treccani).
- Edsger Dijkstra, "Go To Statement Considered Harmful", Communications of the ACM, marzo 1968: è la lettera che di
  solito si cita per la programmazione strutturata. Non è nominata nella lezione, che dice solo "dal teorema viene la
  programmazione strutturata": è una semplificazione, perché la programmazione strutturata ha anche altre origini.
- "Ventuno lettere dell'alfabeto" italiano, nell'apertura.

## Domande per Andrea

- L'enunciato del teorema va bene così per una seconda, o in classe lo dai in un'altra forma?
- "Iterazione" qui e "ripetizione" nella 47: vuoi un nome solo in tutto il capitolo?
- Vuoi che compaia la parola `goto`, che gli studenti possono trovare sui libri?
- Serve qui il ciclo con la condizione in coda (ripeti ... finché), che molti libri mettono tra le forme
  dell'iterazione? I nostri diagrammi non lo disegnano.
