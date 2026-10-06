# Funzioni crescenti e decrescenti

Generatore: `funzioni-monotone` (`src/lib/exercises/v2/generators/funzioni-monotone.ts`).
Verifica indipendente: `scripts/exercises/checkers/funzioni_monotone.py` (aiuti comuni in
`checkers/_funzioni.py`). Lezione collegata: `docs/lezioni/riscritte/107-funzioni-monotone.md`.

Sette livelli nell'ordine della lezione: la definizione, in senso stretto e in senso lato; la retta; la parabola
con $a > 0$; la parabola con $a < 0$; il valore assoluto; le funzioni monotone in tutto il dominio; le
disequazioni che la monotonia permette di risolvere. Parole della lezione: "crescente" e "decrescente" sono in
senso stretto; "crescente in senso lato" e "decrescente in senso lato" per le definizioni con $\leq$ e $\geq$.

## Convenzione sugli intervalli

Gli intervalli di monotonia sono chiusi nel punto in cui la funzione cambia verso, come nella lezione:
"decrescente in $\mathopen{]}-\infty, 2]$, crescente in $[2, +\infty\mathclose{[}$". Molti libri li scrivono aperti:
per questo nessun distrattore dei livelli 3, 4 e 5 è l'intervallo giusto con l'estremo escluso. Lo controllano
sia il generatore sia il controllo Python.

## Tipi di risposta

Tutti i livelli hanno una risposta `choice`: parole (livelli 1 e 2), intervalli (3, 4, 5, 7) o formule (6).
Nessun livello a risposta aperta.

## Livello 1: la definizione

"Per ogni coppia di numeri $x_1 < x_2$ di un intervallo $I$ si ha" una di otto disuguaglianze: $f(x_1) < f(x_2)$,
$>$, $\leq$, $\geq$, oppure $f(x_2) - f(x_1) > 0$, $< 0$, $\geq 0$, $\leq 0$. Opzioni: crescente, decrescente,
crescente in senso lato, decrescente in senso lato.

- $f(x_1) \geq f(x_2)$: decrescente in senso lato.
- $f(x_2) - f(x_1) > 0$: crescente.

## Livello 2: la retta

$f(x) = mx + q$ con $m$ intero tra $-5$ e $5$ o con denominatore 2, scritta anche con il termine noto per primo
($5 - 2x$); una volta su otto circa $f(x) = q$. Opzioni: crescente su tutto $\mathbb{R}$, decrescente su tutto
$\mathbb{R}$, costante, crescente solo per $x > 0$.

- $f(x) = 1 + 5x$: crescente.
- $f(x) = -\frac{3}{2}x + 4$: decrescente.

L'errore atteso è leggere il segno del termine noto, o del primo numero scritto.

## Livello 3: la parabola con a positivo

"In quale intervallo la funzione è crescente?" (o "decrescente"). $f(x) = ax^2 + bx + c$ con $a \in \{1, 2, 3\}$ e
vertice di ascissa intera non nulla tra $-5$ e $5$.

- $f(x) = x^2 - 4x + 3$, crescente: $[2, +\infty\mathclose{[}$.
- $f(x) = 2x^2 + 20x + 1$, decrescente: $\mathopen{]}-\infty, -5]$.

Distrattori: l'altra semiretta; le due semirette con $-x_V$ (avviso "Il segno nella formula del vertice" della
lezione 87); con l'ordinata del vertice, con $c$, con $-b$ al posto di $x_V$ (avviso "Guardare l'asse sbagliato").

## Livello 4: la parabola con a negativo

Come il livello 3, con $a \in \{-1, -2, -3\}$: i due versi si scambiano.

