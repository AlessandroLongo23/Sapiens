# Equazione della retta e casi particolari

Generatore: `equazione-di-una-retta` (`src/lib/exercises/v2/generators/equazione-di-una-retta.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazione_di_una_retta.py`. Lezione collegata:
`docs/lezioni/riscritte/81-equazione-di-una-retta.md` (nota in `docs/lezioni/note/81-equazione-di-una-retta.md`,
sezione "Per il generatore", da cui vengono i livelli).

Lo studente riceve una retta (o un punto) e deve riconoscerla, cambiarle forma, trovarne i punti o il valore di un
parametro. Le convenzioni sono quelle della lezione: forma esplicita $y = mx + q$, forma implicita $ax + by + c = 0$
con i coefficienti interi, senza divisori comuni e con $a$ positivo, punti $A(-2, 5)$ con le frazioni tra
`\left( \right)`, rette orizzontali $y = k$ e verticali $x = h$, bisettrici "del I e III quadrante" e "del II e IV
quadrante", frazioni e mai decimali.

## Tipo di risposta

- Livello 2: `expression` con `form: "explicit"`, `value` il secondo membro per SymPy (`(3/2)*x + 2`) e `latex`
  l'equazione intera (`y = \frac{3}{2}x + 2`).
- Livello 4, coordinata mancante, e livello 7 quando $k$ esiste: `number`.
- Tutto il resto è `choice`: il tipo di retta, una retta verticale od orizzontale, una retta in forma implicita, un
  punto, la coppia di punti sugli assi, un caso particolare con la sua equazione, "nessun valore di $k$".

La variante a scelta multipla c'è sempre (la risposta stessa, oppure `toChoice()` che mescola le opzioni salvate in
`params.options`). Valori delle opzioni: `["verticale"]` per un tipo; `["x", "-2"]` per $x = -2$; `["4", "-6",
"-3"]` per $4x - 6y - 3 = 0$; `["2", "-1"]` per il punto $(2, -1)$; `["-3", "2"]` per $A(-3, 0),\ B(0, 2)$;
`["h", "2"]`, `["k", "-1/2"]`, `["m", "-3/5"]` per verticale, orizzontale, per l'origine; `["3"]` o `["none"]` per
$k$. Il controllo rilegge il testo di ogni opzione e lo confronta con i valori.

## Regole comuni

- Costruzione all'indietro: prima la risposta (il punto, $m$ e $q$, il valore di $k$), poi l'equazione.
- Coefficienti piccoli, come negli esempi della lezione: $|a|, |b| \le 7$, termine noto fino a 12 (20 per una retta
  costruita da un punto).
- Niente $1x$, $1y$, $1k$, $0x$, $+ -$, $- -$, termini nulli, $\frac{0}{\dots}$, $\frac{\dots}{1}$ nel testo e nelle
  opzioni.
- Quattro opzioni distinte, una sola giusta. Una retta scritta con altri coefficienti ma proporzionali a quelli
  giusti è la stessa retta: il controllo la conta come giusta, quindi non può fare da distrattore.
- La scelta del caso si fa una volta per esercizio, prima dei tentativi, così gli scarti non cambiano le quote.

## Livello 1: parallele agli assi e bisettrici

Due casi (esempio 1 e sezioni sugli assi e sulle bisettrici).

- Tipo (4 su 10): un'equazione tra $x = h$, $y = k$ ($h, k \ne 0$, una volta su quattro frazionari), $y = x$,
  $y = -x$, $y = 0$, $x = 0$; si sceglie tra verticale, orizzontale, le due bisettrici, l'asse $x$, l'asse $y$. Per
  $x = h$ c'è sempre "orizzontale" (avviso "La retta $x = 3$ non è orizzontale"), e viceversa.
- Punto (6 su 10): $A(x_A, y_A)$, coordinate non nulle da $-9$ a $9$, una volta su quattro con denominatore 2 o 3,
  $x_A \ne \pm y_A$. Si sceglie la parallela all'asse indicato. Distrattori: lo stesso numero con l'altra lettera
  ($y = x_A$ al posto di $x = x_A$, l'errore dell'avviso), la parallela all'altro asse, l'altra coordinata con la
  lettera sbagliata.

