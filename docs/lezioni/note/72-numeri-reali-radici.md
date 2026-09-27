# Note: Radicali e loro proprietà

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (script `72-verifica.py` nello scratchpad): `real_root` per ogni radice, anche con radicando negativo e indice dispari; `solve_univariate_inequality` per le C.E. dell'esempio 2 ($x \ge 3$, $x \le 5$, $x = 0$, $x > 1$); `factor` per $x^2 + 6x + 9$; le semplificazioni degli esempi 4 e 5 e le regole sul valore assoluto controllate con valori negativi e positivi delle lettere ($-8$, $-3$, $-\frac{1}{2}$, $2$, $5$, e $b = -3$, $2$ in $\sqrt[10]{a^6 b^4}$); le riduzioni allo stesso indice e i confronti degli esempi 6-10, anche in valore numerico. La larghezza delle formule in evidenza è stata misurata con KaTeX in Chromium a 17 px: la più larga è 268 px ($\sqrt[3]{-8} = -2$ perché $(-2)^3 = -8$), fuori dai riquadri; dentro i riquadri la più larga è 215 px.

## Scelte di convenzione

- Lettere: la 72 tratta le condizioni di esistenza e il valore assoluto (sono il suo argomento) e non sottintende mai lettere positive. Le lezioni 73-76 hanno scelto "lettere sotto radice positive", dichiarato all'inizio con il link alla 72: mi sono allineato con un riquadro `ad-note` dopo l'esempio 5 ("Le lettere nelle lezioni che seguono"), che annuncia la scelta e dice che, se un esercizio non la dichiara, valgono le C.E. e le regole sul valore assoluto. Da verificare con il libro in uso: alcuni libri tengono le C.E. con i valori assoluti anche nelle operazioni.
- Regola del valore assoluto nella semplificazione, come in molti libri: indice di partenza pari ed esponente finale dispari, si mette il valore assoluto ($\sqrt[6]{x^2} = \sqrt[3]{|x|}$); non serve se l'esponente finale è pari ($\sqrt[6]{a^4} = \sqrt[3]{a^2}$), se l'indice di partenza è dispari, o se le C.E. rendono già la base non negativa ($\sqrt[6]{x^3} = \sqrt{x}$ con $x \ge 0$).
- Definizioni: "radice $n$-esima" per $a \ge 0$ come numero $b \ge 0$; il caso dell'indice dispari con radicando negativo è una sezione a parte, con $\sqrt[n]{-a} = -\sqrt[n]{a}$ per ricondurlo ai radicali aritmetici. Alcuni libri chiamano "radicale algebrico" quello con radicando negativo: non l'ho nominato.
- "Semplificare un radicale" vuol dire dividere indice ed esponenti per un divisore comune, come nei libri. Il trasporto fuori ($\sqrt{12} = 2\sqrt{3}$) è nella 73, che per questo non usa "semplificare" in quel senso.
- "Radicale irriducibile" per il radicale con MCD tra indice ed esponenti uguale a $1$.
- C.E. scritte "C.E.: $x \ge 3$", come "C.E.: $x \neq 2$" nelle lezioni 46 e 49. Ho usato `\ge` e `\le` come la 52 (la 73 usa `\geq`: si vedono uguali).
- Esistenza e unicità della radice $n$-esima accettate senza dimostrazione, e detto nel testo. La proprietà invariantiva ha una dimostrazione breve in un riquadro `ad-note`.
- MCD e MCM scritti come nel brief di stile (MCM anche per gli indici, come la 49 per i denominatori).

## Lasciato ad altre lezioni

- Numeri irrazionali, $\mathbb{R}$, $\sqrt{2}$ irrazionale: link alla 71.
- Prodotto, quoziente, trasporto fuori e dentro, confronto di $2\sqrt{3}$ e $3\sqrt{2}$: link alla 73 (Operazioni con i radicali).
- $a^{\frac{m}{n}}$ e la proprietà invariantiva come frazioni equivalenti: una frase e il link alla 76.
- Disequazioni per le C.E.: link alla 52; il caso $\sqrt{\frac{2}{x - 1}}$ si risolve senza lo studio del segno, perché il numeratore è positivo. Radicandi di secondo grado con C.E. non banali (come $\sqrt{x^2 - 4}$) aspettano le disequazioni di secondo grado: non ci sono.
- Valore assoluto: link alla 20, che lo definisce sugli interi e ha un riquadro per frazioni e decimali; qui lo uso sui reali senza ridefinirlo.

## Figure

Nessuna. Il brief chiede le figure della retta reale e delle costruzioni degli irrazionali alla 71; qui nessun passaggio parla di un disegno. Avevo pensato a una retta con $\sqrt{2}$, $\sqrt[4]{5}$ e $\sqrt[3]{4}$ per l'esempio 9, ma i tre punti cadono tra $1{,}41$ e $1{,}59$ e a 280 px le etichette si sovrappongono.

