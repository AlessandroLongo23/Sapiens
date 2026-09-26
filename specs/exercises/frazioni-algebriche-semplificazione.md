# Semplificazione delle frazioni algebriche

Generatore: `frazioni-algebriche-semplificazione`
(`src/lib/exercises/v2/generators/frazioni-algebriche-semplificazione.ts`). Verifica indipendente:
`scripts/exercises/checkers/frazioni_algebriche_semplificazione.py`. Lezione collegata:
`docs/lezioni/riscritte/47-frazioni-algebriche-semplificazione.md` (nota in
`docs/lezioni/note/47-frazioni-algebriche-semplificazione.md`, sezione "Per il generatore").

Lo studente riceve una frazione algebrica con numeratore e denominatore sviluppati, per esempio
$\frac{x^2 - 4}{x^2 + x - 6}$, e la semplifica ("Semplifica la frazione algebrica."). La risposta è
la frazione irriducibile nella forma della lezione (`answer.kind = "expression"`,
`form: "irriducibile"`, la stessa etichetta del generatore delle frazioni numeriche). La soluzione
riporta anche le condizioni di esistenza, lette sul denominatore della frazione data:
$\frac{x + 2}{x + 3},\quad \text{C.E.: } x \neq -3,\ x \neq 2$.

## Costruzione all'indietro

Si sceglie prima la risposta, già scomposta, e poi i fattori comuni; numeratore e denominatore del
testo sono i loro prodotti, sviluppati solo alla fine. I fattori vengono da un insieme piccolo, come
negli esempi della lezione: la lettera $x$ (o $x$ e $y$, con $a$ e $b$ nel raccoglimento parziale),
i binomi $x \pm a$ con $a$ da 1 a 6, $px + b$ primitivi con $p$ fino a 5 (livello 1), $x \pm y$ e
$x \pm 2y$, $a \pm b$, i falsi quadrati $x^2 \pm ax + a^2$ e le somme $x^2 + a^2$ con $a$ da 1 a 3.
Il segno di un polinomio scritto "al contrario" ($6 - 3x$, $1 - x^2$) sta nel suo fattore numerico
negativo: i fattori hanno sempre il primo termine positivo.

## Convenzioni della lezione (il controllo accetta solo questa forma)

- Ogni fattore ha il primo termine positivo in potenze decrescenti: $x - 2$ e non $2 - x$. È la
  convenzione della lezione 38, ripresa negli esempi 3 e 4.
- Il segno meno che resta va davanti alla frazione: $-\frac{3}{x - 2}$, mai $\frac{-3}{x - 2}$ né
  $\frac{3}{2 - x}$. Quando il risultato è un polinomio col segno meno: $-(x + 2)$, $-3x$.
- Numeratore e denominatore restano scomposti (esempio 6): fattore numerico positivo, lettere in
  ordine alfabetico, poi ogni altro fattore tra parentesi una volta con il suo esponente, in grado
  crescente; un solo fattore senza numero né lettere va senza parentesi ($\frac{x + 2}{x + 3}$).
- Irriducibile: numeratore e denominatore non hanno fattori comuni, né polinomi né numeri diversi
  da $\pm 1$. Il controllo lo verifica con `gcd` di SymPy sugli interi, che vede anche il fattore
  numerico ($\frac{2(2x - 3)}{10x}$ viene bocciato).
- Quando il denominatore sparisce il risultato è un polinomio ($x + 2$, $x$, $2(x + 3)$); quando
  sparisce il numeratore resta $1$ ($\frac{1}{x}$), come nel riquadro "Scrivere 0 al posto di 1".
- C.E. scritte con la virgola, nell'ordine dei fattori del denominatore scomposto:
  "C.E.: $x \neq 0$, $x \neq -3$"; con due lettere $x \neq y$, $x \neq -2y$; quando il
  denominatore non si annulla mai ($x^2 + 1$, esempio 7) la soluzione dice "per ogni $x$".

## Rappresentazione

