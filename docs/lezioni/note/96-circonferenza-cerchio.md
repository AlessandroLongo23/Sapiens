# Note: Circonferenza e cerchio

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `lotto10/96/verifica.py` nello scratchpad (lo stesso script controlla anche la 97 e la 99): le corde con il teorema di Pitagora ($\sqrt{5^2 - 3^2} = 4$, $\sqrt{13^2 - 12^2} = 5$, $\sqrt{13^2 - 5^2} = 12$, $\sqrt{10^2 - 6^2} = 8$), le cinque posizioni dell'esempio 3 con raggi $7$ e $3$ contro somma e differenza, gli angoli degli esempi 2, 4 e 5. Le figure sono generate da `lotto10/96/figs.py`, che per ogni figura controlla numericamente quello che il testo dice: punti sulla circonferenza, angoli retti in $H$, $T$, $A$, $B$, $C$, $H$ punto medio della corda, corde congruenti e distanze congruenti, le tre rette a distanza minore, uguale e maggiore del raggio, le coppie di circonferenze con $d$ nelle cinque condizioni, $\widehat{AOB} = 2\,\widehat{AVB}$ in tutte le figure degli angoli, centro dentro e fuori dall'angolo nei due casi della figura 13, $\widehat{APB} = 50^\circ$ e $\widehat{AOB} = 130^\circ$ nell'esempio 2, il triangolo $6$, $8$, $10$ nella semicirconferenza, l'angolo concavo di $240^\circ$ (55 controlli, tutti passati). Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX a 17 px, sono larghe al massimo 246 px.

## Struttura ed esempi

Circonferenza come luogo e cerchio, punti interni ed esterni; corde, diametro (la corda più lunga, con la disuguaglianza triangolare della 59), archi, settore e segmento circolare. Proprietà delle corde con due teoremi dimostrati. Retta e circonferenza con la tabella $d$ contro $r$, tangente perpendicolare al raggio, segmenti di tangente. Due circonferenze con la tabella. Angoli al centro e alla circonferenza, dimostrazione del caso con un lato per il centro, gli altri due casi detti con la figura, le due conseguenze.

Sei esempi svolti:

1. la corda dalla distanza (raggio $5$, distanza $3$, corda $8$), e il contrario (raggio $13$, corda $24$, distanza $5$);
2. l'angolo tra i raggi dall'angolo tra le tangenti ($50^\circ$, $130^\circ$), e il segmento di tangente ($5$, $13$, $12$);
3. le cinque posizioni di due circonferenze con raggi $7$ e $3$;
4. angolo al centro e alla circonferenza nei due versi, triangolo inscritto in una semicirconferenza;
5. angolo alla circonferenza ottuso ($120^\circ$) con l'angolo al centro concavo ($240^\circ$), il caso scomodo;
6. il diametro come ipotenusa ($10$, $6$, $8$).

Avvisi: circonferenza e cerchio, metà corda nel triangolo rettangolo, confrontare solo con la somma dei raggi, il doppio e la metà scambiati, il diametro trattato come cateto.

## Scelte di convenzione (da verificare con il libro in uso)

- Misure con il soprassegno, $\overline{OH} = 3$ cm, come chiede il brief e come fanno la 59 e la 80. La 58 e la 61 scrivono invece $AB = 8$ cm senza soprassegno: una delle due scelte andrebbe uniformata su tutto il capitolo.
- Il raggio $r$ è insieme il segmento e la sua lunghezza, come nei libri. Il diametro non ha una lettera (ho evitato $d$, che nella lezione è la distanza del centro dalla retta e tra i centri): nel formulario c'è "diametro $= 2r$". La 99 invece usa $d$ per il diametro in $C = \pi d$, dove non c'è la distanza.
- Angolo alla circonferenza definito con i due lati secanti. Molti libri includono il caso con un lato tangente (l'angolo tra una corda e la tangente, che vale ancora metà dell'angolo al centro): l'ho lasciato fuori. Vedi le domande per Andrea.
- "Angolo al centro corrispondente" per l'angolo al centro che insiste sullo stesso arco, come la maggior parte dei libri.
- Posizioni di due circonferenze con $r > r'$ e i nomi "esterne", "tangenti esternamente", "secanti", "tangenti internamente", "una interna all'altra", "concentriche" come caso di $d = 0$.
- Il teorema di Pitagora si usa negli esempi 1, 2 e 6 come noto dalla scuola media, con il link alla 100, come fanno già la 71, la 79 e la 80.
- Dodici grassetti, il massimo che `check.mts` accetta senza avviso: interno ed esterno non sono in grassetto.

