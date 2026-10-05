# Sequenza, selezione, iterazione e teorema di Böhm-Jacopini

Con le ventuno lettere dell'alfabeto si scrivono tutte le parole dell'italiano. Per gli algoritmi i pezzi sono ancora meno: tutti quelli che hai eseguito finora, dalla media di due voti al massimo comune divisore, combinano i loro passi in tre soli modi. Nel 1966 due informatici italiani, Corrado Böhm e Giuseppe Jacopini, hanno dimostrato che non è un caso: quei tre modi sono sufficienti per qualunque algoritmo.

## Le tre strutture di controllo

Una **struttura di controllo** è un modo di stabilire in che ordine vengono eseguite le istruzioni di un algoritmo. Sono tre, e le hai già incontrate nei [diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso) e nello [pseudocodice](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/lo-pseudocodice).

| Struttura | Che cosa fa | Nello pseudocodice | Nel diagramma |
|---|---|---|---|
| **sequenza** | esegue le istruzioni una dopo l'altra, tutte, una volta | righe una sotto l'altra, allo stesso livello | blocchi in fila |
| **selezione** | esegue un gruppo di istruzioni oppure un altro, secondo una condizione | `se` ... `altrimenti` | rombo con due rami che si riuniscono |
| **iterazione** | ripete un gruppo di istruzioni finché una condizione è vera | `finché` | rombo con una freccia che risale |

L'iterazione è la struttura che finora hai chiamato ripetizione o ciclo: i tre nomi indicano la stessa cosa, e ogni esecuzione delle istruzioni ripetute è un giro.

```ad-warning
Un rombo non è sempre una selezione
Selezione e iterazione cominciano tutte e due con una condizione, e per questo si confondono. La differenza è dove si va dopo: finito il ramo di una selezione si prosegue in avanti, e la condizione non viene più guardata; finito il giro di un'iterazione si torna alla condizione. Se le istruzioni devono poter essere eseguite più di una volta serve `finché`, non `se`.
```

## Una struttura dentro l'altra

Le tre strutture hanno una proprietà in comune: in ognuna si entra da un punto solo e si esce da un punto solo. Vista da fuori, quindi, una selezione intera o un'iterazione intera si comporta come una singola istruzione, e la puoi mettere dovunque possa stare un'istruzione: in fila con le altre, oppure dentro un ramo o dentro un giro. Mettere una struttura dentro un'altra si dice **annidamento**.

L'algoritmo qui sotto legge quanti voti ci sono in una pagella e poi i voti, uno alla volta, e conta quelli sufficienti. Usa le tre strutture insieme.

```
inizio
leggi n
i ← 1
sufficienti ← 0
finché i ≤ n
    leggi voto
    se voto ≥ 6
        sufficienti ← sufficienti + 1
    i ← i + 1
scrivi sufficienti
fine
```

Il rientro fa vedere l'annidamento. Al margine c'è una sequenza di cinque elementi, e il quarto è un'iterazione; il giro dell'iterazione è a sua volta una sequenza di tre elementi, e il secondo è una selezione, con una sola istruzione nel ramo "sì" e niente nel ramo "no".

```diagramma
% nome: strutture-annidate-voti-sufficienti
% alt: Diagramma di flusso con una selezione dentro una ripetizione: si legge n, i prende 1 e sufficienti prende 0; un rombo chiede se i è minore o uguale a n; nel giro si legge voto, un secondo rombo chiede se voto è maggiore o uguale a 6 e sul ramo sì sufficienti aumenta di 1, poi i aumenta di 1 e una freccia risale al primo rombo; all'uscita si scrive sufficienti
% ingresso: 3, 7, 5, 8
leggi n
i = 1
sufficienti = 0
finché i <= n
    leggi voto
    se voto >= 6
        sufficienti = sufficienti + 1
    i = i + 1
scrivi sufficienti
```

Eseguilo con una pagella di tre voti, 7, 5 e 8, un passo alla volta. Nel disegno la selezione sta tutta dentro il giro: la sua freccia d'ingresso e il punto in cui i rami si riuniscono sono tra il rombo dell'iterazione e la freccia che risale. Confronta la tabella delle variabili con questa, che ha una riga per ogni giro.

| Giro | $i$ | `voto` letto | `voto` ≥ 6? | `sufficienti` dopo il giro |
|---|---|---|---|---|
| 1 | $1$ | $7$ | sì | $1$ |
| 2 | $2$ | $5$ | no | $1$ |
| 3 | $3$ | $8$ | sì | $2$ |

Al quarto controllo $i$ vale 4, la condizione $i \leq 3$ è falsa e l'algoritmo scrive 2. Nel programma accanto al diagramma ritrovi le tre strutture: le righe in fila, la riga con `if` e la riga con `while`.

## Gli algoritmi con i salti

C'è un quarto modo di decidere l'ordine dei passi, più antico degli altri: il **salto**, cioè un'istruzione del tipo "vai al passo 5". Con i salti si scrive, per esempio, l'algoritmo che chiede il codice di sblocco di un telefono finché non è quello giusto:

1. Leggi `pin`.
2. Se `pin` è diverso da 1234, torna al passo 1.
3. Scrivi "sbloccato".

Qui il salto è uno e si segue bene. In un algoritmo lungo, però, i salti possono partire da qualunque punto e arrivare in qualunque altro, anche a metà di un ramo o di un giro: per sapere come si è arrivati a un passo bisogna cercare in tutto l'elenco chi salta lì, e correggere un errore in un punto può romperne un altro. Nel diagramma di flusso un salto è una freccia che attraversa il disegno per conto suo, e un algoritmo pieno di frecce così non ha più blocchi con un ingresso e un'uscita.

## Il teorema di Böhm-Jacopini

