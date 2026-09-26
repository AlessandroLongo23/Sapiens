# Note: Rette perpendicolari e parallele

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: le equazioni degli esempi 3, 6 e 8 (`solve`), le ampiezze degli esempi 1, 2, 5 e 7, le somme $(n - 2) \cdot 180^\circ$ per $n = 3, 4, 5, 6, 10, 12$, l'identità $n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 360^\circ$ e i conti delle carte ($50 + 60$, $40 + 75$, $180 - 65$). Anche le figure sono state controllate con i conti: nella figura del primo teorema dell'angolo esterno gli angoli $\hat{A}$ e $\widehat{ECM}$ misurano entrambi $71{,}57^\circ$, e nella figura dell'esempio 4 il punto $P$ è stato calcolato perché gli angoli in $A$ e in $B$ siano davvero $40^\circ$ e $35^\circ$. La formula in evidenza più larga misura 189 px con KaTeX a 17 px.

Otto esempi svolti, sei dimostrazioni (primo teorema dell'angolo esterno, unicità della perpendicolare, criterio di parallelismo, teorema inverso, somma degli angoli del triangolo, secondo teorema dell'angolo esterno), tutte nel formato ipotesi, tesi, passaggi numerati con la giustificazione.

## Scelte di convenzione

- Parallele: "non hanno punti in comune oppure coincidono", così il parallelismo è una relazione di equivalenza (riquadro `ad-note` con il link alla 41). Altri libri escludono le rette coincidenti. Da verificare con il libro in uso; se si cambia, va ritoccata solo la dimostrazione della proprietà transitiva, che oggi dice "se $a$ e $c$ fossero distinte".
- Quinto postulato nella forma "per un punto passa una e una sola parallela", che è quella dei libri di oggi. La forma originale di Euclide (con i coniugati interni) è in un riquadro `ad-note`, senza altre date che "circa 300 a.C." per gli Elementi. Ho scritto che l'esistenza della parallela si dimostra e solo l'unicità è il postulato.
- Angoli degli otto angoli numerati $\hat{1}, \dots, \hat{8}$: da $1$ a $4$ nel punto su $a$, in senso antiorario a partire da quello in alto a destra, da $5$ a $8$ nella stessa posizione su $b$. I libri usano numerazioni diverse; la tabella delle coppie dipende da questa.
- Misure scritte come $\hat{1} = 65^\circ$ (uguaglianza tra misure) e congruenze come $\hat{3} \cong \hat{5}$. Nelle dimostrazioni con le somme ho usato le misure ($\hat{A} + \hat{B} + \hat{C} = 180^\circ$, $\widehat{CBD} = \hat{A} + \hat{C}$), come la maggior parte dei libri del primo anno.
- "Proiezione (ortogonale)" e "piede della perpendicolare" come sinonimi dello stesso punto; il segmento $PA$ è detto "obliquo".

## Cose prese dalla lezione sui triangoli, o che forse le appartengono

- Il primo teorema dell'angolo esterno (forma debole: l'angolo esterno è maggiore di ciascun interno non adiacente) è qui, perché servono l'unicità della perpendicolare e il criterio di parallelismo. Ha la sua sezione breve, con la dimostrazione in un riquadro `ad-note` che si può saltare. Se la 59 lo tratta già (le serve per le disuguaglianze triangolari), qui si può ridurre a un enunciato con un link, e la sezione diventa un paragrafo.
- Ho usato senza dimostrarla la proprietà "in un triangolo all'angolo maggiore sta opposto il lato maggiore" (per dire che $PH$ è il segmento più corto). È della 59: conviene che la 59 la enunci.
- Che gli angoli del triangolo equilatero siano congruenti è citato con un link alla 59, e l'esempio 5 usa gli angoli alla base congruenti del triangolo isoscele.
- L'esistenza della perpendicolare da un punto esterno è enunciata senza dimostrazione ("si dimostra con i criteri di congruenza, e in pratica la disegni con la squadra"). La dimostrazione classica (ribaltare il punto con un angolo congruente e usare il triangolo isoscele) mi sembrava troppo lunga per il telefono. Da decidere se aggiungerla in un riquadro.
- Nella dimostrazione del primo teorema dell'angolo esterno il passo "la semiretta $CE$ sta dentro l'angolo $\widehat{ACD}$" è dato per evidente, come nei libri del biennio.

## Lasciato ad altre lezioni

- La proprietà dell'asse come luogo dei punti equidistanti da $A$ e $B$: solo nominata, con il link ai punti notevoli (61), che la tratta. La costruzione con il compasso è descritta e disegnata, e il "perché" rimanda alla 61.
- La distanza tra due rette parallele non c'è: si dimostra con i parallelogrammi (62). Se la si vuole qui, basta una frase con il link alla 62.
- Il criterio di congruenza con due angoli e un lato qualsiasi (secondo criterio generalizzato) non c'è; la lezione dice solo che due triangoli con due angoli congruenti hanno congruente anche il terzo. Potrebbe andare nella 59, con un link a questa lezione per la somma degli angoli.
- Poligoni: solo la somma degli angoli interni ed esterni per i poligoni convessi, come chiede il brief ("cenno"), con un esempio sul poligono regolare.
- Le rette nello spazio (sghembe): una frase senza link, perché la lezione Rette e piani nello spazio non è scritta.

