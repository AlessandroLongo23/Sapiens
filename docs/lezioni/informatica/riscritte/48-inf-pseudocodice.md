# Lo pseudocodice

Un [diagramma di flusso](/materiale/scuola-superiore/informatica/algoritmi-e-diagrammi-di-flusso/i-diagrammi-di-flusso) fa vedere bene la strada di un algoritmo, ma disegnarlo richiede tempo e, appena i blocchi sono più di una decina, non sta più in una pagina. Un programma è più compatto, ma obbliga a rispettare le regole di un linguaggio fino all'ultima virgola. In mezzo c'è lo pseudocodice: l'algoritmo scritto a righe, in italiano, con poche parole fisse.

## Un algoritmo scritto a righe

Lo **pseudocodice** è un modo di scrivere un algoritmo con una riga per ogni passo, usando un piccolo numero di parole sempre uguali per le azioni che si ripetono in tutti gli algoritmi: leggere, scrivere, calcolare, scegliere, ripetere. Assomiglia a un programma ("pseudo" vuol dire "finto"), ma è scritto per essere letto da una persona, e un computer non lo esegue.

L'algoritmo che calcola il prezzo di un oggetto in saldo, dati il prezzo pieno e la percentuale di sconto, in pseudocodice è questo:

```
inizio
leggi prezzo
leggi sconto
risparmio ← prezzo · sconto / 100
finale ← prezzo − risparmio
scrivi finale
fine
```

Ogni riga è un blocco del diagramma di flusso dello stesso algoritmo, nello stesso ordine, e dentro la riga c'è scritto quello che starebbe dentro il blocco. Esegui il diagramma con un prezzo di 80 euro e uno sconto del 25 per cento, e a ogni "Passo" cerca nello pseudocodice la riga del blocco che si è acceso.

```diagramma
% nome: pseudocodice-sequenza-prezzo-in-saldo
% alt: Diagramma di flusso con i blocchi uno sotto l'altro: inizio, leggi prezzo, leggi sconto, risparmio che prende prezzo per sconto diviso 100, finale che prende prezzo meno risparmio, scrivi finale, fine
% ingresso: 80, 25
% codice: no
leggi prezzo
leggi sconto
risparmio = prezzo * sconto / 100
finale = prezzo - risparmio
scrivi finale
```

## Le parole dello pseudocodice

Lo pseudocodice non ha regole ufficiali: ogni libro e ogni insegnante ha il suo, e in una verifica vale quello usato in classe. Quello di queste lezioni usa le stesse parole e gli stessi segni che trovi scritti nei blocchi dei diagrammi, così passare da uno all'altro è copiare.

| Nel diagramma | Nello pseudocodice | Che cosa fa |
|---|---|---|
| ovali | `inizio`, `fine` | aprono e chiudono l'algoritmo |
| parallelogramma | `leggi n` | chiede un valore e lo mette nella variabile $n$ |
| parallelogramma | `scrivi n`, `scrivi "ciao"` | mostra il valore di $n$, oppure il testo tra virgolette |
| rettangolo | `a ← b · h` | calcola quello che sta a destra e lo mette in $a$ (assegnamento) |
| rombo con due rami | `se` ... `altrimenti` | sceglie quali righe eseguire (selezione) |
| rombo con la freccia che risale | `finché` | ripete le righe finché la condizione è vera (ripetizione) |

Nei calcoli si usano `+`, `−`, `·` e `/`, più `div` e `mod` per il quoziente e il resto della divisione tra interi: `17 div 5` vale 3 e `17 mod 5` vale 2. Nelle condizioni si usano `=`, `≠`, `<`, `>`, `≤`, `≥`, e per unirne due le parole `e`, `o`, `non`.

```ad-warning
La freccia assegna, l'uguale confronta
`n ← 5` è un ordine: metti 5 in $n$. `n = 5` è una domanda: $n$ vale 5? La prima sta da sola su una riga, la seconda solo dopo `se` o `finché`. Chi scrive `n = n + 1` al posto di `n ← n + 1` ha scritto una domanda che ha sempre risposta no.
```

## La selezione e il rientro

