# Il concetto di algoritmo

Il navigatore non ti chiede di conoscere la città: ti dà un'indicazione alla volta ("tra 200 metri gira a destra", "alla rotonda prendi la seconda uscita") e tu, eseguendole nell'ordine, arrivi. Un elenco di istruzioni fatto così si chiama algoritmo. Dietro ogni programma del telefono o del computer ce n'è almeno uno, e chi impara a programmare comincia da qui, prima ancora di scegliere un linguaggio.

## Che cos'è un algoritmo

Un **algoritmo** è un elenco finito di passi precisi che, eseguiti nell'ordine, risolvono un problema. La divisione in colonna che hai imparato alle elementari è un algoritmo: non devi inventare niente, segui i passi e alla fine hai il quoziente e il resto, qualunque siano i due numeri di partenza.

Chi esegue i passi è l'**esecutore**, che può essere una persona oppure una macchina. All'esecutore non serve capire perché l'algoritmo funziona: gli serve saper fare ogni singolo passo. Per questo un algoritmo si scrive pensando a chi lo eseguirà, e per un computer i passi devono essere molto più piccoli di quelli che daresti a un compagno.

I valori da cui l'algoritmo parte sono i **dati di ingresso** (in inglese input), quelli che produce sono i **dati di uscita** (output). Nell'algoritmo che calcola la media di due voti, i dati di ingresso sono i due voti e il dato di uscita è la media. Scritto a parole, un passo per riga, è così:

1. Leggi il primo voto e chiamalo $a$.
2. Leggi il secondo voto e chiamalo $b$.
3. Calcola $(a + b) : 2$ e chiama il risultato `media`.
4. Scrivi `media`.

I nomi $a$, $b$ e `media` servono a dire su quale valore lavora ogni passo, senza sapere ancora quali saranno i voti. Lo stesso algoritmo si può disegnare, con un blocco per ogni passo e le frecce che dicono in che ordine eseguirli: come si legge il disegno lo spiega la lezione [I diagrammi di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso), e qui ti serve solo usarlo.

```diagramma
% nome: algoritmo-media-due-voti
% alt: Diagramma di flusso con i blocchi uno sotto l'altro: inizio, leggi a, leggi b, media che prende a più b diviso 2, scrivi media, fine
% ingresso: 7, 8
% codice: no
leggi a
leggi b
media = (a + b) / 2
scrivi media
```

Premi "Passo" e sei tu l'esecutore: a ogni pressione si esegue un blocco, e nella tabella accanto compaiono i valori. Con 7 e 8 esce 7,5. Premi "Ricomincia" e riprova con altri due voti, scrivendoli nel campo quando il blocco li chiede: i passi sono gli stessi, cambiano solo i dati.

## Le proprietà di un algoritmo

Non ogni elenco di istruzioni è un algoritmo. Perché lo sia, deve avere cinque proprietà.

| Proprietà | Che cosa vuol dire | Che cosa non va bene |
|---|---|---|
| finito | i passi sono in numero finito, e l'esecuzione prima o poi termina | "continua a contare" |
| non ambiguo | ogni passo si può capire in un modo solo | "aggiungi un po' di sale" |
| eseguibile | l'esecutore sa fare ogni passo | "indovina il numero che ho pensato" |
| deterministico | con gli stessi dati di ingresso dà sempre gli stessi risultati | "scegli a caso una delle due strade" |
| generale | risolve tutti i problemi dello stesso tipo, non uno solo | "la media di 7 e 8 è 7,5" |

L'algoritmo della media le ha tutte: quattro passi, ognuno con un solo significato, che chiedono una somma e una divisione, danno sempre lo stesso risultato con gli stessi voti e funzionano per qualunque coppia di voti. La frase "la media di 7 e 8 è 7,5", invece, è un risultato e non un algoritmo, perché non dice che cosa fare con altri due numeri.

```ad-warning
Una ricetta non è sempre un algoritmo
"Sale quanto basta" e "cuoci finché è dorato" vanno bene per una persona che sa cucinare, ma sono passi ambigui: due cuochi li eseguono in modo diverso e ottengono piatti diversi. Quando scrivi un algoritmo, rileggi ogni passo chiedendoti se si può eseguire senza decidere niente di testa propria.
```

