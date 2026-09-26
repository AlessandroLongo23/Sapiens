# Composizione e funzione inversa

Generatore: `composizione-di-funzioni`
(`src/lib/exercises/v2/generators/composizione-di-funzioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/composizione_di_funzioni.py`. Lezione collegata:
`docs/lezioni/riscritte/44-composizione-di-funzioni.md` (nota: `docs/lezioni/note/44-composizione-di-funzioni.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione: composta tra insiemi finiti, composta in un punto, formula
della composta di due funzioni lineari, formula con una funzione di secondo grado, inversa di una
funzione lineare, inversa con un coefficiente frazionario, riconoscere se c'è l'inversa e leggere il
suo grafico. Ogni livello aggiunge una sola difficoltà. Notazione della lezione: $g \circ f$ letto "g
composto f", $(g \circ f)(x) = g(f(x))$, agisce prima la funzione a destra; $f^{-1}(x)$ scritto nella
variabile $x$ dopo lo scambio delle lettere; insiemi come $\{1,\ 2,\ 3\}$, frecce come $1 \mapsto b$.

## Tipi di risposta

| Livello | Risposta | Scelta multipla |
|---|---|---|
| 1 | `choice` (la composta come elenco di frecce, oppure "non si può calcolare") | la risposta stessa |
| 2 | `number` | `toChoice` |
| 3, 4 | `expression`, `form: "expanded"`, polinomio ordinato per potenze decrescenti | `toChoice` |
| 5, 6 | `expression`, l'inversa in $x$ | `toChoice` |
| 7 | `choice` (quattro risposte fisse, oppure quattro punti) | la risposta stessa |

`params.case` vale `gf`, `fg` o `ff` ai livelli 1-4 (quale composta si chiede), e `biettiva`,
`iniettiva`, `suriettiva`, `nessuna` o `punto` al livello 7.

## Regole comuni

- Si costruisce prima la risposta: le frecce, i coefficienti, il punto; il testo viene dopo.
- Mai `1x`, `0x`, `+ -`, `- -`, termini nulli, esponente 1, `1(` nel problema.
- Ai livelli 2-4 le due composte $g \circ f$ e $f \circ g$ sono sempre diverse (in valore al livello 2,
  come formula ai livelli 3 e 4): un esercizio in cui l'ordine non conta non insegna l'ordine.
- Quattro opzioni distinte, una giusta. Ai livelli 2-6 ogni distrattore è uno degli errori nominati
  qui sotto, e il controllo lo verifica ricalcolando gli errori da solo.
- I passaggi seguono la lezione: la regola "metti $f(x)$ al posto di $x$, tra parentesi", i quattro
  passi per l'inversa (scrivi $y = \dots$, ricava $x$, scambia le lettere, controlla), un controllo
  numerico o con la composizione alla fine.

## Livello 1: composta tra insiemi finiti

$f: A \to B$ e $g: B \to C$ date con le frecce, come nell'esempio 1. $A = \{1, \dots, n\}$ con 3 o 4
elementi, $B$ di 3-5 lettere, $C$ di 2-3 numeri tra $10$, $20$, $30$, $40$ (mai elementi in comune
con $A$). Ogni elemento di $C$ riceve almeno una freccia di $g$, e la composta non è costante. Sette
volte su dieci si chiede $g \circ f$, tre volte su dieci $f \circ g$, che non si può fare perché $g$
porta in $C$ e $f$ è definita solo su $A$. L'opzione "non si può calcolare" c'è sempre, anche quando
si chiede $g \circ f$.

Esempio: $f: 1 \mapsto b,\ 2 \mapsto a,\ 3 \mapsto d$; $g: a \mapsto 10,\ b \mapsto 20,\ c \mapsto 20,\
d \mapsto 10$; $g \circ f$: $1 \mapsto 20,\ 2 \mapsto 10,\ 3 \mapsto 10$ ($c$ non conta).

Esempio: stessi insiemi, si chiede $f \circ g$: $g$ porta in $C = \{10,\ 20\}$, $f(10)$ non ha senso,
quindi non si può calcolare. Tra i distrattori c'è $g \circ f$, cioè l'ordine letto da sinistra.

Distrattori: la composta "posizionale" (all'$i$-esimo elemento di $A$ si dà l'immagine dell'$i$-esima
lettera di $B$, saltando $f$; solo se $B$ ha almeno tanti elementi quanti $A$); la composta con una
freccia sbagliata; "non si può calcolare" (o, nel caso $f \circ g$, la composta $g \circ f$). Con 4
elementi l'opzione va su due righe (`gathered`).

## Livello 2: composta in un punto, per passi

Una funzione lineare $ax + b$ ($0 < |a| \leq 3$, $|b| \leq 5$) e $x^2 + c$ ($|c| \leq 5$), in uno dei
due ruoli, sette volte su dieci; due funzioni lineari le altre. Il punto è un intero tra $-3$ e $3$;
$g \circ f$ e $f \circ g$ metà e metà; valori entro $150$ in valore assoluto.

Esempio (lezione, esempio 2): $f(x) = 2x + 1$, $g(x) = x^2$, $(g \circ f)(3)$: $f(3) = 7$,
$g(7) = 49$.

Esempio: $f(x) = x^2 - 3$, $g(x) = -3x + 1$, $(f \circ g)(2)$: $g(2) = -5$, $f(-5) = 22$.

Distrattori: il valore nell'ordine opposto; il prodotto $f(p) \cdot g(p)$ (avviso "Moltiplicare
invece di comporre"); il valore intermedio (fermarsi a metà); con il quadrato fuori e un valore
intermedio negativo, $-v^2 + c$; poi $\pm 1, \pm 2, \dots$ come riserva.

## Livello 3: formula della composta di due funzioni lineari

$f(x) = ax + b$, $g(x) = cx + d$ con $0 < |a|, |c| \leq 4$, $0 < |b|, |d| \leq 6$. $g \circ f$ quattro
volte su dieci, $f \circ g$ tre, $f \circ f$ tre (esempio 4; per $f \circ f$ si mostra solo $f$ e
$|a| \geq 2$). Coefficienti del risultato entro $40$.

Esempio: $f(x) = -2x + 1$, $g(x) = 3x + 6$, $(f \circ g)(x) = -2(3x + 6) + 1 = -6x - 12 + 1 = -6x - 11$.

Esempio (lezione): $f(x) = 3x - 1$, $(f \circ f)(x) = 3(3x - 1) - 1 = 9x - 4$.

Distrattori: l'altro ordine; la costante di dentro non moltiplicata ($acx + d + b$); il prodotto
$f(x) \cdot g(x)$; la somma $f(x) + g(x)$ (per $f \circ f$: $2ax + 2b$); il segno della costante
sbagliato.

## Livello 4: formula con una funzione di secondo grado

$g(x) = kx^2 + px + q$ con $k \in \{1, 2, -1\}$ (quasi sempre $1$), $p \neq 0$ otto volte su dieci
(la $x$ compare due volte, esempio 3), $|p|, |q| \leq 5$; $f(x) = ax + b$ con
$a \in \{1, 2, 3, -1, -2\}$, $0 < |b| \leq 4$. $g \circ f$ sette volte su dieci, $f \circ g$ tre.
Coefficienti entro $60$.

Esempio (lezione, esempio 3): $f(x) = x - 1$, $g(x) = x^2 - 3x$,
$(g \circ f)(x) = (x - 1)^2 - 3(x - 1) = x^2 - 5x + 4$.

Esempio: $f(x) = 2x + 3$, $g(x) = x^2 - 3x + 5$,
$(g \circ f)(x) = (2x + 3)^2 - 3(2x + 3) + 5 = 4x^2 + 6x + 5$.

Distrattori per $g \circ f$: $(ax + b)^2$ scritto $a^2x^2 + b^2$; l'altro ordine; il prodotto; $p$
moltiplicato solo per $ax$ (parentesi dimenticate, avviso della lezione); il doppio prodotto con il
segno sbagliato. Per $f \circ g$: l'altro ordine; $a$ moltiplicato solo per il primo termine; il
prodotto; $b$ con il segno cambiato.

## Livello 5: inversa di una funzione lineare

$f: \mathbb{R} \to \mathbb{R}$, $f(x) = ax + b$ con $a$ intero, $0 < |a| \leq 6$, $a \neq 1$ (anche
$a = -1$, come l'esempio 10), $0 < |b| \leq 9$. Con $a < 0$ il segno va al numeratore, come
nell'esempio 8: $\frac{5 - x}{2}$, mai $\frac{x - 5}{-2}$. I passaggi con $a < 0$ portano il termine con
la $x$ a sinistra, come la lezione.

Esempio (lezione, esempio 7): $f(x) = 3x - 6$, $y + 6 = 3x$, $f^{-1}(x) = \frac{x + 6}{3}$.

Esempio (lezione, esempio 8): $f(x) = -2x + 5$, $2x = 5 - y$, $f^{-1}(x) = \frac{5 - x}{2}$.

Distrattori: $\frac{x + b}{a}$ (termine noto portato senza cambiare segno); $\frac{x}{a} - b$ (diviso
solo $x$); $\frac{1}{ax + b}$ (avviso "L'inversa non è il reciproco"); $\frac{-x - b}{a}$; $ax - b$.

## Livello 6: inversa con un coefficiente frazionario

$f(x) = \frac{p}{q}x + b$ con $q$ da 2 a 5, $0 < |p| \leq 5$, $p$ e $q$ primi tra loro, $b$ multiplo di
$p$ ($|b| \leq 12$), così l'inversa $\frac{q}{p}x - \frac{q}{p}b$ ha il termine noto intero. Il
controllo finale è con la composizione, $f(f^{-1}(x)) = x$, come nell'esempio 8.

Esempio (lezione, esempio 9): $f(x) = \frac{2}{3}x - 4$, $y + 4 = \frac{2}{3}x$,
$x = \frac{3}{2}(y + 4)$, $f^{-1}(x) = \frac{3}{2}x + 6$.

Esempio: $f(x) = \frac{1}{3}x - 2$, $f^{-1}(x) = 3x + 6$; controllo
$\frac{1}{3}(3x + 6) - 2 = x$.

Distrattori: il termine noto non moltiplicato per il reciproco ($\frac{q}{p}x - b$); il segno del
termine noto; il coefficiente non invertito ($\frac{p}{q}(x - b)$); il segno di $x$; $\frac{q}{p}x + b$.

## Livello 7: c'è l'inversa? E il suo grafico

Sei volte su dieci si chiede se la funzione ha l'inversa, con quattro risposte fisse, sempre in
quest'ordine: "sì, è biettiva", "no: iniettiva, non suriettiva", "no: suriettiva, non iniettiva",
"no: né iniettiva né suriettiva" (ciascuna circa una volta su quattro). Quattro volte su dieci la
funzione è finita, data con le frecce (come l'esempio 6 e l'avviso sulle due frecce da $b$);
altrimenti:

| Caso | Funzione |
|---|---|
| biettiva | $ax + b$ da $\mathbb{R}$ a $\mathbb{R}$, $a \neq 0$ |
| iniettiva, non suriettiva | $ax + b$ da $\mathbb{Z}$ a $\mathbb{Z}$, $\lvert a \rvert \geq 2$ (avviso: $2x$ da $\mathbb{Z}$ a $\mathbb{Z}$) |
| suriettiva, non iniettiva | $kx^2$ da $\mathbb{R}$ a $[0, +\infty)$ |
| né l'una né l'altra | la costante $f(x) = b$ (esempio 11), $kx^2$ da $\mathbb{R}$ a $\mathbb{R}$ |

Le altre quattro volte su dieci: $f(x) = ax + b$ da $\mathbb{R}$ a $\mathbb{R}$ e il punto $(p, q)$ del
suo grafico; si sceglie il punto del grafico di $f^{-1}$, cioè $(q, p)$. $p \neq q$ (il punto non sta
sulla bisettrice). Distrattori: $(p, q)$ (coordinate non scambiate), $(-p, -q)$, $(-q, -p)$ e simili,
scartando quelli che per caso stanno sul grafico di $f^{-1}$ (con $f(x) = b - x$, che è l'inversa di sé
stessa, anche $(p, q)$ è giusto e viene scartato).

Esempio: $f(x) = 5$ da $\mathbb{R}$ a $\mathbb{R}$: $f(0) = f(1) = 5$, nessun $x$ va in $6$: "no: né
iniettiva né suriettiva".

Esempio: $f(x) = 2x + 1$, il punto $(1, 3)$ sta sul grafico di $f$: sul grafico di $f^{-1}$ sta
$(3, 1)$.

## Esercizi da evitare

- Composte in cui l'ordine non cambia il risultato (ai livelli 2-4 vengono scartate).
- Composta costante al livello 1: si risponde senza seguire le frecce.
- $f \circ g$ al livello 1 quando $C$ ha elementi in comune con $A$: potrebbe avere senso.
- $a = 1$ al livello 5 ($x + b$ ha l'inversa $x - b$, troppo facile, e $\frac{x}{a} - b$ coinciderebbe
  con la risposta).
- Inverse con termine noto frazionario al livello 6.
- Il punto sulla bisettrice al livello 7.

## Verifica

- `sample.mts composizione-di-funzioni 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Con seed di
  partenza 7001: PASS.
- Quote dei casi (seed 1): livello 1 $g \circ f$ 691, $f \circ g$ 309; livello 2 502 e 498; livello 3
  405, 280, 315 ($f \circ f$); livello 4 734 e 266; livello 7 punto 368, biettiva 137, iniettiva 169,
  suriettiva 167, nessuna 159.
- Esercizi diversi su 1.000 per livello (seed 1): 979, 982, 745, 938, 195, 191, 585. Il livello 5 ha
  198 esercizi possibili in tutto ($a$ tra 11 valori, $b$ tra 18) e ne escono 195; il livello 6 ha
  circa 200 combinazioni con il termine noto dell'inversa intero. Tutti e due restano sopra 100; per
  allargarli servirebbero coefficienti più grandi, lontani dagli esempi della lezione.
- Errori piantati a mano, tutti bocciati (16 su 16): opzione giusta spostata (livelli 1 e 3); una
  freccia di $f$ cambiata nel testo; $f \circ g$ con la risposta "lista" al posto di "non si può";
  risposta $+1$ (livello 2); due funzioni che commutano, $x + 2$ e $x + 3$; risposta nell'ordine
  opposto (livello 3); LaTeX di un'opzione diverso dal suo valore; risposta non sviluppata; inversa
  sostituita dal reciproco; $a = 1$ al livello 5; inversa con termine noto frazionario; un distrattore
  che non è uno degli errori nominati; classificazione sbagliata; punto con le coordinate non
  scambiate; `params.case` sbagliato.
- Il primo giro della verifica ha trovato un errore vero del generatore: con $A$ più grande di $B$ il
  distrattore "posizionale" leggeva una lettera che non esiste (`undefined` nell'opzione). Corretto, e
  ora anche il `check()` del generatore controlla che ogni opzione abbia valori in $C$.
- `width.mts`: nessuna formula oltre 350 px né opzione oltre 252 px; le più larghe sono le righe di
  frecce del livello 1 (170 px) e le risposte fisse del livello 7 (216 px).
- `review.mts`: esce con 0.

## Domande per la revisione

- Livello 1: $f \circ g$ è sempre impossibile, perché $C$ non ha elementi in comune con $A$. Uno
  studente attento può imparare "se chiedono $f \circ g$ la risposta è non si può". Servirebbe un caso
  in cui $g$ torna in $A$ ($g: B \to A$) e anche $f \circ g$ si calcola?
- Livello 7: le risposte "no: iniettiva, non suriettiva" e simili sono abbreviate per stare nel
  bottone del telefono. Si leggono bene o serve la frase intera ("no, perché è iniettiva ma non
  suriettiva") su due righe?
- Livello 7 riprende la classificazione della lezione 18 (iniettiva, suriettiva, biettiva). La nota
  della lezione propone di togliere l'inversa dalla 18: se la 18 cambia, il suo livello 6 (inversa in
  $y$, $f^{-1}(y)$) e il livello 5 di qui ($f^{-1}(x)$) vanno allineati sulla stessa lettera.
