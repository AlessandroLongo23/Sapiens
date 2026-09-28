# Equazioni binomie, trinomie e scomponibili

Generatore: `equazioni-binomie-trinomie` (`src/lib/exercises/v2/generators/equazioni-binomie-trinomie.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_binomie_trinomie.py`. Lezione collegata:
`docs/lezioni/riscritte/90-equazioni-binomie-trinomie.md` (nota in `docs/lezioni/note/90-equazioni-binomie-trinomie.md`,
sezione "Per il generatore", da cui vengono i livelli).

Lo studente riceve un'equazione di grado superiore al secondo e trova l'insieme $S$ delle soluzioni reali, oppure,
all'ultimo livello, una disequazione di terzo o quarto grado da risolvere con la tabella dei segni. Le consegne sono
"Risolvi l'equazione." e "Risolvi la disequazione.". I passaggi seguono i procedimenti della lezione: portare tutto a
primo membro, scomporre (raccoglimento totale, parziale, Ruffini), uguagliare a zero ogni fattore; per le binomie
$x^n = k$ e la tabella pari e dispari; per le trinomie la sostituzione $t = x^n$, la regola di somma e prodotto e
il ritorno a $x$.

## Cosa cambia rispetto alla nota

La nota propone otto livelli. Qui sono sette: i due livelli con Ruffini (quoziente con due soluzioni e quoziente con
$\Delta < 0$) sono un livello solo, il 3, con due forme. La difficoltà in più è la stessa (trovare lo zero, dividere,
risolvere il quoziente), e il quoziente senza soluzioni è un esito del passo finale, non un procedimento diverso.

## Tipo di risposta

Livelli 1-6: `set`, i valori esatti in ordine crescente, senza ripetizioni. I razionali come `"p/q"`, le radici
quadrate come le scrive `Surd` (`"2*sqrt(2)"`, `"(-1+sqrt(5))/2"`), le radici di indice $n \geq 3$ come
`"5**(1/6)"`, `"-7**(1/3)"`. La forma a scelta multipla (`toChoice()`) mescola la risposta e tre distrattori
scelti al momento della generazione e salvati in `params.distractors`, ognuno con l'errore da cui viene (`tag`), i
valori e il LaTeX.

Livello 7: `choice` fin dall'inizio, come in `disequazioni-secondo-grado`: la risposta è un'unione di intervalli.

L'insieme si scrive come nella lezione: $S = \{-2, 0, 2\}$ con i soli interi, $S = \left\{-1, \frac{1}{2}, 2\right\}$
quando c'è una frazione o un radicale, $S = \emptyset$ senza soluzioni. Le radici si scrivono semplificate: radicando
libero da quadrati ($2\sqrt{2}$, mai $\sqrt{8}$), una frazione sola $\frac{A \pm K\sqrt{r}}{D}$, radici di indice
$n \geq 3$ solo di interi liberi da quadrati ($\sqrt[6]{5}$, mai $\sqrt[4]{9}$). Gli intervalli del livello 7 sono
quelli della 88: `\mathopen{]}` e `\mathclose{[}` per gli estremi esclusi, $S = \{-2, 1, 2\}$ per dei punti; tre
intervalli vanno su due righe con `\begin{gathered}`, e la seconda riga comincia con `\cup`.

## Costruzione all'indietro

Si scelgono prima le soluzioni (i fattori, i valori di $t$, la radice $k$) e poi si scrive il testo sviluppando il
prodotto. `params` contiene la forma (`form`), i coefficienti dei due membri per potenze crescenti (`lhs`, `rhs`) e
i distrattori; al livello 7 anche il verso (`op`), la soluzione (`truth`) e l'errore di ogni opzione (`optionTags`).
Il controllo Python non usa `params` per la risposta: rilegge l'equazione dal testo, ne trova le soluzioni reali con
`Poly.real_roots` di SymPy e rifà ogni distrattore dall'errore che dichiara.

## Regole comuni

- Polinomi per potenze decrescenti, coefficienti interi, primo coefficiente positivo; niente $1x$, $+ -$, termini
  nulli, $1(\ldots)$ nei passaggi.
- Soluzioni tutte distinte: nessun fattore ripetuto, niente soluzioni doppie (la lezione non parla di molteplicità).
- Con esponente pari e secondo membro negativo la risposta è $S = \emptyset$ (controllato, come chiede la nota).
- L'ultimo passaggio è l'insieme $S$ (livelli 1-6) o la soluzione con "oppure" (livello 7).

## Livello 1: raccoglimento totale

Tre forme:

- `differenza di quadrati` (40%): $ax^3 - ak^2x = 0$, $a \in \{1, 2, 3\}$ ($1$ tre volte su cinque), $k$ da $2$ a
  $9$, $ak^2 \leq 100$; un terzo delle volte scritta $ax^3 = ak^2x$, come nell'avviso "Dividere per x";
- `trinomio` (35%): $x(x - r_1)(x - r_2)$ sviluppato, $r_1 \neq r_2$ interi non nulli tra $-8$ e $8$, $r_1 + r_2 \neq 0$,
  $|r_1r_2| \leq 48$; il trinomio si scompone con somma e prodotto;
- `x^2 raccolto` (25%): $x^4 - k^2x^2 = 0$, $k$ da $2$ a $7$, metà delle volte scritta $x^4 = k^2x^2$ (avviso
  "Chiamare binomia un'equazione con due termini qualsiasi").

1. $x^3 - 4x^2 - 21x = 0$: $x(x^2 - 4x - 21) = 0$, due numeri con somma $4$ e prodotto $-21$ sono $-3$ e $7$,
   $x(x + 3)(x - 7) = 0$, $S = \{-3, 0, 7\}$.
2. $x^4 = 36x^2$: $x^4 - 36x^2 = 0$, $x^2(x^2 - 36) = 0$, $x^2(x - 6)(x + 6) = 0$, $S = \{-6, 0, 6\}$.

## Livello 2: raccoglimento parziale

$(ax - r)(x^2 - K)$ sviluppato, con $a \in \{1, 2, 3\}$ ($1$ tre volte su cinque), $r \neq 0$ tra $-6$ e $6$ primo
con $a$, $|rK| \leq 60$, $|aK| \leq 40$. Il testo ha sempre $a_3a_0 = a_2a_1$, la condizione del raccoglimento
parziale. Due forme:

- `differenza di quadrati` (65%): $K = k^2$, $k$ da $1$ a $7$, $\frac{r}{a} \neq \pm k$; tre soluzioni (esempio 2);
- `somma di quadrati` (35%): $K = -k^2$, $k$ da $1$ a $5$; il fattore $x^2 + k^2$ non si annulla e resta una
  soluzione sola.

1. $x^3 - 5x^2 - 4x + 20 = 0$: $x^2(x - 5) - 4(x - 5) = 0$, $(x - 5)(x^2 - 4) = 0$, $S = \{-2, 2, 5\}$.
2. $3x^3 + 2x^2 + 27x + 18 = 0$: $x^2(3x + 2) + 9(3x + 2) = 0$, $(3x + 2)(x^2 + 9) = 0$,
   $S = \left\{-\frac{2}{3}\right\}$.

## Livello 3: regola di Ruffini

$(x - z)\,Q(x)$ sviluppato, $z$ intero tra $-3$ e $3$, $z \neq 0$, coefficienti fino a $30$ in valore assoluto,
termine noto diverso da zero e niente raccoglimento parziale ($a_3a_0 \neq a_2a_1$). I passaggi seguono la lezione:
i candidati $\frac{p}{q}$, i valori $P(1)$, $P(-1)$, ... nell'ordine della lezione fino al primo zero (al massimo sei
tentativi), la tabella di Ruffini, il quoziente e la sua equazione con $\Delta$. Lo zero trovato può essere uno
zero del quoziente scelto: conta il primo che la lezione incontra. Due forme:

