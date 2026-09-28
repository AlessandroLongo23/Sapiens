# Equivalenza e aree

Generatore: `equivalenza-aree` (`src/lib/exercises/v2/generators/equivalenza-aree.ts`).
Verifica indipendente: `scripts/exercises/checkers/equivalenza_aree.py`. Lezione collegata:
`docs/lezioni/riscritte/98-equivalenza-aree.md` (note in `docs/lezioni/note/98-equivalenza-aree.md`,
sezione "Per il generatore").

Sei livelli, gli stessi sei che propone la nota e nello stesso ordine. Tutti si reggono sul testo, senza figura
(vedi "Livelli che vorrebbero una figura").

## Tipi di risposta

Tutti i livelli hanno una risposta `number`: un decimale finito esatto, scritto come razionale ("48/5" è $9{,}6$),
in $\text{cm}$ o in $\text{cm}^2$ (al livello 2 nell'unità chiesta). La variante a scelta multipla (`toChoice`)
ha quattro opzioni scritte come la lezione: `9{,}6\ \text{cm}`, `96\ \text{cm}^2`, `35\,000\ \text{cm}^2`. Prima
i distrattori della lezione, poi, se ne mancano, valori vicini alla risposta (un'unità sulla penultima cifra).

## Regole comuni

- Convenzioni della lezione: virgola decimale `{,}`, separatore delle migliaia `\,` da cinque cifre in su
  ($5400$, $35\,000$), `\cdot`, lunghezze scritte "$12$ cm" nel testo, aree "$96\ \text{cm}^2$", segmenti
  $\overline{AB}$ quando si scrive una misura dentro una formula, basi $B$ e $b$ del trapezio, diagonali $d_1$ e
  $d_2$, apotema $a$, perimetro $P$ e $A = \dfrac{P \cdot a}{2}$.
- Il testo sta in righe `\text{…}` scritte con `textBlock`, con le formule tra `$…$`.
- Numeri costruiti all'indietro: prima la figura (o la risposta), poi i dati.
- Risposte con al più due decimali (quattro al livello 2), mai negative. Una distrattrice non ha più decimali
  della risposta (tranne al livello 2, dove $0{,}0941$ al posto di $9\,410\,000$ è proprio l'errore da
  riconoscere): altrimenti si tradirebbe da sola.
- Passaggi in italiano con le formule della lezione, e il controllo dove la lezione lo fa (l'altezza più corta
  del lato obliquo, l'apotema arrotondato che rende arrotondata anche l'area).
- Niente trattini lunghi e niente "piuttosto che" nei testi (il `check()` lo controlla).

## Livello 1: l'area delle figure

Sei casi, circa 1 su 6 ciascuno, tutti con dati e area interi:

- rettangolo, base e altezza da 3 a 25, diverse;
- quadrato, dal lato (da 3 a 25) o dalla diagonale (pari, da 4 a 26), metà ciascuno;
- parallelogramma con la base $AB$, il lato obliquo $AD$ e l'altezza $DH$, sempre $DH < AD$ e $AD \neq AB$;
- triangolo: base e altezza relativa, oppure triangolo rettangolo in $C$ con i cateti e l'ipotenusa (terne
  pitagoriche, con l'ipotenusa data e non da calcolare, come l'esempio 3);
- trapezio con le basi $B > b$ e l'altezza;
- rombo con le due diagonali diverse.

Esempi:

- "Nel parallelogramma $ABCD$ la base $AB$ misura $14$ cm, il lato $AD$ misura $12$ cm e l'altezza $DH$ relativa
  ad $AB$ misura $5$ cm. Quanto misura l'area?" Risposta $70\ \text{cm}^2$; distrattori $168$ (il lato obliquo al
  posto dell'altezza), $35$ (diviso due come un triangolo), $52$ (il perimetro).
- "Un trapezio ha le basi di $13$ cm e di $5$ cm e l'altezza di $9$ cm." Risposta $81\ \text{cm}^2$; distrattori
  $58{,}5$ (una sola base), $162$ (senza il diviso due), $36$ (la differenza delle basi).

Distrattori: il lato obliquo al posto dell'altezza, il triangolo senza il diviso due, il trapezio con una sola base
(dalla nota), il perimetro al posto dell'area, $d^2$ al posto di $\dfrac{d^2}{2}$ per il quadrato, il rombo senza il
diviso due, l'ipotenusa presa come altezza.

## Livello 2: unità di misura delle aree

Due casi, metà ciascuno:

- conversione: "Esprimi $3{,}5\ \text{m}^2$ in $\text{cm}^2$." Tra $\text{m}^2$, $\text{dm}^2$, $\text{cm}^2$,
  $\text{mm}^2$, da uno a tre passi, verso l'unità più piccola o più grande; il dato ha da una a tre cifre
  significative e al più due decimali, la risposta al più quattro decimali e non più di $10\,000\,000$;
- rettangolo con i lati in unità diverse, come l'esempio 1: la base con un decimale in un'unità, l'altezza intera
  in un'unità da uno o due passi più piccola; l'area si chiede nell'unità più piccola (2 volte su 3) o in quella
  più grande.

Esempi:

- "Esprimi $76{,}4\ \text{dm}^2$ in $\text{m}^2$." Risposta $0{,}764\ \text{m}^2$; distrattori $7{,}64$ (fattore
  $10$ come per le lunghezze), $7640$ (verso sbagliato), $76{,}4$.
- "Un rettangolo ha la base di $9{,}8$ m e l'altezza di $93$ cm. Quanto misura l'area in $\text{cm}^2$?" Risposta
  $91\,140\ \text{cm}^2$; distrattori $911{,}4$ (i numeri moltiplicati così come sono, l'avviso della lezione),
  $9\,114\,000$ (il lato convertito con $100$ a ogni passo).

Distrattori dalla nota: il fattore $10$ al posto di $100$, il prodotto di misure in unità diverse; in più il verso
sbagliato, un passo in meno o in più, l'area non riportata all'unità chiesta.

## Livello 3: una misura dall'area

Quattro casi, circa 1 su 4 ciascuno. L'area è sempre intera; la misura cercata è intera o ha un decimale (circa 3
volte su 10), come il $4{,}8$ dell'esempio 3:

- triangolo: l'altezza dall'area e dalla base, o la base dall'area e dall'altezza;
- trapezio: l'altezza dall'area e dalle basi (circa 2 su 3), o la base minore dall'area, dalla base maggiore e
  dall'altezza (sempre minore della maggiore);
- rombo: la diagonale $BD$ dall'area e dalla diagonale $AC$, mai uguali (sarebbe un quadrato);
- parallelogramma: l'altezza dall'area e dalla base.

Esempi:

- "Un trapezio ha l'area di $35\ \text{cm}^2$ e le basi di $9$ cm e di $5$ cm. Quanto misura l'altezza?" Risposta
  $5$ cm; distrattori $2{,}5$ (senza moltiplicare per $2$), $14$.
- "Un rombo ha l'area di $48\ \text{cm}^2$ e la diagonale $AC$ di $4$ cm. Quanto misura la diagonale $BD$?"
  Risposta $24$ cm; distrattori $12$, $6$, $48$.

Distrattori dalla nota: l'area divisa per la base senza moltiplicare per $2$ ($2{,}4$ al posto di $4{,}8$); per il
trapezio la divisione per una sola base. In più il doppio della risposta e, per il parallelogramma, la formula del
triangolo.

## Livello 4: le due altezze e l'altezza sull'ipotenusa

Tre casi, circa 1 su 3 ciascuno:

- parallelogramma, come l'esempio 2: i lati $AB$ e $AD$ e l'altezza $DH$, trovare $BK$ (circa 3 su 5); oppure i
  lati e $BK$, trovare $DH$. Sempre $DH < AD$ e $BK < AB$;
- triangolo qualsiasi: i lati $AB$ e $BC$ e l'altezza $CH$ relativa ad $AB$ ($CH < BC$), trovare l'altezza $AK$
  relativa a $BC$;
- triangolo rettangolo: cateti e ipotenusa (multipli di $3, 4, 5$ e di $7, 24, 25$, perché l'altezza abbia un
  decimale finito), oppure l'area e l'ipotenusa (con un triangolo rettangolo non isoscele che esiste davvero,
  cioè $16 A^2 < c^4$); trovare l'altezza relativa all'ipotenusa.

Risposte con al più due decimali.

Esempi:

- "Nel parallelogramma $ABCD$ il lato $AB$ misura $7$ cm, il lato $AD$ misura $20$ cm e l'altezza $DH$ relativa ad
  $AB$ misura $14$ cm. Quanto misura l'altezza $BK$ relativa ad $AD$?" Risposta $4{,}9$ cm; distrattori $10$
  (i lati scambiati), $2{,}45$, $40$ (il rapporto rovesciato, più lungo di $AB$: va scartato).
- "Il triangolo $ABC$ è rettangolo in $C$: i cateti misurano $\overline{AC} = 24$ cm e $\overline{BC} = 18$ cm,
  l'ipotenusa $\overline{AB} = 30$ cm. Quanto misura l'altezza $CH$ relativa all'ipotenusa?" Risposta
  $14{,}4$ cm; distrattori $7{,}2$ (senza il $2$), $216$ (l'area), $15$ (metà dell'ipotenusa).

Distrattore della nota: l'altezza più lunga del lato obliquo, che i passaggi scartano con il controllo della
lezione.

## Livello 5: poligoni regolari

Triangolo equilatero, pentagono regolare, esagono regolare, circa un terzo ciascuno. Tre casi:

- il lato (da 4 a 30) e l'apotema arrotondato ai centesimi, come l'esempio 6 (metà);
- il perimetro e l'apotema arrotondato (circa 1 su 4);
- il numero fisso della nota della lezione ($0{,}289$, $0{,}688$, $0{,}866$) e il lato: prima l'apotema, poi l'area
  (circa 1 su 4). I lati sono quelli che tengono l'area a due decimali: pentagono da 4 a 24, esagono multipli di
  $5$, triangolo multipli di $10$.

L'apotema dato non finisce mai con uno zero ($5{,}20$ si scriverebbe $5{,}2$ e sembrerebbe arrotondato ai decimi),
e non cade a metà tra due centesimi. Il prodotto $n \cdot \ell$ è pari, così l'area ha al più due decimali. L'area
che si chiede è quella che danno i dati arrotondati, e i passaggi lo dicono ("L'apotema è arrotondato, e anche
l'area lo è"), come l'esempio 6.

Esempi:

- "Un triangolo equilatero ha il lato di $30$ cm e l'apotema di $8{,}66$ cm (arrotondato ai centesimi). Quanto
  misura l'area?" Risposta $389{,}7\ \text{cm}^2$; distrattori $129{,}9$ (un triangolo solo, senza il numero dei
  lati), $779{,}4$ (senza il diviso due), $259{,}8$ (lato per apotema).
- "In un triangolo equilatero l'apotema è circa $0{,}289$ volte il lato. Quanto misura l'area di un triangolo
  equilatero con il lato di $10$ cm?" Risposta $43{,}35\ \text{cm}^2$.

Distrattore della nota: lato per apotema senza il numero dei lati. In più il perimetro per l'apotema senza il
diviso due, il semiperimetro diviso ancora per due, il numero fisso usato come apotema.

## Livello 6: figure composte ed equivalenti

Tre casi, circa 1 su 3 ciascuno, con dati interi:

- somma, come l'esempio 7: il rettangolo $ABCD$ e un triangolo esterno con la base $DC$ (circa 3 su 5) o $BC$ e
  l'altezza data;
- differenza: dal rettangolo si toglie il triangolo $BCE$ con $E$ sul lato $DC$ (il triangolo è rettangolo in
  $C$, con i cateti $BC$ e $CE$), oppure il quadrato $CEFG$ nell'angolo $C$, con il lato minore di entrambi i lati
  del rettangolo;
- figure equivalenti, come l'esempio 8: una figura (triangolo, rettangolo, parallelogramma, rombo, quadrato) con
  una misura data è equivalente a un'altra di tipo diverso (rettangolo, quadrato, triangolo, rombo) con tutte le
  misure; si chiede la misura che manca, sempre intera.

Esempi:

- "Dal rettangolo $ABCD$, con $\overline{AB} = 6$ cm e $\overline{BC} = 11$ cm, si toglie il triangolo $BCE$, con $E$
  sul lato $DC$ e $\overline{CE} = 4$ cm. Quanto misura l'area della parte che resta?" Risposta
  $44\ \text{cm}^2$; distrattori $22$ (senza il diviso due), $88$ (il triangolo aggiunto).
- "Un triangolo con la base di $12$ cm è equivalente a un rombo con le diagonali di $18$ cm e di $4$ cm. Quanto
  misura l'altezza del triangolo relativa alla base?" Risposta $6$ cm; distrattori $3$ (senza il $2$), $12$.

Distrattori: il triangolo senza il diviso due, il triangolo sottratto al posto di aggiunto (e il contrario), l'altro
lato del rettangolo come base, il perimetro del quadrato tolto al posto dell'area; per le figure equivalenti la
formula dell'altra figura senza il diviso due, la metà e il doppio.

## Esercizi da evitare

- Un parallelogramma con l'altezza lunga quanto o più del lato obliquo, un triangolo con $CH \ge BC$, una base
  minore che non è minore.
- Un rettangolo che è un quadrato, un rombo con le diagonali uguali (dove la lezione non lo chiede), un rombo o un
  parallelogramma nascosti in un quadrato al livello 6.
- Un triangolo rettangolo con un'area troppo grande per la sua ipotenusa (non esiste) o uguale a $\frac{c^2}{4}$
  (il solo isoscele, un caso limite).
- Un apotema che non arrotonda quello vero, o un numero fisso sbagliato.
- Risposte con tre o più decimali, numeri come $15{,}606$; distrattori negativi, nulli o con più decimali della
  risposta.

## Verifica

`scripts/exercises/checkers/equivalenza_aree.py` rilegge ogni problema dal testo (non dai `params`), controlla che
ogni numero sia scritto nella forma della lezione (niente zeri finali, `\,` da cinque cifre), costruisce la figura
con coordinate esatte in SymPy e misura quello che si chiede:

- le aree sono aree di poligoni (`sympy.geometry.Polygon`), con il parallelogramma costruito dal lato obliquo e
  dall'altezza (che quindi deve essere più corta), il triangolo rettangolo dai cateti (e l'ipotenusa deve venire
  quella del testo), il trapezio, il rombo e il quadrato dalla diagonale su coordinate concrete;
