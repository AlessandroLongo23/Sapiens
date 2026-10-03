# Flashcard: Bus e periferiche

## bus-definizione
Che cos'è un bus?
---
Un insieme di linee, cioè di collegamenti affiancati, ognuna delle quali trasporta un bit alla volta.

## tre-bus
In quali tre parti si divide il bus di un computer?
---
Bus indirizzi, bus dati e bus di controllo.

## bus-indirizzi
Che cosa trasporta il bus indirizzi, e in quale verso?
---
L'indirizzo della cella o della periferica con cui la CPU vuole comunicare. Sempre dalla CPU.

## bus-dati
In quale verso viaggiano i bit sul bus dati?
---
Nei due versi: verso la CPU in una lettura, dalla CPU in una scrittura.

## bus-controllo
Su quale bus viaggia il segnale che distingue una lettura da una scrittura?
---
Sul bus di controllo.

## indirizzo-o-contenuto
La CPU legge la cella $2040$, che contiene $75$. Quale dei due numeri viaggia sul bus dati?
---
$75$, il contenuto. $2040$ è l'indirizzo e viaggia sul bus indirizzi.

## larghezza
Che cos'è la larghezza di un bus?
---
Il numero delle sue linee, cioè dei bit che trasporta insieme.

## celle-indirizzabili
Quante celle può indirizzare un bus indirizzi con $n$ linee?
---
$2^n$, con indirizzi da $0$ a $2^n - 1$.

## otto-linee
Un bus indirizzi ha $8$ linee. Quante celle può indirizzare?
---
$2^8 = 256$.

## non-due-per-n
Vero o falso: con $10$ linee di indirizzo le celle indirizzabili sono $20$.
---
Falso. Sono $2^{10} = 1024$: le linee stanno all'esponente, non si moltiplicano per due.

## una-linea-in-piu
Che cosa succede alle celle indirizzabili se al bus indirizzi si aggiunge una linea?
---
Raddoppiano.

## linee-per-mille
Quante linee servono al bus indirizzi per $1000$ celle?
---
$10$: $2^9 = 512$ non arriva a $1000$, $2^{10} = 1024$ sì.

## sedici-linee-memoria
Con $16$ linee di indirizzo e celle da $1$ byte, quanta memoria si indirizza?
---
$2^{16}\,\text{B} = 64\,\text{KiB}$.

## periferica-ingresso
Che cos'è una periferica di ingresso? Fai un esempio.
---
Un dispositivo che porta i dati dall'esterno al computer, come la tastiera o il microfono.

## microfono
Il microfono è una periferica di ingresso o di uscita?
---
Di ingresso: per il computer il suono entra. Il verso si guarda dal computer.

## schermo-tattile
Di che tipo è lo schermo tattile di un telefono?
---
Di ingresso e di uscita: riceve i tocchi e mostra le immagini.

## memorie-di-massa-periferiche
Perché una chiavetta USB è una periferica di ingresso e di uscita?
---
Perché il computer vi scrive i file e poi li rilegge.

## processore-periferica
Vero o falso: il processore è una periferica.
---
Falso. È la CPU: le periferiche sono i dispositivi che scambiano dati con l'esterno.

## interfaccia
Che cosa fa l'interfaccia di una periferica?
---
Sta tra il bus e la periferica e traduce i segnali dell'uno in quelli dell'altra.

## porta
Che cos'è una porta?
---
Il connettore a cui si attacca il cavo di una periferica, come la porta USB.
