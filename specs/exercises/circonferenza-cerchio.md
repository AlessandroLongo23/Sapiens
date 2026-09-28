# Circonferenza e cerchio

Generatore: `circonferenza-cerchio` (`src/lib/exercises/v2/generators/circonferenza-cerchio.ts`).
Verifica indipendente: `scripts/exercises/checkers/circonferenza_cerchio.py`. Lezione collegata:
"Circonferenza e cerchio" (`docs/lezioni/riscritte/96-circonferenza-cerchio.md`), con la nota
`docs/lezioni/note/96-circonferenza-cerchio.md` (sezione "Per il generatore").

Sette livelli, uno per ciascuna proposta della nota e nell'ordine della lezione: punti interni ed esterni,
retta e circonferenza, due circonferenze, corda e distanza dal centro, angoli al centro e alla
circonferenza, tangenti da un punto esterno, triangolo inscritto in una semicirconferenza. Niente figure:
ogni esercizio si regge sul testo (vedi "Livelli che vorrebbero una figura").

## Tipi di risposta

- Livelli 1, 2 e 3: `choice`, quattro opzioni; la risposta è già la scelta multipla.
- Livelli 4-7: `number`, una lunghezza in centimetri (intera o con il mezzo centimetro) o un angolo in
  gradi interi. La variante `choice` (`toChoice`) ha quattro opzioni scritte `12\text{ cm}`,
  `12{,}5\text{ cm}`, `2\sqrt{34}\text{ cm}` o `145^\circ`.
- `params.case` dice il caso del livello; `params.wrong` gli errori tipici da cui vengono le opzioni
  sbagliate; `params.unit` è `cm` o `deg`. Il controllo non legge i dati dai `params`: li rilegge dal testo.

## Regole comuni

- Notazione della lezione: centro $O$, raggio $r$, misure con il soprassegno ($\overline{OA} = 3$ cm),
  angoli $\widehat{AOB}$ e $\hat{A}$, virgola decimale `{,}`, gradi con `^\circ`. Il diametro non ha una
  lettera, come nella lezione.
- Il testo sta in righe `\text{…}` scritte con `textBlock`, con le formule tra `$…$`. Ai livelli 1 e 2 i
  dati sono una riga di formule separate da `\quad` sotto la domanda (la pagina la mostra come riga di
  dati).
- Numeri costruiti dalla risposta: prima la posizione o la misura, poi i dati. Le lunghezze dei livelli
  4, 6 e 7 vengono da terne pitagoriche ($3, 4, 5$ anche per mezzi, $5, 12, 13$; $8, 15, 17$; $7, 24, 25$;
  $20, 21, 29$; $12, 35, 37$; $9, 40, 41$), quindi ogni risposta è intera o con il mezzo centimetro.