Il **teorema di Böhm-Jacopini** dice che dei salti si può sempre fare a meno: qualunque algoritmo descritto da un diagramma di flusso, comunque siano messe le sue frecce, si può riscrivere come un algoritmo equivalente che usa soltanto la sequenza, la selezione e l'iterazione. Equivalente vuol dire che, con gli stessi dati di ingresso, i due algoritmi danno gli stessi risultati.

L'algoritmo del codice di sblocco, riscritto senza il salto, diventa un'iterazione:

```
inizio
leggi pin
finché pin ≠ 1234
    leggi pin
scrivi "sbloccato"
fine
```

```diagramma
% nome: strutture-senza-salti-codice-di-sblocco
% alt: Diagramma di flusso con una ripetizione: si legge pin; un rombo chiede se pin è diverso da 1234; nel giro si legge di nuovo pin e una freccia risale al rombo; all'uscita si scrive "sbloccato"
% ingresso: 1111, 4321, 1234
% codice: no
leggi pin
finché pin != 1234
    leggi pin
scrivi "sbloccato"
```

Eseguilo sbagliando il codice due volte, come propone la pagina, e poi una volta scrivendo subito 1234: nel secondo caso il giro non si esegue mai. La riga `leggi pin` ora compare due volte, prima dell'iterazione e dentro il giro. Succede spesso: il teorema garantisce che la riscrittura esiste, non che sia più corta. A volte bisogna ripetere un'istruzione o aggiungere una variabile.

Dal teorema viene la **programmazione strutturata**, il modo di scrivere algoritmi e programmi usando solo le tre strutture, una dopo l'altra o una dentro l'altra, senza salti. Un algoritmo strutturato si legge dall'alto in basso come un testo, e ogni suo pezzo si può capire e provare da solo. I diagrammi di queste lezioni sono tutti strutturati: una freccia che salta dentro un altro blocco non si può nemmeno disegnare.

```ad-warning
Tre strutture, non tre istruzioni
Il teorema parla dei modi di combinare le istruzioni, non di quante istruzioni servono o di quanti tipi: un algoritmo strutturato può avere mille righe, con letture, scritture e calcoli di ogni genere. E non dice che ogni algoritmo deve usarle tutte e tre: la media di due voti è una sola sequenza.
```

```ad-note
Sufficienti non vuol dire uniche
I linguaggi di programmazione offrono anche altre scritture, come il [ciclo for](/materiale/scuola-superiore/informatica/l-iterazione/il-ciclo-for) e le [selezioni a più vie](/materiale/scuola-superiore/informatica/la-selezione/selezioni-annidate-e-a-piu-vie). Sono modi più comodi di scrivere una selezione o un'iterazione, non strutture in più: tutto quello che fanno si può fare con le tre di questa lezione.
```

## Prova tu

### Riconosci le strutture

Prima di eseguire il diagramma, rispondi su un foglio: quante selezioni e quante iterazioni ci sono? Quale struttura è annidata dentro quale? Che cosa scrive con $n = 7$? Poi eseguilo e conta quante volte si accende ognuno dei due rombi: quello dell'iterazione otto volte, quello della selezione sette.

```diagramma
% nome: strutture-da-riconoscere-multipli-di-tre
% alt: Diagramma di flusso con una selezione dentro una ripetizione: si legge n e i prende 1; un rombo chiede se i è minore o uguale a n; nel giro un secondo rombo chiede se il resto di i diviso 3 è zero, con il ramo sì che scrive "bum" e il ramo no che scrive i; poi i aumenta di 1 e una freccia risale al primo rombo
% ingresso: 7
% codice: no
leggi n
i = 1
finché i <= n
    se i % 3 == 0
        scrivi "bum"
    altrimenti
        scrivi i
    i = i + 1
```

### Una selezione dentro una selezione

Al cinema pagano il biglietto ridotto i ragazzi sotto i 14 anni e chi ha almeno 65 anni; tutti gli altri pagano l'intero. Il diagramma tratta solo il primo caso, e il ramo "no" è vuoto. Trascina nel ramo "no" una "selezione", scrivi la sua condizione (`e >= 65`), aggiungile il ramo "no" dalla casella che compare e metti uno "scrivi" su ognuno dei suoi rami. Provalo con 10, 30 e 70, e poi con i due valori di confine, 14 e 65.

```diagramma
% nome: strutture-da-completare-biglietto-ridotto
% alt: Diagramma di flusso da completare: si legge e; un rombo chiede se e è minore di 14; il ramo sì scrive "ridotto", il ramo no è vuoto
% ingresso: 10
% codice: no
% modifica: sì
leggi e
se e < 14
    scrivi "ridotto"
altrimenti
```

### Togli i salti

Questo algoritmo è scritto con i salti. Seguilo a mano con $n = 4$ per capire che cosa calcola, poi costruisci il diagramma strutturato equivalente: deve scrivere lo stesso risultato, cioè 10.

1. Leggi $n$.
2. Metti 0 in $s$.
3. Se $n$ è uguale a 0, vai al passo 7.
4. Aggiungi $n$ a $s$.
5. Togli 1 a $n$.
6. Vai al passo 3.
7. Scrivi $s$.

I passi dal 3 al 6 sono un'iterazione scritta con due salti: il passo 6 è la freccia che risale, il passo 3 è il rombo. Attento alla condizione: il passo 3 dice quando si esce, mentre `finché` vuole sapere quando si resta nel giro, quindi va scritta al contrario (diverso si batte `!=`).

```diagramma
% nome: strutture-da-costruire-senza-salti
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere n e scrivere la somma dei numeri da n fino a 1, usando una ripetizione
% ingresso: 4
% codice: no
% modifica: sì
```
