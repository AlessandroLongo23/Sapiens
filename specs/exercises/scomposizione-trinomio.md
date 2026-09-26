# Trinomio di secondo grado

Generatore: `scomposizione-trinomio` (`src/lib/exercises/v2/generators/scomposizione-trinomio.ts`).
Verifica indipendente: `scripts/exercises/checkers/scomposizione_trinomio.py`. Lezione collegata:
`docs/lezioni/riscritte/36-scomposizione-trinomio.md` (note in `docs/lezioni/note/`).

Lo studente riceve un trinomio sviluppato, ordinato per potenze decrescenti della prima lettera, e lo
scompone in fattori. La consegna è "Scomponi in fattori." (al livello 4 "Scomponi in fattori, se
possibile.", perché lì una parte dei trinomi è irriducibile). La risposta è un'espressione
scomposta (`answer.kind = "expression"`, `form = "factored"`), scomposta fino in fondo in ℤ.

## Si costruisce dalla risposta

Si scelgono prima i due numeri $m$ e $n$ (o i due fattori di primo grado $(px + q)(rx + t)$), poi si
moltiplica. Così i coefficienti sono sempre interi e piccoli, e la scomposizione è nota in anticipo.
I trinomi irriducibili del livello 4 si costruiscono da una coppia $m$, $n$ spostando la somma di 1
o 2: $x^2 + 4x + 2$ viene da $1 \cdot 2$, con somma $3$ invece di $4$ (esempio 6 della lezione).

## Scomposta fino in fondo

Una risposta è giusta se ha lo stesso valore del trinomio e se, dopo un eventuale numero o monomio
davanti, ogni fattore tra parentesi è primitivo (nessun intero da raccogliere) e irriducibile in ℤ.
Il verificatore lo controlla con `factor_list` di SymPy su ogni fattore. Quindi $2(x^2 - 2x - 15)$,
$(x^2 - 1)(x^2 - 4)$ e $(4x + 2)(x + 3)$ hanno il valore giusto ma sono risposte sbagliate.

## Rappresentazione

`params.case` è il caso del livello; `params.v` la lettera (`x` circa 3 volte su 4, altrimenti `a`,
`y` o `t`), `params.w` la seconda lettera al livello 6; `params.k` e `params.j` il fattore raccolto
davanti ($k \cdot v^j$, con $k = -1$ per il segno meno); `params.pair` i due numeri; `params.lin` i
quattro coefficienti $p, q, r, t$ dei fattori $(px + qy)(rx + ty)$; `params.sp` la somma e il
prodotto dei trinomi irriducibili; `params.irreducible` dice se la risposta è "irriducibile".

## Regole comuni

- Coefficienti interi, al massimo 100 in valore assoluto; il testo è sempre un trinomio (tre termini).
- Mai due numeri uguali (il quadrato di un binomio è nella lezione sui prodotti notevoli), mai un
  numero nullo, mai somma nulla (sarebbe una differenza di quadrati).
- Ordine dei fattori: quello del procedimento. Con $a = 1$ prima il numero con il valore assoluto
  minore, $(x - 3)(x + 5)$; con $a \neq 1$ prima il binomio comune dei due gruppi, $(2x + 1)(3x - 2)$.
- I passaggi seguono la lezione: la frase con somma, prodotto e segni dalla tabella, le coppie con
  prodotto $p$ provate fino a quella giusta (con i segni della tabella), i due numeri, la
  scomposizione. Il verificatore controlla che ogni uguaglianza dei passaggi sia vera.

## Livello 1: $x^2 + sx + p$ con due numeri positivi

$m < n$ positivi, $n \le 15$, prodotto fino a 72.

1. $x^2 + 7x + 12 = (x + 3)(x + 4)$ (coppie $1 + 12 = 13$, $2 + 6 = 8$, $3 + 4 = 7$).
2. $x^2 + 16x + 63 = (x + 7)(x + 9)$.

## Livello 2: gli altri segni

Un terzo con due numeri negativi ($p > 0$, $s < 0$), un terzo con $p < 0$ e $s > 0$, un terzo con
$p < 0$ e $s < 0$. Stessi limiti del livello 1.

1. $x^2 - 9x + 14 = (x - 2)(x - 7)$.
2. $x^2 - 9x - 22 = (x + 2)(x - 11)$: il numero con il valore assoluto maggiore ha il segno di $s$.

## Livello 3: prima raccogli, poi scomponi

Un terzo con un fattore numerico ($k$ da 2 a 5), un terzo con un fattore con la lettera ($kx$ o
$kx^2$, $k$ da 1 a 5), un terzo con il primo termine negativo (si raccoglie il segno meno). Il
trinomio tra parentesi è uno dei livelli 1 e 2, con numeri fino a 9 quando c'è un fattore davanti.

1. $2x^3 - 4x^2 - 30x = 2x(x^2 - 2x - 15) = 2x(x - 5)(x + 3)$ (esempio 4 della lezione).
2. $-t^2 + 6t + 55 = -(t^2 - 6t - 55) = -(t + 5)(t - 11)$.

## Livello 4: si scompone o è irriducibile?

Circa 4 su 10 irriducibili, costruiti con una somma spostata di 1 o 2 da quella di una coppia vera,
con $|s| \le 15$; gli altri scomponibili, con tutti i casi di segno. I passaggi di un irriducibile
provano tutte le coppie con i segni della tabella e concludono che nessuna ha la somma giusta.
La risposta di un irriducibile è il trinomio stesso, e la soluzione dice "è irriducibile".

1. $t^2 + 5t - 18$: coppie $(-1) + 18 = 17$, $(-2) + 9 = 7$, $(-3) + 6 = 3$; è irriducibile.
2. $x^2 - 5x - 24 = (x + 3)(x - 8)$.

## Livello 5: $ax^2 + bx + c$ con $a \neq 1$

$(px + q)(rx + t)$ con $pr$ da 2 a 12, fattori primitivi e diversi, $|b| \le 25$, $|c| \le 35$.
Passaggi: prodotto $a \cdot c$, i due numeri con somma $b$, spezzamento del termine di primo
grado, raccoglimento a gruppi, binomio comune. Circa 7 su 10 con $a > 0$ e nessun fattore comune;
circa 15 su 100 con $a < 0$ (prima si raccoglie il segno meno, esempio 9 della lezione); circa 15
su 100 con un fattore comune 2 o 3 da raccogliere prima (come $4x^2 + 14x + 6$ nella lezione).

1. $6x^2 - x - 2 = 6x^2 + 3x - 4x - 2 = 3x(2x + 1) - 2(2x + 1) = (2x + 1)(3x - 2)$.
2. $6t^2 - 19t + 3 = 6t^2 - 18t - t + 3 = 6t(t - 3) - (t - 3) = (t - 3)(6t - 1)$.

## Livello 6: trinomi in due lettere

Lettere $x, y$ (due volte su tre) o $a, b$. Circa 45 su 100 $x^2 + sxy + py^2$ (i due termini sono
$my$ e $ny$), circa 35 su 100 $ax^2 + bxy + cy^2$ con lo spezzamento ($pr \le 6$, $|q|, |t| \le 5$),
circa 20 su 100 con un monomio al posto della lettera, $x^2y^2 + sxy + p$.

1. $x^2 + 5xy + 6y^2 = (x + 2y)(x + 3y)$; $3x^2 - 8xy + 5y^2 = (x - y)(3x - 5y)$.
2. $a^2b^2 + 10ab + 24 = (ab + 4)(ab + 6)$.

## Livello 7: $x^4 + sx^2 + p$

Si trovano i due numeri come per $x^2 + sx + p$, con $x^2$ al posto di $x$, e poi si controlla
ogni fattore: $x^2 - a^2$ si scompone come differenza di quadrati, $x^2 + n$ con $n > 0$ e
$x^2 - n$ con $n$ non quadrato sono irriducibili. Circa 35 su 100 con due differenze di quadrati,
45 su 100 con una, 20 su 100 con nessuna. $|p| \le 100$, $|s| \le 30$. Il caso $x^6 + sx^3 + p$
dell'esempio 14 non c'è (vedi le domande).

1. $x^4 - 5x^2 + 4 = (x^2 - 1)(x^2 - 4) = (x - 1)(x + 1)(x - 2)(x + 2)$.
2. $t^4 - 24t^2 - 25 = (t^2 + 1)(t^2 - 25) = (t^2 + 1)(t - 5)(t + 5)$.

## Esercizi "brutti" da evitare

- due numeri uguali (quadrato di un binomio), somma nulla (differenza di quadrati), termine noto
  nullo (basta raccogliere $x$);
- numeri grandi: i prodotti restano entro 72 ai primi livelli, i coefficienti entro 100;
- un fattore comune dimenticato nel testo del livello 5 "a positivo" (fattori primitivi per
  costruzione);
- trinomi irriducibili fuori dal livello 4: altrove la consegna non dice "se possibile".

## Variante a scelta multipla

Quattro opzioni diverse come forma (gli stessi fattori in un altro ordine contano come la stessa
opzione), una sola giusta. Distrattori, dagli errori dei riquadri della lezione:

- segni sbagliati: $(x + 5)(x - 4)$ al posto di $(x - 5)(x + 4)$ ("Sbagliare il segno del numero
  più grande"), oppure tutti e due i segni cambiati;
- un'altra coppia con lo stesso prodotto e la somma sbagliata, cioè una coppia provata e scartata;
- non scomposto fino in fondo: $2x(x^2 - 2x - 15)$ al livello 3, $(x^2 - 1)(x^2 - 4)$ o
  $(x - 1)(x + 1)(x^2 - 4)$ al livello 7 ("Fermarsi troppo presto"), il fattore comune lasciato in
  un binomio al livello 5; hanno il valore giusto e il verificatore controlla che siano sbagliati
  proprio perché un fattore si scompone ancora;
- il fattore raccolto dimenticato, o il segno meno dimenticato;
- con $a \neq 1$, i due numeri usati come nel caso $a = 1$: $(x + 1)(x + 6)$ per $2x^2 + 7x + 3$
  ("Usare i due numeri come nel caso a = 1"), le costanti scambiate, un segno sbagliato nel secondo
  gruppo ("Il segno nel secondo gruppo");
- nei trinomi in due lettere, la seconda lettera dimenticata: $(x + 2)(x + 3)$ per
  $x^2 + 5xy + 6y^2$ ("Dimenticare la seconda lettera");
- al livello 7, la somma di quadrati "scomposta": $x^2 + 4 = (x - 2)(x + 2)$;
- al livello 4, l'opzione "irriducibile" per un trinomio che si scompone, e per un irriducibile le
  scomposizioni finte costruite dalla coppia con la somma sbagliata.

Se non bastano: due numeri con la stessa somma e un prodotto diverso.

## Verifiche fatte (26 settembre 2026)

- `sample.mts scomposizione-trinomio 1000 all 1 | verify.py`: PASS, 7.000 su 7.000; con il seed
  di partenza 7001: PASS, 7.000 su 7.000. Quote dei casi dentro gli intervalli (`CASE_RANGES`).
  Al livello 3 il segno meno esce circa 4 volte su 10 e il fattore numerico meno di un terzo,
  perché i fattori numerici che portano un coefficiente oltre 100 vengono scartati e ritirati.
- Distrattori con il valore giusto ma non scomposti fino in fondo (seed 1): uno per esercizio al
  livello 3 (1.000), 149 al livello 5 (i casi con il fattore comune), 1.462 al livello 7; per
  ognuno il verificatore trova il fattore che si scompone ancora.
- Errori piantati a mano, tutti bocciati: risposta con un trinomio lasciato tra parentesi dopo il
  raccoglimento; risposta con $x^2 - a^2$ non scomposto al livello 7; risposta con il fattore
  comune lasciato in un binomio al livello 5; trinomio intero tra parentesi come risposta; valore
  della risposta cambiato; indice dell'opzione giusta spostato (anche su "irriducibile" per un
  trinomio scomponibile, e su una scomposizione finta per un irriducibile); due opzioni uguali;
  caso sbagliato in `params`; un esercizio del livello 1 presentato come livello 2 (vincolo di
  segno violato); segno cambiato nel testo; passaggio finale senza il segno meno; LaTeX
  dell'opzione giusta rotto.
- `review.mts`: esce con 0, tutto il LaTeX passa da KaTeX.
- Esercizi diversi su 1.000 per livello (seed 1): livello 1: 211 (69 senza contare la lettera:
  sono tutte le coppie $m < n$ con prodotto fino a 72 e $n \le 15$, come nei libri); livello 2: 393;
  livello 3: 791; livello 4: 599; livello 5: 838; livello 6: 581; livello 7: 314.

## Domande per la revisione

- Il livello 4 mescola trinomi scomponibili e irriducibili con la consegna "se possibile", e la
  scelta multipla ha l'opzione "irriducibile". La lezione tratta l'irriducibile così (esempio 6);
  va bene che sia un livello a sé, e non un caso dentro il livello 3?
- Il livello 1 ha solo 69 trinomi diversi a meno della lettera: allargare il prodotto oltre 72, o
  va bene così per un primo livello?
- Manca $x^6 + sx^3 + p$ (esempio 14), che richiede somma e differenza di cubi con i loro trinomi
  irriducibili: un ottavo livello, o si lascia alla lezione sui prodotti notevoli?