- Passaggi in italiano, con le proprietà dette come nella lezione ("La perpendicolare dal centro alla
  corda la divide a metà", "Le tangenti sono perpendicolari ai raggi nei punti di contatto").
- Niente trattini lunghi e niente "piuttosto che" nei testi (il `check()` lo controlla).

## Livello 1: punti interni ed esterni

"Una circonferenza di centro $O$ ha raggio $8{,}5$ cm. Quale di questi punti è esterno alla
circonferenza?", con la riga $\overline{OA} = 6$ cm, $\overline{OB} = 9{,}5$ cm, $\overline{OC} = 5$ cm,
$\overline{OD} = 8{,}5$ cm. Opzioni: i quattro punti. Un terzo delle volte si chiede il punto interno, un
terzo quello sulla circonferenza, un terzo quello esterno; un solo punto sta nella posizione chiesta, e
fra gli altri tre ci sono sempre le altre due posizioni.

Metà delle volte il testo dà il diametro (da 4 a 24 cm) al posto del raggio, e c'è una trappola per chi
confronta le distanze con il diametro: se si chiede il punto sulla circonferenza, un punto esterno dista
dal centro quanto il diametro; se si chiede il punto interno, un punto esterno ha distanza tra il raggio e
il diametro. Distanze a mezzi centimetri, tutte diverse.

Esempi: raggio $8{,}5$ cm, distanze $6$, $9{,}5$, $5$, $8{,}5$ cm, esterno → $B$; diametro $17$ cm,
distanze $1$, $4{,}5$, $17$, $8{,}5$ cm, sulla circonferenza → $D$ (la trappola è $C$, a $17$ cm).

Nota: la proposta della nota era un punto solo con tre risposte (interno, sulla circonferenza, esterno).
Con quattro punti le opzioni sono quattro come negli altri generatori, e il distrattore "interno ed
esterno scambiati" c'è sempre, perché fra i punti ci sono tutte e tre le posizioni.

## Livello 2: retta e circonferenza

Come il livello 1 con quattro rette $s$, $t$, $u$, $v$ e le loro distanze $d_s$, $d_t$, $d_u$, $d_v$ dal
centro: "Quale retta è secante (tangente, esterna) alla circonferenza?". Stesse quote, stessa trappola del
diametro (per la tangente, una retta a distanza uguale al diametro; per la secante, una retta a distanza
tra il raggio e il diametro).

Esempi: raggio $8{,}5$ cm, $d_t = 9{,}5$ cm → esterna $t$; diametro $17$ cm, $d_u = 17$ cm e
$d_v = 8{,}5$ cm → tangente $v$.

Il distrattore della nota ("tangente" con $d < r$) è una delle rette secanti fra le opzioni.

## Livello 3: due circonferenze

"Due circonferenze hanno raggi $7$ cm e $3$ cm, e i loro centri distano $12$ cm. Come sono le due
circonferenze?". Le cinque posizioni della tabella della lezione, un quinto ciascuna: esterne, tangenti
esternamente, secanti, tangenti internamente, una interna all'altra. Raggi diversi (il minore da 1 a 10
cm, la differenza da 1 a 8 cm, a volte con il mezzo), somma dei raggi al massimo 25 cm, raggi scritti in
ordine casuale. Nel caso "una interna all'altra", una volta su cinque le circonferenze sono concentriche
("hanno lo stesso centro"), il caso particolare $d = 0$ della lezione.

Opzioni: la giusta e tre delle altre quattro posizioni, scelte in quest'ordine: per "una interna
all'altra" prima "secanti" (chi confronta solo con la somma, riquadro "Confrontare solo con la somma") e
poi "esterne"; per "esterne" prima "una interna all'altra"; per le tangenti prima l'altra tangenza.

Esempi: raggi $3$ e $4$ cm, $d = 1$ cm → tangenti internamente; raggi $11$ e $6{,}5$ cm, $d = 5{,}5$ cm →
secanti.

## Livello 4: corda, distanza e raggio

Tre casi, un terzo ciascuno, nel triangolo $OHB$ rettangolo in $H$ dell'esempio 1 della lezione:

- la corda dal raggio e dalla distanza: "Una circonferenza di centro $O$ ha raggio $13$ cm, e la corda
  $AB$ ha distanza $5$ cm dal centro. Quanto è lunga la corda $AB$?" → $24$ cm;
- la distanza dal raggio e dalla corda: "raggio $25$ cm, corda $PQ$ lunga $30$ cm" → $20$ cm;
- il raggio dalla corda e dalla distanza: "corda $PQ$ lunga $16$ cm, distanza $15$ cm" → $17$ cm.

Raggio al massimo 45 cm; la terna $3, 4, 5$ anche moltiplicata per un numero con il mezzo ($4{,}5$, $6$,
$7{,}5$). Corda $AB$, $CD$, $MN$ o $PQ$. Il caso del raggio non è nella nota: è il terzo verso dello
stesso triangolo, e serve a non far imparare a memoria "si sottrae".

