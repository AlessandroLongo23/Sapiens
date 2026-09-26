# Operazioni con le frazioni algebriche

Generatore: `frazioni-algebriche-operazioni` (`src/lib/exercises/v2/generators/frazioni-algebriche-operazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/frazioni_algebriche_operazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/48-frazioni-algebriche-operazioni.md` (note in `docs/lezioni/note/`, sezione
"Per il generatore").

Lo studente riceve un'espressione con frazioni algebriche nella sola lettera $x$ e la calcola. La
consegna è "Calcola e semplifica il risultato."; al livello 5, in circa 4 esercizi su 10, è "Scrivi
le condizioni di esistenza dell'espressione." La risposta è una frazione algebrica
(`answer.kind = "expression"`, `form = "factored"`); le domande sulle C.E. sono a scelta multipla
(`answer.kind = "choice"`).

## Forma del risultato

Il risultato si scrive come negli esempi della lezione:

- il segno meno davanti alla frazione, mai dentro il numeratore: $-\dfrac{1}{x + 3}$, $-\dfrac{3x - 20}{(x - 4)(x + 4)}$;
- il denominatore scomposto: un numero, una potenza di $x$ senza parentesi, poi i fattori
  irriducibili in ℤ, primitivi e con il primo coefficiente positivo, ciascuno tra parentesi con il
  suo esponente: $4x^2$, $x(x - 1)(x + 1)$, $3(x + 1)^2$;
- il numeratore allo stesso modo, quindi scomposto quando si scompone: $\dfrac{3(x - 1)}{(x - 3)(x + 3)}$,
  $\dfrac{2x(x - 2)}{x + 2}$ (esempi 2 e 5); un fattore solo resta senza parentesi: $\dfrac{x + 1}{x + 2}$;
- niente da semplificare: numeratore e denominatore primi tra loro, anche nei numeri;
- l'ordine dei fattori è $x$, poi i fattori di primo grado per radice decrescente, come nella
  lezione: $(x - 3)(x + 3)$, $x(x - 1)(x + 1)$.

Il verificatore accetta anche il numeratore sviluppato ($\dfrac{3x - 3}{(x - 3)(x + 3)}$), come
suggerisce la nota della lezione, ma la risposta del generatore è sempre quella scomposta. Nella
scelta multipla nessun distrattore ha lo stesso valore della risposta giusta: una frazione non
semplificata vale quanto il risultato dove esiste, quindi non è un errore che si possa mostrare
tra le opzioni.

Le condizioni di esistenza sono le radici di tutti i denominatori e del numeratore di ogni frazione
che segue il segno $:$ (il divisore). Sono sempre numeri interi. Si scrivono nella soluzione e
nell'ultimo passaggio: "C.E.: $x \neq 3$, $x \neq -3$", una per volta, nell'ordine in cui compaiono.
Nelle opzioni delle domande sulle C.E. sono in ordine crescente, perché l'ordine non tradisca
l'opzione giusta.

## Si costruisce dalla risposta

Si scelgono prima i fattori (radici intere tra $-6$ e $6$), poi i numeratori, e solo alla fine si
sviluppano i polinomi del testo. Quando il caso chiede che il risultato si semplifichi, il
numeratore si ricava in modo che la somma si annulli nella radice di un fattore del denominatore
comune: per esempio al livello 3 con fattore comune $x - a$ si prendono $c_1 = |g(a)|/G$ e
$c_2 = |h(a)|/G$, dove $g$ e $h$ sono i quozienti del MCM, e il segno dell'operazione che rende la
somma nulla in $a$.

## Rappresentazione

`params.case` è il caso del livello; `params.a`, `b`, `c`, `d` sono le radici dei fattori;
`params.n1`, `n2` i numeratori come coppie $[p, q]$ ($px + q$); `params.op` il segno tra le due
frazioni; `params.k`, `m`, `j`, `i` coefficienti ed esponenti dei monomi; `params.tpl` la forma
dell'esercizio ai livelli 3, 4 e 5; `params.d3` il denominatore del divisore al livello 6;
`params.dv` e `params.s` il divisore e il segno dell'ultima frazione al livello 7; `params.ask`
dice se al livello 5 si chiede il risultato o le C.E.; `params.ce` le condizioni di esistenza.

## Regole comuni

- Solo la lettera $x$; coefficienti interi, al massimo 60 in valore assoluto nel testo.
- Nessuna frazione del testo si semplifica da sola (tranne il divisore del livello 7, che è così
  nell'esempio 10); numeratori numerici positivi; il primo termine di un numeratore è positivo.
- Il risultato non è mai $0$; il suo numeratore ha grado al massimo 2, il denominatore al massimo 3.
- I passaggi seguono la lezione: scomposizione dei denominatori, C.E., denominatore comune, i
  numeratori moltiplicati per i quozienti, lo sviluppo con il segno distribuito, la riduzione, la
  scomposizione del numeratore e la semplificazione, il risultato con le C.E. Il verificatore
  controlla che ogni uguaglianza dei passaggi sia vera.
- Il livello 7 va su due righe (`aligned`, a capo prima dell'ultima frazione): su una riga sola
  sfiora i 350 px.

## Livello 1: stesso denominatore

$\dfrac{A}{x - a} \pm \dfrac{B}{x - a}$ con $A$ e $B$ di primo grado. Tre volte su quattro una
sottrazione, per l'errore del primo avviso della lezione. Circa 6 su 10 il risultato si semplifica
e diventa un numero intero ($A \pm B = k(x - a)$); negli altri il numeratore non ha fattori in
comune con $x - a$.

1. $\dfrac{3x + 1}{x - 2} - \dfrac{x + 5}{x - 2} = \dfrac{2x - 4}{x - 2} = 2$, C.E. $x \neq 2$ (esempio 1).
2. $\dfrac{4x - 8}{x + 4} + \dfrac{4x + 4}{x + 4} = \dfrac{4(2x - 1)}{x + 4}$, C.E. $x \neq -4$.

## Livello 2: denominatori di primo grado primi tra loro

$\dfrac{A}{x - a} \pm \dfrac{B}{x - b}$ con $a \neq b$ (uno dei due può essere $x$). Circa 7 su 10
con due numeratori numerici da 1 a 6, gli altri con un numeratore $x + q$. Il MCM è il prodotto, e
il risultato non si semplifica mai (lo dice la lezione nell'esempio 2).

1. $\dfrac{1}{x - 3} + \dfrac{2}{x + 3} = \dfrac{3(x - 1)}{(x - 3)(x + 3)}$ (esempio 2).
2. $\dfrac{4}{x + 6} - \dfrac{1}{x - 2} = \dfrac{3x - 14}{(x - 2)(x + 6)}$.

## Livello 3: denominatori da scomporre

Due frazioni con almeno un denominatore di secondo grado scritto sviluppato. Metà con un fattore
comune: $\dfrac{c_1}{(x - a)(x - b)} \pm \dfrac{c_2}{(x - a)h}$ con $h$ uguale a $x$, a $x - c$ o a
un numero (come $2x - 6$). Metà con un fattore opposto: $\dfrac{N}{(x - a)(x - b)} \pm \dfrac{c}{a - x}$,
con $a > 0$ come nella lezione ($3 - x$). In ciascuna metà circa un esercizio su due si semplifica
alla fine (per i fattori opposti un po' meno, circa 15 su 100 del livello, perché più tentativi
danno numeri oltre i limiti).

1. $\dfrac{3}{x^2 - 1} - \dfrac{1}{x^2 - x} = \dfrac{2x - 1}{x(x - 1)(x + 1)}$ (esempio 3).
2. $\dfrac{x + 9}{x^2 - 9} + \dfrac{2}{3 - x} = -\dfrac{1}{x + 3}$ (esempio 4).

## Livello 4: prodotto

$\dfrac{A}{B} \cdot \dfrac{C}{D}$ con scomposizione e semplificazione in croce; C.E. dai due
denominatori. Tre forme, circa un terzo ciascuna:

- monomi: $\dfrac{(x - a)(x - b)}{kx^j} \cdot \dfrac{mx^i}{(x - b)(x - c)}$, con $k$ e $m$ che hanno un
  fattore comune e $i \neq j$; a volte $c = b$ e il secondo denominatore è un quadrato (esempio 5);
- fattori opposti: $\dfrac{x \mp a}{x - b} \cdot \dfrac{kx^j(x - b)}{a^2 - x^2}$ (esempio 6);
- trinomi: $\dfrac{(x - a)(x - b)}{x(x - c)} \cdot \dfrac{k(x - c)}{(x - a)(x - d)}$.

1. $\dfrac{x^2 - 4}{3x} \cdot \dfrac{6x^2}{x^2 + 4x + 4} = \dfrac{2x(x - 2)}{x + 2}$ (esempio 5).
2. $\dfrac{x - 4}{x - 2} \cdot \dfrac{x^2 - 2x}{16 - x^2} = -\dfrac{x}{x + 4}$.

## Livello 5: quoziente

$\dfrac{A}{B} : \dfrac{C}{D}$, con il numeratore $C$ del divisore che contiene $x$: le C.E. sono
tre, due dai denominatori e una dal numeratore del divisore. Tre forme: divisore di primo grado
come l'esempio 7, divisore monomio ($\dfrac{kx^j}{x - a} : \dfrac{mx^{j + 1}}{(x - a)(x - b)}$),
risultato senza $x$ al denominatore ($\dfrac{(x - a)(x - b)}{k(x - c)} : \dfrac{x - b}{x(x - c)}$).
Circa 4 esercizi su 10 chiedono solo le C.E., a scelta multipla, come suggerisce la nota della
lezione: il risultato semplificato da solo non mostra l'errore sul numeratore del divisore.

1. $\dfrac{x^2 - 1}{x^2 + 2x} : \dfrac{x - 1}{x} = \dfrac{x + 1}{x + 2}$, C.E. $x \neq 0$, $x \neq -2$, $x \neq 1$ (esempio 7).
2. C.E. di $\dfrac{x^2 + 2x - 8}{5x + 15} : \dfrac{x - 2}{x^2 + 3x}$: $x \neq -3$, $x \neq 0$, $x \neq 2$.

## Livello 6: una parentesi divisa per una frazione

$\left(\dfrac{N_1}{x - a} \pm \dfrac{N_2}{x - b}\right) : \dfrac{m P}{D}$. Circa 4 su 10 con due
numeri al numeratore (esempio 8), gli altri con i quadrati di binomi
$\dfrac{x - b}{x - a} - \dfrac{x - a}{x - b}$ (esempio 9). Il numeratore del divisore è la parte
con la $x$ del numeratore della parentesi, $P$, per un numero $m$ fino a 4 che divide il suo
fattore numerico; il denominatore $D$ è $(x - a)^2$, $(x - b)^2$ o $(x - a)(x - b)$, sviluppato.
Così il risultato si semplifica sempre, come nei due esempi.

1. $\left(\dfrac{1}{x - 1} - \dfrac{1}{x + 1}\right) : \dfrac{2}{x^2 - 1} = 1$ (esempio 8).
2. $\left(\dfrac{x + 1}{x - 1} - \dfrac{x - 1}{x + 1}\right) : \dfrac{2x}{x^2 - 2x + 1} = \dfrac{2(x - 1)}{x + 1}$ (esempio 9).

## Livello 7: potenza, quoziente e somma

$\left(1 \mp \dfrac{c}{x - \beta}\right)^2 : \dfrac{P}{Q} \pm \dfrac{k}{\beta^2 - x^2}$, come
l'esempio 10. La parentesi vale $\dfrac{u}{v}$ con $u = x - \alpha$ e $v = x - \beta$; il divisore
è $\dfrac{u^2}{uv}$ o $\dfrac{uv}{v^2}$, sviluppati, e il quoziente vale ancora $\dfrac{u}{v}$;
l'ultima frazione ha il denominatore opposto di $(x - \beta)(x + \beta)$. Metà dei risultati si
semplifica: $k$ è scelto perché il numeratore finale si annulli in $x = \beta$, con $k \le 40$.

1. $\left(1 - \dfrac{2}{x + 1}\right)^2 : \dfrac{x^2 - 2x + 1}{x^2 - 1} + \dfrac{4}{1 - x^2} = \dfrac{x - 3}{x - 1}$ (esempio 10).
2. $\left(1 + \dfrac{5}{x - 2}\right)^2 : \dfrac{x^2 + x - 6}{x^2 - 4x + 4} + \dfrac{20}{4 - x^2} = \dfrac{x + 7}{x + 2}$.

## Esercizi "brutti" da evitare

- una frazione del testo che si semplifica già da sola, un numeratore uguale all'altro, un
  risultato nullo;
- C.E. con valori frazionari (per esempio dal numeratore $2x - 3$ di un divisore);
- numeri grandi: numeratori del livello 1 fino a 12, coefficienti del testo fino a 60, numeratore
  dell'ultima frazione del livello 7 fino a 40;
- opposti scritti con un numero negativo davanti ($-3 - x$): il fattore opposto è sempre $a - x$
  con $a > 0$, o $a^2 - x^2$.

## Variante a scelta multipla

Quattro opzioni con valori diversi, una sola giusta, tutte nella forma del risultato. Distrattori,
dagli avvisi della lezione:

- il meno che cambia solo il primo termine del numeratore ("Il meno davanti a una frazione"):
  $3x + 1 - x + 5$;
- numeratori e denominatori sommati ("Sommare numeratori e denominatori"): $\dfrac{A + B}{2x - a - b}$;
- i numeratori sommati sopra il MCM senza moltiplicarli per i quozienti, o moltiplicati per il
  quoziente sbagliato;
- il segno del fattore opposto ignorato ($\dfrac{2}{3 - x}$ trattato come $\dfrac{2}{x - 3}$);
- nel prodotto: i numeri semplificati capovolti, un esponente di $x$ sbagliato, il quadrato
  $(x + 2)^2$ semplificato tutto invece che una volta sola;
- nel quoziente: la moltiplicazione senza il reciproco, il reciproco del risultato;
- al livello 7: la potenza del solo numeratore ("Elevare solo il numeratore"), la somma fatta prima
  della divisione, il primo numeratore non moltiplicato per il suo quoziente;
- il risultato con il segno cambiato.

Nelle domande sulle C.E.: senza la condizione del numeratore del divisore ("Dimenticare il
numeratore del divisore"), le sole C.E. del risultato, con anche le radici dei numeratori, con i
segni cambiati, con una condizione in meno. Se i distrattori non bastano: il fattore numerico del
risultato cambiato di 1, 2, ...; per le C.E., un valore spostato di 1.

## Verifiche fatte (26 settembre 2026)

- `sample.mts frazioni-algebriche-operazioni 1000 all 1 | verify.py`: PASS, 7.000 su 7.000; con
  il seed di partenza 7001: PASS, 7.000 su 7.000. Quote dei casi (seed 1): livello 1 si semplifica
  640; livello 2 numeratori numeri 716; livello 3 fattore comune 275 e 273, fattori opposti 163 e
  289 (si semplifica / non si semplifica); livello 4 monomi 294, fattori opposti 371, trinomi 335;
  livello 5 C.E. 418; livello 6 numeri 374; livello 7 si semplifica 462. Tutte dentro
  `CASE_RANGES`.
- Errori piantati a mano, tutti bocciati (18): risposta non semplificata, $\dfrac{2(x - 3)}{x - 3}$
  al posto di $2$, anche con il segno dentro la frazione; valore della risposta cambiato;
  denominatore con $x^2 - 9$ non scomposto; fattore comune $(x + 7)$ lasciato sopra e sotto; segno
  meno dentro il numeratore; indice dell'opzione giusta spostato; due opzioni uguali; LaTeX di
  un'opzione diverso dal suo valore; opzione giusta con il segno cambiato; caso sbagliato in
  `params`; alla domanda sulle C.E. l'opzione giusta spostata su quella senza il numeratore del
  divisore; soluzione senza la C.E. del divisore; segno cambiato nel testo; un passaggio con
  un'uguaglianza falsa; un esercizio del livello 7 presentato come livello 6; un numero oltre 60
  nel testo.
- `review.mts`: esce con 0, tutto il LaTeX passa da KaTeX.
- `width.mts`: esce con 0. Formule del problema al massimo 271 px (livello 6), opzioni al
  massimo 231 px (livello 5).
- Esercizi diversi su 1.000 per livello (seed 1, testi diversi): livello 1: 958; livello 2: 975;
  livello 3: 832; livello 4: 906; livello 5: 927; livello 6: 630; livello 7: 553. Con il seed 7001:
  961, 973, 840, 889, 938, 648, 566.

## Domande per la revisione

- Forma del numeratore: il generatore lo scrive scomposto ($\dfrac{3(x - 1)}{(x - 3)(x + 3)}$),
  come fanno gli esempi 2, 5 e 9 della lezione; la nota dice "numeratore ridotto (sviluppato) salvo
  quando è un prodotto già pronto". Se il libro in uso lascia il numeratore sviluppato, basta
  cambiare la scrittura dell'opzione giusta; il verificatore accetta già tutte e due le forme.
- Al livello 5 quattro esercizi su dieci chiedono solo le C.E. È la proposta della nota; va bene
  anche ai livelli 6 e 7, dove oggi le C.E. sono solo nella soluzione?
- La potenza con esponente negativo ($\left(\dfrac{x}{x - 2}\right)^{-2}$) non c'è: la nota non la
  mette tra i livelli e il parser del verificatore non legge esponenti negativi. Serve un livello
  a sé, o resta nella lezione?
- Al livello 7 alcuni distrattori (la moltiplicazione senza il reciproco, la somma prima della
  divisione) hanno un numeratore di terzo grado: sono errori veri, ma a colpo d'occhio sembrano
  sbagliati. Meglio tenerli o sostituirli con distrattori più vicini alla risposta?