## Dimostrazioni

Fatte, con Ipotesi, Tesi e passi numerati:

- la perpendicolare dal centro dimezza la corda (con l'asse come luogo della 61 e l'unicità della perpendicolare della 60; niente criterio dei triangoli rettangoli, che le lezioni scritte non hanno);
- corde congruenti hanno la stessa distanza dal centro (terzo criterio su $OAB$ e $OCD$, poi secondo criterio su $OAH$ e $OCK$);
- i segmenti di tangente da un punto esterno sono congruenti (con la proprietà inversa della bisettrice, che la 61 enuncia senza dimostrare);
- angolo alla circonferenza metà dell'angolo al centro, caso con un lato per il centro (triangolo isoscele e secondo teorema dell'angolo esterno della 60).

Solo ragionate in prosa: la tangente perpendicolare al raggio (dalla distanza), il diametro corda più lunga, l'angolo inscritto in una semicirconferenza. Solo enunciati: l'inverso delle corde congruenti (stessa distanza, corde congruenti), corda più vicina al centro più lunga, le condizioni della tabella di retta e circonferenza e di due circonferenze, gli altri due casi dell'angolo alla circonferenza (descritti con la figura).

## Lasciato ad altre lezioni

- Lunghezze e aree (circonferenza, cerchio, settore, segmento circolare): link alla 99.
- Poligoni inscritti e circoscritti, quadrilateri inscrivibili: alla 97, che usa gli angoli alla circonferenza e i segmenti di tangente di questa lezione.
- Il teorema di Pitagora: link alla 100.
- Equazione della circonferenza nel piano cartesiano: anni successivi, nessun link.
- Il caso dell'angolo tra corda e tangente, e le costruzioni con riga e compasso delle tangenti da un punto esterno: non trattati.

## Figure

Diciotto blocchi TikZ, generati da `figs.py` e compilati con `compileFigure` di `scripts/figure/compile.mjs`, guardati in PNG in chiaro e con il filtro di inversione su un riquadro bianco. Larghezza da 132 a 268 px (la più larga è `due-circonferenze-posizioni`, sei coppie su due righe), altezza da 118 a 163 px. Circonferenze `thick` nere, rette e lati degli angoli `blue!70!black`, archi evidenziati `very thick`, cerchio `blue!8`, settore e segmento `blue!15` con percorsi esatti (`arc`), niente `\clip` e niente riempimenti bianchi. Trattini per i segmenti congruenti, archetti per gli angoli, quadratini per gli angoli retti come nella 61 e nella 62.

`circonferenza-cerchio-punti`, `corda-diametro-arco`, `settore-segmento-circolare`, `perpendicolare-centro-dimezza-corda`, `corde-congruenti-stessa-distanza`, `retta-circonferenza-posizioni`, `tangente-perpendicolare-raggio`, `segmenti-tangenti-punto-esterno`, `esempio-angolo-tra-tangenti`, `due-circonferenze-posizioni`, `angolo-al-centro-e-alla-circonferenza`, `angolo-alla-circonferenza-lato-per-il-centro`, `angolo-alla-circonferenza-altri-casi`, `angoli-alla-circonferenza-stesso-arco`, `angolo-inscritto-semicirconferenza`, `esempio-corda-distanza-centro`, `esempio-triangolo-inscritto-semicirconferenza`, `esempio-angolo-al-centro-concavo`.