Distrattori (riquadro "La corda intera nel triangolo rettangolo"): per la corda, la metà corda, i
quadrati sommati ($2\sqrt{r^2 + d^2}$), $2(r - d)$, il diametro; per la distanza, la corda intera nel
triangolo ($\sqrt{r^2 - c^2}$, solo se la corda è più corta del raggio), $r$ meno la metà corda, la metà
corda, il doppio della distanza; per il raggio, la corda intera nel triangolo ($\sqrt{c^2 + d^2}$), il
diametro, la metà corda più la distanza, la corda. I radicali sono ridotti ($18\sqrt{41}$) e si usano solo
con radicando fino a 99 e coefficiente intero.

## Livello 5: angoli al centro e alla circonferenza

Quattro casi, un quarto ciascuno:

- dal centro: "L'angolo al centro $\widehat{AOB}$ misura $28^\circ$. Quanto misura l'angolo alla
  circonferenza $\widehat{AVB}$ che insiste sullo stesso arco?" → $14^\circ$ (angolo al centro pari, da
  $20^\circ$ a $170^\circ$);
- dalla circonferenza: "L'angolo alla circonferenza $\widehat{AVB}$ misura $15^\circ$. Quanto misura
  l'angolo al centro corrispondente?" → $30^\circ$ (angolo da $10^\circ$ a $88^\circ$);
- ottuso, come l'esempio 5: stesso testo con l'angolo alla circonferenza ottuso, multiplo di $5^\circ$ da
  $95^\circ$ a $175^\circ$ → l'angolo al centro concavo, $95^\circ$ → $190^\circ$;
- vertice sull'arco minore, l'ultima riga dell'esempio 5 al contrario: "L'angolo al centro convesso
  $\widehat{AOB}$ misura $70^\circ$, e il punto $V$ sta sull'arco minore $AB$. Quanto misura l'angolo alla
  circonferenza $\widehat{AVB}$?" → $145^\circ$.

Distrattori (riquadro "Il doppio e la metà scambiati"): il doppio al posto della metà e viceversa; per
l'ottuso l'angolo convesso ($360^\circ - 2y$); il supplementare; per il vertice sull'arco minore la metà
dell'angolo convesso. Opzioni sotto $360^\circ$, intere.

## Livello 6: le tangenti da un punto esterno

Quattro casi, un quarto ciascuno, con "Da un punto $P$ esterno a una circonferenza di centro $O$ si
conducono le tangenti $PA$ e $PB$":

- l'angolo tra i raggi dall'angolo tra le tangenti (esempio 2): $\widehat{APB} = 28^\circ$ →
  $\widehat{AOB} = 152^\circ$;
- l'angolo tra le tangenti dall'angolo tra i raggi: $\widehat{AOB} = 30^\circ$ → $\widehat{APB} =
  150^\circ$;
- con la bisettrice: $\widehat{APB} = 20^\circ$ → $\widehat{AOP} = 80^\circ$ ($OP$ bisettrice, poi il
  triangolo $OAP$ rettangolo in $A$);
- il segmento di tangente (seconda parte dell'esempio 2): raggio $8$ cm e $\overline{OP} = 17$ cm →
  $\overline{PA} = 15$ cm; due volte su tre si chiede $PA$, una volta su tre $\overline{OP}$ dato $PA$.

Angoli dati pari, da $20^\circ$ a $160^\circ$. Distrattori: $360^\circ$ meno l'angolo (i due angoli retti
dimenticati, come dice la nota), l'angolo dato, la metà; per la bisettrice $\widehat{AOB}$ intero e
$\widehat{APO}$; per il segmento i quadrati sommati o sottratti al contrario, la differenza delle
lunghezze, il doppio.

## Livello 7: il triangolo nella semicirconferenza

Tre casi, un terzo ciascuno; il diametro è uno dei tre lati di $ABC$ ($AB$, $BC$ o $AC$), e l'angolo
retto sta nel terzo vertice:

- l'angolo acuto mancante (esempio 4c): "Il triangolo $ABC$ è inscritto in una circonferenza e il lato
  $AB$ è un diametro. Se $\hat{B} = 68^\circ$, quanto misura $\hat{A}$?" → $22^\circ$ (angolo dato da
  $10^\circ$ a $80^\circ$, mai $45^\circ$);
