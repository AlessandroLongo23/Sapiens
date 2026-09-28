# Sistemi di secondo grado

Generatore: `sistemi-secondo-grado` (`src/lib/exercises/v2/generators/sistemi-secondo-grado.ts`).
Verifica indipendente: `scripts/exercises/checkers/sistemi_secondo_grado.py`. Lezione collegata:
`docs/lezioni/riscritte/93-sistemi-secondo-grado.md` (nota in `docs/lezioni/note/93-sistemi-secondo-grado.md`,
sezione "Per il generatore", da cui vengono i sei livelli).

Lo studente riceve un sistema di due equazioni in $x$ e $y$, una di primo grado e una di secondo, scritto
con la graffa (`\begin{cases}`), oppure un problema sul rettangolo, e sceglie la risposta tra quattro. Le
convenzioni sono quelle della lezione: soluzioni come insieme di coppie, $S = \{(3, 4), (4, 3)\}$, con le
coppie in ordine crescente di $x$ (e di $y$ a parità di $x$); $S = \emptyset$ per un sistema impossibile;
frazioni ridotte e mai decimali; una coppia con una frazione si scrive con `\left( \right)` e l'insieme con
`\left\{ \right\}`. I passaggi seguono il metodo di sostituzione in cinque passi della lezione: ricavare
l'incognita con coefficiente $\pm 1$, sostituire tra parentesi, scrivere l'equazione risolvente, risolverla
con il discriminante, ricavare l'altra incognita dall'espressione di primo grado.

## Tipo di risposta

Sempre `choice`, a tutti i livelli: la risposta è un insieme di coppie, e nessun tipo di risposta di oggi
ne accetta uno. Valori delle opzioni:

- un insieme di coppie: `["(-2,3)", "(3,-2)"]`, ordinate come nel testo; `[]` per $S = \emptyset$;
- un insieme di numeri (l'errore "le soluzioni sono numeri" degli avvisi): `["-3/2", "1"]`;
- livello 3: la posizione della retta e poi i punti comuni, `["secante", "(0,-3)", "(3,0)"]`,
  `["esterna"]`;
- livello 6: i due lati in ordine crescente, `["3", "4"]`; `[]` quando la figura non esiste.

Il controllo rilegge il testo di ogni opzione, lo confronta con i valori e confronta le opzioni come oggetti
matematici (insiemi di coppie, insiemi di numeri, posizione e punti, coppia di lati): due scritture dello
stesso insieme sono la stessa opzione.

## Costruzione all'indietro

Si scelgono prima le soluzioni della risolvente, poi i coefficienti. Al livello 1 si sceglie una radice
intera $u_1$ e una radice $\frac{n}{k}$ con $k$ il coefficiente dell'altra incognita, così i termini noti
restano interi. Al livello 2 si sceglie la retta e una radice intera, e l'altra radice viene dalla somma
delle radici. Al livello 3 si scelgono la parabola e le radici della risolvente (o una risolvente con
$\Delta < 0$), e la retta si ricava. Ai livelli 4-6 si scelgono le due incognite.

La scelta del caso (livelli 3, 4 e 6) si fa una volta per esercizio, prima dei tentativi, così gli scarti non
cambiano le quote.

`params` contiene l'equazione di primo grado (`lin`, $ax + by = c$), quella di secondo grado (`quad`, i
coefficienti di $x^2$, $y^2$, $xy$, $x$, $y$ e il termine noto), l'ordine delle due equazioni
(`quadFirst`), il caso (`kind`) e al livello 6 la storia e i numeri del testo (`story`, `P`, `A`, `d`). Il
controllo Python non usa le soluzioni del generatore: rilegge le due equazioni dal LaTeX del testo (al
livello 6 i numeri dal testo del problema), risolve il sistema con `solve` di SymPy, tiene le soluzioni reali
e verifica che `lin` e `quad` dicano le stesse equazioni.

## Regole comuni

- Un'equazione di primo grado e una di secondo (grado del sistema $2$); il controllo boccia un sistema di
  grado $4$.
- Nell'equazione di primo grado dei livelli 1 e 2 un'incognita ha coefficiente $1$ o $-1$, e i due
  coefficienti non sono tutti e due negativi. Ai livelli 4 e 5 è $x + y = s$ con $s \neq 0$.
- Soluzioni razionali: la risolvente ha sempre il discriminante quadrato perfetto (o negativo).
- Niente $1x$, $0y$, $+ -$, $- -$, termini nulli nel testo.
- Il problema e le opzioni stanno sul telefono: problema al più 154 px su 350, opzione al più 232 px su 252
  (livello 3, con `gathered`).

