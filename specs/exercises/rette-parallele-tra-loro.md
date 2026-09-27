# Rette parallele e perpendicolari

Generatore: `rette-parallele-tra-loro` (`src/lib/exercises/v2/generators/rette-parallele-tra-loro.ts`).
Verifica indipendente: `scripts/exercises/checkers/rette_parallele_tra_loro.py`. Lezione collegata:
`docs/lezioni/riscritte/83-rette-parallele-tra-loro.md` (nota in `docs/lezioni/note/83-rette-parallele-tra-loro.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione. La nota ne proponeva sei; il secondo ("antireciproco e parametro")
è diviso in due, perché trovare l'antireciproco e risolvere un'equazione in $k$ sono due difficoltà distinte.
Convenzioni della lezione: parallele comprese le coincidenti, condizioni in forma implicita $ab' = a'b$ e
$aa' + bb' = 0$, "antireciproco", retta per un punto $y - y_0 = m(x - x_0)$, proiezione $H$, frazioni con
`\frac` nel testo e nelle opzioni e `\dfrac` nei passaggi, $\cdot$ per il prodotto.

## Forma della risposta

- Livello 1: `choice` fra le quattro posizioni, sempre nello stesso ordine: "parallele e distinte",
  "coincidenti", "perpendicolari", "incidenti, non perpendicolari". Le quattro sono incompatibili fra loro,
  quindi con la convenzione della lezione (coincidenti comprese fra le parallele) una sola è giusta.
- Livelli 2 e 3: `number` (il coefficiente angolare, il valore di $k$), con la variante a scelta multipla.
- Livello 4: `expression` con `value` il secondo membro in SymPy (`(-1/3)*x + (11/3)`) e `latex`
  l'equazione intera (`y = -\frac{1}{3}x + \frac{11}{3}`), più la variante a scelta multipla fra quattro rette
  in forma esplicita.
- Livello 5: `choice` fra quattro rette in forma implicita ridotta (coefficienti interi primi fra loro, $a > 0$),
  oppure scritte $x = h$, $y = k$ quando la retta data è parallela a un asse, come nell'esempio 5.
- Livello 6: `expression` in forma esplicita come al livello 4; quando l'asse è verticale (segmento orizzontale)
  la risposta è `choice`, perché $x = h$ non ha forma esplicita. Le opzioni sono sempre $y = mx + q$ o $x = h$.
- Livello 7: `choice` fra quattro punti `H(3, 1)` o `H\left(\frac{3}{5}, \frac{4}{5}\right)`, `values` le due coordinate.

Le opzioni che sono rette hanno per `values` la terna ridotta `[a, b, c]` di $ax + by + c = 0$.

## Rappresentazione (`params`)

- `case`: la posizione (livello 1), la forma di $r$ (`esplicita`/`implicita`, livello 2), la relazione
  (`parallela`/`perpendicolare`, livelli 3 e 4), `implicita`/`assi` (livello 5), `positivi`/`negativi`/`orizzontale`/
  `verticale` (livello 6), `intera`/`frazionaria`/`assi` (livello 7). Il controllo Python ricalcola il caso dal testo.
- Le rette come terne ridotte `[a, b, c]`: `r`, `s` al livello 1 (con `rForm`, `sForm`, `sk` e `trap`, l'errore
  da cui nasce una coppia di incidenti: `opposto`, `reciproco`, `altro`, `assi`); `r` e `line` (la risposta) ai
  livelli 4-6; al livello 3 `a`, `b`, `c`, `m`, `q` di $y = (ak + b)x + c$ e $y = mx + q$.
- I punti: `P` (livelli 4 e 7), `A` (livello 5), `A` e `B` (livello 6), `H` (livello 7, come stringhe esatte).

## Costruzione all'indietro

- Livello 1: si sceglie la posizione, poi il coefficiente angolare di $r$ e quello di $s$ che la realizza
  ($m$, $-\frac{1}{m}$, oppure per le incidenti $-m$, $\frac{1}{m}$ o un altro valore), poi le ordinate all'origine.
  Un quarto delle volte le rette sono parallele agli assi. $r$ è in forma esplicita sette volte su dieci; $s$ non
  lo è mai: è in forma implicita, a volte moltiplicata per 2 o 3, oppure scritta come $2y = 4x + 7$ (il riquadro
  "Confrontare i coefficienti senza portare in forma esplicita"). Le coincidenti hanno sempre $s$ moltiplicata.
- Livello 2: si sceglie $m$ (intero da 2 a 6 o frazione con denominatore fino a 5, mai $\pm 1$), poi $q$; la
  risposta è $-\frac{1}{m}$.
- Livello 3: si sceglie la relazione, $a \in \{1, 2, 3, 4\}$, $b$ e il coefficiente $m$ di $s$; $k$ si ricava da
  $ak + b = m$ oppure $ak + b = -\frac{1}{m}$, e si tiene se è non nullo con denominatore fino a 15.
- Livello 4: si sceglie $r$ ($m$ intero da 1 a 4 in valore assoluto o frazione $\pm\frac{1}{2}$, $\pm\frac{1}{3}$,
  $\pm\frac{2}{3}$, $\pm\frac{3}{2}$), il punto $P$ con $1 \le x_0 \le 6$ e $0 \le y_0 \le 6$ fuori da $r$, e si
  scrive la retta per $P$ con $m$ o con l'antireciproco.
- Livello 5: $r\colon ax + by + c = 0$ con $1 \le a \le 6$, $0 < |b| \le 6$, $\mathrm{MCD}(a, b) = 1$ (così la parallela
  e la perpendicolare non vanno ridotte), $A$ con almeno una coordinata negativa e fuori da $r$. La risposta ha gli
  stessi $a$, $b$ (parallela) o i coefficienti scambiati con un segno cambiato (perpendicolare), e $c'$ si trova
  sostituendo $A$: è il procedimento del riquadro "Parallela e perpendicolare senza passare per m". Tre volte su
  dieci $r$ è parallela a un asse ($y = 3$, $2y - 6 = 0$, $x = 5$, $3x + 6 = 0$) e la risposta è $x = x_0$ o $y = y_0$.
- Livello 6: si scelgono $A$ e $B$ con somme delle coordinate pari, così il punto medio è intero. Coordinate fra
  0 e 8 (35 %), fra $-7$ e $7$ con almeno una negativa (35 %), segmento orizzontale o verticale (30 %).
- Livello 7: per $H$ intero (40 %) si sceglie $H$, $r$ per $H$ con $m \in \{\pm 1, \pm 2, \pm 3, \pm 4, \pm\frac{1}{2}\}$ e
  ordinata all'origine intera, e $P = H + t(-p, d)$ lungo la perpendicolare ($m = \frac{p}{d}$, $t = \pm 1, \pm 2$).
  Per $H$ frazionario (40 %) $r$ è in forma implicita con $a^2 + b^2 \le 10$ (denominatori di $H$ fino a 10) e $P$
  intero. Per il 20 % $r$ è orizzontale o verticale.

## Livello 1: la posizione di due rette

- $r\colon\ y = 2x + 5$, $s\colon\ 2y = 4x - 12$: $s\colon\ y = 2x - 6$, parallele e distinte.
- $r\colon\ 4x - y + 5 = 0$, $s\colon\ 4x + y = 0$: $m_r = 4$, $m_s = -4$, prodotto $-16$: incidenti, non
  perpendicolari (la trappola dell'opposto).

## Livello 2: l'antireciproco

- $r\colon\ y = -\frac{3}{4}x + 9$: $\frac{4}{3}$.
- $r\colon\ 3x - 4y - 12 = 0$: $m = -\frac{3}{-4} = \frac{3}{4}$, perpendicolari con $-\frac{4}{3}$.

## Livello 3: il parametro k

- $r\colon\ y = (3k - 1)x + 9$ perpendicolare a $s\colon\ y = \frac{1}{2}x - 7$: $3k - 1 = -2$, $k = -\frac{1}{3}$.
- $r\colon\ y = (k + 5)x + 1$ parallela a $s\colon\ y = -\frac{2}{3}x - 8$: $k = -\frac{17}{3}$.

## Livello 4: retta per un punto, r in forma esplicita

- $P(5, 2)$, $r\colon\ y = 3x + 1$, perpendicolare: $y = -\frac{1}{3}x + \frac{11}{3}$.
- $P(4, 6)$, $r\colon\ y = -x + 5$, parallela: $y = -x + 10$.

## Livello 5: r in forma implicita o parallela a un asse

- $A(4, -5)$, $r\colon\ 5x - 4y - 2 = 0$, perpendicolare: $4x + 5y + c' = 0$, $c' = 9$.
- $A(6, -3)$, $r\colon\ 3y - 3 = 0$, perpendicolare: $r$ è $y = 1$, la risposta $x = 6$.

## Livello 6: l'asse di un segmento

- $A(6, 0)$, $B(0, 8)$: $M(3, 4)$, $m_{AB} = -\frac{4}{3}$, asse $y = \frac{3}{4}x + \frac{7}{4}$.
- $A(0, -5)$, $B(-4, -5)$: segmento orizzontale, asse $x = -2$.

## Livello 7: la proiezione di un punto

- $P(-3, -6)$, $r\colon\ y = -2x - 2$: $s\colon\ y = \frac{1}{2}x - \frac{9}{2}$, $H(1, -4)$.
- $P(4, 1)$, $r\colon\ x - 2y + 1 = 0$: $H\left(\frac{17}{5}, \frac{11}{5}\right)$.

## Da evitare

- `1x`, `0x`, `+ -`, `- -`, termini nulli (controllati da generatore e verifica).
- Al livello 1, $r$ e $s$ scritte nello stesso modo, e coefficienti oltre 30.
- Al livello 2, $m = \pm 1$: l'antireciproco coincide con l'opposto e le opzioni si riducono a due.
- Un punto che sta già sulla retta data (ai livelli 4 e 5 la parallela sarebbe $r$ stessa, al 7 la proiezione è $P$).
- Una retta distrattore uguale alla risposta scritta in un altro modo (moltiplicata per 2): il controllo confronta
  le rette, non il testo.
- Ambienti con `\text{}` nella soluzione e nei passaggi.

## Distrattori

- Livello 1: le altre tre posizioni. Le incidenti nascono per il 70 % dagli errori del riquadro "Opposto e reciproco
  insieme" ($m_s = -m_r$ oppure $\frac{1}{m_r}$); le parallele con $s$ scritta come $2y = 4x + 7$ puniscono chi legge
  il coefficiente di $x$ senza dividere.
- Livello 2: $-m$ (solo l'opposto), $\frac{1}{m}$ (solo il reciproco), $m$ (il coefficiente della parallela); per la
  forma implicita anche $-\frac{1}{a}$ (il coefficiente di $x$ letto come $m$).
- Livello 3: per la perpendicolarità i $k$ ottenuti con $-m$, con $\frac{1}{m}$, con $m$ e con il segno di $b$ sbagliato
  nel trasporto; per il parallelismo il $k$ della perpendicolare, il segno di $b$ sbagliato, la divisione per $a$
  dimenticata, $-m$.
- Livello 4: la retta per $P$ con $-m$, con $\frac{1}{m}$, con $m$ (parallela e perpendicolare scambiate); la retta con
  il segno di $x_0$ sbagliato ($y - y_0 = m(x + x_0)$); la retta per $(y_0, x_0)$; la retta giusta con l'ordinata
  all'origine di $r$.
- Livello 5: la parallela al posto della perpendicolare e viceversa; $bx + ay$ (solo il reciproco) e $ax - by$
  (solo l'opposto); $c'$ con il segno sbagliato (la retta per $(-x_0, -y_0)$); coordinate scambiate; $c$ di $r$ non
  ricalcolato. Con $r$ parallela a un asse: $x = 3$ e $y = 3$ scambiate (il riquadro "Scambiare x = 3 e y = 3"),
  la parallela al posto della perpendicolare, $r$ stessa.
- Livello 6: la retta $AB$ per $M$ (coefficiente $m_{AB}$), $-m_{AB}$, $\frac{1}{m_{AB}}$, la perpendicolare per $A$ invece
  che per $M$, il punto medio calcolato con le semidifferenze. Per i segmenti orizzontali e verticali: la retta del
  segmento, la lettera scambiata ($y = x_M$), la semidifferenza, $x = x_A$.
- Livello 7: $H$ con le coordinate scambiate; il punto di $r$ sulla verticale o sull'orizzontale di $P$ (proiezione
  "lungo un asse"); il simmetrico di $P$ rispetto a $r$ ($2H - P$); l'intersezione con la retta per $P$ di coefficiente
  $-m$. Per $r$ parallela a un asse: la retta letta con la lettera sbagliata ($(k, y_0)$ per $y = k$).
- Quando gli errori danno meno di tre opzioni distinte (per esempio con $m = \pm 1$), si completano con la retta
  giusta spostata di 1 o 2 nel termine noto, o con un numero vicino.

## Verifica

Il controllo Python rilegge tutto dal LaTeX con un parser scritto a parte (numeri, $x$, $y$, $k$, parentesi,
`\frac`, `\dfrac`, `\cdot`, moltiplicazione sottintesa) e ricalcola con la geometria di SymPy: `Line.is_parallel`
e `Line.is_perpendicular` (livelli 1-3), `Line.parallel_line` e `Line.perpendicular_line` (4 e 5),
`Segment.perpendicular_bisector` (6), `Line.projection` (7), `solve` per $k$. Due equazioni sono la stessa retta se i
coefficienti sono proporzionali, quindi un distrattore "giusto ma scritto diversamente" risulta giusto e boccia il
campione. Controlla anche la forma: esplicita con frazioni ridotte ai livelli 4 e 6, implicita con coefficienti
interi primi fra loro e $a > 0$ al livello 5, $s$ mai in forma esplicita al livello 1, i vincoli sui punti e le
quote dei casi (`CASE_RANGES`).

Risultati del 27 settembre 2026:

- `sample.mts rette-parallele-tra-loro 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Casi: livello 1 parallele 316,
  perpendicolari 340, incidenti 187, coincidenti 157; livello 5 implicita 734, assi 266; livello 6 positivi 359,
  negativi 337, orizzontale 142, verticale 162; livello 7 intera 408, frazionaria 389, assi 203.
- Stesso comando con seed di partenza 7001: PASS, 7.000 su 7.000.
- Esercizi diversi su 1.000 per livello (consegna più testo): 985, 694, 1.000, 972, 998, 916, 973.
- `width.mts rette-parallele-tra-loro`: esce con 0. Formula del problema più larga 183 px (livello 1), opzione più
  larga 223 px (livello 1, "incidenti, non perpendicolari").
- `review.mts`: esce con 0. `steps-scan.mts`: niente da segnalare. `tsc` ed `eslint`: nessun errore nel generatore.

Errori piantati a mano, tutti bocciati (21 prove): risposta numerica cambiata (livelli 2 e 3); `correct` spostato su
un distrattore (livelli 1, 4, 5, 6, 7); un distrattore uguale alla risposta moltiplicata per 2 (livello 5) e uno
scritto $2y = \dots$ (livello 4); frazione non ridotta nella risposta (livello 6); `value` della risposta cambiato
(livello 6); `values` di un'opzione incoerenti con il LaTeX (livello 3); etichette delle posizioni scambiate
(livello 1); $s$ riscritta in forma esplicita (livello 1); punto fuori dai vincoli (livelli 4 e 5); opzione giusta
alterata nel LaTeX (livello 7); punto cambiato nel testo (livello 7); `1x` nel testo; un ambiente con `\text{}` in
un passaggio; relazione scambiata nella consegna (livello 3).

## Figure

Il sito non disegna ancora le figure degli esercizi, e tutti i livelli si reggono sul testo. La vorrebbero:

- livello 1, per vedere le due rette (utile soprattutto nella soluzione);
- livelli 4 e 5, per la retta data, il punto e la retta trovata, come la figura dell'esempio 3;
- livello 6, per il segmento, il punto medio e l'asse (esempio 6);
- livello 7, per la retta, $P$, la perpendicolare e $H$ (esempio 8): qui la figura aiuta anche a scartare i distrattori
  "lungo un asse" e il simmetrico.

## Domande per la revisione

- Livello 1: "parallele e distinte" e "coincidenti" come opzioni separate. Con la convenzione della lezione le
  coincidenti sono anche parallele; le quattro opzioni sono scritte in modo da escludersi. Va bene, o conviene
  togliere le coincidenti e usare un'altra quarta opzione?
- Livello 3: $k$ ha denominatori fino a 15 (per esempio $\frac{11}{6}$, $-\frac{17}{9}$). L'esempio 2 della lezione ha
  $\frac{2}{5}$. Si preferisce limitare $a$ a 1 e 2 per avere denominatori più piccoli?
- Livello 5: la risposta in forma implicita ha $a > 0$ e coefficienti primi fra loro, come $3x + 4y + 2 = 0$
  nell'esempio 4. Chi scrive $-3x - 4y - 2 = 0$ ha la retta giusta, ma a scelta multipla non la trova: con la
  risposta aperta andrà accettata.
- Livello 7: $H$ frazionario ha denominatori fino a 10, come $\frac{3}{5}$ nell'esempio 9. Si possono tenere anche
  denominatori 13 ($a = 2$, $b = 3$) o sono troppo?
- Livelli 5 e 6: con $x = h$ e $y = k$ la risposta aperta oggi non ha un tipo adatto (una retta verticale non ha forma
  esplicita); per ora è solo a scelta multipla.
