# Poligoni inscritti e circoscritti

Generatore: `poligoni-inscritti` (`src/lib/exercises/v2/generators/poligoni-inscritti.ts`). Verifica
indipendente: `scripts/exercises/checkers/poligoni_inscritti.py`. Lezione collegata: "Poligoni inscritti
e circoscritti" (`docs/lezioni/riscritte/97-poligoni-inscritti.md`), con la nota
`docs/lezioni/note/97-poligoni-inscritti.md` (sezione "Per il generatore").

Sette livelli. La nota ne propone otto; qui il triangolo rettangolo (proposta 7) e il trapezio isoscele
circoscritto (proposta 8) stanno in un livello solo, l'ultimo, perché sono lo stesso passo in più: un
raggio trovato con il teorema di Pitagora. L'ordine segue la nota, che mette il triangolo in fondo
anche se nella lezione viene per primo: con il raggio della circonferenza inscritta è l'esempio più
difficile. Niente figure: ogni esercizio si regge sul testo, come quelli del primo anno.

## Tipi di risposta

- Livelli 1, 3, 5, 7: `number` (un angolo in gradi, una lunghezza in cm, un numero di lati), razionale
  esatto in `answer.value`. La variante `choice` scrive le opzioni `80^\circ`, `46\text{ cm}`,
  `18{,}5\text{ cm}`, `8\text{ lati}`.
- Livello 6: `expression` con `form: 'simplified'`: un radicale ridotto (`3\sqrt{3}`,
  `\frac{5\sqrt{2}}{2}`), in `value` nella forma di SymPy (`3*sqrt(3)`, `5*sqrt(2)/2`). Opzioni come
  `6\sqrt{3}\text{ cm}`; tra i distrattori ci possono essere anche numeri interi.
- Livelli 2 e 4: `choice` con quattro opzioni, che è la risposta stessa.
- `params.case` dice il caso, `params.unit` l'unità (`deg`, `cm`, `lati`), `params.wrong` gli errori tipici
  da cui vengono le opzioni sbagliate. Il controllo non legge i dati dai `params`: li rilegge dal testo.

## Regole comuni

- Notazioni della lezione: angoli $\hat{A}$, misure dei lati $\overline{AB} = 9$ cm, lato $\ell$, apotema
  $a$, raggio $r$ del poligono regolare; nel triangolo rettangolo $R$ (circoscritta) e $r$ (inscritta),
  come nell'esempio 1; virgola decimale `{,}`; "inscritto in", "circoscritto a", "inscrivibile",
  "circoscrivibile".
- Quadrilateri convessi, con i vertici nell'ordine $ABCD$ (lati $AB$, $BC$, $CD$, $DA$).
- Numeri costruiti dalla risposta; nessun dato incoerente: angoli di un quadrilatero con somma
  $360^\circ$ e minori di $180^\circ$, lati di un quadrilatero circoscritto con $AB + CD = BC + DA$, cateti
  più corti dell'ipotenusa, basi del trapezio che danno lati obliqui e altezza interi.
- Radicali ridotti: radicando senza fattori quadrati, frazione ridotta.
- Le opzioni sono diverse come numeri (non solo come scritte), positive, e gli angoli minori di
  $180^\circ$.
- Con seed consecutivi la prima estrazione di `rng.ts` non è uniforme: il generatore la scarta.

## Livello 1: gli angoli del quadrilatero inscritto

Due casi.

- "consecutivi", 65 per cento: "Il quadrilatero $ABCD$ è inscritto in una circonferenza, con $\hat{A} =
  75^\circ$ e $\hat{B} = 100^\circ$. Quanto misura $\hat{C}$?". Due angoli consecutivi (qualsiasi coppia:
  $A$ e $B$, $B$ e $C$, $C$ e $D$, $D$ e $A$), multipli di $5^\circ$ tra $50^\circ$ e $130^\circ$, diversi,
  diversi da $90^\circ$ e con somma diversa da $180^\circ$ (altrimenti la risposta coinciderebbe con un
  dato o con il distrattore). Chiesto uno dei due angoli non dati: il supplementare del suo opposto.
- "differenza", 35 per cento: "Il quadrilatero $ABCD$ è inscritto in una circonferenza, e l'angolo
  $\hat{A}$ supera di $40^\circ$ l'angolo $\hat{C}$. Quanto misura $\hat{C}$?". Due angoli opposti,
  differenza multipla di $10^\circ$ tra $10^\circ$ e $100^\circ$; chiesto il maggiore o il minore:
  $(180^\circ \pm d) : 2$.