- una misura dall'area è l'unica radice positiva di "area della figura con un'incognita = area data" (`solve`);
- le altezze del livello 4 sono distanze di un vertice da una retta, su una figura costruita dai dati (con tutte e
  due le posizioni del vertice, quando sono due: devono dare la stessa altezza); per "area e ipotenusa" si
  risolvono i cateti dal sistema e si controlla che il triangolo esista;
- le conversioni passano dai metri quadrati, con ogni unità un quadrato di lato $1$, $\frac{1}{10}$,
  $\frac{1}{100}$, $\frac{1}{1000}$ m;
- nei poligoni regolari l'apotema dato deve arrotondare ai centesimi quello vero ($\frac{\ell}{2} \cot \frac{\pi}{n}$),
  il numero fisso ai millesimi; l'area è la somma degli $n$ triangoli costruiti sui lati e deve stare entro lo
  $0{,}5\%$ dell'area vera del poligono (`RegularPolygon`).

Controlla anche la risposta, le quattro opzioni diverse come numeri (due scritture dello stesso numero sono la
stessa opzione), l'opzione giusta, il testo di ogni opzione con la sua unità, i decimali e la quota di ogni caso
(`CASE_RANGES` su tutti i livelli).

Esito: `sample.mts equivalenza-aree 1000 all 1` e `… 1000 all 50001`, 6.000 esercizi ciascuno, PASS. Tutte le
formule di problema, soluzione, passaggi e opzioni dei 6.000 esercizi del seed 1 passano da KaTeX.