- $f(x) = -x^2 + 6x$, crescente: $\mathopen{]}-\infty, 3]$.
- $f(x) = -2x^2 - 20x + 1$, decrescente: $[-5, +\infty\mathclose{[}$.

## Livello 5: il valore assoluto

$f(x) = \pm|x - a| + b$, $a$ intero non nullo. Con il più la V scende fino a $x = a$ e poi sale; con il meno il
contrario.

- $f(x) = \lvert x - 2 \rvert - 6$, decrescente: $\mathopen{]}-\infty, 2]$.
- $f(x) = -\lvert x - 4 \rvert - 2$, decrescente: $[4, +\infty\mathclose{[}$.

Distrattori: l'altra semiretta; $-a$ al posto di $a$; $b$ o $a + b$ al posto di $a$.

## Livello 6: monotona in tutto il dominio

"Quale funzione è crescente (decrescente) in tutto il suo dominio?" Quattro formule, una sola giusta. Giuste per
"crescente": $x^3 + k$, $\sqrt{x + k}$, $mx + k$ con $m > 0$, $x^3 + mx$, $2\sqrt{x}$, $\sqrt{x} + k$; per
"decrescente": $-x^3 + k$, $-mx + k$, $\sqrt{k - x}$, $-\sqrt{x}$, $-x^3 - mx$. Sbagliate: una funzione che va nel
verso contrario, due che cambiano verso ($x^2 + k$, $|x| + k$, $-x^2 + k$, $|x + k|$, $x^3 - 3x$), un'iperbole
$\pm\dfrac{n}{x}$. In tre casi su quattro tra le opzioni c'è l'iperbole che va nel verso chiesto ramo per ramo ma
non in tutto il dominio (avviso "Decrescente in due intervalli, non nella loro unione").

- Crescente: $y = \sqrt{x} - 3$, tra $y = -\dfrac{1}{x}$, $y = \lvert x \rvert - 2$, $y = -x^2 - 3$.
- Decrescente: $y = -\sqrt{x}$, tra $y = \dfrac{2}{x}$, $y = x^3 - 3x$, $y = -x^2 - 6$.

## Livello 7: disequazioni con la monotonia

"La funzione $f$ è crescente (decrescente) su tutto $\mathbb{R}$ e $f(a) = k$. Per quali $x$ si ha $f(x) > k$?" (o
$<$). Metà delle volte $k = 0$. Risposta: una semiretta aperta.

- $f$ decrescente, $f(-8) = 6$, $f(x) < 6$: $\mathopen{]}-8, +\infty\mathclose{[}$.
- $f$ crescente, $f(2) = 0$, $f(x) > 0$: $\mathopen{]}2, +\infty\mathclose{[}$.

Distrattori: la semiretta dall'altra parte (verso non rovesciato); l'estremo incluso; la semiretta che parte da
$k$ invece che da $a$.

## Esercizi da evitare

- Vertice nell'origine ai livelli 3-5: $x_V$ e $-x_V$ coinciderebbero.
- Al livello 6, due opzioni con la proprietà chiesta.
- Al livello 7, $k = a$.

## Verifiche fatte

- `sample.mts funzioni-monotone 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001.
- Il controllo trova da solo il punto in cui la funzione cambia verso e decide il verso valutandola; al livello 6
  legge ogni opzione dal suo LaTeX e ne decide la monotonia su una griglia di punti del dominio.
- Errori piantati (opzione giusta scambiata, intervallo giusto scritto aperto tra i distrattori, formula
  cambiata): bocciati.

## Limiti

- Nessun esercizio di lettura dal grafico (l'esempio 1 della lezione): i generatori di questo capitolo non
  disegnano grafici.
- Nessun esercizio sulla dimostrazione con $f(x_2) - f(x_1)$.
- Al livello 6 il controllo decide la monotonia su punti di prova, non con una dimostrazione: è sufficiente per le
  forme dell'elenco, non per funzioni qualsiasi.

## Domande per la revisione

- Intervalli chiusi nel vertice: se in classe si scrive "crescente per $x > 2$", l'opzione giusta va riscritta
  aperta in tutti i livelli 3, 4 e 5. Quale forma vuoi?
- Livello 2: la quarta opzione, "crescente solo per $x > 0$", è un errore plausibile o un riempitivo?
- Livello 6: l'iperbole $y = -\dfrac{1}{x}$ come trappola per "crescente" è al livello giusto, o è troppo sottile
  per una scelta multipla?
