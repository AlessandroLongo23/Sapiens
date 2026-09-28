# Note: Teoremi di Pitagora e di Euclide

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `verifica.py` (scratchpad `lotto10/100/`), 68 controlli: i due teoremi di Euclide e Pitagora in forma simbolica (con $C = (p, h)$ e $h^2 = p(c - p)$), ogni radice degli esempi, le terne della tabella e dei multipli, $\sqrt{13} \approx 3{,}61$, $\sqrt{194} \approx 13{,}9$, $5\sqrt{2} \approx 7{,}07$, $3\sqrt{3} \approx 5{,}20$, $9\sqrt{3} \approx 15{,}59$, $5\sqrt{3} \approx 8{,}66$, $8\sqrt{5} \approx 17{,}89$, la razionalizzazione $\frac{8}{\sqrt{2}} = 4\sqrt{2}$, le formule del triangolo equilatero e dei triangoli $45^\circ$ e $30^\circ$-$60^\circ$. Lo stesso script esegue `figs.py`, che controlla le 15 figure (44 controlli): angoli retti in $C$ e in $H$, misure dei lati uguali ai numeri scritti, quadrati costruiti dalla parte esterna del triangolo, e nella dimostrazione del primo teorema di Euclide che $L$ stia sulla retta $FA$ e sulla retta $DE$, che $AL = AB$, che $ACGL$ sia un parallelogramma con $G$ sulla retta $CH$, che i triangoli $ALE$ e $ABC$ siano congruenti e che quadrato, parallelogramma e rettangolo abbiano la stessa area. Il controllo `check.mts` passa sui tre file senza errori; gli unici avvisi sono i titoli con i nomi propri ("Primo teorema di Euclide", "Teorema di Pitagora"), che il controllo scambia per maiuscole all'inglese. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 229 px.

## Struttura ed esempi

Nomi nel triangolo rettangolo (cateti, ipotenusa, proiezioni, altezza), primo teorema di Euclide in forma geometrica con dimostrazione e in forma di misure, Pitagora come conseguenza (in figura e con le misure), formule inverse, inverso di Pitagora con dimostrazione, terne pitagoriche, secondo teorema di Euclide, diagonale del quadrato, altezza e area del triangolo equilatero, triangoli con gli angoli di $45^\circ$ e di $30^\circ$ e $60^\circ$, problemi con i quadrilateri. La distanza tra due punti è solo un rimando alla 80.

Otto esempi svolti:

1. primo teorema di Euclide: ipotenusa $25$ e proiezione $9$, cateti $15$ e $20$;
2. Pitagora: ipotenusa da $8$ e $6$, cateto da $13$ e $5$, più $\sqrt{13}$ e $4\sqrt{2}$ nel testo;
3. secondo teorema di Euclide sullo stesso triangolo, $\overline{CH} = 12$, con il controllo dall'area (link alla 98);
4. triangolo $30^\circ$, $60^\circ$, $90^\circ$ con ipotenusa $10$;
5. rettangolo con base $24$ e diagonale $25$;
6. rombo con diagonali $16$ e $12$: lato, perimetro, area, altezza $9{,}6$;
7. trapezio isoscele $22$, $10$, lati $10$: altezza $8$, area $128$, diagonale $8\sqrt{5}$;
8. trapezio rettangolo $15$, $9$, altezza $8$: lato obliquo $10$, perimetro $42$.

Diagonale del quadrato ($\ell = 5$ e $d = 8$) ed equilatero ($\ell = 6$) sono nel testo delle loro sezioni. Avvisi: la proiezione giusta, la radice di una somma, per il cateto si sottrae, il cateto opposto all'angolo di $30^\circ$, il lato obliquo non è l'altezza. Un `ad-tip` per riconoscere le terne.

## Scelte di convenzione (da verificare con il libro in uso)

