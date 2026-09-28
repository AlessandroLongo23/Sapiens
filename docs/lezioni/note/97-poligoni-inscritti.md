# Note: Poligoni inscritti e circoscritti

Lezione nuova, scritta da zero (lotto 10). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in `lotto10/96/verifica.py` nello scratchpad: il triangolo $6$, $8$, $10$ con $R = 5$ e $r = 2$ (con l'equazione dei segmenti di tangente e, come controllo, con area diviso semiperimetro), gli angoli dell'esempio 2, il lato $x = 8$ dell'esempio 3 e il valore sbagliato $10$ dell'avviso (con il controllo che $9, 7, 6, 10$ non è circoscrivibile), il trapezio isoscele con basi $18$ e $8$ (lati $13$, proiezione $5$, altezza $12$, raggio $6$), gli angoli al centro di ottagono, pentagono ed esagono, l'apotema $3\sqrt{3} \approx 5{,}20$, il quadrato inscritto con $\ell = 5\sqrt{2} \approx 7{,}07$ e apotema $\approx 3{,}54$. Le figure sono generate da `lotto10/97/figs.py`, che controlla: vertici del pentagono sulla circonferenza e lati del quadrilatero circoscritto a distanza $r$ dal centro; circocentro equidistante dai vertici e incentro dai lati; nel triangolo $6$, $8$, $10$ il circocentro nel punto medio dell'ipotenusa, l'incentro a distanza $2$ dai tre lati e i segmenti di tangente $4$ e $6$; $\hat{A} + \hat{C} = \hat{B} + \hat{D} = 180^\circ$ nel quadrilatero inscritto; i punti di contatto sui lati, i quattro segmenti di tangente a coppie congruenti e $AB + CD = BC + DA$ nel quadrilatero circoscritto; il quadrilatero dell'esempio 3 costruito davvero con i lati $9$, $7$, $6$, $8$ (segmenti di tangente $4$, $5$, $2$, $4$, raggio $\frac{8}{\sqrt{5}}$ trovato numericamente); rettangolo inscritto e rombo circoscritto; trapezio isoscele inscritto con gli angoli opposti supplementari; il trapezio dell'esempio 4 con il cerchio di raggio $6$ tangente ai quattro lati; pentagono regolare con apotema perpendicolare nel punto medio e circonferenza inscritta tangente a ogni lato, $O$ sulle bisettrici; esagono con il lato uguale al raggio; apotema $3\sqrt{3}$ e lato del quadrato $5\sqrt{2}$ in scala (40 controlli, tutti passati). Il controllo `check.mts` passa sui tre file. Le formule in evidenza sono larghe al massimo 248 px.

## Struttura ed esempi

Definizioni e le due regole (assi e bisettrici che passano per uno stesso punto). Triangolo, con il rimando alla 61. Quadrilateri inscrivibili e circoscrivibili, ognuno con un teorema dimostrato a metà. Parallelogrammi e trapezi, con il perché per ogni riga della tabella. Poligoni regolari: perché sono inscrivibili e circoscrivibili, raggio e apotema, angolo al centro, esagono.

Sei esempi svolti:

1. triangolo rettangolo $6$, $8$, $10$: raggio della circoscritta dall'ipotenusa, raggio della inscritta con i segmenti di tangente;
2. angoli di un quadrilatero inscritto, e riconoscere se un quadrilatero è inscrivibile;
3. il lato mancante e il perimetro di un quadrilatero circoscritto;
4. trapezio isoscele circoscritto: lati obliqui, altezza, raggio;
5. esagono: perimetro dal raggio, apotema dal lato ($3\sqrt{3}$);
6. quadrato inscritto: lato $5\sqrt{2}$ e apotema.

Avvisi: inscritto e circoscritto scambiati, angoli opposti e non consecutivi, lati opposti e non consecutivi, lati congruenti non vuol dire regolare, raggio e apotema scambiati.

## Scelte di convenzione (da verificare con il libro in uso)

- "Inscrivibile" e "circoscrivibile" per il poligono, "circoscritta" e "inscritta" per la circonferenza, come la maggior parte dei libri.
- Nell'esempio 1 i due raggi sono $R$ (circoscritta) e $r$ (inscritta), come nella 61; nella sezione sui poligoni regolari il raggio del poligono è $r$ e l'apotema $a$, come nella 98. Nell'esempio 1 le due lettere servono insieme, ma chi legge tutta la lezione trova $r$ usato per due cose diverse: si potrebbe usare $R$ e $r$ anche nei poligoni regolari (con $a = r$).
- Lato $\ell$, come la 98.
- Condizione dei quadrilateri circoscrivibili scritta con le misure, $\overline{AB} + \overline{CD} = \overline{BC} + \overline{DA}$, e nella tesi della dimostrazione con la congruenza delle somme di segmenti, $AB + CD \cong BC + DA$, come la 58 per la somma di segmenti.
- Teoremi dei quadrilateri enunciati per i quadrilateri convessi.
- Il teorema di Pitagora negli esempi 1, 4, 5 e 6 come noto dalla scuola media (vedi la 96).

## Dimostrazioni

Fatte:

- quadrilatero inscritto ha gli angoli opposti supplementari (con gli angoli alla circonferenza della 96);
- quadrilatero circoscritto ha le somme dei lati opposti congruenti (con i segmenti di tangente della 96);
- ogni poligono regolare è inscrivibile e circoscrivibile (con il pentagono: triangolo isoscele $OBC$, primo criterio su $OBC$ e $OCD$, e così via); il brief non la chiedeva, ma senza non si capisce da dove vengano raggio e apotema;
- esagono regolare: lato uguale al raggio (triangolo isoscele con l'angolo al vertice di $60^\circ$).

Ragionate in prosa: quali parallelogrammi sono inscrivibili o circoscrivibili, il trapezio non isoscele non inscrivibile. Enunciati senza dimostrazione: i due inversi dei teoremi dei quadrilateri, le due regole con assi e bisettrici (il "se" viene dalla definizione di luogo).

## Lasciato ad altre lezioni

- Circocentro, incentro e le loro dimostrazioni: link alla 61, con una figura sola qui.
- Area di un poligono regolare (perimetro per apotema diviso $2$): è della 98, che linka già questa lezione; qui non c'è.
- La diagonale del quadrato $\ell\sqrt{2}$ e l'altezza del triangolo equilatero $\frac{\ell\sqrt{3}}{2}$ come formule: sono della 100. Qui compaiono solo dentro gli esempi 5 e 6, calcolate con Pitagora.
- La relazione generale tra lato, raggio e apotema dei poligoni regolari (con le funzioni goniometriche): anni successivi.
- Il raggio della circonferenza inscritta in un triangolo qualsiasi come area diviso semiperimetro: non c'è (l'esempio 1 lo trova con i segmenti di tangente). Si potrebbe aggiungere dopo la 98.

## Figure

Quattordici blocchi TikZ, generati da `figs.py`, compilati con `compileFigure` e guardati in chiaro e in scuro. Larghezza da 118 a 238 px, altezza da 105 a 177 px. Stile della 61 e della 62: poligoni `blue!8` con il bordo `thick`, circonferenze circoscritte `orange!80!black` (come nella 61), circonferenze inscritte `blue!70!black`, trattini e archetti. Nel quadrilatero circoscritto i segmenti di tangente da $D$ sono segnati con un cerchietto invece che con quattro trattini, che sarebbero illeggibili.

`poligono-inscritto-e-circoscritto`, `triangolo-circonferenza-circoscritta-inscritta`, `esempio-triangolo-rettangolo-due-circonferenze`, `quadrilatero-inscritto-angoli-opposti`, `quadrilatero-circoscritto-segmenti-tangenti`, `esempio-quadrilatero-circoscritto-lato`, `rettangolo-inscritto-rombo-circoscritto`, `trapezio-isoscele-inscritto`, `esempio-trapezio-isoscele-circoscritto`, `poligono-regolare-bisettrici-centro`, `poligono-regolare-raggio-apotema`, `esagono-regolare-triangoli-equilateri`, `esempio-apotema-esagono-regolare`, `esempio-quadrato-inscritto`.

Il formulario copia `poligono-regolare-raggio-apotema`.

## Formulario e flashcard

- Formulario: definizioni e regole, triangolo, le due condizioni dei quadrilateri con un esempio, la tabella, poligoni regolari con raggio, apotema, angolo al centro ed esagono, tre avvisi.
- 18 carte, nell'ordine della lezione.

## Da cambiare nelle lezioni già scritte

- 61 (Punti notevoli del triangolo), sezione "Assi e circocentro": dopo "Si chiama **circonferenza circoscritta** al triangolo, e il suo raggio è la distanza del circocentro dai vertici." si può aggiungere "Quali altri poligoni hanno una circonferenza circoscritta lo dice la lezione [Poligoni inscritti e circoscritti](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti)."
- 60 (Rette perpendicolari e parallele), sezione "Somma degli angoli di un poligono": "Un poligono con tutti i lati e tutti gli angoli congruenti si dice regolare, e ciascuno dei suoi $n$ angoli misura $S : n$." diventa "Un poligono con tutti i lati e tutti gli angoli congruenti si dice [regolare](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/poligoni-inscritti-e-circoscritti), e ciascuno dei suoi $n$ angoli misura $S : n$."
- 98 (Equivalenza e aree) linka già questa lezione per il centro dei poligoni regolari: niente da cambiare. La 98 dice che il centro "ha la stessa distanza da tutti i vertici e la stessa distanza da tutti i lati", che è quello che qui si dimostra.

## Prerequisiti

La riga della bozza è `poligoni-inscritti <- circonferenza-cerchio, geometria-punti-notevoli, geometria-quadrilateri`. Se la 96 diventa `circonferenza-cerchio <- geometria-punti-notevoli`, come propongo nelle sue note, l'arco `geometria-punti-notevoli` qui è ridondante. La riga diventa

```
poligoni-inscritti <- circonferenza-cerchio, geometria-quadrilateri
```

## Per il generatore

1. Quadrilatero inscritto: dati due angoli consecutivi, trovare gli altri due. Distrattore: il supplementare dell'angolo consecutivo.
2. Riconoscere se un quadrilatero con quattro angoli dati è inscrivibile. Distrattore: "sì" perché la somma è $360^\circ$ (lo è sempre).
3. Quadrilatero circoscritto: dati tre lati in ordine, il quarto e il perimetro. Distrattore: la somma dei lati consecutivi.
4. Quali quadrilateri sono inscrivibili o circoscrivibili (scelta multipla sulla tabella). Distrattori: rombo inscrivibile, rettangolo circoscrivibile, trapezio qualsiasi inscrivibile.
5. Angolo al centro di un poligono regolare di $n$ lati, e $n$ dall'angolo al centro. Distrattore: l'angolo interno $(n - 2) \cdot 180^\circ : n$.
6. Esagono regolare: perimetro dal raggio e viceversa; apotema dal lato ($\frac{\ell\sqrt{3}}{2}$, con lati pari per avere $\ell/2$ intero). Distrattore: apotema uguale al raggio.
7. Triangolo rettangolo con cateti da una terna pitagorica: raggio della circoscritta (metà ipotenusa) e della inscritta ($\frac{a + b - c}{2}$). Distrattore: l'ipotenusa intera come raggio.
8. Trapezio isoscele circoscritto: dalle basi i lati obliqui, l'altezza e il raggio, con basi scelte perché l'altezza sia intera ($18$ e $8$; $8$ e $2$, lati $5$, altezza $4$). Distrattore: altezza uguale al lato obliquo.

I livelli 1, 3, 6, 7 e 8 vorrebbero una figura.

## Domande per Andrea

- Gli inversi dei due teoremi dei quadrilateri non sono dimostrati: va bene per il secondo anno, o il libro li dimostra (per assurdo)?
- La dimostrazione che ogni poligono regolare è inscrivibile e circoscrivibile, fatta sul pentagono con "e così via": basta, o è troppo per la verifica e si può ridurre a enunciato?
- Esempio 1: il raggio della circonferenza inscritta nel triangolo rettangolo con i segmenti di tangente. È un esercizio che i libri fanno qui, o dopo le aree con $r = \frac{\text{area}}{\text{semiperimetro}}$?
- Nomi dei raggi: $R$ e $r$ per circoscritta e inscritta, oppure raggio $r$ e apotema $a$ per i poligoni regolari? La lezione usa tutte e due le coppie in sezioni diverse.
