# algoritmi: Il concetto di algoritmo

Lezione: `docs/lezioni/informatica/riscritte/45-algoritmi.md`. Il capitolo viene prima dei linguaggi di
programmazione: gli algoritmi degli esercizi sono diagrammi di flusso, scritti una volta sola nel linguaggio dei
blocchi `diagramma` (`src/lib/exercises/v2/inf-alg.ts`, sugli aiuti di `inf-programmi.ts`). Niente programmi in Python
o in C++.

Ogni esercizio con un diagramma parte da un algoritmo di una famiglia, con i numeri della storia estratti ogni volta.
Le famiglie di questo generatore:

- `quota`: un prezzo per ognuno più una spesa fissa (i biglietti con la prevendita della lezione);
- `unita`: due unità di misura portate alla più piccola (ore e minuti in minuti);
- `rettangolo`: area o perimetro, da base e altezza;
- `due numeri`: il maggiore o il minore di due numeri;
- `sconto`: uno sconto solo sopra un certo prezzo (selezione con un ramo solo);
- `soglia`: un numero contro una soglia, risposta "sì" o "no";
- `rovescia`: un conto alla rovescia con una parola alla fine;
- `addizioni`: il prodotto fatto di addizioni ripetute;
- `euclide`: il massimo comune divisore con le sottrazioni.

Vincoli di ogni livello con un diagramma: solo numeri interi, senza `/`; il diagramma di riferimento termina su ogni
prova e scrive quello che la sua famiglia deve scrivere (il controllo lo ricalcola dai numeri della storia);
quattro opzioni diverse; un'opzione che è un diagramma ha al più una selezione o un ciclo ed è larga al più 332 px.

## Livelli

1. **Le proprietà di un algoritmo.** Testo. Due casi: `manca` (60%), un passo che viola una proprietà e la domanda
   "quale proprietà non è rispettata?", con quattro delle cinque proprietà come opzioni; `passo` (40%), "quale di
   questi passi è ambiguo?" (o non termina, non è eseguibile, non è deterministico), con un passo sbagliato e tre
   passi precisi. Esempio: «aggiungi un po' di sale» → Non ambiguo.
2. **Eseguire un algoritmo.** Un diagramma in sequenza (`quota`, `unita`, `rettangolo`) e i valori in ingresso
   nella domanda; opzioni: quattro uscite. Esempio: leggi a, leggi b, t ← a · 60 + b, scrivi t, con 2 e poi 15 → 135.
3. **Un algoritmo che sceglie o ripete.** Come il 2, con una selezione (`soglia`, `sconto`, `due numeri`, ingressi
   anche sul confine) o una ripetizione (`rovescia`, `addizioni`, `euclide`). Esempio: Euclide con 10 e poi 6 → 2.
4. **Algoritmo, esecutore, programma.** Testo: una affermazione vera tra tre false, o una falsa tra tre vere (metà
   e metà), da due elenchi di dodici.
5. **Scegliere il diagramma giusto.** Il compito a parole; opzioni: quattro diagrammi, di cui uno solo scrive quello
   che deve su tutte le prove (`quota`, `unita`, `rettangolo`, `due numeri`, `sconto`).
6. **Costruire il diagramma.** Lo stesso compito. Risposta aperta: lo studente costruisce il diagramma, che viene
   eseguito sulle prove di `params.tests` (almeno due, su rami diversi). A scelta multipla: come il livello 5.

## Distrattori

Dagli errori veri: il blocco "scrivi" prima dell'ultimo calcolo (il secondo esercizio della lezione); l'addizione
prima della moltiplicazione; il valore sovrascritto; il confine della condizione (`>` e `>=`); il blocco che scrive
finito dentro il ramo; lo sconto fatto sempre; il maggiore al posto del minore; i due blocchi del giro scambiati;
una selezione al posto del ciclo. Nei livelli "che cosa scrive" le opzioni sbagliate sono quello che scrivono questi
diagrammi sbagliati con gli stessi ingressi.

## Da evitare

La media con la divisione (`/` non dà lo stesso risultato in tutti i linguaggi); ingressi per cui il diagramma non
termina; domande di pura memoria su nomi e date (Euclide, "più di duemila anni").
