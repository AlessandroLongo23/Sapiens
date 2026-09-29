# Valore medio e incertezza di una serie di misure

Generatore: `fis-valore-medio` (`src/lib/exercises/v2/generators/fis-valore-medio.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_valore_medio.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/06-fis-valore-medio.md` (note in `docs/lezioni/fisica/note/06-fis-valore-medio.md`).

Sei livelli nell'ordine della lezione: il valore medio, la semidispersione, il risultato scritto e arrotondato, il
caso in cui decide la sensibilità, una misura da scartare, il confronto tra misure.

## Nomi dei livelli

1. Il valore medio
2. La semidispersione
3. Scrivere il risultato
4. Incertezza e sensibilità
5. Una misura da scartare
6. Misure compatibili

## Le regole della lezione (le stesse per tutti i gruppi di fisica)

- Valore medio: $\bar{x} = \dfrac{x_1 + \dots + x_n}{n}$.
- Incertezza assoluta: la semidispersione $\Delta x = \dfrac{x_{\max} - x_{\min}}{2}$, oppure la sensibilità dello
  strumento se la semidispersione è più piccola (una sola misura, misure tutte uguali).
- Risultato: $x = (\bar{x} \pm \Delta x)\,\text{unità}$; $\Delta x$ arrotondata a una cifra significativa, $\bar{x}$
  arrotondato alla stessa posizione decimale; per arrotondare si guarda la prima cifra tolta ($5$ o più: si aumenta).
- Due misure sono compatibili se gli intervalli da $\bar{x} - \Delta x$ a $\bar{x} + \Delta x$ si sovrappongono.

## Tipi di risposta

Tutti i livelli hanno una risposta `choice` con quattro opzioni, senza `toChoice`. Le opzioni sono scritte come la
lezione: un valore `12{,}503\,\text{s}` (livelli 1 e 2), un risultato `(12{,}50 \pm 0{,}06)\,\text{s}` (livelli 3, 4 e
5), un testo `\text{solo B}` (livello 6). `values` è la scrittura dell'opzione senza LaTeX, così il controllo vede
anche gli zeri finali: `"12,503 s"`, `"12,50 ± 0,06 s"`, `"solo B"`. Due opzioni non hanno mai la stessa scrittura, e
ai livelli 3-5 nemmeno lo stesso valore e la stessa incertezza scritti in modo diverso.

## Regole comuni

- Contesti, ciascuno con la sua sensibilità e il numero di decimali dei dati:
  - tempo di $10$ oscillazioni di un pendolo, cronometro da $0{,}01$ s, valori da $8$ a $20$ s;
  - tempo di caduta di una pallina, cronometro da $0{,}01$ s, valori da $0{,}40$ a $0{,}90$ s;
  - diametro di un tubo con il calibro da $0{,}05$ mm, valori da $10$ a $40$ mm, multipli di $0{,}05$;
  - massa di un oggetto con una bilancia da $0{,}1$ g, valori da $20$ a $300$ g;
  - temperatura di un liquido con un termometro da $0{,}1\,{}^\circ\text{C}$, valori da $15$ a $80\,{}^\circ\text{C}$;
  - lunghezza di un banco con il metro a nastro da $0{,}1$ cm, valori da $60$ a $150$ cm.
- Da $4$ a $6$ misure, scritte in una riga di dati separate da `\quad`, con l'unità alla fine della riga
  ("$12{,}46 \quad 12{,}56 \quad \dots \ \text{s}$"), dopo una frase che dice lo strumento e la sensibilità.
- Virgola decimale `{,}`, unità dopo `\,`, zeri finali scritti quando sono misurati ($12{,}50$).
- Numeri costruiti all'indietro: prima il valore medio e l'incertezza, poi gli scarti, poi le misure.
- Ai livelli 3, 4 e 5 gli arrotondamenti non cadono mai a metà: la parte tolta, sia dell'incertezza sia del valore
  medio, non è esattamente un $5$ seguito da zeri. Così la risposta non dipende dalla regola del $5$.
- Niente trattini lunghi e niente "piuttosto che" nei testi.

## Livello 1: il valore medio

"Quanto vale il valore medio delle misure?" La risposta è il valore medio esatto, con al più un decimale più dei
dati (con $n = 4$ la somma è pari nell'ultima cifra, con $n = 6$ è multipla di $3$). Non si arrotonda: il livello
chiede solo la media.

Distrattori: la somma divisa per $n - 1$; il punto medio tra la misura più grande e la più piccola,
$\dfrac{x_{\max} + x_{\min}}{2}$ (diverso dalla media); la media senza l'ultima misura. Un distrattore non ha più
decimali della risposta; se ne manca uno, un valore vicino (un'unità sull'ultima cifra).

Esempi:

- "Il tempo di $10$ oscillazioni di un pendolo, misurato con un cronometro da $0{,}01$ s: $12{,}46 \quad 12{,}56
  \quad 12{,}51 \quad 12{,}44 \quad 12{,}53 \quad 12{,}50$ s." Risposta $12{,}50$ s. (Qui la media è esatta ai
  centesimi.)
- "La massa di un anello, con una bilancia da $0{,}1$ g: $24{,}3 \quad 24{,}6 \quad 24{,}4 \quad 24{,}5 \quad 24{,}3$
  g." Risposta $24{,}42$ g; distrattore $24{,}45$ (il punto medio). La somma divisa per $4$, $30{,}525$, ha più
  decimali della risposta e si sostituisce; la media senza l'ultima misura, $24{,}45$, coincide con il punto medio, e
  al suo posto va un valore vicino.

## Livello 2: la semidispersione

"Quanto vale la semidispersione delle misure?" Risposta $\dfrac{x_{\max} - x_{\min}}{2}$, esatta (può avere un
decimale più dei dati: $0{,}035$ s). Sempre più grande della sensibilità.

Distrattori: il campo di variazione $x_{\max} - x_{\min}$ (il diviso due dimenticato, l'avviso della lezione);
$x_{\max} - \bar{x}$ (diverso dalla risposta); la sensibilità dello strumento.

Esempi:

- Le sei misure del pendolo: risposta $0{,}06$ s; distrattori $0{,}12$, $0{,}01$, e un valore vicino.
- "$0{,}62 \quad 0{,}57 \quad 0{,}65 \quad 0{,}60 \quad 0{,}63$ s": risposta $0{,}04$ s; distrattori $0{,}08$,
  $0{,}036$ ($x_{\max} - \bar{x}$), $0{,}01$.

## Livello 3: scrivere il risultato

"Scrivi il risultato della misura." Semidispersione almeno tre volte la sensibilità. Circa due volte su tre
l'incertezza va arrotondata (da $0{,}19$ a $0{,}2$, da $0{,}13$ a $0{,}1$, da $0{,}035$ non ammesso perché cade a
metà), e circa due volte su tre il valore medio va arrotondato a una posizione più alta di quella dei dati.

Risposta $(\bar{x} \pm \Delta x)$ arrotondati. Distrattori:

- i numeri della calcolatrice, senza arrotondare: $(2{,}508 \pm 0{,}19)\,\text{s}$;
- il campo di variazione al posto della semidispersione, arrotondato: $(2{,}5 \pm 0{,}4)\,\text{s}$;
- il valore medio con una cifra in più: $(2{,}51 \pm 0{,}2)\,\text{s}$;
- l'incertezza troncata invece che arrotondata, quando è diversa: $(2{,}5 \pm 0{,}1)\,\text{s}$.

Si prendono i primi tre diversi dalla risposta e tra loro.

Esempi:

- "$2{,}31 \quad 2{,}58 \quad 2{,}44 \quad 2{,}69 \quad 2{,}52$ s, cronometro da $0{,}01$ s." Risposta
  $(2{,}5 \pm 0{,}2)\,\text{s}$.
- Le sei misure del pendolo: risposta $(12{,}50 \pm 0{,}06)\,\text{s}$ (niente da arrotondare nell'incertezza; lo zero
  finale del valore va scritto); distrattori $(12{,}5 \pm 0{,}1)$ (il campo di variazione), $(12{,}50 \pm 0{,}01)$ (la
  sensibilità), $(12{,}50 \pm 0{,}07)$ (un valore vicino). I numeri della calcolatrice coincidono con la risposta, e
  $(12{,}5 \pm 0{,}06)$ o $(12{,}500 \pm 0{,}06)$ sarebbero gli stessi numeri scritti in modo diverso, che le regole
  delle opzioni escludono.

## Livello 4: incertezza e sensibilità

"Scrivi il risultato della misura." Due casi, metà ciascuno:

- la semidispersione è più piccola della sensibilità (misure che differiscono di un'unità sull'ultima cifra, o tutte
  uguali, una volta su tre): l'incertezza è la sensibilità;
- la semidispersione è più grande della sensibilità, come al livello 3.

Distrattori: la semidispersione anche quando è più piccola, $(42{,}33 \pm 0{,}05)\,\text{g}$; l'incertezza zero,
$(42{,}3 \pm 0)\,\text{g}$, quando le misure sono uguali; metà della sensibilità, $(42{,}3 \pm 0{,}05)\,\text{g}$; nel
secondo caso la sensibilità al posto della semidispersione.

Esempi:

- "$42{,}3 \quad 42{,}4 \quad 42{,}3$ g, bilancia da $0{,}1$ g." Risposta $(42{,}3 \pm 0{,}1)\,\text{g}$.
- "$21{,}0 \quad 21{,}0 \quad 21{,}0$ cm, righello da $0{,}1$ cm." Risposta $(21{,}0 \pm 0{,}1)\,\text{cm}$.

## Livello 5: una misura da scartare

Da $5$ a $6$ misure, una delle quali è uno sbaglio con la sua causa scritta nel testo. La misura sbagliata dista dalle
altre almeno cinque volte la loro semidispersione, e nel verso che la causa spiega:

- cronometro fermato in ritardo (più lunga) o fatto partire in ritardo (più corta);
- $9$ oscillazioni contate invece di $10$ (più corta di circa un decimo);
- bilancia non azzerata in quella pesata, che segnava $x$ g a vuoto (più pesante di $x$);
- metro appoggiato dalla tacca di $1$ cm invece che dallo zero (più lunga di $1$ cm).

"Scrivi il risultato della misura." Risposta: il risultato arrotondato senza la misura sbagliata. Distrattori: il
risultato con la misura sbagliata dentro; la media giusta con l'incertezza calcolata tenendo la misura sbagliata;
il risultato senza un'altra misura (la più piccola o la più grande delle buone).

Esempi:

- "$0{,}62 \quad 0{,}57 \quad 0{,}65 \quad 0{,}60 \quad 0{,}91 \quad 0{,}63$ s; nella quinta misura il cronometro è
  stato fermato in ritardo." Risposta $(0{,}61 \pm 0{,}04)\,\text{s}$; distrattori $(0{,}7 \pm 0{,}2)\,\text{s}$,
  $(0{,}6 \pm 0{,}2)\,\text{s}$ (la media giusta arrotondata ai decimi, come l'incertezza), $(0{,}66 \pm 0{,}04)\,\text{s}$
  (la media con la misura sbagliata e l'incertezza giusta). Senza la più piccola delle buone l'incertezza sarebbe
  $0{,}025$, senza la più grande la media sarebbe $0{,}605$: tutte e due a metà, e non si usano.
- "$64{,}2 \quad 64{,}5 \quad 69{,}3 \quad 64{,}3 \quad 64{,}1$ g; nella terza pesata la bilancia non era stata
  azzerata e a vuoto segnava $5{,}0$ g." Senza la terza misura $\bar{m} = 64{,}275$ g e $\Delta m = 0{,}2$ g:
  risposta $(64{,}3 \pm 0{,}2)\,\text{g}$; distrattori $(65 \pm 3)\,\text{g}$ (con la misura sbagliata),
  $(64 \pm 3)\,\text{g}$ (l'incertezza con la misura sbagliata), $(64{,}2 \pm 0{,}1)\,\text{g}$ (senza la più grande
  delle buone; senza la più piccola l'incertezza sarebbe $0{,}15$, a metà, e non si usa).

## Livello 6: misure compatibili

Tre gruppi misurano la stessa grandezza e scrivono i risultati A, B e C, già arrotondati come la lezione. "Con quali
misure è compatibile la misura A?" Quattro opzioni fisse, in ordine mescolato: "solo B", "solo C", "B e C", "né B né
C". Quattro casi, un quarto ciascuno.

Gli intervalli che si sovrappongono hanno in comune almeno un'unità sull'ultima cifra delle incertezze; quelli
separati hanno tra loro almeno un'unità di distanza. Mai intervalli che si toccano in un punto solo. Le incertezze dei
tre gruppi possono avere posizioni diverse ($0{,}06$ e $0{,}1$), come l'esempio 4 della lezione.

Esempi:

- A $= (12{,}50 \pm 0{,}06)\,\text{s}$, B $= (12{,}62 \pm 0{,}04)\,\text{s}$, C $= (12{,}6 \pm 0{,}1)\,\text{s}$:
  risposta "solo C".
- A $= (9{,}8 \pm 0{,}2)\,{}^\circ\text{C}$, B $= (10{,}1 \pm 0{,}2)\,{}^\circ\text{C}$, C
  $= (9{,}75 \pm 0{,}08)\,{}^\circ\text{C}$: risposta "B e C".

## Esercizi da evitare

- Serie con due misure lontanissime dalle altre, o con la misura sbagliata del livello 5 che si confonde con le
  buone.
- Arrotondamenti che cadono a metà ($0{,}035$, $2{,}55$ da arrotondare ai decimi).
- Valori medi o incertezze che dopo l'arrotondamento coincidono con un distrattore.
- Intervalli che si toccano in un punto.

## Verifica

`scripts/exercises/checkers/fis_valore_medio.py` rilegge dal testo le misure (con `Fraction`), la sensibilità, la
causa dello sbaglio e i risultati dei tre gruppi; ricalcola media, semidispersione, incertezza (con la sensibilità),
arrotondamento con la regola del $5$ (e controlla che non cada a metà), intervalli e sovrapposizioni; controlla
l'opzione giusta, che le quattro opzioni siano diverse, la scrittura dei numeri (zeri finali compresi) e la quota dei
casi.

Il controllo ricostruisce anche i distrattori, nell'ordine della specifica, e vuole esattamente quelli. Quando i
distrattori della specifica sono meno di tre (coincidono con la risposta, tra loro, o cadono a metà), il generatore
completa con valori di riserva, sempre nello stesso ordine:

- livelli 1 e 2: la risposta più o meno un'unità sull'ultima cifra, poi due unità, e così via;
- livelli 3, 4 e 5: la sensibilità al posto dell'incertezza, poi l'incertezza di un'unità più grande o più piccola,
  poi il valore medio di un'unità più grande o più piccola;
- livello 5, prima di queste: la media con la misura sbagliata e l'incertezza giusta, come $(0{,}66 \pm 0{,}04)$
  nell'esempio 1.

Sui 1.000 esercizi del seed 1 hanno almeno un distrattore di riserva il $58\%$ del livello 3, il $64\%$ del livello 4 e
il $21\%$ del livello 5.

Esito: `sample.mts fis-valore-medio 1000 all` con seed iniziale 1, 50001 e 777001, 6.000 esercizi ciascuno, PASS.
Quote dei casi con il seed 1: livello 3 stessa posizione 316, incertezza arrotondata 579, posizione più alta 105;
livello 4 misure uguali 165, semidispersione sotto la sensibilità 339, semidispersione 496; livello 6 "solo B" 254,
"solo C" 250, "B e C" 255, "né B né C" 241. `review.mts` e `width.mts` escono con codice 0 (opzioni al più 162 px,
formule del problema al più 208 px).

### Errori piantati

1.578 su 1.578 bocciati (seed 1; 1.581 su 1.581 con il seed 50001), su 40 esercizi per livello:

- opzione giusta spostata, due opzioni uguali, risposta cambiata di un'unità sull'ultima cifra (al livello 6 un'altra
  etichetta), `values` diverso dal LaTeX (livelli 1-6);
- una misura del testo cambiata, la sensibilità del testo cambiata (livelli 1-5);
- uno zero finale tolto dall'opzione giusta, nel valore o nell'incertezza (livelli 3-5, 120 casi);
- la causa nel verso sbagliato (fermato invece di fatto partire in ritardo) e la misura sbagliata indicata al posto di
  un'altra (livello 5);
- l'intervallo di B spostato fino a toccare quello di A in un punto (livello 6);
- cinque serie costruite a mano con un arrotondamento a metà: semidispersione $0{,}035$ e $0{,}15$ s, valore medio
  $12{,}45$ s da arrotondare ai decimi (livello 3), valore medio $42{,}35$ g con la sensibilità di $0{,}1$ g (livello 4),
  semidispersione delle buone $0{,}025$ s (livello 5). Il controllo le boccia tutte con "rounding at half".

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 1000 (999), livello 2 1000 (1000), livello 3 1000 (1000), livello 4
997 (1000), livello 5 1000 (1000), livello 6 1000 (1000).
