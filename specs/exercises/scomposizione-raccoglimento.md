# Raccoglimento totale e parziale

Generatore: `scomposizione-raccoglimento` (`src/lib/exercises/v2/generators/scomposizione-raccoglimento.ts`).
Verifica indipendente: `scripts/exercises/checkers/scomposizione_raccoglimento.py`. Lezione collegata:
`docs/lezioni/riscritte/34-scomposizione-raccoglimento.md` (con la nota in `docs/lezioni/note/`).

Lo studente scompone in fattori un polinomio con il raccoglimento totale e con quello parziale.
Consegna sempre uguale: "Scomponi in fattori." La risposta è la scomposizione completa
(`answer.kind = "expression"`, `form: "factored"`); sul sito oggi esce solo la variante a scelta
multipla.

## Che cosa vuol dire "scomposta"

La definizione è quella della lezione, e il controllo accetta esattamente questa forma:

- l'ultima operazione è una moltiplicazione: un monomio a coefficiente intero davanti (anche
  assente) e una o più parentesi, eventualmente elevate a potenza, senza niente sommato dopo.
  `x^2(x - 2) - 3(x - 2)` è ancora una somma e non è scomposto;
- i fattori, senza contare un segno, sono almeno due: `3(2x - 3)` sì, `-(x^2 - 5x + 7)` no;
- ogni parentesi contiene un polinomio a coefficienti interi con almeno due termini, senza un
  numero né una lettera comuni a tutti i termini, e irriducibile in ℤ.

Un numero davanti non rende "riducibile" un polinomio (per la lezione `6x - 9` è irriducibile), ma
va raccolto: `3(2x - 3)` è la forma attesa, mentre `(x - 2)(2x^2 + 6)` non è finita perché il `2` è
rimasto nella parentesi. Il segno può stare davanti o dentro una parentesi: la lezione (esempio 2)
dice che `-2x(2x^2 - 4x + 1)` e `2x(-2x^2 + 4x - 1)` sono la stessa scomposizione, e il controllo le
accetta tutte e due. L'ordine dei fattori è libero.

La risposta del generatore segue in più le convenzioni della lezione, controllate a parte: davanti
c'è il MCD, o il suo opposto quando il primo termine è negativo; ogni parentesi comincia con un
termine positivo ed è scritta in forma normale; il fattore comune viene prima, come escono dal
raccoglimento (`(x - 2)(x^2 - 3)`, `(a - b)(x - y)`).

Nel controllo Python la completezza si verifica leggendo la struttura dal LaTeX e poi, per ogni
parentesi, con `factor_list` di SymPy: un solo fattore, molteplicità 1, contenuto ±1. Nel
generatore c'è un test sufficiente più semplice (primitivo, e in una lettera di grado al massimo 3
senza radici razionali, oppure di grado 1 in una lettera con un solo monomio da una delle due
parti); quello che il test non riconosce viene scartato e ridisegnato.

## Regole comuni

- Coefficienti interi, al massimo 60 in valore assoluto nel testo. Niente coefficienti frazionari:
  il riquadro della lezione sulle frazioni è un'eccezione che non entra negli esercizi.
- Lettere dalle famiglie `a, b, c` e `x, y, z`, come nella lezione, che mescola le due famiglie
  nel raccoglimento di un polinomio e nel parziale (`2ax - 6a - bx + 3b`).
- Polinomi in una lettera ordinati per potenze decrescenti; con più lettere, ai livelli 1-3, per
  grado decrescente e poi in ordine alfabetico delle potenze. Ai livelli 5 e 6 i termini seguono
  l'ordine dei gruppi, come negli esempi della lezione.
- Costruzione all'indietro: si scelgono i fattori (tutti primitivi e irriducibili), poi si
  sviluppa il prodotto.
- Il caso di ogni esercizio si estrae una volta sola, prima dei tentativi, così gli scarti non
  spostano le quote.

## Livello 1: raccoglimento totale con un numero o una lettera

Una sola lettera, 2 o 3 termini, primo termine positivo. Il MCD è un numero (circa 40%, caso
`numero`), una potenza della lettera (30%, `lettera`) o tutti e due (30%, `numero e lettera`).
La parentesi ha grado al massimo 3 e il termine noto.

1. `6x - 9 = 3(2x - 3)`.
2. `6x^4 + 15x = 3x(2x^3 + 5)`.

## Livello 2: MCD monomio con più lettere

