# Flashcard: La CPU e il ciclo di esecuzione delle istruzioni

## unita-di-controllo
Che cosa fa l'unità di controllo?
---
Dirige il lavoro della CPU: preleva l'istruzione, la decodifica e comanda le altre parti. Non fa calcoli.

## alu
Quale parte della CPU fa i calcoli e i confronti?
---
L'unità aritmetico-logica, la ALU.

## registri
Che cosa sono i registri?
---
Piccolissime memorie interne alla CPU, ognuna con un solo valore: sono le memorie più veloci del computer.

## contatore-di-programma
Che cosa contiene il contatore di programma (PC)?
---
L'indirizzo della prossima istruzione da prelevare.

## registro-istruzioni
Che cosa contiene il registro istruzioni (IR)?
---
L'istruzione che la CPU sta eseguendo.

## accumulatore
A che cosa serve l'accumulatore?
---
Contiene il numero su cui la CPU sta lavorando: i dati entrano lì, e lì la ALU lascia il risultato dei calcoli.

## indirizzo
Che cos'è l'indirizzo di una cella di memoria?
---
Il numero che la identifica nella fila delle celle.

## somma-undici
Che cosa fa l'istruzione `SOMMA 11` del linguaggio della lezione?
---
Somma all'accumulatore il contenuto della cella di indirizzo $11$. Non somma il numero $11$.

## carica-copia
Dopo `CARICA 10`, che cosa contiene la cella $10$?
---
Quello che conteneva prima: l'istruzione copia il valore nell'accumulatore, non lo sposta.

## salva-accumulatore
Vero o falso: dopo `SALVA 12` l'accumulatore vale $0$.
---
Falso. `SALVA` copia l'accumulatore nella cella e lo lascia com'è.

## fasi-ciclo
Quali sono, in ordine, le tre fasi del ciclo di esecuzione?
---
Prelievo, decodifica, esecuzione.

## prelievo
Che cosa succede nella fase di prelievo?
---
L'istruzione il cui indirizzo è nel contatore di programma viene copiata nel registro istruzioni, e il contatore aumenta di $1$.

## pc-durante
La CPU sta eseguendo l'istruzione della cella $5$. Che numero c'è nel contatore di programma?
---
$6$. Il contatore è stato aumentato già nel prelievo.

## pc-dopo-cicli
Un programma parte dalla cella $0$. Che numero c'è nel contatore di programma dopo $3$ cicli?
---
$3$: il contatore aumenta di $1$ a ogni prelievo.

## conto-accumulatore
La cella $10$ contiene $7$ e la cella $11$ contiene $5$. Quanto vale l'accumulatore dopo `CARICA 10` e `SOMMA 11`?
---
$12$, cioè $7 + 5$.

## cella-riscritta
Un programma esegue `SALVA 10` e più avanti `SOMMA 10`. Quale valore della cella $10$ viene sommato?
---
Quello nuovo, scritto da `SALVA 10`: ogni istruzione legge la memoria com'è in quel momento.

## frequenza
Che cos'è la frequenza del clock?
---
Il numero di impulsi del clock in un secondo. Si misura in hertz.

## megahertz
Quanti hertz sono $1\,\text{MHz}$?
---
$1\,000\,000\,\text{Hz}$.

## istruzioni-al-secondo
Una CPU ha un clock di $1000\,\text{Hz}$ e usa $4$ impulsi per istruzione. Quante istruzioni esegue in un secondo?
---
$250$, cioè $1000 : 4$.

## core
Che cos'è un core?
---
Una unità completa di unità di controllo, ALU e registri, che esegue da sola il ciclo di esecuzione.
