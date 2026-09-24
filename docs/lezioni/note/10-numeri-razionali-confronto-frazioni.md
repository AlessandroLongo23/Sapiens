# Note: Confronto tra frazioni

## Errori trovati nell'originale

- Stesso denominatore: "Se $a$ e $b$ sono due numeri naturali e $c \neq 0$, allora $\frac{a}{c} > \frac{b}{c} \Leftrightarrow a > b$". Con $c$ negativo la regola è falsa ($\frac{3}{-1} < \frac{1}{-1}$ anche se $3 > 1$): la condizione giusta è $c > 0$.
- Stesso numeratore: "Se $a$ è un numero naturale e $b, c \neq 0$, allora $\frac{a}{b} > \frac{a}{c} \Leftrightarrow b < c$". Falso per $a = 0$ (le frazioni sono uguali) e per denominatori negativi; vale per $a > 0$ e $b, c > 0$.
- Nessuna frazione negativa in tutta la lezione, mentre in verifica compaiono sempre.
- Il simbolo di diverso era scritto `` \mathrel{\char`≠} `` (da verificare se KaTeX lo rende).
- Il titolo interno era "Confronto fra frazioni", diverso dal titolo sul sito.

I conti degli esempi originali ($\frac{2}{3}$ e $\frac{3}{4}$, $\frac{5}{6}$ e $\frac{7}{9}$, l'ordinamento con denominatore 12) erano corretti.

## Cosa è cambiato

- Aggiunte frazioni equivalenti e riduzione ai minimi termini (con rimando a MCD e MCM in ℕ), che servono a confrontare.
- Aggiunto il prodotto in croce con la spiegazione del perché funziona e della condizione sui denominatori positivi, più un errore frequente con controesempio ($\frac{1}{-2}$ e $\frac{1}{3}$).
- Aggiunta la sezione sulle frazioni negative; l'esempio di ordinamento ora contiene due frazioni negative.
- Aggiunti un paragrafo breve sulla retta dei numeri e un trucco (confronto con $1$ e con $\frac{1}{2}$).
- Ho usato "MCM" in maiuscolo come nei titoli del sito, come chiede il brief.

## Dubbi da decidere

- Frazioni equivalenti e riduzione ai minimi termini forse meritano una lezione propria o stanno meglio in "Operazioni in ℚ" (ancora senza testo). Se nascerà quella lezione, qui basterà un rimando.
- Figura da fare: retta dei numeri da $-1$ a $1$ con segnati $-\frac{3}{4}$, $-\frac{3}{8}$, $\frac{1}{2}$, $\frac{2}{3}$, $\frac{3}{4}$, con le suddivisioni in quarti e ottavi visibili. Andrebbe nella sezione "Le frazioni sulla retta".
- Il criterio di equivalenza $a \cdot d = b \cdot c$ è un prodotto in croce anche lui: ho lasciato i due punti separati (equivalenza all'inizio, disuguaglianza dopo) perché compaiono così nei libri; si può valutare di unirli.

## Formulario e flashcard

- La carta `equivalenza-conto` usa $\frac{4}{6}$ e $\frac{6}{9}$, che non sono nella lezione: la regola ($a \cdot d = b \cdot c$) sì, i numeri sono nuovi. Se si vuole solo materiale della lezione, si può sostituire con $\frac{2}{3}$ e $\frac{10}{15}$.
- La figura della retta dei numeri non è nel formulario: senza non si perde niente.
- Il controllo veloce con $1$ e $\frac{1}{2}$ (riquadro `ad-tip` della lezione) è diventato una riga di testo, perché il formulario ammette solo riquadri `ad-warning`.

## Alleggerita il 24 settembre 2026

Equivalenza e riduzione ora stanno in Frazioni e numeri razionali (23). Tolti:

- dalla lezione, le sezioni "Frazioni equivalenti" e "Riduzione ai minimi termini", con l'esempio $\frac{84}{126}$. Al loro posto, sotto l'apertura, un paragrafo che tiene "prima di confrontare conviene sempre ridurre" e rimanda alla 23. Nella sezione "Le frazioni sulla retta" tolta la frase su come si trova il punto di $\frac{3}{4}$, sostituita da un rimando alla 23; restano la regola "è maggiore quella più a destra" e la figura. La frase sul denominatore negativo nell'apertura è rimasta com'era. Da 9989 a 8973 caratteri.
- dal formulario, le sezioni "Frazioni equivalenti" e "Riduzione ai minimi termini"; la riga "prima di confrontare conviene sempre ridurre" è passata sotto l'apertura. Da 2959 a 2489 caratteri.
- dalle flashcard, 6 carte: `frazioni-equivalenti-definizione`, `proprieta-invariantiva`, `equivalenza-in-croce`, `equivalenza-conto`, `minimi-termini-definizione`, `minimi-termini-come`. Ne restano 13. La nota sopra su `equivalenza-conto` non vale più.