1. $x = \frac{4}{3}$: verticale; distrattori orizzontale, l'asse $x$, l'asse $y$.
2. $A(-4, 7)$, parallela all'asse $x$: $y = 7$; distrattori $y = -4$, $x = -4$, $x = 7$.

## Livello 2: dalla forma implicita a quella esplicita

$ax + by + c = 0$ con $a$ da 1 a 7, $b$ non nullo da $-6$ a $6$ (negativo 6 volte su 10, $\pm 1$ di rado), $c$ non
nullo da $-9$ a $9$, MCD 1 (esempio 2). Passaggi: il termine con la $y$ resta a primo membro, gli altri cambiano
segno; poi si divide per $b$ ogni termine. Distrattori dell'avviso "Dividere solo una parte del secondo membro":
diviso solo il termine con la $x$ ($y = \frac{3}{2}x - 4$), il segno di $b$ dimenticato ($y = -\frac{3}{2}x - 2$);
poi il segno del termine noto sbagliato, $m$ e $q$ scambiati.

1. $3x - 2y + 7 = 0$: $y = \frac{3}{2}x + \frac{7}{2}$; distrattori $y = \frac{3}{2}x - 7$,
   $y = -\frac{3}{2}x - \frac{7}{2}$, $y = \frac{3}{2}x - \frac{7}{2}$.
2. $2x - 2y - 3 = 0$: $y = x - \frac{3}{2}$; distrattori $y = x + 3$, $y = -x + \frac{3}{2}$, $y = x + \frac{3}{2}$.

## Livello 3: alla forma implicita con i coefficienti interi

Due casi.

- Esplicita (65 su 100): $y = mx + q$ con almeno una frazione, denominatori fino a 6 e prodotto dei denominatori
  fino a 24 (esempio 3). Si moltiplica per il minimo comune multiplo, si porta tutto a primo membro, si cambia segno
  se $a < 0$. Distrattori: il segno del termine noto non cambiato, il segno della $y$ non cambiato, la $y$ non
  moltiplicata, la $x$ o il termine noto non moltiplicati (solo se restano interi).
- Frazioni (35 su 100): $\pm\frac{x}{\alpha} \pm \frac{y}{\beta} + \gamma = 0$ con $\alpha \ne \beta$ da 1 a 6 e
  $\gamma$ intero o con denominatore 2, 3, 4, termine noto intero fino a 24 (esempio 7). Distrattori: $\gamma$ non moltiplicato, ogni denominatore
  preso come coefficiente della sua lettera ($2x - 3y + 6 = 0$ al posto di $3x - 2y + 6 = 0$), segni sbagliati.

Tutte le opzioni sono scritte con i coefficienti interi, senza divisori comuni e con $a > 0$, così la forma non
tradisce la risposta.

1. $y = -\frac{1}{2}x - \frac{2}{3}$: $3x + 6y + 4 = 0$; distrattori $3x + 6y - 4 = 0$, $3x - 6y + 4 = 0$,
   $3x + y + 4 = 0$.
2. $y = 2x + \frac{3}{4}$: $8x - 4y + 3 = 0$; distrattori $8x - 4y - 3 = 0$, $8x + 4y + 3 = 0$, $8x - y + 3 = 0$.

## Livello 4: punti che appartengono alla retta

Due casi, metà e metà (esempio 4).

- Appartenenza: la retta in forma implicita (o esplicita una volta su tre), quattro punti a coordinate intere, uno
  solo sulla retta. Distrattori: il punto con le coordinate scambiate (avviso "Scambiare le coordinate"; la
  generazione scarta le rette su cui anche quello sta), un segno cambiato, una coordinata spostata di 1. I passaggi
  sostituiscono ogni punto.
