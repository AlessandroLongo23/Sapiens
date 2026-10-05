# Dal problema all'algoritmo

"Quanto deve pagare ognuno per la gita?" è un problema: dice che cosa si vuole sapere, non come trovarlo. Un [algoritmo](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/il-concetto-di-algoritmo), al contrario, è fatto solo di passi da eseguire. Tra la domanda e i passi c'è un lavoro che si fa con carta e penna, sempre nello stesso ordine, e che decide se il programma scritto alla fine darà la risposta giusta.

## Cinque fasi, nello stesso ordine

1. Analisi del problema: stabilire che cosa si conosce e che cosa si deve trovare.
2. Strategia risolutiva: trovare l'idea, risolvendo a mano un caso con numeri veri.
3. Algoritmo: scrivere l'idea come elenco di passi, a parole o con un diagramma di flusso.
4. Prova: eseguire l'algoritmo su dati di cui si conosce già il risultato.
5. Programma: tradurre l'algoritmo in un linguaggio di programmazione, e provarlo di nuovo.

Le prime quattro non hanno bisogno del computer. Il problema della gita le attraversa tutte: una classe va in gita con un pullman, che ha un costo fisso da dividere tra gli studenti, e visita un museo, dove ognuno paga il proprio biglietto.

## L'analisi: che cosa ho e che cosa voglio

L'**analisi del problema** risponde a tre domande. Quali sono i **dati di ingresso**, cioè i valori che conosco prima di cominciare? Quali sono i **dati di uscita**, cioè i valori che devo trovare? Ci sono **vincoli**, cioè condizioni che i dati devono rispettare perché il problema abbia senso? Le risposte si raccolgono in una tabella, dando a ogni dato un nome.

| Dato | Nome | Tipo | Vincolo |
|---|---|---|---|
| costo del pullman, in euro | `pullman` | ingresso | non negativo |
| prezzo del biglietto del museo, in euro | `biglietto` | ingresso | non negativo |
| numero di studenti | $n$ | ingresso | intero, maggiore di zero |
| quota a testa, in euro | `quota` | uscita | |

I nomi li scegli tu: una lettera per un numero qualunque, una parola intera quando il valore è qualcosa di preciso, così a distanza di una settimana capisci ancora di che cosa parla ogni passo.

```ad-warning
Un dato di uscita non si legge
Se tra i dati di ingresso metti anche la quota, stai chiedendo a chi usa l'algoritmo la risposta che l'algoritmo doveva trovare. I dati di ingresso sono solo quelli che arrivano da fuori; tutto quello che si ricava con un conto è un dato di uscita, oppure un valore intermedio che l'algoritmo calcola strada facendo.
```

## La strategia: un caso risolto a mano

La **strategia risolutiva** è l'idea con cui si passa dai dati di ingresso a quelli di uscita. Il modo più sicuro per trovarla è risolvere a mano un caso con numeri veri, guardando quali conti fai. Con un pullman da 600 euro, un biglietto da 9 euro e 24 studenti dividi 600 per 24, che fa 25, e aggiungi 9: la quota è 34 euro.

Ora rifai lo stesso conto con i nomi al posto dei numeri, e hai la strategia: la quota è `pullman` diviso $n$, più `biglietto`. Il caso risolto a mano non si butta via, perché servirà nella quarta fase.

## L'algoritmo: i passi in ordine

L'algoritmo mette la strategia in passi che un esecutore può seguire uno alla volta: prima legge i dati di ingresso, poi calcola, alla fine scrive i dati di uscita.

1. Leggi `pullman`, `biglietto` e $n$.
2. Calcola `pullman` diviso $n$, più `biglietto`, e chiama il risultato `quota`.
3. Scrivi `quota`.

Il diagramma di flusso (le sue forme sono spiegate nella lezione [I diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso)) ha un blocco per ogni lettura, uno per il calcolo e uno per la scrittura.