## Livello 1: sostituzione con $xy = p$

Prima equazione $x + ky = h$ oppure $kx \pm y = h$, con $k$ da $-3$ a $3$ non nullo, $|h| \le 12$; seconda
$xy = p$ con $|p| \le 30$. Due coppie, una intera e una che può avere una frazione con denominatore fino a
$3$ (esempio 1). Si ricava l'incognita con coefficiente $\pm 1$, si sostituisce tra parentesi, si svolge, si
porta tutto a primo membro (cambiando segno se il primo coefficiente è negativo) e si risolve.

1. $x - 2y = 1$, $xy = 3$: $x = 2y + 1$, $2y^2 + y - 3 = 0$, $S = \left\{\left(-2, -\frac{3}{2}\right), (3, 1)\right\}$.
2. $x + 2y = 5$, $xy = -12$: $x = 5 - 2y$, $2y^2 - 5y - 12 = 0$, $\Delta = 121$,
   $S = \left\{(-3, 4), \left(8, -\frac{3}{2}\right)\right\}$.

## Livello 2: sostituzione con i quadrati

Prima equazione con un'incognita di coefficiente $\pm 1$ ($y = mx + q$ o $x = my + q$, con $m$ da $-3$ a $3$
e $q$ da $-4$ a $4$, non nulli), seconda $ax^2 + by^2 = r$ con $(a, b)$ tra $(1, 1)$ (metà delle volte),
$(1, -1)$, $(2, 1)$, $(1, 2)$. Sostituendo si sviluppa il quadrato di un binomio (esempio 2); con $a$ o $b$
diverso da $1$ il passaggio mostra prima il quadrato tra parentesi e poi il prodotto svolto. Due coppie,
anche con frazioni (denominatore fino a 10).

1. $3x + y = 2$, $x^2 + y^2 = 4$: $y = 2 - 3x$, $10x^2 - 12x = 0$, diviso per 2 $5x^2 - 6x = 0$,
   $S = \left\{(0, 2), \left(\frac{6}{5}, -\frac{8}{5}\right)\right\}$.
2. $x + y = 4$, $x^2 + 2y^2 = 44$: $x = 4 - y$, $3y^2 - 8y - 28 = 0$,
   $S = \left\{\left(-\frac{2}{3}, \frac{14}{3}\right), (6, -2)\right\}$.

## Livello 3: retta e parabola

$y = ax^2 + bx + c$ con $a$ tra $1$ (metà), $-1$ (un terzo) e $2$, $b$ da $-5$ a $5$, $c$ da $-8$ a $8$; retta
$y = mx + q$ con $m$ non nullo, $|m| \le 6$, $|q| \le 15$, scritta come nella lezione ($y = 3 - x$). Quote:
secante 4 su 10, tangente 3 su 10, esterna 3 su 10. Si uguagliano i secondi membri, si scrive la risolvente
e il numero delle sue soluzioni dice la posizione (tabella della lezione); i punti hanno coordinate intere e
le ordinate si calcolano dalla retta. La consegna chiede la posizione e i punti comuni.

1. $y = x^2 + 5x + 3$, $y = 4x + 3$: $x^2 + x = 0$, secante in $(-1, -1)$ e $(0, 3)$.
2. $y = x^2 + x + 4$, $y = 3 - x$: $x^2 + 2x + 1 = 0$, $\Delta = 0$, tangente in $(-1, 4)$.
3. $y = x^2 - 7$, $y = -2x - 11$: $x^2 + 2x + 4 = 0$, $\Delta = -12$, esterna.

## Livello 4: sistemi simmetrici

$x + y = s$, $xy = p$ ($s \neq 0$, $p \neq 0$, $|p| \le 60$), una volta su quattro con $xy = p$ scritta per
prima. Quote: due coppie 6 su 10 (soluzioni intere da $-10$ a $10$, anche negative, esempio 6), una coppia 2
su 10 ($\Delta = 0$, $(t, t)$), impossibile 2 su 10 ($\Delta < 0$). I passaggi dicono $s$ e $p$, scrivono
$t^2 - st + p = 0$, la risolvono e scrivono le coppie $(t_1, t_2)$ e $(t_2, t_1)$.

1. $x + y = 1$, $xy = -6$: $t^2 - t - 6 = 0$, $S = \{(-2, 3), (3, -2)\}$.
2. $x + y = -12$, $xy = 36$: $t^2 + 12t + 36 = 0$, $\Delta = 0$, $S = \{(-6, -6)\}$.

## Livello 5: la somma dei quadrati

