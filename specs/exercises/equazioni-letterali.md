# Equazioni letterali

Generatore: `equazioni-letterali` (`src/lib/exercises/v2/generators/equazioni-letterali.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_letterali.py`. Lezione collegata:
`docs/lezioni/riscritte/50-equazioni-letterali.md` (nota in `docs/lezioni/note/50-equazioni-letterali.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione. I primi cinque seguono gli esempi 1-5 (coefficiente numerico,
poi la discussione con un caso, con il caso indeterminato, con tre casi, con i denominatori); il sesto
e il settimo sono le formule inverse degli esempi 6-8, prima come lettere e poi con i numeri. Il cenno
alle equazioni letterali fratte (esempio 9) non ha un livello: vedi le domande in fondo.

## Forma della risposta

- Livello 1: `expression` (la soluzione, per esempio `3a`), con la variante a scelta multipla fra quattro
  valori `x = ...`.
- Livelli 2-5: la risposta è una discussione intera, e nessun tipo di risposta di oggi tiene "una
  soluzione per i valori generici e un esito per ogni valore particolare". Quindi la risposta è
  direttamente una `choice` fra quattro discussioni, come la coppia quoziente e resto di
  `polinomi-ruffini`. Ogni opzione è un `\begin{gathered}` con una riga per caso, nella notazione della
  tabella della lezione:

  ```
  a \neq \pm 1\text{: } S = \left\{ \frac{1}{a - 1} \right\}
  a = -1\text{: } S = \mathbb{R}
  a = 1\text{: } S = \emptyset
  ```

  La prima riga esclude i valori particolari (`a \neq \pm v` quando sono opposti, altrimenti
  `a \neq v_1,\ a \neq v_2`); poi una riga per ogni valore, in ordine crescente. L'opzione "divisione
  senza discutere" è una riga sola: `\text{per ogni } a\text{: } S = \left\{ ... \right\}`.
  I `values` dell'opzione dicono la stessa cosa in forma leggibile dal controllo:
  `["x=(N)/(D)", "a=-1:ind", "a=1:imp"]`, con `det:<valore>` per un valore particolare a cui l'opzione
  attribuisce una sola soluzione, e `["per_ogni", "x=..."]` per la divisione senza discussione.
  La soluzione (`solution`) dice la stessa discussione su una riga sola, senza ambienti, perché la
  pagina la spezza a ogni `\text{}` (`presentStep` in `src/lib/exercises/present.ts`):
  `\text{per } a \neq \pm 1\text{: } S = \left\{ \frac{4}{a - 1} \right\} \text{; per } a = -1\text{: } S = \mathbb{R} \text{; per } a = 1\text{: } S = \emptyset`.
  Il controllo la rilegge e la confronta con la verità; una soluzione con `\begin` è bocciata.
- Livello 6: `expression` (la formula inversa, in SymPy: `2*A/(B+b)`), con la variante a scelta
  multipla fra quattro formule `h = ...`.
- Livello 7: `number` (il valore della lettera, intero positivo), con la variante fra quattro numeri.

## Rappresentazione

- Livelli 1-5: `params.lhs` e `params.rhs` sono liste di termini; un termine è un monomio
  `c·a^p·x^e` (c razionale, e = 0 o 1) oppure un fattore davanti a una parentesi (`a(x - 1)`,
  `2(x - a)`, `-3(x + 5)`). Poi `params.equation` (l'equazione in SymPy), `params.solution` (la
  soluzione generica N/D in SymPy), `params.cases` (`"2:ind"`, `"-1:imp"`) e `params.case`.
- Livelli 6-7: `params.formula` (id della formula), `params.lhs`, `params.rhs`, `params.target`
  (la lettera da ricavare, `s0` e `v0` per $s_0$ e $v_0$); al livello 7 anche `params.data` (i
  valori dati), `params.inverse` e `params.substituted`.

Il testo è l'equazione nell'incognita x con il parametro a, scritta come nella lezione: prima i termini
con la x (con la potenza di a più alta prima: `a^2x`, `ax`, `x`), poi i termini noti; un fattore
davanti alla parentesi sta prima di tutto; frazioni intere in `\frac` (`\frac{ax}{6}`, `\frac{2a}{3}`).
Mai `1x`, `1a`, `+ -`, `a^1`, termini nulli.

## Costruzione all'indietro

Si sceglie la forma normale $A(a)\,x = B(a)$ attraverso i suoi fattori, e con essa la soluzione
generica e i valori particolari; poi i monomi di $A x$ e di $B$ si distribuiscono sui due membri:
ognuno resta dov'è, passa all'altro membro con il segno cambiato, oppure si divide in due pezzi, uno
per membro (come $3x$ e $x$ nell'esempio 1, che danno $2x$). A volte si aggiunge a entrambi i membri
lo stesso termine noto, che si cancella (il $-2a$ dell'esempio 3), e a volte un termine con la x e un
termine noto con un fattore comune si scrivono come parentesi ($ax - a$ diventa $a(x - 1)$, come
nell'esempio 2). I termini simili dello stesso membro si sommano prima di scrivere.

- Livello 1: A intero da -6 a 6, diverso da 0 e da ±1; soluzione $x = ma + n$ con m da -5 a 5 (non
  0) e n da -6 a 6 (0 in circa 4 casi su 10); $B = A(ma + n)$.
- Livello 2: $A = ca$ con c tra 1, 2, 3, -1, -2; $B = ma + n$ con n da -9 a 9 non nullo (così per
  $a = 0$ viene $0x = n$, impossibile) e m nullo in metà dei casi, altrimenti da -4 a 4. Il termine
  $cax$ resta a primo membro.
- Livello 3: $A = a - r$ con r da -5 a 5 non nullo. In circa 2 casi su 3
  $B = (a - r)(pa + s)$, con p tra 1, -1, 2 e s da -5 a 5: soluzione $pa + s$, indeterminata per
  $a = r$ (l'esempio 3). Negli altri $B = ma + n$ con $B(r) \neq 0$: soluzione $\frac{B}{a - r}$,
  impossibile per $a = r$. La x compare in almeno due termini, quindi va raccolta.
- Livello 4: $A = (a - r_1)(a - r_2)$ con $r_1 \neq r_2$ da -4 a 4 (opposti in circa 4 casi su 10,
  come $a^2 - 1$; lo zero dà $a(a - r)$); $B = (a - r_2)\,k$ con k da -4 a 4 non nullo (7 casi su 10)
  oppure $B = (a - r_2)(\pm a + s)$ con $B(r_1) \neq 0$. Soluzione $\frac{k}{a - r_1}$ (o
  $\frac{\pm a + s}{a - r_1}$), impossibile per $a = r_1$, indeterminata per $a = r_2$: i tre casi
  dell'esempio 4.
- Livello 5: dopo aver moltiplicato per il mcm L (tra 4, 6, 8, 10, 12), la forma è
  $(r - a)x = ka + n$ con r da 1 a 6, k da -4 a 4 non nullo, n nullo in metà dei casi (come
  $2a$ nell'esempio 5) e $kr + n \neq 0$: impossibile per $a = r$. Il termine $rx$ sta a primo
  membro e $ax$ a secondo membro, così spostandolo si ottiene il coefficiente con il meno; poi ogni
  termine si divide per L e si semplifica. Servono almeno due denominatori diversi.
- Livello 6: una formula e una lettera da una tabella di 17 formule e 35 lettere (sotto).
- Livello 7: la stessa tabella senza la circonferenza (π non dà numeri interi); si scelgono i valori
  delle lettere indipendenti, la lettera a sinistra della formula si calcola, e si chiede una delle
  altre. Dati e risposta interi positivi; la risposta non è uguale a uno dei dati.

Le formule del livello 6, con la lettera da ricavare: velocità media $v = \frac{s}{t}$ (s, t); area del
trapezio $A = \frac{(B + b)h}{2}$ (h, B, b); moto uniforme $s = s_0 + vt$ (t, v, $s_0$); area del
triangolo $A = \frac{bh}{2}$ (b, h); perimetro del rettangolo $P = 2(b + h)$ (b, h); secondo
principio $F = ma$ (m, a); densità $d = \frac{m}{V}$ (m, V); moto accelerato $v = v_0 + at$ (a, t,
$v_0$); area del rombo $A = \frac{Dd}{2}$ (D, d); potenza $P = \frac{L}{t}$ (L, t); media di due
numeri $M = \frac{a + b}{2}$ (a, b); perimetro del triangolo isoscele $P = 2l + b$ (l, b); pressione
$p = \frac{F}{S}$ (F, S); circonferenza $C = 2\pi r$ (r); gradi Celsius e Fahrenheit
$F = \frac{9}{5}C + 32$ (C); interesse semplice $I = \frac{Crt}{100}$ (C, t); volume del
parallelepipedo $V = abc$ (c, a). Le prime tre sono quelle della lezione.

## Regole comuni

- Livelli 1-5: coefficienti interi fino a 12 nel testo, denominatori fino a 12; al massimo 7 termini
  e 25 caratteri visibili (senza `\frac`, graffe, `^` e spazi), perché l'equazione stia in 350 px a
  18 px sul telefono: con 26 caratteri si arrivava a 346 px, e le equazioni più lunghe erano anche
  difficili da leggere. Il testo non è già in forma normale: c'è sempre qualcosa da spostare.
- I passaggi sono quelli del procedimento della lezione: il mcm (livello 5), togli le parentesi, porta
  i termini con la x a primo membro, riduci e raccogli la x, scomponi il coefficiente e il termine
  noto, i valori che annullano il coefficiente, la divisione per i valori generici (con "semplifica"
  quando un fattore si cancella), e per ogni valore particolare la sostituzione nella forma normale
  ($0x = B(r)$), come dice il riquadro "Sostituire nella soluzione invece che nella forma normale".
- La soluzione generica si scrive con i coefficienti ridotti e con il numeratore senza segni meno
  quando tutti i suoi termini sono negativi: $\frac{3a}{a - 2}$ e non $\frac{-3a}{2 - a}$. Un
  denominatore che comincerebbe con il meno cambia segno, e il meno va davanti alla frazione
  ($-\frac{1}{a + 4}$). Altrimenti l'ordine è quello della lezione: $\frac{2a}{3 - a}$.
- Livelli 6-7: i passaggi di ogni formula sono scritti a mano, come negli esempi 6-8 (moltiplica per
  2, dividi per tutta la somma $B + b$, porta $s_0$ a primo membro). Al livello 7 l'ultimo passaggio
  sostituisce i numeri nella formula inversa: $B = \frac{2 \cdot 24}{4} - 5 = 7\ \text{cm}$.

## Livello 1: coefficiente numerico

Il parametro solo nei termini noti, nessuna discussione (esempio 1).

1. $3x - a = x + 5a$: $2x = 6a$, $x = 3a$.
2. $4x + 5a = -2x - 7a$: $6x = -12a$, $x = -2a$. Distrattori: $x = -\frac{a}{3}$ (i termini noti
   spostati senza cambiare segno), $x = 2a$ (segno), $x = -6a$ (le x spostate senza cambiare segno).

## Livello 2: coefficiente con il parametro, a = 0

$cax = B$ con $B(0) \neq 0$: impossibile per $a = 0$ (esempio 2).

1. $a(x + 4) = 4a + 8$: $ax = 8$; se $a \neq 0$, $S = \{\frac{8}{a}\}$; se $a = 0$, $S = \emptyset$.
2. $-2ax + 5 = 2$: $-2ax = -3$; se $a \neq 0$, $S = \{\frac{3}{2a}\}$; se $a = 0$, $S = \emptyset$.

## Livello 3: raccogliere la x, il caso indeterminato

$(a - r)x = B$, indeterminata (2 su 3) o impossibile per $a = r$ (esempio 3).

1. $a(x - a) - x + 5 = 4a$: $(a - 1)x = a^2 + 4a - 5 = (a - 1)(a + 5)$; se $a \neq 1$,
   $S = \{a + 5\}$; se $a = 1$, $S = \mathbb{R}$.
2. $a(x + 1) + 3x - 5 = a + 1$: $(a + 3)x = 6$; se $a \neq -3$, $S = \{\frac{6}{a + 3}\}$; se
   $a = -3$, $S = \emptyset$.

## Livello 4: coefficiente con due fattori, tre casi

Esempio 4.

1. $a^2x - x - 4 = 4a$: $(a - 1)(a + 1)x = 4(a + 1)$; se $a \neq \pm 1$, $S = \{\frac{4}{a - 1}\}$;
   se $a = -1$, $S = \mathbb{R}$; se $a = 1$, $S = \emptyset$.
2. $a^2x = 2ax + 3x + 2a - 6$: $(a + 1)(a - 3)x = 2(a - 3)$; se $a \neq -1,\ a \neq 3$,
   $S = \{\frac{2}{a + 1}\}$; se $a = -1$, $S = \emptyset$; se $a = 3$, $S = \mathbb{R}$.

## Livello 5: denominatori e coefficiente con il meno

Esempio 5.

1. $\frac{x}{6} - \frac{a}{2} = \frac{ax}{12} - \frac{3a}{4}$: per 12, $2x - 6a = ax - 9a$, cioè
   $(2 - a)x = -3a$; se $a \neq 2$, $S = \{\frac{3a}{a - 2}\}$; se $a = 2$, $S = \emptyset$.
   Il termine noto si annulla per $a = 0$, che non è un caso particolare.
2. $\frac{x}{6} + 1 = \frac{ax}{6} - \frac{2a}{3}$: per 6, $(1 - a)x = -4a - 6$; se $a \neq 1$,
   $S = \{\frac{4a + 6}{a - 1}\}$; se $a = 1$, $S = \emptyset$.

## Livello 6: formule inverse

1. Ricava l'altezza h dalla formula dell'area del trapezio, $A = \frac{(B + b)h}{2}$:
   $h = \frac{2A}{B + b}$. Distrattori: $\frac{2A}{B} + b$ (dividere solo un pezzo, il riquadro della
   lezione), $\frac{A}{B + b}$ (il 2 dimenticato), $\frac{B + b}{2A}$ (frazione capovolta).
2. Ricava la velocità v da $s = s_0 + vt$: $v = \frac{s - s_0}{t}$. Distrattori:
   $\frac{s + s_0}{t}$, $\frac{s}{t} - s_0$, $\frac{t}{s - s_0}$.

## Livello 7: formule inverse con i numeri

1. $A = \frac{(B + b)h}{2}$ con $A = 24\ \text{cm}^2$, $h = 4\ \text{cm}$, $b = 5\ \text{cm}$: ricava B
   e calcolalo. $B = \frac{2A}{h} - b = 7$ cm (l'esempio 7 della lezione).
2. $s = s_0 + vt$ con $s = 235$ km, $v = 40$ km/h, $t = 5$ h: $s_0 = s - vt = 35$ km. Distrattore
   435 ($s + vt$), poi valori vicini.

## Da evitare

- Il coefficiente già raccolto nel testo ai livelli 3-4 (non ci sarebbe niente da raccogliere): il
  controllo chiede la x in almeno due termini.
- Un'equazione già in forma normale ($3x = 6a$): il controllo chiede qualcosa da spostare.
- Equazioni troppo lunghe (vedi le regole comuni).
- Valori particolari non interi, o radici del coefficiente che non si leggono dai fattori.
- Al livello 7, una risposta uguale a uno dei dati, o non intera.

## Distrattori

Presi dai riquadri `ad-warning` della lezione e dagli errori di trasporto.

- Livello 1: termini noti spostati senza cambiare segno, termini con la x spostati senza cambiare
  segno, soluzione con il segno opposto, divisione per il coefficiente dimenticata; poi valori vicini.
- Livello 2: "per ogni a" (riquadro "Dividere per il parametro senza pensarci"), impossibile scambiato
  con indeterminata, soluzione con il segno opposto, termini noti spostati senza cambiare segno, lo
  zero del termine noto preso come caso particolare.
- Livello 3: "per ogni a" (sostituire nella soluzione dà un valore anche per $a = r$), indeterminata
  scambiata con impossibile, valore particolare con il segno sbagliato ($a = -r$ da $a - r = 0$),
  soluzione con il segno opposto.
- Livello 4: per il valore indeterminato una sola soluzione, quella che dà la formula generica
  (riquadro "Sostituire nella soluzione invece che nella forma normale"); impossibile e indeterminata
  scambiati; il caso indeterminato dimenticato; semplificato il fattore sbagliato
  ($\frac{k}{a - r_2}$); "per ogni a"; valori particolari con il segno sbagliato.
- Livello 5: lo zero del termine noto preso come caso particolare (riquadro "Cercare i casi particolari
  nel termine noto"), il segno del coefficiente perso ($\frac{B}{a - r}$ invece di $\frac{B}{r - a}$),
  impossibile scambiato con indeterminata, "per ogni a", termini noti spostati senza cambiare segno.
- Livello 6: tre formule sbagliate scritte a mano per ogni lettera: dividere solo un pezzo, fattore
  dimenticato, frazione capovolta, segno sbagliato nel trasporto, prodotto invece di quoziente.
- Livello 7: le stesse formule sbagliate calcolate con i dati, quando danno un intero positivo; poi
  valori vicini.

Quattro opzioni distinte, e il controllo lo verifica sul significato (stessa soluzione generica e
stessi casi), non sulla scrittura.

## Verifica

- `sample.mts equazioni-letterali 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con il seed 7001:
  PASS. Livello 3: 392 impossibili e 608 indeterminate su 1.000 (seed 1), 379 e 621 (seed 7001),
  dentro l'intervallo 0,18-0,48 e 0,52-0,82 di `CASE_RANGES`.
- Il controllo Python rilegge l'equazione dal LaTeX del problema, la sviluppa con SymPy, ricava
  coefficiente e termine noto, trova i valori che annullano il coefficiente con `solve` e la soluzione
  generica con `cancel`; rilegge ogni opzione dal suo LaTeX e la confronta con i suoi `values` e con
  la verità. Al livello 6 risolve la formula con `solve`; al livello 7 rilegge i dati dal problema.
- Errori piantati a mano, tutti bocciati: risposta del livello 1 cambiata; indice della risposta
  giusta spostato (livelli 1, 2, 6); indeterminata cambiata in impossibile nell'opzione giusta, nel
  LaTeX e nei `values` (livello 3); LaTeX e `values` di un'opzione in disaccordo (livello 4); due
  opzioni uguali (livello 4); caso indeterminato tolto dall'opzione giusta (livello 4); equazione
  del livello 2 cambiata in $ax = a$ (indeterminata e già in forma normale); coefficiente già raccolto
  al livello 3; un solo denominatore al livello 5; segno del denominatore cambiato nell'opzione giusta
  (livello 5); formula inversa sbagliata (livello 6); valore sbagliato e dato cambiato nel problema
  (livello 7); `1x` nel testo; soluzione scritta con `\begin{gathered}` e soluzione con
  indeterminata cambiata in impossibile (livello 4); equazione di 9 termini e 32 caratteri; riga di errore del generatore.
- `review.mts`: esce con 0, tutto il LaTeX passa da KaTeX.
- `width.mts`: esce con 0. Problemi al massimo 340 px (livello 3), opzioni al massimo 233 px
  (livello 4). Misurati anche tutti i 1.000 esercizi di ogni livello con una copia temporanea dello
  script: nessuno oltre i limiti (massimo 340 px e 233 px).
- Esercizi diversi su 1.000 (seed 1, poi 7001): livello 1 985 e 978, livello 2 973 e 972, livello 3
  996 e 997, livello 4 986 e 991, livello 5 825 e 818, livello 6 35 e 35, livello 7 948 e 940.
  Il livello 6 ne ha 35 perché sono tutte le coppie formula e lettera della tabella: con le lettere
  si ricava una formula, e non c'è niente da variare senza inventare formule. Il livello 7 usa le
  stesse formule con i numeri.

## Domande per la revisione

- Il parametro si chiama sempre a, come negli esempi della lezione. La nota della lezione propone di
  rinominarlo k, perché la forma normale $ax = b$ usa a anche per il coefficiente; se si decide, cambia in
  pochi punti del generatore (la scrittura dei monomi e delle opzioni) e del controllo.
- La discussione è scritta in forma compatta, una riga per caso (`a = 1: S = ∅`), per stare nei 252 px
  del pulsante di risposta; la lezione scrive "se a = 1, l'equazione è impossibile, S = ∅". Va bene
  così o serve la parola "impossibile" nell'opzione?
- Il livello 5 è sempre impossibile nel valore particolare, come l'esempio 5; si potrebbe aggiungere
  il caso indeterminato ($B = k(r - a)$, soluzione costante). Da decidere se serve.
- Le formule del livello 6 oltre alle tre della lezione vengono da geometria e fisica del biennio
  (densità, pressione, potenza, interesse semplice, gradi Fahrenheit): vanno bene per il primo anno o
  qualcuna è da togliere? Il livello 6 ha 35 esercizi diversi in tutto.
- Le equazioni letterali fratte (esempio 9) non hanno un livello: nella lezione sono un cenno. Se
  servono, sarebbe un ottavo livello con la condizione sul parametro che viene dalla C.E.
- Al livello 7, quando le formule sbagliate non danno un intero (per esempio $\frac{P}{t}$), i
  distrattori sono valori vicini alla risposta (±1), che si scartano con un conto a mente.
