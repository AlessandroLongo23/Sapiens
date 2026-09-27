# Disequazioni di secondo grado

Generatore: `disequazioni-secondo-grado` (`src/lib/exercises/v2/generators/disequazioni-secondo-grado.ts`).
Verifica indipendente: `scripts/exercises/checkers/disequazioni_secondo_grado.py`. Lezione collegata:
`docs/lezioni/riscritte/88-disequazioni-secondo-grado.md` (nota in `docs/lezioni/note/88-disequazioni-secondo-grado.md`,
sezione "Per il generatore", da cui vengono i sette livelli).

Lo studente riceve una disequazione di secondo grado e sceglie l'insieme delle soluzioni. La consegna è sempre
"Risolvi la disequazione.". I passaggi seguono il procedimento in cinque passi della lezione: portare tutto a
primo membro, rendere positivo il coefficiente di $x^2$ moltiplicando per $-1$ e cambiando il verso, calcolare
$\Delta$ e le soluzioni $x_1 < x_2$ dell'equazione associata, scegliere i valori esterni (verso $>$) o
interni (verso $<$), aggiungere gli estremi con $\geq$ e $\leq$. Con $\Delta = 0$ e $\Delta < 0$ si usa la
tabella riassuntiva; le incomplete si risolvono come nella lezione (pure con $x^2 = k^2$, spurie raccogliendo $x$).

## Tipo di risposta

`choice` fin dall'inizio, a tutti i livelli, come in `disequazioni-razionali`: la risposta è un'unione di
intervalli, e nessun tipo di oggi la contiene. `toChoice()` restituisce la risposta stessa.

Le quattro opzioni sono scritte tutte in una delle due forme della lezione, scelta a caso metà e metà
(`params.notation`) ai livelli 1-4 e 7:

- `disequazioni`: $x < -1 \ \text{ oppure } \ x > 3$, $-2 \leq x \leq 3$, $x = -2 \ \text{ oppure } \ x = 3$;
- `intervalli`: $S = \,\mathopen{]}-\infty, -1\mathclose{[}\, \cup \,\mathopen{]}3, +\infty\mathclose{[}$, con
  `\mathopen{]}` e `\mathclose{[}` per gli estremi esclusi e `\left]` … `\right[` quando un estremo è una
  frazione o un radicale (esempi 2 e 4 della lezione); $S = \{-2, 3\}$ per due punti.

Due intervalli con una frazione o un radicale vanno su due righe con `\begin{gathered}`, come nella lezione
(la seconda riga comincia con `\cup`); nella forma `disequazioni` vanno su due righe solo con i radicali (la
seconda riga comincia con `\text{oppure}`). Gli insiemi speciali della tabella si scrivono sempre come insiemi:
$S = \mathbb{R}$, $S = \emptyset$, $S = \mathbb{R} \setminus \{3\}$, $S = \{3\}$; per questo i livelli 5 e 6
usano solo la forma `intervalli`.

La soluzione (`solution`) è la forma con gli intervalli (o l'insieme speciale). L'ultimo passaggio è la forma
con "oppure", oppure $x \neq 3$, $x = 3$, "Ogni $x$ è soluzione.", "Nessun $x$ è soluzione.". Valori delle
opzioni: un intervallo per elemento, `["(-oo,-1)", "(3,oo)"]`, un punto come intervallo chiuso degenere
`"[3,3]"`, $\mathbb{R}$ come `"(-oo,oo)"`, $\emptyset$ come lista vuota; gli estremi irrazionali in forma SymPy
(`"1-sqrt(5)"`, `"(3+sqrt(17))/2"`).

Estremi in forma semplificata: radicando libero da quadrati, una frazione sola $\frac{A \pm K\sqrt{r}}{D}$ con
$\text{MCD}(A, K, D) = 1$, il segno meno davanti a una frazione razionale. Il controllo ricostruisce la forma
semplificata di ogni estremo da SymPy e la confronta con il testo.

## Costruzione all'indietro

Si scelgono prima gli zeri del trinomio (interi, frazionari, irrazionali dai coefficienti, doppi) o, con
$\Delta < 0$, i coefficienti con il discriminante negativo, e poi si scrive il testo. La soluzione viene dalla
regola della lezione (con $a > 0$ valori esterni per $>$ e $\geq$, interni per $<$ e $\leq$; la tabella con
$\Delta = 0$ e $\Delta < 0$). `params` contiene la forma (`form`), il verso (`op`), i coefficienti dei due
membri per potenze crescenti (`lhs`, `rhs`), la notazione, la soluzione e per ogni opzione l'errore da cui
viene (`optionTags`, `giusta` per quella giusta). Il controllo Python non usa i `params` per la risposta:
rilegge la disequazione dal testo e la risolve con SymPy (`reduce_rational_inequalities`).

## Regole comuni

- Polinomi per potenze decrescenti; niente $1x$, $+ -$, termini nulli.
- Con $\geq$ e $\leq$ gli estremi finiti della soluzione sono compresi, con $>$ e $<$ esclusi (controllato).
- Ai livelli 1-6 il trinomio è completo ($b \neq 0$, $c \neq 0$); ai livelli 1-4 ha due zeri distinti.
- La soluzione non è mai vuota né $\mathbb{R}$ ai livelli 1-4; i distrattori di quei livelli non sono mai
  vuoti né $\mathbb{R}$ (tranne `ordine`, che è scritto con gli intervalli sbagliati).
- Tutti e quattro i versi a ogni livello, scelti a caso.

## Livello 1: valori interni o esterni

$x^2 + bx + c$ con zeri interi distinti tra $-9$ e $9$, trinomio completo, $|c| \leq 40$, secondo membro zero.
Esempio 1 della lezione.

1. $x^2 - 4x - 12 \leq 0$: $\Delta = 16 + 48 = 64$, $x_{1,2} = \frac{4 \pm 8}{2}$, valori interni, $S = [-2, 6]$.
2. $x^2 - x - 12 > 0$: $\Delta = 49$, $x_1 = -3$, $x_2 = 4$, $x < -3 \ \text{ oppure } \ x > 4$.

## Livello 2: coefficiente a maggiore di 1

$(d_1x - n_1)(d_2x - n_2)$ sviluppato, con $d_1 \in \{1, 2, 3\}$, $d_2 \in \{2, 3\}$, $|n_i| \leq 7$ primi con
$d_i$: almeno uno zero frazionario, $a = d_1d_2$, $|b|, |c| \leq 20$, $\Delta \leq 400$. Esempio 2. Il primo
passaggio ricorda il denominatore $2a$.

1. $6x^2 - 13x + 6 > 0$: $\Delta = 25$, $x_{1,2} = \frac{13 \pm 5}{12}$, $x < \frac{2}{3} \ \text{ oppure } \ x > \frac{3}{2}$.
2. $6x^2 + 7x - 5 \leq 0$: $x_1 = -\frac{5}{3}$, $x_2 = \frac{1}{2}$, $S = \left[-\frac{5}{3}, \frac{1}{2}\right]$.

## Livello 3: a negativo o termini nei due membri

Zeri interi distinti tra $-6$ e $6$, trinomio completo dopo aver portato tutto a primo membro. Tre forme:

- `a negativo` (35%): $-(x - r_1)(x - r_2)$ sviluppato, confrontato con zero, come $-x^2 + 4x - 3 \geq 0$;
- `due membri` (35%): $L \lesseqgtr R$ con $L$ un trinomio con $a = 1$ e zeri interi (anche incompleto,
  come $x^2 - 16$) e $R$ di primo grado, $L - R = (x - r_1)(x - r_2)$; avviso "Risolvere senza zero a
  secondo membro";
- `due membri, a negativo` (30%): lo stesso con $a = -1$, come $4x - x^2 > 3$ dell'esempio 3 (scritto
  $-x^2 + 4x > 3$).

$|R|$: coefficiente di $x$ fino a $9$, termine noto fino a $20$.

1. $-x^2 + 16 < -2x + 13$: $-x^2 + 2x + 3 < 0$, $x^2 - 2x - 3 > 0$, $x < -1 \ \text{ oppure } \ x > 3$.
2. $x^2 - 16 < 2x - 8$: $x^2 - 2x - 8 < 0$, $S = \,\mathopen{]}-2, 4\mathclose{[}$.

## Livello 4: zeri irrazionali

$x^2 + bx + c$ con $\Delta > 0$ non quadrato, $c \neq 0$ tra $-9$ e $9$. Due forme: $b$ pari tra $-6$ e $6$
(75%), dove $\sqrt{\Delta}$ si semplifica sempre e gli zeri sono $-\frac{b}{2} \pm \sqrt{\cdot}$ come
nell'esempio 4; $b \in \{\pm 1, \pm 3\}$ (25%), con zeri $\frac{-b \pm \sqrt{\Delta}}{2}$. I passaggi scrivono
$\sqrt{20} = 2\sqrt{5}$, la semplificazione della frazione e le approssimazioni a due cifre con la virgola, che
servono solo a mettere in ordine gli zeri (riquadro "L'ordine delle soluzioni irrazionali").

1. $x^2 - 2x - 4 \leq 0$: $\sqrt{20} = 2\sqrt{5}$, $x_{1,2} = 1 \pm \sqrt{5}$, $S = \left[1 - \sqrt{5}, 1 + \sqrt{5}\right]$.
2. $x^2 - 3x - 2 > 0$: $x_{1,2} = \frac{3 \pm \sqrt{17}}{2}$, $x < \frac{3 - \sqrt{17}}{2} \ \text{ oppure } \ x > \frac{3 + \sqrt{17}}{2}$.

## Livello 5: discriminante nullo

$\pm k(mx - n)^2$ sviluppato, con $m \in \{1, 2, 3\}$ ($1$ tre volte su cinque), $n \neq 0$ primo con $m$
($|n| \leq 9$ con $m = 1$, $|n| \leq 5$ altrimenti), $k \in \{1, 2\}$ solo con $m = 1$; segno meno metà delle
volte. Esempio 5 e avviso "Dimenticare il punto di contatto". Le quattro opzioni sono le quattro risposte della
colonna $\Delta = 0$ della tabella: $\mathbb{R} \setminus \{r\}$, $\mathbb{R}$, $\emptyset$, $\{r\}$; quella
giusta dipende dal verso (dopo averlo cambiato se $a < 0$). I passaggi scrivono il trinomio come quadrato.

1. $9x^2 + 30x + 25 > 0$: $\Delta = 0$, $x_1 = x_2 = -\frac{5}{3}$, $(3x + 5)^2$, $S = \mathbb{R} \setminus \{-\frac{5}{3}\}$.
2. $-x^2 + 4x - 4 \geq 0$: $x^2 - 4x + 4 \leq 0$, $(x - 2)^2 \leq 0$, $S = \{2\}$.

## Livello 6: discriminante negativo

$ax^2 + bx + c$ con $a \in \{\pm 1, \pm 2, \pm 3\}$, $b \neq 0$ tra $-6$ e $6$, $c \neq 0$ tra $-9$ e $9$,
$\text{MCD}(a, b, c) = 1$, $\Delta < 0$; $a$ negativo metà delle volte. Esempio 6 e avviso "Delta negativo non
vuol dire impossibile". La risposta è $\mathbb{R}$ o $\emptyset$. Le opzioni sono ancora le quattro risposte
della tabella, con il punto $r = -\frac{b}{2a}$ (l'ascissa del vertice): $\mathbb{R} \setminus \{r\}$ e $\{r\}$
sono le risposte di chi tratta il trinomio come se avesse $\Delta = 0$.

1. $-3x^2 + 6x - 4 \leq 0$: $3x^2 - 6x + 4 \geq 0$, $\Delta = 36 - 48 = -12$, sempre verificata, $S = \mathbb{R}$.
2. $3x^2 + 3x + 5 < 0$: $\Delta = 9 - 60 = -51$, impossibile, $S = \emptyset$.

## Livello 7: pure e spurie

Esempi 7 e 8. Tre forme:

- `pura` (40%): $x^2 \lesseqgtr k^2$ (tre volte su cinque), $x^2 - k^2 \lesseqgtr 0$ (una su cinque),
  $ax^2 \lesseqgtr ak^2$ con $a \in \{2, 3\}$ (una su cinque), $k$ da $1$ a $9$; zeri $\pm k$;
- `pura sempre o mai` (20%): $x^2 + k \lesseqgtr 0$, $x^2 \lesseqgtr -k$, $-x^2 - k \lesseqgtr 0$ con $k$ da $1$
  a $9$, come $x^2 + 4 > 0$ della lezione; opzioni le quattro risposte della tabella con $r = 0$
  ($\mathbb{R} \setminus \{0\}$ e $\{0\}$ sono le risposte di $x^2 \lesseqgtr 0$, cioè del termine noto
  dimenticato);
- `spuria` (40%): $x^2 \lesseqgtr kx$ con $k \neq 0$ tra $-9$ e $9$ (metà), oppure $ax^2 + bx \lesseqgtr 0$ con
  $a \in \{1, 2, 3, -1, -2\}$ e $b \neq 0$ tra $-9$ e $9$ (metà).

1. $x^2 \geq 49$: $x^2 - 49 \geq 0$, zeri $\pm 7$, $x \leq -7 \ \text{ oppure } \ x \geq 7$.
2. $x^2 < 6x$: $x^2 - 6x < 0$, $x(x - 6) = 0$, $S = \,\mathopen{]}0, 6\mathclose{[}$.

## Esercizi "brutti" da evitare

- trinomi con un fattore comune ($2x^2 - 2x - 40$): ai livelli 1-4 il coefficiente $a$ è $1$ o il prodotto
  dei denominatori degli zeri, al livello 6 $\text{MCD}(a, b, c) = 1$; l'eccezione voluta è
  $2(x - 3)^2$ al livello 5;
- numeri grandi: $|b|, |c| \leq 20$ al livello 2, $\Delta \leq 400$;
- soluzioni vuote o $\mathbb{R}$ ai livelli 1-4, trinomi incompleti ai livelli 1-6;
- zeri irrazionali scritti in forma non semplificata ($\sqrt{8}$, $\frac{2 + 2\sqrt{5}}{2}$).

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. Ai livelli 1-4 e 7 (pure e spurie) i distrattori vengono dagli errori
della lezione, in quest'ordine di preferenza; il controllo li rifà da capo con SymPy a partire dal testo:

- `denominatore` (livello 2): la formula con $2$ al posto di $2a$, gli zeri moltiplicati per $a$;
- `verso` (livello 3, $a < 0$): avviso "Cambiare i segni senza cambiare il verso", $-P$ con lo stesso verso;
- `senza zero` (livello 3, due membri): avviso "Risolvere senza zero a secondo membro", $L \lesseqgtr 0$;
- `ordine` (livello 4): gli zeri in ordine sbagliato, gli intervalli giusti scritti con $x_1$ e $x_2$ scambiati
  (riquadro "L'ordine delle soluzioni irrazionali");
- `radice` (livello 7, pure): avviso "Scrivere x minore di più o meno 3", $x < 3$ da $x^2 < 9$;
- `dividi` (livello 7, spurie): avviso "Dividere per x", $x > 3$ da $x^2 > 3x$;
- `scambiati`: valori interni al posto degli esterni e viceversa (avviso "Leggere il verso senza guardare a");
- `estremi`: estremi compresi al posto di esclusi e viceversa;
- `equazione`: avviso "Fermarsi all'equazione associata", le soluzioni dell'equazione come risposta;
- `scambiati ed estremi`, di riserva.

Ai livelli 5, 6 e 7 (`pura sempre o mai`) le opzioni sono le quattro risposte della tabella (`tabella:>`,
`tabella:>=`, `tabella:<`, `tabella:<=`), come descritto sopra.

La risposta giusta cade in ognuna delle quattro posizioni circa un quarto delle volte (su 1.000 campioni per
livello, da 228 a 267).

## Figure

Nessun livello ha una figura oggi. Tutti la vorrebbero nei passaggi: la lezione risolve ogni esempio guardando
la parabola, con l'arco che risolve la disequazione colorato e la riga $S$ con i pallini pieni e vuoti. Le più
utili sarebbero ai livelli 5 e 6 (la parabola che tocca l'asse o sta tutta sopra, dove la tabella senza
disegno si impara a memoria) e al livello 3 (la parabola rivolta verso il basso prima e verso l'alto dopo il
cambio di segno).

## Verifiche fatte

- `sample.mts disequazioni-secondo-grado 1000 all 1 | verify.py`: PASS; con il seed di partenza 7001: PASS.
- Esercizi diversi su 1.000 per livello (testo del problema): livello 1: 420, livello 2: 603, livello 3: 820,
  livello 4: 350, livello 5: 283, livello 6: 732, livello 7: 367.
- Quote delle forme su 1.000 (seed 1): livello 3 `a negativo` 359, `due membri` 337, `due membri, a negativo`
  304; livello 4 `b pari` 759, `b dispari` 241; livello 7 `pura` 408, `pura sempre o mai` 190, `spuria` 402.
- `width.mts`: esce con 0; problema al massimo 218 px (livello 3), opzioni al massimo 214 px (livello 4).
- Errori piantati a mano, tutti bocciati dal controllo Python: indice della risposta giusta spostato; valori
  dell'opzione giusta con gli estremi cambiati; testo di un distrattore uguale a quello della giusta; estremo
  scritto $1 - \frac{2\sqrt{5}}{2}$ (non semplificato); $\sqrt{8}$ al posto di $2\sqrt{2}$ in testo e valori;
  livello 1 con $a = 2$; livello 5 con $\Delta \neq 0$; etichetta di un distrattore sbagliata; soluzione con
  un estremo cambiato; ultimo passaggio con il verso girato; $\Delta$ sbagliato nei passaggi; due opzioni della
  tabella uguali; approssimazione sbagliata; $1x$ nel problema.
- `review.mts` esce con 0; `steps-scan.mts` non segnala niente; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Livello 6: con $\Delta < 0$ le risposte possibili sono solo $\mathbb{R}$ ed $\emptyset$, e per avere quattro
  opzioni ho aggiunto $\mathbb{R} \setminus \{r\}$ e $\{r\}$ con $r$ l'ascissa del vertice, le risposte di chi
  confonde il caso con $\Delta = 0$. Sono distrattori plausibili, o meglio una domanda a due opzioni
  ("sempre verificata" o "impossibile") quando il sito le supporterà?
- Livello 4, distrattore `ordine`: gli intervalli giusti scritti con gli zeri scambiati, come
  $\left[1 + \sqrt{5}, 1 - \sqrt{5}\right]$. È l'errore che la nota propone, ma chi guarda bene vede che
  l'intervallo è "rovesciato"; va bene o si preferisce un altro errore (il $2$ al posto di $2a$ non vale con
  $a = 1$; "semplificare solo un termine", $-2 \pm 2\sqrt{5}$ diviso $2$ scritto $-1 \pm 2\sqrt{5}$, è comune
  ma la lezione non lo nomina)?
- Zeri come $\frac{3 - \sqrt{17}}{2}$ (livello 4 con $b$ dispari) scritti con il segno meno dentro la frazione,
  $\frac{-1 - \sqrt{5}}{2}$ quando serve: è la forma dei libri, ma diversa da quella dei numeri razionali,
  che portano il segno fuori ($-\frac{5}{3}$).
- Livello 3: $-x^2 + 4x > 3$ al posto di $4x - x^2 > 3$ della lezione, per la regola delle potenze
  decrescenti. Si vuole anche la forma della lezione?
- La risposta aperta richiede un tipo "unione di intervalli", lo stesso che manca a `disequazioni-razionali`.