```diagramma
% nome: problema-gita-quota-a-testa
% alt: Diagramma di flusso con i blocchi uno sotto l'altro: inizio, leggi pullman, leggi biglietto, leggi n, quota che prende pullman diviso n più biglietto, scrivi quota, fine
% ingresso: 600, 9, 24
% codice: no
leggi pullman
leggi biglietto
leggi n
quota = pullman / n + biglietto
scrivi quota
```

## La prova: i casi di prova

Un algoritmo appena scritto può contenere un errore che a rileggerlo non si vede. Un **caso di prova** è un gruppo di dati di ingresso insieme al risultato che ci si aspetta, calcolato a mano prima di eseguire. Si esegue l'algoritmo con quei dati e si confronta: se il risultato è diverso da quello atteso, l'errore c'è, e il caso dice dove cercarlo.

Un caso solo non dice molto. Se ne scelgono almeno tre: un caso normale, uno sul confine dei vincoli e uno scomodo, con valori molto piccoli o uguali a zero.

| Caso | `pullman` | `biglietto` | $n$ | `quota` attesa |
|---|---|---|---|---|
| normale | $600$ | $9$ | $24$ | $34$ |
| museo gratuito | $600$ | $0$ | $20$ | $30$ |
| un solo studente | $500$ | $9$ | $1$ | $509$ |

Esegui il diagramma tre volte, una per riga, premendo "Ricomincia" tra una e l'altra, e confronta quello che scrive con l'ultima colonna. Poi prova il caso che il vincolo esclude, cioè zero studenti: arrivato al calcolo il diagramma si ferma, perché non si può dividere per zero.

```ad-warning
Il risultato atteso si calcola prima
Se esegui l'algoritmo, guardi che cosa esce e poi decidi che "sembra giusto", non stai provando niente: qualunque numero plausibile ti andrà bene. Scrivi il risultato atteso sul foglio prima di premere "Esegui", e confronta dopo.
```

## Un problema che chiede una ripetizione

Vuoi comprare un paio di cuffie e ogni settimana metti da parte la stessa somma: tra quante settimane avrai abbastanza soldi? L'analisi dà due dati di ingresso, `prezzo` e `paghetta` (quello che metti da parte ogni settimana), con il vincolo che `paghetta` sia maggiore di zero, e un dato di uscita, `settimane`.

Il caso a mano, con le cuffie a 60 euro e 8 euro a settimana: dopo una settimana hai 8 euro, dopo due 16, e continui ad aggiungere 8 finché arrivi almeno a 60; alla settima settimana hai 56 euro, che non sono abbastanza, e all'ottava ne hai 64. La strategia è scritta in quel "finché": si aggiunge la paghetta ai risparmi e si conta una settimana, e si ripete finché i risparmi sono meno del prezzo. Servono due valori intermedi che partono da zero, `risparmi` e `settimane`.

```diagramma
% nome: problema-settimane-di-risparmio
% alt: Diagramma di flusso con una ripetizione: si leggono prezzo e paghetta, risparmi e settimane prendono 0; un rombo chiede se risparmi è minore di prezzo; nel giro risparmi prende risparmi più paghetta e settimane prende settimane più 1, poi una freccia risale al rombo; all'uscita si scrive settimane
% ingresso: 60, 8
leggi prezzo
leggi paghetta
risparmi = 0
settimane = 0
finché risparmi < prezzo
    risparmi = risparmi + paghetta
    settimane = settimane + 1
scrivi settimane
```

Eseguilo sui tre casi di prova qui sotto. Quello sul confine è il secondo: con 10 euro a settimana, alla sesta i risparmi sono esattamente 60, la domanda "60 < 60?" ha risposta no e il giro si ferma a 6, come deve. Guarda nella tabella delle variabili il valore di `risparmi` ogni volta che si accende il rombo.

| Caso | `prezzo` | `paghetta` | `settimane` attese |
|---|---|---|---|
| normale | $60$ | $8$ | $8$ |
| i risparmi arrivano giusti al prezzo | $60$ | $10$ | $6$ |
| una settimana è sufficiente | $60$ | $100$ | $1$ |