- Triangolo $ABC$ rettangolo in $C$, ipotenusa $AB$ in basso, altezza $CH$, proiezioni $AH$ e $HB$. È la convenzione della 103 (scritta in parallelo) e della 61 ("se l'angolo retto è in $C$"). Molti libri mettono l'angolo retto in $A$, con l'ipotenusa $BC$.
- Misure dei lati $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$ (minuscola del vertice opposto) e Pitagora come $c^2 = a^2 + b^2$. Alcuni libri italiani scrivono $i^2 = c_1^2 + c_2^2$. I teoremi di Euclide sono scritti con i segmenti ($\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH}$), con `\,` dopo il soprassegno come nella 80.
- "Proiezione del cateto sull'ipotenusa", con la parola "ombre" tra virgolette una volta sola.
- Terna pitagorica: numeri naturali diversi da zero. Non ho distinto le terne primitive.
- I radicali si danno esatti e, dove serve, con l'approssimazione a due decimali ($\approx 7{,}07$).

## Dimostrazioni

Fatte: primo teorema di Euclide, con la costruzione classica (quadrato, parallelogramma $ACGL$, rettangolo $AHKF$) in sei passi e due figure; teorema di Pitagora dal primo di Euclide, sia con i rettangoli nel quadrato dell'ipotenusa sia con le misure; inverso di Pitagora (triangolo rettangolo costruito con gli stessi cateti e terzo criterio); secondo teorema di Euclide con le misure (Pitagora sul triangolo $AHC$ e primo di Euclide); $d = \ell\sqrt{2}$ e $h = \frac{\ell\sqrt{3}}{2}$.

Omesse: il secondo teorema di Euclide in forma geometrica (solo enunciato e figura, la dimostrazione è con le misure); le dimostrazioni con la similitudine, che fa la 103; l'inverso dei teoremi di Euclide.

## Lasciato ad altre lezioni

- Distanza tra due punti nel piano cartesiano: link alla 80, che la ricava già con Pitagora.
- Teoremi di Euclide con la similitudine: alla 103, che linka questa lezione.
- Seno, coseno e tangente nei triangoli $30^\circ$-$60^\circ$ e $45^\circ$: alla 101.
- Acutangolo o ottusangolo dal confronto $c^2 \gtrless a^2 + b^2$: non trattato; si può aggiungere come `ad-note` dopo l'inverso.
- Formula per generare le terne ($m^2 - n^2$, $2mn$, $m^2 + n^2$): non trattata.

## Figure