## Da togliere o controllare in lezioni già scritte

Nessuna lezione pubblicata tratta questi argomenti. Per il lotto: la 59 enuncia la somma degli angoli con un link qui (come chiede il brief); controllare che non la dimostri anche lei, e che usi la stessa notazione $\hat{A}$ e $\widehat{ABC}$ e gli stessi segni di congruenza.

## Figure

Quattordici figure TikZ, tutte con `% nome:` e `% alt:`, senza `\clip` né riempimenti bianchi, compilate con `compileFigure` di `scripts/figure/compile.mjs`: la più larga è 203 px (sotto i 280 px dei riquadri). Le ho guardate renderizzate in Chromium in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`), non sul sito. Angoli colorati con tinte chiare (`blue!25`, `orange!30`, `green!25`), rette in nero e trasversali in `blue!70!black` come nella 45; segni dell'angolo retto con il quadratino, segmenti congruenti con uno o due trattini.

- `rette-perpendicolari`: disegnate inclinate apposta, per l'avviso "perpendicolare non vuol dire verticale".
- `angolo-esterno-primo-teorema` (nel riquadro della dimostrazione), `perpendicolare-unica-assurdo` (con un punto interrogativo sull'angolo in $K$, perché un secondo angolo retto non si può disegnare), `proiezione-distanza-punto-retta`, `asse-di-un-segmento` (con gli archi di compasso), `parallela-per-un-punto`.
- `trasversale-otto-angoli` (copiata anche nel formulario, perché la tabella delle coppie usa la sua numerazione), `criterio-parallelismo-assurdo`, `parallele-teorema-inverso`, `otto-angoli-esempio-65`, `angolo-tra-due-parallele`.
- `somma-angoli-interni-triangolo` (gli angoli dello stesso colore sono congruenti), `angolo-esterno-secondo-teorema`, `poligono-diviso-in-triangoli`.

## Formulario e flashcard

- Il formulario ha la figura degli otto angoli e tre avvisi (coniugati congruenti, angolo esterno con l'angolo sbagliato, $n$ al posto di $n - 2$). La riga "gli otto angoli hanno due ampiezze, $\alpha$ e $180^\circ - \alpha$" usa $\alpha$, che la lezione non usa: la lezione dice la stessa cosa a parole nel riquadro "Solo due ampiezze".
- 20 carte. Le carte `terzo-angolo-conto` ($50^\circ$ e $60^\circ$) e `angolo-esterno-secondo-teorema` ($40^\circ$ e $75^\circ$) hanno numeri che non sono nella lezione; le regole sì.

## Prerequisiti

La riga `geometria-perpendicolari-parallele <- angoli-e-lati-dei-triangoli` va bene così. La lezione usa i criteri di congruenza (primo teorema dell'angolo esterno), il triangolo isoscele e la relazione tra lati e angoli, tutti della 59; enti, angoli adiacenti e opposti al vertice arrivano dalla 58 attraverso la 59. Gli esempi 3, 6 e 8 risolvono equazioni di primo grado da due o tre righe, e il riquadro sulle rette coincidenti cita le relazioni di equivalenza: non aggiungerei archi, perché le equazioni sono elementari e il riquadro si può saltare (è lo stesso ragionamento dei "Dubbi da sciogliere" su Dominio, codominio e immagine). Se il ripasso dopo una prova deve proporre le equazioni a chi sbaglia gli esercizi con l'incognita (livello 4 sotto), allora conviene l'arco `equazioni-primo-grado`.

## Per il generatore

1. Nomi delle coppie: data la figura degli otto angoli con la numerazione della lezione, dire come si chiama una coppia ($\hat{4}$ e $\hat{6}$: alterni interni) o trovare l'angolo che forma con uno dato una coppia di un certo tipo.
2. Gli otto angoli con due parallele: dato un angolo ($\hat{1} = 65^\circ$), trovare l'ampiezza di un altro angolo indicato ($\hat{8} = 115^\circ$), con la giustificazione a scelta multipla.
3. Parallele o no: date le ampiezze di due angoli e la loro posizione, stabilire se le rette sono parallele ($\hat{4} = 108^\circ$, $\hat{5} = 72^\circ$: sì; $\hat{4} = 108^\circ$, $\hat{6} = 74^\circ$: no).
4. Ampiezze con un'equazione: alterni o corrispondenti con espressioni in $x$ da uguagliare ($3x + 10 = 5x - 30$), coniugati da sommare a $180$ ($2x + 30 + 4x = 180$), risultati interi.
5. Angoli del triangolo: terzo angolo, triangolo isoscele (angoli alla base dal vertice e viceversa), triangolo rettangolo, angoli in proporzione ($x$, $2x$, $3x$), e il riconoscimento dei triangoli che non esistono.
6. Angolo esterno: dati l'angolo esterno e un angolo interno non adiacente, trovare gli altri due ($130^\circ$ e $55^\circ$: $50^\circ$ e $75^\circ$), o l'angolo esterno dai due interni.
7. Poligoni convessi: somma degli angoli dal numero dei lati, numero dei lati dalla somma ($1440^\circ$: $10$), angolo del poligono regolare e numero dei lati dall'angolo ($150^\circ$: $12$).
