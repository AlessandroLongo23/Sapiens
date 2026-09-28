# Note: Trasformazioni geometriche

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `verifica.py` (scratchpad `lotto10/104/`), 27 controlli: la composizione di due simmetrie con assi paralleli sulla retta dei numeri ($x \mapsto x + 2d$ e, nell'altro ordine, $x - 2d$), la composizione con assi incidenti (matrici delle simmetrie: rotazione di $2\beta$, e simmetria centrale con assi perpendicolari), il fattore $|k|$ delle distanze nell'omotetia, le immagini dei punti degli esempi 1 e 2 e della tabella delle simmetrie, le aree $1$ e $4$, le rette immagine degli esempi 3, 4 e 5 (con `solve`), la retta $y = 2x + 8$ dell'avviso sui segni, e i conti delle carte. Lo stesso script esegue `figs.py`, che controlla le 13 figure (46 controlli): spostamenti uguali al vettore nella traslazione, distanze dal centro e angolo di $80^\circ$ nella rotazione, $O$ punto medio nella simmetria centrale, asse perpendicolare nel punto medio e verso di percorrenza invertito nella simmetria assiale, spostamento $2d$ nella composizione, $\overline{OP'} = |k| \cdot \overline{OP}$ dalla parte giusta nelle due omotetie, punti delle rette sulle rette disegnate. Il controllo `check.mts` passa sui tre file senza avvisi. Le formule in evidenza sono larghe al massimo 194 px nella lezione e 228 px nel formulario (KaTeX a 17 px).

## Struttura ed esempi

Trasformazione come corrispondenza biunivoca (link alla 18), immagine, punto unito, identità, un controesempio (la proiezione su una retta). Isometrie: cosa conservano, poi traslazione (con il vettore), rotazione, simmetria centrale, simmetria assiale, ognuna con la figura e i punti uniti; isometrie dirette e inverse con la tabella. Composizione (link alla 44) con le due simmetrie ad assi paralleli, la dimostrazione sulla retta dei numeri e un `ad-note` sugli assi incidenti. Omotetia con $k$ positivo e negativo, come esempio di similitudine (link alla 103). Nel piano cartesiano (link alla 80): equazioni della traslazione, delle simmetrie (tabella), dell'omotetia di centro l'origine, immagine di una retta con il procedimento in cinque passi.

Cinque esempi svolti, tutti nel piano cartesiano: triangolo traslato, triangolo nell'omotetia di rapporto $2$ con le aree, retta traslata ($y = 2x + 1 \to y = 2x - 6$), retta simmetrica rispetto a $y = x$ (collegata al grafico della funzione inversa della 44, che usa la stessa funzione $2x + 1$), retta nell'omotetia. Le parti sintetiche (traslazione, rotazione, simmetrie, composizione, omotetia) sono spiegate con le figure, senza esempi numerati. Avvisi: simmetria centrale e assiale, l'ordine nella composizione, l'area nell'omotetia, quale coordinata cambia segno, il segno nella sostituzione.

## Scelte di convenzione (da verificare con il libro in uso)

- Trasformazione scritta $t(P) = P'$, composizione $t_2 \circ t_1$ come nella 44, simmetrie assiali $s_a$ e $s_b$ con gli assi chiamati $a$ e $b$. I libri usano simboli diversi ($\tau_{\vec{v}}$, $\mathcal{R}_{O,\alpha}$, $\sigma_r$, $\omega_{O,k}$): li ho evitati quasi del tutto.
- Vettore $\vec{v}$ con direzione, verso e modulo; nel piano cartesiano $\vec{v}(a, b)$, come i punti.
- Angolo di rotazione positivo in senso antiorario.
- "Isometrie dirette e inverse" per chi conserva o inverte il verso di percorrenza; alcuni libri dicono "invertenti" o "opposte".
- Equazioni scritte con il sistema (`cases`) nella lezione e in riga nelle tabelle.
- Rette immagine con il metodo della sostituzione delle coordinate inverse, poi il controllo con un punto. L'alternativa (trasformare due punti e trovare la retta per due punti) è citata solo come controllo.

## Dimostrazioni

Fatte: la traslazione manda $AB$ in un segmento parallelo e congruente (parallelogramma $ABB'A'$, condizione 4 della 62); due simmetrie con assi paralleli danno una traslazione di $2d$ (sulla retta dei numeri perpendicolare agli assi).

Omesse o solo enunciate: che le isometrie conservano angoli, parallelismo e allineamento; il teorema sulle due simmetrie con assi incidenti (`ad-note`); che l'omotetia manda segmenti in segmenti paralleli con rapporto $|k|$ (viene da Talete e dalla similitudine, 102 e 103); che ogni isometria è composizione di simmetrie assiali (detto in una frase).

## Lasciato ad altre lezioni

- Similitudine e figure simili: alla 103, che non parla di omotetie; qui l'omotetia è presentata come esempio di similitudine.
- Simmetrici di un punto rispetto agli assi e all'origine: già nella 80, qui solo la tabella con in più la bisettrice.
- Rotazione nel piano cartesiano (per esempio di $90^\circ$: $x' = -y$, $y' = x$) e simmetria rispetto a $y = -x$: non trattate, il brief non le chiede.
- Omotetia con centro diverso dall'origine nel piano cartesiano: non trattata.
- Trasformazioni dei grafici di funzioni: sono della lezione "Trasformazioni dei grafici" del quarto anno, vuota.

