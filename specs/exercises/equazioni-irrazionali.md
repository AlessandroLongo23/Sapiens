# Equazioni e disequazioni irrazionali

Generatore: `equazioni-irrazionali` (`src/lib/exercises/v2/generators/equazioni-irrazionali.ts`). Verifica
indipendente: `scripts/exercises/checkers/equazioni_irrazionali.py`. Lezione collegata:
`docs/lezioni/riscritte/92-equazioni-irrazionali.md` (nota in `docs/lezioni/note/92-equazioni-irrazionali.md`,
sezione "Per il generatore", da cui vengono i nove livelli).

Lo studente riceve un'equazione o una disequazione con l'incognita sotto una radice quadrata (o cubica, al
livello 6) e trova l'insieme delle soluzioni. Consegne: "Risolvi l'equazione." (livelli 1-6), "Risolvi la
disequazione." (livelli 7-9). I passaggi seguono il metodo principale della lezione: la condizione
$B(x) \geq 0$ scritta prima di elevare al quadrato, l'equazione elevata al quadrato risolta, le soluzioni
confrontate con la condizione; per la somma di due radici la verifica (come nell'esempio 7); per le
disequazioni i sistemi della lezione.

## Tipo di risposta

- Livelli 1-6: `set`, i valori esatti in ordine crescente (`"-2"`, `"7/2"`), vuoto per $S = \emptyset$. La
  soluzione si scrive $S = \{5\}$, $S = \{-4, 4\}$, $S = \emptyset$ come nella lezione, e
  $S = \left\{-\frac{5}{2}\right\}$ con `\left\{ \right\}` quando c'è una frazione. Variante a scelta multipla
  con `toChoice()`: quattro insiemi scritti allo stesso modo.
- Livelli 7-9: `choice` fin dall'inizio, come nelle lezioni 88 e 89: la risposta è un'unione di intervalli. Le
  quattro opzioni di un esercizio sono tutte in una delle due forme (`params.notation`, metà e metà):
  `disequazioni` ($-\frac{13}{4} \leq x < 3$, $x \leq -1 \ \text{ oppure } \ 3 \leq x \leq \frac{7}{2}$) o
  `intervalli` ($S = [-5, 4\mathclose{[}$, con `\mathopen{]}` e `\mathclose{[}` e `\left] \right[` attorno alle
  frazioni). $\emptyset$, i punti isolati e $\mathbb{R}$ si scrivono sempre come insiemi. Due intervalli con una
  frazione vanno su due righe (`gathered`, $\cup$ all'inizio della seconda), come nella 88. Valori delle
  opzioni: un pezzo per elemento, `"(-oo,-4)"`, `"[5,oo)"`, `"[2,2]"` per un punto.

La soluzione (`solution`) è la forma con gli insiemi; l'ultimo passaggio è la soluzione stessa (equazioni) o la
forma con "oppure" (disequazioni).

## Costruzione all'indietro e verità

Si scelgono prima le soluzioni dell'equazione elevata al quadrato (o al cubo), tutte razionali e quasi sempre
intere, e il testo si scrive da quelle: con $B(x) = mx + n$ e le radici $r_1$, $r_2$ di $[B(x)]^2 - A(x)$ il
radicando è $A(x) = [B(x)]^2 - m^2(x - r_1)(x - r_2)$.

La verità non viene dalla costruzione. Il generatore prende le radici razionali dell'equazione risolvente e
rimette ciascuna nel problema scritto, con i razionali esatti e la radice quadrata definita solo per radicandi
non negativi; per le disequazioni prova un punto di ogni intervallo tra i punti critici (zeri di $A$, di $B$ e di
$A - B^2$) e ogni punto critico. Il controllo Python rilegge il testo del problema (non i params), toglie i
radicali per conto suo (una radice: $A = Q^2$; due radici: i due elevamenti in forma chiusa; radice cubica:
$A = Q^3$), prende le radici reali con SymPy e le rimette nel testo. La `sqrt` di SymPy lavora sui complessi
(nell'esempio 6 della lezione accetterebbe $x = -1$, con $\sqrt{-3} = \sqrt{-3}$): il controllo scarta un
candidato appena un radicando di una radice quadrata è negativo. Per le disequazioni il controllo usa la
definizione, regione per regione, e la confronta con i sistemi della lezione risolti con
`reduce_rational_inequalities`: i due risultati devono coincidere.

`params`: la forma del problema (`kind`: `sqrt`, `iso`, `rr`, `sum`, `cbrt`), la relazione, i polinomi $A$, $B$ e,
dove servono, $C$ (secondo radicando) e $T$ (il termine da portare a secondo membro), il caso, la soluzione e i
distrattori con l'errore da cui vengono (`distractors` per le equazioni, `optionTags` per le disequazioni).

## Regole comuni

- Coefficienti interi, al massimo $70$ in valore assoluto; radicandi di primo grado con il coefficiente di $x$
  positivo; secondo membro di primo grado scritto come nella lezione ($7 - x$, non $-x + 7$).
- Candidati (le radici della risolvente) razionali con denominatore al massimo $4$ e al massimo $150$ in valore
  assoluto (il $150$ serve solo alla soluzione estranea della somma di due radici, come il $84$ dell'esempio 7).
- Niente $1x$, $+ -$, termini nulli.
- Disequazioni: soluzione mai uguale a $\mathbb{R}$, al massimo due intervalli; lo stesso per i distrattori.
  $\emptyset$ è una soluzione possibile solo al livello 7 ($\sqrt{x + 2} < -4$), e un distrattore solo quando è
  l'errore della lezione (`vuoto`, `intersezione`).

## Livello 1: radice uguale a un numero

$\sqrt{A(x)} = k$. Tre casi (`CASE_RANGES`): $k$ positivo (6 su 10), negativo (2 su 10), nullo (2 su 10). Con
$k > 0$, $A$ è $ax + b$ oppure $x^2 + c$ (4 volte su 10, soluzioni $\pm s$); con $k < 0$ l'equazione è
impossibile senza conti; con $k = 0$, $A$ è un trinomio $x^2 + px + c$ con due zeri interi non opposti.

1. $\sqrt{4x + 25} = 5$: $4x + 25 = 25$, $S = \{0\}$.
2. $\sqrt{x^2 - 20} = -4$: il secondo membro è negativo, $S = \emptyset$.

## Livello 2: radice uguale a un'espressione

$\sqrt{ax + b} = mx + n$ con $m = 1$ o $2$, esempio 2. Una soluzione estranea (8 su 10) o tutte e due accettate
(2 su 10, e allora una è negativa, perché il distrattore `x positive` si distingua).

1. $\sqrt{5x + 36} = x$: condizione $x \geq 0$, $x^2 - 5x - 36 = 0$, candidati $-4$ e $9$; $S = \{9\}$.
2. $\sqrt{13x + 39} = x + 3$: condizione $x \geq -3$, candidati $-3$ e $10$, tutti e due accettati.

## Livello 3: prima si isola il radicale

$px + \sqrt{ax + b} = n$ (metà delle volte) o $\sqrt{ax + b} + px = n$, esempio 3; sempre una soluzione estranea.

1. $x + \sqrt{4x - 24} = 6$: $\sqrt{4x - 24} = 6 - x$, condizione $x \leq 6$; candidati $6$ e $10$, $S = \{6\}$.
2. $\sqrt{10x + 1} - x = -1$: $\sqrt{10x + 1} = x - 1$; candidati $0$ e $12$, $S = \{12\}$.

## Livello 4: la condizione sul secondo membro

Due casi. Soluzione negativa (6 su 10, esempio 4): $\sqrt{ax + b} = mx + n$ con $m < 0$, la soluzione accettata
è negativa e quella scartata positiva. Risolvente di primo grado (4 su 10, esempio 5):
$\sqrt{x^2 + px + c} = x + n$, i termini $x^2$ si cancellano; la soluzione è scartata circa 2 volte su 3
(equazione impossibile, come nella lezione) e accettata le altre.

1. $\sqrt{4x + 13} = 2 - x$: condizione $x \leq 2$, candidati $-1$ e $9$; $S = \{-1\}$.
2. $\sqrt{x^2 + 2x + 6} = x - 4$: $2x + 6 = -8x + 16$, $x = 1$, che non rispetta $x \geq 4$; $S = \emptyset$.

## Livello 5: due radicali

Radici uguali (metà, esempio 6): $\sqrt{A} = \sqrt{C}$ con $A$ di secondo grado e $C$ di primo, in un ordine
qualsiasi (il radicando più semplice a sinistra 3 volte su 10); condizione sul radicando più semplice, un
candidato scartato. Somma di due radici (metà, esempio 7): $\sqrt{ax + b} + \sqrt{cx + d} = k$ con $a \neq c$,
due elevamenti al quadrato e la verifica; un candidato estraneo.

1. $\sqrt{x^2 - 5x - 1} = \sqrt{3x - 1}$: condizione $x \geq \frac{1}{3}$, candidati $0$ e $8$; $S = \{8\}$.
2. $\sqrt{2x - 12} + \sqrt{4x - 31} = 3$: $x^2 - 46x + 304 = 0$, candidati $8$ e $38$; per $38$ la somma vale
   $8 + 11 = 19$, quindi $S = \{8\}$.

## Livello 6: radici cubiche

Binomio (7 su 10, esempio 8): $\sqrt[3]{x^3 + px^2 + qx + r} = x + n$, due soluzioni, almeno una con il secondo
membro negativo (così la condizione della radice quadrata, imposta per sbaglio, ne perde una). Numero
(3 su 10): $\sqrt[3]{A} = k$ con $A$ di primo grado o $x^2 + c$, $k$ negativo 7 volte su 10.

1. $\sqrt[3]{x^3 + 4x^2 + 10x + 20} = x + 2$: $x^2 + x - 6 = 0$, $S = \{-3, 2\}$.
2. $\sqrt[3]{2x - 35} = -3$: $2x - 35 = -27$, $S = \{4\}$.

## Livello 7: disequazioni con un numero

$\sqrt{A} \lesseqgtr k$, tutti i versi. $k$ positivo (6 su 10, con $A = x^2 + c$ 4 volte su 10 e $k^2 - c$ un
quadrato, così gli estremi sono interi), negativo (circa 1 su 4) o nullo (circa 1 su 6). La tabella della
lezione: con $k \leq 0$ la risposta è $\emptyset$, $A \geq 0$, $A > 0$ o $A = 0$.

1. $\sqrt{x + 2} \geq 6$: $x + 2 \geq 36$, $S = [34, +\infty\mathclose{[}$.
2. $\sqrt{x^2 - 16} \leq 3$: $16 \leq x^2 \leq 25$, $S = [-5, -4] \cup [4, 5]$.

## Livello 8: radice minore di un'espressione

$\sqrt{A} < mx + n$ o $\leq$: il sistema di tre disequazioni. $A$ di primo grado (7 su 10, esempio 11) o
$x^2 + px + c$ con zeri interi o senza zeri, con $B = x + n$ e risolvente di primo grado (3 su 10, esempio 12).

1. $\sqrt{x^2 - 2x - 3} \leq x - 2$: esistenza $x \leq -1$ oppure $x \geq 3$, $x \geq 2$, $x \leq \frac{7}{2}$;
   $S = \left[3, \frac{7}{2}\right]$.
2. $\sqrt{5x - 6} < x$: $x \geq \frac{6}{5}$, $x > 0$, $x < 2$ oppure $x > 3$;
   $S = \left[\frac{6}{5}, 2\right[ \cup \,\mathopen{]}3, +\infty\mathclose{[}$ (su due righe).

## Livello 9: radice maggiore di un'espressione

$\sqrt{ax + b} > mx + n$ o $\geq$: l'unione di due sistemi, esempio 13. Tutti e due i sistemi danno soluzioni,
altrimenti il distrattore "un sistema solo" sarebbe la risposta giusta.

1. $\sqrt{3x + 22} > x - 2$: primo sistema $-\frac{22}{3} \leq x < 2$, secondo $2 \leq x < 9$;
   $S = \left[-\frac{22}{3}, 9\right[$.
2. $\sqrt{x + 5} > x - 1$ (esempio 13): $S = [-5, 4\mathclose{[}$.

## Esercizi "brutti" da evitare

- candidati irrazionali (la verifica e la condizione diventano conti con i radicali);
- equazioni in cui la condizione non scarta niente ai livelli 3 e 5 (il livello perderebbe il suo punto);
- radicandi con il coefficiente di $x$ negativo ($\sqrt{-3x + 7}$), secondi membri scritti $-x + 7$;
- al livello 6, due soluzioni con il secondo membro positivo (la condizione imposta per sbaglio non cambierebbe
  niente);
- disequazioni con soluzione $\mathbb{R}$ o con tre intervalli.

## Variante a scelta multipla

Quattro opzioni diverse come insiemi, una giusta. I distrattori sono gli errori degli avvisi della lezione; il
controllo rifà ogni errore dal testo, uno per etichetta. In ordine di preferenza (si prendono i primi tre
diversi dalla risposta e tra loro):

- livello 1: `una sola` (solo la soluzione positiva di $x^2 = s^2$), `senza quadrato` ($A = k$), `doppio`
  ($A = 2k$, il quadrato scambiato con il doppio), `opposti`, `vuoto`; con $k < 0$ `quadrato` (si eleva al
  quadrato lo stesso, avviso "Elevare al quadrato con il secondo membro negativo"), `modulo` ($A = |k|$); con
  $k = 0$ `vuoto`, `una sola`, `opposti`;
- livelli 2-5: `tutte` (le soluzioni estranee tenute), `estranee` (solo quelle), `x positive` (la condizione
  messa sulla $x$, avviso "Scartare le soluzioni negative"), `senza doppio prodotto` (avviso "Elevare al
  quadrato termine per termine": $[B(x)]^2$ letto $m^2x^2 + n^2$; nella somma, $A + C = k^2$), `vuoto`,
  `una sola`; al livello 3 anche `segno` (il termine portato a secondo membro senza cambiare segno); al
  livello 4 anche `doppio prodotto a metà` ($(x + n)^2$ letto $x^2 + nx + n^2$) e `opposti`;
- livello 6: `condizione` (la condizione $B \geq 0$ della radice quadrata, avviso della lezione), `cubo senza
  termini` ($(x + n)^3$ letto $x^3 + n^3$), `opposti`, `vuoto`; con un numero `vuoto` (la radice cubica di un
  negativo creduta impossibile), `quadrato` ($A = k^2$), `una sola`, `senza radice` ($A = k$), `triplo`
  ($A = 3k$);
- livello 7: con $k > 0$ e $<$: `senza esistenza` (avviso "Dimenticare che il radicale deve esistere"),
  `estremi`, `senza quadrato`, `verso`; con $>$: `verso`, `estremi`, `senza quadrato`, `esistenza`; con
  $k \leq 0$: `quadrato` (si eleva lo stesso), `esistenza`, `vuoto`, `positivo`, `punto`;
- livello 8: `solo quadrato`, `senza esistenza`, `senza segno` (manca $B > 0$), `verso`, `estremi`;
- livello 9: `un sistema solo` (avviso omonimo), `solo quadrato`, `intersezione` ($\emptyset$, avviso
  "Intersezione al posto dell'unione"), di riserva `solo primo` ed `estremi`.

Frequenza delle etichette usate su 1.000 esercizi per livello (seed da 1): livello 1 `senza quadrato` 652,
`opposti` 549, `una sola` 513, `doppio` 500, `vuoto` 417, `quadrato` 209, `modulo` 160; livello 2 `estranee`
1.000, `tutte` 812, `vuoto` 587, `senza doppio prodotto` 367, `x positive` 196, `una sola` 38; livello 3
`tutte` ed `estranee` 1.000, `vuoto` 745, `segno` 128, `senza doppio prodotto` 112, `x positive` 15; livello 4
`tutte` 866, `vuoto` 628, `estranee` 582, `senza doppio prodotto` 454, `doppio prodotto a metà` 418,
`opposti` 52; livello 5 `tutte` ed `estranee` 1.000, `senza doppio prodotto` 520, `vuoto` 449, `x positive` 31;
livello 6 `condizione` 686, `opposti` 666, `vuoto` 640, `cubo senza termini` 332, `quadrato` 293,
`senza radice` 237, `triplo` 106, `una sola` 40; livello 7 `estremi` 582, `verso` 424, `esistenza` 406,
`quadrato` 342, `positivo` 329, `senza quadrato` 303, `senza esistenza` 293, `vuoto` 245, `punto` 76;
livello 8 `solo quadrato` 1.000, `verso` 746, `senza segno` 623, `senza esistenza` 368, `estremi` 263;
livello 9 `un sistema solo`, `solo quadrato` e `intersezione` 1.000.

## Figure

Nessuna figura negli esercizi. Servirebbero nella soluzione: al livello 2 il grafico di $y = \sqrt{A(x)}$ con la
retta $y = B(x)$ e la metà tratteggiata $y = -\sqrt{A(x)}$, che mostra da dove viene la soluzione estranea (la
prima figura della lezione); ai livelli 8 e 9 il grafico del sistema con le strisce (esempio 11) e il confronto
tra la curva della radice e la retta (esempio 13).

## Verifica

- `sample.mts equazioni-irrazionali 1000 all 1 | verify.py`: PASS, 9.000 esercizi su 9.000; di nuovo con il seed
  50001: PASS. Quote dei casi (seed 1 e 50001): livello 1 $k$ positivo 582 e 621, negativo 209 e 193, nullo 209
  e 186; livello 2 una estranea 812 e 793; livello 3 termine prima 480 e 519; livello 4 soluzione negativa 582
  e 621; livello 5 radici uguali 480 e 519; livello 6 binomio 686 e 730; livello 7 $k$ positivo 582 e 621,
  negativo 265 e 237, nullo 153 e 142; livello 8 primo grado 734 e 682. Livello 4, risolvente di primo grado:
  284 impossibili e 134 con la soluzione accettata.
- Esercizi diversi su 1.000 (seed da 1): livello 1 472, livello 2 506, livello 3 721, livello 4 552, livello 5
  900, livello 6 613, livello 7 629, livello 8 762, livello 9 556. I livelli 1 e 2 hanno pochi problemi
  possibili con numeri piccoli: $\sqrt{x^2 + c} = k$ con $k^2 - c$ quadrato, $\sqrt{ax + b} = x + n$ con una
  sola soluzione estranea e coefficienti fino a $20$.
- Errori piantati, tutti bocciati (16): risposta cambiata; la soluzione estranea di $\sqrt{A} = \sqrt{C}$ (dove i
  due radicandi sono negativi e uguali, che la `sqrt` di SymPy accetterebbe) messa nella risposta; `correct`
  spostato (equazioni e disequazioni); un distrattore che non è il suo errore; testo di un'opzione diverso dai
  valori; valori non in ordine; frazione non ridotta in un'opzione; `\left\{` senza frazioni; caso dei params
  sbagliato; verso del testo cambiato; un esercizio del livello 3 presentato come livello 2; due opzioni
  uguali; valori dell'opzione giusta cambiati; soluzione scritta male; etichetta di un distrattore cambiata.
- `review.mts`: esce con 0.
- `width.mts`: esce con 0. Problema al massimo 255 px (livello 6), opzioni al massimo 237 px (livello 7).
- `npx tsc --noEmit -p .`: nessun errore nel generatore.

## Domande per la revisione

- Il metodo dei passaggi: condizione $B(x) \geq 0$ prima di elevare al quadrato (la lezione), verifica solo per
  la somma di due radici. Se in classe si chiede sempre la verifica, i passaggi dei livelli 2-5 vanno cambiati.
- Il sistema di $\sqrt{A} = B$ nei passaggi ha solo la condizione su $B$, come la lezione; serve anche
  $A(x) \geq 0$ scritta e dichiarata superflua?
- Livello 1 con $k = 0$: il radicando è sempre un trinomio con due zeri interi. Va bene, o si vuole anche
  $\sqrt{ax + b} = 0$?
- Livello 4, risolvente di primo grado: la soluzione è accettata circa una volta su tre. La lezione mostra solo il
  caso impossibile: tenere anche l'altro?
- Livello 5: la somma di due radici usa la verifica, e i passaggi scrivono i due elevamenti per intero. È un
  livello da quarta, o la somma va tolta dagli esercizi di base?
- Alcuni distrattori sono errori plausibili che la lezione non nomina: `doppio` ($A = 2k$) e `senza quadrato`
  ($A = k$) ai livelli 1 e 7, `triplo` ($A = 3k$) e `opposti` al livello 6. Tenerli o sostituirli?
- Nel sistema di $\sqrt{A} < B$ i passaggi usano $B > 0$ stretto (come la lezione); con $\leq$ usano $B \geq 0$.
- Figure da aggiungere, se il sito le supporterà: vedi "Figure" (livelli 2, 8, 9).
