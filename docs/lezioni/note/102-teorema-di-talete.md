# Note: Teorema di Talete

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono rifatti con SymPy in `lotto10/102/verifica.py` nello scratchpad (25 controlli: le dieci proporzioni degli esempi risolte con `solve`, i controlli prodotto dei medi e prodotto degli estremi, il valore sbagliato $2{,}4$ dell'avviso sull'ordine, i fronti dei lotti, la bisettrice con il perimetro, l'esistenza dei triangoli con i lati $6, 9, 10$, $8, 10, 12$ e $7{,}5, 10{,}5, 12$, l'irrazionalità di $\sqrt{2}$). Le figure sono generate da `lotto10/102/figs102.py`, che calcola trattini, archetti e punti dalle coordinate e controlla 52 proprietà: i punti corrispondenti stanno sulla stessa parallela, nella dimostrazione del teorema del fascio $A'E$ e $C'F$ sono paralleli a $r$ e congruenti ad $AB$ e $CD$ e gli angoli segnati sono davvero congruenti, le cinque parti del segmento diviso sono uguali, nelle figure degli esempi i segmenti disegnati stanno nel rapporto dei numeri scritti (per esempio $4 : 10$ su $r$ e $6 : 15$ su $s$), $DE \parallel BC$ dove il testo lo dice, $AD$ è davvero bisettrice e $CE \parallel AD$ con $AE = AC$, $MN$ è parallelo a $BC$ e ne è la metà, $MNPQ$ è un parallelogramma. Il controllo `check.mts` passa sui tre file (restano gli avvisi sui titoli con "Talete", che è un nome proprio). Le formule in evidenza, misurate con KaTeX a 17 px, sono larghe al massimo 211 px.

## Struttura ed esempi

Fascio di rette parallele e trasversali (punti e segmenti corrispondenti); teorema del fascio con dimostrazione; costruzione per dividere un segmento in cinque parti; teorema di Talete con la spiegazione nel caso di una misura comune e il caso incommensurabile solo detto (link alla 71); altre forme della proporzione (scambio dei medi); Talete nel triangolo e il suo inverso; teorema della bisettrice; segmento dei punti medi; problemi.

Dieci esempi svolti:

1. $AB = 4$, $BC = 10$, $A'B' = 6$: $B'C' = 15$;
2. risultato decimale, $BC = 2{,}8$;
3. incognita in due segmenti, $x : (x + 3) = 4 : 6$, equazione di primo grado (link alla 16);
4. parallela a un lato: $AD = 4$, $DB = 6$, $AE = 5$, $EC = 7{,}5$;
5. inverso: $3 : 6 = 4 : 8$ dà $DE \parallel BC$, con $EC = 7$ no;
6. bisettrice con i lati $6$, $9$, $10$: $BD = 4$, $DC = 6$;
7. triangolo dei punti medi di un triangolo di lati $8$, $10$, $12$: perimetro $15$, e i quattro triangoli congruenti;
8. quadrilatero dei punti medi (Varignon), come dimostrazione;
9. tre lotti tra due strade con i confini paralleli: $24$, $36$, $60$ m;
10. bisettrice e perimetro: $AB = 7{,}5$, $AC = 10{,}5$ con la proprietà del comporre.

Avvisi dopo il loro punto: segmenti corrispondenti nello stesso ordine; i segmenti sulle parallele ($AA'$, $BB'$) non entrano nella proporzione; il segmento parallelo $DE$ non sta nella proporzione delle parti ($DE : BC = AD : AB$, rimandato alla 103); la bisettrice non passa per il punto medio.

## Scelte di convenzione (da verificare con il libro in uso)

- Misure con il soprassegno, $\overline{AB} = 4$ cm, come chiede il brief e come la 100; nelle proporzioni tra segmenti (enunciati e dimostrazioni) i nomi dei segmenti senza soprassegno, $AB : BC = A'B' : B'C'$, che è la forma dei libri per le grandezze. Le lezioni 58 e 62 invece scrivono $AB = 8$ cm e citano il soprassegno come variante: il capitolo ha due convenzioni, e andrebbero allineate (vedi "Da cambiare").
- "Teorema del fascio di rette parallele" per il teorema dei segmenti congruenti, con la nota che alcuni libri lo chiamano piccolo teorema di Talete. Altri libri lo chiamano "corollario" o lo fondono con Talete: da verificare.
- "Fascio di rette parallele" con tra parentesi "fascio improprio"; "trasversale" come nella 60.
- Teorema di Talete enunciato come uguaglianza di rapporti tra segmenti corrispondenti; l'enunciato "classi di grandezze direttamente proporzionali" di molti libri non compare.
- Secondo criterio di congruenza citato come "il lato e i due angoli adiacenti", come la 59 e la 62.
- "Teorema del segmento dei punti medi" come nome del teorema; alcuni libri lo chiamano "teorema dei punti medi" o lo mettono tra i corollari di Talete.