Accanto a questo diagramma c'è anche la quinta fase già fatta: lo stesso algoritmo tradotto in un programma, una riga per blocco. Se le prime quattro fasi sono fatte bene, la traduzione è la parte più meccanica del lavoro, e si impara a partire dalla lezione [Il primo programma: input e output](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/il-primo-programma-input-e-output).

```ad-warning
Il vincolo dimenticato
Con `paghetta` uguale a zero i risparmi restano a zero, la domanda del rombo ha sempre risposta sì e il giro non finisce mai. I vincoli scritti nell'analisi dicono per quali dati l'algoritmo è garantito: o chi lo usa li rispetta, oppure l'algoritmo li controlla con una scelta prima di cominciare, come nel primo esercizio.
```

## Prova tu

### La gita con il controllo

L'algoritmo della gita qui controlla il vincolo: se $n$ è maggiore di zero calcola e scrive la quota, altrimenti scrive un messaggio. Il ramo "no" è già fatto, il ramo "sì" è vuoto. Trascina sul ramo "sì" un blocco "assegna" e, sotto, un blocco "scrivi"; clicca dentro ognuno per scriverlo (nel rettangolo, `quota` prima della freccia e `pullman / n + biglietto` dopo). Poi provalo con i tre casi della lezione e con zero studenti.

```diagramma
% nome: problema-da-completare-gita-con-controllo
% alt: Diagramma di flusso da completare: si leggono pullman, biglietto e n; un rombo chiede se n è maggiore di zero; il ramo sì è vuoto, il ramo no scrive "nessuno studente"
% ingresso: 600, 9, 24
% codice: no
% modifica: sì
leggi pullman
leggi biglietto
leggi n
se n > 0
altrimenti
    scrivi "nessuno studente"
```

### La spedizione gratuita

Un negozio in rete aggiunge 5 euro di spedizione, e la regala a chi spende almeno 30 euro. Chi ha disegnato il diagramma lo ha provato con un caso solo, e ha sbagliato. Calcola a mano il totale atteso per una spesa di 20, di 45 e di 30 euro, premi "Prova il diagramma", esegui i tre casi e trova quello che non torna. Poi torna su "Modifica", clicca dentro il blocco sbagliato, correggilo (maggiore o uguale si scrive `>=`) e riprova tutti e tre.

```diagramma
% nome: problema-da-correggere-spedizione
% alt: Diagramma di flusso da correggere: si legge spesa; un rombo chiede se spesa è maggiore di 30; il ramo sì mette in totale la spesa, il ramo no mette in totale la spesa più 5; poi si scrive totale
% ingresso: 20
% codice: no
% modifica: sì
leggi spesa
se spesa > 30
    totale = spesa
altrimenti
    totale = spesa + 5
scrivi totale
```

### Abbonamento o ingressi singoli

In una palestra l'ingresso singolo costa 7 euro e l'abbonamento del mese 40 euro. Sapendo quante volte pensi di andarci in un mese, l'algoritmo deve scrivere "abbonamento" se gli ingressi singoli costerebbero più di 40 euro, e "ingressi singoli" altrimenti.

Fai le prime quattro fasi. Scrivi su un foglio la tabella dell'analisi, con un dato di ingresso $n$ e un valore intermedio `costo`. Risolvi a mano questi quattro casi: 3 ingressi, 8 ingressi, 5 ingressi e 6 ingressi. Poi costruisci il diagramma, che ha un "leggi", un "assegna" e una "selezione" con il ramo "no" (lo aggiungi dalla casella che compare quando clicchi sul rombo), con uno "scrivi" per ramo; un testo da scrivere va tra virgolette. Eseguilo sui quattro casi e confronta con i tuoi risultati: il più istruttivo è il passaggio da 5 a 6.

```diagramma
% nome: problema-da-costruire-abbonamento
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere il numero di ingressi e scrivere se conviene l'abbonamento o gli ingressi singoli
% ingresso: 3
% codice: no
% modifica: sì
```
