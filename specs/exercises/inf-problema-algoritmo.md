# inf-problema-algoritmo: Dal problema all'algoritmo

Lezione: `docs/lezioni/informatica/riscritte/46-inf-problema-algoritmo.md`. I livelli seguono le fasi della lezione:
analisi, caso risolto a mano, prova, algoritmo. Gli algoritmi sono diagrammi di flusso
(`src/lib/exercises/v2/inf-alg.ts`); niente programmi in Python o in C++.

Famiglie: `gita` (pullman diviso tra gli studenti più il biglietto, con `div` e numeri divisibili), `quota`,
`spedizione` (gratuita da una certa spesa, con l'errore sul confine dell'esercizio della lezione), `sconto`, `tetto`
(ingressi singoli o abbonamento, il costo minore), `soglia`, `risparmio` (settimane per arrivare a un prezzo),
`somma`, `multipli`, `addizioni`.

## Livelli

1. **Dati di ingresso e di uscita.** Testo. Un problema a parole, da dodici (gita, cuffie, velocità, saldi, pizza,
   palestra, benzina, media, vernice, ricetta, fotocopie, treno). Casi: `ruolo` (dove va scritto un dato
   nell'analisi: tra i dati di ingresso, di uscita, tra i valori intermedi, tra i vincoli), `ingresso` (quali sono i
   dati di ingresso), `uscita`, `vincolo`. Esempio: gita, «la quota a testa» → Tra i dati di uscita.
2. **Il risultato atteso.** Un problema e un caso di prova, senza diagramma: "che cosa deve scrivere con 30 in
   ingresso?". Opzioni: quattro risultati. Esempio: sconto di 15 euro sopra i 30, con 30 → 30.
3. **Il caso di prova che trova l'errore.** Un diagramma con l'errore sul confine (`>` al posto di `>=`, `<=` al
   posto di `<`) e quattro valori in ingresso: solo con quello sul confine il diagramma scrive altro dal risultato
   atteso. Esempio: spedizione gratuita da 20 euro, rombo "s > 20?" → 20.
4. **Dal problema al diagramma.** Il problema a parole, quattro diagrammi (sequenza o selezione).
5. **Un problema con una ripetizione.** Come il 4, con un ciclo (`risparmio`, `somma`, `multipli`, `addizioni`).
6. **Costruire il diagramma di un problema.** Risposta aperta, eseguita sulle prove di `params.tests`, che
   comprendono il caso normale e quello sul confine. A scelta multipla: quattro diagrammi.

## Distrattori

Dai riquadri della lezione: il dato di uscita messo tra i dati di ingresso; il confine della condizione; il
biglietto diviso insieme al pullman; il biglietto dimenticato; le settimane che partono da uno o il giro che fa una
settimana in più quando i risparmi arrivano giusti al prezzo; una selezione al posto del ciclo; nel livello 1, "nessun
vincolo: qualunque valore va bene".

## Da evitare

Quote che non sono intere (nelle prove della gita il costo del pullman è un multiplo del numero di studenti); zero
studenti e paghetta zero tra le prove (il diagramma si ferma o non termina: sono i vincoli); un livello 3 in cui
l'errore si vede con più di un valore.
