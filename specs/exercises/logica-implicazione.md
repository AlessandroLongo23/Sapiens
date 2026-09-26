# Implicazione, condizioni necessarie e sufficienti

Generatore: `logica-implicazione` (`src/lib/exercises/v2/generators/logica-implicazione.ts`). Verifica
indipendente: `scripts/exercises/checkers/logica_implicazione.py`. Lezione collegata:
`docs/lezioni/riscritte/66-logica-implicazione.md`, con la sezione "Per il generatore" della nota
`docs/lezioni/note/66-logica-implicazione.md`.

Sette livelli nell'ordine della lezione: il valore di verità di un'implicazione, le quattro forme
(inversa, contraria, contronominale), la tavola di verità, implicazione logica ed equivalenza, condizioni
necessarie e sufficienti, insiemi di verità, negazione di un'implicazione. I sei punti della nota sono
tutti coperti; il punto 3 della nota (tavole e tautologie) è diviso in due livelli, la colonna di una
tavola (3) e le tautologie con $\Rightarrow$ e $\Leftrightarrow$ (4), perché la lezione li presenta in
due sezioni e sono due difficoltà diverse.

## Notazione

Come nella lezione: proposizioni $p$, $q$, $r$; valori V e F; connettivi $\neg$, $\wedge$, $\vee$,
$\to$ (implicazione materiale), $\leftrightarrow$ (doppia implicazione); $\Rightarrow$ e $\Leftrightarrow$
solo per l'implicazione e l'equivalenza logica. Righe della tavola nell'ordine V V, V F, F V, F F.
Inversa $q \to p$, contraria $\neg p \to \neg q$, contronominale $\neg q \to \neg p$. Insieme di verità
$V_p$, universo $U$. "Premessa" e "conseguenza" per le parti dell'implicazione.

Scrittura delle formule: $\neg$ si attacca a una lettera ($\neg p$) e mette tra parentesi il resto
($\neg(p \to q)$); una parte binaria dentro un'altra va tra parentesi, tranne le catene di $\wedge$ (o di
$\vee$), che si scrivono senza ($p \wedge \neg q \wedge \neg r$). Nelle affermazioni con $\Rightarrow$ e
$\Leftrightarrow$ vanno tra parentesi solo i lati che sono un'implicazione o una doppia implicazione:
$(p \to q) \wedge p \Rightarrow q$, $\neg(p \to q) \Leftrightarrow p \wedge \neg q$. La doppia negazione
non si scrive mai: la negazione di $\neg p$ è $p$, e i passaggi lo dicono.

Nei `values` delle opzioni le proposizioni sono scritte in forma serializzata: `p`, `not(p)`,
`imp(p,q)`, `and(p,not(q))`, con i connettivi `not`, `and`, `or`, `imp`, `iff`.

## Tipi di risposta

Tutti i livelli hanno risposta `choice` con quattro opzioni distinte e una sola giusta, tranne la
variante "controesempi" del livello 6, che ha risposta `set` (i numeri in ordine crescente) e la
variante a scelta multipla costruita da `toChoice`.

## Livello 1: il valore di verità di un'implicazione

Un numero $n$ da 2 a 40 e due fatti su $n$, uno per la premessa e uno per la conseguenza, nella forma
dell'esempio 1 della lezione: "Se $n$ …, allora $n$ …". I fatti: pari, dispari, multiplo di $k$,
divisibile per $k$ ($k$ da 3 a 9, così nessuno coincide con "pari"), divisore di $m$ ($m$ da 10 a 60),
numero primo, $n > k$, $n < k$ ($k$ entro 12 da $n$). Premessa e conseguenza sono di tipo diverso (mai
pari e dispari insieme, mai multiplo e divisibile insieme). La riga della tavola si sceglie prima: V V,
V F, F V, F F, un quarto ciascuna; poi si cercano i fatti con quei valori.