Esempi: $\hat{A} = 75^\circ$, $\hat{B} = 100^\circ$, chiesto $\hat{C}$ → $105^\circ$ (esempio 2a);
$\hat{C} = 70^\circ$, $\hat{D} = 100^\circ$, chiesto $\hat{B}$ → $80^\circ$; $\hat{B}$ supera $\hat{D}$ di
$40^\circ$, chiesto $\hat{B}$ → $110^\circ$.

Distrattori: il supplementare dell'angolo consecutivo (riquadro "Angoli opposti, non consecutivi"), la
somma dei due angoli mancanti, l'angolo opposto stesso (angoli opposti congruenti, come nel
parallelogramma), l'altro dato. Nel caso "differenza": l'altro angolo della coppia, $180^\circ - d$,
$90^\circ$, $d$.

## Livello 2: riconoscere il quadrilatero inscrivibile

"Di quattro quadrilateri convessi $ABCD$ sono dati gli angoli $\hat{A}$, $\hat{B}$, $\hat{C}$, $\hat{D}$,
in quest'ordine. Quale è inscrivibile in una circonferenza?" (60 per cento, caso "inscrivibile")
oppure "Quale non è inscrivibile…" (40 per cento, caso "non inscrivibile"). Ogni opzione è una
quaterna come `80^\circ,\ 95^\circ,\ 100^\circ,\ 85^\circ`, con angoli multipli di $5^\circ$ tra
$45^\circ$ e $135^\circ$ e somma $360^\circ$ (così il quadrilatero convesso esiste sempre).

