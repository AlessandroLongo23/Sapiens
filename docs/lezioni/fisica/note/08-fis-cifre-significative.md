# Note: Le cifre significative

Lezione nuova, primo lotto di fisica, gruppo 2. Numeri rifatti in `g2/verifica.py`: gli arrotondamenti della tabella
($3{,}14159 \to 3{,}14$, $0{,}004567 \to 0{,}0046$, $26{,}48 \to 26{,}5$, $9{,}97 \to 10$, $46\,280 \to 4{,}6 \cdot
10^4$), $2{,}4499 \to 2{,}4$, la somma $20{,}006$, la differenza $0{,}12$, i prodotti $623{,}7$ e $7{,}925$, i quozienti
$8$ e $3{,}33$, il perimetro $9{,}40$, il cilindro ($15{,}7$; $8{,}51$ contro $8{,}35$), la lastra ($1{,}85$;
$0{,}8917$). `check.mts` senza avvisi.

## Regole fissate (per tutte le lezioni di fisica)

- Cifre significative: le certe più la prima incerta; una misura senza incertezza è incerta sull'ultima cifra.
- Contano le cifre diverse da zero, gli zeri in mezzo, gli zeri finali dopo la virgola; non gli zeri iniziali; gli
  zeri finali di un intero sono ambigui e si evitano con la notazione scientifica.
- Arrotondamento: si guarda solo la prima cifra tolta ($5$ o più: si aumenta), una volta sola.
- Somme e differenze: i decimali del dato che ne ha meno. Prodotti e quozienti: le cifre significative del dato che
  ne ha meno. Numeri esatti (conteggi, fattori delle formule, conversioni definite) non limitano. Si arrotonda solo
  alla fine, tenendo una o due cifre in più nei passaggi.
- Quando l'incertezza è scritta, decide l'incertezza.
- Dati di esempi ed esercizi con 2 o 3 cifre significative (già nel README di fisica).

## Struttura ed esempi

Che cosa sono (figura dei due righelli), come si contano (cinque regole, notazione scientifica, tabella, cambio di
unità), arrotondare (tabella, casi con zeri e notazione scientifica), le regole nei calcoli (somme, prodotti, numeri
esatti, passaggi intermedi), cifre significative e incertezza. Due esempi: il cilindro di ottone (arrotondare troppo
presto sposta l'ultima cifra: $8{,}5$ contro $8{,}4$) e la lastra (somma e prodotto insieme). Avvisi: lo zero finale non
è decorativo, arrotondare a passi, troncare, la differenza di misure vicine, le cifre della calcolatrice, più cifre
non vuol dire più precisione.

## Scelte e dubbi

- La regola del $5$: $5$ o più si arrotonda per eccesso, anche quando dopo il $5$ ci sono solo zeri. Esiste la regola
  "al pari" (arrotondare il $5$ alla cifra pari), usata in alcuni ambiti tecnici: non la cito.
- $9{,}97$ a due cifre significative scritto $10$ e poi $1{,}0 \cdot 10^1$: il caso è scomodo, ma è quello che
  succede.
- La notazione scientifica è nella lezione 02 (Grandezze fisiche e unità del SI, gruppo 1), linkata dove qui la si
  usa per le cifre significative.
- $\mu\text{m}$ scritto con `\mu\text{m}`: il micro in corsivo matematico. La convenzione SI lo vuole in tondo, ma
  in KaTeX `\text{µ}` dà un avviso (carattere Unicode sconosciuto, senza metriche): provato il 29 settembre 2026 con
  KaTeX 0.18.7. Da decidere per tutta la fisica.
- L'esempio 1 usa l'area di base del cilindro data ($3{,}14\ \text{cm}^2$) per non introdurre $\pi$ e le sue cifre.

## Figure

- `righelli-cifre-significative` (TikZ, 333 px): lo stesso bastoncino su un righello dei centimetri ($4$ cm) e su uno
  millimetrato ($4{,}3$ cm).

Nessuna figura interattiva: non ne ho trovata una che spieghi meglio di una tabella.

## Per il generatore

`specs/exercises/fis-cifre-significative.md`, cinque livelli: contare le cifre, arrotondare, somme e differenze,
prodotti e quozienti, numeri esatti e più passaggi.

## Domande per Andrea

- Il $5$ seguito da zeri si arrotonda sempre per eccesso, come qui?
- Nei risultati senza incertezza chiedete le regole delle cifre significative (somme: decimali; prodotti: cifre), o
  solo "non più cifre dei dati"?
- Numeri esatti: va bene l'elenco (conteggi, fattori delle formule, conversioni definite)?
- Micro in tondo o in corsivo?
