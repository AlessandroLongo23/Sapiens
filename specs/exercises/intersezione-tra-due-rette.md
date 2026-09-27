# Intersezione tra due rette

Generatore: `intersezione-tra-due-rette` (`src/lib/exercises/v2/generators/intersezione-tra-due-rette.ts`).
Verifica indipendente: `scripts/exercises/checkers/intersezione_tra_due_rette.py`. Lezione collegata:
`docs/lezioni/riscritte/84-intersezione-tra-due-rette.md` (nota in
`docs/lezioni/note/84-intersezione-tra-due-rette.md`, sezione "Per il generatore", da cui vengono i sei livelli).

Lo studente riceve due o tre rette, ognuna con il suo nome ($r: y = 2x - 1$, $AB: x + 3y - 2 = 0$), separate
da `\quad` così che la pagina le mandi a capo, e trova il punto comune, la posizione delle rette, un vertice,
un'area o il valore di un parametro. Le convenzioni sono quelle della lezione: il punto $P(2, 3)$ con l'ascissa
al primo posto, le coordinate non intere come frazioni ($P\left(2, \frac{1}{2}\right)$, mai decimali), la forma
implicita $ax + by + c = 0$ con $a > 0$ e coefficienti interi senza fattori comuni, la forma esplicita
$y = mx + q$, le rette parallele agli assi come $x = h$ e $y = k$, le lunghezze con $\overline{AB}$. I passaggi
seguono gli esempi svolti: confronto tra forme esplicite, termini noti a secondo membro con il segno cambiato,
sostituzione con la parentesi, riduzione, i rapporti $\frac{a}{a'}$, la base e l'altezza in valore assoluto.

## Tipo di risposta

- Livelli 1, 2, 3, 4 e 6 (tre rette date): `choice`. Un punto ha due coordinate, e nessun tipo di risposta di
  oggi ha due campi.
- Livello 5 (area) e livello 6 con il parametro: `number`, con la variante a scelta multipla costruita da
  `toChoice()`.

Valori delle opzioni: `["P", "2", "1/2"]` per un punto (la lettera nel testo è $P$, o il vertice chiesto al
livello 4), `["x", "-2"]` per la retta $x = -2$ (la risposta di chi si ferma alla prima coordinata),
`["incidenti", "0", "4"]`, `["parallele"]`, `["coincidenti"]` al livello 3, `["concorrenti", "2", "3"]` e
`["non concorrenti"]` al livello 6, `["3"]` per un numero. Il controllo rilegge il testo di ogni opzione e lo
confronta con i valori.

## Costruzione all'indietro

Si sceglie prima la risposta: il punto (al livello 2 con una coordinata $\frac{n}{d}$, $d$ da 2 a 5), i tre
vertici del triangolo, i due vertici sull'asse e il terzo vertice, il valore di $k$. Poi le rette che ci
passano, con coefficienti piccoli come negli esempi, e il termine noto calcolato dal punto. Le rette parallele
e coincidenti del livello 3 sono multiple di una stessa retta (per le parallele si cambia il termine noto).

La scelta del caso (livelli 2, 3, 5 e 6) si fa una volta per esercizio, prima dei tentativi, così gli scarti
non cambiano le quote.

`params` contiene le rette (nome, forma, $a$, $b$, $c$ di $ax + by + c = 0$), il caso (`kind`), il punto, al
livello 3 la forma della coppia (`shape`: `esplicite`, `implicite`, `miste`, e le trappole `stessa q` e
`stesso a`), al livello 4 il vertice chiesto e i tre vertici, ai livelli 5 e 6 gli errori da cui vengono i
distrattori (`mistakes`). Il controllo Python non usa i params per la risposta: rilegge ogni retta dal testo,
controlla che sia scritta nella forma canonica (nessun $1x$, $+ -$, termine nullo; forma implicita con $a > 0$;
forma esplicita con $m$ e $q$ ridotti), ricalcola tutto con SymPy e controlla che tra le quattro opzioni ce ne
sia una sola vera, quella indicata come giusta.

## Regole comuni

- Niente $1x$, $0y$, $+ -$, $- -$, termini nulli nel testo.
- Ai livelli 2, 4, 5 e 6 ogni retta in forma implicita ha coefficienti interi senza fattori comuni e $a > 0$;
  al livello 3 no, perché la retta moltiplicata ($6x - 2y - 4 = 0$) è la trappola dell'esempio 4b.
- Coordinate e aree mai decimali; frazioni con `\left( \right)` nel punto.
- Quattro opzioni distinte; un distrattore non può essere la risposta scritta in un altro modo (il controllo
  confronta i valori esatti, e al livello 3 e 6 stabilisce la verità di ogni affermazione).

## Livello 1: due rette in forma esplicita

$y = m_1 x + q_1$ e $y = m_2 x + q_2$ con $m$ da $-4$ a $4$, non nulli e diversi, $|q| \le 9$; punto intero con
ascissa non nulla (esempio 1). Passaggi: si uguagliano i secondi membri, si porta la $x$ a primo membro, si
trova $x$, si mette nell'equazione con la $m$ più piccola in valore assoluto e si controlla sull'altra.

Distrattori: le coordinate scambiate (avviso "Fermarsi alla prima coordinata"), la retta $x = 2$ al posto del
punto (stesso avviso), il punto che viene portando i numeri senza cambiare segno, quello con la divisione
capovolta; poi punti vicini.

1. $r: y = 2x - 3$, $s: y = -3x + 2$: $P(1, -1)$; distrattori $P(-1, 1)$, $x = 1$, $P(-1, -5)$.
2. $r: y = x - 7$, $s: y = -3x + 5$: $P(3, -4)$; distrattori $P(-4, 3)$, $x = 3$, $P(-3, -10)$.

## Livello 2: forma implicita e rette parallele agli assi

Tre casi: due rette in forma implicita (6 su 10, esempio 2), una retta verticale $x = h$ e una implicita (2 su
10, esempio 3), una retta orizzontale $y = k$ e una implicita (2 su 10). Coefficienti $a$ da 1 a 5, $b$ da
$-5$ a $5$ non nullo, $|c| \le 20$ e non nullo; il punto ha almeno una coordinata frazionaria, con
denominatore fino a 6. Due rette implicite si risolvono per sostituzione se un coefficiente è $\pm 1$ (prima
la $y$), altrimenti per riduzione, dopo aver portato i termini noti a secondo membro con il segno cambiato.

Distrattori, implicite: il termine noto copiato senza cambiare segno in una delle due equazioni, o in tutte e
due (avviso "Il termine noto nella forma implicita"), le coordinate scambiate, la retta $x = \dots$ della prima
coordinata trovata. Retta parallela a un asse: la retta $x = h$ stessa (avviso "La retta $x = -2$ non è il
punto $x = -2$"), $x = h$ letta come $y = h$, il segno perso portando i numeri, le coordinate scambiate.

1. $r: x = 3$, $s: 5x + 5y + 2 = 0$: $P\left(3, -\frac{17}{5}\right)$; distrattori $x = 3$,
   $P\left(-\frac{17}{5}, 3\right)$, $P\left(3, \frac{17}{5}\right)$.
2. $r: 3x - 5y - 2 = 0$, $s: 3x + y - 2 = 0$: $P\left(\frac{2}{3}, 0\right)$ (da $s$ si ricava
   $y = 2 - 3x$).

## Livello 3: incidenti, parallele distinte o coincidenti

4 su 10 incidenti, 3 su 10 parallele distinte, 3 su 10 coincidenti (esempio 4). La coppia è di due rette
esplicite, due implicite o una per tipo; due rette coincidenti non sono mai due equazioni esplicite uguali.
Metà delle coppie incidenti esplicite ha la stessa $q$ (avviso "Stessa $q$ non vuol dire parallele"), metà
delle incidenti implicite ha lo stesso coefficiente di $x$ e coefficienti di $y$ diversi (avviso "Leggere $m$
nella forma implicita"). Passaggi: con due rette implicite i rapporti $\frac{a}{a'}$, $\frac{b}{b'}$ (e
$\frac{c}{c'}$ se servono); altrimenti la forma esplicita e il confronto di $m$ e $q$. Per le incidenti si
risolve il sistema e si dà il punto; il punto è intero.

Opzioni: "incidenti in $P(\dots)$", "parallele distinte", "coincidenti" e un quarto "incidenti in" con un punto
sbagliato: le coordinate scambiate (incidenti), un punto di una sola delle due rette (parallele, come la
coppia che risolve una sola equazione nella lezione sui sistemi), un punto che non sta sulla retta
(coincidenti, perché un punto comune alle due rette farebbe discutere).

1. $r: y = -x + 4$, $s: y = -2x + 4$: incidenti in $P(0, 4)$ (stessa $q$).
2. $r: y = -4x + 2$, $s: 4x + y - 2 = 0$: coincidenti.

## Livello 4: i vertici di un triangolo

Tre vertici interi da $-5$ a $5$, non allineati; i tre lati in forma implicita, nessuno parallelo a un asse,
$|a|, |b| \le 6$, $|c| \le 20$ (esempio 5). Si chiede un vertice, a caso. Passaggi: il vertice sta sui due lati
che contengono la sua lettera, e si risolve quel sistema.

Distrattori: gli altri due vertici, cioè il sistema con la coppia di lati sbagliata (avviso "Il vertice sta sui
due lati che lo nominano"), poi le coordinate scambiate. Tutte le opzioni portano la lettera del vertice
chiesto.

1. $AB: 4x - 5y + 15 = 0$, $BC: x - y + 3 = 0$, $CA: 3x - 4y + 11 = 0$, vertice $B$: $B(0, 3)$;
   distrattori $B(-1, 2)$, $B(-5, -1)$ (gli altri vertici), $B(3, 0)$.
2. $AB: 2x - 3y + 4 = 0$, $BC: 2x + y + 12 = 0$, $CA: 6x - 5y + 4 = 0$, vertice $C$: $C(-4, -4)$.

## Livello 5: l'area di un triangolo con un lato su un asse

Tre casi: due rette e l'asse $x$ (4 su 10, esempio 6), due rette e l'asse $y$ (2 su 10), il triangolo che una
retta forma con gli assi (4 su 10, esempio 7). Nei primi due i vertici sull'asse sono interi da $-6$ a $6$, il
terzo vertice ha la coordinata fuori dall'asse non nulla (4 volte su 10 con denominatore 2, circa metà volte
negativa) e rette con $|a|, |b| \le 8$, $|c| \le 20$. Nel terzo le intercette hanno denominatore fino a 3.
L'area ha denominatore fino a 4. Passaggi: i punti sull'asse con $y = 0$ (o $x = 0$), il terzo vertice con il
sistema, base e altezza in valore assoluto, $\frac{1}{2} \cdot b \cdot h$.

Distrattori: l'area con il segno dell'ordinata (avviso "Altezza negativa"), il prodotto senza $\frac{1}{2}$,
l'altra coordinata del terzo vertice presa come altezza; per il triangolo con gli assi il termine noto letto
come intercetta sull'asse $y$. Mai $0$.

1. $r: x - 4y - 6 = 0$, $s: 2x - 5y - 6 = 0$ e l'asse $x$: area $3$; distrattori $-3$, $6$, $4$.
2. $r: x - 2y + 8 = 0$ con gli assi: area $16$; distrattori $-16$, $32$, $17$.

## Livello 6: tre rette per lo stesso punto

6 su 10 il parametro (esempio 10), 2 su 10 tre rette concorrenti, 2 su 10 non concorrenti (esempio 9). $r$ e
$s$ passano per un punto intero con coordinate non nulle, coefficienti fino a 5. Parametro: $v: kx + by + c = 0$
(6 volte su 10) o $v: ax + ky + c = 0$, $k$ intero da $-6$ a $6$ non nullo, e con quel $k$ la retta $v$ non è
parallela a $r$ né a $s$. Non concorrenti: $t$ passa per un altro punto intero di $r$ e non è parallela a $r$ né
a $s$, così le tre rette formano un triangolo.

Distrattori, parametro: $-k$ (il segno perso portando i numeri), il $k$ che viene con le coordinate scambiate,
$\frac{1}{k}$ (la divisione capovolta), poi valori vicini. Concorrenti o no: il punto comune a $r$ e $s$ quando
$t$ non ci passa (avviso "Tre rette che si incontrano a due a due"), i punti $r \cap t$ e $s \cap t$, le
coordinate scambiate.

1. $r: 4x + y + 1 = 0$, $s: 4x + 3y + 11 = 0$, $v: 3x + ky + 12 = 0$: $P(1, -5)$, $k = 3$; distrattori $-3$,
   $\frac{1}{3}$, $4$.
2. $r: x + 4y - 2 = 0$, $s: 2x + 3y + 1 = 0$, $t: 4x + 3y + 18 = 0$: non concorrenti ($P(-2, 1)$ non sta su
   $t$); distrattori concorrenti in $P(-2, 1)$, $P(-6, 2)$, $P\left(-\frac{17}{2}, \frac{16}{3}\right)$.

## Esercizi da evitare

Rette con coefficienti che hanno un fattore comune (tranne al livello 3), rette parallele o coincidenti dove
serve un punto, due coincidenti scritte con la stessa equazione, punti con denominatori oltre 6, triangoli
degeneri, un terzo vertice sull'asse, un'area nulla, un parametro che rende $v$ parallela a una delle altre.

## Figure

Il sito oggi non disegna figure negli esercizi. Tutti i livelli si reggono sul testo, ma una figura aiuterebbe
molto i livelli 4 e 5 (il triangolo con i vertici e, al livello 5, la base sull'asse e l'altezza) e il livello 3
(le due rette, per vedere perché sono parallele o si incontrano sull'asse $y$); ai livelli 1, 2 e 6 servirebbe
come controllo, come nella lezione.

## Verifiche fatte

- `sample.mts intersezione-tra-due-rette 1000 all 1 | verify.py`: PASS; con seed di partenza 7001: PASS. Quote
  (seed 1): livello 2 implicite 598, verticale 199, orizzontale 203; livello 3 incidenti 408, parallele 288,
  coincidenti 304; livello 5 asse $x$ 408, asse $y$ 190, assi 402; livello 6 parametro 598, concorrenti 199,
  non concorrenti 203.
- Esercizi diversi su 1.000 per livello (testo e consegna): 872, 987, 955, 1000, 859, 1000.
- Errori piantati a mano, tutti bocciati: opzione giusta spostata; punto giusto sostituito da un punto
  sbagliato; testo di un'opzione diverso dai suoi valori; lato del triangolo non primitivo (moltiplicato per 2);
  area cambiata; $k$ cambiato; "$+ -$" nel testo; caso sbagliato nei params del livello 3; distrattore uguale
  alla risposta ma non semplificato ($\frac{24}{2}$ accanto a $12$); frazione nel punto senza `\left(`; opzione
  del livello 4 con la lettera di un altro vertice; "concorrenti" indicato come giusto quando $t$ non passa per
  il punto; retta con "$+ 0$"; due equazioni esplicite identiche date come coincidenti; esercizio con punto
  intero al livello 2.
- `width.mts`: esce con 0. Formula del problema più larga 192 px su 350 (livello 4), opzione più larga 212 px
  su 252 (livello 6, un'opzione "concorrenti in" con un punto a coordinate frazionarie).
- `review.mts` esce con 0; `steps-scan.mts` non segnala niente; `tsc` ed `eslint` senza errori sul generatore.

## Domande per la revisione

- Livello 3: per avere quattro opzioni, il quarto è sempre un "incidenti in" con un punto sbagliato. Nel caso
  delle parallele il punto sta su una sola retta; nel caso delle coincidenti è un punto fuori dalla retta.
  Va bene così, o si preferisce una domanda a tre risposte (serve cambiare la pagina)?
- Livello 6: il distrattore $\frac{1}{k}$ viene da chi divide al contrario, e $k$ vicini ($k \pm 1$) riempiono
  quando due errori coincidono; a volte compare $k = 0$. Lo teniamo?
- Livello 5, triangolo con gli assi: il distrattore "termine noto letto come intercetta sull'asse $y$" non è
  nominato dalla lezione. È un errore che si vede in classe, o è meglio sostituirlo con valori vicini?