- Caso "inscrivibile": una quaterna con $\hat{A} + \hat{C} = 180^\circ$ (non il quadrato) e tre senza:
  un parallelogramma ($\hat{A} = \hat{C}$, consecutivi supplementari), una con i soli consecutivi
  supplementari ($\hat{A} + \hat{B} = 180^\circ$, $\hat{C} + \hat{D} = 180^\circ$, $\hat{A} \neq \hat{C}$),
  una qualsiasi. Tutte hanno somma $360^\circ$: è il distrattore della nota ("sì perché la somma è
  $360^\circ$").
- Caso "non inscrivibile": tre quaterne inscrivibili e una non inscrivibile di uno dei tre tipi.

Esempi: $80^\circ, 95^\circ, 100^\circ, 85^\circ$ è inscrivibile (esempio 2b); $125^\circ, 55^\circ,
125^\circ, 55^\circ$ no (parallelogramma); $75^\circ, 105^\circ, 60^\circ, 120^\circ$ no (consecutivi
supplementari).

## Livello 3: il quadrilatero circoscritto

Lati interi da $3$ a $20$ cm con $\overline{AB} + \overline{CD} = \overline{BC} + \overline{DA}$, non tutti
uguali (niente rombo).

- "lato", 60 per cento: tre lati dati, chiesto il quarto (qualsiasi dei quattro). "Il quadrilatero
  $ABCD$ è circoscritto a una circonferenza, con $\overline{AB} = 9$ cm, $\overline{BC} = 7$ cm e
  $\overline{CD} = 6$ cm. Quanto misura il lato $DA$?" → $8$ cm (esempio 3).
- "perimetro", 40 per cento: metà delle volte due lati opposti dati, metà delle volte tre lati; chiesto il
  perimetro, il doppio della somma di due lati opposti.

Esempi: $\overline{AB} = 8$, $\overline{CD} = 12$ → $2p = 40$ cm; $\overline{AB} = 3$, $\overline{BC} =
12$, $\overline{DA} = 11$ → $2p = 46$ cm.

Distrattori del lato: i lati consecutivi messi in coppia, nei due modi (riquadro "Lati opposti, non
consecutivi": $9 + 7 = 6 + x$ dà $10$), il lato opposto, la somma dei tre lati. Del perimetro: la somma
dei due lati opposti non raddoppiata, la somma più uno dei due lati, quattro volte un lato; con tre lati,
la somma dei tre, il perimetro con il quarto lato sbagliato.

## Livello 4: quali quadrilateri sono inscrivibili o circoscrivibili

Cinque domande sulla tabella della lezione, un quinto ciascuna: "Quale di questi quadrilateri…"

| Caso | Domanda | Risposta giusta (una) | Distrattori (tre) |
|---|---|---|---|
| sempre inscrivibile | è sempre inscrivibile in una circonferenza? | rettangolo, quadrato, trapezio isoscele | rombo, parallelogramma qualsiasi, trapezio rettangolo, trapezio non isoscele |
| sempre circoscrivibile | è sempre circoscrivibile a una circonferenza? | rombo, quadrato | rettangolo, trapezio isoscele, parallelogramma qualsiasi, trapezio rettangolo |
| sempre entrambi | è sempre sia inscrivibile sia circoscrivibile? | quadrato | rettangolo, rombo, trapezio isoscele, parallelogramma qualsiasi |
| mai inscrivibile | non è mai inscrivibile in una circonferenza? | trapezio rettangolo, trapezio non isoscele, rombo che non è un quadrato | rettangolo, quadrato, trapezio isoscele |
| mai circoscrivibile | non è mai circoscrivibile a una circonferenza? | rettangolo che non è un quadrato, parallelogramma che non è un rombo | rombo, quadrato, trapezio isoscele, trapezio rettangolo |

Un distrattore non è mai la stessa famiglia della risposta con una condizione in più o in meno
(niente "rettangolo" accanto a "rettangolo che non è un quadrato"). I distrattori sono quelli della nota: rombo inscrivibile, rettangolo circoscrivibile, trapezio qualsiasi
inscrivibile. Il controllo non copia la tabella: disegna ogni famiglia su una griglia di misure e angoli
e prova se i quattro vertici stanno su una circonferenza e se le bisettrici in $A$ e $B$ si incontrano in
un punto equidistante dai quattro lati.

## Livello 5: angolo al centro ed esagono

- "angolo al centro", 40 per cento: "Quanto misura l'angolo al centro di un ottagono regolare?" → $45^\circ$.
  $n$ tra $3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36$ (angolo intero); con il nome per $3$, $4$, $5$,
  $6$, $8$, $10$, $12$, altrimenti "un poligono regolare di $n$ lati".
- "numero di lati", 30 per cento: "L'angolo al centro di un poligono regolare misura $40^\circ$. Quanti
  lati ha il poligono?" → $9$ lati ($n \geq 5$).
- "esagono", 30 per cento: dal raggio $r$ (da $2$ a $20$ cm) il perimetro $6r$ (esempio 5a), oppure dal
  perimetro il raggio.

Distrattori: l'angolo interno $(n - 2) \cdot 180^\circ : n$ (quello della nota), $180^\circ : n$, il doppio e
la metà dell'angolo al centro; per $n$: $n : 2$, $2n$, $n \pm 2$; per l'esagono il lato preso uguale al
diametro ($12r$, $r : 2$) o alla metà del raggio, il perimetro diviso per $2$, $3$ o $4$.

## Livello 6: apotema e lato con i radicali

- "esagono", 40 per cento: l'apotema dell'esagono regolare dal lato $\ell$ pari (da $2$ a $20$ cm), tre
  volte su dieci dato come raggio della circonferenza circoscritta: $a = \frac{\ell}{2}\sqrt{3}$ (esempio
  5b, $\ell = 6$ → $3\sqrt{3}$).
- "lato del quadrato", 30 per cento: quadrato inscritto in una circonferenza di raggio $r$ (da $2$ a $15$
  cm), lato $r\sqrt{2}$ (esempio 6, $r = 5$ → $5\sqrt{2}$).
- "apotema del quadrato", 30 per cento: stesso quadrato, apotema $\frac{r\sqrt{2}}{2}$ (esempio 6:
  $\frac{5\sqrt{2}}{2}$; con $r$ pari diventa $\frac{r}{2}\sqrt{2}$, per esempio $3\sqrt{2}$).

Distrattori: apotema uguale al raggio (quello della nota, riquadro "Raggio e apotema scambiati"),
$\ell\sqrt{3}$ senza la metà, $\frac{\ell}{2}\sqrt{5}$ (i quadrati sommati e non sottratti),
$\frac{\ell}{2}\sqrt{2}$; per il quadrato la diagonale presa per il lato ($2r$), il lato uguale al raggio
(come nell'esagono), l'apotema al posto del lato e viceversa, $r : 2$, $\frac{r\sqrt{3}}{2}$.

## Livello 7: i raggi con il teorema di Pitagora

- "R triangolo" e "r triangolo", 25 per cento ciascuno: "Il triangolo $ABC$ è rettangolo in $C$, con i
  cateti $\overline{AC} = 6$ cm e $\overline{BC} = 8$ cm. Quanto misura il raggio della circonferenza
  inscritta?" (esempio 1). Lati da una terna pitagorica ($3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$;
  $20, 21, 29$; $12, 35, 37$; $9, 40, 41$) per un fattore intero, ipotenusa fino a $50$ cm. Tre volte su
  dieci i dati sono un cateto e l'ipotenusa. $R$ è metà dell'ipotenusa (può finire in $,5$), $r =
  (a + b - c) : 2$ con i segmenti di tangente, sempre intero.
- "trapezio", 50 per cento: "Un trapezio isoscele è circoscritto a una circonferenza, e le basi misurano
  $18$ cm e $8$ cm. Quanto misura il raggio della circonferenza?" (esempio 4). Chiesti i lati obliqui,
  l'altezza o il raggio. Basi $B > b$ con $B \cdot b$ quadrato perfetto e $B + b$ pari, $B \leq 40$, $b
  \geq 2$: lati obliqui $(B + b) : 2$, altezza $\sqrt{B \cdot b}$ intera, raggio metà dell'altezza.

Distrattori: per $R$ l'ipotenusa intera come raggio (quello della nota), metà della somma dei cateti,
metà di un cateto; per $r$ il raggio $R$, l'equazione dei segmenti di tangente non divisa per $2$, la
metà di $r$. Per il trapezio l'altezza uguale al lato obliquo (quello della nota), la proiezione
$(B - b) : 2$, la somma delle basi non divisa, l'altezza presa per raggio, metà del lato obliquo.

## Da evitare

- Nel livello 1, angoli dati con somma $180^\circ$ o di $90^\circ$ (la risposta coinciderebbe con un dato).
- Nel livello 2, due quaterne uguali, o il quadrato ($90^\circ$ quattro volte).
- Nel livello 3, un lato mancante che esce da $3..20$, e il rombo.
- Nel livello 5, angoli al centro non interi ($n = 7, 11, \ldots$).
- Radicali non ridotti nella risposta e nelle opzioni ($\sqrt{27}$ al posto di $3\sqrt{3}$).

## Domande per la revisione

- Livelli: la nota ne propone otto, qui sono sette, con triangolo rettangolo e trapezio isoscele
  circoscritto nell'ultimo livello. Meglio separarli, come nella nota?
- L'ordine dei livelli segue la nota (il triangolo in fondo), non la lezione, dove il triangolo è la
  prima sezione. Va bene così?
- Livello 6: la risposta è un radicale da scrivere ($3\sqrt{3}$). Si chiede anche il valore approssimato,
  come nella lezione ($\approx 5{,}20$ cm), o basta la forma esatta?
- Livello 6, quadrato con $r$ dispari: la risposta è $\frac{5\sqrt{2}}{2}$, come nell'esempio 6. Con $r$
  pari il generatore scrive $3\sqrt{2}$ e non $\frac{6\sqrt{2}}{2}$: va bene che lo studente debba
  semplificare?
- Livello 7: $R$ e $r$ per i due raggi del triangolo (esempio 1), $r$ e $a$ per il poligono regolare (livelli
  5 e 6). È la stessa doppia notazione della lezione, già segnalata nelle sue note.
- Livello 4: "trapezio rettangolo" e "trapezio non isoscele" sono entrambi "mai inscrivibili"; non
  compaiono mai insieme come giusto e distrattore, ma possono comparire insieme come distrattori della
  domanda "sempre inscrivibile". I libri usano "trapezio scaleno"?
- Livello 4, domanda "sempre entrambi": la risposta è sempre il quadrato, quindi si impara a memoria.
  Si toglie, o si aggiunge un caso "inscrivibile ma non sempre circoscrivibile"?
- Livelli che vorrebbero una figura: 1 (il quadrilatero inscritto con gli angoli), 3 (il quadrilatero
  circoscritto con i segmenti di tangente), 6 (esagono con l'apotema, quadrato con la diagonale), 7
  (triangolo con le due circonferenze, trapezio con l'altezza), come dice la nota.