Le opzioni sono righe della tavola con un valore: "premessa V, conseguenza F / implicazione falsa". Due
righe, ognuna con tutti e due i valori: quella dei due fatti e una con uno dei due fatti giudicato male.
Così la riga giusta non si riconosce perché compare due volte, e il distrattore principale è il valore
sbagliato sulla riga giusta: con la premessa falsa, "implicazione falsa" (riquadro "Pensare che
l'implicazione sia falsa quando la premessa è falsa").

Esempio: "Se $12$ è pari, allora $12$ è multiplo di $5$." Premessa V ($12 = 2 \cdot 6$), conseguenza F
($12 = 5 \cdot 2 + 2$): implicazione falsa.

Esempio: "Se $21$ è un numero primo, allora $21$ è un divisore di $19$." Premessa F
($21 = 3 \cdot 7$), conseguenza F: implicazione vera.

## Livello 2: inversa, contraria e contronominale

Due varianti, metà ciascuna.

- `simboli`: un'implicazione $x \to y$ con $x$ e $y$ lettere o lettere negate ($p$ e $q$ in un ordine
  qualsiasi, ognuna negata un terzo delle volte), e la domanda "Qual è la inversa / la contraria / la
  contronominale di questa implicazione?". Le opzioni sono le tre forme più una quarta implicazione con
  una sola delle due parti negata o scambiata ($\neg x \to y$, $x \to \neg y$, $\neg y \to x$,
  $y \to \neg x$) oppure l'implicazione stessa. Il distrattore che conta è lo scambio tra le forme
  (riquadro "Scambiare un'implicazione con la sua inversa" e la nota sui nomi).
- `parole`: un'implicazione di tutti i giorni ("Se piove, prendo l'ombrello") e un'altra frase costruita
  con le stesse due parti; si chiede che cosa è la seconda rispetto alla prima: inversa, contraria,
  contronominale o negazione ("Piove e non prendo l'ombrello"), un quarto ciascuna.

Le frasi vengono da 14 coppie premessa-conseguenza scritte a mano, ognuna con la sua negazione
(elencate in `PAIRS`, uguali nel generatore e nel controllo): piove / prendo l'ombrello, fa freddo /
accendo la stufa, studio / supero la verifica, è domenica / vado allo stadio, ho fame / mangio una mela,
c'è il sole / vado al mare, finisco i compiti / guardo un film, il semaforo è rosso / mi fermo, perdo
l'autobus / arrivo tardi, nevica / resto a casa, ho sete / bevo un succo, mi alleno / vinco la gara, il
telefono è carico / ti chiamo, è tardi / vado a dormire. Le negazioni sono "non piove", "il semaforo non
è rosso", "c'è" → "non c'è", e così via. Le frasi sono "Se A, B." e "A e B." con la maiuscola.

Esempio: $\neg p \to q$, contronominale: $\neg q \to p$ (la negazione di $\neg p$ è $p$). Distrattori:
$q \to \neg p$ (inversa), $p \to \neg q$ (contraria), $\neg q \to \neg p$ (una sola negazione tolta).

Esempio: "Se il semaforo è rosso, mi fermo" e "Se non mi fermo, il semaforo non è rosso":
contronominale.

## Livello 3: la tavola di verità

Una proposizione in $p$ e $q$ con $\to$ o $\leftrightarrow$, di cinque forme ($x$, $y$, $z$ lettere o
lettere negate):

| Caso | Forma | Quota |
|---|---|---|
| `imp` | $x \to y$ | 25% |
| `iff` | $x \leftrightarrow y$ | 15% |
| `neg` | $\neg(x \to y)$ | 15% |
| `and` | $(x \to y) \wedge z$ | 25% |
| `or` | $(x \to y) \vee z$ | 20% |

Il problema è la tavola con le colonne $p$, $q$ e la proposizione, piena di "?"; si sceglie la colonna,
scritta dall'alto in basso ("V, F, V, V"). La tavola sta in un `array` di KaTeX (larga al massimo 241
px a 18 px). I passaggi danno, riga per riga, il valore di ogni parte della proposizione.

Distrattori: le colonne delle proposizioni che si ottengono con gli errori tipici, applicati a ogni parte
della formula: $\to$ letta al contrario ($y \to x$), come $\wedge$ (l'implicazione falsa con la premessa
falsa), come $\leftrightarrow$; $\leftrightarrow$ letta come $\to$ o come $\wedge$; il $\neg$ esterno
dimenticato; $\wedge$ e $\vee$ scambiati. Se non bastano, la colonna giusta con una riga cambiata.

Esempio: $p \to q$, colonna V, F, V, V. Distrattori: V, V, F, V ($q \to p$), V, F, F, F ($p \wedge q$),
V, F, F, V ($p \leftrightarrow q$).

Esempio: $(q \to p) \wedge \neg q$, colonna F, V, F, V.

## Livello 4: implicazione logica ed equivalenza

