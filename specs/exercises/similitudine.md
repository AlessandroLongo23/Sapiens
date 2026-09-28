# Similitudine

Generatore: `similitudine` (`src/lib/exercises/v2/generators/similitudine.ts`). Verifica indipendente:
`scripts/exercises/checkers/similitudine.py`. Lezione collegata: "Similitudine"
(`docs/lezioni/riscritte/103-similitudine.md`), con la nota `docs/lezioni/note/103-similitudine.md`
(sezione "Per il generatore").

Lo studente decide se due rettangoli sono simili e trova $k$, ricava la corrispondenza dei vertici da
due angoli, usa la parallela a un lato e l'ombra, riconosce il triangolo simile con il secondo e il
terzo criterio, trova i lati omologhi in un triangolo girato, divide le diagonali di un trapezio,
calcola perimetri e aree con $k$ e $k^2$, applica i teoremi di Euclide con le misure. Niente figure:
ogni esercizio si regge sul testo.

La nota propone nove livelli; qui sono otto, nell'ordine della lezione. Due proposte sono unite a
un'altra: l'ombra dell'albero (proposta 9) sta nel livello 3 con la parallela a un lato, perché è la
stessa proporzione $x : a = b : c$ tra due triangoli con un angolo in comune; la mappa in scala sta nel
livello 7 con perimetri e aree, perché il suo errore tipico è proprio l'area moltiplicata per $k$ e non
per $k^2$.

## Rappresentazione

- Il testo sta sempre nel `problem`, come righe `\text{...}` scritte con `textBlock`; il `prompt` è la
  consegna breve ("Risolvi il problema.", "Scegli la risposta giusta.", "Scegli l'affermazione vera.",
  "Scegli il triangolo simile.").
- Livelli 1, 2 e 4: risposta `choice` (quattro opzioni, la risposta è già la scelta multipla).
- Livelli 3, 5, 6 e 7: risposta `number` (razionale esatto in `answer.value`). Livello 8: `number`
  quando la misura è razionale, altrimenti `expression` con `form: 'simplified'` e il radicale ridotto
  ($3\sqrt{7}$).
- La variante `choice` scrive le opzioni come `6\text{ cm}`, `7{,}5\text{ m}`, `198\text{ cm}^2`,
  `17{,}5\text{ m}^2`, `2\sqrt{13}\text{ cm}`, e senza unità per $k$ (`0{,}25`, `\frac{5}{3}`).
- `params.case` dice il caso; `params.wrong` gli errori tipici da cui vengono le opzioni sbagliate;
  `params.unit` (`cm`, `cm2`, `m`, `m2` o vuota). Il controllo non legge i dati dai `params`: li
  rilegge dal testo.

## Regole comuni

- Notazione della lezione: $\overline{AB}$ per le misure, $AB$ nelle proporzioni tra segmenti,
  $\hat{A}$ per gli angoli, $\triangle ABC \sim \triangle FED$ con i vertici corrispondenti nello
  stesso ordine, $k$ come rapporto tra un lato del secondo poligono e il suo omologo nel primo,
  $2p$ per il perimetro e $\mathcal{A}$ per l'area, "ed" prima di $E$ come nella lezione.
- Virgola decimale `{,}`; le misure con più di quattro cifre hanno lo spazio delle migliaia
  (`26\,000`), come $25\,000$ nell'esempio 10 della lezione.