Nel diagramma si vede dalle frecce quali blocchi stanno su un ramo. Nello pseudocodice lo dice il **rientro**: le righe che dipendono da un `se` cominciano più a destra, tutte dello stesso spazio, e la prima riga che torna al margine è fuori dalla selezione. La parola `altrimenti` sta sotto il suo `se`, allo stesso livello, e apre le righe del ramo "no".

```
inizio
leggi voto
se voto ≥ 6
    scrivi "sufficiente"
altrimenti
    scrivi "insufficiente"
scrivi "voto registrato"
fine
```

Delle due righe rientrate se ne esegue una sola, quale dipende dal voto; l'ultimo `scrivi` è al margine, quindi si esegue sempre. Prima di usare il diagramma, decidi che cosa esce con 7 e con 6, poi controlla.

```diagramma
% nome: pseudocodice-selezione-voto
% alt: Diagramma di flusso con una selezione: si legge voto; un rombo chiede se voto è maggiore o uguale a 6; il ramo sì scrive "sufficiente", il ramo no scrive "insufficiente"; i rami si riuniscono e si scrive "voto registrato"
% ingresso: 7
% codice: no
leggi voto
se voto >= 6
    scrivi "sufficiente"
altrimenti
    scrivi "insufficiente"
scrivi "voto registrato"
```

Quando nel caso "no" non c'è niente da fare, `altrimenti` non si scrive, come nel diagramma il ramo "no" resta senza blocchi.

```ad-warning
Il rientro non è un abbellimento
Se scrivi `scrivi "voto registrato"` rientrato come la riga sopra, lo hai messo nel ramo "no", e con un 7 non viene più scritto. Nello pseudocodice gli spazi all'inizio della riga cambiano l'algoritmo: prima di consegnare, controlla il rientro riga per riga.
```

## La ripetizione

Anche le righe da ripetere sono rientrate, sotto la riga `finché` con la condizione. Arrivato in fondo alle righe rientrate, l'esecutore torna alla riga `finché` e controlla di nuovo: se la condizione è vera fa un altro giro, se è falsa prosegue dalla prima riga al margine. Questo pseudocodice scrive i primi cinque multipli di un numero.

```
inizio
leggi n
i ← 1
finché i ≤ 5
    scrivi n · i
    i ← i + 1
scrivi "fatto"
fine
```

Uno pseudocodice si segue a mano come un diagramma, con una tabella che ha una riga per ogni controllo della condizione. Con $n = 3$:

| Controllo | $i$ | $i \leq 5$? | Che cosa si scrive | $i$ dopo il giro |
|---|---|---|---|---|
| primo | $1$ | sì | 3 | $2$ |
| secondo | $2$ | sì | 6 | $3$ |
| terzo | $3$ | sì | 9 | $4$ |
| quarto | $4$ | sì | 12 | $5$ |
| quinto | $5$ | sì | 15 | $6$ |
| sesto | $6$ | no | fatto | |

Compila la tabella su un foglio per $n = 7$, poi esegui il diagramma con 7 e confronta. Accanto al diagramma questa volta c'è anche il programma: mettilo vicino allo pseudocodice e vedrai che le righe sono le stesse, con le parole in inglese e qualche segno in più.

```diagramma
% nome: pseudocodice-ripetizione-multipli
% alt: Diagramma di flusso con una ripetizione: si legge n e i prende 1; un rombo chiede se i è minore o uguale a 5; nel giro si scrive n per i e i prende i più 1, poi una freccia risale al rombo; all'uscita si scrive "fatto"
% ingresso: 3
leggi n
i = 1
finché i <= 5
    scrivi n * i
    i = i + 1
scrivi "fatto"
```

Per questo lo pseudocodice è l'ultimo passo prima del programma: chi ha uno pseudocodice corretto deve solo tradurlo riga per riga, come farai a partire dalla lezione [Il primo programma: input e output](/materiale/scuola-superiore/informatica/linguaggi-e-primi-programmi/il-primo-programma-input-e-output).

