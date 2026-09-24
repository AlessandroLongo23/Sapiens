# Note: MCD e MCM in ℕ

## Errori trovati nell'originale

- Algoritmo di Euclide descritto in modo sbagliato: "Ripetutamente sostituire i due numeri con il resto della loro divisione, finché il resto è zero". I due numeri non vanno sostituiti entrambi con il resto: la coppia $(a, b)$ diventa $(b, r)$. L'unico esempio (due divisioni, 24 e 18) non permetteva di capire il meccanismo.
- Definizione di MCM: "il più piccolo numero multiplo comune a tutti quei numeri". Presa alla lettera dà sempre 0, che è multiplo di ogni numero; va detto "diverso da zero".
- La formula $\text{MCM}(a, b) = \dfrac{a \cdot b}{\text{MCD}(a, b)}$ era data senza dire che vale solo per due numeri: con tre numeri è falsa (controesempio 2, 4, 6 ora nella lezione).
- Titolo "MCM e MCD", mentre il sito usa "MCD e MCM".

I conti dell'originale erano giusti (MCD(18, 24) = 6, MCM = 72).

## Cosa è cambiato

- Aggiunte le basi che la lezione dava per scontate: divisori e multipli, numeri primi (con 0 e 1 esclusi e il perché), criteri di divisibilità per 2, 3, 4, 5, 9, 10, 11, 25 in tabella, scomposizione in fattori primi con la colonna delle divisioni.
- MCD e MCM con la definizione, un esempio per elenco, il procedimento con la scomposizione ed esempi a due e tre numeri.
- Algoritmo di Euclide in passi numerati, con il motivo per cui funziona ($\text{MCD}(a, b) = \text{MCD}(b, r)$) e un esempio con quattro divisioni (252 e 198), controllato con la scomposizione.
- Nuove sezioni su MCD · MCM = a · b (solo due numeri), numeri primi tra loro, due problemi (piastrelle con il MCD, autobus con il MCM) e tre errori frequenti.
- Dieci esempi in tutto: è una lezione lunga. Se si vuole accorciarla, i candidati sono l'esempio 2 (seconda verifica del criterio dell'11) e l'esempio 7.

## Dubbi da decidere

- Sigla: ho usato MCM ovunque, come nei titoli del sito. Molti libri scrivono "m.c.m." in minuscolo e "M.C.D." con i punti; lo studente vedrà entrambe le forme.
- Criterio dell'11: ho scelto la versione "contando da destra" con la differenza presa in positivo. Alcuni libri contano da sinistra; il criterio funziona lo stesso, ma conviene uniformarsi al libro più usato.
- Il teorema fondamentale dell'aritmetica è solo nominato, senza dimostrazione: al biennio basta così, ma da decidere se nominarlo aiuta o confonde.
- MCD con uno dei numeri uguale a 0 ($\text{MCD}(a, 0) = a$) non è trattato: nella definizione ho scritto "non tutti nulli" per essere corretti, senza aprire il caso.
- Figura possibile per l'esempio 9: il rettangolo 360 × 264 diviso in una griglia 15 × 11 di quadrati di lato 24.

## Formulario e flashcard

- Il controllo automatico segnala "fondamentale" (è il nome del teorema fondamentale dell'aritmetica) e la maiuscola di "Algoritmo di Euclide" (nome proprio): falsi positivi, lasciati.
- Nel formulario l'algoritmo di Euclide è senza esempio: quello della lezione (quattro righe allineate) lo avrebbe allungato troppo. Se si vuole, si può aggiungere.
- Le carte con i conti usano numeri diversi da quelli degli esempi della lezione ($5316$, $4527$, $2574$, $72$, $\text{MCD}(24, 36)$, $\text{MCM}(4, 6)$), così lo studente non ricorda il risultato a memoria.