- Coordinata: $ax + by + c = 0$ e l'ascissa (6 volte su 10) o l'ordinata del punto $C$, non nulla; la risposta,
  intera o con denominatore fino a 4, è un numero. Distrattori: il valore dato messo nell'altra lettera, il segno
  sbagliato nel trasporto, la divisione per il coefficiente dimenticata.

1. $3x + 5y + 11 = 0$: $(-2, -1)$; distrattori $(-1, -2)$, $(-2, 1)$, $(2, -1)$.
2. $5x - 6y - 10 = 0$, $y_C = -5$: $x_C = -4$; distrattori $-\frac{35}{6}$, $-20$, $4$.

## Livello 5: intersezioni con gli assi

$ax + by + c = 0$ con $a, b, c$ non nulli (o $y = mx + q$ tre volte su dieci), 6 volte su 10 con almeno un punto a
coordinata frazionaria, denominatori fino a 6 (esempio 5). La risposta è la coppia $A$ sull'asse $x$, $B$ sull'asse
$y$. Distrattori: i due valori scambiati tra gli assi (avviso "Quale coordinata si annulla": $x = 0$ usato per il
punto sull'asse $x$), i due segni cambiati, un segno cambiato.

1. $2x - 2y - 1 = 0$: $A\left(\frac{1}{2}, 0\right),\ B\left(0, -\frac{1}{2}\right)$.
2. $y = -4x - 1$: $A\left(-\frac{1}{4}, 0\right),\ B(0, -1)$; distrattore scambiato $A(-1, 0),\ B\left(0, -\frac{1}{4}\right)$.

## Livello 6: rette con $a = 0$, $b = 0$ o $c = 0$

Un terzo per caso (esempio 8): $px + c = 0$ con $p$ da 2 a 6 (verticale), $py + c = 0$ con $|p|$ da 2 a 6
(orizzontale), $ax + by = 0$ con MCD 1 e $a \ne |b|$ (per l'origine). L'opzione dice il caso e l'equazione più
semplice: "verticale: $x = 2$", "orizzontale: $y = -\frac{1}{2}$", "per l'origine: $y = -\frac{3}{5}x$".
Distrattori: l'altra direzione con lo stesso numero (l'errore di $x = 3$ e dell'avviso "Un'equazione senza $y$ non è
un numero"), il segno sbagliato, la divisione fatta al contrario ($y = -\frac{3}{7}$ al posto di $-\frac{7}{3}$);
per l'origine $-\frac{b}{a}$, $\frac{a}{b}$, $\frac{b}{a}$, $-a$. Il controllo verifica che un'opzione con la retta
giusta ma l'etichetta sbagliata non ci sia.

1. $-3y - 7 = 0$: orizzontale, $y = -\frac{7}{3}$; distrattori $y = -\frac{3}{7}$, $y = \frac{7}{3}$, verticale
   $x = -\frac{7}{3}$.
2. $-3y - 3 = 0$: orizzontale, $y = -1$; distrattori verticale $x = 1$, orizzontale $y = 1$, verticale $x = -1$.

## Livello 7: una retta con un parametro

Una retta $a(k)x + b(k)y + c(k) = 0$ con $k$ in un solo coefficiente, nella forma $(k + \alpha)$ o
$(2k + \alpha)$ (esempio 9). Domande: orizzontale (25 su 100), verticale (20), per l'origine (20), per un punto $A$
(35). Una volta su quattro nessun valore di $k$ va bene: il coefficiente da annullare non contiene $k$, oppure $A$
ha zero proprio nella coordinata che moltiplica $k$. Il caso in cui ogni $k$ va bene è escluso. $k$ intero o con
denominatore 2. Distrattori: "nessun valore di $k$" (quando $k$ esiste), il valore che annulla il coefficiente con
$k$ (la retta orizzontale o verticale al posto dell'altra), le coordinate di $A$ scambiate, il segno cambiato,
valori vicini.

1. $2x + (k - 3)y + 7 = 0$, verticale: $k = 3$; distrattori $k = 4$, $k = -3$, nessun valore.
2. $6x + (2k + 2)y - 1 = 0$, per $A(-2, 0)$: nessun valore, perché la $k$ sparisce e resta $-13 = 0$; distrattori
   $k = -1$ (il valore che annulla il coefficiente con $k$), $k = 1$, $k = 0$.

## Esercizi diversi su 1.000 per livello

Contati su `(consegna, problema)` con i seed da 1 a 1.000: livello 1 553, livello 2 670, livello 3 841, livello 4
844, livello 5 710, livello 6 336, livello 7 993 (con i seed da 7001: 565, 680, 831, 854, 720, 339, 979). Tutti
sopra 100.

## Verifica

- `sample.mts equazione-di-una-retta 1000 all 1 | verify.py`: PASS, 7.000 su 7.000; di nuovo con il seed 7001: PASS.
- Quote (seed 1): livello 1 tipo 408 / punto 592; livello 3 esplicita 656 / frazioni 344; livello 4 504 / 496;
  livello 5 interi 408 / frazionari 592; livello 6 341 / 331 / 328; livello 7 esiste 731 / nessuno 269.
- Errori piantati, tutti bocciati: risposta del livello 2 cambiata; frazione non ridotta nella forma esplicita;
  opzione giusta spostata (livelli 3 e 7); distrattore uguale alla retta giusta moltiplicata per 2 (bocciato due
  volte: coefficienti con un divisore comune e due opzioni giuste); coordinata del livello 4 cambiata; testo di
  un'opzione diverso dai suoi valori (livelli 4 e 5); vincolo violato (due coefficienti nulli al livello 6);
  etichetta sbagliata sulla retta giusta al livello 6; $k$ cambiato; manca il distrattore con la lettera scambiata
  al livello 1; $1x$ nel problema (preso da un campione con $a = 1$); equazione del livello 1 cambiata sotto le
  stesse opzioni.
- `width.mts`: 0 formule oltre 350 px e 0 opzioni oltre 252 px; la più larga è "bisettrice del I e III quadrante"
  (237 px).
- `review.mts` esce con 0; `steps-scan` non segnala niente.

## Figure

Il sito non disegna ancora le figure degli esercizi, quindi tutto si regge sul testo. Una figura servirebbe:

- al livello 1 (tipo) e al livello 6, per far vedere la retta verticale od orizzontale che lo studente ha
  scelto, soprattutto nella soluzione;
- al livello 5, per mostrare $A$ e $B$ sugli assi nella soluzione (come la figura dell'esempio 5);
- a un livello che qui manca, "disegnare con $q$ e $m$" (esempio 6 e punto 5 della nota): il secondo punto trovato
  con lo spostamento dato dal denominatore di $m$ si controlla bene solo con un disegno, e senza figure si ridurrebbe
  a una coppia di punti da calcolare.

## Domande per la revisione

- Manca il livello "disegnare con $q$ e $m$" della nota (esempio 6): senza figura diventa una domanda sul secondo
  punto, $(0, q)$ e $(n, q + nm)$. Va aggiunto così o si aspetta la figura?
- Livello 6: le opzioni dicono insieme il caso e l'equazione ("verticale: $x = 2$"), così il distrattore
  "orizzontale: $y = 2$" nasce dall'errore di $x = 3$. Va bene, o è meglio separare la domanda sul tipo da quella
  sull'equazione?
- Livello 7: quando nessun valore va bene, l'esercizio è a scelta multipla; quando $k$ esiste la risposta è un
  numero e la variante a scelta multipla ha sempre "nessun valore di $k$" tra i distrattori. Per una risposta aperta
  futura servirà un modo di scrivere "nessun valore".
- Al livello 6 e al livello 2 compaiono anche $b$ negativi ($-3y - 7 = 0$), che la lezione negli esempi non usa: li
  teniamo come difficoltà o si scrive sempre il primo coefficiente positivo?
- Al livello 1 il caso "tipo" ha pochi esercizi diversi (le bisettrici e gli assi sono sempre gli stessi quattro):
  il livello regge perché il caso "punto" ne ha centinaia.
