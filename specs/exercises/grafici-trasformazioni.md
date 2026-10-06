# Trasformazioni dei grafici

Generatore: `grafici-trasformazioni` (`src/lib/exercises/v2/generators/grafici-trasformazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/grafici_trasformazioni.py` (aiuti comuni in
`checkers/_funzioni.py`). Lezione collegata: `docs/lezioni/riscritte/109-grafici-trasformazioni.md`.

Sette livelli nell'ordine della lezione: dove va un punto in una traslazione; il vertice di un grafico traslato;
le simmetrie; le dilatazioni; dalla trasformazione alla formula; il valore assoluto fuori e dentro; più
trasformazioni di seguito. Gli esercizi sono su punti e formule: nessun grafico disegnato. Coordinate con la
virgola, $(2, -3)$, e vettori $\vec{v}(a, b)$ come nella lezione.

## La regola che gli esercizi mettono alla prova

Un'operazione fuori da $f$ agisce sulle ordinate nel verso atteso; un'operazione dentro $f$ agisce sulle ascisse
nel verso contrario. Quasi tutti i distrattori vengono dallo scambio tra dentro e fuori o dal verso sbagliato in
orizzontale.

## Tipi di risposta

Tutti i livelli hanno una risposta `choice`: un punto (livelli 1-4, 6, 7) o una formula (livello 5). Un punto non
ha un tipo di risposta aperta; nessun livello a risposta aperta.

## Livello 1: traslazioni di un punto

"Il grafico di $f$ passa per il punto $P(a, b)$. Per quale punto passa di sicuro il grafico di $g$?" con
$g(x) = f(x) \pm d$ oppure $f(x \pm d)$, in parti uguali.

- $P(1, 6)$, $g(x) = f(x) + 2$: $(1, 8)$.
- $P(2, -7)$, $g(x) = f(x - 6)$: $(8, -7)$.

Distrattori: il verso sbagliato in orizzontale (avviso "Il segno nella traslazione orizzontale"); lo spostamento
sull'altra coordinata; il verso sbagliato in verticale.

## Livello 2: vertice di un grafico traslato

$y = |x - a| + b$, $y = \sqrt{x - a} + b$ oppure $y = (x - a)^2 + b$, con $a$ e $b$ interi non nulli e
$|a| \neq |b|$. Consegna: "Trova il vertice del grafico." (per la radice: "Trova il punto da cui parte il grafico.").

- $y = \lvert x - 4 \rvert - 3$: $(4, -3)$.
- $y = (x + 3)^2 + 5$: $(-3, 5)$.

Distrattori: $(-a, b)$; $(a, -b)$; le coordinate scambiate; $(-a, -b)$.

## Livello 3: simmetrie

$g(x) = -f(x)$, $f(-x)$ oppure $-f(-x)$.

- $P(4, -3)$, $g(x) = -f(x)$: $(4, 3)$.
- $P(2, -8)$, $g(x) = f(-x)$: $(-2, -8)$.

Distrattori: le altre due simmetrie; le coordinate scambiate.

## Livello 4: dilatazioni

$g(x) = k f(x)$, $\dfrac{1}{k}f(x)$, $f(kx)$ oppure $f\left(\dfrac{x}{k}\right)$, $k$ tra 2 e 4; il punto è scelto
in modo che l'immagine abbia coordinate intere.

- $P(-4, 2)$, $g(x) = 4f(x)$: $(-4, 8)$.
- $P(-8, 3)$, $g(x) = f(4x)$: $(-2, 3)$.

Distrattori: la coordinata sbagliata; moltiplicare al posto di dividere in orizzontale (avviso "f(2x) stringe, non
allarga"); tutte e due le coordinate.

## Livello 5: dalla trasformazione alla formula

"Il grafico di $y = \dots$ viene … Qual è l'equazione del nuovo grafico?" Basi $|x|$, $\sqrt{x}$, $x^2$.
Trasformazioni: traslazione di vettore $\vec{v}(h, k)$ con $h$ e $k$ non nulli (metà dei casi); simmetria rispetto
all'asse $x$; simmetria rispetto all'asse $y$ (solo per $\sqrt{x}$); simmetria rispetto all'asse $x$ e poi
spostamento in su.

- $y = x^2$ traslato di $\vec{v}(-3, 5)$: $y = (x + 3)^2 + 5$.
- $y = \sqrt{x}$ ribaltato rispetto all'asse $y$: $y = \sqrt{-x}$.

Distrattori: il segno di $h$ sbagliato; $h$ e $k$ scambiati; il meno dentro al posto di fuori (avviso "Radice di
meno x"); lo spostamento messo dentro.

## Livello 6: valore assoluto fuori e dentro

$g(x) = |f(x)|$ con un punto di ordinata negativa; $g(x) = f(|x|)$ con un punto di ascissa positiva, e la domanda
"Oltre che per $P$, per quale punto passa di sicuro il grafico di $g$?".

- $P(-6, -3)$, $g(x) = \lvert f(x) \rvert$: $(-6, 3)$.
- $P(1, 8)$, $g(x) = f(\lvert x \rvert)$: $(-1, 8)$.

Distrattori: la simmetria sull'altra coordinata (avviso "Valore assoluto fuori o dentro"); tutte e due; il punto
di partenza, che con $|f(x)|$ non sta più sul grafico.

## Livello 7: più trasformazioni

Sei volte su dieci $g(x) = c\,f(x - h) + k$ con $c \in \{-1, 2, -2, 3\}$; le altre $g(x) = f(kx - m)$ con $m$
multiplo di $k$.

- $P(2, -5)$, $g(x) = 3f(x - 5) - 3$: $(7, -18)$.
- $P(-6, -5)$, $g(x) = f(3x + 3)$: $(-3, -5)$.

Distrattori: il verso sbagliato in orizzontale; l'addizione fatta prima della moltiplicazione, fuori e dentro
(avviso "L'ordine conta"); il fattore dimenticato.

## Esercizi da evitare

- Punti con $|a| = |b|$ dove due distrattori coinciderebbero, e punti che la trasformazione lascia fermi.
- La simmetria rispetto all'asse $y$ di una funzione pari ($|x|$, $x^2$): la formula non cambia.
- Coordinate non intere nella risposta giusta (compaiono solo nei distrattori del livello 4).

## Verifiche fatte

- `sample.mts grafici-trasformazioni 1000 all <seed> | verify.py` con i seed 1, 50001 e 777001.
- Il controllo legge il punto e la formula di $g$ dal problema e ricalcola l'immagine; al livello 5 ricostruisce
  la formula con SymPy dalla descrizione e la confronta, valore per valore, con ogni opzione.
- Errori piantati (coordinata giusta cambiata, formula di $g$ cambiata nel testo, opzione giusta scambiata):
  bocciati.

## Limiti

- Nessun grafico: "disegna il grafico di" diventa "dove va questo punto" o "qual è la formula".
- Il completamento del quadrato (esempio 2 della lezione) non c'è: al livello 2 la parabola è già scritta come
  $(x - a)^2 + b$.
- Al livello 6 si chiede un solo punto: non si controlla che lo studente sappia quale parte del grafico sparisce.

## Domande per la revisione

- Tutto il generatore lavora su punti. È un buon sostituto del disegno, o serve aspettare gli esercizi con il
  grafico?
- Livello 7: per $f(kx - m)$ i passaggi fanno raccogliere $k$ e poi risolvono $kx - m = a$. È il procedimento che
  insegni?
- Livello 5: serve anche la dilatazione ($y = 2\sqrt{x}$, $y = \sqrt{2x}$) tra le trasformazioni da tradurre in
  formula?