Quindici blocchi TikZ generati da `figs.py`, compilati con `compileFigure` e guardati in PNG in chiaro e con il filtro del tema scuro. Larghezza da 101 a 254 px; la più larga è `pitagora-inverso` (254 x 124). Le due figure della dimostrazione del primo teorema di Euclide (`euclide-quadrato-parallelogramma`, `euclide-parallelogramma-rettangolo`) sono alte 331 px, larghe 217: la costruzione è verticale per natura (il rettangolo sotto l'ipotenusa, il parallelogramma sopra il cateto), e sul telefono occupano mezza schermata. Usano il triangolo $3$, $4$, $5$ con il quadrato sul cateto più corto, per tenerle basse.

Le altre: `triangolo-rettangolo-proiezioni`, `pitagora-quadrati` (quadrati sui tre lati, i due rettangoli del quadrato sull'ipotenusa con gli stessi colori dei quadrati sui cateti), `euclide-secondo-teorema` (quadrato di lato $CH$ e rettangolo $HB \times AH$ disegnati sotto l'ipotenusa, con i trattini, per non sovrapporli al triangolo), `pitagora-inverso`, `diagonale-quadrato`, `altezza-triangolo-equilatero`, `triangoli-45-e-30-60`, `euclide-esempio-numeri`, `rettangolo-diagonale-esempio`, `rombo-diagonali-lato`, `trapezio-isoscele-pitagora`, `trapezio-rettangolo-pitagora`, `pitagora-esempi-ipotenusa-cateto`.

Il formulario non copia figure.

## Formulario e flashcard

- Formulario: nomi, primo di Euclide, Pitagora con le formule inverse, inverso e terne, secondo di Euclide, tabella delle figure particolari, procedimento per i problemi, tre avvisi.
- 18 carte, nell'ordine della lezione. I conti delle carte che non sono negli esempi ($5$-$12$-$13$, $9$-$12$-$15$, $10$ e $6$, $2$-$3$-$4$, proiezioni $4$ e $9$, diagonale del quadrato di lato $3$, equilatero di lato $4$, ipotenusa $12$ con $30^\circ$, ipotenusa $20$ e proiezione $5$) sono nello script.

## Da cambiare nelle lezioni già scritte

- 80 (Il piano cartesiano), sezione "Segmenti obliqui": "Per il teorema di Pitagora" diventa "Per il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide)".
- 80, sezione "Triangoli e quadrilateri con le coordinate": "(vale l'inverso del teorema di Pitagora)" diventa "(vale l'[inverso del teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide))".
- 71 (Numeri irrazionali), riga 7: "e per il teorema di Pitagora" diventa "e per il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide)".
- 79 (Problemi di secondo grado), esempio 6: "Per il teorema di Pitagora la somma dei quadrati dei cateti è il quadrato dell'ipotenusa" diventa "Per il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide) la somma dei quadrati dei cateti è il quadrato dell'ipotenusa".
- 85 e 93 citano il teorema senza link: stesso cambio, facoltativo.
- 96 e 103 linkano già questa lezione; 97 usa Pitagora (riga 91 e l'esempio 5 sull'apotema dell'esagono) senza link.

## Prerequisiti

La riga della bozza va bene:

```
teorema-di-pitagora <- equivalenza-aree, radicali-operazioni
```

La razionalizzazione (74) serve solo per $\frac{8}{\sqrt{2}}$ nella diagonale del quadrato, con un link: non è un prerequisito. I criteri di congruenza e i quadrilateri arrivano attraverso `equivalenza-aree`.

## Per il generatore

1. Pitagora, ipotenusa dai cateti, con terne intere ($6$, $8$). Distrattore: somma dei cateti ($14$).
2. Pitagora, cateto da ipotenusa e cateto. Distrattore: $\sqrt{c^2 + b^2}$ ($\approx 13{,}9$ con $13$ e $5$).
3. Risultati irrazionali da semplificare ($\sqrt{32} = 4\sqrt{2}$, $\sqrt{320} = 8\sqrt{5}$). Distrattore: radicale non semplificato o semplificato male ($2\sqrt{8}$).
4. Inverso: il triangolo di lati dati è rettangolo? Distrattore: controllo con il lato sbagliato come ipotenusa.
5. Primo e secondo teorema di Euclide: cateti, proiezioni e altezza da due dati. Distrattore: cateto con la proiezione dell'altro ($20$ invece di $15$).
6. Diagonale del quadrato, altezza e area del triangolo equilatero, triangoli $45^\circ$ e $30^\circ$-$60^\circ$. Distrattore: cateto opposto a $30^\circ$ uguale a $\frac{\ell\sqrt{3}}{2}$.
7. Problemi con rettangolo, rombo, trapezio isoscele e rettangolo. Distrattori: lato obliquo al posto dell'altezza nell'area ($160$ invece di $128$); nel trapezio isoscele la differenza delle basi non divisa per $2$.

Vogliono una figura i livelli 5 e 7, e il 6 per i triangoli $30^\circ$-$60^\circ$.

## Domande per Andrea

- Angolo retto in $C$ (qui e nella 103) o in $A$, come in molti libri?
- $c^2 = a^2 + b^2$ o $i^2 = c_1^2 + c_2^2$? E i teoremi di Euclide con i segmenti ($\overline{AC}^{\,2} = \overline{AB} \cdot \overline{AH}$) o con lettere ($c_1^2 = i \cdot p_1$)?
- La dimostrazione del primo teorema di Euclide con il parallelogramma è quella dei libri che ho in mente, ma è lunga: la tenete completa o preferite enunciato, figura e la sola dimostrazione con la similitudine della 103?
- Il secondo teorema di Euclide si dimostra con le misure (da Pitagora e dal primo): va bene o volete la dimostrazione geometrica?
- Serve la classificazione acutangolo/ottusangolo con $c^2 \gtrless a^2 + b^2$?
