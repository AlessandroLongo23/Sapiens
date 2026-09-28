# Equazioni e disequazioni con il valore assoluto

Generatore: `valore-assoluto-equazioni` (`src/lib/exercises/v2/generators/valore-assoluto-equazioni.ts`).
Verifica indipendente: `scripts/exercises/checkers/valore_assoluto_equazioni.py`. Lezione collegata:
`docs/lezioni/riscritte/91-valore-assoluto-equazioni.md` (nota in `docs/lezioni/note/91-valore-assoluto-equazioni.md`,
sezione "Per il generatore", da cui vengono i livelli).

Lo studente riceve un'equazione o una disequazione con uno o due valori assoluti e trova l'insieme delle soluzioni.
Consegne: "Risolvi l'equazione." (livelli 1-6) e "Risolvi la disequazione." (livelli 7-9). I passaggi seguono i
procedimenti della lezione: la tabella dei tre casi di $|A(x)| = k$, "uguali oppure opposti" per
$|A(x)| = |B(x)|$, la condizione $B(x) \geq 0$ e le due equazioni $A = \pm B$ per $|A(x)| = B(x)$, lo studio per
intervalli con gli zeri messi nell'intervallo alla loro destra, i valori interni (un sistema) per il verso $<$ e i
valori esterni (un'unione) per il verso $>$, la tabella con $k \leq 0$.

## Livelli: da dieci a nove

La nota propone dieci livelli. Il 7 e l'8 della nota ($|A| \lessgtr k$ con $k > 0$ e con $k \leq 0$) sono qui un
livello solo, il 7: tutti e due hanno l'argomento di primo grado, e il caso $k \leq 0$ è una domanda sulla tabella,
più facile dei valori interni ed esterni. Restano nove livelli, uno per sezione ed esempio della lezione; sono più
dei soliti cinque-sette perché la lezione tratta insieme equazioni e disequazioni.

## Tipo di risposta

- Livelli 1-6: `set`, i valori in ordine crescente come razionali esatti (`"-11/5"`, `"3"`), lista vuota per
  l'equazione impossibile. Scritta $S = \{-2, 3\}$, $S = \left\{-4, \frac{2}{3}\right\}$ (le graffe con `\left` e
  `\right` quando c'è una frazione, come nella lezione), $S = \emptyset$. La variante a scelta multipla viene da
  `toChoice()`, con i distrattori già calcolati in `params.distractors` (etichetta e valori, in ordine di
  preferenza): `toChoice()` prende i primi tre diversi dalla risposta e tra loro.
- Livelli 7-9: `choice` fin dall'inizio, come in `disequazioni-secondo-grado`: la risposta è un'unione di
  intervalli, che nessun tipo di oggi contiene. `toChoice()` restituisce la risposta stessa.

Le opzioni delle disequazioni sono scritte tutte in una delle due forme delle lezioni 88 e 89, scelta a caso metà e
metà (`params.notation`): `disequazioni` ($x < -3 \ \text{ oppure } \ x > 1$) o `intervalli`
($S = \,\mathopen{]}-\infty, -3\mathclose{[}\, \cup \,\mathopen{]}1, +\infty\mathclose{[}$, con `\left]` e
`\right[` attorno alle frazioni). Gli insiemi speciali si scrivono sempre come insiemi: $S = \emptyset$,
$S = \mathbb{R}$, $S = \mathbb{R} \setminus \{3\}$, $S = \{3\}$. Righe troppo larghe per il telefono vanno a capo
con `gathered`: nella forma `intervalli` un intervallo per riga con tre intervalli, o con due e una frazione (le
righe dopo la prima cominciano con `\cup`); nella forma `disequazioni` un pezzo per riga con tre pezzi, o con due
pezzi limitati come $-6 \leq x \leq -2$ e $2 \leq x \leq 6$ (le righe dopo la prima cominciano con
`\text{oppure}`). Valori delle opzioni come in `disequazioni-secondo-grado`: `"(-oo,-3)"`, `"[1,oo)"`, un punto
`"[3,3]"`, $\mathbb{R}$ `"(-oo,oo)"`, $\emptyset$ lista vuota.

`solution` è l'insieme; l'ultimo passaggio è l'insieme per le equazioni, la forma con "oppure" (o "Ogni $x$ è
soluzione.", "Nessun $x$ è soluzione.", $x \neq r$) per le disequazioni.

## Costruzione e verifica

Si scelgono prima gli zeri e le soluzioni (interi, frazioni con denominatore piccolo) e poi si scrive il testo.
`params` contiene gli argomenti dei valori assoluti (`args`, coefficienti per potenze crescenti), il secondo
membro (`rhs`, con `rhsAbs` per $|A| = |B|$), la relazione (`rel`), il caso (`case`) e la soluzione (`truth`).
La risposta non viene dalla costruzione: il generatore risolve di nuovo il testo con un metodo generico (per le
equazioni prova tutte le scelte dei segni davanti agli argomenti e rimette ogni radice nell'equazione con le
sbarre; per le disequazioni prova ogni regione tra i punti critici e ogni punto critico con i razionali esatti).
Il controllo Python rilegge il testo, trasforma le sbarre in `Abs` e risolve con SymPy (`solveset`,
`solve_univariate_inequality`); rifà da capo anche ogni distrattore a partire dall'errore della sua etichetta.

## Regole comuni

- Polinomi per potenze decrescenti; niente $1x$, $+ -$, termini nulli, frazioni con il segno dentro.
- Argomenti di primo grado $ax + b$ con $\text{MCD}(a, b) = 1$ (niente $|2x - 4|$, tranne al livello 6, dove
  l'argomento è $m(x - z)$ con lo zero $z$ intero). Argomenti di secondo grado con $a = 1$ e due zeri reali
  distinti: un trinomio sempre positivo toglierebbe le sbarre da solo.
- Soluzioni ed estremi razionali; denominatori al massimo 5 (livelli 1 e 4), 7 (livello 3), 3 (livello 6), 4
  (livelli 7 e 9); interi ai livelli 2, 5 e 8.
- Tutti e quattro i versi a ogni livello di disequazioni, scelti a caso.
- La risposta giusta cade in ognuna delle quattro posizioni circa un quarto delle volte.

## Livello 1: valore assoluto uguale a un numero

$|ax + b| = k$ con $a \in \{1, 2, 3, 4, 5\}$ ($1$ tre volte su otto), $b \neq 0$ tra $-9$ e $9$. Tre casi della
tabella: $k$ positivo da $1$ a $12$ (60%), $k = 0$ (20%), $k$ negativo da $-9$ a $-1$ (20%). Esempio 1, avviso
"Il secondo membro negativo".

1. $|4x + 1| = 1$: $4x + 1 = 1$ dà $x = 0$, $4x + 1 = -1$ dà $x = -\frac{1}{2}$; $S = \left\{-\frac{1}{2}, 0\right\}$.
2. $|x - 8| = -5$: il secondo membro è negativo, $S = \emptyset$.

Distrattori: `solo A = k` (una sola soluzione), `opposti` ($\pm$ la soluzione di $A = k$), `vuoto`,
`solo A = -k` con $k > 0$; `vuoto`, `opposti` ($\pm r$), `segno` ($-r$, cioè $ax = b$) con $k = 0$; `più o meno`
(le soluzioni di $|A| = |k|$, l'errore dell'avviso), `solo A = k`, `solo A = -k` con $k < 0$.

## Livello 2: argomento di secondo grado

$|A(x)| = k$ con $k > 0$ e soluzioni intere. Due forme:

- `pura` (60%): $|x^2 - c| = k$ con $c + k = s^2$, $s$ da $2$ a $8$, e $c - k = t^2$ (quattro soluzioni, o tre
  con $t = 0$) oppure $c - k < 0$ (due soluzioni); $c$ e $k$ fino a $40$. Esempio 2.
- `completa` (40%): $|x^2 + px + c| = k$ con $A - k = (x - r_1)(x - r_2)$, $r_i$ tra $-8$ e $8$, $p \neq 0$,
  $|c| \leq 30$, e $A + k$ con zeri interi o senza zeri.

1. $|x^2 - 5| = 4$: $x^2 = 9$ e $x^2 = 1$, $S = \{-3, -1, 1, 3\}$.
2. $|x^2 + 5x - 1| = 5$: $x^2 + 5x - 6 = 0$ e $x^2 + 5x + 4 = 0$, $S = \{-6, -4, -1, 1\}$.

Distrattori: `solo A = k` (il distrattore della nota, $\pm 3$), `solo A = -k`, `positive` (solo le soluzioni
positive, $x^2 = 9$ letto come $x = 3$), `meno sotto radice` (con $c - k = -u^2$: $x^2 = -u^2$ letto come
$x^2 = u^2$), `vuoto`, `opposti` (le soluzioni cambiate di segno).

## Livello 3: due valori assoluti uguali

$|a_1x + b_1| = |a_2x + b_2|$ con $a_1 \neq a_2$ da $1$ a $4$, $b_1 \neq b_2$ non nulli: due soluzioni distinte
$\frac{b_2 - b_1}{a_1 - a_2}$ e $-\frac{b_1 + b_2}{a_1 + a_2}$. Esempio 3.

1. $|2x + 1| = |x + 2|$: $x = 1$ e $x = -1$, $S = \{-1, 1\}$.
2. $|x + 8| = |3x - 7|$: $S = \left\{-\frac{1}{4}, \frac{15}{2}\right\}$.

Distrattori: `un termine` (avviso "Cambiare segno a un solo termine": $A = -a_2x + b_2$ al posto di $A = -B$,
il $\frac{4}{3}$ della lezione), `solo A = B`, `solo A = -B`, `opposti`.

## Livello 4: secondo membro con la x

$|ax + b| = mx + n$ con $a \in \{1, 2, 3\}$, $m \in \{1, 2, 3, -1, -2\}$, $|m| \neq a$ (le due equazioni hanno
una soluzione ciascuna), $n$ tra $-9$ e $9$; i due candidati distinti, con $B \neq 0$. Tre casi: un candidato
scartato dalla condizione (60%), tutti e due accettati (20%), nessuno (20%). Esempio 4, avviso "Dimenticare la
condizione". Nei passaggi: la condizione risolta, le due equazioni, chi si scarta e chi si accetta.

1. $|2x - 1| = 3x + 7$: condizione $x \geq -\frac{7}{3}$, candidati $-8$ (scartato) e $-\frac{6}{5}$;
   $S = \left\{-\frac{6}{5}\right\}$.
2. $|3x + 5| = -x - 9$: condizione $x \leq -9$, candidati $-\frac{7}{2}$ e $2$ scartati; $S = \emptyset$.

Distrattori: `senza condizione` (tutti e due i candidati), `scartate`, `solo A = B`, `solo A = -B`, `vuoto`.

## Livello 5: secondo membro con la x, argomento di secondo grado

$|x^2 + px + c| = mx + n$ costruita da quattro interi distinti tra $-6$ e $6$: $A - B = (x - r_1)(x - r_2)$ e
$A + B = (x - r_3)(x - r_4)$, $|p| \leq 8$, $|c| \leq 20$, $|m| \leq 9$, $|n| \leq 15$, $m \neq 0$, $B \neq 0$
nei candidati. Almeno un candidato accettato e uno scartato: ne vengono sempre due e due, perché $|A| - B$ è
positiva ai due estremi della retta e cambia segno in ogni candidato semplice. Esempio 5.

1. $|x^2 + 5x - 2| = 2x + 8$: condizione $x \geq -4$, candidati $-6, -5, -1, 2$, $S = \{-1, 2\}$.
2. $|x^2 + 2x - 18| = -3x - 12$: condizione $x \leq -4$, $S = \{-6, -5\}$.

Distrattori: `senza condizione` (le quattro, come $\{-4, -1, 1, 4\}$ della nota), `scartate`, `solo A = B`,
`solo A = -B`.

## Livello 6: più valori assoluti

$|m_1x - m_1z_1| + |m_2x - m_2z_2| = R$ con gli zeri $z_1 \neq z_2$ interi tra $-6$ e $6$, $m_i \in \{1, 2\}$.
Due forme: $R = k$ da $1$ a $12$ (`numero`, 60%) oppure $R = x + n$ o $2x + n$ con $n$ tra $-6$ e $9$
(`con x`, 40%). Nessun intervallo con infinite soluzioni; soluzioni con denominatore fino a 3, in valore assoluto
fino a 15. Esempio 6 e avviso "Accettare una soluzione fuori dal suo intervallo". I passaggi scrivono una riga per
intervallo, come la tabella della lezione: l'intervallo, l'equazione senza sbarre, la soluzione accettata o
scartata. Circa sei esercizi su dieci hanno una soluzione scartata; circa uno su otto ha una soluzione sola.

1. $|x - 1| + |x - 5| = 7$: $x < 1$ dà $-\frac{1}{2}$, $1 \leq x < 5$ dà $4 = 7$, $x \geq 5$ dà $\frac{13}{2}$;
   $S = \left\{-\frac{1}{2}, \frac{13}{2}\right\}$.
2. $|x - 1| + |x - 6| = x + 5$: nel secondo intervallo $x = 0$ si scarta; $S = \left\{\frac{2}{3}, 12\right\}$.

Distrattori: `fuori` (tutte le soluzioni degli intervalli, anche quelle fuori), `togliere` (avviso "Togliere le
sbarre senza guardare il segno": $A_1 + A_2 = R$), `opposti`, `vuoto`, `solo il minore`, `solo il maggiore`.

## Livello 7: disequazioni con un numero

$|ax + b| \lessgtr k$ con $a \in \{1, 2, 3, 4\}$ ($1$ metà delle volte), $b \neq 0$. Due casi:

- `k positivo` (70%): $k$ da $1$ a $9$, estremi $\frac{\pm k - b}{a}$ con denominatore fino a 4. Esempi 7 e 8.
  Distrattori: `scambiati` (interni ed esterni scambiati, cioè il verso opposto), `una sola` (solo
  $A \lessgtr k$, dimenticando l'altra disequazione), `estremi` (compresi al posto di esclusi e viceversa),
  `equazione` (i due punti di $|A| = k$), `scambiati ed estremi`.
- `k nullo o negativo` (30%): $k = 0$ metà delle volte, altrimenti da $-9$ a $-1$; la tabella della lezione. Le
  quattro opzioni sono le quattro risposte possibili attorno allo zero $r$ dell'argomento: $\emptyset$,
  $\mathbb{R}$, $\{r\}$, $\mathbb{R} \setminus \{r\}$ (etichette `tabella:<`, `tabella:>=`, `tabella:<=`,
  `tabella:>`, cioè le soluzioni di $|A| \lessgtr 0$), come chiede la nota ($\emptyset$ al posto di
  $\mathbb{R}$, $\mathbb{R}$ per $|x - 3| > 0$).

1. $|4x + 1| < 5$: $-5 < 4x + 1 < 5$, $-6 < 4x < 4$, $S = \left]-\frac{3}{2}, 1\right[$.
2. $|x - 8| \leq 0$: vale zero solo dove l'argomento vale zero, $S = \{8\}$.

## Livello 8: disequazioni di secondo grado

$|A(x)| \lessgtr k$ con $A$ di secondo grado e $k > 0$, costruita come il livello 2 (`pura` 60%, `completa` 40%).
La soluzione non è vuota né $\mathbb{R}$. Esempio 9. Passaggi: la doppia disequazione o l'unione, le due
disequazioni di secondo grado con la loro soluzione, "valori comuni" o "almeno una".

1. $|x^2 - 6| \leq 19$: $x^2 - 25 \leq 0$ e $x^2 + 13 \geq 0$ (ogni $x$), $S = [-5, 5]$.
2. $|x^2 + 5x - 1| \leq 5$: $-6 \leq x \leq 1$ e ($x \leq -4$ oppure $x \geq -1$), $S = [-6, -4] \cup [-1, 1]$.

Distrattori: `una sola` ($A \lessgtr k$, il $-3 < x < 3$ della nota), `altra sola` (l'altra disequazione),
`scambiati`, `estremi`, `equazione`, `scambiati ed estremi`. Un distrattore vuoto o uguale a $\mathbb{R}$ non si
usa.

## Livello 9: disequazioni con la x a secondo membro

$|A(x)| \lessgtr mx + n$. Due forme: `primo grado` (60%), $A = a_1x + b_1$ come al livello 4; `secondo grado`
(40%), $A$ e $B$ come al livello 5 (quattro zeri distinti di $A \mp B$). Punti critici con denominatore fino a 4;
la soluzione non è vuota né $\mathbb{R}$. Esempi 10 e 11.

1. $|3x + 1| \leq x + 1$: $3x + 1 \leq x + 1$ e $3x + 1 \geq -x - 1$, $S = \left[-\frac{1}{2}, 0\right]$.
2. $|x^2 + x - 5| > 4x + 5$: $-5 < x < 0$ oppure ($x < -2$ oppure $x > 5$), $S = \,\mathopen{]}-\infty, 0\mathclose{[}\, \cup \,\mathopen{]}5, +\infty\mathclose{[}$.

Distrattori: con $>$ e $\geq$ `intersezione` (avviso "Intersecare invece di unire", il $-4 < x < -1$ della
nota) e `condizione` (la soluzione con in più $B(x) \geq 0$, come chi porta la condizione delle equazioni nelle
disequazioni); con $<$ e $\leq$ `unione` (il sistema letto come unione); poi `scambiati`, `una sola`, `estremi`,
`equazione`, `scambiati ed estremi`.

## Esercizi "brutti" da evitare

- argomenti con un fattore comune ($|2x - 4| = 6$) ai livelli 1, 3, 4, 7, 9;
- trinomi sempre positivi dentro le sbarre ($|x^2 + 6| > 7x$): le sbarre non cambiano niente;
- soluzioni irrazionali: la lezione non ne ha, e gli esercizi restano sul valore assoluto;
- equazioni con un intervallo di soluzioni al livello 6 ($|x - 1| + |x + 2| = 3$);
- soluzioni vuote o $\mathbb{R}$ ai livelli 8 e 9, dove la domanda è sulle regole.

## Figure

Nessun livello ha una figura oggi. La vorrebbero soprattutto il livello 6 (la retta con i due zeri e i tre
intervalli, come la tabella dell'esempio 6, o le distanze da $1$ e da $-2$), i livelli 8 e 9 nei passaggi (le
righe delle due disequazioni e la riga $S$, come le figure degli esempi 9 e 11: strisce per il sistema, nessuna
striscia per l'unione) e il livello 7 (le figure dei valori interni ed esterni).

## Verifiche fatte

- `sample.mts valore-assoluto-equazioni 1000 all 1 | verify.py`: PASS; con il seed di partenza 50001: PASS.
- Esercizi diversi su 1.000 per livello (testo del problema, seed 1): livello 1: 623, livello 2: 254,
  livello 3: 709, livello 4: 791, livello 5: 379, livello 6: 921, livello 7: 796, livello 8: 589, livello 9: 938.
  I livelli 2 e 5 sono i più stretti: con soluzioni intere le equazioni pure e le coppie $A \mp B$ possibili
  sono poche.
- Quote dei casi su 1.000 (seed 1 e 50001): livello 1 `k positivo` 582 e 621, `k nullo` 209 e 193, `k negativo`
  209 e 186; livelli 2 e 8 `pura` 582 e 621; livello 4 `una scartata` 582 e 621, `tutte e due` 209 e 193,
  `nessuna` 209 e 186; livello 6 `numero` 622 e 585; livello 7 `k positivo` 686 e 730; livello 9 `primo grado`
  582 e 621. Posizione della risposta giusta: da 220 a 274 per posizione.
- `width.mts`: esce con 0; problema al massimo 239 px (livello 6), opzioni al massimo 230 px (livello 9).
- Errori piantati a mano, tutti bocciati dal controllo Python: risposta cambiata (livelli 1-6); indice della
  risposta giusta spostato (tutti); opzione giusta uguale a un distrattore (tutti); frazione non ridotta nella
  soluzione ($\frac{2}{8}$); livello 1 con la $x$ a secondo membro; livello 2 con $3x^2$; etichetta di un
  distrattore sbagliata (livelli 1, 7, 8, 9); ultimo passaggio sbagliato; due opzioni uguali; soluzione scartata
  tenuta (livelli 4 e 5); "accettata" cambiata in "scartata" nei passaggi del livello 6; parentesi rovesciata
  scritta senza `\mathopen`.
- `review.mts` esce con 0; `tsc` ed `eslint` senza errori nel generatore.

## Domande per la revisione

- Nove livelli invece dei soliti cinque-sette: va bene, o si preferisce dividere in due generatori (equazioni e
  disequazioni)?
- Livello 1, distrattore `opposti`: con $|2x - 1| = 5$ l'opzione $\{-3, 3\}$ ($\pm$ la soluzione di $A = k$).
  È un errore che si vede, o è meglio un altro?
- Livello 2 `pura` con tre soluzioni ($c - k = 0$, per esempio $|x^2 - 8| = 8$ con $S = \{-4, 0, 4\}$): lasciarle?
- Livello 5: le soluzioni sono sempre due su quattro candidati (vedi sopra). Si vuole anche il caso con $A + B$
  senza zeri, dove le soluzioni sono due o nessuna?
- Livello 6: solo somme di due valori assoluti con secondo membro numerico o di primo grado. Servono anche le
  differenze ($|x - 1| - |x + 2| = 1$) o un coefficiente davanti a un valore assoluto?
- Livello 7 con $k \leq 0$: le quattro opzioni sono sempre $\emptyset$, $\mathbb{R}$, $\{r\}$,
  $\mathbb{R} \setminus \{r\}$. Va bene che la domanda sia la stessa per $k = 0$ e per $k < 0$?
- Livello 9, distrattore `condizione`: la soluzione con $B(x) \geq 0$ aggiunto. La lezione dice che la condizione
  non serve, ma non lo segnala come errore in un avviso; è un distrattore giusto?
- Notazione: le opzioni delle disequazioni usano metà delle volte "oppure" e metà gli intervalli, come la 88. Va
  bene anche qui?
- Il tipo di risposta "unione di intervalli", che manca già a `disequazioni-secondo-grado`, servirebbe anche ai
  livelli 7-9.
