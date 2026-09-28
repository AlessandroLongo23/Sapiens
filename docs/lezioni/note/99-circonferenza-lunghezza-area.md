# Note: Lunghezza della circonferenza e area del cerchio

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `lotto10/96/verifica.py` nello scratchpad: la tabella dei perimetri ($n \sin\frac{180^\circ}{n}$ e $n \tan\frac{180^\circ}{n}$ per $n = 6, 12, 24, 48, 96$, con il controllo che i valori scritti, arrotondati per difetto a sinistra e per eccesso a destra, lasciano $\pi$ in mezzo), le stime di Archimede $3 + \frac{10}{71}$ e $3 + \frac{1}{7}$, i giri della ruota (circa $455$ sia con $\pi$ sia con $3{,}14$), tutte le circonferenze, aree, archi e settori degli esempi con la formula generale, le formule inverse con `solve`, $\frac{\pi r^2 \alpha}{360^\circ} = \frac{\ell r}{2}$ in generale, la corona, i due segmenti circolari ($9\pi - 18 \approx 10{,}26$ con $3{,}14$; $6\pi - 9\sqrt{3} \approx 3{,}26$ con la calcolatrice), il quadrato con il cerchio inscritto ($64 - 16\pi \approx 13{,}76$ con $3{,}14$). Le approssimazioni sono dichiarate: dove il testo dice "con $\pi \approx 3{,}14$" il conto è fatto con $3{,}14$; l'esempio 8 usa la calcolatrice e lo dice. Le figure sono generate da `lotto10/99/figs.py`, che controlla: la circonferenza srotolata lunga $\pi d$ e compresa tra $3d$ e $4d$; i due esagoni (vertici sulla circonferenza, lati tangenti, rapporti $3$ e $2\sqrt{3}$); apotema del poligono di $12$ lati perpendicolare al lato; la base dei settori riordinati entro il $2\%$ da $\pi r$; l'angolo retto del segmento di $90^\circ$; il triangolo equilatero e l'altezza $3\sqrt{3}$ del segmento di $60^\circ$; il cerchio tangente ai lati del quadrato (15 controlli, tutti passati). Il controllo `check.mts` passa sui tre file. Le formule in evidenza sono larghe al massimo 259 px (quattro formule oltre 260 px sono state spezzate su due righe).

## Struttura ed esempi

$\pi$ come rapporto (con la figura della circonferenza srotolata), irrazionale (link alla 71), stimato con i poligoni inscritti e circoscritti (link alla 97), tabella fino a $96$ lati e Archimede. Poi $C = 2\pi r$, $A = \pi r^2$ con l'idea dei poligoni (link alla 98 per l'area del poligono regolare) e con i settori riordinati, arco e settore per proporzione con l'angolo in gradi, corona, segmento circolare solo con $90^\circ$ e $60^\circ$, figure composte.

Nove esempi svolti:

1. circonferenza dal raggio, raggio dalla circonferenza esatta ($18\pi$) e approssimata ($62{,}8$ con $3{,}14$);
2. giri di una ruota di $70$ cm in $1$ km;
3. aree: dal raggio, dal diametro, raggio dall'area, area dalla circonferenza;
4. archi: $60^\circ$, $120^\circ$, e l'angolo dall'arco;
5. settori: $60^\circ$ con le due formule, $72^\circ$, e l'angolo dall'area;
6. corona con raggi $5$ e $3$;
7. segmento circolare di $90^\circ$;
8. segmento circolare di $60^\circ$;
9. quadrato con il cerchio inscritto.