`params.case` è il caso del livello (vedi sotto); `params.vars` le lettere in ordine alfabetico;
`params.num` e `params.den` i polinomi come `{c, fs: [{t: [monomi], e}]}` (fattore numerico intero e
fattori con esponente); `params.ce` la lista delle C.E. Il controllo Python non usa `num` e `den`:
rilegge la frazione dal LaTeX del testo, la semplifica con `cancel` e scompone il denominatore con
`factor_list` per le C.E.

## Regole comuni

- Coefficienti interi fino a 60 in valore assoluto, grado al massimo 3.
- La frazione data non è già irriducibile, e numeratore e denominatore non sono proporzionali
  (tranne al livello 4, dove $\frac{x - 2}{2 - x} = -1$ è un esempio della lezione).
- Il denominatore del risultato non è mai solo un numero ($\frac{x(x - 8)}{4}$ si scarta): negli
  esempi della lezione c'è sempre una lettera sotto, oppure il risultato è un polinomio.
- Nessun polinomio del testo comincia con il segno meno: con il coefficiente direttore negativo si
  scrive per potenze crescenti ($15 - 3x$, $32 - 2x^2$, $4x - x^2$), solo al livello 4.

## Livello 1: denominatore monomio

Un monomio in $x$ e un binomio che si scompone con il raccoglimento totale; il fattore comune è un
numero, una potenza di $x$ o tutti e due (esempio 1). Circa 3 su 10 hanno il binomio al denominatore
(caso `binomio sotto`, controllo tra 15 e 45 su 100), gli altri al numeratore (`binomio sopra`). Resta
sempre una frazione, mai $1$ sopra né un polinomio.

- $\frac{4x^2 - 6x}{10x^2} = \frac{2x - 3}{5x}$, C.E.: $x \neq 0$.
- $\frac{8x^3}{10x^3 + 50x^2} = \frac{4x}{5(x + 5)}$, C.E.: $x \neq 0$, $x \neq -5$.

## Livello 2: un fattore comune