"Quale di queste affermazioni è vera?" (metà delle volte) o "falsa?", con quattro affermazioni con
$\Rightarrow$ o $\Leftrightarrow$ e una sola del tipo chiesto. Le affermazioni vengono da due elenchi
scritti con due lettere $a$, $b$ (poi $p, q$ oppure $q, p$).

Vere: $(a \to b) \wedge a \Rightarrow b$ (esempio 3), $(a \to b) \wedge \neg b \Rightarrow \neg a$,
$(a \to b) \Leftrightarrow (\neg b \to \neg a)$, $(a \to b) \Leftrightarrow \neg a \vee b$,
$\neg(a \to b) \Leftrightarrow a \wedge \neg b$, $(a \leftrightarrow b) \Rightarrow (a \to b)$,
$(a \leftrightarrow b) \Leftrightarrow (a \to b) \wedge (b \to a)$, $\neg a \Rightarrow (a \to b)$,
$b \Rightarrow (a \to b)$, $(b \to a) \Leftrightarrow (\neg a \to \neg b)$.

False, dagli errori della lezione: $(a \to b) \wedge b \Rightarrow a$ (esempio 4, dedurre la premessa
dalla conseguenza), $(a \to b) \wedge \neg a \Rightarrow \neg b$, $(a \to b) \Leftrightarrow (b \to a)$,
$(a \to b) \Leftrightarrow (\neg a \to \neg b)$, $\neg(a \to b) \Leftrightarrow (a \to \neg b)$ e
$\neg(a \to b) \Leftrightarrow (\neg a \to \neg b)$ (negare con un'implicazione),
$(a \to b) \Rightarrow (a \leftrightarrow b)$, $(a \to b) \Rightarrow (b \to a)$,
$(a \to b) \Leftrightarrow a \vee \neg b$, $\neg a \Rightarrow \neg(a \to b)$ (la premessa falsa che
renderebbe falsa l'implicazione).

I passaggi, per ogni opzione: "vera, $A \to B$ è vera in tutte le righe" oppure la riga che la smentisce.

Esempio (vera): $\neg(q \to p) \Leftrightarrow q \wedge \neg p$, tra $(q \to p) \Rightarrow (q \leftrightarrow p)$,
$\neg q \Rightarrow \neg(q \to p)$, $(q \to p) \Rightarrow (p \to q)$.

Esempio (falsa): $(p \to q) \wedge q \Rightarrow p$, falsa con $p = $ F, $q = $ V, tra tre affermazioni
vere.

## Livello 5: condizioni necessarie e sufficienti

Due condizioni su $n$ naturale (con lo $0$) o su $x$ intero, come nell'esempio 5 della lezione:
"“$n$ è multiplo di $6$” per “$n$ è multiplo di $3$”, con $n$ naturale." La domanda: che condizione è la
prima per la seconda? Le quattro risposte, sempre tutte e quattro tra le opzioni, un quarto ciascuna
(la risposta si sceglie prima, poi la coppia):

- sufficiente ma non necessaria: multiplo di $a$ per multiplo di $b$ con $b \mid a$ ($b$ da 3 a 6,
  $a = 2b, 3b, 4b$); multiplo di $4, 6, 8, 10, 12$ per pari; $x = a$ per $x^2 = a^2$ ($a$ da $-9$ a $9$,
  non nullo); $n > a$ per $n > b$ con $a > b$; divisore di $m$ per divisore di un multiplo di $m$ (fino a
  60);
- necessaria ma non sufficiente: le stesse coppie scambiate;
- necessaria e sufficiente, in un ordine o nell'altro: multiplo di $10$ e "l'ultima cifra di $n$ è $0$";
  multiplo di $a$ e di $b$ ($a$, $b$ primi tra loro, prodotto fino a 35) e multiplo di $ab$;
  "$x = a$ o $x = -a$" e $x^2 = a^2$; $n > k$ e $n \ge k + 1$;
- né necessaria né sufficiente: multipli di due numeri da 2 a 9 senza che uno divida l'altro; pari (o
  dispari) e multiplo di un numero dispari da 3 a 9; divisori di due numeri da 6 a 36 senza che uno
  divida l'altro e con un fattore comune.

I passaggi dicono se la prima è sufficiente (perché, oppure il controesempio più piccolo) e se è
necessaria (idem). Il controesempio si cerca tra $0, 1, 2, \dots$ o tra $0, 1, -1, 2, -2, \dots$.

La verifica controlla le implicazioni su $0 \dots 2999$ (naturali) e su $-300 \dots 300$ (interi): le
condizioni ammesse sono periodiche con periodo al massimo 60 o soglie sotto 40, quindi un intervallo così
basta.

Esempio: "“$n > 9$” per “$n > 14$”, con $n$ naturale": necessaria ma non sufficiente ($n = 10$).

Esempio: "“$x^2 = 81$” per “$x = 9$ o $x = -9$”, con $x$ intero": necessaria e sufficiente.

## Livello 6: implicazione e insiemi di verità

Un universo $U = \{1, 2, 3, \dots, N\}$ con $N$ tra 10, 12, 15, 20 e due enunciati $p(x)$, $q(x)$ tra
pari, dispari, multiplo di $k$ ($k$ da 3 a 6), divisore di 12, 18, 20, 24, 30 o 36, $x > k$, $x < k$,
primo. Nessun insieme di verità è vuoto o uguale a $U$. Due varianti, metà ciascuna:

- `relazione`: quale relazione c'è tra $p(x)$ e $q(x)$ in $U$: solo $p(x) \Rightarrow q(x)$, solo
  $q(x) \Rightarrow p(x)$, $p(x) \Leftrightarrow q(x)$, nessuna implicazione, un quarto ciascuna. Le
  coppie equivalenti vengono da $x > k$ e $x \ge k + 1$, $x < k$ e $x \le k - 1$, "multiplo di $a$ e di
  $b$" e multiplo di $ab$ (con $ab \le 12$).
- `controesempi`: gli elementi di $U$ che rendono falsa $p(x) \Rightarrow q(x)$, cioè $V_p \setminus V_q$
  (mai vuoto). Distrattori: $V_q \setminus V_p$ (i controesempi dell'inversa, l'errore del riquadro),
  $V_p \cap V_q$, $V_p$, $V_q$, gli elementi fuori da tutti e due, poi la risposta con un elemento in più
  o in meno.

I passaggi elencano $V_p$ e $V_q$ e controllano le inclusioni con un elemento che le smentisce.

Esempio: $U = \{1, \dots, 15\}$, $p(x)$: $x > 3$, $q(x)$: $x > 6$. Solo $q(x) \Rightarrow p(x)$: $4 \in V_p$
ma $4 \notin V_q$.

Esempio: $U = \{1, \dots, 12\}$, $p(x)$: $x$ è un divisore di $24$, $q(x)$: $x$ è dispari. Controesempi
$\{2, 4, 6, 8, 12\}$.

## Livello 7: la negazione di un'implicazione

Tre varianti:

- `parole` (40%): una frase delle 14 coppie, "Se piove, prendo l'ombrello"; le opzioni sono frasi su due
  righe: "Piove / e non prendo l'ombrello" (giusta), e tre tra "Se piove, / non prendo l'ombrello"
  (negare con un'altra implicazione, riquadro della lezione), "Se non piove, / non prendo l'ombrello"
  (la contraria), "Non piove / e non prendo l'ombrello" (negare tutte e due le parti), "Non piove / e
  prendo l'ombrello".
- `simboli` (30%): $x \to y$ con lettere o lettere negate; giusta $x \wedge \neg y$, distrattori tre
  tra $x \to \neg y$, $\neg x \to \neg y$, $\neg x \wedge \neg y$, $\neg x \wedge y$.
- `de morgan` (30%): $x \to (y \vee z)$ o $x \to (y \wedge z)$ con $p$, $q$, $r$, come nel punto 2
  dell'esempio 7. Giusta $x \wedge \neg y \wedge \neg z$ (o $x \wedge (\neg y \vee \neg z)$); distrattori
  tre tra De Morgan sbagliato ($x \wedge (\neg y \vee \neg z)$ al posto dell'altra), l'implicazione
  $x \to (\neg y \wedge \neg z)$, la premessa negata $\neg x \wedge \dots$, $\neg x \to \dots$.

La verifica controlla con la tavola di verità che una sola opzione sia equivalente a
$\neg(x \to y)$, e che la giusta sia scritta come nella lezione: premessa $\wedge$ conseguenza negata.

Esempio: $p \to (q \vee r)$, negazione $p \wedge \neg q \wedge \neg r$.

Esempio: "Se ho sete, bevo un succo", negazione "Ho sete e non bevo un succo".

## Esercizi da evitare

- Fatti di tipo uguale in premessa e conseguenza ("Se $12$ è pari, allora $12$ è divisibile per $2$").
- Una condizione mai vera o sempre vera, un insieme di verità vuoto o uguale a $U$.
- Doppie negazioni scritte ($\neg\neg p$).
- Un'opzione che si riconosce dalla forma: al livello 1 ogni riga compare due volte, al livello 2 le
  tre forme sono sempre tutte presenti, al livello 5 le quattro risposte sono sempre le stesse.
- Frasi a parole ambigue: le frasi sono solo quelle delle coppie scritte a mano, e le frasi del livello
  1 parlano di un numero preciso, così il valore di verità è certo.

## Figure

Nessuna. Il livello 6 vorrebbe il diagramma di Eulero-Venn con $V_p$ e $V_q$ (come le due figure della
lezione), che oggi il sito non disegna per gli esercizi: gli insiemi di verità si ricavano dal testo e i
passaggi li elencano.

## Verifica (26 settembre 2026)

- `sample.mts logica-implicazione 1000 all 1 | verify.py`: PASS, 7.000 su 7.000, con le quote dei casi
  dentro gli intervalli di `CASE_RANGES`. Con il seed di partenza 7001: PASS.
- Errori piantati a mano, tutti bocciati (21 su 21, più tre tavole con una riga cambiata): livello 1
  risposta spostata, $n = 45$, divisore cambiato nei params (il testo non torna), premessa e conseguenza
  dello stesso tipo; livello 2 forma chiesta cambiata, frasi di un'altra coppia; livello 3 colonna
  giusta con una riga sbagliata (nessuna opzione giusta), formula diversa dal problema, opzioni doppie;
  livello 4 domanda rovesciata, freccia nel LaTeX diversa dai `values`; livello 5 caso sbagliato,
  condizione cambiata, risposta spostata; livello 6 controesempio mancante, opzione giusta sbagliata,
  proprietà cambiata, $N = 11$; livello 7 due negazioni giuste, frase di un'altra coppia, LaTeX della
  giusta alterato.
- Esercizi diversi su 1.000 (testo e insieme delle opzioni): 981, 170, 226, 885, 404, 771, 149. Contando
  solo il testo: 966, 80, 88, 2, 404, 771, 38. I livelli 2, 3 e 7 sono piccoli per natura: con due lettere
  le implicazioni tra lettere e lettere negate sono 8, le forme della tavola 88, le coppie di frasi 14; a
  variare sono soprattutto le opzioni. Al livello 4 il testo è sempre "Quale di queste affermazioni è
  vera / falsa?" e l'esercizio sta tutto nelle opzioni.
- `review.mts`: esce con 0. `width.mts`: esce con 0; al massimo 244 px per una riga del problema (livello
  6) e 248 px per un'opzione (un insieme su due righe al livello 6), 237 px al livello 4.
- `steps-scan.mts`: nessun errore KaTeX nelle soluzioni e nei passaggi.

## Domande per la revisione

1. Nomi delle forme: il generatore usa inversa $q \to p$, contraria $\neg p \to \neg q$, contronominale
   $\neg q \to \neg p$, come la lezione. Se il libro di riferimento chiama "inversa" la
   $\neg p \to \neg q$, cambiano il livello 2 e due affermazioni del livello 4.
2. Doppia negazione: la contronominale di $\neg p \to q$ è scritta $\neg q \to p$ e la negazione di
   $\neg p \to (\neg q \wedge r)$ contiene $q \vee \neg r$. La lezione 66 non dice esplicitamente che
   $\neg\neg p$ equivale a $p$ (lo dà per visto nella 65): i passaggi lo dicono ogni volta. Va bene, o le
   lettere negate vanno tolte dai livelli 2 e 7?
3. Livello 5, "necessaria e sufficiente" con $n > k$ e $n \ge k + 1$ vale solo tra i naturali; la frase
   lo dice ("con $n$ naturale"). Sono coppie abbastanza naturali per uno studente, o conviene tenere solo
   i multipli e le cifre?
4. Livello 1: le opzioni "premessa V, conseguenza F / implicazione falsa" chiedono di leggere la riga
   della tavola, come nell'esempio 1. È una domanda a quattro risposte vere e proprie; in alternativa si
   potrebbe chiedere "Vero o falso" con due opzioni, che oggi la pagina non ama.
5. Livello 6: con $x > k$ e $U$ fino a 20 gli insiemi di verità arrivano a 16 elementi, e un'opzione va
   su due righe lunghe. Si può restringere $k$ se sul telefono stanca.