## Dimostrazioni

Fatte per intero, con ipotesi, tesi e passi numerati: teorema del fascio (parallelogrammi e secondo criterio), teorema inverso di Talete nel triangolo (per assurdo, con il punto $E'$ e la proprietà del comporre), teorema della bisettrice (parallela per $C$ e triangolo isoscele $ACE$, con il teorema inverso del triangolo isoscele che la 59 enuncia), segmento dei punti medi (inverso di Talete e parallelogramma $MNPB$), quadrilatero dei punti medi nell'esempio 8. In prosa: Talete nel triangolo (parallela per il vertice), la costruzione per dividere un segmento. Il teorema di Talete è spiegato solo nel caso di una misura comune; il caso incommensurabile è detto e omesso.

## Lasciato ad altre lezioni

- Proporzioni, prodotto dei medi e degli estremi, proprietà del comporre: link alla 26. La lezione usa anche lo scambio dei medi, che la 26 non nomina: è spiegato in una riga con i prodotti.
- Parallele, angoli alterni e corrispondenti: link alla 60. Parallelogrammi e condizione 4: link alla 62.
- $DE : BC = AD : AB$ e tutto quello che riguarda i triangoli simili: alla 103, citata tre volte.
- Il teorema della bisettrice dell'angolo esterno: fuori, come chiede il brief.

## Figure

Diciannove blocchi TikZ, compilati con `compileFigure` e guardati in PNG in chiaro e con il filtro del tema scuro su un riquadro bianco. Larghezza da 172 a 231 px (la più larga è `dividere-segmento-cinque-parti-congruenti`), altezza da 121 a 162 px. Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`. Le parallele sono nere e spesse, le trasversali blu come la $t$ della 60; i riempimenti sono `blue!8` e `blue!20`, i lotti `green!15` e `orange!18`.

- Teoria: `fascio-rette-parallele-trasversali`, `teorema-fascio-parallele-dimostrazione`, `dividere-segmento-cinque-parti-congruenti`, `teorema-di-talete-segmenti-proporzionali`, `talete-misura-comune`, `triangolo-parallela-a-un-lato`, `triangolo-parallela-teorema-inverso`, `teorema-bisettrice-dimostrazione`, `segmento-punti-medi-triangolo`.
- Esempi: `talete-esempio-quarto-segmento`, `talete-esempio-segmento-decimale`, `talete-esempio-equazione`, `triangolo-parallela-esempio`, `triangolo-parallela-inverso-esempio`, `teorema-bisettrice-esempio`, `triangolo-dei-punti-medi-esempio`, `quadrilatero-dei-punti-medi`, `talete-lotti-tra-due-strade`, `teorema-bisettrice-perimetro`.

Gli angoli divisi dalla bisettrice hanno un archetto con un trattino in mezzo, per distinguerli dall'arco unico dell'angolo intero. La figura della dimostrazione del teorema inverso mostra $E$ ed $E'$ distinti, come si fa nelle dimostrazioni per assurdo (la 60 fa lo stesso).

Il formulario copia `teorema-di-talete-segmenti-proporzionali` e `triangolo-parallela-a-un-lato`: quando la lezione è pubblicata, i due blocchi del formulario vanno allineati con la riga `% svg:` che lo script scrive nella lezione (il codice è identico).

## Formulario e flashcard

- Formulario: fascio e teorema del fascio, costruzione in quattro passi, Talete con le due forme e un esempio, triangolo e inverso, bisettrice, punti medi, tre avvisi.
- 18 carte, nell'ordine della lezione; i conti vengono dagli esempi 1, 4, 5, 6, 7.

## Da cambiare nelle lezioni già scritte

- 61 (Punti notevoli del triangolo), sezione "Mediane e baricentro": "Anche questa proprietà la enunciamo soltanto, perché la dimostrazione usa strumenti che arrivano più avanti." diventa "Anche questa proprietà la enunciamo soltanto: la dimostrazione usa il [segmento dei punti medi](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teorema-di-talete) e la [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine)."
- 58 e 62: le misure sono scritte $AB = 8$ cm, mentre 100, 102 e 103 scrivono $\overline{AB} = 8$ cm come chiede il brief. Se la scelta è il soprassegno, nella 58 la frase "Per la lunghezza si usa lo stesso nome del segmento: $AB = 8$ cm vuol dire che il segmento $AB$ è lungo $8$ cm (alcuni libri scrivono $\overline{AB} = 8$ cm)." va rovesciata ("La lunghezza di $AB$ si scrive $\overline{AB}$: $\overline{AB} = 8$ cm vuol dire..."), e la 62 va ripassata. Se la scelta è l'altra, sono 102 e 103 (e la 100) da cambiare: nelle mie due lezioni è una sostituzione meccanica.
- 26 (Rapporti, proporzioni e percentuali), riquadro "La proprietà del comporre": nessun cambio necessario, ma è il posto giusto per aggiungere lo scambio dei medi ("se $a : b = c : d$, allora $a : c = b : d$"), che la 102 usa.
- 62: le note dicevano che il segmento dei punti medi e il piccolo teorema di Talete erano fuori; ora ci sono qui. Nessuna frase della 62 li cita, quindi niente da sostituire.

## Prerequisiti

La riga della bozza, `teorema-di-talete <- geometria-perpendicolari-parallele, numeri-razionali-proporzioni`, non basta: la dimostrazione del teorema del fascio usa i parallelogrammi, e anche l'esempio 8 e il segmento dei punti medi. Propongo

```
teorema-di-talete <- geometria-quadrilateri, numeri-razionali-proporzioni
```

`geometria-perpendicolari-parallele` diventa antenata attraverso `geometria-quadrilateri`, quindi non va ripetuta. Gli esempi 3 e 6 risolvono equazioni di primo grado di due righe, come l'esempio 5 della 62: non conterei l'arco verso `equazioni-primo-grado`.

## Per il generatore

1. Quarto segmento con il fascio, numeri interi ($AB$, $BC$, $A'B'$ dati, $B'C'$ da trovare). Distrattori: proporzione con i corrispondenti in ordine scambiato ($2{,}4$ invece di $15$); somma invece del rapporto. Vuole la figura del fascio con i numeri.
2. Come il livello 1 con un risultato decimale, o con l'incognita su $r$. Distrattore: medio ed estremo scambiati.
3. Incognita in due segmenti ($x$ e $x + k$), equazione di primo grado. Numeri costruiti dalla soluzione intera.
4. Parallela a un lato del triangolo: una parte da trovare ($EC$), oppure un lato intero ($AC$). Distrattori: $DE$ messo nella proporzione con le parti; parte invece del lato intero.
5. Inverso: dire se $DE \parallel BC$ dati i quattro segmenti. Vero o falso, con un caso che per poco non è una proporzione ($3 \cdot 7 = 21$ contro $24$).
6. Teorema della bisettrice: dati i tre lati, le due parti del lato opposto. Distrattore: le due parti uguali (bisettrice presa per mediana); parti assegnate al contrario (la parte lunga vicino al lato corto).
7. Segmento dei punti medi: lato o perimetro del triangolo dei punti medi. Distrattore: il doppio invece della metà.
8. Divisione in parti proporzionali (lotti, bisettrice con il perimetro). Distrattore: dividere il totale in parti uguali.

Tutti i livelli tranne il 5 vorrebbero una figura; il generatore può riusare lo schema del fascio con tre parallele orizzontali e il triangolo con $DE$.

## Domande per Andrea

- Misure: $\overline{AB} = 4$ cm (come la 100) o $AB = 4$ cm (come la 58 e la 62)? E nelle proporzioni del teorema, segmenti senza soprassegno come qui?
- Nome del teorema dei segmenti congruenti: "teorema del fascio di rette parallele", "piccolo teorema di Talete" o "corollario del teorema di Talete"? Nel suo libro viene prima di Talete come qui?
- Il caso incommensurabile è solo nominato. Va bene così al secondo anno, o si toglie anche il cenno a $\sqrt{2}$?
- Teorema della bisettrice dell'angolo esterno: lasciato fuori. Serve?
- Il quadrilatero dei punti medi (Varignon) è negli esercizi dei libri del secondo anno che usa?