## Figure

Tredici blocchi TikZ generati da `figs.py`, compilati con `compileFigure` e guardati in PNG in chiaro e con il filtro del tema scuro. Larghezza da 140 a 213 px; la più larga è `simmetria-centrale-triangolo` (213 x 146). Triangolo di partenza in azzurro, immagine in arancione in tutte le figure.

`traslazione-triangolo`, `rotazione-triangolo` (angolo di $80^\circ$, non $90^\circ$, perché l'archetto non si confonda con il segno dell'angolo retto), `simmetria-centrale-triangolo`, `simmetria-assiale-triangolo` (con le frecce circolari del verso di percorrenza, antiorario e orario), `composizione-simmetrie-assi-paralleli`, `omotetia-rapporto-2`, `omotetia-rapporto-negativo` ($k = -\frac{1}{2}$), e nel piano cartesiano `traslazione-piano-cartesiano`, `simmetrie-piano-cartesiano`, `omotetia-piano-cartesiano`, `traslazione-retta`, `simmetria-bisettrice-retta`, `omotetia-retta`.

Il formulario non copia figure.

## Formulario e flashcard

- Formulario: definizioni, tabella delle quattro isometrie, composizione, omotetia, tabella delle equazioni nel piano cartesiano, procedimento per l'immagine di una retta con l'esempio, tre avvisi. La tabella delle isometrie ha quattro colonne con testo: sul telefono scorre in orizzontale come le altre tabelle larghe.
- 18 carte, nell'ordine della lezione.

## Da cambiare nelle lezioni già scritte

- 58 (Enti geometrici), riga 120: "con un movimento rigido, cioè spostandone una (traslandola, ruotandola, ribaltandola) senza deformarla" diventa "con un movimento rigido, cioè spostandone una ([traslandola, ruotandola, ribaltandola](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche)) senza deformarla". Facoltativo.
- 80 (Il piano cartesiano), alla fine della sezione "Rispetto agli assi", dopo l'avviso "Quale coordinata cambia", si può aggiungere: "Le simmetrie come trasformazioni del piano, con la simmetria rispetto alla bisettrice $y = x$, sono nella lezione [Trasformazioni geometriche](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/trasformazioni-geometriche)."
- 44 (Composizione e funzione inversa), dove dice che il grafico di $f^{-1}$ è il simmetrico del grafico di $f$ rispetto alla bisettrice: si può linkare "simmetrico" a questa lezione. Facoltativo.
- 103: se parla di figure simili "ingrandite", può rimandare qui per l'omotetia.

## Prerequisiti

La riga della bozza, `trasformazioni-geometriche <- il-piano-cartesiano, funzioni-iniettive-suriettive-biettive, similitudine`, va cambiata: l'immagine di una retta usa l'equazione della retta (81), che ha `il-piano-cartesiano` come antenato. Proposta:

```
trasformazioni-geometriche <- equazione-di-una-retta, funzioni-iniettive-suriettive-biettive, similitudine
```

La composizione (44) è usata in un paragrafo con un link; non la metterei tra i prerequisiti. `geometria-quadrilateri` (per il parallelogramma della traslazione) arriva attraverso `similitudine`.

## Per il generatore

1. Immagine di un punto in una traslazione di vettore dato. Distrattore: vettore sottratto invece che sommato.
2. Simmetrico di un punto rispetto agli assi, all'origine, alla bisettrice $y = x$. Distrattori: coordinate scambiate per l'asse $x$ ($(-3, 2)$ invece di $(3, -2)$); per la bisettrice le coordinate scambiate e cambiate di segno.
3. Omotetia di centro l'origine: immagine di un punto o di un triangolo, rapporto tra le aree. Distrattore: area moltiplicata per $k$ invece che per $k^2$.
4. Immagine di una retta in una traslazione. Distrattore: sostituzione con il segno sbagliato ($y = 2x + 8$ invece di $y = 2x - 6$).
5. Immagine di una retta in una simmetria (assi, origine, bisettrice) o in un'omotetia di centro l'origine. Distrattore: la retta di partenza stessa, o la retta con solo il coefficiente angolare cambiato di segno.
6. Riconoscere la trasformazione dalle equazioni (per esempio $x' = -x$, $y' = y$) e i suoi punti uniti.
7. Composizioni: due simmetrie con assi paralleli (modulo $2d$, verso), due traslazioni, simmetria centrale come composizione di due simmetrie con assi perpendicolari.

Vogliono una figura i livelli 4, 5 e 7.

## Domande per Andrea

- Notazione delle trasformazioni: $t$ generico e $s_a$ per la simmetria assiale, oppure i simboli del vostro libro ($\tau$, $\sigma$, $\mathcal{R}$, $\omega$)?
- Isometrie "dirette e inverse" o "dirette e invertenti"?
- L'immagine di una retta con la sostituzione delle coordinate (metodo qui) o trasformando due punti?
- Aggiungiamo la rotazione di $90^\circ$ attorno all'origine e la simmetria rispetto a $y = -x$ nel piano cartesiano?
- La lezione ha cinque esempi, tutti nel piano cartesiano: volete anche esercizi sintetici svolti (per esempio trovare il centro di una simmetria centrale o l'asse di una simmetria assiale da un punto e la sua immagine)?