### Errori piantati

129 su 129 bocciati:

- risposta cambiata di $1$ (livelli 1-6), e moltiplicata per $10$ (livello 2);
- opzione giusta spostata su un'altra, due opzioni uguali, lo stesso numero scritto come frazione non ridotta in
  un'altra opzione, un'opzione scritta con uno zero finale (livelli 1-6);
- un dato del testo cambiato con la risposta lasciata com'era (livelli 1-6);
- vincoli violati: altezza del parallelogramma più lunga del lato obliquo, ipotenusa sbagliata (livello 1); basi
  del trapezio in ordine inverso (livello 3); $CH$ più lunga di $BC$, un'area troppo grande per l'ipotenusa
  (livello 4); apotema spostato di un centesimo, numero fisso sbagliato (livello 5); $E$ fuori dal lato $DC$, un
  quadrato che non entra nel rettangolo (livello 6).

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 702 (740), livello 2 994 (991), livello 3 805 (820), livello 4 678
(634), livello 5 137 (137), livello 6 950 (950). Il livello 5 è stretto per costruzione: tre poligoni, i lati che
tengono l'area a due decimali e gli apotemi che non finiscono con uno zero.

## Livelli che vorrebbero una figura

Tutti si reggono sul testo. Il livello 4 guadagnerebbe molto dalla figura: le altezze $BK$ e $AK$ cadono su un
lato che non è la base, e nel triangolo possono cadere fuori (la lezione ha la figura dell'ottusangolo). Anche il
livello 6 (dove sta il triangolo aggiunto o tolto, dove sta il quadrato $CEFG$) e, come dice la nota, il livello 3
quando la figura è un trapezio o un rombo. I livelli 1, 2 e 5 non ne hanno bisogno.

## Domande per la revisione

- Livello 5: l'area chiesta è quella calcolata con l'apotema arrotondato ($389{,}7$), come nell'esempio 6. Va bene,
  o preferite chiedere l'area "arrotondata ai decimi" e accettare il valore vero?
- Livello 5: il numero fisso compare solo nell'`ad-note` della lezione. Se non volete i numeri fissi in tabella
  (domanda già aperta nella nota), il caso "numero fisso" va tolto.
- Perimetro con $P$ e area $\dfrac{P \cdot a}{2}$, come la lezione; se si passa a $2p$ e $A = p \cdot a$ vanno
  cambiati i passaggi del livello 5.
- Livello 2: le conversioni arrivano fino a tre passi ($\text{m}^2$ e $\text{mm}^2$) e a quattro decimali
  ($0{,}0424\ \text{cm}^2$). Troppo per il biennio?
- Livello 4: il triangolo rettangolo dall'area e dall'ipotenusa non è nella lezione (che dà sempre i cateti). È un
  passo in più accettabile?
- La lezione apre con l'equivalenza (figure equivalenti ma non congruenti, equiscomponibili, somme e differenze).
  Nessun livello la chiede come teoria: serve un livello di vero o falso ("Due figure equivalenti sono
  congruenti", "La formula $\frac{d_1 \cdot d_2}{2}$ vale per ogni quadrilatero")?
- Il livello 1 mette insieme sei figure, anche quelle che la lezione tratta dopo le conversioni: è l'ordine della
  nota, con le conversioni al livello 2. Va bene, o le conversioni vanno prima?