- `quoziente con due soluzioni` (60%): $Q = (x - n_1)(dx - n_2)$ con $d \in \{1, 2, 3\}$ ($1$ metà delle volte),
  $n_1, n_2$ non nulli tra $-5$ e $5$, tre soluzioni razionali distinte (esempio 3);
- `quoziente senza soluzioni` (40%): $Q = ax^2 + bx + c$ con $a \in \{1, 2\}$, $b \neq 0$ tra $-4$ e $4$, $c$ da
  $1$ a $9$, $\Delta < 0$, $\text{MCD}(a, b, c) = 1$; una soluzione sola (esempio 4).

1. $3x^3 - 10x^2 - 27x + 10 = 0$: $P(1) = -24$, $P(-1) = 24$, $P(2) = -60$, $P(-2) = 0$; divisione per $x + 2$,
   quoziente $3x^2 - 16x + 5$, $\Delta = 256 - 60 = 196$, $x = \frac{16 \pm 14}{6}$,
   $S = \left\{-2, \frac{1}{3}, 5\right\}$.
2. $x^3 + 3x^2 + 5x - 9 = 0$: $P(1) = 0$, quoziente $x^2 + 4x + 9$, $\Delta = 16 - 36 = -20$, $S = \{1\}$.

## Livello 4: equazioni binomie