Avvisi: diametro al posto del raggio nella circonferenza, quadrato del raggio (e diametro al posto del raggio nell'area), arco e corda, settore con la formula dell'arco, $\pi (R - r)^2$, arrotondare troppo presto; in fondo quello generico sulle unità di misura. Un `ad-tip` su raggio doppio e area quadrupla.

## Scelte di convenzione (da verificare con il libro in uso)

- $C$ per la lunghezza della circonferenza e $A$ per l'area, $d$ per il diametro, $\ell$ per la lunghezza dell'arco (come la $\ell$ del lato nella 98), $\alpha$ per l'angolo al centro in gradi. Pedici in parole: $A_{\text{settore}}$, $A_{\text{corona}}$, $A_{\text{segmento}}$, $A_{\text{triangolo}}$. Alcuni libri scrivono $2p$ o $L$ per la circonferenza e $S$ per l'area.
- Proporzioni scritte con i due punti, $\ell : 2\pi r = \alpha : 360^\circ$, come la 26.
- Unità di area come la 98, $16\pi\ \text{cm}^2$; lunghezze come le lezioni del primo anno, "$10\pi$ cm". Dentro le formule in evidenza, $\text{ cm}$.
- Risultato esatto sempre con $\pi$; l'approssimazione con $\pi \approx 3{,}14$ solo dopo, come chiede il brief. $\frac{22}{7}$ citato solo come approssimazione storica.
- Radianti non trattati: gli angoli sono in gradi.
- "Pi greco" come nome, in tondo e senza grassetto (non è un termine definito nel senso delle altre lezioni). L'unico grassetto è "corona circolare": settore e segmento circolare sono definiti nella 96.

## Dimostrazioni

Nessuna formale, come chiede il brief. $C = 2\pi r$ viene dalla definizione di $\pi$; che il rapporto sia lo stesso per tutte le circonferenze è detto, non dimostrato (servirebbe la similitudine, 103, che non ho linkato per non mandare avanti lo studente). $A = \pi r^2$ è motivata due volte: con i poligoni regolari inscritti (perimetro per apotema diviso $2$, con perimetro e apotema che si avvicinano a $2\pi r$ e $r$) e con i settori riordinati. Il triangolo di $60^\circ$ equilatero è ragionato in prosa.

## Lasciato ad altre lezioni

- Nomi di arco, settore, segmento circolare: link alla 96.
- Area del poligono regolare: link alla 98. Poligoni inscritti e circoscritti: link alla 97.
- Altezza del triangolo equilatero $\frac{\sqrt{3}}{2}\ell$: detta con il link alla 100 e usata nell'esempio 8.
- Irrazionalità di $\pi$ (Lambert, 1761): è nella 71, qui solo il link.
- Radianti e lunghezza dell'arco $\ell = \alpha r$: terzo anno, nessun link (le pagine sono vuote).
- Segmenti circolari con angoli diversi da $90^\circ$ e $60^\circ$ (servono le funzioni goniometriche): non trattati.

## Figure

Dieci blocchi TikZ, generati da `figs.py`, compilati con `compileFigure` e guardati in chiaro e in scuro. Larghezza da 95 a 234 px (la più larga è `cerchio-settori-riordinati`), altezza da 87 a 137 px. Corona e zone agli angoli del quadrato colorate con `even odd rule`, settori e segmenti con percorsi `arc` esatti: niente `\clip`, niente riempimenti bianchi. Nei settori riordinati gli spicchi in su e in giù hanno il lato in comune (l'apice di uno è l'estremo dell'arco dell'altro), e la base della figura è $12 r \sin 15^\circ \approx 3{,}106\,r$, a circa l'$1\%$ da $\pi r$. Nel tema scuro l'arancione dei settori riordinati diventa marrone scuro: si legge, ma se si vuole più contrasto va schiarito.

`circonferenza-srotolata-tre-diametri`, `esagoni-inscritto-circoscritto`, `cerchio-poligono-regolare-inscritto`, `cerchio-settori-riordinati`, `arco-angolo-al-centro`, `settore-circolare-angolo`, `corona-circolare`, `segmento-circolare-angolo-retto`, `segmento-circolare-angolo-60`, `quadrato-cerchio-inscritto-angoli`.

Il formulario copia `settore-circolare-angolo`.

## Formulario e flashcard

- Formulario: $\pi$ e la regola sulle approssimazioni, $C$ e $A$ con gli esempi inversi, arco e settore con l'esempio di $60^\circ$, corona, segmento circolare nei due casi, tre avvisi.
- 18 carte, nell'ordine della lezione.

## Da cambiare nelle lezioni già scritte

- 71 (Numeri irrazionali e numeri reali): "Il numero irrazionale più famoso è $\pi = 3{,}14159265\ldots$, il rapporto tra la lunghezza di una circonferenza e il suo diametro, che incontri in geometria." diventa "Il numero irrazionale più famoso è $\pi = 3{,}14159265\ldots$, il rapporto tra la lunghezza di una circonferenza e il suo diametro, che incontri nella lezione [Lunghezza della circonferenza e area del cerchio](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio)."
- 96 (Circonferenza e cerchio) linka già questa lezione per le aree di settore e segmento: niente da cambiare.

## Prerequisiti

La riga della bozza va bene così:

```
circonferenza-lunghezza-area <- poligoni-inscritti, equivalenza-aree, numeri-reali-irrazionali
```

Nessuna delle tre è antenata delle altre con le righe proposte (la 97 non passa per la 98, la 98 non passa per la 97, e la 71 non è antenata di nessuna delle due). L'esempio 8 usa anche $\sqrt{3}$ e l'altezza del triangolo equilatero della 100, ma è un solo esempio e non ne farei un arco.

## Per il generatore

1. Circonferenza e area dal raggio o dal diametro, risultato con $\pi$. Distrattori: $2\pi d$; $\pi d^2$; $2\pi r$ come area.
2. Raggio dalla circonferenza o dall'area data con $\pi$ ($18\pi$, $49\pi$). Distrattori: $r = 18$; $r = 49$.
3. Le stesse con $\pi \approx 3{,}14$ (dati come $62{,}8$ o $314$), risultato intero. Distrattore: il diametro al posto del raggio.
4. Area dalla circonferenza. Distrattore: $C^2$ senza passare dal raggio.
5. Arco dal raggio e dall'angolo (angoli divisori di $360^\circ$), e angolo dall'arco. Distrattori: la formula del settore; $\frac{\pi r \alpha}{360^\circ}$ senza il $2$.
6. Settore dal raggio e dall'angolo, e angolo dal settore. Distrattore: la formula dell'arco.
7. Corona da $R$ e $r$. Distrattore: $\pi (R - r)^2$.
8. Segmento circolare di $90^\circ$ (e di $60^\circ$ con $\sqrt{3}$). Distrattori: solo il settore; settore più triangolo.
9. Figure composte: quadrato con cerchio inscritto, quadrato con quattro quarti di cerchio, semicerchio su un lato di un rettangolo. Distrattore: il raggio uguale al lato.

I livelli 5, 6, 7, 8 e 9 vorrebbero una figura.

## Domande per Andrea

- Lettere per la circonferenza e l'area: $C$ e $A$, o $2p$ e $S$ come in alcuni libri?
- $\pi \approx 3{,}14$ come approssimazione standard, con i risultati esatti sempre prima: è l'uso della vostra classe, o si lavora direttamente con $3{,}14$?
- La tabella dei poligoni fino a $96$ lati e Archimede: utile o troppo per il secondo anno?
- Il segmento circolare di $60^\circ$ usa l'altezza del triangolo equilatero, che è della 100: va bene come anticipazione con il link, o l'esempio 8 va spostato nella 100?
- La formula $A_{\text{settore}} = \frac{\ell \cdot r}{2}$ è nei libri che usate, o basta la proporzione?