```ad-note
Altre scritture che puoi incontrare
Molti libri scrivono le parole in maiuscolo e chiudono ogni struttura con una riga apposta: `SE ... ALLORA ... ALTRIMENTI ... FINE SE`, `MENTRE ... ESEGUI ... FINE MENTRE`. L'algoritmo è lo stesso. Va bene qualunque scrittura, purché sia una sola dall'inizio alla fine e dica senza dubbi dove comincia e dove finisce ogni ramo e ogni giro.
```

## Prova tu

### Che cosa scrive?

Segui a mano questo pseudocodice con $n = 20$, con una tabella per $n$ e $c$, e scrivi il risultato su un foglio. Poi esegui il diagramma, che è lo stesso algoritmo, e controlla. Rifallo con 64 e con 1.

```
inizio
leggi n
c ← 0
finché n > 1
    n ← n div 2
    c ← c + 1
scrivi c
fine
```

```diagramma
% nome: pseudocodice-da-seguire-dimezzamenti
% alt: Diagramma di flusso con una ripetizione: si legge n e c prende 0; un rombo chiede se n è maggiore di 1; nel giro n prende n div 2 e c prende c più 1, poi una freccia risale al rombo; all'uscita si scrive c
% ingresso: 20
% codice: no
leggi n
c = 0
finché n > 1
    n = n // 2
    c = c + 1
scrivi c
```

### Il diagramma che non corrisponde

Lo pseudocodice scrive i numeri da 1 a $n$ e, una volta sola, "fatto". Il diagramma dovrebbe essere lo stesso algoritmo, ma un blocco è finito nel posto sbagliato: premi "Prova il diagramma", eseguilo con 3 e trova la differenza; poi torna su "Modifica", sposta il blocco trascinandolo sulla freccia giusta e riprova.

```
inizio
leggi n
i ← 1
finché i ≤ n
    scrivi i
    i ← i + 1
scrivi "fatto"
fine
```

```diagramma
% nome: pseudocodice-da-correggere-rientro
% alt: Diagramma di flusso da correggere: si legge n e i prende 1; un rombo chiede se i è minore o uguale a n; nel giro si scrive i, poi si scrive "fatto", poi i prende i più 1; dopo l'uscita dal giro non c'è nessun blocco
% ingresso: 3
% codice: no
% modifica: sì
leggi n
i = 1
finché i <= n
    scrivi i
    scrivi "fatto"
    i = i + 1
```

### Dallo pseudocodice al diagramma

Costruisci il diagramma di questo pseudocodice, che dice se un numero è divisibile per un altro.

```
inizio
leggi a
leggi b
se a mod b = 0
    scrivi "divisibile"
altrimenti
    scrivi "non divisibile"
fine
```

Ti servono due "leggi", una "selezione" con il ramo "no" e due "scrivi". Quando scrivi dentro un blocco usi la tastiera, che non ha i segni ≤ e ≠: si battono `<=` e `!=`, e il confronto di uguaglianza vuole due segni, `a mod b == 0`. A blocco chiuso il diagramma mostra gli stessi segni dello pseudocodice. Provalo con 12 e 4, poi con 14 e 4.

```diagramma
% nome: pseudocodice-da-costruire-divisibile
% alt: Un diagramma di flusso da costruire, con i soli blocchi di inizio e di fine: deve leggere a e b e scrivere se a è divisibile per b
% ingresso: 12, 4
% codice: no
% modifica: sì
```

### Dal diagramma allo pseudocodice

Un servizio di monopattini a noleggio fa pagare 1 euro di sblocco più 20 centesimi al minuto, e sopra i 30 minuti toglie 2 euro dal totale. Scrivi su un foglio lo pseudocodice di questo diagramma, una riga per blocco, con il rientro. Per controllare: le righe sono sette contando `inizio` e `fine`, una sola è rientrata e non c'è `altrimenti`.

```diagramma
% nome: pseudocodice-da-scrivere-monopattino
% alt: Diagramma di flusso con una selezione a un solo ramo: si legge minuti, costo prende 1 più minuti per 0,2; un rombo chiede se minuti è maggiore di 30; il ramo sì toglie 2 da costo, il ramo no non ha blocchi; poi si scrive costo
% ingresso: 40
% codice: no
leggi minuti
costo = 1 + minuti * 0.2
se minuti > 30
    costo = costo - 2
scrivi costo
```
