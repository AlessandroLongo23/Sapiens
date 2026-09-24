# Note: Rapporti, proporzioni e percentuali

Lezione nuova, senza originale. Circa 17 500 caratteri, due figure, formulario e 20 flashcard.

## Scelte di convenzione

- Proporzione definita con quattro numeri tutti diversi da zero, come nella maggior parte dei libri del biennio. Alcuni testi chiedono solo $b, d \neq 0$; con la definizione stretta la proprietà fondamentale vale nei due versi senza eccezioni.
- Ho ammesso termini negativi nelle proporzioni (esempio 3, $(-3) : x = 9 : (-12)$), perché la lezione è nel capitolo ℚ. Alcuni libri trattano le proporzioni solo con numeri positivi: se Andrea preferisce così, l'esempio si toglie senza toccare il resto.
- Nei problemi ogni rapporto confronta grandezze omogenee ($4 : 6 = 300 : x$, persone con persone e grammi con grammi), non $300 : 4 = x : 6$. Il risultato è lo stesso, ma la prima forma è quella corretta per i libri che definiscono la proporzione tra grandezze.
- "Coefficiente" per il moltiplicatore di un aumento o sconto ($1{,}12$, $0{,}85$). I libri usano anche "fattore moltiplicativo"; ho scelto una parola sola.
- Il simbolo € sta fuori dalle formule: KaTeX non ha il glifo e dà un avviso.
- "Proprietà fondamentale" fa scattare l'avviso "riempitivo" del controllo (3 volte nella lezione, 1 nel formulario, 2 nelle carte): è il nome della proprietà, quindi falso positivo.

## Cosa è rimasto fuori

- Proprietà dell'invertire, del permutare e dello scomporre: non servono a nessun conto della lezione. Il comporre c'è solo in un riquadro `ad-note`, come altra scrittura del metodo delle parti.
- Proporzione continua, medio proporzionale e quarto proporzionale: non richiesti nell'ambito. Se servono (il medio proporzionale torna con Euclide), vanno aggiunti qui con un esempio.
- Proporzionalità diretta e inversa come funzioni ($y = kx$, $y = \dfrac{k}{x}$): solo un cenno nell'errore degli operai, con il link alla lezione del capitolo funzioni.
- Interesse semplice e composto, IVA: casi particolari di aumenti; si possono aggiungere come esempi se servono in verifica.

## Dubbi

- La tabella delle tre formule delle percentuali ($P$, $p$, $T$) è nella lezione e identica nel formulario. Mi sembra un confronto vero tra tre casi; se è troppo "da imparare a memoria", si può lasciare solo la proporzione $P : T = p : 100$.
- La variazione percentuale negativa ($-16\%$) è data come convenzione del segno; qualche libro dice solo "diminuzione del $16\%$" e calcola sempre con il valore assoluto.
- L'esempio degli operai assume che lavorino tutti allo stesso ritmo; non l'ho scritto per non appesantire.

## Lezioni già scritte da ripulire

Nessuna delle lezioni in `pubblicate/` o `riscritte/` tratta rapporti, proporzioni o percentuali (controllato con una ricerca su "proporzion" e "percentual"). Quando si scriveranno "Proporzionalità diretta e inversa" e "Teorema di Talete e proporzionalità tra segmenti", è meglio che rimandino qui per la proprietà fondamentale e il termine incognito invece di rispiegarli.

## Figure

Due blocchi TikZ, compilati in locale con `scripts/figure/compile.mjs` e guardati in chiaro: `sconto-del-venti-per-cento` (barra del prezzo in cinque parti da $12$) e `divisione-in-parti-proporzionali` (barra di $120$ in otto parti da $15$, dentro l'esempio 4). Solo tratti e testo, niente riempimenti; da guardare anche nel tema scuro sul sito.

## Livelli per gli esercizi

1. Rapporto tra due interi, da ridurre ai minimi termini. Esempio: il rapporto tra $15$ e $35$ ($\dfrac{3}{7}$).
2. Termine incognito di una proporzione con interi positivi e risultato intero, $x$ in una posizione qualsiasi. Esempio: $9 : x = 6 : 4$ ($x = 6$).
3. Termine incognito con frazioni, decimali o segni negativi. Esempio: $\dfrac{3}{4} : \dfrac{9}{8} = x : 6$ ($x = 4$).
4. Percentuali: una delle tre domande (parte, percentuale, totale) con numeri che danno risultati interi o con un decimale. Esempio: il $35\%$ di un numero è $14$, qual è il numero? ($40$).
5. Aumento o sconto singolo, anche all'indietro (prezzo iniziale) o come variazione percentuale. Esempio: dopo un aumento del $15\%$ un prezzo è $69$ €, quanto era prima? ($60$ €).
6. Variazioni successive e problemi in parole con proporzioni dirette (ricette, scale, parti proporzionali). Esempio: un prezzo sale del $20\%$ e poi scende del $20\%$; di che percentuale è cambiato in tutto? (diminuzione del $4\%$).
