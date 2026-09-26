# Note: Indici di variabilità

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `57-verifica.py` nello scratchpad): medie, campi di variazione, scarti e loro somma, $S$, $\sigma^2$ con la definizione e con la formula alternativa, le radici arrotondate al centesimo ($\sqrt{3{,}6} \approx 1{,}90$, $\sqrt{0{,}4} \approx 0{,}63$, $\sqrt{1{,}3} \approx 1{,}14$, $\sqrt{3{,}25} \approx 1{,}80$, $\sqrt{6{,}4} \approx 2{,}53$, $\sqrt{12{,}8} \approx 3{,}58$), il $5{,}2$ dell'avviso sulle righe e $1{,}41^2 = 1{,}9881$.

## Scelte di convenzione

- Un esempio guida per tutta la teoria: i voti di Marta ($6, 7, 7, 7, 8$) e di Luca ($4, 6, 7, 9, 9$), con la stessa media e la stessa mediana $7$. Ogni indice si calcola sui due, e il confronto tra distribuzioni con la stessa media attraversa la lezione; l'esempio 5 aggiunge il caso con lo stesso campo di variazione e $\sigma$ diversi.
- Simboli: $S$ per lo scarto semplice medio, $\sigma^2$ per la varianza, $\sigma$ per lo scarto quadratico medio, $x_{\max} - x_{\min}$ per il campo di variazione senza una lettera propria. I libri non sono d'accordo: alcuni scrivono "scostamento semplice medio", alcuni usano $s$ o $\delta$. Da verificare con il libro in uso.
- Varianza della popolazione, con divisione per $n$. Un riquadro `ad-note` spiega i due tasti $\sigma_x$ e $s_x$ della calcolatrice (il secondo divide per $n - 1$); si può togliere.
- Niente simbolo di sommatoria $\Sigma$: le formule sono scritte con i puntini, perché al primo anno la sommatoria di solito non c'è. La formula con le frequenze è larga 276 px (misurata con KaTeX a 17 px): fuori dai riquadri sta nella colonna, ma è la più larga della lezione.
- Arrotondamento di $\sigma$ al centesimo, con $\approx$.
- La formula alternativa ($\sigma^2$ = media dei quadrati meno quadrato della media) è in un riquadro `ad-note` dopo l'esempio 4, e nel formulario in una riga. Non era nel brief: l'ho messa perché molti libri la danno ed è comoda con le medie decimali. Si può togliere da lezione e formulario senza altre conseguenze.
- Il controllo $\sigma \geq S$ (riquadro `ad-tip` e una carta) è enunciato senza dimostrazione; è vero sempre (la media quadratica non è minore della media aritmetica), con l'uguaglianza quando tutti gli scarti hanno lo stesso valore assoluto.
- "Indice di posizione" per la media nell'apertura: da allineare con il termine che usa la 56.

## La radice quadrata

La lezione dipende dai radicali meno di quanto sembri. La sezione "La radice quadrata" definisce $\sqrt{a}$ per $a \geq 0$ come il numero non negativo che al quadrato dà $a$, con tre esempi esatti ($\sqrt{49}$, $\sqrt{0{,}36}$, $\sqrt{0}$), l'uso della calcolatrice con l'arrotondamento ($\sqrt{2} \approx 1{,}41$), il controllo elevando al quadrato e il fatto che i negativi non hanno radice. Non si parla di irrazionali, proprietà o operazioni con i radicali, e non ci sono link a quelle lezioni (sono ancora vuote); una frase dice che si studiano al secondo anno. Due esempi hanno $\sigma$ intero ($\sqrt{4} = 2$), gli altri usano la calcolatrice. Secondo me la dipendenza non è troppa: serve solo il tasto della calcolatrice. Quando saranno scritte le lezioni dei radicali, la frase del secondo anno può diventare un link a Numeri irrazionali e numeri reali.

## Lasciato ad altre lezioni

- Media aritmetica, media ponderata, somma degli scarti nulla: link a Media, mediana e moda (56), che tratta la proprietà. Qui la si usa come controllo.
- Tabelle di frequenza: link a Dati, frequenze e grafici (55).
- Valore assoluto e quadrato dei negativi: link a Numeri interi e valore assoluto (20) e Potenze in ℤ (22).
- Non trattati: coefficiente di variazione, varianza di dati in classi, scarto interquartile e box plot, la regola "la maggior parte dei dati sta tra $\bar{x} - \sigma$ e $\bar{x} + \sigma$" (vera solo per alcune distribuzioni). Se il programma li chiede, il coefficiente di variazione ($\sigma / \bar{x}$) starebbe bene dopo l'esempio 5.

## Da togliere o controllare in lezioni già scritte

Nessuna lezione pubblicata parla di variabilità. Da controllare quando arriva la 56: che tratti la proprietà "somma degli scarti nulla" (la 57 la richiama con "come trovi nella lezione") e che usi $\bar{x}$ come qui.

## Figure

- `voti-marta-luca-stessa-media`: due rette da 4 a 10, i voti come pallini impilati (blu tenue Marta, arancio tenue Luca), linea tratteggiata sulla media 7. 253×146 px.
- `scarti-dalla-media-voti-luca`: i cinque voti di Luca su righe diverse, ognuno con una freccia dalla media tratteggiata, etichettata con lo scarto. 208×168 px.

Entrambe fuori dai riquadri, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`): leggibili, niente `\clip` né riempimenti bianchi. Nella prima versione della seconda i cerchi erano ellissi, perché il raggio segue la scala di `y`: ora le due scale sono uguali. Non le ho viste sul sito. Il formulario non ha figure.

## Formulario e flashcard

- Il formulario riprende l'esempio 2 (gol) come esempio di tabella di frequenze e le tre trappole più costose.
- 20 carte, nell'ordine della lezione. Due carte vero/falso sulla radice quadrata ($\sqrt{49} = -7$, radice di $-9$).

## Prerequisiti

La riga `statistica-variabilita <- statistica-medie` va bene così: la media (anche ponderata) e la somma degli scarti vengono dalla 56, e le tabelle di frequenza arrivano attraverso la 56, che dipende da statistica-dati. Il valore assoluto e i quadrati dei negativi sono antenati lontani (numeri interi) e non meritano un arco diretto. Non aggiungerei un arco verso i radicali: la radice quadrata è introdotta qui come operazione della calcolatrice, e il dubbio in `prerequisiti.md` si può chiudere così.

## Per il generatore

1. Campo di variazione di 4-8 dati interi, anche negativi: $-2, 3, 5, -4 \to 9$.
2. Scarti dalla media di 4-6 dati con media intera, con il controllo della somma nulla.
3. Scarto semplice medio di 4-6 dati con media intera: $6, 7, 7, 7, 8 \to S = 0{,}4$.
4. Varianza e scarto quadratico medio con radice esatta: $2, 4, 4, 4, 5, 5, 7, 9 \to \sigma^2 = 4$, $\sigma = 2$.
5. Varianza e scarto quadratico medio arrotondato al centesimo: $4, 6, 7, 9, 9 \to \sigma^2 = 3{,}6$, $\sigma \approx 1{,}90$.
6. Scarto quadratico medio da una tabella di frequenze con media intera: gol $0..4$ con frequenze $2, 5, 6, 5, 2 \to \sigma \approx 1{,}14$.
7. Confronto di due serie con la stessa media: quale ha $\sigma$ maggiore, con i due valori ($1, 5, 5, 5, 9$ contro $1, 1, 5, 9, 9$).
