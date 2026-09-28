# Note: Similitudine

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono rifatti con SymPy in `lotto10/103/verifica.py` nello scratchpad (28 controlli: i rapporti dei rettangoli e dei criteri, i terzi angoli dell'esempio 2, le proporzioni risolte con `solve`, i lati dell'esempio 5, il trapezio dell'esempio 6 rifatto in coordinate esatte con $A(0, 0)$, $B(12, 0)$, $C(9, 12)$, $D(1, 12)$, dove $\overline{AC} = 15$, $\overline{AO} = 9$, $\overline{OC} = 6$ e $BD$ è diviso nel rapporto $3 : 2$; la formula dell'area con $k$ simbolico; i radicali $\sqrt{52} = 2\sqrt{13}$ e $\sqrt{117} = 3\sqrt{13}$ con le approssimazioni $7{,}21$ e $10{,}82$; l'angolo retto in $C$ con $C(4, 6)$; la mappa, con $24 \cdot 25\,000^2 = 1{,}5 \cdot 10^{10}$ cm$^2$). Le figure sono generate da `lotto10/103/figs103.py`, che controlla 46 proprietà: nelle coppie di poligoni simili i lati sono davvero in proporzione (con il $k$ del testo) e gli angoli congruenti, il rettangolo $7 \times 5$ non è simile al $6 \times 4$, nella dimostrazione del primo criterio $AD = A'B'$, $DE \parallel BC$, $EF \parallel AB$, $DE = BF$ e $ADE$ è congruente ad $A'B'C'$, gli angoli di $50^\circ$, $60^\circ$, $70^\circ$ sono quelli scritti, nel triangolo girato $\overline{EF} = 9$, $\overline{FD} = 12$, $\overline{DE} = 7{,}5$, gli archetti del triangolo rettangolo stanno su angoli congruenti, i raggi del sole sono paralleli. Il controllo `check.mts` passa sui tre file (resta l'avviso sul titolo con "Euclide", nome proprio). Le formule in evidenza sono larghe al massimo 258 px (l'esempio 8).

## Struttura ed esempi

Poligoni simili, lati omologhi, rapporto $k$; avviso "servono entrambe le condizioni" con la figura di quadrato, rombo e rettangolo; poligoni regolari. Criteri: primo (dimostrato), secondo (dimostrazione breve in un `ad-note`), terzo (solo enunciato); come riconoscere i lati omologhi. Perimetri, altezze, aree. Teoremi di Euclide con la similitudine. Misure indirette.

Dieci esempi svolti:

1. rettangoli $6 \times 4$, $9 \times 6$ (simile, $k = 1{,}5$) e $7 \times 5$ (no);
2. due angoli: $50^\circ, 70^\circ$ e $60^\circ, 70^\circ$, con la corrispondenza dei vertici;
3. parallela a un lato: $\overline{DE} = 6$, con il controllo che usare $DB$ darebbe $18$ (lo stesso errore dell'avviso della 102);
4. secondo criterio con un angolo di $40^\circ$: sì con $10, 6$, no con $9, 6$;
5. triangolo girato e ribaltato: lati omologhi dagli angoli, $\overline{FD} = 12$, $\overline{DE} = 7{,}5$;
6. diagonali del trapezio: $\overline{AO} = 9$, $\overline{OC} = 6$;
7. perimetro e area con $k = 3$, e $k$ dalle aree ($50$ e $18$ danno $\frac{5}{3}$);
8. Euclide: dalle proiezioni $4$ e $9$ all'altezza $6$ e ai cateti $2\sqrt{13}$, $3\sqrt{13}$;
9. altezza di un albero con l'ombra: $7{,}5$ m;
10. mappa in scala $1 : 25\,000$: lati e area, anche con $k^2$.

Avvisi: servono angoli e lati; i lati omologhi non si scelgono dal disegno; lati doppi, area quadrupla.

## Scelte di convenzione (da verificare con il libro in uso)

- Simbolo $\sim$ per la similitudine, con i vertici corrispondenti nello stesso ordine ($\triangle ABC \sim \triangle EFD$), come $\cong$ nella 59.
- Rapporto di similitudine $k$ preso come "secondo poligono diviso primo", $\frac{A'B'}{AB}$. Alcuni libri non fissano il verso.
- Lati "omologhi", non "corrispondenti", dopo la definizione.
- Misure con il soprassegno come nella 100 e nella 102; proporzioni tra segmenti senza. Vedi le note della 102 sulla differenza con 58 e 62.
- Perimetro $2p$ (uso scolastico italiano); area $\mathcal{A}$ in corsivo calligrafico, perché in questa lezione $A$ e $A'$ sono vertici. La 98 scrive $A$ per l'area: se si preferisce uniformare, in questa lezione ci sono tre formule da cambiare.
- Triangolo rettangolo in $C$, altezza $CH$, proiezioni $AH$ e $HB$, come la 100.
- I criteri si chiamano "primo, secondo, terzo criterio di similitudine", nell'ordine AA, LAL, LLL. Alcuni libri li numerano in un altro ordine: da verificare.

## Dimostrazioni

Fatta per intero, con ipotesi, tesi e passi numerati: primo criterio, dal teorema di Talete nel triangolo (link alla 102) e dal secondo criterio di congruenza, con la costruzione di $D$, $E$ ed $F$ e il parallelogramma $DBFE$. In prosa: secondo criterio (riquadro `ad-note`, con la stessa costruzione e il primo criterio di congruenza), rapporto delle altezze, rapporto delle aree per i triangoli, le tre similitudini nel triangolo rettangolo e i due teoremi di Euclide, Pitagora come somma. Omessa: il terzo criterio (detta la strada) e il rapporto delle aree per i poligoni qualsiasi (detto che si dividono in triangoli).

## Lasciato ad altre lezioni

- Teorema di Talete e Talete nel triangolo: link alla 102.
- Area del triangolo: link alla 98. Euclide in forma di equivalenza, Pitagora e terne: link alla 100. Semplificazione dei radicali: link alla 73.
- Omotetia: alla 104, non citata qui.
- Seno, coseno e tangente: alla 101, che usa questa lezione per dire che i rapporti dipendono solo dall'angolo.
- Mediane e bisettrici corrispondenti nel rapporto $k$: non dette, solo le altezze.

## Figure

Diciassette blocchi TikZ, compilati con `compileFigure` e guardati in PNG in chiaro e con il filtro del tema scuro. Larghezza da 172 a 299 px: la più larga è `similitudine-lati-omologhi` (il secondo triangolo è girato di $200^\circ$ e ribaltato, e occupa più spazio); altezza da 68 a 176 px. Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`.

- Teoria: `poligoni-simili-rapporto`, `quadrato-rombo-rettangolo-non-simili` (nell'avviso), `primo-criterio-similitudine`, `primo-criterio-similitudine-dimostrazione`, `secondo-criterio-similitudine`, `terzo-criterio-similitudine`, `similitudine-altezze-corrispondenti`, `similitudine-rapporto-aree` (triangoli divisi in $1$, $4$, $9$ copie), `similitudine-euclide-triangolo-rettangolo`.
- Esempi: `rettangoli-simili-esempio`, `similitudine-esempio-due-angoli`, `similitudine-parallela-lato-esempio`, `similitudine-esempio-angolo-e-lati` (tre triangoli su due righe), `similitudine-lati-omologhi`, `similitudine-trapezio-diagonali`, `euclide-esempio-proiezioni`, `similitudine-altezza-con-ombra`.

Gli esempi 7 e 10 non hanno una figura: sono conti sui numeri, e la figura delle aree copre l'idea. Nelle coppie di triangoli affiancati le etichette $C$ del primo e $B'$ del secondo sono vicine ma non si toccano.

Il formulario copia `similitudine-euclide-triangolo-rettangolo`; la riga `% svg:` va allineata dopo la pubblicazione, come per la 102.

## Formulario e flashcard

- Formulario: definizione e $k$, tabella dei tre criteri, lati omologhi, parallela, trapezio, rapporti di perimetri, altezze e aree con un esempio, Euclide con la figura, ombra, tre avvisi.
- 19 carte; i conti vengono dagli esempi 1, 2, 3, 7, 8, 9.

## Da cambiare nelle lezioni già scritte

- 100 (Teoremi di Pitagora e di Euclide), che è dello stesso lotto: dopo il secondo teorema di Euclide si può aggiungere una riga "I due teoremi di Euclide si dimostrano anche con la [similitudine](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/similitudine)". Qui le notazioni sono già le sue (rettangolo in $C$, $CH$, $AH$, $HB$).
- 61: la frase sul baricentro indicata nelle note della 102.
- Nessuna lezione pubblicata parla di figure simili: niente altro da sostituire.

## Prerequisiti

La riga della bozza, `similitudine <- teorema-di-talete`, non copre due sezioni: il rapporto delle aree usa l'area del triangolo (98) e i teoremi di Euclide rivisti presuppongono la 100 (e l'esempio 8 semplifica radicali). Propongo

```
similitudine <- teorema-di-talete, teorema-di-pitagora
```

`equivalenza-aree` e `radicali-operazioni` arrivano come antenate attraverso `teorema-di-pitagora`. Se invece si vuole che la similitudine non dipenda dalla 100, la sezione su Euclide diventa facoltativa e la riga è `similitudine <- teorema-di-talete, equivalenza-aree`.

## Per il generatore

1. Poligoni simili: dire se due rettangoli (o triangoli con i lati dati) sono simili e trovare $k$. Distrattori: differenza dei lati invece del rapporto; rapporti presi tra lati non omologhi.
2. Lato mancante con $k$ noto o da un lato omologo (esempio 5). Distrattore: lato omologo scelto dalla posizione nel disegno. Vuole la figura con un triangolo girato.
3. Primo criterio con due angoli: trovare il terzo angolo e la corrispondenza dei vertici. Distrattore: vertici accoppiati nell'ordine alfabetico.
4. Parallela a un lato: $DE$ dal lato $BC$ e dalle parti di $AB$. Distrattore: $AD : DB$ invece di $AD : AB$ (dà il valore impossibile $18$).
5. Secondo e terzo criterio: sì o no, con i rapporti. Distrattore: un rapporto su due uguale.
6. Trapezio con le diagonali: $AO$ e $OC$ dalla diagonale e dalle basi. Figura necessaria.
7. Perimetri e aree con $k$, anche all'indietro ($k$ dalle aree). Distrattori: area moltiplicata per $k$; $k$ uguale al rapporto delle aree.
8. Euclide con le misure: altezza dalle proiezioni, cateto da ipotenusa e proiezione. Distrattore: il cateto con la proiezione dell'altro cateto.
9. Ombre e scale: altezza dall'ombra, misure vere dalla mappa. Distrattore della mappa: area moltiplicata per il denominatore della scala e non per il suo quadrato.

## Domande per Andrea

- Simbolo della similitudine: $\sim$ va bene, o il suo libro usa altro?
- Ordine e nomi dei criteri: primo AA, secondo LAL, terzo LLL, come qui?
- La dimostrazione del primo criterio passa dalla congruenza di $ADE$ con $A'B'C'$ e da Talete due volte (con il parallelogramma $DBFE$). È la dimostrazione che si fa in classe, o si preferisce quella più corta che dà per noto $DE : BC = AD : AB$?
- Area indicata con $\mathcal{A}$ per non confonderla con il vertice $A$: va bene, o si usa $S$ come in alcuni libri?
- Serve una sezione sulle mediane e bisettrici corrispondenti (anche loro nel rapporto $k$)?
