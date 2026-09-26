# Studio del segno e disequazioni fratte

Generatore: `disequazioni-razionali` (`src/lib/exercises/v2/generators/disequazioni-razionali.ts`).
Verifica indipendente: `scripts/exercises/checkers/disequazioni_razionali.py`. Lezione collegata:
`docs/lezioni/riscritte/54-disequazioni-razionali.md` (nota in `docs/lezioni/note/54-disequazioni-razionali.md`,
sezione "Per il generatore", da cui vengono i sette livelli).

Lo studente riceve una disequazione che, portata a primo membro e scomposta, ha solo fattori di primo
grado, e sceglie l'insieme delle soluzioni. La consegna è sempre "Risolvi la disequazione.". I passaggi
seguono i procedimenti della lezione: portare tutto a primo membro, raccogliere o ridurre a una frazione
sola, scrivere le C.E. (livelli 5-7), studiare il segno di ogni fattore con "$> 0$" (anche quando il verso
è largo, come fa la lezione), leggere il segno del prodotto o della frazione intervallo per intervallo,
scegliere gli intervalli con il segno richiesto e, con $\geq$ e $\leq$, aggiungere gli zeri del numeratore
e mai quelli del denominatore.

## Tipo di risposta

`choice` fin dall'inizio, a tutti i livelli. La risposta è un'unione di intervalli, e nessun tipo di oggi la
contiene: `set` dice solo valori isolati oppure "ogni numero reale". `toChoice()` restituisce la risposta
stessa. Per la risposta aperta servirà un tipo "unione di intervalli" (vedi le domande in fondo).

Le quattro opzioni di un esercizio sono scritte tutte in una delle due forme della lezione, scelta a caso
metà e metà (`params.notation`):

