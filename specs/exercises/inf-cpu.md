# La CPU e il ciclo di esecuzione delle istruzioni

Generatore: `inf-cpu` (`src/lib/exercises/v2/generators/inf-cpu.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_cpu.py`. Lezione collegata: `docs/lezioni/informatica/riscritte/14-inf-cpu.md`.
Macchinario comune del capitolo: `src/lib/exercises/v2/inf-architettura.ts` e
`scripts/exercises/checkers/_inf_architettura.py`.

Sei livelli. Il primo è a scelta multipla; gli altri sono di conto, con risposta numerica (`answer.kind = 'number'`) e
una variante a scelta multipla costruita da `params.distractors`, tranne la domanda sul registro istruzioni del
livello 3, che è a scelta (la risposta è un'istruzione).

## Nomi dei livelli

1. Le parti della CPU
2. L'accumulatore alla fine
3. Contatore di programma e registro istruzioni
4. Una cella che cambia
5. Istruzioni al secondo
6. Tempo e core

## La macchina

Quella della lezione: memoria a celle numerate, un accumulatore, un contatore di programma, un registro istruzioni.

| Istruzione | Effetto |
|---|---|
| `CARICA n` | accumulatore = cella n |
| `SOMMA n` | accumulatore = accumulatore + cella n |
| `SOTTRAI n` | accumulatore = accumulatore - cella n |
| `SALVA n` | cella n = accumulatore |
| `FERMA` | fine |

Un ciclo: l'istruzione all'indirizzo del contatore va nel registro istruzioni, il contatore aumenta di 1, l'istruzione
viene eseguita.

Il problema mostra la memoria in una tabella `\begin{array}{c|l}` con le colonne "cella" e "contenuto", le celle in
ordine di indirizzo, una riga `\hline` tra il programma e i dati. Le istruzioni sono in `\text{}`.

## Regole comuni

- L'accumulatore non diventa mai negativo: i numeri con segno sono di un'altra lezione.
- I dati stanno in celle consecutive a partire da un indirizzo tra 10 e 60; la cella del risultato contiene 0.
- Numeri da 10 000 in su con lo spazio sottile (`500\,000`).

## Livello 1: le parti della CPU

Un'istruzione del linguaggio con un indirizzo da 10 a 39 e una domanda su chi fa che cosa. Le parti: Unità di
controllo, ALU, Contatore di programma, Registro istruzioni, Accumulatore, un quinto dei casi ciascuna; le opzioni sono
la parte giusta e tre delle altre.

- ALU: "La CPU esegue l'istruzione SOMMA 12. Quale parte della CPU calcola la somma?" (o la differenza, con SOTTRAI).
- Registro istruzioni: quale parte contiene l'istruzione mentre la CPU la esegue; in quale parte è stata copiata
  l'istruzione appena prelevata.
- Contatore di programma: "L'istruzione SOMMA 12 si trova nella cella 3. Quale parte contiene il numero 4 mentre la CPU
  la esegue?"; quale parte contiene l'indirizzo dell'istruzione da prelevare subito dopo.
- Accumulatore: dove si trova la copia dopo CARICA; da dove viene il numero che SALVA scrive; dove si trova il
  risultato dopo SOMMA o SOTTRAI.
- Unità di controllo: chi esamina l'istruzione nel registro istruzioni; chi manda i comandi alle altre parti; chi fa
  partire il prelievo dell'istruzione successiva.

## Livello 2: l'accumulatore alla fine

Programma dalla cella 0: `CARICA`, una o due operazioni tra `SOMMA` e `SOTTRAI` (cinque forme: somma, sottrai,
somma-somma, somma-sottrai, sottrai-somma), `SALVA` nella cella del risultato, `FERMA`. Ogni cella di dati (valori da 2
a 60) è usata una volta, in ordine mescolato. Si chiede l'accumulatore quando il programma si ferma.

Esempi svolti:

1. `CARICA 40`, `SOMMA 41`, `SALVA 42`, `FERMA` con 5 e 59: $5 + 59 = 64$.
2. `CARICA 20`, `SOMMA 21`, `SOTTRAI 22`, `SALVA 23`, `FERMA` con 18, 15, 8: $18 + 15 - 8 = 25$.

Distrattori: 0 (pensare che `SALVA` svuoti l'accumulatore), il valore prima dell'ultimo calcolo, il primo numero
caricato, la somma di tutti i dati.

## Livello 3: contatore di programma e registro istruzioni

Programma di cinque istruzioni (le forme con due operazioni) che parte dalla cella 0, 4, 8, 20 o 100, lontano dai
dati. Tre domande, un terzo ciascuna:

- `pc-dopo`: "La CPU ha completato i primi k cicli di esecuzione. Quale numero c'è nel contatore di programma?", con k
  da 1 a 4. Risposta: inizio + k. Distrattori: uno in meno, k, uno in più.
- `pc-durante`: "La CPU sta eseguendo l'istruzione della cella p. Quale numero c'è nel contatore di programma?"
  Risposta: p + 1. Il distrattore p c'è sempre (l'avviso "Il contatore di programma guarda avanti").
- `ir`: "La CPU ha completato i primi k cicli. Quale istruzione c'è nel registro istruzioni?" Risposta: l'istruzione
  della cella inizio + k - 1. Opzioni: altre tre istruzioni del programma, tra cui quella successiva.

## Livello 4: una cella che cambia

Quattro forme di programma che scrivono in una cella e poi la rileggono (X, Y dati con valori da 2 a 40, in celle
consecutive; Z la cella dopo, che contiene 0):

- `raddoppia`: `CARICA X`, `SOMMA Y`, `SALVA X`, `SOMMA X`, `SALVA Z`: Z = 2(x + y);
- `scambia`: `CARICA X`, `SOMMA Y`, `SALVA Y`, `SOMMA Y`, `SOTTRAI X`, `SALVA Z`: Z = x + 2y;
- `copia`: `CARICA X`, `SALVA Y`, `SOMMA Y`, `SALVA Z`: Y = x, Z = 2x;
- `differenza`: `CARICA X`, `SOTTRAI Y`, `SALVA X`, `CARICA Y`, `SOMMA X`, `SALVA Z`: X = x - y, Z = x.

Si chiede il contenuto finale di una cella scritta dal programma (Z, oppure la cella riscritta nelle ultime due
forme). Esempio svolto: l'esempio 3 della lezione, con 4 e 6: la cella del risultato contiene 20.

Distrattori: il risultato che si ottiene leggendo sempre i valori iniziali delle celle (14 nell'esempio), il contenuto
iniziale della cella, l'accumulatore finale, la somma dei dati.

## Livello 5: istruzioni al secondo

"Una CPU ha un clock di v kHz (o MHz, GHz) e impiega c impulsi di clock per ogni istruzione. Quante istruzioni esegue
in un secondo? Ricorda che 1 MHz = 1 000 000 Hz." Con c tra 2, 4, 5, 8, 10; v da 1 a 50 (da 1 a 5 per i GHz); il
risultato è intero. Il fattore dell'unità è sempre nel testo.

Esempio svolto: $16\,\text{kHz}$ e 4 impulsi: $16\,000 : 4 = 4000$.

Distrattori: la frequenza in hertz (non dividere), il risultato diviso per 1000 (fattore dell'unità sbagliato), il
risultato per 10.

## Livello 6: tempo e core

Metà dei casi ciascuno:

- `tempo`: "Una CPU esegue R istruzioni al secondo. Quanti secondi impiega per eseguire N istruzioni?", con N = R per
  un numero di secondi da 2 a 60. Distrattori: dieci volte tanto, un decimo, il doppio.
- `core`: "Una CPU ha n core, e ogni core esegue R istruzioni al secondo. Quante istruzioni può eseguire al massimo la
  CPU in s secondi?", con n tra 2, 4, 6, 8 e s tra 1, 2, 3, 5, 10. Distrattori: dimenticare i core (R per s),
  dimenticare i secondi (n per R).

R è 1, 2, 4, 5, 8 o 25 per una potenza di dieci da $10^2$ a $10^6$.

## Esercizi da evitare

- Un accumulatore negativo in un passo qualsiasi.
- Al livello 2 una cella di dati usata due volte, o il risultato salvato sopra un dato.
- Al livello 3 un programma che si sovrappone ai dati.
- Al livello 4 una domanda in cui leggere i valori iniziali dà lo stesso risultato (per la cella Z).
- Al livello 5 un numero di istruzioni non intero.

## Verifica

`scripts/exercises/checkers/inf_cpu.py` ha un suo interprete della macchina. Legge la tabella dal testo del problema
(celle in ordine, programma che comincia con `CARICA` e finisce con `FERMA`, istruzioni che lavorano solo su celle di
dati), la esegue e confronta: l'accumulatore finale al livello 2, il contatore o il registro istruzioni dopo k cicli al
livello 3, la cella chiesta al livello 4 (e controlla che il programma rilegga una cella dopo averla scritta). Ai
livelli 5 e 6 legge i numeri dal testo e rifà il conto con gli interi. Per le risposte numeriche controlla la variante
a scelta: quattro numeri diversi, uno solo giusto, e almeno un distrattore tra gli errori elencati qui.

## Domande per la revisione

- I nomi delle istruzioni in italiano vanno bene, o servono quelli inglesi?
- Il livello 4 (una cella riscritta e riletta) è alla portata della prima?
- Ai livelli 5 e 6 le risposte arrivano a numeri di nove cifre: meglio fermarsi ai MHz?
