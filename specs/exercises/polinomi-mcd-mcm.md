# MCD e MCM di polinomi

Generatore: `polinomi-mcd-mcm` (`src/lib/exercises/v2/generators/polinomi-mcd-mcm.ts`).
Verifica indipendente: `scripts/exercises/checkers/polinomi_mcd_mcm.py`. Lezione collegata:
`docs/lezioni/riscritte/38-polinomi-mcd-mcm.md` (nota in `docs/lezioni/note/38-polinomi-mcd-mcm.md`).

Lo studente riceve due o tre polinomi sviluppati e calcola il MCD oppure il MCM, come dice la
consegna ("Calcola il MCD dei polinomi e scrivilo scomposto in fattori.", circa metà degli esercizi,
o la stessa frase con MCM). Il testo è la lista dei polinomi separati da `,\quad`, come nel generatore
dei monomi. Quando la riga supererebbe la larghezza di un telefono (350 px con KaTeX a 18 px), i
polinomi vanno uno per riga, in `\begin{aligned}&P_1, \\ &P_2, \\ &P_3\end{aligned}`, con la
virgola in fondo a ogni riga tranne l'ultima. Il generatore non misura la larghezza, la stima dai
caratteri (frazioni contate come il numero più largo, esponenti mezzo carattere, ogni `+` o `-`
0,8, `\quad` due) e va a capo sopra i 26 caratteri stimati. Il valore viene da una taratura su
1.400 esercizi resi con KaTeX: al massimo 12,8 px per carattere stimato, quindi 26 caratteri
restano sotto i 335 px. Vanno su più righe quasi tutti gli esercizi del livello 3, circa 1 su 5
dei livelli 4, 5 e 6, pochissimi dei livelli 1 e 2, nessuno del livello 7. La risposta è un'espressione in forma scomposta (`answer.kind = "expression"`,
`form: "factored"`).

## Costruzione all'indietro

Ogni polinomio si sceglie già scomposto: un fattore numerico per fattori irriducibili con i loro
esponenti. Solo dopo si sviluppa il prodotto per scrivere il testo. I fattori vengono da un insieme
piccolo, come negli esempi della lezione: la lettera ($x$, oppure $x$ e $y$, $a$ e $b$), i binomi
$x \pm a$ con $a$ da 1 a 6, $x \pm y$ e $x \pm 2y$, i falsi quadrati $x^2 \pm ax + a^2$ con $a$ da 1
a 3. MCD e MCM si calcolano sui fattori, e il risultato resta scomposto (passo 6 della lezione).

## Convenzioni della lezione (il controllo accetta solo questa forma)

- Fattore numerico: se i fattori numerici dei polinomi sono tutti interi, il MCD (il MCM) dei loro
  valori assoluti; se almeno uno è una frazione, $1$. Sempre positivo, scritto davanti, omesso
  quando vale $1$. Il fattore numerico di un polinomio è il numero che resta davanti dopo la
  scomposizione ($6$ in $6x(x+1)$, $-1$ in $-(x-3)(x+3)$, $\frac{1}{2}$ in $\frac{1}{2}(x-2)(x+2)$).
- Fattori opposti: ogni fattore ha il primo termine positivo, ordinato secondo le potenze decrescenti
  di $x$: $x - 3$ e non $3 - x$, $x - y$ e non $y - x$. Il segno finisce nel fattore numerico.
- Forma scritta: fattore numerico, poi le lettere in ordine alfabetico con il loro esponente, poi
  ogni altro fattore una volta sola tra parentesi con il suo esponente, in ordine di grado crescente
  (a parità di grado, come nella lezione: $(x - 3)(x + 3)$, $(x - y)(x + y)$). Un solo fattore senza
  numero né lettere si scrive senza parentesi: $\text{MCD} = x - 2$, come negli esempi 2, 3, 5 e 6.
- Ogni fattore tra parentesi è irriducibile in ℤ e primitivo: il controllo lo verifica con
  `factor_list` di SymPy, che deve restituire coefficiente $1$ e il fattore stesso con esponente $1$.
  Così `(3 - x)`, `(x^2 - 4)`, `(2x - 6)` e `(x + 2)^2` al posto di `(x^2 + 2x + 4)` sono bocciati
  anche quando il valore è lo stesso.