Il formulario copia `settore-segmento-circolare` e `angolo-al-centro-e-alla-circonferenza`.

## Formulario e flashcard

- Formulario: definizioni con i punti interni ed esterni, proprietà delle corde con la relazione di Pitagora tra metà corda, distanza e raggio (la lezione la usa negli esempi ma non la scrive come formula: si può togliere), le due tabelle, gli angoli, tre avvisi.
- 19 carte, nell'ordine della lezione; tutti i numeri vengono dagli esempi.

## Da cambiare nelle lezioni già scritte

- 61 (Punti notevoli del triangolo), sezione "Dove cadono i punti notevoli": "Nel triangolo rettangolo il circocentro è il punto medio dell'ipotenusa, e la circonferenza circoscritta ha l'ipotenusa come diametro." Si può aggiungere "È l'angolo inscritto in una semicirconferenza della lezione [Circonferenza e cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/circonferenza-e-cerchio)."

## Prerequisiti

La riga della bozza è `circonferenza-cerchio <- geometria-perpendicolari-parallele`, ma la lezione usa l'asse di un segmento come luogo e la proprietà inversa della bisettrice, che sono nella 61. La cambierei in

```
circonferenza-cerchio <- geometria-punti-notevoli
```

(`geometria-perpendicolari-parallele` è già antenata attraverso la 61). Il teorema di Pitagora serve solo negli esempi e non è un prerequisito.

## Per il generatore

1. Posizione di un punto rispetto alla circonferenza dati $r$ e la distanza dal centro. Distrattore: interno ed esterno scambiati.
2. Posizione di una retta dati $r$ e $d$ (secante, tangente, esterna). Distrattore: "tangente" con $d < r$.
3. Posizione di due circonferenze dati $r$, $r'$ e $d$, anche con $d < r - r'$. Distrattori: "secanti" confrontando solo con la somma; esterne e interne scambiate.
4. Corda dalla distanza e dal raggio, e viceversa, con terne pitagoriche ($3, 4, 5$; $5, 12, 13$; $8, 15, 17$). Distrattori: la metà corda come risposta; la corda intera nel triangolo.
5. Angolo al centro dall'angolo alla circonferenza e viceversa, anche ottuso con l'angolo al centro concavo. Distrattori: il doppio e la metà scambiati; l'angolo convesso al posto di quello concavo.
6. Angolo tra due tangenti e angolo tra i raggi (supplementari). Distrattore: $360^\circ$ meno l'angolo, dimenticando i due angoli retti.
7. Triangolo inscritto in una semicirconferenza: l'angolo acuto mancante, o un cateto dal diametro e dall'altro cateto. Distrattore: $\sqrt{d^2 + c^2}$, con il diametro come cateto.

I livelli 4, 5, 6 e 7 vorrebbero una figura, generata con le stesse regole di `figs.py`.

## Domande per Andrea

- Misure con o senza soprassegno: $\overline{AB} = 8$ cm o $AB = 8$ cm? Le lezioni del primo anno non sono d'accordo tra loro.
- L'angolo alla circonferenza con un lato tangente va incluso nella definizione e nel teorema, o basta quello con i lati secanti?
- Due circonferenze: "una interna all'altra" o "interne"; e le concentriche come caso particolare o come sesto caso?
- Il teorema di Pitagora negli esempi prima della 100: va bene come conoscenza della scuola media, o gli esempi con le corde vanno spostati dopo?
- Le dimostrazioni evitano il criterio di congruenza dei triangoli rettangoli (ipotenusa e un cateto), che le lezioni del primo anno non hanno. Se il libro in uso lo dà, due dimostrazioni si accorciano: conviene aggiungerlo alla 59?
