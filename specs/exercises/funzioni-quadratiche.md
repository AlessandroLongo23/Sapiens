# La parabola

Generatore: `funzioni-quadratiche` (`src/lib/exercises/v2/generators/funzioni-quadratiche.ts`).
Verifica indipendente: `scripts/exercises/checkers/funzioni_quadratiche.py`. Lezione collegata:
`docs/lezioni/riscritte/87-funzioni-quadratiche.md` (note in `docs/lezioni/note/`, sezione "Per il
generatore").

Sette livelli nell'ordine della lezione: concavità, apertura e vertice di $y = ax^2 + c$; vertice e
asse con coordinate intere; vertice con le frazioni; un punto sulla parabola e il punto sull'asse $y$;
le intersezioni con l'asse $x$; la posizione rispetto all'asse $x$ dal segno di $a$ e di $\Delta$; la
parabola per tre punti. Notazione della lezione: $V(x_V, y_V)$, $x_V = -\frac{b}{2a}$, $y_V$ per
sostituzione con il controllo $y_V = -\frac{\Delta}{4a}$, "concavità verso l'alto / verso il basso",
"più stretta / più larga", "tangente all'asse $x$", punti con le lettere maiuscole e frazioni nelle
coordinate scritte con `\left( … \right)`.

## Si costruisce dalla risposta

Si sceglie prima quello che si chiede (il valore di $a$ più grande o più piccolo in valore assoluto,
il vertice, il punto, le soluzioni, la posizione, i coefficienti) e poi si costruisce la parabola:
per il vertice intero $b = -2ax_V$ e $c = ax_V^2 + y_V$, per le intersezioni il prodotto
$k(q_1x - p_1)(q_2x - p_2)$ o il quadrato $k(qx - p)^2$, per $\Delta < 0$ la forma
$k(x - h)^2 + m$ con $km > 0$. I coefficienti sono interi (razionali solo al livello 1), il testo non
contiene mai `1x`, `0x`, `+ -`, `- -`, termini nulli.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1 | `choice` (una di quattro parabole, oppure vertice e concavità) | la risposta stessa |
| 2 | `choice` (il vertice, un punto; oppure l'asse, una retta verticale) | la risposta stessa |
| 3 | `choice` (il vertice) | la risposta stessa |
| 4 | `choice` (un punto) | la risposta stessa |
| 5 | `set` (le ascisse delle intersezioni con l'asse $x$, vuoto se non ce ne sono) | `toChoice` |
| 6 | `choice` (quattro posizioni) | la risposta stessa |
| 7 | `expression`, `form = "expanded"`: `value` il secondo membro in SymPy, `latex` l'equazione $y = \dots$ | costruita con l'esercizio |

Sempre quattro opzioni distinte; i distrattori vengono dai riquadri `ad-warning` della lezione.

## Livello 1: concavità, apertura e vertice di y = ax² + c

Tre casi, un terzo ciascuno. `stretta` e `larga`: quattro parabole $y = ax^2$ con $|a|$ distinti presi
da $\frac{1}{4}, \frac{1}{3}, \frac{1}{2}, 1, \frac{3}{2}, 2, 3, 4, 5$, segni a caso; in circa sei su
dieci il segno inganna (la più stretta ha $a < 0$, oppure la più larga ha $a > 0$ e un'altra ha $a < 0$),
come nell'avviso "L'apertura dipende dal valore assoluto". `vertice`: $y = ax^2 + c$ con $c$ intero
non nullo tra $-9$ e $9$; si chiedono vertice e concavità. Distrattori: la concavità al contrario,
$V(c, 0)$ (avviso "In su o in giù, non a destra o a sinistra"), $V(0, 0)$.

1. $y = 3x^2 \quad y = -2x^2 \quad y = -5x^2 \quad y = \frac{1}{3}x^2$: la più stretta è $y = -5x^2$.
2. $y = -\frac{1}{2}x^2 + 1$: $V(0, 1)$, concavità verso il basso.

## Livello 2: vertice e asse con coordinate intere

$a \in \{\pm 1, \pm 2\}$ (con $a = 1$ più frequente), $x_V$ intero non nullo tra $-5$ e $5$, $y_V$
intero tra $-9$ e $9$, $|b| \le 12$, $|c| \le 30$. Tre su quattro chiedono il vertice, uno l'asse di
simmetria. Distrattori del vertice: $x_V$ con il segno sbagliato (avviso "Il segno nella formula del
vertice", con l'ordinata ricalcolata), per $a < 0$ l'ordinata con il meno davanti a $x^2$ perso
(avviso "Il meno davanti a x²"), coordinate scambiate, $-\frac{b}{a}$ (il 2 dimenticato), $y_V$ con
il segno cambiato, $y_V = c$. Distrattori dell'asse: $x = -x_V$, $y = x_V$, $x = y_V$, $x = 2x_V$,
$y = y_V$.

1. $y = -x^2 - 10x - 24$: $x_V = -\frac{-10}{2 \cdot (-1)} = -5$, $y_V = -(-5)^2 + 50 - 24 = 1$, $V(-5, 1)$.
2. $y = -2x^2 - 8x - 13$: l'asse è $x = -2$.

## Livello 3: vertice con le frazioni

$a \in \{1, -1, 2, -2, 3\}$, $b$ non nullo e $c$ tra $-9$ e $9$, $x_V$ non intera, $y_V$ con
denominatore al massimo 12. I passaggi sostituiscono con le frazioni, come nell'esempio 7, e poi
controllano con $-\frac{\Delta}{4a}$. Distrattori come al livello 2 (senza l'asse).

1. $y = 2x^2 - 9x + 1$: $x_V = \frac{9}{4}$, $y_V = \frac{81}{8} - \frac{81}{4} + 1 = -\frac{73}{8}$.
2. $y = 3x^2 + 2x + 3$: $V\left(-\frac{1}{3}, \frac{8}{3}\right)$, $\Delta = -32$, $-\frac{\Delta}{12} = \frac{8}{3}$.

## Livello 4: un punto sulla parabola e il punto sull'asse y

$a \in \{\pm 1, \pm 2\}$, $b$ e $c$ non nulli tra $-6$ e $6$. Sette su dieci (`appartiene`): quale di
quattro punti sta sulla parabola; il punto giusto ha ascissa tra $-3$ e $3$ non nulla e
$|y| \le 25$. Distrattori: coordinate scambiate (solo se l'ordinata è piccola), l'ascissa opposta con
la stessa ordinata (vero solo per $y = ax^2$), l'ordinata con il segno di $bx$ sbagliato, per $a < 0$
l'ordinata con il meno davanti a $x^2$ perso, un'ordinata vicina; il controllo verifica che nessun
distrattore stia sulla parabola. Tre su dieci (`asse y`): il punto $(0, c)$; distrattori $(c, 0)$
(avviso "Il punto sull'asse y"), $(0, b)$, $(0, a + b + c)$, $(0, -c)$, $(0, a)$, l'origine. I
passaggi sostituiscono l'ascissa di ogni opzione.

1. $y = -x^2 - 6x + 6$: appartiene $(-2, 14)$; $(-2, -10)$ e $(-2, 15)$ no.
2. $y = 2x^2 - 6x - 1$: l'asse $y$ è incontrato in $(0, -1)$, non in $(-1, 0)$.

## Livello 5: intersezioni con l'asse x

Casi: `intere` (30%, soluzioni intere tra $-6$ e $6$), `frazionarie` (20%, almeno una $p/q$ con
$q \le 4$), `irrazionali` (20%, $\Delta > 0$ non quadrato), `tangente` (15%, $\Delta = 0$), `nessuna`
(15%, $\Delta < 0$). Circa tre su dieci con $a < 0$, che nei passaggi si moltiplica per $-1$ come
nell'esempio 4. $b$ e $c$ non nulli, al massimo 30 in valore assoluto. La risposta sono le ascisse,
ordinate; le opzioni si scrivono $x_1 = \dots,\ x_2 = \dots$, $x = \dots$ o "Nessuna intersezione",
e quando c'è un radicale le coppie vanno su due righe (`gathered`). Distrattori: soluzioni con il segno
cambiato, $2a$ sostituito da $a$ o da $1$, la sola ascissa del vertice, "Nessuna intersezione" quando
ci sono; con $\Delta < 0$, le soluzioni con $|\Delta|$ al posto di $\Delta$ (avviso "Discriminante
negativo non vuol dire niente parabola") e il vertice.

1. $y = 3x^2 - 5x - 12$: $\Delta = 169$, $x_1 = -\frac{4}{3}$, $x_2 = 3$.
2. $y = -x^2 - 8x - 8$: si moltiplica per $-1$, $\Delta = 32$, $x_{1,2} = -4 \pm 2\sqrt{2}$.

## Livello 6: posizione rispetto all'asse x

Quattro casi in parti uguali: `taglia` ($\Delta > 0$), `tangente` ($\Delta = 0$), `sopra`
($\Delta < 0$, $a > 0$), `sotto` ($\Delta < 0$, $a < 0$). $b$ e $c$ non nulli, al massimo 30 in valore
assoluto. Le quattro opzioni sono sempre le stesse, in ordine fisso; il distrattore vero è la
posizione giusta per l'altro segno di $a$.

1. $y = x^2 + x + 9$: $\Delta = -35$, concavità verso l'alto: sta tutta sopra.
2. $y = -3x^2 + 6x - 3$: $\Delta = 0$: è tangente all'asse $x$.

## Livello 7: la parabola per tre punti

$a \in \{\pm 1, \pm 2\}$, $b$ e $c$ tra $-6$ e $6$ (non tutti e due nulli), tre ascisse distinte tra
$-3$ e $4$, ordinate al massimo 30 in valore assoluto. Metà (`asse y`) con un punto di ascissa 0, che
dà subito $c$; metà (`generici`) con tre ascisse non nulle, risolte sottraendo la prima equazione
dalle altre, come nel riquadro della lezione. I punti sono separati da `\quad`. Distrattori: la
concavità sbagliata ($-a$), $-b$, $-c$, $a$ e $b$ scambiati; il controllo verifica che nessun
distrattore passi per i tre punti.

1. $A(1, 0) \quad B(3, 0) \quad C(2, -1)$: $y = x^2 - 4x + 3$ (l'esempio della lezione).
2. $A(0, -1) \quad B(1, -5) \quad C(3, -1)$: $c = -1$, poi $a + b = -4$ e $9a + 3b = 0$: $y = 2x^2 - 6x - 1$.

## Esercizi da evitare

Due parabole con la stessa apertura al livello 1; vertice sull'asse $y$ ai livelli 2 e 3 (è il
livello 1); coordinate enormi nei distrattori (le coordinate scambiate si usano solo con ordinate
piccole); tre punti allineati; distrattori che sono anche risposte giuste (un secondo punto sulla
parabola, una parabola per i tre punti).

## Verifiche fatte

- `sample.mts funzioni-quadratiche 1000 all 1 | verify.py`: PASS; con seed di partenza 7001: PASS.
- Esercizi diversi su 1.000 per livello (seed 1, testo e consegna): L1 871, L2 601, L3 634, L4 616,
  L5 613, L6 613, L7 979.
- `width.mts`: esce con 0; formula del problema più larga 174 px (livelli 2, 5, 6), opzione più larga
  203 px (livello 6, "taglia l'asse x in due punti").
- `review.mts` esce con 0; lo script dei passaggi (`presentStep` + KaTeX) non trova errori.
- `tsc` senza errori nei file del generatore, `eslint --max-warnings=0` pulito.
- Errori piantati a mano, tutti bocciati: opzione giusta spostata (un campione per ogni caso di ogni
  livello); al livello 1 i valori di $a$ nei parametri diversi dal testo; al livello 2 $b$ cambiato
  nel testo e nei parametri (vertice non più intero) e un `1x` nel testo; al livello 3 il LaTeX
  dell'opzione giusta diverso dai valori; al livello 4 un distrattore spostato sulla parabola (due
  punti giusti); al livello 5 risposta cambiata, radicale non semplificato ($\sqrt{32}$), coppie con i
  radicali su una riga, caso sbagliato; al livello 6 caso sbagliato e un trattino lungo nei passaggi;
  al livello 7 risposta cambiata, un punto cambiato nel testo, e i passaggi che partono da $A(0, c)$
  quando il punto sull'asse $y$ è $B$ (un errore vero del generatore, trovato leggendo i campioni e
  corretto; ora il controllo lo cerca).

## Figure

Quasi tutti i livelli ne guadagnerebbero, anche se si reggono sul testo:

- livello 1: quattro parabole disegnate sugli stessi assi sono il modo naturale di confrontare
  l'apertura; con la figura la domanda diventa "quale curva è $y = -3x^2$";
- livelli 2 e 3: la parabola con vertice e asse tratteggiato, nella soluzione;
- livello 5: la parabola con le intersezioni segnate, nella soluzione (i tre casi di $\Delta$);
- livello 6: le quattro posizioni come opzioni disegnate (la figura dei sei riquadri della lezione);
- livelli 4 e 7: meno, basterebbe la parabola nella soluzione.

## Domande per la revisione

- Livello 1: il caso `vertice` chiede insieme vertice e concavità in un'opzione sola
  ($V(0, 1),\ \text{verso il basso}$). Meglio due esercizi separati, anche se la concavità da sola ha
  due risposte e servono quattro opzioni?
- Livello 4: la domanda "quale di questi punti appartiene" ha passaggi lunghi (una sostituzione per
  ogni opzione). Va bene così, o basta la sostituzione del punto giusto?
- Livello 7: la lezione mette la parabola per tre punti in un riquadro facoltativo. Se Andrea decide di
  lasciarla alla lezione del terzo anno, il livello va tolto; oggi i distrattori ($-a$, $-b$, $-c$,
  $a$ e $b$ scambiati) non vengono da avvisi della lezione, che per questo argomento non ne ha.
- Livello 5: la risposta sono le ascisse ($x_1$, $x_2$), non i punti $A(x_1, 0)$ e $B(x_2, 0)$, perché
  il tipo `set` porta numeri. La consegna lo dice ("trova le ascisse"); va bene o si preferiscono i
  punti, a scelta multipla?