Il riquadro `ad-note` della lezione dice che $3 - x$ al posto di $x - 3$ non è sbagliato. Per questo
nella scelta multipla non compare mai un'opzione uguale all'opposto della risposta giusta.

## Rappresentazione

`params.case` vale `MCD` o `MCM`; `params.vars` le lettere (`["x"]`, `["x","y"]` o `["a","b"]`);
`params.polys` i polinomi nell'ordine del testo, ognuno come `{c: "p/q", fs: [{t: [monomi], e}]}`
(fattore numerico e fattori con esponente). Il controllo Python non li usa per la risposta: rilegge i
polinomi dal LaTeX del testo e li scompone da capo.

## Regole comuni

- Coefficienti dei polinomi sviluppati interi fino a 60 in valore assoluto; con i fattori
  frazionari, denominatori fino a 9.
- Ogni polinomio ha almeno due termini, grado al massimo 4, e non è già irriducibile: ha un fattore
  numerico diverso da $\pm 1$ o almeno due fattori.
- Niente Ruffini (la lezione non lo usa negli esempi): tolti il fattore numerico e le lettere, resta
  un polinomio di grado al massimo 2 (trinomio, quadrato di binomio, differenza di quadrati); al
  livello 6 può restare una somma o differenza di cubi.
- Mai due polinomi proporzionali.
- Il MCM ha al massimo 5 fattori diversi, grado al massimo 7 e fattore numerico al massimo 60.
- Il MCD ha almeno un fattore non numerico, tranne al livello 1, dove circa 1 esercizio su 4 con il
  MCD ha polinomi primi tra loro (definizione della lezione, riquadro "Confrontare i termini invece
  dei fattori").
- Polinomi scritti per potenze decrescenti; quando il fattore numerico è negativo (livello 4) il
  polinomio si scrive per potenze crescenti, così il primo termine è positivo, come $9 - x^2$ e
  $6 - 2x$ nell'esempio 3.
- I passaggi scompongono ogni polinomio (catene di uguaglianze che il controllo verifica), dicono i
  fattori numerici e il loro MCD o MCM, poi per ogni fattore gli esponenti e se si prende il minimo
  o il massimo, o in quale polinomio manca; il controllo verifica anche queste affermazioni.

## Livello 1: due polinomi, fattori semplici

Due polinomi in $x$, ogni fattore con esponente 1, fattori numerici interi positivi (esempio 1).

1. MCD di `5x - 25` e `x^2 - 4x - 5`: $5(x - 5)$ e $(x - 5)(x + 1)$, fattori numerici 5 e 1, MCD $x - 5$.
2. MCM di `3x^2 - 15x - 18` e `3x + 3`: $3(x - 6)(x + 1)$ e $3(x + 1)$, MCM $3(x - 6)(x + 1)$.

## Livello 2: esponenti diversi

Due polinomi in $x$, con un fattore comune che compare con esponenti diversi (quadrati di binomio,
lettere con esponente fino a 3).

1. MCM di `5x^2 + 10x + 5` e `5x^2 - 20x - 25`: $5(x + 1)^2$ e $5(x - 5)(x + 1)$, MCM $5(x - 5)(x + 1)^2$.
2. MCD di `6x^3 + 24x^2` e `3x^2 + 12x`: $6x^2(x + 4)$ e $3x(x + 4)$, MCD $3x(x + 4)$.

## Livello 3: tre polinomi

Tre polinomi in $x$ con almeno un fattore comune a tutti; un fattore può stare in due polinomi su tre
(esempio 2, dove la $x$ manca nel secondo).

1. MCD di `x^3 + x^2`, `x^2 + 5x`, `5x^2 + 5x`: $x^2(x + 1)$, $x(x + 5)$, $5x(x + 1)$, MCD $x$.
2. MCM di `6x - 6`, `4x^2 - 8x + 4`, `2x^2 + 4x - 6`: fattori numerici 6, 4, 2, MCM $12(x - 1)^2(x + 3)$.

## Livello 4: fattori opposti

Due o tre polinomi, almeno uno con fattore numerico negativo, scritto per potenze crescenti, che
contiene $a - x$; il fattore $x - a$ è comune a tutti (esempio 3). Nei passaggi il polinomio si
scompone prima in modo naturale e poi si porta fuori il segno: $8 - 4x = 4(2 - x) = -4(x - 2)$.

1. MCM di `8 - 4x` e `3x^2 - 12x + 12`: fattori numerici $-4$ e $3$, valori assoluti, MCM $12(x - 2)^2$.
2. MCM di `2x^3 - 20x^2 + 50x` e `10 - 2x`: $2x(x - 5)^2$ e $-2(x - 5)$, MCM $2x(x - 5)^2$.

## Livello 5: due lettere

Due polinomi in $x$ e $y$ (o $a$ e $b$), ognuno con tutte e due le lettere; fattori $x$, $y$,
$x \pm y$, $x \pm 2y$ (esempio 4).

1. MCD di `a^3 + 2a^2b + ab^2` e `6a^4 - 6a^2b^2`: $a(a + b)^2$ e $6a^2(a - b)(a + b)$, MCD $a(a + b)$.
2. MCD di `2x^3 + 4x^2y` e `2x^2 + 2xy`: $2x^2(x + 2y)$ e $2x(x + y)$, MCD $2x$.

## Livello 6: cubi e falso quadrato

Due o tre polinomi in $x$, uno è una somma o differenza di cubi (circa 7 su 10 differenze), con il
falso quadrato che non si scompone (esempio 5).

1. MCD di `x^2 - 4x + 4` e `3x^3 - 24`: $(x - 2)^2$ e $3(x - 2)(x^2 + 2x + 4)$, MCD $x - 2$.
2. MCM di `2x - 6`, `2x^3 - 54`, `3x^2 - 18x + 27`: MCM $6(x - 3)^2(x^2 + 3x + 9)$.

## Livello 7: fattori numerici frazionari

Due polinomi in $x$, almeno uno con fattore numerico frazionario ($\frac{1}{2}$, $\frac{2}{3}$,
$\frac{3}{4}$, ...): il fattore numerico del risultato è 1 (esempio 6).

1. MCM di `\frac{3}{2}x^2 - \frac{9}{2}x + 3` e `\frac{2}{5}x - \frac{2}{5}`: MCM $(x - 2)(x - 1)$.
2. MCM di `\frac{1}{4}x^2 - 1` e `2x + 4`: $\frac{1}{4}(x - 2)(x + 2)$ e $2(x + 2)$, MCM $(x - 2)(x + 2)$.

## Esercizi "brutti" da evitare

- polinomi che si scompongono solo con Ruffini, o di grado oltre 4;
- polinomi proporzionali, o un polinomio già irriducibile;
- coefficienti grandi: la lezione lavora con $6x^2 + 6x$, $x^3 - 8$, $x^2 + x - 6$;
- un polinomio col segno meno davanti ($-x^2 + 9$): si scrive $9 - x^2$;
- nella scelta multipla, l'opposto della risposta giusta, che la lezione non considera sbagliato.

## Variante a scelta multipla

Quattro opzioni distinte (per valore), una giusta. Distrattori dagli errori della lezione, in
quest'ordine di preferenza: il fattore opposto non riconosciuto ($3 - x$ tenuto come fattore
diverso: nel MCD sparisce, nel MCM compare due volte); il falso quadrato scritto come quadrato
($(x + 2)^2$ al posto di $x^2 + 2x + 4$); con polinomi primi tra loro, il termine $x^2$ preso come
fattore comune ("confrontare i termini invece dei fattori"); il MCM al posto del MCD e viceversa; nel
MCD un fattore che non è in tutti i polinomi; esponente massimo al posto del minimo (e viceversa); nel
MCM solo i fattori comuni; un polinomio non scomposto fino in fondo ($x^2 - 4$ tenuto intero);
il fattore numerico dell'altro calcolo, il prodotto dei fattori numerici, il fattore numerico
dimenticato; con le frazioni, "il MCD delle frazioni". Se non bastano: un esponente in più, il
fattore numerico aumentato, un fattore tolto. Nessuna opzione è l'opposto della risposta giusta.