$x + y = s$, $x^2 + y^2 = k$ (una volta su quattro con la seconda scritta per prima), soluzioni intere
distinte da $-9$ a $10$, $s \neq 0$, $xy \neq 0$, $k \le 130$. Dall'identità $x^2 + y^2 = (x + y)^2 - 2xy$ si
ricava il prodotto, poi si procede come al livello 4 (esempio 7). Sempre due coppie.

1. $x + y = 5$, $x^2 + y^2 = 13$: $13 = 25 - 2xy$, $xy = 6$, $S = \{(2, 3), (3, 2)\}$.
2. $x + y = -1$, $x^2 + y^2 = 61$: $2xy = -60$, $xy = -30$, $S = \{(-6, 5), (5, -6)\}$.

## Livello 6: problemi

Quattro storie, con le quote: rettangolo con perimetro e area 4 su 10 (lati interi $a < b$, $a \le 12$,
$b \le 20$, esempio 8); rettangolo con perimetro e diagonale 3 su 10 (terne pitagoriche con ipotenusa fino a
50, esempio 9); triangolo rettangolo con perimetro e ipotenusa 1,5 su 10 (stesse terne, $x + y = P - d$);
rettangolo che non esiste 1,5 su 10 (perimetro e area con $\Delta < 0$, come il rettangolo di perimetro
$20$ e area $30$ della lezione). I passaggi scelgono le incognite con le limitazioni, scrivono il sistema,
lo risolvono come simmetrico e dicono che le due coppie sono la stessa figura. La risposta è la coppia di
lati, "$3$ cm e $4$ cm", oppure "Il rettangolo non esiste".

1. Perimetro $34$ cm e diagonale $13$ cm: $x + y = 17$, $x^2 + y^2 = 169$, $xy = 60$, lati $5$ cm e $12$ cm.
2. Perimetro $12$ cm e area $16\ \text{cm}^2$: $t^2 - 6t + 16 = 0$, $\Delta = -28$, il rettangolo non esiste.

## Esercizi "brutti" da evitare

- un sistema di grado $4$ o una risolvente di primo grado (retta verticale): fuori;
- al livello 1 una coppia ripetuta ($\Delta = 0$) o $p = 0$; ai livelli 1, 2 e 5 meno di due coppie;
- soluzioni irrazionali: il discriminante non quadrato si scarta;
- al livello 3 una retta orizzontale ($m = 0$) o punti con frazioni;
- al livello 4 $s = 0$ (la risolvente $t^2 + p = 0$ non ha il termine in $t$) o $p = 0$;
- al livello 6 un quadrato (lati uguali) come risposta.

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. Distrattori, in quest'ordine, poi quelli di riserva:

- livello 1: una sola coppia (quella intera); le coppie con $x$ e $y$ scambiati; l'insieme dei soli valori
  dell'incognita della risolvente (avviso "Scrivere le soluzioni come numeri", il controllo lo pretende);
  di riserva le radici con il segno cambiato, $S = \emptyset$;
- livello 2: una coppia con l'altra incognita ricavata dall'equazione di secondo grado, come $(1, -1)$
  dell'avviso (il controllo lo pretende quando esiste); il quadrato senza il doppio prodotto, quando dà
  soluzioni razionali; una sola coppia; i soli valori; le coppie scambiate;
- livello 3: secante: tangente in uno dei due punti, esterna, secante con le ordinate calcolate male
  ($mx - q$); tangente: esterna, tangente con l'ordinata sbagliata, secante con i punti della risolvente
  con il termine noto di segno sbagliato (quando sono interi), poi il punto con le coordinate scambiate;
  esterna: tangente nel punto della retta con $x = -\frac{B}{2}$, secante con la risolvente sbagliata,
  tangente nel vertice della parabola, secante in due punti vicini;
- livello 4: due coppie: una sola coppia (avviso "Dimenticare la coppia scambiata", il controllo lo
  pretende), le coppie di $t^2 + st + p = 0$ (avviso "Il segno della somma"), i soli numeri; una coppia: la
  coppia con i segni cambiati, $S = \emptyset$, il solo numero, due coppie; impossibile: il sistema è
  costruito in modo che $t^2 - st - p = 0$ (il segno del prodotto) abbia soluzioni intere, e i distrattori
  sono le sue due coppie, una sola coppia, i numeri, le coppie con il segno della somma sbagliato;
- livello 5: $xy = s^2 - k$ (il $2$ di $2xy$ dimenticato) e $xy = \frac{k - s^2}{2}$ (il segno), quando
  danno soluzioni intere; una sola coppia; le coppie con i segni cambiati; i soli numeri;
