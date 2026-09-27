# Note: Potenze con esponente razionale

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`Rational`, `root`, `real_root`, `simplify`, `nsimplify`): le potenze $9^{\frac12}$, $8^{\frac23}$, $16^{\frac34}$, $8^{-\frac23}$, $4^{\frac24}$, $4^{-\frac12}$, $27^{\frac23}$, $16^{-\frac34}$, $\left(\frac49\right)^{-\frac12}$, $32^{0,4}$, $2^{-\frac12} = \frac{\sqrt2}{2}$; il confronto $(-8)^{\frac13}$ con `real_root` ($-2$) e $\sqrt[6]{64} = 2$; i cinque esempi della tabella delle proprietà; gli esempi 3-7 ($\sqrt[6]{32}$, $\sqrt[6]{2}$, $a\sqrt[12]{a^5}$ con `a` positivo, $\sqrt[3]{a^2}$, $\sqrt2$, $\frac14$, $-\sqrt[6]{32}$) e le somme di frazioni degli esponenti; $9^{\frac12} + 16^{\frac12} = 7$ contro $25^{\frac12} = 5$. Le formule in evidenza sono state misurate con KaTeX in Chromium (script della 47): la più larga, $\sqrt{2} \cdot \sqrt[3]{2} = 2^{\frac56} = \sqrt[6]{2^5} = \sqrt[6]{32}$ nell'esempio 3, è 221 px su 280 disponibili nei riquadri.

## Scelte di convenzione

- Lettere positive. La definizione chiede $a > 0$, quindi nella 76 non c'è altra scelta; la lezione lo dice una volta, prima degli esempi, e lo ripete negli esempi 4 e 5. Coincide con quanto hanno scritto le note 73, 74 e 75 (lettere positive dalla 73 in poi); la 72 usa le condizioni di esistenza con i valori assoluti, ed è d'accordo che per la 76 non cambia niente. La mia nota è in `76-convenzioni.md` nello scratchpad.
- Esponente scritto con la frazione, $a^{\frac{m}{n}}$, come nei libri italiani che ho in mente (da verificare con il libro in uso); mai $a^{m/n}$. Nelle formule inline la frazione nell'esponente è piccola: se sul telefono si legge male, la scrittura con la barra si può sostituire ovunque in modo meccanico.
- Definizione con $m$ intero e $n$ naturale maggiore di $1$. L'esponente negativo è dato come conseguenza della regola degli interi negativi ($a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}}$), ed è coerente con la definizione con $m$ negativo.
- Base zero: in un riquadro `ad-note` ("alcuni libri ammettono $0^{\frac{m}{n}} = 0$ con esponente positivo"). Il brief chiedeva $a > 0$ e la definizione principale resta quella. Da verificare con il libro in uso.
- Radicale di indice dispari con radicando negativo: si porta fuori il segno prima di passare alla potenza ($\sqrt[3]{-8} = -8^{\frac13}$), come la regola 3 della nota 72 per la proprietà invariantiva. L'esempio 7 lo fa con $\sqrt[3]{-4} \cdot \sqrt[6]{2}$.
- La giustificazione della definizione passa dalla potenza di potenza ($\left(5^{\frac12}\right)^2 = 5$), come la 09 giustifica $a^0$ e $a^{-n}$ con il quoziente di potenze.
- "Si fa prima la radice, poi la potenza" è un consiglio per i conti numerici, non una regola: la lezione mostra che i due ordini danno lo stesso risultato.

## Lasciato ad altre lezioni

- Proprietà invariantiva e riduzione allo stesso indice (72): citata con il link, per spiegare perché con la base positiva frazioni equivalenti danno la stessa potenza. L'esempio 3 fa con le potenze quello che la 72 fa riducendo allo stesso indice; non ho confrontato i due metodi.
- Prodotto di radicali, trasporto fuori (73): l'esempio 4 separa la parte intera dell'esponente ($a^{\frac{17}{12}} = a\sqrt[12]{a^5}$), che è il trasporto fuori visto con le potenze, ma non linko la 73 per non renderla un prerequisito.
- Razionalizzazione (74): link nel procedimento, e l'esempio 2 razionalizza $\frac{1}{\sqrt2}$.
- Esponenti reali ed esponenziali: un paragrafo finale senza link, perché la lezione Funzione esponenziale non è scritta.
- Operazioni tra frazioni (24) e decimali in frazione (11): link dove servono.