Numeratore e denominatore di secondo grado, prodotti di due fattori di primo grado (differenza di
quadrati, trinomio, quadrato, raccoglimento), con un solo fattore comune di esponente 1 (esempio 2 e
la frazione dell'apertura). Il risultato ha primo grado sopra e sotto.

- $\frac{x^2 - 9}{x^2 + 8x + 15} = \frac{x - 3}{x + 5}$, C.E.: $x \neq -3$, $x \neq -5$.
- $\frac{3x^2 + 6x}{x^2 + 8x + 12} = \frac{3x}{x + 6}$, C.E.: $x \neq -2$, $x \neq -6$.

## Livello 3: resta 1 o un polinomio

Il fattore comune è tutto il numeratore o tutto il denominatore. Metà degli esercizi (caso
`resta un numero sopra`, controllo tra 35 e 65 su 100): sopra resta $1$ (circa 3 su 4) o un altro
numero, come nel riquadro "Scrivere 0 al posto di 1". L'altra metà (`risultato polinomio`): il
denominatore sparisce e il risultato è un polinomio; circa 1 su 5 di questi ha il denominatore
$x^2 + a^2$, che non si annulla mai (esempio 7), e la soluzione dice "per ogni $x$".

- $\frac{x + 1}{x^2 + x} = \frac{1}{x}$, C.E.: $x \neq 0$, $x \neq -1$.
- $\frac{x^2 + 3x - 10}{x + 5} = x - 2$, C.E.: $x \neq -5$.
- $\frac{x^3 + x}{x^2 + 1} = x$, per ogni $x$.

## Livello 4: fattori opposti

Un fattore $x - a$ ($a > 0$) compare scritto come $a - x$ in un polinomio con il coefficiente
direttore negativo: $a - x$ con un numero ($15 - 3x$), $a^2 - x^2$, $ax - x^2$. L'altro polinomio
contiene $x - a$, in circa 3 su 10 al quadrato (esponenti diversi, esempi 3 e 4). Nel caso
`resta il segno meno` (controllo tra 75 e 95 su 100) il risultato ha il meno davanti; nel caso
`segni che si annullano` (tra 5 e 25 su 100) tutti e due i polinomi sono scritti al contrario e i
due segni meno si semplificano. I passaggi riscrivono $a - x = -(x - a)$. Un risultato polinomio col
segno meno si scarta; un risultato numerico ($-1$, $-2$) è ammesso, come $\frac{x - 2}{2 - x}$ nella
lezione.

- $\frac{6 - 3x}{x^2 - 4x + 4} = -\frac{3}{x - 2}$, C.E.: $x \neq 2$.
- $\frac{25 - x^2}{5x - x^2} = \frac{x + 5}{x}$, C.E.: $x \neq 0$, $x \neq 5$.

## Livello 5: due lettere

Il fattore comune è un binomio in $x$ e $y$ ($x \pm y$, $x \pm 2y$). Circa 4 su 10 (caso
`raccoglimento parziale`, controllo tra 25 e 55 su 100) hanno al numeratore
$(x + ky)(a \pm b)$ sviluppato in quattro termini, come l'esempio 5; i passaggi mostrano il
raccoglimento parziale $a(x - y) + b(x - y)$. Gli altri (`prodotti notevoli`) usano quadrati,
differenze di quadrati, trinomi in due lettere e raccoglimenti ($x^2 - xy$).

- $\frac{ax - ay + bx - by}{x^2 - y^2} = \frac{a + b}{x + y}$, C.E.: $x \neq y$, $x \neq -y$.
- $\frac{x^2 + 4xy + 4y^2}{2x^2 + 6xy + 4y^2} = \frac{x + 2y}{2(x + y)}$, C.E.: $x \neq -y$, $x \neq -2y$.

## Livello 6: cubi e Ruffini

Un polinomio di terzo grado con termine noto. Metà (caso `cubi`, controllo tra 35 e 65 su 100) è una
somma o differenza di cubi $x^3 \mp a^3$, il cui falso quadrato resta nel risultato; l'altra metà
(`Ruffini`) ha tre zeri interi tra $-3$ e $3$ (anche doppi), come il denominatore dell'esempio 6.
L'altro polinomio contiene il fattore comune con esponente 1 o 2.

- $\frac{x^3 - 8}{2x^3 - 14x^2 + 32x - 24} = \frac{x^2 + 2x + 4}{2(x - 3)(x - 2)}$, C.E.: $x \neq 3$, $x \neq 2$.
- $\frac{x^3 + 2x^2 - x - 2}{x^3 - x^2 - 5x - 3} = \frac{(x - 1)(x + 2)}{(x - 3)(x + 1)}$, C.E.: $x \neq 3$, $x \neq -1$.

## Esercizi "brutti" da evitare

- una frazione già irriducibile, o numeratore e denominatore proporzionali (fuori dal livello 4);
- un risultato con un numero solo al denominatore ($\frac{3x + 1}{6}$);
- coefficienti grandi: la lezione lavora con $4x^2 - 6x$, $x^2 + x - 6$, $x^3 - 8$;
- un polinomio col segno meno davanti ($-x^2 + 9$): si scrive $9 - x^2$;
- un polinomio con coefficiente direttore negativo che per potenze crescenti comincia ancora con
  un meno ($-6 + 5x - x^2$): si scarta.

## Variante a scelta multipla

Quattro opzioni, una giusta. Distrattori dagli errori che la lezione nomina, in quest'ordine:

1. il segno meno perso nei fattori opposti ($\frac{3}{x - 2}$ al posto di $-\frac{3}{x - 2}$; al
   livello 4 è quasi sempre presente);
2. il fattore con esponenti diversi tolto del tutto invece che una volta ($-3$ al posto di
   $-\frac{3}{x - 2}$, $-\frac{1}{x + 1}$ al posto di $-\frac{x - 1}{x + 1}$);
3. "Scrivere 0 al posto di 1": quando sopra resta $1$, le opzioni $0$ e il solo denominatore ($x$ al
   posto di $\frac{1}{x}$); quando il risultato è un polinomio, il suo reciproco;
4. il fattore numerico diviso da una parte sola ($\frac{2x - 3}{10x}$, $\frac{4(3x + 5)}{5x}$);
5. "Semplificare i termini invece dei fattori": lo stesso termine direttore tolto sopra e sotto
   ($\frac{x^2 - 4}{x^2 + x - 6}$ diventa $-\frac{4}{x - 6}$);
6. il fattore comune tolto solo al denominatore;
7. la frazione non semplificata fino in fondo: un fattore comune lasciato sopra e sotto. Ha lo
   stesso valore della risposta, ed è sbagliata perché non è irriducibile; al massimo una per
   esercizio, e il controllo verifica che abbia davvero un fattore comune;
8. la frazione capovolta.

Se non bastano: un fattore numerico aumentato, una $x$ in più al denominatore. Le opzioni sono
distinte per valore (tranne quella non semplificata del tutto) e per scrittura.

## Verifica (26 settembre 2026)

- `sample.mts frazioni-algebriche-semplificazione 1000 all 1 | verify.py`: PASS, 6.000 esercizi su
  6.000. Casi: livello 1 735 `binomio sopra` e 265 `binomio sotto`; livello 3 501 e 499; livello 4
  904 e 96; livello 5 622 `prodotti notevoli` e 378 `raccoglimento parziale`; livello 6 523
  `Ruffini` e 477 `cubi`.
- Stessa cosa con seed di partenza 7001: PASS, 6.000 su 6.000.
- Esercizi diversi su 1.000 (seed da 1): 982 al livello 1, 863 al livello 2, 640 al livello 3, 683
  al livello 4, 484 al livello 5, 777 al livello 6 (con seed da 7001: 992, 860, 655, 681, 507, 792).
- `review.mts` esce con 0 (10 esempi, tutto il LaTeX passa da KaTeX).
- `width.mts`: nessuna formula del problema oltre i 350 px (la più larga 194 px, livello 6) e nessuna
  opzione oltre i 252 px (la più larga 166 px). Nessun problema e nessuna opzione vanno a capo.
- `tsc` e `eslint` senza errori nel generatore.
- Errori piantati a mano, tutti bocciati: il valore della risposta cambiato; la risposta scritta
  non semplificata del tutto ($\frac{5(x - 1)}{5x}$, stesso valore); l'indice della scelta giusta
  spostato; un'opzione doppia; le C.E. scritte dopo aver semplificato (una condizione persa); il
  meno portato dentro il numeratore ($\frac{5 - x}{x + 5}$ al posto di $-\frac{x - 5}{x + 5}$); il
  segno meno perso; un fattore non scomposto nel denominatore ($x^2 - 1$ al posto di
  $(x - 1)(x + 1)$); un testo già irriducibile ($\frac{x + 6}{x + 2}$); un esercizio del livello 2
  marcato come livello 1; il caso del livello 3 scambiato; le lettere scambiate
  ($\frac{b - a}{2(x + y)}$).

## Domande per la revisione

- La nota della lezione chiede anche due livelli sulla riduzione allo stesso denominatore
  (esempi 8-10). Non ci sono: la risposta sarebbe una coppia o una terna di frazioni, che nessun tipo
  di risposta contiene, e le opzioni con tre frazioni non stanno nel pulsante. Meglio un generatore
  a parte, o lasciarla alla lezione 48 insieme alla somma?
- Le C.E. sono nella soluzione e nei passaggi, e il controllo le verifica, ma la risposta chiede
  solo la frazione. La lezione insiste che le C.E. si scrivono sulla frazione data: servirebbe una
  domanda a parte ("quali sono le C.E.?") con i distrattori delle C.E. lette sulla frazione
  semplificata?
- Il controllo accetta solo il meno davanti ($-\frac{x - 1}{x + 1}$); la lezione dice che
  $\frac{1 - x}{x + 1}$ è la stessa frazione. Con la risposta aperta andrebbe accettata anche quella.
  Per lo stesso motivo nessun distrattore è scritto in quella forma.
- Al livello 4 escono anche risultati numerici come $-2$ ($\frac{2x^2 - 8x}{4x - x^2}$): vanno
  bene, o meglio tenere solo $\frac{x - a}{a - x} = -1$ come nella lezione?
