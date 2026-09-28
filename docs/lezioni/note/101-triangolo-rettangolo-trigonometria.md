# Note: Seno, coseno e tangente nel triangolo rettangolo

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono rifatti con SymPy in `lotto10/101/verifica.py` nello scratchpad (32 controlli: i rapporti del triangolo $3, 4, 5$ anche con l'angolo vero $\tan^{-1}\frac{3}{4}$, compresi $\sin\beta = \cos\alpha$ e $\tan\beta = \frac{1}{\tan\alpha}$; i valori esatti per $30^\circ$, $45^\circ$, $60^\circ$ calcolati da SymPy e ricavati dai lati $\ell$, $\ell\sqrt{2}$, $\frac{\ell}{2}$, $\frac{\ell\sqrt{3}}{2}$; $\sin^2 x + \cos^2 x = 1$ simbolico; l'esempio 2 con $\sin\alpha = \frac{1}{3}$; ogni valore approssimato della calcolatrice e degli esempi arrotondato al centesimo, e al decimillesimo per $\sin 35^\circ$, $\cos 35^\circ$, $\tan 35^\circ$; la conversione $23{,}578^\circ \approx 23^\circ\,34'\,41''$; $\sin 30$ in radianti $\approx -0{,}988$; i controlli con Pitagora). Le figure sono generate da `lotto10/101/figs101.py`, che controlla 21 proprietà: gli angoli disegnati sono quelli del testo ($60^\circ$, $35^\circ$, $32^\circ$, $70^\circ$, $45^\circ$, $30^\circ$), i lati hanno le misure scritte in scala, i due triangoli rettangoli $3, 4, 5$ e $6, 8, 10$ hanno lo stesso angolo in $A$ e $B_1$ sta sull'ipotenusa $AB_2$, la rampa ha davvero la pendenza $0{,}08$. Il controllo `check.mts` passa sui tre file senza avvisi. Le formule in evidenza sono larghe al massimo 252 px.

## Struttura ed esempi

Cateto opposto e adiacente; perché i rapporti dipendono solo dall'angolo (similitudine, link alla 103); definizioni con la nota su sen e tg; complementari; valori per $30^\circ$, $45^\circ$, $60^\circ$ dai triangoli della 100, con tabella; $\sin^2\alpha + \cos^2\alpha = 1$ e $\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$ con la dimostrazione in due righe; calcolatrice in gradi e funzioni inverse; risoluzione del triangolo rettangolo con le tre regole e i quattro casi; problemi.

Nove esempi svolti:

1. seno, coseno e tangente di $\alpha$ e $\beta$ nel triangolo $3, 4, 5$;
2. da $\sin\alpha = \frac{1}{3}$ a $\cos\alpha = \frac{2\sqrt{2}}{3}$ e $\tan\alpha = \frac{\sqrt{2}}{4}$;
3. ipotenusa $8$ e angolo $60^\circ$ (valori esatti): cateti $4\sqrt{3}$ e $4$;
4. cateto $12$ e angolo $35^\circ$: $a \approx 8{,}40$, $c \approx 14{,}65$;
5. due cateti $5$ e $12$: $c = 13$, $\alpha \approx 22{,}62^\circ$;
6. ipotenusa $7$ e cateto $3$: $\alpha \approx 25{,}38^\circ$, $b = 2\sqrt{10}$;
7. altezza di un albero con l'angolo di elevazione di $32^\circ$ e gli occhi a $1{,}6$ m: $10{,}97$ m;
8. rampa con dislivello $0{,}5$ m e pendenza $8\%$: orizzontale $6{,}25$ m, $\alpha \approx 4{,}57^\circ$, rampa $6{,}27$ m;
9. scala di $5$ m a $70^\circ$: $4{,}70$ m e $1{,}71$ m.

Avvisi: opposto e adiacente dipendono dall'angolo; il quadrato del seno ($\sin\alpha + \cos\alpha \neq 1$); calcolatrice in radianti; $\sin^{-1}$ non è $\frac{1}{\sin}$; con due angoli non si risolve; la pendenza non è l'angolo.

## Scelte di convenzione (da verificare con il libro in uso)

- $\sin$, $\cos$, $\tan$ come sulla calcolatrice, con un `ad-note` che dice che molti libri italiani scrivono $\text{sen}$ e $\text{tg}$. È la scelta del brief; da confermare con Andrea.
- Triangolo $ABC$ rettangolo in $C$, con $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$ e gli angoli $\alpha$ in $A$, $\beta$ in $B$: è la notazione della 100 (rettangolo in $C$, misure con la minuscola del vertice opposto). Molti libri di trigonometria del terzo anno mettono l'angolo retto in $A$ e chiamano $a$ l'ipotenusa: con questa scelta le regole diventano $a = c \sin\alpha$ invece di $b = a \sin\beta$. Da verificare quale convenzione userà la lezione "Risoluzione dei triangoli rettangoli" del terzo anno.
- Funzioni inverse scritte $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ come sui tasti; $\arcsin$ e le altre, che sono della goniometria, non compaiono.
- Angoli e lunghezze approssimati arrotondati al centesimo (detto nel testo). I gradi, primi e secondi sono in un `ad-note`, perché alcuni libri li usano ancora.
- Pendenza definita come dislivello diviso spostamento orizzontale, cioè $\tan\alpha$, come il cartello stradale della 82.
- Seno e coseno solo per gli angoli acuti; niente circonferenza goniometrica, niente angoli di $0^\circ$ e $90^\circ$.

## Dimostrazioni

In prosa: i rapporti non dipendono dal triangolo (primo criterio di similitudine), $\sin^2\alpha + \cos^2\alpha = 1$ (Pitagora diviso $c^2$), $\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$, le relazioni tra angoli complementari, i valori esatti per $30^\circ$, $45^\circ$, $60^\circ$. Niente ipotesi e tesi: sono tutti passaggi di una o due righe.

## Lasciato ad altre lezioni

- Diagonale del quadrato, altezza del triangolo equilatero, triangoli $45^\circ$ e $30^\circ$-$60^\circ$: link alla 100, come chiede il brief. Razionalizzazione: link alla 74.
- Similitudine e primo criterio: link alla 103.
- Circonferenza goniometrica, radianti, funzioni goniometriche per angoli qualsiasi, teoremi dei seni e del coseno: anni successivi, pagine vuote, nessun link. I radianti sono solo nominati nell'avviso sulla calcolatrice.
- Il coefficiente angolare come tangente dell'angolo della retta ($m = \tan\alpha$): non detto, anche se la 82 parla di pendenza. Vedi "Da cambiare".

## La posizione nell'albero

Nell'albero la 101 viene prima di Talete (102) e della similitudine (103), ma la usa: il fatto che seno, coseno e tangente dipendano solo dall'angolo è il primo criterio di similitudine. Consiglio di spostarla dopo la 103, nell'ordine 100, 102, 103, 101 (e con lei il suo posto nel capitolo); gli URL non cambiano. Se resta dov'è, la sezione "I rapporti dipendono solo dall'angolo" linka una lezione che lo studente non ha ancora visto.

## Figure

Dodici blocchi TikZ, compilati con `compileFigure` e guardati in PNG in chiaro e con il filtro del tema scuro. Larghezza da 67 a 222 px (la più larga è `triangoli-45-e-30-60-seno-coseno`), altezza da 40 a 146 px. Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`; `\text` non funziona in TikZJax, e le parole nelle figure sono nodi di testo.

- Teoria: `triangolo-rettangolo-cateto-opposto-adiacente`, `triangoli-rettangoli-stesso-angolo`, `triangoli-45-e-30-60-seno-coseno`.
- Esempi: `seno-coseno-tangente-triangolo-3-4-5`, `seno-un-terzo-triangolo`, `risoluzione-ipotenusa-e-angolo`, `risoluzione-cateto-e-angolo`, `risoluzione-due-cateti`, `risoluzione-ipotenusa-e-cateto`, `angolo-di-elevazione-albero`, `rampa-pendenza-otto-per-cento`, `scala-appoggiata-al-muro`.

La rampa è disegnata con la sua pendenza vera ($4{,}57^\circ$): è un triangolo molto basso, alto 40 px, e la $\alpha$ tocca appena i lati. Esagerare l'angolo la renderebbe più leggibile ma contraddirebbe il testo, quindi l'ho lasciata così.

Il formulario copia `triangolo-rettangolo-cateto-opposto-adiacente`; la riga `% svg:` va allineata dopo la pubblicazione.

## Formulario e flashcard

- Formulario: definizioni con la figura, complementari, tabella dei valori, relazioni con un esempio, calcolatrice, le tre regole di risoluzione e l'esempio 3, angolo di elevazione e pendenza, tre avvisi.
- 20 carte; i conti vengono dagli esempi 1 e 2 e dalla tabella. La carta sul coseno da $\sin\alpha = \frac{3}{5}$ usa il triangolo dell'esempio 1.

## Da cambiare nelle lezioni già scritte

- 100 (Teoremi di Pitagora e di Euclide), dello stesso lotto, sezione "Metà quadrato e metà triangolo equilatero": "Chi riconosce uno di questi triangoli ricava tutti i lati da uno solo, senza il teorema di Pitagora." diventa "Chi riconosce uno di questi triangoli ricava tutti i lati da uno solo, senza il teorema di Pitagora; gli stessi triangoli danno il seno, il coseno e la tangente di $30^\circ$, $45^\circ$ e $60^\circ$, nella lezione [Seno, coseno e tangente nel triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo)."
- 82 (Il coefficiente angolare), facoltativo: in fondo alla sezione "La pendenza di una retta" un `ad-note` "Il coefficiente angolare è la tangente dell'angolo che la retta forma con l'asse $x$, quando la retta sale: lo spiega la lezione [Seno, coseno e tangente nel triangolo rettangolo](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/seno-coseno-e-tangente-nel-triangolo-rettangolo)." Va aggiunto solo se la 82 viene dopo nell'albero, o come "dove si usa".

## Prerequisiti

La riga della bozza è `triangolo-rettangolo-trigonometria <- similitudine, teorema-di-pitagora`. Se si accetta la riga proposta per la 103 (`similitudine <- teorema-di-talete, teorema-di-pitagora`), l'arco verso `teorema-di-pitagora` diventa ridondante. La lezione usa anche la razionalizzazione ($\frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$, $\frac{1}{\sqrt{3}} = \frac{\sqrt{3}}{3}$), che non è antenata né della 100 né della 103. Propongo

```
triangolo-rettangolo-trigonometria <- similitudine, radicali-razionalizzazione
```

Se la 103 resta `similitudine <- teorema-di-talete`, la riga è `triangolo-rettangolo-trigonometria <- similitudine, teorema-di-pitagora, radicali-razionalizzazione` (`radicali-razionalizzazione` e `teorema-di-pitagora` non sono una antenata dell'altra).

## Per il generatore

1. Seno, coseno o tangente di un angolo dai tre lati (terne pitagoriche). Distrattori: opposto e adiacente scambiati; il rapporto rovesciato ($\frac{c}{a}$).
2. Valori esatti per $30^\circ$, $45^\circ$, $60^\circ$ (scelta multipla). Distrattori: $\sin 30^\circ$ e $\cos 30^\circ$ scambiati; $\frac{1}{\sqrt{2}}$ e $\frac{\sqrt{2}}{2}$ presentati come diversi.
3. Da un valore agli altri due con le relazioni ($\sin\alpha = \frac{p}{q}$ con $q^2 - p^2$ quadrato perfetto, poi anche no). Distrattore: $\cos\alpha = 1 - \sin\alpha$.
4. Cateto dall'ipotenusa e da un angolo con i valori esatti. Distrattore: seno al posto del coseno.
5. Risoluzione con la calcolatrice: un cateto e un angolo, risultati al centesimo. Distrattori: il valore in radianti; $b \cdot \cos\alpha$ al posto di $\frac{b}{\cos\alpha}$ per l'ipotenusa.
6. Un angolo da due lati con la funzione inversa. Distrattori: $\frac{1}{\sin}$ al posto di $\sin^{-1}$; il complementare.
7. Problemi: angolo di elevazione (con o senza l'altezza degli occhi), rampe con la pendenza in percentuale, scale. Distrattori: pendenza presa come angolo in gradi; altezza degli occhi dimenticata.

I livelli 1, 4, 5, 6 e 7 vorrebbero la figura del triangolo con i dati; il 7 una figura per tipo di problema.

## Domande per Andrea

- $\sin$ e $\tan$ o $\text{sen}$ e $\text{tg}$? Se il suo libro usa $\text{sen}$, conviene cambiare tutta la lezione (il riquadro resta, al contrario).
- Triangolo rettangolo in $C$ (come la 100) o in $A$ con $a$ ipotenusa (come molti libri di trigonometria)?
- Arrotondamento degli angoli: al centesimo di grado come qui, al decimo, o in gradi e primi?
- Spostare la lezione dopo la similitudine (ordine 100, 102, 103, 101)?
- La pendenza stradale e l'angolo di elevazione sono i problemi giusti, o nel suo libro al secondo anno ci sono altri contesti (ombre, piani inclinati in fisica)?