## Figure

Nessuna. Il brief non ne chiede per questa lezione, e non c'è un diagramma a cui il testo si riferisca.

## Formulario e flashcard

- Il formulario ha la tabella delle proprietà senza la colonna degli esempi (più stretta sul telefono) e tre avvisi: numeratore e denominatore scambiati, somma degli esponenti nel prodotto, basi negative.
- 18 carte, nell'ordine della lezione. La carta `esponente-negativo-segno` usa $4^{-\frac12}$, che la lezione non calcola: stessa regola di $8^{-\frac23}$ e $16^{-\frac34}$.

## Prerequisiti

La riga `radicali-esponente-razionale <- numeri-reali-radici, numeri-razionali-potenze` va bene così. La lezione si segue con la 72 (radicali, indice e radicando, proprietà invariantiva, radicando negativo con indice dispari) e con la 09 (esponenti interi negativi e proprietà delle potenze, che qui si estendono). Ho controllato con i prerequisiti di oggi e le righe della bozza che l'arco verso la 09 non è ridondante: dalla 72 non si arriva alla 09. Non aggiungerei `radicali-operazioni` né `radicali-razionalizzazione`: la lezione non usa il prodotto di radicali né il trasporto fuori come passaggi da sapere, e la razionalizzazione compare in un solo conto con il link. Se si aggiungesse `radicali-operazioni`, l'arco verso `numeri-razionali-potenze` diventerebbe ridondante (la 73 arriva alla 09 attraverso i prodotti notevoli e i monomi) e andrebbe tolto.

## Per il generatore

1. Dalla potenza al radicale e ritorno, senza conti: $7^{\frac23} = \sqrt[3]{7^2}$, $\sqrt[5]{a^3} = a^{\frac35}$, $\sqrt{3} = 3^{\frac12}$.
2. Calcolare potenze con esponente frazionario positivo e base potenza perfetta: $8^{\frac23} = 4$, $27^{\frac23} = 9$, $16^{\frac34} = 8$; distrattore con indice ed esponente scambiati.
3. Esponente negativo, base frazionaria, esponente decimale: $16^{-\frac34} = \frac18$, $\left(\frac49\right)^{-\frac12} = \frac32$, $32^{0,4} = 4$.
4. Un solo radicale da un prodotto o quoziente di radicali numerici con indici diversi e stessa base (anche dopo averla trovata, $4 = 2^2$): $\sqrt2 \cdot \sqrt[3]{2} = \sqrt[6]{32}$, $\sqrt[3]{4} : \sqrt2 = \sqrt[6]{2}$.
5. Espressioni con tre potenze da portare alla stessa base: $8^{\frac23} \cdot 4^{-\frac12} : 16^{\frac34} = \frac14$.
6. Lettere positive: prodotti con esponente finale maggiore di $1$ da riscrivere con la parte intera fuori ($a\sqrt[12]{a^5}$) e radicali annidati ($\sqrt{a\sqrt[3]{a}} = \sqrt[3]{a^2}$).
7. Casi scomodi: radicando negativo con indice dispari ($\sqrt[3]{-4} \cdot \sqrt[6]{2} = -\sqrt[6]{32}$), risultato da razionalizzare ($2^{-\frac12} = \frac{\sqrt2}{2}$), vero o falso su $(-8)^{\frac13}$ e $\left[(-2)^2\right]^{\frac12}$.

Il controllo del generatore deve usare basi positive sotto ogni esponente frazionario e confrontare i risultati come radicali semplificati (indice minimo), non come decimali.