## Un algoritmo sceglie e ripete

I passi non sono sempre in fila. Un algoritmo può scegliere tra due strade guardando i dati ("se il voto è almeno 6 scrivi promosso, altrimenti scrivi bocciato") e può ripetere un gruppo di passi finché serve. Con queste due possibilità pochi passi scritti diventano molti passi eseguiti.

Uno degli algoritmi più antichi che si conoscano li usa entrambi. È quello di Euclide per il massimo comune divisore di due numeri interi positivi (il MCD della lezione [MCD e MCM in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n)), nella versione con le sottrazioni:

1. Leggi due numeri interi positivi $a$ e $b$.
2. Finché $a$ e $b$ sono diversi, ripeti: se $a$ è maggiore di $b$ togli $b$ da $a$, altrimenti togli $a$ da $b$.
3. Scrivi $a$.

Funziona perché un numero che divide sia $a$ sia $b$ divide anche la loro differenza: togliendo il minore dal maggiore i divisori comuni non cambiano, e i numeri diventano più piccoli. Quando i due numeri sono uguali, quel valore è il loro MCD.

```diagramma
% nome: algoritmo-euclide-sottrazioni
% alt: Diagramma di flusso dell'algoritmo di Euclide: si leggono a e b; un rombo chiede se a è diverso da b; nel giro un secondo rombo chiede se a è maggiore di b, con il ramo sì che toglie b da a e il ramo no che toglie a da b; una freccia risale al primo rombo; all'uscita si scrive a
% ingresso: 48, 18
% codice: no
leggi a
leggi b
finché a != b
    se a > b
        a = a - b
    altrimenti
        b = b - a
scrivi a
```

Eseguilo con 48 e 18 un passo alla volta, guardando nella tabella come cambiano $a$ e $b$ a ogni giro, e confronta con la tabella qui sotto. Poi premi "Ricomincia" e prova con 35 e 12, che non hanno divisori comuni: deve uscire 1.

| Giro | $a$ e $b$ prima | Che cosa si fa | $a$ e $b$ dopo |
|---|---|---|---|
| 1 | $48$ e $18$ | $a \leftarrow 48 - 18$ | $30$ e $18$ |
| 2 | $30$ e $18$ | $a \leftarrow 30 - 18$ | $12$ e $18$ |
| 3 | $12$ e $18$ | $b \leftarrow 18 - 12$ | $12$ e $6$ |
| 4 | $12$ e $6$ | $a \leftarrow 12 - 6$ | $6$ e $6$ |

Al quinto controllo i due numeri sono uguali, il giro non si ripete e l'algoritmo scrive 6. I passi scritti sono tre, quelli eseguiti molti di più, e il loro numero dipende dai dati: è la ripetizione a rendere l'algoritmo generale.

```ad-warning
Un algoritmo vale per i dati per cui è stato scritto
Il primo passo dice "interi positivi", e non è un dettaglio. Con $a = 5$ e $b = 0$ il passo 2 toglie zero da $5$ per sempre, i due numeri non diventano mai uguali e l'esecuzione non termina: per quei dati l'elenco non è finito, quindi non è un algoritmo. Provalo sul diagramma con "Esegui": la pagina lo ferma dopo duemila passi.
```

## Algoritmo e programma

Un computer non esegue un elenco scritto in italiano e nemmeno un disegno. Un **programma** è un algoritmo scritto in un linguaggio di programmazione, cioè in una lingua con regole rigide che il computer sa eseguire. L'algoritmo è l'idea, e si può esprimere a parole, con un diagramma o in pseudocodice; il programma è una delle sue scritture, e lo stesso algoritmo dà programmi diversi in linguaggi diversi.

Il diagramma qui sotto trova il maggiore tra due numeri. Accanto, questa volta, c'è il programma che gli corrisponde, in due linguaggi che puoi scegliere con la linguetta: mentre esegui il diagramma si accende la riga del blocco in corso.

```diagramma
% nome: algoritmo-maggiore-di-due
% alt: Diagramma di flusso con una selezione: si leggono a e b; un rombo chiede se a è maggiore di b; il ramo sì porta a scrivi a, il ramo no a scrivi b; i due rami si riuniscono alla fine
% ingresso: 12, 30
leggi a
leggi b
se a > b
    scrivi a
altrimenti
    scrivi b
```