- un cateto dal diametro e dall'altro cateto (esempio 6): diametro $\overline{BC} = 37$ cm,
  $\overline{AC} = 12$ cm → $\overline{AB} = 35$ cm; due volte su cinque il testo dà il raggio ($13$ cm) e
  il diametro va trovato;
- il raggio dai due cateti: $\overline{AB} = 24$ cm, $\overline{AC} = 7$ cm, diametro $BC$ → $r = 12{,}5$
  cm.

Distrattori (riquadro "Il lato opposto all'angolo retto"): $\sqrt{D^2 + c^2}$, con il diametro trattato
come cateto; la differenza $D - c$; con il raggio dato, il raggio come ipotenusa; il diametro. Per
l'angolo: l'angolo dato, $180^\circ - a$ (l'angolo retto dimenticato), $180^\circ - 2a$. Per il raggio: il
diametro, la semisomma e la somma dei cateti.

## Da evitare

- Due oggetti nella posizione chiesta ai livelli 1 e 2; distanze uguali; raggi uguali al livello 3.
- Una corda lunga quanto il diametro o più; un punto $P$ interno al livello 6; un cateto più lungo del
  diametro al livello 7.
- Un angolo alla circonferenza retto al livello 5 (lo tratta il livello 7), un angolo al centro concavo
  dato come dato.
- Opzioni con radicali non ridotti, con radicando oltre 99 o con coefficiente frazionario; lunghezze con
  più di un decimale; opzioni di angoli oltre $360^\circ$.

## Variante a scelta multipla

Quattro opzioni distinte in valore e in LaTeX, una sola giusta. Per i livelli numerici la prima scelta
sono i distrattori elencati sopra; se coincidono con la risposta, tra loro o non si scrivono bene, si
completa con valori vicini (un centimetro, mezzo centimetro se la risposta ha il mezzo, dieci gradi). Su
1.000 esercizi le opzioni di riserva servono 29 volte al livello 5, 12 al livello 6 e 116 al livello 7
(tutte nel caso del cateto, dove $\sqrt{D^2 + c^2}$ ha spesso un radicando oltre 99 o un coefficiente
frazionario e resta fuori); mai al livello 4.

## Livelli che vorrebbero una figura

La nota chiede una figura per i livelli 4, 5, 6 e 7, generata con le regole di `figs.py`. Il testo basta
in tutti, ma allo studente tocca disegnare: al livello 4 il triangolo $OHB$ con la metà corda, al livello
5 dove sta $V$ (soprattutto nei casi "ottuso" e "vertice sull'arco minore", dove la figura dice quale arco
e quale angolo al centro), al livello 6 il quadrilatero $OAPB$, al livello 7 il diametro come ipotenusa.
Anche il livello 3 guadagnerebbe dalla figura nella soluzione (le due circonferenze nella posizione
trovata).

## Verifica

Il controllo Python rilegge i dati dalla prosa e dalla riga dei dati, e ritrova la risposta con la figura
costruita per coordinate, non con le formule della lezione: ai livelli 1 e 2 ogni punto è messo alla sua
distanza da $O$ e confrontato con il cerchio di SymPy (`encloses_point`, appartenenza), ogni retta è la
retta orizzontale a quella distanza e il numero delle intersezioni dice secante, tangente o esterna; al
livello 3 le due circonferenze con i centri alla distanza data, il numero delle intersezioni e, quando sono
zero o una, dove stanno il centro piccolo e il punto di contatto; al livello 4 la corda come intersezione
del cerchio con una retta, o il punto del cerchio a metà corda; al livello 5 $A$, $B$ e $V$ sulla
circonferenza unitaria e l'angolo misurato con `atan2`, e quando si chiede l'angolo al centro si provano
tutti gli angoli interi da $1^\circ$ a $359^\circ$ e uno solo deve dare il dato; al livello 6 le tangenti
costruite sulla circonferenza unitaria, e per le lunghezze `tangent_lines` di SymPy o l'angolo retto in
$A$ costruito per coordinate; al livello 7 il terzo vertice come intersezione di due circonferenze o di una
semiretta con la circonferenza, con l'angolo retto misurato. Controlla anche le quote dei casi
(`CASE_RANGES`), la forma delle opzioni, che le opzioni siano diverse come numeri e che una sola, quella
segnata, sia uguale alla risposta; ai livelli 1 e 2 con il diametro, che ci sia la trappola.

- `sample.mts circonferenza-cerchio 1000 all 1 | verify.py`: PASS (7.000 esercizi).
- Stesso comando con seed di partenza 50001: PASS.
- Errori piantati, tutti bocciati: risposta cambiata (livello 4); opzione giusta spostata (livello 1);
  distanza dei centri cambiata in modo che le circonferenze diventino esterne (livello 3); opzione con il
  radicale non ridotto, $\sqrt{2009}$ al posto di $7\sqrt{41}$ (livello 7); un'opzione uguale alla
  risposta scritta come $\sqrt{225}$ (livello 6); trappola del diametro tolta (livello 2); il doppio al
  posto della metà (livello 5); due punti interni (livello 1); corda più lunga del diametro (livello 4);
  due opzioni uguali (livello 3); caso sbagliato nei `params` (livello 7); angolo convesso al posto del
  concavo, risposta e opzione insieme (livello 5); lunghezza scritta $20{,}0$ (livello 4). Un campione
  buono di controllo passa.
- `width.mts`: esce con 0; righe dei dati al massimo 127 px (livello 1), opzioni al massimo 169 px
  (livello 3).
- `review.mts` esce con 0; `tsc` ed `eslint` puliti sul generatore.

Esercizi diversi su 1.000 (seed da 1), contando il problema; tra parentesi contando anche le opzioni:

| Livello | Diversi |
|---|---|
| 1 | 1000 |
| 2 | 1000 |
| 3 | 901 (999) |
| 4 | 315 (920) |
| 5 | 238 (888) |
| 6 | 260 (921) |
| 7 | 541 (964) |

I livelli 4 e 6 hanno pochi testi perché le terne pitagoriche con ipotenusa fino a 45 sono poche; il
livello 5 perché un angolo e la sua domanda sono tutto l'esercizio.

## Domande per la revisione

- Livelli 1 e 2: la nota proponeva un punto (o una retta) e tre risposte; qui sono quattro punti e si
  sceglie quello nella posizione chiesta, per avere quattro opzioni. Va bene, o si preferisce la domanda
  sul singolo punto con tre opzioni?
- Livello 2: le distanze si scrivono $d_s = 4$ cm. La lezione chiama $d$ la distanza ma non le dà un
  pedice: va bene, o meglio $\overline{OH}$ con il piede della perpendicolare?
- Livello 3: "una interna all'altra" come nella lezione, e le concentriche come caso di questa posizione
  (una volta su cinque). Se il libro le tratta come sesto caso, cambiano le opzioni.
- Livelli 4, 6 e 7: solo terne pitagoriche, quindi niente radicali nelle risposte (solo in qualche
  distrattore, $2\sqrt{34}$). Si vogliono anche risposte con i radicali, come raggio $6$ e distanza $4$ →
  corda $4\sqrt{5}$? Dipende da quando la classe ha visto i radicali rispetto a questa lezione.
- Livello 5: il caso "vertice sull'arco minore" non è un esempio svolto della lezione ma l'ultima frase
  dell'esempio 5. È giusto chiederlo, o è troppo per il primo incontro con il teorema?
- Livello 6: il distrattore della nota, $360^\circ$ meno l'angolo, esce sopra $180^\circ$ ($332^\circ$ per
  un angolo di un quadrilatero convesso): si scarta a colpo d'occhio. Meglio sostituirlo con $90^\circ$
  più o meno l'angolo?
- Livello 7: con il raggio dato, il distrattore "raggio come ipotenusa" è spesso un radicale
  ($\sqrt{69}$): va bene fra opzioni intere?
- Misure con il soprassegno ($\overline{OA} = 3$ cm), come la lezione; la domanda generale sul soprassegno è
  già nelle note della lezione.
