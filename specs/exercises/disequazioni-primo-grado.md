# Disequazioni di primo grado e intervalli

Generatore: `disequazioni-primo-grado` (`src/lib/exercises/v2/generators/disequazioni-primo-grado.ts`).
Verifica indipendente: `scripts/exercises/checkers/disequazioni_primo_grado.py`. Lezione collegata:
`docs/lezioni/riscritte/52-disequazioni-primo-grado.md` (nota in
`docs/lezioni/note/52-disequazioni-primo-grado.md`, sezione "Per il generatore", da cui vengono i sette
livelli).

Lo studente legge un intervallo o risolve una disequazione di primo grado intera e sceglie l'insieme delle
soluzioni; al livello 7 risolve un problema che porta a una disequazione. I passaggi seguono il
procedimento in sei passi della lezione: MCM dei denominatori (positivo, il verso non cambia), parentesi,
trasporto, riduzione alla forma normale $ax \gtrless b$, divisione per il coefficiente della $x$ con il verso
che resta o cambia, insieme delle soluzioni come intervallo.

## Tipo di risposta

Nessun tipo di risposta di oggi rappresenta un intervallo: i livelli 1-6 hanno una risposta `choice` fin
dall'inizio, con quattro opzioni. Il livello 7 ha una risposta `number` (quanti quaderni al massimo, dopo
quante settimane, il voto più basso) e la variante a scelta multipla costruita dagli errori.

Scrittura delle opzioni, come nella lezione:

- intervalli con le quadre, rovesciate per l'estremo escluso: `\mathopen{]}` in apertura e `\mathclose{[}`
  in chiusura, perché con `]` e `[` semplici KaTeX spazia male ($] - \infty$, $S =]4$). Esempi:
  $S = \mathopen{]}-\infty, 3\mathclose{[}$, $S = [-1, +\infty\mathclose{[}$, $[-1, 3\mathclose{[}$;
- con un estremo frazionario le parentesi crescono, come nell'esempio 4 della lezione:
  $S = \left[-\frac{14}{5}, +\infty\right[$ (`\left[ … \right[`);
- $S = \mathbb{R}$ per le disequazioni sempre verificate e $S = \emptyset$ per le impossibili;
- al livello 1 gli intervalli senza "$S =$", oppure le disuguaglianze ($-1 \le x < 3$, $x > 2$).

Valori delle opzioni: `["R"]`, `["E"]`, oppure `[lo, loIn, hi, hiIn]` con gli estremi razionali esatti,
`"-oo"` e `"+oo"` per gli infiniti e `"1"`/`"0"` per estremo incluso o escluso. Il controllo rilegge il
LaTeX di ogni opzione, lo confronta con i valori e boccia le parentesi scritte nella forma semplice, le
parentesi piccole intorno a una frazione e quelle cresciute intorno a interi.

## Costruzione all'indietro

Ogni membro è una lista di termini $k \cdot (ax + b)/d$, come in `equazioni-primo-grado`. Si sceglie
l'estremo $s$ dell'intervallo (intero tra $-10$ e $10$, al livello 5 anche $\pm p/q$ con $q$ fino a 5), poi
la costante di un membro si calcola perché i due membri siano uguali in $s$; il verso è scelto a caso tra
$<$, $\le$, $>$, $\ge$. Al livello 6 si sceglie il caso (sempre verificata o impossibile), poi la differenza
$\delta$ tra i termini noti e un verso che dà quel caso. `params` contiene i termini, il verso, il caso e
l'insieme delle soluzioni; il controllo Python rilegge la disequazione dal LaTeX del testo, verifica che i
params dicano la stessa cosa e la risolve con `solveset`.

## Regole comuni

- Coefficienti e termini noti interi, nessun termine oltre 60 in valore assoluto nel testo.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, fattore 1 davanti a una parentesi.
- Nei livelli 2-5 la soluzione è sempre un intervallo illimitato. Gli intervalli limitati compaiono solo al
  livello 1 e nelle risposte del livello 7 (lette nel contesto): le doppie disequazioni sono della lezione
  sui sistemi.
- I passaggi dicono sempre perché il verso resta o cambia ("Dividi per $(-4)$, che è negativo, e cambia il
  verso"); il controllo lo verifica guardando il coefficiente della $x$ dopo il MCM.

## Livello 1: intervalli

Metà degli esercizi dalla disuguaglianza all'intervallo ("Quale intervallo contiene i numeri che rispettano
la disuguaglianza?"), metà dall'intervallo alla disuguaglianza ("Quale disuguaglianza descrive
l'intervallo?"); metà limitati, metà illimitati. Estremi interi tra $-10$ e $10$, intervalli limitati lunghi
al massimo 10.

- Intervallo limitato: le quattro opzioni sono le quattro combinazioni di estremi inclusi ed esclusi.
- Semiretta, verso l'intervallo: la giusta, l'estremo incluso al contrario, la semiretta opposta, e a caso
  la semiretta opposta con l'estremo al contrario oppure l'infinito "incluso" ($[-\infty$ o $+\infty]$,
  avviso "La parentesi dalla parte sbagliata").
- Semiretta, verso la disuguaglianza: i quattro segni con lo stesso numero.

1. $-8 \le x \le -1$: $[-8, -1]$ tra $[-8, -1\mathclose{[}$, $\mathopen{]}-8, -1\mathclose{[}$, $\mathopen{]}-8, -1]$.
2. $\mathopen{]}-6, +\infty\mathclose{[}$: $x > -6$ tra $x \ge -6$, $x \le -6$, $x < -6$.

## Livello 2: coefficiente positivo

$ax + b \gtrless c$ con $a$ da 2 a 9, $b$ diverso da 0 (a volte scritto prima: $-1 + 5x$), come l'esempio 1.

1. $3x + 5 > 23$: $3x > 18$, $x > 6$. $S = \mathopen{]}6, +\infty\mathclose{[}$.
2. $-1 + 5x \ge -46$: $5x \ge -45$, $x \ge -9$. $S = [-9, +\infty\mathclose{[}$.

## Livello 3: coefficiente negativo

Sette volte su dieci $a$ è negativo (da $-9$ a $-1$) e il verso cambia, come l'esempio 2 ($2 - 5x \ge 17$) e
l'avviso "Dimenticare di cambiare il verso"; tre volte su dieci $a$ è positivo e il secondo membro è
negativo ($3x > -6$), per l'avviso "Cambiare il verso quando non serve". A volte il termine noto manca
($-4x > -24$). Il controllo verifica le quote.

1. $12 - 9x \ge 30$: $-9x \ge 18$, dividi per $(-9)$ e cambia il verso: $x \le -2$. $S = \mathopen{]}-\infty, -2]$.
2. $16 + 2x < 14$: $2x < -2$, $x < -1$ (il verso resta). $S = \mathopen{]}-\infty, -1\mathclose{[}$.

## Livello 4: parentesi e incognita nei due membri

Quattro forme: $k(ax + b) [+ e] \gtrless cx + f$; due parentesi a sinistra; una parentesi per membro; e la forma
dell'esempio 3, $k(ax + b) + e \gtrless cx - (a_2 x + b_2) + f$, con il meno davanti alla parentesi. La $x$ c'è
in tutti e due i membri e non si cancella dentro un membro (niente $3x - (3x - 7)$). Il coefficiente della
forma normale è positivo o negativo circa metà e metà.

1. $2(x + 2) - 1 > 8x - 33$: $-6x > -36$, $x < 6$. $S = \mathopen{]}-\infty, 6\mathclose{[}$.
2. $-4(2x - 8) > -5(3x + 9) + 7$: $7x > -70$, $x > -10$. $S = \mathopen{]}-10, +\infty\mathclose{[}$.

## Livello 5: denominatori numerici

Due frazioni $(ax + b)/d$ a sinistra ($d$ da 2 a 6, la seconda con il più o con il meno), a volte un numero
senza denominatore; a destra una frazione oppure un termine senza denominatore ($x + 3$, $3x + 10$).
Almeno due denominatori diversi. Estremo intero (metà) o frazione con denominatore da 2 a 5, come
l'esempio 4 ($x \ge -\frac{14}{5}$).

1. $\frac{x - 7}{3} + \frac{2x + 1}{2} \le -\frac{x - 16}{6}$: MCM 6, $9x \le 27$, $x \le 3$. $S = \mathopen{]}-\infty, 3]$.
2. $\frac{x - 4}{6} + \frac{x + 6}{2} + 3 > 3x + 10$: MCM 6, $-14x > 28$, $x < -2$. $S = \mathopen{]}-\infty, -2\mathclose{[}$.

## Livello 6: sempre verificate e impossibili

Circa 4 su 10 sempre verificate, 4 su 10 impossibili, 2 su 10 con un intervallo (forme del livello 4), perché
lo studente non riconosca il caso dall'aspetto. Le prime due hanno la forma degli esempi 5 e 6:
$k(ax + b) [+ ex \text{ o } + e] \gtrless (ka + e)x + f$. Un terzo dei casi con $a = 0$ arriva a $0x \gtrless 0$,
per l'avviso "Confondere $>$ e $\ge$ quando $a = 0$". Il controllo verifica le quote dei tre casi.

1. $-2(3x - 2) + 3 \ge -6x + 1$: $0x \ge -6$, vera. $S = \mathbb{R}$.
2. $-5(2x - 1) - 2x > -12x + 5$: $0x > 0$, falsa. $S = \emptyset$.

## Livello 7: problemi

Cinque storie, una su cinque ciascuna per costruzione: la storia viene dal seed (seed modulo 5) e, se un'estrazione dei numeri si scarta, si ritenta dentro la stessa storia. Prima la storia si estraeva a ogni tentativo, e le storie con più scarti (il voto) uscivano meno: 119 su 1.000 dal seed 424242, sotto la quota minima. Anche un solo `rng.pick` sulla prima estrazione di seed consecutivi dava 154 su 1.000 per una storia. Le quote del controllo restano da 0,13 a 0,27. I testi sono scritti come il livello 7 di
`equazioni-primo-grado` (testo in `\text{}`, a paragrafo). La disequazione dà un intervallo e il contesto tiene i numeri naturali che ci stanno,
come negli esempi 7 e 8.

- `spesa` (al massimo, $\le$): zaino e quaderni con un budget, o un ascensore con una portata massima.
  $Z + px \le B$, risposta la parte intera di $(B - Z)/p$.
- `voto` (almeno, $\ge$): due o tre voti e la media da raggiungere, come l'esempio 7. Risposta intera, fino a 10.
- `tariffe` (al massimo, $<$): quota fissa contro quota più costo per ingresso, come l'esempio 8. Metà delle
  volte il pareggio cade su un intero e la risposta è il numero prima.
- `conviene` (da quante ore in su, $>$): due noleggi con quote fisse e orarie diverse, la $x$ nei due membri e
  la divisione per un numero negativo.
- `risparmio` (almeno, $\ge$): salvadanaio che cresce ogni settimana fino a una somma.

Distrattori: il numero di confine preso come soluzione (il pareggio, oppure arrotondare nel verso sbagliato),
la quota fissa dimenticata, la quota fissa trasportata senza cambiarle segno, la media divisa per il numero
di voti vecchi, poi i vicini.

1. Piscina, A 22 euro, B 14 euro più 2 a ingresso: $14 + 2x < 22$, $x < 4$. Al massimo 3 ingressi.
2. Voti 5 e 9, media almeno 6: $\frac{5 + 9 + x}{3} \ge 6$, $x \ge 4$. Almeno 4.

## Esercizi "brutti" da evitare

- un membro in cui la $x$ si cancella da sola ($3x - (3x - 7)$) fuori dal livello 6;
- estremi grandi o frazioni con denominatore oltre 5; termini oltre 60;
- $1x$, $0x$ nel testo, termini nulli, fattore 1 davanti a una parentesi;
- intervalli scritti con `]` e `[` semplici, o con le parentesi piccole intorno a una frazione;
- al livello 7, risposte zero o sopra 10 per un voto.

## Variante a scelta multipla (livelli 1-6)

Quattro opzioni distinte, una giusta. Distrattori dagli avvisi della lezione:

- verso sbagliato: la semiretta opposta con lo stesso estremo, incluso nello stesso modo. Al livello 3 è il
  verso non cambiato (coefficiente negativo) o cambiato senza motivo (coefficiente positivo, secondo membro
  negativo). Il controllo pretende questo distrattore a tutti i livelli 2-6 quando la risposta è un
  intervallo;
- estremo incluso o escluso al contrario (avviso "La parentesi dalla parte sbagliata"), preteso dal controllo
  ai livelli 2 e 3;
- al livello 3, l'estremo con il segno cambiato (diviso per il valore assoluto);
- ai livelli 2, 4 e 5, gli errori di calcolo: il meno davanti a una parentesi o a una frazione applicato solo
  al primo termine (avviso "Il meno davanti a una frazione"), un termine senza denominatore non moltiplicato
  per il MCM, un numero trasportato senza cambiare segno;
- al livello 6 con $a = 0$: l'altro caso tra $\mathbb{R}$ e $\emptyset$ (preteso dal controllo), e $0x \gtrless b$
  letto come $x \gtrless b$, con l'estremo nei due modi; con un intervallo, $\mathbb{R}$ e $\emptyset$ ci sono sempre;
- se non bastano, semirette con l'estremo vicino.

## Verifica

- `sample.mts disequazioni-primo-grado 1000 all 1`, `... 7001` e `... 424242`, passati a `verify.py`: PASS con
  tutti e tre i seed (7.000 esercizi ciascuno). Quote con il seed 1: livello 1 disuguaglianza 496, intervallo 504;
  livello 3 negativo 708, positivo 292; livello 6 sempre 446, impossibile 379, determinata 175; livello 7
  200 per ogni storia. Con il seed 7001: 505/495; 693/307; 380/410/210; 200 per storia. Anche il seed
  424242 dà PASS (livello 6: 401/399/200).
- Esercizi diversi su 1.000 (seed 1): livello 1 553, livello 2 988, livello 3 965, livello 4 1.000,
  livello 5 1.000, livello 6 997, livello 7 920. Il livello 1 è il più stretto (estremi interi fino a 10)
  e resta sopra 500.
- `width.mts disequazioni-primo-grado`: esce con 0. Problema più largo 303 px (livelli 4 e 6), opzione più
  larga 123 px (livello 5, con una frazione).
- `steps-scan.mts`: niente da segnalare. `review.mts` esce con 0. `tsc` ed `eslint` senza errori nel generatore.
- Errori piantati a mano, tutti bocciati dal controllo: indice dell'opzione giusta spostato (livello 2, e
  livello 3 dentro un file passato a `verify.py`, che dà FAIL); parentesi dell'opzione giusta scritte con
  `]` e `[` semplici (livello 3); tolto il distrattore del verso sbagliato (livello 5); caso sbagliato nei
  params (livello 6); valori di un'opzione diversi dal suo testo (livello 1); risposta di un problema
  cambiata (livello 7) e indice della sua scelta spostato; testo diverso dai params (livello 4); estremo
  frazionario con le parentesi piccole (livello 5); ultimo passaggio sbagliato (livello 3); un esercizio con
  coefficiente negativo marcato livello 2; tolto $S = \emptyset$ da una sempre verificata (livello 6);
  opzione giusta con $+\infty]$ (livello 1).

## Figure

Il livello 1 vorrebbe la retta dei numeri con il tratto colorato e i pallini, come le figure della lezione:
"dalla figura all'intervallo" è un esercizio naturale che oggi non si può fare. Anche le soluzioni dei
livelli 2-6 starebbero bene con la retta disegnata. Gli esercizi di oggi si reggono sul testo.

## Domande per la revisione

- Le opzioni scrivono le parentesi rovesciate ($\mathopen{]}2, 5]$), come la lezione. Se il libro in uso
  scrive le tonde, $(2, 5]$, vanno cambiati lezione e generatore insieme.
- Il livello 1 mette tra le opzioni anche $[-\infty$ o $+\infty]$, che non è un insieme ma l'errore che
  l'avviso della lezione descrive. Va bene come distrattore o confonde?
- Al livello 7 la risposta è un numero (il più grande, il più piccolo). Chiedere l'insieme delle soluzioni
  naturali ($\{0, 1, \ldots, 7\}$) sarebbe più fedele all'esempio 8, ma serve un tipo di risposta nuovo.
- Il distrattore "numero trasportato senza cambiare segno" dei livelli 2 e 4 dà a volte estremi lontani
  ($x > -66$ invece di $x > -2$), facili da scartare. Li tolgo in favore di semirette più vicine?