$Ax^n + B = 0$ con $n$ da $3$ a $6$, cioè $x^n = K$ con $K = -\frac{B}{A}$. Quattro forme:

- `pari positivo` (30%): $n \in \{4, 6\}$, $K = \left(\frac{m}{d}\right)^n$ con piccole potenze ($16$, $81$, $64$,
  $\frac{81}{16}$, $\frac{1}{64}$...), due soluzioni opposte (esempio 6); mai $x^4 = 1$;
- `pari negativo` (20%): $n \in \{4, 6\}$, $K < 0$, potenza perfetta o intero libero da quadrati; $S = \emptyset$
  (esempio 7);
- `dispari` (30%): $n \in \{3, 5\}$, $K = \pm\left(\frac{m}{d}\right)^n$, negativo tre volte su cinque, una soluzione
  con il segno di $K$ (esempio 5);
- `irrazionale` (20%): $n$ da $3$ a $6$, $|K| \in \{2, 3, 5, 6, 7, 10\}$, negativo metà delle volte con $n$ dispari
  (esempio 8).

Con $d = 1$ il testo può avere un fattore $a \in \{2, 3\}$ ($2x^4 - 32 = 0$); $|B| \leq 250$.

1. $2x^6 - 10 = 0$: $2x^6 = 10$, $x^6 = 5$, esponente pari e secondo membro positivo,
   $S = \left\{-\sqrt[6]{5}, \sqrt[6]{5}\right\}$.
2. $3x^5 + 3 = 0$: $x^5 = -1$, esponente dispari, $x = \sqrt[5]{-1} = -1$, $S = \{-1\}$.

## Livello 5: equazioni biquadratiche

$x^4 + bx^2 + c = 0$ costruita da $t_1 < t_2$ interi distinti, $t_1 + t_2 \neq 0$, $|t_1t_2| \leq 150$,
$|t_1 + t_2| \leq 50$. I passaggi: $t = x^2$, somma e prodotto, poi $x^2 = t_1$ e $x^2 = t_2$. Quattro forme:

- `quattro soluzioni intere` (35%): $t_1, t_2$ quadrati tra $1$ e $36$ (esempio 9);
- `soluzioni irrazionali` (15%): $t_1, t_2$ da $1$ a $12$, almeno uno non quadrato, radici semplificate
  ($x^2 = 8$ dà $\pm 2\sqrt{2}$; esempio 11);
- `t di segno opposto` (35%): $t_1$ da $-9$ a $-1$, $t_2$ quadrato (quattro volte su cinque) o in
  $\{2, 3, 5, 6, 7\}$ (esempio 10);
- `t negativi` (15%): $t_1, t_2$ da $-9$ a $-1$, $S = \emptyset$ (esempio 12).

1. $x^4 - 14x^2 + 40 = 0$: $t^2 - 14t + 40 = 0$, $t_1 = 4$, $t_2 = 10$,
   $S = \left\{-\sqrt{10}, -2, 2, \sqrt{10}\right\}$.
2. $x^4 + 8x^2 - 9 = 0$: $t_1 = -9$ (nessuna soluzione), $t_2 = 1$, $S = \{-1, 1\}$.

## Livello 6: trinomie di sesto grado

$x^6 + bx^3 + c = 0$ con $t = x^3$ e $t_1 < t_2$ interi distinti, $t_1 + t_2 \neq 0$, $|t_1t_2| \leq 200$,
$|t_1 + t_2| \leq 40$. I valori di $t$ sono cubi ($\pm 1$, $\pm 8$, $\pm 27$, $\pm 64$) sei volte su dieci, uno
dei due è in $\{2, 3, 5, 6, 7, 10\}$ tre volte su dieci, tutti e due una volta su dieci. Tre forme:
`t di segno opposto` (50%, esempio 13), `t positivi` (25%), `t negativi` (25%). Con $t$ negativi le soluzioni
sono due, negative: è il caso dell'avviso "Scartare t negativo con l'esponente dispari".

1. $x^6 - 7x^3 - 8 = 0$: $t_1 = -1$, $t_2 = 8$, $x^3 = -1$ dà $-1$, $x^3 = 8$ dà $2$, $S = \{-1, 2\}$.
2. $x^6 + 15x^3 + 50 = 0$: $t_1 = -10$, $t_2 = -5$,
   $S = \left\{-\sqrt[3]{10}, -\sqrt[3]{5}\right\}$.

## Livello 7: disequazioni scomponibili

Tutti e quattro i versi, a caso. Due forme:

