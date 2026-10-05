# Flashcard: Dal problema all'algoritmo

## fasi-ordine
Quali sono, in ordine, le cinque fasi che portano da un problema a un programma?
---
Analisi del problema, strategia risolutiva, algoritmo, prova, programma.

## fasi-senza-computer
Quante delle cinque fasi si fanno senza il computer?
---
Le prime quattro: analisi, strategia, algoritmo e prova.

## analisi-domande
A quali tre domande risponde l'analisi del problema?
---
Quali sono i dati di ingresso, quali i dati di uscita, quali vincoli devono rispettare i dati.

## dati-ingresso
Che cosa sono i dati di ingresso?
---
I valori che si conoscono prima di cominciare, e che l'algoritmo legge.

## vincolo-definizione
Che cos'è un vincolo?
---
Una condizione che i dati devono rispettare perché il problema abbia senso, come "il numero di studenti è maggiore di zero".

## gita-ingresso-uscita
Nel problema della quota della gita, la quota a testa è un dato di ingresso o di uscita?
---
Di uscita: è quello che l'algoritmo deve trovare.

## uscita-non-si-legge
Vero o falso: un algoritmo può cominciare leggendo il suo dato di uscita.
---
Falso. Un dato di uscita si calcola; se lo leggi, stai chiedendo la risposta a chi usa l'algoritmo.

## valore-intermedio
Nel problema delle settimane di risparmio, `risparmi` è un dato di ingresso, di uscita o un valore intermedio?
---
Un valore intermedio: l'algoritmo lo calcola strada facendo e non lo scrive.

## strategia-come
Qual è il modo più sicuro per trovare la strategia risolutiva?
---
Risolvere a mano un caso con numeri veri, e poi rifare lo stesso conto con i nomi al posto dei numeri.

## gita-conto
Pullman da 600 euro, biglietto da 9 euro, 24 studenti. Quanto è la quota a testa?
---
34 euro: $600 : 24 = 25$, più 9.

## ordine-passi
In che ordine stanno, di solito, i passi di un algoritmo?
---
Prima le letture dei dati di ingresso, poi i calcoli, alla fine le scritture dei dati di uscita.

## caso-di-prova
Che cos'è un caso di prova?
---
Un gruppo di dati di ingresso insieme al risultato atteso, calcolato a mano prima di eseguire.

## casi-quali
Quali tre tipi di caso di prova conviene scegliere?
---
Un caso normale, uno sul confine dei vincoli e uno scomodo, con valori molto piccoli o uguali a zero.

## risultato-atteso-prima
Perché il risultato atteso si calcola prima di eseguire l'algoritmo?
---
Perché dopo aver visto l'uscita qualunque numero plausibile sembra giusto, e il confronto non prova più niente.

## settimane-confine
Finché `risparmi` < `prezzo`, aggiungi `paghetta` a `risparmi` e conta una settimana. Con prezzo 60 e paghetta 10, quante settimane?
---
6: alla sesta i risparmi sono 60, e "60 < 60" è falsa.

## settimane-zero
Nello stesso algoritmo, che cosa succede se `paghetta` vale zero?
---
Non termina: i risparmi restano a zero e la condizione è sempre vera.

## spedizione-confine
La spedizione è gratuita per chi spende almeno 30 euro. Quale condizione è giusta: `spesa > 30` oppure `spesa ≥ 30`?
---
`spesa ≥ 30`. Con il solo maggiore, chi spende 30 euro esatti paga la spedizione.

## gita-zero-studenti
Che cosa succede all'algoritmo della quota della gita con zero studenti?
---
Si ferma al calcolo, perché non si può dividere per zero: il vincolo dice che gli studenti sono più di zero.
