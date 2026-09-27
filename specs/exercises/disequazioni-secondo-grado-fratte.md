# Disequazioni fratte e sistemi di secondo grado

Generatore: `disequazioni-secondo-grado-fratte` (`src/lib/exercises/v2/generators/disequazioni-secondo-grado-fratte.ts`).
Verifica indipendente: `scripts/exercises/checkers/disequazioni_secondo_grado_fratte.py`. Lezione collegata:
`docs/lezioni/riscritte/89-disequazioni-secondo-grado-fratte.md` (nota in
`docs/lezioni/note/89-disequazioni-secondo-grado-fratte.md`, sezione "Per il generatore", da cui vengono i sette
livelli).

Lo studente riceve una disequazione prodotto o fratta con un fattore di secondo grado, un sistema di due
disequazioni di secondo grado o un problema con un'area, e sceglie l'insieme delle soluzioni. Consegne:
"Risolvi la disequazione." (livelli 1-5), "Risolvi il sistema di disequazioni." (livello 6), "Risolvi il
problema con una disequazione." (livello 7). I passaggi seguono i procedimenti della lezione: C.E. per le
fratte, riduzione a una frazione sola, segno di ogni fattore (quelli di primo grado con "$> 0$", i trinomi con
$a$ e $\Delta$ e la regola "positivo fuori dalle soluzioni, negativo in mezzo" per $a > 0$, "positivo tra le
soluzioni" per $a < 0$), segno del prodotto o della frazione intervallo per intervallo, scelta degli intervalli,
con $\geq$ e $\leq$ gli zeri del numeratore e mai quelli del denominatore. Un fattore di secondo grado occupa
una riga sola, come nella lezione.

## Tipo di risposta

`choice` fin dall'inizio, a tutti i livelli: la risposta è un'unione di intervalli e di punti, che nessun tipo
di oggi contiene. `toChoice()` restituisce la risposta stessa.

Le quattro opzioni di un esercizio sono scritte tutte in una delle due forme della lezione (`params.notation`),
a caso metà e metà ai livelli 1-6, sempre come disequazioni al livello 7 (la risposta a un problema):

- `disequazioni`: $x < -4 \ \text{ oppure } \ 2 < x < 6$, $x = 2 \ \text{ oppure } \ x \geq 5$ (il punto isolato),
  $x < -6 \ \text{ oppure } \ -6 < x < 1$ (il punto tolto);
- `intervalli`: $S = \,\mathopen{]}-\infty, -4\mathclose{[}\, \cup \,\mathopen{]}2, 6\mathclose{[}$,
  $S = \{2\} \cup [5, +\infty\mathclose{[}$, con `\mathopen{]}` e `\mathclose{[}` per gli estremi esclusi e gli spazi
  `\,` della lezione.

Due intervalli limitati uniti da "oppure" sono troppo larghi per un bottone del telefono
($-6 < x < -4 \ \text{ oppure } \ -2 < x < -1$ misura 268 px a 16 px): vanno su due righe con `\begin{gathered}`,
"oppure" in fondo alla prima. Il controllo ricompone le righe e boccia le due righe usate per altro e i due
intervalli limitati lasciati su una riga. L'insieme vuoto si scrive $S = \emptyset$ in tutte e due le forme.

La soluzione (`solution`) è sempre la forma con gli intervalli; l'ultimo passaggio è la forma con "oppure", su
una riga. Valori delle opzioni: un pezzo per elemento, `"(-oo,-4)"`, `"[5,oo)"`, `"{2}"`; nessun valore per
$\emptyset$. Il controllo rilegge il testo di ogni opzione e lo confronta con i valori.

## Costruzione all'indietro

Si scelgono prima gli zeri, tutti interi: lo zero $r$ del fattore $x - r$, gli zeri $u < v$ del trinomio
$x^2 - (u + v)x + uv$, lo zero doppio $s$ del quadrato $x^2 - 2sx + s^2$, e i coefficienti $b$, $c$ di un trinomio
con $\Delta < 0$. Poi si scrive il testo, con i trinomi sviluppati: lo studente calcola $\Delta$ e gli zeri. La
soluzione si ricava provando un punto di ogni intervallo e ogni zero (la frazione non esiste negli zeri del
denominatore), così il punto isolato, il punto tolto e gli zeri del denominatore escono dalla stessa regola.

`params` contiene la forma (`form`), il verso (`op`), i fattori della forma ridotta con il ruolo di numeratore
o denominatore, la notazione, la soluzione e per ogni opzione l'errore da cui viene (`optionTags`, `giusta`
per quella giusta); il sistema ha le righe, il problema $p$, $A$, gli zeri e la storia. Il controllo Python non
usa né la soluzione né i fattori dei params: rilegge il testo e lo risolve con SymPy
(`reduce_rational_inequalities`, che esclude da sola gli zeri del denominatore; `Intersection` per il
sistema e per le limitazioni del problema).

## Regole comuni

- Zeri interi, distinti tra un fattore e l'altro, al massimo $9$ in valore assoluto; nessuna frazione si
  semplifica.
- Gli zeri del denominatore non sono mai tra le soluzioni; con $\geq$ e $\leq$ gli zeri del numeratore ci
  sono sempre, con $>$ e $<$ mai.
- Soluzione mai vuota né tutto $\mathbb{R}$, al massimo due pezzi (un intervallo o un punto ciascuno): tre pezzi
  non stanno in un bottone del telefono. Lo stesso per i distrattori, tranne $\emptyset$ al livello 2.
- Niente $1x$, $+ -$, termini nulli, segni dentro una frazione; $x$ davanti agli altri fattori
  ($x(x^2 - 4x + 3)$).

## Livello 1: un fattore e un trinomio

$(x - r)(x^2 + bx + c) \lessgtr 0$ in un ordine qualsiasi, con il trinomio di zeri interi $u < v$ tra $-6$ e $6$
e $r$ tra $-6$ e $6$, diverso da $u$ e $v$; verso stretto. Esempio 1 della lezione.

1. $(x^2 - 8x + 12)(x + 4) < 0$: $\Delta = 16$, zeri $2$ e $6$; $x < -4 \ \text{ oppure } \ 2 < x < 6$.
2. $(x^2 + 5x - 6)(x - 6) < 0$: $S = \,\mathopen{]}-\infty, -6\mathclose{[}\, \cup \,\mathopen{]}1, 6\mathclose{[}$.

## Livello 2: un trinomio con il discriminante negativo

$(x^2 + bx + c)(x - r) \lesseqgtr 0$ con $b$ tra $-4$ e $4$, $c$ tra $1$ e $9$, $b^2 < 4c$, $r$ tra $-9$ e $9$; tutti i
versi. Esempio 2 e avviso "Il trinomio senza soluzioni rende impossibile la disequazione".

1. $(x^2 + 2x + 7)(x + 5) < 0$: $\Delta = -24$, il trinomio è sempre positivo; $x < -5$.
2. $(x^2 - 4x + 5)(x - 9) > 0$: $S = \,\mathopen{]}9, +\infty\mathclose{[}$.

## Livello 3: un quadrato

$(x - r)(x^2 - 2sx + s^2) \lesseqgtr 0$ con $s$ tra $-6$ e $6$ diverso da zero, $r$ tra $-9$ e $9$ diverso da $s$. Il
verso è scelto perché lo zero del quadrato cambi la soluzione: con $\geq$ e $\leq$ è un punto isolato fuori
dall'intervallo (esempio 3, avviso "Perdere il punto isolato"), con $>$ e $<$ è un punto tolto dall'intervallo
(avviso "Il quadrato che si annulla"). Metà e metà (`CASE_RANGES`).

1. $(x^2 - 4x + 4)(x - 5) \geq 0$: $\Delta = 0$, quadrato $(x - 2)^2$; $x = 2 \ \text{ oppure } \ x \geq 5$.
2. $(x^2 + 12x + 36)(x - 1) < 0$: $x < -6 \ \text{ oppure } \ -6 < x < 1$.

## Livello 4: una frazione con un trinomio

$\frac{N}{D} \lesseqgtr 0$ già ridotta, tre forme (quote fissate per esercizio, non per tentativo): trinomio
al numeratore e $x - r$ al denominatore (2 su 5, esempio 4), $x - r$ al numeratore e trinomio al denominatore
(7 su 20), quadrato al numeratore e trinomio al denominatore (1 su 4, esempio 6). Zeri tra $-6$ e $6$; verso
largo 2 volte su 3, perché la difficoltà nuova è lo zero del denominatore escluso. C.E. nel primo passaggio.

1. $\frac{x^2 - 11x + 30}{x} < 0$: $x < 0 \ \text{ oppure } \ 5 < x < 6$.
2. $\frac{x^2 + 10x + 25}{x^2 + x - 12} \leq 0$: C.E. $x \neq -4$, $x \neq 3$;
   $S = \{-5\} \cup \,\mathopen{]}-4, 3\mathclose{[}$.

## Livello 5: una frazione da ridurre, con $a$ negativo

$\frac{p}{x - c} \lesseqgtr x - d$, esempio 5 ($\frac{4}{x} > x$). Si scelgono gli zeri $u < v$ del numeratore
ridotto $-x^2 + (u + v)x - uv$ e lo zero $c$ del denominatore (tra $-5$ e $5$, distinti), poi
$d = u + v - c$ (fino a $6$ in valore assoluto) e $p = cd - uv$, tenuto tra $1$ e $16$. I passaggi: C.E.,
$\frac{p}{x - c} - (x - d) \lesseqgtr 0$, $\frac{p - (x - d)(x - c)}{x - c} \lesseqgtr 0$, poi il numeratore
sviluppato, scritto per potenze crescenti quando il termine noto è positivo ($12 + x - x^2$, come $4 - x^2$
nella lezione), e letto con $a < 0$: positivo tra gli zeri.

1. $\frac{10}{x - 2} > x + 1$: $\frac{12 + x - x^2}{x - 2} > 0$; $x < -3 \ \text{ oppure } \ 2 < x < 4$.
2. $\frac{12}{x} < x + 1$: $\frac{12 - x - x^2}{x} < 0$; $-4 < x < 0 \ \text{ oppure } \ x > 3$.

## Livello 6: sistema di due disequazioni di secondo grado

$\begin{cases} T_1 \lesseqgtr 0 \\ T_2 \lesseqgtr 0 \end{cases}$ con due trinomi monici diversi, zeri interi tra
$-6$ e $6$, versi a caso. Esempio 7 (ed esempio 8 per le righe $x^2 \leq 5x$): una riga con zeri opposti si
scrive $x^2 \lesseqgtr k^2$ 3 volte su 5, una con uno zero nullo $x^2 \lesseqgtr kx$ 3 volte su 5. Tutte e due le
righe devono contare: la soluzione è diversa da quella di ciascuna riga da sola. Il sistema impossibile è
escluso (la soluzione vuota non avrebbe distrattori credibili). I passaggi risolvono ogni riga e poi prendono
le strisce comuni.

1. $x^2 - 6x + 8 \geq 0$ e $x^2 - 2x - 3 < 0$: $-1 < x \leq 2$.
2. $x^2 - 6x + 8 \geq 0$ e $x^2 - 16 \leq 0$: $S = [-4, 2] \cup \{4\}$.

## Livello 7: problema con un'area

Esempio 9 e avviso "Dimenticare le limitazioni". Un rettangolo di perimetro $2p$ (2 volte su 3) o due numeri
positivi di somma $p$ (1 volta su 3); l'area, o il prodotto, deve essere maggiore o minore di $A$ (metà e metà,
`CASE_RANGES`). Si scelgono gli zeri $1 \leq u < v$ con $u + v = p$, $p$ da $5$ a $14$, e $A = uv$: così
$A < \frac{p^2}{4}$ (l'area del quadrato) e il problema ha sempre soluzione. Limitazioni $0 < x < p$. Con
"maggiore" la soluzione è $u < x < v$; con "minore" è $0 < x < u \ \text{ oppure } \ v < x < p$.

1. Perimetro $16$ cm, area maggiore di $7\ \text{cm}^2$: $1 < x < 7$.
2. Perimetro $22$ cm, area minore di $28\ \text{cm}^2$: $0 < x < 4 \ \text{ oppure } \ 7 < x < 11$.

## Esercizi "brutti" da evitare

- frazioni che si semplificano, zeri comuni a due fattori, zeri frazionari o grandi;
- un quadrato che non cambia la soluzione (livello 3), una riga del sistema che non conta (livello 6);
- soluzioni o distrattori con tre pezzi, vuoti o uguali a $\mathbb{R}$ (tranne $\emptyset$ al livello 2);
- trinomi scritti già scomposti: lo studente deve trovare $\Delta$ e gli zeri;
- un problema senza soluzione ($A \geq \frac{p^2}{4}$): la lezione lo cita come variante, qui non c'è.

## Variante a scelta multipla

Quattro opzioni distinte, una giusta. I distrattori sono le soluzioni degli errori della lezione; il
controllo li rifà da capo con SymPy dal testo, uno per etichetta. In ordine di preferenza:

- livello 1: `scambiati` (il segno opposto), `estremi` (gli zeri inclusi con il verso stretto), `sistema`
  (avviso della lezione 54: le zone in cui ogni fattore ha il segno richiesto), `radici` (gli zeri del trinomio
  con il segno cambiato, $x^2 - 5x + 6$ letto come nullo in $-2$ e $-3$), `zero` ($x + 4$ letto come nullo in $4$);
- livello 2: `impossibile` ($S = \emptyset$, avviso "Il trinomio senza soluzioni rende impossibile la
  disequazione"), `scambiati`, `estremi`, di riserva `sempre` ($\mathbb{R}$);
- livello 3: `punto` (il quadrato ignorato: il punto isolato perso, o il punto non tolto), `estremi`,
  `scambiati`, di riserva `scambiati ed estremi`;
- livello 4: `denominatore` (con verso largo: gli zeri del denominatore inclusi), `punto` (forma con il
  quadrato), `moltiplica` (solo il numeratore, come moltiplicare per il denominatore), `scambiati`, `estremi`,
  `sistema`;
- livello 5: `moltiplica` (avviso "Moltiplicare per $x$": $4 > x^2$), `segno a` (avviso "Il segno con $a$
  negativo": il numeratore letto come se $a$ fosse positivo), `denominatore`, `estremi`, `sistema`;
- livello 6: `unione` (l'unione invece dell'intersezione), `verso:1` e `verso:2` (una riga con il segno
  letto al contrario, tra le soluzioni invece che fuori), `prodotto` (avviso "Confondere il sistema con la
  tabella dei segni": $T_1 \cdot T_2$ con il verso della prima riga), `estremi`;
- livello 7: `verso` (il verso non cambiato moltiplicando per $-1$), `estremi`, `senza limitazioni` (con
  "minore", avviso "Dimenticare le limitazioni"), `verso senza limitazioni`.

Frequenza delle etichette su 1.000 esercizi per livello (seed da 1): livello 1 `scambiati` ed `estremi`
1.000, `radici` 507, `sistema` 475, `zero` 18; livello 2 `impossibile`, `scambiati` ed `estremi` 1.000; livello
3 `punto`, `scambiati` ed `estremi` 1.000; livello 4 `moltiplica` 1.000, `denominatore` 771, `scambiati` 759,
`estremi` 270, `punto` 200; livello 5 `moltiplica` e `segno a` 1.000, `denominatore` 510, `estremi` 490;
livello 6 `verso:1` 931, `unione` 740, `verso:2` 703, `prodotto` 451, `estremi` 175; livello 7 `verso` ed
`estremi` 1.000, `senza limitazioni` 511, `verso senza limitazioni` 489.

## Figure

Il sito non genera figure per gli esercizi: la tabella dei segni è nei passaggi, scritta a parole ("Segno del
prodotto: $-$ per $x < -4$, $+$ per $-4 < x < 2$, …"), il grafico del sistema anche. Una figura servirebbe
nella soluzione di tutti i livelli: la tabella dei segni con la riga del trinomio (livelli 1-5, soprattutto 3 e
4, dove il punto isolato e il punto tolto si vedono meglio che a parole), la parabola del trinomio con la riga
dei segni sotto (livelli 1-2, come la prima figura della lezione), il grafico del sistema con le strisce
(livello 6), il rettangolo con base $x$ e altezza $p - x$ (livello 7, nel problema).

## Verifica

- `sample.mts disequazioni-secondo-grado-fratte 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000; di
  nuovo con il seed 7001: PASS. Quote dei casi (seed 1): livello 3 punto tolto 506, punto isolato 494; livello 4
  trinomio al numeratore 408, al denominatore 351, quadrato al numeratore 241; livello 7 maggiore 489, minore
  511.
- Esercizi diversi su 1.000 (seed da 1): livello 1 779, livello 2 947, livello 3 576, livello 4 880, livello 5
  469, livello 6 962, livello 7 156. Il livello 7 ha pochi problemi possibili (le coppie $u < v$ con somma da
  $5$ a $14$ sono 40, per due versi e due storie, cioè 160 problemi): sono quasi tutti quelli con numeri da prima superiore, e allargare
  $p$ darebbe aree di centinaia di $\text{cm}^2$.
- Errori piantati a mano, tutti bocciati (20): `correct` spostato; testo dell'opzione giusta con un estremo
  incluso e valori invariati; verso del testo cambiato; etichette di due distrattori scambiate; un campione del
  livello 2 rinominato livello 1 (verso largo, $\Delta < 0$); un campione del livello 1 rinominato livello 3
  (nessun quadrato); punto isolato tolto dall'opzione giusta; opzione con lo zero del denominatore incluso
  scambiata con la giusta; $1x$ nel testo; due opzioni uguali; un'opzione su due righe che non è fatta di due
  intervalli limitati; due intervalli limitati lasciati su una riga; perimetro cambiato nel testo del problema;
  ultimo passaggio con gli estremi sbagliati; versi delle righe del sistema cambiati; notazione dei params
  diversa da quella delle opzioni; soluzione con la parentesi chiusa a $+\infty$ (il primo giro l'ha lasciata
  passare, perché SymPy apre da solo l'intervallo all'infinito: ora il controllo guarda le parentesi);
  soluzione con un estremo finito incluso; valori dell'opzione giusta troncati; livello 7 con la notazione a
  intervalli. Un campione intatto passa.
- `review.mts`: esce con 0 (tutto il LaTeX passa da KaTeX).
- `width.mts`: esce con 0. Problema al massimo 222 px (livelli 1 e 3), opzioni al massimo 226 px; misurate a
  parte su 2.000 esercizi dei livelli 1, 3, 4, 5 e 6, la più larga è 226 px
  ($x < -5 \ \text{ oppure } \ -3 < x < -1$).
- Passaggi e soluzione passano `steps-scan.mts`: nessun ambiente con `\text{}`.

## Domande per la revisione

- Fattore di secondo grado nella tabella dei segni: i passaggi lo studiano in una riga sola con i suoi zeri,
  come la lezione. Se in classe si scompone sempre in due fattori di primo grado, i passaggi vanno riscritti.
- Livello 5: il numeratore con $a < 0$ si legge direttamente ("positivo tra le soluzioni"). La lezione mostra
  anche il raccoglimento del meno con il cambio di verso: quale dei due mettere nei passaggi?
- Livello 6: il sistema impossibile è escluso, e con esso l'ultimo caso limite della lezione (una riga mai
  vera, $x^2 + 1 < 0$). Serve un livello in più con righe sempre vere o mai vere (esempio 8), o basta così?
- Livello 7: al posto della variante "nessun rettangolo" (area maggiore di $\frac{p^2}{4}$) c'è la storia dei
  due numeri con somma $p$. Si vuole anche il caso impossibile, con l'opzione "nessuna misura"?
- Il distrattore `sistema` ai livelli 1 e 4 viene dalla lezione 54, non dalla 89: è ancora un errore
  credibile quando un fattore è un trinomio?
- Per la risposta aperta serve un tipo "unione di intervalli e punti"; i valori delle opzioni
  (`"(-oo,-4)"`, `"{2}"`) sono già in una forma che quel tipo potrebbe usare.