Ogni opzione deve stare nel pulsante di risposta (252 px con KaTeX a 16 px). Quando la stima dei
caratteri (la stessa del testo) supera 20, l'opzione va su due righe, tre al massimo, in
`\begin{gathered} … \\ … \end{gathered}`, e va a capo solo tra due fattori:
`6x(x - 3) \\ (x - 1)^2(x^2 + x + 1)`. Le righe si leggono come un unico prodotto. Su 150
esercizi per livello vanno su più righe 25 opzioni su 600 al livello 1, 2 al livello 2, 44 al 3, 8 al
4, 35 al 5, 102 al 6 e 8 al 7; tutte le altre restano su una riga.

## Verifica (26 settembre 2026)

- `sample.mts polinomi-mcd-mcm 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000; MCD e MCM
  tra 483 e 517 per livello.
- Stessa cosa con seed di partenza 7001: PASS, 7.000 su 7.000 (MCD tra 491 e 522 per livello).
- Esercizi diversi su 1.000 (seed da 1): 993 al livello 1, 963 al livello 2, 999 al livello 3, 899
  al livello 4, 1.000 al livello 5, 876 al livello 6, 995 al livello 7.
- `review.mts` esce con 0 (12 esempi, tutto il LaTeX passa da KaTeX).
- Larghezza (script `pwidth.mts`, 150 esercizi per livello, KaTeX a 18 px): 0 problemi oltre i
  350 px su ogni livello, larghezza massima tra 288 e 304 px. Prima della correzione: 99 su 150 al
  livello 3 (fino a 505 px), 9 al livello 4, 17 al livello 5, 6 al livello 6.
- Larghezza delle opzioni (script `owidth.mts`, le quattro opzioni di 150 esercizi per livello,
  KaTeX a 16 px): 0 opzioni oltre i 252 px su ogni livello, la più larga di 195 px. Prima della
  correzione: 4 su 600 al livello 5 (fino a 276 px), 1 su 600 al livello 6 (268 px).
- Errori piantati a mano, tutti bocciati dal controllo: il MCM al posto del MCD; la risposta con
  lo stesso valore ma il fattore opposto `-(3 - x)`; lo stesso valore con due fattori non scomposti
  (`(x^2 + 3x - 10)`); lo stesso valore sviluppato; un fattore solo tra parentesi `(x - 1)`; il
  fattore numerico dimenticato; un fattore frazionario nel risultato del livello 7; il falso
  quadrato scritto `(x + 2)^2`; l'indice della scelta giusta spostato; un'opzione uguale
  all'opposto della risposta; un campione del livello 1 marcato come livello 4, uno del livello 3
  come livello 1; un esponente sbagliato nei passaggi; una scomposizione sbagliata nei passaggi; il
  fattore `1` esplicito (`1(x - 2)`); un polinomio che si scompone solo con Ruffini
  (`x^3 - 2x^2 - 5x + 6`); un problema su più righe con una riga persa (il controllo confronta il
  numero di polinomi con `params`); un problema su più righe senza la virgola in fondo a una riga;
  un'opzione su più righe con una riga persa (il prodotto delle righe non è più il valore
  dell'opzione); un'opzione spezzata dentro un fattore. Il controllo ha trovato anche un errore vero
  del generatore: la prima versione dello spezzamento perdeva il primo fattore delle opzioni che
  iniziano con una parentesi, ed è stata corretta.

## Domande per la revisione

- Il controllo accetta solo $x - 3$ e mai $3 - x$, come fissa la lezione; il riquadro `ad-note` però
  dice che $3 - x$ non è sbagliato. Quando arriverà la risposta aperta, conviene accettare anche
  l'opposto (con un avviso) invece di bocciarlo?
- L'ordine dei fattori nella risposta (lettere, poi grado crescente) serve solo a scrivere le
  opzioni sempre nello stesso modo: in una risposta aperta andrebbe accettato qualunque ordine?
- I polinomi con fattore numerico negativo si scrivono per potenze crescenti ($10 - 2x$,
  $50 - 45x + 12x^2 - x^3$). Per quelli di grado 3 la scrittura crescente è naturale per uno
  studente, o meglio limitare il livello 4 ai binomi e ai trinomi come nell'esempio 3?
- Al livello 7 un fattore numerico intero accanto a uno frazionario ($2x + 4$ con
  $\frac{1}{4}x^2 - 1$) dà fattore $1$ nel risultato: è quello che si aspetta un insegnante?