- `disequazioni`: $x < -2 \ \text{ oppure } \ x \geq 1$, $-1 < x < 4$, $-3 \leq x \leq 0 \ \text{ oppure } \ x \geq 3$;
- `intervalli`: $S = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup [1, +\infty\mathclose{[}$, con le parentesi
  quadre rivolte verso l'esterno per un estremo escluso, scritte `\mathopen{]}` e `\mathclose{[}`, e con
  `\left]` … `\right[` quando un estremo è una frazione, come nell'esempio 3 della lezione. Uno spazio `\,`
  precede ogni `\mathopen{]}` e segue un `\mathclose{[}` prima di $\cup$, come nella lezione.

La soluzione (`solution`) è sempre la forma con gli intervalli; l'ultimo passaggio è la forma con
"oppure". Valori delle opzioni: un intervallo per elemento, con la notazione matematica consueta, per
esempio `["(-oo,-2)", "[1,oo)"]`. Il controllo rilegge il testo di ogni opzione (in tutte e due le forme)
e lo confronta con i valori.

## Costruzione all'indietro

Si scelgono prima gli zeri, cioè i fattori di primo grado $ax + b$ (con $a$ e $b$ primi tra loro), e poi si
scrive il testo: il prodotto così com'è, oppure sviluppato quando il livello chiede di raccogliere, oppure
una frazione (o due) che ridotta a primo membro dà quei fattori. Gli zeri sono razionali per costruzione,
con denominatore al massimo 3 e valore assoluto fino a 12. La soluzione si ricava con la tabella dei segni
(il segno in un punto di prova per ogni intervallo) e gli estremi si decidono con la regola del passo 5.

`params` contiene la forma (`form`), il verso (`op`), il numero davanti (`pre`, per $2x(x - 3)$), i fattori
della forma ridotta con il ruolo di numeratore o denominatore, la notazione, la soluzione, e per ogni
opzione l'errore da cui viene (`optionTags`, `giusta` per quella giusta). Il controllo Python non usa la
soluzione dei params: rilegge la disequazione dal testo e la risolve con SymPy
(`reduce_rational_inequalities`, che esclude da sola gli zeri del denominatore).

## Regole comuni

- Zeri distinti; nessuna frazione si semplifica (lo zero del numeratore non è mai uno zero del
  denominatore, anche prima di ridurre al livello 6).
- Gli zeri del denominatore non sono mai tra le soluzioni; con $\geq$ e $\leq$ gli zeri del numeratore ci
  sono sempre. Il controllo verifica tutte e due le cose sulla risposta di SymPy e sull'opzione giusta.
- Fattori scritti come nella lezione: $x$ senza parentesi davanti agli altri ($x(x - 4)$), il numero
  davanti a tutti ($2x(x - 3)$), un fattore con il coefficiente di $x$ negativo per potenze crescenti
  ($3 - x$, $1 - 2x$). Niente $1x$, $+ -$, termini nulli, segni dentro una frazione.
- La soluzione non è mai vuota né tutto $\mathbb{R}$ (con fattori distinti di primo grado non succede).

## Livello 1: prodotto di due fattori

$(x - a)(x - b) \lessgtr 0$ con $a \neq b$ interi tra $-9$ e $9$ (con $a = 0$ il fattore è $x$), verso
stretto, esempio 1 della lezione.

1. $(x + 4)(x + 8) > 0$: il prodotto è positivo prima di $-8$ e dopo $-4$. $x < -8 \ \text{ oppure } \ x > -4$.
2. $x(x - 1) > 0$: $S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$.

## Livello 2: estremi compresi

Verso largo, esempio 2. Tre forme: il prodotto già scomposto (3 su 10), $x^2 \lesseqgtr kx$ da portare a
primo membro e raccogliere (7 su 20), $cx^2 + cbx \lesseqgtr 0$ con $c \in \{1, 2, 3\}$ da raccogliere
(7 su 20; con $c > 1$ un passaggio dice che il fattore numerico positivo non cambia il segno).

1. $x^2 \geq 2x$: $x^2 - 2x \geq 0$, $x(x - 2) \geq 0$. $S = \,\mathopen{]}-\infty, 0] \cup [2, +\infty\mathclose{[}$.
2. $(x - 8)(x - 2) \leq 0$: $2 \leq x \leq 8$.

## Livello 3: un coefficiente di x negativo

$(b - mx)(cx + d) \lesseqgtr 0$ con $m, c \in \{1, 2, 3\}$, non tutti e due $1$, quindi almeno uno zero
frazionario; tutti e quattro i versi. Esempio 3. Nei passaggi il fattore con il coefficiente negativo si
studia come nella lezione: $3 - x > 0 \Rightarrow -x > -3 \Rightarrow x < 3$, "perché dividendo per un
numero negativo il verso cambia".

1. $(5 - 3x)(x + 1) > 0$: $-1 < x < \frac{5}{3}$.
2. $(1 - x)(2x + 3) \leq 0$: $S = \left]-\infty, -\frac{3}{2}\right] \cup [1, +\infty\mathclose{[}$.

## Livello 4: tre fattori

Esempio 4 e avviso "Il quadrato maggiore di un numero". Quattro forme, tutti i versi:
$x^3 - k^2x \lesseqgtr 0$ (3 su 10) e $x^3 \lesseqgtr k^2x$ (2 su 10) con $k$ da 1 a 6, da raccogliere e
scomporre con la differenza di quadrati; $x^2 \lesseqgtr k^2$ con $k$ da 1 a 9 (1 su 4, due fattori, per
l'avviso); tre fattori $x - r$ già scritti, con $r$ distinti tra $-6$ e $6$ (1 su 4).

1. $x^3 - 16x > 0$: $x(x + 4)(x - 4) > 0$, $S = \,\mathopen{]}-4, 0\mathclose{[}\, \cup \,\mathopen{]}4, +\infty\mathclose{[}$.
2. $x^2 \leq 36$: $(x + 6)(x - 6) \leq 0$, $S = [-6, 6]$.

## Livello 5: una frazione e lo zero

$\frac{c_1x + d_1}{c_2x + d_2} \lesseqgtr 0$ con $c_1, c_2 \in \{1, 2\}$ (il $2$ una volta su quattro), zeri
interi o mezzi. Verso largo 3 volte su 4, perché la difficoltà nuova è lo zero del denominatore escluso
(esempio 5 e avviso "Includere lo zero del denominatore").

1. $\frac{x + 1}{x + 2} \geq 0$: C.E. $x \neq -2$. $S = \,\mathopen{]}-\infty, -2\mathclose{[}\, \cup [-1, +\infty\mathclose{[}$.
2. $\frac{x - 8}{x + 8} > 0$: $x < -8 \ \text{ oppure } \ x > 8$.

## Livello 6: una frazione e un numero

$\frac{ax + b}{x - c} \lesseqgtr k$ con $a \in \{1, 2, 3\}$, $k$ intero tra $-3$ e $3$ diverso da zero e da $a$,
$c$ tra $-6$ e $6$, $|b| \leq 15$. Esempio 6: si porta $k$ a primo membro e si riduce a una frazione sola,
con i passaggi $\frac{2x + 1}{x - 3} - 1 < 0$, $\frac{2x + 1 - (x - 3)}{x - 3} < 0$, $\frac{x + 4}{x - 3} < 0$.
Si sceglie il numeratore ridotto $Ax + B$ (con $A = a - k$) dal suo zero e si ricava $b = B - kc$. Quando
$A < 0$ il numeratore si scrive $B - |A|x$ con $B > 0$ (le forme come $-x - 7$ si scartano).

1. $\frac{2x - 7}{x - 4} < 1$: $\frac{x - 3}{x - 4} < 0$, $S = \,\mathopen{]}3, 4\mathclose{[}$.
2. $\frac{2x - 1}{x + 2} \leq 1$: $\frac{x - 3}{x + 2} \leq 0$, $S = \,\mathopen{]}-2, 3]$.

## Livello 7: due frazioni, tre fattori

$\frac{p}{x - a} \lesseqgtr \frac{q}{x - b}$ con $p \neq q$ da 1 a 6 e $a \neq b$ tra $-5$ e $5$ (esempio 7). Il
numeratore ridotto è $p(x - b) - q(x - a)$, il denominatore comune $(x - a)(x - b)$ (con $x$ davanti se uno
dei due è zero, come $x(x - 1)$ nella lezione). Lo zero del numeratore deve essere diverso da $a$ e da $b$,
con denominatore fino a 3.

1. $\frac{1}{x - 1} \geq \frac{4}{x + 1}$: $\frac{5 - 3x}{(x - 1)(x + 1)} \geq 0$,
   $S = \,\mathopen{]}-\infty, -1\mathclose{[}\, \cup \left]1, \frac{5}{3}\right]$.
2. $\frac{2}{x - 1} < \frac{1}{x - 5}$: $\frac{x - 9}{(x - 1)(x - 5)} < 0$, $x < 1 \ \text{ oppure } \ 5 < x < 9$.

## Esercizi "brutti" da evitare

- frazioni che si semplificano, zeri del numeratore uguali a zeri del denominatore;
- fattori ripetuti come $(x - 1)^2$ e fattori di secondo grado irriducibili (la lezione li lascia fuori);
- zeri con denominatori grandi o numeri grandi: la lezione lavora con $-\frac{1}{2}$, $3$, $\frac{5}{3}$;
- numeratori scritti $-x - 7$; fattori non primitivi come $2x - 4$;
- soluzioni vuote o uguali a $\mathbb{R}$, e distrattori vuoti, uguali a $\mathbb{R}$ o con un punto isolato.

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. I distrattori sono le soluzioni degli errori della lezione, risolti
con la stessa tabella dei segni; il controllo li rifà da capo con SymPy a partire dal testo, uno per
etichetta. In ordine di preferenza per livello:

- `dividi` (livelli 2 e 4): dividere per $x$, avviso "Dividere per l'incognita": da $x^2 \leq 4x$ si arriva a
  $x \leq 4$; da $x^3 - 9x \geq 0$ a $x^2 - 9 \geq 0$;
- `radice` (livello 4, $x^2 \lesseqgtr k^2$): avviso "Il quadrato maggiore di un numero", $x > 3$;
- `verso` (livello 3): avviso "Dimenticare di cambiare il verso", il fattore $3 - x$ studiato come se fosse
  positivo per $x > -3$;
- `denominatore` (livelli 5-7, verso largo): avviso "Includere lo zero del denominatore";
- `moltiplica` (livelli 5 e 6) e `in croce` (livello 7): avvisi "Moltiplicare per il denominatore" e
  "Moltiplicare in croce", cioè la disequazione moltiplicata per il denominatore come se fosse positivo
  ($2x + 1 < x - 3$, $x < -4$ nell'esempio 6);
- `senza zero` (livello 6): avviso "Studiare il segno senza zero a secondo membro", la tabella della frazione
  del testo letta come se il secondo membro fosse zero;
- `sistema` (livelli 1-4 e 7): avviso "Confondere la tabella dei segni con un sistema", gli intervalli in cui
  tutte le linee sono continue (tutte tratteggiate per $<$ e $\leq$);
- `scambiati`: gli intervalli con il segno opposto a quello richiesto;
- `estremi`: gli estremi del numeratore inclusi con il verso stretto, o esclusi con quello largo;
- come riserva, raramente: `scambiati ed estremi` e `zero:i` (lo zero di un fattore con il segno cambiato,
  $x + 3$ letto come zero in $3$).

Frequenza delle etichette su 1.000 esercizi per livello (seed da 1): livello 1 `scambiati`, `estremi`,
`sistema` sempre; livello 2 `dividi` 734, `sistema` 266; livello 3 `verso` 991; livello 4 `sistema` 742,
`estremi` 520, `dividi` 480, `radice` 258; livello 5 `moltiplica` 1.000, `denominatore` 760, `estremi` 240;
livello 6 `moltiplica` e `senza zero` 1.000, `scambiati` 507, `denominatore` 493; livello 7 `in croce` 1.000,
`scambiati` 1.000, `estremi` 508, `denominatore` 492.

## Figure

Nessun livello ne ha bisogno: la tabella dei segni è nei passaggi, scritta a parole ("Segno del prodotto:
$+$ per $x < -1$, $-$ per $-1 < x < 4$, …"). Una figura con la tabella dei segni della soluzione, come quelle
della lezione, sarebbe utile nella soluzione di tutti i livelli, soprattutto 4 e 7.

## Verifica

- `sample.mts disequazioni-razionali 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000; di nuovo con
  il seed 7001: PASS. Quote dei casi (seed 1): livello 2 prodotto 266, raccoglimento 360, $x^2$ e $kx$
  374; livello 4 $x^3 - k^2x$ 266, $x^3$ e $k^2x$ 214, $x^2$ e $k^2$ 258, tre fattori 262; livello 5 verso
  largo 760, stretto 240.
- Esercizi diversi su 1.000 (seed da 1): livello 1 501, livello 2 343, livello 3 886, livello 4 334,
  livello 5 787, livello 6 847, livello 7 833.
- Errori piantati a mano, tutti bocciati (17): `correct` spostato; testo dell'opzione giusta con un estremo
  escluso e valori invariati; opzione con lo zero del denominatore incluso scambiata con la giusta; verso del
  testo cambiato; etichetta `in croce` su un distrattore `scambiati`; due opzioni uguali; soluzione con una
  frazione senza `\left`; $1x$ nel testo; ultimo passaggio con gli estremi sbagliati; livello 1 con verso
  largo (due volte: testo cambiato, e un campione del livello 2 rinominato livello 1); livello 3 senza
  coefficiente negativo (due volte); notazione dei params diversa da quella delle opzioni; etichetta
  `radice` su un altro distrattore; un campione del livello 5 rinominato livello 6 (secondo membro zero);
  tre fattori al livello 2. Un campione intatto passa.
- `review.mts`: esce con 0 (tutto il LaTeX passa da KaTeX).
- `width.mts`: esce con 0. Problema al massimo 206 px (livello 4), opzioni al massimo 215 px su 150 esercizi;
  misurate a parte su 1.500 esercizi per i livelli 3, 4, 6 e 7, la più larga è 240 px (livello 7,
  $x < -5 \ \text{ oppure } \ -4 < x < -\frac{10}{3}$), sotto i 252.
- Passaggi e soluzione passano `steps-scan.mts`: nessun ambiente con `\text{}`.

## Domande per la revisione

- Le opzioni sono in una sola forma per esercizio, a caso tra "oppure" e intervalli. Meglio fissarne una per
  livello, o tenerle mescolate perché lo studente si abitui a leggerle tutte e due?
- Il distrattore `sistema` con $<$ prende gli intervalli in cui tutte le linee sono tratteggiate: la lezione
  descrive l'errore solo con le linee continue. È un errore credibile, o per $<$ va tolto?
- Nei passaggi ogni fattore si studia con $> 0$ anche quando il verso è largo, come nella lezione. Il
  distrattore `estremi` (verso stretto e largo scambiati) è abbastanza vicino a un errore vero?
- Il livello 6 ammette $k$ negativo ($\frac{x}{x + 3} < -1$) e numeratori ridotti con il coefficiente di $x$
  negativo ($\frac{2 - x}{x + 1}$): la lezione ha solo $k = 1$. Vanno bene o sono una difficoltà in più?
- Per la risposta aperta serve un tipo di risposta "unione di intervalli" con gli estremi inclusi o esclusi;
  i valori delle opzioni (`"(-oo,-2)"`, `"[1,oo)"`) sono già in una forma che quel tipo potrebbe usare.