Due lettere, tre termini, il MCD ha almeno una lettera (esempio 1 della lezione). In circa metà
degli esercizi un termine è uguale al MCD, o al suo opposto, e nella parentesi resta `1` o `-1`
(caso `uno`, per l'avviso "Dimenticare l'1"); negli altri no (`senza uno`).

1. `6x^3y - 9x^2y^2 + 3x^2y = 3x^2y(2x - 3y + 1)`.
2. `15x^3z^2 + 20x^3z + 5x^2 = 5x^2(3xz^2 + 4xz + 1)`.

## Livello 3: raccogliere un segno meno

Primo termine negativo: si raccoglie l'opposto del MCD, come nell'esempio 2. Una o due lettere,
2 o 3 termini. Il MCD è un numero (30%, `numero`) o un monomio con lettere (70%, `monomio`); mai
solo `-1` (vedi le domande).

1. `-4x^3 + 8x^2 - 2x = -2x(2x^2 - 4x + 1)`.
2. `-9y^3 - 27 = -9(y^3 + 3)`.

## Livello 4: raccogliere un polinomio

Due termini con una parentesi comune. Tre casi: la stessa parentesi (35%, `uguali`), una parentesi
al quadrato con un numero per la stessa parentesi (30%, `quadrato`, esempio 3), parentesi opposte
(35%, `opposti`, esempio 4). La risposta ha due fattori: la parentesi del primo termine, poi quello
che resta.

1. `3x(a + b) - 2y(a + b) = (a + b)(3x - 2y)`.
2. `(x + 4)^2 - 8(x + 4) = (x + 4)\left[(x + 4) - 8\right] = (x + 4)(x - 4)`.
3. `z(a - 1) - 4(1 - a) = z(a - 1) + 4(a - 1) = (a - 1)(z + 4)`.

## Livello 5: raccoglimento parziale con quattro termini

Nessun fattore comune a tutti i termini; i primi due e gli ultimi due danno la stessa parentesi.
In una lettera (50%, `una lettera`, esempio 5: `(ax + p)(bx^k + d)` con k = 2 o 3) o con più
lettere (50%, `più lettere`, esempio 6). Circa metà delle volte nel secondo gruppo si raccoglie un
numero o un monomio negativo.

1. `x^3 - 2x^2 - 3x + 6 = x^2(x - 2) - 3(x - 2) = (x - 2)(x^2 - 3)`.
2. `2ax - 6a - bx + 3b = 2a(x - 3) - b(x - 3) = (x - 3)(2a - b)`.

## Livello 6: riordino, sei termini, prima il totale

Un terzo per caso.

- `riordino` (esempio 7): quattro termini con più lettere, scritti in modo che i primi due non
  abbiano fattori comuni e il raggruppamento come scritto non funzioni; un altro raggruppamento
  funziona. Il primo passaggio è riordinare.
- `sei termini` (esempio 8): tre coppie con la stessa parentesi, la parentesi rimasta è un trinomio
  di secondo grado irriducibile.
- `totale poi parziale` (esempio 9): tutti i coefficienti hanno un fattore comune tra 2 e 5, che si
  raccoglie prima; poi il parziale in una lettera.

1. `x^2 + 3y - xy - 3x = x^2 - xy - 3x + 3y = x(x - y) - 3(x - y) = (x - y)(x - 3)`.
2. `ax^2 + bx^2 + ax + bx + 3a + 3b = (a + b)(x^2 + x + 3)`.
3. `2x^3 - 4x^2 + 6x - 12 = 2\left[x^2(x - 2) + 3(x - 2)\right] = 2(x - 2)(x^2 + 3)`.

## Esercizi "brutti" da evitare

- un fattore che si scompone ancora con i metodi delle lezioni dopo (per esempio
  `4(x^2 + 2x - 3)`, con il trinomio riducibile): la risposta sarebbe incompleta per la lezione 36;
- MCD uguale a 1 ai livelli 1-3, o un fattore comune a tutti i termini ai livelli 5 e 6 (tranne il
  caso `totale poi parziale`, dove è il punto dell'esercizio);
- termini simili nel polinomio sviluppato (il raccoglimento parziale non si vede più);
- riordino "finto", dove il raggruppamento come scritto funziona già;
- numeri grandi: coefficienti del testo oltre 60.

## Variante a scelta multipla

Quattro opzioni con LaTeX diverso; esattamente una è una scomposizione completa uguale al
polinomio. Gli altri distrattori sono o diversi dal polinomio, o uguali ma non scomposti fino in
fondo (è l'errore che la lezione chiama così, e il controllo lo verifica). Dagli avvisi della
lezione:

- "Dimenticare l'1": la parentesi senza il termine `±1` (livelli 1-3);
- "Raccogliere un fattore troppo piccolo": una lettera o un numero lasciati nella parentesi, come
  `2x(3x^2 + 2x)` (livelli 1-3);
- "Cambiare segno solo al primo termine" e il segno meno perso davanti (livello 3);
- "Raccogliere due parentesi opposte come se fossero uguali": `(a - b)(x + y)` (livello 4, opposti);
- "Fermarsi a metà": `x^2(x - 2) - 3(x - 2)` (livelli 5 e 6);
- il numero rimasto dentro l'ultimo fattore, `(x - 2)(2x^2 + 6)`, e dentro il primo,
  `(2x - 4)(x^2 + 3)` (livello 6, totale poi parziale).

Altri errori plausibili: un segno sbagliato nel secondo gruppo o dentro una parentesi, gli
esponenti sommati invece che sottratti nel quoziente, un termine perso con sei termini; nel caso
`quadrato`, il numero della parentesi dimenticato (`(x + 1)(x - 3)` al posto di `(x + 1)(x - 2)`) o
il numero con il segno sbagliato. Se non bastano, si cambia di ±1 un coefficiente di una parentesi
(mai il primo termine). Un'opzione uguale al polinomio con tutte le parentesi primitive non entra
mai come distrattore: sarebbe un secondo modo di scrivere la risposta giusta.

## Larghezza delle opzioni

Il pulsante della risposta ha 252 px utili, con la formula a 16 px. Le sole opzioni che non ci
stavano erano le somme "fermate a metà" con tre gruppi (livello 6, `sei termini`, fino a 277 px).
Il generatore stima la larghezza sui caratteri e, oltre 215 px, scrive la somma su due righe con
`\begin{gathered} … \\ … \end{gathered}`, andando a capo prima di un segno al livello più esterno:
`2x^2(b - 4) - 4x(b - 4) \\ - (b - 4)`. Le altre opzioni restano su una riga. Il controllo accetta
2 o 3 righe, vuole ogni riga dopo la prima aperta da un segno e nessun a capo dentro una parentesi,
e legge le righe unite come un'unica espressione. Errori piantati, tutti bocciati: una riga persa
(dentro `gathered` o togliendo l'ambiente), un a capo dentro una parentesi.

Misura con `owidth.mts` (150 esercizi per livello, quattro opzioni ciascuno): 0 opzioni oltre 252
px a ogni livello, massimi 172, 195, 175, 147, 197, 230 px. Testi con `pwidth.mts`: massimi 168,
227, 202, 230, 205, 307 px, tutti entro 350.

## Verifica (26 settembre 2026)

- `sample.mts scomposizione-raccoglimento 1000 all 1 | verify.py` e lo stesso con seed di partenza
  7001: PASS tutti e due, 6.000 esercizi su 6.000 per seed, quote dei casi dentro gli intervalli
  (circa 20 secondi per 1.000 esercizi: `factor_list` su ogni opzione).
- Esercizi diversi su 1.000 (testi diversi, seed 1): livello 1: 996; livello 2: 1.000; livello 3:
  985; livello 4: 962; livello 5: 956; livello 6: 982.
- `review.mts` esce con 0: tutto il LaTeX passa da KaTeX.
- Errori piantati a mano, tutti bocciati dal controllo: risposta con un segno cambiato; indice
  dell'opzione giusta spostato; risposta sostituita con una non completa (`3(2x^4 + 5x)`, fattore
  troppo piccolo); risposta fermata a metà (somma di due prodotti); risposta con il numero rimasto
  dentro (`(2y + 10)(2y^3 + 1)`); una seconda opzione giusta con il segno dentro la parentesi
  (`5y^2(-3y^3 - 4)` accanto a `-5y^2(3y^3 + 4)`); un esercizio a due lettere presentato come
  livello 1; un esercizio con primo termine positivo presentato come livello 3; caso sbagliato
  nei params; un parziale che funziona senza riordino presentato come `riordino`; il testo del
  livello 4 cambiato (quadrato in cubo).
- La funzione che decide "scomposta" è provata sugli esempi della lezione: accetta `3(2x - 3)`,
  `x(x + 3)`, `2x^2(3x + 2)`, `-2x(2x^2 - 4x + 1)`, `2x(-2x^2 + 4x - 1)`, `2(x - 2)(x^2 + 3)`,
  `(x + y)(a + b)`; rifiuta `2x(3x^2 + 2x)`, `x^2(x - 2) - 3(x - 2)`, `(x - 2)(2x^2 + 6)`,
  `-(x^2 - 5x + 7)`, `4(x^2 + 2x - 3)`, `6x - 9`.

## Domande per la revisione

- Scomposta vuol dire anche "senza fattori che si scompongono con i metodi delle lezioni dopo"?
  Qui sì: il controllo usa l'irriducibilità in ℤ, e il generatore sceglie solo parentesi
  irriducibili, così la risposta resta giusta anche dopo le lezioni 35-37. Un esercizio come
  `4x^2 + 8x - 12 = 4(x^2 + 2x - 3)`, che in questa lezione sembrerebbe finito, non esce mai.
- `-(x^2 - 5x + 7)` è una scomposizione? Il controllo dice di no (un solo fattore oltre al segno) e
  il livello 3 non raccoglie mai solo `-1`. L'avviso della lezione usa proprio `-1`: se Andrea lo
  vuole come esercizio, serve decidere cosa conta come risposta.
- Il segno dentro la parentesi (`2x(-2x^2 + 4x - 1)`) è accettato come scomposizione, come dice la
  lezione; nella scelta multipla non compare mai accanto alla forma con il meno davanti. Per la
  risposta aperta futura, va accettato o si chiede la forma con il primo termine positivo?
- Livello 4 `opposti` con un numero: `z(a - 1) - 4(1 - a)`. La parentesi `(1 - a)` con il numero
  davanti è naturale per un insegnante, o si preferiscono solo parentesi con due lettere?