## Formulario e flashcard

- Formulario senza figure, con la tabella indice pari / dispari e tre avvisi ($\sqrt{x^2} = |x|$, proprietà invariantiva con radicando negativo, confronto con indici diversi).
- 20 carte, tutte su esempi e regole della lezione.

## Prerequisiti

La riga `numeri-reali-radici <- numeri-reali-irrazionali, numeri-interi-valore-assoluto` la cambierei in

```
numeri-reali-radici <- numeri-reali-irrazionali, numeri-interi-valore-assoluto, disequazioni-primo-grado
```

Le C.E. con le lettere (esempio 2, carte `condizioni-esistenza-*`) sono disequazioni di primo grado, e la 52 non arriva attraverso la 71 né attraverso la 20. Controllato sul grafo di `prerequisiti.md` con la riga proposta per la 71: `numeri-interi-valore-assoluto` è già antenato della 71 (tramite numeri-razionali-conversione), quindi quell'arco è ridondante e si può togliere; lo terrei solo se si vuole che il valore assoluto compaia tra i prerequisiti diretti, perché è il cuore della sezione su $\sqrt{x^2}$. Con l'arco nuovo diventa ridondante l'arco `numeri-reali-espressioni <- disequazioni-primo-grado` della bozza (la 75 ci arriva attraverso 74, 73 e 72). Le altre lezioni citate (46 per le C.E., 22 per il segno delle potenze, 07 per MCD e mcm, 30 nell'esempio 3) servono solo di passaggio: non le aggiungerei.

Sulla 17: concordo con la nota della 73, il prerequisito giusto è `radicali-operazioni`, perché la 17 porta fuori i fattori ($\sqrt{72} = 6\sqrt{2}$).

## Da cambiare nelle lezioni già scritte

- 17 (Equazioni di secondo grado), secondo paragrafo: oggi linka questa lezione per "la semplificazione dei radicali", ma quello che la 17 fa è il trasporto fuori della 73. Il testo proposto è nella nota della 73; la 72 serve alla 17 solo per la definizione di radice quadrata, che la 73 richiama.
- 57 (Indici di variabilità), sezione "La radice quadrata": dice che "i numeri come $\sqrt{2}$ e le regole di calcolo con le radici si studiano al secondo anno". Si può aggiungere il link: "si studiano al secondo anno, nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta)". La definizione della 57 coincide con quella di questa lezione.

## Per il generatore

1. Calcolare radici: quadrate, cubiche e quarte di interi, frazioni e decimali; radici di indice dispari di numeri negativi; riconoscere quelle che non esistono in $\mathbb{R}$ (esempio 1).
2. Condizioni di esistenza: radicandi di primo grado con indice pari o dispari, un caso sempre vero ($x^2 + 4$), un denominatore sotto radice ($\sqrt{\frac{2}{x - 1}}$, $x > 1$). I distrattori: $\ge$ al posto di $>$, verso della disequazione non cambiato.
3. Radice di un quadrato: $\sqrt{(x - 3)^2} = |x - 3|$, $\sqrt[3]{(x - 3)^3} = x - 3$, trinomi quadrati da riconoscere ($\sqrt{x^2 + 6x + 9} = |x + 3|$), valore per un $x$ dato.
4. Semplificare radicali numerici: scomporre il radicando e dividere per il MCD ($\sqrt[15]{32} = \sqrt[3]{2}$, $\sqrt[10]{2^4 \cdot 3^6} = \sqrt[5]{108}$), con radicali già irriducibili da riconoscere ($\sqrt[6]{12}$).
5. Semplificare con le lettere: decidere se serve il valore assoluto ($\sqrt[6]{x^2} = \sqrt[3]{|x|}$, $\sqrt[6]{a^4} = \sqrt[3]{a^2}$, $\sqrt[10]{a^6 b^4} = \sqrt[5]{|a|^3 b^2}$, $\sqrt[6]{x^3} = \sqrt{x}$ con C.E.).
6. Ridurre allo stesso indice due o tre radicali ($\sqrt{2}$, $\sqrt[3]{3}$, $\sqrt[4]{5}$ con indice $12$).
7. Confrontare e ordinare radicali con indici diversi, anche un intero con un radicale ($3$ e $\sqrt[4]{80}$) e radicali negativi ($\sqrt[3]{-3}$ e $-\sqrt{2}$).

Il controllo del generatore per il livello 5 deve verificare il risultato con valori negativi delle lettere, non solo positivi: è lì che si vede il valore assoluto mancante.