- `terzo grado` (60%): $(x - r)(x^2 - k^2)$ sviluppato (tre volte su cinque, raccoglimento parziale come
  nell'esempio 14; $r \neq 0$ tra $-5$ e $5$, $k$ da $1$ a $5$, $|r| \neq k$) oppure $x(x - r_1)(x - r_2)$
  (raccoglimento totale e trinomio, $r_1, r_2$ non nulli tra $-5$ e $5$, $r_1 + r_2 \neq 0$);
- `biquadratica` (40%): $(x^2 - p^2)(x^2 - q^2)$ con $1 \leq p < q \leq 5$, $p^2q^2 \leq 144$ (due volte su tre,
  esempio 15), oppure $(x^2 + p^2)(x^2 - q^2)$, dove il primo fattore è sempre positivo.

I passaggi scrivono la scomposizione, gli zeri, i segni del prodotto da sinistra a destra, la scelta del verso e la
soluzione con "oppure".

1. $x^4 - 13x^2 + 36 \geq 0$: $(x^2 - 4)(x^2 - 9) \geq 0$, segni $+, -, +, -, +$,
   $S = \,\mathopen{]}-\infty, -3] \cup [-2, 2] \cup [3, +\infty\mathclose{[}$ (su due righe).
2. $x^3 + 4x^2 - 4x - 16 > 0$: $(x + 4)(x - 2)(x + 2) > 0$,
   $S = \,\mathopen{]}-4, -2\mathclose{[}\, \cup \,\mathopen{]}2, +\infty\mathclose{[}$.

## Esercizi "brutti" da evitare

- soluzioni ripetute (fattori al quadrato, zero di Ruffini uguale a una soluzione del quoziente);
- Ruffini dove basta un raccoglimento parziale, o dove il primo zero arriva dopo molti tentativi (al massimo sei);
- radicali non semplificati ($\sqrt{8}$, $\sqrt[4]{9}$, $\sqrt[6]{8}$): le radici di indice $n \geq 3$ hanno solo
  radicandi interi liberi da quadrati o potenze perfette;
- numeri grandi: coefficienti fino a $30$ al livello 3, termine noto delle binomie fino a $250$;
- $x^4 = 1$ e $x^3 - x = 0$: gli errori della lezione danno insiemi uguali tra loro.

## Variante a scelta multipla

Quattro opzioni distinte come insiemi di numeri (come unioni di intervalli al livello 7), una giusta. I distrattori
vengono dagli errori della lezione, in quest'ordine di preferenza; il controllo li rifà da capo a partire dal testo:

- livello 1: `dividi` (avviso "Dividere per x": si perde $0$), `radice` ($x^2 = 4$ letto $x = 4$, solo con la
  differenza di quadrati), `positive` (solo le soluzioni non negative), `segno` (i fattori letti con il segno
  sbagliato, solo con il trinomio);
- livello 2: `dimentica` (la soluzione negativa della differenza di quadrati), `segno` (il fattore $ax - r$ letto
  $x = -\frac{r}{a}$), `radice` ($x^2 = 9$ letto $x = \pm 9$), `solo quadrato` (il fattore di primo grado
  dimenticato); con la somma di quadrati `differenza` ($x^2 + 9$ trattato come $x^2 - 9$), `segno`, `nessuna`;
- livello 3: `segno` (lo zero con il segno sbagliato, avviso della lezione "1 al posto di -1"), `quoziente` (il
  quoziente non risolto), `segno quoziente`; senza soluzioni del quoziente `nessuna`, `segno` e `delta assoluto`
  (il quoziente risolto con $|\Delta|$, "tre soluzioni perché è di terzo grado");
- livello 4: con $n$ pari e $K > 0$ `solo positiva` (avviso "Dimenticare la soluzione negativa"), `quadrata`
  ($\pm\sqrt{K}$), `impossibile`; con $n$ pari e $K < 0$ `assoluto` ($\pm\sqrt[n]{|K|}$, avviso "Confondere indice
  pari e dispari"), `dispari`, `positiva`; con $n$ dispari `impossibile` (per $K < 0$), `pari` (due soluzioni
  opposte), `segno`;
- livello 5: `valori di t` (avviso "Fermarsi a t"), `assoluto` ($\pm\sqrt{|t|}$ anche per il $t$ negativo, avviso
  "Il valore negativo di t"), `solo positive`, `piu meno t` ($x = \pm t$);
- livello 6: `scarta negativo` (avviso "Scartare t negativo con l'esponente dispari"), `valori di t`, `pari` (le
  radici cubiche con il $\pm$), `come biquadratica` ($\pm\sqrt{t}$), `segno`;
- livello 7: `t` (avviso "Dimenticare che t è x²": gli intervalli in $t$ letti come intervalli in $x$, solo con le
  biquadratiche), `scambiati` (gli intervalli con i segni alternati sbagliati), `estremi`, `equazione` (gli zeri
  come risposta), `scambiati ed estremi` di riserva.

Quando gli errori danno meno di tre insiemi diversi, si aggiungono opzioni `altro` (una soluzione tolta, $0$
aggiunto, l'insieme vuoto, piccoli interi): succede solo ai livelli 1 e 4, circa una volta su dieci al livello 1
(trinomio con due radici dello stesso segno) e mai al livello 4 dopo aver escluso $x^4 = 1$. La risposta giusta cade
in ognuna delle quattro posizioni circa un quarto delle volte.

## Figure

Nessun livello ha una figura. Le vorrebbero:

- il livello 4, con i grafici di $y = x^4$ e $y = x^3$ e la retta $y = k$ della lezione: è la figura che spiega
  perché con esponente pari le soluzioni sono due o nessuna;
- il livello 7, con la tabella dei segni della lezione nei passaggi (oggi i segni sono una riga di testo).

## Verifiche fatte

- `sample.mts equazioni-binomie-trinomie 1000 all 1 | verify.py`: PASS; con il seed di partenza 50001: PASS.
- Esercizi diversi su 1.000 per livello (testo del problema, seed 1): livello 1: 149, livello 2: 178, livello 3: 561,
  livello 4: 202, livello 5: 180, livello 6: 124, livello 7: 331. Quote delle forme (seed 1) dentro gli intervalli
  di `CASE_RANGES`; opzioni `altro` in 95 esercizi su 1.000 al livello 1, mai altrove.
- `width.mts`: esce con 0; su 15.000 seed dei livelli 3, 5 e 6 il problema è largo al massimo 224 px e
  l'opzione più larga 248 px (livello 3, `delta assoluto` con due frazioni e radicali), sotto i 252 px.
- Errori piantati, tutti bocciati dal controllo: valore della risposta cambiato; valori non in ordine; indice della
  risposta giusta spostato (scelta multipla e livello 7); distrattore uguale alla risposta; distrattore diverso
  dall'errore che dichiara; etichetta di un distrattore sbagliata; un esercizio del livello 3 dato come livello 2
  (niente raccoglimento parziale) e viceversa; binomia pari con secondo membro negativo e due soluzioni;
  $\sqrt{8}$ al posto di $2\sqrt{2}$; $\sqrt[8]{9}$ al posto di $\sqrt[4]{3}$; frazione non ridotta; $1x$ nel
  problema; soluzione mancante; estremo della soluzione cambiato; tre intervalli su una riga; valori dell'opzione
  giusta in ordine sbagliato; ultimo passaggio diverso da $S$.
- `review.mts` esce con 0; `tsc` senza errori nel generatore.

## Domande per la revisione

- Livello 3: le due proposte della nota (quoziente con due soluzioni, quoziente con $\Delta < 0$) sono diventate
  un livello solo con due forme. Va bene, o si preferiscono due livelli?
- Livello 3, distrattore `delta assoluto`: per il quoziente con $\Delta < 0$ la nota propone "tre soluzioni perché
  è di terzo grado". Le tre soluzioni vengono dal quoziente risolto con $|\Delta|$, come
  $\left\{\frac{-1 - \sqrt{15}}{4}, -3, \frac{-1 + \sqrt{15}}{4}\right\}$: è plausibile o troppo artificiale?
- Livello 4: l'insieme $S = \left\{-\sqrt[6]{5}, \sqrt[6]{5}\right\}$ si scrive con i radicali di indice $6$ come
  nella lezione. Si vuole anche la forma con le potenze, $5^{\frac{1}{6}}$?
- Livello 5, distrattore `piu meno t` ($x^2 = 4$ letto $x = \pm 4$): non è un avviso della lezione, ma serve quando
  tutti e due i valori di $t$ sono positivi. Andrea lo vede fare agli studenti?
- Livello 7: le opzioni usano solo gli intervalli; la 88 alterna anche la forma con "oppure". Serve anche qui?
- Livello 7: la sezione sulle disequazioni è in dubbio nella nota ("se si preferisce toglierla"). Se la sezione
  va via, va via anche il livello 7.
- Le frazioni con un radicale portano il segno meno dentro, $\frac{-1 - \sqrt{15}}{4}$, come in
  `disequazioni-secondo-grado`: è la forma dei libri?