Non ti serve ancora saper leggere il codice. Guarda soltanto che le righe sono tante quanti i blocchi e nello stesso ordine, in tutti e due i linguaggi: l'algoritmo è uno, i programmi sono due. Dei linguaggi parla la lezione [Linguaggi, compilatori e interpreti](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/linguaggi-compilatori-e-interpreti).

```ad-warning
Algoritmo e programma non sono sinonimi
Chi scrive subito il programma, senza avere chiaro l'algoritmo, di solito si ferma a metà: sta cercando insieme che cosa fare e come scriverlo. Prima si trova l'algoritmo, con carta e penna, e poi lo si traduce. E un algoritmo non ha bisogno del computer: quello di Euclide è stato eseguito a mano per più di duemila anni.
```

## Prova tu

### Che cosa calcola?

Esegui il diagramma con 4 e 3, poi con 5 e 2, segnando su un foglio quello che scrive. Prima di provare una terza coppia, decidi che cosa calcola e prevedi il risultato con 6 e 7: se hai ragione esce 42. Poi chiediti per quali valori di $b$ il risultato è quello che ti aspetti: prova con $b = 0$ e con $b = -2$.

```diagramma
% nome: algoritmo-da-riconoscere-addizioni-ripetute
% alt: Diagramma di flusso con una ripetizione: si leggono a e b, p prende 0; un rombo chiede se b è maggiore di zero; nel giro p prende p più a e b prende b meno 1, poi una freccia risale al rombo; all'uscita si scrive p
% ingresso: 4, 3
% codice: no
leggi a
leggi b
p = 0
finché b > 0
    p = p + a
    b = b - 1
scrivi p
```

### I passi nell'ordine giusto

Tre amici comprano in rete i biglietti del cinema: ogni biglietto costa 8 euro, e sull'acquisto intero si pagano 2 euro di prevendita. L'algoritmo deve scrivere il totale, ma con 3 biglietti scrive 24 invece di 26: i passi ci sono tutti e uno è nel posto sbagliato. Premi "Prova il diagramma" ed eseguilo per trovare quale; poi torna su "Modifica", trascina il blocco sulla freccia dove deve stare e riprova.

```diagramma
% nome: algoritmo-da-riordinare-biglietti
% alt: Diagramma di flusso da correggere: si legge n, t prende n per 8, poi si scrive t, e solo dopo t prende t più 2; il blocco che scrive è prima dell'ultimo calcolo
% ingresso: 3
% codice: no
% modifica: sì
leggi n
t = n * 8
scrivi t
t = t + 2
```

### Il minore di due numeri

L'algoritmo deve leggere due numeri e scrivere il più piccolo. La lettura e la domanda ci sono già, i due rami sono vuoti. Trascina un blocco "scrivi" su ognuno dei due rami, poi clicca dentro il blocco per scegliere che cosa scrive. Prova il diagramma con 12 e 30 e poi con 9 e 4: deve uscire 12 e poi 4.

```diagramma
% nome: algoritmo-da-completare-minore
% alt: Diagramma di flusso da completare: si leggono a e b, un rombo chiede se a è minore di b, e i due rami sì e no sono ancora vuoti
% ingresso: 12, 30
% codice: no
% modifica: sì
leggi a
leggi b
se a < b
altrimenti
```

### Da ore e minuti a minuti

Costruisci il diagramma di questo algoritmo, che trasforma una durata scritta in ore e minuti nei soli minuti (un film di 2 ore e 15 minuti dura 135 minuti).

1. Leggi le ore e chiamale $h$.
2. Leggi i minuti e chiamali $m$.
3. Calcola $h \cdot 60 + m$ e chiama il risultato $t$.
4. Scrivi $t$.

Trascina ogni blocco dalla fila in alto sulla freccia dove deve stare, poi clicca dentro il blocco per scriverlo: nel rettangolo del calcolo metti `t` prima della freccia e `h * 60 + m` dopo, con l'asterisco per la moltiplicazione. Provalo con 2 e 15.

```diagramma
% nome: algoritmo-da-costruire-ore-minuti
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere le ore e i minuti e scrivere la durata in minuti
% ingresso: 2, 15
% codice: no
% modifica: sì
```