- Dati interi o con un decimale (due solo nell'ombra); risposte con al più due decimali, tranne $k$
  nel livello 7, che può essere una frazione come $\frac{5}{3}$ nell'esempio 7.
- Quando la risposta è un decimale finito, nessuna opzione è una frazione periodica.
- Opzioni con al più due decimali (un distrattore con tre decimali si scarta).

## Livello 1: rettangoli simili

"Il rettangolo $R_1$ ha i lati di $6$ cm e $4$ cm, il rettangolo $R_2$ di $6$ cm e $9$ cm. Sono simili?
Se lo sono, $k$ è il rapporto tra un lato di $R_2$ e il suo omologo in $R_1$." I lati di ciascun
rettangolo sono scritti in ordine casuale, così lo studente deve accoppiare il lungo con il lungo.
Metà simili, con $k$ tra $\frac{1}{2}$, $\frac{3}{4}$, $\frac{4}{3}$, $\frac{3}{2}$, $\frac{5}{3}$, $2$,
$\frac{5}{2}$, $3$; metà no, con lo stesso numero aggiunto ai due lati (l'errore "differenza") o con un
lato spostato di $1$ cm da un rettangolo simile. Lati interi, fino a $40$ cm, niente quadrati.

Opzioni: "simili, $k = \dots$" e "non simili". Distrattori (nota): i rapporti tra lati non omologhi
(lungo con corto), la differenza dei lati presa come $k$, $k$ capovolto; se i rettangoli non sono
simili, i due rapporti $\frac{c}{a}$ e $\frac{d}{b}$ presi uno alla volta.

Esempi: $6 \times 4$ e $9 \times 6$ → simili, $k = 1{,}5$ (esempio 1); $7 \times 6$ e $21 \times 17$ →
non simili ($21 \cdot 6 = 126 \neq 7 \cdot 17 = 119$).

## Livello 2: due angoli e i vertici corrispondenti

"Il triangolo $ABC$ ha $\hat{A} = 50^\circ$ e $\hat{B} = 70^\circ$; il triangolo $DEF$ ha $\hat{D} =
60^\circ$ ed $\hat{E} = 70^\circ$. Quale affermazione è vera?" Due angoli per triangolo, multipli di
$5^\circ$, almeno $20^\circ$, i tre angoli di ogni triangolo diversi (così la corrispondenza è unica).
Tre volte su quattro simili, con una corrispondenza mai alfabetica; una volta su quattro non simili,
con un solo angolo in comune (il tranello).

Opzioni: $\triangle ABC \sim \triangle XYZ$ per tre permutazioni e "non sono simili". Tra le opzioni c'è
sempre $\triangle ABC \sim \triangle DEF$ (l'ordine alfabetico, distrattore della nota); nei non simili
anche la corrispondenza che accoppia l'angolo comune.

Esempi: l'esempio 2 della lezione → $\triangle ABC \sim \triangle FED$; $\hat{B} = 30^\circ$,
$\hat{C} = 60^\circ$ e $\hat{D} = 70^\circ$, $\hat{F} = 30^\circ$ → non sono simili.

## Livello 3: parallela a un lato e ombre

Tre casi.

- "DE" (35%): "Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$.
  Sai che $\overline{AD} = 4$ cm, $\overline{DB} = 2$ cm e $\overline{BC} = 9$ cm. Quanto è lungo $DE$?"
  (esempio 3). Metà delle volte i dati sono sul lato $AC$ ($\overline{AE}$, $\overline{EC}$).
- "parte" (35%): dati $\overline{AD}$, $\overline{DE}$ e $\overline{BC}$, trovare $DB$ (o $EC$ con
  $\overline{AE}$).
- "ombra" (30%): "Un bastone verticale alto $1{,}5$ m fa un'ombra lunga $2$ m. Nello stesso momento
  l'ombra di un albero è lunga $10$ m. Quanto è alto l'albero?" (esempio 9); quattro volte su dieci al
  contrario, data l'altezza dell'oggetto (albero, lampione, campanile, torre) trovare la sua ombra.

Nei primi due casi $AD : AB = p : q$ con $q \le 5$ e tutti i dati interi fino a $30$ cm. Distrattori:
$AD : DB$ al posto di $AD : AB$ (il $18$ impossibile dell'esempio 3), $DB$ al posto di $AD$, la
proporzione capovolta, la differenza $BC - DB$; nel caso "parte" il lato intero al posto della parte e
$BC - DE$. Per l'ombra: il rapporto capovolto, la differenza aggiunta ($h + S - s$), il prodotto
diviso male.

## Livello 4: secondo e terzo criterio

Quale dei quattro triangoli è simile ad $ABC$, come nell'esempio 4. Metà con i tre lati ("Il triangolo
$ABC$ ha i lati $\overline{AB} = 4$ cm, $\overline{BC} = 6$ cm e $\overline{CA} = 8$ cm"), metà con un
angolo e i due lati che lo comprendono ("$\hat{A} = 40^\circ$, compreso tra i lati $\overline{AB} = 5$
cm e $\overline{CA} = 3$ cm"). $ABC$ e il triangolo giusto sono multipli dello stesso triangolo (lati
fino a $9$) con fattori diversi tra $1$ e $4$; lati fino a $36$ cm, angoli multipli di $5^\circ$ tra
$20^\circ$ e $150^\circ$.

Opzioni: "lati di $12$, $6$ e $9$ cm" (lati in ordine casuale) oppure "$40^\circ$ tra i lati di $10$ e
$6$ cm". Distrattori (nota: un rapporto su due o su tre uguale): il triangolo giusto con un lato
spostato di $1$ o $2$ cm; lo stesso numero aggiunto a tutti i lati di $ABC$; per il secondo criterio
anche l'angolo diverso di $10^\circ$ o $20^\circ$ con i lati giusti. Tutte le terne sono triangoli che
esistono, e uno solo è simile.

## Livello 5: lati omologhi

"Il triangolo $ABC$ ha $\overline{AB} = 6$ cm, $\overline{BC} = 8$ cm e $\overline{CA} = 5$ cm. Il
triangolo $DEF$ ha $\hat{E} \cong \hat{A}$, $\hat{F} \cong \hat{B}$ ed $\overline{EF} = 9$ cm. Quanto è
lungo $FD$?" (esempio 5). Triangolo scalene con lati interi da $3$ a $14$ cm; corrispondenza dei vertici
mai alfabetica; due angoli congruenti dati, il terzo si ricava; un lato di $DEF$ dato, un altro chiesto;
$k$ tra $\frac{1}{2}$, $\frac{3}{2}$, $2$, $\frac{5}{2}$, $3$. I lati di $DEF$ si chiamano $DE$, $EF$,
$FD$ come nella lezione.

Distrattori: i lati accoppiati per posizione ($DE$ con $AB$, $EF$ con $BC$, $FD$ con $CA$, l'avviso
"I lati omologhi non si scelgono dal disegno"), $k$ capovolto, il $k$ giusto sul lato non omologo.

## Livello 6: le diagonali del trapezio

"Nel trapezio $ABCD$ la base maggiore è $AB$ e la base minore è $CD$; le diagonali si incontrano in $O$.
Sai che $\overline{AB} = 12$ cm, $\overline{CD} = 8$ cm e che la diagonale $AC$ misura $15$ cm. Quanto è
lungo $AO$?" (esempio 6). Sette volte su dieci si chiede una parte di una diagonale ($AO$, $OC$, $BO$ o
$OD$); tre volte su dieci, date le due parti di una diagonale e una base, l'altra base. Basi nel
rapporto $p : q$ con $p \le 5$, base maggiore fino a $30$ cm, diagonale fino a $40$ cm e più lunga
della semisomma delle basi più $1$ (così il trapezio esiste anche isoscele).

Distrattori: l'altra parte (rapporto capovolto), metà diagonale, la diagonale meno una base; per la
base, il rapporto capovolto e la differenza delle parti aggiunta alla base nota.

## Livello 7: perimetri, aree e scale

Quattro casi, un quarto ciascuno.

- "perimetro": "I triangoli $ABC$ e $A'B'C'$ sono simili. Il lato $AB$ misura $4$ cm e il suo omologo
  $A'B'$ misura $6$ cm. Il perimetro di $ABC$ è $24$ cm. Quanto misura il perimetro di $A'B'C'$?".
  Distrattori: la differenza dei lati aggiunta al perimetro, $k$ capovolto, $k^2$.
- "area": come sopra con l'area. Distrattori (nota): l'area per $k$, $k^2$ capovolto, $k^3$.
- "aree": "Due triangoli simili $ABC$ e $A'B'C'$ hanno le aree di $50\ \text{cm}^2$ e $18\ \text{cm}^2$."
  Metà delle volte si chiede $k$ (esempio 7), metà il lato $A'B'$ dato $AB$. Il rapporto delle aree è
  un quadrato di $\frac{p}{q}$. Distrattori (nota): $k$ uguale al rapporto delle aree, $k$ capovolto,
  metà del rapporto delle aree.
- "mappa": "Su una pianta in scala $1 : 200$ un giardino è un rettangolo di $6{,}5$ cm per $10$ cm.
  Quanto misura l'area vera, in metri quadrati?" (esempio 10, con misure da pianta). Scale da $1 : 50$ a
  $1 : 2000$ secondo l'oggetto (stanza, giardino, parco). Distrattori (nota): l'area del disegno per
  il denominatore della scala e non per il suo quadrato; i $\text{cm}^2$ divisi per $100$ invece che
  per $10\,000$; un lato solo in scala.

## Livello 8: i teoremi di Euclide

"Il triangolo $ABC$ è rettangolo in $C$ e $CH$ è l'altezza relativa all'ipotenusa $AB$." Un terzo per
caso:

- "altezza": dati $\overline{AH}$ e $\overline{HB}$ (interi fino a $16$), $CH$; metà delle volte un
  intero come nell'esempio 8 ($4$ e $9$ → $6$ cm), metà un radicale ridotto ($5$ e $10$ →
  $5\sqrt{2}$ cm).
- "cateto": $AC$ o $BC$, dalle due proiezioni o dall'ipotenusa e dalla proiezione del cateto;
  il prodotto sotto radice fino a $300$.
- "proiezione": dati un cateto e l'ipotenusa, presi dalle terne $3$-$4$-$5$, $6$-$8$-$10$,
  $5$-$12$-$13$, $8$-$15$-$17$, $7$-$24$-$25$, $20$-$21$-$29$ scalate, la proiezione di quel cateto,
  con al più due decimali ($\overline{AC} = 8$, $\overline{AB} = 10$ → $\overline{AH} = 6{,}4$ cm).

Distrattori: il cateto con la proiezione dell'altro cateto (nota), l'altezza al posto del cateto e
viceversa, il quadrato senza radice, la media delle proiezioni; per la proiezione l'altra proiezione e
l'altro cateto.

## Da evitare

- Rettangoli quadrati o congruenti nel livello 1; $k = 1$ ovunque.
- Triangoli con due angoli uguali nei livelli 2 e 5 (la corrispondenza non sarebbe unica).
- La corrispondenza alfabetica come risposta giusta (livelli 2 e 5): il distrattore non ci sarebbe.
- Due triangoli simili tra le opzioni del livello 4, o una terna che non è un triangolo.
- Trapezi impossibili (diagonale troppo corta) nel livello 6.
- Radicali non ridotti, frazioni che sono decimali finiti, zeri finali, numeri di cinque cifre senza
  lo spazio delle migliaia.

## Variante a scelta multipla

Quattro opzioni distinte in valore e in LaTeX, una sola giusta. Per i livelli numerici la prima scelta
sono i distrattori elencati sopra; se coincidono con la risposta o tra loro, si completa con valori
vicini (un centimetro o mezzo; per i radicali il coefficiente più o meno uno). Livelli 1, 2 e 4: la
risposta è già a scelta.

## Figure

Nessun livello usa una figura. La nota ne chiede una per il livello 5 (il triangolo girato) e per il
livello 6 (il trapezio con le diagonali): qui il testo basta, ma lo studente deve disegnarsi da solo il
triangolo $DEF$ e il trapezio. Aiuterebbero anche il livello 3 (il triangolo con la parallela, il
bastone e l'albero) e il livello 8 (il triangolo rettangolo con l'altezza).

## Verifica

Il controllo Python rilegge i dati dalla prosa del problema e delle opzioni e ritrova la risposta con la
geometria, quasi sempre con coordinate esatte di SymPy: i rettangoli come poligoni scalati (livello 1);
i terzi angoli e la corrispondenza dagli angoli uguali (livello 2); il triangolo con la parallela
costruita come retta e tagliata con l'altro lato, il lato incognito con `solve`, il raggio del sole come
retta (livello 3); ogni opzione del livello 4 confrontata con $ABC$ (tre rapporti dei lati ordinati,
oppure lo stesso angolo e due lati in proporzione) e ogni terna controllata con la disuguaglianza
triangolare; $ABC$ costruito dai tre lati e $DEF$ come sua immagine con la corrispondenza letta dal
testo (livello 5); il trapezio con coordinate in due forme diverse e $O$ come incontro delle diagonali,
la base incognita con `solve` (livello 6); il triangolo con il lato e il perimetro o l'area dati,
scalato di $k$, e il rettangolo della pianta (livello 7); il vertice $C$ come intersezione della
circonferenza di diametro $AB$ con la perpendicolare in $H$ o con la circonferenza di raggio $AC$
(livello 8). Controlla anche la forma dei numeri (frazioni ridotte, niente zeri finali, radicali ridotti,
spazio delle migliaia), le unità delle opzioni, che le opzioni siano diverse come oggetti matematici
e che l'opzione giusta sia l'unica uguale alla risposta, le quote dei casi (`CASE_RANGES`).

- `sample.mts similitudine 1000 all 1 | verify.py`: PASS (8.000 esercizi).
- Stesso comando con seed di partenza 50001: PASS.
- Errori piantati, tutti bocciati: risposta cambiata (livelli 3 e 6), opzione giusta spostata
  (livello 1), una seconda opzione simile (livello 4), radicale non ridotto $\sqrt{264}$ (livello 8),
  radicale dato come numero (livello 8), zero finale $147{,}50$ (livello 7), unità $\text{cm}$ al posto
  di $\text{cm}^2$ (livello 7), angoli che superano $180^\circ$ (livello 2), corrispondenza degli angoli
  cambiata (livello 5), diagonale troppo corta per il trapezio (livello 6), `values` diversi dal LaTeX
  (livello 1), due opzioni uguali (livello 3), `params.case` sbagliato (livello 4); `num()` rifiuta
  `26000` e `1\,000`. Un campione buono di controllo passa.
- `width.mts`: esce con 0; nessuna formula del problema da misurare (è tutto prosa), opzioni al massimo
  210 px (livello 4, "$75^\circ$ tra i lati di $28$ e $19$ cm").
- `review.mts` esce con 0; `tsc` ed `eslint` puliti sul generatore.

Esercizi diversi su 1.000 (seed da 1), contando il problema; tra parentesi contando anche le opzioni:

| Livello | Diversi |
|---|---|
| 1 | 819 (989) |
| 2 | 975 (1000) |
| 3 | 844 (992) |
| 4 | 820 (1000) |
| 5 | 999 (1000) |
| 6 | 777 (984) |
| 7 | 902 (998) |
| 8 | 445 (883) |

Il livello 8 ha meno testi diversi perché i triangoli rettangoli con proiezione decimale corta vengono
da poche terne pitagoriche.

## Domande per la revisione

- Livello 1: il verso di $k$ ("lato di $R_2$ diviso il suo omologo in $R_1$") è quello fissato dalla
  lezione; tra i distrattori c'è $k$ capovolto. Se il libro non fissa il verso, quel distrattore va tolto
  o va accettato anche $\frac{1}{k}$.
- Livello 2: una volta su quattro i triangoli hanno un solo angolo in comune e la risposta è "non sono
  simili". È giusto chiederlo qui, o il livello deve restare sulla sola corrispondenza dei vertici?
- Livello 3: l'ombra è unita alla parallela a un lato (la nota le teneva separate). Va bene, o l'ombra
  merita un livello suo con la mappa?
- Livello 4: le opzioni danno solo i lati (o un angolo e due lati), senza nomi dei vertici. Serve dare
  i nomi, come nell'esempio 4 della lezione ($DEF$, $GHK$)?
- Livello 5 e 6: la nota voleva una figura (il triangolo girato, il trapezio). Il testo basta, ma lo
  studente deve disegnarli da sé: è accettabile per la beta?
- Livello 7: il caso "mappa" chiede l'area in metri quadrati, con la conversione da centimetri. È un
  passaggio in più che la lezione fa in chilometri; va bene così, o meglio chiedere solo le misure vere
  dei lati?
- Livello 8: la proiezione esce spesso decimale ($6{,}4$ cm). Va bene, o si preferiscono solo terne che
  danno interi?