- livello 6: la somma dei lati uguale al perimetro, il $2$ di $2xy$ dimenticato, quando danno lati interi;
  poi due lati con la stessa somma (la stessa metà del perimetro) e un lato più lungo, "non esiste". Per il
  rettangolo che non esiste: la somma uguale al perimetro, il quadrato con quel perimetro, due lati con
  quell'area.

I distrattori degli errori della lezione escono solo quando danno numeri puliti: su 1.000 esercizi (seed 1)
$xy = s^2 - k$ compare 57 volte al livello 5, il segno del prodotto 66 volte, la somma uguale al perimetro 42
volte al livello 6. Le altre volte le opzioni vengono dalle riserve.

## Figure

Il sito non genera figure per gli esercizi. Vorrebbe una figura il livello 3 (la parabola e la retta con i
punti comuni, come le tre figure della lezione) e il livello 6 (il rettangolo con i lati $x$ e $y$ e la
diagonale; il triangolo rettangolo). Oggi si reggono sul testo.

## Verifica

- `sample.mts sistemi-secondo-grado 1000 all 1` e `... 50001`, passati a `verify.py`: PASS con tutti e due i
  seed (6.000 esercizi ciascuno). Quote con il seed 1: livello 3 secante 408, tangente 288, esterna 304;
  livello 4 due coppie 598, una coppia 199, impossibile 203; livello 6 area 408, diagonale 288, triangolo
  147, impossibile 157. Con il seed 50001: 396, 272, 332; 581, 230, 189; 396, 272, 185, 147.
- Esercizi diversi su 1.000 (seed 1): livello 1 650, livello 2 583, livello 3 966, livello 4 373, livello 5
  275, livello 6 363. I livelli 4-6 hanno pochi sistemi possibili con numeri piccoli (le coppie di interi
  e le terne pitagoriche sono poche).
- `width.mts sistemi-secondo-grado`: esce con 0. Problema più largo 154 px (livello 3), opzione più larga
  232 px (livello 3, `gathered`).
- Tutte le formule dei 6.000 esercizi (problema, soluzione, passaggi, opzioni, 92.522 in tutto) passano da
  KaTeX con `throwOnError`.
- Errori piantati a mano, 16, tutti bocciati dal controllo: indice dell'opzione giusta spostato (livello
  1); valori della giusta cambiati (livello 2); frazione non ridotta nella giusta (livello 1); coppia con
  frazione senza `\left(` (livello 2); caso sbagliato nei params (livello 3); retta secante data per tangente
  (livello 3); opzione doppia, lo stesso insieme con i valori in altro ordine (livello 4); tolta la coppia
  sola (livello 4); $1x$ nel testo (livello 4); sistema di grado 4 (livello 5); soluzione sbagliata
  (livello 5); perimetro cambiato nel testo (livello 6); impossibile marcato come area (livello 6); lati in
  ordine decrescente (livello 6); `params.lin` diverso dal testo (livello 1); ultimo passaggio sbagliato
  (livello 2). Il file con i 16 campioni passato a `verify.py` dà FAIL.
- `review.mts sistemi-secondo-grado` esce con 0; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Tutti i livelli sono a scelta multipla, come in `sistemi-di-equazioni`: per una risposta aperta
  servirebbe un tipo "insieme di coppie". Va bene aspettare?
- Al livello 3 la risposta mette insieme la posizione e i punti ("secante, $(0, -3)$ e $(3, 0)$"). Meglio
  due domande separate, prima la posizione e poi i punti?
- I distrattori degli errori veri ($xy = 12$ invece di $xy = 6$, la somma dei lati uguale al perimetro)
  escono solo quando danno numeri interi, cioè in meno di un esercizio su dieci. Si possono costruire gli
  esercizi apposta perché escano più spesso, a costo di meno varietà: conviene?
- Al livello 6 manca il distrattore "due rettangoli diversi" della nota (le coppie $(3, 4)$ e $(4, 3)$ lette
  come due figure), perché come opzione è lungo e poco naturale. Serve?
- Il triangolo rettangolo con perimetro e ipotenusa non è tra gli esempi della lezione (c'è il rettangolo con
  la diagonale): va bene come variante, o si tiene solo il rettangolo?
- Manca un livello sul grado del sistema (la prima sezione della lezione, "è di secondo grado?"). Lo si
  aggiunge come livello 0, con i sistemi di grado $2$ e $4$ da riconoscere?
- Al livello 2 la seconda equazione è sempre $ax^2 + by^2 = r$; i libri propongono anche $x^2 + y^2 + x = 5$ o
  $y^2 - xy = 3$. Servono?
