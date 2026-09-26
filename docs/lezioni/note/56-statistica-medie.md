# Note: Media, mediana e moda

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy e con il modulo `statistics` di Python (frazioni esatte per le medie, `median` e `multimode` sulle liste espanse dalle tabelle): i nove esempi, gli scarti del riquadro di controllo e della figura, le frequenze relative del riquadro sulla media, gli avvisi ($33 : 3$, $163 : 6$) e le carte con un conto. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium: la più larga è $245$ px a $17$ px di base nella lezione, $227$ px nel formulario.

## Scelte di convenzione

- Media $\bar{x}$ (letta "x segnato"), mediana $\text{Me}$, frequenze assolute $f_i$, pesi $p_i$, come nella maggior parte dei libri del biennio. Niente simbolo di sommatoria $\Sigma$: le formule sono scritte con i puntini. Alcuni libri la introducono qui; se la 55 o la 57 la usano, conviene allinearsi.
- "Indici di posizione" come nome dei tre, con "valori medi" citato una volta. Alcuni libri li chiamano "indici di tendenza centrale": da verificare con il libro in uso.
- La media ponderata ha pesi positivi, e la media da tabella è presentata come media ponderata con pesi uguali alle frequenze.
- Tutti i valori con la stessa frequenza: "la distribuzione non ha moda". È la scelta più diffusa, ma qualche libro dice che tutti i valori sono mode. Da verificare.
- Mediana di caratteri qualitativi ordinabili: citata nella tabella "Quale indice usare" e in un paragrafo, senza esempio svolto, perché con $n$ pari e due modalità centrali diverse la mediana non è definita e il caso richiederebbe una precisazione in più.
- Classi scritte con la convenzione di lotto per gli intervalli, $[0, 10[$, con una frase che dice "da $0$ compreso a $10$ escluso". Va allineata a come la 55 scrive le classi (alcuni libri usano $0 \vdash 10$ o "0-10").
- Le proprietà della media sono due: la media è un valore interno e la somma degli scarti è zero, con la giustificazione in una riga. Non ho messo le proprietà di linearità (sommare o moltiplicare tutti i dati per una costante).
- Numeri grandi: $13\,000$ con lo spazio sottile, $7800$ e $2600$ senza.

## Lasciato ad altre lezioni

- Carattere, frequenze assolute, relative, cumulate, classi: link a Dati, frequenze e grafici (55) nell'apertura; la lezione le usa senza ridefinirle, tranne una frase sulla frequenza cumulata nella mediana da tabella.
- Variabilità: un riquadro `ad-note` con due distribuzioni di media $6$ ($5, 6, 7$ e $0, 6, 12$) e il link a Indici di variabilità (57). Lo scarto dalla media è definito qui perché serve per la proprietà della somma nulla; la 57 può riprenderlo con un link.
- Percentuali: la lezione usa le frequenze relative con la virgola e non le percentuali, quindi nessun link alla 26.
- Mediana di dati in classi (classe mediana, interpolazione): non trattata, il brief chiede solo il cenno sulla media con il valore centrale. Ho aggiunto la classe modale in una frase.

## Da cambiare in lezioni già scritte

Nessuna lezione pubblicata tratta media, mediana e moda. La 57 dovrebbe usare lo stesso $\bar{x}$ e la stessa definizione di scarto $x_i - \bar{x}$.

## Figure

Due, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro; colori `blue!45`, `orange!40`, `orange!80!black`, `green!50!black`, niente `\clip` né riempimenti bianchi. Non le ho viste sul sito in tema scuro.

- `media-punto-di-equilibrio` (264×106): i dati $3$, $5$, $10$ come pesi su un'asta, il sostegno in $\bar{x} = 6$ e le frecce degli scarti $-3$, $-1$, $+4$. Fuori dai riquadri, nella sezione sulle proprietà.
- `valore-anomalo-media-mediana` (270×98): i cinque stipendi dell'esempio 8 su una retta da $1000$ a $8000$, con la mediana ($1300$, tratteggiata) vicino al gruppo e la media ($2600$) spostata verso il valore anomalo. Dentro il riquadro dell'esempio 8, con `~~~tikz` come nella 49. A $1000$ e $2000$ le etichette sono vicine ma non si toccano.

Nessuna figura nel formulario.

## Formulario e flashcard

- Il formulario ha la tabella "Quale indice usare" senza la riga "Usa il valore di tutti i dati", e tre avvisi (divisore sbagliato, mediana senza ordinare, moda e frequenza).
- 19 carte. `media-conto` ($2, 4, 9$) e `mediana-pari` ($3, 4, 8, 10$) usano dati che non sono nella lezione; le regole sì.

## Prerequisiti

La riga `statistica-medie <- statistica-dati` va bene così. La lezione parte dalle tabelle di frequenza (assolute, relative, cumulate) e dalle classi, che sono tutte nella 55; i conti sono operazioni con decimali e negativi, già antenati della 55 attraverso `numeri-razionali-proporzioni`. Non servono le equazioni né gli intervalli come argomento: $[0, 10[$ è solo una notazione spiegata nella frase che la usa.

## Per il generatore

1. Media aritmetica semplice di 4-7 dati interi, anche con negativi e con lo zero: $-3, 1, 0, -2, 4, 5, 2 \Rightarrow \bar{x} = 1$.
2. Media ponderata con pesi piccoli (voti con pesi $1$, $2$, $3$), risultato con al massimo due decimali: $6$ e $8$ con peso $2$, $5$ con peso $1$ $\Rightarrow 6{,}6$.
3. Media da una tabella di frequenze assolute, con $n$ tra $10$ e $30$: tabella dei voti dell'esempio 3 $\Rightarrow 6{,}52$.
4. Mediana di una lista non ordinata, con $n$ dispari e pari (anche con valori ripetuti e mediana non intera): $12, 7, 15, 9, 7, 20, 11, 14 \Rightarrow 11{,}5$.
5. Moda e mediana da una tabella di frequenze, anche con i due posti centrali in valori diversi e con distribuzioni bimodali: tabella dell'esempio 6 $\Rightarrow \text{Me} = 1{,}5$, moda $2$.
6. Quale indice e valori anomali: calcolare media e mediana di dati con un valore anomalo e dire quale descrive meglio i dati, oppure scegliere l'indice adatto a un carattere (qualitativo, ordinabile, quantitativo).
7. Media approssimata di dati in classi con i valori centrali: tabella dell'esempio 9 $\Rightarrow 14{,}5$.

Nelle risposte a scelta i distrattori naturali sono la media divisa per il numero delle righe o dei dati invece che per la somma dei pesi, il dato centrale della lista non ordinata, il posto $\frac{n + 1}{2}$ al posto del valore, la frequenza al posto della moda.
